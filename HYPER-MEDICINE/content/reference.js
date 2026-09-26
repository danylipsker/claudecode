/* HYPER-MEDICINE · content/reference.js — the reference concept for medicine authors:
 * its depth, tone, safety wording and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'blood-pressure', parent: 'circulation', title: 'Blood pressure', level: 1,
  short: 'The pressure of blood against artery walls, written as systolic over diastolic in mmHg. It rises and falls with every heartbeat, is set by how much the heart pumps and how hard the vessels resist, and is measured with a cuff that listens for the moment an artery reopens.',
  keywords: ['blood pressure', 'systolic', 'diastolic', 'mmHg', 'mean arterial pressure', 'pulse pressure', 'sphygmomanometer', 'Korotkoff sounds', 'hypertension', 'hypotension', 'white-coat', 'home blood pressure'],
  prereq: ['cardiac-cycle', 'blood-vessels', 'physics:pressure', 'physics:hydrostatic-pressure'],
  related: ['hypertension', 'hemodynamics', 'cardiac-output', 'vital-signs', 'heart-failure', 'stroke'],
  body: `
Every time the heart contracts it pushes about 70 mL of blood into the aorta, which is already full. The arteries stretch, and the pressure inside them climbs to a peak — the **systolic** pressure. As the heart relaxes and refills, the stretched walls spring back and keep the blood moving, and the pressure falls to its lowest point just before the next beat — the **diastolic** pressure. A reading of 120/80 means a peak of 120 and a floor of 80 millimetres of mercury (mmHg): the height of a mercury column the pressure could hold up.

$$\\text{pulse pressure} = P_\\text{sys} - P_\\text{dia}, \\qquad \\text{MAP} \\approx P_\\text{dia} + \\tfrac{1}{3}\\,(P_\\text{sys} - P_\\text{dia})$$

The **mean arterial pressure** (MAP) is the average pressure over the whole beat — what actually pushes blood through the organs. It sits closer to the diastolic value because the heart spends about two-thirds of each beat relaxing. For 120/80 it is about 93 mmHg.

### What sets it
Pressure is what it takes to push a flow through a resistance, just like voltage in a circuit:

$$\\text{MAP} = \\text{CO} \\times \\text{SVR}$$

where CO is the [[cardiac-output|cardiac output]] (litres per minute) and SVR the systemic vascular resistance of the small arteries and arterioles. Either can raise blood pressure: a faster, harder-pumping heart, or narrower, stiffer vessels. The body holds MAP steady from second to second with the **baroreflex** — stretch sensors in the carotid arteries and aorta that speed or slow the heart and tighten or relax the vessels — and over days with the kidneys, which adjust the volume of blood through salt and water and the renin–angiotensin system. When you stand up, the baroreflex is what stops you fainting.

> [!fact] 120 mmHg would hold up a column of blood about 1.5 m tall — which is why a giraffe, whose brain sits two metres above its heart, needs a blood pressure about twice ours.

### Measuring it
The familiar cuff wraps the upper arm and is pumped above the systolic pressure, squeezing the brachial artery shut. As air is let out slowly, the pressure in the cuff falls. When it drops just below the systolic peak, a spurt of blood forces the artery open at the top of each beat, and the turbulence makes a tapping sound in the stethoscope — the first **Korotkoff sound**, marking the systolic pressure. The taps continue while the artery is squeezed during part of each beat; when the cuff falls below the diastolic pressure the artery stays open, flow is smooth, and the sounds disappear: the diastolic pressure. Automatic monitors detect the same thing from pressure oscillations in the cuff.

Readings vary with posture, stress, caffeine, a full bladder and the minute of the day, so how you measure matters:

- sit quietly for five minutes, back supported, feet flat, legs uncrossed, no talking;
- no caffeine, exercise or smoking in the previous 30 minutes;
- the cuff on a bare arm, the right size for the arm, at the level of the heart;
- take two or three readings a minute or two apart and use the average.

The arm's height matters because of the weight of the blood itself: every centimetre the cuff sits below the heart adds about 0.8 mmHg. An arm hanging down by the side can read 15–20 mmHg too high.

### What the numbers mean
Guidelines agree that risk rises steadily with pressure from about 115/75, but draw their lines in different places:

| Category (adults, mmHg) | American 2017 | European 2018 |
|---|---|---|
| Normal | below 120 and below 80 | below 130/85 (below 120/80 is "optimal") |
| Elevated or high-normal | 120–129 and below 80 | 130–139 or 85–89 |
| High blood pressure | 130–139 or 80–89: stage 1 | 140–159 or 90–99: grade 1 |
| Higher | 140/90 or above: stage 2 (above 180/120: crisis) | 160–179 or 100–109: grade 2; 180/110 or above: grade 3 |

The 2024 European guideline added an "elevated" band of 120–139 over 70–89. Whatever the labels, high blood pressure is diagnosed only from **repeated** measurements on different occasions, ideally including readings at home or a 24-hour ambulatory monitor — which also catch **white-coat hypertension** (high only at the clinic) and **masked hypertension** (normal at the clinic, high everywhere else). Low blood pressure is usually harmless unless it causes dizziness or fainting; a sudden fall on standing is called orthostatic hypotension.

> [!warn] A reading above about 180/120 with chest pain, shortness of breath, severe headache, weakness, numbness, confusion or trouble speaking is a medical emergency — call your local emergency number. A single high reading without symptoms is a reason to measure again and to see a doctor, not to panic.

Why it matters is covered in [[hypertension|High blood pressure]]: over years, raised pressure damages arteries and is the single biggest preventable cause of stroke and a major cause of heart attack, heart failure and kidney disease.
`,
  ideas: [
    'Systolic is the peak pressure during each heartbeat; diastolic is the lowest, while the heart refills.',
    'Mean arterial pressure ≈ diastolic + a third of the pulse pressure; it is what drives blood through the organs.',
    'Pressure = cardiac output × vascular resistance: either can raise it, and the baroreflex and kidneys hold it steady.',
    'A cuff finds systolic where the Korotkoff sounds begin and diastolic where they vanish.',
    'Technique and repetition matter: one reading is not a diagnosis.'
  ],
  pitfalls: [
    'One high reading means high blood pressure — Pressure varies from minute to minute; the diagnosis needs repeated readings, ideally including home or ambulatory measurements.',
    'The mean pressure is halfway between the two numbers — The heart spends longer in diastole, so the mean sits about a third of the way up from the diastolic.',
    'The arm position does not matter — Every centimetre below the heart adds about 0.8 mmHg; a dangling arm can add 15–20 mmHg.'
  ],
  formulas: [
    {
      name: 'Mean arterial pressure',
      expr: 'MAP = Pd + (Ps - Pd)/3', tex: '\\text{MAP} = P_d + \\tfrac{1}{3}\\left(P_s - P_d\\right)',
      vars: {
        MAP: { name: 'mean arterial pressure', q: 'pressure', unit: 'mmHg', tex: '\\text{MAP}' },
        Ps: { name: 'systolic pressure', q: 'pressure', unit: 'mmHg', value: 120, tex: 'P_s' },
        Pd: { name: 'diastolic pressure', q: 'pressure', unit: 'mmHg', value: 80, tex: 'P_d' }
      },
      note: 'A good estimate at normal heart rates; at fast rates, when diastole is shorter, the true mean is a little higher.',
      practice: { unknowns: ['MAP', 'Pd'] },
      stories: { MAP: 'A blood pressure of {Ps} over {Pd}. What is the mean arterial pressure?', Pd: 'The mean arterial pressure is {MAP} and the systolic pressure {Ps}. What is the diastolic pressure?' }
    },
    {
      name: 'Pulse pressure',
      expr: 'PP = Ps - Pd', tex: '\\text{PP} = P_s - P_d',
      vars: {
        PP: { name: 'pulse pressure', q: 'pressure', unit: 'mmHg', tex: '\\text{PP}' },
        Ps: { name: 'systolic pressure', q: 'pressure', unit: 'mmHg', value: 120, tex: 'P_s' },
        Pd: { name: 'diastolic pressure', q: 'pressure', unit: 'mmHg', value: 80, tex: 'P_d' }
      },
      note: 'Typically 40–50 mmHg in young adults; it widens with age as the large arteries stiffen.'
    },
    {
      name: 'Pressure, flow and resistance',
      expr: 'MAP = CO*SVR', tex: '\\text{MAP} = \\text{CO} \\times \\text{SVR}',
      vars: {
        MAP: { name: 'mean arterial pressure', q: 'pressure', unit: 'mmHg', tex: '\\text{MAP}' },
        CO: { name: 'cardiac output', q: 'flowrate', unit: 'L/min', value: 5, tex: '\\text{CO}' },
        SVR: { name: 'systemic vascular resistance', q: 'vascres', unit: 'mmHg·min/L', value: 18.6, tex: '\\text{SVR}' }
      },
      note: 'The circulation\'s Ohm\'s law (right-atrial pressure, a few mmHg, is neglected). 1 mmHg·min/L is one Wood unit, about 80 dyn·s/cm⁵.',
      stories: { SVR: 'A patient\'s cardiac output is {CO} and the mean arterial pressure {MAP}. What is the systemic vascular resistance?' }
    },
    {
      name: 'The weight of the blood: height and pressure',
      expr: 'dP = rho*g*h', tex: '\\Delta P = \\rho\\, g\\, h',
      vars: {
        dP: { name: 'pressure difference', q: 'pressure', unit: 'mmHg', tex: '\\Delta P' },
        rho: { name: 'density of blood', q: 'density', unit: 'kg/m³', value: 1060, fixed: true, tex: '\\rho' },
        g: { const: 'g' },
        h: { name: 'height difference', q: 'length', unit: 'cm', value: 25 }
      },
      note: 'Why the cuff must be at heart level, and why pressure in the feet of a standing person is far higher than in the head.',
      stories: { dP: 'A cuff is {h} below the level of the heart. By how much does it over-read?' }
    }
  ],
  examples: [
    {
      title: 'Reading a measurement',
      q: 'The average of two readings is 132/84 mmHg. Find the pulse pressure and the mean arterial pressure, and place the reading in the American and European categories.',
      steps: [
        'Pulse pressure: $132 - 84 = 48$ mmHg.',
        'Mean arterial pressure: $84 + 48/3 = 100$ mmHg.',
        'American 2017: systolic 130–139 is stage 1 hypertension. European 2018: 130–139 is high-normal (and "elevated" in the 2024 scheme).',
        'Either way it is a single visit\'s average: the next step is repeated readings, including at home, before any label is given.'
      ],
      a: 'Pulse pressure 48 mmHg, mean pressure 100 mmHg; stage 1 in the US scheme, high-normal in the European one — to be confirmed by repeated readings.'
    },
    {
      title: 'The dangling arm',
      q: 'During a reading the cuffed arm hangs down so that the cuff is 25 cm below the heart. How far off is the reading?',
      steps: [
        '$\\Delta P = \\rho g h = 1060 \\times 9.81 \\times 0.25 = 2600$ Pa.',
        'In mmHg: $2600/133.3 = 19.5$ mmHg.',
        'Both numbers read about 20 mmHg too high: a true 125/80 would show as about 145/100.'
      ],
      a: 'About 20 mmHg too high on both numbers.'
    },
    {
      title: 'Pressure from pump and pipes',
      q: 'At rest a man has a cardiac output of 5 L/min and a mean arterial pressure of 93 mmHg. During a stressful meeting his output rises to 6 L/min and his vessels tighten so that resistance rises by 10 %. What is his new mean pressure?',
      steps: [
        'Resting resistance: $\\text{SVR} = 93/5 = 18.6$ mmHg·min/L.',
        'New resistance: $18.6 \\times 1.1 = 20.46$.',
        'New mean pressure: $6 \\times 20.46 = 122.8$ mmHg — a rise of about 30 mmHg from two modest changes.'
      ],
      a: 'About 123 mmHg.'
    }
  ],
  quiz: [
    { q: 'During the measurement with a cuff, the systolic pressure is read…', choices: ['when the first tapping sound is heard', 'when the sounds are loudest', 'when the sounds disappear', 'when the cuff is fully inflated'], a: 0,
      why: 'The artery first opens at the peak of each beat when the cuff pressure falls just below the systolic pressure; the turbulent spurt makes the first Korotkoff sound.' },
    { q: 'For a reading of 150/90, what is the mean arterial pressure?', answer: 110, unit: 'mmHg',
      why: '90 + (150 − 90)/3 = 90 + 20 = 110 mmHg.' },
    { q: 'A reading taken with the arm hanging by the side is likely to be…', choices: ['too low', 'too high', 'accurate', 'unaffected in systolic but low in diastolic'], a: 1,
      why: 'The cuff sits below the heart, so the weight of the blood column adds pressure — roughly 0.8 mmHg per centimetre.' },
    { q: 'Someone whose blood pressure is normal in the clinic but high at home has…', choices: ['white-coat hypertension', 'masked hypertension', 'orthostatic hypotension', 'no problem, because the clinic reading counts'], a: 1,
      why: 'Masked hypertension hides at the clinic. Home or ambulatory readings reveal it, and it carries the risks of ordinary high blood pressure.' },
    { q: 'If the heart pumps the same amount but the small arteries narrow, mean blood pressure rises.', a: true,
      why: 'MAP = CO × SVR: with the output unchanged, a higher resistance means a higher pressure.' }
  ],
  applications: ['Screening for high blood pressure — the leading preventable risk factor for stroke.', 'Home blood-pressure monitoring and 24-hour ambulatory monitoring.', 'Judging shock and blood loss in an emergency from a falling pressure.', 'Anaesthesia and intensive care, where mean arterial pressure is watched beat by beat.'],
  sim: 'ref-bp-cuff'
}

);
