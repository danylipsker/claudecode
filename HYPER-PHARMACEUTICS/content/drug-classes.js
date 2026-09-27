/* HYPER-PHARMACEUTICS · content/drug-classes.js — Medicines by class (topic classes-topic).
 * Each page is about the pharmaceutical science of a family of medicines: target and mechanism,
 * structure and physicochemical properties, why the dosage forms are what they are, stability,
 * therapeutic windows, class-wide adverse effects and interactions as pharmacology.
 * Generic names only; every number in an example is illustrative, never a dose. Simulations: sims/drug-classes.js. */
Hyper.add(

{
  id: 'analgesics', parent: 'classes-topic', title: 'Pain relievers', level: 2,
  short: 'Pain relievers act at three levels: NSAIDs and paracetamol reduce prostaglandin signalling, opioids imitate the body\'s endorphins at μ-opioid receptors, and local anaesthetics block sodium channels in nerves. Their chemistry — weak acids, lipophilic bases, prodrugs — decides their dosage forms, and their pharmacology decides their risks.',
  keywords: ['analgesic', 'painkiller', 'NSAID', 'COX-1', 'COX-2', 'prostaglandin', 'aspirin', 'ibuprofen', 'paracetamol', 'acetaminophen', 'NAPQI', 'opioid', 'mu-opioid receptor', 'morphine', 'codeine', 'fentanyl', 'naloxone', 'respiratory depression', 'ion trapping', 'transdermal patch', 'local anaesthetic', 'enteric coating'],
  prereq: ['receptors', 'agonists-antagonists', 'ionisation-pka', 'medicine:pain'],
  related: ['tolerance', 'therapeutic-index', 'pharmacogenomics', 'transdermal', 'tablet-coating', 'modified-release', 'protein-binding', 'first-pass', 'cns-drugs', 'medicine:pain-relief', 'medicine:poisoning-overdose', 'medicine:addiction'],
  body: `
Pain starts where damaged tissue releases chemical signals that excite **nociceptors**; the message climbs the spinal cord and becomes an experience in the brain. Analgesics interrupt this chain at different points, and each family's chemistry shapes both its dosage forms and its dangers.

### NSAIDs: blocking cyclo-oxygenase
Non-steroidal anti-inflammatory drugs — ibuprofen, naproxen, diclofenac, aspirin — inhibit **cyclo-oxygenase** (COX), the enzyme that turns arachidonic acid into prostaglandins, which sensitise nociceptors and drive fever and inflammation. **COX-1** is always present: it makes the prostaglandins that protect the stomach lining and keep blood flowing through a stressed kidney, and the thromboxane that activates platelets. **COX-2** is induced where there is inflammation. The class's adverse effects follow directly: ulcers and bleeding, reduced kidney perfusion in dehydration or heart failure, fluid retention and higher blood pressure. COX-2-selective coxibs spare the stomach but tilt the prostacyclin–thromboxane balance towards clotting; rofecoxib was withdrawn in 2004 for that reason.

Aspirin **acetylates** a serine in the active site of COX-1 and inhibits it irreversibly. Platelets have no nucleus and cannot make new enzyme, so one low dose disables them for their remaining 7–10 days of life, although aspirin itself lasts only about 20 minutes in plasma — the basis of its use as an antiplatelet drug.

Almost all NSAIDs are **weak acids** (pKa 3.5–5): more than 99 % bound to albumin, with a small volume of distribution (about 0.1–0.2 L/kg), poorly soluble in the stomach and soluble in the intestine. In the acid stomach they are un-ionised and diffuse into the mucosal cells, where at pH ≈ 7 they ionise and are **trapped** — a local injury on top of the systemic loss of COX-1 protection. Formulators respond with **enteric coatings** that dissolve only above pH 5.5 (see [[tablet-coating]]), fast-dissolving salts (sodium, lysine) for quicker relief, modified-release matrices, and **topical gels** that treat a joint near the skin while blood levels stay at a few per cent of those after an oral dose. Aspirin's ester hydrolyses in moist air to salicylic and acetic acids — the vinegar smell of an old bottle — so it is packed dry.

### Paracetamol (acetaminophen)
Paracetamol relieves pain and fever with little anti-inflammatory effect; it acts mainly in the central nervous system, and its exact mechanism is still debated. A very weak acid (pKa 9.5), it is neutral in the gut and well absorbed. Most is conjugated with glucuronide and sulfate, but 5–10 % is oxidised by CYP2E1 to **NAPQI**, a reactive quinone-imine normally neutralised by glutathione. In overdose the conjugation pathways saturate, glutathione runs out and NAPQI destroys liver cells — often with no symptoms for a day. Acetylcysteine, which restores glutathione, is the antidote and works best when started early.

### Opioids: μ-receptor agonists
Opioids — morphine, oxycodone, fentanyl, codeine, tramadol, methadone — are agonists at the **μ-opioid receptor**, a G-protein-coupled receptor used by the body's endorphins. Activation closes calcium channels and opens potassium channels, so pain-transmitting neurones fire less. The same receptor in the brainstem's breathing centre causes the most dangerous effect, **respiratory depression**; in the gut it causes constipation, and in reward pathways euphoria.

| Property | Consequence for the medicine |
|---|---|
| Morphine: polar, extensive first-pass glucuronidation (oral F ≈ 30 %) | larger oral than injected doses; the active glucuronide accumulates in kidney failure |
| Codeine: a prodrug, 5–10 % converted by CYP2D6 to morphine | little effect in poor metabolisers, high morphine levels in ultra-rapid metabolisers — why regulators restricted it in children (2013–2017) |
| Fentanyl: lipophilic (log P ≈ 4), potent, MW 337 | suits a **transdermal patch**; a depot in the skin means onset over 12–24 h and a tail after removal; heat speeds absorption |
| Methadone: long, variable half-life (about 15–60 h) | accumulates over days; can prolong the QT interval |
| Tramadol: weak μ-agonist that also blocks serotonin and noradrenaline reuptake | seizures and serotonin toxicity; its active metabolite needs CYP2D6 |

**Tolerance** develops to pain relief, euphoria and respiratory depression but hardly to constipation; **physical dependence** means that stopping suddenly causes withdrawal (see [[tolerance]]). Neither is the same as addiction, a health condition (see [[medicine:addiction|addiction]]). Tolerance is also lost within days, so an amount once tolerated can stop breathing after a break.

**Naloxone** is a competitive μ-antagonist that displaces the agonist and restores breathing within minutes. Its half-life, about an hour, is shorter than that of most opioids, so its effect can wear off while the opioid is still there; that is why a person who has received naloxone must be observed and may need more. Modified-release opioid tablets hold many hours of drug; like every modified-release product they must be taken exactly as directed, because a damaged release structure can deliver it all at once ([[modified-release]]).

> [!warn] Signs of an opioid overdose are pinpoint pupils, unresponsiveness and slow, shallow or noisy breathing, sometimes with blue lips. Call your local emergency number at once; naloxone, where available, can be given as a nasal spray or injection while help comes, and the person must still be seen by emergency services. A paracetamol overdose may cause no symptoms for a day or more but needs urgent assessment all the same: contact emergency services or a poison centre immediately, even if the person feels well.

### Local anaesthetics
Lidocaine, bupivacaine and their relatives block voltage-gated **sodium channels** from inside the nerve. They are weak bases (pKa 7.6–9): the un-ionised form crosses the nerve membrane and the ionised form blocks the channel. Acidic, inflamed tissue keeps more of the drug ionised outside the nerve, which is why they work poorly in an abscess; adrenaline is added to some solutions to constrict vessels and prolong the block.
`,
  ideas: [
    'NSAIDs inhibit COX; losing COX-1 in the stomach, kidney and platelets explains their class-wide adverse effects.',
    'Aspirin inhibits platelet COX-1 irreversibly, so its effect lasts the platelets\' lifetime, not its own 20-minute half-life.',
    'Weak-acid NSAIDs are trapped in gastric mucosal cells; enteric coatings, salts and topical gels are formulation answers.',
    'Opioids are μ-receptor agonists; respiratory depression is the dangerous effect, and naloxone competes it away — but for a shorter time than most opioids last.',
    'Paracetamol toxicity comes from a minor metabolite, NAPQI, once glutathione is exhausted.'
  ],
  pitfalls: [
    'Enteric-coated aspirin cannot harm the stomach — The coating prevents local contact injury, but aspirin still inhibits COX-1 systemically after absorption, so the protective prostaglandins of the stomach lining are lost wherever the tablet dissolves.',
    'Once naloxone has worked, the danger is over — Naloxone only displaces the opioid from its receptors; its effect lasts about an hour, and a longer-acting opioid can depress breathing again when it wears off.',
    'Codeine is a mild, predictable opioid for everyone — Its effect depends on conversion to morphine by CYP2D6, which varies from almost none to very high between people.'
  ],
  formulas: [
    {
      name: 'Occupancy by an agonist with a competitive antagonist (Gaddum)',
      expr: 'occ = (A/KA)/(1 + A/KA + B/KB)',
      tex: '\\theta_A = \\dfrac{\\mathrm{[A]}/K_A}{1 + \\mathrm{[A]}/K_A + \\mathrm{[B]}/K_B}',
      vars: {
        occ: { name: 'fraction of receptors occupied by the agonist', q: 'ratio', unit: '%', tex: '\\theta_A' },
        A: { name: 'agonist concentration', q: 'concentration', unit: 'nM', value: 10, tex: '\\mathrm{[A]}' },
        KA: { name: 'agonist dissociation constant', q: 'concentration', unit: 'nM', value: 5, tex: 'K_A' },
        B: { name: 'antagonist concentration', q: 'concentration', unit: 'nM', value: 20, tex: '\\mathrm{[B]}' },
        KB: { name: 'antagonist dissociation constant', q: 'concentration', unit: 'nM', value: 1, tex: 'K_B' }
      },
      note: 'Both ligands bind reversibly to the same site and are at equilibrium. Without antagonist ([B] = 0) it reduces to the simple occupancy [A]/([A] + K_A). Illustrative concentrations.',
      practice: { unknowns: ['occ', 'B'] },
      stories: {
        occ: 'An agonist at {A} (dissociation constant {KA}) shares its receptors with a competitive antagonist at {B} (dissociation constant {KB}). What fraction of the receptors does the agonist occupy?',
        B: 'An agonist at {A} (dissociation constant {KA}) must be pushed down to {occ} occupancy. What concentration of an antagonist with dissociation constant {KB} does that?'
      }
    },
    {
      name: 'Ion trapping of a weak acid across a membrane',
      expr: 'Rt = (1 + 10^(pHi - pKa))/(1 + 10^(pHo - pKa))',
      tex: 'R = \\dfrac{1 + 10^{\\,\\mathrm{pH}_i - {\\mathrm{p}K}_a}}{1 + 10^{\\,\\mathrm{pH}_o - {\\mathrm{p}K}_a}}',
      vars: {
        Rt: { name: 'total concentration inside ÷ outside', tex: 'R' },
        pHi: { name: 'pH inside (the cell)', value: 7.1, min: 0, max: 14, tex: '\\mathrm{pH}_i' },
        pHo: { name: 'pH outside (the stomach contents)', value: 2, min: 0, max: 14, tex: '\\mathrm{pH}_o' },
        pKa: { name: 'pKa of the acid', value: 4.2, min: -2, max: 16, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'At equilibrium when only the un-ionised form crosses the membrane (pH-partition hypothesis). For a weak base, swap the signs of the exponents: bases are trapped on the acidic side.',
      practice: { unknowns: ['Rt', 'pHo'] },
      stories: {
        Rt: 'A weak-acid NSAID (pKa {pKa}) sits in stomach contents at pH {pHo}, next to mucosal cells at pH {pHi}. How many times higher can its total concentration become inside the cells?',
        pHo: 'An acid of pKa {pKa} reaches {Rt} times the outside concentration inside cells at pH {pHi}. What is the pH outside?'
      }
    },
    {
      name: 'Steady state from a constant-rate patch',
      expr: 'Css = R0/CL', tex: 'C_\\text{ss} = \\dfrac{R_0}{\\mathrm{CL}}',
      vars: {
        Css: { name: 'steady-state plasma concentration', q: false, unit: 'µg/L', tex: 'C_\\text{ss}' },
        R0: { name: 'delivery rate from the patch', q: false, unit: 'µg/h', value: 20, tex: 'R_0' },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 40, tex: '\\mathrm{CL}' }
      },
      note: 'Any zero-order input (patch, infusion, osmotic pump) gives Css = rate/clearance once about four to five half-lives have passed; a skin depot adds a further delay. A hypothetical drug: real patches follow their product information.',
      stories: { Css: 'A hypothetical patch delivers {R0} of a drug whose clearance is {CL}. What plasma concentration does it approach?', R0: 'Which delivery rate would hold a hypothetical drug with clearance {CL} at {Css}?' }
    }
  ],
  examples: [
    {
      title: 'Why NSAIDs injure the stomach lining from inside',
      q: 'A weak-acid NSAID has pKa 4.2. Stomach contents are at pH 2, the mucosal cells at pH 7.1. At equilibrium, how much higher is the total drug concentration inside the cells than in the stomach?',
      steps: [
        'Inside: un-ionised plus ionised is proportional to $1 + 10^{7.1 - 4.2} = 1 + 794 = 795$.',
        'Outside: $1 + 10^{2 - 4.2} = 1 + 0.0063 = 1.006$.',
        'Ratio $R = 795/1.006 \\approx 790$.',
        'Only the un-ionised form crosses, and inside the cell almost all of it ionises and cannot leave: the drug accumulates several hundredfold in the very cells whose protective prostaglandins it blocks. An enteric coating stops this local step, though not the systemic one.'
      ],
      a: 'About 790 times higher inside the mucosal cells.'
    },
    {
      title: 'Naloxone wears off first (hypothetical units)',
      q: 'An opioid is at 4 × its $K_A$ and has a half-life of 4 h. Naloxone is given to reach 20 × its $K_B$; its half-life is 1 h. Compare the agonist\'s receptor occupancy before naloxone, just after it, and 2 and 4 hours later (ignore naloxone\'s absorption time).',
      steps: [
        'Before: $\\theta_A = 4/(1 + 4) = 80$ %.',
        'Just after: $\\theta_A = 4/(1 + 4 + 20) = 16$ %.',
        'After 2 h the opioid has fallen to $4 \\times 2^{-0.5} = 2.83$ and naloxone to $20 \\times 2^{-2} = 5$: $\\theta_A = 2.83/(1 + 2.83 + 5) = 32$ %.',
        'After 4 h: opioid 2, naloxone $20 \\times 2^{-4} = 1.25$: $\\theta_A = 2/(1 + 2 + 1.25) = 47$ % — climbing back towards levels at which breathing slows again.'
      ],
      a: '80 % → 16 % → 32 % → 47 %: the antagonist leaves faster than the agonist, which is why people are observed after naloxone and may need repeat doses.'
    },
    {
      title: 'A patch approaching steady state',
      q: 'A hypothetical lipophilic drug is delivered from a patch at 20 µg/h. Its clearance is 40 L/h and its elimination half-life 10 h. What concentration does it approach, and roughly when?',
      steps: [
        '$C_\\text{ss} = R_0/CL = 20/40 = 0.5$ µg/L (0.5 ng/mL).',
        'The approach follows $1 - e^{-kt}$: 50 % after one half-life, 94 % after four — about 40 h.',
        'The drug must first build up a depot in the skin, which adds hours at the start and leaves a tail after the patch is removed.'
      ],
      a: 'About 0.5 µg/L, reached (94 %) after roughly two days — the reason patches are not for acute pain.'
    }
  ],
  quiz: [
    { q: 'One low dose of aspirin inhibits platelet thromboxane for about a week, although aspirin lasts only about 20 minutes in plasma. Why?', choices: ['aspirin is stored inside platelets', 'it acetylates COX-1 irreversibly and platelets, lacking a nucleus, cannot make new enzyme', 'its metabolite salicylate has a week-long half-life', 'platelets trap aspirin by ion trapping'], a: 1, why: 'The enzyme is destroyed, not just occupied; function returns only as new platelets are released from the marrow, about 10 % a day.' },
    { q: 'Who is most at risk of an unexpectedly strong effect from codeine?', choices: ['CYP2D6 poor metabolisers', 'CYP2D6 ultra-rapid metabolisers', 'people taking it with food', 'everyone equally'], a: 1, why: 'Codeine works through its conversion to morphine by CYP2D6; ultra-rapid metabolisers make more morphine faster. Poor metabolisers get little effect.' },
    { q: 'Once naloxone has restored normal breathing, the opioid has been removed from the body.', a: false, why: 'Naloxone displaces the opioid from its receptors but does not remove it; naloxone\'s shorter half-life means breathing can slow again when it wears off.' },
    { q: 'Without any antagonist, what percentage of receptors does an agonist occupy at 4 × its dissociation constant?', answer: 80, unit: '%', why: 'θ = [A]/([A] + K_A) = 4/(4 + 1) = 0.80.' },
    { q: 'Why does fentanyl, but not morphine, suit a skin patch?', choices: ['fentanyl is more water-soluble', 'fentanyl is potent (small daily amount), lipophilic and small enough to cross the stratum corneum', 'morphine is destroyed by skin enzymes only', 'patches work for any drug'], a: 1, why: 'Transdermal delivery needs a drug effective at micrograms to low milligrams a day, with moderate lipophilicity and a molecular weight below about 500; polar morphine crosses skin far too slowly.' }
  ],
  problems: [
    { q: 'A weak-acid NSAID with pKa 4.5 equilibrates between gastric contents at pH 1.5 and mucosal cells at pH 7.4. What is the ratio of total concentration inside to outside?', answer: 794, tol: 0.02, steps: ['Inside: $1 + 10^{7.4 - 4.5} = 1 + 794.3 = 795.3$.', 'Outside: $1 + 10^{1.5 - 4.5} = 1.001$.', '$R = 795.3/1.001 = 794$.'] },
    { q: 'An agonist is at 2 × its dissociation constant. To what multiple of its own dissociation constant must a competitive antagonist rise to cut the agonist\'s occupancy to 10 %?', answer: 17, tol: 0.02, steps: ['$0.10 = 2/(1 + 2 + b)$, where $b = [B]/K_B$.', '$1 + 2 + b = 20$, so $b = 17$.'] }
  ],
  applications: [
    'Enteric-coated, modified-release and topical NSAID products that reduce exposure of the stomach.',
    'Transdermal opioid patches for steady background pain relief when swallowing is difficult.',
    'Take-home naloxone programmes, and observation after naloxone because of its short half-life.',
    'Pharmacogenomic warnings for codeine and tramadol (CYP2D6).'
  ],
  history: 'Willow bark, rich in salicin, was used against fever for centuries; Felix Hoffmann at Bayer made acetylsalicylic acid in 1897, and John Vane showed in 1971 that aspirin blocks prostaglandin synthesis (Nobel Prize 1982). Friedrich Sertürner isolated morphine from opium around 1804, the first alkaloid purified from a plant; opioid receptors were found in 1973 and the enkephalins, the first endogenous opioids, in 1975.',
  sim: 'class-opioid'
},

{
  id: 'antimicrobials', parent: 'classes-topic', title: 'Antibiotics and antimicrobials', level: 2,
  short: 'Antibiotics hit targets that bacteria have and human cells lack — the cell wall, the bacterial ribosome, gyrase, folate synthesis. Their chemistry explains their dosage forms (dry powders for unstable β-lactams, injections for unabsorbed aminoglycosides), their killing patterns explain how they are dosed, and resistance explains why they must be used sparingly.',
  keywords: ['antibiotic', 'antimicrobial', 'selective toxicity', 'beta-lactam', 'β-lactam', 'penicillin', 'cephalosporin', 'carbapenem', 'penicillin-binding protein', 'aminoglycoside', 'vancomycin', 'macrolide', 'tetracycline', 'fluoroquinolone', 'chelation', 'MIC', 'time-dependent killing', 'concentration-dependent killing', 'beta-lactamase', 'clavulanic acid', 'resistance', 'reconstitution'],
  prereq: ['pkpd', 'medicine:antibiotics', 'biology:prokaryotic-cells'],
  related: ['antimicrobial-stewardship', 'tdm', 'degradation-pathways', 'drug-interactions', 'suspensions', 'packaging', 'shelf-life', 'antivirals', 'biology:antibiotic-resistance', 'biology:bacterial-growth', 'medicine:antimicrobial-resistance', 'medicine:tuberculosis'],
  body: `
Antibiotics work because bacteria are built differently from us. A good antibiotic hits a target that human cells lack, or have in a form different enough to be spared: the peptidoglycan cell wall, the 70S ribosome, bacterial DNA gyrase, the folate pathway. This **selective toxicity** — Paul Ehrlich's "magic bullet" — lets blood levels kill bacteria without harming the patient.

### Targets and classes
| Target | Classes (examples) | Killing |
|---|---|---|
| Cell-wall cross-linking: penicillin-binding proteins | β-lactams: penicillins, cephalosporins, carbapenems | bactericidal, time-dependent |
| Cell-wall precursor (D-Ala-D-Ala) | glycopeptides: vancomycin | bactericidal, slow |
| 30S ribosome | aminoglycosides (gentamicin); tetracyclines | aminoglycosides bactericidal and concentration-dependent; tetracyclines static |
| 50S ribosome | macrolides (azithromycin), lincosamides, oxazolidinones (linezolid) | mostly bacteriostatic |
| DNA gyrase and topoisomerase IV | fluoroquinolones (ciprofloxacin) | bactericidal, concentration-dependent |
| Folate synthesis | sulfonamides with trimethoprim | synergistic pair |
| Outer membrane | polymyxins (colistin) | bactericidal; toxic to the kidney |

### Chemistry that shapes the medicines
The **β-lactams** mimic the D-alanyl-D-alanine end of the wall precursor and acylate the active-site serine of the transpeptidases; the wall weakens and the growing cell bursts. Their four-membered ring is strained — which makes it reactive towards the enzyme and also towards water. So penicillins and cephalosporins hydrolyse in solution: oral suspensions are supplied as **dry powders** made up at dispensing, with an in-use life of about 7–14 days (often refrigerated), and injections are powders reconstituted just before use (see [[shelf-life]]). Benzylpenicillin is destroyed by stomach acid and is injected; phenoxymethylpenicillin, whose side chain makes acid-catalysed ring opening slower, survives to be swallowed. Amoxicillin differs from ampicillin by a single hydroxyl group yet is absorbed about twice as well. Where absorption is poor, a lipophilic **ester prodrug** (cefuroxime axetil, pivmecillinam) is absorbed and hydrolysed by esterases; where long exposure is wanted, a poorly soluble salt makes a **depot** — benzathine benzylpenicillin injected into muscle gives low levels for weeks.

**Aminoglycosides** are polycations: less than 1 % is absorbed from the gut, so they are injected (or inhaled, or applied locally). They accumulate in kidney tubule cells by a saturable uptake (and also in the inner ear), and they kill faster the higher the peak, with a long post-antibiotic effect — which is why they are given once daily as a high peak and a long, low trough, with levels measured ([[tdm]]). **Vancomycin**, a glycopeptide of 1449 Da, is not absorbed either: given by mouth it stays in the gut, which is exploited against *Clostridioides difficile* colitis. **Tetracyclines** and **fluoroquinolones** chelate di- and trivalent ions: taken with milk, antacids or iron, their absorption can fall by half or more; tetracyclines also deposit in growing teeth and bone, and degraded tetracycline forms epi-anhydrotetracycline, which damages kidney tubules — a classic reason for strict expiry dates. Erythromycin is acid-labile and is given as enteric-coated tablets or esters, and macrolides such as clarithromycin inhibit CYP3A4, a source of interactions.

### Time or concentration
Killing rises with concentration differently from class to class. For β-lactams it saturates at about four times the **minimum inhibitory concentration** (MIC); what matters is the fraction of the dosing interval that the free level stays above the MIC, $fT_{>\\mathrm{MIC}}$ — roughly 30–70 % depending on the family. Aminoglycosides and fluoroquinolones kill faster at higher levels, so $C_\\text{max}/\\text{MIC}$ or $\\text{AUC}/\\text{MIC}$ predicts success. Hence β-lactams are given often or by prolonged infusion, aminoglycosides once daily (see [[pkpd]] and [[antimicrobial-stewardship]]). Bacteriostatic drugs stop growth and leave the kill to the immune system.

### Resistance
Bacteria resist by **destroying** the drug (β-lactamases, including extended-spectrum β-lactamases and carbapenemases; aminoglycoside-modifying enzymes), **changing the target** (the extra penicillin-binding protein PBP2a of MRSA, gyrase mutations, ribosomal methylation), **keeping it out** (loss of porins) or **pumping it out** (efflux). Genes travel between species on plasmids. Formulation science answers with **β-lactamase inhibitors** — clavulanic acid, tazobactam, avibactam — combined with a β-lactam to protect it; clavulanate is so moisture-sensitive that its tablets are foil-packed, often with a desiccant ([[packaging]]). Every course selects resistant organisms, in the infection and in the gut flora, so the most important decisions are whether to use an antibiotic at all, which one, and for how long (see [[antimicrobial-stewardship]] and [[biology:antibiotic-resistance|antibiotic resistance]]).

> [!warn] Antibiotics do nothing against colds, flu or other viral infections. Use them only when prescribed and as prescribed; do not share them or keep leftovers. Swelling of the face or throat, difficulty breathing or a spreading rash after a dose needs your local emergency number; severe or bloody diarrhoea during or after a course needs prompt medical advice.
`,
  ideas: [
    'Selective toxicity: antibiotics target structures bacteria have and human cells lack or have in a different form.',
    'The strained β-lactam ring is both the source of activity and of instability in water — hence dry powders and short in-use lives.',
    'Polar aminoglycosides and vancomycin are not absorbed orally; chelating tetracyclines and quinolones lose absorption with calcium, iron or antacids.',
    'β-lactams kill in a time-dependent way (fT>MIC); aminoglycosides and quinolones in a concentration-dependent way (Cmax/MIC, AUC/MIC).',
    'Resistance comes from destroying, altering, excluding or pumping out the drug; β-lactamase inhibitors protect β-lactams from the first.'
  ],
  pitfalls: [
    'A higher concentration always kills faster — For β-lactams killing saturates at about four times the MIC; what counts is how long the free level stays above the MIC, not how high it peaks.',
    'Resistance develops in the patient\'s body, which becomes "immune" to the antibiotic — It is the bacteria that become resistant, by mutation or by acquiring genes, and resistant bacteria spread between people.',
    'An antibiotic suspension keeps as long as the dry powder — Once reconstituted, the β-lactam hydrolyses in water; the in-use life is days, not the powder\'s years.'
  ],
  formulas: [
    {
      name: 'Time above the MIC after an intravenous dose',
      expr: 'fT = t12*log2(Cmax/MIC)/tau',
      tex: 'f_{T>\\mathrm{MIC}} = \\dfrac{t_{1/2}\\,\\log_2\\left(C_\\text{max}/\\mathrm{MIC}\\right)}{\\tau}',
      vars: {
        fT: { name: 'fraction of the dosing interval above the MIC', q: 'ratio', unit: '%', tex: 'f_{T>\\mathrm{MIC}}' },
        t12: { name: 'elimination half-life', q: 'time', unit: 'h', value: 1, tex: 't_{1/2}' },
        Cmax: { name: 'free (unbound) peak concentration', q: 'massconc', unit: 'mg/L', value: 32, tex: 'C_\\text{max}' },
        MIC: { name: 'minimum inhibitory concentration', q: 'massconc', unit: 'mg/L', value: 2, tex: '\\mathrm{MIC}' },
        tau: { name: 'dosing interval', q: 'time', unit: 'h', value: 8, tex: '\\tau' }
      },
      note: 'One-compartment model after a bolus, using free concentrations: each half-life halves the level, so the time above the MIC is t½ × log₂(Cmax/MIC). A result above 100 % means the level never falls below the MIC. Hypothetical values.',
      practice: { unknowns: ['fT', 'Cmax', 'tau'] },
      stories: {
        fT: 'A hypothetical β-lactam reaches a free peak of {Cmax}, has a half-life of {t12} and is given every {tau}. The MIC of the bacterium is {MIC}. For what fraction of the interval is the free level above the MIC?',
        tau: 'A hypothetical antibiotic (free peak {Cmax}, half-life {t12}) must stay above an MIC of {MIC} for {fT} of the interval. What is the longest dosing interval?'
      }
    },
    {
      name: 'Chance that a resistant mutant is already present',
      expr: 'P = 1 - exp(-N*f)',
      tex: 'P = 1 - e^{-N f}',
      vars: {
        P: { name: 'probability of at least one resistant cell', q: 'ratio', unit: '%' },
        N: { name: 'number of bacteria in the infection', value: 1e8 },
        f: { name: 'frequency of resistant mutants per cell', value: 1e-8 }
      },
      note: 'Resistant mutants arise at random, so their number is Poisson-distributed with mean N·f. With two drugs and independent mutations, the frequency of a double mutant is the product of the two frequencies.',
      practice: { unknowns: ['P', 'N'] },
      stories: {
        P: 'An infection holds {N} bacteria, and resistance to one drug arises at a frequency of {f} per cell. What is the chance that a resistant cell is already there before treatment starts?',
        N: 'Resistance arises at {f} per cell. How large a population makes the chance of a pre-existing resistant cell {P}?'
      }
    }
  ],
  examples: [
    {
      title: 'Time above the MIC',
      q: 'A hypothetical β-lactam reaches a free peak of 32 mg/L and has a half-life of 1 h. Against a bacterium with an MIC of 2 mg/L, what is $fT_{>\\mathrm{MIC}}$ when given every 8 h? Every 12 h? And against an MIC of 8 mg/L every 8 h?',
      steps: [
        '$32 \\to 16 \\to 8 \\to 4 \\to 2$ mg/L: four half-lives, so the level is above 2 mg/L for 4 h.',
        'Every 8 h: $4/8 = 50$ %. Every 12 h: $4/12 = 33$ % — the same drug, the same daily amount per dose, now below a typical 40–50 % target.',
        'MIC 8 mg/L: $\\log_2(32/8) = 2$ half-lives = 2 h, so $2/8 = 25$ %.',
        'For a time-dependent drug, more frequent dosing or a prolonged infusion raises fT>MIC more than a larger dose: doubling the peak adds only one half-life above the MIC.'
      ],
      a: '50 %, 33 % and 25 %: the interval and the MIC matter more than the peak.'
    },
    {
      title: 'Why tuberculosis is treated with several drugs',
      q: 'A lung cavity may hold about $10^8$ bacilli. Resistant mutants arise at about $10^{-6}$ per cell for one drug and $10^{-8}$ for another. What is the chance that resistant bacilli already exist to each drug alone, and to both at once?',
      steps: [
        'First drug: mean number of resistant cells $N f = 10^8 \\times 10^{-6} = 100$, so $P = 1 - e^{-100} \\approx 1$: resistant bacilli are certainly there.',
        'Second drug: $N f = 1$, so $P = 1 - e^{-1} = 63$ %.',
        'Both: $f = 10^{-6} \\times 10^{-8} = 10^{-14}$, $N f = 10^{-6}$, so $P \\approx 10^{-6}$.',
        'Either drug alone would select a resistant population; together they kill every cell that is resistant to only one. The same arithmetic underlies combination therapy for HIV (see [[antivirals]]).'
      ],
      a: 'Near certainty for one drug, 63 % for the other, about one in a million for both together.'
    }
  ],
  quiz: [
    { q: 'The strain in the four-membered β-lactam ring is responsible for…', choices: ['its binding to DNA gyrase', 'its reactivity with the transpeptidase serine — and with water, which limits its stability in solution', 'its chelation of calcium', 'its toxicity to the inner ear'], a: 1, why: 'The strained amide acylates the enzyme\'s serine; water attacks it too, so β-lactams hydrolyse in solution and are supplied as dry powders.' },
    { q: 'Why are aminoglycosides not given as tablets for infections in the blood?', choices: ['they are destroyed by stomach acid', 'they are polycations: less than 1 % is absorbed from the gut', 'they taste too bitter', 'food inactivates them'], a: 1, why: 'Highly polar, permanently charged molecules do not cross the gut wall; they are injected, inhaled or used locally.' },
    { q: 'For a time-dependent antibiotic, which change raises fT>MIC most for the same total daily amount?', choices: ['one large dose a day', 'splitting it into more frequent doses, or a prolonged infusion', 'a higher peak with the same interval', 'taking it with food'], a: 1, why: 'Each doubling of the peak adds only one half-life above the MIC, while frequent dosing or infusion keeps the level above the MIC for more of the day.' },
    { q: 'Taking a tetracycline with milk improves its absorption because calcium buffers stomach acid.', a: false, why: 'Calcium (and magnesium, aluminium, iron) chelates tetracyclines and fluoroquinolones, forming complexes that are poorly absorbed.' },
    { q: 'A hypothetical antibiotic has a free peak of 16 mg/L and a half-life of 2 h; the MIC is 1 mg/L. For how many hours is the free level above the MIC?', answer: 8, unit: 'h', why: '16 → 1 mg/L is log₂16 = 4 half-lives = 8 h.' }
  ],
  problems: [
    { q: 'A hypothetical antibiotic reaches a free peak of 48 mg/L, has a half-life of 1.5 h and is given every 8 h. The MIC is 4 mg/L. What percentage of the interval is spent above the MIC?', answer: 67.2, unit: '%', tol: 0.02, steps: ['Half-lives above the MIC: $\\log_2(48/4) = \\log_2 12 = 3.585$.', 'Time: $3.585 \\times 1.5 = 5.38$ h.', '$5.38/8 = 67.2$ %.'] },
    { q: 'Resistance to a drug arises at a frequency of $10^{-7}$ per cell. What is the chance (in %) that a population of $5 \\times 10^7$ bacteria already contains a resistant cell?', answer: 99.3, unit: '%', tol: 0.01, steps: ['$N f = 5\\times10^7 \\times 10^{-7} = 5$.', '$P = 1 - e^{-5} = 0.993$ = 99.3 %.'] }
  ],
  applications: [
    'Dry powders for oral suspension and for injection, with short in-use lives after reconstitution.',
    'Once-daily aminoglycosides and prolonged or continuous β-lactam infusions guided by PK/PD targets.',
    'β-lactam/β-lactamase-inhibitor combinations and their moisture-protective packaging.',
    'Multi-drug regimens for tuberculosis that make pre-existing resistance vanishingly unlikely.'
  ],
  history: 'Paul Ehrlich\'s arsphenamine (1910) was the first designed antimicrobial, and Gerhard Domagk\'s sulfonamide dye Prontosil (1935) turned out to be a prodrug of sulfanilamide. Alexander Fleming noticed penicillin in 1928; Howard Florey, Ernst Chain and Norman Heatley made it a medicine in 1940–41, and deep-tank fermentation during the Second World War made it plentiful. Dorothy Hodgkin solved its structure, with the β-lactam ring, by X-ray crystallography in 1945.',
  sim: ['class-timekill', 'class-betalactamase']
},

{
  id: 'antivirals', parent: 'classes-topic', title: 'Antivirals', level: 2,
  short: 'Viruses replicate with the host cell\'s machinery, so antivirals aim at the few steps only the virus performs — its polymerase, protease, integrase or neuraminidase. Many are nucleoside analogues that need prodrug chemistry to be absorbed and activated; fast-mutating viruses need combinations; and long-acting depots now replace daily tablets.',
  keywords: ['antiviral', 'nucleoside analogue', 'nucleotide analogue', 'aciclovir', 'acyclovir', 'valaciclovir', 'PEPT1', 'tenofovir', 'ProTide', 'prodrug', 'reverse transcriptase', 'protease inhibitor', 'integrase inhibitor', 'neuraminidase inhibitor', 'oseltamivir', 'zanamivir', 'HIV', 'hepatitis C', 'combination therapy', 'ritonavir boosting', 'cobicistat', 'long-acting injectable', 'nanosuspension', 'mutation rate'],
  prereq: ['antimicrobials', 'first-pass', 'biology:viruses'],
  related: ['drug-interactions', 'depot-implants', 'membrane-transport-pharm', 'bioavailability', 'complexation', 'medicine:hiv', 'medicine:influenza-covid', 'biology:mutations', 'math:exponential-models'],
  body: `
Viruses are harder targets than bacteria: they have no metabolism of their own and copy themselves inside our cells with our machinery. Antivirals therefore aim at the few steps that only the virus performs — **attachment and fusion, uncoating, copying its genome with a viral polymerase or reverse transcriptase, integrating into the host genome, cutting its polyproteins with a viral protease, and budding off**. Most antivirals stop replication rather than kill; the immune system clears infected cells, and for infections that hide in latent form, such as HIV, treatment continues for life.

### Nucleoside analogues and the prodrug problem
Many antivirals are **nucleoside or nucleotide analogues**: counterfeit building blocks that the viral polymerase incorporates, ending the chain or seeding lethal mutations. To act they must be phosphorylated inside the cell to the triphosphate. Aciclovir shows how selectivity can come from activation: its first phosphorylation is done by the **herpesvirus thymidine kinase**, so the active drug is made mainly in infected cells. But aciclovir is polar and only 15–30 % absorbed. Its **L-valyl ester**, valaciclovir, is carried across the gut wall by the peptide transporter PEPT1 and hydrolysed to aciclovir in the gut wall and liver, raising bioavailability to about 55 % (see [[membrane-transport-pharm]]).

Nucleotide analogues carry a phosphonate or phosphate that is doubly charged at gut pH, so the charge must be masked. **Tenofovir disoproxil** (two carbonate esters) is hydrolysed largely in the blood. **Tenofovir alafenamide**, a phosphonamidate "ProTide", stays intact in plasma and is activated inside lymphocytes and liver cells: more drug reaches the target while plasma tenofovir falls by about 90 %, with less effect on kidney and bone. Remdesivir, another ProTide, is poorly absorbed and heavily extracted by the liver, so it is infused — solubilised with a sulfobutylether-β-cyclodextrin ([[complexation]]). Oseltamivir, a neuraminidase inhibitor for influenza, is an ethyl ester activated by liver carboxylesterase; its relative zanamivir is so polar that only about 2 % would be absorbed, so it is inhaled as a dry powder.

### Mutation and combinations
RNA viruses and retroviruses copy carelessly. HIV's reverse transcriptase makes roughly one error per 30 000 bases ($3\\times10^{-5}$), and an untreated person produces around $10^{10}$ new virions a day — so **every possible single point mutation arises every day**. One drug selects resistant virus within weeks, as the early monotherapies showed. Three active drugs that need different mutations are almost never all defeated by virus already present; that arithmetic is why **combination antiretroviral therapy** (from 1996) turned HIV into a manageable condition. Hepatitis C shows the other outcome: combinations of direct-acting antivirals (NS3/4A protease, NS5A and NS5B polymerase inhibitors) cure more than 95 % of people in 8–12 weeks, because HCV has no latent reservoir.

### Boosting and interactions
Protease inhibitors are heavily metabolised by CYP3A4 and pumped out by P-glycoprotein. A low dose of **ritonavir** or **cobicistat** — strong CYP3A4 inhibitors with no useful antiviral effect at that dose — raises the partner drug's levels and lengthens its half-life; nirmatrelvir with ritonavir for COVID-19 (2021) uses the same trick. The price is a long list of interactions with other CYP3A4 substrates ([[drug-interactions]]). **Integrase inhibitors** bind two magnesium ions in the enzyme's active site, and the same chemistry makes them chelate calcium, magnesium, aluminium and iron in the gut, so antacids and mineral supplements reduce their absorption.

| Class | Target | Formulation point |
|---|---|---|
| Nucleos(t)ide reverse-transcriptase inhibitors | HIV and hepatitis B polymerase | prodrugs mask polarity; intracellular triphosphates last long |
| Non-nucleoside RT inhibitors | allosteric pocket of HIV RT | very lipophilic, poorly soluble; food and acid affect absorption |
| Protease inhibitors | HIV or HCV protease | CYP3A4 substrates, boosted |
| Integrase inhibitors | HIV integrase | chelate polyvalent cations |
| Neuraminidase inhibitors | influenza release | oral prodrug, or inhaled powder |
| Polymerase inhibitors | herpes, HCV, SARS-CoV-2 | activation by viral or host kinases |

### Long-acting formulations
Adherence is the weak point of lifelong therapy. Poorly water-soluble antiretrovirals make good **depots**: cabotegravir and rilpivirine as aqueous **nanosuspensions** injected into the gluteal muscle every one or two months, and lenacapavir, a capsid inhibitor, injected under the skin twice a year (approved for treatment in 2022 and, at the time of writing, for HIV prevention in 2025). The depot dissolves slowly, so absorption, not elimination, sets the apparent half-life — flip-flop kinetics ([[depot-implants]]). The long tail after the last injection is the formulation's hazard: months of low, falling levels during which a returning virus could become resistant, which is why stopping is planned with the prescriber.

> [!note] Each antiviral works against particular viruses; none works against all, and antibiotics do not work against viruses at all. Questions about starting, stopping or changing an antiviral belong with the prescriber or a pharmacist.
`,
  ideas: [
    'Antivirals target steps only the virus performs; most suppress replication rather than kill.',
    'Nucleoside analogues must be phosphorylated to act; aciclovir\'s activation by viral thymidine kinase gives it selectivity.',
    'Ester, amino-acid and phosphonamidate prodrugs (valaciclovir, oseltamivir, tenofovir) solve poor absorption or deliver drug into target cells.',
    'With about 10¹⁰ virions a day and an error rate of 3 × 10⁻⁵, every single mutant of HIV exists daily — only combinations prevent resistance.',
    'Low-dose ritonavir or cobicistat boost other drugs by inhibiting CYP3A4; long-acting nanosuspensions replace daily tablets.'
  ],
  pitfalls: [
    'A prodrug is a weaker version of the drug — A prodrug is a transport form: it is converted to the same active drug, often delivering more of it to the right place.',
    'Resistance to one antiviral means the others fail too — Resistance is specific to the mutations a drug selects; combinations work precisely because a virus rarely carries all the resistance mutations at once, although some mutations do cause cross-resistance within a class.',
    'Ritonavir in a combination is there to fight the virus — At the low doses used for boosting its job is to inhibit CYP3A4 and raise the partner drug\'s levels.'
  ],
  formulas: [
    {
      name: 'Virions carrying a set of point mutations',
      expr: 'M = N*mu^n', tex: 'M = N\\,\\mu^{n}',
      vars: {
        M: { name: 'expected new virions a day carrying all n mutations' },
        N: { name: 'new virions produced a day', value: 1e10 },
        mu: { name: 'error rate per base per copy', value: 3e-5, tex: '\\mu' },
        n: { name: 'number of specific point mutations needed', value: 2, int: true, min: 1, max: 6 }
      },
      note: 'Order-of-magnitude reasoning: independent mutations each at rate μ per copy, ignoring fitness costs and how many virions really start new cycles. Each extra required mutation divides the number by about 30 000.',
      practice: { unknowns: ['M', 'N'] },
      stories: {
        M: 'A person produces {N} virions a day and the polymerase errs at {mu} per base. How many virions a day carry a particular set of {n} point mutations?',
        N: 'How many virions a day must be made for {M} of them to carry a given set of {n} mutations, at an error rate of {mu}?'
      }
    },
    {
      name: 'First-phase fall of viral load on treatment',
      expr: 'V = V0*exp(-d*t)', tex: 'V = V_0\\,e^{-d\\,t}',
      vars: {
        V: { name: 'viral load', q: false, unit: 'copies/mL' },
        V0: { name: 'viral load at the start', q: false, unit: 'copies/mL', value: 100000, tex: 'V_0' },
        d: { name: 'decay rate (loss of productively infected cells)', q: false, unit: '1/day', value: 0.35 },
        t: { name: 'time on treatment', q: false, unit: 'day', value: 14 }
      },
      note: 'Once new infection is blocked, free virus is cleared within hours and the load follows the death of infected cells (half-life about 1–2 days); a slower second phase follows. Illustrative values.',
      practice: { unknowns: ['V', 'd', 't'] },
      stories: {
        V: 'Treatment starts at {V0}; the load falls with a rate constant of {d}. What is it after {t}?',
        d: 'The viral load falls from {V0} to {V} in {t}. What is the decay rate constant?'
      }
    }
  ],
  examples: [
    {
      title: 'Why HIV needs three drugs',
      q: 'An untreated person makes $10^{10}$ virions a day with an error rate of $3\\times10^{-5}$ per base. How many virions a day carry one given point mutation, a given pair, and a given triple?',
      steps: [
        'One: $10^{10} \\times 3\\times10^{-5} = 3\\times10^{5}$ a day — every single resistance mutation exists every day.',
        'Two: $10^{10} \\times (3\\times10^{-5})^2 = 9$ a day.',
        'Three: $10^{10} \\times (3\\times10^{-5})^3 = 2.7\\times10^{-4}$ a day — about one every 3700 days, ten years, and it would also have to be fit enough to grow.',
        'Once treatment suppresses replication, far fewer copies are made, and the chance of new resistance falls further.'
      ],
      a: '300 000, 9 and 0.00027 a day: a single drug is certain to fail, three together almost never meet a pre-existing triple mutant.'
    },
    {
      title: 'What a prodrug buys',
      q: 'Aciclovir is about 20 % absorbed; its valine ester valaciclovir delivers about 55 % of the dose to the blood as aciclovir. Per mole taken, how much more aciclovir reaches the circulation?',
      steps: [
        'Ratio of bioavailabilities: $0.55/0.20 = 2.75$.',
        'The ester borrows the peptide transporter PEPT1, which normally carries di- and tripeptides from food, and is then cut by esterases.',
        'The same systemic exposure can be reached with fewer tablets a day — a formulation gain that improves adherence.'
      ],
      a: 'About 2.75 times as much aciclovir per mole.'
    }
  ],
  quiz: [
    { q: 'Aciclovir is selective for herpes-infected cells mainly because…', choices: ['it cannot enter uninfected cells', 'its first phosphorylation needs the viral thymidine kinase', 'human polymerases ignore all nucleosides', 'it binds the virus outside cells'], a: 1, why: 'Only infected cells turn much aciclovir into its monophosphate; host kinases then complete the triphosphate, which the viral polymerase prefers.' },
    { q: 'Why is a low dose of ritonavir added to some protease inhibitors?', choices: ['to add a fourth antiviral action', 'to inhibit CYP3A4 (and P-glycoprotein), raising and prolonging the partner drug\'s levels', 'to reduce stomach upset', 'to prevent chelation'], a: 1, why: 'At boosting doses ritonavir is a pharmacokinetic enhancer; the same inhibition causes many interactions.' },
    { q: 'The phosphonate group of a nucleotide analogue helps it cross the gut wall.', a: false, why: 'The phosphonate is doubly charged at gut pH and blocks passive absorption; prodrugs mask it with esters or amidates.' },
    { q: 'With $10^{10}$ virions a day and an error rate of $3\\times10^{-5}$ per base, how many virions a day carry one particular point mutation?', answer: 3e5, why: '10¹⁰ × 3 × 10⁻⁵ = 3 × 10⁵.' },
    { q: 'Zanamivir is inhaled rather than swallowed because…', choices: ['it is destroyed by stomach acid', 'it is very polar and only about 2 % would be absorbed from the gut', 'it acts only in the nose', 'it is too bitter'], a: 1, why: 'Its guanidine and carboxylate groups keep it charged; delivering it to the airways, where influenza replicates, avoids the absorption problem.' }
  ],
  problems: [
    { q: 'On treatment the viral load falls from 200 000 to 2 000 copies/mL in 12 days, as a single exponential. What is the decay rate constant (per day)?', answer: 0.384, tol: 0.02, steps: ['$d = \\ln(V_0/V)/t = \\ln(100)/12$.', '$= 4.605/12 = 0.384$ per day, an infected-cell half-life of 1.8 days.'] },
    { q: 'How many virions a day would carry a given set of two mutations if $2\\times10^{9}$ virions are made daily and the error rate is $3\\times10^{-5}$?', answer: 1.8, tol: 0.02, steps: ['$2\\times10^9 \\times (3\\times10^{-5})^2 = 2\\times10^9 \\times 9\\times10^{-10} = 1.8$.'] }
  ],
  applications: [
    'Prodrugs that make antivirals orally useful (valaciclovir, oseltamivir, tenofovir prodrugs).',
    'Fixed-dose combination tablets that make three-drug HIV therapy a single tablet a day.',
    'Long-acting injectable nanosuspensions for HIV treatment and prevention.',
    'Interaction checking for boosted regimens and chelating integrase inhibitors.'
  ],
  history: 'Gertrude Elion\'s group at Burroughs Wellcome made aciclovir in the mid-1970s, and she shared the 1988 Nobel Prize with George Hitchings and James Black. Zidovudine, the first HIV drug, was approved in 1987; triple therapy with protease inhibitors arrived in 1995–96, and AIDS deaths in many countries fell by more than half within two years.',
  sim: { id: 'class-depot', params: { mode: 'av', reg: 'm2', tabs: 40, stop: true } }
},

{
  id: 'cardiovascular-drugs', parent: 'classes-topic', title: 'Heart and blood-pressure medicines', level: 2,
  short: 'Cardiovascular medicines lower blood pressure, protect failing hearts, prevent clots and lower cholesterol, and many are taken daily for decades. Their pharmaceutics is about once-daily profiles, prodrugs, first-pass metabolism and light- or moisture-sensitive molecules; their risks come from narrow margins and interactions.',
  keywords: ['cardiovascular', 'antihypertensive', 'ACE inhibitor', 'angiotensin receptor blocker', 'beta-blocker', 'calcium-channel blocker', 'amlodipine', 'nifedipine', 'diuretic', 'furosemide', 'nitrate', 'glyceryl trinitrate', 'sublingual', 'antiplatelet', 'clopidogrel', 'anticoagulant', 'warfarin', 'heparin', 'DOAC', 'dabigatran', 'statin', 'HMG-CoA reductase', 'LDL receptor', 'digoxin', 'amiodarone', 'accumulation'],
  prereq: ['receptors', 'first-pass', 'medicine:hypertension', 'medicine:cholesterol-lipids'],
  related: ['analgesics', 'pharmacogenomics', 'drug-interactions', 'therapeutic-index', 'modified-release', 'osmotic-pumps', 'photostability', 'multiple-dosing', 'protein-binding', 'biology:enzyme-inhibition', 'medicine:hemostasis', 'medicine:heart-failure'],
  body: `
Cardiovascular medicines are the most prescribed in the world, and many are taken every day for decades — so the pharmaceutical priorities are a smooth once-daily profile, predictable absorption, and freedom from interactions. The pharmacology maps onto the physiology: blood pressure is cardiac output times vascular resistance, so drugs slow the heart, widen vessels or reduce blood volume ([[medicine:hypertension|hypertension]]).

### Blood pressure and heart failure
| Class | Mechanism | Pharmaceutical notes |
|---|---|---|
| ACE inhibitors (-pril) | block angiotensin-converting enzyme: less angiotensin II and aldosterone; more bradykinin (cough, rarely angio-oedema) | most are ester prodrugs (enalapril → enalaprilat) to allow oral absorption; lisinopril is not |
| Angiotensin receptor blockers (-sartan) | block AT₁ receptors | an acidic tetrazole replaces a carboxylic acid; losartan's metabolite is the more active |
| β-blockers (-olol) | block β₁ (heart) and β₂ receptors | lipophilic propranolol: high first pass, enters the brain; hydrophilic atenolol: renal excretion, fewer CNS effects |
| Calcium-channel blockers | dihydropyridines (amlodipine, nifedipine) relax arteries; verapamil and diltiazem slow the heart | nifedipine is light-sensitive and short-lived: opaque capsules and osmotic or matrix modified-release tablets; amlodipine's 30–50 h half-life gives smooth once-daily control |
| Diuretics | thiazides block NaCl reabsorption in the distal tubule; loop diuretics the Na–K–2Cl co-transporter | they act from inside the tubule and must be secreted into it; oral furosemide absorption varies from about 10 to 90 % |
| Nitrates | release nitric oxide: veins and coronary arteries dilate | glyceryl trinitrate under the tongue bypasses first-pass metabolism and acts within minutes; it is volatile and absorbed by some plastics, so tablets are kept in glass; tolerance needs a nitrate-free interval |

### Clots: antiplatelets and anticoagulants
- **Aspirin** blocks platelet COX-1 irreversibly (see [[analgesics]]). **Clopidogrel** is a prodrug: about 85 % is hydrolysed by esterases to an inactive acid and the rest is activated, largely by CYP2C19, to a thiol that blocks the P2Y₁₂ receptor for the platelet's life — so poor CYP2C19 metabolisers get less protection ([[pharmacogenomics]]).
- **Warfarin** blocks vitamin K epoxide reductase (VKORC1), so new clotting factors II, VII, IX and X are made inactive. It is 99 % bound to albumin, a racemate whose more potent S-enantiomer is cleared by CYP2C9, and has a narrow range monitored by the INR, with many drug and food interactions. Its effect lags by days because existing factors must first be cleared — prothrombin's half-life is about 60 hours.
- **Heparins** are large polyanions, not absorbed from the gut: unfractionated heparin is infused and monitored, low-molecular-weight heparins are injected under the skin.
- **Direct oral anticoagulants** block factor Xa (apixaban, rivaroxaban, edoxaban) or thrombin (dabigatran) with predictable effect. Dabigatran etexilate is a double prodrug so poorly soluble at neutral pH that its capsules contain pellets built around a tartaric-acid core, creating an acidic micro-environment for dissolution; the capsules are moisture-sensitive and must not be opened, which would change the amount absorbed.

### Lipids: statins
Statins inhibit **HMG-CoA reductase**, the rate-limiting enzyme of cholesterol synthesis, competitively and with nanomolar affinity: their dihydroxy-acid side chain mimics the enzyme's mevaldyl intermediate. Less cholesterol inside liver cells activates the transcription factor SREBP-2, which makes more **LDL receptors**, which pull LDL out of the blood — so a drug acting on synthesis lowers LDL-cholesterol by 30–50 % or more. The liver is both target and main site of uptake (by the transporter OATP1B1); high hepatic extraction is an advantage, since less drug reaches muscle. Simvastatin and lovastatin are inactive **lactone prodrugs** opened to the acid in the body; they and atorvastatin are CYP3A4 substrates, so strong CYP3A4 inhibitors raise their levels — and the risk of muscle damage — many-fold, while pravastatin and rosuvastatin avoid CYP3A4. A common *SLCO1B1* variant that weakens OATP1B1 also raises muscle exposure. Short-half-life statins (simvastatin, about 2 h) were given in the evening because cholesterol synthesis peaks at night; atorvastatin and rosuvastatin (14–20 h) work at any time. The dose–response is flat: each doubling of the dose lowers LDL by only about 6 more percentage points.

### Narrow margins
**Digoxin** has a narrow range, is cleared by the kidney and pumped by P-glycoprotein, so kidney decline, verapamil, amiodarone or clarithromycin can make it toxic. **Amiodarone** is iodinated and extremely lipophilic, with a volume of distribution of tens of litres per kilogram and a half-life of about 50 days: its effects and interactions persist for months after it is stopped.

> [!warn] Anticoagulants, digoxin and antiarrhythmics have a narrow margin between benefit and harm. Unusual bleeding, black stools, a very slow or irregular pulse, fainting, chest pain, or signs of a stroke (face drooping, arm weakness, speech difficulty) need your local emergency number. Do not stop or change heart medicines without advice from the prescriber or pharmacist.
`,
  ideas: [
    'Blood pressure = cardiac output × resistance: β-blockers, vasodilators and diuretics act on its terms.',
    'Many cardiovascular drugs are prodrugs (enalapril, clopidogrel, dabigatran etexilate, simvastatin), so enzymes and genotypes matter.',
    'Long half-lives (amlodipine) or modified-release forms (nifedipine) give smooth once-daily control; sublingual nitrates bypass the liver.',
    'Statins inhibit HMG-CoA reductase competitively; LDL falls because liver cells up-regulate LDL receptors.',
    'Warfarin, digoxin and amiodarone have narrow margins and many interactions.'
  ],
  pitfalls: [
    'Doubling a statin dose doubles its cholesterol-lowering effect — The dose–response is flat: each doubling adds only about 6 percentage points of LDL reduction, while exposure (and muscle risk) doubles.',
    'Warfarin works as soon as it is absorbed — It stops the making of new clotting factors; the existing ones must decay first, which takes days.',
    'All statins interact with the same drugs — Simvastatin, lovastatin and atorvastatin depend on CYP3A4; pravastatin and rosuvastatin do not, although transporter interactions can affect them.'
  ],
  formulas: [
    {
      name: 'Enzyme activity left with a competitive inhibitor (a statin)',
      expr: 'r = (Km + S)/(Km*(1 + I/Ki) + S)',
      tex: 'r = \\dfrac{K_m + \\mathrm{[S]}}{K_m\\left(1 + \\mathrm{[I]}/K_i\\right) + \\mathrm{[S]}}',
      vars: {
        r: { name: 'rate as a fraction of the uninhibited rate', q: 'ratio', unit: '%' },
        Km: { name: 'Michaelis constant for HMG-CoA', q: 'concentration', unit: 'µM', value: 4, tex: 'K_m' },
        S: { name: 'HMG-CoA concentration', q: 'concentration', unit: 'µM', value: 4, tex: '\\mathrm{[S]}' },
        I: { name: 'statin concentration at the enzyme', q: 'concentration', unit: 'nM', value: 3, tex: '\\mathrm{[I]}' },
        Ki: { name: 'inhibition constant', q: 'concentration', unit: 'nM', value: 1, tex: 'K_i' }
      },
      note: 'Michaelis–Menten kinetics with a competitive inhibitor, as a ratio to the rate without inhibitor at the same substrate level. The cell\'s feedback (more enzyme, more LDL receptors) comes on top. Illustrative values.',
      practice: { unknowns: ['r', 'I'] },
      stories: {
        r: 'HMG-CoA is at {S} (Km {Km}); a statin reaches {I} at the enzyme, with an inhibition constant of {Ki}. What fraction of the normal synthesis rate remains?',
        I: 'With HMG-CoA at {S} (Km {Km}) and Ki = {Ki}, what statin concentration cuts the rate to {r}?'
      }
    },
    {
      name: 'Accumulation with repeated doses',
      expr: 'Rac = 1/(1 - exp(-ln(2)*tau/t12))',
      tex: 'R_\\text{ac} = \\dfrac{1}{1 - e^{-\\ln 2\\,\\tau/t_{1/2}}}',
      vars: {
        Rac: { name: 'accumulation factor (steady state ÷ first dose)', tex: 'R_\\text{ac}' },
        tau: { name: 'dosing interval', q: 'time', unit: 'h', value: 24, tex: '\\tau' },
        t12: { name: 'elimination half-life', q: 'time', unit: 'h', value: 40, tex: 't_{1/2}' }
      },
      note: 'Linear kinetics, equal doses at equal intervals. The peak-to-trough ratio at steady state is exp(ln 2·τ/t½) for rapid absorption.',
      stories: { Rac: 'A drug with a half-life of {t12} is taken every {tau}. By what factor do its levels build up by steady state?', t12: 'Levels build up {Rac}-fold with a dose every {tau}. What is the half-life?' }
    }
  ],
  examples: [
    {
      title: 'A flat dose–response at the enzyme',
      q: 'HMG-CoA is at its Km, and a statin has $K_i$ = 1 nM. What concentration cuts synthesis to 25 %? To 10 %?',
      steps: [
        'With $\\mathrm{[S]} = K_m$: $r = 2/(2 + \\mathrm{[I]}/K_i)$.',
        '25 %: $2 + x = 8$, $x = 6$, so 6 nM. 10 %: $2 + x = 20$, $x = 18$, so 18 nM.',
        'Three times the concentration to go from 75 % to 90 % inhibition: the hyperbola flattens, which is one reason the clinical dose–response of statins is flat.'
      ],
      a: '6 nM and 18 nM.'
    },
    {
      title: 'Once daily: amlodipine against immediate-release nifedipine',
      q: 'Compare the accumulation and the steady-state peak-to-trough ratio of a drug with a 40 h half-life taken every 24 h, and of one with a 2 h half-life taken every 8 h (assume fast absorption).',
      steps: [
        '40 h: $k\\tau = 0.693 \\times 24/40 = 0.416$; $R_\\text{ac} = 1/(1 - e^{-0.416}) = 2.94$; peak/trough $= e^{0.416} = 1.52$.',
        '2 h every 8 h: four half-lives per interval: peak/trough $= 2^4 = 16$, and almost no accumulation ($R_\\text{ac} = 1.07$).',
        'The long half-life gives a steady effect; the short one would give swings of blood pressure and reflex tachycardia — so short-lived nifedipine is made as modified-release tablets.'
      ],
      a: 'Accumulation 2.9 with a peak/trough of 1.5, against 1.07 with a peak/trough of 16.'
    }
  ],
  quiz: [
    { q: 'Statins lower blood LDL-cholesterol mainly because…', choices: ['they bind LDL in the blood', 'less synthesis in liver cells up-regulates LDL receptors, which clear LDL from the blood', 'they block cholesterol absorption in the gut', 'they are excreted with cholesterol in bile'], a: 1, why: 'Inhibiting HMG-CoA reductase lowers hepatocyte cholesterol; SREBP-2 then raises LDL-receptor numbers.' },
    { q: 'Glyceryl trinitrate tablets for angina are placed under the tongue because…', choices: ['it tastes better', 'absorption through the mouth lining bypasses extensive first-pass metabolism and acts within minutes', 'it is destroyed by saliva if swallowed', 'the tongue has nitrate receptors'], a: 1, why: 'Swallowed, most glyceryl trinitrate is destroyed by the liver; sublingual blood drains straight into the systemic circulation.' },
    { q: 'Clopidogrel protects less in people who are poor CYP2C19 metabolisers.', a: true, why: 'Clopidogrel is a prodrug that needs CYP2C19 (among other enzymes) to form its active thiol.' },
    { q: 'A drug with a 24 h half-life is taken once a day. What is its accumulation factor?', answer: 2, why: '1/(1 − e^(−ln2)) = 1/(1 − 0.5) = 2.' },
    { q: 'Warfarin\'s anticoagulant effect takes several days to develop mainly because…', choices: ['it is absorbed slowly', 'existing clotting factors must first be cleared; prothrombin lasts about 60 h', 'it must be converted to an active metabolite', 'it binds albumin'], a: 1, why: 'Warfarin stops the activation of newly made factors; the effect appears as the old ones decay.' }
  ],
  problems: [
    { q: 'A drug has a half-life of 35 h and is taken every 24 h. What is its accumulation factor?', answer: 2.64, tol: 0.02, steps: ['$k\\tau = 0.693 \\times 24/35 = 0.475$.', '$R_\\text{ac} = 1/(1 - e^{-0.475}) = 1/(1 - 0.622) = 2.64$.'] },
    { q: 'HMG-CoA is at twice its Km and a statin has $K_i$ = 0.5 nM. What statin concentration (nM) halves the synthesis rate?', answer: 1.5, unit: 'nM', tol: 0.02, steps: ['With $\\mathrm{[S]} = 2K_m$: $r = 3/(3 + \\mathrm{[I]}/K_i)$.', '$r = 0.5$ gives $\\mathrm{[I]}/K_i = 3$, so $\\mathrm{[I]} = 1.5$ nM.'] }
  ],
  applications: [
    'Osmotic-pump and matrix modified-release forms of short-half-life calcium-channel blockers.',
    'Sublingual tablets and sprays of glyceryl trinitrate, kept in glass or sealed containers.',
    'Genotype information (CYP2C19, CYP2C9, VKORC1, SLCO1B1) in the labels of antiplatelets, warfarin and statins.',
    'Interaction checks for statins with CYP3A4 and OATP1B1 inhibitors.'
  ],
  history: 'Akira Endo isolated the first statin, mevastatin, from a Penicillium mould in 1973; lovastatin became the first marketed statin in 1987. Warfarin grew out of a bleeding disease of cattle fed spoiled sweet clover: Karl Paul Link\'s group isolated dicoumarol in 1940, and warfarin, named after the Wisconsin Alumni Research Foundation, was a rat poison before it became a medicine in the 1950s. James Black developed propranolol, the first widely used β-blocker, in 1964.',
  sim: 'class-statin'
},

{
  id: 'cns-drugs', parent: 'classes-topic', title: 'Medicines for the brain and mind', level: 2,
  short: 'Medicines for the brain must cross the blood–brain barrier, so they share a physicochemical profile — small, moderately lipophilic, few hydrogen-bond donors, often basic — that also brings extensive metabolism and interactions. Receptor occupancy, narrow therapeutic ranges, saturable kinetics, dependence and long-acting depots are the pharmaceutical themes.',
  keywords: ['CNS drugs', 'blood-brain barrier', 'P-glycoprotein', 'polar surface area', 'antidepressant', 'SSRI', 'antipsychotic', 'D2 receptor occupancy', 'PET', 'long-acting injectable', 'depot', 'benzodiazepine', 'GABA-A', 'antiepileptic', 'phenytoin', 'Michaelis–Menten', 'carbamazepine', 'auto-induction', 'lithium', 'levodopa', 'carbidopa', 'LAT1', 'dependence'],
  prereq: ['receptors', 'partition-logp', 'membrane-transport-pharm', 'medicine:synapses'],
  related: ['tolerance', 'nonlinear-pk', 'tdm', 'depot-implants', 'drug-interactions', 'pharmacogenomics', 'analgesics', 'therapeutic-index', 'medicine:depression', 'medicine:psychosis', 'medicine:epilepsy', 'medicine:parkinsons', 'medicine:mental-health-treatment'],
  body: `
Medicines for the brain face a barrier other medicines do not. Brain capillaries are sealed by tight junctions and lined with efflux pumps — above all **P-glycoprotein** — so only molecules that dissolve through the membrane and escape the pumps get in. Successful CNS drugs therefore share a profile: molecular weight below about 450, at most two or three hydrogen-bond donors, a polar surface area below roughly 70–90 Å², moderate lipophilicity (log D about 1–4) and often a basic amine (pKa 7.5–10). Chemists score candidates against these limits. The same lipophilicity gives CNS drugs large volumes of distribution, extensive CYP metabolism and many interactions (see [[partition-logp]]).

Sometimes a transporter does the work. **Levodopa**, the precursor of dopamine, is carried into the brain by the large neutral amino-acid transporter LAT1 — so a protein-rich meal competes with it — and is combined with carbidopa, a decarboxylase inhibitor that cannot itself enter the brain, so that less levodopa is turned into dopamine in the rest of the body.

### Families and their pharmacology
| Family | Target | Pharmaceutical and safety notes |
|---|---|---|
| SSRIs and related antidepressants | serotonin (and noradrenaline) reuptake transporters | benefit takes 2–6 weeks, far longer than the blockade — adaptive changes; fluoxetine and its active metabolite last weeks; fluoxetine and paroxetine inhibit CYP2D6; discontinuation symptoms after short-half-life drugs; serotonin toxicity with other serotonergic drugs |
| Antipsychotics | dopamine D₂ antagonists or partial agonists (many also 5-HT₂A) | effect at about 65–80 % D₂ occupancy; movement disorders and prolactin rise above about 80 %; long-acting injections |
| Benzodiazepines and "Z-drugs" | positive allosteric modulators of GABA$_A$ receptors | lipophilicity sets the onset; active metabolites (diazepam's lasts days); tolerance and dependence; dangerous combined with opioids or alcohol; flumazenil is an antagonist |
| Antiepileptics | sodium channels (carbamazepine, phenytoin, lamotrigine), GABA, SV2A (levetiracetam), calcium channels | narrow ranges; phenytoin's saturable metabolism; carbamazepine induces its own metabolism; enzyme inducers lower other drugs, including hormonal contraceptives; valproate carries a high risk to an unborn child |
| Lithium | several intracellular targets | a simple ion handled by the kidney like sodium; narrow range (about 0.4–1.0 mmol/L); dehydration, NSAIDs, thiazides and ACE inhibitors raise it; modified-release salts |
| Anti-Parkinson and anti-dementia | dopamine replacement; acetylcholinesterase inhibition | levodopa's 1.5 h half-life causes "wearing off" → modified-release forms, intestinal gel and subcutaneous infusion; rivastigmine as a patch |

### Occupancy and a narrow window
PET imaging measures receptor occupancy in the living brain. For antipsychotics it defined a strikingly narrow window: most people respond once about 65 % of striatal D₂ receptors are blocked, while above about 80 % parkinsonism, restlessness and raised prolactin become likely. Occupancy is a hyperbolic function of concentration, $\\theta = C/(C + EC_{50})$, so 65 % and 80 % lie only about twofold apart in concentration — which is why daily peaks and troughs, missed doses and interacting drugs matter.

**Long-acting injectables** answer both problems. Oily solutions of fatty-acid esters (haloperidol decanoate, fluphenazine decanoate) partition slowly out of the oil and are hydrolysed; aqueous **nanocrystal suspensions** of poorly soluble palmitate esters (paliperidone palmitate) dissolve over weeks, allowing injections every one, three or six months. Absorption is then slower than elimination — flip-flop kinetics — so the depot, not the body, sets the apparent half-life, and missed tablets are no longer possible ([[depot-implants]]).

### Saturable kinetics and induction
Phenytoin is metabolised by enzymes that saturate within the therapeutic range, so the steady-state level follows Michaelis–Menten kinetics, $C_\\text{ss} = K_m R/(V_\\text{max} - R)$: a small increase in dose rate can multiply the level ([[nonlinear-pk]]). Carbamazepine induces CYP3A4 and so its own clearance, which rises over the first weeks (**auto-induction**). Such drugs, together with lithium, are monitored by blood levels ([[tdm]]).

### Dependence and combinations
Many CNS medicines cause adaptation: stopping benzodiazepines, antidepressants, antiepileptics or antipsychotics suddenly can cause withdrawal, rebound or seizures, so changes are made gradually with the prescriber ([[tolerance]]). Depressants add up: benzodiazepines, opioids, alcohol, gabapentinoids and sedating antihistamines together depress breathing more than any alone.

> [!warn] Extreme drowsiness or unresponsiveness, slow or irregular breathing, confusion, a seizure, a very fast or irregular heartbeat, or a high temperature with muscle stiffness after a medicine need your local emergency number or poison centre at once. If you are struggling or thinking about harming yourself, help works: contact your local emergency number or a crisis line (988 in the US, Samaritans 116 123 in the UK and Ireland, ERAN 1201 in Israel).
`,
  ideas: [
    'CNS drugs must cross the blood–brain barrier: small, moderately lipophilic, few hydrogen-bond donors, low polar surface area, not a P-glycoprotein substrate.',
    'Transporters can carry drugs in: levodopa rides LAT1, and carbidopa stops it being wasted outside the brain.',
    'Antipsychotic response and side effects are separated by a narrow D₂-occupancy window (about 65–80 %), only twofold in concentration.',
    'Long-acting depots (oil solutions of esters, nanocrystal suspensions) give flip-flop kinetics and remove missed doses.',
    'Saturable metabolism (phenytoin), auto-induction (carbamazepine) and narrow ranges (lithium) make monitoring and slow changes essential.'
  ],
  pitfalls: [
    'Antidepressants work as soon as they block reuptake — The transporter is blocked within hours, but the benefit usually appears after 2–6 weeks, reflecting slower adaptive changes in the brain.',
    'Doubling the dose of any drug doubles its level — For saturable metabolism, as with phenytoin, the level can rise several-fold for a modest increase in dose rate.',
    'Physical dependence on a medicine means addiction — Dependence is a predictable adaptation that makes gradual reduction necessary; addiction is a distinct health condition of craving and loss of control.'
  ],
  formulas: [
    {
      name: 'Receptor occupancy',
      expr: 'occ = C/(C + EC50)', tex: '\\theta = \\dfrac{C}{C + \\mathrm{EC}_{50}}',
      vars: {
        occ: { name: 'receptor occupancy', q: 'ratio', unit: '%', tex: '\\theta' },
        C: { name: 'free plasma concentration', q: 'massconc', unit: 'ng/mL', value: 5 },
        EC50: { name: 'concentration giving 50 % occupancy', q: 'massconc', unit: 'ng/mL', value: 2, tex: '\\mathrm{EC}_{50}' }
      },
      note: 'Simple binding at equilibrium (Hill slope 1), with plasma standing in for the brain. PET studies fit this form to measured occupancies. Hypothetical values.',
      stories: {
        occ: 'A hypothetical antipsychotic is at {C}; its EC50 for D₂ occupancy is {EC50}. What occupancy does it give?',
        C: 'What concentration of a drug with EC50 {EC50} gives {occ} occupancy?'
      }
    },
    {
      name: 'Steady state with saturable (Michaelis–Menten) metabolism',
      expr: 'Css = Km*R/(Vmax - R)', tex: 'C_\\text{ss} = \\dfrac{K_m\\,R}{V_\\text{max} - R}',
      vars: {
        Css: { name: 'steady-state concentration', q: false, unit: 'mg/L', tex: 'C_\\text{ss}' },
        Km: { name: 'concentration at half-maximal metabolism', q: false, unit: 'mg/L', value: 4, tex: 'K_m' },
        R: { name: 'dose rate', q: false, unit: 'mg/day', value: 300 },
        Vmax: { name: 'maximum rate of metabolism', q: false, unit: 'mg/day', value: 500, tex: 'V_\\text{max}' }
      },
      note: 'For a hypothetical drug with phenytoin-like kinetics and complete absorption. As R approaches Vmax the level rises without limit — there is no steady state above Vmax. Real dosing follows the product information and blood-level monitoring.',
      practice: { unknowns: ['Css', 'R'] },
      stories: {
        Css: 'A hypothetical drug has Km = {Km} and Vmax = {Vmax}. What steady-state level does a dose rate of {R} give?',
        R: 'For Km = {Km} and Vmax = {Vmax}, what dose rate gives a steady state of {Css}?'
      }
    }
  ],
  examples: [
    {
      title: 'How narrow is the D₂ window?',
      q: 'Occupancy follows $\\theta = C/(C + EC_{50})$. What concentrations give 65 % and 80 % occupancy, and what is their ratio?',
      steps: [
        'Rearranged: $C = EC_{50}\\,\\theta/(1 - \\theta)$.',
        '65 %: $C = 0.65/0.35 = 1.86\\,EC_{50}$. 80 %: $C = 0.80/0.20 = 4.0\\,EC_{50}$.',
        'Ratio $4.0/1.86 = 2.15$.',
        'A tablet whose level halves between doses already spans most of this window each day; a missed dose or an enzyme-inhibiting drug moves the level out of it.'
      ],
      a: '1.86 and 4.0 × EC50 — barely more than twofold apart.'
    },
    {
      title: 'Saturable metabolism',
      q: 'A hypothetical drug has $K_m$ = 4 mg/L and $V_\\text{max}$ = 500 mg/day. Compare the steady-state levels at dose rates of 300 and 400 mg/day.',
      steps: [
        '300 mg/day: $C_\\text{ss} = 4 \\times 300/(500 - 300) = 6$ mg/L.',
        '400 mg/day: $C_\\text{ss} = 4 \\times 400/(500 - 400) = 16$ mg/L.',
        'A 33 % higher dose rate gives 2.7 times the level; the time to reach steady state lengthens too.'
      ],
      a: '6 mg/L against 16 mg/L — which is why such drugs are changed in small steps with level monitoring.'
    }
  ],
  quiz: [
    { q: 'Which property most helps a small molecule enter the brain?', choices: ['a permanent positive charge', 'being a P-glycoprotein substrate', 'moderate lipophilicity with few hydrogen-bond donors and a low polar surface area', 'a molecular weight above 800'], a: 2, why: 'Passive diffusion through the endothelial membranes needs these properties; charge, efflux and size keep drugs out.' },
    { q: 'Carbidopa is combined with levodopa because…', choices: ['it helps levodopa cross the blood–brain barrier', 'it blocks the conversion of levodopa to dopamine outside the brain and cannot itself enter the brain', 'it is a dopamine agonist', 'it slows levodopa\'s absorption'], a: 1, why: 'Peripheral decarboxylase inhibition means more levodopa reaches the brain and less dopamine causes nausea and other effects elsewhere.' },
    { q: 'For occupancy θ = C/(C + EC50), what multiple of EC50 gives 80 % occupancy?', answer: 4, why: 'C = EC50 × 0.8/0.2 = 4 EC50.' },
    { q: 'Doubling the dose rate of a drug with saturable metabolism doubles its steady-state level.', a: false, why: 'C_ss = K_m R/(V_max − R) rises much faster than R as R approaches V_max.' },
    { q: 'Why can a benzodiazepine combined with an opioid be dangerous even when each alone is at a usual dose?', choices: ['they compete for the same receptor', 'their depressant effects on breathing add up through different receptors', 'the benzodiazepine blocks opioid metabolism in all cases', 'they neutralise each other'], a: 1, why: 'GABA_A potentiation and μ-opioid agonism both depress the brainstem respiratory centre; together the effect is greater than either alone.' }
  ],
  problems: [
    { q: 'A hypothetical drug has $K_m$ = 5 mg/L and $V_\\text{max}$ = 600 mg/day. What dose rate (mg/day) gives a steady state of 10 mg/L?', answer: 400, tol: 0.02, steps: ['$R = C_\\text{ss} V_\\text{max}/(K_m + C_\\text{ss})$.', '$= 10 \\times 600/(5 + 10) = 400$ mg/day.'] },
    { q: 'What occupancy (in %) does a drug give at three times its EC50?', answer: 75, unit: '%', tol: 0.01, steps: ['$\\theta = 3/(3 + 1) = 0.75$.'] }
  ],
  applications: [
    'Designing CNS drug candidates within physicochemical limits (multiparameter scores).',
    'Long-acting injectable antipsychotics as oily ester solutions and nanocrystal suspensions.',
    'Blood-level monitoring of lithium, phenytoin and carbamazepine.',
    'Levodopa delivery: modified-release tablets, intestinal gel and subcutaneous infusion.'
  ],
  history: 'John Cade reported lithium\'s effect in mania in 1949; Jean Delay and Pierre Deniker introduced chlorpromazine to psychiatry in 1952, and imipramine followed in 1957. Arvid Carlsson showed in the late 1950s that dopamine is a transmitter and that levodopa reverses a drug-induced loss of movement in animals (Nobel Prize 2000). From the late 1980s PET studies, by Lars Farde and later Shitij Kapur and colleagues, defined the D₂ occupancy window.',
  sim: { id: 'class-depot', params: { mode: 'd2' } }
},

{
  id: 'diabetes-drugs', parent: 'classes-topic', title: 'Medicines for diabetes', level: 2,
  short: 'Diabetes medicines replace insulin or help the body use its own. Insulin formulations are a showcase of protein engineering — hexamers, crystals, precipitates and albumin binding set how fast it is absorbed — while metformin, SGLT2 inhibitors and GLP-1 agonists show how polarity, transporters and fatty-acid tails shape oral and weekly medicines.',
  keywords: ['insulin', 'hexamer', 'zinc', 'rapid-acting analogue', 'regular insulin', 'NPH', 'isophane', 'protamine', 'glargine', 'isoelectric point', 'detemir', 'degludec', 'icodec', 'insulin units', 'metformin', 'OCT1', 'sulfonylurea', 'KATP channel', 'DPP-4 inhibitor', 'SGLT2 inhibitor', 'glycosuria', 'GLP-1 receptor agonist', 'semaglutide', 'albumin binding', 'SNAC', 'hypoglycaemia'],
  prereq: ['routes', 'protein-binding', 'medicine:glucose-regulation'],
  related: ['biologics', 'biologics-formulation', 'medication-errors', 'modified-release', 'depot-implants', 'renal-adjustment', 'iv-infusion', 'shelf-life', 'medicine:type1-diabetes', 'medicine:type2-diabetes', 'medicine:hypoglycemia'],
  body: `
Diabetes medicines either replace insulin or help the body's own insulin work — and insulin itself is one of the best examples of formulation science, a protein whose absorption is tuned by changing a single amino acid, adding a fatty acid or letting it crystallise.

### Insulin: one hormone, many formulations
Insulin is a 51-amino-acid protein (5.8 kDa) of two chains joined by disulfide bonds. In the pancreas and in the vial it is stored as **hexamers**: six molecules around two zinc ions, stabilised by the phenolic preservatives (phenol, m-cresol) that also keep a multi-dose pen sterile. Only monomers and dimers pass easily through capillary walls, so an injection of soluble ("regular") human insulin must first dilute and dissociate under the skin — slower than the burst a healthy pancreas releases for a meal. Each modern insulin solves that problem in its own way:

| Insulin | Molecular trick | Profile (approximate, subcutaneous) |
|---|---|---|
| Rapid-acting analogues (lispro, aspart, glulisine) | amino-acid changes near the end of the B chain weaken self-association, so hexamers fall apart quickly | onset 10–20 min, peak 1–2 h, lasts 3–5 h |
| Regular (soluble) human insulin | zinc hexamers dissociate as the depot dilutes | onset 30–60 min, peak 2–4 h, lasts 6–8 h |
| NPH (isophane) | crystalline suspension with protamine; cloudy, resuspended gently before use | onset 1–2 h, peak 4–8 h, lasts 12–18 h |
| Glargine | two extra arginines raise the isoelectric point to about 6.7: a clear solution at pH 4 precipitates at body pH under the skin | fairly flat, about 24 h; not mixed with other insulins |
| Detemir, degludec | a fatty acid lets detemir bind albumin; degludec forms long multi-hexamer chains that shed monomers slowly | detemir up to 24 h; degludec beyond 42 h, half-life about 25 h |
| Icodec (weekly; approved in some regions from 2024) | strong, reversible albumin binding and slow receptor clearance | half-life about a week |

Insulin is also a stability problem. Heat and shaking at air–water interfaces unfold it into **amyloid fibrils**; freezing ruins suspensions. Unopened pens and vials are kept at 2–8 °C, the pen in use at room temperature for up to about four weeks ([[biologics-formulation]]). Strength is counted in **units** (one unit is about 6 nmol, 0.035 mg of human insulin); most products hold 100 units/mL, but 200-, 300- and 500-unit/mL forms exist, and confusing them is a classic medication error ([[medication-errors]]). The profile of a subcutaneous insulin also depends on the site, the depot's size and blood flow: warmth and exercise speed absorption, and larger depots of soluble insulin absorb more slowly.

### Tablets and other injections
- **Metformin** reduces glucose output by the liver. It is a strong base (pKa about 12, always ionised) that relies on organic cation transporters (OCT1 into liver cells) for uptake; its absorption is incomplete and saturable (bioavailability 50–60 %), it is not metabolised, and it is excreted unchanged by the kidney — so kidney function limits its use. Modified-release forms use swelling polymer matrices that stay in the stomach and release towards the upper intestine, where it is absorbed. Rarely, accumulation causes lactic acidosis.
- **Sulfonylureas** (gliclazide, glimepiride) close ATP-sensitive potassium channels on β-cells so insulin is released whatever the glucose level — hence hypoglycaemia, more likely with long-acting agents, in older people and in kidney disease.
- **DPP-4 inhibitors** (the gliptins) slow the breakdown of the gut hormone GLP-1.
- **SGLT2 inhibitors** (the gliflozins) block glucose reabsorption in the proximal tubule, so roughly 60–80 g of glucose a day leaves in the urine; they also protect heart and kidneys. Their risks follow the mechanism: genital infections and, rarely, ketoacidosis with near-normal glucose.
- **GLP-1 receptor agonists** are peptides engineered against the enzyme DPP-4 and against the kidney. Native GLP-1 lasts about two minutes; exenatide (from Gila monster saliva) 2.4 hours; liraglutide, with a C16 fatty acid that binds albumin, 13 hours (once daily); semaglutide, with a C18 fatty diacid and a DPP-4-resistant amino acid, about a week (once weekly). Oral semaglutide is co-formulated with an absorption enhancer (SNAC) that briefly buffers the pH around the dissolving tablet, shielding the peptide from pepsin and helping it across the stomach lining; even so, only about 1 % is absorbed, and only on an empty stomach with a little water. Tirzepatide (2022) activates both GIP and GLP-1 receptors.

> [!warn] Hypoglycaemia — shakiness, sweating, confusion, unusual behaviour, drowsiness — is the main acute danger of insulin and sulfonylureas. Severe hypoglycaemia (unable to swallow safely, unconscious or having a seizure) needs your local emergency number. Do not change or stop diabetes medicines without advice from the diabetes team or a pharmacist.
`,
  ideas: [
    'Insulin hexamers must dissociate to monomers before absorption; analogues change that rate by design.',
    'Crystals (NPH), precipitates (glargine), multi-hexamer chains (degludec) and albumin binding (detemir, icodec) make basal insulins.',
    'Insulin is heat- and agitation-sensitive and counted in units; concentrated strengths are an error risk.',
    'Metformin is a polar base moved by transporters and excreted unchanged by the kidney.',
    'SGLT2 inhibitors make the kidney excrete glucose; fatty-acid tails and albumin binding turn GLP-1 into once-weekly medicines.'
  ],
  pitfalls: [
    'A long-acting insulin is simply a more concentrated one — Basal insulins last longer because they are released slowly from a depot (crystals, precipitate, chains) or held on albumin, not because there is more of them.',
    'Cloudy insulin has gone off — NPH is a crystalline suspension and is meant to be cloudy once gently resuspended; it is clear insulins (rapid, regular, glargine) that should never be cloudy.',
    'SGLT2 inhibitors often cause hypoglycaemia on their own — The glucose they remove falls as blood glucose falls, because less is filtered; hypoglycaemia comes mainly with insulin or sulfonylureas.'
  ],
  formulas: [
    {
      name: 'Glucose lost in the urine with an SGLT2 inhibitor',
      expr: 'E = GFR*G - Tm', tex: 'E = \\mathrm{GFR}\\cdot G - T_m',
      vars: {
        E: { name: 'glucose excreted', q: false, unit: 'g/day' },
        GFR: { name: 'glomerular filtration rate', q: false, unit: 'L/day', value: 170, tex: '\\mathrm{GFR}' },
        G: { name: 'plasma glucose', q: false, unit: 'g/L', value: 1.5 },
        Tm: { name: 'remaining reabsorption capacity', q: false, unit: 'g/day', value: 185, tex: 'T_m' }
      },
      note: 'A threshold model, valid only when filtered glucose exceeds the reabsorption capacity. Healthy kidneys reabsorb about 500 g/day, so no glucose appears in the urine; an SGLT2 inhibitor lowers that capacity. 1.5 g/L = 150 mg/dL = 8.3 mmol/L. Illustrative values.',
      practice: { unknowns: ['E', 'Tm'] },
      stories: {
        E: 'Filtration is {GFR} and plasma glucose {G}; with an SGLT2 inhibitor the tubules can reabsorb only {Tm}. How much glucose is lost a day?',
        Tm: 'A person filtering {GFR} at a glucose of {G} loses {E} in the urine. What reabsorption capacity is left?'
      }
    },
    {
      name: 'Approach to steady state',
      expr: 'fss = 1 - exp(-ln(2)*t/t12)', tex: 'f_\\text{ss} = 1 - e^{-\\ln 2\\,t/t_{1/2}}',
      vars: {
        fss: { name: 'fraction of steady state reached', q: 'ratio', unit: '%', tex: 'f_\\text{ss}' },
        t: { name: 'time since the first dose', q: 'time', unit: 'wk', value: 4 },
        t12: { name: 'elimination half-life', q: 'time', unit: 'day', value: 7, tex: 't_{1/2}' }
      },
      note: 'Linear kinetics with regular doses (the trough or average level); the same curve describes wash-out after stopping. Independent of the dose.',
      stories: {
        fss: 'A weekly peptide has a half-life of {t12}. What fraction of steady state is reached after {t}?',
        t: 'How long does a drug with a half-life of {t12} take to reach {fss} of steady state?'
      }
    }
  ],
  examples: [
    {
      title: 'The glucose leak',
      q: 'Filtration is 170 L/day and plasma glucose 1.5 g/L (8.3 mmol/L). An SGLT2 inhibitor cuts the reabsorption capacity to 185 g/day. How much glucose is lost, and what happens as glucose falls to 1.0 g/L?',
      steps: [
        'Filtered: $170 \\times 1.5 = 255$ g/day; excreted $255 - 185 = 70$ g/day — about 280 kcal (4 kcal/g).',
        'At 1.0 g/L: filtered 170 g/day, below the capacity, so this simple model predicts almost no loss (in reality the threshold is gradual and some glucose is still lost).',
        'The effect shrinks as glucose falls: the drug cannot drive glucose very low on its own, and it needs working kidneys — it removes less as filtration falls.'
      ],
      a: 'About 70 g a day at 1.5 g/L, falling towards little at normal glucose.'
    },
    {
      title: 'A weekly peptide reaching steady state',
      q: 'A GLP-1 agonist has a half-life of 7 days and is injected weekly. What fraction of steady state is reached after 4 and after 5 weeks, and what is its accumulation?',
      steps: [
        '4 weeks = 4 half-lives: $1 - 2^{-4} = 93.8$ %. 5 weeks: $1 - 2^{-5} = 96.9$ %.',
        'Accumulation for one half-life per interval: $1/(1 - 0.5) = 2$.',
        'Effects and side effects of each step up settle over about a month, and after stopping the drug takes a similar time to wash out — one reason such medicines are increased gradually.'
      ],
      a: '94 % after 4 weeks, 97 % after 5; levels double from the first dose to steady state.'
    }
  ],
  quiz: [
    { q: 'Rapid-acting insulin analogues act faster than regular human insulin because…', choices: ['they are more concentrated', 'their hexamers dissociate quickly into absorbable monomers', 'they are injected into muscle', 'they bind albumin'], a: 1, why: 'Changes near the B-chain end weaken monomer–monomer contacts; the absorption step, not potency, is what changes.' },
    { q: 'Why must insulin glargine not be mixed with other insulins in one syringe?', choices: ['it is a suspension', 'it is an acidic solution designed to precipitate at neutral pH; mixing changes its pH and release', 'it contains no preservative', 'it is more viscous'], a: 1, why: 'Glargine relies on precipitating in the tissue; neutral-pH insulins in the same syringe would precipitate it early and alter both profiles.' },
    { q: 'Metformin is excreted largely unchanged by the kidney.', a: true, why: 'It is not metabolised; renal clearance by filtration and tubular secretion removes it, so kidney function limits its use.' },
    { q: 'A peptide with a half-life of 7 days is given weekly. What percentage of steady state is reached after 3 weeks?', answer: 87.5, unit: '%', why: '1 − 2⁻³ = 0.875.' },
    { q: 'SGLT2 inhibitors given alone rarely cause hypoglycaemia because…', choices: ['they raise glucagon strongly', 'the glucose they remove falls as blood glucose falls, since less is filtered', 'they are taken with food', 'they block insulin release'], a: 1, why: 'Excretion depends on filtered glucose exceeding the reabsorption capacity; at low glucose little is excreted.' }
  ],
  problems: [
    { q: 'Filtration is 150 L/day, plasma glucose 2.0 g/L, and an SGLT2 inhibitor leaves a reabsorption capacity of 200 g/day. How much glucose (g/day) is excreted?', answer: 100, tol: 0.02, steps: ['Filtered: $150 \\times 2.0 = 300$ g/day.', 'Excreted: $300 - 200 = 100$ g/day.'] },
    { q: 'How many days does a drug with a half-life of 5 days take to reach 95 % of steady state?', answer: 21.6, unit: 'day', tol: 0.02, steps: ['$t = -t_{1/2}\\ln(1 - 0.95)/\\ln 2 = 5 \\times \\log_2 20$.', '$= 5 \\times 4.32 = 21.6$ days.'] }
  ],
  applications: [
    'Choosing basal and mealtime insulins by their absorption profiles, and pumps that deliver rapid-acting insulin continuously.',
    'Cold-chain storage, in-use periods and the resuspension of cloudy insulins.',
    'Oral delivery of peptides with absorption enhancers.',
    'Kidney-function checks for renally cleared metformin and for SGLT2 inhibitors.'
  ],
  history: 'Frederick Banting, Charles Best, James Collip and John Macleod purified insulin in Toronto in 1921–22; Leonard Thompson, aged 14, was the first patient treated, in January 1922. Hans Christian Hagedorn added protamine in 1936 to slow absorption, and NPH followed in 1946. Human insulin made in bacteria (1982) was the first recombinant medicine, and lispro (1996) the first insulin analogue.',
  sim: 'class-insulin'
},

{
  id: 'oncology-drugs', parent: 'classes-topic', title: 'Cancer medicines', level: 3,
  short: 'Cytotoxic chemotherapy kills dividing cells a fraction at a time — the log-kill idea — in cycles timed by the recovery of the bone marrow; targeted drugs, antibodies and hormonal therapies exploit what makes a cancer different. Many are prodrugs, poorly soluble, narrow in their margins or hazardous to handle, and their formulations reflect that.',
  keywords: ['chemotherapy', 'cytotoxic', 'log-kill', 'Skipper', 'Gompertz', 'Goldie–Coldman', 'resistance', 'cycle', 'nadir', 'neutropenia', 'G-CSF', 'dose-dense', 'body surface area', 'alkylating agent', 'cyclophosphamide', 'cisplatin', 'capecitabine', 'DPYD', 'irinotecan', 'UGT1A1', 'paclitaxel', 'liposomal doxorubicin', 'kinase inhibitor', 'antibody–drug conjugate', 'checkpoint inhibitor', 'hazardous drugs'],
  prereq: ['therapeutic-index', 'pharmacogenomics', 'medicine:cancer-biology', 'math:exponential-models'],
  related: ['biologics', 'nanomedicine', 'targeted-delivery', 'depot-implants', 'dose-calculations', 'aseptic-processing', 'food-effects', 'ph-solubility', 'medicine:cancer-treatment', 'medicine:immunotherapy', 'biology:cell-cycle'],
  body: `
Cancer cells are the patient's own cells, altered — so selectivity is the central problem. Classical chemotherapy exploits the one thing tumours do more than most tissues: divide. Targeted drugs and immunotherapies exploit what makes a particular cancer different.

### Cytotoxic chemotherapy
| Family | Mechanism | Pharmaceutical notes |
|---|---|---|
| Alkylating agents | cross-link DNA | cyclophosphamide is a prodrug activated by liver CYP enzymes; its by-product acrolein irritates the bladder, and mesna neutralises it |
| Platinum compounds | bind DNA guanines | inside cells cisplatin's chloride ligands are replaced by water, which activates it; solutions are made in sodium chloride, which suppresses that reaction until the drug is inside; hydration protects the kidneys |
| Antimetabolites | false building blocks (methotrexate, 5-fluorouracil, gemcitabine) | capecitabine is an oral prodrug of 5-FU activated in three enzymatic steps, the last by thymidine phosphorylase, which many tumours over-express; people lacking the enzyme DPD (*DPYD* variants) can suffer severe toxicity |
| Topoisomerase inhibitors | trap DNA-cutting enzymes (anthracyclines, irinotecan, etoposide) | irinotecan's active metabolite SN-38 is cleared by UGT1A1, so reduced-function variants raise toxicity; anthracycline heart damage is cumulative; pegylated liposomal doxorubicin circulates for days |
| Microtubule agents | taxanes stabilise, vinca alkaloids block microtubules | paclitaxel dissolves in water at well under 1 µg/mL and was formulated in polyoxyl castor oil and ethanol, which causes hypersensitivity (premedication) and leaches plasticiser from PVC; an albumin-bound nanoparticle form avoids the solvent; vinca alkaloids are fatal if injected into the spinal fluid, so they are supplied in infusion mini-bags for intravenous use only |

### Log-kill, cycles and the marrow
Cytotoxics kill a **fraction** of the cells exposed, not a number: in Howard Skipper's **log-kill** hypothesis (1964) a treatment that kills 99.9 % takes $10^{11}$ cells to $10^{8}$ just as it takes $10^{3}$ to 1. A tumour of 1 cm³ holds about $10^9$ cells — around the smallest that imaging finds — and 1 kg about $10^{12}$. "No detectable disease" can therefore still mean millions of cells, which is why treatment continues after a remission.

Treatment comes in **cycles**, often every 21 or 28 days. Each cycle removes some logs of tumour; the tumour regrows in between. The interval is set by the fastest-dividing normal tissue, the **bone marrow**: the neutrophil count falls to its lowest point (the **nadir**) 7–14 days after a dose and recovers over the third week. Growth factors such as G-CSF shorten that recovery and allow **dose-dense** cycles. Because the window between an effective and a toxic dose is narrow, many cytotoxic doses are scaled to body surface area ([[dose-calculations]]).

Resistance limits cure. Goldie and Coldman (1979) showed that the chance a tumour already contains a drug-resistant cell rises steeply with its size: $P_0 = e^{-a(N - 1)}$ for a mutation rate $a$ per division — the argument for treating early and combining drugs without shared resistance.

### Targeted drugs, antibodies and hormones
**Kinase inhibitors** (imatinib against BCR-ABL in chronic myeloid leukaemia, 2001; EGFR, ALK and BRAF inhibitors) are oral and pharmaceutically awkward: many are weak bases whose solubility falls steeply as pH rises, so acid-reducing drugs can cut their absorption ([[ph-solubility]]); many are CYP3A4 substrates; and food can change exposure several-fold ([[food-effects]]). **Monoclonal antibodies** (trastuzumab against HER2, rituximab against CD20) and **immune checkpoint inhibitors** (anti-PD-1, anti-PD-L1, anti-CTLA-4) are proteins given by infusion or injection ([[biologics]]); checkpoint inhibitors release the immune system's brakes, and their adverse effects are autoimmune. **Antibody–drug conjugates** attach a few molecules of a very potent cytotoxic — the drug-to-antibody ratio is typically 2–8 — through a linker designed to break inside the cancer cell. **Hormonal therapies** starve hormone-dependent cancers: tamoxifen, a prodrug partly activated by CYP2D6; aromatase inhibitors; and gonadotropin-releasing hormone analogues released for one to six months from biodegradable polymer (PLGA) microspheres or implants ([[depot-implants]]).

### Hazardous drugs
Many cytotoxics are carcinogenic, mutagenic or harmful to reproduction for the people who prepare and give them. They are prepared by trained staff in biological safety cabinets or isolators, often with closed-system transfer devices, under standards such as USP chapter ⟨800⟩ (official since 2019) and equivalent rules elsewhere ([[aseptic-processing]]).

> [!warn] Fever or other signs of infection during chemotherapy — especially 7–14 days after a cycle, when white cells are lowest — can be life-threatening (neutropenic sepsis): call the treatment team's emergency line or your local emergency number at once, as you were told. Oral anticancer medicines are taken only as prescribed, never shared, and handled as the pharmacist advises.
`,
  ideas: [
    'Cytotoxics kill a constant fraction per exposure (log-kill), so an undetectable tumour may still hold millions of cells.',
    'Cycles are spaced by bone-marrow recovery: nadir at 7–14 days, recovery by about day 21; G-CSF allows dose-dense cycles.',
    'The chance of pre-existing resistance rises steeply with tumour size (Goldie–Coldman), favouring early, combined treatment.',
    'Prodrugs (cyclophosphamide, capecitabine, irinotecan, tamoxifen) and genotypes (DPYD, UGT1A1, CYP2D6) shape efficacy and toxicity.',
    'Poor solubility drives special formulations: solvent-based and albumin-bound paclitaxel, liposomes, and pH-sensitive oral kinase inhibitors.'
  ],
  pitfalls: [
    'A complete remission means every cancer cell is gone — Imaging cannot see fewer than about 10⁹ cells; "no detectable disease" after two logs of kill from 10¹¹ still leaves 10⁹, which is why treatment continues.',
    'A bigger dose each cycle always gives a better result — Log-kill rises with dose, but so does marrow and organ toxicity; the interval, the regrowth between cycles and resistance matter as much.',
    'Oral chemotherapy is milder than intravenous chemotherapy — The route says nothing about toxicity; oral cytotoxics and kinase inhibitors carry the same need for careful dosing, monitoring and safe handling.'
  ],
  formulas: [
    {
      name: 'Log-kill with regrowth between cycles',
      expr: 'N = N0*(10^(-L)*2^(tau/Td))^n', tex: 'N = N_0\\left(10^{-L}\\,2^{\\tau/T_d}\\right)^{n}',
      vars: {
        N: { name: 'tumour cells after n cycles (just before the next)' },
        N0: { name: 'tumour cells at the start', value: 1e10, tex: 'N_0' },
        L: { name: 'logs killed per cycle', value: 2, min: 0, max: 10 },
        tau: { name: 'interval between cycles', q: 'time', unit: 'day', value: 21, tex: '\\tau' },
        Td: { name: 'tumour doubling time between cycles', q: 'time', unit: 'day', value: 10, tex: 'T_d' },
        n: { name: 'number of cycles', value: 6, int: true, min: 1, max: 20 }
      },
      note: 'Skipper\'s model with exponential regrowth; real tumours grow faster when small (Gompertzian growth) and contain resistant cells, so this is an idealisation. Below one cell, N is a probability of a surviving cell.',
      practice: { unknowns: ['N', 'L'] },
      stories: {
        N: 'A tumour of {N0} cells receives {n} cycles, each killing {L} logs, every {tau}; between cycles it doubles every {Td}. How many cells remain?',
        L: 'How many logs must each of {n} cycles kill to take {N0} cells down to {N}, if the tumour doubles every {Td} and cycles are {tau} apart?'
      }
    },
    {
      name: 'Chance that no resistant cell exists yet (Goldie–Coldman)',
      expr: 'P = exp(-a*(N - 1))', tex: 'P_0 = e^{-a\\,(N - 1)}',
      vars: {
        P: { name: 'probability of no resistant cell', q: 'ratio', unit: '%', tex: 'P_0' },
        a: { name: 'resistance mutations per cell division', value: 1e-6 },
        N: { name: 'number of tumour cells', value: 1e6 }
      },
      note: 'Each division of a sensitive cell can produce a resistant one with probability a; a tumour grown from one cell to N has had N − 1 divisions. Illustrative rates.',
      practice: { unknowns: ['P', 'N'] },
      stories: {
        P: 'Resistance arises at {a} per division. What is the chance that a tumour of {N} cells contains no resistant cell?',
        N: 'At a mutation rate of {a} per division, at what size does the chance of no resistant cell fall to {P}?'
      }
    },
    {
      name: 'Body surface area (Mosteller)',
      expr: 'BSA = sqrt(h*m/3600)', tex: '\\mathrm{BSA} = \\sqrt{\\dfrac{h\\,m}{3600}}',
      vars: {
        BSA: { name: 'body surface area', q: false, unit: 'm²', tex: '\\mathrm{BSA}' },
        h: { name: 'height', q: false, unit: 'cm', value: 170 },
        m: { name: 'weight', q: false, unit: 'kg', value: 70 }
      },
      note: 'An empirical formula (Mosteller, 1987) in these units only. Anticancer doses are calculated, capped and checked by qualified staff following the protocol and product information.',
      stories: { BSA: 'What is the body surface area of a person {h} tall weighing {m}?' }
    }
  ],
  examples: [
    {
      title: 'Remission is not cure',
      q: 'A tumour of $10^{11}$ cells is treated with cycles that each kill 2 logs. (a) Without regrowth, how many cells remain when it first becomes undetectable? (b) If it doubles 3 times between 21-day cycles, how many cycles bring it below one cell?',
      steps: [
        '(a) After one cycle $10^{9}$ — at the edge of detection; after two, $10^{7}$: a "complete remission" with ten million cells left.',
        '(b) Net factor per cycle: $10^{-2} \\times 2^{3} = 0.08$, i.e. $\\log_{10}(1/0.08) = 1.10$ logs per cycle.',
        'From $10^{11}$ to below 1 needs $11/1.10 = 10.0$ — so 11 cycles.',
        'If the tumour doubled only once in 30 days instead ($2^{0.7} = 1.62$ per 21 days), each cycle would net 1.79 logs and 7 cycles would suffice: regrowth between cycles, not only the kill, decides the outcome.'
      ],
      a: 'Ten million cells at remission; 11 cycles with fast regrowth against 7 with slow.'
    },
    {
      title: 'The window before resistance',
      q: 'With a resistance mutation rate of $10^{-6}$ per division, what is the chance that a tumour contains no resistant cell at $10^{5}$, $10^{6}$ and $10^{7}$ cells?',
      steps: [
        '$10^{5}$: $e^{-0.1} = 90$ %.',
        '$10^{6}$: $e^{-1} = 37$ %.',
        '$10^{7}$: $e^{-10} = 0.005$ %.',
        'The transition from probably curable to almost certainly resistant spans only two logs — about seven doublings, all below the size at which the tumour can be seen.'
      ],
      a: '90 %, 37 % and 0.005 %.'
    }
  ],
  quiz: [
    { q: 'By the log-kill hypothesis, a cycle that kills 99 % of cells reduces $10^{10}$ tumour cells to…', choices: ['$10^{9}$', '$10^{8}$', '$10^{2}$', '99 % fewer than a cycle that kills 90 %'], a: 1, why: '99 % is 2 logs: 10¹⁰ × 0.01 = 10⁸, whatever the starting size.' },
    { q: 'Why are many chemotherapy cycles repeated every three weeks?', choices: ['the tumour needs three weeks to regrow', 'the bone marrow needs that long to recover from its nadir', 'the drugs take three weeks to be eliminated', 'regulations require it'], a: 1, why: 'Neutrophils reach their nadir at 7–14 days and recover over the third week; the next cycle waits for recovery.' },
    { q: 'Capecitabine is…', choices: ['an intravenous alkylating agent', 'an oral prodrug converted to 5-fluorouracil, the last step by thymidine phosphorylase', 'a kinase inhibitor', 'an antibody–drug conjugate'], a: 1, why: 'Three enzymatic steps (liver and tumour) release 5-FU; its toxicity rises in people lacking DPD, which breaks 5-FU down.' },
    { q: 'When a scan shows no detectable tumour, all cancer cells have been killed.', a: false, why: 'Imaging needs roughly 10⁹ cells to see a tumour; many logs of disease can remain below that.' },
    { q: 'A tumour of $10^{9}$ cells receives cycles that each kill 3 logs, with no regrowth. How many cycles reduce it to about one cell?', answer: 3, why: '9 logs ÷ 3 logs per cycle = 3 cycles.' }
  ],
  problems: [
    { q: 'A tumour of $10^{10}$ cells receives 4 cycles, each killing 2.5 logs, and doubles 4 times between cycles. How many cells remain?', answer: 65500, tol: 0.03, steps: ['Net factor per cycle: $10^{-2.5} \\times 2^4 = 0.003162 \\times 16 = 0.0506$.', 'After 4 cycles: $0.0506^4 = 6.55\\times10^{-6}$.', '$N = 10^{10} \\times 6.55\\times10^{-6} = 6.55\\times10^{4}$ cells.'] },
    { q: 'At a resistance mutation rate of $10^{-7}$ per division, what is the chance (in %) that a tumour of $10^{7}$ cells has no resistant cell?', answer: 36.8, unit: '%', tol: 0.02, steps: ['$a(N - 1) \\approx 10^{-7} \\times 10^{7} = 1$.', '$P_0 = e^{-1} = 36.8$ %.'] }
  ],
  applications: [
    'Scheduling cycles around the neutrophil nadir, and growth-factor support for dose-dense regimens.',
    'Genotype testing (DPYD, UGT1A1) before fluoropyrimidines and irinotecan.',
    'Solvent-free, liposomal and albumin-bound formulations of poorly soluble cytotoxics.',
    'Safe preparation of hazardous drugs in pharmacy aseptic units.'
  ],
  history: 'Nitrogen mustard, a relative of the First World War gas, was the first chemotherapy, given for lymphoma from 1942. Sidney Farber produced remissions in childhood leukaemia with the antifolate aminopterin in 1948; Barnett Rosenberg discovered cisplatin\'s effect in 1965 while passing electric currents through bacteria with platinum electrodes; and imatinib (2001) showed that a drug could be designed against the molecular cause of one cancer.',
  sim: 'class-logkill'
},

{
  id: 'biologics', parent: 'classes-topic', title: 'Biological medicines and biosimilars', level: 2,
  short: 'Biological medicines — hormones, enzymes, antibodies, fusion proteins — are made by living cells, are large and fragile, and must be injected. Their pharmacokinetics is written by the neonatal Fc receptor and by their targets, their formulation is about keeping a folded protein intact, and their copies are biosimilars: highly similar, never identical.',
  keywords: ['biologic', 'biological medicine', 'recombinant protein', 'CHO cells', 'monoclonal antibody', 'IgG', 'FcRn', 'half-life extension', 'target-mediated drug disposition', 'immunogenicity', 'anti-drug antibodies', 'aggregation', 'polysorbate', 'high-concentration formulation', 'viscosity', 'hyaluronidase', 'biosimilar', 'interchangeability', 'extrapolation', 'INN stems', '-mab'],
  prereq: ['what-is-a-drug', 'routes', 'medicine:antibodies', 'biology:protein-structure'],
  related: ['biologics-formulation', 'lyophilisation', 'nonlinear-pk', 'rheology', 'bioequivalence', 'drug-names', 'vaccines-overview', 'diabetes-drugs', 'oncology-drugs', 'depot-implants', 'biology:endocytosis', 'chemistry:amino-acids-proteins'],
  body: `
A biological medicine is made by, or extracted from, a living system: hormones, enzymes, clotting factors, antibodies, vaccines, blood products and now cell and gene therapies. Most are **recombinant proteins** made by engineered cells — bacteria (*E. coli*) for small unglycosylated proteins such as insulin, yeast, and above all Chinese hamster ovary (**CHO**) cells for antibodies, which need human-like glycosylation.

### Why a protein is different
| | Small molecule (e.g. aspirin) | Monoclonal antibody (IgG) |
|---|---|---|
| Size | 180 Da, 21 atoms | about 150 000 Da, some 20 000 atoms |
| Made by | chemical synthesis: identical molecules | living cells: a controlled mixture of glycoforms and charge variants |
| Given | mostly by mouth | injected — digested in the gut and far too large to cross it |
| Distribution | often throughout body water and tissues | mainly plasma and interstitial fluid (about 3–8 L) |
| Elimination | liver enzymes (CYP), kidney | taken up by cells and broken into amino acids; also by binding its target |
| Half-life | hours | about three weeks (IgG1) |
| Immunogenicity | rare | anti-drug antibodies can cut the effect or cause reactions |

### The FcRn trick
The long life of antibodies is due to the **neonatal Fc receptor** (FcRn). Endothelial and other cells swallow plasma continually. In the acidic endosome (pH about 6) FcRn binds the Fc part of IgG — and albumin — and carries it back to the cell surface, where at pH 7.4 it lets go. Proteins that miss the receptor go on to lysosomes and are digested. Without FcRn an IgG would last a few days; with it, about 21 days. If a fraction $f_r$ is rescued on each pass, the half-life is

$$t_{1/2} = \\frac{\\ln 2}{k_\\text{up}\\,(1 - f_r)}$$

so rescuing 96 % instead of 86 % more than triples it. Engineering the Fc to bind FcRn more tightly at pH 6 — but not at 7.4 — extends half-lives two- to four-fold (a long-acting antibody that protects infants against respiratory syncytial virus through a whole season uses this), and the same receptor explains why albumin-binding peptides (see [[diabetes-drugs]]) and Fc-fusion proteins last longer. At very high IgG levels FcRn saturates and IgG is cleared faster; drugs that block FcRn lower a patient's own harmful IgG in some autoimmune diseases.

At low doses many antibodies are also cleared by binding their **target** (target-mediated drug disposition), which makes their pharmacokinetics non-linear ([[nonlinear-pk]]). They are not metabolised by CYP enzymes, so classic metabolic interactions are rare.

### Keeping a protein folded
Proteins are held together by weak forces, so formulation is about preserving the folded shape ([[biologics-formulation]]): a pH near the stability optimum (often 5–6.5, with histidine or acetate buffers), sugars such as sucrose or trehalose that are excluded from the protein surface and favour the compact state, **surfactants** (polysorbate 20 or 80) that keep molecules away from air–water and container surfaces, storage at 2–8 °C or **freeze-drying** ([[lyophilisation]]). Degradation is physical (unfolding, **aggregation**, adsorption) and chemical (deamidation of asparagine, oxidation of methionine). Aggregates matter beyond lost potency: they can provoke anti-drug antibodies.

A subcutaneous injection holds about 1–2 mL, so doses of hundreds of milligrams need **high concentrations** of 100–200 mg/mL, where viscosity rises steeply and the syringe becomes hard to push ([[rheology]]); co-formulated hyaluronidase lets larger volumes spread under the skin, and on-body injectors deliver them over minutes. Subcutaneous bioavailability is typically 50–80 %, through the lymph.

### Biosimilars
No copy of a cell-made protein can be identical, so generic rules do not apply ([[bioequivalence]]). A **biosimilar** is highly similar to an authorised reference biological, with no clinically meaningful differences in safety, purity or potency — shown by extensive analytical comparison, non-clinical data and usually one comparative clinical study: the "totality of the evidence". The EU approved the first biosimilar (somatropin) in 2006 and the first biosimilar antibody (infliximab) in 2013; the US pathway dates from 2010, with a first approval in 2015. Regulators may allow **extrapolation** to the reference product's other indications, and in the US a biosimilar can also be designated interchangeable. Names carry the class: *-mab* for antibodies (formerly *-ximab* chimeric, *-zumab* humanised, *-umab* human; since 2022, new stems such as *-tug*, *-bart*, *-mig* and *-ment* describe the structure instead; see [[drug-names]]).

> [!note] Biological medicines are prescribed and supplied under medical supervision. Switching between a reference product and a biosimilar follows local rules and is decided with the prescriber or pharmacist; report any suspected reaction.
`,
  ideas: [
    'Biologics are large, heterogeneous proteins made by cells; they are injected and cleared by cellular breakdown, not CYP enzymes.',
    'FcRn rescues IgG and albumin from lysosomal breakdown; the rescued fraction sets the three-week half-life, and Fc engineering extends it.',
    'Target binding makes antibody pharmacokinetics non-linear at low doses.',
    'Formulation fights unfolding and aggregation: pH, sugars, surfactants, cold, freeze-drying — and viscosity at high concentration.',
    'Biosimilars are highly similar, not identical: approval rests on analytical, non-clinical and clinical comparison.'
  ],
  pitfalls: [
    'A biosimilar is a generic of a biological — A generic is chemically identical to its reference; a biosimilar cannot be, and is approved on a much larger body of comparative evidence.',
    'Antibodies last long because they are too big to be broken down — Albumin and many other large proteins would be degraded within days; IgG and albumin survive because FcRn recycles them.',
    'Shaking a protein solution is harmless if it is not heated — Agitation creates air–water interfaces where proteins unfold and aggregate; that is why surfactants are added and why such products are handled gently.'
  ],
  formulas: [
    {
      name: 'Half-life with FcRn recycling',
      expr: 't12 = ln(2)/(kup*(1 - fr))', tex: 't_{1/2} = \\dfrac{\\ln 2}{k_\\text{up}\\,(1 - f_r)}',
      vars: {
        t12: { name: 'plasma half-life', q: 'time', unit: 'day', tex: 't_{1/2}' },
        kup: { name: 'rate of uptake into cells (fraction of plasma per day)', q: 'rate', unit: '1/day', value: 0.231, tex: 'k_\\text{up}' },
        fr: { name: 'fraction rescued by FcRn on each pass', q: 'ratio', unit: '%', value: 85.7, tex: 'f_r' }
      },
      note: 'A one-compartment recycling model: without rescue (f_r = 0) the half-life would be ln 2/k_up, here 3 days. Ignores target-mediated and renal clearance. Illustrative values.',
      practice: { unknowns: ['t12', 'fr'] },
      stories: {
        t12: 'Plasma is taken into cells at {kup}, and FcRn rescues {fr} of an antibody on each pass. What is its half-life?',
        fr: 'An engineered antibody has a half-life of {t12}, with uptake at {kup}. What fraction must FcRn rescue on each pass?'
      }
    },
    {
      name: 'Viscosity of a concentrated protein solution',
      expr: 'eta = eta0*exp(kc*c)', tex: '\\eta = \\eta_0\\,e^{k_c\\,c}',
      vars: {
        eta: { name: 'viscosity', q: false, unit: 'mPa·s', tex: '\\eta' },
        eta0: { name: 'viscosity of the buffer', q: false, unit: 'mPa·s', value: 1.0, tex: '\\eta_0' },
        kc: { name: 'viscosity coefficient of the protein', q: false, unit: 'mL/mg', value: 0.015, tex: 'k_c' },
        c: { name: 'protein concentration', q: false, unit: 'mg/mL', value: 150 }
      },
      note: 'An empirical exponential fit, reasonable up to about 200 mg/mL; k_c depends strongly on the antibody, pH and salts. Syringe force rises in proportion to viscosity.',
      stories: {
        eta: 'An antibody with k_c = {kc} is formulated at {c} in a buffer of viscosity {eta0}. What is the viscosity?',
        c: 'The injection device can handle {eta}. Up to what concentration can an antibody with k_c = {kc} be formulated (buffer {eta0})?'
      }
    },
    {
      name: 'Injection volume',
      expr: 'V = D/c', tex: 'V = \\dfrac{D}{c}',
      vars: {
        V: { name: 'volume to inject', q: false, unit: 'mL' },
        D: { name: 'amount of protein', q: false, unit: 'mg', value: 300 },
        c: { name: 'concentration', q: false, unit: 'mg/mL', value: 150 }
      },
      note: 'Hypothetical amounts, for formulation design; real doses and volumes follow the product information.',
      stories: { V: 'A hypothetical antibody is needed at {D}, formulated at {c}. What volume must be injected?', c: 'To give {D} in {V}, what concentration is needed?' }
    }
  ],
  examples: [
    {
      title: 'What recycling buys',
      q: 'Plasma proteins are taken into cells at 0.231 per day (so an unrescued protein would have a half-life of 3 days). What half-life results if FcRn rescues 85.7 % on each pass? 95.7 %?',
      steps: [
        '85.7 %: $t_{1/2} = 0.693/(0.231 \\times 0.143) = 21$ days — a typical IgG1.',
        '95.7 %: $t_{1/2} = 0.693/(0.231 \\times 0.043) = 70$ days — an Fc-engineered antibody.',
        'Ten points of extra rescue triple the half-life, because what matters is the fraction lost, $1 - f_r$, which falls from 14 % to 4 %.'
      ],
      a: '21 days and 70 days.'
    },
    {
      title: 'Concentrate, or inject more?',
      q: 'A hypothetical 300 mg antibody dose is to be given under the skin. Compare 150 and 200 mg/mL formulations with $\\eta_0$ = 1.0 mPa·s and $k_c$ = 0.015 mL/mg.',
      steps: [
        '150 mg/mL: $V = 2.0$ mL, $\\eta = e^{2.25} = 9.5$ mPa·s.',
        '200 mg/mL: $V = 1.5$ mL, $\\eta = e^{3.0} = 20$ mPa·s — twice the force on the plunger through the same needle.',
        'The designer trades volume against viscosity (and aggregation, which also rises with concentration): larger volumes need hyaluronidase or an on-body injector.'
      ],
      a: '2.0 mL at 9.5 mPa·s, or 1.5 mL at 20 mPa·s.'
    }
  ],
  quiz: [
    { q: 'Why do IgG antibodies last about three weeks while many other proteins of similar size last days?', choices: ['they are too large to be filtered or degraded', 'FcRn in acidic endosomes rescues them from lysosomal breakdown and returns them to the blood', 'they are stored in the liver', 'they are resistant to all proteases'], a: 1, why: 'Fluid-phase uptake takes all plasma proteins into cells; FcRn binds IgG and albumin at pH 6 and releases them at pH 7.4.' },
    { q: 'A biosimilar is…', choices: ['chemically identical to its reference, like a generic', 'highly similar to its reference with no clinically meaningful differences, shown by the totality of evidence', 'a new antibody against the same target', 'any biological made by a second company'], a: 1, why: 'Cell-made proteins vary; biosimilarity is shown by extensive comparison, not identity.' },
    { q: 'Antibodies are commonly metabolised by CYP3A4, so CYP3A4 inhibitors raise their levels.', a: false, why: 'Antibodies are broken down to amino acids by cells and cleared by their targets; CYP enzymes play no direct part.' },
    { q: 'With uptake of 0.231 per day and 90 % rescue by FcRn, what is the half-life in days?', answer: 30, unit: 'day', why: '0.693/(0.231 × 0.10) = 30 days.' },
    { q: 'Polysorbate is added to antibody formulations mainly to…', choices: ['preserve them against microbes', 'keep protein molecules from unfolding and aggregating at air–water and container surfaces', 'raise their viscosity', 'adjust the pH'], a: 1, why: 'Surfactants occupy interfaces where proteins would otherwise adsorb, unfold and aggregate.' }
  ],
  problems: [
    { q: 'A hypothetical 400 mg antibody dose is formulated at 175 mg/mL. What volume (mL) is injected?', answer: 2.29, unit: 'mL', tol: 0.02, steps: ['$V = 400/175 = 2.29$ mL — beyond a typical 2 mL autoinjector.'] },
    { q: 'An antibody solution has $\\eta_0$ = 1.0 mPa·s and $k_c$ = 0.02 mL/mg. At what concentration (mg/mL) does viscosity reach 20 mPa·s?', answer: 150, tol: 0.02, steps: ['$c = \\ln(\\eta/\\eta_0)/k_c = \\ln 20/0.02$.', '$= 2.996/0.02 = 150$ mg/mL.'] }
  ],
  applications: [
    'High-concentration antibody formulations, autoinjectors and on-body injectors.',
    'Half-life extension by Fc engineering, albumin binding and PEGylation.',
    'Biosimilar development, comparability exercises and approval.',
    'FcRn blockers that lower harmful IgG in autoimmune diseases.'
  ],
  history: 'Human insulin made in E. coli (1982) was the first recombinant medicine. Georges Köhler and César Milstein made monoclonal antibodies by fusing antibody-producing cells with myeloma cells in 1975 (Nobel Prize 1984); the first therapeutic one, the mouse antibody muromonab-CD3, was approved in 1986, and humanisation, pioneered by Greg Winter, made long-term use tolerable. Richard Brambell proposed a receptor that protects IgG in 1964, a quarter of a century before FcRn was cloned in 1989.',
  sim: 'class-fcrn'
},

{
  id: 'respiratory-drugs', parent: 'classes-topic', title: 'Medicines for the lungs', level: 2,
  short: 'Inhaled medicines reach the airways directly, so micrograms do the work of milligrams — if the particles are 1–5 µm in aerodynamic diameter and the device is used well. β₂-agonists, antimuscarinics and corticosteroids are designed for the lung: long-acting by lipophilicity or slow receptor release, safe because the swallowed part is poorly absorbed or destroyed on its first pass.',
  keywords: ['inhaler', 'aerodynamic diameter', 'MMAD', 'deposition', 'impaction', 'sedimentation', 'pMDI', 'propellant', 'HFA', 'spacer', 'dry-powder inhaler', 'lactose carrier', 'nebuliser', 'soft-mist inhaler', 'beta-2 agonist', 'salbutamol', 'albuterol', 'salmeterol', 'formoterol', 'antimuscarinic', 'tiotropium', 'quaternary ammonium', 'inhaled corticosteroid', 'first-pass', 'ciclesonide', 'theophylline', 'montelukast'],
  prereq: ['inhalation', 'particle-size', 'first-pass', 'medicine:asthma'],
  related: ['routes', 'biologics', 'receptors', 'tdm', 'nonlinear-pk', 'drug-interactions', 'medicine:copd', 'physics:viscosity', 'physics:drag-force'],
  body: `
The lungs are both a target and a route. An inhaled medicine goes straight to the airways, so a dose of micrograms can do what milligrams by mouth would do, with fewer side effects. But only particles of the right size get there, and the device is as much part of the medicine as the molecule ([[inhalation]]).

### Getting drug into the lungs
Where a particle lands depends on its **aerodynamic diameter** — the diameter of a sphere of unit density (1 g/cm³) that settles at the same speed:

$$d_a = d\\,\\sqrt{\\frac{\\rho}{\\chi\\,\\rho_w}}$$

with $d$ the geometric diameter, $\\rho$ the particle density and $\\chi$ a shape factor (1 for a sphere). Particles above about 5 µm cannot follow the bends of the throat and **impact** there, to be swallowed; those of 1–5 µm reach the airways and settle by **sedimentation** — which takes seconds, hence the breath-hold; below about 1 µm many are simply breathed out. A 3 µm particle settles at only about 0.3 mm/s, so crossing a small airway of 1 mm takes several seconds. Even good devices deliver only about 10–40 % of the metered dose to the lungs; the rest is swallowed or exhaled.

| Device | How it works | Points |
|---|---|---|
| Pressurised metered-dose inhaler (pMDI) | drug dissolved or suspended in liquefied propellant (HFA-134a, HFA-227ea); a valve meters each puff | needs coordination; a spacer slows the plume and cuts throat deposition; the propellants are potent greenhouse gases, and at the time of writing lower-warming propellants (HFA-152a, HFO-1234ze) are being introduced |
| Dry-powder inhaler (DPI) | micronised drug blended with coarse lactose carrier; the patient's own breath disperses it | needs a fast, deep inhalation (typically 30–90 L/min depending on the device's resistance); sensitive to moisture |
| Soft-mist inhaler | a spring forces a solution through a fine nozzle to make a slow mist | less dependent on timing |
| Nebuliser | a jet of air or a vibrating mesh turns a solution into droplets | for young children, severe attacks, and drugs such as inhaled antibiotics |

### The drug families
- **β₂-agonists** relax airway smooth muscle through β₂ receptors and cyclic AMP. Salbutamol (albuterol) acts within minutes for 4–6 hours; it is a racemate whose R-enantiomer does the work. **Long-acting** agonists last about 12 hours — salmeterol because its long lipophilic tail keeps it in the membrane beside the receptor, formoterol through moderate lipophilicity with a fast onset — and newer ones last 24 hours.
- **Antimuscarinics** block M₃ receptors. Ipratropium and tiotropium are **quaternary ammonium** compounds: permanently charged, so the swallowed part is barely absorbed and they hardly enter the brain; tiotropium dissociates from M₃ receptors so slowly that one inhalation lasts a day.
- **Inhaled corticosteroids** (beclometasone, budesonide, fluticasone, ciclesonide) calm airway inflammation over days to weeks. Their safety is pharmacokinetic: the swallowed part — often most of the dose — is largely destroyed on its first pass through the liver (oral bioavailability about 1 % for fluticasone propionate, 11 % for budesonide), so systemic exposure comes mainly from the lung ([[first-pass]]). Beclometasone dipropionate and ciclesonide are prodrugs activated by esterases in the lung. Local effects — hoarseness, oral thrush — are reduced by a spacer and by rinsing the mouth.
- **Leukotriene receptor antagonists** (montelukast) are tablets. **Theophylline**, an old bronchodilator, has a narrow range (roughly 10–20 mg/L, often lower targets today), saturable metabolism by CYP1A2 ([[nonlinear-pk]]), and a clearance that rises in smokers and falls with some antibiotics.
- **Biologics** for severe asthma target IgE, interleukin-5 or its receptor, the IL-4 receptor or TSLP ([[biologics]]).

Asthma treatment has shifted with the evidence: over-reliance on short-acting relievers alone is linked to severe attacks, so current international guidance (GINA, from 2019) pairs reliever use with an inhaled corticosteroid.

> [!warn] A severe asthma attack — too breathless to speak in sentences, a reliever that is not helping or is needed more than every four hours, blue lips, exhaustion or confusion — needs your local emergency number. Needing a reliever more and more often is a sign that asthma is not controlled and should be reviewed with a doctor or nurse.
`,
  ideas: [
    'Deposition depends on aerodynamic diameter: above 5 µm impaction in the throat, 1–5 µm settling in the airways, below 1 µm largely exhaled.',
    'The device (pMDI with spacer, DPI, soft mist, nebuliser) and the patient\'s technique decide how much reaches the lung.',
    'Long action comes from lipophilicity (salmeterol) or slow dissociation from the receptor (tiotropium).',
    'Quaternary antimuscarinics and high-first-pass corticosteroids keep the swallowed part from causing systemic effects.',
    'Systemic exposure of an inhaled drug = lung dose + swallowed dose × oral bioavailability.'
  ],
  pitfalls: [
    'Smaller particles always reach the lung better — Below about 1 µm particles settle so slowly that many are breathed out again; the target is 1–5 µm aerodynamic diameter.',
    'An inhaled medicine never has effects elsewhere in the body — The lung absorbs drug into the blood; the lung dose, plus whatever is swallowed and survives first-pass metabolism, reaches the whole body.',
    'Particle size alone decides where a particle lands — What matters is aerodynamic diameter, which includes density and shape: large porous particles can behave like small dense ones.'
  ],
  formulas: [
    {
      name: 'Aerodynamic diameter',
      expr: 'da = d*sqrt(rho/(chi*rhoW))', tex: 'd_a = d\\,\\sqrt{\\dfrac{\\rho}{\\chi\\,\\rho_w}}',
      vars: {
        da: { name: 'aerodynamic diameter', q: 'length', unit: 'µm', tex: 'd_a' },
        d: { name: 'geometric (volume-equivalent) diameter', q: 'length', unit: 'µm', value: 3 },
        rho: { name: 'particle density', q: 'density', unit: 'kg/m³', value: 1500, tex: '\\rho' },
        chi: { name: 'dynamic shape factor (1 for a sphere)', value: 1, tex: '\\chi' },
        rhoW: { const: 'rhoW' }
      },
      note: 'The reference density is 1000 kg/m³ (1 g/cm³). Valid in the settling (Stokes) regime; slip corrections matter below about 1 µm.',
      stories: {
        da: 'A drug particle of {d} geometric diameter has a density of {rho} and shape factor {chi}. What is its aerodynamic diameter?',
        d: 'A porous particle of density {rho} (shape factor {chi}) should behave like a {da} particle. How large can it be?'
      }
    },
    {
      name: 'Settling speed of an inhaled particle',
      expr: 'v = rhoW*g*da^2/(18*eta)', tex: 'v = \\dfrac{\\rho_w\\,g\\,d_a^2}{18\\,\\eta}',
      vars: {
        v: { name: 'settling (terminal) velocity', q: 'speed', unit: 'mm/s' },
        rhoW: { const: 'rhoW' },
        g: { const: 'g' },
        da: { name: 'aerodynamic diameter', q: 'length', unit: 'µm', value: 3, tex: 'd_a' },
        eta: { name: 'viscosity of air', q: 'viscosity', unit: 'mPa·s', value: 0.0181, tex: '\\eta' }
      },
      note: 'Stokes\' law written with the aerodynamic diameter (so the density is 1000 kg/m³). Air at 20 °C: η = 0.0181 mPa·s; at 37 °C about 0.019.',
      practice: { unknowns: ['v', 'da'] },
      stories: {
        v: 'How fast does a particle of aerodynamic diameter {da} settle in air of viscosity {eta}?',
        da: 'Which aerodynamic diameter settles at {v} in air ({eta})?'
      }
    },
    {
      name: 'Systemic exposure after inhalation',
      expr: 'Fsys = fl + fs*Foral', tex: 'F_\\text{sys} = f_l + f_s\\,F_\\text{oral}',
      vars: {
        Fsys: { name: 'fraction of the metered dose reaching the circulation', q: 'ratio', unit: '%', tex: 'F_\\text{sys}' },
        fl: { name: 'fraction deposited in the lung', q: 'ratio', unit: '%', value: 20, tex: 'f_l' },
        fs: { name: 'fraction swallowed', q: 'ratio', unit: '%', value: 70, tex: 'f_s' },
        Foral: { name: 'oral bioavailability of the drug', q: 'ratio', unit: '%', value: 1, tex: 'F_\\text{oral}' }
      },
      note: 'Assumes all drug deposited in the lung is eventually absorbed. A spacer reduces f_s; a high first-pass drug makes the swallowed part irrelevant.',
      practice: { unknowns: ['Fsys', 'Foral'] },
      stories: {
        Fsys: 'An inhaler puts {fl} of the dose in the lungs and {fs} in the throat, which is swallowed. The drug\'s oral bioavailability is {Foral}. What fraction reaches the circulation?',
        Foral: 'An inhaler deposits {fl} in the lung and {fs} is swallowed; {Fsys} of the dose reaches the circulation. What is the oral bioavailability?'
      }
    }
  ],
  examples: [
    {
      title: 'Large porous particles',
      q: 'Compare the aerodynamic diameters of a dense spherical particle of 5 µm (1500 kg/m³) and a large porous one of 10 µm (100 kg/m³).',
      steps: [
        'Dense: $d_a = 5\\sqrt{1.5} = 6.1$ µm — it will mostly impact in the throat.',
        'Porous: $d_a = 10\\sqrt{0.1} = 3.2$ µm — right in the 1–5 µm band.',
        'Big, light particles reach the deep lung yet are less cohesive and less easily cleared by macrophages — one idea behind engineered dry powders.'
      ],
      a: '6.1 µm against 3.2 µm: density, not just size, decides.'
    },
    {
      title: 'Why the swallowed part of a steroid hardly matters — for some steroids',
      q: 'An inhaler deposits 20 % of the dose in the lung and 70 % is swallowed. Compare the systemic fraction for a steroid with 1 % oral bioavailability, one with 11 %, and a hypothetical one with 60 %. How long does a 3 µm particle take to settle across 1 mm?',
      steps: [
        '1 %: $0.20 + 0.70 \\times 0.01 = 20.7$ %. 11 %: $0.20 + 0.077 = 27.7$ %. 60 %: $0.20 + 0.42 = 62$ %.',
        'With high first-pass metabolism the swallowed part adds almost nothing; with a well-absorbed drug it would triple systemic exposure — and a spacer, which cuts $f_s$, would then matter greatly.',
        'Settling: $v = 1000 \\times 9.81 \\times (3\\times10^{-6})^2/(18 \\times 1.81\\times10^{-5}) = 0.27$ mm/s, so 1 mm takes about 3.7 s — a 5–10 s breath-hold gives particles time to deposit.'
      ],
      a: '20.7 %, 27.7 % and 62 %; about 4 seconds to settle 1 mm.'
    }
  ],
  quiz: [
    { q: 'A particle of 8 µm aerodynamic diameter inhaled from a device mostly…', choices: ['reaches the alveoli', 'impacts in the mouth and throat and is swallowed', 'is exhaled', 'dissolves in the nose'], a: 1, why: 'Its inertia keeps it going straight at the bends of the throat, where it impacts.' },
    { q: 'Why are ipratropium and tiotropium quaternary ammonium compounds?', choices: ['to make them volatile', 'their permanent charge keeps absorption of the swallowed part, and entry into the brain, very low', 'to increase their oral bioavailability', 'to make them acid-stable'], a: 1, why: 'A permanently charged molecule barely crosses membranes, so systemic antimuscarinic effects are small.' },
    { q: 'What is the aerodynamic diameter (µm) of a 2 µm sphere of density 2000 kg/m³?', answer: 2.83, unit: 'µm', why: 'd_a = 2 × √2 = 2.83 µm.' },
    { q: 'Most of the dose of an inhaled corticosteroid from a typical metered-dose inhaler without a spacer is swallowed.', a: true, why: 'Lung deposition is often 10–40 %; much of the rest impacts in the throat and is swallowed.' },
    { q: 'Holding the breath for several seconds after inhaling helps because…', choices: ['it warms the drug', 'particles of 1–5 µm need seconds to settle onto the airway walls', 'it dissolves the propellant', 'it slows the heart'], a: 1, why: 'Sedimentation velocities are fractions of a millimetre per second; without a pause many particles are breathed out.' }
  ],
  problems: [
    { q: 'A 3 µm (aerodynamic) particle settles at 0.271 mm/s. How fast does a 5 µm one settle?', answer: 0.752, unit: 'mm/s', tol: 0.02, steps: ['Stokes: $v \\propto d_a^2$.', '$0.271 \\times (5/3)^2 = 0.271 \\times 2.78 = 0.752$ mm/s.'] },
    { q: 'An inhaler deposits 15 % in the lung and 80 % is swallowed; the drug\'s oral bioavailability is 11 %. What percentage of the dose reaches the circulation?', answer: 23.8, unit: '%', tol: 0.02, steps: ['$F_\\text{sys} = 0.15 + 0.80 \\times 0.11 = 0.15 + 0.088 = 0.238$.'] }
  ],
  applications: [
    'Matching devices and spacers to a patient\'s inspiratory flow and coordination.',
    'Engineering particle size and density for dry-powder inhalers.',
    'Moving metered-dose inhalers to low-global-warming propellants.',
    'Prodrug steroids activated in the lung and quaternary antimuscarinics that stay there.'
  ],
  history: 'The first pressurised metered-dose inhaler appeared in 1956, reportedly after the teenage daughter of a pharmaceutical company\'s president asked why her asthma medicine could not come in a spray can like hairspray. Salbutamol followed in 1969, and CFC propellants were phased out under the Montreal Protocol (1987) in favour of HFAs from the 1990s.'
},

{
  id: 'vaccines-overview', parent: 'classes-topic', title: 'Vaccines', level: 1,
  short: 'A vaccine presents a pathogen\'s antigens — or instructions to make them — together with an alarm signal, so the immune system learns before the real infection. Vaccines range from live attenuated viruses to purified proteins, conjugates, vectors and mRNA; adjuvants, the cold chain and preservatives are their pharmaceutics, and efficacy and herd immunity their arithmetic.',
  keywords: ['vaccine', 'antigen', 'live attenuated', 'inactivated', 'subunit', 'virus-like particle', 'toxoid', 'conjugate vaccine', 'viral vector', 'mRNA vaccine', 'lipid nanoparticle', 'adjuvant', 'aluminium hydroxide', 'MF59', 'AS01', 'cold chain', 'vaccine vial monitor', 'thiomersal', 'vaccine efficacy', 'herd immunity', 'R0', 'anaphylaxis'],
  prereq: ['biologics', 'lipid-nanoparticles', 'medicine:vaccines', 'medicine:adaptive-immunity'],
  related: ['vaccine-formulation', 'stability-testing', 'shelf-life', 'preservatives', 'pharmacovigilance', 'clinical-trials', 'lyophilisation', 'medicine:epidemiology', 'biology:animal-immunity'],
  body: `
A vaccine teaches the immune system to recognise a pathogen before meeting it, by presenting its **antigens** — or instructions to make them — in a way that also sets off an alarm. Unlike most medicines, vaccines are given to healthy people, often babies, once or a few times; so the bar for safety is very high, and quality depends on keeping a fragile biological product intact from factory to arm.

### Types of vaccine
| Type | What is in it | Examples | Formulation notes |
|---|---|---|---|
| Live attenuated | a weakened virus or bacterium that replicates a little | measles, mumps, rubella; varicella; yellow fever; rotavirus; BCG | usually freeze-dried, reconstituted just before use and used within hours; the most heat-sensitive; not for people with weakened immunity or in pregnancy |
| Inactivated | whole killed virus or bacterium | inactivated polio, hepatitis A, rabies | often adsorbed on an adjuvant |
| Subunit, recombinant | purified proteins or virus-like particles | hepatitis B (made in yeast, 1986), HPV (2006) | aluminium adjuvants; freezing ruins them |
| Toxoid | inactivated bacterial toxin | tetanus, diphtheria | formaldehyde-treated toxin on aluminium salts |
| Conjugate | capsule sugar linked to a carrier protein | Hib, pneumococcal, meningococcal | turns a weak T-independent response, poor in infants, into a T-dependent one with memory |
| Viral vector | a harmless virus carrying the antigen's gene | Ebola (2019), some COVID-19 vaccines | frozen or refrigerated |
| mRNA | messenger RNA in lipid nanoparticles | COVID-19 (2020), RSV (2024) | modified nucleosides avoid innate sensing; initially frozen storage (see [[lipid-nanoparticles]]) |

### Adjuvants
Purified antigens are poorly immunogenic on their own; **adjuvants** supply the danger signal and help present the antigen. **Aluminium salts** (hydroxide, phosphate), used since the 1920s, adsorb the antigen and activate innate immunity; how well they adsorb depends on charge — the salt's surface charge against the antigen's isoelectric point. **Oil-in-water emulsions** of squalene (MF59, AS03) boost influenza vaccines, particularly for older people and in pandemics, when they stretch the antigen supply. **AS01**, liposomes containing a TLR4 agonist (monophosphoryl lipid A) and the saponin QS-21, gives a recombinant shingles vaccine an efficacy of about 90 % even in people over 70. **CpG** oligonucleotides stimulate TLR9.

### Stability and the cold chain
Most vaccines are stored at **2–8 °C** ([[vaccine-formulation]]). Heat damages all of them, live vaccines fastest; freezing ruins aluminium-adjuvanted vaccines, whose particles aggregate irreversibly (the "shake test" looks for fast-settling flakes). **Vaccine vial monitors** — heat-sensitive labels that darken with cumulative heat exposure, introduced by WHO and UNICEF in 1996 — let health workers see whether a vial has had too much, the same idea as Arrhenius-based shelf life ([[shelf-life]]). Multi-dose vials need a **preservative** such as 2-phenoxyethanol, or thiomersal in some; thiomersal was removed from routine childhood vaccines in the US and Europe around 2001 as a precaution, and later studies found no harm. The first mRNA vaccines of 2020 needed deep-frozen storage (one of them at −90 to −60 °C), because the RNA and lipid particles degrade faster when warmer; reformulation later allowed weeks in a refrigerator.

### Measuring benefit
**Vaccine efficacy** compares attack rates in a trial:

$$\\mathrm{VE} = 1 - \\frac{\\mathrm{AR}_v}{\\mathrm{AR}_u}$$

In the population, vaccination also protects people who are not immune by cutting transmission — **herd immunity**. If each case infects $R_0$ others in a fully susceptible population, transmission falls below one when a fraction $1 - 1/R_0$ is immune: measles, with $R_0$ of about 12–18, needs about 92–95 %, which with an imperfect vaccine means even higher coverage. Rare serious reactions are tracked by pharmacovigilance systems ([[pharmacovigilance]]); anaphylaxis occurs roughly once per million doses, which is why vaccination sites keep adrenaline and observe people for about 15 minutes.

> [!warn] Signs of anaphylaxis after a vaccine or medicine — swelling of the face, lips or throat, difficulty breathing, wheeze, a fast heartbeat, collapse — usually start within minutes: call your local emergency number; adrenaline (epinephrine) is the first treatment. Questions about which vaccines you or your child need belong with a doctor, nurse or pharmacist, following your national schedule.
`,
  ideas: [
    'Vaccines present antigens (or their genetic instructions) plus an alarm signal, creating memory before infection.',
    'Types range from live attenuated to inactivated, subunit, toxoid, conjugate, vector and mRNA; each has its own storage needs.',
    'Adjuvants (aluminium salts, emulsions, AS01, CpG) supply the danger signal; aluminium-adjuvanted vaccines must never freeze.',
    'The cold chain and vaccine vial monitors keep potency; multi-dose vials need preservatives.',
    'VE = 1 − AR_v/AR_u; herd immunity needs an immune fraction of 1 − 1/R₀.'
  ],
  pitfalls: [
    'Colder is always better for vaccines — Many vaccines, especially aluminium-adjuvanted ones, are destroyed by freezing; the target is 2–8 °C unless the product says otherwise.',
    'A vaccine with 95 % efficacy means 5 % of vaccinated people will catch the disease — Efficacy is the relative reduction in risk: vaccinated people\'s risk is 5 % of that of unvaccinated people in the same setting.',
    'Herd immunity needs everyone to be vaccinated — It needs the immune fraction to exceed 1 − 1/R₀, which depends on the disease; but for very contagious diseases such as measles that fraction is above 90 %.'
  ],
  formulas: [
    {
      name: 'Vaccine efficacy',
      expr: 'VE = 1 - ARv/ARu', tex: '\\mathrm{VE} = 1 - \\dfrac{\\mathrm{AR}_v}{\\mathrm{AR}_u}',
      vars: {
        VE: { name: 'vaccine efficacy', q: 'ratio', unit: '%', tex: '\\mathrm{VE}' },
        ARv: { name: 'attack rate among vaccinated people', q: 'ratio', unit: '%', value: 0.1, tex: '\\mathrm{AR}_v' },
        ARu: { name: 'attack rate among unvaccinated people', q: 'ratio', unit: '%', value: 2, tex: '\\mathrm{AR}_u' }
      },
      note: 'Efficacy from a randomised trial; "effectiveness" is the same measure in routine use. It equals 1 − relative risk.',
      practice: { unknowns: ['VE', 'ARv'] },
      stories: {
        VE: 'In a trial, {ARu} of the placebo group and {ARv} of the vaccinated group fell ill. What is the vaccine\'s efficacy?',
        ARv: 'A vaccine with efficacy {VE} is used where {ARu} of unvaccinated people fall ill. What attack rate is expected among the vaccinated?'
      }
    },
    {
      name: 'Coverage needed for herd immunity',
      expr: 'Vc = (1 - 1/R0)/E', tex: 'V_c = \\dfrac{1 - 1/R_0}{E}',
      vars: {
        Vc: { name: 'vaccination coverage needed', q: 'ratio', unit: '%', tex: 'V_c' },
        R0: { name: 'basic reproduction number', value: 15, tex: 'R_0' },
        E: { name: 'vaccine effectiveness against infection', q: 'ratio', unit: '%', value: 97 }
      },
      note: 'A homogeneous-mixing model; real populations cluster, so pockets of low coverage allow outbreaks even when the average is high. A result above 100 % means herd immunity cannot be reached with that vaccine alone.',
      stories: {
        Vc: 'A disease has R₀ = {R0} and the vaccine is {E} effective. What coverage is needed for herd immunity?',
        E: 'For a disease with R₀ = {R0}, coverage reaches {Vc}. How effective must the vaccine be?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a trial',
      q: 'In a trial with 20 000 people in each arm, 8 vaccinated and 160 placebo recipients fall ill. What is the vaccine efficacy?',
      steps: [
        'Attack rates: $8/20\\,000 = 0.04$ % and $160/20\\,000 = 0.8$ %.',
        '$\\mathrm{VE} = 1 - 0.04/0.8 = 1 - 0.05 = 95$ %.',
        'The absolute risk fell from 0.8 % to 0.04 % during the trial; the efficacy describes the relative reduction.'
      ],
      a: '95 %.'
    },
    {
      title: 'Why measles needs two doses',
      q: 'Measles has $R_0$ ≈ 15. What coverage is needed if two doses protect 97 % of people, and if one dose protects 93 %?',
      steps: [
        'Threshold immune fraction: $1 - 1/15 = 93.3$ %.',
        'Two doses: $0.933/0.97 = 96.2$ % coverage.',
        'One dose: $0.933/0.93 = 100.4$ % — impossible: a single dose cannot give herd immunity against measles, whatever the coverage.'
      ],
      a: 'About 96 % coverage with two doses; unreachable with one.'
    }
  ],
  quiz: [
    { q: 'Why are polysaccharide antigens conjugated to a carrier protein in vaccines for infants?', choices: ['to make them heat-stable', 'to turn a weak T-independent response into a T-dependent one with memory', 'to replace the adjuvant', 'to slow absorption'], a: 1, why: 'Infants respond poorly to pure polysaccharides; the protein carrier recruits T-cell help, class switching and memory.' },
    { q: 'An aluminium-adjuvanted vaccine that has been frozen…', choices: ['is fine once thawed', 'should not be used: the adjuvant particles aggregate irreversibly and potency and safety suffer', 'becomes more potent', 'only needs shaking'], a: 1, why: 'Freezing destroys the adsorbed gel structure; the shake test reveals the fast-settling aggregates.' },
    { q: 'For a disease with $R_0$ = 4, what fraction of the population (in %) must be immune for herd immunity?', answer: 75, unit: '%', why: '1 − 1/4 = 0.75.' },
    { q: 'Live attenuated vaccines are generally the most heat-stable vaccines.', a: false, why: 'Live vaccines must keep the organism viable; they are usually the most heat-sensitive and are freeze-dried for that reason.' },
    { q: 'mRNA vaccines contain modified nucleosides such as N1-methylpseudouridine mainly to…', choices: ['make the RNA replicate', 'reduce innate immune recognition of the RNA and increase protein production', 'bind the lipid nanoparticle', 'allow storage at room temperature'], a: 1, why: 'Unmodified RNA triggers innate sensors that shut down translation; the modification lets the cell make more antigen.' }
  ],
  problems: [
    { q: 'In a trial, 5 % of placebo recipients and 1.5 % of vaccinated people fall ill. What is the vaccine efficacy (in %)?', answer: 70, unit: '%', tol: 0.01, steps: ['$\\mathrm{VE} = 1 - 1.5/5 = 1 - 0.30 = 0.70$.'] },
    { q: 'A disease has $R_0$ = 6 and the vaccine is 90 % effective. What coverage (in %) is needed for herd immunity?', answer: 92.6, unit: '%', tol: 0.01, steps: ['Threshold: $1 - 1/6 = 0.833$.', 'Coverage: $0.833/0.90 = 0.926$ = 92.6 %.'] }
  ],
  applications: [
    'Cold-chain design, vaccine vial monitors and controlled-temperature chains for the last mile.',
    'Adjuvants for older adults and antigen-sparing in pandemics.',
    'Lipid-nanoparticle formulation of mRNA vaccines.',
    'Setting coverage targets for elimination programmes.'
  ],
  history: 'Edward Jenner used cowpox to protect against smallpox in 1796; Louis Pasteur made attenuated vaccines for chicken cholera and rabies in the 1880s. Alexander Glenny found in 1926 that aluminium salts strengthen toxoid vaccines. Smallpox was declared eradicated in 1980, and in 2020 mRNA vaccines, built on the modified nucleosides of Katalin Karikó and Drew Weissman (Nobel Prize 2023), went from genetic sequence to authorisation in under a year.'
}

);
