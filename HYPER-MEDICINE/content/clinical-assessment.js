/* HYPER-MEDICINE · content/clinical-assessment.js — Diagnosis and Evidence: examining a patient.
 * Vital signs and early-warning scores, history and examination, blood tests and reference
 * ranges, and medical imaging. Simulations in sims/diagnosis.js. */
Hyper.add(

{
  id: 'vital-signs', parent: 'clinical-assessment', title: 'Vital signs', level: 1,
  short: 'The handful of quick measurements that show how well the body is coping right now — pulse, breathing rate, blood pressure, temperature, oxygen saturation and alertness. Each has a typical range; how they change, and how they fit together, warns of trouble early.',
  keywords: ['vital signs', 'observations', 'obs', 'pulse', 'heart rate', 'respiratory rate', 'breathing rate', 'temperature', 'fever', 'oxygen saturation', 'SpO2', 'pulse oximeter', 'early warning score', 'NEWS2', 'ACVPU', 'shock index', 'deterioration', 'sepsis'],
  prereq: ['blood-pressure', 'thermoregulation', 'oxygen-transport'],
  related: ['history-examination', 'sepsis', 'control-of-breathing', 'cardiac-output', 'bleeding-shock', 'first-aid-basics'],
  body: `
At two in the morning a nurse counts a man's breathing for a full minute, clips a probe on his finger, wraps a cuff around his arm and asks him what day it is. Four minutes later she has six numbers. If she writes down 26 breaths a minute, a pulse of 118 and a new muddle about the date, she will be calling a doctor within minutes — even though his blood pressure is still normal. The vital signs are the body's dashboard: quick, cheap, repeatable, and often the first sign that something is going wrong.

### The six numbers

| Vital sign | How it is measured | Typical resting adult | Worth attention |
|---|---|---|---|
| Pulse (heart rate) | fingers on the wrist or neck, or a monitor | 60–100 beats/min (50s are common in fit people) | below 50 or above 100 at rest, or irregular |
| Breathing rate | counting chest rises for a full minute | 12–20 breaths/min | above 20, and especially 25 or more; below 10 |
| Blood pressure | a cuff ([[blood-pressure]]) | around 120/80 mmHg or below | systolic 100 or less in someone unwell; very high readings |
| Temperature | mouth, ear, forehead or armpit | about 36.1–37.2 °C (97.0–99.0 °F) | 38.0 °C (100.4 °F) or more is fever; below 35 °C is hypothermia |
| Oxygen saturation (SpO₂) | a pulse oximeter on a finger | 95–100 % at sea level | below 94 %, or falling |
| Consciousness | alert? new confusion? responds only to voice or pain? | alert and oriented | any new confusion or drowsiness |

These are rough guides for healthy adults at rest, as commonly taught today; they are not sharp boundaries. Children breathe faster and have faster hearts (a baby's pulse is normally well above 100), ranges drift with age, and medicines shift them — beta-blockers, for instance, hold the pulse down.

### What each number says
- **Pulse.** The heart speeds up to keep the [[cardiac-output|cardiac output]] up when each beat pumps less: after blood loss, with dehydration, fever, pain or fear. Count for 30 seconds and double it if the rhythm is regular, for a full minute if it is irregular.
- **Breathing rate** is the most neglected sign and one of the most telling. The body breathes faster when it is short of oxygen, when acid builds up in the blood (as in sepsis), with pain and with lung disease. Because counting is tedious it is often guessed — ward charts full of "18" are a known problem — and people breathe differently when they know they are being watched, so it is best counted quietly.
- **Temperature.** The classic 37.0 °C comes from nineteenth-century measurements; modern studies find healthy averages nearer 36.6 °C, varying by about half a degree over the day. Fever is part of the immune response ([[thermoregulation]]), not a disease in itself, and a low temperature in a frail, ill person can be as worrying as a high one.
- **Oxygen saturation.** The oximeter compares how red and infrared light pass through the fingertip, because oxygen-rich and oxygen-poor haemoglobin absorb them differently ([[oxygen-transport]]). Above about 90 % it is usually within 2–3 percentage points, but cold fingers, movement and nail varnish disturb it, and studies since 2020 have found it can over-read in people with darker skin. A "normal" number does not cancel out someone who looks and feels breathless. People with some long-term lung diseases have a lower target, often 88–92 %, set by their own doctors.
- **Consciousness** is judged quickly on the ACVPU scale: **A**lert, new **C**onfusion, responds to **V**oice, responds to **P**ain, **U**nresponsive. New confusion in an older person is often the first sign of an infection.

### The trend, not the snapshot
One reading can be off for trivial reasons — a flight of stairs, a hot drink, nerves. What matters is how the signs change and how they fit together. The body defends its blood pressure hard: when blood is lost, the heart speeds up and the vessels tighten, so in a young adult the systolic pressure often stays normal until around 30 % of the blood volume has gone, then falls suddenly. A rising pulse and breathing rate are the early warnings; a falling blood pressure is a late one. A quick combination is the **shock index**, pulse divided by systolic pressure: normally about 0.5–0.7, while values around 1 or above suggest the circulation is struggling.

### Early-warning scores
Studies since the 1990s found that most patients who had a cardiac arrest on a hospital ward had shown abnormal vital signs in the hours before — recorded, but not acted on. Early-warning scores turn observations into points so that deterioration triggers a response automatically. The UK's **National Early Warning Score 2** (NEWS2, Royal College of Physicians, 2017) scores seven parameters from 0 to 3:

| Parameter | 3 | 2 | 1 | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|---|---|
| Breathing rate (per min) | ≤ 8 | | 9–11 | 12–20 | | 21–24 | ≥ 25 |
| SpO₂ scale 1 (%) | ≤ 91 | 92–93 | 94–95 | ≥ 96 | | | |
| SpO₂ scale 2 (%) | ≤ 83 | 84–85 | 86–87 | 88–92, or ≥ 93 on air | 93–94 on oxygen | 95–96 on oxygen | ≥ 97 on oxygen |
| Air or oxygen | | oxygen | | air | | | |
| Systolic pressure (mmHg) | ≤ 90 | 91–100 | 101–110 | 111–219 | | | ≥ 220 |
| Pulse (per min) | ≤ 40 | | 41–50 | 51–90 | 91–110 | 111–130 | ≥ 131 |
| Consciousness | | | | alert | | | new confusion, voice, pain or unresponsive |
| Temperature (°C) | ≤ 35.0 | | 35.1–36.0 | 36.1–38.0 | 38.1–39.0 | ≥ 39.1 | |

Scale 2 is used only for people whose clinicians have set a target saturation of 88–92 % because of long-term lung disease. A total of 5 or more calls for an urgent review by a clinician skilled in acute illness, 7 or more for an emergency response by a critical-care team, and a 3 in any single parameter for a prompt review. NEWS2 is not designed for children or pregnancy, which have scores of their own. The simulation below scores it as published.

> [!warn] Call your local emergency number if someone who is ill becomes newly confused or very drowsy, is struggling to breathe or breathing very fast, has blue or grey lips, has cold, blotchy skin, or has passed little or no urine for a day. These can be signs of sepsis or shock, and every hour counts.

### What it means for you
Home devices — thermometers, blood-pressure monitors, pulse oximeters, smartwatches — put vital signs in everyone's hands. They are most useful for spotting a **change from your own usual values** and for sharing with a clinician, not for diagnosing yourself from one reading. And trust your eyes: a person who looks very unwell needs help even if a gadget says the numbers are fine.
`,
  ideas: [
    'Six quick measurements — pulse, breathing rate, blood pressure, temperature, oxygen saturation and alertness — show how well the body is coping.',
    'Typical adult ranges are guides, not laws: children, athletes, older people and medicines shift them.',
    'The pulse and breathing rate usually change before the blood pressure falls; trends matter more than one reading.',
    'Early-warning scores such as NEWS2 turn observations into points, so that deterioration triggers a timely response.',
    'Home devices are best for spotting change from your own usual values — and someone who looks very ill needs help whatever the numbers say.'
  ],
  pitfalls: [
    'A normal blood pressure means the circulation is fine — Blood pressure is defended to the last: a young adult can lose around a third of the blood volume before it falls. A rising pulse and breathing rate come first.',
    '37 °C is everyone\'s normal temperature — Normal temperature differs between people and over the day by about half a degree, and modern averages are nearer 36.6 °C. Fever is conventionally 38.0 °C or more.',
    'The breathing rate is a formality — It is one of the strongest predictors of deterioration and the one most often guessed; it should be counted for a full minute.'
  ],
  formulas: [
    {
      name: 'Pulse from a count',
      expr: 'HR = n/t', tex: '\\text{HR} = \\frac{n}{t}',
      vars: {
        HR: { name: 'heart rate', q: 'frequency', unit: 'bpm', tex: '\\text{HR}' },
        n: { name: 'beats counted', q: 'count', int: true, value: 18 },
        t: { name: 'counting time', q: 'time', unit: 's', value: 15 }
      },
      note: 'For a regular pulse count for 30 seconds and double it; for an irregular one count a full minute. The same arithmetic gives the breathing rate.',
      practice: { unknowns: ['HR', 'n'] },
      stories: { HR: 'You count {n} at the wrist in {t}. What is the heart rate?', n: 'A heart beats at {HR}. How many beats will you count in {t}?' }
    },
    {
      name: 'Shock index',
      expr: 'SI = hr/sbp', tex: '\\text{SI} = \\frac{\\text{HR}}{\\text{SBP}}',
      vars: {
        SI: { name: 'shock index', tex: '\\text{SI}' },
        hr: { name: 'heart rate (beats per minute)', value: 115, tex: '\\text{HR}' },
        sbp: { name: 'systolic blood pressure (mmHg)', value: 105, tex: '\\text{SBP}' }
      },
      note: 'Normally about 0.5–0.7 in adults; around 1 or above suggests the circulation is under strain, as in blood loss or sepsis. A bedside guide, not a diagnosis: beta-blockers, pacemakers and pregnancy change it.',
      stories: { SI: 'After a fall, a man has a pulse of {hr} beats a minute and a systolic pressure of {sbp} mmHg. What is his shock index?' }
    }
  ],
  examples: [
    {
      title: 'Scoring a set of observations',
      q: 'A 70-year-old woman on a surgical ward, breathing air, has: breathing rate 22, SpO₂ 95 %, systolic pressure 112 mmHg, pulse 104, alert, temperature 38.3 °C. Work out her NEWS2 score.',
      steps: [
        'Breathing rate 22 is in the 21–24 band: 2 points.',
        'SpO₂ 95 % on scale 1 is in the 94–95 band: 1 point. Breathing air: 0.',
        'Systolic 112 is in the 111–219 band: 0. Pulse 104 is in the 91–110 band: 1.',
        'Alert: 0. Temperature 38.3 °C is in the 38.1–39.0 band: 1.',
        'Total $2 + 1 + 0 + 0 + 1 + 0 + 1 = 5$ — no single value looks alarming, yet together they reach the urgent-response threshold.'
      ],
      a: 'NEWS2 = 5: an urgent review, with observations at least every hour.'
    },
    {
      title: 'A normal blood pressure that is not reassuring',
      q: 'A young cyclist is brought in after a crash. His pulse is 115 beats a minute and his blood pressure 105/70 mmHg. Compute the shock index and interpret it.',
      steps: [
        '$\\text{SI} = 115/105 \\approx 1.1$.',
        'The usual range is about 0.5–0.7; around 1 or more suggests the circulation is struggling.',
        'His blood pressure is still "normal" because his heart is racing and his vessels are clamped down — the pattern of hidden blood loss in a young person.'
      ],
      a: 'About 1.1: a warning sign despite a normal-looking blood pressure; he needs urgent assessment for bleeding.'
    }
  ],
  quiz: [
    { q: 'After blood loss, which change usually comes first?', choices: ['A falling systolic blood pressure', 'A rising pulse and breathing rate', 'A rising temperature', 'A falling oxygen saturation'], a: 1,
      why: 'The body compensates by speeding the heart and breathing and tightening the vessels, which holds the blood pressure up until a large volume is lost. A falling pressure is a late sign.' },
    { q: 'You count 13 breaths in 30 seconds. What is the breathing rate?', answer: 26, unit: 'breaths/min',
      why: '13 × 2 = 26 breaths a minute — well above the usual 12–20, and worth 3 points on NEWS2.' },
    { q: 'Using NEWS2: breathing rate 22, SpO₂ 95 % on air (scale 1), systolic 118 mmHg, pulse 96, alert, temperature 37.9 °C. What is the total?', answer: 4,
      why: 'Breathing 21–24 gives 2; SpO₂ 94–95 gives 1; air 0; systolic 111–219 gives 0; pulse 91–110 gives 1; alert 0; temperature 36.1–38.0 gives 0. Total 4.' },
    { q: 'A pulse oximeter reading of 97 % rules out a breathing problem.', a: false,
      why: 'Oximeters can over-read (cold hands, movement, darker skin), and a person can be working very hard to keep a normal saturation. Someone who looks and feels breathless needs assessing whatever the number.' },
    { q: 'A pulse of 120 and a systolic pressure of 100 mmHg give a shock index of…', answer: 1.2,
      why: '120 / 100 = 1.2, well above the usual 0.5–0.7.' }
  ],
  applications: [
    'Hospital ward observations and early-warning scores (NEWS2) that summon rapid-response teams.',
    'Ambulance and emergency-department triage, deciding who is seen first.',
    'Home and remote monitoring with thermometers, pulse oximeters and blood-pressure cuffs.',
    'Recognising sepsis early, when treatment within hours saves lives.'
  ],
  history: 'Physicians in ancient China and Greece wrote about feeling the pulse more than two thousand years ago. Carl Wunderlich\'s huge series of armpit temperatures, published in 1868, fixed 37 °C as the norm; the blood-pressure cuff followed in 1896 (Scipione Riva-Rocci) and the Korotkoff sounds in 1905. Takuo Aoyagi worked out the principle of pulse oximetry in Japan in the early 1970s. Early-warning scores appeared in the late 1990s; the UK standardised them as NEWS in 2012 and NEWS2 in 2017.',
  sim: 'dx-news2'
},

{
  id: 'history-examination', parent: 'clinical-assessment', title: 'History and examination', level: 1,
  short: 'How a clinician reaches a diagnosis: listening to the person\'s story, asking targeted questions, and examining the body by looking, feeling, tapping and listening. Each clue shifts the odds of each possible cause — and most diagnoses are made this way before any test is ordered.',
  keywords: ['medical history', 'history taking', 'presenting complaint', 'symptoms', 'signs', 'physical examination', 'inspection', 'palpation', 'percussion', 'auscultation', 'stethoscope', 'differential diagnosis', 'red flags', 'clinical reasoning', 'likelihood ratio', 'odds'],
  prereq: ['vital-signs', 'math:conditional-probability'],
  related: ['bayes-diagnosis', 'diagnostic-accuracy', 'lab-tests', 'medical-imaging', 'recognising-emergencies', 'pain'],
  body: `
A 34-year-old woman tells her doctor she has had headaches for three weeks. Ten minutes of questions follow — where exactly, how did it start, what makes it worse, has she had anything like it before, which medicines is she taking, does anyone in the family get migraines, how is she sleeping, is anything worrying her? By the end the doctor has a short list of likely causes and a clear sense of which dangerous ones must be ruled out. Most diagnoses are made like this: from the story, checked by an examination, with tests used to settle what remains uncertain. Classic studies of new patients in medical clinics (1975 and 1992) found that the history alone pointed to the final diagnosis in roughly three cases out of four.

### The history
Taking a history is a structured conversation:

1. **The main complaint**, in the person's own words — "my chest goes tight when I climb stairs".
2. **Its story**: when and how it began (suddenly or gradually), where it is, what it feels like, how bad it is, what makes it better or worse, what comes with it, and how it has changed. For pain, the speed of onset is often the most revealing detail.
3. **Past illnesses**, operations and pregnancies.
4. **Medicines** — prescribed, bought, herbal and recreational — and **allergies**, with what actually happened.
5. **Family history**: conditions that run in families, such as early heart disease or some cancers.
6. **Social history**: work, home, smoking, alcohol, travel, and what the person can and cannot do.
7. **A review of systems**: a quick run through each body system, to catch things the person did not think were connected.

Just as important are the person's own ideas, worries and expectations. A symptom ignored for months may be brought in today because a friend has just been diagnosed with cancer; until that fear is spoken, no reassurance will land.

### The examination
The examination looks for **signs** — what the examiner can observe — as distinct from **symptoms**, which the person feels. It uses four old techniques: **inspection** (colour, breathing, swelling, rashes, how someone walks), **palpation** (tenderness, lumps, the edge of the liver, the pulses), **percussion** (tapping to hear whether air, fluid or solid lies underneath) and **auscultation** (listening with a stethoscope to the heart, lungs, bowel and arteries). The [[vital-signs|vital signs]] are part of every examination.

### From clues to a diagnosis
Experienced clinicians reason in two ways. Often they recognise a pattern at once — the one-sided, blistering band of shingles. When the picture is less clear they build a **differential diagnosis**: a ranked list of possibilities that weighs what is common against what is dangerous. Each answer and each finding then pushes the probabilities up or down, and the size of the push is the finding's **likelihood ratio** — how many times more often it occurs in people with the disease than in people without it. Working with odds (probability ÷ its complement):

$$\\text{odds after} = \\text{odds before} \\times \\text{LR}_1 \\times \\text{LR}_2 \\times \\cdots$$

A likelihood ratio near 1 tells you almost nothing; above about 5 or below about 0.2 it shifts the odds a lot. In a 1996 review of studies of appendicitis, for instance, pain in the lower right abdomen had a likelihood ratio of roughly 8, and pain that had moved there from around the navel roughly 3 (estimates vary between studies). A question in the history is a test like any other, and [[bayes-diagnosis|probability after a test result]] applies the same arithmetic to blood tests and scans.

The multiplication assumes the findings are independent. Findings that share a cause — a fever and a fast pulse, two signs of the same inflammation — are not, and multiplying them overstates the evidence. That is one reason clinical decision rules are built and tested on real patients rather than assembled from separate numbers.

### Red flags
Some features change the plan at once because they point to a dangerous cause: a headache that is the worst ever and peaks within a minute; chest pain with sweating or breathlessness; weakness of one side of the face or body; blood in vomit or stool; unexplained weight loss; back pain with numbness around the buttocks or new trouble passing urine.

> [!warn] A sudden, severe headache; chest pain with sweating or breathlessness; sudden weakness, numbness, a drooping face or trouble speaking; severe difficulty breathing; or confusion with a fever are emergencies — call your local emergency number rather than waiting for an appointment.

### What it means for you
You are the expert on your own story. Before an appointment, note when it started, how it has changed, what helps and what hurts, and bring your medicines or a list of them, with the one question you most want answered. Say what you are afraid it might be. And if things change, go back: a diagnosis is a working hypothesis, revised as the story unfolds.
`,
  ideas: [
    'Most diagnoses begin with the history — the person\'s own account of what happened, in order.',
    'Symptoms are what the person feels; signs are what the examiner finds by looking, feeling, tapping and listening.',
    'A differential diagnosis ranks the possible causes, weighing what is common against what is dangerous.',
    'Each finding multiplies the odds by its likelihood ratio; a ratio near 1 tells you almost nothing.',
    'Red-flag features call for urgent action whatever the rest of the story.'
  ],
  pitfalls: [
    'Tests are more reliable than the story — Most diagnoses come from the history, and a test result means little without the probability the history and examination put on the disease beforehand.',
    'Every positive finding adds independent evidence — Findings that share a cause are correlated; multiplying their likelihood ratios overstates the case.',
    'Mentioning my real worry will sound silly — What you fear it might be is exactly what the clinician needs to address; unspoken fears are a common reason reassurance fails.'
  ],
  formulas: [
    {
      name: 'Combining two findings',
      expr: 'Oa = Ob*LR1*LR2', tex: 'O_{\\text{after}} = O_{\\text{before}} \\times \\text{LR}_1 \\times \\text{LR}_2',
      vars: {
        Oa: { name: 'odds of the disease after both findings', tex: 'O_{\\text{after}}' },
        Ob: { name: 'odds of the disease before', value: 0.111, tex: 'O_{\\text{before}}' },
        LR1: { name: 'likelihood ratio of the first finding', value: 8, tex: '\\text{LR}_1' },
        LR2: { name: 'likelihood ratio of the second finding', value: 3, tex: '\\text{LR}_2' }
      },
      note: 'Valid only when the two findings are independent given the disease; related findings make the product too large.',
      stories: { Oa: 'The odds of a disease are {Ob} before two findings with likelihood ratios {LR1} and {LR2}. What are the odds afterwards?' }
    },
    {
      name: 'Odds from a probability',
      expr: 'O = p/(1 - p)', tex: 'O = \\frac{p}{1 - p}',
      vars: {
        O: { name: 'odds' },
        p: { name: 'probability', q: 'ratio', unit: '%', value: 10, min: 0, max: 99.99 }
      },
      note: 'A probability of 10 % is odds of 1 to 9 (0.111); odds of 3 (3 to 1) are a probability of 75 %. Solving for p turns odds back into a probability.',
      practice: { unknowns: ['O', 'p'] },
      stories: { O: 'About {p} of people like this patient have the disease. What are the odds?', p: 'After the examination the odds of the disease are {O}. What is the probability?' }
    }
  ],
  examples: [
    {
      title: 'Two findings for appendicitis',
      q: 'Among young adults seen with abdominal pain of a particular kind, about 1 in 10 turn out to have appendicitis. A 20-year-old has pain in the lower right abdomen (likelihood ratio about 8) that moved there from around the navel (about 3). Estimate the probability of appendicitis, and say why the answer is probably too high.',
      steps: [
        'Odds before: $0.1/0.9 = 0.111$.',
        { text: 'Odds after both findings:', tex: '0.111 \\times 8 \\times 3 = 2.67' },
        'Probability: $2.67/(1 + 2.67) = 0.73$, about 73 %.',
        'Both findings reflect the same inflamed appendix, so they are not independent; multiplying overstates the evidence. The result is a reason to examine carefully and test, not a diagnosis.'
      ],
      a: 'About 73 % if the findings were independent — an overestimate, because they are linked.'
    },
    {
      title: 'A finding that barely helps',
      q: 'A sign is present in 60 % of people with a disease and in 50 % of people without it. What is its likelihood ratio, and how far does it move a 30 % probability?',
      steps: [
        'Likelihood ratio: $0.6/0.5 = 1.2$.',
        'Odds before: $0.3/0.7 = 0.429$; after: $0.429 \\times 1.2 = 0.514$.',
        'Probability after: $0.514/1.514 = 0.34$.'
      ],
      a: 'LR 1.2 moves 30 % only to about 34 %: common findings that are almost as common without the disease are nearly useless.'
    }
  ],
  quiz: [
    { q: 'Which of these is a sign rather than a symptom?', choices: ['Nausea', 'A heart murmur heard with a stethoscope', 'Tiredness', 'A headache'], a: 1,
      why: 'A sign is found by the examiner; a symptom is felt and reported by the person. Nausea, tiredness and headache are symptoms.' },
    { q: 'A finding has a likelihood ratio of 1. After finding it, the probability of the disease…', choices: ['doubles', 'is unchanged', 'falls to zero', 'rises to 100 %'], a: 1,
      why: 'Multiplying the odds by 1 leaves them where they were: the finding is equally common with and without the disease.' },
    { q: 'The odds of a disease are 0.25 (1 to 4) before a finding with likelihood ratio 4. What is the probability afterwards?', answer: 50, unit: '%',
      why: 'Odds after = 0.25 × 4 = 1, which is a probability of 1/(1 + 1) = 50 %.' },
    { q: 'Multiplying the likelihood ratios of a fever and a fast pulse gives the correct combined evidence for an infection.', a: false,
      why: 'A fever itself speeds the pulse, so the two findings are correlated; treating them as independent counts the same evidence twice.' }
  ],
  applications: [
    'Every consultation, from general practice to the emergency department.',
    'Telephone and video triage, where the history is almost all there is.',
    'Clinical decision rules — for ankle X-rays, chest pain, blood clots — built from history and examination findings.',
    'Preparing for your own appointment with a written timeline and a list of medicines.'
  ],
  history: 'Hippocratic physicians in Greece taught careful bedside observation around 400 BCE. Leopold Auenbrugger described percussion in 1761 — by tradition inspired by tapping wine barrels in his father\'s inn — and René Laennec, reluctant to press his ear to a young woman\'s chest in 1816, rolled paper into a tube and went on to invent the stethoscope.',
  sim: { id: 'dx-fagan', params: { pre: 10, sens: 80, spec: 90 } }
},

{
  id: 'lab-tests', parent: 'clinical-assessment', title: 'Blood tests and reference ranges', level: 2,
  short: 'What a blood-test result means: how laboratories set the "normal" range from the middle 95 % of healthy people, why one healthy result in twenty falls outside it, why a result inside it is no guarantee, and how to read common tests in both conventional and SI units.',
  keywords: ['blood test', 'reference range', 'reference interval', 'normal range', 'lab results', 'laboratory', 'abnormal result', 'flag', 'units', 'mmol/L', 'mg/dL', 'SI units', 'conventional units', 'full blood count', 'kidney function', 'liver function', 'glucose', 'HbA1c', 'cholesterol', 'haemolysis', 'critical value'],
  prereq: ['blood-composition', 'math:normal-distribution', 'math:standard-deviation'],
  related: ['diagnostic-accuracy', 'kidney-tests', 'cholesterol-lipids', 'anemia', 'type2-diabetes', 'electrolytes', 'thyroid', 'reading-health-news'],
  body: `
A letter arrives after a routine check-up: twenty-two results, one of them marked **H** — an ALT (a liver enzyme) of 47 U/L against a range of 7–40. It is natural to worry. Yet the likeliest explanation for one slightly raised result in a person who feels well is not disease at all: it is how reference ranges are made.

### Where the range comes from
To set a reference range, a laboratory measures the test in a group of healthy volunteers — guidelines ask for at least 120 — and keeps the **middle 95 %** of their results, from the 2.5th to the 97.5th percentile. For a test whose values follow a bell curve ([[math:normal-distribution|normal distribution]]) that is the mean plus or minus about two [[math:standard-deviation|standard deviations]]:

$$\\text{reference limits} \\approx \\bar{x} \\pm 1.96\\,s$$

Sodium in healthy adults averages about 140 mmol/L with a standard deviation of about 2.5, which gives the familiar 135–145 mmol/L. Many tests are skewed rather than bell-shaped (liver enzymes, triglycerides, CRP), and laboratories then use the percentiles directly.

The consequence is built in: **one healthy person in twenty falls outside the range for any single test** — half of them high, half low. Nothing is wrong with them; they sit at the edges of normal variation.

### The more tests, the more "abnormal" results
A routine panel may hold twenty tests or more. If each has a 5 % chance of flagging a healthy person, the chance that at least one does is

$$P(\\text{at least one flag}) = 1 - 0.95^{\\,n}$$

— about 23 % for 5 tests, 40 % for 10 and 64 % for 20. Real tests are partly correlated, which lowers these figures somewhat, but the lesson stands: order enough tests on a healthy person and something will almost always look "abnormal". That is why good practice is to test for a reason, and why a borderline result is usually repeated before anything else is done.

### Inside the range is no guarantee
The range describes healthy people in general, not you. A creatinine of 1.0 mg/dL (88 µmol/L) is in range, but for a small 80-year-old woman it corresponds to an estimated kidney filtration of about 57 mL/min — roughly half that of a young man with the same value ([[kidney-tests]]). A value that has crept up for three years inside the range can mean more than one value just outside it. And some limits are not percentiles at all but **decision thresholds** set from outcome studies: a fasting glucose of 7.0 mmol/L (126 mg/dL) for diabetes, or cholesterol targets that many healthy adults exceed.

### Common tests in both unit systems
Most of the world reports in SI units (mmol/L, µmol/L, g/L); the United States and some other countries use conventional units (mg/dL, g/dL). The number changes; the meaning does not. Typical adult ranges (approximate, as widely used in the 2020s; **always read your result against the range printed on your own report** — ranges differ between laboratories, methods, ages and sexes, and in pregnancy):

| Test | What it reflects | SI units | Conventional units |
|---|---|---|---|
| Sodium | water balance | 135–145 mmol/L | 135–145 mEq/L |
| Potassium | heart and muscle excitability | 3.5–5.0 mmol/L | 3.5–5.0 mEq/L |
| Glucose, fasting | blood sugar | 3.9–5.5 mmol/L | 70–99 mg/dL |
| HbA1c | average glucose over 2–3 months | below 39 (US) or 42 (UK) mmol/mol | below 5.7 % (US) or 6.0 % (UK) |
| Creatinine | kidney filtration | about 62–106 µmol/L (men), 44–88 (women) | about 0.7–1.2 mg/dL (men), 0.5–1.0 (women) |
| Urea (BUN) | kidneys, protein breakdown, hydration | urea 2.5–7.1 mmol/L | BUN 7–20 mg/dL |
| Calcium, total | bones, nerves, parathyroid glands | 2.20–2.60 mmol/L | 8.8–10.4 mg/dL |
| Bilirubin, total | liver, red-cell breakdown | below about 21 µmol/L | below about 1.2 mg/dL |
| Albumin | liver production, nutrition | 35–50 g/L | 3.5–5.0 g/dL |
| Haemoglobin | oxygen-carrying capacity | 130–170 g/L (men), 120–155 (women) | 13–17 g/dL (men), 12–15.5 (women) |
| White cells | infection, inflammation | 4.0–11.0 × 10⁹/L | 4 000–11 000 per µL |
| Platelets | clotting | 150–400 × 10⁹/L | 150 000–400 000 per µL |
| TSH | thyroid control | about 0.4–4.0 mU/L | about 0.4–4.0 µIU/mL |
| Total cholesterol | a heart-risk marker, not a percentile | desirable below 5.0 mmol/L (UK) | desirable below 200 mg/dL (US) |

Converting uses the molar mass: mg/dL = mmol/L × molar mass (g/mol) ÷ 10. Glucose (180 g/mol) gives a factor of 18, cholesterol (387 g/mol) about 38.7; creatinine in µmol/L is mg/dL × 88.4. The [blood chemistry calculator](#/tools/clinical/blood) converts them for you.

### Wrong before the sample reaches the machine
Many surprising results are artefacts. Blood squeezed through a thin needle, or left unspun for hours, leaks potassium from its red cells and reads falsely high. Blood drawn above a running drip is diluted. Glucose falls in a tube left at room temperature. A recent meal raises triglycerides. High-dose biotin supplements, sold for hair and nails, can disturb some immunoassays, including thyroid and troponin tests. A result that does not fit the person is often simply repeated.

> [!warn] Laboratories telephone results that are dangerous now — a very high or low potassium, a very low sodium or glucose. If you are told a result needs same-day attention, act on it; if you feel very unwell while waiting for results, do not wait — call your local emergency number.

### What it means for you
Read a result against the range on the report, look at how it compares with your earlier values, and ask what question the test was meant to answer. One slightly abnormal result in a well person is usually repeated or watched rather than treated. And "normal" results do not rule out a problem your symptoms point to — if symptoms continue, say so.
`,
  ideas: [
    'A reference range is the middle 95 % of results from healthy people, so one healthy result in twenty lies outside it.',
    'With n independent tests, the chance of at least one flag in a healthy person is 1 − 0.95ⁿ — about 64 % for 20 tests.',
    'Inside the range is no guarantee: trends, the person\'s size, age and sex, and the reason for testing all matter.',
    'The same result can be written in SI (mmol/L) or conventional (mg/dL) units; the molar mass converts between them.',
    'Surprising results are often artefacts of how the sample was taken or handled, and are repeated before acting.'
  ],
  pitfalls: [
    'A flagged result means something is wrong — By design one healthy person in twenty is outside the range for each test; with many tests, most healthy people have at least one flag.',
    'A normal result means the organ is healthy — The range describes a population, not you; small people, older people and slowly changing values can hide real problems inside it.',
    'Ranges are the same everywhere — They depend on the laboratory\'s method and units, and on age, sex and pregnancy; always read the range on your own report.'
  ],
  formulas: [
    {
      name: 'Chance of at least one result outside the range',
      expr: 'P = 1 - (1 - a)^n', tex: 'P = 1 - (1 - a)^{n}',
      vars: {
        P: { name: 'chance that a healthy person has at least one flagged result', q: 'ratio', unit: '%' },
        a: { name: 'share of healthy people outside the range, per test', q: 'ratio', unit: '%', value: 5, min: 0, max: 100 },
        n: { name: 'number of independent tests', q: 'count', int: true, value: 20 }
      },
      note: 'Assumes the tests are independent; real panels are partly correlated, so the true figure is somewhat lower.',
      practice: { unknowns: ['P', 'n'] },
      stories: { P: 'A healthy person has a panel of {n}, each with a range that leaves out {a} of healthy people. What is the chance that at least one result is flagged?', n: 'How many independent tests, each flagging {a} of healthy people, give a healthy person a {P} chance of at least one flag?' }
    },
    {
      name: 'How unusual is a result: the z-score',
      expr: 'z = (x - m)/s', tex: 'z = \\frac{x - \\bar{x}}{s}',
      vars: {
        z: { name: 'z-score (standard deviations from the healthy mean)', signed: true },
        x: { name: 'the result', q: 'concentration', unit: 'mmol/L', value: 131 },
        m: { name: 'mean in healthy people', q: 'concentration', unit: 'mmol/L', value: 140, tex: '\\bar{x}' },
        s: { name: 'standard deviation in healthy people', q: 'concentration', unit: 'mmol/L', value: 2.5 }
      },
      note: 'For a bell-shaped test the reference limits sit at z ≈ ±1.96. Beyond ±3, healthy variation becomes very unlikely (about 1 in 370 for either tail together).',
      stories: { z: 'Healthy sodium averages {m} with a standard deviation of {s}. How many standard deviations from the mean is a result of {x}?', x: 'Which result lies {z} standard deviations from a healthy mean of {m}, with a standard deviation of {s}?' }
    },
    {
      name: 'From mmol/L to mg/dL',
      expr: 'mg = mmol*M/10', tex: 'c_{\\text{mg/dL}} = \\frac{c_{\\text{mmol/L}} \\times M}{10}',
      vars: {
        mg: { name: 'result in mg/dL', tex: 'c_{\\text{mg/dL}}' },
        mmol: { name: 'result in mmol/L', value: 5.5, tex: 'c_{\\text{mmol/L}}' },
        M: { name: 'molar mass (g/mol)', value: 180.16, tex: 'M' }
      },
      note: 'One mmol is M milligrams, and a decilitre is a tenth of a litre. Molar masses: glucose 180.16, cholesterol 386.7, triglycerides (as triolein) 885.7. BUN counts only urea\'s nitrogen (28 g/mol), so urea in mmol/L = BUN in mg/dL × 0.357.',
      stories: { mg: 'A fasting glucose of {mmol} (glucose: {M}). What is it in mg/dL?', mmol: 'A result of {mg} for a substance of molar mass {M}. What is it in mmol/L?' }
    }
  ],
  examples: [
    {
      title: 'The annual check-up',
      q: 'A healthy 45-year-old has a panel of 20 independent tests, each with a 95 % reference range. What is the chance that at least one result is flagged, and how many flags would you expect on average?',
      steps: [
        'Chance that all 20 are in range: $0.95^{20} = 0.358$.',
        'Chance of at least one flag: $1 - 0.358 = 0.642$, about 64 %.',
        'Expected number of flags: $20 \\times 0.05 = 1$.'
      ],
      a: 'About 64 %, and on average one flagged result — in a perfectly healthy person.'
    },
    {
      title: 'A glucose result abroad',
      q: 'A traveller\'s fasting glucose is reported as 6.1 mmol/L. What is it in mg/dL, and how does it compare with common thresholds?',
      steps: [
        '$6.1 \\times 18.016 = 109.9$, about 110 mg/dL.',
        'The usual fasting range ends at 5.5 mmol/L (99 mg/dL). The American Diabetes Association calls 5.6–6.9 mmol/L (100–125 mg/dL) impaired fasting glucose; the WHO starts that band at 6.1 mmol/L (110 mg/dL).',
        'Diabetes needs 7.0 mmol/L (126 mg/dL) or more, confirmed on another day or by HbA1c.'
      ],
      a: 'About 110 mg/dL: impaired fasting glucose by both definitions, not diabetes — to be repeated or checked with an HbA1c.'
    },
    {
      title: 'Just outside, or far outside?',
      q: 'Healthy sodium averages 140 mmol/L with a standard deviation of 2.5. Compare results of 134 and 131 mmol/L.',
      steps: [
        '134: $z = (134 - 140)/2.5 = -2.4$ — outside the range, but a result this low or lower occurs in about 1 healthy person in 120.',
        '131: $z = (131 - 140)/2.5 = -3.6$ — about 1 healthy person in 6 000 would be this low, if the bell curve holds that far out.',
        'The second is far more likely to reflect a real problem (a medicine, a hormone disorder, too much water) and deserves attention; the first is often repeated.'
      ],
      a: 'z = −2.4 versus −3.6: distance from the range matters, not just which side of the line a result falls.'
    }
  ],
  quiz: [
    { q: 'A reference range covers the middle 95 % of healthy people. For one test, what share of healthy people get an "abnormal" result?', choices: ['none', '2.5 %', '5 %', '95 %'], a: 2,
      why: '2.5 % fall below and 2.5 % above the range: 5 % in all, by definition.' },
    { q: 'A healthy person has 10 independent tests. What is the chance that at least one is flagged?', answer: 40.1, unit: '%',
      why: '1 − 0.95¹⁰ = 1 − 0.599 = 0.401, about 40 %.' },
    { q: 'A potassium result is high in a well person whose sample took four hours to reach the laboratory. What is the likeliest explanation?', choices: ['Kidney failure', 'Potassium leaked out of the red cells in the tube', 'Eating bananas', 'A heart attack'], a: 1,
      why: 'Red cells hold about 25–30 times more potassium than plasma; when a sample is squeezed, shaken or left unspun, it leaks out. The test is repeated on a fresh, well-handled sample.' },
    { q: 'A result inside the reference range proves the organ is healthy.', a: false,
      why: 'The range describes a population. A small elderly woman can have a "normal" creatinine with half the kidney function of a young man, and a steadily rising value can matter while still in range.' },
    { q: 'Convert a total cholesterol of 5.2 mmol/L to mg/dL (molar mass about 386.7 g/mol).', answer: 201, unit: 'mg/dL', qty: 'cholesterol',
      why: '5.2 × 386.7 / 10 = 201 mg/dL — just above the American "desirable" limit of 200 mg/dL.' }
  ],
  applications: [
    'Reading your own laboratory report and preparing questions for your clinician.',
    'Choosing tests with a question in mind, rather than "everything".',
    'Laboratory quality systems that set, check and harmonise reference intervals.',
    'Moving between countries: translating results between SI and conventional units.'
  ],
  sim: 'dx-reference-range'
},

{
  id: 'medical-imaging', parent: 'clinical-assessment', title: 'Medical imaging', level: 2,
  short: 'How doctors see inside the body without cutting: X-rays and CT map how strongly tissues absorb a beam, ultrasound times echoes, MRI listens to hydrogen nuclei in a strong magnet, and nuclear medicine follows a radioactive tracer. Each has its strengths, its limits and — for some — a small radiation dose.',
  keywords: ['X-ray', 'radiograph', 'CT scan', 'computed tomography', 'Hounsfield units', 'ultrasound', 'sonography', 'Doppler', 'MRI', 'magnetic resonance', 'PET', 'nuclear medicine', 'radiation dose', 'millisievert', 'attenuation', 'echo', 'contrast'],
  prereq: ['physics:x-rays', 'physics:ultrasound', 'physics:radiation-dose'],
  related: ['history-examination', 'screening-harms', 'cancer-staging', 'stroke', 'pregnancy', 'physics:doppler-effect', 'chemistry:nmr-spectroscopy'],
  body: `
A child falls from a climbing frame and holds her wrist: an X-ray shows a crack in the radius within minutes. Her grandfather, with sudden weakness in one arm, has a CT scan of his head soon after arriving at hospital, to see whether his stroke is a bleed or a blocked artery — the treatments are opposite. Her mother, twenty weeks pregnant, watches the baby's heart beat on an ultrasound screen. Each method sends something into the body — X-rays, sound, radio waves inside a magnet, or a tracer — and turns what comes back into a picture.

### X-rays: shadows of density
X-rays are high-energy photons ([[physics:x-rays]]). Every centimetre of tissue removes a fixed fraction of those passing through, so the intensity falls exponentially with thickness:

$$I = I_0\\,e^{-\\mu x}$$

The attenuation coefficient $\\mu$ depends on the tissue's density and on its atoms: the calcium in bone absorbs far more strongly than the light atoms of soft tissue, especially at low photon energies. Fewer X-rays reach the detector behind bone, so bone shows white; air-filled lungs let most through and look dark; soft tissues are shades of grey. A plain X-ray is quick and cheap, ideal for bones and chests, but it squashes the body into one shadow, so overlapping structures hide each other.

### CT: X-rays from every angle
A CT (computed tomography) scanner spins an X-ray tube around the body, measures the transmission along thousands of lines, and reconstructs cross-sectional slices. Each point gets a **Hounsfield number**, its attenuation relative to water:

$$\\text{HU} = 1000\\,\\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}$$

Water is 0, air −1000, fat about −100, most soft tissues +20 to +80, fresh blood clot about +60 to +80, and dense bone over +1000. That fine scale lets CT show a small bleed in the brain or a small lung nodule — at a much higher radiation dose than a plain film.

### Ultrasound: timing echoes
An ultrasound probe sends short pulses of sound at 2–15 MHz ([[physics:ultrasound]]) and listens for echoes from boundaries between tissues. The machine assumes sound travels at 1 540 m/s in soft tissue, so an echo's depth follows from its round-trip time:

$$d = \\frac{c\\,t}{2}$$

An echo that returns 65 µs after the pulse comes from 5 cm down. How much sound a boundary reflects depends on the difference in **acoustic impedance** (density × speed of sound) on either side: a fat–muscle boundary returns about 1 %, bone about 40 % — leaving a shadow behind it — and air almost all of it. That is why gel is spread on the skin, and why ultrasound cannot see through gas-filled bowel or lung. Higher frequencies give finer detail but fade faster with depth, so a thyroid is scanned at 10–15 MHz and an abdomen at 2–5 MHz. The Doppler shift of echoes from moving blood ([[physics:doppler-effect]]) measures flow. Ultrasound involves no ionising radiation and works in real time, at the bedside; its images depend heavily on the operator's skill.

### MRI: hydrogen in a magnet
Magnetic resonance imaging places the body in a strong field — usually 1.5 or 3 tesla, tens of thousands of times the Earth's. Hydrogen nuclei, mostly in water and fat, line up and precess at a frequency proportional to the field:

$$f = \\bar{\\gamma}\\,B, \\qquad \\bar{\\gamma} \\approx 42.58\\ \\text{MHz per tesla}$$

— about 64 MHz at 1.5 T. A radio pulse at that frequency tips the nuclei over; as they relax they emit a faint signal whose timing differs between tissues, and small field gradients make the frequency depend on position so that each signal can be located. MRI shows the brain, spinal cord, joints and soft tissues in fine detail without ionising radiation, but scans are slow, loud and enclosed, and the magnet is always on: loose metal becomes a projectile, and some implants are unsafe. The same physics underlies [[chemistry:nmr-spectroscopy|NMR spectroscopy]].

### Nuclear medicine and PET
Instead of shining something through the body, nuclear medicine puts a small amount of a radioactive tracer into it and watches where it goes. In PET, a glucose-like molecule labelled with fluorine-18 (half-life about 110 minutes) collects in tissues that burn a lot of glucose — many cancers, the brain, the heart. Each decay releases a positron that annihilates into two gamma photons flying apart, caught by a ring of detectors. PET shows what tissues are doing rather than only their shape, and is usually combined with CT.

### Radiation doses in perspective
X-ray, CT and nuclear scans use ionising radiation, compared as an effective dose in millisieverts ([[physics:radiation-dose]]). Typical adult values (approximate; they vary several-fold between machines, protocols and patients):

| Examination | Typical effective dose | Similar to natural background for |
|---|---|---|
| Chest X-ray, one view | 0.02 mSv | about 3 days |
| Mammogram, both breasts | 0.4 mSv | about 2 months |
| CT head | 2 mSv | about 10 months |
| CT chest | 6 mSv | about 2½ years |
| CT abdomen and pelvis | 8–10 mSv | about 3–4 years |
| PET-CT | 10–25 mSv | about 4–10 years |

The comparison uses a world-average natural background of about 2.4 mSv a year (UNSCEAR estimate); it ranges from about 1 to over 10 mSv depending on where you live. Ultrasound and MRI give none. At these doses harm is too small to measure directly; the usual estimate, extrapolated from higher doses (an assumption, not a measurement), is roughly a 1 in 2 000 extra lifetime chance of cancer from a 10 mSv scan — more for children, less for older adults — against a lifetime cancer risk of about 1 in 2. A good reason not to scan without a question to answer; a poor reason to refuse a scan that is needed.

> [!tip] Tell the radiographer if you might be pregnant. Before an MRI, mention any pacemaker, implant, metal fragment or past metalwork: many modern implants are safe in the scanner, but staff must check first.

### What it means for you
The right scan depends on the question: bones and lungs on a plain film; bleeding, injuries and many cancers on CT; the brain, spine and joints on MRI; pregnancy, the heart and many abdominal organs on ultrasound. It is reasonable to ask why a scan is being done, what it could change, and whether a test without radiation could answer the same question. Scans also find things nobody was looking for — small, usually harmless "incidental" findings — which can lead to more tests and worry ([[screening-harms]]).
`,
  ideas: [
    'X-rays and CT map how strongly tissues absorb a beam: bone white, air black; CT expresses it in Hounsfield units from −1000 (air) to over +1000 (bone).',
    'Ultrasound times echoes: depth = speed × time ÷ 2, with an assumed 1 540 m/s; air and bone block it.',
    'MRI detects hydrogen nuclei resonating at about 42.6 MHz per tesla in a strong magnet, with no ionising radiation.',
    'PET and other nuclear scans follow a radioactive tracer to show what tissues are doing.',
    'Doses range from a few days of natural background for a chest X-ray to a few years for a CT: scan when there is a question to answer.'
  ],
  pitfalls: [
    'MRI uses radiation like CT — MRI uses a magnetic field and radio waves, not ionising radiation; its risks are magnetic (metal and implants) and practical (noise, confinement).',
    'A scan is always the more thorough choice — Scans also mislead: they turn up harmless incidental findings that lead to more tests, and CT carries a radiation dose. The best test is the one that answers the question.',
    'Ultrasound measures distance directly — It measures time and assumes 1 540 m/s; in fat, fluid or bone the true speed differs, so depths and shapes are slightly distorted.'
  ],
  formulas: [
    {
      name: 'X-rays through tissue',
      expr: 'T = exp(-mu*x)', tex: 'T = e^{-\\mu x}',
      vars: {
        T: { name: 'fraction of X-rays transmitted', q: 'ratio', unit: '%' },
        mu: { name: 'linear attenuation coefficient', q: 'wavenumber', unit: '1/cm', value: 0.2, tex: '\\mu' },
        x: { name: 'thickness of tissue', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'For a narrow beam of one energy. Soft tissue has μ ≈ 0.2 per cm and dense bone about 0.6 per cm at 60 keV; both fall as the energy rises.',
      stories: { T: 'What fraction of 60 keV X-rays passes through {x} of soft tissue with an attenuation coefficient of {mu}?', x: 'How thick a layer of tissue (attenuation coefficient {mu}) lets only {T} of the X-rays through?' }
    },
    {
      name: 'CT number',
      expr: 'HU = 1000*(mu - muw)/muw', tex: '\\text{HU} = 1000\\,\\frac{\\mu - \\mu_{\\text{water}}}{\\mu_{\\text{water}}}',
      vars: {
        HU: { name: 'CT number (Hounsfield units)', signed: true, tex: '\\text{HU}' },
        mu: { name: 'attenuation coefficient of the tissue', q: 'wavenumber', unit: '1/cm', value: 0.2, tex: '\\mu' },
        muw: { name: 'attenuation coefficient of water', q: 'wavenumber', unit: '1/cm', value: 0.19, tex: '\\mu_{\\text{water}}' }
      },
      note: 'Air (μ ≈ 0) is −1000 and water 0 by definition; fat about −100, soft tissue +20 to +80, dense bone over +1000.',
      stories: { HU: 'At the scanner\'s beam energy water has an attenuation coefficient of {muw} and a tissue {mu}. What is the tissue\'s CT number?' }
    },
    {
      name: 'Depth of an ultrasound echo',
      expr: 'd = c*t/2', tex: 'd = \\frac{c\\,t}{2}',
      vars: {
        d: { name: 'depth of the reflecting boundary', q: 'length', unit: 'cm' },
        c: { name: 'speed of sound assumed in tissue', q: 'speed', unit: 'm/s', value: 1540 },
        t: { name: 'round-trip time of the echo', q: 'time', unit: 'µs', value: 65 }
      },
      note: 'The factor 2: the sound goes down and comes back. At 1 540 m/s each centimetre of depth adds 13 µs to the round trip.',
      practice: { unknowns: ['d', 't'] },
      stories: { d: 'An echo returns {t} after the pulse. How deep is the boundary that reflected it?', t: 'How long after the pulse does the echo from a boundary {d} deep arrive?' }
    },
    {
      name: 'MRI resonance frequency',
      expr: 'f = gam*B', tex: 'f = \\bar{\\gamma}\\,B',
      vars: {
        f: { name: 'resonance frequency of hydrogen nuclei (MHz)', tex: 'f' },
        gam: { name: 'gyromagnetic ratio of hydrogen (MHz per tesla)', value: 42.577, fixed: true, tex: '\\bar{\\gamma}' },
        B: { name: 'magnetic field of the scanner', q: 'bfield', unit: 'T', value: 1.5 }
      },
      note: 'The Larmor frequency. Adding a gradient to the field makes the frequency depend on position — the basis of locating the signal.',
      stories: { f: 'At what frequency must a {B} scanner transmit to excite hydrogen?' }
    }
  ],
  examples: [
    {
      title: 'Why bone looks white',
      q: 'At a photon energy of 60 keV, soft tissue has μ ≈ 0.215 per cm and dense bone μ ≈ 0.60 per cm. What fraction of the X-rays gets through 3 cm of each?',
      steps: [
        'Soft tissue: $e^{-0.215 \\times 3} = e^{-0.645} = 0.52$.',
        'Bone: $e^{-0.60 \\times 3} = e^{-1.8} = 0.165$.',
        'Behind the bone only about a third as many X-rays reach the detector, so it is less exposed and the bone shows white.'
      ],
      a: 'About 52 % through soft tissue and 16 % through bone.'
    },
    {
      title: 'Placing an echo',
      q: 'An echo returns 104 µs after the pulse. How deep does the machine place the boundary? If the sound actually crossed a 3 cm layer of fat, where it travels at about 1 450 m/s, is the true depth more or less?',
      steps: [
        'Displayed depth: $1540 \\times 104 \\times 10^{-6} / 2 = 0.080$ m = 8.0 cm.',
        'The round trip through 3 cm of fat takes $2 \\times 0.03/1450 = 41.4$ µs.',
        'The remaining 62.6 µs at 1 540 m/s cover $4.82$ cm, so the true depth is $3 + 4.82 = 7.8$ cm.'
      ],
      a: 'Displayed at 8.0 cm; truly about 7.8 cm — slow fat makes deeper structures look slightly deeper than they are.'
    },
    {
      title: 'A CT scan in perspective',
      q: 'A CT of the abdomen and pelvis gives about 10 mSv. How many years of average natural background (2.4 mSv a year) is that, and what is the usual estimate of the extra lifetime cancer risk at about 5.5 % per sievert?',
      steps: [
        'Background equivalent: $10/2.4 = 4.2$ years.',
        'Estimated extra risk: $0.010 \\times 0.055 = 0.00055$, roughly 1 in 1 800.',
        'This is a model estimate, uncertain at such low doses, set against a lifetime cancer risk of about 1 in 2.'
      ],
      a: 'About 4 years of background, and roughly a 1 in 2 000 estimated extra lifetime risk.'
    }
  ],
  quiz: [
    { q: 'Why is gel spread on the skin before an ultrasound scan?', choices: ['To cool the skin', 'To remove the air gap, which would reflect almost all the sound', 'To conduct electricity to the probe', 'As a contrast agent'], a: 1,
      why: 'Air and tissue differ so much in acoustic impedance that an air gap reflects about 99.9 % of the sound; gel couples the probe to the skin.' },
    { q: 'An ultrasound echo returns 130 µs after the pulse. How deep is the reflecting boundary (c = 1 540 m/s)?', answer: 10, unit: 'cm',
      why: 'd = 1540 × 130 × 10⁻⁶ / 2 = 0.100 m = 10 cm.' },
    { q: 'Which examination uses no ionising radiation?', choices: ['CT', 'PET', 'MRI', 'Mammography'], a: 2,
      why: 'MRI uses a magnetic field and radio waves. CT and mammography use X-rays; PET uses a radioactive tracer.' },
    { q: 'Lungs look dark on a chest X-ray because air absorbs X-rays strongly.', a: false,
      why: 'The opposite: air absorbs very little, so many X-rays reach the detector behind the lungs, and a well-exposed detector shows dark.' },
    { q: 'What percentage of X-rays passes through 10 cm of tissue with μ = 0.2 per cm?', answer: 13.5, unit: '%',
      why: 'e^(−0.2 × 10) = e^(−2) = 0.135.' }
  ],
  applications: [
    'Fractures and chest infections on plain X-rays; strokes, injuries and cancers on CT.',
    'Pregnancy scans, heart ultrasound (echocardiography) and ultrasound-guided needles.',
    'MRI of the brain, spine and joints; PET-CT for staging cancer.',
    'Choosing the test with the lowest dose that answers the question, especially in children.'
  ],
  history: 'Wilhelm Röntgen discovered X-rays in November 1895, and within weeks they were used to find fractures and bullets. Godfrey Hounsfield and Allan Cormack shared the 1979 Nobel Prize for CT, whose first clinical scan, of a brain, was made in 1971. Medical ultrasound grew out of sonar and industrial flaw detection in the 1950s, with Ian Donald in Glasgow pioneering obstetric scans, and Paul Lauterbur and Peter Mansfield shared the 2003 Nobel Prize for MRI.',
  sim: [{ id: 'dx-imaging', params: { mode: 'xray' }, title: 'X-rays through the body' }, { id: 'dx-imaging', params: { mode: 'ultrasound' }, title: 'Ultrasound echoes' }]
}

);
