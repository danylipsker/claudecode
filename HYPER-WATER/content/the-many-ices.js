/* HYPER-WATER · content/the-many-ices.js — the topic "The many ices" (branch Ice).
 *   ice-ih-and-ice-ic       the one ice of the Earth and its cubic twin, and the stackings between them
 *   the-ice-rules           Bernal–Fowler, Pauling's count and the residual entropy
 *   high-pressure-ices      ices II to VII and X, hot ice, ice in diamonds
 *   hydrogen-ordered-ices   the ordered twins XI, IX, XIII, XIV, XV, XIX, VIII and why doping is needed
 *   amorphous-ices          LDA, HDA, VHDA, MDA, and the link to two liquids
 *   clathrate-hydrates      cages round gas molecules, burning ice, pipeline plugs
 *   superionic-ice          ice XVIII, laser shocks, Uranus and Neptune
 *   ice-beyond-earth        the ices of other worlds
 * Simulations: sims/the-many-ices.js (ids ices-…). Numbers come from the engine's table of ices (kit.water) where a simulation shows them.
 */
Hyper.add(

/* ================================================================ 1 */
{
  id: 'ice-ih-and-ice-ic', parent: 'the-many-ices', title: 'Ice Ih and ice Ic', level: 2,
  short: 'Every snowflake, glacier and ice cube on Earth is ice Ih, puckered layers of water stacked in the order ABAB. Stack the same layers ABCABC and you get cubic ice Ic, which forms from vapour below about −80 °C. Most "cubic ice" is really a mixture of the two, and pure ice Ic was made only in 2020.',
  keywords: ['ice Ih', 'ice Ic', 'cubic ice', 'hexagonal ice', 'stacking disorder', 'Isd', 'stacking fault', 'ABAB', 'ABCABC', 'lonsdaleite', 'diamond cubic', 'unit cell', 'snowflake symmetry', 'crystal structure of ice'],
  prereq: ['why-ice-floats', 'the-tetrahedral-network', 'what-a-hydrogen-bond-is'],
  related: ['the-ice-rules', 'snowflakes', 'supercooling-and-nucleation', 'high-pressure-ices', 'amorphous-ices', 'chemistry:crystal-structures', 'physics:crystal-structure'],
  body: `
Every piece of natural ice you have ever touched — snow, hail, a glacier, the frost on a window, the cube in a drink — is the same crystal, called **ice Ih**. Nineteen crystalline ices are known and almost none of them occur at the surface of the Earth; this one covers it. Its sixfold symmetry is why a snowflake has six arms. But ice has a second ordinary form that is built from the very same bricks, and the difference between the two is only the order in which the layers are piled.

### The brick: a molecule with four neighbours
In every ice that is stable at normal pressure each molecule is hydrogen-bonded to four others at the corners of a tetrahedron, 2.76 Å away. One of the four bonds points straight along the vertical axis (the *c-axis*); the other three slope away. The slanting bonds join the molecules into **puckered sheets**, honeycombs of six-membered rings in which half the oxygens sit a little higher than the others. The vertical bonds tie the sheets together. Seen from above, every sheet looks the same; the question is where the next one lies.

### Two ways to pile the sheets
A sheet can sit in only three lateral positions, call them A, B and C. The sheet above a layer **B** must lie over **A** or **C**, and the choice is the whole story:

- **ABAB…** — every layer returns to the position two below it. That is the hexagonal ice **Ih**. It has one axis of sixfold symmetry, the c-axis, and the rings between sheets are in a *boat* shape.
- **ABCABC…** — the position moves on at every step. That is the cubic ice **Ic**: the oxygens sit on a diamond lattice, the same arrangement as the carbon atoms of a diamond, and every ring is a *chair*.

| | Ice Ih | Ice Ic |
|---|---|---|
| Crystal system | hexagonal | cubic (diamond) |
| Stacking | ABAB… | ABCABC… |
| Unit cell | a = 4.52 Å, c = 7.37 Å, 4 molecules | a = 6.35 Å, 8 molecules |
| Oxygen–oxygen distance | 2.76 Å | 2.75 Å |
| Density near 0 °C | 916.7 kg/m³ | the same to within a fraction of a per cent |
| Where it forms | whenever water freezes at normal pressure | vapour below about −80 °C; droplets in cold clouds; warmed glassy ice |

Both have the same number of bonds, the same bond lengths and the same ring size, so their energies are almost identical: calorimetry puts ice Ic higher than Ih by something of the order of 100 J/mol, a two-hundredth of one hydrogen bond. Ih is the more stable, Ic forms when the molecules have no time to find the best arrangement.

### Most cubic ice is not cubic
Real crystals grown from vapour or from tiny supercooled droplets rarely keep to one pattern. A layer lands in the "cubic" or the "hexagonal" position almost at random, and the result is **stacking-disordered ice (Isd)**, a crystal with sequences like ABABCABCAB. Diffraction patterns of "cubic ice" made in laboratories and found in cold clouds turn out to be mixtures, often with a good half of the junctions hexagonal. Perfect **ice Ic** was first prepared in 2020, by two groups (del Rosso and colleagues; Komatsu and colleagues), who pumped the hydrogen molecules out of hydrogen-filled ices at low temperature and let the emptied water framework relax into ice Ic.

### Why it matters
Cubic ice forms in the upper atmosphere, where clouds below about −80 °C freeze from vapour and from droplets, and it may change how cirrus clouds nucleate and what the ice crystals look like. In the laboratory, glassy ice that is warmed above about 140 K crystallises as ice Ic, which is why a sample for cryo-electron microscopy must be kept cold.

> [!key] Ice Ih and ice Ic are made of identical hydrogen-bonded sheets; only the stacking differs, ABAB for the hexagonal ice of every snowflake and ABCABC for the cubic ice that forms from cold vapour. Real "cubic ice" is usually a random mixture of both, and the pure form was first made in 2020.`,
  ideas: ['Each molecule has four hydrogen-bonded neighbours at tetrahedral angles; three bonds slope, one is vertical, and the slanting bonds make puckered honeycomb sheets.', 'A sheet can sit in three positions A, B, C. ABAB… gives hexagonal ice Ih, ABCABC… gives cubic ice Ic; in both each molecule has the same four neighbours at 2.76 Å.', 'The two differ in energy by about a two-hundredth of a hydrogen bond, so crystals grown fast are mixtures: stacking-disordered ice Isd.', 'Pure ice Ic was prepared only in 2020; the cubic ice of clouds and cold laboratories is almost always a mixture.'],
  pitfalls: ['"Cubic ice is a different density of ice" — The density of Ic and Ih are almost the same, a fraction of a per cent apart; they are two stackings of one structure, not two degrees of openness.', '"Ice Ic is made at high pressure" — It forms at low pressure, from cold vapour or by warming glassy ice; the high-pressure ices are different structures with denser, interpenetrating networks.', '"All natural ice is cubic because the oxygens form a diamond lattice" — The diamond arrangement is ice Ic. Natural ice is Ih, the hexagonal twin, which is why snowflakes have six arms.'],
  terms: [
    { term: 'Ice Ic', also: ['cubic ice'], def: 'The cubic crystalline form of ice, in which the oxygens sit on a diamond lattice (stacking ABCABC…). It forms from vapour below about −80 °C and by warming glassy ice, and is metastable against ice Ih.' },
    { term: 'Stacking-disordered ice', also: ['Isd', 'stacking disordered ice I', 'stacking faults'], def: 'Ice whose sheets are piled in a random mixture of the hexagonal and the cubic order. Most samples called "cubic ice" are of this kind, with a cubic fraction between 0 and 1.' },
    { term: 'Stacking sequence', also: ['ABAB', 'ABCABC', 'layer order'], def: 'The order in which identical layers sit in the three lateral positions A, B and C. ABAB… is hexagonal, ABCABC… is cubic; a junction where the layers on both sides match is called h, one where they differ is called k.' },
    { term: 'c-axis', also: ['optic axis', 'basal plane'], def: 'The axis of sixfold symmetry of ice Ih, along which one hydrogen bond of every molecule runs. The sheets of molecules perpendicular to it are the basal planes.' },
    { term: 'Unit cell', also: ['cell'], def: 'The smallest block that, repeated in three directions, builds the whole crystal. The cell of ice Ih holds 4 molecules (a = 4.52 Å, c = 7.37 Å); that of ice Ic holds 8 (a = 6.35 Å).' }
  ],
  formulas: [
    { name: 'Density of ice Ih from its unit cell', expr: 'rho = Z*M/(NA*sqrt(3)/2*a^2*ch)', tex: '\\rho = \\frac{Z\\,M}{N_A \\cdot \\frac{\\sqrt{3}}{2}\\,a^2 c}',
      vars: { rho: { name: 'density', q: 'density', unit: 'kg/m³', tex: '\\rho' }, Z: { name: 'molecules per unit cell', value: 4, int: true, hint: 'Four molecules in the hexagonal cell of ice Ih.' }, M: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, hint: 'The mass of one mole of H₂O.' }, NA: { const: 'NA' }, a: { name: 'cell edge a', q: 'length', unit: 'pm', value: 452, hint: 'The in-plane edge of the hexagonal cell, 4.52 Å near 0 °C.' }, ch: { name: 'cell height c', q: 'length', unit: 'pm', value: 737, tex: 'c', hint: 'The height of the cell along the c-axis, 7.37 Å near 0 °C.' } },
      solveFor: 'rho', note: 'The volume of a hexagonal cell is $\\sqrt{3}/2 \\cdot a^2 c$. The result, about 917 kg/m³, agrees with the measured 916.7 to a tenth of a per cent.',
      stories: { rho: 'The hexagonal cell of ice has edge {a} and height {ch} and holds {Z} molecules of mass {M} per mole. What is the density of the ice?', a: 'A hexagonal ice cell of height {ch} holds {Z} molecules and the ice has density {rho}. What is the cell edge?' } },
    { name: 'Density of ice Ic from its cube', expr: 'rho = Z*M/(NA*a^3)', tex: '\\rho = \\frac{Z\\,M}{N_A\\,a^3}',
      vars: { rho: { name: 'density', q: 'density', unit: 'kg/m³', tex: '\\rho' }, Z: { name: 'molecules per unit cell', value: 8, int: true, hint: 'Eight molecules in the cubic cell of the diamond lattice.' }, M: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015 }, NA: { const: 'NA' }, a: { name: 'cube edge a', q: 'length', unit: 'pm', value: 635, hint: 'About 6.35 Å for ice Ic at low temperature.' } },
      solveFor: 'rho', note: 'At about 80 K the cube edge is 6.35 Å, which gives a density within half a per cent of the hexagonal ice at the same temperature.',
      stories: { rho: 'The cubic cell of ice Ic has edge {a} and holds {Z} molecules. What is the density?' } },
    { name: 'Hydrogen-bond length from the cube of ice Ic', expr: 'd = a*sqrt(3)/4', tex: 'd = \\frac{\\sqrt{3}}{4}\\,a',
      vars: { d: { name: 'oxygen–oxygen distance', q: 'length', unit: 'pm' }, a: { name: 'cube edge', q: 'length', unit: 'pm', value: 635, hint: 'In the diamond lattice the nearest neighbours lie a quarter of the way along the cube diagonal.' } },
      solveFor: 'd', note: 'The nearest neighbours in a diamond lattice are a quarter of a body diagonal apart: 275 pm, the length of the hydrogen bond in ice.',
      stories: { d: 'The cube of ice Ic has edge {a}. How far apart are the oxygens of a bonded pair?' } },
    { name: 'Thickness of a stack of layers', expr: 't = n*ch/2', tex: 't = \\frac{n\\,c}{2}',
      vars: { t: { name: 'thickness', q: 'length', unit: 'nm' }, n: { name: 'number of layers', value: 1000, int: true, hint: 'A layer here is one of the A, B or C units: two layers fit in one c-height of ice Ih.' }, ch: { name: 'cell height c', q: 'length', unit: 'pm', value: 737, tex: 'c' } },
      solveFor: 't', note: 'Each layer adds half the cell height, 3.7 Å. A thousand layers make a crystal 0.37 µm thick, thinner than the wavelength of light.',
      stories: { t: 'A thin crystal of ice Ih has {n} stacked layers. How thick is it?', n: 'A crystal of ice Ih is {t} thick. How many layers is that?' } }
  ],
  examples: [
    { title: 'From the cell to the density', q: 'The hexagonal cell of ice Ih has a = 4.52 Å and c = 7.37 Å and holds four H₂O molecules. Calculate the density and compare it with the measured 916.7 kg/m³.',
      steps: [{ text: 'Volume of the hexagonal cell:', tex: 'V = \\frac{\\sqrt{3}}{2}\\,a^2 c = 0.866 \\times 20.43 \\times 7.37\\ \\text{Å}^3 = 130.4\\ \\text{Å}^3' }, { text: 'Mass of four molecules:', tex: 'm = \\frac{4 \\times 18.015\\ \\text{g/mol}}{6.022\\times10^{23}\\ \\text{mol}^{-1}} = 1.197\\times10^{-22}\\ \\text{g}' }, 'Density: $1.197\\times10^{-22}\\ \\text{g} / 130.4\\times10^{-24}\\ \\text{cm}^3 = 0.918$ g/cm³.'],
      a: 'About 918 kg/m³, a tenth of a per cent from the measured value: the structure explains the density completely, and with it why ice floats.' },
    { title: 'Counting cubic junctions', q: 'A crystal of ice has the stacking sequence A B A B C A B C A B (ten layers). A junction at a layer is hexagonal (h) if the layers on both sides are the same and cubic (k) if they differ. How cubic is the crystal?',
      steps: ['Look at each of the eight interior layers (2 to 9) and compare its two neighbours.', 'Layer 2 (B) has A and A: h. Layer 3 (A) has B and B: h.', 'Layers 4 to 9 (B, C, A, B, C, A) each have two different neighbours: k, k, k, k, k, k.', 'Six of eight junctions are cubic.'],
      a: 'Cubic fraction 75 %: the crystal begins as ice Ih (ABAB) and ends as ice Ic (ABCABC), a stacking-disordered ice.' },
    { title: 'How thick is a stack of layers?', q: 'Using the layer spacing of ice Ih (half of c = 7.37 Å), how many layers lie in a crystal 1 µm thick?',
      steps: ['Layer spacing: $7.37/2 = 3.685$ Å $= 0.3685$ nm.', 'Number: $1000\\ \\text{nm} / 0.3685\\ \\text{nm} = 2714$.'],
      a: 'About 2,700 layers: every layer is a chance for the crystal to make a "wrong" turn, which is why thin crystals grown fast are often stacking-disordered.' }
  ],
  quiz: [
    { q: 'What is the difference between ice Ih and ice Ic?', choices: ['Ice Ih has hydrogen bonds and Ic has covalent ones', 'The same layers are stacked ABAB in Ih and ABCABC in Ic', 'Ice Ic is made of heavy water', 'Ice Ic is denser by about 10 %'], a: 1, why: 'Both are made of identical hydrogen-bonded sheets with the same bond lengths. Only the order in which the sheets sit differs, and the two ices have the same density to a fraction of a per cent.' },
    { q: 'Hexagonal ice Ih is the form of all natural snow and glacier ice on Earth.', a: true, why: 'Ice Ih is stable at everyday pressures; its hexagonal symmetry shows in the six arms of a snowflake. Cubic ice appears only in special conditions, such as very cold vapour deposits.' },
    { q: 'A crystal has the stacking sequence ABCABCABC. What is it?', choices: ['ice Ih', 'ice Ic', 'stacking-disordered ice with half cubic junctions', 'amorphous ice'], a: 1, why: 'The position moves on at every layer, so every junction is cubic: this is ice Ic with its diamond lattice.' },
    { q: 'How many water molecules are in the unit cell of cubic ice Ic?', answer: 8, why: 'The cubic cell of the diamond lattice holds eight lattice points; in ice each carries one H₂O.' },
    { q: 'Which sentence about "cubic ice" made by freezing tiny droplets in the cold is most accurate?', choices: ['It is the same as ice Ih with a different name', 'It is usually a stacking-disordered mixture of cubic and hexagonal sequences', 'It is ice VII', 'It is amorphous'], a: 1, why: 'Diffraction shows that the ice from droplets and vapour deposits generally contains both kinds of junctions at random; truly cubic ice was made only in 2020.' }
  ],
  applications: ['Snow science and atmospheric physics: the shape and nucleation of cirrus crystals depend on which stacking they grow with.', 'Cryo-electron microscopy of proteins: a sample is flash-frozen into glassy ice and must stay below about −140 °C, or it crystallises into cubic ice and spoils the grid.', 'Ice cores and glaciology: the hexagonal crystals of ice Ih slip easily along the basal planes, which is why a glacier flows.', 'Materials science: the same stacking idea (ABAB against ABC) describes silicon carbide, cobalt and the hexagonal and cubic forms of diamond.'],
  history: 'W. H. Bragg proposed the arrangement of oxygens in ice from X-ray data in 1922, and W. H. Barnes confirmed it in 1929. Hans König identified a cubic form of ice from electron diffraction of vapour-deposited films in 1943. Over the following decades "cubic ice" was shown to be mostly stacking-disordered; two groups made pure ice Ic in 2020.',
  sources: ['Petrenko and Whitworth, *Physics of Ice* (1999), the chapter on the crystal structure of ice Ih and the other low-pressure forms.', 'Murray, Knopf and Bertram, "The formation of cubic ice under conditions relevant to Earth\'s atmosphere", *Nature* 434, 202 (2005).', 'Malkin, Murray and colleagues, "Structure of ice crystallized from supercooled water", *PNAS* 109, 1041 (2012) — the stacking-disordered nature of ice grown from droplets.', 'Del Rosso and colleagues, *Nature Materials* 19, 663 (2020), and Komatsu and colleagues, *Nature Communications* 11, 464 (2020) — pure cubic ice.'],
  sim: 'ices-stacking'
},

/* ================================================================ 2 */
{
  id: 'the-ice-rules', parent: 'the-many-ices', title: 'The ice rules', level: 2,
  short: 'In ice the oxygens sit on a perfect lattice but the hydrogens are a frozen jumble that obeys two rules: two hydrogens near every oxygen, one hydrogen on every bond. Counting the arrangements the rules allow, Pauling found 1.5 per molecule and predicted a residual entropy of 3.37 J/(mol·K), which calorimetry confirmed.',
  keywords: ['ice rules', 'Bernal-Fowler rules', 'Pauling entropy', 'residual entropy', 'zero-point entropy', 'proton disorder', 'hydrogen disorder', 'Bjerrum defect', 'ionic defect', 'spin ice', 'third law', 'R ln 3/2', 'square ice', 'Lieb'],
  prereq: ['ice-ih-and-ice-ic', 'two-donors-two-acceptors', 'chemistry:entropy'],
  related: ['hydrogen-ordered-ices', 'the-proton-hops', 'high-pressure-ices', 'physics:entropy'],
  body: `
Diffraction shows something odd about ice. The oxygen atoms sit on a perfect lattice, giving sharp spots, and between each neighbouring pair of oxygens there is a single hydrogen, but it is not in the middle: it sits 0.96 Å from one oxygen and 1.8 Å from the other, and **which** oxygen is the near one changes at random from bond to bond. The crystal is ordered in its oxygens and disordered in its hydrogens, and the disorder is frozen in; it does not average away on cooling. Yet it is not complete randomness, because the molecules are still water. The rules were written down by Bernal and Fowler in 1933.

### The two rules
1. **Every oxygen has exactly two hydrogens near it** (0.96 Å away): it is an intact H₂O molecule.
2. **Every O–O line carries exactly one hydrogen**: it is a hydrogen bond, donated by one molecule and received by the other.

Any arrangement obeying both is a possible ice. Break rule 1 and you have an ion: three hydrogens near an oxygen make hydronium ($\\ce{H3O+}$), one makes hydroxide ($\\ce{OH-}$). Break rule 2 and you have a **Bjerrum defect**: two hydrogens on one bond (a D defect) or none (an L defect). Such defects exist in a real crystal in tiny numbers, and they are what let hydrogens move through ice.

### Pauling's count
In 1935 Linus Pauling counted the arrangements in a single paragraph of reasoning. Take $N$ molecules. Each has four bonds and each bond is shared by two molecules, so there are $2N$ bonds. The hydrogen on a bond can be near either end, which gives $2^{2N} = 4^N$ placements, almost all of them forbidden. Now look at one oxygen: its four bonds can carry 16 patterns of near and far hydrogens, and exactly $\\binom{4}{2} = 6$ of them have two near. So a fraction $6/16 = 3/8$ of placements pass the test at each oxygen. Treating the oxygens as independent,

$$W \\approx 4^N \\left(\\frac{3}{8}\\right)^N = \\left(\\frac{3}{2}\\right)^N$$

arrangements: **1.5 for every molecule**. Boltzmann's $S = k_B \\ln W$ then gives, for a mole,

$$S_0 = R \\ln \\frac{3}{2} = 3.37\\ \\mathrm{J/(mol\\,K)}$$

of entropy that the crystal still has at absolute zero.

### The check
The entropy of water vapour can be calculated from spectra, and also measured from the heat needed to bring the vapour from absolute zero by way of ice and water. The two differ: 45.10 against 44.28 cal/(mol·K), a gap of 0.82 cal, or 3.4 J/(mol·K). That is Pauling's number, to within two per cent. Giauque and Stout's careful calorimetry (1936) had found exactly this gap; the third law is not violated, because the entropy is real — the hydrogens froze into one of the huge number of arrangements and cannot find another. More careful counting (Nagle, 1966) gives 1.5069 arrangements per molecule and 3.41 J/(mol·K); in three dimensions no exact solution is known.

### A flat cousin you can count
Lay the same rules on a flat square lattice with four neighbours and wrap it into a torus: the number of allowed arrangements can then be found exactly. For a 4 × 4 lattice (16 oxygens, 32 bonds) there are 4.3 billion ways to place the hydrogens and 2,970 of them obey the rules — more than Pauling's estimate of 657, as Pauling's independence assumption always undercounts. For an infinite square lattice Lieb solved the problem exactly in 1967: 1.5396 per molecule. The simulation lets you place the hydrogens yourself and watch the count.

> [!key] The ice rules say two hydrogens near each oxygen and one on each bond. They leave about 1.5 arrangements per molecule, so ice keeps a residual entropy of $R\\ln(3/2) = 3.37$ J/(mol·K) at absolute zero, the first great success of counting arrangements in a crystal.`,
  ideas: ['The oxygens of ice form a perfect lattice but the hydrogens are disordered: each sits nearer to one of the two oxygens of its bond, at random.', 'The Bernal–Fowler rules: exactly two hydrogens near every oxygen, exactly one hydrogen on every O–O bond.', 'Pauling counted: $4^N$ placements times $(3/8)^N$ allowed gives $(3/2)^N$ arrangements and a residual entropy $R\\ln(3/2)=3.37$ J/(mol·K).', 'Calorimetry found 3.4 J/(mol·K), the gap between the entropy of the vapour from spectra and from heat measurements; the entropy is real, frozen in, and the third law is intact.'],
  pitfalls: ['"Ice violates the third law of thermodynamics" — The third law holds for systems in equilibrium; ice cannot rearrange its hydrogens at low temperature, so it is stuck in one arrangement among about $1.5^N$ and keeps the entropy of that choice.', '"The ice rules fix where every hydrogen is" — They only forbid arrangements. Many arrangements obey them; the hydrogen positions in a real crystal differ from molecule to molecule and are not repeated from cell to cell.', '"A hydrogen bond has the hydrogen in the middle" — In ice Ih the hydrogen is off-centre, 0.96 Å from its own oxygen and 1.8 Å from the other; it sits at the middle only at extreme pressure, in ice X.'],
  terms: [
    { term: 'Ice rules', also: ['Bernal–Fowler rules', 'ice rule', 'Bernal–Fowler–Pauling rules'], def: 'Two conditions on the hydrogens of ice: every oxygen has exactly two hydrogens near it, and every O–O line carries exactly one hydrogen. Arrangements that obey them are possible ices.' },
    { term: 'Residual entropy', also: ['zero-point entropy', 'Pauling entropy', 'configurational entropy'], def: 'The entropy a crystal keeps at absolute zero because it is frozen into one of many equal-energy arrangements. For ice it is $R\\ln(3/2) = 3.37$ J/(mol·K), from Pauling\'s count of about 1.5 arrangements per molecule.' },
    { term: 'Proton disorder', also: ['hydrogen disorder', 'orientational disorder'], def: 'The random choice, bond by bond, of which of its two oxygens each hydrogen sits near, subject to the ice rules. It is the one disorder of an otherwise perfect ice lattice.' },
    { term: 'Bjerrum defect', also: ['D defect', 'L defect', 'orientational defect'], def: 'A bond with two hydrogens (D, for doppelt) or with none (L, for leer) breaking the one-per-bond rule. Bjerrum defects move through ice by flipping molecules and let the hydrogens rearrange.' },
    { term: 'Ionic defect', also: ['H₃O⁺ defect', 'OH⁻ defect', 'hydronium and hydroxide in ice'], def: 'An oxygen with three hydrogens near it (hydronium) or one (hydroxide), breaking the two-per-oxygen rule. Ionic defects carry the small electrical current that ice conducts.' }
  ],
  formulas: [
    { name: 'Residual entropy from the arrangements per molecule', expr: 'S = R*ln(w)', tex: 'S = R\\ln w',
      vars: { S: { name: 'residual entropy', q: 'molarheat', unit: 'J/(mol·K)' }, R: { const: 'R' }, w: { name: 'arrangements per molecule', value: 1.5, min: 1, max: 4, hint: 'Pauling\'s estimate is 1.5; Nagle\'s refined count 1.5069; Lieb\'s exact value for flat square ice 1.5396.' } },
      solveFor: 'S', note: 'Boltzmann\'s $S = k_B\\ln W$ for a mole, with $W = w^N$ and $N = N_A$.',
      stories: { S: 'A crystal has {w} equally good arrangements per molecule. What residual entropy does a mole of it keep at absolute zero?', w: 'A crystal keeps a residual entropy of {S}. How many arrangements per molecule does that mean?' } },
    { name: 'Number of arrangements of N molecules', expr: 'W = w^N', tex: 'W = w^{N}',
      vars: { W: { name: 'number of arrangements' }, w: { name: 'arrangements per molecule', value: 1.5, min: 1, max: 4 }, N: { name: 'number of molecules', value: 100, int: true, min: 1, hint: 'For 16 molecules of a tiny lattice, 657; for a mole the number has $10^{23}$ digits.' } },
      solveFor: 'W', note: 'Independence of the molecules is the assumption; real counting gives a slightly higher $w$.',
      stories: { W: 'A lump of {N} molecules of ice has {w} arrangements per molecule. How many arrangements does it have?' } },
    { name: 'Pauling\'s count for one molecule', expr: 'w = k/2^(b/2)', tex: 'w = \\frac{k}{2^{b/2}}',
      vars: { w: { name: 'arrangements per molecule' }, k: { name: 'allowed patterns round one oxygen', value: 6, int: true, hint: 'Of the 16 ways four bonds can carry hydrogens near or far, 6 have exactly two near: $\\binom{4}{2}$.' }, b: { name: 'bonds per molecule', value: 4, int: true, hint: 'Four hydrogen bonds per molecule in ice.' } },
      solveFor: 'w', note: 'The $N$ molecules share $bN/2$ bonds, so there are $2^{bN/2}$ placements, and a fraction $k/2^b$ of them passes at each oxygen. Per molecule that is $2^{b/2}\\cdot k/2^b = k/2^{b/2}$: $6/4 = 1.5$.',
      stories: { w: 'Each oxygen has {b} bonds and {k} of the ways to place the hydrogens near it are allowed. How many arrangements per molecule does Pauling\'s argument give?' } },
    { name: 'The entropy gap of water', expr: 'dS = Sspec - Scal', tex: '\\Delta S = S_{\\text{spec}} - S_{\\text{cal}}',
      vars: { dS: { name: 'missing entropy', q: 'molarheat', unit: 'cal/(mol·K)', tex: '\\Delta S' }, Sspec: { name: 'entropy of water vapour from spectra', q: 'molarheat', unit: 'cal/(mol·K)', value: 45.10, tex: 'S_{\\text{spec}}', hint: 'Statistical entropy of the ideal vapour at 298 K and 1 bar from molecular spectra.' }, Scal: { name: 'entropy from calorimetry', q: 'molarheat', unit: 'cal/(mol·K)', value: 44.28, tex: 'S_{\\text{cal}}', hint: 'Entropy found by integrating heat capacity from near absolute zero, through melting and boiling (Giauque and Stout, 1936).' } },
      solveFor: 'dS', note: 'The heat measurements start from "zero entropy" ice but the ice has 3.4 J/(mol·K) of entropy at 0 K: the difference is Pauling\'s residual entropy.',
      stories: { dS: 'Spectra give a vapour entropy of {Sspec} and calorimetry gives {Scal}. By how much do they differ?' } }
  ],
  examples: [
    { title: 'A mole of ways', q: 'Use Pauling\'s count to find the number of hydrogen arrangements in a mole of ice, and the entropy that goes with it.',
      steps: [{ text: 'With $1.5$ arrangements per molecule and $N_A = 6.022\\times10^{23}$ molecules:', tex: '\\ln W = N_A \\ln 1.5 = 6.022\\times10^{23}\\times0.4055 = 2.44\\times10^{23}' }, 'So $W = e^{2.44\\times10^{23}} = 10^{1.06\\times10^{23}}$: a number written with $10^{23}$ digits.', { text: 'Entropy:', tex: 'S = k_B \\ln W = 1.381\\times10^{-23} \\times 2.44\\times10^{23} = 3.37\\ \\mathrm{J/K}' }],
      a: 'About $10^{10^{23}}$ arrangements and 3.37 J/K per mole — a figure small enough to measure, hidden behind a number too large to write.' },
    { title: 'A lattice small enough to count', q: 'On a periodic 4 × 4 lattice of 16 oxygens with 32 bonds, 2,970 arrangements obey the ice rules. How many placements are there in all, what fraction obeys the rules, and what does Pauling predict?',
      steps: ['Each of the 32 bonds has its hydrogen at one of two ends: $2^{32} = 4\\,294\\,967\\,296$ placements.', { text: 'The fraction that obeys both rules:', tex: '2970 / 4.29\\times10^9 = 6.9\\times10^{-7}' }, { text: 'Pauling\'s estimate for $N = 16$:', tex: '(3/2)^{16} = 657' }, 'The exact count per oxygen is $2970^{1/16} = 1.648$, higher than Pauling\'s 1.5 because the oxygens are not independent; it falls towards Lieb\'s 1.540 on larger lattices.'],
      a: 'Fewer than one placement in a million obeys the rules, yet there are 2,970 of them: the rules are strict, but they leave a lot of room.' },
    { title: 'The missing entropy of water', q: 'Giauque and Stout found a gap of 0.82 cal/(mol·K) between the spectroscopic and the calorimetric entropy of water vapour. Compare it with Pauling\'s $R\\ln(3/2)$.',
      steps: [{ text: 'Pauling\'s value:', tex: 'R \\ln 1.5 = 8.314 \\times 0.4055 = 3.37\\ \\mathrm{J/(mol\\,K)}' }, 'Convert the gap: $0.82 \\times 4.184 = 3.43$ J/(mol·K).', 'The difference is $0.06$ J/(mol·K), under 2 %.'],
      a: 'The measured gap and the counted entropy agree within the experimental error — a simple counting argument predicted a number from calorimetry.' }
  ],
  quiz: [
    { q: 'How many hydrogen atoms are near each oxygen in ice, according to the ice rules?', choices: ['One', 'Two', 'Three', 'Four'], a: 1, why: 'Each oxygen belongs to an intact H₂O molecule, with two hydrogens at 0.96 Å. The other two hydrogen-bond neighbours are 1.8 Å away.' },
    { q: 'The ice rules fix the position of every hydrogen in the crystal.', a: false, why: 'They only exclude arrangements. About 1.5 allowed arrangements per molecule remain, so the hydrogens of an ordinary crystal are disordered.' },
    { q: 'Pauling\'s residual entropy of ice is $R\\ln(3/2)$. Give its value in J/(mol·K).', answer: 3.37, why: '$8.314 \\times \\ln 1.5 = 8.314 \\times 0.4055 = 3.37$; calorimetry found about 3.4.' },
    { q: 'An oxygen with three hydrogens near it, in a crystal that otherwise obeys the ice rules, is', choices: ['a hydroxide ion OH⁻', 'a hydronium ion H₃O⁺', 'a Bjerrum D defect', 'a normal water molecule'], a: 1, why: 'Three near hydrogens means H₃O⁺. A single near hydrogen is OH⁻. Bjerrum defects concern the number of hydrogens on a bond, not on an oxygen.' },
    { q: 'Why does ice have entropy at absolute zero?', choices: ['Its oxygen lattice vibrates even at 0 K', 'It is frozen into one of many equally good hydrogen arrangements and cannot rearrange', 'The third law does not apply to water', 'Its hydrogen bonds are broken'], a: 1, why: 'The disorder is of arrangement, not of motion: the crystal stays in the pattern it froze in, and the entropy of having chosen one among $1.5^N$ remains.' }
  ],
  applications: ['The dielectric constant and weak electrical conductivity of ice: both are carried by the defects through which the hydrogens rearrange.', '**Spin ice** magnets (such as holmium titanate) have magnetic moments obeying "two in, two out" rules like ice\'s, and show Pauling\'s entropy (Ramirez and colleagues, 1999).', 'Statistical mechanics: the same counting is the six-vertex model, solved exactly in two dimensions by Lieb and extended by Baxter.', 'Water between sheets of graphene can form a flat "square ice" in which each oxygen has four neighbours (observed in 2015), a real cousin of the lattice in the simulation.'],
  history: 'Bernal and Fowler, in a paper of 1933 on the structure of water and ionic solutions, proposed the two rules. Giauque and Ashley noticed in 1933 that the entropy of water from heat measurements fell short of that from spectra; Pauling explained the shortfall in 1935; Giauque and Stout\'s careful 1936 measurement confirmed it. Nagle refined the count in 1966, and Lieb solved the flat square-lattice version exactly in 1967.',
  sources: ['Bernal and Fowler, "A theory of water and ionic solution, with particular reference to hydrogen and hydroxyl ions", *Journal of Chemical Physics* 1, 515 (1933).', 'Pauling, "The structure and entropy of ice and of other crystals with some randomness of atomic arrangement", *Journal of the American Chemical Society* 57, 2680 (1935).', 'Giauque and Stout, "The entropy of water and the third law of thermodynamics. The heat capacity of ice from 15 to 273 K", *Journal of the American Chemical Society* 58, 1144 (1936).', 'Nagle, "Lattice statistics of hydrogen bonded crystals. I. The residual entropy of ice", *Journal of Mathematical Physics* 7, 1484 (1966); Petrenko and Whitworth, *Physics of Ice* (1999).'],
  sim: 'ices-rules'
},

/* ================================================================ 3 */
{
  id: 'high-pressure-ices', parent: 'the-many-ices', title: 'The high-pressure ices', level: 2,
  short: 'Squeeze water and it freezes into ices unlike the one in the freezer: II, III, V, VI, VII, all denser than the liquid, with ice VII solid at temperatures far above boiling. At room temperature water freezes at about 1 GPa into ice VI, and ice VII has been found inside diamonds from deep in the Earth.',
  keywords: ['high-pressure ice', 'ice II', 'ice III', 'ice V', 'ice VI', 'ice VII', 'ice X', 'hot ice', 'Bridgman', 'Tammann', 'diamond anvil', 'diamond inclusion', 'melting curve', 'ice in the mantle', 'GPa', 'symmetric ice'],
  prereq: ['the-phase-diagram', 'why-ice-floats', 'ice-ih-and-ice-ic'],
  related: ['hydrogen-ordered-ices', 'superionic-ice', 'ice-beyond-earth', 'ganymede-and-callisto', 'amorphous-ices', 'chemistry:phase-diagrams', 'chemistry:clausius-clapeyron'],
  body: `
Put a drop of water between the tips of two diamonds and press them together. At first nothing happens, and then at about 1 GPa — nearly ten thousand atmospheres, the pressure at the base of a 35-km column of rock — the drop freezes. The solid that forms is not the ice of the freezer. It sinks in the liquid it came from. It is **ice VI**, and it forms at room temperature.

### Why squeezing makes more ices
The open lattice of ice Ih holds each molecule at four straight bonds, and a lot of empty space. Pressure favours the denser arrangement, and ice has several ways of getting there without giving up its bonds. Bend the bonds and the lattice collapses to ice II and III, more than a quarter denser. Weave two independent networks through each other, each a hydrogen-bonded lattice of its own with no bonds between them: that is **ice VI**, and, with two interpenetrating diamond lattices, **ice VII**. The molecules in ice VII are crowded in a body-centred cubic pattern; each still has four hydrogen bonds, but eight nearest neighbours. At about 62 GPa the oxygen atoms come so close that the hydrogen is pushed to the middle of the bond and the molecules lose their identity: **ice X**.

| Ice | First found | Stable roughly at | Density, g/cm³ |
|---|---|---|---|
| Ih | — | below 0.2 GPa | 0.92 |
| II, III | Tammann, 1900 | 0.2–0.35 GPa, cold | 1.17, 1.16 |
| V | Bridgman, 1912 | 0.35–0.63 GPa | 1.23 |
| VI | Bridgman, 1912 | 0.63–2.2 GPa | 1.31 |
| VII | Bridgman, 1937 | 2.2–62 GPa | 1.50 and up |
| X | Polian and Grimsditch, 1984 | above 62 GPa | 2.5 |

Every one of them is denser than the liquid, so their melting temperatures rise with pressure. Squeezing ice Ih does the opposite, lowering its melting point to −22 °C at 210 MPa; there ice III takes over, and from then on the melting curve climbs and never turns back.

### Hot ice
The melting curve of ice VII is startling: 355 K (82 °C) at 2.2 GPa, about 510 K at 5 GPa, about 610 K at 10 GPa — a solid that melts 240 K above the temperature where water boils at one atmosphere. This is **hot ice**: ice VII is stable at temperatures above 100 °C, and the same dense structure is found far hotter still. Ice at 300 °C sounds like a contradiction only because we judge water at one atmosphere.

### Ice in diamonds
In 2018 Oliver Tschauner and colleagues found tiny inclusions of ice VII in diamonds that had formed deep in the Earth. As the diamonds grew in the mantle they trapped droplets of water-rich fluid; as they travelled upwards and cooled, the fluid froze into ice VII, still held at a pressure of several gigapascals by the diamond. The ice is evidence that water exists in the deep mantle; it has since been recognised as a mineral, ice-VII.

### What it means
A diamond-anvil cell makes these ices in a laboratory, but nature makes them wherever a layer of water is thick enough. The pressure at the foot of a layer of depth $h$ on a world of gravity $g$ is $\\rho g h$; Ganymede, with a water layer hundreds of kilometres thick, has ice V and VI deep inside, and a water-rich planet bigger than the Earth would have ice VII and X.

> [!key] Beyond about 0.2 GPa water freezes into denser ices — II, III, V, VI and VII — each with more interlocked hydrogen-bonded networks, and ice VII stays solid far above 100 °C. They are the ices of the deep interiors of icy moons and of water-rich planets, and a few have been brought to the surface inside diamonds.`,
  ideas: ['Above about 0.2 GPa the open lattice of ice Ih gives way to denser ices: II and III bend the bonds, VI and VII weave two networks through each other, and X puts the hydrogen in the middle of the bond.', 'At room temperature water freezes at about 0.96 GPa into ice VI and at about 2.2 GPa becomes ice VII.', 'Ice VII melts at 355 K at 2.2 GPa and at ever higher temperatures as the pressure rises: hot ice.', 'Ice VII was found in diamond inclusions in 2018, a witness of water in the deep mantle; the pressure at the base of a layer of water is $\\rho g h$.'],
  pitfalls: ['"Ice is always cold" — Ice is defined by structure, not temperature. Ice VII is a solid at 300 °C if the pressure is high enough, and the ices of planetary interiors are hot.', '"All ice floats" — Only ice Ih (and its twins, XI, Ic and the like) is lighter than water. Every ice above 0.2 GPa is denser than the liquid and sinks in it.', '"High-pressure ice is a new kind of water" — The molecules are still H₂O (until ice X); it is the arrangement that changes, from an open lattice to interlocked networks.'],
  terms: [
    { term: 'High-pressure ice', also: ['ices II to VII', 'dense ices'], def: 'Any of the crystalline ices that are stable only above about 0.2 GPa: II, III, V, VI, VII and X. All are denser than liquid water.' },
    { term: 'Ice VII', also: ['ice 7', 'hot ice'], def: 'A cubic ice made of two interpenetrating diamond lattices, stable from about 2.2 to 62 GPa and up to more than 700 K. It melts at 355 K at 2.216 GPa; found in diamond inclusions in 2018, it is also a recognised mineral.' },
    { term: 'Ice X', also: ['symmetric ice', 'proton-centred ice'], def: 'The ice above about 62 GPa in which each hydrogen sits midway between two oxygens, so that discrete H₂O molecules no longer exist.' },
    { term: 'Diamond anvil cell', also: ['DAC', 'diamond anvil'], def: 'A device that squeezes a tiny sample between the flat tips of two diamonds, reaching pressures of hundreds of gigapascals while the sample can still be seen through the diamonds.' },
    { term: 'Interpenetrating networks', also: ['interpenetrating lattices'], def: 'Two or more independent hydrogen-bonded networks that pass through the same space with no bonds between them. Ice VI has two; ice VII two diamond-type lattices.' }
  ],
  formulas: [
    { name: 'Melting pressure of ice VI', expr: 'p = pn*(1 - a*(1 - (T/Tn)^b))', tex: 'p = p_n\\left[1 - a\\left(1 - \\left(\\frac{T}{T_n}\\right)^{b}\\right)\\right]',
      vars: { p: { name: 'melting pressure', q: 'pressure', unit: 'GPa' }, pn: { name: 'reference pressure', q: 'pressure', unit: 'MPa', value: 632.4, fixed: true, tex: 'p_n', hint: 'The pressure of the ice V–VI–liquid triple point.' }, a: { name: 'curve parameter a', value: 1.07476, fixed: true, tex: 'a' }, b: { name: 'curve exponent b', value: 4.6, fixed: true, tex: 'b' }, T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15, min: 273.31, max: 355, hint: 'The fit is valid from 273.31 K, the triple point, to 355 K.' }, Tn: { name: 'reference temperature', q: 'temperature', unit: 'K', value: 273.31, fixed: true, tex: 'T_n' } },
      solveFor: 'p', note: 'The IAPWS melting-pressure equation for ice VI, valid from 273.31 K to 355 K. Water at 25 °C (298.15 K) therefore freezes at 0.97 GPa.',
      stories: { p: 'Water is squeezed at a constant {T}. At what pressure does it freeze into ice VI?', T: 'Ice VI melts at a pressure of {p}. At what temperature?' } },
    { name: 'Melting pressure of ice VII', expr: 'p = pn*exp(a1*(1 - Tn/T) - a2*(1 - (T/Tn)^5) + a3*(1 - (T/Tn)^22))', tex: 'p = p_n \\exp\\left[a_1\\left(1 - \\frac{T_n}{T}\\right) - a_2\\left(1 - \\left(\\frac{T}{T_n}\\right)^{5}\\right) + a_3\\left(1 - \\left(\\frac{T}{T_n}\\right)^{22}\\right)\\right]',
      vars: { p: { name: 'melting pressure', q: 'pressure', unit: 'GPa' }, pn: { name: 'reference pressure', q: 'pressure', unit: 'GPa', value: 2.216, fixed: true, tex: 'p_n' }, Tn: { name: 'reference temperature', q: 'temperature', unit: 'K', value: 355, fixed: true, tex: 'T_n' }, T: { name: 'temperature', q: 'temperature', unit: 'K', value: 500, min: 355, max: 715, hint: 'Valid from 355 K (ice VI–VII–liquid) to 715 K.' }, a1: { name: 'coefficient a₁', value: 1.73683, fixed: true, tex: 'a_1' }, a2: { name: 'coefficient a₂', value: 0.0544606, fixed: true, tex: 'a_2' }, a3: { name: 'coefficient a₃', value: 8.06106e-8, fixed: true, tex: 'a_3' } },
      solveFor: 'p', note: 'The IAPWS melting-pressure equation for ice VII. At 500 K (227 °C) ice VII melts at 4.7 GPa; solve for the temperature at 10 GPa to find the hot-ice limit, about 610 K.',
      stories: { p: 'Ice VII is heated to {T}. At what pressure does it melt?', T: 'Ice VII melts under {p}. At what temperature?' } },
    { name: 'Pressure at the bottom of a layer of water', expr: 'p = rho*gs*h', tex: 'p = \\rho\\, g\\, h',
      vars: { p: { name: 'pressure at the base', q: 'pressure', unit: 'GPa' }, rho: { name: 'mean density of the layer', q: 'density', unit: 'kg/m³', value: 1100, tex: '\\rho', hint: 'Between 1,000 (liquid) and 1,300 (ice VI); 1,100 is typical for an ocean plus ice shell.' }, gs: { name: 'gravity of the world', q: 'accel', unit: 'm/s²', value: 1.43, tex: 'g', hint: 'Europa 1.31, Ganymede 1.43, Titan 1.35, Earth 9.81 m/s².' }, h: { name: 'depth', q: 'length', unit: 'km', value: 800 } },
      solveFor: 'p', note: 'Gravity falls with depth in a real body, so this overestimates a little; it gives the right ice for a first look.',
      stories: { p: 'A world of surface gravity {gs} has a water layer {h} thick of mean density {rho}. What is the pressure at its base?', h: 'On a world of gravity {gs}, the pressure reaches {p} at what depth in water of density {rho}?' } }
  ],
  examples: [
    { title: 'Freezing a drop at room temperature', q: 'At what pressure does water at 25 °C freeze, and into which ice?',
      steps: [{ text: 'Use the melting curve of ice VI with $T = 298.15$ K, $T_n = 273.31$ K:', tex: '\\left(\\frac{T}{T_n}\\right)^{4.6} = 1.0909^{4.6} = 1.4918' }, { text: 'Then', tex: 'p = 632.4\\,[1 - 1.07476\\,(1 - 1.4918)] = 632.4 \\times 1.5286 = 967\\ \\mathrm{MPa}' }, 'That is below ice VI\'s upper limit near 2.2 GPa, so ice VI is what forms.'],
      a: 'About 0.97 GPa (9,500 atmospheres): water at room temperature freezes into ice VI, a solid denser than the liquid.' },
    { title: 'How hot can ice be?', q: 'Ice VII melts under 4.7 GPa at 500 K. Compare with the boiling point of water at 1 atm, and say what this means for planets.',
      steps: ['500 K is 227 °C, 127 K above the boiling point at 1 atm.', 'Solving the ice VII curve for $p = 10$ GPa gives about 610 K, 337 °C; for 20 GPa, near 700 K.', 'Inside a large icy moon or a water-rich planet, temperatures of 200 to 400 °C at several GPa leave the water frozen as ice VII.'],
      a: 'Ice can be hotter than boiling water: a solid at 337 °C under 10 GPa. The "ice" of a planet\'s interior need not be cold.' },
    { title: 'The base of Ganymede\'s water', q: 'Ganymede\'s surface gravity is 1.43 m/s² and models give a water layer (ice and ocean) up to about 800 km thick of mean density 1,100 kg/m³. Which ice lies at the base?',
      steps: [{ text: 'Pressure at the base:', tex: 'p = \\rho g h = 1100 \\times 1.43 \\times 8\\times10^{5}\\ \\mathrm{Pa} = 1.26\\ \\mathrm{GPa}' }, 'From the table, ice VI is stable between 0.63 and 2.2 GPa. (The pressure reaches 0.2 GPa, where the first high-pressure ices begin, at a depth of about 130 km.)'],
      a: 'About 1.3 GPa: the base is ice VI. Ganymede\'s water layer is a sandwich of ice Ih at the top, an ocean, and denser ices below.' }
  ],
  quiz: [
    { q: 'Water at 25 °C is slowly compressed. What is the first ice to form?', choices: ['ice Ih at about 0.1 GPa', 'ice III at about 0.3 GPa', 'ice VI at about 1 GPa', 'ice X at about 10 GPa'], a: 2, why: 'At room temperature the melting curve of ice VI is crossed at 0.97 GPa. The cold ices Ih, II, III and V lie at lower temperatures.' },
    { q: 'Every crystalline ice floats on liquid water.', a: false, why: 'Only ice Ih and its relatives, with 0.92 g/cm³ or less, float. The high-pressure ices II to X are 1.16 to 2.5 g/cm³ and sink.' },
    { q: 'The lowest melting temperature of ice Ih on its melting curve is about how many °C? (It occurs at 210 MPa, where ice III appears.)', answer: -22, why: 'The ice Ih–III–liquid triple point is at 251 K (−22 °C) and 209.9 MPa. Beyond it the melting curve rises, because the new ice is denser than the liquid.' },
    { q: 'Which ice was found as inclusions in diamonds from the deep Earth in 2018?', choices: ['Ice Ic', 'Ice VII', 'Ice XIX', 'Ice Ih'], a: 1, why: 'Ice VII, formed from water-rich fluid trapped in the diamonds and held at several GPa by the diamond, gave evidence of water deep in the mantle.' },
    { q: 'In ice X, each hydrogen sits halfway between two oxygens.', a: true, why: 'Above about 62 GPa the O–O distance is so short that the hydrogen is centred in the bond; there are no longer separate H₂O molecules.' },
    { q: 'Why can ice VII exist at temperatures above 100 °C?', choices: ['It is made of heavy water', 'Its melting temperature rises steeply with pressure, to 355 K at 2.2 GPa and beyond', 'It is not really solid', 'Boiling needs a lower pressure'], a: 1, why: 'The liquid is less dense than the ice, so squeezing favours the solid. At 10 GPa it melts at about 610 K, so at 400 K it is firmly frozen.' }
  ],
  applications: ['Interior models of icy moons (Ganymede, Callisto, Titan) and of water-rich planets use the melting curves above to place their oceans and high-pressure ice layers.', 'Diamond inclusions as probes of the deep Earth: ice VII records that water was present in the mantle where the diamond grew.', 'Shock and static compression experiments, which use the high-pressure ices to calibrate pressure and to model giant-planet interiors.', 'High-pressure food processing, which squeezes food to 400–600 MPa to inactivate microbes, and pressure-shift freezing, which uses the lowered melting point of ice Ih.'],
  history: 'Gustav Tammann found ices II and III in Göttingen in 1900, while measuring how the melting of ice changes with pressure. Percy Bridgman, who built pressure equipment that reached about 10 GPa, found ices V and VI in 1912 and VII in 1937, and received the Nobel Prize in Physics in 1946 for his work on high pressure. Ice X was identified by Polian and Grimsditch in 1984. The IAPWS published the melting curves used here in 2011, and the diamond inclusions were reported in 2018.',
  sources: ['Bridgman, "Water, in the liquid and five solid forms, under pressure", *Proceedings of the American Academy of Arts and Sciences* 47, 441 (1912), and *Journal of Chemical Physics* 5, 964 (1937).', 'IAPWS, *Revised Release on the Pressure along the Melting and Sublimation Curves of Ordinary Water Substance* (R14-08, 2011) — the melting pressures of ices Ih, III, V, VI and VII.', 'Tschauner and colleagues, "Ice-VII inclusions in diamonds: evidence for aqueous fluid in Earth\'s deep mantle", *Science* 359, 1136 (2018).', 'Petrenko and Whitworth, *Physics of Ice* (1999); Gasser and colleagues, *Nature Communications* 12, 1128 (2021), for ices VI, XV and XIX.'],
  sim: { id: 'ices-compress', params: { go: 'vi' } }
},

/* ================================================================ 4 */
{
  id: 'hydrogen-ordered-ices', parent: 'the-many-ices', title: 'Hydrogen-ordered ices', level: 3,
  short: 'Most ices have a hydrogen-ordered twin that appears when the crystal is cooled: Ih turns into XI, III into IX, V into XIII, VI into XV or XIX, VII into VIII, XII into XIV. The oxygens do not move, the hydrogens choose one pattern, and in pure ice this takes longer than the age of the universe unless a trace of acid or base lets the hydrogens move.',
  keywords: ['ice XI', 'ice IX', 'ice VIII', 'ice XIII', 'ice XIV', 'ice XV', 'ice XIX', 'hydrogen ordering', 'proton ordering', 'ferroelectric ice', 'antiferroelectric', 'KOH doping', 'HCl doping', 'order-disorder transition', 'Ice XIX'],
  prereq: ['the-ice-rules', 'high-pressure-ices', 'ice-ih-and-ice-ic'],
  related: ['amorphous-ices', 'the-proton-hops', 'superionic-ice', 'ice-beyond-earth', 'quantum-effects-in-water', 'chemistry:entropy'],
  body: `
The ice rules leave about 1.5 arrangements for every molecule, and ordinary ice keeps all of them. But not all arrangements have exactly the same energy: neighbouring molecules feel each other\'s dipoles, and some patterns of hydrogens are slightly better than others, by a few hundred joules per mole. Cool a crystal enough, and it should pick the best pattern and shed its **residual entropy**. When it does, the hydrogens line up, the oxygens do not move at all, and the result is a new ice: the **hydrogen-ordered twin** of the one you started with.

### The pairs
| Disordered ice | Ordered twin | Found | Ordered below | Pattern |
|---|---|---|---|---|
| Ih | **XI** | 1972–82 | 72 K | ferroelectric: all the dipoles point the same way |
| III | **IX** | 1968 | about 165 K | antiferroelectric |
| V | **XIII** | 2006 | 110 K | monoclinic ordering (HCl-doped) |
| XII | **XIV** | 2006 | 118 K | orthorhombic ordering (HCl-doped) |
| VI | **XV** | 2009 | 130 K | antiferroelectric |
| VI | **XIX** | 2021 | 100 K | a second ordering of the same oxygens |
| VII | **VIII** | 1966 | below about 273 K | antiferroelectric |

Ice II, with its hydrogens already ordered, has no twin of this kind. Ice VII is the parent of VIII, and ice X, where hydrogen sits in the middle of the bond, has nothing left to order.

### The wait that never ends
Why are the ordered twins so hard to make? The hydrogens can only rearrange by moving defects — a Bjerrum defect hopping from bond to bond, or an ion — and the number of those in pure ice at 70 K is tiny. The relaxation time of pure ice grows from about 20 µs at 0 °C with an activation energy of 55 kJ/mol, so at 72 K it is of the order of $10^{25}$ seconds: ten million times the age of the universe. Pure ice Ih will never become ice XI in a laboratory, however patient the experimenter.

The key is **doping**. In 1972 Kawada found a change in the electrical behaviour of ice doped with potassium hydroxide at about 72 K; Tajima, Matsuo and Suga measured the heat released as the doped crystal ordered, a clear signal of the transition (1982); and neutron diffraction later showed the orthorhombic, ferroelectric structure. The hydroxide ions give the hydrogens a way to move. In the same way hydrochloric acid (HCl) allowed Salzmann and his colleagues to make ices XIII and XIV in 2006, and XV in 2009, by slow cooling under pressure.

### Ice XIX, and a lesson
Ice VI, stable near 1 GPa, was thought to have a single ordered twin, ice XV. In 2021 groups in Innsbruck (Thomas Loerting) and Tokyo (Ryo Yamane) found a second one, ice XIX, made by cooling slowly at about 2 GPa and checked by neutron diffraction and calorimetry. On warming it turns into ice XV above 107 K and into ice VI at 128 K. That brought the number of known crystalline ices to nineteen, and showed that the same oxygen framework can be ordered in more than one way.

### Where it might exist
The ordering is a thermodynamic tendency, so at the cold end of the Solar System, where bodies have waited billions of years, ice XI might form in the outer ice. Fukazawa and colleagues argued in 2006 that ferroelectric ice could exist in the outer Solar System and beyond; nobody has yet seen it there.

> [!key] Cooled, most ices exchange their hydrogen jumble for one orderly pattern: Ih to XI, III to IX, V to XIII, VI to XV or XIX, VII to VIII. The patterns differ by a few hundred joules per mole, so ordering happens near 70–270 K, but only when a trace of KOH or HCl lets the hydrogens move.`,
  ideas: ['Ordered ices keep the oxygen lattice of their parent; only the hydrogens settle into a single pattern, which is ferroelectric (XI) or antiferroelectric (IX, XV, VIII) in the best-known cases.', 'Ordering removes up to the residual entropy $R\\ln(3/2) = 3.37$ J/(mol·K), and the transition temperatures (72 K for XI, 273 K for VIII) reflect small energy differences.', 'In pure ice the hydrogens rearrange so slowly at these temperatures that nothing happens; KOH or HCl supply defects that let them move.', 'Ice XIX, found in 2021, is a second ordered form of ice VI, so the same oxygens can be ordered in more than one way.'],
  pitfalls: ['"Ice XI is what ice becomes in a freezer at −20 °C" — Ice XI is stable only below 72 K (−201 °C); a household freezer is nowhere near, and pure ice would not order there in any case.', '"The ordered ices are denser versions of the originals" — The oxygens do not move and the density hardly changes (ice III 1.16, ice IX 1.16 g/cm³); only the hydrogens settle.', '"Doping with KOH changes ice into a different substance" — A few parts per million are enough to unlock the hydrogens; the crystal is still water ice.'],
  terms: [
    { term: 'Hydrogen-ordered ice', also: ['proton-ordered ice', 'ordered twin'], def: 'A form of ice in which the hydrogens occupy one definite pattern on a lattice of oxygens identical with that of a disordered parent ice. Examples: XI (of Ih), IX (of III), XIII (of V), XIV (of XII), XV and XIX (of VI), VIII (of VII).' },
    { term: 'Ferroelectric ice', also: ['ice XI'], def: 'An ice in which all the water dipoles point the same way, so the crystal has a net electric polarisation. Ice XI is the hydrogen-ordered form of ice Ih, stable below 72 K.' },
    { term: 'Antiferroelectric ordering', also: ['antipolar order'], def: 'An ordering of the hydrogens in which neighbouring dipoles point in opposite directions, so the crystal has no net polarisation. Ices IX, XV and VIII are of this kind.' },
    { term: 'Doping', also: ['KOH doping', 'HCl doping', 'dopant'], def: 'Adding a few parts per million of a base such as KOH or an acid such as HCl, whose ions act as mobile defects that let the hydrogens of cold ice rearrange and reach their ordered pattern.' },
    { term: 'Order–disorder transition', also: ['ordering transition'], def: 'A change at which some part of a crystal (here the hydrogens) goes from a random arrangement above a critical temperature to a regular one below it, releasing the entropy of the disorder.' }
  ],
  formulas: [
    { name: 'Heat released by ordering', expr: 'Q = T*dS', tex: 'Q = T\\,\\Delta S',
      vars: { Q: { name: 'heat released per mole', q: 'molarenergy', unit: 'J/mol' }, T: { name: 'transition temperature', q: 'temperature', unit: 'K', value: 72, min: 1, hint: '72 K for ice XI, about 165 K for IX, 273 K for VIII.' }, dS: { name: 'entropy removed by ordering', q: 'molarheat', unit: 'J/(mol·K)', value: 3.37, tex: '\\Delta S', hint: 'The most that can be removed is Pauling\'s $R\\ln(3/2) = 3.37$ J/(mol·K); real transitions remove part of it.' } },
      solveFor: 'Q', note: 'An upper bound: the heat per mole if the transition removed all of Pauling\'s entropy at its temperature. Measured transitions are partial.',
      stories: { Q: 'An ice orders at {T} and sheds {dS} of entropy. How much heat does it give out per mole?' } },
    { name: 'How long the hydrogens take to rearrange', expr: 'tau = tau0*exp(Ea/R*(1/T - 1/T0))', tex: '\\tau = \\tau_0 \\exp\\left[\\frac{E_a}{R}\\left(\\frac{1}{T} - \\frac{1}{T_0}\\right)\\right]',
      vars: { tau: { name: 'relaxation time', q: 'time', unit: 'yr', tex: '\\tau' }, tau0: { name: 'relaxation time at 0 °C', q: 'time', unit: 'µs', value: 20, tex: '\\tau_0', hint: 'About 20 µs for pure ice Ih at 273 K (dielectric measurements).' }, Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 55, hint: 'About 55 kJ/mol (0.57 eV) for pure ice; doping lowers the barrier.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: 'K', value: 72, min: 20, max: 273.15 }, T0: { const: 'T0' } },
      solveFor: 'tau', note: 'An Arrhenius extrapolation. The age of the universe is $1.4\\times10^{10}$ years; the answer for ice at 72 K exceeds it by seven orders of magnitude.',
      stories: { tau: 'Pure ice rearranges its hydrogens in {tau0} at 0 °C, with an activation energy of {Ea}. How long does it take at {T}?', T: 'At what temperature does pure ice take {tau} to rearrange its hydrogens?' } },
    { name: 'How completely an ice has ordered', expr: 'x = dS/(R*ln(w))', tex: 'x = \\frac{\\Delta S}{R\\ln w}',
      vars: { x: { name: 'degree of ordering', q: 'ratio', unit: '%' }, dS: { name: 'entropy removed (measured)', q: 'molarheat', unit: 'J/(mol·K)', value: 2, tex: '\\Delta S' }, R: { const: 'R' }, w: { name: 'arrangements per molecule', value: 1.5, fixed: true, hint: 'Pauling\'s 1.5.' } },
      solveFor: 'x', note: 'Compares the entropy removed with Pauling\'s $R\\ln(3/2)$; 100 % would be a perfectly ordered crystal.',
      stories: { x: 'Calorimetry shows that an ice has lost {dS} of entropy on ordering. What fraction of the possible 3.37 J/(mol·K) is that?' } }
  ],
  examples: [
    { title: 'Why ice Ih never becomes ice XI by itself', q: 'Pure ice relaxes in about 20 µs at 273 K with an activation energy of 55 kJ/mol. Estimate the time at 72 K and compare it with the age of the universe.',
      steps: [{ text: 'Arrhenius extrapolation:', tex: '\\frac{\\tau}{\\tau_0} = \\exp\\left[\\frac{55\\,000}{8.314}\\left(\\frac{1}{72} - \\frac{1}{273}\\right)\\right] = \\exp(67.7) = 2.4\\times10^{29}' }, '$\\tau = 20\\times10^{-6}\\ \\mathrm{s} \\times 2.4\\times10^{29} = 4.8\\times10^{24}$ s, which is $1.5\\times10^{17}$ years.', 'The universe is $1.4\\times10^{10}$ years old: the ratio is about eleven million.'],
      a: 'About $10^{17}$ years: pure ice Ih will never order into ice XI, which is why doping, or geological time, is needed.' },
    { title: 'The heat of ordering', q: 'If ice XI formed with the complete removal of Pauling\'s residual entropy at 72 K, what heat would be released per mole?',
      steps: [{ text: '$\\Delta S = R\\ln(3/2) = 3.37$ J/(mol·K), so', tex: 'Q = T\\,\\Delta S = 72\\ \\mathrm{K} \\times 3.37\\ \\mathrm{J/(mol\\,K)} = 243\\ \\mathrm{J/mol}' }, 'Compare with a hydrogen bond, 20 kJ/mol: the heat is about a hundredth of it.'],
      a: 'At most about 240 J/mol, about a hundredth of a hydrogen bond. The ordering energy is tiny, which is why the transition is at 72 K and not at 700 K.' }
  ],
  quiz: [
    { q: 'Which pair shows a disordered ice and its hydrogen-ordered twin?', choices: ['Ice Ih and ice Ic', 'Ice III and ice IX', 'Ice VII and ice X', 'Ice II and ice VI'], a: 1, why: 'Ice IX is the ordered form of ice III. Ih and Ic differ in stacking, VII and X in how the hydrogen is placed in the bond, and II and VI are different oxygen lattices.' },
    { q: 'Pure ice Ih turns into ice XI within hours when cooled below 72 K.', a: false, why: 'The hydrogens cannot rearrange in pure ice at that temperature on any experimental timescale; KOH doping is needed to give them a path.' },
    { q: 'What does doping with KOH or HCl do?', choices: ['It makes the oxygen lattice denser', 'It provides defects that let the hydrogens rearrange', 'It breaks hydrogen bonds', 'It lowers the temperature'], a: 1, why: 'The OH⁻ or H₃O⁺ ions and the Bjerrum defects they help create move through the crystal and reorient the molecules, allowing the hydrogens to find their ordered pattern.' },
    { q: 'Ice VIII is the hydrogen-ordered twin of which ice?', choices: ['Ice VI', 'Ice VII', 'Ice III', 'Ice Ih'], a: 1, why: 'Ice VII is the cubic ice of two interpenetrating lattices; its hydrogens order antiferroelectrically on cooling to give ice VIII.' },
    { q: 'If full ordering removed Pauling\'s entropy (3.37 J/(mol·K)) at 72 K, the heat released would be about how many J/mol?', answer: 243, why: '$Q = T\\Delta S = 72 \\times 3.37 = 243$ J/mol: a hundredth of a hydrogen bond.' }
  ],
  applications: ['Neutron diffraction and calorimetry of ices need the ordered twins: they are the simplest crystals in which the positions of all the hydrogens are fixed, a test for the models of water used in computers.', 'Geophysics of icy moons: whether the cold interior ices are ordered changes their heat capacity and strength slightly.', 'Ferroelectric ice films and surfaces: the ordering gives ice an electric polarisation that may matter in electrification of clouds and in dust grains in space.', 'A model for order–disorder transitions in other crystals: the same counting applies to ferroelectrics such as KDP.'],
  history: 'Kawada detected the ordering of KOH-doped ice at about 72 K in 1972 from its dielectric behaviour; Tajima, Matsuo and Suga confirmed it in 1982 from the heat released; neutron diffraction fixed the structure (Leadbetter and colleagues, 1985). Ice IX was found in 1968 (Whalley and colleagues). Salzmann and colleagues made ices XIII and XIV in 2006 and XV in 2009; ice XIX was reported by two groups in 2021 as the nineteenth crystalline ice.',
  sources: ['Gasser and colleagues (Innsbruck) and Yamane and colleagues (Tokyo), on ice XIX, *Nature Communications* 12, 1128 and 1129 (2021) — see also Sci.News, "Scientists create new crystalline form of ice" (18 February 2021).', 'Salzmann, Radaelli, Hallbrucker, Mayer and Finney, "The preparation and structures of hydrogen ordered phases of ice", *Science* 311, 1758 (2006).', 'Tajima, Matsuo and Suga, "Phase transition in KOH-doped hexagonal ice", *Nature* 299, 810 (1982); Petrenko and Whitworth, *Physics of Ice* (1999).', 'Fukazawa and colleagues, "Existence of ferroelectric ice in the universe", *Astrophysical Journal Letters* 652, L57 (2006).'],
  sim: 'ices-ordering'
},

/* ================================================================ 5 */
{
  id: 'amorphous-ices', parent: 'the-many-ices', title: 'Amorphous ices', level: 3,
  short: 'Ice does not have to be a crystal. Water frozen too fast to arrange itself, or crystals crushed at 77 K, give glassy ices of very different densities: low-density (0.94 g/cm³), medium (1.06), high (1.17) and very high (1.25). Low-density amorphous ice is probably the commonest ice in the universe, and the glasses are the key to the idea that liquid water is really two liquids.',
  keywords: ['amorphous ice', 'LDA', 'HDA', 'VHDA', 'MDA', 'glassy water', 'vitreous ice', 'amorphous solid water', 'ASW', 'Mishima', 'polyamorphism', 'pressure amorphisation', 'interstellar ice', 'ball milling', 'hyperquenched', 'vitrification'],
  prereq: ['ice-ih-and-ice-ic', 'high-pressure-ices', 'the-ice-rules'],
  related: ['polyamorphism-of-ice', 'two-liquids-in-one', 'supercooled-water-and-no-mans-land', 'how-water-forms-in-space', 'ice-beyond-earth', 'quantum-effects-in-water'],
  body: `
Take a copper plate cooled to 10 K, put it in a vacuum chamber and let water vapour fall on it. The molecules arrive one at a time, stick where they land and cannot move, so there is no time to find the hexagonal lattice. What grows is a **glass**: water with the disorder of a liquid and the rigidity of a solid. It was first made this way by Burton and Oliver in 1935, and it is **low-density amorphous ice (LDA)**.

### Not one glass but four
| Glass | Density, g/cm³ | How it is made | First reported |
|---|---|---|---|
| LDA | 0.94 | vapour on a plate below about 130 K; quench of tiny droplets; warming HDA | Burton and Oliver, 1935 |
| MDA | 1.06 | ball-milling ice Ih at 77 K | Rosu-Finsen and colleagues, 2023 |
| HDA | 1.17 | ice Ih crushed at 77 K at about 1 GPa | Mishima, Calvert and Whalley, 1984 |
| VHDA | 1.25 | HDA annealed at about 1.1 GPa and 160 K | Loerting and colleagues, 2001 |

For comparison, liquid water at 0 °C is 1.00 g/cm³ and ice Ih 0.917. LDA is an open, tetrahedral network a little denser than ice Ih; HDA is crowded, with a fifth, non-bonded molecule squeezed into the channels.

### Crushing ice into glass
In 1984 Osamu Mishima and colleagues compressed an ice Ih crystal at 77 K. They expected a denser crystalline ice; at about 1 GPa the sample instead collapsed, losing a fifth of its volume at once, into a glass: **high-density amorphous ice (HDA)**. A solid that melts under pressure even though it is far too cold to flow looked paradoxical. The usual explanation is that at 77 K the crystal cannot reach the stable ices, and the pressure pushes it past a point where the open lattice is mechanically unstable. The pressure forces the molecules into the voids of the lattice, and what results is the glass of a denser liquid.

Warm HDA at normal pressure and it relaxes at about 130 K into LDA, dropping in density by a fifth. Compress LDA at about 135 K and it jumps back to HDA. The jump happens at a different pressure on the way up from the one on the way down, with nothing in between: the hallmark of a first-order transition. Mishima and colleagues reported it in 1985, and it is the strongest hint that water has **two distinct amorphous states**, not one.

### Two glasses, two liquids
That is the link to the great argument about water. If the LDA–HDA jump is a real first-order transition, then liquid water above the glass transition might also have two forms, a low-density and a high-density liquid, with a critical point hidden in the supercooled region. In 2020 Anders Nilsson\'s group heated a film of HDA with an infrared pulse and watched with timed X-ray pulses as it became a high-density liquid and then, within microseconds, a distinct low-density one, before crystallising. The story is told in [[two-liquids-in-one]] and [[polyamorphism-of-ice]]; the hidden region is described in [[supercooled-water-and-no-mans-land]].

### The commonest ice
In the dense clouds of gas between the stars the temperature is 10 K, and every dust grain is wrapped in a mantle of ice that grew molecule by molecule from the gas. That ice is amorphous, as the shape of its infrared absorption shows, and it is the raw material from which comets and planets formed ([[how-water-forms-in-space]]). By mass, amorphous water ice is probably the commonest ice there is. In the laboratory the glassy state is also what makes cryo-electron microscopy possible: Jacques Dubochet showed in the 1980s that plunging a thin film of water into very cold liquid ethane makes it **vitreous**, without the crystals that would scatter the electrons.

> [!key] When water is frozen too fast to crystallise, or crystals are crushed, it becomes a glass of one of several densities: 0.94 (LDA), 1.06 (MDA), 1.17 (HDA), 1.25 g/cm³ (VHDA). LDA and HDA turn into each other abruptly, like two liquids, and that is why amorphous ice is at the centre of the argument about water\'s two liquid forms.`,
  ideas: ['Ice need not be crystalline: water that cannot rearrange is a glass, with the disorder of a liquid. LDA (0.94 g/cm³) is made by deposition of vapour on a cold surface.', 'Crushing ice Ih at 77 K and about 1 GPa gives HDA (1.17 g/cm³) in a sudden collapse (Mishima, 1984); further glasses are VHDA (1.25) and, since 2023, MDA (1.06).', 'LDA and HDA turn into each other with an abrupt jump and hysteresis, like a first-order transition, which suggests the glasses of two distinct liquids.', 'Amorphous ice coats interstellar dust and is probably the most abundant ice in the universe; vitreous ice makes cryo-electron microscopy possible.'],
  pitfalls: ['"Amorphous ice is just very cold liquid water" — Below the glass transition (about 136 K for LDA) the molecules cannot rearrange, so it is a solid; but its structure is a snapshot of a liquid-like disorder, not a crystal.', '"All glassy ice has the same density" — There are at least four, from 0.94 to 1.25 g/cm³, a larger spread than between any two crystals of the same oxygen lattice.', '"Pressure amorphisation is melting" — The temperature is 77 K, far below any melting point. It is a collapse of the lattice into disorder, not a solid becoming a liquid in the ordinary sense, though the glass may be that liquid\'s frozen image.'],
  terms: [
    { term: 'Amorphous ice', also: ['glassy water', 'amorphous solid water', 'ASW', 'vitreous water'], def: 'A solid form of water with no long-range crystalline order, made by cooling or compressing too fast for crystals to form. Several amorphous ices exist, of different densities.' },
    { term: 'Low-density amorphous ice', also: ['LDA', 'LDA ice'], def: 'The amorphous ice of density about 0.94 g/cm³ made by depositing vapour on a surface below about 130 K; an open, nearly tetrahedral network. Its glass transition is near 136 K.' },
    { term: 'High-density amorphous ice', also: ['HDA', 'HDA ice'], def: 'The amorphous ice of density about 1.17 g/cm³ made by crushing ice Ih at 77 K and about 1 GPa (Mishima, 1984); a crowded network with a fifth neighbour squeezed in.' },
    { term: 'Very-high-density amorphous ice', also: ['VHDA', 'VHDA ice'], def: 'The amorphous ice of density about 1.25 g/cm³ obtained by annealing HDA near 1.1 GPa and 160 K (Loerting and colleagues, 2001); a third, denser glass.' },
    { term: 'Medium-density amorphous ice', also: ['MDA', 'ball-milled ice'], def: 'The amorphous ice of density about 1.06 g/cm³ made by ball-milling ice Ih at 77 K (Rosu-Finsen and colleagues, 2023); a glass between LDA and HDA, close to liquid water in density.' },
    { term: 'Pressure amorphisation', also: ['pressure-induced amorphization'], def: 'The collapse of a crystal into a glass when compressed at a temperature too low for it to reach a denser crystalline phase. Ice Ih does so at about 1 GPa and 77 K.' }
  ],
  formulas: [
    { name: 'Volume change between two ices', expr: 'dv = rho1/rho2 - 1', tex: '\\delta_V = \\frac{\\rho_1}{\\rho_2} - 1',
      vars: { dv: { name: 'relative volume change', q: 'ratio', unit: '%', signed: true, tex: '\\delta_V' }, rho1: { name: 'density before', q: 'density', unit: 'g/cm³', value: 0.917, tex: '\\rho_1', hint: 'Ice Ih: 0.917 g/cm³ at 0 °C.' }, rho2: { name: 'density after', q: 'density', unit: 'g/cm³', value: 1.17, tex: '\\rho_2', hint: 'HDA: about 1.17 g/cm³ at 77 K and 1 bar.' } },
      solveFor: 'dv', note: 'The same mass in a new volume: $V_2/V_1 = \\rho_1/\\rho_2$. Negative means shrinkage; the collapse of ice Ih to HDA is about −22 %.',
      stories: { dv: 'An ice of density {rho1} is turned into an ice of density {rho2}. By how much does its volume change?' } },
    { name: 'Work done by the press', expr: 'Wk = p*M*(1/rho1 - 1/rho2)', tex: 'W = p\\,M\\left(\\frac{1}{\\rho_1} - \\frac{1}{\\rho_2}\\right)',
      vars: { Wk: { name: 'work per mole', q: 'molarenergy', unit: 'kJ/mol', tex: 'W' }, p: { name: 'pressure', q: 'pressure', unit: 'GPa', value: 1, hint: 'Mishima\'s collapse occurs near 1 GPa at 77 K.' }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 }, rho1: { name: 'density before', q: 'density', unit: 'g/cm³', value: 0.917, tex: '\\rho_1' }, rho2: { name: 'density after', q: 'density', unit: 'g/cm³', value: 1.17, tex: '\\rho_2' } },
      solveFor: 'Wk', note: 'Pressure times the volume lost per mole, $p\\,\\Delta V$. At 1 GPa the collapse of ice Ih to HDA costs the press about 4.2 kJ/mol, a fifth of one hydrogen bond.',
      stories: { Wk: 'Ice of density {rho1} collapses at {p} into a glass of density {rho2}. How much work does the pressure do per mole?' } },
    { name: 'Molecules in a cubic centimetre', expr: 'n = rho*NA/M', tex: 'n = \\frac{\\rho\\,N_A}{M}',
      vars: { n: { name: 'number density', q: 'numberdensity', unit: '1/cm³' }, rho: { name: 'density', q: 'density', unit: 'g/cm³', value: 0.94, tex: '\\rho' }, NA: { const: 'NA' }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 } },
      solveFor: 'n', note: 'LDA (0.94 g/cm³) has $3.1\\times10^{22}$ molecules per cm³, 31 per nm³; HDA (1.17) has 39 per nm³.',
      stories: { n: 'An amorphous ice has density {rho}. How many molecules are there in a cubic centimetre?' } }
  ],
  examples: [
    { title: 'How much does ice Ih shrink?', q: 'Ice Ih (0.917 g/cm³) collapses into HDA (1.17 g/cm³). By what fraction does its volume change?',
      steps: [{ text: 'The mass is conserved, so', tex: '\\frac{V_2}{V_1} = \\frac{\\rho_1}{\\rho_2} = \\frac{0.917}{1.17} = 0.784' }, 'The volume falls by $1 - 0.784 = 21.6$ %.'],
      a: 'About a fifth of the volume (−21.6 %): the open hexagonal channels have been filled in, much as on melting, but to a far greater degree.' },
    { title: 'The price of the collapse', q: 'How much work does a pressure of 1 GPa do on a mole of ice Ih as it collapses to HDA, and how does it compare with a hydrogen bond?',
      steps: [{ text: 'The volume lost per mole:', tex: '\\Delta V = M\\left(\\frac{1}{\\rho_1} - \\frac{1}{\\rho_2}\\right) = 18.015\\,(1.0905 - 0.8547) = 4.25\\ \\mathrm{cm^3/mol}' }, { text: 'Work:', tex: 'W = p\\,\\Delta V = 10^{9}\\ \\mathrm{Pa} \\times 4.25\\times10^{-6}\\ \\mathrm{m^3/mol} = 4.2\\ \\mathrm{kJ/mol}' }, 'One hydrogen bond is about 20 kJ/mol.'],
      a: 'About 4.2 kJ/mol, a fifth of a hydrogen bond: the press need not break the network, only rearrange it, which is why the collapse is so sudden.' }
  ],
  quiz: [
    { q: 'How was high-density amorphous ice first made?', choices: ['Condensing water vapour on a plate at 10 K', 'Crushing ice Ih at 77 K and about 1 GPa', 'Boiling water in a vacuum', 'Annealing ice Ic at 200 K'], a: 1, why: 'Mishima, Calvert and Whalley (1984) compressed ice Ih at 77 K; it collapsed at about 1 GPa into a glass of density 1.17 g/cm³. Vapour deposition makes LDA.' },
    { q: 'High-density amorphous ice is less dense than low-density amorphous ice.', a: false, why: 'HDA is about 1.17 g/cm³ and LDA about 0.94: the "high" and "low" are meant literally, and the 24 % gap is what makes the transition between them so dramatic.' },
    { q: 'Where is amorphous ice probably the dominant form of ice?', choices: ['In a household freezer', 'On the grains of dust in cold interstellar clouds', 'In the oceans of Europa', 'In the core of Uranus'], a: 1, why: 'At the 10 K of a dense cloud the ice mantles on dust grains form molecule by molecule and cannot arrange themselves, so they are amorphous.' },
    { q: 'Why does the jump between LDA and HDA matter for the theory of liquid water?', choices: ['It proves water boils at 100 °C', 'An abrupt, hysteretic jump between two glasses hints that the liquid has two forms, a low-density and a high-density liquid', 'It shows that ice is denser than water', 'It makes hydrogen bonds stronger'], a: 1, why: 'A first-order-like transition between two glasses is what two distinct liquids with a hidden critical point would be expected to leave behind in the frozen state.' },
    { q: 'By how many cubic centimetres does a mole of ice Ih (0.917 g/cm³) shrink when it collapses into HDA (1.17 g/cm³)?', answer: 4.25, why: '$18.015\\,(1/0.917 - 1/1.17) = 18.015 \\times 0.2358 = 4.25$ cm³/mol.' }
  ],
  applications: ['Astrochemistry: the ice on interstellar grains and in cold comets is largely amorphous, and it traps other molecules that are released when it crystallises on warming.', 'Cryo-electron microscopy (Nobel Prize in Chemistry, 2017): biological samples are vitrified so that the water around them is a glass and not crystals; they must be kept cold, or the glass crystallises into cubic ice.', 'Cryopreservation of cells and tissues, which avoids ice crystals by vitrifying the water.', 'Testing theories of liquid water: the two amorphous ices are a laboratory handle on the hidden liquid–liquid transition.'],
  history: 'Burton and Oliver made the first vitreous ice by vapour deposition in 1935. Brüggeller and Mayer made glassy water by quenching tiny droplets in 1980. Mishima crushed ice Ih into HDA in 1984, and with Calvert and Whalley found the LDA–HDA transition in 1985; he and H. E. Stanley connected the two glasses to the two-liquid picture in 1998. Loerting\'s group made VHDA in 2001, and Salzmann\'s group MDA in 2023.',
  sources: ['Mishima, Calvert and Whalley, "Melting ice I at 77 K and 10 kbar: a new method of making amorphous solids", *Nature* 310, 393 (1984), and "An apparently first-order transition between two amorphous phases of ice induced by pressure", *Nature* 314, 76 (1985).', 'Mishima and Stanley, "The relationship between liquid, supercooled and glassy water", *Nature* 396, 329 (1998).', 'Loerting and colleagues, *Physical Chemistry Chemical Physics* 3, 5355 (2001); Rosu-Finsen and colleagues, "Medium-density amorphous ice", *Science* 379, 474 (2023).', 'Physics Today, "Fast x-ray scattering reveals water\'s two liquid phases" (19 November 2020), on Kim and colleagues, *Science* 370, 978.'],
  sim: 'ices-amorphous'
},

/* ================================================================ 6 */
{
  id: 'clathrate-hydrates', parent: 'the-many-ices', title: 'Clathrate hydrates', level: 2,
  short: 'Water can freeze into cages around gas molecules. A cubic metre of methane hydrate, "burning ice", holds about 164 cubic metres of gas, lies stable in cold sediment below 300–500 m of sea, blocks pipelines, may fill the crust of Titan and is one of the largest stores of carbon on Earth.',
  keywords: ['clathrate hydrate', 'gas hydrate', 'methane hydrate', 'burning ice', 'fire ice', 'cage', 'guest molecule', 'structure I', 'structure II', 'structure H', 'pipeline plug', 'hydrate stability', '164', 'ice XVI', 'Titan', 'methane clathrate', 'CO2 hydrate'],
  prereq: ['the-tetrahedral-network', 'the-hydrophobic-effect', 'gases-in-water'],
  related: ['titan', 'enceladus', 'ice-beyond-earth', 'hydrogen-ordered-ices', 'chemistry:henrys-law', 'chemistry:phase-diagrams', 'like-dissolves-like'],
  body: `
Hold a match to a lump of methane hydrate and it burns. The white solid, which looks and feels like ice, flames with a pale blue fire and drips water as it goes. It is not ice with gas stuck in it; it is a different crystal, in which the water has built a lattice of **cages** and every cage holds a molecule of gas. Such a crystal is called a **clathrate hydrate**, from the Latin for "enclosed by bars", and the gas inside is the **guest**.

### The cages
In a clathrate the water molecules sit at the corners of polyhedra and every edge is a hydrogen bond, exactly as in ice, but with pentagons and hexagons instead of only hexagons. The basic cage, **5¹²**, has twelve pentagonal faces and twenty water molecules; it is almost a sphere, 7.8 Å across, with room inside for a small molecule. Add two hexagonal faces and you get the larger **5¹²6²** cage (24 water molecules); four hexagons give the 5¹²6⁴ cage (28). Three arrangements of such cages fill space:

| Structure | Cages in a unit cell | Water molecules | Typical guests |
|---|---|---|---|
| sI | 2 small (5¹²) + 6 large (5¹²6²) | 46 | methane, carbon dioxide, ethane |
| sII | 16 small (5¹²) + 8 large (5¹²6⁴) | 136 | propane, nitrogen, oxygen |
| sH | three kinds of cage | 34 | methane plus a large molecule, both at once |

A guest must fit. The rule of thumb of Sloan and Koh is that a guest stabilises a cage when its diameter is 0.76 to 1.0 times the free diameter of the cage: methane (4.36 Å) fits the small cage and just rattles in the large one, carbon dioxide (5.12 Å) fills the small cage exactly, propane (6.28 Å) is too big for structure I altogether. Without guests the cages collapse: a clathrate is held up by what is inside it.

### Methane hydrate in numbers
If every cage held a methane, the formula would be $\\ce{CH4.5.75H2O}$: 46 water molecules for 8 guests. Real samples leave a few cages empty and are nearer $\\ce{CH4.6H2O}$, with a density of about 910 kg/m³ (lighter than water, so hydrate floats). A cubic metre of such hydrate contains about 7,300 mol of methane, which released at normal conditions fills **164 m³**, and 0.8 m³ of water. Wherever methane and water meet at low temperature and high pressure the hydrate forms: it is stable at 0 °C above about 2.6 MPa (26 bar), and at 4 °C above roughly 3.5–4 MPa. At the bottom of the sea, where the water is at 4 °C, that pressure is reached at 300–500 m of depth, so hydrate fills the pores of sediment on the continental margins below that depth; it also forms under permafrost on land.

### Trouble and treasure
- **Plugs.** Natural-gas pipelines carry gas, water and cold; Hammerschmidt found in 1934 that the blockages were hydrate, not ice. Deepwater lines are held clear with methanol or glycol and by heating. In 2010 the first containment dome lowered over the leaking well in the Gulf of Mexico clogged with hydrate and became buoyant.
- **Energy.** The amount of carbon in marine hydrate is estimated at some hundreds to a few thousand gigatonnes, and it has fallen over recent decades. Japan (2013) and China (2017) have drawn gas from marine hydrate in tests lasting from days to about two months.
- **Climate.** Warming oceans destabilise the shallow edge of the hydrate zone; most of the methane released is oxidised in the water before it reaches the air, and the size of the possible feedback is still debated.
- **Other worlds.** Titan\'s methane may be stored in a clathrate crust and released episodically (Tobie and colleagues, 2006); one proposal (Kieffer and colleagues, 2006) explains the plumes of Enceladus as gas released from a clathrate reservoir under its south pole.
- **A new ice from an old cage.** Pump the neon out of a structure-II hydrate at low temperature and the empty framework is a new ice, **ice XVI**, the least dense known (0.81 g/cm³).

> [!key] A clathrate hydrate is water frozen into cages round gas molecules: 46 H₂O make the two small and six large cages of structure I, and methane fills them to give about 164 m³ of gas per cubic metre. It is stable only in the cold and under pressure, so it fills seabed sediment below a few hundred metres, plugs pipelines, and may hold the methane of Titan.`,
  ideas: ['Water builds hydrogen-bonded cages (5¹², 5¹²6², 5¹²6⁴) and a guest molecule inside holds each one up; without guests the cages collapse.', 'A guest stabilises a cage when its diameter is 0.76–1.0 times the cage\'s free diameter; methane fits the small cage, carbon dioxide both, propane only the larger structure II.', 'Methane hydrate is about CH₄·6H₂O, 910 kg/m³, and releases about 164 m³ of gas per cubic metre; it needs cold and pressure (about 4 MPa at 4 °C).', 'On Earth it fills seabed sediment below 300–500 m; it also plugs pipelines, offers an energy resource and may play a part in the climate; on Titan it may be the crust.'],
  pitfalls: ['"Methane hydrate is ice with bubbles of gas" — The gas is inside the crystal\'s own cages, each guest in a cage of 20 or 24 water molecules; it is a different structure from ice, and burns when lit.', '"Gas hydrates only exist in the lab" — They fill sediments on every continental margin and under permafrost, and form inside pipelines and in the deep sea; the cages even appear on other worlds.', '"All the methane in hydrate will be released by warming in a few decades" — The hydrates at the edge of the stability zone are the vulnerable ones, and the methane reaching the air is small compared with other sources, but the long-term size of the feedback is uncertain.'],
  terms: [
    { term: 'Clathrate hydrate', also: ['gas hydrate', 'clathrate', 'hydrate'], def: 'A crystal in which water molecules form hydrogen-bonded cages, each enclosing a guest molecule such as methane. It looks like ice, is stable only at low temperature and high pressure, and releases the gas when it melts.' },
    { term: 'Guest molecule', also: ['guest', 'hydrate former'], def: 'The molecule trapped in a cage of a clathrate hydrate. It holds the cage up through weak attraction; methane, ethane, carbon dioxide, nitrogen and hydrogen sulfide are typical guests.' },
    { term: 'Cage', also: ['5¹²', '5¹²6²', '5¹²6⁴', 'pentagonal dodecahedron'], def: 'A polyhedral cavity whose corners are water molecules. In the notation 5¹²6², twelve faces are pentagons and two are hexagons; 5¹² alone is the small cage of structures I and II.' },
    { term: 'Hydration number', also: ['n in CH₄·nH₂O'], def: 'The number of water molecules per guest in a hydrate. For methane hydrate with every cage filled it is 5.75; real samples are near 6.' },
    { term: 'Hydrate stability zone', also: ['gas hydrate stability zone', 'GHSZ'], def: 'The range of depths and temperatures in sediment or in a pipeline where, with enough gas, a hydrate is the stable phase. In the sea it begins at 300–500 m below the surface.' },
    { term: 'Flow assurance', also: ['hydrate inhibitor'], def: 'The engineering of oil and gas pipelines so that flow is not blocked by hydrate or wax, for example by adding methanol or glycol, which shift the stability limit to lower temperature.' }
  ],
  formulas: [
    { name: 'Gas in a cubic metre of methane hydrate', expr: 'Y = rho*Vm/(Mg + n*Mw)', tex: 'Y = \\frac{\\rho\\,V_m}{M_g + n\\,M_w}',
      vars: { Y: { name: 'cubic metres of gas per cubic metre of hydrate', hint: 'About 164 for CH₄·6H₂O, 170 for the ideal CH₄·5.75H₂O.' }, rho: { name: 'density of the hydrate', q: 'density', unit: 'kg/m³', value: 910, tex: '\\rho' }, Vm: { const: 'Vm' }, Mg: { name: 'molar mass of the guest (methane)', q: 'molarmass', unit: 'g/mol', value: 16.043, tex: 'M_g' }, n: { name: 'hydration number', value: 6, min: 5.75, max: 8, hint: '5.75 with every cage filled; larger when cages are empty.' }, Mw: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, tex: 'M_w' } },
      solveFor: 'Y', note: 'Moles of hydrate per cubic metre times the molar volume of an ideal gas at 0 °C and 1 atm (22.41 L/mol).',
      stories: { Y: 'A methane hydrate of density {rho} has {n} water molecules per methane. How many cubic metres of methane at 0 °C and 1 atm does a cubic metre of it release?', n: 'A cubic metre of hydrate of density {rho} releases {Y} cubic metres of methane. What is its hydration number?' } },
    { name: 'Hydration number from cage occupancy', expr: 'n = 46/(2*ts + 6*tl)', tex: 'n = \\frac{46}{2\\theta_s + 6\\theta_l}',
      vars: { n: { name: 'hydration number', hint: '5.75 if both kinds of cage are full.' }, ts: { name: 'fraction of small cages filled', q: 'ratio', unit: '%', value: 90, min: 1, max: 100, tex: '\\theta_s' }, tl: { name: 'fraction of large cages filled', q: 'ratio', unit: '%', value: 97, min: 1, max: 100, tex: '\\theta_l' } },
      solveFor: 'n', note: 'A structure-I unit cell has 46 water molecules, 2 small and 6 large cages. Full cages: 46/8 = 5.75.',
      stories: { n: 'In a structure-I hydrate {ts} of the small cages and {tl} of the large cages hold a guest. How many water molecules are there per guest?' } },
    { name: 'Shallowest seabed depth for methane hydrate', expr: 'h = (1000*exp(38.98 - 8533.8/T) - patm)/(rho*g)', tex: 'h = \\frac{1000\\,e^{38.98 - 8533.8/T} - p_0}{\\rho\\,g}',
      vars: { h: { name: 'water depth', q: 'length', unit: 'm' }, T: { name: 'temperature of the bottom water', q: 'temperature', unit: '°C', value: 4, min: 0, max: 17, hint: '4 °C is typical of the deep ocean; the fit is empirical for pure methane, 0 to 17 °C, and is good to about 10 %.' }, patm: { const: 'atm' }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, g: { const: 'g' } },
      solveFor: 'h', note: 'The equilibrium pressure is Kamath\'s empirical fit, $\\ln(p/\\mathrm{kPa}) = 38.98 - 8533.8/T$ (T in kelvin). Dissolved salt raises the pressure needed by about 1 K in temperature.',
      stories: { h: 'The bottom water is at {T}. At what depth does the pressure of the sea (density {rho}) reach the stability limit of methane hydrate?', T: 'Methane hydrate is stable at the seabed at a depth of {h}. At what temperature of the bottom water is the stability limit reached?' } },
    { name: 'Does the guest fit the cage?', expr: 'r = dg/(2*Rc - dw)', tex: 'r = \\frac{d_g}{2R_c - d_w}',
      vars: { r: { name: 'guest ÷ free diameter', hint: 'Between about 0.76 and 1.0 the guest stabilises the cage.' }, dg: { name: 'guest diameter (Å)', value: 4.36, tex: 'd_g', hint: 'Methane 4.36, nitrogen 4.10, carbon dioxide 5.12, ethane 5.50, propane 6.28 Å.' }, Rc: { name: 'cavity radius (Å)', value: 3.95, tex: 'R_c', hint: 'Centre to oxygen: 3.95 Å for the small 5¹² cage, 4.33 Å for the 5¹²6² cage.' }, dw: { name: 'diameter of a water oxygen (Å)', value: 2.8, fixed: true, tex: 'd_w' } },
      solveFor: 'r', note: 'The free diameter is the width of the cage less the width of the oxygens that make its wall. The 5¹² cage has a free diameter of 5.1 Å.',
      stories: { r: 'A guest of diameter {dg} is put in a cage of radius {Rc}. What is the ratio of its size to the free space?' } }
  ],
  examples: [
    { title: '164 cubic metres in one', q: 'Methane hydrate CH₄·6H₂O has a density of 910 kg/m³. How much methane, at 0 °C and 1 atm, does one cubic metre release, and how much water is left?',
      steps: [{ text: 'Molar mass of the hydrate:', tex: 'M = 16.04 + 6 \\times 18.015 = 124.1\\ \\mathrm{g/mol}' }, '$910\\,000\\ \\mathrm{g} / 124.1\\ \\mathrm{g/mol} = 7\\,330$ mol of methane.', { text: 'Volume as gas:', tex: '7330 \\times 22.41\\ \\mathrm{L} = 164\\,300\\ \\mathrm{L} = 164\\ \\mathrm{m^3}' }, 'Water: $7330 \\times 6 \\times 18.015\\ \\mathrm{g} = 792$ kg, nearly 0.8 m³.'],
      a: 'About 164 m³ of methane and 0.8 m³ of water: the hydrate packs gas at a density 164 times that of the gas at one atmosphere.' },
    { title: 'Where on the seabed?', q: 'Bottom water is at 4 °C. Using the fit $\\ln(p/\\mathrm{kPa}) = 38.98 - 8533.8/T$, at what depth does methane hydrate become stable?',
      steps: [{ text: 'At $T = 277.15$ K,', tex: '\\ln p = 38.98 - 8533.8/277.15 = 8.19,\\quad p = 3.6\\ \\mathrm{MPa}' }, 'Subtract the 0.1 MPa of the atmosphere and divide by $\\rho g = 1025 \\times 9.81 = 10.05$ kPa/m: $3.5\\ \\mathrm{MPa} / 10.05\\ \\mathrm{kPa/m} = 348$ m.'],
      a: 'About 350 m. In warmer water (10 °C) the limit moves down to about 680 m, which is why hydrate lies only in the cold deep sea and under permafrost.' },
    { title: 'Does it fit?', q: 'Methane is 4.36 Å across. Does it stabilise the small 5¹² cage (cavity radius 3.95 Å) and the large 5¹²6² cage (4.33 Å)? The oxygen diameter is 2.8 Å.',
      steps: [{ text: 'Small cage:', tex: 'r = \\frac{4.36}{2\\times3.95 - 2.8} = \\frac{4.36}{5.10} = 0.855' }, { text: 'Large cage:', tex: 'r = \\frac{4.36}{2\\times4.33 - 2.8} = \\frac{4.36}{5.86} = 0.744' }, 'The rule of thumb needs $0.76 \\le r \\le 1$.'],
      a: 'Methane fits the small cage well (0.86) and sits just on the loose side in the large one (0.74). Both cages are filled in practice, which is why the occupancy of the large cages is so important.' }
  ],
  quiz: [
    { q: 'What stops the cages of a clathrate hydrate from collapsing?', choices: ['Nothing; they are stable empty', 'The guest molecules inside them', 'Covalent bonds between the oxygens', 'The pressure of the surrounding ice'], a: 1, why: 'The guests, held by weak attraction, support the cages; most empty clathrates collapse to ice or liquid water. The exceptions, like ice XVI, are made carefully at low temperature.' },
    { q: 'Methane hydrate sinks in water.', a: false, why: 'Its density is about 910 kg/m³, lighter than water, so a lump of hydrate floats; it is how lumps of it rise from the sea floor.' },
    { q: 'About how many cubic metres of methane at 0 °C and 1 atm does one cubic metre of methane hydrate contain?', answer: 164, why: 'With a hydration number of about 6, 7,300 mol of methane fill 164 m³ at standard conditions.' },
    { q: 'Why do gas pipelines in deep, cold water risk blockage by hydrate?', choices: ['The gas condenses to liquid', 'Cold, high pressure, gas and water together put the pipe inside the hydrate stability zone', 'Methane reacts with steel', 'Ice forms from the gas'], a: 1, why: 'At 4 °C and several MPa methane and water form the solid hydrate, which grows into a plug. Methanol or glycol is added to move the stability limit.' },
    { q: 'Propane (6.28 Å) will stabilise the small cage of structure I.', a: false, why: 'The ratio to the free diameter is 6.28/5.10 = 1.2, far above the limit of about 1. Propane only fits the larger 5¹²6⁴ cage of structure II.' }
  ],
  applications: ['Flow assurance in oil and gas: hydrates are the commonest cause of blocked deepwater pipelines, and the industry spends heavily on inhibitors.', 'Energy: the methane in marine and permafrost hydrate is a possible resource; the engineering problems are the same ones that make hydrates troublesome elsewhere.', 'Climate and the carbon cycle: the hydrate stock responds to warming of the sea floor and of permafrost, and models of its response are an open area.', 'Storage: hydrogen and carbon dioxide can be held in hydrate cages, and a field test in Alaska in 2012 swapped carbon dioxide for the methane of a natural hydrate.', 'Planetary science: methane clathrate in the crust of Titan, and the possible source of the gas in the plumes of Enceladus.'],
  history: 'Humphry Davy made the hydrate of chlorine in 1810. Paul Villard made methane hydrate in 1888. In 1934 E. G. Hammerschmidt showed that the plugs in gas pipelines were hydrates; in the 1960s Yuri Makogon found natural gas hydrate in Siberian permafrost. Powell coined the word "clathrate" in 1948, and von Stackelberg, Claussen and Pauling and Marsh worked out the cage structures between 1949 and 1952. Falenty, Hansen and Kuhs made ice XVI by emptying a clathrate in 2014.',
  sources: ['Sloan and Koh, *Clathrate Hydrates of Natural Gases* (3rd edition, CRC Press, 2008) — the cages, the guest-size rule and the stability data.', 'Ruppel and Kessler, "The interaction of climate change and methane hydrates", *Reviews of Geophysics* 55, 126 (2017).', 'Falenty, Hansen and Kuhs, "Formation and properties of ice XVI obtained by emptying a type sII clathrate hydrate", *Nature* 516, 231 (2014).', 'Tobie, Lunine and Sotin, "Episodic outgassing as the origin of atmospheric methane on Titan", *Nature* 440, 61 (2006).'],
  sim: 'ices-cage'
},

/* ================================================================ 7 */
{
  id: 'superionic-ice', parent: 'the-many-ices', title: 'Superionic ice', level: 3,
  short: 'Squeezed to a million atmospheres and heated to thousands of kelvin, ice becomes a solid lattice of oxygen atoms with the hydrogen nuclei flowing through it like a liquid. Predicted in the 1980s, confirmed by laser-driven shock waves in 2019 as ice XVIII, it may fill the mantles of Uranus and Neptune and shape their odd magnetic fields.',
  keywords: ['superionic ice', 'ice XVIII', 'superionic water', 'fast-ion conductor', 'laser shock', 'Millot', 'Uranus', 'Neptune', 'ice giants', 'proton diffusion', 'magnetic field of Uranus', 'fcc oxygen lattice', 'ionic conductivity', 'extreme pressure ice'],
  prereq: ['high-pressure-ices', 'the-proton-hops', 'hydrogen-ordered-ices'],
  related: ['ice-beyond-earth', 'water-worlds-around-other-stars', 'amorphous-ices', 'quantum-effects-in-water', 'physics:planets'],
  body: `
Ice is an insulator: a perfect crystal of molecules with no free charge to move. Yet there is an ice that conducts electricity as well as a puddle of salt water while its oxygen atoms stay locked in a rigid lattice. It exists only at pressures of a hundred gigapascals or more — a million atmospheres, the pressure at the centre of a planet — and at temperatures of thousands of kelvin, so hot that any ordinary solid would long since have melted. It is called **superionic ice**.

### What flows
In a normal ice each hydrogen nucleus (a proton) belongs to one molecule, and breaks away only for the picosecond of a hopping defect. At extreme pressure the oxygens are crowded close, the O–O distance down from the 2.76 Å of ordinary ice to about 2.2 Å, and the barriers that held the protons to their own oxygens become shallow. Heat them to a few thousand kelvin and the protons are no longer attached to anything: they hop from site to site in the gaps of the oxygen lattice, while the oxygens themselves stay on their positions and merely vibrate. One half of the crystal is a solid, the other half a liquid. Materials of this kind are called **fast-ion conductors**; silver iodide above 147 °C is the classical example, and they are the model for the solid electrolytes of new batteries.

| | Ice Ih | Ice VII | Superionic ice XVIII |
|---|---|---|---|
| Pressure | 1 atmosphere | 2–60 GPa | 100–400 GPa |
| Temperature | below 0 °C | up to above 700 K | thousands of kelvin |
| Oxygens | hexagonal lattice | body-centred cubic | face-centred cubic lattice |
| Hydrogens | bonded to molecules | bonded to molecules | flowing through the lattice |
| Conducts by | defects, very slowly | defects | protons, freely |

### Prediction, and a hard measurement
Computer simulations suggested the idea in the late 1980s (Demontis, LeSar and Klein) and in 1999 Cavazzoni and colleagues showed that both water and ammonia should be superionic at the conditions of giant planets. To test it one has to reach 100–400 GPa and thousands of kelvin for a few nanoseconds. Marius Millot, Federica Coppari, Jon Eggert and colleagues did it by squeezing a sample of water first in a diamond-anvil cell and then with a laser-driven shock wave, which compresses and heats it in a nanosecond. In 2018 they saw the optical signs of a conducting solid; in 2019 an X-ray flash timed to the shock showed the oxygens in a face-centred cubic lattice. This is **ice XVIII**. A later experiment with static diamond anvils found a second superionic form with a body-centred lattice (Prakapenka and colleagues, 2021).

One honest limit: X-rays see only the oxygen atoms. That the protons are flowing is inferred from simulations and from the conductivity and absorption of the sample, not photographed.

### Ice giants
Uranus and Neptune are 14.5 and 17 times the mass of the Earth, but they are not made mostly of rock or hydrogen. Their bulk is a hot, dense mixture of water, ammonia and methane, and the pressure in their deep mantles passes the threshold of superionic ice. Both planets have magnetic fields that are strange: tilted by about 59° (Uranus) and 47° (Neptune) from the spin axis, and offset from the centre. A leading idea is that the field is produced in a shell of convecting ionic fluid, with a rigid superionic layer beneath that cannot convect. Whether the mantle of an ice giant really contains superionic ice, and in what layers, is not settled.

> [!key] Superionic ice (ice XVIII) is a solid lattice of oxygen atoms through which the protons flow like a liquid, formed above about 100 GPa and a few thousand kelvin. Laser-driven shocks made it in 2019, and it is likely in the interiors of Uranus and Neptune.`,
  ideas: ['In superionic ice the oxygens stay on a crystal lattice while the protons move through it freely: a solid and a liquid sharing one crystal.', 'It forms above about 100 GPa and thousands of kelvin, where the O–O distance has shrunk enough that the protons are no longer bound to single oxygens.', 'Laser-driven shock waves created ice XVIII in 2019; X-rays showed an fcc oxygen lattice, and the proton motion is inferred.', 'It probably fills part of the mantles of Uranus and Neptune and may help explain their tilted, off-centre magnetic fields.'],
  pitfalls: ['"Superionic ice is liquid water under pressure" — The oxygens stay on a rigid lattice, and X-ray diffraction shows sharp crystal peaks; only the protons move. Melting, at a higher temperature, would remove the lattice as well.', '"Superionic ice has been photographed with every atom in place" — X-rays see the oxygens; the protons\' motion is deduced from simulations and from the electrical and optical properties.', '"It is a curiosity of the laboratory" — The conditions are those inside giant planets, and planets of the size of Neptune are among the commonest we know of around other stars.'],
  terms: [
    { term: 'Superionic ice', also: ['superionic water', 'superionic phase of water'], def: 'A phase of water, stable above about 100 GPa and a few thousand kelvin, in which the oxygen atoms form a solid lattice while the hydrogen nuclei diffuse through it like a liquid.' },
    { term: 'Ice XVIII', also: ['superionic ice with fcc oxygens'], def: 'The superionic ice identified in 2019 by X-ray diffraction of laser-shocked water, with its oxygen atoms on a face-centred cubic lattice at 100–400 GPa.' },
    { term: 'Fast-ion conductor', also: ['superionic conductor', 'solid electrolyte'], def: 'A solid in which one kind of ion moves almost as freely as in a liquid while the rest of the crystal stays rigid, so that it conducts electricity by ion motion. Silver iodide above 147 °C is an example.' },
    { term: 'Shock compression', also: ['laser-driven shock', 'shock wave experiment'], def: 'Compressing and heating a sample almost instantly with a shock wave, here driven by a high-power laser, so that extreme pressure and temperature last for a few nanoseconds, long enough to measure.' },
    { term: 'Ice giant', also: ['Uranus and Neptune'], def: 'A planet made mostly of water, ammonia and methane around a small core, below a hydrogen–helium atmosphere. Uranus and Neptune are the ice giants of the Solar System.' }
  ],
  formulas: [
    { name: 'Ionic conductivity from proton diffusion', expr: 'sigma = n*qe^2*D/(kB*T)', tex: '\\sigma = \\frac{n\\,e^2 D}{k_B T}',
      vars: { sigma: { name: 'electrical conductivity', q: 'conductivity', unit: 'S/m', tex: '\\sigma' }, n: { name: 'number density of mobile protons', q: 'numberdensity', unit: '1/m³', value: 2.0e29, hint: 'Two protons per molecule at a density of about 3,000 kg/m³ gives $2\\times10^{29}$ per m³.' }, qe: { const: 'qe' }, D: { name: 'diffusion coefficient of the protons', q: false, unit: 'm²/s', value: 1e-8, hint: 'Simulations give of the order of $10^{-8}$ m²/s ($10^{-4}$ cm²/s); an illustrative value here.' }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: 'K', value: 3000, min: 1000, max: 8000 } },
      solveFor: 'sigma', note: 'The Nernst–Einstein relation for ions that move independently. With the values shown it gives about 1,200 S/m: some two hundred times seawater (5 S/m), far below copper (6×10⁷ S/m).',
      stories: { sigma: 'Protons at a density of {n} diffuse with D = {D} at {T}. What is the electrical conductivity of the ice?' } },
    { name: 'Number density of protons', expr: 'n = 2*rho*NA/M', tex: 'n = \\frac{2\\,\\rho\\,N_A}{M}',
      vars: { n: { name: 'protons per unit volume', q: 'numberdensity', unit: '1/m³' }, rho: { name: 'density of the ice', q: 'density', unit: 'kg/m³', value: 3000, tex: '\\rho', hint: 'About 3,000 kg/m³ for ice XVIII near 200 GPa.' }, NA: { const: 'NA' }, M: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015 } },
      solveFor: 'n', note: 'Two hydrogens per molecule; at 3,000 kg/m³ this is three times the density of protons in liquid water.',
      stories: { n: 'Ice of density {rho} has two protons per H₂O. How many protons are there per cubic metre?' } },
    { name: 'Time for a proton to travel one lattice spacing', expr: 'tau = L^2/(6*D)', tex: '\\tau = \\frac{L^2}{6D}',
      vars: { tau: { name: 'time', q: 'time', unit: 'ps', tex: '\\tau' }, L: { name: 'distance between sites', q: 'length', unit: 'pm', value: 220, hint: 'The oxygen–oxygen spacing is about 2.2 Å at 200 GPa.' }, D: { name: 'diffusion coefficient', q: false, unit: 'm²/s', value: 1e-8 } },
      solveFor: 'tau', note: 'For diffusion in three dimensions, the mean square distance is $6Dt$. About a picosecond: as fast as the hydrogen bonds of liquid water flicker.',
      stories: { tau: 'A proton diffuses with D = {D} through a lattice with sites {L} apart. How long does it take to cover that distance?' } }
  ],
  examples: [
    { title: 'Protons in a cubic metre', q: 'Superionic ice of density 3,000 kg/m³ is made of H₂O. How many mobile protons does a cubic metre hold, assuming both hydrogens of every molecule are free?',
      steps: [{ text: 'Molecules per cubic metre:', tex: '\\frac{\\rho N_A}{M} = \\frac{3000 \\times 6.022\\times10^{23}}{0.018015} = 1.0\\times10^{29}' }, 'Two protons per molecule: $2.0\\times10^{29}$ per m³.'],
      a: 'About $2\\times10^{29}$ protons per cubic metre, three times the number in liquid water at 1 atm.' },
    { title: 'How well does it conduct?', q: 'Estimate the conductivity of superionic ice with $n = 2\\times10^{29}$ m⁻³, $D = 10^{-8}$ m²/s at 3,000 K, and compare with seawater (5 S/m) and copper ($6\\times10^{7}$ S/m).',
      steps: [{ text: 'The Nernst–Einstein relation:', tex: '\\sigma = \\frac{n e^2 D}{k_B T} = \\frac{2\\times10^{29}\\times(1.602\\times10^{-19})^2\\times10^{-8}}{1.381\\times10^{-23}\\times3000} = 1.2\\times10^{3}\\ \\mathrm{S/m}' }, 'Compared with seawater: $1240/5 \\approx 250$. Compared with copper: $1240/6\\times10^7 = 2\\times10^{-5}$.'],
      a: 'About 1,200 S/m (12 S/cm): hundreds of times better than the sea but tens of thousands of times worse than a metal — a good ionic conductor, a poor metal.' },
    { title: 'A picosecond per jump', q: 'How long does a proton with $D = 10^{-8}$ m²/s take to diffuse over one lattice spacing of 2.2 Å?',
      steps: [{ text: 'Using $\\tau = L^2/(6D)$:', tex: '\\tau = \\frac{(2.2\\times10^{-10})^2}{6\\times10^{-8}} = \\frac{4.84\\times10^{-20}}{6\\times10^{-8}} = 8\\times10^{-13}\\ \\mathrm{s}' }],
      a: 'Less than a picosecond: protons hop once in a fraction of a picosecond, about as fast as the hydrogen bonds of liquid water re-form.' }
  ],
  quiz: [
    { q: 'What flows in superionic ice?', choices: ['The oxygen atoms, while the hydrogens stay put', 'The hydrogen nuclei, through a lattice of oxygen atoms', 'Whole water molecules', 'Free electrons only'], a: 1, why: 'The oxygens hold the lattice; the protons leave their molecules and diffuse like a liquid, carrying the current.' },
    { q: 'X-ray diffraction of shocked water directly shows the protons flowing through ice XVIII.', a: false, why: 'X-rays scatter from the electrons around the oxygen atoms, so they reveal the oxygen lattice. The proton motion is deduced from simulations and from the measured conductivity and absorption.' },
    { q: 'Which planets are the likeliest places for superionic ice?', choices: ['Mercury and Venus', 'Uranus and Neptune', 'The Moon and Mars', 'Jupiter and Saturn only'], a: 1, why: 'The deep mantles of the ice giants pass the pressure and temperature of the superionic region; Jupiter and Saturn are mostly hydrogen and helium.' },
    { q: 'How was ice XVIII made in the laboratory?', choices: ['By cooling water slowly under 2 GPa', 'By compressing water with a laser-driven shock wave and probing it with an X-ray flash', 'By freezing heavy water', 'By emptying a clathrate'], a: 1, why: 'Millot and colleagues used the OMEGA laser to send a shock through pre-compressed water and a timed X-ray pulse to record the diffraction in the few nanoseconds the extreme state lasted.' },
    { q: 'With $n = 2.0\\times10^{29}$ m⁻³, $D = 10^{-8}$ m²/s and $T = 3000$ K, the conductivity $\\sigma = n e^2 D / (k_B T)$ in S/m is about', answer: 1239, why: '$2.0\\times10^{29}\\times2.567\\times10^{-38}\\times10^{-8}/(1.381\\times10^{-23}\\times3000) = 1239$ S/m.' }
  ],
  applications: ['Models of Uranus and Neptune: a superionic layer is one candidate for the unusual tilted, off-centre magnetic fields that Voyager 2 measured.', 'Exoplanets: planets of a few Earth masses to Neptune size are common, and their interiors may be rich in superionic water.', 'Solid-state batteries: the same fast-ion idea, in a rigid framework through which one kind of ion flows, is behind the search for better solid electrolytes.', 'High-energy-density physics: laser and shock experiments, at facilities such as the OMEGA laser, test the equations of state used for planets and inertial fusion.'],
  history: 'Superionic water was suggested by computer simulation in the late 1980s (Demontis, LeSar and Klein, 1988) and given its modern form by Cavazzoni and colleagues in 1999. Millot and colleagues reported the optical signature in 2018 and the X-ray diffraction of ice XVIII in 2019; Prakapenka and colleagues found two superionic phases in 2021.',
  sources: ['Millot and colleagues, "Experimental evidence for superionic water ice using shock compression", *Nature Physics* 14, 297 (2018), and "Nanosecond X-ray diffraction of shock-compressed superionic water ice", *Nature* 569, 251 (2019).', 'Cavazzoni, Chiarotti, Scandolo, Tosatti, Bernasconi and Parrinello, "Superionic and metallic states of water and ammonia at giant planet conditions", *Science* 283, 44 (1999).', 'Redmer, Mattsson, Nettelmann and French, "The phase diagram of water and the magnetic fields of Uranus and Neptune", *Icarus* 211, 798 (2011).', 'Prakapenka, Holtgrewe, Lobanov and Goncharov, "Structure and properties of two superionic ice phases", *Nature Physics* 17, 1233 (2021).'],
  sim: 'ices-superionic'
},

/* ================================================================ 8 */
{
  id: 'ice-beyond-earth', parent: 'the-many-ices', title: 'Ice beyond the Earth', level: 2,
  short: 'Beyond the Earth the ice is rarely the ice of a freezer. Amorphous ice coats cold dust, Europa wears a shell of ice Ih, Ganymede has layers of ice III, V and VI under its ocean, Mars freezes carbon dioxide, Pluto\'s water-ice mountains carry nitrogen glaciers, and water-rich planets may be wrapped in ice VII and superionic ice.',
  keywords: ['ice on other worlds', 'Europa', 'Ganymede', 'Titan', 'Pluto', 'Mars', 'dry ice', 'comets', 'amorphous ice in space', 'ice VI', 'ice VII', 'ice shell', 'super-Earth', 'ocean world', 'water world', 'high-pressure ice layer', 'equilibrium temperature', 'Sputnik Planitia'],
  prereq: ['high-pressure-ices', 'amorphous-ices', 'clathrate-hydrates'],
  related: ['europa', 'enceladus', 'titan', 'ganymede-and-callisto', 'ceres-pluto-and-the-dwarfs', 'water-worlds-around-other-stars', 'the-moon-and-mars', 'the-snow-line', 'how-water-forms-in-space', 'superionic-ice', 'physics:planets'],
  body: `
Ice is the most abundant solid beyond the orbit of Mars, and nowhere out there is it the same as the ice in a glass. What ice a world holds depends on two numbers: **how cold** it is, which is set by the distance from the Sun, and **how deep** you dig, because the pressure under a layer of water is $\\rho g h$. Put the pair of numbers on [the phase lab](#/tools/phase) and you read off the ice.

### A tour of the ices of the Solar System
| World | Surface temperature | The ice | Deeper |
|---|---|---|---|
| Interstellar dust, comets | 10–100 K | amorphous ice, some clathrate | — |
| Europa | about 100 K | crystalline ice Ih, a shell over an ocean | an ocean about 100 km deep with its floor near 0.13 GPa: too shallow for thick high-pressure ice |
| Enceladus | about 75 K | ice Ih with plumes | a small ocean and a seafloor only a few MPa deep |
| Ganymede | about 110 K | ice Ih | ocean sandwiched between layers of ice III, V and VI, with 1.3 GPa or more at the base |
| Titan | 94 K | ice Ih and methane hydrate | an ocean, then ice V or VI |
| Mars | about 210 K (mean) | water ice at the poles and under the soil; carbon-dioxide "dry ice" frost in winter | — |
| Pluto | about 40 K | water ice hard as rock, with nitrogen, methane and carbon-monoxide ices that flow | perhaps an ocean |
| Water-rich exoplanets | — | — | ice VII, ice X, superionic ice at hundreds of GPa |
| Uranus and Neptune | — | — | superionic ice in the deep mantle |

### The layer cake of an ocean world
On a moon such as Ganymede, a lid of ice Ih sits on an ocean, because the temperature rises with depth until it reaches the melting curve. Down in the water the pressure climbs by about 1.4 MPa per kilometre ($\\rho g$ with $g$ = 1.43 m/s²), and when it reaches 0.2 GPa, at about 150 km, any water that is solid is no longer ice Ih but ice III, then V, then VI above 0.6 GPa. Because the melting curves of these ices rise steeply with pressure, the ocean can end and solid ice take over beneath it: models of Ganymede (Vance and colleagues, 2014) put thick layers of high-pressure ice below the ocean. Europa\'s water layer is only 100–170 km thick, so its seafloor reaches 0.13–0.2 GPa and stops: the ocean touches rock, which may matter for life. On a water world with a layer hundreds of kilometres deep the ocean floor could be ice VII, and the ice would then cut the ocean off from the minerals of the rock below (Noack and colleagues, 2016).

### Ices that are not water, and ices that are not crystals
At 40 K, water ice is as strong as rock. New Horizons found at Pluto in 2015 mountains of water ice up to 3.5 km high, some seemingly afloat in a plain of nitrogen ice that flows in glaciers and convects in cells (Sputnik Planitia). On Mars at 150 K carbon dioxide freezes at the pole in winter into a transparent slab; **dry ice** has its own sublimation, its own crystal and is not water. Between the stars the ice is amorphous ([[amorphous-ices]]) and in the crust of Titan it may be a clathrate ([[clathrate-hydrates]]).

### Water worlds
In 2022 Luque and Pallé found, among small planets around red dwarf stars, a group too dense to be pure water but too light to be rock and iron: planets that may be up to half water by mass. If so, their water is not an ocean under an atmosphere but a deep layer hundreds of times deeper than the Earth\'s, passing from liquid or supercritical water into ice VII, ice X and the superionic ice of [[superionic-ice]] ([[water-worlds-around-other-stars]]).

> [!key] The ice of other worlds is fixed by temperature and by the pressure at depth: amorphous ice on cold dust, ice Ih on Europa, layers of ice III–VI under Ganymede\'s ocean, ice VII on water-rich planets, hard water-ice mountains on Pluto. Reading a world\'s ice is reading the phase diagram of water along its path inward.`,
  ideas: ['Which ice a body holds is fixed by its temperature (set by distance from the star) and by the pressure at depth, $\\rho g h$; the phase diagram of water does the rest.', 'Europa\'s water layer is too shallow for thick high-pressure ice; Ganymede\'s, hundreds of kilometres deep, reaches ice III, V and VI under its ocean.', 'On cold bodies ice is not always Ih: amorphous on interstellar grains, a clathrate in Titan\'s crust, rock-hard at Pluto, and mixed with other frozen gases such as nitrogen and carbon dioxide.', 'Water-rich exoplanets may have deep layers of ice VII, ice X and superionic ice, and an ocean that never touches rock.'],
  pitfalls: ['"Europa\'s ocean is frozen at the bottom like a lake" — The pressure at Europa\'s seafloor is only about 0.13 GPa, too low for the dense ices, and the ocean may rest directly on rock; it is a lid of ice Ih on top, not a floor of ice below.', '"Mars\'s polar caps are made of frozen water only" — The permanent southern cap is topped by a layer of solid carbon dioxide, and both poles gain a seasonal frost of dry ice in winter.', '"Cold ice is soft" — Water ice at 40 K is stiff as rock; Pluto\'s mountains are made of it, and it is the nitrogen ice at the same temperature that flows.'],
  terms: [
    { term: 'Ice shell', also: ['ice crust', 'ice lid'], def: 'The outer layer of ice Ih over an ocean on an icy moon, tens of kilometres thick on Europa and Enceladus, hundreds of kilometres in the thick water layers of Ganymede and Titan.' },
    { term: 'High-pressure ice layer', also: ['ice mantle', 'deep ice layer'], def: 'A layer of ice III, V, VI or VII under an ocean or at the base of a thick water layer, where the pressure exceeds about 0.2 GPa.' },
    { term: 'Dry ice', also: ['solid carbon dioxide', 'CO₂ ice'], def: 'Solid carbon dioxide, which sublimes at −78 °C at 1 atm. On Mars it forms the winter frost and a layer on the south polar cap; it is a separate molecular crystal, not an ice of water.' },
    { term: 'Water world', also: ['ocean planet', 'water-rich planet'], def: 'A planet whose bulk is a considerable fraction water, perhaps up to half by mass, so that its water forms a layer far deeper than the Earth\'s oceans and runs into high-pressure ice and superionic ice.' },
    { term: 'Equilibrium temperature', also: ['effective temperature of a planet'], def: 'The temperature a body would reach if it radiated away exactly the sunlight it absorbs. At the distance of the Earth, with the albedo of the Earth, it is 255 K.' }
  ],
  formulas: [
    { name: 'Depth at which a water layer reaches a given pressure', expr: 'h = p/(rho*gs)', tex: 'h = \\frac{p}{\\rho\\,g}',
      vars: { h: { name: 'depth', q: 'length', unit: 'km' }, p: { name: 'pressure', q: 'pressure', unit: 'GPa', value: 0.21, hint: '0.21 GPa is where ice Ih gives way to ice III and the denser ices.' }, rho: { name: 'mean density of the water layer', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' }, gs: { name: 'gravity of the world', q: 'accel', unit: 'm/s²', value: 1.315, tex: 'g', hint: 'Europa 1.315, Ganymede 1.428, Titan 1.352, Enceladus 0.113, Pluto 0.62, Earth 9.81.' } },
      solveFor: 'h', note: 'The first high-pressure ice appears at about 160 km on Europa, 147 km on Ganymede, 155 km on Titan. Compare with the thickness of each world\'s water layer.',
      stories: { h: 'On a world of gravity {gs} with a water layer of mean density {rho}, at what depth does the pressure reach {p}?' } },
    { name: 'Surface gravity of a world', expr: 'gs = G*M/R^2', tex: 'g = \\frac{G\\,M}{R^2}',
      vars: { gs: { name: 'surface gravity', q: 'accel', unit: 'm/s²', tex: 'g' }, G: { const: 'G' }, M: { name: 'mass of the world', q: 'mass', unit: 'kg', value: 4.8e22, hint: 'Europa 4.8e22 kg, Ganymede 1.48e23, Titan 1.35e23, Pluto 1.3e22.' }, R: { name: 'radius', q: 'length', unit: 'km', value: 1561, hint: 'Europa 1,561 km, Ganymede 2,634, Titan 2,575, Pluto 1,188.' } },
      solveFor: 'gs', note: 'Gravity decides how quickly pressure grows with depth in a layer of ice and water.',
      stories: { gs: 'A moon of mass {M} and radius {R} has what surface gravity?' } },
    { name: 'Equilibrium temperature at a distance from the Sun', expr: 'T = T1*(L*(1 - A))^0.25/sqrt(d)', tex: 'T = T_1\\,\\frac{[L(1 - A)]^{1/4}}{\\sqrt{d}}',
      vars: { T: { name: 'equilibrium temperature', q: 'temperature', unit: 'K' }, T1: { name: 'temperature of a black body at 1 AU from the Sun', q: 'temperature', unit: 'K', value: 278.6, fixed: true, tex: 'T_1' }, L: { name: 'luminosity of the star (Suns)', value: 1, hint: '1 for the Sun.' }, A: { name: 'albedo (Bond)', q: 'ratio', unit: '%', value: 50, min: 0, max: 95, hint: 'Earth 30 %, Mars 25 %, Europa about 60 %, Pluto 50–70 %.' }, d: { name: 'distance from the star (AU)', value: 39.5, min: 0.05, max: 100, hint: 'Earth 1, Mars 1.52, Jupiter 5.2, Saturn 9.6, Pluto 39.5 (mean).' } },
      solveFor: 'T', note: 'The temperature at which a body radiates exactly the sunlight it absorbs, with the heat spread over the whole surface. Pluto comes out near 37 K (observed about 40 K), Mars 210 K, the Earth 255 K.',
      stories: { T: 'A body at {d} AU from a star of {L} Suns has albedo {A}. What is its equilibrium temperature?', d: 'A body of albedo {A} reaches {T} around a star of {L} Suns. At what distance?' } }
  ],
  examples: [
    { title: 'Why Europa has no deep ice floor', q: 'Europa has surface gravity 1.315 m/s² and a water layer (shell and ocean) up to about 170 km thick. At what depth does the pressure reach 0.21 GPa, where the high-pressure ices begin?',
      steps: [{ text: 'Depth:', tex: 'h = \\frac{p}{\\rho g} = \\frac{2.1\\times10^{8}}{1000\\times1.315} = 1.6\\times10^{5}\\ \\mathrm{m} = 160\\ \\mathrm{km}' }, 'The whole water layer is 100 to 170 km deep, so the base barely reaches this pressure.'],
      a: 'About 160 km: Europa\'s water layer is just thick enough to touch the threshold, and no more. Its ocean floor is rock (or at most a thin ice III layer), unlike Ganymede\'s.' },
    { title: 'A thick layer', q: 'For Ganymede (g = 1.43 m/s², water layer up to about 800 km), how deep is the 0.21 GPa level, and what fraction of the layer lies below it?',
      steps: ['Depth: $h = 2.1\\times10^{8}/(1000\\times1.43) = 147$ km.', 'The fraction below it is $1 - 147/800 = 82$ %.'],
      a: 'Starting 147 km down, more than four-fifths of Ganymede\'s water is in the high-pressure regime: its inside is mostly ice III, V and VI and ocean between them, not a global sea.' },
    { title: 'How cold is Pluto?', q: 'Pluto is at an average of 39.5 AU from the Sun. Taking its Bond albedo as 0.5, what is its equilibrium temperature, and what does that mean for water ice?',
      steps: [{ text: 'Use the formula:', tex: 'T = 278.6\\,\\frac{(1 - 0.5)^{1/4}}{\\sqrt{39.5}} = 278.6 \\times \\frac{0.841}{6.285} = 37\\ \\mathrm{K}' }, 'The measured surface temperature is about 40 K.', 'At that temperature water ice has a vapour pressure of essentially zero and a rock-like strength, but nitrogen ice (melting point 63 K) deforms and flows.'],
      a: 'About 37 K, near the measured 40 K. Water ice is a bedrock there, and it is the nitrogen ice that makes glaciers.' }
  ],
  quiz: [
    { q: 'Why does Europa not have a thick layer of high-pressure ice beneath its ocean?', choices: ['It is too warm', 'Its water layer is only 100–170 km deep, so the pressure at the base barely reaches 0.2 GPa', 'Its gravity is high', 'Water cannot form ice there'], a: 1, why: 'The pressure at depth $h$ is $\\rho g h$. With g = 1.3 m/s² a layer 160 km deep gives 0.21 GPa, the threshold for the first high-pressure ice; Europa\'s layer stops near there.' },
    { q: 'Mars\'s polar frost in winter is solid carbon dioxide, not water ice.', a: true, why: 'At 150 K carbon dioxide freezes from the atmosphere into dry ice, which sublimes again in spring; the water ice of the caps lies beneath it.' },
    { q: 'Which ice is most likely to coat the dust grains of a dense interstellar cloud?', choices: ['Ice Ih', 'Ice VII', 'Amorphous ice', 'Ice X'], a: 2, why: 'At 10 K the molecules freeze where they land and cannot form a crystal, so the mantles are amorphous.' },
    { q: 'How high are the water-ice mountains of Pluto found by New Horizons, at the largest?', choices: ['About 300 m', 'About 3.5 km', 'About 35 km', 'About 350 km'], a: 1, why: 'The highest peaks, such as Norgay Montes, rise about 3.5 km — possible because water ice at 40 K is as stiff as rock.' },
    { q: 'At what depth on Ganymede (g = 1.43 m/s², density 1,000 kg/m³) does the pressure reach 0.21 GPa, in km?', answer: 147, why: '$h = p/(\\rho g) = 2.1\\times10^8/(1000\\times1.43) = 1.47\\times10^5$ m = 147 km.' }
  ],
  applications: ['Mission planning: ESA\'s JUICE (launched April 2023) will orbit Ganymede, and NASA\'s Europa Clipper (launched October 2024) will fly past Europa; both ask what lies under the ice shell.', 'Habitability: whether an ocean touches rock (Europa, Enceladus) or is capped by a layer of high-pressure ice (thick water worlds) decides whether minerals can reach it.', 'Planet formation: the ice that coated dust grains is the supply of water for comets, moons and planets; its form decides what gas it traps.', 'Resources: the ice of Mars\'s ground and of the Moon\'s shadowed craters is a possible source of water and propellant.'],
  history: 'The idea that Ganymede and Callisto hold deep oceans came from magnetic measurements by the Galileo spacecraft in the 1990s, and the high-pressure ices were put into interior models from the 1970s. Pluto\'s ice mountains and nitrogen glaciers were seen by New Horizons on 14 July 2015. In 2022 the first population of small planets that may be half water was identified from their densities.',
  sources: ['NASA JPL, "NASA missions provide new insights into \'ocean worlds\'" (13 April 2017) — Cassini at Enceladus and Hubble at Europa.', 'Vance and colleagues, "Ganymede\'s internal structure including thermodynamics of magnesium sulfate oceans in contact with ice", *Planetary and Space Science* 96, 62 (2014).', 'Stern and colleagues, "The Pluto system: initial results from its exploration by New Horizons", *Science* 350, aad1815 (2015).', 'Luque and Pallé, "Density, not radius, separates rocky and water-rich small planets orbiting M dwarfs", *Science* 377, 1211 (2022); Noack and colleagues, "Water-rich planets: how habitable is a water layer deeper than on Earth?", *Icarus* 277, 215 (2016).'],
  sim: { id: 'ices-compress', params: { go: 'ganymede' } }
}
);
