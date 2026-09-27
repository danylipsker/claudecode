/* HYPER-PHARMACEUTICS · content/reference.js — the reference concept for pharmaceutics authors:
 * its depth, tone, numbers, safety wording and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'shelf-life', parent: 'stability-topic', title: 'Shelf life and the Arrhenius equation', level: 2,
  short: 'A medicine\'s shelf life is the time it keeps at least 90 % of its labelled strength (t90). Most degradation is first order, so t90 = 0.105/k; and because reactions speed up with temperature according to Arrhenius, a few months at 40 °C can predict years at 25 °C.',
  keywords: ['shelf life', 't90', 'expiry date', 'Arrhenius', 'activation energy', 'accelerated stability', 'first order', 'degradation', 'Q10', 'storage temperature', 'ICH'],
  prereq: ['reaction-order', 'degradation-pathways', 'chemistry:rate-laws', 'chemistry:arrhenius-equation'],
  related: ['stability-testing', 'photostability', 'packaging', 'excipient-compatibility', 'lyophilisation', 'biologics-formulation'],
  body: `
Every medicine carries an expiry date, and behind it lies a simple question: how long until the active ingredient has fallen below the lowest amount the specification allows? For most products that limit is **90 % of the labelled content**, so the shelf life is the time to lose 10 % — written $t_{90}$. (The limit can be tighter when a degradation product is toxic: then the shelf life is set by how fast that impurity grows, not by how fast the drug is lost.)

### First-order loss and $t_{90}$
Most drugs degrade by **first-order** kinetics: the rate is proportional to how much drug is left, so a fixed fraction is lost in each unit of time. Hydrolysis of an ester in solution, or oxidation with plenty of oxygen, behaves this way:

$$C = C_0\\,e^{-kt} \\qquad\\Rightarrow\\qquad t_{90} = \\frac{\\ln(100/90)}{k} = \\frac{0.105}{k}$$

A rate constant of 0.005 per month gives $t_{90} = 21$ months. The same constant gives a half-life of $0.693/k = 139$ months — but a medicine is useless long before half of it is gone, which is why pharmaceutics works with $t_{90}$, not half-lives.

In a **suspension** the dissolved drug degrades, but it is constantly topped up from the undissolved particles, so the concentration in solution — and therefore the rate of loss — stays constant: **apparent zero order**, with $t_{90} = 0.1\\,C_0/k_0$. That is one reason why unstable drugs are often given as suspensions or dry powders to be made up just before use.

### Temperature: the Arrhenius equation
Chemical reactions go faster when warm because more molecules have enough energy to reach the transition state. Svante Arrhenius captured this in 1889:

$$k = A\\,e^{-E_a/RT} \\qquad\\Rightarrow\\qquad \\frac{k_2}{k_1} = \\exp\\!\\left[\\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)\\right]$$

where $E_a$ is the activation energy (typically 50–100 kJ/mol for drug degradation), $R = 8.314$ J/(mol·K) and $T$ is in kelvin. For $E_a = 80$ kJ/mol, warming from 25 °C to 40 °C speeds the reaction up 4.7 times; from 25 °C to 60 °C, 29 times. A plot of $\\ln k$ against $1/T$ is a straight line of slope $-E_a/R$ — the **Arrhenius plot**.

That is the basis of **accelerated stability testing**. Instead of waiting two years at room temperature, the product is stored at higher temperatures, the rate constant is measured at each, and the Arrhenius line is extrapolated back to the storage temperature. The international ICH Q1A(R2) guideline (2003) sets the standard conditions — long-term 25 °C/60 % RH (or 30 °C/65 % RH for hotter climate zones) and accelerated 40 °C/75 % RH for six months — and real-time data at the storage condition must still confirm the claimed shelf life.

| Storage | Relative rate ($E_a$ = 80 kJ/mol) | $t_{90}$ if 24 months at 25 °C |
|---|---|---|
| 5 °C (refrigerator) | 0.10 | about 20 years |
| 25 °C (room temperature) | 1 | 24 months |
| 30 °C (hot climate) | 1.7 | 14 months |
| 40 °C (accelerated) | 4.7 | 5 months |
| 60 °C (a car in summer) | 29 | 25 days |

> [!key] Shelf life is the time to 90 % of label: $t_{90} = 0.105/k$ for first-order loss. Each 10 °C of warming multiplies $k$ by roughly 2 to 4 (the $Q_{10}$ rule), which is why "store below 25 °C" matters and why accelerated tests work.

### When the prediction fails
Arrhenius extrapolation assumes the same reaction happens at every temperature. It breaks down when a higher temperature melts or changes a crystal form, drives off water, speeds a different reaction, or — for proteins — unfolds the molecule, which does not refold on cooling. Moisture often matters more than heat for tablets, so humidity is controlled too (see [[photostability]] and [[packaging]]). Biological medicines such as insulin and vaccines are usually kept cold for exactly these reasons (see [[biologics-formulation]]).

> [!warn] The figures here are illustrations. A medicine's real storage conditions and expiry are on its label and leaflet, set from real-time stability data. Do not use medicines after their expiry date or after storing them outside their labelled conditions; ask a pharmacist.
`,
  ideas: [
    'Shelf life is usually t90: the time to lose 10 % of the labelled content.',
    'For first-order degradation t90 = 0.105/k, independent of the starting amount.',
    'Suspensions degrade at an apparent zero order because the solution stays saturated: t90 = 0.1 C0/k0.',
    'Arrhenius: ln k falls linearly with 1/T; Ea of 50–100 kJ/mol means roughly ×2–4 per 10 °C.',
    'Accelerated studies at 40 °C/75 % RH predict shelf life, but real-time data must confirm it.'
  ],
  pitfalls: [
    'Shelf life is the half-life of the drug — A medicine fails its specification long before half is gone; shelf life is the time to 90 %, about a seventh of the first-order half-life.',
    'Degradation doubles for every 10 °C, exactly — The Q10 rule is a rough guide; the real factor depends on the activation energy and on which 10 degrees, and can be anywhere from about 1.5 to 5.',
    'If it is stable at 60 °C for a month, it is stable for years at room temperature — Only if the same reaction dominates at both temperatures; changes of crystal form, moisture or protein unfolding can make high-temperature data misleading in either direction.'
  ],
  formulas: [
    {
      name: 'First-order degradation',
      expr: 'C = C0*exp(-k*t)', tex: 'C = C_0\\,e^{-kt}',
      vars: {
        C: { name: 'content remaining', q: 'ratio', unit: '%' },
        C0: { name: 'initial content', q: 'ratio', unit: '%', value: 100, tex: 'C_0' },
        k: { name: 'first-order rate constant', q: 'rate', unit: '1/month', value: 0.005 },
        t: { name: 'time', q: 'time', unit: 'month', value: 24 }
      },
      note: 'The same form holds with the content as mg, mg/mL or % of label; k is independent of the amount.',
      practice: { unknowns: ['C', 't', 'k'] },
      stories: {
        C: 'A solution loses its drug by first-order kinetics with k = {k}. What fraction of the label remains after {t}?',
        t: 'With k = {k}, how long until the content has fallen from {C0} to {C}?',
        k: 'After {t} an assay finds {C} of the label left (from {C0}). What is the rate constant?'
      }
    },
    {
      name: 'Shelf life for first-order loss',
      expr: 't90 = ln(100/90)/k', tex: 't_{90} = \\dfrac{\\ln(100/90)}{k} = \\dfrac{0.105}{k}',
      vars: {
        t90: { name: 'shelf life (time to 90 %)', q: 'time', unit: 'month', tex: 't_{90}' },
        k: { name: 'first-order rate constant', q: 'rate', unit: '1/month', value: 0.005 }
      },
      stories: { t90: 'A drug degrades by first-order kinetics with k = {k}. What is its shelf life?', k: 'A product must keep a shelf life of {t90}. What is the largest first-order rate constant allowed?' }
    },
    {
      name: 'Arrhenius: rate at another temperature',
      expr: 'k2 = k1*exp(Ea/R*(1/T1 - 1/T2))', tex: 'k_2 = k_1 \\exp\\!\\left[\\dfrac{E_a}{R}\\left(\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right)\\right]',
      vars: {
        k2: { name: 'rate constant at T₂', q: 'rate', unit: '1/month', tex: 'k_2' },
        k1: { name: 'rate constant at T₁', q: 'rate', unit: '1/month', value: 0.02, tex: 'k_1' },
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 80, tex: 'E_a' },
        R: { const: 'R' },
        T1: { name: 'temperature of the study', q: 'temperature', unit: '°C', value: 40, tex: 'T_1' },
        T2: { name: 'storage temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_2' }
      },
      note: 'Temperatures enter in kelvin (the calculator converts °C). Valid only if the same degradation reaction dominates at both temperatures.',
      practice: { unknowns: ['k2', 'Ea'] },
      stories: {
        k2: 'At {T1} a drug degrades with k = {k1}; its activation energy is {Ea}. What is the rate constant at {T2}?',
        Ea: 'A drug degrades with k = {k1} at {T1} and k = {k2} at {T2}. What is the activation energy?'
      }
    },
    {
      name: 'Shelf life for zero-order loss (suspensions)',
      expr: 't90 = 0.1*C0/k0', tex: 't_{90} = \\dfrac{0.1\\,C_0}{k_0}',
      vars: {
        t90: { name: 'shelf life (time to 90 %)', q: false, unit: 'day', tex: 't_{90}' },
        C0: { name: 'labelled concentration', q: false, unit: 'mg/mL', value: 25, tex: 'C_0' },
        k0: { name: 'zero-order rate constant', q: false, unit: 'mg/(mL·day)', value: 0.1, tex: 'k_0' }
      },
      note: 'For a suspension, k₀ = k × (the drug\'s solubility): the dissolved fraction degrades at a constant rate while particles keep the solution saturated. Work in mg/mL and days throughout.',
      stories: { t90: 'A suspension labelled {C0} loses drug at a constant {k0}. What is its shelf life?' }
    }
  ],
  examples: [
    {
      title: 'Predicting shelf life from an accelerated study',
      q: 'A new tablet loses its drug by first-order kinetics with k = 0.020 per month at 40 °C. Separate studies give an activation energy of 83 kJ/mol. Estimate the shelf life at 25 °C.',
      steps: [
        'Ratio of rates: $\\exp[83\\,000/8.314 \\times (1/298.15 - 1/313.15)] = \\exp(9983 \\times 1.607\\times10^{-4}) = \\exp(1.604) = 4.97$.',
        '$k_{25} = 0.020/4.97 = 0.00402$ per month.',
        '$t_{90} = 0.105/0.00402 = 26$ months.',
        'A company would claim 24 months, confirmed by real-time data at 25 °C/60 % RH, with the label "store below 25 °C".'
      ],
      a: 'About 26 months — a 24-month shelf life is supported, pending real-time data.'
    },
    {
      title: 'A refrigerated product left out',
      q: 'An eye-drop solution has a shelf life of 18 months in the refrigerator (5 °C), with first-order degradation and Ea = 70 kJ/mol. How much of its shelf life does one month at 25 °C use up?',
      steps: [
        'At 5 °C: $k_5 = 0.105/18 = 0.00585$ per month.',
        'Ratio to 25 °C: $\\exp[70\\,000/8.314 \\times (1/278.15 - 1/298.15)] = \\exp(8420 \\times 2.412\\times10^{-4}) = \\exp(2.03) = 7.6$.',
        '$k_{25} = 0.0445$ per month: one month at 25 °C loses $1 - e^{-0.0445} = 4.4$ % of the drug — as much as 7.6 months in the refrigerator.',
        'That is why such products say "store in a refrigerator", and why an opened bottle often has a separate, shorter in-use life.'
      ],
      a: 'One month at 25 °C uses up about 7.6 months of refrigerated shelf life (4.4 % of the drug).'
    },
    {
      title: 'A suspension\'s zero-order shelf life',
      q: 'A drug has a first-order rate constant in solution of 0.5 per day and a solubility of 2 mg/mL. It is made as a 125 mg/5 mL suspension (25 mg/mL). What is its shelf life, and what would it be as a solution?',
      steps: [
        'In the suspension the dissolved drug stays at 2 mg/mL, so it is lost at $k_0 = 0.5 \\times 2 = 1.0$ mg/(mL·day).',
        '$t_{90} = 0.1 \\times 25/1.0 = 2.5$ days.',
        'As a solution: $t_{90} = 0.105/0.5 = 0.21$ days — about 5 hours.',
        'Twelve times longer as a suspension — and far longer still as a dry powder reconstituted by the pharmacist, which is why many antibiotic mixtures are supplied that way, with a short in-use life once mixed.'
      ],
      a: 'About 2.5 days as a suspension against 5 hours as a solution.'
    }
  ],
  quiz: [
    { q: 'For first-order degradation, the shelf life (t90) is…', choices: ['0.693/k', '0.105/k', '0.1 C₀/k', '10 % of the half-life'], a: 1, why: 't90 = ln(100/90)/k = 0.105/k. 0.693/k is the half-life, and 0.1 C₀/k is the zero-order t90.' },
    { q: 'A drug has k = 0.004 per month at 25 °C. What is its shelf life in months?', answer: 26.3, unit: 'month', why: '0.105/0.004 = 26.3 months.' },
    { q: 'With Ea = 80 kJ/mol, a product stored at 40 °C instead of 25 °C degrades about…', choices: ['1.5 times faster', 'twice as fast', '4.7 times faster', '15 times faster'], a: 2, why: 'exp[80 000/8.314 × (1/298.15 − 1/313.15)] = exp(1.546) = 4.7.' },
    { q: 'Doubling the starting concentration of a solution halves its first-order shelf life.', a: false, why: 'First-order t90 = 0.105/k does not depend on the starting concentration — a fixed fraction is lost per unit time.' },
    { q: 'Why can a suspension be more stable than a solution of the same drug?', choices: ['particles are shielded from all reactions', 'only the dissolved drug degrades, and it is kept at the solubility: loss becomes zero order and small', 'suspensions contain no water', 'the particles catalyse the reverse reaction'], a: 1, why: 'The undissolved reservoir replaces what degrades, so the loss per day is k × solubility — a small, constant amount.' }
  ],
  problems: [
    { q: 'An antibiotic solution loses 5 % of its content in 30 days at 5 °C (first order). What is its shelf life?', answer: 61.6, unit: 'day', tol: 0.02, steps: ['$k = -\\ln(0.95)/30 = 0.001710$ per day.', '$t_{90} = 0.10536/0.001710 = 61.6$ days — about two months.'] },
    { q: 'Rate constants of 0.010 and 0.052 per month are measured at 40 °C and 60 °C. What is the activation energy (kJ/mol)?', answer: 72.0, unit: 'kJ/mol', tol: 0.03, steps: ['$\\ln(0.052/0.010) = 1.649 = (E_a/8.314)(1/313.15 - 1/333.15)$.', '$1/313.15 - 1/333.15 = 1.917\\times10^{-4}$, so $E_a = 1.649 \\times 8.314/1.917\\times10^{-4} = 71\\,500$ J/mol ≈ 72 kJ/mol.'] }
  ],
  applications: [
    'Fit your own accelerated data to Arrhenius in [the stability calculator](#/tools/formulation/stability).','Setting expiry dates and storage statements ("store below 25 °C", "store in a refrigerator").', 'Planning products for hot and humid climate zones, where ICH conditions are 30 °C/75 % RH.', 'Cold-chain distribution of vaccines and biologics, and deciding what to do after a temperature excursion.', 'In-use shelf lives for reconstituted antibiotics, eye drops and multi-dose injections.'],
  history: 'Svante Arrhenius proposed his equation in 1889, from measurements of sugar inversion. Accelerated stability testing of medicines was put on a systematic footing by Takeru Higuchi and colleagues in the 1950s; the ICH stability guidelines, harmonising the United States, Europe and Japan, followed from 1993.',
  sim: ['ref-stability', 'ref-dissolution']
}

);
