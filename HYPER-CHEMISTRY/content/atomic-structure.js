/* HYPER-CHEMISTRY · content/atomic-structure.js — what matter is made of: atoms,
 * elements and compounds; the particles inside the atom; isotopes and relative
 * atomic mass. */
Hyper.add(

{
  id: 'atomic-theory', parent: 'atomic-structure', title: 'Atoms, elements and compounds', level: 1,
  short: 'All matter is built from atoms. An element contains one kind of atom; a compound contains two or more kinds joined in a fixed ratio; a mixture is just things mingled together.',
  keywords: ['atom', 'element', 'compound', 'mixture', 'Dalton', 'atomic theory', 'law of conservation of mass', 'law of definite proportions', 'law of multiple proportions', 'pure substance', 'size of an atom'],
  prereq: ['physics:density', 'math:scientific-notation'],
  related: ['subatomic-particles', 'mole-concept', 'chemical-equations', 'percent-composition', 'empirical-formula'],
  body: `
Cut a one-centimetre cube of copper in half, then one of the halves in half again, and keep going. After about 76 halvings you are down to a single **atom** of copper, and there the cutting stops: what is left is no longer a smaller piece of copper that chemistry could divide further. The atom is the smallest amount of an element that still behaves as that element in chemical reactions — and every chemical change, from rusting to digestion, is atoms letting go of partners and taking new ones.

### Elements, compounds and mixtures
- An **element** is a substance made of only one kind of atom: copper, oxygen, carbon. 118 are known; about 90 occur in nature. Some elements are single atoms (helium, neon), some are molecules ($\\ce{O2}$, $\\ce{N2}$, $\\ce{S8}$), some are huge networks (diamond, a copper crystal).
- A **compound** contains atoms of two or more elements **chemically bonded in a fixed ratio**, written as a formula: water is always $\\ce{H2O}$, table salt always $\\ce{NaCl}$. A compound has properties of its own — sodium is a metal that burns in water and chlorine a poisonous gas, yet sodium chloride goes on your chips.
- A **mixture** is two or more substances mingled without bonding, in any proportion: air, sea water, steel, concrete. Its parts keep their own properties and can be separated by physical means — filtering, distilling, a magnet, a centrifuge.

Elements and compounds are **pure substances**: they have a sharp melting point and a fixed composition. Purity is what a chemist checks first, often by that melting point.

### Dalton's atomic theory
Around 1805 John Dalton explained three laws that careful weighing had revealed:

1. **Conservation of mass** (Lavoisier, 1789): in a reaction the total mass does not change — atoms are only rearranged, never created or destroyed.
2. **Definite proportions** (Proust, 1799): a compound always has the same composition by mass. Pure water is 11.19 % hydrogen by mass whether it comes from a glacier or a car exhaust ([[percent-composition]]).
3. **Multiple proportions** (Dalton): when two elements form more than one compound, the masses of one that combine with a fixed mass of the other are in **small whole-number ratios**. In carbon monoxide 1 g of carbon holds 1.332 g of oxygen, in carbon dioxide 2.664 g — exactly twice as much, because $\\ce{CO2}$ has two oxygen atoms per carbon where $\\ce{CO}$ has one.

Whole-number ratios are the fingerprint of countable particles. Two of Dalton's claims have since been revised: atoms *can* be split (into [[subatomic-particles|protons, neutrons and electrons]]), and atoms of one element are *not* all identical in mass ([[isotopes]]). The core idea survived: chemistry is the rearrangement of atoms.

### How small is an atom?
Too small to count, which is why chemists count them by weighing, in [[mole-concept|moles]]. One mole of copper, 63.5 g, contains $6.022\\times10^{23}$ atoms and takes up 7.1 cm³ in the solid; divide that volume among the atoms and each gets a cube about 0.23 nm on a side. Atoms are 0.1–0.5 nm across: ten million of them in a row would span only one to five millimetres, and a grain of salt holds about $10^{18}$ of them.

> [!fact] Atoms can now be seen one by one. A scanning tunnelling microscope drags a needle ending in a single atom over a surface and maps the current; in 1989 IBM researchers spelled their company's name with 35 xenon atoms on nickel.
`,
  ideas: [
    'An atom is the smallest particle of an element that takes part in chemical reactions.',
    'Elements contain one kind of atom; compounds contain several kinds bonded in a fixed ratio; mixtures have variable composition and no new bonds.',
    'Mass is conserved in reactions because atoms are only rearranged.',
    'Fixed and whole-number mass ratios in compounds are the evidence that matter is made of countable particles.',
    'Atoms are about 0.1–0.5 nm across, so chemists count them by weighing.'
  ],
  pitfalls: [
    'A compound is a mixture of its elements — A mixture keeps the properties of its parts and can have any composition. In a compound the atoms are bonded, the ratio is fixed, and the properties are new: salt is neither a soft metal nor a green gas.',
    'Burning magnesium gains mass, so mass is not conserved — The ribbon combines with oxygen from the air. Weigh the oxygen too (burn it in a closed vessel) and the total is unchanged.',
    'Molecules of an element must contain one atom — Many elements exist as molecules of several identical atoms: O₂, N₂, Cl₂, P₄, S₈. They are still elements, because only one kind of atom is present.'
  ],
  formulas: [
    {
      name: 'Mass of one atom',
      expr: 'm = M/NA', tex: 'm = \\frac{M}{N_A}',
      vars: {
        m: { name: 'mass of one atom (or molecule)', q: 'mass', unit: 'g', tex: 'm' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 12.011, tex: 'M' },
        NA: { const: 'NA' }
      },
      note: 'A mole of atoms has a mass of $M$ grams, and a mole is $N_A$ atoms. The default is carbon; for a molecule use the molar mass of the molecule.',
      practice: { unknowns: ['m', 'M'] },
      stories: {
        m: 'What is the average mass of one atom of carbon, whose molar mass is {M}?',
        M: 'A mass spectrometer finds that one atom of an element has a mass of {m}. What is the element\'s molar mass?'
      }
    },
    {
      name: 'Space taken by one atom in a solid',
      expr: 'd = cbrt(M/(rho*NA))', tex: 'd = \\sqrt[3]{\\frac{M}{\\rho N_A}}',
      vars: {
        d: { name: 'edge of the cube each atom occupies', q: 'length', unit: 'nm', tex: 'd' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 63.546, tex: 'M' },
        rho: { name: 'density of the solid', q: 'density', unit: 'g/cm³', value: 8.96, tex: '\\rho' },
        NA: { const: 'NA' }
      },
      note: 'The volume of a mole, $M/\\rho$, shared among $N_A$ atoms. Spheres leave gaps when they pack, so this estimates the atomic diameter to within about 15 %. Defaults: copper.',
      practice: { unknowns: ['d', 'rho'] },
      stories: {
        d: 'Copper has a molar mass of {M} and a density of {rho}. Estimate the size of a copper atom.',
        rho: 'The atoms of an element with molar mass {M} are about {d} apart in the solid. Estimate the density of the element.'
      }
    }
  ],
  examples: [
    {
      title: 'Two oxides of carbon',
      q: 'Carbon monoxide is 42.88 % carbon by mass and carbon dioxide 27.29 %. Show that the data obey the law of multiple proportions.',
      steps: [
        'Take 100 g of each. Carbon monoxide: 42.88 g C with 57.12 g O, so $57.12/42.88 = 1.332$ g of oxygen per gram of carbon.',
        'Carbon dioxide: 27.29 g C with 72.71 g O, so $72.71/27.29 = 2.664$ g of oxygen per gram of carbon.',
        'The ratio of the two oxygen masses is $2.664/1.332 = 2.000$ — a small whole number, as the law requires.',
        'The atomic picture explains it: one oxygen atom per carbon atom in $\\ce{CO}$, two in $\\ce{CO2}$.'
      ],
      a: 'The oxygen masses per gram of carbon are in the ratio 2 : 1.'
    },
    {
      title: 'Atoms in a wedding ring',
      q: 'A plain gold ring has a mass of 5.00 g. How many gold atoms does it contain, and what is the mass of one of them? (Gold: 196.97 g/mol.)',
      steps: [
        'Amount of gold: $n = 5.00/196.97 = 0.02538$ mol.',
        'Atoms: $N = n N_A = 0.02538 \\times 6.022\\times10^{23} = 1.53\\times10^{22}$.',
        'Mass of one atom: $m = M/N_A = 196.97/6.022\\times10^{23} = 3.27\\times10^{-22}$ g.'
      ],
      a: 'About 1.5 × 10²² atoms, each of mass 3.27 × 10⁻²² g.'
    }
  ],
  quiz: [
    { q: 'Which of these is a compound?', choices: ['air', 'bronze', 'distilled water', 'ozone, $\\ce{O3}$'], a: 2,
      why: 'Water is two elements bonded in a fixed ratio. Air and bronze are mixtures of variable composition; ozone contains only oxygen atoms, so it is an element (a form of oxygen).' },
    { q: 'Magnesium ribbon is burnt in an open crucible. The white ash weighs more than the ribbon did. Why?', choices: ['mass is not conserved in hot reactions', 'the ash has absorbed heat, which has mass', 'oxygen atoms from the air are now bonded to the magnesium', 'magnesium atoms have grown larger'], a: 2,
      why: 'Magnesium oxide contains the original magnesium atoms plus oxygen atoms taken from the air. Counting the oxygen, mass is conserved; the heat given out has no measurable mass on a chemical balance.' },
    { q: 'Iron and sulfur powders are stirred together. Which observation shows that no compound has formed yet?', choices: ['the mixture is grey-yellow', 'a magnet pulls the iron out', 'the mixture has a mass equal to the sum of the parts', 'it contains two elements'], a: 1,
      why: 'In a mixture each part keeps its own properties, so the iron is still magnetic and can be separated physically. Once heated into iron sulfide, the iron is bonded and a magnet no longer picks it out.' },
    { q: 'What is the mass of one atom of carbon-12, in grams?', answer: 1.9926e-23, unit: 'g',
      why: 'One mole of carbon-12 has a mass of exactly 12 g, so one atom has $12/6.022\\times10^{23} = 1.993\\times10^{-23}$ g.' },
    { q: 'Dalton\'s theory said that all atoms of an element are identical. That part turned out to be wrong.', a: true,
      why: 'Atoms of one element all have the same number of protons, but they may have different numbers of neutrons and so different masses: they are isotopes. Chemically they behave almost identically, which is why Dalton could not tell.' }
  ],
  problems: [
    { q: 'Aluminium has a molar mass of 26.98 g/mol and a density of 2.70 g/cm³. Estimate the size of an aluminium atom, in nanometres.', answer: 0.255, unit: 'nm', tol: 0.03,
      steps: ['Volume per mole: $26.98/2.70 = 9.99$ cm³.', 'Volume per atom: $9.99/6.022\\times10^{23} = 1.66\\times10^{-23}$ cm³.', 'Cube root: $d = 2.55\\times10^{-8}$ cm = 0.255 nm.'] }
  ],
  applications: ['Checking purity by melting point and composition in quality control.', 'Separating mixtures: distillation of crude oil and of liquid air, filtration, chromatography.', 'Imaging and moving single atoms with scanning tunnelling and atomic force microscopes.', 'Mass balances in chemical engineering, which rest on the conservation of mass.'],
  history: 'Democritus proposed indivisible atoms around 400 BC, but without experiments. Lavoisier established conservation of mass in the 1780s, Proust definite proportions in 1799, and Dalton published his atomic theory with the first table of relative atomic weights in 1808.'
},

{
  id: 'subatomic-particles', parent: 'atomic-structure', title: 'Protons, neutrons and electrons', level: 1,
  short: 'An atom is a tiny, dense nucleus of protons and neutrons with electrons around it. The number of protons fixes the element; the electrons decide how it reacts.',
  keywords: ['proton', 'neutron', 'electron', 'nucleus', 'atomic number', 'mass number', 'nucleon', 'ion', 'cation', 'anion', 'Rutherford', 'gold foil', 'isoelectronic', 'Z', 'A'],
  prereq: ['atomic-theory', 'physics:electric-charge'],
  related: ['isotopes', 'electron-configuration', 'physics:nuclear-structure', 'physics:nuclear-size', 'physics:bohr-model', 'nuclear-stability'],
  body: `
An atom has two parts of very different size. At the centre is the **nucleus**, a few femtometres across ($10^{-15}$ m) yet holding more than 99.9 % of the mass. Around it, out to about $10^{-10}$ m, move the **electrons**. If the nucleus were a pea on the centre spot of a football stadium, the electrons would be roaming the stands — the atom is almost entirely empty space.

| particle | charge | mass (u) | mass (kg) | where |
|---|---|---|---|---|
| proton, p | +1 | 1.00728 | $1.673\\times10^{-27}$ | nucleus |
| neutron, n | 0 | 1.00866 | $1.675\\times10^{-27}$ | nucleus |
| electron, e⁻ | −1 | 0.000549 | $9.109\\times10^{-31}$ | around the nucleus |

The charges are multiples of $e = 1.602\\times10^{-19}$ C. A proton is 1836 times heavier than an electron, so for most purposes an atom's mass is simply the number of protons and neutrons (the **nucleons**) in atomic mass units.

### Counting the particles
- The **atomic number** $Z$ is the number of protons. It *defines* the element: every atom with 6 protons is carbon, every atom with 26 is iron. The [periodic table](#/tools/periodic) is ordered by $Z$.
- The **mass number** $A$ is the number of protons plus neutrons. The neutron number is $N = A - Z$.
- A neutral atom has as many electrons as protons. An **ion** has gained or lost electrons: its charge is $Z - n_e$. Losing electrons gives a positive **cation** ($\\ce{Na+}$, $\\ce{Fe^3+}$), gaining them a negative **anion** ($\\ce{Cl-}$, $\\ce{O^2-}$).

A nuclide is written with the mass number at the top left of the symbol and the atomic number at the bottom left: $\\ce{^{56}_{26}Fe}$. Since the symbol already gives $Z$, $\\ce{^{56}Fe}$ or "iron-56" says the same. A charge goes top right: $\\ce{^{56}Fe^3+}$ has 26 protons, 30 neutrons and 23 electrons.

### Why chemists care mostly about electrons
Chemical reactions never touch the nucleus; they only move electrons between atoms or share them. So the nucleus decides *which* element you have, while the electrons — in particular the outermost ones ([[valence-electrons]]) — decide *how it behaves*. Species with the same number of electrons are **isoelectronic**: $\\ce{O^2-}$, $\\ce{F-}$, $\\ce{Ne}$, $\\ce{Na+}$ and $\\ce{Mg^2+}$ all have 10, arranged the same way, yet their sizes differ because their nuclei pull with 8 to 12 protons ([[atomic-radius]]).

### How we know
J. J. Thomson measured the charge-to-mass ratio of cathode rays in 1897: the electron, far lighter than any atom. In 1909 Geiger and Marsden, working for Rutherford, fired alpha particles at gold foil. Most went straight through, but about one in eight thousand bounced back — "as if you fired a 15-inch shell at tissue paper and it came back", in Rutherford's words. Only a tiny, massive, positive core could do that: the nucleus (1911). The neutron, needed to explain why nuclei weigh about twice what their protons account for, was found by Chadwick in 1932.

> [!tip] The nucleus is about $1.2\\,A^{1/3}$ femtometres in radius, so its density is the same for every nucleus: about $2\\times10^{17}$ kg/m³. A teaspoon of nuclear matter would weigh as much as a mountain; see [[physics:nuclear-size|the size of the nucleus]].
`,
  ideas: [
    'Protons (+1) and neutrons (0) form the tiny nucleus that carries almost all the mass; electrons (−1) occupy the space around it.',
    'The atomic number Z (protons) defines the element; the mass number A counts protons plus neutrons.',
    'A neutral atom has Z electrons; an ion\'s charge is the number of protons minus the number of electrons.',
    'Chemistry happens in the electrons; the nucleus is untouched by chemical reactions.',
    'The atom is mostly empty: the nucleus is about 10⁵ times smaller across than the atom.'
  ],
  pitfalls: [
    'A positive ion has gained protons — Ions form by gaining or losing electrons only. Na⁺ has lost one electron; it still has 11 protons, so it is still sodium.',
    'The mass number is the atomic mass — A is a count of nucleons, always a whole number. The atomic mass in u is close to A but not equal (²³⁵U is 235.044 u), and the element\'s relative atomic mass averages over its isotopes.',
    'Electrons orbit the nucleus like planets — Electrons have no definite paths; quantum mechanics gives only the probability of finding them in regions called orbitals ([[orbital-shapes]]).'
  ],
  formulas: [
    {
      name: 'Neutron number',
      expr: 'N = A - Z', tex: 'N = A - Z',
      vars: {
        N: { name: 'number of neutrons', int: true, tex: 'N' },
        A: { name: 'mass number (protons + neutrons)', int: true, value: 238, tex: 'A' },
        Z: { name: 'atomic number (protons)', int: true, value: 92, tex: 'Z' }
      },
      stories: {
        N: 'How many neutrons are there in a nucleus with mass number {A} and atomic number {Z}?',
        A: 'A nucleus has {Z} protons and {N} neutrons. What is its mass number?',
        Z: 'A nuclide has mass number {A} and contains {N} neutrons. What is its atomic number?'
      }
    },
    {
      name: 'Charge of an ion',
      expr: 'z = Z - ne', tex: 'z = Z - n_e',
      vars: {
        z: { name: 'charge number of the ion', int: true, signed: true, tex: 'z' },
        Z: { name: 'number of protons', int: true, value: 26, tex: 'Z' },
        ne: { name: 'number of electrons', int: true, value: 23, tex: 'n_e' }
      },
      note: 'Positive $z$: a cation, with electrons lost. Negative: an anion, with electrons gained. Zero: a neutral atom.',
      stories: {
        z: 'A particle has {Z} protons and {ne} electrons. What is its charge?',
        ne: 'An ion with {Z} protons carries a charge of {z}. How many electrons does it have?'
      }
    },
    {
      name: 'Radius of a nucleus',
      expr: 'r = r0*A^(1/3)', tex: 'r = r_0 A^{1/3}',
      vars: {
        r: { name: 'nuclear radius', q: 'length', unit: 'fm', tex: 'r' },
        r0: { name: 'radius constant', q: 'length', unit: 'fm', value: 1.2, fixed: true, tex: 'r_0' },
        A: { name: 'mass number', int: true, value: 197, tex: 'A' }
      },
      note: 'Nucleons pack like marbles in a bag, so the volume grows in proportion to $A$ and the radius as its cube root. Default: gold-197.',
      practice: { unknowns: ['r', 'A'] },
      stories: {
        r: 'Estimate the radius of a gold nucleus, mass number {A}.',
        A: 'A nucleus has a radius of about {r}. Roughly what is its mass number?'
      }
    }
  ],
  examples: [
    {
      title: 'Counting particles in ions',
      q: 'How many protons, neutrons and electrons are there in (a) $\\ce{^{56}Fe^3+}$, (b) $\\ce{^{32}S^2-}$, (c) $\\ce{^{27}Al^3+}$?',
      steps: [
        '(a) Iron has $Z = 26$: 26 protons, $56 - 26 = 30$ neutrons, and $26 - 3 = 23$ electrons (three lost).',
        '(b) Sulfur has $Z = 16$: 16 protons, $32 - 16 = 16$ neutrons, and $16 + 2 = 18$ electrons (two gained).',
        '(c) Aluminium has $Z = 13$: 13 protons, 14 neutrons, $13 - 3 = 10$ electrons — isoelectronic with neon.'
      ],
      a: 'Fe³⁺: 26 p, 30 n, 23 e; S²⁻: 16 p, 16 n, 18 e; Al³⁺: 13 p, 14 n, 10 e.'
    },
    {
      title: 'How empty is an atom?',
      q: 'A gold atom has a radius of about 144 pm. Compare it with the radius of its nucleus, and find what fraction of the atom\'s volume the nucleus fills.',
      steps: [
        { text: 'Nuclear radius for $A = 197$:', tex: 'r = 1.2\\ \\mathrm{fm} \\times 197^{1/3} = 1.2 \\times 5.82 = 6.98\\ \\mathrm{fm}' },
        'Ratio of radii: $144\\times10^{-12}/6.98\\times10^{-15} \\approx 2.1\\times10^{4}$.',
        'Volumes go as the cube: $(6.98\\times10^{-15}/1.44\\times10^{-10})^3 \\approx 1.1\\times10^{-13}$.'
      ],
      a: 'The atom is about 20 000 times wider than its nucleus, which fills about one part in 10¹³ of its volume.'
    }
  ],
  quiz: [
    { q: 'Which number tells you which element an atom belongs to?', choices: ['the mass number', 'the number of neutrons', 'the number of protons', 'the number of electrons'], a: 2,
      why: 'The number of protons (atomic number) defines the element. Neutrons can vary (isotopes) and electrons can be gained or lost (ions) without changing the element.' },
    { q: 'How many electrons does the ion $\\ce{^{40}_{20}Ca^2+}$ have?', choices: ['18', '20', '22', '40'], a: 0,
      why: 'Calcium has 20 protons; a 2+ charge means two electrons fewer than protons: 18. The 40 is the mass number, which counts nucleons.' },
    { q: 'How many neutrons are in a nucleus of uranium-238 ($Z = 92$)?', answer: 146,
      why: '$N = A - Z = 238 - 92 = 146$.' },
    { q: 'In Rutherford\'s gold-foil experiment, why did most alpha particles pass straight through?', choices: ['gold atoms are far apart in the foil', 'the atom is mostly empty space, with its mass in a tiny nucleus', 'alpha particles are too fast to be deflected', 'the electrons attract them forward'], a: 1,
      why: 'Gold atoms touch one another in the metal, but each is mostly empty. Only an alpha particle that happened to head almost straight for a nucleus — about one in several thousand — was thrown back.' },
    { q: 'Which list is isoelectronic (the same number of electrons)?', choices: ['$\\ce{Na}$, $\\ce{Mg}$, $\\ce{Al}$', '$\\ce{O^2-}$, $\\ce{F-}$, $\\ce{Na+}$', '$\\ce{Cl-}$, $\\ce{Br-}$, $\\ce{I-}$', '$\\ce{Na+}$, $\\ce{K+}$, $\\ce{Rb+}$'], a: 1,
      why: 'Oxide (8 + 2), fluoride (9 + 1) and sodium ion (11 − 1) all have 10 electrons, the neon arrangement. The halide ions have the same *charge* but different electron counts.' }
  ],
  applications: ['Mass spectrometry, which sorts ions by mass-to-charge ratio.', 'Electron beams in electron microscopes and cathode-ray tubes; proton beams in cancer therapy.', 'Neutron activation analysis and neutron radiography of turbine blades and castings.', 'Ion chemistry of batteries, electroplating and the salts in your body.'],
  sim: 'atom-build'
},

{
  id: 'isotopes', parent: 'atomic-structure', title: 'Isotopes and relative atomic mass', level: 1,
  short: 'Isotopes are atoms of the same element with different numbers of neutrons. They react almost identically, but differ in mass — so an element\'s atomic mass is an average weighted by how common each isotope is.',
  keywords: ['isotope', 'nuclide', 'relative atomic mass', 'atomic weight', 'abundance', 'unified atomic mass unit', 'dalton', 'carbon-12', 'weighted average', 'deuterium', 'heavy water', 'mass spectrum', 'enrichment'],
  prereq: ['subatomic-particles', 'math:percentages'],
  related: ['mass-spectrometry', 'molar-mass', 'nuclear-stability', 'radioactive-half-life', 'physics:radiocarbon-dating'],
  body: `
Chlorine atoms all have 17 protons, but three quarters of them have 18 neutrons and one quarter have 20. These are two **isotopes** of chlorine, chlorine-35 and chlorine-37 ($\\ce{^{35}Cl}$ and $\\ce{^{37}Cl}$). "Isotope" means "same place": they sit in the same box of the periodic table.

Because chemistry is done by electrons, and isotopes have the same number of electrons, they react in the same way. Sodium chloride made with $\\ce{^{37}Cl}$ looks, tastes and dissolves like any other. What differs is mass, and anything that depends on mass: density, the speed of diffusion, the vibration frequency of bonds, and — for unstable isotopes — radioactivity.

### The atomic mass unit
Atomic masses are measured on a scale on which one atom of carbon-12 has a mass of exactly 12 u. The **unified atomic mass unit** (also called the dalton, Da) is therefore
$$1\\ \\mathrm{u} = \\frac{m(\\ce{^{12}C})}{12} = 1.66054\\times10^{-27}\\ \\mathrm{kg}$$
On this scale a proton is 1.00728 u and a neutron 1.00866 u, so the mass of an isotope in u is close to its mass number, but not equal to it: $\\ce{^{35}Cl}$ is 34.969 u. The small shortfall is the binding energy of the nucleus ([[nuclear-stability]]).

### Relative atomic mass: a weighted average
A sample of chlorine from anywhere on Earth contains 75.76 % $\\ce{^{35}Cl}$ and 24.24 % $\\ce{^{37}Cl}$ by number of atoms. The **relative atomic mass** $A_r$ (the "atomic weight" in the [periodic table](#/tools/periodic)) is the average mass of an atom in that mixture, on the carbon-12 scale:

$$A_r = \\sum_i f_i\\, m_i = 0.7576 \\times 34.969 + 0.2424 \\times 36.966 = 35.45$$

That is why chlorine's atomic weight is not a whole number, and why no single chlorine atom weighs 35.45 u. The same average, in grams, is the element's [[molar-mass]].

> [!tip] The average always lies between the lightest and heaviest isotope, closer to the more abundant one. Copper (63.55) is mostly copper-63; bromine (79.90) is almost exactly half bromine-79 and half bromine-81.

### Measuring isotopes
A [[mass-spectrometry|mass spectrometer]] ionises atoms, accelerates them and separates them by mass-to-charge ratio: each isotope gives its own peak, and the peak heights are the abundances. Chlorine molecules show three peaks, at 70, 72 and 74, in the ratio 9 : 6 : 1 — the chances of picking two light, one of each, or two heavy atoms.

### Where isotopes matter
- **Heavy water**, $\\ce{D2O}$ with deuterium ($\\ce{^{2}H}$), is 11 % denser than ordinary water and slows neutrons in some nuclear reactors. Bonds to deuterium break more slowly, which drug designers use to make medicines last longer in the body.
- **Uranium enrichment** raises the share of fissile uranium-235 from 0.72 % to 3–5 % for power reactors, exploiting only the 0.9 % mass difference between $\\ce{^{235}UF6}$ and $\\ce{^{238}UF6}$ in thousands of gas centrifuges.
- **Tracers and dating**: radioactive isotopes such as carbon-14, iodine-131 and fluorine-18 reveal the age of wood, the activity of a thyroid, or a tumour in a PET scan ([[radioactive-half-life]]). Stable-isotope ratios of oxygen and carbon in ice cores and food reveal past climates and where a product really came from.
`,
  ideas: [
    'Isotopes of an element have the same number of protons and electrons but different numbers of neutrons.',
    'Isotopes have (almost) the same chemistry but different masses, and some are radioactive.',
    'Masses are measured on the carbon-12 scale: 1 u is one twelfth of a carbon-12 atom.',
    'The relative atomic mass is the abundance-weighted average of the isotope masses.',
    'A mass spectrometer measures both the masses and the abundances of isotopes.'
  ],
  pitfalls: [
    'Relative atomic mass is the mass of the most common isotope — It is an average over all the isotopes. For chlorine it is 35.45, a value no individual atom has.',
    'Isotopes are different elements — They have the same atomic number, so they are the same element. Only the number of neutrons, and so the mass, differs.',
    'All isotopes are radioactive — Most elements have stable isotopes; carbon-12 and carbon-13 are stable, carbon-14 is not. Stability depends on the balance of neutrons and protons.'
  ],
  formulas: [
    {
      name: 'Relative atomic mass from two isotopes',
      expr: 'Ar = f1*m1 + (1 - f1)*m2', tex: 'A_r = f_1 m_1 + (1 - f_1)\\, m_2',
      vars: {
        Ar: { name: 'relative atomic mass of the element', tex: 'A_r' },
        f1: { name: 'abundance of isotope 1 (by number of atoms)', q: 'ratio', unit: '%', value: 75.76, min: 0, max: 100, tex: 'f_1' },
        m1: { name: 'relative mass of isotope 1', value: 34.969, tex: 'm_1' },
        m2: { name: 'relative mass of isotope 2', value: 36.966, tex: 'm_2' }
      },
      note: 'The abundances add up to 100 %, so the second is $1 - f_1$. Solving for $f_1$ gives the abundances from a measured atomic mass. Defaults: chlorine-35 and chlorine-37.',
      practice: { unknowns: ['Ar', 'f1'] },
      stories: {
        Ar: 'An element consists of {f1} of an isotope of relative mass {m1}; the rest has relative mass {m2}. What is its relative atomic mass?',
        f1: 'Gallium ($A_r$ = {Ar}) is a mixture of gallium-69 (relative mass {m1}) and gallium-71 ({m2}). What percentage of its atoms are gallium-69?'
      }
    },
    {
      name: 'Relative atomic mass from three isotopes',
      expr: 'Ar = f1*m1 + f2*m2 + (1 - f1 - f2)*m3', tex: 'A_r = f_1 m_1 + f_2 m_2 + (1 - f_1 - f_2)\\, m_3',
      vars: {
        Ar: { name: 'relative atomic mass of the element', tex: 'A_r' },
        f1: { name: 'abundance of isotope 1', q: 'ratio', unit: '%', value: 78.99, min: 0, max: 100, tex: 'f_1' },
        m1: { name: 'relative mass of isotope 1', value: 23.985, tex: 'm_1' },
        f2: { name: 'abundance of isotope 2', q: 'ratio', unit: '%', value: 10.00, min: 0, max: 100, tex: 'f_2' },
        m2: { name: 'relative mass of isotope 2', value: 24.986, tex: 'm_2' },
        m3: { name: 'relative mass of isotope 3', value: 25.983, tex: 'm_3' }
      },
      note: 'Defaults: magnesium-24, -25 and -26, giving 24.305.',
      practice: { unknowns: ['Ar'] },
      stories: {
        Ar: 'Magnesium is {f1} magnesium-24 (relative mass {m1}), {f2} magnesium-25 ({m2}) and the rest magnesium-26 ({m3}). What is its relative atomic mass?'
      }
    }
  ],
  examples: [
    {
      title: 'Copper\'s atomic weight',
      q: 'Natural copper is 69.15 % copper-63 (62.9296 u) and 30.85 % copper-65 (64.9278 u). Calculate its relative atomic mass.',
      steps: [
        { text: 'Weight each isotope by its abundance as a fraction:', tex: 'A_r = 0.6915 \\times 62.9296 + 0.3085 \\times 64.9278' },
        '$= 43.5158 + 20.0302 = 63.546$.',
        'The value lies closer to 63 than to 65 because copper-63 is more than twice as common.'
      ],
      a: '$A_r(\\ce{Cu}) = 63.55$'
    },
    {
      title: 'Abundances from an atomic weight',
      q: 'Boron has $A_r = 10.81$ and two isotopes, boron-10 (10.0129) and boron-11 (11.0093). What fraction of boron atoms are boron-10?',
      steps: [
        'Let $f$ be the fraction of boron-10: $10.81 = 10.0129 f + 11.0093 (1 - f)$.',
        '$10.81 = 11.0093 - 0.9964 f$, so $f = (11.0093 - 10.81)/0.9964 = 0.200$.',
        'About 20 % boron-10 and 80 % boron-11. Boron-10 absorbs neutrons strongly, which is why boron carbide rods and boric acid control nuclear reactors.'
      ],
      a: 'About 20.0 % boron-10.'
    }
  ],
  quiz: [
    { q: 'Carbon-12 and carbon-14 differ in…', choices: ['the number of protons', 'the number of electrons', 'the number of neutrons', 'their chemical reactions'], a: 2,
      why: 'Both are carbon, with 6 protons and (as atoms) 6 electrons. Carbon-14 has 8 neutrons, carbon-12 has 6. Their chemistry is the same, which is why living things take up carbon-14 like any other carbon.' },
    { q: 'Bromine is 50.69 % bromine-79 (78.918 u) and 49.31 % bromine-81 (80.916 u). What is its relative atomic mass?', answer: 79.90,
      why: '$0.5069 \\times 78.918 + 0.4931 \\times 80.916 = 40.004 + 39.900 = 79.90$.' },
    { q: 'The mass spectrum of chlorine gas, $\\ce{Cl2}$, shows peaks at 70, 72 and 74. Why three?', choices: ['chlorine has three isotopes', 'the molecule can contain ³⁵Cl + ³⁵Cl, ³⁵Cl + ³⁷Cl or ³⁷Cl + ³⁷Cl', 'the molecule fragments three ways', 'the ions have charges +1, +2 and +3'], a: 1,
      why: 'With two isotopes there are three possible pairs, of total mass 70, 72 and 74. Their heights, about 9 : 6 : 1, follow from the chances 0.76², 2 × 0.76 × 0.24 and 0.24².' },
    { q: 'Heavy water, $\\ce{D2O}$, reacts with sodium much like ordinary water does.', a: true,
      why: 'Deuterium has the same one electron as ordinary hydrogen, so the chemistry is the same. Reactions are somewhat slower (a kinetic isotope effect), and the physical properties differ: D₂O is 11 % denser and freezes at 3.8 °C.' },
    { q: 'An element has two isotopes of relative mass 6.015 and 7.016, and $A_r = 6.94$. Which is more abundant?', choices: ['the lighter one', 'the heavier one', 'they are equally abundant', 'it cannot be decided'], a: 1,
      why: 'The average, 6.94, is much closer to 7.016, so the heavier isotope dominates. (This is lithium: about 92.4 % lithium-7.)' }
  ],
  applications: ['Isotope-ratio mass spectrometry to trace the origin of food, drugs and explosives.', 'Radioactive tracers and PET scans in medicine.', 'Uranium enrichment for nuclear power.', 'Deuterated drugs and heavy water in reactors and NMR solvents.'],
  history: 'Frederick Soddy coined the word "isotope" in 1913 for the radioactive elements that could not be separated chemically. The same year J. J. Thomson found two isotopes of neon, 20 and 22, and F. W. Aston\'s mass spectrograph soon showed that most elements are mixtures.',
  sim: { id: 'atom-build', params: { p: 17, n: 20, e: 17 } }
}

);
