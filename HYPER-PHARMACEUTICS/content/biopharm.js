/* HYPER-PHARMACEUTICS · content/biopharm.js — Biopharmaceutics: getting into the body (routes, absorption from the
 * gut, crossing membranes, first-pass metabolism, the BCS, food effects) and bioavailability and equivalence
 * (bioavailability, dissolution testing, f2, IVIVC, bioequivalence). Simulations in sims/biopharm.js (bph-*).
 * All drugs in examples are hypothetical or well-known teaching examples; nothing here is dosing guidance. */
Hyper.add(

{
  id: 'routes', parent: 'absorption-topic', title: 'Routes of administration', level: 1,
  short: 'Swallowed, injected, inhaled, under the tongue or through the skin: the route decides how fast a medicine reaches the blood, how much of it arrives, and whether the liver gets to it first.',
  keywords: ['route of administration', 'oral', 'intravenous', 'intramuscular', 'subcutaneous', 'sublingual', 'buccal', 'rectal', 'transdermal', 'inhaled', 'enteral', 'parenteral', 'onset', 'portal vein', 'flip-flop kinetics', 'tmax'],
  prereq: ['what-is-a-drug', 'adme', 'medicine:pharmacokinetics'],
  related: ['gi-absorption', 'first-pass', 'bioavailability', 'oral-absorption-pk', 'parenteral-routes', 'transdermal', 'inhalation', 'suppositories', 'depot-implants'],
  body: `
Where a medicine goes in decides most of what happens next: how quickly it reaches the blood, how much arrives, whether the liver destroys part of it first, and how long the effect lasts. Some medicines are meant to act only where they are put — eye drops, a steroid cream, an inhaler for the airways — and the route is chosen to keep the rest of the body out of it. Most act *systemically*, carried by the blood, and then the route is about getting enough drug into the circulation at the right speed.

### The main routes
**Enteral** routes use the gut (swallowed, under the tongue, rectal); **parenteral** routes bypass it (injections and infusions); skin, lungs and nose fall in between.

| Route | Into the blood | Typical bioavailability | Liver first? |
|---|---|---|---|
| Intravenous (IV) | at once | 100 % by definition | no |
| Intramuscular (IM), solution | peak in about 15–60 min | usually 75–100 % | no |
| Subcutaneous (SC) | peak in 0.5–2 h (days for antibodies) | often 50–100 % | no |
| Oral, swallowed | peak usually 0.5–3 h | from under 1 % to 100 % | **yes** |
| Sublingual or buccal | minutes | higher than oral for drugs the liver removes | no |
| Rectal | variable | variable | partly |
| Transdermal patch | slow and steady, hours to days | varies | no |
| Inhaled | seconds to minutes | acts in the lung; systemic share varies | no |

These are typical ranges, not properties of a particular medicine. Two pieces of anatomy explain the last column. Blood from the stomach and intestines drains into the **portal vein**, which runs to the liver before anywhere else, so a swallowed drug must survive [[first-pass|first-pass metabolism]]. Blood from the mouth drains straight towards the heart, which is why glyceryl trinitrate works under the tongue within a minute or two but hardly at all when swallowed. The rectum is split: its lower veins drain to the systemic circulation, its upper veins to the portal vein.

### Speed and shape
An intravenous bolus puts the whole dose in the blood at once, and the level only falls. Every other route adds an absorption step, often close to first order with rate constant $k_a$: the level rises, peaks when absorption and elimination balance, and falls. The peak comes at

$$t_{\\max} = \\frac{\\ln(k_a/k)}{k_a - k}$$

For a drug eliminated with $k = 0.1$ per hour (half-life about 7 h), an intramuscular solution with $k_a = 3$ per hour peaks at 1.2 h, a tablet with $k_a = 0.5$ per hour at 4.0 h, and a slow depot with $k_a = 0.05$ per hour at 14 h. When absorption is slower than elimination the falling limb reflects absorption, not elimination — the "flip-flop" that long-acting injections and implants rely on ([[depot-implants]]).

### Choosing a route
- **How fast?** Emergencies use intravenous, intraosseous, intranasal or inhaled routes; long-term treatment favours tablets.
- **Will the drug survive?** Proteins such as insulin and antibodies are digested in the gut, so they are injected.
- **Who is the patient?** Vomiting, unconsciousness or trouble swallowing call for another route; children often need liquids.
- **Where is the target?** Inhaled and topical routes deliver to the site with far less drug elsewhere.

> [!key] The same number of milligrams by two routes is not the same dose: bioavailability, first pass and speed all differ. Switching routes follows the product information and a prescriber's and pharmacist's decision, never a one-for-one swap.
`,
  ideas: [
    'Intravenous doses reach the blood completely and at once; every other route adds an absorption step.',
    'Swallowed drugs pass the gut wall and the liver (via the portal vein) before reaching the rest of the body.',
    'Sublingual, buccal, transdermal, inhaled and injected routes avoid the first pass; rectal avoids it in part.',
    'Slower absorption means a later, lower peak: t_max = ln(ka/k)/(ka − k).',
    'Doses are not interchangeable between routes.'
  ],
  pitfalls: [
    'A milligram is a milligram, whatever the route — Oral bioavailability can be anything from under 1 % to 100 %, so equal doses by different routes can give very different exposure.',
    'Injections always act faster than tablets — Intravenous doses do, but a subcutaneous antibody or an oily intramuscular depot may take days to peak; a sublingual tablet can beat an injection into muscle.',
    'Rectal drugs completely bypass the liver — Only the lower rectal veins drain to the systemic circulation; drug that reaches the upper rectum enters the portal system.'
  ],
  formulas: [
    {
      name: 'Time of the peak with first-order absorption',
      expr: 'tmax = ln(ka/k)/(ka - k)', tex: 't_{\\max} = \\dfrac{\\ln(k_a/k)}{k_a - k}',
      vars: {
        tmax: { name: 'time of the peak concentration', q: 'time', unit: 'h', tex: 't_{\\max}' },
        ka: { name: 'absorption rate constant', q: 'rate', unit: '1/h', value: 1.5, tex: 'k_a' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.1 }
      },
      note: 'One-compartment body, first-order absorption and elimination, ka ≠ k. The formula is symmetric in ka and k: the peak time alone cannot tell a fast absorption from a fast elimination.',
      practice: { unknowns: ['tmax', 'ka'] },
      stories: {
        tmax: 'A hypothetical tablet is absorbed with ka = {ka} and eliminated with k = {k}. When is the peak?',
        ka: 'A hypothetical drug eliminated with k = {k} peaks {tmax} after an intramuscular injection. What absorption rate constant does that imply?'
      }
    },
    {
      name: 'Oral dose for the same exposure as an injection',
      expr: 'Dpo = Div/F', tex: 'D_{\\mathrm{po}} = \\dfrac{D_{\\mathrm{iv}}}{F}',
      vars: {
        Dpo: { name: 'oral dose', q: 'mass', unit: 'mg', tex: 'D_{\\mathrm{po}}' },
        Div: { name: 'intravenous dose', q: 'mass', unit: 'mg', value: 10, tex: 'D_{\\mathrm{iv}}' },
        F: { name: 'oral bioavailability', q: 'ratio', unit: '%', value: 25, min: 0.1, max: 100 }
      },
      note: 'Equal AUC only, for linear kinetics with the same clearance; the oral peak is lower and later. An illustration — real conversions between routes follow the product information.',
      stories: {
        Dpo: 'A hypothetical drug has an oral bioavailability of {F}. What oral dose gives the same AUC as {Div} injected into a vein?',
        F: 'A hypothetical drug gives the same AUC after {Dpo} by mouth as after {Div} intravenously. What is its oral bioavailability?'
      }
    }
  ],
  examples: [
    {
      title: 'From injection to tablet',
      q: 'A hypothetical drug is given as 10 mg intravenously. By mouth its bioavailability is 25 %. What oral dose gives the same AUC, and will the blood levels look the same?',
      steps: [
        'The exposure is $\\mathrm{AUC} = F D/\\mathrm{CL}$. With the same clearance, equal AUC needs $F D_{\\mathrm{po}} = D_{\\mathrm{iv}}$: $D_{\\mathrm{po}} = 10/0.25 = 40$ mg.',
        'The curves still differ: the oral dose arrives over hours, so its peak is lower and later.',
        'If the drug is cleared by metabolism, 30 mg of the 40 mg is metabolised on the first pass — four times as much metabolite as after the injection, which matters if the metabolite is active or toxic.',
        'Real changes of route use the conversion in the product information and are checked by a pharmacist.'
      ],
      a: '40 mg by mouth for the same AUC, with a lower, later peak and more metabolite.'
    },
    {
      title: 'Three speeds of absorption',
      q: 'A hypothetical drug has an elimination rate constant of 0.1 per hour. When does its level peak after an intramuscular solution (ka = 3 per hour), a tablet (ka = 0.5 per hour) and a slow depot injection (ka = 0.05 per hour)?',
      steps: [
        'Intramuscular: $t_{\\max} = \\ln(30)/2.9 = 3.40/2.9 = 1.2$ h.',
        'Tablet: $t_{\\max} = \\ln(5)/0.4 = 1.61/0.4 = 4.0$ h.',
        'Depot: $t_{\\max} = \\ln(0.5)/(-0.05) = 0.693/0.05 = 13.9$ h. Here $k_a < k$: absorption is the slowest step and sets the slope of the falling limb (flip-flop kinetics).'
      ],
      a: 'About 1.2 h, 4.0 h and 14 h.'
    }
  ],
  quiz: [
    { q: 'Which route gives a bioavailability of 100 % by definition?', choices: ['intramuscular', 'intravenous', 'sublingual', 'inhaled'], a: 1, why: 'Bioavailability is measured against an intravenous dose, which enters the systemic circulation completely. Other routes can come close to 100 %, but that is measured, not defined.' },
    { q: 'Why does glyceryl trinitrate work under the tongue but hardly at all when swallowed?', choices: ['saliva activates it', 'the veins of the mouth bypass the liver, which removes nearly all of a swallowed dose', 'stomach acid destroys it instantly', 'it only crosses thin membranes'], a: 1, why: 'Swallowed, it reaches the liver through the portal vein and is almost entirely metabolised on the first pass. Absorbed in the mouth, it drains towards the heart and reaches the circulation intact.' },
    { q: 'A hypothetical drug has k = 0.2 per hour and is absorbed with ka = 2 per hour. When is the peak, in hours?', answer: 1.28, unit: 'h', why: 't_max = ln(2/0.2)/(2 − 0.2) = 2.303/1.8 = 1.28 h.' },
    { q: 'A suppository always avoids first-pass metabolism completely.', a: false, why: 'The lower rectal veins drain to the systemic circulation but the upper ones join the portal system, and where the drug spreads varies. The first pass is avoided only in part.' },
    { q: 'For a drug absorbed more slowly than it is eliminated (ka < k), the terminal slope of the log concentration–time curve after an oral dose reflects…', choices: ['elimination', 'absorption', 'distribution', 'nothing: the curve is flat'], a: 1, why: 'The slower of the two processes controls the tail. With ka < k the tail falls at the rate of absorption — flip-flop kinetics — and its "half-life" is really an absorption half-life.' }
  ],
  problems: [
    { q: 'A hypothetical drug has an intramuscular bioavailability of 80 %. What intramuscular dose gives the same AUC as 8 mg intravenously?', answer: 10, unit: 'mg', tol: 0.02, steps: ['Equal AUC with the same clearance: $F D_{\\mathrm{im}} = D_{\\mathrm{iv}}$.', '$D_{\\mathrm{im}} = 8/0.80 = 10$ mg — the same exposure, though the peak still comes later.'] },
    { q: 'A drug with an elimination rate constant of 0.15 per hour peaks 2.0 h after an oral dose. Estimate its absorption rate constant (per hour).', answer: 1.18, unit: '1/h', tol: 0.03, hint: 'Solve ln(ka/k)/(ka − k) = 2 numerically, trying values of ka.', steps: ['Try $k_a = 1$: $\\ln(6.67)/0.85 = 2.23$ h — too late, so absorption must be faster.', 'Try $k_a = 1.2$: $\\ln 8/1.05 = 1.98$ h — slightly early.', 'Interpolating, $k_a \\approx 1.18$ per hour: $\\ln(7.87)/1.03 = 2.063/1.03 = 2.00$ h.'] }
  ],
  applications: ['Emergency care, where intravenous, intraosseous, intranasal or inhaled routes save minutes.', 'Choosing sublingual, transdermal or injected forms for drugs the liver destroys on the first pass.', 'Liquids, suppositories and nasal sprays for children and for people who cannot swallow.', 'Long-acting injections and implants that release a drug over weeks or months.'],
  history: 'The hollow needle and syringe for injecting under the skin were developed independently in 1853 by Alexander Wood in Edinburgh and Charles Pravaz in France. The first transdermal patch, delivering hyoscine against motion sickness, was approved in the United States in 1979.',
  sim: 'bph-routes'
},

{
  id: 'gi-absorption', parent: 'absorption-topic', title: 'Absorption from the gut', level: 2,
  short: 'A swallowed drug must dissolve, survive the stomach and cross the lining of the small intestine — a surface of tens of square metres whose pH rises from about 1.5 to 7.5 along the way — within the few hours it spends there.',
  keywords: ['gastrointestinal absorption', 'small intestine', 'pH-partition hypothesis', 'un-ionised fraction', 'weak acid', 'weak base', 'Henderson–Hasselbalch', 'gastric emptying', 'intestinal transit', 'villi', 'effective permeability', 'Peff', 'fraction absorbed', 'absorption number', 'absorption window'],
  prereq: ['routes', 'ionisation-pka', 'dissolution-rate', 'medicine:digestion-absorption'],
  related: ['membrane-transport-pharm', 'first-pass', 'bcs', 'food-effects', 'ph-solubility', 'partition-logp', 'oral-absorption-pk', 'chemistry:henderson-hasselbalch'],
  body: `
A tablet swallowed with a glass of water starts a race against time. It must break up, its drug must dissolve, and the dissolved molecules must survive acid and enzymes, cross the single layer of cells that lines the gut and be carried off by the portal blood — all within the few hours the contents spend in the small intestine. The fraction of the dose that crosses the wall is the **fraction absorbed**, $F_a$; what then survives the gut wall and the liver is the subject of [[first-pass]].

### The road through the gut
| Region | pH (fasting) | Time spent there | What happens |
|---|---|---|---|
| Stomach | 1.5–2 (4–6 after a meal) | liquids half emptied in 10–20 min; with food, hours | tablets break up, weak bases dissolve; little absorption |
| Duodenum | about 6 | minutes | bile and pancreatic juice arrive |
| Jejunum | 6–7 | small intestine in all: 3–4 h | most drugs are absorbed here |
| Ileum | 7–7.5 | | carriers for bile acids and vitamin B₁₂ |
| Colon | 6–7 | 10–40 h or more | little fluid; slow absorption from modified-release forms |

The small intestine wins because of its surface: folds, finger-like villi and the microvilli of every cell multiply the area of a plain tube many times — a 2014 estimate put the whole gut lining near 30 m², far below the old "tennis court" but huge beside the stomach. It is richly supplied with blood and holds the drug for hours ([[medicine:digestion-absorption]]).

### The pH-partition hypothesis
Membranes are lipid, so the neutral, un-ionised form of a drug crosses far more easily than the charged one. For a weak acid, [[chemistry:henderson-hasselbalch|Henderson–Hasselbalch]] gives the un-ionised fraction

$$f_{\\mathrm{HA}} = \\frac{1}{1 + 10^{\\mathrm{pH} - \\mathrm{p}K_a}}$$

and for a weak base $f_{\\mathrm{B}} = 1/(1 + 10^{\\mathrm{p}K_a - \\mathrm{pH}})$. An acid of pKa 4.4 (close to ibuprofen) is 99.9 % un-ionised in the stomach at pH 1.5 but 0.8 % in the jejunum at pH 6.5; a base of pKa 9.5 (close to propranolol) is 0.1 % un-ionised at pH 6.5 and practically none in the stomach. The hypothesis, set out by Brodie, Shore, Schanker and colleagues in the 1950s, says acids are absorbed from the stomach and bases from the intestine.

Real guts are kinder than the arithmetic. Most weak acids are still absorbed mainly in the small intestine, because its area and time outweigh a hundredfold handicap in ionisation; the un-ionised fraction is replenished the instant some crosses; the layer at the cell surface is a little more acidic than the bulk; and small ions slip between cells or ride on carriers ([[membrane-transport-pharm]]). The hypothesis predicts direction, not amounts.

### From permeability to fraction absorbed
For a dissolved drug, what gets across depends on its effective permeability $P_{\\mathrm{eff}}$, measured in the human jejunum with perfusion tubes, and on the time available. Treating the small intestine as a tube of radius $R \\approx 1.75$ cm with a transit time $T_{si}$ of about 199 min, Gordon Amidon and colleagues found

$$F_a = 1 - e^{-2 P_{\\mathrm{eff}} T_{si}/R}$$

| $P_{\\mathrm{eff}}$ ($10^{-4}$ cm/s) | 0.1 | 0.5 | 1 | 2 | 4 |
|---|---|---|---|---|---|
| $F_a$ | 13 % | 49 % | 74 % | 93 % | over 99 % |

Near $2\\times10^{-4}$ cm/s absorption is essentially complete. Faster transit — diarrhoea, some laxatives — shortens $T_{si}$ and hurts poorly permeable drugs most.

> [!key] Absorption needs a dissolved drug, a permeable molecule and time: solubility and dissolution decide the first ([[bcs]]), lipophilicity, charge and size the second, gut transit the third.

> [!note] Some drugs are absorbed only in the upper small intestine — an "absorption window". A slow-release tablet may carry them past it, which is one reason for gastro-retentive forms ([[osmotic-pumps]]).
`,
  ideas: [
    'Most oral drugs are absorbed in the small intestine: huge surface, good blood flow and 3–4 hours of transit.',
    'Only the un-ionised form crosses lipid membranes easily; its fraction follows Henderson–Hasselbalch.',
    'The pH-partition hypothesis gives the direction of the effect, not the amount: surface and time dominate.',
    'For a dissolved drug, the fraction absorbed rises steeply with permeability: Fa = 1 − exp(−2·Peff·Tsi/R).',
    'Solubility, permeability and transit time are the three levers of oral absorption.'
  ],
  pitfalls: [
    'Weak acids are absorbed mainly from the stomach — They are more un-ionised there, but the small intestine\'s far larger surface and longer contact time usually win.',
    'A drug that is 99.9 % ionised at intestinal pH cannot be absorbed — The small un-ionised fraction is replenished continuously as it crosses; many basic drugs with pKa near 9–10 are absorbed almost completely.',
    'If a drug is absorbed, it reaches the blood — Absorbed drug still has to survive metabolism in the gut wall and liver; fraction absorbed is not bioavailability.'
  ],
  formulas: [
    {
      name: 'Un-ionised fraction of a weak acid',
      expr: 'fHA = 1/(1 + 10^(pH - pKa))', tex: 'f_{\\mathrm{HA}} = \\dfrac{1}{1 + 10^{\\mathrm{pH} - {\\mathrm{p}K}_a}}',
      vars: {
        fHA: { name: 'fraction un-ionised', q: 'ratio', unit: '%', tex: 'f_{\\mathrm{HA}}' },
        pH: { name: 'pH of the gut fluid', value: 6.5, min: 0, max: 14, tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the acid', value: 4.4, min: -2, max: 16, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'Henderson–Hasselbalch for an acid HA ⇌ H⁺ + A⁻. At pH = pKa half is un-ionised; each pH unit above the pKa cuts the un-ionised fraction about tenfold.',
      practice: { unknowns: ['fHA', 'pH'] },
      stories: {
        fHA: 'A hypothetical weak acid has a pKa of {pKa}. What fraction is un-ionised at pH {pH}?',
        pH: 'At what pH is a weak acid of pKa {pKa} only {fHA} un-ionised?'
      }
    },
    {
      name: 'Un-ionised fraction of a weak base',
      expr: 'fB = 1/(1 + 10^(pKa - pH))', tex: 'f_{\\mathrm{B}} = \\dfrac{1}{1 + 10^{{\\mathrm{p}K}_a - \\mathrm{pH}}}',
      vars: {
        fB: { name: 'fraction un-ionised', q: 'ratio', unit: '%', tex: 'f_{\\mathrm{B}}' },
        pKa: { name: 'pKa of the conjugate acid BH⁺', value: 9.5, min: -2, max: 16, tex: '{\\mathrm{p}K}_a' },
        pH: { name: 'pH of the gut fluid', value: 6.5, min: 0, max: 14, tex: '\\mathrm{pH}' }
      },
      note: 'For a base the pKa is that of its protonated form BH⁺. A base is mostly ionised whenever the pH is below its pKa.',
      practice: { unknowns: ['fB', 'pKa'] },
      stories: {
        fB: 'A hypothetical weak base has a pKa of {pKa}. What fraction is un-ionised at pH {pH}?',
        pKa: 'A weak base is {fB} un-ionised at pH {pH}. What is its pKa?'
      }
    },
    {
      name: 'Fraction absorbed from permeability (Amidon)',
      expr: 'Fa = 1 - exp(-2*Peff*Tsi/R)', tex: 'F_a = 1 - e^{-2 P_{\\mathrm{eff}} T_{si}/R}',
      vars: {
        Fa: { name: 'fraction of the dose absorbed', q: 'ratio', unit: '%', tex: 'F_a' },
        Peff: { name: 'effective jejunal permeability (1 µm/s = 10⁻⁴ cm/s)', q: 'speed', unit: 'µm/s', value: 2, tex: 'P_{\\mathrm{eff}}' },
        Tsi: { name: 'small-intestinal transit time', q: 'time', unit: 'min', value: 199, tex: 'T_{si}' },
        R: { name: 'radius of the small intestine', q: 'length', unit: 'cm', value: 1.75 }
      },
      note: 'For a drug already in solution, absorbed passively along a tube with plug flow. 2·Peff·Tsi/R is twice the absorption number An. Permeability is usually quoted in 10⁻⁴ cm/s, which is the same number as µm/s.',
      practice: { unknowns: ['Fa', 'Peff'] },
      stories: {
        Fa: 'A dissolved hypothetical drug has an effective permeability of {Peff} and the small intestine holds it for {Tsi}. What fraction is absorbed?',
        Peff: 'What effective permeability gives {Fa} absorption with a transit time of {Tsi}?'
      }
    }
  ],
  examples: [
    {
      title: 'An acid and a base along the gut',
      q: 'Compare the un-ionised fractions of a weak acid of pKa 4.4 and a weak base of pKa 9.5 in the fasting stomach (pH 1.5) and in the jejunum (pH 6.5). Where does the pH-partition hypothesis expect each to be absorbed, and what actually happens?',
      steps: [
        'Acid, stomach: $1/(1 + 10^{1.5 - 4.4}) = 1/(1 + 0.00126) = 99.9$ %. Acid, jejunum: $1/(1 + 10^{2.1}) = 1/126.9 = 0.79$ %.',
        'Base, stomach: $1/(1 + 10^{8}) \\approx 10^{-8}$ — none. Base, jejunum: $1/(1 + 10^{3}) = 0.10$ %.',
        'The hypothesis favours the stomach for the acid and the intestine for the base.',
        'In fact both are absorbed mainly in the small intestine: its surface is hundreds of times larger and the drug stays there for hours, while a fasting stomach empties liquids in minutes. Both kinds of drug can be almost completely absorbed.'
      ],
      a: 'Acid 99.9 % vs 0.8 % un-ionised, base none vs 0.1 %; both are absorbed mostly in the small intestine.'
    },
    {
      title: 'How permeable is permeable enough?',
      q: 'Using Amidon\'s tube model ($T_{si}$ = 199 min, $R$ = 1.75 cm), what fraction of a dissolved drug with $P_{\\mathrm{eff}} = 0.5\\times10^{-4}$ cm/s is absorbed? What permeability would give 90 %?',
      steps: [
        '$T_{si} = 199 \\times 60 = 11\\,940$ s. $2 P_{\\mathrm{eff}} T_{si}/R = 2 \\times 0.5\\times10^{-4} \\times 11\\,940/1.75 = 0.682$.',
        '$F_a = 1 - e^{-0.682} = 1 - 0.506 = 49$ %.',
        'For 90 %: $P_{\\mathrm{eff}} = -R\\ln(1 - 0.9)/(2 T_{si}) = 1.75 \\times 2.303/23\\,880 = 1.69\\times10^{-4}$ cm/s.'
      ],
      a: 'About 49 %; 90 % needs about 1.7 × 10⁻⁴ cm/s.'
    }
  ],
  quiz: [
    { q: 'Where is most of an oral dose of a typical weak acid absorbed?', choices: ['the mouth', 'the stomach, where it is un-ionised', 'the small intestine', 'the colon'], a: 2, why: 'Despite being mostly ionised at pH 6–7, the acid is absorbed mainly in the small intestine, whose surface area and transit time dwarf those of the stomach.' },
    { q: 'A weak base has a pKa of 8.5. What percentage is un-ionised at pH 6.5?', answer: 0.99, unit: '%', why: '1/(1 + 10^(8.5 − 6.5)) = 1/101 = 0.99 %.' },
    { q: 'A drug that is 99.9 % ionised at intestinal pH cannot be absorbed.', a: false, why: 'As the small un-ionised fraction crosses, the equilibrium restores it at once; with a big surface and hours of contact, many such drugs are absorbed almost completely.' },
    { q: 'In Amidon\'s model, doubling Peff from 0.5 to 1 × 10⁻⁴ cm/s raises the fraction absorbed from about 49 % to…', choices: ['55 %', '74 %', '98 %', '100 %'], a: 1, why: 'Fa = 1 − e^(−1.36) = 74 %. The gain is less than double because absorption saturates towards 100 %.' },
    { q: 'Rapid intestinal transit (diarrhoea) is most likely to reduce the absorption of…', choices: ['a highly permeable, highly soluble drug', 'a poorly permeable drug', 'a drug given intravenously', 'none: transit does not matter'], a: 1, why: 'A shorter T_si lowers Fa most where absorption is slow to begin with; a highly permeable drug is absorbed well before it leaves the small intestine.' }
  ],
  problems: [
    { q: 'What effective permeability, in µm/s (the same number as in 10⁻⁴ cm/s), gives a fraction absorbed of 85 % with T_si = 199 min and R = 1.75 cm?', answer: 1.39, unit: 'µm/s', tol: 0.02, steps: ['$P_{\\mathrm{eff}} = -R\\ln(1 - F_a)/(2T_{si}) = 1.75 \\times 1.897/(2 \\times 11\\,940)$.', '$= 3.320/23\\,880 = 1.39\\times10^{-4}$ cm/s = 1.39 µm/s.'] },
    { q: 'A weak acid of pKa 3.5 meets the slightly acidic layer at the surface of the intestinal cells, pH 5.5. What percentage is un-ionised there?', answer: 0.99, unit: '%', tol: 0.02, steps: ['$f_{\\mathrm{HA}} = 1/(1 + 10^{5.5 - 3.5}) = 1/101 = 0.99$ % — ten times more than in the bulk fluid at pH 6.5, which is part of why acids are absorbed better than the bulk pH suggests.'] }
  ],
  applications: ['Predicting where and how well a new molecule will be absorbed from its pKa, log P and permeability.', 'Designing prodrugs and salts that dissolve or permeate better.', 'Deciding when a slow-release form may miss an absorption window.', 'Understanding why diarrhoea, gut surgery or drugs that change gastric pH alter the absorption of some medicines.'],
  history: 'Bernard Brodie, Parkhurst Shore, Lewis Schanker and C. Adrian Hogben set out the pH-partition hypothesis in a series of studies in rats in 1957–1959. From the late 1980s and 1990s Gordon Amidon, Hans Lennernäs and colleagues modelled absorption from permeability and measured human jejunal permeability with intestinal perfusion tubes, linking it to the fraction absorbed.',
  sim: 'bph-ph-partition'
},

{
  id: 'membrane-transport-pharm', parent: 'absorption-topic', title: 'Crossing membranes: passive and carried', level: 2,
  short: 'Most drugs cross the gut wall by passive diffusion through the cell membranes, driven by the concentration difference (Fick\'s law); some ride on nutrient carriers that can be saturated, and efflux pumps such as P-glycoprotein push others back.',
  keywords: ['passive diffusion', 'Fick\'s law', 'permeability coefficient', 'transcellular', 'paracellular', 'tight junctions', 'carrier-mediated transport', 'PEPT1', 'P-glycoprotein', 'BCRP', 'efflux', 'saturable absorption', 'Michaelis–Menten', 'rule of five', 'ion trapping', 'endocytosis'],
  prereq: ['gi-absorption', 'diffusion-fick', 'partition-logp', 'biology:membrane-structure'],
  related: ['medicine:membrane-transport', 'biology:active-transport', 'biology:diffusion-osmosis', 'biology:endocytosis', 'drug-interactions', 'first-pass', 'bcs', 'nonlinear-pk'],
  body: `
The lining of the small intestine is a single layer of cells, the enterocytes, sealed to one another near their tops by tight junctions. A drug molecule in the gut fluid can cross it in four ways, and which one it uses decides how fast it gets through, whether the process saturates at high doses, and which other medicines can interfere ([[medicine:membrane-transport]]).

### Four ways across
1. **Passive transcellular diffusion** — through the lipid membranes of the cells, down the concentration gradient. Most drugs cross this way. It favours small, neutral, moderately lipophilic molecules and never saturates.
2. **Paracellular diffusion** — between the cells, through the water-filled tight junctions. Only small hydrophilic molecules fit, and the junctions are a tiny fraction of the surface, so this route matters mainly for small polar drugs.
3. **Carrier-mediated uptake** — solute carriers built for nutrients take drugs that resemble them. The peptide carrier PEPT1 carries some β-lactam antibiotics and the prodrug valaciclovir, whose valine ester lifts the bioavailability of aciclovir from roughly 15–20 % to about 55 %; amino-acid carriers take levodopa.
4. **Efflux** — pumps of the ABC family, above all P-glycoprotein (P-gp) and BCRP, sit on the gut side of the cells and push substrates back out, working hand in hand with the enzyme CYP3A4 inside the same cells.

Endocytosis carries large molecules in membrane bubbles ([[biology:endocytosis]]), but far too slowly to deliver useful doses of proteins by mouth.

### Passive diffusion: Fick's law
The flux across a membrane is proportional to the concentration difference, $J = P\\,\\Delta C$, and the permeability $P = DK/h$ combines how fast the molecule moves inside the membrane ($D$), how readily it leaves water for lipid (the partition coefficient $K$, related to [[partition-logp|log P]]) and the thickness $h$ ([[diffusion-fick]]). Christopher Lipinski's "rule of five" (1997) distils this: poor absorption is more likely with more than 5 hydrogen-bond donors, more than 10 acceptors, a molecular mass over 500 or a log P over 5. It is a warning light, not a law; carrier substrates and many natural products break it.

### Carriers saturate
A carrier behaves like an enzyme ([[biology:enzyme-kinetics]]):

$$J = \\frac{J_{\\max}\\,C}{K_m + C}$$

Below $K_m$ the flux rises in proportion to concentration; far above it the carrier is full and the flux levels off at $J_{\\max}$. The fraction of the dose absorbed then *falls* as the dose rises — reported, for example, for amoxicillin at high doses ([[nonlinear-pk]]). Efflux saturates the other way: a large dose can overwhelm P-gp, and a bigger share gets through.

### P-glycoprotein and interactions
P-gp was discovered in 1976 in cancer cells that had become resistant to many drugs at once. In the gut it limits the absorption of substrates such as digoxin; in the brain's capillaries it keeps many drugs out. A medicine that inhibits P-gp can raise the levels of a substrate; one that induces it can lower them ([[drug-interactions]]).

### Ion trapping
Only the un-ionised form crosses, so at equilibrium it is the un-ionised concentrations that are equal on both sides. When the pH differs, the totals are not: a weak base collects on the more acidic side, a weak acid on the more alkaline side. For a base of pKa 8.5 between plasma (pH 7.4) and acidic urine (pH 5.5) the equilibrium ratio is about 74 to 1. The same effect concentrates bases in the stomach and inside acidic lysosomes, and it is why changing urine pH changes how fast some drugs are excreted — used in hospital treatment of certain poisonings.

> [!warn] A suspected overdose or poisoning is an emergency: call your local emergency number or a poison centre at once, and keep the medicine's packaging to show them.
`,
  ideas: [
    'Most drugs cross the gut wall by passive transcellular diffusion: J = P·ΔC, never saturating.',
    'Carriers built for nutrients take some drugs; they saturate, J = Jmax·C/(Km + C), so absorption can be dose-dependent.',
    'Efflux pumps (P-glycoprotein, BCRP) push substrates back into the gut and are a common source of interactions.',
    'Only the un-ionised form equilibrates across membranes, so weak bases collect on acidic sides and weak acids on alkaline ones.',
    'The rule of five flags molecules likely to be poorly absorbed by passive diffusion.'
  ],
  pitfalls: [
    'Doubling a dose always doubles the amount absorbed — Not when a carrier saturates: absorption by uptake carriers grows less than proportionally, and saturating an efflux pump can make it grow more.',
    'Lipophilic is always better — Very lipophilic molecules dissolve poorly in the gut fluid and stick in membranes; permeability is highest at intermediate log P, roughly 1 to 3.',
    'Ion trapping means the ionised form crosses and gets stuck — It is the other way round: the un-ionised form crosses freely and equalises, and the ionised form accumulates on the side where the pH favours it.'
  ],
  formulas: [
    {
      name: 'Fick\'s law for flux through a membrane',
      expr: 'J = P*dC', tex: 'J = P\\,\\Delta C',
      vars: {
        J: { name: 'flux per unit area', q: false, unit: 'µg/(cm²·h)' },
        P: { name: 'permeability coefficient', q: false, unit: 'cm/h', value: 0.72 },
        dC: { name: 'concentration difference across the membrane', q: false, unit: 'µg/mL', value: 100, tex: '\\Delta C' }
      },
      note: 'Units are consistent because 1 mL = 1 cm³: cm/h × µg/cm³ = µg/(cm²·h). 0.72 cm/h is 2 × 10⁻⁴ cm/s, a well-absorbed drug. Multiply by the area to get the amount crossing per hour.',
      stories: {
        J: 'A hypothetical drug with permeability {P} has a concentration difference of {dC} across the gut wall. What is the flux?',
        P: 'A flux of {J} is measured across a cell layer with {dC} on one side and almost none on the other. What is the permeability?'
      }
    },
    {
      name: 'Carrier-mediated flux (saturable)',
      expr: 'J = Jmax*C/(Km + C)', tex: 'J = \\dfrac{J_{\\max}\\,C}{K_m + C}',
      vars: {
        J: { name: 'flux through the carrier', q: false, unit: 'nmol/(cm²·min)' },
        Jmax: { name: 'maximum flux (carrier saturated)', q: false, unit: 'nmol/(cm²·min)', value: 10, tex: 'J_{\\max}' },
        C: { name: 'drug concentration at the membrane', q: false, unit: 'mM', value: 1 },
        Km: { name: 'Michaelis constant (half-saturating concentration)', q: false, unit: 'mM', value: 2, tex: 'K_m' }
      },
      note: 'The Michaelis–Menten form. Well below Km the flux is proportional to C (like passive diffusion); well above it, it approaches Jmax and further increases in concentration add little.',
      practice: { unknowns: ['J', 'C', 'Km'] },
      stories: {
        J: 'A carrier with Jmax = {Jmax} and Km = {Km} meets a drug at {C}. What is the flux?',
        C: 'At what concentration does a carrier with Jmax = {Jmax} and Km = {Km} carry a flux of {J}?',
        Km: 'A carrier with a maximum flux of {Jmax} carries {J} when the drug is at {C}. What is its Km?'
      }
    },
    {
      name: 'Ion trapping of a weak base at equilibrium',
      expr: 'Rt = (1 + 10^(pKa - pH2))/(1 + 10^(pKa - pH1))', tex: 'R_t = \\dfrac{1 + 10^{{\\mathrm{p}K}_a - \\mathrm{pH}_2}}{1 + 10^{{\\mathrm{p}K}_a - \\mathrm{pH}_1}}',
      vars: {
        Rt: { name: 'ratio of total concentrations, side 2 : side 1', tex: 'R_t' },
        pKa: { name: 'pKa of the base', value: 8.5, min: -2, max: 16, tex: '{\\mathrm{p}K}_a' },
        pH2: { name: 'pH on side 2 (e.g. urine)', value: 5.5, min: 0, max: 14, tex: '\\mathrm{pH}_2' },
        pH1: { name: 'pH on side 1 (e.g. plasma)', value: 7.4, min: 0, max: 14, tex: '\\mathrm{pH}_1' }
      },
      note: 'Only the un-ionised base crosses, so its concentration is equal on both sides at equilibrium; each total is that times (1 + 10^(pKa − pH)). For a weak acid, swap the signs of the exponents: (1 + 10^(pH − pKa)).',
      practice: { unknowns: ['Rt', 'pH2'] },
      stories: {
        Rt: 'A hypothetical weak base of pKa {pKa} equilibrates between plasma at pH {pH1} and urine at pH {pH2}. What is the urine-to-plasma ratio of total drug?',
        pH2: 'What urine pH would make the urine-to-plasma ratio of a base of pKa {pKa} equal to {Rt}, with plasma at pH {pH1}?'
      }
    }
  ],
  examples: [
    {
      title: 'Saturating a carrier',
      q: 'A hypothetical drug is taken up by a carrier with Km = 2 mM and Jmax = 10 nmol/(cm²·min). Find the flux, and the flux per unit concentration, when the drug in the gut is at 0.5, 2 and 20 mM.',
      steps: [
        '0.5 mM: $J = 10 \\times 0.5/2.5 = 2.0$; per mM, 4.0.',
        '2 mM: $J = 10 \\times 2/4 = 5.0$ — half of Jmax, as expected at C = Km; per mM, 2.5.',
        '20 mM: $J = 10 \\times 20/22 = 9.1$; per mM, only 0.45.',
        'A fortyfold rise in concentration raises the flux less than fivefold: the efficiency falls ninefold, so the fraction of a large dose that is absorbed drops.'
      ],
      a: 'Fluxes of 2.0, 5.0 and 9.1 nmol/(cm²·min); the carrier saturates and a large dose is absorbed less efficiently.'
    },
    {
      title: 'Trapped in the urine',
      q: 'A hypothetical weak base of pKa 8.5 equilibrates between plasma (pH 7.4) and urine. Compare the urine-to-plasma ratio of total drug when the urine is acidic (pH 5.5) and when it is alkaline (pH 7.5).',
      steps: [
        'Plasma factor: $1 + 10^{8.5 - 7.4} = 1 + 12.6 = 13.6$.',
        'Acidic urine: $1 + 10^{3} = 1001$, ratio $1001/13.6 = 74$.',
        'Alkaline urine: $1 + 10^{1} = 11$, ratio $11/13.6 = 0.81$.',
        'Acidic urine holds about ninety times more of the base at equilibrium, so the kidney excretes it much faster; alkaline urine does the same for weak acids.'
      ],
      a: 'About 74 : 1 in acidic urine against 0.8 : 1 in alkaline urine.'
    }
  ],
  quiz: [
    { q: 'Which way across the gut wall cannot be saturated?', choices: ['peptide carrier PEPT1', 'passive transcellular diffusion', 'P-glycoprotein efflux', 'amino-acid carriers'], a: 1, why: 'Passive diffusion depends only on the concentration difference and the permeability; there is no binding site to fill.' },
    { q: 'A medicine that inhibits intestinal P-glycoprotein is taken with digoxin, a P-gp substrate. What happens to digoxin exposure?', choices: ['it falls', 'it rises', 'no change: P-gp only works in the brain', 'digoxin becomes ionised'], a: 1, why: 'Less digoxin is pumped back into the gut, so more is absorbed and blood levels rise — a well-known interaction that product information warns about.' },
    { q: 'With the carrier model, what is the flux when C = Km?', choices: ['Jmax', 'Jmax/2', 'Jmax/4', 'zero'], a: 1, why: 'J = Jmax·Km/(Km + Km) = Jmax/2 — the definition of Km.' },
    { q: 'At equilibrium across a membrane with a pH difference, the ionised concentrations are equal on both sides.', a: false, why: 'The un-ionised concentrations are equal, because only that form crosses. The ionised amounts differ with pH — which is what traps the drug.' },
    { q: 'Which molecule is most likely to be poorly absorbed by passive diffusion?', choices: ['mass 320, log P 2, 2 H-bond donors', 'mass 650, log P 6, 7 H-bond donors', 'mass 180, log P 1.5, 1 H-bond donor', 'mass 410, log P 3, 3 H-bond donors'], a: 1, why: 'It breaks three of Lipinski\'s limits (mass over 500, log P over 5, more than 5 donors). The rule is a warning, not a verdict.' }
  ],
  problems: [
    { q: 'A carrier has Jmax = 8 nmol/(cm²·min). At 1.5 mM it carries 3 nmol/(cm²·min). What is its Km, in mM?', answer: 2.5, unit: 'mM', tol: 0.02, steps: ['$J(K_m + C) = J_{\\max} C$, so $K_m = C(J_{\\max} - J)/J$.', '$K_m = 1.5 \\times 5/3 = 2.5$ mM.'] },
    { q: 'A hypothetical weak base of pKa 9.0 equilibrates between plasma (pH 7.4) and the fasting stomach (pH 2.0). What is the stomach-to-plasma ratio of total drug?', answer: 2.45e5, tol: 0.03, steps: ['Stomach: $1 + 10^{7} \\approx 1.0\\times10^{7}$. Plasma: $1 + 10^{1.6} = 40.8$.', 'Ratio $= 10^{7}/40.8 = 2.45\\times10^{5}$ — bases given by injection diffuse into the stomach and are trapped there.'] }
  ],
  applications: ['Designing prodrugs that borrow nutrient carriers, such as valine esters taken up by PEPT1.', 'Predicting transporter interactions (P-gp, BCRP) during drug development.', 'Explaining dose-dependent absorption and non-linear pharmacokinetics.', 'Understanding why urine pH changes the excretion of some drugs, and the distribution of weak bases into acidic compartments.'],
  history: 'Rudolph Juliano and Victor Ling discovered P-glycoprotein in 1976 in drug-resistant hamster cells, naming it for its role in permeability. Christopher Lipinski and colleagues at Pfizer published the rule of five in 1997 from an analysis of thousands of compounds that had reached clinical trials.',
  sim: 'bph-ph-partition'
},

{
  id: 'first-pass', parent: 'absorption-topic', title: 'First-pass metabolism', level: 2,
  short: 'Before a swallowed drug reaches the rest of the body it passes the enzymes of the gut wall and then the liver. The fraction that survives, F = fa·fg·fh, can be almost all of the dose or under 1 % of it.',
  keywords: ['first-pass effect', 'presystemic metabolism', 'hepatic extraction ratio', 'gut-wall metabolism', 'CYP3A4', 'portal vein', 'well-stirred model', 'intrinsic clearance', 'hepatic blood flow', 'high-extraction drug', 'portosystemic shunt', 'prodrug', 'grapefruit juice', 'bioavailability'],
  prereq: ['gi-absorption', 'clearance', 'medicine:liver-function'],
  related: ['hepatic-clearance', 'bioavailability', 'routes', 'membrane-transport-pharm', 'drug-interactions', 'food-effects', 'pharmacogenomics'],
  body: `
Everything absorbed from the stomach and intestines is collected by the **portal vein** and delivered to the liver before it reaches the heart and the rest of the body. On the way the drug passes two sets of enzymes — inside the cells of the gut wall, and in the liver — and whatever they remove on this first passage never reaches the systemic circulation. That is **first-pass** (presystemic) metabolism, and it makes oral bioavailability a product of three survival fractions:

$$F = f_a\\,f_g\\,f_h$$

the fraction absorbed into the gut wall, the fraction escaping the gut wall, and the fraction escaping the liver ([[medicine:liver-function]]).

### The liver as a filter
Blood flows through the liver at about 1.5 L/min — some 90 L/h. The **hepatic extraction ratio** $E_H$ is the fraction removed in one pass, the hepatic clearance is $\\mathrm{CL}_H = Q_H E_H$ ([[hepatic-clearance]]), and what escapes is $f_h = 1 - E_H = 1 - \\mathrm{CL}_H/Q_H$. So a drug's clearance after an injection already caps what it can achieve by mouth. The **well-stirred model** links extraction to the enzymes' capacity, the intrinsic clearance $\\mathrm{CL}_{\\mathrm{int}}$, and to the unbound fraction in blood $f_u$:

$$E_H = \\frac{f_u\\,\\mathrm{CL}_{\\mathrm{int}}}{Q_H + f_u\\,\\mathrm{CL}_{\\mathrm{int}}}$$

| Teaching example | Hepatic extraction | Oral bioavailability, roughly |
|---|---|---|
| glyceryl trinitrate | very high | under 1 % — given under the tongue or as a patch |
| lidocaine | about 0.7 | about 35 % — not used by mouth for the heart |
| propranolol | about 0.7 | about 25 % |
| verapamil | about 0.8 | 20–35 % |
| warfarin | under 0.01 | close to 100 % |

Figures vary between sources and between people; they show the range, not doses.

### High extraction magnifies small changes
With $E_H = 0.9$ only 10 % escapes. If an interacting medicine or liver disease lowers the extraction to 0.8, 20 % escapes — oral exposure doubles, while an injected dose barely notices. In cirrhosis, blood also bypasses the liver through collateral vessels (portosystemic shunts), and the oral bioavailability of high-extraction drugs can rise several-fold. For a low-extraction drug, extraction falling from 0.10 to 0.05 moves $f_h$ only from 90 % to 95 %. The well-stirred model gives a neat summary: for a drug cleared only by the liver, the oral AUC is $f_a f_g D/(f_u\\mathrm{CL}_{\\mathrm{int}})$ — independent of liver blood flow and inversely proportional to the enzymes' activity.

### The gut wall
Enterocytes contain CYP3A4 and conjugating enzymes. With P-glycoprotein recycling the drug past them again and again ([[membrane-transport-pharm]]), they can remove as much as the liver for some substrates, such as ciclosporin, felodipine and simvastatin. Grapefruit juice inactivates intestinal CYP3A4 for about a day, until new enzyme is made ([[food-effects]]).

### Avoiding or using the first pass
Sublingual, buccal, transdermal, inhaled and injected routes skip it ([[routes]]). Some medicines need it: **prodrugs** such as enalapril (to enalaprilat) and clopidogrel (to its active metabolite) are activated by liver enzymes, so inherited differences in those enzymes change the response ([[pharmacogenomics]]).

> [!note] Many interactions between medicines, and with grapefruit, act through first-pass enzymes and transporters. They are listed in the product information, and a pharmacist can check any combination.
`,
  ideas: [
    'All drug absorbed from the gut reaches the liver through the portal vein before the rest of the body.',
    'Oral bioavailability is a product of survival fractions: F = fa·fg·fh.',
    'The liver cannot let through more than 1 − CL_H/Q_H of what reaches it, so injected clearance caps oral bioavailability.',
    'High-extraction drugs have low, variable oral bioavailability that is very sensitive to enzyme inhibition and liver disease.',
    'The gut wall (CYP3A4 with P-glycoprotein) can contribute as much first-pass loss as the liver.'
  ],
  pitfalls: [
    'Low bioavailability means poor absorption — A drug can be completely absorbed and still reach the circulation at 10 % because the gut wall and liver remove the rest.',
    'Inhibiting a liver enzyme affects oral and injected doses equally — For a high-extraction drug, inhibition mainly raises the oral exposure (by letting more escape the first pass); the clearance after an injection, limited by blood flow, changes little.',
    'First-pass metabolism is always a nuisance — Prodrugs are designed to be activated by it, and it protects the body from much of what is swallowed.'
  ],
  formulas: [
    {
      name: 'Oral bioavailability as three filters',
      expr: 'F = fa*fg*fh', tex: 'F = f_a\\,f_g\\,f_h',
      vars: {
        F: { name: 'oral bioavailability', q: 'ratio', unit: '%', min: 0, max: 100 },
        fa: { name: 'fraction absorbed into the gut wall', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'f_a' },
        fg: { name: 'fraction escaping gut-wall metabolism', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: 'f_g' },
        fh: { name: 'fraction escaping the liver (1 − E_H)', q: 'ratio', unit: '%', value: 40, min: 0, max: 100, tex: 'f_h' }
      },
      practice: { unknowns: ['F', 'fg', 'fh'] },
      stories: {
        F: 'A hypothetical drug is {fa} absorbed; {fg} escapes the gut wall and {fh} escapes the liver. What is its oral bioavailability?',
        fh: 'A hypothetical drug has an oral bioavailability of {F}; it is {fa} absorbed and {fg} escapes the gut wall. What fraction escapes the liver?'
      }
    },
    {
      name: 'Hepatic extraction: the well-stirred model',
      expr: 'EH = fu*CLint/(QH + fu*CLint)', tex: 'E_H = \\dfrac{f_u\\,\\mathrm{CL}_{\\mathrm{int}}}{Q_H + f_u\\,\\mathrm{CL}_{\\mathrm{int}}}',
      vars: {
        EH: { name: 'hepatic extraction ratio', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'E_H' },
        fu: { name: 'unbound fraction in blood', q: 'ratio', unit: '%', value: 20, min: 0, max: 100, tex: 'f_u' },
        CLint: { name: 'intrinsic clearance of the liver enzymes', q: 'flowrate', unit: 'L/h', value: 1800, tex: '\\mathrm{CL}_{\\mathrm{int}}' },
        QH: { name: 'liver blood flow', q: 'flowrate', unit: 'L/h', value: 90, tex: 'Q_H' }
      },
      note: 'The liver is treated as one well-mixed pool whose outflow concentration equals that inside it. When fu·CLint ≫ Q_H the extraction approaches 1 and clearance is limited by blood flow; when fu·CLint ≪ Q_H it is limited by the enzymes and binding.',
      practice: { unknowns: ['EH', 'CLint'] },
      stories: {
        EH: 'A hypothetical drug is {fu} unbound in blood and its liver enzymes have an intrinsic clearance of {CLint}; liver blood flow is {QH}. What fraction does the liver extract in one pass?',
        CLint: 'A hypothetical drug, {fu} unbound, has a hepatic extraction ratio of {EH} with liver blood flow {QH}. What is its intrinsic clearance?'
      }
    },
    {
      name: 'Most that can escape the liver',
      expr: 'FH = 1 - CLH/QH', tex: 'F_H = 1 - \\dfrac{\\mathrm{CL}_H}{Q_H}',
      vars: {
        FH: { name: 'fraction escaping hepatic first pass', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'F_H' },
        CLH: { name: 'hepatic blood clearance (from an injected dose)', q: 'flowrate', unit: 'L/h', value: 60, tex: '\\mathrm{CL}_H' },
        QH: { name: 'liver blood flow', q: 'flowrate', unit: 'L/h', value: 90, tex: 'Q_H' }
      },
      note: 'The ceiling on oral bioavailability for a drug cleared only by the liver, assuming complete absorption and no gut-wall loss. Use blood clearance, not plasma clearance.',
      stories: {
        FH: 'After an injection a hypothetical drug has a hepatic blood clearance of {CLH}. With liver blood flow {QH}, what is the most its oral bioavailability can be?',
        CLH: 'A hypothetical drug, completely absorbed and cleared only by the liver, has an oral bioavailability of {FH} with liver blood flow {QH}. What is its hepatic clearance?'
      }
    }
  ],
  examples: [
    {
      title: 'A high-extraction drug meets an inhibitor',
      q: 'A hypothetical drug is cleared only by the liver with an extraction ratio of 0.90 (liver blood flow 90 L/h). Another medicine halves the intrinsic clearance of the liver enzymes. By how much do oral and intravenous exposure change?',
      steps: [
        'Before: $f_u\\mathrm{CL}_{\\mathrm{int}} = E_H Q_H/(1 - E_H) = 0.9 \\times 90/0.1 = 810$ L/h; $\\mathrm{CL}_H = 81$ L/h; $f_h = 10$ %.',
        'After: $f_u\\mathrm{CL}_{\\mathrm{int}} = 405$ L/h, so $E_H = 405/495 = 0.818$; $\\mathrm{CL}_H = 73.6$ L/h; $f_h = 18.2$ %.',
        'Intravenous AUC ∝ $1/\\mathrm{CL}_H$: up by $81/73.6 = 1.10$ — ten per cent.',
        'Oral AUC ∝ $f_h/\\mathrm{CL}_H$: $0.100/81 \\to 0.182/73.6$, up by a factor of 2.0 — exactly the halving of the enzymes, as the well-stirred model predicts.'
      ],
      a: 'Intravenous exposure rises about 10 %; oral exposure doubles.'
    },
    {
      title: 'Three filters in a row',
      q: 'A hypothetical drug is 90 % absorbed, gut-wall enzymes remove 40 % of what enters the cells, and the liver extracts 60 % of what reaches it. What is its oral bioavailability?',
      steps: [
        '$f_a = 0.90$, $f_g = 1 - 0.40 = 0.60$, $f_h = 1 - 0.60 = 0.40$.',
        '$F = 0.90 \\times 0.60 \\times 0.40 = 0.216$.',
        'Only about a fifth of the dose reaches the circulation — although nine-tenths was absorbed.'
      ],
      a: 'About 22 %.'
    }
  ],
  quiz: [
    { q: 'A drug is completely absorbed; half escapes the gut wall and half of that escapes the liver. What is its oral bioavailability, in per cent?', answer: 25, unit: '%', why: 'F = 1 × 0.5 × 0.5 = 0.25.' },
    { q: 'Whose oral exposure rises most when a liver enzyme is inhibited?', choices: ['a drug with an extraction ratio of 0.05', 'a drug with an extraction ratio of 0.9', 'a drug excreted unchanged by the kidneys', 'a drug given only intravenously'], a: 1, why: 'For a high-extraction drug the fraction escaping the liver is small, so a modest fall in extraction multiplies it; oral AUC is proportional to 1/(fu·CLint).' },
    { q: 'A drug with 10 % oral bioavailability must be poorly absorbed.', a: false, why: 'It may be completely absorbed and then removed by the gut wall and liver. Only a comparison with fraction absorbed (for example from a mass-balance study) tells the two apart.' },
    { q: 'After an injection a drug has a hepatic blood clearance of 45 L/h; liver blood flow is 90 L/h. What is the highest its oral bioavailability can be, in per cent?', answer: 50, unit: '%', why: 'F_H = 1 − 45/90 = 0.5, and gut-wall loss or incomplete absorption can only lower it further.' },
    { q: 'Why can cirrhosis of the liver raise the oral bioavailability of propranolol several-fold?', choices: ['the kidneys take over', 'portal blood bypasses the liver through collateral vessels, and the remaining liver extracts less', 'propranolol is absorbed faster', 'protein binding stops'], a: 1, why: 'Portosystemic shunts carry absorbed drug straight into the systemic circulation, and the damaged liver has less enzyme — both raise f_h for a high-extraction drug.' }
  ],
  problems: [
    { q: 'A hypothetical drug is 5 % unbound in blood, its liver enzymes have an intrinsic clearance of 600 L/h, and liver blood flow is 90 L/h. What is its hepatic extraction ratio, in per cent?', answer: 25, unit: '%', tol: 0.02, steps: ['$f_u\\mathrm{CL}_{\\mathrm{int}} = 0.05 \\times 600 = 30$ L/h.', '$E_H = 30/(90 + 30) = 0.25$: a low-to-intermediate extraction drug; up to 75 % could escape the liver.'] }
  ],
  applications: ['Choosing sublingual, transdermal or injected routes for high-extraction drugs.', 'Predicting interactions with enzyme inhibitors and inducers, and with grapefruit juice.', 'Adjusting expectations in liver disease, where oral bioavailability of high-extraction drugs can rise sharply.', 'Designing prodrugs that the liver activates.'],
  history: 'Malcolm Rowland showed in 1972 how the route of administration changes the availability of a drug removed by the liver, and with Leslie Benet and Garry Graham set out the well-stirred model of hepatic clearance in 1973. The grapefruit interaction was found by chance in 1989, when David Bailey\'s group used the juice to mask the taste of alcohol in a study of felodipine.',
  sim: 'bph-first-pass'
},

{
  id: 'bcs', parent: 'absorption-topic', title: 'The Biopharmaceutics Classification System', level: 2,
  short: 'The BCS sorts drugs into four classes by two properties — whether the highest dose dissolves in 250 mL across the gut\'s pH range, and whether at least 85 % of a dose is absorbed. It tells formulators what limits absorption and regulators when a dissolution test can replace a study in people.',
  keywords: ['BCS', 'Biopharmaceutics Classification System', 'solubility', 'permeability', 'dose number', 'class I', 'class II', 'class III', 'class IV', 'biowaiver', 'ICH M9', '250 mL', 'rapidly dissolving', 'BDDCS', 'maximum absorbable dose', 'developability classification'],
  prereq: ['gi-absorption', 'solubility-pharm', 'ph-solubility', 'membrane-transport-pharm'],
  related: ['dissolution-testing', 'f2-similarity', 'bioequivalence', 'food-effects', 'ivivc', 'particle-size', 'solid-state', 'complexation'],
  body: `
In 1995 Gordon Amidon, Hans Lennernäs, Vinod Shah and John Crison proposed a simple idea: the oral absorption of an immediate-release drug is governed by two things — whether the dose can **dissolve** in the gut fluid, and whether the dissolved drug can **permeate** the gut wall. Sort drugs by those two properties and you know what limits absorption, where formulation matters, and when a laboratory dissolution test can stand in for a study in people.

### Two questions
**Is it highly soluble?** Yes if the highest single therapeutic dose dissolves in 250 mL or less of aqueous buffer at every pH from 1.2 to 6.8, at 37 °C. The 250 mL is the glass of water given with the dose in bioequivalence studies. Put another way, the **dose number** $D_0 = M_0/(V_0 C_s)$ is at most 1, with $C_s$ the *lowest* solubility over that range ([[ph-solubility]]).

**Is it highly permeable?** Yes if at least 85 % of the dose is absorbed in people, shown by a mass-balance or absolute bioavailability study, or supported by validated cell-layer or perfusion data ([[gi-absorption]]). Earlier FDA guidance set the bar at 90 %.

| Class | Solubility | Permeability | What limits absorption | Often cited examples |
|---|---|---|---|---|
| I | high | high | usually gastric emptying | metoprolol, propranolol, paracetamol |
| II | low | high | dissolution, solubility | ibuprofen, carbamazepine, glibenclamide |
| III | high | low | permeability | metformin, atenolol, cimetidine |
| IV | low | low | both | furosemide, hydrochlorothiazide |

These are textbook examples; classifications differ between sources because they depend on the dose and on how the data are judged.

### What each class tells a formulator
- **Class I** behaves almost like a solution if the tablet dissolves quickly; formulation changes rarely matter.
- **Class II** is where formulation earns its keep: smaller particles ([[particle-size]]), salts, amorphous solid dispersions ([[solid-state]]), cyclodextrins ([[complexation]]) and lipid systems all raise the dissolved concentration. These drugs often show positive [[food-effects]].
- **Class III** drugs dissolve at once; excipients that change transit or permeability matter more than dissolution.
- **Class IV** drugs are hard work; their absorption is often incomplete and variable.

### Biowaivers
Under the harmonised ICH M9 guideline (2019), an immediate-release product of a class I drug can be approved without a bioequivalence study in people if test and reference both dissolve rapidly — at least 85 % in 30 minutes at pH 1.2, 4.5 and 6.8 — with similar profiles ([[f2-similarity]]). Class III drugs qualify only if both dissolve very rapidly (85 % in 15 minutes) and the excipients are qualitatively the same and quantitatively similar. Narrow-therapeutic-index drugs and products absorbed in the mouth are excluded.

### Beyond four boxes
Three dimensionless numbers make the picture quantitative: the dose number, the dissolution number (time available over time needed to dissolve) and the absorption number. The **maximum absorbable dose**, $\\mathrm{MAD} = S\\,k_a\\,V_{si}\\,T_{si}$, estimates how much could be absorbed if the intestinal fluid stayed saturated for the whole transit. Later schemes refine the idea: the BDDCS (Wu and Benet, 2005) uses the extent of metabolism instead of permeability and predicts transporter effects; the developability classification (Butler and Dressman, 2010) splits class II into dissolution-limited IIa and solubility-limited IIb.

> [!key] A weak acid is least soluble at pH 1.2 and a weak base at pH 6.8; the BCS judges each drug at its worst.
`,
  ideas: [
    'Two properties — solubility of the dose in 250 mL over pH 1.2–6.8, and fraction absorbed ≥ 85 % — define four classes.',
    'The dose number D0 = M0/(V0·Cs) above 1 means the dose cannot dissolve in a glass of water at the worst pH.',
    'Class II drugs are dissolution-limited, so formulation (particle size, solid form, solubilisers) changes their absorption.',
    'Class I (and, strictly, class III) drugs can qualify for biowaivers based on dissolution tests (ICH M9, 2019).',
    'The maximum absorbable dose, S·ka·V·T, shows when a dose is simply too large to dissolve and be absorbed.'
  ],
  pitfalls: [
    'Solubility is judged where the drug dissolves best — The BCS uses the lowest solubility between pH 1.2 and 6.8: pH 1.2 for a weak acid, pH 6.8 for a weak base.',
    'A drug\'s class is a fixed property of the molecule — It depends on the dose: the same molecule can be highly soluble at a 10 mg strength and poorly soluble at 500 mg.',
    'Low permeability means the drug cannot be given by mouth — Many class III drugs, such as metformin, are effective oral medicines; they are simply absorbed incompletely and more variably.'
  ],
  formulas: [
    {
      name: 'Dose number',
      expr: 'D0 = M0/(V0*Cs)', tex: 'D_0 = \\dfrac{M_0}{V_0\\,C_s}',
      vars: {
        D0: { name: 'dose number (≤ 1: highly soluble)', tex: 'D_0' },
        M0: { name: 'highest single dose', q: false, unit: 'mg', value: 400, tex: 'M_0' },
        V0: { name: 'volume of fluid (BCS: 250 mL)', q: false, unit: 'mL', value: 250, fixed: true, tex: 'V_0' },
        Cs: { name: 'lowest solubility over pH 1.2–6.8', q: false, unit: 'mg/mL', value: 0.05, tex: 'C_s' }
      },
      note: 'D0 is the number of 250 mL glasses needed to dissolve the dose at the least favourable pH.',
      practice: { unknowns: ['D0', 'Cs'] },
      stories: {
        D0: 'A hypothetical drug\'s highest dose is {M0} and its lowest solubility between pH 1.2 and 6.8 is {Cs}. What is its dose number in {V0}?',
        Cs: 'What minimum solubility would make a dose of {M0} highly soluble with a dose number of {D0} in {V0}?'
      }
    },
    {
      name: 'Maximum absorbable dose',
      expr: 'MAD = S*ka*Vsi*Tsi', tex: '\\mathrm{MAD} = S\\,k_a\\,V_{si}\\,T_{si}',
      vars: {
        MAD: { name: 'maximum absorbable dose', q: false, unit: 'mg', tex: '\\mathrm{MAD}' },
        S: { name: 'solubility at intestinal pH', q: false, unit: 'mg/mL', value: 0.1 },
        ka: { name: 'absorption rate constant (≈ 2·Peff/R)', q: false, unit: '1/min', value: 0.03, tex: 'k_a' },
        Vsi: { name: 'small-intestinal water volume', q: false, unit: 'mL', value: 250, fixed: true, tex: 'V_{si}' },
        Tsi: { name: 'small-intestinal transit time', q: false, unit: 'min', value: 270, fixed: true, tex: 'T_{si}' }
      },
      note: 'Assumes the intestinal fluid stays saturated for the whole transit: an upper estimate. Doses above the MAD will be incompletely absorbed unless the formulation raises the dissolved concentration.',
      practice: { unknowns: ['MAD', 'S'] },
      stories: {
        MAD: 'A hypothetical drug has a solubility of {S} and an absorption rate constant of {ka}. Roughly how much can be absorbed from the small intestine?',
        S: 'What solubility is needed to absorb up to {MAD} with ka = {ka}?'
      }
    },
    {
      name: 'Absorption rate constant from permeability',
      expr: 'ka = 2*Peff/R', tex: 'k_a = \\dfrac{2 P_{\\mathrm{eff}}}{R}',
      vars: {
        ka: { name: 'absorption rate constant', q: 'rate', unit: '1/min', tex: 'k_a' },
        Peff: { name: 'effective permeability (1 µm/s = 10⁻⁴ cm/s)', q: 'speed', unit: 'µm/s', value: 2, tex: 'P_{\\mathrm{eff}}' },
        R: { name: 'radius of the small intestine', q: 'length', unit: 'cm', value: 1.75 }
      },
      note: 'A cylinder of radius R loses dissolved drug through its wall at a rate 2·Peff/R per unit time (surface over volume is 2/R).',
      stories: { ka: 'A hypothetical drug has an effective permeability of {Peff} in an intestine of radius {R}. What is its absorption rate constant?' }
    }
  ],
  examples: [
    {
      title: 'Classifying a hypothetical drug',
      q: 'A hypothetical weak base has a highest dose of 200 mg. Its solubility is 5 mg/mL at pH 1.2, 1.2 mg/mL at pH 4.5 and 0.4 mg/mL at pH 6.8. A mass-balance study shows 92 % of a dose is absorbed. What is its BCS class?',
      steps: [
        'The lowest solubility is at pH 6.8, as expected for a base: 0.4 mg/mL.',
        '$D_0 = 200/(250 \\times 0.4) = 2$: the dose needs 500 mL, so it is *not* highly soluble.',
        '92 % absorbed is above 85 %: highly permeable.',
        'Class II. Its absorption depends on dissolution, so particle size and solid form matter, and it is not eligible for a BCS biowaiver.'
      ],
      a: 'Class II (low solubility at pH 6.8, high permeability).'
    },
    {
      title: 'Too much to absorb',
      q: 'A hypothetical drug has an intestinal solubility of 0.01 mg/mL and an effective permeability of $2\\times10^{-4}$ cm/s. Estimate its maximum absorbable dose ($R$ = 1.75 cm, 250 mL, 270 min).',
      steps: [
        '$k_a = 2P_{\\mathrm{eff}}/R = 2 \\times 2\\times10^{-4}/1.75 = 2.29\\times10^{-4}$ per second $= 0.0137$ per minute.',
        '$\\mathrm{MAD} = 0.01 \\times 0.0137 \\times 250 \\times 270 = 9.3$ mg.',
        'A 100 mg dose would be largely unabsorbed from a simple tablet, however permeable the drug: the formulation must raise its dissolved concentration.'
      ],
      a: 'About 9 mg — a solubility-limited drug.'
    }
  ],
  quiz: [
    { q: 'A drug dissolves easily at every pH but only 40 % of a dose is absorbed. Its BCS class is…', choices: ['I', 'II', 'III', 'IV'], a: 2, why: 'High solubility and low permeability make class III; its absorption is limited by the gut wall, not by dissolution.' },
    { q: 'Where does the BCS volume of 250 mL come from?', choices: ['the volume of the stomach', 'the glass of water given with the dose in bioequivalence studies', 'the volume of a dissolution vessel', 'the daily secretion of bile'], a: 1, why: 'Bioequivalence studies give the dose with about 8 fluid ounces (240–250 mL) of water, so that became the reference volume.' },
    { q: 'The highest dose is 100 mg and the lowest solubility over pH 1.2–6.8 is 1 mg/mL. What is the dose number?', answer: 0.4, why: 'D0 = 100/(250 × 1) = 0.4 ≤ 1: highly soluble.' },
    { q: 'A weak acid\'s solubility class is judged at pH 6.8, where it dissolves best.', a: false, why: 'The BCS uses the lowest solubility across pH 1.2–6.8 — for a weak acid, at pH 1.2.' },
    { q: 'Under ICH M9, which drugs can have a dissolution-based biowaiver for an immediate-release tablet?', choices: ['only class I', 'class I, and class III with very rapid dissolution and similar excipients', 'classes II and IV', 'any class if f2 ≥ 50'], a: 1, why: 'Class I qualifies with rapid dissolution and similar profiles; class III needs very rapid dissolution and qualitatively the same, quantitatively similar excipients. Classes II and IV are excluded.' }
  ],
  problems: [
    { q: 'A hypothetical drug has an intestinal solubility of 0.05 mg/mL and ka = 0.02 per minute. Using 250 mL and 270 min, what is its maximum absorbable dose, in mg?', answer: 67.5, unit: 'mg', tol: 0.02, steps: ['$\\mathrm{MAD} = 0.05 \\times 0.02 \\times 250 \\times 270 = 67.5$ mg.'] }
  ],
  applications: [
    'Check whether a dose dissolves in 250 mL from pH 1.2 to 6.8 in [the pH–solubility calculator](#/tools/formulation/solubility).','Choosing a formulation strategy early in development: dissolution enhancement for class II, permeability for class III.', 'Biowaivers that approve generic immediate-release products on dissolution data (ICH M9, 2019).', 'Anticipating food effects and interactions with drugs that change gastric pH.', 'Deciding which post-approval manufacturing changes need a study in people.'],
  history: 'Amidon, Lennernäs, Shah and Crison published the BCS in Pharmaceutical Research in 1995. The FDA issued biowaiver guidance based on it in 2000, the WHO and EMA followed, and ICH M9 harmonised the rules in 2019. Chi-Yuan Wu and Leslie Benet proposed the metabolism-based BDDCS in 2005.',
  sim: 'bph-bcs-map'
},

{
  id: 'food-effects', parent: 'absorption-topic', title: 'Food effects', level: 2,
  short: 'A meal slows stomach emptying, raises gastric pH, floods the intestine with bile, boosts liver blood flow and brings ions that can bind drugs. The result can be more drug absorbed, less, or the same amount later.',
  keywords: ['food effect', 'fed state', 'fasted state', 'gastric emptying', 'bile salts', 'micelles', 'high-fat meal', 'FaSSIF', 'FeSSIF', 'chelation', 'grapefruit juice', 'positive food effect', 'negative food effect', 'migrating motor complex', 'take with food'],
  prereq: ['gi-absorption', 'bcs', 'surfactants'],
  related: ['first-pass', 'drug-interactions', 'bioequivalence', 'bioavailability', 'dissolution-testing', 'modified-release', 'medicine:digestion'],
  body: `
"Take with food", "take on an empty stomach", "do not take with milk" — these instructions on medicine labels are biopharmaceutics at work. A meal changes almost every step of oral absorption, and the result may be more drug absorbed, less, or the same amount later.

### What a meal changes
| | Fasting | After a meal | Consequence |
|---|---|---|---|
| Stomach pH | 1.5–2 | rises to 4–6 for an hour or two | weak bases dissolve less; acid-labile drugs survive better |
| Gastric emptying | liquids half emptied in 10–20 min | slowed; a large meal takes hours | later, often lower peak; tablets wait in the stomach |
| Bile salts in the small intestine | about 3 mM | about 10–15 mM | lipophilic drugs dissolve much better |
| Liver blood flow | resting | higher for a few hours | high-extraction drugs escape the liver a little more |
| Food components | — | calcium, iron, magnesium, fibre, protein | binding (chelation), competition for carriers |

### Positive, negative or none
A rule of thumb links food effects to the [[bcs]] class. **Class I** drugs are usually absorbed to the same extent, just later. **Class II** drugs often show a *positive* food effect: bile and dietary fat dissolve them, and some are absorbed several times better after a fatty meal. **Class III** drugs often show a *negative* one: food dilutes them, delays them and competes with them at the gut wall. Specific chemistry adds its own effects: tetracyclines and fluoroquinolones bind calcium, magnesium and iron into poorly absorbed complexes; bisphosphonates are absorbed so poorly even when fasting (under 1 %) that food or any drink other than plain water can abolish absorption; levodopa competes with dietary amino acids for the same carriers.

### Bile and micelles
Bile salts and lecithin form mixed micelles that dissolve lipophilic drug. A simple linear model describes the gain:

$$S_{\\mathrm{tot}} = S_{\\mathrm{aq}}\\,(1 + K\\,C_{\\mathrm{bs}})$$

Laboratories mimic the two states with biorelevant media — FaSSIF (3 mM taurocholate) and FeSSIF (15 mM) — introduced by Jennifer Dressman's group in 1998 ([[dissolution-testing]], [[surfactants]]).

### Gastric emptying
Fasting, the stomach empties liquids roughly exponentially, and every 1.5–2 hours a strong "housekeeper" wave (phase III of the migrating motor complex) sweeps out whatever is left, undisintegrated tablets included. After a meal these waves stop until the food has gone, and particles larger than about 1–2 mm are held back, so an enteric-coated tablet swallowed with food may sit in the stomach for hours ([[modified-release]]).

### Grapefruit juice
Furanocoumarins in grapefruit irreversibly inactivate CYP3A4 in the gut wall. For drugs with a large intestinal first pass — felodipine, some statins, ciclosporin — one glass can raise exposure two- to threefold or more, for about a day ([[first-pass]], [[drug-interactions]]). Injected doses are hardly affected.

### Testing food effects
Regulators ask for a study with a standard high-fat, high-calorie breakfast (about 800–1000 kcal, half from fat) against fasting (FDA guidance of 2002, updated for new drugs in 2022). The effect is treated as absent when the 90 % confidence interval of the fed/fasted ratio of AUC and Cmax lies within 80–125 % — the arithmetic of [[bioequivalence]].

> [!note] How a medicine should be taken relative to meals is set in its product information for good reasons. Ask a pharmacist before changing the timing or combining it with other medicines, supplements or juices.
`,
  ideas: [
    'Food slows gastric emptying, raises gastric pH, adds bile, increases liver blood flow and brings binding ions.',
    'Class II drugs tend to be absorbed more with food (bile solubilises them), class III drugs less, class I just later.',
    'Chelation with calcium, magnesium and iron reduces absorption of tetracyclines, fluoroquinolones and bisphosphonates.',
    'Grapefruit juice inactivates intestinal CYP3A4 for about a day, raising exposure to some oral drugs.',
    'Food effects are tested with a standard high-fat meal and judged with the 80–125 % confidence-interval rule.'
  ],
  pitfalls: [
    'Food always reduces absorption — For lipophilic, poorly soluble drugs a meal often increases it, sometimes several-fold.',
    'A food interaction only matters if the drug and food are swallowed together — Grapefruit\'s effect on gut-wall enzymes lasts about a day; spacing the two by a few hours does not remove it.',
    '"No food effect" means the fed and fasted curves are identical — It means the 90 % confidence interval of the ratio lies within 80–125 %; the peak may still come later.'
  ],
  formulas: [
    {
      name: 'Gastric emptying of a liquid',
      expr: 'V = V0*exp(-ln(2)*t/t12)', tex: 'V = V_0\\,e^{-\\ln 2\\,t/t_{1/2}}',
      vars: {
        V: { name: 'volume still in the stomach', q: 'volume', unit: 'mL' },
        V0: { name: 'volume swallowed', q: 'volume', unit: 'mL', value: 250, tex: 'V_0' },
        t: { name: 'time since drinking', q: 'time', unit: 'min', value: 30 },
        t12: { name: 'emptying half-time', q: 'time', unit: 'min', value: 15, tex: 't_{1/2}' }
      },
      note: 'Non-caloric liquids on an empty stomach empty roughly exponentially with half-times of 10–20 min. Meals and calorie-rich drinks empty more slowly, and solids after a lag, roughly linearly.',
      practice: { unknowns: ['V', 't', 't12'] },
      stories: {
        V: 'A tablet is taken fasting with {V0} of water, which empties with a half-time of {t12}. How much is left in the stomach after {t}?',
        t12: 'Of {V0} of water, {V} is still in the stomach after {t}. What is the emptying half-time?'
      }
    },
    {
      name: 'Solubilisation by bile micelles',
      expr: 'Stot = Saq*(1 + K*Cbs)', tex: 'S_{\\mathrm{tot}} = S_{\\mathrm{aq}}\\,(1 + K\\,C_{\\mathrm{bs}})',
      vars: {
        Stot: { name: 'total solubility with bile', q: false, unit: 'µg/mL', tex: 'S_{\\mathrm{tot}}' },
        Saq: { name: 'solubility in buffer alone', q: false, unit: 'µg/mL', value: 10, tex: 'S_{\\mathrm{aq}}' },
        K: { name: 'micellar solubilisation constant', q: false, unit: '1/mM', value: 0.5 },
        Cbs: { name: 'bile salt concentration', q: false, unit: 'mM', value: 15, tex: 'C_{\\mathrm{bs}}' }
      },
      note: 'A linear model, reasonable above the critical micelle concentration. K is larger for more lipophilic drugs; fasted intestine ≈ 3 mM bile salt, fed ≈ 10–15 mM.',
      practice: { unknowns: ['Stot', 'K'] },
      stories: {
        Stot: 'A hypothetical drug dissolves to {Saq} in buffer and has a micellar constant of {K}. What is its solubility with {Cbs} of bile salts?',
        K: 'A drug\'s solubility rises from {Saq} in buffer to {Stot} in a medium with {Cbs} of bile salts. What is its solubilisation constant?'
      }
    }
  ],
  examples: [
    {
      title: 'Fasted and fed intestinal fluid',
      q: 'A hypothetical lipophilic drug dissolves to 10 µg/mL in buffer, and bile micelles give K = 0.5 per mM. Compare its solubility in fasted (3 mM) and fed (15 mM) intestinal fluid, and the dose number of a 100 mg dose in 250 mL.',
      steps: [
        'Fasted: $10 \\times (1 + 0.5 \\times 3) = 25$ µg/mL. Fed: $10 \\times (1 + 0.5 \\times 15) = 85$ µg/mL — 3.4 times more.',
        'Dose numbers: $100/(250 \\times 0.025) = 16$ fasted; $100/(250 \\times 0.085) = 4.7$ fed.',
        'Still not "highly soluble", but far more of the dose can dissolve after a meal — a typical positive food effect for a class II drug.'
      ],
      a: '25 µg/mL fasted, 85 µg/mL fed; the dose number falls from 16 to 4.7.'
    },
    {
      title: 'Half a glass left',
      q: 'A tablet is swallowed fasting with 250 mL of water, which empties with a half-time of 15 min. How much water is still in the stomach after 30 and 60 minutes?',
      steps: [
        'After 30 min, two half-times: $250/4 = 62.5$ mL.',
        'After 60 min, four half-times: $250/16 = 16$ mL.',
        'A dissolved drug reaches the small intestine within the hour; after a meal the same tablet might wait two to four hours, delaying the peak.'
      ],
      a: '62.5 mL after 30 min and about 16 mL after an hour.'
    }
  ],
  quiz: [
    { q: 'A poorly soluble, highly permeable (class II) drug taken with a high-fat meal is most often…', choices: ['absorbed less', 'absorbed more', 'unchanged in every way', 'destroyed by bile'], a: 1, why: 'Bile micelles and dietary lipids raise its dissolved concentration; positive food effects are typical of class II.' },
    { q: 'Of 200 mL of water drunk fasting, how much (in mL) is left in the stomach after 24 min if the emptying half-time is 12 min?', answer: 50, unit: 'mL', why: 'Two half-times: 200/4 = 50 mL.' },
    { q: '"No food effect" in a regulatory study means fed and fasted exposures were exactly equal.', a: false, why: 'It means the 90 % confidence interval of the fed/fasted ratio of AUC and Cmax lay within 80–125 %.' },
    { q: 'Grapefruit juice raises the exposure to some drugs taken by mouth but hardly changes it after an injection because…', choices: ['it neutralises stomach acid', 'it inactivates CYP3A4 mainly in the gut wall, part of the oral first pass', 'it blocks renal excretion', 'it binds the drug in the gut'], a: 1, why: 'Its furanocoumarins destroy intestinal CYP3A4; an injected dose never passes through the gut wall.' },
    { q: 'Why do tetracycline antibiotics interact with milk?', choices: ['milk raises gastric pH', 'calcium binds the drug into poorly absorbed complexes', 'milk fat dissolves the drug', 'lactose competes for carriers'], a: 1, why: 'Tetracyclines chelate divalent and trivalent metal ions — calcium, magnesium, iron, aluminium — and the complexes are poorly absorbed.' }
  ],
  problems: [
    { q: 'A hypothetical drug dissolves to 4 µg/mL in buffer and has a micellar solubilisation constant of 0.8 per mM. What is its solubility in fed intestinal fluid with 15 mM bile salts, in µg/mL?', answer: 52, unit: 'µg/mL', tol: 0.02, steps: ['$S_{\\mathrm{tot}} = 4 \\times (1 + 0.8 \\times 15) = 4 \\times 13 = 52$ µg/mL.'] }
  ],
  applications: ['Deciding the "take with or without food" wording on product information.', 'Designing lipid-based formulations that make absorption less dependent on meals.', 'Biorelevant dissolution testing in fasted- and fed-state media.', 'Spotting and explaining food and juice interactions.'],
  history: 'David Bailey and colleagues discovered the grapefruit juice interaction in 1989 while studying felodipine with alcohol, using the juice to hide the taste. Jennifer Dressman\'s group introduced the fasted- and fed-state simulated intestinal fluids in 1998, and the FDA issued its guidance on food-effect studies in 2002.',
  sim: { id: 'bph-first-pass', params: { meal: 'fed' } }
},

{
  id: 'bioavailability', parent: 'bioavailability-topic', title: 'Bioavailability', level: 2,
  short: 'Bioavailability is the fraction of a dose that reaches the systemic circulation unchanged, and how fast it gets there. It is measured by comparing the area under the concentration–time curve with that after an intravenous dose (absolute) or another product (relative).',
  keywords: ['bioavailability', 'absolute bioavailability', 'relative bioavailability', 'F', 'AUC', 'Cmax', 'tmax', 'extent of absorption', 'rate of absorption', 'intravenous reference', 'crossover', 'washout', 'urinary recovery', 'linear kinetics'],
  prereq: ['routes', 'first-pass', 'auc-cmax', 'clearance'],
  related: ['bioequivalence', 'gi-absorption', 'oral-absorption-pk', 'nca', 'ivivc', 'dissolution-testing', 'medicine:pharmacokinetics'],
  body: `
**Bioavailability** is the fraction of an administered dose that reaches the systemic circulation unchanged, together with the speed at which it gets there. The fraction is written $F$; the speed shows in the peak concentration $C_{\\max}$ and its time $t_{\\max}$. An intravenous dose has $F = 1$ by definition, and every other route and product is measured against it.

### Why the AUC measures the fraction
Once a drug is in the circulation, it is removed by the same clearance whichever way it came in. The total exposure — the area under the plasma concentration–time curve ([[auc-cmax]]) — is therefore

$$\\mathrm{AUC} = \\frac{F\\,D}{\\mathrm{CL}}$$

Give the same people the drug by mouth and, on another occasion, into a vein, and the clearance cancels, leaving the **absolute bioavailability**

$$F = \\frac{\\mathrm{AUC}_{po}\\,D_{iv}}{\\mathrm{AUC}_{iv}\\,D_{po}}$$

The study is a crossover in the same volunteers, with a washout of at least five half-lives between the periods and sampling long enough to capture the curve; the tail is extrapolated to infinity ([[nca]]). Where no intravenous form exists, a product is compared with an oral solution or with the original product — the **relative bioavailability**, with the same formula. For drugs excreted unchanged by the kidneys, the total amount recovered in urine can replace the AUC.

| Teaching example | Oral bioavailability, roughly | Main reason for the loss |
|---|---|---|
| metformin | 50–60 % | incomplete absorption (low permeability) |
| propranolol | about 25 % | first-pass metabolism in the liver |
| alendronate | under 1 % | very low permeability; binding to calcium |
| paracetamol | 60–90 % | some first-pass conjugation |
| digoxin tablets | about 70 % | incomplete absorption, P-glycoprotein |

### Rate: Cmax and tmax
Two products with the same AUC deliver the same amount, but not necessarily at the same speed. Faster absorption gives a higher, earlier peak; slower absorption a lower, later, broader one. That matters when the effect or the side effects follow the peak. $C_{\\max}$ is not a pure measure of rate, since it also rises with the extent, but together with AUC it is what regulators compare ([[bioequivalence]]).

### Where the dose goes missing
A swallowed dose must be released from its dosage form, dissolve ([[dissolution-rate]]), survive stomach acid and gut enzymes, cross the gut wall ([[gi-absorption]]), and escape the gut wall and liver ([[first-pass]]): $F = f_a f_g f_h$. Each step has its remedies — a better formulation, a salt, a prodrug, another route.

### The assumptions
The AUC ratio measures $F$ only if clearance is the same on both occasions and does not depend on concentration, and if each AUC is complete. Enzyme induction between the periods, saturable metabolism ([[nonlinear-pk]]) or a curve cut short all bias the result.

> [!key] F belongs to a product given by a route, not to the molecule alone: the same drug can have different bioavailabilities as a tablet, a capsule, a solution or a suppository.
`,
  ideas: [
    'Bioavailability has an extent (F, from AUC) and a rate (seen in Cmax and tmax).',
    'Because AUC = F·D/CL and clearance is shared, dose-normalised AUC ratios give F.',
    'Absolute bioavailability compares with an intravenous dose; relative bioavailability with another product.',
    'Same AUC does not mean same Cmax: faster absorption gives a higher, earlier peak.',
    'F = fa·fg·fh: release, dissolution, stability, permeation and first pass all remove part of the dose.'
  ],
  pitfalls: [
    'Bioavailability is a fixed property of a drug — It depends on the formulation, the route, food and the person; two tablets of the same drug can differ.',
    'A higher Cmax always means more drug was absorbed — A faster-absorbed product has a higher peak even with an identical AUC.',
    'The AUC ratio is always a valid measure of F — Only with linear kinetics and the same clearance on both occasions; saturable metabolism or enzyme induction between periods distorts it.'
  ],
  formulas: [
    {
      name: 'Absolute bioavailability from AUCs',
      expr: 'F = 100*AUCpo*Div/(AUCiv*Dpo)', tex: 'F = \\dfrac{\\mathrm{AUC}_{po}\\,D_{iv}}{\\mathrm{AUC}_{iv}\\,D_{po}} \\times 100\\,\\%',
      vars: {
        F: { name: 'absolute bioavailability', q: false, unit: '%' },
        AUCpo: { name: 'AUC after the oral dose', q: false, unit: 'mg·h/L', value: 36, tex: '\\mathrm{AUC}_{po}' },
        Div: { name: 'intravenous dose', q: false, unit: 'mg', value: 50, tex: 'D_{iv}' },
        AUCiv: { name: 'AUC after the intravenous dose', q: false, unit: 'mg·h/L', value: 40, tex: '\\mathrm{AUC}_{iv}' },
        Dpo: { name: 'oral dose', q: false, unit: 'mg', value: 100, tex: 'D_{po}' }
      },
      note: 'Crossover in the same subjects; AUCs extrapolated to infinity; linear kinetics and unchanged clearance assumed. The same formula with a reference product in place of the intravenous dose gives the relative bioavailability.',
      practice: { unknowns: ['F', 'AUCpo'] },
      stories: {
        F: 'A hypothetical drug gives an AUC of {AUCiv} after {Div} intravenously and {AUCpo} after {Dpo} by mouth. What is its absolute bioavailability?',
        AUCpo: 'A hypothetical drug with an absolute bioavailability of {F} gives an AUC of {AUCiv} after {Div} intravenously. What AUC do you expect after {Dpo} by mouth?'
      }
    },
    {
      name: 'Exposure from dose, bioavailability and clearance',
      expr: 'AUC = F/100*D/CL', tex: '\\mathrm{AUC} = \\dfrac{F\\,D}{\\mathrm{CL}}',
      vars: {
        AUC: { name: 'area under the curve', q: false, unit: 'mg·h/L', tex: '\\mathrm{AUC}' },
        F: { name: 'bioavailability', q: false, unit: '%', value: 45 },
        D: { name: 'dose', q: false, unit: 'mg', value: 100 },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 1.25, tex: '\\mathrm{CL}' }
      },
      note: 'F is entered in per cent and used as a fraction. mg ÷ (L/h) gives mg·h/L.',
      practice: { unknowns: ['AUC', 'F', 'CL'] },
      stories: {
        AUC: 'A hypothetical tablet of {D} has a bioavailability of {F}; the clearance is {CL}. What is the AUC?',
        CL: 'A {D} dose with a bioavailability of {F} gives an AUC of {AUC}. What is the clearance?'
      }
    },
    {
      name: 'Relative bioavailability of two products',
      expr: 'Frel = 100*AUCT*DR/(AUCR*DT)', tex: 'F_{\\mathrm{rel}} = \\dfrac{\\mathrm{AUC}_T\\,D_R}{\\mathrm{AUC}_R\\,D_T} \\times 100\\,\\%',
      vars: {
        Frel: { name: 'relative bioavailability (test vs reference)', q: false, unit: '%', tex: 'F_{\\mathrm{rel}}' },
        AUCT: { name: 'AUC of the test product', q: false, unit: 'mg·h/L', value: 45, tex: '\\mathrm{AUC}_T' },
        DR: { name: 'reference dose', q: false, unit: 'mg', value: 100, tex: 'D_R' },
        AUCR: { name: 'AUC of the reference product', q: false, unit: 'mg·h/L', value: 25, tex: '\\mathrm{AUC}_R' },
        DT: { name: 'test dose', q: false, unit: 'mg', value: 200, tex: 'D_T' }
      },
      note: 'The reference is often an oral solution (the best a drug can do by mouth) or the originator\'s product.',
      stories: { Frel: 'A hypothetical tablet of {DT} gives an AUC of {AUCT}; an oral solution of {DR} gives {AUCR}. What is the tablet\'s bioavailability relative to the solution?' }
    }
  ],
  examples: [
    {
      title: 'An absolute bioavailability study',
      q: 'Twelve volunteers receive a hypothetical drug as 50 mg intravenously and, after a washout, 100 mg by mouth. The mean AUCs are 40 and 36 mg·h/L. Find the absolute bioavailability and the clearance. The drug is cleared only by the liver (take blood clearance equal to plasma clearance, liver blood flow 90 L/h); can the liver explain the loss?',
      steps: [
        '$F = (36 \\times 50)/(40 \\times 100) = 0.45$ — 45 %.',
        'Clearance from the intravenous dose: $\\mathrm{CL} = 50/40 = 1.25$ L/h.',
        'Hepatic extraction $= 1.25/90 = 1.4$ %: the liver lets through almost 99 % of what reaches it.',
        'So the missing 55 % was lost before or in the gut wall — incomplete dissolution or permeation, breakdown in the gut, or gut-wall metabolism — and that is where a formulator would look.'
      ],
      a: 'F = 45 %, CL = 1.25 L/h; the liver removes almost nothing, so the loss happens in the gut.'
    },
    {
      title: 'Same AUC, different peaks',
      q: 'Two hypothetical products each deliver 100 mg to the circulation (V = 50 L, k = 0.1 per hour) — one absorbed with ka = 2 per hour, the other with ka = 0.5 per hour. Compare their peaks.',
      steps: [
        'For first-order absorption, $C_{\\max} = (FD/V)\\,(k/k_a)^{k/(k_a - k)}$.',
        'Fast: $t_{\\max} = \\ln(20)/1.9 = 1.6$ h; $C_{\\max} = 2 \\times 0.05^{0.0526} = 2 \\times 0.854 = 1.71$ mg/L.',
        'Slow: $t_{\\max} = \\ln(5)/0.4 = 4.0$ h; $C_{\\max} = 2 \\times 0.2^{0.25} = 2 \\times 0.669 = 1.34$ mg/L.',
        'Equal AUCs ($FD/\\mathrm{CL} = 100/5 = 20$ mg·h/L), but the slow product\'s peak is 22 % lower and 2.4 h later — enough to fail a bioequivalence test on Cmax.'
      ],
      a: 'Peaks of 1.71 mg/L at 1.6 h and 1.34 mg/L at 4.0 h, with the same AUC.'
    }
  ],
  quiz: [
    { q: 'A hypothetical drug gives an AUC of 20 mg·h/L after 10 mg intravenously and 24 mg·h/L after 40 mg by mouth. What is its absolute bioavailability, in per cent?', answer: 30, unit: '%', why: 'F = (24 × 10)/(20 × 40) = 0.30.' },
    { q: 'Why is an intravenous dose the reference for absolute bioavailability?', choices: ['it is the cheapest route', 'the whole dose enters the systemic circulation, so F = 1 by definition', 'it has the highest Cmax', 'it avoids elimination'], a: 1, why: 'Nothing is lost before the circulation; comparing AUCs with it isolates the loss on the way in.' },
    { q: 'Two products with the same AUC must have the same Cmax.', a: false, why: 'AUC measures the amount; the peak also depends on the speed of absorption.' },
    { q: 'Between the intravenous and the oral periods of a study, a volunteer starts a medicine that induces the enzymes clearing the drug. The calculated F will be…', choices: ['correct', 'too high', 'too low', 'undefined'], a: 2, why: 'Higher clearance in the oral period shrinks the oral AUC for reasons that have nothing to do with absorption, so F is underestimated — one reason for washouts and careful screening.' },
    { q: 'Which of these does not reduce oral bioavailability?', choices: ['incomplete dissolution', 'metabolism in the gut wall', 'hepatic first pass', 'renal excretion of drug that has already reached the circulation'], a: 3, why: 'Bioavailability counts what reaches the systemic circulation; elimination afterwards lowers the AUC for both routes equally and cancels in the ratio.' }
  ],
  problems: [
    { q: 'A hypothetical tablet of 200 mg gives an AUC of 45 mg·h/L; an oral solution of 100 mg gives 25 mg·h/L in the same volunteers. What is the tablet\'s bioavailability relative to the solution, in per cent?', answer: 90, unit: '%', tol: 0.02, steps: ['$F_{\\mathrm{rel}} = (45 \\times 100)/(25 \\times 200) = 0.90$.', 'The tablet delivers 90 % of what the solution does — the formulation loses a little.'] },
    { q: 'A hypothetical drug has a bioavailability of 60 % and a clearance of 4 L/h. What AUC (mg·h/L) does a 200 mg oral dose give?', answer: 30, unit: 'mg·h/L', tol: 0.02, steps: ['$\\mathrm{AUC} = F D/\\mathrm{CL} = 0.60 \\times 200/4 = 30$ mg·h/L.'] }
  ],
  applications: ['Developing new formulations and routes, and comparing them with an intravenous reference.', 'Explaining why doses differ between tablets, liquids and injections of the same medicine.', 'Bioequivalence testing of generic medicines.', 'Understanding the effects of food, interactions and disease on exposure.'],
  history: 'Bioavailability became a regulatory concern after episodes in which a change of formulation changed the effect: in Australia in 1968–69 phenytoin capsules made with lactose instead of calcium sulfate caused toxicity, and in 1971 digoxin tablets from different makers were found to give blood levels differing several-fold. The FDA issued its bioavailability and bioequivalence regulations in 1977.',
  sim: 'bph-first-pass'
},

{
  id: 'dissolution-testing', parent: 'bioavailability-topic', title: 'Dissolution testing', level: 2,
  short: 'A dissolution test stirs dosage units in a warmed medium and measures how much drug has dissolved over time. It is the everyday check that every batch releases its drug like the batches studied in patients.',
  keywords: ['dissolution test', 'USP <711>', 'Ph. Eur. 2.9.3', 'basket', 'paddle', 'apparatus 1', 'apparatus 2', 'reciprocating cylinder', 'flow-through cell', 'sink conditions', '900 mL', '37 °C', 'Q value', 'S1 S2 S3', 'acceptance stages', 'biorelevant media', 'Weibull', 'discriminating method', 'coning'],
  prereq: ['dissolution-rate', 'solubility-pharm', 'tablet-testing'],
  related: ['f2-similarity', 'ivivc', 'bcs', 'release-kinetics', 'quality-control', 'modified-release', 'bioavailability', 'analytical-methods'],
  body: `
A tablet that does not dissolve cannot be absorbed, and one that dissolves more slowly than the batches given to patients in the clinical studies may not work as well. The **dissolution test** checks this in the laboratory: dosage units are stirred in a warmed medium and samples are taken at set times to measure how much drug has dissolved. It is required for almost every solid oral medicine, batch after batch, and described in harmonised pharmacopoeial chapters — USP <711> and Ph. Eur. 2.9.3 — with separate rules for modified release.

### The apparatus
| Apparatus | How it works | Typical use |
|---|---|---|
| 1 — basket | the unit sits in a rotating wire-mesh basket, often at 100 rpm | capsules, units that float |
| 2 — paddle | a paddle turns above the unit on the vessel's rounded bottom, 50–75 rpm | most tablets, suspensions |
| 3 — reciprocating cylinder | the unit rides in a cylinder dipped through a row of media | modified release, changing pH |
| 4 — flow-through cell | fresh medium is pumped through a cell holding the unit | poorly soluble drugs, implants |

The vessel holds up to about 1 L, usually 900 mL of degassed medium at 37 ± 0.5 °C. Samples are filtered and assayed by UV spectroscopy or HPLC ([[analytical-methods]]).

### Medium and sink conditions
Media span the gut's pH range: 0.1 M hydrochloric acid (pH 1.2), acetate buffer at pH 4.5, phosphate buffer at pH 6.8. The test should run under **sink conditions** — the medium able to dissolve at least about three times the dose, $C_s V \\ge 3D$ — so that the rate reflects the product rather than the medium filling up ([[dissolution-rate]]). A surfactant such as sodium lauryl sulfate may be added for poorly soluble drugs, at the lowest level that works, since too much hides real differences. Biorelevant media mimicking fasted and fed intestinal fluid ([[food-effects]]) are used in development.

### Passing: Q and the stages
The monograph sets $Q$, the amount that must be dissolved at a stated time as a percentage of the labelled content — for immediate-release tablets typically 75–80 % in 30–45 minutes. Testing goes in stages:

| Stage | Units | Passes if |
|---|---|---|
| S1 | 6 | every unit is at least Q + 5 % |
| S2 | 6 more (12) | the mean of 12 is at least Q, and no unit is below Q − 15 % |
| S3 | 12 more (24) | the mean of 24 is at least Q; at most 2 units below Q − 15 %; none below Q − 25 % |

A batch whose mean sits comfortably above Q passes at S1; one close to Q, or with scattered units, goes on to S2 or S3 — or fails.

### A test that discriminates
A good method detects the changes that matter in the body: particle size, crystal form ([[solid-state]]), tablet hardness, over-mixed magnesium stearate that waterproofs the granules, a thicker coat, gelatin capsules that have cross-linked on storage (which may be retested with enzymes in the medium). The hydrodynamics are delicate: at 50 rpm a cone of powder can gather under the paddle, and vibration or an off-centre shaft changes results, so the equipment is qualified mechanically and checked with calibrator tablets. Dissolution is first a quality-control test; whether it also predicts blood levels is the question of [[ivivc]].

### Profiles
For development and changes, whole profiles are compared, point by point with [[f2-similarity|f2]] or by fitting a model. The **Weibull function** $F = 100\\,[1 - e^{-(t/t_d)^b}]$ fits most curves: $t_d$ is the time for 63.2 % to dissolve and $b$ sets the shape — below 1 a steep start and a long tail, above 1 an S-shape with a lag ([[release-kinetics]]).
`,
  ideas: [
    'The dissolution test (USP <711>, Ph. Eur. 2.9.3) measures % dissolved over time in 900 mL at 37 °C, usually with a basket or paddle.',
    'Sink conditions — the medium able to dissolve about three times the dose — keep the test sensitive to the product.',
    'Acceptance uses Q in up to three stages of 6, 12 and 24 units.',
    'A useful method discriminates changes in particle size, solid form, lubrication, hardness and coating.',
    'Profiles are summarised by models such as Weibull and compared by f2.'
  ],
  pitfalls: [
    'Passing the dissolution test guarantees the same blood levels — It guarantees consistency with the approved product; only an established IVIVC or a BCS biowaiver lets dissolution stand in for blood levels.',
    'More surfactant makes a better test — Excess surfactant dissolves everything quickly and hides real differences between batches; the lowest level that achieves sink conditions is used.',
    'Failing S1 means the batch fails — S1 is a quick screen; the batch goes on to S2 and S3, which judge the mean and the spread of more units.'
  ],
  formulas: [
    {
      name: 'Sink factor',
      expr: 'Sf = Cs*V/D', tex: 'S_f = \\dfrac{C_s\\,V}{D}',
      vars: {
        Sf: { name: 'sink factor (≥ 3: sink conditions)', tex: 'S_f' },
        Cs: { name: 'solubility in the medium', q: false, unit: 'mg/mL', value: 0.5, tex: 'C_s' },
        V: { name: 'medium volume', q: false, unit: 'mL', value: 900 },
        D: { name: 'dose in the unit', q: false, unit: 'mg', value: 100 }
      },
      note: 'How many doses the medium could dissolve. Below about 3, the concentration building up in the vessel slows dissolution; below 1, the dose cannot all dissolve.',
      practice: { unknowns: ['Sf', 'Cs'] },
      stories: {
        Sf: 'A tablet of {D} is tested in {V} of a medium in which the drug\'s solubility is {Cs}. What is the sink factor?',
        Cs: 'What solubility is needed for a sink factor of {Sf} with a {D} tablet in {V}?'
      }
    },
    {
      name: 'Weibull dissolution profile',
      expr: 'F = 100*(1 - exp(-(t/td)^b))', tex: 'F = 100\\,\\left[1 - e^{-(t/t_d)^b}\\right]',
      vars: {
        F: { name: 'dissolved', q: false, unit: '%' },
        t: { name: 'time', q: false, unit: 'min', value: 30 },
        td: { name: 'time for 63.2 % to dissolve', q: false, unit: 'min', value: 15, tex: 't_d' },
        b: { name: 'shape parameter (< 1 steep then slow, > 1 S-shaped)', value: 1 }
      },
      note: 'An empirical model: t_d fixes the time scale, b the shape. b = 1 is first-order dissolution.',
      practice: { unknowns: ['F', 't', 'td'] },
      stories: {
        F: 'A tablet\'s dissolution follows a Weibull curve with t_d = {td} and b = {b}. How much has dissolved at {t}?',
        t: 'When does a product with t_d = {td} and b = {b} reach {F} dissolved?',
        td: 'A product with shape b = {b} must reach {F} at {t}. What is the largest t_d allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'Passing at the second stage',
      q: 'The monograph for a hypothetical tablet sets Q = 80 % at 30 minutes. Six units give 88, 84, 91, 83, 86 and 89 %. Six more give 82, 79, 85, 87, 81 and 84 %. Does the batch pass?',
      steps: [
        'S1 needs every unit at least Q + 5 = 85 %: 84 and 83 are below, so S1 is not met — test six more.',
        'S2: the mean of 12 is $(521 + 498)/12 = 1019/12 = 84.9$ %, at least Q = 80 %.',
        'The lowest unit is 79 %, well above Q − 15 = 65 %.',
        'The batch passes at S2.'
      ],
      a: 'It passes at stage S2 (mean 84.9 %, no unit below 65 %).'
    },
    {
      title: 'Sink or not?',
      q: 'A hypothetical 200 mg tablet contains a drug with a solubility of 0.05 mg/mL in the chosen buffer; the medium is 900 mL. Are sink conditions met? What if 0.5 % sodium lauryl sulfate raises the solubility to 1 mg/mL?',
      steps: [
        'Without surfactant: $C_s V = 0.05 \\times 900 = 45$ mg, a sink factor of $45/200 = 0.23$ — at most 22 % of the dose could ever dissolve.',
        'With surfactant: $1 \\times 900 = 900$ mg, a sink factor of 4.5 — sink conditions.',
        'The surfactant is justified, but its level is kept as low as possible so the method still discriminates.'
      ],
      a: 'No (sink factor 0.23); with surfactant yes (4.5).'
    }
  ],
  quiz: [
    { q: 'At what temperature is the medium held in a pharmacopoeial dissolution test?', choices: ['20 ± 2 °C', '25 ± 1 °C', '37 ± 0.5 °C', '40 ± 2 °C'], a: 2, why: 'Body temperature, 37 ± 0.5 °C.' },
    { q: 'With Q = 75 %, what must each of the six units reach to pass at S1?', choices: ['75 %', '80 %', '85 %', '60 %'], a: 1, why: 'S1 requires every unit to be at least Q + 5 % = 80 %.' },
    { q: 'A product that passes its dissolution test is thereby shown to be bioequivalent to the reference.', a: false, why: 'Routine dissolution confirms batch consistency. It replaces a study in people only for BCS biowaivers or where an IVIVC has been established.' },
    { q: 'A Weibull fit gives b = 1.8. The profile is most likely…', choices: ['a steep start and long tail', 'S-shaped with an initial lag', 'a straight line', 'first order'], a: 1, why: 'b > 1 gives a sigmoid curve — typical when the tablet must first disintegrate or be wetted.' },
    { q: 'A 50 mg tablet is tested in 900 mL of a medium in which the drug dissolves to 0.2 mg/mL. What is the sink factor?', answer: 3.6, why: '0.2 × 900/50 = 3.6: sink conditions are met.' }
  ],
  problems: [
    { q: 'A product follows a Weibull curve with t_d = 12 min and b = 1. What percentage has dissolved at 30 min?', answer: 91.8, unit: '%', tol: 0.01, steps: ['$F = 100(1 - e^{-30/12}) = 100(1 - e^{-2.5}) = 100(1 - 0.082) = 91.8$ %.'] }
  ],
  applications: [
    'Estimate a powder\'s time to 85 % and the sink factor of a test in [the dissolution calculator](#/tools/formulation/dissolution).','Batch release and stability testing of tablets and capsules.', 'Detecting manufacturing drift: particle size, lubrication, hardness, coating, capsule cross-linking.', 'Supporting post-approval changes and biowaivers with profile comparisons.', 'Developing formulations with biorelevant media.'],
  history: 'Official dissolution tests date from 1970, when the rotating basket entered the United States Pharmacopeia; the paddle followed later that decade. They were prompted by the discovery that tablets passing the older disintegration test could still give very different blood levels.',
  sim: 'bph-dissolution-test'
},

{
  id: 'f2-similarity', parent: 'bioavailability-topic', title: 'Comparing dissolution profiles: f2', level: 2,
  short: 'The similarity factor f2 turns two dissolution profiles into one number: 100 for identical curves, 50 when they differ by about 10 percentage points on average. Regulators accept f2 ≥ 50 as similar, under strict conditions.',
  keywords: ['f2', 'similarity factor', 'f1', 'difference factor', 'dissolution profile comparison', 'Moore and Flanner', 'SUPAC', '85 % rule', 'bootstrap', 'model-independent', 'post-approval changes', 'biowaiver', 'coefficient of variation'],
  prereq: ['dissolution-testing', 'release-kinetics', 'math:logarithms'],
  related: ['bcs', 'bioequivalence', 'ivivc', 'quality-control', 'math:standard-deviation'],
  body: `
When a manufacturer changes a tablet — a new site, a larger mixer, another grade of an excipient — or wants to show that a lower strength behaves like the one studied in people, it compares dissolution **profiles**: the percentage dissolved at several times, from twelve units of each product. Two profiles never coincide exactly, so how close is close enough? In 1996 J. W. Moore and H. H. Flanner proposed a single number, and regulators adopted it.

### The similarity factor
With $R_t$ and $T_t$ the mean percentages dissolved from the reference and test products at the same $n$ time points,

$$f_2 = 50\\,\\log_{10}\\left[\\frac{100}{\\sqrt{1 + \\frac{1}{n}\\sum_{t=1}^{n}(R_t - T_t)^2}}\\right]$$

The mean squared difference is taken, one is added (so identical profiles give $\\log_{10}100 = 2$ and $f_2 = 100$), and the logarithm compresses the scale ([[math:logarithms]]). If the profiles differ by the same amount $d$ at every point, $f_2 = 50\\log_{10}(100/\\sqrt{1 + d^2})$:

| Difference at each point (percentage points) | 0 | 2 | 5 | 10 | 15 | 20 |
|---|---|---|---|---|---|---|
| $f_2$ | 100 | 83 | 65 | 50 | 41 | 35 |

So **f2 ≥ 50 means an average difference of no more than about 10 %** — the criterion for "similar". A companion *difference factor*, $f_1 = 100\\sum|R_t - T_t|/\\sum R_t$, counts 0–15 as similar.

### The conditions
The number means something only under the rules of the FDA's dissolution guidance (1997) and the EMA's bioequivalence guideline (2010):
- 12 units of each product, tested under the same conditions at the same times;
- at least three time points, not counting zero;
- only one point beyond 85 % dissolved (the FDA counts from when both products pass 85 %, the EMA from when either does);
- a coefficient of variation between units of no more than 20 % at the earliest points and 10 % at the rest.

If both products dissolve at least 85 % within 15 minutes, the profiles are taken as similar without calculation. When units vary too much for f2, a bootstrap confidence interval for f2 or a multivariate distance is used instead.

### Why the 85 % rule
Points on the plateau, where both products have finished, add near-zero differences and pull f2 up. With enough of them any two fast products would look alike — hence only one point beyond 85 % may count.

### What f2 is not
It is not a statistical test and ignores unit-to-unit variability; it cannot tell curves that cross from curves that run parallel; and similarity in one medium says nothing about another. It is a regulatory yardstick — simple and conservative when its conditions are met.
`,
  ideas: [
    'f2 = 50·log10[100/√(1 + mean squared difference)]: 100 for identical profiles, 50 for about 10 % average difference.',
    'f2 ≥ 50 counts as similar; the difference factor f1 ≤ 15 is its companion.',
    'Only one point beyond 85 % dissolved may be used, because plateau points inflate f2.',
    'Twelve units, three or more time points and limited unit-to-unit variability are required.',
    'Very rapidly dissolving products (≥ 85 % in 15 min) are similar without calculating f2.'
  ],
  pitfalls: [
    'More time points always make the comparison more rigorous — Extra points on the plateau add near-zero differences and make dissimilar profiles look similar.',
    'f2 = 50 means the products differ by 50 % — It corresponds to an average difference of about 10 percentage points; the scale is logarithmic.',
    'f2 accounts for variability between units — It uses only the mean profiles; variability is controlled by the separate CV conditions or handled by a bootstrap.'
  ],
  formulas: [
    {
      name: 'f2 from the average difference',
      expr: 'f2 = 50*log(100/sqrt(1 + d^2))', tex: 'f_2 = 50\\,\\log_{10}\\dfrac{100}{\\sqrt{1 + d^2}}',
      vars: {
        f2: { name: 'similarity factor', tex: 'f_2' },
        d: { name: 'root-mean-square difference between the profiles (percentage points)', q: false, unit: '%', value: 10, min: 0 }
      },
      note: 'd² is the mean of (R_t − T_t)² over the time points. f2 ≥ 50 (d ≤ 9.95) counts as similar.',
      stories: {
        f2: 'Two dissolution profiles differ by a root-mean-square {d}. What is f2?',
        d: 'Two profiles have f2 = {f2}. What root-mean-square difference is that?'
      }
    },
    {
      name: 'Difference factor f1',
      expr: 'f1 = 100*SA/SR', tex: 'f_1 = 100\\,\\dfrac{\\Sigma_{|R-T|}}{\\Sigma_R}',
      vars: {
        f1: { name: 'difference factor (0–15: similar)', tex: 'f_1' },
        SA: { name: 'sum of |R_t − T_t| over the time points', q: false, unit: '%', value: 20, tex: '\\Sigma_{|R-T|}' },
        SR: { name: 'sum of the reference values R_t', q: false, unit: '%', value: 270, tex: '\\Sigma_R' }
      },
      note: 'The total absolute difference as a percentage of the total reference dissolution.',
      stories: { f1: 'Over four time points the absolute differences add to {SA} and the reference values to {SR}. What is f1?' }
    }
  ],
  examples: [
    {
      title: 'Computing f2 by hand',
      q: 'A reference product dissolves 40, 62, 78 and 90 % at 10, 15, 20 and 30 minutes; a test product 35, 55, 72 and 88 %. Calculate f2 and f1. Are the profiles similar?',
      steps: [
        'Only the 30-minute point lies beyond 85 %, so all four points may be used.',
        'Differences: 5, 7, 6, 2; squares: 25, 49, 36, 4; mean $= 114/4 = 28.5$.',
        '$f_2 = 50\\log_{10}(100/\\sqrt{29.5}) = 50\\log_{10}(18.41) = 50 \\times 1.265 = 63.3$.',
        '$f_1 = 100 \\times 20/270 = 7.4$.'
      ],
      a: 'f2 ≈ 63 and f1 ≈ 7: similar.'
    },
    {
      title: 'How plateau points inflate f2',
      q: 'Suppose someone adds 45- and 60-minute points to the previous comparison, where the reference gives 95 and 98 % and the test 94 and 97 %. What happens to f2, and why is it not allowed?',
      steps: [
        'Squares now add to $114 + 1 + 1 = 116$ over 6 points: mean 19.3.',
        '$f_2 = 50\\log_{10}(100/\\sqrt{20.3}) = 50\\log_{10}(22.2) = 67.3$.',
        'f2 rose from 63 to 67 although nothing about the early, informative part of the curves changed. The rules allow only one point beyond 85 %.'
      ],
      a: 'f2 rises to about 67 — an artefact of plateau points.'
    }
  ],
  quiz: [
    { q: 'What is f2 for two identical profiles?', choices: ['0', '50', '100', 'undefined'], a: 2, why: 'The mean squared difference is zero, so f2 = 50·log10(100) = 100.' },
    { q: 'Two profiles differ by 10 percentage points at every time. f2 is about…', choices: ['10', '50', '90', '100'], a: 1, why: '50·log10(100/√101) = 49.9 — the boundary of similarity.' },
    { q: 'Including more time points after both products have finished dissolving makes f2 a stricter test.', a: false, why: 'Those points add near-zero differences and raise f2, making profiles look more similar than they are.' },
    { q: 'Two profiles differ by a root-mean-square of 4 percentage points. What is f2?', answer: 69.2, why: '50·log10(100/√17) = 50·log10(24.25) = 69.2.' },
    { q: 'f2 = 45 means…', choices: ['the profiles are similar', 'the profiles differ by 45 %', 'the profiles differ by roughly 12–13 percentage points on average, more than allowed', 'the test dissolves 45 % faster'], a: 2, why: 'Solving 45 = 50·log10(100/√(1 + d²)) gives d ≈ 12.6: below the similarity threshold of 50.' }
  ],
  problems: [
    { q: 'Profiles at three time points: reference 30, 55, 80 %; test 38, 64, 86 %. Calculate f2.', answer: 55.3, tol: 0.02, steps: ['Only the test\'s last point is beyond 85 %, so all three points count.', 'Differences: 8, 9, 6; squares 64, 81, 36; mean $= 181/3 = 60.3$.', '$f_2 = 50\\log_{10}(100/\\sqrt{61.3}) = 50\\log_{10}(12.77) = 50 \\times 1.106 = 55.3$ — similar, but only just.'] }
  ],
  applications: [
    'Paste two dissolution profiles and get f₂ in [the release-model tool](#/tools/formulation/release).','Post-approval changes to site, scale, equipment or excipients (the FDA\'s SUPAC guidances).', 'Waivers for additional strengths of an approved product.', 'BCS-based biowaivers, which require similar profiles at pH 1.2, 4.5 and 6.8.', 'Comparing batches during development and stability studies.'],
  history: 'J. W. Moore and H. H. Flanner published the difference and similarity factors in 1996. The FDA adopted f2 in its guidances on scale-up and post-approval changes and on dissolution testing in the 1990s, and the EMA, WHO and other regulators followed.',
  sim: 'bph-f2'
},

{
  id: 'ivivc', parent: 'bioavailability-topic', title: 'In vitro–in vivo correlation', level: 3,
  short: 'An IVIVC is a predictive model linking how a product dissolves in the laboratory to how it is absorbed in the body. A validated point-to-point (Level A) correlation lets a dissolution test stand in for new studies in people when a modified-release product changes.',
  keywords: ['IVIVC', 'in vitro–in vivo correlation', 'level A', 'level B', 'level C', 'multiple level C', 'deconvolution', 'Wagner–Nelson', 'Loo–Riegelman', 'convolution', 'fraction absorbed', 'Levy plot', 'time scaling', 'prediction error', 'extended release', 'biowaiver'],
  prereq: ['dissolution-testing', 'bioavailability', 'oral-absorption-pk', 'modified-release'],
  related: ['nca', 'f2-similarity', 'bcs', 'release-kinetics', 'bioequivalence', 'math:differential-equations'],
  body: `
Dissolution tests are cheap and fast; studies in people are neither. An **in vitro–in vivo correlation** (IVIVC) is a predictive model that links the two: from a product's dissolution profile it predicts the plasma concentration curve. Once it has been built and validated, a dissolution test can replace a new bioavailability study when the manufacture of a modified-release product changes, and dissolution limits can be set on clinical rather than arbitrary grounds. The FDA described the method in a 1997 guidance for extended-release oral products; the EMA's guideline on modified-release products (2014) and USP <1088> cover the same ground.

### Levels of correlation
| Level | What it relates | Value |
|---|---|---|
| A | fraction dissolved in vitro to fraction absorbed in vivo, point by point over the whole curve | the strongest; predicts the whole plasma profile; can support waivers |
| B | mean dissolution time in vitro to mean residence or absorption time in vivo | weak: very different curves share a mean |
| C | one dissolution point (say, % at 4 h) to one parameter (AUC or Cmax) | early development; several points ("multiple Level C") can support changes |

### From plasma levels to fraction absorbed
The in vivo half of a Level A correlation needs the fraction of the dose absorbed over time. It cannot be measured directly, but it can be **deconvolved** from the plasma curve. For a drug that behaves as one compartment, John Wagner and Eino Nelson showed in 1963 that the amount absorbed by time $t$ is the amount in the body plus the amount already eliminated, so

$$F_a(t) = \\frac{C(t) + k\\,\\mathrm{AUC}_{0-t}}{k\\,\\mathrm{AUC}_{0-\\infty}}$$

as a fraction of all that will be absorbed, with $k$ from the terminal slope ([[nca]]). For two-compartment drugs the Loo–Riegelman method, or numerical deconvolution against an intravenous or oral-solution reference, does the same job ([[oral-absorption-pk]]).

### Building and validating
Two or preferably three formulations with different release rates — slow, medium, fast — are studied in people. Plotting fraction absorbed against fraction dissolved at matching times (a **Levy plot**) ideally gives a straight line through the origin with slope 1. Often the body is slower or faster than the vessel; a **time-scaling** factor common to all formulations then brings the curves together. The model then runs forwards: dissolution → predicted absorption → **convolution** with the drug's disposition ([[math:differential-equations]]) → predicted plasma curve.

Predictions are judged by the prediction error of Cmax and AUC, $\\%\\mathrm{PE} = 100\\,(\\text{observed} - \\text{predicted})/\\text{observed}$. For internal validation the FDA guidance asks for an average absolute error of no more than 10 % for each parameter, and no more than 15 % for any one formulation; a formulation not used to build the model gives external validation.

### When it works — and when it cannot
IVIVC works when release from the dosage form is the slowest step: extended-release forms of well-absorbed drugs, BCS class I or dissolution-limited class II ([[bcs]]). It fails when something else controls absorption — a permeability limit, an absorption window in the upper intestine, saturable gut-wall metabolism, a food effect. A slow formulation still releasing when it reaches the colon, with little fluid and poor absorption, often falls off the line.

> [!key] A Level A IVIVC is a model, not a test: it is only as good as the formulations it was built on, and it holds only within the range of release rates it has seen.
`,
  ideas: [
    'Level A IVIVC relates fraction dissolved to fraction absorbed point by point and predicts whole plasma curves.',
    'Fraction absorbed is deconvolved from plasma data, e.g. by Wagner–Nelson: Fa = (C + k·AUC0–t)/(k·AUC0–∞).',
    'Two or three formulations with different release rates are needed; a common time-scaling factor is allowed.',
    'Predictions are validated by prediction errors of Cmax and AUC (mean ≤ 10 %, each ≤ 15 %).',
    'IVIVC holds only when release controls absorption, and only within the range of release rates tested.'
  ],
  pitfalls: [
    'A correlation between one dissolution number and AUC across batches is a full IVIVC — That is a Level C relation; only a point-to-point Level A model predicts the whole profile and supports the broadest waivers.',
    'Wagner–Nelson gives the fraction of the dose absorbed — It gives the fraction of what is eventually absorbed; an incompletely absorbed drug still reaches "100 %" on this scale.',
    'Once built, an IVIVC predicts any formulation — Outside the release rates and mechanisms used to build it, or when absorption is limited by something other than release, it can fail badly.'
  ],
  formulas: [
    {
      name: 'Fraction absorbed by the Wagner–Nelson method',
      expr: 'Fa = 100*(C + k*AUCt)/(k*AUCinf)', tex: 'F_a = \\dfrac{C + k\\,\\mathrm{AUC}_{0-t}}{k\\,\\mathrm{AUC}_{0-\\infty}} \\times 100\\,\\%',
      vars: {
        Fa: { name: 'fraction absorbed by time t (of all that is absorbed)', q: false, unit: '%', tex: 'F_a' },
        C: { name: 'plasma concentration at time t', q: false, unit: 'mg/L', value: 2 },
        k: { name: 'elimination rate constant', q: false, unit: '1/h', value: 0.2 },
        AUCt: { name: 'AUC from 0 to t', q: false, unit: 'mg·h/L', value: 10, tex: '\\mathrm{AUC}_{0-t}' },
        AUCinf: { name: 'AUC from 0 to infinity', q: false, unit: 'mg·h/L', value: 40, tex: '\\mathrm{AUC}_{0-\\infty}' }
      },
      note: 'One-compartment disposition. The numerator is proportional to the amount absorbed so far (in the body, C·V, plus eliminated, k·V·AUC); V cancels.',
      practice: { unknowns: ['Fa', 'C'] },
      stories: {
        Fa: 'At time t a plasma level is {C}, with AUC so far {AUCt}; k = {k} and AUC to infinity is {AUCinf}. What fraction of the absorbable dose has been absorbed?',
        C: 'Half-way through absorption ({Fa}), the AUC so far is {AUCt}, k = {k} and the total AUC is {AUCinf}. What should the plasma concentration be?'
      }
    },
    {
      name: 'Prediction error',
      expr: 'PE = 100*(Obs - Pred)/Obs', tex: '\\mathrm{PE} = 100\\,\\dfrac{X_{\\mathrm{obs}} - X_{\\mathrm{pred}}}{X_{\\mathrm{obs}}}',
      vars: {
        PE: { name: 'prediction error (%PE)', q: false, unit: '%', signed: true, tex: '\\mathrm{PE}' },
        Obs: { name: 'observed Cmax or AUC', q: false, unit: 'ng/mL', value: 120, tex: 'X_{\\mathrm{obs}}' },
        Pred: { name: 'value predicted by the IVIVC', q: false, unit: 'ng/mL', value: 110, tex: 'X_{\\mathrm{pred}}' }
      },
      note: 'Computed for Cmax and for AUC (then in ng·h/mL) of each formulation. Internal validation: mean |%PE| ≤ 10 %, each ≤ 15 % (FDA, 1997).',
      stories: { PE: 'An IVIVC predicts a Cmax of {Pred}; the study observed {Obs}. What is the prediction error?' }
    }
  ],
  examples: [
    {
      title: 'Wagner–Nelson by hand',
      q: 'After a hypothetical extended-release tablet, the plasma level at 4 h is 4.07 mg/L and the AUC from 0 to 4 h is 11.24 mg·h/L. The terminal slope gives k = 0.20 per hour and the total AUC is 50 mg·h/L. What fraction has been absorbed by 4 h? The same tablets had released 80 % in the dissolution vessel by 4 h.',
      steps: [
        'Numerator: $4.07 + 0.20 \\times 11.24 = 4.07 + 2.25 = 6.32$ mg/L.',
        'Denominator: $0.20 \\times 50 = 10.0$ mg/L.',
        '$F_a(4\\,\\mathrm{h}) = 6.32/10.0 = 63$ %.',
        'On a Levy plot the point (80 %, 63 %) lies below the line of identity: absorption lags release — a case for a time-scaling factor if the other formulations agree.'
      ],
      a: 'About 63 % absorbed at 4 h, against 80 % dissolved in vitro.'
    },
    {
      title: 'Validating a correlation',
      q: 'An IVIVC built on three hypothetical formulations predicts Cmax values of 92, 84 and 57 ng/mL; the study observed 100, 80 and 60 ng/mL. Does the model pass internal validation for Cmax?',
      steps: [
        'Prediction errors: $100(100 - 92)/100 = 8$ %; $100(80 - 84)/80 = -5$ %; $100(60 - 57)/60 = 5$ %.',
        'Mean absolute error: $(8 + 5 + 5)/3 = 6$ % — within 10 %.',
        'Each formulation is within 15 %.',
        'Cmax passes; AUC must be checked the same way before the correlation can be used.'
      ],
      a: 'Yes: mean |%PE| = 6 %, none above 15 %.'
    }
  ],
  quiz: [
    { q: 'Which level of IVIVC relates the whole dissolution curve to the whole absorption curve, point by point?', choices: ['Level A', 'Level B', 'Level C', 'multiple Level C'], a: 0, why: 'Level A is the point-to-point relation, the most informative and the most useful to regulators.' },
    { q: 'Why is a Level B correlation of little regulatory use?', choices: ['it needs too many subjects', 'very different dissolution curves can have the same mean dissolution time', 'it ignores AUC', 'it only works for solutions'], a: 1, why: 'Mean times summarise a whole curve in one number, so a Level B relation cannot predict the shape of the plasma profile.' },
    { q: 'The Wagner–Nelson method assumes the drug\'s disposition is…', choices: ['two-compartment', 'one-compartment with first-order elimination', 'non-linear', 'zero-order'], a: 1, why: 'Amount absorbed = amount in the one compartment + amount eliminated (k·V·AUC); multi-compartment drugs need Loo–Riegelman or numerical deconvolution.' },
    { q: 'An IVIVC is most likely to succeed for an immediate-release tablet of a BCS class III drug.', a: false, why: 'For class III drugs permeability, not dissolution, limits absorption, so dissolution changes barely show in the plasma. IVIVC suits extended-release forms whose release controls absorption.' },
    { q: 'C = 3 mg/L, k = 0.25 per hour, AUC from 0 to t = 8 mg·h/L, total AUC = 30 mg·h/L. What percentage has been absorbed?', answer: 66.7, unit: '%', why: '(3 + 0.25 × 8)/(0.25 × 30) = 5/7.5 = 66.7 %.' }
  ],
  problems: [
    { q: 'An IVIVC predicts an AUC of 432 ng·h/mL for a hypothetical formulation; the observed AUC was 480 ng·h/mL. What is the prediction error, in per cent?', answer: 10, unit: '%', tol: 0.02, steps: ['$\\%\\mathrm{PE} = 100(480 - 432)/480 = 10$ % — acceptable for one formulation (≤ 15 %), but it uses the whole 10 % average allowance if the others are similar.'] }
  ],
  applications: ['Waiving new bioavailability studies after manufacturing changes to extended-release products.', 'Setting dissolution specifications that correspond to acceptable blood levels.', 'Guiding formulation development towards a target plasma profile.', 'Physiologically based models that extend IVIVC with gut physiology.'],
  history: 'John Wagner and Eino Nelson published their method of estimating the fraction absorbed from blood levels in 1963; Gerhard Levy\'s plots comparing absorption with dissolution date from the same years. The FDA\'s 1997 guidance on extended-release IVIVC set the levels and validation rules still used.',
  sim: 'bph-ivivc'
},

{
  id: 'bioequivalence', parent: 'bioavailability-topic', title: 'Bioequivalence and generics', level: 2,
  short: 'Two products are bioequivalent when the same dose gives the same rate and extent of exposure within narrow limits: the 90 % confidence interval of the test/reference geometric mean ratio of AUC and Cmax must lie within 80.00–125.00 %. It is how most generic medicines are approved.',
  keywords: ['bioequivalence', 'generic medicine', '2×2 crossover', '90 % confidence interval', '80–125 %', 'geometric mean ratio', 'log-normal', 'two one-sided tests', 'TOST', 'within-subject variability', 'washout', 'highly variable drugs', 'narrow therapeutic index', 'reference-scaled', 'Hatch–Waxman', 'pharmaceutical equivalence', 'therapeutic equivalence'],
  prereq: ['bioavailability', 'auc-cmax', 'math:hypothesis-testing', 'math:normal-distribution'],
  related: ['bcs', 'f2-similarity', 'dissolution-testing', 'food-effects', 'regulation-approval', 'clinical-trials', 'biologics', 'medicine:clinical-trials'],
  body: `
A **generic medicine** contains the same active substance, in the same amount, dosage form and route, as a medicine already approved — it is *pharmaceutically equivalent*. To be approved without repeating the original clinical trials it must also be **bioequivalent**: the same dose must give the same rate and extent of exposure, within narrow limits, so that the same effects and safety can be expected (*therapeutic equivalence*). In the United States the path was opened by the Hatch–Waxman Act of 1984, in the European Union by the generic provisions of Directive 2001/83/EC; the ICH M13A guideline (2024) now harmonises the design of such studies for immediate-release oral products ([[regulation-approval]]).

### The standard study
Healthy adult volunteers — typically 24 to 36, never fewer than 12 — take a single dose of the test and the reference product in a randomised **two-period, two-sequence crossover**: half take test first and reference second, half the other way round, separated by a washout of at least five elimination half-lives. Blood is sampled until the AUC is essentially complete, and AUC and Cmax are found for each person and period ([[nca]]). Because every volunteer is their own control, the large differences *between* people cancel; only the variability *within* a person from one occasion to the next remains.

### The statistics
AUC and Cmax are roughly log-normal and are compared as ratios, so they are analysed on a log scale. The mean difference of the logs, $\\bar d$, back-transformed, is the **geometric mean ratio** (GMR) of test to reference, and its **90 % confidence interval** is

$$\\exp\\left(\\bar d \\pm t\\,\\frac{s_d}{\\sqrt n}\\right)$$

with $s_d$ the standard deviation of the within-subject log differences and $t$ the one-sided 95 % point of Student's $t$ ([[math:hypothesis-testing]]). The products are bioequivalent if the whole interval lies within **80.00–125.00 %** — limits symmetric on the log scale, $\\ln 0.8 = -0.223$ and $\\ln 1.25 = +0.223$. This is Donald Schuirmann's **two one-sided tests** (1987): it rejects both "the test gives more than 20 % less" and "more than 25 % more" at the 5 % level.

### What it does and does not mean
A common misunderstanding is that a generic may deliver 20 % less drug than the original. It cannot: the *whole* interval must fit inside the limits, so the point estimate must sit close to 100 % and the study must be precise. An FDA review of 2,070 studies from 1996–2007 found generic and reference products differed on average by about 3.5 % in AUC and 4.3 % in Cmax.

### Variability and the number of volunteers
The noisier a drug within a person, the wider the interval and the more volunteers are needed. For a true ratio of 95 % and 80 % power, roughly:

| Within-subject CV | 10 % | 15 % | 20 % | 25 % | 30 % |
|---|---|---|---|---|---|
| Volunteers needed | 8 | 12 | 20 | 28 | 40 |

**Highly variable drugs** (within-subject CV above 30 %) are studied in replicate designs, and regulators let the limits for Cmax widen with the reference product's own variability — the EMA up to 69.84–143.19 %, the FDA through reference-scaled average bioequivalence. **Narrow-therapeutic-index drugs** get tighter limits: 90.00–111.11 % for AUC in the EU.

### Beyond tablets
BCS biowaivers replace the study with dissolution tests for some drugs ([[bcs]]). Inhalers, creams and other locally acting products need other evidence. Biological medicines cannot be copied exactly: their copies, biosimilars, are approved through comparability programmes, not bioequivalence alone ([[biologics]]).

> [!note] Generic and originator products approved this way are interchangeable for the great majority of medicines. For a few narrow-therapeutic-index medicines some prescribers prefer to keep a person on one product; that decision belongs to the prescriber and pharmacist.
`,
  ideas: [
    'Bioequivalence: the 90 % CI of the test/reference geometric mean ratio of AUC and Cmax lies within 80.00–125.00 %.',
    'The 2×2 crossover makes each subject their own control, so only within-subject variability widens the interval.',
    'Analysis is on log-transformed data; the limits are symmetric on the log scale (±0.223).',
    'The whole interval must fit, so approved generics differ from their references by only a few per cent on average.',
    'Highly variable drugs need replicate designs and scaled limits; narrow-therapeutic-index drugs get tighter limits.'
  ],
  pitfalls: [
    'A generic may contain or deliver up to 20 % less drug — Content must meet the same specifications as any medicine, and the entire 90 % confidence interval of exposure must lie within 80–125 %, which forces the average close to 100 %.',
    'A failed bioequivalence study proves the products are different — A wide interval may simply reflect too few volunteers for a variable drug; failure means equivalence was not shown.',
    'Bioequivalence compares average blood levels in any group of people — It is shown in healthy volunteers because it compares products, not patients; the within-person comparison is what makes it sensitive.'
  ],
  formulas: [
    {
      name: 'Lower 90 % confidence limit of the geometric mean ratio',
      expr: 'lo = GMR*exp(-t*sd/sqrt(n))', tex: 'L_{90} = \\mathrm{GMR}\\,e^{-t\\,s_d/\\sqrt{n}}',
      vars: {
        lo: { name: 'lower 90 % confidence limit', q: 'ratio', unit: '%', tex: 'L_{90}' },
        GMR: { name: 'geometric mean ratio, test/reference', q: 'ratio', unit: '%', value: 95, tex: '\\mathrm{GMR}' },
        t: { name: 'Student t, one-sided 95 % (n − 2 degrees of freedom)', value: 1.717 },
        sd: { name: 'SD of the within-subject log differences', value: 0.25, tex: 's_d' },
        n: { name: 'number of subjects', int: true, value: 24, min: 4 }
      },
      note: 'For a 2×2 crossover with a paired analysis. t(0.95) is 1.812 for 10 degrees of freedom, 1.746 for 16, 1.717 for 22, 1.697 for 30. Bioequivalence needs L₉₀ ≥ 80 % and U₉₀ ≤ 125 %.',
      practice: { unknowns: ['lo', 'n'] },
      stories: {
        lo: 'A crossover in {n} subjects finds a geometric mean ratio of {GMR} with s_d = {sd} (t = {t}). What is the lower 90 % confidence limit?',
        n: 'How many subjects would bring the lower limit to {lo} for a ratio of {GMR} with s_d = {sd} and t = {t}?'
      }
    },
    {
      name: 'Upper 90 % confidence limit of the geometric mean ratio',
      expr: 'hi = GMR*exp(t*sd/sqrt(n))', tex: 'U_{90} = \\mathrm{GMR}\\,e^{t\\,s_d/\\sqrt{n}}',
      vars: {
        hi: { name: 'upper 90 % confidence limit', q: 'ratio', unit: '%', tex: 'U_{90}' },
        GMR: { name: 'geometric mean ratio, test/reference', q: 'ratio', unit: '%', value: 95, tex: '\\mathrm{GMR}' },
        t: { name: 'Student t, one-sided 95 % (n − 2 degrees of freedom)', value: 1.717 },
        sd: { name: 'SD of the within-subject log differences', value: 0.25, tex: 's_d' },
        n: { name: 'number of subjects', int: true, value: 24, min: 4 }
      },
      stories: { hi: 'A crossover in {n} subjects finds a geometric mean ratio of {GMR} with s_d = {sd} (t = {t}). What is the upper 90 % confidence limit?' }
    },
    {
      name: 'Within-subject coefficient of variation',
      expr: 'CVw = sqrt(exp(sd^2/2) - 1)', tex: '\\mathrm{CV}_w = \\sqrt{e^{s_d^2/2} - 1}',
      vars: {
        CVw: { name: 'within-subject coefficient of variation', q: 'ratio', unit: '%', tex: '\\mathrm{CV}_w' },
        sd: { name: 'SD of the within-subject log differences', value: 0.25, tex: 's_d' }
      },
      note: 'Each log difference combines two occasions, so the within-subject variance of one log value is s_d²/2; for a log-normal quantity CV = √(e^σ² − 1).',
      stories: {
        CVw: 'In a crossover the within-subject log differences have an SD of {sd}. What is the within-subject CV?',
        sd: 'A drug has a within-subject CV of {CVw}. What SD of the log differences do you expect in a crossover?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a bioequivalence result',
      q: 'A 2×2 crossover in 24 volunteers finds a geometric mean ratio for AUC of 95 %, with a standard deviation of the within-subject log differences of 0.25. Is bioequivalence shown for AUC? (t for 22 degrees of freedom = 1.717.)',
      steps: [
        '$\\bar d = \\ln 0.95 = -0.0513$; half-width $= 1.717 \\times 0.25/\\sqrt{24} = 0.0876$.',
        'Limits: $e^{-0.0513 - 0.0876} = e^{-0.1389} = 0.870$ and $e^{-0.0513 + 0.0876} = e^{0.0363} = 1.037$.',
        '87.0–103.7 % lies inside 80.00–125.00 %: bioequivalent for AUC. Cmax must pass too.',
        'The within-subject CV is $\\sqrt{e^{0.03125} - 1} = 17.8$ %.'
      ],
      a: '90 % CI 87.0–103.7 %: bioequivalence shown for AUC.'
    },
    {
      title: 'The same ratio, a noisier drug',
      q: 'Suppose the same study, with a ratio of 95 %, had found a standard deviation of the log differences of 0.50. What happens?',
      steps: [
        'Within-subject CV: $\\sqrt{e^{0.125} - 1} = 36.5$ % — a highly variable drug.',
        'Half-width $= 1.717 \\times 0.50/\\sqrt{24} = 0.175$; limits $e^{-0.0513 \\mp 0.175}$ = 79.7 % to 113.2 %.',
        'The lower limit falls just below 80 %: bioequivalence is not shown, although the point estimate is unchanged. A larger study, or a replicate design with scaled limits, would be needed.'
      ],
      a: 'CI 79.7–113.2 %: not shown — the study was too small for such a variable drug.'
    }
  ],
  quiz: [
    { q: 'For AUC, the standard acceptance range for the 90 % confidence interval of the test/reference ratio is…', choices: ['90–110 %', '80.00–125.00 %', '80–120 %', '75–133 %'], a: 1, why: '80.00–125.00 %, symmetric on the log scale. 90.00–111.11 % is used for narrow-therapeutic-index drugs in the EU.' },
    { q: 'An approved generic may deliver up to 20 % less drug than the originator.', a: false, why: 'The whole confidence interval must lie within 80–125 %, so the point estimate must be close to 100 %; FDA data show average differences of 3–5 %.' },
    { q: 'Why is the analysis done on the logarithms of AUC and Cmax?', choices: ['to make the numbers smaller', 'the products are compared as ratios, and the data are roughly log-normal, so logs turn ratios into differences with symmetric limits', 'regulators prefer logarithms', 'to remove period effects'], a: 1, why: 'On the log scale the ratio becomes a difference, the variability is roughly normal, and 80 % and 125 % become ±0.223.' },
    { q: 'Why is a crossover design used rather than two separate groups?', choices: ['it is quicker', 'each subject is their own control, so differences between people drop out of the comparison', 'it needs no washout', 'it measures the effect of the drug'], a: 1, why: 'Between-person variability in clearance is often far larger than within-person variability; the crossover removes it.' },
    { q: 'The within-subject log differences have an SD of 0.30. What is the within-subject CV, in per cent?', answer: 21.5, unit: '%', why: 'CV = √(e^(0.09/2) − 1) = √0.0460 = 21.5 %.' }
  ],
  problems: [
    { q: 'A crossover in 18 subjects gives a geometric mean ratio of 102 % with s_d = 0.20; t for 16 degrees of freedom is 1.746. What is the lower 90 % confidence limit, in per cent?', answer: 93.9, unit: '%', tol: 0.01, steps: ['Half-width $= 1.746 \\times 0.20/\\sqrt{18} = 0.0823$.', '$L_{90} = 1.02 \\times e^{-0.0823} = 1.02 \\times 0.921 = 0.939$.', 'The upper limit is $1.02 \\times e^{0.0823} = 1.108$: 93.9–110.8 %, bioequivalent.'] }
  ],
  applications: [
    'Paste subjects\' test and reference values and get the 90 % confidence interval in [the bioequivalence calculator](#/tools/pk/be).','Approval of generic medicines worldwide.', 'Bridging between clinical-trial formulations and the product that is marketed.', 'Showing that new strengths, manufacturing sites or formulations match the original.', 'Food-effect and interaction studies, which use the same confidence-interval arithmetic.'],
  history: 'After the phenytoin and digoxin episodes of 1968–1971, the FDA issued bioequivalence regulations in 1977; the Hatch–Waxman Act of 1984 created the abbreviated route for generics. Donald Schuirmann\'s two one-sided tests (1987) became the standard analysis, fixed in the FDA\'s 1992 guidance on log-transformed data. The EMA\'s guideline followed in 2010, and ICH M13A harmonised immediate-release studies in 2024.',
  sim: 'bph-be-crossover'
}

);
