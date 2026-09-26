/* HYPER-CHEMISTRY · content/periodicity.js — the periodic table, the effective
 * nuclear charge behind its trends, and the trends themselves: radius, ionisation
 * energy, electron affinity and electronegativity. */
Hyper.add(

{
  id: 'periodic-table', parent: 'periodicity', title: 'The periodic table', level: 1,
  short: 'The elements in order of atomic number, in rows (periods) and columns (groups) so that elements with the same outer-electron arrangement — and so similar chemistry — fall in the same column.',
  keywords: ['periodic table', 'period', 'group', 'block', 's-block', 'p-block', 'd-block', 'f-block', 'Mendeleev', 'Moseley', 'atomic number', 'metals', 'non-metals', 'metalloids', 'alkali metals', 'halogens', 'noble gases', 'transition metals', 'lanthanides', 'actinides'],
  prereq: ['subatomic-particles', 'atomic-theory'],
  related: ['electron-configuration', 'valence-electrons', 'periodic-trends', 'physics:x-rays'],
  body: `
Open [the periodic table](#/tools/periodic) in Tools and keep it beside this page. It lists all 118 elements in order of **atomic number** $Z$, and it is built so that the pattern you see — which elements sit above one another — is the pattern of their chemistry.

### Periods and groups
Each **row**, or period, starts a new electron shell: period 1 fills 1s, period 2 fills 2s and 2p, period 4 fills 4s, 3d and 4p. Each **column**, or group, collects elements with the same arrangement of outer electrons, numbered 1 to 18. Lithium, sodium, potassium and caesium are all ns¹; fluorine, chlorine, bromine and iodine all ns² np⁵. Same outer electrons, same kind of chemistry: that is the **periodic law**.

The periods have 2, 8, 8, 18, 18, 32 and 32 elements. Those numbers are twice 1, 4, 4, 9, 9, 16, 16 — the numbers of orbitals being filled ([[quantum-numbers]]).

### Blocks
The table falls into four **blocks**, named after the subshell being filled ([[electron-configuration]]):
- **s-block** (groups 1–2, plus helium): two columns, because an s subshell takes 2 electrons. Reactive metals.
- **p-block** (groups 13–18): six columns for the six p electrons. Non-metals, metalloids and the "poor" metals.
- **d-block** (groups 3–12): ten columns for the ten d electrons — the transition metals: iron, copper, platinum.
- **f-block**: fourteen columns, the lanthanides and actinides, usually printed below the rest so that the table fits a page.

### Metals, non-metals and the staircase
About three quarters of the elements are **metals** — shiny, conducting, malleable, forming cations. **Non-metals** sit at the upper right. Between them, along a staircase from boron to astatine, lie the **metalloids** (B, Si, Ge, As, Sb, Te), with intermediate properties; silicon and germanium are the classic semiconductors. Metallic character grows towards the lower left, non-metallic character towards the upper right ([[periodic-trends]]).

Some groups have their own names: the **alkali metals** (group 1), **alkaline-earth metals** (2), **pnictogens** (15), **chalcogens** (16), **halogens** (17) and **noble gases** (18).

### How it was found
Dmitri Mendeleev published his table in 1869, ordered by atomic weight but with the courage to leave gaps and to swap elements where the chemistry demanded it. He predicted the properties of the missing elements. "Eka-silicon", he said, would have an atomic weight near 72 and a density of 5.5 g/cm³; germanium, found in 1886, has 72.6 and 5.3. When gallium was first reported with a density of 4.7, Mendeleev wrote that it should be 5.9 — and remeasured, it was.

Ordering by weight put a few pairs the wrong way round: argon (39.95) before potassium (39.10), tellurium before iodine. In 1913 Henry Moseley measured the X-rays that elements emit when bombarded with electrons and found that the energy of the strongest line (Kα) rises steadily with the element's position:
$$E_{K\\alpha} \\approx \\tfrac34\\,\\mathrm{Ry}\\,(Z - 1)^2$$
The true ordering number is $Z$, the charge of the nucleus. Moseley's law showed exactly which elements were still missing (43, 61, 72, 75) and ended the question of how many elements lie between hydrogen and uranium.

> [!fact] Moseley's law is still at work: a hand-held X-ray fluorescence (XRF) gun identifies the alloy of a scrap-metal part in seconds from the energies of its Kα lines — 6.40 keV for iron, 8.05 keV for copper.
`,
  ideas: [
    'Elements are ordered by atomic number Z; rows are periods, columns are groups.',
    'Elements in a group share the same outer-electron configuration, and so similar chemistry.',
    'The s, p, d and f blocks are 2, 6, 10 and 14 columns wide because of the capacities of those subshells.',
    'Metals lie to the left and centre, non-metals to the upper right, metalloids along the staircase between.',
    'Moseley\'s X-ray law showed that the ordering number is the nuclear charge, not the atomic weight.'
  ],
  pitfalls: [
    'The table is ordered by atomic mass — It is ordered by atomic number. That is why argon (39.95) comes before potassium (39.10).',
    'Elements in the same period have similar properties — Properties change steadily across a period, from reactive metal to non-metal to noble gas. It is the elements in the same group that resemble each other.',
    'Hydrogen is an alkali metal because it sits in group 1 — Hydrogen has one s electron like the alkali metals, but it is a non-metal gas that forms covalent bonds and even hydride anions. Its position is a convention.'
  ],
  formulas: [
    {
      name: 'Moseley\'s law for Kα X-rays',
      expr: 'E = 3/4*Ry*(Z - 1)^2', tex: 'E_{K\\alpha} = \\tfrac34\\,\\mathrm{Ry}\\,(Z - 1)^2',
      vars: {
        E: { name: 'energy of the Kα X-ray line', q: 'energy', unit: 'keV', tex: 'E_{K\\alpha}' },
        Ry: { const: 'Ry' },
        Z: { name: 'atomic number of the element', value: 29, tex: 'Z' }
      },
      note: 'An electron falling from n = 2 to a hole in n = 1 sees the nucleus screened by the one remaining 1s electron, hence $Z - 1$; and $\\tfrac34 = 1 - \\tfrac14$ comes from the Rydberg formula. Accurate to a few per cent; round $Z$ to the nearest whole number.',
      practice: { unknowns: ['E', 'Z'] },
      stories: {
        E: 'Estimate the energy of the Kα X-ray line of the element with atomic number {Z}.',
        Z: 'An X-ray fluorescence analyser finds a strong Kα line at {E}. What is the atomic number of the element?'
      }
    }
  ],
  examples: [
    {
      title: 'Identifying a metal from its X-rays',
      q: 'An XRF analyser pointed at a pipe fitting records its strongest line at 8.05 keV. Which element is it?',
      steps: [
        { text: 'Rearrange Moseley\'s law:', tex: 'Z - 1 = \\sqrt{\\frac{E}{\\tfrac34\\,\\mathrm{Ry}}} = \\sqrt{\\frac{8050\\ \\mathrm{eV}}{10.20\\ \\mathrm{eV}}} = 28.1' },
        '$Z \\approx 29$: copper. (Brass would also show the zinc line near 8.6 keV.)'
      ],
      a: 'Copper, Z = 29.'
    },
    {
      title: 'Reading an element from its position',
      q: 'An element is in period 4 and group 16. Write its outer configuration, name it, and predict the formula of its compound with hydrogen.',
      steps: [
        'Period 4 means the outer shell is n = 4; group 16 means six outer electrons: 4s² 4p⁴ (after the filled 3d¹⁰).',
        'Counting across period 4 to the sixteenth column gives selenium, $Z = 34$.',
        'Like oxygen and sulfur above it, it needs two more electrons for an octet, so its hydride is $\\ce{H2Se}$ (compare $\\ce{H2O}$ and $\\ce{H2S}$).'
      ],
      a: 'Selenium, [Ar] 3d¹⁰ 4s² 4p⁴, forming H₂Se.'
    }
  ],
  quiz: [
    { q: 'Why do sodium and potassium react with water in such a similar way?', choices: ['they have similar atomic masses', 'they are in the same period', 'they both have a single s electron in their outer shell', 'they are both solids'], a: 2,
      why: 'Chemistry is done by the outer electrons. Both are ns¹ and lose that electron easily, forming M⁺ and hydrogen with water. Their masses (23 and 39) and periods differ.' },
    { q: 'How many elements are there in the fourth period, and why?', choices: ['8: one s and three p orbitals', '18: 4s, 3d and 4p orbitals, nine in all', '18: the shell n = 4 holds 18 electrons', '32: the shell n = 4 holds 32 electrons'], a: 1,
      why: 'Period 4 fills 4s (1 orbital), 3d (5) and 4p (3): 9 orbitals, 18 electrons. The 4d and 4f subshells of the fourth shell are filled only in later periods.' },
    { q: 'Which block contains the elements with the most metallic character?', choices: ['the s-block, lower left', 'the p-block, upper right', 'the d-block, top row', 'the noble gases'], a: 0,
      why: 'Metallic character rises towards the lower left: caesium and francium lose their electrons most easily.' },
    { q: 'Mendeleev\'s table was ordered by atomic mass, but modern tables are ordered by atomic number, and the two orders are not quite the same.', a: true,
      why: 'Argon/potassium, cobalt/nickel and tellurium/iodine are the classic inversions. Moseley\'s X-ray measurements showed that the atomic number is the right key.' },
    { q: 'Using Moseley\'s law, estimate the atomic number of an element whose Kα line is at 6.40 keV.', answer: 26,
      why: '$Z - 1 = \\sqrt{6400/10.20} = 25.0$, so $Z = 26$: iron.' }
  ],
  applications: ['Predicting formulas, charges and properties of unfamiliar compounds.', 'Choosing substitute elements in alloys, catalysts and semiconductors from the same group.', 'X-ray fluorescence analysis of alloys, soils and paints.', 'Organising the search for superheavy elements.'],
  history: 'Döbereiner noticed triads of similar elements in 1829 and Newlands an "octave" pattern in 1865. Mendeleev (1869) and Lothar Meyer (1870) built full tables; Mendeleev\'s predictions of gallium, scandium and germanium won it acceptance. Moseley fixed the order by atomic number in 1913, and Seaborg moved the actinides into the f-block in 1945.',
  sim: { id: 'atom-aufbau', params: { z: 34 } }
},

{
  id: 'effective-nuclear-charge', parent: 'periodicity', title: 'Effective nuclear charge and shielding', level: 2,
  short: 'An outer electron does not feel the full charge of the nucleus: the inner electrons shield part of it. The net pull, Z_eff = Z − S, rises across a period and explains most periodic trends.',
  keywords: ['effective nuclear charge', 'Zeff', 'shielding', 'screening', 'Slater\'s rules', 'screening constant', 'penetration', 'core electrons', 'valence electrons'],
  prereq: ['electron-configuration', 'orbital-shapes', 'physics:coulombs-law'],
  related: ['atomic-radius', 'ionization-energy', 'electronegativity', 'periodic-trends'],
  body: `
Sodium's nucleus holds 11 protons, yet its outer 3s electron is removed with only 5.1 eV — less than half the energy needed to strip hydrogen's single electron from a nucleus with one proton. The reason is **shielding**: between the 3s electron and the nucleus sit ten inner electrons, whose negative charge cancels most of the nuclear pull. What the outer electron feels is the **effective nuclear charge**

$$Z_\\text{eff} = Z - S$$

where $S$, the **shielding (screening) constant**, measures how much of the nuclear charge the other electrons hide.

### Who shields whom
- **Inner-shell electrons shield well.** They lie almost entirely between the nucleus and the outer electron, so each cancels nearly one proton.
- **Electrons in the same shell shield poorly.** They are as far out as the electron in question, often on the other side of the atom; each hides only about a third of a proton.
- **Penetration matters.** An s electron spends some time close to the nucleus, inside the inner shells, so it is shielded less than a p electron of the same shell, and p less than d ([[orbital-shapes]]).

### Slater's rules
John Slater gave a quick recipe (1930) for estimating $S$. Write the configuration in groups (1s) (2s, 2p) (3s, 3p) (3d) (4s, 4p) (4d) (4f) (5s, 5p) … Then, for an electron in an **s or p** group:
- each other electron in the same group adds 0.35 (0.30 inside 1s);
- each electron in the shell $n - 1$ adds 0.85;
- each electron in shells $n - 2$ and lower adds 1.00;
- electrons in groups to the right add nothing.

For an electron in a **d or f** group, the others in its group add 0.35 and every electron to the left adds 1.00.

Sodium's 3s electron: $S = 8 \\times 0.85 + 2 \\times 1.00 = 8.8$, so $Z_\\text{eff} = 2.2$. Chlorine's 3p electron: six others in (3s, 3p) at 0.35, eight at 0.85, two at 1.00: $S = 10.9$, $Z_\\text{eff} = 6.1$.

### The trends it explains
- **Across a period**, each step adds one proton and one electron to the same shell. The new electron shields only 0.35 of the new proton, so $Z_\\text{eff}$ on the outer electrons rises by about 0.65 per element: from 1.3 for lithium to 5.2 for fluorine. The outer electrons are pulled in closer and held harder — radius falls, [[ionization-energy|ionisation energy]] and [[electronegativity]] rise.
- **Down a group**, $Z_\\text{eff}$ on the outer electron stays about the same (2.2 for sodium, potassium and rubidium by Slater's rules), but each period adds a shell, so the electron is farther out and more weakly held.
- **Ions of transition metals** lose 4s electrons first: in iron, a 4s electron sees $Z_\\text{eff} = 3.75$, a 3d electron 6.25 — the 4s electron is farther out and less tightly bound.

> [!note] Slater's numbers are estimates. Accurate calculations give, for example, 2.51 rather than 2.2 for sodium 3s, and they show that $Z_\\text{eff}$ creeps up slightly down a group. The *differences* between neighbours, which drive the trends, come out right.
`,
  ideas: [
    'Z_eff = Z − S: the nuclear charge an electron actually feels after shielding by the others.',
    'Inner electrons shield almost completely; electrons in the same shell shield only about a third each.',
    'Across a period Z_eff on the outer electrons rises by about 0.65 per element.',
    'Down a group Z_eff stays roughly constant while the outer shell gets farther away.',
    'Rising Z_eff shrinks atoms and raises ionisation energy and electronegativity.'
  ],
  pitfalls: [
    'The outer electron feels the full nuclear charge — Only the net charge after shielding; for sodium\'s 3s electron that is about 2 to 2.5 out of 11.',
    'Electrons in the same shell shield each other as well as inner electrons do — They shield much less, which is why Z_eff grows across a period.',
    'Adding protons down a group makes the outer electron more tightly held — Each period adds both protons and a full shell of shielding electrons; the extra distance wins, so outer electrons are held less tightly down a group.'
  ],
  formulas: [
    {
      name: 'Effective nuclear charge',
      expr: 'Zeff = Z - S', tex: 'Z_\\text{eff} = Z - S',
      vars: {
        Zeff: { name: 'effective nuclear charge', tex: 'Z_\\text{eff}' },
        Z: { name: 'atomic number (nuclear charge)', int: true, value: 11, tex: 'Z' },
        S: { name: 'shielding constant (from Slater\'s rules)', value: 8.8, tex: 'S' }
      },
      note: 'Defaults: the 3s electron of sodium, $S = 8 \\times 0.85 + 2 \\times 1.00$.',
      practice: { unknowns: ['Zeff', 'S'] },
      stories: {
        Zeff: 'An outer electron of an atom with {Z} protons is shielded by S = {S}. What effective nuclear charge does it feel?',
        S: 'An outer electron of an atom with atomic number {Z} feels an effective nuclear charge of {Zeff}. What is its shielding constant?'
      }
    }
  ],
  examples: [
    {
      title: 'Oxygen and fluorine side by side',
      q: 'Use Slater\'s rules to find $Z_\\text{eff}$ for a 2p electron in oxygen ($Z = 8$) and in fluorine ($Z = 9$).',
      steps: [
        'Oxygen, 1s² (2s² 2p⁴): the other five electrons of the (2s, 2p) group add $5 \\times 0.35 = 1.75$; the two 1s electrons ($n - 1$) add $2 \\times 0.85 = 1.70$. $S = 3.45$, $Z_\\text{eff} = 4.55$.',
        'Fluorine, 1s² (2s² 2p⁵): six others at 0.35 = 2.10, plus 1.70. $S = 3.80$, $Z_\\text{eff} = 5.20$.',
        'One more proton, but only 0.35 more shielding: $Z_\\text{eff}$ rises by 0.65. That is why fluorine is smaller (57 pm against 66 pm) and harder to ionise (17.4 against 13.6 eV).'
      ],
      a: 'O: 4.55; F: 5.20.'
    },
    {
      title: 'Why iron loses its 4s electrons first',
      q: 'Iron is [Ar] 3d⁶ 4s². Compare $Z_\\text{eff}$ for a 4s and a 3d electron.',
      steps: [
        '4s electron: the other 4s electron adds 0.35; the 14 electrons with $n = 3$ (3s² 3p⁶ 3d⁶) add $14 \\times 0.85 = 11.90$; the 10 electrons with $n \\le 2$ add 10.00. $S = 22.25$, $Z_\\text{eff} = 26 - 22.25 = 3.75$.',
        '3d electron: the five other 3d electrons add $5 \\times 0.35 = 1.75$; all 18 electrons to the left (1s to 3p) add 18.00. $S = 19.75$, $Z_\\text{eff} = 6.25$.',
        'The 4s electron feels less than two thirds of the pull on a 3d electron and lies farther out, so it goes first when iron ionises.'
      ],
      a: '4s: 3.75; 3d: 6.25. The 4s electrons are lost first.'
    }
  ],
  quiz: [
    { q: 'Across period 3 from sodium to chlorine, the effective nuclear charge on the outer electrons…', choices: ['stays the same', 'increases by about 0.65 per element', 'increases by 1 per element', 'decreases'], a: 1,
      why: 'Each step adds a proton (+1) and an electron to the same shell, which shields only about 0.35 of it: a net increase of about 0.65.' },
    { q: 'Using Slater\'s rules, what is $Z_\\text{eff}$ for the 4s electron of potassium ($Z = 19$)?', answer: 2.2,
      why: 'Potassium is 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹. Eight electrons with $n = 3$ add $8 \\times 0.85 = 6.8$, ten with $n \\le 2$ add 10.0: $S = 16.8$ and $Z_\\text{eff} = 2.2$ — the same as sodium.' },
    { q: 'Why does a 2s electron feel a larger effective nuclear charge than a 2p electron in the same atom?', choices: ['2s is in a lower shell', '2s penetrates closer to the nucleus, inside the 1s electrons', '2p electrons are paired', '2s has more nodes'], a: 1,
      why: 'Both are in shell 2, but the 2s orbital has a small inner lobe close to the nucleus where shielding by 1s is weak. Slater\'s simple rules lump 2s and 2p together; more accurate treatments separate them.' },
    { q: 'Down group 1, the outer electron is held more weakly mainly because…', choices: ['Z_eff falls sharply', 'the nuclear charge falls', 'the outer shell is farther from the nucleus', 'the electrons are paired'], a: 2,
      why: 'Z_eff on the outer electron stays roughly constant down the group, but each period adds a shell, so the electron is farther out and the attraction weaker.' }
  ],
  applications: ['Explaining and predicting periodic trends in size, ionisation energy and electronegativity.', 'Estimating orbital sizes and energies before a full quantum calculation.', 'Understanding which electrons transition metals lose, and so their ion chemistry.'],
  history: 'John C. Slater published his screening rules in 1930 to build simple analytic orbitals. Clementi and Raimondi computed more accurate effective charges from self-consistent-field wavefunctions in 1963.',
  sim: 'atom-zeff'
},

{
  id: 'periodic-trends', parent: 'periodicity', title: 'Periodic trends', level: 1,
  short: 'Across a period atoms get smaller, harder to ionise and more electronegative; down a group the reverse. Metallic character, reactivity and the acid–base nature of oxides follow the same map.',
  keywords: ['periodic trends', 'atomic radius trend', 'ionisation energy trend', 'electronegativity trend', 'metallic character', 'reactivity', 'alkali metals', 'halogens', 'oxides acidic basic amphoteric', 'diagonal relationship', 'melting point'],
  prereq: ['periodic-table', 'effective-nuclear-charge'],
  related: ['atomic-radius', 'ionization-energy', 'electronegativity', 'ionic-bonding', 'metallic-bonding', 'acid-base-definitions'],
  body: `
The periodic table is a map, and like a map it has a direction of travel. Two forces decide nearly everything: how hard the nucleus pulls on the outer electrons ([[effective-nuclear-charge]], which rises across a period) and how far away those electrons are (which grows down a group). Put them together and a handful of trends appear, all pointing the same way.

| moving | radius | ionisation energy | electronegativity | metallic character |
|---|---|---|---|---|
| across a period → | decreases | increases | increases | decreases |
| down a group ↓ | increases | decreases | decreases | increases |

So the most metallic, most easily ionised, largest atoms are at the **lower left** (caesium, francium) and the smallest, most electronegative at the **upper right** (fluorine), with the noble gases a special case. Play with the trends against $Z$ in the simulation below: the saw-tooth of each property repeats with every period.

### Reactivity of metals and non-metals
Metals react by **losing** electrons, so the easier that is, the more reactive the metal. Down group 1: lithium fizzes steadily in water, sodium melts into a ball and skates about, potassium bursts into lilac flame, rubidium and caesium explode. Non-metals react by **gaining** electrons, so the trend runs the other way: fluorine is the most reactive element of all, and down group 17 each halogen is less reactive than the one above. Chlorine water turns a colourless bromide solution orange by taking its electrons: $\\ce{Cl2 + 2Br- -> 2Cl- + Br2}$; iodine cannot do the same to chloride.

### Across period 3
From sodium to argon the elements change from soft, reactive metals through a network solid to molecular non-metals:

| | Na | Mg | Al | Si | P | S | Cl | Ar |
|---|---|---|---|---|---|---|---|---|
| melting point (°C) | 98 | 650 | 660 | 1414 | 44 | 115 | −101 | −189 |
| structure | metal | metal | metal | covalent network | $\\ce{P4}$ | $\\ce{S8}$ | $\\ce{Cl2}$ | atoms |
| oxide | $\\ce{Na2O}$ | $\\ce{MgO}$ | $\\ce{Al2O3}$ | $\\ce{SiO2}$ | $\\ce{P4O10}$ | $\\ce{SO3}$ | $\\ce{Cl2O7}$ | — |
| oxide character | basic | basic | amphoteric | acidic | acidic | acidic | acidic | |

The melting points rise with the strength of [[metallic-bonding]], peak at silicon's giant covalent network, then collapse where only weak forces hold small molecules together. The oxides turn from **basic** (sodium oxide makes sodium hydroxide in water) through **amphoteric** (aluminium oxide dissolves in both acids and alkalis) to **acidic** (sulfur trioxide makes sulfuric acid) as the element's electronegativity climbs and its bond to oxygen becomes covalent.

### Subtleties
- **Diagonal relationships**: lithium resembles magnesium, beryllium resembles aluminium, boron resembles silicon. Moving right raises the charge-to-size ratio and moving down lowers it; a diagonal step roughly cancels.
- **The d-block contraction**: gallium is hardly larger than aluminium (122 against 121 pm), because the ten 3d electrons added before it shield poorly.
- **The lanthanide contraction**: fourteen poorly shielding 4f electrons make hafnium the same size as zirconium (both 175 pm), so the two are chemically near-twins and hard to separate — a real headache for makers of nuclear fuel cladding, which must be almost free of neutron-absorbing hafnium.
- **Noble gases** have no ordinary electronegativity and a "radius" that depends on the definition ([[atomic-radius]]).
`,
  ideas: [
    'Across a period: effective nuclear charge rises, so atoms shrink and hold their electrons harder.',
    'Down a group: outer electrons are farther out, so atoms grow and hold their electrons less tightly.',
    'Metallic character and metal reactivity increase towards the lower left; non-metal reactivity towards the upper right.',
    'Oxides change from basic (left) through amphoteric to acidic (right).',
    'Irregularities — diagonal relationships, d-block and lanthanide contractions — come from how poorly d and f electrons shield.'
  ],
  pitfalls: [
    'Atoms get bigger across a period because they have more electrons — The extra electrons go into the same shell, and the growing nuclear charge pulls the whole shell in: atoms get smaller.',
    'Halogens get more reactive down the group, like alkali metals — Halogens react by gaining electrons, which gets harder down the group; their reactivity decreases. The two groups have opposite trends.',
    'Every property rises or falls smoothly across a period — Melting points jump up and down with the type of structure, and ionisation energies have small dips at groups 13 and 16.'
  ],
  examples: [
    {
      title: 'Ranking by the trends',
      q: 'Arrange Mg, Na, S and Cl in order of increasing atomic radius, and then of increasing first ionisation energy.',
      steps: [
        'All four are in period 3, where radius falls from left to right: Cl < S < Mg < Na (102, 105, 141, 166 pm).',
        'Ionisation energy rises from left to right: Na < Mg < S < Cl (496, 738, 1000, 1251 kJ/mol).',
        'The two orders are exactly opposite — both follow from the growing effective nuclear charge.'
      ],
      a: 'Radius: Cl < S < Mg < Na. Ionisation energy: Na < Mg < S < Cl.'
    },
    {
      title: 'An amphoteric oxide',
      q: 'Aluminium oxide dissolves in hydrochloric acid and in sodium hydroxide solution. Write equations and explain why this happens for aluminium but not sodium or sulfur.',
      steps: [
        'With acid it acts as a base: $\\ce{Al2O3 + 6HCl -> 2AlCl3 + 3H2O}$.',
        'With alkali it acts as an acid, forming the aluminate ion: $\\ce{Al2O3 + 2NaOH + 3H2O -> 2Na[Al(OH)4]}$.',
        'Aluminium sits in the middle of the period: its bond to oxygen is partly ionic, partly covalent. Sodium oxide is fully basic, sulfur trioxide fully acidic. The Bayer process uses exactly this to dissolve alumina out of bauxite in hot caustic soda, leaving the iron oxides behind.'
      ],
      a: 'Al₂O₃ is amphoteric: it reacts with both acids and bases.'
    }
  ],
  quiz: [
    { q: 'Which element has the largest atoms?', choices: ['Li', 'Na', 'K', 'Cl'], a: 2,
      why: 'Radius increases down a group and decreases across a period. Potassium is lowest in group 1 of those listed (203 pm).' },
    { q: 'Which is the most reactive halogen?', choices: ['fluorine', 'chlorine', 'bromine', 'iodine'], a: 0,
      why: 'Halogens react by gaining an electron; the small fluorine atom, with its outer shell close to the nucleus, does this most readily. Reactivity falls down the group.' },
    { q: 'The oxide of an element dissolves in water to give an acidic solution. Where is the element most likely to be?', choices: ['group 1', 'group 2', 'upper right of the table', 'lower left of the table'], a: 2,
      why: 'Non-metal oxides such as $\\ce{SO3}$, $\\ce{CO2}$ and $\\ce{P4O10}$ are acidic. Metal oxides from the left are basic.' },
    { q: 'Potassium is more reactive with water than sodium mainly because its outer electron is farther from the nucleus and more easily lost.', a: true,
      why: 'Both have one outer s electron and a similar effective nuclear charge on it, but potassium\'s 4s electron is farther out: its ionisation energy is 419 kJ/mol against sodium\'s 496.' },
    { q: 'Why are zirconium and hafnium so hard to separate?', choices: ['they have the same atomic number', 'the lanthanide contraction makes them almost the same size', 'they form the same alloy', 'hafnium is radioactive'], a: 1,
      why: 'Filling the fourteen 4f orbitals before hafnium adds a lot of nuclear charge that f electrons shield poorly, cancelling the usual growth down the group. Same size and same outer electrons make near-identical chemistry.' }
  ],
  applications: ['Predicting how an unfamiliar element will react from its position.', 'Choosing reducing agents (alkali metals) and oxidising agents (halogens) in synthesis.', 'The Bayer process for alumina, which exploits the amphoteric oxide of aluminium.', 'Separating zirconium from hafnium for nuclear-reactor cladding.'],
  sim: 'atom-trends'
},

{
  id: 'atomic-radius', parent: 'periodicity', title: 'Atomic and ionic radius', level: 2,
  short: 'An atom has no sharp edge, so its radius is defined from the distances between bonded atoms. Atoms shrink across a period and grow down a group; cations are smaller and anions larger than their atoms.',
  keywords: ['atomic radius', 'covalent radius', 'metallic radius', 'van der Waals radius', 'ionic radius', 'cation', 'anion', 'isoelectronic series', 'bond length', 'lanthanide contraction', 'picometre'],
  prereq: ['effective-nuclear-charge', 'periodic-trends'],
  related: ['bond-order-length', 'ionic-bonding', 'lattice-energy', 'crystal-structures', 'intermolecular-forces'],
  body: `
An atom is a cloud whose density fades gradually into nothing ([[orbital-shapes]]), so "the radius of an atom" needs a definition. Chemists measure the distance between the nuclei of two atoms that touch in a well-defined way — by X-ray diffraction of crystals or by spectroscopy of molecules — and share it out.

### Kinds of radius
- **Covalent radius**: half the distance between two identical atoms joined by a single bond. The Cl–Cl bond in $\\ce{Cl2}$ is 199 pm, so chlorine's covalent radius is about 100 pm.
- **Metallic radius**: half the distance between neighbouring atoms in a metal crystal (sodium 186 pm).
- **Van der Waals radius**: half the distance between atoms that touch without bonding, as in neighbouring molecules of a solid (chlorine 175 pm). It is always larger than the covalent radius, and it is the one that sets how closely molecules pack ([[intermolecular-forces]]).
- **Ionic radius**: the share of the cation–anion distance in an ionic crystal assigned to each ion.

Because radii add up, you can estimate a bond length before anyone has measured it:
$$d_{AB} \\approx r_A + r_B$$
Carbon (76 pm) and chlorine (102 pm) predict 178 pm for C–Cl; the measured value in chloromethane is 178 pm. Bonds between atoms of very different electronegativity come out a little shorter than the sum, and double and triple bonds much shorter ([[bond-order-length]]).

### Trends
Covalent radii (in pm) across period 2 and down group 1:

| Li | Be | B | C | N | O | F |
|---|---|---|---|---|---|---|
| 128 | 96 | 84 | 76 | 71 | 66 | 57 |

| Li | Na | K | Rb | Cs |
|---|---|---|---|---|
| 128 | 166 | 203 | 220 | 244 |

Across the period the outer electrons stay in the same shell while the [[effective-nuclear-charge|effective nuclear charge]] climbs, so the atom shrinks by more than half. Down the group each new shell adds distance. In the transition series the radius barely changes, because each new electron goes into an inner d subshell.

### Ions
- A **cation** is smaller than its atom: it has lost electrons — often its whole outer shell — and the remaining electrons are pulled in by an unchanged nucleus. Sodium's covalent radius is 166 pm, $\\ce{Na+}$ is 102 pm.
- An **anion** is larger: the extra electrons repel one another and are shielded by one another, while the nuclear charge is unchanged. $\\ce{Cl-}$ is 181 pm against 102 pm for the atom.
- In an **isoelectronic series** all have the same electrons, so size is set by the nuclear charge alone: $\\ce{O^2-}$ 140, $\\ce{F-}$ 133, $\\ce{Na+}$ 102, $\\ce{Mg^2+}$ 72, $\\ce{Al^3+}$ 54 pm (six-coordinate ionic radii).

Ionic sizes decide which crystal structure a salt adopts ([[crystal-structures]]) and how strong its lattice is ([[lattice-energy]]): small, highly charged ions such as $\\ce{Mg^2+}$ and $\\ce{O^2-}$ pull hard on each other, which is why magnesium oxide melts at 2852 °C and lines furnaces, while sodium chloride melts at 801 °C.

> [!tip] Ionic radii depend on the number of neighbours and on who compiled the table. Use values from one consistent set — mixing tables can shift a bond-length estimate by 10 pm or more.
`,
  ideas: [
    'Atomic radii are defined from measured internuclear distances: covalent, metallic, van der Waals and ionic radii differ.',
    'Covalent radii add: a bond length is roughly the sum of the two radii.',
    'Radius decreases across a period (rising Z_eff) and increases down a group (more shells).',
    'Cations are smaller and anions larger than the neutral atoms they come from.',
    'In an isoelectronic series, the more protons, the smaller the particle.'
  ],
  pitfalls: [
    'An atom has a definite edge, like a billiard ball — The electron density fades away gradually; any radius is a convention based on how close atoms get in a particular situation.',
    'Atoms with more electrons are always bigger — Across a period electrons are added but atoms shrink. Fluorine has more electrons than lithium but is less than half its size.',
    'Na⁺ and Na have the same size because they have the same nucleus — Losing the 3s electron removes the whole third shell; Na⁺ is only about 60 % of the atom\'s radius.'
  ],
  formulas: [
    {
      name: 'Bond length from radii',
      expr: 'd = rA + rB', tex: 'd_{AB} = r_A + r_B',
      vars: {
        d: { name: 'distance between the nuclei', q: 'length', unit: 'pm', tex: 'd_{AB}' },
        rA: { name: 'radius of atom or ion A', q: 'length', unit: 'pm', value: 76, tex: 'r_A' },
        rB: { name: 'radius of atom or ion B', q: 'length', unit: 'pm', value: 102, tex: 'r_B' }
      },
      note: 'Use covalent radii for single covalent bonds (defaults: C and Cl) and ionic radii for the cation–anion distance in a salt. Polar and multiple bonds come out shorter than the sum.',
      stories: {
        d: 'Estimate the length of a bond between two atoms with covalent radii {rA} and {rB}.',
        rB: 'In a salt the cation–anion distance is {d} and the cation radius is {rA}. What is the radius of the anion?',
        rA: 'The C–Cl bond is {d} long and chlorine\'s covalent radius is {rB}. What covalent radius does that give for carbon?'
      }
    }
  ],
  examples: [
    {
      title: 'Predicting bond lengths',
      q: 'Estimate the O–H bond length in water and the Na–Cl distance in rock salt. (Covalent radii: O 66, H 31 pm. Ionic radii: Na⁺ 102, Cl⁻ 181 pm.)',
      steps: [
        'O–H: $66 + 31 = 97$ pm. Measured: 96 pm.',
        'Na⁺–Cl⁻: $102 + 181 = 283$ pm. Measured in the crystal: 282 pm — half the edge of the cubic unit cell, 564 pm.'
      ],
      a: 'About 97 pm and 283 pm, within 1 % of experiment.'
    },
    {
      title: 'Ordering an isoelectronic series',
      q: 'Put $\\ce{S^2-}$, $\\ce{Cl-}$, $\\ce{K+}$ and $\\ce{Ca^2+}$ in order of increasing size.',
      steps: [
        'All four have 18 electrons, the argon configuration, so the electron clouds are alike.',
        'The nuclear charges are 16, 17, 19 and 20. More protons pull the same electrons closer.',
        'Order: $\\ce{Ca^2+}$ (100 pm) < $\\ce{K+}$ (138) < $\\ce{Cl-}$ (181) < $\\ce{S^2-}$ (184).'
      ],
      a: 'Ca²⁺ < K⁺ < Cl⁻ < S²⁻.'
    }
  ],
  quiz: [
    { q: 'Which is the largest?', choices: ['$\\ce{Na}$', '$\\ce{Na+}$', '$\\ce{Mg^2+}$', '$\\ce{Ne}$'], a: 0,
      why: 'The sodium atom has an electron in the third shell. $\\ce{Na+}$, $\\ce{Mg^2+}$ and $\\ce{Ne}$ all have only two shells, the neon arrangement.' },
    { q: 'Which ion is smallest?', choices: ['$\\ce{O^2-}$', '$\\ce{F-}$', '$\\ce{Na+}$', '$\\ce{Al^3+}$'], a: 3,
      why: 'All four have 10 electrons. Aluminium has the most protons (13), so it pulls the same electrons in closest.' },
    { q: 'Using covalent radii C = 76 pm and F = 57 pm, estimate the length of a C–F bond, in picometres.', answer: 133, unit: 'pm',
      why: '$76 + 57 = 133$ pm. The measured value in fluoromethane is 138 pm; bonds between atoms of very different electronegativity deviate most from simple addition.' },
    { q: 'A chlorine atom\'s van der Waals radius is larger than its covalent radius.', a: true,
      why: 'Covalently bonded atoms overlap their electron clouds; non-bonded atoms only touch. For chlorine the values are about 175 pm and 100 pm.' },
    { q: 'Why is a chloride ion larger than a chlorine atom?', choices: ['it has more protons', 'the extra electron adds repulsion and shielding while the nuclear charge is unchanged', 'it has an extra shell', 'ions are always larger than atoms'], a: 1,
      why: 'Cl⁻ has the same shells as Cl, but 18 electrons repelling one another around 17 protons. The cloud swells from about 100 to 181 pm. Cations, by contrast, are smaller than their atoms.' }
  ],
  applications: ['Estimating bond lengths and molecular geometry before a structure is measured.', 'Predicting crystal structures of salts and ceramics from ion size ratios.', 'Designing ion-selective materials: zeolites, crown ethers and battery electrodes sized to one ion.', 'Dopant choice in semiconductors and ceramics, where the dopant must fit the host\'s site.'],
  sim: { id: 'atom-trends', params: { prop: 'r' } }
},

{
  id: 'ionization-energy', parent: 'periodicity', title: 'Ionisation energy and electron affinity', level: 2,
  short: 'The ionisation energy is the energy needed to pull an electron off a gaseous atom; the electron affinity is the energy released when one is added. Both measure how tightly an atom holds electrons.',
  keywords: ['ionisation energy', 'ionization energy', 'first ionisation energy', 'successive ionisation energies', 'electron affinity', 'kJ/mol', 'electronvolt', 'photoionisation', 'shell structure', 'subshell', 'exceptions'],
  prereq: ['effective-nuclear-charge', 'atomic-spectra', 'electron-configuration'],
  related: ['electronegativity', 'periodic-trends', 'ionic-bonding', 'lattice-energy', 'physics:photoelectric-effect'],
  body: `
The **first ionisation energy** is the energy needed to remove the most loosely held electron from one mole of atoms in the gas phase:
$$\\ce{X(g) -> X+(g) + e-} \\qquad \\Delta H = IE_1$$
It is always positive — pulling an electron away from a nucleus always costs energy. Values run from 376 kJ/mol for caesium to 2372 kJ/mol for helium; per atom, divide by 96.49 to get electronvolts (caesium 3.89 eV, helium 24.6 eV). The gas phase matters: it measures the atom alone, without neighbours.

### Trends and their exceptions
Ionisation energy rises across a period, as the [[effective-nuclear-charge|effective nuclear charge]] grows and the atom shrinks, and falls down a group, as the outer electron gets farther away. It peaks at each noble gas and drops sharply to the next alkali metal, whose single electron starts a new shell. Across period 2 two small dips break the rise, and both are signatures of subshells:

| Li | Be | B | C | N | O | F | Ne |
|---|---|---|---|---|---|---|---|
| 520 | 900 | 801 | 1086 | 1402 | 1314 | 1681 | 2081 |

- **Be → B** falls because boron's electron is the first in 2p, which is higher in energy and better shielded than 2s.
- **N → O** falls because oxygen's fourth 2p electron must pair up in an orbital already occupied; the repulsion between the pair makes one of them easier to remove. Nitrogen's half-filled 2p³ has no paired p electrons.

### Successive ionisation energies
Keep pulling electrons off and each costs more, because the remaining ones are held by the same nucleus with less repulsion among themselves. The jumps are uneven: they are **huge** when the next electron comes from an inner shell. For aluminium, in kJ/mol:

| $IE_1$ | $IE_2$ | $IE_3$ | $IE_4$ |
|---|---|---|---|
| 578 | 1817 | 2745 | 11 577 |

Three electrons come off at moderate cost, the fourth needs four times as much — so aluminium has three valence electrons and forms $\\ce{Al^3+}$, never $\\ce{Al^4+}$. The position of the big jump reads an element's group straight from the data. It is also the most direct evidence for electron shells.

### Electron affinity
The **electron affinity** $EA$ is the energy *released* when a gaseous atom gains an electron, $\\ce{X(g) + e- -> X-(g)}$. (Tables sometimes list the enthalpy change instead, which is $-EA$.) Chlorine has the largest: 349 kJ/mol. Fluorine releases less (328), because the extra electron is crowded into its small 2p shell. Oxygen releases 141 kJ/mol for the first electron, but adding a second to $\\ce{O-}$ costs about 744 kJ/mol — the negative ion repels it. $\\ce{O^2-}$ exists in solids only because the lattice energy of an oxide more than pays that price ([[lattice-energy]]). Noble gases, and atoms with full or half-full subshells such as beryllium and nitrogen, do not form stable gaseous anions at all.

### Using ionisation energies
- A **photon** can ionise an atom if its energy exceeds $IE$: the threshold wavelength is $\\lambda = hc/IE$. Photoionisation detectors, used to sniff solvent vapours in factories and at spill sites, carry a 10.6 eV ultraviolet lamp: benzene (9.2 eV) and most organic vapours are ionised and counted, while nitrogen, oxygen and water (above 12 eV) are not.
- Alkali metals, with the lowest $IE$, give up electrons most readily: caesium coats the photocathodes of light detectors.
- The balance of ionisation energy, electron affinity and lattice energy decides whether an ionic compound forms ([[ionic-bonding]]).
`,
  ideas: [
    'First ionisation energy: energy to remove one electron from each atom in a mole of gaseous atoms; always positive.',
    'It rises across a period and falls down a group, with dips at groups 13 (new p subshell) and 16 (first paired p electron).',
    'Successive ionisation energies jump when an inner shell is reached, revealing the number of valence electrons.',
    'Electron affinity is the energy released when a gaseous atom gains an electron; chlorine\'s is the largest.',
    'Adding a second electron to an anion always costs energy.'
  ],
  pitfalls: [
    'Ionisation energy can be negative for metals because they "want" to lose electrons — Removing an electron always costs energy; metals simply need less. Ionic compounds form because of the energy released afterwards.',
    'Fluorine has the highest electron affinity because it is the most electronegative — Chlorine\'s electron affinity (349 kJ/mol) is higher than fluorine\'s (328); the small fluorine atom packs the extra electron in tightly and repulsion costs energy.',
    'Successive ionisation energies rise evenly — They rise steadily within a shell and then leap when the next electron comes from an inner shell. The leap is the useful information.'
  ],
  formulas: [
    {
      name: 'Ionisation energy per atom and per mole',
      expr: 'Em = NA*E', tex: 'E_m = N_A E',
      vars: {
        Em: { name: 'ionisation energy per mole', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_m' },
        NA: { const: 'NA' },
        E: { name: 'ionisation energy per atom', q: 'energy', unit: 'eV', value: 5.139, tex: 'E' }
      },
      note: 'Physicists quote eV per atom, chemists kJ/mol: 1 eV per atom = 96.49 kJ/mol. Default: sodium.',
      stories: {
        Em: 'The first ionisation energy of an atom is {E}. What is it in kilojoules per mole?',
        E: 'An element has a first ionisation energy of {Em}. How many electronvolts is that per atom?'
      }
    },
    {
      name: 'Longest wavelength that can ionise an atom',
      expr: 'lambda = h*c/IE', tex: '\\lambda_\\text{max} = \\frac{hc}{\\mathrm{IE}}',
      vars: {
        lambda: { name: 'threshold wavelength', q: 'length', unit: 'nm', tex: '\\lambda_\\text{max}' },
        h: { const: 'h' },
        c: { const: 'c' },
        IE: { name: 'ionisation energy per atom', q: 'energy', unit: 'eV', value: 3.894, tex: '\\mathrm{IE}' }
      },
      note: 'Photons of longer wavelength cannot ionise the atom however many there are. Default: caesium, which even near-ultraviolet light ionises.',
      stories: {
        lambda: 'What is the longest wavelength of light that can ionise an isolated atom whose ionisation energy is {IE}?',
        IE: 'A gas starts to be ionised by ultraviolet light shorter than {lambda}. What is its ionisation energy?'
      }
    }
  ],
  examples: [
    {
      title: 'Which group?',
      q: 'An element has successive ionisation energies of 738, 1451, 7733 and 10 543 kJ/mol. Which group is it in?',
      steps: [
        'Ratios of successive values: $1451/738 = 2.0$, $7733/1451 = 5.3$, $10\\,543/7733 = 1.4$.',
        'The big jump is between the second and third electrons: two electrons are easy to remove, the third comes from an inner shell.',
        'Two valence electrons: group 2. (It is magnesium, forming $\\ce{Mg^2+}$.)'
      ],
      a: 'Group 2 (magnesium).'
    },
    {
      title: 'What a photoionisation detector can see',
      q: 'A detector lamp emits photons of 10.6 eV. What wavelength is that, and can it detect methane (IE 12.6 eV) or toluene (8.8 eV)?',
      steps: [
        '$\\lambda = hc/E = 1239.8\\ \\mathrm{eV\\,nm}/10.6\\ \\mathrm{eV} = 117$ nm, in the vacuum ultraviolet.',
        'Toluene needs only 8.8 eV: its molecules are ionised and counted.',
        'Methane needs 12.6 eV, more than a 10.6 eV photon carries: the detector is blind to it, so methane leaks are found with other sensors.'
      ],
      a: '117 nm; it detects toluene but not methane.'
    }
  ],
  quiz: [
    { q: 'Why is the first ionisation energy of oxygen lower than that of nitrogen?', choices: ['oxygen has a smaller nuclear charge', 'oxygen\'s fourth 2p electron is paired, and repulsion makes it easier to remove', 'oxygen\'s outer electron is in a new shell', 'nitrogen is more electronegative'], a: 1,
      why: 'Nitrogen has one electron in each 2p orbital. In oxygen one orbital holds two, and their mutual repulsion lowers the energy needed to remove one of them.' },
    { q: 'An element\'s successive ionisation energies (kJ/mol) are 496, 4562, 6910, 9543. How many valence electrons does it have?', answer: 1,
      why: 'The ninefold jump comes after the first electron: one valence electron, group 1 (sodium).' },
    { q: 'Which has the highest first ionisation energy?', choices: ['Li', 'Na', 'Ne', 'Ar'], a: 2,
      why: 'Noble gases top each period, and ionisation energy falls down a group, so neon (2081 kJ/mol) beats argon (1521).' },
    { q: 'Which element releases the most energy when a gaseous atom gains an electron?', choices: ['fluorine', 'chlorine', 'oxygen', 'neon'], a: 1,
      why: 'Chlorine, 349 kJ/mol. Fluorine\'s value (328) is lower because its compact 2p shell is already crowded; neon forms no stable anion at all.' },
    { q: 'Converting 1 eV per atom to kilojoules per mole, what factor do you multiply by?', answer: 96.49, unit: 'kJ/mol',
      why: '$1.602\\times10^{-19}\\ \\mathrm{J} \\times 6.022\\times10^{23}\\ \\mathrm{mol^{-1}} = 96\\,485$ J/mol = 96.49 kJ/mol.' }
  ],
  applications: ['Identifying an element\'s group from successive ionisation energies.', 'Photoionisation detectors for solvent vapours in industrial hygiene.', 'Choosing low-work-function metals (Cs, Ba) for photocathodes and electron emitters.', 'Born–Haber cycles for the energy of ionic compounds.'],
  sim: { id: 'atom-trends', params: { prop: 'ie' } }
},

{
  id: 'electronegativity', parent: 'periodicity', title: 'Electronegativity', level: 2,
  short: 'Electronegativity measures how strongly an atom in a bond pulls the shared electrons towards itself. The difference between two atoms tells you whether their bond is non-polar, polar or ionic.',
  keywords: ['electronegativity', 'Pauling scale', 'Mulliken', 'Allred–Rochow', 'bond polarity', 'ionic character', 'polar covalent', 'fluorine', 'caesium', 'δ+ δ−', 'dipole'],
  prereq: ['ionization-energy', 'effective-nuclear-charge', 'valence-electrons'],
  related: ['covalent-bonds', 'bond-polarity', 'ionic-bonding', 'molecular-polarity', 'oxidation-numbers', 'hydrogen-bonding', 'bond-enthalpies'],
  body: `
In a bond between two identical atoms, such as $\\ce{H2}$ or $\\ce{Cl2}$, the shared electrons sit exactly in the middle. Between different atoms they are shared unequally: in hydrogen chloride the pair spends more of its time near chlorine, giving chlorine a small negative charge, $\\delta^-$, and leaving hydrogen $\\delta^+$. **Electronegativity**, $\\chi$, is a number for that pulling power of an atom *in a bond*.

### The Pauling scale
Linus Pauling (1932) noticed that bonds between unlike atoms are stronger than the average of the corresponding like–like bonds, and put the extra down to the attraction between the partial charges. He defined the difference in electronegativity from bond energies:
$$|\\chi_A - \\chi_B| = \\sqrt{\\frac{D_{AB} - \\tfrac12(D_{AA} + D_{BB})}{96.49\\ \\mathrm{kJ/mol}}}$$
For HCl: $D(\\ce{H-Cl}) = 431$, $D(\\ce{H-H}) = 436$ and $D(\\ce{Cl-Cl}) = 242$ kJ/mol give an excess of 92 kJ/mol and a difference of 0.98 — close to the tabulated $3.16 - 2.20 = 0.96$. Fixing fluorine at 3.98 anchors the scale. It is dimensionless, runs from 0.79 (caesium) to 3.98 (fluorine), and is the scale in the [periodic table](#/tools/periodic).

Other definitions agree well. Robert Mulliken took the average of the [[ionization-energy|ionisation energy]] and electron affinity, $\\chi_M = \\tfrac12(IE + EA)$ — an atom that holds its own electrons tightly and welcomes an extra one pulls hard on shared ones. Allred and Rochow used the electrostatic force $Z_\\text{eff}\\,e^2/r^2$ at the edge of the atom.

### Trends
Electronegativity follows the [[effective-nuclear-charge|effective nuclear charge]] and size: it rises across a period and falls down a group. The top four are fluorine 3.98, oxygen 3.44, chlorine 3.16 and nitrogen 3.04 — the elements behind hydrogen bonding (F, O, N) and among the strongest oxidants. Carbon (2.55) and hydrogen (2.20) are close, which is why C–H bonds are nearly non-polar and hydrocarbons do not mix with water. Noble gases have no ordinary values (they rarely bond), though xenon and krypton, which do, have been assigned about 2.6 and 3.0.

### From covalent to ionic
The difference $\\Delta\\chi$ places a bond on a continuous scale:

| $\\Delta\\chi$ | bond | examples |
|---|---|---|
| below about 0.4 | non-polar covalent | C–H, $\\ce{Cl2}$ |
| about 0.4–1.8 | polar covalent | O–H 1.24, C–O 0.89, H–Cl 0.96 |
| above about 1.8–2 | mostly ionic | NaCl 2.23, CsF 3.19 |

Pauling estimated the **ionic character** as $1 - e^{-\\Delta\\chi^2/4}$: 21 % for HCl, 71 % for NaCl. No bond is 100 % ionic, and the borders are soft — but the numbers predict [[bond-polarity]], which end of a molecule is attacked by what reagent, [[oxidation-numbers]] (the more electronegative atom takes the electrons), and whether a compound will conduct when molten.

> [!tip] Electronegativity is about atoms *in bonds*. Electron affinity is about isolated atoms gaining a whole electron. They correlate, but chlorine has the higher electron affinity while fluorine is the more electronegative.
`,
  ideas: [
    'Electronegativity is an atom\'s pull on the shared electrons of a bond; it is dimensionless.',
    'On the Pauling scale fluorine is 3.98 and caesium 0.79.',
    'It rises across a period and falls down a group, following Z_eff and size.',
    'Δχ sorts bonds into non-polar, polar covalent and ionic; the change is gradual.',
    'The more electronegative atom carries δ− and takes the electrons when oxidation numbers are assigned.'
  ],
  pitfalls: [
    'Electronegativity and electron affinity are the same thing — Electron affinity is a measured energy for a free atom gaining an electron; electronegativity describes an atom within a bond. Chlorine wins on electron affinity, fluorine on electronegativity.',
    'A bond is either ionic or covalent — Bond character varies continuously with Δχ. Even NaCl has some covalent character, and H–Cl is about one-fifth ionic.',
    'A molecule with polar bonds must be polar — The bond dipoles may cancel by symmetry: CO₂ and CCl₄ have polar bonds but no overall dipole ([[molecular-polarity]]).'
  ],
  formulas: [
    {
      name: 'Pauling\'s electronegativity difference from bond energies',
      expr: 'dchi = sqrt((DAB - (DAA + DBB)/2)/Eu)', tex: '\\Delta\\chi = \\sqrt{\\frac{D_{AB} - \\tfrac12(D_{AA} + D_{BB})}{E_u}}',
      vars: {
        dchi: { name: 'electronegativity difference', tex: '\\Delta\\chi' },
        DAB: { name: 'A–B bond energy', q: 'molarenergy', unit: 'kJ/mol', value: 431, tex: 'D_{AB}' },
        DAA: { name: 'A–A bond energy', q: 'molarenergy', unit: 'kJ/mol', value: 436, tex: 'D_{AA}' },
        DBB: { name: 'B–B bond energy', q: 'molarenergy', unit: 'kJ/mol', value: 242, tex: 'D_{BB}' },
        Eu: { name: 'one electronvolt per bond, per mole', q: 'molarenergy', unit: 'kJ/mol', value: 96.485, fixed: true, tex: 'E_u' }
      },
      note: 'Pauling\'s original form with the arithmetic mean. Defaults: H–Cl, H–H and Cl–Cl, giving 0.98 (tabulated 0.96).',
      practice: { unknowns: ['dchi', 'DAB'] },
      stories: {
        dchi: 'The H–Br bond energy is {DAB}, H–H is {DAA} and Br–Br is {DBB}. Estimate the electronegativity difference between hydrogen and bromine.',
        DAB: 'Two elements differ in electronegativity by {dchi}. Their homonuclear bond energies are {DAA} and {DBB}. Estimate the energy of the bond between them.'
      }
    },
    {
      name: 'Pauling\'s estimate of ionic character',
      expr: 'I = 1 - exp(-dchi^2/4)', tex: 'I = 1 - e^{-\\Delta\\chi^2/4}',
      vars: {
        I: { name: 'fraction of ionic character', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'I' },
        dchi: { name: 'electronegativity difference', value: 2.23, tex: '\\Delta\\chi' }
      },
      note: 'An empirical rule of thumb; dipole-moment measurements give somewhat different numbers. Default: NaCl, $3.16 - 0.93$.',
      stories: {
        I: 'Two bonded atoms differ in electronegativity by {dchi}. Estimate the ionic character of the bond.',
        dchi: 'A bond is estimated to be {I} ionic. What electronegativity difference does that correspond to?'
      }
    },
    {
      name: 'Mulliken electronegativity',
      expr: 'chiM = (IE + EA)/2', tex: '\\chi_M = \\frac{\\mathrm{IE} + \\mathrm{EA}}{2}',
      vars: {
        chiM: { name: 'Mulliken electronegativity', q: 'energy', unit: 'eV', tex: '\\chi_M' },
        IE: { name: 'first ionisation energy', q: 'energy', unit: 'eV', value: 17.42, tex: '\\mathrm{IE}' },
        EA: { name: 'electron affinity', q: 'energy', unit: 'eV', value: 3.40, tex: '\\mathrm{EA}' }
      },
      note: 'In eV. A rough conversion to the Pauling scale is $\\chi_P \\approx 0.374\\,\\chi_M/\\mathrm{eV} + 0.17$. Default: fluorine, giving 10.41 eV and $\\chi_P \\approx 4.06$.',
      stories: {
        chiM: 'Chlorine has an ionisation energy of {IE} and an electron affinity of {EA}. What is its Mulliken electronegativity?',
        EA: 'An element has an ionisation energy of {IE} and a Mulliken electronegativity of {chiM}. What is its electron affinity?'
      }
    }
  ],
  examples: [
    {
      title: 'How ionic is the bond?',
      q: 'Using Pauling electronegativities (H 2.20, O 3.44, Na 0.93, Cl 3.16), classify the O–H bond in water and the bond in sodium chloride, and estimate their ionic character.',
      steps: [
        'O–H: $\\Delta\\chi = 3.44 - 2.20 = 1.24$, polar covalent. $I = 1 - e^{-1.24^2/4} = 1 - e^{-0.384} = 0.32$: about 32 % ionic, oxygen $\\delta^-$.',
        'Na–Cl: $\\Delta\\chi = 3.16 - 0.93 = 2.23$, ionic. $I = 1 - e^{-1.243} = 0.71$: about 71 %.'
      ],
      a: 'O–H: polar covalent, about 32 % ionic; NaCl: ionic, about 71 %.'
    },
    {
      title: 'Electronegativity from bond energies',
      q: 'Bond energies: H–Br 366, H–H 436 and Br–Br 193 kJ/mol. Estimate $\\chi(\\ce{Br})$ given $\\chi(\\ce{H}) = 2.20$.',
      steps: [
        'Mean of the like bonds: $(436 + 193)/2 = 314.5$ kJ/mol. Excess: $366 - 314.5 = 51.5$ kJ/mol.',
        '$\\Delta\\chi = \\sqrt{51.5/96.49} = 0.73$.',
        'Bromine is the more electronegative (it is a halogen), so $\\chi(\\ce{Br}) \\approx 2.20 + 0.73 = 2.93$. The tabulated value is 2.96.'
      ],
      a: 'About 2.9.'
    }
  ],
  quiz: [
    { q: 'Which bond is the most polar?', choices: ['C–H', 'N–H', 'O–H', 'F–H'], a: 3,
      why: 'Fluorine is the most electronegative element: Δχ = 3.98 − 2.20 = 1.78, against 1.24 for O–H, 0.84 for N–H and 0.35 for C–H.' },
    { q: 'In a C–Cl bond, which atom carries the partial negative charge?', choices: ['carbon', 'chlorine', 'neither: the bond is non-polar', 'it alternates'], a: 1,
      why: 'Chlorine (3.16) is more electronegative than carbon (2.55), so it pulls the shared pair towards itself and becomes δ−. That is why the carbon of chloromethane is attacked by nucleophiles.' },
    { q: 'Estimate the ionic character, in per cent, of a bond with Δχ = 1.0, using Pauling\'s formula.', answer: 22.1, unit: '%',
      why: '$1 - e^{-1/4} = 1 - 0.779 = 0.221$, about 22 %.' },
    { q: 'Electronegativity increases down group 17 because the atoms have more protons.', a: false,
      why: 'It decreases: F 3.98, Cl 3.16, Br 2.96, I 2.66. The extra protons are shielded by extra shells, and the bonding electrons sit farther from the nucleus.' },
    { q: 'Which pair of elements is most likely to form an ionic compound?', choices: ['C and O', 'N and H', 'K and F', 'S and Cl'], a: 2,
      why: 'Potassium (0.82) and fluorine (3.98) differ by 3.16 — far into the ionic range. The other pairs are close in electronegativity and bond covalently.' }
  ],
  applications: ['Predicting bond polarity, dipole moments and which sites in a molecule react.', 'Assigning oxidation numbers in redox chemistry.', 'Choosing solvents: polar bonds make polar solvents like water and acetone.', 'Designing battery materials, where electronegativity differences set voltages.'],
  history: 'Berzelius ranked elements by "electronegativity" in the 1810s. Pauling made it quantitative from bond energies in 1932, Mulliken proposed his definition in 1934, and Allred and Rochow theirs in 1958.',
  sim: { id: 'atom-trends', params: { prop: 'en' } }
}

);
