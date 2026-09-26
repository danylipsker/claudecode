/* HYPER-MEDICINE · content/cancer-care.js — Finding and treating cancer: screening with its
 * benefits and harms, diagnosis and staging, surgery, chemotherapy and radiotherapy,
 * targeted therapy and immunotherapy, the common cancers, and prevention.
 * Simulations in sims/cancer-medicines.js (cm-screening, cm-log-kill, cm-survival). */
Hyper.add(

{
  id: 'cancer-screening', parent: 'cancer-care', title: 'Cancer screening', level: 2,
  short: 'Screening looks for cancer, or the changes that come before it, in people without symptoms. For some cancers it saves lives; every programme also brings false alarms and overdiagnosis — finding cancers that would never have caused harm. Knowing both sides lets you decide.',
  keywords: ['screening', 'mammography', 'mammogram', 'cervical screening', 'HPV test', 'Pap smear', 'bowel screening', 'FIT', 'colonoscopy', 'low-dose CT', 'PSA', 'false positive', 'overdiagnosis', 'lead-time bias', 'length bias', 'positive predictive value'],
  prereq: ['tumour-growth', 'diagnostic-accuracy', 'screening-harms', 'math:bayes-theorem'],
  related: ['bayes-diagnosis', 'common-cancers', 'cancer-prevention', 'risk-communication', 'evidence-based-medicine', 'medical-imaging'],
  body: `
Maria, 52, received a letter inviting her to her first screening mammogram, with a leaflet that said something unexpected: screening saves lives, but it also finds some cancers that would never have troubled her. She wondered how both could be true. The answer is the heart of screening, and it is worth understanding before you accept or decline an invitation.

### What screening is — and is not
**Screening** means testing people who feel well, to find cancer earlier or to find and remove the changes that come before it. It is different from **diagnosis**, which investigates symptoms: anyone with a symptom should see a doctor, not wait for a screening appointment. A screening test only sorts people into "probably fine" and "needs further tests"; a diagnosis needs those further tests, usually including a biopsy.

It works in the window described in [[tumour-growth]]: between the moment a cancer (or precancer) becomes detectable and the moment it would cause symptoms. The longer that window, the easier it is to catch.

| Cancer | Test | Typically offered to (varies by country) | What the evidence shows |
|---|---|---|---|
| Cervix | HPV test (or cell test) every 3–5 years | women and anyone with a cervix, mid-20s to mid-60s | prevents most cervical cancers by finding precancer |
| Bowel | stool test (FIT) every 1–2 years, or colonoscopy | from about 50 (45 in the US) to about 74 | fewer deaths; removing polyps also prevents cancers |
| Breast | mammogram every 1–3 years | women about 50–70 (from 40 in some countries) | fewer breast-cancer deaths, with overdiagnosis |
| Lung | low-dose CT scan, yearly | older current and former heavy smokers | about a fifth fewer lung-cancer deaths |
| Prostate | PSA blood test | usually not a national programme; a personal decision | a small fall in deaths, much overdiagnosis |

### The benefits
Cervical and bowel screening are the strongest cases, because they find **precancers** that can be removed before they ever become cancer. For breast screening, the UK's independent review (2012) estimated that for every 10,000 women invited from age 50 for twenty years, about 43 deaths from breast cancer are prevented. In the largest American trial of lung screening (NLST, 2011), low-dose CT reduced lung-cancer deaths by about 20 % compared with chest X-rays — roughly three deaths prevented per 1,000 people screened over about six years.

### The harms
- **False positives.** Most people recalled after an abnormal result do not have cancer. When a cancer is present in 5 of every 1,000 people screened, even a good test (87 % sensitive, 95 % specific) gives about 11 false alarms for every cancer found — so a positive result means roughly an 8 % chance of cancer. Over ten yearly screens, the chance of at least one false alarm can reach 40 % or more. Recalls mean anxiety, more imaging and sometimes biopsies.
- **Overdiagnosis.** Some cancers found by screening grow so slowly, or not at all, that they would never have caused symptoms in the person's lifetime. Once found they are usually treated — surgery, radiotherapy, side effects — with no possible benefit. The same UK review estimated about 129 overdiagnosed breast cancers for the 43 deaths prevented: roughly three for each life saved. In South Korea, when thyroid ultrasound screening spread in the 2000s, thyroid-cancer diagnoses rose about fifteen-fold while deaths from thyroid cancer did not change.
- **False reassurance.** A normal result does not rule cancer out; a cancer can be missed, or grow between screens.

### Why survival figures can fool you
Screening can raise **five-year survival** without anyone living a day longer. If a cancer is found two years earlier but death comes at the same time, the "survival from diagnosis" is two years longer: **lead-time bias**. Screening also finds slow-growing cancers more often than fast ones, because they spend longer in the detectable window: **length bias**. And overdiagnosed cancers, which never kill, pile up as "survivors". That is why trials judge screening by **deaths from the cancer in the whole invited group**, not by the survival of those diagnosed. The simulation lets you see all three.

> [!key] Questions worth asking before screening: How many deaths does it prevent for 1,000 people like me? How many false alarms and overdiagnoses? What happens if the result is positive? The same thinking applies to any test — see [[screening-harms|Screening: benefits and harms]] and [[bayes-diagnosis]].

> [!tip] Screening is for people without symptoms. A new lump, bleeding or any persistent change should go to a doctor now, even if your last screening test was normal.
`,
  ideas: [
    'Screening tests well people to find cancer or precancer early; symptoms need a doctor, not a screening appointment.',
    'Cervical and bowel screening prevent cancers by removing precancers; breast and lung screening reduce deaths.',
    'When a disease is rare among the people tested, most positive results are false alarms.',
    'Overdiagnosis — finding cancers that would never have caused harm — is the main hidden cost of screening.',
    'Lead-time and length bias inflate survival after diagnosis; only deaths in the whole invited group show real benefit.'
  ],
  pitfalls: [
    'Screening raised five-year survival, so it must save lives — Earlier diagnosis alone lengthens survival from diagnosis (lead time), and overdiagnosed cancers inflate it. Only a fall in deaths among everyone invited proves benefit.',
    'A positive screening test means you probably have cancer — Because few people screened have cancer, most positives are false alarms; further tests decide.',
    'Every cancer found is a cancer that would have killed — Some screen-detected cancers would never have caused symptoms. Treating them brings harm without benefit.'
  ],
  formulas: [
    {
      name: 'Chance of cancer after a positive screen (PPV)',
      expr: 'PPV = se*p/(se*p + (1 - sp)*(1 - p))', tex: '\\text{PPV} = \\frac{S_e\\, p}{S_e\\, p + (1 - S_p)(1 - p)}',
      vars: {
        PPV: { name: 'positive predictive value', q: 'ratio', unit: '%', tex: '\\text{PPV}' },
        se: { name: 'sensitivity (cancers detected)', q: 'ratio', unit: '%', value: 87, min: 0, max: 100, tex: 'S_e' },
        sp: { name: 'specificity (healthy correctly cleared)', q: 'ratio', unit: '%', value: 95, min: 0, max: 100, tex: 'S_p' },
        p: { name: 'share of people screened who have cancer', q: 'ratio', unit: '%', value: 0.5, min: 0, max: 100, tex: 'p' }
      },
      note: 'Bayes\' theorem. The numbers are illustrative: real programmes differ in recall rates and in how common cancer is among those screened.',
      practice: { unknowns: ['PPV', 'sp'] },
      stories: { PPV: 'A screening test is {se} sensitive and {sp} specific; {p} of people screened have the cancer. What fraction of positive results are real cancers?', sp: 'For a test {se} sensitive among people with {p} prevalence to have a PPV of {PPV}, how specific must it be?' }
    },
    {
      name: 'Chance of at least one false alarm',
      expr: 'F = 1 - sp^n', tex: 'F = 1 - S_p^{\\,n}',
      vars: {
        F: { name: 'chance of at least one false positive', q: 'ratio', unit: '%', tex: 'F' },
        sp: { name: 'specificity of each screen', q: 'ratio', unit: '%', value: 95, min: 0, max: 100, tex: 'S_p' },
        n: { name: 'number of screens', q: 'count', value: 10, int: true, tex: 'n' }
      },
      note: 'For a person without cancer, treating the screens as independent. Real figures are somewhat lower, because some people are more prone to recalls than others.',
      stories: { F: 'A person without cancer has {n} screens, each {sp} specific. What is the chance of at least one false alarm?' }
    }
  ],
  examples: [
    {
      title: 'A positive mammogram',
      q: 'Among 10,000 women screened, 50 have breast cancer. The test detects 87 % of cancers and correctly clears 95 % of women without cancer. How many are recalled, and what fraction of them have cancer?',
      steps: [
        'Cancers detected: $0.87 \\times 50 = 43.5$ (about 44); about 6 are missed.',
        'False positives: $0.05 \\times 9950 = 497.5$ (about 498).',
        'Recalled: about $44 + 498 = 542$. Fraction with cancer: $43.5/541 = 0.080$.',
        'So roughly 1 in 12 recalled women has cancer. Better specificity helps most: at 99 % specific the fraction rises to 30 %.'
      ],
      a: 'About 540 recalls; about 8 % of them are cancers.'
    },
    {
      title: 'Weighing breast screening',
      q: 'The UK review estimated, per 10,000 women invited for 20 years from age 50, about 43 breast-cancer deaths prevented and 129 overdiagnosed cancers. Express these per 1,000 women and as a ratio.',
      steps: [
        'Per 1,000 invited: about 4 deaths prevented and about 13 overdiagnoses.',
        'Ratio: $129/43 = 3$ overdiagnosed cancers for every death prevented.',
        'Both are real outcomes for real people; how to weigh them is a personal choice, which is why invitations now come with this information.'
      ],
      a: 'About 4 lives saved and 13 overdiagnoses per 1,000 women; three to one.'
    }
  ],
  quiz: [
    { q: 'A screening programme is introduced and five-year survival after diagnosis rises from 60 % to 75 %. What does this prove?', choices: ['screening saves lives', 'nothing by itself: lead time, length bias and overdiagnosis can raise survival without preventing deaths', 'the treatment has improved', 'the cancer has become less common'], a: 1,
      why: 'Survival is timed from diagnosis, and screening moves diagnosis earlier and adds harmless cancers. Only deaths from the cancer in the whole invited population show a real benefit.' },
    { q: 'With 1 % prevalence, 90 % sensitivity and 90 % specificity, what fraction of positive results are true cancers? (in %)', answer: 8.3, unit: '%',
      why: 'Per 1,000: 9 true positives and 0.10 × 990 = 99 false ones; 9/108 = 8.3 %.' },
    { q: 'Which screening programme can prevent cancers, not just find them early?', choices: ['mammography', 'PSA testing', 'bowel screening with removal of polyps', 'lung CT'], a: 2,
      why: 'Most bowel cancers grow from polyps over years; removing them, like treating cervical precancer, stops the cancer from ever forming.' },
    { q: 'Overdiagnosis means a screening test gave a false positive result.', a: false,
      why: 'An overdiagnosed cancer is a real cancer on the microscope slide — it just would never have caused harm in the person\'s lifetime. A false positive is a result that turns out not to be cancer.' },
    { q: 'Why does screening find slow-growing cancers more often than fast ones?', choices: ['slow cancers are larger', 'they spend longer in the detectable window before symptoms', 'fast cancers cannot be seen', 'the test is designed for them'], a: 1,
      why: 'Length bias: a cancer detectable for five years before symptoms is five times likelier to be caught by a screen than one detectable for one year. Fast cancers often surface between screens.' }
  ],
  applications: ['Deciding whether to accept a screening invitation, with the numbers.', 'Understanding a recall letter calmly: most recalls are not cancer.', 'Judging claims that a new test "raises survival".', 'Designing screening programmes and their age ranges.'],
  history: 'George Papanicolaou\'s cell test (1940s) made cervical cancer the first to be screened for; where it was used, cervical cancer deaths fell sharply. The first randomised trial of mammography began in New York in 1963. The criteria for a good screening programme were set out by Wilson and Jungner for the WHO in 1968.',
  sim: 'cm-screening'
},

{
  id: 'cancer-staging', parent: 'cancer-care', title: 'Diagnosis and staging', level: 2,
  short: 'A cancer diagnosis rests on a biopsy seen under the microscope. Staging then describes how big the tumour is and how far it has spread — the TNM system — which, with the grade and the tumour\'s molecular features, guides treatment and gives a rough idea of outlook.',
  keywords: ['diagnosis', 'biopsy', 'staging', 'TNM', 'stage 1', 'stage 4', 'grade', 'pathology', 'tumour marker', 'PET scan', 'multidisciplinary team', 'five-year survival', 'relative survival', 'prognosis', 'performance status'],
  prereq: ['what-is-cancer', 'metastasis', 'medical-imaging'],
  related: ['cancer-treatment', 'common-cancers', 'lab-tests', 'history-examination', 'immunotherapy'],
  body: `
Joseph, 63, had been passing blood for a few weeks before he mentioned it to his doctor. A colonoscopy found a growth; the biopsy confirmed bowel cancer; a CT scan showed that two nearby lymph nodes looked enlarged but the liver and lungs were clear. Within a fortnight a team of specialists met to discuss him, and his surgeon explained: "stage 3 — it has reached the lymph nodes, but not beyond. We aim to cure it with surgery and then chemotherapy." Each word in that sentence came from a step described below.

### From suspicion to certainty
- **History, examination and blood tests** point the way (a blood count may show anaemia from slow bleeding).
- **Imaging** finds and measures: ultrasound, CT, MRI, and PET–CT, which lights up tissues burning sugar fast ([[medical-imaging]]).
- **Endoscopy** looks inside hollow organs — the bowel, stomach, airways, bladder — and takes samples.
- **Biopsy** is the step that makes the diagnosis. A pathologist examines the tissue and reports the **type** of cancer, its **grade** (how abnormal the cells look: low-grade cells resemble normal tissue and tend to grow slowly; high-grade ones do not), and tests for markers — hormone receptors and *HER2* in breast cancer, mutations such as *EGFR* in lung cancer, mismatch-repair status in bowel cancer — that point to particular drugs.

**Tumour markers** in the blood (PSA, CA-125, CEA and others) are useful for following a known cancer, but most are too unreliable to diagnose one: benign conditions raise them, and early cancers often do not.

### TNM: size, nodes, spread
Most solid cancers are staged with the **TNM** system (UICC and AJCC, 8th edition, 2017):

| Letter | Describes | Scale |
|---|---|---|
| T | the primary tumour: size and how far it has grown into nearby tissue | T1 (small) to T4 (large or invading neighbouring structures) |
| N | spread to nearby lymph nodes | N0 (none) to N3 (many, or distant nodes) |
| M | spread to distant organs (metastasis) | M0 (none) or M1 (present) |

The combination is grouped into **stages 0 to 4**. Stage 0 means cells that look cancerous but have not invaded (*in situ*); stages 1 and 2 are generally confined to the organ; stage 3 has usually reached lymph nodes or nearby structures; stage 4 has spread to distant organs. Blood cancers and brain tumours use other systems (lymphomas by the regions involved, for example; brain tumours mainly by grade).

### Why stage matters so much
Stage is the strongest single guide to treatment and outlook. For people diagnosed in the US in 2014–2020, five-year relative survival (American Cancer Society, 2025) was roughly:

| Cancer | Localised | Spread to nearby nodes or tissue | Distant spread |
|---|---|---|---|
| Breast (women) | 99 % | 87 % | 32 % |
| Bowel (colorectal) | 91 % | 74 % | 13 % |
| Lung | 63 % | 35 % | 9 % |
| Prostate | nearly 100 % | nearly 100 % | 37 % |

**Relative survival** compares people with the cancer to people of the same age and sex in the general population, so deaths from other causes are allowed for. These figures describe groups diagnosed years ago; treatment has improved since, and one person's outlook depends on much more — the cancer's biology, their general health (often scored as **performance status**), and how it responds. Survival also differs a great deal between countries.

### The team and the questions
Cancer care is planned by a **multidisciplinary team** — surgeons, oncologists, radiologists, pathologists, specialist nurses — who review each case together. Useful questions to bring:

- What type of cancer is it, what stage and what grade? What did the biopsy tests show?
- Is the aim to cure it, or to control it and keep me well?
- What are the options — including a clinical trial — and their benefits and side effects? What happens if I choose not to have treatment?
- Who do I call, day or night, if I become unwell?

> [!tip] It is normal to feel overwhelmed at diagnosis. Bring someone with you, write questions down, and ask for the answers in writing. A second opinion is a routine request, not an insult to your doctor.
`,
  ideas: [
    'Only a biopsy makes a cancer diagnosis; imaging finds and measures, blood markers mainly follow known cancers.',
    'TNM records the tumour\'s size and invasion, lymph-node spread and distant spread; they combine into stages 0–4.',
    'Grade describes how abnormal the cells look; molecular tests on the biopsy point to specific drugs.',
    'Stage is the strongest guide to treatment and outlook, but survival figures are averages from the past.',
    'Relative survival allows for deaths from other causes by comparing with the general population.'
  ],
  pitfalls: [
    'A high tumour marker in a blood test means cancer — Many markers rise in benign conditions and stay normal in early cancers; a biopsy is needed.',
    'Stage and grade are the same thing — Stage is how far the cancer has spread; grade is how abnormal its cells look under the microscope.',
    'A 30 % five-year survival figure means I have a 30 % chance — It is an average for people diagnosed years ago, of all ages and states of health. Your own outlook may be quite different; ask your team.'
  ],
  formulas: [
    {
      name: 'Relative survival',
      expr: 'RS = So/Se', tex: '\\text{RS} = \\frac{S_o}{S_e}',
      vars: {
        RS: { name: 'relative survival', q: 'ratio', unit: '%', tex: '\\text{RS}' },
        So: { name: 'observed survival of people with the cancer', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: 'S_o' },
        Se: { name: 'expected survival of similar people without it', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'S_e' }
      },
      note: 'The standard way registries report cancer survival: it removes the effect of deaths from other causes, which matter a lot in older age groups.',
      stories: { RS: 'Five years after diagnosis, {So} of a group of older people with a cancer are alive; {Se} of similar people without it would be. What is the relative survival?' }
    },
    {
      name: 'Survival with a constant risk',
      expr: 'S = 2^(-t/m)', tex: 'S = 2^{-t/m}',
      vars: {
        S: { name: 'fraction still alive', q: 'ratio', unit: '%', tex: 'S' },
        t: { name: 'time since diagnosis', q: 'time', unit: 'yr', value: 2, tex: 't' },
        m: { name: 'median survival', q: 'time', unit: 'yr', value: 1, tex: 'm' }
      },
      note: 'If the risk of dying each month stays the same, survival falls by half every median. Real curves often flatten later, when some people are cured.',
      practice: { unknowns: ['S', 'm'] },
      stories: { S: 'In a group whose median survival is {m}, what fraction is alive after {t} if the risk stays constant?' }
    }
  ],
  examples: [
    {
      title: 'Reading a stage',
      q: 'A report says: "adenocarcinoma of the colon, T3 N1 M0, grade 2". What does it mean?',
      steps: [
        'Adenocarcinoma: a cancer of gland-forming lining cells — the usual kind of bowel cancer.',
        'T3: the tumour has grown through the muscle layer of the bowel wall. N1: a few nearby lymph nodes contain cancer. M0: no distant spread seen.',
        'Nodes involved without distant spread: stage 3. Grade 2: moderately abnormal cells.',
        'Stage 3 bowel cancer is usually treated with the aim of cure: surgery, then chemotherapy to reduce the risk of return.'
      ],
      a: 'Stage 3 bowel cancer, treated with curative intent.'
    },
    {
      title: 'Why relative survival',
      q: 'Of 1,000 people aged 80 with a cancer, 450 are alive five years later. Of 1,000 people aged 80 in the general population, about 650 are. What is the relative survival, and why use it?',
      steps: [
        'Observed survival: 45 %. Expected: 65 %.',
        'Relative survival: $45/65 = 0.69$, about 69 %.',
        'Many 80-year-olds die of other causes within five years; relative survival estimates the share of the gap due to the cancer.'
      ],
      a: 'About 69 %; it separates the effect of the cancer from other causes of death.'
    }
  ],
  quiz: [
    { q: 'Which finding makes a cancer stage 4 in the TNM system?', choices: ['a large primary tumour', 'many lymph nodes involved', 'spread to a distant organ', 'a high grade'], a: 2,
      why: 'M1 — distant metastasis — defines stage 4. A large tumour or many nodes can make it stage 3; grade is separate from stage.' },
    { q: 'What establishes the diagnosis of cancer?', choices: ['a CT scan', 'a tumour marker blood test', 'a biopsy examined by a pathologist', 'the symptoms'], a: 2,
      why: 'Scans and markers raise suspicion; only examining the cells shows cancer and its type, grade and markers.' },
    { q: 'Observed five-year survival is 40 % in a group whose expected survival is 80 %. What is the relative survival? (in %)', answer: 50, unit: '%',
      why: '40/80 = 0.5. Half of the expected survivors are alive; the other half of the gap is attributed to the cancer.' },
    { q: 'A high-grade cancer is necessarily at an advanced stage.', a: false,
      why: 'Grade describes the cells, stage the spread. A small, early (stage 1) cancer can be high-grade, and a low-grade one can have spread.' },
    { q: 'If the median survival is 1 year and the risk stays constant, what fraction is alive after 3 years? (in %)', answer: 12.5, unit: '%',
      why: 'Three medians: $(1/2)^3 = 1/8 = 12.5$ %. Real survival curves often flatten, when some people are cured.' }
  ],
  applications: ['Understanding a pathology report and a TNM stage.', 'Planning treatment in a multidisciplinary team meeting.', 'Comparing cancer survival between countries and over time with relative survival.', 'Preparing questions for a first oncology appointment.'],
  history: 'Pierre Denoix developed the TNM system in France between 1943 and 1952; it has been revised regularly since, most recently in the 8th edition (2017), with molecular features increasingly added.'
},

{
  id: 'cancer-treatment', parent: 'cancer-care', title: 'Surgery, chemotherapy and radiotherapy', level: 2,
  short: 'The three pillars of cancer treatment: surgery removes a tumour, radiotherapy destroys it where it lies with carefully aimed doses of radiation, and chemotherapy kills dividing cells throughout the body, in cycles that give healthy tissue time to recover.',
  keywords: ['cancer treatment', 'surgery', 'chemotherapy', 'radiotherapy', 'radiation therapy', 'log-kill', 'cycles', 'fractionation', 'gray', 'BED', 'adjuvant', 'neoadjuvant', 'palliative', 'hormone therapy', 'neutropenic sepsis', 'side effects'],
  prereq: ['tumour-growth', 'metastasis', 'cancer-staging', 'physics:radiation-dose'],
  related: ['immunotherapy', 'side-effects-interactions', 'dose-response', 'sepsis', 'clinical-trials', 'physics:x-rays', 'math:logarithms'],
  body: `
Priya, 45, was treated for breast cancer with all three pillars: an operation to remove the tumour and the nearest lymph node, then six cycles of chemotherapy three weeks apart, then three weeks of daily radiotherapy to the breast, and finally years of tablets that block oestrogen. Each step had a different job. Understanding them makes a long treatment plan less bewildering.

### Surgery: removing the tumour
For most solid cancers found before they have spread, surgery is the treatment most likely to cure. The surgeon removes the tumour with a **margin** of healthy tissue around it, and often samples the lymph nodes — sometimes just the first one or two the tumour drains to, the **sentinel nodes**. Keyhole and robotic operations shorten recovery. Surgery may also relieve a blockage or remove a few metastases.

### Radiotherapy: energy aimed at the tumour
High-energy X-rays ([[physics:x-rays|X-rays]]), or sometimes protons, damage DNA; cells that cannot repair the damage die when they next try to divide. The dose is measured in **gray** (Gy), joules absorbed per kilogram ([[physics:radiation-dose|radiation dose]]). About half of all people with cancer benefit from radiotherapy at some point, to cure or to relieve symptoms such as pain from bone metastases.

The dose is split into daily **fractions** — often around 2 Gy, five days a week — because healthy tissues repair between fractions better than most tumours. The **linear–quadratic model** captures this: the **biologically effective dose** of $n$ fractions of $d$ gray is

$$\\text{BED} = n\\,d\\left(1 + \\frac{d}{\\alpha/\\beta}\\right)$$

where $\\alpha/\\beta$ is about 10 Gy for many tumours and fast-reacting tissues and about 3 Gy for the slow-reacting tissues where late side effects arise. Large fractions hurt late-reacting tissue disproportionately, which is why treatments with a few big fractions (**stereotactic** radiotherapy) are only given with very precise aiming. Modern machines shape the beam to the tumour from many angles, sparing what lies around it. External-beam radiotherapy does not make you radioactive; treatments that place a radioactive source or liquid inside the body (brachytherapy, radioiodine) need only brief, specific precautions.

### Chemotherapy: attacking division everywhere
Chemotherapy drugs damage DNA or the machinery of cell division, so they hit fast-dividing cells — cancer cells, but also hair follicles, the gut lining and the bone marrow that makes blood cells. That explains the classic side effects: hair loss, a sore mouth, diarrhoea, tiredness, and low blood counts. Nausea, once dreaded, is now well controlled for most people.

Two ideas shape how chemotherapy is given:

- **Log-kill.** Each dose kills a constant *fraction* of the cancer cells, not a constant number (Skipper, 1964). A dose that kills 99 % — two "logs" — reduces $10^{10}$ cells to $10^8$, still far too many. So treatment is repeated in **cycles**, typically every 2–4 weeks, and between cycles the surviving cells regrow. The cycle length is set by the bone marrow, which needs about three weeks to recover.
- **Combinations.** Using several drugs with different targets makes it far less likely that some cells resist all of them.

Chemotherapy can be **adjuvant** (after surgery, against invisible spread — [[metastasis]]), **neoadjuvant** (before surgery, to shrink a tumour), curative on its own (for many leukaemias, lymphomas and testicular cancer), or **palliative** (to control cancer and symptoms). **Hormone therapy** starves hormone-driven cancers: drugs that block or lower oestrogen in many breast cancers, and testosterone in prostate cancer. Newer drugs aimed at the cancer's own weaknesses are described in [[immunotherapy]].

> [!warn] During chemotherapy, a temperature of 38 °C or above, shivering, or suddenly feeling very unwell can mean a serious infection while the white-cell count is low (neutropenic sepsis). This is an emergency, even in the middle of the night: call your cancer team's 24-hour number immediately, or call your local emergency number.

> [!note] Complementary therapies such as massage, exercise programmes or acupuncture can help with symptoms and wellbeing alongside treatment — tell your team what you use, as some supplements interact with cancer drugs. Alternative remedies used *instead* of proven treatment are dangerous: in one large American study, people who chose them were about two and a half times as likely to die.
`,
  ideas: [
    'Surgery removes, radiotherapy destroys in place, chemotherapy reaches cells everywhere; many plans use all three.',
    'Radiation damages DNA; splitting it into fractions lets healthy tissue repair between doses.',
    'Chemotherapy kills a constant fraction of cells per dose (log-kill), so it is given in repeated cycles.',
    'Cycles are spaced to let the bone marrow recover; fever during chemotherapy is an emergency.',
    'Adjuvant treatment targets invisible spread after surgery; neoadjuvant shrinks a tumour first.'
  ],
  pitfalls: [
    'One strong dose of chemotherapy should kill every cancer cell — Each dose kills a fraction; a 99 % kill of ten billion cells leaves a hundred million, which is why cycles are repeated.',
    'Radiotherapy makes you radioactive — External-beam radiotherapy leaves nothing radioactive behind; you are safe to be with others, including children.',
    'Side effects show the treatment is working — Side effects come from damage to healthy dividing cells and say little about the effect on the cancer.'
  ],
  formulas: [
    {
      name: 'Log-kill with regrowth between cycles',
      expr: 'N = N0*(10^(-L)*2^(tau/Td))^c', tex: 'N = N_0 \\left(10^{-L} \\cdot 2^{\\,\\tau/T_d}\\right)^{c}',
      vars: {
        N: { name: 'cancer cells after the last cycle and its gap', q: 'count', tex: 'N' },
        N0: { name: 'cancer cells at the start', q: 'count', value: 1e10, tex: 'N_0' },
        L: { name: 'log-kill per cycle (2 = 99 % killed)', value: 2, tex: 'L' },
        tau: { name: 'time between cycles', q: 'time', unit: 'day', value: 21, tex: '\\tau' },
        Td: { name: 'doubling time of the surviving cells', q: 'time', unit: 'day', value: 30, tex: 'T_d' },
        c: { name: 'number of cycles', q: 'count', value: 6, int: true, tex: 'c' }
      },
      note: 'The classic model of Skipper and colleagues: every cycle kills a fixed fraction, and the survivors regrow during the gap. It ignores resistance, which in reality limits most treatments.',
      practice: { unknowns: ['N', 'L'] },
      stories: { N: 'A tumour of {N0} cells receives {c} cycles, {tau} apart; each kills {L} logs and the cells double every {Td}. How many cells remain?', L: 'To take {N0} cells down to {N} in {c} cycles {tau} apart, with a doubling time of {Td}, how many logs must each cycle kill?' }
    },
    {
      name: 'Biologically effective dose (radiotherapy)',
      expr: 'BED = n*d*(1 + d/ab)', tex: '\\text{BED} = n\\, d \\left(1 + \\frac{d}{\\text{α/β}}\\right)',
      vars: {
        BED: { name: 'biologically effective dose', q: 'dose', unit: 'Gy', tex: '\\text{BED}' },
        n: { name: 'number of fractions', q: 'count', value: 25, int: true, tex: 'n' },
        d: { name: 'dose per fraction', q: 'dose', unit: 'Gy', value: 2, tex: 'd' },
        ab: { name: 'α/β ratio of the tissue', q: 'dose', unit: 'Gy', value: 10, tex: '\\text{α/β}' }
      },
      note: 'The linear–quadratic model, used to compare schedules. α/β ≈ 10 Gy for many tumours and early-reacting tissue; ≈ 3 Gy for late-reacting tissue such as spinal cord or bowel wall.',
      practice: { unknowns: ['BED', 'n'] },
      stories: { BED: 'A schedule gives {n} fractions of {d}. What is the BED for a tissue with α/β = {ab}?', n: 'How many fractions of {d} give a BED of {BED} for α/β = {ab}?' }
    }
  ],
  examples: [
    {
      title: 'How many cycles?',
      q: 'A cancer of $10^{10}$ cells is treated with cycles that each kill 99 % of cells, every 21 days; survivors double every 30 days. How many cycles bring the expected number of cells below one?',
      steps: [
        'Kill per cycle: 2 logs. Regrowth over 21 days: $2^{21/30} = 1.62$, i.e. $\\log_{10} 1.62 = 0.21$ logs back.',
        'Net fall per cycle: $2 - 0.21 = 1.79$ logs.',
        'Cycles for 10 logs: $10/1.79 = 5.6$, so six cycles.',
        'After six: $10^{10} \\times 10^{-6 \\times 1.79} \\approx 0.18$ cells on average — in this model, an 83 % chance ($e^{-0.18}$) that none survive.'
      ],
      a: 'Six cycles — if no cells are resistant. A resistant minority is what usually spoils the arithmetic.'
    },
    {
      title: 'Same tumour dose, different late effects',
      q: 'Compare 25 fractions of 2 Gy with 5 fractions of 7 Gy for a tumour ($\\alpha/\\beta = 10$ Gy) and for late-reacting tissue ($\\alpha/\\beta = 3$ Gy).',
      steps: [
        '25 × 2 Gy: tumour BED $= 50(1 + 0.2) = 60$ Gy; late tissue $= 50(1 + 0.67) = 83$ Gy.',
        '5 × 7 Gy: tumour BED $= 35(1 + 0.7) = 59.5$ Gy; late tissue $= 35(1 + 2.33) = 117$ Gy.',
        'Nearly the same effect on the tumour, but a much larger effect on late-reacting tissue — so five big fractions are only safe when the beam can be aimed precisely enough to keep that tissue out of the high-dose region.'
      ],
      a: 'Tumour BED about 60 Gy in both; late-tissue BED 83 against 117 Gy.'
    }
  ],
  quiz: [
    { q: 'A chemotherapy dose kills 99.9 % of cancer cells. Starting from $10^{9}$ cells, how many remain after one dose?', answer: 1e6,
      why: '99.9 % is three logs: $10^9 \\times 10^{-3} = 10^6$ — a million cells, which is why cycles are repeated.' },
    { q: 'Why is chemotherapy usually given every three weeks rather than every day?', choices: ['the drugs are expensive', 'healthy tissues, especially the bone marrow, need time to recover between doses', 'cancer cells only divide every three weeks', 'the drugs last three weeks in the body'], a: 1,
      why: 'Blood counts fall about 7–14 days after a dose and recover by about three weeks. Dosing again too soon would leave the marrow too little time.' },
    { q: 'Why is radiotherapy split into many small daily fractions?', choices: ['machines cannot give large doses', 'healthy tissues repair between fractions better than most tumours', 'to make the radiation stay longer', 'patients cannot lie still for long'], a: 1,
      why: 'Fractionation exploits the difference in repair (captured by α/β): it spares late-reacting healthy tissue for the same effect on the tumour.' },
    { q: 'What is the BED of 20 fractions of 2.75 Gy for a tumour with $\\alpha/\\beta = 10$ Gy?', answer: 70.1, unit: 'Gy',
      why: '$55 \\times (1 + 0.275) = 70.1$ Gy.' },
    { q: 'A fever of 38.3 °C during chemotherapy can safely wait until the next scheduled appointment.', a: false,
      why: 'With a low white-cell count, infection can progress to sepsis within hours. It needs same-hour contact with the cancer team or emergency services and usually antibiotics within an hour.' }
  ],
  applications: ['Planning a combined treatment: surgery, chemotherapy, radiotherapy, hormone therapy.', 'Choosing radiotherapy schedules with the BED.', 'Timing chemotherapy cycles around bone-marrow recovery.', 'Recognising neutropenic sepsis as an emergency.'],
  history: 'Wilhelm Röntgen\'s X-rays (1895) were used against cancer within months. Modern chemotherapy grew from wartime research on mustard agents (1940s) and Sidney Farber\'s antifolate treatment of childhood leukaemia (1948); combination chemotherapy made childhood leukaemia largely curable by the 1970s.',
  sim: 'cm-log-kill'
},

{
  id: 'immunotherapy', parent: 'cancer-care', title: 'Immunotherapy and targeted therapy', level: 3,
  short: 'Newer cancer medicines aim at what makes a particular cancer different: targeted drugs block the faulty proteins that drive it, and immunotherapies release the brakes on the immune system or engineer immune cells to attack it. For some cancers they have transformed survival, but they do not work for everyone.',
  keywords: ['immunotherapy', 'targeted therapy', 'checkpoint inhibitor', 'PD-1', 'PD-L1', 'CTLA-4', 'CAR-T', 'monoclonal antibody', 'imatinib', 'HER2', 'EGFR', 'BRAF', 'PARP inhibitor', 'biomarker', 'precision oncology', 'hazard ratio', 'immune-related side effects'],
  prereq: ['cancer-genetics', 'cancer-treatment', 'adaptive-immunity', 'antibodies'],
  related: ['how-drugs-work', 'clinical-trials', 'autoimmunity', 'common-cancers', 'metastasis'],
  body: `
In 2011 Tom, 61, was told his melanoma had spread to his lungs and liver. At that time most people in his situation died within a year. He joined a trial of a new kind of drug that does not attack the cancer at all — it takes the brakes off the immune system. His tumours shrank over months and did not come back; years later he was still well. Not everyone responds like Tom, but stories like his, repeated in trials, changed the outlook of several cancers within a decade.

### Targeted therapy: hitting the driver
A tumour depends on the faulty proteins made by its driver mutations ([[cancer-genetics|Genes and cancer]]). A drug that blocks one of them can stop the cancer while largely sparing normal cells. The model case is **chronic myeloid leukaemia**: a swapped piece of chromosome makes a permanently active enzyme, BCR-ABL. **Imatinib**, a small molecule that blocks it, was approved in 2001; most people with this leukaemia now live close to a normal lifespan, taking a daily tablet. Other examples:

| Target | Found in | Kind of drug |
|---|---|---|
| HER2 (too many copies) | about 15–20 % of breast cancers, some stomach cancers | antibodies such as trastuzumab |
| EGFR mutations | a minority of lung adenocarcinomas, more often in never-smokers and in East Asia | tyrosine-kinase inhibitors |
| BRAF V600 mutation | about half of melanomas | BRAF and MEK inhibitors |
| faulty BRCA repair | some ovarian, breast, prostate, pancreatic cancers | PARP inhibitors |
| hormone receptors | most breast and prostate cancers | hormone therapy |

Because they only work when the target is there, these drugs need **biomarker tests** on the biopsy. Their weakness is evolution: after months or years, cells with a new mutation that sidesteps the drug may take over, and the next drug is chosen from a new biopsy or a blood test for tumour DNA.

### Immunotherapy: letting the immune system see
T cells can recognise cancer cells, whose mutated proteins look foreign ([[adaptive-immunity]]). But the immune system has **checkpoints** — brakes such as CTLA-4 and PD-1 that stop attacks on the body's own tissue — and many tumours exploit them. **Checkpoint inhibitors** are antibodies that block these brakes (the discoveries behind them earned James Allison and Tasuku Honjo the 2018 Nobel Prize). In a large trial in advanced melanoma, about half of the people given two checkpoint inhibitors together were alive after five years, and more than four in ten after ten (CheckMate 067). They also help many people with lung, kidney, bladder and head-and-neck cancers, and cancers with faulty mismatch repair.

**CAR-T cell therapy** takes a patient's own T cells, engineers them to recognise a marker on cancer cells, grows them and infuses them back. Since 2017 it has produced lasting remissions in some people with leukaemia, lymphoma and myeloma for whom everything else had failed.

### What the survival curves show
Immunotherapy changes the *shape* of survival curves. Most treatments shift the curve up: in a trial, the **hazard ratio** (HR) compares the risk of dying at any moment on the new treatment with the control, and if the risk is cut by a constant factor, the median survival grows in proportion ($m_1 = m_0/\\text{HR}$). Checkpoint inhibitors often do something else: many people do not benefit, but those who do may stay well for years, so the curve flattens into a **tail** — the long-term responders. The simulation shows both kinds of curve.

### The limits, honestly
- Only a minority of all people with cancer currently benefit from checkpoint inhibitors — one American estimate put it at about one in eight — and researchers cannot yet predict well who will.
- Releasing the brakes can let the immune system attack healthy organs: the bowel (diarrhoea), lungs (cough, breathlessness), liver, skin, and hormone glands such as the thyroid and pituitary. These **immune-related side effects** can start months after treatment and occasionally be severe; most settle with prompt treatment.
- CAR-T therapy can cause a dangerous inflammatory reaction (cytokine release syndrome) and confusion, and is given only in specialist centres.
- The drugs are expensive, which limits access in many countries.

> [!warn] During or after immunotherapy, report new diarrhoea, breathlessness, cough, severe tiredness, yellow skin or eyes, or a bad headache to your cancer team straight away — early treatment of these side effects matters. If you are very unwell, call your local emergency number.

> [!tip] Be wary of clinics selling unproven "immune-boosting" treatments. Real immunotherapies are tested in trials and given by cancer specialists; ask to see the trial evidence.
`,
  ideas: [
    'Targeted drugs block the faulty proteins made by a cancer\'s driver mutations, so they need a biomarker test.',
    'Checkpoint inhibitors release the immune system\'s brakes; CAR-T cells are engineered to recognise the cancer.',
    'Resistance evolves against targeted drugs, as cells that sidestep the target take over.',
    'A hazard ratio below 1 shifts survival; immunotherapy can add a long flat tail of lasting responders.',
    'Immune-related side effects can affect any organ, even months later, and need prompt reporting.'
  ],
  pitfalls: [
    'Immunotherapy works for every cancer — It helps a minority overall; results vary widely between cancer types and patients.',
    'Targeted therapy has no side effects because it only hits cancer — Targets also exist in some normal cells, so rashes, diarrhoea and other effects are common, if usually milder than chemotherapy\'s.',
    '"Immune-boosting" supplements do the same job — Proven immunotherapies act on specific checkpoints or engineered cells; supplements do not, and some interfere with treatment.'
  ],
  formulas: [
    {
      name: 'Median survival and the hazard ratio',
      expr: 'm1 = m0/HR', tex: 'm_1 = \\frac{m_0}{\\text{HR}}',
      vars: {
        m1: { name: 'median survival with the new treatment', q: 'time', unit: 'yr', tex: 'm_1' },
        m0: { name: 'median survival with the standard treatment', q: 'time', unit: 'yr', value: 1, tex: 'm_0' },
        HR: { name: 'hazard ratio (new ÷ standard)', value: 0.7, tex: '\\text{HR}' }
      },
      note: 'Exact when the risk of death is constant over time and the hazard ratio stays the same throughout (proportional hazards) — a useful first approximation.',
      stories: { m1: 'A trial reports a hazard ratio of {HR}; the median survival with standard treatment is {m0}. Roughly what median survival does this suggest with the new treatment?', HR: 'Median survival rose from {m0} to {m1}. What hazard ratio does this correspond to, if the risk is constant?' }
    },
    {
      name: 'Survival with a group of lasting responders',
      expr: 'S = cf + (1 - cf)*2^(-t/m)', tex: 'S = c_f + (1 - c_f)\\, 2^{-t/m}',
      vars: {
        S: { name: 'fraction alive', q: 'ratio', unit: '%', tex: 'S' },
        cf: { name: 'share of long-term responders', q: 'ratio', unit: '%', value: 20, min: 0, max: 100, tex: 'c_f' },
        t: { name: 'time since treatment began', q: 'time', unit: 'yr', value: 5, tex: 't' },
        m: { name: 'median survival of the others', q: 'time', unit: 'yr', value: 1, tex: 'm' }
      },
      note: 'A "cure model": the curve falls towards a plateau at the share of lasting responders instead of towards zero. Illustrative numbers.',
      practice: { unknowns: ['S', 'cf'] },
      stories: { S: 'A treatment gives lasting control in {cf} of patients; the others have a median survival of {m}. What fraction is alive after {t}?' }
    }
  ],
  examples: [
    {
      title: 'What a hazard ratio means for the median',
      q: 'A trial compares a new drug with standard treatment, whose median survival is 12 months. The hazard ratio is 0.7. Estimate the new median, and the gain.',
      steps: [
        'With constant risks, $m_1 = m_0/\\text{HR} = 12/0.7 = 17.1$ months.',
        'The gain is about 5 months at the median — a 30 % lower risk of death at every moment does not mean 30 % of people are cured.',
        'Trials also report survival at fixed times (1 or 2 years), which tells more when curves are not simple.'
      ],
      a: 'About 17 months, a gain of about 5 months.'
    },
    {
      title: 'The tail of the curve',
      q: 'With a checkpoint inhibitor, suppose 20 % of patients have lasting control and the rest have a median survival of 12 months. What fraction is alive at 5 years? Compare with no lasting responders.',
      steps: [
        'Five years is five medians for the others: $2^{-5} = 1/32$.',
        'With responders: $S = 0.2 + 0.8/32 = 0.225$, about 23 %.',
        'Without: $S = 1/32 = 3$ %. The medians differ little; the five-year survival differs sevenfold.'
      ],
      a: 'About 23 % against 3 % — the tail is where immunotherapy makes its mark.'
    }
  ],
  quiz: [
    { q: 'Before a targeted drug for lung cancer is chosen, what is usually needed?', choices: ['a PET scan', 'a test of the tumour for the target mutation', 'a blood count', 'a trial of chemotherapy first'], a: 1,
      why: 'Targeted drugs only work if the tumour carries their target, so the biopsy (or tumour DNA in the blood) is tested first.' },
    { q: 'How do checkpoint inhibitors work?', choices: ['they poison dividing cells', 'they block the brakes that stop T cells from attacking, so the immune system can attack the cancer', 'they carry radiation to the tumour', 'they block hormones'], a: 1,
      why: 'They are antibodies against CTLA-4, PD-1 or PD-L1, releasing a brake that tumours exploit. The same release explains the immune-related side effects.' },
    { q: 'A trial reports a hazard ratio of 0.5 and a standard median survival of 10 months. With constant risks, what is the new median, in months?', answer: 20,
      why: '$m_1 = 10/0.5 = 20$ months: halving the risk at every moment doubles the median.' },
    { q: 'Diarrhoea starting three months after the last dose of a checkpoint inhibitor cannot be related to the treatment.', a: false,
      why: 'Immune-related side effects can appear months after treatment, even after it has stopped. New symptoms should be reported to the cancer team.' },
    { q: 'Why does a targeted drug often stop working after a time?', choices: ['the body gets used to it', 'cells that carry a new mutation bypassing the target survive and take over', 'the drug is broken down faster', 'the immune system removes the drug'], a: 1,
      why: 'Tumours evolve: resistant cells, present in small numbers or newly mutated, are selected by the drug. A new biopsy can show the resistance and guide the next drug.' }
  ],
  applications: ['Biomarker testing of biopsies to choose targeted drugs.', 'Checkpoint inhibitors for advanced melanoma, lung, kidney and bladder cancer.', 'CAR-T cell therapy for blood cancers that have relapsed.', 'Reading survival curves and hazard ratios in trial reports.'],
  history: 'William Coley injected bacteria into tumours in the 1890s, hoping to rouse immunity. Trastuzumab (1998) and imatinib (2001) launched targeted therapy; ipilimumab (2011) and the PD-1 antibodies (2014) launched checkpoint immunotherapy; the first CAR-T therapy was approved in 2017.',
  sim: 'cm-survival'
},

{
  id: 'common-cancers', parent: 'cancer-care', title: 'The common cancers', level: 1,
  short: 'Lung, breast, bowel and prostate cancers make up about four in ten of all cancers worldwide. Each has its own risk factors, warning signs and outlook — and survival depends heavily on how early it is found and where in the world a person lives.',
  keywords: ['common cancers', 'lung cancer', 'breast cancer', 'bowel cancer', 'colorectal cancer', 'prostate cancer', 'stomach cancer', 'liver cancer', 'cervical cancer', 'skin cancer', 'melanoma', 'pancreatic cancer', 'leukaemia', 'warning signs', 'GLOBOCAN'],
  prereq: ['what-is-cancer', 'cancer-screening', 'cancer-staging'],
  related: ['cancer-prevention', 'cancer-treatment', 'immunotherapy', 'smoking', 'alcohol', 'obesity'],
  body: `
Behind every cancer statistic are ordinary moments: a husband who notices his wife's cough has lasted two months, a woman who feels a lump in the shower, a man whose bowel habit has changed and who almost does not mention it. Knowing the common cancers and their signs is not about worrying — it is about knowing when to go and get checked.

### The big four
The International Agency for Research on Cancer estimated for 2022 (GLOBOCAN):

| Cancer | New cases worldwide | Deaths worldwide | Main known causes |
|---|---|---|---|
| Lung | 2.5 million | 1.8 million (the most) | tobacco (most cases), radon, air pollution, workplace exposures |
| Breast | 2.3 million | 0.67 million | female sex and age, inherited variants, hormones, alcohol, excess weight after menopause |
| Colorectal (bowel) | 1.9 million | 0.90 million | age, red and processed meat, alcohol, excess weight, inactivity, inherited syndromes |
| Prostate | 1.5 million | 0.40 million | age, family history, African ancestry |

Together they are about four in ten of all cancers. Then come stomach and liver cancer (both often linked to infections — *H. pylori* and hepatitis B and C — and common in East Asia and Africa), cervical cancer (almost always caused by HPV; still a leading cancer of women in sub-Saharan Africa), thyroid, bladder, oesophageal and pancreatic cancer, the skin cancers (melanoma, and the very common but rarely fatal basal- and squamous-cell cancers), and the blood cancers.

### Signs that deserve a doctor's visit
Most of these symptoms turn out to have harmless causes — but if they persist, get checked, and go back if they do not settle.

- **Breast** (in women and men): a new lump or thickening in the breast or armpit; a change in size or shape; skin dimpling or puckering; a nipple turning inwards, discharge (especially bloody) or a rash on the nipple.
- **Lung**: a cough lasting more than three weeks or a change in a long-standing cough; coughing up blood; breathlessness; chest infections that keep coming back; hoarseness; unexplained weight loss.
- **Bowel**: blood in the stool or from the bottom; a change in bowel habit lasting several weeks; tummy pain or a lump; tiredness from unexplained iron-deficiency anaemia.
- **Prostate**: usually no symptoms early. Passing urine more often, especially at night, or a weak flow is far more often due to benign enlargement of the prostate, but is worth discussing; blood in the urine or semen should be checked.
- **Others**: a mole that changes (asymmetry, irregular border, several colours, growing, bleeding); a mouth ulcer or hoarseness lasting three weeks; difficulty swallowing; persistent indigestion or bloating; bleeding after sex, between periods or after the menopause; a lump in a testicle; blood in the urine; frequent infections, easy bruising or drenching night sweats.

> [!warn] Some signs need urgent help: coughing up or vomiting more than a little blood, black tarry stools with dizziness or fainting, or sudden severe back pain with weakness or numbness in the legs or loss of bladder control. Call your local emergency number.

### Survival: improving, and unequal
Where a cancer is found early and treated well, outlook can be excellent. In the US, five-year relative survival for people diagnosed in 2014–2020 was about 91 % for breast cancer, 97 % for prostate, 65 % for colorectal and 27 % for lung cancer (American Cancer Society, 2025); in England, roughly 86 %, 88 %, 59 % and under a quarter for lung (people diagnosed around 2016–2020). Lung cancer is often found late, which is why screening of heavy smokers is spreading.

The biggest differences are between countries. The WHO's Global Breast Cancer Initiative reported five-year survival above 90 % in high-income countries but about 66 % in India and 40 % in South Africa; for children with cancer, about 80 % survive in high-income countries against fewer than 30 % in many low- and middle-income countries. The gap comes from late diagnosis and lack of access to treatment and pain relief — problems of health systems, not of biology.

> [!note] Survival figures are averages for groups diagnosed years ago, often older and with other illnesses. They cannot tell any one person what will happen. Ask your own team what the numbers mean for you.
`,
  ideas: [
    'Lung, breast, colorectal and prostate cancer make up about four in ten cancers worldwide; lung cancer causes the most deaths.',
    'Each common cancer has known causes; tobacco, infections, alcohol and excess weight are the largest preventable ones.',
    'Persistent, unexplained changes deserve a doctor\'s visit; a few signs need emergency help.',
    'Survival depends on stage at diagnosis and differs hugely between countries.',
    'Survival statistics describe past groups, not an individual\'s future.'
  ],
  pitfalls: [
    'Men cannot get breast cancer — About 1 in 100 breast cancers occurs in men; a lump or nipple change in a man deserves the same check.',
    'Urinary symptoms in older men usually mean prostate cancer — They are far more often due to benign prostate enlargement; early prostate cancer rarely causes symptoms.',
    'Non-smokers do not get lung cancer — Most lung cancers are caused by smoking, but a significant minority occur in people who never smoked (radon, air pollution, genes).'
  ],
  examples: [
    {
      title: 'Share of the total',
      q: 'GLOBOCAN 2022 estimated about 20 million new cancers. Lung (2.5 million), breast (2.3 million), colorectal (1.9 million) and prostate (1.5 million) are the four commonest. What share are they together?',
      steps: [
        'Together: $2.5 + 2.3 + 1.9 + 1.5 = 8.2$ million.',
        'Share: $8.2/20 = 0.41$.',
        'About four in ten — the other six in ten are spread over dozens of cancer types.'
      ],
      a: 'About 41 %.'
    },
    {
      title: 'A symptom and a plan',
      q: 'A 58-year-old has noticed blood mixed in with his stool on and off for three weeks, and has been more tired than usual. What is a sensible response?',
      steps: [
        'Blood in the stool for weeks, with tiredness (possible anaemia), is one of the listed bowel warning signs.',
        'It has common harmless causes (such as haemorrhoids), but at his age it deserves a prompt doctor\'s appointment, not waiting for the next screening invitation.',
        'The doctor may examine him, check a blood count and arrange a stool test or colonoscopy. Heavy bleeding, fainting or black tarry stools would be reasons to call the emergency number instead.'
      ],
      a: 'Book a doctor\'s appointment soon; seek emergency care if bleeding is heavy or he feels faint.'
    }
  ],
  quiz: [
    { q: 'Which cancer causes the most deaths worldwide?', choices: ['breast', 'colorectal', 'lung', 'prostate'], a: 2,
      why: 'Lung cancer causes about 1.8 million deaths a year (2022) — close to one cancer death in five — mainly because of tobacco and late diagnosis.' },
    { q: 'A cough that has lasted a month in a 60-year-old smoker should be…', choices: ['ignored, it is probably a cold', 'shown to a doctor', 'treated with cough mixture only', 'watched for another six months'], a: 1,
      why: 'A cough for more than three weeks, especially in a smoker, is a sign to see a doctor. Most such coughs are not cancer, but this is exactly when a check is worthwhile.' },
    { q: 'Five-year survival from breast cancer is similar in all countries.', a: false,
      why: 'It is above 90 % in high-income countries but far lower where diagnosis is late and treatment hard to get — about 66 % in India and 40 % in South Africa by WHO figures.' },
    { q: 'Which infection causes almost all cervical cancers?', choices: ['hepatitis B', 'human papillomavirus (HPV)', 'H. pylori', 'HIV'], a: 1,
      why: 'Persistent infection with high-risk HPV types causes nearly all cervical cancers — which is why HPV vaccination and HPV screening can prevent most of them.' }
  ],
  applications: ['Recognising the warning signs of the common cancers.', 'Understanding why lung, bowel, breast and cervical cancer have screening programmes.', 'Comparing cancer outcomes between countries.', 'Knowing which signs call for an emergency number.'],
  history: 'Cancer registration began in Hamburg in 1926 and Denmark in 1942; today IARC\'s GLOBOCAN combines registries from around the world into estimates for every country.'
},

{
  id: 'cancer-prevention', parent: 'cancer-care', title: 'Preventing cancer', level: 1,
  short: 'Between a third and a half of cancers could be prevented. Not smoking is by far the biggest single step; limiting alcohol, keeping a healthy weight, being active, protecting skin from the sun and getting vaccinated against HPV and hepatitis B all lower the risk.',
  keywords: ['cancer prevention', 'tobacco', 'smoking', 'alcohol', 'obesity', 'HPV vaccine', 'hepatitis B vaccine', 'sun protection', 'processed meat', 'physical activity', 'radon', 'air pollution', 'attributable fraction', 'relative risk', 'carcinogen', 'IARC'],
  prereq: ['what-is-cancer', 'cancer-genetics', 'risk-communication'],
  related: ['smoking', 'alcohol', 'obesity', 'healthy-diet', 'physical-activity', 'vaccines', 'environmental-health', 'cancer-screening', 'epidemiology'],
  body: `
Ahmed smoked a pack a day for twenty-five years. At 45 he stopped — several attempts, some help from his doctor, one relapse — and his risk of lung cancer began to fall the day he quit. After ten years smoke-free it was roughly half what it would have been had he carried on. His story holds the most important fact in cancer prevention: it is never too late, and the biggest gains are the simplest ones.

### How much is preventable
The World Health Organization estimates that between 30 % and 50 % of cancers could be prevented by avoiding risk factors and using proven measures. The main ones, roughly in order of impact worldwide:

| Factor | What it causes | Notes |
|---|---|---|
| **Tobacco** | lung, mouth, throat, oesophagus, bladder, kidney, pancreas, stomach, cervix and more | roughly a fifth to a quarter of all cancer deaths; most lung cancers |
| **Infections** | cervix and other HPV cancers, liver (hepatitis B and C), stomach (*H. pylori*) | about 13 % of cancers worldwide in 2018; vaccines and treatment prevent many |
| **Alcohol** | mouth, throat, larynx, oesophagus, liver, bowel, breast | about 4 % of new cancers worldwide in 2020; no level is risk-free, and less is better |
| **Excess body weight** | at least 13 cancers, including bowel, womb, kidney, oesophagus, pancreas, liver and breast after menopause | rising as obesity spreads |
| **Ultraviolet light** | melanoma and other skin cancers | sunburn and sunbeds |
| **Diet and inactivity** | bowel and others | processed meat is a known carcinogen, red meat a probable one; activity lowers bowel, breast and womb cancer risk |
| **Air pollution, radon, workplace** | lung, mesothelioma (asbestos), bladder | radon in homes is the leading cause of lung cancer in never-smokers in many countries |

These labels come from IARC, which classifies agents by the **strength of the evidence** that they can cause cancer — not by how much cancer they cause. Processed meat and tobacco are both in Group 1 because the evidence for each is conclusive, but smoking is vastly more dangerous.

### Relative and absolute risk
News reports give **relative** risks: eating 50 g of processed meat a day raises the risk of bowel cancer by about 18 %. What matters to a person is the **absolute** change: if the lifetime risk of bowel cancer is about 5 %, an 18 % rise makes it about 5.9 % — roughly one extra case per 110 people who eat that much for life. For a population, the **attributable fraction** combines how common an exposure is with how strong it is: a rare but strong factor and a common but weak one can matter equally. See [[risk-communication]].

### Vaccines that prevent cancer
- **HPV vaccine**: in a Swedish study of 1.7 million women, those vaccinated before age 17 had about 88 % fewer invasive cervical cancers. It also protects against HPV cancers of the throat, anus and genitals, in all sexes. The WHO aims to eliminate cervical cancer as a public-health problem by combining vaccination, screening and treatment.
- **Hepatitis B vaccine**: where babies have been vaccinated since the 1980s, liver cancer in young people has fallen sharply — the first cancer-preventing vaccine.

### Other measures
Screening that removes precancers (cervical and bowel — [[cancer-screening]]), treating *H. pylori* and hepatitis C, testing homes for radon, protecting workers from asbestos and other carcinogens, and, for people with high-risk inherited variants, medicines or surgery that reduce risk, discussed with a specialist ([[cancer-genetics]]).

> [!tip] If you smoke, stopping is the single most powerful thing you can do for your health, at any age. Stop-smoking services, nicotine replacement and certain medicines roughly double or triple the chance of success compared with willpower alone — ask a doctor or pharmacist. See [[smoking]].

> [!note] Prevention lowers risk; it does not make anyone immune. People who did everything right still get cancer, often through the chance copying errors of dividing cells. A cancer diagnosis is never a verdict on how someone lived.
`,
  ideas: [
    'Between 30 % and 50 % of cancers are preventable; tobacco is by far the largest single cause.',
    'Infections cause about one cancer in eight worldwide, and vaccines against HPV and hepatitis B prevent many.',
    'IARC groups describe the certainty that something can cause cancer, not how much cancer it causes.',
    'Relative risks need a baseline: an 18 % rise on a 5 % risk is under one percentage point.',
    'Quitting smoking lowers risk at any age; prevention lowers risk but cannot guarantee anything.'
  ],
  pitfalls: [
    'Processed meat is as dangerous as smoking because both are in IARC Group 1 — The group reflects the strength of the evidence, not the size of the risk. Smoking multiplies lung cancer risk many times; processed meat raises bowel cancer risk modestly.',
    'After decades of smoking, quitting makes no difference — Risk starts falling after quitting and keeps falling; people who stop in middle age avoid most of the excess risk of continuing.',
    'People who get cancer must have done something to cause it — Much cancer comes from chance mutations and unavoidable factors; prevention shifts the odds, not the certainty.'
  ],
  formulas: [
    {
      name: 'Population attributable fraction',
      expr: 'PAF = pe*(RR - 1)/(1 + pe*(RR - 1))', tex: '\\text{PAF} = \\frac{p_e(\\text{RR} - 1)}{1 + p_e(\\text{RR} - 1)}',
      vars: {
        PAF: { name: 'share of cases due to the exposure', q: 'ratio', unit: '%', tex: '\\text{PAF}' },
        pe: { name: 'share of people exposed', q: 'ratio', unit: '%', value: 20, min: 0, max: 100, tex: 'p_e' },
        RR: { name: 'relative risk in the exposed', value: 20, tex: '\\text{RR}' }
      },
      note: 'Levin\'s formula: the share of cases that would not occur if the exposure were removed, assuming the relative risk is causal and not confounded.',
      practice: { unknowns: ['PAF', 'pe'] },
      stories: { PAF: 'In a country, {pe} of adults smoke, and smokers have {RR} times the lung-cancer risk of non-smokers. What share of lung cancers is due to smoking?', pe: 'An exposure with relative risk {RR} accounts for {PAF} of cases. What share of people must be exposed?' }
    },
    {
      name: 'From relative to absolute risk',
      expr: 'Re = R0*RR', tex: 'R_e = R_0 \\times \\text{RR}',
      vars: {
        Re: { name: 'risk with the exposure', q: 'ratio', unit: '%', tex: 'R_e' },
        R0: { name: 'baseline risk', q: 'ratio', unit: '%', value: 5, min: 0, max: 100, tex: 'R_0' },
        RR: { name: 'relative risk', value: 1.18, tex: '\\text{RR}' }
      },
      note: 'A relative risk only becomes meaningful when multiplied by a baseline. Valid for modest risks (the result must stay well below 100 %).',
      stories: { Re: 'The lifetime risk of a cancer is {R0}. An exposure raises it by a relative risk of {RR}. What is the risk with the exposure?' }
    }
  ],
  examples: [
    {
      title: 'How much lung cancer is due to smoking?',
      q: 'In a country, 20 % of adults smoke, and smokers have about 20 times the lung-cancer risk of never-smokers. What share of lung cancers does smoking cause?',
      steps: [
        '$p_e(\\text{RR} - 1) = 0.2 \\times 19 = 3.8$.',
        '$\\text{PAF} = 3.8/(1 + 3.8) = 0.79$.',
        'About four in five lung cancers — even though only one adult in five smokes. (Former smokers add more in reality.)'
      ],
      a: 'About 79 %.'
    },
    {
      title: 'A headline about bacon',
      q: 'A headline says processed meat "raises bowel cancer risk by 18 %". If your lifetime risk is about 5 %, what does daily processed meat do to it? How many people would need to eat it daily for one extra case?',
      steps: [
        'Absolute risk with the exposure: $5\\% \\times 1.18 = 5.9\\%$.',
        'Increase: $0.9$ percentage points.',
        'One extra case for about $1/0.009 = 111$ people eating it daily for life.'
      ],
      a: 'From about 5 % to 5.9 %: roughly one extra case per 110 lifelong daily eaters.'
    }
  ],
  quiz: [
    { q: 'Which single measure prevents the most cancer deaths worldwide?', choices: ['avoiding processed meat', 'not smoking', 'avoiding mobile phones', 'taking vitamin supplements'], a: 1,
      why: 'Tobacco causes roughly a fifth to a quarter of all cancer deaths. Mobile phones have not been shown to cause cancer, and supplements do not prevent it in well-nourished people.' },
    { q: 'IARC puts both tobacco smoke and processed meat in Group 1. This means…', choices: ['they are equally dangerous', 'the evidence that each can cause cancer is conclusive', 'each causes the same number of cancers', 'any amount of either will cause cancer'], a: 1,
      why: 'IARC groups grade the certainty of the evidence, not the size of the risk, which is far greater for tobacco.' },
    { q: 'An exposure affects 50 % of people with a relative risk of 1.2. What share of cases does it cause (PAF, in %)?', answer: 9.1, unit: '%',
      why: '$0.5 \\times 0.2 = 0.1$; $0.1/1.1 = 0.091$, about 9 %. A weak but common factor can matter for a population.' },
    { q: 'The HPV vaccine only benefits women.', a: false,
      why: 'HPV also causes cancers of the throat, anus and penis, and vaccinating all sexes reduces spread; many countries now vaccinate boys and girls.' },
    { q: 'Someone who stops smoking at 50 gains little, because the damage is done.', a: false,
      why: 'Risk falls steadily after quitting; stopping in middle age avoids most of the excess risk of continuing, and brings other benefits within weeks.' }
  ],
  applications: ['HPV and hepatitis B vaccination programmes.', 'Stop-smoking services and tobacco control laws.', 'Reading relative risks in health news as absolute changes.', 'Radon testing of homes and protection of workers from carcinogens.'],
  history: 'Percivall Pott linked soot to scrotal cancer in chimney sweeps in 1775 — the first occupational cancer. Richard Doll and Austin Bradford Hill\'s studies of smoking and lung cancer (1950 onwards) founded modern cancer epidemiology.',
  sim: { id: 'cm-multihit', params: { rate: 1.3 } }
}

);
