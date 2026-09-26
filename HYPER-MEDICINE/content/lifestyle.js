/* HYPER-MEDICINE · content/lifestyle.js — Healthy living: physical activity, a healthy diet,
 * smoking and tobacco, alcohol. Simulations in sims/prevention.js. */
Hyper.add(

/* ================================================================ PHYSICAL ACTIVITY */
{
  id: 'physical-activity', parent: 'lifestyle', title: 'Physical activity', level: 1,
  short: 'Any movement that uses energy, from walking to sport. Regular activity lowers the risk of heart disease, stroke, diabetes, several cancers, depression and falls, and the biggest gain comes from going from nothing to something.',
  keywords: ['physical activity', 'exercise', 'fitness', 'walking', 'MET', 'moderate intensity', 'vigorous intensity', 'WHO guidelines', '150 minutes', 'strength training', 'sedentary', 'sitting', 'steps', 'heart rate zone', 'Karvonen', 'maximum heart rate'],
  prereq: ['metabolism-energy', 'cardiac-output', 'physics:power'],
  related: ['energy-balance', 'obesity', 'hypertension', 'type2-diabetes', 'depression', 'bone-calcium', 'ageing', 'cancer-prevention'],
  body: `
Miriam is 58 and works at a desk. At a pharmacy check her blood pressure reads 148/92, and she decides to do something she has not done since school: exercise. She cannot face a gym, so she starts walking briskly for twenty minutes at lunchtime and gets off the bus a stop early. Three months later she walks thirty minutes most days, carries the shopping home and does a few squats and wall press-ups twice a week. Her home readings have come down by several mmHg, she sleeps better, and the stairs no longer leave her breathless. Nothing about it was heroic — and that is the point.

### What counts, and how hard
Physical activity is any movement of the muscles that uses energy: walking, cycling to work, gardening, housework, play and sport. Its intensity is measured in **METs** (metabolic equivalents): 1 MET is the energy used sitting quietly, about 1 kcal per kilogram of body weight per hour. **Moderate** activity is roughly 3–6 METs — brisk walking, easy cycling, doubles tennis — and in practice means you can talk but not sing. **Vigorous** activity is 6 METs or more — running, fast cycling, swimming lengths, football — and you can say only a few words before pausing for breath. A minute of vigorous activity counts about the same as two of moderate.

### What the guidelines say
The World Health Organization's 2020 guidelines turn the evidence into weekly targets:

| Who | Aerobic activity | Also |
|---|---|---|
| Children and adolescents (5–17) | an average of 60 minutes a day, moderate to vigorous | vigorous activity and muscle- and bone-strengthening on at least 3 days a week; less recreational screen time |
| Adults (18–64) | 150–300 minutes a week moderate, or 75–150 vigorous, or a mix | muscle-strengthening of all major muscle groups on 2 or more days |
| Adults 65 and over | as for adults | varied activity for balance and strength on 3 or more days, to prevent falls |
| Pregnancy and after birth | at least 150 minutes a week moderate, unless advised otherwise | a mix of aerobic and strengthening activity; gentle stretching |
| Long-term conditions or disability | as for adults, as far as each person is able | the same benefits apply |

Two messages in the same guidelines matter as much as the numbers: **some activity is better than none**, and **every minute counts** — the old rule that only bouts of ten minutes or more mattered was dropped. Sitting less helps too. By WHO estimates about a third of adults worldwide (31 % in 2022) and four adolescents in five do not reach these levels.

### What it does, and what the evidence shows
Regular activity trains the heart to pump more blood per beat, so the resting heart rate falls; it lets muscles take up glucose with less insulin; it lowers blood pressure and triglycerides and raises HDL cholesterol; it loads bones and keeps them dense; and it improves mood and sleep. Trials show these effects directly: aerobic training lowers systolic pressure by about 5–8 mmHg in people with [[hypertension|high blood pressure]], improves glucose control in [[type2-diabetes|type 2 diabetes]] and eases [[depression]], and exercise programmes for older people cut falls by about a quarter.

For long-term outcomes the evidence comes mostly from large cohort studies, and it has a striking shape. The risk of death falls steeply with the first hour or two a week, keeps falling more slowly up to about three to five times the minimum, and then levels off. In pooled data from several hundred thousand adults (2015), doing *less* than the recommended minimum was linked with a death rate about 20 % lower than doing nothing; meeting it, about 30 % lower; three to five times it, close to 40 %. Step-count studies (2022) show the same curve, levelling off at roughly 6,000–8,000 steps a day in people over 60 and 8,000–10,000 in younger adults. Because people who are already ill move less, such studies somewhat overstate the benefit, but the pattern is consistent across countries, diseases and methods.

> [!key] The biggest gain is from nothing to something: going from inactive to a daily 15–20 minute walk does more for health than going from one hour a day to two.

### Getting started
- Start where you are: a few 10-minute walks a week, then add minutes before intensity.
- Choose something you enjoy and can repeat — the best exercise is the one you keep doing.
- Build movement into the day: walk or cycle short trips, take the stairs, stand and move in breaks.
- Add strength twice a week: body-weight exercises, bands, weights, heavy gardening.
- Over 65, add balance: tai chi, dancing, standing on one leg while the kettle boils.
- With heart disease, diabetes or another long-term condition, ask a doctor or physiotherapist how to begin — for almost everyone the answer is "gradually", not "don't". [The medical calculators](#/tools/clinical/heart) work out heart-rate zones.

> [!warn] Stop and seek help if activity brings on chest pain or pressure, unusual breathlessness, a racing or irregular heartbeat, dizziness or fainting. Chest pain that does not settle within a few minutes of rest, or a collapse, is an emergency — call your local emergency number.
`,
  ideas: [
    'Intensity is measured in METs: moderate is about 3–6 (you can talk, not sing), vigorous 6 or more.',
    'WHO 2020: adults 150–300 minutes of moderate or 75–150 of vigorous activity a week, plus strength on 2 days; over 65s add balance.',
    'The dose–response curve is steepest at the start: some activity is much better than none, and every minute counts.',
    'Activity lowers blood pressure, improves insulin sensitivity, lifts mood, keeps bones strong and prevents falls.',
    'Cohort studies somewhat overstate the benefit, but trials confirm the effects on blood pressure, glucose, depression and falls.'
  ],
  pitfalls: [
    'Exercise only counts if it is long and hard — Any movement counts, bouts of any length add up, and the largest benefit per minute goes to people who were doing nothing.',
    'Older people should rest to stay safe — Strength and balance training in later life prevents falls and keeps people independent; inactivity is the bigger risk.',
    'You can out-exercise any diet — Activity burns less energy than most people think (a brisk 30-minute walk is roughly 100–150 kcal); it matters for health far beyond weight, but weight depends mostly on eating.'
  ],
  formulas: [
    {
      name: 'Energy used in an activity',
      expr: 'E = MET*m*t/60', tex: 'E = \\text{MET} \\times m \\times \\frac{t}{60}',
      vars: {
        E: { name: 'energy used (kcal)', tex: 'E' },
        MET: { name: 'intensity (METs)', value: 4, tex: '\\text{MET}' },
        m: { name: 'body mass', q: 'mass', unit: 'kg', value: 70 },
        t: { name: 'duration (minutes)', value: 30 }
      },
      note: '1 MET ≈ 1 kcal per kg per hour. This is the gross energy, including what the body burns at rest anyway; the extra is (MET − 1) × m × t/60. Brisk walking is about 4 METs, cycling to work 6–8, running at 10 km/h about 10.',
      practice: { unknowns: ['E', 't'] },
      stories: { E: 'A person of {m} walks briskly ({MET} METs) for {t} minutes. How much energy does the walk use, in kcal?', t: 'How many minutes at {MET} METs does a person of {m} need to use {E} kcal?' }
    },
    {
      name: 'Predicted maximum heart rate (Tanaka)',
      expr: 'HRmax = 208 - 0.7*age', tex: '\\text{HR}_{\\text{max}} = 208 - 0.7 \\times \\text{age}',
      vars: {
        HRmax: { name: 'predicted maximum heart rate (beats/min)', tex: '\\text{HR}_{\\text{max}}' },
        age: { name: 'age', q: 'years', unit: 'yr', value: 50, min: 0, max: 110, tex: '\\text{age}' }
      },
      note: 'An average for healthy adults (Tanaka, 2001); an individual\'s true maximum can differ by 10 beats a minute or more either way. The older "220 − age" gives similar values in midlife but underestimates in older people. Medicines such as beta-blockers lower the heart rate, so zones do not apply to people taking them.',
      stories: { HRmax: 'What is the predicted maximum heart rate at {age}?', age: 'At what age is the predicted maximum heart rate {HRmax} beats per minute?' }
    },
    {
      name: 'Target heart rate from the heart-rate reserve (Karvonen)',
      expr: 'HRt = HRr + I*(HRmax - HRr)', tex: '\\text{HR}_{\\text{target}} = \\text{HR}_{\\text{rest}} + I\\left(\\text{HR}_{\\text{max}} - \\text{HR}_{\\text{rest}}\\right)',
      vars: {
        HRt: { name: 'target heart rate', q: 'frequency', unit: 'bpm', tex: '\\text{HR}_{\\text{target}}' },
        HRr: { name: 'resting heart rate', q: 'frequency', unit: 'bpm', value: 70, tex: '\\text{HR}_{\\text{rest}}' },
        HRmax: { name: 'maximum heart rate', q: 'frequency', unit: 'bpm', value: 173, tex: '\\text{HR}_{\\text{max}}' },
        I: { name: 'intensity (share of the heart-rate reserve)', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 }
      },
      note: 'The reserve is the gap between resting and maximum rate. Roughly 40–60 % of it is moderate and 60–85 % vigorous. The talk test and how hard the effort feels work just as well for most people.',
      practice: { unknowns: ['HRt', 'I'] },
      stories: { HRt: 'Resting heart rate {HRr}, maximum {HRmax}. What heart rate corresponds to {I} of the reserve?', I: 'Resting {HRr}, maximum {HRmax}, and during a run the heart rate is {HRt}. What share of the reserve is that?' }
    }
  ],
  examples: [
    {
      title: 'Miriam\'s week',
      q: 'Miriam (70 kg) walks briskly, about 4 METs, for 30 minutes on 5 days a week and does strength exercises twice. Does she meet the WHO guideline, and how much energy do the walks use?',
      steps: [
        'Aerobic minutes: $5 \\times 30 = 150$ minutes of moderate activity — the bottom of the 150–300 range. With two strength sessions she meets the guideline.',
        'Activity volume: $150 \\text{ min} \\times 4 \\text{ METs} = 600$ MET-minutes, or 10 MET-hours, a week.',
        'Energy per walk: $E = 4 \\times 70 \\times 30/60 = 140$ kcal, of which $(4 - 1) \\times 70 \\times 0.5 = 105$ kcal is above resting.',
        'A week of walks: 700 kcal gross, about 525 kcal extra — worthwhile, but a reminder that the health benefits go far beyond the calories.'
      ],
      a: 'Yes — 150 minutes of moderate activity plus strength twice a week; the walks use about 700 kcal a week (525 kcal above resting).'
    },
    {
      title: 'Heart-rate zones at 60',
      q: 'A 60-year-old man with a resting heart rate of 64 wants to know what heart rates correspond to moderate (40–60 % of reserve) and vigorous (60–85 %) exercise.',
      steps: [
        'Predicted maximum: $208 - 0.7 \\times 60 = 166$ beats/min.',
        'Heart-rate reserve: $166 - 64 = 102$ beats/min.',
        'Moderate: $64 + 0.40 \\times 102 \\approx 105$ to $64 + 0.60 \\times 102 \\approx 125$ beats/min.',
        'Vigorous: $125$ to $64 + 0.85 \\times 102 \\approx 151$ beats/min.',
        'These are estimates: the talk test is a good check, and zones do not apply if he takes a heart-rate-lowering medicine.'
      ],
      a: 'Moderate about 105–125 beats/min, vigorous about 125–150 beats/min.'
    }
  ],
  quiz: [
    { q: 'Which change is likely to bring the largest health gain for the same extra time?', choices: ['from no activity to 60 minutes a week', 'from 150 to 210 minutes a week', 'from 300 to 360 minutes a week', 'from 600 to 660 minutes a week'], a: 0,
      why: 'The dose–response curve is steepest at the start: the first hour a week is linked with a larger fall in risk than any later hour.' },
    { q: 'Under the WHO 2020 guidelines, only bouts of activity lasting at least 10 minutes count towards the weekly total.', a: false,
      why: 'That rule was dropped in 2020: every minute of moderate or vigorous activity counts, and short bouts add up.' },
    { q: 'Using the Tanaka formula, what is the predicted maximum heart rate of a 40-year-old?', answer: 180, unit: 'bpm',
      why: '208 − 0.7 × 40 = 208 − 28 = 180 beats per minute — an average; individuals vary.' },
    { q: 'During a bike ride you can talk in full sentences but could not sing. The intensity is probably…', choices: ['light', 'moderate', 'vigorous', 'maximal'], a: 1,
      why: 'The talk test: talking but not singing is moderate; only a few words between breaths is vigorous.' },
    { q: 'What do the WHO guidelines add for people aged 65 and over?', choices: ['varied activity emphasising balance and strength on 3 or more days a week', 'avoiding any vigorous activity', 'only stretching', 'half the adult amount of aerobic activity'], a: 0,
      why: 'Older adults need the same aerobic activity as younger adults where they can, plus balance and strength training to prevent falls and keep function.' }
  ],
  applications: ['Cardiac and pulmonary rehabilitation after a heart attack or with COPD.', 'Exercise as part of the treatment of type 2 diabetes, high blood pressure and depression.', 'Falls-prevention programmes for older people.', 'Active-travel policies: safe walking and cycling routes to school and work.'],
  history: 'In 1953 Jerry Morris found that London bus conductors, who climbed the stairs of double-deckers all day, had fewer heart attacks than the drivers who sat — one of the first studies to link physical activity with heart disease.',
  sim: 'prev-activity-dose'
},

/* ================================================================ HEALTHY DIET */
{
  id: 'healthy-diet', parent: 'lifestyle', title: 'A healthy diet', level: 1,
  short: 'Plenty of vegetables, fruit, pulses, nuts and whole grains, fats mostly from plants and fish, and little salt, free sugar, processed meat and trans fat. The overall pattern matters more than any single food.',
  keywords: ['healthy diet', 'nutrition', 'salt', 'sodium', 'sugar', 'free sugars', 'fibre', 'whole grains', 'fruit and vegetables', 'saturated fat', 'trans fat', 'Mediterranean diet', 'processed meat', 'ultra-processed food', 'food label', 'supplements'],
  prereq: ['macronutrients', 'vitamins-minerals', 'energy-balance'],
  related: ['obesity', 'hypertension', 'cholesterol-lipids', 'type2-diabetes', 'gut-microbiome', 'cancer-prevention', 'eating-disorders', 'physical-activity'],
  body: `
Arjun is 44. His father had a heart attack at 60, and his own blood pressure and blood sugar have begun to creep up. The family eats well by its own lights — generous plates of white rice, fried snacks in the afternoon, sweet milky tea four times a day, pickles with everything — and nobody wants to give up food they love. What would actually make a difference?

Nutrition science is famous for headlines that contradict each other, but underneath them the main findings have been stable for decades. The **pattern** of a diet matters more than any single food or nutrient, and the healthy patterns — Mediterranean, Japanese, Nordic, South Asian vegetarian — share the same features: plenty of vegetables, fruit, pulses, nuts and whole grains; fish, dairy, eggs and poultry in moderation; little processed meat, salt, sugar and refined starch; and fats mostly from plant oils, nuts and fish rather than butter, ghee, fatty meat or hydrogenated oils.

### What the WHO recommends for adults
| Part of the diet | Target |
|---|---|
| Vegetables and fruit | at least 400 g a day (about five portions), not counting potatoes and other starchy roots |
| Fibre | at least 25 g a day, from whole grains, vegetables, fruit and pulses |
| Free sugars | less than 10 % of energy, ideally less than 5 % |
| Fats | less than 30 % of energy; saturated fat below 10 %, trans fat below 1 % |
| Salt | less than 5 g a day (about 2 g of sodium), and iodised |

**Free sugars** are those added by the manufacturer, the cook or you, plus the sugar in honey, syrups and fruit juice — not the sugar inside whole fruit, vegetables or milk. On 2,000 kcal a day, 10 % is 50 g, about twelve teaspoons; one can of sugary soft drink can hold 35 g.

### Why these, and how sure we are
*Salt* raises blood pressure. The world's average intake is about 11 g a day, more than twice the target, and the WHO links excess sodium to nearly two million deaths a year. Eating about 4–5 g less salt a day lowers systolic pressure by roughly 5 mmHg in people with high blood pressure and 2 mmHg in others, and in a large trial in rural China (2021) a potassium-enriched salt substitute cut strokes by about 14 %. Most salt comes from bread, processed and restaurant food, sauces and pickles rather than the salt cellar.

*Fats*: replacing saturated fat with unsaturated fat — not with refined starch or sugar — lowers LDL cholesterol and heart disease; industrial trans fats are harmful at any level, and many countries have banned them. The strongest trial of a whole diet, PREDIMED in Spain, found about 30 % fewer heart attacks, strokes and cardiovascular deaths on a Mediterranean diet rich in olive oil or nuts than with advice to eat less fat.

*Whole grains, fibre, vegetables and fruit* go with less heart disease, type 2 diabetes and bowel cancer in cohort studies, and fibre feeds the [[gut-microbiome|gut microbes]]. *Processed meat* (bacon, ham, sausages) is classed by the WHO's cancer agency as a cause of bowel cancer — each 50 g eaten daily raises the risk by about 18 % — and red meat as a probable one. *Ultra-processed foods* are linked with obesity, diabetes and earlier death, and in one controlled feeding study people ate about 500 kcal a day more on an ultra-processed diet; but the evidence is mostly observational and the definition is debated, so the fair conclusion is "more minimally processed food", not a list of forbidden products.

The Global Burden of Disease study linked poor diet to about 11 million deaths in 2017 — more than tobacco — led by too much salt, too few whole grains and too little fruit. Such estimates are modelled and uncertain, but they show the scale.

> [!note] Most people who eat a varied diet do not need vitamin pills, and large trials of supplements in well-fed people have mostly found no benefit — beta-carotene even raised lung cancer in smokers. There are real exceptions, such as folic acid before and in early pregnancy, vitamin D for some groups and vitamin B12 for vegans: a doctor or pharmacist can say what applies to you.

### Practical steps
- Fill half the plate with vegetables and fruit, a quarter with whole grains and a quarter with protein, leaning to pulses, fish, poultry and nuts.
- Drink water; keep sugary drinks and juice occasional.
- Cook more often, taste before salting, and read labels for salt, sugar and saturated fat.
- Swap rather than ban: brown rice or millet for part of the white rice, nuts for fried snacks, a little less sugar in the tea each week.
- Keep what matters to you: almost every cuisine has a healthy version.

For Arjun's family the biggest gains would come from less salt and sugar, more whole grains, vegetables and pulses, and less oil — not from any "superfood". [[energy-balance|Energy balance]] decides weight; [[macronutrients]] and [[vitamins-minerals|vitamins and minerals]] explain the parts. If food, eating or weight feel out of control, [[eating-disorders|eating disorders]] are common and treatable — talk to a doctor.
`,
  ideas: [
    'The overall pattern of a diet matters more than any single food or nutrient.',
    'WHO targets: at least 400 g of vegetables and fruit and 25 g of fibre a day; free sugars under 10 % of energy; salt under 5 g.',
    'Replace saturated and trans fats with unsaturated fats, not with sugar or refined starch.',
    'Salt raises blood pressure; most of it is hidden in bread, processed and restaurant food.',
    'Much nutrition evidence is observational; the strongest trials (PREDIMED, salt substitutes, DASH) support the same pattern.'
  ],
  pitfalls: [
    'Supplements can make up for a poor diet — Trials of vitamin pills in well-fed people mostly show no benefit and some show harm; foods bring fibre and thousands of compounds that pills do not.',
    'Fruit juice is as good as fruit — The sugar in juice counts as free sugar and most of the fibre is lost; whole fruit is more filling and better for teeth and blood sugar.',
    'All fat is bad — The type matters: unsaturated fats from olive oil, nuts and fish protect the heart; trans fats harm it; replacing fat with sugar does not help.'
  ],
  formulas: [
    {
      name: 'Salt from sodium',
      expr: 'salt = 2.54*Na', tex: 'm_{\\text{salt}} = 2.54 \\times m_{\\text{Na}}',
      vars: {
        salt: { name: 'mass of salt (sodium chloride)', q: 'mass', unit: 'g', tex: 'm_{\\text{salt}}' },
        Na: { name: 'mass of sodium', q: 'mass', unit: 'mg', value: 800, tex: 'm_{\\text{Na}}' }
      },
      note: 'Salt is sodium chloride; sodium is 22.99 of its 58.44 g/mol, so 1 g of sodium comes with 2.54 g of salt. Labels in some countries give sodium, in others salt.',
      stories: { salt: 'A soup label lists {Na} of sodium per serving. How much salt is that?', Na: 'A ready meal contains {salt} of salt. How much sodium is that?' }
    },
    {
      name: 'Share of energy from free sugars',
      expr: 'p = 4*S/E', tex: 'p = \\frac{4\\, S}{E}',
      vars: {
        p: { name: 'share of energy from free sugars', q: 'ratio', unit: '%' },
        S: { name: 'free sugars eaten (g/day)', value: 60 },
        E: { name: 'total energy intake (kcal/day)', value: 2000 }
      },
      note: 'Sugar gives about 4 kcal per gram. The WHO advises keeping free sugars below 10 % of energy, and below 5 % for extra benefit.',
      practice: { unknowns: ['p', 'S'] },
      stories: { p: 'Someone eating {E} kcal a day takes in {S} g of free sugars. What share of their energy is that?', S: 'On {E} kcal a day, how many grams of free sugars make up {p} of energy?' }
    }
  ],
  examples: [
    {
      title: 'Reading a label',
      q: 'A ready meal lists 1.2 g of sodium per pack. How much salt is that, and what share of the WHO limit of 5 g a day?',
      steps: [
        'Salt $= 2.54 \\times 1.2 \\text{ g} \\approx 3.05$ g.',
        'Share of the limit: $3.05/5 \\approx 61\\,\\%$.',
        'One meal uses most of the day\'s allowance before bread, sauces or snacks are counted.'
      ],
      a: 'About 3 g of salt, some 60 % of the daily limit.'
    },
    {
      title: 'A day\'s free sugars',
      q: 'In a day someone drinks a can of sugary soft drink (35 g of sugar), eats a sweetened yoghurt (12 g), has four teaspoons of sugar in tea (4 g each) and a glass of orange juice (18 g). On 2,000 kcal a day, what share of energy comes from free sugars?',
      steps: [
        'Total free sugars: $35 + 12 + 16 + 18 = 81$ g — the juice counts, the sugar naturally in the milk of the yoghurt would not.',
        'Energy from them: $81 \\times 4 = 324$ kcal.',
        'Share: $324/2000 \\approx 16\\,\\%$ — well above the 10 % limit; dropping the soft drink alone brings it to about 9 %.'
      ],
      a: 'About 16 % of energy, against a target below 10 %.'
    }
  ],
  quiz: [
    { q: 'Which of these counts as a free sugar?', choices: ['the sugar inside a whole apple', 'the lactose in plain milk', 'the sugar in fruit juice', 'the starch in bread'], a: 2,
      why: 'Free sugars are added sugars plus those in honey, syrups and juices. Sugars within intact fruit, vegetables and milk are not counted.' },
    { q: 'A soup label says 0.8 g of sodium per serving. How much salt is that?', answer: 2.03, unit: 'g',
      why: '2.54 × 0.8 g ≈ 2.0 g of salt — about 40 % of the 5 g daily limit in one bowl.' },
    { q: 'A diet low in total fat is the best-proven way to prevent heart disease.', a: false,
      why: 'The type of fat matters more than the amount: in PREDIMED a Mediterranean diet rich in olive oil or nuts beat advice to eat less fat, and replacing fat with sugar or refined starch brings no benefit.' },
    { q: 'Which dietary change has been shown in a large randomised trial to reduce strokes?', choices: ['a potassium-enriched salt substitute', 'vitamin E capsules', 'beta-carotene supplements', 'a juice "detox"'], a: 0,
      why: 'In the 2021 salt-substitute trial in China strokes fell by about 14 %. Trials of vitamin E and beta-carotene found no benefit (beta-carotene raised lung cancer in smokers), and "detox" diets have no evidence.' },
    { q: 'The evidence that ultra-processed foods harm health comes mainly from…', choices: ['observational studies, plus a few small feeding trials', 'many large long-term randomised trials', 'animal studies only', 'there is no evidence either way'], a: 0,
      why: 'Cohort studies link them to obesity, diabetes and earlier death, and a controlled feeding study showed people eat more on them; but long-term trials are lacking, so the conclusion is cautious.' }
  ],
  applications: ['Salt-reduction programmes that reformulate bread and processed food.', 'Taxes on sugary drinks and bans on industrial trans fats.', 'Front-of-pack food labels and school meal standards.', 'Dietary advice in the treatment of high blood pressure, diabetes and high cholesterol.']
},

/* ================================================================ SMOKING */
{
  id: 'smoking', parent: 'lifestyle', title: 'Smoking and tobacco', level: 1,
  short: 'Tobacco smoke causes cancers, COPD, heart attacks and strokes and kills up to half of long-term smokers. Nicotine makes it addictive; stopping helps at any age, and support plus medicines multiplies the chance of success.',
  keywords: ['smoking', 'tobacco', 'cigarettes', 'nicotine', 'pack-years', 'quitting', 'stop smoking', 'nicotine replacement', 'varenicline', 'cytisine', 'bupropion', 'e-cigarettes', 'vaping', 'second-hand smoke', 'lung cancer', 'COPD', 'carbon monoxide'],
  prereq: ['respiratory-system', 'addiction', 'what-is-cancer', 'atherosclerosis'],
  related: ['copd', 'common-cancers', 'cancer-screening', 'heart-attack', 'stroke', 'lung-function-tests', 'cancer-prevention', 'pregnancy'],
  body: `
David lit his first cigarette at 16. At 45 he smokes a pack a day, coughs every morning and has tried to stop four times; each time the cravings and irritability won within a week. He assumes the damage is done and that stopping now would hardly matter. On both counts the evidence says otherwise.

### What smoke does
Tobacco smoke carries about 7,000 chemicals, some 70 of them known to cause cancer. **Nicotine** is why people keep smoking: it reaches the brain within seconds of a puff and releases dopamine in the reward pathway, and within weeks the brain adapts so that without it a smoker feels restless, low and unable to concentrate — [[addiction]], not a lack of willpower. The harm comes mostly from the rest of the smoke. **Carbon monoxide** binds [[oxygen-transport|haemoglobin]] about 200 times more tightly than oxygen, so the blood carries less oxygen. **Tar** paralyses the cilia that sweep the airways clean and inflames the small airways and alveoli, leading to [[copd|COPD]]. Oxidants and inflammation injure artery linings and make blood clot more easily, driving [[atherosclerosis]], [[heart-attack|heart attacks]] and [[stroke]]. The carcinogens mutate DNA in the lung, mouth, throat, oesophagus, bladder, pancreas, kidney, cervix and elsewhere — at least fifteen kinds of cancer.

### How big the risk is
Tobacco kills more than 8 million people a year worldwide, about 1.3 million of them non-smokers breathing other people's smoke (WHO estimates, early 2020s). Up to half of long-term smokers are killed by it, on average about ten years early. Lung cancer risk rises with the number smoked and even more with the years of smoking, so doctors count **pack-years**:

$$\\text{pack-years} = \\frac{\\text{cigarettes per day}}{20} \\times \\text{years smoked}$$

Waterpipes, cigars, pipes, bidis and smokeless tobacco — chewed or held in the mouth, common in South Asia — are not safe alternatives; smokeless tobacco causes mouth and oesophageal cancer. Smoking in pregnancy raises the risk of miscarriage, low birth weight and sudden infant death, and second-hand smoke gives children asthma attacks and ear infections.

### Stopping works at any age
A fifty-year study of British doctors found that those who stopped at about 30 avoided almost all the excess risk, and those who stopped at about 40, 50 or 60 gained roughly 9, 6 and 3 years of life. Recovery starts quickly:

| After stopping | What changes (approximate) |
|---|---|
| 20 minutes to a day | heart rate and blood pressure fall; carbon monoxide returns to normal |
| 2–12 weeks | circulation and lung function improve |
| 1–9 months | coughing and breathlessness decrease |
| 1 year | the extra risk of coronary heart disease is about half a smoker's |
| 5–15 years | stroke risk approaches a never-smoker's |
| 10 years | the lung cancer death rate is about half a continuing smoker's |

Lung function already lost does not come back, but after stopping it declines at about a never-smoker's pace — the difference between disabling breathlessness at 65 and a normal old age.

### The help that works
Most people try several times before they stop for good, and each attempt teaches something. Unaided attempts succeed long-term only about 3–5 % of the time; support multiplies the chances:

- **Behavioural support** — a stop-smoking service, quitline, counsellor or text-message programme — helps plan for cravings and triggers.
- **Nicotine replacement** (patches, gum, lozenges, sprays, inhalators) supplies nicotine without the smoke; a patch plus a fast-acting form works better than either alone.
- **Varenicline** and **cytisine** partly stimulate and partly block the brain's nicotine receptor, easing withdrawal and blunting the reward of a cigarette; **bupropion**, an antidepressant, reduces craving. The WHO's 2024 guideline recommends all of them alongside behavioural support.
- **Nicotine e-cigarettes** helped more people stop than nicotine replacement in randomised trials (Cochrane review, 2024). They are far less harmful than smoking but not harmless, their long-term effects are unknown, they are not for young people or non-smokers, and countries differ widely — some promote them as a quitting aid, others restrict or ban them.

Medicine plus support roughly doubles or triples the chance of success compared with willpower alone; a pharmacist, doctor or national quitline can say what is available locally. A gain of a few kilograms after stopping is common and far less harmful than smoking.

> [!warn] Chest pain or pressure, sudden breathlessness, coughing up more than a streak of blood, or sudden weakness, a drooping face or trouble speaking are emergencies — call your local emergency number.

> [!key] See a doctor soon for a cough lasting more than three weeks, blood in the phlegm, hoarseness that does not go away or unexplained weight loss. Current and former heavy smokers may be offered [[cancer-screening|lung cancer screening]].
`,
  ideas: [
    'Nicotine causes the addiction; carbon monoxide, tar, oxidants and carcinogens cause the disease.',
    'Tobacco kills more than 8 million people a year and up to half of long-term smokers, about ten years early.',
    'Pack-years = cigarettes a day ÷ 20 × years smoked; duration matters more than the daily number.',
    'Stopping helps at any age: before 40 it avoids most of the excess risk, and even at 60 it gains years.',
    'Behavioural support plus medicines (nicotine replacement, varenicline, cytisine, bupropion) doubles or triples the chance of stopping.'
  ],
  pitfalls: [
    'After decades of smoking the damage is done, so stopping is pointless — Heart and stroke risk start falling within a year, lung function stops declining fast, and people who stop even at 60 live about three years longer on average.',
    'Needing several attempts means failure — Most successful ex-smokers tried several times; each attempt raises the chance that the next one lasts.',
    '"Light", menthol or rolled cigarettes are safer — People who switch to them inhale more deeply to get their nicotine; the harm is similar.'
  ],
  formulas: [
    {
      name: 'Pack-years',
      expr: 'PY = n/20*Y', tex: '\\text{PY} = \\frac{n}{20} \\times Y',
      vars: {
        PY: { name: 'pack-years', tex: '\\text{PY}' },
        n: { name: 'cigarettes smoked per day', value: 15 },
        Y: { name: 'years smoked', q: 'years', unit: 'yr', value: 34 }
      },
      note: 'One pack-year is 20 cigarettes a day for a year. Lung cancer screening in the US (2021 recommendation) is offered to people aged 50–80 with at least 20 pack-years who smoke or stopped within 15 years; other countries use different criteria or risk calculators.',
      practice: { unknowns: ['PY', 'Y'] },
      stories: { PY: 'Someone smoked {n} cigarettes a day for {Y}. How many pack-years is that?', Y: 'A smoker has {PY} pack-years at {n} cigarettes a day. For how long have they smoked?' }
    },
    {
      name: 'Keeping trying: the chance of success over several attempts',
      expr: 'P = 1 - (1 - p)^k', tex: 'P = 1 - (1 - p)^{k}',
      vars: {
        P: { name: 'chance of having stopped for good after k attempts', q: 'ratio', unit: '%' },
        p: { name: 'chance that one attempt succeeds', q: 'ratio', unit: '%', value: 15, min: 0.1, max: 99 },
        k: { name: 'number of attempts', value: 5, int: true, min: 1, max: 50 }
      },
      note: 'An illustration that assumes each attempt has the same, independent chance. Real attempts are not independent — people learn, or relapse for the same reasons — but the lesson holds: repeated, supported attempts add up.',
      practice: { unknowns: ['P'] },
      stories: { P: 'With support, each attempt to stop has a {p} chance of lasting. What is the chance of having stopped after {k} attempts?' }
    }
  ],
  examples: [
    {
      title: 'Pack-years and screening',
      q: 'A 52-year-old woman has smoked 15 cigarettes a day since she was 18. How many pack-years is that, and would she meet the 2021 US criteria to discuss lung cancer screening?',
      steps: [
        'Years smoked: $52 - 18 = 34$.',
        'Pack-years: $15/20 \\times 34 = 25.5$.',
        'US criteria: aged 50–80, at least 20 pack-years, smoking now or stopped within 15 years — she meets all three.',
        'Screening (a yearly low-dose CT scan) has benefits and harms to discuss with a doctor; the single most effective step for her lungs is still to stop smoking.'
      ],
      a: '25.5 pack-years; she meets the US criteria to discuss screening.'
    },
    {
      title: 'Why keep trying',
      q: 'David\'s four unaided attempts failed. With a stop-smoking service and medicine, suppose each attempt has a 15 % chance of lasting a year. What is the chance he has stopped after three such attempts? After five?',
      steps: [
        'The chance that one attempt fails: $1 - 0.15 = 0.85$.',
        'Three attempts all failing: $0.85^3 \\approx 0.61$, so success $\\approx 39\\,\\%$.',
        'Five attempts: $1 - 0.85^5 \\approx 1 - 0.44 = 56\\,\\%$.',
        'Compared with about 3–5 % per unaided attempt, support changes the odds — and persistence does the rest.'
      ],
      a: 'About 39 % after three supported attempts and 56 % after five (an idealised model).'
    }
  ],
  quiz: [
    { q: 'Which component of tobacco smoke is chiefly responsible for addiction?', choices: ['nicotine', 'tar', 'carbon monoxide', 'benzene'], a: 0,
      why: 'Nicotine acts on receptors in the brain\'s reward pathway; the others cause most of the disease but not the dependence.' },
    { q: 'Someone smoked 10 cigarettes a day for 40 years. How many pack-years is that?', answer: 20,
      why: '10/20 × 40 = 20 pack-years.' },
    { q: 'Stopping smoking at 60 makes no difference to life expectancy.', a: false,
      why: 'In the British doctors study people who stopped at about 60 gained around three years of life on average, and heart risk falls within a year at any age.' },
    { q: 'Which approach gives the best chance of stopping for good?', choices: ['willpower alone', 'cutting down slowly with no help', 'a stop-smoking medicine plus behavioural support', 'switching to lighter cigarettes'], a: 2,
      why: 'Combining medicine (nicotine replacement, varenicline, cytisine or bupropion) with support roughly doubles to triples success compared with unaided attempts.' },
    { q: 'After a smoker with damaged lungs stops, their lung function typically…', choices: ['recovers fully to normal', 'keeps falling at a smoker\'s rate', 'stops falling fast and declines at about a never-smoker\'s rate', 'improves steadily for life'], a: 2,
      why: 'Lost function does not return, but the steep decline caused by smoking slows to the normal age-related pace — the classic Fletcher–Peto picture.' }
  ],
  applications: ['Stop-smoking services, quitlines and text-message programmes.', 'Tobacco taxes, smoke-free laws, plain packaging and advertising bans (the WHO Framework Convention on Tobacco Control, 2005).', 'Lung cancer screening for heavy smokers.', 'Asking about smoking in every medical consultation and offering help.'],
  history: 'In 1950 Richard Doll and Austin Bradford Hill in Britain, and Ernst Wynder and Evarts Graham in the United States, showed that lung cancer patients were far more often heavy smokers; Doll and Hill\'s study of British doctors, begun in 1951, followed its participants for fifty years.',
  sim: 'prev-lung-function'
},

/* ================================================================ ALCOHOL */
{
  id: 'alcohol', parent: 'lifestyle', title: 'Alcohol', level: 2,
  short: 'Alcohol is ethanol, whatever the drink. Its harms — liver disease, injuries, high blood pressure and at least seven cancers — rise with the amount, and no level is free of cancer risk. Standard drinks, blood alcohol and the help that works.',
  keywords: ['alcohol', 'ethanol', 'standard drink', 'unit of alcohol', 'ABV', 'blood alcohol', 'BAC', 'Widmark', 'binge drinking', 'alcohol and cancer', 'alcohol poisoning', 'hangover', 'drink driving', 'alcohol use disorder', 'naltrexone', 'acamprosate'],
  prereq: ['liver-function', 'pharmacokinetics', 'addiction'],
  related: ['liver-disease', 'hypertension', 'arrhythmias', 'common-cancers', 'cancer-prevention', 'pregnancy', 'poisoning-overdose', 'depression'],
  body: `
Sofia, 52, has "a couple of glasses of wine" most evenings to unwind. The glasses at home are large and generously filled, so it is closer to half a bottle a night, five nights a week. She has read that red wine is good for the heart. When her doctor asks her to count, it comes to about 190 g of alcohol — 24 UK units — a week. What does that mean for her health?

### A drink is an amount of ethanol
Every alcoholic drink contains the same molecule, [[chemistry:functional-groups|ethanol]], and what matters is how much of it you take, not what it comes in. The grams of ethanol in a drink are its volume × its strength (% alcohol by volume, ABV) × the density of ethanol, 0.789 g/mL. A **standard drink** is a fixed amount of ethanol, but countries define it differently:

| Country (year of guidance) | Standard drink | Guidance for adults |
|---|---|---|
| United Kingdom (2016) | 1 unit = 8 g | no more than 14 units a week, spread over 3 or more days, with drink-free days |
| Australia (2020) | 10 g | no more than 10 standard drinks a week and 4 on any one day |
| Canada (2023) | 13.45 g | a continuum: 2 or fewer a week low risk, 3–6 moderate, 7 or more increasingly high |
| United States (2020–2025 dietary guidelines) | 14 g | if drinking, up to 2 a day for men and 1 for women; less is better |

All agree: none in pregnancy, none before driving, and less is better — and guidance is revised every few years, lately always towards less. A large (250 mL) glass of 13 % wine holds about 26 g — more than three UK units — and a pint of 5 % beer about 22 g.

### What the evidence shows
Ethanol is broken down mainly in the [[liver-function|liver]], first to **acetaldehyde**, which is toxic and damages DNA, then to acetate. The liver clears a roughly fixed amount per hour — about 5–10 g for an adult, half to one standard drink — and nothing speeds it up: not coffee, a cold shower or sleep.

The harms rise with the amount. Alcohol causes [[liver-disease|liver disease]], pancreatitis, high blood pressure, atrial fibrillation, heart-muscle damage, injuries and violence, and at least seven cancers — mouth, throat, larynx, oesophagus, liver, bowel and breast. The WHO's cancer agency classes it with tobacco as a Group 1 carcinogen. Breast cancer risk rises by roughly 7–10 % for each 10 g a day, and about 4 % of the world's new cancers in 2020 were attributed to drinking. No safe threshold has been found for cancer — in 2023 the WHO stated that no level of drinking is safe for health — although the risk at low intake is small. The WHO estimates that alcohol causes about 2.6 million deaths a year (2019 data).

What about the heart? Older studies found that moderate drinkers had less heart disease than non-drinkers — the "J-shaped curve". Much of that is now put down to bias: the "non-drinkers" included people who had stopped because they were already ill, and moderate drinkers tend to be wealthier and healthier in other ways. Studies that correct for this, and genetic studies, find little or no protection. The question is not fully settled, but no health body advises starting to drink for health.

> [!key] Risk rises with every drink. There is no amount free of cancer risk, and less is better at every level.

### Blood alcohol
The concentration in the blood depends on the grams drunk, body size, body water, food and time. Widmark's formula (1932) gives a rough estimate,

$$C = \\frac{A}{r\\, m} - \\beta\\, t$$

with $A$ the grams of alcohol, $m$ the body mass in kg, $r$ the share of the body the alcohol spreads through (on average about 0.68 in men and 0.55 in women, because of differences in body water), $\\beta$ the rate of removal (about 0.15 g/kg per hour) and $C$ in grams per kilogram (‰, close to g/L). It is for learning only: people differ widely, food and absorption change the curve, and no formula can tell whether someone is fit to drive. Impairment starts well below every legal limit; the only safe amount before driving is none.

> [!warn] Alcohol poisoning can kill. Warning signs: confusion, vomiting while drowsy, seizures, slow or irregular breathing, pale or bluish skin, low body temperature, or being impossible to wake. Do not leave the person to "sleep it off": lay them on their side if they are breathing, stay with them, and call your local emergency number.

### Cutting down and getting help
Counting is the first step; many people are surprised by their weekly total. Drink-free days, smaller glasses, alternating with water and not keeping alcohol at home all help, and the WHO's AUDIT questionnaire is a quick self-check. When drinking has become hard to control, treatment works: talking therapies, mutual-help groups, and medicines — **acamprosate**, which calms the brain's glutamate signalling; **naltrexone** and **nalmefene**, which block opioid receptors and blunt the reward of drinking; and **disulfiram**, which makes drinking unpleasant by stopping the breakdown of acetaldehyde. See [[addiction]].

> [!note] Someone who drinks heavily every day should not stop suddenly without medical advice: withdrawal can cause seizures and confusion (delirium tremens), and a supervised withdrawal is safer.
`,
  ideas: [
    'All drinks contain the same ethanol: grams = volume × ABV × 0.789 g/mL.',
    'Standard drinks differ between countries, from 8 g (a UK unit) to 14 g (the US).',
    'Harms rise with the amount; alcohol causes at least seven cancers, and no level is free of cancer risk.',
    'The liver removes a roughly fixed 5–10 g an hour; only time lowers blood alcohol.',
    'Talking therapies, mutual help and medicines (acamprosate, naltrexone, nalmefene, disulfiram) help people drink less or stop.'
  ],
  pitfalls: [
    'Beer and wine are safer than spirits — The ethanol is the same molecule; what counts is the grams, and a pint of beer or a large glass of wine holds more than a single measure of spirits.',
    'Being able to "hold your drink" means less harm — Tolerance means the brain has adapted, a step towards dependence; the liver, heart and other organs take the same dose.',
    'Moderate drinking is good for the heart — The apparent protection in older studies is now largely attributed to bias; no health body recommends drinking for health.'
  ],
  formulas: [
    {
      name: 'Grams of alcohol in a drink',
      expr: 'A = V*ABV*rho', tex: 'A = V \\times \\text{ABV} \\times \\rho',
      vars: {
        A: { name: 'mass of ethanol', q: 'mass', unit: 'g' },
        V: { name: 'volume of the drink', q: 'volume', unit: 'mL', value: 175 },
        ABV: { name: 'strength (alcohol by volume)', q: 'ratio', unit: '%', value: 13, min: 0, max: 100, tex: '\\text{ABV}' },
        rho: { name: 'density of ethanol', q: 'density', unit: 'g/mL', value: 0.789, fixed: true, tex: '\\rho' }
      },
      note: 'ABV is the share of the volume that is ethanol, as printed on the label.',
      practice: { unknowns: ['A', 'V'] },
      stories: { A: 'A glass holds {V} of wine at {ABV}. How many grams of alcohol is that?', V: 'How much beer at {ABV} contains {A} of alcohol?' }
    },
    {
      name: 'Number of standard drinks',
      expr: 'N = A/G', tex: 'N = \\frac{A}{G}',
      vars: {
        N: { name: 'number of standard drinks' },
        A: { name: 'mass of ethanol', q: 'mass', unit: 'g', value: 22.4 },
        G: { name: 'grams per standard drink in your country', q: 'mass', unit: 'g', value: 8 }
      },
      note: 'G is 8 g for a UK unit, 10 g in Australia, New Zealand and the WHO\'s own convention, 13.45 g in Canada and 14 g in the US.',
      stories: { N: 'A pint of beer contains {A} of alcohol. How many standard drinks is that where a standard drink is {G}?' }
    },
    {
      name: 'Blood alcohol estimate (Widmark)',
      expr: 'C = A/(r*m) - beta*t', tex: 'C = \\frac{A}{r\\, m} - \\beta\\, t',
      vars: {
        C: { name: 'blood alcohol (g/kg, ‰)' },
        A: { name: 'alcohol drunk (g)', value: 36 },
        r: { name: 'Widmark factor (share of body water)', value: 0.55, min: 0.4, max: 0.9 },
        m: { name: 'body mass (kg)', value: 60 },
        beta: { name: 'elimination rate (‰ per hour)', value: 0.15, tex: '\\beta' },
        t: { name: 'hours since drinking began', value: 3 }
      },
      note: 'For learning only — never a guide to whether someone can drive. It assumes all the alcohol is absorbed at once; people vary widely (r about 0.5–0.8, β about 0.10–0.25). 1 ‰ ≈ 1 g/L ≈ 0.1 % BAC. Solving for t with C = 0 gives the time to clear the alcohol.',
      practice: { unknowns: ['C', 't'] },
      stories: { C: 'An adult of {m} kg (r = {r}) quickly drinks {A} g of alcohol. Removing {beta} ‰ an hour, estimate the blood alcohol in ‰ {t} hours later.', t: 'After quickly drinking {A} g of alcohol, an adult of {m} kg (r = {r}, removing {beta} ‰ an hour) is estimated at {C} ‰. How many hours have passed?' }
    }
  ],
  examples: [
    {
      title: 'Counting Sofia\'s week',
      q: 'Sofia drinks half a bottle (375 mL) of 13 % wine on five evenings a week. How many grams of alcohol is that, and how many UK units, Australian standard drinks and US drinks?',
      steps: [
        'Per evening: $375 \\times 0.13 \\times 0.789 \\approx 38.5$ g.',
        'Per week: $5 \\times 38.5 \\approx 192$ g.',
        'UK units (8 g): $192/8 = 24$ — well above the 14-unit guideline. Australian standard drinks (10 g): about 19, against a guideline of 10. US drinks (14 g): about 14, two a day on drinking days.',
        'Cutting to a normal 125 mL glass on three evenings a week would bring her to about 38 g — under 5 UK units.'
      ],
      a: 'About 190 g a week: 24 UK units, 19 Australian or 14 US standard drinks.'
    },
    {
      title: 'The morning after',
      q: 'A 60 kg woman (r = 0.55) drinks two 175 mL glasses of 13 % wine late in the evening, about 36 g. Using Widmark\'s formula, roughly what peak blood alcohol could she reach, and how long does it take to fall to zero at 0.15 ‰ an hour?',
      steps: [
        'Peak, if all absorbed: $36/(0.55 \\times 60) \\approx 1.09$ ‰ — about 0.11 % BAC.',
        'Time to clear: $1.09/0.15 \\approx 7.3$ hours.',
        'If she finished drinking at midnight, some alcohol would still be in her blood around 7 a.m. — sleep does not speed its removal.',
        'The same drinks in an 80 kg man (r = 0.68) give about 0.66 ‰, cleared in about 4.4 hours: the same drinks affect people very differently.'
      ],
      a: 'Up to about 1.1 ‰, taking around 7 hours to clear — an educational estimate, not a guide to driving.'
    }
  ],
  quiz: [
    { q: 'Which drink contains the most alcohol?', choices: ['a pint (568 mL) of 5 % beer', 'a 175 mL glass of 13 % wine', 'a 50 mL measure of 40 % spirit', 'a 330 mL bottle of 4.5 % cider'], a: 0,
      why: 'Grams = volume × ABV × 0.789: beer 22.4 g, wine 18.0 g, spirit 15.8 g, cider 11.7 g.' },
    { q: 'Black coffee, a cold shower or a few hours of sleep speed up the removal of alcohol from the blood.', a: false,
      why: 'The liver removes alcohol at a roughly fixed rate. Coffee may make someone feel more alert, but the blood alcohol falls no faster.' },
    { q: 'Why did older studies suggest that moderate drinkers had less heart disease?', choices: ['alcohol dissolves plaque in arteries', 'the non-drinker group included people who had stopped because of illness, and moderate drinkers differed in other ways', 'red wine contains enough antioxidants to protect the heart', 'moderate drinkers exercise the liver'], a: 1,
      why: 'Sick former drinkers and confounding by wealth and lifestyle made non-drinkers look worse; corrected and genetic studies find little or no protection.' },
    { q: 'How many grams of alcohol are in a 330 mL bottle of 5 % beer?', answer: 13.0, unit: 'g',
      why: '330 × 0.05 × 0.789 ≈ 13.0 g — about 1.6 UK units or 1.3 Australian standard drinks.' },
    { q: 'Drinking alcohol raises the risk of breast cancer.', a: true,
      why: 'Breast cancer is one of at least seven cancers caused by alcohol; the risk rises by roughly 7–10 % for each 10 g a day.' }
  ],
  applications: ['Minimum unit pricing and alcohol taxes (Scotland introduced minimum pricing in 2018).', 'Drink-driving limits and random breath testing.', 'Brief advice in primary care, using the AUDIT questionnaire.', 'Cancer warning labels on alcoholic drinks (Ireland legislated for them in 2023).'],
  history: 'The Swedish chemist Erik Widmark described in 1932 how blood alcohol rises and falls, and devised the formula still used in forensic estimates; his measurements helped found scientific drink-driving laws.',
  sim: 'prev-alcohol'
}

);
