/* HYPER-CHEMISTRY · content/molecular-shape.js — molecular shape and orbitals: VSEPR,
 * the polarity of whole molecules, hybrid orbitals, sigma and pi bonds, and molecular
 * orbital theory. */
Hyper.add(

{
  id: 'vsepr', parent: 'molecular-shape', title: 'VSEPR: the shapes of molecules', level: 1,
  short: 'The electron pairs around a central atom repel one another and spread as far apart as they can. Counting bonded atoms and lone pairs predicts the shape of most small molecules.',
  keywords: ['VSEPR', 'valence shell electron pair repulsion', 'molecular shape', 'molecular geometry', 'electron geometry', 'steric number', 'electron domain', 'AXE notation', 'lone pair', 'bond angle', 'tetrahedral', 'trigonal planar', 'bent', 'trigonal pyramidal', 'seesaw', 'T-shaped', 'square planar', 'octahedral'],
  prereq: ['lewis-structures', 'math:angles'],
  related: ['molecular-polarity', 'hybridization', 'sigma-pi-bonds', 'bond-order-length', 'coordination-compounds', 'stereoisomers', 'physics:coulombs-law'],
  body: `
Electron pairs repel one another. Around a central atom the pairs — bonding pairs and lone pairs alike — spread out as far as they can, and the atoms held by the bonding pairs follow them. That one idea, **valence-shell electron-pair repulsion** (VSEPR), predicts the shape of most small molecules from the Lewis structure alone.

### Count the electron domains
Around the central atom count the **electron domains**: each bonded atom counts once, whether the bond to it is single, double or triple, and each lone pair counts once. Their number, the **steric number**, fixes how the domains are arranged — the ways of placing 2 to 6 points on a sphere as far apart as possible:

| Domains | arrangement | ideal angle |
|---|---|---|
| 2 | linear | 180° |
| 3 | trigonal planar | 120° |
| 4 | tetrahedral | 109.5° |
| 5 | trigonal bipyramidal | 90° and 120° |
| 6 | octahedral | 90° |

### The shape is where the atoms are
The **shape** of a molecule describes the positions of the *atoms* only; lone pairs shape it but are not part of the name. The notation $\\mathrm{AX}_m\\mathrm{E}_n$ lists $m$ bonded atoms and $n$ lone pairs on the central atom A:

| Type | example | shape | angle |
|---|---|---|---|
| AX₂ | $\\ce{CO2}$, $\\ce{BeCl2}$ | linear | 180° |
| AX₃ | $\\ce{BF3}$, $\\ce{SO3}$ | trigonal planar | 120° |
| AX₂E | $\\ce{SO2}$, $\\ce{O3}$ | bent | about 117–119° |
| AX₄ | $\\ce{CH4}$, $\\ce{NH4+}$ | tetrahedral | 109.5° |
| AX₃E | $\\ce{NH3}$ | trigonal pyramidal | 107° |
| AX₂E₂ | $\\ce{H2O}$ | bent | 104.5° |
| AX₅ | $\\ce{PCl5}$ | trigonal bipyramidal | 90°, 120° |
| AX₄E | $\\ce{SF4}$ | seesaw | about 102° and 173° |
| AX₃E₂ | $\\ce{ClF3}$ | T-shaped | about 87.5° |
| AX₂E₃ | $\\ce{XeF2}$, $\\ce{I3-}$ | linear | 180° |
| AX₆ | $\\ce{SF6}$ | octahedral | 90° |
| AX₅E | $\\ce{BrF5}$ | square pyramidal | about 85° |
| AX₄E₂ | $\\ce{XeF4}$ | square planar | 90° |

### Refinements that explain the real angles
- **Lone pairs push harder** than bonding pairs. Held by one nucleus instead of two, a lone pair spreads wider close to the central atom and squeezes the bonds together: $\\ce{CH4}$ 109.5°, $\\ce{NH3}$ 107°, $\\ce{H2O}$ 104.5°.
- **Multiple bonds** count as one domain but carry more electrons and push more: in methanal ($\\ce{H2C=O}$) the H–C–H angle is 116.5°, not 120°.
- **Five domains are not all equal.** An equatorial position has two neighbours at 90°, an axial one three, so lone pairs take the roomier equatorial sites: $\\ce{SF4}$ is a seesaw, $\\ce{ClF3}$ T-shaped, $\\ce{XeF2}$ linear.
- **Six domains**: two lone pairs sit opposite each other, which makes $\\ce{XeF4}$ square planar.
- **Electronegative neighbours** draw bonding pairs away from the centre, so they repel less: $\\ce{NF3}$ (102°) is narrower than $\\ce{NH3}$ (107°).

### Where VSEPR runs out
The heavier hydrides are almost right-angled: $\\ce{H2S}$ 92°, $\\ce{PH3}$ 93.5° — their bonds use nearly pure p orbitals ([[hybridization]]). Transition-metal compounds follow their d electrons instead ([[crystal-field-theory]]), and a few heavy molecules defy the rules (gaseous $\\ce{BaF2}$ is bent). Within main-group chemistry, though, this simple counting rule is right remarkably often.

The lab below does not look shapes up in a table: it lets the electron pairs push one another around a sphere and shows where they settle.
`,
  ideas: [
    'Electron domains — bonded atoms and lone pairs — around a central atom get as far apart as possible.',
    'Two to six domains give linear, trigonal planar, tetrahedral, trigonal bipyramidal and octahedral arrangements.',
    'The shape names only the positions of atoms; lone pairs are invisible in the name but decide it.',
    'A multiple bond counts as one domain.',
    'Lone pairs repel more than bonding pairs: they close the bond angles and, with five domains, take equatorial positions.'
  ],
  pitfalls: [
    'The shape and the electron arrangement are the same — Water\'s four domains are tetrahedral, but its shape, the positions of its three atoms, is bent.',
    'A double bond counts as two domains — Every bonded atom is one domain, whatever the bond order.',
    'VSEPR gives exact angles — It gives the arrangement and the direction of distortions; exact angles need measurement or calculation.'
  ],
  formulas: [
    {
      name: 'Lone pairs on the central atom',
      expr: 'E = (V - q - s)/2', tex: 'E = \\frac{V - q - s}{2}',
      vars: {
        E: { name: 'lone pairs on the central atom', int: true },
        V: { name: 'valence electrons of the central atom', int: true, value: 7 },
        q: { name: 'charge of the species', int: true, signed: true, value: 0 },
        s: { name: 'electrons the central atom uses in bonds (1 per H or halogen, 2 per terminal O or S)', int: true, value: 3 }
      },
      solveFor: 'E',
      note: 'Defaults: ClF₃ (Cl has 7, three F take one each): two lone pairs. For the sulfite ion SO₃²⁻: $(6 + 2 - 6)/2 = 1$.',
      practice: { unknowns: ['E'] },
      stories: {
        E: 'A central atom with {V} valence electrons uses {s} of them in bonds, in a species of charge {q}. How many lone pairs does it keep?'
      }
    },
    {
      name: 'Steric number',
      expr: 'SN = X + E', tex: '\\text{SN} = X + E',
      vars: {
        SN: { name: 'steric number (electron domains)', int: true, tex: '\\text{SN}' },
        X: { name: 'atoms bonded to the central atom', int: true, value: 3 },
        E: { name: 'lone pairs on the central atom', int: true, value: 2 }
      },
      solveFor: 'SN',
      note: '2 linear, 3 trigonal planar, 4 tetrahedral, 5 trigonal bipyramidal, 6 octahedral. Defaults: ClF₃, five domains.',
      practice: { unknowns: ['SN', 'E'] },
      stories: {
        SN: 'A central atom has {X} bonded atoms and {E} lone pairs. What is its steric number?',
        E: 'A central atom with steric number {SN} is bonded to {X} atoms. How many lone pairs does it carry?'
      }
    }
  ],
  examples: [
    {
      title: 'Chlorine trifluoride',
      q: 'Predict the shape of $\\ce{ClF3}$.',
      steps: [
        'Chlorine has 7 valence electrons and uses 3 in bonds to fluorine: $E = (7 - 0 - 3)/2 = 2$ lone pairs.',
        'Steric number $3 + 2 = 5$: the five domains form a trigonal bipyramid.',
        'Lone pairs take equatorial positions (each has only two neighbours at 90° there). That leaves two axial F and one equatorial F.',
        'The atoms form a T. The lone pairs push the axial fluorines slightly back: F–Cl–F is 87.5°, not 90°.'
      ],
      a: 'T-shaped (AX₃E₂), with F–Cl–F angles of about 87.5°.'
    },
    {
      title: 'Sulfur trioxide against the sulfite ion',
      q: 'Why is $\\ce{SO3}$ flat while $\\ce{SO3^2-}$ is a pyramid?',
      steps: [
        '$\\ce{SO3}$: $E = (6 - 0 - 3\\times2)/2 = 0$. Three domains, no lone pair: trigonal planar, 120°.',
        '$\\ce{SO3^2-}$: the two extra electrons give $E = (6 + 2 - 6)/2 = 1$. Four domains: tetrahedral arrangement.',
        'With one corner taken by the lone pair, the three oxygens form a pyramid (about 106°).'
      ],
      a: 'The two extra electrons of the sulfite ion form a lone pair on sulfur, turning three domains into four.'
    }
  ],
  quiz: [
    { q: 'What is the shape of $\\ce{SF4}$?', choices: ['tetrahedral', 'square planar', 'seesaw', 'trigonal pyramidal'], a: 2,
      why: 'Sulfur: 6 electrons, 4 used in bonds, so one lone pair and five domains. The lone pair goes equatorial, leaving a seesaw of four fluorines.' },
    { q: 'Why is the H–O–H angle in water (104.5°) smaller than the tetrahedral 109.5°?', choices: ['hydrogen atoms attract each other', 'the two lone pairs repel the bonding pairs more strongly than bonding pairs repel each other', 'oxygen is sp² hybridised', 'the O–H bonds are very long'], a: 1,
      why: 'Lone pairs are held by one nucleus only and spread wider near oxygen, so they squeeze the bonding pairs together.' },
    { q: 'CO₂ and SO₂ both have the formula AB₂. What are their shapes?', choices: ['both linear', 'CO₂ linear, SO₂ bent', 'both bent', 'CO₂ bent, SO₂ linear'], a: 1,
      why: 'Carbon uses all four electrons in its two double bonds: two domains, linear. Sulfur keeps a lone pair: three domains, bent (119°).' },
    { q: 'How many lone pairs are on the central iodine atom of the triiodide ion, $\\ce{I3-}$?', answer: 3,
      why: '$E = (7 + 1 - 2)/2 = 3$. Five domains, all three lone pairs equatorial: the ion is linear.' },
    { q: 'In a trigonal-bipyramidal arrangement the lone pairs occupy equatorial positions.', a: true,
      why: 'An equatorial site has two neighbours at 90°, an axial site three. The bulkier lone pairs take the roomier equatorial sites.' }
  ],
  applications: [
    'Predicting polarity, and through it solubility and boiling points.',
    'Drug design: the shape of a molecule decides whether it fits an enzyme pocket or a receptor.',
    'Explaining reactivity at open sites, such as the empty side of flat BF₃.',
    'The starting point for three-dimensional structure in organic and biological chemistry.'
  ],
  history: 'Nevil Sidgwick and Herbert Powell linked molecular shape to the number of electron pairs in 1940; Ronald Gillespie and Ronald Nyholm turned the idea into the VSEPR rules in 1957.',
  sim: 'ref-vsepr'
},

{
  id: 'molecular-polarity', parent: 'molecular-shape', title: 'Molecular polarity', level: 2,
  short: 'A molecule is polar when the vector sum of its bond dipoles (and lone pairs) does not cancel. Polar bonds are necessary, but the shape decides.',
  keywords: ['polar molecule', 'nonpolar molecule', 'net dipole moment', 'vector sum', 'bond dipole', 'symmetry', 'debye', 'cis trans', 'dichloromethane', 'chloroform', 'like dissolves like', 'dielectric constant'],
  prereq: ['bond-polarity', 'vsepr', 'math:vector-addition'],
  related: ['intermolecular-forces', 'hydrogen-bonding', 'solubility', 'imf-properties', 'ir-spectroscopy', 'stereoisomers', 'physics:dielectrics'],
  body: `
A molecule is **polar** when its centre of positive charge and its centre of negative charge do not coincide — when it has a net **dipole moment**. Each polar bond contributes a bond dipole, a vector along the bond ([[bond-polarity]]), and the molecular dipole is their [[math:vector-addition|vector sum]], plus a contribution from any lone pairs. So two things decide polarity: polar bonds, and a shape that does not let them cancel.

### Symmetry cancels
In $\\ce{CO2}$ the two C=O bond dipoles are equal and point in opposite directions: the net dipole is zero, although each bond is strongly polar. The same happens in $\\ce{BF3}$ (three bonds at 120°), $\\ce{CCl4}$ (tetrahedral), $\\ce{PCl5}$ and $\\ce{SF6}$. Lone pairs placed symmetrically cancel too: $\\ce{XeF2}$ and $\\ce{XeF4}$ are nonpolar. A useful test: if every position around the central atom holds the same kind of atom, and any lone pairs sit symmetrically, the molecule is nonpolar.

### The shape decides
In bent water the two O–H dipoles add along the bisector of the angle: $\\ce{H2O}$ has 1.85 D. Ammonia has 1.47 D, sulfur dioxide 1.63 D (against zero for the linear $\\ce{CO2}$). For two equal bond dipoles $\\mu_b$ at an angle $\\theta$:

$$\\mu = 2\\mu_b \\cos\\frac{\\theta}{2}$$

Replacing some of the atoms in a symmetric molecule breaks the symmetry: $\\ce{CH4}$ 0, $\\ce{CH3Cl}$ 1.87 D, $\\ce{CH2Cl2}$ 1.60 D, $\\ce{CHCl3}$ 1.04 D, and $\\ce{CCl4}$ 0 again. Isomers with the same bonds can differ completely: *cis*-1,2-dichloroethene (both Cl on one side) has 1.90 D and boils at 60 °C; the *trans* isomer has zero and boils at 48 °C.

### Lone pairs count too
Ammonia and nitrogen trifluoride have the same pyramidal shape, and N–F bonds are more polar than N–H. Yet $\\ce{NF3}$ has only 0.23 D against 1.47 D for $\\ce{NH3}$. In $\\ce{NH3}$ the bond dipoles point towards nitrogen, the same way as the dipole of its lone pair, and they add. In $\\ce{NF3}$ they point towards the fluorines, against the lone pair, and nearly cancel. Bond dipoles are a good first guess, not the whole story.

### Why polarity matters
- Polar molecules attract one another (dipole–dipole forces), so they boil higher than nonpolar molecules of similar size ([[intermolecular-forces]]).
- "Like dissolves like": polar solvents dissolve polar and ionic substances, nonpolar solvents dissolve nonpolar ones ([[solubility]]).
- A polar solvent screens charges. Water's relative permittivity is 80, hexane's 1.9, which is why salts dissolve in water and not in hexane ([[physics:dielectrics|dielectrics]]).
- A microwave oven heats food by making the dipoles of water molecules swing back and forth with the field (2.45 GHz).
- Only polar molecules have a pure rotational spectrum; microwave spectroscopy of such molecules is how many of the bond lengths and angles quoted here were measured.
`,
  ideas: [
    'The molecular dipole is the vector sum of the bond dipoles, plus a lone-pair contribution.',
    'Polar bonds are necessary for a polar molecule but not sufficient: a symmetric shape cancels them.',
    'Molecules with identical atoms in symmetric positions around the centre (CO₂, BF₃, CCl₄, SF₆, XeF₄) are nonpolar.',
    'For two equal bond dipoles at an angle θ, μ = 2μ_b cos(θ/2).',
    'Polarity governs boiling points, solubility, dielectric screening and microwave heating.'
  ],
  pitfalls: [
    'A molecule with polar bonds must be polar — CO₂ and CCl₄ have strongly polar bonds and no dipole at all: the vectors cancel.',
    'A flat drawing tells you the polarity — CH₂Cl₂ drawn on paper with the Cl atoms opposite looks nonpolar, but in the real tetrahedron the two C–Cl dipoles never point in opposite directions.',
    'Lone pairs do not matter once the shape is known — In NF₃ the lone pair nearly cancels the bond dipoles; in NH₃ it adds to them.'
  ],
  derivation: {
    title: 'The dipole of a pyramidal molecule',
    steps: [
      { text: 'Let the three equal bonds make the same angle $\\beta$ with the symmetry axis, 120° apart around it. Their components across the axis cancel; along it each contributes $\\mu_b\\cos\\beta$:', tex: '\\mu = 3\\mu_b\\cos\\beta' },
      { text: 'The bond angle $\\alpha$ follows from the dot product of two bond directions, $(\\sin\\beta, 0, \\cos\\beta)$ and $(\\sin\\beta\\cos 120°, \\sin\\beta\\sin 120°, \\cos\\beta)$:', tex: '\\cos\\alpha = \\cos^2\\beta - \\tfrac{1}{2}\\sin^2\\beta = \\tfrac{3}{2}\\cos^2\\beta - \\tfrac{1}{2}' },
      { text: 'Solve for $\\cos\\beta$ and substitute:', tex: '\\cos\\beta = \\sqrt{\\frac{1 + 2\\cos\\alpha}{3}} \\quad\\Rightarrow\\quad \\mu = 3\\mu_b\\sqrt{\\frac{1 + 2\\cos\\alpha}{3}}' }
    ],
    outro: 'At $\\alpha = 120°$ the root is zero: the molecule is flat, like BF₃, and nonpolar. At the tetrahedral 109.5° it is 1/3.'
  },
  formulas: [
    {
      name: 'Dipole of a bent molecule (two equal bonds)',
      expr: 'mu = 2*mub*cos(theta/2)', tex: '\\mu = 2\\mu_b \\cos\\frac{\\theta}{2}',
      vars: {
        mu: { name: 'molecular dipole moment', q: 'dipole', unit: 'D', tex: '\\mu' },
        mub: { name: 'bond dipole moment', q: 'dipole', unit: 'D', value: 1.51, tex: '\\mu_b' },
        theta: { name: 'bond angle', q: 'angle', unit: '°', value: 104.5, min: 0, max: 180, tex: '\\theta' }
      },
      solveFor: 'mu',
      note: 'Bond dipoles only (lone pairs folded into the effective bond dipole). Defaults: water; at 180° the dipoles cancel, as in CO₂.',
      practice: { unknowns: ['mu', 'mub'] },
      stories: {
        mu: 'Two bond dipoles of {mub} each meet at an angle of {theta}. What is the dipole moment of the molecule?',
        mub: 'A bent molecule with a bond angle of {theta} has a dipole moment of {mu}. What is the effective dipole of each bond?'
      }
    },
    {
      name: 'Dipole of a pyramidal molecule (three equal bonds)',
      expr: 'mu = 3*mub*sqrt((1 + 2*cos(alpha))/3)', tex: '\\mu = 3\\mu_b \\sqrt{\\frac{1 + 2\\cos\\alpha}{3}}',
      vars: {
        mu: { name: 'molecular dipole moment', q: 'dipole', unit: 'D', tex: '\\mu' },
        mub: { name: 'effective bond dipole', q: 'dipole', unit: 'D', value: 1.30, tex: '\\mu_b' },
        alpha: { name: 'bond angle between any two bonds', q: 'angle', unit: '°', value: 106.7, min: 90, max: 120, tex: '\\alpha' }
      },
      solveFor: 'mu',
      note: 'The square root is the cosine of the angle between each bond and the symmetry axis. At 120° the molecule is flat and the dipoles cancel (BF₃). Defaults: ammonia.',
      practice: { unknowns: ['mu', 'mub'] },
      stories: {
        mu: 'Three equal bond dipoles of {mub} form a pyramid with bond angles of {alpha}. What is the molecular dipole moment?',
        mub: 'A pyramidal molecule with bond angles of {alpha} has a dipole moment of {mu}. What effective dipole does each bond carry?'
      }
    }
  ],
  examples: [
    {
      title: 'The O–H bond dipole from water',
      q: 'Water has a dipole moment of 1.85 D and a bond angle of 104.5°. What dipole does each O–H bond carry?',
      steps: [
        'The two bond dipoles add along the bisector; each contributes $\\mu_b \\cos(\\theta/2)$.',
        '$\\cos(52.25°) = 0.612$, so $\\mu = 2 \\times 0.612\\,\\mu_b = 1.224\\,\\mu_b$.',
        '$\\mu_b = 1.85/1.224 = 1.51$ D.'
      ],
      a: 'About 1.5 D per O–H bond (including the share of the lone pairs).'
    },
    {
      title: 'Carbon dioxide against sulfur dioxide',
      q: 'The C=O and S=O bonds are both polar. Why is $\\ce{CO2}$ nonpolar and $\\ce{SO2}$ polar (1.63 D)?',
      steps: [
        '$\\ce{CO2}$ has no lone pair on carbon: two domains, linear, 180°. $\\cos 90° = 0$, so the two bond dipoles cancel exactly.',
        '$\\ce{SO2}$ has a lone pair on sulfur: three domains, bent, 119°. The two bond dipoles add to $2\\mu_b\\cos 59.5°$ ≈ $1.0\\,\\mu_b$.',
        'Shape, not the bonds, makes the difference — which is why $\\ce{SO2}$ dissolves far better in water than $\\ce{CO2}$ does.'
      ],
      a: 'CO₂ is linear and its bond dipoles cancel; SO₂ is bent and they do not.'
    }
  ],
  quiz: [
    { q: 'Which of these molecules is polar?', choices: ['CO₂', 'BF₃', 'CH₂Cl₂', 'CCl₄'], a: 2,
      why: 'In the tetrahedral CH₂Cl₂ the two C–Cl dipoles cannot point opposite each other, so they leave a net dipole (1.60 D). The other three are symmetric.' },
    { q: 'NH₃ has a dipole moment of 1.47 D but NF₃ only 0.23 D, although N–F bonds are more polar than N–H. Why?', choices: ['NF₃ is planar', 'In NF₃ the bond dipoles point towards F, against the lone pair\'s contribution, and nearly cancel it', 'Fluorine atoms have no dipole', 'N–F bonds are nonpolar'], a: 1,
      why: 'Both are pyramidal with a lone pair on N. In NH₃ the N–H dipoles point towards N and add to the lone pair; in NF₃ they point away from N and oppose it.' },
    { q: 'A molecule that contains polar bonds must be polar.', a: false,
      why: 'Symmetric molecules such as CO₂, BF₃ and CCl₄ have polar bonds whose dipoles cancel exactly.' },
    { q: 'Two identical bond dipoles of 1.60 D meet at 120°. What is the net dipole moment, in D?', answer: 1.6, unit: 'D',
      why: '$\\mu = 2 \\times 1.60 \\times \\cos 60° = 1.60$ D.' },
    { q: 'XeF₄ has two lone pairs on xenon. Is it polar?', choices: ['yes: lone pairs always make a molecule polar', 'no: the lone pairs sit opposite each other and the four Xe–F dipoles cancel in the square plane', 'yes, because Xe–F bonds are polar', 'only as a liquid'], a: 1,
      why: 'Six domains, square planar: the lone pairs are trans (above and below the plane) and the bond dipoles cancel in pairs.' }
  ],
  applications: [
    'Choosing solvents: polar for salts and sugars, nonpolar for oils and waxes.',
    'Microwave heating, which works on polar molecules such as water.',
    'Separating cis and trans isomers by their different boiling points.',
    'Designing dielectric liquids and polar aprotic solvents for batteries and synthesis.'
  ],
  sim: { id: 'bond-polarity', params: { mol: 'H2O' } }
},

{
  id: 'hybridization', parent: 'molecular-shape', title: 'Hybridisation', level: 2,
  short: 'Mixing an atom\'s s and p orbitals into equivalent hybrid orbitals (sp³, sp², sp) that point along its bonds. It reconciles the shapes of atomic orbitals with the observed shapes of molecules.',
  keywords: ['hybridisation', 'hybridization', 'hybrid orbital', 'sp3', 'sp2', 'sp', 'promotion', 's character', 'tetrahedral carbon', 'Coulson', 'bond angle', 'valence bond theory'],
  prereq: ['orbital-shapes', 'vsepr', 'covalent-bonds'],
  related: ['sigma-pi-bonds', 'molecular-orbitals', 'carbon-bonding', 'hydrocarbons', 'bond-order-length', 'math:dot-product'],
  body: `
Carbon's ground state is $1s^2\\,2s^2\\,2p^2$: two unpaired electrons in p orbitals at 90° to each other. Yet methane has four identical C–H bonds at 109.5°. **Hybridisation** reconciles the two. Mix carbon's 2s orbital with its three 2p orbitals and you get four equivalent **sp³ hybrid orbitals**, each holding one electron and pointing to a corner of a tetrahedron. Each overlaps with a hydrogen 1s orbital to make one C–H bond.

### Why mix at all?
Moving an electron from 2s to 2p costs about 400 kJ/mol, but it lets carbon form four bonds instead of two, and each C–H bond returns about 413 kJ/mol. A hybrid orbital is also lopsided — one big lobe and a small one behind — so it overlaps a partner better than a pure p orbital and makes a stronger bond. Hybridisation is a way of *describing* the bonding that matches the geometry; the atom does not go through the steps one by one.

### The three main types
| Hybrids | made from | number | angle | arrangement | examples |
|---|---|---|---|---|---|
| sp³ | s + 3 p | 4 | 109.5° | tetrahedral | $\\ce{CH4}$, $\\ce{NH3}$, $\\ce{H2O}$, diamond |
| sp² | s + 2 p | 3, and one p left | 120° | trigonal planar | $\\ce{BF3}$, carbon in ethene, graphite |
| sp | s + p | 2, and two p left | 180° | linear | gaseous $\\ce{BeCl2}$, carbon in ethyne and $\\ce{CO2}$ |

Read the hybridisation off the steric number from [[vsepr]]: four domains sp³, three sp², two sp — lone pairs included, so the nitrogen of ammonia and the oxygen of water are sp³ too. The p orbitals left over on sp² and sp atoms make the π bonds of double and triple bonds ([[sigma-pi-bonds]]).

### s character and bond angle
An $\\mathrm{sp}^n$ hybrid is one part s to $n$ parts p, so its **s character** is $1/(n+1)$: 25 % for sp³, 33 % for sp², 50 % for sp. More s character means a wider angle. For equivalent hybrids the angle between them satisfies

$$\\cos\\theta = -\\frac{1}{n}$$

giving 109.47° for $n = 3$, 120° for $n = 2$ and 180° for $n = 1$. Read backwards, the relation turns a measured angle into a hybridisation: the O–H bonds of water (104.5°) use hybrids with $n \\approx 4$, only 20 % s, which leaves more s character for the lone pairs.

s electrons are held closer to the nucleus than p electrons, so more s character makes shorter bonds and pulls electron density towards carbon: C–H bonds shorten from ethane (109 pm, sp³) to ethene (108 pm, sp²) to ethyne (106 pm, sp), and the C–H hydrogen becomes more acidic — $\\mathrm{p}K_a$ about 50, 44 and 25. That is why ethyne can be deprotonated to make acetylide ions.

### Beyond four, and its limits
Molecules such as $\\ce{PCl5}$ and $\\ce{SF6}$ used to be described with "sp³d" and "sp³d²" hybrids. Calculations show that d orbitals, much higher in energy, contribute little; these molecules are better described with bonds delocalised over several atoms. Use the steric number for their shapes and leave the d orbitals out. Heavier atoms also hybridise less: $\\ce{H2S}$ (92°) and $\\ce{PH3}$ (93.5°) bond through almost pure p orbitals.
`,
  ideas: [
    'Hybrid orbitals are mixtures of an atom\'s s and p orbitals that point along its bonds.',
    'sp³, sp² and sp hybrids point at 109.5°, 120° and 180°; the steric number tells which to use.',
    'Unhybridised p orbitals left on sp² and sp atoms form π bonds.',
    'More s character means wider angles, shorter bonds and more acidic C–H bonds; cos θ = −1/n links the two.',
    'Hybridisation describes a known geometry; it does not cause it.'
  ],
  pitfalls: [
    'Hybridisation causes the shape of a molecule — The shape comes from minimising the energy (VSEPR is a good guide). Hybrids are chosen afterwards to describe it.',
    'All atoms in a molecule have the same hybridisation — Assign each atom separately: in CH₃–C≡N the carbons are sp³ and sp, the nitrogen sp.',
    'SF₆ uses sp³d² hybrids — d orbitals are too high in energy to contribute much; the bonding is delocalised and partly ionic.'
  ],
  derivation: {
    title: 'Why cos θ = −1/n',
    steps: [
      { text: 'An spⁿ hybrid is one part s and $n$ parts p, the p orbital pointing along a unit vector $\\hat u$. Normalised:', tex: 'h = \\frac{1}{\\sqrt{1 + n}}\\left(s + \\sqrt{n}\\; p_{\\hat u}\\right)' },
      { text: 'Two hybrids on the same atom must not overlap (they are orthogonal). The s orbital overlaps itself fully and every p orbital not at all, and two p orbitals along $\\hat u_1$ and $\\hat u_2$ overlap by $\\hat u_1 \\cdot \\hat u_2 = \\cos\\theta$:', tex: '\\langle h_1 | h_2 \\rangle = \\frac{1 + n\\cos\\theta}{1 + n} = 0' },
      { text: 'Hence', tex: '\\cos\\theta = -\\frac{1}{n}, \\qquad \\text{s character} = \\frac{1}{1 + n}' }
    ],
    outro: '$n = 3$ gives 109.47°, $n = 2$ gives 120°, $n = 1$ gives 180°. The s character is the square of the coefficient of $s$.'
  },
  formulas: [
    {
      name: 'Angle between equivalent hybrids (Coulson)',
      expr: 'cos(theta) = -1/n', tex: '\\cos\\theta = -\\frac{1}{n}',
      vars: {
        theta: { name: 'angle between two equivalent hybrids', q: 'angle', unit: '°', min: 90, max: 180, tex: '\\theta' },
        n: { name: 'hybridisation index (the n of spⁿ)', value: 3, min: 1, max: 30 }
      },
      solveFor: 'theta',
      note: 'Defaults: sp³, 109.47°. Solve for $n$ to find the hybrids that match a measured angle (water, 104.5°: $n \\approx 4$).',
      practice: { unknowns: ['theta', 'n'] },
      stories: {
        theta: 'At what angle do two equivalent spⁿ hybrids point, with n = {n}?',
        n: 'Two equivalent bonds from one atom make an angle of {theta}. What hybridisation index n do their hybrids have?'
      }
    },
    {
      name: 's character of an spⁿ hybrid',
      expr: 's = 1/(1 + n)', tex: 's = \\frac{1}{1 + n}',
      vars: {
        s: { name: 'fraction of s character', q: 'ratio', unit: '%' },
        n: { name: 'hybridisation index (the n of spⁿ)', value: 2, min: 0.2, max: 30 }
      },
      solveFor: 's',
      note: 'sp: 50 %, sp²: 33 %, sp³: 25 %. Defaults: sp².',
      practice: { unknowns: ['s', 'n'] },
      stories: {
        s: 'What fraction of s character does an spⁿ hybrid with n = {n} have?',
        n: 'A hybrid orbital has {s} s character. What is its hybridisation index n?'
      }
    }
  ],
  examples: [
    {
      title: 'The hybrids of water',
      q: 'The bond angle of water is 104.5°. What hybridisation index and s character do the O–H bonding hybrids have?',
      steps: [
        '$\\cos 104.5° = -0.2504$.',
        '$n = -1/\\cos\\theta = 1/0.2504 = 3.99$: the bonds use about sp⁴ hybrids.',
        's character: $1/(1 + 3.99) = 0.20$, 20 %.',
        'Oxygen has 100 % of one s orbital to share out. The two bonds take 40 %, so the two lone pairs hold 60 % between them — they are s-rich and sit closer to the nucleus.'
      ],
      a: 'n ≈ 4 (about 20 % s); the lone pairs carry the extra s character.'
    },
    {
      title: 'Acetonitrile, CH₃–C≡N',
      q: 'Give the hybridisation of each carbon and of the nitrogen, and the C–C–N angle.',
      steps: [
        'The CH₃ carbon has four domains (three H, one C): sp³.',
        'The nitrile carbon has two domains (the CH₃ carbon and the nitrogen, however many bonds): sp.',
        'Nitrogen has two domains (the triple bond and a lone pair): sp.',
        'The sp carbon makes the C–C≡N unit linear, 180°. Its two leftover p orbitals and nitrogen\'s form the two π bonds of the triple bond.'
      ],
      a: 'sp³, sp and sp; the C–C–N chain is straight.'
    }
  ],
  quiz: [
    { q: 'What is the hybridisation of carbon in CO₂?', choices: ['sp', 'sp²', 'sp³', 'none'], a: 0,
      why: 'Two domains (two oxygens, no lone pair): sp, linear. Its two leftover p orbitals form the π bonds of the two C=O bonds.' },
    { q: 'What is the hybridisation of nitrogen in NH₃?', choices: ['sp', 'sp²', 'sp³', 'sp³d'], a: 2,
      why: 'Three bonds and one lone pair: four domains, sp³ (the lone pair sits in the fourth hybrid).' },
    { q: 'What angle do sp² hybrids make with each other?', choices: ['90°', '109.5°', '120°', '180°'], a: 2,
      why: 'Three equivalent hybrids in a plane: $\\cos\\theta = -1/2$, θ = 120°.' },
    { q: 'Carbon becomes tetrahedral because it hybridises; hybridisation is the cause of the shape.', a: false,
      why: 'The geometry is set by energy (electron pairs as far apart as possible). Hybridisation is the description that matches it.' },
    { q: 'What is the s character of an sp² hybrid, in per cent?', answer: 33.3,
      why: 'One s orbital shared with two p orbitals: $1/3 = 33.3\\ \\%$.' }
  ],
  applications: [
    'Describing the carbon skeletons of organic molecules: sp³ chains, sp² rings and double bonds, sp triple bonds.',
    'Explaining why ethyne can be deprotonated (acetylide chemistry) and ethane cannot.',
    'Understanding the materials of carbon: sp³ diamond, sp² graphite and graphene.',
    'Predicting bond lengths and reactivity from s character.'
  ],
  history: 'Linus Pauling introduced hybrid orbitals in 1931 to explain the tetrahedral carbon atom. Charles Coulson later derived the relation between s character and the angle between equivalent hybrids.',
  sim: 'bond-hybrid'
},

{
  id: 'sigma-pi-bonds', parent: 'molecular-shape', title: 'Sigma and pi bonds', level: 2,
  short: 'A σ bond comes from head-on overlap along the axis between two nuclei; a π bond from side-on overlap of parallel p orbitals above and below it. Single bonds are σ, double bonds σ + π, triple bonds σ + 2π.',
  keywords: ['sigma bond', 'pi bond', 'σ bond', 'π bond', 'overlap', 'double bond', 'triple bond', 'rotation', 'cis-trans isomerism', 'degree of unsaturation', 'ethene', 'ethyne', 'retinal'],
  prereq: ['hybridization', 'orbital-shapes'],
  related: ['bond-order-length', 'molecular-orbitals', 'hydrocarbons', 'stereoisomers', 'addition-alkenes', 'aromatic-compounds', 'resonance'],
  body: `
Two orbitals can overlap in two quite different ways.

### σ bonds: head-on
A **σ (sigma) bond** forms when orbitals overlap end to end, along the line joining the two nuclei: two s orbitals in $\\ce{H2}$, an sp³ hybrid with an s orbital in a C–H bond, two hybrids in a C–C bond, or two p orbitals pointing at each other in $\\ce{F2}$. The electron density is concentrated on the axis and is the same all the way round it — cylindrically symmetric. Twisting one end of the bond does not change the overlap, so groups joined by a single bond turn almost freely: the two ends of ethane rotate past a barrier of only about 12 kJ/mol, billions of times a second at room temperature.

### π bonds: side-on
A **π (pi) bond** forms when two parallel p orbitals overlap sideways. Its electron density lies in two lobes, one above and one below the bond axis, with a node — zero density — on the axis itself. The two lobes belong to *one* bond holding one pair of electrons. The sideways overlap is smaller than head-on overlap, so for carbon a π bond is weaker than a σ bond, and its electrons, sitting further out, are easier to reach: alkenes react by adding reagents across the double bond ([[addition-alkenes]]).

### Double and triple bonds
- A single bond is one σ bond.
- A double bond is one σ bond plus one π bond.
- A triple bond is one σ bond plus two π bonds at right angles to each other.

In ethene each carbon is sp² ([[hybridization]]): its three hybrids make σ bonds to two hydrogens and the other carbon, and the leftover p orbitals, standing perpendicular to the plane, overlap into the π bond. For that overlap the p orbitals must be parallel, which holds all six atoms in one plane. In ethyne each carbon is sp, and two pairs of p orbitals give two π bonds that wrap the C–C axis in a cylinder of electron density.

### No rotation about a double bond
Twisting one end of a C=C by 90° turns the p orbitals perpendicular and destroys the π overlap; that costs about 270 kJ/mol, far beyond thermal energy. So groups on a double bond stay where they are, and *cis* and *trans* isomers are different compounds: *cis*-but-2-ene boils at 3.7 °C and *trans*-but-2-ene at 0.9 °C ([[stereoisomers]]). Vision relies on exactly this: a photon absorbed by retinal in the eye briefly breaks the π bond of its 11-*cis* double bond, the molecule snaps to the *trans* form, and that change of shape starts the nerve signal.

### Counting
σ bonds = the number of pairs of bonded atoms. π bonds = the extra bonds: one per double bond, two per triple. Acrylonitrile, H₂C=CH–C≡N, has 6 σ and 3 π bonds. From a molecular formula alone the **degree of unsaturation** — rings plus π bonds — is

$$U = \\frac{2n_\\text{C} + 2 + n_\\text{N} - n_\\text{H} - n_\\text{X}}{2}$$

(X = halogens; oxygen and sulfur do not count). Benzene, $\\ce{C6H6}$: $U = 4$, one ring and three π bonds. Caffeine, $\\ce{C8H10N4O2}$: $U = 6$, two rings and four π bonds.
`,
  ideas: [
    'σ bonds come from head-on overlap and lie along the internuclear axis; they allow free rotation.',
    'π bonds come from side-on overlap of parallel p orbitals, with density above and below the axis and a node on it.',
    'A double bond is σ + π; a triple bond is σ + 2π.',
    'Rotation about a double bond would break the π bond, so cis and trans isomers do not interconvert.',
    'Rings plus π bonds can be counted from the molecular formula: U = (2C + 2 + N − H − X)/2.'
  ],
  pitfalls: [
    'A double bond is two identical bonds — It is one σ bond and one π bond, with different shapes and strengths.',
    'The two lobes of a π bond are two bonds — They are two halves of one orbital holding one electron pair.',
    'Groups on a double bond can swap sides by rotating — Rotation would break the π bond (about 270 kJ/mol), so cis and trans isomers keep their shapes at room temperature.'
  ],
  formulas: [
    {
      name: 'Degree of unsaturation (rings + π bonds)',
      expr: 'U = (2*nC + 2 + nN - nH - nX)/2', tex: 'U = \\frac{2n_\\text{C} + 2 + n_\\text{N} - n_\\text{H} - n_\\text{X}}{2}',
      vars: {
        U: { name: 'degree of unsaturation (rings + π bonds)', int: true },
        nC: { name: 'carbon atoms', int: true, value: 8, tex: 'n_\\text{C}' },
        nN: { name: 'nitrogen atoms', int: true, value: 4, tex: 'n_\\text{N}' },
        nH: { name: 'hydrogen atoms', int: true, value: 10, tex: 'n_\\text{H}' },
        nX: { name: 'halogen atoms', int: true, value: 0, tex: 'n_\\text{X}' }
      },
      solveFor: 'U',
      note: 'Oxygen and sulfur do not change it. Defaults: caffeine, C₈H₁₀N₄O₂ — two rings and four π bonds.',
      practice: { unknowns: ['U', 'nH'] },
      stories: {
        U: 'A compound has {nC} carbon, {nH} hydrogen, {nN} nitrogen and {nX} halogen atoms (plus any oxygen). How many rings plus π bonds does it contain?',
        nH: 'A compound with {nC} carbon, {nN} nitrogen and {nX} halogen atoms has {U} rings plus π bonds. How many hydrogen atoms does it have?'
      }
    },
    {
      name: 'Estimated strength of a π bond',
      expr: 'Epi = Ed - Es', tex: 'E_\\pi = E_\\text{double} - E_\\text{single}',
      vars: {
        Epi: { name: 'energy of the π bond', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_\\pi' },
        Ed: { name: 'double-bond enthalpy', q: 'molarenergy', unit: 'kJ/mol', value: 614, tex: 'E_\\text{double}' },
        Es: { name: 'single-bond (σ) enthalpy', q: 'molarenergy', unit: 'kJ/mol', value: 347, tex: 'E_\\text{single}' }
      },
      solveFor: 'Epi',
      note: 'A rough split using average bond enthalpies. Defaults: C=C and C–C, giving about 267 kJ/mol — close to the measured barrier for twisting a C=C bond.',
      practice: { unknowns: ['Epi'] },
      stories: {
        Epi: 'A double bond has a bond enthalpy of {Ed} and the single bond between the same atoms {Es}. Estimate the strength of the π bond.'
      }
    }
  ],
  examples: [
    {
      title: 'Counting bonds in acrylonitrile',
      q: 'Acrylonitrile, H₂C=CH–C≡N, is the monomer of acrylic fibres. Count its σ and π bonds and give the hybridisation of each carbon.',
      steps: [
        'Pairs of bonded atoms: two C–H on the first carbon, one C–H on the second, C=C, C–C, C≡N: six σ bonds.',
        'Extra bonds: one in C=C, two in C≡N: three π bonds.',
        'The first two carbons have three domains each: sp². The nitrile carbon has two: sp.',
        'Check with the formula C₃H₃N: $U = (6 + 2 + 1 - 3)/2 = 3$ — no rings, three π bonds.'
      ],
      a: '6 σ and 3 π bonds; the carbons are sp², sp² and sp.'
    },
    {
      title: 'Rings or double bonds?',
      q: 'What does the degree of unsaturation say about $\\ce{C6H6}$ and $\\ce{C6H12}$?',
      steps: [
        '$\\ce{C6H6}$: $U = (12 + 2 - 6)/2 = 4$. Benzene has one ring and three π bonds.',
        '$\\ce{C6H12}$: $U = (12 + 2 - 12)/2 = 1$. Either one ring (cyclohexane) or one C=C (a hexene) — the formula cannot tell which; bromine water can, since only the alkene decolourises it.'
      ],
      a: 'Benzene: 4 (one ring, three π bonds). C₆H₁₂: 1 (a ring or a double bond).'
    }
  ],
  quiz: [
    { q: 'How many σ and π bonds does hydrogen cyanide, H–C≡N, contain?', choices: ['3 σ, 0 π', '2 σ, 2 π', '1 σ, 3 π', '2 σ, 1 π'], a: 1,
      why: 'Two pairs of bonded atoms (H–C and C–N) give two σ bonds; the triple bond adds two π bonds.' },
    { q: 'About which bond can the two ends rotate freely at room temperature?', choices: ['C=C in ethene', 'C–C in ethane', 'C≡C in ethyne (the ends are linear anyway)', 'the C=O bond in methanal'], a: 1,
      why: 'A σ bond is cylindrically symmetric, so rotation keeps the overlap (barrier ≈ 12 kJ/mol). Twisting a double bond would break its π bond.' },
    { q: 'A π bond can exist between two atoms without a σ bond between them.', a: false,
      why: 'The side-on overlap needs the atoms close together, which the σ bond provides. Every double or triple bond contains exactly one σ bond.' },
    { q: 'What is the degree of unsaturation of C₄H₆?', answer: 2,
      why: '$(2\\times4 + 2 - 6)/2 = 2$: two π bonds (buta-1,3-diene, but-2-yne), or a ring plus a π bond (cyclobutene).' },
    { q: 'Where is the electron density of a π bond?', choices: ['along the axis between the nuclei', 'in two lobes above and below the axis, with a node on it', 'on the outer sides of the two atoms', 'spread evenly around each atom'], a: 1,
      why: 'Side-on overlap of parallel p orbitals puts the density off the axis, on both sides of the node.' }
  ],
  applications: [
    'Cis–trans isomerism in fats (cis and trans fatty acids) and in drugs.',
    'Vision: the light-driven cis–trans switch of retinal.',
    'Addition reactions and polymerisation of alkenes, which open π bonds.',
    'Reading a molecular formula: rings plus π bonds from the degree of unsaturation.'
  ],
  sim: { id: 'bond-hybrid', params: { preset: 'C2H4' } }
},

{
  id: 'molecular-orbitals', parent: 'molecular-shape', title: 'Molecular orbital theory', level: 3,
  short: 'Atomic orbitals combine into orbitals spread over the whole molecule: bonding ones below the atomic levels and antibonding ones above. Filling them with electrons gives the bond order, and explains why O₂ is magnetic and He₂ does not exist.',
  keywords: ['molecular orbital', 'MO theory', 'LCAO', 'bonding orbital', 'antibonding orbital', 'bond order', 'sigma star', 'pi star', 'paramagnetism', 'oxygen', 'HOMO', 'LUMO', 's-p mixing', 'diatomic molecules'],
  prereq: ['covalent-bonds', 'electron-configuration', 'physics:wavefunction', 'physics:pauli-exclusion'],
  related: ['bond-order-length', 'sigma-pi-bonds', 'hybridization', 'metallic-bonding', 'crystal-field-theory', 'physics:band-theory', 'physics:electron-spin', 'physics:magnetic-materials'],
  body: `
Lewis structures and hybrid orbitals keep each electron pair between two atoms. **Molecular orbital (MO) theory** lets electrons belong to the whole molecule. Electrons are waves ([[physics:wavefunction|wavefunctions]]), and when atoms approach, their atomic orbitals combine — a *linear combination of atomic orbitals* (LCAO) — into molecular orbitals.

### Bonding and antibonding
Two hydrogen 1s orbitals can combine in two ways. Added in phase they reinforce between the nuclei: the **bonding orbital** σ1s concentrates electron density where both nuclei attract it and lies *below* the atomic level. Subtracted, they cancel between the nuclei: the **antibonding orbital** σ*1s has a node there, pushes density outwards, and lies *above* the atomic level — by more than the bonding orbital is lowered. Always, $n$ atomic orbitals give $n$ molecular orbitals.

Electrons fill molecular orbitals just as they fill atomic ones: lowest first, at most two per orbital with opposite spins ([[physics:pauli-exclusion|Pauli]]), singly into equal-energy orbitals before pairing (Hund). The **bond order** is

$$\\text{bond order} = \\frac{n_\\text{bonding} - n_\\text{antibonding}}{2}$$

$\\ce{H2}$: two electrons in σ1s, bond order 1. $\\ce{He2}$: two in σ1s and two in σ*1s, bond order 0 — and since the antibonding pair costs more than the bonding pair gains, two helium atoms repel: $\\ce{He2}$ does not exist. $\\ce{He2+}$, with three electrons (bond order ½), does exist in gas discharges.

### The second period
The 2s orbitals give σ2s and σ*2s. The three 2p orbitals on each atom give six more: the pair pointing at each other overlaps head-on into σ2p and σ*2p; the two side-on pairs give two π2p and two π*2p orbitals. For $\\ce{O2}$, $\\ce{F2}$ and $\\ce{Ne2}$ the order is σ2s < σ*2s < σ2p < π2p < π*2p < σ*2p. From $\\ce{Li2}$ to $\\ce{N2}$ the 2s and 2p levels are close enough in energy that the two σ orbitals mix, pushing σ2p *above* π2p.

| Molecule | valence electrons | bond order | unpaired | length (pm) | bond energy (kJ/mol) |
|---|---|---|---|---|---|
| Li₂ | 2 | 1 | 0 | 267 | 102 |
| Be₂ | 4 | 0 | 0 | 245 | about 11 (barely bound) |
| B₂ | 6 | 1 | 2 | 159 | 290 |
| C₂ | 8 | 2 | 0 | 124 | 600 |
| N₂ | 10 | 3 | 0 | 110 | 942 |
| O₂ | 12 | 2 | 2 | 121 | 494 |
| F₂ | 14 | 1 | 0 | 142 | 155 |
| Ne₂ | 16 | 0 | 0 | — | not bound |

The bond order rises to 3 at nitrogen and falls again as antibonding orbitals fill, and the bond energies follow.

### Why oxygen is magnetic
In $\\ce{O2}$ the last two electrons go into the two equal-energy π* orbitals — one each, with parallel spins. Two unpaired electrons make oxygen **paramagnetic**: liquid oxygen poured between the poles of a strong magnet hangs there. The Lewis structure O=O, with every electron paired, cannot explain this; MO theory predicts it. Adding or removing electrons changes the bond in the way the diagram says: $\\ce{O2+}$ (an antibonding electron removed) has bond order 2.5 and a shorter bond, 112 pm; the superoxide ion $\\ce{O2-}$ has 1.5 (about 133 pm) and the peroxide ion $\\ce{O2^2-}$ 1 (149 pm). For nitrogen it goes the other way: the electron removed from $\\ce{N2}$ comes from a *bonding* orbital, so $\\ce{N2+}$ is weaker than $\\ce{N2}$.

### Beyond the diatomics
- In a molecule of two different atoms (CO, NO, HF) the orbitals of the more electronegative atom lie lower and the MOs are lopsided. The highest occupied orbital of CO lies mostly on carbon — which is why CO bonds to metals through carbon.
- The **HOMO** and **LUMO** (highest occupied and lowest unoccupied orbitals) govern reactivity and colour. In long chains of alternating double bonds the gap between them falls into the visible range: β-carotene is orange.
- Benzene's π electrons occupy orbitals spread over all six carbons, and in a solid the orbitals of $10^{23}$ atoms merge into bands ([[metallic-bonding]], [[physics:band-theory|band theory]]).
`,
  ideas: [
    'Atomic orbitals combine into as many molecular orbitals: bonding ones (density between the nuclei, lower energy) and antibonding ones (a node, higher energy).',
    'Electrons fill MOs by the same rules as atoms: lowest first, two per orbital, Hund\'s rule for equal energies.',
    'Bond order = (bonding − antibonding electrons)/2; zero means no bond (He₂, Ne₂).',
    'O₂ has two unpaired electrons in its π* orbitals, so it is paramagnetic — something Lewis structures cannot show.',
    'From Li₂ to N₂, s–p mixing lifts σ2p above π2p; from O₂ on the order is reversed.'
  ],
  pitfalls: [
    'Antibonding orbitals are always empty, so they do not matter — Electrons in them cancel bonding: He₂ and Ne₂ are not bound, and F₂ is weak, because of filled antibonding orbitals.',
    'The Lewis structure O=O is the whole story of oxygen — It pairs every electron, but O₂ has two unpaired electrons and is paramagnetic.',
    'The σ2p orbital always lies below the π2p orbitals — Only from O₂ onwards. In B₂, C₂ and N₂ s–p mixing pushes σ2p above π2p, which is why B₂ is paramagnetic.'
  ],
  derivation: {
    title: 'Bonding and antibonding energies from two atomic orbitals',
    steps: [
      { text: 'Write the molecular orbital as a mixture of the two atomic orbitals:', tex: '\\psi = c_1 \\phi_1 + c_2 \\phi_2' },
      { text: 'Choosing $c_1$ and $c_2$ to make the energy stationary gives two equations. Here $\\alpha$ is the energy of an electron in either atomic orbital, $\\beta$ the interaction between them and $S$ their overlap:', tex: '\\begin{aligned} (\\alpha - E)\\,c_1 + (\\beta - ES)\\,c_2 &= 0 \\\\ (\\beta - ES)\\,c_1 + (\\alpha - E)\\,c_2 &= 0 \\end{aligned}' },
      { text: 'They have a solution other than $c_1 = c_2 = 0$ only if $(\\alpha - E)^2 = (\\beta - ES)^2$, that is $\\alpha - E = \\pm(\\beta - ES)$:', tex: 'E_\\pm = \\frac{\\alpha \\pm \\beta}{1 \\pm S}' },
      { text: 'Measured from the atomic level:', tex: 'E_+ - \\alpha = \\frac{\\beta - \\alpha S}{1 + S}, \\qquad E_- - \\alpha = -\\frac{\\beta - \\alpha S}{1 - S}' }
    ],
    outro: 'The two shifts have the same numerator ($\\beta - \\alpha S$ is negative) but the antibonding one is divided by the smaller $1 - S$: it rises more than the bonding orbital falls. That is why a filled bonding–antibonding pair, as in He₂, pushes the atoms apart.'
  },
  formulas: [
    {
      name: 'Bond order from MO occupancy',
      expr: 'BO = (nb - na)/2', tex: '\\text{BO} = \\frac{n_\\text{b} - n_\\text{a}}{2}',
      vars: {
        BO: { name: 'bond order', tex: '\\text{BO}', signed: true },
        nb: { name: 'electrons in bonding orbitals', int: true, value: 8, tex: 'n_\\text{b}' },
        na: { name: 'electrons in antibonding orbitals', int: true, value: 2, tex: 'n_\\text{a}' }
      },
      solveFor: 'BO',
      note: 'Defaults: N₂ — σ2s² σ*2s² π2p⁴ σ2p², eight bonding and two antibonding valence electrons: a triple bond.',
      practice: { unknowns: ['BO', 'na'] },
      stories: {
        BO: 'A molecule has {nb} electrons in bonding orbitals and {na} in antibonding orbitals. What is its bond order?',
        na: 'A molecule with {nb} bonding electrons has bond order {BO}. How many electrons are in antibonding orbitals?'
      }
    },
    {
      name: 'Energy of a bonding orbital (two identical atoms)',
      expr: 'Eb = (alpha + beta)/(1 + S)', tex: 'E_+ = \\frac{\\alpha + \\beta}{1 + S}',
      vars: {
        Eb: { name: 'energy of the bonding orbital', q: 'energy', unit: 'eV', signed: true, tex: 'E_+' },
        alpha: { name: 'energy of the atomic orbital (Coulomb integral)', q: 'energy', unit: 'eV', value: -13.6, signed: true, tex: '\\alpha' },
        beta: { name: 'interaction energy (resonance integral, negative)', q: 'energy', unit: 'eV', value: -8, signed: true, tex: '\\beta' },
        S: { name: 'overlap of the two atomic orbitals', value: 0.25, min: 0, max: 0.99 }
      },
      solveFor: 'Eb',
      note: 'The two-orbital LCAO result. The defaults are illustrative, of the size found for hydrogen-like orbitals: the bonding orbital lies 3.7 eV below the atomic level.',
      practice: { unknowns: ['Eb'] },
      stories: {
        Eb: 'Two identical atomic orbitals of energy {alpha} interact with β = {beta} and overlap S = {S}. Where does the bonding orbital lie?'
      }
    },
    {
      name: 'Energy of an antibonding orbital',
      expr: 'Ea = (alpha - beta)/(1 - S)', tex: 'E_- = \\frac{\\alpha - \\beta}{1 - S}',
      vars: {
        Ea: { name: 'energy of the antibonding orbital', q: 'energy', unit: 'eV', signed: true, tex: 'E_-' },
        alpha: { name: 'energy of the atomic orbital (Coulomb integral)', q: 'energy', unit: 'eV', value: -13.6, signed: true, tex: '\\alpha' },
        beta: { name: 'interaction energy (resonance integral, negative)', q: 'energy', unit: 'eV', value: -8, signed: true, tex: '\\beta' },
        S: { name: 'overlap of the two atomic orbitals', value: 0.25, min: 0, max: 0.99 }
      },
      solveFor: 'Ea',
      note: 'With the same illustrative values the antibonding orbital lies 6.1 eV above the atomic level — raised more than the bonding one is lowered, because of the overlap $S$.',
      practice: { unknowns: ['Ea'] },
      stories: {
        Ea: 'Two identical atomic orbitals of energy {alpha} interact with β = {beta} and overlap S = {S}. Where does the antibonding orbital lie?'
      }
    }
  ],
  examples: [
    {
      title: 'Oxygen and its ions',
      q: 'Use the MO diagram to find the bond orders of $\\ce{O2+}$, $\\ce{O2}$, $\\ce{O2-}$ and $\\ce{O2^2-}$, and say which are paramagnetic.',
      steps: [
        '$\\ce{O2}$ has 12 valence electrons: σ2s² σ*2s² σ2p² π2p⁴ π*2p². Bonding 8, antibonding 4: bond order 2, with the two π* electrons unpaired.',
        '$\\ce{O2+}$ loses one π* electron: bond order $(8 - 3)/2 = 2.5$, one unpaired electron.',
        '$\\ce{O2-}$ gains one: π*³, bond order 1.5, one unpaired. $\\ce{O2^2-}$: π*⁴, bond order 1, all paired.',
        'Measured lengths follow: 112, 121, about 133 and 149 pm.'
      ],
      a: 'Bond orders 2.5, 2, 1.5 and 1; all but the peroxide ion are paramagnetic.'
    },
    {
      title: 'Why He₂ falls apart',
      q: 'With α = −13.6 eV, β = −8 eV and S = 0.25, compare the energy of four electrons in the bonding and antibonding orbitals of He₂ with four electrons on two separate atoms.',
      steps: [
        'Bonding: $E_+ = (-13.6 - 8)/1.25 = -17.28$ eV. Antibonding: $E_- = (-13.6 + 8)/0.75 = -7.47$ eV.',
        'He₂: $2(-17.28) + 2(-7.47) = -49.49$ eV. Two separate atoms: $4 \\times (-13.6) = -54.4$ eV.',
        'The molecule is 4.9 eV *higher*: the filled antibonding orbital costs more than the bonding orbital gains, so the atoms repel.',
        'H₂, with only the two bonding electrons, gains $2(-17.28) - 2(-13.6) = -7.4$ eV in this model.'
      ],
      a: 'He₂ would lie about 5 eV above two free atoms (bond order 0, net repulsion); H₂ is bound.'
    }
  ],
  quiz: [
    { q: 'What is the bond order of N₂ from its MO configuration?', answer: 3,
      why: 'σ2s² σ*2s² π2p⁴ σ2p²: 8 bonding and 2 antibonding electrons, $(8 - 2)/2 = 3$.' },
    { q: 'Which of these molecules is paramagnetic?', choices: ['N₂', 'O₂', 'F₂', 'C₂'], a: 1,
      why: 'O₂ has two unpaired electrons in its two π* orbitals. N₂, F₂ and C₂ have all their electrons paired.' },
    { q: 'One electron is removed from N₂ and one from O₂. What happens to the bonds?', choices: ['both weaken', 'both strengthen', 'N₂⁺ weakens, O₂⁺ strengthens', 'N₂⁺ strengthens, O₂⁺ weakens'], a: 2,
      why: 'N₂ loses a bonding (σ2p) electron: bond order 3 → 2.5. O₂ loses an antibonding (π*) electron: 2 → 2.5.' },
    { q: 'An antibonding orbital lies further above the atomic orbitals than its bonding partner lies below them.', a: true,
      why: 'With overlap S the energies are (α ± β)/(1 ± S); the antibonding one is raised more. That is why a filled bonding–antibonding pair is net repulsive.' },
    { q: 'Four atomic orbitals combine. How many molecular orbitals result?', choices: ['2', '4', '8', 'it depends on the number of electrons'], a: 1,
      why: 'Orbitals are conserved: n atomic orbitals always give n molecular orbitals, whatever the electrons do.' }
  ],
  applications: [
    'Explaining the magnetism of oxygen and the colours of many molecules (HOMO–LUMO gaps).',
    'Understanding how CO and other ligands bind to metals, including the iron of haemoglobin.',
    'Band theory of metals and semiconductors, the MO picture for 10²³ atoms.',
    'Computational chemistry: most quantum-chemistry programs work with molecular orbitals.'
  ],
  history: 'Friedrich Hund and Robert Mulliken developed molecular-orbital theory in the late 1920s, and John Lennard-Jones introduced the LCAO approach in 1929. Mulliken received the 1966 Nobel Prize in Chemistry for it.',
  sim: 'bond-mo'
}

);
