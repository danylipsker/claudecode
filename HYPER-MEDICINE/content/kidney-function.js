/* HYPER-MEDICINE · content/kidney-function.js — how the kidneys work:
 * the kidney and the nephron, filtration and GFR, reabsorption and secretion,
 * concentrating urine, and kidney function tests. Simulations in sims/kidney.js. */
Hyper.add(

{
  id: 'kidney-anatomy', parent: 'kidney-function', title: 'The kidney and the nephron', level: 1,
  short: 'Two fist-sized organs under the lower ribs, each made of about a million tiny filtering units called nephrons. Together they receive a fifth of the heart\'s output, filter the blood plasma some sixty times a day, and return nearly all of it.',
  keywords: ['kidney', 'nephron', 'glomerulus', 'Bowman\'s capsule', 'proximal tubule', 'loop of Henle', 'distal tubule', 'collecting duct', 'cortex', 'medulla', 'renal pelvis', 'ureter', 'bladder', 'urethra', 'renal blood flow', 'erythropoietin', 'renin', 'vitamin D', 'urinary system'],
  prereq: ['body-fluids', 'blood-vessels', 'homeostasis-feedback'],
  related: ['glomerular-filtration', 'tubular-function', 'urine-concentration', 'kidney-tests', 'blood-pressure', 'anemia', 'bone-calcium', 'uti'],
  body: `
Drink a large glass of water on an empty stomach and, within an hour or so, you will need the toilet — and what you pass will be pale. Skip drinks on a hot afternoon and the little urine you make will be dark. Nobody decides this: two organs the size of a fist, tucked against the back muscles under the lowest ribs, are measuring the blood and adjusting it minute by minute. The kidneys are less a sieve than a chemist who checks every substance and keeps exactly what the body needs.

### The parts
Each kidney is about 11–12 cm long and weighs roughly 150 g. Cut in half, it shows a pale outer **cortex** and a darker inner **medulla** arranged in cone-shaped pyramids. Urine made in the pyramids drips into cup-like calyces, gathers in the **renal pelvis**, and runs down a **ureter** — a muscular tube that squeezes it along in waves — to the **bladder**, which stores it until it leaves through the **urethra**. You can explore the organs on [the body map](#/tools/body).

The working unit is the **nephron**, and a kidney holds about a million of them, though autopsy studies find anything from about 200,000 to more than 2 million per kidney. Each nephron is a long, folded tube with a filter at the start:

| Part | Where | Main job |
|---|---|---|
| Glomerulus in Bowman's capsule | cortex | filters plasma: water and small molecules pass, cells and most proteins stay |
| Proximal tubule | cortex | takes back about two-thirds of the water and salt, all the glucose and amino acids; secretes many drugs |
| Loop of Henle | dips into the medulla | builds the salt gradient that lets urine be concentrated |
| Distal tubule | cortex | fine-tunes sodium and calcium; touches its own glomerulus (the macula densa) |
| Collecting duct | cortex to papilla | final adjustment of water (ADH), sodium and potassium (aldosterone), and acid |

The details of each step are in [[glomerular-filtration|Filtration and GFR]], [[tubular-function|Reabsorption and secretion]] and [[urine-concentration|Concentrating urine]].

### A double capillary bed
Blood reaches each glomerulus through an **afferent arteriole**, passes through a tuft of capillaries, and leaves — still in an artery, not a vein — through an **efferent arteriole**, which then breaks up into a second capillary network around the tubules (and, for the deepest nephrons, the long hairpin vessels of the medulla, the vasa recta). Two resistances in series, one before and one after the filter, let the kidney set the filtration pressure precisely, and the second network collects everything the tubules take back.

The kidneys make up less than 0.5 % of body weight but receive about 20–25 % of the heart's output — roughly 1.1 L of blood a minute. About 55 % of that is plasma, and about a fifth of the plasma is filtered: some 125 mL a minute, or 180 L a day. With about 3 L of plasma in the body, the kidneys filter the whole of it about 60 times a day and return all but 1–2 L.

### More than a filter
The kidneys also act as endocrine organs. They release **renin**, which starts the renin–angiotensin–aldosterone chain that holds up [[blood-pressure|blood pressure]]; **erythropoietin**, which tells the bone marrow to make red cells (why kidney failure causes [[anemia|anaemia]]); and the enzyme that makes the active form of **vitamin D**, needed for calcium and [[bone-calcium|bone]]. They also make glucose during fasting and set the body's acid–base balance.

### What goes wrong, and what it means
Nephrons cannot be regrown. From about the age of 40 the filtration rate falls on average by roughly 1 mL/min per year, though some people lose far less. The system has a large reserve: a person can live a normal life with one healthy kidney, because the remaining nephrons enlarge and filter more. That reserve is also why kidney disease is silent — symptoms usually appear only when most function has gone, which is why the [[kidney-tests|blood and urine tests]] matter.

> [!warn] Seek help urgently if you cannot pass urine and have a painful, swollen lower belly, if severe pain in the side or back comes with fever, shivering or vomiting, or if you pass very little urine and feel drowsy, confused or breathless — call your local emergency number. Visible blood in the urine, even once and without pain, should always be checked by a doctor.
`,
  ideas: [
    'Each kidney holds about a million nephrons: a filter (the glomerulus) followed by a long tube that adjusts what was filtered.',
    'The kidneys get 20–25 % of the cardiac output and filter about 180 L of plasma a day, returning all but 1–2 L.',
    'Two arterioles in series around the glomerulus let the kidney control the filtering pressure.',
    'The kidneys are also endocrine organs: renin, erythropoietin and active vitamin D.',
    'There is a large reserve, so kidney disease is silent until late — tests, not symptoms, find it early.'
  ],
  pitfalls: [
    'The kidneys just strain waste out of the blood — They filter almost everything small, then take back 99 % of it; the precision is in the reabsorption, not the filter.',
    'Kidneys are in the lower back, below the waist — They sit high, mostly under the lowest ribs; low back pain from muscles is far more common than kidney pain.',
    'Losing a kidney halves your kidney function for good — The remaining kidney enlarges and usually recovers to about two-thirds to three-quarters of the previous total.'
  ],
  formulas: [
    {
      name: 'Kidney share of the cardiac output',
      expr: 'RBF = f*CO', tex: '\\text{RBF} = f \\times \\text{CO}',
      vars: {
        RBF: { name: 'renal blood flow', q: 'flowrate', unit: 'L/min', tex: '\\text{RBF}' },
        f: { name: 'fraction of the cardiac output sent to the kidneys', q: 'ratio', unit: '%', value: 22, min: 1, max: 40 },
        CO: { name: 'cardiac output', q: 'flowrate', unit: 'L/min', value: 5, tex: '\\text{CO}' }
      },
      note: 'At rest the kidneys receive about 20–25 % of the cardiac output; during hard exercise or after heavy blood loss the share falls as blood is diverted.',
      stories: { RBF: 'A resting heart pumps {CO}, and the kidneys receive {f} of it. How much blood flows through them?' }
    },
    {
      name: 'Renal plasma flow',
      expr: 'RPF = RBF*(1 - Hct)', tex: '\\text{RPF} = \\text{RBF}\\,(1 - \\text{Hct})',
      vars: {
        RPF: { name: 'renal plasma flow', q: 'flowrate', unit: 'mL/min', tex: '\\text{RPF}' },
        RBF: { name: 'renal blood flow', q: 'flowrate', unit: 'L/min', value: 1.1, tex: '\\text{RBF}' },
        Hct: { name: 'haematocrit (share of blood that is red cells)', q: 'ratio', unit: '%', value: 45, min: 10, max: 70, tex: '\\text{Hct}' }
      },
      note: 'Only plasma can be filtered, so the red-cell share is taken out. Typical haematocrit: about 40–50 % in men, 36–46 % in women (ranges vary by laboratory).',
      stories: { RPF: 'Blood reaches the kidneys at {RBF} with a haematocrit of {Hct}. How much plasma flows through them?' }
    },
    {
      name: 'How many times a day the plasma is filtered',
      expr: 'n = GFR*t/Vp', tex: 'n = \\frac{\\text{GFR} \\times t}{V_p}',
      vars: {
        n: { name: 'number of times the plasma volume is filtered' },
        GFR: { name: 'glomerular filtration rate', q: 'flowrate', unit: 'mL/min', value: 125, min: 5, max: 180, tex: '\\text{GFR}' },
        t: { name: 'time', q: 'time', unit: 'day', value: 1 },
        Vp: { name: 'plasma volume', q: 'volume', unit: 'L', value: 3, tex: 'V_p' }
      },
      note: 'Plasma is about 4–5 % of body weight: roughly 3 L in a 70 kg adult.',
      stories: { n: 'Your kidneys filter {GFR} and you have {Vp} of plasma. How many times is the plasma filtered in {t}?' }
    }
  ],
  examples: [
    {
      title: 'Following the blood through the kidneys',
      q: 'A resting adult has a cardiac output of 5 L/min, 22 % of which goes to the kidneys; the haematocrit is 45 % and the GFR 125 mL/min. How much blood reaches the kidneys a day, how much plasma, and what fraction of the plasma is filtered?',
      steps: [
        'Renal blood flow: $0.22 \\times 5 = 1.1$ L/min, or $1.1 \\times 1440 = 1584$ L a day — over 1.5 tonnes of blood.',
        'Renal plasma flow: $1.1 \\times (1 - 0.45) = 0.605$ L/min $= 605$ mL/min.',
        'Filtration fraction: $125 / 605 = 0.21$, so about a fifth of the plasma is filtered on each pass.',
        'Per day: $125 \\times 1440 = 180{,}000$ mL $= 180$ L of filtrate.'
      ],
      a: 'About 1,600 L of blood and 870 L of plasma a day; about 21 % of the plasma — 180 L — is filtered.'
    },
    {
      title: 'Living with one kidney',
      q: 'A healthy 40-year-old gives a kidney to her brother. Before donation her GFR is 110 mL/min. What would you expect just after surgery, and a year later?',
      steps: [
        'Just after the operation she has half her nephrons, so her GFR is about $110 / 2 = 55$ mL/min, and her creatinine roughly doubles.',
        'Over the following weeks and months the remaining nephrons enlarge and each filters more (compensatory hyperfiltration).',
        'Typically the GFR settles at about two-thirds to three-quarters of the value before donation: here about 70–80 mL/min.',
        'Donors are carefully screened, and long-term studies show a small increase in their lifetime risk of kidney failure, with the absolute risk remaining low. Living donation is discussed in [[dialysis-transplant|Dialysis and transplantation]].'
      ],
      a: 'About 55 mL/min at first, recovering to roughly 70–80 mL/min.'
    }
  ],
  quiz: [
    { q: 'Where in the nephron is the blood actually filtered?', choices: ['in the glomerulus, into Bowman\'s capsule', 'in the loop of Henle', 'in the collecting duct', 'in the renal pelvis'], a: 0,
      why: 'The glomerular capillaries leak plasma into Bowman\'s capsule; everything downstream modifies that filtrate by taking substances back or adding them.' },
    { q: 'About what share of the heart\'s output goes to the two kidneys at rest?', choices: ['about 1 %', 'about 5 %', 'about 20–25 %', 'about 60 %'], a: 2,
      why: 'Roughly 1.1 L of the 5 L pumped each minute — an enormous flow for organs weighing about 300 g together, because they must process the plasma, not just feed themselves.' },
    { q: 'Which of these hormones is NOT made by the kidneys?', choices: ['renin', 'erythropoietin', 'the active form of vitamin D', 'insulin'], a: 3,
      why: 'Insulin comes from the pancreas. The kidneys make renin (blood pressure), erythropoietin (red cells) and calcitriol, the active vitamin D.' },
    { q: 'The GFR is 125 mL/min and the plasma volume 3 L. About how many times a day is the whole plasma filtered?', answer: 60,
      why: '125 mL/min × 1440 min = 180 L a day; 180 / 3 = 60.' },
    { q: 'Because the kidneys have a large reserve, early kidney disease usually causes obvious symptoms.', a: false,
      why: 'The opposite: the reserve hides the loss. Most people feel well until much of the function has gone, which is why blood and urine tests are used to find it.' }
  ],
  applications: ['Reading a kidney ultrasound or CT scan: size, cortex thickness, cysts and blockages.', 'Living kidney donation, which relies on the reserve of the remaining kidney.', 'Understanding why kidney disease causes anaemia, bone problems and high blood pressure.'],
  history: 'Marcello Malpighi described the tiny renal corpuscles in 1666; William Bowman showed in 1842 how the capsule surrounds the capillary tuft, and Jakob Henle described the loop that bears his name in 1862.',
  sim: 'kid-nephron'
},

{
  id: 'glomerular-filtration', parent: 'kidney-function', title: 'Filtration and GFR', level: 2,
  short: 'Blood pressure pushes plasma through the glomerular filter, while the proteins left behind pull water back. The glomerular filtration rate (GFR) — about 125 mL a minute in a young adult — is the best single measure of how well the kidneys work.',
  keywords: ['glomerular filtration rate', 'GFR', 'filtration barrier', 'podocytes', 'Starling forces', 'oncotic pressure', 'net filtration pressure', 'filtration fraction', 'clearance', 'inulin', 'autoregulation', 'tubuloglomerular feedback', 'afferent arteriole', 'efferent arteriole', 'albuminuria'],
  prereq: ['kidney-anatomy', 'physics:pressure', 'chemistry:osmotic-pressure', 'membrane-transport'],
  related: ['kidney-tests', 'tubular-function', 'chronic-kidney-disease', 'acute-kidney-injury', 'blood-pressure', 'hypertension', 'side-effects-interactions'],
  body: `
When a laboratory report says "eGFR 72", it is estimating one number: how many millilitres of blood plasma your kidneys filter each minute. In a healthy young adult it is about 125 mL — half a cup — every minute, day and night. Almost every decision about kidney health, from diagnosing disease to adjusting the dose of a medicine, starts from this rate.

### The filter
The glomerular capillaries are unusually leaky. Their wall has three layers: an inner lining full of windows (fenestrations), a dense basement membrane, and an outer layer of cells called **podocytes**, whose interlocking foot processes leave narrow slits bridged by a fine membrane. Water, salts, glucose, urea and creatinine pass freely. Albumin, the most abundant plasma protein, is only slightly smaller than the slits and carries a negative charge like the barrier, so almost none gets through; blood cells never do. Finding albumin or blood cells in the urine is therefore a sign that the filter is damaged.

### What pushes, what pulls
Filtration is driven by the balance of pressures across the wall — the same Starling forces that move fluid out of any capillary:

$$\\text{GFR} = K_f \\left(P_{GC} - P_{BS} - \\pi_{GC}\\right)$$

- $P_{GC}$, the blood pressure in the glomerular capillaries, about 55–60 mmHg — much higher than in ordinary capillaries, thanks to the efferent arteriole downstream;
- $P_{BS}$, the pressure of the fluid already in Bowman's space, about 15 mmHg, pushing back;
- $\\pi_{GC}$, the [[chemistry:osmotic-pressure|oncotic pressure]] of the plasma proteins, which pulls water back into the blood. It starts near 25 mmHg and climbs to about 37 mmHg along the capillary, because each millilitre filtered leaves the proteins more concentrated;
- $K_f$, the filtration coefficient: how much the whole filter passes per mmHg — about 12.5 mL/min per mmHg for both kidneys.

The net push is about 16 mmHg at the start of the capillary and fades to about 5 at the end: roughly 10 mmHg on average, which gives $12.5 \\times 10 = 125$ mL/min. Only about a fifth of the plasma flowing through is filtered — the **filtration fraction**, GFR divided by renal plasma flow.

### Holding it steady
Blood pressure swings through the day, yet the GFR hardly moves. Two mechanisms, together called **autoregulation**, see to it. The afferent arteriole contracts when stretched by a pressure rise (the myogenic response), and the **macula densa** — the stretch of distal tubule that touches its own glomerulus — senses how much salt is arriving and narrows the afferent arteriole when too much is being filtered (tubuloglomerular feedback). Between a mean arterial pressure of roughly 80 and 170 mmHg, the GFR stays nearly constant.

Hormones act on the two arterioles. **Angiotensin II** narrows mainly the efferent arteriole, which props up $P_{GC}$ when blood pressure falls; **prostaglandins** widen the afferent arteriole. When someone is dehydrated both are working hard to keep the kidneys filtering — which is why anti-inflammatory painkillers (which block prostaglandins) and ACE inhibitors or angiotensin receptor blockers (which undo angiotensin II) can, together with a diuretic, tip a dry person into [[acute-kidney-injury|acute kidney injury]]. The simulation shows this "triple whammy".

### Measuring it: clearance
The GFR cannot be seen directly, but it can be measured with a marker that is filtered freely and neither taken back nor added by the tubules — the plant sugar **inulin**, or today iohexol or a radioactive tracer. The **clearance** of a substance is the volume of plasma completely cleaned of it per minute:

$$C = \\frac{U \\times V}{P}$$

with $U$ and $P$ its concentrations in urine and plasma and $V$ the urine flow. For such a marker, clearance equals the GFR. A substance that is partly reabsorbed (urea, glucose) has a lower clearance; one that is also secreted (creatinine, a little; many drugs, a lot) has a higher one. In everyday practice the GFR is estimated from blood creatinine instead — see [[kidney-tests|Kidney function tests]] and [the kidney calculator](#/tools/clinical/kidney).

### When filtration goes wrong
A normal GFR is about 90–125 mL/min per 1.73 m² of body surface in young adults, falling slowly with age. Diseases of the glomeruli — diabetic kidney disease, high blood pressure, inflammation (glomerulonephritis) — either leak protein or scar the filter and lower the GFR; early in diabetes and obesity the GFR can even be abnormally high (hyperfiltration), which strains the nephrons.

> [!warn] Frothy urine that persists, puffiness around the eyes or swollen ankles, or urine the colour of cola can be signs of glomerular disease and need prompt medical assessment. If they come with breathlessness, very little urine, or severe headache and confusion, call your local emergency number.
`,
  ideas: [
    'The filter lets water and small molecules through and holds back cells and almost all protein.',
    'Net filtration pressure = capillary pressure − Bowman\'s space pressure − oncotic pressure: about 10 mmHg on average.',
    'GFR ≈ 125 mL/min (180 L/day) in young adults; about a fifth of the plasma flow is filtered.',
    'Autoregulation keeps the GFR steady over a wide range of blood pressures; angiotensin II and prostaglandins protect it when pressure falls.',
    'Clearance, U·V/P, is the plasma volume cleaned per minute; for a marker like inulin it equals the GFR.'
  ],
  pitfalls: [
    'A high blood pressure means a high GFR — Autoregulation keeps the GFR almost constant from about 80 to 170 mmHg; over years, high pressure damages the glomeruli and lowers it.',
    'Protein in the urine is normal after a big meal of protein — A healthy filter lets through very little albumin whatever you eat; persistent albuminuria is a marker of kidney damage (though fever, hard exercise and infection can raise it briefly).',
    'Clearance is an amount of substance removed — It is a volume of plasma per minute, as if that volume had been cleaned completely.'
  ],
  formulas: [
    {
      name: 'Glomerular filtration: the Starling forces',
      expr: 'GFR = Kf*(Pgc - Pbs - PIgc)', tex: '\\text{GFR} = K_f\\left(P_{GC} - P_{BS} - \\pi_{GC}\\right)',
      vars: {
        GFR: { name: 'glomerular filtration rate (mL/min)', tex: '\\text{GFR}' },
        Kf: { name: 'filtration coefficient (mL/min per mmHg)', value: 12.5, min: 6, max: 16, tex: 'K_f' },
        Pgc: { name: 'glomerular capillary pressure (mmHg)', value: 57, min: 45, max: 70, tex: 'P_{GC}' },
        Pbs: { name: 'pressure in Bowman\'s space (mmHg)', value: 15, min: 8, max: 30, tex: 'P_{BS}' },
        PIgc: { name: 'average oncotic pressure in the capillary (mmHg)', value: 32, min: 22, max: 40, tex: '\\pi_{GC}' }
      },
      note: 'Pressures in mmHg and the GFR in mL/min (entered as plain numbers). The oncotic pressure rises along the capillary, so an average is used; the oncotic pressure of the filtrate is taken as zero.',
      stories: {
        GFR: 'The glomerular capillary pressure is {Pgc} mmHg, the pressure in Bowman\'s space {Pbs} mmHg and the average oncotic pressure {PIgc} mmHg. With a filtration coefficient of {Kf} mL/min per mmHg, what is the GFR in mL/min?',
        Pbs: 'A stone blocks the ureter and the back-pressure rises. With a capillary pressure of {Pgc} mmHg, an oncotic pressure of {PIgc} mmHg and a filtration coefficient of {Kf} mL/min per mmHg, the GFR has fallen to {GFR} mL/min. What is the pressure in Bowman\'s space, in mmHg?'
      },
      practice: { unknowns: ['GFR', 'Pbs', 'Pgc'] }
    },
    {
      name: 'Filtration fraction',
      expr: 'FF = GFR/RPF', tex: '\\text{FF} = \\frac{\\text{GFR}}{\\text{RPF}}',
      vars: {
        FF: { name: 'filtration fraction', q: 'ratio', unit: '%', tex: '\\text{FF}' },
        GFR: { name: 'glomerular filtration rate', q: 'flowrate', unit: 'mL/min', value: 125, min: 5, max: 180, tex: '\\text{GFR}' },
        RPF: { name: 'renal plasma flow', q: 'flowrate', unit: 'mL/min', value: 625, tex: '\\text{RPF}' }
      },
      note: 'Normally about 20 %. It rises when the efferent arteriole narrows (angiotensin II), as in dehydration or heart failure.',
      stories: { FF: 'The GFR is {GFR} and the renal plasma flow {RPF}. What fraction of the plasma is filtered?' }
    },
    {
      name: 'Renal clearance',
      expr: 'C = U*V/P', tex: 'C = \\frac{U \\times V}{P}',
      vars: {
        C: { name: 'clearance (plasma volume cleaned per minute)', q: 'flowrate', unit: 'mL/min' },
        U: { name: 'concentration in the urine', q: 'massconc', unit: 'mg/dL', value: 2500 },
        V: { name: 'urine flow', q: 'flowrate', unit: 'mL/min', value: 1 },
        P: { name: 'concentration in the plasma', q: 'massconc', unit: 'mg/dL', value: 20 }
      },
      note: 'For a marker that is freely filtered and neither reabsorbed nor secreted (inulin, iohexol), the clearance equals the GFR. Clearance below the GFR means net reabsorption; above it, secretion.',
      stories: { C: 'During an inulin infusion the plasma contains {P} and the urine {U}, and urine flows at {V}. What is the clearance — and so the GFR?', V: 'A marker with a plasma level of {P} and a urine level of {U} has a clearance of {C}. How fast is urine being made?' }
    }
  ],
  examples: [
    {
      title: 'The forces across the filter',
      q: 'In a healthy glomerulus the capillary pressure is 57 mmHg, the pressure in Bowman\'s space 15 mmHg, and the oncotic pressure rises from 25 to 37 mmHg along the capillary (about 32 on average). With $K_f = 12.5$ mL/min per mmHg, estimate the GFR and the volume filtered in a day.',
      steps: [
        'Net pressure at the start: $57 - 15 - 25 = 17$ mmHg; at the end: $57 - 15 - 37 = 5$ mmHg.',
        'Using the average oncotic pressure: $57 - 15 - 32 = 10$ mmHg.',
        { text: 'GFR:', tex: '\\text{GFR} = 12.5 \\times 10 = 125\\ \\text{mL/min}' },
        'Per day: $125 \\times 1440 = 180{,}000$ mL, about 180 L.'
      ],
      a: 'About 125 mL/min, or 180 L a day.'
    },
    {
      title: 'Back-pressure from a blocked ureter',
      q: 'A stone partly blocks a ureter and the pressure in Bowman\'s space of that kidney rises from 15 to 20 mmHg. If nothing else changed, what would happen to that kidney\'s filtration?',
      steps: [
        'Net pressure before: $57 - 15 - 32 = 10$ mmHg; after: $57 - 20 - 32 = 5$ mmHg.',
        'The filtration rate is proportional to the net pressure, so it halves.',
        'A back-pressure of only 5 mmHg matters because the net push is small to begin with — a reason why a blocked kidney must not be left blocked for long.'
      ],
      a: 'Its filtration would roughly halve.'
    },
    {
      title: 'Measuring GFR by clearance',
      q: 'Inulin is infused to keep its plasma level at 20 mg/dL. Over 60 minutes a person makes 60 mL of urine containing 2500 mg/dL of inulin. What is the GFR? Glucose, filtered just as freely, has a clearance of zero in the same person — why?',
      steps: [
        'Urine flow: $60 / 60 = 1$ mL/min.',
        { text: 'Clearance:', tex: 'C = \\frac{2500 \\times 1}{20} = 125\\ \\text{mL/min}' },
        'Inulin is neither reabsorbed nor secreted, so its clearance is the GFR: 125 mL/min.',
        'Glucose is filtered at the same rate but the proximal tubule takes all of it back, so none reaches the urine and no plasma is "cleared" of it.'
      ],
      a: 'GFR = 125 mL/min; glucose clearance is zero because it is completely reabsorbed.'
    }
  ],
  quiz: [
    { q: 'Which of these is normally held back by the glomerular filter?', choices: ['glucose', 'sodium', 'urea', 'albumin'], a: 3,
      why: 'Albumin is too big and too negatively charged to pass the podocyte slits in any quantity; the other three are small and pass freely.' },
    { q: 'The efferent arteriole narrows (as angiotensin II makes it do). What happens to the pressure in the glomerular capillaries and to the filtration fraction?', choices: ['both rise', 'both fall', 'pressure rises, filtration fraction falls', 'neither changes'], a: 0,
      why: 'A resistance downstream of the capillary raises the pressure in it; more plasma is squeezed out of a smaller flow, so the fraction filtered rises.' },
    { q: 'A drug has a renal clearance of 400 mL/min while the GFR is 120 mL/min. This means the drug is…', choices: ['reabsorbed by the tubules', 'secreted by the tubules', 'not filtered at all', 'bound to albumin'], a: 1,
      why: 'Filtration alone can clean at most the GFR; anything above it must come from active secretion into the tubule.' },
    { q: 'The glomerular capillary pressure is 60 mmHg, Bowman\'s space pressure 18 mmHg and the average oncotic pressure 32 mmHg. What is the net filtration pressure?', answer: 10, unit: 'mmHg',
      why: '60 − 18 − 32 = 10 mmHg.' },
    { q: 'If mean arterial pressure rises from 90 to 140 mmHg in a healthy person, the GFR rises in proportion.', a: false,
      why: 'Autoregulation — the myogenic response and tubuloglomerular feedback — narrows the afferent arteriole and keeps the GFR nearly constant over roughly 80–170 mmHg.' }
  ],
  applications: ['Measured GFR (iohexol or isotope clearance) before donating a kidney or giving toxic chemotherapy.', 'Understanding why some combinations of blood-pressure medicines, diuretics and anti-inflammatory painkillers are risky in dehydration.', 'Explaining albumin in the urine as a sign of a leaking filter in diabetes and high blood pressure.'],
  history: 'Carl Ludwig proposed in 1844 that urine begins as a filtrate of plasma; in the 1930s Homer Smith and colleagues used inulin clearance to measure the human GFR and built modern renal physiology on it.',
  sim: 'kid-glomerulus'
},

{
  id: 'tubular-function', parent: 'kidney-function', title: 'Reabsorption and secretion', level: 2,
  short: 'Of the 180 litres filtered each day the tubules take back about 99 % — nearly all the water and salt and all the glucose — and add a few things the body wants rid of. Each segment has its own transporters and hormones, and each is the target of a family of medicines.',
  keywords: ['reabsorption', 'secretion', 'proximal tubule', 'loop of Henle', 'distal tubule', 'collecting duct', 'sodium', 'glucose', 'SGLT2', 'transport maximum', 'renal threshold', 'aldosterone', 'potassium', 'fractional excretion', 'FENa', 'diuretics', 'filtered load', 'glycosuria'],
  prereq: ['glomerular-filtration', 'membrane-transport', 'electrolytes'],
  related: ['urine-concentration', 'acid-base-balance', 'body-fluids', 'glucose-regulation', 'type2-diabetes', 'pharmacokinetics', 'hypertension', 'adrenal-stress'],
  body: `
Long before blood tests existed, physicians noticed that the urine of some very thirsty, very tired patients tasted sweet — the "honey-sweet" urine that gave diabetes mellitus its name. The sugar was there because the kidneys, which normally reclaim every molecule of glucose they filter, had been overwhelmed. That old observation is a window into the second, and larger, half of kidney work: taking back.

### The bookkeeping
Every day about 180 L of filtrate carries roughly 25,000 mmol of sodium (about 1.5 kg of salt), 160 g of glucose and a great deal of bicarbonate, potassium, calcium and amino acids into the tubules. The urine carries out perhaps 1.5 L of water, 100–200 mmol of sodium (whatever was eaten) and essentially no glucose. For every substance:

$$\\text{excreted} = \\text{filtered} - \\text{reabsorbed} + \\text{secreted}$$

where the **filtered load** is GFR × plasma concentration. A useful way to compare substances is the **fractional excretion** — the share of what was filtered that ends up in the urine: about 0.5–1 % for sodium, under 1 % for water, around 40–50 % for urea, zero for glucose, and a little over 100 % for creatinine, because some is secreted.

### Segment by segment
- **Proximal tubule** — the bulk handler. Its cells, covered in microvilli, take back about 65 % of the filtered sodium and water, all the glucose and amino acids, most of the bicarbonate and phosphate. Glucose rides in with sodium on the **SGLT2** transporter (and on SGLT1 further along). This segment also **secretes** organic acids and bases — many drugs among them, from penicillins to metformin — which is why kidney function matters for dosing.
- **Loop of Henle** — the descending limb lets water out; the thick ascending limb pumps out about 25 % of the sodium through the NKCC2 transporter but is sealed against water. This builds the salt gradient in the medulla ([[urine-concentration|Concentrating urine]]) and is where **loop diuretics** act.
- **Distal tubule** — takes back another 5–7 % of the sodium (through the NCC transporter, blocked by **thiazide diuretics**) and adjusts calcium under the control of parathyroid hormone.
- **Collecting duct** — the fine tuning. **Aldosterone** opens sodium channels (ENaC) and drives **potassium secretion**; ADH decides how much water is taken back; intercalated cells secrete acid to keep the blood's pH near 7.4 ([[acid-base-balance|Acid–base balance]]). Potassium-sparing diuretics act here.

Watch these fractions play out in the simulation: of 180 L entering, about 63 L leave the proximal tubule, 36 L leave the loop, and only a litre or two survives the collecting duct.

### The glucose ceiling
Glucose transporters have a maximum rate, the **transport maximum**, of roughly 2 mmol (about 360 mg) per minute for both kidneys. The filtered load of glucose is GFR × blood glucose, and because nephrons differ, the first ones saturate when blood glucose reaches about 10 mmol/L (180 mg/dL) — the **renal threshold**. Above it, glucose spills into the urine and pulls water with it (osmotic diuresis): hence the thirst, frequent urination and dehydration of uncontrolled diabetes. **SGLT2 inhibitors** use this on purpose: by blocking the main glucose transporter they make the kidneys pass tens of grams of glucose a day, lowering blood glucose, and trials show they also slow kidney disease and help in heart failure.

### What goes wrong
Faults in individual transporters cause rare inherited conditions (Bartter and Gitelman syndromes mimic loop and thiazide diuretics); a damaged proximal tubule leaks glucose, amino acids and phosphate together (Fanconi syndrome). Much more common is the loss of potassium balance in kidney failure or with medicines that block aldosterone's effects. A high potassium level can upset the heart's rhythm without warning.

> [!warn] Muscle weakness, a fluttering or irregular heartbeat, or fainting in someone with kidney disease, or someone taking medicines that raise potassium, can signal a dangerous potassium level — call your local emergency number.
`,
  ideas: [
    'Excreted = filtered − reabsorbed + secreted; the filtered load is GFR × plasma concentration.',
    'The proximal tubule takes back about 65 % of salt and water and all the glucose; the loop about 25 % of the salt; the distal tubule and collecting duct fine-tune the rest.',
    'Aldosterone saves sodium and excretes potassium; ADH saves water.',
    'Glucose reabsorption has a ceiling: above about 10 mmol/L (180 mg/dL) of blood glucose, glucose spills into the urine.',
    'Each segment is a target for a class of medicines: loop and thiazide diuretics, potassium-sparing diuretics, SGLT2 inhibitors.'
  ],
  pitfalls: [
    'Everything in the urine got there by filtration — Potassium, acid, some creatinine and many drugs are actively secreted by the tubules.',
    'Glucose in the urine means the kidneys are damaged — Usually it means blood glucose is above the renal threshold (or an SGLT2 inhibitor is being taken); the kidneys are doing exactly what their transporters allow.',
    'Drinking more water makes the kidneys flush out more salt — Water intake changes mainly the collecting duct\'s water handling; salt excretion follows salt intake.'
  ],
  formulas: [
    {
      name: 'Filtered load',
      expr: 'FL = GFR*Px*t', tex: '\\text{FL} = \\text{GFR} \\times P_x \\times t',
      vars: {
        FL: { name: 'amount filtered', q: 'amount', unit: 'mmol', tex: '\\text{FL}' },
        GFR: { name: 'glomerular filtration rate', q: 'flowrate', unit: 'mL/min', value: 125, min: 5, max: 180, tex: '\\text{GFR}' },
        Px: { name: 'plasma concentration of the substance', q: 'concentration', unit: 'mmol/L', value: 140, min: 120, max: 160, tex: 'P_x' },
        t: { name: 'time', q: 'time', unit: 'day', value: 1 }
      },
      note: 'For a freely filtered substance. Typical plasma levels: sodium 135–145 mmol/L, potassium 3.5–5.0 mmol/L, glucose (fasting) about 4–6 mmol/L (72–108 mg/dL); reference ranges vary by laboratory.',
      stories: { FL: 'The GFR is {GFR} and the plasma sodium {Px}. How much sodium is filtered in {t}?', Px: 'In {t} a person with a GFR of {GFR} filters {FL} of sodium. What is the plasma sodium?' }
    },
    {
      name: 'Fractional excretion',
      expr: 'FE = (Ux*Pcr)/(Px*Ucr)', tex: '\\text{FE}_x = \\frac{U_x \\, P_{Cr}}{P_x \\, U_{Cr}}',
      vars: {
        FE: { name: 'fractional excretion', q: 'ratio', unit: '%', tex: '\\text{FE}_x' },
        Ux: { name: 'urine concentration of the substance', q: 'concentration', unit: 'mmol/L', value: 60, min: 5, max: 200, tex: 'U_x' },
        Px: { name: 'plasma concentration of the substance', q: 'concentration', unit: 'mmol/L', value: 140, min: 120, max: 160, tex: 'P_x' },
        Pcr: { name: 'plasma creatinine', q: 'creatinine', unit: 'mg/dL', value: 1.0, min: 0.4, max: 10, tex: 'P_{Cr}' },
        Ucr: { name: 'urine creatinine', q: 'creatinine', unit: 'mg/dL', value: 120, min: 20, max: 300, tex: 'U_{Cr}' }
      },
      note: 'Creatinine stands in for the GFR, so a single urine sample is enough. For sodium (FENa), below about 1 % in someone with acute kidney injury suggests the kidneys are under-filled rather than damaged — but diuretics and chronic kidney disease blur this.',
      stories: { FE: 'A spot urine has sodium {Ux} and creatinine {Ucr}; the blood has sodium {Px} and creatinine {Pcr}. What is the fractional excretion of sodium?' }
    },
    {
      name: 'Share of the filtered water that becomes urine',
      expr: 'FEw = V/GFR', tex: '\\text{FE}_{w} = \\frac{V}{\\text{GFR}}',
      vars: {
        FEw: { name: 'fraction of filtered water excreted', q: 'ratio', unit: '%', tex: '\\text{FE}_{w}' },
        V: { name: 'urine flow', q: 'flowrate', unit: 'mL/min', value: 1 },
        GFR: { name: 'glomerular filtration rate', q: 'flowrate', unit: 'mL/min', value: 125, min: 5, max: 180, tex: '\\text{GFR}' }
      },
      note: 'Usually well under 1 %: more than 99 % of the filtered water is reabsorbed.',
      stories: { FEw: 'Urine is made at {V} while the GFR is {GFR}. What share of the filtered water is excreted?' }
    }
  ],
  examples: [
    {
      title: 'Salt bookkeeping',
      q: 'A person with a GFR of 125 mL/min and a plasma sodium of 140 mmol/L eats about 150 mmol of sodium a day (roughly 9 g of salt) and is in balance. How much sodium is filtered and what share is reabsorbed?',
      steps: [
        'Filtered volume: $125 \\times 1440 = 180$ L a day.',
        'Filtered sodium: $180 \\times 140 = 25{,}200$ mmol — at 58.4 mg per mmol of salt, about 1.5 kg of salt a day.',
        'In balance, excretion = intake = 150 mmol, so the fractional excretion is $150 / 25{,}200 = 0.6$ %.',
        'Reabsorbed: $100 - 0.6 = 99.4$ % — about 65 % in the proximal tubule, 25 % in the loop, and the last few per cent in the distal tubule and collecting duct.'
      ],
      a: 'About 25,200 mmol filtered a day; 99.4 % reabsorbed.'
    },
    {
      title: 'When glucose spills: a case',
      q: 'A 45-year-old man has been very thirsty and passing urine often for weeks. His blood glucose is 20 mmol/L (360 mg/dL) and his GFR 125 mL/min. Taking the glucose transport maximum as about 2 mmol/min, estimate how much glucose he loses in his urine each day, and explain his thirst.',
      steps: [
        'Filtered glucose: $0.125\\ \\text{L/min} \\times 20\\ \\text{mmol/L} = 2.5$ mmol/min.',
        'The tubules can take back at most about 2 mmol/min, so about $0.5$ mmol/min spills.',
        'Per day: $0.5 \\times 1440 = 720$ mmol, and at 180 mg per mmol about 130 g of glucose — more than 500 kcal lost in the urine.',
        'Each of those 720 mmol of glucose is an osmole that must be dissolved in water, so urine volume rises (osmotic diuresis); the water loss makes him thirsty and can dehydrate him. The real spill is a little larger, because some nephrons saturate earlier than average.'
      ],
      a: 'Roughly 130 g of glucose a day, dragging extra water with it — the cause of his thirst and frequent urination. He needs prompt medical assessment for diabetes.'
    }
  ],
  quiz: [
    { q: 'Where is most of the filtered sodium and water reabsorbed?', choices: ['proximal tubule', 'thick ascending limb', 'distal tubule', 'collecting duct'], a: 0,
      why: 'About two-thirds is reabsorbed in the proximal tubule; the loop takes about a quarter of the sodium, and the distal parts fine-tune the last few per cent.' },
    { q: 'A person taking an SGLT2 inhibitor has glucose in the urine although the blood glucose is normal. Why?', choices: ['the medicine damages the glomerular filter', 'the main glucose transporter of the proximal tubule is blocked, so less filtered glucose is taken back', 'the medicine raises blood glucose', 'the urine test is faulty'], a: 1,
      why: 'SGLT2 inhibitors block the sodium–glucose transporter that normally reclaims most filtered glucose, lowering the threshold so glucose spills even at normal levels.' },
    { q: 'Aldosterone acting on the collecting duct…', choices: ['saves sodium and excretes potassium', 'saves potassium and excretes sodium', 'makes the duct permeable to water', 'blocks glucose reabsorption'], a: 0,
      why: 'Aldosterone opens sodium channels and drives the Na⁺/K⁺ pump, so sodium is reabsorbed and potassium secreted. Water permeability is ADH\'s job.' },
    { q: 'With a GFR of 100 mL/min and a plasma glucose of 5 mmol/L, how many mmol of glucose are filtered in a day?', answer: 720, unit: 'mmol',
      why: '100 mL/min × 1440 min = 144 L; 144 L × 5 mmol/L = 720 mmol (about 130 g) — all of it normally reabsorbed.' },
    { q: 'Everything that appears in the urine got there by glomerular filtration.', a: false,
      why: 'The tubules also secrete — potassium, hydrogen ions, part of the creatinine and many drugs are added along the way.' }
  ],
  applications: ['How diuretics work, and why each class affects potassium differently.', 'SGLT2 inhibitors in diabetes, heart failure and chronic kidney disease.', 'The fractional excretion of sodium in judging acute kidney injury.', 'Adjusting doses of medicines that are secreted by the tubules.'],
  sim: { id: 'kid-nephron', params: { show: 'glu', glucose: 18 } }
},

{
  id: 'urine-concentration', parent: 'kidney-function', title: 'Concentrating urine', level: 3,
  short: 'The loop of Henle builds a salty gradient deep in the kidney, and the hormone ADH decides how much water the collecting duct takes back through it. Together they let urine range from four times more dilute than blood to four times more concentrated.',
  keywords: ['urine concentration', 'osmolality', 'countercurrent multiplier', 'loop of Henle', 'vasa recta', 'ADH', 'vasopressin', 'aquaporin', 'thirst', 'diabetes insipidus', 'AVP deficiency', 'free water clearance', 'hyponatraemia', 'SIADH', 'urea recycling', 'dehydration'],
  prereq: ['tubular-function', 'chemistry:osmotic-pressure', 'body-fluids', 'hormone-feedback'],
  related: ['electrolytes', 'kidney-anatomy', 'heat-cold', 'ageing', 'endocrine-system', 'chemistry:colligative-properties'],
  body: `
A hiker crossing a desert on a limited water supply passes only a little dark urine all day; a runner who has drunk several litres at a party makes pale urine every hour. Both are healthy kidneys doing their job, and the difference between them — urine four times more dilute than blood, or four times more concentrated — comes down to one hormone acting on one stretch of tubule, at the bottom of a clever piece of plumbing.

### The measure: osmolality
Concentration here means the number of dissolved particles per kilogram of water — the **osmolality**, in mOsm/kg. Blood plasma is held at about 285–295 mOsm/kg. Human urine can range from about 50 up to about 1200 mOsm/kg in young adults; the maximum falls with age, often to 700–800 in older people.

Because the daily load of solutes to be excreted — urea from protein, salts — is roughly fixed by diet (typically 600–900 mOsm), the urine volume follows from how concentrated it can be:

$$V = \\frac{\\text{solute load}}{U_{osm}}$$

At 600 mOsm a day and a maximum of 1200 mOsm/kg, at least 0.5 L of urine must be made; at the most dilute, 50 mOsm/kg, up to about 12 L can be passed.

### Building the gradient: the countercurrent multiplier
The thick ascending limb of the loop of Henle pumps salt out into the surrounding tissue but does not let water follow. On its own this can make a difference of only about 200 mOsm/kg across the tubule wall. But the loop is a hairpin: fluid flows down one limb and up the other, and the descending limb lets water out into the saltier tissue, so the fluid reaching the bend is already concentrated — and the pump there works from a higher starting point. Repeated along the length, the small difference is **multiplied** into a gradient from 300 mOsm/kg at the cortex to about 1200 at the tip of the papilla. Urea helps: under ADH it leaks out of the deepest collecting ducts and supplies roughly half of the inner medulla's osmolality. The blood vessels of the medulla, the **vasa recta**, are hairpins too, so they carry away water without washing the gradient out (countercurrent exchange).

Longer loops multiply more: desert rodents with very long loops make urine several times more concentrated than any human can.

### Using the gradient: ADH
The fluid that reaches the collecting duct is dilute, about 100 mOsm/kg. The duct runs down through the salty medulla, and whether water leaves it depends on **ADH** (antidiuretic hormone, also called vasopressin). Made in the hypothalamus and released from the posterior pituitary, ADH rises when plasma osmolality climbs above about 280–285 mOsm/kg — a change of only 1–2 % is enough — and also when blood volume or pressure falls sharply. It makes the duct cells insert **aquaporin-2** water channels, and water flows out into the medulla until the urine nearly matches it. Thirst, set by the same sensors, tops up what the kidneys cannot save. This is a textbook [[hormone-feedback|negative feedback loop]].

The **free-water clearance** measures the result: positive when the kidneys are getting rid of pure water (dilute urine), negative when they are keeping it.

### When it fails
- **Diabetes insipidus** — lots of dilute urine, day and night, with great thirst. Either too little ADH is made (after head injury, surgery or tumours near the pituitary) or the kidneys ignore it (inherited, or from lithium, high calcium or low potassium). In 2022 international societies proposed renaming these **AVP deficiency** and **AVP resistance**, partly to avoid confusion with diabetes mellitus.
- **Too much ADH** (the syndrome of inappropriate ADH, from some lung diseases, brain conditions and medicines) keeps water in and dilutes the blood's sodium.
- **Drinking far beyond what the kidneys can pass** — several litres in a few hours during a long race, or a very low-solute diet of mainly beer or tea — can dilute the blood too (hyponatraemia).
- **Older adults** concentrate less well and feel less thirst, so they dehydrate more easily in heat or illness. **Loop diuretics** wash the medullary gradient out.

> [!warn] Headache, nausea, vomiting, confusion, drowsiness or a seizure after drinking large amounts of water (for example during an endurance event), or in anyone with a very low sodium level, can be a medical emergency — call your local emergency number. So can signs of severe dehydration: very little or no urine for many hours, dizziness on standing, confusion, or a baby with few wet nappies who is floppy or unusually sleepy.
`,
  ideas: [
    'Urine osmolality ranges from about 50 to about 1200 mOsm/kg; plasma stays near 290.',
    'The loop of Henle multiplies a small pump difference into a large medullary gradient because fluid flows in opposite directions in its two limbs.',
    'ADH inserts aquaporin-2 channels in the collecting duct so water can leave into the salty medulla.',
    'The minimum urine volume = daily solute load ÷ maximum urine osmolality.',
    'Too little ADH action gives large volumes of dilute urine; too much water or ADH dilutes the blood\'s sodium.'
  ],
  pitfalls: [
    'Clear urine is always a sign of good health — It means you are passing more water than needed; drinking far beyond thirst adds nothing and, in extreme amounts, can lower blood sodium dangerously.',
    'ADH makes the kidneys pump water out of the urine — Water is never pumped; it follows the osmotic gradient built by salt and urea. ADH only opens the channels.',
    'Diabetes insipidus is a form of sugar diabetes — Both cause lots of urine, but diabetes insipidus involves ADH and the urine contains no glucose (hence its proposed new names, AVP deficiency and AVP resistance).'
  ],
  formulas: [
    {
      name: 'Urine volume from the solute load',
      expr: 'V = L/U', tex: 'V = \\frac{L}{U_{osm}}',
      vars: {
        V: { name: 'urine volume (L/day)' },
        L: { name: 'solutes to excrete (mOsm/day)', value: 600, min: 200, max: 1400, tex: 'L' },
        U: { name: 'urine osmolality (mOsm/kg)', value: 1200, min: 40, max: 1400, tex: 'U_{osm}' }
      },
      note: 'Plain numbers: L in mOsm a day, U in mOsm/kg (a kilogram of water is about a litre), V in litres a day. With the maximum osmolality this is the smallest volume that can carry the day\'s wastes; with the minimum (about 50) the largest.',
      stories: { V: 'A hiker\'s diet gives {L} mOsm of solutes a day and her kidneys can concentrate to {U} mOsm/kg. What is the least urine, in litres, she must pass each day?', U: 'Someone excretes {L} mOsm a day in {V} litres of urine. What is the urine osmolality in mOsm/kg?' }
    },
    {
      name: 'Free-water clearance',
      expr: 'CH2O = V*(1 - Uosm/Posm)', tex: 'C_{\\mathrm{H_2O}} = V\\left(1 - \\frac{U_{osm}}{P_{osm}}\\right)',
      vars: {
        CH2O: { name: 'free-water clearance', q: 'flowrate', unit: 'mL/min', signed: true, tex: 'C_{\\mathrm{H_2O}}' },
        V: { name: 'urine flow', q: 'flowrate', unit: 'mL/min', value: 1, min: 0.3, max: 15 },
        Uosm: { name: 'urine osmolality (mOsm/kg)', value: 600, min: 40, max: 1300, tex: 'U_{osm}' },
        Posm: { name: 'plasma osmolality (mOsm/kg)', value: 290, min: 260, max: 320, tex: 'P_{osm}' }
      },
      note: 'Positive: the kidneys are excreting pure water (dilute urine). Negative: they are keeping water (concentrated urine).',
      stories: { CH2O: 'Urine flows at {V} with an osmolality of {Uosm} mOsm/kg; the plasma is {Posm} mOsm/kg. What is the free-water clearance?' }
    },
    {
      name: 'Estimated plasma osmolality',
      expr: 'Posm = 2*Na + G + Ur', tex: 'P_{osm} \\approx 2 \\times \\text{Na} + \\text{Glu} + \\text{Urea}',
      vars: {
        Posm: { name: 'calculated plasma osmolality (mOsm/kg)', tex: 'P_{osm}' },
        Na: { name: 'plasma sodium', q: 'concentration', unit: 'mmol/L', value: 140, min: 120, max: 160, tex: '\\text{Na}' },
        G: { name: 'plasma glucose', q: 'glucose', unit: 'mmol/L', value: 5, min: 3, max: 40, tex: '\\text{Glu}' },
        Ur: { name: 'plasma urea', q: 'urea', unit: 'mmol/L', value: 5, min: 2, max: 40, tex: '\\text{Urea}' }
      },
      note: 'Sodium is doubled for its partner anions. In mg/dL units the same formula reads 2 Na + glucose/18 + BUN/2.8 — switch the units to see it. A measured osmolality well above the calculated one (an "osmolar gap") can point to a poison such as methanol.',
      stories: { Posm: 'A blood test shows sodium {Na}, glucose {G} and urea {Ur}. Estimate the plasma osmolality in mOsm/kg.' }
    }
  ],
  examples: [
    {
      title: 'The least urine a body can make',
      q: 'A young hiker eats a diet that gives 600 mOsm of solutes a day, and her kidneys can concentrate to 1200 mOsm/kg. Her 80-year-old grandfather, on the same diet, can reach only 800 mOsm/kg. What is the smallest daily urine volume for each?',
      steps: [
        'Hiker: $V = 600 / 1200 = 0.5$ L a day.',
        'Grandfather: $V = 600 / 800 = 0.75$ L a day.',
        'On top of this, both lose water through the skin and breath (roughly 0.5–1 L a day, far more in heat), which thirst must replace. His weaker thirst and lower concentrating ability are why older people dehydrate faster.'
      ],
      a: '0.5 L a day for the hiker, 0.75 L for her grandfather.'
    },
    {
      title: 'The "tea and toast" problem',
      q: 'An older woman lives mostly on tea and toast, so her diet supplies only about 250 mOsm of solutes a day. Her kidneys can dilute urine to 50 mOsm/kg. How much water can she excrete in a day, and what happens if she drinks 6 L of tea?',
      steps: [
        'Most dilute urine: $V = 250 / 50 = 5$ L a day at most.',
        'Drinking 6 L leaves about a litre a day that cannot be passed; it stays in the body water and dilutes the sodium.',
        'The fault is not in the kidneys but in the solute supply: without enough salts and urea to carry it, water cannot be excreted. The same happens with heavy beer drinking and little food.'
      ],
      a: 'At most about 5 L a day; drinking more lowers her blood sodium.'
    },
    {
      title: 'Keeping water: free-water clearance',
      q: 'A person makes urine at 1 mL/min with an osmolality of 600 mOsm/kg while the plasma is 290 mOsm/kg. What is the free-water clearance, and what does it mean over a day?',
      steps: [
        { text: 'Free-water clearance:', tex: 'C_{\\mathrm{H_2O}} = 1 \\times \\left(1 - \\frac{600}{290}\\right) = -1.07\\ \\text{mL/min}' },
        'Negative: compared with isotonic urine, about 1.07 mL of water per minute is kept in the body.',
        'Over a day: $1.07 \\times 1440 \\approx 1.5$ L of water saved by ADH.'
      ],
      a: 'About −1.07 mL/min: the kidneys are keeping roughly 1.5 L of water a day.'
    }
  ],
  quiz: [
    { q: 'How does ADH make urine more concentrated?', choices: ['it inserts water channels (aquaporin-2) in the collecting duct', 'it pumps water out of the tubule', 'it increases the GFR', 'it adds urea to the urine'], a: 0,
      why: 'With aquaporins in place, water flows passively out of the duct into the salty medulla. Water itself is never pumped.' },
    { q: 'Loop diuretics make it hard to concentrate urine because they…', choices: ['block ADH release', 'block the salt pump of the thick ascending limb, which builds the medullary gradient', 'damage the glomerulus', 'make the collecting duct impermeable to water'], a: 1,
      why: 'Without the thick ascending limb pumping salt out, the medulla loses its gradient, so even full ADH has little to draw water with.' },
    { q: 'The thick ascending limb of the loop of Henle is permeable to water.', a: false,
      why: 'It is sealed against water. That is the whole trick: salt leaves without water, making the tubular fluid dilute and the medulla salty.' },
    { q: 'Someone excretes 900 mOsm of solutes a day and can concentrate urine to 1200 mOsm/kg. What is the smallest daily urine volume, in litres?', answer: 0.75, unit: 'L',
      why: 'V = 900 / 1200 = 0.75 L. A high-protein or salty diet raises the solute load and so the minimum volume.' },
    { q: 'A person passes 8 L of very dilute urine a day and is constantly thirsty; blood glucose is normal. Which is the most likely group of causes?', choices: ['uncontrolled diabetes mellitus', 'too little ADH, or kidneys that ignore it (diabetes insipidus)', 'too much ADH', 'a kidney stone'], a: 1,
      why: 'Normal glucose rules out osmotic diuresis from diabetes mellitus. Large volumes of dilute urine point to failing ADH action — AVP deficiency or AVP resistance. Too much ADH would do the opposite.' }
  ],
  applications: ['Judging hydration from urine colour and specific gravity (roughly 1.001–1.035).', 'Diagnosing diabetes insipidus with a supervised water-deprivation or stimulation test.', 'Managing low blood sodium in hospital, where fluid choices depend on what the kidneys can excrete.', 'Safe drinking in endurance sport: drink to thirst rather than to a schedule.'],
  history: 'The idea that the loop of Henle works as a countercurrent multiplier was put forward by Werner Kuhn and colleagues around 1951, and soon supported by Heinrich Wirz\'s measurements of the medullary gradient.',
  sim: 'kid-countercurrent'
},

{
  id: 'kidney-tests', parent: 'kidney-function', title: 'Kidney function tests', level: 2,
  short: 'Kidney function is judged mainly from two tests: blood creatinine, turned into an estimated GFR (eGFR), and albumin in the urine. Creatinine rises only slowly at first as function falls, and depends on muscle mass, so it has to be read with care.',
  keywords: ['creatinine', 'eGFR', 'CKD-EPI', 'Cockcroft-Gault', 'creatinine clearance', 'cystatin C', 'urea', 'BUN', 'albumin-to-creatinine ratio', 'ACR', 'urine dipstick', 'proteinuria', 'haematuria', 'kidney ultrasound', 'kidney biopsy', 'muscle mass'],
  prereq: ['glomerular-filtration', 'tubular-function', 'lab-tests'],
  related: ['chronic-kidney-disease', 'acute-kidney-injury', 'diagnostic-accuracy', 'type2-diabetes', 'hypertension', 'pharmacokinetics', 'medical-imaging', 'math:hyperbola'],
  body: `
Two people get the same result on a routine blood test: creatinine 1.1 mg/dL (97 µmol/L), comfortably inside the laboratory's range. One is a muscular 35-year-old man, the other a slight 80-year-old woman. For him the result means normal kidney function; for her it means her kidneys filter about half as much as a young adult's. Understanding why is the key to reading kidney tests.

### Creatinine: a steady trickle from the muscles
**Creatinine** is a breakdown product of creatine in muscle, released at a fairly steady rate — roughly 20–25 mg per kg of body weight a day in men and 15–20 in women, more with more muscle. The kidneys remove it mainly by filtration, with a little tubular secretion. In a steady state, what comes out must equal what goes in:

$$P_{Cr} = \\frac{\\text{production}}{\\text{clearance}}$$

This is a [[math:hyperbola|hyperbola]]. Halve the GFR and creatinine doubles, but because the curve is flat at the top, early losses barely register: going from a GFR of 120 to 60 mL/min — half the function — may move creatinine only from about 0.8 to 1.6 mg/dL. Further down the same drop in GFR makes creatinine climb steeply. The simulation shows it as a bathtub: production is the tap, the kidneys the drain.

Creatinine is also raised by a large meat meal, creatine supplements and medicines that block its secretion (trimethoprim, for example) without any change in true GFR; it is low in people with little muscle — older people, amputees, people who are frail or malnourished — and in pregnancy, when the GFR rises by about half. After a sudden injury it takes days to catch up (see [[acute-kidney-injury|Acute kidney injury]]).

### From creatinine to eGFR
Equations correct creatinine for age and sex, the main predictors of muscle mass, and report an **estimated GFR** in mL/min per 1.73 m² (a standard body surface). The equation most widely recommended today is **CKD-EPI 2021**, which in the United States replaced an earlier version that included race; some European laboratories use the European Kidney Function Consortium (EKFC) equation instead, and children need their own formulas. Try your own numbers in [the kidney calculator](#/tools/clinical/kidney).

The older **Cockcroft–Gault** formula (1976) estimates creatinine clearance in mL/min from age, weight and creatinine, without the body-surface correction; many drug labels still quote doses by it.

**Cystatin C**, a small protein made by all cells, depends much less on muscle. International guidelines (KDIGO, 2024) suggest measuring it when a creatinine-based eGFR may be misleading, and combining the two for the most accurate estimate. When precision really matters, the GFR can be **measured** by the clearance of iohexol or a radioactive tracer.

**Urea** (reported in some countries as blood urea nitrogen, BUN) also rises when the GFR falls, but depends on protein intake, bleeding into the gut, steroid medicines and dehydration, so it is a poor measure of GFR on its own.

### The urine
- **Albumin-to-creatinine ratio (ACR)** on a single morning sample: dividing by creatinine cancels out how dilute the urine is. Under 30 mg/g (3 mg/mmol) is normal to mildly increased; 30–300 mg/g (3–30 mg/mmol) moderately increased; above 300 (30) severely increased. It is the earliest sign of kidney damage in diabetes and high blood pressure. Fever, hard exercise, infection and menstruation can raise it for a day or two, so an abnormal result is repeated.
- **Dipstick and microscopy**: blood, protein, glucose, signs of infection (leucocytes, nitrites) and casts — tiny moulds of the tubules that point to disease inside the kidney.
- **Imaging and biopsy**: an ultrasound shows kidney size, scarring, cysts and blockage; a biopsy — a needle sample — identifies the disease when the cause is unclear.

### What it means for you
One abnormal result is a question, not a diagnosis. Chronic kidney disease is defined by abnormal results that **last more than three months**, and is staged by both eGFR and ACR ([[chronic-kidney-disease|Chronic kidney disease]]). eGFR is least reliable at extremes of body size and muscle mass, in acute illness and in pregnancy. If you have diabetes or high blood pressure, ask whether both tests — eGFR and urine ACR — are checked regularly.
`,
  ideas: [
    'Creatinine comes from muscle at a steady rate; at steady state its level = production ÷ clearance, a hyperbola in GFR.',
    'Early loss of GFR raises creatinine only a little; the same creatinine means very different function in people with different muscle mass.',
    'eGFR equations (CKD-EPI 2021) correct creatinine for age and sex; cystatin C helps when muscle mass is unusual.',
    'The urine albumin-to-creatinine ratio detects kidney damage early; eGFR and ACR together stage kidney disease.',
    'A single abnormal result must be repeated: chronic kidney disease needs abnormalities lasting over three months.'
  ],
  pitfalls: [
    'A creatinine inside the reference range means normal kidney function — Not for people with little muscle: a "normal" 1.1 mg/dL in a slight 80-year-old woman corresponds to an eGFR of about 50.',
    'eGFR works during a sudden illness — The equations assume a steady state; in acute kidney injury creatinine lags behind the true GFR by days.',
    'Urea is as good a measure of kidney function as creatinine — Urea moves with protein intake, gut bleeding, steroids and hydration, so it is much less specific.'
  ],
  formulas: [
    {
      name: 'eGFR, CKD-EPI 2021 (women)',
      expr: 'eGFR = 142*min(scr/0.7, 1)^(-0.241)*max(scr/0.7, 1)^(-1.2)*0.9938^age*1.012',
      tex: '\\text{eGFR} = 142 \\times \\text{min}\\left(\\tfrac{S_{Cr}}{0.7}, 1\\right)^{-0.241} \\times \\text{max}\\left(\\tfrac{S_{Cr}}{0.7}, 1\\right)^{-1.2} \\times 0.9938^{\\,\\text{age}} \\times 1.012',
      vars: {
        eGFR: { name: 'estimated GFR', unit: 'mL/min/1.73 m²', tex: '\\text{eGFR}' },
        scr: { name: 'serum creatinine', q: 'creatinine', unit: 'mg/dL', value: 1.1, min: 0.4, max: 10, tex: 'S_{Cr}' },
        age: { name: 'age (years)', value: 80, min: 18, max: 100, int: true, tex: '\\text{age}' }
      },
      note: 'For adults, in a steady state, with creatinine measured by a standardised method. The creatinine unit can be switched to µmol/L. Men: see the next formula; both are in the kidney calculator.',
      stories: { eGFR: 'An {age}-year-old woman has a serum creatinine of {scr}. What is her eGFR, in mL/min/1.73 m²?', scr: 'What serum creatinine would give a {age}-year-old woman an eGFR of {eGFR}?' },
      practice: { unknowns: ['eGFR', 'scr'] }
    },
    {
      name: 'eGFR, CKD-EPI 2021 (men)',
      expr: 'eGFR = 142*min(scr/0.9, 1)^(-0.302)*max(scr/0.9, 1)^(-1.2)*0.9938^age',
      tex: '\\text{eGFR} = 142 \\times \\text{min}\\left(\\tfrac{S_{Cr}}{0.9}, 1\\right)^{-0.302} \\times \\text{max}\\left(\\tfrac{S_{Cr}}{0.9}, 1\\right)^{-1.2} \\times 0.9938^{\\,\\text{age}}',
      vars: {
        eGFR: { name: 'estimated GFR', unit: 'mL/min/1.73 m²', tex: '\\text{eGFR}' },
        scr: { name: 'serum creatinine', q: 'creatinine', unit: 'mg/dL', value: 1.1, min: 0.4, max: 10, tex: 'S_{Cr}' },
        age: { name: 'age (years)', value: 35, min: 18, max: 100, int: true, tex: '\\text{age}' }
      },
      note: 'The race-free 2021 equation. Less reliable at extremes of muscle mass, in acute illness, pregnancy and in children.',
      stories: { eGFR: 'A {age}-year-old man has a serum creatinine of {scr}. What is his eGFR, in mL/min/1.73 m²?', scr: 'What serum creatinine would give a {age}-year-old man an eGFR of {eGFR}?' },
      practice: { unknowns: ['eGFR', 'scr'] }
    },
    {
      name: 'Cockcroft–Gault creatinine clearance',
      expr: 'CrCl = (140 - age)*W/(72*scr)*s', tex: '\\text{CrCl} = \\frac{(140 - \\text{age}) \\times W}{72 \\times S_{Cr}} \\times s',
      vars: {
        CrCl: { name: 'estimated creatinine clearance (mL/min)', tex: '\\text{CrCl}' },
        age: { name: 'age (years)', value: 80, min: 18, max: 100, int: true, tex: '\\text{age}' },
        W: { name: 'body weight', q: 'mass', unit: 'kg', value: 50, min: 35, max: 150 },
        scr: { name: 'serum creatinine', q: 'creatinine', unit: 'mg/dL', value: 1.1, min: 0.4, max: 10, tex: 'S_{Cr}' },
        s: { name: 'sex factor (1 for men, 0.85 for women)', value: 0.85, fixed: true }
      },
      note: 'From 1976; not corrected for body surface. Still used on many drug labels for dose adjustment. Which weight to use in people with obesity is debated.',
      stories: { CrCl: 'A woman aged {age}, weighing {W}, has a serum creatinine of {scr}. What is her estimated creatinine clearance, in mL/min?' },
      practice: { unknowns: ['CrCl', 'scr'] }
    },
    {
      name: 'Steady-state creatinine',
      expr: 'Pcr = G/(14.4*GFR)', tex: 'P_{Cr} = \\frac{G}{14.4 \\times \\text{GFR}}',
      vars: {
        Pcr: { name: 'plasma creatinine', q: 'creatinine', unit: 'mg/dL', tex: 'P_{Cr}' },
        G: { name: 'creatinine made per day (mg/day)', value: 1500, min: 500, max: 2800, tex: 'G' },
        GFR: { name: 'clearance of creatinine (mL/min)', value: 100, min: 5, max: 160, tex: '\\text{GFR}' }
      },
      note: '14.4 turns mL/min into decilitres a day (1440 minutes ÷ 100 mL per dL). Tubular secretion makes the true clearance a little higher than the GFR, so real levels run a little lower. G is about 20–25 mg/kg a day in men, 15–20 in women.',
      stories: { Pcr: 'A man\'s muscles make {G} mg of creatinine a day and his kidneys clear {GFR} mL/min. What is his steady-state creatinine?', GFR: 'Someone makes {G} mg of creatinine a day, and the blood level is steady at {Pcr}. What is the creatinine clearance in mL/min?' },
      practice: { unknowns: ['Pcr', 'GFR'] }
    }
  ],
  examples: [
    {
      title: 'Same creatinine, different kidneys',
      q: 'Two people have a serum creatinine of 1.1 mg/dL (97 µmol/L): a 35-year-old man and an 80-year-old woman who weighs 50 kg. Estimate the kidney function of each.',
      steps: [
        'Man, CKD-EPI 2021: creatinine is above 0.9, so $\\text{eGFR} = 142 \\times (1.1/0.9)^{-1.2} \\times 0.9938^{35} \\approx 90$ mL/min/1.73 m².',
        'Woman, CKD-EPI 2021: $142 \\times (1.1/0.7)^{-1.2} \\times 0.9938^{80} \\times 1.012 \\approx 51$ mL/min/1.73 m².',
        'Woman, Cockcroft–Gault: $(140 - 80) \\times 50 / (72 \\times 1.1) \\times 0.85 \\approx 32$ mL/min — lower still, because she is small and the formula is not corrected for body size.',
        'Same number, very different meaning: her low muscle mass makes little creatinine, so a "normal" level hides reduced function. Medicines cleared by the kidneys may need lower doses for her.'
      ],
      a: 'About 90 for him; about 51 (eGFR) or 32 mL/min (Cockcroft–Gault) for her.'
    },
    {
      title: 'Walking down the hyperbola',
      q: 'A man makes 1500 mg of creatinine a day. Ignoring tubular secretion, find his steady-state creatinine at GFRs of 120, 60, 30 and 15 mL/min.',
      steps: [
        { text: 'Use the steady-state formula:', tex: 'P_{Cr} = \\frac{1500}{14.4 \\times \\text{GFR}}' },
        'GFR 120: 0.87 mg/dL; GFR 60: 1.74; GFR 30: 3.47; GFR 15: 6.94 mg/dL (77, 154, 307 and 614 µmol/L).',
        'The first half of the kidney function lost adds under 0.9 mg/dL; the next quarter adds 1.7, and the next eighth 3.5.',
        'This is why a small rise in creatinine early on deserves attention, and why eGFR, not creatinine itself, is used to follow kidney function.'
      ],
      a: '0.87, 1.74, 3.47 and 6.94 mg/dL: each halving of GFR doubles creatinine.'
    }
  ],
  quiz: [
    { q: 'An 82-year-old woman with little muscle has a creatinine of 1.0 mg/dL, inside the laboratory range. What is the best conclusion?', choices: ['her kidney function is certainly normal', 'her kidney function may be reduced: little muscle makes little creatinine', 'her creatinine must be a laboratory error', 'her kidney function is better than a young man\'s with the same creatinine'], a: 1,
      why: 'Creatinine reflects muscle mass as well as filtration. For her, CKD-EPI 2021 gives an eGFR of about 56 — reduced — even with a "normal" creatinine.' },
    { q: 'In steady state, if the GFR halves, the blood creatinine roughly…', choices: ['stays the same', 'rises by 10 %', 'doubles', 'quadruples'], a: 2,
      why: 'Creatinine = production ÷ clearance: halving the clearance doubles the level. That makes the curve a hyperbola.' },
    { q: 'Why is cystatin C useful alongside creatinine?', choices: ['it is cheaper', 'it depends much less on muscle mass', 'it measures albumin in the urine', 'it is unaffected by kidney function'], a: 1,
      why: 'Cystatin C is made by all nucleated cells at a fairly steady rate, so it helps when muscle mass is unusually high or low.' },
    { q: 'A creatinine of 2.0 mg/dL is how many µmol/L? (1 mg/dL = 88.4 µmol/L)', answer: 177, unit: 'µmol/L',
      why: '2.0 × 88.4 = 176.8, about 177 µmol/L.' },
    { q: 'A single eGFR of 55 mL/min/1.73 m² is enough to diagnose chronic kidney disease.', a: false,
      why: 'CKD requires the abnormality to last more than three months; a single low value could reflect dehydration, an acute illness, a meat meal or a medicine.' }
  ],
  applications: ['Routine blood and urine checks for people with diabetes or high blood pressure.', 'Adjusting doses of medicines cleared by the kidneys.', 'Deciding when to prepare for dialysis or a transplant.', 'Checking kidney function before a contrast scan or chemotherapy.'],
  history: 'Donald Cockcroft and Henry Gault published their bedside formula in 1976; the MDRD equation (1999) introduced routine eGFR reporting, followed by CKD-EPI (2009) and its race-free revision in 2021.',
  sim: 'kid-creatinine'
}

);
