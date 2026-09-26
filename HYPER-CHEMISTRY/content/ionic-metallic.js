/* HYPER-CHEMISTRY · content/ionic-metallic.js — ionic and metallic bonding:
 * ions held by their charges, the energy of a crystal lattice, and the electron sea of metals. */
Hyper.add(

{
  id: 'ionic-bonding', parent: 'ionic-metallic', title: 'Ionic bonding', level: 1,
  short: 'A metal hands one or more electrons to a non-metal, and the positive and negative ions that result hold each other by electrostatic attraction, packed in a crystal lattice.',
  keywords: ['ionic bond', 'ion', 'cation', 'anion', 'electron transfer', 'salt', 'formula unit', 'lattice', 'rock salt', 'sodium chloride', 'magnesium oxide', 'charge balance'],
  prereq: ['valence-electrons', 'ionization-energy', 'physics:coulombs-law'],
  related: ['lattice-energy', 'electronegativity', 'bond-polarity', 'metallic-bonding', 'covalent-bonds', 'crystal-structures', 'solubility', 'electrolysis', 'physics:electric-potential-energy'],
  body: `
When a metal atom with a loosely held outer electron meets a non-metal atom that is one or two electrons short of a full shell, the electron can move across. Sodium gives up its single 3s electron and becomes $\\ce{Na+}$, with the electron arrangement of neon; chlorine takes it and becomes $\\ce{Cl-}$, with the arrangement of argon. The two ions attract each other by the ordinary [[physics:coulombs-law|Coulomb force]] between opposite charges — that attraction *is* the ionic bond.

It has no preferred direction. An ion attracts every oppositely charged neighbour around it equally, so ions do not pair off into molecules: they pack into a three-dimensional **lattice** in which each $\\ce{Na+}$ is surrounded by six $\\ce{Cl-}$ and each $\\ce{Cl-}$ by six $\\ce{Na+}$.

### Where the energy comes from
It is tempting to say that sodium "wants" to lose an electron to reach an octet. It does not: pulling the electron off costs the [[ionization-energy|ionisation energy]], 496 kJ/mol, and chlorine gives back only 349 kJ/mol when it accepts it (its electron affinity). Turning separate atoms into separate ions is uphill:

$$\\ce{Na(g) + Cl(g) -> Na+(g) + Cl-(g)} \\qquad \\Delta H = 496 - 349 = +147\\ \\mathrm{kJ/mol}$$

This is true of every pair of elements: no metal's ionisation energy is as small as the largest electron affinity. The payoff comes when the ions approach. Two charges $z_+e$ and $z_-e$ at a distance $r$ have the [[physics:electric-potential-energy|potential energy]]

$$E = -\\frac{z_+ z_- e^2}{4\\pi\\varepsilon_0\\, r}$$

For a mole of $\\ce{Na+}$–$\\ce{Cl-}$ pairs at their gas-phase separation of 236 pm that is −589 kJ/mol, four times what the electron transfer cost. In the crystal every ion has many neighbours of opposite charge, and the energy released per mole of $\\ce{NaCl}$ is larger still (the [[lattice-energy]], 786 kJ/mol). The noble-gas configurations are not the driving force; they simply mark the ions whose *next* electron would be very expensive to remove or to add.

### Which elements, which formulas
Ionic bonding dominates when the [[electronegativity]] difference is large — very roughly above 1.7 to 2 — which in practice means a metal from the left of [the periodic table](#/tools/periodic) with a non-metal from the right. The charges follow the groups: $+1$ for group 1, $+2$ for group 2, $+3$ for aluminium; $-1$ for the halogens, $-2$ for oxygen and sulfur, $-3$ for nitrogen. The formula is the smallest whole-number ratio that makes the total charge zero: $\\ce{Al^3+}$ with $\\ce{O^2-}$ gives $\\ce{Al2O3}$, $\\ce{Mg^2+}$ with $\\ce{N^3-}$ gives $\\ce{Mg3N2}$. Polyatomic ions such as $\\ce{SO4^2-}$, $\\ce{NO3-}$ and $\\ce{NH4+}$ sit in the lattice as single charged units.

### Properties that follow
- **High melting points.** Melting means freeing ions from many neighbours at once: $\\ce{NaCl}$ melts at 801 °C, and $\\ce{MgO}$, with doubly charged ions, at about 2830 °C — which is why magnesia bricks line steel furnaces.
- **Brittle.** Shift one layer of ions by half a spacing and like charges face each other; the repulsion splits the crystal cleanly along a plane.
- **Conduct only when the ions can move.** A solid salt is an insulator; molten or dissolved, its ions carry the current, which is how sodium and chlorine are made by [[electrolysis]].
- **Often soluble in water**, whose polar molecules crowd round each ion and stabilise it (see [[solubility]]).

> [!key] An ionic bond is not a link between two particular atoms. It is the net electrostatic attraction in a whole lattice of ions, and the formula $\\ce{NaCl}$ records only their 1 : 1 ratio — a formula unit, not a molecule.
`,
  ideas: [
    'An ionic bond is the electrostatic attraction between ions made by moving electrons from a metal to a non-metal.',
    'Making the ions costs energy — the ionisation energy always exceeds the electron affinity — and the attraction of the ions repays it many times over.',
    'The attraction acts equally in every direction, so ions build lattices rather than molecules; the formula gives only their ratio.',
    'Ion charges follow the groups, and the formula is the smallest ratio with zero total charge.',
    'Strong, non-directional forces explain high melting points, brittleness, and conduction only when molten or dissolved.'
  ],
  pitfalls: [
    'Sodium gives away its electron because it wants a full octet — Losing it costs 496 kJ/mol. The ions form because their attraction, above all in the lattice, releases far more energy than the transfer costs.',
    'Solid sodium chloride is made of NaCl molecules — Each Na⁺ sits among six Cl⁻ and each Cl⁻ among six Na⁺; no ion belongs to one partner. NaCl is a formula unit.',
    'Any bond with a large electronegativity difference is ionic — The cut-off is only a guide. Hydrogen fluoride (difference 1.78) is a covalent molecule, and even NaCl is not 100 % ionic.'
  ],
  formulas: [
    {
      name: 'Coulomb energy of an ion pair',
      expr: 'E = -ke*z1*z2*qe^2*NA/r', tex: 'E = -\\frac{k\\, z_+ z_-\\, e^2 N_A}{r}',
      vars: {
        E: { name: 'Coulomb energy per mole of ion pairs', q: 'molarenergy', unit: 'kJ/mol', signed: true },
        ke: { const: 'ke' },
        z1: { name: 'charge number of the cation', int: true, value: 1, tex: 'z_+' },
        z2: { name: 'charge number of the anion (as a positive number)', int: true, value: 1, tex: 'z_-' },
        qe: { const: 'qe' },
        NA: { const: 'NA' },
        r: { name: 'distance between the ion centres', q: 'length', unit: 'pm', value: 236 }
      },
      solveFor: 'E',
      note: '$k = 1/(4\\pi\\varepsilon_0)$. Point charges without the short-range repulsion, so this is the attraction at a given distance, not the whole bond energy. Defaults: an isolated $\\ce{Na+}$–$\\ce{Cl-}$ pair at its gas-phase bond length.',
      practice: { unknowns: ['E', 'r'] },
      stories: {
        E: 'Two ions with charge numbers {z1} and {z2} (in units of the elementary charge) sit {r} apart. What is their Coulomb energy per mole of such pairs?',
        r: 'At what distance do two ions with charge numbers {z1} and {z2} have a Coulomb energy of {E} per mole of pairs?'
      }
    },
    {
      name: 'An ion pair compared with the neutral atoms',
      expr: 'dE = IE - EA - ke*qe^2*NA/r', tex: '\\Delta E = \\mathrm{IE} - \\mathrm{EA} - \\frac{k e^2 N_A}{r}',
      vars: {
        dE: { name: 'energy of the ion pair relative to the separate neutral atoms', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta E' },
        IE: { name: 'ionisation energy of the metal', q: 'molarenergy', unit: 'kJ/mol', value: 496, tex: '\\mathrm{IE}' },
        EA: { name: 'electron affinity of the non-metal (energy released)', q: 'molarenergy', unit: 'kJ/mol', value: 349, tex: '\\mathrm{EA}' },
        ke: { const: 'ke' },
        qe: { const: 'qe' },
        NA: { const: 'NA' },
        r: { name: 'distance between the ions', q: 'length', unit: 'pm', value: 236 }
      },
      solveFor: 'dE',
      note: 'Singly charged ions, point charges, repulsion ignored. Setting $\\Delta E = 0$ gives the distance at which the electron can jump across — about 945 pm for sodium and chlorine, far larger than the bond itself.',
      practice: { unknowns: ['dE', 'r'] },
      stories: {
        dE: 'A metal atom (ionisation energy {IE}) passes an electron to a non-metal atom (electron affinity {EA}), and the two ions end up {r} apart. How does the energy of the pair compare with the neutral atoms?',
        r: 'For a metal with ionisation energy {IE} and a non-metal with electron affinity {EA}, at what separation is the ion pair {dE} relative to the neutral atoms?'
      }
    }
  ],
  examples: [
    {
      title: 'Is the electron transfer worth it?',
      q: 'Show that turning gaseous sodium and chlorine atoms into ions costs energy. How close must the ions come before the pair is lower in energy than the neutral atoms, and where does it stand at the real bond length of 236 pm?',
      steps: [
        'Cost of the transfer: $\\mathrm{IE}(\\ce{Na}) - \\mathrm{EA}(\\ce{Cl}) = 496 - 349 = +147\\ \\mathrm{kJ/mol}$.',
        'The Coulomb energy per mole is $k e^2 N_A / r$, with $k e^2 N_A = 138.9\\ \\mathrm{kJ\\,nm/mol}$.',
        'Break-even: $138.9/r = 147$ gives $r = 0.945\\ \\mathrm{nm} = 945\\ \\mathrm{pm}$. Closer than that, the ions win.',
        'At 236 pm: $138.9/0.236 = 589\\ \\mathrm{kJ/mol}$, so $\\Delta E = 147 - 589 = -442\\ \\mathrm{kJ/mol}$.',
        'The measured bond energy of gaseous $\\ce{NaCl}$ is 408 kJ/mol: a little less, because when the electron clouds touch they repel, which point charges leave out.'
      ],
      a: 'The transfer costs +147 kJ/mol; the pair wins inside about 945 pm, and at 236 pm it lies roughly 440 kJ/mol below the atoms (about 410 kJ/mol once repulsion is included).'
    },
    {
      title: 'Formulas from the charges',
      q: 'Write the formulas of aluminium oxide, magnesium nitride and calcium phosphate.',
      steps: [
        'Aluminium oxide: $\\ce{Al^3+}$ and $\\ce{O^2-}$. The smallest common multiple of 3 and 2 is 6: two $\\ce{Al^3+}$ ($+6$) and three $\\ce{O^2-}$ ($-6$) give $\\ce{Al2O3}$.',
        'Magnesium nitride: $\\ce{Mg^2+}$ and $\\ce{N^3-}$: three $\\ce{Mg^2+}$ ($+6$) and two $\\ce{N^3-}$ ($-6$) give $\\ce{Mg3N2}$.',
        'Calcium phosphate: $\\ce{Ca^2+}$ and the polyatomic ion $\\ce{PO4^3-}$, kept whole in brackets: $\\ce{Ca3(PO4)2}$.'
      ],
      a: '$\\ce{Al2O3}$, $\\ce{Mg3N2}$ and $\\ce{Ca3(PO4)2}$.'
    }
  ],
  quiz: [
    { q: 'For the gas-phase change $\\ce{Na(g) + Cl(g) -> Na+(g) + Cl-(g)}$, the enthalpy change is…', choices: ['negative: chlorine\'s electron affinity exceeds sodium\'s ionisation energy', 'positive: removing the electron costs more than chlorine gives back', 'zero: the electron only changes owner', 'negative, because both ions reach a noble-gas configuration'], a: 1,
      why: '496 kJ/mol to remove the electron, 349 kJ/mol returned: +147 kJ/mol. Ionic compounds are stable only because of the attraction between the ions that follows.' },
    { q: 'Which has the higher melting point, and why?', choices: ['NaCl, because sodium is the more reactive metal', 'MgO, because its ions carry double charges and are smaller', 'About the same: both are 1 : 1 compounds', 'NaCl, because chlorine is a larger atom than oxygen'], a: 1,
      why: 'The attraction scales with the product of the charges (4 instead of 1) and inversely with the distance between ions (smaller in MgO). MgO melts near 2830 °C, NaCl at 801 °C.' },
    { q: 'Solid sodium chloride is a good electrical conductor because it is made of ions.', a: false,
      why: 'The ions are locked in the lattice and cannot drift. Melt the salt or dissolve it and the ions become mobile charge carriers.' },
    { q: 'What is the size of the Coulomb energy of one mole of isolated $\\ce{K+}$–$\\ce{Cl-}$ pairs 267 pm apart, in kJ/mol?', answer: 520, unit: 'kJ/mol',
      why: '$k e^2 N_A / r = 138.9\\ \\mathrm{kJ\\,nm/mol} / 0.267\\ \\mathrm{nm} = 520\\ \\mathrm{kJ/mol}$ (the energy is −520 kJ/mol: attractive).' },
    { q: 'A salt crystal struck sharply along a plane of ions splits cleanly instead of bending. Why?', choices: ['The ionic bonds are weaker than metallic bonds', 'Sliding one layer brings ions of the same charge face to face, and they repel', 'The electrons leave the crystal when it is struck', 'Ionic crystals contain small molecules that come apart'], a: 1,
      why: 'In an ionic lattice every neighbour of an ion is oppositely charged. Displace a layer by half a spacing and like charges line up; the repulsion forces the layers apart.' }
  ],
  applications: [
    'Rock salt, fluorite, calcite and most minerals of the Earth\'s crust are ionic solids.',
    'Refractory linings of MgO and CaO for steel furnaces and cement kilns.',
    'Molten-salt electrolysis to make sodium, magnesium and aluminium.',
    'Solid and molten ionic conductors in batteries and fuel cells.'
  ],
  sim: { id: 'bond-pe-curve', params: { pair: 'NaCl' } }
},

{
  id: 'lattice-energy', parent: 'ionic-metallic', title: 'Lattice energy and the Born–Haber cycle', level: 2,
  short: 'The energy needed to break one mole of an ionic solid into gaseous ions. It cannot be measured directly, so it is found from a Hess\'s-law cycle of measurable steps, or estimated from the charges and sizes of the ions.',
  keywords: ['lattice energy', 'lattice enthalpy', 'Born–Haber cycle', 'Kapustinskii equation', 'Born–Landé equation', 'Madelung constant', 'Born exponent', 'ionic radius', 'electron affinity', 'enthalpy of atomisation', 'ionic model', 'polarisation'],
  prereq: ['ionic-bonding', 'hess-law', 'ionization-energy'],
  related: ['enthalpy-of-formation', 'solubility', 'crystal-structures', 'atomic-radius', 'bond-polarity', 'physics:electric-potential-energy'],
  body: `
The **lattice energy** $U_L$ of an ionic solid is the energy needed to pull one mole of it apart into gaseous ions that no longer interact:

$$\\ce{NaCl(s) -> Na+(g) + Cl-(g)} \\qquad U_L = +786\\ \\mathrm{kJ/mol}$$

It is the single best measure of how firmly a lattice holds together. (Some books define it for the reverse process, building the lattice from the ions, and give it a negative sign. The size is the same.)

### Measuring the unmeasurable: the Born–Haber cycle
No experiment takes a crystal apart into free ions in a calorimeter. But enthalpy depends only on the start and the end ([[hess-law|Hess's law]]), so you can reach the gaseous ions by a detour of steps that *can* be measured, and close the loop through the solid, whose [[enthalpy-of-formation|enthalpy of formation]] is known. For sodium chloride:

| Step | $\\Delta H$ (kJ/mol) |
|---|---|
| atomise sodium, $\\ce{Na(s) -> Na(g)}$ | +107 |
| ionise it, $\\ce{Na(g) -> Na+(g) + e-}$ | +496 |
| atomise chlorine, $\\ce{1/2 Cl2(g) -> Cl(g)}$ | +121 |
| add the electron, $\\ce{Cl(g) + e- -> Cl-(g)}$ | −349 |
| let the ions form the solid, $\\ce{Na+(g) + Cl-(g) -> NaCl(s)}$ | $-U_L$ |
| overall, $\\ce{Na(s) + 1/2 Cl2(g) -> NaCl(s)}$ | −411 |

The five steps must add up to the overall change: $107 + 496 + 121 - 349 - U_L = -411$, so $U_L = 786\\ \\mathrm{kJ/mol}$. The picture to keep is an energy staircase: up four steps to the free ions, then a single large drop to the solid that lands below the elements.

### What makes it large: charge and size
In the ionic model the lattice is held by Coulomb attraction, so the energy grows with the product of the charges and falls with the distance between ion centres:

$$U_L \\propto \\frac{z_+ z_-}{r_+ + r_-}$$

Born–Haber values confirm it. Along the sodium halides the anion grows and the lattice weakens: NaF 930, NaCl 786, NaBr 751, NaI 703 kJ/mol. Double both charges and the energy roughly quadruples: $\\ce{MgO}$ reaches about 3850 kJ/mol. A good estimate that needs only the ionic radii is the **Kapustinskii equation** (below), which gives 746 kJ/mol for $\\ce{NaCl}$, 5 % under the cycle. If the crystal structure is known, the **Born–Landé equation** does better: it sums the attractions and repulsions over the whole lattice (the Madelung constant, 1.748 for the rock-salt arrangement) and adds a short-range repulsion through the Born exponent $n$.

### When the ionic model falls short
For silver chloride the cycle gives 915 kJ/mol, while the ionic model predicts only about 720. The extra binding is **covalent character**: the soft, easily distorted $\\ce{Ag+}$ and $\\ce{Cl-}$ share some electron density (see [[bond-polarity]]). Comparing cycle and model is therefore a quantitative test of how ionic a solid really is.

### Why it matters
- Whether a salt dissolves is a contest between its lattice energy and the hydration energy of its ions ([[solubility]]).
- It explains which compounds exist: magnesium is $\\ce{Mg^2+}$ in its oxide, although the second ionisation costs 1451 kJ/mol, because the doubly charged lattice pays it back several times over.
- It decides hardness and melting point: MgO and CaO are refractories; the alkali halides melt below 1000 °C.

> [!note] The second electron affinity of oxygen, $\\ce{O- + e- -> O^2-}$, is strongly uphill and cannot be measured, because a free $\\ce{O^2-}$ ion is unstable. Its value, about +800 kJ/mol, comes from Born–Haber cycles run backwards with lattice energies calculated from theory.
`,
  ideas: [
    'Lattice energy is the energy to separate one mole of an ionic solid into gaseous ions; the larger it is, the more tightly the ions are held.',
    'It cannot be measured directly; a Born–Haber cycle finds it from measurable steps by Hess\'s law.',
    'It grows with the product of the ionic charges and shrinks with the distance between the ions.',
    'The Kapustinskii and Born–Landé equations estimate it from the ionic model; a cycle value well above the model reveals covalent character.'
  ],
  pitfalls: [
    'Lattice energy is the energy released when the elements form the salt — That is the enthalpy of formation (−411 kJ/mol for NaCl). The lattice energy refers to gaseous ions, not to elements in their standard states.',
    'A negative lattice energy means the salt is unstable — It is only a sign convention: one direction is endothermic (breaking the lattice), the other exothermic (forming it).',
    'The ion with the noble-gas configuration is always the one that forms — Mg²⁺O²⁻ exists and Mg⁺O⁻ does not, although O²⁻ is unstable on its own; the choice is made by the lattice energy.'
  ],
  derivation: {
    title: 'Derive the Born–Landé equation',
    steps: [
      { text: 'Add up the Coulomb energy of one ion with every other ion in the crystal. All distances are fixed multiples of the nearest-neighbour distance $r$, so the whole sum is a pure number — the Madelung constant $M$ — times the energy of one nearest pair. Per mole:', tex: 'E_\\text{C}(r) = -\\frac{N_A M z_+ z_-\\, k e^2}{r}' },
      { text: 'When the electron clouds of neighbouring ions overlap they repel. Born modelled this with a steep power of the distance:', tex: 'E_\\text{R}(r) = \\frac{N_A B}{r^{n}}' },
      { text: 'The crystal sits where the total energy is lowest, so the derivative vanishes at the equilibrium distance $r_0$:', tex: '\\frac{N_A M z_+ z_- k e^2}{r_0^2} = \\frac{n N_A B}{r_0^{n+1}} \\quad\\Rightarrow\\quad B = \\frac{M z_+ z_- k e^2\\, r_0^{\\,n-1}}{n}' },
      { text: 'Put $B$ back into $E_\\text{C} + E_\\text{R}$ at $r_0$. The lattice energy is the energy needed to take it apart, the negative of that total:', tex: 'U_L = \\frac{N_A M z_+ z_-\\, k e^2}{r_0}\\left(1 - \\frac{1}{n}\\right)' }
    ],
    outro: 'The repulsion takes back only the fraction $1/n$ — about 12 % for sodium chloride — so a lattice energy is mostly plain electrostatics.'
  },
  formulas: [
    {
      name: 'Born–Haber cycle for a 1 : 1 salt',
      expr: 'U = HM + IE + HX - EA - Hf', tex: 'U_L = \\Delta H_\\text{M} + \\mathrm{IE} + \\Delta H_\\text{X} - \\mathrm{EA} - \\Delta H_f',
      vars: {
        U: { name: 'lattice energy (solid → gaseous ions)', q: 'molarenergy', unit: 'kJ/mol', tex: 'U_L' },
        HM: { name: 'enthalpy of atomisation of the metal', q: 'molarenergy', unit: 'kJ/mol', value: 107, tex: '\\Delta H_\\text{M}' },
        IE: { name: 'first ionisation energy of the metal', q: 'molarenergy', unit: 'kJ/mol', value: 496, tex: '\\mathrm{IE}' },
        HX: { name: 'enthalpy of atomisation of the non-metal (half the bond enthalpy of X₂)', q: 'molarenergy', unit: 'kJ/mol', value: 121, tex: '\\Delta H_\\text{X}' },
        EA: { name: 'electron affinity of the non-metal (energy released)', q: 'molarenergy', unit: 'kJ/mol', value: 349, tex: '\\mathrm{EA}' },
        Hf: { name: 'standard enthalpy of formation of the salt', q: 'molarenergy', unit: 'kJ/mol', value: -411, signed: true, tex: '\\Delta H_f' }
      },
      solveFor: 'U',
      note: 'Defaults: sodium chloride. The same bookkeeping works for any salt; for $\\ce{MgCl2}$ add the second ionisation energy and count two chlorine atoms.',
      practice: { unknowns: ['U', 'Hf', 'EA'] },
      stories: {
        U: 'For a 1 : 1 salt: atomising the metal takes {HM}, ionising it {IE}, atomising the non-metal {HX}; the non-metal atom releases {EA} when it gains the electron, and the enthalpy of formation is {Hf}. What is the lattice energy?',
        Hf: 'A 1 : 1 salt has lattice energy {U}. Its metal needs {HM} to atomise and {IE} to ionise; the non-metal needs {HX} to atomise and releases {EA} on gaining an electron. Predict the enthalpy of formation.',
        EA: 'From a Born–Haber cycle: lattice energy {U}, metal atomisation {HM}, ionisation {IE}, non-metal atomisation {HX}, enthalpy of formation {Hf}. What electron affinity does the non-metal have?'
      }
    },
    {
      name: 'Kapustinskii estimate',
      expr: 'U = K*nu*z1*z2/(rp + rm)*(1 - d/(rp + rm))', tex: 'U_L = \\frac{K \\nu\\, z_+ z_-}{r_+ + r_-}\\left(1 - \\frac{d}{r_+ + r_-}\\right)',
      vars: {
        U: { name: 'lattice energy', q: 'molarenergy', unit: 'kJ/mol', tex: 'U_L' },
        K: { name: 'Kapustinskii constant', unit: 'J·m/mol', value: 1.2025e-4, fixed: true },
        nu: { name: 'number of ions in the formula unit', int: true, value: 2, tex: '\\nu' },
        z1: { name: 'charge number of the cation', int: true, value: 1, tex: 'z_+' },
        z2: { name: 'charge number of the anion (positive number)', int: true, value: 1, tex: 'z_-' },
        rp: { name: 'radius of the cation', q: 'length', unit: 'pm', value: 102, tex: 'r_+' },
        rm: { name: 'radius of the anion', q: 'length', unit: 'pm', value: 181, tex: 'r_-' },
        d: { name: 'repulsion length', q: 'length', unit: 'pm', value: 34.5, fixed: true }
      },
      solveFor: 'U',
      note: 'Needs no crystal structure, only ionic radii (six-coordinate Shannon radii here: $\\ce{Na+}$ 102 pm, $\\ce{Cl-}$ 181 pm). Good to a few per cent for strongly ionic solids; it underestimates when the bonding has covalent character.',
      practice: { unknowns: ['U', 'rm'] },
      stories: {
        U: 'Estimate the lattice energy of a salt with {nu} ions per formula unit, ionic charges {z1} and {z2}, and radii {rp} and {rm}.',
        rm: 'A salt with {nu} ions per formula unit, charges {z1} and {z2} and cation radius {rp} has a lattice energy of {U}. What anion radius does the Kapustinskii equation imply?'
      }
    },
    {
      name: 'Born–Landé equation',
      expr: 'U = NA*M*z1*z2*ke*qe^2/r0*(1 - 1/n)', tex: 'U_L = \\frac{N_A M z_+ z_-\\, k e^2}{r_0}\\left(1 - \\frac{1}{n}\\right)',
      vars: {
        U: { name: 'lattice energy', q: 'molarenergy', unit: 'kJ/mol', tex: 'U_L' },
        NA: { const: 'NA' },
        M: { name: 'Madelung constant of the structure', value: 1.74756 },
        z1: { name: 'charge number of the cation', int: true, value: 1, tex: 'z_+' },
        z2: { name: 'charge number of the anion (positive number)', int: true, value: 1, tex: 'z_-' },
        ke: { const: 'ke' },
        qe: { const: 'qe' },
        r0: { name: 'distance between neighbouring cation and anion', q: 'length', unit: 'pm', value: 282, tex: 'r_0' },
        n: { name: 'Born exponent (5 for He-like ions to 12 for Xe-like)', value: 8, min: 4, max: 16 }
      },
      solveFor: 'U',
      note: 'Madelung constants: rock salt ($\\ce{NaCl}$) 1.748, caesium chloride 1.763, zinc blende 1.638, fluorite ($\\ce{CaF2}$) 2.519. For $\\ce{NaCl}$, $n = 8$ averages 7 for $\\ce{Na+}$ and 9 for $\\ce{Cl-}$.',
      practice: { unknowns: ['U', 'r0'] },
      stories: {
        U: 'A rock-salt lattice (Madelung constant {M}) of ions with charges {z1} and {z2} has neighbouring ions {r0} apart and Born exponent {n}. Estimate its lattice energy.',
        r0: 'What cation–anion distance gives a lattice energy of {U} for a lattice with Madelung constant {M}, charges {z1} and {z2}, and Born exponent {n}?'
      }
    }
  ],
  examples: [
    {
      title: 'The Born–Haber cycle for sodium chloride',
      q: 'Use: atomisation of Na +107, first ionisation of Na +496, atomisation of chlorine +121, electron affinity of Cl 349 (released), $\\Delta_f H(\\ce{NaCl}) = -411$, all in kJ/mol. Find the lattice energy.',
      steps: [
        'Climb to the gaseous ions: $107 + 496 + 121 - 349 = +375\\ \\mathrm{kJ/mol}$ above the elements.',
        'The solid lies 411 kJ/mol *below* the elements, so the drop from the ions to the solid is $375 + 411 = 786\\ \\mathrm{kJ/mol}$.',
        { text: 'That drop is the lattice energy:', tex: 'U_L = 107 + 496 + 121 - 349 + 411 = 786\\ \\mathrm{kJ/mol}' }
      ],
      a: '$U_L = 786\\ \\mathrm{kJ/mol}$.'
    },
    {
      title: 'Why magnesium oxide is Mg²⁺O²⁻',
      q: 'Magnesium could give oxygen one electron ($\\ce{Mg+ O-}$) or two ($\\ce{Mg^2+ O^2-}$). Data (kJ/mol): atomisation of Mg 148, IE₁ 738, IE₂ 1451; atomisation of O 249; first electron affinity 141 released, second 798 absorbed; lattice energies about 3850 for $\\ce{Mg^2+ O^2-}$ and, by the ionic model with single charges, about 950 for $\\ce{Mg+ O-}$. Which has the lower enthalpy of formation?',
      steps: [
        'For $\\ce{Mg+ O-}$: $\\Delta_f H = 148 + 738 + 249 - 141 - 950 = +44\\ \\mathrm{kJ/mol}$ — less stable than the elements.',
        'For $\\ce{Mg^2+ O^2-}$: the extra steps cost $1451 + 798 = 2249\\ \\mathrm{kJ/mol}$ more, but the lattice returns about $3850 - 950 = 2900$ more.',
        '$\\Delta_f H = 148 + 738 + 1451 + 249 - 141 + 798 - 3850 = -607\\ \\mathrm{kJ/mol}$, close to the measured −602.',
        'Quadrupling the charge product quadruples the lattice energy, and that outweighs the costly second ionisation and second electron affinity.'
      ],
      a: 'Mg²⁺O²⁻, by about 650 kJ/mol: the doubly charged lattice more than pays for the extra electron transfers.'
    }
  ],
  quiz: [
    { q: 'Which of these has the largest lattice energy?', choices: ['KCl', 'NaCl', 'NaF', 'LiF'], a: 3,
      why: 'All are 1 : 1 salts with singly charged ions, so the smallest ions win: Li⁺ and F⁻ are the smallest pair. Born–Haber values: KCl 717, NaCl 786, NaF 930, LiF 1046 kJ/mol.' },
    { q: 'The lattice energy of sodium chloride is measured by heating the crystal in a calorimeter until it breaks into ions.', a: false,
      why: 'A crystal never falls apart into free gaseous ions on heating — it melts and then evaporates as ion pairs and clusters. The lattice energy is found indirectly, from a Born–Haber cycle.' },
    { q: 'Potassium chloride: atomisation of K +89, first ionisation of K +419, atomisation of chlorine +121, electron affinity of Cl 349 released, enthalpy of formation −437 (all kJ/mol). What is its lattice energy?', answer: 717, unit: 'kJ/mol',
      why: '$U_L = 89 + 419 + 121 - 349 + 437 = 717\\ \\mathrm{kJ/mol}$.' },
    { q: 'For silver chloride the Born–Haber cycle gives 915 kJ/mol, but the ionic model predicts only about 720 kJ/mol. What does the difference show?', choices: ['The cycle data are wrong', 'Silver chloride has a large Madelung constant', 'The bonding has considerable covalent character', 'Silver ions carry a charge of +2'], a: 2,
      why: 'The ionic model counts only point-charge attraction. Ag⁺ and Cl⁻ are large and easily polarised, so they share electron density; the extra binding shows up as a cycle value above the model.' },
    { q: 'Keeping the ionic radii fixed, both ion charges are doubled (from ±1 to ±2). The lattice energy becomes roughly…', choices: ['twice as large', 'four times as large', 'eight times as large', 'unchanged'], a: 1,
      why: 'The Coulomb energy is proportional to the product $z_+ z_-$: 2 × 2 = 4 instead of 1 × 1.' }
  ],
  applications: [
    'Predicting whether an ionic compound can exist at all — for example why there is no NaCl₂ or MgO with single charges.',
    'Understanding solubility: lattice energy against the hydration energy of the ions.',
    'Choosing refractory ceramics (MgO, CaO, ZrO₂) for furnaces and crucibles.',
    'Deriving quantities that cannot be measured, such as the second electron affinity of oxygen.'
  ],
  history: 'Max Born and Alfred Landé derived the lattice-energy equation in 1918 from the electrostatics of a crystal, and in 1919 Born and Fritz Haber published the thermochemical cycle that checks it against measured heats of reaction. The agreement was one of the first quantitative confirmations that salts really are made of ions.',
  sim: 'bond-born-haber'
},

{
  id: 'metallic-bonding', parent: 'ionic-metallic', title: 'Metallic bonding', level: 1,
  short: 'In a metal, each atom releases its outer electrons into a shared "sea" that flows through a lattice of positive ions. The attraction between the ions and the mobile electrons holds the metal together and explains its conductivity, lustre and ductility.',
  keywords: ['metallic bond', 'electron sea', 'delocalised electrons', 'free electrons', 'conductivity', 'malleability', 'ductility', 'lustre', 'alloy', 'dislocation', 'enthalpy of atomisation', 'band'],
  prereq: ['valence-electrons', 'periodic-trends', 'physics:free-electron-model'],
  related: ['ionic-bonding', 'covalent-bonds', 'crystal-structures', 'molecular-orbitals', 'physics:band-theory', 'physics:resistivity', 'physics:stress-strain', 'electronics:wire-sizing', 'corrosion'],
  body: `
A copper atom has one outer electron, yet in solid copper each atom touches twelve neighbours. There are far too few electrons to give every neighbouring pair its own shared pair, as in a molecule. Instead the outer electrons are pooled: each atom releases them into the whole crystal and stays behind as a positive **ion core**. The cores sit in a regular lattice — body-centred cubic in iron, face-centred cubic in copper and aluminium, hexagonal in magnesium and titanium — and the **delocalised electrons** move freely among them. The metallic bond is the attraction between the lattice of cores and this electron "sea". Overall the metal is neutral: the negative sea exactly balances the positive cores.

### What the electron sea explains
- **Electrical conduction.** Apply a voltage and the free electrons drift. Copper has about $8.5\\times10^{28}$ of them per cubic metre, one per atom, which is why its resistivity is only $1.7\\times10^{-8}\\ \\Omega\\,\\mathrm{m}$ (see [[physics:free-electron-model|electrons in metals]]).
- **Heat conduction.** The same mobile electrons carry thermal energy: copper conducts heat about 400 times better than glass. Good electrical conductors are good thermal conductors.
- **Lustre.** Free electrons respond to the oscillating field of light and re-radiate it, so a clean metal reflects most visible light. Gold and copper look coloured because their d electrons absorb some blue light.
- **Malleability and ductility.** The bonding has no direction and no fixed partners. Layers of cores can slide past one another while the electron sea keeps holding them — compare an ionic crystal, where sliding brings like charges together and the crystal shatters. Real metals deform by the gliding of line defects called dislocations, which is the atomic basis of yield, forging and wire drawing ([[physics:stress-strain|stress and strain]]).
- **Alloys are harder.** Atoms of a different size distort the lattice and pin the dislocations, so brass is harder than copper and steel far stronger than pure iron.

### How strong is the metallic bond?
A convenient measure is the **enthalpy of atomisation**, the energy to turn one mole of the solid metal into gaseous atoms:

| Metal | K | Na | Mg | Al | Cu | Fe | W |
|---|---|---|---|---|---|---|---|
| $\\Delta H_\\text{at}$ (kJ/mol) | 89 | 107 | 147 | 330 | 338 | 416 | 849 |
| melting point (°C) | 64 | 98 | 650 | 660 | 1085 | 1538 | 3422 |

The bond strengthens with the number of electrons each atom gives to the sea (Na 1, Mg 2, Al 3) and with smaller ion cores, and weakens down a group as the cores grow. The transition metals, whose d electrons also take part, are the strongest: tungsten has the highest melting point of any metal, which is why it is used for lamp filaments and welding electrodes. Mercury, at the other extreme, is liquid down to −39 °C. Boiling points follow the atomisation enthalpy more faithfully than melting points, because melting breaks only part of the bonding.

### The band picture
[[molecular-orbitals|Molecular orbital theory]] makes the electron sea precise. Two atoms give two orbitals; $N$ atoms give $N$ orbitals so closely spaced that they form a continuous **band**. In a metal the highest occupied band is only partly filled, so electrons can move into empty levels just above and carry current. In an insulator the band is full and separated by a wide gap from the next ([[physics:band-theory|band theory]]).

> [!tip] More free electrons does not automatically mean a better conductor. Aluminium has twice as many per cubic metre as copper, yet its resistivity is 60 % higher: how far an electron travels between collisions matters as much as how many there are.
`,
  ideas: [
    'In a metal the outer electrons are delocalised over the whole crystal, and the lattice of positive ion cores is held together by its attraction to this electron sea.',
    'The bonding is non-directional, so layers can slide without breaking the solid: metals are malleable and ductile.',
    'Mobile electrons make metals good conductors of electricity and heat and give them their lustre.',
    'Metallic bonds get stronger with more delocalised electrons per atom and smaller ion cores; transition metals are the strongest.',
    'In band terms, a metal has a partly filled band, so electrons can move into empty levels and carry current.'
  ],
  pitfalls: [
    'A metal is a collection of neutral atoms floating in extra electrons — It is positive ion cores in a sea of their own valence electrons; the total charge is zero, with no extra electrons anywhere.',
    'More free electrons per volume always means a better conductor — Aluminium has more than copper but conducts worse. The time between collisions matters too.',
    'Metallic bonds are weak because some metals are soft — Sodium can be cut with a knife, but tungsten\'s bonding (849 kJ/mol to atomise) is as strong as many covalent solids.'
  ],
  formulas: [
    {
      name: 'Density of free electrons in a metal',
      expr: 'n = rho*NA*v/M', tex: 'n = \\frac{\\rho N_A v}{M}',
      vars: {
        n: { name: 'free electrons per unit volume', q: 'numberdensity', unit: '1/m³' },
        rho: { name: 'density of the metal', q: 'density', unit: 'g/cm³', value: 8.96, tex: '\\rho' },
        NA: { const: 'NA' },
        v: { name: 'delocalised electrons given by each atom', int: true, value: 1 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 63.55 }
      },
      solveFor: 'n',
      note: 'Atoms per volume ($\\rho N_A / M$) times electrons per atom. Defaults: copper, one electron per atom. Aluminium: 2.70 g/cm³, 26.98 g/mol, three electrons each.',
      practice: { unknowns: ['n', 'rho'] },
      stories: {
        n: 'A metal of density {rho} and molar mass {M} gives {v} electrons per atom to the electron sea. How many free electrons are there per cubic metre?',
        rho: 'A metal with molar mass {M} and {v} free electrons per atom has {n} of them per cubic metre. What is its density?'
      }
    }
  ],
  examples: [
    {
      title: 'How fast do the electrons in a wire move?',
      q: 'A copper wire of cross-section 1.5 mm² carries 10 A. Copper: density 8.96 g/cm³, molar mass 63.55 g/mol, one free electron per atom. Find the density of free electrons and their average drift speed $v_d = I/(n e A)$.',
      steps: [
        { text: 'Free electrons per cubic metre:', tex: 'n = \\frac{8960 \\times 6.022\\times10^{23} \\times 1}{0.06355} = 8.49\\times10^{28}\\ \\mathrm{m^{-3}}' },
        'Charge per metre of wire: $n e A = 8.49\\times10^{28} \\times 1.602\\times10^{-19} \\times 1.5\\times10^{-6} = 2.04\\times10^{4}\\ \\mathrm{C/m}$.',
        'Drift speed: $v_d = 10 / 2.04\\times10^{4} = 4.9\\times10^{-4}\\ \\mathrm{m/s}$, about half a millimetre per second.',
        'The signal travels at nearly the speed of light because the whole electron sea moves at once; each electron only creeps.'
      ],
      a: '$n = 8.5\\times10^{28}\\ \\mathrm{m^{-3}}$; the electrons drift at about 0.5 mm/s.'
    },
    {
      title: 'Sodium, magnesium, aluminium',
      q: 'The enthalpies of atomisation of Na, Mg and Al are 107, 147 and 330 kJ/mol, and their boiling points 883, 1090 and 2519 °C. Explain the trend.',
      steps: [
        'Each atom gives its valence electrons to the sea: one for Na, two for Mg, three for Al.',
        'The cores carry charges +1, +2 and +3 and get smaller across the period (radii of the ions 102, 72 and 54 pm).',
        'More electrons in the sea and smaller, more highly charged cores mean stronger attraction between cores and electrons, so more energy is needed to pull the atoms apart.'
      ],
      a: 'The metallic bond strengthens with the number of delocalised electrons per atom and with smaller ion cores.'
    }
  ],
  quiz: [
    { q: 'Why can gold be beaten into a leaf 0.1 µm thick while a salt crystal shatters?', choices: ['Gold atoms are heavier than sodium and chloride ions', 'Metallic bonding is non-directional, so layers slide while the electron sea keeps holding them', 'Gold has no bonds between its atoms', 'Hammering melts the gold locally'], a: 1,
      why: 'Sliding a layer of a metal changes neighbours without breaking the bonding, which is shared by the whole crystal. In an ionic lattice, sliding brings like charges face to face.' },
    { q: 'Which metal has the largest enthalpy of atomisation?', choices: ['sodium', 'potassium', 'magnesium', 'aluminium'], a: 3,
      why: 'Aluminium contributes three electrons per atom to the sea and has a small +3 core: 330 kJ/mol, against 147 (Mg), 107 (Na) and 89 (K).' },
    { q: 'In a metal, each electron of the sea is bonded to one particular pair of neighbouring atoms.', a: false,
      why: 'The electrons are delocalised over the whole crystal; that is exactly what distinguishes metallic from covalent bonding.' },
    { q: 'Aluminium: density 2.70 g/cm³, molar mass 26.98 g/mol, three free electrons per atom. How many free electrons per cubic metre?', answer: 1.81e29, unit: '1/m³',
      why: '$n = 2700 \\times 6.022\\times10^{23} \\times 3 / 0.02698 = 1.81\\times10^{29}\\ \\mathrm{m^{-3}}$ — twice copper\'s, although aluminium conducts less well.' },
    { q: 'Why is brass (copper with zinc) harder than pure copper?', choices: ['Zinc atoms form covalent bonds with copper', 'Atoms of a different size distort the lattice and pin the dislocations that let layers slip', 'Zinc removes the free electrons', 'Brass is an ionic compound'], a: 1,
      why: 'Plastic deformation happens by dislocations gliding through the lattice. Misfit atoms create strain fields that hinder that glide, so a higher stress is needed.' }
  ],
  applications: [
    'Copper and aluminium conductors in wiring and power lines (see [[electronics:wire-sizing|wire sizing]]).',
    'Forming processes — rolling, forging, deep drawing, wire drawing — that rely on non-directional bonding.',
    'Alloy design: steels, brasses, bronzes and solders tuned by adding atoms of different size.',
    'Mirrors and reflective coatings of aluminium and silver.'
  ]
}

);
