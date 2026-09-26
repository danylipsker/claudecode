/* HYPER-MEDICINE · content/infectious-diseases.js — Infectious diseases: influenza and
 * COVID-19, HIV, tuberculosis, malaria, sepsis, and epidemics and pandemics.
 * Simulations in sims/infection.js. */
Hyper.add(

/* ================================================================ influenza and COVID-19 */
{
  id: 'influenza-covid', parent: 'infectious-diseases', title: 'Influenza and COVID-19', level: 1,
  short: 'Two respiratory viruses that spread through the air, keep changing and return in waves. Most people recover within one or two weeks, but both can cause severe pneumonia, especially in older people and those with long-term conditions; vaccines, antivirals and fresh air reduce the toll.',
  keywords: ['influenza', 'flu', 'COVID-19', 'SARS-CoV-2', 'coronavirus', 'respiratory virus', 'antigenic drift', 'antigenic shift', 'variant', 'pandemic', 'flu vaccine', 'antiviral', 'oseltamivir', 'long COVID', 'bird flu', 'H5N1', 'rapid antigen test', 'ventilation'],
  prereq: ['microbes-types', 'infection-spread', 'vaccines'],
  related: ['pneumonia', 'epidemics', 'innate-immunity', 'adaptive-immunity', 'sepsis', 'vital-signs', 'oxygen-transport', 'copd'],
  body: `
A 74-year-old retired teacher with COPD looks after her grandson, who comes home from school with a fever. Two days later she has a high temperature, aching muscles and a dry cough. Because she knows she is at high risk, she phones her doctor the same day; a swab confirms influenza and she starts an antiviral within 48 hours. She also had her flu vaccine in the autumn. On the fourth day she feels breathless walking to the bathroom and her lips look greyish — warning signs — and she is taken to hospital, where oxygen and careful monitoring see her through a viral pneumonia. The same infection would have given her grandson a week in bed.

### Two viruses, one pattern
Influenza viruses and SARS-CoV-2, the coronavirus that causes COVID-19, are both RNA viruses with a fatty envelope that infect the cells lining the airways. Both spread through droplets and fine aerosols, most efficiently indoors in crowded, poorly ventilated rooms, and both can be passed on from about a day before symptoms begin. Influenza's incubation period is short — 1 to 4 days, usually about 2; for COVID-19 it is typically 3 to 5 days with recent variants. Fever, cough, sore throat, aching muscles and exhaustion are common to both; loss of smell and taste was typical of early COVID-19 and is less common now. Symptoms alone cannot reliably tell them apart; rapid antigen or PCR tests can.

### Why they keep coming back
Influenza's surface proteins — haemagglutinin (H) and neuraminidase (N) — collect small changes every year (**antigenic drift**), so last year's immunity partly misses; the vaccine is updated twice a year, for each hemisphere's winter, on WHO advice. Occasionally a whole new H or N arrives from a bird or pig virus (**antigenic shift**), meeting a world with no immunity: the pandemics of 1918, 1957, 1968 and 2009. The H5N1 bird-flu virus has spread widely in wild birds and, since 2024, in dairy cattle in the United States, infecting a few dozen people; so far it has not spread from person to person. SARS-CoV-2 emerged at the end of 2019 and has since produced a series of variants, each spreading better or escaping immunity in part; it now circulates in repeated waves.

WHO estimates that seasonal influenza causes about a billion infections, 3–5 million cases of severe illness and 290,000–650,000 respiratory deaths every year. For COVID-19, WHO estimated about 14.9 million excess deaths worldwide in 2020–2021 alone.

### Who becomes seriously ill
The risk climbs steeply with age, especially beyond 75, and with long-term heart, lung, kidney or liver disease, diabetes, obesity, pregnancy and a weakened immune system; for influenza, children under five are also at higher risk. Complications include viral pneumonia, bacterial pneumonia on top of the virus, [[sepsis]], and heart attacks and strokes, whose risk rises for a week or two after infection. After COVID-19 some people have symptoms lasting months — fatigue, breathlessness, poor concentration — called **long COVID**; how common it is varies widely between studies, and it is less likely after vaccination and with recent variants.

### Prevention and treatment
Flu vaccines typically cut the risk of illness by 40–60 % in seasons when they match the circulating strains well (CDC), and protect better against severe illness than against infection. COVID-19 vaccines sharply reduced hospital admissions and deaths; protection against infection fades within months, which is why updated doses are offered, mainly to people at higher risk. Staying home when ill, fresh air, masks in crowded indoor places during waves, and hand hygiene all help.

Most people need only rest, fluids and medicines for fever and pain. **Antivirals** block steps in the virus's life cycle (see the simulation): neuraminidase inhibitors such as oseltamivir and zanamivir, and baloxavir, for influenza; nirmatrelvir (given with ritonavir, which interacts with many other medicines), remdesivir and molnupiravir for COVID-19. They work best when started within the first days and are offered mainly to people at high risk or who are seriously ill. For people with severe COVID-19 who need oxygen, the steroid dexamethasone cut deaths in the 2020 RECOVERY trial — by about a third among those on ventilators. Antibiotics do nothing against the viruses themselves; they are used only for bacterial complications.

How fast a wave grows links the doubling time of cases to the reproduction number through the generation interval (the time from one infection to the next): $R = 2^{\\,T_g/T_d}$.

> [!warn] Breathlessness at rest or getting worse, chest pain or pressure, blue or grey lips or face, new confusion, being hard to wake, or a seizure need emergency care — call your local emergency number. In children, also watch for fast or laboured breathing with the skin pulling in between the ribs, refusing all fluids, very few wet nappies, or a rash that does not fade under a pressed glass. Symptoms that improve and then return with fever and a worse cough need prompt medical review.
`,
  ideas: [
    'Influenza and SARS-CoV-2 are enveloped RNA viruses spread through the air, most efficiently indoors in stuffy, crowded rooms.',
    'They keep returning because they change: influenza drifts every year and occasionally shifts into a pandemic strain; SARS-CoV-2 keeps producing variants.',
    'Age and long-term conditions are the biggest risk factors for severe illness.',
    'Vaccines prevent severe illness best; antivirals help most when started early in people at high risk.',
    'Antibiotics do nothing against the viruses and are used only for bacterial complications.'
  ],
  pitfalls: [
    'Flu is just a bad cold — Influenza kills hundreds of thousands of people a year worldwide and raises the risk of heart attack and stroke in the week or two after infection.',
    'The flu jab can give you flu — Injected flu vaccines contain no live virus. A sore arm or a day of feeling unwell is the immune response; colds caught at the same time are coincidence.',
    'A negative rapid test on the first day rules it out — Rapid antigen tests miss many early infections; testing again a day or two later catches more.'
  ],
  formulas: [
    {
      name: 'Reproduction number from the doubling time',
      expr: 'R = 2^(Tg/Td)', tex: 'R = 2^{\\,T_g/T_d}',
      vars: {
        R: { name: 'reproduction number', tex: 'R' },
        Tg: { name: 'generation interval', q: 'time', unit: 'day', value: 5, tex: 'T_g' },
        Td: { name: 'doubling time of cases', q: 'time', unit: 'day', value: 3, tex: 'T_d' }
      },
      note: 'Assumes every infection is passed on exactly one generation interval later; with a spread of intervals it is an approximation. The generation interval is about 3 days for influenza and roughly 3–5 days for SARS-CoV-2, shorter for recent variants.',
      practice: { unknowns: ['R', 'Td'] },
      stories: {
        R: 'Cases in a new wave double every {Td}, and the generation interval is about {Tg}. What reproduction number does that imply?',
        Td: 'An infection with R = {R} has a generation interval of {Tg}. How often do cases double?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading the speed of a wave',
      q: 'Reported cases are doubling every 3 days, and the generation interval is about 5 days. Estimate R. If measures bring R down to 1.5, how often will cases double?',
      steps: [
        '$R = 2^{5/3} = 3.2$.',
        'Rearranged: $T_d = T_g / \\log_2 R$.',
        'With $R = 1.5$: $T_d = 5 / \\log_2 1.5 = 5 / 0.585 = 8.5$ days — still growing, but far more slowly.',
        'Only when R falls below 1 does the doubling time turn into a halving time.'
      ],
      a: 'R ≈ 3.2; at R = 1.5 cases double about every 8.5 days.'
    },
    {
      title: 'The first 48 hours',
      q: 'A 74-year-old with COPD develops fever, aches and a cough two days after her grandson had flu. What matters in the first days?',
      steps: [
        'Age and lung disease put her at high risk, so she contacts her doctor early rather than waiting it out.',
        'A swab confirms influenza; an antiviral started within about 48 hours shortens illness and lowers the risk of complications.',
        'Rest, fluids and fever relief continue. Antibiotics are not needed unless a bacterial complication appears.',
        'She and her family watch for warning signs: breathlessness at rest, chest pain, confusion, bluish lips. When they appear, that is an emergency.'
      ],
      a: 'Early contact, a test and an antiviral within 48 hours — and a clear plan to call for emergency help if warning signs appear.'
    }
  ],
  quiz: [
    { q: 'Why is a new flu vaccine offered every year?', choices: ['the virus\'s surface proteins keep changing (antigenic drift) and protection fades', 'the body uses the vaccine up', 'flu is caused by bacteria that become resistant', 'last year\'s vaccine becomes harmful'], a: 0,
      why: 'Small yearly mutations in haemagglutinin and neuraminidase mean antibodies from last year fit less well, so the strains in the vaccine are updated each season.' },
    { q: 'An antiviral for influenza does the most good when it is…', choices: ['started within about 48 hours of symptoms in someone at high risk', 'started after a week, once the fever has settled', 'taken every winter instead of the vaccine', 'combined with an antibiotic to kill the virus'], a: 0,
      why: 'Antivirals stop the virus copying itself; by the end of the first week most of the copying is over, and the illness is driven by the damage and the body\'s response.' },
    { q: 'Cases double every 4 days, and the generation interval is also 4 days. What is R?', answer: 2,
      why: '$R = 2^{4/4} = 2$: each case infects two others per generation, and a generation is exactly one doubling time.' },
    { q: 'Symptoms alone reliably tell influenza and COVID-19 apart.', a: false,
      why: 'Both cause fever, cough, aches and fatigue. A test is needed, which matters because the antivirals are different.' },
    { q: 'Antigenic shift in influenza is…', choices: ['a sudden swap of surface-protein genes, often with an animal virus, that can start a pandemic', 'the small yearly changes that make vaccines need updating', 'the move of flu season from winter to summer', 'the change in a patient\'s symptoms over the illness'], a: 0,
      why: 'Shift brings a subtype that people have never met, so almost nobody is immune. Drift is the gradual yearly change.' }
  ],
  applications: [
    'Yearly flu vaccination and updated COVID-19 vaccines for people at higher risk.',
    'Antiviral treatment for people at high risk of complications.',
    'Ventilation and air filtration in schools, care homes and offices.',
    'Surveillance of bird and swine influenza as an early warning of pandemics.'
  ],
  history: 'The 1918 influenza pandemic killed an estimated 50 million people, though estimates range widely. The 2009 H1N1 pandemic was much milder. COVID-19 was first reported in Wuhan, China, in December 2019; WHO described it as a pandemic on 11 March 2020 and ended the global health emergency in May 2023.',
  sim: 'inf-virus-cycle'
},

/* ================================================================ HIV */
{
  id: 'hiv', parent: 'infectious-diseases', title: 'HIV and AIDS', level: 2,
  short: 'HIV is a virus that slowly destroys the CD4 T cells that coordinate the immune system; untreated, it leads after years to AIDS. Today daily treatment keeps the virus undetectable, gives a near-normal life expectancy and prevents sexual transmission: undetectable equals untransmittable.',
  keywords: ['HIV', 'AIDS', 'human immunodeficiency virus', 'CD4 count', 'viral load', 'antiretroviral therapy', 'ART', 'U=U', 'undetectable', 'PrEP', 'PEP', 'retrovirus', 'reverse transcriptase', 'integrase', 'opportunistic infection', 'mother-to-child transmission', 'HIV test'],
  prereq: ['adaptive-immunity', 'microbes-types', 'infection-spread'],
  related: ['immunodeficiency', 'tuberculosis', 'antimicrobial-resistance', 'epidemics', 'pregnancy', 'math:logarithms'],
  body: `
A 28-year-old man has a routine sexual-health check and his HIV test comes back positive. He feels completely well. His CD4 count is 620 cells per microlitre and his viral load 45,000 copies per millilitre. That week he starts a single daily tablet containing three medicines. Three months later the virus is undetectable in his blood. His doctors tell him that with treatment he can expect to live about as long as his friends, and that while his virus stays undetectable he cannot pass HIV on to a partner through sex. Forty years ago the same test result usually meant death within a decade.

### How HIV works
HIV is a **retrovirus**: its genes are RNA. It attaches to the CD4 protein and a co-receptor on **helper T cells** — the cells that coordinate the rest of the immune response ([[adaptive-immunity]]). Inside, its enzyme *reverse transcriptase* copies the RNA into DNA, *integrase* splices that DNA into the cell's own chromosomes, the cell turns out new virus, and *protease* cuts the new proteins into their working form. Each step is a target for a medicine (see the simulation). Some infected cells go quiet and live for years with the viral DNA silently inside them — the **reservoir**, which is why treatment controls HIV but does not yet cure it.

### The course without treatment
- **Acute infection**, 2–4 weeks after exposure: many people have a flu-like illness with fever, rash, sore throat and swollen glands. The viral load is enormous and the person is highly infectious.
- **Chronic infection**: years with few or no symptoms. The viral load settles at a "set point", commonly 10,000–100,000 copies/mL, while the CD4 count — normally about 500–1,500 cells/µL, ranges vary between laboratories — falls by very roughly 50–100 cells/µL a year.
- **AIDS**: a CD4 count below 200 cells/µL or an AIDS-defining illness — pneumocystis pneumonia, tuberculosis, cryptococcal meningitis, Kaposi's sarcoma. Without treatment this takes about ten years on average, with wide variation.

### Treatment: a manageable long-term condition
Antiretroviral therapy (ART) combines medicines from different classes — for example the integrase inhibitor dolutegravir with the reverse-transcriptase inhibitors tenofovir and lamivudine — often in one daily tablet; injections every one or two months are an option in many countries. WHO has recommended since 2015 that everyone with HIV be offered treatment as soon as possible after diagnosis, whatever the CD4 count. The viral load typically falls a hundredfold in the first weeks and below the limit of detection (50 copies/mL) within three to six months, and the CD4 count recovers over the following years. A combination is essential: HIV copies itself carelessly and fast, so resistance to a single drug appears within weeks, while a virus needing several mutations at once almost never arises — as long as doses are not missed.

### Undetectable = untransmittable (U = U)
Large studies — HPTN 052, PARTNER and Opposites Attract — followed thousands of couples in which one partner had HIV kept below 200 copies/mL by treatment. Across tens of thousands of acts of sex without condoms there were no transmissions from the partner on treatment. The scientific consensus since 2016: a person whose viral load stays undetectable does not transmit HIV through sex. (For breastfeeding the risk is very low but not zero, and guidance differs between countries.)

### Prevention
Condoms; **PrEP** — HIV-negative people taking a tenofovir-based tablet daily or around sex, or long-acting injections (cabotegravir every two months; lenacapavir twice a year, approved in the United States in 2025), which cut the risk from sex by about 99 % when used as directed (CDC); **PEP**, a four-week course started within 72 hours of a possible exposure; regular testing; sterile needles and opioid substitution therapy; and testing and treatment in pregnancy, which lowers mother-to-child transmission from 15–45 % without any intervention to below 5 %, and often below 1 %.

UNAIDS estimated that at the end of 2023 about 39.9 million people were living with HIV, about two-thirds of them in Africa, and 30.7 million were receiving treatment; 1.3 million people acquired HIV that year and 630,000 died of AIDS-related illnesses. HIV is a health condition like any other: stigma keeps people from testing and treatment, and people with HIV work, raise families and live full lives.

> [!warn] If you may have been exposed to HIV in the last 72 hours — sex without a condom with a partner whose status is unknown or who is not on effective treatment, a shared needle, a needlestick injury — seek PEP today at a sexual-health clinic or emergency department; the sooner, the better. In someone with untreated or advanced HIV, breathlessness, a severe headache with fever or a stiff neck, confusion or a seizure need emergency care — call your local emergency number.
`,
  ideas: [
    'HIV infects and destroys CD4 helper T cells; untreated, the immune system slowly fails over about a decade.',
    'A combination of antiretroviral drugs keeps the virus undetectable and lets the CD4 count recover, but must be taken for life.',
    'Undetectable = untransmittable: a person on treatment with an undetectable viral load does not pass HIV on through sex.',
    'Condoms, PrEP, PEP, testing, sterile needles and treatment in pregnancy prevent new infections.',
    'Stigma is a barrier to testing and treatment; HIV is a manageable health condition.'
  ],
  pitfalls: [
    'HIV is a death sentence — With treatment started early and taken consistently, life expectancy approaches that of people without HIV.',
    'Feeling well means the virus is under control — The chronic phase can be symptom-free for years while the CD4 count falls; only a viral load test shows whether treatment is working.',
    'An undetectable viral load means HIV is cured — The virus hides in long-lived cells; if treatment stops, the viral load rebounds within weeks.'
  ],
  formulas: [
    {
      name: 'Years until the CD4 count reaches 200 (untreated, a rough sketch)',
      expr: 't = (C0 - Ca)/d', tex: 't = \\frac{C_0 - C_{\\text{AIDS}}}{d}',
      vars: {
        t: { name: 'time until the count reaches the AIDS threshold', q: 'years', unit: 'yr', tex: 't' },
        C0: { name: 'CD4 count now (cells/µL)', value: 750, tex: 'C_0' },
        Ca: { name: 'CD4 threshold for AIDS (cells/µL)', value: 200, fixed: true, tex: 'C_{\\text{AIDS}}' },
        d: { name: 'average fall per year (cells/µL per year)', value: 60, tex: 'd' }
      },
      note: 'A straight-line sketch for learning only: real declines vary widely between people and speed up at higher viral loads. It plays no part in deciding treatment — everyone with HIV is offered treatment straight away.',
      practice: { unknowns: ['t', 'd'] },
      stories: {
        t: 'After the acute phase, an untreated person\'s CD4 count is {C0} cells/µL and falls by about {d} cells/µL a year. Roughly how long until it drops below 200?',
        d: 'An untreated person\'s CD4 count fell from {C0} to 200 cells/µL in {t}. What was the average fall per year?'
      }
    },
    {
      name: 'Fall in viral load, in logs',
      expr: 'L = log(V0/V)', tex: 'L = \\log_{10} \\frac{V_0}{V}',
      vars: {
        L: { name: 'fall in viral load (logs, powers of 10)', tex: 'L' },
        V0: { name: 'viral load before treatment (copies/mL)', value: 100000, tex: 'V_0' },
        V: { name: 'viral load now (copies/mL)', value: 50, tex: 'V' }
      },
      note: 'Clinicians describe changes in viral load in powers of ten: a "2-log drop" is a hundredfold fall. Below about 50 copies/mL standard tests call the virus undetectable (some tests go lower, to 20).',
      practice: { unknowns: ['L', 'V'] },
      stories: {
        L: 'Before treatment the viral load was {V0} copies/mL; three months later it is {V} copies/mL. How many logs has it fallen?',
        V: 'A viral load of {V0} copies/mL falls by {L} logs. What is it now, in copies/mL?'
      }
    }
  ],
  examples: [
    {
      title: 'From diagnosis to undetectable',
      q: 'A person starts treatment with a viral load of 100,000 copies/mL. How many logs must it fall to reach the 50 copies/mL limit of detection, and roughly how long does that take?',
      steps: [
        '$L = \\log_{10}(100{,}000/50) = \\log_{10} 2000 = 3.3$ logs.',
        'The first 2 logs usually go within weeks, as the short-lived infected cells die and new ones are no longer infected: about 1,000 copies/mL after a month.',
        'The last 1.3 logs take longer, as longer-lived infected cells die off slowly: typically undetectable by 3 to 6 months.',
        'From then on, testing every few months confirms that the virus stays suppressed.'
      ],
      a: 'A 3.3-log (2,000-fold) fall, usually complete within 3–6 months.'
    },
    {
      title: 'Ten years without treatment',
      q: 'Before modern treatment, a man\'s CD4 count settled at 750 cells/µL after the acute illness and then fell by about 60 cells/µL a year. Roughly when would he reach AIDS by the CD4 definition?',
      steps: [
        '$t = (750 - 200)/60 = 9.2$ years.',
        'This matches the historical average of about ten years from infection to AIDS.',
        'People with a high set-point viral load often progressed in a few years; a small number ("elite controllers") kept the virus suppressed for decades.',
        'Today treatment is started at diagnosis, so this decline never happens.'
      ],
      a: 'About 9 years after the acute phase — close to the historical average of ten years.'
    }
  ],
  quiz: [
    { q: 'HIV causes AIDS by…', choices: ['destroying CD4 helper T cells, which coordinate the immune response', 'attacking red blood cells', 'damaging the bone marrow directly', 'blocking antibodies from binding to germs'], a: 0,
      why: 'Without helper T cells both antibody and killer-cell responses falter, so infections that a healthy immune system controls — pneumocystis, tuberculosis, cryptococcus — become dangerous.' },
    { q: 'A person with HIV whose viral load has stayed undetectable on treatment does not transmit HIV through sex.', a: true,
      why: 'That is U = U, established by studies of thousands of couples with no transmissions from a partner whose virus was suppressed.' },
    { q: 'Why is HIV always treated with a combination of drugs?', choices: ['the virus mutates so fast that resistance to one drug appears within weeks, while mutants resistant to several drugs at once are extremely rare', 'each drug works on a different day of the week', 'combinations are cheaper', 'one drug treats the virus and the others its side effects'], a: 0,
      why: 'The probabilities of the separate resistance mutations multiply, so a virus resistant to all the drugs at once almost never arises — provided doses are not missed.' },
    { q: 'A viral load falls from 200,000 to 20 copies/mL. By how many logs has it fallen?', answer: 4,
      why: '$\\log_{10}(200{,}000/20) = \\log_{10} 10{,}000 = 4$.' },
    { q: 'Someone had sex without a condom 36 hours ago with a partner whose HIV status is unknown. What is the most useful step?', choices: ['seek post-exposure prophylaxis (PEP) today at a sexual-health clinic or emergency department', 'wait three months and then test', 'take an antibiotic', 'nothing can be done'], a: 0,
      why: 'PEP must start within 72 hours and works best the sooner it starts. A test at that point shows only whether HIV was already present.' }
  ],
  applications: [
    'Routine HIV testing in pregnancy, sexual-health clinics and general practice.',
    'Antiretroviral therapy as a once-daily tablet or long-acting injection.',
    'PrEP and PEP to prevent infection.',
    'Viral-load and CD4 monitoring to guide care.'
  ],
  history: 'AIDS was first described in 1981, and HIV was identified in 1983 by Françoise Barré-Sinoussi and Luc Montagnier (Nobel Prize 2008). The first medicine, zidovudine, arrived in 1987; combination therapy from 1996 turned HIV from a fatal disease into a manageable one. UNAIDS estimates that about 42 million people have died of AIDS-related illnesses since the epidemic began.',
  sim: ['inf-hiv', { id: 'inf-virus-cycle', params: { virus: 'hiv' } }]
},

/* ================================================================ tuberculosis */
{
  id: 'tuberculosis', parent: 'infectious-diseases', title: 'Tuberculosis', level: 2,
  short: 'A slow-growing bacterium spread through the air that has infected about a quarter of humanity, usually silently. It becomes active disease in a minority — most often in the lungs — and is curable with several drugs taken together for months, yet it remains one of the world\'s deadliest infections.',
  keywords: ['tuberculosis', 'TB', 'Mycobacterium tuberculosis', 'latent TB', 'active TB', 'persistent cough', 'night sweats', 'BCG', 'MDR-TB', 'drug-resistant TB', 'combination therapy', 'IGRA', 'tuberculin skin test', 'sputum test', 'treatment support', 'consumption'],
  prereq: ['microbes-types', 'infection-spread', 'antibiotics'],
  related: ['antimicrobial-resistance', 'hiv', 'pneumonia', 'respiratory-system', 'vaccines', 'epidemics', 'medical-imaging'],
  body: `
A 45-year-old man who works in a crowded warehouse has had a cough for six weeks, drenching night sweats and a weight loss of 6 kg. A rapid molecular test on his sputum finds tuberculosis bacteria within hours and shows that they are not resistant to rifampicin. He starts a six-month course of treatment; within a couple of weeks he is far less infectious and feels better. His household is checked: his wife has a positive blood test but no symptoms and a clear chest X-ray — latent infection — and she is offered a short preventive course.

### Infection is not disease
*Mycobacterium tuberculosis* spreads through the air when a person with active TB of the lungs or throat coughs, talks or sings; the tiny droplets can float in a room for hours, so infection usually needs close, prolonged indoor contact. Most people who breathe it in contain it: immune cells wall the bacteria off in small nodules called granulomas. This **latent TB infection** causes no symptoms and cannot be passed on. WHO estimates that about a quarter of the world's population has been infected.

About 5–10 % of infected people develop **active TB** during their lives, most within two years of infection. The risk is far higher with HIV (people living with HIV are about 16 times more likely to fall ill, WHO), undernutrition, diabetes, smoking, heavy drinking, medicines that suppress the immune system, and in young children. Active TB usually affects the lungs — a cough lasting more than two or three weeks, sometimes with blood, fever, night sweats, weight loss and tiredness — but it can strike lymph glands, bones, the kidneys or the brain.

WHO's 2024 report estimated that 10.8 million people fell ill with TB in 2023 and 1.25 million died, including 161,000 people with HIV — making TB probably once again the world's leading cause of death from a single infectious agent, after three years in which COVID-19 held that place. Most cases occur in South-East Asia, Africa and the Western Pacific.

### Finding it
A skin test or an interferon-gamma release assay (a blood test) shows infection but cannot tell latent from active TB. Active disease is found with a chest X-ray and tests on sputum: rapid molecular tests, which WHO recommends as the first test, detect the bacterium's DNA and resistance to rifampicin within hours; culture is the most sensitive but takes weeks, because the bacterium divides only about once a day.

### Why several drugs, for months
A lung cavity can hold $10^8$–$10^9$ bacilli. Mutations giving resistance to isoniazid occur in about one in a million, and to rifampicin in about one in a hundred million, so a single drug would select a resistant population. Resistance to both at once needs two independent mutations — about one in $10^{14}$ — so a combination leaves no survivors ($m = N f_1 f_2$). The simulation shows it: with defences that cannot reach the bacteria, one drug lets the resistant mutants take over, and a second drug stops them. The slow growth and a dormant fraction of bacteria mean killing takes months.

The standard treatment is two months of four drugs — isoniazid, rifampicin, pyrazinamide and ethambutol — followed by four months of isoniazid and rifampicin; WHO reports that about 88 % of people treated are cured or complete treatment. A four-month regimen is an option for some people aged 12 and over, and shorter treatment for children with non-severe TB. Support — directly or video-observed doses, food, transport costs — helps people finish. Rifampicin turns urine and tears orange and weakens hormonal contraception and many other medicines; liver problems need watching.

**Drug-resistant TB** (resistant to rifampicin, often with isoniazid: MDR/RR-TB) struck about 400,000 people in 2023 (WHO). Once treated with up to two years of toxic injections, it is now treated in most cases with a six-month all-oral combination of bedaquiline, pretomanid, linezolid and moxifloxacin. **Latent TB** in people at high risk of progression — household contacts, people with HIV, people starting immune-suppressing medicines — is treated with a short preventive course. The **BCG** vaccine, used since 1921, protects babies and young children against the most severe forms, such as TB meningitis, but gives limited protection against lung TB in adults; new vaccines are in large trials.

> [!warn] Coughing up more than a small amount of blood, severe breathlessness or chest pain — call your local emergency number. A child with fever, headache, a stiff neck, vomiting or unusual drowsiness may have meningitis, including TB meningitis: call your local emergency number. A cough lasting more than two or three weeks, especially with fever, night sweats or weight loss, should be checked by a doctor — ask about a TB test.
`,
  ideas: [
    'Most people infected with TB contain it as latent infection, with no symptoms and no risk to others; 5–10 % develop active disease.',
    'HIV, undernutrition, diabetes, smoking and immune-suppressing medicines greatly raise the risk of active TB.',
    'Resistance mutations to two drugs rarely occur together, so combinations of drugs cure TB where single drugs would fail.',
    'Treatment takes months because the bacterium grows slowly and some bacilli lie dormant.',
    'Rapid molecular tests find TB and rifampicin resistance within hours; drug-resistant TB now has six-month all-oral treatment.'
  ],
  pitfalls: [
    'A positive TB blood or skin test means active, infectious TB — It shows infection, usually latent; only symptoms, an X-ray and sputum tests show active disease.',
    'TB is a disease of the past — It still kills more than a million people a year, more than any other single infectious agent in most recent years.',
    'Once you feel better you can stop treatment — Symptoms improve within weeks, but bacteria remain for months; stopping early risks relapse and resistance.'
  ],
  formulas: [
    {
      name: 'Bacilli resistant to two drugs at once',
      expr: 'm = N*f1*f2', tex: 'm = N \\cdot f_1 \\cdot f_2',
      vars: {
        m: { name: 'expected number of doubly resistant bacilli', tex: 'm' },
        N: { name: 'bacilli in the lesion', value: 1e9, tex: 'N' },
        f1: { name: 'frequency of resistance to drug 1 (e.g. isoniazid)', value: 1e-6, tex: 'f_1' },
        f2: { name: 'frequency of resistance to drug 2 (e.g. rifampicin)', value: 1e-8, tex: 'f_2' }
      },
      note: 'Resistance mutations to different drugs arise independently, so their frequencies multiply. An expected number far below 1 means that, almost certainly, no bacillus in the lesion resists both — the reason TB, HIV and malaria are treated with combinations.',
      practice: { unknowns: ['m', 'N'] },
      stories: {
        m: 'A lung cavity holds {N} bacilli. Resistance to isoniazid occurs at a frequency of {f1} and to rifampicin at {f2}. How many bacilli resistant to both would you expect?',
        N: 'With resistance frequencies of {f1} and {f2}, how many bacilli would a lesion need to contain one doubly resistant bacillus on average (m = {m})?'
      }
    }
  ],
  examples: [
    {
      title: 'One drug or four?',
      q: 'A lung cavity contains $10^9$ bacilli. Resistance to isoniazid arises in about 1 in $10^6$ and to rifampicin in about 1 in $10^8$. What happens with isoniazid alone, and with both drugs?',
      steps: [
        'Isoniazid-resistant bacilli already present: $10^9 \\times 10^{-6} = 1000$. Isoniazid alone kills the rest and these regrow: the treatment fails with resistant TB.',
        'Rifampicin-resistant: $10^9 \\times 10^{-8} = 10$; each is still killed by isoniazid.',
        'Resistant to both: $10^9 \\times 10^{-6} \\times 10^{-8} = 10^{-5}$ — about one chance in 100,000 that even one exists.',
        'This is also how MDR-TB is created: taking drugs irregularly, or a failing regimen that is effectively one drug, lets resistance build up one step at a time.'
      ],
      a: 'Alone, isoniazid leaves about 1,000 resistant survivors; together the two drugs leave essentially none.'
    },
    {
      title: 'A contact in the household',
      q: 'The wife of a man with lung TB has a positive TB blood test, no symptoms and a normal chest X-ray. Is she infectious, and what is offered?',
      steps: [
        'Positive blood test, no symptoms, normal X-ray: latent TB infection.',
        'She has no active disease in her lungs, so she cannot spread TB.',
        'Her risk of developing active TB is highest in the next two years; a short preventive course (for example three months of a rifamycin-based combination) cuts that risk substantially.',
        'Children under five in the household are checked with particular care, because they progress to severe TB more easily.'
      ],
      a: 'She is not infectious; she is offered preventive treatment to stop latent infection becoming active TB.'
    }
  ],
  quiz: [
    { q: 'A person with latent TB infection…', choices: ['has no symptoms and cannot pass TB on, but may develop active TB later', 'is highly infectious', 'needs to be isolated', 'has lung TB that shows on every X-ray'], a: 0,
      why: 'In latent infection the bacteria are walled off by the immune system. Only active TB of the lungs or throat spreads.' },
    { q: 'A lung cavity holds $10^8$ bacilli, and one in $10^6$ is resistant to isoniazid. How many isoniazid-resistant bacilli are expected?', answer: 100,
      why: '$10^8 \\times 10^{-6} = 100$ — enough to regrow if isoniazid were given alone.' },
    { q: 'Why does TB treatment last at least four to six months?', choices: ['the bacteria grow slowly and some lie dormant, so killing them takes a long time', 'the drugs take months to be absorbed', 'to protect against catching TB again from other people', 'the immune system needs months to make antibodies'], a: 0,
      why: 'Antibiotics kill actively growing bacteria fastest; slow and dormant bacilli are cleared only gradually, and stopping early risks relapse.' },
    { q: 'The BCG vaccine reliably prevents lung TB in adults.', a: false,
      why: 'BCG protects young children against severe forms such as TB meningitis, but its protection against adult lung TB is limited and variable — why new vaccines are being tested.' },
    { q: 'Which condition most increases the chance that latent TB becomes active disease?', choices: ['untreated HIV infection', 'high blood pressure', 'short-sightedness', 'a healed broken leg'], a: 0,
      why: 'HIV destroys the CD4 T cells that keep the granulomas intact; people with HIV are about 16 times more likely to develop TB.' }
  ],
  applications: [
    'Checking household contacts and people with HIV for TB.',
    'Rapid molecular tests that detect TB and rifampicin resistance within hours.',
    'Treatment-support programmes with directly or video-observed doses.',
    'Screening for latent TB before immune-suppressing treatments.'
  ],
  history: 'Robert Koch announced the discovery of the tuberculosis bacillus on 24 March 1882, now World TB Day. The BCG vaccine was first used in 1921 and streptomycin in 1944. British trials around 1950 showed that combining drugs prevented resistance, and rifampicin made six-month treatment possible in the 1970s.',
  sim: { id: 'inf-antibiotic', params: { combo: true, immune: 'weak' }, title: 'Why tuberculosis needs several drugs' }
},

/* ================================================================ malaria */
{
  id: 'malaria', parent: 'infectious-diseases', title: 'Malaria', level: 2,
  short: 'A parasitic disease spread by the bite of Anopheles mosquitoes. The parasite multiplies in the liver and then in red blood cells, causing fever that can turn severe within a day, especially in young children. Bed nets, prompt testing and treatment, and now vaccines have saved millions, but it still kills about 600,000 people a year.',
  keywords: ['malaria', 'Plasmodium falciparum', 'Plasmodium vivax', 'Anopheles', 'mosquito', 'bed net', 'insecticide-treated net', 'artemisinin', 'ACT', 'rapid diagnostic test', 'malaria vaccine', 'RTS,S', 'R21', 'severe malaria', 'travel', 'sickle cell trait', 'entomological inoculation rate'],
  prereq: ['microbes-types', 'infection-spread', 'blood-composition'],
  related: ['anemia', 'antimicrobial-resistance', 'epidemics', 'vaccines', 'sepsis', 'math:probability'],
  body: `
Two fevers, two outcomes. In rural Malawi in the rainy season a two-year-old becomes hot and listless. By evening a community health worker has done a finger-prick rapid test, found malaria and started artemisinin-based tablets; three days later the child is playing again. In Europe, a man back from a two-week trip to West Africa develops fever and aches ten days after his return. He assumes it is flu and waits three days; he collapses with severe *falciparum* malaria and spends a week in intensive care. With malaria, fever is a reason for a test the same day.

### A parasite with two hosts
Malaria is caused by *Plasmodium* parasites. Of the five species that infect people, *P. falciparum* causes most deaths and dominates in Africa; *P. vivax* is widespread in Asia and the Americas and can hide in the liver and cause relapses months later. The cycle:

1. A female *Anopheles* mosquito, usually biting between dusk and dawn, injects parasites that travel to the **liver**, where they multiply silently for one to two weeks.
2. Thousands of new parasites burst out and invade **red blood cells**, multiply and burst them — every 48 hours for *falciparum* and *vivax* — releasing the next generation. The bursts bring fever, chills and aches, and destroy red cells, causing [[anemia|anaemia]].
3. Some parasites become sexual forms that another mosquito picks up with a blood meal. They develop in the mosquito for about 10–14 days before its bite is infectious — so a mosquito must survive that long to pass malaria on.

*Falciparum* makes infected red cells sticky, so they cling to the walls of small vessels in the brain, the placenta and other organs: cerebral malaria, severe anaemia, breathing difficulty and kidney failure can develop within hours. Young children and pregnant women are at greatest risk. People who grow up with repeated infections gain partial immunity, which fades when they live elsewhere for some years. Sickle-cell trait protects against severe malaria, which is why it is common where malaria has long been.

### The toll
WHO's 2024 World Malaria Report estimated 263 million cases and 597,000 deaths in 2023, about 95 % of the deaths in Africa and about three-quarters of those in children under five. Deaths fell by roughly a third between 2000 and 2019, and WHO estimates that since 2000 about 2.2 billion cases and 12.7 million deaths have been averted.

### Breaking the cycle
- **Insecticide-treated bed nets** protect the sleeper and kill mosquitoes that land on them, lowering the bites for everyone nearby. Newer nets combine two insecticides because many mosquitoes now resist the older one.
- **Indoor spraying** and removing breeding sites; **seasonal preventive medicines** for young children in the rainy season in the Sahel.
- **Vaccines**: WHO recommended RTS,S in 2021 and R21 in 2023 for children in malaria regions. In pilot introductions RTS,S was linked to a 13 % fall in deaths from all causes among children old enough to receive it; in trials R21 cut clinical malaria by about 75 % over a year where malaria is seasonal.
- **Prompt testing** with a blood film or rapid test and **treatment** with an artemisinin-based combination therapy (ACT); severe malaria is treated with injected artesunate in hospital.

Each tool lowers a different factor of transmission, and together they can push the reproduction number below 1 — try it in the simulation, where nets alone bring R from about 22 to about 1.5 and prompt treatment takes it below 1.

Resistance threatens each tool: parasites partly resistant to artemisinin, first seen in South-East Asia, have now appeared in several East African countries; mosquitoes resist insecticides; and parasites that lack the protein some rapid tests detect are spreading in the Horn of Africa.

**Travellers** to malaria areas should get advice from a travel clinic before leaving: avoiding bites (repellent, long sleeves, nets, screens), preventive tablets chosen for the destination and the person, and knowing that any fever from about a week after arrival until months after return needs a same-day malaria test.

> [!warn] In anyone who is in or has visited a malaria area, a fever needs a malaria test the same day — tell the doctor about the travel. Confusion, drowsiness, a seizure, difficulty breathing, dark or very little urine, yellow eyes, repeated vomiting or being unable to sit or stand are signs of severe malaria: call your local emergency number.
`,
  ideas: [
    'Malaria parasites cycle between Anopheles mosquitoes and people, multiplying first in the liver and then in red blood cells.',
    'Plasmodium falciparum can turn severe within hours, especially in young children, pregnant women and travellers without immunity.',
    'A mosquito must survive the 10–14 days the parasite needs inside it, so killing mosquitoes has a large effect on transmission.',
    'Bed nets, indoor spraying, prompt testing with ACT treatment, preventive medicines and vaccines each break part of the cycle.',
    'Fever after travel to a malaria area needs a same-day test.'
  ],
  pitfalls: [
    'Malaria can only start while you are abroad — The liver stage takes at least a week, and falciparum usually appears within three months of return; vivax and ovale can relapse a year or more later.',
    'A bed net only protects the person under it — Insecticide-treated nets kill mosquitoes, so they lower the number of infectious mosquitoes for the whole community.',
    'People who grew up in a malaria area are immune for life — Partial immunity needs repeated infections and fades after some years away; visiting family is a common way for such travellers to fall seriously ill.'
  ],
  formulas: [
    {
      name: 'Chance of at least one infection from repeated bites',
      expr: 'P = 1 - (1 - b)^n', tex: 'P = 1 - (1 - b)^{\\,n}',
      vars: {
        P: { name: 'chance of at least one infection', q: 'ratio', unit: '%', tex: 'P' },
        b: { name: 'chance that one infectious bite causes infection', q: 'ratio', unit: '%', value: 10, min: 0.01, max: 99, tex: 'b' },
        n: { name: 'number of infectious bites', int: true, value: 20, tex: 'n' }
      },
      note: 'Treats bites as independent. b is uncertain: estimates range from a few per cent to more than half, depending on immunity and the parasite. The number of infectious bites a person receives in a year — the entomological inoculation rate — ranges from below one to several hundred across Africa.',
      practice: { unknowns: ['P', 'n'] },
      stories: {
        P: 'During a rainy season a child receives about {n} infectious bites, each with a {b} chance of causing infection. What is the chance of at least one infection?',
        n: 'If each infectious bite causes infection with probability {b}, how many infectious bites give a {P} chance of at least one infection?'
      }
    }
  ],
  examples: [
    {
      title: 'What a bed net does',
      q: 'A child receives about 20 infectious bites in a season, each with a 10 % chance of causing infection. A treated net cuts the bites by 70 %. How does the chance of infection change, and why do neighbours benefit?',
      steps: [
        'Without a net: $P = 1 - 0.9^{20} = 0.88$ — an 88 % chance.',
        'With the net: $20 \\times 0.3 = 6$ bites, $P = 1 - 0.9^{6} = 0.47$.',
        'The insecticide also kills many of the mosquitoes that try to feed, so fewer survive the 10–14 days the parasite needs: the number of infectious mosquitoes falls for the whole village.',
        'When most households use nets, even the children without one receive fewer infectious bites.'
      ],
      a: 'From about 88 % to about 47 % for the child, with extra protection for the community.'
    },
    {
      title: 'Fever after a safari',
      q: 'A woman develops fever, headache and aches 12 days after returning from Kenya. She took no preventive tablets. What should happen?',
      steps: [
        'Twelve days fits the incubation of falciparum malaria (at least 7 days after the first infectious bite).',
        'She needs a malaria test that day — a blood film and a rapid test — and must mention the trip; a negative result is repeated if the fever continues.',
        'If positive, treatment starts at once: artemisinin-based tablets for uncomplicated malaria, injected artesunate in hospital for severe malaria.',
        'Warning signs such as confusion, breathlessness or dark urine mean calling the emergency number rather than waiting.'
      ],
      a: 'A same-day malaria test, with treatment started immediately if positive.'
    }
  ],
  quiz: [
    { q: 'Why does the lifespan of mosquitoes matter so much for malaria transmission?', choices: ['the parasite needs about 10–14 days to develop inside the mosquito before its bite is infectious', 'older mosquitoes bite harder', 'young mosquitoes cannot fly', 'the parasite dies in older mosquitoes'], a: 0,
      why: 'Most mosquitoes die within a couple of weeks, so only those that survive the parasite\'s development can transmit. Anything that shortens their lives — like insecticide on nets — cuts transmission sharply.' },
    { q: 'A traveller develops a fever 3 weeks after returning from sub-Saharan Africa. What should happen?', choices: ['a malaria test the same day, telling the doctor about the trip', 'wait a few days to see whether it is flu', 'take leftover antibiotics', 'nothing, because malaria only starts during the trip'], a: 0,
      why: 'Falciparum malaria usually appears within three months of return and can become severe within a day. Antibiotics do not treat it.' },
    { q: 'Each infectious bite has a 20 % chance of causing infection. What is the chance, in per cent, of at least one infection after 5 infectious bites?', answer: 67.2,
      why: '$1 - 0.8^5 = 1 - 0.328 = 0.672$, about 67 %.' },
    { q: 'Bed nets protect only the people who sleep under them.', a: false,
      why: 'The insecticide kills mosquitoes that land on the net, so fewer live long enough to become infectious, which protects the whole community.' },
    { q: 'Why is falciparum malaria more dangerous than the other kinds?', choices: ['infected red cells become sticky and block small vessels in the brain and other organs', 'it infects the lungs directly', 'it is spread by a different insect', 'it cannot be treated'], a: 0,
      why: 'Sticky infected cells clog small vessels, causing cerebral malaria and organ failure; falciparum also multiplies to very high levels.' }
  ],
  applications: [
    'Insecticide-treated bed nets and indoor spraying.',
    'Rapid diagnostic tests used by community health workers.',
    'Malaria vaccines for young children in malaria regions.',
    'Advice and preventive medicines for travellers.'
  ],
  history: 'Alphonse Laveran saw malaria parasites in human blood in 1880, and Ronald Ross showed in 1897–98 that mosquitoes carry them. Quinine, from the bark of the cinchona tree, was used from the 17th century. In 1972 Tu Youyou isolated artemisinin from sweet wormwood, a remedy described in ancient Chinese texts (Nobel Prize 2015).',
  sim: 'inf-malaria'
},

/* ================================================================ sepsis */
{
  id: 'sepsis', parent: 'infectious-diseases', title: 'Sepsis', level: 2,
  short: 'Sepsis is the body\'s response to an infection spiralling out of control and injuring its own organs. It can follow any infection, develop within hours and kill — so recognising the warning signs and getting emergency care fast saves lives.',
  keywords: ['sepsis', 'septic shock', 'blood poisoning', 'septicaemia', 'organ failure', 'warning signs of sepsis', 'qSOFA', 'early warning score', 'NEWS2', 'lactate', 'meningococcal', 'non-blanching rash', 'shock index', 'post-sepsis syndrome', 'Surviving Sepsis Campaign'],
  prereq: ['innate-immunity', 'blood-pressure', 'microbes-types'],
  related: ['antibiotics', 'vital-signs', 'pneumonia', 'uti', 'bleeding-shock', 'thermoregulation', 'acute-kidney-injury', 'antimicrobial-resistance', 'first-aid-basics'],
  body: `
> [!warn] **Could this be sepsis?** Sepsis can follow any infection — a chest or urine infection, a cut, flu, an infection after childbirth or surgery. Call your local emergency number if someone who is unwell with an infection has any of these:
> - new confusion, slurred speech, or is very drowsy or hard to wake;
> - very fast breathing or severe breathlessness;
> - skin that is mottled, bluish, grey or very pale, or a rash that does not fade when a glass is pressed firmly against it;
> - uncontrollable shivering or severe muscle pain, with a high or an unusually low temperature;
> - no urine all day;
> - a feeling that something is terribly wrong.
>
> In babies and young children also: fast or grunting breathing, a fit, being floppy or hard to wake, not feeding, a weak or high-pitched cry, cold hands and feet with a fever, or no wet nappy for 12 hours. Trust your instinct, say "I am worried this could be sepsis" — and call your local emergency number.

A 72-year-old man has had a urine infection for two days. When his daughter visits she finds him muddled, breathing fast, cold and blotchy; he has not passed urine since the morning. She calls an ambulance and says she is worried about sepsis. In hospital his blood pressure is 88/50 mmHg and his lactate 4.5 mmol/L. Within the hour he has blood cultures taken, antibiotics and fluids through a drip; over the next week he recovers. A few hours' more delay could have cost his life.

### What sepsis is
Normally the response to an infection stays local: inflammation — redness, swelling, heat, pus — walls it off ([[innate-immunity]]). In sepsis the response becomes body-wide and disordered. Signalling molecules flood the blood; small vessels widen and leak, so blood pressure falls and tissues swell; clotting is switched on in tiny vessels while clotting factors are used up; and cells struggle to use oxygen. Organs begin to fail: the kidneys (little urine), the brain (confusion), the lungs (fast breathing, low oxygen), the liver and the heart. The international definition since 2016 (Sepsis-3) is *life-threatening organ dysfunction caused by a dysregulated host response to infection*. In **septic shock** the circulation is so disturbed that medicines (vasopressors) are needed to keep the mean arterial pressure at 65 mmHg or more, and lactate stays above 2 mmol/L (18 mg/dL) despite fluids; more than four in ten people with septic shock die in hospital.

The source is most often pneumonia, then the urinary tract, the abdomen and the skin; the cause is usually bacterial, but viruses such as influenza and SARS-CoV-2, fungi and malaria can do it too. The risk is highest in babies, older people, people with weakened immune systems (chemotherapy, no spleen, long-term steroids), diabetes or long-term illness, after surgery, and in pregnancy and just after birth — but previously healthy people are not spared. Meningococcal disease can cause sepsis and [[microbes-types|meningitis]] together in young, healthy people within hours.

The Global Burden of Disease study estimated 48.9 million cases of sepsis and 11 million deaths in 2017 — about one death in five worldwide — with some 20 million cases in children under five and the heaviest burden in low- and middle-income countries.

### Recognising it in hospital
There is no single test. Nurses and doctors combine the vital signs — breathing rate, oxygen saturation, blood pressure, pulse, temperature, alertness — into **early-warning scores** that trigger urgent review. The *quick SOFA* gives a point each for a breathing rate of 22 or more a minute, altered mental state and a systolic pressure of 100 mmHg or less; two or more flag a higher risk of death, although it is a prompt rather than a screening test. A raised **lactate** in the blood shows tissues short of oxygen. The **shock index**, heart rate divided by systolic pressure, is normally about 0.5–0.7; near or above 1 the circulation is struggling.

### Treatment: the first hours
International guidance (Surviving Sepsis Campaign, 2021) asks that when septic shock or sepsis is likely, antibiotics are given as soon as possible, ideally within an hour: blood cultures are taken first — but without delaying the antibiotics — lactate is measured, fluids are given rapidly into a vein if blood pressure is low or lactate high, and vasopressors such as noradrenaline (norepinephrine) are added if the pressure stays low. The source is dealt with: an abscess drained, an infected line removed. Observational studies link each hour of delay in antibiotics for septic shock with a higher risk of death.

### After sepsis
Many survivors have lasting problems for months — exhaustion, weakness, poor sleep, trouble with memory and concentration, anxiety or low mood — sometimes called post-sepsis syndrome, and a higher chance of returning to hospital. Recovery is gradual, and support helps. Prevention starts earlier: vaccines against pneumococcus, meningococcus, influenza and COVID-19, clean hands and wound care, safe childbirth, and prompt treatment of infections.
`,
  ideas: [
    'Sepsis is organ dysfunction caused by the body\'s disordered response to an infection — any infection.',
    'The warning signs are confusion, fast breathing, mottled or pale skin, no urine, extreme shivering or pain, and a feeling that something is very wrong.',
    'It is an emergency: call your local emergency number and say you are worried about sepsis.',
    'In hospital, cultures, antibiotics within the first hour, fluids, vasopressors and source control save lives.',
    'Survivors often need months to recover; vaccines and prompt treatment of infections prevent sepsis.'
  ],
  pitfalls: [
    'Sepsis is an infection of the blood — Bacteria are often not found in the blood at all; sepsis is the body\'s reaction to an infection anywhere, injuring the organs.',
    'Without a high fever it cannot be sepsis — Some people, especially older people and babies, have a normal or low temperature; confusion, fast breathing and mottled skin matter more.',
    'Only people already in hospital get sepsis — Most sepsis starts at home, from ordinary infections of the chest, urine, skin or abdomen.'
  ],
  formulas: [
    {
      name: 'Shock index',
      expr: 'SI = HR/SBP', tex: '\\text{SI} = \\frac{\\text{HR}}{\\text{SBP}}',
      vars: {
        SI: { name: 'shock index', tex: '\\text{SI}' },
        HR: { name: 'heart rate (beats/min)', value: 118, tex: '\\text{HR}' },
        SBP: { name: 'systolic blood pressure (mmHg)', value: 92, tex: '\\text{SBP}' }
      },
      note: 'An empirical bedside ratio for adults, declared without units because it is not a physical law. Normal is about 0.5–0.7; values near or above 1 suggest the circulation is struggling, as in sepsis or bleeding. It is one clue among many, not a diagnosis, and children have different normal values.',
      practice: { unknowns: ['SI', 'HR'] },
      stories: {
        SI: 'A man with pneumonia has a heart rate of {HR} beats a minute and a systolic pressure of {SBP} mmHg. What is his shock index?',
        HR: 'A woman\'s systolic pressure is {SBP} mmHg and her shock index {SI}. What is her heart rate?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading the numbers',
      q: 'The 72-year-old man in the story arrives with a breathing rate of 28 a minute, new confusion, blood pressure 88/50 mmHg, heart rate 118 and lactate 4.5 mmol/L. What do the numbers say?',
      steps: [
        'Quick SOFA: breathing rate ≥ 22, altered mental state and systolic ≤ 100 — 3 points out of 3.',
        'Mean arterial pressure: $50 + (88 - 50)/3 = 62.7$ mmHg, below the target of 65 ([[blood-pressure]]).',
        'Shock index: $118/88 = 1.34$ — well above 1.',
        'Lactate 4.5 mmol/L (about 41 mg/dL) — more than twice the upper limit of 2 mmol/L (18 mg/dL); reference ranges vary between laboratories.',
        'Together: likely septic shock. Cultures, antibiotics within the hour, fluids and, if the pressure stays low, a vasopressor.'
      ],
      a: 'Every marker points to septic shock: an emergency to be treated within the hour.'
    },
    {
      title: 'Is it just flu?',
      q: 'A 19-year-old student has had a fever and vomiting since the morning. By evening her legs ache, her hands and feet are cold, and her flatmate notices a few purple spots on her legs that do not fade under a pressed glass. What should the flatmate do?',
      steps: [
        'Fever with cold hands and feet, leg pain and a rash that does not fade are warning signs of meningococcal sepsis, which can kill within hours.',
        'Call the local emergency number at once — do not wait for a headache, stiff neck or more spots.',
        'In hospital, antibiotics are given immediately; in some countries doctors outside hospital give a first dose before transfer.',
        'Close contacts are offered preventive antibiotics, and meningococcal vaccines prevent most cases.'
      ],
      a: 'Call the emergency number immediately: this could be meningococcal sepsis.'
    }
  ],
  quiz: [
    { q: 'Sepsis is best described as…', choices: ['the body\'s response to an infection injuring its own organs', 'an infection confined to the blood', 'a type of food poisoning', 'an allergic reaction to antibiotics'], a: 0,
      why: 'Sepsis is defined by organ dysfunction caused by a disordered response to infection; the infection itself can be anywhere.' },
    { q: 'An elderly woman with a urine infection becomes newly confused and is breathing fast. What should her family do?', choices: ['call the local emergency number and say they are worried about sepsis', 'give paracetamol and check again tomorrow', 'wait until she develops a fever', 'start leftover antibiotics at home'], a: 0,
      why: 'New confusion and fast breathing with an infection are warning signs of sepsis. Waiting costs time that matters; saying the word "sepsis" helps responders prioritise.' },
    { q: 'A patient has a heart rate of 120 beats a minute and a systolic pressure of 96 mmHg. What is the shock index?', answer: 1.25,
      why: '$120/96 = 1.25$ — above 1, a sign that the circulation is under strain.' },
    { q: 'Sepsis only follows serious infections that are already being treated in hospital.', a: false,
      why: 'Most sepsis begins at home, from common infections of the chest, urinary tract, skin or abdomen — which is why the public needs to know the signs.' },
    { q: 'Why are blood cultures taken before the first antibiotic dose, but without delaying it?', choices: ['antibiotics can make cultures negative, hiding the microbe — yet every hour of delay in treatment is dangerous', 'antibiotics disturb blood-pressure readings', 'cultures are needed before fluids can be given', 'it is a tradition without a reason'], a: 0,
      why: 'Cultures identify the microbe and its sensitivities so treatment can be narrowed, but they must not hold up antibiotics in someone who may be in septic shock.' }
  ],
  applications: [
    'Recognising sepsis early at home, in ambulances and on hospital wards.',
    'Early-warning scores that call senior clinicians to deteriorating patients.',
    'Hospital sepsis pathways: cultures, antibiotics, fluids and source control within hours.',
    'Follow-up and rehabilitation for sepsis survivors.'
  ],
  history: 'The word sepsis comes from the Greek for decay. In 2016 the Sepsis-3 task force redefined it around organ dysfunction, and in 2017 the World Health Assembly made sepsis a global health priority.'
},

/* ================================================================ epidemics and pandemics */
{
  id: 'epidemics', parent: 'infectious-diseases', title: 'Epidemics and pandemics', level: 3,
  short: 'An epidemic is a rise in cases above what is expected; a pandemic is one that spreads around the world. Their course follows simple mathematics — reproduction numbers, doubling times, herd immunity and overshoot — which is why small changes in transmission, made early, decide how large an outbreak becomes.',
  keywords: ['epidemic', 'pandemic', 'outbreak', 'endemic', 'SIR model', 'reproduction number', 'effective reproduction number', 'Rt', 'herd immunity threshold', 'final size', 'overshoot', 'flatten the curve', 'doubling time', 'serial interval', 'case fatality ratio', 'infection fatality ratio', 'contact tracing', 'pandemic preparedness', 'International Health Regulations'],
  prereq: ['infection-spread', 'vaccines', 'math:differential-equations-intro', 'math:exponential-growth-decay'],
  related: ['epidemiology', 'influenza-covid', 'hiv', 'malaria', 'tuberculosis', 'math:logistic-equation', 'reading-health-news'],
  body: `
In March 2020, in many countries, confirmed COVID-19 cases were doubling about every three days. At that speed a week's hesitation means five times as many cases, and two weeks twenty-five times. Epidemics punish delay, and the reason is arithmetic. The same arithmetic explains why outbreaks peak before everyone is infected, why they overshoot, and why a vaccine does not need to reach every last person to stop one.

**Endemic** diseases are always present at a roughly steady level, like malaria in much of Africa; an **outbreak** is a local rise; an **epidemic** a larger one; a **pandemic** an epidemic across the world.

| Pandemic | When | Deaths (approximate estimates) |
|---|---|---|
| Plague (the Black Death) | 1347–1351 | a third to a half of Europe's people |
| Cholera (seven pandemics) | from 1817; the seventh since 1961 | millions |
| Influenza | 1918–1920 | about 50 million (estimates range from 17 to 100 million) |
| HIV/AIDS | from 1981 | about 42 million by 2023 (UNAIDS) |
| Influenza H1N1 | 2009–2010 | about 150,000–575,000 in the first year (CDC) |
| COVID-19 | from 2020 | over 7 million reported; WHO estimated 14.9 million excess deaths in 2020–2021 |

### The SIR model
The simplest model splits a population of $N$ people into the **S**usceptible, the **I**nfectious and the **R**ecovered (immune):

$$\\frac{dS}{dt} = -\\beta \\frac{S I}{N}, \\qquad \\frac{dI}{dt} = \\beta \\frac{S I}{N} - \\gamma I, \\qquad \\frac{dR}{dt} = \\gamma I$$

Here $\\beta$ is the transmission rate, $1/\\gamma$ the infectious period and $R_0 = \\beta/\\gamma$ ([[math:differential-equations-intro|differential equations]]). As people become immune, each case finds fewer susceptible people, so the **effective reproduction number** falls: $R_e = R_0 \\cdot S/N$, reduced further by anything that cuts transmission. Cases grow while $R_e > 1$ and **peak exactly when the susceptible share falls to $1/R_0$** — the herd immunity threshold $H = 1 - 1/R_0$. But at the peak many people are still infectious, and they infect others on the way down: the epidemic **overshoots**. Without any control the final share infected, $z$, satisfies $z = 1 - e^{-R_0 z}$: for $R_0 = 2.5$ that is 89 %, although 60 % would have been enough for herd immunity. The first simulation below runs this model with distancing and vaccination; the second shows why real outbreaks, driven by chance and superspreading, often fizzle out before the mathematics of averages takes over.

### Measuring an epidemic
In real time, epidemiologists estimate $R_t$ from how fast cases grow, the **doubling time**, and the **serial interval** — the gap between symptoms in one person and in the person they infected. Severity is slippery: the **case fatality ratio** (deaths ÷ confirmed cases) early in an outbreak can be too high, because mild cases are missed, and too low, because deaths lag behind cases; the **infection fatality ratio** counts all infections, detected or not, and needs antibody surveys. Surveillance combines testing, hospital data, wastewater monitoring and counts of excess deaths.

### Controlling an epidemic

| Infection | $R_0$ (typical estimates) | Herd immunity threshold |
|---|---|---|
| Measles | 12–18 | 92–94 % |
| Chickenpox | 10–12 | 90–92 % |
| Polio, smallpox | 5–7 | 80–86 % |
| COVID-19 (2020 strain) | 2.5–3 | 60–67 % |
| Ebola | 1.5–2.5 | 33–60 % |
| Seasonal influenza | about 1.3 | about 23 % |

$R_0$ depends on the setting as well as the microbe, so these are rough guides. Every control measure lowers $R_e$ through one of its factors: vaccination shrinks the susceptible share; testing, isolation and contact tracing shorten the time an infectious person mixes; distancing, masks and ventilation cut contacts and the chance per contact; treatment shortens illness; travel measures buy time. Because growth is exponential, measures taken early achieve far more than the same measures taken late, and "flattening the curve" both protects hospitals from overload and reduces the overshoot. Every measure also has social and economic costs, and choosing among them is a decision for societies, informed by the evidence.

Preparedness is international: under the International Health Regulations (2005) countries report unusual outbreaks, and WHO can declare a *public health emergency of international concern*, as it did for COVID-19 in January 2020 and for mpox in 2022 and 2024. In May 2025 the World Health Assembly adopted a Pandemic Agreement on preparedness and fair sharing of vaccines and medicines. Because most new infections come from animals, watching animal diseases is part of preparedness too — the One Health approach.

> [!tip] In an outbreak, the most useful things one person can do are to follow guidance from national public-health agencies or WHO, keep vaccinations up to date, stay home when ill, and help protect the people most at risk.
`,
  ideas: [
    'Outbreaks grow while the effective reproduction number R_e = R₀ × (susceptible share) × (1 − reduction from measures) is above 1.',
    'An unchecked epidemic peaks when the susceptible share falls to 1/R₀ — the herd immunity threshold — and then overshoots it.',
    'Exponential growth makes timing decisive: a week\'s delay can multiply cases several-fold.',
    'Severity measured early is uncertain in both directions: mild cases are missed and deaths lag behind cases.',
    'Vaccination, isolation and tracing, distancing, masks and ventilation each lower a different factor of R.'
  ],
  pitfalls: [
    'Once herd immunity is reached, infections stop — Reaching the threshold only means cases start to fall; the people still infectious keep infecting others, so the epidemic overshoots.',
    'Flattening the curve only delays the same number of infections — Keeping transmission down while vaccines and treatments arrive, and avoiding overshoot, reduces the total infected as well as the peak.',
    'Case fatality ratios reported in the first weeks tell you how deadly a new disease is — Missed mild cases inflate them and delayed deaths deflate them; they settle only as testing widens and time passes.'
  ],
  formulas: [
    {
      name: 'Effective reproduction number',
      expr: 'Re = R0*s*(1 - c)', tex: 'R_e = R_0 \\, s \\, (1 - c)',
      vars: {
        Re: { name: 'effective reproduction number', tex: 'R_e' },
        R0: { name: 'basic reproduction number', value: 3, tex: 'R_0' },
        s: { name: 'share of people still susceptible', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: 's' },
        c: { name: 'cut in transmission from measures', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'c' }
      },
      note: 'Assumes random mixing. Immunity from infection or vaccination lowers s; distancing, masks, ventilation and isolation raise c. The outbreak shrinks when R_e < 1.',
      practice: { unknowns: ['Re', 'c'] },
      stories: {
        Re: 'An infection has R₀ = {R0}; {s} of people are still susceptible, and measures cut transmission by {c}. What is the effective reproduction number?',
        c: 'With R₀ = {R0} and {s} still susceptible, by how much must transmission be cut to bring R_e down to {Re}?'
      }
    },
    {
      name: 'Herd immunity threshold',
      expr: 'H = 1 - 1/R0', tex: 'H = 1 - \\frac{1}{R_0}',
      vars: {
        H: { name: 'share that must be immune', q: 'ratio', unit: '%', tex: 'H' },
        R0: { name: 'basic reproduction number', value: 2.5, min: 1, tex: 'R_0' }
      },
      note: 'The share immune at which each case infects, on average, exactly one other. It is also the point at which an uncontrolled epidemic peaks.',
      practice: { unknowns: ['H', 'R0'] },
      stories: {
        H: 'An infection has R₀ = {R0}. What share of the population must be immune to stop it spreading?',
        R0: 'Outbreaks of an infection stop growing once {H} of people are immune. What is its R₀?'
      }
    },
    {
      name: 'Final size of an uncontrolled epidemic',
      expr: 'z = 1 - exp(-R0*z)', tex: 'z = 1 - e^{-R_0 z}',
      vars: {
        z: { name: 'share of the population eventually infected', q: 'ratio', unit: '%', min: 0.1, max: 100, tex: 'z' },
        R0: { name: 'basic reproduction number', value: 2.5, min: 1.01, max: 30, tex: 'R_0' }
      },
      solveFor: 'z',
      note: 'For the SIR model with no immunity at the start and no control measures. z appears on both sides, so the calculator finds it numerically. Compare z with the herd immunity threshold 1 − 1/R₀ to see the overshoot.',
      practice: { unknowns: ['z', 'R0'] },
      stories: {
        z: 'An infection with R₀ = {R0} spreads through a population with no immunity and no control measures. What share will eventually have been infected?',
        R0: 'In an uncontrolled outbreak {z} of the population was eventually infected. What R₀ does that imply?'
      }
    }
  ],
  examples: [
    {
      title: 'A week\'s delay',
      q: 'Cases are doubling every 3 days. By what factor do they grow if measures start one week later — or two weeks later?',
      steps: [
        'Growth factor over time $t$: $2^{t/T_d}$.',
        'One week: $2^{7/3} = 5.0$.',
        'Two weeks: $2^{14/3} = 25.4$.',
        'Everything downstream — hospital admissions, intensive-care beds, deaths — scales with those numbers a week or two later.'
      ],
      a: 'About 5 times more cases after one week of delay, about 25 times after two.'
    },
    {
      title: 'Overshoot',
      q: 'An infection has $R_0 = 2.5$. What share must be immune for herd immunity, and what share will be infected if nothing is done?',
      steps: [
        'Herd immunity threshold: $1 - 1/2.5 = 60\\%$.',
        'Final size: solve $z = 1 - e^{-2.5 z}$; by repeated substitution or the calculator, $z = 0.893$.',
        'Overshoot: $89\\% - 60\\% = 29\\%$ of the population infected after the peak, when herd immunity had already been reached.',
        'Measures that held R at 1.5 throughout would give a final size of 58 % — and, together with vaccination, far fewer.'
      ],
      a: '60 % is enough for herd immunity, but an unchecked epidemic infects about 89 %.'
    },
    {
      title: 'How much must transmission fall?',
      q: 'An infection has $R_0 = 3$, and 40 % of people are already immune. What is $R_e$, and what cut in transmission would bring it to 1?',
      steps: [
        '$R_e = 3 \\times 0.6 = 1.8$.',
        'With a 30 % cut: $1.8 \\times 0.7 = 1.26$ — still growing.',
        'To reach 1: $1 - c = 1/1.8$, so $c = 44\\%$.'
      ],
      a: 'R_e = 1.8; transmission must fall by about 44 % to stop growth.'
    }
  ],
  quiz: [
    { q: 'In the SIR model, when does the number of infectious people peak?', choices: ['when the share still susceptible falls to 1/R₀ — the herd immunity threshold', 'when everyone has been infected', 'when exactly half the population has been infected', 'on a fixed day set by the infectious period'], a: 0,
      why: 'Infections grow while $R_0 \\cdot S/N > 1$. The turning point is $S/N = 1/R_0$; after it each case infects fewer than one other.' },
    { q: 'An infection has R₀ = 4, and half the population is immune; there are no other measures. What is the effective reproduction number?', answer: 2,
      why: '$R_e = R_0 \\times S/N = 4 \\times 0.5 = 2$.' },
    { q: 'Once herd immunity is reached, new infections stop immediately.', a: false,
      why: 'The people who are infectious at that moment still infect others, only fewer than one each; the epidemic declines but overshoots the threshold.' },
    { q: 'Early in a new outbreak, the case fatality ratio (deaths ÷ confirmed cases) usually…', choices: ['is uncertain in both directions: missed mild cases make it too high and deaths that lag behind cases make it too low', 'equals the infection fatality ratio', 'is always too low', 'cannot be calculated at all'], a: 0,
      why: 'Both biases act at once, which is why early severity estimates change so much as testing widens and time passes.' },
    { q: 'Cases double every 4 days. By what factor do they grow in 20 days?', answer: 32,
      why: '20 days is 5 doublings: $2^5 = 32$.' }
  ],
  applications: [
    'Planning hospital and intensive-care capacity during waves of infection.',
    'Setting vaccination targets and planning campaigns.',
    'Surveillance, including wastewater testing and excess-death monitoring.',
    'International rules for reporting outbreaks (the International Health Regulations).'
  ],
  history: 'Ronald Ross built mathematical models of malaria transmission in the early 1900s, and in 1927 William Kermack and Anderson McKendrick published the SIR model and its threshold theorem — the idea that an epidemic can only grow when the susceptible share exceeds a critical level.',
  sim: ['inf-sir', 'inf-network']
}

);
