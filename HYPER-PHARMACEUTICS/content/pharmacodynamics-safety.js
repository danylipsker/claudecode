/* HYPER-PHARMACEUTICS · content/pharmacodynamics-safety.js
 * Pharmacodynamics (pd-topic): receptors, agonists and antagonists, dose–response, potency and efficacy,
 * the therapeutic index, tolerance, drug interactions, pharmacogenomics and PK/PD modelling.
 * Safety (safety-topic): pharmacovigilance, adverse drug reactions, medication errors, clinical trials and
 * antimicrobial stewardship. Simulations in sims/pharmacodynamics-safety.js (prefix pd-).
 * All drugs in examples and calculations are hypothetical unless named as a class or teaching example. */
Hyper.add(

{
  id: 'receptors', parent: 'pd-topic', title: 'Receptors and ligands', level: 2,
  short: 'Most drugs act by binding to a protein target — a receptor, enzyme, channel or transporter. The law of mass action links concentration to the fraction of targets occupied: half at the dissociation constant Kd, 90 % at nine times Kd.',
  keywords: ['receptor', 'ligand', 'binding', 'affinity', 'Kd', 'dissociation constant', 'occupancy', 'kon', 'koff', 'residence time', 'GPCR', 'ion channel', 'nuclear receptor', 'Cheng–Prusoff', 'radioligand', 'selectivity'],
  prereq: ['what-is-a-drug', 'medicine:how-drugs-work', 'chemistry:equilibrium-constant', 'biology:cell-signalling'],
  related: ['agonists-antagonists', 'dose-response', 'potency-efficacy', 'protein-binding', 'adverse-reactions', 'biology:enzyme-kinetics'],
  body: `
A drug molecule does nothing until it touches something. For most medicines that something is a protein: a **receptor** that relays a signal into the cell, an **enzyme** whose active site the drug blocks, an **ion channel** it opens or plugs, or a **transporter** it jams. Pharmacologists call anything a drug binds a *target*, and the molecule that binds a *ligand*. Roughly a third of all approved medicines act on one family alone — the G-protein-coupled receptors.

### Four families of receptors
| Family | Examples | Response time | Drugs acting there |
|---|---|---|---|
| Ligand-gated ion channels | nicotinic acetylcholine, GABA$_A$ | milliseconds | neuromuscular blockers, benzodiazepines |
| G-protein-coupled receptors | β-adrenoceptors, μ-opioid, H$_1$ | seconds | β-blockers, opioids, antihistamines |
| Kinase-linked receptors | insulin receptor, EGFR | minutes to hours | insulin, many cancer medicines |
| Nuclear receptors | glucocorticoid, oestrogen | hours to days | corticosteroids, tamoxifen |

The response time follows the machinery: a channel opens as soon as the ligand lands, while a nuclear receptor must switch genes on and wait for new protein to be made.

### Binding follows the law of mass action
A ligand L and a receptor R meet and part again, $\\ce{L + R <=> LR}$, with an association rate constant $k_\\text{on}$ and a dissociation rate constant $k_\\text{off}$. At equilibrium the fraction of receptors occupied is

$$f = \\frac{C}{C + K_d}, \\qquad K_d = \\frac{k_\\text{off}}{k_\\text{on}}$$

where $C$ is the **free** concentration at the receptor and $K_d$ the dissociation constant. A smaller $K_d$ means tighter binding — higher **affinity**. Occupancy is 50 % at $C = K_d$, 90 % at $9K_d$ and 99 % at $99K_d$: each extra "nine" costs a tenfold rise in concentration. Many drugs have $K_d$ values between 0.1 and 100 nM, so their plasma levels are tiny in mass terms — 1 nM of a 400 g/mol drug is 0.4 µg/L.

Affinity is free energy in disguise: $\\Delta G = RT\\ln K_d$ (with $K_d$ in mol/L). At 37 °C, 1 nM corresponds to −53 kJ/mol, and every tenfold gain in affinity is worth another 5.9 kJ/mol — which is why one well-placed hydrogen bond can change a drug's potency tenfold.

### How long a drug stays: residence time
Association is fast — typically $10^5$ to $10^8$ per molar per second, approaching the diffusion limit. Dissociation varies far more. A drug with $k_\\text{off} = 10^{-3}$ s⁻¹ leaves with a half-life of 12 minutes; one with $10^{-5}$ s⁻¹ stays for 19 hours, and keeps acting long after its plasma level has fallen. Some inhaled bronchodilators owe their once-daily use to this. A few drugs never leave: aspirin acetylates platelet cyclo-oxygenase for the platelet's whole 8–10-day life, and proton-pump inhibitors bond covalently to the pump.

### Measuring affinity
Affinity is measured by **radioligand binding**: membranes carrying the receptor are incubated with a labelled ligand, and a test drug competes it off. The concentration that halves specific binding (IC$_{50}$) overstates $K_i$ when the radioligand itself competes, which the **Cheng–Prusoff** correction removes.

> [!key] Occupancy depends on the free concentration relative to $K_d$ — not on the dose, and not on the total (protein-bound) level. Only unbound drug can reach and occupy a receptor (see [[protein-binding]]).

### Selectivity is relative
No drug binds only one target. A drug with $K_d$ = 1 nM at its target and 1 µM at another is "1000-fold selective" — but at high enough concentration the second target fills too, and that is where many side effects begin (see [[adverse-reactions]]). Receptors are chiral, so the two mirror-image forms of a drug often differ in affinity by 10- to 100-fold (see [[chemistry:stereoisomers|stereoisomers]]).
`,
  ideas: [
    'A drug acts by binding a target: receptor, enzyme, ion channel or transporter.',
    'Occupancy f = C/(C + Kd): half at Kd, 90 % at 9 Kd, 99 % at 99 Kd.',
    'Kd = koff/kon; ΔG = RT ln Kd, so each tenfold in affinity is 5.9 kJ/mol at 37 °C.',
    'Slow dissociation (long residence time) can make a drug act longer than its plasma level suggests.',
    'Selectivity is a ratio of affinities — enough drug reaches any target, which is one root of side effects.'
  ],
  pitfalls: [
    'A drug with high affinity must be a strong drug — Affinity decides how much drug is needed to occupy the receptor; what occupation does (efficacy) is a separate property. An antagonist can bind very tightly and do nothing at all by itself.',
    'Occupancy follows the total plasma concentration — Only the free (unbound) drug at the receptor counts; a drug 99 % bound to albumin has a free concentration a hundred times lower than its total level.',
    'The IC₅₀ from a binding assay is the drug\'s affinity — IC₅₀ depends on how much radioligand is present and how tightly it binds; the Cheng–Prusoff equation converts it to the true inhibition constant Ki.'
  ],
  formulas: [
    {
      name: 'Receptor occupancy (Hill–Langmuir)',
      expr: 'f = C/(C + Kd)', tex: 'f = \\frac{C}{C + K_d}',
      vars: {
        f: { name: 'fraction of receptors occupied', q: 'ratio', unit: '%' },
        C: { name: 'free drug concentration', q: 'concentration', unit: 'nM', value: 6 },
        Kd: { name: 'dissociation constant', q: 'concentration', unit: 'nM', value: 2, tex: 'K_d' }
      },
      note: 'One binding site, equilibrium, and a ligand concentration not depleted by binding. C is the free concentration at the receptor.',
      practice: { unknowns: ['f', 'C', 'Kd'] },
      stories: {
        f: 'A hypothetical drug binds its receptor with Kd = {Kd}. What fraction of receptors is occupied at a free concentration of {C}?',
        C: 'A drug has Kd = {Kd}. What free concentration occupies {f} of its receptors?',
        Kd: 'At a free concentration of {C}, a binding study finds {f} of receptors occupied. What is the Kd?'
      }
    },
    {
      name: 'Kd from binding kinetics',
      expr: 'Kd = koff/kon', tex: 'K_d = \\frac{k_\\text{off}}{k_\\text{on}}',
      vars: {
        Kd: { name: 'dissociation constant', q: 'concentration', unit: 'nM', tex: 'K_d' },
        koff: { name: 'dissociation rate constant', q: 'rate', unit: '1/s', value: 0.001, tex: 'k_\\text{off}' },
        kon: { name: 'association rate constant', q: 'rateconst2', unit: '1/(M·s)', value: 1e6, tex: 'k_\\text{on}' }
      },
      note: 'The residence time is 1/koff and the dissociation half-life ln 2/koff.',
      stories: { Kd: 'A ligand associates with kon = {kon} and dissociates with koff = {koff}. What is its Kd?', koff: 'A drug has Kd = {Kd} and kon = {kon}. What is its dissociation rate constant?' }
    },
    {
      name: 'Binding free energy',
      expr: 'dG = R*T*ln(Kd)', tex: '\\Delta G = RT\\ln K_d',
      vars: {
        dG: { name: 'standard free energy of binding', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        Kd: { name: 'dissociation constant (mol/L)', value: 1e-9, tex: 'K_d' }
      },
      note: 'Kd is taken relative to the 1 mol/L standard state, so it enters the logarithm as a pure number.',
      stories: { dG: 'A drug binds its target with Kd = {Kd} mol/L at {T}. What is the free energy of binding?', Kd: 'Binding releases {dG} at {T}. What is the Kd in mol/L?' }
    },
    {
      name: 'Cheng–Prusoff: Ki from a competition assay',
      expr: 'Ki = IC50/(1 + L/KL)', tex: 'K_i = \\frac{\\text{IC}_{50}}{1 + \\mathrm{[L]}/K_L}',
      vars: {
        Ki: { name: 'inhibition constant of the test drug', q: 'concentration', unit: 'nM', tex: 'K_i' },
        IC50: { name: 'concentration halving specific binding', q: 'concentration', unit: 'nM', value: 30, tex: '\\text{IC}_{50}' },
        L: { name: 'radioligand concentration', q: 'concentration', unit: 'nM', value: 2, tex: '\\mathrm{[L]}' },
        KL: { name: 'Kd of the radioligand', q: 'concentration', unit: 'nM', value: 1, tex: 'K_L' }
      },
      note: 'For competition at one site at equilibrium (Cheng and Prusoff, 1973).',
      stories: { Ki: 'A test drug halves the binding of {L} of a radioligand (Kd = {KL}) at {IC50}. What is its Ki?' }
    }
  ],
  examples: [
    {
      title: 'How much drug for how much occupancy?',
      q: 'A hypothetical drug binds its receptor with $K_d$ = 2 nM. What free concentration gives 50 %, 90 % and 99 % occupancy? What occupancy does 6 nM give?',
      steps: [
        'Rearranging $f = C/(C + K_d)$ gives $C = K_d\\,f/(1 - f)$.',
        '50 %: $C = K_d$ = 2 nM. 90 %: $C = 9K_d$ = 18 nM. 99 %: $C = 99K_d$ = 198 nM.',
        'At 6 nM: $f = 6/(6 + 2) = 0.75$.',
        'Going from 90 % to 99 % occupancy needs eleven times more drug — and at 198 nM, other targets with $K_d$ near 1 µM would already be 17 % occupied.'
      ],
      a: '2, 18 and 198 nM; 6 nM occupies 75 % of the receptors.'
    },
    {
      title: 'A slow off-rate',
      q: 'Two hypothetical antagonists both associate with $k_\\text{on} = 10^6$ M⁻¹ s⁻¹. Drug A dissociates with $k_\\text{off} = 10^{-3}$ s⁻¹, drug B with $10^{-5}$ s⁻¹. Compare their $K_d$ and dissociation half-lives.',
      steps: [
        'A: $K_d = 10^{-3}/10^6 = 10^{-9}$ M = 1 nM; $t_{1/2} = 0.693/10^{-3}$ = 693 s ≈ 12 minutes.',
        'B: $K_d = 10^{-11}$ M = 10 pM; $t_{1/2} = 0.693/10^{-5}$ = 69 300 s ≈ 19 hours.',
        'B binds 100 times more tightly — and, once bound, keeps its receptors blocked through the night even after the plasma level has fallen.'
      ],
      a: 'A: 1 nM and 12 minutes. B: 10 pM and 19 hours — a long residence time.'
    },
    {
      title: 'From IC₅₀ to Ki',
      q: 'In a competition assay with 2 nM of a radioligand whose $K_d$ is 1 nM, a test compound halves specific binding at 30 nM. What is its $K_i$, and its binding free energy at 37 °C?',
      steps: [
        '$K_i = 30/(1 + 2/1) = 10$ nM.',
        '$\\Delta G = RT\\ln K_d = 8.314 \\times 310.15 \\times \\ln(10^{-8})$ J/mol $= 2579 \\times (-18.42) = -47.5$ kJ/mol.'
      ],
      a: 'Ki = 10 nM; ΔG ≈ −47.5 kJ/mol.'
    }
  ],
  quiz: [
    { q: 'At a free concentration equal to $K_d$, what fraction of receptors is occupied?', choices: ['10 %', '50 %', '63 %', '90 %'], a: 1, why: 'f = Kd/(Kd + Kd) = 1/2. 90 % needs 9 Kd.' },
    { q: 'By what factor must the concentration rise to go from 50 % to 90 % occupancy?', answer: 9, why: 'C = Kd f/(1 − f): 1 × Kd at 50 %, 9 × Kd at 90 %.' },
    { q: 'A ligand has $k_\\text{on} = 2\\times10^5$ M⁻¹ s⁻¹ and $k_\\text{off} = 2\\times10^{-3}$ s⁻¹. What is its $K_d$ in nM?', answer: 10, unit: 'nM', why: 'Kd = 2×10⁻³ / 2×10⁵ = 10⁻⁸ M = 10 nM.' },
    { q: 'A drug that binds its receptor more tightly (smaller Kd) always produces a bigger maximal effect.', a: false, why: 'Affinity sets the concentration needed; the maximal effect depends on efficacy. A high-affinity antagonist has no effect of its own.' },
    { q: 'Which receptor family responds fastest?', choices: ['nuclear receptors', 'kinase-linked receptors', 'G-protein-coupled receptors', 'ligand-gated ion channels'], a: 3, why: 'A ligand-gated channel opens within milliseconds; GPCRs take seconds, kinase cascades minutes, and nuclear receptors hours because new protein must be made.' }
  ],
  problems: [
    { q: 'A test compound halves the specific binding of 3 nM of a radioligand (Kd 1.5 nM) at 120 nM. What is its Ki?', answer: 40, unit: 'nM', tol: 0.02, steps: ['$K_i = 120/(1 + 3/1.5) = 120/3 = 40$ nM.'] },
    { q: 'What is the standard free energy of binding (kJ/mol) of a drug with Kd = 0.1 nM at 37 °C?', answer: -59.4, unit: 'kJ/mol', tol: 0.02, steps: ['$\\Delta G = RT\\ln K_d = 8.314 \\times 310.15 \\times \\ln(10^{-10})$.', '$= 2579 \\times (-23.03) = -59\\,400$ J/mol ≈ −59.4 kJ/mol.'] }
  ],
  applications: ['Choosing and ranking drug candidates by affinity and selectivity in drug discovery.', 'Estimating receptor occupancy from a measured free plasma level — for instance, the occupancy targets used when developing antipsychotics and imaging them with PET.', 'Explaining long-acting drugs whose effect outlasts their plasma level (slow dissociation, covalent binding).'],
  history: 'John Newport Langley proposed a "receptive substance" in muscle in 1905, from experiments with nicotine and curare, and Paul Ehrlich summed up the idea as "a substance does not act unless it is bound". A. J. Clark applied the law of mass action to drug action in the 1920s and 1930s. Radioligand binding made receptors measurable in the 1970s, and Robert Lefkowitz and Brian Kobilka shared the 2012 Nobel Prize in Chemistry for revealing how G-protein-coupled receptors work.',
  sim: 'pd-reserve'
},

{
  id: 'agonists-antagonists', parent: 'pd-topic', title: 'Agonists and antagonists', level: 2,
  short: 'An agonist binds and activates a receptor; an antagonist binds and blocks it. Competitive antagonists shift the agonist\'s dose–response curve to the right in parallel, by a dose ratio of 1 + [B]/KB — the basis of Schild analysis; non-competitive and irreversible ones lower its maximum.',
  keywords: ['agonist', 'antagonist', 'partial agonist', 'inverse agonist', 'competitive antagonism', 'non-competitive', 'irreversible', 'allosteric modulator', 'Schild plot', 'pA2', 'dose ratio', 'Gaddum', 'surmountable', 'KB'],
  prereq: ['receptors', 'dose-response', 'math:logarithms'],
  related: ['potency-efficacy', 'drug-interactions', 'tolerance', 'medicine:how-drugs-work', 'biology:enzyme-inhibition'],
  body: `
Binding is only half the story. Once a ligand sits on a receptor, it may switch the receptor on, leave it as it was, or even turn it further off. **Affinity** decides how much ligand binds; **efficacy** decides what the bound receptor does.

### Agonists: full, partial and inverse
A useful picture is the **two-state model**: every receptor flips between an inactive form R and an active form R*. A **full agonist** binds R* much more tightly than R, pulls the population into the active state and produces the largest response the tissue can give. A **partial agonist** favours R* only moderately, so even with every receptor occupied the response stays below the maximum. Many receptors are a little active with nothing bound (*constitutive activity*); an **inverse agonist** prefers R and switches even that off. A **neutral antagonist** binds both forms equally and changes nothing — except that it keeps agonists out.

Partial agonists have a double character. Alone they stimulate; next to a full agonist they compete for the same receptors and *reduce* the response towards their own lower ceiling. Some opioid and nicotinic partial agonists are used precisely for this.

### Competitive antagonists: a parallel shift
A **competitive** (surmountable) antagonist B occupies the agonist's own site reversibly. Enough agonist always wins, so the maximum is unchanged, but more agonist is needed: the log dose–response curve moves right in parallel. John Gaddum (1937) showed that the factor — the **dose ratio** DR, EC$_{50}$ with antagonist divided by EC$_{50}$ without — is

$$\\text{DR} = 1 + \\frac{\\mathrm{[B]}}{K_B}$$

It does not depend on which agonist is used — only on the antagonist and the receptor. Heinz Schild turned this into a tool: plot $\\log(\\text{DR} - 1)$ against $\\log\\mathrm{[B]}$. For simple competition the points fall on a straight line of **slope 1**, and where it crosses zero is the **pA₂**, the negative log of the concentration that makes DR = 2 — equal to $-\\log K_B$. Because pA₂ is a property of the receptor, it classifies receptors: atropine gives a pA₂ near 9 at muscarinic receptors in gut, bladder and heart alike. A slope well below 1 warns that something else is going on — an allosteric mechanism, drug uptake, or more than one receptor.

### Insurmountable antagonists: a lower ceiling
A **non-competitive** antagonist binds elsewhere and stops the receptor responding, and an **irreversible** antagonist bonds covalently to the site. Extra agonist cannot overcome either, so the maximum falls; without spare receptors, $E_\\text{max,B} = E_\\text{max}/(1 + \\mathrm{[B]}/K_B)$. In tissues with a large receptor reserve an irreversible antagonist first shifts the curve right and only later depresses it (see [[potency-efficacy]]).

### Allosteric modulators: a built-in ceiling
Allosteric modulators bind a separate site and change the agonist's affinity or efficacy by a cooperativity factor α. A negative modulator shifts the curve, but by at most $1/\\alpha$ however much is added: $\\text{DR} = (1 + [B]/K_B)/(1 + \\alpha[B]/K_B)$. Positive modulators amplify the natural transmitter — benzodiazepines make GABA more effective at GABA$_A$ receptors but cannot open the channel alone, one reason they have a ceiling that older sedatives lacked. That ceiling disappears when several depressant drugs, or alcohol, are combined.

| Type | Curve | Maximum | Schild slope | Example mechanism |
|---|---|---|---|---|
| Competitive, reversible | parallel shift right | unchanged | 1 | muscarinic antagonists |
| Irreversible | shift, then lower | falls | not applicable | covalent α-blockers |
| Non-competitive | lower | falls | not applicable | channel blockers |
| Negative allosteric | limited shift | unchanged or falls | < 1, saturating | allosteric modulators |

### Antagonism without a shared receptor
**Physiological** antagonists act on different receptors with opposite effects — adrenaline relaxes the airways that histamine constricts, which is why it is the emergency treatment for anaphylaxis. **Chemical** antagonists bind the drug itself (protamine neutralises heparin). **Pharmacokinetic** antagonists lower the other drug's level (see [[drug-interactions]]).

> [!warn] Opioid overdose — pinpoint pupils, very slow or stopped breathing, unresponsiveness — is an emergency: call your local emergency number. The competitive antagonist naloxone displaces opioids from their receptors, but it may wear off before the opioid does, so the person still needs medical care.
`,
  ideas: [
    'Affinity decides binding; efficacy decides what the bound receptor does.',
    'Full agonists give the tissue maximum, partial agonists less, inverse agonists reduce constitutive activity.',
    'A competitive antagonist shifts the curve right in parallel by DR = 1 + [B]/KB; the maximum is unchanged.',
    'Schild plot: log(DR − 1) against log[B] has slope 1 for simple competition, and its intercept pA₂ = −log KB.',
    'Non-competitive and irreversible antagonists lower the maximum; allosteric modulators have a ceiling of 1/α.'
  ],
  pitfalls: [
    'An antagonist has an effect of its own — A neutral antagonist does nothing by itself; what it does is prevent the agonist (or the body\'s own transmitter) from acting. The visible effect depends on how much agonist tone there was.',
    'A partial agonist is just a weak full agonist — Weakness in potency is about EC₅₀; a partial agonist cannot reach the full maximum at any concentration, and it can lower the response to a full agonist.',
    'Any rightward shift means competitive antagonism — Only a parallel shift with an unchanged maximum and a Schild slope of 1 fits simple competition; a slope below 1 or a limited shift points to allosteric or other mechanisms.'
  ],
  formulas: [
    {
      name: 'Gaddum–Schild: the dose ratio',
      expr: 'DR = 1 + B/KB', tex: '\\text{DR} = 1 + \\frac{\\mathrm{[B]}}{K_B}',
      vars: {
        DR: { name: 'dose ratio (EC₅₀ with ÷ without antagonist)', tex: '\\text{DR}' },
        B: { name: 'antagonist concentration', q: 'concentration', unit: 'nM', value: 30, tex: '\\mathrm{[B]}' },
        KB: { name: 'antagonist dissociation constant', q: 'concentration', unit: 'nM', value: 3, tex: 'K_B' }
      },
      note: 'For a reversible competitive antagonist at equilibrium; the same for every agonist acting at that receptor.',
      practice: { unknowns: ['DR', 'B', 'KB'] },
      stories: {
        DR: 'A competitive antagonist with KB = {KB} is present at {B}. By what factor must the agonist concentration rise to give the same effect?',
        KB: 'At {B}, a competitive antagonist shifts an agonist\'s EC₅₀ by a factor of {DR}. What is its KB?',
        B: 'What concentration of a competitive antagonist (KB = {KB}) shifts the agonist curve by a factor of {DR}?'
      }
    },
    {
      name: 'pA₂ from one dose ratio',
      expr: 'pA2 = log(DR - 1) - log(B)', tex: '{\\mathrm{p}A}_2 = \\log(\\text{DR} - 1) - \\log\\mathrm{[B]}',
      vars: {
        pA2: { name: 'pA₂ (−log KB for a competitive antagonist)', tex: '{\\mathrm{p}A}_2' },
        DR: { name: 'dose ratio', value: 21, tex: '\\text{DR}' },
        B: { name: 'antagonist concentration (mol/L)', value: 1e-8, tex: '\\mathrm{[B]}' }
      },
      note: 'Valid when the Schild slope is 1. With several antagonist concentrations, fit the Schild line and read pA₂ where log(DR − 1) = 0.',
      stories: { pA2: 'An antagonist at {B} mol/L shifts an agonist curve by a dose ratio of {DR}. What is its pA₂?', DR: 'An antagonist has pA₂ = {pA2}. What dose ratio does {B} mol/L produce?' }
    },
    {
      name: 'Non-competitive antagonist: the lower maximum',
      expr: 'EmaxB = Emax/(1 + B/KB)', tex: 'E_\\text{max,B} = \\frac{E_\\text{max}}{1 + \\mathrm{[B]}/K_B}',
      vars: {
        EmaxB: { name: 'maximum response with the antagonist', q: 'ratio', unit: '%', tex: 'E_\\text{max,B}' },
        Emax: { name: 'maximum response without it', q: 'ratio', unit: '%', value: 100, tex: 'E_\\text{max}' },
        B: { name: 'antagonist concentration', q: 'concentration', unit: 'nM', value: 10, tex: '\\mathrm{[B]}' },
        KB: { name: 'antagonist dissociation constant', q: 'concentration', unit: 'nM', value: 10, tex: 'K_B' }
      },
      note: 'A pure non-competitive antagonist in a tissue without spare receptors; the EC₅₀ is unchanged.',
      stories: { EmaxB: 'A non-competitive antagonist (KB = {KB}) is present at {B}. What fraction of the original {Emax} maximum remains?' }
    },
    {
      name: 'Negative allosteric modulator: a limited shift',
      expr: 'DR = (1 + B/KB)/(1 + alpha*B/KB)', tex: '\\text{DR} = \\frac{1 + \\mathrm{[B]}/K_B}{1 + \\alpha\\,\\mathrm{[B]}/K_B}',
      vars: {
        DR: { name: 'dose ratio', tex: '\\text{DR}' },
        B: { name: 'modulator concentration', q: 'concentration', unit: 'nM', value: 100, tex: '\\mathrm{[B]}' },
        KB: { name: 'modulator dissociation constant', q: 'concentration', unit: 'nM', value: 10, tex: 'K_B' },
        alpha: { name: 'cooperativity factor (0–1)', value: 0.05, min: 0, max: 1, tex: '\\alpha' }
      },
      note: 'As [B] grows, DR approaches 1/α — the ceiling that distinguishes allosteric from competitive antagonism.',
      stories: { DR: 'A negative allosteric modulator (KB = {KB}, cooperativity α = {alpha}) is present at {B}. By what factor does it shift the agonist curve?' }
    }
  ],
  examples: [
    {
      title: 'KB and pA₂ from a single shift',
      q: 'An agonist has an EC₅₀ of 10 nM. In the presence of 100 nM of a competitive antagonist the EC₅₀ becomes 210 nM, with the same maximum. Find KB and pA₂.',
      steps: [
        'Dose ratio: DR = 210/10 = 21.',
        '$K_B = \\mathrm{[B]}/(\\text{DR} - 1) = 100/20 = 5$ nM.',
        'pA₂ = $-\\log(5\\times10^{-9})$ = 8.30.'
      ],
      a: 'KB = 5 nM, pA₂ = 8.3.'
    },
    {
      title: 'A Schild plot',
      q: 'An antagonist at 10, 100 and 1000 nM gives dose ratios of 3.1, 22 and 205. Is it competitive, and what is its pA₂?',
      steps: [
        'log[B] (mol/L): −8, −7, −6. log(DR − 1): log 2.1 = 0.322, log 21 = 1.322, log 204 = 2.310.',
        'Least-squares slope: 0.994 — indistinguishable from 1, as simple competition predicts.',
        'The line crosses log(DR − 1) = 0 at log[B] = −8.33, so pA₂ = 8.33 and $K_B$ ≈ 4.7 nM.'
      ],
      a: 'Slope ≈ 1: competitive, with pA₂ ≈ 8.3 (KB ≈ 4.7 nM).'
    },
    {
      title: 'An allosteric ceiling',
      q: 'A negative allosteric modulator has $K_B$ = 10 nM and α = 0.05. What dose ratios do 100 nM, 1 µM and 10 µM give?',
      steps: [
        '100 nM ([B]/K_B = 10): DR = 11/1.5 = 7.3.',
        '1 µM (100): DR = 101/6 = 16.8. 10 µM (1000): DR = 1001/51 = 19.6.',
        'The shift creeps towards 1/α = 20 and stops: a Schild plot bends over instead of rising with slope 1.'
      ],
      a: '7.3, 16.8 and 19.6 — approaching the ceiling of 20.'
    }
  ],
  quiz: [
    { q: 'A reversible competitive antagonist changes an agonist\'s log dose–response curve by…', choices: ['lowering the maximum only', 'a parallel shift to the right, same maximum', 'making it steeper', 'a shift to the left'], a: 1, why: 'Enough agonist always outcompetes it, so the maximum is reached — at a concentration DR times higher.' },
    { q: 'An antagonist at 50 nM gives a dose ratio of 11. What is its pA₂?', answer: 8.3, why: 'KB = 50/(11 − 1) = 5 nM = 5×10⁻⁹ M, and pA₂ = −log KB = 8.3.' },
    { q: 'A partial agonist can reduce the response to a full agonist.', a: true, why: 'It occupies receptors the full agonist would have activated more strongly, pulling the response down towards its own ceiling.' },
    { q: 'A Schild plot gives a slope of 0.6 over a wide range. The most likely conclusion is…', choices: ['a simple competitive antagonist', 'something other than simple competition — for instance an allosteric mechanism or two receptors', 'the agonist is partial', 'the antagonist is irreversible'], a: 1, why: 'Simple competition at one receptor predicts a slope of 1; a lower slope means the model does not hold.' },
    { q: 'Adrenaline counters histamine\'s bronchoconstriction in anaphylaxis by acting on different receptors. This is…', choices: ['competitive antagonism', 'chemical antagonism', 'physiological (functional) antagonism', 'inverse agonism'], a: 2, why: 'The two drugs act on different receptors with opposite effects on the same tissue.' }
  ],
  problems: [
    { q: 'An antagonist has pA₂ = 9.0. What dose ratio will 30 nM of it produce on any agonist at that receptor?', answer: 31, tol: 0.02, steps: ['$K_B = 10^{-9}$ M = 1 nM.', 'DR = 1 + 30/1 = 31.'] },
    { q: 'A non-competitive antagonist with KB = 20 nM is present at 60 nM in a tissue without spare receptors. What percentage of the maximum response remains?', answer: 25, unit: '%', tol: 0.02, steps: ['$E_\\text{max,B}/E_\\text{max} = 1/(1 + 60/20) = 1/4$ = 25 %.'] }
  ],
  applications: ['Classifying receptor subtypes by the pA₂ values of selective antagonists.', 'Reversal agents: competitive antagonists that displace an agonist in an overdose or after anaesthesia.', 'Partial agonists designed to give a controlled, limited effect with a ceiling.'],
  history: 'John Gaddum derived the competitive antagonism equation in 1937; Heinz Schild introduced pA₂ in 1947, and with Arunlakshana published the Schild plot in 1959. E. J. Ariëns described intrinsic activity and partial agonists in 1954. James Black used this quantitative pharmacology to design the first β-blocker and H₂ antagonist, sharing the 1988 Nobel Prize in Physiology or Medicine.',
  sim: 'pd-schild'
},

{
  id: 'dose-response', parent: 'pd-topic', title: 'Dose–response and the Emax model', level: 2,
  short: 'Effect rises with concentration along a sigmoid on a log scale and levels off at a maximum. The Hill (sigmoid Emax) equation describes it with three numbers: Emax, EC50 and the Hill slope n, which sets how steeply the effect climbs.',
  keywords: ['dose–response', 'concentration–effect', 'Emax model', 'Hill equation', 'Hill coefficient', 'EC50', 'ED50', 'sigmoid', 'log-linear', 'graded response', 'quantal response', 'slope'],
  prereq: ['receptors', 'math:logarithmic-scales', 'medicine:dose-response'],
  related: ['potency-efficacy', 'therapeutic-index', 'pkpd', 'agonists-antagonists', 'tdm'],
  body: `
Give a little of a drug and little happens; give more and the effect grows; beyond a point, more drug adds almost nothing. Plotted against concentration the curve is a hyperbola crowded against the left edge; plotted against the **logarithm** of concentration it becomes a symmetric S — a sigmoid — which is how pharmacologists draw it (see [[math:logarithmic-scales|logarithmic scales]]).

### The Hill equation
The **sigmoid Emax model**, borrowed from A. V. Hill's 1910 analysis of oxygen binding to haemoglobin, describes most graded concentration–effect relations:

$$E = \\frac{E_\\text{max}\\, C^{n}}{\\text{EC}_{50}^{\\,n} + C^{n}}$$

Three numbers carry it. $E_\\text{max}$ is the ceiling — the drug's **efficacy** in that system. $\\text{EC}_{50}$ is the concentration giving half of it — the **potency** (see [[potency-efficacy]]). The **Hill coefficient** $n$ sets the steepness. A baseline $E_0$ can be added for effects measured from a resting value, and drugs that inhibit use the same form as $I_\\text{max}$ and IC$_{50}$.

With $n = 1$ this is the occupancy equation of [[receptors]] with EC$_{50}$ in place of $K_d$ — but the two are rarely equal, because signal amplification makes the response run ahead of occupancy. For whole-body effects $n$ is best read as a shape parameter, not a count of binding sites.

### How steep is steep?
The concentration range from 10 % to 90 % of the maximum is $C_{90}/C_{10} = 81^{1/n}$:

| Hill slope $n$ | $C_{90}/C_{10}$ | What it means |
|---|---|---|
| 0.5 | 6561 | an effect spread over almost four decades |
| 1 | 81 | the "textbook" curve |
| 2 | 9 | a steep effect |
| 4 | 3 | nearly all-or-none |

Steep curves — some neuromuscular blockers and anaesthetic agents — switch from almost no effect to almost full effect within a threefold range, which makes them precise but unforgiving.

### Three regions of the curve
- **Low concentrations** ($C \\ll$ EC$_{50}$): the effect is roughly proportional to concentration, $E \\approx E_\\text{max}(C/\\text{EC}_{50})^n$.
- **The middle, 20–80 %**: the effect is nearly a straight line in $\\log C$, with a slope at EC$_{50}$ of $n\\,E_\\text{max}\\ln 10/4$ — about 58 % of the maximum per tenfold rise when $n = 1$.
- **Near the top**: diminishing returns. With $n = 1$, doubling from $4\\,\\text{EC}_{50}$ (80 %) to $8\\,\\text{EC}_{50}$ gains only nine points (89 %) — while a toxic effect with a higher EC$_{50}$ may still be on its steep part (see [[therapeutic-index]]).

> [!key] On a log scale the Hill curve is symmetric about EC$_{50}$. Emax is efficacy, EC$_{50}$ is potency, $n$ is steepness. Once a drug works near the top of its curve, more drug buys little extra effect but more risk.

### Graded and quantal
A **graded** response is measured in one person or tissue — a fall in blood pressure, a heart rate. A **quantal** response is all-or-none — asleep or not, seizure or not — and its "dose–response curve" is the cumulative share of a population responding, set by how sensitivity varies between people. The ED$_{50}$ of a quantal curve is the dose that works in half the population; it is the basis of the therapeutic index.

### Dose is not concentration
The same dose gives different concentrations in different people (pharmacokinetics), and the concentration at the receptor may lag behind the plasma (see [[pkpd]]). That is why careful dose–response work plots effect against measured concentration, and why some drugs are dosed by measured level (see [[tdm]]).
`,
  ideas: [
    'On a log concentration axis the effect curve is a symmetric sigmoid.',
    'Hill equation: E = Emax Cⁿ/(EC50ⁿ + Cⁿ) — Emax is efficacy, EC50 potency, n steepness.',
    'The 10–90 % range spans a factor of 81^(1/n): 81-fold for n = 1, 9-fold for n = 2.',
    'Between 20 and 80 % the effect is nearly linear in log C; near the top, extra drug adds little.',
    'Graded curves describe one system; quantal curves describe how sensitivity varies across a population.'
  ],
  pitfalls: [
    'A steeper curve means a more potent drug — Potency is the position (EC₅₀); steepness is the Hill slope. Two drugs can share an EC₅₀ and differ greatly in steepness.',
    'The Hill coefficient counts the binding sites — For haemoglobin it reflects cooperativity, but for a whole-body drug effect it is an empirical shape parameter shaped by amplification, thresholds and variability.',
    'Doubling the dose doubles the effect — Only at low concentrations; in the middle of the curve doubling adds a fixed step (about 17 % of Emax for n = 1), and near the top almost nothing.'
  ],
  formulas: [
    {
      name: 'Hill (sigmoid Emax) equation',
      expr: 'E = Emax*C^n/(EC50^n + C^n)', tex: 'E = \\frac{E_\\text{max}\\, C^{n}}{\\text{EC}_{50}^{\\,n} + C^{n}}',
      vars: {
        E: { name: 'effect', q: 'ratio', unit: '%' },
        Emax: { name: 'maximal effect', q: 'ratio', unit: '%', value: 100, tex: 'E_\\text{max}' },
        C: { name: 'concentration at the site of action', q: 'massconc', unit: 'mg/L', value: 4 },
        EC50: { name: 'concentration for half the maximal effect', q: 'massconc', unit: 'mg/L', value: 2, tex: '\\text{EC}_{50}' },
        n: { name: 'Hill coefficient (slope)', value: 1.5 }
      },
      note: 'Add a baseline E₀ for effects measured from a resting value. For inhibition the same form is written with Imax and IC₅₀.',
      practice: { unknowns: ['E', 'C', 'EC50'] },
      stories: {
        E: 'A hypothetical drug has Emax = {Emax}, EC₅₀ = {EC50} and a Hill slope of {n}. What effect does a concentration of {C} give?',
        C: 'What concentration of a drug with EC₅₀ = {EC50} and Hill slope {n} gives an effect of {E} (Emax = {Emax})?',
        EC50: 'A concentration of {C} gives {E} of a {Emax} maximum, with a Hill slope of {n}. What is the EC₅₀?'
      }
    },
    {
      name: 'Concentration for a chosen fraction of Emax',
      expr: 'C = EC50*(f/(1 - f))^(1/n)', tex: 'C = \\text{EC}_{50}\\left(\\frac{f}{1 - f}\\right)^{1/n}',
      vars: {
        C: { name: 'concentration needed', q: 'massconc', unit: 'mg/L' },
        EC50: { name: 'EC₅₀', q: 'massconc', unit: 'mg/L', value: 2, tex: '\\text{EC}_{50}' },
        f: { name: 'fraction of the maximal effect', q: 'ratio', unit: '%', value: 90, min: 0, max: 100 },
        n: { name: 'Hill coefficient', value: 1 }
      },
      stories: { C: 'A drug has EC₅₀ = {EC50} and Hill slope {n}. What concentration gives {f} of its maximal effect?' }
    },
    {
      name: 'Spread from 10 % to 90 % of the maximum',
      expr: 'C90 = C10*81^(1/n)', tex: 'C_{90} = C_{10}\\cdot 81^{1/n}',
      vars: {
        C90: { name: 'concentration for 90 % of Emax', q: 'massconc', unit: 'mg/L', tex: 'C_{90}' },
        C10: { name: 'concentration for 10 % of Emax', q: 'massconc', unit: 'mg/L', value: 0.5, tex: 'C_{10}' },
        n: { name: 'Hill coefficient', value: 1 }
      },
      note: 'The ratio C90/C10 = 81^(1/n) does not depend on EC₅₀: it measures steepness alone.',
      stories: { n: 'An effect rises from 10 % of its maximum at {C10} to 90 % at {C90}. What is the Hill slope?', C90: 'An effect reaches 10 % of its maximum at {C10}; its Hill slope is {n}. At what concentration does it reach 90 %?' }
    },
    {
      name: 'Slope at the EC₅₀',
      expr: 'S = n*Emax*ln(10)/4', tex: 'S = \\frac{n\\,E_\\text{max}\\ln 10}{4}',
      vars: {
        S: { name: 'rise in effect per tenfold rise in concentration, at EC₅₀', q: 'ratio', unit: '%' },
        n: { name: 'Hill coefficient', value: 1 },
        Emax: { name: 'maximal effect', q: 'ratio', unit: '%', value: 100, tex: 'E_\\text{max}' }
      },
      note: 'The steepest point of the curve on a log axis; the 20–80 % region is close to this straight line.',
      stories: { S: 'A drug has Emax = {Emax} and a Hill slope of {n}. How much does the effect rise per tenfold increase in concentration around its EC₅₀?' }
    }
  ],
  examples: [
    {
      title: 'Reading the curve',
      q: 'A hypothetical drug has Emax = 100 %, EC₅₀ = 2 mg/L and n = 1.5. What effect does 4 mg/L give, and what concentration gives 90 %?',
      steps: [
        '$E = 100 \\times 4^{1.5}/(2^{1.5} + 4^{1.5}) = 100 \\times 8/(2.83 + 8) = 73.9$ %.',
        '90 %: $C = 2 \\times (0.9/0.1)^{1/1.5} = 2 \\times 9^{0.667} = 2 \\times 4.33 = 8.7$ mg/L.'
      ],
      a: '74 % at 4 mg/L; 90 % needs about 8.7 mg/L.'
    },
    {
      title: 'Diminishing returns',
      q: 'A drug is working at 80 % of its maximum. What does doubling the concentration give if n = 1, and if n = 2?',
      steps: [
        'n = 1: 80 % is at $C = 4\\,\\text{EC}_{50}$; doubling gives $8/(1 + 8)$ = 88.9 % — nine more points.',
        'n = 2: 80 % is at $C = 2\\,\\text{EC}_{50}$; doubling gives $4^2/(1 + 4^2) = 16/17$ = 94.1 %.',
        'Either way the gain is small, while any effect whose curve lies further right keeps climbing steeply.'
      ],
      a: 'About 89 % (n = 1) or 94 % (n = 2).'
    },
    {
      title: 'EC₅₀ and n from two points',
      q: 'An effect is 20 % of its maximum at 1 mg/L and 80 % at 4 mg/L. Estimate the Hill slope and EC₅₀.',
      steps: [
        'For a Hill curve, $C_{80}/C_{20} = [(0.8/0.2)/(0.2/0.8)]^{1/n} = 16^{1/n}$.',
        '$16^{1/n} = 4$ gives $n = 2$.',
        'The curve is symmetric on a log scale, so EC₅₀ is the geometric mean: $\\sqrt{1 \\times 4}$ = 2 mg/L.'
      ],
      a: 'n = 2 and EC₅₀ = 2 mg/L.'
    }
  ],
  quiz: [
    { q: 'At C = EC₅₀ the effect is…', choices: ['Emax', 'half of Emax, whatever n is', 'half of Emax only when n = 1', '63 % of Emax'], a: 1, why: 'C = EC₅₀ makes the fraction EC₅₀ⁿ/(2EC₅₀ⁿ) = 1/2 for any n.' },
    { q: 'For a Hill slope of 2, by what factor must the concentration rise to go from 10 % to 90 % of the maximum?', answer: 9, why: '81^(1/2) = 9.' },
    { q: 'A larger Hill coefficient means a more potent drug.', a: false, why: 'Potency is the EC₅₀; n only changes how steeply the effect climbs around it.' },
    { q: 'Why are dose–response curves usually drawn against log concentration?', choices: ['to make the maximum larger', 'the curve becomes a symmetric sigmoid, spans many decades, and competitive antagonists shift it in parallel', 'because effects are logarithmic by nature', 'to hide the steep part'], a: 1, why: 'A log axis spreads the curve evenly and turns multiplicative shifts (dose ratios) into parallel displacements.' },
    { q: 'Near the top of its curve, doubling the dose of a drug typically…', choices: ['doubles the effect', 'adds little effect but can increase toxicity', 'halves the effect', 'has no effect on toxicity'], a: 1, why: 'The main effect is saturated, but toxic effects with higher EC₅₀ values may still be rising steeply.' }
  ],
  problems: [
    { q: 'A drug has EC₅₀ = 5 mg/L and n = 1. What concentration gives 75 % of its maximal effect?', answer: 15, unit: 'mg/L', tol: 0.02, steps: ['$C = 5 \\times 0.75/0.25 = 15$ mg/L.'] },
    { q: 'An effect reaches 10 % of its maximum at 0.2 mg/L and 90 % at 1.8 mg/L. What is the Hill slope?', answer: 2, tol: 0.02, steps: ['$C_{90}/C_{10} = 9 = 81^{1/n}$.', '$1/n = \\ln 9/\\ln 81 = 0.5$, so $n = 2$.'] }
  ],
  applications: [
    'Shift a dose–response curve with competitive and non-competitive antagonists in [the dose–response tool](#/tools/pk/pd).','Choosing doses in early clinical trials: the aim is usually the steep middle of the curve, not the top.', 'Comparing drugs and batches by relative potency in biological assays.', 'Concentration–effect models that let target levels be set for drugs with therapeutic drug monitoring.'],
  history: 'Archibald Vivian Hill published his equation in 1910 to describe oxygen binding to haemoglobin. A. J. Clark applied occupancy ideas to concentration–effect curves in the 1920s–1930s, and J. W. Trevan introduced the median lethal dose (LD₅₀) and quantal dose–response curves in 1927. Lewis Sheiner and colleagues made the sigmoid Emax model the workhorse of clinical PK/PD from the late 1970s.',
  sim: { id: 'pd-schild', params: { ant: 'none' } }
},

{
  id: 'potency-efficacy', parent: 'pd-topic', title: 'Potency and efficacy', level: 2,
  short: 'Potency is how much drug is needed (the EC50); efficacy is how big an effect it can produce at most (Emax). The operational model shows how both come from affinity, receptor number and signal amplification — and why spare receptors let 5 % occupancy give half the maximal response.',
  keywords: ['potency', 'efficacy', 'intrinsic activity', 'EC50', 'Emax', 'operational model', 'transducer ratio', 'tau', 'receptor reserve', 'spare receptors', 'Furchgott', 'partial agonist', 'relative potency', 'tissue selectivity'],
  prereq: ['dose-response', 'receptors', 'agonists-antagonists'],
  related: ['tolerance', 'therapeutic-index', 'biology:cell-signalling', 'medicine:how-drugs-work'],
  body: `
Two words are used loosely in everyday speech and precisely in pharmacology. **Potency** is about *how much* drug it takes: a drug with an EC$_{50}$ of 1 nM is a thousand times more potent than one with 1 µM. **Efficacy** is about *how much effect* the drug can produce once enough is given: its $E_\\text{max}$. A highly potent drug is not necessarily a better one — potency mostly decides the size of the tablet, while efficacy decides whether the drug can do the job at all.

| Drug (hypothetical) | EC$_{50}$ | $E_\\text{max}$ | In words |
|---|---|---|---|
| A | 5 nM | 60 % | potent, but a partial agonist |
| B | 200 nM | 100 % | less potent, fully efficacious |

A is 40 times more potent; B is the more efficacious — at a high enough dose it does what A never can.

### Occupancy is not response
A. J. Clark assumed the response was proportional to occupancy. In 1956 R. P. Stephenson showed it could not be: some agonists give a maximal response while occupying only a small fraction of the receptors. The surplus is called the **receptor reserve** (or spare receptors). The signal is amplified — one activated receptor can activate many G-proteins, each making many second-messenger molecules — so the cell's machinery saturates long before the receptors do.

### The operational model
James Black and Paul Leff (1983) captured this with one extra number, the **transducer ratio** τ: the receptor density divided by the amount of activated receptor needed for half the maximal response. τ bundles the drug's intrinsic efficacy with the tissue's receptor number and coupling. For a Hill slope of 1,

$$E = \\frac{E_m\\,\\tau\\,\\mathrm{[A]}}{K_A + (1 + \\tau)\\mathrm{[A]}} \\quad\\Rightarrow\\quad \\text{EC}_{50} = \\frac{K_A}{1 + \\tau}, \\qquad E_\\text{max} = \\frac{E_m\\,\\tau}{1 + \\tau}$$

where $K_A$ is the agonist's dissociation constant and $E_m$ the most the system can do. Everything follows from these lines:
- **Large τ (say 20–100)**: $E_\\text{max}$ is essentially $E_m$ — a full agonist — and EC$_{50}$ lies far below $K_A$. With τ = 19, half the maximum needs only $1/(2 + \\tau)$ = 5 % occupancy.
- **τ near 1 or below**: a partial agonist. τ = 1 gives 50 % of $E_m$ and EC$_{50}$ = $K_A/2$.
- **The same drug in two tissues**: τ depends on receptor density, so a drug can be a full agonist where receptors are plentiful and a weak partial agonist — even an antagonist of the natural transmitter — where they are sparse. This *tissue selectivity* is used deliberately, and it also explains why tolerance shows up first as lost potency, then lost efficacy (see [[tolerance]]).

> [!key] Potency (EC$_{50}$) comes from affinity **and** efficacy; efficacy ($E_\\text{max}$) depends on the drug **and** the tissue. Occupancy needed for half the maximal response is $1/(2 + \\tau)$ — small when τ is large.

### Measuring the reserve: Furchgott's method
Robert Furchgott (1966) used an irreversible antagonist to knock out a fraction of the receptors and watched the curve. With a big reserve it first moves right with its maximum intact — the spare receptors make up the loss — and only when the reserve is exhausted does the maximum fall. Comparing equal responses before and after gives $K_A$ itself; in the operational model the loss simply multiplies τ by the fraction $q$ of receptors left.

### Why it matters for medicines
- Comparing drugs by milligram dose says nothing about which works better; relative potency matters only for dose size, formulation and sometimes for side effects that depend on dose.
- Partial agonists offer a ceiling: useful effect with limited maximum, and a buffer against over-stimulation.
- An agonist's efficacy in a test tissue with high receptor expression can overstate its effect in the target human tissue.
`,
  ideas: [
    'Potency is position (EC50); efficacy is height (Emax). They are independent.',
    'Receptor reserve: amplification lets a fraction of receptors give the maximal response.',
    'Operational model: EC50 = KA/(1 + τ) and Emax = Em τ/(1 + τ); half-maximum needs occupancy 1/(2 + τ).',
    'τ depends on receptor density, so the same drug can be full in one tissue and partial in another.',
    'An irreversible antagonist first shifts the curve right, then lowers its maximum once the reserve is used up.'
  ],
  pitfalls: [
    'The more potent drug is the better drug — A lower dose in milligrams is not a clinical advantage in itself; what matters is the effect achievable (efficacy) and the margin to harm.',
    'EC₅₀ equals the dissociation constant — Only without amplification. With a receptor reserve EC₅₀ = KA/(1 + τ), far below KA; a full agonist can give half its maximum with 5 % of receptors occupied.',
    'Efficacy is a fixed property of the drug — Observed efficacy depends on the tissue\'s receptor number and coupling as well; a partial agonist can look full in a tissue rich in receptors.'
  ],
  formulas: [
    {
      name: 'Operational model: EC₅₀',
      expr: 'EC50 = KA/(1 + tau)', tex: '\\text{EC}_{50} = \\frac{K_A}{1 + \\tau}',
      vars: {
        EC50: { name: 'concentration for half the maximal response', q: 'concentration', unit: 'nM', tex: '\\text{EC}_{50}' },
        KA: { name: 'agonist dissociation constant', q: 'concentration', unit: 'nM', value: 1000, tex: 'K_A' },
        tau: { name: 'transducer ratio (efficacy × receptor density)', value: 19, tex: '\\tau' }
      },
      note: 'Black–Leff operational model with a transducer slope of 1.',
      practice: { unknowns: ['EC50', 'tau', 'KA'] },
      stories: { EC50: 'An agonist binds with KA = {KA} and has a transducer ratio of {tau} in a tissue. What is its EC₅₀ there?', tau: 'An agonist with KA = {KA} has an EC₅₀ of {EC50} in a tissue. What is its transducer ratio?' }
    },
    {
      name: 'Operational model: maximal effect',
      expr: 'Emax = Em*tau/(1 + tau)', tex: 'E_\\text{max} = \\frac{E_m\\,\\tau}{1 + \\tau}',
      vars: {
        Emax: { name: 'maximal effect of the agonist', q: 'ratio', unit: '%', tex: 'E_\\text{max}' },
        Em: { name: 'maximal response of the system', q: 'ratio', unit: '%', value: 100, tex: 'E_m' },
        tau: { name: 'transducer ratio', value: 1, tex: '\\tau' }
      },
      stories: { Emax: 'In a tissue, an agonist has a transducer ratio of {tau}. What fraction of the system maximum {Em} can it reach?', tau: 'A partial agonist reaches {Emax} of the system maximum. What is its transducer ratio?' }
    },
    {
      name: 'Occupancy needed for half the maximal response',
      expr: 'p50 = 1/(2 + tau)', tex: 'p_{50} = \\frac{1}{2 + \\tau}',
      vars: {
        p50: { name: 'fractional occupancy at the EC₅₀', q: 'ratio', unit: '%', tex: 'p_{50}' },
        tau: { name: 'transducer ratio', value: 19, tex: '\\tau' }
      },
      note: 'Follows from EC₅₀/(EC₅₀ + KA) with EC₅₀ = KA/(1 + τ). The rest of the receptors are "spare" for this response.',
      stories: { p50: 'An agonist has a transducer ratio of {tau} in a tissue. What fraction of its receptors must it occupy to give half the maximal response?', tau: 'Half the maximal response needs only {p50} occupancy. What is the transducer ratio?' }
    }
  ],
  examples: [
    {
      title: 'Spare receptors in numbers',
      q: 'An agonist has $K_A$ = 1 µM and τ = 19 in a tissue. Find its EC₅₀, its maximal effect and the occupancy at the EC₅₀.',
      steps: [
        'EC₅₀ = 1000 nM/(1 + 19) = 50 nM — twenty times below $K_A$.',
        '$E_\\text{max}$ = 19/20 = 95 % of the system maximum: a full agonist.',
        'Occupancy at the EC₅₀: 50/(50 + 1000) = 1/21 = 4.8 %. Some 95 % of the receptors are spare for this response.'
      ],
      a: 'EC₅₀ = 50 nM, Emax = 95 %, and only 4.8 % occupancy for half the response.'
    },
    {
      title: 'Using up the reserve',
      q: 'The same kind of agonist ($K_A$ = 1 µM, τ = 30) is tested after an irreversible antagonist has destroyed 90 % and then 97 % of the receptors. What happens to its EC₅₀ and maximum?',
      steps: [
        'Untreated: EC₅₀ = 1000/31 = 32 nM, $E_\\text{max}$ = 30/31 = 97 %.',
        '10 % of receptors left: τ = 3, EC₅₀ = 1000/4 = 250 nM, $E_\\text{max}$ = 75 % — mostly a shift right.',
        '3 % left: τ = 0.9, EC₅₀ = 1000/1.9 = 526 nM, $E_\\text{max}$ = 47 % — now the maximum collapses.'
      ],
      a: 'First an eightfold shift with a modest fall in maximum, then a halving of the maximum — Furchgott\'s signature of a receptor reserve.'
    },
    {
      title: 'One drug, two tissues',
      q: 'A hypothetical agonist ($K_A$ = 1 µM) has τ = 12 in the airways and τ = 0.8 in the heart, which carries far fewer of its receptors. Compare its effects.',
      steps: [
        'Airways: EC₅₀ = 1000/13 = 77 nM; $E_\\text{max}$ = 12/13 = 92 %.',
        'Heart: EC₅₀ = 1000/1.8 = 556 nM; $E_\\text{max}$ = 0.8/1.8 = 44 %.',
        'At 100 nM it is well into its effect on the airways while barely acting on the heart — selectivity from tissue, not from binding.'
      ],
      a: 'Nearly full agonist in the airways, a weak partial agonist in the heart.'
    }
  ],
  quiz: [
    { q: 'Drug A has EC₅₀ = 1 nM and Emax = 50 %; drug B has EC₅₀ = 100 nM and Emax = 100 %. Which statement is right?', choices: ['A is more potent and more efficacious', 'A is more potent, B more efficacious', 'B is more potent, A more efficacious', 'they cannot be compared'], a: 1, why: 'Lower EC₅₀ means higher potency (A); higher Emax means higher efficacy (B).' },
    { q: 'With τ = 9, what fraction of receptors (in %) must be occupied to give half the maximal response?', answer: 9.1, unit: '%', why: 'p₅₀ = 1/(2 + 9) = 0.091.' },
    { q: 'The drug with the smaller dose in milligrams is always the more effective treatment.', a: false, why: 'Dose size reflects potency; how much effect is achievable (efficacy) and how safe it is are different questions.' },
    { q: 'In a tissue with a large receptor reserve, a low concentration of an irreversible antagonist first…', choices: ['lowers the agonist\'s maximum', 'shifts the agonist curve to the right with its maximum intact', 'makes the curve steeper', 'has no effect at all'], a: 1, why: 'Spare receptors compensate, so more agonist is needed but the maximum is still reached — until the reserve runs out.' },
    { q: 'An agonist with $K_A$ = 600 nM has τ = 5. What is its EC₅₀ (nM)?', answer: 100, unit: 'nM', why: 'EC₅₀ = 600/(1 + 5) = 100 nM.' }
  ],
  problems: [
    { q: 'A partial agonist reaches 40 % of the system maximum in a tissue. What is its transducer ratio τ?', answer: 0.667, tol: 0.02, steps: ['$\\tau/(1 + \\tau) = 0.4$.', '$\\tau = 0.4/0.6 = 0.667$.'] },
    { q: 'An agonist has KA = 2 µM and EC₅₀ = 40 nM in a tissue. What percentage of receptors is occupied at its EC₅₀?', answer: 1.96, unit: '%', tol: 0.02, steps: ['τ = 2000/40 − 1 = 49.', 'Occupancy at EC₅₀ = 1/(2 + 49) = 1.96 %.'] }
  ],
  applications: ['Ranking agonists by efficacy independent of tissue with the operational model in drug discovery.', 'Designing partial agonists with a ceiling on their effect.', 'Explaining tissue selectivity when a drug binds equally to receptors in several organs.'],
  history: 'R. P. Stephenson separated affinity from efficacy in 1956, building on E. J. Ariëns\'s intrinsic activity (1954). Robert Furchgott devised the irreversible-antagonist method in 1966 (and later shared the 1998 Nobel Prize for nitric oxide). James Black and Paul Leff published the operational model in 1983, now the standard way to quantify agonist efficacy.',
  sim: { id: 'pd-reserve', params: { furch: true } }
},

{
  id: 'therapeutic-index', parent: 'pd-topic', title: 'Therapeutic index and window', level: 2,
  short: 'The therapeutic index compares the dose that harms with the dose that helps (TD50/ED50). The therapeutic window is the range of concentrations that is effective without being toxic; drugs with a narrow one need careful dosing, and sometimes measured levels.',
  keywords: ['therapeutic index', 'therapeutic window', 'therapeutic range', 'TD50', 'ED50', 'LD50', 'margin of safety', 'certain safety factor', 'narrow therapeutic index', 'quantal dose–response', 'MEC', 'MTC', 'toxicity'],
  prereq: ['dose-response', 'multiple-dosing', 'math:normal-distribution'],
  related: ['tdm', 'adverse-reactions', 'pkpd', 'bioequivalence', 'medicine:dose-response', 'medicine:poisoning-overdose'],
  body: `
"The dose makes the poison" is the oldest idea in pharmacology, credited to Paracelsus in the sixteenth century. Every medicine has a dose that helps most people and a higher dose that harms some. How far apart the two lie decides how forgiving the medicine is.

### The therapeutic index
From **quantal** dose–response curves — the share of a population that responds at each dose — come the ED$_{50}$ (effective in half) and the TD$_{50}$ (toxic in half; in animal studies the LD$_{50}$, lethal in half). Their ratio is the **therapeutic index**:

$$\\text{TI} = \\frac{\\text{TD}_{50}}{\\text{ED}_{50}}$$

A TI of 100 sounds comfortable and 2 alarming — but the medians hide the tails. People differ in sensitivity, and the spread is roughly log-normal: the share responding at dose $D$ is $P = \\Phi\\big(\\log(D/\\text{ED}_{50})/\\sigma\\big)$, with σ the standard deviation of log sensitivity (see [[math:normal-distribution|the normal distribution]]). A safer yardstick compares the tails: the **certain safety factor** TD$_1$/ED$_{99}$, the dose harming 1 % against the dose helping 99 %. With equal spreads it is $\\text{TI}\\cdot 10^{-4.65\\sigma}$.

| TI | σ (log units) | TD$_1$/ED$_{99}$ | At the ED$_{99}$ |
|---|---|---|---|
| 10 | 0.1 | 3.4 | essentially nobody harmed |
| 10 | 0.2 | 1.2 | about 1 % harmed |
| 10 | 0.3 | 0.40 | 16 % harmed |

The same TI of 10 is safe for a drug whose effects vary little between people and hazardous for one that varies widely.

### The therapeutic window
In the clinic the useful version is a range of **concentrations**: above a minimum effective concentration (MEC) most people benefit; above a minimum toxic concentration (MTC) toxicity becomes common. Between them lies the **therapeutic window** (or target range). Its width, MTC/MEC, is the concentration-side cousin of the TI.

A dosing regimen has to keep the level inside it. With repeated doses the level swings between peak and trough by a factor $e^{k\\tau} = 2^{\\tau/t_{1/2}}$, so the longest interval that fits a window is

$$\\tau_\\text{max} = t_{1/2}\\,\\log_2\\frac{\\text{MTC}}{\\text{MEC}}$$

A window of 4 (two doublings) and a half-life of 6 h allow dosing every 12 h at most; a window of 2 allows only one half-life. Narrow windows are why some drugs are given as infusions or modified-release forms, which flatten the swings (see [[multiple-dosing]] and [[modified-release]]).

### Narrow-therapeutic-index drugs
Some medicines work close to their toxic levels: digoxin, lithium, warfarin, phenytoin, aminoglycoside antibiotics, and the immunosuppressants ciclosporin and tacrolimus are standard examples. For them small changes in dose, formulation, kidney function or an interacting drug matter. They are often monitored by blood level (see [[tdm]]); regulators demand tighter bioequivalence limits for their generics — in the EU a 90 % confidence interval within 90.00–111.11 % for AUC, rather than 80–125 % (see [[bioequivalence]]); and switching between products is done with care.

> [!warn] Toxicity from an overdose — even of an everyday medicine such as paracetamol (acetaminophen) — can be serious with few early symptoms. If someone may have taken too much of any medicine, call your local emergency number or a poison information centre at once; do not wait for symptoms.

### Beyond one number
A TI assumes that the good and the harmful effects are the same kind of thing measured the same way. Real safety depends on *which* toxicity — reversible nausea or irreversible liver failure — on who is exposed (children, older people, pregnancy, kidney impairment), and on risk against benefit: a TI that would be unacceptable for a headache remedy can be accepted for a cancer medicine.
`,
  ideas: [
    'TI = TD50/ED50 compares medians of the toxic and effective quantal curves.',
    'The tails matter: the certain safety factor TD1/ED99 falls steeply as person-to-person variability grows.',
    'The therapeutic window is the concentration range between MEC and MTC.',
    'The longest dosing interval that fits a window is t½ · log₂(MTC/MEC).',
    'Narrow-TI drugs need careful dosing, attention to interactions and often blood-level monitoring.'
  ],
  pitfalls: [
    'A therapeutic index of 10 means a tenfold overdose is needed before anyone is harmed — The TI compares medians; with wide variability some people are harmed at doses that do not yet help others.',
    'A drug with a narrow therapeutic index is a bad drug — Narrow-TI drugs such as lithium or digoxin are valuable; they simply need careful dosing and often measured levels.',
    'Staying below the toxic level only needs a lower dose — The level swings with each dose; a regimen must fit both the peak under the MTC and the trough above the MEC, which constrains the dosing interval as well as the dose.'
  ],
  formulas: [
    {
      name: 'Therapeutic index',
      expr: 'TI = TD50/ED50', tex: '\\text{TI} = \\frac{\\text{TD}_{50}}{\\text{ED}_{50}}',
      vars: {
        TI: { name: 'therapeutic index', tex: '\\text{TI}' },
        TD50: { name: 'dose toxic in half the population', q: 'doseperkg', unit: 'mg/kg', value: 100, tex: '\\text{TD}_{50}' },
        ED50: { name: 'dose effective in half the population', q: 'doseperkg', unit: 'mg/kg', value: 10, tex: '\\text{ED}_{50}' }
      },
      stories: { TI: 'A hypothetical drug is effective in half of patients at {ED50} and toxic in half at {TD50}. What is its therapeutic index?' }
    },
    {
      name: 'Certain safety factor (equal log-normal spreads)',
      expr: 'CSF = TI*10^(-2*2.326*s)', tex: '\\text{CSF} = \\text{TI}\\cdot 10^{-2\\times 2.326\\,\\sigma}',
      vars: {
        CSF: { name: 'certain safety factor TD₁/ED₉₉', tex: '\\text{CSF}' },
        TI: { name: 'therapeutic index', value: 10, tex: '\\text{TI}' },
        s: { name: 'SD of log₁₀ sensitivity', value: 0.2, tex: '\\sigma' }
      },
      note: '2.326 is the z-value of the 99th percentile. Assumes both quantal curves are log-normal with the same spread; below 1, some people are harmed before 99 % are helped.',
      stories: { CSF: 'A drug has a therapeutic index of {TI}; sensitivities vary with a log-SD of {s}. What is its certain safety factor?', s: 'How large can the log-SD of sensitivity be for a drug with TI = {TI} to keep a certain safety factor of {CSF}?' }
    },
    {
      name: 'Share of a population responding (log-normal)',
      expr: 'P = ncdf(log(D/ED50)/s)', tex: 'P = \\Phi\\!\\left(\\frac{\\log(D/\\text{ED}_{50})}{\\sigma}\\right)',
      vars: {
        P: { name: 'fraction responding', q: 'ratio', unit: '%' },
        D: { name: 'dose', q: 'doseperkg', unit: 'mg/kg', value: 20 },
        ED50: { name: 'median effective dose', q: 'doseperkg', unit: 'mg/kg', value: 10, tex: '\\text{ED}_{50}' },
        s: { name: 'SD of log₁₀ sensitivity', value: 0.2, tex: '\\sigma' }
      },
      note: 'Φ is the standard normal distribution function (ncdf in the calculator). Use TD₅₀ in place of ED₅₀ for the share harmed.',
      practice: { unknowns: ['P', 'D'] },
      stories: { P: 'A drug has ED₅₀ = {ED50} with a log-SD of {s}. What share of patients responds at {D}?', D: 'What dose makes {P} of patients respond, if ED₅₀ = {ED50} and the log-SD is {s}?' }
    },
    {
      name: 'Longest dosing interval inside a window',
      expr: 'tau = th*log2(MTC/MEC)', tex: '\\tau_\\text{max} = t_{1/2}\\log_2\\frac{\\text{MTC}}{\\text{MEC}}',
      vars: {
        tau: { name: 'longest dosing interval', q: 'time', unit: 'h', tex: '\\tau_\\text{max}' },
        th: { name: 'elimination half-life', q: 'time', unit: 'h', value: 6, tex: 't_{1/2}' },
        MTC: { name: 'minimum toxic concentration', q: 'massconc', unit: 'mg/L', value: 20, tex: '\\text{MTC}' },
        MEC: { name: 'minimum effective concentration', q: 'massconc', unit: 'mg/L', value: 5, tex: '\\text{MEC}' }
      },
      note: 'Repeated IV bolus doses at steady state, peak just under the MTC and trough just above the MEC. Absorption from oral forms makes the swing a little smaller.',
      stories: { tau: 'A hypothetical drug has a half-life of {th} and a window from {MEC} to {MTC}. What is the longest dosing interval that keeps it inside?', th: 'A window from {MEC} to {MTC} must be kept with a dosing interval of {tau}. What half-life does that need?' }
    }
  ],
  examples: [
    {
      title: 'Same TI, different safety',
      q: 'A hypothetical drug has ED₅₀ = 10 mg/kg and TD₅₀ = 100 mg/kg. Compare the certain safety factor when the log-SD of sensitivity is 0.1 and when it is 0.3.',
      steps: [
        'TI = 100/10 = 10 in both cases.',
        'σ = 0.1: ED₉₉ = 10 × 10^(2.326×0.1) = 17 mg/kg; TD₁ = 100 × 10^(−0.233) = 59 mg/kg; CSF = 3.4.',
        'σ = 0.3: ED₉₉ = 10 × 10^0.698 = 50 mg/kg; TD₁ = 100 × 10^(−0.698) = 20 mg/kg; CSF = 0.40.',
        'In the second case a dose of 50 mg/kg helps 99 % of patients — and harms $\\Phi(\\log(0.5)/0.3) = \\Phi(-1.00)$ = 16 %.'
      ],
      a: 'CSF 3.4 against 0.40: the wider spread makes the same TI far less safe.'
    },
    {
      title: 'Fitting a regimen into a window',
      q: 'A hypothetical drug has a half-life of 8 h and a therapeutic range of 10–20 mg/L. Could it be given every 12 hours as ordinary IV doses?',
      steps: [
        'Window width MTC/MEC = 2, one doubling.',
        '$\\tau_\\text{max} = 8 \\times \\log_2 2 = 8$ h.',
        'A 12-hour interval would swing the level by $2^{12/8} = 2.8$-fold, more than the window allows: the peak would exceed 20 mg/L or the trough fall below 10.'
      ],
      a: 'No — at most every 8 h, or a continuous infusion or modified-release form.'
    }
  ],
  quiz: [
    { q: 'A drug has ED₅₀ = 4 mg/kg and TD₅₀ = 60 mg/kg. What is its therapeutic index?', answer: 15, why: 'TI = 60/4 = 15.' },
    { q: 'Two drugs both have TI = 20. Which is safer?', choices: ['they are equally safe', 'the one whose sensitivity varies less between people', 'the one with the steeper toxicity curve only', 'the one with the larger ED₅₀'], a: 1, why: 'With less variability the tails of the effective and toxic curves overlap less, so the certain safety factor is larger.' },
    { q: 'A therapeutic window spans 5 to 20 mg/L and the half-life is 4 h. What is the longest dosing interval (h) for repeated IV doses?', answer: 8, unit: 'h', why: 'τ = 4 × log₂(20/5) = 4 × 2 = 8 h.' },
    { q: 'Narrow-therapeutic-index drugs have tighter bioequivalence requirements for generics in some jurisdictions.', a: true, why: 'In the EU, for example, the 90 % confidence interval for AUC must lie within 90.00–111.11 % rather than 80–125 %.' },
    { q: 'Which of these is a classic narrow-therapeutic-index medicine?', choices: ['amoxicillin', 'lithium', 'paracetamol at usual doses', 'loratadine'], a: 1, why: 'Lithium\'s effective and toxic levels lie close together, which is why its blood level is monitored.' }
  ],
  problems: [
    { q: 'A drug\'s effective and toxic quantal curves are log-normal with log-SD 0.2, and ED₅₀ = 10 mg/kg. What share of patients responds at 25 mg/kg?', answer: 97.7, unit: '%', tol: 0.01, steps: ['$z = \\log(25/10)/0.2 = 0.398/0.2 = 1.99$.', '$\\Phi(1.99) = 0.977$: about 97.7 % respond.'] },
    { q: 'A drug has a half-life of 12 h. A 24-hour dosing interval is wanted. What is the narrowest window MTC/MEC that allows it?', answer: 4, tol: 0.02, steps: ['$\\log_2(\\text{MTC}/\\text{MEC}) = 24/12 = 2$.', 'MTC/MEC = 2² = 4.'] }
  ],
  applications: [
    'Compare the therapeutic index with the certain safety factor in [the dose–response tool](#/tools/pk/pd).','Deciding which drugs need blood-level monitoring and tighter generic-substitution rules.', 'Setting dosing intervals and choosing infusions or modified-release forms for drugs with narrow windows.', 'Early safety assessment of drug candidates from animal ED₅₀ and TD₅₀ values.'],
  history: 'Paracelsus (1493–1541) argued that the dose alone makes a thing a poison. J. W. Trevan introduced the LD₅₀ in 1927 to standardise potent biological medicines; Paul Ehrlich had earlier sought a large "chemotherapeutic index" for his arsenical drugs. The idea of a concentration target range grew with drug-level assays in the 1960s and 1970s.',
  sim: 'pd-window'
},

{
  id: 'tolerance', parent: 'pd-topic', title: 'Tolerance and dependence', level: 2,
  short: 'With repeated exposure, many drugs lose effect: receptors desensitise, are removed or are opposed by the body\'s counter-regulation, or the drug is cleared faster. Dependence is the other face of the same adaptation — stopping suddenly unmasks it as withdrawal.',
  keywords: ['tolerance', 'tachyphylaxis', 'desensitisation', 'down-regulation', 'receptor internalisation', 'metabolic tolerance', 'cross-tolerance', 'dependence', 'withdrawal', 'rebound', 'up-regulation', 'nitrate tolerance', 'opioid tolerance'],
  prereq: ['receptors', 'potency-efficacy', 'math:exponential-models'],
  related: ['pkpd', 'drug-interactions', 'nonlinear-pk', 'medicine:addiction', 'biology:cell-signalling'],
  body: `
The body defends its steady states. When a drug pushes a system one way day after day, the system pushes back — and the same dose produces less effect. That is **tolerance**. When it develops within minutes or a few doses it is called **tachyphylaxis**.

### Pharmacodynamic tolerance: the receptor side
Receptors adapt on several timescales:
- **Desensitisation** (seconds to minutes): an activated G-protein-coupled receptor is phosphorylated by receptor kinases and capped by β-arrestin, uncoupling it from its G-protein.
- **Internalisation** (minutes to hours): the capped receptors are pulled into the cell; some return, some are destroyed.
- **Down-regulation** (hours to days): fewer receptors are made. Blocking a receptor for long periods does the opposite — **up-regulation**.
- **Counter-regulation**: other systems oppose the effect — a drug lowering blood pressure triggers salt and water retention and the renin system.

Receptor number follows a turnover balance: made at a steady rate, removed in proportion to how many there are. A drug that speeds removal drives the number to a new level along an exponential with rate $k_\\text{deg}$:

$$R(t) = R_\\text{ss} + (R_0 - R_\\text{ss})\\,e^{-k_\\text{deg}t}$$

so adaptation reaches half its final extent after $\\ln 2/k_\\text{deg}$ — often days — and reverses on the same timescale when the drug stops.

### Who loses what: efficacy decides
Losing receptors reduces τ in the operational model (see [[potency-efficacy]]). A high-efficacy agonist with plenty of reserve first loses **potency** — its curve moves right and a higher dose restores the effect. A partial agonist, with no reserve, loses **maximal effect**, and no dose restores it.

### Pharmacokinetic and learned tolerance
**Metabolic tolerance** comes from faster clearance: some drugs induce the enzymes that metabolise them, so levels fall over the first weeks (*auto-induction*; see [[drug-interactions]]). **Behavioural** or conditioned tolerance is learned: the body anticipates a drug in a familiar setting and counteracts it in advance.

### Examples
| Drug class | Tolerance | Mechanism and consequence |
|---|---|---|
| Organic nitrates | within about a day of continuous exposure | vascular adaptation; regimens include a nitrate-free interval |
| Opioids | to pain relief, euphoria, sedation, breathing depression — little to constipation or small pupils | receptor desensitisation and counter-adaptation |
| Benzodiazepines | to sedation within weeks; less to anxiety relief | GABA$_A$ receptor changes |
| Indirect sympathomimetics | within a few doses (tachyphylaxis) | depleted noradrenaline stores |
| β₂-agonists | partial, with regular use | receptor desensitisation and down-regulation |

Tolerance to different effects of the same drug develops at different rates, and this can shift the balance of benefit and harm.

### Dependence and withdrawal
The adaptations do not vanish the moment a drug is stopped. Up-regulated β-receptors after long β-blocker use can make the heart race; opioid and benzodiazepine withdrawal reverse their effects (restlessness, pain, anxiety; after benzodiazepines, occasionally seizures); long courses of corticosteroids suppress the body's own cortisol production. This **physical dependence** is a predictable pharmacological state and is why prescribers reduce some medicines gradually. It is not the same as **addiction** (substance use disorder), a health condition of craving, loss of control and continued use despite harm (see [[medicine:addiction|addiction]]).

> [!warn] Never stop or change a prescribed medicine suddenly without advice from the prescriber or a pharmacist. Tolerance is also lost: after a break, a dose that was once tolerated can stop breathing — an important cause of opioid deaths. Signs of overdose (unresponsiveness, very slow or noisy breathing, blue lips) need your local emergency number at once.
`,
  ideas: [
    'Tolerance is adaptation: desensitisation, internalisation, down-regulation and counter-regulation of the target.',
    'Receptor number approaches a new level exponentially, with a half-time ln 2/k_deg — often days.',
    'High-efficacy agonists first lose potency; partial agonists lose maximal effect.',
    'Metabolic tolerance comes from faster clearance, for example by enzyme auto-induction.',
    'Physical dependence is the adaptation revealed by stopping (withdrawal, rebound); it differs from addiction.'
  ],
  pitfalls: [
    'Tolerance and addiction are the same thing — Tolerance and physical dependence are expected pharmacological adaptations that happen to anyone taking some medicines regularly; addiction is a distinct condition defined by craving, loss of control and harm.',
    'Tolerance develops equally to all effects of a drug — Rates differ: with opioids, tolerance to breathing depression and euphoria develops, while constipation persists.',
    'Once tolerant, always tolerant — Adaptation reverses over days to weeks after stopping, so a previously tolerated dose can become dangerous.'
  ],
  formulas: [
    {
      name: 'Receptor turnover towards a new level',
      expr: 'R = Rss + (R0 - Rss)*exp(-kdeg*t)', tex: 'R = R_\\text{ss} + (R_0 - R_\\text{ss})\\,e^{-k_\\text{deg}t}',
      vars: {
        R: { name: 'receptor number (% of baseline)', q: 'ratio', unit: '%' },
        Rss: { name: 'new steady-state receptor number', q: 'ratio', unit: '%', value: 40, tex: 'R_\\text{ss}' },
        R0: { name: 'starting receptor number', q: 'ratio', unit: '%', value: 100, tex: 'R_0' },
        kdeg: { name: 'receptor turnover rate constant', q: 'rate', unit: '1/day', value: 0.3, tex: 'k_\\text{deg}' },
        t: { name: 'time on the drug', q: 'time', unit: 'day', value: 3 }
      },
      note: 'A turnover model: constant synthesis, first-order removal that the drug speeds up. The same equation describes recovery after stopping, with Rss = 100 %.',
      practice: { unknowns: ['R', 't'] },
      stories: { R: 'A drug drives receptor numbers towards {Rss} of baseline with a turnover rate constant of {kdeg}. What is left after {t}?', t: 'Receptors fall from {R0} towards {Rss} with k_deg = {kdeg}. How long until they reach {R}?' }
    },
    {
      name: 'Maximal effect after receptor loss (operational model)',
      expr: 'EmaxT = Em*q*tau/(1 + q*tau)', tex: 'E_\\text{max}\' = \\frac{E_m\\,q\\,\\tau}{1 + q\\,\\tau}',
      vars: {
        EmaxT: { name: 'maximal effect with fewer receptors', q: 'ratio', unit: '%', tex: 'E_\\text{max}\'' },
        Em: { name: 'system maximum', q: 'ratio', unit: '%', value: 100, tex: 'E_m' },
        q: { name: 'fraction of receptors remaining', q: 'ratio', unit: '%', value: 40 },
        tau: { name: 'transducer ratio before adaptation', value: 2, tex: '\\tau' }
      },
      stories: { EmaxT: 'An agonist has τ = {tau}. After tolerance only {q} of its receptors remain. What maximal effect can it still reach (system maximum {Em})?' }
    },
    {
      name: 'EC₅₀ after receptor loss (operational model)',
      expr: 'EC50 = KA/(1 + q*tau)', tex: '\\text{EC}_{50}\' = \\frac{K_A}{1 + q\\,\\tau}',
      vars: {
        EC50: { name: 'EC₅₀ with fewer receptors', q: 'concentration', unit: 'nM', tex: '\\text{EC}_{50}\'' },
        KA: { name: 'agonist dissociation constant', q: 'concentration', unit: 'nM', value: 1000, tex: 'K_A' },
        q: { name: 'fraction of receptors remaining', q: 'ratio', unit: '%', value: 40 },
        tau: { name: 'transducer ratio before adaptation', value: 30, tex: '\\tau' }
      },
      stories: { EC50: 'A high-efficacy agonist (KA = {KA}, τ = {tau}) keeps only {q} of its receptors after tolerance develops. What is its new EC₅₀?' }
    }
  ],
  examples: [
    {
      title: 'How fast does adaptation happen?',
      q: 'A hypothetical agonist drives its receptors towards 40 % of baseline, with a turnover rate constant of 0.3 per day. How many receptors are left after 3 days, and when is the adaptation 90 % complete?',
      steps: [
        '$R = 40 + (100 - 40)e^{-0.3\\times3} = 40 + 60 \\times 0.407 = 64.4$ %.',
        'Half-time: $\\ln 2/0.3$ = 2.3 days. 90 % of the change: $\\ln 10/0.3$ = 7.7 days.',
        'Recovery after stopping follows the same clock: about a week to regain most receptors.'
      ],
      a: '64 % after 3 days; the adaptation is 90 % complete after about 7.7 days.'
    },
    {
      title: 'Full agonist against partial agonist',
      q: 'Tolerance leaves 40 % of the receptors. Compare a high-efficacy agonist (τ = 30, $K_A$ = 1 µM) with a partial agonist (τ = 2).',
      steps: [
        'Full agonist: $E_\\text{max}$ 30/31 = 97 % → 12/13 = 92 %; EC₅₀ 1000/31 = 32 nM → 1000/13 = 77 nM. It needs 2.4 times more drug, but can still reach almost its full effect.',
        'Partial agonist: $E_\\text{max}$ 2/3 = 67 % → 0.8/1.8 = 44 %. A third of its effect is gone, and no dose brings it back.'
      ],
      a: 'The full agonist loses potency (2.4-fold); the partial agonist loses maximal effect (67 % → 44 %).'
    }
  ],
  quiz: [
    { q: 'Tachyphylaxis is…', choices: ['an allergic reaction', 'tolerance that develops very rapidly, within minutes or a few doses', 'a withdrawal syndrome', 'a type of drug interaction'], a: 1, why: 'Tachyphylaxis is rapid tolerance — for example with drugs that act by releasing a transmitter whose stores run out.' },
    { q: 'Physical dependence on a medicine means the person has an addiction.', a: false, why: 'Physical dependence is a predictable adaptation revealed by withdrawal; addiction is a distinct condition of craving, loss of control and continued use despite harm.' },
    { q: 'To which opioid effect does little tolerance develop?', choices: ['euphoria', 'sedation', 'constipation', 'breathing depression'], a: 2, why: 'Tolerance to the gut effects is small, so constipation tends to persist with long-term use.' },
    { q: 'Receptors turn over with k_deg = 0.2 per day. What is the half-time (days) of adaptation?', answer: 3.47, unit: 'day', why: 'ln 2/0.2 = 3.47 days.' },
    { q: 'Why can a dose that was once tolerated be dangerous after a period without the drug?', choices: ['the drug becomes stronger in storage', 'tolerance reverses, so the same dose has a larger effect', 'the liver stops working', 'withdrawal makes receptors disappear'], a: 1, why: 'The adaptations that caused tolerance reverse over days to weeks, so the old dose now meets an unadapted system.' }
  ],
  problems: [
    { q: 'A partial agonist has τ = 1.5. What percentage of the system maximum does it reach after tolerance leaves 30 % of its receptors?', answer: 31.0, unit: '%', tol: 0.02, steps: ['$q\\tau = 0.3 \\times 1.5 = 0.45$.', '$E_\\text{max}\' = 0.45/1.45 = 31$ % (it was 1.5/2.5 = 60 % before).'] }
  ],
  applications: ['Designing dosing schedules with drug-free intervals, as with nitrates.', 'Planning gradual dose reductions when long-term medicines are stopped under medical supervision.', 'Understanding overdose risk after a period of abstinence, a key point in harm-reduction work.'],
  history: 'Tolerance to opium was described for centuries before its mechanism was known. The molecular basis of receptor desensitisation — phosphorylation by G-protein-coupled receptor kinases and binding of β-arrestin — was worked out largely in Robert Lefkowitz\'s laboratory in the 1980s and 1990s. The American Psychiatric Association\'s DSM-5 (2013) separated physical dependence from substance use disorder in its diagnostic criteria.',
  sim: { id: 'pd-hysteresis', params: { tol: true } }
},

{
  id: 'drug-interactions', parent: 'pd-topic', title: 'Drug interactions', level: 2,
  short: 'One drug can change another\'s level (a pharmacokinetic interaction — usually by inhibiting or inducing a metabolising enzyme or transporter) or its effect (a pharmacodynamic interaction). How much the level changes depends mostly on the fraction of the victim drug\'s clearance that goes through the affected pathway.',
  keywords: ['drug–drug interaction', 'DDI', 'CYP3A4', 'cytochrome P450', 'enzyme inhibition', 'enzyme induction', 'mechanism-based inhibition', 'fm', 'AUC ratio', 'perpetrator', 'victim', 'P-glycoprotein', 'grapefruit', 'pharmacodynamic interaction', 'QT prolongation', 'serotonin syndrome'],
  prereq: ['clearance', 'hepatic-clearance', 'auc-cmax', 'biology:enzyme-inhibition'],
  related: ['pharmacogenomics', 'first-pass', 'food-effects', 'adverse-reactions', 'tdm', 'medicine:side-effects-interactions'],
  body: `
Many people take several medicines at once — in older adults five or more is common — and each can change what the others do. The drug whose level or effect changes is the **victim**; the drug causing it is the **perpetrator**. Interactions are one of the most predictable, and most preventable, causes of harm from medicines.

### Pharmacokinetic interactions: changing the level
Most involve the enzymes and transporters that clear drugs:
- **Cytochrome P450 enzymes** in the liver and gut wall metabolise most small-molecule drugs; CYP3A4 alone handles a large share of them, CYP2D6, 2C9, 2C19 and 1A2 most of the rest.
- **Transporters** — P-glycoprotein pumping drugs back into the gut or out into bile, OATP carriers taking them into the liver, renal transporters (OCT2, OAT1/3) secreting them into urine.
- Less often: changed absorption (antacids binding tetracyclines, chelation by calcium or iron), displacement from plasma proteins (rarely important on its own), or changed kidney excretion.

**Inhibition** raises the victim's exposure. A reversible (competitive) inhibitor at concentration [I] with inhibition constant $K_i$ divides the affected pathway's clearance by $1 + [I]/K_i$, so the AUC rises by

$$\\frac{\\text{AUC}_I}{\\text{AUC}} = \\frac{1}{\\dfrac{f_m}{1 + [I]/K_i} + (1 - f_m)}$$

where $f_m$ is the fraction of the victim's clearance through that enzyme. The fraction matters most: however strong the inhibitor, the rise can never exceed $1/(1 - f_m)$ — tenfold for $f_m$ = 0.9, but only 1.4-fold for $f_m$ = 0.3. That is why one inhibitor is dangerous with some drugs and irrelevant with others.

**Mechanism-based** (time-dependent) inhibitors are turned by the enzyme into a reactive species that destroys it. The effect builds with each dose and lasts until new enzyme is made — days after the inhibitor is gone. Some macrolide antibiotics act this way, and so do furanocoumarins in grapefruit juice, which knock out CYP3A4 in the gut wall for a day or more.

**Induction** lowers the victim's exposure. Inducers act through nuclear receptors (PXR, CAR) that switch on the genes for enzymes and transporters. Because new protein must be made, induction appears over about one to two weeks and fades over a similar time after the inducer stops. Rifampicin, several older antiepileptics and the herbal remedy St John's wort are classic inducers; induction can make a contraceptive, an antiretroviral or an immunosuppressant silently fail.

Regulators grade perpetrators by the AUC change they cause in a sensitive victim. FDA guidance (2020) calls an inhibitor **strong** when AUC rises at least fivefold, **moderate** at 2- to 5-fold and **weak** at 1.25- to 2-fold; a strong inducer lowers AUC by 80 % or more. The ICH M12 guideline (2024) harmonised how such studies are designed.

### Pharmacodynamic interactions: changing the effect
Here the levels are unchanged but the effects add up or cancel:
- **Additive toxicity**: two drugs that each prolong the QT interval; opioids with benzodiazepines, alcohol or other sedatives (combined breathing depression); anticoagulants with antiplatelet drugs or NSAIDs (bleeding).
- **Serotonin toxicity** from combining serotonergic medicines.
- **Opposing effects**: an NSAID blunting a blood-pressure medicine; a β-blocker opposing an asthma inhaler.
- **Combined kidney stress**: a blood-pressure medicine acting on the renin–angiotensin system, a diuretic and an NSAID together can reduce kidney blood flow.

> [!key] Exposure change ≈ $1/(f_m/(1 + [I]/K_i) + 1 - f_m)$. The victim's $f_m$ sets the ceiling; inhibition acts within hours, induction and recovery from mechanism-based inhibition take days to weeks.

> [!warn] Tell every prescriber and pharmacist about all medicines you take, including over-the-counter and herbal products. Do not start, stop or change a medicine to avoid an interaction without their advice — they can check for interactions and plan any change.
`,
  ideas: [
    'Pharmacokinetic interactions change the level; pharmacodynamic interactions change the effect at the same level.',
    'Reversible inhibition divides a pathway\'s clearance by 1 + [I]/Ki; the AUC can rise at most 1/(1 − fm)-fold.',
    'Mechanism-based inhibitors destroy the enzyme: their effect outlasts them until new enzyme is made.',
    'Induction switches on enzyme genes; it builds and fades over one to two weeks.',
    'Regulators classify inhibitors as strong (≥ 5-fold AUC), moderate (2–5) or weak (1.25–2).'
  ],
  pitfalls: [
    'A strong inhibitor always causes a big interaction — Only for victims that depend heavily on the inhibited pathway; with fm = 0.3 even complete inhibition raises AUC by just 1.4-fold.',
    'An interaction stops as soon as the perpetrator is stopped — Reversible inhibition fades with the inhibitor\'s own half-life, but mechanism-based inhibition and induction persist until enzyme levels recover, often one to two weeks.',
    'Herbal products and foods do not interact with medicines — St John\'s wort is a strong inducer, grapefruit juice inhibits gut CYP3A4, and many supplements affect bleeding or blood levels.'
  ],
  formulas: [
    {
      name: 'Reversible inhibition: exposure change',
      expr: 'AUCR = 1/(fm/(1 + I/Ki) + 1 - fm)', tex: '\\text{AUCR} = \\frac{1}{\\dfrac{f_m}{1 + \\mathrm{[I]}/K_i} + 1 - f_m}',
      vars: {
        AUCR: { name: 'AUC ratio (with ÷ without the inhibitor)', tex: '\\text{AUCR}' },
        fm: { name: 'fraction of the victim\'s clearance through the enzyme', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'f_m' },
        I: { name: 'inhibitor concentration at the enzyme', q: 'concentration', unit: 'µM', value: 2, tex: '\\mathrm{[I]}' },
        Ki: { name: 'inhibition constant', q: 'concentration', unit: 'µM', value: 1, tex: 'K_i' }
      },
      note: 'A static model for a victim cleared by the liver after IV dosing; gut-wall inhibition adds to it for oral drugs.',
      practice: { unknowns: ['AUCR', 'fm'] },
      stories: {
        AUCR: 'A victim drug is cleared {fm} by one enzyme. An inhibitor reaches {I} at the enzyme, with Ki = {Ki}. By what factor does the victim\'s AUC rise?',
        fm: 'An inhibitor at {I} (Ki = {Ki}) raises a victim\'s AUC {AUCR}-fold. What fraction of the victim\'s clearance goes through that enzyme?'
      }
    },
    {
      name: 'Mechanism-based inhibition at steady state',
      expr: 'AUCR = 1/(fm*kdeg/(kdeg + kinact*I/(KI + I)) + 1 - fm)', tex: '\\text{AUCR} = \\frac{1}{f_m\\dfrac{k_\\text{deg}}{k_\\text{deg} + k_\\text{inact}\\mathrm{[I]}/(K_I + \\mathrm{[I]})} + 1 - f_m}',
      vars: {
        AUCR: { name: 'AUC ratio', tex: '\\text{AUCR}' },
        fm: { name: 'fraction cleared by the enzyme', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'f_m' },
        kdeg: { name: 'natural degradation rate constant of the enzyme', q: 'rate', unit: '1/h', value: 0.03, tex: 'k_\\text{deg}' },
        kinact: { name: 'maximal inactivation rate constant', q: 'rate', unit: '1/h', value: 3, tex: 'k_\\text{inact}' },
        KI: { name: 'inhibitor concentration for half-maximal inactivation', q: 'concentration', unit: 'µM', value: 5, tex: 'K_I' },
        I: { name: 'inhibitor concentration', q: 'concentration', unit: 'µM', value: 1, tex: '\\mathrm{[I]}' }
      },
      note: 'The active enzyme falls to k_deg/(k_deg + k_obs) of normal. Recovery after the inhibitor stops follows k_deg: a hepatic CYP half-life of one to three days.',
      stories: { AUCR: 'A time-dependent inhibitor (k_inact = {kinact}, K_I = {KI}) is present at {I}; the enzyme turns over with k_deg = {kdeg}. A victim is cleared {fm} by that enzyme. By what factor does its AUC rise?' }
    },
    {
      name: 'Induction: exposure change',
      expr: 'AUCR = 1/(fm*(1 + Emax*I/(EC50 + I)) + 1 - fm)', tex: '\\text{AUCR} = \\frac{1}{f_m\\left(1 + \\dfrac{E_\\text{max}\\mathrm{[I]}}{\\text{EC}_{50} + \\mathrm{[I]}}\\right) + 1 - f_m}',
      vars: {
        AUCR: { name: 'AUC ratio', tex: '\\text{AUCR}' },
        fm: { name: 'fraction cleared by the induced enzyme', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'f_m' },
        Emax: { name: 'maximal induction (fold increase minus 1)', value: 8, tex: 'E_\\text{max}' },
        I: { name: 'inducer concentration', q: 'concentration', unit: 'µM', value: 1, tex: '\\mathrm{[I]}' },
        EC50: { name: 'inducer concentration for half-maximal induction', q: 'concentration', unit: 'µM', value: 0.5, tex: '\\text{EC}_{50}' }
      },
      note: 'At steady state of induction, reached after one to two weeks.',
      stories: { AUCR: 'An inducer at {I} (EC₅₀ = {EC50}, maximal induction {Emax}) acts on an enzyme that clears {fm} of a victim drug. What fraction of the victim\'s AUC remains?' }
    }
  ],
  examples: [
    {
      title: 'The same inhibitor, two victims',
      q: 'A strong inhibitor reaches [I]/Ki = 20. Victim A is cleared 90 % by the inhibited enzyme, victim B 30 %. How much does each AUC rise?',
      steps: [
        'A: $1/(0.9/21 + 0.1) = 1/(0.0429 + 0.1) = 7.0$-fold.',
        'B: $1/(0.3/21 + 0.7) = 1/(0.0143 + 0.7) = 1.4$-fold.',
        'Ceilings with complete inhibition: $1/(1 - 0.9)$ = 10 and $1/(1 - 0.3)$ = 1.43.'
      ],
      a: 'Sevenfold for A (a major interaction), 1.4-fold for B (usually minor).'
    },
    {
      title: 'An inhibitor that destroys its enzyme',
      q: 'A hypothetical time-dependent inhibitor has $k_\\text{inact}$ = 3 h⁻¹ and $K_I$ = 5 µM and reaches 1 µM. The enzyme\'s natural turnover is $k_\\text{deg}$ = 0.03 h⁻¹. What happens to a victim with $f_m$ = 0.9?',
      steps: [
        'Extra inactivation: $k_\\text{obs} = 3 \\times 1/(5 + 1) = 0.5$ h⁻¹, seventeen times the natural loss.',
        'Active enzyme left: $0.03/(0.03 + 0.5)$ = 5.7 %.',
        'AUCR = $1/(0.9 \\times 0.057 + 0.1) = 1/0.151$ = 6.6.',
        'After the inhibitor stops, the enzyme recovers with a half-life of $\\ln 2/0.03$ = 23 h, so the interaction lingers for several days.'
      ],
      a: 'A 6.6-fold rise in AUC that takes days to wear off.'
    },
    {
      title: 'An inducer',
      q: 'An inducer at 1 µM (EC₅₀ 0.5 µM, $E_\\text{max}$ = 8) acts on an enzyme that clears 90 % of a victim drug. What happens to the victim\'s exposure?',
      steps: [
        'Enzyme activity rises by $1 + 8 \\times 1/1.5$ = 6.3-fold.',
        'AUCR = $1/(0.9 \\times 6.33 + 0.1)$ = 0.17: exposure falls by 83 %.',
        'That is a strong inducer by the FDA definition — enough to make the victim ineffective, developing over one to two weeks.'
      ],
      a: 'The victim\'s AUC falls to about 17 % of normal.'
    }
  ],
  quiz: [
    { q: 'A victim drug is cleared 80 % by one enzyme. What is the largest possible rise in its AUC if that enzyme is completely inhibited?', answer: 5, why: '1/(1 − 0.8) = 5-fold: the other 20 % of clearance is untouched.' },
    { q: 'The effect of an enzyme inducer appears within a few hours of the first dose.', a: false, why: 'Induction requires new enzyme to be made; it builds over about one to two weeks and fades over a similar time.' },
    { q: 'Which is a pharmacodynamic interaction?', choices: ['an antifungal raising a statin\'s level', 'two medicines that each prolong the QT interval', 'an antacid reducing antibiotic absorption', 'an inducer lowering a contraceptive\'s level'], a: 1, why: 'The levels are unchanged; the effects on cardiac repolarisation add up.' },
    { q: 'Grapefruit juice raises the levels of some oral drugs mainly by…', choices: ['inducing liver CYP3A4', 'inactivating CYP3A4 in the gut wall', 'displacing drugs from albumin', 'slowing gastric emptying'], a: 1, why: 'Its furanocoumarins are mechanism-based inhibitors of intestinal CYP3A4, so more drug escapes first-pass metabolism.' },
    { q: 'An inhibitor at [I]/Ki = 3 acts on a victim cleared 60 % by the enzyme. What is the AUC ratio?', answer: 1.82, why: '1/(0.6/4 + 0.4) = 1/0.55 = 1.82.' }
  ],
  problems: [
    { q: 'An inhibitor raises a victim drug\'s AUC 4-fold when fully saturating the enzyme. What fraction (in %) of the victim\'s clearance goes through that enzyme?', answer: 75, unit: '%', tol: 0.02, steps: ['Complete inhibition: $\\text{AUCR} = 1/(1 - f_m) = 4$.', '$f_m = 1 - 1/4 = 0.75$.'] },
    { q: 'After an inducer is stopped, the extra enzyme is removed with a half-life of 70 h. How many days until 90 % of the induction has worn off?', answer: 9.7, unit: 'day', tol: 0.03, steps: ['90 % of an exponential change takes $\\log_2 10 = 3.32$ half-lives.', '$3.32 \\times 70$ h = 233 h ≈ 9.7 days.'] }
  ],
  applications: ['Drug development: in vitro Ki and induction studies, then clinical studies with index inhibitors and inducers, feeding the "drug interactions" section of the label.', 'Clinical decision support in prescribing and dispensing software that flags risky combinations.', 'Deliberate interactions: low-dose "boosters" that inhibit CYP3A4 to raise the levels of some antiviral medicines.'],
  history: 'The antihistamine terfenadine was withdrawn in the late 1990s after enzyme inhibitors raised its levels enough to cause dangerous heart rhythms, and the calcium-channel blocker mibefradil was withdrawn in 1998 because it inhibited the metabolism of many other drugs. These cases made interaction studies a standard part of drug development; the grapefruit effect was discovered by chance in 1989 in a study that used the juice to mask the taste of alcohol.',
  sim: 'pd-interaction'
},

{
  id: 'pharmacogenomics', parent: 'pd-topic', title: 'Pharmacogenomics', level: 3,
  short: 'Inherited differences in drug-metabolising enzymes, transporters, targets and immune genes make the same dose give very different exposures or reactions. Genotype predicts some of them — poor, intermediate, normal and ultrarapid metabolisers, and HLA types linked to severe skin reactions.',
  keywords: ['pharmacogenomics', 'pharmacogenetics', 'CYP2D6', 'CYP2C19', 'CYP2C9', 'poor metaboliser', 'ultrarapid metaboliser', 'activity score', 'HLA-B*57:01', 'HLA-B*15:02', 'TPMT', 'DPYD', 'prodrug', 'CPIC', 'genotype-guided dosing', 'Hardy–Weinberg'],
  prereq: ['drug-interactions', 'hepatic-clearance', 'biology:hardy-weinberg', 'biology:mutations'],
  related: ['adverse-reactions', 'tdm', 'paediatric-geriatric', 'first-pass', 'biology:human-genetics'],
  body: `
Give the same dose of a medicine to a hundred people and the blood levels can differ tenfold. Age, weight, kidneys, liver, other medicines and adherence explain much of it — but for some drugs a single gene explains more than all the rest together. **Pharmacogenomics** studies how inherited variation changes drug response.

### Metaboliser phenotypes
Many drug-metabolising enzymes are **polymorphic**: common gene variants make them absent, weak, normal or — when the gene is duplicated — extra active. Each allele is given an activity value (0 for no function, 0.5 for reduced, 1 for normal; a duplicated normal gene counts 2), and the two alleles add to an **activity score** that maps to a phenotype:

| Phenotype | Typical activity score | Consequence for a drug cleared by the enzyme |
|---|---|---|
| Poor metaboliser (PM) | 0 | high levels, more side effects |
| Intermediate (IM) | 0.25–1 | moderately raised levels |
| Normal (NM) | 1.25–2.25 | expected response |
| Ultrarapid (UM) | above 2.25 | low levels, possible lack of effect |

How many people fall in each group follows from allele frequencies. If a fraction $q$ of alleles have no function, then by [[biology:hardy-weinberg|Hardy–Weinberg]] about $q^2$ of people are poor metabolisers and $2q(1-q)$ carry one such allele. Frequencies differ between populations: roughly 5–10 % of people of European ancestry are CYP2D6 poor metabolisers, while CYP2C19 poor metabolisers are about 2–5 % in European and 10–20 % in East Asian populations. Ultrarapid CYP2D6 metabolisers are uncommon in northern Europe but much more frequent in some North African and Middle Eastern populations. Human variation lies mostly within populations, so an individual's genotype says far more than their ancestry.

### Exposure: the same arithmetic as an inhibitor
A poor metaboliser is like a person taking a perfect, permanent inhibitor of that enzyme (see [[drug-interactions]]). With a fraction $f_m$ of clearance through the enzyme and a remaining activity $a$ (0 for PM),

$$\\frac{\\text{AUC}}{\\text{AUC}_\\text{NM}} = \\frac{1}{1 - f_m(1 - a)}$$

A drug cleared 80 % by CYP2D6 gives a poor metaboliser five times the normal exposure. Genotype and interactions can also add up: an intermediate metaboliser taking an inhibitor may behave like a poor one (*phenoconversion*).

### Prodrugs turn the logic around
When the enzyme **activates** a prodrug, poor metabolisers get too little of the active form and ultrarapid metabolisers too much. Codeine is converted to morphine by CYP2D6: ultrarapid metabolisers can make dangerous amounts, which led regulators to restrict codeine in children (EMA 2013; FDA contraindication for under-12s, 2017). The antiplatelet clopidogrel is activated by CYP2C19, and poor metabolisers get less protection — the subject of a boxed warning in the US since 2010.

### Beyond metabolism
- **Toxicity genes**: people lacking TPMT or NUDT15 activity build up toxic levels of thiopurine metabolites; DPYD variants make fluoropyrimidine cancer drugs dangerous, and the EMA has recommended testing before treatment since 2020.
- **Immune genes (HLA)**: HLA-B\\*57:01 predicts a hypersensitivity reaction to the HIV medicine abacavir, and screening before treatment is standard; HLA-B\\*15:02, common in parts of South-East Asia, predicts severe skin reactions (SJS/TEN) to carbamazepine.
- **Targets**: VKORC1 and CYP2C9 variants together explain much of the variation in warfarin dose.

Guidelines from CPIC (the Clinical Pharmacogenetics Implementation Consortium, since 2009) and the Dutch DPWG translate genotypes into recommendations, and many product labels now include pharmacogenomic information.

> [!note] Genetic test results are interpreted by prescribers and pharmacists together with everything else about a person. Do not change a medicine or its dose because of a direct-to-consumer genetic report; discuss it with them.
`,
  ideas: [
    'Polymorphic enzymes give poor, intermediate, normal and ultrarapid metaboliser phenotypes, summarised by an activity score.',
    'Phenotype frequencies follow allele frequencies: poor metabolisers ≈ q², carriers ≈ 2q(1 − q).',
    'A poor metaboliser behaves like a permanent full inhibitor: AUC/AUC_NM = 1/(1 − fm(1 − a)).',
    'For prodrugs the effect reverses: poor metabolisers get too little active drug, ultrarapid metabolisers too much.',
    'HLA types predict some severe immune reactions (abacavir, carbamazepine), and screening prevents them.'
  ],
  pitfalls: [
    'A poor metaboliser always needs a lower dose — Only when the enzyme inactivates the drug; for a prodrug activated by that enzyme, a poor metaboliser gets less effect, and a different medicine may be preferred.',
    'Ancestry tells you a person\'s genotype — Allele frequencies differ between populations, but most variation is within them; only a test gives an individual\'s genotype.',
    'A gene variant matters for every drug the enzyme touches — The effect depends on the fraction of clearance through that enzyme (fm) and on the drug\'s therapeutic window.'
  ],
  formulas: [
    {
      name: 'Poor metabolisers from allele frequency',
      expr: 'fPM = q^2', tex: 'f_\\text{PM} = q^2',
      vars: {
        fPM: { name: 'frequency of poor metabolisers', q: 'ratio', unit: '%', tex: 'f_\\text{PM}' },
        q: { name: 'frequency of no-function alleles', q: 'ratio', unit: '%', value: 20, min: 0, max: 100 }
      },
      note: 'Hardy–Weinberg proportions, random mating. Carriers of one no-function allele: 2q(1 − q).',
      stories: { fPM: 'In a population {q} of the alleles of a drug-metabolising gene have no function. What fraction of people are poor metabolisers?', q: 'Poor metabolisers make up {fPM} of a population. What is the frequency of no-function alleles?' }
    },
    {
      name: 'Exposure relative to a normal metaboliser',
      expr: 'AUCR = 1/(1 - fm*(1 - a))', tex: '\\text{AUCR} = \\frac{1}{1 - f_m(1 - a)}',
      vars: {
        AUCR: { name: 'AUC ratio to a normal metaboliser (AUC/AUC_NM)', tex: '\\text{AUCR}' },
        fm: { name: 'fraction of clearance through the enzyme (in a normal metaboliser)', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: 'f_m' },
        a: { name: 'remaining enzyme activity', q: 'ratio', unit: '%', value: 0, min: 0, max: 100 }
      },
      note: 'For an active drug inactivated by the enzyme. a = 0 for a poor metaboliser, about 50 % for many intermediate metabolisers.',
      practice: { unknowns: ['AUCR', 'fm'] },
      stories: { AUCR: 'A drug is cleared {fm} by a polymorphic enzyme. How much higher is the exposure in a person with {a} of normal activity?', fm: 'Poor metabolisers have {AUCR} times the normal exposure of a drug. What fraction of its clearance goes through the missing enzyme?' }
    },
    {
      name: 'Number needed to genotype',
      expr: 'NNG = 1/(fc*pr)', tex: '\\text{NNG} = \\frac{1}{f_c\\,p_r}',
      vars: {
        NNG: { name: 'people tested to prevent one reaction', tex: '\\text{NNG}' },
        fc: { name: 'carrier frequency of the risk allele', q: 'ratio', unit: '%', value: 6, min: 0, max: 100, tex: 'f_c' },
        pr: { name: 'chance that a carrier reacts if treated', q: 'ratio', unit: '%', value: 50, min: 0, max: 100, tex: 'p_r' }
      },
      note: 'A simplified estimate that assumes non-carriers do not react and carriers are given an alternative.',
      stories: { NNG: 'A risk allele is carried by {fc} of patients, and {pr} of carriers react to a medicine. How many people must be tested to prevent one reaction?' }
    }
  ],
  examples: [
    {
      title: 'Phenotypes in a population',
      q: 'In a population 20 % of the alleles of a drug-metabolising gene have no function (the rest are normal). Out of 1000 people, how many are poor, intermediate and normal metabolisers?',
      steps: [
        'Poor (two no-function alleles): $q^2 = 0.2^2 = 0.04$ → 40 people.',
        'Intermediate (one): $2q(1 - q) = 2 \\times 0.2 \\times 0.8 = 0.32$ → 320 people.',
        'Normal: $(1 - q)^2 = 0.64$ → 640 people.'
      ],
      a: '40 poor, 320 intermediate and 640 normal metabolisers.'
    },
    {
      title: 'Exposure by genotype',
      q: 'A hypothetical drug is cleared 80 % by a polymorphic enzyme. Compare the exposure of poor metabolisers (no activity) and intermediate metabolisers (half activity) with normal.',
      steps: [
        'Poor: $1/(1 - 0.8 \\times 1) = 1/0.2$ = 5-fold.',
        'Intermediate: $1/(1 - 0.8 \\times 0.5) = 1/0.6$ = 1.7-fold.',
        'For a drug with a narrow window, fivefold is the difference between effect and toxicity; this is why some labels give genotype-based advice.'
      ],
      a: 'Fivefold in poor and 1.7-fold in intermediate metabolisers.'
    },
    {
      title: 'A prodrug in an ultrarapid metaboliser',
      q: 'A hypothetical prodrug is converted to its active form by one enzyme, which takes 10 % of its clearance in normal metabolisers; the rest is inactive elimination. What fraction is activated with double the enzyme activity (ultrarapid) and none (poor)?',
      steps: [
        'Fraction activated = $f_m a/(f_m a + 1 - f_m)$ with $a$ the relative activity.',
        'Ultrarapid ($a$ = 2): $0.2/(0.2 + 0.9)$ = 18 % — 1.8 times normal.',
        'Poor ($a$ = 0): nothing is activated, and the medicine does not work.'
      ],
      a: '18 % activated in the ultrarapid metaboliser (1.8 × normal), none in the poor metaboliser.'
    }
  ],
  quiz: [
    { q: 'If 10 % of alleles of an enzyme gene have no function, what percentage of people are poor metabolisers?', answer: 1, unit: '%', why: 'q² = 0.1² = 0.01 = 1 %.' },
    { q: 'A poor metaboliser of the enzyme that activates a prodrug gets a stronger effect from it.', a: false, why: 'The enzyme makes the active drug; without it, little active drug is formed and the effect is weaker.' },
    { q: 'Which genetic test is standard before starting abacavir?', choices: ['CYP2D6 genotype', 'HLA-B*57:01', 'TPMT activity', 'VKORC1'], a: 1, why: 'Carriers of HLA-B*57:01 are at high risk of a hypersensitivity reaction; screening prevents it.' },
    { q: 'An intermediate metaboliser who starts a strong inhibitor of the same enzyme may behave like…', choices: ['an ultrarapid metaboliser', 'a poor metaboliser', 'a normal metaboliser', 'nothing changes'], a: 1, why: 'The inhibitor removes most of the remaining activity — phenoconversion.' },
    { q: 'With 30 % no-function alleles, what percentage of people carry exactly one?', answer: 42, unit: '%', why: '2q(1 − q) = 2 × 0.3 × 0.7 = 0.42.' }
  ],
  problems: [
    { q: 'A drug is cleared 60 % by CYP2C19. How much higher is the exposure in a poor metaboliser?', answer: 2.5, tol: 0.02, steps: ['$1/(1 - 0.6) = 2.5$-fold.'] },
    { q: 'A risk allele is carried by 8 % of a population and 40 % of carriers react to a medicine. Roughly how many people must be genotyped to prevent one reaction?', answer: 31.25, tol: 0.03, steps: ['$\\text{NNG} = 1/(0.08 \\times 0.4) = 31$.'] }
  ],
  applications: ['Pre-treatment screening for HLA-B*57:01, DPYD and TPMT/NUDT15 variants.', 'Genotype-informed choice between antiplatelet medicines, antidepressants and pain relievers, following CPIC and DPWG guidelines.', 'Designing drugs that avoid polymorphic pathways, so exposure is more predictable.'],
  history: 'In the 1950s Werner Kalow described people who stayed paralysed for hours after the muscle relaxant suxamethonium because of an inherited enzyme deficiency, Arno Motulsky set out the idea of inherited drug responses in 1957, and Friedrich Vogel named it pharmacogenetics in 1959. The CYP2D6 "debrisoquine–sparteine" polymorphism was discovered in the 1970s when researchers — including one who took the drug himself — had unexpectedly strong effects. The PREDICT-1 trial (2008) showed that HLA-B*57:01 screening prevents abacavir hypersensitivity.',
  sim: 'pd-genotype'
},

{
  id: 'pkpd', parent: 'pd-topic', title: 'PK/PD modelling', level: 3,
  short: 'Linking pharmacokinetics to pharmacodynamics predicts the time course of a drug\'s effect. When the effect lags behind the plasma level, an effect compartment with rate constant ke0, or an indirect-response (turnover) model, explains the delay; plotting effect against concentration then traces a hysteresis loop.',
  keywords: ['PK/PD', 'pharmacokinetic–pharmacodynamic model', 'effect compartment', 'ke0', 'biophase', 'hysteresis', 'anticlockwise loop', 'clockwise loop', 'indirect response model', 'turnover', 'duration of action', 'Emax model', 'time to peak effect'],
  prereq: ['dose-response', 'one-compartment-iv', 'math:differential-equations-intro'],
  related: ['tolerance', 'therapeutic-index', 'two-compartment', 'tdm', 'medicine:anaesthesia-surgery'],
  body: `
Pharmacokinetics predicts the concentration at any time; the dose–response curve turns a concentration into an effect. Put the two together and you can predict **how the effect rises and falls after each dose** — the aim of PK/PD modelling, used to choose doses in drug development and to time anaesthesia to the minute.

### Direct effects and the duration of action
If the effect follows the plasma level instantly, the Emax model is applied to the concentration curve directly. One useful result: after a bolus, the level stays above a minimum effective concentration for

$$t_\\text{eff} = t_{1/2}\\log_2\\frac{C_0}{\\text{MEC}}$$

so **doubling the dose adds only one half-life** of action, and a tenfold dose adds 3.3 half-lives. Lengthening action by raising the dose is inefficient and raises the peak — often into toxicity.

### When the effect lags: the effect compartment
Often the effect peaks well after the plasma level. The drug must first travel to the site of action — through the blood–brain barrier, into a tissue. Lewis Sheiner and colleagues (1979) modelled this with a tiny hypothetical **effect compartment** that takes up drug in proportion to the difference in concentration:

$$\\frac{dC_e}{dt} = k_{e0}\\,(C_p - C_e)$$

The effect is then the Emax model applied to $C_e$. The effect-site level equilibrates with a half-time $\\ln 2/k_{e0}$: one to two minutes for fast-acting intravenous anaesthetics, several minutes for some opioids, much longer for drugs that cross into the brain slowly. After an IV bolus with elimination rate constant $k$ the effect peaks at

$$t_\\text{peak} = \\frac{\\ln(k_{e0}/k)}{k_{e0} - k}$$

exactly when the falling plasma curve crosses the rising effect-site curve. Anaesthetists use $k_{e0}$ to target the effect-site concentration directly with computer-controlled infusion pumps.

### Hysteresis loops
Plot effect against *plasma* concentration, joining points in time order. For a direct effect the points lie on one curve. With a delay they trace a loop:
- **Anticlockwise**: the same plasma level gives more effect on the way down than on the way up. Causes: distribution to an effect site, an active metabolite that forms slowly, or an indirect mechanism.
- **Clockwise**: less effect on the way down — the body adapts during the dose, as in acute tolerance (see [[tolerance]]), or the drug enters the effect site faster than it is measured in plasma.

> [!key] An anticlockwise loop means delay; a clockwise loop means adaptation. The effect compartment collapses a delay loop onto a single concentration–effect curve.

### Indirect responses: turnover
Many drugs act by changing the **production or loss** of something the body makes — a clotting factor, a hormone, a count of blood cells. The response then moves at the speed of that turnover, not of the drug. In the indirect-response models of Dayneka, Garg and Jusko (1993), a response made at rate $k_\\text{in}$ and lost at rate $k_\\text{out}R$ settles, if the drug inhibits its production, at

$$R_\\text{ss} = R_0\\left(1 - \\frac{I_\\text{max}C}{\\text{IC}_{50} + C}\\right)$$

reached with the half-life of the response itself, $\\ln 2/k_\\text{out}$. That is why the full effect of an oral anticoagulant that blocks clotting-factor synthesis takes days, although its level is steady within hours, and why cholesterol falls over weeks on a statin.

### What PK/PD is used for
- Choosing the dose and interval: for time-dependent antibiotics, keep the level above the MIC; for concentration-dependent ones, aim for a high peak (see [[antimicrobial-stewardship]]).
- Translating animal and early human data into doses for trials, and predicting exposure–response in children or kidney impairment.
- Model-informed drug development — now a recognised route in regulatory submissions.
`,
  ideas: [
    'PK gives concentration against time; PD turns concentration into effect; together they predict the effect\'s time course.',
    'After a bolus, doubling the dose extends action by only one half-life: t_eff = t½ log₂(C0/MEC).',
    'An effect compartment (dCe/dt = ke0(Cp − Ce)) explains effects that lag behind plasma levels.',
    'Anticlockwise hysteresis means delay; clockwise means adaptation such as acute tolerance.',
    'Indirect-response (turnover) models explain effects that develop over days even at a steady level.'
  ],
  pitfalls: [
    'The effect is greatest when the plasma level is highest — Not when the drug must reach an effect site or act through turnover; the peak effect can come minutes to days after the peak level.',
    'Doubling the dose doubles the duration of action — For first-order elimination it adds only one half-life.',
    'A hysteresis loop means the concentration–effect relation is unreliable — The loop has a mechanism; an effect-compartment or turnover model usually recovers a single, well-defined concentration–effect curve.'
  ],
  formulas: [
    {
      name: 'Time to peak effect after an IV bolus',
      expr: 'tpk = ln(ke0/k)/(ke0 - k)', tex: 't_\\text{peak} = \\frac{\\ln(k_{e0}/k)}{k_{e0} - k}',
      vars: {
        tpk: { name: 'time of peak effect-site concentration', q: 'time', unit: 'min', tex: 't_\\text{peak}' },
        ke0: { name: 'effect-site equilibration rate constant', q: 'rate', unit: '1/h', value: 2.8, tex: 'k_{e0}' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.35 }
      },
      note: 'One-compartment plasma kinetics with an effect compartment. At t_peak the effect-site and plasma concentrations are equal.',
      stories: { tpk: 'A hypothetical drug given as an IV bolus has k = {k} and ke0 = {ke0}. When is its effect greatest?', ke0: 'A drug with k = {k} has its peak effect {tpk} after an IV bolus. What is its ke0?' }
    },
    {
      name: 'Effect-site equilibration half-time',
      expr: 'te = ln(2)/ke0', tex: 't_{1/2,k_{e0}} = \\frac{\\ln 2}{k_{e0}}',
      vars: {
        te: { name: 'equilibration half-time', q: 'time', unit: 'min', tex: 't_{1/2,k_{e0}}' },
        ke0: { name: 'effect-site equilibration rate constant', q: 'rate', unit: '1/min', value: 0.231, tex: 'k_{e0}' }
      },
      stories: { te: 'A drug\'s effect site equilibrates with ke0 = {ke0}. How long does it take to reach half of a new plasma level?' }
    },
    {
      name: 'Duration of effect after a bolus',
      expr: 'td = th*log2(C0/MEC)', tex: 't_\\text{eff} = t_{1/2}\\log_2\\frac{C_0}{\\text{MEC}}',
      vars: {
        td: { name: 'time above the minimum effective concentration', q: 'time', unit: 'h', tex: 't_\\text{eff}' },
        th: { name: 'elimination half-life', q: 'time', unit: 'h', value: 4, tex: 't_{1/2}' },
        C0: { name: 'initial concentration', q: 'massconc', unit: 'mg/L', value: 16, tex: 'C_0' },
        MEC: { name: 'minimum effective concentration', q: 'massconc', unit: 'mg/L', value: 2, tex: '\\text{MEC}' }
      },
      note: 'A direct effect with one-compartment, first-order elimination.',
      practice: { unknowns: ['td', 'C0'] },
      stories: { td: 'A bolus gives an initial level of {C0}; the drug works above {MEC} and has a half-life of {th}. How long does the effect last?', C0: 'To act for {td} with a half-life of {th} and an MEC of {MEC}, what starting concentration is needed?' }
    },
    {
      name: 'Indirect response: inhibited production at steady state',
      expr: 'R = R0*(1 - Imax*C/(IC50 + C))', tex: 'R_\\text{ss} = R_0\\left(1 - \\frac{I_\\text{max}C}{\\text{IC}_{50} + C}\\right)',
      vars: {
        R: { name: 'new steady-state response', q: 'ratio', unit: '%', tex: 'R_\\text{ss}' },
        R0: { name: 'baseline response', q: 'ratio', unit: '%', value: 100, tex: 'R_0' },
        Imax: { name: 'maximal fractional inhibition of production', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'I_\\text{max}' },
        C: { name: 'drug concentration', q: 'massconc', unit: 'mg/L', value: 1.5 },
        IC50: { name: 'concentration for half-maximal inhibition', q: 'massconc', unit: 'mg/L', value: 0.5, tex: '\\text{IC}_{50}' }
      },
      note: 'The response approaches this level with its own turnover half-life ln 2/k_out, however quickly the drug level settles.',
      stories: { R: 'A hypothetical drug inhibits the production of a circulating protein (Imax = {Imax}, IC₅₀ = {IC50}). At a steady level of {C}, where does the protein settle, as a share of its baseline {R0}?' }
    }
  ],
  examples: [
    {
      title: 'When does the effect peak?',
      q: 'A hypothetical IV drug has a half-life of 2 h ($k$ = 0.35 h⁻¹) and an effect-site equilibration half-time of 15 minutes ($k_{e0}$ = 2.8 h⁻¹). When is its effect greatest after a bolus?',
      steps: [
        '$t_\\text{peak} = \\ln(2.8/0.35)/(2.8 - 0.35) = \\ln 8/2.45 = 2.079/2.45 = 0.85$ h.',
        'That is 51 minutes after the injection — while the plasma level has been falling all the time.',
        'At that moment both concentrations are 74 % of the initial plasma level.'
      ],
      a: 'About 51 minutes after the bolus.'
    },
    {
      title: 'Buying duration with dose',
      q: 'A bolus gives 16 mg/L of a drug with a half-life of 4 h that works above 2 mg/L. How long does it act? And after twice or ten times the dose?',
      steps: [
        '$t_\\text{eff} = 4\\log_2(16/2) = 4 \\times 3 = 12$ h.',
        'Double dose: $4\\log_2(32/2) = 16$ h — one more half-life.',
        'Ten times the dose: $12 + 4\\log_2 10 = 12 + 13.3 = 25$ h, but with a peak ten times higher.'
      ],
      a: '12 h; 16 h with twice the dose; 25 h with ten times — a costly way to lengthen action.'
    },
    {
      title: 'An effect that takes days',
      q: 'A hypothetical drug inhibits synthesis of a clotting protein with $I_\\text{max}$ = 90 % and IC₅₀ = 0.5 mg/L, and reaches a steady 1.5 mg/L within a day. The protein\'s half-life is 60 h. Where does the protein settle, and when is the change 90 % complete?',
      steps: [
        '$R_\\text{ss} = 100 \\times (1 - 0.9 \\times 1.5/2.0) = 32.5$ % of baseline.',
        'The approach follows the protein\'s own half-life: 90 % of the change takes $3.32 \\times 60$ h ≈ 200 h — more than 8 days.'
      ],
      a: 'It settles at about a third of baseline, but only after about eight days.'
    }
  ],
  quiz: [
    { q: 'Effect plotted against plasma concentration traces an anticlockwise loop. The most likely explanation is…', choices: ['tolerance developing during the dose', 'a delay: distribution to the effect site, an active metabolite or an indirect mechanism', 'an assay error', 'protein binding'], a: 1, why: 'On the way down the effect site still holds more drug than on the way up at the same plasma level, so the effect is larger — anticlockwise.' },
    { q: 'A clockwise hysteresis loop suggests…', choices: ['effect-site delay', 'acute tolerance', 'an active metabolite', 'slow absorption'], a: 1, why: 'Less effect on the way down than on the way up means the system has adapted during the dose.' },
    { q: 'An effect site equilibrates with ke0 = 0.231 per minute. What is the equilibration half-time in minutes?', answer: 3, unit: 'min', why: 'ln 2/0.231 = 3.0 minutes.' },
    { q: 'Doubling a bolus dose doubles how long the drug acts.', a: false, why: 'With first-order elimination it adds one half-life: t_eff = t½ log₂(C0/MEC).' },
    { q: 'Why does a drug that blocks clotting-factor synthesis take days to reach its full effect even though its level is steady within hours?', choices: ['it is absorbed slowly', 'the existing clotting factors must be cleared at their own turnover rate', 'the liver must first be induced', 'the effect compartment is very large'], a: 1, why: 'An indirect response moves at the speed of the turnover of what it changes.' }
  ],
  problems: [
    { q: 'A drug has k = 0.2 h⁻¹ and ke0 = 1.0 h⁻¹. How many hours after an IV bolus does its effect peak?', answer: 2.01, unit: 'h', tol: 0.02, steps: ['$t_\\text{peak} = \\ln(1.0/0.2)/(1.0 - 0.2) = 1.609/0.8 = 2.01$ h.'] },
    { q: 'A drug with a half-life of 3 h must act for at least 9 h above an MEC of 1 mg/L. What initial concentration is needed after a bolus?', answer: 8, unit: 'mg/L', tol: 0.02, steps: ['$9 = 3\\log_2(C_0/1)$, so $\\log_2 C_0 = 3$.', '$C_0 = 8$ mg/L.'] }
  ],
  applications: ['Target-controlled infusion in anaesthesia, which steers the effect-site concentration.', 'Choosing antibiotic regimens from PK/PD indices (time above MIC, AUC/MIC, peak/MIC).', 'Model-informed drug development: dose selection for trials, children and special populations.'],
  history: 'Gerhard Levy linked pharmacokinetics to the time course of drug effects in the 1960s. Lewis Sheiner, Donald Stanski and colleagues introduced the effect compartment in 1979 to explain the delayed action of the muscle relaxant d-tubocurarine, and William Jusko\'s group published the four basic indirect-response models in 1993.',
  sim: 'pd-hysteresis'
},

/* ================================================================ SAFETY */
{
  id: 'pharmacovigilance', parent: 'safety-topic', title: 'Pharmacovigilance', level: 2,
  short: 'The science of detecting, assessing and preventing harm from medicines after they reach the market. Trials of a few thousand people cannot find a reaction that strikes one person in ten thousand; reports from patients and professionals, analysed statistically, can.',
  keywords: ['pharmacovigilance', 'drug safety', 'spontaneous reporting', 'yellow card', 'MedWatch', 'signal detection', 'disproportionality', 'PRR', 'reporting odds ratio', 'rule of three', 'under-reporting', 'VigiBase', 'risk management plan', 'black triangle', 'post-marketing surveillance'],
  prereq: ['adverse-reactions', 'clinical-trials', 'math:binomial-distribution'],
  related: ['regulation-approval', 'medication-errors', 'falsified-medicines', 'drug-development', 'medicine:clinical-trials', 'math:poisson-distribution'],
  body: `
When a new medicine is approved, typically a few thousand people have taken it, for months rather than years, and most of them were carefully chosen: few very old people, few pregnant women, few people with many illnesses. The medicine is then given to millions. **Pharmacovigilance** — "watchfulness over drugs" — is the science of finding the harms that only then become visible, and acting on them.

### Why trials cannot see rare reactions
If a reaction strikes a fraction $p$ of patients, the chance of seeing at least one case among $n$ treated is

$$P = 1 - (1 - p)^n$$

With $p$ = 1 in 10 000 and a typical approval database of 3000 patients, $P$ is only 26 %. To be 95 % sure of seeing a single case needs about $3/p$ = 30 000 patients. Turned around, this is the **rule of three**: if no case has been seen in $n$ patients, the true rate could still be as high as $3/n$ (the upper 95 % bound). Zero cases in 3000 patients rules out only reactions more common than 1 in 1000. Reactions after long-term use, in special groups, or in combination with other medicines are equally hard to see before approval.

### Spontaneous reporting
The backbone of pharmacovigilance is **spontaneous reporting**: health professionals — and, in many countries, patients — report suspected reactions to the regulator or manufacturer. The UK Yellow Card scheme began in 1964 after thalidomide; the US MedWatch programme, the EU's EudraVigilance and national centres everywhere feed the WHO global database, VigiBase, run by the Uppsala Monitoring Centre, which holds tens of millions of reports.

A report is a *suspicion*, not proof. Reports are also incomplete: studies suggest that well over 90 % of reactions are never reported, and reporting rises when a drug is new or in the news. So the number of reports cannot give an incidence. What it can give is a **signal** — a hint that an event is reported with this drug more often than expected.

### Finding signals: disproportionality
The reports in a database are arranged in a 2×2 table:

| | Event of interest | All other events |
|---|---|---|
| Drug of interest | $a$ | $b$ |
| All other drugs | $c$ | $d$ |

The **proportional reporting ratio** $\\text{PRR} = [a/(a + b)]/[c/(c + d)]$ asks whether the event makes up a larger share of this drug's reports than of everyone else's; the **reporting odds ratio** $\\text{ROR} = ad/(bc)$ is its close cousin. A common screening rule (Evans and colleagues, 2001) flags a PRR of at least 2 with at least three cases and a χ² of at least 4. Bayesian methods shrink ratios built on few reports. A flagged signal is then assessed: individual case reports are read, the timing and dechallenge examined, the biology considered, and if needed a formal study — a cohort or case–control study in health records — measures the real risk.

### From signal to action
Regulators can update the label with a new warning, restrict use, require monitoring or tests, add educational materials, or, rarely, withdraw the medicine. Companies must keep a pharmacovigilance system, submit periodic safety update reports and, in the EU since the 2010 legislation, a risk management plan for every new medicine. Medicines under additional monitoring carry an inverted black triangle ▼ in the EU, inviting reports. Planned **post-authorisation safety studies** and registries fill the gaps that reports cannot.

> [!tip] Anyone can help: if you think a medicine has caused a side effect, tell a doctor, nurse or pharmacist, and report it through your country's scheme (for example the Yellow Card scheme in the UK or MedWatch in the US). Reports of suspected reactions are how rare harms are found.
`,
  ideas: [
    'Trials of a few thousand people cannot detect reactions rarer than about 1 in 1000.',
    'P(at least one case) = 1 − (1 − p)ⁿ; 95 % confidence of seeing one case needs about 3/p patients.',
    'Rule of three: with zero cases in n patients, the true rate could still be up to 3/n.',
    'Spontaneous reports are suspicions with heavy under-reporting; they generate signals, not incidences.',
    'Disproportionality (PRR, ROR) flags events reported unusually often with a drug; formal studies then measure the risk.'
  ],
  pitfalls: [
    'A spontaneous report proves the drug caused the event — A report records a suspicion; the event may have another cause. Causality is assessed across many reports and studies.',
    'The number of reports gives the frequency of a reaction — Most reactions are never reported and reporting varies with publicity; incidence needs a denominator from a proper study.',
    'No cases in the trials means the drug is free of that reaction — With zero cases in n patients, rates up to 3/n are still compatible with the data.'
  ],
  formulas: [
    {
      name: 'Chance of seeing at least one case',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1 - p)^{n}',
      vars: {
        P: { name: 'probability of at least one case', q: 'ratio', unit: '%' },
        p: { name: 'incidence of the reaction per patient', q: 'ratio', unit: '%', value: 0.01, min: 0, max: 100 },
        n: { name: 'number of patients treated', value: 3000 }
      },
      note: 'Each patient independently at risk p. 1 in 10 000 = 0.01 %.',
      practice: { unknowns: ['P', 'n'] },
      stories: { P: 'A reaction affects {p} of patients. What is the chance that a trial of {n} patients sees at least one case?', n: 'How many patients must be treated to have a {P} chance of seeing at least one case of a reaction affecting {p} of them?' }
    },
    {
      name: 'Rule of three',
      expr: 'pu = 3/n', tex: 'p_\\text{upper} \\approx \\frac{3}{n}',
      vars: {
        pu: { name: 'upper 95 % bound of the incidence', q: 'ratio', unit: '%', tex: 'p_\\text{upper}' },
        n: { name: 'patients observed with no case', value: 3000 }
      },
      note: 'From (1 − p)ⁿ = 0.05, using ln 0.05 ≈ −3; good for n above about 30.',
      stories: { pu: 'No case of a reaction was seen among {n} treated patients. Up to what incidence is still compatible with that?', n: 'How many patients must be observed without a case to show that a reaction affects fewer than {pu} of patients?' }
    },
    {
      name: 'Proportional reporting ratio',
      expr: 'PRR = (a/(a + b))/(c/(c + d))', tex: '\\text{PRR} = \\frac{a/(a + b)}{c/(c + d)}',
      vars: {
        PRR: { name: 'proportional reporting ratio', tex: '\\text{PRR}' },
        a: { name: 'reports: drug and event', value: 20 },
        b: { name: 'reports: drug, other events', value: 980 },
        c: { name: 'reports: other drugs, event', value: 200 },
        d: { name: 'reports: other drugs, other events', value: 98800 }
      },
      stories: { PRR: 'A database holds {a} reports of an event with a new drug among {b} other reports for it, and {c} reports of the same event among {d} other reports for all other drugs. What is the PRR?' }
    },
    {
      name: 'Reporting odds ratio',
      expr: 'ROR = a*d/(b*c)', tex: '\\text{ROR} = \\frac{a\\,d}{b\\,c}',
      vars: {
        ROR: { name: 'reporting odds ratio', tex: '\\text{ROR}' },
        a: { name: 'reports: drug and event', value: 20 },
        b: { name: 'reports: drug, other events', value: 980 },
        c: { name: 'reports: other drugs, event', value: 200 },
        d: { name: 'reports: other drugs, other events', value: 98800 }
      },
      stories: { ROR: 'With {a} reports of the event and {b} others for the drug, and {c} and {d} for all other drugs, what is the reporting odds ratio?' }
    }
  ],
  examples: [
    {
      title: 'How big must a study be?',
      q: 'A serious reaction affects 1 patient in 10 000. What is the chance that a development programme of 3000 patients sees a case, and how many patients give a 95 % chance?',
      steps: [
        '$P = 1 - 0.9999^{3000} = 1 - 0.741 = 26$ %.',
        '95 %: $n = \\ln 0.05/\\ln 0.9999 = 29\\,956$ — about 30 000 patients, $3/p$.',
        'That is why such a reaction is usually found only after marketing.'
      ],
      a: '26 %; about 30 000 patients are needed for 95 %.'
    },
    {
      title: 'A disproportionality signal',
      q: 'In a reporting database a new drug has 1000 reports, 20 of them of a particular liver injury. Among all other drugs, 200 of 99 000 reports describe it. Compute the PRR and ROR.',
      steps: [
        'PRR = $(20/1000)/(200/99\\,000) = 0.020/0.00202 = 9.9$.',
        'ROR = $(20 \\times 98\\,800)/(980 \\times 200) = 10.1$.',
        'Only 2.2 reports would be expected if the drug were like the others; the signal clearly passes the screening thresholds and goes on to clinical assessment.'
      ],
      a: 'PRR ≈ 9.9 and ROR ≈ 10: a signal that needs assessment, not yet proof.'
    },
    {
      title: 'What under-reporting hides',
      q: 'A medicine is taken by 1 million people; a reaction affects 1 in 5000 of them, and 5 % of cases are reported. How many reports arrive?',
      steps: [
        'True cases: $10^6/5000 = 200$.',
        'Reports: $200 \\times 0.05 = 10$.',
        'Ten reports could equally mean 200 cases or, with better reporting, 20 — the reports alone cannot tell.'
      ],
      a: 'About 10 reports for 200 real cases.'
    }
  ],
  quiz: [
    { q: 'No case of a reaction is seen in 1500 treated patients. What is the upper 95 % bound (in %) of its incidence?', answer: 0.2, unit: '%', why: 'Rule of three: 3/1500 = 0.002 = 0.2 %, that is, up to 1 in 500.' },
    { q: 'A spontaneous report shows that the medicine caused the event.', a: false, why: 'It records a suspicion. Causality needs assessment of many reports, plausibility and often a formal study.' },
    { q: 'A PRR of 5 for an event means…', choices: ['the drug causes the event in 5 % of patients', 'the event makes up five times as large a share of this drug\'s reports as of other drugs\' reports', 'five reports were received', 'the risk is five times higher, proven'], a: 1, why: 'The PRR compares proportions of reports, not risks in patients; it flags a signal to investigate.' },
    { q: 'Why are rare adverse reactions usually discovered after a medicine is approved?', choices: ['regulators hide them', 'trials are too small and short, and exclude many kinds of patients', 'rare reactions only appear in generics', 'they are caused by manufacturing'], a: 1, why: 'A trial of a few thousand patients has a low chance of seeing a 1-in-10 000 reaction; millions of patients after approval do.' },
    { q: 'About how many patients must be treated to have a 95 % chance of seeing one case of a 1-in-2000 reaction?', answer: 6000, why: 'n ≈ 3/p = 3 × 2000 = 6000.' }
  ],
  problems: [
    { q: 'A reaction affects 1 in 2000 patients. What is the chance (in %) that a trial of 1500 patients records at least one case?', answer: 52.8, unit: '%', tol: 0.02, steps: ['$P = 1 - (1 - 0.0005)^{1500} = 1 - 0.472 = 0.528$.'] }
  ],
  applications: ['National reporting schemes and the WHO global database of suspected reactions.', 'Label changes, restrictions and withdrawals driven by safety signals.', 'Risk management plans, registries and post-authorisation safety studies for new medicines.'],
  history: 'After thalidomide caused severe limb malformations in some ten thousand babies around 1957–1961, countries set up reporting systems: the UK Committee on Safety of Drugs launched the Yellow Card in 1964, and the WHO Programme for International Drug Monitoring began in 1968. The EU pharmacovigilance legislation of 2010 created the Pharmacovigilance Risk Assessment Committee (PRAC) in 2012.',
  sim: 'pd-signal'
},

{
  id: 'adverse-reactions', parent: 'safety-topic', title: 'Adverse drug reactions', level: 1,
  short: 'An adverse drug reaction is a harmful, unintended response to a medicine. Most are predictable extensions of the drug\'s pharmacology and depend on the dose (type A); a few are unpredictable, often immune reactions (type B). They cause a noticeable share of hospital admissions, and many are preventable.',
  keywords: ['adverse drug reaction', 'ADR', 'side effect', 'adverse event', 'type A', 'type B', 'hypersensitivity', 'anaphylaxis', 'Stevens–Johnson syndrome', 'DRESS', 'frequency categories', 'causality', 'Naranjo', 'number needed to harm', 'penicillin allergy', 'drug allergy'],
  prereq: ['therapeutic-index', 'dose-response', 'medicine:side-effects-interactions'],
  related: ['pharmacovigilance', 'drug-interactions', 'pharmacogenomics', 'medication-errors', 'medicine:anaphylaxis', 'medicine:allergy'],
  body: `
Every medicine that works can also harm. An **adverse drug reaction** (ADR) is a response to a medicine that is harmful and unintended. It differs from an **adverse event**, which is anything bad that happens to a person taking a medicine, whether the medicine caused it or not — the distinction at the heart of trials and pharmacovigilance. "Side effect" is the everyday word; strictly it means any effect other than the intended one, good or bad.

### Classifying reactions
The classic scheme (Rawlins and Thompson, extended by Edwards and Aronson in 2000):

| Type | Name | Features | Examples |
|---|---|---|---|
| A | Augmented | dose-related, predictable from pharmacology, common | bleeding on an anticoagulant, low blood sugar on insulin, drowsiness from sedating antihistamines |
| B | Bizarre | not dose-related, unpredictable, often immune, rare but serious | anaphylaxis to penicillin, severe skin reactions (SJS/TEN) |
| C | Chronic | from long-term use | adrenal suppression with corticosteroids |
| D | Delayed | appears long after | some second cancers after chemotherapy |
| E | End of use | withdrawal or rebound | rebound tachycardia after a β-blocker |
| F | Failure | the treatment fails | contraceptive failure with an enzyme inducer |

About four in five reactions are type A: too much of the right effect (an anticoagulant bleeding), or the drug acting on a second target (an anticholinergic side effect of an antidepressant). They depend on the concentration, so they rise with dose, reduced clearance (kidney or liver disease, older age — see [[paediatric-geriatric]]), interactions and genotype (see [[drug-interactions]] and [[pharmacogenomics]]).

Type B reactions are mostly **hypersensitivity**, classified by the immune mechanism (Gell and Coombs): immediate IgE-mediated reactions such as urticaria and anaphylaxis; antibody-mediated destruction of blood cells; immune-complex reactions; and delayed T-cell reactions — from mild rashes to the rare but dangerous Stevens–Johnson syndrome and toxic epidermal necrolysis (SJS/TEN, roughly one to a few cases per million people per year) and DRESS. Some are predictable after all through HLA genotype.

### How common, and how costly?
Product information describes frequencies in standard words (CIOMS III; the EU summary of product characteristics guideline):

| Term | Frequency |
|---|---|
| very common | ≥ 1/10 |
| common | ≥ 1/100 to < 1/10 |
| uncommon | ≥ 1/1000 to < 1/100 |
| rare | ≥ 1/10 000 to < 1/1000 |
| very rare | < 1/10 000 |

A large English study (Pirmohamed and colleagues, 2004) found that about 6.5 % of hospital admissions were caused by adverse drug reactions, most of them type A and a large share avoidable; low-dose aspirin, diuretics, anticoagulants and NSAIDs led the list. Comparing an adverse outcome between treated and untreated groups gives the **number needed to harm**, $\\text{NNH} = 1/(p_T - p_C)$, the mirror image of the number needed to treat.

### Did the drug do it? Causality
For one patient, assessors weigh the **timing** (did the reaction follow the drug in a plausible time?), **dechallenge** (did it improve when the drug was stopped?), **rechallenge** (did it return — rarely tested deliberately), alternative causes and known pharmacology. Structured tools such as the Naranjo scale (1981) and the WHO-UMC categories (certain, probable, possible, unlikely) grade the answer. Across a population, the **attributable fraction** $(RR - 1)/RR$ says what share of cases among exposed people the drug accounts for.

### Allergy labels
Around one person in ten carries a penicillin-allergy label, yet when tested, well over 90 % of them turn out not to be allergic. An inaccurate label matters: alternatives are often broader-spectrum, more toxic or less effective. Formal allergy assessment can remove it — a decision for specialists.

> [!warn] Swelling of the face, lips or tongue, difficulty breathing, wheeze, or faintness soon after a medicine may be anaphylaxis: call your local emergency number at once, and use an adrenaline auto-injector if one has been prescribed. A spreading rash with blisters, peeling skin or sores in the mouth or eyes after starting a medicine also needs urgent medical care.
`,
  ideas: [
    'An ADR is harmful and caused by the medicine; an adverse event need not be caused by it.',
    'Type A reactions are dose-related extensions of pharmacology — common and often preventable.',
    'Type B reactions are unpredictable, often immune, rare and potentially severe.',
    'Standard frequency words run from very common (≥ 1/10) to very rare (< 1/10 000).',
    'NNH = 1/(pT − pC) expresses harm the way NNT expresses benefit.'
  ],
  pitfalls: [
    'Every adverse event in a trial is a side effect of the drug — Adverse events are recorded whatever the cause; only the comparison with the control group shows which are caused by the drug.',
    'Allergic reactions depend on the dose — Type B immune reactions can follow tiny doses; it is type A reactions that scale with dose.',
    'A reported penicillin allergy is almost always real — Most labelled people are not allergic when properly tested; assessment by specialists can remove inaccurate labels.'
  ],
  formulas: [
    {
      name: 'Number needed to harm',
      expr: 'NNH = 1/(pT - pC)', tex: '\\text{NNH} = \\frac{1}{p_T - p_C}',
      vars: {
        NNH: { name: 'number needed to harm', tex: '\\text{NNH}' },
        pT: { name: 'risk of the harm with the medicine', q: 'ratio', unit: '%', value: 3, min: 0, max: 100, tex: 'p_T' },
        pC: { name: 'risk without it (control)', q: 'ratio', unit: '%', value: 1, min: 0, max: 100, tex: 'p_C' }
      },
      note: 'Over the same period as the risks were measured.',
      stories: { NNH: 'In a trial, {pT} of treated patients and {pC} of controls had a bleed. How many patients must be treated for one extra bleed?', pT: 'A medicine has an NNH of {NNH} for a side effect that affects {pC} of untreated people. How common is it in treated people?' }
    },
    {
      name: 'Attributable fraction among the exposed',
      expr: 'AF = (RR - 1)/RR', tex: '\\text{AF} = \\frac{\\text{RR} - 1}{\\text{RR}}',
      vars: {
        AF: { name: 'share of cases in exposed people caused by the drug', q: 'ratio', unit: '%', tex: '\\text{AF}' },
        RR: { name: 'relative risk with the drug', value: 3, tex: '\\text{RR}' }
      },
      stories: { AF: 'People taking a medicine have {RR} times the risk of an event. Among those who take it and have the event, what share is caused by the medicine?' }
    }
  ],
  examples: [
    {
      title: 'Number needed to harm',
      q: 'In a trial, 3 % of patients on a hypothetical anticoagulant and 1 % on placebo had a major bleed over a year. What is the NNH, and what share of the bleeds in treated patients did the drug cause?',
      steps: [
        'NNH = $1/(0.03 - 0.01) = 50$: one extra bleed per 50 patients treated for a year.',
        'Relative risk = 3, so the attributable fraction = $(3 - 1)/3$ = 67 %.',
        'Whether that is acceptable depends on the benefit: how many strokes it prevents (the NNT) over the same year.'
      ],
      a: 'NNH = 50; two-thirds of bleeds in treated patients are due to the drug.'
    },
    {
      title: 'Naming a frequency',
      q: 'A reaction occurred in 1 of 2500 patients. Which frequency word describes it in product information?',
      steps: [
        '1/2500 = 0.0004, between 1/10 000 and 1/1000.',
        'That band is "rare".'
      ],
      a: 'Rare (≥ 1/10 000 to < 1/1000).'
    }
  ],
  quiz: [
    { q: 'Bleeding with an anticoagulant is an example of which type of reaction?', choices: ['type A (augmented)', 'type B (bizarre)', 'type D (delayed)', 'type F (failure)'], a: 0, why: 'It is an exaggeration of the drug\'s intended effect and depends on dose and level.' },
    { q: 'Every adverse event recorded in a trial was caused by the medicine.', a: false, why: 'Adverse events include anything that happens; comparison with the control group shows which ones the medicine causes.' },
    { q: 'A side effect occurs in 1 of 400 patients. Which frequency category is that?', choices: ['very common', 'common', 'uncommon', 'rare'], a: 2, why: '1/400 = 0.25 %, between 1/1000 and 1/100: uncommon.' },
    { q: 'A side effect affects 12 % of treated patients and 4 % of controls. What is the number needed to harm?', answer: 12.5, why: 'NNH = 1/(0.12 − 0.04) = 12.5.' },
    { q: 'Which is typical of type B reactions?', choices: ['they are the commonest kind', 'they rise steadily with dose', 'they are often immune-mediated and not predictable from the pharmacology', 'they only happen at overdose'], a: 2, why: 'Type B reactions are idiosyncratic or immune, rare, and can follow ordinary or small doses.' }
  ],
  problems: [
    { q: 'A medicine triples the risk of an event. What percentage of cases among people taking it is attributable to the medicine?', answer: 66.7, unit: '%', tol: 0.02, steps: ['$\\text{AF} = (3 - 1)/3 = 0.667$.'] }
  ],
  applications: ['Writing and reading the side-effect sections of product information.', 'Medication reviews that look for type A reactions in older people with many medicines.', 'Allergy assessment services that remove inaccurate penicillin-allergy labels.'],
  history: 'The WHO defined an adverse drug reaction in 1972. Michael Rawlins and John Thompson proposed the type A/type B classification in 1977, and Ralph Edwards and Jeffrey Aronson extended it in 2000. The Liverpool study of 18 820 admissions by Munir Pirmohamed and colleagues (BMJ, 2004) put a number on the burden in hospitals.',
  sim: { id: 'pd-signal', params: { inc: 2500 } }
},

{
  id: 'medication-errors', parent: 'safety-topic', title: 'Medication errors', level: 1,
  short: 'A medication error is a preventable failure in prescribing, dispensing, giving or monitoring a medicine. Most arise from systems — similar names and packs, ambiguous notation, interruptions — so the most effective defences are designed into the system: electronic prescribing, barcodes, smart pumps and independent checks.',
  keywords: ['medication error', 'patient safety', 'look-alike sound-alike', 'tenfold error', 'decimal point', 'trailing zero', 'high-alert medications', 'double check', 'Swiss cheese model', 'just culture', 'barcode', 'electronic prescribing', 'smart pump', 'medication reconciliation', 'never event'],
  prereq: ['units-pharmacy', 'dose-calculations', 'adverse-reactions'],
  related: ['pharmacovigilance', 'infusion-rates', 'drug-names', 'falsified-medicines', 'paediatric-geriatric'],
  body: `
A **medication error** is any preventable event that may cause or lead to inappropriate use of a medicine or harm to a patient while the medicine is in the control of a professional or the patient. Errors can happen at every step — prescribing, transcribing, dispensing, preparing, administering and monitoring — and most do no harm, because they are caught or turn out to be harmless. Those that do cause harm are *preventable adverse drug events*. The WHO estimated in 2017 that medication errors cost about 42 billion US dollars a year worldwide, and launched the Global Patient Safety Challenge "Medication Without Harm".

### Why errors happen
People make slips and lapses at a steady rate, especially when tired, interrupted or rushed; the question is whether the system catches them. Typical traps:
- **Look-alike, sound-alike** names and packs: two drugs whose names differ by a few letters, or strengths in near-identical boxes. *Tall Man lettering* (hydrOXYzine, hydrALAZINE) highlights the difference.
- **Ambiguous notation**: a **trailing zero** ("5.0 mg" read as 50 mg) and a **naked decimal point** (".5 mg" read as 5 mg) each cause **tenfold** errors; "U" for units has been read as a zero; "µg" can be misread as "mg" — a thousandfold error. Standard advice: write "0.5 mg", "5 mg", "units" and "micrograms" in full.
- **Calculations**: doses per kilogram, dilutions and infusion rates — especially in children, where doses vary a hundredfold with size (see [[dose-calculations]] and [[infusion-rates]]).
- **Wrong route** and **wrong patient**: some drugs are lethal by the wrong route, which is why oral syringes that cannot connect to intravenous lines exist.
- **Transitions of care**: medicines lost, doubled or changed when a patient moves between hospital and home — the reason for **medication reconciliation**.

**High-alert medications** are those whose errors are most likely to harm: insulin, anticoagulants, opioids, concentrated potassium chloride, chemotherapy, neuromuscular blockers. Once-weekly medicines taken daily by mistake — oral methotrexate is the classic example — have caused deaths.

### The Swiss cheese model
James Reason pictured a system's defences as slices of cheese, each with holes; harm happens when holes line up. If an error starts with probability $p_e$ and each of $k$ independent checks catches a fraction $d$, the share that reaches the patient is

$$p_\\text{harm} = p_e\\,(1 - d)^k$$

With one error in 200 doses, two checks that each catch 70 % still let 1350 errors a year through in a hospital giving three million doses. The multiplication only works if the checks are truly **independent** — a second person who glances at the first person's calculation catches far less.

### Defences that work
- **Electronic prescribing** with decision support (dose limits, allergy and interaction checks); studies from the late 1990s found large falls in serious prescribing errors.
- **Barcode scanning** of patient wristband and medicine at the bedside.
- **Smart infusion pumps** with drug libraries and hard limits.
- **Standard concentrations**, ready-to-use products, and removing concentrated potassium from general wards.
- **Pharmacist review**, independent double checks for high-alert medicines, and patients who know their medicines and ask.
- A **just culture**: reporting errors and near misses without blame, so that the system can learn — the same logic as [[pharmacovigilance]].

> [!warn] If you think you or someone else has been given the wrong medicine or the wrong dose, contact the prescriber or a pharmacist straight away; if the person is unwell, call your local emergency number or a poison information centre. Report it — it helps prevent the next one.
`,
  ideas: [
    'Medication errors are preventable failures anywhere from prescribing to monitoring; most cause no harm.',
    'Most errors come from systems: look-alike names, ambiguous notation, calculations, transitions of care.',
    'Trailing zeros and naked decimal points cause tenfold errors; "µg" read as "mg" a thousandfold one.',
    'Independent checks multiply: p_harm = p_e (1 − d)^k — but only if they are truly independent.',
    'Electronic prescribing, barcodes, smart pumps and a just reporting culture prevent errors best.'
  ],
  pitfalls: [
    'Medication errors are caused by careless individuals — Everyone makes slips at some rate; errors that reach patients reflect systems that failed to catch them, which is where prevention works.',
    'A second check always halves the risk — Only if it is independent; a check that confirms the first person\'s work rather than redoing it catches much less.',
    'Writing "5.0 mg" is more precise — The trailing zero can be misread as 50 mg; the safe forms are "5 mg" and "0.5 mg".'
  ],
  formulas: [
    {
      name: 'Errors that get through independent checks',
      expr: 'Nh = N*pe*(1 - d)^k', tex: 'N_h = N\\,p_e\\,(1 - d)^{k}',
      vars: {
        Nh: { name: 'errors reaching patients per year', tex: 'N_h' },
        N: { name: 'doses given per year', value: 3000000 },
        pe: { name: 'error rate per dose before checks', q: 'ratio', unit: '%', value: 0.5, min: 0, max: 100, tex: 'p_e' },
        d: { name: 'share caught by each check', q: 'ratio', unit: '%', value: 70, min: 0, max: 100 },
        k: { name: 'number of independent checks', value: 2, int: true }
      },
      note: 'Assumes every check is independent of the others and equally good — rarely quite true.',
      practice: { unknowns: ['Nh', 'k'] },
      stories: { Nh: 'A hospital gives {N} doses a year; errors start in {pe} of them, and each of {k} independent checks catches {d}. How many errors reach patients?', k: 'How many independent checks, each catching {d}, would bring the errors reaching patients to {Nh} a year from {N} doses with an initial error rate of {pe}?' }
    },
    {
      name: 'Volume to measure for a dose',
      expr: 'V = D/S', tex: 'V = \\frac{D}{S}',
      vars: {
        V: { name: 'volume to give', q: false, unit: 'mL' },
        D: { name: 'dose prescribed', q: false, unit: 'mg', value: 7.5 },
        S: { name: 'strength of the preparation', q: false, unit: 'mg/mL', value: 2.5 }
      },
      note: 'Check that the units of dose and strength match (mg with mg/mL, not micrograms). Real preparation follows the product information and an independent check.',
      stories: { V: 'A hypothetical oral solution contains {S}. What volume holds a dose of {D}?', D: 'A volume of {V} of a {S} solution was given. What dose was that?' }
    }
  ],
  examples: [
    {
      title: 'The Swiss cheese in numbers',
      q: 'A hospital gives 3 million doses a year. Suppose errors start in 1 of every 200 doses and each independent check catches 70 % of them. How many reach patients with one, two and three checks?',
      steps: [
        'Errors started: $3\\times10^6 \\times 0.005$ = 15 000.',
        'One check: $15\\,000 \\times 0.3$ = 4500. Two: × 0.3 again = 1350. Three: 405.',
        'Each independent layer removes most of what is left — which is why barcode scanning at the bedside, a check that does not depend on the people upstream, adds so much.'
      ],
      a: '4500, 1350 and 405 errors a year (hypothetical numbers).'
    },
    {
      title: 'A tenfold error',
      q: 'A prescription for a hypothetical injection reads ".5 mg"; the solution contains 0.5 mg/mL. What volume should be given, and what happens if the dose is read as 5 mg?',
      steps: [
        'Intended: $V = 0.5/0.5 = 1$ mL.',
        'Misread as 5 mg: $V = 5/0.5 = 10$ mL — ten times the dose.',
        'Written as "0.5 mg", with a leading zero, the decimal point cannot be missed.'
      ],
      a: '1 mL intended; the misreading gives 10 mL, a tenfold overdose.'
    }
  ],
  quiz: [
    { q: 'Which way of writing a dose invites a tenfold overdose?', choices: ['0.5 mg', '5 mg', '5.0 mg', '500 micrograms'], a: 2, why: 'A trailing zero can hide the decimal point, turning 5.0 mg into 50 mg.' },
    { q: 'Most medication errors are best prevented by finding and disciplining the person who made them.', a: false, why: 'Blame discourages reporting; errors are prevented by redesigning the system and by a just culture that learns from reports.' },
    { q: 'Two independent checks each catch 80 % of errors. What percentage of errors gets through both?', answer: 4, unit: '%', why: '0.2 × 0.2 = 0.04 = 4 %.' },
    { q: 'Which is a high-alert medication?', choices: ['a vitamin tablet', 'insulin', 'a moisturising cream', 'a throat lozenge'], a: 1, why: 'Errors with insulin — for example in units — can cause severe hypoglycaemia; it is on every high-alert list.' },
    { q: 'A dose of 250 micrograms is misread as 250 mg. By what factor is the dose wrong?', answer: 1000, why: '1 mg = 1000 micrograms, so the dose is a thousand times too high.' }
  ],
  problems: [
    { q: 'An oral solution contains 125 mg in 5 mL. What volume (mL) holds a dose of 200 mg of this hypothetical medicine?', answer: 8, unit: 'mL', tol: 0.02, steps: ['Strength: $125/5 = 25$ mg/mL.', '$V = 200/25 = 8$ mL.'] }
  ],
  applications: ['Electronic prescribing, barcode administration and smart pumps in hospitals.', 'National error-reporting and learning systems.', 'Medication reconciliation when patients move between care settings.'],
  history: 'The US Institute of Medicine report "To Err Is Human" (1999) estimated that tens of thousands of hospital deaths a year in the United States were caused by medical errors, putting patient safety on the agenda. James Reason\'s Swiss cheese model (1990) shaped how errors are analysed. The WHO launched "Medication Without Harm" in 2017, aiming to halve severe avoidable medication-related harm.'
},

{
  id: 'clinical-trials', parent: 'safety-topic', title: 'Clinical trials', level: 2,
  short: 'Clinical trials test medicines in people, in phases from first-in-human safety studies to large randomised trials that confirm benefit and measure harm. Randomisation, blinding and a sample size large enough to detect the effect make their answers trustworthy.',
  keywords: ['clinical trial', 'phase I', 'phase II', 'phase III', 'phase IV', 'randomisation', 'blinding', 'placebo', 'sample size', 'power', 'endpoint', 'surrogate endpoint', 'non-inferiority', 'intention to treat', 'good clinical practice', 'informed consent', 'first-in-human', 'MABEL', 'NNT'],
  prereq: ['drug-development', 'medicine:clinical-trials', 'math:hypothesis-testing'],
  related: ['regulation-approval', 'pharmacovigilance', 'adverse-reactions', 'bioequivalence', 'medicine:evidence-based-medicine', 'medicine:risk-communication'],
  body: `
A medicine is only as good as the evidence behind it, and that evidence comes from **clinical trials**: planned experiments in people. Their design exists to answer one question without fooling ourselves — does this treatment, rather than chance, hope or the natural course of the illness, make people better, and at what cost in harm?

### The phases
| Phase | Who | How many | Main questions |
|---|---|---|---|
| I | healthy volunteers (patients, for cancer medicines) | 20–100 | safety, tolerability, pharmacokinetics, dose range |
| II | patients | 100–300 | does it work? which dose? |
| III | patients, randomised | 1000–several thousand | confirm benefit and harms against placebo or standard care |
| IV | patients in practice | thousands to millions | long-term and rare harms, new uses |

Roughly one medicine in ten that enters phase I is eventually approved; most failures come from insufficient efficacy in phase II or III, or from safety.

**First-in-human** studies start low. In 2006 six volunteers in London developed a life-threatening cytokine storm after an immune-stimulating antibody was given to all of them within minutes, at a dose expected to occupy most of its target receptors. Since then first doses of high-risk medicines have been based on the *minimal anticipated biological effect level* — often a low predicted receptor occupancy (see [[receptors]]) — and given to one "sentinel" participant before the rest.

### Why randomise, blind and control?
- **A control group** shows what happens without the treatment: many illnesses improve on their own, and people treated with anything tend to feel better (the placebo response).
- **Randomisation** makes the groups alike in everything, known and unknown, except the treatment — so a difference in outcome can be attributed to it. **Allocation concealment** stops anyone choosing who goes where.
- **Blinding** (masking) of patients, clinicians and assessors stops expectations colouring what is reported.
- **Intention-to-treat** analysis compares the groups as randomised, keeping the balance randomisation created.

### Endpoints
The primary endpoint is chosen in advance: survival, strokes, fractures — or a **surrogate** such as blood pressure, cholesterol, viral load or tumour shrinkage, which is quicker to measure. Surrogates can mislead. In the Cardiac Arrhythmia Suppression Trial (1989), two antiarrhythmic drugs suppressed irregular beats on the ECG exactly as intended — and increased deaths, so the trial was stopped early.

### How many patients?
A trial must be large enough to detect the effect it seeks. For a comparison of two event rates $p_1$ and $p_2$, with a 5 % two-sided significance level and 80 % power, each group needs about

$$n = \\frac{(z_{\\alpha/2} + z_\\beta)^2\\,[p_1(1 - p_1) + p_2(1 - p_2)]}{(p_1 - p_2)^2}, \\qquad z_{\\alpha/2} = 1.96,\\; z_\\beta = 0.84$$

Detecting a fall from 10 % to 7 % needs about 1350 patients per group; halving the difference to be detected roughly quadruples the size. A trial that is too small can miss a real effect, and a "non-significant" result from it is not evidence of no effect. Results are best read as effect sizes with confidence intervals — and as absolute terms, such as the **number needed to treat** $1/(\\text{CER} - \\text{EER})$ (see [[medicine:risk-communication|relative and absolute risk]]).

**Non-inferiority** trials ask whether a new treatment is not worse than the standard by more than a pre-set margin — useful when it is cheaper, safer or easier to take.

### Ethics and rules
Trials follow the Declaration of Helsinki (first adopted in 1964, revised several times since) and Good Clinical Practice — the ICH E6 guideline, whose third revision was finalised in 2025 at the time of writing. Participants give informed consent and can leave at any time; independent ethics committees approve the protocol; data monitoring committees watch the accumulating results and can stop a trial for benefit, harm or futility. Since 2005 leading journals have required trials to be registered before they start, so that negative results cannot quietly disappear.

> [!note] Taking part in a trial is a personal decision, best discussed with the trial team and your own doctor. Registered trials can be found in public registries.
`,
  ideas: [
    'Phase I tests safety and pharmacokinetics, phase II dose and early efficacy, phase III confirms benefit and harms, phase IV watches practice.',
    'Randomisation balances known and unknown factors; blinding stops expectations biasing results; controls show what happens anyway.',
    'Surrogate endpoints are quick but can mislead, as the CAST trial showed.',
    'Sample size scales with 1/(difference)²: halving the effect to detect needs about four times the patients.',
    'Report effects with confidence intervals and absolute measures such as NNT.'
  ],
  pitfalls: [
    'A non-significant result shows the treatment does not work — A small trial may simply lack the power to detect a real effect; the confidence interval shows what effects are still compatible with the data.',
    'Improving a surrogate marker always improves outcomes — Drugs have lowered markers while raising deaths; outcome trials are the test.',
    'Phase I trials show whether a drug works — They are mostly about safety, tolerability and pharmacokinetics in small groups; efficacy comes from larger, controlled trials.'
  ],
  formulas: [
    {
      name: 'Sample size per group: two proportions',
      expr: 'n = (za + zb)^2*(p1*(1 - p1) + p2*(1 - p2))/(p1 - p2)^2', tex: 'n = \\frac{(z_{\\alpha/2} + z_\\beta)^2\\,[p_1(1 - p_1) + p_2(1 - p_2)]}{(p_1 - p_2)^2}',
      vars: {
        n: { name: 'patients needed in each group' },
        za: { name: 'z for the two-sided significance level (1.96 for 5 %)', value: 1.96, fixed: true, tex: 'z_{\\alpha/2}' },
        zb: { name: 'z for the power (0.84 for 80 %, 1.28 for 90 %)', value: 0.8416, fixed: true, tex: 'z_\\beta' },
        p1: { name: 'event rate in the control group', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: 'p_1' },
        p2: { name: 'event rate expected with treatment', q: 'ratio', unit: '%', value: 7, min: 0, max: 100, tex: 'p_2' }
      },
      note: 'A normal approximation for comparing two proportions; add allowance for drop-outs.',
      practice: { unknowns: ['n'] },
      stories: { n: 'A trial will compare an event rate of {p1} on standard care with an expected {p2} on a new medicine, at 5 % significance and 80 % power. How many patients are needed per group?' }
    },
    {
      name: 'Number needed to treat',
      expr: 'NNT = 1/(CER - EER)', tex: '\\text{NNT} = \\frac{1}{\\text{CER} - \\text{EER}}',
      vars: {
        NNT: { name: 'number needed to treat', tex: '\\text{NNT}' },
        CER: { name: 'event rate in the control group', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: '\\text{CER}' },
        EER: { name: 'event rate in the treated group', q: 'ratio', unit: '%', value: 7, min: 0, max: 100, tex: '\\text{EER}' }
      },
      note: 'Over the duration of the trial; state the period with the NNT.',
      stories: { NNT: 'In a trial, {CER} of control patients and {EER} of treated patients had a stroke. How many must be treated to prevent one?', EER: 'A treatment has an NNT of {NNT} against a control event rate of {CER}. What is the event rate with treatment?' }
    },
    {
      name: 'Relative risk reduction',
      expr: 'RRR = 1 - EER/CER', tex: '\\text{RRR} = 1 - \\frac{\\text{EER}}{\\text{CER}}',
      vars: {
        RRR: { name: 'relative risk reduction', q: 'ratio', unit: '%', tex: '\\text{RRR}' },
        EER: { name: 'event rate with treatment', q: 'ratio', unit: '%', value: 7, min: 0, max: 100, tex: '\\text{EER}' },
        CER: { name: 'event rate in controls', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: '\\text{CER}' }
      },
      stories: { RRR: 'A treatment lowers an event rate from {CER} to {EER}. What is the relative risk reduction?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a trial',
      q: 'A standard treatment leaves a 10 % event rate; a new medicine is hoped to lower it to 7 %. How many patients are needed for 80 % power at 5 % significance? And to detect 10 % against 8.5 %?',
      steps: [
        '$(1.96 + 0.84)^2 = 7.85$; $p_1(1 - p_1) + p_2(1 - p_2) = 0.090 + 0.065 = 0.155$; $(p_1 - p_2)^2 = 0.0009$.',
        '$n = 7.85 \\times 0.155/0.0009 = 1353$ per group — about 2700 in all, plus allowance for drop-outs.',
        'For 10 % against 8.5 %: $n = 7.85 \\times 0.168/0.000225 = 5850$ per group. Half the difference, over four times the patients.'
      ],
      a: 'About 1350 per group; about 5850 per group for the smaller effect.'
    },
    {
      title: 'Relative and absolute',
      q: 'The trial finds event rates of 10 % with the standard and 7 % with the new medicine over three years. Express the result three ways.',
      steps: [
        'Relative risk reduction: $1 - 7/10 = 30$ %.',
        'Absolute risk reduction: $10 - 7 = 3$ percentage points.',
        'NNT = $1/0.03 = 33$: 33 people treated for three years to prevent one event.'
      ],
      a: '30 % relative reduction, 3 points absolute, NNT of 33 over three years.'
    }
  ],
  quiz: [
    { q: 'The main purpose of randomisation is to…', choices: ['make the trial larger', 'balance known and unknown factors between the groups', 'keep patients unaware of their treatment', 'ensure everyone gets the new treatment'], a: 1, why: 'Random allocation makes the groups comparable in everything but the treatment; blinding is a separate safeguard.' },
    { q: 'Phase I trials are designed mainly to prove that a medicine works.', a: false, why: 'Phase I studies are small and focus on safety, tolerability, pharmacokinetics and dose range.' },
    { q: 'If the difference to be detected is halved, the required sample size becomes roughly…', choices: ['half', 'the same', 'twice as large', 'four times as large'], a: 3, why: 'n scales with 1/(p₁ − p₂)², so halving the difference roughly quadruples n.' },
    { q: 'Event rates are 20 % with control and 15 % with treatment. What is the NNT?', answer: 20, why: 'NNT = 1/(0.20 − 0.15) = 20.' },
    { q: 'In the CAST trial, antiarrhythmic drugs that suppressed irregular heartbeats…', choices: ['reduced deaths as expected', 'increased deaths', 'had no measurable effect on the ECG', 'were approved for all patients'], a: 1, why: 'The surrogate improved but mortality rose — a lesson about surrogate endpoints.' }
  ],
  problems: [
    { q: 'How many patients per group are needed to detect a fall in event rate from 30 % to 20 % at 5 % significance and 80 % power?', answer: 290, tol: 0.03, steps: ['$(1.96 + 0.84)^2 = 7.85$.', '$0.3 \\times 0.7 + 0.2 \\times 0.8 = 0.37$; $(0.1)^2 = 0.01$.', '$n = 7.85 \\times 0.37/0.01 = 290$ per group.'] }
  ],
  applications: ['Regulatory approval, which rests mainly on phase III randomised trials.', 'Guidelines and health-technology assessments that weigh NNT, NNH and costs.', 'Platform trials that test several treatments at once, as during the COVID-19 pandemic.'],
  history: 'James Lind compared six remedies for scurvy on a ship in 1747, and the British Medical Research Council\'s streptomycin trial of 1948 is usually counted as the first properly randomised trial. The Nuremberg Code (1947) and the Declaration of Helsinki (1964) set out the ethics of research on people. In 2020 the RECOVERY platform trial showed within months that dexamethasone reduced deaths among people with COVID-19 who needed oxygen.',
  sim: { id: 'pd-signal', params: { inc: 10000 } }
},

{
  id: 'antimicrobial-stewardship', parent: 'safety-topic', title: 'Antimicrobial stewardship', level: 2,
  short: 'Antimicrobial stewardship means using antibiotics so that they work for the patient and keep working for everyone: the right drug, dose, route and duration, guided by PK/PD targets against the MIC, and no antibiotic where none is needed.',
  keywords: ['antimicrobial stewardship', 'antibiotic resistance', 'MIC', 'PK/PD index', 'time above MIC', 'AUC/MIC', 'Cmax/MIC', 'mutant selection window', 'mutant prevention concentration', 'de-escalation', 'AWaRe', 'course length', 'selection pressure', 'prolonged infusion'],
  prereq: ['pkpd', 'antimicrobials', 'biology:antibiotic-resistance'],
  related: ['clinical-trials', 'tdm', 'adverse-reactions', 'medicine:antimicrobial-resistance', 'medicine:antibiotics', 'biology:bacterial-growth'],
  body: `
Antibiotics are unusual medicines: using them in one person changes how well they work for everyone else. Every course selects bacteria that survive it — not only at the infection, but among the trillions living in the gut — and resistant bacteria and their genes spread between people, animals and the environment. A major analysis estimated that in 2019 bacterial antimicrobial resistance directly caused about 1.27 million deaths worldwide and was associated with nearly 5 million (see [[medicine:antimicrobial-resistance|antimicrobial resistance]]). **Stewardship** is the coordinated effort to use antimicrobials well: to cure the patient, limit harm and slow resistance.

### Dosing against the MIC
The **minimum inhibitory concentration** (MIC) is the lowest concentration that stops visible growth of a bacterium in a standard laboratory test. It is the yardstick for dosing. Different antibiotic families kill in different ways, so each has its own **PK/PD index**, the measure of exposure that best predicts success (see [[pkpd]]):

| Killing pattern | Index | Typical target | Examples |
|---|---|---|---|
| time-dependent | $fT_{>\\text{MIC}}$, % of the dosing interval the free level stays above the MIC | about 40–70 % | β-lactams (penicillins, cephalosporins, carbapenems) |
| concentration-dependent | $fC_\\text{max}/\\text{MIC}$ | about 8–10 | aminoglycosides |
| exposure-dependent | $f\\text{AUC}_{24}/\\text{MIC}$ | about 100–125 for fluoroquinolones against Gram-negatives; AUC/MIC 400–600 for vancomycin | fluoroquinolones, glycopeptides |

Targets vary with the drug, the organism, the infection and the guideline. For a drug given by repeated bolus the time above the MIC is

$$fT_{>\\text{MIC}} = \\frac{t_{1/2}\\log_2(f_u C_\\text{max}/\\text{MIC})}{\\tau}$$

which shows why time-dependent drugs are given often, or by **prolonged or continuous infusion**, while concentration-dependent aminoglycosides are given once daily as a high peak. Too low an exposure fails the patient and selects resistance; too high a one adds toxicity, which is why aminoglycosides and vancomycin are often monitored by level (see [[tdm]]).

Growth and killing meet at the **stasis concentration**: with growth rate $k_g$ and an Emax killing term, bacteria neither grow nor die when $k_\\text{max}C^n/(\\text{EC}_{50}^n + C^n) = k_g$. Between the MIC and the **mutant prevention concentration** (MPC) — the level that also stops the rare first-step mutants — lies the **mutant selection window**, where susceptible bacteria die and resistant ones are enriched. Dosing that passes quickly through the window, or stays above it, selects resistance less.

### The stewardship toolkit
- **Diagnose first**: most sore throats, colds and bronchitis are viral, and antibiotics do not help them. Take cultures before starting treatment where possible; rapid tests help.
- **Start smart, then focus**: begin with a suitable empirical antibiotic for a serious infection, then review at 48–72 hours — stop, switch to a **narrower** agent once the organism and its susceptibilities are known (*de-escalation*), or change from intravenous to oral.
- **Duration**: trials for many common infections have found shorter courses as effective as longer ones; the length is set by the prescriber from the evidence.
- **Formulary tools**: the WHO AWaRe classification (2017, updated since) sorts antibiotics into **Access** (first choices for common infections), **Watch** (higher resistance potential) and **Reserve** (last resort), with a global target that most use should come from the Access group.
- **Allergy review**: removing inaccurate penicillin-allergy labels restores first-line options (see [[adverse-reactions]]).
- **One Health**: reducing antibiotic use in farm animals, and surveillance of resistance everywhere.

> [!warn] Sepsis — infection with signs such as confusion, fast breathing, a racing heart, very low or high temperature, mottled or bluish skin, or not passing urine — is a medical emergency: call your local emergency number. For everyday use, public-health advice is to take antibiotics only when prescribed, as prescribed, and never to save or share them; ask the prescriber before stopping or changing a course.
`,
  ideas: [
    'Every antibiotic course selects resistant bacteria, in the patient and in the community.',
    'The MIC is the yardstick; each family has a PK/PD index: fT>MIC, fCmax/MIC or fAUC24/MIC.',
    'fT>MIC = t½ log₂(fu Cmax/MIC)/τ: frequent dosing or prolonged infusion for time-dependent drugs.',
    'The mutant selection window lies between the MIC and the mutant prevention concentration.',
    'Stewardship: diagnose, start smart, review and de-escalate, use the shortest effective course, follow AWaRe.'
  ],
  pitfalls: [
    'A stronger or broader antibiotic is always safer — Broad-spectrum agents select more resistance and cause more side effects such as C. difficile infection; the narrowest effective drug is usually best.',
    'Antibiotics help colds and most sore throats — These are mostly viral; antibiotics do not shorten them and still cause side effects and resistance.',
    'The dose only needs to reach the MIC once — Each family needs a particular exposure pattern: time above the MIC, a high peak or enough AUC; a regimen that just grazes the MIC can select resistant mutants.'
  ],
  formulas: [
    {
      name: 'Time above the MIC (repeated bolus)',
      expr: 'fT = th*log2(fu*Cmax/MIC)/tau', tex: '{fT}_{>\\text{MIC}} = \\frac{t_{1/2}\\log_2(f_u C_\\text{max}/\\text{MIC})}{\\tau}',
      vars: {
        fT: { name: 'share of the dosing interval with free level above the MIC', q: 'ratio', unit: '%', tex: '{fT}_{>\\text{MIC}}' },
        th: { name: 'elimination half-life', q: 'time', unit: 'h', value: 1.5, tex: 't_{1/2}' },
        fu: { name: 'unbound fraction', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: 'f_u' },
        Cmax: { name: 'peak total concentration', q: 'massconc', unit: 'mg/L', value: 40, tex: 'C_\\text{max}' },
        MIC: { name: 'minimum inhibitory concentration', q: 'massconc', unit: 'mg/L', value: 2, tex: '\\text{MIC}' },
        tau: { name: 'dosing interval', q: 'time', unit: 'h', value: 8, tex: '\\tau' }
      },
      note: 'One-compartment kinetics after rapid IV doses; valid while the result is between 0 and 100 % (the free peak must exceed the MIC).',
      practice: { unknowns: ['fT', 'tau'] },
      stories: { fT: 'A hypothetical β-lactam has a half-life of {th}, is {fu} unbound and peaks at {Cmax}; it is given every {tau} against a bacterium with an MIC of {MIC}. For what share of the interval is the free level above the MIC?', tau: 'For what dosing interval does a drug (half-life {th}, {fu} unbound, peak {Cmax}) keep its free level above an MIC of {MIC} for {fT} of the time?' }
    },
    {
      name: 'AUC/MIC from the daily dose',
      expr: 'R = D24/(CL*MIC)', tex: 'R_\\text{AUC} = \\frac{D_{24}}{\\text{CL}\\cdot\\text{MIC}}',
      vars: {
        R: { name: 'AUC₂₄/MIC ratio (h)', tex: 'R_\\text{AUC}' },
        D24: { name: 'total daily dose', q: false, unit: 'mg', value: 2000, tex: 'D_{24}' },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 5, tex: '\\text{CL}' },
        MIC: { name: 'minimum inhibitory concentration', q: false, unit: 'mg/L', value: 1, tex: '\\text{MIC}' }
      },
      note: 'AUC₂₄ = D₂₄/CL at steady state (mg·h/L). Multiply by the unbound fraction for fAUC/MIC. A hypothetical drug: real dosing follows the product information and local protocols.',
      stories: { R: 'A hypothetical antibiotic is given at {D24} a day to a patient whose clearance is {CL}; the bacterium\'s MIC is {MIC}. What is the AUC₂₄/MIC?' }
    },
    {
      name: 'Stasis concentration (growth = kill)',
      expr: 'Cs = EC50*(kg/(kmax - kg))^(1/n)', tex: 'C_s = \\text{EC}_{50}\\left(\\frac{k_g}{k_\\text{max} - k_g}\\right)^{1/n}',
      vars: {
        Cs: { name: 'concentration at which the population neither grows nor shrinks', q: 'massconc', unit: 'mg/L', tex: 'C_s' },
        EC50: { name: 'concentration for half-maximal killing', q: 'massconc', unit: 'mg/L', value: 1, tex: '\\text{EC}_{50}' },
        kg: { name: 'bacterial growth rate constant', q: 'rate', unit: '1/h', value: 1, tex: 'k_g' },
        kmax: { name: 'maximal kill rate constant', q: 'rate', unit: '1/h', value: 3, tex: 'k_\\text{max}' },
        n: { name: 'Hill coefficient of killing', value: 2 }
      },
      note: 'From dN/dt = [k_g − k_max Cⁿ/(EC₅₀ⁿ + Cⁿ)] N. Requires k_max > k_g; the MIC is close to this concentration.',
      stories: { Cs: 'Bacteria grow with k_g = {kg}; an antibiotic kills with k_max = {kmax}, EC₅₀ = {EC50} and a Hill slope of {n}. At what concentration is the population static?' }
    }
  ],
  examples: [
    {
      title: 'Time above the MIC',
      q: 'A hypothetical β-lactam has a half-life of 1.5 h, is 80 % unbound and peaks at 40 mg/L. What is fT>MIC against an MIC of 2 mg/L when given every 8 h and every 12 h — and every 8 h against an MIC of 8 mg/L?',
      steps: [
        'Free peak: $0.8 \\times 40 = 32$ mg/L. Against MIC 2: $\\log_2 16 = 4$ half-lives, 6 h above the MIC.',
        'Every 8 h: 6/8 = 75 %. Every 12 h: 6/12 = 50 %.',
        'Against MIC 8: $\\log_2 4 = 2$ half-lives = 3 h; every 8 h gives 37.5 % — below a 40–50 % target. More frequent doses or a prolonged infusion would raise it.'
      ],
      a: '75 % (8-hourly) and 50 % (12-hourly) against MIC 2; only 37.5 % against MIC 8.'
    },
    {
      title: 'AUC/MIC',
      q: 'A hypothetical antibiotic is given at 2000 mg a day to a patient with a clearance of 5 L/h. What is the AUC₂₄/MIC for bacteria with MICs of 1 and 2 mg/L?',
      steps: [
        '$\\text{AUC}_{24} = 2000/5 = 400$ mg·h/L.',
        'MIC 1: ratio 400. MIC 2: ratio 200.',
        'If the target were 400, the less susceptible strain would need twice the exposure — often more than is safe, so a different antibiotic is chosen.'
      ],
      a: '400 and 200.'
    },
    {
      title: 'The stasis concentration',
      q: 'Bacteria grow with $k_g$ = 1 h⁻¹; an antibiotic kills with $k_\\text{max}$ = 3 h⁻¹, EC₅₀ = 1 mg/L and n = 2. At what concentration is the population static?',
      steps: [
        '$C_s = 1 \\times (1/(3 - 1))^{1/2} = 0.71$ mg/L.',
        'Below it the bacteria grow despite the drug; above it they die, faster the higher the level, up to the maximum kill rate.'
      ],
      a: 'About 0.71 mg/L.'
    }
  ],
  quiz: [
    { q: 'Which PK/PD index best predicts the effect of β-lactam antibiotics?', choices: ['Cmax/MIC', 'the time the free level stays above the MIC', 'the volume of distribution', 'the dose in mg/kg'], a: 1, why: 'β-lactams kill in a time-dependent way: what matters is how long the free concentration exceeds the MIC.' },
    { q: 'Antibiotics shorten the course of a common cold.', a: false, why: 'Colds are caused by viruses, which antibiotics do not affect; taking them only adds side effects and resistance.' },
    { q: 'A drug has a half-life of 2 h and a free peak eight times the MIC and is given every 12 h. What is fT>MIC (%)?', answer: 50, unit: '%', why: 't½ log₂ 8 = 2 × 3 = 6 h above the MIC out of 12 h = 50 %.' },
    { q: 'In the WHO AWaRe classification, the "Access" group is…', choices: ['antibiotics of last resort', 'first- and second-choice antibiotics for common infections, with lower resistance potential', 'antibiotics sold without prescription', 'antivirals'], a: 1, why: 'Access antibiotics are recommended first choices; Watch and Reserve are used more selectively.' },
    { q: 'The mutant selection window lies between…', choices: ['zero and the MIC', 'the MIC and the mutant prevention concentration', 'the peak and the trough', 'the toxic level and the lethal level'], a: 1, why: 'Between MIC and MPC, susceptible cells are inhibited while first-step resistant mutants can still grow — so they are enriched.' }
  ],
  problems: [
    { q: 'A hypothetical aminoglycoside peaks at 20 mg/L (free fraction about 100 %) against a bacterium with an MIC of 2 mg/L. What is Cmax/MIC, and does it reach a target of 8–10?', answer: 10, tol: 0.02, steps: ['$C_\\text{max}/\\text{MIC} = 20/2 = 10$.', 'Yes — at the upper end of the target range.'] },
    { q: 'A drug with a half-life of 1 h has a free peak of 16 mg/L. How long (h) does it stay above an MIC of 0.5 mg/L after one dose?', answer: 5, unit: 'h', tol: 0.02, steps: ['$\\log_2(16/0.5) = \\log_2 32 = 5$ half-lives.', '5 × 1 h = 5 h.'] }
  ],
  applications: ['Hospital stewardship teams that review antibiotic prescriptions, de-escalate and switch from IV to oral.', 'Prolonged or continuous infusions of β-lactams in critically ill patients to maximise time above the MIC.', 'National and WHO targets for the share of antibiotic use from the Access group.'],
  history: 'Alexander Fleming warned in his 1945 Nobel lecture that under-dosing penicillin would breed resistant bacteria. Harry Eagle showed in the 1940s and 1950s that penicillin\'s effect depends on time above a threshold rather than on peak level, and William Craig and others established the modern PK/PD indices in the 1980s and 1990s. The WHO adopted its Global Action Plan on antimicrobial resistance in 2015 and introduced the AWaRe classification in 2017.',
  sim: 'pd-mic'
}

);
