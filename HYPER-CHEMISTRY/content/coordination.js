/* HYPER-CHEMISTRY · content/coordination.js — coordination chemistry: metal ions
 * surrounded by ligands, and why their compounds are coloured and magnetic. */
Hyper.add(

{
  id: 'coordination-compounds', parent: 'coordination', title: 'Coordination compounds and ligands', level: 2,
  short: 'A metal ion bonded to a set of molecules or ions (ligands) that each donate a lone pair. The complex has a definite shape, charge and coordination number, and multidentate ligands such as EDTA hold on especially tightly.',
  keywords: ['coordination compound', 'complex ion', 'ligand', 'coordination number', 'dative bond', 'Lewis acid', 'Lewis base', 'monodentate', 'bidentate', 'chelate', 'chelate effect', 'EDTA', 'Werner', 'cisplatin', 'haemoglobin', 'isomers', 'octahedral', 'square planar'],
  prereq: ['covalent-bonds', 'acid-base-definitions', 'oxidation-numbers'],
  related: ['crystal-field-theory', 'complex-ion-equilibria', 'vsepr', 'stereoisomers', 'gibbs-equilibrium', 'titration-calculations', 'lewis-structures'],
  body: `
A metal ion in water is never bare. A copper(II) ion is surrounded by six water molecules, each bonded to it through a lone pair on its oxygen: the blue ion in copper sulfate solution is $\\ce{[Cu(H2O)6]^2+}$. Molecules or ions that bond to a metal by donating a lone pair are **ligands**; the bond is a dative covalent bond, with the metal ion acting as a Lewis acid (electron-pair acceptor) and the ligand as a Lewis base ([[acid-base-definitions]]). The metal and its ligands form a **complex**, written in square brackets; with its counter-ions it is a **coordination compound**, such as $\\ce{[Co(NH3)6]Cl3}$.

### Werner's cobalt ammines
In the 1890s Alfred Werner puzzled over a family of cobalt(III) chloride–ammonia compounds. Silver nitrate precipitates a different number of chloride ions from each:

| Formula as written then | colour | Cl⁻ precipitated per formula | Werner's formula |
|---|---|---|---|
| CoCl₃·6NH₃ | yellow | 3 | $\\ce{[Co(NH3)6]Cl3}$ |
| CoCl₃·5NH₃ | purple | 2 | $\\ce{[Co(NH3)5Cl]Cl2}$ |
| CoCl₃·4NH₃ | green *and* violet forms | 1 | $\\ce{[Co(NH3)4Cl2]Cl}$ |

His explanation: cobalt always holds six groups directly — an inner sphere — and chloride inside it is bonded to the metal and cannot precipitate. That the last compound exists in exactly two forms (the two Cl ligands next to each other, *cis*, or opposite, *trans*) showed that the six groups sit at the corners of an octahedron. Werner received the 1913 Nobel Prize.

### Ligands and coordination numbers
- **Monodentate** ligands bind through one atom: $\\ce{H2O}$, $\\ce{NH3}$, $\\ce{Cl-}$, $\\ce{OH-}$, $\\ce{CN-}$, CO.
- **Bidentate** ligands bind through two: ethane-1,2-diamine (en, H₂N–CH₂–CH₂–NH₂) and oxalate, $\\ce{C2O4^2-}$.
- **Polydentate** ligands bind through more: EDTA⁴⁻ wraps a metal ion with two N and four O donors.

The **coordination number** counts donor atoms, not ligands: $\\ce{[Co(en)3]^3+}$ has three ligands and coordination number 6. Common shapes:
- 2, linear: $\\ce{[Ag(NH3)2]+}$ (Tollens' reagent);
- 4, tetrahedral: $\\ce{[CoCl4]^2-}$, $\\ce{[Zn(NH3)4]^2+}$; or square planar, typical of d⁸ ions: $\\ce{[Ni(CN)4]^2-}$, $\\ce{[PtCl4]^2-}$;
- 6, octahedral: by far the most common.

**Bookkeeping.** The charge of a complex is the metal's oxidation state plus the charges of its ligands: in $\\ce{[Fe(CN)6]^4-}$ iron is +2, because six cyanides bring −6. The number of d electrons is then the group number minus the oxidation state: Fe(II), group 8, is d⁶. Dative bonds do not change the metal's oxidation state.

### Isomers
- *cis* and *trans*: square-planar $\\ce{[PtCl2(NH3)2]}$ exists as cisplatin, a leading anticancer drug that cross-links DNA, and transplatin, which is inactive.
- Mirror images: $\\ce{[Co(en)3]^3+}$ is a three-bladed propeller that comes in left- and right-handed forms ([[stereoisomers]]).
- Linkage isomers: nitrite can bind through N (nitro) or O (nitrito), thiocyanate through S or N.

### The chelate effect
A ligand that grips with several donor atoms — a **chelate**, from the Greek for a crab's claw — binds far more strongly than the same number of similar single donors. Nickel(II) with six ammonia molecules has an overall formation constant $\\log\\beta \\approx 8.6$; with three en molecules, the same six nitrogen donors, $\\log\\beta \\approx 18.3$ — ten billion times larger. The main reason is entropy: $\\ce{[Ni(H2O)6]^2+ + 3en -> [Ni(en)3]^2+ + 6H2O}$ turns four particles into seven ([[complex-ion-equilibria]], [[gibbs-equilibrium]]).

### Everywhere
- **Haemoglobin**: iron(II) held by the four nitrogens of a porphyrin and a histidine, with $\\ce{O2}$ in the sixth position. Carbon monoxide binds there about 200 times more strongly — hence its toxicity.
- **Chlorophyll** has magnesium in a similar ring; **vitamin B₁₂** has cobalt.
- **EDTA** softens water, measures water hardness by titration, preserves food by locking up metal ions that catalyse oxidation, and treats lead poisoning.
- **Industry**: gold is leached from ore as $\\ce{[Au(CN)2]-}$; photographic fixer dissolves silver halide as $\\ce{[Ag(S2O3)2]^3-}$; many polymerisation and hydrogenation catalysts are metal complexes.
`,
  ideas: [
    'Ligands donate lone pairs to a metal ion (a Lewis acid) through dative bonds; the metal and its ligands form a complex.',
    'The coordination number counts donor atoms; 2 (linear), 4 (tetrahedral or square planar) and 6 (octahedral) are the common ones.',
    'Complex charge = metal oxidation state + ligand charges; d electrons = group number − oxidation state.',
    'Complexes show cis/trans, mirror-image and linkage isomerism.',
    'Chelating ligands bind far more strongly than monodentate ones, mainly for entropy reasons.'
  ],
  pitfalls: [
    'The coordination number is the number of ligands — It counts donor atoms: [Co(en)₃]³⁺ has three ligands but coordination number 6.',
    'The charge of a complex ion is the charge of the metal — Add the ligand charges: [Fe(CN)₆]⁴⁻ contains iron(II), not iron(IV).',
    'Donating electron pairs reduces the metal — Dative bonding leaves the oxidation state unchanged; the pairs are shared, not handed over.'
  ],
  formulas: [
    {
      name: 'Oxidation state of the metal',
      expr: 'ox = qc - n*qL', tex: '\\text{ox} = q_\\text{complex} - n\\,q_L',
      vars: {
        ox: { name: 'oxidation state of the metal', int: true, signed: true, tex: '\\text{ox}' },
        qc: { name: 'charge of the complex', int: true, signed: true, value: -4, tex: 'q_\\text{complex}' },
        n: { name: 'number of ligands of this kind', int: true, value: 6 },
        qL: { name: 'charge of each ligand', int: true, signed: true, value: -1, tex: 'q_L' }
      },
      solveFor: 'ox',
      note: 'One kind of ligand; with several kinds, subtract each set\'s charge in turn. Defaults: hexacyanidoferrate, $\\ce{[Fe(CN)6]^4-}$: iron(II).',
      practice: { unknowns: ['ox', 'qc'] },
      stories: {
        ox: 'A complex with charge {qc} contains {n} ligands of charge {qL} each. What is the oxidation state of the metal?',
        qc: 'A metal in oxidation state {ox} carries {n} ligands of charge {qL}. What is the charge of the complex?'
      }
    },
    {
      name: 'Number of d electrons',
      expr: 'd = G - ox', tex: 'd = G - \\text{ox}',
      vars: {
        d: { name: 'd electrons on the metal ion', int: true },
        G: { name: 'group number of the metal (3–12)', int: true, value: 8 },
        ox: { name: 'oxidation state of the metal', int: true, value: 2, tex: '\\text{ox}' }
      },
      solveFor: 'd',
      note: 'For transition-metal ions the 4s electrons are lost first, so all remaining valence electrons are d electrons. Defaults: Fe²⁺, d⁶.',
      practice: { unknowns: ['d', 'ox'] },
      stories: {
        d: 'A metal from group {G} is in the oxidation state +{ox}. How many d electrons does the ion have?',
        ox: 'An ion of a group-{G} metal has {d} d electrons. What is its oxidation state?'
      }
    },
    {
      name: 'Free energy of complex formation',
      expr: 'dG = -R*T*ln(10)*logb', tex: '\\Delta G^\\circ = -RT\\ln 10\\;\\text{log β}',
      vars: {
        dG: { name: 'standard Gibbs energy of formation of the complex from the aqua ion', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G^\\circ' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 },
        logb: { name: 'log₁₀ of the overall formation constant', value: 18.3, signed: true, tex: '\\text{log β}' }
      },
      solveFor: 'dG',
      note: 'Defaults: [Ni(en)₃]²⁺. With six ammonia ligands instead (log β ≈ 8.6) the value is only about −49 kJ/mol: the chelate effect.',
      practice: { unknowns: ['dG', 'logb'] },
      stories: {
        dG: 'A complex has log β = {logb} at {T}. What is the standard Gibbs energy of its formation?',
        logb: 'The formation of a complex has ΔG° = {dG} at {T}. What is log β?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a formula: [Co(NH₃)₅Cl]Cl₂',
      q: 'For $\\ce{[Co(NH3)5Cl]Cl2}$ give the charge of the complex ion, the oxidation state and d-electron count of cobalt, the coordination number, and how many moles of AgCl form per mole with excess silver nitrate.',
      steps: [
        'Two chloride counter-ions outside the brackets balance the complex, so the complex ion is $\\ce{[Co(NH3)5Cl]^2+}$.',
        'Cobalt: $x + 5 \\times 0 + (-1) = +2$, so $x = +3$. Cobalt is in group 9: $9 - 3 = 6$ d electrons.',
        'Five NH₃ and one Cl⁻ donor: coordination number 6, octahedral.',
        'Only the two outer chlorides are free ions: 2 mol AgCl per mole. The bonded chloride stays put — Werner\'s original evidence.'
      ],
      a: '[Co(NH₃)₅Cl]²⁺; Co(III), d⁶; coordination number 6; 2 mol AgCl.'
    },
    {
      title: 'The chelate effect in numbers',
      q: 'At 298 K, $\\log\\beta_6 = 8.6$ for $\\ce{[Ni(NH3)6]^2+}$ and $\\log\\beta_3 = 18.3$ for $\\ce{[Ni(en)3]^2+}$. Compare the standard Gibbs energies of formation.',
      steps: [
        '$RT\\ln 10 = 8.314 \\times 298.15 \\times 2.303 = 5.71$ kJ/mol.',
        'Ammonia: $\\Delta G^\\circ = -5.71 \\times 8.6 = -49$ kJ/mol.',
        'en: $\\Delta G^\\circ = -5.71 \\times 18.3 = -104$ kJ/mol.',
        'Both attach six nitrogen atoms, with similar Ni–N bond energies. The 55 kJ/mol difference is mostly entropy: three en molecules release six waters, so the number of free particles rises.'
      ],
      a: 'About −49 against −104 kJ/mol: the chelate binds ten billion times more strongly.'
    }
  ],
  quiz: [
    { q: 'What is the coordination number of iron in $\\ce{[Fe(C2O4)3]^3-}$ (oxalate is bidentate)?', answer: 6,
      why: 'Three oxalate ligands, each bonding through two oxygens: six donor atoms, octahedral.' },
    { q: 'What is the oxidation state of platinum in cisplatin, [PtCl₂(NH₃)₂]?', choices: ['0', '+2', '+4', '−2'], a: 1,
      why: 'The complex is neutral; two Cl⁻ give −2 and ammonia is neutral, so Pt is +2 (d⁸, square planar).' },
    { q: 'Why does EDTA bind metal ions so much more strongly than six separate ligands would?', choices: ['EDTA carries a charge of −4, so its bonds are ionic', 'One EDTA grips with six donor atoms and replaces six water molecules, a large gain in entropy', 'EDTA reduces the metal ion', 'EDTA forms covalent bonds while other ligands do not'], a: 1,
      why: 'This is the chelate effect: binding one molecule instead of six frees many water molecules, and once one arm is attached the others are held close to the metal.' },
    { q: 'Square-planar [PtCl₂(NH₃)₂] has two isomers, while a tetrahedral molecule of the same formula would have only one.', a: true,
      why: 'In a square the two Cl can be adjacent (cis) or opposite (trans). In a tetrahedron every corner is adjacent to every other, so only one arrangement exists — part of the evidence that Pt(II) is square planar.' },
    { q: 'Excess silver nitrate is added to a solution of 1 mol of $\\ce{[Co(NH3)4Cl2]Cl}$. How many moles of AgCl precipitate?', answer: 1, unit: 'mol',
      why: 'Only the chloride outside the brackets is a free ion; the two inside are bonded to cobalt.' }
  ],
  applications: [
    'Anticancer drugs such as cisplatin and carboplatin.',
    'Oxygen transport by haemoglobin, and carbon-monoxide poisoning.',
    'Water softening, water-hardness titrations and chelation therapy with EDTA.',
    'Gold extraction, photographic fixing and homogeneous catalysis.'
  ],
  history: 'Alfred Werner proposed his coordination theory in 1893, at 26, and spent two decades proving it. In 1911 he separated a cobalt complex into mirror-image forms, which only an octahedral arrangement allows, and in 1914 did the same with one containing no carbon at all, silencing critics who held that only carbon compounds could be chiral. He received the Nobel Prize in Chemistry in 1913.',
  sim: { id: 'bond-crystal-field', params: { metal: 'Co3+', lig: 'NH3' } }
},

{
  id: 'crystal-field-theory', parent: 'coordination', title: 'Crystal field theory and colour', level: 3,
  short: 'Ligands approaching a metal ion raise some of its d orbitals more than others. The energy gap Δ decides which light the complex absorbs — and so its colour — and whether its electrons pair up, which sets its magnetism.',
  keywords: ['crystal field theory', 'ligand field', 'd orbital splitting', 'crystal field splitting', 'Δo', 't2g', 'eg', 'spectrochemical series', 'high spin', 'low spin', 'pairing energy', 'CFSE', 'colour', 'complementary colour', 'magnetic moment', 'spin-only', 'ruby', 'emerald'],
  prereq: ['coordination-compounds', 'orbital-shapes', 'physics:photon'],
  related: ['molecular-orbitals', 'beer-lambert', 'electron-configuration', 'physics:color-mixing', 'physics:em-spectrum', 'physics:magnetic-materials'],
  body: `
Why is $\\ce{[Cu(H2O)6]^2+}$ blue, $\\ce{[Ni(H2O)6]^2+}$ green, $\\ce{[Ti(H2O)6]^3+}$ purple and $\\ce{[Zn(H2O)6]^2+}$ colourless? **Crystal field theory** answers with a simple model: treat the six ligands as negative charges (or the negative ends of dipoles) approaching the metal ion along $\\pm x$, $\\pm y$ and $\\pm z$.

### Splitting the d orbitals
In a free ion the five d orbitals have the same energy. In an octahedral complex two of them, $d_{z^2}$ and $d_{x^2-y^2}$, point straight at the ligands; their electrons are repelled and their energy rises. The other three, $d_{xy}$, $d_{xz}$ and $d_{yz}$, point between the ligands and are lowered. The two sets are called $e_g$ and $t_{2g}$, and the gap between them is the **octahedral splitting** $\\Delta_o$. The average energy is unchanged, so $e_g$ lies $0.6\\Delta_o$ above the old level and $t_{2g}$ $0.4\\Delta_o$ below it. In a tetrahedral complex the pattern is inverted and smaller, $\\Delta_t \\approx \\tfrac{4}{9}\\Delta_o$.

### Colour
An electron in $t_{2g}$ can absorb a photon of energy $\\Delta_o$ and jump to $e_g$ ([[physics:photon|photons]]). For $\\ce{[Ti(H2O)6]^3+}$, with a single d electron, $\\Delta_o = 20\\,300\\ \\mathrm{cm^{-1}}$ (243 kJ/mol), so it absorbs near 493 nm, blue-green light. What reaches the eye is white light minus that band — mostly red and violet — which looks purple. **The colour we see is the complement of the colour absorbed** ([[physics:color-mixing|colour mixing]]). Ions with several d electrons show two or three bands because the electrons repel one another, but the first band still follows $\\Delta_o$. Ions with no d electrons (Sc³⁺, Ti⁴⁺) or a full set (Zn²⁺, Cu⁺) have no d–d transition and are colourless — unless a charge-transfer band, as in purple permanganate, takes over.

### The spectrochemical series
$\\Delta_o$ depends on the ligand, in an order that is almost the same for every metal:

$$\\ce{I-} < \\ce{Br-} < \\ce{Cl-} < \\ce{F-} < \\ce{OH-} < \\ce{H2O} < \\ce{NH3} < \\text{en} < \\ce{NO2-} < \\ce{CN-} < \\text{CO}$$

It also grows with the charge of the metal ion (hexaaquacobalt: 9 300 cm⁻¹ for Co²⁺, 18 200 for Co³⁺) and down a group ($\\ce{[Co(NH3)6]^3+}$ 22 900, the rhodium analogue about 34 000, iridium about 41 000 cm⁻¹). Add ammonia to pale blue $\\ce{[Cu(H2O)6]^2+}$ and it turns deep blue-violet: the stronger field shifts the absorption from the near infrared (about 800 nm) to the orange (about 600 nm).

### High spin and low spin
With four to seven d electrons there is a choice. Once $t_{2g}$ holds three electrons, the fourth can go up into $e_g$ (costing $\\Delta_o$) or pair up in $t_{2g}$ (costing the **pairing energy** $P$, the extra repulsion of two electrons in one orbital). A weak field ($\\Delta_o < P$) gives **high-spin** complexes with the most unpaired electrons; a strong field gives **low-spin** ones. Iron(II), d⁶: $\\ce{[Fe(H2O)6]^2+}$ ($\\Delta_o$ = 10 400 cm⁻¹) is high spin with four unpaired electrons and strongly paramagnetic; $\\ce{[Fe(CN)6]^4-}$ (33 800 cm⁻¹) is low spin, all paired, diamagnetic. The spin-only magnetic moment, $\\mu = \\sqrt{n(n+2)}\\,\\mu_B$, measures $n$: 4.90 μB against 0. Tetrahedral complexes, with their small $\\Delta_t$, are almost always high spin. In haemoglobin the high-spin iron(II) of the deoxy form turns low spin when it binds oxygen; the smaller ion slips into the plane of its ring and nudges the protein into its oxygen-hungry shape.

### Crystal field stabilisation energy
Electrons in $t_{2g}$ are stabilised, those in $e_g$ destabilised: $\\text{CFSE} = (-0.4\\,n_{t_{2g}} + 0.6\\,n_{e_g})\\Delta_o$. Chromium(III), $t_{2g}^3$, gains $1.2\\Delta_o$; low-spin cobalt(III), $t_{2g}^6$, gains $2.4\\Delta_o$. Large CFSE is one reason these complexes are so slow to exchange their ligands, and it explains the double-humped pattern of hydration enthalpies across the first transition series.

### Gems and gadgets
The same ion in different fields gives different colours. $\\ce{Cr^3+}$ in aluminium oxide (ruby) sits in a stronger field (about 18 000 cm⁻¹) and absorbs yellow-green and violet: red. In beryl (emerald) the field is weaker (about 16 000 cm⁻¹), the absorption moves towards orange-red, and the stone is green. Humidity-indicating silica gel is blue when dry (tetrahedral chlorocobalt species) and pink when wet ($\\ce{[Co(H2O)6]^2+}$).

> [!note] Crystal field theory treats ligands as point charges, which cannot be the whole truth: carbon monoxide is neutral yet produces the largest splitting of all. Ligand field theory, which adds covalent [[molecular-orbitals|molecular-orbital]] bonding (and π back-donation to ligands such as CO and CN⁻), keeps the same splitting diagram and explains the series.
`,
  ideas: [
    'In an octahedral complex the d orbitals split into a lower t₂g set (0.4Δo down) and an upper e_g set (0.6Δo up).',
    'A d–d transition absorbs light of energy Δo; the complex shows the complementary colour.',
    'Δo depends on the ligand (the spectrochemical series), the metal\'s charge and its period.',
    'For d⁴–d⁷, Δo against the pairing energy decides high spin or low spin, and so the magnetism.',
    'CFSE = (−0.4 n_t2g + 0.6 n_eg)Δo measures the extra stability the splitting gives.'
  ],
  pitfalls: [
    'A complex has the colour of the light it absorbs — It shows the complementary colour: a complex absorbing orange light looks blue.',
    'Every complex can be high spin or low spin — The choice exists only for d⁴ to d⁷ in octahedral complexes; d¹–d³ and d⁸–d¹⁰ have one arrangement.',
    'Ligands really are point charges — It is a model. The neutral CO gives the largest splitting of all, which only covalent (ligand field) bonding explains.'
  ],
  formulas: [
    {
      name: 'Wavelength absorbed for a splitting Δo',
      expr: 'lam = h*c*NA/Do', tex: '\\lambda = \\frac{h c N_A}{\\Delta_o}',
      vars: {
        lam: { name: 'wavelength absorbed', q: 'length', unit: 'nm', tex: '\\lambda' },
        h: { const: 'h' }, c: { const: 'c' }, NA: { const: 'NA' },
        Do: { name: 'octahedral splitting', q: 'molarenergy', unit: 'kJ/mol', value: 242.8, tex: '\\Delta_o' }
      },
      solveFor: 'lam',
      note: 'Exact for one d electron, and for the first band of d³ and d⁸ ions. Spectroscopists quote Δo in cm⁻¹: 1000 cm⁻¹ = 11.96 kJ/mol. Defaults: [Ti(H₂O)₆]³⁺, 20 300 cm⁻¹.',
      practice: { unknowns: ['lam', 'Do'] },
      stories: {
        lam: 'A d¹ complex has an octahedral splitting of {Do}. At what wavelength does it absorb?',
        Do: 'A d¹ complex absorbs most strongly at {lam}. What is its octahedral splitting?'
      }
    },
    {
      name: 'Crystal field stabilisation energy',
      expr: 'CFSE = (-0.4*nt + 0.6*ne)*Do', tex: '\\text{CFSE} = (-0.4\\,n_{t} + 0.6\\,n_{e})\\,\\Delta_o',
      vars: {
        CFSE: { name: 'crystal field stabilisation energy (pairing not included)', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\text{CFSE}' },
        nt: { name: 'electrons in t₂g', int: true, value: 3, min: 0, max: 6, tex: 'n_{t}' },
        ne: { name: 'electrons in e_g', int: true, value: 0, min: 0, max: 4, tex: 'n_{e}' },
        Do: { name: 'octahedral splitting', q: 'molarenergy', unit: 'kJ/mol', value: 208.2, tex: '\\Delta_o' }
      },
      solveFor: 'CFSE',
      note: 'Negative means stabilised. Defaults: [Cr(H₂O)₆]³⁺, t₂g³, Δo = 17 400 cm⁻¹ = 208 kJ/mol.',
      practice: { unknowns: ['CFSE', 'Do'] },
      stories: {
        CFSE: 'An octahedral complex has {nt} electrons in t₂g and {ne} in e_g, with Δo = {Do}. What is its crystal field stabilisation energy?',
        Do: 'An octahedral complex with {nt} t₂g and {ne} e_g electrons has a CFSE of {CFSE}. What is Δo?'
      }
    },
    {
      name: 'Spin-only magnetic moment',
      expr: 'mu = sqrt(n*(n + 2))*muB', tex: '\\mu = \\sqrt{n(n + 2)}\\;\\mu_B',
      vars: {
        mu: { name: 'magnetic moment', q: 'mdipole', unit: 'µB', tex: '\\mu' },
        n: { name: 'unpaired electrons', int: true, value: 4 },
        muB: { const: 'muB' }
      },
      solveFor: 'mu',
      note: 'Good for first-row transition-metal ions, whose orbital motion is largely quenched. 1 to 5 unpaired electrons: 1.73, 2.83, 3.87, 4.90, 5.92 μB.',
      practice: { unknowns: ['mu', 'n'] },
      stories: {
        mu: 'A complex has {n} unpaired electrons. What spin-only magnetic moment do you expect?',
        n: 'A complex has a measured magnetic moment of {mu}. How many unpaired electrons does it have?'
      }
    }
  ],
  examples: [
    {
      title: 'The colour of titanium(III)',
      q: '$\\ce{[Ti(H2O)6]^3+}$ has $\\Delta_o = 20\\,300\\ \\mathrm{cm^{-1}}$. Which light does it absorb, and what colour does the solution look?',
      steps: [
        'Convert: $20\\,300 \\times 11.96\\ \\mathrm{J/mol} = 242.8$ kJ/mol (per photon $4.03\\times10^{-19}$ J).',
        { text: 'The wavelength:', tex: '\\lambda = \\frac{hcN_A}{\\Delta_o} = \\frac{0.1196\\ \\mathrm{J\\,m\\,mol^{-1}}}{242\\,800\\ \\mathrm{J\\,mol^{-1}}} = 4.93\\times10^{-7}\\ \\mathrm{m}' },
        '493 nm is blue-green light. Take it out of white light and red and violet remain: the solution looks purple.'
      ],
      a: 'It absorbs blue-green light near 493 nm and looks purple.'
    },
    {
      title: 'Iron(II): high spin or low spin?',
      q: 'The pairing energy of Fe²⁺ is about 17 600 cm⁻¹ (less in a complex). Predict the electron arrangement, unpaired electrons and magnetic moment of $\\ce{[Fe(H2O)6]^2+}$ ($\\Delta_o$ = 10 400 cm⁻¹) and $\\ce{[Fe(CN)6]^4-}$ ($\\Delta_o$ = 33 800 cm⁻¹).',
      steps: [
        'Fe²⁺ is d⁶ (group 8, charge +2).',
        'Water: $\\Delta_o < P$, so electrons spread out before pairing: $t_{2g}^4 e_g^2$, four unpaired. $\\mu = \\sqrt{4 \\times 6} = 4.90\\ \\mu_B$.',
        'Cyanide: $\\Delta_o > P$, so all six pair in $t_{2g}$: $t_{2g}^6$, no unpaired electrons, diamagnetic.',
        'CFSE: high spin $(-0.4 \\times 4 + 0.6 \\times 2)\\Delta_o = -0.4\\Delta_o$; low spin $-2.4\\Delta_o$ (less the cost of two extra pairs).'
      ],
      a: 'Aqua: high spin, t₂g⁴e_g², 4 unpaired, 4.90 μB. Cyanide: low spin, t₂g⁶, diamagnetic.'
    }
  ],
  quiz: [
    { q: 'Which d orbitals are raised in energy in an octahedral complex?', choices: ['dxy, dxz and dyz', 'dz² and dx²−y²', 'all five equally', 'only dz²'], a: 1,
      why: 'The ligands approach along the axes, where dz² and dx²−y² point. These two (e_g) are raised; the three between the axes (t₂g) are lowered.' },
    { q: 'A complex absorbs strongly at 600 nm (orange light). What colour does its solution appear?', choices: ['orange', 'blue', 'red', 'yellow'], a: 1,
      why: 'Removing orange from white light leaves mainly blue: the complementary colour.' },
    { q: 'Why is $\\ce{[Zn(H2O)6]^2+}$ colourless?', choices: ['zinc ions are too small', 'Zn²⁺ is d¹⁰: every d orbital is full, so no d–d transition is possible', 'water is a strong-field ligand', 'zinc has no d electrons'], a: 1,
      why: 'An electron can only jump from t₂g to e_g if there is room in e_g. With ten d electrons there is none.' },
    { q: 'What spin-only magnetic moment corresponds to three unpaired electrons, in μB?', answer: 3.87, unit: 'µB',
      why: '$\\sqrt{3 \\times 5} = \\sqrt{15} = 3.87\\ \\mu_B$ — for example Cr³⁺ complexes.' },
    { q: 'Adding ammonia to pale blue $\\ce{[Cu(H2O)6]^2+}$ gives a deep blue-violet solution. What happened?', choices: ['Δo decreased, so the absorbed wavelength got longer', 'Δo increased, so the absorbed wavelength got shorter', 'copper was oxidised to Cu³⁺', 'the complex lost its d electrons'], a: 1,
      why: 'NH₃ is higher in the spectrochemical series than H₂O. A larger splitting moves the absorption from about 800 nm to about 600 nm, and the transmitted colour deepens.' }
  ],
  applications: [
    'Colours of gemstones, pigments and glazes (ruby, emerald, cobalt blue, chrome green).',
    'Magnetic measurements that reveal oxidation and spin states.',
    'Humidity indicators and colour tests in analysis.',
    'Understanding oxygen binding in haemoglobin and the design of MRI contrast agents and catalysts.'
  ],
  history: 'Hans Bethe (1929) and John Hasbrouck Van Vleck developed crystal field theory for ions in crystals. In the 1950s chemists such as Leslie Orgel applied it to complexes in solution, and its extension with covalent bonding became ligand field theory.',
  sim: 'bond-crystal-field'
}

);
