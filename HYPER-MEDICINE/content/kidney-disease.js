/* HYPER-MEDICINE · content/kidney-disease.js — kidney and urinary disease:
 * acute kidney injury, chronic kidney disease, dialysis and transplantation,
 * kidney stones and urinary tract infections. Simulations in sims/kidney.js. */
Hyper.add(

{
  id: 'acute-kidney-injury', parent: 'kidney-disease', title: 'Acute kidney injury', level: 2,
  short: 'A sudden fall in kidney function over hours or days, recognised by a rising creatinine or a falling urine output. It is common in people who are acutely ill, often preventable, and usually recovers when the cause is treated — but it can be life-threatening.',
  keywords: ['acute kidney injury', 'AKI', 'acute renal failure', 'KDIGO criteria', 'creatinine rise', 'oliguria', 'urine output', 'prerenal', 'acute tubular necrosis', 'obstruction', 'dehydration', 'sepsis', 'rhabdomyolysis', 'nephrotoxic', 'sick day rules', 'hyperkalaemia', 'dialysis'],
  prereq: ['glomerular-filtration', 'kidney-tests', 'body-fluids'],
  related: ['sepsis', 'chronic-kidney-disease', 'dialysis-transplant', 'side-effects-interactions', 'bleeding-shock', 'heat-cold', 'kidney-stones', 'electrolytes', 'math:exponential-growth-decay'],
  body: `
A 74-year-old man takes an ACE inhibitor and a diuretic for his blood pressure and heart. He catches a stomach bug, vomits and has diarrhoea for three days, eats and drinks little, and takes ibuprofen for an aching knee. By the fourth day he is dizzy when he stands and has hardly passed urine. His creatinine, 1.0 mg/dL (88 µmol/L) a month ago, is now 2.6 mg/dL (230 µmol/L). His kidneys are not diseased; they have been starved of blood flow while three medicines removed their defences. With fluids and a pause in those medicines, his creatinine is back to normal in a week. This is **acute kidney injury** (AKI) — once called acute renal failure.

### How it is recognised
International guidelines (KDIGO, 2012) define AKI by any of:

- a rise in creatinine of at least 0.3 mg/dL (26.5 µmol/L) within 48 hours;
- a rise to at least 1.5 times the baseline within the previous 7 days;
- urine output below 0.5 mL per kg of body weight per hour for 6 hours.

| Stage | Creatinine | Urine output |
|---|---|---|
| 1 | 1.5–1.9 × baseline, or a rise of ≥ 0.3 mg/dL (26.5 µmol/L) | < 0.5 mL/kg/h for 6–12 h |
| 2 | 2.0–2.9 × baseline | < 0.5 mL/kg/h for ≥ 12 h |
| 3 | ≥ 3.0 × baseline, or ≥ 4.0 mg/dL (354 µmol/L), or dialysis started | < 0.3 mL/kg/h for ≥ 24 h, or none for ≥ 12 h |

Creatinine is a slow witness. When the GFR falls suddenly, creatinine does not jump: it climbs towards its new, higher level with a time constant equal to the body water divided by the clearance — often a day or two ([[kidney-tests|Kidney function tests]]). A normal creatinine on the first day of a severe illness does not exclude AKI, and eGFR equations should not be used until levels are stable. Newer blood and urine markers of tubular injury are being studied to catch AKI earlier.

### Causes: before, in, or after the kidney
- **Too little blood reaching the kidneys** (prerenal) — dehydration, vomiting and diarrhoea, bleeding, heart failure, liver failure, sepsis with low blood pressure, and medicines that weaken the kidney's own pressure control: anti-inflammatory painkillers, ACE inhibitors and angiotensin receptor blockers, diuretics ([[glomerular-filtration|Filtration and GFR]]). Quickly reversible if corrected in time.
- **Damage inside the kidney** (intrinsic) — prolonged low blood flow or sepsis damaging the tubule cells (acute tubular injury); toxins such as some antibiotics, chemotherapy, myoglobin from crushed or overworked muscle (rhabdomyolysis); inflammation of the tubules as an allergic reaction to a medicine; rapidly progressive glomerulonephritis. The risk from the contrast used for CT scans is now thought to be much smaller than was once feared, though it is still weighed in people with advanced kidney disease.
- **Blocked outflow** (postrenal) — an enlarged prostate, stones, tumours, a blocked catheter. An ultrasound finds it, and relieving the blockage usually restores function.

### How common, and what it does
AKI affects roughly one in five adults admitted to hospital worldwide and more than half of those in intensive care (meta-analyses and a multinational study, 2013–2015). It is also common in the community, especially in heat waves and among older people. As the kidneys fail, water and salt build up (swelling, breathlessness), potassium rises (dangerous heart rhythms), acid accumulates, and waste products cause nausea, confusion and drowsiness. Most people recover much or all of their function, but an episode of AKI raises the later risk of [[chronic-kidney-disease|chronic kidney disease]], so a follow-up blood test is worth asking about.

### Treatment
Treatment is aimed at the cause: fluids for dehydration, treating infection, stopping or pausing medicines that harm the kidneys, relieving any blockage. **Dialysis** is used when the kidneys cannot keep up — dangerously high potassium or acid, fluid in the lungs that does not respond to treatment, severe uraemia, or certain poisonings — and is often needed only until the kidneys recover.

### What it means for you
If you take blood-pressure medicines, diuretics, metformin or anti-inflammatory painkillers, ask your doctor or pharmacist what to do if you become dehydrated through vomiting, diarrhoea or fever: many health services give written "sick day" advice, but it must be tailored to the person.

> [!warn] Passing little or no urine for a day, especially with drowsiness, confusion, breathlessness, chest pain, an irregular heartbeat or muscle weakness, is an emergency — call your local emergency number. So is severe dehydration with dizziness or fainting.
`,
  ideas: [
    'AKI is a rise in creatinine of ≥ 0.3 mg/dL (26.5 µmol/L) within 48 h, or to ≥ 1.5× baseline within 7 days, or urine < 0.5 mL/kg/h for 6 h (KDIGO 2012).',
    'Causes are grouped as too little blood flow, damage inside the kidney, or blocked outflow.',
    'Creatinine lags behind a sudden fall in GFR; its time constant is body water ÷ clearance.',
    'Dehydration combined with anti-inflammatory painkillers, ACE inhibitors or ARBs and diuretics is a classic, preventable cause.',
    'Most people recover, but AKI raises the later risk of chronic kidney disease.'
  ],
  pitfalls: [
    'A normal creatinine on admission rules out kidney injury — Creatinine takes a day or more to rise after the GFR falls; urine output and repeated measurements matter.',
    'Plenty of urine means the kidneys are fine — Some forms of AKI produce normal or even large volumes of poorly processed urine; creatinine still rises.',
    'Kidney injury always needs dialysis — Most AKI is treated by correcting the cause; dialysis is for dangerous complications and is often temporary.'
  ],
  formulas: [
    {
      name: 'Creatinine as a multiple of baseline',
      expr: 'R = Scr/Sb', tex: 'R = \\frac{S_{Cr}}{S_{base}}',
      vars: {
        R: { name: 'creatinine as a multiple of baseline' },
        Scr: { name: 'creatinine now', q: 'creatinine', unit: 'mg/dL', value: 2.1, min: 0.6, max: 8, tex: 'S_{Cr}' },
        Sb: { name: 'baseline creatinine', q: 'creatinine', unit: 'mg/dL', value: 0.9, min: 0.5, max: 1.5, tex: 'S_{base}' }
      },
      note: 'KDIGO stage 1: 1.5–1.9 (or a rise ≥ 0.3 mg/dL within 48 h); stage 2: 2.0–2.9; stage 3: ≥ 3.0 or ≥ 4.0 mg/dL. The baseline is the most recent stable value before the illness.',
      stories: { R: 'A patient\'s creatinine was {Sb} last month and is {Scr} today. By what factor has it risen?' }
    },
    {
      name: 'Urine output per kilogram per hour',
      expr: 'UO = Vu/(W*t)', tex: '\\text{UO} = \\frac{V_u}{W \\times t}',
      vars: {
        UO: { name: 'urine output', unit: 'mL/kg/h', tex: '\\text{UO}' },
        Vu: { name: 'urine volume collected (mL)', value: 180, min: 50, max: 1500, tex: 'V_u' },
        W: { name: 'body weight', q: 'mass', unit: 'kg', value: 70, min: 40, max: 120 },
        t: { name: 'collection time (hours)', value: 6, min: 2, max: 24 }
      },
      note: 'Below 0.5 mL/kg/h for 6 hours meets the KDIGO urine criterion for AKI. It needs an accurate collection — in hospital often with a catheter.',
      stories: { UO: 'A {W} man passes {Vu} mL of urine over {t} hours. What is his urine output per kg per hour?', Vu: 'How many millilitres of urine must a {W} woman pass in {t} hours to stay at {UO}?' }
    },
    {
      name: 'How fast creatinine responds',
      expr: 'tau = Vd/Cl', tex: '\\tau = \\frac{V_d}{\\text{Cl}}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 'h', tex: '\\tau' },
        Vd: { name: 'body water (creatinine\'s volume of distribution)', q: 'volume', unit: 'L', value: 42, min: 25, max: 55, tex: 'V_d' },
        Cl: { name: 'creatinine clearance', q: 'flowrate', unit: 'mL/min', value: 20, min: 5, max: 150, tex: '\\text{Cl}' }
      },
      note: 'Body water is about 60 % of weight in a man, 50–55 % in a woman. The lower the clearance, the slower creatinine settles — the lag is longest exactly when the kidneys are worst.',
      stories: { tau: 'A person with {Vd} of body water suddenly drops to a creatinine clearance of {Cl}. What is the time constant of the creatinine rise?' }
    },
    {
      name: 'Creatinine after a sudden change in GFR',
      expr: 'C = Cn - (Cn - C0)*exp(-t/tau)', tex: 'C = C_{new} - \\left(C_{new} - C_0\\right) e^{-t/\\tau}',
      vars: {
        C: { name: 'creatinine at time t', q: 'creatinine', unit: 'mg/dL', tex: 'C' },
        Cn: { name: 'new steady-state creatinine', q: 'creatinine', unit: 'mg/dL', value: 5, min: 1.5, max: 10, tex: 'C_{new}' },
        C0: { name: 'creatinine before the change', q: 'creatinine', unit: 'mg/dL', value: 1, min: 0.5, max: 1.4, tex: 'C_0' },
        t: { name: 'time since the change', q: 'time', unit: 'day', value: 1, min: 0.2, max: 7 },
        tau: { name: 'time constant', q: 'time', unit: 'h', value: 35, min: 10, max: 100, tex: '\\tau' }
      },
      note: 'A one-compartment model with steady production. After one time constant the creatinine has covered 63 % of the way, after three about 95 %.',
      stories: { C: 'After a sudden injury the creatinine is heading from {C0} to a new steady level of {Cn}, with a time constant of {tau}. What is it after {t}?', t: 'Creatinine is rising from {C0} towards {Cn} with a time constant of {tau}. How long until it reaches {C}?' },
      practice: { unknowns: ['C', 't'] }
    }
  ],
  examples: [
    {
      title: 'Staging an injury',
      q: 'A woman admitted with pneumonia had a creatinine of 0.9 mg/dL (80 µmol/L) at her last check-up. On day two in hospital it is 2.1 mg/dL (186 µmol/L). Her urine output over the last 6 hours was 180 mL; she weighs 70 kg. Does she have AKI, and what stage?',
      steps: [
        'Creatinine ratio: $2.1 / 0.9 = 2.3$ times the baseline — within the 2.0–2.9 band.',
        'Urine output: $180 / (70 \\times 6) = 0.43$ mL/kg/h, below 0.5 for 6 hours — also meets the criterion.',
        'The stage is set by whichever criterion gives the higher stage: creatinine gives stage 2, urine output (so far) stage 1.',
        'Next steps her team would consider: fluids if she is dry, treating the infection, reviewing every medicine, and an ultrasound if a blockage is possible.'
      ],
      a: 'Yes — AKI stage 2 (creatinine 2.3 × baseline).'
    },
    {
      title: 'Why creatinine lags',
      q: 'A 70 kg man (about 42 L of body water) has a creatinine of 1.0 mg/dL with a clearance of 100 mL/min. His kidneys suddenly drop to 20 mL/min. What will his creatinine be after 1, 2 and 3 days?',
      steps: [
        'New steady state: clearance falls fivefold, so creatinine will settle near $5 \\times 1.0 = 5.0$ mg/dL.',
        { text: 'Time constant:', tex: '\\tau = \\frac{42\\,000\\ \\text{mL}}{20\\ \\text{mL/min}} = 2100\\ \\text{min} = 35\\ \\text{h} \\approx 1.46\\ \\text{days}' },
        { text: 'Approach:', tex: 'C(t) = 5.0 - 4.0\\, e^{-t/1.46\\ \\text{d}}' },
        'Day 1: 3.0 mg/dL; day 2: 4.0; day 3: 4.5 (265, 352 and 397 µmol/L). On day 1 his kidney function is already at a fifth, but the creatinine suggests only a threefold rise.'
      ],
      a: 'About 3.0, 4.0 and 4.5 mg/dL — the creatinine takes days to reveal an injury that happened at once.'
    }
  ],
  quiz: [
    { q: 'Which is NOT part of the KDIGO definition of acute kidney injury?', choices: ['creatinine rise of ≥ 0.3 mg/dL within 48 hours', 'creatinine ≥ 1.5 times baseline within 7 days', 'urine output < 0.5 mL/kg/h for 6 hours', 'an eGFR below 60 on a single test'], a: 3,
      why: 'A single low eGFR says nothing about how fast things changed — and eGFR equations assume a steady state, which AKI is not.' },
    { q: 'An older man becomes unable to pass urine and his creatinine rises; an ultrasound shows swollen kidneys and a full bladder. The AKI is most likely…', choices: ['prerenal (too little blood flow)', 'intrinsic (tubular damage)', 'postrenal (blocked outflow), for example from an enlarged prostate', 'caused by too much fluid'], a: 2,
      why: 'Both kidneys swollen with urine above a full bladder points to a blockage below the bladder. A catheter to drain it usually lets function recover.' },
    { q: 'A 60 kg woman passes 150 mL of urine in 6 hours. What is her urine output in mL/kg/h?', answer: 0.42, unit: 'mL/kg/h',
      why: '150 / (60 × 6) = 0.42 mL/kg/h — below 0.5, so she meets the urine-output criterion for AKI.' },
    { q: 'On the first day of a severe kidney injury, the creatinine already shows the full extent of the damage.', a: false,
      why: 'Creatinine rises with a time constant of body water ÷ clearance — often a day or two — so it understates a sudden injury at first.' },
    { q: 'Why is dehydration plus an anti-inflammatory painkiller plus an ACE inhibitor a risky mix for the kidneys?', choices: ['the painkiller blocks the afferent arteriole\'s widening and the ACE inhibitor removes the efferent squeeze, so the filtration pressure collapses when blood pressure is low', 'both medicines are directly toxic to the glomerulus', 'dehydration makes the medicines stronger by concentrating them', 'the combination causes kidney stones'], a: 0,
      why: 'In dehydration the kidney holds its filtration pressure with prostaglandins (widening the inflow) and angiotensin II (narrowing the outflow). Blocking both removes its defences.' }
  ],
  applications: ['Electronic alerts in hospital laboratories that flag a rising creatinine.', 'Medicine reviews and "sick day" advice for people on blood-pressure medicines, diuretics or metformin.', 'Hydration and early treatment in heat waves, marathons and crush injuries.'],
  sim: { id: 'kid-creatinine', params: { aki: true } }
},

{
  id: 'chronic-kidney-disease', parent: 'kidney-disease', title: 'Chronic kidney disease', level: 2,
  short: 'Kidney damage or reduced function that lasts more than three months. It affects roughly one adult in ten, is usually silent, is staged by the eGFR and the albumin in the urine, and can often be slowed markedly — mainly by controlling blood pressure and glucose and with medicines that protect the kidneys.',
  keywords: ['chronic kidney disease', 'CKD', 'KDIGO', 'GFR category', 'albuminuria category', 'heat map', 'eGFR decline', 'diabetic kidney disease', 'hypertensive kidney disease', 'polycystic kidney disease', 'glomerulonephritis', 'kidney failure', 'SGLT2 inhibitors', 'ACE inhibitor', 'ARB', 'renal anaemia', 'mineral bone disorder', 'kidney failure risk equation'],
  prereq: ['kidney-tests', 'hypertension', 'type2-diabetes'],
  related: ['acute-kidney-injury', 'dialysis-transplant', 'glomerular-filtration', 'anemia', 'bone-calcium', 'atherosclerosis', 'heart-failure', 'metabolic-syndrome', 'healthy-diet', 'smoking', 'risk-communication'],
  body: `
Maria is 55, has had type 2 diabetes for twelve years and high blood pressure for eight, and feels perfectly well. At her yearly check her eGFR is 52 mL/min/1.73 m² and her urine albumin-to-creatinine ratio 80 mg/g (9 mg/mmol). Three months later the tests are repeated: eGFR 50, ACR 95 mg/g. She now has **chronic kidney disease**, category G3a A2 — something she could not have felt, and something that can be slowed a great deal.

### The definition
KDIGO — the international kidney guideline group, in its 2012 classification kept in the 2024 guideline — defines chronic kidney disease (CKD) as abnormalities of kidney structure or function **present for more than three months**, with implications for health. Either is enough:

- an eGFR below 60 mL/min/1.73 m²; or
- a marker of kidney damage: albumin in the urine (ACR ≥ 30 mg/g, ≥ 3 mg/mmol), blood cells or casts in the urine, abnormal findings on imaging or biopsy, tubular disorders, or a kidney transplant.

The three-month rule matters: a single abnormal test may reflect dehydration, an acute illness or a temporary rise in albumin after exercise or infection ([[kidney-tests|Kidney function tests]]).

### Staging: GFR and albuminuria together
CKD is described by its **c**ause, **G**FR category and **a**lbuminuria category (CGA):

| GFR category | eGFR (mL/min/1.73 m²) | | Albuminuria | ACR |
|---|---|---|---|---|
| G1 | ≥ 90, normal or high | | A1 | < 30 mg/g (< 3 mg/mmol) |
| G2 | 60–89, mildly decreased | | A2 | 30–300 mg/g (3–30 mg/mmol) |
| G3a | 45–59 | | A3 | > 300 mg/g (> 30 mg/mmol) |
| G3b | 30–44 | | | |
| G4 | 15–29 | | | |
| G5 | < 15, kidney failure | | | |

The two are combined in a colour-coded **heat map** of prognosis — the risk of kidney failure, heart disease and death:

| | A1 | A2 | A3 |
|---|---|---|---|
| G1, G2 | low (green)* | moderately increased (yellow) | high (orange) |
| G3a | moderately increased | high | very high (red) |
| G3b | high | very high | very high |
| G4, G5 | very high | very high | very high |

*G1–G2 with A1 is not CKD unless another marker of damage is present. Albuminuria counts as much as GFR: someone with an eGFR of 70 and heavy albuminuria is at higher risk than someone with an eGFR of 50 and none. Validated calculators such as the kidney failure risk equation turn age, sex, eGFR and ACR into a percentage risk of kidney failure over two and five years.

### How common, and why
The Global Burden of Disease study estimated that about 700 million people had CKD in 2017 — roughly 9 % of the world's population — and that it caused about 1.2 million deaths. Most people with early CKD do not know they have it. **Diabetes** and **high blood pressure** cause most of it in many countries; other causes include glomerulonephritis, inherited polycystic kidney disease, repeated obstruction or infection, some medicines, and, in hot farming regions of Central America and South Asia, a kidney disease of uncertain cause linked to heat stress and dehydration.

### What it does
As function falls: blood pressure rises and fluid builds up; the kidneys make less erythropoietin ([[anemia|anaemia]]) and less active vitamin D, while phosphate and parathyroid hormone rise (mineral and bone disorder, [[bone-calcium|Bone and calcium]]); acid and potassium accumulate; and in G5 waste products cause tiredness, itching, nausea, poor appetite, cramps and poor sleep. Many medicines need lower doses or should be avoided. Above all, CKD roughly doubles or triples the risk of heart attack and stroke — most people with CKD are more likely to die of heart disease than to reach kidney failure.

### Slowing it down
The decline can often be slowed a great deal. The 2024 KDIGO guideline describes these pillars:

- **blood-pressure control** — KDIGO (2021) suggests a systolic target below 120 mmHg where tolerated, measured with a standardised technique;
- **RAS blockers** (ACE inhibitors or angiotensin receptor blockers) when there is albuminuria or high blood pressure — they lower the pressure inside the glomeruli and the albumin leak;
- **SGLT2 inhibitors** for most people with CKD, with or without diabetes, after trials (such as DAPA-CKD, 2020, and EMPA-KIDNEY, 2022) showed slower decline and fewer deaths; in type 2 diabetes with albuminuria, also a non-steroidal mineralocorticoid receptor antagonist and GLP-1 receptor agonists;
- **glucose control**, **statins** for heart risk, not smoking, physical activity, a healthy weight, a moderate salt intake (KDIGO suggests under 2 g of sodium a day) and a protein intake of about 0.8 g per kg per day in G3–G5;
- **avoiding harm** — anti-inflammatory painkillers, dehydration, and doses of medicines not adjusted for kidney function.

These medicines often cause a small, expected dip in eGFR when started, which is not a reason to stop them without advice. The simulation lets you see how the pillars change the slope. Every person's plan is different: these are questions to talk through with your doctor.

> [!warn] In someone with CKD, breathlessness, swelling that is rapidly getting worse, much less urine, confusion or drowsiness, chest pain, or palpitations with muscle weakness (possible high potassium) need urgent help — call your local emergency number.
`,
  ideas: [
    'CKD means abnormal kidney structure or function lasting more than three months (KDIGO 2012, kept in 2024).',
    'It is staged by GFR (G1–G5) and albuminuria (A1–A3); the combination sets the risk shown on the heat map.',
    'About 700 million people had CKD in 2017; most do not know. Diabetes and high blood pressure are the main causes.',
    'The heart is the bigger danger: most people with CKD are more likely to have a heart attack or stroke than to need dialysis.',
    'Blood-pressure control, RAS blockers, SGLT2 inhibitors and avoiding kidney harm can slow the decline markedly.'
  ],
  pitfalls: [
    'CKD always leads to dialysis — Most people with CKD never reach kidney failure; many stay stable for years, especially with treatment.',
    'If eGFR is above 60, the kidneys are fine — Albuminuria marks damage at any eGFR and predicts risk as strongly as the eGFR itself.',
    'A small fall in eGFR after starting an ACE inhibitor or SGLT2 inhibitor means the medicine is harming the kidneys — A dip of up to about 30 % is expected, reflects lower pressure in the glomeruli, and goes with better long-term protection; bigger changes are checked by the doctor.'
  ],
  formulas: [
    {
      name: 'Albumin-to-creatinine ratio',
      expr: 'ACR = Ualb/Ucr', tex: '\\text{ACR} = \\frac{U_{alb}}{U_{Cr}}',
      vars: {
        ACR: { name: 'albumin-to-creatinine ratio', unit: 'mg/g', tex: '\\text{ACR}' },
        Ualb: { name: 'urine albumin (mg/L)', value: 60, min: 5, max: 1000, tex: 'U_{alb}' },
        Ucr: { name: 'urine creatinine (g/L)', value: 1.2, min: 0.3, max: 2.5, tex: 'U_{Cr}' }
      },
      note: 'Plain numbers: albumin in mg/L, creatinine in g/L, ACR in mg/g. Multiply mg/g by 0.113 for mg/mmol. A1 < 30 mg/g, A2 30–300, A3 > 300. Dividing by creatinine cancels out how dilute the sample is.',
      stories: { ACR: 'A morning urine sample contains {Ualb} mg/L of albumin and {Ucr} g/L of creatinine. What is the ACR in mg/g?' }
    },
    {
      name: 'eGFR after years of steady decline',
      expr: 'E = E0 - r*t', tex: '\\text{eGFR}_t = \\text{eGFR}_0 - r\\,t',
      vars: {
        E: { name: 'eGFR later', unit: 'mL/min/1.73 m²', tex: '\\text{eGFR}_t' },
        E0: { name: 'eGFR now', unit: 'mL/min/1.73 m²', value: 45, min: 20, max: 90, tex: '\\text{eGFR}_0' },
        r: { name: 'yearly loss (mL/min/1.73 m² per year)', value: 3, min: 0.5, max: 6, tex: 'r' },
        t: { name: 'time', q: 'years', unit: 'yr', value: 10, min: 1, max: 30 }
      },
      note: 'A straight-line approximation: real eGFR results wobble from test to test and slopes change with treatment. Normal ageing costs roughly 1 a year; a loss of more than 5 a year is called rapid progression.',
      stories: { E: 'An eGFR of {E0} falls by {r} each year. What is it after {t}?', t: 'An eGFR of {E0} is falling by {r} a year. How long until it reaches {E}?', r: 'Over {t} a person\'s eGFR went from {E0} to {E}. What was the average yearly loss?' },
      practice: { unknowns: ['E', 't', 'r'] }
    }
  ],
  examples: [
    {
      title: 'Putting Maria on the map',
      q: 'Maria\'s tests: eGFR 52 then 50 mL/min/1.73 m², ACR 80 then 95 mg/g, three months apart. Classify her CKD and find her place on the heat map.',
      steps: [
        'Duration: abnormal on two occasions three months apart, so it is chronic.',
        'GFR category: 50 lies in 45–59, so G3a.',
        'Albuminuria: 95 mg/g lies in 30–300 (in SI units $95 \\times 0.113 = 10.7$ mg/mmol), so A2.',
        'Heat map: G3a with A2 is orange — high risk. Cause: most likely diabetes and high blood pressure, so "CKD G3a A2, probably diabetic".',
        'Her team would discuss blood pressure, a RAS blocker, an SGLT2 inhibitor, glucose and heart-risk treatment, and regular checks of eGFR, ACR and potassium.'
      ],
      a: 'CKD G3a A2 — orange (high risk) on the KDIGO heat map.'
    },
    {
      title: 'What a slower slope is worth',
      q: 'A man of 60 has an eGFR of 45 falling by 4 mL/min/1.73 m² a year. With treatment the fall slows to 1.5 a year. When would his eGFR reach 15 in each case?',
      steps: [
        'Without the change: $t = (45 - 15)/4 = 7.5$ years — at about 67.',
        'With it: $t = (45 - 15)/1.5 = 20$ years — at about 80.',
        'The same starting point, with 12.5 more years before kidney failure — and at that slope he may never need dialysis in his lifetime. Real slopes are less tidy, but the arithmetic shows why slowing the decline early matters so much.'
      ],
      a: 'About 7.5 years versus 20 years.'
    },
    {
      title: 'Reading an ACR',
      q: 'A morning urine sample contains 60 mg/L of albumin and 1.2 g/L of creatinine. What is the ACR, in both units, and which category is it?',
      steps: [
        '$\\text{ACR} = 60 / 1.2 = 50$ mg/g.',
        'In SI units: $50 \\times 0.113 = 5.7$ mg/mmol.',
        'Between 30 and 300 mg/g (3–30 mg/mmol): category A2, moderately increased. It should be confirmed on repeat samples, since fever, hard exercise, infection or menstruation can raise it for a day or two.'
      ],
      a: '50 mg/g (5.7 mg/mmol): A2, to be confirmed.'
    }
  ],
  quiz: [
    { q: 'Which of these is needed to diagnose chronic kidney disease?', choices: ['symptoms such as tiredness or swelling', 'abnormal kidney tests lasting more than three months', 'an eGFR below 15', 'a kidney biopsy'], a: 1,
      why: 'CKD is defined by abnormalities of structure or function lasting over three months; most people have no symptoms, and a biopsy is needed only when the cause is unclear.' },
    { q: 'Person A: eGFR 70, ACR 400 mg/g. Person B: eGFR 50, ACR 10 mg/g. On the KDIGO heat map…', choices: ['A is orange (high risk), B is yellow (moderately increased)', 'both are green', 'B is at higher risk because the eGFR is lower', 'A has no CKD because the eGFR is above 60'], a: 0,
      why: 'A is G2 A3 (orange); B is G3a A1 (yellow). Heavy albuminuria carries at least as much risk as a lower eGFR.' },
    { q: 'For most people with chronic kidney disease, the biggest threat to life is…', choices: ['needing dialysis', 'heart attack and stroke', 'kidney stones', 'urinary infection'], a: 1,
      why: 'CKD multiplies cardiovascular risk; most people with CKD are more likely to die of heart disease than to reach kidney failure — which is why statins and blood-pressure control are part of the plan.' },
    { q: 'An eGFR of 40 falls by 2.5 mL/min/1.73 m² a year. In how many years does it reach 15?', answer: 10, unit: 'yr',
      why: '(40 − 15) / 2.5 = 10 years, if the slope stays the same.' },
    { q: 'A modest dip in eGFR in the first weeks after starting an SGLT2 inhibitor is expected and usually no reason to stop it.', a: true,
      why: 'The medicine lowers the pressure inside the glomeruli, which briefly lowers filtration but protects the nephrons; trials show slower long-term decline. Larger falls are checked by the prescriber.' }
  ],
  applications: ['Yearly eGFR and urine ACR checks for people with diabetes or high blood pressure.', 'The KDIGO heat map and kidney failure risk equations in deciding when to refer to a kidney specialist.', 'Adjusting medicine doses for kidney function.', 'Planning ahead for dialysis, transplantation or conservative care in G4–G5.'],
  history: 'The modern definition and staging of chronic kidney disease were introduced by the US National Kidney Foundation in 2002 and extended by KDIGO in 2012 to include albuminuria and the heat map.',
  sim: 'kid-ckd'
},

{
  id: 'dialysis-transplant', parent: 'kidney-disease', title: 'Dialysis and transplantation', level: 2,
  short: 'When the kidneys fail, their filtering can be replaced by dialysis — blood cleaned across a membrane by diffusion — or by a transplanted kidney. Each has its own demands; supportive care without dialysis is a valid choice for some people.',
  keywords: ['dialysis', 'haemodialysis', 'peritoneal dialysis', 'dialyser', 'fistula', 'Kt/V', 'urea reduction ratio', 'ultrafiltration', 'countercurrent', 'kidney transplant', 'living donor', 'deceased donor', 'immunosuppression', 'rejection', 'kidney replacement therapy', 'conservative kidney management'],
  prereq: ['chronic-kidney-disease', 'membrane-transport', 'adaptive-immunity'],
  related: ['kidney-anatomy', 'acute-kidney-injury', 'electrolytes', 'immunodeficiency', 'chemistry:osmotic-pressure', 'math:exponential-growth-decay', 'infection-spread'],
  body: `
Three mornings a week David, 62, drives to the dialysis unit, has two needles placed in the swollen vein of his forearm, and spends four hours in a reclining chair while a machine cleans his blood. Between sessions he limits what he drinks and eats little salt, potassium and phosphate, because his own kidneys make almost no urine. He is on the waiting list for a kidney. He is one of several million people worldwide kept alive by dialysis or a transplant.

### When the kidneys fail
Kidney failure (CKD G5, eGFR below 15) does not by itself mean dialysis must start. Treatment usually begins when symptoms appear — fatigue, nausea, itching, breathlessness from fluid, poor appetite — or when potassium, acid or fluid can no longer be controlled, often at an eGFR somewhere between 5 and 10. The options are haemodialysis, peritoneal dialysis, a transplant, or **conservative kidney management**: good symptom control and support without dialysis, which for some older, frail people with other serious illnesses may offer a similar length of life with fewer days in hospital. The choice is personal and is best planned well ahead.

### Haemodialysis: diffusion across a membrane
Blood is pumped at about 300–450 mL/min through a **dialyser**, a cylinder packed with some ten thousand hollow fibres whose walls are a thin membrane with a total area of about 1.5–2 m². A salt solution, the dialysate, flows around the fibres in the **opposite direction** at about 500–800 mL/min. Small molecules — urea, creatinine, potassium — [[membrane-transport|diffuse]] from the blood, where they are concentrated, into the dialysate, where they are absent; bicarbonate diffuses the other way to correct acidity. Blood cells and proteins are too large to cross. Because the two streams run countercurrent, fresh dialysate meets the cleanest blood, so a gradient is kept along the whole fibre. A slight pressure difference also squeezes water out (**ultrafiltration**), removing the fluid gained since the last session.

Access to the blood needs a strong, fast flow. The best is an **arteriovenous fistula** — an artery joined to a vein in the arm by a small operation months in advance, so the vein enlarges; alternatives are a synthetic graft or a catheter in a large neck vein, which is more prone to infection.

### How much is enough: Kt/V
Urea is used as the marker of the dose. During a session its level falls roughly exponentially:

$$C = C_0\\, e^{-Kt/V}$$

where $K$ is the dialyser's urea clearance, $t$ the session time and $V$ the body water. The dimensionless product **Kt/V** is the dose; with three sessions a week, guidelines (KDOQI, 2015) set a minimum single-session Kt/V of 1.2 (target about 1.4), or a **urea reduction ratio** of at least 65 %. After the session, urea seeps back out of the cells into the blood (**rebound**), so the effective dose is a little lower than the end-of-session numbers suggest. Longer or more frequent sessions, at home or overnight, clear more and are gentler on the heart.

### Peritoneal dialysis
The lining of the abdomen, the peritoneum, is itself a membrane with a rich blood supply. Through a soft catheter, about 2 L of a sugary (glucose or icodextrin) solution is run into the abdomen, left for several hours while wastes diffuse in and water is drawn in by [[chemistry:osmotic-pressure|osmosis]], then drained — usually four exchanges a day, or overnight by a machine. It is done at home and preserves any remaining kidney function; the main risk is **peritonitis**, infection of the abdominal lining.

### Transplantation
For most people who are fit enough, a transplant gives longer, fuller life than dialysis. The new kidney is placed low in the abdomen and joined to the blood vessels and bladder; the patient's own kidneys are usually left in place. It can come from a **deceased donor** or a **living donor** — a relative, friend, or a stranger in a paired exchange scheme. Blood groups and tissue types (HLA) are matched and a crossmatch checks that the recipient has no antibodies against the donor.

To stop the [[adaptive-immunity|immune system]] rejecting it, recipients take immunosuppressive medicines for life — typically a calcineurin inhibitor (tacrolimus or ciclosporin), an antiproliferative agent (mycophenolate) and often a corticosteroid. These raise the risk of infections and of some cancers, especially of the skin. Kidneys from deceased donors work for about 10–15 years on average and from living donors longer; a second transplant is possible. Living donors are screened carefully: in a US study published in 2014 the 15-year risk of kidney failure after donation was about 0.3 %, compared with about 0.04 % in similar healthy people who did not donate — a real but small increase.

### The global picture
Access is deeply unequal. A 2015 study estimated that in 2010 about 2.6 million people received dialysis or a transplant, while between about 2 and 7 million more died because they could not get it — mostly in Asia and Africa. Registry data from high-income countries (for example the US Renal Data System, 2020s) show that roughly 40–50 % of people starting dialysis are alive five years later, many more among the young, fewer among the oldest.

> [!warn] For people on dialysis: breathlessness, chest pain, palpitations or muscle weakness (for example after a missed session), fever or shivering, redness or pus around a catheter, bleeding from the access that does not stop, or cloudy peritoneal fluid with belly pain need urgent help — contact your unit or call your local emergency number. Transplant recipients with fever, much less urine or pain over the kidney should contact their transplant team the same day.
`,
  ideas: [
    'Dialysis cleans blood by diffusion across a membrane, with dialysate flowing countercurrent to keep the gradient; ultrafiltration removes fluid.',
    'The dose is Kt/V: clearance × time ÷ body water; urea falls as e^(−Kt/V), and a single-session Kt/V of at least 1.2 is the usual minimum.',
    'Peritoneal dialysis uses the abdominal lining as the membrane and osmosis to remove water.',
    'A transplant usually offers the longest and fullest life but needs lifelong immunosuppression.',
    'Conservative care without dialysis is a legitimate choice for some; access to kidney replacement is very unequal worldwide.'
  ],
  pitfalls: [
    'Dialysis replaces the kidneys completely — It removes wastes and fluid for a few hours a week; it does not make hormones or match a kidney\'s continuous work, which is why diet, fluid limits and medicines continue.',
    'A transplant is a cure — It is a treatment: it needs lifelong medicines, carries risks of rejection, infection and some cancers, and usually lasts one to two decades.',
    'Everyone with kidney failure must start dialysis immediately — The decision depends on symptoms and complications, and for some older or frail people conservative care is an equally reasonable path.'
  ],
  formulas: [
    {
      name: 'Urea during a session (single pool)',
      expr: 'C = C0*exp(-K*t/V)', tex: 'C = C_0\\, e^{-K t / V}',
      vars: {
        C: { name: 'blood urea at time t', q: 'urea', unit: 'mmol/L', tex: 'C' },
        C0: { name: 'blood urea before dialysis', q: 'urea', unit: 'mmol/L', value: 25, min: 10, max: 40, tex: 'C_0' },
        K: { name: 'dialyser urea clearance', q: 'flowrate', unit: 'mL/min', value: 260, min: 150, max: 350 },
        t: { name: 'time on dialysis', q: 'time', unit: 'h', value: 4, min: 2, max: 6 },
        V: { name: 'body water (urea\'s volume of distribution)', q: 'volume', unit: 'L', value: 40, min: 25, max: 60 }
      },
      note: 'Ignores urea made during the session, fluid removal and rebound. Urea can be shown as mg/dL of BUN (1 mmol/L urea = 2.8 mg/dL BUN).',
      stories: { C: 'A session starts with blood urea at {C0}. The dialyser clears {K}, the patient has {V} of body water and the session lasts {t}. What is the urea at the end?', t: 'With a clearance of {K} and {V} of body water, how long does it take to bring urea from {C0} down to {C}?' },
      practice: { unknowns: ['C', 't'] }
    },
    {
      name: 'Urea reduction ratio',
      expr: 'URR = 1 - Cpost/Cpre', tex: '\\text{URR} = 1 - \\frac{C_{post}}{C_{pre}}',
      vars: {
        URR: { name: 'urea reduction ratio', q: 'ratio', unit: '%', tex: '\\text{URR}' },
        Cpost: { name: 'urea after the session', q: 'urea', unit: 'mmol/L', value: 7.5, min: 3, max: 15, tex: 'C_{post}' },
        Cpre: { name: 'urea before the session', q: 'urea', unit: 'mmol/L', value: 25, min: 15, max: 40, tex: 'C_{pre}' }
      },
      note: 'At least 65 % is the usual minimum for three sessions a week.',
      stories: { URR: 'Blood urea is {Cpre} before a session and {Cpost} after it. What is the urea reduction ratio?' }
    },
    {
      name: 'Kt/V from blood tests (Daugirdas)',
      expr: 'KtV = -ln(R - 0.008*t) + (4 - 3.5*R)*UF/W', tex: '\\text{Kt/V} = -\\ln\\left(R - 0.008\\,t\\right) + \\left(4 - 3.5R\\right)\\frac{\\text{UF}}{W}',
      vars: {
        KtV: { name: 'single-pool Kt/V', tex: '\\text{Kt/V}' },
        R: { name: 'post-dialysis ÷ pre-dialysis urea', value: 0.3, min: 0.2, max: 0.45 },
        t: { name: 'session length (hours)', value: 4, min: 2.5, max: 6 },
        UF: { name: 'fluid removed (L)', value: 2.5, min: 0, max: 4, tex: '\\text{UF}' },
        W: { name: 'weight after dialysis (kg)', value: 75, min: 40, max: 120 }
      },
      note: 'An empirical formula (Daugirdas, 1993), so plain numbers: hours, litres and kilograms. The 0.008·t term allows for urea made during the session; the last term for the urea carried out with the removed fluid.',
      stories: { KtV: 'Urea falls to {R} of its starting value over a {t}-hour session in which {UF} L of fluid is removed from a patient weighing {W} kg afterwards. What is the Kt/V?' },
      practice: { unknowns: ['KtV'] }
    }
  ],
  examples: [
    {
      title: 'Is the dose enough?',
      q: 'A dialyser clears urea at 260 mL/min, the session lasts 4 hours, and the patient has 40 L of body water. Pre-dialysis urea is 25 mmol/L (BUN 70 mg/dL). Find Kt/V, the expected end-of-session urea and the URR.',
      steps: [
        '$K t = 260\\ \\text{mL/min} \\times 240\\ \\text{min} = 62{,}400$ mL $= 62.4$ L.',
        '$Kt/V = 62.4 / 40 = 1.56$ — above the minimum of 1.2.',
        '$C = 25\\, e^{-1.56} = 5.3$ mmol/L.',
        'URR $= 1 - 5.3/25 = 79$ %. In practice urea made during the session and rebound afterwards make the real figures a little lower.'
      ],
      a: 'Kt/V ≈ 1.56, urea ≈ 5.3 mmol/L, URR ≈ 79 %.'
    },
    {
      title: 'From the blood tests',
      q: 'Urea falls from 25 to 7.5 mmol/L during a 4-hour session in which 2.5 L of fluid is removed; the patient weighs 75 kg afterwards. What is the Kt/V by the Daugirdas formula, and the URR?',
      steps: [
        '$R = 7.5 / 25 = 0.30$; URR $= 1 - 0.30 = 70$ %.',
        { text: 'Kt/V:', tex: '-\\ln(0.30 - 0.032) + (4 - 1.05)\\times\\frac{2.5}{75} = 1.317 + 0.098 = 1.42' },
        'Both meet the usual minimums (URR ≥ 65 %, Kt/V ≥ 1.2).'
      ],
      a: 'Kt/V ≈ 1.42, URR 70 %.'
    },
    {
      title: 'A bigger body needs more',
      q: 'The same dialyser (260 mL/min) and 4-hour session are used for a large man with 55 L of body water. What is his Kt/V, and how long would he need for 1.4?',
      steps: [
        '$Kt/V = 62.4 / 55 = 1.13$ — below the minimum.',
        'For 1.4: $t = 1.4 \\times 55{,}000 / 260 = 296$ min, about 4 h 56 min.',
        'Options his team might consider: longer or extra sessions, a larger dialyser, or a faster blood flow if his access allows.'
      ],
      a: 'Kt/V ≈ 1.13; about 5 hours would be needed for 1.4.'
    }
  ],
  quiz: [
    { q: 'In a dialyser, urea moves from the blood into the dialysate mainly by…', choices: ['diffusion down its concentration gradient', 'active pumping by the membrane', 'being filtered with the red cells', 'osmosis'], a: 0,
      why: 'Urea is small and passes the membrane freely; it moves from high concentration (blood) to low (fresh dialysate). Water removal is by pressure (ultrafiltration), and in peritoneal dialysis by osmosis.' },
    { q: 'Why do the blood and the dialysate flow in opposite directions?', choices: ['to keep a concentration difference along the whole fibre, so more urea is removed', 'to stop the blood clotting', 'to warm the blood', 'it makes no difference'], a: 0,
      why: 'Countercurrent flow means the cleanest blood always meets the freshest dialysate. With both flowing the same way, they approach the same concentration and the far end of the fibre does little.' },
    { q: 'A session gives K = 250 mL/min for 4 hours in a patient with 50 L of body water. What is Kt/V?', answer: 1.2,
      why: '250 × 240 = 60,000 mL = 60 L; 60 / 50 = 1.2 — just at the usual minimum.' },
    { q: 'After a kidney transplant, immunosuppressive medicines can usually be stopped once the kidney is working well.', a: false,
      why: 'They are needed for as long as the kidney functions, because the immune system would still recognise it as foreign. Doses are usually reduced after the first months, never simply stopped without the transplant team.' },
    { q: 'Which is a main risk specific to peritoneal dialysis?', choices: ['peritonitis (infection of the abdominal lining)', 'damage to the arm veins', 'rejection', 'kidney stones'], a: 0,
      why: 'The catheter into the abdomen is a route for bacteria; cloudy drained fluid with belly pain needs urgent attention.' }
  ],
  applications: ['Planning a fistula months before haemodialysis is expected to start.', 'Monthly Kt/V or URR checks in dialysis units.', 'Living-donor programmes and paired kidney exchange.', 'Emergency dialysis for poisoning and severe acute kidney injury.'],
  history: 'Willem Kolff built a working artificial kidney from sausage casing and a rotating drum in the occupied Netherlands in 1943–45; in 1954 Joseph Murray\'s team in Boston performed the first successful kidney transplant, between identical twins.',
  sim: 'kid-dialysis'
},

{
  id: 'kidney-stones', parent: 'kidney-disease', title: 'Kidney stones', level: 1,
  short: 'Hard crystals that form when urine holds more of a salt than it can keep dissolved. Small stones often pass unnoticed; a stone moving down the ureter causes some of the worst pain there is. Most are calcium oxalate, and many can be prevented — above all by making more urine.',
  keywords: ['kidney stones', 'renal colic', 'nephrolithiasis', 'urolithiasis', 'calcium oxalate', 'uric acid stones', 'struvite', 'cystine', 'supersaturation', 'citrate', 'hydration', 'urine volume', 'lithotripsy', 'ureteroscopy', 'hydronephrosis'],
  prereq: ['urine-concentration', 'chemistry:solubility-product', 'kidney-anatomy'],
  related: ['uti', 'acute-kidney-injury', 'bone-calcium', 'healthy-diet', 'obesity', 'medical-imaging', 'pain', 'chemistry:precipitation'],
  body: `
Tom, 38, wakes at 4 a.m. with a pain in his side so severe he cannot keep still. It comes in waves, spreading down towards his groin; he feels sick and vomits. His urine looks pinkish. It was a hot week and he had drunk little. A scan shows a 4 mm stone in the ureter, the tube from kidney to bladder. With pain relief it passes two days later — and his doctor's first advice is to drink enough to make more urine every day.

### How stones form
Urine carries away salts that are only sparingly soluble. When the product of the concentrations of two ions — calcium and oxalate, say — exceeds what the solution can hold (its [[chemistry:solubility-product|solubility product]]), the urine is **supersaturated**. Between saturation and a higher limit lies a **metastable** zone, where existing crystals grow but new ones rarely start; above that limit crystals form on their own. Crystals that stick to the kidney's lining — often on small calcium deposits at the tips of the papillae — can grow over months into a stone.

What tips the balance:

- **Low urine volume** — concentration is amount ÷ volume, and for a salt made of two ions the saturation falls roughly with the *square* of the volume;
- **more of the stone-forming substances** — high urine calcium (often from a salty diet), oxalate (from some foods, or from gut conditions that increase its absorption), uric acid;
- **fewer inhibitors** — citrate binds calcium and blocks crystal growth; low citrate is common in stone formers;
- **urine pH** — uric acid is much less soluble in acidic urine (below about 5.5), while calcium phosphate prefers alkaline urine.

### The main kinds
- **Calcium oxalate** — about 70–80 % of stones; linked to low urine volume, high urine calcium or oxalate, low citrate.
- **Calcium phosphate** — with alkaline urine, some tubular disorders and overactive parathyroid glands.
- **Uric acid** — about 5–10 %; with persistently acidic urine, as in gout, type 2 diabetes and obesity. They can often be dissolved by making the urine less acidic.
- **Struvite** ("infection stones") — formed when certain bacteria split urea and make urine alkaline; can grow into large branching stones.
- **Cystine** — rare, from an inherited transport defect.

### How common
In the United States about 1 in 11 people has had a stone (national survey, 2007–2010), men more than women, and the numbers have been rising; worldwide the lifetime risk varies from a few per cent to over 10 % by region and climate. Without prevention roughly half of people who have had one stone have another within about 5–10 years.

### Diagnosis and treatment
A low-dose CT scan finds nearly all stones; ultrasound avoids radiation and is preferred in pregnancy and often in children. Most stones smaller than about 5 mm pass on their own within a few weeks, and about half of those 5–10 mm do; pain relief (guidelines favour anti-inflammatory painkillers for colic where they are safe for the person) and time are the main treatment. Medicines that relax the ureter (alpha-blockers) may help larger stones low in the ureter pass, though trials disagree. Stones that are large, stuck, infected or blocking a single kidney are removed: by **shock-wave lithotripsy** (breaking them from outside the body), **ureteroscopy** (a thin telescope up the urethra with a laser), or, for large kidney stones, **percutaneous nephrolithotomy** through a small cut in the back.

### Prevention
Guidelines on stone prevention (for example the American 2014 and European urology guidelines) agree on the basics, to be tailored with a doctor, often after a 24-hour urine collection and analysis of the stone:

- drinking enough to pass **at least about 2.5 L of urine a day** — often around 3 L of fluid, more in heat or with heavy sweating;
- **normal, not low, calcium** from food — too little calcium lets more oxalate be absorbed from the gut;
- limiting salt and animal protein, and avoiding high-dose vitamin C supplements (vitamin C is partly converted to oxalate);
- for some people, medicines — thiazide diuretics to lower urine calcium, citrate to raise the inhibitor and urine pH, or a drug that lowers uric acid.

> [!warn] Stone pain with a fever or shivering, pain in someone with only one kidney, being unable to pass urine, or pain and vomiting that cannot be controlled at home need emergency care — call your local emergency number. An infected, blocked kidney can lead to sepsis within hours.
`,
  ideas: [
    'Stones grow from supersaturated urine: more dissolved salt than the urine can keep in solution.',
    'Saturation depends on the amounts excreted, the inhibitors (citrate) and pH — and, most of all, on urine volume.',
    'Most stones are calcium oxalate; uric acid stones form in acidic urine and can often be dissolved.',
    'Small stones usually pass by themselves; larger or complicated ones are broken up or removed.',
    'Prevention starts with making at least about 2.5 L of urine a day, normal dietary calcium, and less salt.'
  ],
  pitfalls: [
    'Calcium stones mean you should cut out dairy — A low-calcium diet raises oxalate absorption and stone risk; normal dietary calcium is advised, while salt is cut.',
    'Once the stone has passed, the problem is over — About half of people form another within 5–10 years without prevention.',
    'Any drink is as good as water — Most fluids count, but sugar-sweetened drinks are linked to more stones; water is the usual advice.'
  ],
  formulas: [
    {
      name: 'Concentration in the urine',
      expr: 'c = n/V', tex: 'c = \\frac{n}{V}',
      vars: {
        c: { name: 'concentration in the urine', q: 'concentration', unit: 'mmol/L' },
        n: { name: 'amount excreted in a day', q: 'amount', unit: 'mmol', value: 7, min: 1, max: 15 },
        V: { name: 'urine volume in a day', q: 'volume', unit: 'L', value: 1.2, min: 0.6, max: 4 }
      },
      note: 'Typical daily urine calcium is roughly 2.5–7.5 mmol (100–300 mg); above about 7.5 mmol in men or 6.2 mmol in women is often called high (thresholds vary between laboratories and guidelines).',
      stories: { c: 'A man excretes {n} of calcium a day in {V} of urine. What is the average calcium concentration?', V: 'How much urine would carry {n} of calcium a day at an average concentration of {c}?' }
    },
    {
      name: 'Saturation and urine volume',
      expr: 'S = S1*(V1/V)^2', tex: 'S = S_1 \\left(\\frac{V_1}{V}\\right)^2',
      vars: {
        S: { name: 'relative saturation at the new volume' },
        S1: { name: 'relative saturation at the starting volume', value: 8, min: 2, max: 20, tex: 'S_1' },
        V1: { name: 'starting urine volume per day', q: 'volume', unit: 'L', value: 1.2, min: 0.6, max: 2, tex: 'V_1' },
        V: { name: 'new urine volume per day', q: 'volume', unit: 'L', value: 2.5, min: 1, max: 4 }
      },
      note: 'For a salt of two ions with the amounts excreted unchanged, the ion product scales with 1/V². Real urine chemistry (complexes with citrate, magnesium) makes the fall a little smaller, but the message holds: doubling the volume cuts saturation about fourfold.',
      stories: { S: 'A stone former\'s urine has a relative saturation of {S1} for calcium oxalate at {V1} a day. What would it be at {V} a day?', V: 'At {V1} a day the relative saturation is {S1}. What daily urine volume would bring it down to {S}?' }
    }
  ],
  examples: [
    {
      title: 'Drinking to dilute',
      q: 'Tom excretes 7 mmol of calcium a day in 1.2 L of urine, and his calcium oxalate saturation is 8 times the saturation point. If he drinks enough to pass 2.5 L a day with the same diet, what happens to his urine calcium concentration and to the saturation?',
      steps: [
        'Calcium concentration: $7 / 1.2 = 5.8$ mmol/L before, $7 / 2.5 = 2.8$ mmol/L after.',
        'Oxalate is diluted by the same factor, so the ion product falls by $(2.5/1.2)^2 = 4.3$.',
        '$S = 8 \\times (1.2/2.5)^2 = 1.8$ — from well above the metastable limit to just above saturation, where new crystals rarely start.',
        'To pass 2.5 L of urine he needs to drink roughly 3 L a day, more in hot weather.'
      ],
      a: 'Concentration falls from 5.8 to 2.8 mmol/L; saturation from about 8 to about 1.8.'
    },
    {
      title: 'Uric acid and pH',
      q: 'Why can uric acid stones often be dissolved with medicine while calcium oxalate stones cannot?',
      steps: [
        'Uric acid is a weak acid with a pKa of about 5.5. Below that pH most of it is in the poorly soluble, undissociated form; above it, it becomes the far more soluble urate ion.',
        'Raising urine pH from 5.0 to 6.5 cuts the undissociated fraction from about three-quarters to under a tenth — below saturation, so crystals dissolve (see the simulation).',
        'Calcium oxalate solubility hardly depends on pH in the urine range, so changing pH does not dissolve it.'
      ],
      a: 'Because uric acid solubility rises steeply as urine becomes less acidic; calcium oxalate\'s does not.'
    }
  ],
  quiz: [
    { q: 'Which change lowers calcium oxalate saturation the most, if everything else stays the same?', choices: ['doubling the urine volume', 'halving dietary calcium', 'drinking a cola a day', 'taking vitamin C supplements'], a: 0,
      why: 'Doubling the volume halves both ion concentrations and cuts their product about fourfold. Cutting dietary calcium tends to raise oxalate absorption; high-dose vitamin C adds oxalate.' },
    { q: 'Citrate in the urine…', choices: ['binds calcium and inhibits crystal growth', 'is itself the main component of most stones', 'makes uric acid less soluble', 'has no effect on stones'], a: 0,
      why: 'Citrate forms a soluble complex with calcium and blocks crystal growth and aggregation; low urine citrate is a common, treatable risk factor.' },
    { q: 'A stone former\'s saturation is 9 at 1.5 L of urine a day. Assuming S ∝ 1/V², what is it at 3 L a day?', answer: 2.25,
      why: 'Doubling the volume divides the saturation by 4: 9 / 4 = 2.25.' },
    { q: 'People who form calcium stones should avoid calcium-rich foods.', a: false,
      why: 'Low dietary calcium lets more oxalate be absorbed and raises stone risk. Guidelines advise normal calcium intake with less salt.' },
    { q: 'Stone pain together with a fever is…', choices: ['a sign the stone is about to pass', 'an emergency: a possible infected, blocked kidney', 'a side effect of drinking too much', 'normal and not worrying'], a: 1,
      why: 'Infection above a blockage cannot drain and can lead to sepsis quickly; it needs emergency drainage and antibiotics.' }
  ],
  applications: ['24-hour urine tests to find each person\'s stone risk factors.', 'Choosing between waiting, lithotripsy, ureteroscopy and surgery by stone size and position.', 'Heat-related stone risk in hot climates, for outdoor workers and military personnel.'],
  sim: 'kid-stones'
},

{
  id: 'uti', parent: 'kidney-disease', title: 'Urinary tract infections', level: 1,
  short: 'Infections of the bladder (cystitis) or, less often, the kidney (pyelonephritis), usually by gut bacteria such as E. coli. Very common in women; mostly easy to treat, but a kidney infection can lead to sepsis, and bacteria in the urine without symptoms usually need no treatment.',
  keywords: ['urinary tract infection', 'UTI', 'cystitis', 'pyelonephritis', 'E. coli', 'dysuria', 'urine dipstick', 'nitrite', 'leukocyte esterase', 'urine culture', 'asymptomatic bacteriuria', 'recurrent UTI', 'cranberry', 'urosepsis', 'catheter', 'antibiotic resistance'],
  prereq: ['kidney-anatomy', 'microbes-types', 'innate-immunity'],
  related: ['antibiotics', 'antimicrobial-resistance', 'sepsis', 'kidney-stones', 'pregnancy', 'diagnostic-accuracy', 'bayes-diagnosis', 'ageing', 'math:exponential-growth-decay'],
  body: `
Sarah, 28, notices a burning sting when she passes urine, then a constant urge to go again although only a little comes out, and an ache low in her belly. She has no fever and no back pain. This is **cystitis**, a bladder infection — one of the commonest infections there is: about half of all women have at least one in their lifetime.

### How infection happens
Most urinary infections are caused by bacteria from the person's own gut — *Escherichia coli* in roughly three-quarters or more of uncomplicated cases — that colonise the skin around the urethra and climb into the bladder. The female urethra is only about 4 cm long, against about 20 cm in men, which is the main reason women are affected far more often. Sexual activity, some contraceptives (spermicides), the lower oestrogen levels after menopause, pregnancy, diabetes, kidney stones and anything that stops the bladder emptying completely all raise the risk.

The bladder defends itself. Every void flushes out most bacteria that have entered (the simulation shows washout against growth); the lining sheds infected cells and makes antimicrobial substances; and the immune system responds. To cause infection, bacteria must beat the flushing — typically by gripping the lining with hair-like fimbriae, and sometimes by hiding inside its cells, which helps explain repeat infections.

### Bladder or kidney?
- **Cystitis** (lower tract): burning on passing urine, frequency, urgency, pain above the pubic bone, sometimes blood in the urine; no fever.
- **Pyelonephritis** (kidney): fever, shivering, pain in the side or back, nausea or vomiting, feeling unwell — more serious, and it can progress to sepsis.

Infections in men, in pregnancy, in children, with a catheter or with an abnormal urinary tract are called **complicated** and are handled with more care.

### Diagnosis
In a young woman with typical symptoms and no vaginal discharge, the symptoms alone make the diagnosis likely. A **dipstick** tests for nitrite (made by many, not all, bacteria — a positive result is quite specific) and leucocyte esterase (from white cells — sensitive but less specific). A negative dipstick does not rule infection out when symptoms are typical: that is Bayes' theorem at work ([[bayes-diagnosis|Bayes and diagnosis]]). A **culture** identifies the organism and which antibiotics work; the classic threshold for infection is 100,000 bacteria per millilitre, though lower counts count when symptoms are present.

**Bacteria without symptoms** (asymptomatic bacteriuria) are common — found in a quarter to a half of older women living in care homes and in almost everyone with a long-term catheter. International guidelines (IDSA, 2019) advise *not* testing or treating it except in pregnancy and before certain urological procedures, because treatment does not help and breeds resistance. In older people, confusion alone should not be blamed on a "UTI" from a positive dipstick without looking for other causes.

### Treatment and prevention
Uncomplicated cystitis is usually treated with a short course of an antibiotic chosen by local resistance patterns; trials show that many cases in otherwise healthy women clear within a week or two even without antibiotics, but antibiotics shorten symptoms and slightly lower the risk of spread to the kidney — a trade-off to discuss with a clinician. Kidney infections need antibiotics promptly. Resistance is a growing problem: in many countries a large share of *E. coli* resist common oral antibiotics ([[antimicrobial-resistance|Antimicrobial resistance]]).

For **recurrent** infections, the evidence supports several options: drinking more water in women who drink little (a 2018 trial roughly halved recurrences, from about 3 to 1.7 a year); cranberry products (a 2023 Cochrane review found they reduce repeat symptomatic infections in women with recurrent UTI, in children and after some procedures); vaginal oestrogen after menopause; methenamine, a non-antibiotic urinary antiseptic; and, for some, low-dose preventive antibiotics. Evidence for D-mannose is weak, and a large UK trial published in 2024 found no benefit. Which suits a person is a question for their doctor.

> [!warn] Fever, shivering, pain in the side or back, vomiting, or feeling very unwell with urinary symptoms can mean a kidney infection and needs medical attention the same day. Confusion, fast breathing, a racing heart, cold mottled skin or passing very little urine can be sepsis — call your local emergency number. Babies and young children with a fever and no obvious cause, pregnant women, and men with urinary symptoms should be seen by a doctor.
`,
  ideas: [
    'Most UTIs are caused by the person\'s own gut bacteria, mainly E. coli, climbing the urethra; a short female urethra is the main reason women are affected more.',
    'Cystitis stings and hurries; fever, back pain and vomiting point to a kidney infection, which can lead to sepsis.',
    'Dipstick results change the probability of infection but do not settle it: interpret them with the symptoms (Bayes).',
    'Bacteria in the urine without symptoms usually need no treatment, except in pregnancy and before some procedures.',
    'Flushing by urine flow is a real defence; more water, cranberry products, vaginal oestrogen and methenamine have evidence for preventing recurrences.'
  ],
  pitfalls: [
    'A positive urine test in an older person explains their confusion — Bacteria without symptoms are very common in older people; treating them does not help and can cause harm, so other causes must be sought.',
    'A negative dipstick rules out a UTI — With typical symptoms the probability after a negative dipstick can still be substantial; culture or clinical judgement decides.',
    'Cystitis always needs antibiotics — Many uncomplicated cases in healthy women resolve on their own; antibiotics shorten symptoms, and the choice is a shared decision. Kidney infections always need prompt treatment.'
  ],
  formulas: [
    {
      name: 'Probability of infection after a urine test',
      expr: 'post = pre*LR/(1 - pre + pre*LR)', tex: 'p_{post} = \\frac{p_{pre}\\,\\text{LR}}{1 - p_{pre} + p_{pre}\\,\\text{LR}}',
      vars: {
        post: { name: 'probability after the test', q: 'ratio', unit: '%', tex: 'p_{post}' },
        pre: { name: 'probability before the test (from the symptoms)', q: 'ratio', unit: '%', value: 50, min: 5, max: 95, tex: 'p_{pre}' },
        LR: { name: 'likelihood ratio of the test result', value: 4, min: 0.1, max: 20, tex: '\\text{LR}' }
      },
      note: 'Bayes\' theorem in odds form. As rough illustrations, a positive dipstick (nitrite or leucocytes) has a likelihood ratio of a few, a negative one of about 0.3 — values differ between studies and settings.',
      stories: { post: 'Before any test a clinician judges the chance of a bladder infection at {pre}. The dipstick result has a likelihood ratio of {LR}. What is the probability now?', LR: 'A test moves the probability of infection from {pre} to {post}. What was the likelihood ratio of the result?' }
    },
    {
      name: 'Bacterial growth by doubling',
      expr: 'N = N0*2^(t/td)', tex: 'N = N_0 \\cdot 2^{\\,t/t_d}',
      vars: {
        N: { name: 'bacteria per mL later' },
        N0: { name: 'bacteria per mL at the start', value: 1000, min: 10, max: 10000, tex: 'N_0' },
        t: { name: 'time', q: 'time', unit: 'h', value: 4, min: 1, max: 12 },
        td: { name: 'doubling time', q: 'time', unit: 'min', value: 40, min: 20, max: 120, tex: 't_d' }
      },
      note: 'Unchecked growth in standing urine. In the bladder, each void removes all but the residual volume — the washout that the simulation pits against this growth.',
      stories: { N: 'Bacteria at {N0} per mL double every {td} in urine at body temperature. How many per mL after {t}?', t: 'Starting from {N0} per mL and doubling every {td}, how long until they reach {N} per mL?' },
      practice: { unknowns: ['N', 't'] }
    }
  ],
  examples: [
    {
      title: 'Reading a dipstick with Bayes',
      q: 'From her typical symptoms, a clinician puts Sarah\'s chance of a bladder infection at 50 %. Take the likelihood ratio of a positive dipstick as 4 and of a negative one as 0.3. What is the probability after each result? And for a woman with classic symptoms whose pre-test probability is 90 %, after a negative dipstick?',
      steps: [
        'Positive: $\\dfrac{0.5 \\times 4}{1 - 0.5 + 0.5 \\times 4} = \\dfrac{2}{2.5} = 80$ %.',
        'Negative: $\\dfrac{0.5 \\times 0.3}{0.5 + 0.15} = 23$ % — lower, but far from zero.',
        'Classic symptoms, negative dipstick: $\\dfrac{0.9 \\times 0.3}{0.1 + 0.27} = 73$ % — still likely. The dipstick cannot overrule a strong clinical picture.'
      ],
      a: '80 % after a positive result, 23 % after a negative; with 90 % beforehand, still 73 % after a negative test.'
    },
    {
      title: 'Growth between voids',
      q: 'A thousand bacteria per millilitre reach the bladder; they double every 40 minutes. How many are there after 4 hours without voiding, and after 8 hours?',
      steps: [
        'After 4 h: $240/40 = 6$ doublings, so $1000 \\times 2^6 = 64{,}000$ per mL.',
        'After 8 h: 12 doublings, $1000 \\times 2^{12} \\approx 4.1$ million per mL — well past the 100,000 threshold.',
        'Each void throws out all but the few millilitres left behind, which is why regular, complete emptying helps — and why a bladder that does not empty fully (for example with an enlarged prostate) is a risk.'
      ],
      a: '64,000 per mL after 4 hours; about 4 million after 8 hours.'
    }
  ],
  quiz: [
    { q: 'Why are urinary infections much more common in women than in men?', choices: ['the female urethra is much shorter', 'women drink less water', 'men have no bacteria in the gut', 'the female bladder is smaller'], a: 0,
      why: 'At about 4 cm against about 20 cm, the female urethra gives gut bacteria from the surrounding skin a much shorter climb to the bladder.' },
    { q: 'Which symptom points to a kidney infection rather than simple cystitis?', choices: ['burning on passing urine', 'needing to go often', 'fever with pain in the side or back', 'cloudy urine'], a: 2,
      why: 'Fever, shivering and flank pain mean the infection has reached the kidney — more serious and needing prompt treatment.' },
    { q: 'An 85-year-old in a care home has a positive dipstick but no urinary symptoms and no fever. International guidelines advise…', choices: ['antibiotics straight away', 'not treating bacteria without symptoms, and looking for other causes of any change in her condition', 'a daily dipstick', 'a kidney scan'], a: 1,
      why: 'Asymptomatic bacteriuria is common in older people; treating it does not improve outcomes and promotes resistance and side effects (IDSA 2019).' },
    { q: 'Before the test, the probability of infection is 20 %. A positive result has a likelihood ratio of 5. What is the probability afterwards?', answer: 55.6, unit: '%',
      why: 'Odds before = 0.2/0.8 = 0.25; × 5 = 1.25; probability = 1.25/2.25 = 0.556, about 56 %.' },
    { q: 'Emptying the bladder regularly and completely helps to flush out bacteria that have entered it.', a: true,
      why: 'Each void removes all but the residual urine; when growth between voids is slower than washout, bacteria are cleared. Incomplete emptying undermines this defence.' }
  ],
  applications: ['Choosing antibiotics by local resistance patterns and culture results.', 'Stopping unnecessary urine tests and antibiotics in care homes (antimicrobial stewardship).', 'Catheter care to prevent hospital-acquired infections.', 'Screening for bacteria in the urine in pregnancy.'],
  sim: 'kid-bladder'
}

);
