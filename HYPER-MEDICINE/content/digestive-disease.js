/* HYPER-MEDICINE · content/digestive-disease.js — topic "digestive-disease": reflux and
 * peptic ulcers, inflammatory bowel disease, hepatitis, fatty liver and cirrhosis, and coeliac
 * disease and food intolerance. Simulations in sims/digestive.js. */
Hyper.add(

{
  id: 'reflux-ulcers', parent: 'digestive-disease', title: 'Reflux and peptic ulcers', level: 2,
  short: 'Heartburn happens when stomach acid escapes into the oesophagus; ulcers when the lining of the stomach or duodenum is eaten through — most often because of a bacterium, Helicobacter pylori, or anti-inflammatory painkillers.',
  keywords: ['heartburn', 'acid reflux', 'GORD', 'GERD', 'gastro-oesophageal reflux', 'hiatus hernia', 'Barrett\'s oesophagus', 'indigestion', 'dyspepsia', 'peptic ulcer', 'stomach ulcer', 'duodenal ulcer', 'Helicobacter pylori', 'H. pylori', 'NSAIDs', 'ibuprofen', 'aspirin', 'proton pump inhibitor', 'PPI', 'H2 blocker', 'antacid', 'gastritis', 'bleeding ulcer'],
  prereq: ['digestive-system', 'chemistry:ph-scale', 'microbes-types'],
  related: ['digestion-absorption', 'recognising-emergencies', 'heart-attack', 'antibiotics', 'common-cancers', 'pain-relief', 'side-effects-interactions', 'obesity', 'chemistry:acid-base-definitions'],
  body: `
Leila, 52, has had a burning feeling behind her breastbone after dinner most evenings for months, worse when she bends over or lies down; sometimes a sour liquid comes up into her mouth. Her father had a stomach ulcer in the 1970s and was told to drink milk, avoid spicy food and reduce stress — and eventually had part of his stomach removed. Leila's doctor can offer far more, because two discoveries changed this corner of medicine: medicines that switch off acid production at its source, and the finding that most ulcers are caused by an infection.

### Living with acid
The stomach makes one and a half to two litres of gastric juice a day, with hydrochloric acid strong enough to reach a pH of about 1.5 — over half a million times more acidic than blood. The acid unfolds proteins for digestion and kills most swallowed microbes. It is pumped out by *parietal cells* using a molecular pump that swaps hydrogen ions for potassium. The stomach protects itself with a layer of mucus and bicarbonate, a lining renewed every few days and a rich blood supply, all maintained partly by prostaglandins. The oesophagus has no such armour: it relies on the **lower oesophageal sphincter**, a ring of muscle that stays closed except when swallowing, and on gravity and saliva to clear anything that escapes.

$$\\text{pH} = -\\log_{10}\\,[\\ce{H+}]$$

### Reflux
**Gastro-oesophageal reflux disease** (GORD, or GERD in American spelling) means acid, and sometimes bile, flows back often enough to cause troublesome symptoms or damage. Weekly heartburn affects roughly one adult in seven worldwide (about 14 % in a 2020 global analysis), more in Europe and the Americas. The sphincter relaxes too often or is weak; a **hiatus hernia**, where part of the stomach slides up through the diaphragm, makes it worse; so do pressure on the abdomen (excess weight, pregnancy), large, fatty or late meals, alcohol, smoking and some medicines. Besides heartburn and regurgitation it can cause a cough, hoarseness or a sore throat. Years of reflux can inflame the oesophagus, narrow it, or change its lining (**Barrett's oesophagus**), which carries a small yearly risk — well under 1 % — of oesophageal cancer.

Treatment starts with what helps mechanically: losing weight when body weight is raised, smaller meals, not eating in the two or three hours before bed, raising the head of the bed, stopping smoking and limiting alcohol. Antacids and alginates neutralise acid or float a protective raft for quick relief; **H2-receptor antagonists** (famotidine) reduce acid production; **proton pump inhibitors** (omeprazole, lansoprazole and others) block the acid pump itself and are the most effective. They are generally safe, but long-term use should be reviewed with a doctor to keep to the lowest dose that works. Surgery that tightens the junction helps selected people.

### Peptic ulcers
An ulcer is a sore that goes through the lining of the stomach or the duodenum. Two causes account for most:

- **Helicobacter pylori**, a spiral bacterium that survives acid by making ammonia around itself. Roughly four people in ten worldwide carry it (global estimates from the 2010s and early 2020s, and falling), mostly from childhood, fewer in high-income countries. Most never have symptoms, but it causes most peptic ulcers and most stomach cancers, and WHO's cancer agency has classed it as a cause of cancer since 1994. It is found with a breath test or a stool test and treated with a combination of antibiotics and an acid-suppressing medicine for one to two weeks; because resistance to some antibiotics is rising, the choice follows local patterns, and a later test confirms it has gone.
- **Non-steroidal anti-inflammatory drugs** (NSAIDs: ibuprofen, naproxen, diclofenac and aspirin, even at low dose) block prostaglandins and weaken the stomach's defences. The risk rises with age, dose, and combination with blood thinners or corticosteroids. People who must take NSAIDs long term are often given a proton pump inhibitor as well; for many kinds of pain, a pharmacist can suggest alternatives.

Ulcers typically cause a burning or gnawing pain in the upper abdomen, nausea or bloating; duodenal ulcers often ease with food and return hours later or at night. Many — especially those caused by NSAIDs in older people — cause no pain until they bleed or perforate. Stress and spicy food do not cause ulcers, though they can aggravate symptoms.

> [!warn] Call your local emergency number for vomiting blood or material like coffee grounds, black tarry stools, fainting with abdominal pain, or sudden severe abdominal pain with a hard belly (a possible perforation). Chest pain — especially with breathlessness, sweating, nausea, or pain spreading to the arm, neck, jaw or back — can be a heart attack even when it feels like indigestion — do not wait to see whether an antacid helps: call your local emergency number.

> [!note] See a doctor soon for difficulty or pain in swallowing, food sticking, unintended weight loss, persistent vomiting, iron-deficiency anaemia, or new and persistent indigestion when over about 55 — reasons to look inside with an endoscopy.
`,
  ideas: [
    'The stomach\'s acid (pH about 1.5) is held back by the lower oesophageal sphincter; reflux is acid escaping upwards.',
    'Proton pump inhibitors block the acid pump itself; H2 blockers reduce its stimulation; antacids neutralise acid already made.',
    'Most peptic ulcers are caused by Helicobacter pylori infection or by NSAIDs, not by stress or spicy food.',
    'H. pylori is found with a breath or stool test and cured with a combination of antibiotics and acid suppression.',
    'Vomiting blood, black stools and sudden severe pain are emergencies; chest pain may be the heart, not the gut.'
  ],
  pitfalls: [
    'Ulcers are caused by stress and spicy food — Most are caused by H. pylori or NSAIDs; finding and treating the cause usually cures them.',
    'Heartburn is always harmless — Usually it is, but persistent reflux can damage the oesophagus, and chest pain that feels like heartburn can be a heart attack.',
    'If an antacid helps, the pain must have been from the stomach — Symptoms can improve by chance or from reassurance; relief does not rule out a heart problem.'
  ],
  formulas: [
    {
      name: 'Acidity: the pH',
      expr: 'pH = -log(H)', tex: '\\text{pH} = -\\log_{10}\\,\\mathrm{[\\ce{H+}]}',
      vars: {
        pH: { name: 'pH', tex: '\\text{pH}', signed: true },
        H: { name: '[H⁺] (mol/L)', value: 0.03, tex: '\\mathrm{[\\ce{H+}]}' }
      },
      note: 'Fasting stomach about pH 1.5–3.5; blood 7.35–7.45; the oesophagus is damaged by repeated exposure below about pH 4.',
      stories: { pH: 'Gastric juice has a hydrogen-ion concentration of {H} mol/L. What is its pH?', H: 'A reflux monitor reads pH {pH} in the oesophagus. What is the hydrogen-ion concentration in mol/L?' }
    },
    {
      name: 'How many times more acidic',
      expr: 'n = 10^(pH2 - pH1)', tex: 'n = 10^{\\,\\text{pH}_2 - \\text{pH}_1}',
      vars: {
        n: { name: 'times more hydrogen ions' },
        pH1: { name: 'pH of the more acidic fluid', value: 1.5, signed: true, tex: '\\text{pH}_1' },
        pH2: { name: 'pH of the less acidic fluid', value: 4.5, signed: true, tex: '\\text{pH}_2' }
      },
      note: 'Each unit of pH is a factor of ten. Proton pump inhibitors aim to keep the stomach above about pH 4 for most of the day.',
      stories: { n: 'An acid-suppressing medicine raises the stomach from pH {pH1} to pH {pH2}. By what factor has the hydrogen-ion concentration fallen?' }
    }
  ],
  examples: [
    {
      title: 'How acidic is the stomach?',
      q: 'Gastric juice has pH 1.5 and blood pH 7.4. Find the hydrogen-ion concentration of each and compare them. Then find the effect of a medicine that raises the stomach to pH 4.5.',
      steps: [
        'Stomach: $[\\ce{H+}] = 10^{-1.5} = 0.032$ mol/L. Blood: $10^{-7.4} = 4.0 \\times 10^{-8}$ mol/L.',
        'Ratio: $10^{7.4 - 1.5} = 10^{5.9} \\approx 790\\,000$ — the stomach holds nearly a million times more hydrogen ions per litre than blood.',
        'At pH 4.5 the concentration is $10^{3} = 1\\,000$ times lower than at pH 1.5: enough to let an inflamed oesophagus or an ulcer heal.'
      ],
      a: 'About 0.03 mol/L against 4 × 10⁻⁸ mol/L, a factor of about 800 000; raising the pH to 4.5 cuts acidity a thousandfold.'
    },
    {
      title: 'Case: a silent ulcer that bled',
      q: 'Jorge, 68, takes ibuprofen most days for knee pain, and low-dose aspirin. One morning he feels faint and passes black, sticky stools. What is happening, and what follows?',
      steps: [
        'Black, tarry stools mean blood that has been digested on its way down — bleeding high in the gut, here most likely from an ulcer caused by the two NSAIDs. Feeling faint suggests significant blood loss: this is an emergency, and the right action is to call the local emergency number.',
        'In hospital he is resuscitated with fluids and, if needed, blood; an endoscopy finds a bleeding duodenal ulcer, which is treated through the scope, and a proton pump inhibitor is given to let it heal.',
        'He is tested for H. pylori and treated if positive. His doctors review whether he needs the aspirin, and which painkiller would be safer for his knee.',
        'Like many NSAID ulcers in older people, it caused no pain beforehand — which is why regular NSAID use deserves a conversation with a doctor or pharmacist.'
      ],
      a: 'A bleeding peptic ulcer from NSAIDs — an emergency, treated endoscopically, with the causes then removed.'
    }
  ],
  quiz: [
    { q: 'What causes most peptic ulcers?', choices: ['stress and a busy life', 'spicy food and coffee', 'Helicobacter pylori infection and NSAID painkillers', 'too little stomach acid'], a: 2,
      why: 'H. pylori infection and NSAIDs account for most ulcers. Stress and spicy food can aggravate symptoms but do not cause ulcers.' },
    { q: 'Chest pain that feels like heartburn can safely be treated at home with antacids.', a: false,
      why: 'A heart attack can feel like indigestion. Chest pain with breathlessness, sweating, nausea or spreading pain needs emergency care.' },
    { q: 'By what factor does the hydrogen-ion concentration change between pH 2 and pH 5?', answer: 1000,
      why: 'Three pH units is $10^3 = 1\\,000$ times.' },
    { q: 'How do proton pump inhibitors reduce acid?', choices: ['they neutralise acid already in the stomach', 'they block the pump in parietal cells that secretes the acid', 'they coat the lining of the stomach', 'they kill Helicobacter pylori on their own'], a: 1,
      why: 'They switch off the hydrogen–potassium pump that secretes acid. Antacids neutralise acid already made; H. pylori needs antibiotics as well.' },
    { q: 'Which of these needs emergency care?', choices: ['heartburn after a large late meal', 'black, tarry stools with dizziness', 'a sour taste on bending over', 'bloating after beans'], a: 1,
      why: 'Black, tarry stools mean bleeding high in the gut, and dizziness suggests significant blood loss: call the emergency number.' }
  ],
  applications: ['Test-and-treat for H. pylori in people with indigestion.', 'Protecting the stomach of people who need long-term NSAIDs.', 'Endoscopy to treat bleeding ulcers and to check Barrett\'s oesophagus.', 'Lifestyle measures and acid suppression for reflux.'],
  history: 'In 1982 Barry Marshall and Robin Warren in Perth cultured a spiral bacterium from stomach biopsies; to convince sceptics Marshall swallowed a culture in 1984 and developed gastritis. Their discovery that most ulcers are infectious won the 2005 Nobel Prize in Physiology or Medicine.'
},

{
  id: 'ibd', parent: 'digestive-disease', title: 'Inflammatory bowel disease', level: 2,
  short: 'Crohn\'s disease and ulcerative colitis: long-term conditions in which the immune system keeps the gut inflamed, usually starting in young adults; how they differ from irritable bowel syndrome, how they are found, and how modern treatment aims for healing.',
  keywords: ['inflammatory bowel disease', 'IBD', 'Crohn\'s disease', 'ulcerative colitis', 'colitis', 'faecal calprotectin', 'calprotectin', 'colonoscopy', 'biologics', 'anti-TNF', 'infliximab', 'adalimumab', 'vedolizumab', 'mesalazine', 'corticosteroids', 'flare', 'remission', 'fistula', 'stoma', 'irritable bowel syndrome', 'IBS'],
  prereq: ['digestive-system', 'autoimmunity', 'gut-microbiome'],
  related: ['innate-immunity', 'celiac-disease', 'anemia', 'common-cancers', 'cancer-screening', 'bayes-diagnosis', 'diagnostic-accuracy'],
  body: `
Ella was 19 and in her first year at university when the diarrhoea started: eight or ten times a day, with blood, an urgency that made lectures impossible, cramps and a tiredness she could not shake. For weeks it was put down to stress or a bug. A stool test for inflammation came back high, and a colonoscopy showed an inflamed, bleeding lining from the rectum upwards: ulcerative colitis. Two years later, on a medicine given every few weeks, she is well, and a check of her colon shows the lining has healed.

### Two diseases
**Inflammatory bowel disease** (IBD) is an umbrella for two long-term conditions in which the immune system keeps attacking the gut wall, in flares and remissions.

| | Crohn's disease | Ulcerative colitis |
|---|---|---|
| Where | anywhere from mouth to anus, in patches; most often the end of the small intestine and the colon | the colon only, continuous from the rectum upwards |
| How deep | through the whole wall: narrowings, fistulas (tunnels), abscesses | the lining only |
| Typical symptoms | pain, diarrhoea, weight loss, tiredness; sores around the anus | bloody diarrhoea, urgency, cramps |
| Smoking | raises the risk and worsens the disease | risk is higher in people who have stopped smoking — but smoking is never advised: its harms far outweigh this |
| Surgery | removes damaged segments but does not cure | removing the colon cures the bowel disease |

Beyond the gut, IBD can inflame joints, skin, eyes and the bile ducts, and cause anaemia, bone thinning and blood clots during flares; in children it can slow growth. It is not contagious, and it is not caused by stress or by any one food, though both can affect how someone feels.

### Who gets it, and why
IBD usually starts between 15 and 30, with a smaller peak later in life. Around 7 million people had it worldwide in 2017 (Global Burden of Disease estimate); it affects more than 0.3 % of people in North America, Oceania and many European countries, and is rising fast in newly industrialised countries in Asia, South America and Africa. It arises when a genetically susceptible immune system (more than 200 gene regions are involved) reacts against the gut's own [[gut-microbiome|bacteria]], under environmental influences that are still being worked out — changes in diet, antibiotics in childhood and urban living are among the suspects.

### Is it IBD — or IBS?
**Irritable bowel syndrome** is far commoner and quite different: pain linked to bowel movements, bloating and altered habit, without inflammation or damage — a disorder of how the gut and brain communicate. Blood in the stool, weight loss, waking at night with diarrhoea, anaemia, fever or a family history point towards IBD. A useful first test is **faecal calprotectin**, a protein released by white blood cells into the stool. Because only a small share of people with bowel symptoms have IBD, a negative result is very reassuring while a positive one needs a colonoscopy — the arithmetic of [[bayes-diagnosis|probability after a test]]:

$$\\text{PPV} = \\frac{\\text{Se}\\cdot p}{\\text{Se}\\cdot p + (1 - \\text{Sp})(1 - p)}$$

Cut-offs vary between laboratories. The diagnosis itself rests on colonoscopy with biopsies, supported by blood tests and, for the small intestine, MRI or a capsule camera.

### Treatment
The goal today is not only to settle symptoms but to heal the lining ("treat to target"), because healing prevents complications.

- **Aminosalicylates** (mesalazine) for mild to moderate ulcerative colitis.
- **Corticosteroids** to calm flares — in short courses only, as they do not keep IBD in remission and have serious side effects with long use.
- **Immunomodulators** (azathioprine, methotrexate).
- **Biologics** — antibodies that block a single signal of inflammation: anti-TNF (infliximab, adalimumab), anti-integrin (vedolizumab), anti-interleukin-12/23 and -23 (ustekinumab, risankizumab and others).
- **Small-molecule tablets**: JAK inhibitors (tofacitinib, upadacitinib) and S1P receptor modulators (ozanimod).
- **Nutrition**: liquid feeds alone for several weeks are a first-line treatment for children with Crohn's disease.
- **Surgery** when medicines fail or complications arise.

Because the immune system is damped, vaccinations and infection checks are part of care, and people with long-standing colitis are offered regular colonoscopies to catch early signs of bowel cancer. Most people with IBD study, work, travel, play sport and have children.

> [!warn] Six or more bloody stools a day with fever, a racing pulse or feeling very unwell (acute severe colitis) needs same-day hospital care. Severe abdominal pain with a swollen belly, vomiting and no passing of stool or wind, or heavy bleeding, can mean a blockage, perforation or major bleed — call your local emergency number.
`,
  ideas: [
    'IBD is chronic immune inflammation of the gut: Crohn\'s disease (anywhere, patchy, through the wall) and ulcerative colitis (colon, continuous, lining only).',
    'It usually begins in young adults and is increasing worldwide; genes, the microbiome and environment all contribute.',
    'IBS is common and causes symptoms without inflammation; faecal calprotectin helps tell them apart, and a negative result is very reassuring.',
    'Modern treatment aims to heal the lining, using aminosalicylates, short courses of steroids, immunomodulators, biologics and small molecules, and surgery when needed.',
    'Acute severe colitis, obstruction and heavy bleeding are emergencies.'
  ],
  pitfalls: [
    'IBD is caused by stress or a bad diet — It arises from an immune reaction in genetically susceptible people; stress and food can affect symptoms but do not cause the disease.',
    'IBD and IBS are the same thing — IBS causes real symptoms without inflammation or damage; IBD inflames and can damage the bowel and needs different treatment.',
    'A positive calprotectin test means IBD — Infections, NSAIDs and other conditions raise it too; with a low prior probability many positives are false, so colonoscopy decides.'
  ],
  formulas: [
    {
      name: 'Positive predictive value of a stool test',
      expr: 'PPV = Se*p/(Se*p + (1 - Sp)*(1 - p))', tex: '\\text{PPV} = \\frac{\\text{Se}\\cdot p}{\\text{Se}\\cdot p + (1 - \\text{Sp})(1 - p)}',
      vars: {
        PPV: { name: 'probability of IBD after a positive test', q: 'ratio', unit: '%', min: 0, max: 100, tex: '\\text{PPV}' },
        Se: { name: 'sensitivity', q: 'ratio', unit: '%', value: 93, min: 1, max: 99.9, tex: '\\text{Se}' },
        Sp: { name: 'specificity', q: 'ratio', unit: '%', value: 90, min: 1, max: 99.9, tex: '\\text{Sp}' },
        p: { name: 'share of people tested who have IBD', q: 'ratio', unit: '%', value: 5, min: 0.1, max: 99 }
      },
      note: 'Illustrative values of the kind reported for faecal calprotectin in primary care; real ones depend on the cut-off and the population. The test calculator (Tools → Medical calculators → Tests) does the same arithmetic with counts.',
      practice: { unknowns: ['PPV', 'p'] },
      stories: { PPV: 'Among young adults with bowel symptoms seen by a family doctor, {p} have IBD. A stool test has sensitivity {Se} and specificity {Sp}. If it is positive, what is the chance of IBD?' }
    },
    {
      name: 'Negative predictive value',
      expr: 'NPV = Sp*(1 - p)/(Sp*(1 - p) + (1 - Se)*p)', tex: '\\text{NPV} = \\frac{\\text{Sp}\\,(1 - p)}{\\text{Sp}\\,(1 - p) + (1 - \\text{Se})\\,p}',
      vars: {
        NPV: { name: 'probability of no IBD after a negative test', q: 'ratio', unit: '%', min: 0, max: 100, tex: '\\text{NPV}' },
        Se: { name: 'sensitivity', q: 'ratio', unit: '%', value: 93, min: 1, max: 99.9, tex: '\\text{Se}' },
        Sp: { name: 'specificity', q: 'ratio', unit: '%', value: 90, min: 1, max: 99.9, tex: '\\text{Sp}' },
        p: { name: 'share of people tested who have IBD', q: 'ratio', unit: '%', value: 5, min: 0.1, max: 99 }
      },
      note: 'Why a negative calprotectin is so useful: when IBD is uncommon among those tested, a negative result makes it very unlikely.',
      practice: { unknowns: ['NPV'] },
      stories: { NPV: 'With {p} of those tested having IBD, sensitivity {Se} and specificity {Sp}, how sure can you be that a person with a negative result does not have IBD?' }
    }
  ],
  examples: [
    {
      title: 'A stool test in a family practice',
      q: 'A thousand young adults with bowel symptoms are tested; 5 % have IBD. The test has sensitivity 93 % and specificity 90 %. How many positives are true, and how reassuring is a negative?',
      steps: [
        'With IBD: 50 people; the test finds $0.93 \\times 50 = 46.5$ and misses 3.5.',
        'Without IBD: 950; the test is falsely positive in $0.10 \\times 950 = 95$ and correctly negative in 855.',
        'Positive predictive value: $46.5/(46.5 + 95) = 33$ % — two of three positives do not have IBD, so a positive leads to colonoscopy, not a diagnosis.',
        'Negative predictive value: $855/(855 + 3.5) = 99.6$ %. A negative result, with no red-flag symptoms, lets many people avoid a colonoscopy.'
      ],
      a: 'About one positive in three is IBD; a negative excludes it with about 99.6 % confidence (for these illustrative numbers).'
    },
    {
      title: 'Case: Ella\'s colitis',
      q: 'Ella, 19, has had bloody diarrhoea for six weeks. Her calprotectin is high and a colonoscopy shows continuous inflammation from the rectum up. How is she likely to be treated, and what is the goal?',
      steps: [
        'Continuous inflammation starting in the rectum, limited to the lining, fits ulcerative colitis; biopsies confirm it and stool tests exclude infection.',
        'A flare is settled with an aminosalicylate, adding a short course of corticosteroids if it is more severe.',
        'If the disease keeps flaring, or steroids cannot be stopped, her team moves on to an immunomodulator, a biologic or a small molecule; she is vaccinated and screened for infections first.',
        'Success means more than feeling well: calprotectin falls to normal and a follow-up colonoscopy shows a healed lining, which lowers the risk of complications and, in the long run, of bowel cancer.'
      ],
      a: 'Step-up treatment aimed at healing the lining, with monitoring by calprotectin and colonoscopy.'
    }
  ],
  quiz: [
    { q: 'Which statement fits ulcerative colitis rather than Crohn\'s disease?', choices: ['it can affect any part of the gut from mouth to anus', 'it starts in the rectum and spreads continuously up the colon, affecting the lining only', 'it often causes fistulas through the bowel wall', 'surgery cannot cure it'], a: 1,
      why: 'Ulcerative colitis is confined to the colon, continuous from the rectum, and affects the lining; removing the colon cures the bowel disease. The other statements describe Crohn\'s disease.' },
    { q: 'Inflammatory bowel disease is caused by stress.', a: false,
      why: 'It results from an immune reaction against gut bacteria in genetically susceptible people, with environmental triggers. Stress can worsen how someone feels but does not cause the disease.' },
    { q: 'Which finding points towards IBD rather than irritable bowel syndrome?', choices: ['bloating relieved by opening the bowels', 'blood in the stool, weight loss and a raised calprotectin', 'symptoms that are worse at times of stress', 'alternating constipation and diarrhoea'], a: 1,
      why: 'Bleeding, weight loss and markers of inflammation are red flags for IBD. The other features are typical of IBS.' },
    { q: 'IBD affects 5 % of the people tested; a test has sensitivity 93 % and specificity 90 %. What is the probability of IBD after a positive result, in per cent?', answer: 33,
      why: '$0.93 \\times 0.05 / (0.93 \\times 0.05 + 0.10 \\times 0.95) = 0.0465/0.1415 = 0.33$.' },
    { q: 'Why are corticosteroids not used to keep IBD in remission for years?', choices: ['they do not work at all in IBD', 'they calm flares but do not maintain remission, and long use causes serious side effects', 'they are too expensive', 'they cure the disease after one course'], a: 1,
      why: 'Steroids are effective for flares, but they do not prevent relapse and long use causes bone thinning, diabetes, infections and more. Maintenance uses other medicines.' }
  ],
  applications: ['Faecal calprotectin to decide who needs a colonoscopy.', 'Biologic and small-molecule treatments aimed at healing the lining.', 'Colonoscopic surveillance for bowel cancer in long-standing colitis.', 'Support for work, study, pregnancy and mental health in young people with a chronic illness.']
},

{
  id: 'liver-disease', parent: 'digestive-disease', title: 'Hepatitis, fatty liver and cirrhosis', level: 2,
  short: 'How viruses, alcohol and metabolic fat injure the liver, how injury turns into scarring and cirrhosis over years, how it is found while still silent, and why removing the cause lets the liver heal — often more than people expect.',
  keywords: ['liver disease', 'hepatitis', 'hepatitis A', 'hepatitis B', 'hepatitis C', 'hepatitis E', 'fatty liver', 'MASLD', 'NAFLD', 'MASH', 'NASH', 'steatotic liver disease', 'alcohol-related liver disease', 'fibrosis', 'cirrhosis', 'jaundice', 'ascites', 'varices', 'hepatic encephalopathy', 'liver cancer', 'hepatocellular carcinoma', 'FIB-4', 'elastography', 'liver transplant'],
  prereq: ['liver-function', 'alcohol', 'microbes-types'],
  related: ['obesity', 'type2-diabetes', 'metabolic-syndrome', 'vaccines', 'hiv', 'common-cancers', 'lab-tests', 'poisoning-overdose'],
  body: `
On the same afternoon two people hear that their liver is scarred. Ahmed, 58, has type 2 diabetes; a routine scan showed a fatty liver, and a stiffness test showed moderate scarring. Grace, 47, was treated with a blood transfusion as a child, before donated blood was screened, and has just been found to have hepatitis C. Neither had any symptoms. Both can do something powerful about it: Ahmed by losing weight and treating his diabetes, Grace with a few weeks of tablets that cure the infection. Their stories cover the three big causes of liver disease worldwide — viruses, fat and alcohol — and its most hopeful feature: when the cause goes, the liver heals.

### Viral hepatitis
| Virus | How it spreads | Course | Prevention and treatment |
|---|---|---|---|
| A | food or water contaminated with faeces | short illness, then recovery | vaccine; hygiene and clean water |
| B | blood, sex, mother to baby at birth | becomes chronic in about 90 % of infected newborns but under 5 % of infected adults | vaccine from birth; antiviral tablets control it long term |
| C | blood (unsafe injections, unscreened transfusions, shared needles) | chronic in most | no vaccine; 8–12 weeks of tablets cure over 95 % |
| D | only alongside hepatitis B | makes B worse | the hepatitis B vaccine prevents it |
| E | contaminated water, undercooked pork | usually short; dangerous in pregnancy | clean water; a vaccine in some countries |

WHO estimated that in 2022 about 254 million people were living with chronic hepatitis B and 50 million with hepatitis C, and that the two caused about 1.3 million deaths — mostly from cirrhosis and liver cancer. Most people infected do not know it, which is why testing matters.

### Fatty liver disease
When fat fills more than about 5 % of liver cells in a person with a metabolic risk factor — excess weight around the waist, raised blood sugar or diabetes, high blood pressure or abnormal blood fats — the condition is now called **MASLD** (metabolic dysfunction-associated steatotic liver disease; renamed in 2023 from NAFLD). It affects about 30 % of adults worldwide (a 2023 global analysis) and is rising with [[obesity]] and [[type2-diabetes|type 2 diabetes]]. Most people have fat alone, with little risk; in a minority the fat inflames the liver (**MASH**) and scarring follows. **Alcohol** causes the same sequence: most people who drink heavily have a fatty liver, some develop alcoholic hepatitis — which can be a sudden, severe illness — and a minority develop cirrhosis. The two often combine. Other causes include medicines and toxins (including some herbal and dietary supplements, and paracetamol overdose), autoimmune hepatitis, bile-duct diseases, and inherited iron or copper overload.

### From fat to scar to cirrhosis
As long as injury continues, cells in the liver lay down scar tissue. Doctors stage this **fibrosis** from F0 (none) to F4 (**cirrhosis**), where bands of scar surround nodules of regrowing liver. The fibrosis stage is the strongest predictor of what happens next. Progression is slow and varies hugely: in fatty liver disease, on average about one stage every seven years with inflammation and every fourteen without (a 2015 analysis); in untreated hepatitis C, cirrhosis in roughly 15–30 % of people over twenty years.

Cirrhosis can stay *compensated* — silent — for years. When it *decompensates*, the scarred liver obstructs blood flow (portal hypertension), and fails at its jobs:

- swollen veins in the oesophagus (**varices**) that can bleed massively;
- fluid in the abdomen (**ascites**) and swollen legs;
- **jaundice**, bruising and bleeding, as bilirubin builds up and clotting factors fall;
- confusion and drowsiness (**hepatic encephalopathy**), as toxins the liver normally clears reach the brain;
- **liver cancer**, at roughly 1–4 % a year — so people with cirrhosis are offered an ultrasound every six months.

### What reverses
Remove the cause and the liver starts to recover. Fat clears within weeks to months and inflammation settles; fibrosis can regress over years, and even early cirrhosis may partly regress, though advanced cirrhosis usually persists and surveillance continues.

- **Weight loss**: about 5 % reduces liver fat; 7–10 % resolves MASH in many people; in one study, losing 10 % or more led to fibrosis regression in about 45 %.
- **Stopping alcohol** is the most important single step in alcohol-related liver disease and improves survival at every stage.
- **Treating viruses**: curing hepatitis C or suppressing hepatitis B lowers the risk of cirrhosis, cancer and death.
- **Medicines for MASH**: in 2024 the first was approved in the US for MASH with moderate or advanced fibrosis (resmetirom, a thyroid hormone receptor-β agonist), and in 2025 semaglutide, a GLP-1 receptor agonist, was approved for it too.
- **Transplantation** for liver failure and some liver cancers, with most recipients alive five years later.

### Finding it while it is silent
Standard liver blood tests can be normal even in cirrhosis. Guidelines therefore recommend a two-step check for people with type 2 diabetes, obesity or other metabolic risks: first the **FIB-4** score, calculated from routine blood tests,

$$\\text{FIB-4} = \\frac{\\text{age} \\times \\text{AST}}{\\text{platelets} \\times \\sqrt{\\text{ALT}}}$$

where below 1.3 makes advanced fibrosis unlikely and above 2.67 calls for a specialist (US and European guidelines, 2023–2024); in between (or over 65, when the lower cut-off is about 2.0) comes a measurement of liver stiffness by ultrasound (elastography). Anyone who may have been exposed to hepatitis B or C — and in many countries every adult once — should be tested.

> [!warn] A suspected overdose of paracetamol (acetaminophen) is an emergency even if the person feels well. So are vomiting blood, black tarry stools, new confusion or drowsiness, a rapidly swelling belly with fever or pain, or yellow skin or eyes with fever or confusion in someone with liver disease — call your local emergency number.
`,
  ideas: [
    'Viruses (hepatitis B and C), alcohol and metabolic fat (MASLD) are the leading causes of liver disease worldwide.',
    'Continued injury lays down scar: fibrosis is staged F0–F4, where F4 is cirrhosis; the stage predicts the outcome.',
    'Decompensated cirrhosis brings varices, ascites, jaundice, confusion and a raised risk of liver cancer.',
    'Removing the cause — weight loss, stopping alcohol, curing hepatitis C — lets fat and inflammation clear and fibrosis regress.',
    'Liver disease is silent: FIB-4 from routine blood tests, then elastography, finds scarring early in people at risk.'
  ],
  pitfalls: [
    'Only heavy drinkers get liver disease — Fatty liver disease linked to excess weight and diabetes is now the commonest liver condition, affecting about a third of adults.',
    'Normal liver blood tests mean a healthy liver — ALT can be normal even in advanced fibrosis; scores such as FIB-4 and stiffness scans are needed in people at risk.',
    'Liver scarring is permanent — Fibrosis often regresses once the cause is removed; only advanced cirrhosis usually persists.'
  ],
  formulas: [
    {
      name: 'The FIB-4 score',
      expr: 'FIB4 = A*AST/(PLT*sqrt(ALT))', tex: '\\text{FIB-4} = \\frac{A \\cdot \\text{AST}}{\\text{PLT} \\cdot \\sqrt{\\text{ALT}}}',
      vars: {
        FIB4: { name: 'FIB-4 score', tex: '\\text{FIB-4}' },
        A: { name: 'age (years)', value: 55 },
        AST: { name: 'AST (U/L)', value: 40, tex: '\\text{AST}' },
        ALT: { name: 'ALT (U/L)', value: 45, tex: '\\text{ALT}' },
        PLT: { name: 'platelet count (×10⁹/L)', value: 210, tex: '\\text{PLT}' }
      },
      note: 'For adults with suspected fatty liver disease or viral hepatitis: below 1.3 advanced fibrosis is unlikely; above 2.67 it is likely and a specialist should assess (over 65, a lower cut-off of about 2.0 is used). A triage score, not a diagnosis.',
      practice: { unknowns: ['FIB4'] },
      stories: { FIB4: 'A {A}-year-old with type 2 diabetes has AST {AST}, ALT {ALT} and platelets {PLT}. What is the FIB-4 score?' }
    },
    {
      name: 'Risk that adds up over the years',
      expr: 'P = 1 - (1 - a)^n', tex: 'P = 1 - (1 - a)^{n}',
      vars: {
        P: { name: 'chance of at least one event over the period', q: 'ratio', unit: '%', min: 0, max: 100 },
        a: { name: 'chance each year', q: 'ratio', unit: '%', value: 3, min: 0.01, max: 50 },
        n: { name: 'number of years', value: 10 }
      },
      note: 'With liver cancer arising at about 1–4 % a year in cirrhosis, the risk over a decade is large — the reason for ultrasound surveillance every six months.',
      stories: { P: 'Someone with cirrhosis has a {a} chance each year of developing liver cancer. What is the chance over {n} years?', n: 'With a {a} yearly risk, after how many years does the chance reach {P}?' }
    }
  ],
  examples: [
    {
      title: 'Ahmed\'s FIB-4',
      q: 'Ahmed, 58, has type 2 diabetes and a fatty liver. His AST is 42 U/L, ALT 48 U/L and platelets 160 × 10⁹/L. Calculate his FIB-4 and say what comes next.',
      steps: [
        '$\\sqrt{48} = 6.93$; denominator $160 \\times 6.93 = 1\\,109$.',
        'Numerator $58 \\times 42 = 2\\,436$; FIB-4 $= 2\\,436/1\\,109 = 2.2$.',
        'Between 1.3 and 2.67 is indeterminate, so the next step is a liver-stiffness measurement (elastography), which in his case showed moderate scarring.',
        'His plan targets the cause: support to lose weight, diabetes treatment that also helps the liver, little or no alcohol, and follow-up to watch the fibrosis regress.'
      ],
      a: 'FIB-4 ≈ 2.2: indeterminate, so a stiffness scan follows.'
    },
    {
      title: 'Why surveillance matters in cirrhosis',
      q: 'Liver cancer arises at about 3 % a year in a person with cirrhosis. What is the chance over 10 years? And at 2 % a year?',
      steps: [
        'At 3 %: $1 - 0.97^{10} = 1 - 0.74 = 0.26$ — about one in four.',
        'At 2 %: $1 - 0.98^{10} = 0.18$ — nearly one in five.',
        'Small yearly risks add up. Cancers found by six-monthly ultrasound are usually small enough to remove or ablate, which is why surveillance continues even after the cause is treated.'
      ],
      a: 'About 26 % at 3 % a year, about 18 % at 2 % a year.'
    },
    {
      title: 'Case: Grace and hepatitis C',
      q: 'Grace, 47, is found to have chronic hepatitis C with bridging fibrosis (F3). What does treatment achieve, and what follow-up does she need?',
      steps: [
        'Eight to twelve weeks of direct-acting antiviral tablets cure more than 95 % of people; cure is confirmed by a negative viral test 12 weeks after the course.',
        'With the virus gone, inflammation stops and fibrosis often regresses over the following years; her risks of cirrhosis, liver cancer and death fall sharply.',
        'Because she already had advanced fibrosis, her risk of liver cancer does not fall to zero, so she stays under surveillance. Cure does not protect against reinfection, and people close to her can be tested.'
      ],
      a: 'Cure in more than 95 %, halting the disease and often reversing scarring, with continued surveillance because of her advanced fibrosis.'
    }
  ],
  quiz: [
    { q: 'Which form of viral hepatitis can be cured with 8–12 weeks of tablets?', choices: ['hepatitis A', 'hepatitis B', 'hepatitis C', 'none of them'], a: 2,
      why: 'Direct-acting antivirals cure over 95 % of hepatitis C. Hepatitis B is controlled long term but rarely cured; hepatitis A resolves on its own and is prevented by a vaccine.' },
    { q: 'Fatty liver disease only affects people who drink a lot of alcohol.', a: false,
      why: 'Metabolic dysfunction-associated steatotic liver disease, linked to excess weight, diabetes and related factors, affects about a third of adults worldwide, most of whom drink little.' },
    { q: 'A 60-year-old has AST 30 U/L, ALT 25 U/L and platelets 250 × 10⁹/L. What is the FIB-4 score?', answer: 1.44,
      why: '$60 \\times 30 / (250 \\times \\sqrt{25}) = 1\\,800/1\\,250 = 1.44$ — just above 1.3, in the indeterminate range.' },
    { q: 'Which is a sign that cirrhosis has decompensated?', choices: ['a slightly raised ALT', 'fluid building up in the abdomen', 'a fatty liver on a scan', 'tiredness after a late night'], a: 1,
      why: 'Ascites — fluid in the abdomen — reflects portal hypertension and failing liver function. Others are jaundice, bleeding varices and confusion.' },
    { q: 'What is the single most important step for someone with alcohol-related liver disease?', choices: ['a detox supplement', 'stopping alcohol completely', 'cutting down to weekends only', 'a high-protein diet alone'], a: 1,
      why: 'Stopping alcohol improves survival at every stage, even in cirrhosis; support and medicines to help people stop are part of treatment.' }
  ],
  applications: ['Hepatitis B vaccination from birth and screening in pregnancy.', 'Testing and curing hepatitis C, towards WHO\'s goal of eliminating viral hepatitis as a public-health threat by 2030.', 'Screening people with diabetes or obesity for liver fibrosis with FIB-4 and elastography.', 'Six-monthly ultrasound surveillance for liver cancer in cirrhosis.'],
  sim: 'gi-liver-stages'
},

{
  id: 'celiac-disease', parent: 'digestive-disease', title: 'Coeliac disease and food intolerance', level: 2,
  short: 'Coeliac disease is an autoimmune reaction to gluten that flattens the lining of the small intestine and is treated by a lifelong gluten-free diet; how it differs from food allergy and from food intolerances such as lactose intolerance.',
  keywords: ['coeliac disease', 'celiac disease', 'gluten', 'gluten-free diet', 'wheat', 'barley', 'rye', 'oats', 'tissue transglutaminase', 'tTG antibodies', 'villous atrophy', 'dermatitis herpetiformis', 'food allergy', 'food intolerance', 'lactose intolerance', 'FODMAP', 'non-coeliac gluten sensitivity', 'irritable bowel syndrome'],
  prereq: ['digestion-absorption', 'autoimmunity', 'allergy'],
  related: ['ibd', 'anemia', 'bone-calcium', 'type1-diabetes', 'thyroid', 'anaphylaxis', 'vitamins-minerals', 'macronutrients'],
  body: `
For years Tomás, 38, put his bloating and loose stools down to a sensitive stomach. It was a blood test for tiredness that found iron-deficiency anaemia, and then a coeliac antibody test that came back strongly positive; a biopsy of his duodenum showed flattened villi. Six months into a strict gluten-free diet his iron was normal, the bloating had gone, and he realised how unwell he had been.

### What happens in coeliac disease
**Gluten** is a family of proteins in wheat, barley and rye. Part of it resists digestion, and in people with particular immune genes (HLA-DQ2 or DQ8) an enzyme in the gut wall, tissue transglutaminase, modifies these fragments so that immune cells treat them as a threat. The resulting inflammation flattens the villi — **villous atrophy** — and the absorbing surface of the small intestine collapses to a fraction of its normal size (see [[digestion-absorption]]). The immune system also makes antibodies against tissue transglutaminase, which is what the blood test detects. It is an autoimmune disease with a known trigger: remove gluten and it switches off.

About one person in a hundred has coeliac disease worldwide (pooled studies, 2018), most of them undiagnosed. About a third of people carry the risk genes, but only a small share of them develop it. It is more common in close relatives of people with coeliac disease (roughly one in ten), and in people with type 1 diabetes, autoimmune thyroid disease or Down syndrome.

Symptoms vary widely: diarrhoea, bloating, pain and weight loss; or only tiredness, iron or folate deficiency, mouth ulcers, thin bones, abnormal liver tests, fertility problems or tingling in the feet; an itchy, blistering rash (dermatitis herpetiformis); poor growth in children. Some people have no symptoms at all.

### Keep eating gluten until you are tested
Diagnosis starts with a blood test for IgA antibodies to tissue transglutaminase (with total IgA, since some people cannot make IgA), usually followed in adults by an endoscopy with biopsies of the duodenum. Children — and, under some newer guidelines, adults — with very high antibody levels confirmed on a second test can be diagnosed without a biopsy. The tests only work while gluten is being eaten: UK guidance, for example, advises eating some gluten in more than one meal every day for at least six weeks beforehand. Starting a gluten-free diet first can make the diagnosis impossible to confirm.

### Living gluten-free
The treatment is a strict, lifelong gluten-free diet, best learned with a dietitian. Foods labelled gluten-free contain less than 20 mg of gluten per kilogram (20 parts per million; Codex, EU and US rules), and most people with coeliac disease tolerate up to about 10 mg of gluten a day — compared with about 2 g in a single slice of ordinary bread, so crumbs and shared toasters matter. Rice, maize, potatoes, buckwheat, quinoa, meat, fish, eggs, dairy, fruit and vegetables are naturally gluten-free; pure oats that are not contaminated with wheat suit most people. Symptoms usually improve within weeks and the villi heal over months to a couple of years. Untreated coeliac disease raises the risk of anaemia, osteoporosis and, rarely, lymphoma of the intestine; the diet brings these risks back down.

### Allergy, intolerance or something else?
- **Food allergy** is an immune reaction, usually through IgE antibodies, within minutes to two hours: hives, swelling, vomiting, wheeze — and sometimes **anaphylaxis**. Common triggers are milk, egg, peanuts, tree nuts, fish, shellfish, wheat, soy and sesame. Diagnosis needs a specialist: skin or blood tests must be interpreted with the history, and sometimes a supervised food challenge.
- **Food intolerance** involves no immune attack: lactose intolerance (too little lactase), sensitivity to fermentable carbohydrates (FODMAPs) in [[ibd|irritable bowel syndrome]], reactions to some additives. It is uncomfortable, not dangerous.
- **Non-coeliac gluten or wheat sensitivity** describes symptoms after eating wheat without coeliac disease or wheat allergy. Its cause is uncertain: in blinded trials many people react to fructans (a FODMAP in wheat) or to the expectation of harm, rather than to gluten itself.
- Tests such as IgG food panels, hair analysis and kinesiology are not recommended by allergy societies: they do not diagnose allergy or intolerance.

> [!warn] Swelling of the lips, tongue or throat, difficulty breathing or swallowing, wheeze, hoarseness, or feeling faint soon after eating may be anaphylaxis (see [[anaphylaxis]]). Following current resuscitation guidelines (ERC, AHA): use an adrenaline (epinephrine) auto-injector if one has been prescribed, lie the person down with legs raised (or sit them up if breathing is hard), give a second dose after 5 minutes if there is no improvement, and call your local emergency number.
`,
  ideas: [
    'Coeliac disease is an autoimmune reaction to gluten (wheat, barley, rye) in people with HLA-DQ2 or DQ8 genes; it flattens the villi.',
    'About 1 % of people have it, most undiagnosed; symptoms range from diarrhoea and weight loss to only anaemia or thin bones.',
    'Diagnosis — antibody test, then usually a biopsy — only works while gluten is still being eaten.',
    'Treatment is a lifelong strict gluten-free diet; "gluten-free" means under 20 mg/kg, and most tolerate up to about 10 mg a day.',
    'Food allergy is an immune reaction that can cause anaphylaxis; intolerance (such as lactose) causes discomfort but no immune attack.'
  ],
  pitfalls: [
    'Coeliac disease is a wheat allergy — It is an autoimmune disease involving T cells and gut damage, not the IgE reaction of allergy; its trigger is gluten from wheat, barley and rye.',
    'Try a gluten-free diet first and get tested if it helps — Once gluten is removed, the tests can turn negative and the diagnosis cannot be confirmed; test first, while still eating gluten.',
    'A little gluten now and then does no harm in coeliac disease — Even small regular amounts can keep the lining damaged, sometimes without symptoms.'
  ],
  formulas: [
    {
      name: 'Gluten in a portion of food',
      expr: 'm = c*M', tex: 'm = c\\, M',
      vars: {
        m: { name: 'gluten eaten', q: 'mass', unit: 'mg' },
        c: { name: 'gluten content of the food', q: 'ratio', unit: 'ppm', value: 20 },
        M: { name: 'amount of the food eaten', q: 'mass', unit: 'g', value: 100 }
      },
      note: '20 ppm (20 mg of gluten per kg of food) is the "gluten-free" limit in Codex, EU and US rules. Most people with coeliac disease tolerate up to about 10 mg of gluten a day; ordinary bread is about 70 000 ppm (7 %).',
      stories: { m: 'A slice of gluten-free bread weighing {M} contains {c} of gluten. How much gluten is that?', M: 'A food contains {c} of gluten. How much of it could you eat before taking in {m} of gluten?' }
    }
  ],
  examples: [
    {
      title: 'How much gluten is in "gluten-free"?',
      q: 'A labelled gluten-free bread contains 20 ppm of gluten (the legal maximum). How much gluten is in 100 g? In 500 g of such foods over a day? How does that compare with one slice (30 g) of ordinary bread at about 7 % gluten?',
      steps: [
        '$20 \\times 10^{-6} \\times 100\\ \\text{g} = 0.002$ g = 2 mg.',
        '500 g of foods at the limit: $20 \\times 10^{-6} \\times 500 = 0.01$ g = 10 mg — about the amount most people with coeliac disease tolerate. Most products contain much less than the limit.',
        'Ordinary bread: $0.07 \\times 30 = 2.1$ g = 2 100 mg — two hundred times that daily amount in one slice. Even a crumb of 0.1 g carries 7 mg, which is why cross-contamination matters.'
      ],
      a: '2 mg per 100 g; 10 mg for 500 g; about 2 100 mg in one slice of ordinary bread.'
    },
    {
      title: 'Case: Tomás\'s diagnosis',
      q: 'Tomás, 38, has bloating, loose stools and iron-deficiency anaemia. How is coeliac disease confirmed, and what follows?',
      steps: [
        'While he is still eating gluten, a blood test for tissue transglutaminase antibodies (with total IgA) is strongly positive.',
        'An endoscopy with duodenal biopsies shows villous atrophy, confirming coeliac disease. Iron deficiency in an adult man always needs an explanation — here, poor absorption from a flattened lining.',
        'A dietitian teaches a strict gluten-free diet; his parents and siblings are offered testing (about one relative in ten is affected); his bones and vitamin levels are checked.',
        'At follow-up, antibody levels fall and his iron recovers as the villi heal.'
      ],
      a: 'Antibody test then biopsy while on gluten; lifelong gluten-free diet, testing of relatives, and follow-up.'
    }
  ],
  quiz: [
    { q: 'Before a blood test for coeliac disease, you should…', choices: ['stop eating gluten for a month', 'keep eating gluten, because the test depends on the immune response to it', 'fast for 24 hours', 'take an antihistamine'], a: 1,
      why: 'The antibodies — and the damage to the villi — fade on a gluten-free diet, so testing without gluten can give a false negative.' },
    { q: 'Coeliac disease is a food allergy like a peanut allergy.', a: false,
      why: 'Coeliac disease is an autoimmune disease driven by T cells, damaging the gut lining. Peanut allergy is an IgE reaction that can cause anaphylaxis within minutes.' },
    { q: 'A 50 g portion of a food contains 20 ppm of gluten. How many milligrams of gluten is that?', answer: 1, unit: 'mg',
      why: '$20 \\times 10^{-6} \\times 50$ g $= 0.001$ g = 1 mg.' },
    { q: 'Which of these contains gluten that is harmful in coeliac disease?', choices: ['rice', 'barley', 'maize (corn)', 'buckwheat'], a: 1,
      why: 'Wheat, barley and rye contain the harmful gluten proteins. Rice, maize and buckwheat are naturally gluten-free (buckwheat is not related to wheat despite its name).' },
    { q: 'Why does untreated coeliac disease cause iron deficiency and weight loss?', choices: ['gluten destroys iron in food', 'the flattened villi shrink the absorbing surface of the small intestine', 'the stomach stops making acid', 'the liver stops storing iron'], a: 1,
      why: 'Villi multiply the surface about tenfold; flattened, they absorb far less iron, folate, calcium and energy, especially in the duodenum where iron is taken up.' }
  ],
  applications: ['Testing people with anaemia, osteoporosis or relatives with coeliac disease.', 'Gluten-free labelling rules (20 ppm).', 'Telling allergy, intolerance and coeliac disease apart before cutting foods out.', 'Planning a safe gluten-free kitchen.'],
  sim: { id: 'gi-surface', params: { atrophy: true } }
}

);
