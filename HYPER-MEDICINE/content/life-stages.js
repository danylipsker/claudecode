/* HYPER-MEDICINE · content/life-stages.js — Life stages: pregnancy, birth and the newborn,
 * child growth and development, menopause, ageing. Simulations in sims/prevention.js. */
Hyper.add(

/* ================================================================ PREGNANCY */
{
  id: 'pregnancy', parent: 'life-stages', title: 'Pregnancy', level: 1,
  short: 'About 40 weeks from the last period to birth, in three trimesters. How the weeks are counted, how the mother\'s body changes, the care that keeps mother and baby safe — and the warning signs that need urgent help.',
  keywords: ['pregnancy', 'gestational age', 'due date', 'trimester', 'last menstrual period', 'hCG', 'placenta', 'antenatal care', 'prenatal care', 'folic acid', 'pre-eclampsia', 'gestational diabetes', 'morning sickness', 'dating scan', 'crown-rump length', 'maternal mortality', 'warning signs in pregnancy'],
  prereq: ['reproductive-hormones', 'endocrine-system', 'cardiac-output'],
  related: ['birth-newborn', 'hypertension', 'glucose-regulation', 'anemia', 'vaccines', 'smoking', 'alcohol', 'depression'],
  body: `
Leila's period is a week late, and a home test shows two lines. She is 31, it is her first pregnancy, and she has a dozen questions at once: how far along is she, when is the baby due, what should she stop or start, and what is normal?

### Counting the weeks
Pregnancy is dated from the first day of the last menstrual period (LMP), about two weeks before conception, so at a missed period a woman is already about four weeks pregnant. A typical pregnancy lasts 40 weeks — 280 days — from that date, in three **trimesters**: weeks 1–13, 14–27, and 28 to birth. The due date is only an estimate: a birth between 37 and 42 weeks is "term", and only about one baby in twenty-five arrives on the day itself. An ultrasound scan in the first trimester, measuring the embryo's crown–rump length, dates a pregnancy more precisely than the calendar.

### How the body changes
From implantation the developing placenta releases **hCG**, the hormone that pregnancy tests detect, which keeps the ovary making progesterone until the placenta takes over. Progesterone relaxes smooth muscle — in the womb, but also in the gut (heartburn, constipation) and the blood vessels. The changes are large:

| System | Change by late pregnancy (approximate) |
|---|---|
| Blood volume | up 40–50 %; plasma rises more than red cells, so haemoglobin concentration falls a little |
| Heart | [[cardiac-output|cardiac output]] up 30–50 %, from a faster rate and a larger stroke volume |
| Breathing | more air per breath; the growing womb pushes the diaphragm up |
| Kidneys | filtration (GFR) up about 50 % |
| Metabolism | rising insulin resistance in the second half, sparing glucose for the baby |
| Clotting | blood clots more readily — protection against bleeding at birth, but a risk of clots in the legs and lungs |

Nausea, often in the first trimester and not only in the morning, affects most pregnant women and usually settles by 16–20 weeks; vomiting so severe that food and drink will not stay down (hyperemesis gravidarum) needs treatment.

### Care that makes a difference
The WHO recommends at least eight contacts with a health worker during pregnancy (2016). Antenatal care checks blood pressure and urine, looks for anaemia, blood group and antibodies, infections such as HIV, syphilis and hepatitis B, and gestational diabetes (usually at 24–28 weeks), and offers scans and screening tests for the baby. What helps:

- a folic acid supplement from before conception to 12 weeks, to prevent neural tube defects such as spina bifida (guidelines commonly advise 400 micrograms a day; some women are advised more);
- no alcohol — no amount is known to be safe — and no smoking; help to stop is part of antenatal care;
- the vaccines many countries recommend in pregnancy — influenza, whooping cough (pertussis), COVID-19 and, in some, RSV — which also protect the newborn;
- food safety: avoid unpasteurised milk and soft cheeses, undercooked meat and eggs, and limit caffeine;
- staying active: 150 minutes a week of moderate activity, unless there is a medical reason not to (WHO, 2020);
- checking every medicine, including herbal remedies, with a doctor, midwife or pharmacist.

Pregnancy is far safer than it was, but not everywhere: about 260,000 women died from pregnancy and childbirth in 2023 (UN estimates, 2025), over 90 % of them in low- and lower-middle-income countries, most from bleeding after birth, high blood pressure (pre-eclampsia and eclampsia), infection and complications of delivery — nearly all preventable with good care. About one woman in ten has depression or anxiety during pregnancy or after birth; it is common, treatable and worth mentioning at any visit.

> [!warn] Warning signs in pregnancy that need urgent care: vaginal bleeding; fluid leaking from the vagina; severe or constant abdominal pain; a severe headache, blurred vision or flashing lights, or sudden swelling of the face and hands (possible pre-eclampsia); fever; the baby moving less than usual or not at all; a fit; chest pain or difficulty breathing; vomiting so severe that nothing stays down; or thoughts of harming yourself or the baby. Contact your maternity unit or midwife at once — and for heavy bleeding, a fit, collapse, chest pain or trouble breathing, call your local emergency number.
`,
  ideas: [
    'Pregnancy is counted from the first day of the last period: 40 weeks (280 days), in three trimesters; term is 37–42 weeks.',
    'hCG from the placenta keeps progesterone flowing early on; progesterone relaxes smooth muscle throughout the body.',
    'Blood volume rises by 40–50 %, cardiac output by 30–50 % and kidney filtration by about 50 %.',
    'Folic acid, no alcohol or tobacco, recommended vaccines and regular antenatal checks prevent much harm.',
    'Bleeding, severe headache with visual changes, reduced movements, fever, fits or breathlessness need urgent care.'
  ],
  pitfalls: [
    'The due date is when the baby will come — Only about 4 % of babies arrive on it; anywhere from 37 to 42 weeks is normal.',
    'A little alcohol is known to be safe in pregnancy — No safe amount has been established, so guidelines advise none.',
    'Swelling and headaches are always just part of pregnancy — Mild ankle swelling is common, but sudden swelling of the face and hands or a severe headache with visual changes can mean pre-eclampsia and needs checking the same day.'
  ],
  formulas: [
    {
      name: 'Cardiac output in pregnancy',
      expr: 'CO = HR*SV', tex: '\\text{CO} = \\text{HR} \\times \\text{SV}',
      vars: {
        CO: { name: 'cardiac output', q: 'flowrate', unit: 'L/min', tex: '\\text{CO}' },
        HR: { name: 'heart rate', q: 'frequency', unit: 'bpm', value: 85, tex: '\\text{HR}' },
        SV: { name: 'stroke volume', q: 'volume', unit: 'mL', value: 85, tex: '\\text{SV}' }
      },
      note: 'Before pregnancy a typical woman at rest might have 70 beats/min × 70 mL ≈ 4.9 L/min; by the third trimester both rise, by 10–20 beats and 10–20 mL.',
      stories: { CO: 'In late pregnancy a woman\'s resting heart rate is {HR} and her stroke volume {SV}. What is her cardiac output?', SV: 'A pregnant woman\'s cardiac output is {CO} at a heart rate of {HR}. What is her stroke volume?' }
    },
    {
      name: 'Dating a pregnancy from the crown–rump length (Robinson)',
      expr: 'GA = 8.052*sqrt(CRL) + 23.73', tex: '\\text{GA} = 8.052 \\sqrt{\\text{CRL}} + 23.73',
      vars: {
        GA: { name: 'gestational age (days)', tex: '\\text{GA}' },
        CRL: { name: 'crown–rump length (mm)', value: 45, min: 5, max: 90, tex: '\\text{CRL}' }
      },
      note: 'Robinson and Fleming (1975), valid for a crown–rump length of about 10–84 mm (roughly 7 to 14 weeks). Divide by 7 for weeks. Scanning and dating are done by trained staff; this shows the principle.',
      stories: { GA: 'A first-trimester scan measures a crown–rump length of {CRL} mm. Estimate the gestational age in days.', CRL: 'What crown–rump length, in mm, would you expect at {GA} days?' }
    }
  ],
  examples: [
    {
      title: 'Leila\'s due date',
      q: 'The first day of Leila\'s last period was 10 March 2026. When is her baby due, and how many weeks pregnant is she on 1 July 2026?',
      steps: [
        'Due date: 280 days after 10 March 2026 is 15 December 2026.',
        'Naegele\'s rule (add a year, subtract three months, add seven days) gives 17 December — the two differ by a day or two because months differ in length.',
        'On 1 July: 113 days since 10 March, and $113 = 16 \\times 7 + 1$, so she is 16 weeks and 1 day — in the second trimester.',
        'A first-trimester scan may move the date by a few days; the scan date is then used.'
      ],
      a: 'Due about 15 December 2026; 16 weeks and 1 day on 1 July.'
    },
    {
      title: 'The heart works harder',
      q: 'Before pregnancy a woman\'s resting heart rate is 70 beats/min and her stroke volume 70 mL. In the third trimester they are 85 beats/min and 85 mL. By how much has her cardiac output risen?',
      steps: [
        'Before: $70 \\times 70 = 4{,}900$ mL/min $= 4.9$ L/min.',
        'Late pregnancy: $85 \\times 85 = 7{,}225$ mL/min $\\approx 7.2$ L/min.',
        'Rise: $7.2/4.9 - 1 \\approx 47\\,\\%$ — within the usual 30–50 %, and part of why pre-existing heart disease needs specialist care in pregnancy.'
      ],
      a: 'From 4.9 to about 7.2 L/min, a rise of about 47 %.'
    },
    {
      title: 'A dating scan',
      q: 'A scan shows a crown–rump length of 45 mm. Estimate the gestational age.',
      steps: [
        '$\\text{GA} = 8.052\\sqrt{45} + 23.73 = 8.052 \\times 6.71 + 23.73 \\approx 77.7$ days.',
        '$77.7/7 \\approx 11.1$: about 11 weeks and 1 day.'
      ],
      a: 'About 11 weeks and 1 day.'
    }
  ],
  quiz: [
    { q: 'From which point are the weeks of pregnancy usually counted?', choices: ['the first day of the last menstrual period', 'the day of conception', 'the day of implantation', 'the first missed period'], a: 0,
      why: 'Dating starts at the last period, about two weeks before conception; at a missed period a woman is already about four weeks pregnant.' },
    { q: 'Which of these needs urgent assessment the same day?', choices: ['a severe headache with blurred vision at 34 weeks', 'mild ankle swelling at the end of the day', 'nausea at 8 weeks', 'occasional painless tightenings at 30 weeks'], a: 0,
      why: 'A severe headache with visual changes can be a sign of pre-eclampsia, which can become dangerous quickly. The others are common in normal pregnancy.' },
    { q: 'A small amount of alcohol has been shown to be safe in pregnancy.', a: false,
      why: 'No safe level has been established, so guidelines advise no alcohol in pregnancy.' },
    { q: 'Why does the haemoglobin concentration usually fall a little in pregnancy even when iron is adequate?', choices: ['plasma volume rises more than red cell mass', 'the baby destroys red cells', 'the bone marrow stops working', 'iron is lost in the urine'], a: 0,
      why: 'Blood volume rises by 40–50 %, but plasma more than red cells, diluting them. True iron-deficiency anaemia is also common and is checked for.' },
    { q: 'Roughly what share of babies are born on their estimated due date?', choices: ['about 4 %', 'about 50 %', 'about 25 %', 'about 90 %'], a: 0,
      why: 'Only about one in twenty-five; birth anywhere between 37 and 42 weeks is normal.' }
  ],
  applications: ['Antenatal care and screening programmes.', 'Preventing neural tube defects with folic acid (and flour fortification in many countries).', 'Vaccination in pregnancy to protect newborns against whooping cough, flu and RSV.', 'Detecting pre-eclampsia by checking blood pressure and urine at every visit.'],
  sim: 'prev-pregnancy-weeks'
},

/* ================================================================ BIRTH AND THE NEWBORN */
{
  id: 'birth-newborn', parent: 'life-stages', title: 'Birth and the newborn', level: 1,
  short: 'The three stages of labour, the first breaths that rewire the circulation, the Apgar score, the care of the first days — and the danger signs in a newborn that need help at once.',
  keywords: ['birth', 'labour', 'childbirth', 'caesarean section', 'placenta', 'cord clamping', 'newborn', 'neonate', 'Apgar score', 'foramen ovale', 'ductus arteriosus', 'skin-to-skin', 'breastfeeding', 'vitamin K', 'newborn screening', 'jaundice', 'safe sleep', 'sudden infant death', 'preterm birth', 'newborn danger signs'],
  prereq: ['pregnancy', 'heart-anatomy', 'ventilation'],
  related: ['child-growth', 'vaccines', 'cpr', 'thermoregulation', 'hemostasis', 'life-expectancy', 'smoking'],
  body: `
Tomás was born at 39 weeks after a twelve-hour labour. At one minute he was blue and floppy, with a weak cry; the midwife dried him and laid him skin to skin on his mother's chest, and by five minutes he was pink, crying lustily and nuzzling to feed. In those few minutes his body made the biggest changes of his life.

### Labour
Labour is described in three stages. In the **first stage** contractions of the womb become regular and stronger and the cervix thins and opens: a slow *latent* phase, which can last many hours, then an *active* phase from about 5 cm to full dilatation at 10 cm. The WHO's 2018 guidance moved away from fixed timetables such as "a centimetre an hour", because healthy labours vary widely. The **second stage** runs from full dilatation to the birth of the baby. In the **third stage** the placenta is delivered; a routine injection of oxytocin at this point roughly halves the risk of heavy bleeding, and waiting at least a minute before clamping the cord lets extra blood flow to the baby.

About one birth in five worldwide is now by caesarean section (WHO, 2021) — lifesaving when needed, but a major operation, with rates ranging from under 5 % in some countries to over 50 % in others.

### The first breaths
Before birth the lungs are full of fluid and blood bypasses them through two shortcuts: the **foramen ovale**, a flap between the atria, and the **ductus arteriosus** between the pulmonary artery and the aorta. With the first breaths the lungs expand, the resistance of their vessels falls and blood pours through them; pressure in the left atrium rises and pushes the flap of the foramen ovale shut, and over the next days the ductus closes as oxygen levels rise. A newborn breathes 40–60 times a minute and its heart beats about 110–160 times.

The **Apgar score** (Virginia Apgar, 1952) gives 0, 1 or 2 points at 1 and 5 minutes for each of colour (appearance), heart rate (pulse), response to stimulation (grimace), muscle tone (activity) and breathing (respiration). A score of 7–10 is reassuring; a low score calls for help with breathing — but resuscitation never waits for the score.

### The first days
- **Skin-to-skin contact** after birth keeps the baby warm, steadies breathing and blood sugar and helps breastfeeding start, ideally within the first hour; the WHO recommends breast milk alone for the first six months.
- **Vitamin K** is given at birth to prevent a rare but dangerous bleeding disorder.
- **Screening**: a heel-prick blood test for rare but treatable conditions (such as phenylketonuria, congenital hypothyroidism, sickle cell disease and cystic fibrosis), a hearing test, and a check of the heart, hips and eyes; vaccines such as hepatitis B and, in many countries, BCG.
- **Weight**: babies lose up to about 7–10 % of their birth weight in the first days and are usually back to it by about two weeks.
- **Jaundice** — yellow skin from bilirubin — is common and usually harmless in the first week, but needs checking if it appears in the first 24 hours or is deep.
- **Safe sleep**: on the back, in the baby's own cot with a firm, flat mattress and no pillows, bumpers or soft toys, in a smoke-free home and in the parents' room for the first months. "Back to sleep" campaigns more than halved sudden infant deaths.

About 2.3 million babies died in their first month of life in 2022 (UN estimates), most from complications of being born too early, problems around birth and infections — the majority preventable with skilled care at birth, warmth, early breastfeeding, clean cord care and prompt treatment of infection. Roughly one baby in ten is born preterm, before 37 weeks.

> [!warn] Danger signs in a newborn: not feeding, or feeding very poorly; a fit; fast breathing (60 or more breaths a minute), grunting, or the chest sucking in with each breath; a temperature of 37.5 °C or more, or feeling cold (below 35.5 °C); moving only when stimulated, or floppy and hard to wake; blue or grey lips; yellow skin in the first day, or yellow palms and soles; green vomit; a red, swollen or smelly umbilical stump. Get medical help straight away — and if the baby is not breathing normally, is having a fit or cannot be woken, call your local emergency number.

> [!note] After the birth the mother needs urgent care too for heavy bleeding (soaking a pad in an hour or less), fever, a severe headache, chest pain or breathlessness, a painful swollen leg, or thoughts of harming herself or the baby.
`,
  ideas: [
    'Labour has three stages: opening of the cervix, birth of the baby, delivery of the placenta.',
    'At the first breaths the lungs open, the foramen ovale and ductus arteriosus close, and the circulation switches from placenta to lungs.',
    'The Apgar score rates colour, pulse, grimace, tone and breathing from 0 to 2 each at 1 and 5 minutes.',
    'Skin-to-skin contact, early breastfeeding, vitamin K, screening, vaccines and safe sleep protect the newborn.',
    'Poor feeding, fits, fast or laboured breathing, fever or cold, floppiness and early jaundice are danger signs.'
  ],
  pitfalls: [
    'Jaundice in a newborn is always harmless — Mild jaundice after the first day usually is, but jaundice in the first 24 hours, deep jaundice or yellow palms and soles need prompt checking.',
    'Babies sleep more safely on their front or side — Sleeping on the back is safest and greatly lowers the risk of sudden infant death.',
    'Losing weight in the first days means breastfeeding is failing — A loss of up to about 7–10 % is normal; larger losses, or not regaining birth weight by about two weeks, deserve a feeding check.'
  ],
  formulas: [
    {
      name: 'The Apgar score',
      expr: 'S = Ap + Pu + Gr + Ac + Re', tex: 'S = A_p + P + G + A_c + R',
      vars: {
        S: { name: 'Apgar score (0–10)', int: true, min: 0, max: 10 },
        Ap: { name: 'appearance (colour): 0 blue or pale all over, 1 blue hands and feet, 2 pink', value: 1, int: true, min: 0, max: 2, tex: 'A_p' },
        Pu: { name: 'pulse: 0 absent, 1 below 100, 2 100 or more', value: 2, int: true, min: 0, max: 2, tex: 'P' },
        Gr: { name: 'grimace (reflex response): 0 none, 1 grimace, 2 cry or cough', value: 1, int: true, min: 0, max: 2, tex: 'G' },
        Ac: { name: 'activity (muscle tone): 0 floppy, 1 some flexion, 2 active movement', value: 1, int: true, min: 0, max: 2, tex: 'A_c' },
        Re: { name: 'respiration: 0 absent, 1 weak or irregular, 2 strong cry', value: 1, int: true, min: 0, max: 2, tex: 'R' }
      },
      note: 'Scored at 1 and 5 minutes (and every 5 minutes after if low). 7–10 is reassuring. It describes the baby\'s condition; it is not used to decide whether to start resuscitation.',
      practice: { unknowns: ['S'] },
      stories: { S: 'At one minute a baby has colour score {Ap}, pulse {Pu}, grimace {Gr}, tone {Ac} and breathing {Re}. What is the Apgar score?' }
    },
    {
      name: 'Newborn weight loss',
      expr: 'L = (W0 - W)/W0', tex: 'L = \\frac{W_0 - W}{W_0}',
      vars: {
        L: { name: 'weight lost since birth', q: 'ratio', unit: '%' },
        W0: { name: 'birth weight', q: 'mass', unit: 'kg', value: 3.4 },
        W: { name: 'weight today', q: 'mass', unit: 'kg', value: 3.1 }
      },
      note: 'Up to about 7–10 % in the first days is expected; more calls for a feeding assessment, as does not regaining birth weight by about two weeks.',
      practice: { unknowns: ['L', 'W'] },
      stories: { L: 'A baby born at {W0} weighs {W} on day 3. What share of the birth weight has been lost?', W: 'A baby born at {W0} has lost {L}. What does the baby weigh now?' }
    }
  ],
  examples: [
    {
      title: 'Tomás\'s scores',
      q: 'At one minute Tomás had a pink body with blue hands and feet, a heart rate of 120, a grimace when stimulated, some flexion of the limbs and a weak cry. At five minutes he was pink all over, crying strongly and moving actively, with a heart rate of 140, but his hands were still bluish. Score him.',
      steps: [
        'One minute: appearance 1, pulse 2 (100 or more), grimace 1, activity 1, respiration 1: total 6.',
        'Five minutes: appearance 1 (blue hands are very common and usually normal), pulse 2, grimace 2 (a strong cry), activity 2, respiration 2: total 9.',
        'A one-minute score of 6 with a quick rise to 9 is typical of a baby who needed a little stimulation to get going.'
      ],
      a: '6 at one minute, 9 at five minutes.'
    },
    {
      title: 'Is the weight loss normal?',
      q: 'A baby born weighing 3.40 kg weighs 3.10 kg on day 3. What share of the birth weight is that, and what weight would mark a 10 % loss?',
      steps: [
        'Loss: $(3.40 - 3.10)/3.40 = 0.30/3.40 \\approx 8.8\\,\\%$.',
        'A 10 % loss would be $3.40 \\times 0.9 = 3.06$ kg.',
        'At 8.8 % the loss is within the expected range, but close enough to the upper end that a midwife would watch feeding and check again.'
      ],
      a: 'About 8.8 %; a 10 % loss would be 3.06 kg.'
    }
  ],
  quiz: [
    { q: 'Which is a danger sign in a newborn that needs urgent help?', choices: ['breathing 70 times a minute with the chest sucking in', 'hiccups after feeds', 'sneezing', 'peeling skin on the hands and feet'], a: 0,
      why: 'Fast breathing (60 or more a minute) with chest indrawing can mean serious infection or a breathing problem. The others are common and normal.' },
    { q: 'What is the safest sleeping position for a healthy baby?', choices: ['on the back', 'on the front', 'on the side, propped with a pillow', 'in the parents\' bed between them'], a: 0,
      why: 'Back sleeping, on a firm flat surface without pillows or soft bedding, sharply lowers the risk of sudden infant death.' },
    { q: 'Jaundice that appears within the first 24 hours of life is a normal finding that needs no check.', a: false,
      why: 'Early jaundice can mean blood-group incompatibility or infection and needs prompt assessment; the common, harmless kind appears after the first day.' },
    { q: 'A baby at one minute is blue all over (0), has a heart rate of 90 (1), grimaces (1), has some flexion (1) and breathes weakly (1). What is the Apgar score?', answer: 4,
      why: '0 + 1 + 1 + 1 + 1 = 4 — a low score; the team would already be helping the baby breathe.' },
    { q: 'Why does the foramen ovale close after birth?', choices: ['pressure in the left atrium rises above that in the right once blood flows through the lungs', 'the umbilical cord is cut', 'the baby cries', 'the ductus arteriosus pulls it shut'], a: 0,
      why: 'When the lungs open, their resistance falls and much more blood returns to the left atrium, pushing the flap against the septum.' }
  ],
  applications: ['Neonatal resuscitation training for everyone who attends births.', 'Newborn blood-spot and hearing screening programmes.', 'Kangaroo mother care for small and preterm babies.', 'Safe-sleep campaigns against sudden infant death.'],
  history: 'Virginia Apgar, an American anaesthetist, introduced her score in 1952; for the first time the condition of every newborn was measured, and her score helped launch the modern care of newborns.'
},

/* ================================================================ CHILD GROWTH */
{
  id: 'child-growth', parent: 'life-stages', title: 'Child growth and development', level: 1,
  short: 'How children grow and learn: growth charts, centiles and z-scores, the WHO Child Growth Standards, the pubertal spurt, developmental milestones, stunting and wasting — and the signs that need a doctor.',
  keywords: ['child growth', 'growth chart', 'centile', 'percentile', 'z-score', 'WHO Child Growth Standards', 'height', 'weight', 'head circumference', 'stunting', 'wasting', 'mid-parental height', 'puberty', 'growth spurt', 'developmental milestones', 'first 1000 days', 'breastfeeding'],
  prereq: ['birth-newborn', 'math:normal-distribution', 'macronutrients'],
  related: ['vaccines', 'vitamins-minerals', 'obesity', 'reproductive-hormones', 'thyroid', 'physical-activity', 'bone-calcium'],
  body: `
Maya's parents are worried: at her two-year check she is near the 9th centile line for height, while her cousin of the same age is on the 75th. The nurse plots all of Maya's measurements since birth and shows them a smooth line running alongside the printed curves — Maya is small, like both her parents, and growing steadily. What would worry the nurse is not a low centile but a line that bends away from the curves.

### Growth charts and centiles
A growth chart shows how a measurement — weight, length or height, head circumference, body-mass index — is spread among healthy children of each age and sex. The **centile** lines mark the value below which a given percentage of children fall: the 50th is the median, and 2 children in 100 are below the 2nd centile. Clinicians also use **z-scores**, the number of standard deviations from the median (see the [[math:normal-distribution|normal distribution]]); −2 to +2 covers about 95 % of healthy children.

Most countries now use the **WHO Child Growth Standards** (2006) for children under five. They were built from healthy, breastfed children in six countries — Brazil, Ghana, India, Norway, Oman and the United States — whose families could give them a good start, and they showed that young children everywhere grow remarkably alike when their needs are met. So the charts describe how children *should* grow, not merely how they do. The WHO growth reference (2007) covers ages 5–19.

### How children grow
- **Weight** roughly doubles by 4–5 months and triples by the first birthday; length grows by about half in the first year (some 25 cm), about 12 cm in the second and then 5–6 cm a year through childhood.
- **The pubertal growth spurt** comes on average about two years earlier in girls (around 10–12) than in boys (around 12–14); growth stops a few years after it, when the growth plates of the bones close.
- **Head circumference** grows fastest in the first year, tracking the growth of the brain.
- **Genes set the target**: the *mid-parental height* estimates where a child is heading, give or take about 8.5 cm.

A child whose weight or height crosses two major centile lines, or whose growth slows for months, needs checking. Worldwide, undernutrition is still the main growth problem: in 2022 about 148 million children under five (22 %) were **stunted** — too short for their age, a sign of long-term poor nutrition and repeated infection — 45 million were **wasted** (too thin for their height) and 37 million were **overweight** (UNICEF/WHO/World Bank). Stunting before the age of two affects learning and adult health, which is why the first 1,000 days, from conception to the second birthday, matter so much.

### Development
Children develop along several tracks at once — movement, hand skills, language, social and emotional life — each with a wide normal range:

| Skill | Typical age (the normal range is wide) |
|---|---|
| Social smile | about 6 weeks |
| Holds the head steady | 3–4 months |
| Sits without support | about 6 months (roughly 4–9) |
| Walks alone | about 12 months (roughly 8–18) |
| First words | around 12 months |
| Two-word phrases | around 2 years |

Children thrive on responsive care — talking, reading, playing, predictable sleep — together with breast milk alone for the first six months and family foods after, vaccinations on schedule (see [[vaccines]]), active play (the WHO advises at least three hours of varied activity a day at ages 3–4) and little or no screen time before the age of two.

> [!key] Losing skills a child once had — words, walking, play — at any age, or no response to sounds or to their name, needs prompt assessment. Parents' worries about development deserve to be taken seriously.

> [!warn] Danger signs in a sick child: unable to drink or breastfeed, vomiting everything, a fit, unusually sleepy or hard to wake, difficulty breathing, a rash that does not fade when a glass is pressed against it, signs of dehydration such as no wet nappy for many hours, or a fever of 38 °C or more in a baby under three months. Seek care at once — and if the child is not breathing normally, is having a fit or cannot be woken, call your local emergency number.
`,
  ideas: [
    'Centiles and z-scores place a child among healthy children of the same age and sex; the direction of the line matters more than its level.',
    'The WHO Child Growth Standards show how children should grow when their needs are met — similar across the world.',
    'Growth is fastest in infancy (birth weight triples in a year), steady in childhood and fast again at puberty.',
    'Stunting, wasting and overweight affect tens of millions of children; the first 1,000 days matter most.',
    'Milestones have wide normal ranges, but loss of skills at any age needs prompt assessment.'
  ],
  pitfalls: [
    'A child on a low centile is not growing properly — A child tracking the 5th centile steadily is usually healthy and small, often like their parents; crossing centile lines is what needs attention.',
    'The 50th centile is the goal — It is the median, not a target; children of all centiles between the lines are growing normally.',
    'Children who walk or talk late will always be behind — The normal ranges are wide and most catch up; what matters is steady progress and no loss of skills.'
  ],
  formulas: [
    {
      name: 'Mid-parental height',
      expr: 'H = (Hf + Hm + k)/2', tex: 'H = \\frac{H_f + H_m + k}{2}',
      vars: {
        H: { name: 'expected adult height of the child', q: 'length', unit: 'cm' },
        Hf: { name: 'father\'s height', q: 'length', unit: 'cm', value: 175, tex: 'H_f' },
        Hm: { name: 'mother\'s height', q: 'length', unit: 'cm', value: 162, tex: 'H_m' },
        k: { name: 'sex adjustment: +13 cm for a boy, −13 cm for a girl', q: 'length', unit: 'cm', value: 13, signed: true }
      },
      note: 'The average difference between adult men and women is about 13 cm. About 95 % of children end up within roughly ±8.5 cm of this target.',
      practice: { unknowns: ['H'] },
      stories: { H: 'A father is {Hf} tall and a mother {Hm}; the sex adjustment is {k}. What is the child\'s mid-parental height?' }
    },
    {
      name: 'A z-score on a growth chart',
      expr: 'z = (X - Med)/SD', tex: 'z = \\frac{X - \\text{Med}}{\\text{SD}}',
      vars: {
        z: { name: 'z-score (standard deviations from the median)', signed: true },
        X: { name: 'the child\'s measurement', q: 'length', unit: 'cm', value: 82 },
        Med: { name: 'median for age and sex', q: 'length', unit: 'cm', value: 86.4, tex: '\\text{Med}' },
        SD: { name: 'standard deviation for age and sex', q: 'length', unit: 'cm', value: 3.2, tex: '\\text{SD}' }
      },
      note: 'Defaults: a girl of 24 months, with approximate WHO values for length. z = −2 is about the 2nd centile, −1 the 16th, 0 the 50th, +1 the 84th, +2 the 98th. The WHO charts use a refinement (the LMS method) for skewed measures such as weight.',
      practice: { unknowns: ['z', 'X'] },
      stories: { z: 'A child measures {X}; the median for age is {Med} with a standard deviation of {SD}. What is the z-score?', X: 'The median is {Med} and the standard deviation {SD}. What measurement corresponds to a z-score of {z}?' }
    }
  ],
  examples: [
    {
      title: 'Where is Maya heading?',
      q: 'Maya\'s father is 170 cm and her mother 158 cm. At 24 months she measures 82 cm; the WHO median for girls of that age is about 86.4 cm with a standard deviation of about 3.2 cm. Find her z-score and her mid-parental height.',
      steps: [
        'z-score: $(82 - 86.4)/3.2 \\approx -1.4$, about the 8th centile — well within the normal range.',
        'Mid-parental height for a girl: $(170 + 158 - 13)/2 = 157.5$ cm, with a likely range of about 149–166 cm.',
        'Her parents are both shorter than average, and she has followed the same centile since birth: a small, healthy girl.'
      ],
      a: 'z ≈ −1.4 (about the 8th centile); mid-parental height about 157.5 cm.'
    },
    {
      title: 'The first year',
      q: 'A baby is born weighing 3.4 kg and measuring 50 cm. Roughly what might he weigh and measure at his first birthday?',
      steps: [
        'Weight roughly triples: $3 \\times 3.4 \\approx 10$ kg.',
        'Length grows by about half: $50 \\times 1.5 = 75$ cm.',
        'These are averages; the child\'s own line on the chart matters more than any single number.'
      ],
      a: 'About 10 kg and 75 cm.'
    }
  ],
  quiz: [
    { q: 'Which pattern on a growth chart most needs checking?', choices: ['weight falling from the 50th to below the 9th centile over six months', 'height steady on the 2nd centile since birth, with short parents', 'weight steady on the 91st centile', 'height steady on the 50th centile'], a: 0,
      why: 'Crossing two centile lines signals a change in growth. Steady tracking, even on a low or high centile, is usually normal.' },
    { q: 'The WHO Child Growth Standards were built from children in six countries on four continents, and show that young children grow similarly worldwide when their needs are met.', a: true,
      why: 'That is why one standard can be used everywhere: differences in young children\'s growth between countries mostly reflect nutrition, infection and care, not ethnicity.' },
    { q: 'A father is 180 cm and a mother 166 cm. What is the mid-parental height, in cm, for their son?', answer: 179.5, unit: 'cm',
      why: '(180 + 166 + 13)/2 = 359/2 = 179.5 cm, give or take about 8.5 cm.' },
    { q: 'A 20-month-old who used to say ten words has stopped talking and no longer points or plays. What should happen?', choices: ['prompt assessment by a doctor', 'wait until age three', 'nothing: late talkers catch up', 'switch to a different milk'], a: 0,
      why: 'Loss of skills at any age is a red flag that needs prompt assessment, unlike a slow but steady pace of development.' },
    { q: 'Stunting means a child is…', choices: ['too short for their age', 'too thin for their height', 'too heavy for their height', 'born before 37 weeks'], a: 0,
      why: 'Stunting (length or height for age below −2 SD) reflects long-term undernutrition and infection; wasting is low weight for height.' }
  ],
  applications: ['Growth monitoring in child health clinics.', 'Screening for malnutrition in emergencies with height, weight and arm circumference.', 'Detecting growth-hormone deficiency, thyroid problems and coeliac disease from a falling growth line.', 'Early-years programmes built on responsive care and nutrition in the first 1,000 days.']
},

/* ================================================================ MENOPAUSE */
{
  id: 'menopause', parent: 'life-stages', title: 'Menopause', level: 2,
  short: 'The end of menstrual periods as the ovaries run out of follicles, usually around 51. Why it happens, the symptoms from hot flushes to sleep and genitourinary changes, the effects on bone and heart, and the treatments, including hormone therapy.',
  keywords: ['menopause', 'perimenopause', 'hot flushes', 'hot flashes', 'night sweats', 'vasomotor symptoms', 'oestrogen', 'estrogen', 'FSH', 'hormone therapy', 'HRT', 'MHT', 'genitourinary syndrome', 'vaginal dryness', 'premature ovarian insufficiency', 'osteoporosis', 'fezolinetant', 'postmenopausal bleeding'],
  prereq: ['reproductive-hormones', 'hormone-feedback', 'bone-calcium'],
  related: ['ageing', 'atherosclerosis', 'sleep', 'depression', 'common-cancers', 'pulmonary-embolism', 'physical-activity'],
  body: `
Grace is 51. For a year her periods have been irregular; now she wakes three times a night drenched in sweat, has hot flushes in meetings, and feels foggy and short-tempered in a way she does not recognise. She wonders whether this is "just her age", to be put up with, or something that can be helped.

### What happens
A girl is born with one to two million follicles, each holding an egg (see [[reproductive-hormones|the menstrual cycle]]); by puberty a few hundred thousand remain, and they are used up steadily — only a few hundred ever ovulate, the rest simply fade — until by the late forties or early fifties about a thousand are left and the ovaries stop responding. As the follicles dwindle the ovaries make less oestradiol and inhibin, and the pituitary answers with more FSH, trying ever harder to stimulate them — a classic [[hormone-feedback|feedback loop]]. For a few years, the **perimenopause**, hormone levels swing erratically and cycles become irregular. **Menopause** itself is the last period, recognised in hindsight after twelve months without one. The average age is about 51, usually between 45 and 55. Menopause before 45 is called early; before 40 — premature ovarian insufficiency, affecting about one woman in a hundred — it needs medical assessment. Removal of both ovaries, and some cancer treatments, cause menopause at once.

### Symptoms
- **Hot flushes and night sweats** affect about three women in four, typically for several years — about seven on average in one large US study — and for some much longer. Falling oestrogen narrows the brain's temperature "comfort zone", so small rises in core temperature set off flushing and sweating.
- Poor sleep, low mood, anxiety, irritability and trouble concentrating are common, partly because of broken sleep.
- **Genitourinary syndrome of menopause** — vaginal dryness, pain during sex, urinary urgency and infections — affects about half of women and, unlike flushes, tends to get worse without treatment.
- Joint aches and changes in skin and hair.

Some women notice little; for others symptoms disrupt work, relationships and sleep for years. Both are normal experiences, and neither is a reason to suffer in silence. Until periods have stopped for a year (two years before the age of 50), pregnancy is still possible, so guidelines advise continuing contraception until then.

### Longer-term health
Oestrogen protects bone, and bone density falls fastest in the years around menopause — one reason osteoporosis and fractures are commoner in older women (see [[bone-calcium]]). The rate of heart disease also rises after menopause, so this is a good time to check blood pressure, cholesterol and blood sugar, and to stay active and strong.

### Treatment
- **Menopausal hormone therapy** (MHT, also called HRT) replaces oestrogen — through the skin as a patch, gel or spray, or as tablets — with a progestogen for women who still have a womb, to protect its lining. It is the most effective treatment for flushes and sweats and prevents bone loss. The 2002 Women's Health Initiative trial caused alarm about breast cancer, heart disease and stroke; later analyses showed that the balance depends on age and timing. For healthy women under 60, or within 10 years of their last period, with troublesome symptoms, current guidelines (for example the North American Menopause Society, 2022, and the UK's NICE, 2024) judge that the benefits usually outweigh the risks. The risks are real but small: blood clots and stroke with oral oestrogen (less with oestrogen through the skin), and a slightly higher breast cancer risk with combined therapy that grows with the years of use.
- **Vaginal oestrogen** in low doses treats genitourinary symptoms, with very little absorbed into the blood.
- **Non-hormonal options**: cognitive behavioural therapy, which helps flushes and sleep; some antidepressants (SSRIs and SNRIs) and gabapentin; and a newer class, the neurokinin-3 receptor antagonists such as fezolinetant (approved in 2023), which act directly on the brain's temperature centre.
- **Everyday measures**: regular activity, not smoking, less alcohol and caffeine, layered clothing and a cool bedroom each help a little.

The right choice depends on symptoms, health history and preferences — a conversation to have with a doctor or nurse, and to revisit from time to time.

> [!key] Bleeding a year or more after the last period should always be checked by a doctor promptly. Most causes are harmless, but it can be an early sign of womb cancer, which is very treatable when found early.

> [!warn] For anyone taking hormone therapy: a painful, swollen leg, sudden breathlessness or chest pain, or sudden weakness, a drooping face or trouble speaking can mean a blood clot or a stroke — call your local emergency number.
`,
  ideas: [
    'Menopause comes when the ovaries run out of follicles; oestradiol falls and FSH rises through feedback.',
    'It is diagnosed in hindsight after twelve months without a period; the average age is about 51.',
    'Hot flushes and night sweats affect about three women in four, often for years; genitourinary symptoms tend to persist and worsen.',
    'Bone loss speeds up and heart disease risk rises after menopause.',
    'Hormone therapy is the most effective treatment; for healthy women under 60 with troublesome symptoms the benefits usually outweigh the small risks.'
  ],
  pitfalls: [
    'Hormone therapy is dangerous and causes breast cancer — The risks depend on the type, route, age and duration: oestrogen through the skin carries little clot risk, oestrogen alone little or no breast cancer risk, and combined therapy a small increase that grows with years of use.',
    'Menopause needs a blood test to diagnose — Over 45, it is recognised from symptoms and the pattern of periods; hormone levels swing too much in the perimenopause to be reliable.',
    'Menopause symptoms last a few months at most — Flushes last about seven years on average, and genitourinary symptoms often continue unless treated.'
  ],
  formulas: [
    {
      name: 'The dwindling follicle pool (a halving model)',
      expr: 'N = N0*2^(-t/Th)', tex: 'N = N_0 \\cdot 2^{-t/T_h}',
      vars: {
        N: { name: 'follicles remaining' },
        N0: { name: 'follicles at the starting age', value: 300000, tex: 'N_0' },
        t: { name: 'years since the starting age', q: 'years', unit: 'yr', value: 36 },
        Th: { name: 'halving time of the follicle pool', q: 'years', unit: 'yr', value: 4.4, tex: 'T_h' }
      },
      note: 'An illustration with a constant halving time. In reality the loss speeds up in the late thirties, and women differ widely — which is why the age at menopause varies from the forties to the late fifties.',
      practice: { unknowns: ['N', 'Th'] },
      stories: { N: 'At puberty a girl has {N0} follicles, and the pool halves every {Th}. How many are left {t} later?', Th: 'A pool of {N0} follicles falls to {N} over {t}. What is its halving time?' }
    }
  ],
  examples: [
    {
      title: 'How fast the follicles run down',
      q: 'Suppose a girl has about 300,000 follicles at 15 and about 1,000 remain at menopause at 51. What halving time does that imply, and how many would remain at 45?',
      steps: [
        'The pool shrinks by a factor of $300{,}000/1{,}000 = 300$, which is $\\log_2 300 \\approx 8.2$ halvings.',
        'Over 36 years: $T_h = 36/8.2 \\approx 4.4$ years.',
        'At 45 (30 years): $N = 300{,}000 \\times 2^{-30/4.4} \\approx 2{,}600$.',
        'A woman who starts with fewer follicles, or loses them faster, reaches the threshold earlier — one reason the age at menopause varies.'
      ],
      a: 'A halving time of about 4.4 years; about 2,600 follicles at 45.'
    },
    {
      title: 'Grace\'s decision',
      q: 'Grace is 51, healthy, a non-smoker with normal blood pressure, with severe night sweats and flushes that disturb her work. How might she and her doctor weigh the options?',
      steps: [
        'Her symptoms are frequent and troublesome, and she is under 60 and within 10 years of her last period — the group in which guidelines find that the benefits of hormone therapy usually outweigh the risks.',
        'Oestrogen through the skin avoids most of the extra clot risk of tablets; she still has her womb, so a progestogen is added to protect its lining.',
        'Non-hormonal options — cognitive behavioural therapy, some antidepressants, a neurokinin-3 receptor antagonist — are alternatives if she prefers to avoid hormones.',
        'Whatever she chooses, the plan is reviewed, usually yearly; there is no fixed time by which treatment must stop.'
      ],
      a: 'A shared decision: for someone like Grace, guidelines see hormone therapy (preferably through the skin) as a reasonable first option, with non-hormonal alternatives.'
    }
  ],
  quiz: [
    { q: 'Menopause is recognised…', choices: ['after twelve months without a period', 'at the first skipped period', 'when a blood test shows high FSH once', 'at the age of 50 exactly'], a: 0,
      why: 'It is the final period, known only in hindsight after a year without one; single hormone tests are unreliable during the perimenopause.' },
    { q: 'Which menopausal symptom tends to worsen over time if untreated?', choices: ['vaginal dryness and urinary symptoms', 'hot flushes', 'night sweats', 'irregular periods'], a: 0,
      why: 'Genitourinary syndrome of menopause is caused by lasting tissue changes; flushes, by contrast, fade over years.' },
    { q: 'Why does FSH rise at menopause?', choices: ['falling oestradiol and inhibin remove the negative feedback on the pituitary', 'the ovaries start making FSH', 'the thyroid becomes overactive', 'FSH is released by the womb lining'], a: 0,
      why: 'With fewer follicles, less oestradiol and inhibin reach the pituitary, which responds by releasing more FSH — feedback in action.' },
    { q: 'Oestrogen given through the skin (patch or gel) carries a lower risk of blood clots than oestrogen tablets.', a: true,
      why: 'Tablets pass through the liver first and raise clotting factors; oestrogen through the skin largely avoids that effect.' },
    { q: 'A 58-year-old woman whose periods stopped six years ago notices some vaginal bleeding. What should she do?', choices: ['see a doctor promptly', 'ignore it if it is light', 'wait to see if it happens again in a year', 'start hormone therapy'], a: 0,
      why: 'Any bleeding after menopause needs prompt checking: usually harmless, but it can be an early, treatable sign of womb cancer.' }
  ],
  applications: ['Menopause clinics and workplace menopause policies.', 'Bone-density assessment and fracture prevention after menopause.', 'Cardiovascular risk checks in midlife.', 'Fertility counselling for women with early menopause.']
},

/* ================================================================ AGEING */
{
  id: 'ageing', parent: 'life-stages', title: 'Ageing', level: 2,
  short: 'Why bodies age, what changes are normal and which are disease, why the risk of death doubles every eight years of adult life, the idea of compressing illness into the last years — and what helps people age well.',
  keywords: ['ageing', 'aging', 'older adults', 'hallmarks of ageing', 'senescence', 'telomeres', 'Gompertz law', 'frailty', 'sarcopenia', 'falls', 'polypharmacy', 'compression of morbidity', 'healthy life expectancy', 'delirium', 'population ageing', 'longevity'],
  prereq: ['cell-structure', 'dna-genes', 'life-expectancy'],
  related: ['dementia', 'bone-calcium', 'physical-activity', 'menopause', 'hearing-balance', 'vision', 'vaccines', 'hypertension'],
  body: `
Ruth and Esther were born in the same year and are now 82. Ruth still digs her allotment, walks to the shops and argues about politics at her book club. Esther has heart failure and arthritis, takes eleven medicines, and has hardly left her flat since a fall last winter. Their **chronological** age is the same; their **biological** age — how well their bodies work — is not. Why people age at such different rates, and how much of it can be changed, is one of the central questions of modern medicine.

### Why we age
Ageing is the slow build-up of damage that the body can no longer fully repair. Researchers group its causes into interacting "hallmarks": DNA damage and mutations accumulate; telomeres, the protective ends of chromosomes, shorten with cell divisions; the chemical marks that control genes drift; damaged proteins pile up; mitochondria make energy less efficiently; **senescent** cells stop dividing but linger and release inflammatory signals; the stem cells that renew tissues run down; and a low-grade chronic inflammation sets in. From an evolutionary point of view, natural selection had little reason to keep bodies in good repair long after the years of raising children, so ageing was never "designed": it is what happens when maintenance fades.

The result appears in the statistics with striking regularity. From about 30 the yearly risk of death roughly doubles every eight years (the Gompertz law; see [[life-expectancy|life tables]]), and the risk of most chronic diseases — heart disease, stroke, cancer, dementia, osteoarthritis — climbs with age.

### What changes, and what is normal
| System | Typical change with age |
|---|---|
| Muscle | mass and strength fall, slowly from midlife and faster after about 65 (sarcopenia) |
| Heart and vessels | arteries stiffen, so systolic pressure rises; maximum heart rate and fitness fall |
| Bones and joints | bone density falls, especially after menopause; cartilage wears |
| Kidneys | filtration falls gradually, so some medicines need adjusting |
| Eyes and ears | close focus fades in the mid-40s (presbyopia); high-pitched hearing fades |
| Brain | processing speed slows, but knowledge and vocabulary hold up or grow |
| Immunity | responses to infections and vaccines weaken |

Much of what is blamed on age is really disuse, disease or medicines. Fitness falls far more slowly in people who stay active, and strength training builds muscle even in people in their nineties. Forgetting a name is common; **dementia**, which disrupts daily life, is a disease and not a normal part of ageing (see [[dementia]]).

### Compression of morbidity
In 1980 the physician James Fries proposed that if the onset of chronic illness and disability could be pushed back faster than the end of life, the years spent ill would shrink — a **compression of morbidity**. Life expectancy has risen since, and in many countries so have the years lived with chronic disease; the years with serious *disability* have more often held steady or fallen. Worldwide, healthy life expectancy is about ten years shorter than life expectancy (WHO, 2021). Studies following people for decades show that those with fewer risk factors — non-smokers, physically active, of healthy weight — not only live longer but put off disability by even more.

### Ageing well
- **Keep moving**, with strength and balance training on 3 or more days a week — the best single protection against falls and frailty.
- **Stay connected**: loneliness and isolation are linked with more heart disease, stroke, depression, dementia and earlier death.
- **Keep the senses working**: glasses, cataract surgery and hearing aids keep people engaged, and treating hearing loss may lower the risk of dementia.
- **Review medicines** regularly: five or more raise the risk of side effects, confusion and falls.
- **Vaccines** recommended for older adults in many countries: influenza, pneumococcal, shingles, COVID-19 and RSV.
- **Make the home safe** — good lighting, rails, no loose rugs — and plan ahead: talk about wishes for future care while you can.

Falls are the second leading cause of death from unintentional injury worldwide (WHO), and most can be prevented.

> [!warn] Sudden confusion or unusual drowsiness in an older person (delirium) is a medical emergency until proven otherwise — often an infection, dehydration or a medicine. Get help at once, too, after a fall with a head injury (especially in someone taking blood thinners) and for sudden face drooping, arm weakness or slurred speech: call your local emergency number.
`,
  ideas: [
    'Ageing is accumulated damage that repair can no longer keep up with: DNA, telomeres, proteins, mitochondria, senescent cells, inflammation.',
    'From about 30 the yearly risk of death doubles roughly every eight years (Gompertz).',
    'Many changes blamed on age come from disuse, disease or medicines, and some can be reversed — strength training works even in the nineties.',
    'Compression of morbidity: postponing illness more than death shortens the years lived in poor health.',
    'Activity, social contact, working senses, medicine reviews, vaccines and a safe home help people age well.'
  ],
  pitfalls: [
    'Dementia is a normal part of getting old — Most older people never develop dementia; it is a disease of the brain, while normal ageing slows recall a little without disrupting daily life.',
    'It is too late to start exercising in old age — Strength and balance improve at any age, and training in later life prevents falls and keeps people independent.',
    'Sudden confusion is just old age — A sudden change in thinking is delirium until proven otherwise, and needs urgent medical assessment.'
  ],
  formulas: [
    {
      name: 'The Gompertz law of mortality',
      expr: 'm = m0*2^((x - x0)/Td)', tex: 'm = m_0 \\cdot 2^{(x - x_0)/T_d}',
      vars: {
        m: { name: 'yearly death rate at age x (per 1,000)' },
        m0: { name: 'yearly death rate at the reference age (per 1,000)', value: 0.8, tex: 'm_0' },
        x: { name: 'age', q: 'years', unit: 'yr', value: 80 },
        x0: { name: 'reference age', q: 'years', unit: 'yr', value: 30, tex: 'x_0' },
        Td: { name: 'doubling time of the death rate', q: 'years', unit: 'yr', value: 8, tex: 'T_d' }
      },
      note: 'Benjamin Gompertz, 1825. It describes adults from about 30 to 90 well; at the very oldest ages the rise slows. The defaults are round numbers typical of a high-income country today.',
      practice: { unknowns: ['m', 'x', 'Td'] },
      stories: { m: 'At {x0} the yearly death rate is {m0} per 1,000 and it doubles every {Td}. What is it, per 1,000, at {x}?', x: 'At {x0} the yearly death rate is {m0} per 1,000, doubling every {Td}. At what age does it reach {m} per 1,000?' }
    },
    {
      name: 'Years lived in poor health',
      expr: 'U = LE - HALE', tex: 'U = \\text{LE} - \\text{HALE}',
      vars: {
        U: { name: 'expected years in less than full health', q: 'years', unit: 'yr' },
        LE: { name: 'life expectancy', q: 'years', unit: 'yr', value: 71.4, tex: '\\text{LE}' },
        HALE: { name: 'healthy life expectancy', q: 'years', unit: 'yr', value: 61.9, tex: '\\text{HALE}' }
      },
      note: 'Defaults: the WHO\'s global estimates for 2021. Morbidity is compressed when U falls, even as LE rises.',
      practice: { unknowns: ['U', 'HALE'] },
      stories: { U: 'Life expectancy is {LE} and healthy life expectancy {HALE}. How many years are lived in less than full health?' }
    }
  ],
  examples: [
    {
      title: 'Doubling every eight years',
      q: 'In a high-income country the yearly death rate at 30 is about 0.8 per 1,000. If it doubles every 8 years, what is it at 70, 80 and 90?',
      steps: [
        'At 70: 40 years = 5 doublings, $0.8 \\times 2^5 = 25.6$ per 1,000 (about 2.6 % a year).',
        'At 80: $0.8 \\times 2^{50/8} \\approx 61$ per 1,000.',
        'At 90: $0.8 \\times 2^{60/8} \\approx 145$ per 1,000 — about one in seven.',
        'Real tables follow this closely from 30 to about 90; the rise slows a little at the very oldest ages.'
      ],
      a: 'About 26, 61 and 145 per 1,000 a year.'
    },
    {
      title: 'Compressing illness',
      q: 'In one group people typically become disabled at 72 and die at 80. A healthier lifestyle postpones death to 83 and the onset of disability to 78. What happens to the years lived with disability?',
      steps: [
        'Before: $80 - 72 = 8$ years with disability, out of 80.',
        'After: $83 - 78 = 5$ years with disability, out of 83.',
        'Life is 3 years longer and the disabled years 3 fewer: disability was postponed by more than death — Fries\'s compression of morbidity.'
      ],
      a: 'From 8 to 5 years of disability, while life lengthens by 3 years.'
    }
  ],
  quiz: [
    { q: 'Dementia is a normal part of getting old.', a: false,
      why: 'Dementia is a disease that disrupts daily life; most older people never develop it. Normal ageing slows recall a little but does not take away independence.' },
    { q: 'Which is the best single way to prevent falls in older people?', choices: ['strength and balance training', 'staying in bed more', 'wearing slippers indoors', 'taking a sleeping tablet at night'], a: 0,
      why: 'Exercise programmes with balance and strength training reduce falls by about a quarter. Sleeping tablets increase falls.' },
    { q: '"Compression of morbidity" means…', choices: ['the onset of illness is postponed more than death, so fewer years are lived ill', 'people die younger', 'diseases become milder with age', 'health care is concentrated in hospitals'], a: 0,
      why: 'Fries\'s idea: if illness starts later and death is delayed less, the period of illness shrinks.' },
    { q: 'If the death rate doubles every 8 years, how many times higher is it at 86 than at 30?', answer: 128,
      why: '56 years is 7 doublings: 2⁷ = 128.' },
    { q: 'An 84-year-old man becomes confused and drowsy over a day, which is new for him. What is the right response?', choices: ['treat it as an emergency and seek medical help now', 'assume it is dementia starting', 'let him sleep it off', 'wait a week to see if it passes'], a: 0,
      why: 'Sudden confusion is delirium until proven otherwise — often infection, dehydration or a medicine — and needs urgent assessment.' }
  ],
  applications: ['Falls-prevention and strength-and-balance programmes.', 'Medication reviews to reduce polypharmacy.', 'Age-friendly cities and homes (the WHO Decade of Healthy Ageing, 2021–2030).', 'Planning pensions and health services for ageing populations.'],
  history: 'Benjamin Gompertz, an actuary, described in 1825 how death rates rise geometrically with age; James Fries proposed the compression of morbidity in 1980.',
  sim: ['prev-compression', 'prev-pyramid']
}

);
