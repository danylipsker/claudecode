/* HYPER-PHARMACEUTICS · content/foundations-quality.js
 * Foundations — what a medicine is, its names, discovery, development, regulators, pharmacopoeias and GMP —
 * and Quality — quality by design, analytical methods (HPLC and validation), quality control and batch release,
 * and falsified medicines. Simulations in sims/foundations-quality.js (prefix found-).
 * All drugs in calculations are hypothetical; real products follow their own authorised information. */
Hyper.add(

/* ================================================================ WHAT A MEDICINE IS */
{
  id: 'what-is-a-drug', parent: 'what-medicines-are', title: 'What a medicine is', level: 1,
  short: 'A medicine is an active substance that changes how the body works — to treat, prevent or diagnose disease — made into a dosage form with excipients, packed, labelled and authorised for a purpose. The molecule is only part of it.',
  keywords: ['medicine', 'drug', 'active pharmaceutical ingredient', 'API', 'drug substance', 'drug product', 'excipient', 'dosage form', 'medicinal product', 'small molecule', 'biologic', 'salt form', 'strength', 'drug load', 'prescription-only', 'over the counter'],
  prereq: ['medicine:how-drugs-work', 'chemistry:molar-mass'],
  related: ['drug-names', 'routes', 'excipients', 'biologics', 'solid-state', 'drug-development'],
  body: `
A tablet of a common pain reliever weighs about 0.6 g, yet only part of that is the substance that relieves pain. The rest — a filler, a binder, a disintegrant, a lubricant, perhaps a coating — is what makes a tablet possible: it lets the powder flow into the press, hold together in the bottle and fall apart in the stomach. That is the first lesson of pharmaceutics: **a medicine is a product, not a molecule.**

### Drug, active ingredient, medicinal product
- The **active pharmaceutical ingredient** (API, or *drug substance*) is the molecule meant to act on the body.
- **Excipients** are everything else in the formulation: they carry, protect and release the drug (see [[excipients]]).
- The **dosage form** is the shape it takes — tablet, capsule, solution, injection, inhaler, cream, patch — chosen to suit the route (see [[routes]]).
- The **medicinal product** (*drug product*) is all of this in its container, with its label and leaflet, made to an approved specification and authorised for a stated use.

The law defines a medicine by what it claims and what it does. The European definition (Directive 2001/83/EC) covers any substance presented as treating or preventing disease, or used to restore, correct or modify physiological functions by a pharmacological, immunological or metabolic action, or to make a diagnosis; the US Food, Drug, and Cosmetic Act uses similar words. So the same vitamin can be a food supplement at one dose and claim, and a licensed medicine at another.

### How much drug is in a medicine
| Product (typical) | Active per unit | Unit mass | Drug load |
|---|---|---|---|
| Low-dose hormone tablet | 50 µg | 80 mg | 0.06 % |
| Everyday tablet | 10 mg | 200 mg | 5 % |
| High-dose pain-relief tablet | 500 mg | 600 mg | 83 % |
| Dry-powder inhaler, one dose | 100 µg | 12.5 mg with a lactose carrier | 0.8 % |

At low drug loads the challenge is mixing: every tablet must receive its share (see [[pharmacopoeias]] and [[quality-control]]). At high loads it is compaction: there is little room left for the excipients that help a powder bond (see [[compaction]]).

### Kinds of medicines
- **Small molecules**, mostly below 900 g/mol (paracetamol 151 g/mol, aspirin 180 g/mol), made by chemical synthesis; most can be swallowed.
- **Biologics**, proteins made by living cells: insulin (5.8 kDa), monoclonal antibodies (about 150 kDa — over 800 times the mass of aspirin). They would be digested in the gut, so they are injected or infused (see [[biologics]]).
- **Vaccines**, blood products and **advanced therapies**: gene therapies and engineered cells and tissues.
- Radiopharmaceuticals, contrast agents and other **diagnostics**, and regulated **herbal** products.

### Salts, bases and strength
Many APIs are made as salts — a hydrochloride, a sodium salt, a maleate — to improve solubility, stability or crystallinity (see [[solid-state]]). The strength on the label is usually stated as the free base or acid, so "10 mg (as hydrochloride)" contains more than 10 mg of salt. For a salt with one drug molecule per formula unit the mass to weigh is $m_{\\mathrm{salt}} = m_{\\mathrm{base}}\\,M_{\\mathrm{salt}}/M_{\\mathrm{base}}$.

### Legal classes
Most countries sort medicines into prescription-only, pharmacy-only (sold under a pharmacist's supervision) and general sale, with extra controls for medicines that can be misused. A medicine may be "switched" from prescription to pharmacy sale when long experience shows it can be used safely without a doctor.

> [!key] Medicine = active ingredient + excipients + dosage form + pack + information, authorised for a purpose. Two products with the same active ingredient and strength are not automatically the same medicine.
`,
  ideas: [
    'The active pharmaceutical ingredient is only part of a medicine; excipients, the dosage form, the pack and the information complete it.',
    'In law a medicine is defined by its claims and by its pharmacological, immunological or metabolic action.',
    'Drug load runs from well under 0.1 % to over 80 % of a tablet, and each extreme has its own manufacturing problem.',
    'Small molecules can usually be swallowed; proteins such as antibodies are digested and must be injected.',
    'Label strength is usually stated as the base or acid, so the mass of salt weighed is larger by the ratio of molar masses.'
  ],
  pitfalls: [
    'A drug and a medicine are the same thing — The drug (API) is the active molecule; the medicine is the whole authorised product. The same API is found in many medicines that behave differently.',
    'The strength on the label is the weight of the tablet — It is the mass of active ingredient, often expressed as the base; the tablet itself may weigh many times more.',
    'Natural products are gentler than synthetic ones — Toxicity depends on the molecule and the dose, not its origin; digoxin, atropine and paclitaxel all come from plants.'
  ],
  formulas: [
    {
      name: 'Drug load of a dosage unit',
      expr: 'w = mA/mU', tex: 'w = \\dfrac{m_{\\mathrm{API}}}{m_{\\mathrm{unit}}}',
      vars: {
        w: { name: 'drug load (fraction of the unit that is active ingredient)', q: 'ratio', unit: '%' },
        mA: { name: 'active ingredient per unit', q: 'mass', unit: 'mg', value: 10, tex: 'm_{\\mathrm{API}}' },
        mU: { name: 'mass of the unit (tablet, or capsule fill)', q: 'mass', unit: 'mg', value: 200, tex: 'm_{\\mathrm{unit}}' }
      },
      stories: {
        w: 'A tablet weighing {mU} contains {mA} of active ingredient. What is its drug load?',
        mU: 'A formulator wants a drug load of {w} for a dose of {mA}. How heavy will the tablet be?'
      }
    },
    {
      name: 'Salt and base: the mass to weigh',
      expr: 'ms = mb*Ms/Mb', tex: 'm_{\\mathrm{salt}} = m_{\\mathrm{base}}\\,\\dfrac{M_{\\mathrm{salt}}}{M_{\\mathrm{base}}}',
      vars: {
        ms: { name: 'mass of salt', q: 'mass', unit: 'mg', tex: 'm_{\\mathrm{salt}}' },
        mb: { name: 'mass of base (the labelled strength)', q: 'mass', unit: 'mg', value: 20, tex: 'm_{\\mathrm{base}}' },
        Ms: { name: 'molar mass of the salt', q: 'molarmass', unit: 'g/mol', value: 336.46, tex: 'M_{\\mathrm{salt}}' },
        Mb: { name: 'molar mass of the base', q: 'molarmass', unit: 'g/mol', value: 300, tex: 'M_{\\mathrm{base}}' }
      },
      note: 'For a salt with one drug molecule per formula unit; a hydrate adds its water to the salt\'s molar mass. The drugs here are hypothetical — a real product states its own equivalence.',
      stories: {
        ms: 'A hypothetical drug base has a molar mass of {Mb}; its hydrochloride, {Ms}. How much salt contains {mb} of base?',
        mb: 'A capsule contains {ms} of a salt (molar mass {Ms}) of a base with molar mass {Mb}. What strength, as base, should the label state?'
      }
    }
  ],
  examples: [
    {
      title: 'Weighing a salt',
      q: 'A hypothetical drug base has a molar mass of 300.0 g/mol; its hydrochloride adds one HCl (36.46 g/mol). Tablets are labelled "20 mg (as hydrochloride)", meaning 20 mg of base. How much salt goes into each tablet, and into a batch of 200,000 tablets?',
      steps: [
        'Molar mass of the salt: $300.0 + 36.46 = 336.46$ g/mol.',
        'Salt per tablet: $20 \\times 336.46/300.0 = 22.43$ mg.',
        'For 200,000 tablets: $22.43 \\times 200\\,000 = 4.486$ kg of salt — not 4.0 kg. Confusing salt and base would make every tablet 11 % weak.'
      ],
      a: '22.4 mg of salt per tablet; 4.49 kg for the batch.'
    },
    {
      title: 'A very low-dose tablet',
      q: 'A hypothetical hormone tablet contains 50 µg of drug and weighs 80 mg. What is its drug load, and how much drug is spread through a 100 kg batch of blend?',
      steps: [
        'Drug load: $0.050/80 = 6.25\\times10^{-4} = 0.0625$ %.',
        'Tablets per batch: $100\\,000\\,000$ mg $/ 80$ mg $= 1.25\\times10^{6}$ tablets.',
        'Drug per batch: $1.25\\times10^{6} \\times 0.050$ mg $= 62\\,500$ mg $= 62.5$ g — about the mass of an egg, spread evenly through four 25 kg sacks of powder.',
        'Plain mixing cannot do that reliably, so such products are made by stepwise (geometric) dilution, or by dissolving the drug and spraying it onto the granules — and they are tested unit by unit for uniformity.'
      ],
      a: 'A drug load of 0.0625 %: 62.5 g of drug in 100 kg of blend.'
    }
  ],
  quiz: [
    { q: 'In a film-coated tablet, which of these is the active pharmaceutical ingredient?', choices: ['the film coating', 'the lactose filler', 'the molecule that acts on the body', 'the magnesium stearate lubricant'], a: 2, why: 'The API is the substance meant to have the pharmacological effect; the coating, filler and lubricant are excipients.' },
    { q: 'A 250 mg tablet contains 5 mg of drug. What is its drug load?', answer: 2, unit: '%', why: '5/250 = 0.02 = 2 %.' },
    { q: 'Two tablets that contain the same active ingredient at the same strength must behave identically in the body.', a: false, why: 'Different excipients, particle sizes, crystal forms and manufacturing can change how fast the drug dissolves and is absorbed — which is why a generic must show bioequivalence.' },
    { q: 'Why are monoclonal antibodies injected rather than swallowed?', choices: ['they taste bitter', 'they are proteins that would be digested in the gut and are too large to be absorbed', 'they dissolve too fast in the stomach', 'tablets cannot hold enough of them'], a: 1, why: 'Proteases in the gut break proteins down, and a 150 kDa molecule cannot cross the gut wall in useful amounts.' },
    { q: 'A hypothetical acidic drug (free acid 250 g/mol) is made as its sodium salt (272 g/mol). How many mg of salt contain 50 mg of free acid?', answer: 54.4, unit: 'mg', why: '50 × 272/250 = 54.4 mg.' }
  ],
  problems: [
    { q: 'A hypothetical drug base (410.5 g/mol) is supplied as its 1:1 maleate salt (maleic acid 116.07 g/mol). How many grams of salt are needed for 1,000 capsules labelled 25 mg (as base)?', answer: 32.1, unit: 'g', tol: 0.02, steps: ['Salt molar mass: $410.5 + 116.07 = 526.57$ g/mol.', 'Per capsule: $25 \\times 526.57/410.5 = 32.07$ mg.', 'For 1,000 capsules: 32.07 g.'] }
  ],
  applications: [
    'Reading a label: the strength as base or salt, and what else is in the product.',
    'Choosing a dosage form for a new active ingredient (try the simulation below).',
    'Deciding whether a product is regulated as a medicine, a food supplement or a cosmetic.',
    'Explaining why a generic may look different yet contain the same active ingredient.'
  ],
  history: 'For most of history medicines were crude plant and mineral preparations of unknown strength. Chemists isolated morphine from opium in the early 1800s and quinine from cinchona bark in 1820, giving pure substances that could be weighed; acetylsalicylic acid was made in 1897, and in 1909 Paul Ehrlich\'s laboratory found arsphenamine, the first "magic bullet", after testing hundreds of arsenic compounds. Insulin was first given to a patient in 1922, and in 1982 human insulin made by genetically modified bacteria became the first medicine of the biotechnology era.',
  sim: 'found-forms'
},

{
  id: 'drug-names', parent: 'what-medicines-are', title: 'Drug names: INN, generic and brand', level: 1,
  short: 'A medicine has a chemical name, a development code, an international non-proprietary name (INN) that is the same worldwide and whose stem shows its family, and one or more brand names. Using the INN avoids confusion.',
  keywords: ['INN', 'international non-proprietary name', 'generic name', 'brand name', 'trademark', 'USAN', 'British Approved Name', 'stem', 'suffix', '-olol', '-pril', '-sartan', '-statin', '-mab', 'monoclonal antibody names', 'look-alike sound-alike', 'tall man lettering', 'chemical name'],
  prereq: ['what-is-a-drug', 'chemistry:nomenclature', 'medicine:how-drugs-work'],
  related: ['medication-errors', 'bioequivalence', 'biologics', 'regulation-approval', 'falsified-medicines'],
  body: `
Take one molecule used for pain and fever. Chemists call it *N*-(4-hydroxyphenyl)acetamide; most of the world calls it **paracetamol**; in the United States and Japan it is **acetaminophen**; and it is sold under hundreds of brand names. Each name has a job, and confusing them causes real harm.

### Four kinds of name
1. **Chemical name** — the systematic (IUPAC) name that describes the structure exactly. Precise, but long and unusable at a bedside.
2. **Code name** — letters and numbers given during development; the letters usually identify the company.
3. **International non-proprietary name (INN)** — the official generic name chosen by the World Health Organization, the same in every country and free for anyone to use.
4. **Brand (proprietary) name** — a trademark owned by a company, often different from country to country.

### How INNs are built
The WHO programme began in 1950 and published its first list of names in 1953. Names are meant to be distinctive in sound and spelling, not too long, and not easily confused with names already in use. Members of a pharmacological family share a **stem**, so the name tells you the class:

| Stem | Family | Examples |
|---|---|---|
| -olol | beta-adrenoceptor blockers | propranolol, atenolol |
| -pril | ACE inhibitors | enalapril, ramipril |
| -sartan | angiotensin II receptor blockers | losartan, valsartan |
| -statin | HMG-CoA reductase inhibitors | simvastatin, atorvastatin |
| -prazole | proton-pump inhibitors | omeprazole, lansoprazole |
| -dipine | dihydropyridine calcium-channel blockers | nifedipine, amlodipine |
| -cillin | penicillins | amoxicillin, flucloxacillin |
| -floxacin | fluoroquinolone antibacterials | ciprofloxacin, levofloxacin |
| -vir | antivirals | aciclovir, oseltamivir |
| -tinib | tyrosine kinase inhibitors | imatinib, erlotinib |
| -gliflozin | SGLT2 inhibitors | dapagliflozin, empagliflozin |
| -caine | local anaesthetics | lidocaine, bupivacaine |
| -mab | monoclonal antibodies | adalimumab, trastuzumab |

Older medicines (aspirin, morphine, digoxin) were named before the system and have no stem.

### Antibody names
A monoclonal antibody's name used to be built from parts: a unique prefix, an infix for the target (-li- immune system, -tu- tumour, -ci- cardiovascular …), an infix for the source (-xi- chimeric, -zu- humanised, -u- fully human) and the stem -mab. So *ri-tu-xi-mab* is a chimeric antibody against a tumour target and *ada-lim-u-mab* a human antibody acting on the immune system. The source infix was dropped for new names in 2017, and from 2022 new antibodies take one of four new stems (-tug, -bart, -mig, -ment) instead of -mab, because the old scheme had run out of room (at the time of writing).

### One drug, two names
A few INNs differ from the names adopted in the United States (USANs): paracetamol and acetaminophen, salbutamol and albuterol, glibenclamide and glyburide, rifampicin and rifampin. Epinephrine is the INN, but adrenaline is used in the UK and much of Europe. The UK changed most of its older British Approved Names to INNs around 2000: frusemide became furosemide, lignocaine lidocaine.

### Generic and brand
When patents expire, other companies may make **generic** versions, usually sold under the INN; they must be shown to be bioequivalent (see [[bioequivalence]]). The same brand name can mean different active ingredients in different countries — a trap for travellers. The salt and the release form matter too: an immediate-release and a prolonged-release tablet of the same INN are not interchangeable.

> [!warn] Look-alike, sound-alike names are a well-known cause of medication errors (hydroxyzine and hydralazine, for example). Many hospitals print such pairs in "tall man" letters — hydrOXYzine, hydrALAZINE. If a medicine looks different from usual, ask a pharmacist before taking it. See [[medication-errors]].
`,
  ideas: [
    'Every medicine has a chemical name, a development code, an INN and usually brand names.',
    'The INN is the same worldwide and belongs to no one; its stem places the drug in its family.',
    'Older antibody names encoded the target and the source: -xi- chimeric, -zu- humanised, -u- human.',
    'Brand names differ between countries and can mean different medicines; prescribing by INN avoids that.'
  ],
  pitfalls: [
    'Every drug with the same stem works the same way — A stem groups a family, but its members differ in potency, half-life, selectivity and interactions, and a few stems (such as -vir) span several mechanisms.',
    'A generic contains a different active ingredient from the brand — It contains the same active ingredient at the same strength; it may differ in excipients, shape and colour, and must be shown to be bioequivalent.',
    'Salt names and release descriptions are small print — "tartrate" and "succinate", or "prolonged-release", can mark products that are not interchangeable.'
  ],
  examples: [
    {
      title: 'Decoding four names',
      q: 'Which families do bisoprolol, candesartan, rosuvastatin and pantoprazole belong to?',
      steps: [
        'bis-o-**olol**: a beta-adrenoceptor blocker.',
        'cande-**sartan**: an angiotensin II receptor blocker.',
        'rosuva-**statin**: an HMG-CoA reductase inhibitor, which lowers cholesterol.',
        'panto-**prazole**: a proton-pump inhibitor, which reduces stomach acid.'
      ],
      a: 'A beta blocker, an angiotensin receptor blocker, a statin and a proton-pump inhibitor.'
    },
    {
      title: 'Reading antibody names',
      q: 'Under the older scheme, what do the names infliximab and trastuzumab tell you?',
      steps: [
        'inf-**li**-**xi**-mab: -li- for the immune system, -xi- for chimeric (mouse variable regions on a human constant region).',
        'tras-**tu**-**zu**-mab: -tu- for a tumour target, -zu- for humanised (only the binding loops come from the mouse).',
        'Chimeric antibodies are more likely than humanised or human ones to provoke antibodies against themselves, one reason the field moved towards human sequences.'
      ],
      a: 'Infliximab: a chimeric antibody acting on the immune system; trastuzumab: a humanised antibody against a tumour target.'
    }
  ],
  quiz: [
    { q: 'A new medicine is called "nebivolol". Which family does its name suggest?', choices: ['ACE inhibitor', 'beta-adrenoceptor blocker', 'statin', 'antiviral'], a: 1, why: 'The stem -olol marks beta-adrenoceptor blockers.' },
    { q: 'Which pair names the same substance?', choices: ['salbutamol and albuterol', 'lidocaine and lisinopril', 'glibenclamide and glipizide', 'rifampicin and ribavirin'], a: 0, why: 'Salbutamol is the INN and albuterol the US adopted name for the same bronchodilator; the other pairs are different drugs — some of them look-alike pairs.' },
    { q: 'Under the older antibody scheme, what does "-zu-" in trastuzumab tell you?', choices: ['it targets a tumour', 'it is humanised', 'it is fully human', 'it is an antibody fragment'], a: 1, why: '-tu- is the tumour target; -zu- marks a humanised antibody.' },
    { q: 'A brand name identifies the same active ingredient in every country.', a: false, why: 'Brand names are national trademarks; the same name can be used for different products in different countries. The INN is the reliable identifier.' },
    { q: 'Why does the WHO avoid choosing INNs that sound like existing names?', choices: ['to protect trademarks', 'to prevent medication errors from look-alike, sound-alike names', 'to keep names short', 'because stems must be unique'], a: 1, why: 'Similar names are mixed up in prescriptions and dispensing; distinctiveness is a core INN principle.' }
  ],
  applications: [
    'Prescribing and labelling by INN, which most health systems encourage.',
    'Recognising the family of an unfamiliar medicine from its stem.',
    'Tall-man lettering and other safeguards against look-alike, sound-alike errors.',
    'Checking what a foreign brand contains when travelling — by its INN.'
  ],
  history: 'The World Health Assembly created the INN programme in 1950 and the first list of names appeared in 1953. National names — British Approved Names, US Adopted Names — grew up alongside; most countries now use INNs, and the European Union requires them on labels and leaflets. The antibody naming scheme, introduced in the early 1990s, has been revised several times as hundreds of antibodies entered development.'
},

{
  id: 'drug-discovery', parent: 'what-medicines-are', title: 'Discovering new drugs', level: 2,
  short: 'How new medicines are found: choose and validate a target, screen hundreds of thousands of compounds for hits, and turn hits into leads and leads into a candidate that is potent, selective and drug-like — or find antibodies by immunisation and display.',
  keywords: ['drug discovery', 'target', 'target validation', 'high-throughput screening', 'HTS', 'hit', 'lead', 'lead optimisation', 'structure–activity relationship', 'SAR', 'IC50', 'Ki', 'Cheng–Prusoff', 'pIC50', 'ligand efficiency', 'rule of five', 'Lipinski', 'fragment-based', 'phenotypic screening', 'natural products', 'phage display', 'hybridoma'],
  prereq: ['what-is-a-drug', 'receptors', 'biology:enzyme-kinetics', 'chemistry:functional-groups'],
  related: ['drug-development', 'partition-logp', 'dose-response', 'solubility-pharm', 'biologics-formulation', 'pharmacogenomics'],
  body: `
Behind every new medicine are thousands of molecules that were made, tested and dropped. Drug discovery is the search for one molecule that does the right thing to the right target, strongly enough, and has a chance of surviving everything that follows.

### A target, and a reason to believe in it
Most drugs act on a protein: an enzyme, a receptor, an ion channel or a transporter (see [[receptors]]); about a third of approved drugs act on G-protein-coupled receptors alone. A **target** is chosen because evidence links it to the disease, and the strongest evidence is human genetics. People born with inactive copies of the gene *PCSK9* have very low LDL cholesterol and fewer heart attacks, with no obvious harm; that observation (2005–2006) led to antibodies that block PCSK9, approved in 2015. The alternative, **phenotypic screening**, looks for compounds that correct a defect in cells or tissues without knowing the target first.

### Finding hits
In **high-throughput screening** robots test a library of $10^5$ to $10^6$ compounds, typically at 10 µM in 1536-well plates. Hit rates are around 0.1–1 %, and many hits prove false or weak. Other routes: **fragment screening** (molecules below about 300 g/mol that bind weakly but efficiently, then grown), **structure-based design** from X-ray and cryo-EM structures, virtual screening by computer — and nature: penicillin (1928), the statins (from fungi, 1970s) and artemisinin (1972) all began as natural products.

### From hit to candidate
Medicinal chemists then make hundreds of analogues, learning the **structure–activity relationship**: which changes raise potency and which destroy it. Potency is measured as the IC50, the concentration that halves the target's activity. It depends on the assay — a competitive inhibitor looks weaker when there is more substrate — so the Cheng–Prusoff equation (1973) converts it to the inhibition constant, a property of the molecule:

$$K_i = \\frac{\\mathrm{IC}_{50}}{1 + \\mathrm{[S]}/K_m}$$

Potency is not enough. A **lead** is optimised on many properties at once: selectivity over related targets, solubility, permeability, metabolic stability, no block of the cardiac hERG channel, no inhibition of the liver's CYP enzymes. Chemists watch **ligand efficiency**, the binding energy per heavy (non-hydrogen) atom, $\\mathrm{LE} \\approx 1.37\\,\\mathrm{pIC}_{50}/N_{\\mathrm{heavy}}$ kcal/mol, because potency bought by adding bulk usually costs solubility and absorption.

### Drug-likeness
In 1997 Christopher Lipinski noticed that orally absorbed drugs rarely break more than one of four limits — the **rule of five**: molar mass ≤ 500 g/mol, log P ≤ 5, at most 5 hydrogen-bond donors and 10 acceptors (see [[partition-logp]]). It is a warning light, not a law: antibiotics, natural products and some newer drugs work well beyond it.

### Antibodies
Antibodies are found differently: by immunising animals (the hybridoma method of Köhler and Milstein, 1975), by **phage display** of vast antibody libraries, or with mice that carry human antibody genes — then engineered for affinity, stability and low immunogenicity.

| Stage (classic industry figures) | Compounds |
|---|---|
| Made or screened | 5,000–10,000 |
| Enter preclinical testing | about 250 |
| Enter clinical trials | about 5 |
| Approved | 1 |

> [!key] Discovery ends with a **candidate**: a molecule potent, selective, soluble and stable enough to be worth the far greater cost of [[drug-development|development]].
`,
  ideas: [
    'A drug target is chosen on evidence; variants in human genes that mimic the drug are the strongest evidence.',
    'Screening finds weak hits; medicinal chemistry turns them into potent, selective, drug-like leads.',
    'IC50 depends on the assay; Cheng–Prusoff converts it to Ki, a constant of the molecule.',
    'Ligand efficiency rewards binding per atom, guarding against potency bought with bulk.',
    'The rule of five flags molecules unlikely to be absorbed orally — a warning, not a law.'
  ],
  pitfalls: [
    'The most potent compound is the best candidate — Potency is one property of many; solubility, selectivity, metabolism and safety decide far more candidates\' fate, and potency bought with bulk often ruins them.',
    'IC50 is a fixed property of a molecule — It depends on assay conditions such as the substrate and enzyme concentrations; the inhibition constant Ki is the constant.',
    'Computers now design drugs without experiments — Structure prediction and machine learning speed up design, but every prediction must still be made and tested, in cells, animals and people.'
  ],
  formulas: [
    {
      name: 'Cheng–Prusoff: IC50 to Ki for a competitive inhibitor',
      expr: 'Ki = IC50/(1 + S/Km)', tex: 'K_i = \\dfrac{\\mathrm{IC}_{50}}{1 + \\mathrm{[S]}/K_m}',
      vars: {
        Ki: { name: 'inhibition constant', q: 'concentration', unit: 'nM', tex: 'K_i' },
        IC50: { name: 'concentration giving 50 % inhibition', q: 'concentration', unit: 'nM', value: 50, tex: '\\mathrm{IC}_{50}' },
        S: { name: 'substrate concentration in the assay', q: 'concentration', unit: 'µM', value: 10, tex: '\\mathrm{[S]}' },
        Km: { name: 'Michaelis constant of the substrate', q: 'concentration', unit: 'µM', value: 5, tex: 'K_m' }
      },
      note: 'For a reversible inhibitor competing with the substrate of an enzyme that follows Michaelis–Menten kinetics. For receptor binding, [S] and K_m become the radioligand concentration and its dissociation constant.',
      stories: {
        Ki: 'An enzyme assay run with {S} of substrate (K_m = {Km}) gives an IC₅₀ of {IC50} for a hypothetical inhibitor. What is its inhibition constant?',
        IC50: 'A competitive inhibitor has Ki = {Ki}. What IC₅₀ will an assay with {S} of substrate (K_m = {Km}) report?'
      }
    },
    {
      name: 'pIC50',
      expr: 'pIC50 = -log(IC50)', tex: '\\mathrm{pIC}_{50} = -\\log_{10} \\mathrm{IC}_{50}',
      vars: {
        pIC50: { name: 'pIC₅₀', tex: '\\mathrm{pIC}_{50}' },
        IC50: { name: 'IC₅₀ (mol/L)', value: 5e-8, tex: '\\mathrm{IC}_{50}' }
      },
      note: 'The IC₅₀ in mol/L: 1 µM gives 6, 1 nM gives 9. Each unit of pIC₅₀ is a tenfold change in potency.',
      stories: { pIC50: 'A compound has an IC₅₀ of {IC50} mol/L. What is its pIC₅₀?', IC50: 'A lead has a pIC₅₀ of {pIC50}. What is its IC₅₀ in mol/L?' }
    },
    {
      name: 'Ligand efficiency',
      expr: 'LE = 1.37*pIC50/HA', tex: '\\mathrm{LE} = \\dfrac{1.37\\,\\mathrm{pIC}_{50}}{N_{\\mathrm{heavy}}}',
      vars: {
        LE: { name: 'ligand efficiency (kcal/mol per heavy atom)', tex: '\\mathrm{LE}' },
        pIC50: { name: 'pIC₅₀ (or pKi)', value: 7, tex: '\\mathrm{pIC}_{50}' },
        HA: { name: 'heavy (non-hydrogen) atoms', value: 30, int: true, tex: 'N_{\\mathrm{heavy}}' }
      },
      note: '1.37 kcal/mol is 2.303 RT at about 300 K, so LE is the binding free energy per heavy atom. Leads usually aim for LE ≥ 0.3.',
      stories: { LE: 'A lead with {HA} heavy atoms has a pIC₅₀ of {pIC50}. What is its ligand efficiency?', HA: 'A team wants LE = {LE} at pIC₅₀ = {pIC50}. How many heavy atoms can the molecule have?' }
    }
  ],
  examples: [
    {
      title: 'Two laboratories, one inhibitor',
      q: 'Laboratory A measures IC50 = 80 nM for a competitive inhibitor with the substrate at its K_m. Laboratory B, using nine times K_m, reports 400 nM. Do they disagree?',
      steps: [
        'A: $K_i = 80/(1 + 1) = 40$ nM.',
        'B: $K_i = 400/(1 + 9) = 40$ nM.',
        'The molecule is the same; only the substrate differs. Comparing IC50s across assays without Cheng–Prusoff would suggest a fivefold difference that does not exist.'
      ],
      a: 'No — both give Ki = 40 nM.'
    },
    {
      title: 'A fragment against a lead',
      q: 'A fragment with 13 heavy atoms has IC50 = 200 µM. A lead grown from it has 35 heavy atoms and IC50 = 10 nM. Compare their ligand efficiencies.',
      steps: [
        'Fragment: $\\mathrm{pIC}_{50} = -\\log_{10}(2\\times10^{-4}) = 3.70$; $\\mathrm{LE} = 1.37 \\times 3.70/13 = 0.39$.',
        'Lead: $\\mathrm{pIC}_{50} = 8.0$; $\\mathrm{LE} = 1.37 \\times 8.0/35 = 0.31$.',
        'The lead is 20,000 times more potent, but each atom contributes less: efficiency has been spent to buy potency, and chemists try to spend as little as possible.'
      ],
      a: 'LE falls from 0.39 to 0.31 while potency rises 20,000-fold.'
    }
  ],
  quiz: [
    { q: 'A competitive inhibitor gives IC50 = 90 nM in an assay run with the substrate at its K_m. What is its Ki?', answer: 45, unit: 'nM', why: 'Ki = 90/(1 + 1) = 45 nM.' },
    { q: 'What is the pIC50 of a compound with IC50 = 1 nM?', answer: 9, why: '−log₁₀(10⁻⁹) = 9.' },
    { q: 'A compound that breaks one of Lipinski\'s rules cannot become an oral medicine.', a: false, why: 'The rule warns when two or more limits are broken, and even then it is a guide; many oral drugs break one or more.' },
    { q: 'Why is evidence from human genetics prized when choosing a target?', choices: ['it is cheaper than chemistry', 'it shows what lifelong changes in the target do in people, predicting benefit and safety', 'it guarantees that a drug will be found', 'regulators require it'], a: 1, why: 'People with natural loss-of-function variants are an experiment of nature: if they are healthy and protected from the disease, a drug blocking the target may do the same.' },
    { q: 'Adding a large greasy group to a lead raises its potency tenfold (pIC50 7 → 8) but its heavy atoms from 30 to 40. Its ligand efficiency…', choices: ['rises', 'falls', 'stays the same', 'cannot be calculated'], a: 1, why: 'LE goes from 1.37 × 7/30 = 0.32 to 1.37 × 8/40 = 0.27: potency rose less than the size.' }
  ],
  applications: [
    'Screening compound libraries in 1536-well plates with robotic liquid handling.',
    'Structure-based design from X-ray and cryo-EM structures and from predicted protein structures.',
    'Converting assay IC50s to Ki values so that results from different laboratories can be compared.',
    'Natural-product discovery, which gave penicillin, the statins, artemisinin and paclitaxel.'
  ],
  history: 'Paul Ehrlich tested hundreds of synthetic compounds to find arsphenamine in 1909, an early systematic screen. From the 1940s Gertrude Elion and George Hitchings designed antimetabolites by reasoning about nucleic-acid chemistry, and James Black designed propranolol and cimetidine against specific receptors — work recognised by the 1988 Nobel Prize in Physiology or Medicine. Georges Köhler and César Milstein\'s hybridoma method (1975, Nobel 1984) made monoclonal antibodies possible, and phage display (George Smith and Gregory Winter, Nobel Prize in Chemistry 2018) made fully human antibodies routine.',
  sim: 'found-pipeline'
},

{
  id: 'drug-development', parent: 'what-medicines-are', title: 'From laboratory to patient', level: 2,
  short: 'The ten-to-fifteen-year road from a candidate molecule to an approved medicine: preclinical safety testing, clinical trials in phases I, II and III, a marketing application and phase IV — with fewer than one in ten candidates that enter people reaching patients.',
  keywords: ['drug development', 'preclinical', 'toxicology', 'GLP', 'first in human', 'phase I', 'phase II', 'phase III', 'phase IV', 'IND', 'CTA', 'attrition', 'likelihood of approval', 'NOAEL', 'human equivalent dose', 'MRSD', 'MABEL', 'CMC', 'development cost'],
  prereq: ['drug-discovery', 'adme', 'medicine:clinical-trials'],
  related: ['clinical-trials', 'regulation-approval', 'gmp', 'pharmacovigilance', 'qbd', 'stability-testing', 'bioequivalence'],
  body: `
A candidate that works in a test tube and in animals still has a long way to go. Before it reaches a pharmacy it will be tested in thousands of people over a decade or more — and at every step the most likely outcome is failure.

### The stages
| Stage | Main question | People | Typical time |
|---|---|---|---|
| Preclinical | Is it safe enough to give to people, and at what dose? | — | 1–2 years |
| Phase I | Is it tolerated? How is it absorbed and cleared? | 20–100, often healthy volunteers | 1–2 years |
| Phase II | Does it work in patients, and at which dose? | 100–500 patients | 2–3 years |
| Phase III | Is it better than placebo or standard treatment, and safe enough, in a large and varied population? | 1,000–5,000 or more | 2–4 years |
| Review | Do the benefits outweigh the risks? | — | about 1 year |
| Phase IV | What happens in everyday use? | many thousands | ongoing |

**Preclinical** studies, done to good laboratory practice (GLP), cover pharmacology, safety pharmacology (heart, lungs, nervous system), genotoxicity and repeat-dose toxicity in two species — usually a rodent and a non-rodent — for at least as long as the planned trials (ICH M3(R2), 2009). The sponsor then files an investigational new drug application (IND) in the United States or a clinical trial application (CTA) in Europe, and an ethics committee must approve the protocol.

### The first dose in people
Doses are converted from animals to people by body-surface area rather than by weight, because metabolic rate scales roughly with body mass to the power 0.67–0.75. The FDA's 2005 guidance takes the no-observed-adverse-effect level (NOAEL) in the most sensitive species, converts it to a human equivalent dose, $\\mathrm{HED} = \\mathrm{NOAEL}\\,(W_a/W_h)^{0.33}$, and divides by a safety factor of at least 10. For medicines that act powerfully on the immune system the start is instead set from the *minimal anticipated biological effect level* (MABEL) — a lesson from a 2006 trial in London in which six volunteers became critically ill within hours of a first dose. Doses then rise cohort by cohort, with one or two sentinel volunteers dosed first.

### Attrition: most candidates fail
A large industry analysis of clinical programmes from 2011 to 2020 (BIO, Informa Pharma Intelligence and QLS, 2021) found these chances of moving on:

| Transition | Probability |
|---|---|
| Phase I → phase II | 52 % |
| Phase II → phase III | 29 % |
| Phase III → submission | 58 % |
| Submission → approval | 91 % |
| **Phase I → approval** | **7.9 %** |

Phase II is the great filter: it is where a candidate first meets the disease in enough patients to show whether it works. Roughly half of late-stage failures are for lack of efficacy, a quarter for safety and the rest for strategic or commercial reasons. Success varies by field — about a quarter for blood disorders, about 5 % for cancer.

### Time and money
From discovery to approval takes 10–15 years. Published estimates of the cost per approved medicine range from about 1 to 2.6 billion US dollars; most of it pays for the candidates that failed and for years of capital tied up. Meanwhile chemists and formulators scale the synthesis from grams to tonnes and develop the final dosage form, its specifications and its stability data — **chemistry, manufacturing and controls** (CMC), made under [[gmp|GMP]].

> [!note] Trials are approved by ethics committees and regulators; volunteers give informed consent and may leave at any time. See [[clinical-trials]] and [[medicine:clinical-trials|how medicines are tested]].
`,
  ideas: [
    'Preclinical testing in two species precedes any dose in people.',
    'Phase I asks about safety and pharmacokinetics, phase II whether it works and at what dose, phase III confirms in large trials.',
    'Only about 8 % of candidates entering phase I are approved; phase II removes the most.',
    'First doses in people come from animal NOAELs scaled by body-surface area and divided by a safety factor.',
    'Most of the cost of a new medicine pays for the failures and for time.'
  ],
  pitfalls: [
    'Phase I tests whether a drug works — Its main aims are safety, tolerability and pharmacokinetics, usually in healthy volunteers; efficacy is first tested properly in phase II.',
    'Animal studies prove a medicine is safe for people — They reduce the risk a great deal, but species differ; that is why first doses are low, rise slowly and are watched closely.',
    'The cost of development is mostly the cost of the successful drug — Most of it pays for the candidates that failed and for the capital tied up; cutting phase II failures would save more than anything else.'
  ],
  formulas: [
    {
      name: 'Chance of approval from phase I',
      expr: 'P = p1*p2*p3*p4', tex: 'P = p_1\\,p_2\\,p_3\\,p_4',
      vars: {
        P: { name: 'chance of approval for a candidate entering phase I', q: 'ratio', unit: '%' },
        p1: { name: 'phase I → phase II', q: 'ratio', unit: '%', value: 52, tex: 'p_1' },
        p2: { name: 'phase II → phase III', q: 'ratio', unit: '%', value: 28.9, tex: 'p_2' },
        p3: { name: 'phase III → submission', q: 'ratio', unit: '%', value: 57.8, tex: 'p_3' },
        p4: { name: 'submission → approval', q: 'ratio', unit: '%', value: 90.6, tex: 'p_4' }
      },
      note: 'The default values are the 2011–2020 averages across all fields (BIO, Informa, QLS, 2021).',
      stories: {
        P: 'A candidate has chances of {p1}, {p2}, {p3} and {p4} of passing phase I, phase II, phase III and review. What is its chance of approval?',
        p2: 'A portfolio needs a {P} chance of approval; phases I and III and review succeed {p1}, {p3} and {p4} of the time. What phase II success rate does that require?'
      }
    },
    {
      name: 'Expected approvals from a portfolio',
      expr: 'A = N*P', tex: 'A = N\\,P',
      vars: {
        A: { name: 'expected approvals' },
        N: { name: 'candidates entering phase I', value: 50 },
        P: { name: 'chance of approval from phase I', q: 'ratio', unit: '%', value: 7.9 }
      },
      stories: {
        A: '{N} candidates enter phase I, each with a {P} chance of approval. How many approvals can be expected?',
        N: 'With a {P} chance of approval each, how many candidates must enter phase I to expect {A} approvals?'
      }
    },
    {
      name: 'Maximum recommended starting dose (FDA, 2005)',
      expr: 'MRSD = NOAEL*(Wa/Wh)^0.33/SF', tex: '\\mathrm{MRSD} = \\dfrac{\\mathrm{NOAEL}\\,(W_a/W_h)^{0.33}}{\\mathrm{SF}}',
      vars: {
        MRSD: { name: 'maximum recommended starting dose', q: 'doseperkg', unit: 'mg/kg', tex: '\\mathrm{MRSD}' },
        NOAEL: { name: 'no-observed-adverse-effect level in the animal', q: 'doseperkg', unit: 'mg/kg', value: 50, tex: '\\mathrm{NOAEL}' },
        Wa: { name: 'animal body weight', q: 'mass', unit: 'kg', value: 0.15, tex: 'W_a' },
        Wh: { name: 'human body weight', q: 'mass', unit: 'kg', value: 60, tex: 'W_h' },
        SF: { name: 'safety factor', value: 10, tex: '\\mathrm{SF}' }
      },
      note: 'The body-surface-area conversion of the FDA\'s 2005 guidance with its default safety factor of 10. Illustrative only: real first-in-human doses also weigh the pharmacology, the pharmacokinetics and, for high-risk medicines, the MABEL.',
      practice: { unknowns: ['MRSD', 'NOAEL'] },
      stories: {
        MRSD: 'In a hypothetical rat study ({Wa}) the NOAEL is {NOAEL}. With a safety factor of {SF}, what starting dose per kg does this give for a {Wh} adult?',
        NOAEL: 'A sponsor wants to start at {MRSD} in {Wh} adults with a safety factor of {SF}. What NOAEL in {Wa} animals would support that?'
      }
    }
  ],
  examples: [
    {
      title: 'A cohort through the pipeline',
      q: 'One hundred candidates enter phase I with the 2011–2020 average success rates. How many reach each stage, and how many candidates are needed per approval?',
      steps: [
        'Into phase II: $100 \\times 0.52 = 52$.',
        'Into phase III: $52 \\times 0.289 = 15.0$.',
        'Submitted: $15.0 \\times 0.578 = 8.7$; approved: $8.7 \\times 0.906 = 7.9$.',
        'Candidates per approval: $1/0.0787 = 12.7$ — and each of those twelve or thirteen was itself the survivor of thousands of compounds in discovery.'
      ],
      a: 'About 52, 15, 9 and 8 — some 13 candidates in phase I for each approval.'
    },
    {
      title: 'A first-in-human starting dose',
      q: 'A hypothetical small molecule has a NOAEL of 50 mg/kg in rats (0.15 kg) and 10 mg/kg in dogs (10 kg). What maximum recommended starting dose does the FDA method give for a 60 kg adult?',
      steps: [
        'Rat: $\\mathrm{HED} = 50 \\times (0.15/60)^{0.33} = 50 \\times 0.138 = 6.9$ mg/kg.',
        'Dog: $\\mathrm{HED} = 10 \\times (10/60)^{0.33} = 10 \\times 0.554 = 5.5$ mg/kg.',
        'The dog is the more sensitive species here (lower HED), so it sets the dose: $5.5/10 = 0.55$ mg/kg.',
        'For 60 kg: $0.55 \\times 60 = 33$ mg — a ceiling, not a target; the first cohort often starts lower still.'
      ],
      a: 'About 0.55 mg/kg, or 33 mg for a 60 kg adult (from the dog data).'
    }
  ],
  quiz: [
    { q: 'In which phase is a new medicine usually first tested for efficacy in patients?', choices: ['preclinical', 'phase I', 'phase II', 'phase IV'], a: 2, why: 'Phase I is mostly about safety and pharmacokinetics; phase II is the first proper test of whether it works, and at which dose.' },
    { q: 'A candidate has a 60 %, 30 %, 60 % and 90 % chance of passing phase I, phase II, phase III and review. What is its chance of approval?', answer: 9.72, unit: '%', why: '0.6 × 0.3 × 0.6 × 0.9 = 0.0972.' },
    { q: 'Most drugs that fail in phases II and III fail because they turn out to be unsafe.', a: false, why: 'Lack of efficacy is the commonest reason — about half; safety accounts for about a quarter.' },
    { q: 'Why are doses scaled from animals to people by body-surface area rather than by weight?', choices: ['surface area is easier to measure', 'metabolic rate and clearance scale roughly with mass to the power 0.67–0.75, so small animals handle more drug per kg', 'animals are always more sensitive than people', 'regulators prefer round numbers'], a: 1, why: 'A rat clears drug much faster per kilogram than a person; scaling by weight alone would overestimate the safe human dose about sevenfold.' },
    { q: 'A hypothetical rat NOAEL is 30 mg/kg. Using HED = NOAEL × (0.15/60)^0.33 and a safety factor of 10, what is the starting dose for a 60 kg adult?', answer: 24.9, unit: 'mg', why: 'HED = 30 × 0.1385 = 4.15 mg/kg; ÷ 10 = 0.415 mg/kg; × 60 kg = 24.9 mg.' }
  ],
  applications: [
    'Planning a portfolio: how many candidates a company must start to expect one approval.',
    'Choosing a safe starting dose and escalation plan for a first-in-human trial.',
    'Adaptive trials that stop early for futility, sparing patients and money.',
    'Medicines for rare diseases, where trials are small and every patient counts.'
  ],
  history: 'Modern drug development was shaped by disaster. In 1937 an "elixir" of sulfanilamide dissolved in diethylene glycol killed more than 100 people in the United States, and the 1938 Federal Food, Drug, and Cosmetic Act made proof of safety a condition of sale. Thalidomide, sold from 1957 as a sedative, caused severe limb defects in about 10,000 children before it was withdrawn in 1961; at the FDA, Frances Kelsey had refused to approve it. The 1962 Kefauver–Harris Amendments then required proof of efficacy from "adequate and well-controlled" studies — the origin of today\'s phased trials.',
  sim: 'found-pipeline'
},

{
  id: 'regulation-approval', parent: 'what-medicines-are', title: 'Regulators and approval', level: 2,
  short: 'A medicine reaches patients only after a regulator — the FDA, the EMA with the European Commission, the MHRA, the PMDA and others — judges from the dossier that its benefits outweigh its risks and its quality is assured; generics, biosimilars and fast routes have their own paths.',
  keywords: ['regulator', 'FDA', 'EMA', 'European Commission', 'MHRA', 'PMDA', 'marketing authorisation', 'NDA', 'BLA', 'ANDA', 'Common Technical Document', 'CTD', 'ICH', 'benefit–risk', 'priority review', 'accelerated approval', 'conditional marketing authorisation', 'orphan drug', 'data exclusivity', 'patent', 'supplementary protection certificate', 'generic', 'biosimilar'],
  prereq: ['drug-development', 'what-is-a-drug', 'medicine:clinical-trials'],
  related: ['bioequivalence', 'biologics', 'pharmacovigilance', 'gmp', 'pharmacopoeias', 'clinical-trials'],
  body: `
A medicine may be sold only after a regulator has studied the evidence and agreed that its **benefits outweigh its risks**, that it can be made to a consistent quality, and that its label says how to use it safely. The company submits a dossier; the regulator's scientists, doctors and statisticians review it, inspect the factories and agree the wording of the product information.

### Who decides
| Region | Regulator | How it works |
|---|---|---|
| United States | Food and Drug Administration (FDA) | CDER reviews most drugs and therapeutic biologics; CBER vaccines, blood, cell and gene therapies |
| European Union | European Medicines Agency (EMA) and European Commission | the EMA's committee (CHMP) gives an opinion; the Commission grants one authorisation valid in every EU and EEA country |
| United Kingdom | Medicines and Healthcare products Regulatory Agency (MHRA) | national authorisations since 2021 |
| Japan | Pharmaceuticals and Medical Devices Agency (PMDA) | with the Ministry of Health, Labour and Welfare |

Canada, Australia, Switzerland, Israel, Brazil, China, India and others have their own agencies; many now rely on or share each other's assessments, and the WHO **prequalifies** medicines bought by United Nations agencies.

### One dossier for many regulators
Since 1990 the International Council for Harmonisation (ICH) has brought regulators and industry together to write common guidelines: Q for quality, S for safety, E for efficacy and M for multidisciplinary topics. Its **Common Technical Document** (ICH M4, agreed in 2000) arranges every application in five modules: 1 regional administrative information, 2 summaries, 3 quality (the CMC data), 4 non-clinical reports and 5 clinical study reports — now filed electronically (eCTD).

### How long review takes
The FDA aims to act on a standard application for a new molecule within 10 months of accepting it for review (about 12 months from submission) and on a priority one within 6. The EMA's centralised procedure allows 210 days of assessment, plus the time the company takes to answer questions and about two months for the Commission's decision — about a year in practice (at the time of writing).

### Faster and special routes
- **Accelerated approval** (US) and **conditional marketing authorisation** (EU) rest on a surrogate endpoint, such as tumour shrinkage, when the need is urgent — and require confirmatory trials afterwards.
- **Priority review**, **breakthrough therapy** and **fast track** (US), and **PRIME** (EU), speed up promising medicines for serious conditions.
- **Orphan** medicines for rare diseases — in the US fewer than 200,000 patients (Orphan Drug Act, 1983), in the EU no more than 5 in 10,000 people (2000) — earn fee reductions and years of market exclusivity.

### Generics and biosimilars
A **generic** does not repeat the clinical trials: it shows the same active ingredient, strength and dosage form, and **bioequivalence** in a small study (the Hatch–Waxman Act of 1984 in the US; see [[bioequivalence]]). In the EU a generic may use the originator's data after 8 years and be sold after 10 (11 with an important new indication). Copies of biological medicines — **biosimilars** — need extensive analytical comparison and usually clinical data (approved in the EU since 2006 and in the US since 2015; see [[biologics]]).

### Patents and the clock
A patent lasts 20 years from filing, but it is filed early, often a decade or more before approval. A US patent term extension or an EU supplementary protection certificate gives back up to 5 years; the EU caps the total at 15 years of protection from the first authorisation, with six months more for completed paediatric studies.

> [!note] Procedures, fees and timelines change; the figures here are general and those in force at the time of writing. For any real medicine, its official product information — label, summary of product characteristics and patient leaflet — is what counts.
`,
  ideas: [
    'Regulators approve on benefit–risk, quality and labelling, after reviewing the dossier and inspecting the factories.',
    'The ICH harmonises requirements; the Common Technical Document lets one dossier serve many regulators.',
    'Accelerated and conditional routes approve on surrogate endpoints but demand confirmatory trials.',
    'Generics prove bioequivalence instead of repeating trials; biosimilars need much more comparison.',
    'Patents run 20 years from filing, so after a decade of development a medicine has roughly 8–15 years of protection left.'
  ],
  pitfalls: [
    'Approval means a medicine is safe — It means its benefits were judged to outweigh its known risks for the approved use; rare harms often appear only after millions have taken it, which is why [[pharmacovigilance]] never stops.',
    'One regulator\'s decision applies worldwide — Each regulator decides for its own jurisdiction. The ICH harmonises requirements and the dossier, not the decisions; a medicine can be approved in one region and refused or delayed in another.',
    'A patent gives 20 years on the market — The 20 years run from filing, usually long before approval; typically 8–15 years remain, including any extension.'
  ],
  formulas: [
    {
      name: 'Protection left after approval',
      expr: 'L = Tp - t + s', tex: 'L = T_p - t + s',
      vars: {
        L: { name: 'patent protection left after approval', q: 'time', unit: 'yr' },
        Tp: { name: 'patent term from filing', q: 'time', unit: 'yr', value: 20, fixed: true, tex: 'T_p' },
        t: { name: 'time from patent filing to approval', q: 'time', unit: 'yr', value: 12 },
        s: { name: 'extension (US patent term extension or EU SPC)', q: 'time', unit: 'yr', value: 5 }
      },
      note: 'The extension is at most 5 years. In the EU the total protection after the first authorisation may not exceed 15 years (so the SPC is t − 5 when t < 10); in the US, 14 years. A simplified illustration: real patent terms depend on many details.',
      stories: {
        L: 'A hypothetical medicine is approved {t} after its patent was filed and earns an extension of {s}. How long is it protected after approval?',
        t: 'A company wants {L} of protection after approval and expects an extension of {s}. How long can development take from patent filing?'
      }
    },
    {
      name: 'Patients at a given prevalence',
      expr: 'N = f*Pop', tex: 'N = f\\,N_{\\mathrm{pop}}',
      vars: {
        N: { name: 'people with the condition' },
        f: { name: 'prevalence', q: 'ratio', unit: '%', value: 0.05 },
        Pop: { name: 'population', value: 4.5e8, tex: 'N_{\\mathrm{pop}}' }
      },
      note: 'The EU orphan threshold is 5 in 10,000 people (0.05 %); the US threshold is fewer than 200,000 patients.',
      stories: {
        N: 'A condition affects {f} of a population of {Pop}. How many people is that?',
        f: '{N} people in a population of {Pop} have a rare condition. What is its prevalence?'
      }
    }
  ],
  examples: [
    {
      title: 'Is it an orphan condition?',
      q: 'A disease affects about 1 person in 4,000. Would a medicine for it qualify for orphan designation in the EU (population about 450 million) and in the US (about 335 million)?',
      steps: [
        'Prevalence: 1/4,000 = 2.5 in 10,000 — below the EU threshold of 5 in 10,000.',
        'EU patients: $450\\times10^6/4000 = 112\\,500$.',
        'US patients: $335\\times10^6/4000 \\approx 84\\,000$ — below 200,000.',
        'It qualifies in both, provided the other criteria (a serious condition, no satisfactory treatment or a significant benefit) are met.'
      ],
      a: 'Yes in both: about 112,000 patients in the EU and 84,000 in the US.'
    },
    {
      title: 'The patent clock',
      q: 'A hypothetical medicine\'s key patent was filed in 2014; it is approved in the EU in 2026. How long is it protected after approval with an SPC, and what if approval had come in 2022?',
      steps: [
        'Filed to approval: 12 years, leaving $20 - 12 = 8$ years of patent.',
        'SPC: $12 - 5 = 7$ years, capped at 5, so protection after approval is $8 + 5 = 13$ years (within the 15-year cap).',
        'Approved in 2022 ($t = 8$): the patent has 12 years left; the SPC is $8 - 5 = 3$ years; total $12 + 3 = 15$ years — exactly the cap.'
      ],
      a: '13 years after a 2026 approval; 15 years after a 2022 approval.'
    }
  ],
  quiz: [
    { q: 'Who legally grants a centralised marketing authorisation in the European Union?', choices: ['the EMA', 'the European Commission, on the EMA\'s opinion', 'each national agency separately', 'the ICH'], a: 1, why: 'The EMA\'s CHMP assesses and gives an opinion; the European Commission issues the legally binding decision, valid in all EU and EEA states.' },
    { q: 'A generic medicine must repeat the originator\'s phase III trials.', a: false, why: 'A generic relies on the originator\'s data once protection has expired and shows bioequivalence in a small study.' },
    { q: 'In the Common Technical Document, which module holds the quality (CMC) data?', choices: ['module 1', 'module 2', 'module 3', 'module 5'], a: 2, why: 'Module 3 is quality; 4 non-clinical; 5 clinical; 2 the summaries; 1 regional information.' },
    { q: 'The EU orphan threshold is 5 in 10,000 people. For a population of 450 million, what is the largest number of patients that still qualifies?', answer: 225000, why: '450,000,000 × 0.0005 = 225,000.' },
    { q: 'What is the main condition attached to an accelerated or conditional approval based on a surrogate endpoint?', choices: ['a lower price', 'confirmatory studies showing real clinical benefit', 'use in hospitals only', 'a second regulator\'s approval'], a: 1, why: 'A surrogate such as tumour shrinkage must be confirmed by outcomes that matter to patients; if it is not, the approval can be withdrawn.' }
  ],
  applications: [
    'Preparing one dossier in the Common Technical Document format for several regions.',
    'Choosing a route — standard, priority, conditional or orphan — for a new medicine.',
    'Timing generic and biosimilar launches around patents, exclusivity and data protection.',
    'WHO prequalification of medicines and vaccines bought for low-income countries.'
  ],
  history: 'The US Pure Food and Drugs Act of 1906 dealt mainly with labelling; proof of safety came in 1938 and of efficacy in 1962. In Europe the first Community directive on medicines (65/65/EEC, 1965) followed thalidomide, the UK Medicines Act came in 1968, and the European Medicines Agency opened in London in 1995 (moving to Amsterdam in 2019). The ICH was founded in 1990 by the regulators and industry of the United States, Europe and Japan and has since grown into a worldwide body.'
},

{
  id: 'pharmacopoeias', parent: 'what-medicines-are', title: 'Pharmacopoeias and standards', level: 2,
  short: 'A pharmacopoeia is the legally recognised book of quality standards: monographs that say what a substance or product must contain and how to test it, general chapters for methods such as dissolution and content uniformity, and reference standards to measure against.',
  keywords: ['pharmacopoeia', 'pharmacopeia', 'USP–NF', 'European Pharmacopoeia', 'Ph. Eur.', 'British Pharmacopoeia', 'Japanese Pharmacopoeia', 'International Pharmacopoeia', 'monograph', 'general chapter', 'reference standard', 'uniformity of dosage units', 'content uniformity', 'acceptance value', 'impurity thresholds', 'ICH Q3A', 'harmonisation', 'Pharmacopoeial Discussion Group'],
  prereq: ['what-is-a-drug', 'regulation-approval', 'math:standard-deviation'],
  related: ['quality-control', 'analytical-methods', 'tablet-testing', 'dissolution-testing', 'gmp', 'falsified-medicines'],
  body: `
If a label says "500 mg", how does anyone know? A **pharmacopoeia** answers. It is the official book of standards for medicines, binding in the countries that adopt it: it says what a substance or product must contain, which impurities are allowed and exactly how each test is done. A regulator that approves a product expects it to meet the pharmacopoeia — or a tighter specification of its own.

### What is inside
- **Monographs** for substances (an API, an excipient) and for products ("… tablets"): identification tests, an assay (for a substance often 98.0–102.0 % on the dried basis; for tablets commonly 95.0–105.0 % or 90.0–110.0 % of the label), limits for related substances, water, residual solvents and elemental impurities, and dissolution.
- **General chapters** for methods used across many products: dissolution (USP <711>, Ph. Eur. 2.9.3), uniformity of dosage units (USP <905>, Ph. Eur. 2.9.40), sterility (USP <71>, Ph. Eur. 2.6.1), bacterial endotoxins (USP <85>), chromatography (USP <621>). In the USP, chapters numbered below 1000 are enforceable and those above 1000 are guidance.
- **Reference standards**: highly characterised samples, supplied by the pharmacopoeias, against which assays are calibrated (see [[analytical-methods]]).

### The main pharmacopoeias
| Pharmacopoeia | First edition | Notes |
|---|---|---|
| United States Pharmacopeia – National Formulary (USP–NF) | 1820 | written by a non-profit convention; recognised in US law |
| British Pharmacopoeia (BP) | 1864 | includes the European monographs |
| Japanese Pharmacopoeia (JP) | 1886 | |
| International Pharmacopoeia (WHO) | 1951 | for countries without their own |
| European Pharmacopoeia (Ph. Eur.) | 1969 | Council of Europe convention of 1964; binding in nearly 40 European states |

Differences between them once meant separate testing for every market. Since 1989 the **Pharmacopoeial Discussion Group** (Europe, Japan and the United States, with the WHO as observer and India joining in 2023) has harmonised key chapters and excipient monographs, and ICH Q4B lets regulators accept harmonised texts as interchangeable.

### Uniformity of dosage units
This harmonised test checks that every tablet or capsule carries its share of drug. Ten units are assayed one by one, as % of the label claim, and their mean $\\bar{x}$ and standard deviation $s$ give the **acceptance value**:

$$\\mathrm{AV} = \\left|M - \\bar{x}\\right| + k\\,s$$

with $k = 2.4$ for 10 units. For a product whose target content is 100 %, the reference value $M$ is $\\bar{x}$ itself if the mean lies between 98.5 % and 101.5 %, and otherwise the nearer of those two limits. The batch passes if AV ≤ 15.0. If not, 20 more units are tested; with all 30 ($k = 2.0$) it passes if AV ≤ 15.0 and no unit lies more than 25 % from $M$. Both the offset of the mean and the spread count: a batch with a perfect mean fails if $s$ exceeds 6.25 %.

### Impurities
ICH Q3A(R2) (2006) sets thresholds for impurities in a new drug substance. For a maximum daily dose up to 2 g, an impurity must be reported above 0.05 %, identified above 0.10 % or 1.0 mg per day (whichever is lower), and qualified — shown to be safe — above 0.15 % or 1.0 mg per day. The daily intake of an impurity is simply the dose times its fraction, so for high-dose drugs the 1 mg limit takes over.

> [!key] A pharmacopoeia is the public minimum. Passing its tests on a sample shows that a batch *can* be good; making every unit good is the job of [[gmp]] and [[qbd]].
`,
  ideas: [
    'A pharmacopoeia sets legally binding standards: monographs, general methods and reference standards.',
    'USP–NF, Ph. Eur., BP and JP are the major pharmacopoeias; many key chapters are now harmonised.',
    'Uniformity of dosage units uses the acceptance value AV = |M − x̄| + k·s, which punishes both an off-target mean and spread.',
    'ICH Q3A thresholds decide when an impurity must be reported, identified and qualified.'
  ],
  pitfalls: [
    'A batch that passes the pharmacopoeial tests has been proven good in every unit — The tests examine small samples and are designed to catch gross failures; consistency comes from validated processes run under GMP.',
    'Only the mean content matters — The acceptance value adds k times the standard deviation: a batch centred on 100 % still fails if its units vary too much.',
    'Every pharmacopoeia has entirely different tests — Many key tests (dissolution, uniformity, sterility, microbial limits) are harmonised, so one set of results can serve several markets.'
  ],
  formulas: [
    {
      name: 'Acceptance value for uniformity of dosage units',
      expr: 'AV = abs(M - xbar) + k*s', tex: '\\mathrm{AV} = \\left|M - \\bar{x}\\right| + k\\,s',
      vars: {
        AV: { name: 'acceptance value', q: false, unit: '%', tex: '\\mathrm{AV}' },
        M: { name: 'reference value (x̄ held within 98.5–101.5 %)', q: false, unit: '%', value: 98.5 },
        xbar: { name: 'mean content of the units (% of label)', q: false, unit: '%', value: 97.0, tex: '\\bar{x}' },
        k: { name: 'acceptability constant (2.4 for 10 units, 2.0 for 30)', value: 2.4, fixed: true },
        s: { name: 'standard deviation of the unit contents', q: false, unit: '%', value: 2.5 }
      },
      note: 'Harmonised test (USP <905>, Ph. Eur. 2.9.40, JP 6.02) for a target content of 100 %: M = x̄ if 98.5 ≤ x̄ ≤ 101.5, otherwise the nearer limit. Pass at the first stage if AV ≤ 15.0.',
      practice: { unknowns: ['AV', 's'] },
      stories: {
        AV: 'Ten tablets average {xbar} of the label with a standard deviation of {s}; the reference value is {M}. What is the acceptance value?',
        s: 'Ten tablets average {xbar} of the label (so M = {M}). What standard deviation would give an acceptance value of {AV}?'
      }
    },
    {
      name: 'Daily intake of an impurity',
      expr: 'mi = D*x/100', tex: 'm_{\\mathrm{imp}} = \\dfrac{D\\,x}{100}',
      vars: {
        mi: { name: 'daily intake of the impurity', q: false, unit: 'mg/day', tex: 'm_{\\mathrm{imp}}' },
        D: { name: 'maximum daily dose of the drug', q: false, unit: 'mg/day', value: 1500 },
        x: { name: 'impurity level', q: false, unit: '%', value: 0.1 }
      },
      note: 'Used to compare the percentage thresholds of ICH Q3A(R2) with the 1.0 mg per day limits.',
      stories: {
        mi: 'A drug is taken at up to {D}. How much of an impurity present at {x} is taken each day?',
        x: 'A drug is taken at up to {D}. At what level does an impurity reach an intake of {mi}?'
      }
    }
  ],
  examples: [
    {
      title: 'The acceptance value of ten tablets',
      q: 'Ten tablets of a hypothetical product assay at 96.1, 99.4, 101.2, 97.8, 98.9, 95.5, 100.3, 98.1, 97.2 and 99.5 % of the label. Does the batch pass the first stage?',
      steps: [
        'Mean: $984.0/10 = 98.40$ %.',
        'Standard deviation: the squared deviations sum to 29.50, so $s = \\sqrt{29.50/9} = 1.81$ %.',
        'The mean is below 98.5 %, so $M = 98.5$ %.',
        '$\\mathrm{AV} = |98.5 - 98.40| + 2.4 \\times 1.81 = 0.10 + 4.35 = 4.45$.'
      ],
      a: 'AV = 4.4, well below 15.0: the batch passes.'
    },
    {
      title: 'When does 1 mg a day take over?',
      q: 'A hypothetical drug is taken at up to 1.5 g a day. Above what level must an impurity be identified under ICH Q3A(R2)?',
      steps: [
        'The threshold is 0.10 % or an intake of 1.0 mg per day, whichever is lower.',
        'At 0.10 %: $1500 \\times 0.10/100 = 1.5$ mg per day — above 1.0 mg.',
        'So the 1.0 mg limit governs: $x = 1.0/1500 \\times 100 = 0.067$ %.'
      ],
      a: 'Any impurity above about 0.067 % must be identified (and, by the same rule, qualified).'
    }
  ],
  quiz: [
    { q: 'Ten tablets have a mean content of 100.0 % and a standard deviation of 3.0 %. What is the acceptance value?', answer: 7.2, why: 'The mean lies in 98.5–101.5 %, so M = x̄ and AV = 2.4 × 3.0 = 7.2.' },
    { q: 'A batch whose ten tablets average exactly 100 % of the label can still fail the uniformity test.', a: true, why: 'AV = 2.4·s exceeds 15 when s > 6.25 %: the spread alone can fail it.' },
    { q: 'Ten tablets average 96.0 % with s = 2.0 %. What is the first-stage acceptance value?', answer: 7.3, why: 'M = 98.5 (the mean is below 98.5), so AV = 2.5 + 2.4 × 2.0 = 7.3.' },
    { q: 'What is a pharmacopoeial reference standard used for?', choices: ['as a placebo in clinical trials', 'to calibrate assays and identity tests against a material of known quality', 'to set the price of a medicine', 'as the stability sample of a batch'], a: 1, why: 'Assays compare the sample\'s response with that of the reference standard, whose content is established.' },
    { q: 'Which of these pharmacopoeias was published first?', choices: ['European Pharmacopoeia', 'Japanese Pharmacopoeia', 'British Pharmacopoeia', 'United States Pharmacopeia'], a: 3, why: 'USP 1820, BP 1864, JP 1886, Ph. Eur. 1969.' }
  ],
  problems: [
    { q: 'A hypothetical drug has a maximum daily dose of 800 mg. Above what level (%) must an impurity be identified under ICH Q3A(R2)?', answer: 0.1, unit: '%', tol: 0.02, steps: ['An intake of 1.0 mg per day corresponds to $1.0/800 \\times 100 = 0.125$ %.', 'The threshold is the lower of 0.10 % and 0.125 %: 0.10 %.'] }
  ],
  applications: [
    'Writing a new product\'s specification: pharmacopoeial tests plus product-specific limits.',
    'Release testing of every batch (see [[quality-control]]).',
    'Market surveillance: testing medicines bought from pharmacies against their monographs (see [[falsified-medicines]]).',
    'Buying APIs and excipients certified against the European Pharmacopoeia.'
  ],
  history: 'Early pharmacopoeias were city books of recipes, such as the Nuremberg *Dispensatorium* of 1546 and the London Pharmacopoeia of 1618. National books followed in the 19th century: the USP was founded by eleven physicians meeting in Washington in 1820, and the British Pharmacopoeia of 1864 replaced the London, Edinburgh and Dublin books. Harmonisation has been the theme ever since the European Pharmacopoeia convention of 1964 and the Pharmacopoeial Discussion Group of 1989.',
  sim: 'found-uniformity'
},

{
  id: 'gmp', parent: 'what-medicines-are', title: 'Good manufacturing practice', level: 2,
  short: 'Good manufacturing practice is the system of rules and habits that makes every batch of a medicine the same and traceable: a quality system, trained people, suitable premises, validated processes and cleaning, written procedures and records, controlled changes and investigated deviations.',
  keywords: ['GMP', 'cGMP', 'good manufacturing practice', '21 CFR 211', 'EudraLex Volume 4', 'PIC/S', 'pharmaceutical quality system', 'ICH Q10', 'Qualified Person', 'validation', 'qualification', 'IQ OQ PQ', 'process validation', 'cleaning validation', 'MACO', 'PDE', 'data integrity', 'ALCOA', 'deviation', 'CAPA', 'change control', 'batch record'],
  prereq: ['what-is-a-drug', 'pharmacopoeias', 'drug-development'],
  related: ['qbd', 'quality-control', 'aseptic-processing', 'sterilisation-methods', 'falsified-medicines', 'regulation-approval'],
  body: `
Testing a finished batch can never prove that every unit is right: twenty tablets tested say little about the millionth. So medicines are made under **good manufacturing practice** (GMP), a system in which every material, person, room, machine, step and record is controlled, so that the product is right by design and the evidence is written down.

### What GMP asks
| Area | What is required |
|---|---|
| Quality system | a pharmaceutical quality system led by senior management (ICH Q10, 2008), with a quality unit independent of production |
| People | trained staff with defined duties and hygiene rules; in the EU a **Qualified Person** certifies every batch before release |
| Premises and equipment | designed against mix-ups and cross-contamination; qualified (design, installation, operation, performance) and calibrated |
| Documentation | approved procedures; master and executed batch records; data that are **ALCOA+** — attributable, legible, contemporaneous, original and accurate, plus complete, consistent, enduring and available |
| Production | validated processes, in-process controls, line clearance between products, reconciliation of materials and labels |
| Quality control | tested materials and products, stability programmes and retained samples (see [[quality-control]]) |
| When things go wrong | deviations investigated, corrective and preventive actions (CAPA), change control, complaints, recalls and self-inspection |

"If it is not written down, it did not happen" is the GMP proverb. The records let an inspector reconstruct, years later, who made a batch, from which lots of which materials, on which machine and at which settings.

### The rules and the inspectors
In the United States current GMP (cGMP) is law in 21 CFR Parts 210 and 211; in the EU it is EudraLex Volume 4, with annexes such as Annex 1 for sterile products (revised in 2022) and Annex 15 for qualification and validation. The Pharmaceutical Inspection Co-operation Scheme (PIC/S) and the WHO publish closely matching guides. Inspectors visit before approval and routinely afterwards; serious failures bring warning letters, import bans, suspended licences and recalls.

### Validation
A process is **validated** by showing, with data, that it consistently makes product meeting its specification. The FDA's 2011 guidance treats this as a lifecycle: process design, process performance qualification on commercial-scale batches, and then **continued process verification** for as long as the product is made — often with control charts like the one in the simulation.

### Cleaning and cross-contamination
When equipment is shared, a trace of the previous product must not harm the patients who take the next. Limits are set from a **permitted daily exposure** (PDE), a health-based limit derived from toxicology (EMA guideline, 2014). The **maximum allowable carryover** is the PDE times the number of maximum daily doses in the next batch:

$$\\mathrm{MACO} = \\frac{\\mathrm{PDE} \\times \\mathrm{MBS}}{\\mathrm{MDD}}$$

where MBS is the next product's minimum batch size and MDD its maximum daily dose. Spread over the shared surface it gives the limit for each swab sample. Some highly potent or sensitising substances, such as penicillins, need dedicated facilities.

> [!warn] GMP rules are written from harm. Diethylene glycol substituted for glycerol or propylene glycol in syrups has killed children in several countries, including in 2022–2023; contaminated heparin in 2008 and contaminated steroid injections from a compounding pharmacy in 2012 caused dozens of deaths each. A medicine that looks, smells or tastes unusual should be shown to a pharmacist; if someone is seriously unwell after taking a medicine, call your local emergency number or poison centre.
`,
  ideas: [
    'Quality cannot be tested into a batch; GMP builds it in by controlling materials, people, premises, processes and records.',
    'Documentation must be ALCOA+, so that every batch can be reconstructed.',
    'Processes are validated over their whole lifecycle, ending in continued process verification.',
    'Cleaning limits come from health-based exposure limits: MACO = PDE × MBS / MDD.',
    'In the EU a Qualified Person certifies each batch before release.'
  ],
  pitfalls: [
    'GMP is mostly about testing the finished product — Testing is one part; GMP controls everything before it, so that the product is right before it is tested.',
    'Equipment that looks clean is clean enough — Visual cleanliness is necessary but not sufficient; residues must be below validated, health-based limits measured by validated methods.',
    'A validated process stays validated for ever — Materials, equipment and people change; continued verification and change control keep the process in a state of control.'
  ],
  formulas: [
    {
      name: 'Maximum allowable carryover (health-based)',
      expr: 'MACO = PDE*MBS/MDD', tex: '\\mathrm{MACO} = \\dfrac{\\mathrm{PDE}\\times\\mathrm{MBS}}{\\mathrm{MDD}}',
      vars: {
        MACO: { name: 'maximum allowable carryover into the next batch', q: 'mass', unit: 'g', tex: '\\mathrm{MACO}' },
        PDE: { name: 'permitted daily exposure to the previous API (per day)', q: 'mass', unit: 'µg', value: 10, tex: '\\mathrm{PDE}' },
        MBS: { name: 'minimum batch size of the next product', q: 'mass', unit: 'kg', value: 100, tex: '\\mathrm{MBS}' },
        MDD: { name: 'maximum daily dose of the next product (per day)', q: 'mass', unit: 'mg', value: 500, tex: '\\mathrm{MDD}' }
      },
      note: 'PDE and MDD are both amounts per day, so the days cancel: MBS/MDD is the number of maximum daily doses in the next batch. Illustrative — real limits follow validated procedures and the regulators\' guidelines.',
      stories: {
        MACO: 'The previous product\'s API has a PDE of {PDE} per day. The next product is made in batches of at least {MBS} and taken at up to {MDD} a day. What is the maximum allowable carryover?',
        PDE: 'A carryover of {MACO} is found possible into batches of {MBS} of a product taken at up to {MDD} a day. What PDE would make that acceptable?'
      }
    },
    {
      name: 'Limit for one swab sample',
      expr: 'Lsw = MACO*Asw/Ash', tex: 'L_{\\mathrm{swab}} = \\mathrm{MACO}\\,\\dfrac{A_{\\mathrm{swab}}}{A_{\\mathrm{shared}}}',
      vars: {
        Lsw: { name: 'limit per swab', q: 'mass', unit: 'µg', tex: 'L_{\\mathrm{swab}}' },
        MACO: { name: 'maximum allowable carryover', q: 'mass', unit: 'g', value: 2, tex: '\\mathrm{MACO}' },
        Asw: { name: 'area swabbed', q: 'area', unit: 'cm²', value: 25, tex: 'A_{\\mathrm{swab}}' },
        Ash: { name: 'total shared product-contact surface', q: 'area', unit: 'm²', value: 15, tex: 'A_{\\mathrm{shared}}' }
      },
      note: 'Assumes the residue is spread evenly; worst-case locations are the ones swabbed.',
      stories: { Lsw: 'A MACO of {MACO} is spread over {Ash} of shared equipment. What is the limit for a {Asw} swab?' }
    }
  ],
  examples: [
    {
      title: 'A cleaning limit',
      q: 'A hypothetical potent API with a PDE of 10 µg per day was made on a line that next makes a product in 100 kg batches, taken at up to 500 mg a day. The shared surface is 15 m² and swabs cover 25 cm². What are the MACO and the swab limit?',
      steps: [
        'Daily doses in the next batch: $100\\,000\\,000$ mg $/ 500$ mg $= 200\\,000$.',
        '$\\mathrm{MACO} = 10$ µg $\\times 200\\,000 = 2\\,000\\,000$ µg $= 2.0$ g.',
        'Per square centimetre: $2.0$ g $/ 150\\,000$ cm² $= 13.3$ µg/cm².',
        'Per 25 cm² swab: $13.3 \\times 25 = 333$ µg (before any allowance for swab recovery).'
      ],
      a: 'MACO = 2.0 g; about 330 µg per swab.'
    },
    {
      title: 'Label reconciliation',
      q: '10,000 printed labels were issued for a packaging run. 9,850 were used on packs, 30 were destroyed as damaged and 118 were returned. Can the batch be released?',
      steps: [
        'Accounted for: $9850 + 30 + 118 = 9998$.',
        'Two labels are missing. A stray label could end up on a pack of another product — a mix-up that no test on this batch would detect.',
        'The discrepancy is a deviation: it must be investigated and resolved before release.'
      ],
      a: 'Not until the two missing labels are explained.'
    }
  ],
  quiz: [
    { q: 'What does the C in ALCOA stand for?', choices: ['complete', 'contemporaneous', 'consistent', 'controlled'], a: 1, why: 'Contemporaneous: recorded at the time the work is done. Complete and consistent belong to the "+".' },
    { q: 'A PDE of 20 µg per day, a next batch of 50 kg and a maximum daily dose of 250 mg. What is the MACO?', answer: 4, unit: 'g', why: '50 kg/250 mg = 200,000 daily doses; × 20 µg = 4,000,000 µg = 4 g.' },
    { q: 'In the EU, who certifies that each batch may be released for sale?', choices: ['the production manager', 'a Qualified Person', 'the regulator\'s inspector', 'the head of sales'], a: 1, why: 'EU law requires a Qualified Person, independent of commercial pressure, to certify each batch.' },
    { q: 'Once a process has been validated on three batches it need not be looked at again unless it is changed.', a: false, why: 'Drift happens without deliberate change; continued process verification watches every batch for as long as the product is made.' },
    { q: 'Why cannot quality simply be tested into a batch?', choices: ['tests are too expensive', 'tests examine small samples and many are destructive, so they cannot show that every unit is right', 'regulators forbid testing', 'tests are never accurate'], a: 1, why: 'A sample of tens of units cannot rule out rare defects among a million; only a controlled, validated process can.' }
  ],
  applications: [
    'Batch records and electronic manufacturing systems that meet data-integrity rules.',
    'Cleaning validation for multi-product plants using health-based limits.',
    'Qualified Person certification of batches made in or imported into the EU.',
    'Regulatory inspections and the corrective actions that follow them.'
  ],
  history: 'The first US cGMP regulations were issued in 1963, after the 1962 amendments required drugs to be made under current good manufacturing practice; they were thoroughly revised in 1978. The WHO published its first GMP text in 1968, and the Pharmaceutical Inspection Convention was set up in 1970 so that inspectors could rely on each other\'s reports. Since the 2000s the emphasis has moved from following rules to understanding processes — see [[qbd]].',
  sim: 'found-control-chart'
},

/* ================================================================ QUALITY */
{
  id: 'qbd', parent: 'quality-topic', title: 'Quality by design', level: 3,
  short: 'Quality by design builds quality into a medicine instead of testing it in: define the target product profile, find the critical quality attributes, link them to material attributes and process parameters by risk assessment and designed experiments, and run the process inside a proven design space.',
  keywords: ['quality by design', 'QbD', 'ICH Q8', 'ICH Q9', 'ICH Q10', 'QTPP', 'critical quality attribute', 'CQA', 'critical process parameter', 'CPP', 'design space', 'design of experiments', 'DoE', 'factorial design', 'response surface', 'risk assessment', 'FMEA', 'risk priority number', 'process analytical technology', 'PAT', 'control strategy', 'real-time release'],
  prereq: ['gmp', 'pharmacopoeias', 'math:linear-regression'],
  related: ['quality-control', 'analytical-methods', 'granulation', 'compaction', 'dissolution-testing', 'drug-development'],
  body: `
For decades a medicine's quality was *tested in*: a process was fixed, batches were made, and those that failed were rejected or reworked. **Quality by design** (QbD) turns this round. The developer must understand which properties of the materials and which settings of the process decide the product's quality, prove it with data and control them — so that failures are prevented rather than found.

The idea comes from industrial quality engineering (Joseph Juran's "quality can be planned"). For medicines it was set out in the FDA's initiative *Pharmaceutical cGMPs for the 21st century* (2002–2004) and in ICH guidelines: Q8(R2) on pharmaceutical development (2009), Q9 on quality risk management (2005, revised 2023), Q10 on the quality system (2008), Q11 for drug substances (2012) and Q14 for analytical procedures (2023).

### The sequence
1. **Quality target product profile** (QTPP): what the product must be — say, an immediate-release 50 mg tablet, at least 80 % dissolved in 30 minutes, stable for 24 months at 25 °C.
2. **Critical quality attributes** (CQAs): measurable properties that must stay within limits to meet the QTPP — assay, content uniformity, dissolution, degradation products, water content.
3. **Risk assessment**: which **material attributes** (particle size, moisture) and **process parameters** (granulation water, mixing time, compression force) could affect each CQA? Tools range from fishbone diagrams to failure mode and effects analysis (FMEA), whose risk priority number is $\\mathrm{RPN} = S \\times O \\times D$ — severity, occurrence and detectability, each scored from 1 to 10.
4. **Design of experiments** (DoE): vary the risky factors together in a planned pattern, not one at a time, and fit a model for each CQA. A two-level full factorial design in $k$ factors needs $2^k$ runs; centre points reveal curvature; three-level response-surface designs fit quadratic models.
5. **Design space**: the combination of inputs shown to give acceptable quality. Moving within it is not a change that needs regulatory approval.
6. **Control strategy**: material specifications, set points and ranges, in-process controls and **process analytical technology** (PAT — for example near-infrared probes that follow blend uniformity in real time), and at its most advanced **real-time release testing** in place of end-product tests.
7. **Lifecycle**: monitor the process (see [[quality-control]]), learn and improve.

### A model from four experiments
Take granulation water ($x_1$) and compression force ($x_2$), coded from −1 (low) to +1 (high). Four runs give dissolution at 30 minutes of 90 % $(-,-)$, 78 % $(+,-)$, 84 % $(-,+)$ and 68 % $(+,+)$. The fitted model is

$$y = 80 - 7x_1 - 4x_2 - x_1 x_2$$

— more water makes denser granules that dissolve more slowly, and more force a harder, less porous tablet. A second CQA, tablet hardness, *rises* with force, so the two pull against each other. The design space is where both are acceptable; in the simulation it is a wedge, wide at low water and closing as the water rises. A process run at its centre, with its normal variation well inside the edges, is robust.

> [!key] QbD replaces "did this batch pass?" with "do we understand why every batch will pass?". The rewards are fewer failures, flexible manufacturing within the design space and faster improvement.

> [!note] The models here are illustrations. Real design spaces are built from many experiments, confirmed at commercial scale and approved by the regulator.
`,
  ideas: [
    'QbD starts from the target product profile and works back to the material attributes and process parameters that matter.',
    'Risk assessment decides which factors to study; FMEA ranks failure modes by RPN = S × O × D.',
    'Designed experiments vary factors together, revealing interactions with few runs.',
    'The design space is the proven region of inputs; moving within it needs no new approval.',
    'The control strategy, often with process analytical technology, keeps the process inside the design space.'
  ],
  pitfalls: [
    'QbD means testing more — It means understanding more; a good control strategy can replace some end-product testing with in-process measurement and real-time release.',
    'The highest RPN is always the top priority — RPN multiplies ordinal scores: very different risks can share one RPN, and a failure of severity 10 deserves attention even when its RPN is modest.',
    'One-factor-at-a-time experiments find the best settings — They miss interactions: the best granulation water may depend on the compression force, which only a design that varies both together can show.'
  ],
  formulas: [
    {
      name: 'FMEA risk priority number',
      expr: 'RPN = S*O*D', tex: '\\mathrm{RPN} = S \\times O \\times D',
      vars: {
        RPN: { name: 'risk priority number (1–1000)', tex: '\\mathrm{RPN}' },
        S: { name: 'severity score (1–10)', value: 8, int: true },
        O: { name: 'occurrence score (1–10)', value: 4, int: true },
        D: { name: 'detectability score (1–10; 10 = hardest to detect)', value: 5, int: true }
      },
      stories: {
        RPN: 'A failure mode scores {S} for severity, {O} for occurrence and {D} for detectability. What is its RPN?',
        D: 'A failure mode with severity {S} and occurrence {O} must be brought below an RPN of {RPN}. What detectability score is needed?'
      }
    },
    {
      name: 'Runs in a full factorial design',
      expr: 'N = L^k + nc', tex: 'N = L^{k} + n_c',
      vars: {
        N: { name: 'number of experimental runs' },
        L: { name: 'levels per factor', value: 2, int: true },
        k: { name: 'number of factors', value: 3, int: true },
        nc: { name: 'centre points', value: 3, int: true, tex: 'n_c' }
      },
      stories: {
        N: 'A full factorial design has {k} factors at {L} levels each, plus {nc} centre points. How many runs does it need?',
        k: 'A laboratory can afford {N} runs, {nc} of them centre points, with factors at {L} levels. How many factors can a full factorial design include?'
      }
    },
    {
      name: 'A two-factor model with interaction',
      expr: 'y = b0 + b1*x1 + b2*x2 + b12*x1*x2', tex: 'y = b_0 + b_1 x_1 + b_2 x_2 + b_{12}\\,x_1 x_2',
      vars: {
        y: { name: 'predicted response (% dissolved at 30 min)' },
        b0: { name: 'mean response (centre)', value: 80, tex: 'b_0' },
        b1: { name: 'coefficient of factor 1 (half its effect)', value: -7, signed: true, tex: 'b_1' },
        b2: { name: 'coefficient of factor 2', value: -4, signed: true, tex: 'b_2' },
        b12: { name: 'interaction coefficient', value: -1, signed: true, tex: 'b_{12}' },
        x1: { name: 'coded factor 1: granulation water (−1 to +1)', value: 0.5, signed: true, min: -1.5, max: 1.5, tex: 'x_1' },
        x2: { name: 'coded factor 2: compression force (−1 to +1)', value: -0.5, signed: true, min: -1.5, max: 1.5, tex: 'x_2' }
      },
      note: 'Coded units: −1 and +1 are the low and high levels of the experiment. Predictions outside about ±1 are extrapolations.',
      practice: { unknowns: ['y', 'x1', 'x2'] },
      stories: {
        y: 'The model has b₀ = {b0}, b₁ = {b1}, b₂ = {b2} and b₁₂ = {b12}. What dissolution does it predict at x₁ = {x1}, x₂ = {x2}?',
        x1: 'With b₀ = {b0}, b₁ = {b1}, b₂ = {b2}, b₁₂ = {b12} and x₂ = {x2}, what coded water level x₁ gives {y} dissolved?'
      }
    }
  ],
  examples: [
    {
      title: 'Ranking risks with FMEA',
      q: 'Three failure modes of a tablet process are scored: blend segregation (S 8, O 4, D 5), drift in tablet weight (S 6, O 5, D 2) and a wrong granulation end point (S 7, O 3, D 6). Rank them.',
      steps: [
        'Segregation: $8 \\times 4 \\times 5 = 160$.',
        'Weight drift: $6 \\times 5 \\times 2 = 60$ — likely, but caught at once by in-process weighing.',
        'Granulation end point: $7 \\times 3 \\times 6 = 126$ — hard to detect without a measurement such as torque or NIR.',
        'Order: segregation, granulation end point, weight drift. The fixes lower O (a better blender) or D (a PAT probe); severity rarely changes.'
      ],
      a: 'Segregation (160), then the granulation end point (126), then weight drift (60).'
    },
    {
      title: 'Effects from a 2² design',
      q: 'Dissolution at 30 minutes was 90 % at (water −, force −), 78 % at (+, −), 84 % at (−, +) and 68 % at (+, +). Estimate the effects and the model.',
      steps: [
        'Water effect: mean at high minus mean at low $= (78 + 68)/2 - (90 + 84)/2 = 73 - 87 = -14$ %.',
        'Force effect: $(84 + 68)/2 - (90 + 78)/2 = 76 - 84 = -8$ %.',
        'Interaction: $[(90 + 68) - (78 + 84)]/2 = -2$ %.',
        { text: 'Coefficients are half the effects, and $b_0$ is the grand mean (80 %):', tex: 'y = 80 - 7x_1 - 4x_2 - x_1 x_2' },
        'Check at (+, +): $80 - 7 - 4 - 1 = 68$ %. With five factors a full factorial would need 32 runs; a half fraction needs 16.'
      ],
      a: 'Water −14 %, force −8 %, interaction −2 %: y = 80 − 7x₁ − 4x₂ − x₁x₂.'
    }
  ],
  quiz: [
    { q: 'A failure mode scores severity 9, occurrence 2 and detectability 3. What is its RPN?', answer: 54, why: '9 × 2 × 3 = 54.' },
    { q: 'How many runs does a two-level full factorial design in 5 factors need, without centre points?', answer: 32, why: '2⁵ = 32.' },
    { q: 'Moving a process within its approved design space is a change that needs new regulatory approval.', a: false, why: 'That is the point of a design space: working anywhere inside it is not considered a change. Moving outside it is.' },
    { q: 'Why vary factors together in a designed experiment rather than one at a time?', choices: ['it needs fewer operators', 'it reveals interactions and gives more information from fewer runs', 'regulators forbid one-factor studies', 'it avoids the need for a model'], a: 1, why: 'Every run informs every effect, and only designs that vary factors together can estimate interactions.' },
    { q: 'In the model y = 80 − 7x₁ − 4x₂ − x₁x₂, what dissolution is predicted at low water (x₁ = −1) and middle force (x₂ = 0)?', answer: 87, why: '80 + 7 − 0 − 0 = 87 %.' }
  ],
  applications: [
    'Developing a tablet with a design space for granulation and compression.',
    'In-line near-infrared monitoring of blending and drying (process analytical technology).',
    'Continuous manufacturing lines controlled in real time.',
    'Robust analytical methods developed by the same approach (ICH Q14).'
  ],
  history: 'Ronald Fisher invented factorial designs for field trials at Rothamsted in the 1920s; Joseph Juran and Genichi Taguchi made planned quality and designed experiments central to manufacturing after the Second World War. The pharmaceutical industry adopted the ideas late: the FDA launched its 21st-century cGMP initiative in 2002 and its PAT guidance in 2004, and ICH Q8 followed in 2005.',
  sim: 'found-design-space'
},

{
  id: 'analytical-methods', parent: 'quality-topic', title: 'Analytical methods: HPLC and validation', level: 2,
  short: 'How a laboratory measures what is in a medicine: most assays and impurity tests use HPLC, which separates the mixture on a column and measures each peak against a calibration line; validation (ICH Q2) shows the method is specific, linear, accurate, precise and sensitive enough.',
  keywords: ['HPLC', 'high-performance liquid chromatography', 'reversed phase', 'chromatogram', 'retention time', 'peak area', 'resolution', 'plate number', 'system suitability', 'calibration line', 'least squares', 'linearity', 'accuracy', 'precision', 'specificity', 'LOD', 'LOQ', 'ICH Q2', 'stability-indicating', 'reference standard', 'UHPLC'],
  prereq: ['chemistry:chromatography', 'chemistry:beer-lambert', 'math:linear-regression'],
  related: ['quality-control', 'pharmacopoeias', 'qbd', 'stability-testing', 'degradation-pathways', 'falsified-medicines'],
  body: `
Nearly every number in a medicine's specification — the assay, the impurities, the dissolution results — comes from an analytical method, and the most used of all is **high-performance liquid chromatography** (HPLC). The sample is dissolved and injected into liquid pumped through a packed column; each substance leaves the column at its own time, and a detector — usually measuring ultraviolet absorbance — records a peak for each.

### How HPLC separates
In **reversed-phase** HPLC the column is packed with silica particles of 1.7–5 µm coated with C18 hydrocarbon chains, and the mobile phase is water or buffer mixed with acetonitrile or methanol. Greasy molecules cling to the chains and leave late; polar ones leave early. More organic solvent makes everything elute sooner — the retention factor falls about two- to threefold for every 10 % more acetonitrile — but the peaks crowd together, and since molecules respond differently, two peaks can even swap places. Smaller particles give sharper peaks at the price of pressure: 5 µm columns run at 100–200 bar, sub-2 µm columns (UHPLC) at 600–1000 bar or more.

### Reading a chromatogram
- **Retention time** $t_R$ identifies a peak, by comparison with a reference standard.
- **Peak area** measures the amount: at a fixed wavelength it is proportional to concentration ([[chemistry:beer-lambert|Beer–Lambert law]]).
- **Resolution** between neighbours, $R_s = 2(t_{R2} - t_{R1})/(w_1 + w_2)$ with $w$ the baseline widths; $R_s \\ge 1.5$ means baseline separation.
- **Plate number** $N = 16\\,(t_R/w)^2$ measures column efficiency — typically 10,000–20,000 for a 150 mm column.

Before any results count, a **system suitability** test checks resolution, peak symmetry and the repeatability of replicate injections (often a relative standard deviation of 2.0 % or less).

### From area to amount
A calibration line is built from reference-standard solutions — for an assay, typically five levels from 50 % to 150 % of the working concentration — and fitted by least squares, $A = m\\,C + b$ (see [[math:linear-regression]]). A sample's concentration is then $C = (A - b)/m$, and its weight and dilutions turn that into % of the label.

### Validation
A method must be shown fit for its purpose before its results can release a batch. ICH Q2(R2) (2023) lists what to show:

| Characteristic | Question | Typical target for an assay |
|---|---|---|
| Specificity | Does it measure only the analyte, not impurities, degradants or excipients? | peaks resolved, checked on stressed samples |
| Linearity and range | Is the response proportional to concentration? | 80–120 % of the test concentration; r ≥ 0.999 |
| Accuracy | Is it right on average? | 98–102 % recovery |
| Precision | Do repeated results agree — within a day, and across days, analysts and instruments? | RSD ≤ 1–2 % |
| Detection and quantitation limits | What is the least amount seen, and measured? | $\\mathrm{LOD} = 3.3\\sigma/S$, $\\mathrm{LOQ} = 10\\sigma/S$ |
| Robustness | Do small changes in pH, temperature or solvent matter? | results unchanged |

A method that separates the drug from all its degradation products is **stability-indicating**. It is essential in [[stability-testing]]: a method that cannot tell a drug from its breakdown products will report a degraded sample as good.

> [!tip] Other workhorses: gas chromatography for residual solvents, Karl Fischer titration for water, infrared and Raman spectroscopy for identity, ICP-MS for elemental impurities, and mass spectrometry for identifying unknown impurities.
`,
  ideas: [
    'Reversed-phase HPLC separates by polarity; more organic solvent shortens retention but crowds the peaks.',
    'Retention time identifies, peak area quantifies, and resolution of 1.5 or more means baseline separation.',
    'Concentrations come from a least-squares calibration line: C = (A − b)/m.',
    'Validation (ICH Q2) shows specificity, linearity, accuracy, precision, sensitivity and robustness.',
    'A stability-indicating method separates the drug from every degradation product.'
  ],
  pitfalls: [
    'A good correlation coefficient means a good method — r measures linearity only; a method can be perfectly linear and consistently wrong, for instance when an impurity co-elutes and adds its area to the drug\'s.',
    'Retention time proves identity — Different compounds can share a retention time; identity needs a second, independent test such as a UV or mass spectrum.',
    'More organic solvent always improves a separation because it is faster — It shortens the run, but peaks crowd together and resolution can collapse.'
  ],
  formulas: [
    {
      name: 'Concentration from a calibration line',
      expr: 'C = (A - b)/m', tex: 'C = \\dfrac{A - b}{m}',
      vars: {
        C: { name: 'concentration of the sample solution', q: false, unit: 'µg/mL' },
        A: { name: 'peak area of the sample', q: false, unit: 'mAU·s', value: 1486 },
        b: { name: 'intercept of the calibration line', q: false, unit: 'mAU·s', value: 5.8, signed: true },
        m: { name: 'slope of the calibration line', q: false, unit: 'mAU·s per µg/mL', value: 15.12 }
      },
      stories: {
        C: 'A calibration line has slope {m} and intercept {b}. A sample gives a peak area of {A}. What is its concentration?',
        A: 'What peak area should a solution of {C} give on a calibration line with slope {m} and intercept {b}?'
      }
    },
    {
      name: 'Resolution of two peaks',
      expr: 'Rs = 2*(t2 - t1)/(w1 + w2)', tex: 'R_s = \\dfrac{2\\,(t_{R2} - t_{R1})}{w_1 + w_2}',
      vars: {
        Rs: { name: 'resolution', tex: 'R_s' },
        t2: { name: 'retention time of the later peak', q: 'time', unit: 'min', value: 6.8, tex: 't_{R2}' },
        t1: { name: 'retention time of the earlier peak', q: 'time', unit: 'min', value: 6.4, tex: 't_{R1}' },
        w1: { name: 'baseline width of the earlier peak', q: 'time', unit: 'min', value: 0.24, tex: 'w_1' },
        w2: { name: 'baseline width of the later peak', q: 'time', unit: 'min', value: 0.25, tex: 'w_2' }
      },
      stories: {
        Rs: 'An impurity elutes at {t1} (width {w1}) and the drug at {t2} (width {w2}). What is the resolution?',
        t2: 'An impurity elutes at {t1}; both peaks are about {w1} wide. How late must the drug elute for a resolution of {Rs}?'
      }
    },
    {
      name: 'Plate number',
      expr: 'N = 16*(tR/w)^2', tex: 'N = 16\\left(\\dfrac{t_R}{w}\\right)^2',
      vars: {
        N: { name: 'plate number (column efficiency)' },
        tR: { name: 'retention time', q: 'time', unit: 'min', value: 6.8, tex: 't_R' },
        w: { name: 'baseline peak width', q: 'time', unit: 'min', value: 0.25 }
      },
      stories: { N: 'A peak elutes at {tR} with a baseline width of {w}. What is the plate number?', w: 'A column has {N} plates. How wide is a peak at {tR}?' }
    },
    {
      name: 'Limit of quantitation',
      expr: 'LOQ = 10*sigma/S', tex: '\\mathrm{LOQ} = \\dfrac{10\\,\\sigma}{S}',
      vars: {
        LOQ: { name: 'limit of quantitation', q: false, unit: 'µg/mL', tex: '\\mathrm{LOQ}' },
        sigma: { name: 'standard deviation of the response (blank or intercept)', q: false, unit: 'mAU·s', value: 1.5 },
        S: { name: 'slope of the calibration line', q: false, unit: 'mAU·s per µg/mL', value: 15.12 }
      },
      note: 'The limit of detection uses 3.3 instead of 10 (ICH Q2).',
      stories: { LOQ: 'The response of a blank has a standard deviation of {sigma} and the calibration slope is {S}. What is the limit of quantitation?' }
    }
  ],
  examples: [
    {
      title: 'An assay from a calibration line',
      q: 'Reference-standard solutions of 50, 75, 100, 125 and 150 µg/mL give peak areas of 762, 1139, 1520, 1893 and 2275 mAU·s. Twenty tablets of a hypothetical 50 mg product are powdered; powder equivalent to 50 mg is dissolved to 100 mL, and 10 mL of that is diluted to 50 mL. The sample gives 1486 mAU·s. What is the content, as % of label?',
      steps: [
        'Means: $\\bar{C} = 100$ µg/mL, $\\bar{A} = 1517.8$ mAU·s.',
        '$S_{CA} = \\sum (C - \\bar{C})(A - \\bar{A}) = 94\\,500$, $S_{CC} = 6250$, so $m = 94\\,500/6250 = 15.12$ mAU·s per µg/mL and $b = 1517.8 - 15.12 \\times 100 = 5.8$ mAU·s ($r > 0.9999$).',
        'Nominal sample concentration: 50 mg in 100 mL is 500 µg/mL; diluted fivefold, 100 µg/mL.',
        'Found: $C = (1486 - 5.8)/15.12 = 97.9$ µg/mL, which is 97.9 % of the label.'
      ],
      a: '97.9 % of the label — inside a typical 95.0–105.0 % release limit.'
    },
    {
      title: 'A failed system suitability test',
      q: 'On a new column an impurity elutes at 6.4 min and the drug at 6.8 min, with widths 0.24 and 0.25 min. Months later the widths have grown to 0.30 and 0.32 min. Can the method still be used?',
      steps: [
        'New column: $R_s = 2 \\times 0.4/(0.24 + 0.25) = 1.63$ — baseline separated.',
        'Aged column: $R_s = 0.8/0.62 = 1.29$ — below the required 1.5.',
        'System suitability fails, so no results may be reported from that run: part of the impurity would be counted as drug. The column is replaced and the run repeated.'
      ],
      a: 'No: the resolution has fallen from 1.63 to 1.29, below 1.5.'
    }
  ],
  quiz: [
    { q: 'A calibration line has slope 20 mAU·s per µg/mL and intercept 0. A sample peak has an area of 1900 mAU·s. What is its concentration (µg/mL)?', answer: 95, why: '1900/20 = 95 µg/mL.' },
    { q: 'A calibration line with r = 0.9999 proves that the method is accurate.', a: false, why: 'r shows linearity. Accuracy needs recovery experiments, and specificity must rule out co-eluting substances that add a constant bias.' },
    { q: 'Two neighbouring peaks have a resolution of 0.8. What does that mean?', choices: ['they are fully separated', 'they overlap substantially, so each area is uncertain', 'the column has 800 plates', 'the method is stability-indicating'], a: 1, why: 'Baseline separation needs R_s ≥ 1.5; at 0.8 the peaks merge and their areas cannot be measured reliably.' },
    { q: 'A stability-indicating method is one that…', choices: ['is itself stable for years', 'separates and measures the drug in the presence of its degradation products', 'measures the storage temperature', 'uses only UV spectroscopy'], a: 1, why: 'Only then does a falling assay truly mean loss of drug, and growing impurity peaks can be followed.' },
    { q: 'A peak at t_R = 10 min has a baseline width of 0.4 min. What is the plate number?', answer: 10000, why: 'N = 16 × (10/0.4)² = 16 × 625 = 10,000.' }
  ],
  applications: [
    'Assay and impurity testing of every batch before release.',
    'Stability studies, where the method must separate every degradation product.',
    'Measuring dissolution samples by HPLC or UV.',
    'Screening suspect medicines for missing or wrong ingredients (see [[falsified-medicines]]).'
  ],
  history: 'Mikhail Tsvet separated plant pigments on a column of chalk in 1903 and named the method chromatography, "colour writing". Archer Martin and Richard Synge developed partition chromatography in 1941 (Nobel Prize in Chemistry 1952) and predicted that small particles under pressure would give fast, sharp separations. Commercial HPLC arrived around 1970, and ultra-high-pressure systems with sub-2 µm particles in 2004.',
  sim: 'found-hplc'
},

{
  id: 'quality-control', parent: 'quality-topic', title: 'Quality control and batch release', level: 2,
  short: 'Quality control tests starting materials, in-process samples and finished batches against their specifications; quality assurance decides whether a batch may be released. Control charts and capability indices show whether the process stays on target and within its limits.',
  keywords: ['quality control', 'quality assurance', 'specification', 'release', 'certificate of analysis', 'Qualified Person', 'out of specification', 'OOS', 'in-process control', 'control chart', 'Shewhart', 'control limits', 'Western Electric rules', 'process capability', 'Cp', 'Cpk', 'trend', 'product quality review'],
  prereq: ['pharmacopoeias', 'analytical-methods', 'math:normal-distribution', 'gmp'],
  related: ['qbd', 'tablet-testing', 'dissolution-testing', 'stability-testing', 'falsified-medicines', 'medication-errors'],
  body: `
Every batch of a medicine is tested before it may be sold, but the tests are only the last line. **Quality control** (QC) measures; **quality assurance** (QA) decides, with the whole history of the batch in front of it.

### What is tested
- **Starting materials**: every container of an active ingredient or excipient is checked for identity — often with a hand-held near-infrared or Raman spectrometer — and samples are tested against their specifications.
- **Water and environment**: purified water and water for injections (conductivity, total organic carbon, endotoxins); air and surfaces in clean areas.
- **In-process controls**: tablet weight, thickness and hardness every 15–30 minutes on the press; blend uniformity; the loss on drying of a granulate.
- **Finished product**: appearance, identity, assay, degradation products, uniformity of dosage units (see [[pharmacopoeias]]), dissolution and microbial quality — and for sterile products sterility and endotoxins.
- **Stability**: samples of each batch stored and tested through its shelf life (see [[stability-testing]]).

Release limits are often tighter than shelf-life limits — say 95.0–105.0 % of the label at release and 90.0–110.0 % until expiry — leaving room for the drug to degrade.

### Release
A batch is released when QA has reviewed the executed batch record, the QC results and any deviations; in the EU a Qualified Person certifies it, in the US the quality unit approves it. The customer receives a certificate of analysis.

### When a result fails
An **out-of-specification** (OOS) result is investigated, not retested away. The laboratory first looks for an assignable error — a wrong dilution, a failed system suitability test; if none is found, the investigation extends to manufacturing. "Testing into compliance" — retesting until a passing result appears — is forbidden: a 1993 US court case against a generic manufacturer set the principle, and FDA guidance first issued in 2006 spells it out.

### Watching the process: control charts
In the 1920s Walter Shewhart at Bell Laboratories plotted each measurement against time, with a centre line and **control limits** at ±3 standard deviations. Points inside the limits show *common-cause* variation; a point outside, or a suspicious pattern, signals a *special cause* worth finding — often before any product is out of specification. The Western Electric rules (1956) flag, for example:
1. one point beyond 3σ;
2. two of three consecutive points beyond 2σ on the same side;
3. four of five beyond 1σ on the same side;
4. eight in a row on one side of the centre line.

For averages of $n$ units the limits are $\\mu \\pm 3\\sigma/\\sqrt{n}$. Control limits are the *voice of the process*; specification limits are the *voice of the patient*. They are different things.

### Capability
How comfortably does the process fit inside its specification? $C_p = (\\mathrm{USL} - \\mathrm{LSL})/6\\sigma$ compares the tolerance with the spread; $C_{pk} = d/3\\sigma$ uses the distance $d$ from the mean to the nearer limit, so it also sees an off-centre process. With $C_{pk} = 1$ the nearer limit is 3σ away and about 0.13 % of units lie beyond it; with 1.33, about 30 per million. Many companies aim for at least 1.33.

> [!key] Specifications decide whether a batch is acceptable; control charts and capability show whether the process that made it can be trusted to keep making acceptable batches.
`,
  ideas: [
    'QC tests materials, in-process samples and finished batches; QA reviews everything and releases.',
    'An out-of-specification result is investigated; it cannot be retested away.',
    'Control charts separate common-cause from special-cause variation, with limits at ±3σ (±3σ/√n for averages).',
    'Control limits describe the process; specification limits describe what the patient needs.',
    'Cpk = d/3σ; a Cpk of 1.33 puts the nearer limit 4σ from the mean.'
  ],
  pitfalls: [
    'Control limits and specification limits are the same thing — Specifications come from what the product must do; control limits come from how the process actually varies. A capable process has its control limits well inside the specification.',
    'If an OOS result has no obvious cause, retest until it passes — That is testing into compliance. Without a proven laboratory error the original result stands and the investigation widens.',
    'A point outside the control limits means a bad batch — It signals a special cause worth understanding; the product may still meet its specification, and the chart has given early warning.'
  ],
  formulas: [
    {
      name: 'Control limit for subgroup means',
      expr: 'UCL = mu + 3*sigma/sqrt(n)', tex: '\\mathrm{UCL} = \\mu + \\dfrac{3\\sigma}{\\sqrt{n}}',
      vars: {
        UCL: { name: 'upper control limit', q: false, unit: 'mg', tex: '\\mathrm{UCL}' },
        mu: { name: 'process mean (centre line)', q: false, unit: 'mg', value: 250, tex: '\\mu' },
        sigma: { name: 'standard deviation of single units', q: false, unit: 'mg', value: 3 },
        n: { name: 'units per subgroup', value: 5, int: true }
      },
      note: 'The lower limit is μ − 3σ/√n. For a chart of single values, n = 1.',
      stories: {
        UCL: 'Tablets average {mu} with a standard deviation of {sigma}; the press is sampled {n} tablets at a time. What is the upper control limit of the chart of means?',
        n: 'With μ = {mu} and σ = {sigma}, how many tablets per subgroup bring the upper control limit down to {UCL}?'
      }
    },
    {
      name: 'Process capability Cp',
      expr: 'Cp = (USL - LSL)/(6*sigma)', tex: 'C_p = \\dfrac{\\mathrm{USL} - \\mathrm{LSL}}{6\\sigma}',
      vars: {
        Cp: { name: 'capability (spread only)', tex: 'C_p' },
        USL: { name: 'upper specification limit', q: false, unit: '%', value: 105, tex: '\\mathrm{USL}' },
        LSL: { name: 'lower specification limit', q: false, unit: '%', value: 95, tex: '\\mathrm{LSL}' },
        sigma: { name: 'process standard deviation', q: false, unit: '%', value: 1.2 }
      },
      stories: { Cp: 'An assay specification runs from {LSL} to {USL}, and the process standard deviation is {sigma}. What is Cp?', sigma: 'What process standard deviation gives Cp = {Cp} for a specification of {LSL} to {USL}?' }
    },
    {
      name: 'Process capability Cpk',
      expr: 'Cpk = d/(3*sigma)', tex: 'C_{pk} = \\dfrac{d}{3\\sigma}',
      vars: {
        Cpk: { name: 'capability to the nearer limit', tex: 'C_{pk}' },
        d: { name: 'distance from the mean to the nearer specification limit', q: false, unit: '%', value: 4.2 },
        sigma: { name: 'process standard deviation', q: false, unit: '%', value: 1.2 }
      },
      note: 'd = min(USL − mean, mean − LSL). A centred process has Cpk = Cp.',
      stories: { Cpk: 'A process mean lies {d} from the nearer specification limit, with a standard deviation of {sigma}. What is Cpk?' }
    },
    {
      name: 'Fraction beyond the nearer limit',
      expr: 'p = ncdf(-3*Cpk)', tex: 'p = \\Phi\\left(-3\\,C_{pk}\\right)',
      vars: {
        p: { name: 'fraction of units beyond the nearer limit', q: 'ratio', unit: 'ppm' },
        Cpk: { name: 'capability index', value: 1.33, tex: 'C_{pk}' }
      },
      note: 'Φ is the standard normal distribution function; the result assumes normally distributed values and ignores the far limit.',
      stories: { p: 'A process has Cpk = {Cpk}. What fraction of units falls beyond the nearer specification limit?', Cpk: 'What Cpk is needed for no more than {p} of units beyond the nearer limit?' }
    }
  ],
  examples: [
    {
      title: 'Limits for a tablet press',
      q: 'Tablets of a hypothetical product have a target weight of 250 mg, a unit standard deviation of 3 mg and a specification of ±5 % (237.5–262.5 mg). Five tablets are weighed every 15 minutes. Find the control limits and the capability; then suppose the mean drifts to 253 mg.',
      steps: [
        'Limits for the means: $250 \\pm 3 \\times 3/\\sqrt{5} = 250 \\pm 4.02$, so 245.98–254.02 mg.',
        '$C_p = (262.5 - 237.5)/(6 \\times 3) = 1.39$; centred, $C_{pk} = 1.39$.',
        'At a mean of 253 mg: $C_{pk} = (262.5 - 253)/9 = 1.06$, and $\\Phi(-3.17) = 0.076$ % of tablets exceed the upper limit.',
        'The chart sees this early: 253 mg is 2.2 standard errors above the centre line, so two means out of three beyond 2σ soon trigger a signal.'
      ],
      a: 'Limits 246.0–254.0 mg, Cp = 1.39; after the drift Cpk = 1.06, about 760 tablets per million over the limit.'
    },
    {
      title: 'An out-of-specification assay',
      q: 'An assay result is 93.8 % of the label against a specification of 95.0–105.0 %. The laboratory investigation finds that the reference standard\'s weight was typed as 24.0 mg, while the balance printout shows 25.6 mg. What happens?',
      steps: [
        'The sample result is proportional to the standard concentration used in the calculation, so it is too low by $24.0/25.6$.',
        'Corrected: $93.8 \\times 25.6/24.0 = 100.1$ %.',
        'Because the error is proven by an original record (the printout), the first result is invalidated and the corrected one reported, with the investigation documented and a corrective action (for example, direct transfer of balance data).',
        'Without such evidence the 93.8 % would stand, however many passing retests followed.'
      ],
      a: 'The OOS result is invalidated by a documented laboratory error; the corrected result is 100.1 %.'
    }
  ],
  quiz: [
    { q: 'A subgroup mean falls outside the control limits but inside the specification. The batch is out of specification.', a: false, why: 'Control limits describe the process, not the product requirement. The point signals a special cause to investigate; the product may still conform.' },
    { q: 'An assay specification is 95–105 % and the process standard deviation is 1.25 %. What is Cp?', answer: 1.33, why: 'Cp = 10/(6 × 1.25) = 1.33.' },
    { q: 'Eight subgroup means in a row lie above the centre line, all inside the control limits. What does this suggest?', choices: ['nothing: all points are inside the limits', 'a shift in the process mean worth investigating', 'the limits are too wide and should be recalculated at once', 'the balance is broken'], a: 1, why: 'Eight in a row on one side has a probability of about 1 in 256 by chance: a Western Electric signal of a shift.' },
    { q: 'After an OOS assay with no laboratory error found, an analyst retests twice, gets two passing results and reports their average. This is…', choices: ['good practice', 'testing into compliance, which is not allowed', 'required by the pharmacopoeia', 'acceptable if the average passes'], a: 1, why: 'Retesting until a pass appears hides real failures; the OOS result stands unless an assignable error is proven.' },
    { q: 'A process has Cpk = 1.0. Roughly what percentage of units lies beyond the nearer specification limit?', answer: 0.135, unit: '%', why: 'Φ(−3) = 0.00135 = 0.135 %.' }
  ],
  applications: [
    'Charts of mean and range for tablet weight on the compression line.',
    'Trending assay and dissolution results in the annual product quality review.',
    'Environmental monitoring trends in clean rooms.',
    'Capability studies before launching a product or transferring it to another site.'
  ],
  history: 'Walter Shewhart drew the first control chart in a memo at Bell Telephone Laboratories in 1924 and published *Economic Control of Quality of Manufactured Product* in 1931. W. Edwards Deming carried the ideas to Japanese industry after 1950, and the Western Electric handbook codified the run rules in 1956.',
  sim: ['found-control-chart', 'found-uniformity']
},

{
  id: 'falsified-medicines', parent: 'quality-topic', title: 'Falsified medicines', level: 2,
  short: 'Substandard medicines fail their specifications through poor manufacture or storage; falsified ones deliberately misrepresent what they are or where they come from. They harm patients everywhere, most in low- and middle-income countries, and are fought with regulation, serialised packs, supply-chain control and testing.',
  keywords: ['falsified medicines', 'counterfeit', 'substandard', 'unregistered', 'WHO', 'Falsified Medicines Directive', 'safety features', 'unique identifier', 'serial number', '2D DataMatrix', 'serialisation', 'anti-tampering', 'DSCSA', 'track and trace', 'market surveillance', 'Raman', 'sampling', 'online pharmacies'],
  prereq: ['quality-control', 'regulation-approval', 'drug-names'],
  related: ['analytical-methods', 'gmp', 'pharmacovigilance', 'antimicrobial-stewardship', 'medication-errors', 'packaging'],
  body: `
A patient who takes a medicine has to trust that it is what the label says. For millions of people that trust is misplaced. The WHO estimated in 2017 that about **1 in 10** medical products in low- and middle-income countries is substandard or falsified, and that poor-quality antibiotics may contribute to some 72,000–169,000 deaths of children with pneumonia every year.

### Three different problems
The WHO's definitions, adopted by the World Health Assembly in 2017:
- **Substandard**: authorised products that fail their quality standards or specifications — through poor manufacture, or degradation in heat, humidity and bad storage.
- **Unregistered or unlicensed**: products not assessed or approved by the regulator of the country where they are sold.
- **Falsified**: products that *deliberately or fraudulently misrepresent* their identity, composition or source.

"Counterfeit" is a legal term about trademarks; public-health agencies prefer "falsified", because the harm is to patients, not to brands.

### What falsified medicines contain
Surveys find products with no active ingredient, too little, the wrong one (often a cheaper drug with a similar effect), undeclared ingredients or toxic contaminants, and genuine packs refilled or relabelled with a new expiry date. Any medicine in demand is a target: antimalarials and antibiotics, cancer medicines, vaccines, and lifestyle and weight-loss medicines sold online (in 2024 the WHO warned of falsified pens of a GLP-1 receptor agonist). Too little of an antimicrobial is doubly harmful: the patient is not cured, and the surviving microbes are selected for resistance (see [[antimicrobial-stewardship]] and [[biology:antibiotic-resistance]]).

### Defences
- **Regulation and the supply chain**: licensed manufacturers, wholesalers and pharmacies, good distribution practice and inspections.
- **Serialisation**: under the EU Falsified Medicines Directive (2011/62/EU), since 9 February 2019 most prescription medicines carry a 2D DataMatrix code with a product code, a randomised **serial number**, the batch and the expiry date, plus an anti-tampering seal. The pharmacy scans each pack against a national database and "decommissions" it; a second scan of the same number raises an alert. Serial numbers must be random enough that the chance of guessing a valid one is below 1 in 10,000. The US Drug Supply Chain Security Act (2013) phases in electronic, pack-level tracing (required from late 2023, with transition periods at the time of writing).
- **Testing**: inspection of packs and tablets, hand-held Raman and near-infrared spectrometers, simple field kits (thin-layer chromatography and disintegration), and confirmation by HPLC in a laboratory (see [[analytical-methods]]).
- **Surveillance and alerts**: the WHO Global Surveillance and Monitoring System (2013) collects reports and issues medical product alerts; Interpol's Operation Pangea targets illegal online sellers.

### How many packs must a survey test?
If a fraction $p$ of the packs on a market is bad and a survey tests $n$ packs at random, the chance of finding at least one is

$$P = 1 - (1 - p)^n$$

At $p$ = 5 %, 20 packs find a problem only 64 % of the time, and 59 are needed for 95 % confidence; at 1 %, 299. Rare problems need large samples — one reason why a secure supply chain matters more than testing.

> [!warn] Buy medicines only from registered pharmacies; in the EU, legal online pharmacies display a common logo that links to a national register. If a pack, a tablet or its taste looks different, or a medicine does not seem to work as before, speak to a pharmacist and report it to the regulator. If someone becomes seriously unwell after taking a medicine, call your local emergency number or poison centre.
`,
  ideas: [
    'Substandard products fail their specifications; falsified products deliberately misrepresent identity, composition or source.',
    'The WHO estimated in 2017 that about 1 in 10 medical products in low- and middle-income countries is substandard or falsified.',
    'Serialised packs, verified and decommissioned at the pharmacy, make falsified packs easier to catch in regulated supply chains.',
    'The chance that a sample of n packs finds a problem present in a fraction p is 1 − (1 − p)ⁿ: rare problems need large samples.'
  ],
  pitfalls: [
    'Falsified medicines are only a problem of poor countries — They are commonest where regulation is weakest, but they reach every country, especially through illegal online sellers, and high-demand medicines are targeted everywhere.',
    'Substandard and falsified mean the same — Substandard products are genuine but fail their specifications, often through poor manufacture or storage; falsified products deliberately deceive. The remedies differ.',
    'Testing a few packs will find any problem — Only common ones: with 1 % of packs affected, a sample of 20 finds one less than a fifth of the time.'
  ],
  formulas: [
    {
      name: 'Chance that a survey finds at least one bad pack',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1 - p)^{n}',
      vars: {
        P: { name: 'chance of finding at least one bad pack', q: 'ratio', unit: '%' },
        p: { name: 'fraction of packs that are bad', q: 'ratio', unit: '%', value: 5 },
        n: { name: 'packs tested at random', value: 20, int: true }
      },
      note: 'Assumes random sampling from a large market and a test that always recognises a bad pack; with a test that finds only a fraction Se of them, replace p by p·Se.',
      stories: {
        P: 'A fraction {p} of the packs on a market are falsified. A survey tests {n} packs at random. What is the chance it finds at least one?',
        n: 'If {p} of packs are falsified, how many must a survey test to have a {P} chance of finding at least one?'
      }
    },
    {
      name: 'Chance of guessing a valid serial number',
      expr: 'pg = Nv/A^L', tex: 'p_g = \\dfrac{N_v}{A^{L}}',
      vars: {
        pg: { name: 'chance that a guessed serial number is valid', q: 'ratio', unit: 'ppm', tex: 'p_g' },
        Nv: { name: 'serial numbers in use under one product code', value: 2.5e8, tex: 'N_v' },
        A: { name: 'characters in the alphabet (10 digits, 36 alphanumeric)', value: 36, int: true },
        L: { name: 'length of the serial number', value: 8, int: true }
      },
      note: 'EU rules require this chance to be below 1 in 10,000 (100 ppm). The serial number may have up to 20 characters.',
      stories: {
        pg: '{Nv} packs carry random serial numbers of {L} characters drawn from {A} symbols. What is the chance that a guessed number is valid?',
        L: 'How many characters from an alphabet of {A} are needed to keep the chance of guessing one of {Nv} valid serial numbers at {pg}?'
      }
    }
  ],
  examples: [
    {
      title: 'Planning a market survey',
      q: 'A regulator suspects that 5 % of packs of an antimalarial on its market are falsified. How many packs must a survey test to have a 95 % chance of finding one? What if the field test recognises only 70 % of falsified packs, or if the true rate is 1 %?',
      steps: [
        'With 20 packs: $1 - 0.95^{20} = 1 - 0.358 = 64$ %.',
        'For 95 %: $n = \\ln 0.05/\\ln 0.95 = 58.4$, so 59 packs.',
        'A test that finds 70 % of falsified packs effectively sees $p = 0.05 \\times 0.7 = 3.5$ %: $n = \\ln 0.05/\\ln 0.965 = 84.1$, so 85 packs.',
        'At a true rate of 1 %: $n = \\ln 0.05/\\ln 0.99 = 298.1$, so 299 packs.'
      ],
      a: '59 packs (85 with the weaker test; 299 if only 1 % are falsified).'
    },
    {
      title: 'How long must a serial number be?',
      q: 'A product sells 50 million packs a year and keeps one product code for 5 years. How long must a random serial number be, in digits or in alphanumeric characters, to keep the chance of guessing a valid one below 1 in 10,000?',
      steps: [
        'Numbers in use: $5 \\times 50\\times10^{6} = 2.5\\times10^{8}$.',
        'The space of numbers must exceed $2.5\\times10^{8} \\times 10^{4} = 2.5\\times10^{12}$.',
        'Digits: $10^{L} \\ge 2.5\\times10^{12}$ gives $L = 13$.',
        'Alphanumeric: $36^{L} \\ge 2.5\\times10^{12}$ gives $L \\ge \\log(2.5\\times10^{12})/\\log 36 = 7.97$, so 8 characters ($36^8 = 2.8\\times10^{12}$).'
      ],
      a: '13 random digits, or 8 random alphanumeric characters.'
    }
  ],
  quiz: [
    { q: 'A genuine, authorised antibiotic loses potency after months in a hot, humid store and fails its assay. It is…', choices: ['falsified', 'substandard', 'unregistered', 'counterfeit'], a: 1, why: 'It is a genuine product that no longer meets its specification: substandard. Nothing about it was misrepresented.' },
    { q: 'If 10 % of packs are falsified, what is the chance that a random sample of 30 packs contains at least one?', answer: 95.8, unit: '%', why: '1 − 0.9³⁰ = 1 − 0.042 = 0.958.' },
    { q: 'A pack that verifies successfully when scanned at the pharmacy is certain to be genuine and of good quality.', a: false, why: 'Verification shows that the code is valid and not yet used. A copied code can pass once, before the genuine pack is scanned, and a genuine pack can still be substandard after bad storage.' },
    { q: 'Why do falsified antimicrobials that contain a little active ingredient worry public-health experts even more than those with none?', choices: ['they cost more to make', 'they can pass simple tests and partly treat, while low drug levels select for resistant microbes', 'they are always toxic', 'they cannot be detected by any method'], a: 1, why: 'A small amount of drug passes a crude identity test, masks the fraud and leaves survivors that are selected for resistance.' },
    { q: 'Serial numbers of 10 digits are used for 50 million packs under one product code. What is the chance that a random guess is valid (%)?', answer: 0.5, unit: '%', why: '5 × 10⁷/10¹⁰ = 0.005 = 0.5 % — fifty times too high for the EU limit of 0.01 %.' }
  ],
  applications: [
    'Market surveillance surveys by regulators and the WHO.',
    'Pack verification at the pharmacy under the EU Falsified Medicines Directive.',
    'Hand-held spectrometers and field kits at borders and in rural clinics.',
    'Reporting systems that let patients and professionals flag suspect products.'
  ],
  history: 'Fraud in medicines is old: in the 17th century the bark of other trees was sold as the antimalarial cinchona bark. In modern times glycerol falsified with diethylene glycol has repeatedly poisoned children, in Haiti in 1996 and Panama in 2006 among others. The WHO set up its Global Surveillance and Monitoring System in 2013 and agreed the definitions of substandard and falsified products in 2017; the EU directive of 2011 and the US Drug Supply Chain Security Act of 2013 brought pack-level serialisation.',
  sim: 'found-screening'
}

);
