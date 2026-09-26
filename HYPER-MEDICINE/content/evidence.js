/* HYPER-MEDICINE · content/evidence.js — Diagnosis and Evidence: evidence and uncertainty.
 * Sensitivity and specificity, probability after a test, screening, evidence-based medicine,
 * relative and absolute risk, and reading health news. Simulations in sims/diagnosis.js. */
Hyper.add(

{
  id: 'diagnostic-accuracy', parent: 'evidence', title: 'Sensitivity and specificity', level: 2,
  short: 'The two numbers that describe how good a test is: sensitivity, the share of sick people it catches, and specificity, the share of healthy people it correctly clears. Moving the cut-off trades one against the other; likelihood ratios combine them into how far a result should change your mind.',
  keywords: ['sensitivity', 'specificity', 'false positive', 'false negative', 'true positive', '2x2 table', 'likelihood ratio', 'ROC curve', 'area under the curve', 'AUC', 'cut-off', 'threshold', 'SnNout', 'SpPin', 'diagnostic accuracy', 'reference standard', 'spectrum bias'],
  prereq: ['lab-tests', 'math:conditional-probability', 'math:percentages'],
  related: ['bayes-diagnosis', 'screening-harms', 'cancer-screening', 'history-examination', 'math:normal-distribution'],
  body: `
During the COVID-19 pandemic, millions of people learned that a rapid antigen test and a laboratory PCR test could disagree. The rapid test missed some infections that PCR found — but when it said "positive", it was almost always right. Those two facts are the test's **sensitivity** and **specificity**, and every test has them: a blood marker, a scan, even a question in the history.

### The 2 × 2 table
Test a group of people whose true state is known from a trusted **reference standard** (a biopsy, careful follow-up, the best test available). Each person lands in one of four boxes:

| | Has the disease | Does not have it |
|---|---|---|
| Test positive | true positive (TP) | false positive (FP) |
| Test negative | false negative (FN) | true negative (TN) |

$$\\text{sensitivity} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}, \\qquad \\text{specificity} = \\frac{\\text{TN}}{\\text{TN} + \\text{FP}}$$

Sensitivity is read down the first column: of the people who have the disease, what share test positive? Specificity is read down the second: of those who do not, what share test negative? Neither answers the question a patient asks — "I tested positive: do I have it?" That also needs to know how common the disease is ([[bayes-diagnosis]]).

Two memory aids: when a highly **s**e**n**sitive test is **n**egative, it rules the disease **out** (SnNout); when a highly **sp**ecific test is **p**ositive, it rules it **in** (SpPin). Both work only when the number is really high — 95–99 % or more.

### Where to draw the line
Most tests give a number, and someone has to choose the cut-off. Healthy and sick people overlap: some healthy people have high values, some sick people low ones. Lower the cut-off and you catch more of the sick (sensitivity rises) but flag more of the healthy (specificity falls); raise it and the reverse happens. Plotting sensitivity against the false-positive rate (1 − specificity) for every possible cut-off gives the **ROC curve**. A useless test follows the diagonal; a perfect one hugs the top-left corner. The **area under the curve** (AUC) — the chance that a randomly chosen sick person scores higher than a randomly chosen healthy one — runs from 0.5 (a coin toss) to 1 (perfect).

The right cut-off depends on the cost of each mistake. Where missing the disease is disastrous and treatment works — a clot in the lung, sepsis — a sensitive test comes first, to rule out. Where a false positive leads to surgery or a life-changing label, specificity matters more, and a positive screening result is confirmed by a second, more specific test.

### Likelihood ratios: one number per result
Sensitivity and specificity combine into how strongly each result points:

$$\\text{LR}^{+} = \\frac{\\text{sensitivity}}{1 - \\text{specificity}}, \\qquad \\text{LR}^{-} = \\frac{1 - \\text{sensitivity}}{\\text{specificity}}$$

A positive result multiplies the odds of disease by LR⁺, a negative one by LR⁻. As a rough guide, LR⁺ above 10 or LR⁻ below 0.1 change the picture a lot; between 0.5 and 2 they barely move it. A test with sensitivity 90 % and specificity 95 % has LR⁺ = 18 and LR⁻ ≈ 0.11.

### Real tests, real numbers
| Test | Sensitivity | Specificity | Source |
|---|---|---|---|
| Rapid antigen test for COVID-19, people with symptoms | about 73 % | above 99 % | Cochrane review, 2022 |
| The same, people without symptoms | about 55 % | above 99 % | Cochrane review, 2022 |
| Digital screening mammography, US | about 87 % | about 89 % | Breast Cancer Surveillance Consortium, 2017 |

The same test performs differently in different people. Antigen tests catch more infections when the viral load is high, early in a symptomatic illness. Studies that compare obviously sick patients with healthy volunteers make tests look better than they are in real practice, where the difficult, borderline cases are — a trap called **spectrum bias**. And a test on paper assumes it was done properly: a swab that barely touches the nose, or a sample taken too early, lowers the real sensitivity.

"Accuracy" — the share of all results that are right — is a poor summary: for a disease that 1 % of people have, a "test" that calls everyone healthy is 99 % accurate, and useless.

### What it means for you
When you hear that a test is "95 % accurate", ask: 95 % of what? How many people with the condition does it miss, and how many false alarms does it raise? A negative result from a test with modest sensitivity does not clear you if you have symptoms; a positive screening result is a reason for a follow-up test, not a diagnosis. The [test-result calculator](#/tools/clinical/test) shows what the numbers mean for 1 000 people.
`,
  ideas: [
    'Sensitivity is the share of people with the disease who test positive; specificity the share without it who test negative.',
    'Moving a cut-off trades sensitivity against specificity; the ROC curve shows every possible trade, and its area summarises the test.',
    'Likelihood ratios say how far a positive or a negative result should shift the odds of disease.',
    'A negative result from a very sensitive test rules out; a positive result from a very specific test rules in.',
    'Neither number says directly what your result means: that also depends on how common the disease is.'
  ],
  pitfalls: [
    'Sensitivity is the chance that a positive result is right — That is the positive predictive value, which also depends on how common the disease is; sensitivity is the share of sick people who test positive.',
    'A test has one fixed sensitivity and specificity — Both depend on the cut-off and on who is tested; tests look better in studies of obviously sick versus healthy people (spectrum bias).',
    'High accuracy means a good test — For a rare disease, a test that calls everyone negative is highly "accurate" and completely useless.'
  ],
  formulas: [
    {
      name: 'Sensitivity',
      expr: 'Se = TP/(TP + FN)', tex: '\\text{Se} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}',
      vars: {
        Se: { name: 'sensitivity', q: 'ratio', unit: '%', tex: '\\text{Se}' },
        TP: { name: 'true positives (sick, test positive)', q: 'count', value: 90, tex: '\\text{TP}' },
        FN: { name: 'false negatives (sick, test negative)', q: 'count', value: 10, tex: '\\text{FN}' }
      },
      note: 'Only people who really have the disease enter this fraction.',
      practice: { unknowns: ['Se', 'FN'] },
      stories: { Se: 'Of the sick people in a study, {TP} tested positive and {FN} tested negative. What is the sensitivity?', FN: 'A test with sensitivity {Se} finds {TP} of the sick people in a study. How many did it miss?' }
    },
    {
      name: 'Specificity',
      expr: 'Sp = TN/(TN + FP)', tex: '\\text{Sp} = \\frac{\\text{TN}}{\\text{TN} + \\text{FP}}',
      vars: {
        Sp: { name: 'specificity', q: 'ratio', unit: '%', tex: '\\text{Sp}' },
        TN: { name: 'true negatives (healthy, test negative)', q: 'count', value: 855, tex: '\\text{TN}' },
        FP: { name: 'false positives (healthy, test positive)', q: 'count', value: 45, tex: '\\text{FP}' }
      },
      note: 'Only people without the disease enter this fraction; 1 − specificity is the false-positive rate.',
      practice: { unknowns: ['Sp', 'FP'] },
      stories: { Sp: 'Of the healthy people in a study, {TN} tested negative and {FP} tested positive. What is the specificity?', FP: 'A test with specificity {Sp} clears {TN} healthy people. How many false alarms did it raise?' }
    },
    {
      name: 'Likelihood ratio of a positive result',
      expr: 'LRp = Se/(1 - Sp)', tex: '\\text{LR}^{+} = \\frac{\\text{Se}}{1 - \\text{Sp}}',
      vars: {
        LRp: { name: 'likelihood ratio of a positive result', tex: '\\text{LR}^{+}' },
        Se: { name: 'sensitivity', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: '\\text{Se}' },
        Sp: { name: 'specificity', q: 'ratio', unit: '%', value: 95, min: 0, max: 99.99, tex: '\\text{Sp}' }
      },
      note: 'How many times more often a positive result occurs in people with the disease than in people without it.',
      stories: { LRp: 'A test has sensitivity {Se} and specificity {Sp}. By what factor does a positive result multiply the odds of disease?' }
    },
    {
      name: 'Likelihood ratio of a negative result',
      expr: 'LRn = (1 - Se)/Sp', tex: '\\text{LR}^{-} = \\frac{1 - \\text{Se}}{\\text{Sp}}',
      vars: {
        LRn: { name: 'likelihood ratio of a negative result', tex: '\\text{LR}^{-}' },
        Se: { name: 'sensitivity', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: '\\text{Se}' },
        Sp: { name: 'specificity', q: 'ratio', unit: '%', value: 95, min: 0.01, max: 100, tex: '\\text{Sp}' }
      },
      note: 'Below 1: a negative result lowers the odds. A value of 0.1 cuts them tenfold.',
      stories: { LRn: 'A test has sensitivity {Se} and specificity {Sp}. By what factor does a negative result multiply the odds of disease?' }
    }
  ],
  examples: [
    {
      title: 'Reading a 2 × 2 table',
      q: 'In a study, 200 people with a disease and 800 without it are tested. The test is positive in 170 of the sick and in 40 of the healthy. Find the sensitivity, the specificity and both likelihood ratios.',
      steps: [
        'Sensitivity: $170/200 = 0.85$.',
        'Specificity: $(800 - 40)/800 = 760/800 = 0.95$.',
        '$\\text{LR}^{+} = 0.85/(1 - 0.95) = 17$.',
        '$\\text{LR}^{-} = (1 - 0.85)/0.95 = 0.16$.'
      ],
      a: 'Sensitivity 85 %, specificity 95 %, LR⁺ 17, LR⁻ 0.16: a positive result is strong evidence; a negative one helps, but does not rule the disease out.'
    },
    {
      title: 'The test that is 99.9 % accurate',
      q: 'A disease affects 1 person in 1 000. A "test" simply declares everyone negative. What are its accuracy, sensitivity and specificity?',
      steps: [
        'Of 1 000 people it is right about the 999 healthy ones: accuracy 99.9 %.',
        'It finds none of the sick: sensitivity 0 %.',
        'It clears every healthy person: specificity 100 %.'
      ],
      a: 'Accuracy 99.9 %, sensitivity 0 %, specificity 100 % — which is why accuracy alone says little about a test.'
    }
  ],
  quiz: [
    { q: 'A test\'s sensitivity is 95 %. This means…', choices: ['95 % of positive results are correct', '95 % of people with the disease test positive', '95 % of healthy people test negative', 'the test is right 95 % of the time'], a: 1,
      why: 'Sensitivity is conditional on having the disease. The share of positive results that are correct is the positive predictive value, which also depends on prevalence.' },
    { q: 'A test has sensitivity 80 % and specificity 90 %. What is the likelihood ratio of a positive result?', answer: 8,
      why: 'LR⁺ = 0.80 / (1 − 0.90) = 8: a positive result multiplies the odds of disease by 8.' },
    { q: 'Lowering the cut-off of a blood test, so that more values count as positive, usually…', choices: ['raises sensitivity and lowers specificity', 'raises both', 'lowers sensitivity and raises specificity', 'changes neither'], a: 0,
      why: 'More sick people exceed the lower cut-off (more caught), but so do more healthy people (more false alarms).' },
    { q: 'A test whose ROC curve has an area of 0.5 is no better than tossing a coin.', a: true,
      why: 'An area of 0.5 means a random sick person scores higher than a random healthy person only half the time: the ROC curve is the diagonal.' },
    { q: 'Which result is most useful for ruling a disease OUT?', choices: ['A negative result from a highly sensitive test', 'A negative result from a highly specific test', 'A positive result from a highly sensitive test', 'Any result from a test with high accuracy'], a: 0,
      why: 'A very sensitive test rarely misses the disease, so a negative result makes the disease unlikely (SnNout).' }
  ],
  applications: [
    'Choosing and reading screening and diagnostic tests.',
    'Setting cut-offs for blood markers such as troponin (heart damage) or D-dimer (clots).',
    'Evaluating artificial-intelligence tools for reading scans, with ROC curves and AUC.',
    'Public-health decisions on which test to use for mass testing and which to confirm with.'
  ],
  sim: 'dx-threshold'
},

{
  id: 'bayes-diagnosis', parent: 'evidence', title: 'Probability after a test result', level: 2,
  short: 'What a positive or negative result really means: the chance of disease afterwards depends on how likely it was beforehand as well as on the test. For a rare disease even a good test produces mostly false alarms; in a person with typical symptoms the same result is usually right.',
  keywords: ['positive predictive value', 'negative predictive value', 'PPV', 'NPV', 'Bayes theorem', 'pre-test probability', 'post-test probability', 'prevalence', 'base rate', 'false positive', 'natural frequencies', 'odds', 'likelihood ratio', 'Fagan nomogram', 'base-rate neglect'],
  prereq: ['diagnostic-accuracy', 'math:bayes-theorem'],
  related: ['screening-harms', 'history-examination', 'cancer-screening', 'risk-communication', 'math:conditional-probability'],
  body: `
A 45-year-old woman has her first screening mammogram, and a week later is called back: the result is positive. She asks what every patient asks — how likely is it that I have cancer? Suppose, in round numbers, that 1 % of women of her age who are screened have breast cancer, that the test finds 90 % of cancers, and that it wrongly flags 9 % of women without cancer. In surveys, many people — including many doctors — answer about 90 %. The right answer is about 9 %.

### Count people, not percentages
Imagine 1 000 women like her:

- about 10 have cancer, and the test finds 9 of them;
- 990 do not, and 9 % of them — about 89 — are flagged anyway.

So 98 women are called back, and only 9 of them have cancer: about 9 %. Most positives are false alarms, not because the test is bad but because the healthy vastly outnumber the sick, and a small error rate in a large group outweighs a high hit rate in a small one. Thinking in these **natural frequencies** — counts of people — makes such problems easy, and the [test-result calculator](#/tools/clinical/test) draws the 1 000 people for any numbers you choose.

The formal version is [[math:bayes-theorem|Bayes' theorem]]. With a pre-test probability (here the prevalence) $p$:

$$\\text{PPV} = \\frac{\\text{Se}\\cdot p}{\\text{Se}\\cdot p + (1 - \\text{Sp})(1 - p)}, \\qquad \\text{NPV} = \\frac{\\text{Sp}\\,(1 - p)}{\\text{Sp}\\,(1 - p) + (1 - \\text{Se})\\,p}$$

The positive predictive value (PPV) is the chance that a positive result is right; the negative predictive value (NPV) the chance that a negative one is.

### The same test, a different person
Now the same test in a woman who has found a hard, irregular lump — say 30 % of such women turn out to have cancer. Of 1 000 women, 300 have cancer (270 test positive) and 700 do not (63 false positives): 270 of 333 positives are right, 81 %. Nothing about the test changed; the **pre-test probability** did. It comes from how common the disease is in people like this one, adjusted by their story, examination and earlier results ([[history-examination]]). This is why doctors test people who have a reason to be tested, and why screening healthy people for uncommon diseases produces so many false alarms ([[screening-harms]]).

### Odds and likelihood ratios
The quickest update uses odds (probability ÷ its complement) and the test's [[diagnostic-accuracy|likelihood ratio]]:

$$\\text{post-test odds} = \\text{pre-test odds} \\times \\text{LR}$$

For the woman with the lump, the pre-test odds are 0.3/0.7 ≈ 0.43, a positive result's LR is 0.9/0.09 = 10, so the post-test odds are 4.3 — a probability of 4.3/5.3 ≈ 81 %, the same answer with less arithmetic. A negative result (LR⁻ ≈ 0.11) would lower her probability to about 4.5 %: much reduced, but not zero, so a lump like that is still investigated. The Fagan nomogram in the simulation does this with a ruler.

A second, independent test starts from the first one's post-test probability. That is how a positive screening test followed by a more specific confirmatory test reaches near certainty, as in HIV testing — provided the two tests do not share the same sources of error.

### Traps
- **Base-rate neglect**: judging a result by the test's accuracy alone, forgetting how rare the disease is.
- **Swapping the conditionals**: "90 % of women with cancer test positive" is not "90 % of women who test positive have cancer". In a courtroom the same slip is called the prosecutor's fallacy.
- **Over-trusting a negative**: for a rare disease a negative result is very reassuring (NPV 99.9 % in the mammogram example), but when the pre-test probability is high, a negative result from an imperfect test can leave a real chance of disease.

### What it means for you
Faced with a surprising result, three questions help: how common is this condition in people like me? How often does this test flag people who do not have it? What is the next step to confirm it? A positive screening result usually means "more tests", not "diagnosis"; a negative result is most reassuring when there was little reason to suspect the disease in the first place.
`,
  ideas: [
    'After a test, the chance of disease depends on the pre-test probability as well as on the test.',
    'Counting 1 000 imaginary people (natural frequencies) makes the answer plain.',
    'For a rare disease most positive results are false alarms, even from a good test.',
    'Post-test odds = pre-test odds × likelihood ratio; a second, independent test starts from there.',
    'A negative result is most reassuring when the disease was unlikely to begin with.'
  ],
  pitfalls: [
    'A test that finds 90 % of cases gives a 90 % chance of disease when positive — That confuses P(positive | disease) with P(disease | positive); for a rare disease most positives are false.',
    'A negative result always rules the disease out — Only when the pre-test probability was low or the test very sensitive; with strong symptoms an imperfect negative test can leave a sizeable chance.',
    'Two positive tests prove it — Only if their errors are independent; repeating the same test on the same sample can repeat the same error.'
  ],
  formulas: [
    {
      name: 'Positive predictive value',
      expr: 'PPV = Se*p/(Se*p + (1 - Sp)*(1 - p))', tex: '\\text{PPV} = \\frac{\\text{Se}\\,p}{\\text{Se}\\,p + (1 - \\text{Sp})(1 - p)}',
      vars: {
        PPV: { name: 'chance that a positive result is right', q: 'ratio', unit: '%', tex: '\\text{PPV}' },
        Se: { name: 'sensitivity', q: 'ratio', unit: '%', value: 90, min: 0.01, max: 100, tex: '\\text{Se}' },
        Sp: { name: 'specificity', q: 'ratio', unit: '%', value: 91, min: 0, max: 99.99, tex: '\\text{Sp}' },
        p: { name: 'pre-test probability (prevalence)', q: 'ratio', unit: '%', value: 1, min: 0.001, max: 99.99 }
      },
      note: 'Bayes\' theorem for a positive result. With a rare disease, specificity dominates: each point of specificity lost adds false positives from the large healthy group.',
      practice: { unknowns: ['PPV', 'p'] },
      stories: { PPV: 'A screening test with sensitivity {Se} and specificity {Sp} is positive in a person from a group where {p} have the disease. How likely is it that they have it?', p: 'A test with sensitivity {Se} and specificity {Sp} has a positive predictive value of {PPV}. How common is the disease among the people tested?' }
    },
    {
      name: 'Negative predictive value',
      expr: 'NPV = Sp*(1 - p)/(Sp*(1 - p) + (1 - Se)*p)', tex: '\\text{NPV} = \\frac{\\text{Sp}\\,(1 - p)}{\\text{Sp}\\,(1 - p) + (1 - \\text{Se})\\,p}',
      vars: {
        NPV: { name: 'chance that a negative result is right', q: 'ratio', unit: '%', tex: '\\text{NPV}' },
        Se: { name: 'sensitivity', q: 'ratio', unit: '%', value: 73, min: 0, max: 99.99, tex: '\\text{Se}' },
        Sp: { name: 'specificity', q: 'ratio', unit: '%', value: 99.6, min: 0.01, max: 100, tex: '\\text{Sp}' },
        p: { name: 'pre-test probability', q: 'ratio', unit: '%', value: 50, min: 0.001, max: 99.99 }
      },
      note: 'High for rare diseases almost regardless of the test; it falls as the pre-test probability rises.',
      practice: { unknowns: ['NPV', 'p'] },
      stories: { NPV: 'A rapid test with sensitivity {Se} and specificity {Sp} is negative in someone with a {p} chance of infection beforehand. How likely is it that they are really free of it?' }
    },
    {
      name: 'Probability after a result',
      expr: 'P2 = P1*LR/(1 - P1 + P1*LR)', tex: 'p_{\\text{after}} = \\frac{p_{\\text{before}}\\,\\text{LR}}{1 - p_{\\text{before}} + p_{\\text{before}}\\,\\text{LR}}',
      vars: {
        P2: { name: 'probability after the result', q: 'ratio', unit: '%', tex: 'p_{\\text{after}}' },
        P1: { name: 'probability before the result', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'p_{\\text{before}}' },
        LR: { name: 'likelihood ratio of the result', value: 10, min: 0, tex: '\\text{LR}' }
      },
      note: 'The odds form, post-test odds = pre-test odds × LR, written with probabilities. Use LR⁺ for a positive result and LR⁻ for a negative one.',
      stories: { P2: 'Before the test the probability of disease is {P1}. The result has a likelihood ratio of {LR}. What is the probability now?', P1: 'After a result with likelihood ratio {LR} the probability of disease is {P2}. What was it before?' }
    }
  ],
  examples: [
    {
      title: 'A screening mammogram in 1 000 women',
      q: 'Prevalence 1 %, sensitivity 90 %, false-positive rate 9 % (specificity 91 %). A woman\'s result is positive. What is the chance she has breast cancer?',
      steps: [
        'Of 1 000 women, 10 have cancer; $0.9 \\times 10 = 9$ test positive.',
        '990 do not; $0.09 \\times 990 = 89$ test positive anyway.',
        { text: 'Positive predictive value:', tex: '\\frac{9}{9 + 89} = 0.092' }
      ],
      a: 'About 9 %: roughly one positive in eleven is a cancer; the rest are false alarms resolved by further tests.'
    },
    {
      title: 'The same test after finding a lump',
      q: 'The same test (LR⁺ = 0.9/0.09 = 10, LR⁻ = 0.1/0.91 ≈ 0.11) is used in a woman with a lump, where the pre-test probability is 30 %. What is the probability after a positive, and after a negative result?',
      steps: [
        'Pre-test odds: $0.3/0.7 = 0.429$.',
        'Positive: $0.429 \\times 10 = 4.29$, probability $4.29/5.29 = 0.81$.',
        'Negative: $0.429 \\times 0.11 = 0.047$, probability $0.047/1.047 = 0.045$.'
      ],
      a: 'About 81 % after a positive result and 4.5 % after a negative one — the same test, a very different meaning.'
    },
    {
      title: 'A negative rapid test with symptoms',
      q: 'A person whose partner has confirmed COVID-19 now has typical symptoms: say a 50 % chance of infection. A rapid antigen test (sensitivity 73 %, specificity 99.6 %) is negative. How likely are they to be infected?',
      steps: [
        '$\\text{LR}^{-} = (1 - 0.73)/0.996 = 0.271$.',
        'Pre-test odds 1; post-test odds $1 \\times 0.271 = 0.271$.',
        'Probability: $0.271/1.271 = 0.21$.'
      ],
      a: 'About 21 % — one in five. The negative result lowers the chance but does not rule infection out; repeating the test over the next days is the usual advice.'
    }
  ],
  quiz: [
    { q: 'A disease affects 1 in 1 000 people. A test with sensitivity 100 % and specificity 99 % is positive. What is the chance of disease?', answer: 9.1, unit: '%',
      why: 'Of 1 000 people: 1 true positive and about 10 false positives (1 % of 999). 1 / 11 ≈ 9 %.' },
    { q: 'For a rare disease, which improvement raises the positive predictive value most?', choices: ['Higher sensitivity', 'Higher specificity', 'Testing more people', 'Reading the result twice'], a: 1,
      why: 'False positives come from the huge healthy group; cutting the false-positive rate (raising specificity) removes most of them.' },
    { q: 'The same test is used in a general-practice clinic and in a specialist clinic where the disease is ten times commoner. The positive predictive value is…', choices: ['the same in both, because the test is the same', 'higher in the specialist clinic', 'higher in general practice', 'impossible to compare'], a: 1,
      why: 'A higher pre-test probability means more true positives for the same number of false positives.' },
    { q: '"95 % of people with the disease test positive" means the same as "95 % of people who test positive have the disease".', a: false,
      why: 'The first is sensitivity, P(positive | disease); the second is the positive predictive value, P(disease | positive). They differ whenever the disease is not common.' },
    { q: 'The pre-test probability is 20 % and the result has a likelihood ratio of 4. What is the probability afterwards?', answer: 50, unit: '%',
      why: 'Odds 0.2/0.8 = 0.25; × 4 = 1; probability 1/(1 + 1) = 50 %.' }
  ],
  applications: [
    'Understanding a positive screening result before the follow-up test.',
    'Deciding whether a test is worth doing at all: if no result would change the decision, it is not.',
    'Confirmatory testing in HIV, hepatitis and newborn screening programmes.',
    'Interpreting evidence in court, where the same reasoning avoids the prosecutor\'s fallacy.'
  ],
  history: 'Thomas Bayes\'s theorem was published after his death, in 1763. Its use in diagnosis was made popular in the 1950s–70s, and the Fagan nomogram, a ruler for the odds calculation, appeared in 1975. Research by Gerd Gigerenzer and others from the 1990s showed that doctors and patients reason far better with natural frequencies than with percentages.',
  sim: 'dx-fagan'
},

{
  id: 'screening-harms', parent: 'evidence', title: 'Screening: benefits and harms', level: 2,
  short: 'Screening tests healthy people to find disease early. It can save lives — cervical and bowel screening clearly do — but it also causes false alarms, finds harmless disease that would never have caused trouble, and makes survival statistics look better than they are. Only death rates in randomised trials tell benefit from illusion.',
  keywords: ['screening', 'early detection', 'lead-time bias', 'length bias', 'overdiagnosis', 'overtreatment', 'false positive', 'recall', 'number needed to screen', 'mammography', 'PSA', 'bowel screening', 'cervical screening', 'Wilson and Jungner', 'survival rate', 'mortality'],
  prereq: ['bayes-diagnosis', 'risk-communication'],
  related: ['cancer-screening', 'diagnostic-accuracy', 'evidence-based-medicine', 'common-cancers', 'tumour-growth', 'medical-imaging'],
  body: `
"Early detection saves lives" sounds self-evident: find a cancer while it is small and it can be cured. For some screening programmes it is true. But screening is not like testing someone with symptoms. It offers a test to large numbers of healthy people, most of whom will never get the disease, and that changes the arithmetic of benefit and harm.

### What screening needs to work
Principles published by the WHO in 1968 (Wilson and Jungner) still guide these decisions: the condition should be an important health problem with a detectable early stage; there should be an acceptable test and a treatment that works better when started early; and the benefits should outweigh the harms and costs. Cervical screening fits well — it finds precancerous changes that can be removed before they ever become cancer, and it has greatly reduced cervical cancer deaths wherever it is well organised. Bowel screening by stool tests or colonoscopy also finds and removes precancerous polyps, and randomised trials of stool-test screening have shown fewer deaths from bowel cancer.

### Three illusions
**Lead time.** Suppose a cancer would cause symptoms at 67 and death at 70, whatever is done. Found by screening at 63, the person now "survives" seven years after diagnosis instead of three — and dies on the same day. Survival measured from diagnosis always improves when diagnosis moves earlier, even if nothing else changes.

**Length bias.** A screening test catches whatever is sitting in the detectable window. Slow-growing tumours sit there for years; aggressive ones pass through in months, often between screens. Screen-detected cancers are therefore, on average, the gentler ones, and their better outcomes partly reflect which cancers were picked up, not what was done.

**Overdiagnosis.** Some screen-detected cancers would never have caused symptoms in the person's lifetime: they grow too slowly, or stop, or the person dies of something else first. Each still becomes a diagnosis, usually with treatment — surgery, radiotherapy, sometimes years of medication — that can only harm, because there was nothing to save. Nobody can know that their own cancer was the harmless kind; overdiagnosis shows up only as extra diagnoses in screened populations.

Because of these effects, **survival rates cannot show that screening works**. What can is the **death rate from the disease** — better still, from all causes — in a population randomly assigned to be offered screening or not.

### Harms that are certain
- **False positives**: most recalls are false alarms. Someone screened every year for ten years with a test of 90 % specificity has about a 65 % chance of at least one, with the anxiety and further tests that follow.
- **Overdiagnosis and overtreatment**, as above.
- **Harms of the follow-up**: biopsies, rare bleeding or perforation from colonoscopy, radiation from repeated imaging.
- **False reassurance**: a normal result can delay attention to later symptoms.

### Some numbers
An independent UK panel (2012) estimated that for every 10 000 women aged 50 invited to breast screening for 20 years, about 43 deaths from breast cancer would be prevented and about 129 women overdiagnosed — roughly three overdiagnosed for each death prevented, with wide uncertainty. In the largest European trial of PSA screening for prostate cancer, after 16 years about 570 men had to be invited, and 18 extra men diagnosed, to prevent one death from prostate cancer (published 2019). Low-dose CT screening of heavy smokers cut lung-cancer deaths by roughly 20–25 % in two large trials (United States, 2011; Netherlands and Belgium, 2020). Countries and individuals weigh these trade-offs differently, and reasonably so.

> [!warn] Screening is for people without symptoms. If you notice a new lump, bleeding that is not normal for you, a lasting change in bowel habit, unexplained weight loss or a sore that will not heal, see a doctor promptly — do not wait for your next screening invitation.

### What it means for you
Before a screening test it is reasonable to ask: out of 1 000 people like me screened for ten years, how many avoid dying of this disease? How many have a false alarm? How many are diagnosed and treated for a disease that would never have harmed them? Good programmes publish these numbers in decision aids. The choice is yours, and different people, looking at the same numbers, reasonably choose differently.
`,
  ideas: [
    'Screening offers a test to healthy people; it helps only when earlier treatment changes the outcome.',
    'Lead time and length bias make survival from diagnosis look better even when nobody lives longer.',
    'Overdiagnosis finds real disease that would never have caused harm — and leads to treatment that cannot help.',
    'Only death rates in randomised trials of screening versus no screening show real benefit.',
    'Good decisions weigh deaths prevented against false alarms and overdiagnosis, per 1 000 people screened.'
  ],
  pitfalls: [
    'Better survival rates prove that screening works — Lead-time and length bias raise survival even when no death is prevented; only death rates in randomised trials show real benefit.',
    'Overdiagnosis is the same as a false positive — A false positive is a wrong result; an overdiagnosis is a real disease, correctly found, that would never have caused harm.',
    'Finding a disease earlier is always better — Earlier helps only if earlier treatment changes the outcome; otherwise it only adds years of being a patient.'
  ],
  formulas: [
    {
      name: 'At least one false alarm over repeated screens',
      expr: 'F = 1 - Sp^k', tex: 'F = 1 - \\text{Sp}^{\\,k}',
      vars: {
        F: { name: 'chance of at least one false positive (for someone without the disease)', q: 'ratio', unit: '%' },
        Sp: { name: 'specificity of each screen', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: '\\text{Sp}' },
        k: { name: 'number of screens', q: 'count', int: true, value: 10 }
      },
      note: 'Assumes each screen\'s errors are independent; in practice some people are recalled repeatedly and others never, so the true figure is a little lower.',
      practice: { unknowns: ['F', 'k'] },
      stories: { F: 'A woman without breast cancer has {k} yearly mammograms, each with a specificity of {Sp}. What is her chance of at least one false alarm?', k: 'With a specificity of {Sp} per screen, after how many screens does the chance of at least one false alarm reach {F}?' }
    },
    {
      name: 'Number needed to screen',
      expr: 'NNS = 1/(r0 - r1)', tex: '\\text{NNS} = \\frac{1}{r_0 - r_1}',
      vars: {
        NNS: { name: 'people screened for one death prevented', tex: '\\text{NNS}' },
        r0: { name: 'death rate from the disease without screening', q: 'ratio', unit: '%', value: 1.0, tex: 'r_0' },
        r1: { name: 'death rate from the disease with screening', q: 'ratio', unit: '%', value: 0.8, tex: 'r_1' }
      },
      note: 'The screening version of the number needed to treat, over the trial\'s time span. Always read it with the matching number overdiagnosed and the number of false alarms.',
      stories: { NNS: 'Over 15 years, {r0} of unscreened people and {r1} of screened people die of the disease. How many must be screened to prevent one death?' }
    }
  ],
  examples: [
    {
      title: 'Lead time in numbers',
      q: 'Without screening, a cancer is found from symptoms at age 67 and causes death at 70. Screening finds it at 63, but the treatment does not change when she dies. What is her survival from diagnosis in each case, and does she count as a "5-year survivor"?',
      steps: [
        'Without screening: $70 - 67 = 3$ years from diagnosis — not a 5-year survivor.',
        'With screening: $70 - 63 = 7$ years from diagnosis — counted as a 5-year survivor.',
        'She died at the same age. The death rate from the disease is unchanged; only the survival statistic moved.'
      ],
      a: '3 versus 7 years: the survival statistic improves by the lead time alone.'
    },
    {
      title: 'Ten years of false alarms',
      q: 'A woman without cancer has a mammogram every year for 10 years. Compare her chance of at least one false positive if each screen has a specificity of 90 % or of 95 %.',
      steps: [
        '90 %: $1 - 0.90^{10} = 1 - 0.349 = 0.65$.',
        '95 %: $1 - 0.95^{10} = 1 - 0.599 = 0.40$.'
      ],
      a: 'About 65 % and 40 %: even good tests, repeated, make a false alarm more likely than not over a decade.'
    },
    {
      title: 'Reading the UK panel\'s estimate',
      q: 'Per 10 000 women aged 50 invited to breast screening for 20 years: about 43 breast-cancer deaths prevented and 129 women overdiagnosed. How many women are invited per death prevented, and how many are overdiagnosed per death prevented?',
      steps: [
        'Invited per death prevented: $10\\,000/43 \\approx 233$.',
        'Overdiagnosed per death prevented: $129/43 = 3$.'
      ],
      a: 'About 233 women invited, and about 3 overdiagnosed, for each breast-cancer death prevented — estimates with wide uncertainty.'
    }
  ],
  quiz: [
    { q: 'Which measure can show that a screening programme saves lives?', choices: ['Five-year survival after diagnosis', 'The number of cancers found', 'The death rate from the disease in a randomised trial of screening versus no screening', 'The share of cancers found at an early stage'], a: 2,
      why: 'Survival, case counts and stage all improve through lead-time bias, length bias and overdiagnosis even when no death is prevented. Death rates in randomised groups do not.' },
    { q: 'Screening finds a cancer four years earlier, but the person dies on the same date as without screening. The five-year survival figure…', choices: ['falls', 'rises, although nothing real changed', 'is unchanged', 'cannot be calculated'], a: 1,
      why: 'Lead-time bias: the clock starts earlier, so more people "survive" five years from diagnosis.' },
    { q: 'Each screen has a specificity of 95 %. What is the chance of at least one false positive in 10 screens?', answer: 40.1, unit: '%',
      why: '1 − 0.95¹⁰ = 1 − 0.599 = 0.401.' },
    { q: 'A person can know that their own screen-detected cancer was overdiagnosed.', a: false,
      why: 'Once found, a cancer is treated, so nobody learns whether it would ever have caused harm. Overdiagnosis is measured only by comparing screened and unscreened populations.' },
    { q: 'Which is an example of overdiagnosis?', choices: ['A false-positive mammogram', 'A slow prostate cancer found by screening in a man who, unscreened, would have died of heart disease without ever knowing of it', 'A cancer missed by a screening test', 'A cancer found because of symptoms'], a: 1,
      why: 'The cancer is real and correctly diagnosed, but it would never have caused symptoms in his lifetime.' }
  ],
  applications: [
    'Deciding, with a decision aid, whether to take up breast, prostate, bowel or lung screening.',
    'National screening committees weighing benefits, harms and costs of programmes.',
    'Newborn screening for rare treatable conditions, where the balance is strongly favourable.',
    'Judging commercial "health check" scans and blood panels offered to healthy people.'
  ],
  sim: 'dx-screening'
},

{
  id: 'evidence-based-medicine', parent: 'evidence', title: 'Evidence-based medicine', level: 2,
  short: 'Making health decisions from the best available research, combined with clinical expertise and the patient\'s own values. For "does this treatment work?", randomised trials and their systematic reviews are far more reliable than observational studies, expert opinion or experience, because they defeat confounding.',
  keywords: ['evidence-based medicine', 'randomised controlled trial', 'RCT', 'placebo', 'blinding', 'confounding', 'observational study', 'cohort study', 'case-control study', 'systematic review', 'meta-analysis', 'hierarchy of evidence', 'GRADE', 'confidence interval', 'p-value', 'rule of three', 'bias'],
  prereq: ['risk-communication', 'epidemiology', 'math:hypothesis-testing'],
  related: ['clinical-trials', 'reading-health-news', 'screening-harms', 'math:central-limit-theorem', 'math:binomial-distribution'],
  body: `
For decades, women past the menopause were advised to take hormone therapy partly to protect their hearts. Large observational studies, following tens of thousands of women, had found a third to a half fewer heart attacks among those who took hormones. Then, in 2002, a randomised trial of more than 16 000 women — the Women's Health Initiative — found no protection at all, and small increases in heart attacks, strokes and blood clots with the combined hormones it tested. The women who had chosen hormones in the earlier studies were, on average, better off, slimmer, more active and more often in touch with doctors: healthier to begin with. The hormones had been given the credit for their health. (Later analyses suggest the balance depends on age and time since the menopause, and hormone therapy remains an effective treatment for troublesome menopausal symptoms — but not a way to prevent heart disease.)

That story is the heart of **evidence-based medicine**: using the most reliable evidence available, together with clinical expertise and the patient's own values and circumstances, to decide what to do.

### Why association is not causation
In an **observational study**, researchers watch what people choose and what happens to them. Whenever those who choose a treatment differ from those who do not — and they nearly always do — a difference in outcomes may come from that difference instead. A factor that influences both the choice and the outcome is a **confounder**. Coffee drinkers once seemed to have more heart disease — they also smoked more — and in recent studies they seem to live longer, which may partly reflect that people who feel unwell often give coffee up; how much of the link is causal is still uncertain. Researchers adjust for the confounders they measured, but never for those they did not. Observational studies are also distorted by **reverse causation** — early illness changing behaviour — and by the **healthy-user effect** seen with hormones.

### The randomised controlled trial
Randomisation cuts through all of this at once. If chance decides who gets the treatment, the groups differ only by chance — in every confounder, known or unknown. Good trials add:

- a **control group** given a placebo or the current standard treatment;
- **blinding**, so that neither patients nor assessors know who got what, which keeps expectations out of the results;
- **pre-registration** of the main outcome, so the most flattering of many outcomes cannot be picked afterwards;
- analysis by **intention to treat**: everyone counted in the group they were randomised to.

### Chance: confidence intervals and p-values
Even a perfect trial is a sample, and chance moves its result. A **95 % confidence interval** is the range of true effects reasonably compatible with the data; a narrow interval means a precise estimate. The **p-value** is the probability of a difference at least as large as the one seen *if the treatment had no effect at all* ([[math:hypothesis-testing]]); by convention, below 0.05 is called "statistically significant". It is not the chance that the treatment works, and one significant result can be a fluke ([[reading-health-news]]). For a proportion $p$ measured in $n$ people, the half-width of the 95 % interval is about

$$h \\approx 1.96\\sqrt{\\frac{p\\,(1 - p)}{n}}$$

so quadrupling a study only halves its uncertainty. And if a side effect never occurred in $n$ people, its true rate could still be as high as about $3/n$ — the **rule of three**: no serious reactions in 300 patients is compatible with a rate of 1 in 100.

### The hierarchy of evidence
For whether a treatment works, evidence is usually ranked:

1. **systematic reviews and meta-analyses** of randomised trials — every trial on the question, found by a pre-planned search and combined;
2. **randomised controlled trials**;
3. **cohort studies**, following exposed and unexposed people forwards;
4. **case–control studies**, comparing people with and without a disease and looking back;
5. case reports, expert opinion and reasoning from mechanisms.

The ranking is a guide, not a law. A huge, careful cohort study can beat a small, sloppy trial; some questions — the harms of smoking, rare side effects, decades-long outcomes — can never be settled by randomisation; and nobody needs a trial to know that parachutes help. Frameworks such as **GRADE** rate the certainty of a body of evidence as high, moderate, low or very low, weighing bias, inconsistency, imprecision and indirectness.

### What it means for you
When a treatment is proposed, it is fair to ask: what is the evidence that it helps people like me, and how big is the benefit in absolute terms ([[risk-communication]])? What are the harms? What happens if I wait or do nothing? Evidence-based medicine is not a cookbook: the aim is the best evidence applied to your situation and your priorities.
`,
  ideas: [
    'Evidence-based medicine combines the best research evidence with clinical expertise and the patient\'s values.',
    'Observational studies show associations; confounding, reverse causation and healthy-user effects can make them misleading.',
    'Randomisation balances every confounder, known and unknown, apart from chance; blinding and pre-registration keep the comparison fair.',
    'Confidence intervals show how precise a result is; a p-value is not the chance that a treatment works.',
    'Systematic reviews of randomised trials are the strongest evidence for treatment effects; GRADE rates how certain a body of evidence is.'
  ],
  pitfalls: [
    'A large observational study is as good as a trial — Size shrinks chance, not bias: confounding does not go away with more people.',
    'p < 0.05 means the treatment works — It means the data would be unusual if it did nothing; flukes, biases and trivially small effects can all be "significant".',
    'No side effects were seen, so there are none — In n people, rates up to about 3/n can easily go unseen; rare harms emerge only after wide use.'
  ],
  formulas: [
    {
      name: 'Margin of error of a proportion',
      expr: 'h = z*sqrt(p*(1 - p)/n)', tex: 'h = z\\,\\sqrt{\\frac{p\\,(1 - p)}{n}}',
      vars: {
        h: { name: 'half-width of the confidence interval', q: 'ratio', unit: '%' },
        z: { name: 'z for 95 % confidence', value: 1.96, fixed: true },
        p: { name: 'observed proportion', q: 'ratio', unit: '%', value: 30, min: 0, max: 100 },
        n: { name: 'number of people', q: 'count', int: true, value: 400 }
      },
      note: 'The normal approximation; fine when n·p and n·(1 − p) are both above about 10. For small counts the Wilson interval is better.',
      practice: { unknowns: ['h', 'n'] },
      stories: { h: 'In a study of {n}, {p} had the outcome. What is the margin of error of that percentage?', n: 'How many people are needed to measure a proportion near {p} to within ±{h}?' }
    },
    {
      name: 'The rule of three',
      expr: 'U = 3/n', tex: 'U = \\frac{3}{n}',
      vars: {
        U: { name: 'upper 95 % limit of the rate of an event never seen', q: 'ratio', unit: '%' },
        n: { name: 'number of people observed', q: 'count', int: true, value: 300 }
      },
      note: 'If none of n people had the event, rates up to about 3/n remain plausible (one-sided 95 %).',
      stories: { U: 'None of {n} patients in a trial had a serious reaction. How high could the true rate still be?', n: 'How many people must be observed without a single event to show that its rate is below {U}?' }
    }
  ],
  examples: [
    {
      title: 'How big must a trial be?',
      q: 'A treatment is expected to lower a two-year event rate from 20 % to 15 %. How precisely does a trial with 200 people per group measure each rate, and with 1 000 per group?',
      steps: [
        '200 per group: $h = 1.96\\sqrt{0.2 \\times 0.8/200} = 0.055$ for the control group, and $0.049$ for the treated group.',
        'The intervals, roughly 14.5–25.5 % and 10–20 %, overlap widely: the trial could easily miss a real effect.',
        '1 000 per group: $h = 1.96\\sqrt{0.2 \\times 0.8/1000} = 0.025$, so about 17.5–22.5 % against roughly 13–17 %.'
      ],
      a: 'About ±5 points with 200 per group — too imprecise — and about ±2.5 points with 1 000 per group. Detecting modest effects takes large trials.'
    },
    {
      title: 'No reactions seen',
      q: 'A new vaccine is given to 3 000 volunteers in its trials, with no case of a particular serious reaction. What can be said about its rate?',
      steps: [
        'Rule of three: $3/3000 = 0.001$, 1 in 1 000.',
        'Rates up to about 1 in 1 000 remain plausible; rarer reactions could not have been detected.',
        'This is why medicines are monitored after approval: reactions as rare as 1 in 100 000, such as the rare clotting reactions to some COVID-19 vaccines in 2021, appear only after millions of doses.'
      ],
      a: 'The true rate could be up to about 1 in 1 000; rarer effects need surveillance after approval.'
    }
  ],
  quiz: [
    { q: 'Why does randomisation make a fair comparison?', choices: ['It guarantees the treatment works', 'It balances known and unknown confounders between the groups, apart from chance', 'It removes the placebo effect', 'It makes the trial larger'], a: 1,
      why: 'When chance alone decides who is treated, every other factor — measured or not — is spread evenly between the groups on average.' },
    { q: 'A trial reports p = 0.03. This means…', choices: ['there is a 3 % chance the treatment does not work', 'if the treatment had no effect, a difference at least this large would turn up about 3 % of the time', 'the treatment works in 97 % of patients', 'the result is certainly true'], a: 1,
      why: 'The p-value is calculated assuming no effect. It says how surprising the data would be then — not the probability that the hypothesis is true.' },
    { q: 'No serious side effect occurred in 600 patients. Up to what rate could it still plausibly occur?', answer: 0.5, unit: '%',
      why: 'Rule of three: 3/600 = 0.005, 1 in 200.' },
    { q: 'Quadrupling the number of people in a study halves the width of its confidence interval.', a: true,
      why: 'The margin of error shrinks with the square root of n: √4 = 2.' },
    { q: 'Observational studies found fewer heart attacks in women taking hormone therapy; a large randomised trial found none prevented. The best explanation?', choices: ['The trial was too small', 'Healthier women chose hormones: confounding by the healthy-user effect', 'Hormones work only outside trials', 'Pure chance'], a: 1,
      why: 'Women who chose hormones were healthier in many ways. Randomisation removed that difference, and with it the apparent benefit.' }
  ],
  applications: [
    'Clinical guidelines built from systematic reviews and graded evidence.',
    'Shared decision-making: weighing the evidence with a patient\'s own priorities.',
    'Regulators deciding whether to approve a medicine, and monitoring rare harms afterwards.',
    'Judging claims for supplements and alternative treatments by the same standard as any medicine.'
  ],
  history: 'James Lind compared six treatments for scurvy on a ship in 1747 and found that citrus fruit worked — an early controlled trial. The Medical Research Council\'s 1948 trial of streptomycin for tuberculosis is usually counted as the first modern randomised trial. Archie Cochrane argued in 1972 for systematic reviews of trials, and the term "evidence-based medicine" spread from McMaster University in Canada in the early 1990s.',
  sim: 'dx-confounding'
},

{
  id: 'risk-communication', parent: 'evidence', title: 'Relative and absolute risk', level: 1,
  short: 'How the same result can sound huge or tiny: "halves the risk" may mean from 2 in 100 to 1 in 100, or from 2 in 10 000 to 1 in 10 000. Absolute risks, numbers needed to treat and pictures of 100 people show what a change really means for you.',
  keywords: ['relative risk', 'absolute risk', 'risk reduction', 'relative risk reduction', 'absolute risk reduction', 'number needed to treat', 'NNT', 'number needed to harm', 'NNH', 'odds ratio', 'hazard ratio', 'baseline risk', 'natural frequencies', 'icon array', 'risk communication'],
  prereq: ['math:percentages', 'math:probability-basics'],
  related: ['evidence-based-medicine', 'reading-health-news', 'screening-harms', 'bayes-diagnosis', 'cholesterol-lipids', 'clinical-trials'],
  body: `
In October 1995, British doctors were warned that newer contraceptive pills doubled the risk of blood clots in the veins compared with older ones. As a relative risk it was true. In absolute terms the risk went from roughly 1 in 7 000 women a year to about 2 in 7 000. Many women stopped the pill abruptly, and in the following year there were an estimated 13 000 extra abortions in England and Wales — while pregnancy itself carries a higher risk of clots than either pill. The figure was correct; the way it was told did harm.

### Two ways to describe one change
Suppose that over ten years 10 in 100 people like you would have a heart attack without a treatment (the control event rate, CER) and 7.5 in 100 with it (the experimental event rate, EER).

- **Absolute risk reduction**: ARR = CER − EER = 2.5 percentage points.
- **Relative risk**: RR = EER/CER = 0.75, so the **relative risk reduction** is RRR = 1 − RR = 25 %.
- **Number needed to treat**: NNT = 1/ARR = 40. Forty people take the treatment for ten years for one of them to avoid a heart attack; of the other 39, about 36 would not have had one anyway and about 3 have one despite treatment.

"25 % lower risk" and "one in 40 benefits" describe the same result. Headlines and advertisements prefer the first; a person deciding whether to take a tablet every day for ten years needs the second.

### The starting risk changes everything
A relative risk reduction is often roughly the same across groups of people, but the absolute benefit depends on how high the risk was to begin with. The same 25 % relative reduction gives:

| 10-year risk without treatment | With treatment | Absolute reduction | NNT |
|---|---|---|---|
| 40 % | 30 % | 10 points | 10 |
| 10 % | 7.5 % | 2.5 points | 40 |
| 2 % | 1.5 % | 0.5 points | 200 |

This is why treatments are aimed at people at higher risk, and why the same medicine can be clearly worthwhile for one person and hardly worth taking for another. Harms belong in the same currency: the **number needed to harm** (NNH) is 1 divided by the absolute increase in a side effect.

### Odds ratios and hazard ratios
Studies also report **odds ratios** (typical of case–control studies) and **hazard ratios** (in trials that follow people over time). For rare outcomes both are close to the relative risk; for common outcomes an odds ratio lies further from 1 — an odds ratio of 3 for an outcome that affects 40 % of the unexposed corresponds to a relative risk of only about 1.7.

### Showing risk clearly
Research on risk communication keeps finding that people understand risks better when they are given:

- **absolute numbers with a time frame and a reference group** — "over 10 years, 3 in 100 people like you";
- the **same denominator** throughout — "1 in 100 versus 2 in 100", not "1 in 100 versus 1 in 50";
- **benefits and harms in the same format**;
- **pictures of 100 or 1 000 people** (icon arrays), as in the [treatment-benefit calculator](#/tools/clinical/risk).

### What it means for you
When you read that something "raises the risk by 50 %" or "cuts it by a third", ask: from what to what, in whom, and over how long? A doubling of a tiny risk is still a tiny risk; a modest relative reduction of a large risk can be worth a great deal. The numbers are there to inform a decision that is yours to make with the people treating you.
`,
  ideas: [
    'Relative risk compares two groups; absolute risk says how many people in 100 are actually affected.',
    'ARR = CER − EER, RRR = ARR / CER, NNT = 1 / ARR.',
    'The same relative reduction is worth much more to someone at high risk than to someone at low risk.',
    'Odds ratios are close to relative risks only for rare outcomes.',
    'Clear risk figures use absolute numbers, a time frame, one denominator and both benefits and harms.'
  ],
  pitfalls: [
    'A 50 % reduction means half the people benefit — It means the risk halves; if the risk was 2 %, one person in 100 benefits.',
    'Relative risks are misleading and should be ignored — They are useful and often fairly constant across groups; they just need the starting risk beside them to mean anything to a person.',
    'An odds ratio is the same as a relative risk — Only for rare outcomes; for common ones the odds ratio exaggerates the relative risk.'
  ],
  formulas: [
    {
      name: 'Absolute risk reduction',
      expr: 'ARR = CER - EER', tex: '\\text{ARR} = \\text{CER} - \\text{EER}',
      vars: {
        ARR: { name: 'absolute risk reduction', q: 'ratio', unit: '%', signed: true, tex: '\\text{ARR}' },
        CER: { name: 'risk without the treatment (control event rate)', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: '\\text{CER}' },
        EER: { name: 'risk with the treatment (experimental event rate)', q: 'ratio', unit: '%', value: 7.5, min: 0, max: 100, tex: '\\text{EER}' }
      },
      note: 'In percentage points, over the time span of the study. A negative value means the treatment increased the risk.',
      stories: { ARR: 'Over ten years, {CER} of untreated people and {EER} of treated people have a heart attack. What is the absolute risk reduction?' }
    },
    {
      name: 'Relative risk reduction',
      expr: 'RRR = (CER - EER)/CER', tex: '\\text{RRR} = \\frac{\\text{CER} - \\text{EER}}{\\text{CER}}',
      vars: {
        RRR: { name: 'relative risk reduction', q: 'ratio', unit: '%', signed: true, tex: '\\text{RRR}' },
        CER: { name: 'risk without the treatment', q: 'ratio', unit: '%', value: 10, min: 0.001, max: 100, tex: '\\text{CER}' },
        EER: { name: 'risk with the treatment', q: 'ratio', unit: '%', value: 7.5, min: 0, max: 100, tex: '\\text{EER}' }
      },
      note: 'The headline number. It equals 1 − RR, where RR = EER / CER is the relative risk.',
      stories: { RRR: 'A treatment lowers a risk from {CER} to {EER}. By what percentage does it reduce the risk, in relative terms?', EER: 'A treatment cuts a risk of {CER} by {RRR} in relative terms. What is the risk with treatment?' }
    },
    {
      name: 'Number needed to treat',
      expr: 'NNT = 1/(CER - EER)', tex: '\\text{NNT} = \\frac{1}{\\text{CER} - \\text{EER}}',
      vars: {
        NNT: { name: 'people treated for one to benefit', tex: '\\text{NNT}' },
        CER: { name: 'risk without the treatment', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: '\\text{CER}' },
        EER: { name: 'risk with the treatment', q: 'ratio', unit: '%', value: 7.5, min: 0, max: 100, tex: '\\text{EER}' }
      },
      note: 'Always quoted with its time span ("for 10 years"). The same formula with an increase in a side effect gives the number needed to harm.',
      stories: { NNT: 'Over five years a treatment lowers the risk of stroke from {CER} to {EER}. How many people must be treated for five years for one to avoid a stroke?', EER: 'A treatment has a number needed to treat of {NNT} when the untreated risk is {CER}. What is the risk with treatment?' }
    },
    {
      name: 'From an odds ratio to a relative risk',
      expr: 'RR = OR/(1 - p0 + p0*OR)', tex: '\\text{RR} = \\frac{\\text{OR}}{1 - p_0 + p_0\\,\\text{OR}}',
      vars: {
        RR: { name: 'relative risk', tex: '\\text{RR}' },
        OR: { name: 'odds ratio', value: 3, tex: '\\text{OR}' },
        p0: { name: 'risk in the unexposed group', q: 'ratio', unit: '%', value: 40, min: 0, max: 100, tex: 'p_0' }
      },
      note: 'When p₀ is small the denominator is close to 1 and RR ≈ OR; when the outcome is common they part company.',
      stories: { RR: 'A study reports an odds ratio of {OR} for an outcome that affects {p0} of unexposed people. What is the relative risk?' }
    }
  ],
  examples: [
    {
      title: 'The pill scare in absolute terms',
      q: 'A risk of venous blood clots rose from about 1 in 7 000 women a year to about 2 in 7 000. Express this as a relative risk, an absolute increase and a number needed to harm.',
      steps: [
        'Relative risk: $(2/7000)/(1/7000) = 2$ — "doubles the risk".',
        'Absolute increase: $1/7000 \\approx 0.014$ percentage points a year.',
        'Number needed to harm: $7000$ women taking the newer pill for a year for one extra clot.'
      ],
      a: 'A doubling, but an absolute increase of 1 in 7 000 women a year — smaller than the risk of clots in the pregnancies that stopping the pill led to.'
    },
    {
      title: 'Same treatment, different people',
      q: 'A treatment lowers the 10-year risk of a heart attack by 25 % in relative terms. Find the absolute benefit and the NNT for a person at 40 % risk and one at 2 % risk.',
      steps: [
        'At 40 %: with treatment $0.75 \\times 40 = 30$ %; ARR 10 points; NNT $1/0.10 = 10$.',
        'At 2 %: with treatment 1.5 %; ARR 0.5 points; NNT $1/0.005 = 200$.'
      ],
      a: 'NNT 10 against NNT 200 — the same relative effect, twenty times the absolute benefit.'
    },
    {
      title: 'An odds ratio for a common outcome',
      q: 'A study reports an odds ratio of 3 for an outcome that affects 40 % of unexposed people. What is the relative risk?',
      steps: [
        { text: 'Convert:', tex: '\\text{RR} = \\frac{3}{1 - 0.4 + 0.4 \\times 3} = \\frac{3}{1.8} = 1.67' },
        'Check: the unexposed odds are 0.4/0.6 = 0.667; tripled, 2.0, a risk of 2/3 = 67 %; and 67/40 = 1.67.'
      ],
      a: 'A relative risk of about 1.7: "three times the odds" is not "three times the risk" when the outcome is common.'
    }
  ],
  quiz: [
    { q: 'A treatment lowers the five-year risk of stroke from 4 % to 3 %. What is the number needed to treat?', answer: 100,
      why: 'ARR = 4 % − 3 % = 1 percentage point = 0.01; NNT = 1/0.01 = 100 people for five years.' },
    { q: 'The same result (4 % down to 3 %) expressed as a relative risk reduction is…', answer: 25, unit: '%',
      why: '(4 − 3)/4 = 0.25: "cuts the risk of stroke by a quarter".' },
    { q: 'An advertisement says a medicine "cuts the risk by 50 %". What do you most need to know to judge the benefit?', choices: ['Nothing more: 50 % is large', 'The risk without the medicine and the time period', 'The price', 'Only the number of people in the trial'], a: 1,
      why: 'Half of a 20 % risk is a big benefit; half of a 0.2 % risk is a tiny one. The starting risk and the time frame turn a relative figure into an absolute one.' },
    { q: 'A doubling of risk always matters a lot.', a: false,
      why: 'Doubling 1 in 100 000 gives 2 in 100 000. Whether it matters depends on the starting risk, the seriousness of the outcome and what the alternative carries.' },
    { q: 'For a common outcome, an odds ratio of 2.5 usually…', choices: ['understates the relative risk', 'overstates the relative risk', 'equals it exactly', 'has nothing to do with it'], a: 1,
      why: 'Odds grow faster than probabilities when the probability is large, so the odds ratio lies further from 1 than the relative risk (2.5 at a 40 % baseline is an RR of about 1.6).' }
  ],
  applications: [
    'Deciding with a doctor whether a preventive medicine is worth taking, from your own absolute risk.',
    'Reading patient leaflets, where side-effect frequencies are given as "1 in 100" or "1 in 1 000".',
    'Decision aids and icon arrays in screening and treatment choices.',
    'Judging headlines and advertisements that quote only relative changes.'
  ]
},

{
  id: 'reading-health-news', parent: 'evidence', title: 'Reading health news', level: 1,
  short: 'A practical checklist for health headlines — who was studied, how, how many, compared with what, and how big the effect really is — and the reasons exciting single studies so often fail to hold up: chance, many comparisons, publication bias and exaggeration in the retelling.',
  keywords: ['health news', 'headlines', 'media', 'press release', 'study design', 'animal studies', 'correlation', 'causation', 'p-hacking', 'multiple comparisons', 'publication bias', 'surrogate outcome', 'conflict of interest', 'replication', 'winner\'s curse', 'misinformation'],
  prereq: ['evidence-based-medicine', 'risk-communication'],
  related: ['screening-harms', 'bayes-diagnosis', 'clinical-trials', 'epidemiology', 'math:hypothesis-testing'],
  body: `
"Red wine protects the heart." "Chocolate helps you lose weight." "New blood test detects cancer years early." Health headlines arrive every day, and many contradict last month's. Most rest on real research; the trouble is usually in what that research could show, and in the retelling.

### A checklist for any health story
1. **Who was studied?** Cells in a dish and mice are where ideas start, not where they are proven: most treatments that work in animals fail in people.
2. **What kind of study?** An observational study can show an association; only a randomised trial can show that the treatment itself made the difference ([[evidence-based-medicine]]). "Linked to" in a headline nearly always means observational.
3. **How many people, for how long?** Thirty people for six weeks is a reason for a bigger study, not for changing your life.
4. **Compared with what?** Nothing, a placebo, or the best existing treatment?
5. **How big is the effect, in absolute terms?** "Cuts the risk by 30 %" means little without the starting risk ([[risk-communication]]).
6. **Did it measure what matters?** A medicine that improves a blood marker (a *surrogate* outcome) may not reduce heart attacks or deaths — several have not.
7. **Who paid, and who is talking?** Funding does not make a result wrong, but it is worth knowing — and is the claim the researchers', a press office's or a reporter's?
8. **Does it fit the rest of the evidence?** One study rarely overturns many; systematic reviews beat single results.

### Why striking findings fade
**Chance and many comparisons.** A study that measures 20 outcomes, or 20 foods, or analyses its data 20 different ways, will often find something "significant" by luck alone. With a 5 % false-positive rate $\\alpha$ per comparison, the chance of at least one fluke among $k$ independent comparisons is

$$P = 1 - (1 - \\alpha)^{k}$$

— 64 % for 20 comparisons. Choosing the analysis after seeing the data (sometimes called p-hacking) raises it further; pre-registration and corrections for multiple testing guard against it.

**Few true ideas.** Even without such tricks, a "significant" result is only as believable as the idea behind it. If one tested idea in ten is true and studies have a 50 % chance of detecting a true effect, then of every 1 000 ideas tested, 50 true ones and 45 false ones (5 % of 900) come out significant: barely half of the "discoveries" are real — Bayes' theorem again ([[bayes-diagnosis]]).

**Publication bias and the winner's curse.** Studies with exciting results are more likely to be published, publicised and remembered than those that found nothing, so the published record overstates effects. The first study of a new idea tends to report the biggest effect — the one that got lucky — and later, larger studies usually find a smaller one.

**Exaggeration in the retelling.** A 2014 study in the BMJ compared university press releases with the papers behind them: roughly a third or more of the releases contained exaggerated advice, causal claims drawn from correlational studies, or conclusions about humans drawn from animal work — and news stories were far more likely to exaggerate when the press release did.

### Warning signs
- "Miracle", "breakthrough", "cure", or one study said to overturn everything;
- a product for sale from the people making the claim;
- anecdotes and testimonials in place of numbers;
- only relative risks, with no starting risk;
- claims that doctors or scientists are hiding the truth.

### What it means for you
You do not need to read the paper to judge the story. Ask the eight questions; prefer coverage that gives absolute numbers, mentions the study's limits and quotes an independent expert. Changes to your own treatment are best discussed with your clinician, who can place a new finding among everything else known about your situation.
`,
  ideas: [
    'Ask who was studied, how, how many, compared with what, and how big the effect is in absolute terms.',
    '"Linked to" usually means an observational association, not proof of cause.',
    'Many comparisons produce chance findings: 1 − 0.95ᵏ is 64 % for 20.',
    'A significant result is only as believable as the idea behind it; publication bias and the winner\'s curse inflate early findings.',
    'Exaggeration often starts in press releases; look for absolute numbers, limitations and independent comment.'
  ],
  pitfalls: [
    '"Linked to" means "causes" — Most such headlines report observational associations, which confounding or reverse causation can produce.',
    'A statistically significant result is a proven result — With many comparisons some flukes are expected; replication and pre-registration matter.',
    'The newest study is the most reliable — A single new study rarely outweighs the body of earlier evidence, and first reports of an effect are often the most exaggerated.'
  ],
  formulas: [
    {
      name: 'At least one fluke among many comparisons',
      expr: 'P = 1 - (1 - alpha)^k', tex: 'P = 1 - (1 - \\alpha)^{k}',
      vars: {
        P: { name: 'chance of at least one false "significant" result', q: 'ratio', unit: '%' },
        alpha: { name: 'significance threshold per comparison', q: 'ratio', unit: '%', value: 5, min: 0, max: 100, tex: '\\alpha' },
        k: { name: 'number of independent comparisons', q: 'count', int: true, value: 20 }
      },
      note: 'When nothing real is going on. The expected number of flukes is simply k·α.',
      practice: { unknowns: ['P', 'k'] },
      stories: { P: 'A study checks {k} foods for a link with cancer, none of which has any real effect, at a threshold of {alpha}. What is the chance that at least one comes out "significant"?', k: 'How many independent comparisons at {alpha} give a {P} chance of at least one fluke?' }
    },
    {
      name: 'Bonferroni correction',
      expr: 'ae = alpha/k', tex: '\\alpha_{\\text{each}} = \\frac{\\alpha}{k}',
      vars: {
        ae: { name: 'threshold for each comparison', q: 'ratio', unit: '%', tex: '\\alpha_{\\text{each}}' },
        alpha: { name: 'overall false-positive rate wanted', q: 'ratio', unit: '%', value: 5, tex: '\\alpha' },
        k: { name: 'number of comparisons', q: 'count', int: true, value: 20 }
      },
      note: 'A simple, cautious fix: it keeps the chance of any fluke below α, at the cost of missing some real effects.',
      stories: { ae: 'A study makes {k} comparisons and wants an overall false-positive rate of {alpha}. What p-value threshold should each comparison use?' }
    },
    {
      name: 'How often a "significant" finding is real',
      expr: 'PPV = (1 - b)*pt/((1 - b)*pt + alpha*(1 - pt))', tex: '\\text{PPV} = \\frac{(1-\\beta)\\,\\pi}{(1-\\beta)\\,\\pi + \\alpha\\,(1 - \\pi)}',
      vars: {
        PPV: { name: 'share of significant findings that are true', q: 'ratio', unit: '%', tex: '\\text{PPV}' },
        b: { name: 'chance that a study misses a true effect (1 − power)', q: 'ratio', unit: '%', value: 50, min: 0, max: 99.99, tex: '\\beta' },
        pt: { name: 'share of tested ideas that are true', q: 'ratio', unit: '%', value: 10, min: 0.001, max: 99.99, tex: '\\pi' },
        alpha: { name: 'significance threshold', q: 'ratio', unit: '%', value: 5, min: 0.001, max: 100, tex: '\\alpha' }
      },
      note: 'Bayes\' theorem applied to research: the "prevalence" is the share of true ideas among those tested, and 1 − β is the power. Bias and many comparisons lower it further.',
      practice: { unknowns: ['PPV', 'pt'] },
      stories: { PPV: 'In a field where {pt} of tested ideas are true, studies miss {b} of true effects and use a threshold of {alpha}. What share of "significant" findings are real?' }
    }
  ],
  examples: [
    {
      title: 'The twenty-foods study',
      q: 'Researchers ask 1 000 people about 20 foods and test each for a link with cancer at p < 0.05. None of the foods has any real effect. What is the chance that at least one comes out "significant", and what threshold would a Bonferroni correction use?',
      steps: [
        '$1 - 0.95^{20} = 1 - 0.358 = 0.64$.',
        'On average $20 \\times 0.05 = 1$ food will look "significant".',
        'Bonferroni: $0.05/20 = 0.0025$ for each food.'
      ],
      a: 'About 64 %; a corrected threshold of p < 0.0025 per food.'
    },
    {
      title: 'Translating a headline',
      q: '"Eating processed meat every day raises bowel cancer risk by 18 %" (the IARC estimate, 2015, for 50 g a day). If the lifetime risk of bowel cancer is about 6 in 100, what does this mean in absolute terms?',
      steps: [
        'With the extra risk: $6 \\times 1.18 = 7.1$ in 100.',
        'Absolute increase: about 1 extra case in every 100 people eating that much every day for life.'
      ],
      a: 'From about 6 to 7 in 100: a real but modest increase — much easier to weigh than "18 %".'
    },
    {
      title: 'How believable is a significant result?',
      q: 'In a field where 1 tested idea in 10 is true, studies have a 50 % chance of detecting a true effect and use p < 0.05. What share of the significant findings are real?',
      steps: [
        'Of 1 000 ideas: 100 true, of which $0.5 \\times 100 = 50$ are detected.',
        '900 false, of which $0.05 \\times 900 = 45$ come out significant by chance.',
        'Share real: $50/(50 + 45) = 0.53$.'
      ],
      a: 'About 53 % — barely better than a coin toss, before any bias is added.'
    }
  ],
  quiz: [
    { q: 'A headline says a food is "linked to" longer life. The study was most likely…', choices: ['a randomised trial', 'an observational study, which cannot show that the food caused it', 'a laboratory experiment', 'a meta-analysis of trials'], a: 1,
      why: '"Linked to" describes an association. People who eat the food may differ in many other ways that affect how long they live.' },
    { q: 'A study makes 10 independent comparisons at p < 0.05 when no real effects exist. What is the chance of at least one "significant" result?', answer: 40.1, unit: '%',
      why: '1 − 0.95¹⁰ = 0.401.' },
    { q: 'Why do early, small studies often report bigger effects than later, larger ones?', choices: ['Treatments stop working over time', 'Small studies that happened to find a big effect were more likely to be published and noticed', 'Larger studies are done carelessly', 'Patients change'], a: 1,
      why: 'Chance scatters small studies\' results widely; the lucky high ones get published and publicised first (publication bias, the winner\'s curse). Bigger studies land nearer the truth.' },
    { q: 'A medicine that improves a blood marker linked to a disease always prevents that disease.', a: false,
      why: 'Surrogate outcomes can mislead: some medicines that improved a marker (for example, raising "good" cholesterol) did not reduce heart attacks or deaths in trials.' },
    { q: 'Which is the strongest evidence that a treatment works?', choices: ['A testimonial from a satisfied patient', 'A study in mice', 'A systematic review of several randomised trials', 'An interview with an expert'], a: 2,
      why: 'Systematic reviews of randomised trials combine all the fair comparisons available; the others are anecdotes, animal evidence or opinion.' }
  ],
  applications: [
    'Judging health stories in the news and on social media.',
    'Deciding whether a new study should change what you do — usually: talk to your clinician first.',
    'Teaching critical appraisal in schools and universities.',
    'Recognising health misinformation and commercial claims.'
  ],
  sim: ['dx-many-trials', 'dx-confounding']
}

);
