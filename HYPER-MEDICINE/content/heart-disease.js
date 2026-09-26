/* HYPER-MEDICINE · content/heart-disease.js — heart and vessel disease: high blood pressure,
 * atherosclerosis, heart attack, heart failure, arrhythmias and blood lipids.
 * Simulations in sims/cardio.js and the reference sims (blood-pressure cuff, ECG monitor). */
Hyper.add(

{
  id: 'hypertension', parent: 'heart-disease', title: 'High blood pressure', level: 1,
  short: 'Blood pressure that stays high — from 130/80 or 140/90 mmHg, depending on the guideline. It rarely causes symptoms, but over years it damages the arteries, heart, brain, kidneys and eyes; lowering it prevents strokes, heart attacks and heart failure.',
  keywords: ['hypertension', 'high blood pressure', 'essential hypertension', 'secondary hypertension', 'salt', 'sodium', 'DASH diet', 'ACE inhibitor', 'angiotensin receptor blocker', 'calcium-channel blocker', 'thiazide', 'primary aldosteronism', 'white-coat', 'home monitoring', 'hypertensive emergency', 'stroke prevention'],
  prereq: ['blood-pressure', 'hemodynamics', 'homeostasis-feedback'],
  related: ['stroke', 'chronic-kidney-disease', 'heart-failure', 'atherosclerosis', 'healthy-diet', 'physical-activity', 'risk-communication'],
  body: `
Maria is 52, feels perfectly well, and has her blood pressure taken at a pharmacy while she waits for a prescription: 152/96 mmHg. A week of readings at home averages 148/94. She has no headache, no dizziness, nothing at all — and that is typical. High blood pressure is called silent because most people who have it feel nothing, sometimes for decades, while it slowly wears down their arteries.

### What it is
[[blood-pressure|Blood pressure]] changes from minute to minute; **hypertension** means that it stays high. Guidelines draw the line in different places: the 2017 American guideline from 130/80 mmHg, the European guidelines from 140/90, with 120–139/70–89 called "elevated" in the 2024 European guideline. The diagnosis rests on repeated readings, ideally at home or with a 24-hour monitor, never on a single visit.

It is extremely common. In its 2023 report the WHO estimated that about 1.3 billion adults aged 30–79 had hypertension in 2019 — roughly one in three — that nearly half did not know it, and that only about one in five had it under control. High systolic pressure is the leading single risk factor for death in the world, linked to around 10 million deaths a year (Global Burden of Disease estimate for 2019).

### Why it happens
In about nine people in ten no single cause is found (*primary* or *essential* hypertension). It grows out of genes and way of life together: age, as the arteries stiffen; a diet high in salt and low in potassium; excess weight; too little activity; alcohol; poor sleep. The kidneys are central: normally they excrete more salt and water when pressure rises, and in hypertension that balance is reset to a higher pressure ([[homeostasis-feedback|feedback]]).

In the rest there is an underlying (*secondary*) cause — worth looking for in young people, when hypertension is sudden or severe, or when it resists treatment: kidney disease; an adrenal gland making too much aldosterone (primary aldosteronism, commoner than once thought); obstructive [[sleep-apnea|sleep apnoea]]; a narrowed kidney artery; thyroid disease; some medicines, such as anti-inflammatory painkillers, decongestants and some contraceptive pills; and rare hormone-producing tumours. High blood pressure in [[pregnancy]] needs its own care.

### What it does
- **Arteries** thicken and stiffen, and [[atherosclerosis]] speeds up.
- **Brain**: the biggest preventable cause of [[stroke]], both blockages and bleeds, and a contributor to dementia.
- **Heart**: the left ventricle thickens to cope with the load, then stiffens; coronary disease, [[heart-failure]] and atrial fibrillation follow.
- **Kidneys**: their filters are damaged, a common road to [[chronic-kidney-disease|chronic kidney disease]] — which raises the pressure further.
- **Eyes**: damage to the small vessels of the retina.

### Treatment works
Lowering blood pressure is one of the best-proven treatments in medicine. A 2016 meta-analysis of 123 trials found that each 10 mmHg fall in systolic pressure reduced major cardiovascular events by about 20 %, strokes by about 27 %, heart failure by about 28 % and deaths from all causes by about 13 %.

**Lifestyle** comes first and adds to any medicine. Approximate effects in people with hypertension (as summarised in the 2017 American guideline): a diet rich in vegetables, fruit, whole grains and low-fat dairy (the DASH diet) lowers systolic pressure by up to about 11 mmHg; eating 4–5 g less salt a day by about 5; regular aerobic exercise by 5–8; losing weight by about 1 mmHg per kilogram; drinking less alcohol by about 4. The WHO advises adults to eat less than 5 g of salt (2 g of sodium) a day; the world average is about 11 g, most of it hidden in bread, processed meat, cheese, sauces and ready meals ([[healthy-diet]]).

**Medicines** belong mainly to four classes — ACE inhibitors, angiotensin-receptor blockers, calcium-channel blockers and thiazide-type diuretics — with beta blockers for particular situations. Most people need two, often combined in one pill, and treatment is usually lifelong, because it controls the pressure rather than curing it. Targets depend on the person: the American guideline aims below 130/80 for most adults, the 2024 European guideline for a systolic of 120–129 where that is well tolerated. Which medicine, which target and how fast are decisions to make with a doctor; the [treatment-benefit calculator](#/tools/clinical/risk) shows why the same treatment helps a high-risk person more.

> [!tip] Home monitoring helps: a validated upper-arm monitor, two readings each morning and evening for a week before a clinic visit, taken as described in [[blood-pressure]]. Bring the numbers, not an impression.

> [!warn] A reading of about 180/120 or higher **with** chest pain, breathlessness, a severe headache, confusion, weakness or numbness, or trouble speaking or seeing is a medical emergency — call your local emergency number. A very high reading without symptoms needs to be checked again and seen by a doctor soon, usually within a day.
`,
  ideas: [
    'Hypertension is blood pressure that stays high on repeated measurement; most people with it have no symptoms.',
    'About one adult in three aged 30–79 has it, and half of them do not know it (WHO, 2019 data).',
    'Most cases have no single cause; secondary causes are sought in the young, the severe and the resistant.',
    'It damages arteries, brain, heart, kidneys and eyes; each 10 mmHg lower systolic pressure prevents about a fifth of major cardiovascular events.',
    'Less salt, more activity, a healthier weight and less alcohol lower pressure; most people also need two medicines.'
  ],
  pitfalls: [
    'High blood pressure causes headaches, so no headache means normal pressure — Most people with hypertension feel nothing; the only way to know is to measure.',
    'Once the tablets have brought the pressure down, they can be stopped — Treatment controls the pressure but does not cure the cause; stopping usually lets it rise again. Any change is for discussion with a doctor.',
    'Only the salt added at the table counts — Most salt in a typical diet is already in bread, processed meat, cheese, sauces and ready meals.'
  ],
  formulas: [
    {
      name: 'Salt from sodium',
      expr: 'S = Na*MNaCl/MNa', tex: 'm_{\\text{salt}} = m_{\\text{Na}} \\frac{M_{\\text{NaCl}}}{M_{\\text{Na}}}',
      vars: {
        S: { name: 'mass of salt (sodium chloride)', q: 'mass', unit: 'g', tex: 'm_{\\text{salt}}' },
        Na: { name: 'mass of sodium', q: 'mass', unit: 'g', value: 2, tex: 'm_{\\text{Na}}' },
        MNaCl: { name: 'molar mass of NaCl', q: 'molarmass', unit: 'g/mol', value: 58.44, fixed: true, tex: 'M_{\\text{NaCl}}' },
        MNa: { name: 'molar mass of sodium', q: 'molarmass', unit: 'g/mol', value: 22.99, fixed: true, tex: 'M_{\\text{Na}}' }
      },
      note: 'Food labels give either salt or sodium: salt ≈ 2.5 × sodium. The WHO limit of 2 g sodium is about 5 g of salt.',
      practice: { unknowns: ['S', 'Na'] },
      stories: { S: 'A ready meal contains {Na} of sodium. How much salt is that?', Na: 'How much sodium is in {S} of salt?' }
    },
    {
      name: 'Risk after lowering systolic pressure',
      expr: 'R1 = R0*0.8^(d/10)', tex: 'R_1 = R_0 \\times 0.8^{\\,d/10}',
      vars: {
        R1: { name: 'risk of a major cardiovascular event, with treatment', q: 'ratio', unit: '%', tex: 'R_1' },
        R0: { name: 'risk without treatment (e.g. over 10 years)', q: 'ratio', unit: '%', value: 20, min: 0, max: 100, tex: 'R_0' },
        d: { name: 'fall in systolic pressure (mmHg)', value: 20, min: 0, max: 60 }
      },
      note: 'Illustrative: it applies the average of trial results — about 20 % fewer events per 10 mmHg — to one person\'s risk, assuming the effect multiplies for larger falls. d is in mmHg (a plain number here, because 0.8 is a fitted constant).',
      practice: { unknowns: ['R1'] },
      stories: { R1: 'A person\'s risk of a heart attack or stroke over the next ten years is estimated at {R0}. Treatment lowers the systolic pressure by {d} mmHg. What does the risk become?' }
    },
    {
      name: 'Number needed to treat',
      expr: 'N = 1/(R0 - R1)', tex: 'N = \\frac{1}{R_0 - R_1}',
      vars: {
        N: { name: 'people treated to prevent one event' },
        R0: { name: 'risk without treatment', q: 'ratio', unit: '%', value: 20, min: 0, max: 100, tex: 'R_0' },
        R1: { name: 'risk with treatment', q: 'ratio', unit: '%', value: 12.8, min: 0, max: 100, tex: 'R_1' }
      },
      note: 'The absolute risk reduction R₀ − R₁ is what a person gains; the same relative reduction gives a much smaller absolute gain when the starting risk is low.',
      practice: { unknowns: ['N'] },
      stories: { N: 'Treatment lowers the ten-year risk from {R0} to {R1}. How many people must be treated for ten years to prevent one event?' }
    }
  ],
  examples: [
    {
      title: 'Reading a food label',
      q: 'A ready meal lists 1.2 g of sodium. How much salt is that, and what share of the WHO\'s daily limit of 5 g?',
      steps: [
        'Salt ≈ sodium × 58.44 / 22.99 = sodium × 2.54.',
        '$1.2 \\times 2.54 = 3.05$ g of salt.',
        '$3.05 / 5 = 0.61$: one meal supplies about 60 % of the day\'s limit.'
      ],
      a: 'About 3 g of salt — some 60 % of the daily limit.'
    },
    {
      title: 'The same pill, a different benefit',
      q: 'Two people each lower their systolic pressure by 20 mmHg with treatment. One has a ten-year risk of a heart attack or stroke of 20 %, the other of 5 %. Using the average trial effect (20 % fewer events per 10 mmHg), estimate each person\'s new risk and the number needed to treat for ten years to prevent one event.',
      steps: [
        'Relative effect of 20 mmHg: $0.8^2 = 0.64$ — about a third fewer events.',
        'Higher-risk person: $20\\ \\% \\times 0.64 = 12.8\\ \\%$; absolute gain 7.2 points; number needed to treat $1/0.072 \\approx 14$.',
        'Lower-risk person: $5\\ \\% \\times 0.64 = 3.2\\ \\%$; absolute gain 1.8 points; number needed to treat $1/0.018 \\approx 56$.',
        'The relative benefit is the same, but the absolute benefit is four times larger for the person at higher risk — which is why guidelines decide on treatment by overall risk as well as by the pressure itself.'
      ],
      a: 'About 12.8 % (NNT ≈ 14) and 3.2 % (NNT ≈ 56).'
    }
  ],
  quiz: [
    { q: 'How do most people find out they have high blood pressure?', choices: ['from headaches', 'from nosebleeds', 'from a measurement — usually they feel nothing', 'from dizziness on standing'], a: 2,
      why: 'Hypertension is usually symptomless for years. Headaches and nosebleeds are no guide; regular measurement is.' },
    { q: 'How many grams of salt does 2.4 g of sodium correspond to?', answer: 6.1, unit: 'g',
      why: 'Salt ≈ 2.54 × sodium: 2.4 × 2.54 ≈ 6.1 g — more than the WHO\'s 5 g limit.' },
    { q: 'A 28-year-old has a blood pressure of 170/105 on repeated readings. What should doctors look for?', choices: ['nothing — it is always essential hypertension', 'an underlying cause, such as kidney disease, an aldosterone-producing adrenal gland or a narrowed kidney artery', 'a vitamin deficiency', 'only a heart valve problem'], a: 1,
      why: 'Severe hypertension at a young age is a reason to look for secondary causes, some of which can be cured.' },
    { q: 'In trials, lowering systolic pressure by 10 mmHg reduced strokes by roughly…', choices: ['5 %', 'a quarter', 'three quarters', '100 %'], a: 1,
      why: 'About 27 % fewer strokes per 10 mmHg in the 2016 meta-analysis — a large effect for a single intervention.' },
    { q: 'If medicines bring blood pressure down to normal, hypertension is cured and the tablets can be stopped.', a: false,
      why: 'The medicines control the pressure while they are taken; in most people it rises again without them. Lifestyle change sometimes allows a dose to be reduced, under medical supervision.' }
  ],
  applications: ['Screening in pharmacies, clinics and communities — the cheapest way to prevent strokes.', 'Salt-reduction programmes that reformulate processed food for a whole population.', 'Single-pill combinations and team-based care, which improve control.', 'Home and 24-hour ambulatory monitoring to confirm the diagnosis.'],
  history: 'In the 1940s high blood pressure was often thought a harmless or even necessary compensation; President Franklin Roosevelt, whose rising pressure went essentially untreated, died of a brain haemorrhage in 1945 with a reading of about 300/190. The US Veterans Administration trials of 1967 and 1970 were the first to show that treatment prevents strokes and heart failure.',
  sim: 'ref-bp-cuff'
},

{
  id: 'atherosclerosis', parent: 'heart-disease', title: 'Atherosclerosis and coronary artery disease', level: 2,
  short: 'The slow build-up of fatty, inflamed plaque inside artery walls, beginning in youth. It narrows arteries, causing angina, and when a plaque ruptures it triggers the clots behind most heart attacks and strokes. Coronary artery disease is the world\'s leading cause of death.',
  keywords: ['atherosclerosis', 'coronary artery disease', 'ischaemic heart disease', 'plaque', 'angina', 'stable angina', 'unstable angina', 'foam cells', 'fibrous cap', 'plaque rupture', 'stenosis', 'stent', 'PCI', 'bypass', 'CT coronary angiography', 'calcium score', 'fractional flow reserve', 'risk factors', 'peripheral artery disease'],
  prereq: ['blood-vessels', 'cholesterol-lipids', 'innate-immunity'],
  related: ['heart-attack', 'stroke', 'hypertension', 'smoking', 'type2-diabetes', 'hemodynamics', 'medical-imaging'],
  body: `
It starts early. Studies of young people who died in accidents have found fatty streaks in the aortas of teenagers and plaques in the coronary arteries of many people in their twenties and thirties. For decades nothing is felt. Then, for many, the first symptom is a tightness in the chest on the stairs — or, without warning, a heart attack.

### How a plaque forms
1. **The lining is strained.** High pressure, tobacco smoke, high blood sugar and the disturbed flow at branches and bends injure the endothelium.
2. **Cholesterol gets in.** LDL particles, which carry cholesterol ([[cholesterol-lipids]]), slip into the wall; the more there are, and the longer, the more are trapped and chemically altered.
3. **Inflammation.** White cells are drawn in, turn into macrophages and swallow the altered LDL until they are bloated *foam cells* ([[innate-immunity]]) — a fatty streak.
4. **A plaque.** Muscle cells move in and build a **fibrous cap** over a soft core of fat and dead cells; calcium is laid down over the years.

At first the artery **enlarges outward** to make room, and its channel stays open; only when plaque fills about 40 % of the wall does the channel begin to narrow. A plaque can therefore be large, and dangerous, without narrowing the artery — so an angiogram, which shows only the channel, can look reassuring.

### Two ways it does harm
- **Narrowing.** A severe narrowing — typically 70 % of the diameter or more — cannot deliver the extra flow the heart needs in exercise, though resting flow is kept up almost to the end because the small vessels downstream widen to compensate. The result is **angina**: a pressure, tightness or heaviness in the chest, sometimes spreading to the arms, neck or jaw, brought on by exertion or emotion and easing within minutes of rest. In the legs the same process causes cramping calf pain on walking (peripheral artery disease).
- **Rupture.** If the fibrous cap tears, or the lining over the plaque erodes, the fatty core meets the blood and a clot forms within minutes ([[hemostasis]]). It may block the artery — a [[heart-attack|heart attack]] or [[stroke]] — or partly block it, causing **unstable angina**. The plaques most likely to rupture have a thin cap, a large soft core and much inflammation, and older studies suggested that most heart attacks began at plaques narrowing the artery by less than half.

### Who gets it
The large INTERHEART study (2004), in 52 countries, found that nine common, largely modifiable factors — abnormal blood lipids, smoking, high blood pressure, diabetes, abdominal obesity, psychosocial stress, too little fruit and vegetables, physical inactivity and drinking pattern — accounted for about 90 % of the risk of a first heart attack. Age, male sex, family history and a high lipoprotein(a), set largely by genes, add to it. Risk factors multiply rather than add. Cardiovascular disease killed about 17.9 million people in 2019, a third of all deaths, and ischaemic heart disease alone about 9 million (WHO estimates). Doctors combine the factors in validated risk calculators — such as SCORE2 in Europe, PREVENT in the United States or QRISK3 in the UK — to estimate a person's ten-year risk and guide treatment; the simulation below is only a picture of the idea, not such a calculator.

### Finding and treating it
Tests look either at the effect (an exercise ECG, or a stress echocardiogram, nuclear or MRI scan showing where the muscle runs short of blood) or at the arteries (a CT coronary angiogram showing plaque and narrowing, or a calcium score). An invasive angiogram, with a catheter from the wrist, shows the channel precisely and can measure the pressure drop across a narrowing at maximum flow — the **fractional flow reserve**.

Treatment works on three levels. **Slowing the disease**: stopping smoking, activity, a healthy diet ([[smoking]], [[physical-activity]]), and medicines that lower LDL — statins first — and blood pressure, with aspirin or another antiplatelet once the disease is established. **Relieving angina**: nitrates, beta blockers, calcium-channel blockers and others. **Opening arteries**: a balloon and stent (PCI) or bypass surgery. In stable disease, large trials such as ISCHEMIA (2020) found that routine stenting on top of good medical treatment relieved angina better but did not reduce heart attacks or deaths over a few years — so it is chosen for symptoms and for particular high-risk patterns rather than by reflex.

> [!warn] Chest discomfort that comes on at rest, lasts more than a few minutes, or is new, worse or more frequent than your usual angina is an emergency — call your local emergency number. It may be a plaque rupturing now.
`,
  ideas: [
    'Atherosclerosis is an inflammatory disease of the artery wall, driven by LDL particles entering it and made worse by smoking, high pressure and high sugar.',
    'Arteries first enlarge outward around a plaque; narrowing comes late.',
    'A fixed narrowing causes angina on exertion; a ruptured or eroded plaque causes a clot — a heart attack or stroke.',
    'A few modifiable risk factors account for most of the risk, and they multiply together.',
    'Treatment slows the disease, relieves symptoms and, where needed, opens arteries; stents treat one spot, not the disease.'
  ],
  pitfalls: [
    'Atherosclerosis is fat clogging a pipe like grease in a drain — It grows inside the wall, with inflammation; the wall bulges outward first, and the main danger is a plaque tearing, not only the channel closing.',
    'The tightest narrowing is the most dangerous one — Heart attacks often start at moderate plaques with a thin cap and a soft core; severe narrowings cause angina but are often less likely to rupture.',
    'A stent cures coronary disease — It widens one segment. The disease affects the whole arterial tree, so lowering LDL and blood pressure and stopping smoking remain essential.'
  ],
  formulas: [
    {
      name: 'Area left by a narrowing',
      expr: 'a = (1 - s)^2', tex: 'a = (1 - s)^2',
      vars: {
        a: { name: 'channel area left, as a share of normal', q: 'ratio', unit: '%' },
        s: { name: 'narrowing of the diameter', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 }
      },
      note: 'Narrowings are reported by diameter. A 50 % narrowing of the diameter leaves only 25 % of the area; 70 % leaves 9 %.',
      practice: { unknowns: ['a', 's'] },
      stories: { a: 'An angiogram shows a {s} narrowing of a coronary artery\'s diameter. What share of the normal channel area is left?', s: 'Only {a} of an artery\'s channel area is left. By what share is its diameter narrowed?' }
    },
    {
      name: 'Resistance of a narrowed segment',
      expr: 'k = 1/(1 - s)^4', tex: 'k = \\frac{1}{(1 - s)^4}',
      vars: {
        k: { name: 'resistance of the segment, times normal' },
        s: { name: 'narrowing of the diameter', q: 'ratio', unit: '%', value: 50, min: 0, max: 99 }
      },
      note: 'From Poiseuille\'s law for the narrowed segment alone (real narrowings also lose energy to turbulence). Because the arterioles downstream hold most of the resistance and can dilate, resting flow is kept up until the narrowing is very tight.',
      practice: { unknowns: ['k'] },
      stories: { k: 'By what factor does a {s} narrowing of the diameter raise the resistance of that segment?' }
    },
    {
      name: 'Fractional flow reserve',
      expr: 'FFR = Pd/Pa', tex: '\\text{FFR} = \\frac{P_d}{P_a}',
      vars: {
        FFR: { name: 'fractional flow reserve', tex: '\\text{FFR}' },
        Pd: { name: 'pressure beyond the narrowing, at maximum flow', q: 'pressure', unit: 'mmHg', value: 72, min: 30, max: 84, tex: 'P_d' },
        Pa: { name: 'pressure in the aorta', q: 'pressure', unit: 'mmHg', value: 90, min: 85, max: 120, tex: 'P_a' }
      },
      note: 'Measured with a pressure wire while the heart\'s small vessels are fully dilated by a medicine. A value of 0.80 or less means the narrowing limits flow enough that opening it is likely to help.',
      practice: { unknowns: ['FFR'] },
      stories: { FFR: 'At maximum flow the pressure is {Pa} in the aorta and {Pd} beyond a narrowing. What is the fractional flow reserve?' }
    }
  ],
  examples: [
    {
      title: 'Diameter and area',
      q: 'A report describes a 50 % narrowing in one artery and a 70 % narrowing in another (both by diameter). What share of the channel area is left in each, and by what factor has the segment\'s resistance risen?',
      steps: [
        '50 %: area left $(1 - 0.5)^2 = 0.25$, i.e. 25 %; resistance of the segment $1/0.5^4 = 16$ times normal.',
        '70 %: area left $(1 - 0.7)^2 = 0.09$, i.e. 9 %; resistance $1/0.3^4 \\approx 123$ times normal.',
        'Yet at rest the heart muscle beyond either narrowing may receive normal flow, because its arterioles relax to compensate. What the 70 % narrowing takes away is the reserve for exercise — hence angina on exertion.'
      ],
      a: '25 % of the area and 16 × the resistance; 9 % and about 123 ×.'
    },
    {
      title: 'Does this narrowing matter?',
      q: 'During an angiogram a pressure wire is passed beyond a 60 % narrowing. With the heart\'s small vessels fully dilated, the pressure is 90 mmHg in the aorta and 72 mmHg beyond the narrowing. What is the fractional flow reserve, and what does it suggest?',
      steps: [
        'FFR $= 72/90 = 0.80$.',
        'At maximum flow, the muscle beyond receives about 80 % of the flow it would get without the narrowing.',
        'That is at the usual threshold (0.80): opening it is likely to relieve symptoms, especially if the person has angina that medicines have not controlled. The decision also weighs symptoms and the rest of the arteries.'
      ],
      a: 'FFR 0.80 — at the threshold where the narrowing is considered significant.'
    }
  ],
  quiz: [
    { q: 'Why can a coronary artery contain a large plaque and still look almost normal on an angiogram?', choices: ['the plaque dissolves during the test', 'the artery enlarges outward, so the channel stays open until plaque fills about 40 % of the wall', 'plaques are invisible to X-rays', 'the dye pushes the plaque aside'], a: 1,
      why: 'Outward remodelling (Glagov, 1987) preserves the channel at first; the angiogram shows only the channel, not the wall.' },
    { q: 'Which description fits stable angina?', choices: ['constant chest pain for days', 'chest tightness on exertion that eases within minutes of rest', 'sharp pain when pressing on the chest wall', 'pain only after lying down for an hour'], a: 1,
      why: 'Stable angina is predictable: a narrowed artery cannot supply the extra flow that exertion demands, and rest restores the balance.' },
    { q: 'What share of the channel area is left by a 60 % narrowing of the diameter, in per cent?', answer: 16,
      why: '(1 − 0.6)² = 0.4² = 0.16, or 16 %.' },
    { q: 'Most heart attacks begin when…', choices: ['a plaque slowly closes the artery completely over years', 'a plaque ruptures or its surface erodes and a clot forms on it', 'the heart muscle tires from overwork', 'cholesterol crystals block the artery like a plug'], a: 1,
      why: 'The sudden event is thrombosis on a disrupted plaque, often one that was not severely narrowing before.' },
    { q: 'In stable coronary disease, routine stenting on top of good medical treatment has been shown to reduce deaths.', a: false,
      why: 'Trials such as ISCHEMIA (2020) found better relief of angina but no reduction in deaths or heart attacks over a few years. After a heart attack, by contrast, opening the artery quickly saves lives.' }
  ],
  applications: ['Risk calculators that guide statins and blood-pressure treatment.', 'CT coronary angiography and calcium scoring for chest pain.', 'Stents, bypass surgery and pressure-wire measurements in the catheter laboratory.', 'Public-health measures — smoke-free laws, trans-fat bans, salt reduction — that lower heart disease in whole populations.'],
  history: 'Rudolf Virchow described inflammation in artery walls in the 1850s, and Nikolai Anitschkow showed in 1913 that feeding rabbits cholesterol produced plaques. The Framingham Heart Study, begun in 1948, gave the world the idea of a "risk factor".',
  sim: 'cv-plaque'
},

{
  id: 'heart-attack', parent: 'heart-disease', title: 'Heart attack', level: 1,
  short: 'Death of heart muscle when a coronary artery is suddenly blocked, usually by a clot on a ruptured plaque. Chest pain is the classic sign but not the only one. It is an emergency: every minute of delay costs muscle, so call your local emergency number at once.',
  keywords: ['heart attack', 'myocardial infarction', 'MI', 'STEMI', 'NSTEMI', 'acute coronary syndrome', 'chest pain', 'troponin', 'time is muscle', 'primary PCI', 'thrombolysis', 'women heart attack symptoms', 'silent heart attack', 'cardiac arrest', 'cardiac rehabilitation', 'aspirin'],
  prereq: ['atherosclerosis', 'heart-anatomy', 'hemostasis'],
  related: ['recognising-emergencies', 'cpr', 'ecg', 'heart-failure', 'arrhythmias', 'lab-tests'],
  body: `
> [!warn] **Think heart attack and call your local emergency number at once** — do not wait to see whether it passes, and do not drive yourself — if you or someone with you has:
> - chest pain, pressure, tightness, squeezing or heaviness lasting more than a few minutes, or going away and coming back;
> - discomfort spreading to one or both arms, the neck, jaw, back or upper stomach;
> - breathlessness, a cold sweat, nausea or vomiting, light-headedness.
>
> **Less typical signs**, more common in women, older people and people with diabetes: breathlessness without pain; nausea, vomiting or an "indigestion" feeling; pain mainly in the back, jaw or upper stomach; sudden overwhelming tiredness or weakness; in older people, sudden confusion or fainting — sometimes with little or no chest pain at all.
>
> If the person collapses and is not breathing normally, it is a cardiac arrest: call, start chest compressions and send for a defibrillator ([[cpr|CPR and defibrillation]]).

Ahmed, 58, felt a heavy pressure in his chest while carrying shopping upstairs. It eased a little when he sat down, so he decided to wait. Two hours later his wife called an ambulance. The paramedics' ECG showed a completely blocked coronary artery, and forty minutes after he reached hospital a cardiologist had reopened it with a balloon and a stent. He survived — but much of the front wall of his heart, which could have been saved in those first two hours, had become scar.

### What happens
A **heart attack** (myocardial infarction) is heart muscle dying for want of blood. Nearly always the cause is [[atherosclerosis]]: a plaque in a coronary artery ruptures or its surface erodes, and a clot forms on it ([[hemostasis]]). If the clot blocks the artery completely, the muscle it feeds is starved of oxygen. Cells start to die after about 20 minutes, first in the inner layer of the wall, and the dead zone spreads outward through the wall over the following hours. Reopening the artery stops the spread: **time is muscle**. In one analysis of patients treated with angioplasty, every 30 minutes of delay raised the risk of dying within a year by about 7.5 % in relative terms (De Luca and colleagues, 2004).

Dying muscle leaks proteins into the blood; **troponin** is the one measured, and a rise and fall of it together with symptoms or ECG changes defines a heart attack ([[lab-tests]]). The [[ecg]] sorts heart attacks into two kinds:
- **STEMI** (ST-elevation myocardial infarction): the artery is probably fully blocked now and must be opened at once.
- **NSTEMI**: usually a partly blocked artery; treated with medicines immediately and, for most people, an angiogram within a day or two.

A heart attack is not the same as a **cardiac arrest**, in which the heart suddenly stops pumping, usually because of ventricular fibrillation ([[arrhythmias]]). A heart attack can cause an arrest, and many deaths from heart attacks happen that way, before hospital — which is why bystander CPR and public defibrillators save lives.

### Treatment
- **Reopening the artery.** For STEMI the preferred treatment is **primary PCI**: a catheter from the wrist, a balloon and a stent. The 2023 European guideline prefers it when it can be done within about two hours of the diagnosis; otherwise a clot-dissolving medicine (thrombolysis) is given at once, ideally within 10 minutes of the diagnosis, followed by transfer.
- **Medicines** from the first minutes: antiplatelets (aspirin and a second one), an anticoagulant around the procedure, pain relief, and oxygen only if the blood oxygen is low. Afterwards, long-term statins and, depending on how well the heart pumps, a beta blocker and other medicines.
- **Cardiac rehabilitation** — supervised exercise, education and support — lowers the risk of dying from heart disease and of readmission.

Less common causes include a tear in the wall of a coronary artery (spontaneous coronary artery dissection, which mostly affects women under 60), spasm of an artery, and heart attacks with open arteries when demand far exceeds supply, as in severe anaemia or blood loss.

### What it means for you
The longest delay is usually the first: the time between the first symptom and the call for help. People hesitate because the pain is not dramatic, because it might be indigestion, because they do not want to make a fuss. Emergency services would far rather come out for indigestion than arrive too late. Calling an ambulance is also faster than driving: the crew can record an ECG, send it ahead, treat a cardiac arrest and take you straight to a hospital that can open the artery. While waiting, stop and rest, loosen tight clothing and unlock the door; the call handler may advise chewing an aspirin if you are not allergic to it — follow their advice. The signs of a heart attack and of a stroke are compared in [[recognising-emergencies]].
`,
  ideas: [
    'A heart attack is heart muscle dying because a coronary artery is blocked, usually by a clot on a ruptured or eroded plaque.',
    'Chest pain or pressure is typical, but breathlessness, nausea, back or jaw pain and exhaustion without pain are common, especially in women, older people and people with diabetes.',
    'Time is muscle: cells begin to die after about 20 minutes and the damage spreads over hours, so call your local emergency number at once.',
    'STEMI needs the artery opened immediately (primary PCI, or clot-dissolving medicine if PCI cannot be done in time).',
    'A heart attack is not a cardiac arrest, but it can cause one: CPR and a defibrillator are then what save a life.'
  ],
  pitfalls: [
    'A heart attack always causes crushing chest pain — Many cause pressure or discomfort rather than pain, and some cause mainly breathlessness, nausea or exhaustion, especially in women, older people and people with diabetes.',
    'If the pain eases with rest, it cannot be a heart attack — It may ease and return. Chest discomfort lasting more than a few minutes needs an emergency call.',
    'Driving to hospital yourself is quicker than waiting for an ambulance — The ambulance team can diagnose, treat a cardiac arrest on the way and take you directly to a hospital that can open the artery.'
  ],
  formulas: [
    {
      name: 'Total ischaemic time',
      expr: 'T = tp + te + th', tex: 'T = t_p + t_e + t_h',
      vars: {
        T: { name: 'total time the artery is blocked', q: 'time', unit: 'min' },
        tp: { name: 'delay before calling for help', q: 'time', unit: 'min', value: 120, tex: 't_p' },
        te: { name: 'from the call to arrival at hospital', q: 'time', unit: 'min', value: 45, tex: 't_e' },
        th: { name: 'from arrival to the artery reopened', q: 'time', unit: 'min', value: 60, tex: 't_h' }
      },
      note: 'Muscle lost depends on the whole time the artery is blocked. The first part is the only one the patient controls — and often the longest.',
      practice: { unknowns: ['T'] },
      stories: { T: 'A man waits {tp} before calling an ambulance; it takes {te} to reach hospital and {th} more to open the artery. How long was the artery blocked?', tp: 'The artery was blocked for {T} in all: {te} from the call to hospital and {th} in hospital. How long did the patient wait before calling?' }
    },
    {
      name: 'Delay and the risk of dying within a year',
      expr: 'RR = 1.075^(d/30)', tex: '\\text{RR} = 1.075^{\\,d/30}',
      vars: {
        RR: { name: 'relative risk of death within a year, compared with no extra delay', tex: '\\text{RR}' },
        d: { name: 'extra delay (minutes)', value: 120, min: 0, max: 600 }
      },
      note: 'From a 2004 analysis of primary angioplasty (about 7.5 % higher relative risk for every 30 minutes). An average over many patients, not a prediction for one; d is a plain number of minutes because 1.075 is a fitted constant.',
      practice: { unknowns: ['RR'] },
      stories: { RR: 'A patient waits an extra {d} minutes before calling for help. By what factor does that raise the relative risk of dying within a year, on the average trial figure?' }
    }
  ],
  examples: [
    {
      title: 'Where the time goes',
      q: 'Ahmed waited 120 minutes before his wife called. The ambulance took 35 minutes to reach the hospital and the team opened the artery 40 minutes after arrival. How long was the artery blocked, what if he had called at once, and what does the extra delay mean on average?',
      steps: [
        'Total: $120 + 35 + 40 = 195$ minutes, over three hours.',
        'Calling at once: $0 + 35 + 40 = 75$ minutes.',
        'The extra 120 minutes, on the 2004 estimate: $1.075^{120/30} = 1.075^4 \\approx 1.34$ — about a third higher relative risk of dying within a year.',
        'In the simulation, compare how much of the artery\'s territory dies at 75 and at 195 minutes. The hospital part was fast; the delay was his own hesitation.'
      ],
      a: '195 minutes instead of 75; on average about a third higher one-year mortality.'
    },
    {
      title: 'Not a typical story',
      q: 'Grace, 74, who has type 2 diabetes, wakes feeling sick and unusually breathless, with an ache between the shoulder blades and a tiredness she describes as "like never before". She has no chest pain and thinks she has eaten something bad. What should she do?',
      steps: [
        'Older age, being a woman and diabetes all make atypical symptoms more likely; in diabetes nerve damage can blunt the pain.',
        'Breathlessness, nausea, back pain and sudden exhaustion together are recognised signs of a heart attack.',
        'She, or whoever is with her, should call the local emergency number now rather than wait for the morning.',
        'In hospital an ECG and troponin tests will show whether it is a heart attack; if it is not, nothing is lost.'
      ],
      a: 'Call the local emergency number now — these can be the signs of a heart attack.'
    }
  ],
  quiz: [
    { q: 'A 60-year-old has had chest pressure with sweating for 15 minutes. What is the right first step?', choices: ['wait an hour to see whether it passes', 'drive to the nearest hospital', 'call the local emergency number', 'take an antacid and lie down'], a: 2,
      why: 'Every minute counts, and the ambulance crew can diagnose and treat on the way, including a cardiac arrest. Waiting and driving yourself both lose time and add danger.' },
    { q: 'Which pattern of symptoms is more common in women, older people and people with diabetes having a heart attack?', choices: ['severe crushing chest pain only', 'breathlessness, nausea, back or jaw pain and exhaustion, with little chest pain', 'a rash and fever', 'headache and a stiff neck'], a: 1,
      why: 'Chest discomfort is still the commonest symptom in everyone, but these groups more often have other or milder symptoms, which leads to dangerous delays.' },
    { q: 'A heart attack and a cardiac arrest are the same thing.', a: false,
      why: 'A heart attack is muscle dying from a blocked artery, usually in a person who is awake and talking. A cardiac arrest is the heart stopping pumping, usually from ventricular fibrillation; a heart attack can cause one.' },
    { q: 'A woman waits 150 minutes before calling; the ambulance takes 40 minutes and the hospital 50 more to open the artery. How long, in hours, was the artery blocked?', answer: 4, unit: 'h',
      why: '150 + 40 + 50 = 240 minutes = 4 hours — most of it before the call.' },
    { q: 'Why does reopening the artery quickly matter so much?', choices: ['the clot hardens after an hour and can never be removed', 'the muscle dies progressively over hours, so what is still alive can be saved', 'it stops the pain, which is the main danger', 'troponin becomes toxic after a few hours'], a: 1,
      why: 'Death of muscle spreads from the inner layer outward over hours; reperfusion rescues whatever is still alive. The sooner, the more is saved.' }
  ],
  applications: ['Public campaigns teaching the warning signs and to call at once.', 'Ambulance ECGs sent ahead so the catheter laboratory is ready.', 'Networks of hospitals that can perform primary PCI around the clock.', 'Public-access defibrillators and CPR training.'],
  history: 'James Herrick described coronary thrombosis as a survivable illness in 1912. Coronary care units in the 1960s roughly halved hospital deaths by treating ventricular fibrillation; the GISSI (1986) and ISIS-2 (1988) trials proved clot-dissolving medicine and aspirin, and primary angioplasty followed in the 1990s.',
  sim: 'cv-time-muscle'
},

{
  id: 'heart-failure', parent: 'heart-disease', title: 'Heart failure', level: 2,
  short: 'The heart can no longer pump enough blood at normal filling pressures, so fluid backs up into the lungs and legs and the body tires easily. It has many causes and several types; modern medicines and devices have greatly improved how long and how well people live with it.',
  keywords: ['heart failure', 'congestive heart failure', 'HFrEF', 'HFpEF', 'HFmrEF', 'ejection fraction', 'breathlessness', 'orthopnoea', 'oedema', 'swollen ankles', 'BNP', 'NT-proBNP', 'diuretic', 'SGLT2 inhibitor', 'beta blocker', 'mineralocorticoid receptor antagonist', 'ARNI', 'cardiomyopathy', 'daily weight'],
  prereq: ['cardiac-output', 'cardiac-cycle', 'body-fluids'],
  related: ['hypertension', 'heart-attack', 'arrhythmias', 'chronic-kidney-disease', 'blood-vessels', 'side-effects-interactions'],
  body: `
Joseph, 71, had a heart attack at 64. For months now he has slept on three pillows because lying flat makes him breathless, his ankles are swollen by evening, and he stops twice on the way to the shops. An echocardiogram shows a left ventricle that is enlarged and ejects only 30 % of the blood it holds.

### What it is
**Heart failure** does not mean the heart has stopped. It means the heart cannot supply the blood the body needs, or can do so only at abnormally high filling pressures. It is a syndrome — a recognisable pattern of symptoms and signs — with many causes: coronary disease and past [[heart-attack|heart attacks]], long-standing [[hypertension]], valve disease, diseases of the heart muscle (cardiomyopathies — some inherited, some caused by alcohol, infections or cancer treatment), [[arrhythmias]] and more. About 64 million people were living with it worldwide in 2017 (Global Burden of Disease estimate); in wealthy countries 1–2 % of adults have it, and more than one in ten people over 70.

### Two ways to fail
Heart failure is classified by the **ejection fraction** (EF), the share of the left ventricle's blood ejected with each beat ([[cardiac-cycle]]):

| Type | Ejection fraction | Typical picture |
|---|---|---|
| Reduced (HFrEF) | 40 % or less | a weak, often enlarged ventricle — after heart attacks, in cardiomyopathy |
| Mildly reduced (HFmrEF) | 41–49 % | in between |
| Preserved (HFpEF) | 50 % or more | a stiff, thick ventricle that fills poorly — with age, hypertension, obesity, diabetes, atrial fibrillation |

In the first the pump squeezes weakly; in the second it squeezes well but relaxes and fills badly. Either way it needs a higher pressure to fill, and that pressure backs up — into the lungs, causing breathlessness, worst when lying flat or at night; and, when the right side fails too, into the veins of the body, causing swollen ankles, a swollen liver and fluid in the abdomen ([[blood-vessels]]). The Frank–Starling simulation shows why a weak heart needs so much filling to eject a normal stroke.

### Why it gets worse
When output falls, the body reacts as it would to bleeding: sympathetic nerves speed and strengthen the heart and tighten the vessels, and the kidneys, sensing less flow, switch on the **renin–angiotensin–aldosterone system** and hold on to salt and water. In the short term this props up blood pressure. In the long run it overloads the heart with fluid and resistance and floods it with hormones that scar and remodel the muscle. An enlarged ventricle also works at a disadvantage: by Laplace's law its wall bears more stress at the same pressure. Most of the medicines that lengthen life in heart failure work by blocking this vicious circle.

### Diagnosis
Symptoms (breathlessness, fatigue, ankle swelling), signs (crackles in the lungs, raised neck veins, oedema), a blood test for **natriuretic peptides** (BNP or NT-proBNP, hormones released by a stretched heart — a normal result makes heart failure unlikely) and an **echocardiogram**, which measures the EF, the valves and the walls.

### Treatment
For **reduced EF**, four classes of medicine, each shown in large trials to reduce deaths and hospital admissions, are recommended together — the "four pillars": an ACE inhibitor, angiotensin-receptor blocker or angiotensin receptor–neprilysin inhibitor; a beta blocker; a mineralocorticoid receptor antagonist; and an SGLT2 inhibitor. **Diuretics** relieve congestion but do not by themselves lengthen life. Some people benefit from devices: an implantable defibrillator against sudden death, or a biventricular pacemaker that resynchronises walls beating out of step; in advanced failure, mechanical pumps and transplantation. For **preserved EF**, SGLT2 inhibitors reduce hospital admissions, diuretics relieve congestion, and treating the causes — blood pressure, atrial fibrillation, weight — matters most.

Living with heart failure is a partnership: taking the medicines, staying active (supervised rehabilitation helps), vaccinations, and **weighing yourself every morning**, because fluid builds up before you feel it. Advice on fluid and salt is individual; very strict salt restriction did not reduce hospital admissions or deaths in a 2022 trial. Ask a pharmacist before taking anti-inflammatory painkillers, which make the body retain fluid ([[side-effects-interactions]]).

> [!warn] Call your local emergency number for severe breathlessness that comes on suddenly or does not settle when you sit up, coughing up pink frothy fluid, chest pain, or fainting. Contact your heart-failure team soon if your weight rises by about 2 kg over a few days (use the threshold your team gives you), your ankles swell more, or you need more pillows to breathe at night.
`,
  ideas: [
    'Heart failure means the heart cannot meet the body\'s needs at normal filling pressures — not that it has stopped.',
    'It is classed by ejection fraction: reduced (40 % or less), mildly reduced (41–49 %) and preserved (50 % or more).',
    'High filling pressures back up into the lungs (breathlessness) and the body\'s veins (swelling).',
    'The body\'s hormonal rescue — sympathetic drive and the renin–angiotensin–aldosterone system — makes it worse over time; blocking it lengthens life.',
    'For reduced EF, four classes of medicine together save lives; diuretics relieve congestion; daily weighing catches fluid early.'
  ],
  pitfalls: [
    'Heart failure means the heart is about to stop — It means the heart is not keeping up. Many people live for years with it, and modern treatment has improved both survival and quality of life.',
    'A normal ejection fraction rules out heart failure — About half of people with heart failure have a preserved EF: their hearts squeeze normally but fill poorly.',
    'Diuretics are the treatment for heart failure — They relieve swelling and breathlessness, but it is the other medicine classes that lengthen life in reduced EF.'
  ],
  formulas: [
    {
      name: 'Wall stress of the ventricle (Laplace)',
      expr: 'sigma = P*r/(2*h)', tex: '\\sigma = \\frac{P\\,r}{2\\,h}',
      vars: {
        sigma: { name: 'stress in the ventricle wall', q: 'stress', unit: 'kPa', tex: '\\sigma' },
        P: { name: 'pressure in the ventricle', q: 'pressure', unit: 'mmHg', value: 120 },
        r: { name: 'radius of the chamber', q: 'length', unit: 'cm', value: 2.5 },
        h: { name: 'wall thickness', q: 'length', unit: 'cm', value: 1.0 }
      },
      note: 'For a sphere. A dilated ventricle (larger r, thinner h) must bear more stress for the same pressure; a thickened wall (larger h) keeps stress normal despite high pressure — how the heart adapts to hypertension, at the price of stiffness.',
      practice: { unknowns: ['sigma', 'h'] },
      stories: { sigma: 'A left ventricle of radius {r} and wall thickness {h} develops a pressure of {P}. What is the stress in its wall?', h: 'How thick must the wall of a ventricle of radius {r} be to keep its stress at {sigma} when it develops {P}?' }
    },
    {
      name: 'Output from the ejection fraction',
      expr: 'CO = HR*EF*EDV', tex: '\\text{CO} = \\text{HR} \\times \\text{EF} \\times \\text{EDV}',
      vars: {
        CO: { name: 'cardiac output', q: 'flowrate', unit: 'L/min', tex: '\\text{CO}' },
        HR: { name: 'heart rate', q: 'frequency', unit: 'bpm', value: 70, min: 40, max: 180, tex: '\\text{HR}' },
        EF: { name: 'ejection fraction', q: 'ratio', unit: '%', value: 25, min: 5, max: 80, tex: '\\text{EF}' },
        EDV: { name: 'end-diastolic volume', q: 'volume', unit: 'mL', value: 220, tex: '\\text{EDV}' }
      },
      note: 'EF × EDV is the stroke volume. A dilated ventricle can keep a near-normal output with a low EF — at the cost of high filling pressures and wall stress.',
      practice: { unknowns: ['CO', 'EDV'] },
      stories: { CO: 'An enlarged ventricle holds {EDV} and ejects {EF} of it at {HR}. What is the cardiac output?', EDV: 'To deliver {CO} at {HR} with an ejection fraction of {EF}, how large must the ventricle\'s end-diastolic volume be?' }
    }
  ],
  examples: [
    {
      title: 'Why a big heart is a strained heart',
      q: 'Compare the wall stress in a normal left ventricle (pressure 120 mmHg, radius 2.5 cm, wall 1.0 cm), a dilated failing one (100 mmHg, 3.5 cm, 0.8 cm) and one thickened by years of hypertension (170 mmHg, 2.5 cm, 1.4 cm).',
      steps: [
        'Normal: $\\sigma = 16\\,000\\ \\text{Pa} \\times 0.025 / (2 \\times 0.010) = 20$ kPa.',
        'Dilated: $\\sigma = 13\\,330 \\times 0.035 / (2 \\times 0.008) \\approx 29$ kPa — almost 50 % more, although it develops a lower pressure.',
        'Thickened: $\\sigma = 22\\,660 \\times 0.025 / (2 \\times 0.014) \\approx 20$ kPa — the thicker wall brings stress back to normal.',
        'The dilated heart spends more energy per beat and is pushed towards further enlargement; the thickened heart copes with the pressure but becomes stiff, which leads towards failure with preserved EF.'
      ],
      a: 'About 20, 29 and 20 kPa.'
    },
    {
      title: 'A low ejection fraction, a near-normal output',
      q: 'Joseph\'s enlarged left ventricle holds 220 mL at the end of filling and has an EF of 25 %; his heart rate is 70. A healthy ventricle holds 120 mL with an EF of 60 %. Compare their stroke volumes and outputs.',
      steps: [
        'Joseph: stroke volume $0.25 \\times 220 = 55$ mL; output $70 \\times 55 = 3.85$ L/min.',
        'Healthy: $0.60 \\times 120 = 72$ mL; output $70 \\times 72 = 5.04$ L/min.',
        'By enlarging, Joseph\'s ventricle keeps its stroke volume at three-quarters of normal despite a very low EF — the Frank–Starling mechanism at work. The price is a high filling pressure (his breathlessness) and a strained wall.'
      ],
      a: '55 mL and 3.85 L/min against 72 mL and 5.0 L/min.'
    }
  ],
  quiz: [
    { q: 'Heart failure with preserved ejection fraction (HFpEF) means that the ventricle…', choices: ['has stopped', 'squeezes normally but is stiff and fills poorly', 'is enlarged and squeezes weakly', 'has a leaking valve only'], a: 1,
      why: 'The EF is 50 % or more, but a thick, stiff ventricle needs a high pressure to fill, which backs up into the lungs.' },
    { q: 'Why are people with heart failure asked to weigh themselves every morning?', choices: ['to track muscle loss', 'because fluid builds up — and shows on the scales — before breathlessness and swelling appear', 'to calculate their medicine doses themselves', 'because weight loss is always the goal'], a: 1,
      why: 'A litre of retained fluid weighs a kilogram; a rise over a few days is an early warning that treatment may need adjusting.' },
    { q: 'An enlarged ventricle holds 200 mL at the end of filling and ejects 30 % of it. What is the stroke volume, in mL?', answer: 60, unit: 'mL',
      why: '0.30 × 200 = 60 mL — near normal despite a low EF, thanks to the enlargement.' },
    { q: 'Why does lying flat make a person with heart failure breathless?', choices: ['the lungs are compressed by the stomach', 'blood from the legs shifts into the chest, raising the pressure in the lungs\' vessels further', 'lying down lowers the heart rate too much', 'oxygen is heavier when lying down'], a: 1,
      why: 'Lying down returns more blood to the heart; a failing left ventricle cannot pass it on, so the pressure in the lung vessels rises and fluid seeps into the lungs.' },
    { q: 'Diuretics ("water tablets") are the main medicines that lengthen life in heart failure with reduced ejection fraction.', a: false,
      why: 'Diuretics relieve congestion. The four classes shown to lengthen life are ACE inhibitors/ARBs/ARNI, beta blockers, mineralocorticoid receptor antagonists and SGLT2 inhibitors.' }
  ],
  applications: ['Natriuretic peptide blood tests in primary care to rule heart failure in or out.', 'Heart-failure nurse teams and telemonitoring of weight and symptoms.', 'Implantable defibrillators and resynchronisation pacemakers.', 'Mechanical heart pumps and transplantation for advanced disease.'],
  history: 'William Withering described foxglove, the source of digoxin, for "dropsy" in 1785. The CONSENSUS trial of 1987, with the ACE inhibitor enalapril, was among the first to show that a medicine could lengthen life in heart failure; each of the "four pillars" was proved in trials between the 1990s and the 2020s.',
  sim: [{ id: 'cv-starling', params: { heart: 'hfref', edp: 20 } }, { id: 'cv-wiggers', params: { emax: 1.0, ppv: 18 } }]
},

{
  id: 'arrhythmias', parent: 'heart-disease', title: 'Arrhythmias and atrial fibrillation', level: 2,
  short: 'Heart rhythms that are too fast, too slow or irregular. Many are harmless; atrial fibrillation, the commonest lasting one, multiplies the risk of stroke; ventricular fibrillation is cardiac arrest.',
  keywords: ['arrhythmia', 'atrial fibrillation', 'AF', 'AFib', 'palpitations', 'bradycardia', 'tachycardia', 'heart block', 'pacemaker', 'SVT', 'ventricular tachycardia', 'ventricular fibrillation', 'ectopic beats', 'anticoagulant', 'CHA2DS2-VA', 'ablation', 'cardioversion', 'defibrillator', 'ICD', 'smartwatch'],
  prereq: ['ecg', 'cardiac-cycle', 'hemostasis'],
  related: ['stroke', 'cpr', 'heart-failure', 'electrolytes', 'thyroid', 'sleep-apnea', 'alcohol'],
  body: `
Nadia, 68, felt her heart fluttering and racing on and off for weeks and blamed coffee. A smartwatch alert finally sent her to her doctor, and an ECG showed **atrial fibrillation**. Because of her age and her high blood pressure, her risk of a stroke was high enough that she was offered a blood-thinning medicine — although she felt only mildly unwell.

### How rhythms go wrong
A normal beat starts in the sinus node and travels through the conduction system ([[heart-anatomy]]). Rhythms go wrong in a few basic ways:
- **Too slow** (bradycardia): the sinus node fires too slowly, or its impulse is blocked on the way — **heart block** at the AV node. Slow rates are normal in fit people and in sleep; they matter when they cause dizziness, fainting or breathlessness. A dangerous slow rhythm is treated with a **pacemaker**, a small device under the collarbone that sends an impulse whenever the heart's own fails.
- **Too fast** (tachycardia): an irritable spot fires rapidly, or the impulse circles round a loop and re-excites the heart again and again (*re-entry*). Supraventricular tachycardia comes in sudden runs of 150–250 a minute, often in young, healthy people; it can often be stopped by a straining manoeuvre or a medicine and cured by catheter ablation. Ventricular tachycardia, from the ventricles and usually in a damaged heart, is dangerous.
- **Extra beats** (ectopics): single early beats from the atria or ventricles, felt as a skipped or thumping beat — very common and usually harmless.

**Ventricular fibrillation** is the extreme: chaotic electrical activity with no pumping at all — cardiac arrest. Without CPR and a shock from a defibrillator, death follows within minutes. On average only about one person in ten survives an arrest outside hospital in Europe and North America, but early bystander CPR and defibrillation can double or triple that ([[cpr|CPR and defibrillation]]).

### Atrial fibrillation
In **atrial fibrillation** (AF) the atria stop contracting in an orderly way and quiver, bombarding the AV node with hundreds of impulses a minute; the ventricles respond irregularly and often fast. The pulse is *irregularly irregular*, and the ECG has no P waves — compare it with sinus rhythm in the simulation. About 2–4 % of adults have AF, rising steeply with age, and between one person in three and one in five develops it in their lifetime. Risk factors include age, high blood pressure, obesity, alcohol, sleep apnoea, diabetes, heart failure, valve disease and an overactive thyroid ([[thyroid]]).

Some people feel palpitations, breathlessness, tiredness or dizziness; many feel nothing. The main danger is elsewhere: blood stagnates in a pouch of the left atrium, clots form, and a clot carried to the brain causes a **stroke** ([[stroke]]). AF raises the risk of stroke about fivefold, and its strokes tend to be severe.

Treatment has three parts.

**1. Preventing strokes** with an anticoagulant — a direct oral anticoagulant or warfarin. In trials warfarin cut strokes in AF by about two-thirds compared with no treatment; the direct anticoagulants prevent about a fifth more strokes than warfarin, with about half the bleeding inside the skull. Aspirin is not recommended for this. Whether to start depends on the stroke risk, estimated with a score such as CHA₂DS₂-VA (European guideline, 2024):

| Factor | Points |
|---|---|
| Congestive heart failure | 1 |
| Hypertension | 1 |
| Age 75 or over | 2 |
| Diabetes | 1 |
| Stroke, mini-stroke or another clot before | 2 |
| Vascular disease (heart attack, peripheral artery disease, aortic plaque) | 1 |
| Age 65–74 | 1 |

The European guideline recommends an anticoagulant from a score of 2 and advises considering one at 1; American guidelines use an older version of the score that also counts female sex. The decision also weighs the risk of bleeding and is made with a doctor.

**2. Controlling the rate or the rhythm**: medicines that slow conduction through the AV node, or restoring normal rhythm with medicines, an electric shock (cardioversion) or **catheter ablation**, which electrically isolates the pulmonary veins where AF usually starts.

**3. Treating the causes**: blood pressure, weight, alcohol and sleep apnoea. In trials, losing weight and drinking less made AF return less often ([[alcohol]]).

> [!warn] Call your local emergency number if palpitations come with chest pain, fainting, severe breathlessness, or signs of a stroke — a drooping face, a weak arm, slurred speech. If someone collapses and is not breathing normally, call, start CPR and send for a defibrillator. Palpitations without these signs are worth an ECG soon, ideally while they are happening.
`,
  ideas: [
    'Arrhythmias are rhythms that are too slow, too fast or irregular; single extra beats are common and usually harmless.',
    'Slow rhythms that cause symptoms are treated with pacemakers; many fast ones can be cured by catheter ablation.',
    'Ventricular fibrillation is cardiac arrest: only CPR and a defibrillator shock can reverse it.',
    'Atrial fibrillation gives an irregularly irregular pulse with no P waves, and raises the risk of stroke about fivefold whether or not it is felt.',
    'AF care means preventing strokes (anticoagulants, chosen by a risk score), controlling rate or rhythm, and treating the causes.'
  ],
  pitfalls: [
    'Palpitations always mean heart disease — Most are extra beats or a normal fast rhythm from anxiety, caffeine, fever or exercise. Persistent palpitations, or any with warning signs, still need checking.',
    'If atrial fibrillation causes no symptoms, it needs no treatment — The stroke risk is the same whether or not it is felt; the decision on anticoagulation depends on the risk score.',
    'A defibrillator restarts a heart that has stopped completely (a flat line) — Shocks reset ventricular fibrillation and pulseless ventricular tachycardia. A flat line (asystole) is not shockable; CPR and medicines are used.'
  ],
  formulas: [
    {
      name: 'Risk building up over the years',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1 - p)^{n}',
      vars: {
        P: { name: 'chance of at least one event over the period', q: 'ratio', unit: '%' },
        p: { name: 'yearly risk', q: 'ratio', unit: '%', value: 4, min: 0, max: 30 },
        n: { name: 'number of years', value: 10, min: 0, max: 60 }
      },
      note: 'Assumes the yearly risk stays the same (in reality it rises with age). A risk that sounds small each year adds up.',
      practice: { unknowns: ['P'] },
      stories: { P: 'A person with atrial fibrillation has a stroke risk of {p} a year. What is the chance of a stroke over {n} years, if the risk stays constant?' }
    },
    {
      name: 'Risk with a treatment',
      expr: 'p1 = p0*(1 - RRR)', tex: 'p_1 = p_0\\,(1 - \\text{RRR})',
      vars: {
        p1: { name: 'risk with treatment', q: 'ratio', unit: '%', tex: 'p_1' },
        p0: { name: 'risk without treatment', q: 'ratio', unit: '%', value: 4, min: 0, max: 30, tex: 'p_0' },
        RRR: { name: 'relative risk reduction of the treatment', q: 'ratio', unit: '%', value: 64, min: 0, max: 100, tex: '\\text{RRR}' }
      },
      note: 'Warfarin reduced strokes in AF by about 64 % against no treatment in trials. The absolute gain, p₀ − p₁, is what matters to a person.',
      practice: { unknowns: ['p1'] },
      stories: { p1: 'Without treatment a person\'s stroke risk is {p0} a year. An anticoagulant reduces it by {RRR}. What is the yearly risk with treatment?' }
    }
  ],
  examples: [
    {
      title: 'Nadia\'s stroke risk',
      q: 'Nadia is 68 and has high blood pressure; she has no heart failure, diabetes, vascular disease or previous stroke. Work out her CHA₂DS₂-VA score. Then, supposing her yearly stroke risk is 3 % untreated and an anticoagulant cuts it by 64 %, compare the ten-year chances of a stroke with and without treatment.',
      steps: [
        'Score: age 65–74 → 1; hypertension → 1; total 2. The European guideline recommends an anticoagulant.',
        'Untreated, ten years: $1 - 0.97^{10} = 0.26$ — about one chance in four.',
        'Treated: yearly risk $3\\ \\% \\times (1 - 0.64) = 1.08\\ \\%$; ten years: $1 - 0.9892^{10} \\approx 0.10$.',
        'The treatment would roughly cut the ten-year chance from 26 % to 10 % — to be weighed with her doctor against the risk of bleeding.'
      ],
      a: 'Score 2; about 26 % untreated versus about 10 % treated over ten years (on these assumed figures).'
    },
    {
      title: 'Counting an irregular pulse',
      q: 'On a 10-second rhythm strip the QRS complexes are irregularly spaced, with no P waves, and there are 18 of them. What is the heart rate?',
      steps: [
        'With an irregular rhythm, the 300 rule does not work: count beats over a fixed time instead.',
        'Ten seconds is a sixth of a minute: $18 \\times 6 = 108$ a minute.',
        'Irregularly irregular, no P waves, rate about 108: atrial fibrillation with a fast ventricular rate.'
      ],
      a: 'About 108 a minute — atrial fibrillation with a fast ventricular response.'
    }
  ],
  quiz: [
    { q: 'Which pulse is typical of atrial fibrillation?', choices: ['regular and slow', 'regular and fast', 'irregularly irregular', 'regular with one dropped beat every fourth beat'], a: 2,
      why: 'The quivering atria send impulses chaotically, so the ventricles beat at random intervals — no pattern at all.' },
    { q: 'Why does atrial fibrillation cause strokes?', choices: ['it raises blood pressure in the brain', 'blood stagnates in the quivering left atrium, clots form and can travel to the brain', 'it damages the carotid arteries', 'the fast rate starves the brain of oxygen'], a: 1,
      why: 'Clots form in the left atrial appendage where blood pools; swept into the aorta they often lodge in the brain\'s arteries.' },
    { q: 'A 10-second strip shows 18 QRS complexes. What is the heart rate, per minute?', answer: 108,
      why: '10 s is one sixth of a minute: 18 × 6 = 108.' },
    { q: 'Occasional single extra beats (ectopics), felt as a skipped or thumping beat, are usually harmless.', a: true,
      why: 'They are very common in healthy hearts. They deserve checking if they are very frequent, come with fainting or chest pain, or occur in someone with known heart disease.' },
    { q: 'What is the CHA₂DS₂-VA score of a 76-year-old with diabetes and no other risk factors?', answer: 3,
      why: 'Age 75 or over scores 2 and diabetes 1: a total of 3.' }
  ],
  applications: ['Pacemakers, implantable defibrillators and public-access defibrillators.', 'Catheter ablation, which cures many fast rhythms.', 'Anticoagulation clinics and stroke prevention in atrial fibrillation.', 'Smartwatch and patch monitoring for rhythms that come and go.'],
  history: 'Thomas Lewis identified atrial fibrillation on the ECG in 1909. The first fully implanted pacemaker was placed in Sweden in 1958, and the first implantable defibrillator in 1980.',
  sim: { id: 'ref-ecg', params: { rhythm: 'afib' } }
},

{
  id: 'cholesterol-lipids', parent: 'heart-disease', title: 'Cholesterol and lipids', level: 2,
  short: 'Fats in the blood travel in protein-coated particles. LDL carries cholesterol into artery walls and causes atherosclerosis — so lower and for longer is better; HDL and triglycerides are markers. What the test measures, the units, the targets and the treatments.',
  keywords: ['cholesterol', 'LDL', 'HDL', 'triglycerides', 'lipoprotein', 'lipoprotein(a)', 'Lp(a)', 'non-HDL cholesterol', 'Friedewald', 'familial hypercholesterolaemia', 'statin', 'ezetimibe', 'PCSK9', 'lipid profile', 'mmol/L', 'mg/dL', 'saturated fat'],
  prereq: ['chemistry:lipids', 'lab-tests', 'liver-function'],
  related: ['atherosclerosis', 'healthy-diet', 'macronutrients', 'risk-communication', 'dna-genes', 'metabolic-syndrome'],
  body: `
A routine blood test comes back with a row of numbers: total cholesterol 5.2, HDL 1.3, triglycerides 1.5 and LDL 3.2 mmol/L — or, in the units used in the United States and some other countries, 201, 50, 133 and 124 mg/dL. What do they mean, and which one matters?

### Fat in a watery world
Cholesterol and triglycerides are fats ([[chemistry:lipids|lipids]]), and fats do not dissolve in blood. They travel in **lipoproteins**: tiny spheres with an oily core of cholesterol and triglycerides and a coat of phospholipids and proteins (apolipoproteins) that act as address labels.
- **Chylomicrons** carry fat from a meal away from the gut.
- **VLDL**, made by the liver, delivers triglycerides to muscles and fat tissue; as it unloads, it shrinks into **LDL**.
- **LDL** carries most of the blood's cholesterol to cells, which take it in through LDL receptors — above all in the liver ([[liver-function]]).
- **HDL** collects surplus cholesterol from the tissues and returns it to the liver.
- **Lipoprotein(a)** is an LDL-like particle with an extra protein; its level is set mostly by genes.

The body makes most of its own cholesterol and needs it — for cell membranes, hormones, vitamin D and bile. The trouble is the amount circulating in LDL and similar particles.

### Why LDL matters
Genetics, population studies and dozens of randomised trials all point the same way: LDL particles that enter the artery wall cause [[atherosclerosis]], and the damage depends on how high LDL is and for how long. People born with gene variants that lower LDL have far fewer heart attacks; people with **familial hypercholesterolaemia** — about 1 in 250 — have roughly double the normal LDL from birth and, untreated, may have heart attacks in their thirties or forties. Lowering LDL lowers risk: in a meta-analysis of statin trials, each 1 mmol/L (39 mg/dL) reduction cut major cardiovascular events by about 22 % (Cholesterol Treatment Trialists' Collaboration, 2010), and the benefit grows the longer it lasts.

HDL is different: low HDL goes with higher risk, but medicines that raised it did not, by doing so, prevent heart attacks — it is a marker, not a target. High **triglycerides** also mark risk, often alongside obesity, diabetes or alcohol; very high levels, above about 10 mmol/L (about 880 mg/dL), can cause pancreatitis.

### Reading the test
| Measure | Converting units | What it tells you |
|---|---|---|
| Total cholesterol | mg/dL = mmol/L × 38.67 | everything together; not much use alone |
| LDL cholesterol | × 38.67 | the main target of treatment |
| HDL cholesterol | × 38.67 | a risk marker, not a target |
| Non-HDL cholesterol | total minus HDL | all the particles that can make plaque; useful when triglycerides are high |
| Triglycerides | mg/dL = mmol/L × 88.57 | a risk marker; raised by a recent meal |

Fasting is not usually needed. LDL is often *calculated* from the other three with the Friedewald formula, which becomes unreliable when triglycerides are high; laboratories then measure LDL directly or use newer formulas. Reference ranges vary between laboratories, and there is no single "normal" LDL: the right level depends on overall risk. The 2019 European guidelines aim for an LDL below 3.0 mmol/L (116 mg/dL) at low risk, 2.6 (100) at moderate risk, 1.8 (70) at high risk and 1.4 (55) at very high risk, such as after a heart attack; they also advise measuring lipoprotein(a) once in a lifetime. The [lab-unit converter](#/tools/clinical/blood) switches between mmol/L and mg/dL.

### Lowering LDL
Diet helps: replacing saturated fat (fatty meat, butter, coconut and palm oil) with unsaturated fats (olive and rapeseed oil, nuts, fish), eating plenty of fibre (oats, beans) and fewer processed foods typically lowers LDL by 5–15 % ([[healthy-diet]]). When the risk is high, medicines do much more. **Statins**, which slow the liver's own cholesterol production so that it pulls more LDL out of the blood, lower LDL by 30–50 % or more; **ezetimibe** blocks absorption from the gut; injected **PCSK9 inhibitors** and **inclisiran**, and oral **bempedoic acid**, lower it further. Statins are among the most studied medicines: in blinded trials most of the muscle aches reported by people taking them happened just as often with a placebo, though statins slightly raise the chance of developing diabetes. Whether to treat, and how far, is a decision to share with a doctor, based on the absolute risk ([[risk-communication]]).
`,
  ideas: [
    'Cholesterol and triglycerides travel in lipoproteins; LDL carries cholesterol to the tissues and into artery walls.',
    'LDL causes atherosclerosis in proportion to how high it is and for how long: each 1 mmol/L lower cuts major events by about a fifth.',
    'HDL and triglycerides are risk markers; raising HDL with medicines has not helped.',
    'Cholesterol in mg/dL = mmol/L × 38.67 (triglycerides × 88.57); LDL is often calculated with the Friedewald formula.',
    'Targets depend on overall risk; diet helps a little, statins and newer medicines a lot.'
  ],
  pitfalls: [
    'Eating foods that contain cholesterol is the main thing that raises blood cholesterol — For most people saturated fat and genes matter more; the liver makes most of the body\'s cholesterol.',
    'HDL is "good cholesterol", so raising it protects the heart — Very high HDL is not protective, and raising HDL with medicines did not in itself prevent heart attacks.',
    'A "normal" cholesterol means no treatment is needed — After a heart attack, or at very high risk, LDL is lowered well below the population average.'
  ],
  formulas: [
    {
      name: 'LDL cholesterol (Friedewald)',
      expr: 'LDL = TC - HDL - TG/2.2', tex: '\\text{LDL} = \\text{TC} - \\text{HDL} - \\frac{\\text{TG}}{2.2}',
      vars: {
        LDL: { name: 'LDL cholesterol', q: 'cholesterol', unit: 'mmol/L', tex: '\\text{LDL}' },
        TC: { name: 'total cholesterol', q: 'cholesterol', unit: 'mmol/L', value: 5.2, tex: '\\text{TC}' },
        HDL: { name: 'HDL cholesterol', q: 'cholesterol', unit: 'mmol/L', value: 1.3, tex: '\\text{HDL}' },
        TG: { name: 'triglycerides', q: 'triglycerides', unit: 'mmol/L', value: 1.5, tex: '\\text{TG}' }
      },
      note: 'Written in mmol/L (in mg/dL the last term is TG/5; the unit menus convert either way). TG/2.2 estimates the cholesterol carried in VLDL. Unreliable when triglycerides exceed about 4.5 mmol/L (400 mg/dL) or LDL is very low.',
      practice: { unknowns: ['LDL'] },
      stories: { LDL: 'A lipid profile shows total cholesterol {TC}, HDL {HDL} and triglycerides {TG}. Estimate the LDL cholesterol.' }
    },
    {
      name: 'Non-HDL cholesterol',
      expr: 'nonHDL = TC - HDL', tex: '\\text{non-HDL} = \\text{TC} - \\text{HDL}',
      vars: {
        nonHDL: { name: 'non-HDL cholesterol', q: 'cholesterol', unit: 'mmol/L', tex: '\\text{non-HDL}' },
        TC: { name: 'total cholesterol', q: 'cholesterol', unit: 'mmol/L', value: 5.2, tex: '\\text{TC}' },
        HDL: { name: 'HDL cholesterol', q: 'cholesterol', unit: 'mmol/L', value: 1.3, tex: '\\text{HDL}' }
      },
      note: 'The cholesterol in all the particles that can enter artery walls (LDL, VLDL, remnants and Lp(a)); needs no fasting and no formula.',
      practice: { unknowns: ['nonHDL'] },
      stories: { nonHDL: 'Total cholesterol is {TC} and HDL {HDL}. What is the non-HDL cholesterol?' }
    },
    {
      name: 'Benefit of lowering LDL (trial average)',
      expr: 'RR = 0.78^dLDL', tex: '\\text{RR} = 0.78^{\\,\\Delta\\text{LDL}}',
      vars: {
        RR: { name: 'relative risk of major cardiovascular events', tex: '\\text{RR}' },
        dLDL: { name: 'reduction in LDL cholesterol', q: 'cholesterol', unit: 'mmol/L', value: 1.5, tex: '\\Delta\\text{LDL}' }
      },
      note: 'About 22 % fewer major events per 1 mmol/L (39 mg/dL) lower LDL over about five years, from the Cholesterol Treatment Trialists\' meta-analysis (2010); assumes the effect multiplies for larger reductions. The fitted constant 0.78 applies to LDL in mmol/L.',
      practice: { unknowns: ['RR'] },
      stories: { RR: 'A treatment lowers LDL cholesterol by {dLDL}. On the trial average, by what factor does it multiply the risk of a major cardiovascular event?' }
    }
  ],
  examples: [
    {
      title: 'Working out LDL',
      q: 'A report gives total cholesterol 5.2 mmol/L, HDL 1.3 mmol/L and triglycerides 1.5 mmol/L. Estimate LDL and non-HDL cholesterol, and check the answer in mg/dL.',
      steps: [
        'Friedewald: $5.2 - 1.3 - 1.5/2.2 = 5.2 - 1.3 - 0.68 = 3.22$ mmol/L.',
        'Non-HDL: $5.2 - 1.3 = 3.9$ mmol/L.',
        'In mg/dL: total $5.2 \\times 38.67 = 201$, HDL 50, triglycerides $1.5 \\times 88.57 = 133$; LDL $= 201 - 50 - 133/5 = 124$ mg/dL, which is $3.22 \\times 38.67$. The two unit systems agree.'
      ],
      a: 'LDL about 3.2 mmol/L (124 mg/dL); non-HDL 3.9 mmol/L (151 mg/dL).'
    },
    {
      title: 'How much does lowering LDL help?',
      q: 'A treatment lowers someone\'s LDL from 3.8 to 1.8 mmol/L. On the trial average, how much does that reduce the risk of major cardiovascular events? If the person\'s ten-year risk was 15 %, what is the absolute gain?',
      steps: [
        'Reduction: 2.0 mmol/L (77 mg/dL).',
        'Relative risk: $0.78^{2.0} = 0.61$ — about 39 % fewer events.',
        'Ten-year risk: $15\\ \\% \\times 0.61 = 9.1\\ \\%$; absolute gain about 5.9 percentage points, so about 17 people treated for ten years prevent one event.',
        'The same 2 mmol/L reduction would give much less absolute gain to someone whose risk was 3 % — which is why treatment is decided by overall risk.'
      ],
      a: 'About 39 % fewer events; 15 % → about 9 % over ten years (about 1 event prevented per 17 people treated).'
    }
  ],
  quiz: [
    { q: 'Which particles carry most of the cholesterol that ends up in artery-wall plaques?', choices: ['HDL', 'LDL (and other apoB-containing particles)', 'chylomicrons only', 'free cholesterol dissolved in plasma'], a: 1,
      why: 'LDL and related particles (VLDL remnants, Lp(a)) enter the wall and are trapped there; HDL carries cholesterol away.' },
    { q: 'An LDL of 3.0 mmol/L is how many mg/dL?', answer: 116, unit: 'mg/dL',
      why: '3.0 × 38.67 = 116 mg/dL.' },
    { q: 'Medicines that raise HDL cholesterol have been shown to prevent heart attacks.', a: false,
      why: 'Drugs that raised HDL substantially, such as niacin and several CETP inhibitors, did not reduce events in large trials (the small benefit seen with one of them was explained by its lowering of non-HDL cholesterol). HDL is a marker of risk, not a target.' },
    { q: 'When does the Friedewald estimate of LDL become unreliable?', choices: ['when HDL is high', 'when triglycerides are high (above about 4.5 mmol/L)', 'in anyone over 60', 'when the sample is not fasting for 24 hours'], a: 1,
      why: 'The formula assumes a fixed ratio of triglycerides to cholesterol in VLDL, which breaks down when triglycerides are high; laboratories then measure LDL directly or use newer equations.' },
    { q: 'A statin lowers LDL by 1.5 mmol/L. By roughly how much does that reduce major cardiovascular events, on the trial average?', choices: ['about 10 %', 'about 30 %', 'about 50 %', 'about 78 %'], a: 1,
      why: '0.78^1.5 ≈ 0.69, so about 31 % fewer events.' }
  ],
  applications: ['Lipid testing and cardiovascular risk assessment in primary care.', 'Cascade testing of relatives of people with familial hypercholesterolaemia.', 'Food labelling and public-health policy on saturated and trans fats.', 'Choosing between statins and newer LDL-lowering medicines.'],
  history: 'Akira Endo found the first statin in a mould in 1973. Michael Brown and Joseph Goldstein discovered the LDL receptor by studying familial hypercholesterolaemia and shared the Nobel Prize in 1985. The Scandinavian Simvastatin Survival Study (4S, 1994) first showed that a statin saves lives.',
  sim: { id: 'cv-plaque', params: { ldl: 4.5 } }
}

);
