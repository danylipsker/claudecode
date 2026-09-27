/* HYPER-PHARMACEUTICS · content/advanced.js
 * Advanced drug delivery (advanced-topic): inhaled medicines, nanoparticles and liposomes, lipid
 * nanoparticles, targeting, formulating proteins and antibodies, vaccine formulation, depots and
 * implants, printed medicines. Simulations in sims/advanced.js (prefix adv-).
 * Every drug, dose and number in an example is a hypothetical teaching value, not dosing guidance. */
Hyper.add(

/* ================================================================ INHALATION */
{
  id: 'inhalation', parent: 'advanced-topic', title: 'Inhaled medicines and particle size', level: 2,
  short: 'An inhaler works only if its particles are the right size. What matters is the aerodynamic diameter — the diameter of a water droplet that would move the same way in air — and the useful window is roughly 1–5 µm: bigger particles hit the throat, much smaller ones are breathed back out.',
  keywords: ['inhalation', 'aerodynamic diameter', 'MMAD', 'fine particle fraction', 'cascade impactor', 'impaction', 'sedimentation', 'diffusion', 'pMDI', 'dry powder inhaler', 'nebuliser', 'spacer', 'Stokes number', 'GSD', 'lung deposition'],
  prereq: ['particle-size', 'routes', 'aerodynamics:terminal-velocity', 'medicine:respiratory-system'],
  related: ['nanomedicine', 'respiratory-drugs', 'nasal-otic', 'powder-flow', 'excipients', 'medicine:asthma', 'medicine:copd'],
  body: `
The lung is a superb absorbing surface — about 100 m² of it, one cell thick, with a blood supply that does not pass through the liver first ([[first-pass]]). It is also extremely well defended against particles, because that is what noses, throats and cilia are for. Every inhaled medicine is a negotiation with those defences, and the currency is particle size.

### Aerodynamic diameter is the size that counts
A particle in moving air does not care about its shape or its density separately, only about the combination that sets how it responds to acceleration and gravity. That combination is the **aerodynamic diameter**: the diameter of a sphere of unit density (1 g/cm³) that settles at the same speed.

$$d_{ae} = d\\sqrt{\\frac{\\rho}{\\chi}}$$

A dense 3 µm crystal ($\\rho = 1.5$ g/cm³, shape factor $\\chi \\approx 1.1$) behaves like a 3.5 µm droplet; a porous engineered particle of 5 µm geometric diameter and density 0.1 g/cm³ behaves like a 1.6 µm one — large enough to flow and disperse as a powder, small enough to fly deep. That trick, "large porous particles", is one of the neatest pieces of formulation engineering there is.

### Three ways a particle lands
| Mechanism | Grows with | Dominates |
|---|---|---|
| **Inertial impaction** — the air turns, the particle does not | $d_{ae}^2 \\times$ speed | above about 5 µm, in the throat and the first bronchi |
| **Sedimentation** — it simply falls | $d_{ae}^2$, and time | 1–5 µm, in the small airways and alveoli, during a breath-hold |
| **Brownian diffusion** — it wanders into a wall | falls with $d_{ae}$ | below about 0.5 µm, weakly |

Impaction is measured by the **Stokes number**; when it is much less than one the particle follows the streamlines round a bend, and when it approaches one the particle carries straight on into the wall. Between the two big mechanisms sits a minimum of total deposition at roughly 0.3–0.5 µm: such particles are too small to impact or settle and too big to diffuse, so most of them are breathed straight back out. This is the same physics that decides where dust and smoke go ([[aerodynamics:terminal-velocity|terminal velocity]]).

> [!key] The useful window for the lungs is about 1–5 µm aerodynamic diameter, and 1–3 µm for the alveoli. Above 5 µm the dose lands in the mouth and throat; near 0.4 µm it is exhaled again.

### What an inhaler actually delivers
Products are described by the **mass median aerodynamic diameter** (MMAD, half the aerosol mass in particles above it), the **geometric standard deviation** (GSD, the width of the log-normal distribution; below 1.5 counts as narrow) and the **fine particle fraction** — the percentage of the delivered dose below 5 µm. These come from a **cascade impactor**, a stack of plates whose air passages get narrower stage by stage, so each stage collects a known size band (pharmacopoeial aerodynamic assessment: USP <601>, Ph. Eur. 2.9.18).

| Device | Typical MMAD | Typical lung dose | Main problem |
|---|---|---|---|
| Pressurised metered-dose inhaler | 2–4 µm | 10–20 % (more with a spacer) | fast spray, needs coordination |
| pMDI with a spacer | 2–3 µm | 20–40 % | bulk |
| Dry powder inhaler | 2–5 µm | 15–40 % | needs the patient's own inspiratory effort |
| Nebuliser | 2–5 µm | 5–15 % | slow, needs power |
| Soft-mist / soft-plume inhaler | 2–3 µm | 30–50 % | cost, device complexity |

A dry powder inhaler is a small piece of powder technology: micronised drug is too cohesive to flow, so it is blended with coarse lactose carrier particles (50–100 µm), and the patient's inhalation must generate enough shear to strip the drug off the carrier ([[powder-flow]]). That is why a dry powder inhaler is flow-rate dependent and a pMDI is not.

Droplets also **grow in the airways**: at 37 °C and nearly 100 % humidity a hygroscopic droplet can double in diameter, moving its deposition upwards. And the dose that lands in the mouth is swallowed, so systemic side effects of an inhaled drug often come from the swallowed fraction — one reason patients are told to rinse after an inhaled corticosteroid.

> [!warn] Inhaler technique changes the delivered dose several-fold, and a reliever inhaler that is needed more and more often is a warning sign, not a solution. Sudden severe breathlessness, inability to speak in sentences or blue lips are emergencies: call your local emergency number. Ask a pharmacist or nurse to check your technique — never change an inhaled treatment on your own.
`,
  ideas: [
    'Aerodynamic diameter, not geometric size, decides where an inhaled particle lands: d_ae = d√(ρ/χ).',
    'Impaction and sedimentation both grow with d_ae², so deposition has a minimum near 0.4 µm where particles are mostly exhaled.',
    'The lung window is about 1–5 µm; larger particles are lost in the mouth and throat and swallowed.',
    'Products are specified by MMAD, GSD and the fine particle fraction below 5 µm, measured in a cascade impactor.',
    'Porous, low-density particles behave aerodynamically small while staying geometrically large, which makes them flow and disperse well.'
  ],
  pitfalls: [
    'Smaller is always better for an inhaler — Below about 1 µm particles neither impact nor settle efficiently and a large share is exhaled; below 0.1 µm diffusion helps again, but such particles carry almost no drug each.',
    'The label claim is the dose the lungs get — The label is the metered or delivered dose. The lung dose is the fine particle fraction of it, typically 10–40 %, and the rest is swallowed.',
    'A dense powder and a light powder of the same measured diameter behave the same in air — They do not: aerodynamic diameter scales with the square root of density, so a 1.5 g/cm³ particle flies like one 22 % larger.'
  ],
  formulas: [
    {
      name: 'Aerodynamic diameter',
      expr: 'dae = d*sqrt(rho/chi)', tex: 'd_{ae} = d\\sqrt{\\dfrac{\\rho}{\\chi}}',
      vars: {
        dae: { name: 'aerodynamic diameter', q: false, unit: 'µm', tex: 'd_{ae}' },
        d: { name: 'geometric (volume-equivalent) diameter', q: false, unit: 'µm', value: 3 },
        rho: { name: 'particle density (in g/cm³, i.e. relative to unit density)', q: false, unit: 'g/cm³', value: 1.5, tex: '\\rho' },
        chi: { name: 'dynamic shape factor (1 for a sphere)', q: false, value: 1.1, tex: '\\chi' }
      },
      note: 'Unit density is 1 g/cm³, so writing the density in g/cm³ makes the ratio dimensionless. Shape factors run from 1 for spheres to about 1.5 for needles and flakes.',
      practice: { unknowns: ['dae', 'd', 'rho'] },
      stories: {
        dae: 'A crystal of {d} has a density of {rho} and a shape factor of {chi}. What is its aerodynamic diameter?',
        d: 'An engineered porous particle of density {rho} and shape factor {chi} must have an aerodynamic diameter of {dae}. How big may it be geometrically?',
        rho: 'A {d} particle behaves like a {dae} droplet, with a shape factor of {chi}. What is its density?'
      }
    },
    {
      name: 'Settling (sedimentation) speed',
      expr: 'v = rho0*dae^2*g/(18*eta)', tex: 'v = \\dfrac{\\rho_0\\, d_{ae}^2\\, g}{18\\,\\eta}',
      vars: {
        v: { name: 'terminal settling speed', q: 'speed', unit: 'mm/s' },
        rho0: { name: 'unit density (1 g/cm³, by definition of d_ae)', q: 'density', unit: 'kg/m³', value: 1000, fixed: true, tex: '\\rho_0' },
        dae: { name: 'aerodynamic diameter', q: 'length', unit: 'µm', value: 3.5, tex: 'd_{ae}' },
        g: { const: 'g' },
        eta: { name: 'viscosity of air at 37 °C', q: 'viscosity', unit: 'mPa·s', value: 0.0189, tex: '\\eta' }
      },
      note: 'Stokes\' law, the same relation that governs a settling suspension. A 3.5 µm particle falls about 0.35 mm/s, so a ten-second breath-hold moves it 3–4 mm — enough to reach an alveolar wall.',
      practice: { unknowns: ['v', 'dae'] },
      stories: {
        v: 'How fast does a {dae} aerosol particle settle in air of viscosity {eta}?',
        dae: 'A particle settles at {v} in air of viscosity {eta}. What is its aerodynamic diameter?'
      }
    },
    {
      name: 'Stokes number (inertial impaction)',
      expr: 'Stk = rho0*dae^2*U/(9*eta*Dt)', tex: '\\mathrm{Stk} = \\dfrac{\\rho_0\\, d_{ae}^2\\, U}{9\\,\\eta\\, D_t}',
      vars: {
        Stk: { name: 'Stokes number', tex: '\\mathrm{Stk}' },
        rho0: { name: 'unit density', q: 'density', unit: 'kg/m³', value: 1000, fixed: true, tex: '\\rho_0' },
        dae: { name: 'aerodynamic diameter', q: 'length', unit: 'µm', value: 5, tex: 'd_{ae}' },
        U: { name: 'air speed in the airway', q: 'speed', unit: 'm/s', value: 4 },
        eta: { name: 'viscosity of air', q: 'viscosity', unit: 'mPa·s', value: 0.0189, tex: '\\eta' },
        Dt: { name: 'airway diameter', q: 'length', unit: 'mm', value: 10, tex: 'D_t' }
      },
      note: 'Stk ≪ 1: the particle follows the air round a bend. Stk approaching 1: it carries on into the wall. Impaction therefore attacks big particles, fast air and narrow, sharply branching airways — the throat and the first few generations.',
      practice: { unknowns: ['Stk', 'dae'] },
      stories: {
        Stk: 'Air at {U} carries a {dae} particle through an airway of {Dt}. What is the Stokes number?',
        dae: 'In an airway of {Dt} with air at {U}, which particle size gives a Stokes number of {Stk}?'
      }
    },
    {
      name: 'Fine particle fraction',
      expr: 'FPF = 100*mfine/mdel', tex: '\\mathrm{FPF} = 100\\,\\dfrac{m_{fine}}{m_{del}}',
      vars: {
        FPF: { name: 'fine particle fraction', q: false, unit: '%', tex: '\\mathrm{FPF}' },
        mfine: { name: 'mass below 5 µm (from the impactor)', q: false, unit: 'µg', value: 45, tex: 'm_{fine}' },
        mdel: { name: 'delivered dose at the mouthpiece', q: false, unit: 'µg', value: 100, tex: 'm_{del}' }
      },
      note: 'Sometimes quoted against the metered dose instead of the delivered dose — always ask which. Typical values are 20–50 % for modern inhalers.',
      stories: {
        FPF: 'An impactor collects {mfine} below 5 µm from a delivered dose of {mdel}. What is the fine particle fraction?',
        mfine: 'An inhaler delivers {mdel} per actuation with a fine particle fraction of {FPF}. How much is below 5 µm?'
      }
    }
  ],
  examples: [
    {
      title: 'Designing a porous particle',
      q: 'A drug of true density 1.4 g/cm³ must be made into a powder with an aerodynamic diameter of 2 µm, but particles of 2 µm geometric size are far too cohesive to flow. How porous must a 9 µm particle be (shape factor 1.0) to fly like a 2 µm one?',
      steps: [
        'Rearrange: $\\rho = \\chi (d_{ae}/d)^2 = 1.0 \\times (2/9)^2 = 0.049$ g/cm³.',
        'So the particle must be about 96 % void — a hollow, wrinkled shell, made for example by spray-drying with a pore-forming excipient.',
        'Its surface-to-mass ratio is large, so it flows and disperses far better than a 2 µm solid crystal, while depositing like one.'
      ],
      a: 'An effective density near 0.05 g/cm³ — a 9 µm particle that is mostly air.'
    },
    {
      title: 'Where a 10 µm droplet goes',
      q: 'Compare the Stokes number of a 10 µm and a 2 µm droplet in the throat (diameter about 20 mm, air speed 8 m/s during a fast inhalation) and in a small bronchus (2 mm, 0.4 m/s). Air viscosity 0.0189 mPa·s.',
      steps: [
        'Throat, 10 µm: $\\mathrm{Stk} = 1000 \\times (10^{-5})^2 \\times 8/(9 \\times 1.89\\times10^{-5} \\times 0.02) = 8\\times10^{-7}/3.40\\times10^{-6} = 0.235$ — impaction is strong; most of these droplets stop there.',
        'Throat, 2 µm: 25 times smaller, $\\mathrm{Stk} = 0.0094$ — it follows the air round the bend.',
        'Small bronchus, 2 µm: $\\mathrm{Stk} = 1000 \\times 4\\times10^{-12} \\times 0.4/(9 \\times 1.89\\times10^{-5} \\times 0.002) = 1.6\\times10^{-9}/3.40\\times10^{-7} = 0.0047$ — still small, so it stays airborne and lands by settling instead.',
        'Slow, deep inhalation lowers $U$ and so lowers throat impaction: that is exactly the technique taught for a pMDI.'
      ],
      a: 'The 10 µm droplet impacts in the throat (Stk ≈ 0.24); the 2 µm one passes and later settles.'
    },
    {
      title: 'Reading an impactor result',
      q: 'A hypothetical inhaler meters 120 µg per actuation. The impactor finds 104 µg at the mouthpiece and, of that, 38 µg on stages with cut-offs below 5 µm. What are the delivered dose and the fine particle fraction, and roughly what lung dose would you expect?',
      steps: [
        'Delivered dose = 104 µg (87 % of the metered dose; the rest stays in the device and the actuator).',
        '$\\mathrm{FPF} = 100 \\times 38/104 = 37$ % of the delivered dose.',
        'The fine particle mass, 38 µg, is the best in-vitro guide to the lung dose — about 32 % of the label claim. The remaining 66 µg lands in the mouth and throat and is swallowed.'
      ],
      a: 'Delivered 104 µg, FPF 37 %, fine particle mass 38 µg per actuation.'
    }
  ],
  quiz: [
    { q: 'Which aerodynamic size range deposits best in the alveoli?', choices: ['below 0.5 µm', '1–3 µm', '5–8 µm', 'above 10 µm'], a: 1, why: '1–3 µm particles escape throat impaction but still settle within a breath-hold. Below 0.5 µm most are exhaled; above 5 µm most impact in the mouth and throat.' },
    { q: 'A 4 µm particle of density 2.25 g/cm³ (shape factor 1) has an aerodynamic diameter of about…', choices: ['2.7 µm', '4 µm', '6 µm', '9 µm'], a: 2, why: 'd_ae = 4√2.25 = 6 µm — dense particles fly larger than they look, which pushes deposition up into the throat.' },
    { q: 'Total lung deposition has a minimum near 0.4 µm.', a: true, why: 'Impaction and sedimentation both fade as size falls, while diffusion is still weak, so particles of a few tenths of a micrometre are largely breathed back out.' },
    { q: 'Why is a dry powder inhaler sensitive to how hard the patient breathes in, while a pMDI is not?', choices: ['the powder is hygroscopic', 'the patient\'s inspiratory flow provides the energy that strips micronised drug off the carrier particles', 'the propellant needs warming', 'the powder dose is metered by flow'], a: 1, why: 'A pMDI has its own energy source in the propellant; a dry powder inhaler borrows the energy of the inhalation to de-aggregate the blend.' },
    { q: 'An inhaler\'s fine particle fraction is 45 µg out of a delivered dose of 150 µg. What is the FPF in per cent?', answer: 30, unit: '%', why: '100 × 45/150 = 30 %.' }
  ],
  problems: [
    { q: 'A spray-dried powder has a geometric diameter of 6 µm, a density of 0.2 g/cm³ and a shape factor of 1.2. What is its aerodynamic diameter (µm)?', answer: 2.45, unit: 'µm', tol: 0.02, steps: ['$d_{ae} = 6\\sqrt{0.2/1.2} = 6 \\times 0.4082 = 2.45$ µm.', 'A geometrically large, free-flowing particle that deposits like a fine one.'] },
    { q: 'How far does a 2 µm aerodynamic particle settle during a 10-second breath-hold (air viscosity 0.0189 mPa·s), in millimetres?', answer: 1.15, unit: 'mm', tol: 0.05, steps: ['$v = 1000 \\times (2\\times10^{-6})^2 \\times 9.807/(18 \\times 1.89\\times10^{-5}) = 3.92\\times10^{-8}/3.402\\times10^{-4} = 1.15\\times10^{-4}$ m/s.', '$1.15\\times10^{-4} \\times 10 = 1.15$ mm — comparable to the width of a small airway, which is why the breath-hold is part of the instructions.'] }
  ],
  applications: ['Asthma and COPD treatment, where the lung is both the target and the route.', 'Inhaled antibiotics and mucolytics in cystic fibrosis, delivered by nebuliser or dry powder.', 'Systemic delivery through the lung — inhaled insulin has been marketed and withdrawn twice, showing how hard the device-plus-patient system is.', 'Quality control of every inhaler batch by cascade impactor and delivered-dose uniformity.'],
  history: 'The pressurised metered-dose inhaler was developed at Riker Laboratories in 1955–56 after the company president\'s teenage daughter, who had asthma, asked why her medicine could not come in a spray can like hair lacquer. Its CFC propellants were phased out under the Montreal Protocol (agreed 1987), forcing a reformulation of every pMDI onto HFA propellants through the 1990s; at the time of writing the industry is reformulating again onto propellants of much lower global warming potential.',
  sim: ['adv-deposition', 'adv-impactor']
},

/* ================================================================ NANOMEDICINE */
{
  id: 'nanomedicine', parent: 'advanced-topic', title: 'Nanoparticles and liposomes', level: 2,
  short: 'Below a few hundred nanometres a carrier behaves less like a powder and more like a large molecule: it circulates, is taken up by cells whole, and can be steered away from healthy tissue. Liposomes, polymer particles, albumin particles and nanocrystals all exploit that, and all pay for it in complexity.',
  keywords: ['nanomedicine', 'liposome', 'PEGylation', 'stealth', 'EPR effect', 'nanocrystal', 'PLGA', 'albumin-bound', 'zeta potential', 'dynamic light scattering', 'mononuclear phagocyte system', 'renal cut-off', 'micelle', 'encapsulation efficiency'],
  prereq: ['particle-size', 'colloids', 'biology:endocytosis', 'surfactants'],
  related: ['lipid-nanoparticles', 'targeted-delivery', 'oncology-drugs', 'sterilisation-methods', 'biology:membrane-structure', 'medicine:immunotherapy'],
  body: `
"Nano" in medicine usually means a carrier between about 10 and 500 nm: big enough to hold thousands of drug molecules, small enough to travel in blood and be swallowed whole by a cell. Changing the size of that carrier changes its pharmacokinetics completely, without touching the drug's own chemistry — the reason nanomedicine exists.

### What size does in the body
| Diameter (hydrodynamic) | What happens |
|---|---|
| below ~6–8 nm | filtered by the kidney and lost in urine ([[medicine:glomerular-filtration|glomerular filtration]]) |
| 10–30 nm | long circulation, drains into lymphatics, enters some tumours easily |
| 30–150 nm | the useful window: circulates for hours to days if the surface is right |
| above ~200 nm | rapidly taken up by liver and spleen macrophages; cannot be sterile-filtered through 0.22 µm |
| above ~5 µm | trapped in the lung capillaries — dangerous for an intravenous product |

An unprotected particle is coated within seconds by plasma proteins (the **protein corona**) and cleared by the mononuclear phagocyte system. Grafting flexible **poly(ethylene glycol)** chains onto the surface — PEGylation — creates a hydrated brush that keeps proteins away and lengthens the circulation half-life from minutes to a day or more. The stealth is never total: repeated dosing can raise anti-PEG antibodies, and some patients react to the first infusion through complement activation.

### Liposomes
A liposome is a bilayer vesicle of phospholipid and cholesterol with an aqueous core, so it can carry water-soluble drug inside and fat-soluble drug in the membrane. A 100 nm vesicle is built from roughly 100 000 lipid molecules and can hold tens of thousands of drug molecules in its core. Loading is either passive or, much better, **remote**: a pH or ion gradient across the bilayer drives a weak base inside, where it precipitates and cannot leave — a trick that gives encapsulation efficiencies above 95 % ([[ph-solubility]], [[ionisation-pka]]).

Liposomal formulations change toxicity as much as efficacy. Liposomal amphotericin B (approved in the 1990s) is far kinder to the kidney than the plain drug; PEGylated liposomal doxorubicin (US approval 1995) greatly reduces the cardiac dose while adding a skin toxicity of its own. The drug is the same molecule: the formulation decides what it does.

### The other families
- **Polymer particles**, usually of polylactide-*co*-glycolide, which hydrolyses to lactic and glycolic acid over weeks; the same chemistry as resorbable sutures ([[chemistry:polymers]], [[depot-implants]]).
- **Polymeric micelles** from block copolymers above the critical micelle concentration ([[surfactants]]), which solubilise very lipophilic drugs.
- **Albumin-bound particles**: the drug is precipitated with human serum albumin (approved for paclitaxel in 2005), avoiding the solubilising surfactant and its infusion reactions.
- **Nanocrystals**: not carriers at all, just the drug milled to 100–400 nm, which dissolves fast because the surface per gram is 20 m² or more ([[dissolution-rate]], [[particle-size]]).

### Making and measuring them
Size and width come from dynamic light scattering (reported as a Z-average and a polydispersity index; below 0.2 is a comfortably narrow distribution); surface charge from the **zeta potential**, where roughly ±30 mV is enough electrostatic repulsion to keep a suspension from aggregating ([[colloids]]). Terminal heat sterilisation destroys most nanocarriers, so they are made aseptically and filtered at 0.22 µm — which puts a hard ceiling on particle size ([[aseptic-processing]], [[sterilisation-methods]]). Freeze-drying with a sugar to cushion the particles is often the only way to reach a two-year shelf life ([[lyophilisation]]).

### Honest about the EPR effect
The standard argument for nanomedicine in cancer is **enhanced permeability and retention**: tumour vessels are leaky and lymphatic drainage is poor, so particles accumulate. It is real in the mouse tumours it was discovered in (1986) and much weaker and far more variable in human tumours, where typically well under 1 % of an injected dose reaches the tumour. Most approved "nano" cancer products earn their place by changing toxicity and solubility rather than by dramatic targeting ([[targeted-delivery]]).

> [!warn] Nanomedicines are not interchangeable with each other or with the plain drug: the same milligram figure can mean a different dose in the body. Substitution is a prescribing decision. These pages explain the science; they are not dosing guidance.
`,
  ideas: [
    'Below the renal cut-off (about 6–8 nm) a carrier is filtered away; above about 200 nm it is eaten by liver and spleen macrophages. The useful window is roughly 30–150 nm.',
    'A plasma protein corona forms within seconds; PEGylation hides the surface and extends circulation from minutes to a day or more.',
    'A liposome carries water-soluble drug in its core and lipophilic drug in its bilayer; remote loading down a pH gradient gives very high encapsulation.',
    'Nanoformulation usually changes toxicity and solubility more than it changes where the drug goes.',
    'Nanocarriers cannot be autoclaved, so they are made aseptically and sterile-filtered — which caps their size at about 200 nm.'
  ],
  pitfalls: [
    'Nanoparticles go to tumours because of the EPR effect — In mice, largely yes; in people the effect is small and highly variable, and usually less than 1 % of the dose reaches the tumour. Claims of "targeting" need the biodistribution data.',
    'A nanomedicine and its plain drug are bioequivalent at the same milligram dose — They are different products with different distribution, clearance and toxicity; the equivalence rules for simple generics do not apply.',
    'Smaller nanoparticles always circulate longer — Below the renal filtration cut-off they are cleared in minutes. Circulation time depends on the surface as much as the size.'
  ],
  formulas: [
    {
      name: 'Drug molecules inside one vesicle',
      expr: 'N = NA*C*(pi/6)*d^3', tex: 'N = N_A\\, C\\, \\dfrac{\\pi}{6} d^3',
      vars: {
        N: { name: 'molecules per vesicle' },
        NA: { const: 'NA' },
        C: { name: 'concentration in the aqueous core', q: 'concentration', unit: 'mM', value: 100 },
        d: { name: 'internal diameter of the core', q: 'length', unit: 'nm', value: 80 }
      },
      note: 'An 80 nm core holding a 100 mM solution carries about 16 000 molecules — which is why a liposome delivers a parcel, not a trickle. Remote loading can push the internal concentration far above the drug\'s free solubility by precipitating it as a salt or gel.',
      practice: { unknowns: ['N', 'd'] },
      stories: {
        N: 'A vesicle has a {d} aqueous core filled with a {C} drug solution. How many molecules does it carry?',
        d: 'How large a core is needed to hold {N} molecules at {C}?'
      }
    },
    {
      name: 'Lipid molecules in a vesicle',
      expr: 'n = 2*pi*d^2/a', tex: 'n = \\dfrac{2\\pi d^2}{a}',
      vars: {
        n: { name: 'lipid molecules per vesicle' },
        d: { name: 'vesicle diameter', q: 'length', unit: 'nm', value: 100 },
        a: { name: 'area occupied by one lipid head group', q: 'area', unit: 'nm²', value: 0.65 }
      },
      note: 'The factor 2 counts both leaflets of the bilayer (inner and outer surfaces are treated as equal, which is good to a few per cent above about 50 nm). Phosphatidylcholine occupies roughly 0.65 nm²; cholesterol packs tighter.',
      practice: { unknowns: ['n', 'd'] },
      stories: {
        n: 'How many lipid molecules build a {d} vesicle if each occupies {a}?',
        d: 'A vesicle contains {n} lipid molecules, each occupying {a}. What is its diameter?'
      }
    },
    {
      name: 'Encapsulation efficiency and drug loading',
      expr: 'EE = 100*menc/mtot', tex: '\\mathrm{EE} = 100\\,\\dfrac{m_{enc}}{m_{tot}}',
      vars: {
        EE: { name: 'encapsulation efficiency', q: false, unit: '%', tex: '\\mathrm{EE}' },
        menc: { name: 'drug inside the carriers (after separating the free drug)', q: false, unit: 'mg', value: 3.1, tex: 'm_{enc}' },
        mtot: { name: 'drug put into the batch', q: false, unit: 'mg', value: 5, tex: 'm_{tot}' }
      },
      note: 'Do not confuse it with the drug loading, the drug as a percentage of the whole carrier mass (drug + lipid or polymer), which is usually only a few per cent. A high efficiency with a low loading still means injecting a lot of excipient.',
      stories: {
        EE: 'A batch made with {mtot} of drug retains {menc} inside the carriers after the free drug is washed away. What is the encapsulation efficiency?',
        menc: 'A process with an encapsulation efficiency of {EE} is run with {mtot} of drug. How much ends up encapsulated?'
      }
    }
  ],
  examples: [
    {
      title: 'How much drug is in one liposome',
      q: 'A 100 nm liposome has a bilayer about 5 nm thick, so its aqueous core is roughly 90 nm across. Remote loading fills that core with drug at 200 mM. How many molecules does one vesicle carry, and how many vesicles make up a 50 mg dose of a drug of molar mass 580 g/mol?',
      steps: [
        'Core volume: $(\\pi/6)(90\\times10^{-9})^3 = 3.82\\times10^{-22}$ m³ = $3.82\\times10^{-19}$ L.',
        'Molecules: $200\\times10^{-3}$ mol/L $\\times 3.82\\times10^{-19}$ L $\\times 6.022\\times10^{23} = 4.6\\times10^{4}$ per vesicle.',
        'A 50 mg dose is $50/580 = 0.0862$ mmol, or $5.19\\times10^{19}$ molecules.',
        'Vesicles needed: $5.19\\times10^{19}/4.6\\times10^{4} = 1.1\\times10^{15}$ — about a thousand million million particles per dose.'
      ],
      a: 'Roughly 46 000 molecules per vesicle and about 1.1 × 10¹⁵ vesicles in a 50 mg dose.'
    },
    {
      title: 'Loading versus efficiency',
      q: 'A polymer nanoparticle batch is made from 200 mg of PLGA and 20 mg of drug. After purification the particles contain 14 mg of drug. What are the encapsulation efficiency and the drug loading?',
      steps: [
        'Efficiency: $100 \\times 14/20 = 70$ %.',
        'Loading: the particles weigh about $200 + 14 = 214$ mg, so the loading is $100 \\times 14/214 = 6.5$ % w/w.',
        'To give 100 mg of drug this formulation would deliver about 1.5 g of polymer — which is why loading, not efficiency, usually decides whether a nanocarrier is practical.'
      ],
      a: '70 % encapsulation efficiency but only 6.5 % w/w drug loading.'
    }
  ],
  quiz: [
    { q: 'Why does PEGylation extend the circulation time of a nanoparticle?', choices: ['it makes the particle smaller', 'the hydrated polymer brush hinders plasma proteins from adsorbing, so macrophages recognise it less', 'it gives the particle a strong positive charge', 'it stops the drug leaking out'], a: 1, why: 'PEG creates a water-rich steric barrier that suppresses the protein corona and therefore opsonisation and phagocytosis.' },
    { q: 'A carrier of hydrodynamic diameter 5 nm will circulate longer than one of 50 nm.', a: false, why: 'At 5 nm it is below the renal filtration cut-off (about 6–8 nm) and is cleared into the urine within minutes.' },
    { q: 'Why can most nanomedicines not be terminally sterilised in an autoclave?', choices: ['they are too dilute', 'heat melts, fuses or aggregates the carriers and can expel the drug, so they are made aseptically and filtered at 0.22 µm', 'autoclaves cannot reach the right temperature', 'sterilisation is not required for injections'], a: 1, why: 'Lipid and polymer carriers are thermolabile colloids; sterile filtration is the usual route, which also caps the size below about 200 nm.' },
    { q: 'Doubling the diameter of a liposome multiplies the number of drug molecules in its core by about…', choices: ['2', '4', '8', '16'], a: 2, why: 'The core volume goes as d³, so a doubling gives eight times the payload — while the lipid needed only goes up fourfold, with the surface.' },
    { q: 'A batch made with 25 mg of drug yields particles containing 5 mg. What is the encapsulation efficiency in per cent?', answer: 20, unit: '%', why: '100 × 5/25 = 20 %.' }
  ],
  problems: [
    { q: 'How many phospholipid molecules are needed for a 60 nm vesicle if each head group occupies 0.62 nm²?', answer: 36480, tol: 0.03, hint: 'Both leaflets.', steps: ['Surface $= \\pi d^2 = \\pi(60)^2 = 11\\,310$ nm² per leaflet, 22 620 nm² for both.', '$22\\,620/0.62 = 36\\,500$ molecules.'] },
    { q: 'A nanocrystal suspension has particles of 250 nm and a true density of 1.35 g/cm³. What is the specific surface area (m²/g)?', answer: 17.8, unit: 'm²/g', tol: 0.03, steps: ['$S_w = 6/(\\rho d) = 6/(1.35 \\times 0.25\\ \\mu\\mathrm{m}) = 17.8$ m²/g (with density in g/cm³ and diameter in µm).', 'Compare 0.044 m²/g for the same drug as 100 µm crystals — a 400-fold increase in dissolving surface.'] }
  ],
  applications: ['Reducing the toxicity of cytotoxic drugs and of amphotericin B without changing the molecule.', 'Solubilising drugs that would otherwise need harsh surfactant vehicles.', 'Nanocrystals to rescue development candidates that are too insoluble to absorb.', 'Depot and vaccine carriers, where the particle is also an immunological signal.'],
  history: 'Alec Bangham described the closed phospholipid vesicle in Cambridge in 1964 while studying blood clotting, and the idea of using it as a drug carrier followed within a decade. The enhanced permeability and retention argument was published by Matsumura and Maeda in 1986. The first liposomal medicines were approved in the 1990s, and albumin-bound paclitaxel in 2005; a 2016 review of the field pointed out how rarely the large accumulation seen in mice is reproduced in patients.',
  sim: 'adv-nanosize'
},

/* ================================================================ LIPID NANOPARTICLES */
{
  id: 'lipid-nanoparticles', parent: 'advanced-topic', title: 'Lipid nanoparticles and mRNA', level: 3,
  short: 'A lipid nanoparticle is four lipids mixed with nucleic acid in a fraction of a second. Its key component is an ionisable lipid that is neutral in the blood and becomes positively charged inside an acidifying endosome — which is how the RNA gets out of the bubble and into the cell.',
  keywords: ['lipid nanoparticle', 'LNP', 'mRNA', 'siRNA', 'ionisable lipid', 'apparent pKa', 'N/P ratio', 'microfluidic mixing', 'endosomal escape', 'PEG-lipid', 'cholesterol', 'DSPC', 'cold chain', 'cryoprotectant'],
  prereq: ['nanomedicine', 'ionisation-pka', 'biology:nucleic-acids', 'biology:endocytosis'],
  related: ['vaccine-formulation', 'targeted-delivery', 'lyophilisation', 'biologics-formulation', 'biology:translation', 'medicine:vaccines'],
  body: `
Messenger RNA is a terrible drug candidate on its own: a large, highly negatively charged molecule that cannot cross a membrane, is destroyed in minutes by ubiquitous ribonucleases, and provokes the innate immune system. The lipid nanoparticle is what turns it into a medicine — a delivery system that is at least as much of an invention as the RNA it carries.

### Four lipids, each with a job
| Component | Typical mole % | What it does |
|---|---|---|
| **Ionisable cationic lipid** | 45–50 | binds the RNA at acid pH; neutral in blood; recharges inside the endosome |
| **Phospholipid** (e.g. distearoylphosphatidylcholine) | 10 | structural helper that supports the bilayer at the surface |
| **Cholesterol** | 38–42 | fills the gaps, controls fluidity and fusion |
| **PEG–lipid** | 1.5–2 | sets the particle size, prevents aggregation, and slowly desorbs in vivo |

The PEG-lipid is the size dial: more of it gives smaller particles, because it stops growing particles from fusing. Because it also blocks uptake, it is designed with a short lipid anchor so that it leaves the particle within hours in the body.

### Why it must be *ionisable*, not cationic
Permanently cationic lipids bind nucleic acids well but are toxic and are cleared quickly, because a positive surface sticks to everything in blood. An ionisable lipid is a weak base with an **apparent pKa** of about 6.2–6.5. From the Henderson–Hasselbalch relation ([[ionisation-pka]]), at blood pH 7.4 only some 7 % of it is protonated — the particle is essentially neutral and circulates. Inside an endosome the proton pump drops the pH towards 5, at which point over 90 % is charged. The now cationic lipid pairs with the anionic lipids of the endosomal membrane, the pair adopts a cone shape, the bilayer flips into a non-bilayer phase, and the membrane is torn open long enough for RNA to reach the cytosol.

That escape is the bottleneck of the whole field: the best measurements suggest **only a few per cent** of internalised RNA ever reaches the cytosol. Much of the difference between one ionisable lipid and another is escape efficiency, not uptake.

### Making them
The particles are not "formulated" in a vessel — they are **precipitated by mixing**. An ethanol solution of the four lipids meets an acidic aqueous buffer (typically pH 4, where the ionisable lipid is charged and grips the RNA) in a microfluidic or T-junction mixer, in a few milliseconds. The lipids fall out of solution around the RNA, giving a particle with an electron-dense core of RNA and lipid rather than a hollow vesicle. The ethanol is then removed and the buffer exchanged to a neutral one, which switches the surface off. Size (typically 60–100 nm) and polydispersity are set by the mixing rate and the flow ratio — a process where mixing time, not chemistry, is the critical parameter ([[qbd]]).

Two numbers describe the composition: the **N/P ratio** (moles of ionisable nitrogen to moles of RNA phosphate, usually 4–6) and the encapsulation efficiency, measured by a fluorescent dye that only reaches free RNA (typically above 90 %).

### Why they are kept so cold
Lipid nanoparticles have three separate stability problems: the RNA hydrolyses at its phosphodiester backbone; the lipids oxidise and can form adducts with the RNA; and the particles fuse or aggregate. Freezing stops the first two and makes the third worse unless a cryoprotectant sugar (sucrose or trehalose, around 10 % w/v) is present to cushion the particles. That is why the first mRNA vaccines of December 2020 were distributed at −70 °C and −20 °C, with limited time at refrigerator temperature; at the time of writing, improved formulations have relaxed those conditions, and freeze-dried presentations are in development ([[lyophilisation]], [[packaging]]).

> [!fact] The first approved medicine delivered by a lipid nanoparticle was an siRNA for a rare amyloid disease (2018), which targets the liver almost by accident: without a targeting ligand, LNPs pick up apolipoprotein E from blood and are taken into liver cells through its receptor. Changing the ionisable lipid, or adding a charged fifth lipid, redirects them to the spleen or the lung — "selective organ targeting".

> [!warn] Vaccines and RNA medicines are prescribed and administered by professionals under their product information. These pages explain how the formulation works; they are not instructions for preparing, diluting or administering any product, and they are not advice about vaccination — ask a doctor, nurse or pharmacist.
`,
  ideas: [
    'The ionisable lipid is neutral at blood pH (apparent pKa about 6.2–6.5) and becomes cationic in the acidifying endosome, which drives membrane disruption and RNA release.',
    'Four lipids: ionisable lipid, phospholipid, cholesterol and PEG–lipid; the PEG–lipid fraction sets the particle size.',
    'Particles are formed by millisecond mixing of an ethanolic lipid stream with acidic RNA buffer, then dialysed to neutral pH.',
    'The N/P ratio (ionisable nitrogen to RNA phosphate, typically 4–6) and the encapsulation efficiency define the composition.',
    'Endosomal escape is only a few per cent of what is taken up — the field\'s central inefficiency.'
  ],
  pitfalls: [
    'Lipid nanoparticles are liposomes — They are not hollow vesicles: the RNA and ionisable lipid form a dense internal core, with a lipid monolayer-like shell. A liposome\'s aqueous core would not protect RNA in the same way.',
    'A cationic lipid would work just as well — Permanent cations bind blood components, are toxic and are cleared in minutes; the whole design depends on being neutral outside and charged inside.',
    'The vaccine had to be ultra-cold because mRNA is fragile — Both the RNA and the particle matter, and the temperature was a formulation choice of its time; the same chemistry with different buffers, sugars and lipids tolerates much milder storage.'
  ],
  formulas: [
    {
      name: 'N/P ratio',
      expr: 'NP = (mlip/Mlip)/(mRNA/Mnt)', tex: '\\mathrm{N/P} = \\dfrac{m_{lip}/M_{lip}}{m_{RNA}/M_{nt}}',
      vars: {
        NP: { name: 'N/P ratio (ionisable nitrogen per RNA phosphate)', q: false, tex: '\\mathrm{N/P}' },
        mlip: { name: 'ionisable lipid in the batch', q: false, unit: 'mg', value: 1.3, tex: 'm_{lip}' },
        Mlip: { name: 'molar mass of the ionisable lipid (one amine each)', q: false, unit: 'g/mol', value: 710, tex: 'M_{lip}' },
        mRNA: { name: 'RNA in the batch', q: false, unit: 'mg', value: 0.1, tex: 'm_{RNA}' },
        Mnt: { name: 'average mass per nucleotide (one phosphate each)', q: false, unit: 'g/mol', value: 330, fixed: true, tex: 'M_{nt}' }
      },
      note: 'Each nucleotide carries one phosphate, so the RNA phosphate moles are simply its mass divided by 330 g/mol. Ratios of 4–6 are usual: too low and encapsulation falls, too high and the excess lipid adds toxicity.',
      practice: { unknowns: ['NP', 'mlip'] },
      stories: {
        NP: 'A batch contains {mlip} of an ionisable lipid of molar mass {Mlip} and {mRNA} of RNA. What is the N/P ratio?',
        mlip: 'How much ionisable lipid of molar mass {Mlip} is needed to formulate {mRNA} of RNA at an N/P ratio of {NP}?'
      }
    },
    {
      name: 'Protonated fraction of the ionisable lipid',
      expr: 'f = 1/(1 + 10^(pH - pKa))', tex: 'f = \\dfrac{1}{1 + 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_a}}',
      vars: {
        f: { name: 'fraction protonated (charged)' },
        pH: { name: 'pH of the surroundings', value: 7.4, min: 2, max: 10, tex: '\\mathrm{pH}' },
        pKa: { name: 'apparent pKa of the lipid', value: 6.4, min: 3, max: 10, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'The Henderson–Hasselbalch relation for a weak base. At pH 7.4 with pKa 6.4 only 9 % is charged; at the endosomal pH 5.0 it is 96 %. An apparent pKa below about 6 leaves too little charge to escape; above about 7 the particle is cationic in blood and is cleared.',
      practice: { unknowns: ['f', 'pKa'] },
      stories: {
        f: 'An ionisable lipid has an apparent pKa of {pKa}. What fraction of it is charged at pH {pH}?',
        pKa: 'A lipid is {f} protonated at pH {pH}. What is its apparent pKa?'
      }
    },
    {
      name: 'RNA copies in one particle',
      expr: 'n = NA*(pi/6)*d^3*rho*w/M', tex: 'n = N_A\\,\\dfrac{\\pi}{6}d^3\\,\\dfrac{\\rho\\, w}{M}',
      vars: {
        n: { name: 'RNA molecules per particle' },
        NA: { const: 'NA' },
        d: { name: 'particle diameter', q: 'length', unit: 'nm', value: 80 },
        rho: { name: 'particle density', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        w: { name: 'RNA as a fraction of the particle mass', q: 'ratio', unit: '%', value: 5 },
        M: { name: 'molar mass of the mRNA', q: 'molarmass', unit: 'g/mol', value: 1.3e6 }
      },
      note: 'A 4000-nucleotide mRNA has a molar mass near 1.3 million g/mol. An 80 nm particle at 5 % RNA by mass therefore carries only a handful of copies — which is why the number of particles per dose, not just the microgrammes of RNA, is a quality attribute.',
      practice: { unknowns: ['n', 'd'] },
      stories: {
        n: 'A {d} particle of density {rho} is {w} RNA by mass. How many copies of a {M} mRNA does it hold?',
        d: 'How big must a particle of density {rho} with {w} RNA be to carry {n} copies of a {M} mRNA?'
      }
    }
  ],
  examples: [
    {
      title: 'The pH switch',
      q: 'An ionisable lipid has an apparent pKa of 6.25. How does its charge change between blood (pH 7.4), an early endosome (pH 6.0) and a late endosome (pH 5.0)?',
      steps: [
        'pH 7.4: $f = 1/(1 + 10^{1.15}) = 1/(1 + 14.1) = 0.066$ — 6.6 % charged, so the particle is effectively neutral and circulates.',
        'pH 6.0: $f = 1/(1 + 10^{-0.25}) = 1/(1 + 0.562) = 0.64$ — 64 % charged.',
        'pH 5.0: $f = 1/(1 + 10^{-1.25}) = 1/(1 + 0.056) = 0.947$ — 95 % charged.',
        'A drop of 2.4 pH units multiplies the charged fraction fourteen-fold; that is the trigger for fusion with the endosomal membrane.'
      ],
      a: 'From 6.6 % charged in blood to 95 % in the late endosome.'
    },
    {
      title: 'Counting a vaccine dose',
      q: 'A hypothetical dose contains 30 µg of a 4000-nucleotide mRNA (1.3 × 10⁶ g/mol) in 80 nm particles of density 1.0 g/cm³ containing 5 % RNA by mass. How many mRNA molecules and how many particles is that?',
      steps: [
        'Molecules: $30\\times10^{-6}/1.3\\times10^{6} = 2.31\\times10^{-11}$ mol, times $6.022\\times10^{23} = 1.39\\times10^{13}$ copies.',
        'One particle: volume $(\\pi/6)(80\\times10^{-9})^3 = 2.68\\times10^{-22}$ m³, mass $2.68\\times10^{-19}$ kg, RNA mass $1.34\\times10^{-20}$ kg, so $n = 1.34\\times10^{-20}/1300$ kg/mol $\\times 6.022\\times10^{23} = 6.2$ copies.',
        'Particles: $1.39\\times10^{13}/6.2 = 2.2\\times10^{12}$ per dose.',
        'If only 2 % of internalised RNA escapes the endosome, the effective delivery is of order 10¹¹ molecules — still a large number, which is why such small doses work.'
      ],
      a: 'About 1.4 × 10¹³ mRNA copies in roughly 2 × 10¹² particles.'
    }
  ],
  quiz: [
    { q: 'Why is the lipid ionisable rather than permanently cationic?', choices: ['to make the particle cheaper', 'so the particle is neutral in blood and only becomes charged in the acidic endosome, where charge is needed to break the membrane', 'to bind more RNA', 'so it can be filtered by the kidney'], a: 1, why: 'A permanent positive charge binds blood components and is toxic and quickly cleared; the ionisable lipid switches on only where it is useful.' },
    { q: 'With an apparent pKa of 6.4, roughly what fraction of the ionisable lipid is charged at pH 7.4?', choices: ['1 %', '9 %', '50 %', '91 %'], a: 1, why: 'f = 1/(1 + 10^(7.4 − 6.4)) = 1/11 = 0.09.' },
    { q: 'Raising the PEG–lipid from 1.5 to 5 mole per cent makes the particles larger.', a: false, why: 'More PEG–lipid stops growing particles from fusing, so they come out smaller — but uptake in cells also falls, because PEG hides the surface.' },
    { q: 'What limits how much of the delivered RNA actually works?', choices: ['the kidney', 'escape from the endosome into the cytosol, which is only a few per cent of what is taken up', 'dissolution of the particle', 'binding to plasma proteins'], a: 1, why: 'Uptake is efficient; escape is not. Improving escape is the main aim of new ionisable lipids.' },
    { q: 'A batch has 2.0 mg of an ionisable lipid (MW 700, one amine) and 0.12 mg of RNA. What is the N/P ratio (nucleotide mass 330 g/mol)?', answer: 7.86, tol: 0.03, why: '(2.0/700)/(0.12/330) = 2.857e−3/3.636e−4 = 7.9 — a little above the usual 4–6.' }
  ],
  problems: [
    { q: 'An ionisable lipid must be at least 80 % protonated at the endosomal pH of 5.2. What is the lowest apparent pKa that achieves this?', answer: 5.8, tol: 0.03, hint: 'Solve the Henderson–Hasselbalch relation for pKa.', steps: ['$0.8 = 1/(1 + 10^{5.2 - pK_a})$ gives $10^{5.2 - pK_a} = 0.25$.', '$5.2 - pK_a = \\log 0.25 = -0.602$, so $pK_a = 5.80$.'] },
    { q: 'How many copies of a 1.3 × 10⁶ g/mol mRNA fit in a 100 nm particle of density 1.0 g/cm³ containing 5 % RNA by mass?', answer: 12.1, tol: 0.05, steps: ['Volume $(\\pi/6)(10^{-7})^3 = 5.24\\times10^{-22}$ m³; mass $5.24\\times10^{-19}$ kg; RNA $2.62\\times10^{-20}$ kg.', '$2.62\\times10^{-20}/1300 \\times 6.022\\times10^{23} = 12$ copies — twice the 80 nm figure, because volume goes as $d^3$.'] }
  ],
  applications: ['mRNA vaccines, where the particle is both a delivery system and part of the immune signal.', 'siRNA medicines for liver targets, which reach hepatocytes through apolipoprotein E.', 'Gene-editing components delivered transiently, so that no DNA is integrated.', 'Protein-replacement approaches in which the patient\'s own cells make the missing protein for a few days.'],
  history: 'The ionisable-lipid principle grew out of two decades of work on nucleic-acid delivery in Vancouver and Boston, and reached the clinic in 2018 with an siRNA product for hereditary transthyretin amyloidosis. Two mRNA vaccines built on the same chemistry were authorised in December 2020, and the 2023 Nobel Prize in Physiology or Medicine went to Katalin Karikó and Drew Weissman for the nucleoside modification that made the mRNA itself tolerable — the delivery half of the problem had been solved in parallel.',
  sim: 'adv-lnp'
},

/* ================================================================ TARGETED DELIVERY */
{
  id: 'targeted-delivery', parent: 'advanced-topic', title: 'Targeted drug delivery', level: 3,
  short: 'Targeting means changing where a drug goes, not what it does. It can be passive (size and surface decide the destination), active (a ligand binds a receptor) or triggered (the drug is released by pH, an enzyme, heat or ultrasound) — and the arithmetic of how many molecules actually arrive is sobering.',
  keywords: ['targeted delivery', 'antibody-drug conjugate', 'DAR', 'ligand', 'GalNAc', 'folate receptor', 'transferrin', 'prodrug', 'binding-site barrier', 'triggered release', 'blood-brain barrier', 'bystander effect', 'therapeutic index'],
  prereq: ['nanomedicine', 'therapeutic-index', 'receptors', 'biology:endocytosis'],
  related: ['lipid-nanoparticles', 'oncology-drugs', 'biologics-formulation', 'depot-implants', 'medicine:immunotherapy', 'medicine:antibodies'],
  body: `
Paul Ehrlich's "magic bullet" — a substance that seeks out only the diseased cell — is more than a century old and still only partly achieved. It helps to be precise about what targeting can do: it cannot make a drug more potent, only change the ratio of concentration at the target to concentration everywhere else. That ratio is the whole prize, because it is what sets the [[therapeutic-index|therapeutic window]].

### Three kinds of targeting
- **Passive**: size, shape and surface decide the destination. Particles above 200 nm go to liver and spleen; 5 µm particles lodge in the lung; uncoated particles pick up a protein corona that routes them to macrophages; lipid nanoparticles collect apolipoprotein E and go to hepatocytes ([[nanomedicine]]).
- **Active**: a ligand on the surface binds a receptor that is more common on the target cell. The outstanding success is **GalNAc**, a sugar cluster that binds the asialoglycoprotein receptor — a receptor present at about a million copies per liver cell and almost nowhere else, which recycles every 15 minutes. Several siRNA medicines are simply the RNA with a GalNAc tail, given subcutaneously.
- **Triggered**: the carrier releases its drug where conditions differ — the acidity of a tumour or an endosome, a tumour protease, redox conditions inside a cell, local heating (thermosensitive liposomes melt at 41 °C), or ultrasound bursting a microbubble.

### Antibody–drug conjugates: targeting with numbers
An ADC is a monoclonal antibody, a linker and a payload so potent that it could never be given on its own — typically effective at picomolar concentrations. Three parameters define it:

- the **drug-to-antibody ratio** (DAR), usually 2–8: too low wastes antibody, too high makes the conjugate hydrophobic, aggregation-prone and quickly cleared;
- the **linker**: non-cleavable (the payload is only freed when the whole antibody is digested in the lysosome) or cleavable by a protease, by acid or by the reducing environment of the cytosol — which allows a **bystander effect**, where freed payload diffuses to neighbouring cells that do not carry the antigen;
- the **conjugation chemistry**: random attachment to lysines or cysteines gives a distribution of DARs (a heterogeneous product); site-specific chemistry gives a uniform one.

The arithmetic is unforgiving. A cell with 300 000 target receptors that recycles them three times can internalise of the order of 10⁶ payload molecules with a DAR of 4 — and tubulin-binding payloads need roughly that many to kill a cell. That narrow margin is why potency and DAR matter so much, and why ADCs still have dose-limiting toxicity from the payload released in the circulation.

### The barriers that defeat targeting
| Barrier | Why it bites |
|---|---|
| **Binding-site barrier** | a very high-affinity ligand binds the first cells it meets and never penetrates the tumour |
| **Antigen heterogeneity** | not every tumour cell carries the antigen; the bystander effect is a partial answer |
| **Delivery, not affinity** | reaching the tissue at all is usually the limiting step; better binding does not help if the carrier never arrives |
| **The blood–brain barrier** | tight junctions and efflux pumps; approaches use transferrin or insulin receptor shuttles, and even then only a per cent or so of the dose enters |
| **Immunogenicity** | repeated dosing raises antibodies against the ligand or the PEG |

> [!key] Targeting is a ratio, not a destination. Doubling the concentration at the target while halving it elsewhere is a fourfold gain in selectivity — and that is a very good result.

### Prodrugs: targeting by chemistry
The oldest and cheapest form of targeting is a prodrug that is activated where it should act: a colon-targeted azo compound cleaved by gut bacteria, an ester activated by a tumour enzyme, an antiviral triphosphorylated only inside infected cells. No carrier, no ligand, and no manufacturing complexity — which is why prodrugs still outnumber every fashionable delivery technology in practice ([[first-pass]]).

> [!warn] Targeted medicines are still toxic medicines: their side effects are simply different ones. Decisions about cancer or immune treatments belong with an oncology or specialist team.
`,
  ideas: [
    'Targeting changes the ratio of target to non-target exposure; it does not make a drug more potent.',
    'Passive targeting comes from size and surface; active targeting from a ligand and a receptor; triggered release from pH, enzymes, redox, heat or ultrasound.',
    'GalNAc conjugates work so well because the asialoglycoprotein receptor is abundant, liver-specific and rapidly recycling.',
    'An ADC is defined by its DAR (usually 2–8), its linker chemistry and how uniformly it is conjugated.',
    'High affinity can hurt: the binding-site barrier keeps a very sticky ligand at the edge of a tumour.'
  ],
  pitfalls: [
    'A targeted drug goes only to its target — Most of the dose still goes elsewhere; a few per cent of the injected dose reaching the target tissue is a good result, and side effects follow the rest.',
    'A stronger-binding ligand always targets better — Beyond a point, affinity causes the binding-site barrier and poorer penetration; delivery to the tissue, not binding, is usually limiting.',
    'A higher drug-to-antibody ratio means a better conjugate — Above about 8 the conjugate becomes hydrophobic, aggregates and is cleared faster, so the exposure falls even though each antibody carries more.'
  ],
  formulas: [
    {
      name: 'Receptor occupancy',
      expr: 'theta = C/(C + Kd)', tex: '\\theta = \\dfrac{C}{C + K_d}',
      vars: {
        theta: { name: 'fraction of receptors occupied', q: 'ratio', unit: '%', tex: '\\theta' },
        C: { name: 'free ligand concentration at the target', q: 'concentration', unit: 'nM', value: 5 },
        Kd: { name: 'dissociation constant of the ligand', q: 'concentration', unit: 'nM', value: 2, tex: 'K_d' }
      },
      note: 'The law of mass action: at C = Kd half the receptors are bound. For a targeted carrier the question is not the affinity but whether C at the target is anywhere near Kd after distribution and clearance.',
      practice: { unknowns: ['theta', 'Kd'] },
      stories: {
        theta: 'A ligand with {Kd} reaches a free concentration of {C} at the target. What fraction of the receptors is occupied?',
        Kd: 'At a free concentration of {C}, {theta} of the receptors are occupied. What is the dissociation constant?'
      }
    },
    {
      name: 'Drug-to-antibody ratio',
      expr: 'DAR = (cdrug/Mdrug)/(cab/Mab)', tex: '\\mathrm{DAR} = \\dfrac{c_{drug}/M_{drug}}{c_{ab}/M_{ab}}',
      vars: {
        DAR: { name: 'average payload molecules per antibody', q: false, tex: '\\mathrm{DAR}' },
        cdrug: { name: 'payload concentration measured', q: false, unit: 'mg/mL', value: 0.176, tex: 'c_{drug}' },
        Mdrug: { name: 'molar mass of the payload + linker', q: false, unit: 'g/mol', value: 1300, tex: 'M_{drug}' },
        cab: { name: 'antibody concentration', q: false, unit: 'mg/mL', value: 5, tex: 'c_{ab}' },
        Mab: { name: 'molar mass of the antibody', q: false, unit: 'g/mol', value: 148000, tex: 'M_{ab}' }
      },
      note: 'Measured by UV absorbance at two wavelengths, by hydrophobic-interaction chromatography or by mass spectrometry, which also shows the distribution of DAR values around the average.',
      practice: { unknowns: ['DAR', 'cdrug'] },
      stories: {
        DAR: 'A conjugate assays {cdrug} of payload (molar mass {Mdrug}) and {cab} of antibody (molar mass {Mab}). What is the average DAR?',
        cdrug: 'What payload concentration corresponds to a DAR of {DAR} at an antibody concentration of {cab}?'
      }
    },
    {
      name: 'Payload molecules delivered into a cell',
      expr: 'N = DAR*Rc*c', tex: 'N = \\mathrm{DAR}\\times R_c \\times c',
      vars: {
        N: { name: 'payload molecules delivered per cell' },
        DAR: { name: 'drug-to-antibody ratio', value: 4, tex: '\\mathrm{DAR}' },
        Rc: { name: 'target receptors per cell', value: 300000, int: true, tex: 'R_c' },
        c: { name: 'internalisation cycles (receptor recycling)', value: 3 }
      },
      note: 'An upper bound: it assumes every receptor is occupied and internalised each cycle and that nothing is lost. Tubulin-binding payloads need of the order of 10⁶ molecules to kill a cell, so the margin is often less than tenfold — which is why very potent payloads and high receptor counts are both necessary.',
      practice: { unknowns: ['N', 'Rc'] },
      stories: {
        N: 'A conjugate with a DAR of {DAR} binds a cell carrying {Rc} receptors that recycle {c} times. How many payload molecules can be delivered?',
        Rc: 'How many receptors must a cell carry for {N} payload molecules to be delivered at a DAR of {DAR} over {c} cycles?'
      }
    }
  ],
  examples: [
    {
      title: 'Is the conjugate worth it?',
      q: 'A payload kills cells at 0.1 nM but, given free, its maximum tolerated plasma concentration is 1 nM. As a conjugate with DAR 4 it reaches 500 nM of antibody in plasma, of which 1 % of the dose reaches the tumour and is internalised. Compare the two.',
      steps: [
        'Free drug: the margin between effect (0.1 nM) and tolerability (1 nM) is tenfold — a narrow but workable window, although the drug reaches every tissue equally.',
        'Conjugate: 500 nM antibody at DAR 4 is 2000 nM of payload in plasma, but it is inert while attached.',
        'At the tumour, 1 % of that payload is released inside cells, giving a local concentration of order 20 nM — 200 times the killing concentration, while circulating free payload stays far below 1 nM.',
        'The gain is not potency but the ratio: roughly a hundredfold improvement in selectivity, which is what makes an unusable cytotoxin into a medicine.'
      ],
      a: 'The conjugate wins on selectivity (about 100-fold), not on potency.'
    },
    {
      title: 'Checking a DAR',
      q: 'A conjugate batch assays 4.8 mg/mL of antibody (150 000 g/mol) and 0.21 mg/mL of payload-linker (1250 g/mol). What is the average DAR, and is it in the usual range?',
      steps: [
        'Payload: $0.21/1250 = 1.68\\times10^{-4}$ mmol/mL.',
        'Antibody: $4.8/150\\,000 = 3.2\\times10^{-5}$ mmol/mL.',
        'DAR $= 1.68\\times10^{-4}/3.2\\times10^{-5} = 5.25$.',
        'Within the usual 2–8, though a mass-spectrometry profile should show how wide the distribution is around that average — a mean of 5.25 could be a mixture of 0 and 8.'
      ],
      a: 'DAR ≈ 5.3, within the normal range; the distribution matters as much as the mean.'
    }
  ],
  quiz: [
    { q: 'What does active targeting actually improve?', choices: ['the intrinsic potency of the drug', 'the ratio of target to non-target exposure', 'the drug\'s solubility', 'the rate of hepatic metabolism'], a: 1, why: 'Targeting redistributes the same molecules; the therapeutic gain is the selectivity ratio, not potency.' },
    { q: 'Why can a very high-affinity ligand deliver a drug worse than a moderate one?', choices: ['it dissolves poorly', 'it binds the first cells it meets and never penetrates deeper — the binding-site barrier', 'it is cleared by the kidney', 'high affinity blocks internalisation'], a: 1, why: 'Very tight binding at the tumour periphery prevents diffusion into the tissue, so the core receives nothing.' },
    { q: 'A ligand has a Kd of 4 nM and reaches 12 nM at the target. What fraction of receptors is occupied (per cent)?', answer: 75, unit: '%', why: 'θ = 12/(12 + 4) = 0.75.' },
    { q: 'A cleavable linker allows the released payload to affect neighbouring cells that lack the antigen.', a: true, why: 'That is the bystander effect; it helps with heterogeneous tumours but adds toxicity to nearby normal tissue.' },
    { q: 'GalNAc conjugates target the liver because…', choices: ['the liver filters everything', 'the asialoglycoprotein receptor is abundant, liver-specific and recycles quickly', 'GalNAc is very lipophilic', 'the liver has no efflux pumps'], a: 1, why: 'About a million receptors per hepatocyte, recycling every quarter of an hour, gives an unusually efficient uptake route.' }
  ],
  problems: [
    { q: 'A carrier delivers 2 % of the injected dose per gram to a tumour and 0.15 % per gram to bone marrow. What is the selectivity ratio?', answer: 13.3, tol: 0.03, steps: ['$2/0.15 = 13.3$.', 'Better than most untargeted cytotoxics, and enough to matter clinically — but far from the "magic bullet" picture.'] },
    { q: 'A conjugate with DAR 3 binds a cell with 120 000 receptors that recycle twice. How many payload molecules can reach the cell (upper bound)?', answer: 720000, tol: 0.02, steps: ['$3 \\times 120\\,000 \\times 2 = 720\\,000$ molecules.', 'Against a requirement of about a million for a tubulin binder, that is marginal — which is why such conjugates need either higher receptor counts or a more potent payload.'] }
  ],
  applications: ['Antibody–drug conjugates in oncology and, increasingly, in immune and infectious disease.', 'GalNAc–siRNA medicines that treat liver targets with subcutaneous injections months apart.', 'Thermosensitive liposomes released by focused ultrasound or local heating.', 'Receptor-mediated shuttles that carry enzymes and antibodies across the blood–brain barrier.'],
  history: 'Paul Ehrlich coined "magic bullet" (Zauberkugel) around 1900. The first antibody–drug conjugate was approved in 2000, withdrawn in 2010 after a confirmatory trial failed, and returned in 2017 at a lower, fractionated dose — a reminder that the dose regimen, not only the molecule, decides whether a targeted medicine works.',
  sim: 'adv-nanosize'
},

/* ================================================================ BIOLOGICS FORMULATION */
{
  id: 'biologics-formulation', parent: 'advanced-topic', title: 'Formulating proteins and antibodies', level: 3,
  short: 'A therapeutic protein is held in shape by weak forces worth only 20–60 kJ/mol, and everything about its formulation — buffer, sugar, surfactant, container, temperature — exists to keep it folded, monomeric and unadsorbed until it is injected.',
  keywords: ['biologic', 'monoclonal antibody', 'aggregation', 'deamidation', 'oxidation', 'polysorbate', 'preferential exclusion', 'trehalose', 'histidine buffer', 'viscosity', 'subvisible particles', 'immunogenicity', 'cold chain', 'melting temperature', 'freeze-thaw'],
  prereq: ['injectable-formulation', 'biology:protein-structure', 'chemistry:intermolecular-forces', 'lyophilisation'],
  related: ['biologics', 'depot-implants', 'vaccine-formulation', 'targeted-delivery', 'shelf-life', 'excipient-compatibility'],
  body: `
A small molecule either is or is not the right compound. A protein can be the right compound and still be useless: unfolded, clumped, stuck to the glass, or oxidised at one methionine out of thirty. Formulating biologics is the art of keeping a marginally stable structure intact for two years.

### How little holds a protein together
The free energy of folding of a typical globular protein is only 20–60 kJ/mol — a few hydrogen bonds' worth ([[chemistry:hydrogen-bonding]]). The fraction unfolded at any instant follows a simple two-state equilibrium, and it is small but never zero. That matters because unfolding is where aggregation starts: an exposed hydrophobic patch finds another one, and the dimer is far more stable than either monomer was.

### The degradation routes
| Route | What happens | What slows it |
|---|---|---|
| **Aggregation** | partly unfolded molecules stick; dimers grow to subvisible and visible particles | sugars, correct pH, low interface area, cold |
| **Deamidation** | asparagine becomes aspartate or isoaspartate, changing charge | pH 5–6 rather than neutral, low temperature |
| **Oxidation** | methionine and tryptophan take up oxygen, often catalysed by trace metals or light | headspace nitrogen, chelators, amber glass |
| **Fragmentation** | hydrolysis of the peptide backbone, often in the hinge | pH, temperature |
| **Disulfide shuffling** | bonds rearrange in alkaline conditions | pH control |
| **Adsorption** | the protein spreads on glass, steel, silicone oil or an air bubble and unfolds | a surfactant, a coated container |

Interfaces are the enemy people forget. Shaking a vial gives a huge, constantly renewed air–water interface; the protein adsorbs on it, unfolds and comes back as an aggregate. A little polysorbate 20 or 80 (typically 0.01–0.1 % w/v) sits at the interface instead. Silicone oil in a prefilled syringe does the same thing, which is why syringe-based products test aggregation separately.

### The excipients and why they are there
- **Buffer**: histidine, acetate or citrate at 10–30 mM, usually pH 5.0–6.5 — a compromise between deamidation (faster above 6) and aggregation (often faster at very low pH). Phosphate is avoided in frozen products because it shifts pH sharply on freezing ([[buffers-pharm]]).
- **Stabiliser**: sucrose or trehalose at 5–10 % w/v. They work by **preferential exclusion** — the sugar is pushed away from the protein surface, which makes the more expanded unfolded state thermodynamically costlier. In a freeze-dried cake the same sugar replaces the hydrogen bonds of lost water and forms a glass ([[lyophilisation]]).
- **Surfactant**: polysorbate, to protect interfaces — and itself a headache, because it slowly hydrolyses and oxidises.
- **Tonicity agent**: sodium chloride or more sugar, to reach roughly 290 mOsm/L ([[osmolarity-tonicity]]).
- **Sometimes arginine**, which lowers viscosity and suppresses aggregation by shielding charged patches.

### High concentration and the syringe
Subcutaneous injection accepts about 1–2 mL, so an antibody dose of 150 mg means 100–150 mg/mL. At those concentrations solutions become viscous — sometimes 20–50 mPa·s — through reversible self-association, and the force to push them through a thin needle scales as the fourth power of the needle bore. An injection that needs more than roughly 20–30 N is not usable by hand, so formulators trade viscosity, needle gauge, injection time and autoinjector spring force against one another. Very large volumes are made possible by co-formulating an enzyme that temporarily opens the subcutaneous matrix.

> [!key] Aggregates are the safety issue, not just a quality one: particulate aggregates are the strongest known formulation driver of immunogenicity, which is why products are tested for subvisible particles (USP <787>, <788>) and why a biologic that has been frozen, shaken or left warm should never be used.

### Cold chain and handling
Most protein products are stored at 2–8 °C, protected from light, and must not be frozen — ice damages them by concentrating solutes, changing pH and creating a vast ice–water interface. Arrhenius extrapolation ([[shelf-life]]) is unreliable for proteins, because heating unfolds them and unfolding does not reverse, so real-time data at the storage temperature is the only accepted basis for the shelf life ([[stability-testing]]).

> [!warn] A biological medicine that has been frozen, shaken hard, or stored outside its labelled temperature may look perfectly clear and still be unsafe or ineffective. Do not use it; ask the pharmacy. These pages explain the science and are not instructions for handling any particular product.
`,
  ideas: [
    'Folding free energies of 20–60 kJ/mol mean a small but constant fraction of any protein is unfolded — where aggregation begins.',
    'Interfaces (air, silicone oil, steel, glass) unfold proteins; a small amount of polysorbate occupies the interface instead.',
    'Sugars stabilise by preferential exclusion in solution and by replacing water\'s hydrogen bonds in a freeze-dried glass.',
    'Aggregates drive immunogenicity, so subvisible particle counts are a safety specification.',
    'High-concentration antibody solutions are viscous, and injection force rises as the fourth power of the needle bore.'
  ],
  pitfalls: [
    'If the solution is clear, the protein is fine — Dimers, small oligomers and chemical changes such as deamidation are invisible; size-exclusion chromatography and charge methods are what detect them.',
    'Freezing preserves proteins, as it does food — Freezing concentrates solutes, can shift pH by two units with phosphate buffers and creates an enormous ice interface; most protein products are explicitly not to be frozen.',
    'Accelerated stability at 40 °C predicts the shelf life of a protein — It predicts almost nothing, because heating triggers unfolding pathways that do not operate at 5 °C. Real-time data is required.'
  ],
  formulas: [
    {
      name: 'Protein concentration from absorbance at 280 nm',
      expr: 'C = A/(eps*l)', tex: 'C = \\dfrac{A}{\\varepsilon\\, l}',
      vars: {
        C: { name: 'protein concentration', q: false, unit: 'mg/mL', value: 0.5 },
        A: { name: 'absorbance at 280 nm (after blanking)', q: false, value: 0.7 },
        eps: { name: 'extinction coefficient', q: false, unit: 'mL/(mg·cm)', value: 1.4, tex: '\\varepsilon' },
        l: { name: 'path length', q: false, unit: 'cm', value: 1, fixed: true }
      },
      note: 'Typical antibody extinction coefficients are 1.3–1.6 mL/(mg·cm), set by the tryptophan and tyrosine content. Scattering from aggregates inflates A280, so a reading is usually corrected with the absorbance at 320 nm.',
      practice: { unknowns: ['C', 'A'] },
      stories: {
        C: 'A diluted sample reads {A} at 280 nm in a {l} cuvette; the extinction coefficient is {eps}. What is the concentration?',
        A: 'What absorbance would a {C} solution give with an extinction coefficient of {eps}?'
      }
    },
    {
      name: 'Fraction of protein unfolded',
      expr: 'fu = 1/(1 + exp(dG/(R*T)))', tex: 'f_u = \\dfrac{1}{1 + e^{\\Delta G/RT}}',
      vars: {
        fu: { name: 'fraction unfolded at equilibrium', tex: 'f_u' },
        dG: { name: 'free energy of unfolding', q: 'molarenergy', unit: 'kJ/mol', value: 25, tex: '\\Delta G' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 }
      },
      note: 'A two-state model. With ΔG = 25 kJ/mol only one molecule in 24 000 is unfolded at 25 °C — but in a 150 mg/mL solution that is still an enormous number of molecules looking for a partner to aggregate with. ΔG itself falls as temperature rises, so this underestimates the effect of warming.',
      practice: { unknowns: ['fu', 'dG'] },
      stories: {
        fu: 'A protein has an unfolding free energy of {dG} at {T}. What fraction is unfolded?',
        dG: 'At {T} a protein is {fu} unfolded. What is its unfolding free energy?'
      }
    },
    {
      name: 'Force to inject through a needle',
      expr: 'F = 128*eta*L*Q*Ap/(pi*dn^4)', tex: 'F = \\dfrac{128\\,\\eta\\, L\\, Q\\, A_p}{\\pi\\, d_n^4}',
      vars: {
        F: { name: 'force on the plunger', q: 'force', unit: 'N' },
        eta: { name: 'viscosity of the formulation', q: 'viscosity', unit: 'mPa·s', value: 30, tex: '\\eta' },
        L: { name: 'needle length', q: 'length', unit: 'mm', value: 12.7 },
        Q: { name: 'injection flow rate', q: 'flowrate', unit: 'mL/min', value: 6 },
        Ap: { name: 'plunger area', q: 'area', unit: 'mm²', value: 69, tex: 'A_p' },
        dn: { name: 'needle inner diameter', q: 'length', unit: 'mm', value: 0.21, tex: 'd_n' }
      },
      note: 'Hagen–Poiseuille pressure drop times the plunger area; it ignores the syringe barrel and friction, so it is an optimistic lower bound. The fourth power is brutal: a 27G needle (0.21 mm) needs about 2.3 times the force of a 25G one (0.26 mm).',
      practice: { unknowns: ['F', 'eta', 'dn'] },
      stories: {
        F: 'A {eta} solution is injected at {Q} through a {L} needle of {dn} bore, with a plunger of {Ap}. What force is needed?',
        eta: 'An autoinjector can supply {F} through a {dn} needle of {L} at {Q} with a {Ap} plunger. What is the highest usable viscosity?',
        dn: 'What needle bore keeps the force to {F} for a {eta} formulation at {Q}?'
      }
    }
  ],
  examples: [
    {
      title: 'Can a patient inject it?',
      q: 'A 150 mg/mL antibody has a viscosity of 30 mPa·s. Delivering 1 mL in 10 seconds through a 12.7 mm, 27G needle (0.21 mm bore) with a 1 mL syringe (plunger 69 mm²) — what force is needed, and what can be changed?',
      steps: [
        'Flow: 1 mL in 10 s = 6 mL/min = $1\\times10^{-7}$ m³/s.',
        '$\\Delta p = 128 \\times 0.03 \\times 0.0127 \\times 10^{-7}/(\\pi (2.1\\times10^{-4})^4) = 4.88\\times10^{-9}/6.11\\times10^{-15} = 8.0\\times10^{5}$ Pa (8 bar).',
        '$F = 8.0\\times10^{5} \\times 6.9\\times10^{-5} = 55$ N — far beyond a comfortable thumb force of 20–30 N.',
        'Options: a 25G needle (0.26 mm) cuts it to 23 N; injecting over 20 seconds halves it again; arginine or a different buffer may bring the viscosity to 12 mPa·s; or an autoinjector supplies the force.'
      ],
      a: 'About 55 N as designed — usable only after widening the needle, slowing the injection, lowering the viscosity or using a device.'
    },
    {
      title: 'How much is unfolded',
      q: 'An antibody has an unfolding free energy of 30 kJ/mol at 5 °C, falling to 18 kJ/mol at 40 °C. Compare the unfolded fractions, in a 100 mg/mL solution (molar mass 148 000 g/mol).',
      steps: [
        'At 5 °C: $f_u = 1/(1 + e^{30\\,000/(8.314 \\times 278.15)}) = 1/(1 + e^{12.97}) = 2.3\\times10^{-6}$.',
        'At 40 °C: $f_u = 1/(1 + e^{18\\,000/(8.314 \\times 313.15)}) = 1/(1 + e^{6.92}) = 9.9\\times10^{-4}$ — four hundred times more.',
        'Molecules per mL: $100/148\\,000 \\times 6.022\\times10^{23}/1000 = 4.1\\times10^{17}$ per mL.',
        'So even at 5 °C about $9\\times10^{11}$ molecules per mL are unfolded at any instant — the aggregation reaction never has a shortage of reactant, only of opportunity.'
      ],
      a: '2.3 × 10⁻⁶ at 5 °C against 9.9 × 10⁻⁴ at 40 °C — a 430-fold difference, and never zero.'
    }
  ],
  quiz: [
    { q: 'Why does a small amount of polysorbate protect a protein solution?', choices: ['it lowers the pH', 'it occupies air–water and oil–water interfaces so the protein does not adsorb and unfold there', 'it binds the protein tightly', 'it acts as an antioxidant'], a: 1, why: 'Surfactants out-compete the protein for interfaces, which is where shaking-induced aggregation begins.' },
    { q: 'Most antibody formulations sit at pH 5.0–6.5 rather than pH 7.4 because…', choices: ['it is more comfortable to inject', 'deamidation and many aggregation routes are slower there', 'antibodies are insoluble at pH 7', 'buffers do not work at pH 7'], a: 1, why: 'Asparagine deamidation accelerates above pH 6, and most antibodies are colloidally more stable a few units below their isoelectric point.' },
    { q: 'Freezing a protein solution is a safe way to extend its life.', a: false, why: 'Ice formation concentrates solutes, can shift the pH of a phosphate buffer by two units and creates an enormous interface; most protein medicines carry "do not freeze".' },
    { q: 'Halving the needle inner diameter multiplies the injection force by about…', choices: ['2', '4', '8', '16'], a: 3, why: 'Poiseuille flow: the pressure drop at a fixed flow rate goes as 1/d⁴, so halving the bore multiplies the force sixteenfold.' },
    { q: 'What makes subvisible particles a safety specification rather than only a cosmetic one?', choices: ['they block needles', 'protein aggregates are a strong driver of immunogenicity', 'they change the colour', 'they alter the pH'], a: 1, why: 'Repeating aggregate structures resemble the patterns the immune system evolved to notice, and anti-drug antibodies can destroy efficacy or cause reactions.' }
  ],
  problems: [
    { q: 'A protein has an unfolding free energy of 22 kJ/mol at 25 °C. What fraction is unfolded?', answer: 1.4e-4, tol: 0.05, steps: ['$22\\,000/(8.314 \\times 298.15) = 8.876$; $e^{8.876} = 7160$.', '$f_u = 1/7161 = 1.40\\times10^{-4}$ — about one molecule in 7000.'] },
    { q: 'An antibody solution reads 0.612 at 280 nm after a 200-fold dilution, in a 1 cm cuvette, with an extinction coefficient of 1.45 mL/(mg·cm). What is the concentration of the undiluted product (mg/mL)?', answer: 84.4, unit: 'mg/mL', tol: 0.02, steps: ['Diluted: $0.612/(1.45 \\times 1) = 0.422$ mg/mL.', 'Undiluted: $0.422 \\times 200 = 84.4$ mg/mL.'] }
  ],
  applications: ['Monoclonal antibodies for cancer, autoimmune and inflammatory disease, formulated for subcutaneous self-injection.', 'Insulins and growth factors, where the formulation also controls the release profile.', 'Enzyme replacement therapies given as infusions.', 'Prefilled syringes and autoinjectors, where the device and the formulation must be designed together.'],
  history: 'Insulin, from 1922, was the first therapeutic protein, and the first for which formulation decided everything: zinc and protamine were added in the 1930s and 1940s to slow its release. The modern discipline of protein formulation dates from the arrival of recombinant products in the 1980s, and the industry-wide attention to aggregation and immunogenicity followed a well-documented episode in the late 1990s in which a change of container and stabiliser in an erythropoietin product coincided with a cluster of severe anti-drug antibody reactions.',
  sim: 'adv-aggregation'
},

/* ================================================================ VACCINE FORMULATION */
{
  id: 'vaccine-formulation', parent: 'advanced-topic', title: 'Vaccines and adjuvants', level: 2,
  short: 'A vaccine is a formulation problem as much as an immunological one: the antigen must survive storage and distribution, be presented to the immune system with the right signal — that is what an adjuvant does — and arrive at a clinic at the right temperature, often thousands of kilometres away.',
  keywords: ['vaccine formulation', 'adjuvant', 'aluminium hydroxide', 'alum', 'squalene emulsion', 'stabiliser', 'cold chain', 'vaccine vial monitor', 'multi-dose vial', 'preservative', 'lyophilised vaccine', 'reconstitution', 'potency', 'thermostability'],
  prereq: ['injectable-formulation', 'lyophilisation', 'shelf-life', 'medicine:adaptive-immunity'],
  related: ['lipid-nanoparticles', 'vaccines-overview', 'biologics-formulation', 'preservatives', 'packaging', 'medicine:vaccines'],
  body: `
The immunology of a vaccine decides whether it can work. The formulation decides whether it still works after a year in a warehouse, a week in a truck and a morning in a cool box — and whether the immune system takes it seriously at all.

### Platforms and what each needs from a formulation
| Platform | Example antigen | Formulation problem |
|---|---|---|
| Inactivated whole organism | killed virus or bacterium | keeping the surface structures intact; usually adjuvanted |
| Live attenuated | weakened virus or bacterium | the antigen is alive: freeze-dried, kept cold, reconstituted just before use |
| Protein subunit / conjugate | purified protein, or polysaccharide linked to a carrier protein | weak on its own, so it needs an adjuvant; a protein with all the problems of [[biologics-formulation]] |
| Viral vector | a harmless virus carrying a gene | a biological particle: frozen or refrigerated, sensitive to light and shear |
| Nucleic acid | mRNA in a lipid nanoparticle | RNA hydrolysis and particle fusion ([[lipid-nanoparticles]]) |

Purified proteins and polysaccharides are poor immunogens because the immune system responds to danger, not merely to a foreign shape. An **adjuvant** supplies that danger signal.

### What adjuvants do
- **Aluminium salts** (aluminium hydroxide and aluminium phosphate, in use since the 1920s) are gels of nanoscale fibres with a huge surface, onto which antigen adsorbs — electrostatically for the hydroxide (positively charged at neutral pH, binding acidic antigens) and by ligand exchange with phosphate groups. They present antigen in a particulate form, activate innate pathways, and mildly prolong its residence. The classical "depot" explanation is now known to be only part of the story. Adsorption follows a Langmuir-type isotherm, and the degree of adsorption is a release specification, because a vaccine whose antigen has desorbed is a different product.
- **Oil-in-water emulsions** of squalene, stabilised by surfactants and made by high-pressure homogenisation to droplets of 150–160 nm, give stronger responses and allow **antigen sparing** — less antigen per dose, which matters enormously during a shortage.
- **Defined immune stimulants**, such as bacterial-derived lipid A analogues or plant saponins, usually formulated into liposomes so that the stimulant and antigen arrive at the same cell.

> [!key] Aluminium-adjuvanted vaccines must never be frozen. Freezing agglomerates the gel irreversibly; the vaccine may look normal after thawing but the antigen presentation — and the protection — is lost. In field surveys, freezing damage has repeatedly been found to be more common than heat damage.

### The rest of the vial
Stabilisers (sucrose, sorbitol, amino acids, recombinant albumin) protect the antigen in solution and form the glass of a freeze-dried cake; buffers hold the pH; salts set tonicity; a preservative is required in most multi-dose vials, because a vial is entered many times — 2-phenoxyethanol is common today, and thiomersal, once widely used, has been removed from most single-dose products since the late 1990s as a precaution although reviews found no evidence of harm at those levels ([[preservatives]]).

A freeze-dried vaccine comes with its own diluent, which must be the specified one and at a similar temperature; once reconstituted, a live vaccine has an in-use life of only a few hours ([[compounding]]).

### The cold chain
Most vaccines are distributed at 2–8 °C; some live and mRNA products need freezing. Potency loss is a chemical reaction, so it accumulates: an hour at 37 °C costs far more than an hour at 8 °C, and the losses from separate excursions add up over a vaccine's life. Three tools manage this in practice:

- the **vaccine vial monitor**, a small heat-sensitive square on the label that darkens irreversibly with accumulated heat — a cheap, self-contained integrator of time and temperature, introduced in the 1990s and credited with making mass campaigns possible;
- **controlled temperature chain** protocols, in which a thermostable vaccine may spend a defined period (for example a few days below 40 °C) outside the cold chain for the last leg of a campaign;
- **mean kinetic temperature**, the single temperature that would have caused the same total degradation as a fluctuating history — always higher than the arithmetic mean, because the Arrhenius relation is convex ([[shelf-life]], [[stability-testing]]).

> [!warn] Vaccines are given by trained staff under their product information, and a vaccine exposed to heat or freezing must be assessed by the pharmacy or immunisation programme, never simply used. Nothing here is advice about whether or when to be vaccinated — that is a conversation with a doctor, nurse or pharmacist.
`,
  ideas: [
    'Purified antigens need an adjuvant because the immune system responds to danger signals, not merely to foreign shapes.',
    'Aluminium salts adsorb antigen following a Langmuir-type isotherm; the degree of adsorption is a specification.',
    'Freezing destroys aluminium-adjuvanted vaccines irreversibly, and freezing damage in the field is at least as common as heat damage.',
    'Squalene emulsions allow antigen sparing, which multiplies the number of doses available from a given amount of antigen.',
    'Mean kinetic temperature, not the average temperature, describes what a fluctuating cold chain has done to a vaccine.'
  ],
  pitfalls: [
    'A vaccine that has been frozen is fine once it has thawed — For aluminium-adjuvanted products it is not: the gel agglomerates irreversibly and the antigen is no longer presented properly, with no visible clue after settling.',
    'An adjuvant simply holds the antigen at the injection site — The depot idea is only a small part; adjuvants act mainly by presenting antigen in particulate form and by activating innate immune pathways.',
    'The average storage temperature tells you the damage — Degradation is exponential in temperature, so brief excursions dominate; the mean kinetic temperature is always higher than the arithmetic mean.'
  ],
  formulas: [
    {
      name: 'Antigen adsorbed on an aluminium adjuvant (Langmuir)',
      expr: 'q = qmax*C/(Kd + C)', tex: 'q = \\dfrac{q_{max}\\,C}{K_d + C}',
      vars: {
        q: { name: 'antigen adsorbed per mg of aluminium', q: false, unit: 'µg/mg', value: 400 },
        qmax: { name: 'adsorption capacity', q: false, unit: 'µg/mg', value: 600, tex: 'q_{max}' },
        C: { name: 'free antigen concentration', q: false, unit: 'µg/mL', value: 50 },
        Kd: { name: 'half-saturation concentration', q: false, unit: 'µg/mL', value: 25, tex: 'K_d' }
      },
      note: 'The same isotherm as any monolayer adsorption. Capacities of several hundred µg of protein per mg of aluminium are typical; they fall sharply if the buffer contains phosphate, which competes for the same surface sites — a classic formulation trap.',
      practice: { unknowns: ['q', 'C'] },
      stories: {
        q: 'An antigen with a half-saturation of {Kd} is mixed with an adjuvant of capacity {qmax} at a free concentration of {C}. How much adsorbs per mg of aluminium?',
        C: 'What free antigen concentration gives {q} adsorbed on an adjuvant with {qmax} capacity and {Kd}?'
      }
    },
    {
      name: 'Potency left after a temperature excursion',
      expr: 'P = P0*exp(-k*t)', tex: 'P = P_0\\,e^{-kt}',
      vars: {
        P: { name: 'potency remaining', q: 'ratio', unit: '%' },
        P0: { name: 'potency at the start', q: 'ratio', unit: '%', value: 100, tex: 'P_0' },
        k: { name: 'first-order loss rate at the excursion temperature', q: 'rate', unit: '1/day', value: 0.02 },
        t: { name: 'time at that temperature', q: 'time', unit: 'h', value: 48 }
      },
      note: 'Potency is measured in a biological or immunochemical assay, and a product\'s release specification usually allows only a modest loss over the whole shelf life — so excursions eat a budget that is already spent on the planned storage.',
      practice: { unknowns: ['P', 't', 'k'] },
      stories: {
        P: 'A vaccine loses potency at {k} at the excursion temperature. What is left after {t}?',
        t: 'At a loss rate of {k}, how long until the potency falls from {P0} to {P}?',
        k: 'A vaccine falls from {P0} to {P} in {t}. What is the first-order loss rate?'
      }
    },
    {
      name: 'Doses in a multi-dose vial',
      expr: 'n = (Vfill - Vres)/Vdose', tex: 'n = \\dfrac{V_{fill} - V_{res}}{V_{dose}}',
      vars: {
        n: { name: 'doses withdrawable', q: false },
        Vfill: { name: 'fill volume of the vial', q: false, unit: 'mL', value: 5.5, tex: 'V_{fill}' },
        Vres: { name: 'residual volume that cannot be withdrawn', q: false, unit: 'mL', value: 0.25, tex: 'V_{res}' },
        Vdose: { name: 'dose volume', q: false, unit: 'mL', value: 0.5, tex: 'V_{dose}' }
      },
      note: 'Vials are deliberately overfilled so that the labelled number of doses can always be withdrawn; the exact overfill depends on the syringe and needle used. A multi-dose vial must contain a preservative and, once opened, has a short in-use life.',
      practice: { unknowns: ['n', 'Vfill'] },
      stories: {
        n: 'A vial is filled with {Vfill}, of which {Vres} cannot be withdrawn, and each dose is {Vdose}. How many doses does it give?',
        Vfill: 'What fill volume guarantees {n} doses of {Vdose} if {Vres} is unrecoverable?'
      }
    }
  ],
  examples: [
    {
      title: 'A cool box that failed',
      q: 'A vaccine loses potency with a first-order rate of 0.004 per day at 5 °C and 0.35 per day at 37 °C. A carton spends 14 days in normal storage and then 8 hours at 37 °C when a cool box fails. How much potency is left, and which period did the damage?',
      steps: [
        'Normal storage: $e^{-0.004 \\times 14} = e^{-0.056} = 0.946$ — 5.4 % lost in two weeks.',
        'The excursion: 8 h = 0.333 day, so $e^{-0.35 \\times 0.333} = e^{-0.1167} = 0.890$ — 11 % lost in a third of a day.',
        'Together $0.946 \\times 0.890 = 0.842$: 16 % of the potency is gone, two-thirds of it in those eight hours.',
        'Eight hours at 37 °C cost as much as 29 days at 5 °C would have. This is exactly what a vaccine vial monitor is designed to integrate and show.'
      ],
      a: 'About 84 % of the potency remains, and the eight-hour excursion did two-thirds of the damage.'
    },
    {
      title: 'Adsorbing an antigen',
      q: 'A subunit antigen adsorbs to aluminium hydroxide with a capacity of 500 µg/mg and a half-saturation of 20 µg/mL. A batch contains 50 µg of antigen and 0.5 mg of aluminium per 0.5 mL dose. Estimate the free antigen at equilibrium.',
      steps: [
        'Total antigen concentration: 50 µg per 0.5 mL = 100 µg/mL; aluminium: 1 mg/mL.',
        'Mass balance: adsorbed (per mL) $= 1 \\times 500 C/(20 + C)$ and free $= C$, with the two summing to 100 µg/mL.',
        'Try $C = 4$: adsorbed $= 500 \\times 4/24 = 83$; total 87 — too low. Try $C = 5.5$: adsorbed $= 500 \\times 5.5/25.5 = 108$; total 113 — too high. $C \\approx 4.7$ gives $500 \\times 4.7/24.7 = 95$, total 100.',
        'So about 95 % is adsorbed and 5 % free — a typical specification would require, say, at least 80 % adsorbed at release and through the shelf life.'
      ],
      a: 'About 4.7 µg/mL free, i.e. roughly 95 % of the antigen adsorbed.'
    }
  ],
  quiz: [
    { q: 'What is the main reason a purified protein antigen needs an adjuvant?', choices: ['to keep it sterile', 'to supply the innate "danger" signal and particulate presentation that a purified protein lacks', 'to dissolve it', 'to make the injection less painful'], a: 1, why: 'The immune system responds to context as well as shape; adjuvants provide the innate activation and particulate presentation that a clean protein does not.' },
    { q: 'An aluminium-adjuvanted vaccine that has frozen and thawed may be used if it looks normal.', a: false, why: 'Freezing irreversibly agglomerates the adjuvant gel; the appearance after settling can be deceptive and the vaccine must be discarded according to the programme\'s rules.' },
    { q: 'Why is the mean kinetic temperature of a fluctuating cold chain higher than the arithmetic mean?', choices: ['thermometers read high', 'degradation rises exponentially with temperature, so warm periods count far more than cold ones compensate', 'it includes the freezing periods', 'it is a legal definition only'], a: 1, why: 'Arrhenius behaviour is convex: the average of the rates corresponds to a temperature above the average of the temperatures.' },
    { q: 'A phosphate buffer can ruin an aluminium hydroxide vaccine because…', choices: ['it raises the pH too far', 'phosphate ions compete for the same surface sites and displace the antigen', 'it precipitates the aluminium', 'it is not injectable'], a: 1, why: 'Ligand exchange with phosphate strips adsorbed antigen from the adjuvant surface, changing the product without changing its appearance.' },
    { q: 'A vial holds 5.0 mL of which 0.2 mL cannot be withdrawn; each dose is 0.5 mL. How many doses can be given?', answer: 9.6, why: '(5.0 − 0.2)/0.5 = 9.6, so nine full doses — which is why vials are overfilled to guarantee the labelled number.' }
  ],
  problems: [
    { q: 'A vaccine loses 2 % of its potency per month at 5 °C (first order). What fraction remains after a 24-month shelf life?', answer: 0.617, tol: 0.02, steps: ['$k = -\\ln(0.98) = 0.0202$ per month.', '$e^{-0.0202 \\times 24} = e^{-0.485} = 0.616$ — 62 % left, which is why release potency is set well above the minimum effective level.'] },
    { q: 'An antigen adsorbs with qmax = 450 µg/mg and Kd = 30 µg/mL. At a free concentration of 10 µg/mL, how much is adsorbed per mg of aluminium (µg/mg)?', answer: 112.5, unit: 'µg/mg', tol: 0.02, steps: ['$q = 450 \\times 10/(30 + 10) = 4500/40 = 112.5$ µg/mg.'] }
  ],
  applications: ['Designing multi-dose presentations for mass immunisation campaigns, with preservatives and vial monitors.', 'Antigen sparing with emulsion adjuvants during a shortage or a pandemic response.', 'Thermostable and freeze-dried formulations that can leave the cold chain for the last mile.', 'Assessing temperature excursions and deciding whether stock can still be used.'],
  history: 'Alexander Glenny found in 1926 that diphtheria toxoid precipitated with aluminium salts gave far stronger immunity than the toxoid alone — the first adjuvant, and still among the most used a century later. Squalene emulsion adjuvants entered European use in the 1990s, and the vaccine vial monitor, developed with the World Health Organization in the same decade, quietly made the eradication and control campaigns of the 2000s practical.',
  sim: 'adv-coldchain'
},

/* ================================================================ DEPOTS AND IMPLANTS */
{
  id: 'depot-implants', parent: 'advanced-topic', title: 'Long-acting injections and implants', level: 2,
  short: 'A depot turns a daily tablet into an injection every month or an implant that lasts years. The trick is to make absorption the slowest step, so the drug\'s own half-life stops mattering and the release rate sets the plasma level.',
  keywords: ['depot injection', 'long-acting injectable', 'implant', 'PLGA microspheres', 'flip-flop kinetics', 'zero-order release', 'burst release', 'in-situ gel', 'oil depot', 'esterified prodrug', 'reservoir', 'matrix', 'adherence'],
  prereq: ['modified-release', 'parenteral-routes', 'half-life', 'release-kinetics'],
  related: ['nanomedicine', 'biologics-formulation', 'transdermal', 'osmotic-pumps', 'cns-drugs', 'medicine:hormones'],
  body: `
Taking a tablet every day is harder than it sounds, and for some conditions a missed week is dangerous. A depot removes the daily decision: one injection, and the drug is released for weeks or months. The same idea gives contraceptive implants that last three years, quarterly hormone treatments and long-acting antiviral injections.

### Flip-flop kinetics: the release rate takes over
Normally absorption is fast and elimination slow, so the terminal slope of the concentration curve is the drug's own half-life ([[half-life]]). A depot deliberately reverses that: absorption is the slow step, so the curve's decline reflects **release**, not elimination. This is **flip-flop kinetics**, and it has two consequences. Steady state takes four to five *release* half-lives to reach, which can be months; and after the last dose the drug lingers for just as long — an advantage for a missed appointment and a serious problem if a side effect appears or circumstances change ([[adverse-reactions]]).

### Ways to make a depot
| Type | How it slows release | Typical duration |
|---|---|---|
| Oily solution or esterified prodrug in oil | partition out of oil, then hydrolysis of the ester | 2–4 weeks |
| Aqueous crystal suspension | dissolution of the crystals is rate-limiting | weeks to 2 months |
| Polymer microspheres (PLGA, 20–100 µm) | diffusion, then erosion as the polymer hydrolyses | 1–6 months |
| In-situ forming gel | polymer dissolved in a water-miscible solvent precipitates on injection | 1–6 months |
| Solid implant (rod, 2 × 40 mm) | diffusion through a rate-controlling membrane | 1–5 years |
| Intravitreal or intrauterine device | local release where systemic exposure is unwanted | months to years |

A **reservoir** implant — drug core inside a polymer membrane — gives nearly **zero-order** release as long as the core stays saturated, because the driving concentration at the inner membrane face is constant. A **matrix**, where drug is dispersed through the polymer, gives a declining, roughly square-root-of-time profile ([[release-kinetics]]) because the diffusion path lengthens as the outer layers empty.

Microspheres of polylactide-*co*-glycolide usually show a **three-phase** profile: an initial burst from drug near the surface, a slow diffusion phase, then a faster phase as the polymer's molecular weight falls enough for the matrix to erode. Formulators fight the burst with washing steps, coatings and tighter particle size control, because a burst is a dose that was meant for next month.

### Designing for a plasma level
If the release rate $R$ is constant and the drug's clearance is $CL$, the steady plasma concentration is simply $C_{ss} = R/CL$ ([[clearance]]). That one relation drives most of the design: choose the target concentration, look up the clearance, and the required release rate follows; multiply by the intended duration and you have the drug load; that load and the implant's geometry then set the membrane area and thickness.

Real depots are not perfectly zero-order, so the specification is usually written as a release window — for instance 15–25 % released in the first week and 80–100 % by the end — measured by an accelerated in-vitro test at 45 °C, because a real-time test on a six-month product is useless for batch release ([[dissolution-testing]], [[ivivc]]).

> [!key] In a depot the formulation, not the molecule, sets the pharmacokinetics: $C_{ss} = R/CL$, duration = drug load ÷ release rate, and the "half-life" the patient experiences is the release half-life.

### What makes them hard
- **The tail.** A drug that cannot be removed keeps acting for months. Implants can be cut out; microspheres cannot.
- **Injection site.** Volumes of 1–3 mL of a viscous suspension need wide needles; nodules and pain reduce acceptability.
- **Sterility.** Terminal sterilisation degrades most polymers, so gamma irradiation (which also cuts polymer chains and can change the release rate) or full aseptic processing is used ([[sterilisation-methods]]).
- **Scale-up.** Microsphere size distribution depends on mixing energy, which is notoriously difficult to keep the same from a laboratory beaker to a production vessel ([[qbd]]).

> [!warn] Long-acting medicines are started, changed and stopped only with the prescriber who follows them, and their effects persist long after the last dose. These pages explain the engineering; they are not dosing guidance.
`,
  ideas: [
    'A depot makes absorption the slowest step, so release — not elimination — sets the concentration and the apparent half-life (flip-flop kinetics).',
    'Css = R/CL: the steady level depends only on the release rate and the clearance.',
    'A reservoir with a saturated core gives zero-order release; a matrix gives a declining, root-time profile.',
    'PLGA microspheres usually release in three phases — burst, diffusion, erosion — and the burst is the main formulation problem.',
    'The long tail after the last dose is the price of the long duration, and implants are the only easily reversible form.'
  ],
  pitfalls: [
    'A depot works because the drug is released slowly from the blood — It is released slowly into the blood; once absorbed, the molecule is cleared exactly as fast as it ever was.',
    'Steady state is reached in a few days, as with tablets — With flip-flop kinetics it takes four to five release half-lives, which for a monthly injection means three to five months; that is why oral cover or a loading regimen is sometimes used.',
    'Zero-order release happens automatically in an implant — Only while the core stays saturated and the membrane controls the rate; once the core dissolves below saturation, the rate falls away.'
  ],
  formulas: [
    {
      name: 'Duration of a depot',
      expr: 'T = M/R', tex: 'T = \\dfrac{M}{R}',
      vars: {
        T: { name: 'duration of release', q: false, unit: 'day' },
        M: { name: 'drug load in the depot', q: false, unit: 'mg', value: 150 },
        R: { name: 'release rate (zero order)', q: false, unit: 'mg/day', value: 1.5 }
      },
      note: 'Work in milligrams and days throughout. Real depots keep 5–15 % of the load as an un-released remainder, so the practical duration is a little shorter than this.',
      practice: { unknowns: ['T', 'M', 'R'] },
      stories: {
        T: 'An implant holds {M} and releases {R}. How long does it last?',
        M: 'How much drug must an implant hold to release {R} for {T}?',
        R: 'A {M} depot must last {T}. What release rate is needed?'
      }
    },
    {
      name: 'Steady plasma level from a constant release rate',
      expr: 'Css = R/CL', tex: 'C_{ss} = \\dfrac{R}{\\mathrm{CL}}',
      vars: {
        Css: { name: 'steady-state plasma concentration', q: false, unit: 'mg/L', value: 0.05, tex: 'C_{ss}' },
        R: { name: 'release rate reaching the circulation', q: false, unit: 'mg/day', value: 1.5 },
        CL: { name: 'clearance of the drug', q: false, unit: 'L/day', value: 30 }
      },
      note: 'The same relation as a constant-rate infusion, with the depot as the pump. Work in mg, L and days; a clearance quoted in L/h must be multiplied by 24 first. Only the fraction that actually reaches the circulation counts, so a depot with incomplete absorption needs a correspondingly higher release rate.',
      practice: { unknowns: ['Css', 'R', 'CL'] },
      stories: {
        Css: 'A depot releases {R} into a patient whose clearance is {CL}. What steady level does it give?',
        R: 'What release rate gives a steady level of {Css} at a clearance of {CL}?'
      }
    },
    {
      name: 'Release rate of a reservoir implant',
      expr: 'R = A*D*K*Cs/h', tex: 'R = \\dfrac{A\\, D\\, K\\, C_s}{h}',
      vars: {
        R: { name: 'release rate', q: false, unit: 'mg/day', value: 1.5 },
        A: { name: 'membrane area', q: false, unit: 'cm²', value: 3 },
        D: { name: 'diffusion coefficient in the membrane', q: false, unit: 'cm²/day', value: 0.002 },
        K: { name: 'partition coefficient, membrane against core', q: false, value: 0.5 },
        Cs: { name: 'solubility of the drug in the core fluid', q: false, unit: 'mg/mL', value: 10, tex: 'C_s' },
        h: { name: 'membrane thickness', q: false, unit: 'cm', value: 0.02 }
      },
      note: 'Fick\'s first law across the rate-controlling membrane, with mg, mL, cm and days throughout (mg/mL is the same as mg/cm³). It stays constant only while the core is saturated — the definition of a reservoir system.',
      practice: { unknowns: ['R', 'h', 'A'] },
      stories: {
        R: 'An implant has a {A} membrane, {h} thick, with D = {D} and K = {K}; the core saturates at {Cs}. What is its release rate?',
        h: 'What membrane thickness gives a release rate of {R} with a {A} area and a core solubility of {Cs}?'
      }
    }
  ],
  examples: [
    {
      title: 'Designing a three-month implant',
      q: 'A hypothetical drug has a clearance of 30 L/day and a target steady concentration of 50 µg/L. Design a 90-day implant: what release rate, what drug load, and what membrane thickness if the membrane area is 3 cm², D = 0.002 cm²/day, K = 0.5 and the core solubility is 10 mg/mL?',
      steps: [
        'Release rate: $R = C_{ss} \\times CL = 0.05 \\text{ mg/L} \\times 30 \\text{ L/day} = 1.5$ mg/day.',
        'Drug load: $M = R \\times T = 1.5 \\times 90 = 135$ mg, plus perhaps 15 % as the un-released remainder, so about 155 mg.',
        'Membrane: $h = A D K C_s/R = 3 \\times 0.002 \\times 0.5 \\times 10/1.5 = 0.02$ cm = 200 µm.',
        'Check the core: 155 mg of a drug of density about 1.3 g/cm³ is 0.12 cm³ — a rod roughly 2 mm across and 38 mm long, which is a realistic implant.'
      ],
      a: '1.5 mg/day from about 155 mg of drug behind a 200 µm membrane.'
    },
    {
      title: 'How long until the level is right',
      q: 'A monthly depot releases drug with a release half-life of 3 weeks, while the drug itself has an elimination half-life of 12 hours. How long does it take to reach steady state, and what happens after the last injection?',
      steps: [
        'Because release is far slower than elimination, the system is flip-flop: the effective half-life is the release half-life, 3 weeks.',
        'Steady state needs about 4–5 half-lives: 12–15 weeks, i.e. three or four injections before the level plateaus.',
        'After the last injection the concentration falls with the same 3-week half-life, so measurable drug persists for three months or more.',
        'That is why such treatments are often started with a loading schedule or oral cover, and why the decision to start one is a long-term one.'
      ],
      a: 'About three months to steady state, and a similarly long tail afterwards.'
    }
  ],
  quiz: [
    { q: 'In flip-flop kinetics, the terminal slope of the plasma curve reflects…', choices: ['hepatic clearance', 'the rate of release from the depot', 'renal filtration', 'protein binding'], a: 1, why: 'When absorption is slower than elimination, the slowest step governs the decline, and that is the release rate.' },
    { q: 'Why does a reservoir implant give zero-order release while a matrix does not?', choices: ['the reservoir contains more drug', 'the saturated core keeps the concentration at the membrane constant, whereas a matrix\'s diffusion path lengthens as it empties', 'matrices dissolve', 'reservoirs are smaller'], a: 1, why: 'Constant driving concentration plus a fixed membrane gives a constant flux; a matrix follows a root-time profile instead.' },
    { q: 'A depot releasing 2 mg/day into a patient with a clearance of 40 L/day gives a steady concentration of how many mg/L?', answer: 0.05, unit: 'mg/L', why: 'Css = R/CL = 2/40 = 0.05 mg/L (50 µg/L).' },
    { q: 'A burst release from microspheres is mainly a manufacturing artefact of drug at or near the particle surface.', a: true, why: 'Surface-associated drug dissolves immediately; washing, coating and tighter size control reduce it.' },
    { q: 'Which is the strongest argument against a long-acting injection for a new medicine with unknown rare side effects?', choices: ['it costs more', 'it cannot be withdrawn — exposure continues for months after the last dose', 'it needs refrigeration', 'patients dislike needles'], a: 1, why: 'Irretrievability is the fundamental trade-off; implants at least can be removed, and depots usually cannot.' }
  ],
  problems: [
    { q: 'An implant holds 216 mg and must last two years. What release rate is needed, in mg/day?', answer: 0.296, unit: 'mg/day', tol: 0.03, steps: ['$730$ days in two years.', '$R = 216/730 = 0.296$ mg/day — about 300 µg a day, typical of a contraceptive implant.'] },
    { q: 'A reservoir implant with a 4 cm² membrane, D = 0.0015 cm²/day, K = 0.8, core solubility 12 mg/mL must release 2 mg/day. What membrane thickness is required, in µm?', answer: 288, unit: 'µm', tol: 0.03, steps: ['$h = ADKC_s/R = 4 \\times 0.0015 \\times 0.8 \\times 12/2 = 0.0288$ cm.', '$0.0288$ cm $= 288$ µm.'] }
  ],
  applications: ['Long-acting antipsychotic injections, where missed doses carry a high risk of relapse.', 'Contraceptive implants and injections, among the most effective methods precisely because nothing has to be remembered.', 'Hormone therapies given every one to six months.', 'Long-acting antiviral injections for treatment and prevention, which at the time of writing are given every one to two months.'],
  history: 'Depot injections began with oil solutions of steroid esters in the 1930s and 1940s; the first biodegradable microsphere product, a peptide in polylactide-co-glycolide, was approved in the mid-1980s and remains the template for the class. The contraceptive implant, a rate-controlling silicone rod, was introduced in the 1980s and refined into the single-rod devices used today.',
  sim: 'adv-depot'
},

/* ================================================================ PRINTED MEDICINES */
{
  id: 'printing-medicines', parent: 'advanced-topic', title: '3-D printing and personalised medicines', level: 2,
  short: 'Printing a tablet means building it layer by layer instead of pressing it, so the dose can be any number and the internal geometry can be designed to control release. The pharmacy is easy; the quality system for a batch of one is not.',
  keywords: ['3-D printing', 'additive manufacturing', 'binder jetting', 'fused deposition modelling', 'semi-solid extrusion', 'stereolithography', 'printlet', 'personalised dose', 'surface-to-volume ratio', 'polypill', 'point of care', 'batch of one'],
  prereq: ['compaction', 'release-kinetics', 'modified-release', 'qbd'],
  related: ['depot-implants', 'odt', 'excipients', 'dose-calculations', 'compounding', 'quality-control'],
  body: `
A tablet press makes a hundred thousand identical tablets an hour and cannot make ten different ones. A printer makes one object at a time and does not care whether the next is the same. That is the whole argument for printing medicines: not speed, but **flexibility of dose and of geometry**.

### The printing methods
| Method | How it builds | Suits |
|---|---|---|
| **Binder jetting (powder bed)** | droplets of liquid binder fuse a powder layer | very porous, fast-disintegrating tablets; no heat |
| **Fused deposition modelling** | a drug-loaded polymer filament, made first by hot-melt extrusion, is drawn molten | precise geometries, modified release; needs a heat-stable drug |
| **Semi-solid extrusion** | a paste or gel is pushed through a nozzle at room temperature and dried | hospital and paediatric use, heat-sensitive drugs, chewable forms |
| **Stereolithography / DLP** | light cures a liquid resin layer by layer | very fine detail, no heat; photopolymer residues must be controlled |
| **Selective laser sintering** | a laser fuses powder | complex, dense shapes; local heating |
| **Inkjet onto a film or substrate** | drug solution printed in measured drops | micro-doses, ocular films, very potent drugs |

The first 3-D-printed medicine approved by a regulator was a rapidly dispersing, highly porous tablet of an antiepileptic drug made by powder-bed printing, authorised in the United States in 2015 — chosen because printing could make a 1000 mg tablet that still falls apart in a sip of water, which compression cannot.

### Why geometry is the point
Release from a matrix is driven by the surface in contact with fluid, so the **surface-to-volume ratio** is the design variable ([[release-kinetics]]). A printed tablet can be a solid cylinder, a ring, a mesh, a gyroid lattice or a set of nested shells, giving release profiles from a few minutes to many hours at the same composition. Printing several materials in one object gives a genuine **polypill**: separate compartments, each with its own drug and its own release, in one thing to swallow. And because dose scales with volume, a linear scale factor $s$ changes the dose by $s^3$ — a 10 % bigger tablet holds 33 % more drug, which is both the convenience and the trap of dose personalisation.

### Where it would actually help
- **Children**, who need doses by weight and cannot swallow adult tablets; today the answer is often crushing a tablet or compounding a liquid ([[dose-calculations]], [[compounding]]).
- **Titrated medicines** with narrow windows, where the available strengths do not match what a patient needs.
- **Polypharmacy**, printing one object a day instead of eight tablets.
- **Clinical trials**, printing dose escalations on demand.
- **Remote or emergency settings**, printing on the spot instead of shipping.

### The real obstacle is the quality system
Pharmaceutical quality is built on batches: a batch is made, sampled, tested and released ([[quality-control]], [[gmp]]). A printed medicine may be a batch of one, tested by nobody, made in a hospital by a machine that is legally a manufacturing site. The open questions at the time of writing are who the manufacturer is, how the printer and its software are qualified and revalidated, how content uniformity is proved without destroying the only tablet — process analytical tools such as near-infrared or Raman spectroscopy, checking each object as it is made, are the usual proposal — and what stability data can mean for a product made an hour before it is taken. Regulators have signalled openness to point-of-care and decentralised manufacture, and guidance was still developing when this was written; the science is well ahead of the paperwork.

Add the material problems: only a handful of polymers are both printable and pharmaceutically acceptable, thermal methods can degrade the drug or change its solid form ([[solid-state]]), photopolymer resins leave residues that must be shown to be safe, and printing is slow — minutes per tablet against milliseconds on a press.

> [!warn] Printed and compounded medicines made for one patient are the responsibility of a qualified pharmacist working to the applicable standards. Nothing here is a method for preparing a medicine at home, and medicines should never be made or modified outside a licensed setting.
`,
  ideas: [
    'Printing builds a dosage form layer by layer, so dose and internal geometry become design variables rather than tooling constraints.',
    'Release is governed by the surface-to-volume ratio, which a printed lattice, ring or shell can set at will.',
    'Dose scales with volume: a linear scale factor s multiplies the dose by s³.',
    'The first approved printed medicine (2015) used powder-bed printing to make a very porous, high-dose tablet that disperses in the mouth.',
    'The hard part is regulatory and analytical: qualifying a printer as a manufacturing site and proving the quality of a batch of one without destroying it.'
  ],
  pitfalls: [
    'Printing will replace tablet presses — It will not: a press makes tablets thousands of times faster and cheaper. Printing is for small numbers, odd doses and geometries a press cannot make.',
    'A printed tablet can be scaled to any dose by resizing it — Dose goes as the cube of the scale, and the surface-to-volume ratio changes too, so a resized tablet also releases at a different rate unless the geometry is corrected.',
    'Printing at the point of care avoids GMP — It moves manufacture, it does not remove it: the printer, its materials, its software and the operator all fall under the pharmaceutical quality system.'
  ],
  formulas: [
    {
      name: 'Dose of a printed object',
      expr: 'm = V*rho*w/100', tex: 'm = \\dfrac{V \\rho\\, w}{100}',
      vars: {
        m: { name: 'drug in the object', q: false, unit: 'mg' },
        V: { name: 'printed volume', q: false, unit: 'mm³', value: 250 },
        rho: { name: 'density of the printed material (mg/mm³ = g/cm³)', q: false, unit: 'mg/mm³', value: 1.2, tex: '\\rho' },
        w: { name: 'drug loading', q: false, unit: '% w/w', value: 25 }
      },
      note: 'Milligrams per cubic millimetre are numerically the same as grams per cubic centimetre. A printed lattice has an infill below 100 %, so its effective density — and therefore its dose — is lower than the material\'s.',
      practice: { unknowns: ['m', 'V', 'w'] },
      stories: {
        m: 'A tablet of {V} is printed from a material of {rho} at a loading of {w}. What dose does it contain?',
        V: 'What volume must be printed to give a dose of {m} at {w} loading and {rho}?',
        w: 'A {V} tablet of density {rho} must contain {m}. What drug loading is needed?'
      }
    },
    {
      name: 'Dose when a design is scaled',
      expr: 'm = m0*s^3', tex: 'm = m_0\\, s^3',
      vars: {
        m: { name: 'dose of the scaled object', q: false, unit: 'mg' },
        m0: { name: 'dose of the original design', q: false, unit: 'mg', value: 75, tex: 'm_0' },
        s: { name: 'linear scale factor', q: false, value: 1.1, min: 0.2, max: 3 }
      },
      note: 'Scaling every dimension by s multiplies the volume — and the dose — by s³, while the surface only grows as s². The surface-to-volume ratio therefore falls as 1/s, so a larger tablet of the same design releases more slowly.',
      practice: { unknowns: ['m', 's'] },
      stories: {
        m: 'A design containing {m0} is printed {s} times larger in every dimension. What dose does it hold?',
        s: 'By what linear factor must a {m0} design be scaled to give {m}?'
      }
    },
    {
      name: 'Print time from the layer height',
      expr: 't = h*tl/hl', tex: 't = \\dfrac{h\\, t_l}{h_l}',
      vars: {
        t: { name: 'print time for one object', q: false, unit: 's' },
        h: { name: 'object height', q: false, unit: 'mm', value: 4 },
        tl: { name: 'time per layer', q: false, unit: 's', value: 6, tex: 't_l' },
        hl: { name: 'layer height', q: false, unit: 'mm', value: 0.2, tex: 'h_l' }
      },
      note: 'Halving the layer height doubles the print time and the resolution. Two minutes a tablet is acceptable for one patient\'s daily dose and hopeless for a production batch — the clearest statement of where printing belongs.',
      practice: { unknowns: ['t', 'hl'] },
      stories: {
        t: 'An object {h} tall is printed in {hl} layers at {tl} each. How long does it take?',
        hl: 'What layer height keeps the print time for a {h} object to {t} at {tl} per layer?'
      }
    }
  ],
  examples: [
    {
      title: 'A paediatric dose by volume',
      q: 'A printable paste dries to a material of density 1.15 mg/mm³ with 20 % w/w drug. A child needs 37 mg. What volume must be printed, and what would a 10 % printing error in each dimension do?',
      steps: [
        '$V = 100 m/(\\rho w) = 100 \\times 37/(1.15 \\times 20) = 161$ mm³ — a tablet about 7 mm across and 4 mm high.',
        'A 10 % oversize in every dimension multiplies the volume by $1.1^3 = 1.331$: the dose becomes 49 mg, a 33 % overdose.',
        'A 10 % error in one dimension alone would give 41 mg, an 11 % error.',
        'This is why printed products are weighed or scanned individually: dimensional control, not formulation, is the weak point.'
      ],
      a: '161 mm³; a 10 % dimensional error in all three axes changes the dose by 33 %.'
    },
    {
      title: 'Geometry instead of chemistry',
      q: 'Two tablets are printed from the same material with the same 200 mg drug load: one a solid cylinder 10 mm across and 5 mm high, one a ring of the same outer size with a 5 mm hole and correspondingly greater height. Compare their surface-to-volume ratios.',
      steps: [
        'Cylinder: $V = \\pi (5)^2 (5) = 393$ mm³; $A = 2\\pi(5)^2 + 2\\pi(5)(5) = 157 + 157 = 314$ mm²; $A/V = 0.80$ per mm.',
        'Ring: to keep 393 mm³ with an annulus of area $\\pi(25 - 6.25) = 58.9$ mm², the height is 6.7 mm.',
        'Its surface: two annular faces $2 \\times 58.9 = 118$ mm², outer wall $2\\pi(5)(6.7) = 210$ mm², inner wall $2\\pi(2.5)(6.7) = 105$ mm² — total 433 mm², so $A/V = 1.10$ per mm.',
        'Nearly 40 % more dissolving surface from the same composition and volume: for a matrix system, that is a substantially faster release with no reformulation.'
      ],
      a: '0.80 per mm for the cylinder against 1.10 for the ring — about 40 % more surface.'
    }
  ],
  quiz: [
    { q: 'Why is printing attractive for children\'s medicines?', choices: ['printed tablets taste better', 'doses can be made to a child\'s weight without splitting or crushing adult tablets', 'they need no excipients', 'printing sterilises the product'], a: 1, why: 'Paediatric doses are weight-based and rarely match commercial strengths; the current alternatives — splitting, crushing, compounding a liquid — are all imprecise.' },
    { q: 'Scaling a printed tablet design by 1.2 in every dimension changes the dose by a factor of about…', choices: ['1.2', '1.44', '1.73', '2.4'], a: 2, why: '1.2³ = 1.73 — volume, and therefore dose, scales with the cube of the linear factor.' },
    { q: 'Printing a medicine at the point of care removes the need for a pharmaceutical quality system.', a: false, why: 'It relocates manufacture: the printer, materials, software, environment and operator all fall within GMP and the printer becomes, in effect, a manufacturing site.' },
    { q: 'Which printing method is most attractive for a heat-sensitive drug in a hospital pharmacy?', choices: ['fused deposition modelling', 'selective laser sintering', 'semi-solid extrusion of a paste at room temperature', 'binder jetting with a hot drying stage'], a: 2, why: 'Semi-solid extrusion prints a paste at ambient temperature and only needs gentle drying, which suits labile drugs and simple equipment.' },
    { q: 'What most directly controls the release rate of a printed matrix tablet?', choices: ['the printing speed', 'the surface-to-volume ratio of the printed geometry', 'the colour of the filament', 'the number of tablets in the batch'], a: 1, why: 'Dissolution happens at the surface, so geometry — lattices, rings, shells — is the release control variable in printed forms.' }
  ],
  problems: [
    { q: 'A printed lattice has a 45 % infill, an outer volume of 400 mm³, a material density of 1.25 mg/mm³ and 30 % w/w drug. What dose does it contain (mg)?', answer: 67.5, unit: 'mg', tol: 0.02, steps: ['Solid material: $400 \\times 0.45 = 180$ mm³.', '$m = 180 \\times 1.25 \\times 30/100 = 67.5$ mg.'] },
    { q: 'How long does it take to print a 6 mm tall object in 0.15 mm layers at 5 s per layer (seconds)?', answer: 200, unit: 's', tol: 0.02, steps: ['Layers: $6/0.15 = 40$.', '$40 \\times 5 = 200$ s — a little over three minutes for one tablet.'] }
  ],
  applications: ['Hospital pharmacy printing of paediatric and titrated doses on demand.', 'Multi-compartment polypills for people taking many medicines.', 'Dose-escalation supplies for early clinical trials without a manufacturing campaign.', 'Printed implants and films shaped to an individual patient\'s anatomy.'],
  history: 'Three-dimensional printing of pharmaceutical forms was demonstrated at MIT in the 1990s using binder jetting, and the first printed medicine was approved in the United States in 2015. Academic groups — notably in London — have since printed almost every dosage form imaginable, coining the word "printlet"; at the time of writing the technology is in hospital pilots and specialist products rather than mainstream manufacture.',
  sim: 'adv-printgeom'
}

);
