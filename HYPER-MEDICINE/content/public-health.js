/* HYPER-MEDICINE · content/public-health.js — Public health: epidemiology, life expectancy
 * and the burden of disease, air, water and environmental health. Simulations in sims/prevention.js. */
Hyper.add(

/* ================================================================ EPIDEMIOLOGY */
{
  id: 'epidemiology', parent: 'public-health', title: 'Epidemiology', level: 2,
  short: 'The science of who gets ill, where, when and why, found by counting disease in populations. Prevalence and incidence, relative risk, study designs, and how to tell a cause from chance, bias and confounding.',
  keywords: ['epidemiology', 'prevalence', 'incidence', 'incidence rate', 'person-years', 'relative risk', 'risk ratio', 'odds ratio', 'attributable fraction', 'cohort study', 'case-control study', 'cross-sectional', 'confounding', 'bias', 'Bradford Hill', 'John Snow', 'age standardisation'],
  prereq: ['math:probability-basics', 'math:conditional-probability', 'risk-communication'],
  related: ['evidence-based-medicine', 'clinical-trials', 'reading-health-news', 'epidemics', 'screening-harms', 'life-expectancy', 'smoking'],
  body: `
In the late summer of 1854 cholera killed more than 500 people in ten days in a few streets of Soho, London. The physician John Snow did not know what caused cholera — the germ had not yet been identified — but he did something new: he marked each death on a map, and the deaths clustered around one water pump on Broad Street. He also compared households in south London supplied by two water companies, one drawing from the Thames below the city's sewage outfalls and one from cleaner water upstream, and found the death rate about eight times higher among the first company's customers. The pump handle was removed, and the idea of tracking disease by counting who falls ill, where and when — **epidemiology** — had its founding story.

### Counting: the basic measures
Epidemiology measures disease in populations, so everything starts with a numerator (cases) and a denominator (the people, or the time, at risk):

| Measure | What it counts | Example |
|---|---|---|
| Prevalence | the share who have the condition now | 1 adult in 10 has diabetes |
| Risk (cumulative incidence) | the share who develop it over a period | 2 % develop diabetes within 5 years |
| Incidence rate | new cases per person-time at risk | 4 per 1,000 person-years |
| Mortality rate | deaths per population per year | 60 per 100,000 a year |

Prevalence depends on how often a disease starts and how long it lasts: in a steady state, prevalence ≈ incidence rate × average duration. That is why a treatment that keeps people alive without curing them *raises* prevalence. Comparing places or years also needs **age standardisation**, because an older population has more heart disease and cancer even when every age group is healthier.

### Comparing groups
To find a cause, epidemiologists compare the risk in people exposed to something with the risk in people who are not. The **relative risk** says how many times higher the risk is; the **risk difference** says how many extra cases per hundred or thousand people — often the number that matters most to an individual (see [[risk-communication|relative and absolute risk]]). The **population attributable fraction** is the share of all cases that would not occur without the exposure; it depends both on the relative risk and on how common the exposure is.

| Design | How it works | Strength | Weakness |
|---|---|---|---|
| Cross-sectional survey | exposure and disease measured at one time | quick; gives prevalence | cannot tell which came first |
| Case–control study | past exposures of people with and without a disease compared | efficient for rare diseases | recall and selection bias; gives an odds ratio |
| Cohort study | exposed and unexposed people followed forward | shows timing; many outcomes | large and slow; confounding remains |
| Randomised trial | exposure assigned by chance | balances known and unknown factors | impossible for harmful exposures; costly |

### Chance, bias and confounding
An association can be produced by **chance** (small numbers — hence [[math:hypothesis-testing|confidence intervals and significance tests]]), by **bias** (in how people were chosen or measured) or by **confounding**: a third factor linked with both the exposure and the outcome. People who drank a lot of coffee used to be more likely to smoke, so coffee drinkers had more lung cancer — not because of the coffee. Comparing like with like — stratifying, adjusting or, best of all, randomising — removes a confounder; only randomisation also removes the ones nobody measured.

When a trial is impossible, the case for a cause is built from several lines of evidence, often summarised as the Bradford Hill considerations (1965): a strong association, seen consistently in different places and studies, with the exposure coming first, a dose–response gradient, a plausible mechanism, and a fall in disease when the exposure is removed. [[smoking|Smoking]] and lung cancer passed every test decades before the mechanism was worked out.

> [!tip] Reading a health headline, ask: compared with whom? How big is the absolute difference? Could something else explain it? Was it a trial or an observational study? See [[reading-health-news]].
`,
  ideas: [
    'Every measure is a numerator over a denominator: cases over people, or over person-time.',
    'Prevalence ≈ incidence rate × duration, so longer survival without cure raises prevalence.',
    'Relative risk compares groups; the risk difference and the attributable fraction show how much disease an exposure causes.',
    'Associations can come from chance, bias or confounding; randomisation is the only way to balance unknown confounders.',
    'Without trials, causes are judged on strength, consistency, timing, dose–response, plausibility and reversibility.'
  ],
  pitfalls: [
    'A strong association proves a cause — It may reflect confounding (coffee drinkers smoked more), reverse causation (illness changes behaviour) or bias; causation needs the whole pattern of evidence.',
    'A rising number of cases means a disease is spreading — Prevalence rises when people live longer with it, when testing improves, or when the population ages; incidence rates, age-standardised, tell the real story.',
    'A relative risk of 2 means half the exposed people will get the disease — It doubles a risk that may be tiny: 2 in 100,000 instead of 1 in 100,000.'
  ],
  formulas: [
    {
      name: 'Relative risk',
      expr: 'RR = (a/n1)/(c/n0)', tex: '\\text{RR} = \\frac{a/n_1}{c/n_0}',
      vars: {
        RR: { name: 'relative risk', tex: '\\text{RR}' },
        a: { name: 'cases among the exposed', value: 1263 },
        n1: { name: 'number exposed', value: 40046 },
        c: { name: 'cases among the unexposed', value: 98 },
        n0: { name: 'number unexposed', value: 26107 }
      },
      note: 'Defaults: John Snow\'s 1854 comparison — deaths from cholera per house supplied by the Southwark & Vauxhall company (sewage-polluted water) and by the Lambeth company (cleaner water).',
      practice: { unknowns: ['RR'] },
      stories: { RR: 'In a cohort, {a} of {n1} exposed people and {c} of {n0} unexposed people develop a disease. What is the relative risk?' }
    },
    {
      name: 'Prevalence from incidence and duration',
      expr: 'P = I*D/1000', tex: 'P = \\frac{I \\times D}{1000}',
      vars: {
        P: { name: 'prevalence', q: 'ratio', unit: '%' },
        I: { name: 'incidence rate (new cases per 1,000 person-years)', value: 8 },
        D: { name: 'average duration of the condition', q: 'years', unit: 'yr', value: 12 }
      },
      note: 'Holds for a steady situation and a condition affecting a minority; it explains why better survival without cure raises prevalence.',
      stories: { P: 'A condition starts at {I} per 1,000 person-years and lasts {D} on average. Roughly what share of the population has it?', D: 'A condition has a prevalence of {P} and an incidence of {I} per 1,000 person-years. How long does it last on average?' }
    },
    {
      name: 'Population attributable fraction (Levin)',
      expr: 'PAF = p*(RR - 1)/(1 + p*(RR - 1))', tex: '\\text{PAF} = \\frac{p\\,(\\text{RR} - 1)}{1 + p\\,(\\text{RR} - 1)}',
      vars: {
        PAF: { name: 'share of cases due to the exposure', q: 'ratio', unit: '%', tex: '\\text{PAF}' },
        p: { name: 'share of the population exposed', q: 'ratio', unit: '%', value: 20, min: 0, max: 100 },
        RR: { name: 'relative risk in the exposed', value: 15, min: 1, tex: '\\text{RR}' }
      },
      note: 'Assumes the relative risk is causal and not confounded. A common exposure with a modest relative risk can cause more cases than a rare one with a large relative risk.',
      practice: { unknowns: ['PAF', 'p'] },
      stories: { PAF: '{p} of adults smoke, and smokers have {RR} times the risk of lung cancer. What share of lung cancers is due to smoking?' }
    }
  ],
  examples: [
    {
      title: 'John Snow\'s comparison',
      q: 'In 1854, 1,263 cholera deaths occurred in 40,046 houses supplied by the Southwark & Vauxhall company and 98 deaths in 26,107 houses supplied by the Lambeth company. Compare the risks.',
      steps: [
        'Southwark & Vauxhall: $1263/40046 \\approx 0.0315$ — about 315 deaths per 10,000 houses.',
        'Lambeth: $98/26107 \\approx 0.0038$ — about 38 per 10,000 houses.',
        'Relative risk: $315/38 \\approx 8.4$; risk difference: about 278 extra deaths per 10,000 houses.',
        'The two companies\' customers lived side by side in the same streets, so the comparison was close to a natural experiment: water was the difference.'
      ],
      a: 'About 8 times the risk — roughly 280 extra deaths per 10,000 houses.'
    },
    {
      title: 'How many cases does an exposure cause?',
      q: 'In a country where 20 % of adults smoke, smokers have about 15 times the lung cancer risk of never-smokers. What share of lung cancers is attributable to smoking? What if half the adults smoked?',
      steps: [
        '$p(\\text{RR} - 1) = 0.2 \\times 14 = 2.8$.',
        '$\\text{PAF} = 2.8/(1 + 2.8) \\approx 0.74$ — about three-quarters of lung cancers.',
        'With $p = 0.5$: $7/(1 + 7) \\approx 0.88$.',
        'Lung cancers appear decades after smoking starts, so real attributable fractions reflect smoking rates of the past — in many countries 80–90 %.'
      ],
      a: 'About 74 % with 20 % smoking; about 88 % if half smoked.'
    }
  ],
  quiz: [
    { q: 'A new treatment keeps people with a chronic disease alive for longer but does not cure it. What happens to the prevalence?', choices: ['it rises', 'it falls', 'it stays the same', 'it falls to zero'], a: 0,
      why: 'Prevalence ≈ incidence × duration: new cases arrive at the same rate but stay longer in the "has the disease" group.' },
    { q: 'A study finds that coffee drinkers get more lung cancer. When the analysis is done separately for smokers and non-smokers the difference disappears. Smoking here is…', choices: ['a confounder', 'a consequence of lung cancer', 'a random error', 'the outcome'], a: 0,
      why: 'Smoking is linked with coffee drinking and causes lung cancer, so it created the crude association; stratifying removed it.' },
    { q: 'An association found in a very large cohort study is, by its size alone, proof that the exposure causes the disease.', a: false,
      why: 'Size shrinks chance, not bias or confounding. Causation is judged on the whole pattern of evidence, ideally including trials.' },
    { q: 'A disease starts at 5 per 1,000 person-years and lasts 10 years on average. Roughly what is its prevalence, in per cent?', answer: 5,
      why: '5/1000 × 10 = 0.05, about 5 % of the population.' },
    { q: 'Which study design is usually best for studying the causes of a rare disease?', choices: ['case–control study', 'cohort study', 'cross-sectional survey', 'a single case report'], a: 0,
      why: 'Starting from people who have the rare disease and comparing their past exposures with those of controls needs far fewer people than following a huge cohort until enough cases appear.' }
  ],
  applications: ['Investigating outbreaks of food poisoning, measles or a new virus.', 'Cancer registries and disease surveillance.', 'Finding the causes of disease: tobacco, asbestos, thalidomide, HPV.', 'Planning health services from the expected number of cases.'],
  history: 'John Snow\'s cholera studies (1854) are often called the start of modern epidemiology; a century later, Richard Doll and Austin Bradford Hill used case–control and cohort studies to show that smoking causes lung cancer.',
  sim: 'prev-confounding'
},

/* ================================================================ LIFE EXPECTANCY */
{
  id: 'life-expectancy', parent: 'public-health', title: 'Life expectancy and the burden of disease', level: 2,
  short: 'How long a newborn would live at today\'s death rates, how it is computed from a life table, why it has more than doubled in two centuries, and how the burden of disease counts the years lost to illness as well as to death.',
  keywords: ['life expectancy', 'life table', 'survival curve', 'mortality rate', 'child mortality', 'life expectancy at 65', 'period life expectancy', 'cohort life expectancy', 'Gompertz', 'DALY', 'disability-adjusted life years', 'burden of disease', 'healthy life expectancy', 'HALE', 'causes of death', 'non-communicable diseases'],
  prereq: ['epidemiology', 'math:expected-value', 'math:exponential-growth-decay'],
  related: ['ageing', 'environmental-health', 'vaccines', 'birth-newborn', 'heart-attack', 'stroke', 'common-cancers', 'smoking'],
  body: `
In 1900 a baby born in Sweden could expect to live a little over 50 years, and one born in India only into its twenties — yet grandparents were common in both. The paradox dissolves once you see what **life expectancy** averages over. A large share of children then died before their fifth birthday, and every death at the age of one pulls the average down as much as a death at 101 pulls it up. Those who survived childhood often lived into their sixties and seventies.

### What the number means
Life expectancy at birth is usually a **period** measure: the average age at death of an imaginary group of babies who would live their whole lives at this year's death rate for each age. It is not a forecast — death rates usually keep falling, so a baby born today will probably live longer (the **cohort** life expectancy) — and it is not the age at which most people die. It is computed from a **life table**: for each age $x$, the chance of dying within the year, $q_x$; the number of an original 100,000 still alive, $l_x$; and from these the years still to live, $e_x$. Because the table can start at any age, **life expectancy at 65** tells how long those who reach 65 live on — around 20 years in most high-income countries today, a little more for women and a little less for men.

Adult death rates rise with age in a remarkably regular way: from about 30 onwards the yearly risk of dying roughly doubles every eight years (Gompertz, 1825) — [[math:exponential-growth-decay|exponential growth]] — so a 70-year-old faces about thirty times the risk of a 30-year-old.

### Two centuries of progress
Life expectancy at birth for the whole world was about 30 years in 1800, roughly 46 in 1950 and about 73 in 2023 (UN estimates, 2024) — one of the largest changes in human history. Most of the early gain came from children surviving: clean water and sewers, better food and housing, [[vaccines]], antibiotics and oral rehydration. Later the gains moved to older ages as deaths from heart disease and stroke fell with blood-pressure treatment, statins and less smoking. The survival curve has become more **rectangular**: most people now live to old age, and deaths crowd into a narrower band of ages.

The gaps remain wide. In the early 2020s life expectancy ranged from the mid-50s in several countries of sub-Saharan Africa to about 85 in Japan and Hong Kong; women live about five years longer than men on average worldwide; and within a single country the richest and poorest areas can differ by ten years or more. COVID-19 cut global life expectancy by almost two years between 2019 and 2021 (WHO), before it recovered.

> [!note] A life expectancy of 35 in the past does not mean people died at 35. It means many died as babies — and those who did not often lived to 60 or 70.

### The burden of disease
Counting deaths misses the illnesses that disable without killing: depression, back pain, hearing loss, arthritis. The Global Burden of Disease project measures **disability-adjusted life years** (DALYs): years of life lost to early death plus years lived with disability, each weighted by its severity — a disability weight from 0 for full health to 1 for death. One DALY is one lost year of healthy life.

Non-communicable diseases — heart disease, stroke, cancer, chronic lung disease, diabetes — now cause about three-quarters of the world's deaths, some 41 million a year (WHO, 2019 data), while in the poorest countries newborn conditions, infections and malnutrition still take a large share. **Healthy life expectancy** (HALE), the years lived in good health, was about 62 worldwide in 2021 against a life expectancy of about 71: roughly the last decade of life is lived with illness or disability — the subject of [[ageing]].

### What it means for you
Population averages do not decide any one life, but they show where the years are won: surviving childhood, not smoking, controlling blood pressure, staying active, and getting good care when illness comes. Most of the gap between countries, and between rich and poor within them, is preventable.
`,
  ideas: [
    'Life expectancy at birth is the average age at death at today\'s death rates — not a forecast, and not a typical age at death.',
    'Low historical life expectancy mostly reflects child deaths; survivors often lived to 60 or 70.',
    'After about 30, the yearly risk of death doubles roughly every eight years (Gompertz).',
    'World life expectancy rose from about 30 (1800) to about 73 (2023), first by saving children, then by reducing heart disease and stroke.',
    'DALYs add years lived with disability to years lost to early death; healthy life expectancy is about ten years shorter than life expectancy.'
  ],
  pitfalls: [
    'People in the Middle Ages died at 30 — Average life expectancy was low because so many children died; adults who survived childhood commonly reached 60 or more.',
    'A life expectancy of 82 means I will probably die at 82 — Half of people live beyond the median age at death, which is higher than the average, and period life expectancy does not include future improvements.',
    'Longer life means more years of illness — Not necessarily: when illness is postponed as much as death, the years in poor health can stay the same or shrink; the evidence differs between countries.'
  ],
  formulas: [
    {
      name: 'Life expectancy as an average of two groups',
      expr: 'LE = q*a1 + (1 - q)*A', tex: '\\text{LE} = q\\, a_1 + (1 - q)\\, A',
      vars: {
        LE: { name: 'life expectancy at birth', q: 'years', unit: 'yr', tex: '\\text{LE}' },
        q: { name: 'share dying in childhood', q: 'ratio', unit: '%', value: 30, min: 0, max: 100 },
        a1: { name: 'average age at death of those dying in childhood', q: 'years', unit: 'yr', value: 2 },
        A: { name: 'average age at death of those surviving childhood', q: 'years', unit: 'yr', value: 60 }
      },
      note: 'A two-group caricature of a life table that shows why child deaths dominate life expectancy at birth.',
      practice: { unknowns: ['LE', 'q', 'A'] },
      stories: { LE: 'In a past population {q} of children died, at an average age of {a1}; the others died at {A} on average. What was the life expectancy at birth?', A: 'Life expectancy at birth was {LE}; {q} of children died, at an average age of {a1}. At what average age did the rest die?' }
    },
    {
      name: 'Disability-adjusted life years',
      expr: 'DALY = N*L + P*DW', tex: '\\text{DALY} = N\\, L + P \\times \\text{DW}',
      vars: {
        DALY: { name: 'DALYs in one year (years of healthy life lost)', tex: '\\text{DALY}' },
        N: { name: 'deaths in the year', value: 100 },
        L: { name: 'years of life lost per death (years)', value: 20 },
        P: { name: 'people living with the condition during the year', value: 5000 },
        DW: { name: 'disability weight (0 = full health, 1 = death)', value: 0.1, min: 0, max: 1, tex: '\\text{DW}' }
      },
      note: 'YLL = N × L (years of life lost), YLD = P × DW (years lived with disability, counting a whole year for each case). Real studies use standard life tables for L and survey-based weights for DW.',
      practice: { unknowns: ['DALY', 'P'] },
      stories: { DALY: 'In a year a condition causes {N} deaths, each losing {L} years, and {P} people live with it at a disability weight of {DW}. How many DALYs is that?' }
    }
  ],
  examples: [
    {
      title: 'A life expectancy of 36',
      q: 'In a historical population 40 % of children died in childhood, at an average age of 2; those who survived died at 58 on average. What was the life expectancy at birth?',
      steps: [
        '$\\text{LE} = 0.4 \\times 2 + 0.6 \\times 58$.',
        '$= 0.8 + 34.8 = 35.6$ years.',
        'So a life expectancy of about 36 went with an adult average age at death of 58 — the low figure is mostly about children.'
      ],
      a: 'About 36 years — although surviving adults lived to 58 on average.'
    },
    {
      title: 'Deaths versus disability',
      q: 'In one country a condition causes 1,000 deaths a year, each about 30 years before the standard life expectancy. Another condition kills almost nobody but affects 200,000 people with a disability weight of 0.15. Compare their burdens.',
      steps: [
        'First condition: $\\text{YLL} = 1000 \\times 30 = 30{,}000$ years of life lost.',
        'Second: $\\text{YLD} = 200{,}000 \\times 0.15 = 30{,}000$ years lived with disability.',
        'The two carry the same burden, 30,000 DALYs each — which is why conditions such as depression, back pain and hearing loss rank high in DALYs but barely appear in death statistics.'
      ],
      a: '30,000 DALYs each: a disabling condition can weigh as much as a deadly one.'
    }
  ],
  quiz: [
    { q: 'If child mortality falls sharply while adult death rates stay the same, what happens?', choices: ['life expectancy at birth rises a lot; life expectancy at 65 barely changes', 'both rise equally', 'life expectancy at 65 rises; at birth it does not', 'neither changes'], a: 0,
      why: 'Life expectancy at 65 depends only on death rates after 65; child deaths weigh heavily on the average from birth.' },
    { q: 'A life expectancy at birth of 40 in 1850 means that most adults then died at about 40.', a: false,
      why: 'The average was pulled down by child deaths; adults who survived childhood commonly lived into their sixties and beyond.' },
    { q: 'In a population 20 % of children die at an average age of 1 and everyone else dies at 70 on average. What is the life expectancy at birth, in years?', answer: 56.2,
      why: '0.2 × 1 + 0.8 × 70 = 0.2 + 56 = 56.2 years.' },
    { q: 'Healthy life expectancy (HALE) measures…', choices: ['the years a person can expect to live in good health', 'the life expectancy of people without any disease', 'life expectancy at 65', 'the maximum human lifespan'], a: 0,
      why: 'HALE subtracts the years lived in less than full health, weighted by severity, from life expectancy; worldwide it is about ten years lower.' },
    { q: 'By the Gompertz pattern, if the yearly risk of death doubles every 8 years, how many times higher is it at 70 than at 30?', choices: ['about 32 times', 'about 5 times', 'about 2 times', 'about 1,000 times'], a: 0,
      why: '40 years is 5 doublings: 2⁵ = 32.' }
  ],
  applications: ['Pensions and insurance, which are priced from life tables.', 'Setting health priorities with DALYs and cost per DALY averted.', 'Tracking the Sustainable Development Goals for child and maternal mortality.', 'Measuring health inequalities between regions and income groups.'],
  history: 'John Graunt analysed London\'s bills of mortality in 1662 and Edmond Halley built one of the first life tables from the records of Breslau in 1693; Benjamin Gompertz described the doubling of adult death rates in 1825. The Global Burden of Disease study introduced DALYs in the early 1990s.',
  sim: 'prev-life-table'
},

/* ================================================================ ENVIRONMENTAL HEALTH */
{
  id: 'environmental-health', parent: 'public-health', title: 'Air, water and environmental health', level: 2,
  short: 'How the air we breathe, the water we drink, the chemicals and radiation in our homes and a warming climate affect health — fine particles, unsafe water, lead, radon, carbon monoxide and heat — and what reduces the risk.',
  keywords: ['environmental health', 'air pollution', 'PM2.5', 'particulate matter', 'household air pollution', 'cooking smoke', 'air quality index', 'WHO air quality guidelines', 'water', 'sanitation', 'hygiene', 'handwashing', 'diarrhoea', 'lead', 'radon', 'carbon monoxide', 'heatwave', 'climate change'],
  prereq: ['epidemiology', 'respiratory-system', 'infection-spread'],
  related: ['asthma', 'copd', 'heart-attack', 'stroke', 'heat-cold', 'poisoning-overdose', 'life-expectancy', 'physics:radiation-dose'],
  body: `
In a village kitchen a mother cooks three meals a day over an open wood fire, with her baby on her back. The smoke that fills the room carries fine particles at many times the level the WHO considers safe. About 2.1 billion people — a quarter of humanity — still cook with wood, charcoal, dung, crop waste or kerosene, and the smoke they breathe is one of the largest environmental causes of death in the world.

Environmental health looks outward: at the air we breathe, the water we drink, the homes we live in and the climate around us. Its great victories — sewers, clean water, taking lead out of petrol — saved more lives than most medicines, and its remaining problems fall hardest on people with the least choice about where they live and work.

### Air
The pollutant that matters most is **fine particulate matter**, PM2.5: particles smaller than 2.5 micrometres, about a thirtieth of the width of a hair. They reach the deepest parts of the lungs and their effects reach the blood: they inflame airways and arteries, raise blood pressure, make blood clot more readily and trigger [[heart-attack|heart attacks]], [[stroke|strokes]] and [[asthma]] attacks, as well as causing lung cancer and [[copd|COPD]]. The WHO links about 6.7 million premature deaths a year to outdoor and household air pollution combined (2019 data), and 99 % of the world's people breathe air above its guideline levels. Long-term cohort studies suggest that every extra 10 µg/m³ of PM2.5 raises death rates by roughly 8 %.

| Pollutant (WHO air quality guidelines, 2021) | Yearly average | Short-term |
|---|---|---|
| PM2.5 | 5 µg/m³ | 15 µg/m³ (24 hours) |
| PM10 | 15 µg/m³ | 45 µg/m³ (24 hours) |
| Nitrogen dioxide | 10 µg/m³ | 25 µg/m³ (24 hours) |
| Ozone | 60 µg/m³ (peak season) | 100 µg/m³ (8 hours) |

The sources are traffic (especially diesel), coal and oil burned in power stations and industry, heating and cooking with solid fuels, farming, dust and wildfire smoke. Indoors, cleaner cooking — gas, electricity, improved stoves with chimneys — and ventilation make the biggest difference.

### Water, sanitation and hygiene
Contaminated water and poor sanitation spread diarrhoea, cholera, typhoid, hepatitis A and parasitic worms. In 2022 about 2.2 billion people lacked safely managed drinking water and 3.5 billion lacked safely managed sanitation (WHO/UNICEF). Diarrhoea still kills around 440,000 children under five a year (2021) — almost all preventable with safe water, toilets, handwashing with soap, breastfeeding, rotavirus vaccine, and oral rehydration solution for those who fall ill.

### Chemicals, radiation and the home
- **Lead** harms the developing brain at every level studied; old paint, old water pipes, some ceramics, spices and cosmetics, and informal battery recycling are common sources. Leaded petrol was finally ended worldwide in 2021.
- **Radon**, a [[physics:radioactivity|radioactive]] gas seeping from the ground into buildings, is the second cause of lung cancer after smoking; it can be measured cheaply and reduced by ventilating beneath the floor.
- **Carbon monoxide** from faulty boilers, heaters, generators and charcoal burned indoors has no smell and kills.
- **Heat** is the climate threat felt most directly: heatwaves raise deaths among older people, outdoor workers and people with heart, lung or kidney disease; one estimate put Europe's heat-related deaths in the summer of 2022 at about 60,000.

> [!warn] Carbon monoxide poisoning causes headache, dizziness, nausea, confusion and drowsiness, often in several people (or pets) in the same building at once, easing outdoors. Get everyone into fresh air, do not go back inside, and call your local emergency number.

### What people can do
Much of environmental health is collective — emission limits, clean water systems, building codes — but individual steps help: check the local air-quality index and move hard exercise indoors or to cleaner hours on bad days, especially with heart or lung disease; ventilate while cooking and use cleaner fuels where possible; fit a carbon monoxide alarm; test for radon where it is common; boil, filter or chlorinate water when its safety is in doubt; wash hands with soap after the toilet and before food; and in heatwaves stay cool, drink water and check on older neighbours (see [[heat-cold|heatstroke]]).
`,
  ideas: [
    'Fine particles (PM2.5) harm the heart and brain as well as the lungs; the WHO guideline is 5 µg/m³ as a yearly average.',
    'Outdoor and household air pollution together are linked to about 6.7 million deaths a year.',
    'Safe water, sanitation and handwashing prevent most deaths from diarrhoea, still a leading killer of young children.',
    'Lead, radon and carbon monoxide are invisible home hazards that can be measured and removed.',
    'Heat is the most direct health threat of a warming climate, falling hardest on older and chronically ill people.'
  ],
  pitfalls: [
    'Air pollution mainly causes lung disease — Most of its deaths are from heart disease and stroke; the particles act on blood vessels and blood clotting as well as the airways.',
    'Clear-looking water is safe to drink — Bacteria, viruses, parasites, lead and arsenic are invisible; water of unknown safety should be treated.',
    'You would notice a carbon monoxide leak — The gas has no colour, smell or taste; alarms detect it, people do not.'
  ],
  formulas: [
    {
      name: 'Long-term PM2.5 and the risk of death (log-linear)',
      expr: 'RR = R10^(dC/10)', tex: '\\text{RR} = \\text{RR}_{10}^{\\,\\Delta C/10}',
      vars: {
        RR: { name: 'relative risk of death', tex: '\\text{RR}' },
        R10: { name: 'relative risk per 10 µg/m³', value: 1.08, min: 1, tex: '\\text{RR}_{10}' },
        dC: { name: 'difference in long-term PM2.5 (µg/m³)', value: 30, tex: '\\Delta C' }
      },
      note: 'RR₁₀ ≈ 1.08 comes from the systematic review behind the 2021 WHO guidelines (all-cause deaths, long-term exposure). The true curve is steeper at low levels and flatter at very high ones, so this is a first estimate within the ranges studied.',
      practice: { unknowns: ['RR', 'dC'] },
      stories: { RR: 'A city\'s yearly PM2.5 is {dC} µg/m³ above the guideline. With a relative risk of {R10} per 10 µg/m³, how much higher is the death rate?' }
    },
    {
      name: 'Inhaled amount of a pollutant',
      expr: 'D = C*Vd*t', tex: 'D = C\\, \\dot{V}\\, t',
      vars: {
        D: { name: 'amount inhaled (µg)' },
        C: { name: 'concentration in the air (µg/m³)', value: 35 },
        Vd: { name: 'air breathed (m³ per day)', value: 15, tex: '\\dot{V}' },
        t: { name: 'time (days)', value: 1 }
      },
      note: 'An adult at rest breathes about 10–15 m³ a day, more with exertion; only part of what is inhaled is deposited in the lungs.',
      practice: { unknowns: ['D'] },
      stories: { D: 'An adult breathing {Vd} m³ of air a day spends {t} days in air containing {C} µg/m³ of fine particles. How many micrograms do they inhale?' }
    }
  ],
  examples: [
    {
      title: 'Cleaning up a city\'s air',
      q: 'A city\'s yearly PM2.5 falls from 35 to 10 µg/m³. With a relative risk of 1.08 per 10 µg/m³, by roughly how much would long-term death rates fall?',
      steps: [
        'The drop is $\\Delta C = 25$ µg/m³.',
        'Relative risk at the old level compared with the new: $1.08^{2.5} \\approx 1.21$.',
        'So the new death rate is $1/1.21 \\approx 0.83$ of the old — about 17 % lower once the benefit has built up over years.',
        'Much of the benefit, in heart attacks and strokes, starts within months of cleaner air.'
      ],
      a: 'About 17 % lower death rates in the long run (a rough, log-linear estimate).'
    },
    {
      title: 'A day\'s breathing',
      q: 'Compare the fine particles inhaled in a day (15 m³ of air) at the WHO guideline of 5 µg/m³, in a polluted city at 35 µg/m³, and in a home with an open cooking fire averaging 300 µg/m³ over the day.',
      steps: [
        'Guideline: $5 \\times 15 = 75$ µg.',
        'Polluted city: $35 \\times 15 = 525$ µg — seven times more.',
        'Smoky home: $300 \\times 15 = 4{,}500$ µg — sixty times the guideline dose, and women and young children, who spend most time near the fire, receive the most.'
      ],
      a: 'About 75, 525 and 4,500 µg a day.'
    }
  ],
  quiz: [
    { q: 'Taking a relative risk of 1.08 per 10 µg/m³, about how much lower would long-term death rates be if PM2.5 fell from 25 to 10 µg/m³?', choices: ['about 11 %', 'about 1.5 %', 'about 50 %', 'no change'], a: 0,
      why: 'ΔC = 15, so RR = 1.08^1.5 ≈ 1.12; the new rate is 1/1.12 ≈ 0.89 of the old, about 11 % lower.' },
    { q: 'Everyone in a household has had headaches and nausea for several days; they feel better at work and worse at home, where an old gas heater is running. What is most likely?', choices: ['carbon monoxide poisoning', 'food poisoning', 'a migraine running in the family', 'hay fever'], a: 0,
      why: 'Several people affected in one building, improving away from it, with a combustion appliance: suspect carbon monoxide, get out and call the emergency number.' },
    { q: 'Most deaths caused by household air pollution are from lung cancer.', a: false,
      why: 'Most are from heart disease, stroke, pneumonia and COPD; lung cancer is a smaller share.' },
    { q: 'After smoking, what is the most important cause of lung cancer in many countries?', choices: ['radon in homes', 'mobile phones', 'power lines', 'vaccines'], a: 0,
      why: 'Radon, a radioactive gas from the ground, is the second cause of lung cancer; it can be measured and reduced.' },
    { q: 'Which combination prevents most child deaths from diarrhoea?', choices: ['safe water, sanitation, handwashing, rotavirus vaccine and oral rehydration', 'antibiotics for every episode', 'stopping all food and drink during illness', 'bottled water only'], a: 0,
      why: 'Prevention (water, toilets, hygiene, vaccine, breastfeeding) plus oral rehydration for those who fall ill; antibiotics help only in some cases, and withholding fluids is dangerous.' }
  ],
  applications: ['Air-quality alerts and low-emission zones.', 'Clean-cooking programmes replacing open fires.', 'Water treatment, chlorination and sanitation programmes.', 'Heat–health action plans, radon testing and carbon monoxide alarm laws.'],
  history: 'The London smog of December 1952 killed several thousand people within days and led to the Clean Air Act of 1956; the Great Stink of 1858 pushed London to build Joseph Bazalgette\'s sewers, which ended its cholera epidemics.'
}

);
