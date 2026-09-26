/* HYPER-MEDICINE · content/microbes.js — Microbes and infection: the kinds of microbe,
 * how infections spread, antibiotics, antimicrobial resistance and vaccines.
 * Simulations in sims/infection.js. */
Hyper.add(

/* ================================================================ the kinds of microbe */
{
  id: 'microbes-types', parent: 'microbes', title: 'Bacteria, viruses, fungi and parasites', level: 1,
  short: 'The four kinds of microbe that cause infection differ enormously in size and in how they live: bacteria are self-sufficient cells, viruses are genes in a coat that must hijack our cells, fungi are distant relatives of ours, and parasites range from single cells to worms. The kind decides which medicines can work.',
  keywords: ['microbe', 'microorganism', 'germ', 'pathogen', 'bacteria', 'bacterium', 'virus', 'fungus', 'yeast', 'mould', 'parasite', 'protozoa', 'worms', 'helminth', 'prion', 'Gram stain', 'doubling time', 'bacterial growth', 'germ theory', 'enveloped virus'],
  prereq: ['cell-structure', 'dna-genes', 'math:exponential-growth-decay'],
  related: ['gut-microbiome', 'infection-spread', 'antibiotics', 'innate-immunity', 'malaria', 'influenza-covid', 'sepsis'],
  body: `
A seven-year-old wakes up with a sore throat and a temperature, and her parents wonder whether she needs antibiotics. The honest answer depends on what is growing in her throat. Most sore throats in children are caused by viruses, which antibiotics cannot touch; roughly one in four or five is caused by *Streptococcus* bacteria, which they can. A quick swab tells the two apart. That single question — *what kind of microbe is it?* — runs through the whole of infectious disease, because it decides what treatment can possibly work.

### Four kinds of microbe

| | Typical size | How it lives | Examples | Medicines that act on it |
|---|---|---|---|---|
| Viruses | 20–300 nm | genes (DNA or RNA) in a protein coat, sometimes wrapped in a fatty envelope; can only multiply inside a living cell | influenza, SARS-CoV-2, HIV, measles, norovirus, HPV | antivirals, usually specific to one virus family |
| Bacteria | 0.5–5 µm | complete single cells without a nucleus; most divide by splitting in two | *E. coli*, *Staphylococcus aureus*, *Streptococcus*, the tuberculosis bacillus | antibiotics |
| Fungi | yeasts 3–10 µm; moulds grow as long threads | cells with a nucleus, like ours, inside a tough wall | *Candida* (thrush), *Aspergillus*, the fungi of athlete's foot | antifungals |
| Parasites | protozoa a few µm to 50 µm; worms millimetres to metres | single cells with a nucleus (protozoa), many-celled worms, or mites and lice on the skin | *Plasmodium* (malaria), *Giardia*, roundworms, tapeworms, scabies | antiparasitic medicines |

To feel the scale, magnify everything 2,500 times: a bacterium becomes a grain of rice, a virus a speck of dust a quarter of a millimetre across, a red blood cell a coin and the width of a hair nearly 20 cm. Even smaller are **prions**, misfolded proteins with no genes at all, which cause rare brain diseases such as Creutzfeldt–Jakob disease.

### Bacteria: small, complete and fast
A bacterium carries all the machinery it needs to make energy and proteins, and some of it differs from ours — the cell wall, the smaller ribosomes, the enzymes that copy its DNA. Those differences are exactly what [[antibiotics]] attack. Bacteria are sorted by shape (round cocci, rod-shaped bacilli, spiral spirochaetes) and by the **Gram stain**, which colours thick-walled Gram-positive cells purple and Gram-negative cells, whose thin wall hides behind an extra outer membrane, pink; that membrane keeps many antibiotics out.

In good conditions many bacteria double every 20–30 minutes, so their numbers grow exponentially:

$$N = N_0 \\cdot 2^{\\,t/t_d}$$

One cell doubling every 20 minutes becomes about 16.8 million in 8 hours — 24 doublings. That is why food left out in a warm kitchen can make people ill, and why a fridge, which slows most bacteria almost to a standstill, works. Real cultures go through phases: a *lag* while the cells adapt, the *exponential* phase, a *stationary* phase when food runs out, then a *death* phase (see the simulation).

### Viruses: instructions without a factory
A virus is a set of genes in a protein shell. Outside a cell it does nothing; inside, it takes over the cell's machinery to make hundreds or thousands of copies of itself. Because it uses our own cell's equipment, there are few targets that a drug can hit without harming us, and antibiotics do nothing at all. Viruses with a fatty **envelope** — influenza, coronaviruses, HIV — are torn apart by soap and alcohol gel; viruses without one, such as norovirus, are tougher, which is why washing hands with soap and water beats gel against them.

### Fungi and parasites
Fungi are closer relatives of ours than bacteria are, so drugs that harm them but not us are fewer. Most fungal infections are superficial and mild — athlete's foot, nail infections, thrush — but in people whose immune defences are weakened by chemotherapy, advanced HIV or intensive care, fungi such as *Candida*, *Aspergillus* and *Cryptococcus* can kill. Parasites include single-celled protozoa such as *Plasmodium*, which causes [[malaria]], and worms: WHO estimated in 2023 that about 1.5 billion people carry intestinal worms passed on through soil contaminated with faeces.

### Most microbes are on our side
A human body carries roughly as many bacterial cells as human ones — about 38 trillion bacteria and 30 trillion human cells, by a 2016 estimate — most of them in the colon (see [[gut-microbiome|the gut microbiome]]). They digest fibre, make vitamins and crowd out harmful species. A **pathogen** is the small minority able to invade and cause disease, and many infections come from our own microbes reaching the wrong place: gut bacteria in the bladder cause most [[uti|urinary infections]], skin bacteria in a wound cause cellulitis. Whether an infection takes hold depends on the microbe's numbers and weapons and on the host's defences — [[innate-immunity|innate]] and [[adaptive-immunity|adaptive immunity]].

> [!warn] Most infections are mild, but a few become emergencies within hours. Fever with a severe headache, a stiff neck, dislike of bright light, confusion or unusual drowsiness, or a rash that does not fade when a glass is pressed firmly against it, can be meningitis or meningococcal sepsis. Fever with very fast breathing, mottled or bluish skin, confusion or no urine all day can be [[sepsis]]. Do not wait for all the signs — call your local emergency number.
`,
  ideas: [
    'Viruses are tiny packets of genes that can only multiply inside our cells; bacteria are complete cells that can live on their own.',
    'Antibiotics act on bacterial structures, so they do nothing for viral infections such as colds and flu.',
    'Bacteria multiply by doubling: with a 20-minute doubling time one cell becomes millions overnight.',
    'Fungi and parasites have cells with a nucleus, like ours, so medicines that harm them but spare us are harder to find.',
    'Most microbes are harmless or helpful; a pathogen is the rare one that invades, and the body\'s defences decide whether it succeeds.'
  ],
  pitfalls: [
    'Antibiotics help with a cold or flu — Colds and flu are caused by viruses, which have none of the structures antibiotics attack. Taking them brings only side effects and resistance.',
    'All germs are bad — Most of the microbes on and in us are harmless or useful, and wiping them out with unnecessary antibiotics can let harmful ones such as *C. difficile* take over.',
    'Alcohol gel kills every germ — It destroys enveloped viruses and most bacteria, but not bacterial spores or tough viruses without an envelope such as norovirus; soap and running water remove those physically.'
  ],
  formulas: [
    {
      name: 'Bacterial growth by doubling',
      expr: 'N = N0*2^(t/td)', tex: 'N = N_0 \\cdot 2^{\\,t/t_d}',
      vars: {
        N: { name: 'number of bacteria', q: 'count', tex: 'N' },
        N0: { name: 'starting number', q: 'count', value: 1, tex: 'N_0' },
        t: { name: 'time elapsed', q: 'time', unit: 'h', value: 8, tex: 't' },
        td: { name: 'doubling time', q: 'time', unit: 'min', value: 20, tex: 't_d' }
      },
      note: 'Holds during the exponential phase only: real growth first pauses (the lag phase) and levels off when food or space runs out. Doubling times range from about 20 minutes (*E. coli* in warm broth) to about a day (the tuberculosis bacillus).',
      practice: { unknowns: ['N', 'td', 't'] },
      stories: {
        N: 'A single bacterium lands in a creamy dessert left out in a warm kitchen. If it doubles every {td}, how many bacteria are there after {t}?',
        td: 'A culture grows from {N0} to {N} cells in {t}. What is the doubling time?',
        t: 'Starting from {N0} cells that double every {td}, how long until there are {N}?'
      }
    }
  ],
  examples: [
    {
      title: 'Dessert on the kitchen counter',
      q: 'A bacterium that doubles every 20 minutes contaminates a dessert that is then left out for 8 hours. How many bacteria could there be, and why do food-safety agencies advise not leaving perishable food out for more than about 2 hours?',
      steps: [
        'Number of doublings: $8 \\times 60 / 20 = 24$.',
        'Number of bacteria: $N = 1 \\times 2^{24} = 16{,}777{,}216$ — about 17 million from a single cell.',
        'In 2 hours there are only 6 doublings: $2^6 = 64$. The lag phase, a cooler room and competition slow real growth, but the gap between 64 and 17 million shows why time matters so much.',
        'Some bacteria also make toxins that survive reheating, so cooking food again does not always make it safe.'
      ],
      a: 'Up to about 17 million bacteria from one cell; after 2 hours only a few dozen.'
    },
    {
      title: 'A sore throat: virus or bacterium?',
      q: 'A 7-year-old has a sore throat and fever without a cough; her 35-year-old father has a sore throat with a runny nose and a cough. Why might their doctor treat them differently?',
      steps: [
        'A runny nose, cough and hoarse voice point towards a virus, which antibiotics cannot help; rest, fluids and pain relief are what help while it clears.',
        'Fever, swollen tender glands in the neck and white patches on the tonsils without a cough make a streptococcal infection more likely, especially in children.',
        'A rapid antigen swab or a throat culture confirms it. If it is positive, antibiotics shorten the illness a little and prevent rare complications such as rheumatic fever.',
        'Either way, trouble swallowing saliva, drooling, a muffled voice or difficulty breathing need urgent care.'
      ],
      a: 'The child may be tested and, if positive, treated with an antibiotic; the father\'s pattern suggests a virus, for which antibiotics would bring only side effects.'
    }
  ],
  quiz: [
    { q: 'A friend with a streaming cold asks for antibiotics "to be safe". What is the main reason they will not help?', choices: ['Colds are caused by viruses, which lack the bacterial structures antibiotics attack', 'Cold viruses have become resistant to all antibiotics through overuse', 'Antibiotics work only if taken for at least two weeks', 'Colds are caused by fungi'], a: 0,
      why: 'Antibiotics hit the bacterial cell wall, bacterial ribosomes and similar targets. A virus has none of these; it borrows our cells\' machinery. Resistance is a separate problem that affects bacteria.' },
    { q: 'Bacteria that double every 30 minutes start from 1,000 cells. How many are there after 3 hours (assuming they keep doubling)?', answer: 64000,
      why: '3 hours is 6 doublings, and $1000 \\times 2^6 = 64{,}000$.' },
    { q: 'Which list runs from smallest to largest?', choices: ['virus, bacterium, red blood cell, width of a hair', 'bacterium, virus, red blood cell, width of a hair', 'virus, red blood cell, bacterium, width of a hair', 'red blood cell, virus, bacterium, width of a hair'], a: 0,
      why: 'About 0.1 µm for a typical virus, 1–2 µm for a bacterium, 7–8 µm for a red blood cell and roughly 70 µm for a hair.' },
    { q: 'Alcohol hand gel works as well as soap and water against norovirus.', a: false,
      why: 'Norovirus has no fatty envelope for the alcohol to dissolve. Soap and running water lift it off the skin, so they are preferred during stomach-bug outbreaks.' },
    { q: 'Plotted on a logarithmic scale, the exponential phase of bacterial growth looks like…', choices: ['a straight rising line', 'an S-shaped curve', 'a horizontal line', 'a curve that gets steeper and steeper'], a: 0,
      why: 'Each doubling adds the same step to $\\log N$, so steady doubling is a straight line on a log scale. The whole curve, with lag and stationary phases, is S-shaped.' }
  ],
  applications: [
    'Choosing between antibiotics, antivirals and antifungals — or none at all.',
    'Food safety: refrigeration, thorough cooking and not leaving food out.',
    'Laboratory diagnosis: cultures, the Gram stain, rapid antigen and PCR tests.',
    'Hand hygiene: why soap and water beat gel for some germs.'
  ],
  history: 'In 1847 Ignaz Semmelweis cut deaths from childbed fever in a Vienna maternity clinic by having doctors wash their hands in chlorinated lime. In the 1860s Louis Pasteur showed that microbes cause fermentation and decay, and between 1876 and 1882 Robert Koch proved that particular bacteria cause anthrax and tuberculosis — the germ theory of disease. Viruses were recognised in the 1890s as agents small enough to pass through filters that held back every bacterium.',
  sim: 'inf-growth'
},

/* ================================================================ how infections spread */
{
  id: 'infection-spread', parent: 'microbes', title: 'How infections spread', level: 1,
  short: 'Every infection travels from a source to a new host by a route — the air, touch, food and water, insects, blood or sex. The route tells you which barrier stops it, and the basic reproduction number R₀ tells you how hard it has to be pushed.',
  keywords: ['transmission', 'chain of infection', 'airborne', 'droplets', 'aerosol', 'contact', 'fomite', 'faecal-oral', 'vector', 'mosquito', 'zoonosis', 'incubation period', 'R0', 'basic reproduction number', 'superspreading', 'hand washing', 'ventilation', 'isolation', 'contact tracing'],
  prereq: ['microbes-types', 'math:exponential-growth-decay', 'math:probability'],
  related: ['epidemics', 'vaccines', 'epidemiology', 'malaria', 'tuberculosis', 'influenza-covid', 'hiv'],
  body: `
A father comes home from a party buffet feeling queasy. That night he vomits in the bathroom; two days later his wife and one of their children are ill too. Norovirus is a master of spread: a tiny number of particles can infect, one bout of vomiting releases millions into the air and onto surfaces, and the virus survives for days on taps and door handles. The family member who stays well is the one who cleaned up with a bleach solution and washed her hands with soap. Every infection has to make a journey like this from one person to the next, and every step of the journey is a chance to stop it.

### The chain of infection
Public-health teams picture six links: the **microbe**; its **reservoir** (an infected person, an animal, soil or water); a **way out** (coughing, faeces, blood); a **route**; a **way in** (the nose and lungs, the mouth, broken skin, the genital tract); and a **susceptible host**. Breaking any one link stops transmission — and vaccines break the last.

### The routes, and what stops each

| Route | How it travels | Examples | What stops it |
|---|---|---|---|
| Through the air | droplets and fine aerosols from breathing, talking, coughing; aerosols build up in stuffy rooms | measles, tuberculosis, influenza, COVID-19, chickenpox | ventilation, masks, vaccination, staying home when ill |
| Contact | hands, skin and contaminated surfaces | norovirus, colds, MRSA, impetigo | hand washing, cleaning, covering wounds |
| Faecal–oral | sewage in water, unwashed hands preparing food | cholera, typhoid, hepatitis A, rotavirus | clean water, sanitation, safe food, vaccines |
| Insects and ticks (vectors) | mosquitoes, ticks, fleas, sandflies | malaria, dengue, Zika, Lyme disease | bed nets, repellents, removing standing water |
| Blood and sex | sex, shared needles, transfusions | HIV, hepatitis B and C, syphilis | condoms, PrEP, sterile needles, screened blood, treatment |
| Mother to child | pregnancy, birth, breastfeeding | HIV, syphilis, hepatitis B, rubella | screening in pregnancy, treatment, vaccination |

About six in ten known human infections, and most of the new ones that emerge, come from animals — **zoonoses** such as rabies, bird flu, Ebola and mpox.

### Timing matters
The **incubation period** runs from infection to the first symptoms; the **infectious period** is when a person can pass the microbe on. When infectiousness starts before symptoms — influenza, COVID-19 — isolating the sick is not enough on its own. When it starts only with symptoms, as with SARS in 2003 and Ebola, finding people with symptoms quickly and tracing their contacts can stop an outbreak.

### How many people does one case infect?
The **basic reproduction number** $R_0$ is the average number of people one case infects in a population where nobody is immune. It is roughly the product of three things:

$$R_0 = c \\cdot p \\cdot D$$

— contacts per day, the chance of passing the infection on at each contact, and the number of days infectious. Ten close contacts a day, a 5 % chance each, for 6 days gives $R_0 = 3$. Each factor is a lever: fewer contacts, safer contacts (masks, ventilation, condoms, bed nets) and a shorter infectious period (early treatment, isolation). Generation by generation the cases multiply, $I_n = I_0 R^n$: with $R = 2.5$ one case becomes about 9,500 in the tenth generation; with $R = 0.8$ a chain dies out after about five cases in total. As people become immune, the effective reproduction number falls — see [[epidemics]].

### Superspreading
Averages hide a lot. For many infections most cases infect nobody, while a few infect dozens — typically in crowded, poorly ventilated rooms with loud talking or singing. For SARS and COVID-19, studies suggest that roughly 10–20 % of cases caused about 80 % of onward infections. The consequence, explored in the simulation, is that most introductions into a community fizzle out while a few explode, and that avoiding crowded indoor gatherings removes far more transmission than its share of contacts.

> [!tip] The everyday barriers are simple and work against many infections at once: wash hands with soap for about 20 seconds, cover coughs and sneezes, stay home when ill, let fresh air into shared rooms, prepare food safely, and keep vaccinations up to date.
`,
  ideas: [
    'An infection needs a whole chain — source, way out, route, way in and a susceptible host — and breaking any link stops it.',
    'The route decides the barrier: fresh air and masks for the air, hand washing for touch, clean water for the faecal–oral route, bed nets for mosquitoes, condoms and sterile needles for blood and sex.',
    'R₀ ≈ contacts × chance per contact × days infectious: every factor is a lever for control.',
    'Above R = 1 cases multiply generation by generation; below 1 chains of infection die out.',
    'Spread is uneven: a minority of cases, often in crowded indoor settings, cause most transmission.'
  ],
  pitfalls: [
    'People without symptoms cannot spread infection — For influenza, COVID-19, HIV and many others, people can be infectious before symptoms start or without ever having any.',
    'R₀ is a fixed property of the microbe — It also depends on how people live: the same virus spreads faster in crowded cities than in scattered villages, and slower when people change their behaviour.',
    'If R is only a little above 1, nothing much happens — Anything above 1 still grows exponentially: with R = 1.2 the number of cases doubles about every four generations.'
  ],
  formulas: [
    {
      name: 'The basic reproduction number from its parts',
      expr: 'R0 = c*p*D', tex: 'R_0 = c \\cdot p \\cdot D',
      vars: {
        R0: { name: 'basic reproduction number', tex: 'R_0' },
        c: { name: 'close contacts per day', value: 10, tex: 'c' },
        p: { name: 'chance of passing it on per contact', q: 'ratio', unit: '%', value: 5, min: 0, max: 100, tex: 'p' },
        D: { name: 'infectious period (days)', value: 6, tex: 'D' }
      },
      note: 'A back-of-the-envelope model that assumes contacts are random and nobody is immune. c and D are plain numbers (per day and days); real estimates of R₀ come from the growth of outbreaks.',
      practice: { unknowns: ['R0', 'p', 'c'] },
      stories: {
        R0: 'A person has {c} close contacts a day, each with a {p} chance of catching the infection, and is infectious for {D} days. What is R₀?',
        p: 'An infection with R₀ = {R0} spreads through about {c} contacts a day over {D} days. What is the chance of transmission per contact?',
        c: 'With a {p} chance per contact and {D} infectious days, how many daily contacts would give R₀ = {R0}?'
      }
    },
    {
      name: 'Cases generation by generation',
      expr: 'In = I0*R^n', tex: 'I_n = I_0 \\, R^{\\,n}',
      vars: {
        In: { name: 'cases in generation n', tex: 'I_n' },
        I0: { name: 'cases at the start', value: 1, tex: 'I_0' },
        R: { name: 'reproduction number', value: 2.5, tex: 'R' },
        n: { name: 'number of generations', int: true, value: 10, tex: 'n' }
      },
      note: 'Early growth, before many people are immune. A generation is the time from one infection to the next: a few days for influenza, about two weeks for measles.',
      practice: { unknowns: ['In', 'R'] },
      stories: {
        In: 'One traveller brings in an infection with R = {R}. How many new cases would the {n}th generation bring if nothing changed?',
        R: 'An outbreak grew from {I0} case to {In} cases in the {n}th generation. What reproduction number does that imply?'
      }
    }
  ],
  examples: [
    {
      title: 'Pulling the levers',
      q: 'An infection spreads through about 10 close contacts a day with a 5 % chance per contact, over 6 infectious days. Which combination of measures brings R₀ below 1?',
      steps: [
        'Without measures: $R_0 = 10 \\times 0.05 \\times 6 = 3$.',
        'Halving contacts alone: $5 \\times 0.05 \\times 6 = 1.5$ — still growing.',
        'Adding masks and better ventilation that cut the chance per contact to 3 %: $5 \\times 0.03 \\times 6 = 0.9$.',
        'No single lever had to be pulled all the way: several partial measures multiply together.'
      ],
      a: 'Fewer contacts plus safer contacts together bring R to about 0.9, below the threshold of 1.'
    },
    {
      title: 'Ten generations',
      q: 'Compare what follows one imported case when R = 2.5 and when R = 0.8.',
      steps: [
        'With $R = 2.5$ the 10th generation alone has $2.5^{10} \\approx 9{,}537$ cases, and the ten generations together about 15,900.',
        'With $R = 0.8$ each generation is smaller than the last: 1, 0.8, 0.64, … The total is a geometric series, $1/(1 - 0.8) = 5$ cases on average.',
        'The difference between a fizzling chain and an epidemic is not a huge change in behaviour but whether R sits just above or just below 1.'
      ],
      a: 'About 9,500 cases in the tenth generation at R = 2.5; about 5 cases in total at R = 0.8.'
    }
  ],
  quiz: [
    { q: 'Which measure mainly reduces p, the chance of passing an infection on at each contact?', choices: ['wearing a well-fitting mask in a crowded room', 'working from home', 'starting treatment early so the illness is shorter', 'closing schools'], a: 0,
      why: 'A mask makes each contact safer. Working from home and closing schools cut the number of contacts (c); early treatment shortens the infectious period (D).' },
    { q: 'A person has 8 contacts a day, each with a 4 % chance of infection, and is infectious for 5 days. What is R₀?', answer: 1.6,
      why: '$R_0 = 8 \\times 0.04 \\times 5 = 1.6$.' },
    { q: 'Norovirus is spreading in a care home. Which step helps most?', choices: ['hand washing with soap and water and cleaning surfaces with a chlorine-based product', 'alcohol hand gel alone', 'antibiotics for all the residents', 'giving everyone paracetamol'], a: 0,
      why: 'Norovirus lacks a fatty envelope, so gel works poorly; soap and water remove it and chlorine (bleach) inactivates it on surfaces. Antibiotics have no effect on viruses.' },
    { q: 'If R stays at 1.2, an outbreak dies out on its own.', a: false,
      why: 'Any R above 1 means each generation is larger than the last — here by 20 %. The outbreak grows until immunity or changes in behaviour push R below 1.' },
    { q: 'With strong superspreading (a few cases cause most transmission), what usually happens when one infected traveller arrives in a town?', choices: ['most such introductions fizzle out, but a few ignite large outbreaks', 'every introduction causes a large outbreak', 'the outbreak grows more slowly but always takes off', 'superspreading makes no difference to the chance of an outbreak'], a: 0,
      why: 'If most cases infect nobody, a single introduction usually dead-ends. When it does reach a superspreader, the outbreak jumps ahead quickly.' }
  ],
  applications: [
    'Hand washing, ventilation and masks in hospitals, schools and homes.',
    'Clean water and sanitation — the reason cholera disappeared from wealthy cities.',
    'Bed nets, repellents and mosquito control.',
    'Contact tracing and isolation during outbreaks.'
  ],
  history: 'In 1854 the London doctor John Snow mapped cholera deaths around a water pump in Broad Street and persuaded the parish to remove its handle — a founding moment of epidemiology, decades before the cholera bacterium was identified.',
  sim: 'inf-network'
},

/* ================================================================ antibiotics */
{
  id: 'antibiotics', parent: 'microbes', title: 'Antibiotics', level: 2,
  short: 'Medicines that kill bacteria or stop them multiplying by hitting structures our own cells lack — the cell wall, bacterial ribosomes, the enzymes that copy bacterial DNA. They transformed medicine, do nothing against viruses, and lose power every time they are used without need.',
  keywords: ['antibiotic', 'antibacterial', 'penicillin', 'beta-lactam', 'bactericidal', 'bacteriostatic', 'narrow spectrum', 'broad spectrum', 'MIC', 'minimum inhibitory concentration', 'culture and sensitivity', 'penicillin allergy', 'C. difficile', 'antibiotic course', 'time above MIC', 'Fleming'],
  prereq: ['microbes-types', 'how-drugs-work', 'pharmacokinetics'],
  related: ['antimicrobial-resistance', 'half-life-dosing', 'side-effects-interactions', 'sepsis', 'tuberculosis', 'gut-microbiome', 'pneumonia', 'uti', 'anaphylaxis'],
  body: `
In February 1941, in Oxford, a police constable dying of a spreading infection became the first person treated with purified penicillin. Within days his fever fell and the infection began to retreat — but the tiny supply ran out, the bacteria returned, and he died. A few years later penicillin was being made by the tonne. Infections that had killed routinely — pneumonia, meningitis, childbed fever, infected wounds — became curable, and much of modern medicine, from hip replacements to chemotherapy and transplants, still depends on antibiotics to control the infections it risks.

### Hitting what bacteria have and we do not

| Target | Classes, with examples |
|---|---|
| The cell wall | beta-lactams: penicillins (amoxicillin), cephalosporins (ceftriaxone), carbapenems (meropenem); glycopeptides (vancomycin) |
| Bacterial ribosomes (smaller than ours) | macrolides (azithromycin), tetracyclines (doxycycline), aminoglycosides (gentamicin), linezolid |
| The enzymes that copy DNA | fluoroquinolones (ciprofloxacin) |
| Making folate | sulfonamides and trimethoprim |
| Bacterial RNA polymerase | rifamycins (rifampicin), a mainstay against tuberculosis |
| The outer membrane | polymyxins (colistin), kept as a last resort |

Some antibiotics kill (**bactericidal**), others stop growth and leave the immune system to finish the job (**bacteriostatic**). **Narrow-spectrum** drugs hit a few kinds of bacteria, **broad-spectrum** drugs many — and the broader the drug, the more collateral damage to the helpful bacteria of the gut. The ideal is the narrowest drug that works, chosen from a culture of the infection and a sensitivity test when possible. In suspected [[sepsis]] a broad drug is started at once, because every hour counts, and narrowed when the results arrive.

### Enough drug, for long enough
The **minimum inhibitory concentration** (MIC) is the lowest concentration that stops a given bacterium growing in the laboratory. Beta-lactams kill best when the level stays above the MIC for a large part of each dosing interval, which is why they are taken several times a day; aminoglycosides and fluoroquinolones kill best at a high peak and are often given once a day. After each dose the level falls with the drug's [[half-life-dosing|half-life]], so the time it stays above the MIC is

$$T_{>\\text{MIC}} = t_{1/2}\\,\\log_2 \\frac{C_0}{\\text{MIC}}$$

A peak 20 times the MIC and a half-life of 1 hour give about 4.3 hours. Doubling the dose adds only one more half-life; splitting it into more frequent doses adds much more (worked example below).

**How long?** A course is chosen to cure the infection. Trials over the last two decades have shown that for many common infections — pneumonia caught outside hospital, uncomplicated urinary infections, cellulitis — shorter courses work as well as the longer ones once standard, with fewer side effects and less resistance. So the old rule "always finish the course" is giving way to "take it exactly as your prescriber says": do not stop or change it on your own, do not save leftovers or share them, and ask if you are unsure how long to take it.

### Side effects
Diarrhoea, thrush and rashes are common. Antibiotics that wipe out gut bacteria can let *Clostridioides difficile* flourish and cause severe colitis, especially in older people in hospital. Some antibiotics interact with other medicines — rifampicin, for instance, weakens hormonal contraception and many other drugs — so a pharmacist should check. True allergy is less common than people think: roughly one person in ten carries a penicillin-allergy label, yet when properly tested more than nine in ten of them can take penicillin safely (CDC). A wrong label pushes doctors towards broader, less effective drugs, so it is worth asking about allergy testing if the label goes back to a childhood rash.

> [!warn] Swelling of the lips, tongue or throat, difficulty breathing or wheezing, sudden faintness or widespread hives after a dose can be anaphylaxis — call your local emergency number. Severe or bloody diarrhoea with fever during or after a course needs prompt medical advice.

Antivirals, antifungals and antiparasitic medicines follow the same logic — find a target the microbe has and we lack — and together with antibiotics they are called **antimicrobials**. All of them face the same threat: [[antimicrobial-resistance|resistance]].
`,
  ideas: [
    'Antibiotics exploit differences between bacteria and our cells: the cell wall, bacterial ribosomes, DNA-copying enzymes, folate synthesis.',
    'They do nothing against viruses, and every unnecessary course brings side effects and resistance.',
    'The narrowest drug that covers the infection is best; cultures and sensitivity tests help choose it.',
    'For time-dependent drugs such as penicillins, the time above the MIC matters more than the height of the peak.',
    'Take antibiotics exactly as prescribed, and never save or share them.'
  ],
  pitfalls: [
    'A stronger or broader antibiotic is always better — Broad-spectrum drugs harm more of the helpful gut bacteria and drive more resistance; the narrowest effective drug is the better choice.',
    'Stopping as soon as you feel better is fine / you must always take every tablet — Neither rule is right on its own: the course length is a medical decision, often shorter than it used to be. Follow the prescriber\'s instructions and ask before changing anything.',
    'A childhood rash on amoxicillin means a lifelong penicillin allergy — Most such rashes were caused by the viral illness itself; formal testing clears the large majority of people with the label.'
  ],
  formulas: [
    {
      name: 'Time above the MIC after a dose',
      expr: 'T = th*log2(C0/MIC)', tex: 'T_{>\\text{MIC}} = t_{1/2}\\,\\log_2 \\frac{C_0}{\\text{MIC}}',
      vars: {
        T: { name: 'time above the MIC', q: 'time', unit: 'h', tex: 'T_{>\\text{MIC}}' },
        th: { name: 'half-life of the drug', q: 'time', unit: 'h', value: 1, tex: 't_{1/2}' },
        C0: { name: 'peak concentration', q: 'massconc', unit: 'mg/L', value: 20, tex: 'C_0' },
        MIC: { name: 'minimum inhibitory concentration', q: 'massconc', unit: 'mg/L', value: 1, tex: '\\text{MIC}' }
      },
      note: 'A one-compartment picture after the peak, with exponential decline. The numbers are hypothetical and for learning only — real dosing is set by prescribers and guidelines.',
      practice: { unknowns: ['T', 'C0'] },
      stories: {
        T: 'A hypothetical antibiotic peaks at {C0} and has a half-life of {th}. The bacterium\'s MIC is {MIC}. How long after the peak does the level stay above the MIC?',
        C0: 'To stay above an MIC of {MIC} for {T} with a half-life of {th}, what peak concentration is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'Three doses or one?',
      q: 'A hypothetical penicillin-like drug has a half-life of 1 hour and reaches a peak of 20 mg/L; the bacterium\'s MIC is 1 mg/L. For time-dependent drugs the level should stay above the MIC for roughly half of each dosing interval. Compare giving it every 8 hours with giving it once a day, and with doubling a once-daily dose.',
      steps: [
        'Time above the MIC after each dose: $T = 1 \\times \\log_2(20/1) = 4.3$ h.',
        'Every 8 hours: $4.3/8 = 54\\%$ of the time above the MIC — on target.',
        'Once every 24 hours: $4.3/24 = 18\\%$ — the bacteria regrow for most of the day.',
        'Doubling the single dose (peak 40 mg/L): $T = \\log_2 40 = 5.3$ h, only one hour more, and $5.3/24 = 22\\%$.'
      ],
      a: 'Dosing every 8 hours keeps the level above the MIC about half the time; one dose a day, even a doubled one, manages only about a fifth.'
    },
    {
      title: 'A penicillin-allergy label',
      q: 'A 45-year-old woman with cellulitis says she is allergic to penicillin: she had a rash on amoxicillin at the age of four. What should her team consider?',
      steps: [
        'Rashes during childhood infections are common and are often caused by the virus rather than the drug.',
        'The label steers doctors to alternatives that may be broader, less effective against her infection and more likely to cause *C. difficile*.',
        'A structured allergy assessment — the story, sometimes skin tests, then a supervised test dose — removes the label in most such cases.',
        'If the history had been of swelling of the throat, breathing difficulty or collapse, the team would treat it as a true allergy and avoid the drug.'
      ],
      a: 'Treat her safely now, and refer her for allergy assessment: most labels like hers turn out to be wrong.'
    }
  ],
  quiz: [
    { q: 'Why can penicillin kill bacteria without harming human cells?', choices: ['It blocks the building of the bacterial cell wall, a structure human cells do not have', 'Human cells pump penicillin straight out again', 'It is absorbed only by bacteria', 'Human cells are too large to be damaged'], a: 0,
      why: 'Beta-lactams block the enzymes that cross-link the bacterial cell wall. Animal cells have no cell wall, so the drug has nothing to act on in them.' },
    { q: 'A hypothetical drug with a half-life of 2 h peaks at 16 mg/L; the bacterium\'s MIC is 1 mg/L. For how many hours after the peak does the level stay above the MIC?', answer: 8, unit: 'h',
      why: '$\\log_2 16 = 4$ half-lives, and $4 \\times 2$ h = 8 h.' },
    { q: 'For an antibiotic whose killing depends on the time above the MIC, which change keeps the level above the MIC for longest?', choices: ['splitting the same daily amount into more frequent doses', 'giving the whole day\'s amount at once', 'taking it with a meal', 'doubling a single dose, which doubles the time above the MIC'], a: 0,
      why: 'Doubling the peak adds only one half-life. Several smaller doses each restart the clock, keeping the level above the MIC for most of the day.' },
    { q: 'Most people who were labelled penicillin-allergic in childhood turn out to tolerate it when properly tested.', a: true,
      why: 'Studies of allergy testing find that well over 90 % of people with a penicillin label can take it safely.' },
    { q: 'On day 3 of a 7-day course someone feels much better. What is the best approach?', choices: ['ask the prescriber or a pharmacist before changing anything, and never keep leftovers for later', 'stop now and keep the rest for next time', 'double the remaining doses to finish sooner', 'give the leftover tablets to a relative with similar symptoms'], a: 0,
      why: 'The course length is a clinical decision, and newer evidence has shortened many courses — but that decision belongs with the prescriber. Saved or shared antibiotics are often the wrong drug for the next illness and fuel resistance.' }
  ],
  applications: [
    'Treating bacterial pneumonia, urinary infections, meningitis and sepsis.',
    'Preventing infection in surgery, chemotherapy and transplantation.',
    'Culture and sensitivity testing to choose the narrowest effective drug.',
    'Penicillin-allergy testing to remove wrong labels.'
  ],
  history: 'Alexander Fleming noticed in 1928 that a *Penicillium* mould killed the bacteria growing around it. In Oxford, Howard Florey, Ernst Chain and Norman Heatley purified penicillin and showed in 1940–41 that it cured infections; mass production followed during the Second World War. Sulfonamides (1930s) and streptomycin (1943, the first drug against tuberculosis) came at the same time, and most classes used today were discovered between the 1940s and the 1960s.',
  sim: 'inf-antibiotic'
},

/* ================================================================ antimicrobial resistance */
{
  id: 'antimicrobial-resistance', parent: 'microbes', title: 'Antimicrobial resistance', level: 2,
  short: 'Bacteria, viruses, fungi and parasites evolve to survive the medicines aimed at them. Every use of an antibiotic selects the survivors, and bacteria share resistance genes with each other — so careless use today makes infections harder to treat for everyone tomorrow.',
  keywords: ['antibiotic resistance', 'antimicrobial resistance', 'AMR', 'superbug', 'MRSA', 'ESBL', 'carbapenemase', 'CRE', 'natural selection', 'mutation', 'plasmid', 'horizontal gene transfer', 'antibiotic stewardship', 'One Health', 'AWaRe', 'mutant selection window', 'Candida auris'],
  prereq: ['antibiotics', 'dna-genes', 'microbes-types'],
  related: ['tuberculosis', 'malaria', 'hiv', 'sepsis', 'infection-spread', 'epidemics', 'uti', 'gut-microbiome'],
  body: `
A 60-year-old woman has a bladder infection that does not clear with the usual tablets. The laboratory finds *E. coli* that makes an **ESBL** — an enzyme that destroys penicillins and most cephalosporins — and is also resistant to the other common tablets. She needs a drip in hospital with a carbapenem, one of the last reliable antibiotic families. A generation ago the same infection would have cleared with the first prescription. And bacteria resistant to carbapenems too are spreading.

### Evolution in fast-forward
Resistance is natural selection. An infection can hold billions of bacteria, and random mutations mean a few are already less sensitive before any drug is given — on average $m = N f$ of them. Ten billion bacteria with a mutation frequency of one in a hundred million contain about 100 resistant cells. The antibiotic kills the susceptible majority; the resistant few survive and, unless the immune system mops them up, regrow. The drug does not *create* resistance, it *selects* it — and not only in the infection being treated but among all the bacteria of the gut, skin and throat.

Bacteria resist in a handful of ways:
- **enzymes that destroy the drug** — beta-lactamases, including ESBLs and carbapenemases;
- **a changed target** — MRSA (methicillin-resistant *Staphylococcus aureus*) builds its cell wall with an enzyme that beta-lactams cannot block;
- **pumps** that throw the drug out, and outer membranes that keep it from getting in.

Worse, bacteria **share** resistance. Genes on small DNA rings called plasmids pass from one bacterium to another, even between species, so a harmless gut bacterium can hand resistance to a dangerous one. A plasmid gene for resistance to colistin, the last-resort drug, was reported in China in 2015 and was soon found on every inhabited continent.

Doses matter too. Between the concentration that stops the ordinary bacteria and the higher one that also stops partly resistant mutants lies the **mutant selection window**: levels there kill the susceptible majority and hand the field to the mutants. Doses that are too low, or missed, keep the drug in that window — the simulation shows it.

### How big the problem is
The Global Research on Antimicrobial Resistance (GRAM) study estimated that in 2019 resistant bacterial infections directly caused about 1.27 million deaths and were involved in about 4.95 million, with the heaviest toll in sub-Saharan Africa and South Asia. A 2024 follow-up projected roughly 39 million deaths directly caused by resistance between 2025 and 2050 if trends continue — a forecast with wide uncertainty. Resistance is not only bacterial: WHO estimated that about 400,000 people developed tuberculosis resistant to the main drug rifampicin in 2023, malaria parasites partly resistant to artemisinin have appeared in Asia and East Africa, and the drug-resistant yeast *Candida auris* now causes hospital outbreaks worldwide.

### What drives it — and what slows it
Antibiotics are used where they cannot help (colds, flu, most coughs and sore throats) — US studies in 2016 judged about 30 % of outpatient prescriptions unnecessary — and in many countries they are sold without a prescription. In many countries more antibiotics are given to farm animals than to people; the European Union banned their use to promote growth in 2006. Poor sanitation and infection control let resistant bacteria spread, and travel carries them around the world. Few new antibiotics are being developed, because a good new drug is kept in reserve and so earns little.

**Stewardship** means the right drug, at the right dose, for the right duration, only when needed. WHO sorts antibiotics into *Access* (first choices for common infections), *Watch* and *Reserve* (last resorts) groups. Preventing infections prevents prescriptions: clean water, hand hygiene, and vaccines — pneumococcal vaccines, for example, have cut both infections and resistant strains.

> [!tip] What you can do: do not expect antibiotics for colds or flu; ask "is this likely to be bacterial?" and "how long should I take it?"; take them exactly as prescribed; never share or save them, and return leftovers to a pharmacy; keep vaccinations up to date; and tell your doctor if you have been in hospital abroad, so you can be screened for resistant bacteria.
`,
  ideas: [
    'Resistance is natural selection: the drug kills the susceptible and leaves the resistant to multiply.',
    'In a large infection a few resistant mutants usually exist before the first dose (m = N·f).',
    'Bacteria pass resistance genes to each other on plasmids, even between species.',
    'Doses in the mutant selection window — too low or missed — favour partly resistant mutants.',
    'Stewardship, infection prevention and vaccines slow resistance; unnecessary antibiotics speed it.'
  ],
  pitfalls: [
    'People become resistant to antibiotics — It is the bacteria that become resistant, not the person; but the resistant bacteria a person carries can infect them later, or spread to others.',
    'Resistance only matters for the infection being treated — Every course also selects resistance among the harmless bacteria of the gut and skin, which can pass their genes on.',
    'New antibiotics will solve the problem — Few new classes have been found since the 1980s, and resistance to each new drug appears within years. Using existing ones well is essential.'
  ],
  formulas: [
    {
      name: 'Resistant mutants present before treatment',
      expr: 'm = N*f', tex: 'm = N \\cdot f',
      vars: {
        m: { name: 'expected number of resistant mutants', tex: 'm' },
        N: { name: 'bacteria in the infection', value: 1e10, tex: 'N' },
        f: { name: 'chance that a bacterium carries a resistance mutation', value: 1e-8, tex: 'f' }
      },
      note: 'Single-step mutation frequencies are typically between one in a million and one in a billion, depending on the drug and the species. If two drugs need two independent mutations, the frequencies multiply — the logic of combination therapy (see tuberculosis).',
      practice: { unknowns: ['m', 'N'] },
      stories: {
        m: 'An abscess contains about {N} bacteria, and one in every so many carries a mutation giving resistance (a frequency of {f}). How many resistant bacteria are there before the first dose?',
        N: 'With a mutation frequency of {f}, how many bacteria must an infection contain to hold {m} resistant mutants on average?'
      }
    }
  ],
  examples: [
    {
      title: 'Survivors of a course',
      q: 'An infection holds $10^{10}$ bacteria, of which a fraction $10^{-8}$ are resistant. A drug kills 99.99999 % of the susceptible bacteria (a factor of $10^7$) but not the resistant ones. What share of the survivors is resistant?',
      steps: [
        'Resistant before treatment: $10^{10} \\times 10^{-8} = 100$.',
        'Susceptible survivors: $10^{10} / 10^{7} = 1000$.',
        'Share resistant: $100/(100 + 1000) = 9\\%$ — up from one in a hundred million.',
        'After another hundredfold kill of the susceptible (10 left) the resistant are $100/110 = 91\\%$ of what remains. If the immune system cannot clear them, the next infection is resistant.'
      ],
      a: 'About 9 % of the survivors are resistant after the first kill, and more than 90 % after further killing.'
    },
    {
      title: 'An antibiotic for a cold',
      q: 'A man takes a course of a broad-spectrum antibiotic for a cold. His cold lasts as long as it would have anyway. What else has happened?',
      steps: [
        'The virus was untouched: the cold runs its usual week or so.',
        'Among the trillions of bacteria in his gut, the drug killed susceptible strains and left resistant ones — studies find more resistant gut bacteria for weeks to months after a course.',
        'He risked diarrhoea, thrush, a rash or rarely *C. difficile* colitis, for no benefit.',
        'If he develops a bladder infection in the next months, it is more likely to be resistant to the drug he took.'
      ],
      a: 'No benefit for the cold; real risks of side effects, and a gut full of more resistant bacteria.'
    }
  ],
  quiz: [
    { q: 'Which statement about how antibiotic resistance arises is correct?', choices: ['the antibiotic selects bacteria that were already resistant, or became so by chance', 'the antibiotic teaches bacteria how to resist it', 'the person\'s body becomes resistant to the antibiotic', 'resistance arises only in the bacteria causing the infection being treated'], a: 0,
      why: 'Mutations are random; the drug changes which bacteria survive. The person does not become resistant, and all the bacteria exposed to the drug — including harmless gut bacteria — are selected.' },
    { q: 'Resistance genes can pass from harmless gut bacteria to dangerous ones.', a: true,
      why: 'Plasmids carrying resistance genes move between bacteria, including between different species, which is why resistance spreads so fast.' },
    { q: 'An infection contains $10^9$ bacteria, and one in $10^7$ carries a mutation giving resistance to a drug. How many resistant mutants are expected before treatment?', answer: 100,
      why: '$m = N f = 10^9 \\times 10^{-7} = 100$.' },
    { q: 'Which action does most to slow resistance?', choices: ['not using antibiotics for viral infections such as colds and flu', 'always choosing the broadest antibiotic to be safe', 'keeping leftover antibiotics for next time', 'using low doses to reduce side effects'], a: 0,
      why: 'Unnecessary courses give selection with no benefit. Broad drugs select more widely, leftovers are misused, and low doses sit in the mutant selection window.' },
    { q: 'What is the mutant selection window?', choices: ['the range of drug levels that kills the susceptible bacteria but not partly resistant mutants', 'the days of a course when mutations happen', 'the delay before a drug reaches the infection', 'a laboratory test for resistance'], a: 0,
      why: 'Between the MIC of the ordinary bacteria and the higher concentration that stops the mutants, the drug clears the competition and lets the mutants grow.' }
  ],
  applications: [
    'Antibiotic stewardship programmes in hospitals and general practice.',
    'Screening patients transferred from hospitals abroad for resistant bacteria.',
    'Combination therapy against tuberculosis, HIV and malaria.',
    'Rules on antibiotic use in farming — the One Health approach.'
  ],
  history: 'In his 1945 Nobel lecture Alexander Fleming warned that people taking too little penicillin could breed resistant microbes. Penicillin-resistant *Staphylococcus* was common in hospitals by the 1950s, and MRSA was first reported in 1961, within two years of methicillin coming into use.',
  sim: { id: 'inf-antibiotic', params: { dose: 6 } }
},

/* ================================================================ vaccines */
{
  id: 'vaccines', parent: 'microbes', title: 'Vaccines and how they work', level: 2,
  short: 'A vaccine shows the immune system a harmless version or piece of a germ so that it builds memory without the illness. Vaccines are among the safest and most effective tools in medicine: serious side effects are real but rare, and far rarer than the harms of the diseases they prevent.',
  keywords: ['vaccine', 'vaccination', 'immunisation', 'immunization', 'herd immunity', 'community immunity', 'vaccine effectiveness', 'vaccine efficacy', 'mRNA vaccine', 'live attenuated', 'booster', 'adjuvant', 'side effects', 'MMR', 'measles', 'vaccine safety', 'base rate', 'autism myth'],
  prereq: ['adaptive-immunity', 'antibodies', 'infection-spread'],
  related: ['epidemics', 'influenza-covid', 'innate-immunity', 'immunodeficiency', 'risk-communication', 'bayes-diagnosis', 'clinical-trials', 'malaria', 'tuberculosis', 'anaphylaxis'],
  body: `
A mother holds her one-year-old for the MMR vaccine and wonders: is it really needed when nobody she knows has had measles? Is it safe? Those are good questions with clear answers. Measles is one of the most contagious infections known — one case can infect 12 to 18 unprotected people — and before vaccination almost every child caught it. It still kills: WHO estimated about 107,500 measles deaths in 2023, mostly of children under five. Nobody she knows has had measles precisely because most people around her were vaccinated.

### How a vaccine works
The first time the immune system meets a germ it needs one to two weeks to produce the right antibodies and T cells — time in which the germ can do serious harm. Afterwards it keeps **memory** B and T cells, and a second encounter is met within days by a faster, stronger response ([[adaptive-immunity]], [[antibodies]]). A vaccine produces that first, slow response without the disease.

| Type | What is given | Examples |
|---|---|---|
| Live weakened (attenuated) | a weakened germ that multiplies a little | measles–mumps–rubella (MMR), chickenpox, rotavirus, yellow fever, BCG |
| Inactivated | a killed germ | injected polio, hepatitis A, rabies, most flu vaccines |
| Protein or sugar pieces | purified or lab-made pieces, sugars often linked to a protein so that babies respond | hepatitis B, HPV, whooping cough, pneumococcal, meningococcal, shingles |
| Toxoid | an inactivated toxin | tetanus, diphtheria |
| mRNA | instructions for our cells to make one viral protein for a few days; the mRNA is then broken down and never enters the nucleus | COVID-19 vaccines (from 2020), an RSV vaccine (2024) |
| Viral vector | a harmless virus carrying one gene of the target | some COVID-19 vaccines, an Ebola vaccine |

**Adjuvants** strengthen the response; **boosters** refresh fading memory (tetanus) or update it when the germ changes (influenza, COVID-19).

### Protecting the people around you
When enough people are immune, each case infects fewer than one other and outbreaks cannot grow. That **herd immunity threshold** is $1 - 1/R_0$: about 93 % for measles. Because no vaccine protects everyone, the coverage needed is higher, $V_c = (1 - 1/R_0)/E$ — for measles, whose two doses protect about 97 % of children, around 95 %, WHO's target. Herd immunity shields babies too young to be vaccinated and people who cannot be, such as those on chemotherapy. It worked for smallpox, declared eradicated in 1980, and it has taken wild polio from about 350,000 cases a year in 1988 to between a dozen and about a hundred a year in 2023–2024, in only two countries. WHO estimated in 2024 that immunisation had saved about 154 million lives over the previous 50 years.

### Side effects, honestly
Vaccines are tested in trials of thousands to tens of thousands of people before approval, and watched afterwards by reporting systems in every country, because very rare effects only show up after millions of doses. What is known:

| Effect | About how often | For comparison |
|---|---|---|
| Sore arm, tiredness, headache, mild fever for a day or two | common (1 in 10 or more) | a sign of the immune response |
| Fever-related seizure 1–2 weeks after MMR | 1 in 3,000–4,000 doses | brief, usually without lasting harm; measles causes brain inflammation in about 1 in 1,000 cases |
| Low platelets (ITP) after MMR | 1 in 30,000–40,000 doses | usually mild and temporary; measles and rubella cause it more often |
| Severe allergic reaction (anaphylaxis) | about 1 in a million doses | treatable on the spot: the reason for waiting 15 minutes after the injection |
| Guillain–Barré syndrome after flu vaccine | 1–2 extra cases per million doses | influenza itself raises the risk more |
| Myocarditis after an mRNA COVID-19 vaccine | highest in males aged 12–29 after the second dose, about 1 in 10,000–20,000; much rarer in others | mostly mild and short-lived; the infection also causes it |
| Clots with low platelets after adenovirus-vector COVID-19 vaccines | roughly 1 in 50,000–100,000 first doses, more in younger adults | led many countries to prefer other vaccines |

(Figures from CDC, EMA and national regulators' reviews, 2016–2023; approximate.) For most groups COVID-19 itself causes myocarditis more often than the vaccines; in young men after a second dose the vaccine's risk was comparable to the infection's, and for one of the two mRNA vaccines higher, which is why some countries adjusted which vaccine and what gap between doses they offered them. That is what a working safety system looks like: effects are found, measured, published and acted on.

The fear that MMR causes autism has been studied more closely than almost any question in medicine. The worry is understandable — signs of autism often become noticeable around the age MMR is given — but large studies, including one of more than 650,000 Danish children (2019), found no link, and the 1998 paper that started the fear was retracted.

When most people are vaccinated, many of the people who still fall ill will be vaccinated — not because the vaccine fails, but because there are so many more of them. The fair comparison is the *rate* of illness in each group: see the simulation and the worked example.

> [!warn] Swelling of the face or throat, difficulty breathing, wheeze, a racing heart or sudden weakness within minutes to hours of a vaccine can be anaphylaxis — call your local emergency number. Chest pain, breathlessness or a pounding heart in the week after an mRNA vaccine needs urgent medical assessment.

Questions about pregnancy, a weakened immune system or a previous reaction are best talked through with a doctor, nurse or pharmacist: they change *which* vaccines are advised, rarely *whether* protection is possible.
`,
  ideas: [
    'A vaccine trains immune memory in advance, so that the real germ meets a fast, strong response.',
    'Herd immunity: when more than 1 − 1/R₀ of people are immune, outbreaks cannot grow — about 93 % for measles.',
    'Common side effects are mild and short; serious ones are rare (for example anaphylaxis about 1 in a million doses) and much rarer than the complications of the diseases.',
    'Rare effects are found because safety monitoring continues after approval — and are acted on when found.',
    'When most people are vaccinated, many cases occur in vaccinated people even with an excellent vaccine; compare rates, not counts.'
  ],
  pitfalls: [
    'If vaccinated people still get the disease, the vaccine does not work — No vaccine is 100 % effective, and when most people are vaccinated they make up a large share of cases. The risk per person is still far lower in the vaccinated.',
    'Natural immunity is better, so it is safer to catch the disease — Catching measles or whooping cough to become immune means facing their full risks: pneumonia, brain inflammation, death. Measles even erases part of existing immune memory.',
    'mRNA vaccines change your DNA — The mRNA never enters the cell nucleus, cannot be written into DNA and is broken down within days, after the cell has made the target protein.'
  ],
  formulas: [
    {
      name: 'Vaccine effectiveness from attack rates',
      expr: 'VE = 1 - ARv/ARu', tex: '\\text{VE} = 1 - \\frac{\\text{AR}_v}{\\text{AR}_u}',
      vars: {
        VE: { name: 'vaccine effectiveness', q: 'ratio', unit: '%', tex: '\\text{VE}' },
        ARv: { name: 'attack rate among the vaccinated', q: 'ratio', unit: '%', value: 2, tex: '\\text{AR}_v' },
        ARu: { name: 'attack rate among the unvaccinated', q: 'ratio', unit: '%', value: 10, tex: '\\text{AR}_u' }
      },
      note: 'The relative reduction in risk. Effectiveness against infection, against symptomatic illness and against hospitalisation are usually different — protection against severe disease tends to be higher and to last longer.',
      practice: { unknowns: ['VE', 'ARv'] },
      stories: {
        VE: 'During an outbreak {ARu} of unvaccinated and {ARv} of vaccinated people fell ill. What is the vaccine effectiveness?',
        ARv: 'A vaccine is {VE} effective, and {ARu} of unvaccinated people catch the infection this season. What share of vaccinated people would?'
      }
    },
    {
      name: 'Vaccine coverage needed for herd immunity',
      expr: 'Vc = (1 - 1/R0)/E', tex: 'V_c = \\frac{1 - 1/R_0}{E}',
      vars: {
        Vc: { name: 'coverage needed', q: 'ratio', unit: '%', tex: 'V_c' },
        R0: { name: 'basic reproduction number', value: 15, min: 1.01, tex: 'R_0' },
        E: { name: 'protection given by the vaccine', q: 'ratio', unit: '%', value: 97, min: 1, max: 100, tex: 'E' }
      },
      note: 'Assumes people mix at random. A result above 100 % means the vaccine alone cannot stop the spread. Real communities are clustered, so pockets of low coverage can sustain outbreaks even when the national average looks fine.',
      practice: { unknowns: ['Vc', 'R0'] },
      stories: {
        Vc: 'An infection has R₀ = {R0}, and the vaccine protects {E} of those who receive it. What share of the population must be vaccinated?',
        R0: 'With a vaccine that protects {E}, coverage of {Vc} is just enough to stop spread. What R₀ does that correspond to?'
      }
    },
    {
      name: 'Share of cases who were vaccinated',
      expr: 'cv = pv*(1 - VE)/(pv*(1 - VE) + 1 - pv)', tex: 'c_v = \\frac{p_v\\,(1 - \\text{VE})}{p_v\\,(1 - \\text{VE}) + 1 - p_v}',
      vars: {
        cv: { name: 'share of cases who were vaccinated', q: 'ratio', unit: '%', tex: 'c_v' },
        pv: { name: 'share of the population vaccinated', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'p_v' },
        VE: { name: 'vaccine effectiveness', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: '\\text{VE}' }
      },
      note: 'The base-rate effect. Epidemiologists run it backwards (the "screening method") to estimate effectiveness quickly from the vaccination status of cases and the coverage in the population.',
      practice: { unknowns: ['cv', 'VE'] },
      stories: {
        cv: 'In a town {pv} of people are vaccinated with a vaccine that is {VE} effective. What share of the cases will be vaccinated people?',
        VE: '{pv} of a population is vaccinated, and {cv} of the cases in an outbreak were vaccinated. How effective is the vaccine?'
      }
    }
  ],
  examples: [
    {
      title: 'Measles and the 95 % target',
      q: 'Measles has $R_0 \\approx 15$ and two doses of MMR protect about 97 % of children. What coverage stops outbreaks, and what happens in a community with 90 % coverage?',
      steps: [
        'Herd immunity threshold: $1 - 1/15 = 93.3\\%$ must be immune.',
        'Coverage needed: $93.3\\% / 0.97 = 96.2\\%$.',
        'With 90 % coverage only $0.90 \\times 0.97 = 87.3\\%$ are immune, leaving 12.7 % susceptible.',
        'Effective reproduction number: $15 \\times 0.127 = 1.9$ — each case infects about two others, so outbreaks can grow.'
      ],
      a: 'About 95–96 % coverage is needed; at 90 % measles can still spread, with R ≈ 1.9.'
    },
    {
      title: '"Most of the cases were vaccinated!"',
      q: 'In a town of 1,000 people, 90 % are vaccinated with a vaccine that is 80 % effective against illness. During an outbreak 10 % of unvaccinated people fall ill. How many cases are there in each group, and what share of cases are vaccinated?',
      steps: [
        'Unvaccinated: 100 people, 10 % ill → 10 cases.',
        'Vaccinated: 900 people, each with a risk of $10\\% \\times (1 - 0.8) = 2\\%$ → 18 cases.',
        'Share of cases vaccinated: $18/28 = 64\\%$.',
        'Risk per person: 2 % if vaccinated, 10 % if not — the vaccine cut each person\'s risk five-fold, even though most of the cases were vaccinated.'
      ],
      a: '18 vaccinated and 10 unvaccinated cases: 64 % of the cases were vaccinated, while each vaccinated person had a fifth of the risk.'
    },
    {
      title: 'Weighing a rare side effect',
      q: 'Compare what to expect among 100,000 children given MMR with what measles caused among 100,000 children before vaccination, when nearly every child caught it.',
      steps: [
        'After MMR: about 100,000/3,500 ≈ 29 brief fever-related seizures, about 3 cases of temporary low platelets and about 0.1 cases of anaphylaxis (1 in a million).',
        'Measles (CDC figures for high-income countries): about 1 child in 20 gets pneumonia → 5,000; about 1 in 1,000 brain inflammation → 100; 1–3 in 1,000 die → 100–300.',
        'Low-income settings with malnutrition see far higher death rates from measles.'
      ],
      a: 'A few dozen brief, mostly harmless reactions against thousands of cases of pneumonia and hundreds of deaths.'
    }
  ],
  quiz: [
    { q: 'In a town where 95 % of people are vaccinated, more than half of the people in hospital with the disease are vaccinated. What does this show on its own?', choices: ['nothing alarming: with so many vaccinated, even a good vaccine leaves many vaccinated cases — compare the rates in each group', 'the vaccine does not work', 'the vaccine makes the disease worse', 'the unvaccinated must be naturally immune'], a: 0,
      why: 'With 95 people vaccinated for every 5 unvaccinated, even a vaccine that cuts the risk by 90 % leaves the vaccinated as the larger group of cases: $0.95 \\times 0.1 = 0.095$ against $0.05$ — about 66 % of cases.' },
    { q: 'Measles has an R₀ of about 15. What percentage of the population must be immune to stop it spreading?', answer: 93.3,
      why: '$1 - 1/15 = 0.933$, so about 93 %. Because the vaccine is not perfect, vaccination coverage must be higher still — about 95 %.' },
    { q: 'mRNA vaccines alter the DNA of the person who receives them.', a: false,
      why: 'The mRNA stays in the cytoplasm, is read by ribosomes to make one protein, and is broken down within days. It cannot enter the nucleus or be written into DNA.' },
    { q: 'Why do young babies benefit when the older children and adults around them are vaccinated?', choices: ['fewer infected people around them means less chance of meeting the germ before they are old enough to be vaccinated', 'antibodies spread from vaccinated people through the air', 'babies are naturally immune until the age of five', 'it makes no difference to babies'], a: 0,
      why: 'That is herd immunity. Vaccinating pregnant women against whooping cough, flu and RSV adds direct protection through antibodies passed across the placenta.' },
    { q: 'In an outbreak, 3 % of unvaccinated and 0.3 % of vaccinated people fall ill. What is the vaccine effectiveness, in per cent?', answer: 90,
      why: '$1 - 0.3/3 = 0.9$, so 90 %.' }
  ],
  applications: [
    'Childhood immunisation schedules and catch-up vaccination.',
    'Travel vaccines, such as yellow fever, typhoid and hepatitis A.',
    'Vaccination in pregnancy to protect newborns against whooping cough, flu and RSV.',
    'Outbreak response: ring vaccination against Ebola and mpox.'
  ],
  history: 'Edward Jenner showed in 1796 that inoculation with cowpox protected against smallpox; the word vaccine comes from *vacca*, Latin for cow. Louis Pasteur made the first laboratory-weakened vaccines, ending with rabies in 1885. A worldwide campaign eradicated smallpox, declared in 1980 — the only human disease eliminated so far. mRNA vaccines, researched for three decades, were first used widely against COVID-19 in December 2020.',
  sim: ['inf-base-rate', { id: 'inf-sir', params: { preset: 'measles' } }]
}

);
