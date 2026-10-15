/* HYPER-WATER · content/hydrogen-bonds.js — the topic "The bond that is barely a bond" (branch The Hydrogen Bond).
 * Seven concepts after the reference page what-a-hydrogen-bond-is (content/reference.js):
 *   two-donors-two-acceptors    why water, alone of the small hydrides, builds a three-dimensional net
 *   the-tetrahedral-network     four neighbours at 109.5°, 3.4–3.7 bonds at 25 °C, a net that percolates
 *   bonds-that-flicker          170 femtoseconds of spring, 1.2 picoseconds of memory
 *   cooperativity               a bonded molecule bonds its next neighbour harder
 *   the-structure-of-liquid-water   g(r), flickering clusters, continuum against mixture, the 2004 chains-and-rings claim
 *   the-proton-hops             autoionisation, the Grotthuss mechanism, Eigen and Zundel
 *   seeing-the-bonds            infrared, Raman, X-ray, neutrons, NMR, 2D-IR: each sees one aspect
 */
Hyper.add(

/* ================================================================ two donors, two acceptors */
{
  id: 'two-donors-two-acceptors', parent: 'hydrogen-bonds', title: 'Two donors, two acceptors', level: 1,
  short: 'A hydrogen bond needs a hydrogen to give and a lone pair to take. Water has two of each, so every molecule can hold four neighbours and the bonds weave a three-dimensional net. Ammonia has three hydrogens but one lone pair, hydrogen fluoride one hydrogen and three lone pairs: both are stuck with chains.',
  keywords: ['donor', 'acceptor', 'hydrogen bond count', 'lone pair', 'ammonia', 'hydrogen fluoride', 'methanol', 'chains', 'net', 'three-dimensional network', 'why water', 'bonds per molecule', 'glycerol', 'Lipinski'],
  prereq: ['what-a-hydrogen-bond-is', 'the-bent-shape'],
  related: ['the-tetrahedral-network', 'the-hydride-ladder', 'the-boiling-point-anomaly', 'polarity-and-the-dipole', 'chemistry:hydrogen-bonding', 'chemistry:vsepr'],
  body: `
Think of each molecule as a person with hands. A hydrogen bond is a handshake in which one hand **gives** (a hydrogen, positively charged enough to be offered) and the other **takes** (a lone pair of electrons on a nitrogen, oxygen or fluorine). A handshake needs one of each. So the number of bonds a molecule can take part in is set by how many hands of each kind it has, and by whichever kind runs out first.

### Counting the hands
| Molecule | Hydrogens to give | Lone pairs to take | Bonds it can make (each counted once) | Boils at |
|---|---|---|---|---|
| methane, $\\ce{CH4}$ | 0 | 0 | 0 | −161.5 °C |
| ammonia, $\\ce{NH3}$ | 3 | 1 | 1 | −33.3 °C |
| hydrogen fluoride, HF | 1 | 3 | 1 | 19.5 °C |
| methanol, $\\ce{CH3OH}$ | 1 | 2 | 1 | 64.7 °C |
| **water, $\\ce{H2O}$** | **2** | **2** | **2** | **100 °C** |

With $N$ molecules there are $N\\,d$ hydrogens on offer and $N\\,a$ lone pairs, and every bond uses one of each, so the most bonds the liquid can hold is $N\\,\\min(d,a)$. Count the *ends* instead (a bond has two) and a water molecule takes part in up to four bonds, two as donor and two as acceptor; an ammonia, hydrogen fluoride or methanol molecule in at most two.

### What the count builds
A molecule with two bond ends passes the bond along: one end to the molecule before, one to the molecule after. The result is a **chain**, or a ring when the chain bites its own tail. Hydrogen fluoride is the textbook case: zigzag chains in the solid, rings of six in the vapour. Methanol makes short chains and rings, which is why it boils at 65 °C — far above methane's −162 °C, yet 35 K below water.

A molecule with four ends cannot make a chain, because every molecule is already connected to four others. The four neighbours sit at the corners of a tetrahedron, and repeated through space that is a **three-dimensional net** — the subject of [[the-tetrahedral-network]]. A molecule that must break three or four bonds to leave the liquid is held far more firmly than one that must break one or two: water gives up 3–4, an ammonia or hydrogen fluoride molecule about two.

### The two lopsided cousins
Ammonia and hydrogen fluoride are the instructive failures, each with lopsided hands. Ammonia has more to give than to take: in the liquid two of every three N–H hydrogens have no lone pair free to receive them. Its bonds are also weaker — about 13 kJ/mol in the dimer against 21 in the water dimer. In the solid the single lone pair accepts several weaker, bent bonds, which is as far as ammonia can stretch its lone pair; it melts at −78 °C and boils at −33 °C. Hydrogen fluoride has hands for a net on one side only: three lone pairs wait for hydrogens that never come, because each molecule has only one. Its bonds are stronger than water's, yet the liquid boils at 19.5 °C.

### More than two
Give a molecule more hands and the liquid thickens at once. Glycerol has three O–H groups and is a net of its own: its viscosity is about 1,400 mPa·s against water's 1.0, its boiling point 290 °C. Hydrogen sulfide has the same count as water, two and two, but sulfur is large and hardly more electronegative than carbon would be; its S–H hydrogens carry little positive charge, the bonds are worth a few kJ/mol and it is a gas. The count is necessary; the polarity has to be there too.

> [!key] A hydrogen bond needs a hydrogen to give and a lone pair to take, and a molecule can make no more bonds than it has of the scarcer kind. Water has exactly two of each, in a tetrahedral arrangement, so it alone among the small hydrides weaves a three-dimensional net.`,
  ideas: [`A molecule's number of bonds is limited by the scarcer of its hydrogens to give and lone pairs to take.`, `Water has two of each: four bond ends per molecule, a tetrahedron of neighbours, a three-dimensional net.`, `Ammonia (3 and 1), hydrogen fluoride (1 and 3) and methanol (1 and 2) can make only two ends per molecule: chains and rings.`, `The count is not enough on its own: hydrogen sulfide has water's count but its bonds are too weak to hold a liquid together.`],
  pitfalls: [`"More hydrogens means more hydrogen bonds" — Ammonia has three hydrogens, water two, yet water bonds twice as much. What counts is the smaller of the hydrogens and the lone pairs.`, `"Hydrogen fluoride makes the strongest hydrogen bonds, so it should boil highest" — Strength is only half the story: with one hydrogen per molecule HF makes chains, and chains cost less to pull apart than a net. It boils 80 K below water.`, `"Hydrogen sulfide is just water with sulfur" — It has the same two-and-two count, but sulfur is too big and too weakly electronegative to make a hydrogen bond worth the name; the bonds are a few kJ/mol and the substance is a gas at room temperature.`],
  terms: [
    { term: 'Donor count', also: ['number of donors', 'hydrogen-bond donors per molecule'], def: `The number of hydrogens on a molecule that are positive enough, because they sit on nitrogen, oxygen or fluorine, to be offered to a neighbour. Water 2, ammonia 3, hydrogen fluoride 1, methanol 1.` },
    { term: 'Acceptor count', also: ['number of acceptors', 'hydrogen-bond acceptors per molecule'], def: `The number of lone pairs on a molecule available to receive a hydrogen. Water 2, ammonia 1, hydrogen fluoride 3, methanol 2.` },
    { term: 'Bond end', also: ['bond site', 'hydrogen-bond functionality'], def: `One side of a hydrogen bond as seen from one molecule: giving a hydrogen is one end, taking one is another. A water molecule has up to four ends; each bond has two, so the liquid holds at most two bonds per molecule.` },
    { term: 'Chain', also: ['hydrogen-bonded chain', 'ring'], def: `A sequence of molecules each bonded to the next, which forms when every molecule has only two bond ends. Hydrogen fluoride, methanol and ammonia build chains and rings; water builds a net.` },
    { term: 'Network', also: ['three-dimensional network', 'hydrogen-bond net'], def: `A pattern of bonds that runs in all three directions, with every molecule joined to four others. Only molecules with four bond ends, balanced two and two, can build it.` }
  ],
  formulas: [
    { name: 'Hydrogen-bond energy per mole of liquid', expr: 'E = b*Eb', tex: 'E = b\\,E_b',
      vars: { E: { name: 'hydrogen-bond energy per mole', q: 'molarenergy', unit: 'kJ/mol', hint: 'Compare with the enthalpy of vaporisation: 40.7 kJ/mol for water at 100 °C, 23.3 for ammonia at its boiling point.' }, b: { name: 'bonds per molecule (each counted once)', value: 1.85, min: 0, max: 2, hint: 'Half the bond ends: about 1.85 for water at 25 °C, about 1 for a chain-forming liquid.' }, Eb: { name: 'energy per bond', q: 'molarenergy', unit: 'kJ/mol', value: 20, hint: 'About 20 kJ/mol for water in the liquid; about 13 for ammonia.' } },
      solveFor: 'E', note: 'Each bond is shared by two molecules, so a net of two bonds per molecule has four ends. The estimate for water lands within 10 % of the heat of vaporisation; for chain-formers it explains only part, the rest being van der Waals attraction.',
      stories: { E: 'A liquid holds {b} hydrogen bonds per molecule of {Eb} each. How much energy per mole is stored in them?', b: 'A liquid stores {E} per mole in hydrogen bonds worth {Eb} each. How many bonds does each molecule hold?' } },
    { name: 'How full the bonding sites are', expr: 'f = n/(2*m)', tex: 'f = \\frac{n}{2\\,m}',
      vars: { f: { name: 'fraction of sites in use', q: 'ratio', unit: '%', hint: 'Water at 25 °C uses about 92 % of its four ends; in ice, 100 %.' }, n: { name: 'bond ends in use per molecule', value: 3.7, min: 0, hint: 'Counted from the molecule\'s own point of view: giving and taking both count.' }, m: { name: 'the smaller of donors and acceptors', value: 2, int: true, min: 1, max: 3, hint: 'min(d, a): 2 for water, 1 for ammonia, hydrogen fluoride and methanol.' } },
      solveFor: 'f', note: 'The ends available per molecule are 2m; the fraction used shows how nearly the liquid achieves its pattern.',
      stories: { f: 'A molecule can make {m} bonds but holds {n} bond ends. What fraction of its sites are in use?' } }
  ],
  examples: [
    { title: 'Counting the bonds of a glass of methanol and a glass of water', q: 'A litre of each liquid holds about the same number of molecules per mole. How many hydrogen bonds per molecule can methanol hold at most, and water?',
      steps: ['Methanol, $\\ce{CH3OH}$, has one O–H (one hydrogen to give) and two lone pairs on the oxygen (two to take). The smaller count is 1.', 'Water has two hydrogens and two lone pairs: the smaller count is 2.', 'So methanol can hold one bond per molecule at most — a chain — and water two, a net. In bond ends that is 2 against 4.'],
      a: 'Methanol 1, water 2 (bonds per molecule, each counted once). That is why methanol boils at 65 °C and water at 100 °C although the two molecules weigh about the same.' },
    { title: 'Ammonia against water: is the hydrogen-bond estimate enough?', q: 'Estimate the heat of vaporisation of liquid ammonia from its bonds, taking one bond per molecule worth 13 kJ/mol, and compare with the measured 23.3 kJ/mol.',
      steps: [{ text: 'One bond per molecule, each counted once:', tex: 'E \\approx b\\,E_b = 1 \\times 13 = 13\\ \\mathrm{kJ/mol}' }, 'The measured 23.3 kJ/mol is nearly twice that: the rest is van der Waals attraction between the molecules and the weaker bent bonds of the lone pair\'s extra neighbours.', 'For water the same estimate, $1.85 \\times 20 = 37$ kJ/mol, accounts for nine-tenths of the measured 40.7.'],
      a: 'About 13 of ammonia\'s 23 kJ/mol (55 %), against about 37 of water\'s 41 kJ/mol (91 %): in water the hydrogen bonds are nearly the whole story.' }
  ],
  quiz: [
    { q: 'Which molecule has more hydrogens to give than lone pairs to take?', choices: ['Water', 'Ammonia', 'Hydrogen fluoride', 'Methanol'], a: 1, why: 'Ammonia has three N–H hydrogens and one lone pair on the nitrogen. Water is 2 and 2, hydrogen fluoride 1 and 3, methanol 1 and 2.' },
    { q: 'How many hydrogen bonds can one hydrogen fluoride molecule make, counting each bond once?', answer: 1, why: 'It has one hydrogen to give and three lone pairs to take, and a bond needs one of each, so the scarcer kind, one, sets the limit. Each molecule is linked to the next in a chain.' },
    { q: 'Hydrogen fluoride makes stronger hydrogen bonds than water, so it must boil at a higher temperature.', a: false, why: 'It boils at 19.5 °C against 100 °C. Its single hydrogen limits it to chains and rings; water\'s bonds run in all three directions, so a water molecule has to break three or four of them to leave the liquid, a hydrogen fluoride molecule only two.' },
    { q: 'Methanol boils far above methane but well below water. Which statement explains both gaps?', choices: ['Methanol is heavier than methane and lighter than water', 'Methanol makes hydrogen bonds, but only chains: one per molecule instead of two', 'Methanol has no hydrogen bonds but strong van der Waals forces', 'Methanol molecules are larger than water molecules'], a: 1, why: 'Methane has no hydrogen bonds at all. Methanol has one O–H and so one bond per molecule, a chain. Water has two O–H bonds and a net.' },
    { q: 'Hydrogen sulfide has two hydrogens and two lone pairs, like water. Why is it a gas at room temperature?', choices: ['Sulfur has no lone pairs', 'Its molecule is lighter than water', 'Sulfur is large and weakly electronegative, so the S–H hydrogens are barely positive and the bonds are very weak', 'It forms chains instead of a net'], a: 2, why: 'The count is right; the charge is not. A hydrogen bond needs a strongly polar donor group, which means N–H, O–H or F–H.' }
  ],
  applications: [`DNA: adenine pairs with thymine through two hydrogen bonds and guanine with cytosine through three — a donor in one base is matched to an acceptor in the other, exactly as the counting predicts.`, `Drug design: Lipinski's "rule of five" (1997) asks that an orally active drug carry no more than five hydrogen-bond donors and ten acceptors, because a molecule with too many hands holds on to water and cannot cross a cell membrane.`, `Alcohols and sugars dissolve in water, oils do not: a molecule with an O–H group has hands to offer the water net, an alkane has none.`, `Proteins: each peptide link has one N–H to give and a C=O with two lone pairs to take; the patterns of these bonds give the helices and sheets of every protein.`],
  history: `The octet-and-lone-pair picture that makes the counting possible is G. N. Lewis's; Latimer and Rodebush used it in 1920 to explain why water is more associated than its look-alikes, and Pauling's *The Nature of the Chemical Bond* (1939) drew out the geometry of the water net.`,
  sources: [`Eisenberg and Kauzmann, *The Structure and Properties of Water* (Oxford, 1969), the chapters on the water molecule and the hydrogen bond.`, `Pauling, *The Nature of the Chemical Bond*, the chapter on the hydrogen bond.`, `CRC *Handbook of Chemistry and Physics*: boiling points and enthalpies of vaporisation of water, ammonia, hydrogen fluoride, methanol, glycerol.`, `Lipinski, Lombardo, Dominy and Feeney, "Experimental and computational approaches to estimate solubility and permeability in drug discovery and development settings", *Advanced Drug Delivery Reviews* (1997).`],
  sim: 'hb-donors-acceptors'
},

/* ================================================================ the tetrahedral network */
{
  id: 'the-tetrahedral-network', parent: 'hydrogen-bonds', title: 'The tetrahedral network', level: 2,
  short: 'Each water molecule sits at the centre of a tetrahedron of four neighbours 2.8 Å away. In ice all four are bonded; in the liquid at 25 °C the average is 3.4–3.7, and the net still spans the whole glass.',
  keywords: ['tetrahedral', 'tetrahedron', '109.5', 'coordination number', 'nearest neighbours', 'network', 'percolation', 'ring', 'second shell', 'four-coordinated', 'diamond lattice', 'open structure', 'hydrogen-bond network'],
  prereq: ['what-a-hydrogen-bond-is', 'two-donors-two-acceptors'],
  related: ['why-ice-floats', 'the-structure-of-liquid-water', 'cooperativity', 'bonds-that-flicker', 'ice-ih-and-ice-ic', 'the-ice-rules', 'chemistry:crystal-structures'],
  body: `
A water molecule has two hydrogens to give and two lone pairs to take (see [[two-donors-two-acceptors]]), and the four are arranged almost exactly as the corners of a tetrahedron: the two O–H bonds at 104.5° from each other, and the two lone pairs squeezed into the remaining directions. A neighbour can therefore be bonded in each of four directions, 109.5° apart — the angle whose cosine is $-1/3$ — at a distance of 2.8 Å from oxygen to oxygen. Let every neighbour do the same and the pattern continues without end. This is the **tetrahedral network**.

### Ice: the perfect case
In ice Ih every molecule has exactly four bonded neighbours at 2.76 Å. The oxygens sit at the nodes of the diamond pattern (in ice Ih, its hexagonal cousin lonsdaleite) with a hydrogen on every edge, and it is a very open structure: there are only 4 nearest neighbours where a close-packed arrangement of spheres has 12, and the density is 916.7 kg/m³ at 0 °C. The 12 *second* neighbours of each molecule sit at a distance fixed by the angle: with the angle $\\theta$ between bonds and the first distance $d_1$,
$$d_2 = 2\\,d_1 \\sin\\frac{\\theta}{2} = d_1\\sqrt{8/3} \\approx 1.63\\,d_1,$$
which is 4.5 Å for ice. This is the signature of tetrahedral order: a loosely packed liquid of ordinary molecules would put its second shell at about twice the first distance.

### The liquid: a net with holes in it
Melt the ice and the net does not vanish, it frays. At 25 °C a molecule has on average about **4.4 nearest neighbours** within 3.4 Å — one more than ice would allow — of which **3.4 to 3.7 are bonded** (the number depends on how a bond is defined, geometrically or energetically). At 0 °C it is nearly 3.9; at 100 °C about 3.1. The extra non-bonded neighbour is the one that squeezes into the holes of the open structure and makes the liquid 9 % denser than the ice.

| | Ice Ih at 0 °C | Water at 25 °C | Water at 100 °C |
|---|---|---|---|
| nearest neighbours | 4 | about 4.4 | about 4.5 |
| bonded neighbours | 4 | 3.7 | 3.1 |
| fraction of the four sites used | 100 % | 92 % | 77 % |
| volume per molecule | 32.6 Å³ | 30.0 Å³ | 31.2 Å³ |

The angles are no longer exact either: neighbours scatter by tens of degrees around the tetrahedral value, and the rings of bonded molecules, which are all six-membered in ice, run from four to eight members in the liquid, five and six being commonest.

### A net that never falls apart
Does a liquid held together by bonds that break every picosecond count as a connected net at all? Percolation theory gives the test. Take a lattice of the diamond type and let each bond be present with probability $p$. Below a critical value, $p_c \\approx 0.39$, the bonds form islands; above it, one cluster runs from one end of the sample to the other. A water molecule that uses only 1.56 of its four sites would be at the threshold, and the liquid uses 3.7 (92 %) at room temperature and still 3.1 (77 %) at the boiling point. Water is deep inside the connected side at every temperature at which it is a liquid, which is why a drop behaves as one object, a solvent for the whole of its volume, and why heating it breaks its pattern gradually and never in one catastrophe.

> [!key] Each water molecule has four hydrogen-bond sites at the corners of a tetrahedron, 109.5° apart and 2.8 Å from the neighbours. Ice uses all four; the liquid uses 3.4–3.7 and keeps one extra non-bonded neighbour, but the net remains connected throughout the liquid range.`,
  ideas: [`Two O–H bonds and two lone pairs point towards the corners of a tetrahedron; neighbours bond along all four, 109.5° apart at 2.8 Å.`, `Ice uses all four sites; the liquid at 25 °C uses 3.4–3.7 and has about 4.4 nearest neighbours in all.`, `The second shell of 12 sits at about 1.63 times the first distance — 4.5 Å — which is where liquid water has its second peak.`, `The net percolates: bonds need only exceed about 39 % of the possible ones to form a connected cluster, and water keeps 77–92 %.`],
  pitfalls: [`"Liquid water is made of tetrahedral clusters of five molecules" — The tetrahedron is a local geometry, not a unit; each molecule is a corner of several, and bonds link them into a continuous net.`, `"Every molecule in liquid water has four hydrogen bonds" — That is ice. In the liquid the average is 3.4–3.7 at 25 °C, with molecules of two, three, four and (briefly) five bonds all present.`, `"The number of bonds is a fact you can look up" — It depends on the definition: a distance-and-angle cut-off in a simulation, an energy threshold or a spectral signature each give a slightly different average. The 3.4–3.7 range comes from that spread, not from sloppy measurement.`],
  terms: [
    { term: 'Tetrahedral angle', also: ['109.47°', 'tetrahedral geometry'], def: `The angle between lines from the centre of a regular tetrahedron to two corners, $\\arccos(-1/3) = 109.47°$. The angle at which four bonds are farthest from one another.` },
    { term: 'Coordination number', also: ['nearest neighbours', 'number of neighbours', 'first-shell count'], def: `The number of molecules in the first shell around a given molecule: 4 in ice Ih, about 4.4 in water at 25 °C (to the first minimum of g(r) at 3.3–3.4 Å), 12 in a close-packed solid.` },
    { term: 'Second shell', also: ['second neighbours', 'second coordination shell'], def: `The molecules that are neighbours of the nearest neighbours: 12 in ice at 4.5 Å. In the liquid they produce the second maximum of the pair distribution function near 4.5 Å.` },
    { term: 'Percolation threshold', also: ['critical bond fraction', 'p_c'], def: `The fraction of bonds present in a lattice above which a single connected cluster spans the whole sample. About 0.39 for the diamond lattice, which is the bond pattern of ice; water at 25 °C has 0.92.` },
    { term: 'Hydrogen-bond ring', also: ['ring size', 'ring statistics'], def: `A closed loop of hydrogen-bonded molecules. Ice contains only rings of six; liquid water has rings of four to eight, with five and six the most common.` }
  ],
  formulas: [
    { name: 'Second-neighbour distance from the angle', expr: 'd2 = 2*d1*sin(theta/2)', tex: 'd_2 = 2\\,d_1 \\sin\\frac{\\theta}{2}',
      vars: { d2: { name: 'second-neighbour distance', q: 'length', unit: 'pm', tex: 'd_2', hint: 'The distance between two molecules that are both bonded to a third.' }, d1: { name: 'bond length (O–O)', q: 'length', unit: 'pm', value: 280, tex: 'd_1', hint: '276 pm in ice Ih, about 280 pm in the liquid.' }, theta: { name: 'angle between the two bonds', q: 'angle', unit: '°', value: 109.47, min: 0, max: 180, tex: '\\theta', hint: '109.47° for a perfect tetrahedron; 90° would be a square, 120° a flat triangle.' } },
      solveFor: 'd2', note: 'Isosceles-triangle geometry. For a perfect tetrahedron the ratio $d_2/d_1$ is $\\sqrt{8/3} = 1.633$.',
      stories: { d2: 'Two molecules are each bonded to a third at {d1}, with {theta} between the bonds. How far apart are they?', theta: 'Two molecules bonded to a third at {d1} are {d2} apart. What angle is between the two bonds?' } },
    { name: 'Volume per molecule and the mean spacing', expr: 'a = cbrt(M/(rho*NA))', tex: 'a = \\sqrt[3]{\\frac{M}{\\rho\\,N_A}}',
      vars: { a: { name: 'mean spacing (cube root of the volume per molecule)', q: 'length', unit: 'Å' }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 997.05, tex: '\\rho', hint: '997.05 kg/m³ at 25 °C, 999.84 at 0 °C, 958.4 at 100 °C.' }, NA: { const: 'NA' } },
      solveFor: 'a', note: 'The spacing of the molecules if they sat on a cubic lattice: 3.1 Å for water at 25 °C. Compare it with the 2.8 Å of a hydrogen bond — nearly the same, which is why the net has so few holes to spare.',
      stories: { a: 'A liquid of molar mass {M} has density {rho}. What is the cube root of the volume per molecule?' } },
    { name: 'Bonds per molecule from the fraction present', expr: 'n = 4*p', tex: 'n = 4\\,p',
      vars: { n: { name: 'bonds per molecule (bond ends)', hint: 'Compare with the 3.7 of water at 25 °C.' }, p: { name: 'fraction of the possible bonds present', q: 'ratio', unit: '%', value: 92, min: 0, max: 100, hint: 'The critical value for a connected net is about 39 %.' } },
      solveFor: 'n', note: 'The critical fraction 0.39 corresponds to 1.56 bonds per molecule: far fewer than the liquid has at any temperature.',
      stories: { n: 'In a tetrahedral net {p} of the bonds are present. How many bonds does each molecule hold?', p: 'Each molecule holds {n} bonds out of a possible four. What fraction of bonds is present?' } }
  ],
  examples: [
    { title: 'The second shell of ice', q: 'Ice Ih has bonded O–O distances of 2.76 Å. Where should the second neighbours be, if the bonds are tetrahedral?',
      steps: [{ text: 'Two bonds from one molecule make an angle of 109.47°; the second neighbours are at the free corners of the isosceles triangle:', tex: 'd_2 = 2 \\times 2.76 \\times \\sin 54.74° = 2 \\times 2.76 \\times 0.8165' }, 'That is 4.51 Å, the observed second-neighbour distance in ice (4.5 Å).', 'In the liquid the same two molecules are at the tetrahedral distance only if both bonds are intact and straight, so the peak is lower and wider — but it sits at the same place, near 4.5 Å.'],
      a: 'About 4.5 Å: a ratio of 1.63 to the first distance, the mark of tetrahedral bonding.' },
    { title: 'How much bonding could the liquid lose?', q: 'Water at 100 °C has about 3.1 bonds per molecule. How far is that from the threshold at which the net would lose its connectivity?',
      steps: ['The fraction of sites in use: $3.1/4 = 0.78$.', 'The threshold for a diamond-type net: $p_c \\approx 0.39$, i.e. $4 \\times 0.39 = 1.56$ bonds per molecule.', 'The margin: the liquid at 100 °C would have to lose half of its remaining bonds before the net breaks.'],
      a: 'The net at 100 °C is at twice its threshold: still one connected piece, which is why boiling needs the energy to cut about three bonds\' worth per molecule, not just a few.' }
  ],
  quiz: [
    { q: 'What is the angle between two bonds in a perfect tetrahedral network?', choices: ['90°', '104.5°', '109.5°', '120°'], a: 2, why: 'The tetrahedral angle $\\arccos(-1/3)$ is 109.47°. The 104.5° is the H–O–H angle inside the molecule, squeezed from 109.5° by the repulsion of the lone pairs.' },
    { q: 'If the first O–O distance is 2.8 Å, how far away, in ångström, are the second neighbours in a perfect tetrahedral net?', answer: 4.57, why: 'The ratio is $\\sqrt{8/3} = 1.633$, so 2.8 × 1.633 = 4.57 Å. The liquid\'s second peak is near 4.5 Å.' },
    { q: 'In liquid water at 25 °C every molecule has four hydrogen bonds.', a: false, why: 'The average is 3.4–3.7. Ice has four, the liquid fewer; molecules with two or three bonds are common at any moment.' },
    { q: 'Why does it matter that the bond fraction in water (0.77–0.92) is far above 0.39?', choices: ['It makes each bond stronger', 'It means the net is connected through the whole sample, so the liquid is one piece', 'It makes the liquid denser than ice', 'It shows that bonds never break'], a: 1, why: 'Above the percolation threshold a single cluster spans the sample. It says nothing about bond strength or lifetime — each bond still breaks about once a picosecond.' },
    { q: 'A liquid of close-packed spheres has 12 nearest neighbours. Compared with it, water\'s 4.4 shows that water is', choices: ['more densely packed', 'a very open structure, held that way by directional bonds', 'a gas-like liquid', 'identical in structure'], a: 1, why: 'Water\'s molecules are held at four directions by hydrogen bonds, leaving open space. That is also why ice is 9 % less dense than the liquid.' }
  ],
  applications: [`Why ice floats: the open tetrahedral lattice is the whole story ([[why-ice-floats]]).`, `Protein surfaces: a folded protein inserts its donors and acceptors into the net, and the net re-forms around it with the missing bonds shifted to the surface waters.`, `Computer models of water: every model from the early ST2 of Stillinger and Rahman (1974) to modern ones is judged by how well it reproduces the tetrahedral order of the second shell.`, `Ice crystallography: the diamond-like oxygen sublattice of ice Ih is why snowflakes are hexagonal.`],
  history: `Bernal and Fowler proposed in 1933 that liquid water is a distorted version of the ice net, the idea that this page develops. Rahman and Stillinger's computer simulation of 1971 gave the first picture of the liquid built from a model, and percolation in the water net was developed by Stanley and Teixeira around 1980.`,
  sources: [`Eisenberg and Kauzmann, *The Structure and Properties of Water* (1969): the structure of ice and of the liquid.`, `Bernal and Fowler, "A theory of water and ionic solution, with particular reference to hydrogen and hydroxyl ions", *Journal of Chemical Physics* 1, 515 (1933).`, `Petrenko and Whitworth, *Physics of Ice* (Oxford, 1999): the structure of ice Ih.`, `Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017).`],
  sim: 'hb-tetrahedral'
},

/* ================================================================ bonds that flicker */
{
  id: 'bonds-that-flicker', parent: 'hydrogen-bonds', title: 'Bonds that flicker', level: 2,
  short: 'A hydrogen bond in liquid water behaves like a spring for about 170 femtoseconds, then the network around it rearranges over about 1.2 picoseconds: each bond is broken and re-made some 10¹² times a second, and the liquid is never the same arrangement twice.',
  keywords: ['bond lifetime', 'picosecond', 'femtosecond', '170 fs', '1.2 ps', 'underdamped', 'Fecko', 'Tokmakoff', 'ultrafast', 'two-dimensional infrared', 'spectral diffusion', 'reorientation', 'jump', 'flickering', 'fluctuations', 'dynamics of water'],
  prereq: ['what-a-hydrogen-bond-is', 'the-tetrahedral-network'],
  related: ['cooperativity', 'seeing-the-bonds', 'the-proton-hops', 'viscosity-of-water', 'feynman:brownian-movement', 'chemistry:arrhenius-equation'],
  body: `
Draw the hydrogen-bond network of a glass of water and you have drawn one frame of a film that runs a million million frames a second. A frame a trillionth of a second later has a different set of dashed lines; a few picoseconds later nothing is left of the pattern you drew. The net is a fact about the *average*, and each of its bonds is a flicker.

### Two times, one bond
Ultrafast infrared spectroscopy follows the O–H stretch of a water molecule, whose frequency tells how strongly the hydrogen is pulled by its neighbour (see [[seeing-the-bonds]]). In 2003 Fecko, Eaves, Loparo, Tokmakoff and Geissler used femtosecond pulses on a single O–H group in heavy water and found two clocks in the same bond.

- **170 femtoseconds.** For the first couple of hundred femtoseconds the hydrogen bond *oscillates*. The two molecules are held 2.8 Å apart by a bond that acts as a soft spring; hit by their neighbours, they rattle against each other at a period of 170 fs, a frequency of 5.9 THz or, as a spectroscopist writes it, 196 cm⁻¹. The motion is underdamped: the bond springs back and forth a few times before the oscillation dies.
- **1.2 picoseconds.** The memory of the bond's strength then fades as the whole neighbourhood rearranges, with a time of about 1.2 ps at 25 °C. This is the collective reorganisation of the network: not a single bond breaking, but the arrangement of the bonds around it changing.

Counted as a rate, 1.2 ps is $1/(1.2\\times10^{-12}\\ \\text{s}) = 8\\times10^{11}$ rearrangements per second for each bond; a millilitre of water, with $6\\times10^{22}$ bonds, rearranges about $5\\times10^{34}$ of them every second.

### How the molecules move
The molecules themselves hardly go anywhere in that time. With a self-diffusion coefficient of $2.3\\times10^{-9}$ m²/s a molecule travels $\\sqrt{6D\\tau}\\approx1.3$ Å in one lifetime — less than half a bond length. So the breakage is not an escape. A bond is typically lost when a neighbour tips out of line, and the same two molecules or their neighbours often re-form it a moment later. Reorientation shows the same thing: Laage and Hynes found in 2006 that a water molecule does not turn smoothly but waits, and then jumps through about 60° in an instant, swapping one hydrogen-bond partner for another that has just come within reach — a jump that takes a fraction of a picosecond once the new partner is there.

### The temperature dependence
Warming speeds the whole film up. With an activation energy of about 10 kJ/mol, half a bond, the lifetime scales as an Arrhenius law:

| Temperature | Bond lifetime | Bonds per molecule |
|---|---|---|
| −20 °C (supercooled) | about 2.5 ps | about 4.0 |
| 0 °C | about 1.7 ps | about 3.9 |
| 25 °C | 1.2 ps | 3.7 |
| 100 °C | about 0.5 ps | 3.1 |

At the boiling point the bonds last about two-fifths as long as at room temperature, and there are about a sixth fewer of them. Both changes are visible in the simulation above: warm the toy network and the strip showing one bond fills with shorter gaps and shorter bars.

### What a flickering bond buys
The flicker is the reason water is a liquid and not a glass: a bond that cannot let go would make a solid. It is also the reason the liquid flows at all, for viscosity is the rate at which bonds break and re-form under shear. And it makes water a perfect partner for biology, since a protein or a membrane lives in a solvent that offers a new hydrogen-bonding partner within a picosecond: any structure that wants a bond finds one almost at once, and any that wants to let one go is not stopped by the water. Chemists call the same thing the *fast exchange* that averages the bonds seen by a slow measurement into a single line.

> [!key] A hydrogen bond in liquid water is a spring for 170 femtoseconds and a memory of about 1.2 picoseconds: broken and re-made roughly 10¹² times a second per bond, yet each molecule moves only 1.3 Å in a lifetime. The flicker is what makes a strongly bonded substance a liquid.`,
  ideas: [`The bond between two water molecules oscillates like a soft spring with a period of 170 fs before it is lost to its surroundings.`, `The pattern of bonds around a molecule is forgotten over about 1.2 ps at 25 °C: roughly 10¹² rearrangements a second for each bond.`, `A molecule moves only about 1.3 Å in a bond lifetime; most breakages are neighbours tipping out of line, not molecules escaping.`, `Warming shortens the lifetime (about 0.5 ps at 100 °C) and also reduces the number of bonds.`],
  pitfalls: [`"A water molecule keeps its partners for 1.2 ps and then gets new ones" — The 1.2 ps is the time over which the *pattern* is forgotten. A particular bond may break and re-form with the same partner within 100–200 fs, and a molecule's neighbours change gradually, not all at once.`, `"If bonds last a picosecond, water is a gas-like blur" — Bonds are numerous (3.7 per molecule), and each break is quickly replaced; at any instant the net is almost complete. The motion is the rearrangement of a connected structure, like a crowd in which everyone keeps changing hands but nobody lets go of everyone at once.`, `"The lifetime is a property of the bond" — It is a property of the neighbourhood: it depends on the temperature, on the pressure and on what else is dissolved, and a bond between the same two molecules in ice lasts for microseconds or longer.`],
  terms: [
    { term: 'Bond lifetime', also: ['hydrogen-bond lifetime', 'persistence time'], def: `The time over which a hydrogen bond, or the arrangement of bonds around a molecule, survives before it is lost: about 1.2 ps for water at 25 °C and 0.5 ps near the boiling point, depending on how the bond is defined.` },
    { term: 'Underdamped oscillation', also: ['hydrogen-bond stretch', 'intermolecular vibration'], def: `A motion that swings back and forth several times before dying away, as a bell does. The hydrogen bond between two water molecules is a spring with a period of 170 fs (5.9 THz, 196 cm⁻¹) and oscillates for about two or three cycles.` },
    { term: 'Collective reorganisation', also: ['network rearrangement', 'structural relaxation'], def: `The slower change of the whole hydrogen-bond neighbourhood, measured by how long a molecule's O–H frequency stays correlated with its starting value: 1.2 ps in water at 25 °C.` },
    { term: 'Spectral diffusion', also: ['frequency fluctuations', 'frequency correlation'], def: `The wandering of a vibration's frequency as its surroundings change. In water the O–H stretch frequency follows the electric field of the neighbours, so its wandering is a record of the network's rearrangement.` },
    { term: 'Jump reorientation', also: ['large-angle jump', 'molecular jump mechanism'], def: `The way a water molecule turns: it waits while a new partner approaches, then rotates about 60° in an instant, swapping one hydrogen-bond partner for another, rather than rotating by small diffusive steps.` }
  ],
  formulas: [
    { name: 'Rearrangement rate of one bond', expr: 'k = 1/tau', tex: 'k = \\frac{1}{\\tau}',
      vars: { k: { name: 'rearrangements per second', q: 'rate', unit: '1/s', hint: 'About 8 × 10¹¹ per second for water at 25 °C.' }, tau: { name: 'lifetime of the bond', q: 'time', unit: 'ps', value: 1.2, tex: '\\tau', hint: '1.2 ps at 25 °C; 0.5 ps at 100 °C.' } },
      solveFor: 'k', note: 'A mean rate: the events are random, not periodic.',
      stories: { k: 'Hydrogen bonds in a liquid rearrange after {tau}. How many times per second does one bond rearrange?', tau: 'A bond rearranges {k} times a second. How long does it last?' } },
    { name: 'Wavenumber of the 170 fs oscillation', expr: 'nu = 1/(c*Tper)', tex: '\\tilde{\\nu} = \\frac{1}{c\\,T}',
      vars: { nu: { name: 'wavenumber', q: 'wavenumber', unit: '1/cm', tex: '\\tilde{\\nu}', hint: 'The number of oscillations per centimetre of light: the unit of infrared spectroscopy.' }, c: { const: 'c' }, Tper: { name: 'period of the oscillation', q: 'time', unit: 'fs', value: 170, tex: 'T', hint: 'Measured by Fecko et al. 2003 for the hydrogen bond in liquid water.' } },
      solveFor: 'nu', note: 'The hydrogen-bond stretch appears as a broad band near 200 cm⁻¹ in the far-infrared and Raman spectra of water, the same motion seen in the frequency domain.',
      stories: { nu: 'A motion repeats every {Tper}. At what wavenumber would it appear in a spectrum?' } },
    { name: 'How far a molecule diffuses in one lifetime', expr: 'x = sqrt(6*D*tau)', tex: 'x = \\sqrt{6\\,D\\,\\tau}',
      vars: { x: { name: 'root-mean-square displacement', q: 'length', unit: 'Å' }, D: { name: 'self-diffusion coefficient', unit: 'm²/s', value: 2.3e-9, hint: '2.3 × 10⁻⁹ m²/s for water at 25 °C; 1.1 at 0 °C, 6.2 at 80 °C.' }, tau: { name: 'time', q: 'time', unit: 'ps', value: 1.2, tex: '\\tau' } },
      solveFor: 'x', note: 'Einstein\'s random-walk result in three dimensions, $\\langle r^2\\rangle = 6Dt$, valid when the time is long compared with the collisions; at 1 ps it is a good estimate.',
      stories: { x: 'A molecule diffuses with $D = $ {D}. How far does it wander in {tau}?' } }
  ],
  examples: [
    { title: 'How often a bond turns over in a droplet', q: 'A droplet of water contains 1 mL (0.997 g). Estimate how many bond rearrangements occur in it in one second.',
      steps: ['Molecules: $0.997/18.015 \\times 6.022\\times10^{23} = 3.3\\times10^{22}$.', 'Bonds, with 3.7 bond ends per molecule and each bond having two ends: $3.3\\times10^{22}\\times1.85 = 6.2\\times10^{22}$.', { text: 'Each lasts 1.2 ps:', tex: '6.2\\times10^{22}\\times\\frac{1}{1.2\\times10^{-12}\\ \\mathrm{s}} \\approx 5\\times10^{34}\\ \\mathrm{s^{-1}}' }],
      a: 'About $5\\times10^{34}$ rearrangements per second in a millilitre of still water.' },
    { title: 'Is a broken bond an escape?', q: 'In 1.2 ps a molecule diffuses how far, compared with the O–O bond length of 2.8 Å?',
      steps: [{ text: 'Use the random-walk displacement:', tex: 'x = \\sqrt{6 \\times 2.3\\times10^{-9} \\times 1.2\\times10^{-12}} = 1.3\\times10^{-10}\\ \\mathrm{m}' }, 'That is 1.3 Å, under half of 2.8 Å.', 'The molecule has not even moved a bond length when its bond pattern has been forgotten.'],
      a: '1.3 Å. Bonds are lost by tilting, not by drifting apart; the neighbours are mostly the same before and after.' }
  ],
  quiz: [
    { q: 'What do the two times, 170 fs and 1.2 ps, measure in liquid water?', choices: ['The lifetimes of two different kinds of molecule', 'The period of the hydrogen-bond oscillation and the time over which the bond pattern is forgotten', 'The times a molecule takes to rotate and to translate', 'Two lifetimes of the covalent O–H bond'], a: 1, why: 'The 170 fs is a period (the bond as a spring); the 1.2 ps is a decay time of the network\'s memory. The covalent O–H bond lasts effectively for ever.' },
    { q: 'About how many times per second does a typical hydrogen bond rearrange at 25 °C (as a power of ten, give the exponent)?', answer: 12, why: '$1/1.2$ ps $\\approx 8\\times10^{11}$ per second, i.e. of order $10^{12}$.' },
    { q: 'Warming water from 25 °C to 100 °C makes the lifetime of a bond', choices: ['much longer', 'a little longer', 'shorter, about 0.5 ps', 'unchanged, since the bond energy is fixed'], a: 2, why: 'Thermal kicks are larger and more frequent; the bond itself is the same but the network around it rearranges faster. The lifetime falls to about 0.5 ps.' },
    { q: 'A bond that breaks has always been replaced by a bond to a different molecule.', a: false, why: 'Often the same partner returns within a few hundred femtoseconds. Only over the picosecond scale does the neighbourhood change appreciably; the molecules move only about 1.3 Å in a lifetime.' },
    { q: 'If hydrogen bonds lasted a millisecond rather than a picosecond, water at room temperature would be', choices: ['a gas', 'a thin liquid, as now', 'a glassy solid or an extremely viscous liquid', 'a plasma'], a: 2, why: 'The flicker is what lets the molecules rearrange and flow. A network whose bonds last a millisecond is, on every timescale we use, a rigid solid.' }
  ],
  applications: [`Viscosity and diffusion: water flows because its bonds break and re-form; the temperature dependence of both follows the temperature dependence of the bond lifetime.`, `Dielectric response: the 8 ps Debye relaxation of water's dielectric constant, whose absorption peaks near 19 GHz and which is why water heats in a microwave oven, is the collective cousin of the same rearrangement.`, `Hydration of proteins: water near a surface is slowed by a factor of two or three, but still exchanges within tens of picoseconds — fast enough that a protein can adjust to it continuously.`, `Ultrafast chemistry: reactions in water, from electron transfer to proton transfer, are gated by the same sub-picosecond fluctuations of the hydrogen bonds around the reacting groups.`],
  history: `Hydrogen-bond lifetimes were first estimated by computer simulation in the 1970s (Rahman and Stillinger; Stillinger) and by NMR relaxation (about 2.5 ps for rotation). The direct measurement came with femtosecond lasers: the 2003 paper of Fecko and colleagues in Tokmakoff's laboratory at MIT watched the hydrogen bond oscillate and the network lose its memory, in real time.`,
  sources: [`Fecko, Eaves, Loparo, Tokmakoff and Geissler, "Ultrafast hydrogen-bond dynamics in the infrared spectroscopy of water", *Science* 301, 1698 (2003): the 170 fs oscillation and 1.2 ps reorganisation.`, `Laage and Hynes, "A molecular jump mechanism of water reorientation", *Science* 311, 832 (2006).`, `Eisenberg and Kauzmann, *The Structure and Properties of Water* (1969): self-diffusion, viscosity and the nuclear-magnetic-resonance relaxation of water.`, `Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017).`],
  sim: 'hb-flicker'
},

/* ================================================================ cooperativity */
{
  id: 'cooperativity', parent: 'hydrogen-bonds', title: 'Cooperativity', level: 3,
  short: 'Hydrogen bonds help one another. A molecule already bonded to a neighbour is more polar and bonds the next one harder: a lone pair is worth 21 kJ/mol, a long chain about 25 per bond, and a molecule\'s dipole grows from 1.85 D in the gas to about 2.9 D in the liquid.',
  keywords: ['cooperativity', 'cooperative', 'polarisation', 'induced dipole', 'dipole moment', 'water dimer', 'cluster', 'ring', 'chain', 'non-additive', 'many-body', 'Kirkwood', '2.9 debye', 'polarizability'],
  prereq: ['what-a-hydrogen-bond-is', 'two-donors-two-acceptors', 'polarity-and-the-dipole'],
  related: ['the-tetrahedral-network', 'the-structure-of-liquid-water', 'the-dielectric-constant', 'the-proton-hops', 'why-simulations-struggle', 'physics:dielectrics'],
  body: `
Add up the bonds of water as though they were independent, each worth what a pair of molecules in isolation is worth, and the totals come out wrong. They come out *too small*: bonds in a network are stronger than a single bond between two molecules, and they get stronger as the network grows. That is **cooperativity**: each bond makes the next one better.

### Why one bond helps the next
A water molecule is polar, and polarisable: the electrons of the molecule move in an electric field. Take a molecule that is receiving one hydrogen bond. Its lone pair is being pulled towards the donor's hydrogen, which leaves the molecule's *own* hydrogens a little more positive and its oxygen a little more negative than before. That is a molecule with a bigger dipole, so it is a better donor to the next neighbour and a better acceptor for the previous one. A bond to one side makes the bond on the other side stronger, and so on, down a chain.

The size of the effect is easy to estimate. A neighbour 2.8 Å away, with a dipole of 1.85 D, produces an electric field of about $5\\times10^{9}$ V/m on the axis. The polarisability of a water molecule, about 1.45 Å³, turns that field into an extra dipole of 0.24 D — the observed increase per bond is about 0.27 D.

### What it does to the numbers
| Cluster | Bond energy | O–O distance |
|---|---|---|
| dimer | about 21 kJ/mol | 2.98 Å |
| cyclic tetramer | about 29 kJ/mol per bond | 2.79 Å |
| cyclic pentamer | about 30 kJ/mol per bond | 2.76 Å |
| ice Ih (from the heat of sublimation) | about 25 kJ/mol per bond | 2.76 Å |
| liquid water, average | about 20 kJ/mol | 2.8 Å |

The energies are values of the binding at the bottom of the well, taken from careful calculations; they fall by about a third when the zero-point motion of the hydrogens is included (the water dimer's measured binding energy is 13.2 kJ/mol). The pattern is what matters: the bond grows stronger as molecules are added, and shorter, because a stronger bond pulls its molecules closer. By the time five molecules form a ring, each bond is 40 % stronger than the dimer's.

The molecule changes with it. In the gas a water molecule has a dipole moment of 1.855 D. Estimates for a molecule in the liquid or in ice are 2.4 to 3.1 D depending on how the electron cloud is divided among the molecules; the middle of the range is about **2.9 D**, a rise of more than half. About 0.27 D is added for every bond a molecule takes part in. Cooperativity also shows in the liquid's dielectric constant of 78: neighbouring dipoles tend to line up in step, a correlation that physical chemists measure by the Kirkwood factor, about 2.7 for water.

### The liquid is not a chain
If bonds in chains are worth 25 kJ/mol, why is the typical bond in the liquid worth only about 20? Because chains are tidy and the liquid is not. In the liquid every molecule is trying to hold three or four bonds in directions that cannot all be perfect, the angles are bent, and a molecule that gives and receives two bonds on both sides is pulled in several ways at once: the extra strength of cooperativity is partly eaten by the cost of the strain and partly by the competition between neighbours for the same lone pair. The result is that no fixed energy can be assigned to "a hydrogen bond" in liquid water: 20 kJ/mol is a convenient average of a distribution that runs from 10 to 30.

### What follows from it
- **Phase changes are sharp.** Because bonds depend on bonds, a patch of ice that begins to lose bonds loses them faster, which is the usual signature of a cooperative transition.
- **The proton moves fast.** The same polarisation makes a chain of waters a good wire for a hopping proton ([[the-proton-hops]]).
- **Simulations are hard.** A model in which the energy is a sum over pairs of molecules, with fixed charges, cannot give the right strength of the bonds in a chain and in a net at once; that is the main reason water is a challenge for [[why-simulations-struggle|simulations]].

> [!key] Hydrogen bonds are not additive: a molecule that receives one becomes more polar and bonds its next neighbour harder, so the bond energy grows from 21 kJ/mol in the dimer to about 25–30 in chains and rings, and the molecular dipole from 1.85 D in the gas to about 2.9 D in the liquid.`,
  ideas: [`A bonded molecule is more polarised, so it gives and takes further bonds more strongly: bond energy rises from 21 kJ/mol (dimer) to about 25–30 per bond in chains and rings.`, `Each bond adds about 0.27 D to the dipole of the molecules it joins: 1.85 D in the gas, about 2.9 D in the liquid.`, `The bond shortens as it strengthens: 2.98 Å in the dimer, 2.76 Å in the pentamer ring and in ice.`, `The liquid average (about 20 kJ/mol) is less than in chains because strain and competition between neighbours eat part of the gain.`],
  pitfalls: [`"Each hydrogen bond is worth 20 kJ/mol, so a cluster of n molecules is worth that times the number of bonds" — Cooperativity makes the real total larger: five molecules in a ring have bonds 40 % stronger than the dimer's.`, `"A water molecule has a dipole of 1.85 D" — In the gas. In the liquid and in ice it is about 2.9 D; the larger value is why liquid water is so good a dielectric.`, `"Cooperativity means the bonds all break together" — It means their strengths depend on one another. Bonds still break and re-form individually, but one weak neighbourhood weakens the bonds next to it.`],
  terms: [
    { term: 'Cooperativity', also: ['cooperative hydrogen bonding', 'non-additivity', 'many-body effect'], def: `The dependence of the strength of one hydrogen bond on the presence of the others: a molecule that receives one bond is more willing to give and receive more. The energy of a cluster is therefore larger than the sum of the energies of its pairs.` },
    { term: 'Polarisability', also: ['polarizability', 'α'], def: `The ease with which an electric field distorts a molecule's electron cloud and so induces a dipole: the induced dipole is $\\mu_\\text{ind} = \\alpha E$. For water, about 1.45 Å³.` },
    { term: 'Induced dipole', also: ['induction', 'polarisation energy'], def: `The extra dipole moment that a molecule acquires in the electric field of its neighbours. It is the physical mechanism of cooperativity.` },
    { term: 'Dipole moment of water', also: ['water dipole', '1.85 D', '2.9 D'], def: `The measure of charge separation in the molecule: 1.855 debye in the gas, about 2.9 D for a molecule in the liquid, estimated up to 3.1 D in ice.` },
    { term: 'Kirkwood factor', also: ['g_K', 'dipole correlation factor'], def: `A number that measures how strongly the dipoles of neighbouring molecules line up. For water it is about 2.7; a value of 1 would mean the dipoles point independently of one another.` },
    { term: 'Cyclic cluster', also: ['water ring', 'ring tetramer', 'ring pentamer'], def: `A closed ring of hydrogen-bonded molecules, in which every molecule gives one bond and takes one. Rings of three to six are the most stable small clusters of water and show the clearest cooperativity.` }
  ],
  formulas: [
    { name: 'Induced dipole from a neighbour', expr: 'mu = mu0 + alpha*E', tex: '\\mu = \\mu_0 + \\alpha\\,E',
      vars: { mu: { name: 'dipole of the bonded molecule', q: 'dipole', unit: 'D', tex: '\\mu' }, mu0: { name: 'dipole of the isolated molecule', q: 'dipole', unit: 'D', value: 1.855, tex: '\\mu_0', hint: '1.855 D for water in the gas.' }, alpha: { name: 'polarisability', unit: 'C·m²/V', value: 1.61e-40, tex: '\\alpha', hint: '1.45 Å³ in the units of volume that spectroscopists use, equal to 1.61 × 10⁻⁴⁰ C·m²/V in SI.' }, E: { name: 'field of the neighbour', q: 'efield', unit: 'V/m', value: 5e9, hint: 'The field of a 1.85 D dipole on its axis at 2.8 Å is about 5 × 10⁹ V/m.' } },
      solveFor: 'mu', note: 'First-order induction. The estimate gives 0.24 D per neighbour, close to the 0.27 D of the full calculation; real fields are a little larger because the neighbour\'s own polarisation adds.',
      stories: { mu: 'A water molecule of dipole {mu0} sits in the field {E} of a neighbour. What is its dipole now?' } },
    { name: 'Point-dipole energy of two molecules in line', expr: 'U = NA*2*ke*p1*p2/r^3', tex: 'U = N_A\\,\\frac{2\\,k\\,p_1 p_2}{r^3}',
      vars: { U: { name: 'interaction energy per mole', q: 'molarenergy', unit: 'kJ/mol' }, NA: { const: 'NA' }, ke: { const: 'ke' }, p1: { name: 'dipole of the first molecule', q: 'dipole', unit: 'D', value: 1.855, tex: 'p_1' }, p2: { name: 'dipole of the second', q: 'dipole', unit: 'D', value: 1.855, tex: 'p_2' }, r: { name: 'distance', q: 'length', unit: 'Å', value: 2.8 } },
      solveFor: 'U', note: 'Two point dipoles head to tail. Crude at 2.8 Å, where the molecules are not points, but it shows the trend: the energy scales with the product of the dipoles, so a rise from 1.85 D to 2.9 D multiplies it by 2.5. With both dipoles 1.85 D it comes to about 19 kJ/mol, the size of a real hydrogen bond.',
      stories: { U: 'Two molecules with dipoles {p1} and {p2} sit head to tail {r} apart. What is the point-dipole energy?' } },
    { name: 'Energy per bond in ice from the heat of sublimation', expr: 'Eb = Hs/nb', tex: 'E_b = \\frac{H_s}{n_b}',
      vars: { Eb: { name: 'energy per bond', q: 'molarenergy', unit: 'kJ/mol' }, Hs: { name: 'enthalpy of sublimation', q: 'molarenergy', unit: 'kJ/mol', value: 51, tex: 'H_s', hint: '51 kJ/mol at 0 °C, 47 at 0 K.' }, nb: { name: 'bonds per molecule (each counted once)', value: 2, min: 0.5, max: 4, tex: 'n_b' } },
      solveFor: 'Eb', note: 'Turning ice into vapour breaks all its bonds. Two bonds per molecule gives about 25 kJ/mol, but the figure includes the weaker van der Waals attraction.',
      stories: { Eb: 'It takes {Hs} to turn a mole of ice into vapour, and each molecule has {nb} bonds. What is a bond worth?' } }
  ],
  examples: [
    { title: 'How much stronger is the pentamer ring?', q: 'Five water molecules close into a ring with five bonds of about 30 kJ/mol each. Compare the total with five independent dimer bonds of 21 kJ/mol.',
      steps: ['Ring: $5 \\times 30 = 150$ kJ/mol.', 'Independent bonds: $5 \\times 21 = 105$ kJ/mol.', { text: 'The cooperative gain:', tex: '\\frac{150-105}{105} \\approx 0.43' }],
      a: 'About 43 % more: the ring is held together by roughly half as much again as the independent pairs would suggest.' },
    { title: 'Why the molecule becomes more polar', q: 'A bonded neighbour makes an on-axis field of $5\\times10^9$ V/m at a water molecule with polarisability $1.61\\times10^{-40}$ C·m²/V. How much dipole does it add?',
      steps: [{ text: 'Induced dipole:', tex: '\\Delta\\mu = \\alpha E = 1.61\\times10^{-40} \\times 5\\times10^{9} = 8.1\\times10^{-31}\\ \\mathrm{C\\,m}' }, 'One debye is $3.336\\times10^{-30}$ C·m, so $\\Delta\\mu = 0.24$ D.', 'A molecule in the liquid with about 3.7 bonds would, by this count, grow by roughly 0.9 D, bringing it from 1.85 to 2.7–2.9 D.'],
      a: 'About 0.24 D per neighbour, in agreement with the 0.27 D found by more careful calculations.' }
  ],
  quiz: [
    { q: 'In a ring of five water molecules each bond is stronger than in the dimer. This shows that hydrogen bonds are', choices: ['additive', 'cooperative', 'covalent', 'independent of distance'], a: 1, why: 'Cooperative: the strength of each depends on the presence of the others. If bonds were additive, the ring bonds would be worth 21 kJ/mol each, as in the dimer.' },
    { q: 'The dipole moment of a water molecule in the liquid is about', choices: ['1.85 D, as in the gas', '2.9 D, because its neighbours polarise it', '0.5 D, because the bonds average out', '10 D'], a: 1, why: 'The field of the neighbours pulls charge through the molecule and raises the dipole by about 0.27 D per bond, to roughly 2.9 D.' },
    { q: 'As a chain of water molecules grows longer, the hydrogen bonds in its middle become', choices: ['weaker and longer', 'stronger and shorter', 'unchanged', 'broken'], a: 1, why: 'Each additional neighbour polarises the molecules a little more; the bond strengthens from 21 towards 25 kJ/mol and the O–O distance falls from 2.98 Å towards 2.8.' },
    { q: 'The average hydrogen bond in the liquid (about 20 kJ/mol) is weaker than in chains (about 25), even though cooperativity operates in the liquid too.', a: true, why: 'Strain, thermal disorder and competition between neighbours for the same lone pair offset the cooperative gain. Chains are tidy; the liquid is crowded.' },
    { q: 'What energy per bond, in kJ/mol, does an enthalpy of sublimation of 51 kJ/mol suggest for ice, with two bonds per molecule?', answer: 25.5, why: '$51/2 = 25.5$ kJ/mol. It includes the van der Waals contribution, but it is close to the strength found for bonds in chains and rings.' }
  ],
  applications: [`Dielectric properties: the cooperative alignment of neighbouring dipoles is the origin of water's high dielectric constant and so of its ability to dissolve salts ([[the-dielectric-constant]]).`, `Proton conduction: the proton moves along chains of water faster than anywhere else because the chain is already polarised ([[the-proton-hops]]).`, `Computer models: force fields that include polarisation (AMOEBA, the Drude-oscillator models, ab initio molecular dynamics) reproduce water's bond energies better than rigid-charge models.`, `Gas-phase spectroscopy: the measured dimer, trimer and ring clusters of water are the benchmarks against which every theory of the liquid is first tested.`],
  history: `Cooperativity was recognised early by studies of the infrared spectra of alcohols and water, whose O–H bands shifted further as clusters grew. Frank and Wen in 1957 used it to explain why bonds in water should form and dissolve together, the "flickering clusters". Precise gas-phase measurements of the water dimer, trimer and ring tetramer and pentamer, notably by Saykally's group at Berkeley from the 1990s, gave the experimental values with which theory is compared.`,
  sources: [`Eisenberg and Kauzmann, *The Structure and Properties of Water* (1969), on the energy of the hydrogen bond and the dipole of the water molecule.`, `Xantheas and Dunning, ab initio studies of cyclic water clusters, *Journal of Chemical Physics* (1993): bond energies of the ring clusters.`, `Rocher-Casterline and colleagues, "Reexamination of the water dimer binding energy", *Journal of Chemical Physics* 134, 211101 (2011): the measured dimer dissociation energy of 13.2 kJ/mol.`, `Ball, *H₂O: A Biography of Water* (1999), on the polarisation of the water molecule in the liquid.`],
  sim: 'hb-cooperativity'
},

/* ================================================================ the structure of liquid water */
{
  id: 'the-structure-of-liquid-water', parent: 'hydrogen-bonds', title: 'The structure of liquid water', level: 3,
  short: 'Seen from one oxygen, the others lie in shells: a tall peak at 2.8 Å, a gap, a low hump at 4.5 Å, and then nothing. That curve, g(r), is the best picture of liquid water — a distorted tetrahedral net with order fading over three molecules — and the models, clusters and chains that have been read into it are still argued over.',
  keywords: ['radial distribution function', 'g(r)', 'pair distribution', 'structure of water', 'flickering clusters', 'Frank and Wen', 'mixture model', 'continuum model', 'Bernal and Fowler', 'Wernet', 'rings and chains', 'X-ray absorption', 'neutron diffraction', 'coordination number', 'short-range order'],
  prereq: ['the-tetrahedral-network', 'bonds-that-flicker'],
  related: ['two-liquids-in-one', 'seeing-the-bonds', 'why-ice-floats', 'the-density-maximum', 'what-remains-unknown', 'chemistry:intermolecular-forces'],
  body: `
Imagine freezing time in a drop of water and standing on one oxygen. Count the other oxygens in thin spherical shells around you, at 2 Å, 3 Å, 4 Å and so on, and divide each count by what you would find in a gas of the same density, one with no structure at all. The result, as a function of distance, is the **radial distribution function** $g(r)$: it is 1 where the surroundings look random, above 1 where neighbours cluster, below 1 where they keep away. It is the closest thing there is to a photograph of a liquid.

### The curve for water at 25 °C
- **Nothing inside 2.5 Å.** Two molecules cannot overlap.
- **A tall peak at 2.8 Å, about 2.8 high.** The hydrogen-bonded neighbours: at the bond distance, found there nearly three times as often as chance.
- **A trough at 3.3–3.4 Å, about 0.8.** There is almost a gap: at this distance the molecule's own bonded neighbours exclude the space.
- **A low hump at 4.5 Å, about 1.1.** The neighbours of the neighbours, placed by the tetrahedral angle ($1.63\\times2.8$ Å).
- **Flat by about 8 Å.** Beyond three molecular diameters the liquid has forgotten you.

Counting what is under the first peak, out to the trough, gives about **4.4 neighbours**. Liquid argon, whose atoms have only weak attraction, has about 10–12 in its first shell, and a second peak at about twice the first distance, because spheres pile on each other. Water has a few neighbours and a second shell at 1.63 times the first because its molecules are held in directions: it is a liquid with an *ice-like skeleton*, with the density of a liquid.

| Feature of g(r) | Position | Height | What it is |
|---|---|---|---|
| first peak | 2.80 Å | about 2.8 | bonded neighbours |
| first minimum | 3.4 Å | about 0.8 | the shell boundary |
| second peak | 4.5 Å | about 1.1 | neighbours of neighbours |
| third, faint | about 6.8 Å | 1.02 | the last trace of order |

Warm the water and the peaks lower and widen: the first falls from about 3 at the freezing point to about 2.5 at 90 °C. Cool it towards −40 °C and the order grows, the second peak sharpening towards the 4.5 Å of ice. The O–H partial distribution shows the hydrogen bond directly: a peak near 1.85 Å, the distance from a hydrogen to the oxygen of the neighbour that receives it.

### Models of the structure
- **Mixtures (from about 1892).** Röntgen suggested water is a mixture of ice-like clumps and dense liquid; Frank and Wen (1957) refined it as **flickering clusters**, regions of hydrogen-bonded molecules that form and dissolve in 10⁻¹⁰ to 10⁻¹¹ seconds, and Némethy and Scheraga (1962) put numbers on the proportions. Two populations explain many anomalies at once, the density maximum among them.
- **Continuum (Pople, 1951; Bernal and Fowler, 1933).** Water is one connected net in which the bonds bend and stretch, with a smooth distribution of distortions and no separate species. Computer simulation since 1971, and Stillinger's 1980 picture of a random, ever-rearranging net, favour this view.
- **Today.** The structure is a distorted tetrahedral net, with density fluctuations of sizes between a few molecules and a nanometre. Whether to call the fluctuations "two kinds of local structure" depends on the definition; the idea has been revived by the evidence that deeply supercooled water separates into a **high-density and a low-density liquid** ([[two-liquids-in-one]]), which suggests that the mixture picture was not wrong so much as incomplete.

### The chains-and-rings claim
In 2004 Wernet and colleagues, using X-ray absorption and X-ray Raman spectra at the oxygen K-edge, reported that most water molecules have only two strong hydrogen bonds, one donated and one accepted, which would make liquid water a collection of rings and chains and not the tetrahedral net of textbooks. The result was a shock because the signal was real: the pre-edge feature is stronger in the liquid than in ice. The reply came within two years. Calculations of the spectra from simulated water (Prendergast and Galli; Head-Gordon and Johnson, 2006) showed that a distorted tetrahedral liquid produces a very similar spectrum, because a bond that is stretched or bent changes the spectrum as though it were broken. The scattering data of X-ray and neutron diffraction fit the network with 3.4–3.7 bonds, and are hard to reconcile with chains. Most groups concluded that the liquid is a four-coordinated, strongly distorted net, though that the spectrum could be read both ways showed how much depends on what one means by "a bond".

> [!key] g(r) shows liquid water as a distorted tetrahedral net: a tall peak at 2.8 Å, a trough, a low hump at 4.5 Å and no order beyond three shells, with about 4.4 neighbours where a simple liquid has 10–12. Mixture, continuum and chain pictures have each been read into it; the supercooled liquid has revived the first.`,
  ideas: [`g(r) is the local density at a distance r from a molecule divided by the average density; it is 1 for a structureless liquid.`, `Water's g_OO has peaks at 2.8 Å (bonded neighbours, about 2.8 high) and 4.5 Å (neighbours of neighbours), and is flat beyond about 8 Å.`, `The first shell holds about 4.4 molecules, against 10–12 in liquid argon: water is an open, directional liquid.`, `Mixture and continuum models, and the 2004 chains-and-rings claim, are ways of reading the same data; the liquid is best described as a strongly distorted tetrahedral net.`],
  pitfalls: [`"g(r) tells you the positions of the molecules" — It tells you the average density of neighbours at each distance. Many different arrangements give the same curve, which is why the structure of water can still be argued about.`, `"Flickering clusters means water contains little pieces of ice" — Frank and Wen's clusters were fluctuating regions of locally more bonds that last a few picoseconds, not crystals.`, `"The 2004 paper proved water is rings and chains" — It showed that a spectrum had a feature that was not expected, and the explanation was disputed: calculations soon reproduced the feature from distorted tetrahedral structures.`],
  terms: [
    { term: 'Radial distribution function', also: ['pair distribution function', 'g(r)', 'g_OO(r)'], def: `The local density of molecules at distance r from a given molecule, relative to the average density. It tends to 1 at large r; its peaks mark the shells of neighbours.` },
    { term: 'Flickering cluster', also: ['Frank–Wen cluster', 'iceberg'], def: `A short-lived region of hydrogen-bonded molecules, proposed by Frank and Wen in 1957 to form and dissolve in about 10⁻¹¹ s. The idea survives as the observation that the liquid has fluctuating regions of higher and lower local order.` },
    { term: 'Mixture model', also: ['two-state model', 'two-structure model'], def: `A description of liquid water as a blend of two kinds of local structure, an open, ice-like one and a denser one, with the proportion changing with temperature and pressure.` },
    { term: 'Continuum model', also: ['distorted-network model', 'random network'], def: `A description of liquid water as a single hydrogen-bond network whose bonds are bent and stretched by a smooth distribution of amounts, with no distinct species.` },
    { term: 'First coordination shell', also: ['first shell', 'nearest neighbours'], def: `The molecules within the first minimum of g(r), up to about 3.4 Å; about 4.4 for liquid water, 4 in ice and 10–12 in a simple dense liquid.` }
  ],
  formulas: [
    { name: 'What g(r) counts', expr: 'g = N/(4*pi*r^2*dr*rho)', tex: 'g(r) = \\frac{N}{4\\pi r^2\\,\\Delta r\\,\\rho}',
      vars: { g: { name: 'g(r)', hint: '1 for no structure; 2.8 at the first peak of water.' }, N: { name: 'molecules found in the shell', value: 0.92, min: 0, hint: 'The average number of other oxygens in the shell from r to r + Δr.' }, r: { name: 'distance', q: 'length', unit: 'Å', value: 2.8, hint: 'Where the shell lies.' }, dr: { name: 'shell thickness', q: 'length', unit: 'Å', value: 0.1, tex: '\\Delta r' }, rho: { name: 'average number density', q: 'numberdensity', unit: '1/m³', value: 3.34e28, tex: '\\rho', hint: '3.34 × 10²⁸ molecules/m³ for water at 25 °C, i.e. 33.4 per nm³.' } },
      solveFor: 'g', note: 'The count in a shell divided by what a structureless gas of the same density would put there: the volume of the shell is $4\\pi r^2\\Delta r$.',
      stories: { g: 'In a shell {dr} thick at {r}, an average of {N} oxygens is found. With a density of {rho}, what is g(r)?' } },
    { name: 'Molecules in a sphere of a structureless liquid', expr: 'N = 4/3*pi*R^3*rho', tex: 'N = \\tfrac{4}{3}\\pi R^3 \\rho',
      vars: { N: { name: 'molecules inside the sphere' }, R: { name: 'radius', q: 'length', unit: 'Å', value: 3.4 }, rho: { name: 'average number density', q: 'numberdensity', unit: '1/m³', value: 3.34e28, tex: '\\rho' } },
      solveFor: 'N', note: 'The count if the molecules were spread evenly: about 5.5 within 3.4 Å. The real first shell holds about 4.4: the molecules in water sit at definite distances, not at random.',
      stories: { N: 'A liquid has number density {rho}. How many molecules would an evenly spread liquid hold inside {R}?' } },
    { name: 'From scattering to distance', expr: 'r = 2*pi/Q', tex: 'r = \\frac{2\\pi}{Q}',
      vars: { r: { name: 'distance in real space', q: 'length', unit: 'Å' }, Q: { name: 'scattering vector of the peak', q: 'wavenumber', unit: '1/nm', value: 20, hint: 'The first X-ray diffraction peak of water is near 2.0 Å⁻¹ = 20 nm⁻¹.' } },
      solveFor: 'r', note: 'A rough rule: a peak at Q in the scattering corresponds to a repeat distance of 2π/Q in the structure; for water 3.1 Å, the typical spacing of neighbouring molecules.',
      stories: { r: 'A scattering experiment has its first peak at {Q}. What length does it correspond to?' } }
  ],
  examples: [
    { title: 'Reading the first peak', q: 'In a shell of thickness 0.1 Å at 2.8 Å from an oxygen in water, an average of 0.92 other oxygens is found. The density is 33.4 molecules per nm³. What is g?',
      steps: ['The volume of the shell: $4\\pi r^2\\Delta r = 4\\pi \\times (0.28\\ \\mathrm{nm})^2 \\times 0.01\\ \\mathrm{nm} = 9.85\\times10^{-3}$ nm³.', 'A structureless liquid would put $33.4 \\times 9.85\\times10^{-3} = 0.329$ molecules there.', { text: 'The ratio:', tex: 'g = \\frac{0.92}{0.329} = 2.8' }],
      a: 'g = 2.8: nearly three times as many neighbours at the bond distance as chance would put there.' },
    { title: 'How many neighbours should there be?', q: 'Estimate the number of molecules within 3.4 Å of a given one if water were an even gas of molecules at its density, and compare with the observed first-shell count of about 4.4.',
      steps: [{ text: 'Volume of the sphere:', tex: '\\tfrac{4}{3}\\pi (0.34\\ \\mathrm{nm})^3 = 0.165\\ \\mathrm{nm^3}' }, 'Molecules: $33.4 \\times 0.165 = 5.5$.', 'Observed: about 4.4, a fifth fewer than an even spreading, because the hydrogen bonds fix the neighbours at 2.8 Å and leave the zone between 3 and 3.6 Å half empty.'],
      a: '5.5 against about 4.4: the shell is "too empty" because the bonded neighbours hold the other molecules off.' }
  ],
  quiz: [
    { q: 'What does a value g(r) = 1 mean?', choices: ['No molecules at that distance', 'The density at that distance equals the average: no structure', 'Exactly one molecule at that distance', 'The bond is intact'], a: 1, why: 'g is the local density divided by the mean density, so 1 means the surroundings look random at that distance.' },
    { q: 'Where is the second peak of g_OO in liquid water, in ångström?', answer: 4.5, why: 'About 1.63 times the first distance of 2.8 Å, as the tetrahedral geometry requires: the neighbours of the neighbours.' },
    { q: 'How many nearest neighbours does a molecule of water have in the first shell?', choices: ['4 exactly', 'About 4.4', 'About 8', 'About 12'], a: 1, why: 'Integrating g(r) up to the first minimum gives about 4.4. A close-packed liquid of spheres has 10–12; ice has exactly 4.' },
    { q: 'The 2004 X-ray absorption result showed beyond doubt that liquid water is made of rings and chains.', a: false, why: 'It was an observation that seemed to say so, and it was disputed: spectra calculated from distorted tetrahedral structures gave much the same feature, and diffraction data favour a net with 3.4–3.7 bonds per molecule.' },
    { q: 'Why does cooling water make the second peak of g(r) sharper?', choices: ['The molecules get heavier', 'More bonds are intact and straighter, so neighbours of neighbours are better placed', 'The density falls', 'Hydrogen bonds become covalent'], a: 1, why: 'The second peak exists only if both bonds linking the pair are in place and near the tetrahedral angle. Cooling raises the share of such pairs.' }
  ],
  applications: [`Testing models: any simulation of water is checked first against the measured g_OO(r); an error in the second peak reveals wrong angles even when the first peak is right.`, `Solutions: the same function around an ion or a solute (its hydration shells) shows how much water order it takes up or destroys ([[hydration-shells-and-proteins]]).`, `Supercooled and high-pressure water: the changes in g(r) with temperature and pressure are the structural evidence for the two liquids ([[two-liquids-in-one]]).`, `Amorphous ices: their g(r) fits the low- and high-density liquids, which is how the connection between the glassy and the liquid forms was made.`],
  history: `Bernal and Fowler's 1933 paper began the modern picture; the first X-ray measurement of water's structure was by Katzoff in 1934 and the first reliable curve by Narten and Levy (1971). Neutron diffraction with hydrogen–deuterium substitution, developed by Soper and others from the 1980s, separated the O–O, O–H and H–H distributions. Frank and Wen's flickering clusters were published in 1957.`,
  sources: [`Bernal and Fowler, "A theory of water and ionic solution, with particular reference to hydrogen and hydroxyl ions", *Journal of Chemical Physics* 1, 515 (1933).`, `Frank and Wen, "Structural aspects of ion-solvent interaction in aqueous solutions: a suggested picture of water structure", *Discussions of the Faraday Society* 24, 133 (1957).`, `Wernet and colleagues, "The structure of the first coordination shell in liquid water", *Science* 304, 995 (2004); and Head-Gordon and Johnson, "Tetrahedral structure or chains for liquid water", *PNAS* 103, 7973 (2006).`, `Skinner, Benmore, Neuefeind and Parise, "Benchmark oxygen-oxygen pair-distribution function of ambient water from x-ray diffraction measurements with a wide Q-range", *Journal of Chemical Physics* 138, 074506 (2013).`],
  sim: 'hb-rdf'
},

/* ================================================================ the proton hops */
{
  id: 'the-proton-hops', parent: 'hydrogen-bonds', title: 'The proton hops', level: 2,
  short: 'Two water molecules in a billion are ions. The proton that makes one of them does not swim: it passes its charge along the hydrogen bonds like a bucket brigade, which is why H⁺ carries current seven times faster than a sodium ion.',
  keywords: ['autoionisation', 'autoprotolysis', 'Kw', 'pH', 'Grotthuss', 'proton hopping', 'proton transfer', 'hydronium', 'Eigen', 'Zundel', 'mobility', 'conductivity', 'hydroxide', 'structural diffusion', 'proton wire'],
  prereq: ['what-a-hydrogen-bond-is', 'the-tetrahedral-network', 'bonds-that-flicker'],
  related: ['water-the-amphoteric', 'proton-wires-and-enzymes', 'pure-water-and-conductivity', 'cooperativity', 'chemistry:water-autoionization', 'chemistry:acid-base-theory', 'feynman:brownian-movement'],
  body: `
Pure water is not only water. In every litre, at 25 °C, 10⁻⁷ mole of molecules has handed a proton to a neighbour, leaving a hydronium ion, $\\ce{H3O+}$, and a hydroxide ion, $\\ce{OH-}$:
$$\\ce{2H2O <=> H3O+ + OH-}, \\qquad K_w = [\\ce{H3O+}][\\ce{OH-}] = 10^{-14}\\ \\text{(25 °C)}.$$
Out of 55.5 mol of water per litre that is **1.8 molecules in a billion**: 2×10⁻⁹. It is the reason pure water is a very poor but not a zero conductor (5.5 µS/m, a million times worse than sea water), and it is a consequence of the hydrogen bond, since the proton leaves one molecule and arrives on the lone pair of a neighbour already linked to it.

### How many ions, and for how long
| Temperature | $pK_w$ | Neutral pH | Ions per molecule |
|---|---|---|---|
| 0 °C | 14.94 | 7.47 | 6 per 10 billion |
| 25 °C | 13.995 | 7.00 | 1.8 per billion |
| 100 °C | 12.26 | 6.13 | 13 per billion |

Warming makes more ions (the reaction takes in heat), so *neutral* water is not at pH 7 except at 25 °C: boiling water is neutral at pH 6.13. The ions come and go very fast but unhurriedly for any one molecule. A given water ionises about once in 11 hours (rate $2.5\\times10^{-5}$ s⁻¹), and each ion lives about 70 µs before it finds a partner and recombines — a reaction with a rate constant of $1.4\\times10^{11}$ L/(mol·s), among the fastest known, close to the limit set by how quickly molecules can diffuse together.

### The fastest ion in water
Put pure water between electrodes, or any solution, and the ions drift. The speed per unit field is the **mobility**:

| Ion | Mobility (10⁻⁸ m²/(V·s)) | Relative to Na⁺ |
|---|---|---|
| H⁺ (hydronium) | 36.2 | 7.0 |
| OH⁻ | 20.6 | 4.0 |
| Cl⁻ | 7.9 | 1.5 |
| K⁺ | 7.6 | 1.5 |
| Na⁺ | 5.2 | 1 |
| Li⁺ | 4.0 | 0.8 |

Look at the order: the *smallest* ion is not the fastest but the slowest of the alkali metals, because the smaller the ion the tighter the shell of water it drags with it. Hydronium is as large as a water molecule and should move like one, yet it outruns everything by a factor of 4–7. And hydroxide, the other product of ionisation, is the second fastest.

### The bucket brigade
In 1806 Theodor von Grotthuss proposed, for electrolysis, a chain of molecules each handing on a piece to the next. We now know that for the proton that is true. A hydronium ion bonded to a neighbour does not travel to the electrode; its extra proton **hops** across the hydrogen bond to the neighbour, which becomes the hydronium, and the next hop passes it on. The charge advances 2.5 Å per hop; each proton moves only half an ångström.

- **Eigen and Zundel.** Between hops the excess proton sits on one oxygen with three waters bonded to it, the **Eigen ion**, $\\ce{H9O4+}$ (Wicke, Eigen and Ackermann, 1954). During the hop it is shared by two oxygens, the **Zundel ion**, $\\ce{H5O2+}$. Ab initio simulations by Marx and colleagues (1999) show the proton shuttling between the two forms, a "special pair dance", every picosecond or so.
- **What limits the speed.** The transfer itself takes a fraction of a picosecond; what takes time is for the *next* neighbour's hydrogen bonds to rearrange into the right position, about 1.5 ps in all. It is the flicker of [[bonds-that-flicker]] that sets the pace.
- **Structural diffusion.** The result is a charge that diffuses by a mechanism that is a mix of ordinary movement and hopping, with hopping responsible for most of its speed. Hydronium's diffusion coefficient, $9.3\\times10^{-9}$ m²/s, is four times water's own, $2.3\\times10^{-9}$.

The same trick, mirrored, explains hydroxide's speed (a proton hops *into* the ion from a neighbour), and protons are likewise the charge carriers that matter in ice. It is also why the cell uses water as a wire: a chain of three or four waters threaded through a protein carries protons far faster than the proteins could carry them by themselves ([[proton-wires-and-enzymes]]).

> [!key] Two molecules in a billion are ions, and the proton that makes them moves by hopping: it hands its charge to a neighbour across a hydrogen bond, advancing 2.5 Å per hop, which makes H⁺ seven times faster than Na⁺ although it is no smaller. The Grotthuss mechanism is the hydrogen-bond network at work as a wire.`,
  ideas: [`Water ionises to H₃O⁺ and OH⁻ at 2 molecules in a billion (25 °C); K_w = 10⁻¹⁴ and neutral pH is 7.00 only at 25 °C.`, `An ion survives about 70 µs before recombining; a given water molecule ionises about once in 11 hours.`, `H⁺ moves by the Grotthuss mechanism: the charge hops across hydrogen bonds, 2.5 Å per hop, passing through Eigen (H₉O₄⁺) and Zundel (H₅O₂⁺) forms.`, `Its mobility, 36.2 × 10⁻⁸ m²/(V·s), is seven times that of Na⁺; hydroxide, by the mirror mechanism, is four times as fast.`],
  pitfalls: [`"The H⁺ ion travels through the water to the electrode" — The charge travels; the proton that carries it at the end is not the proton that started. Each proton moves about half an ångström in a hop.`, `"Pure water is neutral at pH 7" — Neutral means [H⁺] = [OH⁻], which is pH 7.00 only at 25 °C: 7.47 at 0 °C and 6.13 at 100 °C. Pure hot water is not acidic.`, `"The smaller the ion, the faster it moves" — Among alkali ions it is the other way round, because small ions bind more water. Hydronium is the exception, and only because it does not carry its charge by being dragged.`],
  terms: [
    { term: 'Autoionisation', also: ['self-ionisation', 'autoprotolysis', 'water dissociation'], def: `The transfer of a proton from one water molecule to another, $\\ce{2H2O -> H3O+ + OH-}$, which in pure water at 25 °C leaves about 1.8 ions per billion molecules ([H⁺] = [OH⁻] = 10⁻⁷ mol/L).` },
    { term: 'Ionic product of water', also: ['K_w', 'pK_w'], def: `The product [H₃O⁺][OH⁻] of the concentrations in mol/L: 1.0 × 10⁻¹⁴ at 25 °C (pK_w = 13.995), 1.15 × 10⁻¹⁵ at 0 °C, 5.5 × 10⁻¹³ at 100 °C.` },
    { term: 'Grotthuss mechanism', also: ['proton hopping', 'structural diffusion', 'proton relay'], def: `The way an excess proton (or a missing one) moves through water: not as a travelling ion but by repeatedly handing a hydrogen across a hydrogen bond to the next molecule, so that the charge moves faster than any molecule. Proposed by Theodor von Grotthuss in 1806.` },
    { term: 'Eigen ion', also: ['Eigen cation', 'H₉O₄⁺'], def: `A hydronium ion $\\ce{H3O+}$ with its three hydrogens each bonded to a water molecule: the form in which the excess proton rests between hops.` },
    { term: 'Zundel ion', also: ['Zundel cation', 'H₅O₂⁺'], def: `Two water molecules sharing one proton equally, H₂O···H⁺···OH₂: the form the excess proton passes through in the middle of a hop.` },
    { term: 'Ionic mobility', also: ['mobility', 'electrophoretic mobility'], def: `The drift speed of an ion per unit electric field, in m²/(V·s): 36.2 × 10⁻⁸ for H⁺ and 5.2 × 10⁻⁸ for Na⁺ in water at 25 °C.` }
  ],
  formulas: [
    { name: 'Drift speed in a field', expr: 'v = mu*E', tex: 'v = \\mu\\,E',
      vars: { v: { name: 'drift speed', q: 'speed', unit: 'mm/s' }, mu: { name: 'ionic mobility', unit: 'm²/(V·s)', value: 3.62e-7, tex: '\\mu', hint: '3.62 × 10⁻⁷ for H⁺, 5.19 × 10⁻⁸ for Na⁺, 2.06 × 10⁻⁷ for OH⁻.' }, E: { name: 'electric field', q: 'efield', unit: 'V/cm', value: 100 } },
      solveFor: 'v', note: 'Steady speed when the pull of the field is balanced by the drag of the water. In 100 V/cm, a proton drifts 3.6 mm/s and a sodium ion 0.5 mm/s.',
      stories: { v: 'An ion of mobility {mu} sits in a field of {E}. How fast does it drift?', E: 'An ion of mobility {mu} drifts at {v}. What is the field?' } },
    { name: 'Mobility from diffusion', expr: 'mu = D*qe/(kB*T)', tex: '\\mu = \\frac{D\\,e}{k_B T}',
      vars: { mu: { name: 'ionic mobility', unit: 'm²/(V·s)', tex: '\\mu' }, D: { name: 'diffusion coefficient', unit: 'm²/s', value: 9.31e-9, hint: '9.31 × 10⁻⁹ m²/s for H⁺ in water at 25 °C; 1.33 × 10⁻⁹ for Na⁺.' }, qe: { const: 'qe' }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0, max: 100 } },
      solveFor: 'mu', note: 'Einstein\'s relation: the thermal jiggle that spreads an ion out and the field that drags it are two faces of the same friction. The mobility of H⁺ is high because its diffusion coefficient is.',
      stories: { mu: 'An ion with diffusion coefficient {D} at {T}. What is its mobility?' } },
    { name: 'Ions per molecule from the pH', expr: 'x = 10^(-pH)/cw', tex: 'x = \\frac{10^{-\\mathrm{pH}}}{c_w}',
      vars: { x: { name: 'fraction of molecules present as H₃O⁺', hint: '1.8 × 10⁻⁹ at pH 7.' }, pH: { name: 'pH of the pure water', value: 7, min: 0, max: 14, hint: '7.00 at 25 °C; 7.47 at 0 °C; 6.13 at 100 °C.' }, cw: { name: 'concentration of water', unit: 'mol/L', value: 55.5, fixed: true, tex: 'c_w' } },
      solveFor: 'x', note: 'In pure water [H⁺] = [OH⁻] = 10^−pH, so the ion fraction is that divided by the 55.5 mol/L of water itself.',
      stories: { x: 'Pure water has pH {pH}. What fraction of its molecules is present as hydronium?' } },
    { name: 'How long an ion lasts', expr: 'tau = 1/(kr*c)', tex: '\\tau = \\frac{1}{k_r\\,c}',
      vars: { tau: { name: 'lifetime of an ion', q: 'time', unit: 'µs', tex: '\\tau' }, kr: { name: 'recombination rate constant', unit: 'L/(mol·s)', value: 1.4e11, tex: 'k_r', hint: '1.4 × 10¹¹ L/(mol·s) for H⁺ + OH⁻, measured by Eigen and de Maeyer in the 1950s.' }, c: { name: 'concentration of the partner ion', unit: 'mol/L', value: 1e-7 } },
      solveFor: 'tau', note: 'In pure water at 25 °C: about 70 µs. In 0.1 M base ([OH⁻] = 0.1) a hydronium would last only 70 ps.',
      stories: { tau: 'The recombination constant is {kr} and the partner ion is at {c}. How long does an ion last?' } }
  ],
  examples: [
    { title: 'The race in an electric field', q: 'A proton and a sodium ion start together in water in a field of 100 V/cm. How long does each take to cover 5 mm?',
      steps: ['Field: 100 V/cm = $10^4$ V/m.', { text: 'Speeds:', tex: 'v_{\\mathrm{H}} = 3.62\\times10^{-7}\\times10^4 = 3.6\\ \\mathrm{mm/s}, \\quad v_{\\mathrm{Na}} = 5.19\\times10^{-8}\\times10^4 = 0.52\\ \\mathrm{mm/s}' }, 'Times: $5/3.6 = 1.4$ s for the proton and $5/0.52 = 9.6$ s for the sodium ion.'],
      a: '1.4 s against 9.6 s: the proton gets there seven times sooner, although what arrives is a different proton from the one that left.' },
    { title: 'How many ions in a hot kettle?', q: 'Boiling water has $pK_w = 12.26$. What is its neutral pH, and what fraction of molecules is ionised?',
      steps: ['Neutral: [H⁺] = [OH⁻], so $pH = pK_w/2 = 6.13$.', { text: 'Ion fraction:', tex: 'x = \\frac{10^{-6.13}}{55.5} = \\frac{7.4\\times10^{-7}}{55.5} = 1.3\\times10^{-8}' }],
      a: 'Neutral pH 6.13; about 13 molecules in a billion are ionised, seven times more than at 25 °C. A pH meter reading 6.13 in boiling water means neutral, not acid.' }
  ],
  quiz: [
    { q: 'About how many water molecules in a billion are ionised in pure water at 25 °C?', answer: 1.8, why: '[H⁺] = 10⁻⁷ mol/L out of 55.5 mol/L of water gives $1.8\\times10^{-9}$.' },
    { q: 'Why does H⁺ move faster in water than Na⁺, even though a proton is far smaller?', choices: ['It is lighter', 'It carries less charge', 'It passes its charge along hydrogen bonds instead of moving through the water with a shell of molecules', 'Water repels sodium'], a: 2, why: 'Na⁺ must push its hydration shell through the liquid. The proton hops: each one moves half an ångström while the charge advances 2.5 Å per hop.' },
    { q: 'In the middle of a hop, the excess proton is shared equally by two oxygens. This is the', choices: ['Eigen ion, H₉O₄⁺', 'Zundel ion, H₅O₂⁺', 'hydroxide ion', 'Bjerrum defect'], a: 1, why: 'The Zundel ion, H₅O₂⁺: two waters and one shared proton. At rest the proton is on one oxygen with three waters, the Eigen ion, H₉O₄⁺.' },
    { q: 'The mobility of H⁺ divided by the mobility of Na⁺ is about', answer: 7, why: '$36.2/5.2 = 7.0$.' },
    { q: 'Pure water at 100 °C has pH 6.13, so it is acidic.', a: false, why: 'Neutral means equal H⁺ and OH⁻. Because the ionisation takes in heat, more ions form at 100 °C and the neutral pH drops to $pK_w/2 = 6.13$. The water is still exactly neutral.' }
  ],
  applications: [`Conductivity of pure water: the ions set the limit to how pure water can be; ultrapure water at 25 °C has a resistivity of 18.2 MΩ·cm, the figure of ions that cannot be removed ([[pure-water-and-conductivity]]).`, `Fuel cells and membranes: Nafion and the proton exchange membranes work by providing a water channel for hopping protons.`, `Enzymes and proteins: proton transfer in cytochrome c oxidase, ATP synthase and bacteriorhodopsin runs along chains of water molecules threaded through the protein ([[proton-wires-and-enzymes]]).`, `Acid–base chemistry: the speed of neutralisation, close to the diffusion limit, is the speed of this hop; see [[water-the-amphoteric]] and [[chemistry:water-autoionization|the autoionisation of water]].`],
  history: `Theodor von Grotthuss, a young chemist working in what is now Lithuania, published his chain-of-molecules theory of electrolysis in 1806. The modern picture came from Eigen's relaxation studies of fast reactions in the 1950s (the H₉O₄⁺ cation, 1954; the ion-recombination rate, with de Maeyer), Zundel's infrared evidence for the shared proton, and, from 1999, the first-principles simulations of Marx, Tuckerman, Hutter and Parrinello. Eigen was awarded the 1967 Nobel Prize in Chemistry for the study of reactions that are over in fractions of a microsecond.`,
  sources: [`Agmon, "The Grotthuss mechanism", *Chemical Physics Letters* 244, 456 (1995).`, `Marx, Tuckerman, Hutter and Parrinello, "The nature of the hydrated excess proton in water", *Nature* 397, 601 (1999).`, `CRC *Handbook of Chemistry and Physics*: limiting ionic conductivities and the ionic product of water.`, `Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017).`],
  sim: 'hb-grotthuss'
},

/* ================================================================ seeing the bonds */
{
  id: 'seeing-the-bonds', parent: 'hydrogen-bonds', title: 'Seeing the bonds', level: 3,
  short: 'Nobody can photograph a hydrogen bond in a liquid. We see it through its side effects: infrared and Raman light that the softened O–H absorbs near 3,400 cm⁻¹, X-rays and neutrons that scatter off the shells, radio waves that feel the deshielded proton, and femtosecond laser pulses that film the flicker. Each sees a different part, and none sees the bond.',
  keywords: ['infrared spectroscopy', 'Raman', 'O–H stretch', '3400 cm-1', 'neutron scattering', 'X-ray scattering', 'NMR', 'chemical shift', '2D-IR', 'HOD', 'isotope substitution', 'X-ray absorption', 'terahertz', 'dielectric', 'Compton scattering', 'red shift'],
  prereq: ['bonds-that-flicker', 'the-structure-of-liquid-water', 'vibrations-and-the-colour-of-water'],
  related: ['isotopes-and-heavy-water', 'two-liquids-in-one', 'what-remains-unknown', 'cooperativity', 'chemistry:hydrogen-bonding'],
  body: `
A hydrogen bond is a bond that most of the time is not exactly there. It has no definite length and no electron pair to see; it comes and goes in a picosecond, and its distance from the O–H bond it borrows from depends on the angle you choose to cut it off. What can be measured is what the bond *does* to something else. Six families of measurement, each with a different shutter speed and each blind to what the others see, have built the picture of water.

### The O–H stretch: infrared and Raman light
Inside a water molecule each O–H bond vibrates as a spring. In the vapour it absorbs sharply at 3,657 and 3,756 cm⁻¹ (wavelength about 2.7 µm). When its hydrogen is pulled towards a neighbour's oxygen the bond lengthens slightly — from 0.957 Å to about 1 Å — and softens, so the vibration slows and the absorption moves down in wavenumber. This **red shift** grows with the strength of the hydrogen bond (the old Badger–Bauer relation), and since every molecule in the liquid has a different set of bonds, the absorption spreads into a broad band centred near **3,400 cm⁻¹** (2.9 µm), about 400 cm⁻¹ wide; in ice the bonds are stronger and more regular and the band moves to 3,220 cm⁻¹. The bending mode moves the other way, from 1,595 to 1,640 cm⁻¹, because the bond stiffens the bend. Raman scattering gives the same bands by different selection rules. Lower down are the librations of molecules rocking in their cages, near 700 cm⁻¹, and the stretch of the hydrogen bond itself, near 200 cm⁻¹ — the 170 fs spring of [[bonds-that-flicker]].

A trick makes the O–H band readable: a small amount of HOD in heavy water has a single O–H oscillator among O–D groups, shifted far enough away that the oscillators no longer talk to each other. Its band, near 3,400 cm⁻¹, then reports only the surroundings of one hydrogen.

### Scattering: X-rays and neutrons
X-rays scatter from electrons, most of which are on the oxygens, and give the oxygen–oxygen distribution $g_{OO}(r)$ ([[the-structure-of-liquid-water]]). Neutrons scatter from nuclei, and hydrogen and deuterium scatter them very differently, so repeating a measurement on mixtures of $\\ce{H2O}$ and $\\ce{D2O}$ separates the O–O, O–H and H–H distributions: it is the way the O···H hydrogen-bond peak at 1.85 Å was seen. X-ray diffraction on ice has also been analysed in terms of the electrons in the bond (Isaacs and colleagues, 1999), showing that the hydrogen bond has a small but real share of covalent character.

### X-ray absorption
Tuning X-rays to the oxygen K-edge, near 535 eV, excites an inner electron into the empty orbitals of the molecule, and their energies depend on whether the hydrogens are bonded. The pre-edge feature is stronger for a molecule with a broken or weak bond. This is the technique behind the 2004 chains-and-rings claim, a good example of how an experiment that measures one thing (an absorption spectrum) is turned into a count of bonds only by a calculation.

### Nuclear magnetic resonance
The proton's resonance frequency depends on the electrons around it; a hydrogen bond pulls electron density away, so a bonded proton resonates at a *higher* shift. The shift of the water protons is about 0.5 ppm in the vapour and 4.8 ppm in the liquid at 25 °C (a gas-to-liquid shift of 4.3 ppm). It falls by about 0.01 ppm per kelvin as bonds are lost, the effect used in MRI thermometry. NMR sees a time average over milliseconds, so the liquid shows a single line however quickly the bonds break; but relaxation times report the molecule's rotation (a few picoseconds).

### Ultrafast and dielectric spectroscopy
Femtosecond infrared pulses take the movie. In two-dimensional infrared spectroscopy one pulse labels the O–H stretch frequency and a later pulse reads it again after a delay, so the loss of correlation with delay is the loss of memory of the network — the 170 fs and 1.2 ps of Fecko and colleagues (2003). Far-infrared and terahertz absorption and the dielectric response give the collective motions: the dielectric relaxation of water, 8 ps at 25 °C, is the slow rotation of the whole polarised neighbourhood.

| Method | Sees | Shutter speed | Sensitive to |
|---|---|---|---|
| infrared, Raman | O–H stretch frequency | about 10 fs | bond strength at one hydrogen |
| X-ray diffraction | O–O distances | instantaneous | shells of neighbours |
| neutron diffraction with H/D | O–O, O–H, H–H | instantaneous | the bond geometry itself |
| X-ray absorption | empty orbitals | a few fs | whether a hydrogen is bonded |
| NMR | proton shielding | milliseconds | average bonding and rotation |
| 2D-IR, THz, dielectric | frequency memory, collective modes | 0.1–10 ps | the dynamics of the network |

### Why they disagree
Ask each method "how many hydrogen bonds does a molecule have?" and you get about two from one reading of the X-ray absorption spectrum, 3.4–3.7 from simulations that count a bond by a distance and an angle or by an energy, and other values again from the infrared band. They are not wrong: each measures a different property and defines "bonded" differently. A hydrogen bond has no edge, and every method is a way of deciding where to draw it.

> [!key] The O–H stretch band at 3,400 cm⁻¹, redshifted from 3,657 in the vapour, is the most direct sign of the bond; scattering gives its distances, NMR its average effect, and femtosecond spectroscopy its flicker. Each sees a different property at a different speed, so the number of "bonds" depends on how they are counted.`,
  ideas: [`The O–H stretch absorbs at 3,657 and 3,756 cm⁻¹ in the vapour, about 3,400 (broad) in the liquid, 3,220 in ice: the lower, the stronger the bonds.`, `X-rays see the oxygen positions; neutrons with H/D substitution separate O–O, O–H and H–H distributions.`, `NMR gives the proton's average shielding (0.5 ppm in the vapour, 4.8 in the liquid) and a time average over milliseconds.`, `Femtosecond 2D-IR films the loss of correlation: the 170 fs spring and 1.2 ps rearrangement.`],
  pitfalls: [`"A spectrum shows the bonds directly" — It shows a frequency, which depends on the electric field at the hydrogen. Turning it into a count of bonds needs a model, and different models give different counts.`, `"The broad O–H band means water has a range of hydrogen bonds because the bonds differ in strength" — Partly; much of the width is the continuous range of distortions in a single connected net, so not two or three species with two or three numbers.`, `"Different experiments give different numbers of hydrogen bonds, so some of them must be wrong" — They measure different things on different timescales with different definitions of the bond. The differences are information, not error.`],
  terms: [
    { term: 'O–H stretch band', also: ['OH stretching band', '3400 cm⁻¹ band', 'stretching vibration'], def: `The infrared and Raman absorption of the O–H bond vibrating along its length: 3,657 and 3,756 cm⁻¹ in the vapour, a broad band near 3,400 cm⁻¹ in the liquid, 3,220 in ice. Its position and width record the hydrogen bonding.` },
    { term: 'Red shift', also: ['redshift', 'frequency shift', 'Badger–Bauer'], def: `A move of an absorption to a lower wavenumber. A hydrogen bond lowers the O–H stretch frequency, and the lowering grows with the strength of the bond.` },
    { term: 'HOD in D₂O', also: ['isotopic dilution', 'isolated O–H'], def: `A trace of HDO in heavy water gives single O–H oscillators surrounded by O–D groups of very different frequency, so the oscillators do not couple. The standard sample for studying one hydrogen bond's surroundings.` },
    { term: 'Isotopic substitution', also: ['H/D substitution', 'neutron scattering'], def: `Replacing hydrogen by deuterium, which scatters neutrons very differently while behaving almost identically chemically. Measurements on several isotope mixtures separate the O–O, O–H and H–H pair distributions.` },
    { term: 'Chemical shift', also: ['NMR shift', 'δ'], def: `The shift in a nucleus's resonance frequency caused by the electrons around it, in parts per million. A hydrogen-bonded proton is deshielded and resonates at a higher shift: 4.8 ppm in liquid water, 0.4 in the vapour.` },
    { term: 'Two-dimensional infrared spectroscopy', also: ['2D-IR', 'spectral diffusion measurement'], def: `A pulse sequence in which a vibration's frequency is labelled, allowed to evolve for a chosen delay, and measured again. How far the frequency has wandered after the delay shows how quickly the neighbourhood rearranges.` }
  ],
  formulas: [
    { name: 'Wavelength from wavenumber', expr: 'lam = 1/nu', tex: '\\lambda = \\frac{1}{\\tilde{\\nu}}',
      vars: { lam: { name: 'wavelength', q: 'length', unit: 'µm', tex: '\\lambda' }, nu: { name: 'wavenumber', q: 'wavenumber', unit: '1/cm', value: 3400, tex: '\\tilde{\\nu}', hint: 'The O–H stretch of liquid water is near 3,400 cm⁻¹; the free O–H of the vapour at 3,657.' } },
      solveFor: 'lam', note: '3,400 cm⁻¹ is a wavelength of 2.94 µm, a frequency of 102 THz and a period of 9.8 fs.',
      stories: { lam: 'A vibration absorbs at {nu}. What is the wavelength of the light?', nu: 'Light of wavelength {lam} excites a vibration. What is its wavenumber?' } },
    { name: 'The O–H bond as a spring', expr: 'nu = sqrt(k/mu)/(2*pi*c)', tex: '\\tilde{\\nu} = \\frac{1}{2\\pi c}\\sqrt{\\frac{k}{\\mu}}',
      vars: { nu: { name: 'wavenumber', q: 'wavenumber', unit: '1/cm', tex: '\\tilde{\\nu}' }, k: { name: 'force constant of the bond', q: 'stiffness', unit: 'N/m', value: 780, hint: 'About 780 N/m for a free O–H; about 650 once a hydrogen bond has softened it.' }, mu: { name: 'reduced mass of O and H', q: 'mass', unit: 'u', value: 0.948, tex: '\\mu', hint: 'm_O m_H/(m_O + m_H) = 0.948 u.' }, c: { const: 'c' } },
      solveFor: 'nu', note: 'A harmonic oscillator. It gives 3,740 cm⁻¹ for 780 N/m, close to the free O–H; to get the liquid\'s 3,400 the spring must be about 17 % softer (650 N/m).',
      stories: { nu: 'An O–H bond has force constant {k} and reduced mass {mu}. At what wavenumber does it absorb?', k: 'An O–H bond absorbs at {nu}. What force constant does a harmonic spring of reduced mass {mu} need?' } },
    { name: 'Scattering vector from the angle', expr: 'Q = 4*pi*sin(theta)/lam', tex: 'Q = \\frac{4\\pi \\sin\\theta}{\\lambda}',
      vars: { Q: { name: 'scattering vector', q: 'wavenumber', unit: '1/nm' }, theta: { name: 'half the scattering angle', q: 'angle', unit: '°', value: 6.5, min: 0, max: 90, tex: '\\theta' }, lam: { name: 'wavelength of the X-rays or neutrons', q: 'length', unit: 'Å', value: 0.71, tex: '\\lambda', hint: '0.71 Å for molybdenum X-rays.' } },
      solveFor: 'Q', note: 'The first diffraction peak of water lies at about 2 Å⁻¹ = 20 nm⁻¹: with molybdenum X-rays, at a scattering angle of 13°.',
      stories: { Q: 'X-rays of wavelength {lam} are scattered through twice {theta}. What is the scattering vector?' } }
  ],
  examples: [
    { title: 'What a wavenumber means', q: 'The O–H stretch band of liquid water peaks at 3,400 cm⁻¹. What are the wavelength, frequency and period?',
      steps: [{ text: 'Wavelength:', tex: '\\lambda = \\frac{1}{3400\\ \\mathrm{cm^{-1}}} = 2.94\\times10^{-4}\\ \\mathrm{cm} = 2.94\\ \\mu\\mathrm{m}' }, { text: 'Frequency:', tex: 'f = c\\tilde{\\nu} = 3.00\\times10^{10}\\ \\mathrm{cm/s} \\times 3400\\ \\mathrm{cm^{-1}} = 1.02\\times10^{14}\\ \\mathrm{Hz}' }, 'Period: $1/f = 9.8$ fs.'],
      a: '2.94 µm, 102 THz, 9.8 fs. The 170 fs hydrogen-bond oscillation is about seventeen of these O–H periods: the stretch is a fast, stiff vibration riding on the slow soft one.' },
    { title: 'How much softer is the bonded O–H?', q: 'A free O–H spring of 780 N/m absorbs at 3,740 cm⁻¹. By how much has the spring softened where the liquid absorbs at 3,400?',
      steps: ['The wavenumber varies as $\\sqrt{k}$, so $k$ scales as the square of the wavenumber.', { text: 'Ratio:', tex: '\\frac{k}{k_0} = \\left(\\frac{3400}{3740}\\right)^2 = 0.83' }, 'The force constant falls from 780 to about 650 N/m.'],
      a: 'The O–H spring is about 17 % softer in the liquid. The covalent bond is changed only modestly, which is why the hydrogen bond is a *small* perturbation of a strong bond.' }
  ],
  quiz: [
    { q: 'When a hydrogen bond forms, the O–H stretch frequency', choices: ['rises, because the hydrogen is held more tightly', 'falls, because the O–H bond is lengthened and softened', 'stays the same', 'splits into three lines'], a: 1, why: 'The hydrogen is pulled towards the neighbour, lengthening and softening the O–H bond, which lowers its stretch frequency: the red shift, about 250–450 cm⁻¹ in liquid and ice.' },
    { q: 'What is the wavelength, in micrometres, of light at 3,400 cm⁻¹?', answer: 2.94, why: '$\\lambda = 1/\\tilde{\\nu} = 1/3400$ cm = 2.94 µm.' },
    { q: 'Why is heavy water useful for neutron studies of water?', choices: ['It is denser', 'Deuterium scatters neutrons very differently from hydrogen, so mixtures of H₂O and D₂O reveal the O–H and H–H distributions separately', 'It has no hydrogen bonds', 'It freezes at a lower temperature'], a: 1, why: 'The neutron scattering length of D is positive and of H is negative, so changing the isotope changes the weight of each pair distribution in a known way.' },
    { q: 'Different techniques give different numbers of hydrogen bonds per molecule because the techniques are inaccurate.', a: false, why: 'They define "bonded" differently and observe on different timescales; an infrared band, an energy criterion and an angle cut-off do not count the same thing.' },
    { q: 'The water proton\'s NMR shift is 4.8 ppm in the liquid and 0.4 in the vapour. The larger shift in the liquid is caused by', choices: ['the hydrogen bonds withdrawing electrons from the proton', 'the higher temperature', 'the larger mass', 'the lower pressure'], a: 0, why: 'A hydrogen bond pulls electron density away from the proton, deshielding it, so it resonates at a higher shift. The shift falls by about 0.01 ppm/K as bonds are lost.' }
  ],
  applications: [`MRI thermometry: the temperature-dependent shift of the water proton lets a scanner map the temperature inside a patient during thermal treatment.`, `Sunlight in the ocean: the O–H stretch overtones are why water is blue; the harder the bond vibrates, the more red light it absorbs ([[vibrations-and-the-colour-of-water]]).`, `Infrared gas analysis and remote sensing: the water vapour lines near 2.7 µm and 6.3 µm are what an atmospheric spectrometer sees.`, `Protein science: the amide I band of a protein, near 1,650 cm⁻¹, sits on top of water's bending band at 1,640, which is why proteins are often studied in heavy water; the 2D-IR methods developed for water are now used on proteins and membranes.`],
  history: `Badger and Bauer related the red shift of the O–H stretch to the strength of the hydrogen bond in 1937. Narten and Levy gave the first reliable X-ray structure of liquid water in 1971, and Soper's neutron work from the 1980s gave all three pair distributions. The 2003 Science paper of Fecko and colleagues made the first femtosecond movie of the bond, and the 2004 X-ray absorption paper of Wernet and colleagues made the question of water's structure a public controversy.`,
  sources: [`Fecko, Eaves, Loparo, Tokmakoff and Geissler, "Ultrafast hydrogen-bond dynamics in the infrared spectroscopy of water", *Science* 301, 1698 (2003).`, `Isaacs, Shukla, Platzman, Hamann, Barbiellini and Tulk, "Covalency of the hydrogen bond in ice: a direct X-ray measurement", *Physical Review Letters* 82, 600 (1999).`, `Eisenberg and Kauzmann, *The Structure and Properties of Water* (1969): spectra, scattering and magnetic resonance of water.`, `Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017): on what remains uncertain about water's structure.`],
  sim: 'hb-spectrum'
}

);
