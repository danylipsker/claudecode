/* HYPER-CHEMISTRY · content/organic-structure.js — carbon skeletons, hydrocarbons,
 * functional groups, names, and isomers in two and three dimensions. */
Hyper.add(

{
  id: 'carbon-bonding', parent: 'organic-structure', title: 'Carbon: chains, rings and hybrid orbitals', level: 1,
  short: 'Carbon makes four strong bonds and bonds readily to itself, so it builds chains, branches and rings of any size. Whether each carbon is sp³, sp² or sp decides the shape of its corner of the molecule.',
  keywords: ['carbon', 'catenation', 'tetravalent', 'sp3', 'sp2', 'sp', 'skeletal formula', 'displayed formula', 'condensed formula', 'wedge and dash', 'conformation', 'staggered', 'eclipsed', 'gauche', 'anti', 'Newman projection', 'ring strain', 'chair', 'axial', 'equatorial', 'cyclohexane'],
  prereq: ['valence-electrons', 'covalent-bonds', 'hybridization', 'vsepr'],
  related: ['sigma-pi-bonds', 'bond-order-length', 'hydrocarbons', 'structural-isomers', 'stereoisomers', 'math:exponential-functions'],
  body: `
Organic chemistry is the chemistry of carbon compounds — well over a hundred million of them have been described, the great majority of all known substances. The reason is carbon itself.

- It has **four valence electrons** and sits in the middle of the electronegativity scale, so it neither gives nor takes electrons easily: it **shares** them, making four covalent bonds.
- Its bonds to itself are **strong**: a C–C bond needs about 346 kJ/mol to break, about as much as C–O or C–N. So a chain of carbons is as sturdy as its links to anything else, and chains, branches and rings of any length are stable. This self-linking is called **catenation**.

Silicon, just below carbon, also makes four bonds, but Si–Si (about 226 kJ/mol) is much weaker than Si–O (about 450 kJ/mol). In air, silicon chains give way to silicon–oxygen networks — sand and rock — which is why there is no silicon version of organic chemistry.

### Three kinds of carbon
Count what surrounds a carbon — atoms and lone pairs — and [[vsepr|VSEPR]] and [[hybridization|hybridisation]] fix its shape:

| Carbon with | Hybrid | Shape | Angle | Example | C–C bond |
|---|---|---|---|---|---|
| four single bonds | sp³ | tetrahedral | 109.5° | ethane | 1.54 Å, 346 kJ/mol |
| a double bond | sp² | trigonal planar | 120° | ethene | C=C 1.34 Å, 614 kJ/mol |
| a triple bond | sp | linear | 180° | ethyne | C≡C 1.20 Å, 839 kJ/mol |

A double bond is not twice a single bond: 614 kJ/mol is less than 2 × 346. Its second part, the [[sigma-pi-bonds|π bond]], is weaker than the σ bond and sticks out above and below the molecule — the reason alkenes react so readily.

### Drawing organic molecules
The molecular formula $\\ce{C2H6O}$ does not say which compound you mean (it could be ethanol or methoxymethane). Chemists use:
- **displayed** formulas, with every bond drawn;
- **condensed** formulas, such as $\\ce{CH3CH2OH}$;
- **skeletal** formulas, the everyday shorthand: a zigzag of lines in which every corner and every end is a carbon, and each carbon carries enough hydrogens (not drawn) to make four bonds. Other atoms and their hydrogens are written in: ethanol is a short line ending in OH.
- In three dimensions, a **solid wedge** points towards you and a **hashed wedge** away.

### Turning about single bonds
A σ bond is symmetrical about its axis, so the two ends can turn — but not quite freely. Looking along the C–C bond of ethane (a **Newman projection**), the hydrogens are either **staggered** or **eclipsed**; eclipsed costs 12 kJ/mol, mostly the repulsion of the bonding electron pairs. At room temperature $RT$ is 2.5 kJ/mol, so the barrier is only about five $RT$: each molecule turns some $10^{10}$ times a second. These **conformations** interconvert far too fast to be separated — they are one compound.

In butane the two methyl groups make the difference larger. The **anti** form (methyls opposite, 180°) is lowest; the two **gauche** forms (60°) are 3.8 kJ/mol higher because the methyls touch; eclipsing the methyls costs about 19 kJ/mol. At 25 °C about 70 % of butane molecules are anti at any instant. Rotation about a **double** bond, by contrast, would break the π bond — about 270 kJ/mol — so it does not happen at room temperature, and that is what makes [[stereoisomers|cis and trans isomers]] possible.

### Rings
A flat ring of three carbons forces 60° angles on atoms that want 109.5°: cyclopropane is **strained** by about 115 kJ/mol and opens easily. Cyclohexane escapes strain completely by puckering into a **chair**, with angles near 111° and every bond staggered. Each carbon then has one **axial** hydrogen, parallel to the ring's axis, and one **equatorial**, pointing outwards. The chair flips into its mirror chair about $10^5$ times a second at room temperature, swapping axial and equatorial; a substituent prefers the roomier equatorial position (methylcyclohexane is 95 % equatorial). Six-membered rings are everywhere in nature — sugars, steroids, the fragrance of menthol — because they are unstrained.

> [!fact] The same element gives diamond (every carbon sp³, a rigid three-dimensional network, the hardest natural material), graphite and graphene (sp² sheets whose delocalised electrons conduct), and the football-shaped fullerenes.
`,
  ideas: [
    'Carbon makes four covalent bonds and strong bonds to itself, so it forms chains, branches and rings.',
    'Four single bonds make a carbon sp³ and tetrahedral (109.5°); a double bond makes it sp² and planar (120°); a triple bond makes it sp and linear (180°).',
    'In a skeletal formula every corner and end is a carbon carrying enough hydrogens to make four bonds.',
    'Groups turn about single bonds (conformations interconvert billions of times a second) but not about double bonds.',
    'Small rings are strained; cyclohexane is strain-free because it puckers into a chair with axial and equatorial positions.'
  ],
  pitfalls: [
    'The angles in a skeletal formula are the real ones — The zigzag is a drawing convention. An sp³ carbon has 109.5° angles in three dimensions, and cyclohexane is a puckered chair, not a flat hexagon.',
    'Staggered and eclipsed ethane are two different compounds — They are conformations of one molecule, interconverting about 10¹⁰ times a second. Only rotation about a double bond is blocked.',
    'A double bond is twice as strong as a single bond — 614 against 346 kJ/mol. The π part is weaker than the σ part, which is why alkenes add other molecules across the double bond.'
  ],
  formulas: [
    {
      name: 'Population ratio of two conformers',
      expr: 'r = g*exp(-dE/(R*T))', tex: 'r = g\\,\\exp\\!\\left(-\\frac{\\Delta E}{R\\,T}\\right)',
      vars: {
        r: { name: 'molecules in the higher-energy form per molecule in the lower' },
        g: { name: 'number of equivalent higher-energy forms', int: true, value: 2 },
        dE: { name: 'energy difference', q: 'molarenergy', unit: 'kJ/mol', value: 3.8, tex: '\\Delta E' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298 }
      },
      note: 'The Boltzmann distribution applied to conformers that interconvert quickly. Defaults: gauche against anti butane (two gauche forms, 3.8 kJ/mol higher). The fraction in the lower form is $1/(1 + r)$.',
      practice: { unknowns: ['r', 'dE', 'T'] },
      stories: {
        r: 'Butane\'s two gauche forms lie {dE} above the anti form. At {T}, how many gauche molecules are there per anti molecule?',
        dE: 'At {T}, a molecule is found in its two equivalent gauche forms {r} times as often as in its anti form. How much higher in energy is gauche?'
      }
    },
    {
      name: 'Ring strain from the heat of combustion',
      expr: 'Es = qc - n*q0', tex: 'E_{\\text{strain}} = q_c - n\\,q_0',
      vars: {
        Es: { name: 'strain energy of the ring', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: 'E_{\\text{strain}}' },
        qc: { name: 'heat released on burning one mole of the cycloalkane (gas)', q: 'molarenergy', unit: 'kJ/mol', value: 2091, tex: 'q_c' },
        n: { name: 'number of CH₂ groups in the ring', int: true, value: 3 },
        q0: { name: 'heat of combustion of one unstrained CH₂', q: 'molarenergy', unit: 'kJ/mol', value: 658.6, fixed: true, tex: 'q_0' }
      },
      note: 'Every CH₂ in a long, unstrained chain releases 658.6 kJ/mol on burning; a ring that releases more stores the difference as strain. Defaults: cyclopropane.',
      practice: { unknowns: ['Es', 'qc'] },
      stories: {
        Es: 'A cycloalkane with {n} CH₂ groups releases {qc} when a mole of it burns. How much strain energy does its ring hold?',
        qc: 'A ring of {n} CH₂ groups has a strain energy of {Es}. How much heat does a mole of it release on burning?'
      }
    },
    {
      name: 'Angle strain of a flat ring',
      expr: 'delta = t - pi*(n - 2)/n', tex: '\\delta = \\theta_{\\text{tet}} - \\frac{(n-2)\\,180^\\circ}{n}',
      vars: {
        delta: { name: 'how far the ring angle is squeezed below the tetrahedral angle', q: 'angle', unit: '°', signed: true, tex: '\\delta' },
        t: { name: 'tetrahedral angle', q: 'angle', unit: '°', value: 109.5, fixed: true, tex: '\\theta_{\\text{tet}}' },
        n: { name: 'number of atoms in the ring', int: true, value: 3, min: 3, max: 12 }
      },
      note: 'Baeyer\'s 1885 idea: a planar ring of $n$ atoms has the angles of a regular polygon. It explains three- and four-membered rings well; from six atoms up, real rings pucker and the strain disappears (a negative δ means a flat ring would be too wide, not strained).',
      practice: { unknowns: ['delta'] },
      stories: { delta: 'By how much would the angles of a flat ring of {n} carbon atoms fall short of the tetrahedral angle?' }
    }
  ],
  examples: [
    {
      title: 'Reading a skeletal formula',
      q: 'A skeletal formula shows a zigzag of four lines; the far end of the last line is labelled OH. What is the molecular formula?',
      steps: [
        'Four lines have five ends and corners. The last one carries a label, so it is the oxygen; the other four, unlabelled, are carbons.',
        'Hydrogens on each carbon make its bonds up to four: the end carbon has one bond drawn, so it is $\\ce{CH3}$; the two middle carbons have two, so each is $\\ce{CH2}$; the carbon carrying the OH has two ($\\ce{C-C}$ and $\\ce{C-O}$), so it is $\\ce{CH2}$ too.',
        'Total: 4 C, $3 + 2 + 2 + 2 = 9$ H on carbon plus 1 on oxygen, and 1 O.'
      ],
      a: '$\\ce{C4H10O}$: butan-1-ol, $\\ce{CH3CH2CH2CH2OH}$.'
    },
    {
      title: 'How much butane is anti?',
      q: 'The gauche forms of butane lie 3.8 kJ/mol above the anti form. What fraction of molecules is anti at 25 °C, at 150 °C and at −100 °C?',
      steps: [
        { text: 'There are two gauche forms, so', tex: 'r = 2\\,e^{-3800/(8.314 \\times 298.15)} = 2 \\times 0.216 = 0.432' },
        'Anti fraction at 25 °C: $1/(1 + 0.432) = 0.698$, about 70 %.',
        'At 423 K: $r = 2\\,e^{-1.080} = 0.679$, anti fraction 60 %. At 173 K: $r = 0.143$, anti fraction 87.5 %.',
        'Heating spreads molecules into the higher-energy forms; cooling gathers them into the lowest one.'
      ],
      a: 'About 70 % anti at 25 °C, 60 % at 150 °C and 88 % at −100 °C.'
    },
    {
      title: 'Why cyclopropane is reactive',
      q: 'Burning one mole of cyclopropane gas releases 2091 kJ. Unstrained $\\ce{CH2}$ groups release 658.6 kJ/mol each. How much strain does the ring hold?',
      steps: [
        'Three unstrained $\\ce{CH2}$ groups would release $3 \\times 658.6 = 1975.8$ kJ/mol.',
        'The ring releases $2091 - 1976 = 115$ kJ/mol more: that extra energy was stored in the bent bonds.',
        'Per $\\ce{CH2}$ that is 38 kJ/mol — a sizeable fraction of a C–C bond, which is why cyclopropane rings open in reactions that leave ordinary alkanes untouched.'
      ],
      a: 'About 115 kJ/mol of strain (38 kJ/mol per CH₂).'
    }
  ],
  quiz: [
    { q: 'What is the hybridisation of the three carbons of propene, $\\ce{CH2=CH-CH3}$, in order?', choices: ['sp², sp², sp³', 'sp², sp³, sp³', 'sp, sp, sp³', 'sp³, sp³, sp³'], a: 0,
      why: 'Both carbons of the double bond have three things around them (sp², trigonal planar); the methyl carbon has four single bonds (sp³, tetrahedral).' },
    { q: 'Cyclohexane is drawn as a flat hexagon, so the molecule is flat.', a: false,
      why: 'A flat hexagon would have 120° angles, wider than sp³ carbon wants, and every C–H bond eclipsed. The real molecule puckers into a chair with angles near 111° and all bonds staggered.' },
    { q: 'Why can the gauche and anti forms of butane not be separated and bottled at room temperature?', choices: ['they have exactly the same energy', 'the barrier between them is only about 16 kJ/mol, crossed some 10¹⁰ times a second', 'they are the same shape', 'the C–C bond breaks and re-forms'], a: 1,
      why: 'Conformations differ only by rotation about a σ bond. With a barrier of a few RT, each molecule flips between them many billions of times a second, so a sample is always an equilibrium mixture.' },
    { q: 'Burning one mole of cyclobutane gas releases 2744 kJ. Using 658.6 kJ/mol per unstrained CH₂, what is its strain energy?', answer: 109.6, unit: 'kJ/mol',
      why: '$2744 - 4 \\times 658.6 = 109.6$ kJ/mol — almost as much as cyclopropane, because four-membered rings still have angles near 90°.' },
    { q: 'Why is there no "organic chemistry" of silicon in our oxygen-rich world?', choices: ['silicon cannot make four bonds', 'Si–Si bonds are weak compared with Si–O, so silicon chains turn into silicon–oxygen networks', 'silicon is too rare', 'silicon is a metal'], a: 1,
      why: 'Silicon is tetravalent like carbon, but Si–Si is much weaker than Si–O (about 226 against 450 kJ/mol). In air and water, silicon ends up bound to oxygen, as in quartz and silicones.' }
  ],
  applications: ['Diamond cutting tools, graphite electrodes, graphene and carbon-fibre composites — one element, different hybridisations.', 'Drug design: a molecule must adopt the right conformation to fit its receptor.', 'Steroids, sugars and many fragrances are built on strain-free six-membered rings.', 'Strained rings store energy: cyclopropane and epoxide rings are used as reactive handles in synthesis.'],
  history: 'Kekulé and Couper proposed in 1858 that carbon is tetravalent and links to itself in chains; in 1874 van \'t Hoff and Le Bel independently put the four bonds at the corners of a tetrahedron. Baeyer\'s ring-strain theory of 1885 assumed flat rings — right for small rings, wrong for cyclohexane, whose chair was worked out by Sachse and later confirmed by Hassel and Barton.',
  sim: ['org-conformations', { id: 'org-groups', params: { mol: 'cyclohexane' } }]
},

{
  id: 'hydrocarbons', parent: 'organic-structure', title: 'Alkanes, alkenes and alkynes', level: 1,
  short: 'Compounds of carbon and hydrogen only. Alkanes have single bonds and do little but burn; alkenes and alkynes have double and triple bonds that open up to add other atoms.',
  keywords: ['hydrocarbon', 'alkane', 'alkene', 'alkyne', 'cycloalkane', 'homologous series', 'general formula', 'saturated', 'unsaturated', 'degree of unsaturation', 'double bond equivalent', 'combustion', 'crude oil', 'fractional distillation', 'cracking', 'natural gas', 'LPG', 'bromine water'],
  prereq: ['carbon-bonding', 'sigma-pi-bonds', 'intermolecular-forces'],
  related: ['functional-groups', 'nomenclature', 'structural-isomers', 'addition-alkenes', 'aromatic-compounds', 'enthalpy', 'bond-enthalpies'],
  body: `
Hydrocarbons contain only carbon and hydrogen. They are the bulk of crude oil and natural gas, and so the starting point of nearly every fuel, plastic and synthetic chemical.

### Alkanes: $\\mathrm{C}_n\\mathrm{H}_{2n+2}$
Every carbon is sp³ and every bond single, so the molecule holds as many hydrogens as it can: it is **saturated**. Methane, ethane, propane, butane… form a **homologous series** — each member has one more $\\ce{CH2}$ than the last, and properties change step by step:

| Alkane | Formula | bp |
|---|---|---|
| methane | $\\ce{CH4}$ | −162 °C |
| ethane | $\\ce{C2H6}$ | −89 °C |
| propane | $\\ce{C3H8}$ | −42 °C |
| butane | $\\ce{C4H10}$ | −0.5 °C |
| pentane | $\\ce{C5H12}$ | 36 °C |
| octane | $\\ce{C8H18}$ | 126 °C |
| hexadecane | $\\ce{C16H34}$ | 287 °C |

Boiling does not break any covalent bond; it pulls molecules apart. Longer molecules touch their neighbours over more surface, so the [[intermolecular-forces|London forces]] grow and the boiling point climbs — the principle behind the **fractional distillation** of crude oil into refinery gas (C₁–C₄), petrol (about C₅–C₁₀), kerosene and jet fuel (C₁₀–C₁₆), diesel (C₁₄–C₂₀), lubricating oil, wax and bitumen.

Alkanes are unreactive: C–C and C–H bonds are strong and almost non-polar, so there is nothing for ions or polar reagents to attack (their old name, paraffins, means "little affinity"). They do two things: they **burn**, releasing a great deal of energy,

$$\\ce{C3H8 + 5O2 -> 3CO2 + 4H2O}\\qquad \\Delta H = -2220\\ \\mathrm{kJ/mol}$$

and, in ultraviolet light, they swap hydrogens for halogens by a radical chain ([[reaction-mechanisms-organic]]). Short of oxygen, combustion gives carbon monoxide and soot. Each extra $\\ce{CH2}$ adds about 659 kJ/mol to the heat of combustion, so all alkane fuels deliver a similar 46–56 MJ per kilogram.

### Alkenes: $\\mathrm{C}_n\\mathrm{H}_{2n}$
One C=C double bond makes an alkene **unsaturated**: the π bond can open and take on two more atoms. Alkenes react by [[addition-alkenes|addition]] with hydrogen, halogens, hydrogen halides and water. A quick test: orange **bromine water** turns colourless with an alkene, not with an alkane. Ethene is the most-produced organic chemical, well over 150 million tonnes a year, mostly from **cracking** ethane or naphtha in steam at about 850 °C; it becomes poly(ethene), antifreeze and PVC. Plants make it too: it is the hormone that ripens fruit. Because the double bond cannot rotate, but-2-ene exists as [[stereoisomers|cis and trans]] forms.

### Alkynes: $\\mathrm{C}_n\\mathrm{H}_{2n-2}$
A triple bond — two π bonds around a σ bond — makes the carbons linear. Ethyne (acetylene) burns in oxygen at over 3000 °C, hot enough to weld and cut steel; it was once made from calcium carbide and water in miners' lamps: $\\ce{CaC2 + 2H2O -> C2H2 + Ca(OH)2}$.

### Counting rings and π bonds
Rings take hydrogens away too: cyclohexane, $\\ce{C6H12}$, has the formula of hexene. Every ring or π bond removes two hydrogens from the saturated count, which gives the **degree of unsaturation** (double-bond equivalents) of any formula — halogens count like hydrogen, each nitrogen adds room for one more hydrogen:

$$U = C - \\frac{H}{2} - \\frac{X}{2} + \\frac{N}{2} + 1$$

Benzene, $\\ce{C6H6}$, has $U = 4$: one ring and three double bonds. It is the first thing to work out when an unknown formula arrives from a [[mass-spectrometry|mass spectrum]].
`,
  ideas: [
    'Alkanes are CₙH₂ₙ₊₂ with single bonds only; alkenes CₙH₂ₙ have a C=C; alkynes CₙH₂ₙ₋₂ have a C≡C.',
    'Along a homologous series boiling points rise with chain length because London forces grow.',
    'Alkanes only burn or undergo radical substitution; alkenes and alkynes undergo addition across the π bond.',
    'Bromine water is decolourised by alkenes, not alkanes.',
    'The degree of unsaturation counts rings plus π bonds: U = C − H/2 − X/2 + N/2 + 1.'
  ],
  pitfalls: [
    'A longer chain boils higher because it has more bonds to break — Boiling breaks no covalent bonds; it separates molecules. Longer molecules have larger London forces between them.',
    'Unsaturated simply means "contains a double bond" — Chemically, saturated means no multiple bonds, but the degree of unsaturation counts rings as well: cyclohexane has only single bonds yet its formula C₆H₁₂ has one degree of unsaturation.',
    'Alkanes are unreactive, so they are harmless — They burn very exothermically, form explosive mixtures with air, and incomplete combustion produces poisonous carbon monoxide.'
  ],
  formulas: [
    {
      name: 'Degree of unsaturation',
      expr: 'U = C - H/2 - X/2 + N/2 + 1', tex: 'U = C - \\frac{H}{2} - \\frac{X}{2} + \\frac{N}{2} + 1',
      vars: {
        U: { name: 'rings plus π bonds' },
        C: { name: 'number of carbon atoms', int: true, value: 6 },
        H: { name: 'number of hydrogen atoms', int: true, value: 6 },
        X: { name: 'number of halogen atoms', int: true, value: 0 },
        N: { name: 'number of nitrogen atoms', int: true, value: 0 }
      },
      note: 'Oxygen and sulfur do not appear: they add no hydrogens. A triple bond counts 2, a benzene ring 4. The defaults are benzene.',
      practice: { unknowns: ['U', 'H'] },
      stories: {
        U: 'An unknown compound has {C} carbons, {H} hydrogens, {N} nitrogens and {X} halogens. How many rings and π bonds does it have in total?',
        H: 'A hydrocarbon with {C} carbons has {U} rings and π bonds. How many hydrogens does it have?'
      }
    },
    {
      name: 'Heat of combustion of an alkane (gas, estimate)',
      expr: 'q = a*n + b', tex: 'q_c \\approx a\\,n + b',
      vars: {
        q: { name: 'heat released per mole burnt', q: 'molarenergy', unit: 'kJ/mol', tex: 'q_c' },
        n: { name: 'number of carbon atoms', int: true, value: 8 },
        a: { name: 'heat per CH₂ group', q: 'molarenergy', unit: 'kJ/mol', value: 658.6, fixed: true },
        b: { name: 'the extra for the two end hydrogens', q: 'molarenergy', unit: 'kJ/mol', value: 232, fixed: true }
      },
      note: 'A straight line through the measured values for gaseous straight-chain alkanes (water formed as liquid); within about 1 % from methane (890 kJ/mol) upwards.',
      practice: { unknowns: ['q', 'n'] },
      stories: {
        q: 'Estimate the heat released when one mole of a gaseous straight-chain alkane with {n} carbons burns completely.',
        n: 'A gaseous straight-chain alkane releases about {q} per mole when it burns. How many carbons has it?'
      }
    },
    {
      name: 'Energy per kilogram of a fuel',
      expr: 'u = q/M', tex: 'u = \\frac{q_c}{M}',
      vars: {
        u: { name: 'specific energy (heat released per kilogram)', q: 'specificenergy', unit: 'MJ/kg' },
        q: { name: 'heat released per mole burnt', q: 'molarenergy', unit: 'kJ/mol', value: 890.4, tex: 'q_c' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 16.04 }
      },
      note: 'Defaults: methane, 55.5 MJ/kg. Heavier alkanes carry relatively less hydrogen, so octane gives about 48 MJ/kg.',
      practice: { unknowns: ['u', 'q'] },
      stories: { u: 'A fuel of molar mass {M} releases {q} per mole on burning. How much energy does one kilogram deliver?' }
    }
  ],
  examples: [
    {
      title: 'A patio heater',
      q: 'Propane burns with $\\Delta H = -2220$ kJ/mol. How much heat does 1.00 kg give, and what mass of carbon dioxide does it release?',
      steps: [
        'Amount: $n = 1000/44.10 = 22.68$ mol of $\\ce{C3H8}$.',
        'Heat: $22.68 \\times 2220 = 5.03 \\times 10^4$ kJ, that is 50.3 MJ per kilogram.',
        'From $\\ce{C3H8 + 5O2 -> 3CO2 + 4H2O}$, each mole gives 3 mol of $\\ce{CO2}$: $3 \\times 22.68 \\times 44.01 = 2994$ g.',
        'Burning a kilogram of propane releases almost three kilograms of carbon dioxide — the oxygen comes from the air.'
      ],
      a: '50.3 MJ and 2.99 kg of CO₂.'
    },
    {
      title: 'What could C₄H₆ be?',
      q: 'A hydrocarbon has the formula $\\ce{C4H6}$. How many rings and π bonds must it have, and what structures fit?',
      steps: [
        '$U = 4 - 6/2 + 1 = 2$.',
        'Two double-bond equivalents can be one triple bond (but-1-yne, but-2-yne), two double bonds (buta-1,3-diene), or one ring and one double bond (cyclobutene, methylidenecyclopropane).',
        'A test with bromine decolourises all of them; infrared or NMR spectra tell them apart.'
      ],
      a: 'U = 2: an alkyne, a diene, or a ring with a double bond.'
    }
  ],
  quiz: [
    { q: 'Which formula belongs to an alkene with one double bond and no ring?', choices: ['$\\ce{C5H12}$', '$\\ce{C5H10}$', '$\\ce{C5H8}$', '$\\ce{C5H6}$'], a: 1,
      why: 'Alkenes are CₙH₂ₙ: two hydrogens fewer than the alkane C₅H₁₂. C₅H₈ has two degrees of unsaturation (an alkyne, diene or cycloalkene).' },
    { q: 'Hexene decolourises bromine water; hexane does not, however long you wait in the dark.', a: true,
      why: 'Bromine adds across the C=C of hexene. Hexane has no π bond; it reacts with bromine only by a radical chain started by ultraviolet light.' },
    { q: 'Why is methane a gas and octane a liquid at room temperature?', choices: ['octane has stronger C–H bonds', 'octane molecules attract one another more strongly through London forces', 'methane is polar', 'octane forms hydrogen bonds'], a: 1,
      why: 'Both are non-polar. The bigger octane molecule has more electrons and more surface in contact with its neighbours, so the London forces are much stronger.' },
    { q: 'How many rings plus π bonds does ethylbenzene, C₈H₁₀, have?', answer: 4,
      why: '$U = 8 - 10/2 + 1 = 4$: the benzene ring accounts for all four (one ring and three C=C).' },
    { q: 'Cyclohexane and hex-1-ene both have the formula C₆H₁₂ but only one of them reacts with bromine water. Which?', choices: ['cyclohexane', 'hex-1-ene', 'both', 'neither'], a: 1,
      why: 'The ring in cyclohexane removes two hydrogens just as a double bond does, but it has no π bond to add across.' }
  ],
  applications: ['Natural gas, LPG, petrol, jet fuel and diesel are alkane mixtures separated by boiling range.', 'Steam cracking turns ethane and naphtha into ethene and propene, the feedstocks of the plastics industry.', 'Ethene is sold to ripen bananas and tomatoes in storage.', 'Oxy-acetylene torches weld and cut steel.'],
  sim: [{ id: 'org-conformations', params: { mol: 'ethane' } }, { id: 'org-groups', params: { mol: 'ethene' } }]
},

{
  id: 'functional-groups', parent: 'organic-structure', title: 'Functional groups', level: 1,
  short: 'A functional group is the small reactive part of a molecule — an –OH, a C=O, an –NH₂ — that behaves much the same whatever carbon skeleton it sits on. Learn a dozen groups and you can predict the chemistry of millions of compounds.',
  keywords: ['functional group', 'hydroxyl', 'alcohol', 'ether', 'carbonyl', 'aldehyde', 'ketone', 'carboxyl', 'carboxylic acid', 'ester', 'amide', 'amine', 'nitrile', 'haloalkane', 'alkyl group', 'R group', 'primary', 'secondary', 'tertiary', 'phenol'],
  prereq: ['hydrocarbons', 'bond-polarity', 'hydrogen-bonding'],
  related: ['nomenclature', 'carbonyl-chemistry', 'carboxylic-acids-esters', 'nucleophilic-substitution', 'ir-spectroscopy', 'amino-acids-proteins'],
  body: `
A hydrocarbon skeleton is chemically dull. What makes a molecule react is a **functional group**: a double bond, or an atom other than carbon and hydrogen with its polar bonds and lone pairs. The group reacts in much the same way on any skeleton, so chemists write the rest of the molecule as **R** (an alkyl group, the "rest") and learn the chemistry of $\\ce{R-OH}$ once for all alcohols.

### The main groups

| Class | Group | General formula | Example | Name ending |
|---|---|---|---|---|
| alkene | C=C | — | ethene | -ene |
| arene | benzene ring | Ar–H | methylbenzene (toluene) | -benzene |
| haloalkane | C–X (X = F, Cl, Br, I) | R–X | chloromethane | halo- prefix |
| alcohol | –OH | R–OH | ethanol | -ol |
| ether | C–O–C | R–O–R′ | ethoxyethane | alkoxy- prefix |
| aldehyde | –CHO | RCHO | methanal (formaldehyde) | -al |
| ketone | C=O between carbons | RCOR′ | propanone (acetone) | -one |
| carboxylic acid | –COOH | RCOOH | ethanoic acid (vinegar) | -oic acid |
| ester | –COO– | RCOOR′ | ethyl ethanoate | -oate |
| amide | –CONH₂ | RCONH₂ | ethanamide | -amide |
| amine | –NH₂ | RNH₂ | methylamine | -amine |
| nitrile | –C≡N | RCN | ethanenitrile | -nitrile |

The groups built on C=O — aldehyde, ketone, acid, ester, amide — form one large family, the **carbonyl compounds** ([[carbonyl-chemistry]], [[carboxylic-acids-esters]]).

### Primary, secondary, tertiary
For alcohols and haloalkanes, count the carbons attached to the carbon that carries the group: ethanol is **primary** (1°), propan-2-ol **secondary** (2°), 2-methylpropan-2-ol **tertiary** (3°). The class matters: primary alcohols oxidise to aldehydes and acids, secondary to ketones, tertiary hardly at all. For **amines** the count is different — it is the number of carbons on the nitrogen: $\\ce{CH3NH2}$ is primary, $\\ce{(CH3)2NH}$ secondary, $\\ce{(CH3)3N}$ tertiary.

### Groups set physical properties
Compare four molecules of almost the same mass (58–60 g/mol):

| Compound | Strongest force between molecules | bp |
|---|---|---|
| butane, $\\ce{CH3CH2CH2CH3}$ | London forces | −0.5 °C |
| propanal, $\\ce{CH3CH2CHO}$ | dipole–dipole (polar C=O) | 48 °C |
| propan-1-ol, $\\ce{CH3CH2CH2OH}$ | hydrogen bonds | 97 °C |
| ethanoic acid, $\\ce{CH3COOH}$ | two hydrogen bonds per pair (dimers) | 118 °C |

The same groups that [[hydrogen-bonding|hydrogen-bond]] to each other hydrogen-bond to water: methanol, ethanol, ethanoic acid and small amines mix with water in any proportion, but each extra $\\ce{CH2}$ makes a molecule more oil-like — butan-1-ol dissolves only to about 7 g per 100 mL, hexan-1-ol to under 1 g.

### Groups set reactivity
Polar bonds leave a carbon slightly positive, open to attack by electron-rich **nucleophiles** — the C–Cl carbon of a haloalkane, the C=O carbon of a ketone. Lone pairs on O and N make alcohols and amines nucleophiles and bases. The π electrons of a C=C attract **electrophiles**. Every reaction in [[reaction-mechanisms-organic]] is one of these patterns.

### Reading real molecules
Most useful molecules carry several groups. **Aspirin** is a benzene ring with a carboxylic acid and an ester; **paracetamol** a benzene ring with a phenol –OH and an amide; **adrenaline** has an amine, an alcohol and two phenol groups; **vanillin**, the flavour of vanilla, an aldehyde, an ether and a phenol. Each group can also be read from a spectrum: a strong band near 1700 cm⁻¹ in the [[ir-spectroscopy|infrared]] means C=O, a broad one near 3300 cm⁻¹ means O–H.
`,
  ideas: [
    'A functional group is the reactive part of a molecule; it behaves similarly whatever skeleton (R) carries it.',
    'Alcohols and haloalkanes are primary, secondary or tertiary by the number of carbons on the carbon carrying the group; amines by the number of carbons on the nitrogen.',
    'Groups that can hydrogen-bond raise the boiling point and the solubility in water.',
    'Polar bonds create electron-poor carbons for nucleophiles to attack; lone pairs and π bonds supply electrons.',
    'Real molecules — drugs, flavours, hormones — carry several groups, each with its own chemistry.'
  ],
  pitfalls: [
    'Primary, secondary and tertiary mean the same for amines as for alcohols — For alcohols they count carbons on the carbon bearing the –OH; for amines, carbons on the nitrogen. (CH₃)₂CHNH₂ is a primary amine although its nitrogen sits on a secondary carbon.',
    'An ester is just an ether with an extra oxygen — An ester has a C=O next to the C–O–C; that carbonyl changes everything: esters hydrolyse to acids and alcohols, ethers are nearly inert.',
    'An –OH always makes a compound an alcohol — On a C=O it is part of a carboxylic acid (an acid a million times stronger), and on a benzene ring it is a phenol.'
  ],
  examples: [
    {
      title: 'The groups in paracetamol',
      q: 'Paracetamol is $\\ce{HOC6H4NHCOCH3}$, with the two substituents opposite each other on the ring. Name its functional groups.',
      steps: [
        '$\\ce{C6H4}$ is a benzene ring carrying two groups: an **arene**.',
        'The –OH sits directly on the ring: a **phenol** (weakly acidic, unlike an alcohol).',
        '$\\ce{-NHCOCH3}$ is an **amide**: nitrogen bonded to the C=O of an ethanoyl group — the same link that joins amino acids in proteins.',
        'Check the formula: $\\ce{C8H9NO2}$, $M = 151.16$ g/mol.'
      ],
      a: 'A benzene ring, a phenol group and a secondary amide.'
    },
    {
      title: 'Ranking boiling points',
      q: 'Put in order of boiling point: propanone, butane, propan-1-ol, ethanoic acid — all with M ≈ 58–60 g/mol.',
      steps: [
        'Similar masses mean similar London forces, so the groups decide.',
        'Butane: London forces only, lowest. Propanone: a polar C=O adds dipole–dipole attraction.',
        'Propan-1-ol: its O–H hydrogen-bonds. Ethanoic acid: pairs of molecules hydrogen-bond twice into dimers, highest.'
      ],
      a: 'Butane (−0.5 °C) < propanone (56 °C) < propan-1-ol (97 °C) < ethanoic acid (118 °C).'
    }
  ],
  quiz: [
    { q: 'What class of compound is $\\ce{CH3COOCH3}$?', choices: ['ketone', 'ether', 'ester', 'carboxylic acid'], a: 2,
      why: 'A C=O whose carbon also bonds to an O–C: an ester (methyl ethanoate), made from ethanoic acid and methanol.' },
    { q: 'Which is a secondary alcohol?', choices: ['ethanol, $\\ce{CH3CH2OH}$', 'propan-2-ol, $\\ce{CH3CH(OH)CH3}$', '2-methylpropan-2-ol, $\\ce{(CH3)3COH}$', 'methanol, $\\ce{CH3OH}$'], a: 1,
      why: 'In propan-2-ol the carbon carrying the OH is bonded to two other carbons. Ethanol is primary; 2-methylpropan-2-ol is tertiary (three carbons on the C–OH).' },
    { q: 'Propan-2-amine, $\\ce{(CH3)2CHNH2}$, is a secondary amine because its nitrogen sits on a secondary carbon.', a: false,
      why: 'Amines are classed by the number of carbons on the nitrogen. Here the nitrogen carries one carbon and two hydrogens: a primary amine.' },
    { q: 'Ethanol boils at 78 °C, methoxymethane (same formula, C₂H₆O) at −24 °C. Why?', choices: ['ethanol is heavier', 'ethanol molecules hydrogen-bond through their O–H; the ether has no O–H', 'the ether has weaker covalent bonds', 'ethanol is ionic'], a: 1,
      why: 'Same atoms, same mass — but only ethanol has hydrogen on oxygen, so only ethanol molecules can hydrogen-bond to one another.' },
    { q: 'Which group would you expect to react with a nucleophile at its carbon atom?', choices: ['the C=O of propanone', 'the C–H of methane', 'the C–C of ethane', 'the benzene ring'], a: 0,
      why: 'Oxygen pulls electrons out of the C=O, leaving the carbon δ+ and open to attack. Non-polar C–H and C–C bonds offer no such target.' }
  ],
  applications: ['Medicinal chemistry: activity, solubility and metabolism of a drug are traced to its groups.', 'Reading infrared and NMR spectra starts with identifying functional groups.', 'Food chemistry: esters give fruit flavours, aldehydes the smell of vanilla and cinnamon.', 'Choosing solvents: water mixes with alcohols and acids, not with hydrocarbons.'],
  sim: 'org-groups'
},

{
  id: 'nomenclature', parent: 'organic-structure', title: 'Naming organic compounds', level: 2,
  short: 'The IUPAC system gives every compound a name that can be turned back into exactly one structure: find the longest chain containing the main group, number it to give the lowest locants, and add the branches as prefixes in alphabetical order.',
  keywords: ['IUPAC', 'nomenclature', 'systematic name', 'common name', 'trivial name', 'stem', 'prefix', 'suffix', 'locant', 'parent chain', 'substituent', 'alkyl group', 'methyl', 'ethyl', 'meth eth prop but', 'naming alkanes', 'naming alcohols'],
  prereq: ['hydrocarbons', 'functional-groups'],
  related: ['structural-isomers', 'stereoisomers', 'aromatic-compounds', 'carboxylic-acids-esters'],
  body: `
"Acetone", "isopropyl alcohol", "wood spirit": common names are short but tell you nothing about the structure, and there are far too many compounds to memorise. The **IUPAC** system (International Union of Pure and Applied Chemistry) builds a name from the structure, so that a name leads back to one structure and one only.

### The three parts of a name
**prefixes** (branches and minor groups) + **stem** (length of the main chain) + **suffix** (the main functional group).

| Carbons | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| stem | meth- | eth- | prop- | but- | pent- | hex- | hept- | oct- | non- | dec- |

The same stems name branches: $\\ce{CH3-}$ is methyl, $\\ce{CH3CH2-}$ ethyl.

### Naming an alkane, step by step
1. Find the **longest continuous chain**. It may turn corners in the drawing — follow every path.
2. **Number** it from the end that gives the branches the lowest numbers (locants).
3. Name each branch with its locant; use di-, tri-, tetra- for repeats, each with its own number.
4. List branches **alphabetically** (ignoring di-, tri-). Commas separate numbers, hyphens separate numbers from letters.

So $\\ce{(CH3)2CHCH2CH3}$ is **2-methylbutane** (four-carbon chain, methyl on carbon 2 — not 3, which would be numbering from the wrong end), and $\\ce{C(CH3)4}$ is **2,2-dimethylpropane**. The fuel-testing standard "isooctane" is 2,2,4-trimethylpentane.

### Adding a functional group
The main chain must contain the group, which gets the lowest possible locant and the suffix:
- alkenes and alkynes: **but-1-ene**, **but-2-ene**, **pent-2-yne**; two double bonds give **buta-1,3-diene**;
- alcohols: **propan-1-ol**, **propan-2-ol**; with several OH groups the -e stays: **ethane-1,2-diol** (antifreeze), **propane-1,2,3-triol** (glycerol);
- ketones: **propanone**, **butanone**, **pentan-2-one**;
- aldehydes and carboxylic acids sit at the end of the chain, so carbon 1 is understood: **ethanal**, **butanoic acid**;
- esters name the alcohol part first, as a separate word: **ethyl ethanoate** (from ethanol and ethanoic acid), **methyl butanoate**;
- halogens are always prefixes: **2-chloropropane**, **trichloromethane** (chloroform).

### When there are several groups
Only one group can be the suffix. The order of seniority is: carboxylic acid > ester > amide > nitrile > aldehyde > ketone > alcohol > amine. The winner gives the suffix; the others become prefixes — **hydroxy-**, **oxo-**, **amino-**. Lactic acid is **2-hydroxypropanoic acid**; alanine is **2-aminopropanoic acid**.

### Rings and benzene
Rings add **cyclo-**: cyclohexane, cyclopentanol. Benzene derivatives are named as substituted benzenes (**methylbenzene**, **1,4-dimethylbenzene**), with a few old names kept by IUPAC: phenol, benzoic acid, aniline (phenylamine).

### Names you will still hear

| Common name | Systematic name |
|---|---|
| acetone | propanone |
| acetic acid | ethanoic acid |
| formaldehyde | methanal |
| ethylene, acetylene | ethene, ethyne |
| isopropyl alcohol | propan-2-ol |
| toluene | methylbenzene |
| chloroform | trichloromethane |
| ethylene glycol | ethane-1,2-diol |

> [!tip] Check a name by drawing it and naming your drawing again. A name like "2-ethylbutane" gives itself away: the ethyl group extends the chain, and the compound is really 3-methylpentane.
`,
  ideas: [
    'A name is prefixes + stem + suffix: branches, chain length, main functional group.',
    'The parent chain is the longest one that contains the main group; it may bend in the drawing.',
    'Number the chain to give the lowest locants — to the main group first, then to multiple bonds, then to branches.',
    'Branches are listed alphabetically; di-, tri-, tetra- mark repeats and each gets its own locant.',
    'Only the most senior group is a suffix; the others become prefixes such as hydroxy-, oxo- and amino-.'
  ],
  pitfalls: [
    'The longest chain is the one drawn in a straight line — Chains turn corners. In "2-ethylbutane" the longest chain runs through the ethyl group: it is 3-methylpentane.',
    'Number from whichever end makes the name look simplest — Number to give the main group the lowest locant, then the multiple bonds, then the branches at the first point of difference.',
    'Esters are named in the order the formula is written — The alkyl group from the alcohol comes first as its own word: CH₃COOCH₂CH₃ is ethyl ethanoate, although the ethyl is written last in the formula.'
  ],
  examples: [
    {
      title: 'Naming an alcohol',
      q: 'Name $\\ce{CH3CH(CH3)CH2CH(OH)CH3}$.',
      steps: [
        'The longest chain containing the carbon with the OH has five carbons: pentane, so the name ends -pentan-?-ol.',
        'Number from the end nearer the OH: from the right, the OH is on carbon 2 (from the left it would be on 4).',
        'The methyl branch is then on carbon 4.',
        'Name: **4-methylpentan-2-ol**, $\\ce{C6H14O}$, 102.18 g/mol.'
      ],
      a: '4-methylpentan-2-ol.'
    },
    {
      title: 'From a name to a structure',
      q: 'Draw 2,2,4-trimethylpentane, the reference fuel with an octane number of 100, and give its molecular formula.',
      steps: [
        'Pentane: a chain of five carbons, numbered 1–5.',
        'Two methyl groups on carbon 2 and one on carbon 4: $\\ce{(CH3)3C-CH2-CH(CH3)2}$.',
        'Count: 5 + 3 = 8 carbons; filling each carbon to four bonds gives 18 hydrogens.'
      ],
      a: '$\\ce{(CH3)3CCH2CH(CH3)2}$, C₈H₁₈ — an isomer of octane.'
    },
    {
      title: 'Fixing a wrong name',
      q: 'A student names a compound "1-methylbutane". What is it really?',
      steps: [
        'A methyl on carbon 1 of butane simply makes the chain one carbon longer.',
        'The longest chain has five carbons and no branches.'
      ],
      a: 'Pentane. A branch on carbon 1 is always a sign that the chain was chosen too short.'
    }
  ],
  quiz: [
    { q: 'What is the IUPAC name of $\\ce{(CH3)2CHCH2CH3}$?', choices: ['3-methylbutane', '2-methylbutane', '2-methylpropane', 'pentane'], a: 1,
      why: 'Four-carbon chain with a methyl branch; numbering from the end nearer the branch puts it on carbon 2. It is an isomer of pentane (C₅H₁₂), not pentane itself.' },
    { q: 'What is the IUPAC name of $\\ce{CH3CH2CH2CHO}$?', choices: ['propanal', 'butanal', 'butan-1-one', 'butanol'], a: 1,
      why: 'Four carbons including the CHO carbon: butanal. The aldehyde carbon is always carbon 1, so no number is needed; a ketone cannot sit at the end of a chain.' },
    { q: '"2-ethylpropane" is a correct IUPAC name.', a: false,
      why: 'The ethyl branch extends the chain: the longest chain has four carbons with a methyl on carbon 2. The compound is 2-methylbutane.' },
    { q: 'Which group gives the suffix in $\\ce{HOCH2CH2COOH}$?', choices: ['the alcohol: it is a propanol', 'the carboxylic acid: it is 3-hydroxypropanoic acid', 'both: it is propan-3-ol-oic acid', 'neither: it is an ester'], a: 1,
      why: 'Carboxylic acids outrank alcohols, so the acid gives the suffix and fixes carbon 1; the OH becomes the prefix hydroxy- on carbon 3.' },
    { q: 'What is the ester made from methanol and butanoic acid called?', choices: ['butyl methanoate', 'methyl butanoate', 'methyl butanol', 'butanoyl methane'], a: 1,
      why: 'The alcohol part (methyl) comes first, then the acid part with -oate: methyl butanoate, which smells of apples.' }
  ],
  applications: ['Safety data sheets, patents and regulations identify substances by systematic name.', 'Chemical databases convert names into structures automatically.', 'Ingredient lists on cosmetics use systematic names (INCI names are based on them).'],
  history: 'The Geneva rules of 1892 were the first international agreement on naming organic compounds; IUPAC has maintained and revised them since the 1920s, most recently in its 2013 recommendations.',
  sim: { id: 'org-isomers', params: { formula: 'C6H14' } }
},

{
  id: 'structural-isomers', parent: 'organic-structure', title: 'Structural isomers', level: 2,
  short: 'Structural isomers have the same molecular formula with the atoms joined in a different order: a straight or branched chain, a group in another position, or a different functional group altogether. They are different compounds, with different properties.',
  keywords: ['isomer', 'isomerism', 'structural isomer', 'constitutional isomer', 'chain isomer', 'position isomer', 'functional group isomer', 'branching', 'boiling point', 'octane number', 'knocking', 'C4H10', 'C5H12', 'C6H14'],
  prereq: ['hydrocarbons', 'nomenclature', 'functional-groups'],
  related: ['stereoisomers', 'imf-properties', 'nmr-spectroscopy', 'mass-spectrometry'],
  body: `
Two bottles are labelled $\\ce{C2H6O}$. One holds ethanol, a liquid that boils at 78 °C and is drunk worldwide; the other methoxymethane, a gas that boils at −24 °C and is used as an aerosol propellant. Same atoms, same mass — different connections. Compounds like these are **structural isomers** (also called constitutional isomers).

### Three kinds
- **Chain isomers** differ in the carbon skeleton: butane, $\\ce{CH3CH2CH2CH3}$, and 2-methylpropane, $\\ce{(CH3)3CH}$.
- **Position isomers** have the same group in a different place: propan-1-ol and propan-2-ol; 1-chlorobutane and 2-chlorobutane.
- **Functional group isomers** belong to different classes: ethanol and methoxymethane ($\\ce{C2H6O}$); propanal and propanone ($\\ce{C3H6O}$); butanoic acid and ethyl ethanoate ($\\ce{C4H8O2}$); hex-1-ene and cyclohexane ($\\ce{C6H12}$).

### How many?
The number of possible skeletons grows explosively with size:

| Alkane | C₄H₁₀ | C₅H₁₂ | C₆H₁₄ | C₇H₁₆ | C₈H₁₈ | C₁₀H₂₂ | C₂₀H₄₂ | C₃₀H₆₂ |
|---|---|---|---|---|---|---|---|---|
| isomers | 2 | 3 | 5 | 9 | 18 | 75 | 366 319 | about 4.1 billion |

To find them all without repeats, work systematically: start with the unbranched chain, shorten it by one carbon and place the spare carbon at each **distinct** position, then shorten again. A methyl on the end carbon only lengthens the chain, and positions 2 and 4 of a pentane are the same position seen from opposite ends.

### Branching changes properties
Molecules attract one another through their surfaces. A long chain is like a strand of spaghetti that lies alongside its neighbours; a heavily branched isomer is a compact ball that touches them only at a few points. So **branching lowers the boiling point**:

| C₅H₁₂ isomer | Shape | bp | mp |
|---|---|---|---|
| pentane | chain | 36.1 °C | −130 °C |
| 2-methylbutane | one branch | 27.8 °C | −160 °C |
| 2,2-dimethylpropane | a ball | 9.5 °C | −17 °C |

The melting points break the pattern: the symmetrical ball of 2,2-dimethylpropane packs neatly into a crystal and melts over 100 °C higher than pentane. Boiling depends on attraction; melting also depends on packing.

Branching matters in engines too. Straight-chain alkanes ignite too easily when compressed, causing **knocking**; branched ones resist. The octane scale runs from heptane (0) to 2,2,4-trimethylpentane (100), and refineries rearrange straight chains into branched ones (isomerisation) to raise the octane number of petrol.

### Telling isomers apart
Isomers have identical molecular masses, so a simple mass measurement cannot separate them — but almost everything else can. Boiling points differ; chemical tests distinguish classes (propanal reduces Tollens' reagent, propanone does not); and spectra read the connectivity directly: pentane shows 3 signals in its ¹³C [[nmr-spectroscopy|NMR spectrum]], 2-methylbutane 4 and 2,2-dimethylpropane just 2, because they have 3, 4 and 2 kinds of carbon.
`,
  ideas: [
    'Structural isomers share a molecular formula but differ in which atoms are bonded to which.',
    'They may differ in the chain (branching), in the position of a group, or in the functional group itself.',
    'The number of isomers grows explosively: 3 for C₅H₁₂, 75 for C₁₀H₂₂, 366 319 for C₂₀H₄₂.',
    'Branching lowers the boiling point (less contact between molecules) but can raise the melting point (better packing).',
    'Branched alkanes resist knocking, which is why they have higher octane numbers.'
  ],
  pitfalls: [
    'Isomers have the same atoms, so they behave alike — Ethanol and methoxymethane differ by 100 °C in boiling point and in almost every reaction.',
    'Bending a chain on paper makes a new isomer — Only a change in which atoms are bonded to which counts. A zigzag drawn with a kink, or a chain numbered from the other end, is the same compound.',
    'More branching always raises the boiling point because the molecule is more complex — It lowers it: compact molecules have less surface to attract their neighbours.'
  ],
  examples: [
    {
      title: 'All the isomers of C₅H₁₂',
      q: 'Find every structural isomer of pentane, $\\ce{C5H12}$, without repeats.',
      steps: [
        'Longest chain of 5: pentane, $\\ce{CH3CH2CH2CH2CH3}$.',
        'Chain of 4 plus one methyl: on carbon 2 gives 2-methylbutane. On carbon 1 would just be pentane again; on carbon 3 is the same as carbon 2 from the other end.',
        'Chain of 3 plus two methyls: both must go on carbon 2, giving 2,2-dimethylpropane.',
        'A chain of 2 cannot carry three carbons without making a longer chain, so we are done.'
      ],
      a: 'Three: pentane, 2-methylbutane and 2,2-dimethylpropane.'
    },
    {
      title: 'The isomers of C₃H₈O',
      q: 'List the isomers of $\\ce{C3H8O}$ and explain their boiling points: 97 °C, 82 °C and 7 °C.',
      steps: [
        'Degree of unsaturation: $3 - 8/2 + 1 = 0$, so no rings or double bonds — alcohols or ethers.',
        'Alcohols: propan-1-ol, $\\ce{CH3CH2CH2OH}$ (97 °C), and propan-2-ol, $\\ce{CH3CH(OH)CH3}$ (82 °C). Both hydrogen-bond; the branched one is more compact and boils lower.',
        'Ether: methoxyethane, $\\ce{CH3OCH2CH3}$ (7 °C). No O–H, so no hydrogen bonds between its molecules.'
      ],
      a: 'Propan-1-ol, propan-2-ol and methoxyethane.'
    }
  ],
  quiz: [
    { q: 'How many structural isomers does hexane, C₆H₁₄, have (hexane included)?', answer: 5,
      why: 'Hexane, 2-methylpentane, 3-methylpentane, 2,2-dimethylbutane and 2,3-dimethylbutane.' },
    { q: 'Which pair are structural isomers?', choices: ['ethanol and ethanal', 'butan-1-ol and ethoxyethane', 'propane and propene', 'cis- and trans-but-2-ene'], a: 1,
      why: 'Both are C₄H₁₀O, with different connections. Ethanol/ethanal and propane/propene differ in formula; cis/trans-but-2-ene have the same connections and differ only in space — they are stereoisomers.' },
    { q: 'Which C₅H₁₂ isomer has the highest boiling point?', choices: ['pentane', '2-methylbutane', '2,2-dimethylpropane', 'they are equal, having the same mass'], a: 0,
      why: 'The unbranched chain has the largest contact area with its neighbours, hence the strongest London forces: 36 °C against 28 °C and 9.5 °C.' },
    { q: '"2-methylpentane" and "4-methylpentane" are two different compounds.', a: false,
      why: 'They are the same molecule numbered from opposite ends; the correct name uses the lower locant, 2-methylpentane.' },
    { q: 'Why does 2,2,4-trimethylpentane make a better petrol component than octane, its isomer?', choices: ['it releases more energy', 'it resists igniting on compression (knocking)', 'it is denser', 'it contains more hydrogen'], a: 1,
      why: 'The two isomers release almost the same energy; the branched one does not self-ignite as the piston compresses the mixture, so it burns smoothly when the spark fires.' }
  ],
  applications: ['Refinery isomerisation and reforming raise the octane number of petrol.', 'Identifying unknowns: isomers are told apart by NMR, IR and fragmentation in mass spectra.', 'Drug patents must cover isomers, because each is a separate compound with its own activity.'],
  sim: 'org-isomers'
},

{
  id: 'stereoisomers', parent: 'organic-structure', title: 'Stereoisomers and chirality', level: 2,
  short: 'Stereoisomers have the same atoms joined in the same order but arranged differently in space: cis and trans about a double bond, or left- and right-handed mirror images about a chiral carbon. Living things tell them apart — one may be a medicine and its twin inactive or harmful.',
  keywords: ['stereoisomer', 'geometric isomer', 'cis', 'trans', 'E/Z', 'chirality', 'chiral', 'stereocentre', 'chiral centre', 'enantiomer', 'diastereomer', 'racemic mixture', 'racemate', 'optical activity', 'specific rotation', 'polarimeter', 'R and S', 'CIP rules', 'meso', 'enantiomeric excess', 'thalidomide'],
  prereq: ['structural-isomers', 'carbon-bonding', 'sigma-pi-bonds'],
  related: ['nucleophilic-substitution', 'amino-acids-proteins', 'carbohydrates', 'physics:polarization', 'math:combinatorics'],
  body: `
Your hands are made of the same parts joined in the same order, yet a left glove will not fit a right hand. Molecules can differ in the same way. **Stereoisomers** have identical connections and differ only in how their atoms are arranged in space.

### Cis and trans
A double bond cannot rotate (turning it would break the π bond), so groups on a C=C are fixed on the same side or on opposite sides. But-2-ene exists as **cis** (both methyls on one side, bp 3.7 °C) and **trans** (opposite, bp 0.9 °C). This needs two *different* groups on each carbon of the double bond: but-1-ene, with two hydrogens on carbon 1, has no cis/trans isomers. Rings lock groups the same way (cis- and trans-1,2-dimethylcyclohexane).

When the four groups are all different, "same side" becomes ambiguous and the **E/Z** system is used: rank the two groups on each carbon by atomic number; if the higher-ranked groups are together it is **Z** (German *zusammen*), if opposite, **E** (*entgegen*).

Cis/trans isomers are different compounds. Maleic acid (cis-butenedioic acid) melts at 135 °C and loses water on heating to form a ring, because its two acid groups are close; fumaric acid (trans) melts near 287 °C and cannot. In your eye, light flips 11-cis-retinal to all-trans-retinal — the change of shape that starts every nerve signal of vision.

### Chirality
A carbon bonded to **four different groups** is a **stereocentre**. Its two arrangements are mirror images that cannot be superimposed however you turn them: a pair of **enantiomers**. A molecule that is not superimposable on its mirror image is **chiral**; one with a mirror plane, like $\\ce{CH2BrCl}$, is achiral.

Enantiomers have the same melting point, boiling point, density and solubility. They differ in only two ways:
- they rotate the plane of [[physics:polarization|polarised light]] by equal amounts in opposite directions — (+) dextrorotatory or (−) laevorotatory — and so are called **optically active**;
- they interact differently with other chiral things — enzymes, receptors, the other enantiomer of a chiral reagent.

A 50 : 50 mixture, a **racemate**, does not rotate light at all.

### Naming them: R and S
The Cahn–Ingold–Prelog (CIP) rules rank the four groups:
1. Higher atomic number of the atom attached to the stereocentre wins (Br > Cl > O > N > C > H).
2. On a tie, compare the atoms one bond further out, highest first; a double bond counts its partner twice.

Turn the molecule so that the lowest-ranked group points away from you and follow 1 → 2 → 3: **clockwise is R** (*rectus*), **anticlockwise S** (*sinister*). The label is a naming convention; whether a compound is (+) or (−) has to be measured and does not follow from R or S.

### Measuring optical activity
A polarimeter measures the angle $\\alpha$ through which a solution turns polarised light. It grows with the path length $l$ (in dm) and the concentration $c$ (in g/mL), and the **specific rotation** $[\\alpha] = \\alpha/(l\\,c)$ is a property of the compound: +66.5° for sucrose. The sugar industry has measured sugar content this way for over a century. For a mixture of enantiomers, the ratio of the measured to the pure specific rotation is the **enantiomeric excess**.

### Several stereocentres
With $n$ stereocentres there can be up to $2^n$ stereoisomers. Stereoisomers that are not mirror images are **diastereomers**, and unlike enantiomers they have different physical properties. Glucose has four stereocentres in its open chain, so there are 16 aldohexoses; cholesterol has eight, so 256 possible stereoisomers, of which living cells make exactly one. A **meso** compound has stereocentres but an internal mirror plane, so it is achiral: tartaric acid has two stereocentres but only three stereoisomers — (R,R), (S,S) and meso.

### Why it matters
Receptors are built from chiral amino acids and fit one enantiomer better than the other. (R)-carvone smells of spearmint, (S)-carvone of caraway. The (S) enantiomer of ibuprofen relieves pain; the body converts much of the (R) form into (S). Thalidomide, sold as a racemate around 1960, caused thousands of birth defects; one enantiomer is blamed, but the two interconvert in the body, so the pure "safe" one would not have helped. Today most new chiral drugs are made and tested as single enantiomers.
`,
  ideas: [
    'Stereoisomers have the same connectivity but a different arrangement in space.',
    'Cis/trans (E/Z) isomers exist because a double bond cannot rotate; each carbon of the C=C needs two different groups.',
    'A carbon with four different groups is a stereocentre; its two forms are non-superimposable mirror images, enantiomers.',
    'Enantiomers share all physical properties except the direction in which they rotate polarised light and how they meet other chiral molecules.',
    'R and S come from CIP priorities: lowest priority away, 1 → 2 → 3 clockwise is R. With n stereocentres there are at most 2ⁿ stereoisomers.'
  ],
  pitfalls: [
    'R always rotates light clockwise (+) — R/S is a naming rule based on the geometry; the sign of rotation is measured. (R)-carvone is (−), for example.',
    'Enantiomers have different boiling points like other isomers — In non-chiral surroundings they are identical in every physical property except optical rotation. Diastereomers, however, do differ.',
    'Any molecule with a stereocentre is chiral — A meso compound, such as meso-tartaric acid, has stereocentres and an internal mirror plane: it is achiral.'
  ],
  formulas: [
    {
      name: 'Optical rotation',
      expr: 'alpha = sr*l*c', tex: '\\alpha = \\alpha_{\\text{sp}}\\; l\\; c',
      vars: {
        alpha: { name: 'observed rotation (degrees)', signed: true, tex: '\\alpha' },
        sr: { name: 'specific rotation [α] of the compound (degrees per dm per g/mL)', signed: true, value: 66.5, tex: '\\alpha_{\\text{sp}}' },
        l: { name: 'path length of the tube (dm)', value: 2 },
        c: { name: 'concentration (g/mL)', value: 0.1 }
      },
      note: 'Specific rotation is usually written $[\\alpha]$ and quoted at 20 °C for the yellow sodium D line, with $l$ in decimetres and $c$ in grams per millilitre. Defaults: sucrose, $[\\alpha] = +66.5°$.',
      practice: { unknowns: ['alpha', 'c'] },
      stories: {
        alpha: 'A solution of sucrose ([α] = {sr}) of concentration {c} g/mL fills a {l} dm polarimeter tube. Through what angle does it turn the light?',
        c: 'A sucrose solution ([α] = {sr}) in a {l} dm tube turns polarised light by {alpha}°. What is its concentration in g/mL?'
      }
    },
    {
      name: 'Enantiomeric excess',
      expr: 'ee = a/a0', tex: '\\text{ee} = \\frac{\\alpha_{\\text{obs}}}{\\alpha_{\\text{pure}}}',
      vars: {
        ee: { name: 'enantiomeric excess', q: 'ratio', unit: '%', tex: '\\text{ee}' },
        a: { name: 'specific rotation of the sample', signed: true, value: 30, tex: '\\alpha_{\\text{obs}}' },
        a0: { name: 'specific rotation of the pure enantiomer', signed: true, value: 40, tex: '\\alpha_{\\text{pure}}' }
      },
      note: 'The excess of one enantiomer over the other: a racemate has 0 %, a pure enantiomer 100 %. The major enantiomer makes up $(1 + ee)/2$ of the sample.',
      practice: { unknowns: ['ee', 'a'] },
      stories: { ee: 'The pure (S) enantiomer of a drug has a specific rotation of {a0}°; a batch shows {a}°. What is its enantiomeric excess?' }
    },
    {
      name: 'Maximum number of stereoisomers',
      expr: 'Ns = 2^n', tex: 'N = 2^{n}',
      vars: {
        Ns: { name: 'largest possible number of stereoisomers', q: 'count', tex: 'N' },
        n: { name: 'number of stereocentres', int: true, value: 4 }
      },
      note: 'Each stereocentre can be R or S independently. Meso forms and symmetry can make the real number smaller (tartaric acid: 3, not 4). Default: an open-chain aldohexose such as glucose, 16 stereoisomers.',
      practice: { unknowns: ['Ns', 'n'] }
    }
  ],
  examples: [
    {
      title: 'R or S: lactic acid from muscles',
      q: 'The lactic acid made in working muscles is $\\ce{CH3CH(OH)COOH}$ with the arrangement in which, looking with H pointing away from you, OH → COOH → $\\ce{CH3}$ runs anticlockwise. Is it R or S?',
      steps: [
        'Priorities of the atoms on the stereocentre: O (8) > C of COOH and C of CH₃ (6) > H (1).',
        'Tie between the two carbons: COOH carries (O, O, O) — the double bond counts twice — against (H, H, H) for the methyl. COOH wins.',
        'Order: OH (1), COOH (2), CH₃ (3), H (4). With H away, 1 → 2 → 3 anticlockwise.'
      ],
      a: '(S)-lactic acid — which happens to be (+), dextrorotatory.'
    },
    {
      title: 'Measuring sugar with light',
      q: 'A sucrose solution ($[\\alpha] = +66.5°$) in a 2.00 dm tube rotates the light by +10.0°. What is the concentration?',
      steps: [
        { text: 'Rearrange the rotation formula:', tex: 'c = \\frac{\\alpha}{[\\alpha]\\,l} = \\frac{10.0}{66.5 \\times 2.00} = 0.0752\\ \\mathrm{g/mL}' },
        'That is 75.2 g of sucrose per litre.'
      ],
      a: '0.0752 g/mL (75 g/L).'
    },
    {
      title: 'How pure is the enantiomer?',
      q: 'A pure enantiomer has $[\\alpha] = +40.0°$. A batch from a new synthesis measures +30.0°. What are its enantiomeric excess and composition?',
      steps: [
        '$ee = 30.0/40.0 = 0.75$, that is 75 %.',
        'The 25 % that is not excess is racemic: half of it each way. Major enantiomer: $(1 + 0.75)/2 = 87.5$ %; minor: 12.5 %.'
      ],
      a: 'ee = 75 %: 87.5 % of the (+) enantiomer and 12.5 % of the (−).'
    }
  ],
  quiz: [
    { q: 'Which of these alcohols has a stereocentre?', choices: ['ethanol', 'propan-2-ol', 'butan-2-ol', '2-methylpropan-2-ol'], a: 2,
      why: 'Carbon 2 of butan-2-ol carries H, OH, CH₃ and CH₂CH₃ — four different groups. In propan-2-ol and 2-methylpropan-2-ol the C–OH carbon has two identical methyl groups.' },
    { q: 'An (R) enantiomer always rotates polarised light clockwise (+).', a: false,
      why: 'R and S describe the arrangement by a naming rule; the sign of rotation is a measured property. Some R compounds are (+), others (−).' },
    { q: 'What is the largest possible number of stereoisomers for a molecule with three stereocentres?', answer: 8,
      why: '$2^3 = 8$: each centre independently R or S. Symmetry (meso forms) can reduce the number.' },
    { q: 'In which property do two enantiomers differ?', choices: ['boiling point', 'density', 'solubility in water', 'the direction in which they rotate polarised light'], a: 3,
      why: 'In achiral surroundings enantiomers are identical in every physical property except the sign of their optical rotation.' },
    { q: 'Does but-1-ene, $\\ce{CH2=CHCH2CH3}$, have cis and trans forms?', choices: ['yes', 'no: carbon 1 carries two hydrogens', 'no: the double bond can rotate', 'only at low temperature'], a: 1,
      why: 'Cis/trans isomerism needs two different groups on each carbon of the double bond. Swapping the two identical hydrogens on carbon 1 changes nothing.' }
  ],
  applications: ['Single-enantiomer drugs such as esomeprazole and escitalopram.', 'Polarimetry of sugar solutions (saccharimetry) in the sugar industry.', 'Flavours and fragrances: the two carvones smell of spearmint and caraway.', 'Vision: light turns 11-cis-retinal into the trans form.'],
  history: 'In 1848 Louis Pasteur sorted crystals of a tartrate salt by hand into two mirror-image shapes and found that their solutions rotated light in opposite directions. Van \'t Hoff and Le Bel explained this in 1874 with the tetrahedral carbon. The R/S rules were published by Cahn, Ingold and Prelog in 1956 and refined in 1966.',
  sim: 'org-chirality'
},

{
  id: 'aromatic-compounds', parent: 'organic-structure', title: 'Benzene and aromatic compounds', level: 2,
  short: 'Benzene is a flat ring of six carbons whose six π electrons are shared around the whole ring. That delocalisation makes it unusually stable, so it keeps its ring and reacts by substitution rather than addition.',
  keywords: ['benzene', 'aromatic', 'arene', 'aromaticity', 'delocalisation', 'Kekulé', 'resonance energy', 'Hückel rule', '4n+2', 'electrophilic aromatic substitution', 'nitration', 'halogenation', 'Friedel–Crafts', 'phenyl', 'phenol', 'toluene', 'naphthalene', 'pyridine'],
  prereq: ['hydrocarbons', 'resonance', 'sigma-pi-bonds'],
  related: ['functional-groups', 'addition-alkenes', 'reaction-mechanisms-organic', 'enthalpy', 'molecular-orbitals', 'nucleic-acids'],
  body: `
Benzene, $\\ce{C6H6}$, puzzled chemists for decades. Its formula has four degrees of unsaturation, like a compound bristling with double bonds, yet it ignores bromine water and survives conditions that tear alkenes apart. In 1865 Kekulé proposed a ring of six carbons with alternating single and double bonds. The ring is right; the alternating bonds are not.

### What benzene really is
- All six C–C bonds are the same length, **1.39 Å** — between a single bond (1.54 Å) and a double bond (1.34 Å).
- The molecule is a flat regular hexagon; every carbon is sp² with 120° angles.
- Each carbon has one p orbital left over, standing up from the ring. The six overlap side by side all round, and the six π electrons spread over the whole ring as two doughnut-shaped clouds above and below the plane.

The two Kekulé structures are [[resonance]] forms; the real molecule is neither but a blend, often drawn as a hexagon with a circle inside.

### How stable?
Adding hydrogen measures it. Hydrogenating cyclohexene (one C=C) releases 120 kJ/mol. A ring with three isolated double bonds should release three times that, 360 kJ/mol. Benzene releases only 208 kJ/mol on becoming cyclohexane: it sits about **150 kJ/mol lower** than a "cyclohexatriene" would. This is its **delocalisation** (resonance) **energy**, and it controls benzene's chemistry.

### Substitution, not addition
An alkene adds bromine and loses its double bond. If benzene did that it would lose its delocalisation energy, so instead it **swaps** a hydrogen for another group and keeps the ring intact — **electrophilic aromatic substitution**:
1. a strong electrophile is generated;
2. it grabs two π electrons, giving a positively charged, non-aromatic intermediate;
3. a hydrogen ion leaves and the aromatic ring is restored.

The standard reactions:
- **nitration**, with concentrated nitric and sulfuric acids, which make the nitronium ion $\\ce{NO2+}$: $\\ce{C6H6 + HNO3 -> C6H5NO2 + H2O}$ — the route to aniline, dyes and polyurethanes;
- **halogenation**, with $\\ce{Br2}$ or $\\ce{Cl2}$ and an iron(III) halide catalyst;
- **Friedel–Crafts alkylation and acylation**, attaching carbon chains with $\\ce{AlCl3}$ — industrially, benzene and ethene give ethylbenzene, then styrene and polystyrene.

Groups already on the ring steer the next one: –OH, –NH₂ and alkyl groups push electrons into the ring, speed up substitution and send newcomers to the 2- and 4-positions; –NO₂, –COOH and –CHO pull electrons out, slow it down and direct to position 3.

### The 4n + 2 rule
Aromaticity is not about six-membered rings. In 1931 Hückel showed that a flat, fully conjugated ring is specially stable when it holds $4n + 2$ π electrons (2, 6, 10, 14…). Naphthalene (10) is aromatic; the ring nitrogen compounds pyridine and pyrrole (6 each) are aromatic, and so are the bases of [[nucleic-acids|DNA]]. Cyclobutadiene, with 4 π electrons, is the opposite: so unstable it exists only fleetingly.

### Aromatic compounds around you
Methylbenzene (toluene) is the solvent that replaced benzene, which causes leukaemia. Phenol, $\\ce{C6H5OH}$, is a far stronger acid than ethanol, because its negative ion spreads its charge into the ring. Aspirin, paracetamol and ibuprofen are all built on benzene rings, as are polystyrene, PET bottles (from 1,4-dimethylbenzene), Kevlar and TNT. The flat, rigid ring is why aromatic polymers are stiff, and why aromatic dyes absorb visible light.
`,
  ideas: [
    'Benzene is a flat hexagon of sp² carbons with all C–C bonds 1.39 Å, between single and double.',
    'Its six π electrons are delocalised around the ring, lowering its energy by about 150 kJ/mol.',
    'To keep that stability, benzene undergoes substitution (nitration, halogenation, Friedel–Crafts) rather than addition.',
    'A flat, conjugated ring with 4n + 2 π electrons is aromatic (Hückel\'s rule).',
    'Groups on the ring speed up or slow down further substitution and steer it to particular positions.'
  ],
  pitfalls: [
    'Benzene has three double bonds and three single bonds that flip back and forth — The two Kekulé structures are not real molecules in equilibrium; there is one structure, with six identical bonds.',
    'Benzene reacts like an alkene — It does not decolourise bromine water; it needs a catalyst and then substitutes rather than adds.',
    'Any ring with alternating double bonds is aromatic — Only flat, fully conjugated rings with 4n + 2 π electrons; cyclobutadiene (4) and cyclooctatetraene (8, which puckers into a tub) are not.'
  ],
  formulas: [
    {
      name: 'Delocalisation energy from heats of hydrogenation',
      expr: 'Es = m*h1 - h', tex: 'E_{\\text{deloc}} = m\\,q_1 - q',
      vars: {
        Es: { name: 'delocalisation (resonance) energy', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: 'E_{\\text{deloc}}' },
        m: { name: 'number of C=C in the Kekulé structure', int: true, value: 3 },
        h1: { name: 'heat released hydrogenating one isolated C=C (cyclohexene)', q: 'molarenergy', unit: 'kJ/mol', value: 120, tex: 'q_1' },
        h: { name: 'heat actually released hydrogenating the compound', q: 'molarenergy', unit: 'kJ/mol', value: 208, tex: 'q' }
      },
      note: 'Defaults: benzene. The same comparison works for other rings: a positive result means extra stability.',
      practice: { unknowns: ['Es', 'h'] },
      stories: {
        Es: 'Hydrogenating a compound with {m} double bonds in its Kekulé structure releases {h}; an isolated C=C releases {h1}. How much delocalisation energy does it have?',
        h: 'An aromatic compound with {m} Kekulé double bonds has a delocalisation energy of {Es}. How much heat does its hydrogenation release, if an isolated C=C gives {h1}?'
      }
    },
    {
      name: 'Hückel\'s rule',
      expr: 'Npi = 4*n + 2', tex: 'N_{\\pi} = 4n + 2',
      vars: {
        Npi: { name: 'π electrons in an aromatic ring', q: 'count', tex: 'N_{\\pi}' },
        n: { name: 'any whole number 0, 1, 2 …', int: true, value: 1 }
      },
      note: 'Applies to flat rings in which every atom has a p orbital. Benzene: n = 1 (6 π electrons); naphthalene: n = 2 (10).',
      practice: { unknowns: ['Npi'] }
    }
  ],
  examples: [
    {
      title: 'The stability of benzene',
      q: 'Hydrogenating cyclohexene releases 120 kJ/mol; hydrogenating benzene to cyclohexane releases 208 kJ/mol. Estimate benzene\'s delocalisation energy.',
      steps: [
        'A ring with three isolated C=C would release $3 \\times 120 = 360$ kJ/mol.',
        'Benzene releases only 208 kJ/mol, so it started $360 - 208 = 152$ kJ/mol lower in energy.',
        'That is more than half a C–C σ bond — enough to explain why benzene refuses addition reactions.'
      ],
      a: 'About 150 kJ/mol.'
    },
    {
      title: 'Is it aromatic?',
      q: 'Pyridine, $\\ce{C5H5N}$, is a benzene ring with one CH replaced by N. The nitrogen\'s lone pair points outwards, in the plane of the ring. Is pyridine aromatic?',
      steps: [
        'The ring is flat and every atom is sp² with a p orbital, so it is fully conjugated.',
        'Each of the five carbons and the nitrogen gives one π electron: 6. The lone pair lies in the plane, outside the π system, and does not count.',
        '$6 = 4 \\times 1 + 2$: Hückel\'s rule is satisfied.'
      ],
      a: 'Yes — and because its lone pair is free, pyridine is also a base.'
    }
  ],
  quiz: [
    { q: 'How long are the carbon–carbon bonds in benzene?', choices: ['three of 1.54 Å and three of 1.34 Å', 'all 1.39 Å', 'all 1.54 Å', 'all 1.20 Å'], a: 1,
      why: 'Delocalisation makes all six bonds identical, intermediate between single (1.54 Å) and double (1.34 Å).' },
    { q: 'Benzene decolourises bromine water quickly, like cyclohexene.', a: false,
      why: 'Addition would destroy the aromatic ring and its 150 kJ/mol of extra stability. Benzene reacts with bromine only with an iron(III) bromide catalyst, and then by substitution.' },
    { q: 'Why does benzene undergo substitution rather than addition?', choices: ['it has no π electrons', 'substitution keeps the delocalised ring and its stability', 'its carbons are sp³', 'addition is impossible for rings'], a: 1,
      why: 'Swapping H for another group leaves the six π electrons delocalised; adding across a bond would break that system.' },
    { q: 'Using $N_\\pi = 4n + 2$, how many π electrons does the next aromatic ring after naphthalene\'s (n = 2) have?', answer: 14,
      why: 'n = 3 gives 14, the count in anthracene and phenanthrene, three fused rings.' },
    { q: 'Which group makes a benzene ring react faster with electrophiles?', choices: ['–NO₂', '–COOH', '–OH', '–CHO'], a: 2,
      why: 'The lone pairs on oxygen feed electron density into the ring, making it more attractive to electrophiles. –NO₂, –COOH and –CHO pull electrons out and slow substitution.' }
  ],
  applications: ['Polystyrene, PET, polycarbonate and Kevlar all contain aromatic rings.', 'Most drugs contain at least one aromatic ring.', 'Nitration of benzene and toluene starts the routes to dyes, polyurethane foams and explosives.', 'Aromatic hydrocarbons raise the octane number of petrol, but benzene itself is limited because it is carcinogenic.'],
  history: 'Faraday isolated benzene in 1825 from the oily residue of London\'s gas supply. Kekulé proposed the ring in 1865 (later telling a story of dreaming of a snake biting its tail). X-ray diffraction by Kathleen Lonsdale in 1929 showed that the ring is flat with equal bonds, and Hückel\'s quantum treatment followed in 1931.',
  sim: { id: 'org-groups', params: { mol: 'benzene' } }
}

);
