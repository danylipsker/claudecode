/* HYPER-PHARMACEUTICS · content/pk-basics.js
 * Pharmacokinetics — the basic parameters (topic pk-basics) and special situations (topic pk-special):
 * ADME, volume of distribution, clearance, half-life, AUC and Cmax, protein binding;
 * kidney impairment, hepatic clearance and extraction, therapeutic drug monitoring, children and older people.
 * Hyper Medicine has the clinical overview (medicine:pharmacokinetics, medicine:half-life-dosing); these pages
 * go into the pharmaceutical science: derivations, parameters and how they are estimated from data.
 * Every drug in the examples is hypothetical unless named as a well-known teaching example. */
Hyper.add(

{
  id: 'adme', parent: 'pk-basics', title: 'ADME', level: 1,
  short: 'Absorption, distribution, metabolism and excretion: the four processes that carry a dose through the body. Pharmacokinetics treats each one as a rate — usually first order — and the whole journey as a mass balance in which every milligram is accounted for.',
  keywords: ['ADME', 'LADME', 'liberation', 'absorption', 'distribution', 'metabolism', 'excretion', 'mass balance', 'fraction excreted unchanged', 'fe', 'renal clearance', 'non-renal clearance', 'phase I', 'phase II', 'cytochrome P450', 'glucuronidation', 'prodrug', 'active metabolite', 'tubular secretion', 'reabsorption'],
  prereq: ['medicine:pharmacokinetics', 'routes', 'membrane-transport-pharm'],
  related: ['volume-distribution', 'clearance', 'first-pass', 'bioavailability', 'hepatic-clearance', 'renal-adjustment', 'drug-interactions', 'pharmacogenomics'],
  body: `
A dose is a quantity of matter, and matter does not vanish. At every moment after a tablet is swallowed, its milligrams are somewhere: still in the gut, in the blood and tissues, turned into metabolites, or already in the urine or faeces. Pharmacokinetics writes that as a **mass balance**,

$$D = A_\\text{gut} + A_\\text{body} + A_\\text{met} + A_\\text{urine} + A_\\text{faeces}$$

and describes how fast material moves from one term to the next. The clinical tour of the four stages is in [[medicine:pharmacokinetics|Hyper Medicine]]; this page looks at them as rate processes.

### Five steps, each with a rate
Pharmaceutical scientists often write **LADME**: before a solid medicine can be absorbed it must be *liberated* — the tablet must break up and the drug dissolve ([[dissolution-rate]], [[modified-release]]).

| Step | What happens | Usual rate law | Typical time scale |
|---|---|---|---|
| Liberation | tablet disintegrates, drug dissolves | Noyes–Whitney, release kinetics | minutes; hours for modified release |
| Absorption | drug crosses the gut wall into portal blood | first order, $k_a \\approx$ 0.5–3 h⁻¹ | peak 0.5–3 h after most tablets |
| Distribution | drug spreads from blood into tissues | first order, often fast | minutes to hours |
| Metabolism | enzymes, mostly in the liver, change the molecule | first order below saturation | set by clearance |
| Excretion | kidneys, bile, lungs remove it | first order | set by clearance |

The slowest step shapes the curve. When absorption is slower than elimination — a depot injection, some modified-release tablets — the tail of the curve reflects absorption, not elimination: **flip-flop kinetics**.

### Metabolism: making molecules easier to excrete
**Phase I** reactions (oxidation, reduction, hydrolysis) add or expose a polar group; most oxidations are done by the cytochrome P450 enzymes, with CYP3A4, CYP2D6, CYP2C9, CYP2C19 and CYP1A2 handling the majority of drugs. **Phase II** reactions attach a large polar group — glucuronic acid, sulfate, glutathione, an acetyl group. The product is usually inactive and water-soluble, but not always: a **prodrug** such as enalapril is activated by metabolism, and paracetamol forms a small amount of a reactive metabolite that the liver must detoxify with glutathione.

### Excretion and the fraction excreted unchanged
Clearance splits into a renal and a non-renal part, $\\text{CL} = \\text{CL}_R + \\text{CL}_{NR}$. The share removed unchanged by the kidneys is $f_e$, measured as the amount recovered unchanged in urine over the systemic dose. Some polar drugs — aminoglycoside antibiotics, lithium — have $f_e$ above 0.9; many lipophilic drugs have $f_e$ below 0.05, because whatever the glomerulus filters is reabsorbed through the tubule wall. Comparing the renal clearance with filtration alone, $f_u \\cdot \\text{GFR}$ (about 7.2 L/h for a free drug), tells you what the tubule does: a larger $\\text{CL}_R$ means active **secretion**, a smaller one net **reabsorption**. $f_e$ is the single number that predicts how much a drug will accumulate in kidney disease ([[renal-adjustment]]).

> [!key] Every milligram is accounted for: absorbed or not, metabolised or excreted unchanged. $F$ says how much reaches the circulation; $f_e$ says how much of that leaves unchanged in the urine.

### How ADME is measured
A human **mass-balance study** gives a few healthy volunteers a dose labelled with carbon-14 and collects urine and faeces until more than about 90 % of the radioactivity is recovered; chromatography then shows which metabolites carry it. Laboratory tests — liver microsomes and hepatocytes, Caco-2 cell monolayers, plasma binding — screen candidates long before that.
`,
  ideas: [
    'A dose obeys a mass balance: at any time its milligrams are in the gut, the body, the metabolite pool, the urine or the faeces.',
    'LADME adds liberation: a solid medicine must release and dissolve its drug before absorption can begin.',
    'Each step is a rate process, usually first order; the slowest one shapes the concentration–time curve.',
    'Total clearance is renal plus non-renal; the fraction excreted unchanged, fe, predicts sensitivity to kidney function.',
    'Renal clearance above fu·GFR means tubular secretion; below it, net reabsorption.'
  ],
  pitfalls: [
    'Metabolism always inactivates a drug — Prodrugs are activated by it, some metabolites are as active as the parent, and a few are toxic.',
    'A drug that is well absorbed must have a high bioavailability — Absorption only gets it into portal blood; gut-wall and liver metabolism on the first pass can still remove most of it.',
    'fe is the fraction of the dose found in urine — It is the fraction of the systemic dose (F × D) excreted unchanged; metabolites in urine do not count.'
  ],
  formulas: [
    {
      name: 'Fraction excreted unchanged',
      expr: 'fe = Ae/(F*D)', tex: 'f_e = \\dfrac{A_e}{F\\,D}',
      vars: {
        fe: { name: 'fraction excreted unchanged', q: 'ratio', unit: '%', tex: 'f_e' },
        Ae: { name: 'amount recovered unchanged in urine', q: 'mass', unit: 'mg', value: 100, tex: 'A_e' },
        F: { name: 'bioavailability', q: 'ratio', unit: '%', value: 80, min: 1, max: 100, tex: 'F' },
        D: { name: 'dose', q: 'mass', unit: 'mg', value: 500, tex: 'D' }
      },
      note: 'Urine is collected until the drug is gone (five or more half-lives). For an intravenous dose F = 100 %.',
      stories: { fe: 'A hypothetical tablet of {D} has a bioavailability of {F}; {Ae} is recovered unchanged in the urine. What is fe?', Ae: 'A drug has fe = {fe} and bioavailability {F}. How much of a {D} dose will appear unchanged in the urine?' }
    },
    {
      name: 'Renal clearance',
      expr: 'CLR = fe*CL', tex: '\\text{CL}_R = f_e\\,\\text{CL}',
      vars: {
        CLR: { name: 'renal clearance', q: 'flowrate', unit: 'L/h', tex: '\\text{CL}_R' },
        fe: { name: 'fraction excreted unchanged', q: 'ratio', unit: '%', value: 25, tex: 'f_e' },
        CL: { name: 'total clearance', q: 'flowrate', unit: 'L/h', value: 6, tex: '\\text{CL}' }
      },
      note: 'The rest, (1 − fe)·CL, is non-renal clearance — mostly metabolism.',
      stories: { CLR: 'A hypothetical drug has a total clearance of {CL} and fe = {fe}. What is its renal clearance?', fe: 'A drug\'s renal clearance is {CLR} out of a total {CL}. What fraction is excreted unchanged?' }
    },
    {
      name: 'Clearance by filtration alone',
      expr: 'CLf = fu*GFR', tex: '\\text{CL}_f = f_u\\,\\text{GFR}',
      vars: {
        CLf: { name: 'filtration clearance', q: 'flowrate', unit: 'mL/min', tex: '\\text{CL}_f' },
        fu: { name: 'fraction unbound in plasma', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'f_u' },
        GFR: { name: 'glomerular filtration rate', q: 'flowrate', unit: 'mL/min', value: 120, tex: '\\text{GFR}' }
      },
      note: 'Only unbound drug is filtered. Compare with the measured renal clearance: higher means secretion, lower means reabsorption.',
      stories: { CLf: 'A drug is {fu} unbound; GFR is {GFR}. What renal clearance would filtration alone give?' }
    },
    {
      name: 'Rate of elimination',
      expr: 'Re = CL*C', tex: 'R_\\text{el} = \\text{CL}\\cdot C',
      vars: {
        Re: { name: 'rate of elimination', q: false, unit: 'mg/h', tex: 'R_\\text{el}' },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 6, tex: '\\text{CL}' },
        C: { name: 'plasma concentration', q: false, unit: 'mg/L', value: 4, tex: 'C' }
      },
      note: 'The definition of clearance: the rate of removal is proportional to the concentration. Work in mg, L and h.',
      stories: { Re: 'At a plasma level of {C}, a drug with clearance {CL} is removed at what rate?', CL: 'A drug at {C} is being removed at {Re}. What is its clearance?' }
    }
  ],
  examples: [
    {
      title: 'Following a dose to the urine',
      q: 'A hypothetical drug is given as a 500 mg tablet with bioavailability 0.8. Over five days, 100 mg of unchanged drug is collected in the urine. An intravenous study gave a total clearance of 6 L/h, and the drug is 90 % unbound in plasma. Find $f_e$, the renal and non-renal clearances, and what the tubule does.',
      steps: [
        'Systemic dose: $F\\,D = 0.8 \\times 500 = 400$ mg, so $f_e = 100/400 = 0.25$.',
        '$\\text{CL}_R = 0.25 \\times 6 = 1.5$ L/h (25 mL/min); $\\text{CL}_{NR} = 6 - 1.5 = 4.5$ L/h.',
        'Filtration alone would give $f_u \\cdot \\text{GFR} = 0.9 \\times 7.2 = 6.5$ L/h — four times more than is excreted.',
        'So about $1 - 1.5/6.5 = 77$ % of the filtered drug is reabsorbed: typical of a lipophilic, mostly un-ionised molecule, whose renal clearance may change with urine pH ([[ionisation-pka]]).'
      ],
      a: 'fe = 0.25; CL_R = 1.5 L/h, CL_NR = 4.5 L/h; the tubule reabsorbs most of what is filtered.'
    },
    {
      title: 'Where the dose is after one day',
      q: 'A hypothetical drug is injected intravenously (100 mg). Its half-life is 6 h and $f_e = 0.6$; metabolites are excreted quickly. Where is the dose 24 hours later?',
      steps: [
        '24 h is four half-lives: $100 \\times 2^{-4} = 6.25$ mg is still in the body.',
        '93.75 mg has been eliminated. Elimination is split in a fixed ratio, so 60 % of it, 56.3 mg, is unchanged drug in the urine.',
        'The other 37.5 mg has been metabolised; the mass balance closes: 6.25 + 56.25 + 37.5 = 100 mg.'
      ],
      a: 'About 6 mg in the body, 56 mg unchanged in the urine and 38 mg as metabolites.'
    }
  ],
  quiz: [
    { q: 'In a mass-balance study, 200 mg of a drug is injected into a vein and 150 mg is recovered unchanged in the urine. What is its fraction excreted unchanged, in %?', answer: 75, unit: '%', why: 'For an intravenous dose F = 1, so $f_e = 150/200 = 0.75$.' },
    { q: 'A drug with $f_e = 0.95$ is given to a person whose kidneys work at a third of normal. Its total clearance falls to about…', choices: ['95 % of normal', '67 % of normal', '37 % of normal', '33 % of normal'], a: 2, why: 'Non-renal clearance is unchanged (5 %), renal clearance falls to a third of 95 % (31.7 %): 5 + 31.7 ≈ 37 % of normal.' },
    { q: 'Metabolism always turns a drug into an inactive substance.', a: false, why: 'Prodrugs are activated by metabolism, some metabolites are fully active, and a few are toxic — which is why metabolites are studied as carefully as the parent drug.' },
    { q: 'A drug that is completely unbound has a renal clearance of 300 mL/min while the GFR is 120 mL/min. The kidney must be…', choices: ['reabsorbing it', 'filtering it and nothing else', 'actively secreting it into the tubule', 'metabolising it'], a: 2, why: 'Filtration alone can clear at most $f_u \\cdot \\text{GFR} = 120$ mL/min; anything above that needs tubular secretion by transporters.' },
    { q: 'Which step does "LADME" add in front of ADME?', choices: ['Liberation: release of the drug from its dosage form', 'Lymphatic transport', 'Liver metabolism', 'Loading'], a: 0, why: 'A tablet must disintegrate and its drug dissolve before absorption; for modified-release forms, liberation is the slowest step.' }
  ],
  problems: [
    { q: 'A hypothetical drug has a total clearance of 9 L/h, $f_e = 0.4$ and $f_u = 0.3$; GFR is 7.2 L/h. What is its renal clearance (L/h)?', answer: 3.6, unit: 'L/h', tol: 0.02,
      steps: ['$\\text{CL}_R = f_e\\,\\text{CL} = 0.4 \\times 9 = 3.6$ L/h.', 'Filtration alone gives $0.3 \\times 7.2 = 2.16$ L/h, so the kidney must also secrete the drug actively.'] }
  ],
  applications: ['Deciding early in development whether a candidate will be cleared by the kidneys or the liver, and so who will need dose changes.', 'Predicting drug interactions: a drug cleared mostly by one CYP enzyme is vulnerable to inhibitors of that enzyme.', 'Human radiolabelled mass-balance studies required for new medicines.', 'Designing prodrugs that are absorbed better than the active molecule.'],
  history: 'In the 1980s pharmacokinetics was one of the commonest reasons for failure in development: Prentis and colleagues (1988) found that roughly two candidates in five dropped between 1964 and 1985 failed because of poor absorption, distribution or elimination. After companies moved ADME testing to the start of discovery, Kola and Landis (2004) put that share at about one in ten by 2000.',
  sim: 'pkb-adme'
},

{
  id: 'volume-distribution', parent: 'pk-basics', title: 'Volume of distribution', level: 2,
  short: 'The apparent volume that would hold all the drug in the body at its plasma concentration: V = amount in body ÷ C. Set by binding in plasma against binding in tissues, it ranges from about 3 L to thousands of litres, and is estimated from the intercept or the area of a concentration–time curve.',
  keywords: ['volume of distribution', 'Vd', 'apparent volume', 'V/F', 'Vss', 'Vz', 'Varea', 'body water', 'plasma volume', 'extracellular fluid', 'tissue binding', 'fraction unbound', 'back-extrapolation', 'C0', 'L/kg', 'lipophilicity', 'loading dose', 'obesity', 'oedema'],
  prereq: ['adme', 'protein-binding', 'medicine:body-fluids', 'partition-logp'],
  related: ['clearance', 'half-life', 'loading-dose', 'one-compartment-iv', 'two-compartment', 'nca', 'paediatric-geriatric', 'medicine:pharmacokinetics'],
  body: `
Pour 100 mg of dye into a litre of water and the concentration is 100 mg/L. Now put a spoonful of activated charcoal in the beaker first: it soaks up 99 % of the dye, and the water shows only 1 mg/L. Judged by the water alone, the dye seems to be dissolved in **100 litres** — a beaker that does not exist. The volume of distribution is that kind of volume:

$$V = \\frac{\\text{amount of drug in the body}}{\\text{plasma concentration}}$$

The body's tissues play the charcoal. A drug that binds to muscle, fat or cell membranes leaves little in the plasma, so its apparent volume can be far larger than the body.

### Real volumes and apparent ones
A 70 kg adult holds about 3 L of plasma, 14 L of extracellular water and 42 L of water in all (0.04, 0.2 and 0.6 L/kg). A drug's $V$ says which of these it resembles — or how far it exceeds them. Some well-known teaching examples:

| Drug | $V$ (L/kg) | In 70 kg | Why |
|---|---|---|---|
| a monoclonal antibody | about 0.1 | 5–8 L | too large to leave the blood and interstitial fluid quickly |
| warfarin | 0.14 | 10 L | 99 % bound to albumin, which stays in plasma |
| gentamicin | 0.25 | 18 L | polar: stays in extracellular water |
| ethanol | about 0.6 | 42 L | spreads through all body water |
| digoxin | 5–7 | about 450 L | binds the sodium pump in muscle |
| amiodarone | about 60 | about 4000 L | dissolves in fat and binds in tissues |

### What sets the volume
The simplest physiological model splits the body into plasma $V_P$ and the rest $V_T$, with drug bound in both:

$$V = V_P + V_T \\frac{f_u}{f_{uT}}$$

where $f_u$ and $f_{uT}$ are the unbound fractions in plasma and tissue. Only unbound drug crosses membranes, so at equilibrium the *unbound* concentrations are equal; binding in plasma (small $f_u$) keeps $V$ small, binding in tissue (small $f_{uT}$) makes it large. Weak acids tend to bind albumin and have small volumes; lipophilic bases are drawn into tissues — partly trapped as ions in acidic lysosomes — and have large ones. Anything that shifts the balance changes $V$: low albumin raises it for acids, oedema and ascites raise it for polar drugs (a known problem with antibiotics in critically ill people), and obesity raises it for fat-soluble drugs.

### Estimating V from data
After an intravenous bolus, plot $\\ln C$ against time. If the points fall on a straight line, extrapolating back to $t = 0$ gives $C_0$, and $V = D/C_0$. Real drugs often show an early fast fall while they distribute, so three volumes are used ([[two-compartment]], [[nca]]):

- $V_c$, the initial or central volume, $D/C_0$;
- $V_{ss} = \\text{CL} \\times \\text{MRT}$, the volume at steady state, independent of how fast the drug is eliminated;
- $V_z = D/(\\lambda_z\\,\\text{AUC})$, the terminal or "area" volume, which links the terminal half-life to clearance.

For a two-compartment drug $V_c < V_{ss} < V_z$. After an oral dose only $V/F$ can be found: without an intravenous reference, a low volume and a poor bioavailability look the same.

> [!key] Volume links the **amount** to the concentration — it decides the loading dose ([[loading-dose]]). Clearance links the **dosing rate** to the concentration. The half-life follows from both.
`,
  ideas: [
    'V = amount in body ÷ plasma concentration: an apparent volume, not a place.',
    'Body water sets the scale: 3 L plasma, 14 L extracellular, 42 L in all for 70 kg; V can be far larger when tissues bind the drug.',
    'V = V_P + V_T·f_u/f_uT: plasma binding shrinks the volume, tissue binding swells it.',
    'From data: V = D/C₀ by back-extrapolation, V_z = D/(λz·AUC), V_ss = CL·MRT; after an oral dose only V/F.',
    'V sets the loading dose; clearance sets the maintenance rate.'
  ],
  pitfalls: [
    'A volume of 4000 L means the drug is dissolved in 4000 L of fluid — It is a ratio of amount to plasma concentration; a large value only says that little of the drug stays in the plasma.',
    'The volume of distribution is a fixed property of the drug — It changes with protein binding, body composition, oedema, age and disease, and differs between the V_c, V_ss and V_z of the same drug.',
    'A drug with a large volume must be cleared slowly — Clearance and volume are independent; a large volume lengthens the half-life only for a given clearance.'
  ],
  formulas: [
    {
      name: 'Volume from an intravenous bolus',
      expr: 'V = D/C0', tex: 'V = \\dfrac{D}{C_0}',
      vars: {
        V: { name: 'volume of distribution', q: false, unit: 'L', tex: 'V' },
        D: { name: 'dose injected', q: false, unit: 'mg', value: 500, tex: 'D' },
        C0: { name: 'concentration extrapolated to t = 0', q: false, unit: 'mg/L', value: 12.5, tex: 'C_0' }
      },
      note: 'C₀ is read from the back-extrapolated log-linear line, not measured. Work in mg, L and mg/L.',
      stories: { V: 'A hypothetical drug is injected as {D}; the log-linear plot extrapolates to {C0} at time zero. What is V?', C0: 'A drug with V = {V} is injected as {D}. What is the initial concentration?' }
    },
    {
      name: 'Volume from plasma and tissue binding',
      expr: 'V = VP + VT*fu/fuT', tex: 'V = V_P + V_T\\,\\dfrac{f_u}{f_{uT}}',
      vars: {
        V: { name: 'volume of distribution', q: 'volume', unit: 'L', tex: 'V' },
        VP: { name: 'plasma volume', q: 'volume', unit: 'L', value: 3, tex: 'V_P' },
        VT: { name: 'volume of the rest of body water', q: 'volume', unit: 'L', value: 39, tex: 'V_T' },
        fu: { name: 'unbound fraction in plasma', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: 'f_u' },
        fuT: { name: 'unbound fraction in tissue', q: 'ratio', unit: '%', value: 2, min: 0.001, max: 100, tex: 'f_{uT}' }
      },
      note: 'The simplest physiological model (after Gillette, 1971). Plasma binding (small f_u) keeps V small; tissue binding (small f_uT) makes it large.',
      practice: { unknowns: ['V', 'fu'] },
      stories: { V: 'A drug is {fu} unbound in plasma and {fuT} unbound in tissue; plasma volume {VP}, the rest {VT}. What is V?', fu: 'A drug has V = {V} and is {fuT} unbound in tissue (plasma {VP}, rest {VT}). What must its unbound fraction in plasma be?' }
    },
    {
      name: 'Terminal (area) volume',
      expr: 'Vz = D/(lz*AUC)', tex: 'V_z = \\dfrac{D}{\\lambda_z\\,\\text{AUC}}',
      vars: {
        Vz: { name: 'terminal volume', q: false, unit: 'L', tex: 'V_z' },
        D: { name: 'intravenous dose', q: false, unit: 'mg', value: 500, tex: 'D' },
        lz: { name: 'terminal rate constant', q: false, unit: '1/h', value: 0.1, tex: '\\lambda_z' },
        AUC: { name: 'AUC from zero to infinity', q: false, unit: 'mg·h/L', value: 100, tex: '\\text{AUC}' }
      },
      note: 'Equivalent to CL/λz. Model-independent; for an oral dose the same formula gives V_z/F.',
      stories: { Vz: 'A {D} intravenous dose gives an AUC of {AUC} and a terminal rate constant of {lz}. What is V_z?' }
    },
    {
      name: 'Volume from a per-kilogram value',
      expr: 'V = v*W', tex: 'V = v \\cdot W',
      vars: {
        V: { name: 'volume of distribution', q: false, unit: 'L', tex: 'V' },
        v: { name: 'volume per kilogram', q: false, unit: 'L/kg', value: 0.25, tex: 'v' },
        W: { name: 'body weight', q: false, unit: 'kg', value: 70, tex: 'W' }
      },
      note: 'Which weight to use in obesity depends on the drug: lipophilic drugs follow total weight, polar drugs roughly lean weight.',
      stories: { V: 'A polar drug has a volume of {v}. What is V in a person of {W}?' }
    }
  ],
  examples: [
    {
      title: 'Reading V from a log-linear plot',
      q: 'A hypothetical drug is injected as a 600 mg bolus. Plasma levels are 9.0 mg/L at 2 h and 4.0 mg/L at 8 h, and the log-linear plot is straight. Find k, the half-life, $C_0$, $V$ and CL.',
      steps: [
        '$k = \\ln(9.0/4.0)/(8 - 2) = 0.811/6 = 0.135$ per hour; $t_{1/2} = 0.693/0.135 = 5.1$ h.',
        'Back to time zero: $C_0 = 9.0\\,e^{0.135 \\times 2} = 9.0 \\times 1.310 = 11.8$ mg/L.',
        '$V = 600/11.8 = 50.9$ L (about 0.7 L/kg: a little more than body water).',
        '$\\text{CL} = k\\,V = 0.135 \\times 50.9 = 6.9$ L/h. Check: $\\text{AUC} = C_0/k = 87$ mg·h/L, and $D/\\text{AUC} = 6.9$ L/h.'
      ],
      a: 'k = 0.135 h⁻¹, t½ = 5.1 h, C₀ = 11.8 mg/L, V ≈ 51 L, CL ≈ 6.9 L/h.'
    },
    {
      title: 'The same dose in a swollen body',
      q: 'A polar hypothetical antibiotic has $V = 0.25$ L/kg, and a first dose aims at a peak of 20 mg/L in a 70 kg adult. In a critically ill person of the same weight, oedema raises $V$ to 0.4 L/kg. What peak does the usual first dose give, and what dose would reach 20 mg/L?',
      steps: [
        'Usual: $V = 0.25 \\times 70 = 17.5$ L, so the dose is $20 \\times 17.5 = 350$ mg.',
        'Oedema: $V = 0.4 \\times 70 = 28$ L, and 350 mg gives $350/28 = 12.5$ mg/L — 37 % below the aim.',
        'Reaching 20 mg/L would take $20 \\times 28 = 560$ mg. This is why some first doses in critical illness are larger, and why levels are measured ([[tdm]]). Real doses follow the product information and local protocols.'
      ],
      a: 'The usual dose peaks at 12.5 mg/L; about 560 mg would reach 20 mg/L (illustrative numbers).'
    }
  ],
  quiz: [
    { q: 'A 100 mg intravenous dose gives an extrapolated initial plasma concentration of 0.2 mg/L. What is the volume of distribution, in litres?', answer: 500, unit: 'L', why: '$V = D/C_0 = 100/0.2 = 500$ L — about 7 L/kg, far more than body water: the drug is concentrated in tissues.' },
    { q: 'A drug has $V$ = 0.06 L/kg in a 70 kg adult (4.2 L). Where is it mostly?', choices: ['in the plasma', 'throughout the extracellular fluid', 'throughout body water', 'concentrated in tissues'], a: 0, why: '4.2 L is close to the 3 L of plasma: the drug hardly leaves the blood — typical of large proteins or drugs very tightly bound to albumin.' },
    { q: 'An apparent volume of 4000 L means the drug is dissolved in 4000 L of body fluid.', a: false, why: 'V is the amount in the body divided by the plasma concentration. A huge value means most of the drug is bound in tissues and little remains in the plasma.' },
    { q: 'Albumin falls in a person taking a highly albumin-bound acidic drug that binds little in tissues. What happens to its volume of distribution?', choices: ['it falls', 'it rises', 'it is unchanged: V is fixed for each drug', 'it falls to the plasma volume'], a: 1, why: 'In $V = V_P + V_T f_u/f_{uT}$, less albumin raises $f_u$, so more drug moves into the tissues and V rises.' },
    { q: 'After oral doses only, with no intravenous data, which volume can be estimated?', choices: ['V', 'V/F', 'V × F', 'none'], a: 1, why: 'The curve depends on the systemic dose F·D, so only V/F (and CL/F) are identifiable.' }
  ],
  problems: [
    { q: 'A hypothetical drug given as a 250 mg intravenous bolus has $\\lambda_z$ = 0.1 per hour and $\\text{AUC}_{0-\\infty}$ = 25 mg·h/L. What is $V_z$ (L)?', answer: 100, unit: 'L', tol: 0.02,
      steps: ['$V_z = D/(\\lambda_z\\,\\text{AUC}) = 250/(0.1 \\times 25) = 100$ L.', 'Equivalently $\\text{CL} = D/\\text{AUC} = 10$ L/h and $V_z = \\text{CL}/\\lambda_z = 100$ L.'] }
  ],
  applications: ['Calculating loading doses for drugs that must work at once.', 'Adjusting first doses for oedema, obesity, newborns and older people.', 'Predicting how much a drug is removed by dialysis: drugs with large volumes are barely touched.', 'Screening candidates: very large volumes often mean long half-lives and tissue accumulation.'],
  history: 'The apparent volume appeared with the first compartment models of Torsten Teorell (1937). Reading it physiologically — as a balance between binding in plasma and binding in tissues — is usually traced to James Gillette (1971) and to Svein Øie and Thomas Tozer (1979).',
  sim: 'pkb-iv-bolus'
},

{
  id: 'clearance', parent: 'pk-basics', title: 'Clearance', level: 2,
  short: 'The volume of plasma (or blood) cleared of drug per unit time — the constant that links the rate of elimination to the concentration. Clearances of different organs add; clearance alone sets the average steady-state level for a dosing rate, and it is measured as dose ÷ AUC.',
  keywords: ['clearance', 'CL', 'total clearance', 'systemic clearance', 'renal clearance', 'hepatic clearance', 'extraction ratio', 'organ blood flow', 'dose/AUC', 'CL/F', 'apparent clearance', 'steady state', 'dosing rate', 'average concentration', 'additivity', 'blood clearance', 'plasma clearance', 'blood-to-plasma ratio', 'first-order elimination'],
  prereq: ['adme', 'volume-distribution', 'medicine:pharmacokinetics', 'medicine:glomerular-filtration'],
  related: ['half-life', 'auc-cmax', 'hepatic-clearance', 'renal-adjustment', 'iv-infusion', 'multiple-dosing', 'nonlinear-pk', 'nca'],
  body: `
Picture the blood flowing through the liver, about 1.5 litres a minute. If the blood leaving it carries 30 % less drug than the blood arriving, the liver has in effect wiped 30 % of that stream completely clean: $0.3 \\times 90 = 27$ litres of blood cleared of drug every hour. That is **clearance** — a volume per unit time, not an amount. Formally, it is the constant that links the rate of elimination to the concentration that drives it:

$$\\text{rate of elimination} = \\text{CL} \\cdot C$$

For most drugs at ordinary doses CL is constant: elimination is first order, a fixed fraction per hour. When enzymes or transporters saturate, clearance falls as the level rises ([[nonlinear-pk]]).

### Organ clearance and its ceiling
An organ with blood flow $Q$ that removes a fraction $E = (C_\\text{in} - C_\\text{out})/C_\\text{in}$ of the drug passing through clears $\\text{CL} = Q \\cdot E$. Since $E$ cannot exceed 1, blood flow is the ceiling:

| Flow in a 70 kg adult | L/min | L/h |
|---|---|---|
| cardiac output | 5 | 300 |
| liver blood flow | 1.5 | 90 |
| kidney blood flow | 1.2 | 72 |
| kidney plasma flow | 0.65 | 39 |
| glomerular filtration (GFR) | 0.12 | 7.2 |

Organs clear in parallel from the same blood, so their clearances **add**: $\\text{CL} = \\text{CL}_R + \\text{CL}_H + \\dots$ Rate constants add too; half-lives do not. How the liver's clearance depends on flow, binding and enzymes is the subject of [[hepatic-clearance]].

### Measuring clearance
Integrate the rate of elimination over all time. Everything that reached the circulation is eventually eliminated, so $F\\,D = \\text{CL} \\cdot \\text{AUC}$:

$$\\text{CL} = \\frac{F\\,D}{\\text{AUC}_{0-\\infty}}$$

This holds for any drug with linear kinetics, however many compartments it has — no model is needed, only the area, which trapezoids give ([[auc-cmax]], [[nca]]). Other routes to the same number: at the plateau of a constant infusion, $\\text{CL} = R_0/C_{ss}$ ([[iv-infusion]]); from urine, $\\text{CL}_R = A_e/\\text{AUC}$ over the same interval. After oral doses without an intravenous reference only $\\text{CL}/F$ can be found.

### What clearance decides
At steady state, what goes in equals what comes out: $F\\,D/\\tau = \\text{CL} \\cdot C_{ss,\\text{avg}}$, so

$$C_{ss,\\text{avg}} = \\frac{F\\,D}{\\text{CL}\\,\\tau}$$

The average level depends only on the dosing rate and the clearance — not on the volume, not on the half-life, and not on how the daily dose is divided. Those decide how far the level swings between doses and how long it takes to reach the plateau ([[multiple-dosing]], [[half-life]]).

### Blood or plasma?
Assays measure plasma, but organs clear blood. When a drug concentrates in red cells its plasma clearance can exceed liver plasma flow — occasionally even appear larger than cardiac output — with no paradox: $\\text{CL}_\\text{blood} = \\text{CL}_\\text{plasma} \\cdot C_p/C_b$.

> [!key] Clearance is the link between the dosing rate and the average level. Halve the clearance and the same regimen doubles the average level — the arithmetic behind every dose change in kidney or liver disease.
`,
  ideas: [
    'Clearance is a volume per unit time: rate of elimination = CL × C.',
    'An organ clears CL = Q·E; its blood flow is the upper limit.',
    'Clearances of parallel organs add: CL = CL_R + CL_H + …',
    'Model-independent measurement: CL = F·D/AUC₀₋∞; at an infusion plateau CL = R₀/C_ss.',
    'The average steady-state level depends only on dosing rate and clearance: C_ss,avg = F·D/(CL·τ).'
  ],
  pitfalls: [
    'Clearance is the amount of drug removed per hour — It is the volume cleared per hour; the amount removed is CL × C, and falls as the level falls.',
    'Giving the daily dose in more portions raises the average level — The average depends only on the total dosing rate and clearance; splitting the dose only reduces the swings.',
    'A plasma clearance larger than liver blood flow is impossible — Plasma and blood clearance differ when the drug enters red cells; only blood clearance is limited by blood flow.'
  ],
  formulas: [
    {
      name: 'Clearance from exposure',
      expr: 'CL = F*D/AUC', tex: '\\text{CL} = \\dfrac{F\\,D}{\\text{AUC}_{0-\\infty}}',
      vars: {
        CL: { name: 'clearance', q: false, unit: 'L/h', tex: '\\text{CL}' },
        F: { name: 'bioavailability (fraction, 1 for an intravenous dose)', value: 1, min: 0.001, max: 1, tex: 'F' },
        D: { name: 'dose', q: false, unit: 'mg', value: 400, tex: 'D' },
        AUC: { name: 'area under the curve, zero to infinity', q: false, unit: 'mg·h/L', value: 80, tex: '\\text{AUC}_{0-\\infty}' }
      },
      note: 'Holds for any linear drug, whatever the number of compartments. Without an intravenous reference, set F = 1 and read the result as CL/F.',
      practice: { unknowns: ['CL', 'AUC'] },
      stories: { CL: 'A hypothetical drug is injected as {D} and the AUC from zero to infinity is {AUC}. What is its clearance?', AUC: 'A drug with clearance {CL} is given as {D} with bioavailability {F}. What AUC do you expect?' }
    },
    {
      name: 'Organ clearance',
      expr: 'CL = Q*E', tex: '\\text{CL} = Q \\cdot E',
      vars: {
        CL: { name: 'organ clearance (blood)', q: 'flowrate', unit: 'L/h', tex: '\\text{CL}' },
        Q: { name: 'blood flow to the organ', q: 'flowrate', unit: 'L/h', value: 90, tex: 'Q' },
        E: { name: 'extraction ratio', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'E' }
      },
      note: 'E = (C_in − C_out)/C_in. Liver blood flow is about 90 L/h, kidney blood flow about 72 L/h.',
      stories: { CL: 'The liver receives {Q} of blood and extracts {E} of a drug on each pass. What is its hepatic clearance?', E: 'A drug has a hepatic blood clearance of {CL}; liver blood flow is {Q}. What is its extraction ratio?' }
    },
    {
      name: 'Clearance, volume and rate constant',
      expr: 'CL = k*V', tex: '\\text{CL} = k\\,V',
      vars: {
        CL: { name: 'clearance', q: 'flowrate', unit: 'L/h', tex: '\\text{CL}' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.1, tex: 'k' },
        V: { name: 'volume of distribution', q: 'volume', unit: 'L', value: 50, tex: 'V' }
      },
      note: 'One compartment. k is the fraction of the amount in the body removed per unit time.',
      stories: { CL: 'A hypothetical drug has V = {V} and k = {k}. What is its clearance?', k: 'A drug with clearance {CL} and volume {V}: what fraction of the body\'s content is removed per hour?' }
    },
    {
      name: 'Average level at steady state',
      expr: 'Css = F*D/(CL*tau)', tex: 'C_{ss,\\text{avg}} = \\dfrac{F\\,D}{\\text{CL}\\,\\tau}',
      vars: {
        Css: { name: 'average steady-state concentration', q: false, unit: 'mg/L', tex: 'C_{ss,\\text{avg}}' },
        F: { name: 'bioavailability (fraction)', value: 0.75, min: 0.001, max: 1, tex: 'F' },
        D: { name: 'dose each interval', q: false, unit: 'mg', value: 640, tex: 'D' },
        CL: { name: 'clearance', q: false, unit: 'L/h', value: 5, tex: '\\text{CL}' },
        tau: { name: 'dosing interval', q: false, unit: 'h', value: 12, tex: '\\tau' }
      },
      note: 'Rate in = rate out at steady state. The volume and the half-life do not appear: they govern the swings, not the average.',
      practice: { unknowns: ['Css', 'D'] },
      stories: { Css: 'A hypothetical tablet of {D} (F = {F}) is taken every {tau}; clearance is {CL}. What is the average steady-state level?', D: 'To average {Css} with clearance {CL}, bioavailability {F} and a dose every {tau}, what dose is needed?' }
    }
  ],
  examples: [
    {
      title: 'Three measurements of one clearance',
      q: 'A hypothetical drug is injected as 400 mg and the AUC from zero to infinity is 80 mg·h/L. Later it is infused at 20 mg/h. Urine studies show that 40 % of it is cleared by the kidneys and the rest by the liver. Find CL, the infusion plateau and the hepatic extraction ratio.',
      steps: [
        '$\\text{CL} = 400/80 = 5$ L/h.',
        'Plateau of the infusion: $C_{ss} = R_0/\\text{CL} = 20/5 = 4$ mg/L — measuring it would give the same clearance a second way.',
        'Hepatic clearance: $0.6 \\times 5 = 3$ L/h, so $E_H = 3/90 = 0.033$: a low-extraction drug, limited by the liver\'s enzymes rather than its blood flow ([[hepatic-clearance]]).'
      ],
      a: 'CL = 5 L/h, plateau 4 mg/L, E_H ≈ 3 %.'
    },
    {
      title: 'The dosing rate sets the average',
      q: 'For a hypothetical drug with CL = 5 L/h, V = 50 L and F = 0.75, what daily dose gives an average level of 8 mg/L? Compare giving it twice and four times a day.',
      steps: [
        'Daily dose $= C_{ss,\\text{avg}} \\cdot \\text{CL} \\cdot 24/F = 8 \\times 5 \\times 24/0.75 = 1280$ mg.',
        'As 640 mg every 12 h or 320 mg every 6 h, the average is 8 mg/L either way.',
        'The swings differ: $k = \\text{CL}/V = 0.1$ h⁻¹, so the peak-to-trough ratio (for rapid absorption) is $e^{k\\tau} = e^{1.2} = 3.3$ twice daily against $e^{0.6} = 1.8$ four times daily.'
      ],
      a: '1280 mg a day; the same average either way, with a peak-to-trough ratio of 3.3 versus 1.8.'
    }
  ],
  quiz: [
    { q: 'If clearance doubles and the dosing regimen is unchanged, the average steady-state level…', choices: ['doubles', 'is unchanged', 'halves', 'falls to a quarter'], a: 2, why: '$C_{ss,\\text{avg}} = F D/(\\text{CL}\\,\\tau)$ is inversely proportional to clearance.' },
    { q: 'After a 250 mg intravenous dose the AUC from zero to infinity is 50 mg·h/L. What is the clearance, in L/h?', answer: 5, unit: 'L/h', why: '$\\text{CL} = D/\\text{AUC} = 250/50 = 5$ L/h.' },
    { q: 'The hepatic blood clearance of a drug can never exceed liver blood flow.', a: true, why: '$\\text{CL}_H = Q_H \\cdot E$ with $E \\le 1$. (A plasma clearance can appear larger when the drug enters red cells.)' },
    { q: 'Which change lengthens the half-life but leaves the average steady-state level unchanged?', choices: ['clearance halves', 'the volume of distribution doubles', 'the dose doubles', 'bioavailability halves'], a: 1, why: 'The half-life is $0.693\\,V/\\text{CL}$, the average level $F D/(\\text{CL}\\,\\tau)$: a larger volume stretches the half-life but does not touch the average.' },
    { q: 'A drug is cleared at 2 L/h by the kidneys and 3 L/h by the liver. Its total clearance is…', choices: ['2.5 L/h', '3 L/h', '5 L/h', '6 L/h'], a: 2, why: 'Organs remove drug in parallel from the same blood, so clearances add.' }
  ],
  problems: [
    { q: 'A hypothetical drug infused at 30 mg/h reaches a steady plasma level of 2.5 mg/L. What is its clearance (L/h)?', answer: 12, unit: 'L/h', tol: 0.02,
      steps: ['At the plateau, rate in = rate out: $R_0 = \\text{CL} \\cdot C_{ss}$.', '$\\text{CL} = 30/2.5 = 12$ L/h (200 mL/min).'] }
  ],
  applications: ['Setting maintenance dosing rates: dose rate = target level × clearance.', 'Adjusting doses when kidney or liver function falls, or when an interacting drug inhibits an enzyme.', 'Comparing formulations: CL is constant, so differences in AUC measure differences in bioavailability.', 'Scaling doses from adults to children with clearance rather than weight ([[paediatric-geriatric]]).'],
  history: 'Clearance began in kidney physiology: Eggert Møller, John McIntosh and Donald Van Slyke defined the urea clearance in 1928, and Homer Smith\'s work with inulin in the 1930s turned it into the measurement of GFR. Malcolm Rowland, Leslie Benet and Garry Graham (1973) and Grant Wilkinson and David Shand (1975) carried the idea to the liver and to drugs in general.',
  sim: 'pkb-iv-bolus'
},

{
  id: 'half-life', parent: 'pk-basics', title: 'Half-life', level: 2,
  short: 'The time for the plasma concentration to fall by half during first-order elimination: t½ = ln 2/k = 0.693 V/CL. A derived parameter — it follows from volume and clearance — that governs how fast a drug accumulates, washes out and swings between doses.',
  keywords: ['half-life', 't1/2', 'elimination rate constant', 'k', 'terminal half-life', 'lambda z', 'effective half-life', 'first order', 'semilog plot', 'log-linear regression', 'ln 2', '0.693', 'dependent parameter', 'accumulation', 'washout', 'context-sensitive half-time', 'flip-flop'],
  prereq: ['clearance', 'volume-distribution', 'math:exponential-models', 'math:logarithms'],
  related: ['medicine:half-life-dosing', 'multiple-dosing', 'loading-dose', 'two-compartment', 'nca', 'tdm', 'chemistry:integrated-rate-laws', 'physics:half-life'],
  body: `
### Where the half-life comes from
For a drug in one well-mixed compartment, the amount in the body $A$ falls at the rate of elimination: $dA/dt = -\\text{CL} \\cdot C = -(\\text{CL}/V)\\,A$. A rate proportional to what is left gives an exponential:

$$A = A_0\\,e^{-kt}, \\qquad k = \\frac{\\text{CL}}{V}$$

Setting $A = A_0/2$ gives the half-life:

$$t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693\\,V}{\\text{CL}}$$

It is the same curve as radioactive decay ([[physics:half-life]]) and a first-order reaction ([[chemistry:integrated-rate-laws]]). After $n$ half-lives a fraction $2^{-n}$ remains — 50, 25, 12.5, 6.3 and 3.1 % after one to five — and the approach to steady state on regular dosing mirrors it: 90 % of the plateau after 3.3 half-lives. [[medicine:half-life-dosing|Hyper Medicine]] explains what that means for someone taking a medicine.

### A derived parameter
Clearance and volume are set by physiology — blood flow, enzymes, binding, body water. The half-life follows from both, so two drugs can share a half-life for opposite reasons, and a change must be read with care:

| Change | CL | V | $t_{1/2}$ | Average steady-state level |
|---|---|---|---|---|
| kidney failure, renally cleared drug | down | same | up | up |
| enzyme induction | up | same | down | down |
| obesity, lipophilic drug | same | up | up | same |
| oedema, polar drug | same | up | up | same |

The average level follows clearance alone ([[clearance]]); the half-life also follows volume.

### Reading the half-life from data
On a semilog plot, first-order decline is a straight line of slope $-k$ (with natural logarithms). A least-squares line through the terminal points gives the terminal rate constant $\\lambda_z$ and $t_{1/2} = 0.693/\\lambda_z$; two points are enough in principle, $k = \\ln(C_1/C_2)/\\Delta t$. The estimate is only as good as the span: samples should cover at least two or three half-lives, otherwise a small assay error tilts the line a lot. The log scale also suits assay error, which is roughly proportional to the level.

### Which half-life?
Most drugs show a fast early fall while they distribute and a slower terminal phase ([[two-compartment]]). The terminal half-life can describe only a sliver of the total exposure: then the **effective half-life** — the one that reproduces the accumulation actually seen on repeated dosing — is the useful number:

$$t_{1/2,\\text{eff}} = \\frac{\\ln 2 \\cdot \\tau}{\\ln\\!\\big(R/(R-1)\\big)}$$

where $R$ is the accumulation ratio at interval $\\tau$. In anaesthesia, the **context-sensitive half-time** — how long the level takes to halve after an infusion of a given length — matters more still. And when absorption is slower than elimination (a depot injection, some modified-release forms), the terminal slope after the dose measures *absorption*: **flip-flop kinetics** ([[oral-absorption-pk]]).

> [!key] $t_{1/2} = 0.693\\,V/\\text{CL}$. The half-life tells you how long things take — to reach a plateau, to wash out, to swing between doses; clearance tells you where the plateau is.
`,
  ideas: [
    'First-order elimination from one compartment: A = A₀e^(−kt) with k = CL/V.',
    't½ = ln 2/k = 0.693 V/CL: a dependent parameter that follows from volume and clearance.',
    'On a semilog plot the decline is a straight line; its slope gives k, best estimated over two or more half-lives.',
    '2^(−n) remains after n half-lives; 90 % of steady state takes 3.3 half-lives.',
    'Terminal, effective and context-sensitive half-lives answer different questions; flip-flop kinetics hides elimination behind slow absorption.'
  ],
  pitfalls: [
    'A long half-life means low clearance — A large volume gives a long half-life even with a high clearance; the half-life depends on both.',
    'A drug is gone after two half-lives — A quarter is left after two; it takes about five to fall to 3 %.',
    'The terminal half-life always predicts accumulation — If the terminal phase holds a small part of the AUC, the drug accumulates as if its half-life were much shorter; use the effective half-life.'
  ],
  formulas: [
    {
      name: 'Half-life and rate constant',
      expr: 'th = ln(2)/k', tex: 't_{1/2} = \\dfrac{\\ln 2}{k}',
      vars: {
        th: { name: 'half-life', q: 'time', unit: 'h', tex: 't_{1/2}' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.1, tex: 'k' }
      },
      stories: { th: 'A hypothetical drug is eliminated with k = {k}. What is its half-life?', k: 'A drug has a half-life of {th}. What is its elimination rate constant?' }
    },
    {
      name: 'Half-life from volume and clearance',
      expr: 'th = ln(2)*V/CL', tex: 't_{1/2} = \\dfrac{\\ln 2 \\cdot V}{\\text{CL}}',
      vars: {
        th: { name: 'half-life', q: 'time', unit: 'h', tex: 't_{1/2}' },
        V: { name: 'volume of distribution', q: 'volume', unit: 'L', value: 50, tex: 'V' },
        CL: { name: 'clearance', q: 'flowrate', unit: 'mL/min', value: 100, tex: '\\text{CL}' }
      },
      note: 'The calculator converts units: clearance in mL/min and volume in litres give hours.',
      practice: { unknowns: ['th', 'CL', 'V'] },
      stories: { th: 'A hypothetical drug has V = {V} and a clearance of {CL}. What is its half-life?', CL: 'A drug with V = {V} has a half-life of {th}. What is its clearance?', V: 'A drug is cleared at {CL} and has a half-life of {th}. What is its volume of distribution?' }
    },
    {
      name: 'Rate constant from two levels',
      expr: 'k = ln(C1/C2)/dt', tex: 'k = \\dfrac{\\ln(C_1/C_2)}{\\Delta t}',
      vars: {
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', tex: 'k' },
        C1: { name: 'first level', q: 'massconc', unit: 'mg/L', value: 8, tex: 'C_1' },
        C2: { name: 'later level', q: 'massconc', unit: 'mg/L', value: 2, tex: 'C_2' },
        dt: { name: 'time between the samples', q: 'time', unit: 'h', value: 12, tex: '\\Delta t' }
      },
      note: 'Both samples in the same log-linear (terminal) phase, after absorption and distribution are over.',
      practice: { unknowns: ['k', 'C2'] },
      stories: { k: 'A level falls from {C1} to {C2} in {dt}. What is the elimination rate constant?', C2: 'A drug at {C1} is eliminated with k = {k}. What is the level {dt} later?' }
    },
    {
      name: 'Effective half-life from accumulation',
      expr: 'the = ln(2)*tau/ln(R/(R - 1))', tex: 't_{1/2,\\text{eff}} = \\dfrac{\\ln 2 \\cdot \\tau}{\\ln\\!\\big(R/(R-1)\\big)}',
      vars: {
        the: { name: 'effective half-life', q: 'time', unit: 'h', tex: 't_{1/2,\\text{eff}}' },
        tau: { name: 'dosing interval', q: 'time', unit: 'h', value: 24, tex: '\\tau' },
        R: { name: 'accumulation ratio (steady-state ÷ first-dose exposure over one interval)', value: 1.5, min: 1.0001, max: 1000, tex: 'R' }
      },
      note: 'Inverts R = 1/(1 − e^(−kτ)). It is the half-life a one-compartment drug would need to accumulate as much as the one observed.',
      stories: { the: 'Taken every {tau}, a drug\'s exposure at steady state is {R} times that after the first dose. What is its effective half-life?', R: 'A drug with an effective half-life of {the} is given every {tau}. How much will it accumulate?' }
    }
  ],
  examples: [
    {
      title: 'Why a half-life changes',
      q: 'A hypothetical drug has $V$ = 40 L and CL = 4 L/h. What happens to its half-life and average steady-state level (a) in kidney failure that halves its clearance, (b) in oedema that raises its volume to 60 L?',
      steps: [
        'Normal: $t_{1/2} = 0.693 \\times 40/4 = 6.9$ h.',
        '(a) CL = 2 L/h: $t_{1/2} = 13.9$ h, and the average level doubles, because it depends on $1/\\text{CL}$.',
        '(b) $V$ = 60 L: $t_{1/2} = 0.693 \\times 60/4 = 10.4$ h, but the average level is unchanged; the peaks are lower and the troughs higher.'
      ],
      a: '(a) 13.9 h with twice the average level; (b) 10.4 h with the same average level.'
    },
    {
      title: 'From two samples to the whole curve',
      q: 'After a 700 mg intravenous dose of a hypothetical drug, the level is 10.0 mg/L at 2 h and 2.5 mg/L at 10 h. Find $k$, $t_{1/2}$, $C_0$, $V$ and CL.',
      steps: [
        '$k = \\ln(10/2.5)/8 = 1.386/8 = 0.173$ per hour, so $t_{1/2} = 4.0$ h (the level quartered in two half-lives).',
        '$C_0 = 10.0 \\times e^{0.173 \\times 2} = 10.0 \\times 1.414 = 14.1$ mg/L.',
        '$V = 700/14.1 = 49.5$ L and $\\text{CL} = k\\,V = 0.173 \\times 49.5 = 8.6$ L/h.'
      ],
      a: 'k = 0.173 h⁻¹, t½ = 4.0 h, C₀ = 14.1 mg/L, V ≈ 50 L, CL ≈ 8.6 L/h.'
    },
    {
      title: 'An effective half-life',
      q: 'A hypothetical drug has a terminal half-life of 48 h, but given once a day its exposure at steady state is only 1.5 times that after the first dose. How does it behave?',
      steps: [
        'With a 48 h half-life it would accumulate $R = 1/(1 - 2^{-24/48}) = 3.4$-fold.',
        'The observed $R = 1.5$ gives $t_{1/2,\\text{eff}} = 0.693 \\times 24/\\ln(1.5/0.5) = 16.6/1.099 = 15.1$ h.',
        'Most of the exposure is cleared with a 15 h half-life; the long terminal phase holds a small remainder. Steady state is reached in about three days, not ten.'
      ],
      a: 'It accumulates like a drug with a 15 h half-life.'
    }
  ],
  quiz: [
    { q: 'A plasma level falls from 12 to 3 mg/L in 10 hours (first order). What is the half-life, in hours?', answer: 5, unit: 'h', why: '12 → 6 → 3 is two halvings in 10 h, so $t_{1/2}$ = 5 h.' },
    { q: 'Obesity raises the volume of a lipophilic drug by 50 % while its clearance stays the same. The half-life…', choices: ['is unchanged', 'rises by 50 %', 'doubles', 'falls by a third'], a: 1, why: '$t_{1/2} = 0.693\\,V/\\text{CL}$ is proportional to V.' },
    { q: 'A long half-life means the drug\'s clearance must be low.', a: false, why: 'A large volume of distribution also lengthens the half-life; some drugs with long half-lives have high clearances.' },
    { q: 'On regular dosing, how many half-lives does it take to reach 90 % of the steady-state level?', choices: ['1', '2', 'about 3.3', '10'], a: 2, why: '$1 - 2^{-n} = 0.9$ gives $n = \\log_2 10 = 3.32$.' },
    { q: 'After a slowly absorbed depot injection, the terminal slope of the log plot is much shallower than after an injection into a vein. The most likely reason is…', choices: ['the drug accumulates in fat', 'flip-flop kinetics: absorption is slower than elimination, and the tail measures absorption', 'the assay is imprecise at low levels', 'clearance falls at low concentrations'], a: 1, why: 'When $k_a < k$, the slower process controls the terminal slope; the half-life seen after the depot is an absorption half-life.' }
  ],
  problems: [
    { q: 'A hypothetical drug has a volume of distribution of 35 L and a clearance of 70 mL/min. What is its half-life (h)?', answer: 5.78, unit: 'h', tol: 0.02,
      steps: ['Convert: 70 mL/min = 4.2 L/h.', '$t_{1/2} = 0.693 \\times 35/4.2 = 5.78$ h.'] },
    { q: 'A level of 16 mg/L falls to 5 mg/L in 9 hours. What is the half-life (h)?', answer: 5.36, unit: 'h', tol: 0.02,
      steps: ['$k = \\ln(16/5)/9 = 1.163/9 = 0.1292$ per hour.', '$t_{1/2} = 0.693/0.1292 = 5.36$ h.'] }
  ],
  applications: [
    'See how the half-life sets the time to steady state in [the dosing simulator](#/tools/pk/dosing).','Choosing a dosing interval that keeps the swings acceptable.', 'Predicting when steady state is reached, and when to measure a level ([[tdm]]).', 'Planning washout periods between treatments and in crossover studies.', 'Explaining why a drug keeps working, or causing side effects, days after it is stopped.'],
  history: 'Friedrich Dost, who named pharmacokinetics in 1953, used the exponential "Halbwertszeit" to describe how repeated doses build to a plateau. The effective half-life for accumulation was formalised by Harold Boxenbaum and Mark Battle (1995), and the context-sensitive half-time by Michael Hughes, Peter Glass and James Jacobs (1992).',
  sim: ['pkb-accumulation', 'pkb-iv-bolus']
},

{
  id: 'auc-cmax', parent: 'pk-basics', title: 'AUC, Cmax and exposure', level: 2,
  short: 'The area under the concentration–time curve (AUC) measures the total exposure to a dose; Cmax and tmax describe the peak and how soon it comes. All three are read from sampled data — the area by trapezoids — and they are the currency of bioavailability and bioequivalence.',
  keywords: ['AUC', 'area under the curve', 'Cmax', 'tmax', 'exposure', 'trapezoidal rule', 'linear-up log-down', 'log trapezoid', 'AUC0-t', 'AUC0-inf', 'extrapolated area', 'lambda z', 'Clast', 'dose proportionality', 'Bateman function', 'peak concentration', 'bioavailability', 'bioequivalence'],
  prereq: ['clearance', 'half-life', 'math:definite-integral', 'math:numerical-integration'],
  related: ['nca', 'oral-absorption-pk', 'bioavailability', 'bioequivalence', 'pkpd', 'nonlinear-pk', 'medicine:pharmacokinetics'],
  body: `
### Exposure as an area
After a dose the plasma level rises, peaks and falls. The area under that curve, $\\text{AUC} = \\int_0^\\infty C\\,dt$ in mg·h/L, is the **total exposure**: a level of 2 mg/L for 10 hours and 10 mg/L for 2 hours both give 20 mg·h/L. Because the rate of elimination is $\\text{CL} \\cdot C$, integrating it over all time accounts for the whole systemic dose:

$$\\text{AUC}_{0-\\infty} = \\frac{F\\,D}{\\text{CL}}$$

For linear kinetics the area is proportional to the dose and to the bioavailability, inversely proportional to clearance — and independent of how fast the drug was absorbed. That makes it the measure of [[bioavailability]]: equal doses by mouth and into a vein give $F = \\text{AUC}_\\text{oral}/\\text{AUC}_\\text{iv}$.

### The peak: Cmax and tmax
With first-order absorption ([[oral-absorption-pk]]) the level peaks when the falling rate of absorption has dropped to the rate of elimination:

$$t_\\text{max} = \\frac{\\ln(k_a/k)}{k_a - k}, \\qquad C_\\text{max} = \\frac{F D}{V}\\,e^{-k\\,t_\\text{max}}$$

$t_\\text{max}$ does not depend on the dose; $C_\\text{max}$ is proportional to it. Faster absorption gives an earlier and higher peak over the same area. For $k$ = 0.1 h⁻¹ (half-life 6.9 h):

| $k_a$ (h⁻¹) | $t_\\text{max}$ (h) | $C_\\text{max}$ (% of $FD/V$) | AUC |
|---|---|---|---|
| 0.5 | 4.0 | 67 | the same |
| 1 | 2.6 | 77 | the same |
| 2 | 1.6 | 85 | the same |
| 4 | 0.9 | 91 | the same |
| intravenous bolus | 0 | 100 | the same |

### Areas from samples: trapezoids
Real data are a dozen samples, not a curve. Join them with straight lines and add the trapezoids, $\\tfrac12 (C_i + C_{i+1})\\,\\Delta t$ — the linear trapezoidal rule ([[math:numerical-integration]]). On the falling limb the true curve is an exponential, bowed below its chords, so straight lines overestimate: by 4 % when samples are one half-life apart and by about 15 % when they are two apart. The **log trapezoid** is exact for exponential decline:

$$\\text{AUC}_{i,i+1} = \\frac{(C_i - C_{i+1})\\,\\Delta t}{\\ln(C_i/C_{i+1})}$$

Standard software therefore uses **linear-up/log-down**: straight lines while the level rises, logarithmic ones while it falls.

### To infinity
Sampling stops; the curve does not. The missing tail is $C_\\text{last}/\\lambda_z$, with $\\lambda_z$ from a log-linear fit of the last points ([[nca]]):

$$\\text{AUC}_{0-\\infty} = \\text{AUC}_{0-t} + \\frac{C_\\text{last}}{\\lambda_z}$$

If the extrapolated part is more than about 20 % of the total, the estimate leans too heavily on the fit, and bioequivalence guidance treats it as unreliable. A good sampling plan puts two or three samples near the expected peak and follows the drug for at least three half-lives.

### Which exposure matters?
AUC for total exposure; $C_\\text{max}$ for effects and side effects linked to the peak; the trough $C_\\text{min}$ for drugs that must stay above a threshold. Antibiotics are classed by which one predicts killing — unbound AUC/MIC, $C_\\text{max}$/MIC or time above the MIC ([[pkpd]]). Generic medicines must match the original in both AUC and $C_\\text{max}$ ([[bioequivalence]]), and AUC rising in proportion to the dose is the first test of linear kinetics ([[nonlinear-pk]]).

> [!key] AUC = F·D/CL measures how much; $C_\\text{max}$ and $t_\\text{max}$ measure how fast. Trapezoids — linear up, logarithmic down — turn a handful of samples into an area.
`,
  ideas: [
    'AUC = ∫C dt is total exposure; for linear kinetics AUC = F·D/CL, independent of the absorption rate.',
    'tmax = ln(ka/k)/(ka − k) does not depend on dose; Cmax is proportional to it.',
    'Faster absorption gives an earlier, higher peak with the same AUC.',
    'Linear trapezoids overestimate a falling exponential; the log trapezoid is exact — hence linear-up/log-down.',
    'AUC₀₋∞ = AUC₀₋ₜ + C_last/λz; more than about 20 % extrapolated makes the estimate unreliable.'
  ],
  pitfalls: [
    'A higher Cmax means more drug was absorbed — A faster absorption raises Cmax with the same AUC; only the area measures the amount.',
    'The linear trapezoidal rule is always good enough — On the falling limb with sparse samples it overestimates by several per cent to more than 15 %; use log trapezoids there.',
    'Doubling the dose makes the peak come later — For linear kinetics tmax depends only on ka and k; the peak is twice as high at the same time.'
  ],
  formulas: [
    {
      name: 'Time of the peak (first-order absorption)',
      expr: 'tmax = ln(ka/k)/(ka - k)', tex: 't_\\text{max} = \\dfrac{\\ln(k_a/k)}{k_a - k}',
      vars: {
        tmax: { name: 'time of the peak', q: 'time', unit: 'h', tex: 't_\\text{max}' },
        ka: { name: 'absorption rate constant', q: 'rate', unit: '1/h', value: 1, tex: 'k_a' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.1, tex: 'k' }
      },
      note: 'One compartment, first-order absorption with no lag. When ka = k the limit is tmax = 1/k.',
      practice: { unknowns: ['tmax', 'ka'] },
      stories: { tmax: 'A hypothetical tablet is absorbed with ka = {ka}; the drug is eliminated with k = {k}. When does the level peak?', ka: 'A drug eliminated with k = {k} peaks {tmax} after each dose. What is its absorption rate constant?' }
    },
    {
      name: 'Peak concentration',
      expr: 'Cmax = F*D/V*exp(-k*tmax)', tex: 'C_\\text{max} = \\dfrac{F\\,D}{V}\\,e^{-k\\,t_\\text{max}}',
      vars: {
        Cmax: { name: 'peak concentration', q: false, unit: 'mg/L', tex: 'C_\\text{max}' },
        F: { name: 'bioavailability (fraction)', value: 0.9, min: 0.001, max: 1, tex: 'F' },
        D: { name: 'dose', q: false, unit: 'mg', value: 500, tex: 'D' },
        V: { name: 'volume of distribution', q: false, unit: 'L', value: 50, tex: 'V' },
        k: { name: 'elimination rate constant', q: false, unit: '1/h', value: 0.1, tex: 'k' },
        tmax: { name: 'time of the peak', q: false, unit: 'h', value: 2.56, tex: 't_\\text{max}' }
      },
      note: 'At the peak, absorption and elimination rates are equal, which reduces the Bateman function to this form. Take tmax from the formula above.',
      practice: { unknowns: ['Cmax', 'D'] },
      stories: { Cmax: 'A hypothetical tablet of {D} (F = {F}) peaks at {tmax}; V = {V}, k = {k}. What is the peak level?', D: 'What dose gives a peak of {Cmax} if F = {F}, V = {V}, k = {k} and the peak comes at {tmax}?' }
    },
    {
      name: 'Log trapezoid for a falling segment',
      expr: 'A = (C1 - C2)*dt/ln(C1/C2)', tex: '\\text{AUC}_{12} = \\dfrac{(C_1 - C_2)\\,\\Delta t}{\\ln(C_1/C_2)}',
      vars: {
        A: { name: 'area of the segment', q: false, unit: 'mg·h/L', tex: '\\text{AUC}_{12}' },
        C1: { name: 'earlier level', q: false, unit: 'mg/L', value: 8, tex: 'C_1' },
        C2: { name: 'later level', q: false, unit: 'mg/L', value: 4, tex: 'C_2' },
        dt: { name: 'time between the samples', q: false, unit: 'h', value: 6, tex: '\\Delta t' }
      },
      note: 'Exact for an exponential decline; used when C₂ < C₁. The linear trapezoid would give (C₁ + C₂)Δt/2, which is larger.',
      practice: { unknowns: ['A'] },
      stories: { A: 'Two samples {dt} apart on the falling limb read {C1} and {C2}. What is the log-trapezoid area between them?' }
    },
    {
      name: 'Extrapolating the area to infinity',
      expr: 'AUCinf = AUCt + Clast/lz', tex: '\\text{AUC}_{0-\\infty} = \\text{AUC}_{0-t} + \\dfrac{C_\\text{last}}{\\lambda_z}',
      vars: {
        AUCinf: { name: 'AUC from zero to infinity', q: false, unit: 'mg·h/L', tex: '\\text{AUC}_{0-\\infty}' },
        AUCt: { name: 'AUC from zero to the last sample', q: false, unit: 'mg·h/L', value: 92, tex: '\\text{AUC}_{0-t}' },
        Clast: { name: 'last measured level', q: false, unit: 'mg/L', value: 1.2, tex: 'C_\\text{last}' },
        lz: { name: 'terminal rate constant', q: false, unit: '1/h', value: 0.15, tex: '\\lambda_z' }
      },
      note: 'The tail is the integral of C_last·e^(−λz t). If it is more than about 20 % of AUC₀₋∞, sample for longer.',
      stories: { AUCinf: 'The trapezoids give {AUCt} up to the last sample, which reads {Clast}; λz = {lz}. What is AUC from zero to infinity?' }
    }
  ],
  examples: [
    {
      title: 'Non-compartmental analysis of a tablet',
      q: 'A hypothetical 400 mg tablet gives these levels: 0 h, 0; 1 h, 4.0; 2 h, 5.0; 4 h, 4.0; 8 h, 2.0; 12 h, 1.0 mg/L. Find $C_\\text{max}$, $t_\\text{max}$, $\\text{AUC}_{0-12}$ by linear-up/log-down, $\\lambda_z$, $\\text{AUC}_{0-\\infty}$ and CL/F.',
      steps: [
        '$C_\\text{max} = 5.0$ mg/L at $t_\\text{max} = 2$ h.',
        'Rising: $\\tfrac12(0 + 4)\\times 1 = 2.0$ and $\\tfrac12(4 + 5) \\times 1 = 4.5$.',
        'Falling, log trapezoids: $(5-4)\\times 2/\\ln 1.25 = 8.96$; $(4-2)\\times 4/\\ln 2 = 11.54$; $(2-1)\\times 4/\\ln 2 = 5.77$. Total $\\text{AUC}_{0-12} = 32.8$ mg·h/L (straight lines everywhere would give 33.5, 2 % more).',
        'The last three points halve every 4 h: $\\lambda_z = 0.693/4 = 0.173$ h⁻¹. Tail $= 1.0/0.173 = 5.8$, so $\\text{AUC}_{0-\\infty} = 38.5$ mg·h/L, 15 % of it extrapolated.',
        '$\\text{CL}/F = 400/38.5 = 10.4$ L/h, and $V_z/F = 10.4/0.173 = 60$ L.'
      ],
      a: 'Cmax 5.0 mg/L at 2 h; AUC₀₋₁₂ 32.8, AUC₀₋∞ 38.5 mg·h/L; λz 0.173 h⁻¹ (t½ 4 h); CL/F ≈ 10.4 L/h.'
    },
    {
      title: 'Faster absorption, same area',
      q: 'Two hypothetical tablets deliver the same drug ($F D/V$ = 10 mg/L, $k$ = 0.1 h⁻¹). One is absorbed with $k_a$ = 1 h⁻¹, the other with $k_a$ = 4 h⁻¹. Compare their peaks and areas.',
      steps: [
        'Slow tablet: $t_\\text{max} = \\ln 10/0.9 = 2.6$ h, $C_\\text{max} = 10\\,e^{-0.26} = 7.7$ mg/L.',
        'Fast tablet: $t_\\text{max} = \\ln 40/3.9 = 0.95$ h, $C_\\text{max} = 10\\,e^{-0.095} = 9.1$ mg/L.',
        'Both: $\\text{AUC} = F D/(V k) = 10/0.1 = 100$ mg·h/L. The peaks differ by 18 %; a bioequivalence study would judge whether the confidence interval of that ratio stays inside 80–125 %.'
      ],
      a: 'Peaks 7.7 mg/L at 2.6 h and 9.1 mg/L at 0.95 h; the same AUC of 100 mg·h/L.'
    }
  ],
  quiz: [
    { q: 'A new tablet of the same drug dissolves faster than the old one. Compared with it, you expect…', choices: ['a higher Cmax, an earlier tmax and the same AUC', 'a higher Cmax and a higher AUC', 'the same Cmax and an earlier tmax', 'a lower Cmax at the same tmax'], a: 0, why: 'The absorption rate shifts the peak; the amount absorbed, and so the AUC, is unchanged if F is the same.' },
    { q: 'On the falling part of the curve, the linear trapezoidal rule…', choices: ['underestimates the area', 'overestimates the area', 'is exact', 'cannot be used'], a: 1, why: 'An exponential decline is convex: its chords lie above the curve. The log trapezoid is exact there.' },
    { q: 'AUC from zero to the last sample is 90 mg·h/L, the last level is 2 mg/L and $\\lambda_z$ = 0.2 per hour. What is AUC from zero to infinity, in mg·h/L?', answer: 100, unit: 'mg·h/L', why: '$90 + 2/0.2 = 100$ mg·h/L, with 10 % extrapolated.' },
    { q: 'For a drug with linear kinetics, doubling the dose makes the peak come later.', a: false, why: '$t_\\text{max} = \\ln(k_a/k)/(k_a - k)$ contains no dose; the peak is twice as high at the same time.' },
    { q: 'A hypothetical drug gives an AUC of 60 mg·h/L after 100 mg into a vein and 45 mg·h/L after 100 mg by mouth. What is its oral bioavailability, in %?', answer: 75, unit: '%', why: '$F = 45/60 = 0.75$ — clearance is the same, so the ratio of areas is the ratio of systemic doses.' }
  ],
  problems: [
    { q: 'Two samples 6 h apart on the falling limb read 12 and 3 mg/L. What is the log-trapezoid area between them (mg·h/L)?', answer: 38.95, unit: 'mg·h/L', tol: 0.02,
      steps: ['$(12 - 3) \\times 6/\\ln(12/3) = 54/1.386 = 38.95$ mg·h/L.', 'The linear trapezoid would give $\\tfrac12(12 + 3) \\times 6 = 45$ mg·h/L — 16 % too much, because the samples are two half-lives apart.'] },
    { q: 'A hypothetical drug is absorbed with $k_a$ = 2 h⁻¹ and eliminated with $k$ = 0.2 h⁻¹. When does its level peak (h)?', answer: 1.28, unit: 'h', tol: 0.02,
      steps: ['$t_\\text{max} = \\ln(2/0.2)/(2 - 0.2) = 2.303/1.8 = 1.28$ h.'] }
  ],
  applications: ['Measuring bioavailability and proving bioequivalence of generic medicines.', 'Checking dose proportionality in early clinical studies.', 'Choosing sampling times for pharmacokinetic studies and for therapeutic drug monitoring.', 'Linking exposure to effect: AUC/MIC targets for antibiotics, AUC-guided dosing of some cancer and transplant medicines.'],
  history: 'Friedrich Dost stated the "law of corresponding areas" in 1953: equal areas mean equal amounts reaching the blood, the basis of every bioavailability study. Win Chiou showed in 1978 how much the linear trapezoidal rule can err on the falling limb, and linear-up/log-down became the standard of non-compartmental software.',
  sim: 'pkb-nca'
},

{
  id: 'protein-binding', parent: 'pk-basics', title: 'Protein binding', level: 2,
  short: 'Many drugs travel partly bound to plasma proteins — acids mainly to albumin, bases to α1-acid glycoprotein. Only the unbound fraction fu crosses membranes, acts and is cleared; binding shapes volume and clearance, and matters most when a total level is read in someone with low albumin.',
  keywords: ['protein binding', 'fraction unbound', 'fu', 'free drug', 'free drug hypothesis', 'albumin', 'alpha-1-acid glycoprotein', 'AAG', 'Sudlow sites', 'displacement', 'hypoalbuminaemia', 'dissociation constant', 'Kd', 'equilibrium dialysis', 'ultrafiltration', 'restrictive clearance', 'Sheiner–Tozer', 'free level'],
  prereq: ['adme', 'medicine:blood-composition', 'chemistry:equilibrium-constant'],
  related: ['volume-distribution', 'hepatic-clearance', 'tdm', 'drug-interactions', 'renal-adjustment', 'biology:membrane-structure'],
  body: `
Most drugs in plasma are partly stuck to proteins. The binding is reversible and fast — a molecule stays on for milliseconds to seconds — so bound and free drug are always in equilibrium:

$$\\ce{D + P <=> DP}, \\qquad K_d = \\frac{[\\ce{D}]\\,[\\ce{P}]}{[\\ce{DP}]}$$

The **fraction unbound** is $f_u = C_u/C$. It matters because only unbound drug crosses capillary walls and cell membranes, reaches receptors, is filtered by the glomerulus and meets the enzymes inside liver cells — the *free drug hypothesis*. At equilibrium the unbound concentrations on the two sides of a membrane are equal, even when the totals are very different.

### The binding proteins
**Albumin** (35–50 g/L, about 0.6 mmol/L of a 66.5 kDa protein) binds mainly acidic and neutral drugs, at two main pockets known as Sudlow sites I and II. **α1-acid glycoprotein** (0.5–1 g/L) binds many basic drugs; it is an acute-phase protein whose level can double or triple after surgery, trauma or inflammation. Lipoproteins carry some very lipophilic drugs, and a few drugs enter red cells.

### How large is fu?
For one class of sites, with much less drug than protein, the equilibrium gives

$$f_u = \\frac{K_d}{K_d + [\\ce{P}]}$$

With albumin at 600 µmol/L and $K_d$ = 6 µmol/L, $f_u$ is 1 %; if albumin falls to 300 µmol/L (20 g/L), $f_u$ doubles to 2 %. When drug levels approach the protein concentration, the sites saturate and $f_u$ rises with the dose — valproate is the classic example. Some teaching values:

| Drug | Bound | $f_u$ |
|---|---|---|
| warfarin | 99 % | 0.01 |
| phenytoin | about 90 % | 0.1 |
| digoxin | about 25 % | 0.75 |
| gentamicin | under 10 % | above 0.9 |
| lithium | none | 1 |

### What binding does
- **Volume**: $V = V_P + V_T f_u/f_{uT}$ — plasma binding keeps a drug in the blood ([[volume-distribution]]).
- **Clearance**: filtration clears $f_u \\cdot \\text{GFR}$; the liver clears a low-extraction drug at about $f_u \\cdot \\text{CL}_\\text{int}$, but a high-extraction drug at about liver blood flow, whatever its binding ([[hepatic-clearance]]).
- **Effect**: follows the unbound concentration.

### Displacement and low albumin
Suppose $f_u$ doubles, because another drug competes for the site or albumin has fallen. For a low-extraction drug taken by mouth, total clearance $f_u \\cdot \\text{CL}_\\text{int}$ doubles, so the total steady-state level halves — but the unbound level, (dosing rate)/$\\text{CL}_\\text{int}$, does not change. After a brief transient the free level, and the effect, are back where they were. That is why most displacement interactions matter little in practice; the exceptions are mainly high-extraction drugs given intravenously with a narrow margin.

The real trap is **interpretation**. A total level that looks low in someone with low albumin may hide a perfectly normal unbound level; raising the dose to "correct" the total can cause toxicity. For phenytoin, a rough correction scales the total level to what it would be at normal albumin; measuring the unbound level is better ([[tdm]]).

### Measuring binding
**Equilibrium dialysis** — plasma and buffer on either side of a membrane that stops proteins, at 37 °C until the free drug has equalised — is the reference. **Ultrafiltration** is faster and is used for free levels in the clinic. Temperature and pH must be controlled, and binding above 99 % is hard to measure precisely.

> [!key] Only unbound drug acts and is cleared. Changes in binding shift the total level far more than the unbound level — so read total levels with the albumin in mind.
`,
  ideas: [
    'Binding is fast and reversible; only the unbound fraction fu = Cu/C crosses membranes, acts and is filtered.',
    'Albumin binds mostly acids, α1-acid glycoprotein mostly bases; both levels change in disease.',
    'For one class of sites with little drug, fu = Kd/(Kd + [P]): halving the protein roughly doubles fu.',
    'For a low-extraction drug at steady state, a rise in fu lowers the total level but leaves the unbound level unchanged.',
    'Interpret total levels with the albumin in mind; measure free levels when binding is abnormal.'
  ],
  pitfalls: [
    'A displacing drug permanently raises the free level of the displaced drug — For most drugs clearance of the extra free drug brings the unbound level back within a few half-lives; only the total level stays lower.',
    'A low total level always means too little drug — With low albumin the unbound level can be normal or high while the total looks low.',
    'Bound drug is lost drug — Binding is a reversible reservoir: bound drug dissociates as free drug is cleared, and it is part of the exposure.'
  ],
  formulas: [
    {
      name: 'Unbound concentration',
      expr: 'Cu = fu*C', tex: 'C_u = f_u\\,C',
      vars: {
        Cu: { name: 'unbound concentration', q: 'massconc', unit: 'mg/L', tex: 'C_u' },
        fu: { name: 'fraction unbound', q: 'ratio', unit: '%', value: 10, min: 0, max: 100, tex: 'f_u' },
        C: { name: 'total plasma concentration', q: 'massconc', unit: 'mg/L', value: 12, tex: 'C' }
      },
      stories: { Cu: 'A drug is {fu} unbound and its total level is {C}. What is the unbound concentration?', fu: 'A total level of {C} contains {Cu} of free drug. What is the fraction unbound?' }
    },
    {
      name: 'Fraction unbound for one class of sites',
      expr: 'fu = Kd/(Kd + P)', tex: 'f_u = \\dfrac{K_d}{K_d + \\mathrm{[P]}}',
      vars: {
        fu: { name: 'fraction unbound', q: 'ratio', unit: '%', tex: 'f_u' },
        Kd: { name: 'dissociation constant', q: 'concentration', unit: 'µM', value: 6, tex: 'K_d' },
        P: { name: 'free binding-site concentration', q: 'concentration', unit: 'µM', value: 600, tex: '\\mathrm{[P]}' }
      },
      note: 'Valid when the drug occupies few of the sites, so [P] ≈ the total site concentration. Albumin at 40 g/L is about 600 µM.',
      stories: { fu: 'A drug binds albumin ({P} of sites) with Kd = {Kd}. What fraction is unbound?', P: 'A drug with Kd = {Kd} is {fu} unbound. What concentration of free binding sites does that imply?' }
    },
    {
      name: 'Total level corrected for low albumin (Sheiner–Tozer)',
      expr: 'Cn = Cobs/(0.2*alb + 0.1)', tex: 'C_\\text{norm} = \\dfrac{C_\\text{obs}}{0.2\\,\\text{alb} + 0.1}',
      vars: {
        Cn: { name: 'level expected at normal albumin', q: false, unit: 'mg/L', tex: 'C_\\text{norm}' },
        Cobs: { name: 'measured total level', q: false, unit: 'mg/L', value: 7, tex: 'C_\\text{obs}' },
        alb: { name: 'serum albumin', q: false, unit: 'g/dL', value: 2.0, tex: '\\text{alb}' }
      },
      note: 'An empirical adult correction for phenytoin with albumin in g/dL (divide g/L by 10); it is less reliable in kidney failure and critical illness, where measuring the unbound level is preferred.',
      practice: { unknowns: ['Cn'] },
      stories: { Cn: 'A total level of {Cobs} is measured when the albumin is {alb}. What would the level be at normal albumin?' }
    },
    {
      name: 'Total steady-state level of a low-extraction drug',
      expr: 'Css = R/(fu*CLint)', tex: 'C_{ss} = \\dfrac{R_\\text{in}}{f_u\\,\\text{CL}_\\text{int}}',
      vars: {
        Css: { name: 'total steady-state level', q: false, unit: 'mg/L', tex: 'C_{ss}' },
        R: { name: 'dosing rate reaching the circulation', q: false, unit: 'mg/h', value: 10, tex: 'R_\\text{in}' },
        fu: { name: 'fraction unbound (fraction)', value: 0.1, min: 0.0001, max: 1, tex: 'f_u' },
        CLint: { name: 'intrinsic clearance of unbound drug', q: false, unit: 'L/h', value: 20, tex: '\\text{CL}_\\text{int}' }
      },
      note: 'The unbound level is f_u·C_ss = R/CL_int: it does not depend on f_u. A change in binding moves the total level, not the free one.',
      practice: { unknowns: ['Css'] },
      stories: { Css: 'A low-extraction drug enters the circulation at {R}; fu = {fu} and CL_int = {CLint}. What is the total steady-state level?' }
    }
  ],
  examples: [
    {
      title: 'Albumin and the free fraction',
      q: 'A hypothetical acidic drug binds one site on albumin with $K_d$ = 6 µM. Albumin (66.5 kDa) is 40 g/L in health and 20 g/L in a person with nephrotic syndrome. Compare $f_u$, and the total and unbound steady-state levels on the same dosing rate (the drug is a low-extraction, liver-cleared drug).',
      steps: [
        'Albumin: $40/66\\,500 = 6.0\\times10^{-4}$ M = 600 µM, and 300 µM at 20 g/L.',
        '$f_u = 6/(6 + 600) = 0.99$ % in health and $6/(6 + 300) = 1.96$ % with low albumin — twice as much free drug per unit of total.',
        'Total clearance $f_u\\,\\text{CL}_\\text{int}$ doubles, so the total level halves; the unbound level, $R/\\text{CL}_\\text{int}$, is unchanged — and so is the effect.'
      ],
      a: 'fu doubles from 1 % to 2 %; the total level halves while the unbound level stays the same.'
    },
    {
      title: 'A low total level with low albumin',
      q: 'A person taking phenytoin (whose usual total range is often quoted as 10–20 mg/L, unbound 1–2 mg/L) has a total level of 7 mg/L with serum albumin 2.0 g/dL. How should the level be read?',
      steps: [
        'Sheiner–Tozer: $C_\\text{norm} = 7/(0.2 \\times 2.0 + 0.1) = 7/0.5 = 14$ mg/L.',
        'At normal binding ($f_u \\approx 0.1$), 14 mg/L corresponds to about 1.4 mg/L unbound; with low albumin $f_u$ is about 0.2, and $0.2 \\times 7 = 1.4$ mg/L too.',
        'The unbound level is within the usual range although the total looks low. A dose increase to "correct" the total could cause toxicity; the clinical team would ideally measure the unbound level. Ranges vary between laboratories and guidelines.'
      ],
      a: 'Corrected to about 14 mg/L: the unbound level is probably normal.'
    }
  ],
  quiz: [
    { q: 'The main plasma protein binding acidic drugs is…', choices: ['albumin', 'α1-acid glycoprotein', 'haemoglobin', 'immunoglobulin G'], a: 0, why: 'Albumin carries most acidic and neutral drugs; α1-acid glycoprotein binds many bases.' },
    { q: 'A drug is 95 % bound and its total plasma level is 20 mg/L. What is the unbound concentration, in mg/L?', answer: 1, unit: 'mg/L', why: '$C_u = f_u C = 0.05 \\times 20 = 1$ mg/L.' },
    { q: 'When a second drug displaces a low-extraction drug from albumin, the unbound level of the first stays permanently higher at steady state.', a: false, why: 'The extra free drug is cleared ($\\text{CL} = f_u \\text{CL}_\\text{int}$ rises), so after a transient the unbound level returns to dosing rate/$\\text{CL}_\\text{int}$; only the total level falls.' },
    { q: 'In severe inflammation α1-acid glycoprotein rises. For a basic drug bound mainly to it, $f_u$…', choices: ['rises', 'falls', 'does not change', 'becomes 1'], a: 1, why: 'More binding protein means more drug bound: $f_u = K_d/(K_d + [\\ce{P}])$ falls, and total levels rise with little change in the unbound level.' },
    { q: 'Which method is the reference for measuring plasma protein binding?', choices: ['equilibrium dialysis', 'centrifuging whole blood', 'measuring urine levels', 'counting red cells'], a: 0, why: 'Dialysis against buffer across a membrane that holds back proteins lets the free drug equalise; the buffer then contains the unbound concentration.' }
  ],
  problems: [
    { q: 'Albumin is 30 g/L (66 500 g/mol) and a drug binds one site on it with $K_d$ = 20 µM, at levels far below the albumin. What is $f_u$, in %?', answer: 4.25, unit: '%', tol: 0.03,
      steps: ['Albumin: $30/66\\,500 = 4.51\\times10^{-4}$ M = 451 µM.', '$f_u = 20/(20 + 451) = 0.0425$ = 4.25 %.'] }
  ],
  applications: ['Interpreting total drug levels when albumin is low (kidney and liver disease, malnutrition, pregnancy, critical illness).', 'Predicting which interactions by displacement could matter — and why most do not.', 'Choosing which drugs dialysis or plasma exchange can remove.', 'Designing long-acting drugs: albumin binding by a fatty-acid chain stretches the half-life of some peptide medicines to days.'],
  history: 'Gordon Sudlow, Donald Birkett and David Wade mapped the two main drug-binding sites of albumin in 1975–76. Lewis Sheiner and Thomas Tozer described the albumin correction for phenytoin levels in 1978, and Leslie Benet and Betty-ann Hoener showed in 2002 why most changes in binding have little clinical effect.',
  sim: 'pkb-binding'
},

/* ================================================================ SPECIAL SITUATIONS */

{
  id: 'renal-adjustment', parent: 'pk-special', title: 'Dosing in kidney impairment', level: 2,
  short: 'When the kidneys fail, the drugs they clear build up. The fraction excreted unchanged (fe) and an estimate of kidney function — creatinine clearance by Cockcroft–Gault, or eGFR — predict the fall in clearance; the dose is then reduced, the interval lengthened, or both.',
  keywords: ['renal impairment', 'kidney disease', 'dose adjustment', 'Cockcroft–Gault', 'creatinine clearance', 'eGFR', 'CKD-EPI', 'serum creatinine', 'fraction excreted unchanged', 'Dettli', 'Giusti–Hayton', 'adjustment factor', 'interval extension', 'dose reduction', 'loading dose', 'dialysis', 'active metabolites', 'acute kidney injury'],
  prereq: ['clearance', 'adme', 'medicine:kidney-tests', 'medicine:chronic-kidney-disease'],
  related: ['half-life', 'tdm', 'paediatric-geriatric', 'loading-dose', 'multiple-dosing', 'protein-binding', 'medicine:dialysis-transplant', 'medicine:acute-kidney-injury'],
  body: `
Chronic kidney disease affected about 9 % of people worldwide in 2017 (Global Burden of Disease estimate), and kidney function also falls with age and in acute illness. For a drug the kidneys clear, less function means lower clearance, a longer half-life and — on an unchanged regimen — a higher level. Adjusting the dose takes two numbers: how much of the drug's clearance is renal, $f_e$ ([[adme]]), and how well the kidneys work.

### Estimating kidney function
GFR is rarely measured directly; it is estimated from serum creatinine, a waste product of muscle. Donald Cockcroft and Henry Gault fitted their equation in 1975 to 249 men:

$$\\text{CrCl} = \\frac{(140 - \\text{age}) \\times W}{72 \\times S_{cr}} \\quad (\\times\\,0.85 \\text{ for women})$$

with age in years, weight in kg and creatinine in mg/dL (µmol/L ÷ 88.4), giving mL/min. Laboratories report eGFR from the CKD-EPI equation (refitted without a race term in 2021), normalised to 1.73 m² of body surface; for dosing it is converted back to the person's size (× BSA/1.73), or Cockcroft–Gault is used, because many product labels defined their kidney categories with it. Every estimate misleads when creatinine is not steady — in acute kidney injury it lags a day or more behind the fall in function — when muscle mass is unusual, and in obesity, where the choice of weight matters ([[medicine:kidney-tests]]).

### How much does clearance fall?
Assume non-renal clearance is unchanged and renal clearance falls in proportion to creatinine clearance. With $\\text{KF} = \\text{CrCl}_\\text{patient}/\\text{CrCl}_\\text{normal}$ (normal taken as about 120 mL/min), the patient's clearance as a fraction of normal is

$$Q = 1 - f_e\\,(1 - \\text{KF})$$

| $f_e$ | KF = 0.5 | KF = 0.25 | KF = 0.1 |
|---|---|---|---|
| 0.9 | 0.55 | 0.33 | 0.19 |
| 0.5 | 0.75 | 0.63 | 0.55 |
| 0.1 | 0.95 | 0.93 | 0.91 |

Drugs with $f_e$ below about 0.3 rarely need a change for kidney function alone.

### Smaller doses or longer intervals?
Both keep the average level, because $C_{ss,\\text{avg}} \\propto D/(\\tau \\cdot \\text{CL})$:

- **A smaller dose at the same interval** ($D \\times Q$): the same average with lower peaks and higher troughs — suits drugs that must stay above a threshold.
- **The same dose at a longer interval** ($\\tau/Q$): the same peaks and troughs as with normal kidneys, and fewer doses — suits drugs whose effect follows the peak and whose toxicity follows the trough, such as aminoglycoside antibiotics.

In practice intervals are rounded to 12, 24 or 48 h and doses to available strengths. The **loading dose** depends on volume, not clearance, so the first dose is usually unchanged; but the plateau takes longer to reach, because the half-life is longer by $1/Q$ ([[loading-dose]]).

### Beyond clearance
- **Metabolites** cleared by the kidney can accumulate even when the parent is metabolised: morphine-6-glucuronide (active) and norpethidine (which can cause seizures) are classic examples.
- **Binding**: uraemia lowers the albumin binding of acidic drugs ([[protein-binding]]).
- **Nephrotoxic drugs** — aminoglycosides, NSAIDs — can worsen the very function that clears them.
- **Dialysis** removes drugs that are small, water-soluble, poorly bound and have small volumes; doses are timed around sessions ([[medicine:dialysis-transplant]]).

> [!warn] Dose changes for kidney function are made by prescribers and pharmacists from the product information, renal dosing references and local guidance, often with measured levels ([[tdm]]). The numbers here are illustrations. Do not change the dose of a medicine yourself; if your kidney function has changed, ask your doctor or pharmacist whether your medicines need review.
`,
  ideas: [
    'Kidney function is estimated from creatinine: Cockcroft–Gault creatinine clearance or eGFR (converted to the person\'s size for dosing).',
    'Q = 1 − fe(1 − KF): the fall in clearance depends on the renal share fe and the fraction of kidney function left.',
    'Reducing the dose to D·Q or stretching the interval to τ/Q keeps the same average level; they differ in peaks and troughs.',
    'The loading dose is usually unchanged; the half-life, and the time to steady state, lengthen by 1/Q.',
    'Renally cleared metabolites, changed binding, nephrotoxicity and dialysis all need attention beyond the parent drug\'s clearance.'
  ],
  pitfalls: [
    'A normal serum creatinine means normal kidney function — In older or frail people with little muscle, and early in acute kidney injury, creatinine can be normal while GFR is low.',
    'Every drug needs a lower dose in kidney disease — Only drugs (or active metabolites) with a substantial renal share; a drug with fe = 0.05 hardly changes.',
    'In kidney failure the first dose should be reduced too — The loading dose fills the volume of distribution, which is usually unchanged; it is the maintenance dose that falls.'
  ],
  formulas: [
    {
      name: 'Cockcroft–Gault creatinine clearance',
      expr: 'CrCl = (140 - age)*W*fs/(72*Scr)', tex: '\\text{CrCl} = \\dfrac{(140 - \\text{age})\\,W\\,f_\\text{sex}}{72\\,S_{cr}}',
      vars: {
        CrCl: { name: 'creatinine clearance', q: false, unit: 'mL/min', tex: '\\text{CrCl}' },
        age: { name: 'age', q: false, unit: 'years', value: 70, min: 18, max: 110, tex: '\\text{age}' },
        W: { name: 'body weight', q: false, unit: 'kg', value: 60, tex: 'W' },
        fs: { name: 'sex factor (1 for men, 0.85 for women)', value: 0.85, fixed: true, tex: 'f_\\text{sex}' },
        Scr: { name: 'serum creatinine', q: false, unit: 'mg/dL', value: 1.4, tex: 'S_{cr}' }
      },
      note: 'An empirical adult equation: creatinine in mg/dL (µmol/L ÷ 88.4), weight in kg, age in years. Not valid when creatinine is changing, in children, or at extremes of muscle mass.',
      practice: { unknowns: ['CrCl'] },
      stories: { CrCl: 'A hypothetical patient aged {age}, weighing {W}, has a serum creatinine of {Scr} (sex factor {fs}). What is the Cockcroft–Gault creatinine clearance?' }
    },
    {
      name: 'Clearance as a fraction of normal',
      expr: 'Q = 1 - fe*(1 - KF)', tex: 'Q = 1 - f_e\\,(1 - \\text{KF})',
      vars: {
        Q: { name: 'patient\'s clearance ÷ normal clearance', q: 'ratio', unit: '%', tex: 'Q' },
        fe: { name: 'fraction excreted unchanged (normal kidneys)', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'f_e' },
        KF: { name: 'kidney function left (CrCl ÷ normal CrCl)', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: '\\text{KF}' }
      },
      note: 'Assumes non-renal clearance is unchanged and renal clearance is proportional to creatinine clearance.',
      stories: { Q: 'A drug has fe = {fe}; the patient has {KF} of normal kidney function. What fraction of normal clearance remains?', KF: 'For a drug with fe = {fe}, how much kidney function is left when clearance has fallen to {Q} of normal?' }
    },
    {
      name: 'Reduced dose at the same interval',
      expr: 'D2 = D1*(1 - fe*(1 - CrCl/CrCln))', tex: 'D_2 = D_1\\left[1 - f_e\\left(1 - \\dfrac{\\text{CrCl}}{\\text{CrCl}_n}\\right)\\right]',
      vars: {
        D2: { name: 'adjusted dose', q: 'mass', unit: 'mg', tex: 'D_2' },
        D1: { name: 'usual dose', q: 'mass', unit: 'mg', value: 500, tex: 'D_1' },
        fe: { name: 'fraction excreted unchanged', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: 'f_e' },
        CrCl: { name: 'patient\'s creatinine clearance', q: 'flowrate', unit: 'mL/min', value: 31, tex: '\\text{CrCl}' },
        CrCln: { name: 'normal creatinine clearance', q: 'flowrate', unit: 'mL/min', value: 120, tex: '\\text{CrCl}_n' }
      },
      note: 'Keeps the average level. Illustrative only: real adjustments follow the product information.',
      practice: { unknowns: ['D2'] },
      stories: { D2: 'A hypothetical drug (fe = {fe}) is usually given as {D1}. What dose at the same interval keeps the average level for a creatinine clearance of {CrCl} (normal {CrCln})?' }
    },
    {
      name: 'Longer interval with the same dose',
      expr: 'tau2 = tau1/(1 - fe*(1 - CrCl/CrCln))', tex: '\\tau_2 = \\dfrac{\\tau_1}{1 - f_e\\left(1 - \\text{CrCl}/\\text{CrCl}_n\\right)}',
      vars: {
        tau2: { name: 'adjusted interval', q: 'time', unit: 'h', tex: '\\tau_2' },
        tau1: { name: 'usual interval', q: 'time', unit: 'h', value: 8, tex: '\\tau_1' },
        fe: { name: 'fraction excreted unchanged', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: 'f_e' },
        CrCl: { name: 'patient\'s creatinine clearance', q: 'flowrate', unit: 'mL/min', value: 31, tex: '\\text{CrCl}' },
        CrCln: { name: 'normal creatinine clearance', q: 'flowrate', unit: 'mL/min', value: 120, tex: '\\text{CrCl}_n' }
      },
      note: 'Keeps the average level and the normal peaks and troughs. In practice the interval is rounded to a convenient one.',
      practice: { unknowns: ['tau2'] },
      stories: { tau2: 'A hypothetical drug (fe = {fe}) is usually given every {tau1}. How far apart should the same doses be for a creatinine clearance of {CrCl} (normal {CrCln})?' }
    }
  ],
  examples: [
    {
      title: 'A hypothetical patient',
      q: 'A 78-year-old woman weighing 55 kg has a serum creatinine of 1.3 mg/dL (115 µmol/L). Hypothetical drug Z has $f_e$ = 0.8 and is normally given as 500 mg every 8 h. Estimate her creatinine clearance and the two ways of adjusting.',
      steps: [
        '$\\text{CrCl} = (140 - 78) \\times 55 \\times 0.85/(72 \\times 1.3) = 2899/93.6 = 31$ mL/min.',
        '$\\text{KF} = 31/120 = 0.26$; $Q = 1 - 0.8 \\times (1 - 0.26) = 0.41$.',
        'Either about 200 mg every 8 h ($500 \\times 0.41$), or 500 mg every $8/0.41 = 19.7$ h — rounded in practice to a workable interval.',
        'Her half-life is $1/0.41 = 2.5$ times normal, so steady state takes 2.5 times longer; a full first dose would still be appropriate if a quick effect is needed.'
      ],
      a: 'CrCl ≈ 31 mL/min, Q ≈ 0.41: about 200 mg every 8 h or 500 mg about every 20 h (illustrative).'
    },
    {
      title: 'Same average, different swings',
      q: 'Drug Z normally has a half-life of 2 h. For the patient above ($Q$ = 0.41), compare the peak-to-trough ratio of the two regimens with normal kidneys (rapid absorption assumed).',
      steps: [
        'Normal: $k = 0.347$ h⁻¹, and every 8 h the level falls by $e^{0.347 \\times 8} = 16$-fold.',
        'Patient: $k = 0.347 \\times 0.41 = 0.141$ h⁻¹.',
        '200 mg every 8 h: the ratio is $e^{0.141 \\times 8} = 3.1$ — a much flatter profile.',
        '500 mg every 19.7 h: $e^{0.141 \\times 19.7} = 16$ — the same peaks and troughs as normal.'
      ],
      a: 'Dose reduction flattens the curve (3-fold swing); interval extension reproduces the normal 16-fold swing.'
    }
  ],
  quiz: [
    { q: 'A 60-year-old man weighing 80 kg has a serum creatinine of 1.0 mg/dL. What is his Cockcroft–Gault creatinine clearance, in mL/min?', answer: 88.9, unit: 'mL/min', why: '$(140 - 60) \\times 80/(72 \\times 1.0) = 6400/72 = 88.9$ mL/min.' },
    { q: 'Which drug needs the largest adjustment when kidney function falls?', choices: ['one with fe = 0.05', 'one with fe = 0.3', 'one with fe = 0.6', 'one with fe = 0.95'], a: 3, why: 'In $Q = 1 - f_e(1 - \\text{KF})$, the larger the renal share, the more clearance falls.' },
    { q: 'In kidney impairment, the loading dose of a drug whose volume of distribution is unchanged is usually…', choices: ['unchanged', 'halved', 'reduced in proportion to creatinine clearance', 'left out'], a: 0, why: 'A loading dose fills the volume of distribution; clearance does not enter it.' },
    { q: 'Stretching the interval to τ/Q and reducing the dose to D·Q give the same average steady-state level.', a: true, why: 'Both scale the dosing rate D/τ by Q, and the average level is dosing rate ÷ clearance.' },
    { q: 'On the first day of acute kidney injury, a serum creatinine that is still normal means…', choices: ['kidney function is normal', 'creatinine lags behind: function may already be much lower', 'doses can be increased', 'Cockcroft–Gault overestimates age'], a: 1, why: 'Creatinine accumulates slowly after filtration falls, so equations based on it overestimate function until it reaches a new steady state.' }
  ],
  problems: [
    { q: 'A hypothetical drug has $f_e$ = 0.7 and is normally given as 300 mg every 12 h. A patient\'s creatinine clearance is 40 mL/min (normal 120). What dose every 12 h keeps the usual average level (mg)?', answer: 160, unit: 'mg', tol: 0.02,
      steps: ['$\\text{KF} = 40/120 = 0.333$; $Q = 1 - 0.7 \\times 0.667 = 0.533$.', '$300 \\times 0.533 = 160$ mg every 12 h.'] }
  ],
  applications: ['Renal dose tables in product information and in hospital formularies.', 'Antibiotic dosing in older people and in intensive care.', 'Timing doses around haemodialysis sessions.', 'Clinical pharmacology studies in renal impairment required before approval of most new medicines.'],
  history: 'The adjustment factor $1 - f_e(1 - \\text{KF})$ is associated with Dean Giusti and William Hayton (1973) and with Luzius Dettli, whose nomograms (1974) made it practical at the bedside. Cockcroft and Gault published their creatinine clearance equation in 1975; half a century later it is still printed in many product labels.',
  sim: 'pkb-renal'
},

{
  id: 'hepatic-clearance', parent: 'pk-special', title: 'Hepatic clearance and extraction', level: 3,
  short: 'How fast the liver clears a drug depends on blood flow, the unbound fraction and the intrinsic activity of its enzymes, combined by the well-stirred model. High-extraction drugs are limited by flow and lose much of an oral dose on the first pass; low-extraction drugs are limited by enzymes and binding.',
  keywords: ['hepatic clearance', 'extraction ratio', 'well-stirred model', 'intrinsic clearance', 'CLint', 'hepatic blood flow', 'flow-limited', 'capacity-limited', 'restrictive clearance', 'first-pass', 'hepatic bioavailability', 'enzyme induction', 'enzyme inhibition', 'cirrhosis', 'portosystemic shunt', 'Child–Pugh', 'IVIVE', 'microsomes', 'parallel-tube model'],
  prereq: ['clearance', 'protein-binding', 'first-pass', 'medicine:liver-function'],
  related: ['bioavailability', 'drug-interactions', 'pharmacogenomics', 'nonlinear-pk', 'paediatric-geriatric', 'medicine:liver-disease', 'medicine:heart-failure'],
  body: `
### Three things decide
The liver receives about 1.5 L of blood a minute — a quarter of cardiac output, three-quarters of it through the portal vein from the gut. As the blood seeps along the sinusoids, unbound drug enters the liver cells and meets their enzymes. Three quantities decide how much is removed:

- **blood flow** $Q_H$ — how fast drug is delivered;
- the **fraction unbound** $f_u$ — how much of it can enter the cells;
- the **intrinsic clearance** $\\text{CL}_\\text{int}$ — the enzymes' capacity for unbound drug when delivery is not limiting; at low concentrations $V_\\text{max}/K_m$ ([[chemistry:enzyme-kinetics|Michaelis–Menten]]).

### The well-stirred model
Treat the liver as one well-mixed pool whose unbound concentration equals that in the blood leaving it. What the blood loses, $Q_H(C_\\text{in} - C_\\text{out})$, is what the enzymes remove, $f_u\\,\\text{CL}_\\text{int}\\,C_\\text{out}$. Solving for the extraction ratio:

$$E_H = \\frac{f_u\\,\\text{CL}_\\text{int}}{Q_H + f_u\\,\\text{CL}_\\text{int}}, \\qquad \\text{CL}_H = Q_H E_H = \\frac{Q_H\\,f_u\\,\\text{CL}_\\text{int}}{Q_H + f_u\\,\\text{CL}_\\text{int}}$$

### Two limits
- **Low extraction** ($f_u \\text{CL}_\\text{int} \\ll Q_H$, $E_H$ below about 0.3): $\\text{CL}_H \\approx f_u\\,\\text{CL}_\\text{int}$. Clearance follows the enzymes and binding — sensitive to induction, inhibition and genetic variants, hardly to blood flow. Teaching examples: warfarin, theophylline, diazepam.
- **High extraction** ($f_u \\text{CL}_\\text{int} \\gg Q_H$, $E_H$ above about 0.7): $\\text{CL}_H \\approx Q_H$. The liver removes nearly all it receives, so clearance falls with blood flow — in heart failure or shock — and hardly with enzymes or binding. Teaching examples: propranolol, lidocaine, verapamil, glyceryl trinitrate.

### The first pass, and a surprise
A swallowed drug passes the gut wall and the liver before it reaches the circulation, so

$$F = F_a \\cdot F_G \\cdot (1 - E_H)$$

where $F_a$ is the fraction absorbed and $F_G$ the fraction escaping metabolism in the gut wall. High-extraction drugs have low oral bioavailability — about 25 % for propranolol; for glyceryl trinitrate so little that it is given under the tongue or through the skin ([[first-pass]]). Combine $F_H = 1 - E_H$ with $\\text{CL}_H$ and blood flow cancels:

$$\\text{AUC}_\\text{oral} = \\frac{F_a F_G\\,D}{f_u\\,\\text{CL}_\\text{int}}$$

After an oral dose, exposure depends on enzymes and binding for *every* drug, whatever its extraction. So an enzyme inhibitor can double the oral AUC of a high-extraction drug while barely changing its intravenous clearance — the mechanism behind many serious interactions ([[drug-interactions]]).

### Liver disease
Cirrhosis reduces the working liver cells ($\\text{CL}_\\text{int}$), blood flow and albumin, and diverts portal blood around the liver through shunts, so the oral bioavailability of high-extraction drugs can rise several-fold. There is no marker of the liver's drug-clearing capacity as convenient as creatinine is for the kidney; product labels grade liver impairment with the Child–Pugh score ([[medicine:liver-disease]]).

### From the test tube to the patient
$\\text{CL}_\\text{int}$ is measured with liver microsomes or hepatocytes and scaled up — roughly 30–40 mg of microsomal protein per gram of liver and 1.5–1.8 kg of liver in an adult — then entered into the well-stirred model: *in vitro–in vivo extrapolation*. The parallel-tube model, which lets the concentration fall along each sinusoid, gives similar answers except at high extraction.

> [!key] Low extraction: $\\text{CL}_H \\approx f_u \\text{CL}_\\text{int}$ — enzymes and binding matter. High extraction: $\\text{CL}_H \\approx Q_H$ — blood flow matters, and the first pass removes most of an oral dose.
`,
  ideas: [
    'Hepatic clearance depends on blood flow Q_H, fraction unbound f_u and intrinsic clearance CL_int.',
    'Well-stirred model: CL_H = Q_H·f_u·CL_int/(Q_H + f_u·CL_int), E_H = f_u·CL_int/(Q_H + f_u·CL_int).',
    'Low extraction: CL_H ≈ f_u·CL_int (enzyme- and binding-sensitive); high extraction: CL_H ≈ Q_H (flow-sensitive).',
    'Oral bioavailability F = F_a·F_G·(1 − E_H): high-extraction drugs lose most of an oral dose on the first pass.',
    'Oral AUC = F_a·F_G·D/(f_u·CL_int): after oral dosing, enzymes and binding decide exposure for every drug.'
  ],
  pitfalls: [
    'An enzyme inhibitor matters little for a high-extraction drug — Its intravenous clearance barely changes, but its oral bioavailability and oral AUC can rise several-fold.',
    'A drug\'s hepatic clearance can exceed liver blood flow if its enzymes are very active — Blood clearance is capped at Q_H; extra enzyme capacity only pushes E_H closer to 1.',
    'Liver disease affects every hepatically cleared drug in the same way — Flow, enzyme capacity, binding and shunting change differently, and each matters for a different kind of drug.'
  ],
  formulas: [
    {
      name: 'Hepatic clearance (well-stirred model)',
      expr: 'CLH = QH*fu*CLint/(QH + fu*CLint)', tex: '\\text{CL}_H = \\dfrac{Q_H\\,f_u\\,\\text{CL}_\\text{int}}{Q_H + f_u\\,\\text{CL}_\\text{int}}',
      vars: {
        CLH: { name: 'hepatic blood clearance', q: 'flowrate', unit: 'L/h', tex: '\\text{CL}_H' },
        QH: { name: 'liver blood flow', q: 'flowrate', unit: 'L/h', value: 90, tex: 'Q_H' },
        fu: { name: 'fraction unbound in blood', q: 'ratio', unit: '%', value: 10, min: 0.01, max: 100, tex: 'f_u' },
        CLint: { name: 'intrinsic clearance of unbound drug', q: 'flowrate', unit: 'L/h', value: 300, tex: '\\text{CL}_\\text{int}' }
      },
      note: 'Liver blood flow is about 90 L/h (1.5 L/min) in an adult. The clearance can never exceed Q_H.',
      practice: { unknowns: ['CLH', 'CLint'] },
      stories: { CLH: 'Liver blood flow is {QH}; a drug is {fu} unbound with an intrinsic clearance of {CLint}. What is its hepatic clearance?', CLint: 'A drug {fu} unbound has a hepatic clearance of {CLH} at a liver blood flow of {QH}. What is its intrinsic clearance?' }
    },
    {
      name: 'Hepatic extraction ratio',
      expr: 'EH = fu*CLint/(QH + fu*CLint)', tex: 'E_H = \\dfrac{f_u\\,\\text{CL}_\\text{int}}{Q_H + f_u\\,\\text{CL}_\\text{int}}',
      vars: {
        EH: { name: 'hepatic extraction ratio', q: 'ratio', unit: '%', tex: 'E_H' },
        fu: { name: 'fraction unbound in blood', q: 'ratio', unit: '%', value: 10, min: 0.01, max: 100, tex: 'f_u' },
        CLint: { name: 'intrinsic clearance of unbound drug', q: 'flowrate', unit: 'L/h', value: 300, tex: '\\text{CL}_\\text{int}' },
        QH: { name: 'liver blood flow', q: 'flowrate', unit: 'L/h', value: 90, tex: 'Q_H' }
      },
      note: 'Below about 30 %: low extraction; above about 70 %: high extraction.',
      practice: { unknowns: ['EH', 'QH'] },
      stories: { EH: 'A drug is {fu} unbound with CL_int = {CLint}; liver blood flow is {QH}. What fraction does the liver extract on each pass?', QH: 'At what liver blood flow would a drug {fu} unbound with CL_int = {CLint} be extracted by {EH}?' }
    },
    {
      name: 'Oral bioavailability through gut wall and liver',
      expr: 'F = Fa*FG*(1 - EH)', tex: 'F = F_a\\,F_G\\,(1 - E_H)',
      vars: {
        F: { name: 'oral bioavailability', q: 'ratio', unit: '%', tex: 'F' },
        Fa: { name: 'fraction absorbed', q: 'ratio', unit: '%', value: 95, min: 0, max: 100, tex: 'F_a' },
        FG: { name: 'fraction escaping the gut wall', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'F_G' },
        EH: { name: 'hepatic extraction ratio', q: 'ratio', unit: '%', value: 70, min: 0, max: 100, tex: 'E_H' }
      },
      stories: { F: 'A drug is {Fa} absorbed, {FG} escapes the gut wall and the liver extracts {EH}. What is its oral bioavailability?', EH: 'A drug {Fa} absorbed, of which {FG} escapes the gut wall, has an oral bioavailability of {F}. What is its hepatic extraction?' }
    },
    {
      name: 'Oral exposure (well-stirred model)',
      expr: 'AUC = Fa*FG*D/(fu*CLint)', tex: '\\text{AUC}_\\text{oral} = \\dfrac{F_a\\,F_G\\,D}{f_u\\,\\text{CL}_\\text{int}}',
      vars: {
        AUC: { name: 'oral AUC', q: false, unit: 'mg·h/L', tex: '\\text{AUC}_\\text{oral}' },
        Fa: { name: 'fraction absorbed (fraction)', value: 0.95, min: 0, max: 1, tex: 'F_a' },
        FG: { name: 'fraction escaping the gut wall (fraction)', value: 0.9, min: 0, max: 1, tex: 'F_G' },
        D: { name: 'oral dose', q: false, unit: 'mg', value: 100, tex: 'D' },
        fu: { name: 'fraction unbound (fraction)', value: 0.1, min: 0.0001, max: 1, tex: 'f_u' },
        CLint: { name: 'intrinsic clearance', q: false, unit: 'L/h', value: 300, tex: '\\text{CL}_\\text{int}' }
      },
      note: 'Liver blood flow cancels out: after an oral dose, exposure is set by enzymes and binding. Liver clearance only; add other routes of elimination separately.',
      practice: { unknowns: ['AUC', 'CLint'] },
      stories: { AUC: 'An oral dose of {D} of a hypothetical drug ({Fa} absorbed, {FG} escaping the gut wall) with fu = {fu} and CL_int = {CLint}: what is the oral AUC?' }
    }
  ],
  examples: [
    {
      title: 'Flow-limited or enzyme-limited?',
      q: 'Liver blood flow is 90 L/h. Hypothetical drug A has $f_u$ = 0.9 and $\\text{CL}_\\text{int}$ = 1000 L/h; drug B has $f_u$ = 0.05 and $\\text{CL}_\\text{int}$ = 100 L/h. Find their hepatic clearances, then halve (i) the blood flow, (ii) the intrinsic clearance.',
      steps: [
        'A: $f_u\\text{CL}_\\text{int}$ = 900 L/h, $E_H = 900/990 = 0.91$, $\\text{CL}_H = 81.8$ L/h. B: 5 L/h, $E_H = 5/95 = 0.053$, $\\text{CL}_H = 4.7$ L/h.',
        '(i) Flow 45 L/h: A falls to $45 \\times 900/945 = 42.9$ L/h (−48 %); B to $45 \\times 5/50 = 4.5$ L/h (−5 %).',
        '(ii) $\\text{CL}_\\text{int}$ halved: A falls to $90 \\times 450/540 = 75$ L/h (−8 %); B to $90 \\times 2.5/92.5 = 2.4$ L/h (−49 %).'
      ],
      a: 'A is flow-limited (sensitive to blood flow), B enzyme-limited (sensitive to enzyme activity).'
    },
    {
      title: 'An inhibitor and a high-extraction drug by mouth',
      q: 'Drug A above is fully absorbed with no gut-wall metabolism. An interacting drug halves its intrinsic clearance. What happens to its oral bioavailability and oral AUC?',
      steps: [
        'Before: $F = 1 - 0.909 = 0.091$. After: $E_H = 450/540 = 0.833$, so $F = 0.167$ — 1.8 times higher.',
        'Its systemic clearance falls only from 81.8 to 75 L/h.',
        'Oral AUC $= F D/\\text{CL}$ rises by $1.83 \\times 81.8/75 = 2.0$ — exactly the factor by which $\\text{CL}_\\text{int}$ fell, as $\\text{AUC}_\\text{oral} = D/(f_u \\text{CL}_\\text{int})$ predicts.'
      ],
      a: 'Bioavailability rises from 9 % to 17 % and the oral AUC doubles.'
    }
  ],
  quiz: [
    { q: 'For a high-extraction drug given into a vein, hepatic clearance depends mainly on…', choices: ['liver blood flow', 'the fraction unbound', 'the activity of the liver enzymes', 'kidney function'], a: 0, why: 'When $f_u \\text{CL}_\\text{int} \\gg Q_H$, $\\text{CL}_H \\approx Q_H$: the liver removes nearly everything delivered to it.' },
    { q: 'Liver blood flow is 90 L/h and $f_u\\,\\text{CL}_\\text{int}$ = 10 L/h. What is the hepatic extraction ratio, in %?', answer: 10, unit: '%', why: '$E_H = 10/(90 + 10) = 0.10$.' },
    { q: 'Displacing a low-extraction drug from albumin raises its total hepatic clearance.', a: true, why: '$\\text{CL}_H \\approx f_u \\text{CL}_\\text{int}$ rises with $f_u$; the total level falls while the unbound level at steady state stays the same.' },
    { q: 'A drug is completely absorbed and not metabolised in the gut wall; its hepatic extraction ratio is 0.8. What is its oral bioavailability, in %?', answer: 20, unit: '%', why: '$F = 1 \\times 1 \\times (1 - 0.8) = 0.2$.' },
    { q: 'Why can the oral bioavailability of a high-extraction drug rise several-fold in cirrhosis?', choices: ['the gut absorbs more drug', 'portal blood bypasses the liver through shunts and enzyme capacity falls', 'the kidneys stop excreting it', 'albumin rises'], a: 1, why: 'Shunted blood escapes the first pass entirely, and fewer working cells lower $E_H$ for the rest.' }
  ],
  problems: [
    { q: 'Liver blood flow is 90 L/h; a drug is 20 % unbound with $\\text{CL}_\\text{int}$ = 900 L/h. What is its hepatic clearance (L/h)?', answer: 60, unit: 'L/h', tol: 0.02,
      steps: ['$f_u \\text{CL}_\\text{int} = 0.2 \\times 900 = 180$ L/h.', '$\\text{CL}_H = 90 \\times 180/(90 + 180) = 60$ L/h, and $E_H = 0.67$: an intermediate-extraction drug.'] }
  ],
  applications: ['Predicting human clearance of new drugs from liver microsomes and hepatocytes.', 'Anticipating interactions with enzyme inhibitors and inducers, especially for oral high-extraction drugs.', 'Choosing routes that avoid the first pass: under the tongue, through the skin, rectally or by injection.', 'Dosing in heart failure and liver disease.'],
  history: 'Malcolm Rowland, Leslie Benet and Garry Graham set out clearance concepts in 1973, and Grant Wilkinson and David Shand published their physiological approach to hepatic drug clearance in 1975. K. Sandy Pang and Rowland compared the well-stirred and parallel-tube models in 1977; scaling from microsomes to people was systematised by Brian Houston in the 1990s.',
  sim: 'pkb-hepatic'
},

{
  id: 'tdm', parent: 'pk-special', title: 'Therapeutic drug monitoring', level: 2,
  short: 'Measuring a drug\'s concentration in blood to individualise the dose, when the therapeutic window is narrow and people differ widely in how they handle the drug. A useful level is drawn at the right time, at steady state, and read with the dose history and a pharmacokinetic model.',
  keywords: ['therapeutic drug monitoring', 'TDM', 'drug level', 'trough', 'peak', 'steady state', 'target range', 'narrow therapeutic index', 'proportional dose adjustment', 'Sawchuk–Zaske', 'Bayesian dosing', 'model-informed precision dosing', 'AUC-guided dosing', 'sampling time', 'free level', 'immunoassay', 'aminoglycosides', 'vancomycin', 'lithium', 'digoxin'],
  prereq: ['half-life', 'clearance', 'therapeutic-index', 'medicine:half-life-dosing'],
  related: ['protein-binding', 'renal-adjustment', 'nonlinear-pk', 'multiple-dosing', 'pharmacogenomics', 'analytical-methods', 'antimicrobials', 'medicine:epilepsy', 'medicine:bipolar-disorder'],
  body: `
Most medicines are dosed without ever being measured: the effect itself — a blood pressure, a blood sugar, relief of pain — shows whether the dose is right. Measuring the drug earns its place when several things come together:

1. a **narrow therapeutic window** ([[therapeutic-index]]);
2. **large differences between people** in clearance or volume, so the same dose gives very different levels;
3. a **better link from concentration to effect** than from dose to effect;
4. an effect that is **hard to judge quickly**, or a toxicity that is dangerous or irreversible;
5. a **reliable, timely assay** ([[analytical-methods]]).

### Medicines commonly monitored

| Class (examples) | Why a level helps | What is usually measured |
|---|---|---|
| aminoglycosides (gentamicin, amikacin) | killing follows the peak; kidney and ear toxicity follow the trough | peak and trough, or levels fitted to an individual curve |
| glycopeptides (vancomycin) | efficacy follows AUC/MIC; kidney injury rises with exposure | AUC from one or two levels (recommended by US consensus guidelines in 2020) |
| digoxin | narrow window; toxicity can mimic the heart disease | a level at least 6 h after a dose |
| lithium | narrow window; clearance changes with salt, fluids and other medicines | a level about 12 h after the last dose |
| some antiepileptics (phenytoin, carbamazepine) | non-linear kinetics, binding, self-induction | trough at steady state; free level when albumin is low |
| immunosuppressants (ciclosporin, tacrolimus) | narrow window, large variability, rejection against toxicity | trough in whole blood |

Target ranges come from guidelines and laboratories; they differ between them and change over time.

### Timing is everything
A level means nothing without the dose history. Wait for **steady state** — four to five half-lives after starting or changing a dose — or use a model that does not need it. The **trough**, just before a dose, is the usual sample: it is least sensitive to small errors in timing and to how fast the dose was absorbed. A **peak** is drawn after distribution is complete — for an aminoglycoside about 30–60 minutes after the end of the infusion; digoxin distributes over several hours, so an early level overstates what the heart sees. Record the exact times of the dose and the sample, and never sample from the line the drug is running through.

### From a level to a dose
**Linear kinetics, at steady state**: the level is proportional to the dose, so $D_\\text{new} = D_\\text{old} \\times C_\\text{target}/C_\\text{measured}$. This fails for drugs with saturable elimination such as phenytoin, where a small increase can raise the level steeply ([[nonlinear-pk]]).

**Two levels in one interval** give the person's own rate constant, $k = \\ln(C_1/C_2)/\\Delta t$, and — with the rate $k_0$ and duration $T$ of the infusion — the volume (Sawchuk and Zaske, 1976):

$$V = \\frac{k_0\\,(1 - e^{-kT})}{k\\left(C_\\text{max} - C_\\text{min}\\,e^{-kT}\\right)}$$

From $k$ and $V$ any regimen can be designed ([[multiple-dosing]]).

**Bayesian dosing** (model-informed precision dosing) goes further: a population model of how clearance and volume vary with weight, kidney function and age is the starting point, and one or two levels — at any time, even before steady state — update it to the person's most likely values.

### Traps
Total against free drug when albumin is low ([[protein-binding]]); assays that cross-react with metabolites or with substances made by the body; mixed units (phenytoin: 1 mg/L ≈ 4 µmol/L); and the golden rule — treat the person, not the number.

> [!warn] Signs of toxicity from narrow-window medicines — such as severe vomiting or diarrhoea, new confusion or drowsiness, unsteadiness or a coarse tremor, disturbed vision, or a very slow or irregular heartbeat — need urgent medical assessment: call your local emergency number or a poison centre. Levels are interpreted by the prescriber or pharmacist; never change a dose on the basis of a level yourself.
`,
  ideas: [
    'TDM helps when the window is narrow, people differ widely, concentration predicts effect, effects are hard to judge and a good assay exists.',
    'A level is only interpretable with the times of doses and sampling; troughs at steady state are the usual sample.',
    'For linear kinetics at steady state, the dose can be scaled in proportion to the level.',
    'Two levels give the individual k; with the infusion rate and time, V follows (Sawchuk–Zaske).',
    'Bayesian methods combine a population model with one or two levels, even before steady state.'
  ],
  pitfalls: [
    'A level can be read without knowing when the dose was taken — The same number can mean a low peak or a high trough; the timing is part of the result.',
    'Doubling the dose doubles the level for every drug — Only for linear kinetics; for saturable drugs such as phenytoin the level can rise far more.',
    'A level inside the range means the dose is right — Ranges are population guides; a person with symptoms of toxicity inside the range, or doing well outside it, is judged clinically.'
  ],
  formulas: [
    {
      name: 'Proportional dose adjustment (linear kinetics)',
      expr: 'Dnew = Dold*Ct/Cm', tex: 'D_\\text{new} = D_\\text{old}\\,\\dfrac{C_\\text{target}}{C_\\text{meas}}',
      vars: {
        Dnew: { name: 'new dose', q: 'mass', unit: 'mg', tex: 'D_\\text{new}' },
        Dold: { name: 'current dose', q: 'mass', unit: 'mg', value: 250, tex: 'D_\\text{old}' },
        Ct: { name: 'target level', q: 'massconc', unit: 'mg/L', value: 15, tex: 'C_\\text{target}' },
        Cm: { name: 'measured level (steady state)', q: 'massconc', unit: 'mg/L', value: 10, tex: 'C_\\text{meas}' }
      },
      note: 'Same interval, steady state, linear kinetics, and the target and measured levels at the same point of the interval. Not for saturable drugs such as phenytoin.',
      practice: { unknowns: ['Dnew', 'Cm'] },
      stories: { Dnew: 'A hypothetical drug given as {Dold} gives a steady-state trough of {Cm}; the target is {Ct}. What dose would reach it?', Cm: 'Raising a dose from {Dold} to {Dnew} brought the trough to {Ct}. What was it before?' }
    },
    {
      name: 'Volume from peak and trough of an infusion (Sawchuk–Zaske)',
      expr: 'V = k0*(1 - exp(-k*T))/(k*(Cmax - Cmin*exp(-k*T)))', tex: 'V = \\dfrac{k_0\\,(1 - e^{-kT})}{k\\left(C_\\text{max} - C_\\text{min}\\,e^{-kT}\\right)}',
      vars: {
        V: { name: 'volume of distribution', q: false, unit: 'L', tex: 'V' },
        k0: { name: 'infusion rate', q: false, unit: 'mg/h', value: 240, tex: 'k_0' },
        T: { name: 'infusion time', q: false, unit: 'h', value: 0.5, min: 0.01, max: 24, tex: 'T' },
        k: { name: 'elimination rate constant (from two levels)', q: false, unit: '1/h', value: 0.25, min: 0.001, max: 10, tex: 'k' },
        Cmax: { name: 'level at the end of the infusion', q: false, unit: 'mg/L', value: 6.52, tex: 'C_\\text{max}' },
        Cmin: { name: 'level just before the infusion', q: false, unit: 'mg/L', value: 1.0, tex: 'C_\\text{min}' }
      },
      note: 'One compartment. C_max is back-extrapolated to the end of the infusion from a later level, using k.',
      practice: { unknowns: ['V'] },
      stories: { V: 'A hypothetical antibiotic is infused at {k0} for {T}; the trough before was {Cmin}, the level at the end {Cmax}, and k = {k}. What is the volume of distribution?' }
    },
    {
      name: 'Projecting a level to another time',
      expr: 'C2 = C1*exp(-k*dt)', tex: 'C_2 = C_1\\,e^{-k\\,\\Delta t}',
      vars: {
        C2: { name: 'projected level', q: 'massconc', unit: 'mg/L', tex: 'C_2' },
        C1: { name: 'measured level', q: 'massconc', unit: 'mg/L', value: 2.4, tex: 'C_1' },
        k: { name: 'elimination rate constant', q: 'rate', unit: '1/h', value: 0.15, tex: 'k' },
        dt: { name: 'time from the sample to the projected time', q: 'time', unit: 'h', value: 2, tex: '\\Delta t' }
      },
      note: 'For a sample drawn early (or late) in the log-linear phase: the true trough, or the time to fall below a threshold.',
      practice: { unknowns: ['C2', 'dt'] },
      stories: { C2: 'A "trough" of {C1} was drawn {dt} before the next dose was actually due; k = {k}. What was the true trough?', dt: 'A level of {C1} must fall to {C2} before the next dose; k = {k}. How long must the dose be held?' }
    }
  ],
  examples: [
    {
      title: 'A proportional change',
      q: 'A hypothetical drug with linear kinetics and a half-life of 10 h has been taken as 200 mg every 12 h for five days. A trough drawn just before a dose is 4 mg/L; the prescriber\'s target is 6 mg/L. What dose would reach it?',
      steps: [
        'Five days is twelve half-lives: steady state is certain, and the sample was drawn at the right time.',
        'Linear kinetics: $D_\\text{new} = 200 \\times 6/4 = 300$ mg every 12 h.',
        'The new steady state takes another four to five half-lives (about two days) to establish; a repeat level would be timed accordingly.'
      ],
      a: '300 mg every 12 h (illustrative; real changes follow the product information and a clinician\'s judgement).'
    },
    {
      title: 'Peak and trough of an aminoglycoside-like antibiotic',
      q: 'A hypothetical antibiotic is infused as 120 mg over 30 min every 8 h, at steady state. Levels are 5.08 mg/L one hour after the end of the infusion and 1.46 mg/L six hours after it. Find $k$, the half-life, the true peak and trough, $V$ and CL.',
      steps: [
        '$k = \\ln(5.08/1.46)/5 = 1.247/5 = 0.249$ per hour; $t_{1/2} = 2.8$ h.',
        'Peak at the end of the infusion: $5.08\\,e^{0.249 \\times 1} = 6.52$ mg/L. Trough just before the next dose (7.5 h after the end): $6.52\\,e^{-0.249 \\times 7.5} = 1.00$ mg/L.',
        'Sawchuk–Zaske with $k_0 = 240$ mg/h, $T$ = 0.5 h: $V = 240(1 - e^{-0.125})/[0.249 \\times (6.52 - 1.00 \\times 0.883)] = 28.1/1.40 = 20$ L.',
        '$\\text{CL} = k\\,V = 0.249 \\times 20 = 5.0$ L/h. With $k$ and $V$ the team can design a new regimen — for instance a larger dose less often, to raise the peak and lower the trough.'
      ],
      a: 'k ≈ 0.25 h⁻¹ (t½ 2.8 h), peak 6.5 mg/L, trough 1.0 mg/L, V ≈ 20 L, CL ≈ 5 L/h.'
    }
  ],
  quiz: [
    { q: 'When is a trough level usually drawn?', choices: ['just before the next dose, at steady state', 'one hour after the first dose', 'at any convenient time', 'as soon as the dose has been changed'], a: 0, why: 'At steady state and just before a dose, the level is reproducible and least affected by absorption and small timing errors.' },
    { q: 'For phenytoin, doubling the dose roughly doubles the steady-state level.', a: false, why: 'Phenytoin\'s metabolism saturates in the usual range (Michaelis–Menten), so the level can rise several-fold.' },
    { q: 'A drug with linear kinetics gives a steady-state trough of 8 mg/L on 300 mg every 12 h. What dose every 12 h would give a trough of 12 mg/L, in mg?', answer: 450, unit: 'mg', why: '$300 \\times 12/8 = 450$ mg.' },
    { q: 'Which feature makes therapeutic drug monitoring least useful?', choices: ['a wide therapeutic window with an easily measured effect', 'large variability between patients', 'toxicity that is dangerous', 'a narrow therapeutic window'], a: 0, why: 'When the dose can be judged by its effect and there is plenty of margin, a level adds little.' },
    { q: 'A digoxin level drawn one hour after an oral dose is high. The most likely explanation is…', choices: ['certain toxicity', 'the drug is still distributing, so the plasma level overstates the level at the heart', 'the assay measured the tablet', 'kidney function has suddenly failed'], a: 1, why: 'Digoxin takes several hours to distribute into tissues; levels are drawn at least 6 h after a dose.' }
  ],
  problems: [
    { q: 'Levels of a hypothetical drug are 9.0 mg/L at 1 h and 3.0 mg/L at 7 h after a dose, both in the log-linear phase. What is its half-life (h)?', answer: 3.79, unit: 'h', tol: 0.02,
      steps: ['$k = \\ln(9/3)/6 = 1.0986/6 = 0.183$ per hour.', '$t_{1/2} = 0.693/0.183 = 3.79$ h.'] }
  ],
  applications: ['Dosing aminoglycosides and vancomycin in hospital, especially with changing kidney function.', 'Keeping lithium, digoxin and some antiepileptics inside their windows.', 'Transplant immunosuppression.', 'Checking adherence, and investigating suspected toxicity or interactions.'],
  history: 'Fritz Buchthal and colleagues showed in 1960 that phenytoin levels predicted both seizure control and toxicity, and Jan Koch-Weser\'s 1972 review made serum drug levels a routine guide. Immunoassays in the 1970s put them within reach of every hospital; Lewis Sheiner and colleagues introduced Bayesian forecasting of individual pharmacokinetics in 1979.',
  sim: { id: 'pkb-accumulation', params: { tdm: true } }
},

{
  id: 'paediatric-geriatric', parent: 'pk-special', title: 'Children and older people', level: 2,
  short: 'Body size, body composition and organ maturity change pharmacokinetics from birth to old age. Clearance scales with weight to the ¾ power and matures over the first two years; in older people kidney function, body water and lean mass fall and fat rises — so doses are scaled with care, not by simple proportion.',
  keywords: ['paediatric pharmacokinetics', 'neonates', 'newborn', 'allometric scaling', 'three-quarter power', 'maturation', 'postmenstrual age', 'GFR maturation', 'CYP ontogeny', 'body water', 'grey baby syndrome', 'geriatric pharmacology', 'older adults', 'ageing', 'frailty', 'polypharmacy', 'Beers criteria', 'STOPP/START', 'body surface area', 'off-label'],
  prereq: ['clearance', 'volume-distribution', 'renal-adjustment', 'biology:scaling-allometry'],
  related: ['dose-calculations', 'hepatic-clearance', 'tdm', 'adverse-reactions', 'medication-errors', 'medicine:child-growth', 'medicine:ageing', 'medicine:birth-newborn'],
  body: `
Children are not small adults, and older people are not simply adults with more birthdays. Both differ in size, in body composition and in how well their organs clear drugs — and both were long left out of the studies that set doses.

### Size: the three-quarter power
Metabolic rate and many clearances scale with body weight to about the 0.75 power, not in proportion to it ([[biology:scaling-allometry]]):

$$\\text{CL}_\\text{child} = \\text{CL}_\\text{adult}\\left(\\frac{W}{70\\ \\text{kg}}\\right)^{0.75}$$

So per kilogram, smaller bodies clear more:

| Weight | Size factor $(W/70)^{0.75}$ | Clearance per kg against an adult |
|---|---|---|
| 3.5 kg | 0.11 | 2.1 times |
| 10 kg | 0.23 | 1.6 times |
| 20 kg | 0.39 | 1.4 times |
| 40 kg | 0.66 | 1.15 times |
| 70 kg | 1 | 1 |

A child with mature organs given the adult dose per kilogram is underexposed; that is why per-kg doses of many medicines are higher in young children than in adults. Body surface area, which grows roughly as $W^{0.7}$, tracks clearance better than weight does ([[dose-calculations]]).

### Maturation
A newborn's organs are not finished. Glomerular filtration starts at a fraction of what size predicts and matures along an S-shaped curve in *postmenstrual age* (PMA: gestation at birth plus age since):

$$\\text{MF} = \\frac{\\text{PMA}^{\\,n}}{\\text{TM}_{50}^{\\,n} + \\text{PMA}^{\\,n}}$$

For GFR, a pooled analysis (Rhodin and colleagues, 2009) found $\\text{TM}_{50}$ ≈ 47.7 weeks and $n$ ≈ 3.4: about 35 % of mature at term birth, 90 % at one year and 98 % at two. Enzymes mature on their own timetables — fetal CYP3A7 gives way to CYP3A4 during the first year, and glucuronidation is weak at birth, which in 1959 caused the "grey baby syndrome" when newborns received adult-style doses of chloramphenicol. A newborn is 75–80 % water, about half of it extracellular, so polar drugs have larger volumes per kilogram: higher mg/kg doses at longer intervals. Excipients harmless to adults — benzyl alcohol, propylene glycol, ethanol — can be toxic to newborns.

### Older people
- **Kidneys**: function tends to fall, on average roughly 1 mL/min a year after about 40, though many people keep near-normal function; creatinine can stay normal because muscle mass falls ([[renal-adjustment]]).
- **Body composition**: fat rises while water and lean mass fall, so lipophilic drugs have larger volumes and longer half-lives — a classic 1975 study found diazepam's half-life in hours roughly equal to age in years — and polar drugs smaller volumes and higher peaks.
- **Liver**: blood flow and size fall by roughly 20–40 %, slowing high-extraction drugs ([[hepatic-clearance]]).
- **Sensitivity and frailty**: the brain responds more to sedatives; falls, confusion and bleeding are the costly side effects; many medicines together multiply interactions. The American Geriatrics Society Beers Criteria (updated 2023) and the European STOPP/START criteria list medicines that often do more harm than good in older people.

### Evidence and formulation
For decades children were "therapeutic orphans", treated with medicines never studied in them. US laws of 2002 and 2003 and the EU Paediatric Regulation (2007) now require or reward paediatric studies. Formulation is half the problem: a young child needs a liquid, a mini-tablet or a dispersible form with safe excipients and a dose that can be measured accurately.

> [!warn] Children's doses are calculated by prescribers and checked independently by pharmacists and nurses: tenfold errors — a misplaced decimal point — are a recognised danger in paediatrics ([[medication-errors]]). The scaling rules here explain the science; real doses come from paediatric formularies and product information.
`,
  ideas: [
    'Clearance scales with weight to about the 0.75 power: per kilogram, small children clear more than adults.',
    'Maturation is a sigmoid function of postmenstrual age: GFR is about 35 % of mature at term and nearly mature by two years.',
    'Newborns have more body water and immature enzymes and kidneys: polar drugs need larger volumes per kg and longer intervals.',
    'In older people, lower kidney function, more fat and less water lengthen half-lives and change peaks, often behind a normal creatinine.',
    'Frailty, polypharmacy and greater sensitivity matter as much as the pharmacokinetic changes.'
  ],
  pitfalls: [
    'A child\'s dose is the adult dose scaled by weight — With mature organs that underdoses small children (clearance scales as W^0.75); in newborns immaturity can make the same rule an overdose.',
    'A normal serum creatinine in an 85-year-old means normal kidney function — Low muscle mass keeps creatinine low; estimated clearance may be half that of a young adult.',
    'Age alone decides how an older person handles medicines — Frailty, illness, kidney function and other medicines vary far more between older people than age does.'
  ],
  formulas: [
    {
      name: 'Allometric scaling of clearance',
      expr: 'CLc = CLa*(W/Wa)^0.75', tex: '\\text{CL}_c = \\text{CL}_a\\left(\\dfrac{W}{W_a}\\right)^{0.75}',
      vars: {
        CLc: { name: 'child\'s clearance', q: 'flowrate', unit: 'L/h', tex: '\\text{CL}_c' },
        CLa: { name: 'adult clearance', q: 'flowrate', unit: 'L/h', value: 10, tex: '\\text{CL}_a' },
        W: { name: 'child\'s weight', q: 'mass', unit: 'kg', value: 20, tex: 'W' },
        Wa: { name: 'adult reference weight', q: 'mass', unit: 'kg', value: 70, tex: 'W_a' }
      },
      note: 'For mature organs (from about two years). In infants multiply by the maturation fraction.',
      practice: { unknowns: ['CLc', 'W'] },
      stories: { CLc: 'A hypothetical drug has an adult clearance of {CLa} at {Wa}. What clearance does allometry predict for a child of {W}?', W: 'At what weight does allometry predict a clearance of {CLc}, if the adult value is {CLa} at {Wa}?' }
    },
    {
      name: 'Maturation of a clearance pathway',
      expr: 'MF = PMA^n/(TM50^n + PMA^n)', tex: '\\text{MF} = \\dfrac{\\text{PMA}^{n}}{\\text{TM}_{50}^{\\,n} + \\text{PMA}^{n}}',
      vars: {
        MF: { name: 'fraction of mature function', q: 'ratio', unit: '%', tex: '\\text{MF}' },
        PMA: { name: 'postmenstrual age', q: 'time', unit: 'wk', value: 60, tex: '\\text{PMA}' },
        TM50: { name: 'age at half maturation', q: 'time', unit: 'wk', value: 47.7, tex: '\\text{TM}_{50}' },
        n: { name: 'Hill coefficient', value: 3.4, min: 0.5, max: 10, tex: 'n' }
      },
      note: 'For GFR, TM₅₀ ≈ 47.7 weeks and n ≈ 3.4 (Rhodin et al., 2009). A baby born at term is 40 weeks PMA at birth.',
      practice: { unknowns: ['MF', 'PMA'] },
      stories: { MF: 'What fraction of mature kidney function does a baby of {PMA} postmenstrual age have (TM₅₀ = {TM50}, n = {n})?', PMA: 'At what postmenstrual age does a pathway with TM₅₀ = {TM50} and n = {n} reach {MF} of maturity?' }
    },
    {
      name: 'Dose scaled by body surface area',
      expr: 'Dc = Da*BSA/BSAa', tex: 'D_c = D_a\\,\\dfrac{\\text{BSA}}{\\text{BSA}_a}',
      vars: {
        Dc: { name: 'child\'s dose', q: 'mass', unit: 'mg', tex: 'D_c' },
        Da: { name: 'adult dose', q: 'mass', unit: 'mg', value: 500, tex: 'D_a' },
        BSA: { name: 'child\'s body surface area', q: 'area', unit: 'm²', value: 0.8, tex: '\\text{BSA}' },
        BSAa: { name: 'adult reference surface area', q: 'area', unit: 'm²', value: 1.73, fixed: true, tex: '\\text{BSA}_a' }
      },
      note: 'A classic approximation for children with mature organs; paediatric doses are set from paediatric studies and formularies.',
      practice: { unknowns: ['Dc'] },
      stories: { Dc: 'A hypothetical adult dose is {Da}. What does surface-area scaling give for a child of {BSA}?' }
    },
    {
      name: 'Clearance with size and maturation',
      expr: 'CL = CLa*(W/70)^0.75*MF', tex: '\\text{CL} = \\text{CL}_a\\left(\\dfrac{W}{70}\\right)^{0.75} \\text{MF}',
      vars: {
        CL: { name: 'child\'s clearance', q: 'flowrate', unit: 'L/h', tex: '\\text{CL}' },
        CLa: { name: 'adult clearance (70 kg)', q: 'flowrate', unit: 'L/h', value: 6, tex: '\\text{CL}_a' },
        W: { name: 'weight', q: 'mass', unit: 'kg', value: 12, tex: 'W' },
        MF: { name: 'maturation fraction', q: 'ratio', unit: '%', value: 97.7, min: 0, max: 100, tex: '\\text{MF}' }
      },
      note: 'The size-and-maturation model used in paediatric pharmacokinetics; 70 is the reference weight in kg.',
      practice: { unknowns: ['CL'] },
      stories: { CL: 'A hypothetical drug has an adult clearance of {CLa}. What is the clearance in a child of {W} whose pathway is {MF} mature?' }
    }
  ],
  examples: [
    {
      title: 'Scaling a hypothetical drug to a two-year-old',
      q: 'A renally cleared hypothetical drug has CL = 6 L/h in a 70 kg adult, who takes 600 mg a day. A two-year-old weighs 12 kg and is 87 cm tall (PMA about 144 weeks). What daily dose matches the adult exposure (AUC), and how do weight and surface-area rules compare?',
      steps: [
        'Size: $(12/70)^{0.75} = 0.266$. Maturation: $144^{3.4}/(47.7^{3.4} + 144^{3.4}) = 0.977$.',
        '$\\text{CL} = 6 \\times 0.266 \\times 0.977 = 1.56$ L/h, so an equal AUC needs $600 \\times 1.56/6 = 156$ mg a day.',
        'Per kilogram: $600 \\times 12/70 = 103$ mg a day — 34 % less exposure than the adult.',
        'Surface area (Mosteller): $\\sqrt{12 \\times 87/3600} = 0.54$ m², giving $600 \\times 0.54/1.73 = 187$ mg a day — closer, slightly high.'
      ],
      a: 'About 156 mg a day by size and maturation; 103 mg by weight, 187 mg by surface area (illustrative only).'
    },
    {
      title: 'An older adult and a lipophilic drug',
      q: 'A hypothetical lipophilic drug has $V$ = 1.0 L/kg and CL = 3 L/h in a 70 kg 30-year-old. At 80, with more body fat, $V$ is 1.6 L/kg at the same weight. What happens to the half-life and the time to steady state? What if clearance also falls by 30 %?',
      steps: [
        'At 30: $t_{1/2} = 0.693 \\times 70/3 = 16$ h; steady state in about $5 \\times 16$ h ≈ 3.4 days.',
        'At 80: $t_{1/2} = 0.693 \\times 112/3 = 26$ h; steady state in about 5.4 days — and the drug lingers as long after stopping.',
        'If CL also falls to 2.1 L/h: $t_{1/2} = 0.693 \\times 112/2.1 = 37$ h, and the average level rises by $3/2.1 = 1.4$ times on the same dose.'
      ],
      a: 'The half-life rises from 16 h to 26 h (37 h if clearance also falls); steady state takes days longer.'
    }
  ],
  quiz: [
    { q: 'Compared with an adult, a 10 kg child with mature organs clears a drug…', choices: ['more per kilogram, less in total', 'less per kilogram and less in total', 'exactly the same per kilogram', 'more in total'], a: 0, why: '$(10/70)^{0.75} = 0.23$ of the adult clearance for 0.14 of the weight: 1.6 times more per kg.' },
    { q: 'Newborns often need a higher mg/kg dose of a polar antibiotic, given less often, because…', choices: ['their body water (and volume per kg) is larger and their kidneys clear it more slowly', 'they absorb it poorly from the gut', 'their albumin binds it more tightly', 'their livers are more active'], a: 0, why: 'More extracellular water raises V per kg (a higher dose for the same peak); immature GFR lowers clearance (a longer interval).' },
    { q: 'A normal serum creatinine in an 85-year-old means kidney function is normal.', a: false, why: 'Creatinine comes from muscle; with less muscle it stays low even when GFR has fallen, which is why the equations include age.' },
    { q: 'An adult clearance of 10 L/h at 70 kg is scaled allometrically to a 35 kg child with mature organs. What is the child\'s clearance, in L/h?', answer: 5.95, unit: 'L/h', why: '$10 \\times (35/70)^{0.75} = 10 \\times 0.595 = 5.95$ L/h — more than half, though the child weighs half as much.' },
    { q: 'The half-life of a lipophilic drug often lengthens in older people mainly because…', choices: ['its volume of distribution rises as body fat increases', 'it is absorbed more slowly', 'albumin binds it more', 'the kidneys secrete it faster'], a: 0, why: '$t_{1/2} = 0.693\\,V/\\text{CL}$: more fat means a larger V for lipophilic drugs, even at the same clearance.' }
  ],
  problems: [
    { q: 'With $\\text{TM}_{50}$ = 47.7 weeks and $n$ = 3.4, what fraction of mature GFR does a baby have at term birth (PMA 40 weeks), in %?', answer: 35.5, unit: '%', tol: 0.02,
      steps: ['$(40/47.7)^{3.4} = 0.8386^{3.4} = 0.550$.', '$\\text{MF} = 0.550/(1 + 0.550) = 0.355$ = 35.5 %.'] }
  ],
  applications: ['Paediatric dose finding and the design of paediatric investigation plans.', 'Choosing dosing intervals for newborns in intensive care.', 'Medication reviews and deprescribing in older people.', 'Designing age-appropriate formulations: liquids, mini-tablets, dispersible and taste-masked forms.'],
  history: 'Harry Shirkey called children "therapeutic orphans" in 1968, a decade after chloramphenicol\'s "grey baby syndrome" (1959) had shown how immature metabolism can turn an adult dose into a lethal one. Allometric scaling with maturation functions, championed by Brian Anderson and Nick Holford from the late 1990s, is now the standard language of paediatric pharmacokinetics.',
  sim: 'pkb-scaling'
}

);
