/* HYPER-PHARMACEUTICS · content/solubility-stability.js — physical pharmacy of solutions (solid forms,
 * solubility, ionisation and pKa, pH and solubility, log P and log D, buffers, complexation) and drug
 * stability (degradation pathways, reaction order, ICH testing, light, oxygen and moisture, packaging,
 * excipient compatibility). Shelf life and Arrhenius are in content/reference.js.
 * Simulations in sims/solubility-stability.js (ids sol-…). */
Hyper.add(

/* ================================================================ SOLUTIONS AND SOLUBILITY */

{
  id: 'solid-state', parent: 'solutions-solubility', title: 'Crystals, polymorphs and amorphous forms', level: 2,
  short: 'The same drug molecule can pack into different crystals (polymorphs), trap water (hydrates), or freeze as a disordered glass (amorphous). Each solid form has its own solubility, dissolution rate and stability — and the stable one is always the least soluble.',
  keywords: ['polymorph', 'polymorphism', 'crystal form', 'amorphous', 'glass transition', 'Tg', 'hydrate', 'solvate', 'cocrystal', 'salt form', 'Ostwald rule of stages', 'enantiotropic', 'monotropic', 'XRPD', 'DSC', 'amorphous solid dispersion', 'spring and parachute', 'Gordon–Taylor', 'ritonavir'],
  prereq: ['chemistry:crystal-structures', 'chemistry:intermolecular-forces', 'chemistry:gibbs-energy'],
  related: ['solubility-pharm', 'dissolution-rate', 'granulation', 'compaction', 'suppositories', 'stability-testing', 'excipient-compatibility'],
  body: `
A drug substance is usually a powder of tiny crystals, and the way its molecules are packed in those crystals matters almost as much as the molecule itself. The same molecule can crystallise in more than one arrangement — **polymorphs** — or build water or solvent into its lattice (**hydrates** and **solvates**), or solidify with no long-range order at all as an **amorphous** glass. Each solid form has its own melting point, hardness, stability and, above all, its own **solubility** and dissolution rate.

### Why forms differ
In a crystal every molecule sits in a repeating lattice held together by hydrogen bonds and van der Waals contacts ([[chemistry:crystal-structures|crystal structures]], [[chemistry:intermolecular-forces|intermolecular forces]]). A different packing has a different lattice energy. At a given temperature and pressure only one form is thermodynamically stable: it has the lowest free energy and therefore the **lowest solubility**. A metastable form is more soluble, by a factor set by the free-energy difference between the two:

$$\\Delta G = RT\\ln\\frac{S_\\text{meta}}{S_\\text{stable}}$$

Polymorphs usually differ in solubility by less than a factor of two — a $\\Delta G$ of 1–2 kJ/mol. An amorphous form has no lattice to break at all; its theoretical advantage can be tenfold or more, although in practice it is limited by how quickly the dissolved drug crystallises again.

When two forms swap stability at a transition temperature below their melting points they are **enantiotropic**; when one is more stable at every temperature, **monotropic**. Ostwald's **rule of stages** says that a crystallising system often forms a less stable form first, which later converts — so a process that has made one form for years can suddenly make another.

| Form | Solubility | Physical stability | Typical use |
|---|---|---|---|
| stable crystal | lowest | best | most tablets and capsules |
| metastable polymorph | up to about 2× | may convert | faster dissolution or better compaction |
| hydrate (in water) | usually below the anhydrate | depends on humidity | often forms during wet granulation |
| amorphous | 10× or more (apparent) | poor unless stabilised | amorphous solid dispersions |

### Stories that changed the industry
- **Ritonavir**, an HIV protease inhibitor, was launched in 1996 as capsules holding the drug in solution. In 1998 a new, much less soluble crystal form appeared, crystallised inside the capsules and made them fail their dissolution test; the product was withdrawn and reformulated. Once seeds of the more stable form existed, the old form became very hard to make.
- **Chloramphenicol palmitate** suspensions: in 1967 one polymorph was shown to give several times higher blood levels than another, because the gut's enzymes hydrolyse the stable crystal only slowly — the first clear proof that crystal form can change bioavailability.
- **Paracetamol**: the stable monoclinic form I compresses poorly, while the metastable orthorhombic form II deforms plastically and makes tablets without a binder.

### Amorphous forms and glasses
An amorphous solid is a frozen liquid. Below its **glass transition temperature** $T_g$ molecules barely move; above it the solid turns rubbery and crystallises readily. A working rule is to store an amorphous product at least 50 K below its $T_g$. Water is a powerful plasticiser — its own $T_g$ is about −137 °C — so a few per cent of absorbed moisture can lower the $T_g$ of a drug by tens of degrees (the Gordon–Taylor equation below). **Amorphous solid dispersions**, made by spray-drying or hot-melt extrusion of the drug with a polymer, keep the drug amorphous and, after it dissolves, hold the supersaturated solution for hours: the "spring and parachute".

### Controlling the form
Regulators expect the solid form to be identified and controlled (ICH Q6A, 1999, gives decision trees for polymorphs). Forms are told apart by X-ray powder diffraction, differential scanning calorimetry, infrared and Raman spectroscopy and solid-state NMR. Milling, [[granulation]], drying and [[compaction]] can each convert one form into another, so the form is checked in the finished product, not only in the raw drug. Salts and **cocrystals** (the drug and a neutral partner molecule in one lattice) widen the choice further.
`,
  ideas: [
    'One molecule can pack in several crystal forms (polymorphs), include water or solvent (hydrates, solvates), or be amorphous.',
    'At a given temperature the stable form has the lowest free energy and the lowest solubility; a metastable form is more soluble but can convert.',
    'The solubility ratio of two forms measures their free-energy difference: ΔG = RT ln(S_meta/S_stable) — usually 1–2 kJ/mol for polymorphs.',
    'Amorphous forms dissolve to supersaturation but crystallise easily; they are kept dry and well below their glass transition temperature.',
    'Processing and storage can change the form, so the form is controlled in the product, not only in the raw material.'
  ],
  pitfalls: [
    'The more soluble polymorph is always the better choice — It dissolves faster, but it can convert to the stable form during manufacture or storage and change dissolution and bioavailability; the stable form is chosen unless there is a strong reason not to.',
    'A crystal form that has been made reliably for years will always be made — New, more stable forms can appear late (ritonavir, 1998), and once seeds of the new form exist they can convert the old one.',
    'An amorphous solid is stable because it has no crystal to change — The amorphous state is the least stable solid form; it crystallises, especially above its Tg or when absorbed water lowers the Tg.'
  ],
  formulas: [
    {
      name: 'Free energy between two solid forms',
      expr: 'dG = R*T*ln(Sm/Ss)', tex: '\\Delta G = R\\,T\\ln\\frac{S_\\text{meta}}{S_\\text{stable}}',
      vars: {
        dG: { name: 'free energy of the metastable form above the stable one', q: 'molarenergy', unit: 'kJ/mol', tex: '\\Delta G' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 },
        Sm: { name: 'solubility of the metastable form', q: 'massconc', unit: 'mg/mL', value: 1.8, tex: 'S_\\text{meta}' },
        Ss: { name: 'solubility of the stable form', q: 'massconc', unit: 'mg/mL', value: 1.2, tex: 'S_\\text{stable}' }
      },
      note: 'Both solubilities at the same temperature, in the same medium, measured before the metastable form converts. Only their ratio matters, so any concentration unit works.',
      practice: { unknowns: ['dG', 'Sm'] },
      stories: {
        dG: 'At {T} one polymorph of a drug dissolves to {Sm} and another to {Ss}. How much higher is the free energy of the metastable form?',
        Sm: 'The stable form of a drug has a solubility of {Ss} at {T}, and a metastable form lies {dG} above it. What solubility should the metastable form show?'
      }
    },
    {
      name: 'Glass transition of a wet amorphous drug (Gordon–Taylor)',
      expr: 'Tg = (w*Tw + K*(1 - w)*Td)/(w + K*(1 - w))', tex: 'T_g = \\frac{w\\,T_{g,\\text{w}} + K(1 - w)\\,T_{g,\\text{d}}}{w + K(1 - w)}',
      vars: {
        Tg: { name: 'glass transition temperature of the mixture', q: 'temperature', unit: '°C', tex: 'T_g' },
        w: { name: 'water content (mass fraction)', q: 'ratio', unit: '%', value: 3, min: 0, max: 100 },
        Tw: { name: 'glass transition of water', q: 'temperature', unit: '°C', value: -137, tex: 'T_{g,\\text{w}}' },
        Td: { name: 'glass transition of the dry drug', q: 'temperature', unit: '°C', value: 100, tex: 'T_{g,\\text{d}}' },
        K: { name: 'Gordon–Taylor constant', value: 0.28 }
      },
      note: 'Temperatures enter in kelvin (the calculator converts °C). K ≈ ρ_w T_g,w / (ρ_d T_g,d) ≈ 0.2–0.4 for drugs and water. The same equation describes a drug mixed with a polymer.',
      practice: { unknowns: ['Tg', 'w'] },
      stories: {
        Tg: 'An amorphous drug has a dry glass transition of {Td}. It absorbs {w} of water (Gordon–Taylor K = {K}, water {Tw}). What is its glass transition now?',
        w: 'An amorphous drug (dry glass transition {Td}, K = {K}) must keep its glass transition above {Tg}. How much water can it hold?'
      }
    }
  ],
  examples: [
    {
      title: 'Which polymorph is stable?',
      q: 'Two crystal forms of a drug dissolve in water at 25 °C to 1.2 mg/mL (form I) and 1.8 mg/mL (form II). Which is stable at 25 °C, and by how much is the other higher in free energy?',
      steps: [
        'The stable form is the less soluble one: form I.',
        { text: 'Free-energy difference:', tex: '\\Delta G = 8.314 \\times 298.15 \\times \\ln\\frac{1.8}{1.2} = 2479 \\times 0.405 = 1005\\ \\mathrm{J/mol}' },
        'About 1.0 kJ/mol — typical of polymorphs. Form II may be useful for its faster dissolution, but in a suspension or a wet process it can turn into form I.'
      ],
      a: 'Form I is stable; form II lies about 1.0 kJ/mol higher.'
    },
    {
      title: 'Moisture and an amorphous dispersion',
      q: 'An amorphous solid dispersion has a dry $T_g$ of 100 °C; for it and water the Gordon–Taylor constant is 0.28 (water: $T_g$ = −137 °C). Find $T_g$ at 3 % and 8 % water. Is it safe to store at 25 °C by the "$T_g$ − 50 K" rule?',
      steps: [
        'In kelvin: $T_{g,\\text{w}} = 136.15$ K, $T_{g,\\text{d}} = 373.15$ K.',
        'At 3 %: $T_g = (0.03 \\times 136.15 + 0.28 \\times 0.97 \\times 373.15)/(0.03 + 0.28 \\times 0.97) = 105.4/0.3016 = 349.6$ K = 76 °C.',
        'At 8 %: $T_g = (10.9 + 96.1)/0.3376 = 317.0$ K = 44 °C.',
        'The rule asks for $T_g \\ge 25 + 50 = 75$ °C: met (just) at 3 % water, clearly broken at 8 %. The product needs a moisture-protective pack and perhaps a desiccant — see [[packaging]].'
      ],
      a: 'About 76 °C at 3 % water and 44 °C at 8 %; only the drier product meets the rule.'
    }
  ],
  quiz: [
    { q: 'Two polymorphs of a drug have solubilities of 2.0 and 3.0 mg/mL at 25 °C. Which is the stable form at 25 °C?', choices: ['the 2.0 mg/mL form', 'the 3.0 mg/mL form', 'both are equally stable', 'it cannot be told without the melting points'], a: 0, why: 'At a given temperature the stable form has the lowest free energy, hence the lowest solubility. Melting points tell you about other temperatures, not about which form wins at 25 °C.' },
    { q: 'What free-energy difference (kJ/mol) corresponds to two forms whose solubilities differ by a factor of 2 at 25 °C?', answer: 1.72, unit: 'kJ/mol', why: 'ΔG = RT ln 2 = 8.314 × 298.15 × 0.693 = 1718 J/mol ≈ 1.7 kJ/mol.' },
    { q: 'An amorphous drug with a dry Tg of 60 °C is stored unprotected in a humid room. What is most likely?', choices: ['nothing: water cannot enter a glass', 'it absorbs water, its Tg falls towards room temperature and it crystallises', 'it becomes more soluble with time', 'it melts at 60 °C'], a: 1, why: 'Water (Tg ≈ −137 °C) plasticises the glass; once Tg approaches the storage temperature the molecules move enough to crystallise, and the solubility advantage is lost.' },
    { q: 'A hydrate of a drug is usually more soluble in water than its anhydrous form.', a: false, why: 'In water the hydrate is normally the stable form, so it has the lower solubility; anhydrous forms often convert to the hydrate in contact with water.' },
    { q: 'Why can a metastable form become almost impossible to make once a more stable form has appeared?', choices: ['regulators forbid it', 'microscopic seeds of the stable form spread and nucleate it everywhere', 'the metastable form only exists above its melting point', 'the equipment remembers the form'], a: 1, why: 'Crystallisation of the stable form, once nucleated, is fast; seeds carried in air, on equipment and in raw materials make the stable form appear first.' }
  ],
  problems: [
    { q: 'A metastable polymorph lies 0.80 kJ/mol above the stable form at 37 °C. By what factor is it more soluble?', answer: 1.364, tol: 0.02, steps: ['$S_\\text{meta}/S_\\text{stable} = \\exp(\\Delta G/RT) = \\exp(800/(8.314 \\times 310.15)) = \\exp(0.310)$.', '= 1.36: about a third more soluble.'] }
  ],
  applications: [
    'Solid-form screening of a new drug: salts, polymorphs, hydrates, solvates and cocrystals.',
    'Amorphous solid dispersions for poorly soluble drugs, made by spray-drying or hot-melt extrusion.',
    'Checking the form after milling, granulation and compression, and during stability studies.',
    'Suppository bases: cocoa butter is polymorphic, and only its form that melts near body temperature is wanted.'
  ],
  history: 'Wilhelm Ostwald stated his rule of stages in 1897. Walter McCrone quipped in 1965 that the number of forms known for a compound is proportional to the time and money spent looking for them. The chloramphenicol palmitate study of 1967 tied crystal form to bioavailability, and the ritonavir crisis of 1998 made solid-form screening a routine part of drug development.',
  sim: 'sol-polymorph'
},

{
  id: 'solubility-pharm', parent: 'solutions-solubility', title: 'Solubility', level: 1,
  short: 'Solubility is the concentration of a saturated solution: how much drug a medium can hold at equilibrium, at a given temperature, pH and solid form. Only dissolved drug is absorbed, so a dose that cannot dissolve in the gut may not work.',
  keywords: ['solubility', 'saturated solution', 'intrinsic solubility', 'dose number', 'general solubility equation', 'melting point', 'log P', 'brick dust', 'grease ball', 'cosolvent', 'log-linear model', 'shake flask', 'pharmacopoeial solubility terms', 'poorly soluble drugs', 'solubility enhancement', 'precipitation on dilution'],
  prereq: ['chemistry:solubility', 'chemistry:intermolecular-forces', 'solid-state'],
  related: ['ph-solubility', 'partition-logp', 'dissolution-rate', 'bcs', 'surfactants', 'complexation', 'oral-solutions', 'injectable-formulation'],
  body: `
### What solubility means
The **solubility** of a drug is the concentration of a saturated solution — dissolved drug in equilibrium with undissolved solid — at a stated temperature, in a stated medium, for a stated solid form. All of these matter: the same drug can be ten thousand times more soluble at one pH than at another ([[ph-solubility]]), half as soluble again as a metastable polymorph ([[solid-state]]), and more soluble at 37 °C than at 25 °C. Pharmacists quote it in mg/mL (or µg/mL for poorly soluble drugs), chemists in mol/L; [[chemistry:solubility|solubility in chemistry]] explains the dissolving process itself.

The pharmacopoeias describe solubility in words, by the volume of solvent needed to dissolve one part of solute (1 g in so many millilitres):

| Term | Parts of solvent for 1 part of solute | Roughly (mg/mL) |
|---|---|---|
| very soluble | less than 1 | over 1000 |
| freely soluble | 1–10 | 100–1000 |
| soluble | 10–30 | 33–100 |
| sparingly soluble | 30–100 | 10–33 |
| slightly soluble | 100–1000 | 1–10 |
| very slightly soluble | 1000–10 000 | 0.1–1 |
| practically insoluble | 10 000 or more | under 0.1 |

### Why it matters
Only dissolved drug crosses the gut wall. A useful test is whether the dose would dissolve in a glass of water — 250 mL, the volume used by the [[bcs|Biopharmaceutics Classification System]]. The **dose number** $D_0 = M_0/(V_0 C_s)$ compares the dose with what 250 mL can hold: below 1 the dose can dissolve; well above 1, absorption may be limited by solubility. Common estimates put some 40 % of marketed drugs and most new drug candidates among the poorly soluble, because modern targets favour large, lipophilic molecules.

### What sets it
Dissolving a crystal takes two steps: pulling a molecule out of its lattice (costly for a high-melting, tightly packed crystal) and surrounding it with water (costly for a greasy molecule). Yalkowsky's **general solubility equation** captures both with two numbers anyone can measure — the melting point and the octanol–water [[partition-logp|log P]]:

$$\\log S = 0.5 - 0.01\\,(T_m - 25) - \\log P$$

with $S$ in mol/L and $T_m$ in °C. Each extra 100 °C of melting point costs a factor of ten in solubility, and so does each extra unit of log P. Formulators call the two kinds of insoluble molecule "brick dust" (high melting point, strong lattice) and "grease balls" (high log P); they need different remedies.

### Making a drug more soluble
- **Ionise it**: salts and pH adjustment ([[ionisation-pka]], [[ph-solubility]]).
- **Cosolvents** such as ethanol, propylene glycol and PEG 400, in injections and oral liquids. Solubility rises roughly exponentially with the cosolvent fraction $f$ — the log-linear model $S_\\text{mix} = S_w\\,10^{\\sigma f}$ — and so it falls just as steeply when an injection is diluted in blood or an infusion bag, which is how a drug can precipitate on dilution.
- **Surfactant micelles** ([[surfactants]]) and **cyclodextrin complexes** ([[complexation]]).
- **Solid-state changes**: metastable or amorphous forms ([[solid-state]]).
- **Lipid-based formulations** and **prodrugs** — for example a phosphate ester that dissolves well and is cleaved back to the drug by enzymes.

Making the particles smaller speeds up dissolution ([[dissolution-rate]], [[particle-size]]) but does not raise the equilibrium solubility, except slightly for particles well below a micrometre.

> [!key] Solubility is an equilibrium: the concentration of a saturated solution at a given temperature, pH and solid form. Dissolution rate is how fast you get there. A medicine needs enough of both.

### Measuring it
The reference method is the **shake flask**: excess solid is agitated in the medium (typically 24–72 hours at 25 or 37 °C), filtered, and the filtrate assayed by HPLC; the final pH is measured and the leftover solid checked for a change of form. Faster "kinetic" methods, which add a concentrated stock solution to buffer, are used for screening in drug discovery but tend to overestimate solubility, because they approach it from a supersaturated solution.
`,
  ideas: [
    'Solubility is the equilibrium concentration of a saturated solution, for a given temperature, medium, pH and solid form.',
    'The dose number D₀ = dose/(250 mL × solubility) tells whether a dose can dissolve in the gut.',
    'The general solubility equation: log S = 0.5 − 0.01(T_m − 25) − log P — high melting points and high log P both lower solubility.',
    'Cosolvents raise solubility roughly exponentially with their fraction, so dilution can make a drug precipitate.',
    'Smaller particles dissolve faster but hardly change the equilibrium solubility.'
  ],
  pitfalls: [
    'Micronising a powder makes the drug more soluble — It makes it dissolve faster by increasing the surface area; the equilibrium solubility changes appreciably only for particles well below a micrometre.',
    'A drug that dissolves in its injection will stay dissolved in the body — Cosolvent and pH-adjusted formulations can precipitate when diluted in blood or infusion fluids, because the solubility falls faster than the concentration.',
    'Solubility is a single number for a drug — It depends on temperature, pH, ionic strength, the solid form and the medium; a value without those conditions is incomplete.'
  ],
  formulas: [
    {
      name: 'General solubility equation (Yalkowsky)',
      expr: 'log(S) = 0.5 - 0.01*(Tm - 25) - logP', tex: '\\log S = 0.5 - 0.01\\,(T_m - 25) - {\\log P}_{\\text{o/w}}',
      vars: {
        S: { name: 'aqueous solubility of the neutral drug', q: false, unit: 'mol/L' },
        Tm: { name: 'melting point', q: false, unit: '°C', value: 175, min: 25, tex: 'T_m' },
        logP: { name: 'octanol–water log P', value: 3, signed: true, tex: '{\\log P}_{\\text{o/w}}' }
      },
      solveFor: 'S',
      note: 'An estimate, usually within a factor of 3–10, for neutral (un-ionised) organic compounds. For a liquid (melting point below 25 °C) the melting term is zero. Multiply by the molar mass to get g/L.',
      practice: { unknowns: ['S', 'logP'] },
      stories: {
        S: 'A neutral drug melts at {Tm} and has log P = {logP}. Estimate its aqueous solubility.',
        logP: 'A neutral drug melts at {Tm} and dissolves to {S}. What log P does the general solubility equation imply?'
      }
    },
    {
      name: 'Dose number',
      expr: 'D0 = M0/(V0*Cs)', tex: 'D_0 = \\frac{M_0}{V_0\\,C_s}',
      vars: {
        D0: { name: 'dose number', tex: 'D_0' },
        M0: { name: 'highest dose', q: false, unit: 'mg', value: 200, tex: 'M_0' },
        V0: { name: 'volume of a glass of water', q: false, unit: 'mL', value: 250, fixed: true, tex: 'V_0' },
        Cs: { name: 'lowest solubility over pH 1.2–6.8', q: false, unit: 'mg/mL', value: 0.05, tex: 'C_s' }
      },
      note: 'D₀ ≤ 1: the dose can dissolve in 250 mL at every pH of the gut — "highly soluble" in BCS terms. D₀ much greater than 1: absorption may be limited by solubility.',
      practice: { unknowns: ['D0', 'Cs', 'M0'] },
      stories: {
        D0: 'A tablet contains {M0} of a drug whose lowest solubility in the pH range of the gut is {Cs}. What is its dose number?',
        Cs: 'What solubility would let a dose of {M0} reach a dose number of {D0}?'
      }
    },
    {
      name: 'Cosolvent solubility (log-linear model)',
      expr: 'Smix = Sw*10^(sigma*f)', tex: 'S_\\text{mix} = S_w\\,10^{\\sigma f}',
      vars: {
        Smix: { name: 'solubility in the water–cosolvent mixture', q: 'massconc', unit: 'mg/mL', tex: 'S_\\text{mix}' },
        Sw: { name: 'solubility in water', q: 'massconc', unit: 'mg/mL', value: 0.01, tex: 'S_w' },
        sigma: { name: 'solubilising power of the cosolvent for this drug', value: 3, tex: '\\sigma' },
        f: { name: 'volume fraction of cosolvent', q: 'ratio', unit: '%', value: 40, min: 0, max: 100 }
      },
      note: 'σ is the slope of log S against the cosolvent fraction; it is larger for more lipophilic drugs and less polar cosolvents (typically 1–6 for ethanol, propylene glycol or PEG 400). Real curves bend at high fractions.',
      practice: { unknowns: ['Smix', 'f'] },
      stories: {
        Smix: 'A drug dissolves to {Sw} in water; for a cosolvent σ = {sigma}. What is its solubility in a vehicle containing {f} of the cosolvent?',
        f: 'A drug dissolves to {Sw} in water, and σ = {sigma} for a cosolvent. What fraction of cosolvent is needed to dissolve {Smix}?'
      }
    }
  ],
  examples: [
    {
      title: 'Estimating solubility from the melting point and log P',
      q: 'A neutral drug candidate (molar mass 300 g/mol) melts at 175 °C and has log P = 3.0. Estimate its solubility in water and the dose number of a 200 mg dose.',
      steps: [
        '$\\log S = 0.5 - 0.01 \\times (175 - 25) - 3.0 = 0.5 - 1.5 - 3.0 = -4.0$, so $S = 1.0 \\times 10^{-4}$ mol/L.',
        'In mass terms: $1.0 \\times 10^{-4} \\times 300 = 0.030$ g/L = 0.030 mg/mL — "practically insoluble".',
        '$D_0 = 200/(250 \\times 0.030) = 27$: the dose is 27 times what a glass of water could dissolve. Absorption is likely to be limited by solubility unless the formulation helps.'
      ],
      a: 'About 0.03 mg/mL (30 µg/mL); dose number about 27.'
    },
    {
      title: 'Precipitation when a cosolvent injection is diluted',
      q: 'An injection contains a drug at 0.12 mg/mL in 40 % cosolvent ($S_w$ = 0.01 mg/mL, $\\sigma$ = 3). What happens when it is diluted twofold and tenfold with water?',
      steps: [
        'In the vial: $S = 0.01 \\times 10^{3 \\times 0.40} = 0.158$ mg/mL — the 0.12 mg/mL solution is 76 % saturated.',
        'Diluted 1 : 2: 20 % cosolvent, $S = 0.01 \\times 10^{0.6} = 0.040$ mg/mL, but the drug is at 0.060 mg/mL — 1.5 times supersaturated. It may precipitate.',
        'Diluted 1 : 10: 4 % cosolvent, $S = 0.01 \\times 10^{0.12} = 0.013$ mg/mL, drug at 0.012 mg/mL — just below saturation again.',
        'The danger lies at intermediate dilutions — at the injection site or in a slowly flowing line — which is why such products carry instructions on the diluent and the rate of injection. Real use always follows the product information.'
      ],
      a: 'Twofold dilution leaves the drug about 1.5 times supersaturated; tenfold dilution is just safe.'
    }
  ],
  quiz: [
    { q: 'One gram of a drug needs 500 mL of water to dissolve. How does the pharmacopoeia describe it?', choices: ['soluble', 'sparingly soluble', 'slightly soluble', 'very slightly soluble'], a: 2, why: '500 parts of solvent for 1 part of solute lies in the 100–1000 band: slightly soluble (2 mg/mL).' },
    { q: 'By the general solubility equation, raising a drug\'s melting point by 100 °C at the same log P…', choices: ['halves its solubility', 'divides its solubility by 10', 'divides its solubility by 100', 'has no effect'], a: 1, why: 'The melting term is −0.01 per °C: −1 in log S for 100 °C, a factor of ten.' },
    { q: 'The highest dose of a drug is 50 mg and its lowest solubility between pH 1.2 and 6.8 is 0.5 mg/mL. What is its dose number?', answer: 0.4, why: 'D₀ = 50/(250 × 0.5) = 0.4: the whole dose can dissolve in a glass of water at every pH of the gut.' },
    { q: 'Micronising a drug powder raises its equilibrium solubility several times.', a: false, why: 'Smaller particles dissolve faster because of their larger surface, but the saturated concentration is practically unchanged above about a micrometre.' },
    { q: 'An injection with 40 % propylene glycol can precipitate when mixed with an infusion fluid because…', choices: ['the cosolvent reacts with the drug', 'solubility falls exponentially with the cosolvent fraction, faster than the drug is diluted', 'infusion fluids are warmer', 'propylene glycol evaporates'], a: 1, why: 'Log-linear solubility: halving the cosolvent fraction divides the solubility by 10^(σf/2), while the drug concentration only halves.' }
  ],
  problems: [
    { q: 'A neutral drug (molar mass 350 g/mol) melts at 225 °C and has log P = 4.0. Estimate its aqueous solubility in µg/mL.', answer: 1.1, unit: 'µg/mL', tol: 0.04, steps: ['$\\log S = 0.5 - 0.01 \\times 200 - 4.0 = -5.5$, so $S = 3.2 \\times 10^{-6}$ mol/L.', '$3.2 \\times 10^{-6} \\times 350 = 1.1 \\times 10^{-3}$ g/L = 1.1 µg/mL.'] }
  ],
  applications: [
    'Selecting drug candidates with solubility and log P screens.',
    'Choosing a salt, cosolvent, surfactant, cyclodextrin or amorphous formulation for a poorly soluble drug.',
    'Designing dissolution tests with sink conditions (volume × solubility at least three times the dose).',
    'Explaining why some injections must be diluted in a particular fluid or given slowly.'
  ],
  history: 'Noyes and Whitney linked the rate of dissolving to solubility in 1897. Samuel Yalkowsky and his co-workers developed the log-linear model of cosolvency in the 1970s and the general solubility equation, in its present simple form, around 2001. The Biopharmaceutics Classification System of 1995 (Amidon and colleagues) made the dose in 250 mL part of regulatory science.',
  sim: 'sol-solubilisers'
},

{
  id: 'ionisation-pka', parent: 'solutions-solubility', title: 'Ionisation and pKa', level: 2,
  short: 'Most drugs are weak acids or bases, partly ionised in water. The pKa and the local pH decide the fraction ionised — and with it the solubility, the ability to cross membranes and where the drug accumulates.',
  keywords: ['pKa', 'ionisation', 'ionised fraction', 'un-ionised', 'weak acid', 'weak base', 'Henderson–Hasselbalch', 'pH-partition hypothesis', 'ion trapping', 'zwitterion', 'local anaesthetic', 'lidocaine', 'aspirin', 'conjugate acid'],
  prereq: ['chemistry:weak-acids', 'chemistry:weak-bases', 'chemistry:henderson-hasselbalch'],
  related: ['ph-solubility', 'partition-logp', 'buffers-pharm', 'membrane-transport-pharm', 'gi-absorption', 'medicine:pharmacokinetics'],
  body: `
Most drugs are weak acids or weak bases: carboxylic acids, phenols and sulfonamides on one side; amines and nitrogen-containing rings on the other. In water they are partly ionised, and the proportion depends on only two numbers — the drug's **pKa** and the pH around it. That proportion decides how well the drug dissolves, whether it crosses membranes, where it collects in the body and how it behaves in a formulation.

### Henderson–Hasselbalch for drugs
For a weak acid $\\ce{HA <=> H+ + A-}$ and for the conjugate acid of a base $\\ce{BH+ <=> H+ + B}$, the [[chemistry:henderson-hasselbalch|Henderson–Hasselbalch equation]] gives the ratio of ionised to un-ionised forms:

$$\\text{acid: } \\frac{[\\ce{A-}]}{[\\ce{HA}]} = 10^{\\,\\mathrm{pH} - \\mathrm{p}K_a} \\qquad \\text{base: } \\frac{[\\ce{BH+}]}{[\\ce{B}]} = 10^{\\,\\mathrm{p}K_a - \\mathrm{pH}}$$

The pKa of a base is always quoted for its conjugate acid, so a *higher* pKa means a *stronger* base. At pH = pKa a drug is half ionised; each pH unit away shifts the ratio tenfold:

| pH − pKa | weak acid ionised | weak base ionised |
|---|---|---|
| −2 | 1 % | 99 % |
| −1 | 9 % | 91 % |
| 0 | 50 % | 50 % |
| +1 | 91 % | 9 % |
| +2 | 99 % | 1 % |

Acids stay un-ionised in acid, bases in alkali.

### Typical values
| Drug (class) | pKa | Kind | Ionised at pH 7.4 |
|---|---|---|---|
| aspirin (analgesic) | 3.5 | acid | 99.99 % |
| ibuprofen (anti-inflammatory) | 4.4 | acid | 99.9 % |
| warfarin (anticoagulant) | 5.0 | acid | 99.6 % |
| phenytoin (antiepileptic) | 8.3 | acid | 11 % |
| paracetamol (analgesic) | 9.5 | acid | 0.8 % |
| diazepam (benzodiazepine) | 3.4 | base | 0.01 % |
| lidocaine (local anaesthetic) | 7.9 | base | 76 % |
| propranolol (beta blocker) | 9.5 | base | 99.2 % |

Values are approximate: published pKa values differ by a few tenths with method and temperature.

### Why it matters
- **Solubility**: the ionised form is far more soluble in water, so a salt or a change of pH can raise solubility enormously ([[ph-solubility]]).
- **Membranes**: the un-ionised form is the one that crosses lipid membranes by passive diffusion — the **pH-partition hypothesis** ([[membrane-transport-pharm]], [[partition-logp]]).
- **Ion trapping**: where the pH differs across a membrane, the un-ionised form equalises, so the *total* concentration ends up higher on the side where the drug is more ionised. Aspirin concentrates in plasma relative to gastric juice; weak bases collect in acidic places — lysosomes, breast milk (pH about 7.1) and acidic urine.
- **Local anaesthetics** are bases that must cross the nerve sheath un-ionised and then act, ionised, inside the sodium channel. In inflamed, acidic tissue (pH about 6.5) only about 4 % of lidocaine is un-ionised, against 24 % at pH 7.4 — one reason local anaesthesia works poorly around an abscess.

> [!tip] Two pH units on the "wrong" side of the pKa leave only 1 % of the drug un-ionised; two units on the "right" side leave 99 %.

### Measuring pKa
Potentiometric titration is the classic method; UV spectroscopy works when the absorbance changes with ionisation; capillary electrophoresis and computer prediction are used in drug discovery. Many drugs have more than one ionisable group — amino acids, and antibiotics such as amoxicillin, are **zwitterions** with both an acidic and a basic pKa.
`,
  ideas: [
    'A weak acid is ionised above its pKa, a weak base below it; at pH = pKa each is half ionised.',
    'Each pH unit away from the pKa changes the ionised : un-ionised ratio tenfold.',
    'The pKa of a base refers to its conjugate acid: a higher pKa means a stronger base.',
    'The ionised form dissolves; the un-ionised form crosses membranes (the pH-partition hypothesis).',
    'Across a pH gradient a drug is trapped on the side where it is more ionised.'
  ],
  pitfalls: [
    'A drug with a low pKa is a strong base — For bases the pKa is that of the conjugate acid; a low pKa means a weak base, barely ionised at body pH (diazepam, pKa 3.4).',
    'Ionised drugs cannot be absorbed at all — Absorption is slower, but the un-ionised fraction keeps being replenished as it crosses; the huge surface of the small intestine absorbs many mostly ionised acids well.',
    'pKa depends on the pH — The pKa is a property of the molecule (at a given temperature and ionic strength); the pH only decides how much of the drug is ionised.'
  ],
  formulas: [
    {
      name: 'Fraction ionised: weak acid',
      expr: 'fi = 1/(1 + 10^(pKa - pH))', tex: 'f_\\text{ion} = \\frac{1}{1 + 10^{\\,{\\mathrm{p}K}_a - \\mathrm{pH}}}',
      vars: {
        fi: { name: 'fraction ionised', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'f_\\text{ion}' },
        pKa: { name: 'pKa of the acid', value: 4.4, tex: '{\\mathrm{p}K}_a' },
        pH: { name: 'pH of the medium', value: 6.5, min: 0, max: 14, tex: '\\mathrm{pH}' }
      },
      note: 'From Henderson–Hasselbalch: [A⁻]/[HA] = 10^(pH − pKa). The un-ionised fraction is 1 − f.',
      practice: { unknowns: ['fi', 'pH'] },
      stories: {
        fi: 'A weak acid with a pKa of {pKa} is in intestinal fluid at pH {pH}. What fraction is ionised?',
        pH: 'At what pH is a weak acid with a pKa of {pKa} exactly {fi} ionised?'
      }
    },
    {
      name: 'Fraction ionised: weak base',
      expr: 'fi = 1/(1 + 10^(pH - pKa))', tex: 'f_\\text{ion} = \\frac{1}{1 + 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_a}}',
      vars: {
        fi: { name: 'fraction ionised (protonated)', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'f_\\text{ion}' },
        pKa: { name: 'pKa of the conjugate acid', value: 7.9, tex: '{\\mathrm{p}K}_a' },
        pH: { name: 'pH of the medium', value: 7.4, min: 0, max: 14, tex: '\\mathrm{pH}' }
      },
      note: '[BH⁺]/[B] = 10^(pKa − pH). Defaults: lidocaine in tissue at pH 7.4.',
      practice: { unknowns: ['fi', 'pH', 'pKa'] },
      stories: {
        fi: 'A local anaesthetic is a base with pKa {pKa}. What fraction is ionised in tissue at pH {pH}?',
        pKa: 'A basic drug is {fi} ionised at pH {pH}. What is its pKa?'
      }
    },
    {
      name: 'Ion trapping of a weak acid across a membrane',
      expr: 'r = (1 + 10^(pH1 - pKa))/(1 + 10^(pH2 - pKa))', tex: 'r = \\frac{C_1}{C_2} = \\frac{1 + 10^{\\,\\mathrm{pH}_1 - {\\mathrm{p}K}_a}}{1 + 10^{\\,\\mathrm{pH}_2 - {\\mathrm{p}K}_a}}',
      vars: {
        r: { name: 'ratio of total concentrations, side 1 : side 2' },
        pH1: { name: 'pH on side 1 (plasma)', value: 7.4, min: 0, max: 14, tex: '\\mathrm{pH}_1' },
        pH2: { name: 'pH on side 2 (gastric juice)', value: 1.5, min: 0, max: 14, tex: '\\mathrm{pH}_2' },
        pKa: { name: 'pKa of the acid', value: 3.5, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'At equilibrium only the un-ionised form crosses, so its concentration is equal on both sides. For a base, swap the sign of each exponent: 10^(pKa − pH). Protein binding and active transport are ignored.',
      practice: { unknowns: ['r'] },
      stories: {
        r: 'A weak acid with pKa {pKa} distributes between plasma at pH {pH1} and gastric juice at pH {pH2}. What is the plasma : stomach ratio of total drug at equilibrium?'
      }
    }
  ],
  examples: [
    {
      title: 'A local anaesthetic in inflamed tissue',
      q: 'Lidocaine is a base with pKa 7.9. What fraction is un-ionised in normal tissue (pH 7.4) and in inflamed tissue (pH 6.5)?',
      steps: [
        'Un-ionised fraction of a base: $1/(1 + 10^{\\,\\mathrm{p}K_a - \\mathrm{pH}})$.',
        'pH 7.4: $1/(1 + 10^{0.5}) = 1/4.16 = 0.24$ — 24 %.',
        'pH 6.5: $1/(1 + 10^{1.4}) = 1/26.1 = 0.038$ — under 4 %.',
        'Six times less drug can cross into the nerve, so the block is slower and weaker.'
      ],
      a: '24 % un-ionised at pH 7.4, about 4 % at pH 6.5.'
    },
    {
      title: 'Ion trapping of aspirin',
      q: 'Aspirin (pKa 3.5) distributes between plasma (pH 7.4) and gastric juice (pH 1.5). What is the ratio of total drug at equilibrium?',
      steps: [
        'Plasma: total/un-ionised $= 1 + 10^{7.4 - 3.5} = 1 + 7943 = 7944$.',
        'Stomach: total/un-ionised $= 1 + 10^{1.5 - 3.5} = 1.01$.',
        'The un-ionised concentration is the same on both sides, so plasma : stomach = $7944/1.01 \\approx 7900$.',
        'In the stomach aspirin is un-ionised and enters the lining cells readily — where, at pH 7, it becomes ionised and trapped: part of the reason it irritates the stomach.'
      ],
      a: 'About 7900 : 1 in favour of plasma.'
    },
    {
      title: 'A weak base in breast milk',
      q: 'A basic drug with pKa 9.0 distributes between plasma (pH 7.4) and breast milk (pH 7.1). Ignoring protein binding and fat, what is the milk : plasma ratio?',
      steps: [
        'For a base, total/un-ionised $= 1 + 10^{\\,\\mathrm{p}K_a - \\mathrm{pH}}$.',
        'Milk: $1 + 10^{1.9} = 80.4$; plasma: $1 + 10^{1.6} = 40.8$.',
        'Milk : plasma $= 80.4/40.8 = 2.0$ — a small pH difference doubles the concentration of a strong base in milk.'
      ],
      a: 'About 2 : 1. Whether a medicine is suitable during breastfeeding is a question for a doctor or pharmacist, using published data.'
    }
  ],
  quiz: [
    { q: 'A weak base has pKa 8.0. At pH 7.0 it is…', choices: ['9 % ionised', '50 % ionised', '91 % ionised', '99 % ionised'], a: 2, why: 'For a base [BH⁺]/[B] = 10^(8.0 − 7.0) = 10: ionised fraction 10/11 = 91 %.' },
    { q: 'For a basic drug, a higher pKa means…', choices: ['a weaker base', 'a stronger base, more ionised at a given pH', 'a more acidic drug', 'nothing about its strength'], a: 1, why: 'The pKa of a base belongs to its conjugate acid; the higher it is, the more firmly the base holds a proton.' },
    { q: 'What percentage of phenytoin (a weak acid, pKa 8.3) is un-ionised at pH 7.4?', answer: 88.8, unit: '%', why: 'Ionised = 1/(1 + 10^(8.3 − 7.4)) = 1/8.94 = 11.2 %, so 88.8 % is un-ionised.' },
    { q: 'At equilibrium across a membrane, the total concentration of a weak acid is higher on the more alkaline side.', a: true, why: 'The un-ionised form equalises; on the alkaline side more of the acid is ionised, so the total is larger there.' },
    { q: 'Why does a local anaesthetic work less well in infected, inflamed tissue?', choices: ['bacteria destroy it', 'the acidic tissue ionises more of the base, so less un-ionised drug crosses into the nerve', 'inflammation raises the pH and precipitates it', 'the nerve has no receptors there'], a: 1, why: 'The un-ionised base is the form that diffuses through the nerve sheath; at pH 6.5 there is about six times less of it than at 7.4.' }
  ],
  problems: [
    { q: 'A weak acid (pKa 4.0) distributes between the stomach (pH 2.0) and plasma (pH 7.4). What is the plasma : stomach ratio of total drug at equilibrium?', answer: 2488, tol: 0.02, steps: ['Plasma: $1 + 10^{3.4} = 2513$. Stomach: $1 + 10^{-2} = 1.01$.', 'Ratio $= 2513/1.01 = 2488$.'] }
  ],
  applications: [
    'Work out the fraction ionised and log D at any pH in [the pH–solubility calculator](#/tools/formulation/solubility).',
    'Predicting where along the gut a drug is absorbed, and whether food or acid-reducing medicines change it.',
    'Choosing salts and the pH of injections and eye drops.',
    'Understanding ion trapping in breast milk, urine and acidic cell compartments.',
    'Explaining why local anaesthetics are made as hydrochloride salts yet act as free bases.'
  ],
  history: 'Lawrence Henderson (1908) and Karl Hasselbalch (1916) gave the buffer equation its familiar forms. Bernard Brodie, Lewis Schanker and colleagues set out the pH-partition hypothesis in the 1950s from experiments on absorption from the stomach and intestine of rats.',
  sim: 'sol-partition'
},

{
  id: 'ph-solubility', parent: 'solutions-solubility', title: 'pH and solubility', level: 2,
  short: 'A weak acid or base dissolves as its neutral form up to its intrinsic solubility S₀, and as many ions as the pH allows on top: its solubility climbs tenfold per pH unit on the ionised side — until the salt itself runs out of room at pHmax.',
  keywords: ['pH-solubility profile', 'intrinsic solubility', 'S0', 'weak acid', 'weak base', 'salt', 'pHmax', 'salt disproportionation', 'common-ion effect', 'precipitation', 'supersaturation', 'gastric pH', 'acid-reducing medicines', 'phenytoin injection', 'pH adjustment'],
  prereq: ['ionisation-pka', 'solubility-pharm', 'chemistry:solubility-product'],
  related: ['buffers-pharm', 'gi-absorption', 'food-effects', 'injectable-formulation', 'dissolution-rate', 'excipient-compatibility', 'drug-interactions'],
  body: `
A weak acid or base in water is really two substances: the neutral molecule, which is often poorly soluble, and its ion, which is usually very soluble. The solid is in equilibrium with the **neutral** form only, so the neutral form can never exceed its **intrinsic solubility** $S_0$. But the ions come on top of it — and how many there are is set by the pH, through [[ionisation-pka|Henderson–Hasselbalch]]:

$$\\text{acid: } S = S_0\\left(1 + 10^{\\,\\mathrm{pH} - \\mathrm{p}K_a}\\right) \\qquad \\text{base: } S = S_0\\left(1 + 10^{\\,\\mathrm{p}K_a - \\mathrm{pH}}\\right)$$

On a logarithmic plot the **pH–solubility profile** is flat at $S_0$ on the un-ionised side and climbs one decade per pH unit on the ionised side, bending at the pKa. A weak acid is least soluble in the stomach and most soluble in the intestine; a weak base the other way round.

### The ceiling: the salt and pHmax
The climb cannot go on forever. Eventually the solution is saturated with the **salt** as well — for a base, $\\ce{BH+}$ with its counter-ion — and from there on the salt is the solid that is in equilibrium, and the profile flattens again. The pH where the free form and the salt are both saturated is **pHmax**:

$$\\text{base: } \\mathrm{pH}_\\text{max} = \\mathrm{p}K_a - \\log\\frac{S_\\text{salt}}{S_0} \\qquad \\text{acid: } \\mathrm{pH}_\\text{max} = \\mathrm{p}K_a + \\log\\frac{S_\\text{salt}}{S_0}$$

Salts matter because they carry their own pH with them. A hydrochloride salt of a weak base dissolves and brings the surrounding solution towards pHmax, where the solubility is highest — so salts usually dissolve much faster than the free form in the same medium. Two cautions follow:

- **Common-ion effect**: a hydrochloride salt is less soluble in gastric juice, which is full of chloride ([[chemistry:common-ion-effect|common-ion effect]]).
- **Salt disproportionation**: if the microenvironment in a tablet is pushed above pHmax — by a basic excipient such as magnesium stearate, or by moisture — the salt can turn back into the poorly soluble free base inside the tablet ([[excipient-compatibility]]). Salts of very weak bases, with a low pHmax, are most at risk.

### Through the gut
| Region | Typical pH | Weak base (pKa 6.5, S₀ 5 µg/mL) | Weak acid (pKa 4.4, S₀ 20 µg/mL) |
|---|---|---|---|
| stomach, fasting | 1–2 | limited only by the salt | 20 µg/mL |
| stomach, after food or an acid-reducing medicine | 4–6 | 0.02–1.6 mg/mL | 0.03–0.8 mg/mL |
| duodenum and jejunum | 5.5–6.8 | 0.008–0.06 mg/mL | 0.3–5 mg/mL |
| ileum | about 7.4 | 6 µg/mL | 20 mg/mL |

A weak base dissolves in the acidic stomach and then meets the intestine, where its solubility may be hundreds of times lower. It often stays **supersaturated** long enough to be absorbed, but it can precipitate. This is why the absorption of several weakly basic drugs (some azole antifungals, kinase inhibitors and HIV medicines) falls when stomach acid is suppressed by proton-pump inhibitors or antacids — a well-known [[drug-interactions|drug interaction]] explained by one equation.

### Formulating with pH
pH adjustment is the simplest solubiliser for liquids and injections, but the pH must also suit stability ([[degradation-pathways]]) and the body: injections and eye drops far from neutral sting and irritate, and a buffered product resists the body's efforts to neutralise it ([[buffers-pharm]]). The antiepileptic **phenytoin** is the classic example: a weak acid (pKa about 8.3) with an intrinsic solubility of only about 20 µg/mL. Its injection needs a pH near 12, plus propylene glycol and ethanol — which is why it is irritant to veins, and why diluting it in an acidic infusion fluid can bring it out of solution.

> [!key] Solubility of a weak electrolyte = $S_0$ × (1 + ionised/un-ionised ratio). One pH unit on the ionised side is worth a factor of ten — until the salt's own solubility caps it at pHmax.
`,
  ideas: [
    'Only the neutral form is in equilibrium with the solid free acid or base; its concentration is fixed at the intrinsic solubility S₀.',
    'Total solubility = S₀ × (1 + 10^(pH − pKa)) for an acid and S₀ × (1 + 10^(pKa − pH)) for a base.',
    'On a log scale the profile rises one decade per pH unit on the ionised side, until the salt saturates at pHmax.',
    'Weak bases dissolve in the stomach and may precipitate in the intestine; weak acids do the opposite.',
    'Salts dissolve fast because they set their own local pH, but they can disproportionate back to the free form above pHmax.'
  ],
  pitfalls: [
    'A salt has a fixed solubility whatever the medium — A salt\'s dissolved amount depends on the pH (above pHmax it converts to the free form) and on common ions such as chloride in gastric juice.',
    'Once a weak base dissolves in the stomach, it stays in solution — In the higher pH of the intestine it becomes supersaturated and may precipitate, sometimes as a less soluble form.',
    'Raising the pH of an injection is a free way to dissolve an acidic drug — High or low pH irritates tissue and veins, can speed degradation, and the drug may precipitate when the body or an infusion fluid brings the pH back.'
  ],
  formulas: [
    {
      name: 'Solubility of a weak acid',
      expr: 'S = S0*(1 + 10^(pH - pKa))', tex: 'S = S_0\\left(1 + 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_a}\\right)',
      vars: {
        S: { name: 'total solubility', q: 'massconc', unit: 'mg/mL' },
        S0: { name: 'intrinsic solubility (un-ionised acid)', q: 'massconc', unit: 'mg/mL', value: 0.02, tex: 'S_0' },
        pH: { name: 'pH of the medium', value: 6.8, min: 0, max: 14, tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the acid', value: 4.4, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'Valid below pHmax, where the solid in contact with the solution is the free acid.',
      practice: { unknowns: ['S', 'pH', 'S0'] },
      stories: {
        S: 'A weak acid has an intrinsic solubility of {S0} and a pKa of {pKa}. How soluble is it at pH {pH}?',
        pH: 'At what pH does a weak acid (intrinsic solubility {S0}, pKa {pKa}) reach a solubility of {S}?',
        S0: 'A weak acid (pKa {pKa}) dissolves to {S} at pH {pH}. What is its intrinsic solubility?'
      }
    },
    {
      name: 'Solubility of a weak base',
      expr: 'S = S0*(1 + 10^(pKa - pH))', tex: 'S = S_0\\left(1 + 10^{\\,{\\mathrm{p}K}_a - \\mathrm{pH}}\\right)',
      vars: {
        S: { name: 'total solubility', q: 'massconc', unit: 'mg/mL' },
        S0: { name: 'intrinsic solubility (free base)', q: 'massconc', unit: 'mg/mL', value: 0.005, tex: 'S_0' },
        pKa: { name: 'pKa of the conjugate acid', value: 6.5, tex: '{\\mathrm{p}K}_a' },
        pH: { name: 'pH of the medium', value: 5.0, min: 0, max: 14, tex: '\\mathrm{pH}' }
      },
      note: 'Valid above pHmax; below it the salt is the solid phase and caps the solubility.',
      practice: { unknowns: ['S', 'pH'] },
      stories: {
        S: 'A weakly basic drug has an intrinsic solubility of {S0} and a pKa of {pKa}. What is its solubility at pH {pH}?',
        pH: 'Up to what pH can a weak base (intrinsic solubility {S0}, pKa {pKa}) keep {S} in solution?'
      }
    },
    {
      name: 'pHmax of the salt of a weak base',
      expr: 'pHmax = pKa - log(Ssalt/S0)', tex: '\\mathrm{pH}_\\text{max} = {\\mathrm{p}K}_a - \\log\\frac{S_\\text{salt}}{S_0}',
      vars: {
        pHmax: { name: 'pH of maximum solubility', tex: '\\mathrm{pH}_\\text{max}' },
        pKa: { name: 'pKa of the conjugate acid', value: 6.5, tex: '{\\mathrm{p}K}_a' },
        Ssalt: { name: 'solubility of the salt (as dissolved drug)', q: 'massconc', unit: 'mg/mL', value: 5, tex: 'S_\\text{salt}' },
        S0: { name: 'intrinsic solubility of the free base', q: 'massconc', unit: 'mg/mL', value: 0.005, tex: 'S_0' }
      },
      note: 'For the salt of a weak acid: pHmax = pKa + log(S_salt/S₀). Above pHmax (base) or below it (acid) a salt tends to convert to the free form.',
      practice: { unknowns: ['pHmax', 'Ssalt'] },
      stories: {
        pHmax: 'A weak base (pKa {pKa}) has an intrinsic solubility of {S0}; its hydrochloride dissolves to {Ssalt}. What is pHmax?',
        Ssalt: 'The salt of a weak base (pKa {pKa}, intrinsic solubility {S0}) has pHmax = {pHmax}. What is the salt\'s solubility?'
      }
    }
  ],
  examples: [
    {
      title: 'A weak base from stomach to intestine',
      q: 'A weakly basic drug has pKa 6.5, intrinsic solubility 5 µg/mL and a hydrochloride salt soluble to 5 mg/mL. A 200 mg dose meets 250 mL of fluid. Can it dissolve (a) in a fasting stomach at pH 1.5, (b) in a stomach at pH 5.0 (after an acid-reducing medicine), (c) in the jejunum at pH 6.5?',
      steps: [
        'Needed: 200 mg / 250 mL = 0.8 mg/mL.',
        'pHmax $= 6.5 - \\log(5/0.005) = 3.5$. Below it the salt caps the solubility near 5 mg/mL: (a) dissolves easily.',
        '(b) $S = 0.005\\,(1 + 10^{1.5}) = 0.16$ mg/mL: only $0.16 \\times 250 = 41$ mg of the 200 mg can dissolve.',
        '(c) $S = 0.005\\,(1 + 10^{0}) = 0.010$ mg/mL: 2.5 mg in 250 mL. Drug dissolved in the stomach arrives 80 times supersaturated and may precipitate.'
      ],
      a: 'Fully soluble at pH 1.5; about 40 mg at pH 5; about 2.5 mg at pH 6.5 — the base depends on stomach acid to dissolve.'
    },
    {
      title: 'Why phenytoin injection is so alkaline',
      q: 'Phenytoin is a weak acid (pKa ≈ 8.3) with an intrinsic solubility of about 0.02 mg/mL. What pH would dissolve 50 mg/mL in water alone?',
      steps: [
        '$50 = 0.02\\,(1 + 10^{\\,\\mathrm{pH} - 8.3})$, so $10^{\\,\\mathrm{pH} - 8.3} = 2499$.',
        '$\\mathrm{pH} = 8.3 + \\log 2499 = 8.3 + 3.4 = 11.7$.',
        'At pH 10 it would dissolve only $0.02\\,(1 + 10^{1.7}) = 1.0$ mg/mL. Real injections of the drug are near pH 12 and contain propylene glycol and ethanol as cosolvents.',
        'Mixed with an acidic fluid, the pH falls and the drug can crystallise; how it may be diluted and given is set out in the product information.'
      ],
      a: 'About pH 11.7 — hence a strongly alkaline, irritant injection.'
    }
  ],
  quiz: [
    { q: 'A weak acid (pKa 4.0) has an intrinsic solubility of 0.01 mg/mL. What is its solubility at pH 6.0 (mg/mL)?', answer: 1.01, unit: 'mg/mL', why: 'S = 0.01 × (1 + 10²) = 1.01 mg/mL — a hundredfold increase two units above the pKa.' },
    { q: 'On a plot of log S against pH, the profile of a weak base…', choices: ['is flat at low pH and rises at high pH', 'rises one decade per pH unit as the pH falls below the pKa, until it flattens at pHmax', 'falls one decade per pH unit as the pH falls', 'is a straight line through the pKa'], a: 1, why: 'A base is ionised below its pKa; each unit lower adds a factor of ten to the solubility, until the salt saturates.' },
    { q: 'Why can a proton-pump inhibitor lower the absorption of a poorly soluble weak base?', choices: ['it destroys the base chemically', 'it raises stomach pH, so less of the base ionises and dissolves before reaching the intestine', 'it blocks intestinal transporters', 'it lowers the drug\'s pKa'], a: 1, why: 'Weak bases rely on gastric acid to dissolve; at pH 5 instead of 1.5 their solubility can drop by orders of magnitude.' },
    { q: 'A hydrochloride salt of a weak base always dissolves better in gastric juice than in water.', a: false, why: 'Gastric juice contains chloride, which lowers the solubility of a hydrochloride salt by the common-ion effect; the free base may also convert if the pH is above pHmax.' },
    { q: 'A base has pKa 7.0 and S₀ = 0.01 mg/mL; its salt dissolves to 10 mg/mL. What is pHmax?', choices: ['3.0', '4.0', '7.0', '10.0'], a: 1, why: 'pHmax = 7.0 − log(10/0.01) = 7.0 − 3 = 4.0.' }
  ],
  problems: [
    { q: 'A weakly basic drug has pKa 5.8 and intrinsic solubility 0.02 mg/mL. What is its solubility in the fasting stomach at pH 2.0, assuming the salt does not limit it?', answer: 126, unit: 'mg/mL', tol: 0.02, steps: ['$S = 0.02\\,(1 + 10^{5.8 - 2.0}) = 0.02 \\times (1 + 6310)$.', '= 126 mg/mL — in practice the salt\'s own solubility would cap it well below this.'] }
  ],
  applications: [
    'Draw the pH–solubility profile of any weak acid or base, with its pH_max and BCS verdict, in [the pH–solubility calculator](#/tools/formulation/solubility).',
    'Choosing a salt and predicting where in the gut a drug will dissolve.',
    'Explaining interactions between weak bases and acid-reducing medicines, and the effect of food.',
    'Formulating injections and oral liquids by pH adjustment, within limits set by stability and tolerability.',
    'Guarding tablets of salts against disproportionation by basic excipients and moisture.'
  ],
  history: 'The pH–solubility relation follows from the work of Henderson and Hasselbalch; Kramer and Flynn analysed the pH-solubility profiles of salts and introduced pHmax in 1972, and Abu Serajuddin and others later explained salt disproportionation and the choice of salt forms.',
  sim: 'sol-ph-profile'
},

{
  id: 'partition-logp', parent: 'solutions-solubility', title: 'Partition coefficient, log P and log D', level: 2,
  short: 'Log P measures how much a drug prefers octanol (a model of fat and membranes) to water; log D is the same at a given pH, counting the ionised drug that stays in the water. Both predict absorption, distribution and how a drug behaves in emulsions and plastics.',
  keywords: ['partition coefficient', 'log P', 'log D', 'distribution coefficient', 'octanol–water', 'lipophilicity', 'hydrophilicity', 'rule of five', 'Lipinski', 'shake flask', 'pH-partition', 'preservative partitioning', 'emulsion', 'sorption to plastics', 'Hansch'],
  prereq: ['ionisation-pka', 'solubility-pharm', 'biology:membrane-structure'],
  related: ['membrane-transport-pharm', 'gi-absorption', 'transdermal', 'emulsions', 'preservatives', 'protein-binding', 'volume-distribution'],
  body: `
Shake a drug with two liquids that do not mix — water and 1-octanol — and it divides between them in a fixed ratio. For the neutral molecule that ratio is the **partition coefficient** $P$, usually quoted as its logarithm:

$$\\log P = \\log\\frac{C_\\text{octanol}}{C_\\text{water}}$$

Log P = 2 means a hundred times more in the octanol. Octanol was chosen by Corwin Hansch and Toshio Fujita in the 1960s because, like a cell membrane, it has a greasy chain with a hydrogen-bonding head, and it holds a little water; it has been the standard ever since.

### log D: the pH-dependent version
Ions stay in the water. For an ionisable drug the measured ratio of *all* forms, the **distribution coefficient** $D$, therefore depends on pH. With [[ionisation-pka|Henderson–Hasselbalch]]:

$$\\log D = \\log P - \\log\\left(1 + 10^{\\,\\mathrm{pH} - \\mathrm{p}K_a}\\right)\\ \\text{(acid)}\\qquad \\log D = \\log P - \\log\\left(1 + 10^{\\,\\mathrm{p}K_a - \\mathrm{pH}}\\right)\\ \\text{(base)}$$

On the ionised side, log D falls by one unit per pH unit. A lipophilic acid with log P 4.0 and pKa 4.4 has log D 4.0 in the stomach but only about 1.0 in blood at pH 7.4 — which is why log D at 7.4 is the number medicinal chemists usually quote.

| Drug | log P (approximate) | Behaviour |
|---|---|---|
| caffeine | −0.1 | hydrophilic but small: absorbed and crosses into the brain |
| paracetamol | 0.5 | balanced; well absorbed |
| aspirin | 1.2 | acid: log D at 7.4 far lower |
| diazepam | 2.8 | lipophilic, enters the brain quickly |
| ibuprofen | 4.0 | lipophilic acid, heavily protein-bound |
| amiodarone | about 7 | extremely lipophilic, huge volume of distribution |

### What it predicts
- **Absorption.** The un-ionised, moderately lipophilic drug crosses membranes by passive diffusion ([[membrane-transport-pharm]]). A log D between about 1 and 3 is often the sweet spot for oral absorption; very polar drugs (many aminoglycoside antibiotics) are hardly absorbed and are given by injection.
- **Drug-likeness.** Christopher Lipinski's **rule of five** (1997) found that poorly absorbed compounds usually break two or more of: molar mass over 500, log P over 5, more than 5 hydrogen-bond donors, more than 10 acceptors.
- **Distribution and clearance.** Lipophilic drugs enter fat and the brain, bind to plasma proteins ([[protein-binding]]), have large volumes of distribution ([[volume-distribution]]) and are metabolised by the liver; hydrophilic ones stay in body water and are excreted by the kidneys.
- **Skin.** Drugs for [[transdermal]] patches need a log P of roughly 1–3 to pass both the fatty outer layer and the watery layers beneath.

### Partition inside the medicine
The same equilibrium works *within* formulations. In an oil-in-water [[emulsions|emulsion]] a lipophilic preservative moves into the oil droplets, where it is useless, leaving too little in the water where microbes grow ([[preservatives]]). Drugs and preservatives also partition into rubber stoppers and plastic tubing: some lipophilic drugs are lost to PVC infusion sets, and some preservatives to rubber closures ([[packaging]]).

> [!note] Log P is measured by the shake-flask method (both phases assayed after equilibrium), estimated by HPLC retention, or calculated from the structure (clog P). Values from different methods can differ by half a unit or more.
`,
  ideas: [
    'Log P is the log of the octanol : water concentration ratio of the neutral drug; each unit is a factor of ten.',
    'Log D is the pH-dependent ratio of all forms: it falls by one unit per pH unit on the ionised side of the pKa.',
    'Moderate lipophilicity (log D about 1–3) favours oral absorption; very high log P brings poor solubility, binding and metabolism.',
    'Lipinski\'s rule of five flags compounds likely to be poorly absorbed.',
    'Partitioning inside a product moves preservatives into oil droplets and drugs into rubber and plastics.'
  ],
  pitfalls: [
    'Log P and log D are the same number — Log P is for the neutral species only; log D includes the ions and depends on pH. For an acid at pH 7.4 they can differ by several units.',
    'The more lipophilic, the better absorbed — Beyond a log P of about 5 solubility, protein binding and metabolism work against absorption; the relationship has an optimum.',
    'A preservative at the right total concentration protects an emulsion — What matters is the free concentration in the water phase, which partitioning into oil and micelles can reduce many times.'
  ],
  formulas: [
    {
      name: 'Partition coefficient',
      expr: 'logP = log(Co/Cw)', tex: '{\\log P}_{\\text{o/w}} = \\log\\frac{C_\\text{oct}}{C_\\text{w}}',
      vars: {
        logP: { name: 'octanol–water log P', signed: true, tex: '{\\log P}_{\\text{o/w}}' },
        Co: { name: 'concentration of the neutral drug in octanol', q: 'massconc', unit: 'mg/L', value: 50, tex: 'C_\\text{oct}' },
        Cw: { name: 'concentration of the neutral drug in water', q: 'massconc', unit: 'mg/L', value: 0.25, tex: 'C_\\text{w}' }
      },
      note: 'Measured on the un-ionised drug (buffer the water well away from the pKa), at equilibrium, with both phases mutually saturated.',
      practice: { unknowns: ['logP', 'Cw'] },
      stories: {
        logP: 'After shaking, a neutral drug is found at {Co} in the octanol and {Cw} in the water. What is its log P?',
        Cw: 'A neutral drug with log P = {logP} is at {Co} in octanol. What is its concentration in the water phase?'
      }
    },
    {
      name: 'log D of a weak acid',
      expr: 'logD = logP - log(1 + 10^(pH - pKa))', tex: '{\\log D}_{\\mathrm{pH}} = {\\log P}_{\\text{o/w}} - \\log\\left(1 + 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_a}\\right)',
      vars: {
        logD: { name: 'log D at this pH', signed: true, tex: '{\\log D}_{\\mathrm{pH}}' },
        logP: { name: 'log P of the neutral acid', value: 3.97, signed: true, tex: '{\\log P}_{\\text{o/w}}' },
        pH: { name: 'pH', value: 7.4, min: 0, max: 14, tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the acid', value: 4.4, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'Assumes the ions do not enter octanol. With lipophilic counter-ions (ion pairs) log D is somewhat higher than this.',
      practice: { unknowns: ['logD', 'pH'] },
      stories: {
        logD: 'A weak acid has log P = {logP} and pKa {pKa}. What is its log D at pH {pH}?',
        pH: 'A weak acid (log P = {logP}, pKa {pKa}) must have log D = {logD}. At what pH is that reached?'
      }
    },
    {
      name: 'log D of a weak base',
      expr: 'logD = logP - log(1 + 10^(pKa - pH))', tex: '{\\log D}_{\\mathrm{pH}} = {\\log P}_{\\text{o/w}} - \\log\\left(1 + 10^{\\,{\\mathrm{p}K}_a - \\mathrm{pH}}\\right)',
      vars: {
        logD: { name: 'log D at this pH', signed: true, tex: '{\\log D}_{\\mathrm{pH}}' },
        logP: { name: 'log P of the free base', value: 3.0, signed: true, tex: '{\\log P}_{\\text{o/w}}' },
        pKa: { name: 'pKa of the conjugate acid', value: 9.5, tex: '{\\mathrm{p}K}_a' },
        pH: { name: 'pH', value: 7.4, min: 0, max: 14, tex: '\\mathrm{pH}' }
      },
      practice: { unknowns: ['logD', 'logP'] },
      stories: {
        logD: 'A basic drug has log P = {logP} and pKa {pKa}. What is its log D at pH {pH}?',
        logP: 'A basic drug (pKa {pKa}) has a measured log D of {logD} at pH {pH}. What is the log P of its neutral form?'
      }
    },
    {
      name: 'Free preservative in the water of an emulsion',
      expr: 'Cw = C*(phi + 1)/(K*phi + 1)', tex: 'C_\\text{w} = C\\,\\frac{\\varphi + 1}{K\\varphi + 1}',
      vars: {
        Cw: { name: 'preservative concentration in the water phase', q: 'massconc', unit: 'mg/mL', tex: 'C_\\text{w}' },
        C: { name: 'total preservative (per mL of product)', q: 'massconc', unit: 'mg/mL', value: 2 },
        phi: { name: 'oil : water volume ratio', value: 0.25, tex: '\\varphi' },
        K: { name: 'oil : water partition coefficient of the preservative', value: 50 }
      },
      note: 'A mass balance with the preservative partitioning between oil and water (no micelles, no binding). Surfactant micelles take up more preservative still.',
      practice: { unknowns: ['Cw', 'C'] },
      stories: {
        Cw: 'A cream holds {C} of a preservative; its oil : water ratio is {phi} and the preservative\'s partition coefficient is {K}. What is its concentration in the water?',
        C: 'A preservative (partition coefficient {K}) must reach {Cw} in the water of an emulsion with oil : water ratio {phi}. How much must be added in total?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a shake-flask result',
      q: 'A neutral drug is shaken with equal volumes of octanol and water. At equilibrium the octanol contains 50 mg/L and the water 0.25 mg/L. What is log P?',
      steps: [
        '$P = 50/0.25 = 200$.',
        '$\\log P = \\log 200 = 2.3$ — moderately lipophilic, typical of well-absorbed oral drugs.'
      ],
      a: 'log P = 2.3.'
    },
    {
      title: 'An acid along the gut',
      q: 'A weak acid has log P = 3.97 and pKa = 4.4. Find its log D in the stomach (pH 1.5), the jejunum (pH 6.5) and blood (pH 7.4).',
      steps: [
        'pH 1.5: $\\log(1 + 10^{-2.9}) \\approx 0.0005$, so $\\log D = 3.97$.',
        'pH 6.5: $\\log(1 + 10^{2.1}) = 2.10$, so $\\log D = 1.87$.',
        'pH 7.4: $\\log(1 + 10^{3.0}) = 3.00$, so $\\log D = 0.97$.',
        'Three orders of magnitude less lipophilic in blood than in the stomach — yet still absorbed well in the intestine, whose surface is enormous.'
      ],
      a: 'log D ≈ 4.0, 1.9 and 1.0.'
    },
    {
      title: 'Where did the preservative go?',
      q: 'An oil-in-water cream (oil : water = 1 : 4) contains 2 mg/mL of a preservative with an oil : water partition coefficient of 50. What is the concentration in the water phase?',
      steps: [
        '$\\varphi = 0.25$: $C_\\text{w} = 2 \\times (0.25 + 1)/(50 \\times 0.25 + 1) = 2 \\times 1.25/13.5$.',
        '$C_\\text{w} = 0.19$ mg/mL — less than a tenth of the nominal 2 mg/mL. If the preservative needs about 1 mg/mL in water to work, this cream is poorly protected; the formulator must choose a more hydrophilic preservative or add more, and prove it with a preservative efficacy test.'
      ],
      a: 'About 0.19 mg/mL in the water — most of the preservative sits in the oil.'
    }
  ],
  quiz: [
    { q: 'A drug has log P = 3. At equilibrium between equal volumes of octanol and water, how much more of the neutral drug is in the octanol?', choices: ['3 times', '30 times', '1000 times', '3000 times'], a: 2, why: 'P = 10³ = 1000.' },
    { q: 'A weak acid has log P 3.0 and pKa 5.0. What is its log D at pH 7.0?', answer: 0.996, why: 'log D = 3.0 − log(1 + 10²) = 3.0 − 2.004 = 0.996 ≈ 1.0.' },
    { q: 'For a weak base, log D rises as the pH rises (below the pKa).', a: true, why: 'Raising the pH converts more of the base to its neutral form, which partitions into octanol; log D climbs one unit per pH unit until it reaches log P above the pKa.' },
    { q: 'Which property is NOT one of Lipinski\'s rule-of-five limits?', choices: ['molar mass over 500', 'log P over 5', 'more than 5 hydrogen-bond donors', 'melting point over 500 °C'], a: 3, why: 'The four criteria are molar mass, log P, hydrogen-bond donors (5) and acceptors (10), all multiples of five; melting point is not one of them.' },
    { q: 'Why can a lipophilic preservative fail in an oil-in-water cream even at its usual concentration?', choices: ['oil kills preservatives', 'it partitions into the oil droplets, leaving too little in the water where microbes grow', 'creams have no water', 'the emulsifier neutralises it chemically'], a: 1, why: 'Microbes grow in the water phase; a high oil : water partition coefficient pulls the preservative out of it.' }
  ],
  problems: [
    { q: 'A basic drug (log P 2.5, pKa 8.5) — what is its log D at pH 7.4?', answer: 1.37, tol: 0.03, steps: ['$\\log D = 2.5 - \\log(1 + 10^{8.5 - 7.4}) = 2.5 - \\log(13.6)$.', '$= 2.5 - 1.13 = 1.37$.'] }
  ],
  applications: [
    'See log D fall away from log P as the pH ionises the drug in [the pH–solubility calculator](#/tools/formulation/solubility).',
    'Ranking drug candidates for absorption, brain penetration and metabolism.',
    'Designing transdermal and topical products, where log P of about 1–3 favours skin permeation.',
    'Choosing preservatives for emulsions and creams, and allowing for partitioning into oil and micelles.',
    'Predicting losses of drugs to rubber closures, plastic bags and infusion tubing.'
  ],
  history: 'Meyer (1899) and Overton (1901) linked the potency of anaesthetics to their olive-oil : water partition. Corwin Hansch and Toshio Fujita adopted octanol in 1964 and founded quantitative structure–activity relationships on log P; Christopher Lipinski published the rule of five in 1997.',
  sim: 'sol-partition'
},

{
  id: 'buffers-pharm', parent: 'solutions-solubility', title: 'Buffers and buffer capacity', level: 2,
  short: 'Pharmaceutical buffers hold a medicine at the pH where it is stable, soluble and comfortable. The pKa sets the pH they hold best; the concentration sets how much acid or alkali they can absorb — but injections and eye drops are buffered only lightly, so the body can take over.',
  keywords: ['buffer', 'buffer capacity', 'Van Slyke', 'Henderson–Hasselbalch', 'phosphate buffer', 'citrate buffer', 'acetate buffer', 'histidine', 'tromethamine', 'borate', 'eye drops', 'injections', 'freezing and pH', 'buffer catalysis', 'physiological buffers'],
  prereq: ['chemistry:buffers', 'chemistry:henderson-hasselbalch', 'ionisation-pka'],
  related: ['ph-solubility', 'degradation-pathways', 'ophthalmic', 'injectable-formulation', 'lyophilisation', 'biologics-formulation', 'osmolarity-tonicity'],
  body: `
Many medicines are buffered: eye drops, injections, oral solutions, nasal sprays, and nearly every protein formulation. The buffer does three jobs — keeps the drug at the **pH of best stability** ([[degradation-pathways]]), keeps it **dissolved** ([[ph-solubility]]), and keeps the product **comfortable** — while the rules of choosing one are those of [[chemistry:buffers|buffers in chemistry]].

### pH and capacity
A buffer is a weak acid and its conjugate base together. Their ratio fixes the pH ([[chemistry:henderson-hasselbalch|Henderson–Hasselbalch]]):

$$\\mathrm{pH} = \\mathrm{p}K_a + \\log\\frac{C_\\text{base}}{C_\\text{acid}}$$

Their total concentration $C$ fixes how much acid or alkali it can absorb. The **buffer capacity** $\\beta$ — the strong base per litre needed to raise the pH by one unit — follows the Van Slyke equation:

$$\\beta = \\ln 10\\;C\\,\\frac{K_a\\,[\\ce{H+}]}{(K_a + [\\ce{H+}])^2}$$

It peaks at pH = pKa, where $\\beta = 0.576\\,C$, and falls to a third of that one unit away: choose a buffer whose pKa is within about one unit of the pH you want.

| Buffer | pKa (25 °C) | Used in |
|---|---|---|
| citrate | 3.1, 4.8, 6.4 | oral liquids, injections, protein products |
| acetate | 4.8 | injections, some eye drops |
| histidine | 6.0 | monoclonal antibodies |
| phosphate | 2.1, 7.2, 12.3 | injections, eye drops, nasal sprays |
| tromethamine (Tris) | 8.1 | injections, some biologics |
| borate | 9.2 | eye drops (not for injections or infants) |

### Buffering lightly on purpose
An injection or an eye drop meets a far larger volume of body fluid with its own buffers — blood holds its pH at 7.4 with bicarbonate, phosphate and proteins, and tears are renewed at roughly 15 % a minute. A product at an unphysiological pH is tolerated best when it is only weakly buffered: the body neutralises it within seconds to minutes. A strongly buffered solution far from pH 7.4 keeps its own pH longer, and stings or damages tissue. So the formulator uses the **lowest capacity** that still protects the product on the shelf. Where the drug's stability allows, eye drops are brought close to the pH of tears (about 7.4); where it does not, a low-capacity buffer at a compromise pH is used.

### Hidden effects
- **Buffer catalysis.** Buffer species can themselves catalyse degradation (general acid–base catalysis). Phosphate, citrate and acetate each speed the hydrolysis of certain drugs, so the rate at a given pH rises with buffer concentration — another reason to use as little as possible.
- **Temperature.** The pKa of amine buffers changes with temperature: Tris loses about 0.03 units per °C, so a solution adjusted to pH 8.1 at 25 °C is near 8.5 at 10 °C.
- **Ionic strength.** Salt lowers the apparent pKa of many buffers by a tenth or two.
- **Freezing.** In a freezing sodium phosphate buffer the basic salt crystallises first and the pH of the remaining liquid can fall by several units — a hazard for proteins during frozen storage and [[lyophilisation|freeze-drying]]. Potassium phosphate, histidine or citrate behave better.
- **Tonicity.** Buffer salts count towards the osmolarity of the product ([[osmolarity-tonicity]]).

> [!tip] Ratio sets the pH, concentration sets the capacity. Doubling both partners leaves the pH unchanged and doubles the acid or alkali the buffer can absorb.
`,
  ideas: [
    'Pharmaceutical buffers hold the pH for stability, solubility and comfort.',
    'The acid : base ratio sets the pH; the total concentration sets the capacity.',
    'Buffer capacity peaks at pH = pKa (0.576 C) and is useful within about ±1 pH unit.',
    'Injections and eye drops are buffered weakly so that body fluids can bring them to physiological pH quickly.',
    'Buffers can catalyse degradation, shift with temperature and change pH on freezing.'
  ],
  pitfalls: [
    'More buffer is always better — Strong buffering far from pH 7.4 makes injections and eye drops more painful and irritant, and buffer species can catalyse degradation; the lowest effective capacity is best.',
    'A buffer adjusted at room temperature keeps its pH in the refrigerator — The pKa of amine buffers such as Tris shifts about 0.03 units per °C, and phosphate buffers can change by several units on freezing.',
    'Diluting a buffer changes its pH — The ratio, and so the pH, is almost unchanged; what falls is the capacity (until the buffer is so dilute that water\'s own ions matter).'
  ],
  formulas: [
    {
      name: 'pH of a buffer',
      expr: 'pH = pKa + log(Cb/Ca)', tex: '\\mathrm{pH} = {\\mathrm{p}K}_a + \\log\\frac{C_\\text{base}}{C_\\text{acid}}',
      vars: {
        pH: { name: 'pH of the buffer', tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the buffer acid', value: 7.2, tex: '{\\mathrm{p}K}_a' },
        Cb: { name: 'concentration of the conjugate base', q: 'concentration', unit: 'mM', value: 30.7, tex: 'C_\\text{base}' },
        Ca: { name: 'concentration of the acid', q: 'concentration', unit: 'mM', value: 19.3, tex: 'C_\\text{acid}' }
      },
      note: 'Defaults: phosphate (H₂PO₄⁻/HPO₄²⁻, pKa 7.2) made up to pH 7.4. Ignores activity corrections, which lower the apparent pKa by 0.1–0.2 at physiological ionic strength.',
      practice: { unknowns: ['pH', 'Cb'] },
      stories: {
        pH: 'A buffer contains {Cb} of the base form and {Ca} of the acid form of a pair with pKa {pKa}. What is its pH?',
        Cb: 'With {Ca} of the acid form (pKa {pKa}), how much of the base form gives pH {pH}?'
      }
    },
    {
      name: 'Buffer capacity (Van Slyke)',
      expr: 'beta = ln(10)*C*10^(-pKa)*10^(-pH)/(10^(-pKa) + 10^(-pH))^2', tex: '\\beta = \\ln 10\\; C\\,\\frac{10^{-{\\mathrm{p}K}_a}\\,10^{-\\mathrm{pH}}}{\\left(10^{-{\\mathrm{p}K}_a} + 10^{-\\mathrm{pH}}\\right)^2}',
      vars: {
        beta: { name: 'buffer capacity: strong base per litre per pH unit', q: 'concentration', unit: 'mM', tex: '\\beta' },
        C: { name: 'total concentration of the buffer pair', q: 'concentration', unit: 'mM', value: 50 },
        pKa: { name: 'pKa of the buffer acid', value: 7.2, tex: '{\\mathrm{p}K}_a' },
        pH: { name: 'pH', value: 7.4, min: 0, max: 14, tex: '\\mathrm{pH}' }
      },
      note: 'The same as ln 10 · C · Ka[H⁺]/(Ka + [H⁺])². Water\'s own contribution, ln 10 ([H⁺] + [OH⁻]), matters only below pH 3 or above pH 11. Two pH values (either side of the pKa) give the same capacity.',
      practice: { unknowns: ['beta', 'C'] },
      stories: {
        beta: 'A {C} buffer pair with pKa {pKa} is at pH {pH}. What is its buffer capacity?',
        C: 'A buffer (pKa {pKa}) at pH {pH} must have a capacity of {beta}. What total concentration is needed?'
      }
    },
    {
      name: 'Acid or base absorbed for a small pH change',
      expr: 'n = beta*V*dpH', tex: 'n = \\beta\\,V\\,\\Delta\\mathrm{pH}',
      vars: {
        n: { name: 'strong acid or base added', q: 'amount', unit: 'mmol' },
        beta: { name: 'buffer capacity', q: 'concentration', unit: 'mM', value: 27.3, tex: '\\beta' },
        V: { name: 'volume of buffer', q: 'volume', unit: 'mL', value: 100 },
        dpH: { name: 'change in pH', value: 0.1, tex: '\\Delta\\mathrm{pH}' }
      },
      note: 'Valid for changes small enough that β stays nearly constant (a few tenths of a pH unit).',
      practice: { unknowns: ['n', 'dpH'] },
      stories: {
        n: 'How much strong base shifts {V} of a buffer with capacity {beta} by {dpH} pH units?',
        dpH: '{n} of strong acid is added to {V} of a buffer with capacity {beta}. By how much does the pH fall?'
      }
    }
  ],
  examples: [
    {
      title: 'Making a phosphate buffer at pH 7.4',
      q: 'Make a 50 mM sodium phosphate buffer at pH 7.4 (pKa 7.2). What concentrations of $\\ce{H2PO4-}$ and $\\ce{HPO4^2-}$ are needed, and what is its capacity?',
      steps: [
        'Ratio: $C_\\text{base}/C_\\text{acid} = 10^{7.4 - 7.2} = 1.585$.',
        '$C_\\text{base} = 50 \\times 1.585/2.585 = 30.7$ mM $\\ce{HPO4^2-}$; $C_\\text{acid} = 19.3$ mM $\\ce{H2PO4-}$.',
        'Capacity: $K_a[\\ce{H+}]/(K_a + [\\ce{H+}])^2 = 1.585/2.585^2 = 0.237$; $\\beta = 2.303 \\times 50 \\times 0.237 = 27.3$ mM per pH unit.',
        'In practice the pH is checked with a meter and trimmed, because ionic strength lowers the apparent pKa.'
      ],
      a: '30.7 mM HPO₄²⁻ and 19.3 mM H₂PO₄⁻; β ≈ 27 mM per pH unit (the maximum would be 28.8 mM at pH 7.2).'
    },
    {
      title: 'How much alkali moves it?',
      q: 'How much 0.1 M sodium hydroxide raises 100 mL of the buffer above (β = 27.3 mM per pH) by 0.1 pH unit?',
      steps: [
        '$n = \\beta V \\Delta\\mathrm{pH} = 27.3\\ \\mathrm{mmol/L} \\times 0.100\\ \\mathrm{L} \\times 0.1 = 0.273$ mmol.',
        'Volume of 0.1 M NaOH: $0.273/0.1 = 2.7$ mL. In 100 mL of water the same 2.7 mL would take the pH from 7 to about 11.4.'
      ],
      a: 'About 0.27 mmol — 2.7 mL of 0.1 M NaOH.'
    },
    {
      title: 'Choosing between two buffers',
      q: 'A protein product must be held at pH 5.5 with a 10 mM buffer. Compare acetate (pKa 4.76) and histidine (pKa 6.0).',
      steps: [
        'Acetate: $K_a/[\\ce{H+}] = 10^{0.74} = 5.50$, so $\\beta = 2.303 \\times 10 \\times 5.50/6.50^2 = 3.0$ mM per pH.',
        'Histidine: $K_a/[\\ce{H+}] = 10^{0.5} = 3.16$, so $\\beta = 2.303 \\times 10 \\times 3.16/4.16^2 = 4.2$ mM per pH.',
        'Histidine gives 40 % more capacity at the same concentration because its pKa is closer to 5.5 — and it also protects many antibodies against aggregation and behaves better on freezing than phosphate. The choice is confirmed experimentally.'
      ],
      a: 'Histidine: β ≈ 4.2 mM per pH against 3.0 for acetate.'
    }
  ],
  quiz: [
    { q: 'At what pH does a buffer made from an acid of pKa 6.0 have its greatest capacity?', choices: ['5.0', '6.0', '7.0', '7.4'], a: 1, why: 'Van Slyke\'s β is largest when [H⁺] = Ka, i.e. pH = pKa, where the two partners are equal.' },
    { q: 'What is the maximum buffer capacity of a 20 mM buffer pair (mM per pH unit)?', answer: 11.5, unit: 'mM', why: 'β_max = 0.576 C = 0.576 × 20 = 11.5 mM per pH unit.' },
    { q: 'Why are eye drops and injections usually buffered only weakly?', choices: ['strong buffers are illegal', 'so that tears or blood can quickly bring the product to physiological pH, which reduces pain and irritation', 'buffers are too expensive', 'buffers make solutions hypotonic'], a: 1, why: 'The body\'s own buffers neutralise a weakly buffered product within seconds to minutes; a strongly buffered one keeps its unphysiological pH longer.' },
    { q: 'Diluting a phosphate buffer tenfold with water changes its pH by about one unit.', a: false, why: 'The acid : base ratio, and so the pH, stays nearly the same; the capacity falls tenfold.' },
    { q: 'A drug hydrolyses faster in 100 mM phosphate than in 10 mM phosphate at the same pH. The most likely reason is…', choices: ['specific acid catalysis', 'general acid–base catalysis by the buffer species', 'the higher ionic strength lowers the pKa of the drug', 'phosphate is an oxidant'], a: 1, why: 'When the rate at constant pH depends on buffer concentration, the buffer species themselves are catalysts: use the lowest concentration that holds the pH.' }
  ],
  problems: [
    { q: 'An acetate buffer (pKa 4.76) is 0.10 M in acetic acid and 0.05 M in sodium acetate. What is its pH?', answer: 4.46, tol: 0.01, steps: ['$\\mathrm{pH} = 4.76 + \\log(0.05/0.10) = 4.76 - 0.30 = 4.46$.'] }
  ],
  applications: [
    'Holding eye drops, injections and nasal sprays at a stable and tolerable pH.',
    'Formulating monoclonal antibodies and vaccines, where the buffer also affects aggregation.',
    'Choosing buffers that survive freezing for frozen storage and freeze-drying.',
    'Dissolution media that mimic the gut (pH 1.2, 4.5 and 6.8) for dissolution testing.'
  ],
  history: 'Donald Van Slyke defined buffer capacity in 1922, while studying the acid–base balance of blood. Norman Good and colleagues introduced the "Good\'s buffers" such as HEPES and MES in 1966 for biological work; histidine and citrate became the workhorses of antibody formulations from the 1990s.',
  sim: 'sol-buffer'
},

{
  id: 'complexation', parent: 'solutions-solubility', title: 'Complexation and cyclodextrins', level: 3,
  short: 'A drug can be held reversibly by another molecule — a cyclodextrin ring, a metal ion, a protein. Complexes raise solubility and stability, mask taste, or, when they form in the gut with calcium or iron, stop a drug being absorbed.',
  keywords: ['complexation', 'cyclodextrin', 'inclusion complex', 'HP-β-cyclodextrin', 'SBE-β-cyclodextrin', 'phase-solubility diagram', 'Higuchi–Connors', 'binding constant', 'stability constant', 'complexation efficiency', 'chelation', 'EDTA', 'tetracycline', 'metal ions', 'taste masking'],
  prereq: ['solubility-pharm', 'chemistry:complex-ion-equilibria', 'chemistry:equilibrium-constant'],
  related: ['ph-solubility', 'surfactants', 'injectable-formulation', 'drug-interactions', 'protein-binding', 'degradation-pathways', 'oral-solutions'],
  body: `
A **complex** is two molecules held together reversibly — by hydrophobic contacts, hydrogen bonds or coordination to a metal — in an equilibrium like any other ([[chemistry:complex-ion-equilibria|complex-ion equilibria]]). In medicines, complexes are used on purpose to dissolve and protect drugs, and they form by accident in the gut, where they can block absorption.

### Cyclodextrins
Cyclodextrins are rings of glucose units shaped like truncated cones: sugar hydroxyl groups on the outside make them water-soluble, while the cavity inside is relatively greasy. A lipophilic drug, or the lipophilic part of it, slips into the cavity to form an **inclusion complex**, which dissolves as easily as the cyclodextrin itself.

| Cyclodextrin | Glucose units | Cavity (nm) | Water solubility (g/L, 25 °C) |
|---|---|---|---|
| α | 6 | about 0.5 | about 145 |
| β | 7 | about 0.6–0.65 | about 18.5 |
| γ | 8 | about 0.75–0.83 | about 230 |
| hydroxypropyl-β (HP-β-CD) | 7, modified | as β | over 500 |
| sulfobutylether-β (SBE-β-CD) | 7, modified | as β | over 500 |

Natural β-cyclodextrin fits many drug molecules but is poorly soluble and damages the kidney when injected, so the modified hydroxypropyl and sulfobutylether derivatives are used in injections and oral solutions — including several intravenous antifungal and antiviral medicines. The derivatives are removed by the kidneys, so product information often addresses their use in severe kidney impairment.

### Phase-solubility diagrams
Takeru Higuchi and Kenneth Connors (1965) showed how to measure a complex: add excess drug to solutions of increasing cyclodextrin concentration and assay the dissolved drug. For a 1 : 1 complex the plot is a straight line (type **A_L**) starting at the intrinsic solubility $S_0$, and its slope $m$ gives the binding constant:

$$K_{1:1} = \\frac{m}{S_0\\,(1 - m)}$$

Typical values are 100–5000 L/mol. Upward curvature (type A_P) means complexes with two cyclodextrins; a plateau (type B) means the complex itself has limited solubility. The **complexation efficiency** $m/(1-m) = K S_0$ says how many cyclodextrin molecules are loaded for each one left empty; it is often only 0.1–0.5, so a gram of drug may need several grams of cyclodextrin — which is why cyclodextrins suit potent, low-dose drugs.

### What complexation can and cannot do
- **Solubility without precipitation on dilution.** Along an A_L line the solubility is proportional to the cyclodextrin, so diluting a solution dilutes drug and solubiliser together and it stays below saturation — unlike a cosolvent, whose solubilising power collapses on dilution ([[solubility-pharm]]).
- **Rapid release in the body.** Complexes form and break within milliseconds. Diluted in blood, where the cyclodextrin concentration falls and plasma proteins compete, most of the drug is released at once.
- **Stability and comfort.** A drug inside the cavity is partly shielded from hydrolysis, oxidation and light ([[degradation-pathways]]); complexes also mask bitter tastes and reduce irritation of the eye and gut.

### Metal complexes and chelation
Many drugs bind metal ions. **Tetracyclines** and **fluoroquinolone** antibiotics chelate calcium, magnesium, aluminium, iron and zinc into complexes that are poorly absorbed, so milk, antacids and mineral supplements taken at the same time can cut their absorption substantially — a classic [[drug-interactions|drug interaction]]; product information states how to separate the doses. Formulators use chelation deliberately: **edetate** (EDTA) and citric acid bind the trace iron and copper that catalyse oxidation. Plasma [[protein-binding]] is complexation too, with albumin as the partner.
`,
  ideas: [
    'Complexes are reversible associations; their equilibrium constant says how tightly the partners bind.',
    'Cyclodextrins hold lipophilic drugs in their cavity, raising solubility, stability and palatability.',
    'A linear (A_L) phase-solubility diagram gives the 1 : 1 binding constant K = m/(S₀(1 − m)).',
    'Unlike cosolvents, cyclodextrin solutions do not precipitate on dilution, and the drug is released quickly in the body.',
    'Metal ions chelate some drugs in the gut and block their absorption; EDTA chelates metals to protect formulations.'
  ],
  pitfalls: [
    'A cyclodextrin complex is a new drug that must be broken down before it works — The complex is in rapid equilibrium; on dilution in the body the drug is released within moments.',
    'Any poorly soluble drug can be dissolved with enough cyclodextrin — The drug must fit the cavity, and a low complexation efficiency can demand grams of cyclodextrin per dose, which limits the approach to low-dose drugs.',
    'Taking a tetracycline with milk is harmless because milk is food — Calcium chelates the drug; the complex is poorly absorbed, and blood levels can fall considerably.'
  ],
  formulas: [
    {
      name: '1 : 1 binding constant from a phase-solubility slope',
      expr: 'K = m/(S0*(1 - m))', tex: 'K_{1:1} = \\frac{m}{S_0\\,(1 - m)}',
      vars: {
        K: { name: 'binding (stability) constant', q: false, unit: 'L/mol', tex: 'K_{1:1}' },
        m: { name: 'slope of the phase-solubility line (mol drug per mol cyclodextrin)', value: 0.2, min: 0, max: 1 },
        S0: { name: 'intrinsic solubility of the drug', q: false, unit: 'mol/L', value: 1e-4, tex: 'S_0' }
      },
      note: 'For an A_L diagram with slope below 1 (a 1 : 1 complex). Work in mol/L throughout.',
      practice: { unknowns: ['K', 'm'] },
      stories: {
        K: 'A drug\'s solubility rises linearly with cyclodextrin, with slope {m}, from an intrinsic solubility of {S0}. What is the binding constant?',
        m: 'A drug (intrinsic solubility {S0}) binds a cyclodextrin with K = {K}. What slope will its phase-solubility diagram have?'
      }
    },
    {
      name: 'Total solubility with a cyclodextrin (A_L type)',
      expr: 'St = S0 + K*S0*L/(1 + K*S0)', tex: 'S_t = S_0 + \\frac{K_{1:1}\\,S_0}{1 + K_{1:1}\\,S_0}\\,\\mathrm{[CD]}',
      vars: {
        St: { name: 'total solubility of the drug', q: false, unit: 'mol/L', tex: 'S_t' },
        S0: { name: 'intrinsic solubility', q: false, unit: 'mol/L', value: 1e-4, tex: 'S_0' },
        K: { name: 'binding constant', q: false, unit: 'L/mol', value: 2500, tex: 'K_{1:1}' },
        L: { name: 'total cyclodextrin concentration', q: false, unit: 'mol/L', value: 0.05, tex: '\\mathrm{[CD]}' }
      },
      note: 'Solubility rises linearly with the cyclodextrin, with slope K S₀/(1 + K S₀). 0.05 mol/L of HP-β-CD is about 7 % w/v.',
      practice: { unknowns: ['St', 'L'] },
      stories: {
        St: 'A drug with intrinsic solubility {S0} forms a 1 : 1 complex (K = {K}). What is its solubility in {L} cyclodextrin?',
        L: 'How much cyclodextrin (K = {K}) is needed to raise the solubility of a drug from {S0} to {St}?'
      }
    },
    {
      name: 'Fraction of dissolved drug left uncomplexed',
      expr: 'ff = 1/(1 + K*L)', tex: 'f_\\text{free} = \\frac{1}{1 + K_{1:1}\\,\\mathrm{[CD]}}',
      vars: {
        ff: { name: 'fraction of dissolved drug that is free', tex: 'f_\\text{free}' },
        K: { name: 'binding constant', q: false, unit: 'L/mol', value: 2500, tex: 'K_{1:1}' },
        L: { name: 'free cyclodextrin concentration', q: false, unit: 'mol/L', value: 0.05, tex: '\\mathrm{[CD]}' }
      },
      note: 'For cyclodextrin in large excess over the drug. On injection, dilution lowers [CD] and the free fraction rises.',
      practice: { unknowns: ['ff', 'L'] },
      stories: {
        ff: 'A drug binds a cyclodextrin with K = {K}; the free cyclodextrin is {L}. What fraction of the dissolved drug is free?',
        L: 'Below what cyclodextrin concentration is a fraction {ff} of the drug (K = {K}) free?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a phase-solubility diagram',
      q: 'A drug (molar mass 400 g/mol) has an intrinsic solubility of 0.10 mM. Its solubility rises linearly with HP-β-CD, with slope 0.20. Find the binding constant and the solubility in 0.05 M cyclodextrin. Roughly how much cyclodextrin (about 1400 g/mol) does each milligram of dissolved drug need?',
      steps: [
        '$K = 0.20/(1.0\\times10^{-4} \\times 0.80) = 2500$ L/mol.',
        '$S_t = 1.0\\times10^{-4} + 0.20 \\times 0.05 = 0.0101$ mol/L — about 4.0 mg/mL, a hundredfold increase.',
        'Complexation efficiency $m/(1-m) = 0.25$: for each cyclodextrin carrying a drug molecule, four are empty. Each mole of drug brought into solution uses about 5 mol of cyclodextrin.',
        'By mass: $5 \\times 1400/400 = 17.5$ mg of cyclodextrin per mg of drug. A 10 mg dose is easy; a 500 mg dose would need almost 9 g.'
      ],
      a: 'K = 2500 L/mol; about 4 mg/mL in 0.05 M cyclodextrin; roughly 17 mg of cyclodextrin per mg of drug.'
    },
    {
      title: 'Release on injection',
      q: 'In the vial of the example above the free cyclodextrin is about 0.05 M. What fraction of the drug is free there, and after a hundredfold dilution in blood?',
      steps: [
        'Vial: $f = 1/(1 + 2500 \\times 0.05) = 1/126 = 0.8$ %.',
        'Diluted 100 times: $[\\text{CD}] = 0.0005$ M, $f = 1/(1 + 1.25) = 44$ %.',
        'And plasma proteins, lipids and cholesterol compete for the drug and the cavity, so in practice release is faster still. The drug does not precipitate, because the cyclodextrin is diluted along with it.'
      ],
      a: 'Under 1 % free in the vial, about 44 % free after a hundredfold dilution — and rising.'
    }
  ],
  quiz: [
    { q: 'Which natural cyclodextrin is least soluble in water, and so rarely injected?', choices: ['α-cyclodextrin', 'β-cyclodextrin', 'γ-cyclodextrin', 'they are equally soluble'], a: 1, why: 'β-cyclodextrin dissolves only to about 18.5 g/L and can crystallise in the kidney; its hydroxypropyl and sulfobutylether derivatives dissolve above 500 g/L.' },
    { q: 'A drug has an intrinsic solubility of 0.5 mM and a linear phase-solubility slope of 0.10 with a cyclodextrin. What is K (L/mol)?', answer: 222, unit: 'L/mol', why: 'K = 0.10/(5×10⁻⁴ × 0.90) = 222 L/mol.' },
    { q: 'A linear (A_L) phase-solubility diagram with a slope below 1 usually indicates…', choices: ['an insoluble complex', 'a 1 : 1 soluble complex', 'no complex at all', 'a 1 : 2 drug–cyclodextrin complex'], a: 1, why: 'A straight line means each added cyclodextrin brings the same amount of drug into solution — one-to-one complexation. Curving upwards suggests higher-order complexes; a plateau, a complex of limited solubility.' },
    { q: 'A drug dissolved with a cyclodextrin is released quickly after intravenous injection.', a: true, why: 'Complexes are in fast equilibrium; dilution and competition by plasma components shift it towards the free drug within moments.' },
    { q: 'Why can milk or an antacid reduce the absorption of a tetracycline antibiotic?', choices: ['they raise stomach pH and destroy the drug', 'calcium, magnesium or aluminium chelate the drug into poorly absorbed complexes', 'they speed up gastric emptying', 'they coat the gut wall'], a: 1, why: 'Tetracyclines bind multivalent metal ions strongly; the chelates are poorly absorbed, which is why doses are separated from such products.' }
  ],
  problems: [
    { q: 'A drug (S₀ = 0.2 mM) binds a cyclodextrin with K = 1000 L/mol. What is its total solubility (mM) in 0.10 M cyclodextrin?', answer: 16.87, unit: 'mM', tol: 0.02, steps: ['Slope $= K S_0/(1 + K S_0) = 0.2/1.2 = 0.1667$.', '$S_t = 0.2 + 0.1667 \\times 100 = 16.9$ mM — an 84-fold increase.'] }
  ],
  applications: [
    'Intravenous and oral solutions of poorly soluble drugs with hydroxypropyl or sulfobutylether β-cyclodextrin.',
    'Eye drops and nasal sprays in which the complex reduces irritation and increases the dissolved drug.',
    'Taste masking of bitter drugs in oral liquids and orally disintegrating tablets.',
    'Chelating agents (edetate) that protect oxidation-sensitive products; advice on separating certain antibiotics from minerals.'
  ],
  history: 'Antoine Villiers described cyclodextrins in 1891 and Franz Schardinger characterised them in the early 1900s. Higuchi and Connors published the phase-solubility method in 1965; the first medicine containing a cyclodextrin was approved in Japan in 1976, and the soluble hydroxypropyl and sulfobutylether derivatives opened the way to injections from the 1990s.',
  sim: { id: 'sol-solubilisers', params: { mode: 'cd' } }
},

/* ================================================================ STABILITY */

{
  id: 'degradation-pathways', parent: 'stability-topic', title: 'How drugs degrade', level: 2,
  short: 'Medicines break down chemically — mostly by hydrolysis, oxidation and light — and physically, by changing crystal form, settling or separating. Knowing a molecule\'s weak points tells the formulator which pH, excipients, gases and packs will protect it.',
  keywords: ['degradation', 'hydrolysis', 'ester', 'amide', 'beta-lactam', 'oxidation', 'autoxidation', 'free radicals', 'antioxidant', 'chelating agent', 'EDTA', 'photolysis', 'racemisation', 'epimerisation', 'Maillard reaction', 'pH-rate profile', 'specific acid–base catalysis', 'pH of maximum stability', 'forced degradation', 'degradation products'],
  prereq: ['chemistry:carboxylic-acids-esters', 'chemistry:redox-reactions', 'chemistry:catalysis', 'reaction-order'],
  related: ['shelf-life', 'photostability', 'excipient-compatibility', 'buffers-pharm', 'stability-testing', 'biologics-formulation', 'analytical-methods'],
  body: `
Every medicine starts to change the day it is made. Most changes are slow chemical reactions of the drug with water, oxygen or light, catalysed by acid, base, traces of metal or the excipients around it. The formulator's first job is to read the molecule for its weak points.

| Weak point | Examples | Main reaction | Usual protection |
|---|---|---|---|
| ester | aspirin, local anaesthetics of the procaine type, many prodrugs | hydrolysis | dry solid forms, pH of maximum stability, less water |
| β-lactam | penicillins, cephalosporins | hydrolysis of the strained ring | dry powders made up just before use |
| amide | paracetamol, lidocaine | slow hydrolysis | usually adequate as is |
| phenol, catechol | adrenaline (epinephrine), levodopa, morphine | oxidation | antioxidant, chelator, nitrogen, low pH, amber glass |
| thiol, thioether | captopril, methionine in proteins | oxidation | low oxygen, antioxidants |
| extended conjugation, nitroaryl | nifedipine, riboflavin | photolysis | opaque or amber packs, coloured coatings |
| primary or secondary amine | many drugs, with lactose | Maillard reaction | avoid reducing sugars |

### Hydrolysis
Water attacks the carbonyl carbon of esters, amides, lactams and imides. Esters hydrolyse far faster than amides, and the four-membered β-lactam ring of penicillins is so strained that many penicillin mixtures for children are supplied as powders, reconstituted by the pharmacist and kept only for a week or two. Hydrolysis is catalysed by hydrogen and hydroxide ions (**specific acid–base catalysis**), so the observed first-order rate constant depends on pH:

$$k_\\text{obs} = k_{\\ce{H+}}\\,[\\ce{H+}] + k_0 + k_{\\ce{OH-}}\\,[\\ce{OH-}]$$

Plotted as log k against pH this gives the **V-shaped pH–rate profile**: a slope of −1 where acid catalysis dominates, +1 where base does, and a minimum — the **pH of maximum stability** — in between. Aspirin is most stable near pH 2–3; many esters between 3 and 5. Buffer species can also catalyse hydrolysis (**general acid–base catalysis**), so buffers are kept dilute ([[buffers-pharm]]). When the drug itself ionises, the profile acquires shoulders and plateaus, because the ion and the neutral molecule react at different rates.

### Oxidation
Most oxidation in medicines is **autoxidation**, a free-radical chain reaction with oxygen:

- **initiation**: light, heat, trace iron or copper, or peroxide impurities make a radical $\\ce{R.}$;
- **propagation**: $\\ce{R. + O2 -> ROO.}$, then $\\ce{ROO. + RH -> ROOH + R.}$ — each radical oxidises many molecules;
- **termination**: two radicals meet, or an antioxidant captures one.

Because the chain amplifies tiny triggers, parts per million of metal or peroxide matter. Protection is layered: **chelators** (edetate, citrate) to lock up metals; **antioxidants**, either reducing agents that are oxidised first (sodium metabisulfite, ascorbic acid) or chain-breakers (butylated hydroxytoluene, tocopherol) for oils; **nitrogen** in the headspace and dissolved oxygen driven out ([[photostability]]); and often a low pH, since phenolate ions oxidise faster than phenols. An adrenaline solution turning pink, then brown, is oxidation made visible.

### Other chemical changes
- **Photolysis** by UV and visible light — see [[photostability]].
- **Racemisation and epimerisation**: tetracycline slowly forms its less active 4-epimer; in the 1960s degraded tetracycline caused kidney damage, a lesson in why degradation products, not just potency, set shelf lives.
- **Polymerisation and condensation**: concentrated ampicillin solutions form dimers; amines react with reducing sugars such as lactose in the browning **Maillard reaction** ([[excipient-compatibility]]).
- **Proteins** deamidate, oxidise, unfold and aggregate ([[biologics-formulation]]).

### Physical instability
A product can fail with its drug chemically intact: a polymorph converts ([[solid-state]]), suspension particles grow and cake, an emulsion creams or cracks, tablets harden or soften with moisture, a drug adsorbs to the container.

### Finding the pathways
**Forced degradation** (stress testing) exposes the drug to acid, base, peroxide, heat and light until about 5–20 % has degraded, to identify the products and prove that the assay separates them from the drug — a *stability-indicating* method ([[analytical-methods]]). ICH Q3B(R2) (2006) sets the levels, typically 0.1–1 % depending on the daily dose, above which degradation products must be reported, identified and justified as safe.

> [!warn] A medicine that has changed colour, smell or appearance (tablets crumbling or spotted, a clear solution turned cloudy or tinted) may have degraded: do not use it, and ask a pharmacist.
`,
  ideas: [
    'Hydrolysis (esters, lactams, amides), oxidation (phenols, thiols, unsaturated chains) and photolysis are the main chemical pathways.',
    'Specific acid–base catalysis gives a V-shaped log k–pH profile; the pH of maximum stability lies at its minimum.',
    'Autoxidation is a radical chain reaction: traces of metals, peroxides or light start it, and each radical oxidises many molecules.',
    'Protection is layered: pH, low water, chelators, antioxidants, inert gas and light-resistant packs.',
    'Degradation products, not only loss of potency, can set the shelf life.'
  ],
  pitfalls: [
    'A drug is either stable or unstable — Stability depends on the pH, water, oxygen, light, temperature, excipients and pack; the same molecule can last years as a tablet and hours in solution.',
    'An antioxidant alone solves oxidation — Antioxidants are consumed; without removing oxygen and chelating trace metals they may only delay the reaction, and sulfites can react with some drugs themselves.',
    'Only the loss of drug matters — A degradation product can be toxic or allergenic at a fraction of a per cent, and then it sets the shelf life (tetracycline, 1960s).'
  ],
  formulas: [
    {
      name: 'Hydrolysis rate with specific acid–base catalysis',
      expr: 'kobs = kH*10^(-pH) + k0 + kOH*10^(pH - 14)', tex: 'k_\\text{obs} = k_{\\ce{H+}}\\,10^{-\\mathrm{pH}} + k_0 + k_{\\ce{OH-}}\\,10^{\\,\\mathrm{pH} - 14}',
      vars: {
        kobs: { name: 'observed first-order rate constant', q: false, unit: '1/h', tex: 'k_\\text{obs}' },
        kH: { name: 'acid-catalysed rate constant', q: false, unit: 'L/(mol·h)', value: 0.1, tex: 'k_{\\ce{H+}}' },
        pH: { name: 'pH', value: 7.4, min: 0, max: 14, tex: '\\mathrm{pH}' },
        k0: { name: 'uncatalysed (water) rate constant', q: false, unit: '1/h', value: 1e-6, tex: 'k_0' },
        kOH: { name: 'base-catalysed rate constant', q: false, unit: 'L/(mol·h)', value: 100, tex: 'k_{\\ce{OH-}}' }
      },
      note: 'At 25 °C, where pKw = 14 so [OH⁻] = 10^(pH − 14). The drug is assumed not to ionise in the range; buffer catalysis adds further terms. t90 = 0.105/k_obs.',
      practice: { unknowns: ['kobs'] },
      stories: {
        kobs: 'A hypothetical ester hydrolyses with k(H⁺) = {kH}, k₀ = {k0} and k(OH⁻) = {kOH}. What is its observed rate constant at pH {pH}?',
        pH: 'At what pH does the observed rate constant of the ester reach {kobs}?'
      }
    },
    {
      name: 'pH of maximum stability',
      expr: 'pHmin = (14 + log(kH/kOH))/2', tex: '\\mathrm{pH}_\\text{min} = \\tfrac12\\left(14 + \\log\\frac{k_{\\ce{H+}}}{k_{\\ce{OH-}}}\\right)',
      vars: {
        pHmin: { name: 'pH of maximum stability (minimum rate)', tex: '\\mathrm{pH}_\\text{min}' },
        kH: { name: 'acid-catalysed rate constant', q: false, unit: 'L/(mol·h)', value: 0.1, tex: 'k_{\\ce{H+}}' },
        kOH: { name: 'base-catalysed rate constant', q: false, unit: 'L/(mol·h)', value: 100, tex: 'k_{\\ce{OH-}}' }
      },
      note: 'Where the acid and base terms are equal (setting dk/dpH = 0). Base catalysis is usually far stronger than acid catalysis, so the minimum usually lies on the acidic side of 7.',
      practice: { unknowns: ['pHmin'] },
      stories: {
        pHmin: 'An ester hydrolyses with k(H⁺) = {kH} and k(OH⁻) = {kOH}. At what pH is it most stable?',
        kOH: 'An ester with k(H⁺) = {kH} is most stable at pH {pHmin}. What is its base-catalysed rate constant?'
      }
    }
  ],
  examples: [
    {
      title: 'A pH–rate profile in numbers',
      q: 'A hypothetical ester drug in solution at 25 °C has $k_{\\ce{H+}}$ = 0.1 L/(mol·h), $k_0 = 1\\times10^{-6}$ per hour and $k_{\\ce{OH-}}$ = 100 L/(mol·h). Find the pH of maximum stability and the shelf life ($t_{90}$) at pH 3.0, at that optimum and at 7.4.',
      steps: [
        '$\\mathrm{pH}_\\text{min} = \\tfrac12\\,(14 + \\log 10^{-3}) = 5.5$.',
        'pH 3.0: $k = 1.0\\times10^{-4} + 1\\times10^{-6} + 1\\times10^{-9} = 1.01\\times10^{-4}$ per hour, $t_{90} = 0.105/k = 1040$ h — about 43 days.',
        'pH 5.5: $k = 3.2\\times10^{-7} + 1\\times10^{-6} + 3.2\\times10^{-7} = 1.63\\times10^{-6}$ per hour, $t_{90} = 64\\,500$ h — about 7 years.',
        'pH 7.4: $k = 2.6\\times10^{-5}$ per hour, $t_{90} = 4030$ h — about 5.5 months.',
        'Moving about two pH units away costs a factor of 16 to 60 in shelf life: the solution would be buffered near pH 5.5, if that pH also suits solubility and comfort.'
      ],
      a: 'Most stable at pH 5.5 (t90 about 7 years); about 43 days at pH 3 and 5.5 months at pH 7.4.'
    },
    {
      title: 'Reading a molecule for its weak points',
      q: 'A new drug has an ester, a catechol (two adjacent phenolic OH groups) and a primary amine. It is to be made as an injection and as tablets. What should the formulator worry about?',
      steps: [
        'Ester → hydrolysis: in the injection, measure the pH–rate profile and buffer weakly near the minimum; consider a freeze-dried powder if the solution is too unstable.',
        'Catechol → autoxidation, faster at high pH and with trace metals: add edetate and an antioxidant, fill under nitrogen, use amber ampoules.',
        'Primary amine → Maillard reaction with reducing sugars: in the tablets use mannitol or microcrystalline cellulose rather than lactose ([[excipient-compatibility]]).',
        'Then prove each choice by forced degradation and stability studies ([[stability-testing]]).'
      ],
      a: 'Hydrolysis (pH, water), oxidation (oxygen, metals, light) and the Maillard reaction (no lactose) — each with its own protection.'
    }
  ],
  quiz: [
    { q: 'Which group is the most readily hydrolysed in aqueous solution?', choices: ['ether', 'ester', 'alkane chain', 'benzene ring'], a: 1, why: 'Esters are attacked by water at the carbonyl carbon, with acid and base catalysis; ethers, alkanes and aromatic rings are not hydrolysed under normal conditions.' },
    { q: 'An ester hydrolyses with k(H⁺) = 1 L/(mol·h) and k(OH⁻) = 10⁴ L/(mol·h). What is its pH of maximum stability?', answer: 5.0, why: 'pH_min = ½(14 + log(1/10⁴)) = ½(14 − 4) = 5.0.' },
    { q: 'Why do traces of iron or copper speed the oxidation of a drug solution so much?', choices: ['they react with the drug one to one', 'they generate free radicals that start chain reactions in which each radical oxidises many molecules', 'they lower the pH', 'they absorb light'], a: 1, why: 'Autoxidation is a chain reaction; metals catalyse the initiation and the breakdown of peroxides into new radicals, so parts per million matter.' },
    { q: 'Sodium metabisulfite protects a drug from oxidation by being oxidised itself in preference to the drug.', a: true, why: 'It is a reducing agent: it consumes oxygen and oxidising radicals first. It is used up in the process, so its content is monitored in stability studies.' },
    { q: 'Why are many penicillin mixtures for children supplied as dry powders that the pharmacist mixes with water?', choices: ['the powder is cheaper to ship', 'the strained β-lactam ring hydrolyses in water within days to weeks', 'penicillins oxidise in air', 'the powder dissolves more slowly and tastes better'], a: 1, why: 'In water the β-lactam ring opens; as a dry powder the drug keeps for years, and once mixed it has a short in-use life, usually in the refrigerator.' }
  ],
  problems: [
    { q: 'The hypothetical ester of the example is formulated at pH 4.5 instead of 5.5. What is its t90 in days?', answer: 1047, unit: 'day', tol: 0.03, steps: ['$k = 0.1 \\times 10^{-4.5} + 1\\times10^{-6} + 100 \\times 10^{-9.5} = 3.16\\times10^{-6} + 1\\times10^{-6} + 3.2\\times10^{-8} = 4.19\\times10^{-6}$ per hour.', '$t_{90} = 0.1054/4.19\\times10^{-6} = 25\\,100$ h, about 1050 days — under 3 years, against about 7 at the optimum.'] }
  ],
  applications: [
    'Choosing the pH, buffer and vehicle of oral solutions and injections.',
    'Deciding between a ready-to-use solution, a suspension and a powder for reconstitution.',
    'Adding antioxidants, chelators and nitrogen to oxidation-sensitive products such as catecholamine injections.',
    'Designing forced-degradation studies and stability-indicating assays.'
  ],
  history: 'Takeru Higuchi\'s school brought physical organic chemistry into pharmacy in the 1950s and 1960s; Kenneth Connors, Gordon Amidon and Lloyd Kennon collected the kinetics of drug degradation in a handbook in 1979 (second edition, with Valentino Stella, 1986). The kidney injuries from degraded tetracycline in the early 1960s helped establish that degradation products must be identified and limited, not just the potency measured.',
  sim: 'sol-ph-rate'
},

{
  id: 'reaction-order', parent: 'stability-topic', title: 'Reaction order and rate constants', level: 2,
  short: 'The order of a degradation reaction says how its rate depends on the amount of drug left: zero order loses a fixed amount per day, first order a fixed fraction, second order slows down faster still. The order fixes the shape of the curve and the formula for the shelf life.',
  keywords: ['reaction order', 'rate constant', 'zero order', 'first order', 'second order', 'pseudo-first order', 'apparent zero order', 'integrated rate law', 'half-life', 't90', 'linear plot', 'units of k', 'consecutive reactions', 'reversible reactions', 'solid-state kinetics'],
  prereq: ['chemistry:rate-laws', 'chemistry:integrated-rate-laws', 'math:exponential-growth-decay'],
  related: ['shelf-life', 'degradation-pathways', 'stability-testing', 'release-kinetics', 'suspensions', 'math:linear-regression'],
  body: `
The rate of a reaction — how fast the drug disappears — generally depends on how much is left. The **order** $n$ is the power of the concentration in the rate law ([[chemistry:rate-laws|rate laws]]):

$$-\\frac{dC}{dt} = k\\,C^n$$

For drug degradation three orders cover almost everything: **zero** (a constant amount lost per unit time), **first** (a constant *fraction* lost per unit time) and **second** (the rate falls with the square of what is left). Integrating each gives a formula for the concentration at any time — and a plot that is a straight line only for the right order ([[chemistry:integrated-rate-laws|integrated rate laws]]).

| Order | Integrated law | Straight line | $t_{1/2}$ | $t_{90}$ | Units of $k$ |
|---|---|---|---|---|---|
| 0 | $C = C_0 - k_0 t$ | $C$ against $t$ | $C_0/2k_0$ | $0.1\\,C_0/k_0$ | mg/(mL·day) |
| 1 | $\\ln C = \\ln C_0 - k_1 t$ | $\\ln C$ against $t$ | $0.693/k_1$ | $0.105/k_1$ | 1/day |
| 2 | $1/C = 1/C_0 + k_2 t$ | $1/C$ against $t$ | $1/(k_2 C_0)$ | $1/(9 k_2 C_0)$ | L/(mol·day) |

The half-life and $t_{90}$ tell the orders apart: independent of the starting concentration for first order, proportional to it for zero order, inversely proportional for second order.

### Why most drugs look first order
A true bimolecular reaction — a drug molecule meeting a water molecule, or a hydroxide ion — would be second order. But in a solution water is present at 55 mol/L, and a buffer holds $[\\ce{OH-}]$ constant, so those concentrations do not change: the rate depends only on the drug, and the reaction is **pseudo-first order**, with $k_\\text{obs} = k_2[\\ce{H2O}]$ or $k_2[\\ce{OH-}]$. That is why first order dominates stability work and [[shelf-life]] is usually $0.105/k$.

**Apparent zero order** appears whenever the concentration of the reacting drug is held constant by a reservoir: in a [[suspensions|suspension]], only the dissolved drug degrades and dissolution tops it up, so the loss is $k_1 \\times$ solubility per day, whatever the total. Drugs in some solid dosage forms, which react only in a surface layer of adsorbed water, and the release from some modified-release systems ([[release-kinetics]]) also behave this way.

### Finding the order
Plot the data three ways — $C$, $\\ln C$ and $1/C$ against time — and see which is straight, or better, fit all three by [[math:linear-regression|least squares]] and compare the residuals. The catch is that over the first 10–15 % of degradation *every* order looks straight: at the halfway point to $t_{90}$, zero- and first-order curves with the same $t_{90}$ differ by only 0.13 % of label, far below assay precision. Distinguishing orders needs either degradation well beyond 20–30 % (in a stress study) or very precise data. When the order cannot be settled, first order is the usual default — and the regulator asks for real-time data at the storage condition anyway ([[stability-testing]]).

### When one order is not enough
- **Consecutive reactions** ($\\ce{A -> B -> C}$): an intermediate rises and falls — many degradation products behave like this.
- **Reversible reactions** ($\\ce{A <=> B}$): epimerisation of tetracycline or isomerisation of some vitamins approach an equilibrium mixture instead of zero.
- **Parallel reactions**: hydrolysis and oxidation side by side; the observed $k$ is the sum of the individual constants.
- **Solid-state reactions** often follow sigmoid curves — slow start, acceleration as product nuclei grow, then a slowdown — described by nucleation models (Avrami–Erofeev, Prout–Tompkins), not by simple orders.

> [!key] First order loses a fixed fraction per unit time (t90 = 0.105/k, whatever the dose); zero order a fixed amount (t90 = 0.1 C₀/k₀). Most solutions are pseudo-first order; suspensions are apparent zero order.
`,
  ideas: [
    'The order is the power of the concentration in the rate law; it fixes the shape of the degradation curve.',
    'Zero order: C falls linearly; first order: ln C falls linearly; second order: 1/C rises linearly.',
    'Half-lives: independent of C₀ for first order, proportional to C₀ for zero order, inversely proportional for second order.',
    'Hydrolysis in water or buffer is pseudo-first order; suspensions are apparent zero order.',
    'Early data (under about 15 % loss) cannot distinguish the orders reliably.'
  ],
  pitfalls: [
    'A straight line over the first 10 % proves the order — Over small conversions zero, first and second order all look linear within assay precision; more degradation or more precise data are needed.',
    'The rate constant has the same units whatever the order — k₀ is a concentration per time (mg/(mL·day)), k₁ a reciprocal time (1/day), k₂ per concentration per time (L/(mol·day)); mixing them up gives nonsense.',
    'A second-order reaction with water must be second order in practice — Water is in vast excess, so its concentration does not change and the reaction is pseudo-first order.'
  ],
  formulas: [
    {
      name: 'Zero-order loss',
      expr: 'C = C0 - k0*t', tex: 'C = C_0 - k_0\\,t',
      vars: {
        C: { name: 'concentration remaining', q: false, unit: 'mg/mL' },
        C0: { name: 'initial concentration', q: false, unit: 'mg/mL', value: 25, tex: 'C_0' },
        k0: { name: 'zero-order rate constant', q: false, unit: 'mg/(mL·day)', value: 0.1, tex: 'k_0' },
        t: { name: 'time', q: false, unit: 'day', value: 20 }
      },
      note: 'Typical of suspensions, where k₀ = k₁ × solubility. Work in mg/mL and days throughout.',
      practice: { unknowns: ['C', 't', 'k0'] },
      stories: {
        C: 'A suspension labelled {C0} loses drug at a constant {k0}. What concentration remains after {t}?',
        t: 'A suspension starts at {C0} and loses {k0}. When has it fallen to {C}?',
        k0: 'A suspension falls from {C0} to {C} in {t}. What is its zero-order rate constant?'
      }
    },
    {
      name: 'First-order loss',
      expr: 'C = C0*exp(-k*t)', tex: 'C = C_0\\,e^{-k t}',
      vars: {
        C: { name: 'content remaining', q: 'ratio', unit: '%' },
        C0: { name: 'initial content', q: 'ratio', unit: '%', value: 100, tex: 'C_0' },
        k: { name: 'first-order rate constant', q: 'rate', unit: '1/day', value: 0.01 },
        t: { name: 'time', q: 'time', unit: 'day', value: 30 }
      },
      note: 'Any concentration or amount unit works for C and C₀, since only their ratio enters. Half-life = 0.693/k, t90 = 0.105/k.',
      practice: { unknowns: ['C', 'k', 't'] },
      stories: {
        C: 'A drug in solution degrades by first-order kinetics with k = {k}. What fraction of the label remains after {t}?',
        k: 'An assay after {t} finds {C} of the label (from {C0}). What is the first-order rate constant?',
        t: 'With k = {k}, how long until the content falls from {C0} to {C}?'
      }
    },
    {
      name: 'Second-order loss (one reactant)',
      expr: '1/C = 1/C0 + k2*t', tex: '\\frac{1}{C} = \\frac{1}{C_0} + k_2\\,t',
      vars: {
        C: { name: 'concentration remaining', q: 'concentration', unit: 'mM' },
        C0: { name: 'initial concentration', q: 'concentration', unit: 'mM', value: 10, tex: 'C_0' },
        k2: { name: 'second-order rate constant', q: 'rateconst2', unit: '1/(M·min)', value: 0.05, tex: 'k_2' },
        t: { name: 'time', q: 'time', unit: 'h', value: 24 }
      },
      note: 'For a reaction of the drug with itself (such as dimerisation in a concentrated solution), rate = k₂C². More concentrated solutions degrade proportionally faster.',
      practice: { unknowns: ['C', 't'] },
      stories: {
        C: 'A drug dimerises in solution with k₂ = {k2}. Starting at {C0}, what remains after {t}?',
        t: 'A drug at {C0} dimerises with k₂ = {k2}. When has it fallen to {C}?'
      }
    },
    {
      name: 'Shelf life for second-order loss',
      expr: 't90 = 1/(9*k2*C0)', tex: 't_{90} = \\frac{1}{9\\,k_2\\,C_0}',
      vars: {
        t90: { name: 'time to 90 % of the starting concentration', q: 'time', unit: 'h', tex: 't_{90}' },
        k2: { name: 'second-order rate constant', q: 'rateconst2', unit: '1/(M·min)', value: 0.05, tex: 'k_2' },
        C0: { name: 'initial concentration', q: 'concentration', unit: 'mM', value: 10, tex: 'C_0' }
      },
      note: 'From 1/(0.9 C₀) = 1/C₀ + k₂ t90. Doubling the concentration halves the shelf life — unlike first order.',
      practice: { unknowns: ['t90', 'C0'] },
      stories: {
        t90: 'A drug dimerises with k₂ = {k2}. What is the shelf life of a {C0} solution?',
        C0: 'A solution must keep a shelf life of {t90}; the drug dimerises with k₂ = {k2}. What is the highest concentration allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'Which order fits?',
      q: 'A solution is assayed at 0, 10, 20, 40 and 60 days: 100.0, 90.5, 81.9, 67.0 and 54.9 % of label. Find the order and the rate constant.',
      steps: [
        'Zero order? The loss per 10 days is 9.5, 8.6, then 7.5 and 6.1 — it shrinks. Not constant: not zero order.',
        'Second order? $1/C \\times 1000$ = 10.00, 11.05, 12.21, 14.92, 18.22: the steps per 10 days grow (1.05, 1.16, 1.36, 1.65). Not second order.',
        'First order? $\\ln C$ = 4.605, 4.505, 4.405, 4.205, 4.005: exactly −0.100 per 10 days. A straight line.',
        '$k = 0.100/10 = 0.010$ per day; $t_{90} = 0.105/0.010 = 10.5$ days.'
      ],
      a: 'First order, k = 0.010 per day (t90 ≈ 10.5 days).'
    },
    {
      title: 'Why early data cannot tell the orders apart',
      q: 'Two products both have $t_{90}$ = 12 months, one degrading by zero order and one by first order. Compare their contents at 6, 24 and 36 months.',
      steps: [
        'Zero order: $C = 100 - 10\\,t/12$: 95.0 %, 80.0 %, 70.0 %.',
        'First order: $k = 0.105/12$ per month, $C = 100\\,e^{-kt}$: 94.87 %, 81.0 %, 72.9 %.',
        'At 6 months they differ by 0.13 % of label — invisible with an assay precision of about 1 %. Only far beyond $t_{90}$ do they separate.',
        'That is why stress studies push degradation well past 10 %, and why real-time data at the storage condition, not the choice of model, settle the shelf life.'
      ],
      a: '95.0 against 94.9 % at 6 months; 80.0 against 81.0 % at 24; 70.0 against 72.9 % at 36.'
    }
  ],
  quiz: [
    { q: 'A plot of ln C against time is a straight line. The reaction is…', choices: ['zero order', 'first order', 'second order', 'of any order'], a: 1, why: 'Only first order gives ln C = ln C₀ − kt. Zero order is straight in C, second order in 1/C.' },
    { q: 'A first-order rate constant is 0.02 per month. What is the half-life in months?', answer: 34.7, unit: 'month', why: 't½ = 0.693/0.02 = 34.7 months (and t90 = 0.105/0.02 = 5.3 months).' },
    { q: 'For a zero-order reaction, doubling the starting concentration…', choices: ['halves t90', 'leaves t90 unchanged', 'doubles t90', 'quadruples t90'], a: 2, why: 't90 = 0.1 C₀/k₀: twice the drug takes twice as long to lose 10 % at a fixed rate per day.' },
    { q: 'Over the first 5 % of degradation, zero- and first-order models fitted to the same data give practically the same line.', a: true, why: 'e^(−x) ≈ 1 − x for small x: the curves differ by a fraction of a per cent, less than assay noise.' },
    { q: 'Ester hydrolysis in water needs a water molecule, yet it is observed as first order because…', choices: ['water does not take part', 'water is in huge excess (55 mol/L), so its concentration stays constant', 'the reaction happens only in the solid', 'first order is assumed by convention'], a: 1, why: 'With [H₂O] constant, rate = k₂[H₂O][drug] = k_obs[drug]: pseudo-first order.' }
  ],
  problems: [
    { q: 'A drug solution loses 8 % of its content in 6 months by first-order kinetics. What is its shelf life (t90) in months?', answer: 7.58, unit: 'month', tol: 0.02, steps: ['$k = -\\ln(0.92)/6 = 0.01390$ per month.', '$t_{90} = 0.1054/0.01390 = 7.6$ months.'] }
  ],
  applications: [
    'Fit rate constants from several temperatures and extrapolate them in [the stability calculator](#/tools/formulation/stability).',
    'Choosing the shelf-life formula for solutions (first order), suspensions (zero order) and concentrated solutions (sometimes second order).',
    'Fitting stability data and deciding how far extrapolation can be trusted.',
    'Setting in-use lives for reconstituted products and infusions.',
    'Describing drug release from modified-release products with the same mathematics.'
  ],
  history: 'Ludwig Wilhelmy measured the first reaction rate (the inversion of sucrose, first order) in 1850; Guldberg and Waage stated the law of mass action in 1864. The ideas entered pharmacy through the stability studies of Garrett, Higuchi and others in the 1950s.',
  sim: 'sol-order'
},

{
  id: 'stability-testing', parent: 'stability-topic', title: 'ICH stability testing', level: 2,
  short: 'Before a medicine is approved, batches are stored for months to years at set temperatures and humidities and tested at fixed times. The ICH guidelines set the conditions — 25 °C/60 % RH long term, 40 °C/75 % RH accelerated — and the statistics that turn the data into a shelf life.',
  keywords: ['stability testing', 'ICH Q1A', 'ICH Q1E', 'long-term', 'accelerated', 'intermediate', 'climatic zones', 'relative humidity', 'significant change', 'shelf life', 're-test period', 'mean kinetic temperature', 'bracketing', 'matrixing', 'in-use stability', 'ongoing stability', 'temperature excursion'],
  prereq: ['shelf-life', 'reaction-order', 'degradation-pathways'],
  related: ['photostability', 'packaging', 'quality-control', 'regulation-approval', 'analytical-methods', 'biologics-formulation', 'math:linear-regression'],
  body: `
Predictions from kinetics are only a start. Before a medicine is approved its manufacturer must show, with real batches in their real packs, how quality changes with time under defined temperature, humidity and light — and from those data set a **shelf life** (for a product) or a **re-test period** (for a drug substance), with storage instructions. The rules were harmonised for the United States, Europe and Japan by the ICH, in **ICH Q1A(R2)** (2003) and its companions.

### The standard conditions
| Study | Condition | Minimum data at submission |
|---|---|---|
| long term | 25 °C ± 2 °C / 60 % RH ± 5 % (or 30 °C / 65 % RH) | 12 months |
| intermediate | 30 °C ± 2 °C / 65 % RH ± 5 % | 6 months (when needed) |
| accelerated | 40 °C ± 2 °C / 75 % RH ± 5 % | 6 months |
| refrigerated product | 5 °C ± 3 °C long term; 25 °C / 60 % RH accelerated | 12 and 6 months |
| frozen product | −20 °C ± 5 °C | 12 months |

Samples are tested every 3 months in the first year, every 6 months in the second and yearly after that (0, 3, 6, 9, 12, 18, 24, 36 months), and at 0, 3 and 6 months under accelerated conditions. Data come from at least **three primary batches**, at least two of them of pilot scale or larger, made by the intended process and packed in the container proposed for marketing. The tests cover everything that could change: assay, degradation products, dissolution, appearance, water content, pH, microbial quality, and for sterile products container integrity.

A **significant change** under accelerated conditions — a 5 % fall in assay, a degradation product above its limit, failed dissolution, pH or appearance — triggers the intermediate study at 30 °C/65 % RH and limits how far the data may be extrapolated.

### Climatic zones
The world is divided into zones for long-term testing: I temperate (21 °C/45 % RH), II subtropical and Mediterranean (25 °C/60 % RH), III hot and dry (30 °C/35 % RH), IVA hot and humid (30 °C/65 % RH) and IVB hot and very humid (30 °C/75 % RH). A product for Brazil, India or West Africa must be tested at 30 °C with the humidity of its zone, which often demands a better moisture barrier ([[packaging]]).

### From data to shelf life
**ICH Q1E** (2003) sets the statistics. For an attribute that falls with time, a regression line is fitted, and the shelf life is where the **one-sided 95 % confidence limit** of the mean line — not the line itself — meets the acceptance criterion. Batches may be pooled when their slopes and intercepts agree. Extrapolation beyond the real-time data is allowed only modestly — typically up to twice the period covered, and not more than 12 months beyond it — when the accelerated data show no significant change. The claim is then confirmed as the long-term study continues, and after approval at least one batch a year enters an **ongoing stability** programme.

### Beyond the core study
- **Photostability** (ICH Q1B, 1996) — see [[photostability]].
- **Bracketing and matrixing** (Q1D, 2002) test only the extreme strengths or pack sizes, or a subset of time points.
- **Biotechnological products** (Q5C, 1995) need tests of potency and aggregation, and are rarely predictable by Arrhenius ([[biologics-formulation]]).
- **In-use stability**: how long a multi-dose bottle, eye drop or reconstituted powder keeps once opened.
- **Temperature excursions** in storage and transport are judged with the **mean kinetic temperature** (MKT): the single temperature that would cause the same total degradation as the real, fluctuating history. It weights warm periods more than their share of time, so it always lies above the arithmetic mean.

> [!note] At the time of writing, ICH was consolidating Q1A–Q1F and Q5C into a single revised Q1 guideline; the principles above are unchanged, but details should be checked in the current text.
`,
  ideas: [
    'Stability studies store real batches in their marketed pack at defined conditions and test them at fixed intervals.',
    'ICH conditions: long term 25 °C/60 % RH (or 30 °C/65–75 % RH for hot zones), accelerated 40 °C/75 % RH for 6 months.',
    'A significant change at 40 °C/75 % RH triggers intermediate testing and limits extrapolation.',
    'Shelf life is set where the 95 % confidence limit of the regression line crosses the specification (ICH Q1E).',
    'The mean kinetic temperature summarises a fluctuating temperature history by its effect on degradation.'
  ],
  pitfalls: [
    'Six months at 40 °C proves a two-year shelf life — Accelerated data support a claim and limit extrapolation, but the shelf life must be confirmed by real-time data at the storage condition.',
    'The shelf life is where the fitted line crosses the limit — It is where the lower 95 % confidence bound crosses it, which is earlier, especially with few or scattered data points.',
    'The average temperature is what counts for degradation — Reaction rates rise exponentially with temperature, so hot spells count for more than their share of time; the mean kinetic temperature captures this.'
  ],
  formulas: [
    {
      name: 'Mean kinetic temperature (two storage temperatures)',
      expr: 'Tk = (Ea/R)/(-ln(f*exp(-Ea/(R*T1)) + (1 - f)*exp(-Ea/(R*T2))))', tex: 'T_K = \\frac{E_a/R}{-\\ln\\left[f\\,e^{-E_a/RT_1} + (1 - f)\\,e^{-E_a/RT_2}\\right]}',
      vars: {
        Tk: { name: 'mean kinetic temperature', q: 'temperature', unit: '°C', tex: 'T_K' },
        Ea: { name: 'activation energy (conventionally 83.144 kJ/mol)', q: 'molarenergy', unit: 'kJ/mol', value: 83.144, tex: 'E_a' },
        R: { const: 'R' },
        f: { name: 'fraction of the time spent at T₁', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        T1: { name: 'first temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        T2: { name: 'second temperature', q: 'temperature', unit: '°C', value: 30, tex: 'T_2' }
      },
      note: 'Haynes\' formula with two temperatures; for many readings, average e^(−Ea/RT) over all of them. The convention Ea/R = 10 000 K (83.144 kJ/mol) is used by pharmacopoeias for MKT.',
      practice: { unknowns: ['Tk', 'T2'] },
      stories: {
        Tk: 'A store is at {T1} for {f} of the time and at {T2} for the rest. What is its mean kinetic temperature?',
        T2: 'A product spends {f} of its time at {T1}. How warm may the rest of the time be for the mean kinetic temperature to stay at {Tk}?'
      }
    },
    {
      name: 'Shelf life from a linear loss of assay',
      expr: 'ts = (A0 - L)/b', tex: 't_s = \\frac{A_0 - L}{b}',
      vars: {
        ts: { name: 'time for the fitted line to reach the limit', q: false, unit: 'month', tex: 't_s' },
        A0: { name: 'initial assay (intercept)', q: false, unit: '% of label', value: 100.5, tex: 'A_0' },
        L: { name: 'lower specification limit', q: false, unit: '% of label', value: 95.0 },
        b: { name: 'rate of loss (slope)', q: false, unit: '% per month', value: 0.15 }
      },
      note: 'The time at which the fitted mean line crosses the limit. ICH Q1E uses the lower one-sided 95 % confidence bound of the line instead, which gives a shorter time.',
      practice: { unknowns: ['ts', 'b'] },
      stories: {
        ts: 'A product starts at {A0}, loses {b} and must stay above {L}. When does the fitted line reach the limit?',
        b: 'A product starting at {A0} must stay above {L} for {ts}. What is the largest rate of loss allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'A pharmacy without air conditioning',
      q: 'A store room is at 20 °C for half the year and 30 °C for the other half. What is its mean kinetic temperature?',
      steps: [
        'With $E_a/R = 10\\,000$ K: $e^{-10000/293.15} = 1.53\\times10^{-15}$ and $e^{-10000/303.15} = 4.71\\times10^{-15}$.',
        'Mean: $3.12\\times10^{-15}$; $-\\ln(3.12\\times10^{-15}) = 33.40$.',
        '$T_K = 10\\,000/33.40 = 299.4$ K = 26.3 °C — above the arithmetic mean of 25 °C and above a "store below 25 °C" label.',
        'One month a year at 40 °C, the rest at 25 °C, gives an MKT of 27.6 °C: a single hot month costs as much as more than two degrees all year round.'
      ],
      a: 'About 26.3 °C.'
    },
    {
      title: 'Turning stability data into a claim',
      q: 'Twelve months of long-term data on three batches give a pooled regression: intercept 100.5 % of label, slope −0.15 % per month; the specification is 95.0–105.0 %. There is no significant change at 40 °C/75 % RH. What shelf life could be claimed?',
      steps: [
        'Fitted line reaches 95.0 % at $(100.5 - 95.0)/0.15 = 36.7$ months.',
        'The lower 95 % confidence bound reaches it earlier — with only 12 months of data, perhaps around 30 months.',
        'But Q1E allows extrapolation to at most twice the real-time period and no more than 12 months beyond it: 24 months.',
        'Claim 24 months now; extend it later as 24- and 36-month data arrive.'
      ],
      a: 'A 24-month shelf life, limited by the extrapolation rule rather than by the chemistry.'
    }
  ],
  quiz: [
    { q: 'What are the ICH accelerated storage conditions for a product intended for room-temperature storage?', choices: ['25 °C / 60 % RH', '30 °C / 65 % RH', '40 °C / 75 % RH', '50 °C / 90 % RH'], a: 2, why: 'Accelerated: 40 °C ± 2 °C / 75 % RH ± 5 % for 6 months. 25/60 is long term, 30/65 intermediate.' },
    { q: 'In the first year of a long-term study, samples are usually tested every…', choices: ['month', '3 months', '6 months', '12 months'], a: 1, why: 'Every 3 months in year one, every 6 months in year two, then yearly.' },
    { q: 'A product spends 90 % of the year at 25 °C and 10 % at 40 °C. Its mean kinetic temperature is below 26.5 °C.', a: false, why: 'MKT ≈ 28.0 °C: warm periods count for much more than their share of time, because rates rise exponentially with temperature.' },
    { q: 'By ICH Q1E, the shelf life is where…', choices: ['the fitted line crosses the specification', 'the lower 95 % confidence bound of the mean line crosses the specification', 'the first result falls out of specification', 'half the drug is gone'], a: 1, why: 'Using the confidence bound builds in the uncertainty of the regression; fewer or noisier data give a shorter shelf life.' },
    { q: 'A product sold in a hot, very humid country (zone IVB) should be tested long term at…', choices: ['25 °C / 60 % RH', '30 °C / 35 % RH', '30 °C / 75 % RH', '40 °C / 75 % RH'], a: 2, why: 'Zone IVB long-term conditions are 30 °C/75 % RH; they often require a better moisture barrier than a temperate-climate pack.' }
  ],
  problems: [
    { q: 'An assay falls linearly from 101.0 % of label at 0.25 % per month, and the lower limit is 95.0 %. When does the fitted line reach the limit (months)?', answer: 24, unit: 'month', tol: 0.01, steps: ['$t = (101.0 - 95.0)/0.25 = 24$ months — before allowing for the confidence bound.'] }
  ],
  applications: [
    'Turn accelerated data into a shelf life, and monthly temperatures into a mean kinetic temperature, in [the stability calculator](#/tools/formulation/stability).',
    'Setting and extending shelf lives and storage statements for new and generic medicines.',
    'Choosing packs and conditions for hot and humid climates.',
    'Judging temperature excursions in warehouses, pharmacies and transport with the mean kinetic temperature.',
    'Ongoing stability monitoring of marketed batches under good manufacturing practice ([[gmp]]).'
  ],
  history: 'Stability testing was harmonised by the International Council for Harmonisation (founded 1990): Q1A appeared in 1993 and its second revision in 2003, with Q1B (1996), Q1D (2002) and Q1E (2003). J. D. Haynes proposed the mean kinetic temperature in 1971; the WHO stability guideline of 2009 includes long-term conditions for zone IVB (30 °C/75 % RH).',
  sim: ['ref-stability', 'sol-order']
},

{
  id: 'photostability', parent: 'stability-topic', title: 'Light, oxygen and moisture', level: 2,
  short: 'Three things in the air around a medicine drive most of its decay besides heat: light, which breaks bonds when it is absorbed; oxygen, which feeds radical chain reactions; and water vapour, which dissolves, hydrolyses and softens solids. Each is measured, tested (ICH Q1B for light) and kept out.',
  keywords: ['photostability', 'photodegradation', 'ICH Q1B', 'lux hours', 'UV-A', 'amber glass', 'light-resistant container', 'quantum yield', 'oxygen', 'headspace', 'nitrogen overlay', 'dissolved oxygen', 'moisture', 'relative humidity', 'humidity-corrected Arrhenius', 'ASAP', 'deliquescence', 'desiccant', 'nifedipine', 'nitroprusside'],
  prereq: ['degradation-pathways', 'shelf-life', 'physics:photon', 'chemistry:ideal-gas-law'],
  related: ['packaging', 'stability-testing', 'excipient-compatibility', 'tablet-coating', 'capsules', 'chemistry:beer-lambert', 'physics:em-spectrum'],
  body: `
### Light
Light can only change a molecule it is absorbed by (the Grotthuss–Draper law), so the first question is the drug's absorption spectrum. Each absorbed photon carries an energy per mole of

$$E_m = \\frac{N_A\\,h\\,c}{\\lambda}$$

— 342 kJ/mol at 350 nm in the UV-A, 266 kJ/mol at 450 nm in the blue — comparable to the energy of many single bonds ([[physics:photon|the photon]]). An excited molecule may break a bond, react with oxygen, or pass its energy to oxygen to make highly reactive singlet oxygen; the fraction of absorbed photons that end in a reaction is the **quantum yield**, often 0.001–0.5. A colourless drug that absorbs nothing above 300 nm is untouched by daylight through window glass — unless a coloured excipient or impurity absorbs the light and passes the energy on (photosensitisation).

Well-known light-sensitive medicines include nifedipine and related dihydropyridines (yellow; they lose activity within hours in solution in daylight), sodium nitroprusside infusions (protected with opaque covers because they release cyanide as they photolyse), amphotericin B, furosemide, and vitamins A, B₂ (riboflavin) and B₁₂.

**ICH Q1B** (1996) sets the test. After forced exposure to find the pathways, the confirmatory study exposes the drug and product to **at least 1.2 million lux·hours of visible light and 200 W·h/m² of near-UV** (320–400 nm), from either an artificial-daylight source or a combination of cool-white and near-UV lamps, with foil-wrapped dark controls alongside. Testing moves outwards — the substance, the product outside its pack, in its immediate pack, in its marketing pack — until the result is acceptable, and the label then says, if needed, "protect from light".

Protection: **amber glass**, which cuts most light below about 450–500 nm; opaque plastic; cartons; aluminium blisters; film coatings and capsule shells coloured with titanium dioxide and iron oxides ([[tablet-coating]]); light-protective infusion bags and lines.

### Oxygen
Autoxidation ([[degradation-pathways]]) needs oxygen, and there is more of it than one might think. Air-saturated water holds about 8 mg/L (0.25 mmol/L) at 25 °C, but the headspace above a liquid usually holds far more: 5 mL of air contains about 43 µmol of $\\ce{O2}$ ([[chemistry:ideal-gas-law|ideal gas law]]) — enough to oxidise 13 mg of a drug of molar mass 300. So oxygen-sensitive injections are sparged and filled under nitrogen or argon to a residual headspace oxygen of a few per cent or less, sealed in glass (most plastics let oxygen through), and given antioxidants and chelators. Solid products can use oxygen-scavenging sachets or closures.

### Moisture
Water is a reactant (hydrolysis), a solvent for reactions in the thin film adsorbed on solids, and a plasticiser that lowers the glass transition of amorphous material ([[solid-state]]). For solid products the rate of degradation often rises exponentially with relative humidity. The **humidity-corrected Arrhenius equation** used in accelerated stability assessment programmes (ASAP, Waterman, 2007) adds a humidity term:

$$\\ln k = \\ln A - \\frac{E_a}{RT} + B \\cdot \\mathrm{RH}$$

with $B$ typically 0–0.10 per % RH. With $B$ = 0.04, each extra 10 % RH multiplies the rate by $e^{0.4} = 1.5$. Two to four weeks at several combinations of 50–80 °C and 10–75 % RH give both $E_a$ and $B$, and predict the shelf life in a given pack and climate. Other moisture effects: **deliquescence** (a soluble solid dissolves in the water it absorbs above a critical humidity), effervescent tablets that react with themselves, gelatin capsule shells that turn brittle when too dry and soft when too wet ([[capsules]]), and tablets that swell, soften or harden.

> [!warn] Keep medicines in their original pack, closed, and stored as the label says — not in a steamy bathroom, a sunny windowsill or a hot car. Tablets or liquids that look changed should not be used; ask a pharmacist.
`,
  ideas: [
    'Light damages only molecules that absorb it; a UV-A photon carries about 340 kJ/mol, enough to break many bonds.',
    'ICH Q1B confirmatory exposure: at least 1.2 million lux·h visible and 200 W·h/m² near-UV, testing outwards through the packs.',
    'The headspace of a vial often holds more oxygen than the drug it contains: nitrogen filling and glass keep it out.',
    'Moisture speeds solid-state degradation roughly exponentially with relative humidity: ln k = ln A − Ea/RT + B·RH.',
    'Protection is chosen to match the threat: amber or opaque packs, coatings, inert gas, antioxidants, desiccants and barrier blisters.'
  ],
  pitfalls: [
    'All light is harmful to all drugs — Only absorbed light acts: a colourless drug absorbing below 300 nm is unaffected by visible light, unless something in the formulation sensitises it.',
    'Amber glass blocks all light — It blocks most UV and blue light but transmits red and much green; a drug absorbing at longer wavelengths may still need an opaque pack or carton.',
    'An antioxidant makes nitrogen filling unnecessary — The headspace oxygen can exceed the antioxidant; removing oxygen and adding antioxidant work together.'
  ],
  formulas: [
    {
      name: 'Energy of a mole of photons',
      expr: 'Em = NA*h*c/lambda', tex: 'E_m = \\frac{N_A\\,h\\,c}{\\lambda}',
      vars: {
        Em: { name: 'energy per mole of photons', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_m' },
        NA: { const: 'NA' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 350, tex: '\\lambda' }
      },
      note: 'Compare with bond energies: C–C about 350 kJ/mol, C–N about 300, C–Cl about 340, O–O in peroxides about 150.',
      practice: { unknowns: ['Em', 'lambda'] },
      stories: {
        Em: 'What energy does a mole of photons of wavelength {lambda} carry?',
        lambda: 'Up to what wavelength can a photon still deliver {Em} per mole?'
      }
    },
    {
      name: 'Light exposure (illuminance × time)',
      expr: 'Hv = Ev*t', tex: 'H_v = E_v\\,t',
      vars: {
        Hv: { name: 'visible light exposure', q: false, unit: 'lx·h', tex: 'H_v' },
        Ev: { name: 'illuminance at the samples', q: false, unit: 'lx', value: 8000, tex: 'E_v' },
        t: { name: 'exposure time', q: false, unit: 'h', value: 150 }
      },
      note: 'ICH Q1B asks for at least 1.2 million lux·hours of visible light and, separately, 200 W·h/m² of near-UV (the same product: irradiance × time).',
      practice: { unknowns: ['Hv', 't'] },
      stories: {
        Hv: 'Samples sit for {t} at {Ev} in a light cabinet. What visible exposure do they receive?',
        t: 'How long must samples stay in a cabinet at {Ev} to receive {Hv}?'
      }
    },
    {
      name: 'Oxygen in a headspace',
      expr: 'n = x*p*V/(R*T)', tex: 'n_{\\ce{O2}} = \\frac{x_{\\ce{O2}}\\,p\\,V}{R\\,T}',
      vars: {
        n: { name: 'oxygen in the headspace', q: 'amount', unit: 'µmol', tex: 'n_{\\ce{O2}}' },
        x: { name: 'oxygen fraction of the headspace gas', q: 'ratio', unit: '%', value: 21, min: 0, max: 100, tex: 'x_{\\ce{O2}}' },
        p: { name: 'pressure', q: 'pressure', unit: 'atm', value: 1 },
        V: { name: 'headspace volume', q: 'volume', unit: 'mL', value: 5 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 }
      },
      note: 'Ideal gas. Air is 21 % oxygen; nitrogen filling typically leaves a few per cent or less.',
      practice: { unknowns: ['n', 'x'] },
      stories: {
        n: 'A vial has {V} of headspace with {x} oxygen at {p} and {T}. How much oxygen does it hold?',
        x: 'A vial has {V} of headspace at {p} and {T}. What oxygen fraction leaves only {n}?'
      }
    },
    {
      name: 'Humidity-corrected Arrhenius (ASAP)',
      expr: 'k2 = k1*exp(Ea/R*(1/T1 - 1/T2) + B*(RH2 - RH1))', tex: 'k_2 = k_1 \\exp\\!\\left[\\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right) + B\\,(\\mathrm{RH}_2 - \\mathrm{RH}_1)\\right]',
      vars: {
        k2: { name: 'rate constant at the storage condition', q: 'rate', unit: '1/month', tex: 'k_2' },
        k1: { name: 'rate constant in the study', q: 'rate', unit: '1/month', value: 0.2, tex: 'k_1' },
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 100, tex: 'E_a' },
        R: { const: 'R' },
        T1: { name: 'study temperature', q: 'temperature', unit: '°C', value: 50, tex: 'T_1' },
        T2: { name: 'storage temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_2' },
        B: { name: 'humidity sensitivity (per % RH)', value: 0.04 },
        RH1: { name: 'study relative humidity (% RH)', value: 75, min: 0, max: 100, tex: '\\mathrm{RH}_1' },
        RH2: { name: 'storage relative humidity (% RH)', value: 60, min: 0, max: 100, tex: '\\mathrm{RH}_2' }
      },
      note: 'RH is the humidity the product itself experiences — inside its pack, which may differ from the room. Temperatures enter in kelvin. t90 = 0.105/k₂ for first-order loss.',
      practice: { unknowns: ['k2', 'B'] },
      stories: {
        k2: 'A tablet degrades with k = {k1} at {T1} and {RH1} % RH (Ea = {Ea}, B = {B}). What is its rate constant at {T2} and {RH2} % RH?',
        B: 'A product degrades with k = {k1} at {T1}/{RH1} % RH and k = {k2} at {T2}/{RH2} % RH (Ea = {Ea}). What is its humidity sensitivity B?'
      }
    }
  ],
  examples: [
    {
      title: 'The oxygen above an injection',
      q: 'A 10 mL vial holds 5 mL of a 1 mg/mL solution of an oxidisable drug (molar mass 300 g/mol), with 5 mL of air above it at 25 °C. Compare the oxygen with the drug, with and without a nitrogen overlay leaving 2 % oxygen.',
      steps: [
        'Drug: 5 mg / 300 g/mol = 16.7 µmol.',
        'Headspace oxygen: $n = 0.21 \\times 101\\,325 \\times 5\\times10^{-6}/(8.314 \\times 298.15) = 4.29\\times10^{-5}$ mol = 42.9 µmol — 2.6 times the drug.',
        'Dissolved oxygen: about 0.26 mmol/L × 5 mL = 1.3 µmol — small beside the headspace.',
        'Under nitrogen at 2 % oxygen: 4.1 µmol — still a quarter of the drug on paper, but together with an antioxidant, a chelator and low permeability glass, little ever reacts.'
      ],
      a: 'Air in the headspace holds about 43 µmol of oxygen, 2.6 times the drug; a 2 % overlay cuts it to about 4 µmol.'
    },
    {
      title: 'Humidity and the climatic zone',
      q: 'A tablet in a permeable blister degrades with k = 0.20 per month at 50 °C/75 % RH; Ea = 100 kJ/mol and B = 0.04 per % RH. Predict t90 at 25 °C/60 % RH, 30 °C/65 % RH and 30 °C/75 % RH (humidity inside the blister equal to outside).',
      steps: [
        '25 °C/60 %: $k = 0.20\\,\\exp[12\\,027 \\times (1/323.15 - 1/298.15) + 0.04 \\times (60 - 75)] = 0.20\\,e^{-3.121 - 0.600} = 0.0048$ per month; $t_{90} = 22$ months.',
        '30 °C/65 %: $k = 0.20\\,e^{-2.459 - 0.400} = 0.0115$ per month; $t_{90} = 9.2$ months.',
        '30 °C/75 %: $k = 0.20\\,e^{-2.459} = 0.0172$ per month; $t_{90} = 6.1$ months.',
        'The same tablet that could be sold for two years in a temperate climate would last six months in zone IVB — unless a better moisture barrier ([[packaging]]) keeps the humidity inside the pack low.'
      ],
      a: 'About 22, 9 and 6 months: humidity decides the pack.'
    }
  ],
  quiz: [
    { q: 'What energy (kJ/mol) does a mole of 400 nm photons carry?', answer: 299, unit: 'kJ/mol', why: 'E = N_A h c/λ = 0.1196 J·m/mol / 400×10⁻⁹ m = 2.99×10⁵ J/mol.' },
    { q: 'ICH Q1B confirmatory photostability testing requires at least…', choices: ['1.2 million lux·h visible and 200 W·h/m² near-UV', '1.2 thousand lux·h and 20 W·h/m²', 'one week in direct sunlight', '6 months at 40 °C in the light'], a: 0, why: 'The minimum exposures are 1.2 × 10⁶ lux·h of visible light and 200 W·h/m² of near-UV (320–400 nm).' },
    { q: 'A drug that absorbs no light above 290 nm can still photodegrade in a tablet if…', choices: ['the tablet is white', 'an excipient, dye or impurity absorbs the light and passes the energy to the drug or to oxygen', 'the tablet is stored in the dark', 'it is in amber glass'], a: 1, why: 'Photosensitisers (dyes, riboflavin, some impurities) absorb light and transfer energy, often by making singlet oxygen.' },
    { q: 'With B = 0.05 per % RH in the humidity-corrected Arrhenius equation, raising the humidity from 60 to 75 % RH multiplies the degradation rate by about…', choices: ['1.1', '1.5', '2.1', '15'], a: 2, why: 'e^(0.05 × 15) = e^0.75 = 2.1.' },
    { q: 'Filling a vial under nitrogen matters because the headspace can contain more oxygen than there is drug in the solution.', a: true, why: 'A few millilitres of air hold tens of micromoles of oxygen, often more than the drug in a dilute injection.' }
  ],
  problems: [
    { q: 'A light cabinet delivers 6000 lux at the samples. How many hours are needed for the ICH Q1B visible exposure of 1.2 million lux·h?', answer: 200, unit: 'h', tol: 0.01, steps: ['$t = 1.2\\times10^6/6000 = 200$ h — just over 8 days.'] }
  ],
  applications: [
    'Deciding whether a product needs amber glass, an opaque pack, a carton or a coloured coating.',
    'Nitrogen filling and antioxidant systems for oxygen-sensitive injections.',
    'Predicting shelf life in hot, humid climates and choosing moisture-protective packs and desiccants.',
    'Handling light-sensitive infusions with protective bags and lines.'
  ],
  history: 'Photochemistry\'s basic law was stated by Grotthuss (1817) and Draper (1842); Stark and Einstein added that each absorbed photon activates one molecule. ICH Q1B standardised photostability testing in 1996, and Kenneth Waterman\'s humidity-corrected Arrhenius approach (2007) made short temperature-and-humidity studies predictive for solid products.',
  sim: 'sol-light'
},

{
  id: 'packaging', parent: 'stability-topic', title: 'Packaging and container closure', level: 2,
  short: 'The pack is part of the medicine. Glass, plastics, rubber and foil keep out light, moisture, oxygen and microbes, deliver the dose, protect children and show tampering — but they can also let water in, absorb the drug or leach substances into it.',
  keywords: ['packaging', 'container closure system', 'primary packaging', 'glass type I', 'borosilicate', 'delamination', 'blister', 'PVC', 'PVdC', 'Alu/Alu', 'water vapour transmission rate', 'WVTR', 'desiccant', 'extractables', 'leachables', 'sorption', 'container closure integrity', 'child-resistant', 'tamper-evident', 'serialisation'],
  prereq: ['photostability', 'stability-testing', 'degradation-pathways'],
  related: ['injectable-formulation', 'ophthalmic', 'partition-logp', 'falsified-medicines', 'biologics-formulation', 'sterilisation-methods', 'lyophilisation'],
  body: `
A medicine is approved together with its **container closure system**: the tablet in its blister, the injection in its vial with its stopper and cap. Change the pack and the stability studies must be repeated. The pack has to protect (from light, moisture, oxygen, microbes and breakage), contain without reacting, identify, help the patient take the right dose, keep children out and show tampering.

### Glass
Glass is impermeable and inert enough for most injections. The pharmacopoeias recognise three types:

| Type | Glass | Typical use |
|---|---|---|
| I | borosilicate, highly resistant | injections, including aqueous solutions of any pH |
| II | soda-lime, surface-treated to remove alkali | acidic and neutral aqueous products where suitable |
| III | soda-lime | oral liquids and solids, some non-aqueous injections |

Even type I glass is not perfectly inert: alkaline solutions, citrate and phosphate buffers, and terminal sterilisation can corrode the inner surface until thin glass flakes appear — **delamination**, behind several recalls of injectable products in the early 2010s. Amber glass adds light protection ([[photostability]]).

### Plastics and elastomers
Plastics are light and unbreakable but permeable to water vapour and oxygen, and they can take up or give off substances:
- **Sorption**: lipophilic drugs dissolve into PVC — glyceryl trinitrate, diazepam and insulin are partly lost to PVC infusion bags and lines, which is why some are given through polyethylene sets ([[partition-logp]]).
- **Leachables**: plasticisers, antioxidants, oligomers and rubber additives can migrate into the product. **Extractables** are what can be forced out with aggressive solvents; **leachables** are what actually appears under real conditions. Daily exposure is compared with toxicological thresholds — for example 1.5 µg a day for a potentially mutagenic compound (ICH M7, 2014).
- **Proteins** are sensitive to silicone oil (the lubricant of prefilled syringes), tungsten residues from needle forming, and interfaces — all of which can seed aggregation ([[biologics-formulation]]).

### Keeping moisture out
A blister is only as good as its film. The water vapour transmission rate (WVTR) of blister materials spans three orders of magnitude:

| Blister film | Relative barrier | WVTR, g/(m²·day) at 38 °C/90 % RH (order of magnitude) |
|---|---|---|
| PVC (250 µm) | poor | about 3 |
| PVC coated with PVdC | moderate | about 0.5 |
| PVC laminated with PCTFE | good | about 0.05 |
| cold-formed aluminium (Alu/Alu) | practically complete | below 0.01 |

The water that enters is roughly $W = \\mathrm{WVTR} \\times A \\times t$ — with the WVTR for the actual storage conditions, several times lower than at the test's 38 °C/90 % RH. Bottles can add a **desiccant** (silica gel, molecular sieve) in a canister or the cap; it buys time until its capacity is used up, especially once the patient starts opening the bottle.

### Sterile products
For injections the closure must keep microbes out for the whole shelf life: **container closure integrity** is tested by deterministic methods such as vacuum decay, helium leak or laser headspace analysis (USP <1207>, 2016) rather than dye ingress alone ([[sterilisation-methods]]).

### Safety features
- **Child-resistant** closures and blisters (ISO 8317 for reclosable packs; required for many medicines in the US since the Poison Prevention Packaging Act of 1970) greatly reduced child poisonings.
- **Tamper-evident** seals became standard after the 1982 Chicago poisonings, in which capsules of a pain reliever on shop shelves were laced with cyanide.
- **Serialisation**: a unique identifier on each pack, checked before dispensing — required in the European Union since February 2019 under the Falsified Medicines Directive (2011/62/EU), with a similar system in the US under the Drug Supply Chain Security Act (2013) ([[falsified-medicines]]).

> [!tip] Keep tablets in their blister until the moment they are taken: a tablet pushed out into a weekly organiser loses the protection the stability studies relied on. A pharmacist can advise which medicines are unsuitable for such organisers.
`,
  ideas: [
    'The container closure system is approved with the product; changing it means new stability data.',
    'Type I borosilicate glass for injections, surface-treated type II and soda-lime type III for less demanding uses.',
    'Plastics are permeable and can absorb drugs or release leachables; exposure is compared with toxicological thresholds.',
    'Blister barriers differ by orders of magnitude in water vapour transmission: PVC < PVC/PVdC < PVC/PCTFE < Alu/Alu.',
    'Packs also protect people: child-resistant closures, tamper evidence and serialisation against falsified medicines.'
  ],
  pitfalls: [
    'Any bottle or blister will do if the tablet is stable — The shelf life was proven in a specific pack; a poorer moisture or light barrier can shorten it drastically, especially in hot, humid climates.',
    'Glass never reacts with its contents — Alkaline and some buffered solutions attack even type I glass, leaching alkali or causing delamination; the glass is chosen and tested for each product.',
    'A plastic infusion bag holds exactly the drug that was added — Lipophilic drugs can partition into PVC and its plasticiser, lowering the dose delivered.'
  ],
  formulas: [
    {
      name: 'Water entering through a blister',
      expr: 'W = 0.1*WVTR*A*t', tex: 'W = 0.1\\,\\mathrm{WVTR}\\,A\\,t',
      vars: {
        W: { name: 'water gained', q: false, unit: 'mg' },
        WVTR: { name: 'water vapour transmission rate at the storage condition', q: false, unit: 'g/(m²·day)', value: 0.3, tex: '\\mathrm{WVTR}' },
        A: { name: 'area of film per cavity', q: false, unit: 'cm²', value: 3 },
        t: { name: 'time', q: false, unit: 'day', value: 730 }
      },
      note: 'The factor 0.1 converts g/(m²·day) × cm² into mg/day. Use a WVTR measured or scaled to the real storage temperature and humidity, and remember that the tablet and any desiccant compete for the water.',
      practice: { unknowns: ['W', 't'] },
      stories: {
        W: 'A blister cavity has {A} of film with a WVTR of {WVTR} at the storage condition. How much water enters in {t}?',
        t: 'A tablet can take up {W} of water before it fails. How long does a cavity of {A} with WVTR {WVTR} protect it?'
      }
    },
    {
      name: 'Daily exposure to a leachable',
      expr: 'E = C*Vd', tex: 'E = C\\,V_\\text{day}',
      vars: {
        E: { name: 'daily exposure to the leachable', q: false, unit: 'µg/day' },
        C: { name: 'concentration of the leachable in the product', q: false, unit: 'µg/mL', value: 0.05 },
        Vd: { name: 'maximum daily volume of product', q: false, unit: 'mL/day', value: 10, tex: 'V_\\text{day}' }
      },
      note: 'The result is compared with a threshold set by toxicologists for the route and duration — for a potentially mutagenic leachable over a lifetime, 1.5 µg/day (ICH M7).',
      practice: { unknowns: ['E', 'C'] },
      stories: {
        E: 'An injection contains {C} of a leachable from its stopper; a patient may receive up to {Vd}. What is the daily exposure?',
        C: 'The daily exposure to a leachable must stay below {E} for a product given at up to {Vd}. What is the highest concentration allowed?'
      }
    }
  ],
  examples: [
    {
      title: 'PVC or aluminium?',
      q: 'A 300 mg moisture-sensitive tablet fails if it gains more than 2 % water (6 mg). Its blister cavity has 3 cm² of film. At the storage condition, PVC transmits about 0.3 g/(m²·day) and Alu/Alu about 0.005. How long does each protect it?',
      steps: [
        'PVC: $0.1 \\times 0.3 \\times 3 = 0.09$ mg a day, so 6 mg in $6/0.09 = 67$ days.',
        'Alu/Alu: $0.1 \\times 0.005 \\times 3 = 0.0015$ mg a day: 6 mg would take 4000 days — longer than any shelf life.',
        'Over two years PVC would let in 66 mg, eleven times the limit. This tablet needs Alu/Alu, or PVC/PCTFE if the calculation and stability data allow.'
      ],
      a: 'About two months in PVC; practically indefinitely in Alu/Alu.'
    },
    {
      title: 'Is a leachable a concern?',
      q: 'A stopper leaches a compound flagged as potentially mutagenic to 0.05 µg/mL in an injection given at up to 10 mL a day, long term. Compare with the ICH M7 threshold of 1.5 µg/day.',
      steps: [
        '$E = 0.05 \\times 10 = 0.5$ µg/day.',
        'This is a third of 1.5 µg/day, so it would normally be acceptable; if it were above, a better stopper (coated or of another elastomer) or a toxicological justification would be needed.'
      ],
      a: '0.5 µg/day — below the 1.5 µg/day threshold.'
    }
  ],
  quiz: [
    { q: 'Which glass is used for most injections, including aqueous solutions at any pH?', choices: ['type I borosilicate', 'type II treated soda-lime', 'type III soda-lime', 'any clear glass'], a: 0, why: 'Type I borosilicate has the highest hydrolytic resistance; types II and III release more alkali and are limited to less demanding uses.' },
    { q: 'Rank blister films from the poorest to the best moisture barrier.', choices: ['Alu/Alu, PVC/PCTFE, PVC/PVdC, PVC', 'PVC, PVC/PVdC, PVC/PCTFE, Alu/Alu', 'PVC/PVdC, PVC, Alu/Alu, PVC/PCTFE', 'they are all equivalent'], a: 1, why: 'Plain PVC transmits most water; coatings of PVdC and laminates of PCTFE reduce it by roughly one and two orders of magnitude; cold-formed aluminium blocks it almost completely.' },
    { q: 'A cavity with 2 cm² of film at a WVTR of 0.5 g/(m²·day) lets in how much water per day (mg)?', answer: 0.1, unit: 'mg', why: 'W = 0.1 × 0.5 × 2 = 0.1 mg per day.' },
    { q: 'Leachables are the substances that can be forced out of a material with aggressive solvents.', a: false, why: 'Those are extractables. Leachables are the substances that actually migrate into the product under real storage conditions — usually a subset of the extractables.' },
    { q: 'Why can a lipophilic drug infused through PVC tubing reach the patient at a lower dose than intended?', choices: ['PVC reacts with the drug chemically', 'the drug partitions into the PVC and its plasticiser', 'PVC filters out the drug', 'the tubing is too long'], a: 1, why: 'Sorption: lipophilic drugs dissolve into the plastic, especially at slow flow rates, so polyethylene-lined sets are used for them.' }
  ],
  problems: [
    { q: 'A bottle desiccant can take up 150 mg of water. Water enters through the closure at 0.25 mg per day. For how many days does the desiccant protect the tablets (before the bottle is opened)?', answer: 600, unit: 'day', tol: 0.01, steps: ['$150/0.25 = 600$ days — about 20 months, if the bottle stays closed.'] }
  ],
  applications: [
    'Choosing glass, stoppers and syringes for injections and biologics.',
    'Selecting blister films and desiccants for hot, humid markets.',
    'Assessing extractables and leachables for injections, inhalers and eye drops.',
    'Child-resistant, tamper-evident and serialised packs for patient safety.'
  ],
  history: 'The US Poison Prevention Packaging Act of 1970 brought child-resistant closures; the 1982 Chicago capsule poisonings led to US rules for tamper-evident packaging within months. Blister packs spread in Europe from the 1960s, and the EU Falsified Medicines Directive (2011) made a unique identifier on every pack compulsory from 2019.',
  sim: 'sol-light'
},

{
  id: 'excipient-compatibility', parent: 'stability-topic', title: 'Drug–excipient compatibility', level: 3,
  short: 'Excipients are not inert. Reducing sugars brown amines, peroxides in polymers oxidise drugs, basic lubricants speed hydrolysis and turn salts back to free bases, and water carried by excipients drives it all. Compatibility studies find these reactions before a formulation is chosen.',
  keywords: ['excipient compatibility', 'drug–excipient interaction', 'Maillard reaction', 'lactose', 'reducing sugar', 'peroxides', 'povidone', 'polyethylene glycol', 'polysorbate', 'formaldehyde', 'magnesium stearate', 'microenvironmental pH', 'binary mixtures', 'stress testing', 'DSC', 'isothermal microcalorimetry', 'adsorption', 'transesterification'],
  prereq: ['degradation-pathways', 'excipients', 'shelf-life'],
  related: ['ph-solubility', 'photostability', 'solid-state', 'granulation', 'capsules', 'qbd', 'stability-testing'],
  body: `
A tablet is mostly excipients — fillers, binders, disintegrants, lubricants, coatings ([[excipients]]) — often ten or a hundred times the mass of the drug. Each was chosen for a physical job, but each is also a chemical, with its own reactive groups, impurities and water. **Compatibility** studies look for the reactions between them before a formulation is fixed.

### Chemical incompatibilities
- **Maillard reaction.** Primary and secondary amines react with reducing sugars — lactose, glucose, maltodextrin — to form glycosylamines that rearrange and eventually give brown pigments. An amine drug in a lactose tablet may yellow and lose potency; mannitol, microcrystalline cellulose or calcium phosphate avoid the problem. Amorphous lactose (as in spray-dried grades) is more reactive than crystalline.
- **Peroxides.** Povidone, crospovidone, polyethylene glycols and polysorbates carry hydroperoxide impurities, often tens to hundreds of ppm, that oxidise sensitive drugs. Because the peroxide scales with the excipient and not with the drug, **low-dose drugs** are most at risk (the formula below gives the worst case).
- **Aldehydes and acids.** Formaldehyde and formic acid form as polyethylene glycols and polysorbates age, and appear in some starches; they formylate or methylate amines, and cross-link the gelatin of capsule shells so that they dissolve slowly ([[capsules]]).
- **Acid–base effects.** Water adsorbed on a tablet forms a thin film whose **microenvironmental pH** is set by the excipients. Magnesium stearate is slightly alkaline: it speeds the hydrolysis of aspirin and some esters, and can push the salt of a weak base above its pHmax so that it disproportionates to the free base ([[ph-solubility]]). Acidic excipients (citric acid, some coating polymers) attack acid-labile drugs such as the proton-pump inhibitors, which are therefore formulated with an alkaline core and an enteric coat.
- **Transesterification.** Aspirin passes its acetyl group to hydroxyl groups, for example of polyethylene glycol suppository bases.

### Physical interactions
- **Moisture redistribution**: starch (about 12 % water) or microcrystalline cellulose (about 5 %) can pass water to a sensitive drug ([[photostability]]).
- **Adsorption and binding**: drugs adsorb onto talc, magnesium trisilicate or clays, and cationic drugs bind anionic polymers such as croscarmellose sodium, which can slow dissolution.
- **Solid-form changes and eutectics**: granulation water can make hydrates; some mixtures melt below either component ([[solid-state]]).

### How compatibility is screened
Binary mixtures of drug and excipient (1 : 1, or at the ratio of the formulation), with and without a few per cent of added water, are stored for 2–4 weeks at 40–60 °C in open and closed vials, then assayed by HPLC for loss of drug and new degradation products. **Differential scanning calorimetry** gives a fast first look but can mislead, because heating to the melt forces interactions that never occur at room temperature; **isothermal microcalorimetry** detects the tiny heat of slow reactions at storage temperature. Short stress studies are translated to real time with the Arrhenius equation ([[shelf-life]]) — valid only if the same reaction dominates. Finally, the excipients chosen are specified tightly: grades with low peroxide, aldehyde or reducing-sugar levels, from qualified suppliers, as part of [[qbd|quality by design]].

> [!key] Excipients bring reactive groups (reducing sugars), reactive impurities (peroxides, aldehydes, metals), their own pH and their own water. The smaller the dose of drug, the more their impurities matter.
`,
  ideas: [
    'Amines and reducing sugars undergo the Maillard reaction; lactose is the usual culprit.',
    'Peroxide, aldehyde and metal impurities in excipients can degrade drugs, especially low-dose drugs.',
    'Excipients set the microenvironmental pH of the water film in a solid; basic lubricants can speed hydrolysis and salt disproportionation.',
    'Binary-mixture stress studies with added water, analysed by HPLC, are the standard screen; DSC alone can mislead.',
    'Stress-test times translate to storage times through Arrhenius — if the mechanism is unchanged.'
  ],
  pitfalls: [
    'Excipients are inert fillers — They carry reactive groups, impurities, water and their own pH; many stability failures come from an excipient, not the drug alone.',
    'A DSC thermogram with a shifted peak proves incompatibility — Heating to the melt forces contact and reactions that may never happen at room temperature; the finding must be confirmed by isothermal storage and HPLC.',
    'An excipient that worked with one drug is safe with another — Compatibility is specific to the pair: lactose suits most drugs but not primary amines; povidone suits most but not easily oxidised low-dose drugs.'
  ],
  formulas: [
    {
      name: 'Storage time equivalent to a stress test (Arrhenius)',
      expr: 'teq = ts*exp(Ea/R*(1/T1 - 1/T2))', tex: 't_\\text{eq} = t_s \\exp\\!\\left[\\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)\\right]',
      vars: {
        teq: { name: 'equivalent time at the storage temperature', q: 'time', unit: 'mo', tex: 't_\\text{eq}' },
        ts: { name: 'duration of the stress test', q: 'time', unit: 'wk', value: 2, tex: 't_s' },
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 100, tex: 'E_a' },
        R: { const: 'R' },
        T1: { name: 'storage temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_1' },
        T2: { name: 'stress temperature', q: 'temperature', unit: '°C', value: 60, tex: 'T_2' }
      },
      note: 'The time at T₁ that produces the same degradation as t_s at T₂, for the same reaction at both temperatures. Humidity must also match, or be corrected for (see the humidity-corrected Arrhenius equation).',
      practice: { unknowns: ['teq', 'ts'] },
      stories: {
        teq: 'A binary mixture is stressed for {ts} at {T2}. With Ea = {Ea}, how long at {T1} does that represent?',
        ts: 'How long must a mixture be stressed at {T2} (Ea = {Ea}) to represent {teq} at {T1}?'
      }
    },
    {
      name: 'Worst-case oxidation by excipient peroxide',
      expr: 'D = 0.0001*c*mex*Md/(Mp*md)', tex: 'D = 10^{-4}\\,\\frac{c\\,m_\\text{ex}\\,M_d}{M_p\\,m_d}',
      vars: {
        D: { name: 'fraction of the drug that the peroxide could oxidise', q: false, unit: '%' },
        c: { name: 'peroxide content of the excipient (as H₂O₂)', q: false, unit: 'ppm', value: 200 },
        mex: { name: 'mass of excipient per tablet', q: false, unit: 'mg', value: 20, tex: 'm_\\text{ex}' },
        Md: { name: 'molar mass of the drug', q: false, unit: 'g/mol', value: 450, tex: 'M_d' },
        Mp: { name: 'molar mass of hydrogen peroxide', q: false, unit: 'g/mol', value: 34.01, fixed: true, tex: 'M_p' },
        md: { name: 'mass of drug per tablet', q: false, unit: 'mg', value: 5, tex: 'm_d' }
      },
      note: 'Assumes every peroxide molecule oxidises one drug molecule — an upper bound. Real losses are smaller but follow the same scaling: more excipient, more peroxide, less drug → more risk.',
      practice: { unknowns: ['D', 'c'] },
      stories: {
        D: 'A tablet holds {md} of a drug (molar mass {Md}) and {mex} of a binder containing {c} of peroxide. What fraction of the drug could be oxidised at most?',
        c: 'To keep the worst-case oxidation of {md} of drug (molar mass {Md}) below {D} with {mex} of binder, what peroxide level may the binder contain?'
      }
    }
  ],
  examples: [
    {
      title: 'What does two weeks at 60 °C mean?',
      q: 'A drug–excipient mixture shows 0.4 % of a new degradation product after 2 weeks at 60 °C. If the reaction has Ea = 100 kJ/mol, how long at 25 °C does that represent?',
      steps: [
        '$\\exp[100\\,000/8.314 \\times (1/298.15 - 1/333.15)] = \\exp(12\\,027 \\times 3.524\\times10^{-4}) = \\exp(4.238) = 69.3$.',
        '2 weeks × 69.3 = 139 weeks ≈ 32 months.',
        'So 0.4 % after two weeks at 60 °C predicts roughly 0.4 % after 2.7 years at 25 °C — acceptable against a typical 0.5–1 % limit, if the humidity was comparable and the same reaction runs at both temperatures.'
      ],
      a: 'About 32 months at 25 °C.'
    },
    {
      title: 'Peroxide and a low-dose drug',
      q: 'A 5 mg tablet of a drug (molar mass 450 g/mol) contains 20 mg of povidone with 200 ppm peroxide. What fraction of the drug could the peroxide oxidise at worst? And for a 0.5 mg dose?',
      steps: [
        'Peroxide: $200\\times10^{-6} \\times 20$ mg = 0.004 mg = 0.12 µmol. Drug: 5 mg/450 = 11.1 µmol.',
        'Worst case: $0.12/11.1 = 1.1$ % — the formula gives $10^{-4} \\times 200 \\times 20 \\times 450/(34.01 \\times 5) = 1.06$ %.',
        'At 0.5 mg of drug, with the same binder: 10.6 % — a real threat. Low-dose products use low-peroxide grades, less binder, or an antioxidant.'
      ],
      a: 'Up to about 1 % for 5 mg of drug, and about 11 % for 0.5 mg.'
    }
  ],
  quiz: [
    { q: 'A drug with a primary amine turns yellow-brown in tablets. Which excipient is the most likely partner?', choices: ['microcrystalline cellulose', 'lactose', 'magnesium stearate', 'colloidal silica'], a: 1, why: 'Lactose is a reducing sugar; with primary and secondary amines it undergoes the Maillard reaction, giving brown products.' },
    { q: 'A stress study runs 4 weeks at 50 °C. With Ea = 80 kJ/mol, how many weeks at 25 °C does it represent?', answer: 48.6, unit: 'wk', why: '4 × exp[80 000/8.314 × (1/298.15 − 1/323.15)] = 4 × exp(2.497) = 4 × 12.1 = 48.6 weeks.' },
    { q: 'A shifted melting peak for a 1 : 1 drug–excipient mixture in DSC proves they are incompatible at room temperature.', a: false, why: 'DSC heats the mixture through its melt, forcing interactions that may not occur in the solid at 25 °C; it flags possibilities to be checked by isothermal storage and HPLC.' },
    { q: 'Why are low-dose drugs most at risk from peroxide impurities in excipients?', choices: ['they are more reactive molecules', 'the peroxide scales with the (large) mass of excipient, the drug is small, so the ratio of peroxide to drug is high', 'low-dose drugs are always amines', 'peroxides only form in small tablets'], a: 1, why: 'With a fixed ppm of peroxide in each milligram of excipient, a tablet with little drug has far more peroxide per molecule of drug.' },
    { q: 'Magnesium stearate can speed the degradation of aspirin in a tablet because…', choices: ['it is an oxidising agent', 'it is slightly basic, raising the microenvironmental pH and catalysing hydrolysis', 'it absorbs light', 'it contains reducing sugars'], a: 1, why: 'Aspirin hydrolyses faster in the more alkaline film of adsorbed water around a basic lubricant; acidic stabilisers or other lubricants are used instead.' }
  ],
  problems: [
    { q: 'A tablet contains 0.5 mg of a drug (molar mass 400 g/mol) and 30 mg of a binder with 300 ppm peroxide. What is the worst-case fraction of drug oxidised (%)?', answer: 21.2, unit: '%', tol: 0.02, steps: ['$D = 10^{-4} \\times 300 \\times 30 \\times 400/(34.01 \\times 0.5)$.', '$= 360/17.0 = 21$ % — a formulation to change before it is made.'] }
  ],
  applications: [
    'Screening excipients early in formulation development, with binary mixtures and stress conditions.',
    'Choosing lactose-free fillers for amine drugs and low-peroxide grades for oxidisable low-dose drugs.',
    'Setting excipient specifications (peroxide, aldehydes, reducing sugars, water) as critical material attributes.',
    'Investigating stability failures, discoloration and slowed dissolution of capsules.'
  ],
  history: 'Louis-Camille Maillard described the browning reaction of amino acids and sugars in 1912. Peroxides in povidone and polyethylene glycols were recognised as a cause of drug oxidation in the 1990s and 2000s, and excipient impurities became a regular part of quality-by-design risk assessments.'
}

);
