/* HYPER-MEDICINE · content/neuro-disease.js — Brain and Nerves: neurological disease.
 * Stroke, epilepsy, dementia, Parkinson's disease, headache and migraine, multiple sclerosis.
 * Simulations: sims/neuro.js (neu-stroke-clock, neu-eeg, neu-synapse, neu-reflex). */
Hyper.add(

{
  id: 'stroke', parent: 'neuro-disease', title: 'Stroke', level: 1,
  short: 'A blocked or burst artery in the brain. Brain cells start dying within minutes — about 1.9 million a minute in a typical large stroke — so the signs (BE-FAST) and an immediate call to the emergency number save brain, function and life.',
  keywords: ['stroke', 'brain attack', 'FAST', 'BE-FAST', 'ischaemic stroke', 'haemorrhagic stroke', 'transient ischaemic attack', 'TIA', 'mini-stroke', 'thrombolysis', 'clot-busting', 'thrombectomy', 'time is brain', 'atrial fibrillation', 'stroke unit', 'rehabilitation', 'subarachnoid haemorrhage'],
  prereq: ['brain-regions', 'blood-vessels', 'atherosclerosis'],
  related: ['recognising-emergencies', 'hypertension', 'arrhythmias', 'hemostasis', 'cholesterol-lipids', 'smoking', 'risk-communication', 'headache-migraine', 'vision'],
  body: `
On a Sunday morning a 68-year-old man tries to lift his coffee cup and his right hand will not close around it. His wife notices that the right side of his mouth droops and that his words come out jumbled. She knows the signs: she calls the emergency number, tells the dispatcher "I think my husband is having a stroke — it started at 9:10", and does not give him anything to eat, drink or swallow. Seventy minutes later a clot-dissolving medicine is running into his arm; an hour after that a catheter pulls the clot from his brain. He goes home a week later, walking and talking. Minutes made the difference.

> [!warn] **Think BE-FAST — and call your local emergency number at once:**
> - **B**alance — sudden loss of balance, dizziness or trouble walking
> - **E**yes — sudden loss of vision in one or both eyes, or double vision
> - **F**ace — one side of the face droops (ask them to smile)
> - **A**rms — one arm or leg is weak or numb (ask them to raise both arms)
> - **S**peech — slurred, jumbled or missing words, or not understanding
> - **T**ime — even if the signs fade, call your local emergency number **immediately and note the time the symptoms started** (or when the person was last seen well).

> [!key] While you wait: do not drive the person yourself if an ambulance can come — the crew can alert the stroke team on the way. Do not give food, drink or medicines, including aspirin, which is dangerous if the stroke is a bleed. If the person becomes unresponsive but is breathing, place them in the recovery position; if they stop breathing normally, start [[cpr|CPR]] and follow the dispatcher's instructions.

FAST (face, arms, speech, time) is the older and still widely taught version; adding balance and eyes catches more strokes of the back of the brain.

### Two kinds of stroke
- **Ischaemic stroke** — an artery is blocked by a clot that formed on a fatty plaque ([[atherosclerosis|atherosclerosis]]), travelled from the heart (often in [[arrhythmias|atrial fibrillation]], which multiplies stroke risk about five times), or blocked a tiny deep vessel damaged by high blood pressure. In high-income countries about 85 % of strokes are ischaemic; worldwide the share is lower, about 62 % (Global Burden of Disease, 2019).
- **Haemorrhagic stroke** — a vessel bursts: into the brain (intracerebral haemorrhage, mostly from high blood pressure) or around it (subarachnoid haemorrhage, usually from a ruptured aneurysm, felt as a sudden, explosive "worst ever" headache).

A **transient ischaemic attack** (TIA, "mini-stroke") gives the same signs but they vanish, usually within minutes. It is a warning: the risk of a full stroke is highest in the next hours and days, and urgent assessment and treatment cut it by about 80 % (the EXPRESS study, 2007).

### Why time matters
The blocked artery leaves a **core** of brain that dies quickly, surrounded by a larger **penumbra** kept barely alive by blood from neighbouring vessels. Hour by hour the core eats into the penumbra. In a typical large-artery stroke, Jeffrey Saver estimated (2006) that each minute without treatment costs about **1.9 million neurons**, 14 billion synapses and 12 km of nerve fibres — each hour ages the brain by about 3.6 years' worth of normal loss.

$$N_\\text{lost} = r \\times t$$

Treatments reopen the artery and rescue the penumbra — but only while there is penumbra left:

- **Thrombolysis** — a clot-dissolving medicine (alteplase or tenecteplase) given into a vein, generally within **4.5 hours** of onset. First a CT or MRI scan must rule out bleeding. Its benefit falls steadily with time: in a pooled analysis of trials (Emberson and colleagues, 2014) the odds of a good outcome were raised by about 75 % when treatment started within 3 hours, 26 % between 3 and 4.5 hours, and not clearly at all later.
- **Thrombectomy** — a catheter threaded from the groin or wrist to pull out a clot from a large artery, within **6 hours**, and in selected patients whose scans show brain still worth saving, up to **24 hours** (the DAWN and DEFUSE 3 trials, 2018). In the pooled HERMES analysis (2016), 46 % of treated patients were independent at three months against 26.5 % with usual care.

Hospitals measure every step — the "door-to-needle" time is expected to be under an hour and the best centres manage well under 30 minutes. The one step they cannot shorten is the one before the call.

### After a stroke
Care in a dedicated **stroke unit** saves lives and reduces disability. Rehabilitation — physiotherapy, occupational and speech therapy — uses the brain's plasticity and brings the largest gains in the first months. Preventing the next stroke means controlling blood pressure (the largest single risk factor), anticoagulant medicines for atrial fibrillation, antiplatelet and cholesterol-lowering medicines after ischaemic stroke, and stopping smoking. Depression after stroke is common and treatable.

### Who has strokes
About 12 million people have a stroke each year and about 7 million die of one (Global Burden of Disease, 2021): stroke is among the top three causes of death worldwide. Roughly one adult in four will have a stroke in their lifetime (GBD 2016 estimate). The INTERSTROKE study (2016) found that ten modifiable factors account for about 90 % of the risk: [[hypertension|high blood pressure]] above all, together with inactivity, unhealthy diet, abdominal obesity, blood fats, smoking, heart causes, diabetes, alcohol and stress.
`,
  ideas: [
    'BE-FAST: balance, eyes, face, arms, speech — time to call your local emergency number and note when symptoms began.',
    'Most strokes are clots (ischaemic); the rest are bleeds, and only a scan can tell them apart.',
    'In a typical large stroke about 1.9 million neurons die every minute without treatment.',
    'Clot-dissolving medicine within 4.5 hours and clot removal within 6 (selected up to 24) hours rescue brain — the earlier the better.',
    'A TIA whose symptoms vanish is still an emergency: the risk of a full stroke is highest in the following days.'
  ],
  pitfalls: [
    'If the symptoms go away, there is no need to call — Vanishing symptoms may be a TIA, a warning of a major stroke; call the emergency number anyway.',
    'Give the person an aspirin while waiting — About one stroke in six in high-income countries, and more than a third worldwide, is a bleed, which aspirin can worsen; nothing should be given by mouth before a scan.',
    'Strokes only happen to old people — Risk rises steeply with age, but roughly 10–15 % of strokes occur in adults under 50, and strokes also happen in children.'
  ],
  formulas: [
    {
      name: 'Brain cells lost while waiting',
      expr: 'N = r*t', tex: 'N_\\text{lost} = r \\, t',
      vars: {
        N: { name: 'neurons lost', tex: 'N_\\text{lost}' },
        r: { name: 'rate of loss in a typical large-artery stroke', q: 'rate', unit: '1/min', value: 1.9e6 },
        t: { name: 'time without reperfusion', q: 'time', unit: 'min', value: 60 }
      },
      note: 'Saver\'s estimate (Stroke, 2006), an average over a typical large ischaemic stroke that evolves over about 10 hours. Strokes vary enormously — small strokes lose far fewer cells, and the rate is not constant — but the lesson is robust: every minute counts.',
      practice: { unknowns: ['N', 't'] },
      stories: { N: 'A family waits {t} before calling for help. At {r}, about how many neurons are lost in that time?', t: 'How long does it take to lose {N} neurons at {r}?' }
    },
    {
      name: 'Number needed to treat',
      expr: 'NNT = 1/(pT - pC)', tex: '\\text{NNT} = \\frac{1}{p_T - p_C}',
      vars: {
        NNT: { name: 'number needed to treat for one extra good outcome', tex: '\\text{NNT}' },
        pT: { name: 'good outcomes with treatment', q: 'ratio', unit: '%', value: 46, tex: 'p_T' },
        pC: { name: 'good outcomes without it', q: 'ratio', unit: '%', value: 26.5, tex: 'p_C' }
      },
      note: 'The defaults are from the HERMES pooled analysis of thrombectomy (2016): independence at 90 days in 46 % against 26.5 %. See [[risk-communication]] for absolute and relative risk.',
      practice: { unknowns: ['NNT', 'pT'] },
      stories: { NNT: 'With treatment {pT} of patients are independent at three months, without it {pC}. How many must be treated for one extra independent patient?' }
    }
  ],
  examples: [
    {
      title: 'The hour spent hoping it would pass',
      q: 'A woman wakes her husband at midnight: her arm feels strange and heavy. They wait an hour to see whether it improves before calling. In a typical large-artery stroke, what might that hour cost?',
      steps: [
        '$N = 1.9 \\times 10^6 \\times 60 = 1.14 \\times 10^8$ neurons — about 114 million.',
        'Saver\'s figures also give about 830 billion synapses and 720 km of nerve fibres for the hour — the loss of about 3.6 years of normal ageing.',
        'The hour also pushes treatment later on the curve where clot-dissolving medicine helps less, and may take her past its 4.5-hour window.'
      ],
      a: 'Roughly 114 million neurons — the equivalent of several years of brain ageing. The right move is to call at once and note the time.'
    },
    {
      title: 'What "NNT 5" means',
      q: 'In the HERMES analysis 46 % of patients who had a clot removed were independent at 90 days, against 26.5 % with usual care. How many patients must be treated for one more to be independent?',
      steps: [
        'Absolute difference: $46 - 26.5 = 19.5$ percentage points.',
        '$\\text{NNT} = 1/0.195 = 5.1$.',
        'For every five people treated, one more walks out independent who otherwise would not — an exceptionally large effect for any treatment in medicine.'
      ],
      a: 'About 5.'
    }
  ],
  quiz: [
    { q: 'A colleague\'s face suddenly droops and her speech is slurred, but after ten minutes she feels fine. What should happen?', choices: ['Call the emergency number now: it may be a TIA, a warning of a major stroke', 'Nothing — it has passed', 'Book a routine appointment with her doctor next week', 'Give her an aspirin and watch her'], a: 0,
      why: 'Symptoms that vanish can be a TIA; the risk of a stroke is highest in the next hours and days, and urgent treatment cuts it by about 80 %.' },
    { q: 'Why must a scan be done before clot-dissolving medicine is given?', choices: ['To rule out bleeding, which the medicine would worsen', 'To measure the brain', 'To find the patient\'s blood group', 'Because the medicine needs imaging dye'], a: 0,
      why: 'Clots and bleeds cause the same signs; only imaging tells them apart, and thrombolysis in a haemorrhage would be disastrous.' },
    { q: 'At about 1.9 million neurons a minute, how many neurons are lost in a 30-minute delay?', answer: 5.7e7,
      why: '1.9 × 10⁶ × 30 = 5.7 × 10⁷ — about 57 million.' },
    { q: 'Which BE-FAST sign is checked by asking the person to raise both arms?', choices: ['A — one arm drifts down or cannot be lifted', 'B — balance', 'F — face', 'E — eyes'], a: 0,
      why: 'Weakness of one arm makes it drift down or fail to rise; ask the person to hold both arms out with the eyes closed.' },
    { q: 'Clot-dissolving medicine works equally well whenever it is given within 4.5 hours.', a: false,
      why: 'The benefit falls steadily with time: the earlier within the window, the more brain is saved.' }
  ],
  applications: ['Public BE-FAST campaigns and dispatcher protocols that recognise strokes on the phone.', 'Pre-alerted stroke teams, rapid CT, thrombolysis and thrombectomy pathways.', 'Anticoagulation for atrial fibrillation and blood-pressure control to prevent strokes.', 'Stroke units and rehabilitation.'],
  history: 'The phrase "time is brain" was popularised in the 1990s as clot-dissolving treatment arrived (the NINDS trial, 1995); Jeffrey Saver\'s 2006 paper put numbers on it.',
  sim: 'neu-stroke-clock'
},

{
  id: 'epilepsy', parent: 'neuro-disease', title: 'Epilepsy', level: 2,
  short: 'A tendency to recurrent seizures — bursts of excessive, synchronised electrical activity in the brain. It affects about 50 million people; most can become seizure-free with treatment, and everyone can learn what to do (and not do) during a seizure.',
  keywords: ['epilepsy', 'seizure', 'fit', 'convulsion', 'tonic-clonic', 'absence seizure', 'focal seizure', 'status epilepticus', 'anti-seizure medicine', 'EEG', 'febrile seizure', 'photosensitive epilepsy', 'SUDEP', 'seizure first aid', 'recovery position', 'epilepsy surgery'],
  prereq: ['action-potential', 'brain-regions', 'synapses'],
  related: ['first-aid-basics', 'sleep', 'stroke', 'injuries-fractures', 'pregnancy', 'hypoglycemia', 'alcohol'],
  body: `
In a supermarket queue a young man cries out, falls and stiffens; then his arms and legs jerk rhythmically, his breathing is noisy and his lips turn dusky. It lasts about ninety seconds. Afterwards he is drowsy and confused, and embarrassed. Most onlookers freeze or do the wrong thing — trying to hold him down, pushing something between his teeth. The right things are simple, and anyone can learn them.

> [!warn] **What to do during a seizure with jerking (tonic–clonic):**
> - **Stay calm, stay with the person and time the seizure.**
> - Move hard or sharp objects away; cushion the head with something soft; loosen anything tight around the neck; remove glasses.
> - **Do not hold them down or stop the movements. Do not put anything in their mouth** — people cannot swallow their tongue, and objects break teeth and cause injuries.
> - When the jerking stops, roll them onto their side into the **recovery position** and check that they are breathing. Stay, speak calmly and reassure them until they are fully aware.
> - If the person carries an emergency care plan with rescue medicine prescribed for them, follow that plan.
>
> If the seizure lasts **more than 5 minutes**, another follows before they recover, it is their first seizure (or you do not know), they are injured, in water, pregnant or have diabetes, they have trouble breathing afterwards, or they do not wake up: **call your local emergency number**.

### What a seizure is
Normally neurons fire in varied, loosely coordinated patterns, held in check by inhibition. In a seizure a population of neurons fires excessively and in lock-step, and the activity may stay in one area or spread. What the person experiences depends on where it happens:

- **Focal seizures** start in one area. In the temporal lobe they may begin with a rising feeling in the stomach, a smell or déjà vu (an "aura" is the start of the seizure), then the person may stare, smack their lips and fumble with their hands, unaware. In the motor cortex they cause jerking of one hand that may spread up the arm. Awareness may be kept or lost.
- **Generalised seizures** involve both hemispheres from the start: **tonic–clonic** (stiffening, then jerking), **absence** (a blank stare for about 10 seconds, often many times a day in children, easily mistaken for daydreaming), **myoclonic** (brief jerks) and **atonic** (sudden falls).
- A focal seizure can spread to become **focal to bilateral tonic–clonic**.

The International League Against Epilepsy (2014) defines **epilepsy** as two unprovoked seizures more than 24 hours apart, or one with a high risk of more (for example with a matching EEG or scan finding). A single seizure caused by an obvious provoking factor — very low blood sugar, alcohol withdrawal, a high fever in a young child — is not epilepsy. **Febrile seizures** affect about 2–5 % of children between 6 months and 5 years and are usually harmless, but a first one is frightening and should be checked by a doctor.

### Causes and diagnosis
Causes include genetic tendencies, brain injury, stroke, tumours, infections (including neurocysticercosis, a tapeworm infection that is a leading preventable cause in parts of the world), and developmental conditions; in many people no cause is found. Diagnosis rests mostly on a clear description — a **phone video** by a witness is invaluable — supported by an **EEG** and an MRI scan. Things that commonly trigger seizures in people with epilepsy are missed medicine, lack of sleep, alcohol and illness; flashing lights trigger seizures in only about 3 % of people with epilepsy.

### Treatment and living with epilepsy
The WHO (2024) estimates that about 50 million people have epilepsy, 80 % of them in low- and middle-income countries, where most do not receive treatment — although up to 70 % could live seizure-free with inexpensive medicines. About half of people become seizure-free on the first **anti-seizure medicine** and about two-thirds overall. When two well-chosen medicines have failed, the epilepsy is called drug-resistant, and specialists consider **epilepsy surgery** (which can cure selected focal epilepsies), nerve stimulation or a medically supervised ketogenic diet.

Some practical points to discuss with the medical team: never stop anti-seizure medicine suddenly, because that can provoke prolonged seizures; some medicines (notably valproate) carry serious risks in pregnancy, so anyone who could become pregnant should plan with their doctor; driving rules differ between countries and usually require a period free of seizures. Rarely, a person with frequent, uncontrolled tonic–clonic seizures dies suddenly (SUDEP, about 1 in 1000 adults with epilepsy a year) — one of several reasons good seizure control matters. Most people with epilepsy study, work, have families and live full lives; stigma is often the bigger burden.
`,
  ideas: [
    'A seizure is excessive, synchronised firing of neurons; what it looks like depends on where in the brain it happens.',
    'During a seizure: time it, protect the head, do not restrain, put nothing in the mouth, recovery position afterwards.',
    'Call the emergency number if it lasts more than 5 minutes, repeats, is a first seizure, or the person is injured, in water or does not wake.',
    'Epilepsy means an enduring tendency to unprovoked seizures; about two-thirds of people become seizure-free on medicine.',
    'A witness\'s description or phone video is often the most useful diagnostic test.'
  ],
  pitfalls: [
    'Put something in the person\'s mouth so they do not swallow their tongue — It is impossible to swallow the tongue; objects in the mouth break teeth and injure both people.',
    'Hold the person down to stop the jerking — Restraint cannot stop a seizure and causes injuries; clear the space and let it run its course.',
    'Most people with epilepsy are sensitive to flashing lights — Only about 3 % are photosensitive; lack of sleep, missed medicine and alcohol are commoner triggers.'
  ],
  examples: [
    {
      title: 'A seizure at the bus stop',
      q: 'An older woman at a bus stop falls and starts jerking. Nobody knows her. What should you do, step by step?',
      steps: [
        'Note the time. Move people and the bag with sharp corners away; put a folded coat under her head; loosen her scarf.',
        'Do not hold her or put anything in her mouth. Check for a medical bracelet or card, which may describe her epilepsy and care plan.',
        'Because nobody knows whether this is her first seizure, call the emergency number. If the jerking passes 5 minutes, say so.',
        'When the jerking stops, roll her onto her side in the recovery position and watch her breathing. Stay with her, speak calmly, and tell the crew what you saw and how long it lasted.'
      ],
      a: 'Time it, protect, do not restrain, nothing in the mouth, recovery position afterwards — and call because this may be a first seizure.'
    },
    {
      title: 'Faint or seizure?',
      q: 'A teenager stands for a long time in a hot church, goes pale, sways and collapses; her arms jerk a few times for a couple of seconds and within a minute she is awake and knows where she is. Is this more likely a faint or a seizure?',
      steps: [
        'A trigger (long standing, heat), warning signs (pallor, feeling hot or light-headed) and a quick recovery suggest a faint (vasovagal syncope).',
        'A few brief jerks are common in fainting, because the brain is briefly short of blood — they do not by themselves mean a seizure.',
        'A tonic–clonic seizure usually lasts one to three minutes, with rhythmic jerking and a period of confusion and drowsiness afterwards.',
        'A first episode should still be assessed by a doctor, and a witness\'s account (or video) is the most useful evidence.'
      ],
      a: 'Most likely a faint; a doctor should still assess a first episode.'
    }
  ],
  quiz: [
    { q: 'During a tonic–clonic seizure, which action is right?', choices: ['Cushion the head and time the seizure', 'Hold the arms and legs still', 'Put a spoon between the teeth', 'Give a drink of water'], a: 0,
      why: 'Protect from injury and time it; restraint and objects in the mouth cause harm, and nothing should be given by mouth until the person is fully awake.' },
    { q: 'A seizure has lasted 6 minutes and is still going on. What should you do?', choices: ['Call the emergency number now', 'Wait until it stops, then decide', 'Splash water on the face', 'Try to wake the person by shaking'], a: 0,
      why: 'A seizure lasting more than 5 minutes may not stop by itself (status epilepticus) and needs emergency treatment.' },
    { q: 'A person having a seizure can swallow their tongue.', a: false,
      why: 'The tongue is attached and cannot be swallowed; putting the person on their side afterwards keeps the airway clear.' },
    { q: 'A 7-year-old "daydreams" many times a day, staring blankly for about ten seconds and then carrying on. Which seizure type could this be?', choices: ['Absence seizures', 'Tonic–clonic seizures', 'Febrile seizures', 'Faints'], a: 0,
      why: 'Absence seizures are brief generalised seizures with a blank stare and a sudden return, often many times a day; the EEG shows 3-per-second spike-and-wave.' },
    { q: 'About what fraction of people with epilepsy become seizure-free with medicine?', choices: ['About two-thirds', 'Almost none', 'About 10 %', 'Everyone'], a: 0,
      why: 'About half respond to the first medicine and about two-thirds overall; the rest may benefit from surgery or other treatments.' }
  ],
  applications: ['Seizure first-aid training in schools and workplaces.', 'EEG and video-EEG monitoring to classify seizures and find where they start.', 'Epilepsy surgery for drug-resistant focal epilepsy.', 'Closing the treatment gap in low-income countries with inexpensive medicines.'],
  history: 'In the 1870s John Hughlings Jackson proposed that seizures are "occasional, sudden, excessive discharges" of grey matter, from watching focal jerking march up a limb; in 1929 Hans Berger published the first recordings of the human EEG.',
  sim: { id: 'neu-eeg', params: { state: 'temporal' } }
},

{
  id: 'dementia', parent: 'neuro-disease', title: 'Dementia and Alzheimer\'s disease', level: 2,
  short: 'A decline in memory and thinking severe enough to affect daily life, caused by diseases of the brain — Alzheimer\'s most often. It is not a normal part of ageing, and a large share of it may be preventable.',
  keywords: ['dementia', 'Alzheimer\'s disease', 'memory loss', 'amyloid', 'tau', 'vascular dementia', 'Lewy body dementia', 'frontotemporal dementia', 'mild cognitive impairment', 'delirium', 'cholinesterase inhibitor', 'memantine', 'lecanemab', 'donanemab', 'risk factors', 'carers'],
  prereq: ['brain-regions', 'synapses', 'ageing'],
  related: ['hearing-balance', 'hypertension', 'physical-activity', 'depression', 'type2-diabetes', 'cholesterol-lipids', 'parkinsons', 'stroke', 'epidemiology'],
  body: `
Her daughter noticed it first: the same question asked twice in one phone call, a pan left on the stove, the bills unpaid for the first time in fifty years. Her mother laughed it off as "just getting old". But ordinary ageing slows recall — it does not steal whole recent conversations or the ability to manage money. After tests and a scan the diagnosis was early Alzheimer's disease. Knowing it early let the family plan, get support and make decisions together while she could still take part.

### What dementia is
**Dementia** is not one disease but a syndrome: a decline in memory, thinking, language, judgement or behaviour, bad enough to interfere with everyday life. The WHO (2023) estimated about 57 million people with dementia in 2021, with nearly 10 million new cases a year; it is one of the leading causes of death and dependency in older age. Risk rises steeply with age — the share of people affected roughly doubles every five years after 65 — but dementia is **not** a normal part of growing old, and it also affects people under 65 (young-onset dementia).

| Type | Share of cases | Typical features |
|---|---|---|
| Alzheimer's disease | about 60–70 % | recent memory first, then language, orientation, planning; slow and steady |
| Vascular dementia | common, often mixed with Alzheimer's | slowed thinking and planning; may worsen in steps after strokes |
| Dementia with Lewy bodies | several per cent | fluctuating alertness, vivid visual hallucinations, parkinsonism, acting out dreams |
| Frontotemporal dementia | a smaller share, often before 65 | changes in personality and behaviour, or in language, before memory |

### Alzheimer's disease
Two abnormal proteins accumulate: **amyloid-β** in plaques between neurons, starting perhaps 15–20 years before symptoms, and **tau** in tangles inside them. Synapses fail and neurons die, starting in the hippocampus and nearby temporal lobe — hence recent memory first — and spreading across the cortex. Acetylcholine-producing neurons are hit early, which is why **cholinesterase inhibitors** (donepezil, rivastigmine, galantamine) give a modest improvement in symptoms for some people; **memantine**, which damps glutamate signalling, is used in later stages.

Newer **anti-amyloid antibodies** (lecanemab, donanemab) clear amyloid from the brain and, in trials, slowed decline in early Alzheimer's disease by roughly a quarter to a third over 18 months. They were approved in the US in 2023–2024 and later in some other countries, with restrictions: they require confirmed amyloid, regular MRI scans, and carry a risk of brain swelling and small bleeds (ARIA), higher in people with two copies of the APOE ε4 gene variant. Whether the benefit is worth the burden and cost is still debated, and public health systems differ in whether they fund them.

### Dementia or delirium?
**Delirium** is a sudden confusion — over hours or days — with fluctuating attention, often caused by an infection, dehydration, medicines, pain or constipation, especially in older people and those with dementia. Unlike dementia it is usually reversible, and it needs prompt medical attention. Treatable causes of memory problems — low vitamin B12, an underactive thyroid, depression, side effects of medicines, sleep apnoea — are checked before dementia is diagnosed.

### Can it be prevented?
The Lancet Commission on dementia (2024) estimated that about **45 %** of dementia worldwide is linked to 14 modifiable risk factors across life: less education in childhood; in midlife hearing loss, high LDL cholesterol, depression, head injury, physical inactivity, diabetes, smoking, high blood pressure, obesity and excessive alcohol; and in later life social isolation, air pollution and untreated vision loss. Hearing loss and high LDL cholesterol were the largest single contributors (about 7 % each). These are estimates from observational research, not guarantees for an individual — but what is good for the heart is good for the brain.

### Living with dementia
Care focuses on the person: keeping active and connected, adapting the home, managing other illnesses, avoiding medicines that worsen confusion, and supporting **carers**, who do most of the work and often need help themselves. Planning early — legal and financial arrangements, wishes about future care — lets people shape their own future.

> [!warn] **Sudden** confusion, drowsiness or a sharp change in behaviour over hours or days is not dementia progressing: it may be delirium from an infection or other illness, or a stroke, and needs medical help the same day. If the person is very drowsy, has a high fever, or shows FAST signs (face drooping, arm weakness, speech trouble), call your local emergency number.
`,
  ideas: [
    'Dementia is a decline in thinking that interferes with daily life, caused by brain disease — not normal ageing.',
    'Alzheimer\'s disease, with amyloid plaques and tau tangles starting in the hippocampus, causes 60–70 % of cases.',
    'Current medicines ease symptoms modestly; anti-amyloid antibodies slow early Alzheimer\'s a little, at a real cost in risks.',
    'Sudden confusion is delirium or stroke until proven otherwise — an urgent medical problem.',
    'About 45 % of dementia worldwide is linked to modifiable risk factors such as hearing loss, blood pressure and inactivity.'
  ],
  pitfalls: [
    'Dementia is a normal part of getting old — Most older people never develop dementia; mild slowing of recall is normal, but losing the ability to manage daily life is not.',
    'Nothing can be done after a diagnosis — There is no cure yet, but treatments, support, planning, and care of hearing, mood and other illnesses improve life for years.',
    'Any memory complaint in an older person means Alzheimer\'s disease — Depression, vitamin B12 deficiency, thyroid disease, medicines, sleep problems and delirium can all mimic it, and several are treatable.'
  ],
  formulas: [
    {
      name: 'How dementia becomes commoner with age',
      expr: 'P = P0*2^((age - a0)/Td)', tex: 'P = P_0 \\cdot 2^{(\\text{age} - a_0)/T_d}',
      vars: {
        P: { name: 'share of people with dementia', q: 'ratio', unit: '%' },
        P0: { name: 'share at the reference age', q: 'ratio', unit: '%', value: 1.5, fixed: true, tex: 'P_0' },
        age: { name: 'age (years)', value: 80, tex: '\\text{age}' },
        a0: { name: 'reference age (years)', value: 65, fixed: true, tex: 'a_0' },
        Td: { name: 'doubling time (years)', value: 5, tex: 'T_d' }
      },
      note: 'A rough rule for high-income countries: about 1.5 % at 65, doubling every five years. It works to about 85 (roughly 20–25 %); beyond that the rise slows. Rates vary between countries and have been falling slightly in some, as education and heart health improve.',
      practice: { unknowns: ['P', 'age'] },
      stories: { P: 'Using the doubling rule, what share of people aged {age} have dementia?', age: 'At what age does the doubling rule give {P} with dementia?' }
    },
    {
      name: 'Share of cases linked to a risk factor (population attributable fraction)',
      expr: 'PAF = p*(RR - 1)/(1 + p*(RR - 1))', tex: '\\text{PAF} = \\frac{p\\,(\\text{RR} - 1)}{1 + p\\,(\\text{RR} - 1)}',
      vars: {
        PAF: { name: 'population attributable fraction', q: 'ratio', unit: '%', tex: '\\text{PAF}' },
        p: { name: 'share of the population with the risk factor', q: 'ratio', unit: '%', value: 31.7 },
        RR: { name: 'relative risk of dementia with the factor', value: 1.9, tex: '\\text{RR}' }
      },
      note: 'Levin\'s formula: the share of cases that would not occur if the risk factor were removed, assuming it truly causes them. The defaults are the midlife hearing-loss figures used by the Lancet Commission in 2020 (22 % before allowing for overlap between factors; much less after). See [[epidemiology]].',
      practice: { unknowns: ['PAF', 'RR'] },
      stories: { PAF: '{p} of people have a risk factor that raises dementia risk by a relative risk of {RR}. What share of dementia is attributable to it?' }
    }
  ],
  examples: [
    {
      title: 'Doubling every five years',
      q: 'Using the rule "about 1.5 % at 65, doubling every five years", estimate the share with dementia at 75 and 85, and say where the rule breaks down.',
      steps: [
        'At 75: two doublings, $1.5 \\times 2^2 = 6$ %.',
        'At 85: four doublings, $1.5 \\times 2^4 = 24$ % — close to surveys, which find about a fifth to a quarter of people in their late eighties affected.',
        'At 90 the rule gives 48 %, too high: surveys find around 30–40 %, because the rise slows in the oldest ages.'
      ],
      a: 'About 6 % at 75 and 24 % at 85; the rule overshoots beyond about 85.'
    },
    {
      title: 'How much dementia is linked to hearing loss?',
      q: 'Suppose 31.7 % of people in midlife have hearing loss, and hearing loss carries a relative risk of dementia of 1.9. What share of dementia would be attributable to it?',
      steps: [
        '$p\\,(RR - 1) = 0.317 \\times 0.9 = 0.285$.',
        '$\\text{PAF} = 0.285/1.285 = 0.222$, about 22 %.',
        'Risk factors overlap (the same people often have several), so the Commission adjusted the combined figures downwards — to about 8 % for hearing loss in 2020 and 7 % in 2024. Whether treating hearing loss prevents dementia is being tested in trials.'
      ],
      a: 'About 22 % before adjusting for overlap between risk factors.'
    }
  ],
  quiz: [
    { q: 'Over two days an 84-year-old with mild dementia becomes much more confused and drowsy, with a fever. What is most likely?', choices: ['Delirium, probably from an infection — she needs prompt medical care', 'Her dementia has suddenly moved to the last stage', 'Normal fluctuation of Alzheimer\'s disease', 'Too little sleep'], a: 0,
      why: 'A sudden change over hours or days points to delirium, often from infection; it is urgent and usually reversible.' },
    { q: 'Dementia is an unavoidable part of normal ageing.', a: false,
      why: 'Risk rises with age, but most older people never develop dementia, and a large share of cases is linked to modifiable risk factors.' },
    { q: 'Why is recent memory usually lost first in Alzheimer\'s disease?', choices: ['The disease starts in and around the hippocampus, which stores new memories', 'The frontal lobes shrink first', 'Old memories are stored in the cerebellum', 'The optic nerve is damaged'], a: 0,
      why: 'Tangles and neuron loss begin in the medial temporal lobe; the hippocampus is needed to lay down new memories, while older ones are stored more widely.' },
    { q: 'A risk factor affects 20 % of the population and doubles the risk of dementia (RR = 2). What percentage of dementia is attributable to it?', answer: 16.7, unit: '%',
      why: 'PAF = 0.2 × 1 / (1 + 0.2 × 1) = 0.2/1.2 = 0.167.' },
    { q: 'Which is the most common cause of dementia?', choices: ['Alzheimer\'s disease', 'Frontotemporal dementia', 'Vitamin deficiency', 'Head injury'], a: 0,
      why: 'Alzheimer\'s disease accounts for about 60–70 % of dementia, often mixed with vascular changes.' }
  ],
  applications: ['Memory clinics and early diagnosis with cognitive tests, scans and biomarkers.', 'Public health measures on blood pressure, hearing, activity and education that may lower dementia rates.', 'Support services for people with dementia and their carers.', 'Recognising delirium in hospitals and care homes.'],
  history: 'In 1906 Alois Alzheimer described plaques and tangles in the brain of Auguste Deter, who had developed memory loss and confusion in her early fifties.',
  sim: { id: 'neu-synapse', params: { mode: 'ach' } }
},

{
  id: 'parkinsons', parent: 'neuro-disease', title: 'Parkinson\'s disease', level: 2,
  short: 'A slow loss of the dopamine neurons that help start and scale movements, causing slowness, stiffness and a resting tremor — plus many non-movement symptoms. It is the fastest-growing neurological condition, and medicines, exercise and surgery control it for many years.',
  keywords: ['Parkinson\'s disease', 'dopamine', 'substantia nigra', 'basal ganglia', 'tremor', 'bradykinesia', 'rigidity', 'levodopa', 'dopamine agonist', 'deep brain stimulation', 'alpha-synuclein', 'Lewy bodies', 'REM sleep behaviour disorder', 'loss of smell', 'dyskinesia', 'wearing off'],
  prereq: ['brain-regions', 'synapses', 'neurons'],
  related: ['dementia', 'sleep', 'half-life-dosing', 'physical-activity', 'depression', 'side-effects-interactions', 'ageing'],
  body: `
For years a retired engineer put it down to age: his handwriting shrank, his sense of smell faded, his wife complained that he thrashed about acting out his dreams, and he was constipated. Then a slight tremor appeared in his right hand when it rested on his knee, disappearing when he reached for his cup, and his right arm stopped swinging as he walked. By the time Parkinson's disease was diagnosed, it had probably been developing for a decade.

### What goes wrong
Deep in the midbrain, a small cluster of dark neurons — the **substantia nigra** — sends dopamine to the **basal ganglia**, circuits that select movements and set their size and speed. In Parkinson's disease these neurons die slowly, and a protein, **alpha-synuclein**, clumps inside them (Lewy bodies). By the time movement symptoms appear, roughly half or more of the nigral neurons, and a larger share of the dopamine they deliver, have been lost: the brain compensates for a long time. Synuclein changes also affect the gut, the smell pathway and the brainstem, which explains the early non-movement symptoms.

The causes are mostly unknown: age is the strongest risk, men are affected about one and a half times as often as women, and pesticide exposure, head injury and several genes (such as LRRK2 and GBA) raise the risk. About 5–10 % of people are diagnosed before 50.

### Symptoms
- **Movement**: slowness and shrinking of movement (**bradykinesia** — the key feature), stiffness (**rigidity**), a **rest tremor** of about 4–6 per second that fades with action (absent in about a quarter of people), and later problems with balance, freezing and falls. Small handwriting, a quiet voice, a masked face and a shuffling walk follow from the same slowness.
- **Non-movement**: loss of smell, constipation, **REM sleep behaviour disorder** (acting out dreams), low mood and anxiety, dizziness on standing, pain, sleep problems, and in later years, for many people, problems with thinking.

Diagnosis is clinical — made by a doctor from the history and examination, according to criteria such as those of the Movement Disorder Society (2015); scans mainly exclude other causes.

### Treatment
Dopamine itself cannot cross the blood–brain barrier, but its precursor can:

- **Levodopa**, combined with carbidopa or benserazide to stop it being converted before it reaches the brain, is the most effective treatment and transforms movement for most people.
- **Dopamine agonists** (such as pramipexole and ropinirole) mimic dopamine; they can cause sleepiness and, in a minority, **impulse-control problems** such as gambling or compulsive shopping — worth knowing about, because people often do not link them to the medicine.
- **MAO-B and COMT inhibitors** slow dopamine's breakdown and smooth the effect of levodopa.
- After some years many people notice **wearing off** before the next dose and involuntary writhing movements (dyskinesias) at the peak. Adjusting doses, continuous infusions and **deep brain stimulation** (electrodes implanted in the basal ganglia) help.
- **Exercise** — walking, cycling, dancing, tai chi, strength training — improves mobility, balance and mood; physiotherapy, speech and occupational therapy matter as much as medicines.

The WHO (2023) reported that more than 8.5 million people had Parkinson's disease in 2019, and that disability and deaths from it had grown faster than for any other neurological condition. With good treatment, most people live for many years with the disease.

> [!warn] **Never stop Parkinson's medicines suddenly** — abrupt withdrawal can cause a dangerous state with rigidity, high fever and confusion; medicines should be given on time, including in hospital. Some antipsychotic and anti-sickness medicines block dopamine and can badly worsen symptoms — always tell doctors and pharmacists about the diagnosis. For a fall with injury or inability to get up, sudden severe confusion or hallucinations with fever, or choking and trouble breathing, call your local emergency number.
`,
  ideas: [
    'Parkinson\'s disease is the slow loss of dopamine neurons in the substantia nigra that drive the basal ganglia.',
    'Movement symptoms — slowness, stiffness, rest tremor — appear only after about half the neurons are lost.',
    'Loss of smell, constipation and acting out dreams can precede movement symptoms by years.',
    'Levodopa, turned into dopamine in the brain, is the most effective treatment; exercise and therapy are essential.',
    'Medicines must never be stopped suddenly, and dopamine-blocking medicines can make symptoms much worse.'
  ],
  pitfalls: [
    'Parkinson\'s disease means a tremor — About a quarter of people never have a tremor; slowness of movement is the key feature.',
    'Levodopa should be delayed as long as possible because it "stops working" — Its long-term complications come mainly from the disease progressing; current guidance is to use it when symptoms need it.',
    'Parkinson\'s is only a movement disorder — Sleep, mood, smell, bowel, blood pressure and thinking are all affected, and often matter as much to quality of life.'
  ],
  formulas: [
    {
      name: 'A slow exponential loss of neurons',
      expr: 'f = exp(-k*t)', tex: 'f = e^{-k\\,t}',
      vars: {
        f: { name: 'fraction of neurons remaining', q: 'ratio', unit: '%' },
        k: { name: 'loss rate (fraction per year)', value: 0.06 },
        t: { name: 'time', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'An illustrative model (see [[math:exponential-growth-decay|exponential decay]]). Normal ageing loses roughly 5 % of nigral neurons per decade (k ≈ 0.005 per year); Parkinson\'s disease is several times faster. Real losses are uncertain and differ between people.',
      practice: { unknowns: ['f', 't'] },
      stories: { f: 'Neurons are lost at a rate of {k} per year. What fraction remains after {t}?', t: 'At a loss rate of {k} per year, how long until only {f} remain?' }
    }
  ],
  examples: [
    {
      title: 'Why age alone does not cause Parkinson\'s disease',
      q: 'Normal ageing loses about 5 % of nigral neurons per decade (k ≈ 0.005 per year). How long would it take to reach 50 %, the level at which symptoms begin? And at k = 0.06 per year?',
      steps: [
        'From $f = e^{-kt}$: $t = \\ln 2 / k$.',
        'Normal ageing: $t = 0.693/0.0048 = 144$ years — beyond any lifetime.',
        'At $k = 0.06$ per year: $t = 0.693/0.06 = 11.6$ years — a decade or so of silent loss before the first movement symptoms, consistent with the early non-movement signs.'
      ],
      a: 'About 144 years with normal ageing; about 12 years at the faster rate.'
    },
    {
      title: 'Wearing off',
      q: 'Levodopa has a blood half-life of about 1.5 hours. What fraction of a dose\'s peak level is left 4 hours later, and why does this matter more as the disease advances?',
      steps: [
        '$4/1.5 = 2.67$ half-lives; $0.5^{2.67} = 0.16$, about 16 %.',
        'Early in the disease, surviving dopamine neurons store dopamine and release it steadily, smoothing out the swings in blood level.',
        'As more neurons are lost, the effect follows the blood level more closely: symptoms return before the next dose (wearing off) and peaks may cause dyskinesias. Smaller, more frequent doses, longer-acting combinations or infusions help; see [[half-life-dosing]].'
      ],
      a: 'About 16 % — and with fewer neurons to buffer it, the effect wears off before the next dose.'
    }
  ],
  quiz: [
    { q: 'Why is Parkinson\'s disease treated with levodopa rather than with dopamine itself?', choices: ['Dopamine cannot cross the blood–brain barrier; levodopa can and is converted to dopamine in the brain', 'Dopamine is too expensive', 'Levodopa is a stronger form of dopamine', 'Dopamine would cause tremor'], a: 0,
      why: 'Levodopa is carried across the barrier and turned into dopamine by the surviving neurons; carbidopa or benserazide stops the conversion outside the brain.' },
    { q: 'Everyone with Parkinson\'s disease has a tremor.', a: false,
      why: 'About a quarter never do; bradykinesia (slowness and shrinking of movement) is the essential feature.' },
    { q: 'Which sleep problem can appear years before the movement symptoms?', choices: ['Acting out dreams (REM sleep behaviour disorder)', 'Sleepwalking in childhood', 'Sleep apnoea', 'Jet lag'], a: 0,
      why: 'Loss of the normal paralysis of REM sleep reflects early brainstem involvement; many people with this disorder later develop Parkinson\'s disease or a related condition.' },
    { q: 'Neurons are lost at 7 % per year (k = 0.07). What percentage remains after 5 years?', answer: 70.5, unit: '%',
      why: 'f = e^(−0.07 × 5) = e^(−0.35) = 0.705.' },
    { q: 'A person with Parkinson\'s disease is admitted to hospital with vomiting. Which is a real risk?', choices: ['Being given an anti-sickness medicine that blocks dopamine, or missing doses, both of which worsen symptoms badly', 'That levodopa will cure the vomiting', 'That the tremor stops permanently', 'None: the medicines can safely be paused for a week'], a: 0,
      why: 'Some anti-sickness and antipsychotic medicines block dopamine receptors, and missed doses can cause severe rigidity; medicines must be given on time.' }
  ],
  applications: ['Levodopa and other dopamine-based treatments.', 'Deep brain stimulation for advanced disease.', 'Exercise programmes and physiotherapy for mobility and balance.', 'Research on early detection from smell loss, REM sleep behaviour disorder and synuclein tests.'],
  history: 'James Parkinson described "the shaking palsy" in 1817. In the late 1950s Arvid Carlsson showed that dopamine is a transmitter and that depleting it causes parkinsonism; levodopa entered practice in the late 1960s.',
  sim: { id: 'neu-synapse', params: { release: 30 } }
},

{
  id: 'headache-migraine', parent: 'neuro-disease', title: 'Headache and migraine', level: 1,
  short: 'The commonest nervous-system complaints: tension-type headache, migraine with or without aura, and cluster headache — plus the rare headaches that signal danger. Knowing the red flags, and the trap of painkiller overuse, matters to almost everyone.',
  keywords: ['headache', 'migraine', 'aura', 'tension-type headache', 'cluster headache', 'medication overuse headache', 'thunderclap headache', 'subarachnoid haemorrhage', 'meningitis', 'triptan', 'CGRP', 'red flags', 'giant cell arteritis', 'cortical spreading depression'],
  prereq: ['brain-regions', 'pain', 'synapses'],
  related: ['stroke', 'pain-relief', 'sleep', 'vision', 'hypertension', 'pregnancy', 'reproductive-hormones', 'side-effects-interactions'],
  body: `
Every few weeks a 29-year-old accountant sees a shimmering zigzag line grow from a small spot near the centre of her vision and drift outwards over twenty minutes. As it fades, a throbbing pain starts behind her left eye; she feels sick, light hurts, and she needs a dark room for the rest of the day. This is migraine with aura — disabling, but not dangerous. Her grandfather's headache last year was different: it came on like a blow to the head, the worst of his life, within seconds. That one was a bleed around the brain, and calling the emergency number saved his life.

> [!warn] **Red-flag headaches:**
> - a **sudden, severe headache** reaching its peak within about a minute ("thunderclap", "the worst ever");
> - headache with **fever, a stiff neck, a rash, drowsiness or confusion** (possible meningitis);
> - headache with **weakness, numbness, drooping face, slurred speech, loss of vision or double vision, or a seizure**;
> - headache after a **head injury**, especially with vomiting or drowsiness;
> - a headache that is **worse lying down, on coughing or straining, and wakes you, with vomiting** (raised pressure);
> - a new headache with a **painful red eye** and blurred vision or haloes (acute glaucoma);
> - headaches in several people in one household that ease away from home (carbon monoxide) — get everyone into fresh air.
>
> For any of these, call your local emergency number or go to an emergency department at once.

> [!note] See a doctor **the same day** for a **new headache after 50**, especially with scalp tenderness, pain on chewing or vision changes (giant cell arteritis can cause blindness); a new or changed headache in **pregnancy or after giving birth**; a new headache in someone with **cancer or a weakened immune system**; or a headache that is **steadily getting worse** over weeks.

### The common headaches
- **Tension-type headache** — the commonest: a pressing or tight band on both sides, mild to moderate, not worsened by walking, without much nausea. It responds to simple painkillers, rest, and addressing stress, posture and sleep.
- **Migraine** — attacks of 4–72 hours of moderate to severe, often one-sided, throbbing pain, worse with activity, with nausea or sensitivity to light and sound (International Classification of Headache Disorders, ICHD-3, 2018). About a third of people with migraine have **aura**: visual zigzags, blind spots, tingling or speech disturbance that spread over 5–60 minutes and usually precede the pain.
- **Cluster headache** — excruciating pain around one eye for 15 minutes to 3 hours, up to several times a day, with a red, watering eye, a blocked nose and restlessness, coming in bouts of weeks. It is uncommon and affects men more often.

Headache disorders affect about 40 % of the world's population (WHO, 2024); migraine alone affects over a billion people, two to three times more women than men, and is among the leading causes of disability in people under 50.

### What happens in migraine
Migraine is a disorder of brain excitability with a strong inherited component, not "just a headache". The aura is a wave of intense activity followed by quiet — **cortical spreading depression** — creeping across the cortex at about 3 mm a minute, which is why the zigzags drift slowly across the visual field:

$$t = \\frac{d}{v}$$

The pain comes from activation of the **trigeminovascular system**, the nerves around the blood vessels of the brain's coverings, which release inflammatory messengers including **CGRP**. Common triggers include missed sleep or meals, stress and its relief, hormonal changes around periods, alcohol and dehydration — but triggers differ greatly between people, and a diary helps.

### Treatment — to discuss with a doctor or pharmacist
- **For attacks**: simple painkillers taken early (paracetamol/acetaminophen, ibuprofen, aspirin), anti-sickness medicines, and **triptans**, which act on serotonin receptors; newer options include gepants (CGRP receptor blockers) and lasmiditan. Triptans are generally avoided in people with heart or circulation disease.
- **Prevention**, for frequent or disabling migraine: beta-blockers (propranolol, metoprolol), topiramate, amitriptyline, candesartan, **CGRP antibodies** given by injection every month or three, some gepants taken daily, and botulinum toxin injections for chronic migraine. Topiramate and valproate carry serious risks in pregnancy.
- **Medication-overuse headache**: taking painkillers on 15 or more days a month (triptans, opioids or combination painkillers on 10 or more) can itself cause daily headache. Opioids are not recommended for migraine.
- People who have migraine with aura are generally advised to avoid contraceptives containing oestrogen, because the combination slightly raises the risk of stroke — worth raising when choosing contraception.
`,
  ideas: [
    'Most headaches are primary — tension-type, migraine or cluster — and not dangerous, though migraine can be very disabling.',
    'Red flags: thunderclap onset, fever with stiff neck, neurological signs, head injury, and new headache after 50 or in pregnancy.',
    'Migraine aura is a wave of cortical spreading depression moving at about 3 mm per minute.',
    'CGRP released by trigeminal nerves drives migraine pain — the target of newer treatments.',
    'Painkillers on too many days a month can cause medication-overuse headache.'
  ],
  pitfalls: [
    'A severe headache is probably a brain tumour — Brain tumours rarely present with headache alone; the red flags above, not severity by itself, point to a serious cause.',
    'Migraine is just a bad headache — It is a neurological disorder with aura, nausea, sensitivity to light and sound, and disability that can last days.',
    'More painkillers are always better for frequent headaches — Using them on many days a month can cause daily medication-overuse headache; frequent headaches call for prevention, planned with a doctor.'
  ],
  formulas: [
    {
      name: 'How long a migraine aura lasts',
      expr: 't = d/v', tex: 't = \\frac{d}{v}',
      vars: {
        t: { name: 'duration of the aura (min)' },
        d: { name: 'distance the wave travels across the cortex (mm)', value: 60 },
        v: { name: 'speed of cortical spreading depression (mm/min)', value: 3 }
      },
      note: 'The wave travels at about 2–5 mm a minute (first described by Aristides Leão in 1944); crossing the visual cortex takes 20–30 minutes, matching the typical 5–60-minute aura. An aura lasting longer than an hour, or weakness, needs medical assessment.',
      stories: { t: 'A spreading wave travels {d} across the visual cortex at {v}. How long does the aura last?' }
    }
  ],
  examples: [
    {
      title: 'The drifting zigzag',
      q: 'The part of the visual cortex that a migraine wave crosses is about 60 mm long, and the wave moves at about 3 mm a minute. How long will the aura last? What would a wave of 100 mm give?',
      steps: [
        '$t = 60/3 = 20$ minutes.',
        '$100/3 = 33$ minutes — still within the usual 5–60 minutes.',
        'Because the map of the visual field on the cortex is magnified at the centre, the zigzag appears to grow and speed up as it moves outward.'
      ],
      a: 'About 20 minutes; about 33 minutes for 100 mm.'
    },
    {
      title: 'Which headache is dangerous?',
      q: 'Sort these: (a) a 35-year-old with a tight band around the head at the end of stressful workdays; (b) a 45-year-old with sudden, explosive pain while lifting weights, peaking in seconds; (c) a 72-year-old with a new headache, a tender scalp and pain in the jaw when chewing.',
      steps: [
        '(a) Typical tension-type headache: no red flags; simple measures and occasional painkillers.',
        '(b) Thunderclap headache: possible subarachnoid haemorrhage — call the emergency number now.',
        '(c) New headache after 50 with scalp tenderness and jaw pain on chewing: possible giant cell arteritis, which can cause blindness — urgent same-day assessment; treatment is started quickly.'
      ],
      a: '(b) is an emergency now, (c) is urgent today, (a) is benign.'
    }
  ],
  quiz: [
    { q: 'Which headache needs an emergency call?', choices: ['A sudden headache that reaches its worst within a minute', 'A mild pressing headache after a long day at a screen', 'A migraine like the person\'s usual ones', 'A headache after too little sleep'], a: 0,
      why: 'A thunderclap headache can be a subarachnoid haemorrhage and needs immediate assessment.' },
    { q: 'A person takes painkillers for headache on 20 days a month, and the headaches have become daily. What may be happening?', choices: ['Medication-overuse headache', 'Tolerance to caffeine', 'A brain tumour', 'Cluster headache'], a: 0,
      why: 'Frequent use of acute headache medicines can itself cause daily headache; the answer is a planned reduction and preventive treatment, with medical help.' },
    { q: 'A migraine aura wave crosses 75 mm of cortex at 3 mm per minute. How many minutes does the aura last?', answer: 25, unit: 'min',
      why: '75/3 = 25 minutes.' },
    { q: 'Migraine is only a headache, without other symptoms.', a: false,
      why: 'Attacks commonly bring nausea, vomiting, sensitivity to light, sound and smell, aura in about a third of people, and exhaustion afterwards.' },
    { q: 'Which feature points to tension-type headache rather than migraine?', choices: ['Pressing pain on both sides that does not worsen with walking', 'Throbbing one-sided pain with vomiting', 'Visual zigzags beforehand', 'Needing to lie in a dark room'], a: 0,
      why: 'Tension-type headache is bilateral, pressing, mild to moderate and not aggravated by routine activity, with little nausea.' }
  ],
  applications: ['Headache diaries to find patterns and triggers.', 'Recognising red flags in pharmacies, primary care and emergency departments.', 'CGRP-targeted treatments, the first medicines designed specifically for migraine.', 'Choosing contraception safely for people with migraine with aura.']
},

{
  id: 'multiple-sclerosis', parent: 'neuro-disease', title: 'Multiple sclerosis', level: 2,
  short: 'An immune attack on the myelin of the brain, spinal cord and optic nerves, causing episodes of blurred vision, numbness, weakness or imbalance that come and go — or a slow progression. Modern treatments have changed its outlook.',
  keywords: ['multiple sclerosis', 'MS', 'demyelination', 'myelin', 'relapse', 'relapsing-remitting', 'progressive MS', 'optic neuritis', 'Uhthoff', 'Lhermitte', 'MRI', 'oligoclonal bands', 'Epstein–Barr virus', 'vitamin D', 'disease-modifying therapy', 'evoked potentials'],
  prereq: ['neurons', 'action-potential', 'autoimmunity'],
  related: ['vision', 'pain', 'adaptive-immunity', 'pregnancy', 'medical-imaging', 'depression', 'vitamins-minerals'],
  body: `
At 27, a nurse wakes with blurred vision in her right eye; moving the eye hurts, and colours look washed out. It recovers over six weeks. Two years later her legs tingle from the waist down for a month, and bending her neck sends an electric shock down her spine. An MRI scan shows several small patches of damage in her brain and spinal cord, some old and some new. The diagnosis — multiple sclerosis — frightens her, but she starts a treatment that makes further attacks much less likely, and continues nursing.

### What happens
In multiple sclerosis (MS) the immune system attacks the **myelin** made by oligodendrocytes in the brain, spinal cord and optic nerves (not the nerves of the limbs). Inflamed patches — **plaques** or lesions — lose their myelin; conduction through them slows or fails, then may partly recover as inflammation settles and some myelin is repaired. Over years, axons themselves are lost, which causes lasting disability.

In a demyelinated stretch the impulse can no longer jump from node to node; it must crawl, or it fails altogether. Conduction block is sensitive to temperature, which is why symptoms can briefly worsen with a hot bath, fever or exercise (**Uhthoff's phenomenon**) and recover on cooling — not new damage. The delay can be measured: a **visual evoked potential** records how long a flashing pattern takes to reach the occipital cortex (normally about 100 ms), and a demyelinated optic nerve adds tens of milliseconds:

$$\\Delta t = L\\left(\\frac{1}{v_\\text{demyelinated}} - \\frac{1}{v_\\text{normal}}\\right)$$

### Who gets it
The Atlas of MS (2020) estimated 2.8 million people with MS worldwide. It usually starts between 20 and 40, affects women about twice as often as men (up to three to four times in some countries), and is commoner further from the equator. Risk factors include genes (especially one HLA variant), low vitamin D and little sunlight, smoking, obesity in adolescence and, strikingly, **Epstein–Barr virus**: in a study of 10 million US military personnel (Bjornevik and colleagues, 2022), infection with it raised the risk of later MS about 32-fold, and almost everyone with MS has had it.

### Symptoms and course
Common symptoms are optic neuritis (painful, blurred vision in one eye), numbness or tingling, weakness, unsteadiness, double vision, bladder urgency, fatigue (often the most disabling), the electric-shock sensation on bending the neck (Lhermitte's sign), pain, and problems with memory or mood.

- **Relapsing–remitting MS** (about 85 % at onset): attacks over days, then recovery over weeks to months.
- **Secondary progressive MS**: after years of relapses, a gradual worsening — now reached later and by fewer people with modern treatment.
- **Primary progressive MS** (about 10–15 %): gradual worsening from the start.

Diagnosis uses the McDonald criteria (2017, revised in 2024): evidence of lesions in different places and at different times, from the history, examination and **MRI**, often supported by **oligoclonal bands** in the spinal fluid — after other causes have been excluded.

### Treatment
**Disease-modifying therapies** reduce relapses and new lesions and slow disability: injectable interferon-beta and glatiramer acetate; tablets such as teriflunomide, dimethyl fumarate, S1P-receptor modulators and cladribine; and highly effective infusions such as natalizumab and anti-CD20 antibodies (ocrelizumab, ofatumumab) — ocrelizumab was the first to show benefit in primary progressive MS. Stronger treatments carry risks such as serious infections, so the choice is made with a specialist. A short course of high-dose steroids speeds recovery from a relapse. Rehabilitation, exercise, treating fatigue, bladder and mood problems, and not smoking all matter. Relapses are less frequent during pregnancy and more frequent in the months after birth, so pregnancy is planned with the team.

> [!warn] New loss of vision, weakness, numbness or unsteadiness that develops over hours to days and lasts more than a day needs a prompt medical assessment. **Sudden** weakness of the face, arm or leg on one side, sudden loss of speech, or difficulty breathing or swallowing needs an emergency response — call your local emergency number.
`,
  ideas: [
    'MS is an immune attack on the myelin of the brain, spinal cord and optic nerves, not the nerves of the limbs.',
    'Demyelinated stretches conduct slowly or not at all; heat can worsen conduction block temporarily.',
    'Most people start with relapsing–remitting MS; a minority progress gradually from the start.',
    'Epstein–Barr virus, low vitamin D, smoking and genes raise the risk; women are affected more often.',
    'Disease-modifying therapies reduce relapses and slow disability; early treatment has improved the outlook.'
  ],
  pitfalls: [
    'MS always leads to a wheelchair — Many people never need one; with modern treatments, severe disability is less common and comes later than in the past.',
    'A worsening in a hot bath means a new relapse — Heat briefly worsens conduction through old lesions (Uhthoff\'s phenomenon); symptoms settle on cooling. A relapse lasts more than 24 hours without such a trigger.',
    'MS damages the nerves in the arms and legs — It affects the central nervous system; peripheral nerves are spared, although the symptoms are felt in the limbs.'
  ],
  formulas: [
    {
      name: 'Extra delay through a demyelinated stretch',
      expr: 'dt = L*(1/vd - 1/vn)', tex: '\\Delta t = L\\left(\\frac{1}{v_d} - \\frac{1}{v_n}\\right)',
      vars: {
        dt: { name: 'extra conduction delay', q: 'time', unit: 'ms', tex: '\\Delta t' },
        L: { name: 'length of the demyelinated stretch', q: 'length', unit: 'cm', value: 2 },
        vd: { name: 'speed through the damaged stretch', q: 'speed', unit: 'm/s', value: 1, tex: 'v_d' },
        vn: { name: 'normal speed', q: 'speed', unit: 'm/s', value: 10, tex: 'v_n' }
      },
      note: 'An illustrative model: the speeds in real lesions vary widely, and many fibres are blocked rather than slowed. Visual evoked potentials in people who have had optic neuritis are typically delayed by 10–30 ms.',
      practice: { unknowns: ['dt', 'L'] },
      stories: { dt: 'A {L} stretch of optic nerve that normally conducts at {vn} now conducts at {vd}. How much later does the signal arrive?', L: 'A visual evoked potential is delayed by {dt}. If the damaged fibres conduct at {vd} instead of {vn}, how long is the damaged stretch?' }
    }
  ],
  examples: [
    {
      title: 'A delayed visual evoked potential',
      q: 'After optic neuritis, suppose a 2 cm stretch of optic nerve conducts at 1 m/s instead of 10 m/s. How much is the visual evoked potential delayed?',
      steps: [
        'Normal time through the stretch: $0.02/10 = 2$ ms.',
        'Demyelinated: $0.02/1 = 20$ ms.',
        'Extra delay: 18 ms — the peak normally seen at about 100 ms appears near 118 ms, a typical finding even after vision has recovered.'
      ],
      a: 'About 18 ms.'
    },
    {
      title: 'The hot bath',
      q: 'A man with MS finds that his left leg becomes weak and his vision blurs after a hot bath, and recovers within an hour of cooling down. Is this a relapse?',
      steps: [
        'Demyelinated axons have little safety margin: the current reaching the next node barely suffices to fire it.',
        'Warmth speeds the closing of sodium channels, shortening the current pulse, so conduction through old lesions fails.',
        'Cooling restores conduction. This is Uhthoff\'s phenomenon — no new damage. A relapse is new or worse symptoms lasting more than 24 hours without fever or heat.'
      ],
      a: 'No — it is a temporary, heat-induced conduction block in old lesions.'
    }
  ],
  quiz: [
    { q: 'Multiple sclerosis damages the myelin of…', choices: ['the brain, spinal cord and optic nerves', 'the nerves of the arms and legs', 'the muscles', 'the autonomic ganglia only'], a: 0,
      why: 'MS attacks myelin made by oligodendrocytes in the central nervous system; Guillain–Barré syndrome is the peripheral counterpart.' },
    { q: 'Symptoms that worsen briefly in a hot shower and recover when cool usually mean new MS damage.', a: false,
      why: 'Heat temporarily blocks conduction in old demyelinated fibres (Uhthoff\'s phenomenon); it is not a relapse.' },
    { q: 'A 3 cm damaged stretch conducts at 2 m/s instead of 15 m/s. What is the extra delay, in milliseconds?', answer: 13, unit: 'ms',
      why: '0.03 × (1/2 − 1/15) = 0.03 × 0.433 = 0.013 s = 13 ms.' },
    { q: 'Which virus has been most strongly linked to the risk of developing MS?', choices: ['Epstein–Barr virus', 'Influenza virus', 'Measles virus', 'Hepatitis B virus'], a: 0,
      why: 'In a very large cohort study (2022) infection with Epstein–Barr virus raised the risk of later MS about 32-fold.' },
    { q: 'What is the most common form of MS at onset?', choices: ['Relapsing–remitting', 'Primary progressive', 'Secondary progressive', 'Benign MS'], a: 0,
      why: 'About 85 % of people start with relapses and recoveries; about 10–15 % have a progressive course from the start.' }
  ],
  applications: ['MRI to diagnose and monitor MS.', 'Visual and other evoked potentials to measure conduction delays.', 'Disease-modifying therapies that reduce relapses.', 'Research on Epstein–Barr virus as a target for prevention.'],
  history: 'Jean-Martin Charcot described the disease, which he called "sclérose en plaques", in 1868, noting the hardened patches in the brain and spinal cord.',
  sim: { id: 'neu-reflex', params: { myelin: 'slow' } }
}

);
