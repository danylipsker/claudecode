/* HYPER-MEDICINE · content/pharmacology.js — How medicines work: targets and receptors,
 * what the body does to a medicine, half-life and dosing, dose–response and the therapeutic
 * index, side effects and interactions, clinical trials, pain relief and anaesthesia.
 * The principles only: every calculation uses a clearly hypothetical drug, never real doses.
 * Simulations in sims/cancer-medicines.js (cm-drug-levels, cm-dose-response, cm-interaction, cm-trial). */
Hyper.add(

{
  id: 'how-drugs-work', parent: 'pharmacology', title: 'How medicines work', level: 1,
  short: 'Almost every medicine works by fitting a molecular target — a receptor, an enzyme, an ion channel or a transporter — and switching it on, blocking it or changing how it behaves. How tightly it binds and what it does once bound decide how much is needed and what it can achieve.',
  keywords: ['medicine', 'drug', 'receptor', 'agonist', 'antagonist', 'partial agonist', 'enzyme inhibitor', 'ion channel', 'transporter', 'affinity', 'efficacy', 'potency', 'selectivity', 'occupancy', 'Kd', 'lock and key', 'pharmacodynamics'],
  prereq: ['cell-structure', 'synapses', 'chemistry:amino-acids-proteins', 'chemistry:enzyme-kinetics'],
  related: ['pharmacokinetics', 'dose-response', 'side-effects-interactions', 'pain-relief', 'chemistry:stereoisomers', 'chemistry:equilibrium-constant'],
  body: `
When Grace uses her asthma inhaler, a fine mist of a medicine reaches the muscle wrapped around her narrowed airways. There its molecules settle into receptors on the muscle cells — the same receptors that adrenaline uses in a moment of fright — and switch them on. The muscle relaxes, the airways widen, and within minutes she breathes easily. One small molecule, one kind of target, one effect: that is how almost every medicine works.

### Targets: the locks medicines fit
A medicine is a molecule shaped to fit a particular protein in the body, the way a key fits a lock. The main kinds of target:

| Target | What the medicine does | Examples (by class) |
|---|---|---|
| **Receptors** (signal detectors on or in cells) | switch them on (agonists) or block them (antagonists) | asthma relievers switch on β₂ receptors; beta blockers block β₁ receptors in the heart; opioids switch on opioid receptors |
| **Enzymes** | block a chemical reaction | statins block an enzyme that makes cholesterol; aspirin permanently blocks cyclo-oxygenase |
| **Ion channels** | open or block pores in the membrane | local anaesthetics block sodium channels in nerves, stopping pain signals |
| **Transporters** | stop a pump or carrier | some antidepressants block the reuptake of serotonin; proton-pump inhibitors stop acid secretion |
| **Microbes and cancer cells** | hit structures the body's own cells lack or need less | penicillins break bacterial cell walls |

About a third of all approved medicines act on a single family of receptors, the G-protein-coupled receptors. Other medicines replace what is missing (insulin, thyroid hormone), are antibodies that seize a signalling molecule, or work by simple chemistry (antacids neutralise acid).

### Binding: affinity and efficacy
Binding is reversible: molecules attach and let go thousands of times a second, and at any moment a fraction of the receptors is occupied. By the law of mass action ([[chemistry:equilibrium-constant|equilibrium]]) that fraction is

$$f = \\frac{C}{C + K_d}$$

where $C$ is the concentration of the medicine at the target and $K_d$ is its **dissociation constant** — the concentration that occupies half the receptors. A small $K_d$ means high **affinity**: little medicine is needed. Occupancy is only half the story. An **agonist** also has **efficacy** — once bound, it activates the receptor. An **antagonist** binds but does nothing, simply blocking the natural messenger; naloxone reverses an opioid overdose this way. A **partial agonist** activates only partly, so it can calm an overactive system without overshooting.

A competitive antagonist makes the agonist look weaker: it takes up receptors, so more agonist is needed for the same occupancy — the curve of effect against dose shifts to the right without changing its top. See [[dose-response|Dose, response and safety]].

### Selectivity, and why side effects happen
Few medicines are perfectly selective. A drug meant for the β₁ receptors of the heart may also touch the β₂ receptors of the airways, which is why some beta blockers can worsen asthma. Even a perfectly selective drug can cause side effects when its target also exists elsewhere — the enzyme that aspirin blocks to relieve pain also protects the stomach lining ([[side-effects-interactions]]). Shape matters down to mirror images: two forms of the same molecule can act very differently ([[chemistry:stereoisomers|stereoisomers]]).

### Getting there
A medicine works only if enough of it reaches the target, for long enough. That is the other half of pharmacology — what the body does to the medicine — in [[pharmacokinetics]] and [[half-life-dosing|Half-life and dosing]].

> [!note] These pages explain principles and use hypothetical drugs for calculations. They are not advice on what to take: questions about your own medicines are best asked of a doctor or pharmacist, who know your health and your other medicines.
`,
  ideas: [
    'Medicines work by binding a target — a receptor, enzyme, ion channel or transporter — and changing what it does.',
    'Agonists activate receptors, antagonists block them, partial agonists activate them only partly.',
    'Occupancy follows the law of mass action: f = C/(C + Kd); a small Kd means high affinity.',
    'Affinity (how tightly it binds) and efficacy (what it does once bound) are different properties.',
    'Side effects arise when the target, or a similar one, also exists in other tissues.'
  ],
  pitfalls: [
    'A stronger medicine is one that works at a lower dose — That is potency. What matters more is efficacy: the largest effect it can produce. A potent drug is not necessarily a more effective one.',
    'An antagonist does the opposite of the agonist — A pure antagonist does nothing by itself; it only blocks the natural messenger or an agonist from acting.',
    'A medicine acts only where it is needed — It travels everywhere the blood goes and acts on every tissue with its target, which is where many side effects come from.'
  ],
  formulas: [
    {
      name: 'Receptor occupancy',
      expr: 'f = C/(C + Kd)', tex: 'f = \\frac{C}{C + K_d}',
      vars: {
        f: { name: 'fraction of receptors occupied', q: 'ratio', unit: '%', tex: 'f' },
        C: { name: 'concentration of the medicine at the target', q: 'concentration', unit: 'nM', value: 10, tex: 'C' },
        Kd: { name: 'dissociation constant', q: 'concentration', unit: 'nM', value: 10, tex: 'K_d' }
      },
      note: 'The law of mass action for reversible binding to one kind of site (the Hill–Langmuir equation). Occupancy is not effect: some receptors give a full effect when only a few are occupied.',
      stories: { f: 'A hypothetical drug has a Kd of {Kd} and reaches {C} at its receptor. What fraction of the receptors is occupied?', C: 'What concentration of a drug with Kd = {Kd} occupies {f} of its receptors?' }
    },
    {
      name: 'Occupancy with a competitive antagonist',
      expr: 'f = C/(C + Kd*(1 + B/KB))', tex: 'f = \\frac{C}{C + K_d\\left(1 + B/K_B\\right)}',
      vars: {
        f: { name: 'fraction occupied by the agonist', q: 'ratio', unit: '%', tex: 'f' },
        C: { name: 'agonist concentration', q: 'concentration', unit: 'nM', value: 10, tex: 'C' },
        Kd: { name: 'agonist dissociation constant', q: 'concentration', unit: 'nM', value: 10, tex: 'K_d' },
        B: { name: 'antagonist concentration', q: 'concentration', unit: 'nM', value: 90, tex: 'B' },
        KB: { name: 'antagonist dissociation constant', q: 'concentration', unit: 'nM', value: 10, tex: 'K_B' }
      },
      note: 'The antagonist multiplies the agonist\'s apparent Kd by (1 + B/K_B): enough extra agonist restores full occupancy — the hallmark of competitive antagonism.',
      practice: { unknowns: ['f', 'C'] },
      stories: { f: 'An agonist at {C} (Kd {Kd}) competes with an antagonist at {B} (K_B {KB}). What fraction of receptors does the agonist occupy?', C: 'With an antagonist at {B} (K_B {KB}) present, what agonist concentration (Kd {Kd}) gives {f} occupancy?' }
    }
  ],
  examples: [
    {
      title: 'Half, then ninety per cent',
      q: 'A hypothetical drug has $K_d = 10$ nM. What concentration occupies half its receptors, and what concentration occupies 90 %?',
      steps: [
        'Half: $C = K_d = 10$ nM, since $10/(10 + 10) = 0.5$.',
        'For 90 %: $C/(C + K_d) = 0.9 \\Rightarrow C = 9K_d = 90$ nM.',
        'Going from half to 90 % occupancy needs nine times the concentration: dose–occupancy curves flatten at the top.'
      ],
      a: '10 nM for half, 90 nM for 90 %.'
    },
    {
      title: 'Reversing by competition',
      q: 'The same agonist at 10 nM occupies 50 % of receptors. A competitive antagonist is given at 9 times its own $K_B$. What happens to occupancy, and how much agonist would restore 50 %?',
      steps: [
        'The apparent $K_d$ becomes $10 \\times (1 + 9) = 100$ nM.',
        'Occupancy: $10/(10 + 100) = 0.09$, about 9 %.',
        'To get back to 50 %, the agonist must reach the new apparent $K_d$: 100 nM, ten times more. This is how an antagonist such as naloxone displaces an opioid — and why a large opioid dose can need repeated naloxone.'
      ],
      a: 'Occupancy falls to about 9 %; ten times more agonist restores it.'
    }
  ],
  quiz: [
    { q: 'A beta blocker binds β₁ receptors in the heart but does not activate them. It is…', choices: ['an agonist', 'an antagonist', 'an enzyme inhibitor', 'a partial agonist'], a: 1,
      why: 'It occupies the receptor and prevents adrenaline and noradrenaline from acting — the definition of an antagonist.' },
    { q: 'At a concentration equal to three times its $K_d$, what fraction of receptors does a drug occupy? (in %)', answer: 75, unit: '%',
      why: '$3K_d/(3K_d + K_d) = 3/4$.' },
    { q: 'Drug A reaches its full effect at 1 mg, drug B at 100 mg, but B\'s maximum effect is larger. Which statement is right?', choices: ['A is more potent; B is more efficacious', 'A is more potent and more efficacious', 'B is more potent', 'they are equivalent'], a: 0,
      why: 'Potency is about the dose needed; efficacy is about the largest effect possible. B needs more but can do more.' },
    { q: 'Why can a medicine that works on the heart cause wheezing in some people with asthma?', choices: ['it is contaminated', 'it also blocks similar receptors in the airways', 'it causes an infection', 'it lowers oxygen in the blood'], a: 1,
      why: 'Non-selective (and at high doses even "selective") beta blockers also block β₂ receptors, which keep the airways open.' },
    { q: 'Local anaesthetics stop pain by blocking sodium channels, so nerves cannot fire action potentials.', a: true,
      why: 'Without the sodium current there is no action potential, and the pain signal never reaches the brain. See the action potential.' }
  ],
  applications: ['Understanding why a medicine has side effects in organs it was not meant for.', 'Reversing an opioid overdose with an antagonist.', 'Designing selective drugs that spare related receptors.', 'Explaining why some medicines are given together and others must not be.'],
  history: 'John Langley proposed a "receptive substance" in 1905 and Paul Ehrlich argued that drugs act only when bound; A. J. Clark put receptor occupancy into equations in the 1930s. James Black designed the first beta blocker (propranolol, 1960s) on these principles, and received a Nobel Prize in 1988.',
  sim: { id: 'cm-dose-response', params: { compare: 'antagonist', tox: false } }
},

{
  id: 'pharmacokinetics', parent: 'pharmacology', title: 'What the body does to a medicine', level: 2,
  short: 'Pharmacokinetics follows a medicine through the body: absorption into the blood, distribution into the tissues, metabolism, mostly in the liver, and excretion, mostly by the kidneys. Three numbers — bioavailability, volume of distribution and clearance — capture most of it.',
  keywords: ['pharmacokinetics', 'ADME', 'absorption', 'bioavailability', 'first-pass metabolism', 'distribution', 'volume of distribution', 'protein binding', 'metabolism', 'CYP450', 'liver enzymes', 'excretion', 'clearance', 'AUC', 'prodrug', 'pharmacogenomics', 'zero-order'],
  prereq: ['how-drugs-work', 'liver-function', 'glomerular-filtration', 'membrane-transport'],
  related: ['half-life-dosing', 'side-effects-interactions', 'kidney-tests', 'chronic-kidney-disease', 'chemistry:weak-acids', 'chemistry:integrated-rate-laws'],
  body: `
Two people swallow the same tablet. For one it works well; for the other it barely works, or causes side effects. Often the difference is not in the target but in the journey: how much of the tablet reached the blood, where it went, and how fast it was removed. Doctors adjust medicines for age, weight, kidney and liver function, and other drugs, because of **pharmacokinetics** — what the body does to a medicine. Its four stages spell **ADME**.

### Absorption
A swallowed tablet dissolves, and the medicine crosses the lining of the gut into the blood ([[membrane-transport|across membranes]]). Fat-soluble, uncharged molecules cross most easily, so a drug's acidity and the pH around it matter ([[chemistry:weak-acids|weak acids]]). Food, stomach emptying, other medicines and the design of the tablet (a slow-release coating, for instance) all change the speed and amount. Blood from the gut goes first to the liver, which may destroy much of the dose before it reaches the rest of the body: **first-pass metabolism**. The fraction that reaches the circulation unchanged is the **bioavailability** $F$ — 100 % for an injection into a vein, often much less by mouth. Some medicines are absorbed under the tongue, through the skin or by inhalation partly to avoid the first pass.

### Distribution
From the blood a medicine spreads into the tissues. The **volume of distribution** $V_d$ is the volume it *appears* to dissolve in: the dose divided by the concentration in the plasma,

$$C_0 = \\frac{D}{V_d}$$

A medicine that stays in the blood has a $V_d$ of a few litres; one that soaks into fat or binds tightly in tissues can have an apparent $V_d$ of hundreds of litres — larger than the body — because little of it remains in the plasma. Only the **free** drug, not the part bound to plasma proteins such as albumin, can reach the target. Barriers matter too: the blood–brain barrier keeps many drugs out of the brain, while the placenta and breast milk let many through.

### Metabolism
The liver ([[liver-function]]) converts drugs into forms that are easier to excrete, usually more water-soluble. Much of this is done by the **cytochrome P450** enzymes; one of them, CYP3A4, handles a large share of all medicines. Other drugs, foods and herbal remedies can block or speed up these enzymes — the commonest cause of serious [[side-effects-interactions|interactions]]. Some medicines are **prodrugs**, inactive until metabolised: codeine works partly by being converted to morphine by the enzyme CYP2D6, and people who carry extra copies of that gene can make dangerous amounts — one reason codeine is no longer given to young children in many countries. Studying such inherited differences is **pharmacogenomics**.

### Excretion and clearance
The kidneys filter and secrete drugs into the urine ([[glomerular-filtration]]); others leave in bile, and anaesthetic gases through the lungs. **Clearance** $CL$ is the volume of plasma cleared of the drug per unit time. It sets the average level for a given dosing rate, and with the volume of distribution it sets the half-life:

$$t_{1/2} = \\frac{\\ln 2 \\cdot V_d}{\\text{CL}}$$

Most drugs are removed by **first-order** kinetics: a constant *fraction* per hour, so levels fall exponentially. A few saturate their enzymes and are removed at a roughly constant *amount* per hour (**zero-order**), alcohol being the everyday example: that is why drinking faster than the liver can clear it makes blood alcohol climb steeply.

### Why it varies between people
- **Kidney function** falls with age and in kidney disease, so drugs cleared by the kidneys build up; doses are often adjusted using the estimated GFR ([[kidney-tests]]).
- **Liver disease** slows metabolism and lowers protein binding.
- **Age and body size**: newborns metabolise many drugs slowly; older people have more fat and less water, and often take several medicines.
- **Genes**, **pregnancy** and **other medicines** all shift the numbers.

> [!tip] Keeping an up-to-date list of everything you take — prescribed, bought over the counter, herbal and supplements — and showing it to every doctor and pharmacist is one of the simplest ways to prevent problems.
`,
  ideas: [
    'ADME: absorption, distribution, metabolism and excretion decide how much drug reaches its target, and for how long.',
    'Bioavailability is the fraction of a dose that reaches the circulation; first-pass metabolism in the liver can lower it a lot.',
    'The volume of distribution relates dose to plasma concentration: C₀ = D/V_d.',
    'Clearance sets the average level for a dosing rate; half-life = ln 2 · V_d / CL.',
    'Kidney and liver function, age, genes and other medicines change these numbers from person to person.'
  ],
  pitfalls: [
    'The volume of distribution is a real volume of body fluid — It is an apparent volume; drugs that bind in tissues can have V_d of hundreds of litres, far larger than the body.',
    'A drug with a long half-life must be cleared slowly — Half-life depends on both clearance and volume of distribution; a drug spread widely in tissues can have a long half-life despite high clearance.',
    'Natural remedies cannot interact with medicines — Some herbal products (such as St John\'s wort) strongly change liver enzymes and can make other medicines fail or become toxic.'
  ],
  formulas: [
    {
      name: 'Starting concentration after an injection',
      expr: 'C0 = D/Vd', tex: 'C_0 = \\frac{D}{V_d}',
      vars: {
        C0: { name: 'plasma concentration just after the dose', q: 'massconc', unit: 'mg/L', tex: 'C_0' },
        D: { name: 'dose (mg)', value: 500, tex: 'D' },
        Vd: { name: 'volume of distribution (L)', value: 50, tex: 'V_d' }
      },
      note: 'For a dose injected into a vein, before any is eliminated. For a dose by mouth, multiply D by the bioavailability F. Dose in mg and volume in litres give mg/L.',
      stories: { C0: 'A hypothetical drug is injected as {D} and has a volume of distribution of {Vd}. What is the concentration just afterwards?', Vd: 'After an injection of {D}, the plasma level is {C0}. What is the volume of distribution?' }
    },
    {
      name: 'Half-life from volume and clearance',
      expr: 'th = ln(2)*Vd/CL', tex: 't_{1/2} = \\frac{\\ln 2 \\cdot V_d}{\\text{CL}}',
      vars: {
        th: { name: 'elimination half-life', q: 'time', unit: 'h', tex: 't_{1/2}' },
        Vd: { name: 'volume of distribution', q: 'volume', unit: 'L', value: 50, tex: 'V_d' },
        CL: { name: 'clearance', q: 'flowrate', unit: 'L/h', value: 5, tex: '\\text{CL}' }
      },
      note: 'One compartment, first-order elimination. Halving clearance (kidney failure, an enzyme-blocking drug) doubles the half-life.',
      stories: { th: 'A hypothetical drug has a volume of distribution of {Vd} and a clearance of {CL}. What is its half-life?', CL: 'A drug spreads into {Vd} and has a half-life of {th}. What is its clearance?' }
    },
    {
      name: 'Total exposure (area under the curve)',
      expr: 'AUC = F*D/CL', tex: '\\text{AUC} = \\frac{F\\, D}{\\text{CL}}',
      vars: {
        AUC: { name: 'area under the concentration–time curve (mg·h/L)', tex: '\\text{AUC}' },
        F: { name: 'bioavailability', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: 'F' },
        D: { name: 'dose (mg)', value: 500, tex: 'D' },
        CL: { name: 'clearance (L/h)', value: 5, tex: '\\text{CL}' }
      },
      note: 'The AUC measures total exposure to a dose. Comparing the AUC after a tablet with the AUC after an injection is how bioavailability is measured.',
      practice: { unknowns: ['AUC', 'F'] },
      stories: { AUC: 'A hypothetical tablet of {D} has a bioavailability of {F}; the clearance is {CL}. What is the AUC?', F: 'An injection of {D} gives an AUC of 100 mg·h/L; the same dose by mouth gives {AUC} with clearance {CL}. What is the bioavailability?' }
    }
  ],
  examples: [
    {
      title: 'A hypothetical drug from start to finish',
      q: 'Drug X (hypothetical) has a volume of distribution of 50 L and a clearance of 5 L/h. A 500 mg dose is injected. Find the starting level, the half-life and the level after 21 hours.',
      steps: [
        '$C_0 = 500/50 = 10$ mg/L.',
        '$t_{1/2} = 0.693 \\times 50/5 = 6.9$ hours.',
        '21 hours is about three half-lives: $10 \\times (1/2)^3 \\approx 1.25$ mg/L (more exactly $10 \\times 2^{-21/6.93} = 1.22$).'
      ],
      a: '10 mg/L at first, a half-life of about 7 hours, about 1.2 mg/L after 21 hours.'
    },
    {
      title: 'Kidney function and half-life',
      q: 'Drug X is cleared entirely by the kidneys. In a person whose kidney function is half normal, clearance falls from 5 to 2.5 L/h. What happens to the half-life and to the average level on the same regular dose?',
      steps: [
        'Half-life: $0.693 \\times 50/2.5 = 13.9$ hours — doubled.',
        'Average level at steady state is proportional to $1/CL$: it doubles too.',
        'This is why doses of kidney-cleared medicines are adjusted to kidney function, and why kidney tests are checked before and during some treatments.'
      ],
      a: 'The half-life and the average level both double.'
    }
  ],
  quiz: [
    { q: 'A medicine is 100 % absorbed from the gut, but only 30 % of a dose reaches the circulation. The most likely reason is…', choices: ['it is excreted in the urine before absorption', 'first-pass metabolism in the gut wall and liver', 'it binds to albumin', 'the kidneys are failing'], a: 1,
      why: 'Blood from the gut passes through the liver first, and the liver (and gut wall) can metabolise most of the dose before it reaches the rest of the body.' },
    { q: 'A 300 mg injection gives a plasma concentration of 2 mg/L. What is the apparent volume of distribution, in litres?', answer: 150, unit: 'L',
      why: '$V_d = D/C_0 = 300/2 = 150$ L — more than twice the body\'s total water, so the drug must be concentrated in tissues.' },
    { q: 'If clearance halves while the volume of distribution stays the same, the half-life…', choices: ['halves', 'stays the same', 'doubles', 'quadruples'], a: 2,
      why: '$t_{1/2} = 0.693\\, V_d/CL$: half the clearance, twice the half-life.' },
    { q: 'Alcohol is removed from the blood at a roughly constant amount per hour, not a constant fraction.', a: true,
      why: 'Its main enzyme saturates at ordinary drinking levels, so elimination is close to zero-order — about a standard drink an hour for many adults — and blood alcohol climbs fast when drinking outpaces it.' },
    { q: 'Why can codeine be dangerous for a person who carries extra copies of the CYP2D6 gene?', choices: ['they cannot absorb it', 'they convert it to morphine unusually fast and can reach toxic morphine levels', 'they excrete it too fast for it to work', 'they are allergic to it'], a: 1,
      why: 'Codeine is a prodrug activated by CYP2D6. Ultra-rapid metabolisers make much more morphine, which can depress breathing.' }
  ],
  applications: ['Adjusting doses to kidney function (estimated GFR) and liver disease.', 'Choosing a route — injection, tablet, inhaler, patch — to get enough drug to the target.', 'Pharmacogenomic testing before certain medicines.', 'Measuring bioavailability to show that a generic medicine matches the original.'],
  history: 'Torsten Teorell described drug distribution between body compartments in 1937, founding pharmacokinetics; Eino Nelson and others made the half-life, clearance and bioavailability everyday tools in the 1960s.',
  sim: { id: 'cm-drug-levels', params: { route: 'iv', n: 1 } }
},

{
  id: 'half-life-dosing', parent: 'pharmacology', title: 'Half-life and dosing', level: 2,
  short: 'The half-life is the time for the level of a medicine in the blood to fall by half. It decides how often a medicine is taken, how long it takes to build up to a steady level — about four to five half-lives — and how long it lingers after stopping.',
  keywords: ['half-life', 'dosing interval', 'steady state', 'accumulation', 'loading dose', 'maintenance dose', 'therapeutic window', 'peak and trough', 'missed dose', 'therapeutic drug monitoring', 'exponential decay', 'washout'],
  prereq: ['pharmacokinetics', 'math:exponential-growth-decay', 'physics:half-life'],
  related: ['dose-response', 'side-effects-interactions', 'math:geometric-series', 'chemistry:reaction-half-life', 'kidney-tests'],
  body: `
Sam's doctor started him on a new medicine and warned him: "It will take about a week to work fully." Sam was puzzled — why would the same daily dose do more on day 7 than on day 1? The answer is the **half-life**, and it explains most of what the label on a medicine says about when and how to take it.

### Halving, again and again
Most medicines are removed by first-order kinetics: each hour the body removes the same *fraction* of what is there ([[pharmacokinetics]]). The level therefore falls exponentially, halving every half-life $t_{1/2}$ — exactly like radioactive decay ([[physics:half-life|physics]]) or a first-order reaction ([[chemistry:reaction-half-life|chemistry]]):

$$C(t) = C_0 \\left(\\tfrac{1}{2}\\right)^{t/t_{1/2}}$$

After one half-life 50 % remains, after two 25 %, after five about 3 %. So a medicine is, for practical purposes, gone after **four to five half-lives** — useful to know when switching medicines or before surgery. Half-lives range from minutes (some anaesthetic drugs) to weeks (some heart-rhythm and psychiatric medicines).

### Building up to a steady state
Take a dose before the last one has gone, and the new dose adds to what is left. Each dose adds the same amount and the body removes a fraction of a growing total, so the level climbs until **what is removed between doses equals one dose** — the **steady state**. The peaks and troughs then repeat. How long it takes depends only on the half-life:

$$\\frac{C(t)}{C_{ss}} = 1 - \\left(\\tfrac12\\right)^{t/t_{1/2}}$$

Half the steady level after one half-life, 90 % after about 3.3, 97 % after five. That was Sam's week: his medicine has a long half-life. How high the plateau sits compared with a single dose is the **accumulation factor**, $R = 1/(1 - 2^{-\\tau/t_{1/2}})$ for a dose every $\\tau$ hours: dosing once every half-life doubles the peak, dosing twice as often more than triples it. (The sum behind it is a [[math:geometric-series|geometric series]].)

### Loading doses
When waiting five half-lives is too slow — a serious infection, a dangerous rhythm — a larger **loading dose** fills the volume of distribution at once, and smaller **maintenance doses** then replace what is cleared:

$$D_\\text{load} = \\frac{C_\\text{target}\\, V_d}{F}, \\qquad D_\\text{maint} = \\frac{C_\\text{target}\\, \\text{CL}\\, \\tau}{F}$$

### The therapeutic window
Each medicine works above some level and causes harm above a higher one. Dosing aims to keep the level between the two — the **therapeutic window** — all the time. A dose interval much longer than the half-life gives high peaks (side effects) and deep troughs (loss of effect); slow-release tablets and more frequent doses smooth the curve. For medicines with a narrow window, blood levels are measured: **therapeutic drug monitoring**, usually at the trough just before a dose.

### Missed doses
Missing a dose lets the level fall below the window for a while; taking two doses together to catch up can push the peak above it. What to do after a missed dose differs between medicines — the leaflet says, and a pharmacist can advise. The simulation shows why the answer depends on the half-life.

> [!tip] "Take every 8 hours" and "take three times a day" can mean different things: the first spaces doses around the clock because the half-life is short. If a dosing schedule is hard to fit into your life, ask whether another form or timing is possible, rather than skipping doses.
`,
  ideas: [
    'With first-order elimination the level halves every half-life; after 4–5 half-lives a medicine is nearly gone.',
    'Repeated doses accumulate until elimination between doses equals one dose: the steady state, reached in 4–5 half-lives.',
    'The accumulation factor 1/(1 − 2^(−τ/t½)) sets how high the plateau sits above a single dose.',
    'A loading dose fills the volume of distribution at once; maintenance doses replace what is cleared.',
    'Dosing aims to keep levels inside the therapeutic window; missed or doubled doses push them out of it.'
  ],
  pitfalls: [
    'A medicine that has not worked after two days never will — Many medicines take four or five half-lives to reach their steady level; some also act slowly for other reasons.',
    'After one half-life the medicine is gone — Half remains after one half-life, a quarter after two; it takes about five to fall to 3 %.',
    'Taking a double dose after missing one simply catches up — It can push the peak level above the safe range; follow the leaflet or ask a pharmacist.'
  ],
  formulas: [
    {
      name: 'Exponential fall of the level',
      expr: 'C = C0*2^(-t/th)', tex: 'C = C_0 \\left(\\tfrac{1}{2}\\right)^{t/t_{1/2}}',
      vars: {
        C: { name: 'concentration later', q: 'massconc', unit: 'mg/L', tex: 'C' },
        C0: { name: 'concentration now', q: 'massconc', unit: 'mg/L', value: 10, tex: 'C_0' },
        t: { name: 'time elapsed', q: 'time', unit: 'h', value: 24, tex: 't' },
        th: { name: 'half-life', q: 'time', unit: 'h', value: 6, tex: 't_{1/2}' }
      },
      note: 'First-order elimination from one compartment, after absorption is complete. (½)^(t/t½) is the same as e^(−kt) with k = ln 2/t½.',
      practice: { unknowns: ['C', 't', 'th'] },
      stories: { C: 'A hypothetical drug is at {C0}; its half-life is {th}. What is the level {t} later?', th: 'A level falls from {C0} to {C} in {t}. What is the half-life?', t: 'How long does a level of {C0} take to fall to {C}, with a half-life of {th}?' }
    },
    {
      name: 'Approach to the steady state',
      expr: 'fss = 1 - 2^(-t/th)', tex: 'f_{ss} = 1 - \\left(\\tfrac{1}{2}\\right)^{t/t_{1/2}}',
      vars: {
        fss: { name: 'fraction of the steady-state level reached', q: 'ratio', unit: '%', tex: 'f_{ss}' },
        t: { name: 'time since regular dosing began', q: 'time', unit: 'h', value: 24, tex: 't' },
        th: { name: 'half-life', q: 'time', unit: 'h', value: 8, tex: 't_{1/2}' }
      },
      note: 'For constant or frequent dosing without a loading dose. The same curve describes the fall after stopping: after t, a fraction 1 − f_ss is left.',
      stories: { fss: 'A hypothetical medicine with a half-life of {th} is started. What fraction of its steady level is reached after {t}?', t: 'How long after starting a medicine with a half-life of {th} does the level reach {fss} of steady state?' }
    },
    {
      name: 'Accumulation factor',
      expr: 'R = 1/(1 - 2^(-tau/th))', tex: 'R = \\frac{1}{1 - 2^{-\\tau/t_{1/2}}}',
      vars: {
        R: { name: 'accumulation factor (steady-state peak ÷ first peak)', tex: 'R' },
        tau: { name: 'dosing interval', q: 'time', unit: 'h', value: 12, tex: '\\tau' },
        th: { name: 'half-life', q: 'time', unit: 'h', value: 12, tex: 't_{1/2}' }
      },
      note: 'For equal doses at equal intervals (exactly true for injections). The sum of the geometric series 1 + q + q² + … with q = 2^(−τ/t½).',
      stories: { R: 'A medicine with a half-life of {th} is given every {tau}. How much higher is the steady-state peak than the first peak?' }
    },
    {
      name: 'Loading dose',
      expr: 'LD = Css*Vd/F', tex: 'D_\\text{load} = \\frac{C_\\text{target}\\, V_d}{F}',
      vars: {
        LD: { name: 'loading dose (mg)', tex: 'D_\\text{load}' },
        Css: { name: 'target concentration', q: 'massconc', unit: 'mg/L', value: 10, tex: 'C_\\text{target}' },
        Vd: { name: 'volume of distribution (L)', value: 50, tex: 'V_d' },
        F: { name: 'bioavailability', q: 'ratio', unit: '%', value: 100, min: 1, max: 100, tex: 'F' }
      },
      note: 'Fills the volume of distribution to the target level at once. Real loading doses are often split, to limit the peak.',
      stories: { LD: 'A hypothetical drug has a volume of distribution of {Vd} and a bioavailability of {F}. What loading dose gives a level of {Css}?' }
    },
    {
      name: 'Maintenance dose',
      expr: 'MD = Css*CL*tau/F', tex: 'D_\\text{maint} = \\frac{C_\\text{target}\\, \\text{CL}\\, \\tau}{F}',
      vars: {
        MD: { name: 'dose each interval (mg)', tex: 'D_\\text{maint}' },
        Css: { name: 'target average concentration', q: 'massconc', unit: 'mg/L', value: 10, tex: 'C_\\text{target}' },
        CL: { name: 'clearance (L/h)', value: 5, tex: '\\text{CL}' },
        tau: { name: 'dosing interval (h)', value: 12, tex: '\\tau' },
        F: { name: 'bioavailability', q: 'ratio', unit: '%', value: 100, min: 1, max: 100, tex: 'F' }
      },
      note: 'At steady state, the amount given per interval equals the amount cleared: F·D = C·CL·τ.',
      practice: { unknowns: ['MD', 'Css'] },
      stories: { MD: 'To keep a hypothetical drug at an average of {Css}, with clearance {CL}, given every {tau} hours with bioavailability {F}, what dose is needed each time?', Css: 'A dose of {MD} every {tau} hours, with bioavailability {F} and clearance {CL}: what is the average steady-state level?' }
    }
  ],
  examples: [
    {
      title: 'How long until it works?',
      q: 'A hypothetical medicine has a half-life of 5 days and is taken daily. When does the level reach 90 % of its steady value, and how long after stopping does it fall below 10 %?',
      steps: [
        '90 % of steady state needs $1 - 2^{-t/5} = 0.9$, so $2^{-t/5} = 0.1$ and $t = 5 \\times \\log_2 10 = 5 \\times 3.32 = 16.6$ days.',
        'After stopping, the level falls by the same curve: below 10 % after another 16.6 days.',
        'A slow medicine takes two to three weeks to build up — and to wash out. A loading dose is sometimes used to shorten the start.'
      ],
      a: 'About 17 days to reach 90 %, and about 17 days after stopping to fall below 10 %.'
    },
    {
      title: 'Doses for a target level',
      q: 'Hypothetical drug Y: volume of distribution 50 L, clearance 5 L/h, bioavailability by mouth 80 %. The aim is an average level of 10 mg/L with a dose every 12 hours. Find the loading and maintenance doses.',
      steps: [
        'Loading dose: $10 \\times 50/0.8 = 625$ mg.',
        'Maintenance: $10 \\times 5 \\times 12/0.8 = 750$ mg every 12 hours.',
        'The half-life is $0.693 \\times 50/5 = 6.9$ h; with doses every 12 h the level swings a lot between peak and trough — a slow-release form or more frequent doses would smooth it.'
      ],
      a: '625 mg to load, 750 mg every 12 hours to maintain (for this hypothetical drug only).'
    }
  ],
  quiz: [
    { q: 'A medicine\'s level is 16 mg/L. Its half-life is 4 hours. What is the level 12 hours later, in mg/L?', answer: 2, unit: 'mg/L',
      why: 'Twelve hours is three half-lives: $16 \\to 8 \\to 4 \\to 2$ mg/L.' },
    { q: 'About how many half-lives does it take to reach steady state on regular dosing?', choices: ['one', 'two', 'four to five', 'twenty'], a: 2,
      why: 'After four half-lives the level is at 94 % of steady state, after five at 97 %.' },
    { q: 'If the dosing interval equals the half-life, the steady-state peak is how many times the first peak?', answer: 2,
      why: '$R = 1/(1 - 1/2) = 2$.' },
    { q: 'Why is a loading dose used for some medicines?', choices: ['to make the medicine last longer', 'to reach the target level quickly instead of waiting four to five half-lives', 'to reduce side effects', 'because the first dose is poorly absorbed'], a: 1,
      why: 'A loading dose fills the volume of distribution at once; maintenance doses then keep the level there.' },
    { q: 'Doubling the dose doubles the time the medicine stays in the body.', a: false,
      why: 'With first-order elimination, doubling the dose adds only one half-life to the time spent above a given level; the half-life itself is unchanged.' }
  ],
  applications: ['Choosing how often a medicine must be taken.', 'Planning when to stop a medicine before surgery, or when to switch.', 'Loading doses in emergencies and for slow-building medicines.', 'Therapeutic drug monitoring for narrow-window medicines.'],
  history: 'Friedrich Dost, who coined the word "pharmacokinetics" in 1953, described how repeated doses build up to a plateau. The arithmetic of halving is the same that Rutherford and Soddy worked out for radioactive decay half a century earlier.',
  sim: 'cm-drug-levels'
},

{
  id: 'dose-response', parent: 'pharmacology', title: 'Dose, response and safety', level: 2,
  short: 'A medicine\'s effect rises with the dose along an S-shaped curve and levels off at a maximum; so do its toxic effects, at higher doses. The distance between the two curves — the therapeutic index — decides how safe a medicine is and how closely it must be watched.',
  keywords: ['dose-response', 'concentration-effect', 'Emax', 'EC50', 'ED50', 'TD50', 'LD50', 'potency', 'efficacy', 'Hill equation', 'therapeutic index', 'therapeutic window', 'narrow therapeutic index', 'quantal', 'toxicity', 'the dose makes the poison'],
  prereq: ['how-drugs-work', 'half-life-dosing', 'math:logarithmic-scales'],
  related: ['side-effects-interactions', 'clinical-trials', 'poisoning-overdose', 'pain-relief', 'math:normal-distribution'],
  body: `
Paracetamol (acetaminophen) at the doses on the packet is one of the safest medicines there is. Taken in overdose it is one of the commonest causes of acute liver failure in many countries. Nothing about the molecule changes between the two — only the dose. Five centuries ago Paracelsus made the point that every substance is a poison and that the dose decides. Dose–response is how pharmacology makes it precise.

### The curve
Plot the effect of a medicine against its concentration, with the concentration on a logarithmic scale ([[math:logarithmic-scales|log scale]]), and you get an S-shaped curve described by the **Emax** (Hill) model:

$$E = E_\\text{max}\\, \\frac{C^{\\,n}}{\\text{EC}_{50}^{\\,n} + C^{\\,n}}$$

- $E_\\text{max}$ is the largest effect possible: the medicine's **efficacy**. More drug beyond that does nothing more for the effect — but may still add side effects.
- $\\text{EC}_{50}$ is the concentration giving half the maximum: its **potency**. A lower $\\text{EC}_{50}$ means a more potent drug.
- $n$, the Hill slope, sets the steepness. With $n = 1$, going from 50 % to 90 % of the maximum takes nine times the concentration; with $n = 2$, three times.

### From one person to many
The same curve shape appears when doctors ask a yes-or-no question of a group — did the headache go, did the blood pressure reach the target, did a side effect occur. Because people differ, each has their own threshold, and the **quantal** dose–response curve gives the percentage responding at each dose. The dose that works in half the people is the $\\text{ED}_{50}$; the dose that causes a particular toxic effect in half is the $\\text{TD}_{50}$ (and, in animal studies, the lethal $\\text{LD}_{50}$).

### The therapeutic index
The **therapeutic index** compares the two:

$$\\text{TI} = \\frac{\\text{TD}_{50}}{\\text{ED}_{50}}$$

A large TI means a wide margin; a small one means the dose that helps is close to the dose that harms. But the TI is about medians: if the curves are shallow, the most sensitive people can be harmed at doses that do not yet help the least sensitive. A stricter measure compares the dose that helps nearly everyone ($\\text{ED}_{99}$) with the dose that harms very few ($\\text{TD}_{1}$). The simulation shows both.

Medicines with a **narrow therapeutic index** — such as warfarin, lithium, digoxin, phenytoin and some antibiotics and anti-rejection drugs — are dosed carefully and checked with blood tests (a clotting test for warfarin, blood levels for lithium). For them, small changes in kidney function, other medicines or even diet can tip a person out of the window ([[side-effects-interactions]]).

### Why doses differ between people
Body size, age, kidney and liver function, genes, other illnesses and other medicines all move a person's curves. Children are not small adults; for older people, a common principle is "start low, go slow". Tolerance can shift the curve over time — the same dose of an opioid does less after weeks of use — which is part of why long-term opioid use for chronic pain is approached cautiously ([[pain-relief]]).

See [[poisoning-overdose|Poisoning and overdose]] for what to do when too much has been taken.

> [!warn] If someone may have taken too much of any medicine — even if they seem well, as with paracetamol, whose liver damage shows only after a day or more — keep the packet to show the medical team, and call your local emergency number (or a poisons information service) at once.
`,
  ideas: [
    'Effect rises along an S-shaped curve with log concentration and levels off at Emax (efficacy); EC50 measures potency.',
    'The Hill slope sets steepness: with n = 1, going from 50 % to 90 % effect takes nine times the concentration.',
    'Quantal curves show the share of people responding; ED50 and TD50 are their midpoints.',
    'Therapeutic index = TD50/ED50; shallow curves can overlap even when the index looks comfortable.',
    'Narrow-index medicines need careful dosing and blood-test monitoring.'
  ],
  pitfalls: [
    'If a little helps, more will help more — Above the top of the curve extra drug adds no benefit, only side effects and toxicity.',
    'A medicine is either safe or dangerous — Safety is a matter of dose; paracetamol is safe at the labelled dose and dangerous in overdose.',
    'A therapeutic index of 10 means everyone is safe at up to ten times the effective dose — The index compares medians; with shallow, overlapping curves some people are harmed at doses close to the effective ones.'
  ],
  formulas: [
    {
      name: 'The Emax (Hill) model',
      expr: 'E = Emax*C^n/(EC50^n + C^n)', tex: 'E = E_\\text{max}\\, \\frac{C^{\\,n}}{\\text{EC}_{50}^{\\,n} + C^{\\,n}}',
      vars: {
        E: { name: 'effect', q: 'ratio', unit: '%', tex: 'E' },
        Emax: { name: 'maximum effect', q: 'ratio', unit: '%', value: 100, min: 0, max: 100, tex: 'E_\\text{max}' },
        C: { name: 'concentration', q: 'massconc', unit: 'mg/L', value: 6, tex: 'C' },
        EC50: { name: 'concentration for half the maximum effect', q: 'massconc', unit: 'mg/L', value: 2, tex: '\\text{EC}_{50}' },
        n: { name: 'Hill slope', value: 1, min: 0.2, max: 8, tex: 'n' }
      },
      note: 'Effect as a percentage of the largest possible. Concentrations cancel, so any unit works as long as C and EC50 share it.',
      practice: { unknowns: ['E', 'C'] },
      stories: { E: 'A hypothetical drug has an EC50 of {EC50} and a Hill slope of {n}. What effect (as a share of the maximum {Emax}) does a concentration of {C} give?', C: 'What concentration gives an effect of {E} for a drug with EC50 {EC50}, Hill slope {n} and maximum {Emax}?' }
    },
    {
      name: 'Therapeutic index',
      expr: 'TI = TD50/ED50', tex: '\\text{TI} = \\frac{\\text{TD}_{50}}{\\text{ED}_{50}}',
      vars: {
        TI: { name: 'therapeutic index', tex: '\\text{TI}' },
        TD50: { name: 'dose toxic in half the people', q: 'doseperkg', unit: 'mg/kg', value: 200, tex: '\\text{TD}_{50}' },
        ED50: { name: 'dose effective in half the people', q: 'doseperkg', unit: 'mg/kg', value: 20, tex: '\\text{ED}_{50}' }
      },
      note: 'A rough summary of the safety margin. It says nothing about the steepness of the curves, and different toxic effects have different TD50s.',
      stories: { TI: 'A hypothetical drug works in half of patients at {ED50} and causes a toxic effect in half at {TD50}. What is its therapeutic index?' }
    }
  ],
  examples: [
    {
      title: 'Pushing the dose up the curve',
      q: 'A hypothetical drug has $\\text{EC}_{50} = 2$ mg/L and $n = 1$. At 2 mg/L it gives 50 % of its maximum effect. What concentration gives 90 %? And 99 %?',
      steps: [
        'Solve $C/(2 + C) = 0.9$: $C = 9 \\times 2 = 18$ mg/L.',
        'For 99 %: $C = 99 \\times 2 = 198$ mg/L.',
        'Each step closer to the maximum costs ten times more drug — while the toxic effects, with their own curve, keep rising.'
      ],
      a: '18 mg/L for 90 %, 198 mg/L for 99 %: diminishing returns.'
    },
    {
      title: 'A comfortable index that is not',
      q: 'Hypothetical drug Z: $\\text{ED}_{50} = 20$ mg/kg and $\\text{TD}_{50} = 200$ mg/kg, so $\\text{TI} = 10$. Both quantal curves follow the Hill shape with slope $n = 2$. Compare the dose that helps 99 % of people with the dose that harms 1 %.',
      steps: [
        '$\\text{ED}_{99} = 20 \\times 99^{1/2} = 199$ mg/kg.',
        '$\\text{TD}_{1} = 200 \\times (1/99)^{1/2} = 20.1$ mg/kg.',
        'The dose that helps nearly everyone is ten times the dose that already harms 1 %. With steeper curves ($n = 4$) the two would meet at about 63 mg/kg.'
      ],
      a: 'ED₉₉ ≈ 199 mg/kg against TD₁ ≈ 20 mg/kg: the curves overlap despite a TI of 10.'
    }
  ],
  quiz: [
    { q: 'Drug P reaches a larger maximum effect than drug Q, but needs a higher dose to get there. P has…', choices: ['higher potency and higher efficacy', 'lower potency but higher efficacy', 'higher potency but lower efficacy', 'the same efficacy'], a: 1,
      why: 'Needing more drug means lower potency (higher EC50); a larger maximum means higher efficacy.' },
    { q: 'With a Hill slope of 1, how many times the EC50 is needed for 75 % of the maximum effect?', answer: 3,
      why: '$C/(\\text{EC}_{50} + C) = 0.75 \\Rightarrow C = 3\\,\\text{EC}_{50}$.' },
    { q: 'A hypothetical drug has ED50 = 5 mg/kg and TD50 = 15 mg/kg. What is its therapeutic index?', answer: 3,
      why: '15/5 = 3 — a narrow index: such a drug would need careful dosing and monitoring.' },
    { q: 'Why are blood levels measured for some medicines, such as lithium?', choices: ['to check the patient is taking them', 'because the effective and toxic levels are close together (a narrow therapeutic index)', 'because they cannot be measured any other way', 'to adjust the price'], a: 1,
      why: 'For narrow-index medicines, small changes in kidney function or other drugs can push the level into the toxic range, so it is checked.' },
    { q: 'Doubling the dose of a medicine that is already near the top of its dose–response curve roughly doubles its benefit.', a: false,
      why: 'Near the plateau, extra drug adds little benefit, but side effects (with their own curves) keep increasing.' }
  ],
  applications: ['Choosing doses that sit inside the therapeutic window.', 'Monitoring narrow-index medicines with blood tests.', 'Comparing medicines by potency and efficacy.', 'Understanding why overdoses of common medicines are dangerous.'],
  history: 'A. V. Hill wrote his equation for oxygen binding to haemoglobin in 1910; J. W. Trevan introduced the LD50 in 1927 to standardise potent drugs such as insulin and digitalis.',
  sim: 'cm-dose-response'
},

{
  id: 'side-effects-interactions', parent: 'pharmacology', title: 'Side effects and interactions', level: 2,
  short: 'Every effective medicine can cause unwanted effects. Most are predictable from how the drug works and depend on the dose; a few are allergic or unpredictable. Interactions — with other medicines, foods, alcohol or illnesses — can make a medicine fail or become toxic.',
  keywords: ['side effect', 'adverse drug reaction', 'allergy', 'anaphylaxis', 'drug interaction', 'enzyme inhibitor', 'enzyme inducer', 'CYP3A4', 'grapefruit juice', 'St John\'s wort', 'serotonin syndrome', 'polypharmacy', 'deprescribing', 'pharmacovigilance', 'penicillin allergy', 'AUC ratio'],
  prereq: ['how-drugs-work', 'pharmacokinetics', 'dose-response'],
  related: ['half-life-dosing', 'allergy', 'anaphylaxis', 'clinical-trials', 'pain-relief', 'ageing', 'liver-function'],
  body: `
Eleanor, 78, takes seven medicines prescribed by three different doctors. When she was given an antibiotic for a chest infection, one of her regular heart medicines built up in her blood and she became dizzy and confused. Nothing was wrong with any single medicine; the problem was the combination. About one in fifteen hospital admissions in a large English study was caused by an adverse drug reaction — many predictable, and many preventable.

### Kinds of unwanted effect
- **Type A (augmented)** reactions are an exaggeration of what the drug does, or of what it does elsewhere: bleeding with blood thinners, low blood pressure and dizziness with blood-pressure medicines, drowsiness with sedatives. They depend on the dose and are the large majority.
- **Type B (bizarre)** reactions are not predictable from the pharmacology: allergies, from a mild rash to **anaphylaxis** ([[anaphylaxis]]), and rare idiosyncratic reactions such as severe skin or liver reactions.
- Some effects appear only with **long-term use** (weight gain, bone thinning with long courses of steroids) or **on stopping** (withdrawal): some medicines — steroids, some antidepressants, beta blockers, benzodiazepines — should be reduced gradually with medical advice rather than stopped suddenly.

A **side effect is not the same as an allergy.** Nausea after an antibiotic is a side effect; hives and swelling are allergy. The distinction matters: about one person in ten says they are allergic to penicillin, but when tested, the great majority are not — and a wrong label means second-choice antibiotics that work less well and breed resistance ([[antimicrobial-resistance]]).

### How interactions happen
**Pharmacokinetic** interactions change how much drug reaches the target:

- **Enzyme inhibition**: one drug blocks the liver or gut enzyme that clears another, so the second builds up. Some antibiotics and antifungals, and grapefruit juice (which blocks CYP3A4 in the gut wall for a day or more), raise the levels of certain statins, heart and immune-suppressing drugs. The effect appears within days, as fast as the victim drug accumulates.
- **Enzyme induction**: a drug makes the liver produce more enzyme, so others are cleared faster and may fail. The herbal remedy St John's wort and some anti-epileptic and anti-tuberculosis drugs can make hormonal contraceptives and HIV medicines ineffective. Induction builds up and wears off over one to two weeks.
- **Absorption and excretion**: calcium, iron and antacids bind some antibiotics and thyroid hormone in the gut; some pain-killers reduce the kidneys' clearance of lithium.

How much an inhibitor raises a drug's exposure depends on how strong it is ($I/K_i$) and on how much of the drug depends on the blocked enzyme ($f_m$):

$$\\frac{AUC_\\text{with}}{AUC_\\text{without}} = \\frac{1}{\\dfrac{f_m}{1 + I/K_i} + (1 - f_m)}$$

**Pharmacodynamic** interactions add or oppose effects at the targets: opioids, benzodiazepines, sleeping tablets and alcohol together can stop breathing; several medicines that raise serotonin can cause serotonin syndrome; blood thinners with anti-inflammatory pain-killers raise bleeding risk; and the "triple whammy" of an anti-inflammatory, a diuretic and certain blood-pressure drugs can injure the kidneys ([[acute-kidney-injury]]). **Drug–disease** interactions matter too: anti-inflammatories can worsen heart failure and kidney disease.

### What reduces the risk
- An up-to-date list of every medicine, supplement and remedy, shown to every prescriber and pharmacist.
- Regular **medication reviews**, especially for older people taking five or more medicines, and stopping those no longer needed (**deprescribing**).
- Asking "does this interact with anything I take?" whenever something new is started — including over-the-counter and herbal products.
- Reporting suspected side effects: national **pharmacovigilance** systems (the Yellow Card scheme in the UK, MedWatch in the US and their equivalents) collect reports from patients and professionals and have uncovered many rare reactions after approval.

> [!warn] Swelling of the face, lips or tongue, difficulty breathing or collapse after a medicine (anaphylaxis); a spreading blistering or peeling rash with fever or a sore mouth and eyes; extreme drowsiness or slow, shallow breathing after sedating medicines; vomiting blood or black tarry stools — for any of these, call your local emergency number.
`,
  ideas: [
    'Most adverse reactions are dose-related exaggerations of a drug\'s own actions (type A); allergies and idiosyncratic reactions (type B) are rarer.',
    'A side effect is not an allergy — and most people labelled penicillin-allergic are not allergic.',
    'Enzyme inhibitors raise other drugs\' levels within days; inducers lower them over one to two weeks.',
    'The rise in exposure depends on the inhibitor\'s strength and on how much the drug relies on the blocked enzyme.',
    'Pharmacodynamic interactions add effects, such as sedatives together stopping breathing.'
  ],
  pitfalls: [
    'Over-the-counter and herbal products are too mild to interact — St John\'s wort, grapefruit juice, antacids and supplements can all change other medicines\' levels.',
    'Any unpleasant reaction to a medicine means an allergy — Most are side effects. Labelling them as allergies can deny people the best treatment later.',
    'If a medicine causes a side effect, stop it at once — Some medicines are dangerous to stop suddenly; ask the prescriber or a pharmacist first, unless it is an emergency.'
  ],
  formulas: [
    {
      name: 'How much an enzyme inhibitor raises exposure',
      expr: 'R = 1/(fm/(1 + I/Ki) + 1 - fm)', tex: 'R = \\frac{1}{\\dfrac{f_m}{1 + I/K_i} + (1 - f_m)}',
      vars: {
        R: { name: 'AUC ratio (with ÷ without the inhibitor)', tex: 'R' },
        fm: { name: 'share of the drug\'s clearance by the blocked enzyme', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'f_m' },
        I: { name: 'inhibitor concentration at the enzyme', q: 'concentration', unit: 'µM', value: 1, tex: 'I' },
        Ki: { name: 'inhibition constant', q: 'concentration', unit: 'µM', value: 0.25, tex: 'K_i' }
      },
      note: 'For a competitive, reversible inhibitor and a drug cleared by the liver. Even an infinitely strong inhibitor cannot raise the AUC more than 1/(1 − f_m) times.',
      practice: { unknowns: ['R', 'fm'] },
      stories: { R: 'A hypothetical drug relies on one enzyme for {fm} of its clearance. An inhibitor reaches {I} with a Ki of {Ki}. By what factor does exposure rise?', fm: 'An inhibitor with I/Ki = {I}/{Ki} raises a drug\'s AUC {R}-fold. What share of its clearance goes through the blocked enzyme?' }
    }
  ],
  examples: [
    {
      title: 'A strong inhibitor, two different drugs',
      q: 'An inhibitor reaches 4 times its $K_i$. Drug A is cleared 90 % by the blocked enzyme; drug B only 50 %. How much does the exposure to each rise?',
      steps: [
        'Drug A: $1/(0.9/5 + 0.1) = 1/0.28 = 3.6$-fold.',
        'Drug B: $1/(0.5/5 + 0.5) = 1/0.6 = 1.7$-fold.',
        'Even an infinitely strong inhibitor could raise B only 2-fold ($1/(1 - 0.5)$), but A up to 10-fold. Drugs that depend on one enzyme are the most vulnerable.'
      ],
      a: 'About 3.6-fold for A, 1.7-fold for B.'
    }
  ],
  quiz: [
    { q: 'A person on a regular medicine starts an enzyme inducer. What is expected?', choices: ['the level of the regular medicine rises at once', 'its level falls gradually over one to two weeks, and it may stop working', 'nothing, inducers only affect themselves', 'an allergic reaction'], a: 1,
      why: 'Induction means making more enzyme, which takes days to weeks; clearance rises and the level falls gradually.' },
    { q: 'A drug depends on one enzyme for 80 % of its clearance. What is the most an inhibitor of that enzyme can raise its exposure (fold)?', answer: 5,
      why: 'With complete inhibition only the other 20 % of clearance remains: $1/(1 - 0.8) = 5$.' },
    { q: 'Which combination is particularly dangerous because the effects add up at the targets?', choices: ['an opioid with a benzodiazepine and alcohol', 'paracetamol with water', 'a vitamin with food', 'an antacid with milk'], a: 0,
      why: 'All three depress the brain\'s drive to breathe; together they cause many overdose deaths.' },
    { q: 'Most people who say they are allergic to penicillin turn out not to be allergic when tested.', a: true,
      why: 'Many labels come from side effects or childhood rashes. Specialist testing removes most labels, allowing better antibiotics.' },
    { q: 'Why can grapefruit juice raise the level of some medicines?', choices: ['it dilutes the stomach acid', 'it blocks CYP3A4 in the gut wall, so more drug gets through', 'it speeds kidney excretion', 'it contains the same drug'], a: 1,
      why: 'Substances in grapefruit inactivate gut-wall CYP3A4 for a day or more, reducing first-pass metabolism of drugs that rely on it.' }
  ],
  applications: ['Checking for interactions whenever a medicine is started or stopped.', 'Medication reviews and deprescribing for older people.', 'Allergy testing to remove wrong penicillin labels.', 'Reporting suspected side effects to national pharmacovigilance schemes.'],
  history: 'The thalidomide disaster (1957–1961) led to modern drug-safety laws and to spontaneous reporting of adverse reactions; the UK\'s Yellow Card scheme began in 1964. Grapefruit\'s interactions were discovered by accident in 1989, in a study that used the juice to mask the taste of alcohol.',
  sim: 'cm-interaction'
},

{
  id: 'clinical-trials', parent: 'pharmacology', title: 'How medicines are tested', level: 2,
  short: 'A new medicine is tested in stages — laboratory, a few volunteers, a few hundred patients, then large randomised trials — before regulators approve it, and is watched after approval. Randomisation, blinding and comparison with placebo or standard care separate the medicine\'s real effect from chance, hope and the natural course of illness.',
  keywords: ['clinical trial', 'randomised controlled trial', 'RCT', 'placebo', 'blinding', 'double-blind', 'phase 1', 'phase 3', 'regulator', 'approval', 'regression to the mean', 'statistical significance', 'p-value', 'confidence interval', 'number needed to treat', 'surrogate endpoint', 'informed consent'],
  prereq: ['evidence-based-medicine', 'risk-communication', 'math:hypothesis-testing'],
  related: ['dose-response', 'side-effects-interactions', 'reading-health-news', 'immunotherapy', 'math:normal-distribution', 'math:central-limit-theorem'],
  body: `
In 2020 the world watched, in real time, how medicines are tested. Of the many drugs tried against COVID-19, several that looked promising in small studies — some of them already famous — made no difference when put to large randomised trials. One cheap, old steroid, by contrast, reduced deaths among the sickest patients by about a third in the RECOVERY trial, and was in use worldwide within days of the result. Fair tests, not reputations, decided.

### Why fair tests are needed
Three things make an ineffective treatment look as if it works:

- **The natural course of illness**: many conditions get better on their own.
- **Regression to the mean**: people seek treatment when symptoms are at their worst, so they tend to improve next time they are measured, whatever is done.
- **The placebo effect** and expectation: believing one is treated changes how symptoms are felt and reported.

And **chance**: in a small group, a difference can appear by luck alone. A **control group**, treated identically except for the medicine, experiences the first three; comparing the groups subtracts them. Making the groups large enough, and testing statistically, deals with chance.

### The design of a good trial
- **Randomisation**: a random process, not the doctor or the patient, decides who gets what, so the groups are alike in everything — including things nobody thought to measure. Comparing people who *chose* a treatment with those who did not is misleading: choosers are often healthier or more health-conscious.
- **Blinding**: neither patients nor assessors know who received what (double-blind), usually with a **placebo** that looks identical — or, when a good treatment exists, the standard treatment.
- **Pre-registered outcomes** that matter to patients (living longer, fewer strokes, less pain), analysed as planned — **intention to treat**, keeping everyone in the group they were randomised to.
- **Enough people**: to detect a modest effect reliably, trials often need hundreds or thousands.

### From laboratory to pharmacy
| Stage | Who | Main question |
|---|---|---|
| Preclinical | cells and animals | Could it work? Is it obviously toxic? |
| Phase 1 | tens of volunteers or patients | Is it safe; how does the body handle it; what dose? |
| Phase 2 | around a hundred to a few hundred patients | Does it seem to work; at what dose? |
| Phase 3 | hundreds to thousands, randomised | Does it work better than placebo or standard care, with acceptable harms? |
| Approval and phase 4 | everyone who uses it | Rare and long-term effects, in real life |

Only about one medicine in ten that enters phase 1 is eventually approved, and the whole journey commonly takes ten to fifteen years. Regulators — the FDA in the US, the EMA in the European Union, the MHRA in the UK and their counterparts elsewhere — review all the evidence. After approval, rare side effects may still emerge, which is why reporting continues ([[side-effects-interactions]]).

### Reading the results
- A **p-value** is the probability of a difference at least as large as the one seen, *if the medicine did nothing*. Below 0.05 is conventionally "statistically significant" — but test twenty useless outcomes and one will probably pass by chance.
- A **confidence interval** shows the range of effects compatible with the data; a wide one means uncertainty.
- **Absolute** effects matter more than relative ones: a 25 % relative reduction from 10 % to 7.5 % is 2.5 percentage points, so 40 people must be treated for one to benefit (the **number needed to treat**). See [[risk-communication]].
- Beware **surrogate endpoints**: in the 1980s two drugs that suppressed abnormal heartbeats on the ECG — a surrogate — turned out in the CAST trial to *increase* deaths.

> [!tip] Joining a trial can give access to new treatments and helps future patients. Useful questions: What is being tested, against what? Could I receive a placebo? What extra visits or tests are involved? Can I leave at any time? (You always can.) Trials are approved by ethics committees and require your informed consent.
`,
  ideas: [
    'Natural recovery, regression to the mean, the placebo effect and chance can all make a useless treatment look effective.',
    'Randomisation balances the groups in everything, known and unknown; blinding and placebo remove expectation.',
    'Medicines pass through phases 1–3 before approval and are monitored afterwards; most candidates fail.',
    'A p-value measures surprise under "no effect"; confidence intervals show the range of plausible effects.',
    'Absolute effects and the number needed to treat matter more than relative ones; surrogate endpoints can mislead.'
  ],
  pitfalls: [
    'Patients got better on it, so it works — Many would have improved anyway (natural course, regression to the mean, placebo). Only a comparison with a similar untreated group shows the drug\'s own effect.',
    'A statistically significant result is a large or important effect — With enough patients, tiny effects become significant; look at the size of the effect and the confidence interval.',
    'Comparing people who chose a treatment with those who did not is as good as a trial — People who choose treatments differ in health and habits; randomisation is what removes those differences.'
  ],
  formulas: [
    {
      name: 'Number needed to treat',
      expr: 'NNT = 1/(CER - EER)', tex: '\\text{NNT} = \\frac{1}{\\text{CER} - \\text{EER}}',
      vars: {
        NNT: { name: 'number needed to treat for one to benefit', tex: '\\text{NNT}' },
        CER: { name: 'event rate without treatment (control)', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: '\\text{CER}' },
        EER: { name: 'event rate with treatment', q: 'ratio', unit: '%', value: 7.5, min: 0, max: 100, tex: '\\text{EER}' }
      },
      note: 'The reciprocal of the absolute risk reduction, over the trial\'s duration. The relative risk reduction here is (CER − EER)/CER = 25 %.',
      stories: { NNT: 'In a trial, {CER} of the control group and {EER} of the treated group had a stroke over five years. How many people must be treated for five years to prevent one stroke?', EER: 'The control group\'s event rate is {CER}; the NNT is {NNT}. What is the event rate with treatment?' }
    },
    {
      name: 'Chance of a false alarm among many tests',
      expr: 'P = 1 - (1 - alpha)^m', tex: 'P = 1 - (1 - \\alpha)^{m}',
      vars: {
        P: { name: 'chance of at least one "significant" result by chance', q: 'ratio', unit: '%', tex: 'P' },
        alpha: { name: 'significance level of each test', q: 'ratio', unit: '%', value: 5, min: 0, max: 100, tex: '\\alpha' },
        m: { name: 'number of independent outcomes tested', q: 'count', value: 20, int: true, tex: 'm' }
      },
      note: 'Why trials name one primary outcome in advance, and why a single "significant" finding among many should be treated with caution.',
      stories: { P: 'A study of a useless treatment tests {m} outcomes, each at a significance level of {alpha}. What is the chance that at least one looks significant?' }
    },
    {
      name: 'How many patients a trial needs (rule of thumb)',
      expr: 'n = 16*(sd/delta)^2', tex: 'n = 16 \\left(\\frac{\\sigma}{\\Delta}\\right)^2',
      vars: {
        n: { name: 'patients needed in each group', tex: 'n' },
        sd: { name: 'spread (standard deviation) of the outcome', value: 20, tex: '\\sigma' },
        delta: { name: 'difference worth detecting', value: 5, tex: '\\Delta' }
      },
      note: 'Lehr\'s rule for comparing two averages: about 80 % power at a two-sided 5 % significance level. Halving the difference to detect quadruples the trial.',
      stories: { n: 'A pain score varies with a standard deviation of {sd} points. How many patients per group are needed to detect a difference of {delta} points?' }
    }
  ],
  examples: [
    {
      title: 'Relative and absolute',
      q: 'In a five-year trial, 10 % of the placebo group and 7.5 % of the treated group have a heart attack. Express the effect as a relative risk reduction, an absolute risk reduction and a number needed to treat.',
      steps: [
        'Relative risk: $7.5/10 = 0.75$, a relative reduction of 25 %.',
        'Absolute reduction: $10\\% - 7.5\\% = 2.5$ percentage points.',
        'NNT: $1/0.025 = 40$: forty people treated for five years for one heart attack prevented — the other 39 take it without that benefit (but with any side effects).'
      ],
      a: '25 % relative, 2.5 points absolute, NNT = 40.'
    },
    {
      title: 'Why trials are big',
      q: 'A pain score (0–100) has a standard deviation of 20 points among patients. How many patients per group are needed to detect a 5-point difference? A 2.5-point one?',
      steps: [
        '$n = 16 \\times (20/5)^2 = 16 \\times 16 = 256$ per group.',
        'For 2.5 points: $16 \\times (20/2.5)^2 = 16 \\times 64 = 1024$ per group.',
        'Small but real effects need large trials; a trial of 30 patients can only detect large effects, and its "no difference" means little.'
      ],
      a: 'About 256 per group, or about 1,024 for half the difference.'
    }
  ],
  quiz: [
    { q: 'People with severe back pain are given a new remedy and are much better two weeks later. What is the main problem with concluding it works?', choices: ['back pain cannot be measured', 'many would improve anyway (natural course, regression to the mean, placebo) — there is no control group', 'two weeks is too long', 'the remedy is new'], a: 1,
      why: 'People seek help at their worst; improvement afterwards is expected. A randomised control group is needed to see the remedy\'s own effect.' },
    { q: 'What does randomisation achieve that careful matching cannot?', choices: ['larger groups', 'balance of unknown and unmeasured factors between the groups', 'blinding', 'a lower cost'], a: 1,
      why: 'Matching can only balance what is measured; chance allocation balances everything on average, including factors nobody knows about.' },
    { q: 'A treatment lowers an event rate from 4 % to 3 %. What is the number needed to treat?', answer: 100,
      why: 'Absolute reduction 1 percentage point: 1/0.01 = 100.' },
    { q: 'A trial finds p = 0.03. This means there is a 3 % chance that the treatment does not work.', a: false,
      why: 'The p-value is the chance of data at least this extreme *if* the treatment did nothing — not the chance that it does nothing, which also depends on how plausible the treatment was.' },
    { q: 'Of medicines entering phase 1 trials, roughly what share is eventually approved?', choices: ['about 90 %', 'about half', 'about one in ten', 'fewer than one in a thousand'], a: 2,
      why: 'Most fail for lack of benefit or for safety — roughly one in ten reaches approval, fewer in cancer.' }
  ],
  applications: ['Judging claims that a treatment "works".', 'Deciding whether to join a clinical trial.', 'Reading trial reports: absolute effects, NNT, confidence intervals.', 'Drug regulation and post-approval safety monitoring.'],
  history: 'James Lind compared six treatments for scurvy on a ship in 1747, and only citrus fruit worked. The British Medical Research Council\'s trial of streptomycin for tuberculosis (1948) was the first to allocate patients by formal randomisation. The thalidomide disaster led in 1962 to laws requiring proof of efficacy and safety before approval.',
  sim: 'cm-trial'
},

{
  id: 'pain-relief', parent: 'pharmacology', title: 'Pain relief', level: 1,
  short: 'The main pain-relieving medicines — paracetamol (acetaminophen), anti-inflammatories (NSAIDs) and opioids — work in different ways and carry different risks. Used well, often together and with non-drug approaches, they control most pain; used carelessly, each can cause serious harm.',
  keywords: ['pain relief', 'painkiller', 'analgesic', 'paracetamol', 'acetaminophen', 'NSAID', 'ibuprofen', 'aspirin', 'naproxen', 'opioid', 'morphine', 'codeine', 'fentanyl', 'naloxone', 'overdose', 'neuropathic pain', 'chronic pain', 'analgesic ladder', 'addiction', 'local anaesthetic'],
  prereq: ['pain', 'how-drugs-work', 'dose-response'],
  related: ['side-effects-interactions', 'anaesthesia-surgery', 'addiction', 'poisoning-overdose', 'liver-function', 'reflux-ulcers', 'chronic-kidney-disease'],
  body: `
After her knee operation, Rosa was sent home with three kinds of pain relief and a chart: regular paracetamol, an anti-inflammatory for the first few days, and a small supply of an opioid "only if needed". Her pharmacist explained why: each works differently, together they work better at lower doses, and the opioid was the one to use least and stop first. That is modern pain relief in miniature.

### How pain relief works
Pain begins when nerve endings detect damage or inflammation, travels up the spinal cord, and is interpreted by the brain ([[pain]]). Medicines can act at each stage: calming inflammation where it starts, blocking nerve signals, or turning down the signal in the spinal cord and brain.

### Paracetamol (acetaminophen)
The most widely used pain reliever and fever reducer. It is not fully understood how it works — mostly in the brain and spinal cord, with little anti-inflammatory effect. At the doses on the label it is gentle on the stomach and suitable for most people, including in pregnancy after discussion with a professional. Its danger is **overdose**: the liver turns a small part of each dose into a toxic by-product, normally neutralised; after too much, it overwhelms the liver's defences. Overdose often causes **no symptoms for a day or more**, while damage is building; an antidote works best when given early. Many cold and flu remedies also contain paracetamol, so taking them with paracetamol tablets can add up to an accidental overdose. Heavy drinking, low body weight and malnutrition increase the risk.

### Anti-inflammatories (NSAIDs)
Ibuprofen, naproxen, diclofenac, aspirin and others block the **cyclo-oxygenase** enzymes that make prostaglandins — messengers of pain, inflammation and fever. They are good for pain with inflammation: sprains, dental pain, period pain, arthritis. But prostaglandins also protect the stomach lining, keep blood flowing to the kidneys and help platelets work, so NSAIDs can cause:

- stomach irritation, **ulcers and bleeding**, more likely with age, previous ulcers, steroids, blood thinners or alcohol ([[reflux-ulcers]]);
- **kidney injury**, especially with dehydration, kidney disease or certain blood-pressure and water tablets;
- raised blood pressure, fluid retention, and a small increase in the risk of heart attack and stroke with some drugs and long use;
- worse asthma in a minority of people with asthma;
- problems in later pregnancy.

Creams and gels applied to the skin deliver much less drug to the blood. Low-dose aspirin, used to prevent clots, is a different use of the same class.

### Opioids
Morphine, codeine, oxycodone, fentanyl, tramadol and others act on **opioid receptors** in the brain and spinal cord. They are powerful for severe acute pain, after surgery and for cancer pain at the end of life, where they should never be withheld out of fear. Their effects come as a package: pain relief with drowsiness, nausea, **constipation** (which does not wear off), itching and — the dangerous one — **slowed breathing**. With regular use the body adapts: **tolerance** (the same dose does less) and **physical dependence** (withdrawal symptoms on stopping), which are expected and are not the same as **addiction** — compulsive use despite harm ([[addiction]]). For long-term pain other than cancer, opioids help less than many people expect and carry more risk, so they are used cautiously and reviewed often.

Opioid overdose has become a leading cause of death in some countries: in the US, opioids were involved in roughly 80,000 deaths a year at the 2022–2023 peak (CDC), mostly from illicitly made fentanyl, before a substantial fall in 2024. **Naloxone**, an opioid antagonist, reverses overdose within minutes and is available without prescription in a growing number of countries; because it wears off sooner than many opioids, emergency help is still needed. At the same time, most of the world's people live in countries with little access to morphine for severe pain — the opposite problem.

### Other tools
- **Nerve (neuropathic) pain** — burning, shooting pain from damaged nerves, as in diabetes or shingles — responds poorly to ordinary pain-killers but often better to certain antidepressants and anti-epileptic medicines, used in pain doses.
- **Local anaesthetics** block nerve signals at the source ([[anaesthesia-surgery]]).
- **Combinations** ("multimodal" relief) reach better relief with less of each drug.
- **Non-drug approaches** — movement and physiotherapy, heat or cold, sleep, psychological therapies that change how pain is processed — are central for long-lasting pain.

> [!warn] If someone may have taken too much paracetamol, even if they feel fine; if someone is very drowsy or cannot be woken, with slow or noisy breathing and pinpoint pupils after opioids (give naloxone if it is available and follow the call-handler's instructions); or if someone taking anti-inflammatories vomits blood or passes black tarry stools — call your local emergency number.

> [!note] How much of which pain-killer suits you depends on your age, other illnesses and medicines. Follow the label, do not combine products containing the same ingredient, and ask a pharmacist if in doubt.
`,
  ideas: [
    'Paracetamol, NSAIDs and opioids relieve pain in different ways; combining them gives better relief with less of each.',
    'Paracetamol is safe at labelled doses but damages the liver in overdose, often silently at first.',
    'NSAIDs block prostaglandins, which also protect the stomach, kidneys and blood pressure — hence their risks.',
    'Opioids relieve severe pain but slow breathing; tolerance and dependence are expected, addiction is different.',
    'Nerve pain needs different medicines; non-drug approaches matter most for long-lasting pain.'
  ],
  pitfalls: [
    'Paracetamol is so safe that the dose does not matter — Overdose is a leading cause of acute liver failure, and it often hides in combination cold remedies.',
    'Needing more opioid over time means addiction — Tolerance and physical dependence are expected with regular use; addiction is compulsive use despite harm.',
    'Anti-inflammatory gels and tablets carry the same risks — Gels put much less drug into the blood, though they are not entirely risk-free.'
  ],
  examples: [
    {
      title: 'The hidden double dose',
      q: 'Someone with flu takes paracetamol tablets on schedule and also a "cold and flu" hot drink several times a day. Why might this be a problem?',
      steps: [
        'Many cold and flu products contain paracetamol themselves.',
        'Taking both means two sources of the same drug, which can add up to more than the maximum daily amount on the label.',
        'Because overdose may cause no symptoms for a day or more, the reading of labels — or a quick question to a pharmacist — is the protection.'
      ],
      a: 'The products may both contain paracetamol, adding up to an accidental overdose.'
    },
    {
      title: 'Choosing by mechanism',
      q: 'Match the pain to the class most likely to help first: a sprained ankle; burning, shooting pain in the feet from diabetic nerve damage; severe pain on the first day after major surgery.',
      steps: [
        'A sprain is inflammatory: an anti-inflammatory (if safe for the person), with ice, rest and paracetamol.',
        'Nerve pain responds poorly to ordinary pain-killers; certain antidepressants or anti-epileptic medicines are used.',
        'Severe post-operative pain: combined paracetamol and anti-inflammatory, with an opioid for a short time, often with a local anaesthetic block.'
      ],
      a: 'Inflammation: NSAID; nerve pain: neuropathic-pain medicines; severe acute pain: combinations including a short course of opioid.'
    }
  ],
  quiz: [
    { q: 'Which pain reliever is most likely to cause a stomach ulcer with long use?', choices: ['paracetamol', 'an NSAID such as ibuprofen or naproxen', 'a local anaesthetic cream', 'an opioid'], a: 1,
      why: 'NSAIDs block prostaglandins that protect the stomach lining. Paracetamol does not, and opioids cause constipation rather than ulcers.' },
    { q: 'After a paracetamol overdose, a person who feels completely well does not need medical help.', a: false,
      why: 'Liver damage builds silently for a day or more; the antidote works best early. Anyone who may have taken too much needs urgent medical advice at once.' },
    { q: 'Which side effect of opioids does not lessen with continued use?', choices: ['nausea', 'drowsiness', 'constipation', 'itching'], a: 2,
      why: 'Tolerance develops to nausea and drowsiness, but hardly at all to constipation, which is why laxatives are usually given alongside.' },
    { q: 'What does naloxone do?', choices: ['it is a stronger opioid', 'it blocks opioid receptors and reverses an overdose', 'it protects the liver', 'it treats withdrawal permanently'], a: 1,
      why: 'Naloxone is an opioid antagonist: it displaces opioids from their receptors and restores breathing, for a limited time — emergency help is still needed.' }
  ],
  applications: ['Multimodal pain relief after surgery.', 'Safe use of over-the-counter pain relievers.', 'Naloxone distribution to prevent overdose deaths.', 'Palliative care for cancer pain.'],
  history: 'Willow bark, a source of salicylates, was used for pain in antiquity; aspirin was made in 1897, and paracetamol entered wide use in the 1950s. Morphine was isolated from opium by Friedrich Sertürner around 1804 — the first drug purified from a plant. The WHO\'s "analgesic ladder" (1986) spread effective cancer pain relief worldwide.'
},

{
  id: 'anaesthesia-surgery', parent: 'pharmacology', title: 'Anaesthesia and surgery', level: 2,
  short: 'Anaesthesia makes surgery possible: local and regional anaesthesia block the nerves to one part of the body, sedation relaxes, and general anaesthesia brings a controlled, reversible unconsciousness. With modern monitoring it has become one of the safest parts of medicine; most of the risk of an operation lies in the surgery and the patient\'s health.',
  keywords: ['anaesthesia', 'anesthesia', 'general anaesthetic', 'local anaesthetic', 'spinal', 'epidural', 'nerve block', 'sedation', 'MAC', 'minimum alveolar concentration', 'awareness', 'fasting before surgery', 'malignant hyperthermia', 'postoperative nausea', 'surgical safety checklist', 'delirium'],
  prereq: ['how-drugs-work', 'pain-relief', 'action-potential'],
  related: ['vital-signs', 'pulmonary-embolism', 'anaphylaxis', 'side-effects-interactions', 'ageing', 'chemistry:partial-pressures'],
  body: `
Before 1846 surgery meant speed and strong assistants to hold the patient down. On 16 October of that year, in Boston, a dentist gave ether to a man having a tumour removed from his neck, and the patient slept through it. Within months anaesthesia had spread around the world. Today, when Daniel, 70, has a hip replaced, a small injection in his back numbs his legs, a gentle sedative lets him doze, and he is eating lunch the same afternoon.

### The kinds of anaesthesia
- **Local anaesthesia** numbs a small area — a tooth, a cut, a mole to be removed. The drug blocks **sodium channels** in nerve fibres, so pain signals cannot fire ([[action-potential]]); you stay fully awake.
- **Regional anaesthesia** blocks a larger territory. A **spinal** injects local anaesthetic into the fluid around the lower spinal nerves, numbing the body from the waist down for a few hours; an **epidural** places a fine tube just outside that space for continuous relief, as in labour; **nerve blocks** numb an arm or a leg and give hours of pain relief after surgery.
- **Sedation** relaxes you and dulls awareness while you keep breathing on your own — often used with local or regional anaesthesia, or for endoscopy.
- **General anaesthesia** is a controlled, reversible loss of consciousness. It combines several effects, often from several drugs: **unconsciousness** and **no memory** of the operation, **pain relief**, and, when needed, **muscle relaxation**. Usually it is started with a drug into a vein and kept going with an anaesthetic vapour breathed in, or with a continuous infusion. Because breathing is depressed, the anaesthetist secures the airway with a mask, a laryngeal mask or a tube in the windpipe, and often breathes for the patient with a ventilator.

### How the dose of a vapour is judged
The strength of an inhaled anaesthetic is described by its **minimum alveolar concentration (MAC)**: the concentration in the lungs at which half of people do not move when the skin is cut ([[chemistry:partial-pressures|partial pressures]] of the gases set it). When a vapour is used on its own, anaesthetists usually aim for about 1 MAC or a little more; other drugs given alongside lower the requirement. MAC falls with age — by about 6 % per decade — which is one reason older people need less anaesthetic. An empirical fit (Mapleson, 1996) is

$$\\text{MAC}_\\text{age} = \\text{MAC}_{40} \\times 10^{-0.00269\\,(\\text{age} - 40)}$$

### How safe it is
During anaesthesia a specialist stays with the patient throughout, watching the heart rhythm ([[vital-signs]]), blood pressure, oxygen level, breathed-out carbon dioxide (which confirms the tube is in the windpipe and breathing is working), temperature and anaesthetic concentration. In high-income countries deaths caused mainly by anaesthesia have fallen more than tenfold since the 1960s and are now rare — in the order of one in 100,000 anaesthetics or fewer. The overall risk of an operation depends far more on the person's health, the urgency and the size of the surgery. Other risks, most small:

- **nausea and vomiting** after surgery, common but largely preventable with medicines;
- sore throat, shivering, and in older people temporary **confusion (delirium)**;
- **awareness** — being partly conscious during general anaesthesia — is rare, about 1 in 19,000 anaesthetics in a large UK survey (NAP5, 2014), more likely in some emergency and caesarean anaesthetics;
- **allergic reactions** (about 1 in 10,000 anaesthetics in the UK's NAP6, 2018), most often to antibiotics or muscle relaxants, treated on the spot;
- very rare inherited reactions such as **malignant hyperthermia**, triggered by some anaesthetic drugs in susceptible families.

The WHO's **Surgical Safety Checklist** (2008) — a pause to confirm the patient, the operation, allergies and equipment — was followed in an international study by fewer deaths (1.5 % to 0.8 %) and complications (11 % to 7 %).

### Before and after
Tell the team about all your medicines (especially blood thinners, diabetes medicines and herbal remedies), allergies, previous problems with anaesthesia in you or your family, loose teeth, and whether you smoke or drink. Follow the **fasting** instructions exactly: food in the stomach can be brought up and inhaled while reflexes are switched off; hospitals commonly allow clear fluids until about two hours before. After surgery, moving early, breathing deeply and taking pain relief regularly speed recovery and lower the risk of clots and chest infections.

After an operation, contact your surgical team promptly for a painful, swollen calf, fever, a wound that becomes red, hot or leaks pus, or pain that is not controlled.

> [!warn] After an operation, chest pain, sudden breathlessness or coughing up blood (possibly a clot in the lung — [[pulmonary-embolism]]), heavy bleeding, or new confusion or collapse are emergencies: call your local emergency number.
`,
  ideas: [
    'Local and regional anaesthesia block nerves (sodium channels); general anaesthesia gives reversible unconsciousness, memory loss, pain relief and relaxation.',
    'The airway and breathing are protected during general anaesthesia, and the patient is monitored continuously.',
    'MAC measures an inhaled anaesthetic\'s strength and falls by about 6 % per decade of age.',
    'Deaths caused mainly by anaesthesia are rare today; most surgical risk comes from the operation and the patient\'s health.',
    'Honest information before surgery and following the fasting rules are the patient\'s part in safety.'
  ],
  pitfalls: [
    'General anaesthesia is a deep sleep — It is a drug-induced, controlled state quite different from sleep: the brain does not respond to surgery, and breathing and reflexes are suppressed.',
    'Fasting rules are just caution and can be bent — Food or drink in the stomach can be inhaled when protective reflexes are switched off; follow the hospital\'s instructions.',
    'Older people need the same anaesthetic dose as younger ones — Requirements fall with age (MAC about 6 % per decade), and older brains are more prone to delirium.'
  ],
  formulas: [
    {
      name: 'MAC and age',
      expr: 'MAC = MAC40*10^(-0.00269*(age - 40))', tex: '\\text{MAC} = \\text{MAC}_{40} \\times 10^{-0.00269\\,(a - 40)}',
      vars: {
        MAC: { name: 'minimum alveolar concentration at this age', q: 'ratio', unit: '%', tex: '\\text{MAC}' },
        MAC40: { name: 'MAC at age 40', q: 'ratio', unit: '%', value: 2, min: 0, max: 100, tex: '\\text{MAC}_{40}' },
        age: { name: 'age (years)', value: 80, min: 1, max: 110, tex: 'a' }
      },
      note: 'An empirical fit (Mapleson, 1996; Nickalls and Mapleson, 2003) for adults, in volume per cent of the vapour in the lungs. A factor of 10^(−0.0269) = 0.94 per decade: about 6 % less per ten years.',
      stories: { MAC: 'A hypothetical vapour has a MAC of {MAC40} at age 40. What is its MAC at {age}?', age: 'At what age has the MAC of a vapour fallen from {MAC40} (at 40) to {MAC}?' }
    }
  ],
  examples: [
    {
      title: 'Less anaesthetic with age',
      q: 'An inhaled anaesthetic has a MAC of 2.0 % at age 40. Estimate its MAC at 20 and at 80.',
      steps: [
        'At 20: $2.0 \\times 10^{-0.00269 \\times (-20)} = 2.0 \\times 10^{0.0538} = 2.26$ %.',
        'At 80: $2.0 \\times 10^{-0.00269 \\times 40} = 2.0 \\times 10^{-0.1076} = 1.56$ %.',
        'An 80-year-old needs about 30 % less than a 20-year-old for the same effect — one of many reasons anaesthetists tailor every anaesthetic.'
      ],
      a: 'About 2.3 % at 20 and 1.6 % at 80.'
    }
  ],
  quiz: [
    { q: 'How do local anaesthetics prevent pain?', choices: ['they make the brain unconscious', 'they block sodium channels in nerves, so pain signals cannot be sent', 'they reduce inflammation', 'they act on opioid receptors'], a: 1,
      why: 'Without sodium entry the nerve fibre cannot fire an action potential, so the signal never reaches the spinal cord and brain.' },
    { q: 'Why must patients fast before a general anaesthetic?', choices: ['to lose weight', 'food in the stomach can be brought up and inhaled when protective reflexes are switched off', 'food makes the anaesthetic stronger', 'to make the surgery easier'], a: 1,
      why: 'Inhaling stomach contents (aspiration) can cause severe pneumonia; an empty stomach makes it much less likely.' },
    { q: 'A vapour has a MAC of 1.2 % at age 40. Roughly what is its MAC at 70? (in %)', answer: 0.99, unit: '%',
      why: '$1.2 \\times 10^{-0.00269 \\times 30} = 1.2 \\times 0.830 = 1.0$ %.' },
    { q: 'For a healthy person having a routine operation, the anaesthetic itself is usually the biggest risk.', a: false,
      why: 'Deaths caused mainly by anaesthesia are rare today (in the order of one in 100,000 or fewer in high-income countries); the risks of the operation and the person\'s own health matter far more.' },
    { q: 'What does monitoring the carbon dioxide in each breath confirm during general anaesthesia?', choices: ['the patient\'s temperature', 'that the breathing tube is in the windpipe and breathing is effective', 'the depth of the anaesthetic', 'the blood sugar'], a: 1,
      why: 'Carbon dioxide appears in exhaled gas only if the lungs are being ventilated — capnography is one of the key safety advances of modern anaesthesia.' }
  ],
  applications: ['Choosing between local, regional and general anaesthesia for an operation.', 'Adjusting anaesthetic doses for older patients.', 'Pre-operative assessment: medicines, allergies, fasting.', 'Surgical safety checklists in operating theatres worldwide.'],
  history: 'William Morton\'s public demonstration of ether (Boston, 1846) was followed by chloroform (James Simpson, 1847), which John Snow gave to Queen Victoria in childbirth in 1853. Carl Koller used cocaine as a local anaesthetic for eye surgery in 1884, and August Bier gave the first spinal anaesthetic in 1898.'
}

);
