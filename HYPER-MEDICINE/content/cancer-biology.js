/* HYPER-MEDICINE · content/cancer-biology.js — What cancer is: cancer as cells that break
 * the rules, the genes behind it, how tumours grow, and how they spread.
 * Simulations in sims/cancer-medicines.js (cm-multihit, cm-tumour-growth). */
Hyper.add(

{
  id: 'what-is-cancer', parent: 'cancer-biology', title: 'What cancer is', level: 1,
  short: 'Cancer is a group of hundreds of diseases with one thing in common: cells whose genes have been damaged so that they multiply when they should not, refuse to die, and can invade other tissues. It is mostly a disease of older age, and survival has been rising for decades.',
  keywords: ['cancer', 'tumour', 'tumor', 'malignant', 'benign', 'carcinoma', 'sarcoma', 'leukaemia', 'lymphoma', 'hallmarks of cancer', 'incidence', 'lifetime risk', 'warning signs', 'oncology'],
  prereq: ['cell-structure', 'dna-genes', 'tissue-types'],
  related: ['cancer-genetics', 'tumour-growth', 'metastasis', 'common-cancers', 'cancer-prevention', 'cancer-screening', 'ageing'],
  body: `
When the doctor told Samuel, 58, that the shadow on his scan was "a tumour", he heard only one word: cancer. What she actually said was more careful. A tumour is simply a lump of tissue that has grown where it should not, and many tumours are harmless. Only a sample looked at under a microscope — a **biopsy** — would show whether this one was **benign** or **malignant**. It is the right place to start, because the word *cancer* covers hundreds of different diseases that behave very differently.

### Cells that break the rules
The body's cells live by strict rules. They divide only when growth signals tell them to, stop when they are crowded, repair damaged DNA or quietly kill themselves (a tidy process called **apoptosis**) when the damage is too great, and stay in their own tissue. Those rules are written in genes. When a cell collects the wrong combination of faults in those genes — see [[cancer-genetics|Genes and cancer]] — it can escape them one by one. Researchers summarise what a cancer cell gains as the **hallmarks of cancer** (Hanahan and Weinberg, 2000, updated in 2011 and 2022): it keeps signalling itself to grow, ignores the brakes, resists cell death, divides without limit, grows its own blood supply, rewires its metabolism, hides from the immune system, and finally invades and spreads.

### Benign and malignant
A **benign** tumour — a fatty lipoma, a fibroid in the womb, most moles — grows but stays in place, often inside a capsule, and does not spread. It can still cause trouble by pressing on something, which matters inside the skull. A **malignant** tumour invades the tissue around it and can travel to distant organs ([[metastasis]]); that is what makes it a cancer. In between are **precancerous** changes, such as dysplasia of the cervix or a polyp in the bowel, which are not yet cancer but can become one — and which screening can find and remove.

| Type | Starts in | Examples |
|---|---|---|
| Carcinoma (the large majority) | cells lining organs and skin | breast, lung, bowel, prostate |
| Sarcoma | bone, muscle, fat, connective tissue | osteosarcoma |
| Leukaemia | blood-forming cells of the bone marrow | acute lymphoblastic leukaemia |
| Lymphoma and myeloma | cells of the immune system | Hodgkin lymphoma |
| Brain and spinal tumours | the brain's supporting cells | glioma |
| Germ-cell tumours | cells that make eggs or sperm | testicular cancer |

### How common, and why age matters
The International Agency for Research on Cancer (IARC) estimated about 20 million new cases and 9.7 million deaths worldwide in 2022; roughly one person in five develops cancer in their lifetime, and in countries where most people live into old age the figure approaches one in two. Cancer is mainly a disease of age, because the faults accumulate over decades: in the US about nine in ten diagnoses are in people aged 50 or over. That is also why cancer is becoming more common as populations age, even though the **age-standardised** death rate has fallen in many countries — in the US by about a third between 1991 and 2021 (American Cancer Society, 2024), thanks to less smoking, earlier detection and better treatment.

Cancer is not contagious: you cannot catch a tumour from another person. Some infections that *raise* the risk — human papillomavirus, hepatitis B and C, the stomach bacterium *Helicobacter pylori* — can be passed on, and vaccines or treatment prevent them ([[cancer-prevention|Preventing cancer]]). And much cancer is simply bad luck: it happens to people who never smoked and did everything right.

### Signs worth showing a doctor
Most of these have ordinary causes, but they deserve a check, and a second visit if they persist:

- a new lump or swelling anywhere, or a mole that changes size, shape or colour;
- unexplained weight loss, night sweats or tiredness that does not go away;
- a cough or hoarseness lasting more than three weeks, or coughing up blood;
- a change in bowel habit lasting weeks, blood in the stool or urine;
- bleeding after the menopause or between periods;
- difficulty swallowing, persistent indigestion, or a sore that does not heal.

> [!tip] Going to the doctor with a worry that turns out to be nothing is not wasting anyone's time. Doctors would much rather see ten harmless lumps than miss one cancer while it is small.

The pages that follow explain the genes behind cancer, how tumours grow and spread, and how cancer is found ([[cancer-screening|screening]], [[cancer-staging|staging]]) and treated.
`,
  ideas: [
    'Cancer is cells escaping the rules that control division, death and staying in place — through damage to the genes that write those rules.',
    'A tumour is a lump; it is malignant (cancer) only if it invades and can spread.',
    '"Cancer" is hundreds of diseases, named by the tissue they start in: carcinomas, sarcomas, leukaemias, lymphomas and more.',
    'Cancer is mostly a disease of age, because the genetic faults accumulate over decades.',
    'Persistent, unexplained symptoms deserve a doctor\'s visit; most turn out not to be cancer.'
  ],
  pitfalls: [
    'Every tumour is a cancer — Many tumours are benign: they grow but do not invade or spread. Only a biopsy can tell for certain.',
    'Rising case numbers mean cancer is becoming an epidemic of modern life — Much of the rise is because populations are older and larger. Age-standardised death rates have fallen in many countries.',
    'Cancer can be caught from someone who has it — Tumours are not contagious. Some viruses and bacteria that raise the risk can spread, and those can be prevented by vaccines or treatment.'
  ],
  formulas: [
    {
      name: 'From a yearly rate to a risk over many years',
      expr: 'R = 1 - exp(-r*T/100000)', tex: 'R = 1 - e^{-r\\,T/100\\,000}',
      vars: {
        R: { name: 'risk of developing the cancer over the period', q: 'ratio', unit: '%', tex: 'R' },
        r: { name: 'average rate (new cases per 100,000 people per year)', value: 300, tex: 'r' },
        T: { name: 'length of the period (years)', value: 75, tex: 'T' }
      },
      note: 'Registries publish yearly rates; this turns an average rate into the chance of being diagnosed over a span of life (ignoring deaths from other causes). Real rates climb steeply with age, so the average over a long life is dominated by the later years.',
      stories: { R: 'Across all ages, cancers are diagnosed at an average rate of {r} per 100,000 people a year. What is the chance of a diagnosis over {T}?', r: 'About one person in five is diagnosed with cancer over a life of {T}; that is a risk of {R}. What average yearly rate per 100,000 does this imply?' }
    },
    {
      name: 'Incidence rate',
      expr: 'I = 100000*n/P', tex: 'I = \\frac{n}{P} \\times 100\\,000',
      vars: {
        I: { name: 'incidence (new cases per 100,000 per year)', tex: 'I' },
        n: { name: 'new cases diagnosed in a year', value: 2400, tex: 'n' },
        P: { name: 'population at risk', value: 600000, tex: 'P' }
      },
      note: 'Rates per 100,000 let regions of different sizes be compared. To compare regions whose populations have different ages, registries use age-standardised rates.',
      stories: { I: 'A region of {P} people records {n} new cancers in a year. What is the incidence per 100,000?' }
    }
  ],
  examples: [
    {
      title: 'One in five',
      q: 'Worldwide, new cancers are diagnosed at an average rate of roughly 300 per 100,000 people a year when spread over the whole of a 75-year life. What lifetime risk does that imply, and why do countries where people live longer report one in two?',
      steps: [
        'Rate per person per year: $300/100\\,000 = 0.003$.',
        'Over 75 years: $R = 1 - e^{-0.003 \\times 75} = 1 - e^{-0.225} = 0.20$, about one in five.',
        'Rates climb steeply with age. Where most people live into their eighties, many more years are spent at the high rates of old age, and the average rate over a life is much higher — so the lifetime risk rises towards one in two.'
      ],
      a: 'About 20 %; longer lives spend more years at the high cancer rates of old age.'
    },
    {
      title: 'Is it cancer? Reading the words',
      q: 'A report says: "benign lipoma". Another says: "high-grade dysplasia in a polyp, completely removed". A third says: "invasive ductal carcinoma". Which is cancer?',
      steps: [
        'A lipoma is a benign tumour of fat cells: it does not invade or spread.',
        'Dysplasia is a precancerous change: abnormal cells that have not invaded. Removing the polyp removes the risk it carried.',
        '"Invasive" and "carcinoma" together mean a malignant tumour of the lining cells that has grown beyond its layer — a cancer, here of the breast ducts.'
      ],
      a: 'Only the third is cancer; the second was a precancer, removed before it became one.'
    }
  ],
  quiz: [
    { q: 'What makes a tumour malignant rather than benign?', choices: ['its size', 'that it invades surrounding tissue and can spread', 'that it grows at all', 'that it is painful'], a: 1,
      why: 'Benign tumours can grow large but stay in place; invasion and the ability to spread define cancer. Most cancers are painless early on, and many large lumps are benign.' },
    { q: 'The number of cancer cases in a country has risen by 30 % in 20 years while its population grew older. Which is the best conclusion?', choices: ['cancer risk at every age has risen by 30 %', 'the rise may be largely due to ageing; age-standardised rates are needed to tell', 'the rise must be due to pollution', 'screening has failed'], a: 1,
      why: 'Because cancer is so strongly linked to age, an older population has more cases even if the risk at each age is unchanged. Age-standardised rates remove that effect.' },
    { q: 'A person can catch cancer by caring for a relative who has it.', a: false,
      why: 'Cancer cells do not spread between people. Some infections that raise cancer risk (HPV, hepatitis B and C) are transmissible, but that is different — and they are preventable.' },
    { q: 'Using $R = 1 - e^{-rT/100\\,000}$, what is the risk over 40 years at an average rate of 150 per 100,000 per year? (in %)', answer: 5.8, unit: '%',
      why: '$1 - e^{-150 \\times 40/100\\,000} = 1 - e^{-0.06} = 0.058$, about 6 %.' },
    { q: 'Which of these is a carcinoma?', choices: ['osteosarcoma', 'most lung cancers', 'acute leukaemia', 'Hodgkin lymphoma'], a: 1,
      why: 'Carcinomas start in the lining (epithelial) cells of organs, as most lung, breast, bowel and prostate cancers do. Sarcomas start in bone and soft tissue; leukaemias and lymphomas in blood and immune cells.' }
  ],
  applications: ['Understanding a pathology report: benign, precancerous or invasive.', 'Reading cancer statistics: counts, rates and age-standardised rates.', 'Knowing which persistent symptoms deserve a doctor\'s visit.', 'Planning health services for ageing populations.'],
  history: 'The word comes from the Greek *karkinos*, crab, used by Hippocrates for tumours whose swollen veins spread like legs. Rudolf Virchow argued in the 1850s that cancers arise from cells, and in the twentieth century they were traced to genes.',
  sim: 'cm-multihit'
},

{
  id: 'cancer-genetics', parent: 'cancer-biology', title: 'Genes and cancer', level: 2,
  short: 'Cancer starts when a cell collects faults in a few key genes: accelerators stuck on (oncogenes), brakes broken (tumour suppressors) and repair crews missing. Most faults arise during life; about 5–10 % of cancers grow from an inherited one.',
  keywords: ['oncogene', 'tumour suppressor', 'TP53', 'BRCA1', 'BRCA2', 'Lynch syndrome', 'two-hit hypothesis', 'Knudson', 'somatic mutation', 'germline', 'hereditary cancer', 'genetic testing', 'multistage model', 'driver mutation', 'clonal evolution'],
  prereq: ['what-is-cancer', 'dna-genes', 'chemistry:nucleic-acids'],
  related: ['tumour-growth', 'immunotherapy', 'cancer-prevention', 'common-cancers', 'math:power-functions'],
  body: `
Leah was 34 when her aunt was diagnosed with ovarian cancer, a few years after her mother had breast cancer at 46. A genetic counsellor drew the family tree, and a blood test found that Leah, her mother and her aunt all carried a harmful change in a gene called *BRCA1*. It did not mean Leah had cancer, or that she certainly would; it meant her risk was far higher than average, and that there were things she could do about it. Her story shows the two ways genes enter cancer: faults inherited from a parent, and faults picked up during life.

### The typos that matter
Every time a cell divides it copies its six billion letters of DNA. Proofreading and repair are superb, but a few new mistakes slip through with each division, and more are added by tobacco smoke, ultraviolet light and other **carcinogens**. Almost all of them land where they do no harm. A cancer begins when, by bad luck, a single cell accumulates **driver** mutations in genes that control growth — studies of tumour genomes suggest most common cancers carry somewhere between about two and ten. The genes fall into three families:

| Kind of gene | What it normally does | When faulty | Examples |
|---|---|---|---|
| Proto-oncogene → **oncogene** | an accelerator: passes on "grow" signals | stuck on; one faulty copy is enough | *RAS*, *MYC*, extra copies of *HER2* |
| **Tumour suppressor** | a brake: stops division, triggers cell death | both copies must be lost | *TP53*, *RB1*, *APC* |
| **DNA repair** (caretaker) | fixes copying errors and breaks | mutations pile up faster | *BRCA1*, *BRCA2*, mismatch-repair genes |

*TP53*, called the guardian of the genome, is damaged in roughly half of all cancers: without it, a cell with broken DNA neither stops to repair it nor dies.

### Two hits, and why age matters so much
In 1971 Alfred Knudson studied retinoblastoma, a rare eye cancer of young children. Children with a family history often had tumours in both eyes, early; others had one tumour, later. He reasoned that the cancer needs **two hits** — both copies of a brake gene (*RB1*) knocked out. Inherit one broken copy, and every cell in the retina is already one hit down.

Many hits needed means a steep climb with age. If a cell lineage needs $k$ rare, independent events, the chance that all have happened by age $t$ grows like $t^k$, and the yearly rate of new cancers like

$$I(t) \\propto t^{\\,k-1}$$

Armitage and Doll noticed in 1954 that the death rates of many common carcinomas rise roughly as the fifth or sixth power of age — as if about six steps were needed. With $k = 6$, doubling your age multiplies the yearly rate by $2^5 = 32$. The model is a simplification (a clone with one mutation can expand and make the next hit likelier), but it explains why most cancers are diseases of later life, and why an inherited first hit brings cancer decades earlier. Try it in the simulation.

### Inherited or acquired
- **Somatic** mutations arise in one body cell during life. They are in the tumour only, and are not passed to children. This is how most cancers start.
- **Germline** variants are inherited and present in every cell. About 5–10 % of cancers arise in someone carrying a high-risk variant. Each child of a carrier has a 50 % chance of inheriting it.

Known syndromes include *BRCA1* and *BRCA2* (breast, ovarian, prostate and pancreatic cancer; by age 80 about 70 % of women carrying either develop breast cancer, against a lifetime risk for all women of about one in eight in the US and one in seven in the UK), **Lynch syndrome** (bowel and womb cancer), **familial adenomatous polyposis** (hundreds of bowel polyps) and **Li–Fraumeni syndrome** (*TP53*). A carrier can be offered earlier and more intensive screening, medicines or surgery that reduce risk, and testing for relatives.

> [!tip] It may be worth asking a doctor about genetic counselling if several close relatives on the same side of the family had the same or related cancers, if cancers were diagnosed young (under about 50), if one person had two separate cancers, if a man had breast cancer, if anyone had ovarian cancer — or if a variant is already known in the family.

### Evolution inside the body
A tumour is a population evolving under selection. A cell with an advantage outgrows its neighbours; one of its descendants gains another and takes over, and so on. By the time a tumour is found it is a mosaic of related but different cells — which is why a treatment that kills most of them can leave a resistant minority behind. Two kinds of test follow from this: **tumour profiling** reads the mutations inside the cancer to choose [[immunotherapy|targeted drugs]], while **germline testing** of blood or saliva asks whether a variant was inherited.
`,
  ideas: [
    'Cancer needs several driver mutations in the same cell lineage: oncogenes stuck on, tumour suppressors lost, repair genes broken.',
    'Most cancer mutations are acquired during life (somatic); about 5–10 % of cancers grow from an inherited high-risk variant.',
    'Tumour suppressors need two hits; inheriting the first makes cancer earlier and likelier (Knudson).',
    'If about k hits are needed, incidence rises roughly as age to the power k − 1 — steeply with age.',
    'Tumours evolve: their genetic diversity is why resistance to treatment can appear.'
  ],
  pitfalls: [
    'Cancer is mainly inherited — Only about 5–10 % of cancers are linked to a high-risk inherited variant; most mutations arise during life.',
    'Carrying a BRCA variant means you will get cancer — It raises the risk greatly but not to certainty, and screening, medicines and surgery can lower it.',
    'A mutation in one cell is enough to cause cancer — Nearly all cancers need several driver mutations in the same lineage, which is why they take decades to appear.'
  ],
  formulas: [
    {
      name: 'The multistage model: how incidence climbs with age',
      expr: 'I2 = I1*(a2/a1)^(k - 1)', tex: 'I_2 = I_1 \\left(\\frac{a_2}{a_1}\\right)^{k-1}',
      vars: {
        I2: { name: 'incidence at the older age (per 100,000 per year)', tex: 'I_2' },
        I1: { name: 'incidence at the younger age (per 100,000 per year)', value: 10, tex: 'I_1' },
        a1: { name: 'younger age (years)', value: 40, tex: 'a_1' },
        a2: { name: 'older age (years)', value: 70, tex: 'a_2' },
        k: { name: 'number of hits needed', value: 6, min: 1, max: 12, tex: 'k' }
      },
      note: 'Armitage and Doll\'s idea (1954): if k rare, independent steps are needed, the rate of new cancers rises as age^(k−1). Real curves bend, but k ≈ 5–7 fits many carcinomas.',
      practice: { unknowns: ['I2', 'k'] },
      stories: { I2: 'A cancer that needs {k} hits has an incidence of {I1} per 100,000 a year at age {a1}. What does the model predict at age {a2}?', k: 'The incidence of a cancer is {I1} per 100,000 at {a1} and {I2} per 100,000 at {a2}. How many hits does the multistage model suggest?' }
    }
  ],
  examples: [
    {
      title: 'Thirty-two times',
      q: 'For a cancer that behaves as if six hits are needed, how does the yearly rate at 70 compare with the rate at 35? And for a person who inherited one of the hits?',
      steps: [
        'Six hits: $I \\propto t^{5}$, so $I_{70}/I_{35} = 2^5 = 32$.',
        'An inherited hit leaves five to go: $I \\propto t^{4}$, and the ratio is $2^4 = 16$ — a flatter curve, but starting from a much higher level at every age.',
        'That is Knudson\'s pattern: carriers get the cancer earlier and more often, sometimes more than once.'
      ],
      a: '32 times higher at 70; for a carrier the curve is shifted to younger ages.'
    },
    {
      title: 'A family tree',
      q: 'A woman carries a harmful *BRCA2* variant. What is the chance that at least one of her two children inherits it?',
      steps: [
        'Each child independently has a 1 in 2 chance of inheriting it.',
        'The chance that neither does: $\\tfrac12 \\times \\tfrac12 = \\tfrac14$.',
        'So the chance that at least one does is $1 - \\tfrac14 = \\tfrac34$. Sons as well as daughters can inherit it, and a son can pass it on.'
      ],
      a: '75 %; testing is usually offered to adult relatives after counselling.'
    }
  ],
  quiz: [
    { q: 'A tumour suppressor gene usually causes cancer only when…', choices: ['one copy is overactive', 'both copies are lost or broken', 'it is inherited', 'the cell stops dividing'], a: 1,
      why: 'One working brake is usually enough, so both copies must fail — the two hits. An oncogene, by contrast, acts when one copy is stuck on.' },
    { q: 'The yearly rate of a cancer is 20 per 100,000 at age 40 and 640 per 100,000 at age 80. How many hits does the multistage model suggest?', answer: 6,
      why: '640/20 = 32 = 2^5 for a doubling of age, so k − 1 = 5 and k = 6.' },
    { q: 'Why do people who inherit a faulty RB1 gene often get retinoblastoma in both eyes, and young?', choices: ['the inherited gene is an oncogene', 'every cell already has one hit, so only one more is needed', 'the eyes are exposed to more light', 'the virus spreads between the eyes'], a: 1,
      why: 'With one copy already broken in every cell, a single further hit in any retinal cell is enough, and with millions of cells that happens early and in more than one place.' },
    { q: 'Mutations found only in the tumour, not in the blood, are passed on to a person\'s children.', a: false,
      why: 'Somatic mutations exist only in the tumour\'s cells. Children inherit what is in the egg and sperm, which a blood (germline) test reads.' },
    { q: 'Why can a cancer that responds well to a drug later start growing again?', choices: ['the drug wears out', 'the tumour contained, or evolved, cells the drug does not kill, and they take over', 'the immune system stops the drug', 'cancer cells become normal'], a: 1,
      why: 'Tumours are genetically diverse populations. The drug removes the sensitive cells, and a resistant minority — present from the start or newly mutated — is selected and grows.' }
  ],
  applications: ['Genetic counselling and testing for families with many cancers.', 'Tumour profiling to choose targeted treatments.', 'Earlier or more intensive screening for carriers of high-risk variants.', 'Understanding why cancer risk rises so steeply with age.'],
  history: 'Theodor Boveri proposed in 1914 that cancer comes from abnormal chromosomes. The first human oncogene (RAS) was found in 1982, BRCA1 was mapped in 1990 and cloned in 1994, and since 2008 whole tumour genomes have been read, mapping the drivers of every common cancer.',
  sim: 'cm-multihit'
},

{
  id: 'tumour-growth', parent: 'cancer-biology', title: 'Tumour growth', level: 2,
  short: 'A tumour grows by doubling: about thirty doublings turn one cell into a one-centimetre lump of a billion cells, and ten more would make a kilogram. Growth slows as a tumour gets bigger, and most of its life passes before it can be found.',
  keywords: ['tumour growth', 'doubling time', 'exponential growth', 'Gompertz', 'angiogenesis', 'detection threshold', 'billion cells', 'growth fraction', 'volume', 'interval cancer', 'Norton–Simon'],
  prereq: ['what-is-cancer', 'math:exponential-growth-decay', 'math:logarithms'],
  related: ['cancer-genetics', 'metastasis', 'cancer-screening', 'cancer-treatment', 'math:logistic-equation'],
  body: `
When a one-centimetre lump showed up on Ana's mammogram, her first question was how long it had been there. The honest answer surprised her: probably years. The arithmetic of doubling explains why, and it shapes almost everything about how cancer is found and treated.

### From one cell to a lump
Cells in a tumour divide, and some die; the net effect is that the number of cells — and the volume — doubles every so often. After $n$ doublings, one cell has become $2^n$. With a **volume doubling time** $T_d$,

$$N = N_0 \\cdot 2^{\\,t/T_d}$$

A cubic centimetre of tumour holds roughly a billion ($10^9$) cells — the true figure is lower when much of the lump is supporting tissue and blood vessels, but a billion is the usual round number. Since $2^{30} \\approx 10^9$, **about thirty doublings** turn a single cell into a lump of about one centimetre, the smallest size most scans or a careful examination can find. Ten more doublings would give $10^{12}$ cells, about a kilogram. So by the time a tumour can be seen, it has usually been through most of the doublings of its whole life.

Size is deceptive because volume grows as the cube of the diameter, $V = \\pi d^3/6$. Each doubling of volume increases the diameter by only 26 %, and a tumour that grows from 1 cm to 2 cm across has gone through three doublings — eight times as many cells.

### Doubling times vary enormously
Measured on repeated scans, volume doubling times differ between cancers and between people (the ranges below are rough):

| Cancer | Typical volume doubling time |
|---|---|
| Burkitt lymphoma, some acute leukaemias | days |
| Small-cell lung cancer | about 1–3 months |
| Most breast and bowel cancers, non-small-cell lung cancer | a few months to about a year |
| Many prostate cancers, some thyroid cancers | years |

With a doubling time of 100 days, thirty doublings take about eight years. A fast cancer may appear between two screening rounds (an **interval cancer**); a very slow one may never cause harm in a person's lifetime — the root of **overdiagnosis** ([[cancer-screening]]).

### Why growth slows
Tumours do not keep doubling at the same pace. Beyond a millimetre or two, a clump of cells cannot get enough oxygen by diffusion and must attract its own blood vessels (**angiogenesis**, whose importance Judah Folkman argued in 1971). The centre of a larger tumour becomes starved and dies; fewer cells are dividing; more are lost. The growth curve bends over, a shape described well by the **Gompertz** curve: fastest, in relative terms, when the tumour is small, slowing as it grows.

That has two practical consequences. Small tumours and invisible deposits have a larger share of dividing cells, so drugs that attack dividing cells work best on them — the reason chemotherapy is often given after surgery, to catch microscopic spread ([[cancer-treatment]]). And the time a tumour spends invisible is even longer than a steady doubling time suggests.

### What it means for you
- A lump found today has usually been growing for years, so the days or few weeks needed to confirm the diagnosis and plan the right treatment are time well spent. Long delays are different: studies link waits of months with worse outcomes for several common cancers, so do not put off tests or treatment.
- Screening works in the window between "big enough to detect" and "big enough to cause symptoms"; the faster the cancer, the shorter that window.
- The same doubling that makes a tumour grow makes treatment powerful: every doubling undone is a halving of the cells.

The simulation grows a tumour from one cell and marks when it could first be found.
`,
  ideas: [
    'Tumours grow by doubling: about 30 doublings make a 1 cm lump of roughly a billion cells, 40 would make a kilogram.',
    'Most of a tumour\'s life passes before it can be detected.',
    'Volume goes as diameter cubed: growing from 1 cm to 2 cm across is three doublings.',
    'Doubling times range from days to years, which decides how useful screening is.',
    'Growth slows as tumours grow (Gompertz), so small deposits have more dividing cells and respond better to chemotherapy.'
  ],
  pitfalls: [
    'A tumour that doubled in size went from 1 cm to 2 cm — Doubling the volume adds only 26 % to the diameter; 1 cm to 2 cm is an eightfold increase in cells.',
    'A newly found cancer started recently — At typical doubling times it has been growing for years; it only became detectable recently.',
    'Tumours keep growing at the same rate — Growth slows as a tumour outgrows its blood supply, so a constant doubling time is only an approximation.'
  ],
  formulas: [
    {
      name: 'Exponential growth with a doubling time',
      expr: 'N = N0*2^(t/Td)', tex: 'N = N_0 \\cdot 2^{\\,t/T_d}',
      vars: {
        N: { name: 'number of cells later', q: 'count', tex: 'N' },
        N0: { name: 'number of cells now', q: 'count', value: 5.2e8, tex: 'N_0' },
        t: { name: 'time elapsed', q: 'time', unit: 'day', value: 360, tex: 't' },
        Td: { name: 'volume doubling time', q: 'time', unit: 'day', value: 120, tex: 'T_d' }
      },
      note: 'Valid while growth is roughly exponential; larger tumours slow down (Gompertz growth).',
      practice: { unknowns: ['N', 't', 'Td'] },
      stories: { N: 'A 1 cm tumour of {N0} cells has a doubling time of {Td}. How many cells after {t} without treatment?', Td: 'Two scans {t} apart show a tumour growing from {N0} to {N} cells. What is its doubling time?', t: 'A tumour of {N0} cells doubles every {Td}. How long until it reaches {N} cells?' }
    },
    {
      name: 'Cells in a tumour of a given diameter',
      expr: 'N = nc*pi*d^3/6', tex: 'N = n_c \\, \\frac{\\pi d^3}{6}',
      vars: {
        N: { name: 'number of cells', q: 'count', tex: 'N' },
        nc: { name: 'cells per volume', q: 'numberdensity', unit: '1/cm³', value: 1e9, tex: 'n_c' },
        d: { name: 'diameter of the tumour', q: 'length', unit: 'cm', value: 1, tex: 'd' }
      },
      note: 'A sphere of diameter d has volume πd³/6. About 10⁹ cells per cm³ is a rule of thumb; stroma and dead tissue lower it.',
      stories: { N: 'Roughly how many cells are in a tumour {d} across?', d: 'A tumour holds {N} cells. What is its diameter?' }
    },
    {
      name: 'How many doublings',
      expr: 'N = 2^n', tex: 'N = 2^{\\,n}',
      vars: {
        N: { name: 'cells descended from one cell', q: 'count', value: 5.2e8, tex: 'N' },
        n: { name: 'number of doublings', tex: 'n' }
      },
      solveFor: 'n',
      note: 'n = log₂ N: about 30 for a billion cells, 40 for a trillion.',
      stories: { n: 'How many doublings does it take one cell to become {N} cells?', N: 'After {n} doublings, how many cells has one cell become?' }
    }
  ],
  examples: [
    {
      title: 'How long has it been there?',
      q: 'A tumour 1 cm across is found. If it grew from one cell with a steady volume doubling time of 100 days, how old is it? How long would it take to reach 2 cm?',
      steps: [
        'Cells: $N = 10^9 \\times \\pi (1)^3/6 = 5.2 \\times 10^8$.',
        'Doublings: $n = \\log_2(5.2 \\times 10^8) = 29$.',
        'Age: $29 \\times 100 = 2900$ days, about 8 years.',
        'From 1 cm to 2 cm the volume grows eightfold, $2^3$: three doublings, 300 days.'
      ],
      a: 'About 8 years to reach 1 cm; about 10 months more to reach 2 cm (and growth slows in reality).'
    },
    {
      title: 'Most of a tumour\'s life is invisible',
      q: 'Suppose a tumour becomes life-threatening at about $10^{12}$ cells. What fraction of its doublings has happened by the time it is 1 cm across?',
      steps: [
        '$\\log_2(10^{12}) \\approx 40$ doublings to a trillion cells.',
        'About 29 of them happen before it reaches 1 cm.',
        '$29/40 \\approx 0.73$: nearly three-quarters of its doublings are already behind it when it first becomes detectable.'
      ],
      a: 'About three-quarters — the case for finding cancers earlier, and for treatments that undo doublings.'
    }
  ],
  quiz: [
    { q: 'A tumour\'s volume doubles. By how much does its diameter grow?', choices: ['it doubles', 'by about 26 %', 'by about 41 %', 'by 8 %'], a: 1,
      why: 'Volume goes as d³, so d grows by the cube root of 2, 1.26. (41 % would be the square root, for an area.)' },
    { q: 'How many doublings take one cell to about a billion cells?', answer: 30,
      why: '2^10 ≈ 1000, so 2^30 ≈ 10^9.' },
    { q: 'Two scans three months apart show a tumour\'s volume unchanged. According to the Gompertz picture…', choices: ['it must be benign', 'it may be a slow-growing tumour or one whose growth has slowed; it still needs a specialist\'s assessment', 'it has been cured', 'the scans are wrong'], a: 1,
      why: 'Growth rates vary hugely and slow down with size. Stability is reassuring but is not proof of anything by itself; doctors interpret it with the biopsy and the type of lesion.' },
    { q: 'With a doubling time of 60 days, how many days does it take a tumour to grow from 1 cm to 2 cm across?', answer: 180, unit: 'day',
      why: 'Eight times the volume is three doublings: 3 × 60 = 180 days.' },
    { q: 'Small tumours and microscopic deposits are generally more sensitive to chemotherapy than large tumours.', a: true,
      why: 'A larger share of their cells is dividing, and drugs that attack dividing cells kill more of them — one reason treatment after surgery (adjuvant therapy) works.' }
  ],
  applications: ['Estimating how long a tumour has been growing from its size.', 'Choosing screening intervals from typical growth rates.', 'Following a small lung nodule with repeat scans and measuring its doubling time.', 'The rationale for adjuvant chemotherapy against microscopic disease.'],
  history: 'Benjamin Gompertz described his curve in 1825 for human mortality; in the 1960s Anna Laird showed that it fits the growth of tumours. Collins and colleagues introduced tumour doubling times from serial X-rays in 1956.',
  sim: 'cm-tumour-growth'
},

{
  id: 'metastasis', parent: 'cancer-biology', title: 'Metastasis', level: 2,
  short: 'Metastasis is the spread of cancer cells from where the cancer started to other organs, through the blood or lymph. It is a hard, inefficient journey that most escaping cells fail — but it causes most cancer deaths, and it is why treatment often aims at cells no scan can see.',
  keywords: ['metastasis', 'spread', 'secondary cancer', 'stage 4', 'lymph nodes', 'circulating tumour cells', 'seed and soil', 'dormancy', 'micrometastasis', 'oligometastatic', 'adjuvant', 'spinal cord compression', 'palliative care'],
  prereq: ['what-is-cancer', 'tumour-growth', 'blood-vessels'],
  related: ['cancer-staging', 'cancer-treatment', 'immunotherapy', 'common-cancers', 'math:poisson-distribution'],
  body: `
Five years after surgery and chemotherapy for bowel cancer, David's routine scan showed two small spots in his liver. The cancer had spread — the news every patient dreads. Yet his story did not end there: because there were only two deposits, surgeons could remove them, and in surgical series roughly a third to a half of people treated this way are alive five years later. Spread is serious, but what it means depends on where, how much, and what kind of cancer it is.

### The journey of a cancer cell
To form a **metastasis** — a secondary tumour of the same kind in another organ — a cell must succeed at every step of a long obstacle course:

1. **Invade**: break through the basement membrane beneath its tissue and move into the surrounding tissue, often by loosening its attachments to its neighbours.
2. **Enter** a blood or lymph vessel.
3. **Survive the trip**: the bloodstream is hostile — shear forces, immune cells, no anchorage. Most circulating tumour cells die within hours; some shelter inside clumps of platelets.
4. **Leave** the vessel in a distant organ.
5. **Survive** in foreign tissue, often as a single cell or tiny cluster — a **micrometastasis** — which may sit dormant for years.
6. **Colonise**: start dividing again and recruit blood vessels, becoming a tumour that can be seen.

Each step is improbable, but a tumour of a billion cells sheds huge numbers of them over months and years. The formula below shows how an event that is extremely unlikely for any one cell becomes likely for the tumour as a whole — and why the chance rises the longer a tumour grows and the bigger it gets.

### Seed and soil
In 1889 the surgeon Stephen Paget noticed that cancers spread to particular organs, and compared cells to seeds that grow only in congenial soil. Blood flow matters too: blood from the gut drains first to the liver, so bowel cancers tend to seed there.

| Cancer | Common sites of spread |
|---|---|
| Breast | bone, lung, liver, brain |
| Prostate | bone |
| Bowel (colorectal) | liver, lung |
| Lung | brain, bone, liver, adrenal glands |
| Melanoma | skin, lung, liver, brain |

Nearby **lymph nodes** are often the first stop, which is why surgeons sample them and why node involvement is part of [[cancer-staging|staging]]. A cancer that has spread keeps its origin: breast cancer in the bone is still breast cancer, and is treated as breast cancer — it is not bone cancer.

### Invisible spread, and why treatment reaches for it
Scans cannot see deposits smaller than a few millimetres — millions of cells. After apparently complete surgery, some people have micrometastases that later grow; in breast cancers driven by oestrogen, relapses can appear ten or twenty years on. **Adjuvant** treatment — chemotherapy, hormone therapy, radiotherapy or immunotherapy after surgery — is aimed at exactly this invisible disease, and reduces the risk of relapse for many cancers ([[cancer-treatment]]).

### What spread means today
Most cancer deaths are caused by metastatic disease rather than the first tumour. But "stage 4" is no longer one story:

- a few cancers can be cured even when widespread — testicular cancer is the classic example;
- when there are only a few metastases (**oligometastatic** disease), surgery or precise radiotherapy can remove them, sometimes for good;
- many people with advanced breast, prostate, bowel or lung cancer, or melanoma, now live for years with treatment, as with a long-term illness ([[immunotherapy|targeted drugs and immunotherapy]]);
- specialist **palliative care** — care focused on symptoms and quality of life — is worth having early, alongside cancer treatment. In one trial of advanced lung cancer, people offered it early had better quality of life and also lived longer.

> [!warn] For anyone with cancer: new back pain together with weakness or numbness in the legs, difficulty walking, or loss of bladder or bowel control can mean pressure on the spinal cord — an emergency that needs treatment within hours. Also urgent: fever during chemotherapy, sudden breathlessness, or a new severe headache with vomiting or confusion. Contact your cancer team's emergency line or call your local emergency number.
`,
  ideas: [
    'Metastasis is a multi-step journey — invade, enter a vessel, survive, leave, survive, grow — and most escaping cells fail.',
    'An improbable event per cell becomes likely for a large, long-lived tumour that sheds millions of cells.',
    'Cancers favour particular organs (seed and soil), and spread keeps the identity of the original cancer.',
    'Micrometastases below the resolution of scans are the target of adjuvant treatment.',
    'Metastatic cancer ranges from curable to long-term illness; early palliative care improves life.'
  ],
  pitfalls: [
    'Breast cancer that spreads to the bone becomes bone cancer — It is still breast cancer, made of breast cells, and it is treated as breast cancer.',
    'A clear scan after surgery means no cancer cells are left — Scans miss deposits smaller than a few millimetres, which is why adjuvant treatment is offered.',
    'Stage 4 means nothing can be done — Some metastatic cancers are curable, limited spread can be removed, and many people live for years with treatment and good symptom care.'
  ],
  formulas: [
    {
      name: 'An unlikely event, many chances (illustrative)',
      expr: 'P = 1 - exp(-n*p)', tex: 'P = 1 - e^{-n\\,p}',
      vars: {
        P: { name: 'chance that at least one metastasis forms', q: 'ratio', unit: '%', tex: 'P' },
        n: { name: 'number of cells that reach the blood and survive', value: 10000, tex: 'n' },
        p: { name: 'chance that one such cell founds a metastasis', value: 2e-5, tex: 'p' }
      },
      note: 'A toy model (independent chances, a Poisson count): the real numbers are unknown and differ hugely between cancers. It shows why a bigger tumour, shedding for longer, is more likely to have spread.',
      practice: { unknowns: ['P', 'n'] },
      stories: { P: 'Suppose {n} cancer cells survive in the blood and each has a chance of {p} of founding a metastasis. What is the chance of at least one?', n: 'If each surviving cell has a chance of {p}, how many must survive for a {P} chance of at least one metastasis?' }
    }
  ],
  examples: [
    {
      title: 'Why size and time matter',
      q: 'In the toy model, each surviving circulating cell has a 1-in-50,000 chance ($2 \\times 10^{-5}$) of founding a metastasis. Compare 1,000, 10,000 and 100,000 surviving cells.',
      steps: [
        '1,000 cells: $n p = 0.02$, $P = 1 - e^{-0.02} = 2\\%$.',
        '10,000 cells: $n p = 0.2$, $P = 1 - e^{-0.2} = 18\\%$.',
        '100,000 cells: $n p = 2$, $P = 1 - e^{-2} = 86\\%$.',
        'The chance climbs steeply once $n p$ approaches 1 — the logic behind treating cancers early, while they are small.'
      ],
      a: 'About 2 %, 18 % and 86 %: the same tiny odds per cell, very different odds per tumour.'
    }
  ],
  quiz: [
    { q: 'Prostate cancer found in the spine is treated as…', choices: ['bone cancer', 'prostate cancer that has spread', 'a new, unrelated cancer', 'spinal cancer'], a: 1,
      why: 'Metastases keep the identity of the original cancer. The cells are prostate cells and respond to prostate cancer treatments, such as hormone therapy.' },
    { q: 'Why do bowel cancers most often spread to the liver?', choices: ['the liver is the biggest organ', 'blood from the gut drains first to the liver through the portal vein', 'the liver has no immune cells', 'liver cells turn into cancer cells'], a: 1,
      why: 'Circulation routes cells from the bowel straight to the liver, where they are trapped in its small vessels — blood flow plus suitable soil.' },
    { q: 'What is the main purpose of adjuvant chemotherapy after a tumour has been completely removed?', choices: ['to shrink the removed tumour', 'to kill microscopic deposits that scans cannot see', 'to prevent infection', 'to help the wound heal'], a: 1,
      why: 'Micrometastases of millions of cells are invisible on scans; adjuvant treatment aims to destroy them before they grow.' },
    { q: 'Most cancer cells that enter the bloodstream go on to form metastases.', a: false,
      why: 'The vast majority die. Metastasis is inefficient; it happens because tumours shed enormous numbers of cells over time.' },
    { q: 'In the toy model $P = 1 - e^{-np}$ with $p = 10^{-5}$, how many surviving cells give a 50 % chance of at least one metastasis?', answer: 69315,
      why: '$e^{-np} = 0.5$ gives $np = \\ln 2 = 0.693$, so $n = 0.693/10^{-5} \\approx 69\\,000$.' }
  ],
  applications: ['Sampling lymph nodes (the sentinel node) during cancer surgery.', 'Adjuvant treatment after surgery to prevent relapse.', 'Surgery or stereotactic radiotherapy for a few metastases.', 'Early palliative care alongside treatment for advanced cancer.'],
  history: 'Stephen Paget\'s "seed and soil" paper (1889) analysed hundreds of breast cancer autopsies; James Ewing argued in the 1920s that blood flow alone explained the pattern. Both turned out to be partly right.'
}

);
