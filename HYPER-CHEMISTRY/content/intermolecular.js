/* HYPER-CHEMISTRY · content/intermolecular.js — the weak attractions between molecules:
 * dispersion, dipole–dipole, ion–dipole and hydrogen bonds, and the properties they set. */
Hyper.add(

{
  id: 'intermolecular-forces', parent: 'intermolecular', title: 'Intermolecular forces', level: 1,
  short: 'The attractions between molecules — dispersion forces, dipole–dipole forces, ion–dipole forces and hydrogen bonds. They are tens to thousands of times weaker than covalent bonds, yet they decide whether a substance is a gas, a liquid or a solid.',
  keywords: ['intermolecular forces', 'van der Waals forces', 'London dispersion', 'dispersion force', 'induced dipole', 'polarisability', 'dipole–dipole', 'ion–dipole', 'Lennard-Jones potential', 'van der Waals radius', 'noble gases', 'halogens'],
  prereq: ['bond-polarity', 'molecular-polarity', 'physics:coulombs-law'],
  related: ['hydrogen-bonding', 'imf-properties', 'real-gases', 'solubility', 'vapor-pressure', 'covalent-bonds', 'physics:electric-potential-energy'],
  body: `
Inside a molecule, covalent bonds are worth 150 to 1000 kJ/mol. Between molecules act much weaker attractions — typically 0.1 to 40 kJ/mol — and yet they decide whether a substance is a gas, a liquid or a solid at room temperature. Boiling water breaks no O–H bonds at all: it only pulls molecules away from their neighbours, which takes 40.7 kJ/mol, against 463 kJ/mol for each O–H bond. Together these attractions are often called **van der Waals forces**, after the Dutch physicist who needed them to explain why real gases condense ([[real-gases]]).

### The kinds of attraction
1. **London dispersion forces** act between all atoms and molecules. Electrons are always moving, so at any instant an electron cloud is slightly lopsided — a fleeting dipole. It pushes the electrons of a neighbour the same way, inducing an opposite dipole, and the two attract. The dipoles flicker, but they flicker in step, so on average the attraction never cancels. It grows with the **polarisability** of the cloud — how easily it is distorted — and that grows with the number of electrons and the size: helium, argon and xenon have polarisability volumes of 0.20, 1.64 and 4.04 Å³, and boil at 4 K, 87 K and 165 K. Shape matters too, because only touching surfaces attract: rod-like pentane boils at 36 °C, its compact isomer 2,2-dimethylpropane (same formula $\\ce{C5H12}$) at 9.5 °C.
2. **Dipole–dipole forces** act between polar molecules ([[molecular-polarity]]). The δ+ end of one attracts the δ− end of the next; in a liquid the molecules tumble, but they spend a little more time in attractive orientations. Ethanal ($\\ce{CH3CHO}$, dipole 2.7 D) boils at 20 °C, propane (almost nonpolar, similar mass) at −42 °C.
3. **Dipole–induced-dipole forces**: a polar molecule distorts the cloud of a nonpolar neighbour. This is how a little oxygen dissolves in water.
4. **Hydrogen bonds**, the strongest of these, form when hydrogen is bonded to N, O or F ([[hydrogen-bonding]]).
5. **Ion–dipole forces** act between ions and polar molecules. Water molecules crowd round a $\\ce{Na+}$ ion with their oxygen ends inward and round a $\\ce{Cl-}$ ion with their hydrogens inward; the energy released is what dissolves salts ([[solubility]]).

Dispersion is usually the largest single contribution, even for polar molecules: most of the attraction between HCl molecules is dispersion, not their dipoles.

### Short range
The energies fall off steeply with distance $r$: as $1/r$ between ions, $1/r^2$ between an ion and a dipole, and $1/r^6$ for tumbling dipoles and for dispersion. Double the distance and dispersion drops 64-fold, so these forces act essentially between nearest neighbours — which is why a gas, whose molecules are far apart, behaves almost ideally.

### The Lennard-Jones potential
A convenient model combines the $1/r^6$ attraction with a steep repulsion when electron clouds overlap:

$$V(r) = 4\\varepsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12} - \\left(\\frac{\\sigma}{r}\\right)^{6}\\right]$$

$V$ is zero at $r = \\sigma$ and has its minimum, $-\\varepsilon$, at $r_\\text{min} = 2^{1/6}\\sigma$. For argon $\\varepsilon \\approx 1.0$ kJ/mol ($\\varepsilon/k_B \\approx 120$ K) and $\\sigma \\approx 340$ pm: two argon atoms settle about 382 pm apart, in a well some 400 times shallower than a covalent bond. Molecular-dynamics simulations of liquids, polymers and proteins are built on potentials of this kind.

> [!fact] A gecko hangs from a glass ceiling by dispersion forces alone: each foot carries millions of fine hairs ending in spatulae a few hundred nanometres wide, which come close enough to the surface for van der Waals attraction to hold the animal's weight.
`,
  ideas: [
    'Intermolecular forces are much weaker than covalent bonds, but they set melting points, boiling points and solubility.',
    'Dispersion forces act between all molecules and grow with the number of electrons, size and contact area.',
    'Polar molecules add dipole–dipole attraction; ions attract polar molecules strongly (ion–dipole).',
    'Hydrogen bonds are the strongest intermolecular force, for H on N, O or F.',
    'The forces fall off steeply with distance (dispersion as 1/r⁶); the Lennard-Jones potential models attraction plus repulsion.'
  ],
  pitfalls: [
    'Boiling breaks the bonds inside the molecules — Boiling water separates whole H₂O molecules; every O–H bond survives.',
    'Dispersion forces matter only for nonpolar molecules — They are usually the largest contribution even for polar molecules such as HCl.',
    'Heavier molecules boil higher because they are heavier — Mass itself does not attract. It is the larger, more polarisable electron cloud that comes with the mass.'
  ],
  formulas: [
    {
      name: 'Lennard-Jones potential',
      expr: 'V = 4*eps*((sig/r)^12 - (sig/r)^6)', tex: 'V = 4\\varepsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12} - \\left(\\frac{\\sigma}{r}\\right)^{6}\\right]',
      vars: {
        V: { name: 'interaction energy per mole of pairs', q: 'molarenergy', unit: 'kJ/mol', signed: true },
        eps: { name: 'depth of the well', q: 'molarenergy', unit: 'kJ/mol', value: 0.998, tex: '\\varepsilon' },
        sig: { name: 'distance at which V = 0', q: 'length', unit: 'pm', value: 340.5, min: 150, max: 600, tex: '\\sigma' },
        r: { name: 'distance between the centres', q: 'length', unit: 'pm', value: 400, min: 250, max: 1500 }
      },
      solveFor: 'V',
      note: 'Defaults: two argon atoms. Inside $r_\\text{min}$ the repulsion takes over; beyond it the $1/r^6$ attraction fades quickly. Solving for $r$ gives two distances with the same energy, one on each side of the well.',
      practice: { unknowns: ['V', 'eps'] },
      stories: {
        V: 'Two atoms with Lennard-Jones parameters ε = {eps} and σ = {sig} are {r} apart. What is their interaction energy?',
        eps: 'Two molecules {r} apart, with σ = {sig}, attract with an energy of {V}. How deep is their Lennard-Jones well?'
      }
    },
    {
      name: 'Distance of strongest attraction',
      expr: 'rmin = 2^(1/6)*sig', tex: 'r_\\text{min} = 2^{1/6}\\,\\sigma',
      vars: {
        rmin: { name: 'distance at the bottom of the well', q: 'length', unit: 'pm', tex: 'r_\\text{min}' },
        sig: { name: 'Lennard-Jones σ', q: 'length', unit: 'pm', value: 340.5, tex: '\\sigma' }
      },
      solveFor: 'rmin',
      note: 'Twice the van der Waals radius, roughly. Argon: 382 pm (measured for the Ar₂ pair: 376 pm).',
      practice: { unknowns: ['rmin', 'sig'] },
      stories: {
        rmin: 'A Lennard-Jones pair has σ = {sig}. At what separation is the attraction strongest?',
        sig: 'Two molecules sit at the bottom of their Lennard-Jones well {rmin} apart. What is σ?'
      }
    }
  ],
  examples: [
    {
      title: 'Two argon atoms',
      q: 'With ε = 0.998 kJ/mol and σ = 340.5 pm, find the energy of an argon pair 400 pm apart, and the distance of lowest energy.',
      steps: [
        '$\\sigma/r = 340.5/400 = 0.851$; $(\\sigma/r)^6 = 0.381$; $(\\sigma/r)^{12} = 0.145$.',
        '$V = 4 \\times 0.998 \\times (0.145 - 0.381) = -0.94$ kJ/mol.',
        '$r_\\text{min} = 2^{1/6} \\times 340.5 = 1.1225 \\times 340.5 = 382$ pm, where $V = -0.998$ kJ/mol.',
        'At room temperature $RT = 2.5$ kJ/mol — more than the well depth — which is why argon is a gas until it is cooled to 87 K.'
      ],
      a: '−0.94 kJ/mol at 400 pm; the minimum, −1.0 kJ/mol, lies at 382 pm.'
    },
    {
      title: 'Same formula, different shape',
      q: 'Pentane and 2,2-dimethylpropane are both $\\ce{C5H12}$ (72 g/mol) and both nonpolar, but boil at 36 °C and 9.5 °C. Explain.',
      steps: [
        'Only dispersion forces act, and both molecules have the same 42 electrons.',
        'Pentane is a zig-zag rod: neighbours lie alongside each other and touch over a large area.',
        '2,2-Dimethylpropane is nearly spherical: neighbours touch only at a few points, so the flickering dipoles couple less.',
        'Weaker attraction means less energy to vaporise and a lower boiling point.'
      ],
      a: 'The rod-shaped molecule has more contact area and stronger dispersion forces.'
    }
  ],
  quiz: [
    { q: 'Which halogen has the highest boiling point?', choices: ['F₂', 'Cl₂', 'Br₂', 'I₂'], a: 3,
      why: 'All are nonpolar, so only dispersion acts. I₂ has the most electrons and the most polarisable cloud: it boils at 184 °C, F₂ at −188 °C.' },
    { q: 'Nonpolar molecules do not attract one another at all.', a: false,
      why: 'Dispersion forces act between all molecules. Without them nitrogen, methane and the noble gases could never be liquefied.' },
    { q: 'When water boils, which bonds or forces are overcome?', choices: ['the O–H covalent bonds', 'hydrogen bonds and other attractions between molecules', 'the bonds inside the oxygen atoms', 'ionic bonds between H⁺ and OH⁻'], a: 1,
      why: 'Steam is still H₂O. Vaporisation separates the molecules; no covalent bond is broken.' },
    { q: 'For a Lennard-Jones pair with σ = 340 pm, at what separation is the energy lowest, in pm?', answer: 381.6, unit: 'pm',
      why: '$r_\\text{min} = 2^{1/6}\\sigma = 1.1225 \\times 340 = 381.6$ pm.' },
    { q: 'Doubling the distance between two molecules weakens their dispersion attraction by a factor of about…', choices: ['2', '4', '8', '64'], a: 3,
      why: 'Dispersion energy falls as $1/r^6$, and $2^6 = 64$.' }
  ],
  applications: [
    'Liquefying gases: the weaker the forces, the colder it must get (nitrogen at 77 K, helium at 4 K).',
    'Molecular-dynamics simulation of liquids, polymers and biomolecules.',
    'Dry adhesives inspired by gecko feet.',
    'Chromatography, which separates compounds by their different attractions to a stationary phase.'
  ],
  sim: [{ id: 'bond-hydrides', params: { set: 'noble' } }, { id: 'bond-pe-curve', params: { pair: 'Ar2' } }]
},

{
  id: 'hydrogen-bonding', parent: 'intermolecular', title: 'Hydrogen bonding', level: 1,
  short: 'A strong, directional attraction between a hydrogen atom bonded to N, O or F and a lone pair on another N, O or F atom. It explains why water boils at 100 °C, why ice floats, and how DNA and proteins hold their shapes.',
  keywords: ['hydrogen bond', 'H bond', 'donor', 'acceptor', 'water', 'ice', 'density maximum', 'anomalous boiling point', 'hydrides', 'DNA base pairing', 'protein structure', 'alpha helix', 'entropy of vaporisation'],
  prereq: ['intermolecular-forces', 'bond-polarity', 'electronegativity'],
  related: ['imf-properties', 'molecular-polarity', 'solubility', 'surface-tension-viscosity', 'amino-acids-proteins', 'nucleic-acids', 'carbohydrates', 'physics:density', 'physics:latent-heat'],
  body: `
### What a hydrogen bond is
A hydrogen atom bonded to nitrogen, oxygen or fluorine is left with a large δ+: its one electron is pulled towards a very electronegative partner, and the atom is tiny, so a nearly bare proton sits at the surface of the molecule. It is strongly attracted to a lone pair on a nearby N, O or F atom:

$$\\text{X–H} \\cdots \\text{:Y} \\qquad (\\text{X, Y} = \\text{N, O, F})$$

X–H is the **donor**, Y the **acceptor**. A hydrogen bond is much stronger than an ordinary dipole–dipole attraction — typically 10 to 40 kJ/mol, about 20 kJ/mol in water — though still some 20 times weaker than the O–H covalent bond. It is partly electrostatic and partly a slight sharing of the acceptor's lone pair, and it is **directional**: strongest when X–H···Y lies in a straight line. In water the covalent O–H bond is 96–100 pm long, the hydrogen bond H···O about 180 pm, and neighbouring oxygens sit about 276 pm apart in ice. At the extreme, in the hydrogen difluoride ion $\\ce{[F-H-F]-}$ the proton sits midway between the fluorines, bound by about 160 kJ/mol.

### The anomalous hydrides
Down each group the boiling points of the hydrides rise with the number of electrons, as dispersion forces predict — methane, silane, germane and stannane climb steadily. But ammonia (−33 °C), water (+100 °C) and hydrogen fluoride (+19.5 °C) stand far above the trend. Extend the line of $\\ce{H2S}$ (−60 °C), $\\ce{H2Se}$ (−41 °C) and $\\ce{H2Te}$ (−2 °C) back to the second period and water "should" boil near −90 °C. Without hydrogen bonds there would be no liquid water on Earth. The simulation below plots the real data.

### Water, the special case
Each water molecule has two hydrogens to donate and two lone pairs to accept, so it can take part in four hydrogen bonds arranged tetrahedrally. That network gives water a string of unusual properties:
- **Ice floats.** In ice every molecule holds four neighbours in an open tetrahedral framework: density 0.917 g/cm³ against 1.000 for the liquid. Liquid water is densest at 4 °C, so lakes freeze from the top down and the water below stays liquid ([[physics:density|density]]).
- **Large heat capacity and enthalpy of vaporisation** (4.18 J/(g·K) and 40.7 kJ/mol): sweating cools us, and the oceans moderate the climate ([[physics:latent-heat|latent heat]]).
- **High surface tension**, 72 mN/m at 20 °C ([[surface-tension-viscosity]]).
- **A remarkable solvent** for anything that can join the network: sugars, alcohols, ions.

### Same formula, different forces
Ethanol, $\\ce{CH3CH2OH}$, boils at 78 °C; dimethyl ether, $\\ce{CH3OCH3}$, with exactly the same atoms, at −24 °C. The ether's oxygen can accept hydrogen bonds, but it has no O–H to donate. Carboxylic acids pair up through two hydrogen bonds, even in the vapour, which is why ethanoic acid boils at 118 °C.

### The molecules of life
- **DNA**: adenine pairs with thymine through two hydrogen bonds, guanine with cytosine through three. Heating separates the strands ("melting"), and GC-rich DNA melts at a higher temperature — the reason the denaturing step of PCR runs at about 95 °C ([[nucleic-acids]]).
- **Proteins**: N–H···O=C hydrogen bonds between peptide groups hold α-helices and β-sheets in shape ([[amino-acids-proteins]]).
- **Materials**: hydrogen bonds between chains give cellulose, nylon and aramid fibres (Kevlar) their strength.

A clue in the numbers: most liquids gain about 85–88 J/(mol·K) of entropy on boiling (Trouton's rule, see [[imf-properties]]). Water gains 109 and ethanol 110 — boiling also destroys the order of their hydrogen-bonded networks.
`,
  ideas: [
    'A hydrogen bond links H on N, O or F (the donor) to a lone pair on another N, O or F (the acceptor).',
    'At 10–40 kJ/mol it is the strongest intermolecular force, and it is directional.',
    'Hydrogen bonds make NH₃, H₂O and HF boil far above the trend of their groups.',
    'Water\'s four hydrogen bonds per molecule explain floating ice, the density maximum at 4 °C and its high heat capacity.',
    'Hydrogen bonds hold together DNA base pairs, protein helices and sheets, and strong fibres.'
  ],
  pitfalls: [
    'Any molecule containing hydrogen forms hydrogen bonds — Only H attached to N, O or F. The C–H hydrogens of methane cannot.',
    'A hydrogen bond is a covalent bond to hydrogen — It is the attraction between molecules (or distant parts of one big molecule); the covalent O–H bond is a different, twenty times stronger thing.',
    'Ice is denser than water, like most solids — Its hydrogen-bonded framework is open, so ice is 8 % less dense than the liquid.'
  ],
  formulas: [
    {
      name: 'Entropy of vaporisation',
      expr: 'S = Hvap/Tb', tex: '\\Delta S_\\text{vap} = \\frac{\\Delta H_\\text{vap}}{T_b}',
      vars: {
        S: { name: 'molar entropy of vaporisation', q: 'molarheat', unit: 'J/(mol·K)', tex: '\\Delta S_\\text{vap}' },
        Hvap: { name: 'molar enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 40.65, tex: '\\Delta H_\\text{vap}' },
        Tb: { name: 'normal boiling point', q: 'temperature', unit: 'K', value: 373.15, tex: 'T_b' }
      },
      solveFor: 'S',
      note: 'At the boiling point liquid and vapour are in equilibrium, so $\\Delta G = 0$ and $\\Delta S = \\Delta H/T$. Ordinary liquids give about 85–88 J/(mol·K); hydrogen-bonded ones more. Defaults: water.',
      practice: { unknowns: ['S', 'Hvap'] },
      stories: {
        S: 'A liquid boils at {Tb} with an enthalpy of vaporisation of {Hvap}. What is its entropy of vaporisation?',
        Hvap: 'A liquid boiling at {Tb} has an entropy of vaporisation of {S}. What is its enthalpy of vaporisation?'
      }
    }
  ],
  examples: [
    {
      title: 'Where would water boil without hydrogen bonds?',
      q: 'The boiling points of $\\ce{H2S}$, $\\ce{H2Se}$ and $\\ce{H2Te}$ (periods 3–5) are −60.3, −41.3 and −2.2 °C. Extend a straight-line trend back to period 2.',
      steps: [
        'Average period 4, average boiling point $(-60.3 - 41.3 - 2.2)/3 = -34.6$ °C.',
        'Best-fit slope: $\\big((-1)(-25.7) + (+1)(32.4)\\big)/2 = 29.05$ °C per period.',
        'At period 2: $-34.6 - 2 \\times 29.05 = -92.7$ °C.',
        'Water actually boils at +100 °C: nearly 200 °C higher, the work of its hydrogen bonds. (The trend curves, so this is only an estimate.)'
      ],
      a: 'Around −90 °C; hydrogen bonding raises it by almost 200 °C.'
    },
    {
      title: 'Water against benzene',
      q: 'Water: $\\Delta H_\\text{vap} = 40.65$ kJ/mol at 373.15 K. Benzene: 30.72 kJ/mol at 353.2 K. Compare their entropies of vaporisation.',
      steps: [
        'Water: $40\\,650/373.15 = 108.9$ J/(mol·K).',
        'Benzene: $30\\,720/353.2 = 87.0$ J/(mol·K), close to the value typical of liquids without hydrogen bonds.',
        'The extra 22 J/(mol·K) for water reflects the ordered hydrogen-bonded network lost on boiling.'
      ],
      a: '109 against 87 J/(mol·K): water\'s liquid is more ordered.'
    }
  ],
  quiz: [
    { q: 'Which substance can form hydrogen bonds with itself?', choices: ['CH₃OCH₃ (dimethyl ether)', 'CH₃OH (methanol)', 'CH₃F (fluoromethane)', 'HCHO (methanal)'], a: 1,
      why: 'Methanol has an O–H (a donor) and oxygen lone pairs (acceptors). The others have acceptor atoms but all their hydrogens sit on carbon.' },
    { q: 'Why does ice float on water?', choices: ['it contains trapped air', 'its hydrogen-bonded network is open, so it is less dense than the liquid', 'ice molecules are lighter', 'the surface tension holds it up'], a: 1,
      why: 'Each molecule in ice holds four neighbours in a tetrahedral framework with a lot of empty space; melting lets molecules crowd closer.' },
    { q: 'Two DNA fragments of equal length differ in composition. Which separates into single strands at the lower temperature?', choices: ['the one rich in G–C pairs', 'the one rich in A–T pairs', 'both at the same temperature', 'neither: hydrogen bonds cannot be broken by heat'], a: 1,
      why: 'A–T pairs are held by two hydrogen bonds, G–C pairs by three (and stack more strongly), so AT-rich DNA melts first.' },
    { q: 'Ethanol boils at 78.4 °C with an enthalpy of vaporisation of 38.6 kJ/mol. What is its entropy of vaporisation, in J/(mol·K)?', answer: 109.8, unit: 'J/(mol·K)',
      why: '$38\\,600/(78.4 + 273.15) = 38\\,600/351.55 = 109.8$ J/(mol·K) — well above the 85–88 of liquids without hydrogen bonds.' },
    { q: 'A hydrogen bond is a covalent bond between a hydrogen atom and another atom.', a: false,
      why: 'It is the attraction between an H already covalently bonded to N, O or F and a lone pair elsewhere — about 20 kJ/mol against 463 kJ/mol for the O–H covalent bond.' }
  ],
  applications: [
    'The properties of water that make life and climate possible.',
    'DNA replication, PCR and DNA melting analysis.',
    'Protein folding, enzyme–substrate binding and drug design.',
    'Strong fibres (cellulose, nylon, Kevlar) and water-absorbing gels.'
  ],
  sim: 'bond-hydrides'
},

{
  id: 'imf-properties', parent: 'intermolecular', title: 'How intermolecular forces set properties', level: 2,
  short: 'Stronger attractions between molecules mean higher melting and boiling points, lower vapour pressure, higher surface tension and viscosity. The same forces decide what dissolves in what.',
  keywords: ['boiling point', 'melting point', 'vapour pressure', 'volatility', 'viscosity', 'surface tension', 'enthalpy of vaporisation', 'Trouton\'s rule', 'like dissolves like', 'solubility', 'alkanes', 'branching'],
  prereq: ['intermolecular-forces', 'hydrogen-bonding'],
  related: ['vapor-pressure', 'clausius-clapeyron', 'solubility', 'surface-tension-viscosity', 'phase-diagrams', 'crystal-structures', 'chromatography', 'physics:latent-heat', 'physics:surface-tension', 'physics:viscosity'],
  body: `
### One idea, many properties
The more strongly molecules attract one another, the more energy it takes to pull them apart. So stronger intermolecular forces mean:
- higher melting and boiling points and larger enthalpies of vaporisation;
- lower [[vapor-pressure|vapour pressure]] — the liquid evaporates more slowly;
- higher surface tension and, usually, higher viscosity;
- and they decide solubility: a substance dissolves where it can form attractions as good as the ones it gives up.

### Comparing boiling points
A checklist, roughly in order of importance:
1. **Ions or a covalent network?** Then far higher than any molecular substance: sodium chloride boils at 1465 °C.
2. **Hydrogen bonding** (O–H, N–H, H–F)?
3. **Polarity** — how large a dipole?
4. **Size**: more electrons, stronger dispersion.
5. **Shape**: more contact area, stronger dispersion.

Molecules of about the same molar mass (44–46 g/mol) show the effect of the kind of force:

| Substance | forces | boiling point |
|---|---|---|
| propane, $\\ce{CH3CH2CH3}$ | dispersion | −42 °C |
| dimethyl ether, $\\ce{CH3OCH3}$ | + dipole (1.3 D) | −24 °C |
| ethanal, $\\ce{CH3CHO}$ | + larger dipole (2.7 D) | 20 °C |
| ethanol, $\\ce{CH3CH2OH}$ | + hydrogen bonds | 78 °C |
| methanoic acid, $\\ce{HCOOH}$ | + hydrogen-bonded pairs | 101 °C |

Within one family, size wins: the straight-chain alkanes climb from methane (−161.5 °C) through butane (−0.5 °C) and octane (126 °C) — in that range every extra $\\ce{CH2}$ adds 20 to 40 °C — until the long chains of candle wax are solids. That is how crude oil is split into fuel gas, petrol, kerosene, diesel and lubricating oil in a distillation column.

### Trouton's rule
When a liquid boils, $\\Delta G = 0$, so $\\Delta S_\\text{vap} = \\Delta H_\\text{vap}/T_b$. For many liquids the entropy of vaporisation comes out close to 85–88 J/(mol·K), so

$$\\Delta H_\\text{vap} \\approx 88\\ \\mathrm{J\\,mol^{-1}\\,K^{-1}} \\times T_b$$

Benzene boils at 353 K: the rule predicts 31.1 kJ/mol, and 30.7 is measured. Hydrogen-bonded liquids break it (water needs 40.7 kJ/mol, not 32.8), and so do very low-boiling ones.

### Melting is different
Melting depends on how well molecules pack in the crystal as well as on how strongly they attract. The nearly spherical 2,2-dimethylpropane boils 27 °C *below* pentane, yet melts at −17 °C against −130 °C for pentane: its compact, symmetric molecules fit neatly into a crystal.

### Surface tension and viscosity
Molecules at a surface have neighbours only on one side, so strong attractions pull the surface tight: water 72.8 mN/m, ethanol 22, hexane 18 at 20 °C (mercury, held by metallic bonding, 486). See [[physics:surface-tension|surface tension]]. Viscosity rises when molecules cling to their neighbours or tangle: glycerol, with three O–H groups per molecule, is about 1400 times more viscous than water ([[physics:viscosity|viscosity]]).

### Like dissolves like
A solute dissolves when solute–solvent attractions can replace the solute–solute and solvent–solvent ones ([[solubility]]). Ethanol mixes with water in any proportion, because the two hydrogen-bond to each other. Hexane does not: it cannot join water's hydrogen-bond network, which closes up and squeezes it out. Iodine dissolves in hexane to a violet solution but barely in water. Soaps and detergents have one polar end and a long nonpolar tail, so they bridge the two worlds.
`,
  ideas: [
    'Stronger intermolecular forces raise boiling points, enthalpies of vaporisation, surface tension and viscosity, and lower vapour pressure.',
    'Compare substances by: ions or network? hydrogen bonds? dipole? number of electrons? shape?',
    'Trouton\'s rule: ΔH_vap ≈ 88 J/(mol·K) × T_b for liquids without hydrogen bonds.',
    'Melting points also depend on how well molecules pack, so they can disagree with boiling points.',
    'Like dissolves like: a solute dissolves where it can form attractions as strong as the ones it breaks.'
  ],
  pitfalls: [
    'Boiling point depends only on molar mass — Ethanol (46 g/mol) boils 120 °C higher than propane (44 g/mol). The kind of force matters more.',
    'Like dissolves like means identical molecules — It means similar intermolecular forces: water dissolves ethanol, sugar and salt, all very different from water.',
    'Stronger forces always mean a higher melting point — Packing matters: 2,2-dimethylpropane boils lower than pentane but melts more than 100 °C higher.'
  ],
  formulas: [
    {
      name: 'Trouton\'s rule',
      expr: 'Hvap = S*Tb', tex: '\\Delta H_\\text{vap} = \\Delta S_\\text{vap}\\, T_b',
      vars: {
        Hvap: { name: 'molar enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', tex: '\\Delta H_\\text{vap}' },
        S: { name: 'entropy of vaporisation (Trouton: about 88)', q: 'molarheat', unit: 'J/(mol·K)', value: 88, tex: '\\Delta S_\\text{vap}' },
        Tb: { name: 'normal boiling point', q: 'temperature', unit: 'K', value: 353.2, tex: 'T_b' }
      },
      solveFor: 'Hvap',
      note: 'Good to about 10 % for liquids without hydrogen bonds that boil between roughly 150 and 600 K. Defaults: benzene (measured 30.7 kJ/mol).',
      practice: { unknowns: ['Hvap', 'Tb'] },
      stories: {
        Hvap: 'A nonpolar liquid boils at {Tb}. Estimate its enthalpy of vaporisation with Trouton\'s rule (ΔS ≈ {S}).',
        Tb: 'A liquid without hydrogen bonds has an enthalpy of vaporisation of {Hvap}. Estimate its normal boiling point, taking ΔS ≈ {S}.'
      }
    }
  ],
  examples: [
    {
      title: 'Ranking by forces',
      q: 'Put in order of boiling point: butane ($\\ce{C4H10}$, 58 g/mol), propan-1-ol ($\\ce{C3H7OH}$, 60 g/mol), propanone ($\\ce{CH3COCH3}$, 58 g/mol).',
      steps: [
        'All three have similar numbers of electrons, so dispersion is comparable.',
        'Butane is nonpolar: dispersion only — lowest.',
        'Propanone has a strong C=O dipole (2.9 D) but no O–H: dipole–dipole added.',
        'Propan-1-ol has an O–H group: hydrogen bonds — highest.',
        'Measured: butane −0.5 °C, propanone 56 °C, propan-1-ol 97 °C.'
      ],
      a: 'Butane < propanone < propan-1-ol.'
    },
    {
      title: 'Trouton\'s rule for hexane',
      q: 'Hexane boils at 68.7 °C. Estimate its enthalpy of vaporisation.',
      steps: [
        '$T_b = 68.7 + 273.15 = 341.9$ K.',
        '$\\Delta H_\\text{vap} \\approx 88 \\times 341.9 = 30\\,100$ J/mol $= 30.1$ kJ/mol.',
        'The measured value is 28.9 kJ/mol — within 4 %.'
      ],
      a: 'About 30 kJ/mol (measured 28.9 kJ/mol).'
    }
  ],
  quiz: [
    { q: 'Which has the highest boiling point?', choices: ['propane, CH₃CH₂CH₃ (44 g/mol)', 'dimethyl ether, CH₃OCH₃ (46 g/mol)', 'ethanol, CH₃CH₂OH (46 g/mol)', 'ethanal, CH₃CHO (44 g/mol)'], a: 2,
      why: 'Only ethanol can hydrogen-bond to itself: 78 °C, against 20 °C (ethanal), −24 °C (dimethyl ether) and −42 °C (propane).' },
    { q: 'A liquid with strong intermolecular forces has a high vapour pressure at room temperature.', a: false,
      why: 'Strong attractions hold molecules in the liquid, so fewer escape: the vapour pressure is low and the liquid evaporates slowly.' },
    { q: 'Why does hexane not dissolve in water?', choices: ['hexane molecules are too large', 'mixing would break water\'s hydrogen bonds without forming anything as strong in return', 'hexane reacts with water', 'hexane is denser than water'], a: 1,
      why: 'Hexane offers only weak dispersion attractions to water, so the hydrogen-bond network closes up and pushes it out.' },
    { q: 'Cyclohexane boils at 80.7 °C. Estimate its enthalpy of vaporisation with Trouton\'s rule, in kJ/mol.', answer: 31.1, unit: 'kJ/mol',
      why: '$88 \\times (80.7 + 273.15) = 88 \\times 353.85 = 31\\,100$ J/mol. (Measured: 30.0 kJ/mol.)' },
    { q: 'Glycerol, C₃H₅(OH)₃, is about 1400 times more viscous than water at 20 °C. The main reason:', choices: ['it is ionic', 'each molecule forms several hydrogen bonds, knitting the liquid into a sticky network', 'its molecules are nonpolar', 'it is much heavier than water'], a: 1,
      why: 'Three O–H groups per molecule give many hydrogen bonds that must break and re-form as layers slide past each other.' }
  ],
  applications: [
    'Fractional distillation of crude oil into fuels by boiling range.',
    'Choosing refrigerants, solvents and fuels by volatility.',
    'Lubricant viscosity grades and the flow of oils in engines.',
    'Soaps, detergents and emulsifiers that link polar and nonpolar substances.'
  ],
  sim: { id: 'bond-hydrides', params: { set: 'mass' } }
}

);
