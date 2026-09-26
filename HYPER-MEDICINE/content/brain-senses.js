/* HYPER-MEDICINE · content/brain-senses.js — Brain and Nerves: the brain and the senses.
 * The nervous system, the brain's regions, vision, hearing and balance, sleep and pain.
 * Simulations: sims/neuro.js (neu-reflex, neu-eeg, neu-eye, neu-audiogram, neu-hypnogram). */
Hyper.add(

{
  id: 'nervous-system-organization', parent: 'brain-senses', title: 'The nervous system', level: 1,
  short: 'How the wiring is laid out: the brain and spinal cord at the centre, the nerves that run to every part of the body, and the automatic (autonomic) nerves that run the heart, gut and glands without our noticing.',
  keywords: ['central nervous system', 'peripheral nervous system', 'spinal cord', 'spinal nerves', 'cranial nerves', 'autonomic nervous system', 'sympathetic', 'parasympathetic', 'vagus nerve', 'fight or flight', 'reflex arc', 'cerebrospinal fluid', 'meninges', 'blood–brain barrier', 'dermatome', 'spinal cord injury', 'cauda equina'],
  prereq: ['neurons', 'synapses', 'tissue-types'],
  related: ['brain-regions', 'pain', 'adrenal-stress', 'vital-signs', 'injuries-fractures', 'endocrine-system'],
  body: `
A cyclist comes off her bike and lands on her back. She is conscious and talking, but cannot feel or move her legs. Nothing is wrong with the legs themselves, or with the brain: the damage is to a cable in between, the spinal cord, which carries every message between the brain and the lower body. Where that cable is injured decides what is lost — which is why doctors test sensation and strength level by level, from the neck down.

### Central and peripheral
The **central nervous system** is the brain and the spinal cord. The **peripheral nervous system** is everything else: 12 pairs of **cranial nerves** leaving the brain (for smell, sight, eye movements, the face, hearing and balance, swallowing, and the vagus nerve to the chest and abdomen) and 31 pairs of **spinal nerves** leaving the cord between the vertebrae — 8 in the neck, 12 in the chest, 5 lumbar, 5 sacral and 1 coccygeal. Each spinal nerve carries sensation from one band of skin, a **dermatome** — the reason shingles, a reactivated virus living in one nerve root, appears as a stripe on one side of the body.

The spinal cord is only about 45 cm long in an adult. It ends near the first or second lumbar vertebra, and below that a bundle of nerve roots (the cauda equina, "horse's tail") hangs in fluid. That is why a lumbar puncture, which draws spinal fluid through a needle, is done lower down, between the third and fifth lumbar vertebrae: the needle slips between floating roots rather than into the cord.

### Protection
The brain and cord float in about 150 mL of **cerebrospinal fluid**, wrapped in three membranes (the meninges — their infection is meningitis) inside the skull and spine. The fluid is made continuously, about half a litre a day, so it is replaced three or four times daily. The **blood–brain barrier** — tightly sealed capillary walls — keeps many substances and most microbes out, and also keeps out many medicines.

### Voluntary and automatic
The **somatic** nerves serve the muscles we control and the senses we are aware of. The **autonomic** nerves run the body's machinery unconsciously, with two opposing branches:

| | Sympathetic ("fight or flight") | Parasympathetic ("rest and digest") |
|---|---|---|
| Heart | faster and stronger | slower |
| Airways | widen | narrow |
| Pupils | widen | narrow |
| Gut and bladder | slowed | active |
| Blood vessels to muscles and skin | redistributed to muscles | — |
| Main transmitter at the organ | noradrenaline (and adrenaline from the adrenal glands) | acetylcholine |

At rest the parasympathetic vagus nerve keeps a brake on the heart: with all autonomic input blocked, the heart of a young adult would beat about 100 times a minute. The gut also has its own **enteric nervous system**, with hundreds of millions of neurons.

### Reflexes
The simplest circuit is the **reflex arc**: sensor, sensory nerve, spinal cord, motor nerve, muscle. The knee jerk and pulling a hand from a flame are handled in the cord in tens of milliseconds, before the brain even knows. Doctors test reflexes because they reveal where a problem lies: absent reflexes point to the nerves; brisk ones with weakness point to the brain or spinal cord.

### What goes wrong
- **Spinal cord injury** — WHO estimates 250 000 to 500 000 new cases worldwide each year (2013), mostly from road crashes, falls and violence. Injury in the neck can affect all four limbs and breathing; lower down, the legs, bladder and bowel.
- **Cauda equina syndrome** — compression of the nerve roots below the cord, usually by a large disc bulge.
- **Autonomic failure** — dizziness or fainting on standing, as in some people with diabetes or Parkinson's disease. Ordinary fainting (vasovagal syncope) is an over-strong parasympathetic reflex.

> [!warn] After a fall or crash, if someone has neck or back pain, numbness, tingling or weakness, **do not move them** unless they are in danger; keep the head and neck still and call your local emergency number. Back pain with numbness around the genitals or buttocks, new difficulty passing urine or controlling the bowels, or weakness in both legs can be cauda equina syndrome — an emergency: call your local emergency number or go to an emergency department at once.
`,
  ideas: [
    'The brain and spinal cord form the central nervous system; 12 pairs of cranial and 31 pairs of spinal nerves connect it to the body.',
    'The spinal cord ends near the first or second lumbar vertebra, which is why a lumbar puncture is done lower down.',
    'The autonomic nerves run the organs automatically: sympathetic for action, parasympathetic for rest.',
    'Reflexes are handled in the spinal cord, and testing them shows where a problem lies.',
    'Cerebrospinal fluid (about 150 mL, made at about 500 mL a day) cushions the brain; the blood–brain barrier guards it.'
  ],
  pitfalls: [
    'The spinal cord runs the whole length of the spine — It ends near the first or second lumbar vertebra; below that are floating nerve roots.',
    'The "fight or flight" system is only for emergencies — Sympathetic and parasympathetic nerves are both active all the time, adjusting heart rate, blood pressure and digestion from moment to moment.',
    'A reflex needs the brain — The knee jerk and withdrawal from pain are organised in the spinal cord; the brain learns about them afterwards.'
  ],
  formulas: [
    {
      name: 'How often the spinal fluid is renewed',
      expr: 'n = Q*t/Vc', tex: 'n = \\frac{Q\\,t}{V_\\text{CSF}}',
      vars: {
        n: { name: 'number of complete renewals' },
        Q: { name: 'rate of production of cerebrospinal fluid', q: 'flowrate', unit: 'mL/min', value: 0.35 },
        t: { name: 'time', q: 'time', unit: 'day', value: 1 },
        Vc: { name: 'total volume of cerebrospinal fluid', q: 'volume', unit: 'mL', value: 150, tex: 'V_\\text{CSF}' }
      },
      note: 'Typical adult values: about 150 mL of fluid, produced at about 0.35 mL/min (500 mL a day), mostly by the choroid plexus in the ventricles. If its drainage is blocked, the fluid builds up (hydrocephalus).',
      practice: { unknowns: ['n', 'Q'] },
      stories: { n: 'Cerebrospinal fluid is made at {Q} and the total volume is {Vc}. How many times is it renewed in {t}?' }
    },
    {
      name: 'The heart rate without autonomic control',
      expr: 'IHR = a - b*age', tex: '\\text{IHR} = a - b \\cdot \\text{age}',
      vars: {
        IHR: { name: 'intrinsic heart rate (beats per minute)', tex: '\\text{IHR}' },
        a: { name: 'intercept (beats per minute)', value: 118.1, fixed: true },
        b: { name: 'fall per year of age (beats per minute)', value: 0.57, fixed: true },
        age: { name: 'age (years)', value: 40, tex: '\\text{age}' }
      },
      note: 'Jose and Collison (1970) measured the heart rate after blocking both autonomic branches with medicines. It is higher than the usual resting rate, showing that at rest the parasympathetic vagus nerve holds the heart back. An average for a population; individuals differ.',
      stories: { IHR: 'What would the heart rate of a {age}-year-old be with all autonomic nerve input blocked?' }
    }
  ],
  examples: [
    {
      title: 'Why the lumbar puncture is done low',
      q: 'A doctor needs a sample of spinal fluid to look for meningitis. Why is the needle placed between the third and fourth (or fourth and fifth) lumbar vertebrae?',
      steps: [
        'In adults the spinal cord ends at about the first or second lumbar vertebra.',
        'Below that the spinal canal holds only fluid and loose nerve roots, which float away from a fine needle.',
        'The fluid there is continuous with the fluid around the brain, so a sample reflects what is happening in the meninges.'
      ],
      a: 'Because below about L2 there is no spinal cord to injure, but the same fluid can be sampled.'
    },
    {
      title: 'The vagal brake',
      q: 'A healthy 40-year-old has a resting heart rate of 64 per minute. Estimate the intrinsic heart rate and explain the difference.',
      steps: [
        'Intrinsic heart rate $= 118.1 - 0.57 \\times 40 = 95$ beats per minute.',
        'The resting rate is about 30 beats lower.',
        'The difference is the parasympathetic tone: the vagus nerve, releasing acetylcholine on the heart\'s pacemaker, slows it continuously at rest. Fit people have a strong vagal tone and a low resting rate.'
      ],
      a: 'About 95 per minute; the vagus nerve holds the resting rate about 30 beats lower.'
    }
  ],
  quiz: [
    { q: 'A frightened person\'s pupils widen, heart races and mouth goes dry. Which system is responsible?', choices: ['The sympathetic nervous system', 'The parasympathetic nervous system', 'The somatic nervous system', 'The enteric nervous system'], a: 0,
      why: 'Fight or flight is sympathetic: noradrenaline and adrenaline widen the pupils, speed the heart and reduce saliva and digestion.' },
    { q: 'The knee-jerk reflex still works in a person whose spinal cord was injured in the upper back, above the level of the knee reflex.', a: true,
      why: 'The reflex arc passes through the lumbar spinal cord below the injury; it stays intact (often brisker than normal), even though the person cannot feel the tap or move the leg at will.' },
    { q: 'At a production rate of 0.35 mL per minute, how many hours does it take to make 150 mL of cerebrospinal fluid?', answer: 7.1, unit: 'h',
      why: '150/0.35 = 429 minutes, about 7.1 hours — so the fluid is renewed three to four times a day.' },
    { q: 'Shingles appears as a painful stripe on one side of the chest because…', choices: ['the virus lives in one spinal nerve root, which serves one band of skin', 'the virus spreads along the ribs', 'the immune system attacks one side only', 'the chest skin is thinner'], a: 0,
      why: 'Each spinal nerve root carries sensation from one dermatome; the reactivated virus travels down that root to its band of skin.' },
    { q: 'After a crash a person has neck pain and tingling in the arms. What should bystanders do?', choices: ['Keep them still, support the head and call the emergency number', 'Help them walk to a car and drive to hospital', 'Sit them up to check their breathing', 'Turn the head gently to test the neck'], a: 0,
      why: 'A possible spinal injury should not be moved unless there is immediate danger (fire, traffic, not breathing); movement can damage the cord.' }
  ],
  applications: ['Neurological examination: testing sensation by dermatome, strength and reflexes to locate a problem.', 'Lumbar puncture and spinal anaesthesia, placed below the end of the spinal cord.', 'Understanding fainting, blood-pressure drops on standing and the effects of medicines on the autonomic nerves.', 'First aid for suspected spinal injury.'],
  sim: 'neu-reflex'
},

{
  id: 'brain-regions', parent: 'brain-senses', title: 'The brain', level: 1,
  short: 'A 1.4 kg organ using a fifth of the body\'s energy: the cerebral hemispheres with their four lobes, the deep centres for memory, emotion and hormones, the cerebellum for coordination and the brainstem that keeps us breathing.',
  keywords: ['brain', 'cerebrum', 'cerebral cortex', 'frontal lobe', 'parietal lobe', 'temporal lobe', 'occipital lobe', 'cerebellum', 'brainstem', 'hippocampus', 'amygdala', 'hypothalamus', 'thalamus', 'basal ganglia', 'Broca', 'Wernicke', 'hemisphere', 'cerebral blood flow', 'intracranial pressure', 'plasticity'],
  prereq: ['nervous-system-organization', 'neurons', 'blood-vessels'],
  related: ['stroke', 'epilepsy', 'dementia', 'parkinsons', 'sleep', 'medical-imaging', 'injuries-fractures', 'hormone-feedback'],
  body: `
After a stroke, a retired teacher understands every word her family says but can produce only halting fragments — "want… tea… no…". Her friend in the next bed had a stroke of the same size in a different place: he speaks fluently, but his sentences make little sense and he does not seem to notice. Where damage falls in the brain decides what is lost, and cases like theirs, studied since the 1860s, drew the first map of it.

### The big parts
- **The cerebrum** — the two cerebral hemispheres, joined by a thick bridge of fibres (the corpus callosum). Their wrinkled surface, the **cortex**, is a sheet of grey matter 2–4 mm thick; underneath, white matter carries the connections. Each hemisphere mainly controls and feels the **opposite** side of the body, because the main motor and sensory pathways cross over in the brainstem and spinal cord.
- **The cerebellum** — at the back, under the hemispheres: it smooths and times movement, keeps balance and helps learn skills. Surprisingly it holds about 80 % of the brain's neurons. Alcohol affects it early — hence the stagger.
- **The brainstem** — midbrain, pons and medulla, joining the brain to the spinal cord. It controls breathing, heart rate, blood pressure, swallowing and wakefulness, and houses most cranial nerve centres. Damage here is life-threatening.

### The four lobes
| Lobe | Main jobs | Damage can cause |
|---|---|---|
| Frontal | movement (the motor strip); planning, judgement, attention, personality; speech production (Broca's area, usually on the left) | weakness on the other side; changes in behaviour; halting, effortful speech |
| Parietal | touch and body sense (the sensory strip); where things are in space | numbness on the other side; ignoring one side of space (neglect), especially after right-sided damage |
| Temporal | hearing; understanding language (Wernicke's area, usually on the left); memory; recognising faces | fluent speech that makes little sense; memory problems |
| Occipital | vision | loss of half the field of view in both eyes |

Language sits in the left hemisphere in about 95 % of right-handed people and most left-handed people.

### Deeper structures
The **thalamus** relays almost all sensation to the cortex. The **hypothalamus**, the size of an almond, runs body temperature, hunger, thirst, the daily rhythm and, through the pituitary gland, most hormones ([[hormone-feedback]]). The **limbic system** handles emotion and memory: the **amygdala** detects threat, the **hippocampus** turns experiences into lasting memories — and is among the first areas damaged in Alzheimer's disease ([[dementia]]). The **basal ganglia** select and start movements; their failure causes [[parkinsons|Parkinson's disease]].

### Hungry and fragile
The brain is about 2 % of body weight but takes about 15 % of the heart's output — some 700 mL of blood a minute — and about 20 % of the oxygen and energy used at rest, roughly 15–20 watts. It has almost no reserves: consciousness is lost within about ten seconds of the blood supply stopping, and brain cells begin to die after a few minutes, which is why [[cpr|CPR]] must start at once and why a [[stroke|stroke]] is an emergency. Inside the rigid skull, swelling or bleeding raises the pressure and squeezes the blood supply:

$$\\text{CPP} = \\text{MAP} - \\text{ICP}$$

the perfusion pressure is the mean arterial pressure minus the intracranial pressure (normally 5–15 mmHg in adults).

### Myths and plasticity
We do not use only 10 % of our brains — imaging shows activity everywhere, and damage anywhere has effects. Nor are people "left-brained" or "right-brained" in personality; the hemispheres specialise in some skills but work together. What is true is **plasticity**: connections strengthen with use and other areas can take over lost functions, which is what rehabilitation after a stroke or injury builds on — most in the first months, but continuing for years.

> [!warn] After a head injury, a worsening headache, repeated vomiting, drowsiness, confusion, a seizure, unequal pupils, weakness or clear fluid from the nose or ears are signs of bleeding or swelling inside the skull: call your local emergency number. Sudden face drooping, arm weakness or speech trouble may be a stroke: call your local emergency number and note the time it started.
`,
  ideas: [
    'Each cerebral hemisphere controls and feels the opposite side of the body.',
    'The frontal lobe plans and moves, the parietal feels and locates, the temporal hears, understands and remembers, the occipital sees.',
    'The cerebellum coordinates movement and the brainstem keeps breathing, heartbeat and wakefulness going.',
    'The brain takes about 15 % of the blood flow and 20 % of the energy at rest and has almost no reserve.',
    'Perfusion pressure = mean arterial pressure − intracranial pressure: swelling inside the skull starves the brain of blood.'
  ],
  pitfalls: [
    'We use only 10 % of our brain — Imaging shows activity throughout the brain, and damage to any part has effects.',
    'People are left-brained (logical) or right-brained (creative) — The hemispheres specialise in some functions, such as language on the left, but personality does not come from one side.',
    'An injured brain cannot recover — Lost neurons are not replaced, but surviving circuits reorganise; rehabilitation can bring large improvements for months and years.'
  ],
  formulas: [
    {
      name: 'Cerebral perfusion pressure',
      expr: 'CPP = MAP - ICP', tex: '\\text{CPP} = \\text{MAP} - \\text{ICP}',
      vars: {
        CPP: { name: 'cerebral perfusion pressure', q: 'pressure', unit: 'mmHg', signed: true, tex: '\\text{CPP}' },
        MAP: { name: 'mean arterial pressure', q: 'pressure', unit: 'mmHg', value: 90, tex: '\\text{MAP}' },
        ICP: { name: 'intracranial pressure', q: 'pressure', unit: 'mmHg', value: 10, tex: '\\text{ICP}' }
      },
      note: 'The pressure that pushes blood through the brain. In severe head injury, intensive-care teams typically aim to keep it at about 60–70 mmHg (the Brain Trauma Foundation guideline, 2016) and the intracranial pressure below about 22 mmHg.',
      practice: { unknowns: ['CPP', 'ICP'] },
      stories: { CPP: 'After a head injury a patient\'s mean arterial pressure is {MAP} and the pressure inside the skull {ICP}. What is the cerebral perfusion pressure?', ICP: 'The mean arterial pressure is {MAP} and the perfusion pressure has fallen to {CPP}. What is the intracranial pressure?' }
    },
    {
      name: 'Total blood flow to the brain',
      expr: 'Q = f*m/100', tex: 'Q = \\frac{f \\, m}{100}',
      vars: {
        Q: { name: 'total brain blood flow (mL/min)' },
        f: { name: 'blood flow per 100 g of brain (mL/100 g/min)', value: 50 },
        m: { name: 'brain mass (g)', value: 1400 }
      },
      note: 'About 50 mL per 100 g per minute on average — higher in grey matter, lower in white matter. Below about 20 the brain stops working normally; below about 10 cells start to die within minutes, the situation at the core of a stroke.',
      stories: { Q: 'A brain of {m} receives {f}. What is the total blood flow?' }
    },
    {
      name: 'The brain\'s share of the energy budget',
      expr: 'P = s*BMR', tex: 'P = s \\cdot \\text{BMR}',
      vars: {
        P: { name: 'power used by the brain', q: 'power', unit: 'W' },
        s: { name: 'brain\'s share of resting energy use', q: 'ratio', unit: '%', value: 20 },
        BMR: { name: 'basal metabolic rate', q: 'power', unit: 'kcal/day', value: 1500, tex: '\\text{BMR}' }
      },
      note: 'Switch the units to see the same power in kcal a day or watts. The brain\'s share is higher in children — about half of all resting energy in early childhood.',
      stories: { P: 'An adult\'s basal metabolic rate is {BMR} and the brain uses {s} of it. How much power is that?' }
    }
  ],
  examples: [
    {
      title: 'A swollen brain after a head injury',
      q: 'After a severe head injury, a patient\'s blood pressure is 120/70 mmHg and the pressure inside the skull is 30 mmHg. What is the cerebral perfusion pressure, and why does it matter?',
      steps: [
        'Mean arterial pressure $\\approx 70 + (120 - 70)/3 = 86.7$ mmHg (see [[blood-pressure]]).',
        '$\\text{CPP} = 86.7 - 30 = 56.7$ mmHg.',
        'That is below the 60–70 mmHg that intensive-care teams usually aim for, so parts of the brain risk running short of blood — a second injury on top of the first. Treatment aims to lower the intracranial pressure and support the blood pressure.'
      ],
      a: 'About 57 mmHg — too low; the swelling is starving the brain of blood.'
    },
    {
      title: 'Where is the damage?',
      q: 'A right-handed man suddenly cannot move his right arm well and struggles to find his words, though he understands questions. Which part of the brain is most likely affected?',
      steps: [
        'Right-sided weakness means the left hemisphere, because the motor pathways cross.',
        'Effortful speech with preserved understanding points to the left frontal lobe (Broca\'s area), next to the motor strip for the face and arm.',
        'Both areas are supplied by the left middle cerebral artery — the commonest site of a large stroke.'
      ],
      a: 'The left frontal lobe, in the territory of the left middle cerebral artery.'
    }
  ],
  quiz: [
    { q: 'A stroke causes weakness of the left arm and leg. Which hemisphere is most likely affected?', choices: ['The right', 'The left', 'Both', 'Neither — it must be the spinal cord'], a: 0,
      why: 'The main motor pathways cross, so the right hemisphere controls the left side of the body.' },
    { q: 'Someone who has drunk a lot of alcohol staggers and slurs. Which part of the brain is showing the effect most clearly?', choices: ['The cerebellum', 'The occipital lobe', 'The hypothalamus', 'The hippocampus'], a: 0,
      why: 'The cerebellum coordinates and times movement, including the muscles of speech; alcohol impairs it early.' },
    { q: 'We normally use only about 10 % of our brains.', a: false,
      why: 'Every region is active at some time and damage to any region has consequences; the 10 % idea has no scientific basis.' },
    { q: 'The mean arterial pressure is 80 mmHg and the intracranial pressure 25 mmHg. What is the cerebral perfusion pressure (in mmHg)?', answer: 55, unit: 'mmHg',
      why: 'CPP = MAP − ICP = 80 − 25 = 55 mmHg.' },
    { q: 'Which structure is essential for forming new long-term memories and is damaged early in Alzheimer\'s disease?', choices: ['The hippocampus', 'The cerebellum', 'The medulla', 'The corpus callosum'], a: 0,
      why: 'The hippocampus, in the inner temporal lobe, consolidates new memories; its early damage explains why recent memories go first in Alzheimer\'s disease.' }
  ],
  applications: ['Localising a stroke or tumour from the symptoms before a scan.', 'Brain imaging: CT, MRI, functional MRI and PET.', 'Managing head injury and intracranial pressure in intensive care.', 'Rehabilitation after stroke, which relies on plasticity.'],
  history: 'In 1861 Paul Broca examined the brain of a man who could say only one syllable, "tan", and found damage in the left frontal lobe; in 1874 Carl Wernicke described the opposite pattern from damage further back. Together they showed that functions have places in the brain.',
  sim: { id: 'neu-eeg', params: { state: 'closed' } }
},

{
  id: 'vision', parent: 'brain-senses', title: 'Vision', level: 2,
  short: 'The eye is a camera with a self-focusing lens and a retina of 120 million light sensors, wired to the back of the brain. Short sight, long sight and the reading glasses of middle age are all problems of focus, and most can be corrected.',
  keywords: ['eye', 'vision', 'retina', 'cornea', 'lens', 'accommodation', 'myopia', 'short sight', 'hyperopia', 'long sight', 'presbyopia', 'reading glasses', 'astigmatism', 'dioptre', 'cataract', 'glaucoma', 'macular degeneration', 'diabetic retinopathy', 'retinal detachment', 'colour blindness', 'visual field'],
  prereq: ['brain-regions', 'physics:the-eye', 'physics:thin-lenses'],
  related: ['physics:vision-correction', 'physics:color-vision', 'physics:refraction', 'ageing', 'type2-diabetes', 'stroke', 'headache-migraine'],
  body: `
Around the age of 45, a man who has never needed glasses finds himself holding the menu at arm's length in a dim restaurant. Nothing is wrong with his eyes in the sense of disease: the lens inside each eye has been stiffening since childhood, and it can no longer bend enough to focus on something close. That is presbyopia, and it comes to everyone — a problem of optics, like most of the reasons people wear glasses.

### A living camera
Light enters through the clear **cornea**, which does about two-thirds of the focusing (about 43 dioptres), passes the **pupil** — 2 to 8 mm wide, set by the iris to the brightness — and is focused further by the **lens** onto the **retina**, a thin sheet of light sensors lining the back of the eye. Together cornea and lens have a power of about 60 dioptres, bringing distant objects to a sharp image on a retina about 22 mm behind them (see [[physics:the-eye|the eye]] and [[physics:thin-lenses|thin lenses]]).

The retina has about 120 million **rods**, sensitive enough to work in starlight but blind to colour, and about 6 million **cones** of three kinds (for long, middle and short wavelengths) that give colour and fine detail in good light. The cones crowd into a tiny central pit, the **fovea**, where reading and faces are seen sharply. About 1.2 million nerve fibres leave the eye in the optic nerve; where they exit there are no sensors — the blind spot, which the brain fills in.

### From eye to brain
At the **optic chiasm**, behind the eyes, the fibres from the inner half of each retina cross, so that everything in the right half of the visual field, from both eyes, goes to the **left** occipital lobe, and vice versa. That is why a stroke in one occipital lobe takes away the same half of the view in both eyes (a hemianopia), and why people may not notice it until they bump into things on one side.

### Focusing and its errors
To see close, a ring of muscle relaxes its pull on the lens, which rounds up and gains power — **accommodation**. A child can add some 15 dioptres; by 45 about 5 are left, and by 60 almost none.

| Error | What is wrong | What the person notices | Correcting lens |
|---|---|---|---|
| Myopia (short sight) | eye too long, or too strong | distance blurred, near clear | diverging (minus) |
| Hyperopia (long sight) | eye too short, or too weak | near blurred first; tired eyes | converging (plus) |
| Astigmatism | cornea curved more one way than the other | blur and ghosting at all distances | cylindrical |
| Presbyopia | lens too stiff to accommodate | close work blurred after about 45 | plus lenses for near |

A myope sees sharply out to a **far point**; a lens of power $P = -1/d_\\text{far}$ (dioptres, with the distance in metres) moves the image of infinity to that point. Myopia is rising fast: about a third of the world was short-sighted in 2020, and half may be by 2050 (Holden and colleagues, 2016). Time outdoors in childhood — around two hours a day — lowers the risk; low-dose atropine drops and special spectacle or contact lenses can slow its progression.

### When eyes fall ill
The WHO's World report on vision (2019) estimated that at least 2.2 billion people have a near or distance vision impairment, of which at least a billion could have been prevented or have not been addressed — most simply needing glasses or cataract surgery. **Cataract** (a clouded lens, replaced in a short operation) is the leading cause of blindness worldwide. **Glaucoma** damages the optic nerve silently, usually with raised eye pressure, starting at the edges of vision. **Age-related macular degeneration** attacks the central retina. **Diabetic retinopathy** is why people with diabetes need regular eye screening. Colour-vision deficiency, usually red–green and inherited on the X chromosome, affects about 8 % of men of northern European descent and 0.5 % of women.

> [!warn] These need emergency care: **sudden loss of vision** in one or both eyes, a **curtain or shadow** moving across the view, a shower of **new floaters with flashes** (retinal detachment), a **painful red eye with blurred vision, haloes, headache or vomiting** (acute glaucoma), and sudden double vision or loss of half the visual field, which can be a stroke. After a chemical splash, keep rinsing the eye with clean running water for at least 15 minutes. In each case, call your local emergency number or go straight to an emergency department.
`,
  ideas: [
    'The cornea does two-thirds of the eye\'s focusing and the adjustable lens the rest: about 60 dioptres in all.',
    'Rods see in dim light without colour; three kinds of cone give colour and detail, concentrated in the fovea.',
    'The right half of what both eyes see goes to the left occipital lobe.',
    'Short sight is corrected with minus lenses, long sight and presbyopia with plus lenses, astigmatism with cylindrical ones.',
    'Sudden loss of vision, a curtain across the view or flashes with new floaters are emergencies.'
  ],
  pitfalls: [
    'Reading in dim light or sitting close to a screen damages the eyes — It can cause tiredness and discomfort, but not lasting damage; the rise in myopia is linked instead to much close work and little time outdoors in childhood.',
    'Glasses make your eyes lazy and weaker — Correcting lenses do not change the eye\'s optics; presbyopia and most myopia progress with or without them.',
    'Long-sighted people see distant things perfectly — Young hyperopes can often focus through their error, but at the cost of effort and tired eyes; with age, distance blurs too.'
  ],
  formulas: [
    {
      name: 'The lens that corrects short sight',
      expr: 'P = -1/df', tex: 'P = -\\frac{1}{d_\\text{far}}',
      vars: {
        P: { name: 'power of the correcting lens', q: 'optpower', unit: 'D', signed: true },
        df: { name: 'far point (the farthest distance seen sharply)', q: 'length', unit: 'm', value: 0.5, tex: 'd_\\text{far}' }
      },
      note: 'A diverging lens makes distant objects appear to lie at the far point, where the myopic eye can focus. The formula ignores the small gap between spectacle and eye (contact lenses sit on the eye and follow it exactly).',
      practice: { unknowns: ['P', 'df'] },
      stories: { P: 'A short-sighted student sees sharply only out to {df}. What lens power corrects her distance vision?', df: 'A spectacle prescription is {P}. Roughly how far can the wearer see sharply without glasses?' }
    },
    {
      name: 'Focusing range left at a given age',
      expr: 'A = a - b*age', tex: 'A = a - b \\cdot \\text{age}',
      vars: {
        A: { name: 'average amplitude of accommodation (D)' },
        a: { name: 'value extrapolated to birth (D)', value: 18.5, fixed: true },
        b: { name: 'loss per year (D)', value: 0.3, fixed: true },
        age: { name: 'age (years)', value: 45, tex: '\\text{age}' }
      },
      note: 'Hofstetter\'s average formula (1950), for about ages 10 to 55. After about 55 the measured amplitude levels off near 1 D, most of it depth of focus rather than a lens that still changes shape. The near point of an otherwise normal eye is 1/A metres.',
      stories: { A: 'Roughly how many dioptres of focusing range remain at age {age}?' }
    },
    {
      name: 'The reading addition for presbyopia',
      expr: 'add = 1/d - A/2', tex: 'P_\\text{add} = \\frac{1}{d} - \\frac{A}{2}',
      vars: {
        add: { name: 'reading addition', q: 'optpower', unit: 'D', signed: true, tex: 'P_\\text{add}' },
        d: { name: 'reading distance', q: 'length', unit: 'cm', value: 40 },
        A: { name: 'amplitude of accommodation', q: 'optpower', unit: 'D', value: 2 }
      },
      note: 'The usual rule keeps half the focusing range in reserve, because using all of it cannot be sustained. A negative result means no addition is needed yet. Eye-care professionals measure this directly rather than relying on age.',
      practice: { unknowns: ['add', 'd'] },
      stories: { add: 'A 55-year-old with {A} of focusing range wants to read at {d}. What reading addition does she need?' }
    }
  ],
  examples: [
    {
      title: 'A short-sighted student',
      q: 'A student can read the board clearly only when she sits within 0.5 m of it. What lens corrects her distance vision, and what would a prescription of −4.00 D mean?',
      steps: [
        'Her far point is 0.5 m, so $P = -1/0.5 = -2$ D.',
        'A −4.00 D prescription means a far point of $1/4 = 0.25$ m: without glasses, everything beyond 25 cm is blurred.',
        'Minus lenses spread the light slightly, so the eye\'s excess power brings distant objects into focus on the retina.'
      ],
      a: 'A −2 D lens; −4 D corresponds to a far point of 25 cm.'
    },
    {
      title: 'Reading glasses at 55',
      q: 'Estimate the focusing range left at 55 and the reading addition needed to read at 40 cm, for someone with no distance prescription.',
      steps: [
        'Amplitude: $A = 18.5 - 0.3 \\times 55 = 2$ D, so the near point is $1/2 = 0.5$ m — the arm\'s-length menu.',
        'Reading at 40 cm needs $1/0.4 = 2.5$ D of focusing.',
        'Keeping half the range in reserve: $P_\\text{add} = 2.5 - 2/2 = 1.5$ D.'
      ],
      a: 'About 2 D of range and a +1.50 D reading addition — typical of the mid-fifties.'
    }
  ],
  quiz: [
    { q: 'A short-sighted eye focuses distant objects…', choices: ['in front of the retina, so it needs a diverging (minus) lens', 'behind the retina, so it needs a converging (plus) lens', 'on the retina, but the image is too small', 'only when the pupil is wide'], a: 0,
      why: 'The myopic eye is too long or too strong, so the image forms in front of the retina; a minus lens weakens the total power.' },
    { q: 'What lens power (in dioptres) corrects a far point of 25 cm?', answer: -4, unit: 'D',
      why: 'P = −1/0.25 m = −4 D.' },
    { q: 'A stroke in the left occipital lobe causes…', choices: ['loss of the right half of the visual field in both eyes', 'blindness in the left eye', 'loss of the left half of the field in both eyes', 'loss of colour vision only'], a: 0,
      why: 'Both eyes send their right-field information to the left occipital lobe after the fibres cross at the optic chiasm.' },
    { q: 'Presbyopia is caused mainly by…', choices: ['the lens stiffening with age so it cannot round up for near focus', 'the eyeball growing longer', 'weakening of the cornea', 'loss of cones in the fovea'], a: 0,
      why: 'The lens loses its elasticity from childhood onward; the focusing range falls from about 15 D to almost nothing by 60.' },
    { q: 'Many new floaters with flashes of light in one eye can wait until a routine appointment next month.', a: false,
      why: 'This can be a retinal tear or detachment, which needs urgent same-day assessment; early treatment can save the sight.' }
  ],
  applications: ['Spectacles, contact lenses and refractive surgery, which change the eye\'s total power.', 'Cataract surgery, one of the most common and effective operations in the world.', 'Diabetic eye screening and glaucoma checks.', 'Mapping visual-field loss to locate strokes and tumours.'],
  sim: 'neu-eye'
},

{
  id: 'hearing-balance', parent: 'brain-senses', title: 'Hearing and balance', level: 2,
  short: 'The ear turns pressure waves into nerve signals — the canal and middle ear gather and amplify sound, the cochlea sorts it by pitch with some 15 000 hair cells that never regrow — while the inner ear\'s canals and crystals sense movement and gravity.',
  keywords: ['hearing', 'ear', 'cochlea', 'hair cells', 'eardrum', 'ossicles', 'audiogram', 'decibel', 'hearing loss', 'noise-induced hearing loss', 'presbycusis', 'tinnitus', 'hearing aid', 'cochlear implant', 'balance', 'vestibular', 'vertigo', 'BPPV', 'Ménière', 'motion sickness'],
  prereq: ['nervous-system-organization', 'physics:the-ear', 'physics:sound-intensity'],
  related: ['physics:loudness-pitch', 'physics:hearing-music', 'physics:standing-waves', 'dementia', 'ageing', 'environmental-health', 'stroke', 'birth-newborn'],
  body: `
A woman in her fifties hears the voices around her in a busy restaurant perfectly well — she just cannot make out the words. Her hearing for low sounds is normal; what she has lost is the high frequencies, where the consonants live: the "s", "f", "th" and "t" that tell "fin" from "thin" and "sip" from "ship". Twenty years of loud factory work and the gentle wear of age have taken hair cells from the base of her cochleas, and they do not grow back.

### From air to nerve
- **The outer ear** funnels sound down a canal about 2.5 cm long. Like an organ pipe closed at one end, the canal resonates near 3–4 kHz and boosts those frequencies — one reason they are the ones noise damages first.
- **The middle ear** turns vibrations of air into vibrations of fluid. The eardrum is about 17 times larger than the oval window of the inner ear, and the three smallest bones in the body — the malleus, incus and stapes — add a lever advantage of about 1.3, so the pressure rises about 22-fold (some 27 dB). Without this, most of the sound would bounce off the fluid.
- **The inner ear** holds the **cochlea**, a fluid-filled spiral about 35 mm long if unrolled. Along it runs the basilar membrane, stiff and narrow at the base, wide and floppy at the tip, so each frequency makes it vibrate most at its own place — high notes at the base, low notes at the apex. About 3 500 inner hair cells per ear turn the motion into nerve signals, and about 12 000 outer hair cells act as amplifiers, sharpening the tuning. From there the auditory nerve runs to the brainstem and the temporal lobes.

We hear from about 20 Hz to 20 kHz when young, and across a range of about 120 dB — a million-million-fold in intensity. The decibel scale compresses it: every 10 dB is ten times the intensity and sounds roughly twice as loud; every 3 dB is double the energy (see [[physics:sound-intensity|sound intensity]] and [[physics:loudness-pitch|loudness and pitch]]).

### Hearing loss
The WHO World report on hearing (2021) estimated that more than 1.5 billion people live with some hearing loss, about 430 million of them with disabling loss, and that over a billion young people are at risk from unsafe listening. Loss is described on an **audiogram**, the quietest tone heard at each frequency in dB HL (0 is the average young ear):

| WHO grade (2021) | Better ear average (0.5, 1, 2, 4 kHz) |
|---|---|
| Normal | below 20 dB |
| Mild | 20 to below 35 dB |
| Moderate | 35 to below 50 dB |
| Moderately severe | 50 to below 65 dB |
| Severe | 65 to below 80 dB |
| Profound | 80 to below 95 dB |
| Complete | 95 dB or more |

- **Conductive** loss — sound does not reach the cochlea: wax, fluid behind the eardrum (common in children), a perforated drum, stiffened middle-ear bones. Often treatable.
- **Sensorineural** loss — hair cells or nerve damaged: age (presbycusis, highest frequencies first), **noise** (a typical notch at about 4 kHz), some medicines, infections, genetics. Permanent, but **hearing aids** and, for severe loss, **cochlear implants** restore much of what matters. Only a small minority of people who would benefit from a hearing aid use one.

Hearing loss is not trivial: it isolates people, and the Lancet Commission on dementia (2024) counted untreated hearing loss in midlife among the largest modifiable risk factors for [[dementia|dementia]]. **Tinnitus** — ringing or hissing with no outside sound — affects roughly one adult in seven, usually alongside some hearing loss.

Protecting hearing is about dose: level and time. A common workplace limit is 85 dB(A) for 8 hours, halving the time for every 3 dB more.

### Balance
Next to the cochlea sit the **vestibular organs**: three **semicircular canals** at right angles, which sense rotation of the head, and two **otolith organs** with tiny crystals that sense gravity and straight-line acceleration. The brain combines their signals with the eyes and the sense of position from joints and muscles. When they disagree — reading in a car — the result is motion sickness.

**Benign paroxysmal positional vertigo** (BPPV), the commonest cause of vertigo, happens when crystals drift into a canal: turning over in bed brings on a spinning that lasts less than a minute. A simple sequence of head movements done by a clinician (a repositioning manoeuvre) cures most cases. Vestibular neuritis causes days of severe vertigo; Ménière's disease causes attacks of vertigo with hearing loss, ringing and fullness in one ear.

> [!warn] **Sudden hearing loss in one ear**, over hours or a few days, needs a doctor within a day or two — treatment works best when started early. Dizziness or vertigo with **double vision, slurred speech, face or limb weakness or numbness, inability to walk, or a sudden severe headache** can be a stroke in the back of the brain: call your local emergency number.
`,
  ideas: [
    'The ear canal and middle ear gather and amplify sound about 22-fold in pressure; the cochlea sorts it by frequency, high notes at the base.',
    'Hair cells do not regrow: noise and age cause permanent sensorineural loss, usually starting at high frequencies.',
    'The audiogram shows the quietest sound heard at each frequency; the WHO grades loss from the better-ear average.',
    'Noise damage depends on level and time: every 3 dB more halves the safe time.',
    'The semicircular canals sense rotation and the otolith organs gravity; loose crystals cause BPPV, the commonest vertigo.'
  ],
  pitfalls: [
    'If loud music does not hurt, it is not damaging — Damage starts well below the pain threshold (about 120–130 dB); dose matters, and 100 dB for 15 minutes equals 85 dB for 8 hours.',
    'Ringing after a concert that goes away means no harm was done — The temporary shift recovers, but repeated exposure causes permanent loss, and research suggests nerve connections can be lost even when the audiogram recovers.',
    'Hearing aids work like glasses and restore normal hearing — They amplify, but damaged hair cells still blur sounds together; aids help a great deal, especially fitted early, with realistic expectations.'
  ],
  formulas: [
    {
      name: 'Resonance of the ear canal',
      expr: 'f = v/(4*L)', tex: 'f = \\frac{v_s}{4L}',
      vars: {
        f: { name: 'resonant frequency', q: 'frequency', unit: 'Hz' },
        v: { const: 'vs' },
        L: { name: 'length of the ear canal', q: 'length', unit: 'cm', value: 2.5 }
      },
      note: 'A tube open at one end and closed at the other (by the eardrum) resonates when its length is a quarter of the wavelength. The boost of about 10–20 dB near 3 kHz makes us most sensitive there — and makes noise damage start there. Air in the ear is warmer than 20 °C, so the true speed is a little higher.',
      practice: { unknowns: ['f', 'L'] },
      stories: { f: 'An ear canal is {L} long. At what frequency does it resonate?' }
    },
    {
      name: 'Pressure gain of the middle ear',
      expr: 'G = 20*log(Ar*Lr)', tex: 'G = 20\\log_{10}\\left(A_r \\, L_r\\right)',
      vars: {
        G: { name: 'pressure gain', q: 'gain', unit: 'dB' },
        Ar: { name: 'area ratio, eardrum to oval window', value: 17, tex: 'A_r' },
        Lr: { name: 'lever ratio of the ossicles', value: 1.3, tex: 'L_r' }
      },
      note: 'Force collected over the large eardrum is delivered to the small oval window, and the lever of the bones adds a little more. A middle ear stiffened by fluid or disease loses much of this gain — a conductive hearing loss.',
      stories: { G: 'The eardrum has {Ar} times the area of the oval window and the ossicles add a lever ratio of {Lr}. What is the pressure gain in decibels?' }
    },
    {
      name: 'How long a noise can be tolerated',
      expr: 'T = T0/2^((L - Lc)/X)', tex: 'T = \\frac{T_0}{2^{(L - L_c)/X}}',
      vars: {
        T: { name: 'daily time allowed', q: 'time', unit: 'h' },
        T0: { name: 'reference duration', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' },
        L: { name: 'noise level', q: 'soundlevel', unit: 'dB', value: 94 },
        Lc: { name: 'criterion level', q: 'soundlevel', unit: 'dB', value: 85, fixed: true, tex: 'L_c' },
        X: { name: 'exchange rate', q: 'soundlevel', unit: 'dB', value: 3, fixed: true }
      },
      note: 'The equal-energy rule of the US National Institute for Occupational Safety and Health (1998) and of many countries\' workplace rules: 85 dB(A) for 8 hours, with each 3 dB doubling the sound energy and halving the time. The WHO and ITU safe-listening standard for personal audio devices (2019) is stricter: about 80 dB(A) for 40 hours a week for adults.',
      practice: { unknowns: ['T', 'L'] },
      stories: { T: 'Headphones play at {L}. Under the 85 dB, 8-hour rule, how long a day is that safe?', L: 'What noise level uses up the whole daily allowance in {T}?' }
    }
  ],
  examples: [
    {
      title: 'Headphones on the commute',
      q: 'A student listens through headphones at about 94 dB(A). How long a day stays within the 85 dB, 8-hour rule? And at 100 dB?',
      steps: [
        '94 − 85 = 9 dB, which is three steps of 3 dB: the allowed time halves three times.',
        '$T = 8/2^3 = 1$ hour.',
        'At 100 dB: $15/3 = 5$ halvings, $T = 8/2^5 = 0.25$ h, or 15 minutes.'
      ],
      a: 'About 1 hour at 94 dB, and only 15 minutes at 100 dB.'
    },
    {
      title: 'Why noise damage starts near 4 kHz',
      q: 'An adult ear canal is about 2.5 cm long. At what frequency does it resonate, and what does that mean for noise damage?',
      steps: [
        '$f = v/4L = 343/(4 \\times 0.025) = 3430$ Hz.',
        'The canal boosts sound around 3–4 kHz by 10–20 dB before it reaches the cochlea.',
        'Broadband noise is therefore strongest at the part of the cochlea tuned to 3–6 kHz, which is where the typical noise "notch" appears on the audiogram, deepest near 4 kHz.'
      ],
      a: 'About 3.4 kHz — close to the 4 kHz notch of noise-induced hearing loss.'
    }
  ],
  quiz: [
    { q: 'A man who worked for years in a loud factory has an audiogram with a dip near 4 kHz. Which sounds will he find hardest?', choices: ['Consonants such as s, f and th, especially in noise', 'Low hums and bass notes', 'Vowels', 'All sounds equally'], a: 0,
      why: 'Consonants carry much of their energy at high frequencies; vowels and low sounds are mostly below 2 kHz.' },
    { q: 'Under the 85 dB, 8-hour rule with a 3 dB exchange rate, how many hours a day are allowed at 91 dB?', answer: 2, unit: 'h',
      why: '91 − 85 = 6 dB, two halvings: 8/4 = 2 hours.' },
    { q: 'Ringing ears after a loud concert that fades by the next morning means no damage was done.', a: false,
      why: 'The threshold recovers, but repeated exposure adds up to permanent loss, and studies suggest nerve connections in the cochlea can be lost even when hearing tests recover.' },
    { q: 'Brief spinning, lasting under a minute, whenever a person rolls over in bed is most typical of…', choices: ['benign paroxysmal positional vertigo', 'Ménière\'s disease', 'a stroke', 'low blood pressure'], a: 0,
      why: 'In BPPV loose crystals move in a semicircular canal with each change of head position; a repositioning manoeuvre usually cures it.' },
    { q: 'A child with fluid behind the eardrum has…', choices: ['a conductive hearing loss', 'a sensorineural hearing loss', 'damaged hair cells', 'a problem in the auditory cortex'], a: 0,
      why: 'Fluid stops the eardrum and bones from moving freely, so sound is not conducted well to a healthy cochlea; it usually clears.' }
  ],
  applications: ['Newborn hearing screening, which finds the 1–2 babies in a thousand born with permanent hearing loss.', 'Hearing protection at work, concerts and with personal audio.', 'Hearing aids and cochlear implants.', 'Diagnosing vertigo at the bedside and treating BPPV with repositioning manoeuvres.'],
  sim: 'neu-audiogram'
},

{
  id: 'sleep', parent: 'brain-senses', title: 'Sleep', level: 1,
  short: 'A third of life, organised in 90-minute cycles of light, deep and dreaming (REM) sleep, timed by two forces — the pressure that builds while we are awake and the body clock. Enough of it protects mood, memory, metabolism and safety.',
  keywords: ['sleep', 'sleep stages', 'REM sleep', 'deep sleep', 'slow-wave sleep', 'sleep cycle', 'circadian rhythm', 'body clock', 'melatonin', 'adenosine', 'caffeine', 'insomnia', 'CBT-I', 'jet lag', 'shift work', 'narcolepsy', 'hypnogram', 'sleep deprivation', 'drowsy driving'],
  prereq: ['brain-regions', 'synapses', 'hormone-feedback'],
  related: ['sleep-apnea', 'depression', 'anxiety-disorders', 'parkinsons', 'epilepsy', 'menopause', 'ageing', 'alcohol'],
  body: `
A nurse finishes a run of night shifts. At 9 in the morning she has been awake for over 24 hours and should fall asleep instantly — yet in the bright daylight her body insists it is time to be awake, and she wakes at 1 pm, unrefreshed. Two separate systems control sleep, and she has set them against each other.

### Two forces: pressure and the clock
- **Sleep pressure** (process S) builds the longer we are awake. One of its signals is **adenosine**, which accumulates in the brain with activity and quietens it — the signal that caffeine blocks. Sleep discharges the pressure, quickly at first.
- **The body clock** (process C) is a group of cells in the hypothalamus, the suprachiasmatic nucleus, that keeps a roughly 24-hour rhythm in almost every organ. Morning light reaching special cells in the retina sets it each day; darkness releases **melatonin** from the pineal gland, a signal of night (not a sleeping pill).

We sleep best when high pressure meets the clock's night-time window. Jet lag and shift work pull them apart; the clock shifts only about an hour a day.

### A night's architecture
Sleep runs in cycles of about 90 minutes (70–120), four to six a night:

| Stage | Share of the night (young adult) | What happens |
|---|---|---|
| N1 — dozing | about 5 % | drifting off; easily woken; sudden jerks |
| N2 — light sleep | about 45–55 % | sleep spindles and K-complexes on the EEG; temperature and heart rate fall |
| N3 — deep (slow-wave) sleep | about 15–25 % | large slow brain waves; hard to wake; growth hormone released; memories consolidated |
| REM — dreaming | about 20–25 % | rapid eye movements, vivid dreams, the muscles paralysed; brain as active as when awake |

Deep sleep comes mostly in the first half of the night and REM in the second, so cutting a night short costs REM sleep most. With age, deep sleep shrinks and awakenings multiply; that is normal and not in itself insomnia.

### How much
Consensus statements (American Academy of Sleep Medicine and Sleep Research Society, 2015–2016) advise **7 hours or more** for adults, 8–10 for teenagers, 9–12 for children aged 6–12 and 10–13 for 3–5-year-olds, including naps. Teenagers' clocks shift later at puberty, which is why early school starts are hard for them.

### Short of sleep
After 17–19 hours awake, performance falls to about the level of a blood alcohol concentration of 0.05 %, and after a full night without sleep to about 0.1 % (Williamson and Feyer, 2000). Drowsiness causes a sizeable share of road crashes. Long-term short sleep is linked to weight gain, type 2 diabetes, high blood pressure, depression and infections; for some of these the evidence shows association more clearly than cause.

### Sleep problems
- **Insomnia** — trouble falling or staying asleep, with daytime effects, on at least three nights a week for three months. About one adult in ten has it. Guidelines (American College of Physicians 2016; the European Insomnia Guideline 2023) recommend **cognitive behavioural therapy for insomnia** (CBT-I) first: fixed wake-up times, time in bed matched to actual sleep, getting up when unable to sleep, and changing worried thoughts about sleep. Sleeping pills help short-term but bring risks — falls, next-day drowsiness and dependence — especially in older people.
- **[[sleep-apnea|Sleep apnoea]]** — loud snoring, pauses in breathing and daytime sleepiness.
- **Narcolepsy** — overwhelming daytime sleep attacks, often with sudden weakness triggered by laughter (cataplexy), from loss of the wake-promoting orexin neurons.
- **Restless legs** — an urge to move the legs in the evening, sometimes linked to low iron.
- **REM sleep behaviour disorder** — acting out dreams, because the normal paralysis of REM fails; it can precede [[parkinsons|Parkinson's disease]] by years, so it is worth mentioning to a doctor.

What helps most people: a regular wake-up time, daylight in the morning, a cool, dark, quiet room, no caffeine in the 6–8 hours before bed (its half-life is about 5 hours), and not using alcohol as a sleep aid — it sends you off faster but fragments the second half of the night.

> [!warn] If you feel sleepy while driving, stop somewhere safe: open windows and loud music do not work. Loud snoring with pauses in breathing or gasping, or falling asleep during the day without meaning to, are reasons to see a doctor. A person who cannot be woken is not asleep but unconscious: call your local emergency number.
`,
  ideas: [
    'Sleep is timed by two forces: sleep pressure that builds while awake, and the circadian clock set by light.',
    'A night runs in cycles of about 90 minutes: deep sleep dominates early, REM sleep late.',
    'Adults need 7 hours or more; teenagers 8–10 and children more.',
    '17–19 hours awake impairs performance about as much as a blood alcohol of 0.05 %.',
    'CBT-I, not sleeping pills, is the first treatment for chronic insomnia.'
  ],
  pitfalls: [
    'Alcohol helps you sleep — It shortens the time to fall asleep but fragments sleep and suppresses REM in the second half of the night.',
    'You can train yourself to need less sleep — People who sleep too little adapt their sense of sleepiness, not their performance, which keeps falling.',
    'Waking up during the night means something is wrong — Brief awakenings between cycles are normal and become more common with age; they matter only when they add up to poor daytime function.'
  ],
  formulas: [
    {
      name: 'Sleep pressure building up while awake',
      expr: 'S = 1 - (1 - S0)*exp(-t/tau)', tex: 'S = 1 - (1 - S_0)\\,e^{-t/\\tau_r}',
      vars: {
        S: { name: 'sleep pressure (0 to 1, relative)' },
        S0: { name: 'sleep pressure on waking', value: 0.2, min: 0, max: 1, tex: 'S_0' },
        t: { name: 'time awake', q: 'time', unit: 'h', value: 16 },
        tau: { name: 'build-up time constant', q: 'time', unit: 'h', value: 18.2, fixed: true, tex: '\\tau_r' }
      },
      note: 'Process S of the two-process model of sleep (Borbély, 1982; time constants from Daan, Beersma and Borbély, 1984). A relative, dimensionless scale — it tracks the slow brain waves of the following sleep, not something measured in the blood.',
      practice: { unknowns: ['S', 't'] },
      stories: { S: 'Starting from a sleep pressure of {S0} on waking, what is the pressure after {t} awake?', t: 'How long must someone stay awake, starting from {S0}, for sleep pressure to reach {S}?' }
    },
    {
      name: 'Sleep pressure falling during sleep',
      expr: 'S = S1*exp(-t/tau)', tex: 'S = S_1\\,e^{-t/\\tau_d}',
      vars: {
        S: { name: 'sleep pressure after sleeping (relative)' },
        S1: { name: 'sleep pressure at bedtime', value: 0.67, min: 0, max: 1, tex: 'S_1' },
        t: { name: 'time asleep', q: 'time', unit: 'h', value: 8 },
        tau: { name: 'decay time constant', q: 'time', unit: 'h', value: 4.2, fixed: true, tex: '\\tau_d' }
      },
      note: 'Pressure falls about four times faster than it builds, and fastest at the start of the night — which is why the first cycles hold most of the deep sleep, and why a short nap takes the edge off sleepiness.',
      practice: { unknowns: ['S', 't'] },
      stories: { S: 'Someone goes to bed with a sleep pressure of {S1} and sleeps {t}. What is left?' }
    },
    {
      name: 'Days to get over jet lag',
      expr: 'days = dH/r', tex: 'd = \\frac{\\Delta h}{r}',
      vars: {
        days: { name: 'days to adjust', tex: 'd' },
        dH: { name: 'time zones crossed (hours)', value: 7, tex: '\\Delta h' },
        r: { name: 'clock shift per day (hours)', value: 1 }
      },
      note: 'A rule of thumb: the body clock moves about an hour a day, somewhat faster when flying west (lengthening the day) than east. Morning light after flying east and evening light after flying west speed it up.',
      stories: { days: 'A traveller crosses {dH} time zones and her clock shifts {r} a day. Roughly how many days until she is adjusted?' }
    }
  ],
  examples: [
    {
      title: 'The all-nighter',
      q: 'Waking with a sleep pressure of 0.2, compare the pressure after a normal 16-hour day and after staying up for 24 hours. Then find what is left after 8 hours of sleep from the 16-hour level.',
      steps: [
        'After 16 h: $S = 1 - 0.8\\,e^{-16/18.2} = 1 - 0.8 \\times 0.415 = 0.67$.',
        'After 24 h: $S = 1 - 0.8\\,e^{-24/18.2} = 1 - 0.8 \\times 0.267 = 0.79$ — higher, and now at the clock\'s low point in the early morning, the worst combination.',
        'Sleeping 8 h from 0.67: $S = 0.67\\,e^{-8/4.2} = 0.67 \\times 0.149 = 0.10$ — back below the morning value.'
      ],
      a: 'About 0.67 after 16 hours, 0.79 after 24; 8 hours of sleep brings 0.67 down to about 0.10.'
    },
    {
      title: 'Coffee at four',
      q: 'Caffeine has a half-life of about 5 hours (it varies widely between people). If you drink a coffee at 4 pm, what fraction is still in your body at 11 pm?',
      steps: [
        'Seven hours is $7/5 = 1.4$ half-lives.',
        'Fraction left $= 0.5^{1.4} = 0.38$.',
        'More than a third of the afternoon coffee is still blocking adenosine receptors at bedtime.'
      ],
      a: 'About 38 %.'
    }
  ],
  quiz: [
    { q: 'Someone who routinely cuts their sleep from 8 to 6 hours by getting up earlier loses mostly…', choices: ['REM sleep, concentrated late in the night', 'deep sleep, concentrated late in the night', 'light sleep only', 'nothing important'], a: 0,
      why: 'Deep sleep comes mostly in the first cycles and REM in the last ones, so shortening the end of the night removes REM.' },
    { q: 'A drink of alcohol before bed improves the quality of sleep.', a: false,
      why: 'Alcohol speeds falling asleep but fragments the second half of the night and suppresses REM sleep.' },
    { q: 'Caffeine has a half-life of about 5 hours. What percentage of a 4 pm coffee remains at 11 pm?', answer: 38, unit: '%',
      why: '0.5^(7/5) = 0.38.' },
    { q: 'Which is recommended as the first treatment for long-lasting insomnia?', choices: ['Cognitive behavioural therapy for insomnia (CBT-I)', 'Nightly sleeping pills', 'Staying in bed longer to catch up', 'A glass of wine at bedtime'], a: 0,
      why: 'Major guidelines recommend CBT-I first: it works as well as pills in the short term and better in the long term, without their risks.' },
    { q: 'Why does a night-shift worker sleep badly in the day even after 24 hours awake?', choices: ['The circadian clock signals wakefulness in daylight, working against the high sleep pressure', 'Sleep pressure disappears after 24 hours', 'Melatonin is highest at midday', 'Adenosine is cleared by daylight'], a: 0,
      why: 'Sleep needs both high pressure and the clock\'s night window; daylight keeps the clock in its day phase.' }
  ],
  applications: ['Treating insomnia with CBT-I.', 'Planning shift rotas and travel to limit circadian disruption.', 'Sleep studies (polysomnography) to diagnose sleep apnoea, narcolepsy and parasomnias.', 'Road safety campaigns against drowsy driving.'],
  sim: ['neu-hypnogram', { id: 'neu-eeg', params: { state: 'n2' }, title: 'The EEG in sleep' }]
},

{
  id: 'pain', parent: 'brain-senses', title: 'Pain', level: 2,
  short: 'An alarm built by the brain from signals of damage — shaped by attention, fear, mood and context. Acute pain protects; chronic pain can outlive its cause and become a condition of the nervous system itself.',
  keywords: ['pain', 'nociception', 'nociceptor', 'A-delta fibres', 'C fibres', 'gate control', 'referred pain', 'neuropathic pain', 'chronic pain', 'central sensitisation', 'fibromyalgia', 'phantom limb', 'placebo', 'endorphins', 'analgesia', 'back pain', 'sciatica'],
  prereq: ['neurons', 'synapses', 'nervous-system-organization'],
  related: ['pain-relief', 'headache-migraine', 'heart-attack', 'depression', 'anxiety-disorders', 'type2-diabetes', 'sleep', 'multiple-sclerosis'],
  body: `
Two people of the same age have knee X-rays that look almost identical, with the same worn cartilage. One can barely walk for pain; the other hikes at weekends and feels nothing. Neither is imagining anything. Pain is not a direct readout of damage but something the brain constructs from signals of possible harm, weighed against everything else it knows — attention, fear, past experience, mood, sleep, what the pain might mean. The International Association for the Study of Pain (2020) describes it as an unpleasant sensory and emotional experience tied to actual or potential tissue damage, or resembling one.

### From tissue to brain
**Nociceptors** — bare nerve endings in skin, muscles, joints and organs — respond to heat above about 43 °C, intense cold, pressure and chemicals. Chilli works on the heat sensor, menthol on a cold one. Inflammation releases substances (prostaglandins, bradykinin) that sensitise these endings, which is why an injured area hurts at a touch — and why anti-inflammatory medicines ease it.

Two kinds of fibre carry the signal: thinly myelinated **Aδ** fibres (5–30 m/s) for the first sharp, well-located pain, and bare **C** fibres (0.5–2 m/s) for the dull, burning, spreading pain that follows. In the **dorsal horn** of the spinal cord they pass the message to neurons that cross to the other side and ascend to the thalamus and on to several brain areas: the somatosensory cortex (where and how intense), and the insula and cingulate cortex (how unpleasant, how urgent).

### Turning the volume up and down
The spinal cord is not a simple relay. In the **gate control** idea (Melzack and Wall, 1965), touch fibres dampen pain transmission in the dorsal horn — which is why rubbing a bumped elbow helps. Descending pathways from the brainstem release endorphins, serotonin and noradrenaline onto the same synapses: they can almost switch pain off (athletes and soldiers who notice injuries only later) or turn it up. Expectation matters too — part of the **placebo** effect runs on the body's own opioids.

When pain persists, the system itself can change: nerves in the cord and brain become more responsive (**central sensitisation**), so that light touch hurts and pain spreads beyond the original injury.

### Kinds of pain
- **Nociceptive** — from tissue damage or threat: a cut, a fracture, arthritis.
- **Neuropathic** — from damage to the nerves themselves: burning, shooting, electric pain, pins and needles, often with numbness. Examples are diabetic neuropathy, pain after shingles, sciatica and pain after a stroke or in [[multiple-sclerosis|multiple sclerosis]].
- **Nociplastic** — pain from altered processing without clear tissue or nerve damage, as in fibromyalgia and some chronic back pain and irritable bowel syndrome.

**Referred pain** is felt far from its source because organs share spinal segments with skin: the heart refers pain to the left arm, neck and jaw, the diaphragm to the tip of the shoulder, an early appendicitis to the middle of the abdomen.

### Chronic pain
Pain lasting more than three months affects about one adult in five (for example 21 % of US adults in 2021, CDC; about 19 % in a large European survey, 2006), and low back pain is the leading cause of years lived with disability worldwide (Global Burden of Disease). Chronic pain is best treated as a condition in its own right, with several approaches together: staying active and graded exercise, physiotherapy, psychological therapies (cognitive behavioural therapy, acceptance and commitment therapy), sleep, and medicines matched to the kind of pain. Neuropathic pain responds to some antidepressants (amitriptyline, duloxetine) and to gabapentinoids more than to ordinary painkillers. Opioids help severe acute pain but give little long-term benefit in chronic non-cancer pain and carry real risks of dependence and overdose (the US CDC guideline, 2022). How medicines relieve pain is covered in [[pain-relief]]; which to use is a decision to make with a doctor or pharmacist.

> [!warn] Some pain is an emergency: **chest pain** or pressure, especially spreading to the arm, neck or jaw, or with breathlessness or sweating; a **sudden, severe "worst ever" headache**; severe abdominal pain with a rigid belly, vomiting blood or black stools; **back pain with numbness around the genitals or buttocks, loss of bladder or bowel control or weakness of both legs**; a cold, pale, painful limb; or a painful, swollen calf with sudden breathlessness. For any of these, call your local emergency number.
`,
  ideas: [
    'Pain is built by the brain from nociceptor signals, weighed against attention, fear, mood and context.',
    'Fast Aδ fibres carry sharp first pain; slow C fibres the dull, burning second pain.',
    'The spinal cord and descending pathways can turn pain up or down — the basis of rubbing a knock, placebo and stress analgesia.',
    'Pain may be nociceptive, neuropathic or nociplastic, and may be referred to a distant part of the body.',
    'Chronic pain affects about one adult in five and is best treated with several approaches, not medicines alone.'
  ],
  pitfalls: [
    'The amount of pain matches the amount of damage — Pain and damage are only loosely related; many people with worn joints or bulging discs on scans have no pain, and severe pain can occur with little visible damage.',
    'Chronic pain is "all in the head", so it is not real — All pain is produced by the nervous system; chronic pain involves measurable changes in how nerves and brain process signals, and it is real suffering.',
    'Stronger painkillers are always better for long-lasting pain — For chronic non-cancer pain, opioids give little lasting benefit and substantial risks; exercise, therapy and the right class of medicine often do more.'
  ],
  formulas: [
    {
      name: 'The gap between first and second pain',
      expr: 'dt = d/vC - d/vA', tex: '\\Delta t = \\frac{d}{v_C} - \\frac{d}{v_{A\\delta}}',
      vars: {
        dt: { name: 'delay between sharp and dull pain', q: 'time', unit: 's', tex: '\\Delta t' },
        d: { name: 'distance from the injury to the spinal cord', q: 'length', unit: 'm', value: 1 },
        vC: { name: 'speed of C fibres', q: 'speed', unit: 'm/s', value: 1, tex: 'v_C' },
        vA: { name: 'speed of Aδ fibres', q: 'speed', unit: 'm/s', value: 15, tex: 'v_{A\\delta}' }
      },
      note: 'Both signals continue to the brain on fast fibres, which adds the same few tens of milliseconds to each, so the gap is set in the limb. It is longest for the feet and hardly noticeable for the face.',
      practice: { unknowns: ['dt', 'd'] },
      stories: { dt: 'Someone stubs a toe {d} from the spinal cord. With C fibres at {vC} and Aδ fibres at {vA}, how long after the sharp pain does the dull pain arrive?' }
    }
  ],
  examples: [
    {
      title: 'Two pains from one toe',
      q: 'A tall man stubs his toe; the path to the spinal cord is 1.5 m. With Aδ fibres at 15 m/s and C fibres at 1 m/s, when does each signal reach the cord, and what is the gap?',
      steps: [
        'Aδ: $1.5/15 = 0.1$ s.',
        'C: $1.5/1 = 1.5$ s.',
        'Gap: $1.5 - 0.1 = 1.4$ s — long enough to notice the sharp pain, think "that will hurt", and then feel the ache arrive.'
      ],
      a: '0.1 s and 1.5 s: the dull pain follows about 1.4 s later.'
    },
    {
      title: 'Pain in the arm, problem in the chest',
      q: 'A 58-year-old feels a heavy ache down his left arm and into his jaw while climbing stairs, easing when he rests. Why might the problem be in his heart?',
      steps: [
        'Pain signals from the heart enter the spinal cord at the same upper chest segments (about T1–T4) as nerves from the inner arm and chest wall.',
        'The brain, used to signals from the skin and rarely from the heart, attributes the pain to the arm and jaw — referred pain.',
        'Pain brought on by exertion and relieved by rest is typical of angina, a warning of narrowed coronary arteries; if it comes at rest or lasts more than a few minutes it may be a heart attack.'
      ],
      a: 'Heart pain is referred along shared spinal segments to the arm and jaw. Chest, arm or jaw pain like this at rest is an emergency: call your local emergency number.'
    }
  ],
  quiz: [
    { q: 'Why does rubbing a bumped elbow ease the pain?', choices: ['Touch signals dampen pain transmission in the spinal cord', 'Rubbing removes the damaged tissue', 'It warms the nociceptors so they stop firing', 'It releases adrenaline into the blood'], a: 0,
      why: 'In the gate control idea, activity in large touch fibres inhibits the dorsal-horn neurons that relay pain.' },
    { q: 'Two people with the same damage on an X-ray will feel about the same pain.', a: false,
      why: 'Pain depends on how the nervous system processes the signals — attention, mood, fear, sleep and sensitisation — not on the image alone.' },
    { q: 'Which description suggests neuropathic pain?', choices: ['Burning, electric, shooting pain with numbness in the feet', 'Throbbing pain around a fresh cut', 'Aching in a sprained ankle that is worse when walking', 'Pain in a swollen, hot joint'], a: 0,
      why: 'Burning, electric or shooting pain with numbness or pins and needles points to damaged nerves, as in diabetic neuropathy.' },
    { q: 'An injury is 0.8 m from the spinal cord. With C fibres at 1 m/s and Aδ fibres at 16 m/s, how many seconds separate first and second pain?', answer: 0.75, unit: 's',
      why: '0.8/1 − 0.8/16 = 0.8 − 0.05 = 0.75 s.' },
    { q: 'Pain at the tip of the right shoulder after an abdominal injury can come from…', choices: ['irritation of the diaphragm, which shares nerve segments with the shoulder', 'a shoulder fracture only', 'the heart', 'the kidneys'], a: 0,
      why: 'The diaphragm is supplied from the neck (C3–C5), the same segments as the skin over the shoulder tip — a classic referred pain.' }
  ],
  applications: ['Local anaesthesia and nerve blocks that stop pain signals before they reach the spinal cord.', 'Multidisciplinary pain clinics combining exercise, psychological therapy and medicines.', 'Recognising referred pain in heart attacks, appendicitis and injuries below the diaphragm.', 'Transcutaneous electrical nerve stimulation (TENS), which uses the gate idea.'],
  history: 'Ronald Melzack and Patrick Wall\'s gate control theory (1965) replaced the idea of pain as a simple alarm line from body to brain and opened the way to the modern view of pain as something the nervous system modulates.',
  sim: { id: 'neu-reflex', params: { scene: 'pain' } }
}

);
