/* HYPER-CHEMISTRY · content/electrons-in-atoms.js — energy levels and spectra,
 * quantum numbers and orbitals, how electrons fill them, and the valence electrons
 * that do the chemistry. The quantum mechanics itself is in Hyper Physics. */
Hyper.add(

{
  id: 'atomic-spectra', parent: 'electrons-in-atoms', title: 'Atomic spectra and energy levels', level: 2,
  short: 'Heated or excited atoms give out light only at particular wavelengths, a fingerprint of the element. Each line is a photon carrying the energy difference between two allowed electron energy levels.',
  keywords: ['line spectrum', 'emission spectrum', 'absorption spectrum', 'energy level', 'flame test', 'Balmer series', 'Lyman series', 'Paschen series', 'Rydberg formula', 'photon', 'wavelength', 'hydrogen spectrum', 'atomic absorption', 'Fraunhofer lines'],
  prereq: ['subatomic-particles', 'physics:photon', 'physics:em-spectrum', 'physics:bohr-model'],
  related: ['quantum-numbers', 'ionization-energy', 'beer-lambert', 'physics:hydrogen-spectrum', 'physics:stellar-spectra', 'physics:lasers', 'electronics:leds'],
  body: `
Hold a wire dipped in salt water in a gas flame and the flame turns a vivid yellow. Look at that light through a prism and you do not see a rainbow: you see a single bright yellow line (in fact a close pair, at 589.0 and 589.6 nm) and darkness everywhere else. Lithium gives a crimson line at 671 nm, potassium a lilac pair at 766 and 770 nm, copper a blue-green glow. Every element has its own set of lines, as distinctive as a barcode — its **line spectrum**.

### Why lines and not a rainbow
An electron in an atom cannot have just any energy: only certain **energy levels** are allowed. When the flame's heat or an electric discharge kicks an electron up to a higher level, it soon falls back, and the energy it loses leaves as one photon. Energy is conserved, so the photon's energy is exactly the gap between the levels:

$$\\Delta E = h\\nu = \\frac{hc}{\\lambda}$$

Few gaps, so few colours. A hot solid, whose atoms crowd together, has so many levels that its glow is continuous — which is why a tungsten filament or molten steel gives a full rainbow.

### Hydrogen: the simplest case
The single electron of hydrogen has levels at
$$E_n = -\\frac{13.6\\ \\mathrm{eV}}{n^2}, \\qquad n = 1, 2, 3, \\dots$$
The zero of energy is an electron that has just escaped; bound electrons have negative energy, and $n = 1$, the **ground state**, is the lowest. Falling from level $n_2$ to $n_1$ gives the **Rydberg formula**:
$$\\frac{1}{\\lambda} = R_H \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right), \\qquad R_H = 1.0968\\times10^{7}\\ \\mathrm{m^{-1}}$$

The lines fall into series, named after their lower level:

| series | falls to | region | first lines |
|---|---|---|---|
| Lyman | $n = 1$ | ultraviolet | 121.6, 102.6 nm … limit 91.2 nm |
| Balmer | $n = 2$ | visible | 656.5 (red), 486.3 (blue-green), 434.2, 410.3 nm |
| Paschen | $n = 3$ | infrared | 1875, 1282 nm … |

(Tables quote Balmer lines measured in air, 0.03 % shorter: 656.3, 486.1 nm.) The series crowd together towards a **limit**, where the electron comes from outside the atom: the Lyman limit, 13.6 eV, is the [[ionization-energy|ionisation energy]] of hydrogen, 1312 kJ/mol. Atoms with more electrons have levels that depend on more than $n$, so their spectra are richer, but every line is still a difference of two levels.

### Emission and absorption
Shine white light through a cool gas and the atoms *absorb* exactly the photons that lift an electron up a gap: dark lines appear in the rainbow at the same wavelengths as the bright emission lines. The Sun's spectrum is crossed by thousands of these dark lines; in 1868 a yellow line that matched no known element revealed helium in the Sun, 27 years before it was found on Earth.

### The chemist's view: energy per mole
Multiply a photon energy by the Avogadro constant to compare it with chemical energies. One electronvolt per atom is 96.5 kJ/mol. Visible photons carry 170–300 kJ/mol — the range of weak chemical bonds — and ultraviolet photons more; below about 340 nm they carry enough to break a C–C bond (348 kJ/mol), and deeper in the ultraviolet C–H bonds (413 kJ/mol) too. That is the chemistry of sunburn, of plastics yellowing on a window sill, of ozone forming high in the stratosphere, and of germicidal lamps at 254 nm (471 kJ/mol) wrecking the DNA of bacteria.

### In the laboratory and industry
- **Atomic absorption spectroscopy** measures lead in drinking water or zinc in blood serum: a lamp made of the element itself emits its lines, and the amount absorbed by the atomised sample follows the [[beer-lambert|Beer–Lambert law]].
- **ICP emission spectroscopy** excites samples in a 7000 K argon plasma and reads dozens of elements at once — how steelworks check an alloy in a minute.
- Fireworks use strontium (red), barium (green), sodium (yellow) and copper (blue); low-pressure sodium street lamps and neon signs are discharge tubes glowing in their element's lines.
`,
  ideas: [
    'Electrons in atoms have only certain allowed energies, called energy levels.',
    'A photon emitted or absorbed carries exactly the energy difference between two levels: ΔE = hc/λ.',
    'Each element has its own pattern of lines, used to identify it in a flame, a lab sample or a star.',
    'In hydrogen Eₙ = −13.6 eV/n²; transitions to n = 1, 2, 3 form the Lyman (UV), Balmer (visible) and Paschen (IR) series.',
    'One eV per atom is 96.5 kJ/mol: UV photons carry enough energy to break chemical bonds.'
  ],
  pitfalls: [
    'The line wavelength depends on the upper level only — It depends on the difference between the two levels. The same upper level gives different lines depending on where the electron lands.',
    'A bigger jump in n always gives a bigger energy — The levels crowd together as n grows: the 7 → 6 transition releases far less energy than 2 → 1. Compare the energies, not the level numbers.',
    'Negative energy levels mean negative energy photons — The level energies are negative because the zero is set at a free electron. Photons carry the (positive) difference between two levels.'
  ],
  formulas: [
    {
      name: 'Photon energy and wavelength',
      expr: 'E = h*c/lambda', tex: 'E = \\frac{h c}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV', tex: 'E' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 589, tex: '\\lambda' }
      },
      note: 'A handy form: $E\\,[\\mathrm{eV}] = 1240/\\lambda\\,[\\mathrm{nm}]$. The default is the yellow sodium line.',
      practice: { unknowns: ['E', 'lambda'] },
      stories: {
        E: 'Sodium lamps glow at {lambda}. How much energy does each photon carry?',
        lambda: 'An electron in an atom drops through an energy gap of {E}. What wavelength of light is emitted?'
      }
    },
    {
      name: 'Energy levels of hydrogen-like atoms',
      expr: 'E = -Ry*Z^2/n^2', tex: 'E_n = -\\mathrm{Ry}\\,\\frac{Z^2}{n^2}',
      vars: {
        E: { name: 'energy of level n', q: 'energy', unit: 'eV', signed: true, tex: 'E_n' },
        Ry: { const: 'Ry' },
        Z: { name: 'nuclear charge (1 for hydrogen)', int: true, value: 1, tex: 'Z' },
        n: { name: 'principal quantum number', int: true, value: 2, tex: 'n' }
      },
      note: 'Exact only for one-electron species: H, He⁺, Li²⁺. The zero is a free electron at rest; $\\mathrm{Ry} = 13.6$ eV.',
      practice: { unknowns: ['E', 'n'] },
      stories: {
        E: 'What is the energy of the electron in level n = {n} of a hydrogen-like ion with nuclear charge {Z}?',
        n: 'An electron in hydrogen ($Z$ = {Z}) has an energy of {E}. Which level is it in?'
      }
    },
    {
      name: 'The Rydberg formula',
      expr: 'lambda = 1/(RH*(1/n1^2 - 1/n2^2))', tex: '\\frac{1}{\\lambda} = R_H\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)',
      vars: {
        lambda: { name: 'wavelength of the line', q: 'length', unit: 'nm', tex: '\\lambda' },
        RH: { name: 'Rydberg constant for hydrogen', q: 'wavenumber', unit: '1/m', value: 1.09678e7, fixed: true, tex: 'R_H' },
        n1: { name: 'lower level', int: true, value: 2, tex: 'n_1' },
        n2: { name: 'upper level', int: true, value: 3, tex: 'n_2' }
      },
      note: 'For hydrogen; $n_2 > n_1$. Gives wavelengths in vacuum; the values measured in air are 0.03 % shorter.',
      practice: { unknowns: ['lambda', 'n2'] },
      stories: {
        lambda: 'In a hydrogen discharge tube an electron falls from level {n2} to level {n1}. What is the wavelength of the photon?',
        n2: 'A hydrogen line of the series ending on level {n1} has a wavelength of {lambda}. From which level did the electron fall?'
      }
    },
    {
      name: 'Energy of a mole of photons',
      expr: 'Em = NA*h*c/lambda', tex: 'E_m = \\frac{N_A h c}{\\lambda}',
      vars: {
        Em: { name: 'energy per mole of photons', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_m' },
        NA: { const: 'NA' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 254, tex: '\\lambda' }
      },
      note: 'Compare with bond enthalpies to see whether light can break a bond: C–C 348, Cl–Cl 242, O=O 498 kJ/mol. The default is a germicidal mercury lamp.',
      practice: { unknowns: ['Em', 'lambda'] },
      stories: {
        Em: 'A germicidal lamp emits ultraviolet light at {lambda}. What energy does a mole of its photons carry?',
        lambda: 'Splitting a mole of bonds takes {Em}. What is the longest wavelength whose photons can break one bond each?'
      }
    }
  ],
  examples: [
    {
      title: 'The blue-green line of hydrogen',
      q: 'Find the wavelength, photon energy and colour of the hydrogen line emitted when an electron falls from $n = 4$ to $n = 2$.',
      steps: [
        { text: 'Rydberg formula:', tex: '\\frac{1}{\\lambda} = 1.09678\\times10^{7}\\left(\\frac{1}{4} - \\frac{1}{16}\\right) = 2.0565\\times10^{6}\\ \\mathrm{m^{-1}}' },
        '$\\lambda = 486.3$ nm: the blue-green Balmer line H-beta.',
        'Energy: $E = 1240/486.3 = 2.55$ eV — the same as $E_4 - E_2 = -0.85 - (-3.40) = 2.55$ eV from the level formula.'
      ],
      a: '486 nm, 2.55 eV, blue-green.'
    },
    {
      title: 'Can visible light split chlorine?',
      q: 'The Cl–Cl bond enthalpy is 242 kJ/mol. What is the longest wavelength of light that can break it, and what does that mean for a mixture of chlorine and methane?',
      steps: [
        'Energy per bond: $242\\,000/6.022\\times10^{23} = 4.02\\times10^{-19}$ J.',
        '$\\lambda = hc/E = 6.626\\times10^{-34} \\times 2.998\\times10^{8}/4.02\\times10^{-19} = 4.94\\times10^{-7}$ m = 494 nm.',
        'Blue and violet light, and all ultraviolet, can split $\\ce{Cl2}$ into atoms. That is why $\\ce{CH4 + Cl2}$ is stable in the dark but reacts — sometimes explosively — in sunlight; it is also why chlorine gas looks yellow-green: it absorbs violet-blue.'
      ],
      a: '494 nm: blue light is energetic enough.'
    }
  ],
  quiz: [
    { q: 'Why does an element give a line spectrum rather than a continuous one?', choices: ['its atoms vibrate at a single frequency', 'its electrons can only have certain energies, so only certain energy differences exist', 'the flame is not hot enough to make all colours', 'the prism removes the other colours'], a: 1,
      why: 'Each photon carries the difference between two allowed levels. A limited set of levels gives a limited set of differences, so only certain wavelengths appear.' },
    { q: 'Which hydrogen transition emits the photon with the highest energy?', choices: ['n = 6 → 5', 'n = 4 → 3', 'n = 3 → 2', 'n = 2 → 1'], a: 3,
      why: 'The levels get closer together as n grows. From n = 2 to 1 the drop is 10.2 eV (121.6 nm, ultraviolet); 3 → 2 is only 1.9 eV and 6 → 5 just 0.17 eV.' },
    { q: 'What is the energy, in electronvolts, of a photon of green light of wavelength 500 nm?', answer: 2.48, unit: 'eV',
      why: '$E = hc/\\lambda = 1240\\ \\mathrm{eV\\,nm}/500\\ \\mathrm{nm} = 2.48$ eV, or 239 kJ per mole of photons.' },
    { q: 'Cold hydrogen gas is placed in the path of white light (including ultraviolet). Which series of dark lines is strongest?', choices: ['Balmer, because it is visible', 'Lyman, because the atoms start in n = 1', 'Paschen, because it has the lowest energy', 'no lines: cold gas cannot absorb'], a: 1,
      why: 'Absorption starts from the level the electrons are in. At room temperature almost every hydrogen atom is in n = 1, so it absorbs the Lyman lines in the ultraviolet; Balmer absorption needs atoms already in n = 2, as in the hot atmospheres of stars.' },
    { q: 'The dark lines in the Sun\'s spectrum lie at the same wavelengths as the bright lines emitted by the same elements in the laboratory.', a: true,
      why: 'Absorption and emission are the same jump in opposite directions, so they involve the same energy gap and the same wavelength. That is how the composition of stars is read.' }
  ],
  problems: [
    { q: 'What is the longest wavelength of light that can ionise a hydrogen atom already excited to $n = 2$?', answer: 364.7, unit: 'nm', tol: 0.01,
      hint: 'Ionising from n = 2 means going to n = ∞.',
      steps: ['The energy needed is $0 - E_2 = 13.6/4 = 3.40$ eV.', 'Rydberg with $n_2 \\to \\infty$: $1/\\lambda = R_H/4 = 2.742\\times10^{6}$ m⁻¹, so $\\lambda = 364.7$ nm — the Balmer limit, in the near ultraviolet.'] }
  ],
  applications: ['Atomic absorption and ICP emission spectroscopy for metals in water, food, blood and alloys.', 'Reading the composition, temperature and speed of stars from their spectra.', 'Fireworks, flame tests, sodium street lamps and neon signs.', 'Photochemistry: sunburn, UV curing of dental fillings and inks, germicidal lamps.'],
  history: 'Bunsen and Kirchhoff turned the spectroscope into a tool of chemical analysis around 1859 and soon found two new elements from their lines: caesium (1860) and rubidium (1861). Balmer fitted the visible hydrogen lines with a formula in 1885, Rydberg generalised it in 1888, and Bohr explained it with quantised levels in 1913.',
  sim: 'atom-hydrogen-spectrum'
},

{
  id: 'quantum-numbers', parent: 'electrons-in-atoms', title: 'Quantum numbers and orbitals', level: 2,
  short: 'Each electron in an atom is described by four quantum numbers: n for the shell and its energy, l for the shape of the orbital, mₗ for its orientation, and mₛ for the electron\'s spin.',
  keywords: ['quantum number', 'principal quantum number', 'angular momentum quantum number', 'azimuthal', 'magnetic quantum number', 'spin quantum number', 'shell', 'subshell', 'orbital', 's p d f', 'degenerate', 'node'],
  prereq: ['atomic-spectra', 'physics:quantum-numbers', 'physics:hydrogen-atom-quantum'],
  related: ['orbital-shapes', 'electron-configuration', 'physics:electron-spin', 'physics:pauli-exclusion', 'physics:schrodinger-equation', 'nmr-spectroscopy'],
  body: `
Bohr pictured the electron in hydrogen on a circular orbit. The picture explains the energy levels but not much else, and it is wrong in detail: an electron is spread out like a wave, with no definite path. Solving the [[physics:schrodinger-equation|Schrödinger equation]] for an electron around a nucleus gives a set of standing-wave patterns called **orbitals**. Each orbital is labelled by three whole numbers, and each electron in it by a fourth — the **quantum numbers**. They are the addresses of electrons, and the periodic table is laid out according to them.

### The four quantum numbers
| symbol | name | allowed values | what it sets |
|---|---|---|---|
| $n$ | principal | 1, 2, 3, … | the **shell**: size and (mainly) energy |
| $l$ | angular momentum | 0, 1, …, $n - 1$ | the **subshell**: the shape |
| $m_l$ | magnetic | $-l, \\dots, 0, \\dots, +l$ | the orientation in space |
| $m_s$ | spin | $+\\tfrac12$ or $-\\tfrac12$ | the spin, "up" or "down" |

The subshells are named by letters inherited from old spectroscopy: $l = 0$ is **s**, 1 is **p**, 2 is **d**, 3 is **f**. So "3d" means $n = 3$, $l = 2$, and its five orbitals have $m_l = -2, -1, 0, 1, 2$.

### Counting
- A subshell with quantum number $l$ has $2l + 1$ orbitals: one s, three p, five d, seven f.
- A shell $n$ contains $n$ subshells and $n^2$ orbitals.
- The **Pauli exclusion principle** says no two electrons in an atom share all four quantum numbers, so an orbital holds at most two electrons, with opposite spins. An s subshell therefore holds 2 electrons, p 6, d 10, f 14, and a whole shell $2n^2$: 2, 8, 18, 32.

Those numbers — 2, 6, 10, 14 — are the widths of the s, p, d and f blocks of the [periodic table](#/tools/periodic). The shape of the table is the arithmetic of quantum numbers.

### Nodes
An orbital is a standing wave, and standing waves have **nodes** where the amplitude is zero. An orbital has $n - 1$ nodes in all: $l$ of them are angular (planes or cones through the nucleus) and $n - l - 1$ are radial (spheres). The 1s orbital has none, 2s one spherical node, 2p one nodal plane, 3d two nodal planes or cones. More nodes means a shorter wavelength, more kinetic energy and a higher level — just as on a guitar string.

### Energy: one-electron and many-electron atoms
In hydrogen the energy depends on $n$ alone: 2s and 2p have the same energy (they are **degenerate**). With more electrons it also depends on $l$, because electrons shield one another and an s electron, which penetrates close to the nucleus, is held more tightly than a p or d electron of the same shell ([[effective-nuclear-charge]]). That is why 2s fills before 2p, and 4s before 3d ([[electron-configuration]]).

> [!note] The spin quantum number has no classical picture: an electron is not a spinning ball. But its magnetic moment is real, and flipping it is what electron spin resonance detects; the same idea for nuclear spins is the basis of [[nmr-spectroscopy|NMR]] and MRI.
`,
  ideas: [
    'n (1, 2, 3 …) labels the shell and fixes its size and main energy.',
    'l (0 to n − 1) labels the subshell s, p, d, f and fixes the orbital\'s shape.',
    'mₗ (−l to +l) gives the orientation: 2l + 1 orbitals in a subshell.',
    'mₛ = ±½ is the spin; by the Pauli principle an orbital holds at most two electrons, of opposite spin.',
    'A shell n has n² orbitals and holds 2n² electrons: 2, 8, 18, 32.'
  ],
  pitfalls: [
    'An orbital is the path the electron follows — An orbital is a wave pattern giving where the electron is likely to be found; the electron has no path.',
    'A 2p subshell can exist with l = 2 — l runs only up to n − 1, so the second shell has only 2s and 2p (l = 0, 1). The first d subshell is 3d.',
    'The three p orbitals of a subshell have different energies — In a free atom they are identical in energy; they differ only in direction. Only a field (an electric or magnetic field, or ligands) splits them.'
  ],
  formulas: [
    {
      name: 'Electrons in a shell',
      expr: 'N = 2*n^2', tex: 'N = 2n^2',
      vars: {
        N: { name: 'maximum number of electrons in the shell', int: true, tex: 'N' },
        n: { name: 'principal quantum number', int: true, value: 3, tex: 'n' }
      },
      note: '$n^2$ orbitals, two electrons each.',
      stories: {
        N: 'What is the largest number of electrons that can have principal quantum number n = {n}?',
        n: 'A shell can hold at most {N} electrons. What is its principal quantum number?'
      }
    },
    {
      name: 'Orbitals in a subshell',
      expr: 'No = 2*l + 1', tex: 'N_o = 2l + 1',
      vars: {
        No: { name: 'number of orbitals in the subshell', int: true, tex: 'N_o' },
        l: { name: 'angular momentum quantum number (s 0, p 1, d 2, f 3)', int: true, value: 2, tex: 'l' }
      },
      note: 'One orbital for each value of $m_l$ from $-l$ to $+l$; twice as many electrons.',
      stories: {
        No: 'How many orbitals does a subshell with l = {l} contain?',
        l: 'A subshell has {No} orbitals. What is its l, and what is its letter?'
      }
    },
    {
      name: 'Radial nodes of an orbital',
      expr: 'nr = n - l - 1', tex: 'n_r = n - l - 1',
      vars: {
        nr: { name: 'number of radial (spherical) nodes', int: true, tex: 'n_r' },
        n: { name: 'principal quantum number', int: true, value: 3, tex: 'n' },
        l: { name: 'angular momentum quantum number', int: true, value: 0, tex: 'l' }
      },
      note: 'There are also $l$ angular nodes, so $n - 1$ nodes in all. Default: the 3s orbital.',
      stories: {
        nr: 'How many spherical nodes does an orbital with n = {n} and l = {l} have?'
      }
    }
  ],
  examples: [
    {
      title: 'All the addresses in the third shell',
      q: 'List the subshells and orbitals of the shell $n = 3$ and find how many electrons it can hold.',
      steps: [
        '$l$ can be 0, 1 or 2: the 3s, 3p and 3d subshells.',
        '3s: $m_l = 0$ (1 orbital). 3p: $m_l = -1, 0, 1$ (3). 3d: $m_l = -2 \\dots 2$ (5).',
        'That is $1 + 3 + 5 = 9 = 3^2$ orbitals. Each takes two electrons of opposite spin: 18 electrons.'
      ],
      a: '3s, 3p, 3d; 9 orbitals; 18 electrons.'
    },
    {
      title: 'Which sets are allowed?',
      q: 'Which of these sets $(n, l, m_l, m_s)$ can describe an electron in an atom? (a) $(2, 1, -1, +\\tfrac12)$; (b) $(3, 3, 0, -\\tfrac12)$; (c) $(4, 2, -3, +\\tfrac12)$; (d) $(1, 0, 0, -\\tfrac12)$.',
      steps: [
        '(a) $l = 1 < 2$ and $|m_l| \\le 1$: allowed, a 2p electron.',
        '(b) $l$ must be less than $n$, so $l = 3$ is impossible for $n = 3$.',
        '(c) $l = 2$ allows $m_l$ only from $-2$ to $+2$; $-3$ is impossible.',
        '(d) Allowed: a 1s electron.'
      ],
      a: '(a) and (d) are allowed.'
    }
  ],
  quiz: [
    { q: 'Which set of quantum numbers $(n, l, m_l)$ is not allowed?', choices: ['(2, 0, 0)', '(2, 1, −1)', '(2, 2, 0)', '(3, 2, 2)'], a: 2,
      why: 'For $n = 2$, $l$ can only be 0 or 1. There is no 2d subshell.' },
    { q: 'How many orbitals are there in a 4f subshell?', choices: ['3', '5', '7', '14'], a: 2,
      why: 'f means $l = 3$, so $2l + 1 = 7$ orbitals — holding 14 electrons, the width of the f-block.' },
    { q: 'What is the maximum number of electrons with $n = 4$?', answer: 32,
      why: '$2n^2 = 32$: 4s (2) + 4p (6) + 4d (10) + 4f (14).' },
    { q: 'In a hydrogen atom the 2s and 2p orbitals have exactly the same energy.', a: true,
      why: 'With a single electron the energy depends on n only. In atoms with more electrons, shielding makes 2s lower than 2p.' },
    { q: 'How many nodes of each kind does a 3p orbital have?', choices: ['1 radial, 1 angular', '2 radial, 0 angular', '0 radial, 2 angular', '1 radial, 2 angular'], a: 0,
      why: '$n - 1 = 2$ nodes in all; $l = 1$ of them angular (a plane), $n - l - 1 = 1$ radial (a sphere).' }
  ],
  applications: ['The layout of the periodic table in blocks of 2, 6, 10 and 14.', 'Electron spin resonance for free radicals; NMR and MRI from nuclear spin.', 'Selection rules that decide which spectral lines are strong, used in lasers and spectroscopy.'],
  sim: { id: 'atom-orbitals', params: { orb: '3d_xy' } }
},

{
  id: 'orbital-shapes', parent: 'electrons-in-atoms', title: 'The shapes of orbitals', level: 2,
  short: 's orbitals are spheres, p orbitals two lobes along an axis, d orbitals mostly four-leaf clovers. The shapes, their sizes and the signs of their lobes decide how atoms bond.',
  keywords: ['orbital shape', 's orbital', 'p orbital', 'd orbital', 'f orbital', 'electron density', 'boundary surface', 'radial distribution', 'node', 'nodal plane', 'phase', 'penetration', 'Bohr radius', 'probability'],
  prereq: ['quantum-numbers', 'physics:wavefunction', 'physics:hydrogen-atom-quantum'],
  related: ['hybridization', 'sigma-pi-bonds', 'molecular-orbitals', 'crystal-field-theory', 'effective-nuclear-charge'],
  body: `
An orbital is a wave, $\\psi$, spread through the space around the nucleus. Its square, $\\psi^2$, is the **probability density**: where it is large, the electron is likely to be found. Chemists draw orbitals in two ways — as a **cloud** of dots, dense where $\\psi^2$ is large, or as a **boundary surface** that encloses, say, 90 % of the probability. The shape is what matters, because it decides which way an atom can bond.

### s orbitals: spheres
Every s orbital is spherically symmetric. The 1s density is highest at the nucleus itself and falls off exponentially. The 2s orbital is larger and has one spherical **node** inside it, a shell where the electron is never found; 3s has two. Each new shell's s orbital is bigger — the size grows roughly as $n^2$.

### p orbitals: two lobes
A p orbital has two lobes on opposite sides of the nucleus, along one axis, with a **nodal plane** through the nucleus between them. There are three, $p_x$, $p_y$ and $p_z$, at right angles. The two lobes have opposite **signs** (phases) of $\\psi$ — not charges, but like the up and down halves of a vibrating string. Signs matter when orbitals on two atoms overlap: same-sign overlap builds up electron density between the nuclei and makes a bond; opposite-sign overlap cancels it ([[sigma-pi-bonds]], [[molecular-orbitals]]).

### d and f orbitals
Four of the five d orbitals look like four-leaf clovers with two nodal planes: $d_{xy}$, $d_{xz}$ and $d_{yz}$ point *between* the axes, $d_{x^2-y^2}$ points *along* $x$ and $y$. The fifth, $d_{z^2}$, is a dumbbell along $z$ with a doughnut round its waist. The difference between pointing at and between the axes is the whole of [[crystal-field-theory]]: in an octahedral complex the ligands sit on the axes, so $d_{x^2-y^2}$ and $d_{z^2}$ are pushed up in energy — which gives transition-metal compounds their colours. The f orbitals have three angular nodes and are buried deep inside the atom, which is why the lanthanides are so alike chemically.

### How far out is the electron?
The density $\\psi^2$ of a 1s electron is largest at the nucleus, but there is very little volume there. The chance of finding the electron at a distance between $r$ and $r + dr$ is the **radial distribution**,
$$P(r) = 4\\pi r^2 \\psi^2$$
For hydrogen 1s it peaks at the Bohr radius $a_0 = 52.9$ pm. The electron is within 71 pm half the time and within 141 pm 90 % of the time; it has no sharp edge. Radial distributions of 2s and 3s show a small hump close to the nucleus, inside the main one — they **penetrate** the inner electrons more than 2p or 3d do. Penetrating electrons feel more of the nuclear charge, so in many-electron atoms s lies below p, and p below d, of the same shell.

> [!tip] Orbitals with the same $l$ have the same shape whatever the atom. What changes is the size: a 2p orbital of fluorine is much smaller than one of boron, because fluorine's nucleus pulls harder ([[effective-nuclear-charge]]).
`,
  ideas: [
    'An orbital\'s square gives the probability density of the electron; it is drawn as a cloud or a 90 % boundary surface.',
    's orbitals are spherical, p orbitals have two lobes and a nodal plane, most d orbitals have four lobes.',
    'The lobes of p and d orbitals have opposite signs of ψ; bonding needs overlap of matching signs.',
    'The radial distribution 4πr²ψ² of hydrogen 1s peaks at a₀ = 52.9 pm.',
    's electrons penetrate closer to the nucleus than p or d electrons of the same shell, so they lie lower in energy.'
  ],
  pitfalls: [
    'The + and − signs on orbital lobes are charges — They are the sign of the wavefunction, a phase. The electron density ψ² is positive everywhere; the sign only matters when waves on two atoms combine.',
    'Each lobe of a p orbital holds one electron — The two lobes are one orbital; one electron occupies both at once, and the orbital can hold two electrons.',
    'The most likely place to find a 1s electron is at a₀ — The density ψ² is greatest at the nucleus. It is the most likely distance (summed over a whole shell) that is a₀.'
  ],
  derivation: {
    title: 'Where the 1s electron is most likely to be',
    steps: [
      { text: 'The hydrogen 1s wavefunction falls off exponentially from the nucleus:', tex: '\\psi_{1s} = \\frac{1}{\\sqrt{\\pi a_0^3}}\\, e^{-r/a_0}' },
      { text: 'A thin spherical shell of radius $r$ and thickness $dr$ has volume $4\\pi r^2 dr$, so the probability of finding the electron in it is', tex: 'P(r)\\,dr = 4\\pi r^2 \\psi^2\\, dr = \\frac{4}{a_0^3}\\, r^2 e^{-2r/a_0}\\, dr' },
      { text: 'The $r^2$ grows while the exponential shrinks; the maximum is where the derivative vanishes:', tex: '\\frac{dP}{dr} = \\frac{4}{a_0^3}\\left(2r - \\frac{2r^2}{a_0}\\right) e^{-2r/a_0} = 0' },
      { text: 'Apart from $r = 0$, this gives', tex: 'r = a_0 = 52.9\\ \\mathrm{pm}' },
      { text: 'Integrating $P$ from 0 to $r$ gives the probability of finding the electron inside a sphere of radius $r$:', tex: 'P_{<r} = 1 - e^{-2r/a_0}\\left(1 + \\frac{2r}{a_0} + \\frac{2r^2}{a_0^2}\\right)' }
    ]
  },
  formulas: [
    {
      name: 'Probability of finding a hydrogen 1s electron within a radius',
      expr: 'P = 1 - exp(-2*r/a0)*(1 + 2*r/a0 + 2*(r/a0)^2)', tex: 'P = 1 - e^{-2r/a_0}\\left(1 + \\frac{2r}{a_0} + \\frac{2r^2}{a_0^2}\\right)',
      vars: {
        P: { name: 'probability of being inside the sphere', q: 'ratio', unit: '%', min: 0, max: 100, tex: 'P' },
        r: { name: 'radius of the sphere', q: 'length', unit: 'pm', value: 141, tex: 'r' },
        a0: { const: 'a0' }
      },
      note: 'Solve for $r$ to find the size of a boundary surface: 50 % lies within 71 pm, 90 % within 141 pm, 99 % within 222 pm.',
      practice: { unknowns: ['P', 'r'] },
      stories: {
        P: 'What is the probability of finding the electron of a hydrogen atom in its ground state within {r} of the nucleus?',
        r: 'How large a sphere around the nucleus of a hydrogen atom contains the 1s electron with a probability of {P}?'
      }
    },
    {
      name: 'Most probable radius of an orbital with l = n − 1',
      expr: 'r = n^2*a0/Z', tex: 'r = \\frac{n^2 a_0}{Z}',
      vars: {
        r: { name: 'most probable distance from the nucleus', q: 'length', unit: 'pm', tex: 'r' },
        n: { name: 'principal quantum number', int: true, value: 2, tex: 'n' },
        a0: { const: 'a0' },
        Z: { name: 'nuclear charge', int: true, value: 1, tex: 'Z' }
      },
      note: 'Exact for 1s, 2p, 3d, 4f … of one-electron atoms: the size grows as $n^2$ and shrinks as the nuclear charge grows. In many-electron atoms, use the effective nuclear charge for $Z$ as an estimate.',
      practice: { unknowns: ['r', 'n'] },
      stories: {
        r: 'At what distance is a 2p-type electron (n = {n}) most likely to be found around a nucleus of charge {Z}?'
      }
    }
  ],
  examples: [
    {
      title: 'How big is a hydrogen atom?',
      q: 'Find the probability that the electron of a ground-state hydrogen atom lies within 100 pm of the nucleus.',
      steps: [
        '$x = r/a_0 = 100/52.92 = 1.890$.',
        { text: 'Substitute:', tex: 'P = 1 - e^{-3.780}\\,(1 + 3.780 + 7.143) = 1 - 0.02282 \\times 11.92 = 0.728' },
        'About 73 %. There is no radius that contains the electron with certainty, which is why atomic "sizes" are always defined by some convention ([[atomic-radius]]).'
      ],
      a: 'About 73 %.'
    },
    {
      title: 'A 1s electron in helium ion',
      q: 'How far from the nucleus is the 1s electron of $\\ce{He+}$ most likely to be, compared with hydrogen?',
      steps: [
        'The formula $r = n^2 a_0/Z$ with $n = 1$, $Z = 2$ gives $r = a_0/2 = 26.5$ pm.',
        'Twice the nuclear charge pulls the orbital in to half the size — and binds it four times as strongly (54.4 eV instead of 13.6 eV).'
      ],
      a: '26.5 pm, half the hydrogen value.'
    }
  ],
  quiz: [
    { q: 'Where is the nodal plane of a $2p_z$ orbital?', choices: ['the xy plane', 'the xz plane', 'the yz plane', 'a sphere around the nucleus'], a: 0,
      why: 'The $p_z$ lobes lie along the z axis, above and below the nucleus; between them, the plane z = 0 — the xy plane — is a node.' },
    { q: 'How many spherical (radial) nodes does a 3s orbital have?', choices: ['0', '1', '2', '3'], a: 2,
      why: '$n - l - 1 = 3 - 0 - 1 = 2$. For hydrogen they lie at about 1.9 and 7.1 Bohr radii.' },
    { q: 'Which d orbital points along the x and y axes rather than between them?', choices: ['$d_{xy}$', '$d_{xz}$', '$d_{x^2-y^2}$', '$d_{yz}$'], a: 2,
      why: '$d_{x^2-y^2}$ has its four lobes on the x and y axes; $d_{xy}$ has the same shape turned by 45°, pointing between them. The difference decides their energies in a complex.' },
    { q: 'A p orbital holds one electron in each of its two lobes.', a: false,
      why: 'The two lobes are one orbital. A single electron is described by the whole of it; the orbital holds up to two electrons, both spread over both lobes.' },
    { q: 'Why do 2s electrons have lower energy than 2p electrons in a lithium atom?', choices: ['2s is a smaller orbital', '2s penetrates inside the 1s electrons and feels more of the nuclear charge', '2p electrons repel each other', 'the 2p orbitals are empty'], a: 1,
      why: 'The 2s radial distribution has a small inner hump close to the nucleus, inside the 1s shell, where the shielding is weak. On average it sees a larger effective nuclear charge than 2p, so it is held more tightly.' }
  ],
  applications: ['Predicting bond directions and molecular shapes (hybrid orbitals).', 'Crystal field splitting and the colours of gemstones, pigments and complexes.', 'Scanning tunnelling microscopy, which images the orbitals of surface atoms.', 'Quantum-chemistry programs that build molecular orbitals from atomic ones.'],
  sim: { id: 'atom-orbitals', params: { orb: '2p_z' } }
},

{
  id: 'electron-configuration', parent: 'electrons-in-atoms', title: 'Electron configuration', level: 2,
  short: 'The ground-state arrangement of an atom\'s electrons in its orbitals, built up one electron at a time: lowest energy first (aufbau), two per orbital with opposite spins (Pauli), singly before pairing (Hund).',
  keywords: ['electron configuration', 'aufbau principle', 'Madelung rule', 'n + l rule', 'Hund\'s rule', 'Pauli exclusion principle', 'orbital diagram', 'noble gas core', 'unpaired electrons', 'paramagnetic', 'diamagnetic', 'chromium copper exception', 'transition metal ions'],
  prereq: ['quantum-numbers', 'orbital-shapes', 'physics:pauli-exclusion'],
  related: ['valence-electrons', 'periodic-table', 'effective-nuclear-charge', 'ionization-energy', 'crystal-field-theory', 'physics:electron-spin'],
  body: `
To find how the electrons of an atom are arranged, imagine building it: add protons to the nucleus one at a time and drop in an electron each time. Each new electron takes the lowest-energy place still free. The result, the **electron configuration**, explains the periodic table, the charges of ions, the colours and magnetism of transition-metal compounds, and why some elements react and others do not.

### Three rules
1. **Aufbau** ("building up"): fill orbitals in order of increasing energy.
2. **Pauli**: at most two electrons per orbital, with opposite spins.
3. **Hund**: in a set of orbitals of equal energy (the three 2p, the five 3d), electrons go in **singly with parallel spins** before any pair up. Electrons in separate orbitals repel less, and parallel spins lower the energy further.

The filling order follows the **$n + l$ rule**: lower $n + l$ first; for equal $n + l$, lower $n$ first.
$$\\text{1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p}$$
4s ($n + l = 4$) comes before 3d (5) because the penetrating 4s electron is held more tightly at the moment it is added.

### Writing configurations
Oxygen, 8 electrons: 1s² 2s² 2p⁴. The superscripts count electrons. Inner shells that match a noble gas are abbreviated: sodium is 1s² 2s² 2p⁶ 3s¹ or **[Ne] 3s¹**, iron [Ar] 3d⁶ 4s². An **orbital diagram** draws each orbital as a box and each electron as an arrow; for oxygen's 2p it shows one pair and two single, parallel electrons — two **unpaired electrons**.

### Exceptions
3d and 4s are so close in energy that small effects decide. Chromium is [Ar] 3d⁵ 4s¹, not 3d⁴ 4s², and copper is [Ar] 3d¹⁰ 4s¹, not 3d⁹ 4s²: a half-filled or filled d subshell, with its many parallel spins or its symmetry, is worth moving one electron for. Several heavier transition metals and f-block elements break the simple order too (palladium is [Kr] 4d¹⁰ with no 5s electron). Do not memorise a rule for these beyond Cr and Cu; the [periodic table](#/tools/periodic) in Tools lists the measured configurations.

### Ions
- **Anions** add electrons to the next free orbital: $\\ce{O^2-}$ is 1s² 2s² 2p⁶ = [Ne].
- **Cations** lose electrons from the **outermost shell first** — the highest $n$ — not in reverse filling order. Transition metals therefore lose their 4s electrons before 3d: $\\ce{Fe}$ [Ar] 3d⁶ 4s², $\\ce{Fe^2+}$ [Ar] 3d⁶, $\\ce{Fe^3+}$ [Ar] 3d⁵. Once the 3d orbitals are occupied they lie *below* 4s, so this is not a contradiction. The half-filled 3d⁵ of $\\ce{Fe^3+}$ and $\\ce{Mn^2+}$ is especially stable, which is part of why iron rusts to iron(III).

### Magnetism
Paired electrons cancel each other's magnetism; unpaired ones do not. A substance with unpaired electrons is **paramagnetic** and is drawn into a magnetic field; one with all electrons paired is **diamagnetic** and is weakly pushed out. For many transition-metal ions the magnetic moment is close to the **spin-only** value
$$\\mu = \\sqrt{n(n + 2)}\\;\\mu_B$$
where $n$ is the number of unpaired electrons and $\\mu_B$ the Bohr magneton. Weighing a sample in a magnetic field gives $\\mu$, hence $n$, hence the configuration — a classic test of [[crystal-field-theory]]. Gadolinium(III), with seven unpaired 4f electrons, is so strongly paramagnetic that its complexes are used as MRI contrast agents.
`,
  ideas: [
    'Electrons fill the lowest available orbitals first, in the order given by the n + l rule: 1s 2s 2p 3s 3p 4s 3d 4p …',
    'Each orbital takes at most two electrons with opposite spins (Pauli).',
    'Equal-energy orbitals are filled singly with parallel spins before pairing (Hund).',
    'Cr and Cu take one electron from 4s to reach half-filled 3d⁵ and filled 3d¹⁰.',
    'Transition-metal atoms lose their 4s electrons before 3d when they form ions.'
  ],
  pitfalls: [
    'Iron(II) is [Ar] 3d⁴ 4s² because 4s filled first — Cations lose the outermost (highest n) electrons first. Fe²⁺ is [Ar] 3d⁶.',
    'Two electrons in the three 2p orbitals share one orbital — Hund\'s rule puts them in separate orbitals with parallel spins, so carbon has two unpaired electrons.',
    'The filling order is the energy order in every atom — The order describes which orbital receives the next electron as elements are built up. Once filled, inner d orbitals lie below the outer s orbital, which is why 4s electrons are lost first.'
  ],
  formulas: [
    {
      name: 'Spin-only magnetic moment',
      expr: 'mu = muB*sqrt(n*(n + 2))', tex: '\\mu = \\mu_B\\sqrt{n(n + 2)}',
      vars: {
        mu: { name: 'magnetic moment', q: 'mdipole', unit: 'µB', tex: '\\mu' },
        muB: { const: 'muB' },
        n: { name: 'number of unpaired electrons', int: true, value: 5, tex: 'n' }
      },
      note: 'Good for ions of the first transition series, where the orbital contribution is mostly quenched. $n$ = 1 to 5 gives 1.73, 2.83, 3.87, 4.90 and 5.92 $\\mu_B$. Default: $\\ce{Fe^3+}$ or $\\ce{Mn^2+}$, 3d⁵.',
      stories: {
        mu: 'An ion has {n} unpaired electrons. What is its spin-only magnetic moment?',
        n: 'A complex of an iron ion has a measured magnetic moment of {mu}. How many unpaired electrons does it have?'
      }
    }
  ],
  examples: [
    {
      title: 'Iron and its ions',
      q: 'Write the configurations of $\\ce{Fe}$, $\\ce{Fe^2+}$ and $\\ce{Fe^3+}$ and predict their spin-only magnetic moments.',
      steps: [
        '$\\ce{Fe}$ ($Z = 26$): 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s² = [Ar] 3d⁶ 4s². The six 3d electrons fill five orbitals singly, then one pairs: 4 unpaired.',
        '$\\ce{Fe^2+}$: remove the two 4s electrons: [Ar] 3d⁶, still 4 unpaired: $\\mu = \\sqrt{24} = 4.90\\,\\mu_B$.',
        '$\\ce{Fe^3+}$: remove one 3d electron too: [Ar] 3d⁵, one electron in each d orbital, 5 unpaired: $\\mu = \\sqrt{35} = 5.92\\,\\mu_B$.'
      ],
      a: 'Fe [Ar] 3d⁶ 4s²; Fe²⁺ [Ar] 3d⁶ (4.90 μB); Fe³⁺ [Ar] 3d⁵ (5.92 μB).'
    },
    {
      title: 'Sulfur, step by step',
      q: 'Write the configuration and orbital diagram of sulfur, and state how many unpaired electrons it has.',
      steps: [
        '16 electrons: 1s² 2s² 2p⁶ 3s² 3p⁴ = [Ne] 3s² 3p⁴.',
        'Hund\'s rule in 3p: the first three electrons go into $p_x$, $p_y$, $p_z$ singly; the fourth pairs up in one of them.',
        'So 3p holds one pair and two unpaired electrons, parallel.'
      ],
      a: '[Ne] 3s² 3p⁴, two unpaired electrons.'
    }
  ],
  quiz: [
    { q: 'What is the ground-state configuration of copper ($Z = 29$)?', choices: ['[Ar] 3d⁹ 4s²', '[Ar] 3d¹⁰ 4s¹', '[Ar] 4s² 4p⁶ 3d¹', '[Ar] 3d¹¹'], a: 1,
      why: 'Copper moves one 4s electron into 3d to complete the subshell: [Ar] 3d¹⁰ 4s¹. The simple filling order would predict 3d⁹ 4s².' },
    { q: 'Which is the configuration of $\\ce{Co^2+}$ ($Z = 27$)?', choices: ['[Ar] 3d⁵ 4s²', '[Ar] 3d⁷', '[Ar] 3d⁶ 4s¹', '[Ar] 3d⁹'], a: 1,
      why: 'Cobalt is [Ar] 3d⁷ 4s². The ion loses the outermost 4s electrons first, leaving [Ar] 3d⁷.' },
    { q: 'How many unpaired electrons does a phosphorus atom have in its ground state?', answer: 3,
      why: '[Ne] 3s² 3p³: by Hund\'s rule the three 3p electrons occupy the three p orbitals singly, with parallel spins.' },
    { q: 'What is the spin-only magnetic moment, in Bohr magnetons, of $\\ce{Ni^2+}$ (3d⁸)?', answer: 2.83, unit: 'µB',
      why: 'Eight electrons in five d orbitals: five singly, then three pair up, leaving 2 unpaired. $\\sqrt{2 \\times 4} = 2.83\\,\\mu_B$.' },
    { q: 'The zinc ion $\\ce{Zn^2+}$ is diamagnetic.', a: true,
      why: 'Zinc is [Ar] 3d¹⁰ 4s²; the ion is [Ar] 3d¹⁰ with every electron paired. That is also why zinc compounds are colourless: a full d subshell leaves no d–d transition.' }
  ],
  applications: ['Predicting the charges of ions and the formulas of compounds.', 'Magnetic measurements on transition-metal complexes and catalysts.', 'MRI contrast agents built on gadolinium(III) with seven unpaired electrons.', 'Semiconductor doping: phosphorus (5 valence electrons) and boron (3) in silicon (4).'],
  sim: { id: 'atom-aufbau', params: { z: 26 } }
},

{
  id: 'valence-electrons', parent: 'electrons-in-atoms', title: 'Valence electrons and Lewis symbols', level: 1,
  short: 'The valence electrons are those in the outermost shell, the ones an atom loses, gains or shares when it bonds. A Lewis symbol shows them as dots around the element symbol.',
  keywords: ['valence electron', 'core electron', 'outer shell', 'Lewis symbol', 'electron dot', 'octet rule', 'duet', 'noble gas configuration', 'valency', 'combining power', 'ion charge', 'group number'],
  prereq: ['electron-configuration', 'periodic-table'],
  related: ['lewis-structures', 'ionic-bonding', 'covalent-bonds', 'oxidation-numbers', 'formal-charge', 'ionization-energy'],
  body: `
Of the 17 electrons in a chlorine atom, only 7 take part in chemistry. The ten in the inner shells (1s² 2s² 2p⁶, the neon core) are held so tightly, and are so shielded from the outside, that no ordinary reaction disturbs them. The seven in the outer shell, 3s² 3p⁵, are the **valence electrons**: they are lost, gained or shared when atoms bond, and they decide an element's chemistry.

### Counting valence electrons
For main-group (s- and p-block) elements the valence electrons are those in the shell with the highest $n$, and their number follows from the group of the [periodic table](#/tools/periodic):

| group | 1 | 2 | 13 | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|---|---|---|
| valence electrons | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 (He 2) |
| outer configuration | ns¹ | ns² | ns² np¹ | ns² np² | ns² np³ | ns² np⁴ | ns² np⁵ | ns² np⁶ |

That is why elements in a group behave alike: sodium and potassium both have one valence electron, fluorine and chlorine both have seven. For transition metals the $(n-1)$d electrons are close enough in energy to the $n$s ones to take part as well, which gives them several oxidation states.

### Lewis symbols
G. N. Lewis wrote each valence electron as a dot around the element's symbol, one on each of four sides before any pairing — the same idea as Hund's rule. Carbon has four single dots, nitrogen one pair and three singles, oxygen two pairs and two singles, fluorine three pairs and one single, neon four pairs. The **single dots** are the electrons available to pair up in covalent bonds, so the Lewis symbol predicts the usual number of bonds: carbon 4 ($\\ce{CH4}$), nitrogen 3 ($\\ce{NH3}$), oxygen 2 ($\\ce{H2O}$), fluorine 1 ($\\ce{HF}$). These symbols are the building blocks of [[lewis-structures]].

### The octet rule
Noble gases, with a full $n$s² $n$p⁶ outer shell (an **octet**), are almost inert. Atoms of other main-group elements tend to lose, gain or share electrons until they reach the same arrangement:
- Metals on the left lose their few valence electrons: $\\ce{Na -> Na+ + e-}$ leaves [Ne]; magnesium forms $\\ce{Mg^2+}$, aluminium $\\ce{Al^3+}$.
- Non-metals on the right gain electrons: chlorine becomes $\\ce{Cl-}$ [Ar], oxygen $\\ce{O^2-}$, nitrogen $\\ce{N^3-}$.
- Or they share electrons in covalent bonds, each atom counting the shared pairs towards its octet.

Hydrogen, lithium and beryllium aim for the helium **duet** instead. The ion charges predict formulas: aluminium and oxygen give $\\ce{Al2O3}$ (two 3+ balanced by three 2−), calcium and phosphorus give $\\ce{Ca3P2}$.

### Where the rule bends
The octet rule is a guide, not a law. Boron in $\\ce{BF3}$ has only six electrons round it; elements from period 3 down can hold more than eight ($\\ce{SF6}$, $\\ce{PCl5}$); molecules with an odd number of electrons, like $\\ce{NO}$ and $\\ce{NO2}$, cannot pair them all. Transition-metal ions such as $\\ce{Fe^3+}$ or $\\ce{Cu^2+}$ rarely reach a noble-gas configuration at all.

> [!tip] To count the valence electrons of a molecule or ion for a Lewis structure, add up those of the atoms and then subtract the charge: $\\ce{SO4^2-}$ has $6 + 4 \\times 6 + 2 = 32$.
`,
  ideas: [
    'Valence electrons are those in the outermost shell; inner (core) electrons do not take part in bonding.',
    'For main-group elements the number of valence electrons equals the group number (groups 1–2) or the group number minus 10 (groups 13–18).',
    'Lewis symbols show valence electrons as dots; the unpaired dots predict the usual number of bonds.',
    'Main-group atoms tend to reach a noble-gas octet by losing, gaining or sharing electrons.',
    'Ion charges from the octet rule predict the formulas of ionic compounds.'
  ],
  pitfalls: [
    'All electrons in the atom are valence electrons — Only the outer ones. Chlorine has 17 electrons but 7 valence electrons; its inner 10 are the unreactive neon core.',
    'Every element obeys the octet rule — Boron is content with six, period-3 and heavier elements can exceed eight, odd-electron molecules cannot pair all their electrons, and transition-metal ions follow other patterns.',
    'Sodium loses an electron because it wants a full shell — Removing the electron costs energy (496 kJ/mol). Ionic compounds form because the attraction between the ions afterwards releases even more ([[lattice-energy]]).'
  ],
  examples: [
    {
      title: 'Formulas from valence electrons',
      q: 'Predict the formulas of the compounds formed by (a) magnesium and nitrogen, (b) aluminium and sulfur.',
      steps: [
        '(a) Magnesium (group 2) loses 2 electrons: $\\ce{Mg^2+}$. Nitrogen (group 15) gains 3: $\\ce{N^3-}$. Balance the charges: 3 × (+2) = 2 × (−3), so $\\ce{Mg3N2}$.',
        '(b) Aluminium (group 13) gives $\\ce{Al^3+}$, sulfur (group 16) gives $\\ce{S^2-}$: 2 × (+3) = 3 × (−2), so $\\ce{Al2S3}$.'
      ],
      a: '$\\ce{Mg3N2}$ and $\\ce{Al2S3}$.'
    },
    {
      title: 'Valence electrons of an ion',
      q: 'How many valence electrons must a Lewis structure of the carbonate ion, $\\ce{CO3^2-}$, contain?',
      steps: [
        'Carbon (group 14) brings 4, each oxygen (group 16) 6: $4 + 3 \\times 6 = 22$.',
        'The charge of −2 means two extra electrons: $22 + 2 = 24$.'
      ],
      a: '24 valence electrons.'
    }
  ],
  quiz: [
    { q: 'How many valence electrons does a selenium atom ($\\ce{Se}$, group 16) have?', choices: ['2', '4', '6', '34'], a: 2,
      why: 'Selenium is [Ar] 3d¹⁰ 4s² 4p⁴. The full 3d subshell counts as core; the six 4s and 4p electrons are the valence electrons, as for every group-16 element.' },
    { q: 'An element\'s Lewis symbol has three single dots and no pairs. Which group is it in?', choices: ['group 3', 'group 13', 'group 15', 'group 17'], a: 1,
      why: 'Three valence electrons, placed singly: boron or aluminium, group 13. Group 15 has five dots (one pair and three singles).' },
    { q: 'Which particle has a noble-gas configuration?', choices: ['$\\ce{Na}$', '$\\ce{Ca^2+}$', '$\\ce{Fe^2+}$', '$\\ce{O-}$'], a: 1,
      why: 'Calcium loses its two 4s electrons to reach [Ar]. Iron(II) is [Ar] 3d⁶, and $\\ce{O-}$ still needs one more electron to reach [Ne].' },
    { q: 'How many valence electrons are there in the nitrate ion, $\\ce{NO3-}$?', answer: 24,
      why: '$5 + 3 \\times 6 + 1 = 24$: nitrogen 5, three oxygens 18, one extra for the negative charge.' },
    { q: 'Nitrogen usually forms three covalent bonds because it has three unpaired valence electrons.', a: true,
      why: 'Nitrogen\'s Lewis symbol has one lone pair and three single electrons; each single electron pairs with one from another atom, as in $\\ce{NH3}$ and $\\ce{NF3}$.' }
  ],
  applications: ['Predicting formulas of salts, minerals and ceramics.', 'Doping semiconductors: phosphorus adds a fifth valence electron to silicon, boron leaves a hole.', 'Drawing Lewis structures to predict shapes and reactivity.'],
  sim: { id: 'atom-aufbau', params: { z: 7 } }
}

);
