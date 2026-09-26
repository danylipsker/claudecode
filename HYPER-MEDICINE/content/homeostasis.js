/* HYPER-MEDICINE · content/homeostasis.js — How the Body Works: homeostasis.
 * Feedback, body water, electrolytes, acid–base balance, body temperature and fever, metabolism and energy. */
Hyper.add(

/* ================================================================ FEEDBACK */
{
  id: 'homeostasis-feedback', parent: 'homeostasis', title: 'Homeostasis and feedback', level: 1,
  short: 'The body keeps its temperature, blood pressure, salt, sugar and acidity within narrow limits by negative feedback: sensors detect a change and effectors push it back. Delays make loops overshoot; positive feedback amplifies a change until an end point switches it off.',
  keywords: ['homeostasis', 'negative feedback', 'positive feedback', 'set point', 'sensor', 'effector', 'control centre', 'feedforward', 'gain', 'delay', 'oscillation', 'baroreflex', 'orthostatic hypotension', 'Cheyne–Stokes breathing', 'vicious cycle'],
  prereq: ['cell-structure', 'math:exponential-growth-decay'],
  related: ['hormone-feedback', 'thermoregulation', 'blood-pressure', 'glucose-regulation', 'control-of-breathing', 'hemostasis', 'math:first-order-linear'],
  body: `
Get up quickly after a long hot bath and the room may swim for a moment. Standing lets about half a litre of blood sink into the veins of your legs; less returns to the heart, and the pressure in your arteries dips. Within a few heartbeats, stretch sensors in the neck and chest notice, the brainstem answers, and the heart speeds up while the small arteries tighten. Pressure is restored and the dizziness passes. You have just watched a **negative feedback loop** at work — and its slight delay is why you felt anything at all.

### The loop
Almost every stable quantity in the body — temperature, blood pressure, blood sugar, sodium, oxygen, carbon dioxide, pH — is held by the same kind of loop:

1. a **regulated variable** (arterial pressure);
2. a **sensor** that measures it (baroreceptors in the carotid arteries and aorta);
3. a **control centre** that compares it with a **set point** (the brainstem);
4. **effectors** that change it (heart rate, the force of each beat, vessel diameter).

The response always opposes the change — hence *negative* feedback. The French physiologist Claude Bernard called the stable inner world the *milieu intérieur*; Walter Cannon named its regulation **homeostasis** in the 1920s. The set point is really a range, and it moves: body temperature is lower before dawn, and a fever raises it deliberately ([[thermoregulation]]).

### Gain and delay
How well a loop corrects is its **gain**: the correction it achieves divided by the error that remains. A disturbance that would shift a variable by $D$ without control leaves only

$$E = \\frac{D}{1 + G}$$

with a loop of gain $G$. Temperature control is strong (a gain of several tens); the baroreflex is modest (a gain of a few), which is why the kidneys, working over days, finish the job of setting long-term pressure ([[blood-pressure]]). Feedback also speeds recovery: a disturbance that would fade with time constant $\\tau$ fades with $\\tau/(1 + G)$.

But every loop has a **delay** — blood takes time to travel, hormones to act, nerves to respond. Strong gain with a long delay makes a loop overshoot and swing to and fro. In some people with severe heart failure, blood takes so long to carry a change in carbon dioxide from the lungs to the sensors in the brain that breathing waxes and wanes in cycles of about a minute, with pauses between — **Cheyne–Stokes breathing** ([[control-of-breathing]]).

### Positive feedback and feedforward
**Positive feedback** amplifies a change instead of opposing it, and it is useful only when something ends it. In labour, the baby's head stretches the cervix, which releases oxytocin, which strengthens contractions, which stretches the cervix more — until the birth breaks the loop. Each clotting factor activates more of the next until a clot seals the wound ([[hemostasis]]); opening sodium channels lets in sodium, which opens more channels, producing the upstroke of the nerve impulse. **Feedforward** control acts before the error appears: your heart rate climbs at the starting line, and insulin rises at the first taste of food.

### When loops fail
Much of medicine is loops that have broken or been overwhelmed. In diabetes the glucose loop lacks insulin or ignores it ([[glucose-regulation]]); in heatstroke the heat load beats the cooling loop; in hormone disorders a gland ignores the brake of its own hormone ([[hormone-feedback]]). Dangerous **vicious cycles** are positive feedback in disease: in shock, falling pressure starves the heart muscle of blood, the weakened heart pumps less, and pressure falls further.

> [!warn] A brief light-headedness on standing is common and usually harmless. Fainting with chest pain, palpitations, breathlessness or a severe headache, fainting during exercise, or not waking quickly afterwards needs urgent help — call your local emergency number.
`,
  ideas: [
    'Homeostasis holds key variables within narrow ranges using sensors, a control centre with a set point, and effectors.',
    'Negative feedback opposes change; the error left is the disturbance divided by (1 + gain).',
    'Delays in a loop cause overshoot and oscillation, as in Cheyne–Stokes breathing.',
    'Positive feedback amplifies change and needs an end point — birth, a finished clot, the peak of a nerve impulse.',
    'Many diseases are feedback loops that are broken, reset or overwhelmed, or vicious cycles.'
  ],
  pitfalls: [
    'Homeostasis keeps every variable exactly constant — Variables fluctuate within ranges, set points shift with the time of day and the situation, and some (like fever) are raised on purpose.',
    'Positive feedback means good feedback — "Positive" means it reinforces the change; it is essential in labour and clotting but deadly when it drives shock or a runaway heart rhythm.',
    'A stronger response is always better — With delays, a high-gain loop overshoots and can oscillate; good control balances gain against delay.'
  ],
  formulas: [
    {
      name: 'Error left by a feedback loop',
      expr: 'E = D/(1 + G)', tex: 'E = \\frac{D}{1 + G}',
      vars: {
        E: { name: 'error that remains', q: 'dtemp', unit: '°C', signed: true },
        D: { name: 'change the disturbance would cause without control', q: 'dtemp', unit: '°C', value: 10, signed: true },
        G: { name: 'loop gain (correction ÷ remaining error)', value: 33 }
      },
      note: 'For a proportional control loop at steady state. Written here for body temperature, but it holds for any regulated variable in its own units.',
      practice: { unknowns: ['E', 'G'] },
      stories: { E: 'A hot, humid room would push core temperature up by {D} if nothing opposed it. With a loop gain of {G}, how much does core temperature actually rise?', G: 'A disturbance that would shift temperature by {D} shifts it by only {E}. What is the gain of the loop?' }
    },
    {
      name: 'Feedback speeds recovery',
      expr: 'tc = tau/(1 + G)', tex: '\\tau_c = \\frac{\\tau}{1 + G}',
      vars: {
        tc: { name: 'time constant with the loop working', q: 'time', unit: 'min', tex: '\\tau_c' },
        tau: { name: 'time constant without control', q: 'time', unit: 'min', value: 20, tex: '\\tau' },
        G: { name: 'loop gain', value: 9 }
      },
      note: 'For a first-order system with proportional feedback and no delay: the loop both shrinks the error and hastens its correction. Delay erodes this benefit and can turn it into oscillation.',
      stories: { tc: 'Left to itself, a disturbance would fade with a time constant of {tau}. A feedback loop of gain {G} acts on it. What is the new time constant?' }
    }
  ],
  examples: [
    {
      title: 'How good is the body\'s thermostat?',
      q: 'Sitting in a sauna would, without any regulation, raise your core temperature by about 10 °C. With a temperature-control gain of 33, how much does it actually rise? What if heavy exercise and dehydration cut the effective gain to 5?',
      steps: [
        'With $G = 33$: $E = 10/(1 + 33) = 0.29$ °C.',
        'With $G = 5$: $E = 10/6 = 1.7$ °C — core temperature climbs towards 39 °C.',
        'The loop is only as strong as its effectors: sweat needs water, and skin blood flow needs a well-filled circulation. That is why heat illness is more likely when someone is dehydrated.'
      ],
      a: 'About 0.3 °C with a healthy loop; about 1.7 °C when the effectors are weakened.'
    },
    {
      title: 'Standing up',
      q: 'Describe the loop that stops a person fainting when they stand up, and what an orthostatic blood-pressure test measures.',
      steps: [
        'Disturbance: about 500 mL of blood pools in the leg veins; venous return, stroke volume and arterial pressure fall.',
        'Sensors: carotid and aortic baroreceptors fire less. Control centre: the brainstem reduces vagal and increases sympathetic activity.',
        'Effectors: heart rate rises by 10–20 beats a minute, arterioles and veins constrict, and pressure recovers within seconds to a minute.',
        'In an orthostatic test, pressure is measured lying down and again within three minutes of standing; a fall of 20 mmHg systolic or 10 mmHg diastolic (the 2011 consensus definition) is orthostatic hypotension — common with dehydration, some blood-pressure medicines, diabetes-related nerve damage and older age.'
      ],
      a: 'A baroreflex loop: pooling lowers pressure, sensors detect it, the brainstem raises heart rate and tightens vessels; a sustained fall of 20/10 mmHg on standing means the loop is not keeping up.'
    }
  ],
  quiz: [
    { q: 'Which of these is positive feedback?', choices: ['sweating when you are hot', 'oxytocin release strengthening contractions during labour', 'insulin release after a meal', 'shivering when you are cold'], a: 1,
      why: 'Stretch of the cervix releases oxytocin, which strengthens contractions and stretches the cervix further — the change reinforces itself until birth. The others oppose a change.' },
    { q: 'A negative-feedback loop with strong gain and a long delay tends to…', choices: ['correct errors perfectly', 'overshoot and oscillate', 'stop working entirely', 'drift slowly with no correction'], a: 1,
      why: 'By the time the correction arrives, the variable has already moved on; the loop overcorrects, then overcorrects back — the cause of Cheyne–Stokes breathing.' },
    { q: 'A disturbance would shift a variable by 20 units without control. With a loop gain of 9, how large is the remaining error?', answer: 2,
      why: 'E = D/(1 + G) = 20/10 = 2 units. The loop corrects 18 units and leaves 2: a gain of 18/2 = 9.' },
    { q: 'A fever is a failure of temperature regulation.', a: false,
      why: 'In a fever the set point itself is raised, and the loop works properly to reach the new value — which is why people shiver while their temperature is rising.' },
    { q: 'Your heart rate rises as you wait on the starting line of a race, before you have moved. This is…', choices: ['negative feedback', 'positive feedback', 'feedforward control', 'a failed baroreflex'], a: 2,
      why: 'Feedforward acts on anticipation, before any error appears in blood gases or pressure.' }
  ],
  applications: ['Orthostatic blood-pressure testing for dizziness and falls.', 'Understanding hormone tests, which read one part of a feedback loop.', 'Designing insulin pumps and closed-loop "artificial pancreas" systems.', 'Intensive care, where machines and medicines take over failing loops.'],
  history: 'Claude Bernard described the constancy of the milieu intérieur in the 1850s–1870s; Walter Cannon coined "homeostasis" in 1926 and popularised it in The Wisdom of the Body (1932). Control engineers\' ideas of gain and feedback entered physiology in the 1940s–60s.',
  sim: 'fnd-feedback'
},

/* ================================================================ BODY FLUIDS */
{
  id: 'body-fluids', parent: 'homeostasis', title: 'Body water and fluid compartments', level: 2,
  short: 'About 60 % of an adult man is water: two-thirds inside cells, one-third outside, and only about a twelfth in the blood plasma. Where water goes is set by salt, protein and pressure — which is why a litre of salt water and a litre of glucose water given into a vein end up in different places.',
  keywords: ['total body water', 'intracellular fluid', 'extracellular fluid', 'interstitial fluid', 'plasma volume', 'osmolality', 'dehydration', 'oedema', 'edema', 'Starling forces', 'oncotic pressure', 'albumin', 'lymph', 'intravenous fluids', 'saline', 'thirst', 'ADH', 'vasopressin'],
  prereq: ['membrane-transport', 'homeostasis-feedback', 'chemistry:osmotic-pressure'],
  related: ['electrolytes', 'urine-concentration', 'blood-vessels', 'heart-failure', 'bleeding-shock', 'kidney-anatomy', 'heat-cold'],
  body: `
After three hot days in which she drank little, an 82-year-old woman living alone is found confused. Her mouth is dry, her pressure falls when she stands, and her blood sodium is 152 mmol/L (normal roughly 135–145). She has lost water faster than salt; the fluid around her cells has become more concentrated, and water has been drawn out of her cells — including her brain cells. Older people carry less water to begin with and feel thirst less keenly, which is why heatwaves hit them hardest.

### Where the water is
Water makes up about 60 % of an adult man's weight, 50–55 % of a woman's (women carry proportionally more fat, which holds little water), about 75 % of a newborn's, and less in older age. For a 70 kg man that is about 42 litres, divided by membranes into compartments:

| Compartment | Share | 70 kg man | Main particles |
|---|---|---|---|
| Inside cells (intracellular) | ⅔ of body water | about 28 L | potassium, phosphates, proteins |
| Between cells (interstitial) | ¾ of the extracellular third | about 10.5 L | sodium, chloride, bicarbonate |
| Blood plasma | ¼ of the extracellular third | about 3–3.5 L | sodium, chloride, bicarbonate, albumin |

Two walls separate them. **Cell membranes** let water through freely but hold back sodium, which is pumped out; so water moves between cells and their surroundings by osmosis, until both have the same concentration of particles — about 290 mOsm/kg ([[membrane-transport]]). **Capillary walls** let water and salts through but hold back proteins, especially albumin; so salt water moves freely between plasma and the interstitial fluid, but the proteins stay in and pull water back.

### Balance in and out
An adult typically takes in and loses about 2.5 litres a day: drinks (about 1.5 L), water in food (about 0.7 L) and water made by burning fuel (about 0.3 L), against urine (about 1.5 L), evaporation from skin and lungs (about 0.8 L) and a little in stools — plus sweat, which can add litres in heat or exercise. Two loops keep it steady ([[homeostasis-feedback]]). **Water** is controlled by osmolality: sensors in the hypothalamus detect a rise of 1–2 %, trigger thirst and release **ADH (vasopressin)**, which makes the kidneys return water and pass concentrated urine ([[urine-concentration]]). **Salt** is controlled through volume: the kidneys keep or shed sodium via the renin–angiotensin–aldosterone system and natriuretic peptides. A rule of thumb follows: *water balance sets the sodium concentration; sodium balance sets the volume of the extracellular fluid.*

### Across the capillary wall
Fluid leaves capillaries when the blood pressure inside ($P_c$) exceeds the pull of plasma proteins ($\\pi_c$):

$$\\text{net filtration pressure} = (P_c - P_i) - (\\pi_c - \\pi_i)$$

The classic picture — filtration at the arterial end, reabsorption at the venous end — has been revised: in most tissues filtration continues along the whole capillary, and the **lymphatic system** carries several litres a day back to the veins. **Oedema** (swelling) appears when filtration outruns lymph: raised venous pressure in [[heart-failure]] or a leg vein clot, low albumin in liver disease, kidney protein loss or severe malnutrition, leaky capillaries in inflammation, or blocked lymphatics.

### Fluids into a vein
Where an infusion ends up follows from these walls. A litre of **0.9 % saline** spreads through the whole extracellular fluid, so only about a quarter stays in the plasma. A litre of **5 % glucose** is water once the glucose is burned, and spreads through all body water — only about a twelfth stays in the blood vessels. **Albumin** solutions stay in the plasma longest. That is why blood loss is replaced with blood or salt solutions, never with plain glucose water ([[bleeding-shock]]).

> [!warn] Signs of severe dehydration — very little or dark urine, confusion, dizziness or fainting on standing, a fast weak pulse, cold hands and feet, or in a baby a sunken soft spot, no tears and floppiness — need urgent care; call your local emergency number if the person is confused, collapsing or cannot drink.
`,
  ideas: [
    'Body water is about 60 % of body weight in adult men, less in women and older people, more in infants.',
    'Two-thirds is inside cells, one-third outside; of the outside third, a quarter is plasma.',
    'Cell membranes separate potassium-rich from sodium-rich fluid; water crosses until particle concentrations match.',
    'Capillary walls hold back proteins; the balance of blood pressure and protein pull, plus lymph drainage, sets tissue fluid.',
    'Saline stays outside cells (a quarter in plasma); glucose water spreads through all body water (a twelfth in plasma).'
  ],
  pitfalls: [
    'A drip of glucose water fills up the circulation — Once the glucose is used, it is free water spread through all compartments; only about a twelfth stays in the blood vessels.',
    'Swollen ankles mean the body has too much water, so the answer is to drink less — Oedema has many causes (heart, veins, liver, kidneys, lymph, medicines); restricting drinks is a medical decision, not a general rule.',
    'Capillaries filter at one end and reabsorb at the other — In most tissues filtration continues along the capillary; the lymphatics, not venous reabsorption, return most of the filtered fluid.'
  ],
  formulas: [
    {
      name: 'Total body water',
      expr: 'TBW = f*W', tex: '\\text{TBW} = f\\,W',
      vars: {
        TBW: { name: 'total body water (L)', tex: '\\text{TBW}' },
        f: { name: 'fraction of body weight that is water', q: 'ratio', unit: '%', value: 60, min: 30, max: 85 },
        W: { name: 'body weight (kg)', value: 70 }
      },
      note: 'About 60 % for adult men, 50–55 % for women, 45–50 % for older adults and about 75 % for newborns; lower with more body fat. One kilogram of water is one litre.',
      stories: { TBW: 'An adult weighing {W} has body water making up {f} of her weight. How many litres of water does she contain?' }
    },
    {
      name: 'How much of an infusion stays in the plasma',
      expr: 'dVp = Vi*Vp/Vd', tex: '\\Delta V_p = V_i\\,\\frac{V_p}{V_d}',
      vars: {
        dVp: { name: 'increase in plasma volume', q: 'volume', unit: 'mL', tex: '\\Delta V_p' },
        Vi: { name: 'volume infused', q: 'volume', unit: 'L', value: 1, tex: 'V_i' },
        Vp: { name: 'plasma volume', q: 'volume', unit: 'L', value: 3.5, tex: 'V_p' },
        Vd: { name: 'volume the fluid spreads through', q: 'volume', unit: 'L', value: 14, tex: 'V_d' }
      },
      note: 'Once it has settled: saline spreads through the extracellular fluid (about 14 L in a 70 kg man), glucose water through all body water (about 42 L). A simplification — in illness, leaky capillaries and the rate of infusion change the numbers.',
      stories: { dVp: 'A patient with {Vp} of plasma is given {Vi} of fluid that spreads through {Vd}. How much does the plasma volume rise once it has settled?' }
    },
    {
      name: 'Calculated plasma osmolality',
      expr: 'Osm = 2*Na + Glu + Urea', tex: '\\text{Osm} = 2\\,\\text{Na} + \\text{Glu} + \\text{Urea}',
      vars: {
        Osm: { name: 'calculated osmolality (mOsm/kg)', tex: '\\text{Osm}' },
        Na: { name: 'sodium', q: 'concentration', unit: 'mmol/L', value: 140, tex: '\\text{Na}' },
        Glu: { name: 'glucose', q: 'glucose', unit: 'mmol/L', value: 5, tex: '\\text{Glu}' },
        Urea: { name: 'urea', q: 'urea', unit: 'mmol/L', value: 5, tex: '\\text{Urea}' }
      },
      note: 'Sodium is doubled for its accompanying anions. In US units the same formula reads 2 Na + glucose/18 + BUN/2.8 (glucose and BUN in mg/dL) — switch the units to see. Normal is roughly 275–295 mOsm/kg; a measured value more than about 10 above the calculated one (an osmolar gap) suggests an unmeasured substance such as alcohol or a toxic alcohol.',
      practice: { unknowns: ['Osm', 'Glu'] },
      stories: { Osm: 'A blood test shows sodium {Na}, glucose {Glu} and urea {Urea}. What is the calculated osmolality?', Glu: 'The calculated osmolality is {Osm} with sodium {Na} and urea {Urea}. What must the glucose be?' }
    },
    {
      name: 'Net filtration pressure across a capillary (Starling)',
      expr: 'NFP = (Pc - Pi) - (pic - pii)', tex: '\\text{NFP} = (P_c - P_i) - (\\pi_c - \\pi_i)',
      vars: {
        NFP: { name: 'net filtration pressure (outward positive)', q: 'pressure', unit: 'mmHg', signed: true, tex: '\\text{NFP}' },
        Pc: { name: 'capillary blood pressure', q: 'pressure', unit: 'mmHg', value: 30, tex: 'P_c' },
        Pi: { name: 'tissue fluid pressure', q: 'pressure', unit: 'mmHg', value: 0, signed: true, tex: 'P_i' },
        pic: { name: 'oncotic pressure of plasma proteins', q: 'pressure', unit: 'mmHg', value: 25, tex: '\\pi_c' },
        pii: { name: 'oncotic pressure of tissue fluid', q: 'pressure', unit: 'mmHg', value: 3, tex: '\\pi_i' }
      },
      note: 'Illustrative values; they differ between organs and along each capillary. Modern work shows the protein layer lining the capillary (the glycocalyx) makes the effective tissue-side oncotic pressure lower still, so most capillaries filter along their length.',
      practice: { unknowns: ['NFP', 'pic'] },
      stories: { NFP: 'Capillary pressure is {Pc}, tissue pressure {Pi}, plasma oncotic pressure {pic} and tissue oncotic pressure {pii}. What is the net filtration pressure?', pic: 'In liver disease the albumin falls. With capillary pressure {Pc}, tissue pressure {Pi} and tissue oncotic pressure {pii}, the net filtration pressure is {NFP}. What is the plasma oncotic pressure?' }
    }
  ],
  examples: [
    {
      title: 'Where does a litre go?',
      q: 'A 70 kg man (42 L of body water: 28 L in cells, 14 L outside, 3.5 L of it plasma) is given one litre of either 0.9 % saline or 5 % glucose. How much ends up in his plasma in each case?',
      steps: [
        'Saline has the same effective strength as extracellular fluid and its sodium is kept out of cells, so it stays outside cells: $\\Delta V_p = 1000 \\times 3.5/14 = 250$ mL.',
        'The glucose is taken up and burned, leaving water, which spreads through all 42 L: $\\Delta V_p = 1000 \\times 3.5/42 \\approx 83$ mL.',
        'The rest of the glucose-water litre goes into cells (about two-thirds of it) and the interstitial fluid.'
      ],
      a: 'About 250 mL for saline and about 83 mL for glucose water — why glucose water is not used to restore blood volume.'
    },
    {
      title: 'High sugar, low sodium',
      q: 'A person with very high blood sugar has sodium 132 mmol/L, glucose 30 mmol/L (540 mg/dL) and urea 8 mmol/L (BUN 22 mg/dL). What is the calculated osmolality, and why is the sodium low?',
      steps: [
        '$\\text{Osm} = 2 \\times 132 + 30 + 8 = 302$ mOsm/kg — above the normal range.',
        'Without enough insulin, glucose stays largely outside muscle and fat cells, so it acts as an impermeant particle and draws water out of the cells.',
        'That water dilutes the sodium: the low sodium here reflects shifted water, not a lack of salt, and it rises again as the glucose comes down.'
      ],
      a: 'About 302 mOsm/kg: the plasma is concentrated even though the sodium looks low.'
    },
    {
      title: 'Low albumin and swelling',
      q: 'With capillary pressure 30 mmHg, tissue pressure 0 and tissue oncotic pressure 3 mmHg, compare the net filtration pressure at a normal plasma oncotic pressure of 25 mmHg with that in advanced liver disease, when it falls to 15 mmHg.',
      steps: [
        'Normal: $(30 - 0) - (25 - 3) = 8$ mmHg outwards.',
        'Low albumin: $(30 - 0) - (15 - 3) = 18$ mmHg outwards — more than twice the push.',
        'When filtration outruns lymph drainage, fluid gathers in the ankles and, with raised pressure in the liver\'s veins, in the abdomen (ascites).'
      ],
      a: 'The outward push rises from 8 to 18 mmHg, so fluid collects in the tissues.'
    }
  ],
  quiz: [
    { q: 'In a 70 kg man with 42 L of body water, about how much is inside cells?', choices: ['3.5 L', '14 L', '28 L', '42 L'], a: 2,
      why: 'Two-thirds of body water is intracellular: 28 L. The other 14 L is extracellular, of which about 3.5 L is plasma.' },
    { q: 'Why does a person with very low blood albumin develop swollen ankles?', choices: ['albumin blocks the lymphatics', 'the proteins that pull water back into capillaries are reduced', 'albumin raises blood pressure', 'the kidneys stop making urine'], a: 1,
      why: 'Albumin provides most of the plasma\'s oncotic pressure; with less of it, more fluid is filtered out of capillaries than lymph can return.' },
    { q: 'Older adults usually have a greater proportion of body water than young adults.', a: false,
      why: 'Body water falls with age as muscle is replaced by fat, and thirst weakens — both reasons older people dehydrate more easily.' },
    { q: 'Sodium 138 mmol/L, glucose 6 mmol/L, urea 4 mmol/L. What is the calculated osmolality (mOsm/kg)?', answer: 286,
      why: '2 × 138 + 6 + 4 = 286 mOsm/kg, within the normal range.' },
    { q: 'After one litre of 5 % glucose is given into a vein and the glucose is used, most of the water ends up…', choices: ['in the plasma', 'in the interstitial fluid', 'inside cells', 'in the urine within minutes'], a: 2,
      why: 'Free water spreads in proportion to the compartments: about two-thirds goes into cells, a quarter into interstitial fluid and a twelfth stays in the plasma.' }
  ],
  applications: ['Choosing intravenous fluids for dehydration, surgery and blood loss.', 'Recognising and preventing dehydration in older people, especially in heatwaves.', 'Understanding oedema in heart failure, liver disease and kidney disease.', 'Interpreting sodium, glucose and osmolality results together.'],
  sim: 'fnd-fluids'
},

/* ================================================================ ELECTROLYTES */
{
  id: 'electrolytes', parent: 'homeostasis', title: 'Electrolytes', level: 2,
  short: 'Sodium, potassium, chloride, bicarbonate, calcium, magnesium and phosphate: the charged particles of body fluids. Their concentrations set cell volume, nerve and muscle excitability and acidity, and small deviations — especially of sodium and potassium — can be dangerous.',
  keywords: ['electrolytes', 'sodium', 'potassium', 'chloride', 'bicarbonate', 'calcium', 'magnesium', 'phosphate', 'hyponatraemia', 'hyponatremia', 'hypernatraemia', 'hyperkalaemia', 'hypokalaemia', 'hypocalcaemia', 'hypercalcaemia', 'mEq/L', 'corrected calcium', 'exercise-associated hyponatraemia', 'salt'],
  prereq: ['body-fluids', 'membrane-potential', 'chemistry:ionic-bonding'],
  related: ['acid-base-balance', 'kidney-tests', 'tubular-function', 'bone-calcium', 'lab-tests', 'ecg', 'chemistry:molarity'],
  body: `
A first-time marathon runner, worried about dehydration, drinks a cup of water at every station and walks much of the course. She finishes an hour slower than planned and a kilogram *heavier* than she started. An hour later she has a pounding headache, vomits and becomes confused; her blood sodium is 124 mmol/L. She has **exercise-associated hyponatraemia**: she drank far more water than she lost, diluted her body fluids, and water moved into her swelling brain cells. Advice for endurance events has changed as a result — drink to thirst rather than to a schedule.

### The main electrolytes
Electrolytes are salts dissolved as ions. Reference ranges vary between laboratories; typical adult values:

| Ion | Typical range | Mainly | Its jobs |
|---|---|---|---|
| Sodium, Na⁺ | 135–145 mmol/L | outside cells | sets extracellular osmolality and volume |
| Potassium, K⁺ | 3.5–5.0 mmol/L | inside cells (98 %) | sets the resting membrane potential |
| Chloride, Cl⁻ | 98–107 mmol/L | outside | the main partner of sodium |
| Bicarbonate, HCO₃⁻ | 22–29 mmol/L | outside | the main buffer ([[acid-base-balance]]) |
| Calcium, total | 2.2–2.6 mmol/L (8.8–10.4 mg/dL) | bone (99 %) | nerves, muscle contraction, clotting, bone |
| Calcium, ionised | about 1.1–1.3 mmol/L (4.4–5.2 mg/dL) | outside | the active part |
| Magnesium, Mg²⁺ | 0.7–1.0 mmol/L (1.7–2.4 mg/dL) | inside cells, bone | enzymes, ATP, heart rhythm |
| Phosphate | 0.8–1.5 mmol/L (2.5–4.6 mg/dL) | inside cells, bone | ATP, bone, buffering |

For singly charged ions, mmol/L and mEq/L are the same number; for calcium and magnesium, 1 mmol/L is 2 mEq/L. Positive and negative charges always balance — the gap between measured cations and anions is the **anion gap**, used in acid–base diagnosis.

### Sodium: a question of water
The sodium concentration mostly tells you about **water**, not salt. Low sodium (**hyponatraemia**), the commonest electrolyte disorder in hospital, usually means water has been kept or drunk in excess of salt: overdrinking, too much ADH (after surgery, with lung and brain disease, with some antidepressants and with the drug MDMA), thiazide diuretics, heart failure or cirrhosis. Symptoms come from brain swelling — nausea, headache, confusion, seizures. **High sodium** usually means water loss without access to water: babies, frail older people, people who cannot feel or act on thirst. Because brain cells adapt over a day or two, chronic changes must be corrected *slowly*, under medical supervision: correcting too fast can itself injure the brain.

### Potassium, calcium, magnesium
**Potassium** sets the resting potential of heart and muscle cells ([[membrane-potential]]); both high (kidney failure, some blood-pressure medicines) and low (vomiting, diarrhoea, diuretics) levels disturb the heart rhythm. Insulin drives potassium into cells, which is one reason potassium falls when diabetic ketoacidosis is treated. **Calcium**: only the ionised half is active; about 40 % rides on albumin, so a low total calcium may simply reflect low albumin — hence the "corrected calcium", though many laboratories now measure ionised calcium directly because the correction is often inaccurate. Low calcium causes tingling, cramps and muscle spasms; high calcium (most often from overactive parathyroid glands or cancer) causes thirst, constipation, kidney stones and confusion ([[bone-calcium]]). **Magnesium** runs low with long-term diuretic or proton-pump-inhibitor use and heavy drinking, and low magnesium makes low potassium and calcium hard to correct.

> [!warn] After endurance exercise or heavy drinking of water, headache, vomiting, confusion, unusual sleepiness or a seizure can be dangerous hyponatraemia — do not give more water; call your local emergency number. Palpitations, severe weakness or fainting in someone with kidney disease or on potassium-raising medicines also need emergency care.
`,
  ideas: [
    'Electrolytes are dissolved ions; sodium dominates outside cells, potassium inside.',
    'The sodium concentration mostly reflects water balance: too much water dilutes it, too little concentrates it.',
    'Sodium changes act through brain cell swelling or shrinking; chronic changes must be corrected slowly.',
    'Potassium sets the resting potential of heart muscle, so both high and low levels disturb the rhythm.',
    'Only ionised calcium is active; low albumin lowers the total without changing the active part.'
  ],
  pitfalls: [
    'Low blood sodium means you are not eating enough salt — It nearly always means too much water relative to sodium, from drinking, ADH or medicines; adding salt to food is rarely the answer.',
    'You cannot drink too much water — During long exercise, or with some medicines and illnesses, excess water can dilute sodium dangerously. Drinking to thirst is the safer guide.',
    'A low total calcium always means low active calcium — If albumin is low, the bound fraction falls while the ionised calcium can be normal; measure ionised calcium when in doubt.'
  ],
  formulas: [
    {
      name: 'Diluting sodium with extra water',
      expr: 'Na2 = Na1*TBW/(TBW + dW)', tex: '\\text{Na}_2 = \\text{Na}_1\\,\\frac{\\text{TBW}}{\\text{TBW} + \\Delta W}',
      vars: {
        Na2: { name: 'sodium afterwards', q: 'concentration', unit: 'mmol/L', tex: '\\text{Na}_2' },
        Na1: { name: 'sodium before', q: 'concentration', unit: 'mmol/L', value: 140, tex: '\\text{Na}_1' },
        TBW: { name: 'total body water', q: 'volume', unit: 'L', value: 40, tex: '\\text{TBW}' },
        dW: { name: 'extra water kept', q: 'volume', unit: 'L', value: 3, tex: '\\Delta W' }
      },
      note: 'Water spreads through all body water, and the sodium concentration follows total body osmolality. An estimate: it ignores sodium lost in sweat or urine, which lowers the sodium further.',
      practice: { unknowns: ['Na2', 'dW'] },
      stories: { Na2: 'A runner with {TBW} of body water and a sodium of {Na1} ends a race having kept {dW} more water than she lost. Estimate her sodium.', dW: 'A person with {TBW} of body water has a sodium that falls from {Na1} to {Na2}. How much extra water has been retained?' }
    },
    {
      name: 'Calcium corrected for albumin',
      expr: 'Cac = Ca + 0.2*(4 - Alb)', tex: '\\text{Ca}_c = \\text{Ca} + 0.2\\,(4 - \\text{Alb})',
      vars: {
        Cac: { name: 'corrected total calcium', q: 'calcium', unit: 'mmol/L', tex: '\\text{Ca}_c' },
        Ca: { name: 'measured total calcium', q: 'calcium', unit: 'mmol/L', value: 2.0, tex: '\\text{Ca}' },
        Alb: { name: 'albumin', q: 'albumin', unit: 'g/dL', value: 2.5, tex: '\\text{Alb}' }
      },
      note: 'In the units shown (calcium mmol/L, albumin g/dL). The same rule in conventional units is Ca + 0.8 × (4 − albumin) with calcium in mg/dL, and in SI Ca + 0.02 × (40 − albumin in g/L); switch the units to see. Only an estimate — unreliable in critical illness and kidney disease, where ionised calcium should be measured.',
      practice: { unknowns: ['Cac'] },
      stories: { Cac: 'A patient\'s total calcium is {Ca} with an albumin of {Alb}. What is the corrected calcium?' }
    },
    {
      name: 'Salt lost in sweat',
      expr: 'm = V*c*M', tex: 'm = V\\,c\\,M',
      vars: {
        m: { name: 'mass of salt (as sodium chloride)', q: 'mass', unit: 'g' },
        V: { name: 'volume of sweat', q: 'volume', unit: 'L', value: 2 },
        c: { name: 'sodium in sweat', q: 'concentration', unit: 'mmol/L', value: 40 },
        M: { name: 'molar mass of NaCl', q: 'molarmass', unit: 'g/mol', value: 58.44, fixed: true }
      },
      note: 'Sweat sodium varies widely between people — roughly 20–80 mmol/L — and falls as people acclimatise to heat. People with cystic fibrosis lose much more.',
      stories: { m: 'A worker sweats {V} with a sodium concentration of {c}. How much salt does that remove?' }
    }
  ],
  examples: [
    {
      title: 'The marathon runner',
      q: 'A 60 kg runner (about 30 L of body water, sodium 140 mmol/L) sweats 2 L containing 40 mmol/L of sodium, but drinks enough to finish 3 L of water up. Estimate her sodium.',
      steps: [
        'Treat the body\'s effective sodium as spread through its water: $140 \\times 30 = 4200$ mmol.',
        'Sodium lost in sweat: $2 \\times 40 = 80$ mmol, leaving 4120 mmol.',
        'Water afterwards: $30 + 3 = 33$ L.',
        'New sodium: $4120 / 33 \\approx 125$ mmol/L — in the range where the brain swells and symptoms begin.',
        'Water alone would give $140 \\times 30/33 = 127$ mmol/L; the extra water, not the salt lost, is the main culprit.'
      ],
      a: 'About 125 mmol/L — dangerous hyponatraemia, caused mainly by overdrinking.'
    },
    {
      title: 'A low calcium that is not low',
      q: 'A patient recovering from a long illness has a total calcium of 2.0 mmol/L (8.0 mg/dL) and an albumin of 2.5 g/dL (25 g/L). Is the calcium truly low?',
      steps: [
        'Albumin is 1.5 g/dL below the reference 4.0 g/dL, so less calcium is bound.',
        'Corrected calcium: $2.0 + 0.2 \\times 1.5 = 2.3$ mmol/L — the same as $8.0 + 0.8 \\times 1.5 = 9.2$ mg/dL.',
        'That is within the normal range: the active calcium is probably normal. The laboratory can confirm with an ionised calcium.'
      ],
      a: 'Corrected to about 2.3 mmol/L (9.2 mg/dL) — probably normal; the low total reflects low albumin.'
    }
  ],
  quiz: [
    { q: 'Low blood sodium (hyponatraemia) most often means…', choices: ['too little salt in the diet', 'too much water relative to sodium', 'too much potassium', 'kidney stones'], a: 1,
      why: 'Sodium concentration reflects the balance of water; excess water — from drinking, ADH or medicines — dilutes it.' },
    { q: 'Which electrolyte is found mostly inside cells?', choices: ['sodium', 'chloride', 'potassium', 'bicarbonate'], a: 2,
      why: 'About 98 % of the body\'s potassium is inside cells, kept there by the sodium–potassium pump; sodium, chloride and bicarbonate dominate outside.' },
    { q: 'A person with 40 L of body water and a sodium of 140 mmol/L retains 4 L of extra water. Estimate the new sodium (mmol/L).', answer: 127.3, unit: 'mmol/L',
      why: 'Na₂ = 140 × 40/44 ≈ 127 mmol/L.' },
    { q: 'A low total calcium with a low albumin always means the active (ionised) calcium is low.', a: false,
      why: 'About 40 % of calcium is bound to albumin. With less albumin, less is bound and the total falls, but the ionised calcium may be normal.' },
    { q: 'A runner is confused and vomiting after a marathon in which she drank a lot of water. Which is the wrong response?', choices: ['call emergency services', 'give her plenty more water to drink', 'keep her lying on her side if drowsy', 'tell the medical team how much she drank'], a: 1,
      why: 'Her symptoms may be from dilute blood sodium; more water would make it worse. She needs emergency assessment and a sodium measurement.' }
  ],
  applications: ['Routine blood chemistry panels ("U&Es", "BMP") and their interpretation.', 'Safe drinking advice for endurance sports.', 'Monitoring potassium and sodium during diuretic and blood-pressure treatment.', 'Oral rehydration solutions that replace both water and salts.'],
  sim: [{ id: 'fnd-fluids', params: { give: 'water' } }, { id: 'fnd-membrane-potential', params: { preset: 'hyperK' } }]
},

/* ================================================================ ACID–BASE */
{
  id: 'acid-base-balance', parent: 'homeostasis', title: 'Acid–base balance', level: 3,
  short: 'Blood is held at pH 7.35–7.45 by buffers, by the lungs (which set carbon dioxide within minutes) and by the kidneys (which set bicarbonate over days). The Henderson–Hasselbalch equation ties the three together, and reading a blood gas means finding which one moved first.',
  keywords: ['acid–base', 'pH', 'bicarbonate', 'PaCO2', 'carbon dioxide', 'Henderson–Hasselbalch', 'buffer', 'metabolic acidosis', 'metabolic alkalosis', 'respiratory acidosis', 'respiratory alkalosis', 'compensation', 'anion gap', 'Winters formula', 'ketoacidosis', 'lactic acidosis', 'blood gas', 'Kussmaul breathing', 'hyperventilation'],
  prereq: ['electrolytes', 'chemistry:henderson-hasselbalch', 'chemistry:buffers', 'gas-exchange'],
  related: ['control-of-breathing', 'tubular-function', 'type1-diabetes', 'sepsis', 'copd', 'poisoning-overdose', 'chemistry:ph-scale'],
  body: `
A 16-year-old with type 1 diabetes has been vomiting since the night before and is now breathing deeply and quickly, although his chest is clear. His breath smells fruity, like nail-polish remover. A blood gas shows pH 7.22, bicarbonate 8 mmol/L and a carbon dioxide pressure of 20 mmHg. He has **diabetic ketoacidosis**: without insulin his body is burning fat into ketone acids, which have used up his bicarbonate buffer. The deep breathing is not a lung problem — it is his body blowing off carbon dioxide to limit the fall in pH.

### Why pH is guarded so closely
Blood pH is normally 7.35–7.45, which means a hydrogen-ion concentration of only about 35–45 *nano*moles per litre ([[chemistry:ph-scale|pH scale]]). Enzymes, ion channels and oxygen binding all depend on it, and values below about 6.8 or above 7.8 are rarely survived. Yet the body makes acid all the time: some 15,000 mmol of carbon dioxide a day, which forms carbonic acid in water, and about 50–100 mmol of non-volatile acids from protein metabolism.

### The bicarbonate system
Carbon dioxide and bicarbonate are linked by an equilibrium, sped up by the enzyme carbonic anhydrase:

$$\\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3-}$$

Applying the [[chemistry:henderson-hasselbalch|Henderson–Hasselbalch equation]] to it gives

$$\\text{pH} = 6.1 + \\log_{10}\\frac{[\\ce{HCO3-}]}{0.03 \\times P_{a}\\ce{CO2}}$$

with bicarbonate in mmol/L and the arterial CO₂ pressure in mmHg (0.03 mmol/L per mmHg is its solubility). Normal values — 24 mmol/L and 40 mmHg — give a ratio of 20 and a pH of 7.40. What matters is the **ratio**: this buffer is powerful because both halves are controlled. The **lungs** set PaCO₂ within minutes by changing breathing ([[control-of-breathing]]); the **kidneys** set bicarbonate over hours to days, reclaiming the roughly 4,300 mmol filtered each day and making new bicarbonate as they excrete acid as ammonium ([[tubular-function]]). Haemoglobin, proteins, phosphate and bone add further buffering.

### Four disorders and their compensation
| Primary change | pH | Common causes | The body's compensation |
|---|---|---|---|
| **Metabolic acidosis**: bicarbonate falls | low | ketoacidosis, lactic acidosis (shock, [[sepsis]]), kidney failure, severe diarrhoea, some poisonings | breathe more: expected PaCO₂ ≈ 1.5 × HCO₃⁻ + 8 (± 2) mmHg |
| **Metabolic alkalosis**: bicarbonate rises | high | vomiting, diuretics | breathe less: PaCO₂ rises about 0.7 mmHg per mmol/L |
| **Respiratory acidosis**: CO₂ rises | low | [[copd]], opioid overdose, exhausted breathing muscles | kidneys keep bicarbonate: +1 per 10 mmHg at once, about +3.5 per 10 after days |
| **Respiratory alkalosis**: CO₂ falls | high | anxiety and pain, high altitude, pulmonary embolism, early sepsis, pregnancy | kidneys shed bicarbonate: −2 per 10 mmHg at once, −4 to −5 after days |

Compensation moves pH back *towards* normal but, except sometimes in chronic respiratory alkalosis, not all the way — so a normal pH with abnormal bicarbonate and CO₂ suggests two disorders at once. In metabolic acidosis the **anion gap**, $\\text{Na}^+ - (\\text{Cl}^- + \\text{HCO}_3^-)$, sorts the causes: a high gap means an unmeasured acid has been added (ketones, lactate, toxic alcohols, kidney failure); a normal gap means bicarbonate was lost, as in diarrhoea. Its normal range depends on the laboratory's analysers (often about 4–12 mmol/L), and a low albumin lowers it.

Rapid breathing from anxiety washes out CO₂ and causes tingling lips and fingers and light-headedness, because the alkaline blood lowers ionised calcium. Breathing slowly helps; rebreathing from a paper bag is no longer advised, because the same symptoms can come from conditions in which it lowers oxygen dangerously.

> [!warn] Deep, fast breathing with vomiting, abdominal pain, drowsiness or a fruity smell on the breath — especially in someone with diabetes — can be ketoacidosis. Slow, shallow breathing and drowsiness after opioids or sedatives can be respiratory failure. Both are emergencies: call your local emergency number.
`,
  ideas: [
    'Blood pH is held at 7.35–7.45, a hydrogen-ion concentration of about 40 nmol/L.',
    'pH depends on the ratio of bicarbonate to dissolved CO₂: pH = 6.1 + log(HCO₃⁻ / 0.03 PaCO₂).',
    'The lungs adjust CO₂ in minutes; the kidneys adjust bicarbonate over days.',
    'Four primary disorders — metabolic or respiratory, acidosis or alkalosis — each with a predictable compensation.',
    'The anion gap separates acidoses from added acids from those caused by bicarbonate loss.'
  ],
  pitfalls: [
    'Compensation brings pH back to exactly normal — It moves pH towards normal but usually stops short; a normal pH with abnormal values suggests a mixed disorder.',
    'Deep, fast breathing always means a lung problem — It may be the lungs compensating for a metabolic acidosis such as ketoacidosis.',
    'Breathing into a paper bag is the safe cure for hyperventilation — It can lower oxygen dangerously, and the same symptoms can come from asthma, a clot in the lung or a heart attack; slow breathing is advised instead.'
  ],
  formulas: [
    {
      name: 'Henderson–Hasselbalch for blood',
      expr: 'pH = pK + log(HCO3/(s*PCO2))', tex: '\\text{pH} = {\\mathrm{p}K}_a + \\log\\frac{\\mathrm{[HCO_3^-]}}{s\\,P_{\\text{CO}_2}}',
      vars: {
        pH: { name: 'blood pH', tex: '\\text{pH}' },
        pK: { name: 'pKa of the CO₂–bicarbonate system', value: 6.1, fixed: true, tex: '{\\mathrm{p}K}_a' },
        HCO3: { name: 'bicarbonate (mmol/L)', value: 24, tex: '\\mathrm{[HCO_3^-]}' },
        s: { name: 'CO₂ solubility (mmol/L per mmHg)', value: 0.03, fixed: true },
        PCO2: { name: 'arterial CO₂ pressure, PaCO₂ (mmHg)', value: 40, tex: 'P_{\\text{CO}_2}' }
      },
      note: 'Bicarbonate in mmol/L (= mEq/L) and PaCO₂ in mmHg; for kPa multiply the solubility by 7.5 (0.23 mmol/L per kPa). A more precise solubility at 37 °C is 0.0307.',
      practice: { unknowns: ['pH', 'HCO3', 'PCO2'] },
      stories: { pH: 'A blood gas shows bicarbonate {HCO3} mmol/L and PaCO₂ {PCO2} mmHg. What is the pH?', PCO2: 'A patient\'s pH is {pH} with a bicarbonate of {HCO3} mmol/L. What is the PaCO₂ in mmHg?', HCO3: 'The pH is {pH} and the PaCO₂ {PCO2} mmHg. What is the bicarbonate in mmol/L?' }
    },
    {
      name: 'Hydrogen ions from pH',
      expr: 'H = 10^(9 - pH)', tex: '\\mathrm{[\\ce{H+}]} = 10^{\\,9 - \\text{pH}}',
      vars: {
        H: { name: 'hydrogen-ion concentration (nmol/L)', tex: '\\mathrm{[\\ce{H+}]}' },
        pH: { name: 'pH', value: 7.4, tex: '\\text{pH}' }
      },
      note: 'pH 7.40 is 40 nmol/L; every fall of 0.3 in pH doubles the hydrogen-ion concentration. Between pH 7.2 and 7.5 a handy rule is H ≈ 80 − the two digits after the decimal point (7.25 → 55).',
      stories: { H: 'A patient\'s blood pH is {pH}. What is the hydrogen-ion concentration in nanomoles per litre?', pH: 'The hydrogen-ion concentration is {H} nmol/L. What is the pH?' }
    },
    {
      name: 'Expected breathing response to metabolic acidosis (Winters)',
      expr: 'PCO2 = 1.5*HCO3 + 8', tex: 'P_{\\text{CO}_2} = 1.5\\,\\mathrm{[HCO_3^-]} + 8',
      vars: {
        PCO2: { name: 'expected PaCO₂ (mmHg)', tex: 'P_{\\text{CO}_2}' },
        HCO3: { name: 'bicarbonate (mmol/L)', value: 12, tex: '\\mathrm{[HCO_3^-]}' }
      },
      note: 'An empirical rule, ± 2 mmHg. A measured PaCO₂ higher than expected means the breathing is not keeping up (a respiratory acidosis as well); lower means an added respiratory alkalosis.',
      stories: { PCO2: 'A patient with a metabolic acidosis has a bicarbonate of {HCO3} mmol/L. What PaCO₂ (mmHg) would full respiratory compensation give?' }
    },
    {
      name: 'Anion gap',
      expr: 'AG = Na - (Cl + HCO3)', tex: '\\text{AG} = \\text{Na}^+ - (\\text{Cl}^- + \\mathrm{HCO_3^-})',
      vars: {
        AG: { name: 'anion gap', q: 'concentration', unit: 'mmol/L', signed: true, tex: '\\text{AG}' },
        Na: { name: 'sodium', q: 'concentration', unit: 'mmol/L', value: 140, tex: '\\text{Na}^+' },
        Cl: { name: 'chloride', q: 'concentration', unit: 'mmol/L', value: 104, tex: '\\text{Cl}^-' },
        HCO3: { name: 'bicarbonate', q: 'concentration', unit: 'mmol/L', value: 24, tex: '\\mathrm{HCO_3^-}' }
      },
      note: 'The unmeasured anions (mainly albumin). Normal ranges depend on the laboratory — often about 4–12 mmol/L with modern analysers; each 1 g/dL fall in albumin lowers it by about 2.5.',
      practice: { unknowns: ['AG', 'HCO3'] },
      stories: { AG: 'Sodium {Na}, chloride {Cl}, bicarbonate {HCO3}. What is the anion gap?' }
    }
  ],
  examples: [
    {
      title: 'Reading the ketoacidosis gas',
      q: 'The teenager above has bicarbonate 8 mmol/L, PaCO₂ 20 mmHg, sodium 134 and chloride 98 mmol/L. Work out the pH, check the compensation and classify the disorder.',
      steps: [
        'pH: $6.1 + \\log_{10}\\dfrac{8}{0.03 \\times 20} = 6.1 + \\log_{10} 13.3 = 7.22$ — an acidaemia.',
        'Bicarbonate is low, so the primary process is metabolic acidosis (a respiratory acidosis would need a high CO₂).',
        'Expected PaCO₂: $1.5 \\times 8 + 8 = 20 \\pm 2$ mmHg. The measured 20 matches: the lungs are compensating fully.',
        'Anion gap: $134 - (98 + 8) = 28$ mmol/L — high, so an unmeasured acid has been added: ketones.'
      ],
      a: 'pH 7.22: a high-anion-gap metabolic acidosis (ketoacidosis) with appropriate respiratory compensation.'
    },
    {
      title: 'Same CO₂, different stories',
      q: 'Two patients both have a PaCO₂ of 60 mmHg. One, just given too much of an opioid, has a bicarbonate of 26; the other, with long-standing COPD, has 31. Compare their pH and explain the difference.',
      steps: [
        'Acute: $6.1 + \\log_{10}(26/1.8) = 6.1 + 1.16 = 7.26$.',
        'Chronic: $6.1 + \\log_{10}(31/1.8) = 6.1 + 1.24 = 7.34$.',
        'In the chronic case the kidneys have had days to retain bicarbonate (about 3.5 mmol/L per 10 mmHg of CO₂), restoring the ratio towards 20.',
        'The same CO₂ therefore means very different things: the opioid patient\'s acidaemia is new and dangerous, and a rising CO₂ in either is a warning.'
      ],
      a: 'pH about 7.26 (acute, uncompensated) versus 7.34 (chronic, with kidney compensation).'
    }
  ],
  quiz: [
    { q: 'In diabetic ketoacidosis, the deep, rapid breathing is…', choices: ['a sign of pneumonia', 'the lungs compensating by blowing off CO₂', 'caused by the high blood sugar irritating the lungs', 'the cause of the acidosis'], a: 1,
      why: 'The ketoacids use up bicarbonate; breathing more lowers PaCO₂ so that the bicarbonate-to-CO₂ ratio, and the pH, fall less.' },
    { q: 'With bicarbonate 24 mmol/L and PaCO₂ 60 mmHg, what is the pH?', answer: 7.225,
      why: 'pH = 6.1 + log(24/(0.03 × 60)) = 6.1 + log(13.3) = 7.22: an acute respiratory acidosis.' },
    { q: 'Prolonged vomiting typically causes…', choices: ['metabolic acidosis', 'metabolic alkalosis', 'respiratory acidosis', 'respiratory alkalosis'], a: 1,
      why: 'Stomach acid (HCl) is lost, leaving bicarbonate behind in the blood; the volume and chloride loss make the kidneys hold on to it.' },
    { q: 'Compensation normally returns the pH exactly to 7.40.', a: false,
      why: 'It moves pH towards normal but usually stops short. A perfectly normal pH with abnormal bicarbonate and CO₂ suggests two disorders.' },
    { q: 'A blood gas shows pH 7.31, PaCO₂ 60 mmHg, bicarbonate 29 mmol/L. The best description is…', choices: ['metabolic acidosis', 'respiratory acidosis with partial kidney compensation', 'metabolic alkalosis', 'a normal result'], a: 1,
      why: 'Low pH with high CO₂ is a respiratory acidosis; bicarbonate is up by 5, between the acute (+2) and chronic (+7) expectations — partly compensated.' }
  ],
  applications: ['Reading arterial and venous blood gases in emergency and intensive care.', 'Recognising and treating diabetic ketoacidosis.', 'Setting ventilators, where the machine controls CO₂.', 'Understanding altitude sickness and the kidneys\' slow adaptation to thin air.'],
  history: 'Lawrence Henderson described the bicarbonate buffer in 1908, and Karl Hasselbalch rewrote it in logarithmic form in 1916. The blood-gas analyser, built around Severinghaus\'s CO₂ electrode and Clark\'s oxygen electrode in the 1950s, made acid–base diagnosis routine.',
  sim: 'fnd-acid-base'
},

/* ================================================================ TEMPERATURE */
{
  id: 'thermoregulation', parent: 'homeostasis', title: 'Body temperature and fever', level: 1,
  short: 'The brain holds the body\'s core near 37 °C by balancing heat made by metabolism against heat lost from the skin — through blood flow, sweating and shivering. A fever raises the set point on purpose; heatstroke is the cooling system overwhelmed.',
  keywords: ['body temperature', 'thermoregulation', 'fever', 'set point', 'hypothalamus', 'sweating', 'evaporation', 'shivering', 'vasodilation', 'vasoconstriction', 'heatstroke', 'heat exhaustion', 'hypothermia', 'antipyretic', 'febrile seizure', 'wet-bulb temperature', 'brown fat'],
  prereq: ['homeostasis-feedback', 'physics:heat-transfer', 'physics:latent-heat'],
  related: ['heat-cold', 'metabolism-energy', 'innate-immunity', 'sepsis', 'vital-signs', 'physics:specific-heat', 'physics:thermal-radiation'],
  body: `
Two people arrive at an emergency department with a temperature of 40 °C. One is a four-year-old with flu who was shivering an hour ago under two blankets, complaining of cold hands and feet as his temperature climbed. The other is a young man who collapsed near the end of a summer half-marathon, confused, with hot, flushed skin. The number is the same; the physiology is opposite. The child's thermostat has been *turned up* — a **fever**. The runner's thermostat is where it always was, but his body made heat faster than it could lose it — **heatstroke**.

### A thermostat in the brain
A region at the base of the brain, the preoptic hypothalamus, compares signals from temperature sensors in the core and the skin with a **set point** near 37 °C. That figure is a convention from the 1860s: modern studies find an average oral temperature closer to 36.6 °C, a normal range of roughly 36–37.5 °C, a daily swing of about half a degree (lowest before dawn), and differences by site — rectal readings run higher, armpit readings lower — by person and, in women, with the menstrual cycle.

### Heat in, heat out
At rest the body makes about 80–100 W of heat, like an old light bulb; hard exercise makes ten times more, since muscles turn only about a quarter of their fuel into work ([[metabolism-energy]]). Heat leaves through the skin by:

- **radiation** to cooler surroundings ([[physics:thermal-radiation|thermal radiation]]) — the largest route in a cool room;
- **convection** to moving air or water, and **conduction** to what we touch;
- **evaporation** of sweat — the only route left when the air is warmer than the skin. Each litre of sweat that evaporates carries away about 2.4 MJ ([[physics:latent-heat|latent heat]]), so one litre an hour removes about 670 W. Sweat that drips off cools nothing, and in humid air less evaporates.

The brain controls the flow with **skin blood flow**: widening skin vessels brings warm blood to the surface, narrowing them keeps heat in the core. Then **sweating** to lose heat, **shivering** (which can multiply heat production several times) and, in babies especially, brown fat to make it. The most powerful tool is behaviour: clothes, shade, a drink, moving less.

### Fever
When the immune system meets an infection, signalling molecules (such as interleukin-1 and interleukin-6) make the hypothalamus produce prostaglandin E₂, which **raises the set point**. The body now feels too cold: vessels constrict, the person shivers and seeks blankets until the core reaches the new setting. When the infection eases the set point drops, and sweating and flushing bring the temperature down. A temperature of 38.0 °C (100.4 °F) or more is generally called a fever. Fever probably helps fight infection; medicines such as paracetamol (acetaminophen) and ibuprofen lower the set point by blocking prostaglandin production, and are used mainly for comfort. Between six months and five years of age, a few children in every hundred have a **febrile seizure** — frightening but usually harmless; the first one should always be assessed.

### When the loop is overwhelmed
In **heat exhaustion** the body is struggling — heavy sweating, weakness, nausea, headache — but the brain works normally. **Heatstroke** is a core temperature above about 40 °C with confusion, collapse or seizures: an emergency that needs rapid cooling, ideally immersion in cold water, as the current first-aid guidelines (ILCOR, ERC and AHA) advise for exertional heatstroke. Fever medicines do not help, because the set point is not raised. Heat and humidity together are the danger: once the air is both hot and humid, sweat cannot evaporate fast enough — recent laboratory studies suggest the limit is reached at lower temperatures than once thought, especially for older people. **Hypothermia**, a core below 35 °C, is the opposite failure ([[heat-cold]]).

> [!warn] Call your local emergency number for: a hot person who is confused, collapsed, has stopped sweating or has a seizure (cool them while you wait); a fever in a baby under 3 months (38 °C or more) — seek urgent medical advice; any fever with a rash that does not fade under a pressed glass, a stiff neck, difficulty breathing, blue lips, or a child who is floppy or hard to wake; or someone cold, drowsy and no longer shivering.
`,
  ideas: [
    'The hypothalamus compares core and skin temperature with a set point near 37 °C (average measured oral temperature is nearer 36.6 °C).',
    'Heat made by metabolism (about 100 W at rest) leaves by radiation, convection, conduction and evaporation.',
    'Evaporating one litre of sweat removes about 2.4 MJ; it is the only route out when the air is hotter than the skin.',
    'A fever is a raised set point, so the person shivers while it rises and sweats as it falls.',
    'Heatstroke is heat gain beating heat loss with a normal set point; it needs rapid cooling, not fever medicine.'
  ],
  pitfalls: [
    'Normal body temperature is exactly 37 °C — It varies between people, sites, times of day and the menstrual cycle; the average measured oral temperature is around 36.6 °C.',
    'Fever medicine treats heatstroke — Paracetamol and ibuprofen lower a raised set point; in heatstroke the set point is normal, so only physical cooling works.',
    'Sweating more always cools you more — Only sweat that evaporates cools; in humid air much of it drips off and you lose water without losing heat.'
  ],
  formulas: [
    {
      name: 'How fast the body warms if heat cannot escape',
      expr: 'P*t = m*c*dT', tex: 'P\\,t = m\\,c\\,\\Delta T',
      vars: {
        P: { name: 'heat produced', q: 'power', unit: 'W', value: 100 },
        t: { name: 'time', q: 'time', unit: 'min', value: 60 },
        m: { name: 'body mass', q: 'mass', unit: 'kg', value: 70 },
        c: { name: 'specific heat of the body', q: 'specificheat', unit: 'J/(kg·K)', value: 3470, fixed: true },
        dT: { name: 'rise in body temperature', q: 'dtemp', unit: '°C', tex: '\\Delta T' }
      },
      solveFor: 'dT',
      note: 'The body\'s average specific heat is about 3.47 kJ/(kg·K), less than water\'s because of fat and bone. Real bodies lose heat as they warm, so this is the worst case.',
      practice: { unknowns: ['dT', 't'] },
      stories: { dT: 'A person of {m} produces {P} of heat and, in a hot, humid room, loses none of it for {t}. How much does the core warm?', t: 'A runner of {m} produces {P} of heat. If none escaped, how long would it take the core to rise by {dT}?' }
    },
    {
      name: 'Cooling by evaporating sweat',
      expr: 'P = mdot*L', tex: 'P = \\dot{m}\\,L',
      vars: {
        P: { name: 'heat removed', q: 'power', unit: 'W' },
        mdot: { name: 'sweat evaporated (about 1 kg per litre)', q: 'massflow', unit: 'kg/h', value: 1, tex: '\\dot{m}' },
        L: { name: 'latent heat of evaporation of sweat', q: 'latent', unit: 'kJ/kg', value: 2430, fixed: true }
      },
      note: 'Only sweat that evaporates counts. Trained, heat-acclimatised people can sweat 1.5–2 L an hour or more, but in humid air much of it drips off.',
      practice: { unknowns: ['P', 'mdot'] },
      stories: { P: 'A cyclist evaporates {mdot} of sweat. How much heat does that remove?', mdot: 'A runner must shed {P} of heat by evaporation alone. How much sweat must evaporate each hour?' }
    },
    {
      name: 'Dry heat exchange with the air',
      expr: 'H = h*A*(Ts - Ta)', tex: 'H = h\\,A\\,(T_s - T_a)',
      vars: {
        H: { name: 'heat lost by radiation and convection (negative: gained)', q: 'power', unit: 'W', signed: true },
        h: { name: 'combined heat-transfer coefficient', q: 'heattransfer', unit: 'W/(m²·K)', value: 8 },
        A: { name: 'skin area', q: 'area', unit: 'm²', value: 1.8 },
        Ts: { name: 'skin temperature', q: 'temperature', unit: '°C', value: 33, tex: 'T_s' },
        Ta: { name: 'air (and surroundings) temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_a' }
      },
      note: 'About 8 W/(m²·K) in still air for lightly clothed skin (radiation about 5, convection about 3); wind raises it, clothing lowers it. When the air is warmer than the skin, the body gains heat.',
      practice: { unknowns: ['H', 'Ta'] },
      stories: { H: 'A person with {A} of skin at {Ts} sits in air at {Ta}, with a heat-transfer coefficient of {h}. How much heat do they lose by radiation and convection?' }
    }
  ],
  examples: [
    {
      title: 'Why exercise needs cooling',
      q: 'A 70 kg runner produces about 800 W of heat. If none could escape, how much would the core warm in 20 minutes? How much sweat would have to evaporate each hour to shed it all?',
      steps: [
        'Heat stored: $800 \\times 1200 = 960\\,000$ J.',
        'Temperature rise: $\\Delta T = 960\\,000 / (70 \\times 3470) \\approx 4.0$ °C — from 37 to 41 °C, into heatstroke.',
        'Sweat needed: $\\dot{m} = P/L = 800 / 2.43 \\times 10^6$ kg/s $\\approx 1.2$ kg per hour, all of it evaporating.',
        'In humid heat, much sweat drips off unevaporated; the runner loses water without losing heat — the setting for exertional heatstroke.'
      ],
      a: 'About 4 °C in 20 minutes, which is why the body must evaporate more than a litre of sweat an hour during hard exercise.'
    },
    {
      title: 'The two 40 °C patients',
      q: 'Explain, in terms of set point and heat balance, why the child with flu shivered as his temperature rose while the collapsed runner was flushed and hot, and why they are treated differently.',
      steps: [
        'Child: infection raised his set point to about 40 °C. Until his core reached it, his brain read "too cold" — vessels constricted (cold hands), shivering added heat.',
        'Runner: his set point stayed near 37 °C. His brain read "far too hot" and his skin vessels were wide open and sweating was maximal, but heat production and the hot, humid air beat his cooling.',
        'The child\'s fever is part of fighting infection; paracetamol or ibuprofen can lower the set point for comfort, and the illness itself is what needs attention.',
        'The runner\'s organs are being damaged by the heat itself; he needs cooling immediately, preferably cold-water immersion, and emergency care.'
      ],
      a: 'Fever is a regulated rise (set point up); heatstroke is a failure of heat loss (set point normal) — comfort for the first, urgent cooling for the second.'
    }
  ],
  quiz: [
    { q: 'While a fever is rising, a person usually…', choices: ['feels hot and sweats', 'feels cold and may shiver', 'feels nothing until it peaks', 'has warm, flushed hands and feet'], a: 1,
      why: 'The set point has jumped above the actual temperature, so the brain responds as if the body were cold: constricted skin vessels, shivering, seeking warmth.' },
    { q: 'When the air is hotter than the skin, evaporation of sweat is the only way the body can lose heat.', a: true,
      why: 'Radiation and convection run from hot to cold, so they now add heat. Only evaporation can remove it — which is why humid heat is so dangerous.' },
    { q: 'How much heat (in watts) does evaporating 1.5 litres of sweat an hour remove? (latent heat 2430 kJ/kg)', answer: 1013, unit: 'W',
      why: 'P = ṁL = (1.5/3600 kg/s) × 2.43 × 10⁶ J/kg ≈ 1010 W.' },
    { q: 'Why does paracetamol not help in heatstroke?', choices: ['it is absorbed too slowly', 'the set point is not raised in heatstroke', 'it raises the temperature further', 'it only works in children'], a: 1,
      why: 'Fever medicines lower a raised set point by blocking prostaglandins. In heatstroke the thermostat is normal; the problem is heat gain exceeding loss, which only cooling fixes.' },
    { q: 'Which is the best description of normal body temperature?', choices: ['exactly 37.0 °C for everyone', 'a range around 36–37.5 °C that varies with the person, the time of day and where it is measured', 'anything below 38 °C', '98.6 °F measured in the armpit'], a: 1,
      why: 'Temperature varies between people, over the day (lowest before dawn) and by measuring site; 37 °C is a convenient reference, not a universal value.' }
  ],
  applications: ['Measuring and interpreting temperature at home and in clinics.', 'Heat-health warnings, cooling centres and work–rest rules in hot weather.', 'Cold-water immersion for exertional heatstroke at sports events.', 'Warming and cooling in operating theatres, newborn care and after cardiac arrest.'],
  history: 'Carl Wunderlich analysed about a million readings from some 25,000 patients in 1868 and set 37 °C as the norm. Recent large studies in the US and UK have found averages nearer 36.6 °C.',
  sim: 'fnd-heat-balance'
},

/* ================================================================ METABOLISM */
{
  id: 'metabolism-energy', parent: 'homeostasis', title: 'Metabolism and energy', level: 2,
  short: 'Metabolism is the chemistry that turns food into energy and building blocks. Cells burn carbohydrate, fat and protein with oxygen to make ATP; most of a day\'s energy goes to simply staying alive (the basal metabolic rate), and the rest to digestion and movement.',
  keywords: ['metabolism', 'ATP', 'basal metabolic rate', 'BMR', 'resting energy expenditure', 'Mifflin–St Jeor', 'calorie', 'kilojoule', 'glycolysis', 'mitochondria', 'aerobic', 'anaerobic', 'lactate', 'glycogen', 'ketones', 'fasting', 'MET', 'oxygen consumption', 'respiratory quotient', 'hitting the wall'],
  prereq: ['cell-structure', 'homeostasis-feedback', 'chemistry:enthalpy'],
  related: ['energy-balance', 'macronutrients', 'glucose-regulation', 'thyroid', 'physical-activity', 'thermoregulation', 'physics:efficiency'],
  body: `
Around the 30-kilometre mark of a marathon, many runners "hit the wall": their legs turn heavy, their pace collapses, and they feel oddly light-headed and low. What has run out is not energy in general — even a lean runner carries enough fat for hundreds of kilometres — but **glycogen**, the stored carbohydrate that muscles can burn quickly. A marathon costs roughly 3,000 kcal for a 70 kg runner, and the body stores only about 500 g of glycogen, worth some 2,000 kcal. Fat burns too slowly to sustain racing pace on its own, which is why endurance athletes eat carbohydrate during long events.

### ATP, the energy currency
Every job a cell does — pumping ions, contracting, building proteins, firing a nerve — is paid for with **ATP** (adenosine triphosphate). A body holds well under half a kilogram of ATP at any moment, yet recycles something like its own weight of it every day. ATP is remade by burning fuel:

- **Glycolysis**, in the cytoplasm, splits glucose into two pyruvates and yields a little ATP fast, without oxygen. In a sprint, pyruvate becomes **lactate**, which is carried away and later burned or turned back into glucose by the liver.
- **Aerobic respiration**, in the [[cell-structure|mitochondria]], burns pyruvate, fatty acids and amino acids completely to carbon dioxide and water using oxygen, yielding about fifteen times more ATP per glucose (around 30 ATP in total).
- Fats are broken into fatty acids and burned in the mitochondria; in prolonged fasting the liver turns fat into **ketones**, which the brain can use in place of glucose. The liver also makes new glucose from amino acids, lactate and glycerol.

Hormones switch the whole system between storing (after a meal, driven by insulin) and releasing (between meals and during exercise, driven by glucagon, adrenaline and cortisol) ([[glucose-regulation]]).

### Where the energy goes
| Fuel | Energy per gram | Stored as |
|---|---|---|
| Carbohydrate | about 4 kcal (17 kJ) | glycogen in liver (about 100 g) and muscle (about 400 g) |
| Protein | about 4 kcal (17 kJ) | not a store: muscle and organs |
| Fat | about 9 kcal (37 kJ) | fat tissue — by far the largest reserve |
| Alcohol | about 7 kcal (29 kJ) | not stored; burned first |

For most people the **basal metabolic rate** — the energy used at complete rest to keep the heart beating, the brain working, ions pumped and proteins renewed — is 60–70 % of the daily total. The brain, 2 % of body weight, uses about a fifth of it; the liver and muscles about a fifth each. Digesting food uses about 10 %, and movement the rest — anything from 15 % in a sedentary person to half or more in a manual worker or athlete. BMR scales mainly with lean body mass, so bigger and more muscular people burn more; men burn more than women of the same weight, and BMR falls slowly with age. Equations such as Mifflin–St Jeor predict it within about 10 % for most people, not for everyone.

Energy use can be measured by the oxygen consumed: about 4.8 kcal (20 kJ) per litre. At rest an adult uses about 250 mL of oxygen a minute — roughly 80 W. Exercise intensity is expressed in **METs**, multiples of the resting rate (1 MET ≈ 3.5 mL of oxygen per kg per minute ≈ 1 kcal per kg per hour): brisk walking is about 4, running at 10 km/h about 10.

### When metabolism goes wrong
Newborn screening looks for **inborn errors of metabolism** such as phenylketonuria, where a missing enzyme lets an amino acid build up to toxic levels; a special diet from birth prevents harm ([[dna-genes]]). The thyroid sets the pace of metabolism ([[thyroid]]); diabetes is a failure of fuel control; in shock, cells short of oxygen fall back on glycolysis and flood the blood with lactate ([[acid-base-balance]]). After a long period of starvation, restarting food too quickly can cause dangerous shifts of phosphate and potassium into cells (refeeding syndrome), so it is done under medical care. How energy intake and use balance over weeks and years is the subject of [[energy-balance]].
`,
  ideas: [
    'Cells run on ATP, remade continuously by burning glucose, fat and (less) protein.',
    'Glycolysis is fast and needs no oxygen but yields little; mitochondrial respiration yields about fifteen times more ATP.',
    'Fat stores far more energy than glycogen, but glycogen burns faster — hence "hitting the wall".',
    'The basal metabolic rate is 60–70 % of daily energy use for most people and scales with lean body mass.',
    'Energy use follows oxygen use: about 20 kJ (4.8 kcal) per litre of oxygen; 1 MET is the resting rate.'
  ],
  pitfalls: [
    'Lactic acid causes the muscle soreness you feel a day or two after exercise — Lactate is cleared within an hour or so; delayed soreness comes from small injuries to muscle fibres and their repair.',
    'Most of the energy you use each day goes on exercise — For most people the basal metabolic rate is the largest share, 60–70 %.',
    'Thin people have fast metabolisms and heavier people slow ones — BMR rises with body size and lean mass, so larger people usually burn more; differences between people of the same build are modest.'
  ],
  formulas: [
    {
      name: 'Basal metabolic rate (Mifflin–St Jeor)',
      expr: 'BMR = 10*W + 6.25*Ht - 5*A + s', tex: '\\text{BMR} = 10\\,W + 6.25\\,H - 5\\,A + s',
      vars: {
        BMR: { name: 'basal metabolic rate (kcal/day)', tex: '\\text{BMR}' },
        W: { name: 'weight (kg)', value: 70 },
        Ht: { name: 'height (cm)', value: 175, tex: 'H' },
        A: { name: 'age (years)', value: 30 },
        s: { name: 'sex constant: +5 for men, −161 for women', value: 5, signed: true }
      },
      note: 'An empirical equation from 1990 that predicts resting energy use within about 10 % for most adults; it is less accurate for very muscular people, people with obesity and the very old. 1 kcal/day ≈ 0.048 W; 1 kcal = 4.184 kJ.',
      practice: { unknowns: ['BMR'] },
      stories: { BMR: 'Estimate the basal metabolic rate of a {A}-year-old weighing {W} kg and {Ht} cm tall (sex constant {s}), in kcal per day.' }
    },
    {
      name: 'Energy from oxygen consumed',
      expr: 'P = k*VO2', tex: 'P = k\\,\\dot{V}_{\\text{O}_2}',
      vars: {
        P: { name: 'metabolic power', q: 'power', unit: 'W' },
        k: { name: 'energy released per volume of oxygen (20.1 kJ per litre)', q: 'energydensity', unit: 'MJ/m³', value: 20.1, fixed: true },
        VO2: { name: 'oxygen consumption', q: 'flowrate', unit: 'mL/min', value: 250, tex: '\\dot{V}_{\\text{O}_2}' }
      },
      note: 'Between about 19.6 kJ/L (burning fat) and 21.1 kJ/L (burning carbohydrate); 20.1 kJ/L (4.8 kcal/L) is a typical mixed diet. 1 MJ/m³ is 1 kJ per litre.',
      practice: { unknowns: ['P', 'VO2'] },
      stories: { P: 'A person at rest uses {VO2} of oxygen. What is their metabolic power?', VO2: 'A cyclist\'s metabolism runs at {P}. How much oxygen are they using?' }
    },
    {
      name: 'Energy used in an activity (METs)',
      expr: 'E = MET*W*t', tex: 'E = \\text{MET}\\times W \\times t',
      vars: {
        E: { name: 'energy used (kcal)' },
        MET: { name: 'intensity (multiples of the resting rate)', value: 4, tex: '\\text{MET}' },
        W: { name: 'body weight (kg)', value: 70 },
        t: { name: 'duration (hours)', value: 1 }
      },
      note: 'Uses 1 MET ≈ 1 kcal per kg per hour. Typical values: sitting 1–1.5, brisk walking 3.5–4.5, cycling at a moderate pace 6–8, running at 10 km/h about 10. Individual values vary by ±20 % or more.',
      stories: { E: 'A {W} kg person does an activity of {MET} METs for {t} hours. About how much energy do they use, in kcal?' }
    },
    {
      name: 'Energy in food',
      expr: 'E = 4*C + 4*Pr + 9*F + 7*Al', tex: 'E = 4\\,C + 4\\,P + 9\\,F + 7\\,A',
      vars: {
        E: { name: 'energy (kcal)' },
        C: { name: 'carbohydrate (g)', value: 50 },
        Pr: { name: 'protein (g)', value: 20, tex: 'P' },
        F: { name: 'fat (g)', value: 15 },
        Al: { name: 'alcohol (g)', value: 14, tex: 'A' }
      },
      note: 'The Atwater factors (kcal per gram), used on food labels; multiply by 4.184 for kilojoules. Fibre contributes about 2 kcal/g and is often counted separately.',
      practice: { unknowns: ['E'] },
      stories: { E: 'A meal contains {C} g of carbohydrate, {Pr} g of protein and {F} g of fat, with a drink containing {Al} g of alcohol. How much energy does it provide, in kcal?' }
    }
  ],
  examples: [
    {
      title: 'Resting energy in watts',
      q: 'Estimate the basal metabolic rate of a 30-year-old man (70 kg, 175 cm) and a 30-year-old woman (60 kg, 165 cm), in kcal a day and in watts. Check the man\'s value against a resting oxygen consumption of 250 mL/min.',
      steps: [
        'Man: $10 \\times 70 + 6.25 \\times 175 - 5 \\times 30 + 5 = 1649$ kcal/day.',
        'Woman: $10 \\times 60 + 6.25 \\times 165 - 5 \\times 30 - 161 = 1320$ kcal/day.',
        'In watts: $1649 \\times 4184 / 86\\,400 \\approx 80$ W and $1320 \\times 4184/86\\,400 \\approx 64$ W.',
        'From oxygen: $20.1$ kJ/L $\\times\\ 0.25$ L/min $= 5.0$ kJ/min $= 84$ W — consistent.'
      ],
      a: 'About 1650 kcal/day (80 W) and 1320 kcal/day (64 W): a resting human runs at the power of a small light bulb.'
    },
    {
      title: 'Hitting the wall',
      q: 'Running costs roughly 1 kcal per kg per km. How much energy does a 70 kg runner need for a 42.2 km marathon, and how does that compare with about 500 g of stored glycogen?',
      steps: [
        'Energy: $70 \\times 42.2 \\approx 2950$ kcal.',
        'Glycogen: $500 \\times 4 = 2000$ kcal — and not all of it can be used, since liver glycogen must also keep blood glucose up for the brain.',
        'The shortfall must come from fat, which burns more slowly per minute, so pace falls when glycogen runs low — unless carbohydrate is taken during the race.'
      ],
      a: 'About 2950 kcal needed against roughly 2000 kcal of glycogen — the gap is why runners hit the wall.'
    }
  ],
  quiz: [
    { q: 'Which fuel stores the most energy per gram?', choices: ['carbohydrate', 'protein', 'fat', 'alcohol'], a: 2,
      why: 'Fat provides about 9 kcal (37 kJ) per gram, more than twice carbohydrate or protein (about 4 kcal); alcohol provides about 7.' },
    { q: 'A cyclist uses 2 L of oxygen a minute. What is her metabolic power, in watts? (20.1 kJ per litre)', answer: 670, unit: 'W',
      why: 'P = 20 100 J/L × 2 L/min ÷ 60 s ≈ 670 W — of which only about a quarter reaches the pedals; the rest is heat.' },
    { q: 'For most people, physical activity accounts for the largest share of daily energy use.', a: false,
      why: 'The basal metabolic rate — the cost of simply staying alive — is typically 60–70 % of the total; activity varies from about 15 % upwards.' },
    { q: 'Why do muscles produce lactate during a sprint?', choices: ['because they run out of fat', 'because glycolysis makes ATP faster than oxygen can be delivered to the mitochondria', 'because lactate is a waste product with no further use', 'because the sprinter is dehydrated'], a: 1,
      why: 'Glycolysis is quick and needs no oxygen; its pyruvate is turned into lactate, which is later burned by the heart and muscles or remade into glucose by the liver.' },
    { q: 'The brain is about 2 % of body weight. Roughly what share of the resting energy does it use?', choices: ['2 %', '5 %', '20 %', '50 %'], a: 2,
      why: 'About a fifth: neurons spend much of their energy pumping ions to restore the gradients used in signalling.' }
  ],
  applications: ['Estimating energy needs in hospital nutrition, including tube and intravenous feeding.', 'Exercise testing and prescription using oxygen uptake and METs.', 'Newborn screening for inborn errors of metabolism.', 'Fuelling strategies for endurance sport.'],
  history: 'Antoine Lavoisier showed in the 1780s that respiration is slow combustion, measuring a guinea pig\'s heat with an ice calorimeter. Hans Krebs worked out the citric acid cycle in 1937, and Peter Mitchell explained in 1961 how mitochondria use a proton gradient to make ATP.',
  sim: { id: 'fnd-heat-balance', params: { preset: 'run' } }
}

);
