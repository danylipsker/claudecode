/* HYPER-CHEMISTRY · content/covalent.js — covalent bonding: shared electron pairs,
 * Lewis structures and the rules for drawing them, formal charge, resonance,
 * polar bonds, and how bond order sets length, strength and stiffness. */
Hyper.add(

{
  id: 'covalent-bonds', parent: 'covalent', title: 'Covalent bonds', level: 1,
  short: 'Two atoms share a pair of electrons, and the attraction of both nuclei to that shared pair holds them together. Sharing one, two or three pairs gives single, double and triple bonds.',
  keywords: ['covalent bond', 'shared pair', 'electron pair', 'bond length', 'bond energy', 'octet rule', 'single bond', 'double bond', 'triple bond', 'dative bond', 'coordinate bond', 'network solid', 'molecular substance', 'photodissociation'],
  prereq: ['valence-electrons', 'electron-configuration', 'physics:electric-potential-energy'],
  related: ['ionic-bonding', 'metallic-bonding', 'lewis-structures', 'bond-order-length', 'molecular-orbitals', 'bond-enthalpies', 'coordination-compounds', 'physics:pauli-exclusion', 'physics:photon'],
  body: `
Two hydrogen atoms far apart each hold one electron in a 1s orbital. Bring them together and each electron starts to feel both nuclei. Electron density builds up in the region between the nuclei, where it is attracted by both at once, and that shared density pulls the two nuclei towards each other. This is a **covalent bond**: a pair of electrons shared between two atoms.

The energy falls as the atoms approach, reaches a minimum at 74 pm — the **bond length** — and rises steeply if they are pushed closer, as the nuclei repel each other. The depth of the minimum, 436 kJ/mol, is the energy needed to pull the atoms apart again: the **bond energy**. The simulation below draws this curve for real molecules.

Why a *pair*? Two electrons can share one orbital only if their spins are opposite ([[physics:pauli-exclusion|Pauli exclusion]]). A third electron would have to go into a higher, antibonding orbital that weakens the bond — which is why two helium atoms do not bond ([[molecular-orbitals]]).

### Counting bonds
An atom of the second period has four valence orbitals, room for eight electrons. Shared electrons count for both partners, so atoms tend to form enough bonds to be surrounded by eight — the **octet rule** (two for hydrogen). The usual number of bonds follows: H and F one, O two, N three, C four ([[lewis-structures]]). Two atoms can share one, two or three pairs:

| Bond | length (pm) | bond enthalpy (kJ/mol) |
|---|---|---|
| C–C in ethane | 154 | 347 |
| C=C in ethene | 134 | 614 |
| C≡C in ethyne | 120 | 839 |

Each extra shared pair makes the bond shorter and stronger, though not in proportion ([[bond-order-length]]).

### Dative (coordinate) bonds
Both electrons of a shared pair may come from the same atom. Ammonia uses its lone pair to take a proton, $\\ce{NH3 + H+ -> NH4+}$, and boron trifluoride accepts ammonia's lone pair to form $\\ce{F3B-NH3}$. Once formed, a dative bond is an ordinary covalent bond: the four N–H bonds of ammonium are identical. Metal complexes are held together this way ([[coordination-compounds]]).

### Molecules and networks
Most covalent substances are **molecular**: strong bonds inside small molecules and weak forces between them ([[intermolecular-forces]]). Methane boils at −161.5 °C although each C–H bond needs about 413 kJ/mol to break — boiling separates molecules without breaking a single bond. When covalent bonds run through a whole solid, it is a **network** (giant covalent) solid: diamond, silicon, quartz ($\\ce{SiO2}$), silicon carbide. There is no small unit to set free, so they are hard and very high-melting: quartz melts at 1713 °C, and carbon does not melt at all at ordinary pressure but sublimes near 3600 °C.

### The energy scale
Per molecule, 436 kJ/mol is $7.2\\times10^{-19}$ J, or 4.5 eV. The thermal energy at room temperature, $k_B T$, is only 0.026 eV — about 170 times less — so bonds survive at room temperature. A photon can deliver the energy in one piece: the longest wavelength able to break a bond is $\\lambda = hcN_A/D$. For Cl–Cl (243 kJ/mol) that is 492 nm, blue-green light, which is why chlorine and methane react in sunlight; for O=O (498 kJ/mol) it is 240 nm, ultraviolet that splits oxygen high in the stratosphere and so feeds the ozone layer.
`,
  ideas: [
    'A covalent bond is a pair of electrons shared between two atoms; both nuclei are attracted to the shared density between them.',
    'The bond length is the distance of lowest energy; the bond energy is the depth of that minimum.',
    'Second-period atoms usually end up with eight electrons around them; that sets the number of bonds they form.',
    'In a dative bond both electrons come from one atom, but once formed it is an ordinary covalent bond.',
    'Molecular substances melt and boil easily because only weak forces act between molecules; network solids must break covalent bonds and melt very high.'
  ],
  pitfalls: [
    'Breaking a bond releases the energy stored in it — Breaking always costs energy. Energy is released when new, stronger bonds form; fuels and ATP give out energy because their products are more strongly bonded.',
    'Covalent substances have low melting points — Only molecular ones. Network solids such as diamond, quartz and silicon carbide are among the most heat-resistant materials known.',
    'The shared electrons sit still halfway between the nuclei — They form a cloud spread over the whole molecule; only its density is enhanced between the nuclei.'
  ],
  formulas: [
    {
      name: 'Energy of one bond',
      expr: 'Eb = D/NA', tex: 'E_b = \\frac{D}{N_A}',
      vars: {
        Eb: { name: 'energy to break one bond', q: 'energy', unit: 'eV', tex: 'E_b' },
        D: { name: 'bond enthalpy per mole', q: 'molarenergy', unit: 'kJ/mol', value: 436 },
        NA: { const: 'NA' }
      },
      solveFor: 'Eb',
      note: 'Defaults: the H–H bond. Compare with $k_B T = 0.026$ eV at room temperature.',
      practice: { unknowns: ['Eb', 'D'] },
      stories: {
        Eb: 'A bond has a bond enthalpy of {D}. How much energy does it take to break one such bond?',
        D: 'Breaking one bond takes {Eb}. What is the bond enthalpy per mole?'
      }
    },
    {
      name: 'Longest wavelength that can break a bond',
      expr: 'lam = h*c*NA/D', tex: '\\lambda_\\text{max} = \\frac{h c N_A}{D}',
      vars: {
        lam: { name: 'longest wavelength whose photons can break the bond', q: 'length', unit: 'nm', tex: '\\lambda_\\text{max}' },
        h: { const: 'h' }, c: { const: 'c' }, NA: { const: 'NA' },
        D: { name: 'bond enthalpy', q: 'molarenergy', unit: 'kJ/mol', value: 243 }
      },
      solveFor: 'lam',
      note: 'One photon per bond. Defaults: Cl–Cl. Shorter wavelengths carry more energy and also break the bond; longer ones cannot, however bright the light.',
      practice: { unknowns: ['lam', 'D'] },
      stories: {
        lam: 'A bond has a bond enthalpy of {D}. What is the longest wavelength of light that can break it?',
        D: 'Light of wavelength {lam} or shorter just manages to break a certain bond. What is its bond enthalpy?'
      }
    }
  ],
  examples: [
    {
      title: 'Chlorine in sunlight',
      q: 'The Cl–Cl bond enthalpy is 243 kJ/mol. Which part of visible light (400–700 nm) can split chlorine molecules into atoms?',
      steps: [
        { text: 'The longest useful wavelength:', tex: '\\lambda_\\text{max} = \\frac{(6.626\\times10^{-34})(2.998\\times10^{8})(6.022\\times10^{23})}{243\\,000} = 4.92\\times10^{-7}\\ \\mathrm{m}' },
        'That is 492 nm. Violet, blue and blue-green light (400–492 nm) have enough energy per photon; yellow and red light do not.',
        'The chlorine atoms made this way start the chain reaction that chlorinates methane in sunlight.'
      ],
      a: 'Light shorter than 492 nm: violet to blue-green.'
    },
    {
      title: 'Why molecules survive at room temperature',
      q: 'Compare the energy of the H–H bond per molecule with $k_B T$ at 25 °C, and estimate the Boltzmann factor $e^{-E_b/k_B T}$.',
      steps: [
        '$E_b = 436\\,000 / 6.022\\times10^{23} = 7.24\\times10^{-19}\\ \\mathrm{J} = 4.52\\ \\mathrm{eV}$.',
        '$k_B T = 1.381\\times10^{-23} \\times 298 = 4.12\\times10^{-21}\\ \\mathrm{J} = 0.0257\\ \\mathrm{eV}$.',
        'The ratio is $4.52/0.0257 = 176$, and $e^{-176} \\approx 4\\times10^{-77}$.',
        'Thermal jostling essentially never supplies enough energy to one bond; it takes a flame, an electric arc or an ultraviolet photon.'
      ],
      a: 'The bond energy is about 176 times $k_B T$; the chance of thermal breaking is about $10^{-76}$.'
    }
  ],
  quiz: [
    { q: 'What holds two atoms together in a covalent bond?', choices: ['magnetic attraction between the two electron spins', 'the attraction of both nuclei to the electron pair concentrated between them', 'the gravitational pull between the nuclei', 'the electrons orbiting both atoms in a figure of eight'], a: 1,
      why: 'The shared electron density lies where it is attracted by both nuclei at once; that attraction outweighs the repulsion of the nuclei down to the bond length.' },
    { q: 'Once the ammonium ion has formed, its dative N–H bond can be told apart from the other three.', a: false,
      why: 'The origin of the electrons is history. All four N–H bonds of NH₄⁺ have the same length and energy, and the ion is a perfect tetrahedron.' },
    { q: 'Methane (C–H bond enthalpy 413 kJ/mol) boils at −161.5 °C, while quartz melts at 1713 °C. Why?', choices: ['C–H bonds are weaker than they look', 'Boiling methane only separates molecules; melting quartz has to break Si–O bonds in a network', 'Quartz is ionic', 'Methane molecules are lighter'], a: 1,
      why: 'In a molecular substance the covalent bonds stay intact on boiling. Quartz has no molecules: its Si–O bonds form one continuous network.' },
    { q: 'The F–F bond enthalpy is 158 kJ/mol. What is the longest wavelength of light that can break it, in nm?', answer: 757, unit: 'nm',
      why: '$\\lambda = hcN_A/D = 0.1196\\ \\mathrm{J\\,m\\,mol^{-1}} / 158\\,000\\ \\mathrm{J\\,mol^{-1}} = 7.57\\times10^{-7}$ m — deep red light already splits fluorine.' },
    { q: 'Breaking a chemical bond releases the energy stored in it.', a: false,
      why: 'Breaking a bond always costs energy. A reaction gives out energy only when the bonds it forms are stronger overall than those it breaks.' }
  ],
  applications: [
    'Polymers and plastics, held together by carbon–carbon and carbon–oxygen backbones.',
    'Semiconductors: the covalent network of silicon.',
    'Photochemistry: chlorination, the ozone layer, photodegradation of plastics in sunlight.',
    'Superhard network solids (diamond, cubic boron nitride, silicon carbide) for cutting and grinding tools.'
  ],
  sim: { id: 'bond-pe-curve', params: { pair: 'H2' } }
},

{
  id: 'lewis-structures', parent: 'covalent', title: 'Lewis structures', level: 1,
  short: 'A diagram of a molecule that shows every valence electron: shared pairs as bond lines and unshared pairs as dots. A short recipe produces it for most molecules.',
  keywords: ['Lewis structure', 'Lewis diagram', 'electron dot structure', 'lone pair', 'bonding pair', 'octet rule', 'valence electrons', 'skeleton structure', 'expanded octet', 'hypervalent', 'radical', 'electron deficient', 'N − A = S'],
  prereq: ['covalent-bonds', 'valence-electrons'],
  related: ['formal-charge', 'resonance', 'vsepr', 'molecular-orbitals', 'oxidation-numbers', 'functional-groups'],
  body: `
A Lewis structure is a piece of electron bookkeeping: atoms written as their symbols, each shared pair drawn as a line, each unshared (**lone**) pair as two dots. It tells you which atom is bonded to which and where every valence electron is. It does not show the shape of the molecule — that comes afterwards, from [[vsepr]].

### A recipe that works for most molecules
1. **Count** the valence electrons: the group number for each main-group atom (H 1, C 4, N 5, O 6, halogens 7). Add one for each negative charge and remove one for each positive charge.
2. **Build a skeleton.** The least electronegative atom usually goes in the middle — never hydrogen, which forms only one bond. Hydrogen and fluorine are always on the outside, and in oxyacids hydrogen sits on an oxygen: H–O–Cl, not H–Cl–O.
3. **Join** the atoms with single bonds, two electrons each.
4. **Complete the outer atoms** with lone pairs until each has eight electrons around it (hydrogen two).
5. **Put what is left on the central atom.**
6. If the central atom still has fewer than eight, **turn lone pairs of its neighbours into double or triple bonds**.
7. **Check the formal charges** and prefer the arrangement that keeps them smallest ([[formal-charge]]).

Carbon dioxide: $4 + 2\\times6 = 16$ electrons. Two single bonds use 4; each oxygen takes 6 more as lone pairs, which uses the other 12 and leaves carbon with only four electrons around it. Moving one lone pair from each oxygen into its bond gives $\\ce{O=C=O}$, with every atom at eight.

### A shortcut: N − A = S
Add up the electrons the atoms would need for full shells, $N$ (8 for every atom, 2 for hydrogen), and the electrons actually available, $A$. A shared pair counts for both atoms, so the shortfall is made up by sharing: $S = N - A$ electrons are shared, in $S/2$ bonds, and the remaining $A - S$ electrons form lone pairs. For HCN: $N = 2 + 8 + 8 = 18$, $A = 1 + 4 + 5 = 10$, so $S = 8$ — four bonds between three atoms, which means a triple bond: H–C≡N, with one lone pair on nitrogen.

### Where the octet rule gives way
- **Odd numbers of electrons.** NO has 11 valence electrons and $\\ce{NO2}$ has 17, so one electron stays unpaired: they are **radicals**, which is why $\\ce{NO2}$ pairs up into $\\ce{N2O4}$ when cooled.
- **Electron-deficient atoms.** Boron in $\\ce{BF3}$ has only six electrons around it. That gap is why $\\ce{BF3}$ grabs a lone pair from ammonia.
- **More than eight.** From the third period on, a central atom can carry more than four neighbours: $\\ce{PCl5}$, $\\ce{SF6}$, $\\ce{XeF4}$, $\\ce{I3-}$. They are drawn with 10 or 12 electrons on the central atom. The bonding is better described as spread over several atoms with some charge separation than as using d orbitals, but the drawings still predict the shapes well.

> [!warn] A Lewis structure is a model, not a photograph. It cannot explain why liquid oxygen is attracted by a magnet (two unpaired electrons, see [[molecular-orbitals]]), and when electrons are spread over several bonds a single drawing is not enough ([[resonance]]).

Try it in the trainer below: count, build, and let it check your octets and formal charges.
`,
  ideas: [
    'Count valence electrons first, including the charge of an ion; every electron must appear once, as a bond or a lone pair.',
    'The least electronegative atom (never H) usually goes in the centre; H and F are always terminal.',
    'Fill the outer atoms first, then the centre; convert lone pairs into multiple bonds if the centre is short of eight.',
    'N − A = S gives the number of shared electrons directly: bonds = (N − A)/2.',
    'Radicals, boron compounds and heavier central atoms break the octet rule.'
  ],
  pitfalls: [
    'A Lewis structure shows the shape of the molecule — It shows connections and electron pairs only. Water drawn as H–O–H in a straight line is still bent.',
    'The charge of an ion can be ignored when counting — Each negative charge adds an electron and each positive charge removes one: NH₄⁺ has 8 valence electrons, not 9.',
    'Atoms with more than eight electrons use d orbitals to bond — Calculations show d orbitals play only a small part; the extra bonding is delocalised and partly ionic. The drawing is bookkeeping.'
  ],
  formulas: [
    {
      name: 'Number of bonds: N − A = S',
      expr: 'nb = (N - A)/2', tex: 'n_\\text{bonds} = \\frac{N - A}{2}',
      vars: {
        nb: { name: 'number of bonds (shared pairs)', int: true, tex: 'n_\\text{bonds}' },
        N: { name: 'electrons needed for full shells: 8 per atom, 2 per hydrogen', int: true, value: 24 },
        A: { name: 'valence electrons available', int: true, value: 16 }
      },
      solveFor: 'nb',
      note: 'Defaults: CO₂ ($N = 3\\times8$, $A = 16$): four bonds between three atoms, so two double bonds. It works for octet molecules; not for radicals, boron compounds or expanded octets.',
      practice: { unknowns: ['nb', 'A'] },
      stories: {
        nb: 'The atoms of a molecule would need {N} electrons for full shells and have {A} valence electrons between them. How many bonds does the Lewis structure contain?',
        A: 'A Lewis structure has {nb} bonds and its atoms need {N} electrons for full shells. How many valence electrons are there?'
      }
    },
    {
      name: 'Number of lone pairs',
      expr: 'nlp = (A - 2*nb)/2', tex: 'n_\\text{lone} = \\frac{A - 2\\,n_\\text{bonds}}{2}',
      vars: {
        nlp: { name: 'number of lone pairs', int: true, tex: 'n_\\text{lone}' },
        A: { name: 'valence electrons available', int: true, value: 16 },
        nb: { name: 'number of bonds', int: true, value: 4, tex: 'n_\\text{bonds}' }
      },
      solveFor: 'nlp',
      note: 'Every electron not in a bond is in a lone pair. CO₂: 16 electrons, 4 bonds, 4 lone pairs (two on each oxygen).',
      practice: { unknowns: ['nlp'] },
      stories: {
        nlp: 'A molecule with {A} valence electrons has {nb} bonds. How many lone pairs does its Lewis structure show?'
      }
    },
    {
      name: 'Valence electrons of an ion',
      expr: 'A = V - q', tex: 'A = V - q',
      vars: {
        A: { name: 'valence electrons in the Lewis structure', int: true },
        V: { name: 'sum of the atoms\' valence electrons', int: true, value: 23 },
        q: { name: 'charge of the ion', int: true, signed: true, value: -1 }
      },
      solveFor: 'A',
      note: 'Defaults: nitrate, $\\ce{NO3-}$: $5 + 3\\times6 = 23$, plus one for the negative charge.',
      practice: { unknowns: ['A', 'q'] },
      stories: {
        A: 'The atoms of an ion have {V} valence electrons between them, and the ion carries a charge of {q}. How many electrons go into its Lewis structure?'
      }
    }
  ],
  examples: [
    {
      title: 'The nitrate ion',
      q: 'Draw the Lewis structure of $\\ce{NO3-}$.',
      steps: [
        'Electrons: $5 + 3\\times6 + 1 = 24$.',
        'Skeleton: N in the middle with three O around it. Three single bonds use 6 electrons.',
        'Each oxygen takes three lone pairs (18 electrons): all 24 are used, but nitrogen has only 6 around it.',
        'Move one lone pair from an oxygen into a double bond: N now has 8. Check with $N - A$: $32 - 24 = 8$ shared electrons, 4 bonds.',
        'Formal charges: N +1, the doubly bonded O 0, each singly bonded O −1; they add to −1, the charge of the ion.',
        'Any of the three oxygens could carry the double bond: the three drawings are resonance structures of one ion.'
      ],
      a: 'One N=O and two N–O⁻ bonds, drawn in three equivalent ways.'
    },
    {
      title: 'Formaldehyde',
      q: 'Draw the Lewis structure of methanal (formaldehyde), $\\ce{CH2O}$.',
      steps: [
        'Electrons: $4 + 2\\times1 + 6 = 12$.',
        '$N = 8 + 8 + 2 + 2 = 20$, so $S = 20 - 12 = 8$: four bonds.',
        'Carbon in the middle with two H and one O: three single bonds, so the fourth bond must be a C=O double bond.',
        'Lone pairs: $(12 - 8)/2 = 2$, both on oxygen.'
      ],
      a: 'H₂C=O with two lone pairs on oxygen; every atom has a full shell.'
    }
  ],
  quiz: [
    { q: 'How many valence electrons does the Lewis structure of the sulfate ion $\\ce{SO4^2-}$ contain?', answer: 32,
      why: 'Sulfur 6, four oxygens 24, plus 2 for the charge: 32.' },
    { q: 'What is the skeleton of hypochlorous acid, HOCl?', choices: ['H–Cl–O', 'H–O–Cl', 'Cl–H–O', 'O–H–Cl'], a: 1,
      why: 'In oxyacids the acidic hydrogen is bonded to oxygen, and hydrogen can only be terminal. Oxygen, with two bonds, takes the middle.' },
    { q: 'How many lone pairs are in the Lewis structure of N₂?', choices: ['0', '1', '2', '3'], a: 2,
      why: '10 valence electrons: a triple bond uses 6, leaving 4 — one lone pair on each nitrogen.' },
    { q: 'Every atom in a stable molecule is surrounded by eight electrons.', a: false,
      why: 'Hydrogen has two, boron in BF₃ six, the nitrogen in NO has an odd count, and sulfur in SF₆ is drawn with twelve.' },
    { q: 'Apply N − A = S to ethyne, C₂H₂. What does it predict?', choices: ['4 bonds, all single', '5 bonds, so a C≡C triple bond', '5 bonds: a C=C double bond with a lone pair on each carbon', '6 bonds'], a: 1,
      why: '$N = 2\\times8 + 2\\times2 = 20$, $A = 2\\times4 + 2 = 10$, $S = 10$: five bonds. Two are C–H, so three join the carbons: H–C≡C–H, with no lone pairs.' }
  ],
  applications: [
    'Locating lone pairs, the sites where a molecule acts as a base, a nucleophile or a ligand.',
    'The starting point for molecular shapes (VSEPR), polarity and reaction mechanisms.',
    'Spotting radicals such as NO and NO₂ in exhaust gases and smog.'
  ],
  history: 'Gilbert N. Lewis proposed in 1916 that a chemical bond is a pair of electrons shared by two atoms, drawing electrons as dots at the corners of a cube; Irving Langmuir popularised the octet rule a few years later.',
  sim: 'bond-lewis'
},

{
  id: 'formal-charge', parent: 'covalent', title: 'Formal charge', level: 2,
  short: 'A bookkeeping charge given to each atom of a Lewis structure by splitting every bond evenly. It picks the best of several possible structures: the one with the smallest formal charges, and negative ones on electronegative atoms.',
  keywords: ['formal charge', 'Lewis structure', 'best structure', 'cyanate', 'thiocyanate', 'carbon monoxide', 'dinitrogen monoxide', 'oxidation number', 'bookkeeping'],
  prereq: ['lewis-structures', 'electronegativity'],
  related: ['resonance', 'oxidation-numbers', 'bond-polarity', 'coordination-compounds', 'reaction-mechanisms-organic'],
  body: `
Several Lewis structures can satisfy the octet rule and still put the electrons in different places. **Formal charge** is the tie-breaker: it compares the electrons an atom "owns" in a structure with those it brought as a free atom.

### The rule
Give each atom all of its lone-pair electrons and **half** of every bond — as if each shared pair were split exactly evenly — and subtract that from its number of valence electrons $V$:

$$\\text{FC} = V - L - \\frac{B}{2}$$

where $L$ counts lone-pair electrons and $B$ bonding electrons. In the ammonium ion nitrogen has four bonds and no lone pair: $5 - 0 - 4 = +1$; each hydrogen $1 - 0 - 1 = 0$. In hydroxide, oxygen has three lone pairs and one bond: $6 - 6 - 1 = -1$. The formal charges of a structure always add up to its total charge — a quick check on any drawing.

### Choosing between structures
The structure that best represents a molecule is usually the one that
1. keeps the formal charges as small as possible, ideally all zero;
2. puts negative formal charge on the more electronegative atom;
3. avoids like charges on neighbouring atoms.

These rules never justify giving C, N, O or F more than eight electrons.

Carbon dioxide can be drawn O=C=O (all zero) or O≡C–O (+1 on the triply bonded oxygen, −1 on the other). The first wins, and indeed both C–O bonds are the same, 116 pm.

The cyanate ion, $\\ce{OCN-}$, offers three octet structures:

| Structure | formal charges O, C, N |
|---|---|
| ⁻O–C≡N | −1, 0, 0 |
| O=C=N⁻ | 0, 0, −1 |
| ⁺O≡C–N²⁻ | +1, 0, −2 |

The third is poor: large charges, and a positive one on the most electronegative atom. The first two each carry a single −1, and the first puts it on oxygen, the more electronegative atom, so it is the major contributor; the real ion is a blend of the two ([[resonance]]).

### When the formal charge looks wrong
In carbon monoxide the only structure that gives both atoms an octet is :C≡O: — with −1 on carbon and +1 on oxygen, against their electronegativities. The molecule agrees in its own way: its dipole moment is tiny (0.11 D) and, unusually, points with the negative end at carbon, because the formal charges nearly cancel the pull of oxygen. It also explains chemistry: CO bonds to metals, and to the iron of haemoglobin, through the lone pair on carbon.

### Formal charge is not real charge
Formal charge assumes perfectly even sharing; [[oxidation-numbers]] assume the opposite, giving every bonding electron to the more electronegative atom. Real partial charges lie in between. Nitrogen in $\\ce{NH4+}$ has formal charge +1 and oxidation number −3, and calculations put a small *negative* charge on it — the positive charge is mostly on the hydrogens. Use formal charge to choose structures and to follow electrons in [[reaction-mechanisms-organic|reaction mechanisms]], not as a measured charge.

> [!note] The sulfate ion is drawn two ways in textbooks: with two S=O bonds (zero formal charge on sulfur, but 12 electrons around it) or with four S–O single bonds (sulfur +2, each oxygen −1, octet kept). Modern calculations favour the second, strongly polarised picture; the measured S–O length, 149 pm, lies between typical single and double bonds.
`,
  ideas: [
    'Formal charge = valence electrons − lone-pair electrons − half the bonding electrons.',
    'The formal charges of a structure always add up to the overall charge.',
    'Prefer structures with the smallest formal charges and with negative charge on the more electronegative atom.',
    'Formal charge is bookkeeping: real partial charges are usually much smaller and can even have the other sign.'
  ],
  pitfalls: [
    'Formal charge is the real charge on the atom — It assumes perfectly even sharing. Real partial charges come from electronegativity and are usually much smaller.',
    'Formal charge and oxidation number are the same thing — Formal charge splits bonding electrons evenly; oxidation number gives them all to the more electronegative atom. Nitrogen in NH₄⁺: +1 and −3.',
    'Zero formal charges justify any structure — Not at the cost of more than eight electrons on C, N, O or F.'
  ],
  formulas: [
    {
      name: 'Formal charge of an atom',
      expr: 'FC = V - L - B/2', tex: '\\mathrm{FC} = V - L - \\frac{B}{2}',
      vars: {
        FC: { name: 'formal charge', int: true, signed: true, tex: '\\mathrm{FC}' },
        V: { name: 'valence electrons of the free atom', int: true, value: 6 },
        L: { name: 'electrons in lone pairs on the atom', int: true, value: 2 },
        B: { name: 'electrons in the atom\'s bonds', int: true, value: 6 }
      },
      solveFor: 'FC',
      note: 'Defaults: the central oxygen of ozone, O=O–O: one lone pair and three bonds, formal charge +1.',
      practice: { unknowns: ['FC', 'L'] },
      stories: {
        FC: 'In a Lewis structure an atom with {V} valence electrons has {L} lone-pair electrons and {B} bonding electrons. What is its formal charge?',
        L: 'An atom with {V} valence electrons shares {B} bonding electrons and has a formal charge of {FC}. How many lone-pair electrons does it carry?'
      }
    }
  ],
  examples: [
    {
      title: 'Dinitrogen monoxide, N₂O',
      q: 'Laughing gas has the skeleton N–N–O and 16 valence electrons. Compare the structures N=N=O, N≡N–O and N–N≡O by formal charge.',
      steps: [
        'N≡N–O: end N (one lone pair, three bonds) $5 - 2 - 3 = 0$; central N (four bonds) $5 - 0 - 4 = +1$; O (three lone pairs, one bond) $6 - 6 - 1 = -1$.',
        'N=N=O: end N (two lone pairs, two bonds) $5 - 4 - 2 = -1$; central N $+1$; O (two lone pairs, two bonds) $6 - 4 - 2 = 0$.',
        'N–N≡O: end N (three lone pairs, one bond) $5 - 6 - 1 = -2$; central N $+1$; O (one lone pair, three bonds) $6 - 2 - 3 = +1$.',
        'The third is poor. The first puts −1 on oxygen, the second on nitrogen: both contribute, the first slightly more.',
        'Measured: N–N 113 pm (between N=N 125 and N≡N 110) and N–O 118 pm (between single and double) — just what a blend of the first two predicts.'
      ],
      a: 'N≡N–O and N=N=O both contribute (the first slightly more); N–N≡O does not.'
    }
  ],
  quiz: [
    { q: 'What is the formal charge on nitrogen in the ammonium ion, NH₄⁺?', answer: 1,
      why: 'Nitrogen has 5 valence electrons, no lone pairs and 8 bonding electrons: $5 - 0 - 4 = +1$.' },
    { q: 'In the Lewis structure :C≡O: the formal charges are…', choices: ['C 0, O 0', 'C −1, O +1', 'C +1, O −1', 'C −2, O +2'], a: 1,
      why: 'Carbon: $4 - 2 - 3 = -1$. Oxygen: $6 - 2 - 3 = +1$. The octets force this unusual arrangement.' },
    { q: 'The formal charges in a Lewis structure always add up to the overall charge of the molecule or ion.', a: true,
      why: 'Adding $V - L - B/2$ over all atoms gives the total valence electrons minus all electrons drawn, which is the charge.' },
    { q: 'Which structure of the thiocyanate ion, SCN⁻, is the best single representation?', choices: ['[S–C≡N]⁻, with −1 on S', '[S=C=N]⁻, with −1 on N', '[S≡C–N]⁻, with +1 on S and −2 on N', 'all three are equally good'], a: 1,
      why: 'The first two each have a single −1. Nitrogen (3.04) is more electronegative than sulfur (2.58), so the negative charge sits better on N. In reality both contribute, which is why thiocyanate can bind metals through S or through N.' },
    { q: 'Nitrogen in NH₄⁺ has formal charge +1 and oxidation number −3. Which describes its actual charge?', choices: ['exactly +1', 'exactly −3', 'neither: a small partial charge; both numbers are bookkeeping conventions', 'the average, −1'], a: 2,
      why: 'Formal charge assumes even sharing, oxidation number assumes complete transfer. Real partial charges lie in between and are small.' }
  ],
  applications: [
    'Choosing the best Lewis structure and ranking resonance contributors.',
    'Following electrons through reaction mechanisms with curly arrows.',
    'Explaining why carbon monoxide binds metals (and haemoglobin) through carbon.',
    'Predicting which end of an ion such as cyanate, thiocyanate or nitrite attacks.'
  ],
  sim: { id: 'bond-lewis', params: { mol: 'OCN-' } }
},

{
  id: 'resonance', parent: 'covalent', title: 'Resonance', level: 2,
  short: 'When one Lewis structure cannot place the electrons correctly, the molecule is described by several structures that differ only in where electrons sit. The real molecule is a single blend of them, with averaged bonds and extra stability.',
  keywords: ['resonance', 'resonance structures', 'resonance hybrid', 'delocalisation', 'delocalized electrons', 'ozone', 'nitrate', 'carbonate', 'benzene', 'Kekulé', 'resonance energy', 'carboxylate', 'bond order'],
  prereq: ['lewis-structures', 'formal-charge'],
  related: ['bond-order-length', 'aromatic-compounds', 'molecular-orbitals', 'weak-acids', 'carboxylic-acids-esters', 'hess-law', 'physics:particle-in-a-box'],
  body: `
Draw ozone by the Lewis recipe and you get a double bond on one side and a single bond on the other. Nothing picks one side over the other, and the drawing predicts one short and one long bond. Experiment disagrees: both O–O bonds are 127.8 pm, between the 148 pm single bond of hydrogen peroxide and the 121 pm double bond of $\\ce{O2}$. The second bonding pair is not on either side; it is spread over both.

When a single Lewis structure cannot show where the electrons are, we draw several **resonance structures** and join them with a double-headed arrow:

$$\\ce{O=O-O <-> O-O=O}$$

The real molecule is **one** structure, the **resonance hybrid**, a weighted average of the drawings. It does not flip between them. Think of a colour such as teal: it is not blue one moment and green the next, but a single colour that is easiest to describe by naming both.

### Rules for resonance structures
- Only electrons move — lone pairs and the second or third pair of multiple bonds. Atoms stay where they are. Moving a hydrogen makes a different compound (a tautomer), not a resonance form.
- Every structure has the same number of electrons and the same overall charge.
- Second-period atoms still hold at most eight electrons.
- Structures contribute unequally: those with complete octets, fewer formal charges and negative charge on electronegative atoms count for more ([[formal-charge]]). Equivalent structures contribute equally.

### Averaged bonds
The hybrid's bonds are averages. The nitrate ion has three structures, each with one N=O and two N–O; every N–O bond is double in one of the three, so its **bond order** is $4/3$, and all three bonds are the same length, about 125 pm. The carbonate ion is the same: three C–O bonds of 129 pm, between C–O (143) and C=O (120). Benzene's six C–C bonds, averaged over two Kekulé structures, have bond order 1.5 and are all 139 pm ([[aromatic-compounds]]). The two C–O bonds of a carboxylate ion are both 127 pm.

### Delocalisation lowers the energy
The hybrid is more stable than any single structure would be, by the **resonance energy**. Adding hydrogen to cyclohexene (one C=C) releases 120 kJ/mol, so three isolated double bonds should release 360 kJ/mol; benzene releases only 208 kJ/mol. It is about 150 kJ/mol more stable than a ring with three ordinary double bonds. Physically, electrons spread over a larger region have lower kinetic energy — the same reason a particle in a longer box has lower levels ([[physics:particle-in-a-box]]).

The consequences are everywhere:
- Benzene prefers substitution to addition: addition would destroy the delocalisation.
- Carboxylic acids (acetic acid, $\\mathrm{p}K_a$ 4.8) are far stronger acids than alcohols (ethanol, about 16), because the negative charge of the carboxylate ion is shared by two oxygen atoms ([[weak-acids]]).
- In amides, the nitrogen lone pair is shared with the C=O group, so the C–N bond is partly double and cannot rotate: the peptide bonds of proteins are flat, which fixes the way protein chains fold.
`,
  ideas: [
    'Resonance structures differ only in the placement of electrons; the atoms stay put.',
    'The real molecule is a single resonance hybrid, not a mixture of molecules switching between forms.',
    'Bonds in a hybrid are averages: nitrate and carbonate have bond order 4/3, benzene 1.5.',
    'Delocalisation lowers the energy: benzene is about 150 kJ/mol more stable than three separate double bonds.',
    'Unequal structures contribute unequally: octets, small formal charges and sensible charge placement weigh most.'
  ],
  pitfalls: [
    'The molecule flips rapidly between its resonance structures — It has one fixed electron distribution all the time; the structures are only our way of drawing it.',
    'Moving a hydrogen gives another resonance structure — Moving an atom gives a different compound (a tautomer). In resonance only electrons move.',
    'All resonance structures count equally — Only equivalent ones do. A structure with extra formal charges contributes much less.'
  ],
  formulas: [
    {
      name: 'Average bond order over equivalent bonds',
      expr: 'BO = np/nl', tex: '\\text{BO} = \\frac{n_\\text{pairs}}{n_\\text{links}}',
      vars: {
        BO: { name: 'average bond order of each link', tex: '\\text{BO}' },
        np: { name: 'bonding pairs shared among the equivalent links (in one structure)', int: true, value: 4, tex: 'n_\\text{pairs}' },
        nl: { name: 'number of equivalent links', int: true, value: 3, tex: 'n_\\text{links}' }
      },
      solveFor: 'BO',
      note: 'Defaults: nitrate or carbonate, 4 pairs over 3 N–O or C–O links: 4/3. Ozone: 3 over 2 = 1.5; benzene ring: 9 over 6 = 1.5.',
      practice: { unknowns: ['BO'] },
      stories: {
        BO: 'In each resonance structure of an ion, {np} bonding pairs join the central atom to {nl} equivalent atoms. What is the bond order of each link?'
      }
    },
    {
      name: 'Resonance energy from heats of hydrogenation',
      expr: 'Eres = n*H1 - Hobs', tex: 'E_\\text{res} = n\\,Q_1 - Q_\\text{obs}',
      vars: {
        Eres: { name: 'resonance (delocalisation) energy', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_\\text{res}' },
        n: { name: 'number of double bonds in one resonance structure', int: true, fixed: true, value: 3 },
        H1: { name: 'heat released hydrogenating one isolated double bond', q: 'molarenergy', unit: 'kJ/mol', value: 120, tex: 'Q_1' },
        Hobs: { name: 'heat actually released by the molecule', q: 'molarenergy', unit: 'kJ/mol', value: 208, tex: 'Q_\\text{obs}' }
      },
      solveFor: 'Eres',
      note: 'Heats are given as positive numbers (the energy released). Defaults: benzene against cyclohexene.',
      practice: { unknowns: ['Eres', 'Hobs'] },
      stories: {
        Eres: 'Hydrogenating one isolated C=C releases {H1}; the molecule with {n} double bonds in its structure releases only {Hobs}. What is its resonance energy?',
        Hobs: 'A molecule drawn with {n} double bonds has a resonance energy of {Eres}. One isolated double bond releases {H1} on hydrogenation. How much heat does the molecule release?'
      }
    }
  ],
  examples: [
    {
      title: 'The carbonate ion',
      q: 'Draw the resonance structures of $\\ce{CO3^2-}$ and predict its C–O bond order, bond length and the charge on each oxygen.',
      steps: [
        'Electrons: $4 + 3\\times6 + 2 = 24$. Octets need one C=O and two C–O, so three structures, one for each oxygen carrying the double bond.',
        'Formal charges in each: C 0, the doubly bonded O 0, the two singly bonded O −1 each (total −2).',
        'Averaging: each C–O is double in one structure of three, so bond order $4/3$; the length lies between 143 and 120 pm — measured 129 pm for all three.',
        'Each oxygen carries −1 in two structures of three: an average of $-2/3$.'
      ],
      a: 'Three equivalent structures; every C–O has bond order 4/3 and length 129 pm, and each O carries −2/3 on average.'
    },
    {
      title: 'How stable is benzene?',
      q: 'Hydrogenation of cyclohexene releases 120 kJ/mol; hydrogenation of benzene to cyclohexane releases 208 kJ/mol. Estimate the resonance energy of benzene.',
      steps: [
        'A Kekulé structure has three C=C bonds. If they were isolated, hydrogenating them would release $3 \\times 120 = 360$ kJ/mol.',
        'Benzene releases only 208 kJ/mol, so it starts $360 - 208 = 152$ kJ/mol lower in energy than the hypothetical molecule.',
        'That stabilisation is the resonance energy — about 150 kJ/mol, comparable to a weak covalent bond.'
      ],
      a: 'About 150 kJ/mol.'
    }
  ],
  quiz: [
    { q: 'An ozone molecule switches back and forth rapidly between its two resonance structures.', a: false,
      why: 'Ozone has one structure all the time, with both O–O bonds equal (127.8 pm). The two drawings describe it together.' },
    { q: 'What is the average C–O bond order in the carbonate ion?', answer: 1.333,
      why: 'Four bonding pairs spread over three equivalent C–O links: $4/3 \\approx 1.33$.' },
    { q: 'Which pair are resonance structures of the same species?', choices: ['CH₃–CH=O and CH₂=CH–OH', 'the two Kekulé structures of benzene', 'cis- and trans-but-2-ene', 'H₂O and H₃O⁺'], a: 1,
      why: 'The Kekulé structures differ only in where the double bonds are drawn. The first pair differ in the position of a hydrogen (tautomers), the third in the arrangement of atoms in space, the fourth in the number of atoms.' },
    { q: 'C–O single bonds are about 143 pm and C=O double bonds about 120 pm. What are the C–O bonds of the carbonate ion like?', choices: ['two of 143 pm and one of 120 pm', 'all about 129 pm', 'all 120 pm', 'all 143 pm'], a: 1,
      why: 'All three are equivalent with bond order 4/3, so all have the same length, between single and double.' },
    { q: 'Why is acetic acid ($\\mathrm{p}K_a$ 4.8) a much stronger acid than ethanol ($\\mathrm{p}K_a$ about 16)?', choices: ['acetic acid has more hydrogen atoms', 'the negative charge of the acetate ion is shared by two oxygens through resonance', 'ethanol has no O–H bond', 'acetic acid is a larger molecule'], a: 1,
      why: 'Delocalisation stabilises the acetate ion, so losing the proton costs less. The ethoxide ion keeps its charge on one oxygen.' }
  ],
  applications: [
    'The stability and substitution chemistry of aromatic compounds, from benzene to dyes and drugs.',
    'The acidity of carboxylic acids and phenols.',
    'Flat, rigid peptide bonds, which shape proteins.',
    'Conducting polymers and dyes, whose colour comes from long delocalised electron systems.'
  ],
  history: 'Kekulé proposed the ring structure of benzene in 1865 and later suggested that its double bonds swap places continually. In the early 1930s Linus Pauling replaced that picture with resonance: one molecule, described by several structures at once.',
  sim: { id: 'bond-lewis', params: { mol: 'NO3-' } }
},

{
  id: 'bond-polarity', parent: 'covalent', title: 'Bond polarity and dipoles', level: 1,
  short: 'When two different atoms share electrons, the more electronegative one pulls the pair towards itself. The bond gets partial charges δ+ and δ− and an electric dipole moment — a continuum from purely covalent to ionic.',
  keywords: ['polar bond', 'nonpolar bond', 'partial charge', 'delta', 'electronegativity difference', 'dipole moment', 'debye', 'percent ionic character', 'polar covalent', 'bond dipole'],
  prereq: ['covalent-bonds', 'electronegativity'],
  related: ['molecular-polarity', 'ionic-bonding', 'formal-charge', 'intermolecular-forces', 'hydrogen-bonding', 'ir-spectroscopy', 'lattice-energy', 'physics:electric-field', 'physics:dielectrics'],
  body: `
Two identical atoms share their electron pair equally: the H–H and Cl–Cl bonds are symmetric. When the atoms differ, the more [[electronegativity|electronegative]] one pulls the shared pair towards itself. It gains a small negative charge, written δ−, and leaves its partner δ+. The bond is **polar**. In hydrogen chloride the chlorine end is δ− and the hydrogen end δ+.

### A continuum from covalent to ionic
The larger the difference in electronegativity, $\\Delta\\chi$, the more lopsided the sharing. Useful rough bands (Pauling values: H 2.20, C 2.55, N 3.04, O 3.44, F 3.98, Cl 3.16, Na 0.93):

- $\\Delta\\chi$ below about 0.4: essentially **nonpolar** — C–C, C–H (0.35). That is why hydrocarbons do not mix with water.
- About 0.4 to 1.7: **polar covalent** — C–O (0.89), H–Cl (0.96), O–H (1.24).
- Above about 1.7 to 2: mostly **ionic** — Na–Cl (2.23), where the electron has in effect been transferred ([[ionic-bonding]]).

These are guides on a continuous scale, not boundaries. Hydrogen fluoride ($\\Delta\\chi$ = 1.78) is a covalent molecule, and every "ionic" bond keeps some sharing.

### The dipole moment
Charges $+q$ and $-q$ a distance $d$ apart form an electric dipole of moment $\\mu = qd$. Chemists measure it in **debye**: 1 D = $3.336\\times10^{-30}$ C·m. A whole electron charge across 100 pm would give 4.80 D. The measured dipole of HCl is 1.11 D at a bond length of 127.5 pm; a fully ionic $\\ce{H+ Cl-}$ would give $e \\times 127.5\\ \\mathrm{pm} = 6.12$ D. So the partial charges are about $\\pm 0.18e$: the bond is "18 % ionic".

| Molecule | $\\Delta\\chi$ | $\\mu$ (D) | bond length (pm) | ionic character from $\\mu$ |
|---|---|---|---|---|
| HF | 1.78 | 1.83 | 91.7 | 42 % |
| HCl | 0.96 | 1.11 | 127.5 | 18 % |
| HBr | 0.76 | 0.83 | 141.4 | 12 % |
| HI | 0.46 | 0.45 | 160.9 | 6 % |
| NaCl (gas) | 2.23 | 9.00 | 236.1 | 79 % |

Linus Pauling proposed a smooth estimate, ionic character $\\approx 1 - e^{-(\\Delta\\chi)^2/4}$, which follows the same trend (21 % for HCl, 71 % for NaCl).

> [!note] Two arrow conventions are in use. Chemists draw a crossed arrow from the δ+ end towards the δ− end. Physicists define the dipole moment vector pointing from the negative charge to the positive. Same physics, opposite arrows — check which one a diagram uses.

### Why it matters
- Polar bonds mark reactive sites: the δ+ carbon of a C=O or C–Cl group is where electron-rich reagents attack ([[carbonyl-chemistry]]).
- Polar O–H and N–H bonds make [[hydrogen-bonding|hydrogen bonds]] possible.
- Polar bonds are needed — but not enough — for a polar molecule ([[molecular-polarity]]).
- A vibration absorbs infrared light only if it changes the dipole moment. $\\ce{N2}$ and $\\ce{O2}$ cannot; $\\ce{CO2}$, $\\ce{H2O}$ and $\\ce{CH4}$ can, which is why they are greenhouse gases ([[ir-spectroscopy]]).
`,
  ideas: [
    'In a bond between different atoms the more electronegative atom takes a larger share of the electrons and carries δ−.',
    'The electronegativity difference places a bond on a continuum from nonpolar covalent through polar covalent to ionic.',
    'The dipole moment μ = qd measures bond polarity; 1 debye = 3.336 × 10⁻³⁰ C·m.',
    'Dividing a measured dipole by e × d gives the partial charge — the fraction of ionic character.'
  ],
  pitfalls: [
    'Partial charges are real ions — δ is a fraction of an electron charge (0.18 e in HCl); the electrons are still shared.',
    'The electronegativity cut-offs are real boundaries — They are conventions on a continuous scale. HF (difference 1.78) is covalent.',
    'The dipole arrow points the same way in every book — Chemists draw it from δ+ to δ−; physicists define the dipole moment from − to +.'
  ],
  formulas: [
    {
      name: 'Dipole moment of a polar bond',
      expr: 'mu = delta*qe*d', tex: '\\mu = \\delta\\, e\\, d',
      vars: {
        mu: { name: 'dipole moment', q: 'dipole', unit: 'D', tex: '\\mu' },
        delta: { name: 'partial charge, as a fraction of e', q: 'ratio', unit: '', value: 0.18, min: 0, max: 1, tex: '\\delta' },
        qe: { const: 'qe' },
        d: { name: 'bond length', q: 'length', unit: 'pm', value: 127.5 }
      },
      solveFor: 'mu',
      note: 'Solve for $\\delta$ to turn a measured dipole into a partial charge (the fraction of ionic character). Defaults: HCl.',
      practice: { unknowns: ['mu', 'delta'] },
      stories: {
        mu: 'A bond {d} long carries partial charges of ± {delta} of the elementary charge. What is its dipole moment?',
        delta: 'A diatomic molecule with bond length {d} has a dipole moment of {mu}. What partial charge (as a fraction of e) does that imply?'
      }
    },
    {
      name: 'Pauling\'s estimate of ionic character',
      expr: 'I = 1 - exp(-dX^2/4)', tex: 'I = 1 - e^{-(\\Delta\\chi)^2/4}',
      vars: {
        I: { name: 'fraction of ionic character', q: 'ratio', unit: '%' },
        dX: { name: 'electronegativity difference', value: 0.96, min: 0, max: 3.5, tex: '\\Delta\\chi' }
      },
      solveFor: 'I',
      note: 'An empirical curve, not a law: good for trends. Defaults: H–Cl.',
      practice: { unknowns: ['I', 'dX'] },
      stories: {
        I: 'Two atoms differ in electronegativity by {dX}. Roughly what fraction of ionic character does their bond have?',
        dX: 'A bond is estimated to be {I} ionic. What electronegativity difference does Pauling\'s formula imply?'
      }
    }
  ],
  examples: [
    {
      title: 'How ionic is hydrogen chloride?',
      q: 'HCl has a dipole moment of 1.11 D and a bond length of 127.5 pm. Find the partial charges and compare with Pauling\'s estimate ($\\Delta\\chi$ = 0.96).',
      steps: [
        '$\\mu = 1.11 \\times 3.336\\times10^{-30} = 3.70\\times10^{-30}$ C·m.',
        '$e d = 1.602\\times10^{-19} \\times 1.275\\times10^{-10} = 2.04\\times10^{-29}$ C·m (6.12 D).',
        '$\\delta = 3.70\\times10^{-30} / 2.04\\times10^{-29} = 0.18$: charges of about $\\pm 0.18e$.',
        'Pauling: $1 - e^{-0.96^2/4} = 1 - e^{-0.230} = 0.21$ — the same ballpark.'
      ],
      a: 'About 18 % ionic (±0.18 e); Pauling\'s curve gives 21 %.'
    }
  ],
  quiz: [
    { q: 'Rank these bonds from least to most polar: C–H, N–H, O–H, F–H.', choices: ['C–H < N–H < O–H < F–H', 'F–H < O–H < N–H < C–H', 'N–H < C–H < O–H < F–H', 'all equally polar: each involves hydrogen'], a: 0,
      why: 'Electronegativity rises from C (2.55) to F (3.98), so the difference from hydrogen (2.20) grows: 0.35, 0.84, 1.24, 1.78.' },
    { q: 'In the H–Cl bond, where is the partial negative charge?', choices: ['on hydrogen', 'on chlorine', 'shared equally', 'there is none'], a: 1,
      why: 'Chlorine (3.16) is more electronegative than hydrogen (2.20) and pulls the shared pair towards itself.' },
    { q: 'Hydrogen fluoride has a dipole moment of 1.83 D and a bond length of 91.7 pm. What partial charge δ (as a fraction of e) does that imply?', answer: 0.415,
      why: '$\\delta = \\mu/(ed) = (1.83 \\times 3.336\\times10^{-30})/(1.602\\times10^{-19} \\times 9.17\\times10^{-11}) = 0.42$.' },
    { q: 'The C–H bond is strongly polar, which is why oil and water do not mix.', a: false,
      why: 'C–H is almost nonpolar (difference 0.35). Hydrocarbons are nonpolar, so they cannot join water\'s network of hydrogen bonds and are pushed out of it.' },
    { q: 'Why do CO₂ and H₂O absorb infrared radiation while N₂ and O₂ do not?', choices: ['CO₂ and H₂O are heavier', 'Only vibrations that change a dipole moment absorb infrared, and N₂ and O₂ have no dipole to change', 'N₂ and O₂ have no vibrations', 'N₂ and O₂ absorb in the visible instead'], a: 1,
      why: 'A symmetric diatomic molecule keeps zero dipole however much it stretches. Bending or asymmetrically stretching CO₂, or any vibration of H₂O, changes the dipole.' }
  ],
  applications: [
    'Predicting reactive sites in organic molecules (δ+ carbon atoms).',
    'Microwave heating and dielectric materials, which respond to molecular dipoles.',
    'The greenhouse effect: only molecules whose vibrations change a dipole absorb infrared.',
    'Choosing solvents and understanding solubility.'
  ],
  sim: { id: 'bond-polarity', params: { mol: 'pair' } }
},

{
  id: 'bond-order-length', parent: 'covalent', title: 'Bond order, length and strength', level: 2,
  short: 'The number of electron pairs shared between two atoms. Higher bond order means a shorter, stronger and stiffer bond — though a double bond is not simply twice a single one.',
  keywords: ['bond order', 'bond length', 'bond strength', 'bond enthalpy', 'covalent radius', 'bond stiffness', 'force constant', 'vibrational wavenumber', 'infrared', 'single double triple bond', 'reduced mass'],
  prereq: ['covalent-bonds', 'lewis-structures'],
  related: ['bond-enthalpies', 'resonance', 'molecular-orbitals', 'sigma-pi-bonds', 'ir-spectroscopy', 'atomic-radius', 'physics:hookes-law', 'physics:simple-harmonic-motion'],
  body: `
### Bond order
The **bond order** is the number of electron pairs shared between two atoms: 1 for a single bond, 2 for a double, 3 for a triple. It can be fractional when electrons are delocalised — 1.5 for the C–C bonds of benzene and the O–O bonds of ozone, 4/3 for the N–O bonds of nitrate ([[resonance]]) — or when [[molecular-orbitals]] put electrons in antibonding levels (2.5 for $\\ce{O2+}$).

### Higher order: shorter and stronger
| Bond | order | length (pm) | bond enthalpy (kJ/mol) |
|---|---|---|---|
| C–C | 1 | 154 | 347 |
| C=C | 2 | 134 | 614 |
| C≡C | 3 | 120 | 839 |
| C–O | 1 | 143 | 358 |
| C=O | 2 | 120 | 799 |
| C≡O | 3 | 113 | 1072 |
| N–N | 1 | 145 | 163 |
| N=N | 2 | 125 | 418 |
| N≡N | 3 | 110 | 945 |

More shared electrons pull the nuclei closer and hold them harder. But doubling the bond order does not double the strength. For carbon, the second (π) bond adds less than the first: $614 < 2\\times347$ ([[sigma-pi-bonds]]). For nitrogen it is the other way round: the N–N single bond is unusually **weak**, because the lone pairs on neighbouring nitrogen atoms repel each other (the same happens in O–O and F–F). N≡N is nearly six times as strong as N–N. That is why compounds full of N–N and N–O bonds — TNT, nitroglycerine, the sodium azide of airbags — release so much energy when their nitrogen ends up as $\\ce{N2}$ ([[bond-enthalpies]]).

### Estimating a bond length
Single-bond lengths are close to the sum of the atoms' **covalent radii**, listed in [the periodic table](#/tools/periodic): C–H $76 + 31 = 107$ pm (measured 109), C–Cl $76 + 102 = 178$ pm (177), O–H $66 + 31 = 97$ pm (96). Multiple bonds are shorter than the sum, and so are some very polar bonds: Si–O comes out at 177 pm but is measured at 161 pm.

### Bond stiffness
For small stretches a bond acts as a spring obeying [[physics:hookes-law|Hooke's law]]. Its stiffness $k$ follows from the frequency at which it vibrates, which [[ir-spectroscopy|infrared spectroscopy]] measures as a wavenumber $\\tilde\\nu$:

$$k = \\mu\\,(2\\pi c \\tilde\\nu)^2, \\qquad \\mu = \\frac{m_1 m_2}{m_1 + m_2}$$

Carbon monoxide absorbs at 2143 cm⁻¹, so its triple bond has $k \\approx 1860$ N/m; the C–O single bond of methanol (about 1050 cm⁻¹) has only about 450 N/m. Along $\\ce{N2}$, $\\ce{O2}$, $\\ce{F2}$ (triple, double, single) the stiffness falls from 2240 to 1140 to 445 N/m.

### Caveats
- Tabulated bond enthalpies are **averages** over many molecules; a particular C–H bond may differ by 10 % or more.
- Lengths shift by a few pm with the neighbours.
- "Shorter is stronger" holds for the same pair of atoms. Across different pairs it can fail: F–F (142 pm, 158 kJ/mol) is shorter than Cl–Cl (199 pm, 243 kJ/mol) and weaker.
`,
  ideas: [
    'Bond order is the number of shared pairs; it can be fractional with resonance or in MO theory.',
    'For a given pair of atoms, a higher bond order means a shorter, stronger and stiffer bond.',
    'Strength does not scale in proportion: for C the π bond adds less than the σ; for N, O and F, single bonds are weakened by lone-pair repulsion.',
    'Single-bond lengths are roughly the sum of covalent radii.',
    'Infrared wavenumbers give bond stiffness through k = μ(2πcν̃)².'
  ],
  pitfalls: [
    'A double bond is twice as strong as a single bond — C=C is 614 kJ/mol, not 694; N≡N is almost six times N–N. The ratio depends on the atoms.',
    'A bond length is a fixed number — Atoms vibrate about an average separation that shifts by a few pm with the surroundings.',
    'A shorter bond is always stronger — Only when comparing the same two elements. F–F is shorter but weaker than Cl–Cl.'
  ],
  formulas: [
    {
      name: 'Bond length from covalent radii',
      expr: 'd = rA + rB', tex: 'd = r_A + r_B',
      vars: {
        d: { name: 'estimated single-bond length', q: 'length', unit: 'pm' },
        rA: { name: 'covalent radius of atom A', q: 'length', unit: 'pm', value: 76, tex: 'r_A' },
        rB: { name: 'covalent radius of atom B', q: 'length', unit: 'pm', value: 102, tex: 'r_B' }
      },
      solveFor: 'd',
      note: 'Single bonds only. Defaults: C (76 pm) and Cl (102 pm); the C–Cl bond in CCl₄ measures 177 pm.',
      practice: { unknowns: ['d', 'rB'] },
      stories: {
        d: 'Estimate the length of a single bond between atoms with covalent radii {rA} and {rB}.',
        rB: 'A single bond A–B is {d} long and the covalent radius of A is {rA}. Estimate the covalent radius of B.'
      }
    },
    {
      name: 'Bond stiffness from the vibration wavenumber',
      expr: 'k = m1*m2/(m1 + m2)*(2*pi*c*nu)^2', tex: 'k = \\frac{m_1 m_2}{m_1 + m_2}\\,(2\\pi c\\,\\tilde\\nu)^2',
      vars: {
        k: { name: 'bond stiffness (force constant)', q: 'stiffness', unit: 'N/m' },
        m1: { name: 'mass of atom 1', q: 'mass', unit: 'u', value: 12.011, tex: 'm_1' },
        m2: { name: 'mass of atom 2', q: 'mass', unit: 'u', value: 15.999, tex: 'm_2' },
        c: { const: 'c' },
        nu: { name: 'vibration wavenumber', q: 'wavenumber', unit: '1/cm', value: 2143, tex: '\\tilde\\nu' }
      },
      solveFor: 'k',
      note: 'The harmonic-spring model of a diatomic bond. Defaults: carbon monoxide.',
      practice: { unknowns: ['k', 'nu'] },
      stories: {
        k: 'A diatomic molecule made of atoms of mass {m1} and {m2} absorbs infrared at {nu}. How stiff is its bond?',
        nu: 'A bond between atoms of mass {m1} and {m2} has a stiffness of {k}. At what wavenumber will it absorb infrared?'
      }
    }
  ],
  examples: [
    {
      title: 'Triple against single: stiffness',
      q: 'Carbon monoxide absorbs at 2143 cm⁻¹ and the C–O stretch of methanol is near 1050 cm⁻¹. Compare the stiffness of the two bonds.',
      steps: [
        'Reduced mass: $\\mu = 12.011 \\times 15.999/28.010 = 6.861$ u $= 1.139\\times10^{-26}$ kg.',
        'CO: $2\\pi c \\tilde\\nu = 2\\pi \\times 2.998\\times10^{10}\\ \\mathrm{cm/s} \\times 2143\\ \\mathrm{cm^{-1}} = 4.04\\times10^{14}\\ \\mathrm{s^{-1}}$, so $k = 1.139\\times10^{-26} \\times (4.04\\times10^{14})^2 = 1860$ N/m.',
        'C–O: the same reduced mass (treating the stretch as a two-atom spring) and half the wavenumber, so $k = 1860 \\times (1050/2143)^2 \\approx 450$ N/m.',
        'The triple bond is about four times as stiff; the stiffness goes as the square of the wavenumber.'
      ],
      a: 'About 1860 N/m for C≡O against 450 N/m for C–O.'
    },
    {
      title: 'Why nitrogen compounds explode',
      q: 'Using N–N 163 kJ/mol and N≡N 945 kJ/mol, compare the energy of three single N–N bonds with one triple bond.',
      steps: [
        'Three single bonds: $3 \\times 163 = 489$ kJ/mol.',
        'One triple bond: 945 kJ/mol — almost twice as much.',
        'So rearranging nitrogen atoms from single bonds into $\\ce{N2}$ releases a lot of energy, and $\\ce{N2}$ is a gas, which expands violently.',
        'This is the chemistry of azides, nitro explosives and airbags.'
      ],
      a: 'N≡N holds nearly twice the energy of three N–N bonds, so forming N₂ from singly bonded nitrogen releases a great deal of energy.'
    }
  ],
  quiz: [
    { q: 'Rank the carbon–oxygen bonds from shortest to longest: CO, CO₂, CO₃²⁻, CH₃OH.', choices: ['CO < CO₂ < CO₃²⁻ < CH₃OH', 'CH₃OH < CO₃²⁻ < CO₂ < CO', 'CO₂ < CO < CO₃²⁻ < CH₃OH', 'all the same'], a: 0,
      why: 'Bond orders 3, 2, 4/3 and 1: lengths 113, 116, 129 and 143 pm.' },
    { q: 'A C=C double bond is exactly twice as strong as a C–C single bond.', a: false,
      why: '614 kJ/mol against 2 × 347 = 694. The side-on π overlap of the second bond is weaker than the head-on σ overlap.' },
    { q: 'HCl absorbs infrared at 2886 cm⁻¹. With masses 1.008 u and 35.45 u, what is the stiffness of its bond, in N/m?', answer: 481, unit: 'N/m',
      why: '$\\mu = 0.980$ u $= 1.628\\times10^{-27}$ kg; $2\\pi c\\tilde\\nu = 5.44\\times10^{14}\\ \\mathrm{s^{-1}}$; $k = \\mu(2\\pi c\\tilde\\nu)^2 \\approx 481$ N/m.' },
    { q: 'Why is the N≡N bond almost six times as strong as the N–N single bond?', choices: ['triple bonds always contain six electrons', 'the lone pairs on singly bonded nitrogens repel and weaken N–N, while N≡N is short with strong π overlap', 'nitrogen atoms are very light', 'N–N bonds are ionic'], a: 1,
      why: 'In hydrazine-like N–N bonds the neighbouring lone pairs crowd each other. In N₂ the atoms are close, the π overlap is excellent, and the lone pairs point away from each other.' },
    { q: 'F–F (142 pm) is shorter than Cl–Cl (199 pm). Which bond is stronger?', choices: ['F–F, because it is shorter', 'Cl–Cl', 'they are equal', 'it cannot be decided'], a: 1,
      why: 'Cl–Cl is 243 kJ/mol, F–F only 158. In the tiny F₂ molecule the lone pairs repel strongly. "Shorter is stronger" works only for the same pair of atoms.' }
  ],
  applications: [
    'Reading infrared spectra: bond stiffness and atomic masses place each absorption band.',
    'Estimating reaction energies from average bond enthalpies.',
    'Designing energetic materials and airbag propellants.',
    'Checking crystal structures and computed molecular geometries against typical bond lengths.'
  ],
  sim: { id: 'bond-pe-curve', params: { pair: 'N2' } }
}

);
