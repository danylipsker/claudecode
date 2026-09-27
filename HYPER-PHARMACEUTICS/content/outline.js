/* HYPER-PHARMACEUTICS · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold
 * (a planned concept never takes the id of a branch or topic — the validator checks).
 *
 * Hyper Pharmaceutics is the science of turning a molecule into a medicine that works: physical
 * pharmacy, stability, biopharmaceutics, pharmacokinetics and pharmacodynamics, dosage forms from
 * tablets to sterile injections and nanomedicines, pharmaceutical calculations, the main classes of
 * medicines, and quality, safety and regulation. The body is linked as medicine:<id>, the chemistry
 * as chemistry:<id>, the biology as biology:<id>, the mathematics as math:<id>.
 */
Hyper.add(
  {
    id: 'pharmaceutics', kind: 'root', title: 'Hyper Pharmaceutics',
    short: 'How a molecule becomes a medicine that works: dissolving, staying stable, getting absorbed, reaching the right level for the right time — in a tablet, a liquid, an injection or an inhaler — made to quality and used safely.',
    links: [['Pharmacy calculators', '#/tools/pharmcalc', 'calc'], ['Formulation & stability lab', '#/tools/formulation', 'flask'], ['PK simulator', '#/tools/pk', 'graph']],
    body: 'An active ingredient on its own is rarely a medicine. It has to dissolve, but not too soon; survive two years on a shelf in a humid bathroom; cross the gut wall and dodge the liver; reach a concentration in the blood that works without harming; and arrive in a form a patient can take — a tablet that does not crumble, a sterile injection, a patch, an inhaler that delivers particles small enough to reach the lungs. Pharmaceutics is the science and engineering of all that, and pharmacokinetics is its arithmetic.\n\nStart with shelf life and the Arrhenius equation, use the [pharmacy calculators](#/tools/pharmcalc), the [formulation and stability lab](#/tools/formulation) or the [pharmacokinetics simulator](#/tools/pk). Every formula on these pages is a calculator that solves for any of its variables.\n\n> [!warn] Hyper Pharmaceutics is for learning. Its numbers and examples are illustrative: they are not doses, prescriptions or instructions for preparing medicines. Medicines are prescribed, prepared and dispensed by qualified professionals following the product information and the law; ask a pharmacist or doctor about any medicine you take.'
  },

  /* ================================================================ FOUNDATIONS */
  {
    id: 'pharmacy-foundations', kind: 'branch', parent: 'pharmaceutics', title: 'Foundations', icon: 'pill', hue: 294,
    short: 'What a medicine is and how it is named, how new drugs are discovered and developed, how regulators approve them, and the standards and good manufacturing practice that make every batch the same.',
    body: 'A new medicine takes ten to fifteen years and, by common estimates, one to two billion dollars to reach patients, and most candidates fail on the way — usually because they do not work well enough in people or are not safe enough. Those that succeed are described in pharmacopoeias, made under good manufacturing practice, and known by an international non-proprietary name that is the same everywhere, whatever the brand on the box.'
  },
  { id: 'what-medicines-are', kind: 'topic', parent: 'pharmacy-foundations', title: 'Medicines and their making', short: 'What a medicine is, drug names, discovery, development phases, regulators, pharmacopoeias and GMP.',
    plan: [['what-is-a-drug', 'What a medicine is'], ['drug-names', 'Drug names: INN, generic and brand'], ['drug-discovery', 'Discovering new drugs'], ['drug-development', 'From laboratory to patient'],
           ['regulation-approval', 'Regulators and approval'], ['pharmacopoeias', 'Pharmacopoeias and standards'], ['gmp', 'Good manufacturing practice']] },

  /* ================================================================ PHYSICAL PHARMACY */
  {
    id: 'physical-pharmacy', kind: 'branch', parent: 'pharmaceutics', title: 'Physical Pharmacy', icon: 'beaker', hue: 200,
    short: 'The physical chemistry of medicines: solid forms and polymorphs, solubility, ionisation and pKa, pH and solubility, log P and log D, buffers, complexation; particle size, diffusion, dissolution, surfactants, colloids, rheology and tonicity.',
    body: 'Whether a drug works often depends less on its pharmacology than on its physics. Two crystal forms of the same molecule can dissolve at different rates; a weak acid is thousands of times more soluble at one pH than another; halving the particle size doubles the surface that dissolves. Physical pharmacy is the toolkit — Henderson–Hasselbalch, Noyes–Whitney, Fick, Stokes — that formulators use to predict and control what a medicine will do before a patient ever takes it.'
  },
  { id: 'solutions-solubility', kind: 'topic', parent: 'physical-pharmacy', title: 'Solubility and ionisation', short: 'Solid forms, solubility, ionisation and pKa, pH and solubility, log P and log D, buffers, complexation.',
    plan: [['solid-state', 'Crystals, polymorphs and amorphous forms'], ['solubility-pharm', 'Solubility'], ['ionisation-pka', 'Ionisation and pKa'], ['ph-solubility', 'pH and solubility'],
           ['partition-logp', 'Partition coefficient, log P and log D'], ['buffers-pharm', 'Buffers and buffer capacity'], ['complexation', 'Complexation and cyclodextrins']] },
  { id: 'interfaces-flow', kind: 'topic', parent: 'physical-pharmacy', title: 'Particles, surfaces and flow', short: 'Particle size, diffusion, dissolution rate, surfactants, colloids, rheology, osmolarity and tonicity.',
    plan: [['particle-size', 'Particle size and surface area'], ['diffusion-fick', 'Diffusion and Fick\'s law'], ['dissolution-rate', 'Dissolution and the Noyes–Whitney equation'], ['surfactants', 'Surfactants, micelles and HLB'],
           ['colloids', 'Colloids and dispersions'], ['rheology', 'Rheology of pharmaceutical systems'], ['osmolarity-tonicity', 'Osmolarity and tonicity']] },

  /* ================================================================ STABILITY */
  {
    id: 'stability-branch', kind: 'branch', parent: 'pharmaceutics', title: 'Drug Stability', icon: 'clock', hue: 30,
    short: 'How medicines degrade and how long they last: hydrolysis, oxidation and photolysis, reaction order, shelf life and the Arrhenius equation, ICH stability testing, light, oxygen and moisture, packaging and excipient compatibility.',
    body: 'Every medicine starts to fall apart the moment it is made. Esters hydrolyse, phenols oxidise, some molecules break in light; the reactions are slow, but a medicine must keep at least 90 % of its labelled strength until its expiry date — usually two to five years. Stability science measures the reactions, speeds them up at higher temperature to predict the shelf life quickly, and then designs the formulation and the package to slow them down.'
  },
  { id: 'stability-topic', kind: 'topic', parent: 'stability-branch', title: 'Stability and shelf life', short: 'Degradation pathways, reaction order, shelf life and Arrhenius, ICH testing, light and moisture, packaging, compatibility.',
    plan: [['degradation-pathways', 'How drugs degrade'], ['reaction-order', 'Reaction order and rate constants'], ['shelf-life', 'Shelf life and the Arrhenius equation'], ['stability-testing', 'ICH stability testing'],
           ['photostability', 'Light, oxygen and moisture'], ['packaging', 'Packaging and container closure'], ['excipient-compatibility', 'Drug–excipient compatibility']] },

  /* ================================================================ BIOPHARMACEUTICS */
  {
    id: 'biopharmaceutics', kind: 'branch', parent: 'pharmaceutics', title: 'Biopharmaceutics', icon: 'body', hue: 160,
    short: 'How a dosage form releases its drug into the body: routes of administration, absorption from the gut, membrane transport, first-pass metabolism, the BCS, food effects; bioavailability, dissolution testing and f2, IVIVC and bioequivalence.',
    body: 'Two tablets with the same amount of the same drug can give very different blood levels. The difference lies in biopharmaceutics: how fast the drug dissolves, whether it can cross the gut wall, how much the liver removes on the first pass. The Biopharmaceutics Classification System sorts drugs by solubility and permeability and tells regulators when a laboratory dissolution test can stand in for a study in people — the basis for most generic medicines.'
  },
  { id: 'absorption-topic', kind: 'topic', parent: 'biopharmaceutics', title: 'Getting into the body', short: 'Routes, absorption from the gut, crossing membranes, first-pass metabolism, the BCS, food effects.',
    plan: [['routes', 'Routes of administration'], ['gi-absorption', 'Absorption from the gut'], ['membrane-transport-pharm', 'Crossing membranes: passive and carried'], ['first-pass', 'First-pass metabolism'],
           ['bcs', 'The Biopharmaceutics Classification System'], ['food-effects', 'Food effects']] },
  { id: 'bioavailability-topic', kind: 'topic', parent: 'biopharmaceutics', title: 'Bioavailability and equivalence', short: 'Bioavailability, dissolution testing, f2, IVIVC and bioequivalence.',
    plan: [['bioavailability', 'Bioavailability'], ['dissolution-testing', 'Dissolution testing'], ['f2-similarity', 'Comparing dissolution profiles: f2'], ['ivivc', 'In vitro–in vivo correlation'], ['bioequivalence', 'Bioequivalence and generics']] },

  /* ================================================================ PHARMACOKINETICS */
  {
    id: 'pharmacokinetics-branch', kind: 'branch', parent: 'pharmaceutics', title: 'Pharmacokinetics', icon: 'graph', hue: 220,
    short: 'What the body does to a drug, in numbers: ADME, volume of distribution, clearance, half-life, AUC and Cmax, protein binding; one- and two-compartment models, infusions, oral absorption, multiple dosing, loading doses, non-linear kinetics and NCA; kidney and liver impairment, TDM, children and older people.',
    body: 'Pharmacokinetics turns a dose into a concentration–time curve. Three numbers carry most of it: the volume of distribution (how widely the drug spreads), the clearance (how fast the body removes it) and, from the two, the half-life. With them you can predict the peak and trough of a repeated dose, how long it takes to reach steady state, what loading dose gets there at once, and how to adjust when the kidneys fail. The models are simple exponentials — and remarkably good. The examples here use hypothetical drugs: real dosing follows the product information.'
  },
  { id: 'pk-basics', kind: 'topic', parent: 'pharmacokinetics-branch', title: 'The basic parameters', short: 'ADME, volume of distribution, clearance, half-life, AUC and Cmax, protein binding.',
    plan: [['adme', 'ADME'], ['volume-distribution', 'Volume of distribution'], ['clearance', 'Clearance'], ['half-life', 'Half-life'], ['auc-cmax', 'AUC, Cmax and exposure'], ['protein-binding', 'Protein binding']] },
  { id: 'pk-models', kind: 'topic', parent: 'pharmacokinetics-branch', title: 'Models and dosing', short: 'One-compartment IV bolus, infusion, oral absorption, multiple dosing, loading doses, two-compartment and non-linear kinetics, NCA.',
    plan: [['one-compartment-iv', 'The one-compartment IV bolus'], ['iv-infusion', 'Intravenous infusion'], ['oral-absorption-pk', 'Oral absorption: the Bateman function'], ['multiple-dosing', 'Multiple dosing and accumulation'],
           ['loading-dose', 'Loading and maintenance doses'], ['two-compartment', 'The two-compartment model'], ['nonlinear-pk', 'Non-linear pharmacokinetics'], ['nca', 'Non-compartmental analysis']] },
  { id: 'pk-special', kind: 'topic', parent: 'pharmacokinetics-branch', title: 'Special situations', short: 'Kidney impairment, hepatic clearance, therapeutic drug monitoring, children and older people.',
    plan: [['renal-adjustment', 'Dosing in kidney impairment'], ['hepatic-clearance', 'Hepatic clearance and extraction'], ['tdm', 'Therapeutic drug monitoring'], ['paediatric-geriatric', 'Children and older people']] },

  /* ================================================================ PHARMACODYNAMICS */
  {
    id: 'pharmacodynamics-branch', kind: 'branch', parent: 'pharmaceutics', title: 'Pharmacodynamics', icon: 'target', hue: 330,
    short: 'What a drug does to the body: receptors, agonists and antagonists, the dose–response curve and Emax model, potency and efficacy, the therapeutic index, tolerance, drug interactions, pharmacogenomics and PK/PD modelling.',
    body: 'Most drugs work by binding to a target — a receptor, an enzyme, a channel — and the response grows with the fraction of targets occupied until it levels off. That sigmoid dose–response curve, with its EC50 and Emax, lets pharmacologists compare drugs, predict the effect of a change in dose, and see how close the useful dose is to the harmful one. Linking it to pharmacokinetics tells you how the effect rises and falls after each dose.'
  },
  { id: 'pd-topic', kind: 'topic', parent: 'pharmacodynamics-branch', title: 'How drugs act', short: 'Receptors, agonists and antagonists, dose–response, potency and efficacy, therapeutic index, tolerance, interactions, pharmacogenomics, PK/PD.',
    plan: [['receptors', 'Receptors and ligands'], ['agonists-antagonists', 'Agonists and antagonists'], ['dose-response', 'Dose–response and the Emax model'], ['potency-efficacy', 'Potency and efficacy'],
           ['therapeutic-index', 'Therapeutic index and window'], ['tolerance', 'Tolerance and dependence'], ['drug-interactions', 'Drug interactions'], ['pharmacogenomics', 'Pharmacogenomics'], ['pkpd', 'PK/PD modelling']] },

  /* ================================================================ SOLID DOSAGE FORMS */
  {
    id: 'solid-dosage', kind: 'branch', parent: 'pharmaceutics', title: 'Solid Dosage Forms', icon: 'capsule', hue: 45,
    short: 'Tablets and capsules, the most common medicines: powder flow, granulation, compression and compaction, excipients, coating, quality tests; hard and soft capsules, modified release and its kinetics, osmotic and gastro-retentive systems, orally disintegrating forms.',
    body: 'A tablet looks simple and is not. The powder must flow evenly into the die at thousands of tablets a minute, bond under pressure but not cap or laminate, disintegrate in the stomach — or deliberately not, for a modified-release tablet that must release over twelve hours. Every excipient has a job: fillers, binders, disintegrants, lubricants, coatings. The engineering is powder technology, and the tests that every batch must pass are written in the pharmacopoeias.'
  },
  { id: 'powders-tablets', kind: 'topic', parent: 'solid-dosage', title: 'Powders and tablets', short: 'Powder flow, granulation, compression and compaction, excipients, coating, quality tests.',
    plan: [['powder-flow', 'Powder flow'], ['granulation', 'Granulation'], ['compaction', 'Tablet compression and compaction'], ['excipients', 'Excipients and their jobs'], ['tablet-coating', 'Tablet coating'], ['tablet-testing', 'Tablet quality tests']] },
  { id: 'capsules-mr', kind: 'topic', parent: 'solid-dosage', title: 'Capsules and modified release', short: 'Hard and soft capsules, modified release, release kinetics, osmotic and gastro-retentive systems, orally disintegrating forms.',
    plan: [['capsules', 'Hard and soft capsules'], ['modified-release', 'Modified-release principles'], ['release-kinetics', 'Release kinetics: zero order, Higuchi, Korsmeyer'], ['osmotic-pumps', 'Osmotic and gastro-retentive systems'], ['odt', 'Orally disintegrating and chewable forms']] },

  /* ================================================================ LIQUIDS AND SEMISOLIDS */
  {
    id: 'liquid-semisolid', kind: 'branch', parent: 'pharmaceutics', title: 'Liquids and Semisolids', icon: 'beaker', hue: 190,
    short: 'Solutions, syrups and elixirs, suspensions and Stokes\' law, emulsions, preservatives; ointments, creams and gels, transdermal patches, suppositories, and nasal, ear and mouth products.',
    body: 'Liquids suit children, older people and anyone who cannot swallow a tablet — but a drug in water hydrolyses faster, a suspension settles, an emulsion separates, and anything wet grows microbes unless it is preserved. Semisolids carry drugs into and through the skin, where the outer layer is a formidable barrier that only small, moderately fat-soluble molecules cross easily. Each form has its physics, from Stokes\' law for settling particles to Fick\'s law for skin.'
  },
  { id: 'liquids-topic', kind: 'topic', parent: 'liquid-semisolid', title: 'Liquid dosage forms', short: 'Solutions, suspensions, emulsions, preservation.',
    plan: [['oral-solutions', 'Solutions, syrups and elixirs'], ['suspensions', 'Suspensions'], ['emulsions', 'Emulsions'], ['preservatives', 'Preservation of liquid medicines']] },
  { id: 'topical-topic', kind: 'topic', parent: 'liquid-semisolid', title: 'Skin and other routes', short: 'Ointments, creams and gels, transdermal delivery, suppositories, nasal, ear and mouth products.',
    plan: [['ointments-creams', 'Ointments, creams and gels'], ['transdermal', 'Transdermal delivery'], ['suppositories', 'Suppositories and pessaries'], ['nasal-otic', 'Nasal, ear and mouth products']] },

  /* ================================================================ STERILE PRODUCTS */
  {
    id: 'sterile-products', kind: 'branch', parent: 'pharmaceutics', title: 'Sterile Products', icon: 'syringe', hue: 260,
    short: 'Injections and eye drops, where a single microbe matters: parenteral routes, sterilisation by heat, filtration and radiation, D-values, z-values and F0, aseptic processing and cleanrooms, endotoxins, formulating injections, freeze-drying and ophthalmic products.',
    body: 'An injection bypasses every defence the body has, so it must be sterile, free of fever-causing endotoxins, and close to the body\'s own tonicity and pH. Sterility cannot be tested into a product — a test of twenty vials cannot find one contaminated vial in a thousand — so it is built in: validated sterilisation cycles measured in log reductions, or aseptic filling in cleanrooms with air cleaner than an operating theatre. These pages explain the science; manufacturing follows GMP and the pharmacopoeias.'
  },
  { id: 'sterile-topic', kind: 'topic', parent: 'sterile-products', title: 'Sterile products and parenterals', short: 'Parenteral routes, sterilisation methods, D-value, z-value and F0, aseptic processing, endotoxins, injections, freeze-drying, eye preparations.',
    plan: [['parenteral-routes', 'Parenteral routes'], ['sterilisation-methods', 'Sterilisation methods'], ['sterility-assurance', 'D-value, z-value and F0'], ['aseptic-processing', 'Aseptic processing and cleanrooms'],
           ['pyrogens-endotoxins', 'Pyrogens and endotoxins'], ['injectable-formulation', 'Formulating injections'], ['lyophilisation', 'Freeze-drying'], ['ophthalmic', 'Eye preparations']] },

  /* ================================================================ ADVANCED DELIVERY */
  {
    id: 'advanced-delivery', kind: 'branch', parent: 'pharmaceutics', title: 'Advanced Drug Delivery', icon: 'sparkle', hue: 120,
    short: 'New ways to get drugs where they are needed: inhalers and the aerodynamics of particles, nanoparticles and liposomes, lipid nanoparticles for mRNA, targeted delivery, formulating proteins and antibodies, vaccines and adjuvants, long-acting depots and implants, and 3-D-printed personalised medicines.',
    body: 'Many of the most important modern medicines would be useless as a simple tablet: proteins are digested, mRNA is destroyed in minutes, and some drugs are too toxic to spread through the whole body. Advanced delivery wraps them in lipid particles, attaches them to antibodies, releases them from an implant over months, or turns them into aerosols of exactly the right size to settle deep in the lungs. The mRNA vaccines of 2020 depended as much on their lipid nanoparticles as on the RNA inside.'
  },
  { id: 'advanced-topic', kind: 'topic', parent: 'advanced-delivery', title: 'New ways to deliver', short: 'Inhalation, nanoparticles and liposomes, lipid nanoparticles, targeting, biologics, vaccines, depots and implants, 3-D printing.',
    plan: [['inhalation', 'Inhaled medicines and particle size'], ['nanomedicine', 'Nanoparticles and liposomes'], ['lipid-nanoparticles', 'Lipid nanoparticles and mRNA'], ['targeted-delivery', 'Targeted drug delivery'],
           ['biologics-formulation', 'Formulating proteins and antibodies'], ['vaccine-formulation', 'Vaccines and adjuvants'], ['depot-implants', 'Long-acting injections and implants'], ['printing-medicines', '3-D printing and personalised medicines']] },

  /* ================================================================ CALCULATIONS */
  {
    id: 'pharmacy-calculations', kind: 'branch', parent: 'pharmaceutics', title: 'Pharmaceutical Calculations', icon: 'calc', hue: 80,
    short: 'The arithmetic of preparing and giving medicines: units, percent and ratio strength, dilution and concentration, alligation, milliequivalents and millimoles, isotonic solutions, doses by weight and surface area, infusion rates and scaling formulas.',
    body: 'Many serious medication errors are arithmetic errors — a misplaced decimal point, micrograms read as milligrams. Pharmaceutical calculations are simple, but they must be exact, checked twice and done in a consistent way. These pages teach the methods with worked examples on hypothetical preparations; real preparation and dosing follow the product information, local protocols and a second check by a qualified person.'
  },
  { id: 'calc-topic', kind: 'topic', parent: 'pharmacy-calculations', title: 'Calculations', short: 'Units, percent strength, dilution, alligation, mEq and mmol, isotonicity, dose calculations, infusion rates, compounding.',
    plan: [['units-pharmacy', 'Units, weights and measures'], ['percent-strength', 'Percent and ratio strength'], ['dilution-concentration', 'Dilution and concentration'], ['alligation', 'Alligation'],
           ['meq-mmol', 'Milliequivalents and millimoles'], ['isotonic-calculations', 'Making solutions isotonic'], ['dose-calculations', 'Dose calculations by weight and surface area'], ['infusion-rates', 'Infusion rates'], ['compounding', 'Compounding and scaling formulas']] },

  /* ================================================================ CLASSES */
  {
    id: 'drug-classes', kind: 'branch', parent: 'pharmaceutics', title: 'Medicines by Class', icon: 'pill', hue: 5,
    short: 'How the main families of medicines work and what makes them safe or risky: pain relievers, antibiotics, antivirals, heart and blood-pressure medicines, medicines for the brain and mind, for diabetes, for cancer, biological medicines and biosimilars, lung medicines and vaccines.',
    body: 'Thousands of medicines fall into a few dozen families that share a target and a mechanism — and therefore their benefits, side effects and interactions. Knowing the family tells you most of what matters about a new name. These pages explain mechanisms, formulation choices and safety, using generic names only; they do not give doses or tell anyone what to take.'
  },
  { id: 'classes-topic', kind: 'topic', parent: 'drug-classes', title: 'Medicine classes', short: 'Pain relievers, antimicrobials, antivirals, cardiovascular, brain and mind, diabetes, cancer, biologics, lungs, vaccines.',
    plan: [['analgesics', 'Pain relievers'], ['antimicrobials', 'Antibiotics and antimicrobials'], ['antivirals', 'Antivirals'], ['cardiovascular-drugs', 'Heart and blood-pressure medicines'], ['cns-drugs', 'Medicines for the brain and mind'],
           ['diabetes-drugs', 'Medicines for diabetes'], ['oncology-drugs', 'Cancer medicines'], ['biologics', 'Biological medicines and biosimilars'], ['respiratory-drugs', 'Medicines for the lungs'], ['vaccines-overview', 'Vaccines']] },

  /* ================================================================ QUALITY AND SAFETY */
  {
    id: 'quality-safety', kind: 'branch', parent: 'pharmaceutics', title: 'Quality, Safety and Regulation', icon: 'shield', hue: 150,
    short: 'Quality by design, analytical methods and validation, quality control and batch release, falsified medicines; pharmacovigilance, adverse drug reactions, medication errors, clinical trials and antimicrobial stewardship.',
    body: 'Quality means every tablet in every batch contains what the label says, dissolves as it should and stays that way until it expires. It is designed in, measured with validated methods — often HPLC — and confirmed before release. Safety continues after approval: rare side effects appear only when millions of people take a medicine, so reports from patients and professionals feed a system of pharmacovigilance that can change a label or withdraw a product.'
  },
  { id: 'quality-topic', kind: 'topic', parent: 'quality-safety', title: 'Quality', short: 'Quality by design, analytical methods, quality control and release, falsified medicines.',
    plan: [['qbd', 'Quality by design'], ['analytical-methods', 'Analytical methods: HPLC and validation'], ['quality-control', 'Quality control and batch release'], ['falsified-medicines', 'Falsified medicines']] },
  { id: 'safety-topic', kind: 'topic', parent: 'quality-safety', title: 'Safety', short: 'Pharmacovigilance, adverse reactions, medication errors, clinical trials, antimicrobial stewardship.',
    plan: [['pharmacovigilance', 'Pharmacovigilance'], ['adverse-reactions', 'Adverse drug reactions'], ['medication-errors', 'Medication errors'], ['clinical-trials', 'Clinical trials'], ['antimicrobial-stewardship', 'Antimicrobial stewardship']] }
);
