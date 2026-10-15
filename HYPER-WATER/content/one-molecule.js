/* HYPER-WATER · content/one-molecule.js — the topic "One molecule" (branch The Molecule):
 *   what-water-is · the-bent-shape · polarity-and-the-dipole · three-siblings · the-hydride-ladder ·
 *   vibrations-and-the-colour-of-water · isotopes-and-heavy-water · water-in-numbers
 * Simulations: sims/one-molecule.js (om-molecules, om-dipole-field, om-hydride-ladder, om-vibration-modes,
 * om-colour-of-water, om-heavy-water, om-numbers).
 */
Hyper.add(

/* ================================================================ what water is */
{
  id: 'what-water-is', parent: 'one-molecule', title: 'What water is', level: 1,
  short: 'A water molecule is one oxygen atom and two hydrogen atoms: 18 units of mass, ten electrons, a quarter of a nanometre across. A glass of water is some 8 × 10²⁴ of them, packed almost in contact in the liquid and more than ten times their own width apart in steam.',
  keywords: ['H2O', 'water molecule', 'formula', 'oxidane', 'molar mass', 'mole', 'Avogadro', 'ångström', 'bond length', 'size of a molecule', 'composition', 'what is water'],
  prereq: ['chemistry:bond-polarity'],
  related: ['the-bent-shape', 'water-in-numbers', 'three-siblings', 'what-a-hydrogen-bond-is', 'chemistry:molarity'],
  body: `
A glass of water looks like one smooth, continuous thing. It is not: it is about $8 \\times 10^{24}$ separate molecules, each an oxygen atom with two hydrogen atoms attached, each about a quarter of a nanometre across, all jostling past one another a thousand billion times a second. Everything else in this app is a consequence of the shape and the electrical lopsidedness of that one small unit.

### The formula and what it hides
$\\ce{H2O}$ says two hydrogens and one oxygen. Oxygen has eight protons and each hydrogen one, so a molecule has ten protons and, being neutral, ten electrons. Two of oxygen's electrons sit close to its nucleus and take no part in bonding. Of the six outer ones, two are shared with the hydrogens — one shared pair for each **O–H bond** — and the other four stay on the oxygen as two **lone pairs**. Those two lone pairs matter as much as the two bonds: they are what a neighbouring molecule's hydrogen reaches for ([[what-a-hydrogen-bond-is]]).

The molar mass is 18.015 g/mol, so a mole of water — $6.022 \\times 10^{23}$ molecules — is 18 g, just over a tablespoon. By mass the molecule is 88.8 % oxygen and 11.2 % hydrogen: the hydrogens count for a great deal of the chemistry and almost none of the weight.

### How big is it?
| Quantity | Value |
|---|---|
| O–H bond length | 95.84 pm (0.9584 Å) |
| H–O–H angle | 104.45° ([[the-bent-shape]]) |
| distance between the two hydrogens | 151 pm |
| size of the molecule as a whole | about 2.75 Å |
| mass of one molecule | 2.99 × 10⁻²⁶ kg (18.015 u) |
| electric dipole moment | 1.855 D ([[polarity-and-the-dipole]]) |
| oxygen–oxygen distance, nearest neighbours in the liquid | about 2.8 Å |

The last two lengths nearly coincide, and that is the first surprise: **in liquid water the molecules are almost touching**. At 25 °C each molecule has 30 Å³ of the liquid to itself, a cube 3.1 Å on a side. A sphere 2.75 Å across occupies only about a third of that. The rest is gaps — not a lot of room, but more than a close-packed liquid would leave, because molecules that make four directional bonds cannot pack closely. The gaps are what ice makes visible ([[why-ice-floats]]).

### One molecule, three states
The molecule in ice, in liquid and in steam is the same molecule; what differs is how they are arranged and how fast they move. In ice each holds four neighbours at fixed places. In liquid they swap neighbours every picosecond or so. In steam at 100 °C and one atmosphere they are about 3.7 nm apart — twelve times the liquid's spacing, 1,600 times its volume — and fly freely at 600 m/s between collisions.

### Where it is
Water covers 71 % of the Earth's surface, makes about 60 % of an adult's mass and, because its molecules are so light, is more than 95 out of every 100 molecules in a living cell. The IUPAC name, *oxidane*, is used by almost nobody; the old name is better.

> [!key] A water molecule is one oxygen and two hydrogens, 18 u, ten electrons, two bonds and two lone pairs, about 2.75 Å across. In the liquid the molecules are almost in contact, so what sets water apart is not what it is made of but how that small molecule is shaped.`,
  ideas: ['H₂O: two O–H bonds and two lone pairs on the oxygen, ten electrons in all, molar mass 18.015 g/mol.', 'The O–H bond is 95.84 pm and the two hydrogens are 151 pm apart; the whole molecule is about 2.75 Å across.', 'In the liquid the molecules sit about 3.1 Å apart centre to centre — almost touching; in steam at 100 °C they are about 3.7 nm apart.', 'The molecule is the same in ice, liquid and steam; the difference is arrangement and motion.'],
  pitfalls: ['"Water is made of hydrogen and oxygen, so it ought to burn" — Water is what hydrogen and oxygen make when they burn: it is the ash, with no energy left to release.', '"Liquid water is mostly empty space between molecules" — The molecules are separated by about their own width, not many times it. Steam is mostly empty space; liquid water is a crowd.', '"A water molecule is a small round ball" — It is bent, and electrically lopsided; its shape is the whole story.'],
  terms: [
    { term: 'Water molecule', also: ['H₂O', 'oxidane', 'dihydrogen monoxide'], def: 'One oxygen atom bonded to two hydrogen atoms at an angle of 104.45°, O–H length 95.84 pm. It has ten electrons and two lone pairs on the oxygen, and a mass of 18.015 u.' },
    { term: 'Mole', also: ['mol', 'Avogadro constant', 'N_A'], def: 'The amount of substance containing 6.02214076 × 10²³ particles (the Avogadro constant). A mole of water molecules weighs 18.015 g.' },
    { term: 'Molar mass', also: ['molecular weight', 'M'], def: 'The mass of one mole of a substance, in g/mol. For water 18.015 g/mol: 15.999 from the oxygen and 2 × 1.008 from the hydrogens.' },
    { term: 'Ångström', also: ['Å', 'angstrom'], def: 'A length of 10⁻¹⁰ m (0.1 nm, 100 pm), convenient for atoms and bonds: the O–H bond is 0.958 Å and a water molecule about 2.75 Å across.' },
    { term: 'Lone pair', also: ['non-bonding pair'], def: 'A pair of outer electrons on an atom that is not shared in a bond. Oxygen in water has two; they are what hydrogen atoms of neighbouring molecules are attracted to.' }
  ],
  formulas: [
    { name: 'Molecules in a sample', expr: 'N = m*NA/M', tex: 'N = \\frac{m\\,N_A}{M}',
      vars: { N: { name: 'number of molecules', q: 'count', hint: 'A glass of water holds about 8 × 10²⁴; a drop about 10²¹.' }, m: { name: 'mass of water', q: 'mass', unit: 'g', value: 250 }, NA: { const: 'NA' }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015, hint: '18.015 g/mol for ordinary water, 20.03 for heavy water.' } },
      solveFor: 'N', note: 'Divide the mass by the molar mass to get moles, multiply by Avogadro to get molecules.',
      stories: { N: 'A glass holds {m} of water. How many molecules is that?', m: 'A sample holds {N} water molecules. What is its mass?' } },
    { name: 'Spacing of molecules in the liquid', expr: 'd = cbrt(M/(rho*NA))', tex: 'd = \\sqrt[3]{\\frac{M}{\\rho\\,N_A}}',
      vars: { d: { name: 'centre-to-centre spacing', q: 'length', unit: 'Å', hint: 'The edge of the cube each molecule has to itself; 3.1 Å at 25 °C, to be compared with a molecule 2.75 Å across.' }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 997.0, tex: '\\rho' }, NA: { const: 'NA' } },
      solveFor: 'd', note: 'An average: molecules are not on a grid, but the cube root of the volume per molecule is the natural unit of distance in the liquid.',
      stories: { d: 'Water of density {rho} has molar mass {M}. How far apart are neighbouring molecules, on average?', rho: 'Molecules in a liquid are {d} apart on average. What is its density?' } },
    { name: 'Distance between the two hydrogens', expr: 'dHH = 2*L*sin(theta/2)', tex: 'd_{HH} = 2L\\sin\\frac{\\theta}{2}',
      vars: { dHH: { name: 'H···H distance', q: 'length', unit: 'pm', tex: 'd_{HH}' }, L: { name: 'O–H bond length', q: 'length', unit: 'pm', value: 95.84 }, theta: { name: 'H–O–H angle', q: 'angle', unit: '°', value: 104.45, min: 0, max: 180, tex: '\\theta' } },
      solveFor: 'dHH', note: 'The law of cosines for the isosceles triangle H–O–H.',
      stories: { dHH: 'Each O–H bond is {L} long and they meet at {theta}. How far apart are the hydrogens?', theta: 'Two O–H bonds of {L} leave the hydrogens {dHH} apart. What is the angle between them?' } }
  ],
  examples: [
    { title: 'Molecules in a glass', q: 'How many water molecules are in a 250 mL glass of water at 25 °C?',
      steps: ['Mass: density 997 kg/m³, so 250 mL = 0.250 L has $0.250 \\times 0.997 = 0.249$ kg = 249 g.', 'Moles: $249 / 18.015 = 13.8$ mol.', { text: 'Molecules:', tex: 'N = 13.8 \\times 6.022 \\times 10^{23} = 8.3 \\times 10^{24}' }],
      a: 'About $8 \\times 10^{24}$ molecules — eight septillion.' },
    { title: 'Liquid against steam', q: 'Compare the spacing of the molecules in liquid water and in steam at 100 °C and 1 atm, and the volumes they occupy.',
      steps: ['Liquid at 100 °C: density 958.4 kg/m³, so the volume per molecule is $0.018015/(958.4 \\times 6.022\\times10^{23}) = 3.12 \\times 10^{-29}$ m³; the cube root is 3.15 Å.', { text: 'Steam: number density from the ideal-gas law:', tex: 'n = \\frac{p}{k_B T} = \\frac{101\\,325}{1.381\\times10^{-23} \\times 373.15} = 1.97 \\times 10^{25}\\ \\mathrm{m^{-3}}' }, 'Its cube root, inverted, gives a spacing of 3.7 nm = 37 Å, and the volume per molecule is $5.1 \\times 10^{-26}$ m³.'],
      a: '37 Å against 3.15 Å: twelve times the distance, and $5.1\\times10^{-26}/3.12\\times10^{-29} \\approx 1{,}600$ times the volume.' }
  ],
  quiz: [
    { q: 'What fraction of the mass of a water molecule is hydrogen?', choices: ['about 67 % (two atoms of three)', 'about 33 %', 'about 11 %', 'about 2 %'], a: 2, why: 'Two hydrogens weigh 2.016 u and the oxygen 15.999 u, so hydrogen is 2.016/18.015 = 11.2 % of the mass — though it is two atoms in three by number.' },
    { q: 'How many electrons does a neutral water molecule have?', answer: 10, why: 'Eight from oxygen and one from each hydrogen. Water is "isoelectronic" with neon, hydrogen fluoride, ammonia and methane — all of which have ten.' },
    { q: 'In liquid water at room temperature the molecules are, on average, about ten times their own width apart.', a: false, why: 'They are about one width apart (3.1 Å between centres, for molecules about 2.75 Å across). Ten widths is steam at atmospheric pressure.' },
    { q: 'When one cubic centimetre of liquid water at 100 °C boils to steam at 1 atm, its volume becomes about', choices: ['3 cm³', '30 cm³', '1,600 cm³', '1,600,000 cm³'], a: 2, why: 'The spacing grows twelvefold and the volume by the cube of that, about 1,600. This is the force that drives a steam engine and why a boiling kettle is not a sealed vessel.' },
    { q: 'The water molecule in ice, in liquid water and in steam is', choices: ['a different molecule in each', 'the same molecule, differently arranged and moving differently', 'only in ice a true H₂O; liquid and steam are mixtures', 'larger in ice because the bonds are longer'], a: 1, why: 'The molecule is the same H₂O; its bond lengths and angle change by a few per cent between phases. What distinguishes the phases is the network the molecules form.' }
  ],
  applications: ['Every unit conversion in chemistry that starts "a mole of water is 18 g": solutions, reaction yields, the amount of hydrogen in a litre of water (111 g).', 'Gas-phase measurements of the molecule — radio astronomers identify water in distant clouds from its rotational lines because its size and shape are known so exactly ([[the-largest-reservoir]]).', 'Sizing membranes and filters: a water molecule, about 2.75 Å, passes through pores that salt ions with their shells of water (6–8 Å) cannot, which is how desalination works ([[desalination]]).', 'Cooking, humidity, steam engines: the 1,600-fold expansion on boiling.'],
  history: 'The formula H₂O was settled in the mid-nineteenth century, after a long argument about atomic masses (see [[two-to-one]]). The geometry of the molecule was first measured from its rotation spectrum in the 1930s and refined, with microwave and infrared spectroscopy, to the 95.84 pm and 104.45° used here.',
  sources: ['CRC *Handbook of Chemistry and Physics*: molecular structure of water, O–H length and H–O–H angle from the rotation–vibration spectrum.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 1 (the molecule).', 'Ball, *H₂O: A Biography of Water* — the molecule and its states, told for the general reader.', 'Finney, *Water: A Very Short Introduction* (2015).'],
  sim: { id: 'om-molecules', params: { mol: 'H2O', style: 'space', dipole: false, angle: false } }
},

/* ================================================================ the bent shape */
{
  id: 'the-bent-shape', parent: 'one-molecule', title: 'The bent shape', level: 1,
  short: 'Oxygen shares two pairs of electrons and keeps two lone pairs; the four pairs spread to the corners of a tetrahedron, and the two lone pairs squeeze the bonded pair down from 109.5° to 104.45°. The molecule is bent — and nearly everything else about water follows from that.',
  keywords: ['bent', 'bond angle', '104.5', '104.45', 'VSEPR', 'tetrahedral', 'lone pair repulsion', 'hybrid orbitals', 'sp3', 'geometry of water', 'why is water bent', 'linear'],
  prereq: ['what-water-is', 'chemistry:vsepr'],
  related: ['polarity-and-the-dipole', 'three-siblings', 'the-hydride-ladder', 'two-donors-two-acceptors', 'the-tetrahedral-network', 'chemistry:molecular-polarity'],
  body: `
If water were a straight line, like carbon dioxide, there would be no ice that floats, no ocean, and probably no us. The molecule is bent, with its two hydrogens 104.45° apart, and the reason is a small piece of electron arithmetic.

### Four pairs, four corners
Oxygen brings six outer electrons. Two are shared with the hydrogens, giving **two bonding pairs**; the other four form **two lone pairs**. That makes four electron pairs on the oxygen, and electron pairs repel one another, so they spread as far apart as they can: to the corners of a tetrahedron, 109.5° apart. This is the idea behind the *valence-shell electron-pair repulsion* rule (VSEPR, see [[chemistry:vsepr]]).

But the shape of a molecule is the shape of its atoms, not of its electron pairs. Two corners of the tetrahedron hold hydrogens, two hold lone pairs you cannot see; the atoms make a V. The molecule is bent whatever the details — a **linear** water would need the four pairs arranged in a way that no repulsion would choose.

### Why 104.45° and not 109.5°
A lone pair is held by one nucleus, not two, so it spreads out and takes up more room than a bonding pair. It pushes harder, and the bonded pair is squeezed together. The effect is steady down the row of ten-electron molecules:

| Molecule | Lone pairs | H–X–H angle |
|---|---|---|
| methane, $\\ce{CH4}$ | 0 | 109.47° |
| ammonia, $\\ce{NH3}$ | 1 | 106.7° |
| water, $\\ce{H2O}$ | 2 | 104.45° |

Each lone pair takes about 2.5° off the angle. The molecule is soft in this direction: the bending vibration is the lowest-energy vibration it has (1595 cm⁻¹, [[vibrations-and-the-colour-of-water]]), yet straightening it out completely would cost something like 130 kJ/mol, more than a quarter of the energy of an O–H bond.

### The heavier relatives bend more
Replace oxygen by sulfur, selenium or tellurium and the angle collapses towards 90°: 92.1° in $\\ce{H2S}$, 91° in $\\ce{H2Se}$, about 90° in $\\ce{H2Te}$. A simple model explains it. In a pair of equivalent bond orbitals made of *s* and *p* character, the angle satisfies $\\cos\\theta = -1/n$, where $n$ is the ratio of *p* to *s* character in each bond (Coulson's rule). An angle of 109.47° needs $n = 3$ (the "sp³" of the textbooks); 90° needs pure *p*, $n \\to \\infty$. Water, at 104.45°, comes out at $n = 4.0$: oxygen puts four parts *p* to one part *s* in each bond and keeps the *s*-rich orbitals for the lone pairs. Sulfur, a bigger atom with longer bonds and hydrogens far apart, has little to gain from mixing in *s* and uses nearly pure *p* orbitals. It is an idealised picture, but it shows why the sulfur family is so different.

### What the bend buys
- **A dipole.** The two O–H bond dipoles do not cancel, so the molecule has a positive end and a negative end ([[polarity-and-the-dipole]]).
- **Four directions to bond in.** The two hydrogens and the two lone pairs point to the corners of a tetrahedron, so a water molecule can hold four neighbours — in ice, almost exactly at the tetrahedral angle ([[two-donors-two-acceptors]]).
- **Room.** A bent molecule packs less tightly than a ball; the ice that results floats.

In ice the H–O–H angle is opened by the neighbours' hydrogen bonds to roughly the full 109°, a few degrees wider than the gas molecule; in the liquid it is in between.

> [!key] Water is bent because oxygen has four electron pairs, two of them lone pairs that push the bonds down from 109.5° to 104.45°. That bend gives the molecule a dipole and four bonding directions at tetrahedral angles — the geometry of the hydrogen-bonded network.`,
  ideas: ['Oxygen has four electron pairs — two bonding, two lone — arranged at the corners of a tetrahedron; the atoms show only the V.', 'Lone pairs repel more than bonding pairs: methane 109.47°, ammonia 106.7°, water 104.45°.', 'Hydrogen sulfide, selenide and telluride are bent too, but near 90°: heavier atoms use almost pure p orbitals.', 'The bend makes water polar and gives it four bonding directions at close to the tetrahedral angle.'],
  pitfalls: ['"Water is bent because the two hydrogens repel each other" — The hydrogens are positively charged and do repel, but they would be pushed to 180° if that were all. The bend is set by the two lone pairs on the oxygen.', '"The lone pairs are the same as the bonds, only without hydrogens" — A lone pair is held by one nucleus and spreads out more; this is why it squeezes the bond angle.', '"The angle is 104.5° everywhere" — It is the gas-phase molecule. In ice and liquid, neighbouring hydrogen bonds open it by a few degrees.'],
  terms: [
    { term: 'Bond angle', also: ['H–O–H angle', 'valence angle'], def: 'The angle between two bonds that meet at an atom. In the water molecule 104.45°; in the ice lattice, where each oxygen has four neighbours at tetrahedral positions, about 109°.' },
    { term: 'VSEPR theory', also: ['valence-shell electron-pair repulsion', 'electron-pair geometry'], def: 'The rule that electron pairs around an atom spread as far apart as possible; the molecule\'s shape follows from the number of bonding and lone pairs. Four pairs give a tetrahedron, and with two of them lone, a bent molecule.' },
    { term: 'Tetrahedral angle', also: ['109.47°', 'arccos(−1/3)'], def: 'The angle between lines from the centre of a regular tetrahedron to its corners: 109.47°. The angle between four equivalent bonds, as in methane and in the hydrogen-bond directions of ice.' },
    { term: 'Hybrid orbital', also: ['sp³', 'orbital hybridisation'], def: 'A mixture of s and p atomic orbitals used to describe directional bonds. Mixing one s with three p gives four sp³ orbitals 109.47° apart; unequal mixing gives other angles.' },
    { term: 'Bending mode', also: ['ν₂', 'scissoring'], def: 'The vibration in which the H–O–H angle opens and closes; in the gas it absorbs infrared light at 1595 cm⁻¹ (6.27 µm).' }
  ],
  formulas: [
    { name: 'p-to-s ratio of a bond from its angle (Coulson)', expr: 'n = -1/cos(theta)', tex: 'n = -\\frac{1}{\\cos\\theta}',
      vars: { n: { name: 'p character ÷ s character', hint: 'n = 3 is sp³ (109.47°), n = 2 is sp² (120°), n → ∞ is pure p (90°). Water comes out at 4.0.' }, theta: { name: 'bond angle', q: 'angle', unit: '°', value: 104.45, min: 91, max: 179, tex: '\\theta' } },
      solveFor: 'n', note: 'For two equivalent hybrid bond orbitals made orthogonal to each other. A model, but a useful one; it works for methane (n = 3) and fails only when the lone pairs are not equivalent.',
      stories: { n: 'A molecule has a bond angle of {theta}. How many parts of p character are there to each part of s in its bonds?', theta: 'The bonds have {n} parts p to one part s. What is the angle between them?' } },
    { name: 'How far the hydrogens sit from the oxygen along the axis', expr: 'h = L*cos(theta/2)', tex: 'h = L\\cos\\frac{\\theta}{2}',
      vars: { h: { name: 'distance from O to the midpoint of H–H', q: 'length', unit: 'pm', hint: 'About 58.7 pm: the positive charge sits on average this far from the negative oxygen. See the next page.' }, L: { name: 'O–H bond length', q: 'length', unit: 'pm', value: 95.84 }, theta: { name: 'H–O–H angle', q: 'angle', unit: '°', value: 104.45, min: 0, max: 180, tex: '\\theta' } },
      solveFor: 'h', note: 'Along the symmetry axis of the molecule, which is also the direction of its dipole.',
      stories: { h: 'Two O–H bonds of {L} meet at {theta}. How far is the midpoint of the hydrogens from the oxygen?' } }
  ],
  examples: [
    { title: 'Sulfur against oxygen', q: 'Use the p-to-s rule to compare the bonding in water (104.45°) and hydrogen sulfide (92.1°).',
      steps: [{ text: 'Water:', tex: 'n = -\\frac{1}{\\cos 104.45^\\circ} = -\\frac{1}{-0.2504} = 3.99' }, { text: 'Hydrogen sulfide:', tex: 'n = -\\frac{1}{\\cos 92.1^\\circ} = -\\frac{1}{-0.0366} = 27' }, 'Water\'s bonds are about 80 % p and 20 % s; sulfur\'s are 96 % p. The sulfur lone pairs keep nearly all the s character, close to the nucleus where it is hard to share.'],
      a: 'n ≈ 4 for water and ≈ 27 for hydrogen sulfide: sulfur\'s bonds are almost pure p, hence the angle near 90°.' },
    { title: 'Where the positive charge sits', q: 'Find how far the midpoint of the two hydrogens lies from the oxygen, and how far apart the hydrogens are.',
      steps: [{ text: 'Along the axis:', tex: 'h = 95.84 \\cos 52.225^\\circ = 95.84 \\times 0.6123 = 58.7\\ \\mathrm{pm}' }, { text: 'Across the molecule:', tex: 'd = 2 \\times 95.84 \\sin 52.225^\\circ = 151.5\\ \\mathrm{pm}' }],
      a: '58.7 pm along the axis, and the hydrogens are 151.5 pm apart. Next page uses the 58.7 pm to estimate the charge that the dipole implies.' }
  ],
  quiz: [
    { q: 'The H–O–H angle in the gas-phase water molecule is closest to', choices: ['90°', '104.5°', '109.5°', '120°'], a: 1, why: 'The four electron pairs would sit at 109.5°, but the two lone pairs push the bonding pair down by about 5° to 104.45°.' },
    { q: 'Methane, ammonia and water have 0, 1 and 2 lone pairs. Their H–X–H angles', choices: ['are all 109.5°', 'decrease as lone pairs increase', 'increase as lone pairs increase', 'do not follow any rule'], a: 1, why: 'Each lone pair crowds the bonds more than a bonding pair would: 109.47°, 106.7°, 104.45°.' },
    { q: 'Water is bent because the two positively charged hydrogens repel each other.', a: false, why: 'If that were all, they would push apart to 180°. The two lone pairs on the oxygen take up room and hold the angle near the tetrahedral one.' },
    { q: 'Hydrogen sulfide has a bond angle of 92°. Compared with water, its bonds contain', choices: ['more s character', 'more p character', 'the same hybridisation', 'no lone pairs'], a: 1, why: 'cos 92.1° is nearly zero, so the p-to-s ratio is large: the bonds are almost pure p orbitals at 90° to one another.' },
    { q: 'What bond angle corresponds to n = 3 in the rule cos θ = −1/n? (degrees)', answer: 109.47, why: 'cos θ = −1/3 gives θ = 109.47°, the tetrahedral angle — the angle in methane.' }
  ],
  applications: ['Reading spectra: the bend frequency (1595 cm⁻¹) and the two stretch frequencies of the molecule are what an infrared satellite measures to find water vapour in the atmosphere.', 'Predicting shapes in the whole of chemistry: the same four-pair, two-lone-pair arithmetic gives the V of sulfur dichloride and the bent ozone.', 'Computing the structure of ice and the liquid: all simulation models of water start from this geometry (most fix the angle at 104.52° or 109.47°).', 'Understanding why $\\ce{H2S}$ is a gas and a poor solvent: its bent, nearly non-polar shape forms no useful network ([[the-hydride-ladder]]).'],
  history: 'VSEPR was proposed by Sidgwick and Powell in 1940 and developed by Gillespie and Nyholm in 1957, who gave the lone-pair-repulsion explanation for water and ammonia. Coulson\'s relation between angle and orbital mixing was published in his book *Valence* (1952).',
  sources: ['Gillespie and Nyholm, "Inorganic stereochemistry", *Quarterly Reviews* 11, 339 (1957) — the lone-pair repulsion argument.', 'Coulson, *Valence* (Oxford, 1952) — bond angle and hybridisation.', 'CRC *Handbook of Chemistry and Physics*, structure and bond angles of simple molecules.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 1.'],
  sim: { id: 'om-molecules', params: { mol: 'H2O', dipole: false, angle: true, lone: true } }
},

/* ================================================================ polarity and the dipole */
{
  id: 'polarity-and-the-dipole', parent: 'one-molecule', title: 'Polarity and the dipole', level: 1,
  short: 'Oxygen pulls the shared electrons towards itself, so the molecule is negative at the oxygen and positive at the hydrogens. Because the molecule is bent, those two ends do not cancel: water has a dipole moment of 1.855 D, and in the liquid, where its neighbours polarise it, nearly 3 D.',
  keywords: ['dipole', 'dipole moment', 'debye', 'polar molecule', 'electronegativity', 'partial charge', 'δ+', 'δ-', 'charged rod', 'polarisation', 'microwave oven', 'dielectric'],
  prereq: ['the-bent-shape', 'chemistry:bond-polarity'],
  related: ['what-a-hydrogen-bond-is', 'vibrations-and-the-colour-of-water', 'the-dielectric-constant', 'how-salt-dissolves', 'chemistry:molecular-polarity', 'physics:dielectrics'],
  body: `
Hold a plastic comb, rubbed on your hair, near a thin stream of tap water. The stream bends towards the comb. Charge a glass rod the opposite way: it bends towards that too. The water is neutral, but its molecules have a positive end and a negative end, and they turn to put whichever end is wanted nearest the rod. That lopsidedness is the **dipole**.

### Where it comes from
Oxygen holds electrons much more tightly than hydrogen does: on the Pauling scale its electronegativity is 3.44, hydrogen's 2.20. Each O–H bond therefore has a share of its electron pair drawn towards the oxygen, which becomes slightly negative ($\\delta^-$), and each hydrogen slightly positive ($\\delta^+$). A bond like that is a small dipole of about 1.5 D.

A dipole is a vector, and two of them add as vectors. In a molecule with the two bonds at 180° they would cancel; that is carbon dioxide, with strongly polar bonds and no net dipole. In water the bonds meet at 104.45° and their components along the axis add:

$$\\mu = 2\\,\\mu_{\\mathrm{OH}} \\cos\\frac{\\theta}{2} = 2 \\times 1.51 \\times 0.612 = 1.855\\ \\mathrm{D}$$

along the axis of symmetry, from the middle of the two hydrogens towards the oxygen. The bend is what makes the molecule polar. Methane has four polar bonds that cancel exactly; water's two do not.

### How big is a debye?
One debye (D) is $3.336 \\times 10^{-30}$ C·m, so water's dipole is $6.19 \\times 10^{-30}$ C·m. Dividing by the distance between the middle of the hydrogens and the oxygen, 58.7 pm, gives the total charge that would have to be displaced: $1.05 \\times 10^{-19}$ C, or 0.66 of an electron. Each hydrogen carries a third of an electron's charge, the oxygen the equal and opposite two-thirds. (How to split a molecule's electrons among its atoms is a matter of convention, and computer models of water use anything from 0.33 to 0.42 on each hydrogen; the dipole itself is measured and does not depend on convention.)

### In the liquid it is stronger
The 1.855 D belongs to a molecule alone, in steam. In the liquid each molecule sits in the electric field of its neighbours, of order a volt per ångström, which pulls its electrons further and enlarges its dipole to about 2.9–3.0 D, and to about 3.1 D in ice. Water is a **polarisable** polar molecule, and the polarisation is part of why the hydrogen bond is stronger in the liquid than between two molecules in a vacuum.

### What a dipole does
- **Sticks to other dipoles and to ions.** Two molecules head to tail attract with an energy of order $2\\mu^2/(4\\pi\\varepsilon_0 r^3)$; at the hydrogen-bond distance of 2.8 Å that is about 19 kJ/mol, close to the measured 20 ([[what-a-hydrogen-bond-is]]). A point-dipole formula is too crude at this distance to trust to better than a factor of two, but it shows that the hydrogen bond is mostly electrostatic.
- **Pulls salt apart.** Around a sodium ion the oxygens point inwards; around a chloride ion the hydrogens do ([[how-salt-dissolves]]).
- **Screens charge.** Dipoles that line up against a field cancel part of it, so electric forces between charges in water are 78 times weaker than in a vacuum ([[the-dielectric-constant]]).
- **Absorbs microwaves.** In an oscillating field the dipoles are forced to turn back and forth; their friction with neighbours is heat ([[vibrations-and-the-colour-of-water]]).

> [!key] Oxygen draws the shared electrons, and because the molecule is bent the two O–H dipoles add instead of cancelling: 1.855 D in steam, nearly 3 D in the liquid. That dipole is what makes water a hydrogen-bonder, a solvent for salts and a screen for electric force.`,
  ideas: ['Oxygen (3.44) pulls electrons from hydrogen (2.20): oxygen is δ−, each hydrogen δ+, each O–H bond about 1.5 D.', 'Only because the molecule is bent do the two bond dipoles add: 2 × 1.51 × cos 52.2° = 1.855 D.', 'In steam μ = 1.855 D (6.19 × 10⁻³⁰ C·m); polarisation by neighbours raises it to about 3 D in liquid and ice.', 'A dipole sticks to ions and other dipoles, screens electric fields and absorbs microwaves.'],
  pitfalls: ['"Polar bonds make a polar molecule" — Only if they do not cancel. Carbon dioxide and methane have polar bonds and no net dipole; water\'s bent shape is what keeps it.', '"A polar molecule is charged" — Water is neutral overall; the charges are partial and separated by less than an ångström.', '"The stream of water bends because it is charged by the comb" — The stream is neutral. The comb\'s field polarises and then pulls on the molecules, whichever sign the comb has.'],
  terms: [
    { term: 'Electric dipole moment', also: ['dipole', 'μ', 'dipole moment'], def: 'The product of charge and separation, a vector from the negative to the positive charge (physicists) or the reverse (chemists, who draw an arrow from + to −). Water: 1.855 D = 6.19 × 10⁻³⁰ C·m in the gas.' },
    { term: 'Debye', also: ['D'], def: 'A unit of dipole moment, 3.336 × 10⁻³⁰ C·m: roughly the dipole of an electron charge and a proton charge 0.21 Å apart. A hydrogen halide is about 1 D, water 1.85 D, a salt ion pair about 10 D.' },
    { term: 'Electronegativity', also: ['Pauling electronegativity'], def: 'A measure of how strongly an atom draws the shared electrons of a bond: oxygen 3.44, nitrogen 3.04, carbon 2.55, hydrogen 2.20 on Pauling\'s scale.' },
    { term: 'Partial charge', also: ['δ+', 'δ−', 'effective charge'], def: 'The fraction of an electron\'s charge assigned to an atom in a molecule because its share of the bonding electrons differs from the neutral atom\'s. Convention-dependent: about +0.33 to +0.42 e on each hydrogen of water.' },
    { term: 'Polarisability', also: ['induced dipole'], def: 'How easily a molecule\'s electron cloud is distorted by an electric field to produce an induced dipole. Water in the liquid is polarised by its neighbours from 1.855 D to about 2.9 D.' }
  ],
  formulas: [
    { name: 'Dipole of a bent molecule from its bond dipoles', expr: 'mu = 2*mOH*cos(theta/2)', tex: '\\mu = 2\\mu_{\\mathrm{OH}}\\cos\\frac{\\theta}{2}',
      vars: { mu: { name: 'molecular dipole', q: 'dipole', unit: 'D', tex: '\\mu' }, mOH: { name: 'O–H bond dipole', q: 'dipole', unit: 'D', value: 1.51, tex: '\\mu_{\\mathrm{OH}}', hint: 'Not directly measurable; 1.5 D is what the measured molecular dipole implies.' }, theta: { name: 'H–O–H angle', q: 'angle', unit: '°', value: 104.45, min: 0, max: 180, tex: '\\theta' } },
      solveFor: 'mu', note: 'At θ = 180° the result is zero (carbon dioxide); at 0° it would be 2μ.',
      stories: { mu: 'Each bond of a bent molecule has a dipole of {mOH}, and the bonds meet at {theta}. What is the dipole of the molecule?', mOH: 'A molecule with a bond angle of {theta} has a dipole of {mu}. What does that imply for each bond dipole?', theta: 'Two bond dipoles of {mOH} give a molecule dipole of {mu}. What is the angle between the bonds?' } },
    { name: 'Charge displaced by the dipole', expr: 'qt = mu/h', tex: 'q = \\frac{\\mu}{h}',
      vars: { qt: { name: 'charge moved from hydrogens to oxygen', q: 'charge', unit: 'e', tex: 'q', hint: 'About 0.66 e in total, or a third of an electron from each hydrogen.' }, mu: { name: 'molecular dipole', q: 'dipole', unit: 'D', value: 1.855, tex: '\\mu' }, h: { name: 'separation of the charge centres', q: 'length', unit: 'pm', value: 58.7, hint: 'The distance from the oxygen to the midpoint of the hydrogens, L cos(θ/2).' } },
      solveFor: 'qt', note: 'A rough picture: it treats the positive charge as concentrated at the midpoint of the hydrogens and the negative at the oxygen.',
      stories: { qt: 'A molecule has a dipole of {mu} with the charge centres {h} apart. How much charge must have moved?', h: 'A dipole of {mu} comes from a charge of {qt} displaced. How far apart are the charge centres?' } },
    { name: 'Interaction of two dipoles end to end', expr: 'E = 2*mu^2*NA/(4*pi*eps0*r^3)', tex: 'E = \\frac{2\\mu^2 N_A}{4\\pi\\varepsilon_0 r^3}',
      vars: { E: { name: 'binding energy per mole of pairs', q: 'molarenergy', unit: 'kJ/mol', hint: 'Compare with the measured hydrogen-bond energy, about 20 kJ/mol.' }, mu: { name: 'dipole of each molecule', q: 'dipole', unit: 'D', value: 1.855, tex: '\\mu' }, NA: { const: 'NA' }, eps0: { const: 'eps0' }, r: { name: 'distance between centres', q: 'length', unit: 'Å', value: 2.8 } },
      solveFor: 'E', note: 'Two point dipoles in line, head to tail. A crude model at this short distance (the molecules are not points), but of the right size.',
      stories: { E: 'Two molecules of dipole {mu} lie in line {r} apart. How strongly do they attract, per mole of pairs?', r: 'Two dipoles of {mu} attract with {E} per mole. How far apart are they?' } },
    { name: 'How much a field lines the dipoles up', expr: 'a = mu*Ef/(3*kB*T)', tex: 'a = \\frac{\\mu E}{3 k_B T}',
      vars: { a: { name: 'average alignment', q: 'ratio', unit: '%', hint: 'The average of cos(angle) between the dipole and the field; 100 % would be perfect alignment.' }, mu: { name: 'dipole', q: 'dipole', unit: 'D', value: 1.855, tex: '\\mu' }, Ef: { name: 'electric field', q: 'efield', unit: 'MV/m', value: 100, tex: 'E' }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -50 } },
      solveFor: 'a', note: 'The weak-field limit of the Langevin function; it fails when a exceeds about 30 %. Even 100 MV/m, roughly the strongest field water survives in short pulses, aligns only 5 % of the dipoles.',
      stories: { a: 'Water at {T} sits in a field of {Ef}. By what fraction are its molecules lined up?', Ef: 'What field aligns {a} of the dipoles of water at {T}?' } }
  ],
  examples: [
    { title: 'What a hydrogen bond is made of', q: 'Estimate the attraction of two water dipoles lying head to tail at 2.8 Å.',
      steps: [{ text: 'Dipole: $\\mu = 1.855 \\times 3.336\\times10^{-30} = 6.19 \\times 10^{-30}$ C·m.' }, { text: 'Energy for one pair:', tex: 'E = \\frac{2\\mu^2}{4\\pi\\varepsilon_0 r^3} = \\frac{2 \\times 3.83\\times10^{-59}}{1.113\\times10^{-10} \\times 2.195\\times10^{-29}} = 3.1 \\times 10^{-20}\\ \\mathrm{J}' }, 'Multiply by Avogadro: $3.1\\times10^{-20} \\times 6.022\\times10^{23} = 18.9$ kJ/mol.'],
      a: 'About 19 kJ/mol, the size of the measured hydrogen-bond energy of about 20 kJ/mol. The attraction between two water molecules is essentially electrostatic.' },
    { title: 'Why a laboratory field cannot line up water', q: 'A strong static field of 1 MV/m (a spark gap would break down at 3) acts on water at 25 °C. How far does it align the dipoles?',
      steps: [{ text: 'Energy of a dipole in the field, against the thermal energy:', tex: '\\frac{\\mu E}{k_B T} = \\frac{6.19\\times10^{-30} \\times 10^{6}}{4.12 \\times 10^{-21}} = 1.5 \\times 10^{-3}' }, 'The average alignment is a third of that: 0.05 %.'],
      a: 'Five hundredths of a per cent. A neighbouring molecule 2.8 Å away makes a field several thousand times stronger, which is why molecules in the liquid orient one another, though the strongest laboratory field barely moves them.' }
  ],
  quiz: [
    { q: 'Carbon dioxide has two polar C=O bonds but no dipole moment, because', choices: ['carbon is not electronegative', 'the molecule is linear and the two bond dipoles cancel', 'oxygen holds its electrons equally', 'the bonds are double'], a: 1, why: 'Equal dipoles at 180° add to zero. In water the same bonds meet at 104.45° and their components along the axis add instead.' },
    { q: 'A thin stream of water bends towards a charged plastic rod. If the rod is charged the opposite way, the stream bends', choices: ['towards it again', 'away from it', 'not at all', 'towards it, but only half as much'], a: 0, why: 'The molecules turn so that the end of opposite sign faces the rod, and the nearer, opposite-sign end is attracted more strongly. The sign of the rod does not matter.' },
    { q: 'The dipole moment of a water molecule in the liquid is larger than in steam.', a: true, why: 'Neighbouring molecules polarise it: about 2.9–3.0 D in the liquid against 1.855 D alone. The molecule\'s geometry also changes slightly.' },
    { q: 'If water\'s H–O–H angle were 180°, its dipole moment would be', choices: ['1.855 D, unchanged', 'about 3.7 D', 'zero', 'impossible to tell'], a: 2, why: 'The two bond dipoles would point in opposite directions and cancel, as in CO₂. The bend is what makes water polar.' },
    { q: 'What dipole moment, in debye, has an electron charge and an equal positive charge 0.1 nm apart? (1 D = 3.336 × 10⁻³⁰ C·m)', answer: 4.8, why: '1.602 × 10⁻¹⁹ C × 10⁻¹⁰ m = 1.602 × 10⁻²⁹ C·m = 4.80 D. Water\'s 1.855 D is the equivalent of 0.39 e Å.' }
  ],
  applications: ['The microwave oven: it turns the dipoles of the water in food back and forth 2.45 billion times a second; the friction of their turning is the heat.', 'Dissolving: salt, sugar and alcohol dissolve in water because their charges or O–H groups pair with water\'s dipole ([[like-dissolves-like]]).', 'Soil-moisture probes: water\'s dielectric constant of about 78 against 3–5 for dry soil makes the capacitance of the ground a measure of how wet it is.'],
  history: 'Peter Debye introduced the idea of molecular dipole moments in 1912 and measured them from the temperature dependence of the dielectric constant; the unit is named for him. The dipole of water vapour was measured from the Stark effect on its microwave rotation spectrum, giving 1.855 D.',
  sources: ['Gubskaya and Kusalik, "The total molecular dipole moment for liquid water", *Journal of Chemical Physics* 117, 5290 (2002) — about 2.95 D in the liquid, 3.1 D in ice Ih.', 'CRC *Handbook of Chemistry and Physics*: dipole moments of molecules.', 'Atkins and de Paula, *Physical Chemistry*, chapters on molecular interactions and dielectrics.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 1 and 4.'],
  sim: ['om-molecules', { id: 'om-dipole-field', params: { mode: 'dc' } }]
}
);

Hyper.add(

/* ================================================================ three siblings */
{
  id: 'three-siblings', parent: 'one-molecule', title: 'Three siblings: methane, ammonia, water', level: 1,
  short: 'Methane weighs 16, ammonia 17, water 18; each has ten electrons and is built on the same plan. The first two are gases that boil at −162 °C and −33 °C. Water is the liquid in the ocean, boiling at +100 °C. What differs is how many hydrogen bonds each can make.',
  keywords: ['methane', 'ammonia', 'water', 'CH4', 'NH3', 'isoelectronic', 'boiling point', 'gas or liquid', 'hydrogen bonding sites', 'donors and acceptors', 'Trouton', 'entropy of vaporisation', 'the molecule that should not be liquid'],
  prereq: ['the-bent-shape', 'polarity-and-the-dipole'],
  related: ['the-hydride-ladder', 'the-boiling-point-anomaly', 'two-donors-two-acceptors', 'what-a-hydrogen-bond-is', 'latent-heat-of-vaporisation', 'chemistry:hydrogen-bonding', 'chemistry:intermolecular-forces'],
  body: `
Three molecules, one proton apart in mass: methane, $\\ce{CH4}$, 16; ammonia, $\\ce{NH3}$, 17; water, $\\ce{H2O}$, 18. Each has ten electrons. Each is a small molecule of hydrogens round a central atom from the same row of the periodic table. Methane boils at −161.5 °C, ammonia at −33.3 °C, water at +100.0 °C. On a mild day the first two are gases and the third fills the sea. Going one step along the row adds almost nothing to the weight and 262 K to the boiling point between the ends.

### The same plan, with a lone pair added each time
Take methane, remove a hydrogen and let the central atom keep a pair of electrons, and you have ammonia; do it again and you have water. The shape follows the arithmetic of [[the-bent-shape]]:

| | methane | ammonia | water |
|---|---|---|---|
| molar mass (g/mol) | 16.04 | 17.03 | 18.02 |
| shape | tetrahedron | trigonal pyramid | bent |
| H–X–H angle | 109.47° | 106.7° | 104.45° |
| lone pairs | 0 | 1 | 2 |
| dipole moment (D) | 0 | 1.47 | 1.85 |
| hydrogens that can be given | 0 | 3 | 2 |
| lone pairs that can receive a hydrogen | 0 | 1 | 2 |
| hydrogen-bond ends it can make | 0 | 2 | 4 |
| melts at (°C) | −182.5 | −77.7 | 0 |
| boils at (°C) | −161.5 | −33.3 | +100 |
| heat to boil one mole (kJ/mol) | 8.2 | 23.3 | 40.7 |

### Why counting donors and acceptors decides it
A hydrogen bond needs one of each: a hydrogen to give, a lone pair to receive it ([[what-a-hydrogen-bond-is]]). In a liquid every bond one molecule gives is a bond another receives, so **a molecule can take part in no more bonds than the scarcer of the two supplies allow**.

- **Methane** has neither. Carbon is barely more electronegative than hydrogen (2.55 against 2.20), so its hydrogens are not positive enough to bond, and carbon has no lone pair. Only the feeble dispersion forces hold methane molecules together, about 1 kJ/mol each.
- **Ammonia** has three hydrogens to give but one lone pair to receive. For every bond a molecule gives it can accept only one, so on average it makes one donated and one accepted bond, and two of its hydrogens are surplus. Nitrogen is also less electronegative than oxygen (3.04 against 3.44), so each bond is weaker. The result is chains and rings, not a net.
- **Water** has two hydrogens and two lone pairs, a perfect match. All four sites can be used at once, so every molecule can be tied to four neighbours, and the bonds build a three-dimensional network ([[two-donors-two-acceptors]]).

You can check this with the numbers in the table. The heat needed to boil one mole rises in step with the bonds to be broken: 8.2, 23.3 and 40.7 kJ/mol. Divide by the boiling temperature and you get the **entropy of vaporisation**: 73, 97 and 109 J/(mol·K). For ordinary liquids this comes out near 88 (Trouton's rule); methane is lower, because it is so light and cold. Ammonia and water are higher because the liquid is *ordered* — hydrogen bonds hold the molecules in particular relative positions that the gas does not need — and that order is lost when it boils. The boiling point is simply the enthalpy divided by the entropy:

$$T_b = \\frac{\\Delta H_{\\mathrm{vap}}}{\\Delta S_{\\mathrm{vap}}}$$

### And the other ten-electron molecules
Hydrogen fluoride (mass 20) makes the strongest hydrogen bonds of all, but has one hydrogen and three lone pairs, so it can build only chains and boils at +19.5 °C. Neon (also 20) has no bonds of any kind and boils at −246 °C. The same mass and the same number of electrons: boiling points 265 K apart.

> [!key] Methane, ammonia and water have the same plan and the same ten electrons, but methane can make no hydrogen bond, ammonia only about one, and water four. Gas, gas, liquid: the boiling point follows the number of bonds a molecule can hold at once.`,
  ideas: ['Methane (16), ammonia (17) and water (18) are alike in size and electrons yet boil at −161.5, −33.3 and +100 °C.', 'Each added lone pair squeezes the bond angle and changes how many hydrogen-bond sites the molecule has: 0, 2, 4.', 'A molecule can only join as many bonds as the scarcer of its donors and acceptors permit; water has two of each.', 'Boiling point = enthalpy ÷ entropy of vaporisation; the order of the liquid makes the entropy of ammonia and water larger than Trouton\'s 88 J/(mol·K).'],
  pitfalls: ['"Water boils higher than ammonia because it is heavier" — It is only 1 unit heavier. Mass cannot account for 133 K; the hydrogen bonds can.', '"Ammonia has three hydrogens, so it should bond more than water" — Hydrogens are only half of a bond: each needs a lone pair to land on, and ammonia has one.', '"Hydrogen bonding is the only force in these liquids" — Dispersion forces act in all of them; they set methane\'s boiling point. Hydrogen bonds are the extra.'],
  terms: [
    { term: 'Isoelectronic', also: ['same number of electrons'], def: 'Having the same number of electrons. Neon, hydrogen fluoride, water, ammonia and methane are all ten-electron species, so their sizes and dispersion forces are similar while their bonds differ.' },
    { term: 'Entropy of vaporisation', also: ['ΔS_vap'], def: 'The entropy increase when a liquid becomes vapour at its boiling point, ΔH_vap/T_b, in J/(mol·K). About 88 for ordinary liquids (Trouton\'s rule); 97 for ammonia and 109 for water.' },
    { term: 'Trouton\'s rule', also: ['Trouton constant'], def: 'The observation that the entropy of vaporisation at the boiling point is about 85–88 J/(mol·K) for most liquids. Liquids that exceed it, like water, have order in the liquid that is lost on boiling.' },
    { term: 'Trigonal pyramidal', also: ['pyramid shape'], def: 'The shape of a molecule with three bonded atoms and one lone pair on the central atom, as in ammonia; the three hydrogens form the base of a pyramid and the lone pair points away from them.' }
  ],
  formulas: [
    { name: 'Boiling point from enthalpy and entropy', expr: 'Tb = Hv/Sv', tex: 'T_b = \\frac{\\Delta H_{\\mathrm{vap}}}{\\Delta S_{\\mathrm{vap}}}',
      vars: { Tb: { name: 'boiling point', q: 'temperature', unit: '°C', tex: 'T_b' }, Hv: { name: 'heat to boil one mole', q: 'molarenergy', unit: 'kJ/mol', value: 40.65, tex: '\\Delta H_{\\mathrm{vap}}', hint: '8.2 for methane, 23.3 for ammonia, 40.65 for water at its boiling point.' }, Sv: { name: 'entropy of vaporisation', q: 'molarheat', unit: 'J/(mol·K)', value: 108.9, tex: '\\Delta S_{\\mathrm{vap}}', hint: '73 for methane, 97 for ammonia, 109 for water; about 88 for an ordinary liquid.' } },
      solveFor: 'Tb', note: 'The two quantities are taken at the boiling point itself. With the "ordinary" 88 J/(mol·K) the formula would put water\'s boiling point at 462 K = 189 °C.',
      stories: { Tb: 'A liquid takes {Hv} to boil one mole and gains {Sv} of entropy. At what temperature does it boil?', Sv: 'A liquid needs {Hv} per mole and boils at {Tb}. What entropy does it gain on boiling?' } },
    { name: 'Extra order in the liquid', expr: 'dS = Sv - S0', tex: '\\Delta S_{\\mathrm{extra}} = \\Delta S_{\\mathrm{vap}} - \\Delta S_0',
      vars: { dS: { name: 'extra entropy lost to order', q: 'molarheat', unit: 'J/(mol·K)', signed: true, tex: '\\Delta S_{\\mathrm{extra}}', hint: 'Positive when the liquid is more ordered than a normal one; water and ammonia.' }, Sv: { name: 'entropy of vaporisation', q: 'molarheat', unit: 'J/(mol·K)', value: 108.9, tex: '\\Delta S_{\\mathrm{vap}}' }, S0: { name: 'Trouton\'s value', q: 'molarheat', unit: 'J/(mol·K)', value: 88, fixed: true, tex: '\\Delta S_0' } },
      solveFor: 'dS', note: 'A measure of how much more ordered the liquid is than a "normal" one. Water: +21; ammonia: +9; methane: −15, a light, simple liquid.',
      stories: { dS: 'A liquid gains {Sv} of entropy on boiling, where a normal liquid gains {S0}. How much extra?' } }
  ],
  examples: [
    { title: 'The three boiling points from three pairs of numbers', q: 'Use ΔH and ΔS to check the boiling points of methane (8.17 kJ/mol, 73.1 J/(mol·K)) and ammonia (23.35 kJ/mol, 97.4 J/(mol·K)).',
      steps: [{ text: 'Methane:', tex: 'T_b = \\frac{8170}{73.1} = 111.8\\ \\mathrm{K} = -161.4\\ ^\\circ\\mathrm{C}' }, { text: 'Ammonia:', tex: 'T_b = \\frac{23\\,350}{97.4} = 239.7\\ \\mathrm{K} = -33.4\\ ^\\circ\\mathrm{C}' }, 'Both match. Suppose instead that ammonia had boiled with Trouton\'s 88: it would have boiled at 265 K = −8 °C; the hydrogen bonds hold ammonia\'s entropy of vaporisation 9 J/(mol·K) above the norm.'],
      a: '−161 °C and −33 °C, as measured; the extra entropy of ammonia and water is the signature of ordered liquids.' },
    { title: 'What if water were a normal liquid?', q: 'Water takes 40.65 kJ/mol to boil. If its entropy of vaporisation were the ordinary 88 J/(mol·K), where would it boil? Why is the real boiling point lower?',
      steps: [{ text: 'With Trouton\'s entropy:', tex: 'T_b = \\frac{40\\,650}{88} = 462\\ \\mathrm{K} = 189\\ ^\\circ\\mathrm{C}' }, 'The real boiling point is 373 K, and the entropy of vaporisation is 109 J/(mol·K). The hydrogen bonds do two things: they raise the heat of vaporisation enormously (40.7 against 17 kJ/mol for a molecule without them), and they order the liquid, so that boiling also gains a lot of entropy. The two effects work against each other in the ratio.'],
      a: 'A normal liquid with water\'s heat of vaporisation would boil near 190 °C. The ordering of the liquid brings it down to 100 °C — and the hydrogen bonds still lift it 180 K above its family\'s trend.' }
  ],
  quiz: [
    { q: 'Why is methane a gas at room temperature when water is a liquid, although they weigh almost the same?', choices: ['Methane is lighter by 11 %', 'Methane has no hydrogen-bonding hydrogens or lone pairs', 'Methane molecules are bigger', 'Methane has more electrons'], a: 1, why: 'Both have ten electrons and similar size; the difference is that water holds four hydrogen bonds per molecule and methane none.' },
    { q: 'Ammonia has three hydrogens, so it forms more hydrogen bonds per molecule than water.', a: false, why: 'Each bond needs a lone pair to receive it, and ammonia has one. On average it makes one given and one received, against water\'s two and two.' },
    { q: 'Which has the highest entropy of vaporisation?', choices: ['methane (73 J/(mol·K))', 'ammonia (97)', 'water (109)', 'they are all equal'], a: 2, why: 'Water\'s liquid is the most ordered, so boiling releases the most disorder per mole.' },
    { q: 'Hydrogen fluoride makes stronger hydrogen bonds than water but boils 80 K lower. The reason is that HF', choices: ['is much lighter', 'has one hydrogen per molecule and so forms chains rather than a net', 'is a gas', 'is not polar'], a: 1, why: 'Strength is not the only thing; the number of bonds per molecule matters too, and HF has three lone pairs but only one hydrogen.' },
    { q: 'Boiling one mole of a liquid takes 30 kJ and its boiling point is 300 K. What is the entropy of vaporisation in J/(mol·K)?', answer: 100, why: '30,000 J/mol ÷ 300 K = 100 J/(mol·K): above the 88 of Trouton\'s rule, hinting at order in the liquid.' }
  ],
  applications: ['Liquefied natural gas: methane is kept liquid only below −162 °C, which is why LNG tankers are insulated flasks.', 'Refrigeration: ammonia boils at −33 °C and liquefies at room temperature under about 8 atmospheres, which made it the working fluid of industrial refrigerators for over a century.', 'Saturn\'s moon Titan, at −179 °C, has rain, rivers and lakes of liquid methane and ethane: a world where methane plays water\'s role ([[titan]]).', 'The same sorting works for any molecule: count the hydrogens it can give and the lone pairs it can take, and you can predict whether it is a gas, an oil, or a sticky liquid like glycerol.'],
  sources: ['CRC *Handbook of Chemistry and Physics*: boiling and melting points and enthalpies of vaporisation of methane, ammonia and water.', 'Atkins and de Paula, *Physical Chemistry*, ch. 3 (entropy of vaporisation and Trouton\'s rule).', 'Pauling, *The Nature of the Chemical Bond*, ch. 12 — the hydrogen bond and the boiling points of the hydrides.', 'Ball, *H₂O: A Biography of Water*, ch. 2.'],
  sim: { id: 'om-molecules', params: { mol: 'CH4', dipole: true, angle: true, bonds: true } }
},

/* ================================================================ the hydride ladder */
{
  id: 'the-hydride-ladder', parent: 'one-molecule', title: 'The hydride ladder: H₂O, H₂S, H₂Se, H₂Te', level: 2,
  short: 'Down the oxygen column of the periodic table the hydrides boil at −60 °C, −41 °C and −2 °C, a smooth climb with mass. Carried upwards, that line puts water near −80 °C. Water boils at +100 °C, some 180 K above its own family\'s trend: the anomaly that first showed hydrogen bonding at work.',
  keywords: ['hydride', 'H2S', 'H2Se', 'H2Te', 'hydrogen sulfide', 'chalcogen', 'group 16', 'boiling point trend', 'extrapolation', '-80', 'periodic trend', 'anomalous', 'dispersion forces', 'boiling point anomaly'],
  prereq: ['three-siblings', 'the-bent-shape'],
  related: ['the-boiling-point-anomaly', 'what-a-hydrogen-bond-is', 'the-list-of-anomalies', 'latent-heat-of-vaporisation', 'chemistry:intermolecular-forces', 'chemistry:hydrogen-bonding'],
  body: `
Look at the column of the periodic table that begins with oxygen: oxygen, sulfur, selenium, tellurium. Each makes a compound with two hydrogens, $\\ce{H2X}$, bent like water, polar like water, and a gas at room temperature — except the first.

| Hydride | Molar mass | H–X–H | Dipole | Melts | Boils |
|---|---|---|---|---|---|
| $\\ce{H2S}$ | 34.08 | 92.1° | 0.97 D | −85.5 °C | −60.3 °C |
| $\\ce{H2Se}$ | 80.98 | 91° | 0.62 D | −65.7 °C | −41.3 °C |
| $\\ce{H2Te}$ | 129.6 | 90° | 0.2 D | −49 °C | −2.2 °C |
| $\\ce{H2O}$ | 18.02 | 104.45° | 1.855 D | 0 °C | **+100 °C** |

### The climb
The three heavy hydrides are what an ordinary family of molecules looks like. As you go down, the atoms get bigger and carry more electrons, which makes their electron clouds easier to distort ("more polarisable"). Two such molecules passing each other induce momentary dipoles in one another and attract. These **dispersion forces** grow roughly with the size of the electron cloud, so the boiling point climbs: 19 K from sulfide to selenide, 39 K from selenide to telluride. The dipoles *fall* going down — they are small, and the bonds almost non-polar — yet the boiling point rises, which tells you that dispersion, not the dipole, is in charge.

### The ladder carried up
Draw a line through the three points and extend it to oxygen. How you draw the line matters a little: through the last two points it reaches −92 °C at water's mass; the least-squares line through all three gives −73 °C; plotted against period rather than mass, −64 °C. All lie in the range −65 to −95 °C, and the figure usually quoted is about −80 °C. By the trend, water — which weighs less than any of its relatives — should boil far below them.

It boils at +100 °C: roughly 170 K above the trend. The gap is about ten times the size of the climb from one step to the next.

### What the anomaly says
If the trend held, water would be a gas at the surface of the Earth. The coldest air temperature ever recorded at the surface is −89 °C, in Antarctica, and a ladder-obeying water, boiling at −80 °C, would be vapour almost everywhere and permanently. There would be no oceans and no rain.

The explanation is the hydrogen bond. Sulfur is large and weakly electronegative (2.58 against oxygen's 3.44), so its hydrogens are barely positive and its lone pairs are diffuse; $\\ce{H2S}$ forms hydrogen bonds so feeble they are hardly more than van der Waals contacts. Oxygen is small and strongly electronegative; its bonds are 20 kJ/mol, and four per molecule. Subtract the dispersion-force boiling point (about 193 K for a water-sized molecule, by the ladder) and the hydrogen bonds supply the remaining 180 K.

### Other columns
Every column of the periodic table has such a ladder, and the first member is the odd one out in three of them:

- **Group 14** ($\\ce{CH4}$, $\\ce{SiH4}$, $\\ce{GeH4}$, $\\ce{SnH4}$) climbs smoothly all the way up. Methane sits below the line, not above: ordinary behaviour, no anomaly.
- **Group 15**: ammonia is about 90 K above the trend of phosphine, arsine and stibine.
- **Group 17**: hydrogen fluoride is about 130 K above hydrogen chloride, bromide and iodide.
- **Group 16**: water is the most anomalous, about 170 K.

The three anomalies belong to the three elements that can make hydrogen bonds: nitrogen, oxygen and fluorine. The greatest belongs to the one that can make four bonds per molecule.

> [!key] Down the oxygen column the hydrides boil at −60, −41 and −2 °C, a trend that puts water near −80 °C. It boils at +100 °C, 180 K above its ladder: the hydrogen bonds supply the difference, and without them there would be no liquid water on Earth.`,
  ideas: ['H₂S, H₂Se and H₂Te boil at −60, −41 and −2 °C; the rise is due to dispersion forces growing with the electron cloud.', 'Extrapolating the trend to water gives −65 to −95 °C, usually quoted as −80 °C; the real value is +100 °C.', 'The gap of about 170–180 K is supplied by hydrogen bonds, which sulfur, selenium and tellurium form only feebly.', 'Ammonia and hydrogen fluoride are also anomalous; water is the biggest because it bonds four ways.'],
  pitfalls: ['"Water\'s boiling point is high because water is polar" — The heavier hydrides are polar too, and bent like water. Polarity alone would not lift the boiling point by 180 K.', '"The trend is a law, so water\'s boiling point is an error of the measurement" — The trend is an empirical line through molecules of a kind; water is of a different kind, with bonds the others lack. The deviation measures the bonds.', '"Hydrogen bonds are present only in water" — They are present in H₂S too, but about ten times weaker.'],
  terms: [
    { term: 'Hydride', also: ['binary hydrogen compound'], def: 'A compound of hydrogen with one other element. The covalent hydrides of the p-block, such as H₂O, H₂S, NH₃ and CH₄, are the molecules whose boiling points are compared down a column.' },
    { term: 'Chalcogen', also: ['group 16', 'oxygen family'], def: 'An element of group 16 of the periodic table: oxygen, sulfur, selenium, tellurium and polonium. Their hydrides H₂X are bent molecules.' },
    { term: 'London dispersion force', also: ['van der Waals force', 'induced-dipole attraction'], def: 'The attraction between two molecules from momentary, correlated shifts of their electron clouds. It grows with the number of electrons and the size of the molecule, and sets the boiling point of non-polar liquids.' },
    { term: 'Periodic trend', also: ['group trend'], def: 'A regular change of a property down a column of the periodic table. A property that departs strongly from it, like water\'s boiling point, points to a new kind of interaction.' }
  ],
  formulas: [
    { name: 'Straight-line extrapolation up the column', expr: 'Tx = T1 + (T2 - T1)*(mx - m1)/(m2 - m1)', tex: 'T_x = T_1 + \\left(T_2 - T_1\\right)\\frac{m_x - m_1}{m_2 - m_1}',
      vars: { Tx: { name: 'predicted boiling point of the first member', q: 'temperature', unit: '°C', tex: 'T_x' }, T1: { name: 'boiling point of the first hydride used', q: 'temperature', unit: '°C', value: -41.3, tex: 'T_1', hint: 'Hydrogen selenide, −41.3 °C.' }, T2: { name: 'boiling point of the second hydride used', q: 'temperature', unit: '°C', value: -2.2, tex: 'T_2', hint: 'Hydrogen telluride, −2.2 °C.' }, mx: { name: 'molar mass of the first member', q: 'molarmass', unit: 'g/mol', value: 18.02, tex: 'm_x' }, m1: { name: 'molar mass of the first hydride used', q: 'molarmass', unit: 'g/mol', value: 80.98, tex: 'm_1' }, m2: { name: 'molar mass of the second hydride used', q: 'molarmass', unit: 'g/mol', value: 129.6, tex: 'm_2' } },
      solveFor: 'Tx', note: 'Through the two heaviest hydrides; with H₂S and H₂Se it gives −67 °C. The scatter between the methods is about 25 K, small beside the 180 K gap.',
      stories: { Tx: 'Two hydrides of mass {m1} and {m2} boil at {T1} and {T2}. A lighter relative of mass {mx} follows the same straight line. At what temperature should it boil?' } },
    { name: 'The size of the anomaly', expr: 'dT = Tobs - Tpred', tex: '\\Delta T = T_{\\mathrm{observed}} - T_{\\mathrm{predicted}}',
      vars: { dT: { name: 'excess boiling point', q: 'dtemp', unit: 'K', signed: true, tex: '\\Delta T' }, Tobs: { name: 'observed boiling point', q: 'temperature', unit: '°C', value: 100, tex: 'T_{\\mathrm{observed}}' }, Tpred: { name: 'boiling point predicted by the trend', q: 'temperature', unit: '°C', value: -80, tex: 'T_{\\mathrm{predicted}}' } },
      solveFor: 'dT', note: 'Positive means more strongly bound than the trend; for the hydrides of nitrogen and fluorine it is 90 and 130 K, for water 180.',
      stories: { dT: 'A hydride boils at {Tobs} where the trend of its family predicts {Tpred}. By how much is it above the trend?' } }
  ],
  examples: [
    { title: 'Three ways to draw the line', q: 'Extrapolate from the boiling points of H₂S (34.08, −60.3 °C), H₂Se (80.98, −41.3 °C) and H₂Te (129.6, −2.2 °C) to a molar mass of 18.02.',
      steps: [{ text: 'Through the two heaviest:', tex: 'T = -41.3 + 39.1 \\times \\frac{18.02 - 80.98}{48.62} = -41.3 - 50.6 = -91.9\\ ^\\circ\\mathrm{C}' }, { text: 'Through the two lightest:', tex: 'T = -60.3 + 19.0 \\times \\frac{18.02 - 34.08}{46.90} = -60.3 - 6.5 = -66.8\\ ^\\circ\\mathrm{C}' }, 'A least-squares line through all three gives about −73 °C.'],
      a: 'Between −67 and −92 °C. Take −80 °C as the middle of the range. Water boils 170–190 K above the line, whichever way it is drawn.' },
    { title: 'How much of boiling is hydrogen bonds?', q: 'Assuming that without hydrogen bonds water would boil at −80 °C (193 K) with the ordinary entropy of vaporisation of 88 J/(mol·K), estimate the part of water\'s heat of vaporisation (40.7 kJ/mol) that comes from hydrogen bonds.',
      steps: [{ text: 'The heat water would need without them:', tex: '\\Delta H_0 = T\\,\\Delta S = 193 \\times 88 = 17.0\\ \\mathrm{kJ/mol}' }, 'The rest is the hydrogen bonds: $40.7 - 17.0 = 23.7$ kJ/mol.', 'Compare with the earlier estimate of $\\tfrac{1}{2} \\times 3.1 \\times 20 \\approx 31$ kJ/mol for the bonds at 100 °C, which counts only the bonds and not the ordinary forces.'],
      a: 'About 24 kJ/mol, six-tenths of the total: the ordinary forces would supply 17 and the hydrogen bonds the other 24. A rough estimate, but it explains why water boils so high.' }
  ],
  quiz: [
    { q: 'Along the series H₂S, H₂Se, H₂Te the boiling point rises because', choices: ['the dipole moment grows', 'the hydrogen bond grows stronger', 'dispersion forces grow with the larger electron clouds', 'the molecules become more bent'], a: 2, why: 'The dipole actually falls (0.97, 0.62, 0.2 D). Larger atoms with more electrons attract through dispersion forces.' },
    { q: 'By the trend of its heavier relatives, water would boil at about', choices: ['+100 °C', '+30 °C', '−80 °C', '−200 °C'], a: 2, why: 'A line through the boiling points of H₂S, H₂Se and H₂Te reaches about −80 °C at water\'s mass (between −67 and −92 °C, depending on how it is drawn).' },
    { q: 'Methane lies below the line of its group-14 family. Does this show it has a hydrogen-bonding anomaly?', a: false, why: 'The anomaly is a boiling point *above* the trend, caused by extra attraction. Methane has no hydrogen bonds; the straight line is just a crude approximation to a curve.' },
    { q: 'If water obeyed the hydride trend, which statement about Earth would be true?', choices: ['The oceans would be a bit smaller', 'Liquid water would be impossible at the surface, except under high pressure', 'Ice would sink', 'Nothing would change'], a: 1, why: 'A boiling point near −80 °C is below nearly every temperature on Earth. At surface pressure water would be vapour almost everywhere.' },
    { q: 'Water boils at +100 °C and the trend predicts −80 °C. How many kelvin above the trend is it?', answer: 180, why: 'The difference of two temperatures is the same in kelvin or degrees Celsius: 100 − (−80) = 180 K.' }
  ],
  applications: ['Chemists use the same method on any family of compounds: a property that leaves the trend flags a new interaction (hydrogen bonding, metal–ligand bonds, ionic character).', 'Hydrogen sulfide from sewers, marshes and volcanoes is a gas, as its place on the ladder predicts; it is toxic, smells of bad eggs at parts-per-billion levels and above about 100 ppm it deadens the sense of smell, which makes it more dangerous, and a few hundred ppm can kill.', 'Hydrogen sulfide at deep-sea vents feeds bacteria that live without light — the chemistry of [[oceans-in-the-dark]].', 'Predicting the boiling point of an unknown molecule from its relatives, and noticing when to distrust the prediction.'],
  history: 'The anomaly was noticed in the early twentieth century, when boiling points of hydrides were tabulated by column; it was one of the pieces of evidence behind the idea of the hydrogen bond, proposed by Latimer and Rodebush in 1920 for water and ammonia.',
  sources: ['CRC *Handbook of Chemistry and Physics*: boiling points, melting points and dipole moments of the hydrides.', 'Pauling, *The Nature of the Chemical Bond*, ch. 12 — the boiling points of hydrides as evidence for the hydrogen bond.', 'Latimer and Rodebush, "Polarity and ionization from the standpoint of the Lewis theory of valence", *Journal of the American Chemical Society* 42, 1419 (1920).', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 2.'],
  sim: { id: 'om-hydride-ladder', params: { group: '16' } }
}
);

Hyper.add(

/* ================================================================ vibrations and the colour of water */
{
  id: 'vibrations-and-the-colour-of-water', parent: 'one-molecule', title: 'Vibrations and the colour of water', level: 2,
  short: 'A water molecule has three ways to vibrate, at 3657, 3756 and 1595 cm⁻¹. The O–H stretches have overtones that reach into the red, which is why water is faintly blue; in the liquid the hydrogen bonds smear the stretch into a broad band near 3400; and a microwave oven works by turning the dipole, not by hitting a vibration.',
  keywords: ['vibration', 'infrared', 'spectrum', 'stretch', 'bend', 'normal modes', 'wavenumber', 'cm-1', 'overtone', 'why is water blue', 'colour of water', 'absorption', 'Beer–Lambert', 'microwave oven', '2.45 GHz', 'dielectric loss', 'greenhouse'],
  prereq: ['the-bent-shape', 'polarity-and-the-dipole'],
  related: ['what-a-hydrogen-bond-is', 'bonds-that-flicker', 'seeing-the-bonds', 'water-vapour-greenhouse', 'the-dielectric-constant', 'physics:dielectrics'],
  body: `
A molecule is not a rigid ornament. Its atoms are held by bonds that act like springs, and it rings when it is struck. A water molecule has nine degrees of freedom — three atoms, each free to move in three directions — of which three are the molecule moving as a whole, three are it rotating, and three are it vibrating. Those three vibrations decide how water absorbs infrared light, why it is blue, and how a microwave oven heats a cup of tea.

### The three vibrations
| Mode | Motion | Gas (cm⁻¹) | Wavelength | Frequency | Period |
|---|---|---|---|---|---|
| ν₁ symmetric stretch | both O–H lengthen together | 3657 | 2.73 µm | 110 THz | 9.1 fs |
| ν₂ bend | the H–O–H angle opens and closes | 1595 | 6.27 µm | 48 THz | 20.9 fs |
| ν₃ asymmetric stretch | one O–H lengthens as the other shortens | 3756 | 2.66 µm | 113 THz | 8.9 fs |

Spectroscopists give the position of a vibration in **wavenumbers**, the number of waves per centimetre: $\\tilde\\nu = 1/\\lambda$, so 3657 cm⁻¹ is a wavelength of 2.73 µm and, times the speed of light, a frequency of $1.10\\times10^{14}$ Hz. One quantum of the stretch is 0.45 eV or 43.7 kJ/mol — about the heat needed to boil a mole of water. The bend is the softest, at less than half the energy; the molecule is easier to bend than to stretch.

### What hydrogen bonds do to them
In the liquid the picture changes in three ways, and each tells you something about the hydrogen bond:
- The sharp lines of the gas are replaced by one **broad stretching band** centred near 3400 cm⁻¹, spanning 3000 to 3600. Each molecule feels a slightly different set of neighbours, and a stretch whose hydrogen is held in a strong bond is at lower frequency than one in a weak bond. The width of the band is the spread of hydrogen-bond strengths in the liquid. In ice, where all bonds are strong and straight, the band moves down to about 3200.
- The bend moves *up* slightly, to 1645 cm⁻¹: the hydrogen bonds make it harder to close the angle.
- New bands appear below 1000: **librations**, the molecule rocking against the cage of its neighbours (a broad band near 650), and, down at about 200 cm⁻¹, the stretching of the hydrogen bond itself. That last one has a period of about 170 femtoseconds — the figure measured by femtosecond infrared spectroscopy as the oscillation of the bond (Fecko and colleagues, 2003).

### The colour of water
Pure water is not colourless but a very pale blue, which you see only in a deep, clean pool, a glacier crevasse or the sea. The cause is absorption, not scattering: water takes out red light more than blue. The O–H stretch absorbs at 3400 cm⁻¹, a wavelength near 3 µm. But a vibration can also absorb at **overtones** — roughly integer multiples of its frequency, as a plucked string has harmonics — and the fourth and fifth overtones of the stretch fall near 760 and 606 nm, at the red end of the visible spectrum. Braun and Smirnov (1993) set this out in an article on exactly the question *Why is water blue?*. The absorption is weak (the fifth overtone is roughly a ten-millionth as strong as the fundamental) but a metre of water is a lot of molecules.

Light falls off exponentially with the path through the water, $I = I_0 e^{-aL}$, and the 1/e distance $1/a$ depends strongly on colour (pure water, rounded):

| Colour | Wavelength | Absorption coefficient | Distance for 37 % left |
|---|---|---|---|
| deep red | 750 nm | 2.7 per m | 0.37 m |
| red | 650 nm | 0.34 per m | 2.9 m |
| green | 550 nm | 0.057 per m | 18 m |
| blue | 450 nm | 0.0092 per m | 110 m |

After two metres roughly half the red is gone but nearly all the blue is left; after ten, 97 % of the red has been removed. That is why a diver's red turns grey within a few metres and why the sea looks blue. In real seawater plankton and sediment add yellow and green; in an ice crevasse, with few bubbles, the blue is purest.

### Microwave ovens do not hit a vibration
The oven's 2.45 GHz is a wavelength of 12 cm and a photon energy of $10^{-5}$ eV, forty-five thousand times smaller than a stretch quantum. Nothing vibrates. What the field does is turn the *dipole*: the molecules try to follow the field as it reverses 2.45 billion times a second, and the friction of turning against the hydrogen-bonded neighbours becomes heat. In liquid water the dipoles take about 8 ps to reorient; the loss peaks near 19 GHz, and 2.45 GHz sits well below the peak, which is deliberate, since a weaker absorption lets the radiation penetrate a centimetre or two into the food. Ice, whose molecules cannot turn, absorbs poorly, so a frozen block thaws unevenly.

> [!key] A water molecule vibrates in three ways, and hydrogen bonds turn the sharp gas lines into broad bands. The overtones of the O–H stretch absorb red light, which makes water blue; a microwave oven does not excite a vibration at all, but turns the dipole.`,
  ideas: ['Three vibrations: symmetric stretch 3657, asymmetric stretch 3756, bend 1595 cm⁻¹ (gas), about 110, 113 and 48 THz.', 'In the liquid the stretch becomes a broad band near 3400 cm⁻¹ and in ice 3200: the stronger the hydrogen bond, the lower the frequency.', 'Overtones of the O–H stretch near 760 and 606 nm absorb red, so water transmits blue furthest: the 1/e depth is 110 m at 450 nm and 2.9 m at 650 nm.', 'A microwave oven (2.45 GHz) heats by turning the dipoles against friction, not by exciting a vibration.'],
  pitfalls: ['"The sea is blue because it reflects the sky" — It reflects some, but a deep clean pool in the shade, or a glacier crevasse, is blue from absorption in the water itself.', '"Microwave ovens tune to the resonance of the water molecule" — The 2.45 GHz is not a resonance of liquid water; the loss is broad and peaks near 19 GHz. The frequency is chosen for penetration and for being an allowed band.', '"Higher frequency microwaves would cook better" — They would heat the surface more and the depth less: the penetration falls as the loss rises.'],
  terms: [
    { term: 'Normal mode', also: ['vibrational mode', 'fundamental'], def: 'One of the independent patterns in which all atoms of a molecule vibrate at the same frequency. A non-linear molecule of N atoms has 3N − 6 of them: three for water.' },
    { term: 'Wavenumber', also: ['cm⁻¹', 'reciprocal centimetre'], def: 'The number of wavelengths per centimetre, 1/λ, in cm⁻¹. Multiplied by the speed of light it is the frequency; multiplied by hc it is the energy. 3657 cm⁻¹ is 2.73 µm, 110 THz and 0.453 eV.' },
    { term: 'Overtone', also: ['harmonic', 'combination band'], def: 'A weaker absorption at roughly a multiple of a vibration\'s fundamental frequency (or at a sum of two). The O–H stretch has overtones at about 1450, 970, 760 and 606 nm.' },
    { term: 'Absorption coefficient', also: ['attenuation coefficient', 'Beer–Lambert law'], def: 'The rate at which light is absorbed in a medium, 1/m: the intensity falls as exp(−aL) over a path L. For pure water 0.0092 per m at 450 nm and 0.34 per m at 650 nm.' },
    { term: 'Libration', also: ['hindered rotation'], def: 'The rocking or twisting of a molecule in the cage of its neighbours, which in liquid water absorbs broadly near 650 cm⁻¹; what rotation becomes when it cannot be free.' },
    { term: 'Dielectric loss', also: ['ε″', 'microwave absorption'], def: 'The part of a medium\'s response to an oscillating electric field that lags the field and is lost as heat. For liquid water it peaks near 19 GHz at 25 °C.' }
  ],
  formulas: [
    { name: 'Frequency from wavenumber', expr: 'f = c*wn', tex: 'f = c\\,\\tilde\\nu',
      vars: { f: { name: 'frequency', q: 'frequency', unit: 'THz' }, c: { const: 'c' }, wn: { name: 'wavenumber', q: 'wavenumber', unit: '1/cm', value: 3657, tex: '\\tilde\\nu', hint: 'Gas water: 3657 (symmetric stretch), 3756 (asymmetric), 1595 (bend); liquid: about 3400 and 1645.' } },
      solveFor: 'f', note: 'The wavelength is the reciprocal of the wavenumber: 3657 cm⁻¹ is 2.73 µm.',
      stories: { f: 'The symmetric stretch of water absorbs at {wn}. What is its frequency?', wn: 'A vibration has a frequency of {f}. At what wavenumber does it absorb?' } },
    { name: 'Energy of one vibrational quantum', expr: 'E = h*c*wn', tex: 'E = h\\,c\\,\\tilde\\nu',
      vars: { E: { name: 'energy of one photon or quantum', q: 'energy', unit: 'eV' }, h: { const: 'h' }, c: { const: 'c' }, wn: { name: 'wavenumber', q: 'wavenumber', unit: '1/cm', value: 3657, tex: '\\tilde\\nu' } },
      solveFor: 'E', note: 'About 0.45 eV for a stretch: far above the thermal energy of 0.026 eV at room temperature, so the molecule\'s stretches are almost never excited by heat — it is quantum-mechanically "frozen" in the ground state.',
      stories: { E: 'A vibration absorbs at {wn}. What is the energy of one quantum?' } },
    { name: 'Light left after a path through water', expr: 'T = exp(-a*L)', tex: 'T = e^{-a L}',
      vars: { T: { name: 'fraction transmitted', q: 'ratio', unit: '%' }, a: { name: 'absorption coefficient (1/m)', value: 0.34, hint: '0.0092 at 450 nm (blue), 0.057 at 550 nm (green), 0.34 at 650 nm (red), 2.7 at 750 nm. Pure water (Pope and Fry 1997).' }, L: { name: 'path length', q: 'length', unit: 'm', value: 10 } },
      solveFor: 'T', note: 'The Beer–Lambert law. After a distance 1/a only 37 % remains; after 2.3/a only 10 %.',
      stories: { T: 'Red light of absorption coefficient {a} passes through {L} of pure water. How much is left?', L: 'Light with absorption coefficient {a} is reduced to {T}. How long was the path?' } },
    { name: 'Dielectric loss of water (one Debye relaxation)', expr: 'eL = deps*(2*pi*f*tau)/(1 + (2*pi*f*tau)^2)', tex: '\\varepsilon_L = \\Delta\\varepsilon\\,\\frac{\\omega\\tau}{1 + (\\omega\\tau)^2},\\ \\omega = 2\\pi f',
      vars: { eL: { name: 'dielectric loss', tex: '\\varepsilon_L', hint: 'Dimensionless; about 9 at 2.45 GHz and 25 °C, measured about 10.' }, deps: { name: 'dielectric step (εs − ε∞)', value: 73, tex: '\\Delta\\varepsilon', hint: 'Static permittivity 78 minus the high-frequency value of about 5.' }, f: { name: 'field frequency', q: 'frequency', unit: 'GHz', value: 2.45 }, tau: { name: 'relaxation time', q: 'time', unit: 'ps', value: 8.3, tex: '\\tau', hint: 'How long a dipole takes to reorient: 8.3 ps at 25 °C, about twice that at 0 °C, a fraction of it at 100 °C.' } },
      solveFor: 'eL', note: 'A single-relaxation (Debye) model; real water has a second, faster process, but this is good to 10 %. The loss peaks where ωτ = 1, at f = 1/(2πτ) ≈ 19 GHz.',
      stories: { eL: 'Water has dielectric step {deps} and relaxation time {tau}. What is its dielectric loss at {f}?', f: 'At what frequency does water of relaxation time {tau} reach a loss of {eL}?' } }
  ],
  examples: [
    { title: 'Which colour does a diver lose first?', q: 'Pure water absorbs red (650 nm) with a = 0.34 per m and blue (450 nm) with a = 0.0092 per m. How much of each is left after 10 m?',
      steps: [{ text: 'Red:', tex: 'T = e^{-0.34 \\times 10} = e^{-3.4} = 0.033' }, { text: 'Blue:', tex: 'T = e^{-0.0092 \\times 10} = e^{-0.092} = 0.91' }, 'At 10 m, 3 % of the red and 91 % of the blue remain: the light has turned from white to a deep blue-green.'],
      a: '3 % of the red against 91 % of the blue, a ratio of 27 to 1. This is why underwater photographs need a flash or a red filter, and why red fish are black at depth.' },
    { title: 'A stretch against a thermal kick', q: 'How does the quantum of the symmetric stretch (3657 cm⁻¹) compare with the thermal energy at 25 °C?',
      steps: [{ text: 'Quantum:', tex: 'E = h c \\tilde\\nu = 6.626\\times10^{-34} \\times 2.998\\times10^{8} \\times 3.657\\times10^{5} = 7.26\\times10^{-20}\\ \\mathrm{J} = 0.453\\ \\mathrm{eV}' }, { text: 'Thermal energy:', tex: 'k_B T = 4.12\\times10^{-21}\\ \\mathrm{J} = 0.0257\\ \\mathrm{eV}' }, 'The ratio is about 18, so the Boltzmann factor $e^{-18} \\approx 10^{-8}$ is the chance that a given molecule\'s stretch is excited by heat.'],
      a: 'A stretch quantum is eighteen times the thermal energy: at room temperature virtually every molecule is in its vibrational ground state. The bend, at 1595 cm⁻¹, is excited in about one molecule in a few thousand.' }
  ],
  quiz: [
    { q: 'In the liquid, compared with the gas, the O–H stretching absorption', choices: ['is sharper and at higher frequency', 'is broader and at lower frequency', 'is unchanged', 'disappears'], a: 1, why: 'Hydrogen bonds weaken the O–H bond and every molecule has different neighbours: the stretch moves from 3657–3756 down to a broad band near 3400 cm⁻¹, and further, to about 3200, in ice.' },
    { q: 'Water appears blue mainly because', choices: ['it scatters blue light much more than red', 'it absorbs red light through overtones of the O–H stretch', 'it reflects the sky', 'dissolved salt colours it'], a: 1, why: 'The absorption coefficient rises steeply into the red; scattering by pure water is much weaker than that absorption, and the blue of a pool or glacier is seen with the sky out of the picture.' },
    { q: 'A microwave oven heats water because 2.45 GHz exactly matches a vibration of the molecule.', a: false, why: 'The photon energy (10⁻⁵ eV) is forty-five thousand times smaller than a vibrational quantum. The field turns the dipoles; the friction of turning in the liquid is the heat.' },
    { q: 'Frozen food in a microwave oven thaws unevenly because', choices: ['ice reflects microwaves', 'in ice the molecules are locked in place and cannot turn to absorb the field', 'ice is cold', 'the food is thicker'], a: 1, why: 'The dipole relaxation time in ice is of order microseconds or more, so at 2.45 GHz the molecules barely respond. Where a bit has melted, the liquid water absorbs strongly and runs away from the ice.' },
    { q: 'What is the frequency, in THz, of light at a wavenumber of 3,336 cm⁻¹? (c = 3.00 × 10⁸ m/s)', answer: 100, why: 'f = c × wavenumber = 3.00×10⁸ × 3.336×10⁵ = 1.00×10¹⁴ Hz = 100 THz, a wavelength of 3 µm.' }
  ],
  applications: ['Infrared satellites measure water vapour in the atmosphere from its bands near 6.3 µm (the bend) and 2.7 µm (the stretches), and the same absorption makes water vapour the strongest natural greenhouse gas ([[water-vapour-greenhouse]]).', 'Ocean colour satellites read the green of chlorophyll against water\'s blue; the clearest ocean water transmits best at about 450–480 nm, and the depth of light penetration sets how deep photosynthesis can go.', 'Infrared spectroscopy of water in cells and tissue: the position of the stretching band reports how strongly the water is hydrogen-bonded ([[seeing-the-bonds]]).', 'Microwave drying, thawing and industrial heating all rely on water\'s dielectric loss; salty food heats more at the surface because ions add conduction loss.'],
  history: 'Water\'s infrared absorption bands were mapped by Coblentz in the early 1900s. Why water is blue was argued for a century: Bunsen (1847) attributed it to absorption, Raman (1922) to scattering; the case for absorption by overtones of the O–H stretch was made quantitatively by Braun and Smirnov in 1993. The microwave oven was patented by Percy Spencer of Raytheon, who noticed a candy bar melting in his pocket near a radar magnetron in 1945.',
  sources: ['Braun and Smirnov, "Why is water blue?", *Journal of Chemical Education* 70, 612 (1993) — absorption by overtones and combinations of the O–H stretch.', 'Pope and Fry, "Absorption spectrum (380–700 nm) of pure water. II. Integrating cavity measurements", *Applied Optics* 36, 8710 (1997) — the absorption coefficients.', 'Fecko, Eaves, Loparo, Tokmakoff and Geissler, "Ultrafast hydrogen-bond dynamics in the infrared spectroscopy of water", *Science* 301, 1698 (2003).', 'Herzberg, *Molecular Spectra and Molecular Structure II: Infrared and Raman Spectra of Polyatomic Molecules* (1945) — the three fundamentals of H₂O; Kaatze, "Complex permittivity of water as a function of frequency and temperature", *Journal of Chemical and Engineering Data* 34, 371 (1989).'],
  sim: ['om-vibration-modes', 'om-colour-of-water', { id: 'om-dipole-field', params: { mode: 'ac' } }]
},

/* ================================================================ isotopes and heavy water */
{
  id: 'isotopes-and-heavy-water', parent: 'one-molecule', title: 'Isotopes and heavy water', level: 2,
  short: 'Replace both hydrogens by deuterium and water becomes D₂O, 11 % heavier, melting at 3.82 °C and denser than ordinary ice, so that its ice sinks. It tastes faintly sweet to people, slows living cells, and moderates nuclear reactors; a drop of ordinary water has a few of these molecules and a trace of tritium.',
  keywords: ['heavy water', 'D2O', 'deuterium', 'tritium', 'isotope', 'isotopologue', 'HDO', 'heavy ice sinks', 'sweet taste', 'T1R2/T1R3', 'moderator', 'VSMOW', 'D/H ratio', '18O', 'isotope effect'],
  prereq: ['what-water-is', 'chemistry:isotopes'],
  related: ['the-deuterium-clock', 'heavy-water-in-reactors', 'quantum-effects-in-water', 'why-ice-floats', 'the-density-maximum', 'water-older-than-the-sun', 'chemistry:isotopes'],
  body: `
Ordinary hydrogen is a single proton orbited by an electron. Deuterium is hydrogen with a neutron added, so that its nucleus weighs twice as much and its chemistry is almost identical. Water in which both hydrogens are deuterium, $\\ce{D2O}$, is **heavy water**. It looks the same, flows the same way, and is not radioactive; but nearly every number about it is a little different, and some of the differences are large enough to see.

### The isotopes in ordinary water
Water is a mixture of many molecules. Hydrogen is 99.9844 % protium (¹H) and 0.0156 % deuterium (²H, D), a ratio D/H of $1.5576 \\times 10^{-4}$ in ocean water (the standard called VSMOW), plus a vanishing trace of radioactive tritium (³H, T). Oxygen is 99.757 % ¹⁶O, 0.038 % ¹⁷O and 0.205 % ¹⁸O. Combinations of these make nine stable kinds of water molecule (*isotopologues*), and eighteen if tritium is counted. By chance alone, about one molecule in 3,200 carries a deuterium (as **semi-heavy water**, HDO), and one in 41 million is $\\ce{D2O}$ proper. A glass of tap water holds some $2\\times10^{17}$ fully heavy molecules.

### Heavy water against light water
| | $\\ce{H2O}$ | $\\ce{D2O}$ |
|---|---|---|
| molar mass (g/mol) | 18.015 | 20.028 |
| melts at (°C) | 0.00 | 3.82 |
| boils at (°C) | 99.97 | 101.42 |
| density at 25 °C (kg/m³) | 997.0 | 1104.4 |
| temperature of maximum density (°C) | 3.98 | 11.2 |
| maximum density (kg/m³) | 999.97 | 1105.3 |
| viscosity at 25 °C (mPa·s) | 0.890 | 1.095 |
| ion product, pK$_w$ at 25 °C | 13.995 | 14.87 |

The density is simply the heavier molecule in nearly the same volume: 20.03 against 18.02 is a ratio of 1.11 and the densities differ by 10.8 %, because D₂O takes a hair more room per molecule. What is more interesting is that the *whole curve* of D₂O is the curve of ordinary water moved by about 7 K, with its maximum at 11.2 °C instead of 3.98 °C. Deuterium makes the hydrogen bond a little stronger, so that D₂O at 11 °C is as ordered as H₂O at 4 °C. The reason is quantum mechanical: a hydrogen nucleus is light enough that its zero-point motion blurs its position along the bond; the heavier deuteron blurs less, and the bond is better defined ([[quantum-effects-in-water]]).

### Heavy ice sinks
Ordinary ice is 8 % less dense than the water it floats in. Heavy ice (at 0 °C about 1017 kg/m³, 11 % denser than ordinary ice) is *denser than ordinary liquid water* and sinks in it. A cube of D₂O ice dropped into a glass of ordinary cold water goes straight to the bottom; the USGS Water Science School notes that heavy-water ice is 10.6 % denser than ordinary water and sinks in it. In heavy water itself, both kinds of ice float. Try it on the simulation.

### Taste, life and the body
Pure heavy water tastes faintly sweet to people. Ben Abu and colleagues (Hebrew University, 2021) showed that it activates the sweet taste receptor T1R2/T1R3: a drug that blocks that receptor (lactisole) removed the sweetness in human tasters, and the effect was seen in cell cultures too. Mice, strikingly, do not find it sweet. It is harmless in a sip, but cells need ordinary water: a C–D bond breaks several times more slowly than a C–H bond, and the delicate machinery of cell division, which depends on hydrogen bonds, slows. Animals given a large fraction of their body water as D₂O for many days sicken; plants and yeasts stop growing when the water is mostly heavy.

### Tritium
Tritium, with two neutrons, is radioactive: a half-life of 12.3 years, decaying to helium-3 by emitting an electron of at most 18.6 keV, too weak to cross the skin. It is made continually in the upper atmosphere by cosmic rays and was released in large quantities by the atmospheric nuclear tests of the 1950s and 1960s, which put a spike into the rain whose decay is used to date groundwater and wine.

### What heavy water is used for
- **Reactors.** Deuterium absorbs few neutrons, so heavy water slows them without losing them and lets natural uranium sustain a chain reaction (CANDU reactors, [[heavy-water-in-reactors]]).
- **Tracers.** Doubly labelled water ($\\ce{^2H2^{18}O}$) drunk by a person or animal measures their energy use over days from how fast the two labels leave the body.
- **Spectroscopy.** D₂O is the standard solvent for NMR of biomolecules, because it carries no ¹H signal.
- **Climate.** The ratio of heavy to light water in ice cores records the temperature when the snow fell; and the ratio in comets and oceans is a clue to where Earth's water came from ([[the-deuterium-clock]]).

> [!key] Heavy water is water with both hydrogens doubled in weight: 11 % denser, melting at 3.82 °C, and its ice sinks in ordinary water. The differences are the fingerprint of quantum motion in the hydrogen bond, and the same ratio of deuterium to hydrogen is a clock for the history of Earth's oceans.`,
  ideas: ['Natural hydrogen is 0.0156 % deuterium (D/H = 1.5576 × 10⁻⁴); one water molecule in 3,200 contains a deuterium, one in 41 million is D₂O.', 'D₂O melts at 3.82 °C, boils at 101.42 °C and has its density maximum at 11.2 °C: the light-water curve moved by 7 K.', 'Heavy ice is denser than ordinary liquid water and sinks in it; in heavy water either ice floats.', 'D₂O tastes sweet to humans through the T1R2/T1R3 receptor, slows cell division, and moderates neutrons in CANDU reactors.'],
  pitfalls: ['"Heavy water is radioactive" — Deuterium is stable. Tritium is radioactive; heavy water is not.', '"Heavy water is dangerous to drink" — A sip or a glass is harmless. It is only a hazard to a body in which a quarter or more of the water is replaced for days or weeks, and nobody gets there by accident.', '"Heavy ice sinks because it is solid" — Ordinary ice is a solid and floats. Heavy ice sinks in light water because it is about 11 % denser than ordinary ice.'],
  terms: [
    { term: 'Deuterium', also: ['²H', 'D', 'heavy hydrogen'], def: 'The stable isotope of hydrogen with one proton and one neutron; 0.0156 % of natural hydrogen (D/H = 1.5576 × 10⁻⁴ in ocean water). Its atoms weigh twice as much as ordinary hydrogen\'s.' },
    { term: 'Heavy water', also: ['D₂O', 'deuterium oxide'], def: 'Water in which both hydrogens are deuterium: molar mass 20.03 g/mol, melting at 3.82 °C and boiling at 101.42 °C, with maximum density 1105.3 kg/m³ at 11.2 °C.' },
    { term: 'Semi-heavy water', also: ['HDO', 'protium deuterium oxide'], def: 'Water with one hydrogen and one deuterium. In natural water about one molecule in 3,200 is HDO, a thousand times more common than D₂O.' },
    { term: 'Tritium', also: ['³H', 'T'], def: 'The radioactive isotope of hydrogen with two neutrons, half-life 12.3 years; made in the upper atmosphere by cosmic rays and by nuclear tests, and a beta emitter of very low energy.' },
    { term: 'Isotopologue', also: ['isotopic species'], def: 'Molecules that differ only in which isotopes their atoms are. Ordinary water has nine stable isotopologues, from H₂¹⁶O to D₂¹⁸O.' },
    { term: 'Isotope effect', also: ['kinetic isotope effect', 'zero-point energy'], def: 'A change in a physical or chemical property when an atom is replaced by a heavier isotope; the heavier atom vibrates more slowly and sits lower in its energy well, so bonds to it are stronger and reactions that break them slower.' }
  ],
  formulas: [
    { name: 'Density from molar mass and molar volume', expr: 'rho = M/Vm', tex: '\\rho = \\frac{M}{V_m}',
      vars: { rho: { name: 'density', q: 'density', unit: 'kg/m³', tex: '\\rho' }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 20.028, hint: '20.028 g/mol for D₂O, 18.015 for H₂O.' }, Vm: { name: 'molar volume', q: 'molarvolume', unit: 'cm³/mol', value: 18.134, tex: 'V_m', hint: '18.13 cm³/mol for D₂O and 18.07 for H₂O at 25 °C: nearly the same room per molecule.' } },
      solveFor: 'rho', note: 'Heavy water is denser than light water almost entirely because its molecules are heavier: the molar volumes differ by 0.4 %.',
      stories: { rho: 'D₂O has molar mass {M} and occupies {Vm} per mole at 25 °C. What is its density?', Vm: 'A liquid of molar mass {M} has density {rho}. What is its molar volume?' } },
    { name: 'Fraction of molecules that are semi-heavy', expr: 'f = 2*R/(1 + R)^2', tex: 'f = \\frac{2R}{\\left(1 + R\\right)^2}',
      vars: { f: { name: 'fraction of molecules with exactly one D', hint: 'About 3.1 × 10⁻⁴ in ocean water: one in 3,200.' }, R: { name: 'D/H ratio', value: 1.5576e-4, hint: 'Ocean water (VSMOW) 1.5576 × 10⁻⁴; Antarctic snow and Jupiter-family comets differ by tens of per cent.' } },
      solveFor: 'f', note: 'Assumes the deuterium atoms are distributed at random over the hydrogens, which is a good approximation for natural water. The fraction of D₂O is R²/(1+R)².',
      stories: { f: 'Water has a deuterium-to-hydrogen ratio of {R}. What fraction of its molecules has exactly one deuterium?' } },
    { name: 'Tritium left after a time', expr: 'frac = 2^(-t/T)', tex: 'x_{\\mathrm{T}} = 2^{-t/T_{1/2}}',
      vars: { frac: { name: 'fraction still tritium', q: 'ratio', unit: '%', tex: 'x_{\\mathrm{T}}' }, t: { name: 'time elapsed', q: 'time', unit: 'yr', value: 63 }, T: { name: 'half-life', q: 'time', unit: 'yr', value: 12.32, tex: 'T_{1/2}', hint: '12.32 years for tritium.' } },
      solveFor: 'frac', note: 'Radioactive decay. The rain that fell at the peak of the nuclear-test era in 1963 has kept only about 3 % of its bomb tritium by 2026.',
      stories: { frac: 'Tritium with half-life {T} has decayed for {t}. What fraction of it remains?', t: 'Only {frac} of a sample of tritium is left. How long ago was it fresh? (half-life {T})' } }
  ],
  examples: [
    { title: 'A cube of heavy ice in a glass of water', q: 'A cube of D₂O ice (1017 kg/m³ at 0 °C) is dropped into ordinary water at 1 °C (999.9 kg/m³). Does it float? What if it is dropped into heavy water at 5 °C (1104.8 kg/m³)?',
      steps: ['In ordinary water: the ice\'s density exceeds the water\'s, 1017 > 999.9, so it sinks.', { text: 'In heavy water, the submerged fraction:', tex: 'f = \\frac{1017}{1104.8} = 0.92' }, 'It floats with 92 % under, just as ordinary ice does in ordinary water (91.7 %).'],
      a: 'Sinks in ordinary water; floats 92 % submerged in heavy water. For a fair comparison, heavy ice in heavy water behaves exactly like ordinary ice in water.' },
    { title: 'How much heavy water is in a glass?', q: 'A glass of water holds $8.3 \\times 10^{24}$ molecules. Estimate how many are HDO and how many are D₂O, given D/H = $1.5576\\times10^{-4}$.',
      steps: [{ text: 'Fraction of hydrogens that are deuterium:', tex: 'x = \\frac{R}{1+R} = 1.5574\\times10^{-4}' }, { text: 'HDO: two chances for one deuterium; D₂O: both:', tex: 'f_{HDO} \\approx 2x = 3.11\\times10^{-4}, \\quad f_{D_2O} = x^2 = 2.43\\times10^{-8}' }, 'Times $8.3\\times10^{24}$: $2.6 \\times 10^{21}$ HDO and $2.0 \\times 10^{17}$ D₂O.'],
      a: 'About $2.6\\times10^{21}$ semi-heavy and $2\\times10^{17}$ fully heavy molecules in a glass: rare, but not a handful.' }
  ],
  quiz: [
    { q: 'A cube of ordinary ice and a cube of heavy ice are dropped into ordinary cold water. The result is', choices: ['both float', 'both sink', 'ordinary ice floats, heavy ice sinks', 'heavy ice floats, ordinary ice sinks'], a: 2, why: 'Ordinary ice (916.7 kg/m³) is lighter than water; heavy ice (about 1017) is heavier than ordinary liquid water (about 1000).' },
    { q: 'Compared with H₂O, the temperature of maximum density of D₂O is', choices: ['lower, 0 °C', 'the same, 3.98 °C', 'higher, 11.2 °C', 'there is no maximum'], a: 2, why: 'Deuterium strengthens the hydrogen bonds a little, shifting the whole density curve up by about 7 K. The maximum is at 11.2 °C.' },
    { q: 'Heavy water is radioactive.', a: false, why: 'Deuterium is a stable isotope. The radioactive isotope of hydrogen is tritium.' },
    { q: 'Heavy water tastes sweet to people because', choices: ['it contains sugar', 'it activates the sweet receptor T1R2/T1R3', 'it is denser', 'of dissolved metals'], a: 1, why: 'Ben Abu and colleagues showed in 2021 that blocking the receptor with lactisole removed the sweetness, and that cell lines expressing the human receptor respond to D₂O.' },
    { q: 'About how many years does it take for tritium (half-life 12.3 years) to fall to one-eighth?', answer: 37, why: 'One-eighth is three half-lives: 3 × 12.3 = 37 years.' }
  ],
  applications: ['CANDU nuclear reactors use heavy water as moderator and coolant, running on unenriched natural uranium.', 'Ice cores: the ratio of heavy to light water in Antarctic and Greenland ice records the temperature of past snowfall over hundreds of thousands of years.', 'Doubly labelled water is the standard way to measure the daily energy expenditure of free-living people and animals.', 'NMR spectroscopy of proteins and drugs is done in D₂O so that the solvent does not swamp the signals.'],
  history: 'Harold Urey discovered deuterium in 1931, by looking at the spectrum of the residue left after evaporating liquid hydrogen (Urey, Brickwedde and Murphy, 1932), and received the Nobel Prize in 1934. G. N. Lewis prepared nearly pure heavy water in 1933. Heavy water production plants, notably at Vemork in Norway, became strategic targets in the Second World War, when a heavy-water moderator seemed the likeliest route to a German reactor.',
  sources: ['USGS Water Science School, "Water density" — heavy-water ice is denser than ordinary water and sinks in it (source 3 of the film).', 'Ben Abu, Jungwirth, Niv and colleagues, "The sweet taste of heavy water", *Communications Biology* (2021) — T1R2/T1R3 and D₂O (Hebrew University, 6 May 2021; source 11).', 'CRC *Handbook of Chemistry and Physics*: properties of H₂O and D₂O; Kell, "Density, thermal expansivity, and compressibility of liquid water from 0° to 150 °C", *Journal of Chemical and Engineering Data* 20, 97 (1975) for the light-water density.', 'Urey, Brickwedde and Murphy, "A hydrogen isotope of mass 2 and its concentration", *Physical Review* 40, 1 (1932); Altwegg et al., *Science* 347, 1261952 (2015) for the D/H ratio of comet 67P.'],
  sim: 'om-heavy-water'
},

/* ================================================================ water in numbers */
{
  id: 'water-in-numbers', parent: 'one-molecule', title: 'Water in numbers', level: 1,
  short: 'A gram of water holds 3.34 × 10²² molecules, a drop 1.7 × 10²¹, a glass 8 × 10²⁴ and the oceans 5 × 10⁴⁶. Each is 2.75 Å across and weighs 3 × 10⁻²⁶ kg; as vapour it flies at 590 m/s, and in the liquid it takes a few milliseconds to wander across a cell.',
  keywords: ['molecules per gram', 'drop of water', 'orders of magnitude', 'molar volume', 'Avogadro', 'size of a molecule', 'mean speed', 'diffusion', 'number density', 'how many molecules in a glass', 'counting molecules', 'scale'],
  prereq: ['what-water-is'],
  related: ['the-structure-of-liquid-water', 'bonds-that-flicker', 'how-much-water-earth-has', 'how-much-water-we-are', 'chemistry:molarity', 'physics:kinetic-theory'],
  body: `
The numbers of chemistry are so far from everyday experience that it helps to put them next to each other. Water is a good subject for it, since it is the only chemical most people have handled by the bucket.

### How many?
One gram of water is $\\tfrac{1}{18.015}$ of a mole: **$3.34 \\times 10^{22}$ molecules**. From that:

| Amount | Molecules | Comment |
|---|---|---|
| one gram (about 1 mL) | $3.3 \\times 10^{22}$ | |
| a drop, 0.05 mL | $1.7 \\times 10^{21}$ | 12 million molecules along each edge of the cube |
| a teaspoon, 5 mL | $1.7 \\times 10^{23}$ | |
| a glass, 250 mL | $8.3 \\times 10^{24}$ | |
| a litre | $3.33 \\times 10^{25}$ | 33.3 molecules in every cubic nanometre |
| an adult's body water, about 40 kg | $1.3 \\times 10^{27}$ | |
| a cloud droplet 10 µm across | $1.7 \\times 10^{13}$ | |
| all the oceans | $4.6 \\times 10^{46}$ | 1.37 × 10²¹ kg |

If you counted the molecules of a single drop at a billion a second, you would be at it for 53,000 years. A drop holds hundreds of times more molecules than there are grains of sand on all the beaches of the Earth (a few $10^{18}$ by the usual estimates), and a glass holds more than there are stars in the observable universe by a similar estimate ($10^{22}$ to $10^{24}$).

### How big?
A liquid's size is measured by its molar volume. At 25 °C, 18.015 g of water occupies **18.07 cm³**, so each molecule has 30.0 Å³, a cube 3.1 Å on a side. The molecule itself is about 2.75 Å across and weighs $2.99 \\times 10^{-26}$ kg: a quarter of a nanometre, a few hundred times smaller than the smallest virus. In ice the oxygen atoms of neighbouring molecules are 2.76 Å apart; in the liquid, about 2.8 Å.

### How fast?
In steam at 25 °C a molecule's mean speed is

$$\\bar v = \\sqrt{\\frac{8RT}{\\pi M}} = 592\\ \\mathrm{m/s} \\approx 2{,}100\\ \\mathrm{km/h}$$

It does not get far: at atmospheric pressure it collides every tenth of a micrometre. In the liquid there is no straight flight at all. A molecule wanders by random hops; its self-diffusion coefficient is $2.3 \\times 10^{-9}$ m²/s at 25 °C, so that in one second it moves a root-mean-square distance $\\sqrt{6Dt} = 0.12$ mm, and takes about 7 ms to wander across a living cell 10 µm wide. Within a picosecond, in which it has not travelled even an ångström, it has changed hydrogen-bond partners ([[bonds-that-flicker]]).

### How often?
A hydrogen bond lasts about 1.2 ps, so in a glass of water about $10^{37}$ bonds break and re-form every second. There are $10^{25}$ molecules in a glass and every one changes neighbours $10^{12}$ times a second.

### What the numbers say together
The scale is the argument. Because there are so many molecules, the averages are as exact as the laws of physics: a glass of water at 20 °C has the same temperature, density and heat capacity every time. Because each molecule is so small and so close to its neighbours, the forces between them are felt at once by thirty or forty others. And because the bonds are so brief, the liquid is in constant, microscopic reconstruction at the scale of a picosecond and a nanometre. All of it follows from one molecule, 18 u, bent and polar.

> [!key] A glass of water is 8 × 10²⁴ molecules, each 2.75 Å across and almost touching its neighbours. In steam they fly at 590 m/s; in the liquid they hop between bond partners every picosecond and take milliseconds to cross a cell. The sheer number is why water's averages are so exact.`,
  ideas: ['One gram of water holds 3.34 × 10²² molecules; 18.07 cm³ holds a mole; a litre holds 3.33 × 10²⁵.', 'Each molecule has 30 Å³ (a 3.1 Å cube) in the liquid and weighs 3 × 10⁻²⁶ kg.', 'As vapour at 25 °C the mean speed is 592 m/s; in the liquid a molecule diffuses 0.12 mm in a second.', 'A drop (0.05 mL) holds 1.7 × 10²¹ molecules: counting them at 10⁹ a second would take 53,000 years.'],
  pitfalls: ['"Water is mostly empty space, like everything else" — Liquid water is a crowd, with each molecule 3.1 Å from its neighbours; the emptiness belongs to atoms, not to the liquid.', '"A water molecule moves at 600 m/s, so it crosses a room in no time" — That is the speed between collisions in vapour. In a room a molecule diffuses through air very slowly because it collides ten billion times a second; in the liquid it hops.', '"These numbers are only estimates" — The molecular numbers follow from the molar mass and Avogadro\'s constant, which is defined exactly; the macroscopic counts (a drop, a cloud droplet) are only as accurate as their volumes.'],
  terms: [
    { term: 'Number density', also: ['molecules per unit volume'], def: 'The number of molecules in a unit volume. Liquid water: 3.33 × 10²⁸ per m³, 33.3 per nm³, about 3.34 × 10²² per cm³.' },
    { term: 'Molar volume', also: ['volume of a mole'], def: 'The volume of one mole of a substance: 18.07 cm³/mol for liquid water at 25 °C (the molar mass divided by the density). For an ideal gas at 0 °C and 1 atm it is 22.4 L/mol.' },
    { term: 'Mean molecular speed', also: ['thermal speed', 'mean speed'], def: 'The average speed of the molecules of a gas, √(8RT/πM): 592 m/s for water vapour at 25 °C. The root-mean-square speed, √(3RT/M), is a little larger, 643 m/s.' },
    { term: 'Self-diffusion coefficient', also: ['D', 'diffusivity'], def: 'A measure of how fast molecules of a liquid wander among themselves: the mean square displacement in three dimensions is 6Dt. For water 2.3 × 10⁻⁹ m²/s at 25 °C.' },
    { term: 'Order of magnitude', also: ['power of ten'], def: 'The size of a number expressed as the nearest power of ten. A drop of water has 10²¹ molecules, the oceans 10⁴⁷: 26 orders of magnitude apart.' }
  ],
  formulas: [
    { name: 'Molecules in a volume of water', expr: 'N = rho*V*NA/M', tex: 'N = \\frac{\\rho\\,V\\,N_A}{M}',
      vars: { N: { name: 'number of molecules', q: 'count' }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 997, tex: '\\rho' }, V: { name: 'volume', q: 'volume', unit: 'mL', value: 0.05 }, NA: { const: 'NA' }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 } },
      solveFor: 'N', note: 'A drop of 0.05 mL is the usual medical-dropper size; a drop from a tap is 5–10 times larger.',
      stories: { N: 'A drop of {V} of water of density {rho} falls from a dropper. How many molecules does it hold?', V: 'A sample of {N} water molecules is held in a drop. What is its volume?' } },
    { name: 'Mean speed of molecules in a gas', expr: 'v = sqrt(8*R*T/(pi*M))', tex: '\\bar v = \\sqrt{\\frac{8RT}{\\pi M}}',
      vars: { v: { name: 'mean speed', q: 'speed', unit: 'm/s', tex: '\\bar v' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -50 }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 } },
      solveFor: 'v', note: 'For vapour (and, with the same molar mass, for the speed of a molecule between collisions in humid air). Heavier D₂O vapour is slower by √(18/20) = 0.95.',
      stories: { v: 'Water vapour at {T} has molar mass {M}. What is the mean speed of its molecules?', T: 'The molecules of a vapour of molar mass {M} have a mean speed of {v}. What is the temperature?' } },
    { name: 'Time to wander across a cell', expr: 't = L^2/(6*D)', tex: 't = \\frac{L^2}{6D}',
      vars: { t: { name: 'time', q: 'time', unit: 'ms' }, L: { name: 'distance', q: 'length', unit: 'µm', value: 10 }, D: { name: 'self-diffusion coefficient (m²/s)', value: 2.3e-9, hint: '2.3 × 10⁻⁹ m²/s for water at 25 °C; inside a cell, the water near proteins moves two to ten times slower.' } },
      solveFor: 't', note: 'In three dimensions the mean squared distance is 6Dt, so this is the time for the typical molecule to have gone L. It is a statement about the typical molecule, not a guarantee for any one.',
      stories: { t: 'A water molecule diffuses with D = {D}. How long does it typically take to drift {L}?', L: 'In {t} a water molecule with D = {D} wanders a typical distance of what?' } },
    { name: 'Time to count the molecules', expr: 't = N/r', tex: 't = \\frac{N}{r}',
      vars: { t: { name: 'time', q: 'time', unit: 'yr' }, N: { name: 'molecules to count', q: 'count', value: 1.67e21 }, r: { name: 'counting rate (per second)', value: 1e9 } },
      solveFor: 't', note: 'A billion a second is faster than any human, slower than a fast computer. The universe is 1.4 × 10¹⁰ years old.',
      stories: { t: 'You count {N} molecules at {r}. How long does it take?' } }
  ],
  examples: [
    { title: 'A cloud droplet', q: 'A cloud droplet is a sphere of water 10 µm across. How many molecules does it hold, and how many along its diameter?',
      steps: ['Volume: $\\tfrac{4}{3}\\pi (5\\times10^{-6})^3 = 5.24 \\times 10^{-16}$ m³; mass $= 997 \\times 5.24\\times10^{-16} = 5.2\\times10^{-13}$ kg.', { text: 'Molecules:', tex: 'N = \\frac{5.2\\times10^{-10}\\ \\mathrm{g}}{18.015\\ \\mathrm{g/mol}} \\times 6.022\\times10^{23} = 1.7\\times10^{13}' }, 'Along the diameter: $10\\ \\mu\\mathrm{m} / 0.31\\ \\mathrm{nm} \\approx 32{,}000$ molecules.'],
      a: 'About $1.7 \\times 10^{13}$ molecules, 32,000 across: even the smallest cloud droplet is a large crowd. About a hundred million such droplets would fit in a drop of 0.05 mL.' },
    { title: 'How far does a molecule drift in a minute?', q: 'Water diffuses with D = 2.3 × 10⁻⁹ m²/s. How far does a molecule typically get in one minute, in a still glass?',
      steps: [{ text: 'In three dimensions:', tex: '\\sqrt{6Dt} = \\sqrt{6 \\times 2.3\\times10^{-9} \\times 60} = 9.1\\times10^{-4}\\ \\mathrm{m}' }],
      a: 'About 0.9 mm in a minute. Diffusion is fast over a cell and absurdly slow over a glass, which is why a drop of dye needs stirring or hours to spread through a cup.' }
  ],
  quiz: [
    { q: 'About how many water molecules are in one gram?', choices: ['6 × 10²³', '3 × 10²²', '3 × 10¹⁸', '3 × 10²⁸'], a: 1, why: 'One gram is 1/18 of a mole: 6.02 × 10²³ / 18 = 3.3 × 10²².' },
    { q: 'In the liquid at 25 °C each molecule has a cube of about this edge to itself:', choices: ['0.3 Å', '3.1 Å', '31 Å', '3.1 nm'], a: 1, why: 'The volume per molecule is 18.07 cm³ / 6.022 × 10²³ = 30 Å³, whose cube root is 3.1 Å.' },
    { q: 'The mean speed of a water molecule in vapour at 25 °C is closest to', choices: ['6 m/s', '60 m/s', '600 m/s', '60,000 m/s'], a: 2, why: '√(8RT/πM) = 592 m/s, nearly twice the speed of sound in air (the molecules are light).' },
    { q: 'Liquid water molecules move at 600 m/s, so a dye molecule disperses through a glass in a few seconds.', a: false, why: 'The 600 m/s is for vapour between collisions. In the liquid, molecules move in short random hops; diffusion takes a molecule about a millimetre in a minute.' },
    { q: 'How many molecules (as a power of ten, give just the exponent) are in the oceans, which hold 1.37 × 10²¹ kg?', answer: 46, why: '1.37 × 10²⁴ g / 18.015 × 6.022 × 10²³ = 4.6 × 10⁴⁶: the exponent is 46.' }
  ],
  applications: ['Chemistry and biology start from these conversions: moles to molecules, molarity to molecules per cell, the 55.5 mol/L of pure water.', 'Cell biology: a cell is crowded with water molecules, about 10¹³ in a 10 µm cell, jostling at the rate that sets how fast reactions can find each other.', 'Cloud physics: a droplet 10 µm across holds about 10¹³ molecules, yet the smallest clusters that can survive on their own number only a few tens, which is why clouds need dust and salt grains to start on ([[clouds-rain-and-snow]]).', 'Sizing everything from membranes to nanopores: if a pore is 3 Å wide, one water molecule at a time passes ([[aquaporins]]).'],
  sources: ['CRC *Handbook of Chemistry and Physics*: molar mass, density and viscosity of water; self-diffusion coefficient from Holz, Heil and Sacco, *Physical Chemistry Chemical Physics* 2, 4740 (2000).', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 3.', 'USGS Water Science School — the volume of Earth\'s water, from which the molecule count of the oceans follows.', 'Atkins and de Paula, *Physical Chemistry* — kinetic theory of gases and diffusion.'],
  sim: 'om-numbers'
}
);
