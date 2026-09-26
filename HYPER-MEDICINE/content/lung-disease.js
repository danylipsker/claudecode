/* HYPER-MEDICINE · content/lung-disease.js — Lung disease:
 * asthma, COPD, pneumonia, pulmonary embolism and sleep apnoea.
 * Simulations in sims/respiratory.js. */
Hyper.add(

{
  id: 'asthma', parent: 'lung-disease', title: 'Asthma', level: 1,
  short: 'A long-term condition in which inflamed, over-sensitive airways narrow in response to triggers, causing wheeze, breathlessness, chest tightness and cough that come and go. Regular anti-inflammatory treatment prevents most attacks; a severe attack is an emergency.',
  keywords: ['asthma', 'wheeze', 'asthma attack', 'bronchospasm', 'reliever', 'preventer', 'inhaled corticosteroid', 'ICS-formoterol', 'salbutamol', 'albuterol', 'peak flow', 'spacer', 'triggers', 'eosinophils', 'GINA', 'asthma action plan'],
  prereq: ['ventilation', 'lung-function-tests', 'allergy'],
  related: ['copd', 'anaphylaxis', 'innate-immunity', 'physics:viscosity', 'math:power-functions', 'environmental-health'],
  body: `
Maya is nine. Halfway through football practice on a cold evening she starts to cough and cannot catch her breath; her chest feels tight and there is a whistle when she breathes out. Her coach knows her plan: he sits her down, helps her use her reliever inhaler through a spacer, and within minutes her breathing eases. The next week her doctor reviews the plan — because an attack is a sign that the inflammation underneath needs attention, not just the tightening on top.

### What happens in the airways
Asthma is a long-term condition of the airways in which three things narrow the bronchioles, to different degrees in different people and at different times:

1. **Bronchoconstriction**: the smooth muscle around the small airways tightens within minutes of a trigger. Reliever medicines (bronchodilators) relax it within minutes.
2. **Inflammation**: the lining swells and fills with immune cells — in many people the *type 2* pattern of eosinophils, allergy antibodies (IgE) and mast cells ([[allergy]]). It builds over days and settles over days to weeks with inhaled corticosteroids.
3. **Mucus**: thick secretions plug the smallest airways, especially in severe attacks.

Inflamed airways are **hyperresponsive**: they tighten far more than healthy ones to the same cold air, smoke or allergen. Over years, poorly controlled inflammation can thicken the airway wall for good.

The effect is dramatic because the resistance of a tube rises with the fourth power of its narrowing ([[physics:viscosity|Poiseuille's law]]): an airway that loses a fifth of its radius has 2.4 times the resistance, and one that loses half has sixteen times ([[math:power-functions|power functions]]). The wheeze is air squeezed through narrowed tubes. It is loudest on breathing out, when the airways are narrower still, and air becomes trapped behind them.

### Triggers
Colds and other viral infections (the commonest trigger of attacks, especially in children), house-dust mites, pollen, animal dander and moulds, tobacco smoke, air pollution, cold air, exercise, strong smells, dusts and fumes at work, and in some people certain medicines — aspirin and similar painkillers in a minority of adults, and beta-blockers, including eye drops. Knowing one's triggers helps, but treatment, not avoidance alone, is the mainstay. Sudden wheeze with swelling of the lips or face, hives or faintness after a food, sting or medicine may be [[anaphylaxis]], a different emergency.

### How common it is
Asthma affected an estimated 262 million people and caused about 455,000 deaths in 2019 (WHO, from the Global Burden of Disease study). It usually starts in childhood but can begin at any age. Most asthma deaths occur in low- and lower-middle-income countries, where diagnosis is often missed and inhaled corticosteroids are often unavailable or unaffordable; everywhere, many deaths are judged preventable.

### Diagnosis
The diagnosis rests on a typical pattern — wheeze, breathlessness, chest tightness and cough that vary over time and in intensity, often worse at night, early in the morning or with triggers — plus evidence that the narrowing is **variable**: a clear response to a bronchodilator on [[lung-function-tests|spirometry]], peak-flow readings that swing from day to day, or a positive challenge test. Not all wheeze is asthma: COPD, heart failure, an inhaled object and vocal-cord problems can mimic it.

### Treatment: control the inflammation
The Global Initiative for Asthma (GINA, updated every year) recommends that **every adult and adolescent with asthma receive treatment containing an inhaled corticosteroid**. A short-acting reliever alone (such as salbutamol, called albuterol in the US) is no longer recommended for them: it eases symptoms but leaves the inflammation untouched, and heavy reliance on it is linked to severe attacks and death. GINA's preferred approach uses one inhaler that combines a corticosteroid with formoterol, a bronchodilator that acts quickly and lasts: it serves as the reliever and, when asthma is more persistent, as the daily treatment too. The alternative is a regular inhaled corticosteroid with a separate reliever. Severe asthma has add-on medicines and biological treatments that block particular inflammatory signals (IgE, interleukin-5, interleukin-4 and -13, TSLP). Children's treatment differs, and the details — which inhaler, when and how much — belong in a written **asthma action plan** agreed with a doctor, nurse or pharmacist.

As important: a good inhaler technique (most people make mistakes; a spacer helps), not smoking, vaccination against influenza and COVID-19, and a review after every attack. With good treatment most people with asthma live without limits; many top athletes have it.

> [!warn] **An asthma attack is an emergency when** the reliever is not helping or its effect does not last; the person is too breathless to speak in full sentences, eat or sleep; breathing is getting faster and they feel they cannot catch their breath; lips, tongue or fingertips turn blue or grey (in darker skin, look at the lips and gums); they become drowsy, confused or exhausted; or the peak flow falls below the danger level on their action plan. A chest that goes quiet in someone struggling to breathe is a bad sign, not a good one. Call your local emergency number; while you wait, sit the person upright and help them use their reliever as their action plan or the emergency dispatcher advises.
`,
  ideas: [
    'Asthma narrows the airways in three ways: muscle tightening (fast, reversed by relievers), inflammation (slow, reduced by inhaled corticosteroids) and mucus.',
    'Airway resistance rises with the fourth power of narrowing: a fifth less radius gives 2.4 times the resistance, half the radius sixteen times.',
    'The hallmark is variability: symptoms and airflow that change over time, with triggers and with treatment.',
    'GINA recommends treatment containing an inhaled corticosteroid for every adult and adolescent with asthma; reliever-only treatment is no longer advised for them.',
    'A written action plan and knowing the danger signs of an attack save lives.'
  ],
  pitfalls: [
    'The reliever is the real treatment — It opens the airways for a few hours but does nothing for the inflammation; needing it often means asthma is not controlled.',
    'If the wheeze gets quieter, the attack is easing — In someone still struggling to breathe, a quiet chest may mean too little air is moving to make a sound: an emergency.',
    'People with asthma should avoid exercise — Well-controlled asthma allows full activity; symptoms with exercise are a reason to review treatment, not to stop moving.'
  ],
  formulas: [
    {
      name: 'Airway narrowing and resistance (Poiseuille)',
      expr: 'Rrel = 1/x^4', tex: 'R_{\\text{rel}} = \\frac{1}{x^4}',
      vars: {
        Rrel: { name: 'resistance compared with normal (times)', tex: 'R_{\\text{rel}}' },
        x: { name: 'airway radius as a share of normal', q: 'ratio', unit: '%', value: 80, min: 1, max: 100 }
      },
      note: 'For smooth (laminar) flow through one tube of fixed length, resistance ∝ 1/r⁴. The air flow at the same effort falls in proportion: to 41 % at four-fifths of the radius.',
      stories: { Rrel: 'Inflammation and muscle tightening narrow an airway to {x} of its normal radius. How many times its normal resistance does it now have?', x: 'An airway has {Rrel} times its normal resistance. To what share of its normal radius has it narrowed?' }
    },
    {
      name: 'Peak flow as a share of personal best',
      expr: 'p = PEF/best', tex: 'p = \\frac{\\text{PEF}}{\\text{PEF}_{\\text{best}}}',
      vars: {
        p: { name: 'share of personal best', q: 'ratio', unit: '%' },
        PEF: { name: 'peak flow now', q: 'flowrate', unit: 'L/min', value: 330, tex: '\\text{PEF}' },
        best: { name: 'personal best peak flow', q: 'flowrate', unit: 'L/min', value: 500, tex: '\\text{PEF}_{\\text{best}}' }
      },
      note: 'Many written action plans set their zones as shares of the person\'s best reading — often around 80 % and 50 % — with the actions for each zone agreed with a clinician.',
      stories: { p: 'Someone whose best peak flow is {best} blows {PEF} this morning. What share of their best is that?', PEF: 'A plan says to seek urgent help below {p} of a personal best of {best}. What reading is that?' }
    },
    {
      name: 'Diurnal peak-flow variability',
      expr: 'v = (hi - lo)/((hi + lo)/2)', tex: 'v = \\frac{\\text{PEF}_{\\text{high}} - \\text{PEF}_{\\text{low}}}{\\tfrac{1}{2}\\left(\\text{PEF}_{\\text{high}} + \\text{PEF}_{\\text{low}}\\right)}',
      vars: {
        v: { name: 'daily variability', q: 'ratio', unit: '%' },
        hi: { name: 'highest peak flow of the day', q: 'flowrate', unit: 'L/min', value: 450, tex: '\\text{PEF}_{\\text{high}}' },
        lo: { name: 'lowest peak flow of the day', q: 'flowrate', unit: 'L/min', value: 380, tex: '\\text{PEF}_{\\text{low}}' }
      },
      note: 'GINA: averaged over one to two weeks, a variability above 10 % in adults (13 % in children) supports the diagnosis of asthma.',
      practice: { unknowns: ['v', 'lo'] },
      stories: { v: 'Over one day, peak flow ranges from {lo} to {hi}. What is the diurnal variability?', lo: 'The day\'s best peak flow is {hi} and the variability {v}. What was the lowest reading?' }
    }
  ],
  examples: [
    {
      title: 'Why a little narrowing matters so much',
      q: 'An airway narrows to 90 %, 80 % and then 60 % of its normal radius. By how much does its resistance rise, and how much air gets through at the same effort?',
      steps: [
        'Resistance scales as $1/x^4$: $1/0.9^4 = 1.52$, $1/0.8^4 = 2.44$, $1/0.6^4 = 7.7$.',
        'At the same pressure the flow scales as $x^4$: 66 %, 41 % and 13 % of normal.',
        'A narrowing too small to see on a scan can halve the air flow — and why relaxing the muscle even a little with a reliever brings such quick relief.'
      ],
      a: 'Resistance 1.5, 2.4 and 7.7 times normal; air flow 66 %, 41 % and 13 % of normal.'
    },
    {
      title: 'A peak-flow diary',
      q: 'Over a fortnight, a 35-year-old with night-time cough records her peak flow morning and evening. On a typical day the lowest reading is 380 L/min and the highest 450 L/min. Does the variability support asthma?',
      steps: [
        'Mean of the two: $(450 + 380)/2 = 415$ L/min.',
        'Variability: $(450 - 380)/415 = 0.169$, i.e. about 17 %.',
        'Averaged over one to two weeks, more than 10 % in an adult supports variable airflow limitation — together with her symptoms, a point in favour of asthma.'
      ],
      a: 'About 17 %: above the 10 % threshold, supporting asthma.'
    },
    {
      title: 'Reading an action plan',
      q: 'A man\'s best peak flow is 480 L/min. During a cold his reading falls to 240 L/min, and his reliever helps for less than an hour. What does that mean?',
      steps: [
        'Share of best: $240/480 = 0.5$, i.e. 50 %.',
        'Many action plans treat a reading around half of the personal best, especially with a reliever that is not lasting, as a severe attack.',
        'This is the point to follow the red part of the plan: urgent medical help, calling the emergency number if the danger signs appear.'
      ],
      a: '50 % of his best with a failing reliever: a severe attack needing urgent help.'
    }
  ],
  quiz: [
    { q: 'A reliever works within minutes, while an inhaled corticosteroid takes days to weeks to reach its full effect. Why?', choices: ['The corticosteroid is absorbed more slowly', 'The reliever relaxes the airway muscle; the corticosteroid calms the inflammation, which takes longer to settle', 'The corticosteroid only works at night', 'The reliever kills the bacteria causing the attack'], a: 1,
      why: 'Muscle relaxes quickly; inflammation — swelling, immune cells and mucus — settles over days to weeks. Both are needed, which is why relievers alone are not enough.' },
    { q: 'If an airway\'s radius halves, its resistance to air flow becomes about…', choices: ['twice as high', 'four times as high', 'eight times as high', 'sixteen times as high'], a: 3,
      why: 'Resistance ∝ 1/r⁴, and 1/0.5⁴ = 16 (Poiseuille).' },
    { q: 'During an asthma attack, the wheeze becoming quieter while the person still struggles to breathe means they are recovering.', a: false,
      why: 'A "silent chest" can mean so little air is moving that there is no sound: a sign of a life-threatening attack. Call the emergency number.' },
    { q: 'Which approach does GINA no longer recommend for adults and adolescents with asthma?', choices: ['A combined corticosteroid–formoterol inhaler used as the reliever', 'A regular inhaled corticosteroid with a separate reliever', 'Treatment with a short-acting reliever alone', 'A written asthma action plan'], a: 2,
      why: 'Reliever-only treatment leaves the inflammation untreated and is linked to severe attacks; since 2019 GINA recommends corticosteroid-containing treatment for all adults and adolescents.' },
    { q: 'Over a day, peak flow ranges from 420 to 500 L/min. What is the diurnal variability, in per cent?', answer: 17.4,
      why: '(500 − 420) / ((500 + 420)/2) = 80/460 ≈ 17.4 %: above the 10 % that supports asthma in adults when averaged over one to two weeks.' }
  ],
  applications: ['Written asthma action plans with peak-flow zones.', 'Inhaler-technique checks by pharmacists and nurses.', 'School and sports policies that keep relievers at hand.', 'Workplace measures against occupational asthma.'],
  sim: ['resp-airway', { id: 'resp-spirometer', params: { pattern: 'asthma' } }]
},

{
  id: 'copd', parent: 'lung-disease', title: 'COPD', level: 2,
  short: 'Chronic obstructive pulmonary disease: lasting narrowing of the airways and destruction of the air sacs, caused mostly by tobacco smoke and by smoke from cooking fires. Lost lung function does not come back, but stopping smoking, rehabilitation, inhalers, vaccines and oxygen make a large difference.',
  keywords: ['COPD', 'chronic obstructive pulmonary disease', 'emphysema', 'chronic bronchitis', 'smoking', 'pack-years', 'biomass smoke', 'household air pollution', 'GOLD', 'exacerbation', 'pulmonary rehabilitation', 'long-term oxygen', 'alpha-1 antitrypsin', 'air trapping', 'FEV1 decline'],
  prereq: ['lung-function-tests', 'gas-exchange', 'smoking'],
  related: ['asthma', 'pneumonia', 'control-of-breathing', 'heart-failure', 'environmental-health', 'vaccines'],
  body: `
Joseph drove a bus for thirty years and smoked for forty. In his late fifties he noticed he was the last one up the stairs, and put it down to age; then came a winter chest infection that took two months to clear. In a village far from his city, Amina has never smoked, but for decades she cooked every meal over a wood fire in a small kitchen, and she too now stops for breath when she carries water. Both have chronic obstructive pulmonary disease.

### What happens in the lungs
COPD is a lasting limitation of air flow, caused by two processes that are usually mixed:

- **Small-airways disease and chronic bronchitis**: years of irritation inflame, scar and narrow the small airways and make their lining pour out mucus — the daily cough with phlegm.
- **Emphysema**: enzymes released by inflammatory cells outpace the lung's protective proteins and digest the walls between alveoli. Neighbouring sacs merge into large, useless spaces, the surface for [[gas-exchange]] shrinks, and the lung loses the elastic recoil that normally holds the small airways open.

Without that recoil the small airways collapse on breathing out and trap air. The lungs over-inflate, the diaphragm is pushed flat and works at a disadvantage, and every breath starts from a fuller chest — which is why breathlessness on exertion is usually the first symptom. Later come frequent chest infections, weight loss, low oxygen levels, and strain on the right side of the heart with swollen ankles.

### Causes
- **Tobacco smoking**, the main cause in high-income countries and a major one everywhere.
- **Household air pollution**: some two billion people still cook over open fires or simple stoves burning wood, dung, crop waste, charcoal or coal (WHO, 2024). In many low- and middle-income countries this is a leading cause, and it falls hardest on women and children ([[environmental-health]]).
- Outdoor air pollution, and **dusts and fumes at work** (mining, farming, construction, textiles).
- **Early life**: prematurity, childhood chest infections, smoking in pregnancy and asthma can leave smaller lungs. A 2015 study of three cohorts found that about half of the people who developed COPD had never reached normal peak lung function as young adults.
- **Alpha-1 antitrypsin deficiency**, an inherited shortage of a protective protein that causes early emphysema, especially in smokers; guidelines advise testing everyone with COPD once.

Susceptibility varies greatly and not every smoker develops COPD, but almost every smoker loses lung function faster than they otherwise would.

### How big a problem
COPD caused about 3.5 million deaths in 2021, about 5 % of all deaths — the fourth leading cause of death worldwide — and nearly 90 % of COPD deaths under the age of 70 occur in low- and middle-income countries (WHO, 2024). It is widely under-diagnosed, because many people accept breathlessness as part of growing old.

### Diagnosis
The GOLD strategy (Global Initiative for Chronic Obstructive Lung Disease) requires [[lung-function-tests|spirometry]]: a post-bronchodilator FEV₁/FVC below 0.70 in someone with symptoms or exposures. Severity is graded by FEV₁ as a percentage of predicted — grade 1 (80 % or more), 2 (50–79 %), 3 (30–49 %), 4 (below 30 %) — and treatment is guided by symptoms and by flare-ups in the past year. Asthma, heart failure, bronchiectasis and lung damage left by tuberculosis must be considered too.

### What helps
Lost lung tissue does not grow back, yet a great deal can be done:

- **Stopping smoking**, the most effective step at any stage: the yearly loss of lung function falls back towards the normal rate of about 30 mL a year. Support combined with medicines (nicotine replacement, varenicline, cytisine, bupropion) greatly improves the chance of success ([[smoking]]).
- **Cleaner air**: better stoves and fuels, ventilation, protection at work.
- **Vaccines** against influenza, pneumococcus, COVID-19, RSV and whooping cough ([[vaccines]]).
- **Pulmonary rehabilitation**: supervised exercise and education, one of the most effective treatments for breathlessness and quality of life.
- **Inhaled medicines**: long-acting bronchodilators of two kinds (antimuscarinics and beta-agonists), often combined; an inhaled corticosteroid is added mainly for people with repeated flare-ups and a high blood eosinophil count. In 2024 a biological medicine (dupilumab) was approved in several countries for some people with frequent flare-ups and type 2 inflammation.
- **Long-term oxygen** for people whose oxygen is severely low at rest — a PaO₂ of 55 mmHg (7.3 kPa) or less, or a saturation of 88 % or less — prolongs life when used for at least 15 hours a day (trials published in 1980 and 1981); for moderately low levels it did not (2016). No smoking or open flames near oxygen: the fire risk is serious.
- Procedures that shrink over-inflated lung, transplantation for a few, and palliative care for breathlessness in advanced disease.

**Flare-ups** (exacerbations) — a few days of worse breathlessness, cough and more or discoloured sputum, usually set off by an infection or pollution — speed the decline and are the main reason for hospital admission. A written self-management plan helps people act early.

> [!warn] For a person with COPD, severe breathlessness at rest, blue or grey lips, new confusion or drowsiness, chest pain, or a rapid worsening that the usual plan does not help are an emergency — call your local emergency number.
`,
  ideas: [
    'COPD combines narrowed, inflamed small airways with emphysema, the destruction of alveolar walls; air is trapped behind collapsing airways.',
    'Tobacco smoke and smoke from household fuels are the main causes; poor lung growth early in life also matters.',
    'Diagnosis needs spirometry: a post-bronchodilator FEV₁/FVC below 0.70.',
    'Stopping smoking at any stage slows the decline back towards the normal rate; lost function does not return.',
    'Rehabilitation, vaccines and inhaled bronchodilators improve life, and long-term oxygen prolongs it when oxygen is severely low at rest.'
  ],
  pitfalls: [
    'Once you have COPD, stopping smoking is pointless — It is the most effective treatment at every stage: the yearly loss slows back towards normal.',
    'COPD is only a smoker\'s disease — Smoke from cooking fuels, dusts at work, air pollution, poor early lung growth and alpha-1 antitrypsin deficiency all cause it.',
    'More oxygen is always better in COPD — Oxygen is essential when levels are low, but in some people high concentrations raise the CO₂; a target range, often 88–92 %, is used.'
  ],
  formulas: [
    {
      name: 'Pack-years',
      expr: 'PY = cpd/20*yrs', tex: '\\text{PY} = \\frac{n_{\\text{day}}}{20} \\times t',
      vars: {
        PY: { name: 'pack-years', tex: '\\text{PY}' },
        cpd: { name: 'cigarettes smoked a day', value: 20, tex: 'n_{\\text{day}}' },
        yrs: { name: 'years of smoking', value: 30, tex: 't' }
      },
      note: 'One pack-year is a pack of 20 cigarettes a day for a year. It measures exposure, not harm: susceptibility varies widely, and years of smoking weigh more than the number per day.',
      stories: { PY: 'Someone smoked {cpd} cigarettes a day for {yrs} years. How many pack-years is that?', yrs: 'Someone with {PY} pack-years smoked {cpd} cigarettes a day. For how many years?' }
    },
    {
      name: 'FEV₁ after years of decline',
      expr: 'F = F0 - rate*t/1000', tex: '\\text{FEV}_1 = \\text{FEV}_{1,0} - \\frac{r\\,t}{1000}',
      vars: {
        F: { name: 'FEV₁ later (L)', tex: '\\text{FEV}_1' },
        F0: { name: 'FEV₁ at the start (L)', value: 4, tex: '\\text{FEV}_{1,0}' },
        rate: { name: 'yearly decline (mL per year)', value: 30, tex: 'r' },
        t: { name: 'years', value: 40 }
      },
      note: 'A straight-line sketch. Healthy adults lose roughly 20–30 mL a year after their mid-twenties; susceptible smokers can lose two to three times as much.',
      stories: { F: 'At 25 someone\'s FEV₁ is {F0} L. If it declines by {rate} mL a year, what will it be after {t} years, in litres?', rate: 'An FEV₁ fell from {F0} L to {F} L over {t} years. What was the yearly decline, in mL?' }
    }
  ],
  examples: [
    {
      title: 'Counting pack-years',
      q: 'Joseph smoked 15 cigarettes a day for 30 years. How many pack-years is that?',
      steps: [
        'Packs a day: $15/20 = 0.75$.',
        'Pack-years: $0.75 \\times 30 = 22.5$.',
        'Pack-years help doctors weigh the risk of COPD and of lung cancer — lung-cancer screening in the US, for example, uses a threshold of 20 pack-years (2021 recommendation). But susceptibility varies, and a low count does not exclude COPD.'
      ],
      a: '22.5 pack-years.'
    },
    {
      title: 'Stopping at 45',
      q: 'At 25 a man\'s FEV₁ is 4.0 L. A never-smoker loses about 30 mL a year; as a susceptible smoker he loses 80 mL a year. Compare his FEV₁ at 65 if he smokes on, or stops at 45 (after which his decline returns to 30 mL a year).',
      steps: [
        'Never smoking: $4.0 - 0.030 \\times 40 = 2.8$ L.',
        'Smoking on: $4.0 - 0.080 \\times 40 = 0.8$ L — a fifth of his peak: very severe COPD.',
        'Stopping at 45: $4.0 - 0.080 \\times 20 = 2.4$ L at 45, then $2.4 - 0.030 \\times 20 = 1.8$ L at 65.',
        'He never gets back the lost 1.0 L, but stopping leaves him with more than twice the lung function he would otherwise have had.'
      ],
      a: '0.8 L if he smokes on; 1.8 L if he stops at 45 (a never-smoker: 2.8 L).'
    },
    {
      title: 'Grading severity',
      q: 'After a bronchodilator, a woman\'s FEV₁/FVC is 0.52 and her FEV₁ 1.6 L, against a predicted 3.9 L. What is her GOLD grade?',
      steps: [
        'The ratio is below 0.70: persistent airflow obstruction.',
        'FEV₁ as a share of predicted: $1.6/3.9 = 0.41$, i.e. 41 %.',
        '30–49 % is GOLD grade 3 (severe). Her treatment will also depend on her symptoms and on how many flare-ups she had in the past year.'
      ],
      a: 'GOLD grade 3 (severe).'
    }
  ],
  quiz: [
    { q: 'A 50-year-old with COPD stops smoking. What happens to her lung function?', choices: ['It returns to normal within a year', 'What was lost stays lost, but the yearly decline slows back towards the normal rate', 'It keeps falling as fast as before, so stopping makes no difference', 'It falls faster, because of withdrawal'], a: 1,
      why: 'Destroyed lung does not regrow, but the extra loss caused by smoking largely stops — which is why stopping helps at any age.' },
    { q: 'Why does air become trapped in the lungs in emphysema?', choices: ['The alveoli are full of fluid', 'The lungs have lost elastic recoil, so the small airways collapse on breathing out', 'The diaphragm is paralysed', 'The trachea is narrowed'], a: 1,
      why: 'Healthy elastic tissue pulls the small airways open; without it they collapse as the chest squeezes during expiration.' },
    { q: 'COPD is caused only by smoking tobacco.', a: false,
      why: 'Household smoke from cooking fuels, work dusts and fumes, air pollution, poor early lung growth and alpha-1 antitrypsin deficiency all cause COPD.' },
    { q: 'For which people with COPD has long-term oxygen been shown to prolong life?', choices: ['Everyone with COPD', 'Anyone who is breathless on exertion', 'People with severely low oxygen at rest, using it at least 15 hours a day', 'People whose oxygen is only moderately low'], a: 2,
      why: 'The trials of 1980–81 showed longer survival with oxygen for at least 15 hours a day when the PaO₂ was 55 mmHg or less; a 2016 trial found no survival benefit for moderate desaturation.' },
    { q: 'Someone smoked 30 cigarettes a day for 20 years. How many pack-years is that?', answer: 30,
      why: '30/20 = 1.5 packs a day × 20 years = 30 pack-years.' }
  ],
  applications: ['Stop-smoking services and medicines.', 'Pulmonary rehabilitation programmes.', 'Clean-cooking programmes in low- and middle-income countries.', 'Long-term oxygen therapy and COPD self-management plans.'],
  sim: ['resp-lung-decline', { id: 'resp-spirometer', params: { pattern: 'copd' } }]
},

{
  id: 'pneumonia', parent: 'lung-disease', title: 'Pneumonia', level: 1,
  short: 'An infection of the lung in which the air sacs fill with fluid and inflammatory cells, so that blood flows through lung that holds no air. It ranges from an illness treated at home to a leading cause of death in young children and older adults.',
  keywords: ['pneumonia', 'chest infection', 'lower respiratory tract infection', 'pneumococcus', 'Streptococcus pneumoniae', 'viral pneumonia', 'aspiration pneumonia', 'consolidation', 'CURB-65', 'fast breathing', 'chest indrawing', 'shunt', 'ARDS', 'pneumococcal vaccine'],
  prereq: ['gas-exchange', 'innate-immunity', 'microbes-types'],
  related: ['antibiotics', 'vaccines', 'sepsis', 'influenza-covid', 'tuberculosis', 'copd'],
  body: `
Mr Haddad is 78. He has no cough and no fever, but his daughter notices he is muddled, off his food and breathing fast; in hospital his oxygen saturation is 88 % and an X-ray shows a white patch low in his right lung. On another continent a toddler with a fever breathes 50 times a minute, the skin below her ribs sucking in with every breath. Both have pneumonia — and both show that it does not always look like "a bad chest infection".

### What happens
Pneumonia is an infection of the lung's air spaces. Microbes arrive in inhaled droplets or, very often, in secretions from the mouth and throat that slip past the defences during sleep, drunkenness or swallowing problems. When they overwhelm the cilia, mucus and macrophages ([[innate-immunity]]), inflammation floods the alveoli with fluid, white cells and fibrin. The affected region becomes solid — **consolidated** — and shows white on an X-ray.

Those alveoli still receive blood but no air, so the blood passes them without picking up oxygen: a **shunt** ([[gas-exchange]]). That is why the oxygen level can fall steeply, and why extra oxygen helps less than it does in asthma; the lung limits the damage by narrowing the arteries to airless areas. Inflammation can spread to the pleura (a sharp pain on breathing in), fluid or pus can collect around the lung, and the infection can spill into the blood and cause [[sepsis]]. In the most severe cases, inflammation across both lungs leads to the acute respiratory distress syndrome (ARDS).

### Causes
- **Bacteria**: the pneumococcus (*Streptococcus pneumoniae*) is the commonest bacterial cause worldwide; others include *Haemophilus influenzae*, *Staphylococcus aureus*, *Mycoplasma* and *Legionella*, which spreads from contaminated water systems.
- **Viruses**: influenza, RSV, SARS-CoV-2 and others ([[influenza-covid]]) — viruses cause many of the pneumonias in young children.
- **Aspiration** of mouth contents, especially after a stroke or with reduced consciousness.
- Unusual organisms in people with weakened immunity; and [[tuberculosis]] can look like pneumonia.

### Who is at risk
Young children — especially those who are malnourished, not breastfed, unvaccinated or breathing smoke from cooking fires — and older adults are most at risk, along with smokers and people with lung, heart, kidney or liver disease, diabetes, weakened immunity or difficulty swallowing. Pneumonia killed about 740,000 children under five in 2019, 14 % of all deaths at that age and the largest single infectious cause of death in children (WHO). Lower respiratory infections as a whole kill more than two million people a year (Global Burden of Disease study, 2021).

### Recognising it
Cough (with or without sputum), fever or shivering, breathlessness, fast breathing and chest pain that is worse on breathing in are typical in adults. Older people may show only confusion, falls or not eating. In young children, fast breathing and **chest indrawing** are the key signs; the WHO counts breathing as fast at:

| Age | Fast breathing |
|---|---|
| Under 2 months | 60 or more breaths a minute |
| 2–11 months | 50 or more |
| 1–5 years | 40 or more |

Doctors listen to the chest, check the oxygen saturation, and often confirm the diagnosis with an X-ray or ultrasound and blood tests. Severity scores support their judgement. The widely used **CURB-65** gives a point each for new **C**onfusion, **U**rea above 7 mmol/L (BUN above 19 mg/dL), a **R**espiratory rate of 30 or more, low **B**lood pressure (systolic below 90 or diastolic 60 mmHg or less), and age **65** or over. A score of 0–1 usually allows treatment at home; 3 or more marks severe pneumonia.

### Treatment and recovery
Bacterial pneumonia is treated with [[antibiotics]], chosen according to severity, local resistance patterns and the person's history; viral pneumonia with rest and support, and for influenza or COVID-19 sometimes with antiviral medicines. Oxygen, fluids and, in severe cases, breathing support in intensive care may be needed. Most otherwise healthy adults feel much better within one to two weeks, but the cough and tiredness can last six weeks or more, and full recovery can take several months. Some people — particularly people over 50 who smoke — are offered a follow-up X-ray after about six weeks to check that the shadow has gone.

### Prevention
[[vaccines|Vaccines]] against the pneumococcus, *Haemophilus influenzae* type b, measles, whooping cough, influenza, COVID-19 and RSV (for older adults, for pregnant women to protect their babies, and a long-acting antibody for infants) prevent a large share of pneumonia. So do breastfeeding, good nutrition, cleaner cooking fuels, not smoking, hand-washing and, in care homes, good mouth care.

> [!warn] Call your local emergency number for anyone with a chest infection who is breathless at rest or breathing very fast, has blue or grey lips, becomes confused or unusually drowsy, or has cold, mottled skin — and for a child whose chest pulls in with each breath, who grunts, cannot drink or feed, or is hard to wake. These can be signs of severe pneumonia or sepsis.
`,
  ideas: [
    'Pneumonia fills alveoli with fluid and inflammatory cells, so blood passes lung that holds no air: a shunt.',
    'Bacteria (above all the pneumococcus) and viruses are the main causes; aspiration is common in frail people.',
    'Older people may show only confusion; young children show fast breathing and chest indrawing.',
    'Severity scores such as CURB-65 support the decision about hospital care.',
    'Vaccines, breastfeeding, good nutrition and clean air prevent much of it.'
  ],
  pitfalls: [
    'Pneumonia always causes a fever and a bad cough — Older and frail people may show only confusion, falls or not eating.',
    'Every pneumonia needs antibiotics — Many are viral; antibiotics treat bacterial pneumonia, though clinicians often start them when the cause is uncertain and the illness serious.',
    'Oxygen will always fix the low oxygen level — Blood passing airless alveoli never meets the oxygen, so the response can be disappointing (shunt).'
  ],
  formulas: [
    {
      name: 'The shunt fraction',
      expr: 'Qs = (Cc - Ca)/(Cc - Cv)', tex: 'F_s = \\frac{C_{c\\mathrm{O_2}} - C_{a\\mathrm{O_2}}}{C_{c\\mathrm{O_2}} - C_{v\\mathrm{O_2}}}',
      vars: {
        Qs: { name: 'shunt fraction (share of blood passing unventilated lung)', q: 'ratio', unit: '%', tex: 'F_s' },
        Cc: { name: 'O₂ content of blood leaving ventilated alveoli (mL/dL)', value: 20.5, tex: 'C_{c\\mathrm{O_2}}' },
        Ca: { name: 'arterial O₂ content (mL/dL)', value: 18.4, tex: 'C_{a\\mathrm{O_2}}' },
        Cv: { name: 'mixed venous O₂ content (mL/dL)', value: 13.4, tex: 'C_{v\\mathrm{O_2}}' }
      },
      note: 'Arterial blood is a mixture: a share of venous blood that passed airless lung, and the rest fully loaded. Normally the shunt is a few per cent; in severe pneumonia it can exceed 30 %.',
      stories: { Qs: 'Blood leaving ventilated alveoli carries {Cc} mL/dL of oxygen, arterial blood {Ca} and mixed venous blood {Cv}. What share of the blood is being shunted?', Ca: 'With end-capillary blood at {Cc} mL/dL and venous blood at {Cv} mL/dL, what is the arterial content, in mL/dL, if {Qs} of the blood is shunted?' }
    },
    {
      name: 'The P/F ratio',
      expr: 'PF = PaO2/FiO2', tex: '\\text{P/F} = \\frac{P_{a\\mathrm{O_2}}}{F_{i\\mathrm{O_2}}}',
      vars: {
        PF: { name: 'P/F ratio (mmHg)', tex: '\\text{P/F}' },
        PaO2: { name: 'arterial PO₂ (mmHg)', value: 90, tex: 'P_{a\\mathrm{O_2}}' },
        FiO2: { name: 'fraction of oxygen breathed', q: 'ratio', unit: '%', value: 40, min: 21, max: 100, tex: 'F_{i\\mathrm{O_2}}' }
      },
      note: 'About 450 in healthy lungs breathing air (95/0.21). In the 2012 Berlin definition of ARDS, with its other criteria: 300 or less is mild, 200 or less moderate, 100 or less severe.',
      stories: { PF: 'A patient with pneumonia breathing {FiO2} oxygen has an arterial PO₂ of {PaO2} mmHg. What is the P/F ratio?', PaO2: 'On {FiO2} oxygen the P/F ratio is {PF}. What is the arterial PO₂, in mmHg?' }
    }
  ],
  examples: [
    {
      title: 'Measuring a shunt',
      q: 'In a patient with severe pneumonia, blood leaving the ventilated alveoli carries 20.5 mL of oxygen per decilitre, arterial blood 18.4 mL/dL and mixed venous blood 13.4 mL/dL. What share of the blood is flowing through airless lung?',
      steps: [
        '$F_s = (20.5 - 18.4)/(20.5 - 13.4) = 2.1/7.1 = 0.296$.',
        'About 30 % of the cardiac output passes consolidated lung without meeting any air.',
        'In the two-unit lung of the simulation, a 30 % shunt gives an arterial PO₂ of about 55 mmHg on air and only about 70 mmHg on 60 % oxygen.'
      ],
      a: 'About 30 %.'
    },
    {
      title: 'Scoring severity',
      q: 'A 70-year-old woman with pneumonia is alert, with a urea of 8.2 mmol/L (a BUN of 23 mg/dL), a breathing rate of 24 a minute and a blood pressure of 128/76 mmHg. What is her CURB-65 score?',
      steps: [
        'Confusion: no — 0.',
        'Urea above 7 mmol/L: yes — 1.',
        'Respiratory rate 30 or more: no — 0. Blood pressure low: no — 0.',
        'Age 65 or over: yes — 1. Total: 2.',
        'A score of 2 usually leads clinicians to consider hospital care, weighing the score with her oxygen level, other illnesses and circumstances at home.'
      ],
      a: 'CURB-65 = 2.'
    }
  ],
  quiz: [
    { q: 'Why does extra oxygen often raise the oxygen level less in pneumonia than in asthma?', choices: ['The pneumonia bacteria consume the oxygen', 'In pneumonia, blood passes alveoli with no air in them (shunt), so it never meets the extra oxygen', 'Oxygen is toxic in pneumonia', 'In asthma the lungs are larger'], a: 1,
      why: 'Shunted blood is not exposed to alveolar gas at all; in asthma the poorly ventilated alveoli still receive some of the richer air (low V/Q).' },
    { q: 'An 18-month-old with a cough and fever is breathing 46 times a minute. By the WHO thresholds this is…', choices: ['normal for her age', 'fast breathing', 'slow breathing', 'impossible to judge without an X-ray'], a: 1,
      why: 'Between 1 and 5 years, 40 or more breaths a minute is fast breathing — a key sign of pneumonia that needs medical assessment.' },
    { q: 'Pneumonia always causes a high fever.', a: false,
      why: 'Older and frail people, and those with weakened immunity, may have no fever — sometimes only confusion, falls or not eating.' },
    { q: 'CURB-65 gives a point for each of…', choices: ['Cough, Urine, Rash, Blood in the sputum, age 65 or over', 'Confusion, Urea, Respiratory rate, Blood pressure, age 65 or over', 'Chest pain, Upper-airway noise, Rapid pulse, Blood sugar, weight under 65 kg', 'Crackles, Uric acid, Right-sided shadow, Breathlessness, saturation under 65 %'], a: 1,
      why: 'New confusion, urea above 7 mmol/L, a respiratory rate of 30 or more, low blood pressure and age 65 or over.' },
    { q: 'A patient breathing 50 % oxygen has an arterial PO₂ of 75 mmHg. What is the P/F ratio, in mmHg?', answer: 150,
      why: '75 / 0.50 = 150 — far below the 450 or so of healthy lungs, and in the range the Berlin definition calls moderate ARDS if its other criteria are met.' }
  ],
  applications: ['Childhood pneumonia programmes: vaccines, oxygen and simple breath counting.', 'Hospital severity scoring and careful antibiotic use.', 'Pulse oximeters and oxygen concentrators in health centres.', 'Mouth care and swallowing assessment in care homes.'],
  sim: { id: 'resp-vq', params: { preset: 'pneumonia' } }
},

{
  id: 'pulmonary-embolism', parent: 'lung-disease', title: 'Pulmonary embolism', level: 2,
  short: 'A blood clot, usually from a deep vein in the leg, that travels to the lungs and blocks a pulmonary artery. It causes sudden breathlessness and chest pain, can strain or stop the heart, and is treatable with anticoagulants — so recognising it quickly matters.',
  keywords: ['pulmonary embolism', 'PE', 'blood clot', 'deep vein thrombosis', 'DVT', 'venous thromboembolism', 'VTE', 'D-dimer', 'CT pulmonary angiogram', 'anticoagulant', 'thrombolysis', 'dead space', 'Wells score', 'right ventricle', "Virchow's triad"],
  prereq: ['hemostasis', 'gas-exchange', 'blood-vessels'],
  related: ['bayes-diagnosis', 'pregnancy', 'medical-imaging', 'recognising-emergencies', 'heart-failure', 'arrhythmias'],
  body: `
Two weeks after an operation on her knee, Sara, 34, notices that her left calf is swollen and sore. A few days later, climbing the stairs, she is suddenly breathless and feels a sharp pain in her chest every time she breathes in, and her heart is racing. She calls for help — exactly right, because a clot has probably travelled from her leg to her lungs.

### Where the clot comes from
Most pulmonary emboli start as a **deep vein thrombosis** (DVT) in the leg or pelvis. Clots form when three things combine — the triad described by Rudolf Virchow in the 1850s:

- **slow blood flow**: immobility after surgery or illness, long journeys, paralysis;
- **damage to the vein wall**: surgery, injury, a previous clot;
- **blood that clots more easily** ([[hemostasis]]): cancer and its treatment, [[pregnancy]] and the weeks after birth, contraception or hormone treatment containing oestrogen, inherited tendencies, inflammatory disease, and severe infections including COVID-19.

Together, deep vein thrombosis and pulmonary embolism affect roughly one or two adults in a thousand each year in European and North American population studies, and the risk climbs steeply with age.

### What it does in the lung
A clot lodged in a pulmonary artery cuts off the blood to the lung beyond it. That lung is still ventilated but no longer perfused: **dead space** ([[gas-exchange]]). The blood is pushed into the rest of the lung, which becomes over-perfused, so the oxygen level usually falls — but people breathe faster, their carbon dioxide is often low, and a normal oxygen level does not rule out an embolism. A large clot forces the right ventricle to pump against a high resistance; it stretches and weakens, its output falls, and blood pressure can collapse — the cause of sudden death in massive embolism. Small clots far out in the lung can kill a patch of tissue (an infarct), causing sharp pain on breathing and coughing up of blood. A few per cent of survivors are left with persistent clots and high pressure in the lung arteries.

### Symptoms
Sudden breathlessness is the commonest symptom; others are chest pain that is sharp and worse on breathing in, cough (sometimes with blood), a fast heartbeat, light-headedness or fainting, and the swollen, painful leg of a DVT. The picture can also be vague: just unexplained breathlessness.

> [!warn] **Pulmonary embolism warning signs** — call your local emergency number for sudden or unexplained breathlessness, chest pain that is sharp and worse when breathing in, coughing up blood, fainting or collapse, or a racing heartbeat — especially after surgery or a hospital stay, a long journey, during pregnancy or after giving birth, with cancer, or with a painful swollen leg. A swollen, painful, warm or red calf or thigh on one side without breathing problems may be a deep vein thrombosis: get medical assessment the same day.

### Diagnosis: probability first
Because the symptoms overlap with so many conditions, doctors first estimate how likely an embolism is, using scores such as the **Wells** or **Geneva** score. When the probability is low or intermediate, a normal **D-dimer** blood test (which detects fragments of dissolving clot) makes an embolism very unlikely. A raised D-dimer proves little, because it also rises with age, pregnancy, infection, cancer and surgery; an age-adjusted cut-off (age × 10 µg/L after 50) reduces false alarms. When the probability is high, or the D-dimer is raised, imaging follows: a **CT pulmonary angiogram**, or a ventilation–perfusion scan, which gives less radiation to the breasts and is often preferred in pregnancy ([[medical-imaging]]). This sequence is Bayes' theorem at work ([[bayes-diagnosis]]).

### Treatment
The mainstay is **anticoagulation**: medicines that stop the clot growing and new ones forming while the body's own clot-dissolving system clears it over weeks. They include heparins, the direct oral anticoagulants (apixaban, rivaroxaban, edoxaban, dabigatran) and warfarin. Treatment lasts at least three months — longer when there was no clear trigger or the risk persists — and bleeding is its main risk. Many people at low risk are now treated at home (European Society of Cardiology guideline, 2019). When an embolism causes shock, **clot-dissolving (thrombolytic) medicine**, catheter procedures or surgery clear the artery quickly.

### Prevention
Hospitals assess each admitted patient's risk and use preventive anticoagulants or compression devices where needed; getting up and moving early after surgery helps. On journeys longer than about four hours, walk about when you can, flex your calves and drink enough; people at high risk may be advised to wear compression stockings or take other measures.
`,
  ideas: [
    'Most pulmonary emboli are clots from the deep veins of the legs or pelvis, formed where slow flow, vein damage and easily clotting blood combine.',
    'The blocked lung becomes dead space and the rest is over-perfused; a large clot can overwhelm the right ventricle.',
    'Warning signs: sudden breathlessness, sharp pain on breathing in, coughing blood, fainting, a racing heart — especially with a risk factor or a swollen leg.',
    'Diagnosis starts from probability: a normal D-dimer rules an embolism out when the probability is low; imaging confirms it.',
    'Anticoagulants are the main treatment; clot-dissolving treatment is kept for embolism that causes shock.'
  ],
  pitfalls: [
    'A normal oxygen level rules out a pulmonary embolism — Faster breathing can keep the oxygen near normal; many people with an embolism have normal saturations.',
    'A raised D-dimer means there is a clot — D-dimer rises with age, pregnancy, infection, cancer and surgery; its value lies in a normal result when the probability is low.',
    'Anticoagulants dissolve the clot — They stop it growing and new clots forming; the body\'s own clot-dissolving system clears it over weeks.'
  ],
  formulas: [
    {
      name: 'Dead space from exhaled CO₂ (Bohr)',
      expr: 'VDVT = (PaCO2 - PECO2)/PaCO2', tex: 'f_D = \\frac{P_{a\\mathrm{CO_2}} - P_{E\\mathrm{CO_2}}}{P_{a\\mathrm{CO_2}}}',
      vars: {
        VDVT: { name: 'dead-space share of each breath (VD/VT)', q: 'ratio', unit: '%', tex: 'f_D' },
        PaCO2: { name: 'arterial PCO₂', q: 'pressure', unit: 'mmHg', value: 40, tex: 'P_{a\\mathrm{CO_2}}' },
        PECO2: { name: 'PCO₂ of the mixed exhaled air', q: 'pressure', unit: 'mmHg', value: 28, tex: 'P_{E\\mathrm{CO_2}}' }
      },
      note: 'The Bohr equation in Enghoff\'s form: air that met no blood carries no CO₂ and dilutes the exhaled gas. Normally about 30 %; much higher when clots cut off blood to ventilated lung.',
      stories: { VDVT: 'The arterial PCO₂ is {PaCO2} and the mixed exhaled air has a PCO₂ of {PECO2}. What share of each breath is dead space?' }
    },
    {
      name: 'Probability after a test result',
      expr: 'post = pre*LR/(1 - pre + pre*LR)', tex: 'p_{\\text{after}} = \\frac{p_{\\text{before}} \\cdot \\text{LR}}{1 - p_{\\text{before}} + p_{\\text{before}} \\cdot \\text{LR}}',
      vars: {
        post: { name: 'probability after the test', q: 'ratio', unit: '%', tex: 'p_{\\text{after}}' },
        pre: { name: 'probability before the test', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: 'p_{\\text{before}}' },
        LR: { name: 'likelihood ratio of the result', value: 0.1, tex: '\\text{LR}' }
      },
      note: 'Bayes\' theorem in odds form, rearranged. A negative D-dimer has a likelihood ratio of roughly 0.1 (it depends on the assay); a positive one only about 1.5–2, which is why a positive result proves little.',
      stories: { post: 'The chance of an embolism is judged to be {pre} before a D-dimer test, which comes back negative (likelihood ratio {LR}). What is the chance now?' }
    }
  ],
  examples: [
    {
      title: 'What a negative D-dimer is worth',
      q: 'A negative D-dimer has a likelihood ratio of about 0.1. What is the probability of an embolism after a negative result in a patient whose probability beforehand was 5 %, and in one whose probability was 40 %?',
      steps: [
        'Low probability: $p = 0.05 \\times 0.1 / (1 - 0.05 + 0.05 \\times 0.1) = 0.005/0.955 = 0.0052$, about 0.5 % — low enough to look for another cause.',
        'High probability: $p = 0.04/(0.6 + 0.04) = 0.0625$, about 6 % — still too high to send the patient home.',
        'That is why a high clinical probability leads straight to imaging, whatever the D-dimer.'
      ],
      a: 'About 0.5 % and about 6 %: the same negative test rules out an embolism in the first patient but not in the second.'
    },
    {
      title: 'Wasted breathing',
      q: 'Normally about 30 % of each breath is dead space. After a large embolism, the arterial PCO₂ is 40 mmHg and the mixed exhaled PCO₂ 18 mmHg. How much more must the patient breathe to keep the same alveolar ventilation?',
      steps: [
        'Dead-space share: $(40 - 18)/40 = 0.55$, i.e. 55 %.',
        'Useful share of each breath: 70 % before, 45 % now.',
        'Breathing must rise by $0.70/0.45 = 1.56$ — about 56 % more — just to clear the same carbon dioxide. This is part of why people with an embolism breathe fast and feel breathless.'
      ],
      a: 'A dead space of 55 %: about 56 % more breathing is needed.'
    }
  ],
  quiz: [
    { q: 'A woman with a suspected embolism has an oxygen saturation of 97 %. Does that rule it out?', choices: ['Yes: an embolism always lowers the oxygen', 'No: faster breathing can keep the oxygen near normal', 'Yes, if she is under 50', 'Only if she has no chest pain'], a: 1,
      why: 'Many people with an embolism have normal saturations. The diagnosis follows the probability, the D-dimer and imaging, not the oxygen level.' },
    { q: 'For a patient judged to have a high probability of embolism, what is the role of a D-dimer test?', choices: ['A negative result rules an embolism out', 'It is not enough: even after a negative result the probability stays too high, so imaging is needed', 'A positive result proves the embolism', 'It shows which lung is affected'], a: 1,
      why: 'Starting from 40 %, a negative D-dimer still leaves about 6 %. Imaging is the next step.' },
    { q: 'The part of the lung beyond a blocked pulmonary artery becomes dead space: ventilated but not perfused.', a: true,
      why: 'Air still reaches those alveoli, but no blood does, so no gas is exchanged there.' },
    { q: 'The main treatment for most people with a pulmonary embolism is…', choices: ['antibiotics', 'anticoagulant medicine', 'an inhaled bronchodilator', 'surgery to remove the clot'], a: 1,
      why: 'Anticoagulants stop the clot growing and prevent new ones while the body clears it; clot-dissolving drugs or procedures are kept for embolism causing shock.' },
    { q: 'Before a D-dimer test the probability of an embolism is 20 %. The test is negative (likelihood ratio 0.1). What is the probability afterwards, in per cent?', answer: 2.44,
      why: '0.2 × 0.1 / (0.8 + 0.02) = 0.02/0.82 ≈ 0.0244, about 2.4 %.' }
  ],
  applications: ['Clot-prevention protocols for patients in hospital.', 'Advice for long-haul travellers and after surgery.', 'Emergency pathways combining probability scores, D-dimer and CT.', 'Anticoagulation clinics.'],
  sim: { id: 'resp-vq', params: { preset: 'pe' } }
},

{
  id: 'sleep-apnea', parent: 'lung-disease', title: 'Sleep apnoea', level: 2,
  short: 'Repeated pauses or near-pauses in breathing during sleep, most often because the throat collapses when its muscles relax. Loud snoring, gasping and daytime sleepiness are the clues; a sleep study counts the events, and CPAP, weight loss and oral devices treat it.',
  keywords: ['sleep apnoea', 'sleep apnea', 'obstructive sleep apnoea', 'OSA', 'snoring', 'apnoea–hypopnoea index', 'AHI', 'CPAP', 'daytime sleepiness', 'sleep study', 'polysomnography', 'mandibular advancement device', 'central sleep apnoea', 'STOP-BANG', 'drowsy driving'],
  prereq: ['control-of-breathing', 'ventilation', 'sleep'],
  related: ['obesity', 'hypertension', 'arrhythmias', 'heart-failure', 'stroke'],
  body: `
Every night David's wife lies awake listening: a long crescendo of snoring, then silence — ten, twenty, thirty seconds — then a snort and a gasp, and the snoring starts again. David remembers none of it. He only knows that he wakes unrefreshed with a headache, dozes off in meetings, and last week nodded off at a red light. He has obstructive sleep apnoea.

### What happens
The throat — the **pharynx** — is a soft tube with no bone or cartilage to hold it open. Awake, its muscles keep it firm. In sleep they relax, and in a narrow throat, crowded by fat in the neck, large tonsils, a small or set-back jaw, a large tongue or a blocked nose, the suction of each breath in pulls the walls together. When air flow stops for 10 seconds or more it is an **apnoea**; when it falls by at least 30 %, with a dip in oxygen or a brief awakening, it is a **hypopnoea**.

During the event the chest heaves against the closed airway, oxygen falls and carbon dioxide rises ([[control-of-breathing]]) until the brain wakes for a few seconds — too briefly to remember — the muscles snap the airway open with a snort, and sleep resumes. Repeated dozens or hundreds of times a night, this breaks up [[sleep]], and each event brings a surge of adrenaline and blood pressure.

### Measuring it
A sleep study counts the events. The **apnoea–hypopnoea index** (AHI) is their number per hour of sleep; in adults, fewer than 5 is normal, 5–14 mild, 15–29 moderate and 30 or more severe (American Academy of Sleep Medicine). Many people can be tested at home with a small recorder of air flow, breathing effort and oxygen; others need a full night in a sleep laboratory. Questionnaires such as STOP-BANG — snoring, tiredness, observed pauses, blood pressure, BMI, age, neck size, sex — help decide who should be tested.

### Who has it
A 2019 analysis estimated that about 936 million adults aged 30–69 worldwide have at least mild obstructive sleep apnoea, and about 425 million moderate or severe — most of them undiagnosed. The risk rises with excess weight ([[obesity]]), male sex, age, the menopause, a thick neck, jaw shape, family history, alcohol or sedatives at night, and smoking. In children it is usually due to large tonsils and adenoids, and shows as snoring, restless sleep and trouble with behaviour or concentration.

### Why it matters
Sleepiness is the most immediate danger: people with untreated sleep apnoea have roughly two to three times the usual risk of road crashes. Sleep apnoea also raises blood pressure ([[hypertension]]), particularly the kind that resists treatment, and is linked with atrial fibrillation ([[arrhythmias]]), heart failure, stroke, type 2 diabetes, low mood and poor memory. Whether treatment prevents heart attacks and strokes is uncertain: in the largest trial so far (SAVE, 2016) CPAP did not reduce cardiovascular events in people with established heart disease — though it did improve sleepiness and quality of life, and many participants used it for only a few hours a night.

### Treatment
- **CPAP** (continuous positive airway pressure): a quiet machine blows air through a mask at a steady pressure, typically around 5–15 cmH₂O, holding the throat open like a pneumatic splint. It works only while it is worn; a comfortable mask, humidified air and early support make the difference.
- **Weight loss**, where weight is a cause: in one long-term study, losing a tenth of body weight predicted a fall of about a quarter in the AHI (2000). Weight-loss medicines can help — in December 2024 the US approved one (tirzepatide) for moderate to severe sleep apnoea with obesity — and so can bariatric surgery.
- **Mandibular advancement devices**, made by a dentist, which hold the lower jaw forward; useful in mild to moderate cases.
- Sleeping on the side when the events happen mainly on the back, avoiding alcohol and sedatives at night, and treating a blocked nose.
- **Surgery** — removing the tonsils and adenoids in children, selected operations in adults — and, for some who cannot use CPAP, an implanted stimulator of the nerve that moves the tongue.

**Central sleep apnoea**, in which the brain intermittently stops sending the signal to breathe, is a different condition: it occurs in heart failure, with opioid medicines, at high altitude and after strokes, and has its own treatments.

> [!warn] Sleepiness at the wheel kills. If you feel drowsy while driving, stop somewhere safe and rest. Many countries require people whose sleep apnoea causes daytime sleepiness to tell the driving licence authority until it is treated — ask your doctor what applies where you live. People with known or suspected sleep apnoea should also mention it before starting sedatives or opioids and before an anaesthetic.
`,
  ideas: [
    'In obstructive sleep apnoea the relaxed throat collapses during sleep; breathing stops or shrinks, and brief awakenings reopen it — up to hundreds of times a night.',
    'The AHI counts apnoeas and hypopnoeas per hour of sleep: 5–14 mild, 15–29 moderate, 30 or more severe.',
    'Loud snoring with pauses, gasping and daytime sleepiness are the clues; most people with it are undiagnosed.',
    'CPAP splints the airway open with air pressure; weight loss, oral devices and sleeping position also help.',
    'Untreated, it causes sleepiness and road crashes and raises blood pressure.'
  ],
  pitfalls: [
    'Snoring and sleep apnoea are the same thing — Many people snore without apnoea; the warning signs are pauses, gasping and daytime sleepiness.',
    'Only overweight men get sleep apnoea — It is commoner in them, but women (especially after the menopause), slim people with a narrow jaw and children with large tonsils get it too.',
    'A nightcap helps you sleep better — Alcohol relaxes the throat muscles and makes apnoeas longer and more frequent.'
  ],
  formulas: [
    {
      name: 'Apnoea–hypopnoea index',
      expr: 'AHI = (A + Hy)/h', tex: '\\text{AHI} = \\frac{N_{\\text{apnoea}} + N_{\\text{hypopnoea}}}{t_{\\text{sleep}}}',
      vars: {
        AHI: { name: 'apnoea–hypopnoea index (events per hour)', tex: '\\text{AHI}' },
        A: { name: 'number of apnoeas', value: 64, tex: 'N_{\\text{apnoea}}' },
        Hy: { name: 'number of hypopnoeas', value: 88, tex: 'N_{\\text{hypopnoea}}' },
        h: { name: 'hours of sleep', value: 6.5, tex: 't_{\\text{sleep}}' }
      },
      note: 'Adults: under 5 normal, 5–14 mild, 15–29 moderate, 30 or more severe (AASM). Home tests divide by the recording time instead of the sleep time, which can underestimate the AHI.',
      practice: { unknowns: ['AHI', 'Hy'] },
      stories: { AHI: 'A sleep study records {A} apnoeas and {Hy} hypopnoeas during {h} hours of sleep. What is the AHI?', Hy: 'Over {h} hours of sleep there were {A} apnoeas and the AHI was {AHI}. How many hypopnoeas were there?' }
    }
  ],
  examples: [
    {
      title: 'Reading a sleep study',
      q: 'David\'s study records 64 apnoeas and 88 hypopnoeas during 6.5 hours of sleep. What is his AHI, and how severe is his sleep apnoea?',
      steps: [
        'Events: $64 + 88 = 152$.',
        'AHI: $152 / 6.5 \\approx 23$ events per hour.',
        '15–29 is moderate obstructive sleep apnoea; with his daytime sleepiness, treatment is clearly worthwhile.'
      ],
      a: 'An AHI of about 23: moderate sleep apnoea.'
    },
    {
      title: 'What weight loss can do',
      q: 'In a long-term study, losing 10 % of body weight predicted a fall of about 26 % in the AHI. If David, who is overweight, loses a tenth of his weight, what might his AHI become?',
      steps: [
        '$23.4 \\times (1 - 0.26) = 23.4 \\times 0.74 \\approx 17$ events per hour.',
        'Still moderate: weight loss helps a great deal, but on its own it may not be enough, and the effect differs widely between people.',
        'A sensible plan combines weight loss with CPAP or another treatment, and a repeat study later.'
      ],
      a: 'About 17 events per hour — better, but still moderate.'
    }
  ],
  quiz: [
    { q: 'Why does the throat collapse during sleep but not while awake?', choices: ['It shrinks at night', 'Its muscles relax in sleep, and the suction of each breath in pulls the soft walls together', 'The tongue grows at night', 'The lungs stop pulling air in'], a: 1,
      why: 'The pharynx has no rigid support; awake muscle tone holds it open, and sleep removes much of that tone.' },
    { q: 'A sleep study shows an AHI of 32 events per hour. This is…', choices: ['normal', 'mild sleep apnoea', 'moderate sleep apnoea', 'severe sleep apnoea'], a: 3,
      why: '30 or more events per hour is severe (under 5 normal, 5–14 mild, 15–29 moderate).' },
    { q: 'Everyone who snores loudly has sleep apnoea.', a: false,
      why: 'Snoring is common and often harmless; pauses in breathing, gasping and daytime sleepiness point to apnoea, and a sleep study decides.' },
    { q: 'CPAP treats obstructive sleep apnoea by…', choices: ['adding oxygen to the blood', 'holding the throat open with air pressure', 'stimulating the brain to breathe', 'sedating the patient'], a: 1,
      why: 'The steady air pressure acts as a pneumatic splint that stops the pharynx collapsing.' },
    { q: 'A home test records 45 apnoeas and hypopnoeas over 7.5 hours. What is the AHI, in events per hour?', answer: 6,
      why: '45 / 7.5 = 6 events per hour: mild sleep apnoea.' }
  ],
  applications: ['Home sleep testing and sleep laboratories.', 'CPAP clinics and mask fitting.', 'Fitness-to-drive rules and road-safety campaigns.', 'Screening for sleep apnoea before anaesthesia and surgery.']
}

);
