/* HYPER-FEYNMAN · content/waves-in-matter.js — Waves in matter (FLP III-13 to III-21): electrons in a crystal
 * lattice, semiconductors, the Schrödinger equation, tunnelling, angular momentum, the hydrogen atom and the
 * periodic table, operators and superconductivity. Simulations in sims/waves-in-matter.js (prefix wim-). */
Hyper.add(

{
  id: 'electrons-in-crystals', parent: 'waves-in-matter', title: 'Electrons in a crystal lattice', level: 3,
  short: 'An electron in a crystal does not sit on one atom: it has an amplitude to hop to each neighbour, and its states of definite energy are waves of amplitude running through the whole lattice. Their energies form a band, E = E₀ − 2A cos kb, and a wave packet glides through a perfect crystal without scattering.',
  keywords: ['tight binding', 'energy band', 'band structure', 'lattice', 'hopping amplitude', 'Bloch wave', 'effective mass', 'group velocity', 'wave packet', 'crystal momentum', 'impurity scattering', 'bound state', 'Brillouin zone'],
  prereq: ['hamiltonian-matrix', 'two-state-systems', 'amplitudes-in-time'],
  related: ['semiconductors-feyn', 'schrodinger-equation-feyn', 'beats-feyn', 'crystal-geometry', 'ammonia-maser', 'physics:band-theory', 'physics:crystal-structure', 'math:eigenvalues'],
  body: `
Feynman reached the waves of electrons in solids not from a wave equation but from the two-state systems before it, simply by adding more states. Picture a long, perfectly regular row of identical atoms a distance $b$ apart, and one extra electron. The electron can sit near atom $n$ — call that base state $|n\\rangle$ — and it has a small amplitude per unit time, $A/\\hbar$, to hop to either neighbour, because the wave function of a bound electron leaks a little way towards the next atom. Nothing more is needed.

### The hopping equations
Let $C_n(t)$ be the [[?amplitude]] to find the electron at atom $n$. The [[?matrix|Hamiltonian matrix]] has the same energy $E_0$ on every diagonal element and $-A$ between neighbours, so every amplitude obeys

$$i\\hbar\\frac{dC_n}{dt} = E_0 C_n - A\\,C_{n-1} - A\\,C_{n+1}$$

— the same kind of equation as for the ammonia molecule, but an endless chain of them, each coupled to the next.

### Try a wave
Every atom is like every other, so guess amplitudes of the same size everywhere with a [[?phase]] that advances steadily from atom to atom: $C_n = e^{ikx_n}e^{-iEt/\\hbar}$ with $x_n = nb$. Put it in, divide by $C_n$, and the atom number drops out:

$$E = E_0 - A\\left(e^{ikb} + e^{-ikb}\\right) = E_0 - 2A\\cos kb$$

Every $k$ gives a state of definite energy — a wave of amplitude running through the whole crystal. The energies fill a **band** from $E_0 - 2A$ to $E_0 + 2A$, of width $4A$. Only $k$ between $-\\pi/b$ and $\\pi/b$ is needed: the amplitudes exist only at the atoms, so $k$ and $k + 2\\pi/b$ describe the same state.

| $kb$ | energy | the arrows at the atoms |
|---|---|---|
| 0 | $E_0 - 2A$ (bottom) | all point the same way |
| $\\pi/2$ | $E_0$ (middle) | a quarter-turn from atom to atom |
| $\\pi$ | $E_0 + 2A$ (top) | alternate: up, down, up |

### A particle with a new mass
Near the bottom of the band $kb$ is small and $\\cos kb \\approx 1 - (kb)^2/2$ (a [[?small-approximation|small-angle approximation]]), so $E \\approx E_0 - 2A + Ab^2k^2$. That is the energy of a free particle, $\\hbar^2k^2/2m$, with an **effective mass** $m_{\\text{eff}} = \\hbar^2/(2Ab^2)$. With $A = 1$ eV and $b = 0.3$ nm it is 0.42 electron masses: the electron moves through the crystal as if it were lighter than in empty space. Near the top of the band the curvature is reversed and the effective mass is negative — the seed of the *hole* of [[semiconductors-feyn|semiconductors]].

### Packets move — and perfect crystals do not scatter
To make an electron that is *somewhere*, add waves with a small spread of $k$: a wave packet. It moves at the group velocity $v = \\frac{1}{\\hbar}\\frac{dE}{dk} = \\frac{2Ab}{\\hbar}\\sin kb$, the slope of the band (the rule of [[beats-feyn|beats and group velocity]]). For the numbers above, the fastest packet, at $kb = \\pi/2$, moves at $9\\times10^5$ m/s. The result is startling: an electron in a perfect lattice passes billions of atoms without bouncing off any of them. Resistance comes only from imperfections — impurity atoms, missing atoms, and the thermal jiggling that makes the lattice imperfect at every instant.

An impurity is an atom whose energy is $E_0 + F$ instead of $E_0$. A wave arriving at it is partly reflected; the transmitted fraction is $T = 4A^2\\sin^2 kb/(4A^2\\sin^2 kb + F^2)$, so slow electrons near the band edges bounce most. An attractive impurity ($F < 0$) can also *trap* an electron in a bound state just below the band, at $E_0 - \\sqrt{4A^2 + F^2}$.

> [!key] In a periodic lattice the stationary states of an electron are waves spread over the whole crystal. Their energies form a band of width $4A$; packets move at the slope of the band and pass through a perfect crystal without scattering.

### What to look for in the simulation
Launch a packet at $kb = \\pi/2$ and watch the arrows turn a quarter-turn from atom to atom as it glides along; near $kb = \\pi$ it hardly moves, and at $kb = 0$ it only spreads. Start the electron on a single atom: it leaks out both ways at once, because every $k$ is present. Switch on the impurity and a packet splits into a reflected and a transmitted part. In three dimensions the band becomes $E_0 - 2A_x\\cos k_xa - 2A_y\\cos k_yb - 2A_z\\cos k_zc$, and each atomic state gives its own band, with gaps between them — the start of every theory of metals, insulators and semiconductors.
`,
  ideas: [
    'An electron in a lattice has an amplitude A/ħ per unit time to hop to each neighbouring atom.',
    'The states of definite energy are waves C_n ∝ e^{iknb}, with energies E = E₀ − 2A cos kb: a band of width 4A.',
    'Near the bottom of the band the electron behaves like a free particle of effective mass ħ²/(2Ab²).',
    'A wave packet moves at the group velocity (1/ħ) dE/dk and passes through a perfect lattice without scattering.',
    'Imperfections scatter the waves, and an attractive impurity can trap an electron in a bound state below the band.'
  ],
  pitfalls: [
    'The electron is scattered by every atom it passes — In a perfectly periodic lattice the stationary states are waves through the whole crystal; only departures from periodicity (impurities, defects, vibrations) scatter them.',
    'The effective mass is the real mass of the electron changed by the crystal — The electron is unchanged; m_eff only says how its energy depends on k in this band, and it can even be negative near the top of a band.',
    'Larger k always means a faster electron — The speed is the slope of the band, (2Ab/ħ) sin kb: it is greatest at kb = π/2 and falls to zero at the top of the band.'
  ],
  derivation: {
    title: 'From hopping amplitudes to an energy band',
    steps: [
      { text: 'Write the equation for the amplitude at atom $n$: it changes because of its own energy and because of the amplitudes next door.', tex: 'i\\hbar\\,\\dot{C}_n = E_0C_n - AC_{n-1} - AC_{n+1}' },
      { text: 'Guess a wave whose phase advances by $kb$ from one atom to the next, all of it oscillating at one frequency $E/\\hbar$.', tex: 'C_n = e^{iknb}\\,e^{-iEt/\\hbar}' },
      { text: 'Differentiating the time factor brings down $-iE/\\hbar$, so the left side becomes $E\\,C_n$. The neighbours are the same wave shifted by one atom: $C_{n\\pm1} = e^{\\pm ikb}C_n$.', tex: 'E\\,C_n = E_0C_n - A\\left(e^{-ikb} + e^{ikb}\\right)C_n' },
      { text: 'Divide by $C_n$. The atom number drops out, so the guess works at every atom at once; [[?euler-formula|Euler\'s formula]] turns the two exponentials into a cosine.', tex: 'E = E_0 - 2A\\cos kb' },
      { text: 'For small $kb$ keep the first two terms of the cosine\'s [[?taylor-series]] and compare with the free-particle energy $\\hbar^2k^2/2m$.', tex: 'E \\approx (E_0 - 2A) + Ab^2k^2 \\quad\\Rightarrow\\quad m_{\\text{eff}} = \\frac{\\hbar^2}{2Ab^2}' },
      { text: 'A packet travels at the slope of the band: differentiate $E(k)$ and divide by $\\hbar$.', tex: 'v = \\frac{1}{\\hbar}\\frac{dE}{dk} = \\frac{2Ab}{\\hbar}\\sin kb' }
    ]
  },
  formulas: [
    {
      name: 'The energy band of a chain of atoms',
      expr: 'E = E0 - 2*A*cos(k*b)', tex: 'E = E_0 - 2A\\cos kb',
      vars: {
        E: { name: 'energy of the state', q: 'energy', unit: 'eV', signed: true },
        E0: { name: 'energy of the electron sitting on one atom', q: 'energy', unit: 'eV', value: 2, signed: true, tex: 'E_0' },
        A: { name: 'hopping amplitude (as an energy)', q: 'energy', unit: 'eV', value: 1 },
        k: { name: 'wave number', q: 'wavenumber', unit: '1/nm', value: 3, min: 0, max: 10.4 },
        b: { name: 'distance between atoms', q: 'length', unit: 'nm', value: 0.3 }
      },
      note: 'k from 0 to π/b covers every energy (negative k give the same energies, moving the other way). The band runs from E₀ − 2A to E₀ + 2A.',
      stories: {
        E: 'Atoms {b} apart, hopping amplitude {A}, energy on one atom {E0}. What is the energy of the wave with wave number {k}?',
        k: 'In a band with {E0}, {A} and atoms {b} apart, what wave number has the energy {E}?'
      }
    },
    {
      name: 'Effective mass at the bottom of the band',
      expr: 'meff = hbar^2/(2*A*b^2)', tex: 'm_{\\text{eff}} = \\dfrac{\\hbar^2}{2Ab^2}',
      vars: {
        meff: { name: 'effective mass', q: 'mass', unit: 'kg', tex: 'm_{\\text{eff}}' },
        hbar: { const: 'hbar' },
        A: { name: 'hopping amplitude (as an energy)', q: 'energy', unit: 'eV', value: 1 },
        b: { name: 'distance between atoms', q: 'length', unit: 'nm', value: 0.3 }
      },
      note: 'Divide by the electron mass, 9.11 × 10⁻³¹ kg, to compare. Easy hopping and close atoms make a light electron.',
      stories: {
        meff: 'Atoms {b} apart with a hopping amplitude of {A}. What is the effective mass of an electron at the bottom of the band?',
        A: 'An electron moves along a chain of atoms {b} apart with an effective mass of {meff}. What hopping amplitude does that imply?'
      }
    },
    {
      name: 'Group velocity of a wave packet in the band',
      expr: 'v = 2*A*b*sin(k*b)/hbar', tex: 'v = \\dfrac{2Ab}{\\hbar}\\sin kb',
      vars: {
        v: { name: 'speed of the packet', q: 'speed', unit: 'm/s', signed: true },
        A: { name: 'hopping amplitude (as an energy)', q: 'energy', unit: 'eV', value: 1 },
        b: { name: 'distance between atoms', q: 'length', unit: 'nm', value: 0.3 },
        k: { name: 'wave number at the centre of the packet', q: 'wavenumber', unit: '1/nm', value: 2, min: 0, max: 10.4 },
        hbar: { const: 'hbar' }
      },
      note: 'The slope of the band divided by ħ. Largest at kb = π/2; zero at the bottom and at the top of the band.',
      stories: {
        v: 'A packet of wave number {k} moves along a chain with {A} and atoms {b} apart. How fast does it go?',
        k: 'In a chain with {A} and atoms {b} apart, which wave numbers give a packet the speed {v}?'
      }
    }
  ],
  examples: [
    {
      title: 'A lighter (or heavier) electron',
      q: 'A chain has atoms 0.25 nm apart and a hopping amplitude of 0.5 eV. How wide is the band, and what is the effective mass at its bottom?',
      steps: [
        'The band runs from $E_0 - 2A$ to $E_0 + 2A$: its width is $4A = 2$ eV.',
        '$m_{\\text{eff}} = \\hbar^2/(2Ab^2) = (1.055\\times10^{-34})^2 / (2 \\times 0.801\\times10^{-19} \\times (0.25\\times10^{-9})^2) = 1.11\\times10^{-30}$ kg.',
        'Divided by $m_e = 9.11\\times10^{-31}$ kg that is 1.22: weaker hopping than in the text makes the electron heavier than a free one.'
      ],
      a: 'A 2 eV wide band and an effective mass of 1.11 × 10⁻³⁰ kg, about 1.2 electron masses.'
    },
    {
      title: 'How fast through the chain?',
      q: 'With $A = 1$ eV and $b = 0.3$ nm, what is the fastest a packet can move, and how long does it take to pass one atom at that speed?',
      steps: [
        'The speed $v = (2Ab/\\hbar)\\sin kb$ is largest at $kb = \\pi/2$, where $\\sin kb = 1$.',
        '$v_{\\max} = 2 \\times 1.602\\times10^{-19} \\times 0.3\\times10^{-9} / 1.055\\times10^{-34} = 9.1\\times10^{5}$ m/s.',
        'One atomic spacing takes $b/v = 0.3\\times10^{-9}/9.1\\times10^5 = 3.3\\times10^{-16}$ s. At $kb = \\pi/6$ the packet is half as fast.'
      ],
      a: 'About 9 × 10⁵ m/s, passing an atom every 0.3 femtoseconds.'
    },
    {
      title: 'Slow electrons bounce off impurities',
      q: 'An impurity atom has its energy raised by $F = A$. What fraction of a wave is transmitted at $kb = \\pi/2$ and at $kb = 0.2$?',
      steps: [
        'Use $T = 4A^2\\sin^2 kb/(4A^2\\sin^2 kb + F^2)$ with $F = A$: $T = 4\\sin^2 kb/(4\\sin^2 kb + 1)$.',
        'At $kb = \\pi/2$: $T = 4/5 = 0.80$.',
        'At $kb = 0.2$: $\\sin^2 0.2 = 0.0395$, so $T = 0.158/1.158 = 0.14$ — most of a slow wave is reflected.'
      ],
      a: '80 % at the middle of the band, only 14 % near its bottom.'
    }
  ],
  quiz: [
    { q: 'At the bottom of the band ($k = 0$) the amplitudes on neighbouring atoms…', choices: ['all have the same phase', 'alternate in sign', 'turn a quarter-turn from atom to atom', 'are zero on every other atom'], a: 0, why: 'k = 0 means no advance of phase from atom to atom: every arrow points the same way, and E = E₀ − 2A.' },
    { q: 'The atoms are squeezed closer so that $A$ doubles (take $b$ as unchanged). The effective mass at the bottom of the band…', choices: ['halves', 'doubles', 'is unchanged', 'becomes negative'], a: 0, why: 'm_eff = ħ²/(2Ab²): twice the hopping, half the mass. Easier hopping makes the electron lighter.' },
    { q: 'In a perfect, motionless crystal an electron is scattered by every atom it passes, and that is the origin of electrical resistance.', a: false, why: 'The stationary states are waves through the whole lattice, and a packet passes a perfect lattice without scattering. Resistance comes from impurities, defects and lattice vibrations.' },
    { q: 'A wave packet centred on $kb = \\pi$, the top of the band, moves…', choices: ['hardly at all: its group velocity is zero', 'at the greatest possible speed', 'at the speed of light', 'backwards at the greatest speed'], a: 0, why: 'v = (2Ab/ħ) sin kb and sin π = 0: the band is flat at its top.' },
    { q: 'Why do $k$ and $k + 2\\pi/b$ describe the same state?', choices: ['the amplitudes exist only at the atoms, where both give the same phases', 'the energy repeats in time', 'because the electron has spin', 'they do not: they have different energies'], a: 0, why: 'e^{i(k + 2π/b)nb} = e^{iknb} e^{2πin} = e^{iknb} at every atom.' }
  ],
  problems: [
    { q: 'A chain has atoms 0.4 nm apart and a hopping amplitude of 0.8 eV. What is the effective mass at the bottom of the band, in electron masses?', answer: 0.298, tol: 0.02, hint: 'm_eff = ħ²/(2Ab²); then divide by 9.11 × 10⁻³¹ kg.',
      steps: ['$2Ab^2 = 2 \\times 1.282\\times10^{-19} \\times 1.6\\times10^{-19} = 4.10\\times10^{-38}$ J·m².', '$m_{\\text{eff}} = 1.112\\times10^{-68}/4.10\\times10^{-38} = 2.71\\times10^{-31}$ kg $= 0.30\\,m_e$.'] },
    { q: 'With $A = 1$ eV and $b = 0.3$ nm, how fast does a packet centred on $kb = \\pi/4$ move?', answer: 6.45e5, unit: 'm/s', tol: 0.02, hint: 'v = (2Ab/ħ) sin kb.',
      steps: ['$2Ab/\\hbar = 9.12\\times10^5$ m/s.', '$v = 9.12\\times10^5 \\times \\sin 45° = 6.45\\times10^5$ m/s.'] }
  ],
  applications: [
    'Metals: at room temperature a conduction electron in copper travels about 40 nm — some 150 atomic spacings — between collisions, and far further in a pure crystal at low temperature.',
    'Graphene is described first of all by exactly this hopping picture, with an amplitude of about 2.7 eV between neighbouring carbon atoms.',
    'Chemists use the same model (the Hückel method) for electrons shared along chains and rings of carbon atoms, such as benzene.',
    'Superlattices — alternating semiconductor layers a few nanometres thick — make artificial bands for infrared lasers and detectors.'
  ],
  history: 'Felix Bloch showed in 1928, in his doctoral work with Heisenberg in Leipzig, that electron waves in a periodic lattice travel without scattering; his model was essentially this one, of electrons hopping between atoms. Alan Wilson explained in 1931 why band gaps make some solids insulators and others semiconductors, and John Slater and George Koster turned the hopping picture into a practical method for real crystals in 1954.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 13 (Propagation in a Crystal Lattice) — the electron hopping along a line of atoms, the states of definite energy $E_0 - 2A\\cos kb$, wave packets and the effective mass, electrons in a three-dimensional lattice, and scattering and trapping by an imperfection.',
    'Vol. III, ch. 8 (The Hamiltonian Matrix) and ch. 9 (The Ammonia Maser) — the Hamiltonian matrix and the two-state system that the lattice generalises.',
    'Vol. III, ch. 16 (The Dependence of Amplitudes on Position) — the same equations with the spacing shrunk to zero become the Schrödinger equation.'
  ],
  sim: 'wim-chain'
},

{
  id: 'semiconductors-feyn', parent: 'waves-in-matter', title: 'Semiconductors', level: 2,
  short: 'In a semiconductor a full band and an empty band are separated by a gap of about an electronvolt. Heat or a sprinkling of impurity atoms puts a few electrons in the upper band and leaves holes — missing electrons that move like positive charges — in the lower one. Join p-type and n-type material and you have a rectifier; two junctions make a transistor.',
  keywords: ['band gap', 'conduction band', 'valence band', 'electron', 'hole', 'doping', 'donor', 'acceptor', 'n-type', 'p-type', 'intrinsic carrier density', 'mass action', 'Hall effect', 'p–n junction', 'diode', 'rectifier', 'transistor', 'silicon', 'germanium'],
  prereq: ['electrons-in-crystals', 'boltzmann-law', 'exclusion-principle'],
  related: ['charges-in-fields', 'physics:semiconductors', 'physics:pn-junction', 'physics:fermi-energy', 'electronics:pn-diode', 'electronics:transistors', 'electronics:semiconductor-basics'],
  body: `
A crystal of silicon has two bands that matter. The lower one, the **valence band**, holds the electrons that make the bonds between neighbouring atoms, and it is completely full. The upper one, the **conduction band**, is empty. Between them lies a gap $E_g$ with no states at all: 1.12 eV for silicon, 0.66 eV for germanium, 1.42 eV for gallium arsenide, about 5.5 eV for diamond. A full band carries no current — for every electron moving one way another moves the other way — and an empty band has nothing to carry. So a perfectly pure semiconductor at absolute zero is an insulator.

### Heat makes pairs
At a temperature $T$ the atoms jiggle, and now and then an electron is lifted across the gap, leaving a vacancy behind in the valence band. Pairs are made at a rate set by the [[?boltzmann-factor]] $e^{-E_g/kT}$ and destroyed when an electron meets a vacancy, at a rate proportional to $n\\,p$ — the balance of a chemical equilibrium. So

$$n\\,p = n_i^2, \\qquad n_i = N\\,e^{-E_g/2kT}$$

where $N$ is an effective density of states, a few times $10^{19}$ per cm³. For silicon at room temperature $n_i \\approx 10^{10}$ per cm³: one free electron for every $5\\times10^{12}$ atoms. The [[?exponential]] makes it very sensitive — from 300 K to 350 K, $n_i$ grows about twenty times.

### The hole
The vacancy is not just an absence. When an electric [[?field]] pushes all the electrons of the nearly full band, the vacancy drifts the other way, as a positive charge would. Near the top of a band the effective mass of an electron is negative ([[electrons-in-crystals]]), and a *missing* electron with negative mass and negative charge behaves like a particle with positive mass and positive charge: the **hole**. The Hall effect shows it directly — in p-type material the Hall voltage has the sign expected for positive carriers.

### Doping: donors and acceptors
Replace one silicon atom in a few million by phosphorus, which has five outer electrons instead of four. Four make bonds; the fifth is held only loosely, because the silicon around it weakens the attraction (its dielectric constant is 11.7) and its effective mass is small — a hydrogen atom scaled down to an ionisation energy of about 45 meV and a size of a few nanometres. At room temperature, where $kT = 26$ meV, nearly every donor gives up its electron: the material is **n-type**, with $n \\approx N_D$. Boron, with three electrons, takes one from the valence band and leaves a hole: **p-type**. Either way $n\\,p = n_i^2$ still holds, so adding electrons suppresses holes.

| Material | Gap $E_g$ | $n_i$ at 300 K |
|---|---|---|
| Germanium | 0.66 eV | about $2\\times10^{13}$ cm⁻³ |
| Silicon | 1.12 eV | about $1\\times10^{10}$ cm⁻³ |
| Gallium arsenide | 1.42 eV | about $2\\times10^{6}$ cm⁻³ |
| Diamond | 5.5 eV | negligible |

### The p–n junction: a rectifier
Grow p-type and n-type material in one crystal. Electrons diffuse into the p side and holes into the n side, leaving behind the fixed charges of ionised donors and acceptors, whose field builds a potential step $V_{bi} = (kT/e)\\ln(N_AN_D/n_i^2)$ — about 0.7 V in silicon. In equilibrium two tiny currents balance: the few electrons on the n side energetic enough to climb the step, and the rare electrons made on the p side that slide down it. A forward voltage $V$ lowers the step and multiplies the climbing current by $e^{eV/kT}$, while the sliding current does not change:

$$I = I_0\\left(e^{eV/kT} - 1\\right)$$

Forward, the current grows tenfold for every 60 mV; backwards it stops at the tiny $-I_0$. Two junctions back to back, n–p–n, make a **transistor**: electrons injected from the emitter cross a thin base and are swept into the collector, so a small base current controls a large one.

> [!key] A semiconductor has a full band and an empty band about an electronvolt apart. Its carriers — electrons above the gap, holes below it — are few, and their number is set by the temperature and by the impurities we choose to put in.

In the first simulation, heat pure silicon until electron–hole pairs appear, then dope it and watch the donors give up their electrons; in the second, bias a junction and watch the flow over the step grow exponentially.
`,
  ideas: [
    'A full band carries no current and an empty band has no carriers; a semiconductor has a full band and an empty one separated by a gap of about 1 eV.',
    'Heat lifts electrons across the gap: n p = n_i², with n_i ∝ e^{−E_g/2kT}, about 10¹⁰ per cm³ in silicon at room temperature.',
    'A hole — a missing electron near the top of the valence band — moves like a particle with positive charge and positive mass.',
    'Donor impurities (phosphorus) give electrons and make n-type material; acceptors (boron) take electrons and make p-type.',
    'A p–n junction passes current one way: I = I₀(e^{eV/kT} − 1).'
  ],
  pitfalls: [
    'A hole is a positron inside the crystal — A hole is the absence of an electron in a nearly full band; it behaves like a positive charge only because of how the rest of the band moves.',
    'Doping adds carriers of both kinds — Donors add electrons and, because n p = n_i², they reduce the number of holes by the same factor.',
    'A diode conducts only above 0.7 V — The current rises smoothly and exponentially, tenfold every 60 mV; about 0.6–0.7 V is simply where it reaches milliamperes in a typical silicon diode.'
  ],
  formulas: [
    {
      name: 'Carriers in a pure semiconductor',
      expr: 'ni = N*exp(-Eg/(2*kB*T))', tex: 'n_i = N\\,\\exp\\left(-\\dfrac{E_g}{2k_BT}\\right)',
      vars: {
        ni: { name: 'intrinsic carrier density (electrons = holes)', q: 'numberdensity', unit: '1/cm³', tex: 'n_i' },
        N: { name: 'effective density of states √(N_c N_v)', q: 'numberdensity', unit: '1/cm³', value: 2.5e19 },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 1.12, tex: 'E_g' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'N itself grows slowly with temperature (as T^{3/2}); the exponential dominates. The values given are for silicon.',
      stories: {
        ni: 'A semiconductor has a gap of {Eg} and an effective density of states of {N}. How many electrons per unit volume are in its conduction band at {T}?',
        T: 'At what temperature does a material with a gap of {Eg} and {N} reach {ni} free electrons?'
      }
    },
    {
      name: 'The mass-action law',
      expr: 'p = ni^2/n', tex: 'p = \\dfrac{n_i^2}{n}',
      vars: {
        p: { name: 'density of holes', q: 'numberdensity', unit: '1/cm³' },
        ni: { name: 'intrinsic carrier density', q: 'numberdensity', unit: '1/cm³', value: 1e10, tex: 'n_i' },
        n: { name: 'density of electrons', q: 'numberdensity', unit: '1/cm³', value: 1e16 }
      },
      note: 'n p = n_i² in equilibrium, whatever the doping. In n-type material n ≈ N_D.',
      stories: { p: 'Silicon ({ni}) is doped so that it has {n} free electrons. How many holes are there?' }
    },
    {
      name: 'Built-in voltage of a p–n junction',
      expr: 'Vbi = kB*T/qe*ln(NA*ND/ni^2)', tex: 'V_{bi} = \\dfrac{k_BT}{e}\\ln\\dfrac{N_AN_D}{n_i^2}',
      vars: {
        Vbi: { name: 'built-in voltage', q: 'voltage', unit: 'V', tex: 'V_{bi}' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        qe: { const: 'qe' },
        NA: { name: 'acceptor density on the p side', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'N_A' },
        ND: { name: 'donor density on the n side', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'N_D' },
        ni: { name: 'intrinsic carrier density', q: 'numberdensity', unit: '1/cm³', value: 1e10, tex: 'n_i' }
      },
      note: 'The step in potential that stops electrons and holes from diffusing any further.',
      stories: { Vbi: 'A silicon junction ({ni}) has {NA} on the p side and {ND} on the n side. What is its built-in voltage at {T}?' }
    },
    {
      name: 'The rectifier equation',
      expr: 'I = I0*(exp(qe*V/(kB*T)) - 1)', tex: 'I = I_0\\left[\\exp\\left(\\dfrac{eV}{k_BT}\\right) - 1\\right]',
      vars: {
        I: { name: 'current through the junction', q: 'current', unit: 'mA', signed: true },
        I0: { name: 'saturation current', q: 'current', unit: 'pA', value: 1, tex: 'I_0' },
        qe: { const: 'qe' },
        V: { name: 'applied voltage (forward positive)', q: 'voltage', unit: 'V', value: 0.6, signed: true },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Forward, ×10 for every 60 mV at room temperature; reverse, the current settles at −I₀.',
      stories: {
        I: 'A junction with a saturation current of {I0} at {T} is biased at {V}. What current flows?',
        V: 'A junction with {I0} at {T} carries {I}. What voltage is across it?'
      }
    }
  ],
  examples: [
    {
      title: 'Why chips are cooled',
      q: 'By what factor does $n_i$ of silicon ($E_g = 1.12$ eV) rise between 300 K and 350 K, if $N$ is taken as constant?',
      steps: [
        'The ratio is $\\exp\\left[\\dfrac{E_g}{2k_B}\\left(\\dfrac{1}{300} - \\dfrac{1}{350}\\right)\\right]$.',
        '$E_g/2k_B = 1.12/(2 \\times 8.617\\times10^{-5}) = 6500$ K, and $1/300 - 1/350 = 4.76\\times10^{-4}$ K⁻¹.',
        'The exponent is 3.10, so the ratio is $e^{3.10} = 22$. The slow growth of $N$ (as $T^{3/2}$) adds another 26 %.'
      ],
      a: 'About 22 times (about 28 with the growth of N).'
    },
    {
      title: 'Doped silicon',
      q: 'Silicon ($n_i = 10^{10}$ cm⁻³, $5\\times10^{22}$ atoms per cm³) is doped with $10^{16}$ phosphorus atoms per cm³. How many electrons and holes are there, and how dilute is the doping?',
      steps: [
        'Nearly every donor is ionised at room temperature, so $n \\approx 10^{16}$ cm⁻³ — a million times more than in pure silicon.',
        'Mass action: $p = n_i^2/n = 10^{20}/10^{16} = 10^{4}$ cm⁻³.',
        'One phosphorus atom per $5\\times10^{22}/10^{16} = 5\\times10^{6}$ silicon atoms.'
      ],
      a: '10¹⁶ electrons and 10⁴ holes per cm³, from one impurity atom in five million.'
    },
    {
      title: 'A donor is a swollen hydrogen atom',
      q: 'Treat the extra electron of phosphorus in silicon as hydrogen with effective mass $0.26\\,m_e$ in a medium of dielectric constant 11.7. Estimate its binding energy and radius.',
      steps: [
        'Hydrogen\'s energy scales as $m/\\varepsilon_r^2$: $13.6 \\times 0.26/11.7^2 = 0.026$ eV.',
        'Its radius scales as $\\varepsilon_r/m$: $0.053\\ \\text{nm} \\times 11.7/0.26 = 2.4$ nm, spanning hundreds of atoms.',
        'The measured value for phosphorus is 45 meV: the estimate is rough but of the right size, comparable with $kT = 26$ meV.'
      ],
      a: 'About 0.03 eV and 2.4 nm — which is why donors ionise at room temperature.'
    }
  ],
  quiz: [
    { q: 'A band that is completely full of electrons carries…', choices: ['no current, whatever the field', 'the largest possible current', 'a current proportional to the number of electrons', 'current only at high temperature'], a: 0, why: 'For every electron moving one way there is one moving the other way, and no empty states to change that.' },
    { q: 'A hole is a positron that lives inside the crystal.', a: false, why: 'A hole is a missing electron in a nearly full band. It moves like a positive charge because of how the other electrons shift into the vacancy.' },
    { q: 'Adding phosphorus (five outer electrons) to silicon makes it…', choices: ['n-type: extra free electrons', 'p-type: extra holes', 'an insulator', 'a metal'], a: 0, why: 'The fifth electron is loosely bound and is freed at room temperature: a donor.' },
    { q: 'Doping raises the electron density a hundredfold. The hole density…', choices: ['falls a hundredfold', 'rises a hundredfold', 'is unchanged', 'rises tenfold'], a: 0, why: 'n p = n_i² stays fixed at a given temperature.' },
    { q: 'At room temperature, raising the forward voltage on a silicon diode by 60 mV multiplies the current by about…', choices: ['10', '2', '1.06', '60'], a: 0, why: 'e^{eV/kT} with kT/e = 25.9 mV: e^{60/25.9} ≈ 10.' }
  ],
  problems: [
    { q: 'Germanium has a gap of 0.66 eV. Taking N = 1 × 10¹⁹ cm⁻³, estimate its intrinsic carrier density at 300 K.', answer: 2.86e13, unit: '1/cm³', tol: 0.03, hint: 'n_i = N e^{−E_g/2kT} with kT = 0.02585 eV.',
      steps: ['$E_g/2kT = 0.66/(2 \\times 0.02585) = 12.77$.', '$n_i = 10^{19} \\times e^{-12.77} = 2.9\\times10^{13}$ cm⁻³.'] },
    { q: 'By what factor does the current of a diode at 300 K rise when the forward voltage goes from 0.6 V to 0.7 V?', answer: 47.9, tol: 0.03, hint: 'The −1 is negligible: the ratio is e^{eΔV/kT}.',
      steps: ['$e\\Delta V/kT = 0.1/0.02585 = 3.87$.', '$e^{3.87} = 48$.'] }
  ],
  applications: [
    'Every transistor in a chip is made by doping silicon in patterns a few tens of nanometres wide: junctions, and channels controlled by a field.',
    'Solar cells and photodiodes: a photon with more energy than the gap makes an electron–hole pair, and the junction\'s field pulls them apart into a current.',
    'Light-emitting diodes run the other way: electrons and holes recombining across the gap emit photons of about the gap energy — near 870 nm (infrared) for gallium arsenide, blue for indium gallium nitride.',
    'Thermistors use the steep rise of the carrier density with temperature; Hall sensors use the Hall voltage to measure magnetic fields.'
  ],
  history: 'Edwin Hall discovered the effect named after him in 1879. Alan Wilson explained semiconductors with band theory in 1931. Russell Ohl found the p–n junction in a cracked silicon rod at Bell Labs in 1940. John Bardeen and Walter Brattain made the first transistor (a point-contact one) in December 1947, and William Shockley worked out the junction transistor soon after; the three shared the 1956 Nobel Prize in Physics.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 14 (Semiconductors) — electrons and holes, impure semiconductors, the Hall effect, semiconductor junctions, rectification at a junction and the transistor.',
    'Vol. III, ch. 13 (Propagation in a Crystal Lattice) — the bands in which the electrons and holes move.',
    'Vol. I, ch. 40 (The Principles of Statistical Mechanics) — the Boltzmann factor that counts the carriers.'
  ],
  sim: ['wim-bands', 'wim-pn']
},

{
  id: 'schrodinger-equation-feyn', parent: 'waves-in-matter', title: 'The Schrödinger equation', level: 3,
  short: 'Let the spacing of Feynman\'s chain of atoms shrink to nothing and the hopping equations become one equation for a continuous amplitude ψ(x, t): iħ ∂ψ/∂t = −(ħ²/2m) ∂²ψ/∂x² + Vψ. The curvature of ψ is its kinetic energy; stationary states turn without changing shape, and in a well only certain energies fit.',
  keywords: ['Schrödinger equation', 'wave function', 'amplitude', 'stationary state', 'energy level', 'quantisation', 'particle in a box', 'harmonic oscillator', 'wave packet', 'dispersion', 'probability density', 'continuity equation', 'zero-point energy', 'eigenvalue'],
  prereq: ['electrons-in-crystals', 'amplitudes-in-time', 'wave-and-particle', 'math:partial-derivatives'],
  related: ['tunnelling-feyn', 'operators-feyn', 'hydrogen-and-periodic-table', 'harmonic-oscillator-feyn', 'uncertainty-feyn', 'physics:schrodinger-equation', 'physics:particle-in-a-box', 'physics:quantum-harmonic-oscillator', 'math:eigenvalues'],
  body: `
In Feynman's route through quantum mechanics the Schrödinger equation is not the starting point but a destination. Take the electron hopping along a line of atoms ([[electrons-in-crystals]]) and let the atoms crowd closer and closer until the line is continuous. The amplitudes $C_n$ at the atoms become a smooth function $\\psi(x,t)$ — the [[?wave-function|wave function]], the amplitude to find the particle at $x$ — and the endless chain of hopping equations becomes a single equation.

### From a chain to a line
Rewrite the hopping equation as

$$i\\hbar\\frac{dC_n}{dt} = (E_0 - 2A)\\,C_n - A\\left(C_{n+1} - 2C_n + C_{n-1}\\right)$$

The bracket, divided by $b^2$, is the [[?second-derivative|second derivative]] of the amplitude along the line. Let $b \\to 0$ while keeping $Ab^2 = \\hbar^2/2m$, measure energy from $E_0 - 2A$, and let that energy vary from place to place as a potential $V(x)$:

$$i\\hbar\\frac{\\partial\\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\psi}{\\partial x^2} + V(x)\\,\\psi$$

### Reading it term by term
The left side is the rate of change of the amplitude, times $i\\hbar$; the [[?imaginary-unit]] is why $\\psi$ must be a [[?complex-number|complex number]]. The first term on the right is the kinetic energy: it measures how sharply $\\psi$ curves, a [[?partial-derivative|partial derivative]] taken twice in $x$. The second is the potential energy. Try a plane wave $\\psi = e^{i(kx - \\omega t)}$ where $V$ is constant: the equation gives $\\hbar\\omega = \\hbar^2k^2/2m + V$, energy $= p^2/2m + V$ with $p = \\hbar k$. De Broglie's relation is built in: where the kinetic energy is larger, the wavelength is shorter.

### Stationary states and quantised energies
A state of definite energy has $\\psi = \\phi(x)\\,e^{-iEt/\\hbar}$: its whole pattern turns like a single arrow, so the [[?probability-density|probability density]] $|\\psi|^2$ never changes — hence *stationary*. The shape obeys

$$-\\frac{\\hbar^2}{2m}\\phi'' + V\\phi = E\\,\\phi$$

Where $E > V$, $\\phi$ curves back towards the axis and oscillates; where $E < V$ it curves away and must die off exponentially, or it would grow without limit. In a well only special energies let the solution die away on *both* sides: the energies are quantised, the [[?eigenvalue|eigenvalues]] of the equation.

| System | Allowed energies | Example |
|---|---|---|
| Box of width $L$ | $E_n = n^2h^2/8mL^2$ | electron, $L = 1$ nm: $0.376\\,n^2$ eV |
| Harmonic well | $E_n = (n + \\tfrac12)\\hbar\\omega$ | H–Cl vibration: $\\hbar\\omega = 0.36$ eV |
| Hydrogen atom | $E_n = -13.6\\ \\text{eV}/n^2$ | [[hydrogen-and-periodic-table]] |

Even the lowest state has energy. A particle squeezed into a box has a spread of momenta, as the [[uncertainty-feyn|uncertainty principle]] demands, and an oscillator keeps $\\tfrac12\\hbar\\omega$ even at absolute zero.

### Packets in motion
A superposition of waves with a spread of $k$ is a packet. Its peak moves at the group velocity $\\hbar k/m$, and it spreads, because its faster and slower parts drift apart. At a step it is partly reflected even when its energy is above the step; at a barrier part of it gets through even when its energy is below ([[tunnelling-feyn]]); in a harmonic well it swings to and fro like a ball on a spring, its average position obeying Newton's law ([[operators-feyn]]).

> [!key] The Schrödinger equation is a [[?differential-equation]] for amplitudes, in which the curvature of $\\psi$ is kinetic energy. Stationary states turn in time without changing shape, and in a well only certain energies fit.

### What to look for in the simulations
In the first, the equation is solved as you watch: the real and imaginary parts of $\\psi$ chase each other along the packet while $|\\psi|^2$ glides smoothly underneath. Put a step, a barrier or a harmonic well in its way. The total probability stays exactly 1 — probability flows but is never created or lost, as Feynman showed with its equation of continuity. In the second, choose a well and see its stationary states stacked at their energies, each with one more node than the last; superpose two neighbours and the density sloshes back and forth.
`,
  ideas: [
    'The Schrödinger equation is the continuum limit of the equations for an electron hopping along a line of atoms.',
    'The curvature of ψ is kinetic energy: where the kinetic energy is larger, ψ wiggles faster (λ = h/p).',
    'A stationary state ψ = φ(x)e^{−iEt/ħ} turns like one arrow, so |ψ|² does not change in time.',
    'Where E < V the wave function decays exponentially instead of oscillating; in a well this allows only certain energies.',
    'A packet moves at ħk/m and spreads; in a harmonic well its average swings like a classical ball.'
  ],
  pitfalls: [
    'ψ is a real wave, like a wave on a string — ψ is a complex amplitude; only |ψ|², the probability density, is measured, and multiplying ψ by any phase e^{iα} changes nothing observable.',
    'In a stationary state nothing about ψ changes — Its phase turns at the rate E/ħ; what stays fixed is |ψ|² and every average computed from it.',
    'The lowest energy in a well is zero, with the particle at rest at the bottom — Confining a particle gives it a spread of momentum, so the lowest energy is above the bottom: h²/8mL² in a box, ħω/2 in a harmonic well.'
  ],
  derivation: {
    title: 'From the chain of atoms to the Schrödinger equation',
    steps: [
      { text: 'Start from the hopping equations and add and subtract $2AC_n$, so that the neighbours appear as a difference of differences.', tex: 'i\\hbar\\dot{C}_n = (E_0 - 2A)C_n - A\\left[(C_{n+1} - C_n) - (C_n - C_{n-1})\\right]' },
      { text: 'For a smooth amplitude $C(x)$ on atoms a distance $b$ apart, the difference of differences is $b^2$ times the second derivative (the [[?taylor-series]] of $C(x \\pm b)$ to second order).', tex: 'C_{n+1} - 2C_n + C_{n-1} \\approx b^2\\frac{\\partial^2 C}{\\partial x^2}' },
      { text: 'Shrink $b$ while holding $Ab^2$ fixed and call it $\\hbar^2/2m$ (the effective mass of the band); measure energies from $E_0 - 2A$.', tex: 'i\\hbar\\frac{\\partial\\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\psi}{\\partial x^2}' },
      { text: 'Let the energy of the electron at each place differ — an electric field or the pull of a nucleus — and add it as a potential energy $V(x)$.', tex: 'i\\hbar\\frac{\\partial\\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\psi}{\\partial x^2} + V(x)\\,\\psi' },
      { text: 'For a state of definite energy the time dependence is one turning phase; dividing it out leaves an equation for the shape alone.', tex: '\\psi = \\phi(x)\\,e^{-iEt/\\hbar} \\;\\Rightarrow\\; -\\frac{\\hbar^2}{2m}\\phi\'\' + V\\phi = E\\phi' }
    ]
  },
  formulas: [
    {
      name: 'Energy levels in a box',
      expr: 'E = n^2*h^2/(8*m*L^2)', tex: 'E_n = \\dfrac{n^2h^2}{8mL^2}',
      vars: {
        E: { name: 'energy of level n', q: 'energy', unit: 'eV', tex: 'E_n' },
        n: { name: 'level number (1, 2, 3 …)', int: true, value: 1 },
        h: { const: 'h' },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' },
        L: { name: 'width of the box', q: 'length', unit: 'nm', value: 1 }
      },
      note: 'Walls that cannot be passed (ψ = 0 at both ends): a whole number of half-wavelengths fits, λ = 2L/n.',
      stories: {
        E: 'An electron is confined to a box {L} wide. What is the energy of level {n}?',
        L: 'How wide a box gives an electron in level {n} the energy {E}?'
      }
    },
    {
      name: 'Energy levels of a harmonic oscillator',
      expr: 'E = (n + 1/2)*hbar*omega', tex: 'E_n = \\left(n + \\tfrac12\\right)\\hbar\\omega',
      vars: {
        E: { name: 'energy of level n', q: 'energy', unit: 'eV', tex: 'E_n' },
        n: { name: 'level number (0, 1, 2 …)', int: true, value: 1 },
        hbar: { const: 'hbar' },
        omega: { name: 'angular frequency of the oscillator', q: 'angvel', unit: 'rad/s', value: 5.44e14, tex: '\\omega' }
      },
      note: 'Equally spaced by ħω, starting at ħω/2 — the zero-point energy. The default is the vibration of the H–Cl molecule.',
      stories: {
        E: 'A molecule vibrates at {omega}. What is the energy of its level {n}?',
        omega: 'Level {n} of an oscillator has the energy {E}. What is its angular frequency?'
      }
    },
    {
      name: 'Energy of a plane wave where the potential is V',
      expr: 'E = (hbar*k)^2/(2*m) + V', tex: 'E = \\dfrac{(\\hbar k)^2}{2m} + V',
      vars: {
        E: { name: 'total energy', q: 'energy', unit: 'eV', signed: true },
        hbar: { const: 'hbar' },
        k: { name: 'wave number (2π/λ)', q: 'wavenumber', unit: '1/nm', value: 5 },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' },
        V: { name: 'potential energy', q: 'energy', unit: 'eV', value: 1, signed: true }
      },
      note: 'Put ψ = e^{i(kx − ωt)} into the equation with constant V. Where E − V is larger, k is larger and the wavelength shorter.',
      stories: {
        k: 'An electron with total energy {E} enters a region where the potential energy is {V}. What is its wave number there?',
        E: 'An electron wave has wave number {k} in a region at potential energy {V}. What is its total energy?'
      }
    }
  ],
  examples: [
    {
      title: 'An electron in a nanometre box',
      q: 'An electron is confined to a box 1 nm wide. Find its two lowest energies and the wavelength of the photon emitted when it falls from the second to the first.',
      steps: [
        '$E_1 = h^2/8mL^2 = (6.626\\times10^{-34})^2/(8 \\times 9.109\\times10^{-31} \\times 10^{-18}) = 6.02\\times10^{-20}$ J $= 0.376$ eV.',
        '$E_2 = 4E_1 = 1.504$ eV; the difference is $3E_1 = 1.128$ eV.',
        '$\\lambda = hc/\\Delta E = 1239.8\\ \\text{eV·nm}/1.128\\ \\text{eV} = 1099$ nm, in the near infrared.'
      ],
      a: '0.376 eV and 1.50 eV; the photon has a wavelength of about 1.1 µm.'
    },
    {
      title: 'Speed of a packet',
      q: 'A free electron packet has its wave number centred on $k = 5$ nm⁻¹. What are its wavelength, kinetic energy and speed?',
      steps: [
        '$\\lambda = 2\\pi/k = 1.26$ nm.',
        '$E = (\\hbar k)^2/2m = (1.055\\times10^{-34} \\times 5\\times10^{9})^2/(2 \\times 9.109\\times10^{-31}) = 1.53\\times10^{-19}$ J $= 0.95$ eV.',
        'The peak moves at the group velocity $\\hbar k/m = 5.27\\times10^{-25}/9.109\\times10^{-31} = 5.8\\times10^5$ m/s.'
      ],
      a: '1.26 nm, 0.95 eV and 5.8 × 10⁵ m/s.'
    },
    {
      title: 'A molecule that cannot stop vibrating',
      q: 'The H–Cl molecule vibrates with $\\hbar\\omega = 0.358$ eV. What is its lowest energy, and what fraction of molecules is in the first excited level at 300 K?',
      steps: [
        '$E_0 = \\tfrac12\\hbar\\omega = 0.179$ eV — about seven times $kT = 0.0259$ eV.',
        'The next level is $\\hbar\\omega$ higher; by the Boltzmann factor the population ratio is $e^{-0.358/0.0259} = e^{-13.8} \\approx 10^{-6}$.'
      ],
      a: '0.179 eV; only about one molecule in a million is excited at room temperature.'
    }
  ],
  quiz: [
    { q: 'Where the energy $E$ is less than the potential $V$, the stationary wave function…', choices: ['curves away from the axis: it grows or decays exponentially', 'oscillates faster than elsewhere', 'is exactly zero', 'has a node at every point'], a: 0, why: 'φ″ = (2m/ħ²)(V − E)φ has the same sign as φ: the curve bends away from the axis, like an exponential.' },
    { q: 'The width of a box is doubled. Its energy levels are multiplied by…', choices: ['1/4', '1/2', '2', '4'], a: 0, why: 'E_n = n²h²/8mL² goes as 1/L².' },
    { q: 'In a stationary state the wave function does not change at all in time.', a: false, why: 'It turns as e^{−iEt/ħ}. |ψ|² stays fixed, but the phase rotates.' },
    { q: 'Which term of the Schrödinger equation is the kinetic energy?', choices: ['−(ħ²/2m) ∂²ψ/∂x², the curvature', 'V(x)ψ', 'iħ ∂ψ/∂t', 'there is none'], a: 0, why: 'For a plane wave the curvature term gives ħ²k²/2m = p²/2m.' },
    { q: 'The lowest energy of a harmonic oscillator of angular frequency ω is…', choices: ['ħω/2', 'zero', 'ħω', 'kT'], a: 0, why: 'E_n = (n + ½)ħω with n = 0: the zero-point energy.' }
  ],
  problems: [
    { q: 'What is the lowest energy of an electron in a box 0.5 nm wide?', answer: 1.504, unit: 'eV', tol: 0.02, hint: 'E₁ = h²/8mL².',
      steps: ['$E_1 = (6.626\\times10^{-34})^2/(8 \\times 9.109\\times10^{-31} \\times 0.25\\times10^{-18}) = 2.41\\times10^{-19}$ J.', 'In electronvolts, 1.50 eV — four times the 1 nm value.'] },
    { q: 'An electron is in a box 2 nm wide. What energy does it need to jump from level 1 to level 2?', answer: 0.282, unit: 'eV', tol: 0.02, hint: 'E₂ − E₁ = 3E₁.',
      steps: ['$E_1 = 0.376/4 = 0.094$ eV for $L = 2$ nm.', '$E_2 - E_1 = 3 \\times 0.094 = 0.282$ eV.'] }
  ],
  applications: [
    'Quantum dots: semiconductor crystals a few nanometres across glow in colours set by their size — the smaller the box, the bluer the light.',
    'Quantum-well lasers in fibre-optic links and laser pointers use layers a few nanometres thick to set the emitted wavelength.',
    'Infrared spectroscopy identifies molecules by the spacings ħω of their vibrational levels.',
    'Chemistry and materials science solve the Schrödinger equation on computers to predict molecules and solids; try 1-D wells yourself in [the quantum wells tool](#/tools/wells).'
  ],
  history: 'Louis de Broglie proposed in 1924 that electrons have a wavelength h/p. Erwin Schrödinger found the equation for those waves in 1926 and solved it at once for the hydrogen atom and the oscillator; the same year Max Born proposed that |ψ|² gives the probability of finding the particle. The simulation here uses the time-stepping method John Crank and Phyllis Nicolson published in 1947, which keeps the total probability exactly 1.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 16 (The Dependence of Amplitudes on Position) — amplitudes on a line, the wave function, states of definite momentum, the Schrödinger equation reached from the lattice as the spacing goes to zero, and quantized energy levels.',
    'Vol. III, ch. 21 (The Schrödinger Equation in a Classical Context: A Seminar on Superconductivity) — the equation in a magnetic field, the equation of continuity for probabilities and the meaning of the wave function.',
    'Vol. III, ch. 13 (Propagation in a Crystal Lattice) — the lattice equations the argument starts from.'
  ],
  sim: ['wim-schrodinger', 'wim-stationary']
},

{
  id: 'tunnelling-feyn', parent: 'waves-in-matter', title: 'Tunnelling through barriers', level: 2,
  short: 'A particle can get through a region where, classically, its kinetic energy would be negative. There the wave function does not oscillate but dies away exponentially, and if the barrier is thin part of it emerges on the far side. The chance falls roughly as e^{−2κa}: exquisitely sensitive to the width, the height and the mass.',
  keywords: ['tunnelling', 'tunneling', 'barrier penetration', 'evanescent wave', 'transmission coefficient', 'decay length', 'alpha decay', 'scanning tunnelling microscope', 'STM', 'tunnel diode', 'flash memory', 'field emission', 'Gamow'],
  prereq: ['schrodinger-equation-feyn', 'probability-amplitudes', 'math:exponential-functions'],
  related: ['ammonia-maser', 'superconductivity-feyn', 'electrons-in-crystals', 'partial-reflection', 'physics:quantum-tunneling', 'math:hyperbolic-functions'],
  body: `
A ball rolling at a hill with too little energy to reach the top slows, stops and rolls back; it never turns up on the other side. An electron sometimes does. This is no small correction: it keeps the Sun shining, lets uranium decay, lets electrons hop from atom to atom through a crystal and makes the pictures of the scanning tunnelling microscope.

### Inside the barrier
Where the potential $V$ is higher than the energy $E$, the stationary Schrödinger equation ([[schrodinger-equation-feyn]]) reads

$$\\phi'' = \\kappa^2\\phi, \\qquad \\kappa = \\frac{\\sqrt{2m(V - E)}}{\\hbar}$$

Its solutions are not waves but [[?exponential|exponentials]], $e^{-\\kappa x}$ and $e^{+\\kappa x}$: the amplitude falls by a factor $e$ in each distance $1/\\kappa$. For an electron 1 eV short of the top, $1/\\kappa = 0.195$ nm — the size of an atom. Classically the region is forbidden, since the kinetic energy $E - V$ would be negative; quantum mechanically the wave function merely decays there.

### Through the wall
If the barrier is thin, the decaying amplitude has not quite vanished at the far side, and there it becomes a travelling wave again — weaker, but real. For a square barrier of height $V_0$ and width $a$ the probability of getting through is, exactly,

$$T = \\left[1 + \\frac{V_0^2\\sinh^2\\kappa a}{4E(V_0 - E)}\\right]^{-1} \\approx \\frac{16E(V_0 - E)}{V_0^2}\\,e^{-2\\kappa a}$$

(sinh is the hyperbolic sine, $(e^x - e^{-x})/2$; for a thick barrier only its growing half matters). The amplitude falls as $e^{-\\kappa a}$ and the probability, its [[?absolute-square|absolute square]], as $e^{-2\\kappa a}$. For an electron with $E = 1$ eV at a 2 eV barrier:

| Width $a$ | Transmission $T$ |
|---|---|
| 0.2 nm | 0.40 |
| 0.5 nm | 0.024 |
| 1 nm | $1.4\\times10^{-4}$ |
| 2 nm | $5\\times10^{-9}$ |

### Above the top, still reflected
When $E > V_0$ a ball would pass with certainty. A wave is partly reflected at each edge of the barrier, and the two reflections interfere; the transmission wobbles with energy and reaches exactly 1 whenever a whole number of half-wavelengths fits across the barrier — the arithmetic of light reflected by a thin sheet of glass ([[partial-reflection]]).

### A packet meets a barrier
A real particle is a packet with a spread of energies. At a barrier it splits into a reflected packet and a smaller transmitted one. A detector beyond either clicks or does not; the fraction of clicks is the transmitted probability, equal to $T(E)$ averaged over the packet's energies. Since $T$ rises steeply with energy, the part that gets through is made of the packet's more energetic components — but each particle comes out with the energy it had. In the simulation, compare the measured fraction with the curve $T(E)$ and with its average over the packet.

### Where tunnelling matters
- **Alpha decay.** Polonium-212 emits 8.8 MeV alpha particles and has a half-life of 0.3 µs; thorium-232 emits 4.0 MeV alphas and has a half-life of $1.4\\times10^{10}$ years. Half the energy, and the Coulomb barrier is so much harder to cross that the lifetime is about $10^{24}$ times longer.
- **The scanning tunnelling microscope.** With a 4.5 eV work function $\\kappa \\approx 11$ nm⁻¹, so the current between tip and surface changes about ninefold for each 0.1 nm: the tip feels single atoms.
- **The ammonia molecule** ([[ammonia-maser]]): the nitrogen's small amplitude to get through the plane of the hydrogens splits its two lowest states by an energy corresponding to 24 GHz.
- **And more**: electrons hop between atoms of a crystal ([[electrons-in-crystals]]); flash memory stores bits by pushing electrons through a thin oxide; the Josephson junction ([[superconductivity-feyn]]) passes electron pairs through an insulating gap; and protons in the Sun fuse only because they tunnel through their mutual repulsion.

> [!key] Where the kinetic energy would be negative the wave function does not stop: it decays exponentially. A thin enough barrier lets part of it through, with a probability of roughly $e^{-2\\kappa a}$.
`,
  ideas: [
    'Where V > E the wave function decays as e^{−κx}, with κ = √(2m(V − E))/ħ, instead of oscillating.',
    'A barrier of width a transmits a fraction T ≈ (prefactor) × e^{−2κa}: the probability falls exponentially with width.',
    'Heavier particles and higher barriers make κ larger: a proton tunnels far less than an electron.',
    'Above the barrier a wave is still partly reflected; the transmission reaches 1 only at resonances.',
    'Alpha decay, the scanning tunnelling microscope, flash memory, the ammonia molecule and the Josephson junction all depend on tunnelling.'
  ],
  pitfalls: [
    'The particle borrows energy to climb over the barrier — The energy is the same before and after; the wave function simply decays through the forbidden region instead of stopping at its edge.',
    'A particle with more energy than the barrier always gets through — Waves are partly reflected at any sudden change of potential, so T < 1 except at resonances.',
    'Doubling the width halves the transmission — For a thick barrier T ≈ e^{−2κa}: doubling the width squares a small T (10⁻³ becomes about 10⁻⁶).'
  ],
  derivation: {
    title: 'Why the chance falls as e^{−2κa}',
    steps: [
      { text: 'Inside the barrier $V_0 > E$, so the stationary equation has a positive constant on the right: the curvature has the same sign as $\\phi$.', tex: '\\phi\'\' = \\frac{2m(V_0 - E)}{\\hbar^2}\\,\\phi = \\kappa^2\\phi' },
      { text: 'Its solutions are a decaying and a growing [[?exponential]]. In a thick barrier the decaying one carries the wave in from the left.', tex: '\\phi = B\\,e^{-\\kappa x} + C\\,e^{\\kappa x}' },
      { text: 'Across the width $a$ the amplitude shrinks by the factor $e^{-\\kappa a}$.', tex: '\\frac{|\\phi(a)|}{|\\phi(0)|} \\approx e^{-\\kappa a}' },
      { text: 'The probability is the [[?absolute-square]] of the amplitude, so it shrinks by the square of that factor. Matching $\\phi$ and its slope at both edges gives the prefactor.', tex: 'T \\approx \\frac{16E(V_0 - E)}{V_0^2}\\,e^{-2\\kappa a}' }
    ]
  },
  formulas: [
    {
      name: 'Decay constant inside a barrier',
      expr: 'kappa = sqrt(2*m*(V0 - E))/hbar', tex: '\\kappa = \\dfrac{\\sqrt{2m(V_0 - E)}}{\\hbar}',
      vars: {
        kappa: { name: 'decay constant (1/κ is the decay length)', q: 'wavenumber', unit: '1/nm', tex: '\\kappa' },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' },
        V0: { name: 'height of the barrier', q: 'energy', unit: 'eV', value: 2, tex: 'V_0' },
        E: { name: 'energy of the particle', q: 'energy', unit: 'eV', value: 1 },
        hbar: { const: 'hbar' }
      },
      note: 'Only where V₀ > E. The amplitude falls by a factor e in each 1/κ.',
      stories: {
        kappa: 'An electron with {E} meets a barrier {V0} high. How quickly does its wave function decay inside?',
        V0: 'An electron with {E} decays inside a barrier with κ = {kappa}. How high is the barrier?'
      }
    },
    {
      name: 'Transmission through a square barrier (exact)',
      expr: 'T = 1/(1 + V0^2*sinh(sqrt(2*m*(V0 - E))*a/hbar)^2/(4*E*(V0 - E)))',
      tex: 'T = \\left[1 + \\dfrac{V_0^2\\sinh^2\\left(\\sqrt{2m(V_0 - E)}\\;a/\\hbar\\right)}{4E(V_0 - E)}\\right]^{-1}',
      vars: {
        T: { name: 'transmission probability' },
        V0: { name: 'height of the barrier', q: 'energy', unit: 'eV', value: 2, tex: 'V_0' },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' },
        E: { name: 'energy of the particle', q: 'energy', unit: 'eV', value: 1, min: 0.001, max: 1.999 },
        a: { name: 'width of the barrier', q: 'length', unit: 'nm', value: 0.5 },
        hbar: { const: 'hbar' }
      },
      note: 'For E < V₀. The same formula with sin in place of sinh (and V₀ − E replaced by E − V₀) holds above the barrier.',
      stories: {
        T: 'An electron with {E} meets a barrier {V0} high and {a} wide. What is the chance that it gets through?',
        a: 'How wide may a barrier {V0} high be if an electron with {E} is to get through with probability {T}?'
      },
      practice: { unknowns: ['T', 'a'] }
    },
    {
      name: 'The rough rule for a thick barrier',
      expr: 'T = exp(-2*kappa*a)', tex: 'T \\sim e^{-2\\kappa a}',
      vars: {
        T: { name: 'transmission probability (order of magnitude)' },
        kappa: { name: 'decay constant', q: 'wavenumber', unit: '1/nm', value: 5.12, tex: '\\kappa' },
        a: { name: 'width of the barrier', q: 'length', unit: 'nm', value: 0.5 }
      },
      note: 'Good to within the prefactor 16E(V₀ − E)/V₀², which is at most 4. What matters is the exponent.',
      stories: {
        T: 'A barrier {a} wide has κ = {kappa}. Roughly what fraction of particles gets through?',
        a: 'With κ = {kappa}, how wide a barrier lets through a fraction {T}?'
      }
    }
  ],
  examples: [
    {
      title: 'An electron and a thin barrier',
      q: 'An electron of energy 1 eV meets a barrier 2 eV high and 0.5 nm wide. What is the probability that it gets through?',
      steps: [
        '$\\kappa = \\sqrt{2 \\times 9.109\\times10^{-31} \\times 1.602\\times10^{-19}}/1.055\\times10^{-34} = 5.12\\times10^9$ m⁻¹, so $\\kappa a = 2.56$.',
        '$\\sinh 2.56 = 6.44$, $\\sinh^2 = 41.5$, and $V_0^2/4E(V_0 - E) = 4/4 = 1$.',
        '$T = 1/(1 + 41.5) = 0.0235$. The thick-barrier rule gives $4e^{-5.12} = 0.0238$ — already close.'
      ],
      a: 'About 2.4 %.'
    },
    {
      title: 'The microscope that feels atoms',
      q: 'In a scanning tunnelling microscope the electrons must cross a vacuum gap with a barrier of about 4.5 eV (the work function). By what factor does the current fall when the gap widens by 0.1 nm, and by 0.01 nm?',
      steps: [
        '$\\kappa = \\sqrt{2m \\times 4.5\\ \\text{eV}}/\\hbar = 10.9$ nm⁻¹.',
        'For 0.1 nm: $e^{-2 \\times 10.9 \\times 0.1} = e^{-2.17} = 0.114$, a fall of about 9 times.',
        'For 0.01 nm: $e^{-0.217} = 0.80$ — a change of a twentieth of an atom\'s size alters the current by 20 %.'
      ],
      a: 'About ninefold per 0.1 nm; 20 % per 0.01 nm.'
    },
    {
      title: 'Mass matters',
      q: 'Compare an electron and a proton, each 1 eV short of the top of a barrier 0.1 nm wide, using $T \\sim e^{-2\\kappa a}$.',
      steps: [
        'Electron: $\\kappa = 5.12$ nm⁻¹, $2\\kappa a = 1.02$, $T \\sim 0.36$.',
        'Proton: 1836 times heavier, so $\\kappa$ is $\\sqrt{1836} = 42.8$ times larger: $2\\kappa a = 43.9$.',
        '$T \\sim e^{-43.9} \\approx 10^{-19}$.'
      ],
      a: 'The electron gets through a third of the time; the proton about once in 10¹⁹ tries.'
    }
  ],
  quiz: [
    { q: 'A thick barrier transmits $10^{-3}$ of the electrons. If its width is doubled, it transmits about…', choices: ['10⁻⁶', '5 × 10⁻⁴', '2 × 10⁻³', '10⁻⁴'], a: 0, why: 'T ≈ e^{−2κa}: doubling a squares the exponential factor.' },
    { q: 'Which particle tunnels most easily through the same barrier with the same energy deficit?', choices: ['an electron', 'a proton', 'a neutron', 'an alpha particle'], a: 0, why: 'κ grows as √m, and the electron is by far the lightest.' },
    { q: 'A particle with more energy than the top of a barrier is always transmitted.', a: false, why: 'A wave is partly reflected at each edge; T = 1 only at resonances where the reflections cancel.' },
    { q: 'Inside the barrier the wave function…', choices: ['decays exponentially without oscillating', 'oscillates with a shorter wavelength', 'is exactly zero', 'grows without limit'], a: 0, why: 'With V > E, φ″ = κ²φ: exponentials, not waves.' },
    { q: 'An electron that has tunnelled through a barrier comes out with…', choices: ['the same energy it had before', 'less energy, spent inside the barrier', 'more energy, borrowed from the barrier', 'zero energy'], a: 0, why: 'The barrier does no net work: a stationary state has one energy everywhere.' }
  ],
  problems: [
    { q: 'What is the decay constant κ for an electron 4.5 eV below the top of a barrier?', answer: 10.87, unit: '1/nm', tol: 0.02, hint: 'κ = √(2mΔE)/ħ.',
      steps: ['$\\sqrt{2 \\times 9.109\\times10^{-31} \\times 4.5 \\times 1.602\\times10^{-19}} = 1.146\\times10^{-24}$ kg·m/s.', 'Divided by $\\hbar$: $1.087\\times10^{10}$ m⁻¹ = 10.9 nm⁻¹.'] },
    { q: 'With κ = 10.9 nm⁻¹, by what factor does the tunnelling current drop when the gap grows by 0.1 nm?', answer: 8.8, tol: 0.03, hint: 'The current is proportional to e^{−2κa}.',
      steps: ['$e^{2 \\times 10.87 \\times 0.1} = e^{2.17} = 8.8$.'] }
  ],
  applications: [
    'The scanning tunnelling microscope images and moves single atoms by the tunnelling current between a sharp tip and a surface.',
    'Flash memory in phones and USB sticks writes each bit by tunnelling electrons through an oxide layer a few nanometres thick onto an insulated gate.',
    'Alpha-emitting nuclei, from polonium to uranium, owe their enormously varied half-lives to the exponential in the tunnelling probability.',
    'Nuclear fusion in the Sun happens at 15 million kelvin only because protons tunnel through the Coulomb barrier that classically would stop them.'
  ],
  history: 'Friedrich Hund used barrier penetration for molecules in 1927. In 1928 George Gamow, and independently Ronald Gurney and Edward Condon, explained alpha decay as tunnelling, and Ralph Fowler and Lothar Nordheim explained the pulling of electrons out of metals by strong fields. Leo Esaki made the tunnel diode in 1957 and Ivar Giaever measured tunnelling into superconductors in 1960; they shared the 1973 Nobel Prize with Brian Josephson. Gerd Binnig and Heinrich Rohrer built the scanning tunnelling microscope at IBM Zurich in 1981 (Nobel Prize 1986).',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 16 (The Dependence of Amplitudes on Position) — the wave function in a potential well, and why only certain energies are allowed.',
    'Vol. III, ch. 8 (The Hamiltonian Matrix) and ch. 9 (The Ammonia Maser) — the ammonia molecule, whose nitrogen atom has a small amplitude to get through the plane of the hydrogens, splitting the energy into two levels.',
    'Vol. III, ch. 21 (The Schrödinger Equation in a Classical Context: A Seminar on Superconductivity) — the Josephson junction, two superconductors joined through a thin insulating layer.'
  ],
  sim: 'wim-tunnel'
},

{
  id: 'angular-momentum-quantum', parent: 'waves-in-matter', title: 'Angular momentum in quantum mechanics', level: 3,
  short: 'Angular momentum comes in steps of ħ: along any chosen axis its component is mħ, with m running in whole steps from −l to +l, while its size is √(l(l + 1)) ħ. The states of definite angular momentum are the shapes of atomic orbitals, and its conservation decides which transitions and decays can happen.',
  keywords: ['angular momentum', 'orbital', 'spherical harmonics', 'L_z', 'quantum number', 'magnetic quantum number', 'vector model', 's p d f', 'selection rules', 'photon spin', 'positronium', 'Zeeman effect', 'Bohr magneton', 'rotation'],
  prereq: ['stern-gerlach-filters', 'spin-half', 'symmetry-and-conservation-qm', 'rotation-feyn'],
  related: ['hydrogen-and-periodic-table', 'operators-feyn', 'hyperfine-21cm', 'magnetism-of-matter', 'paramagnetism-nmr', 'physics:angular-momentum', 'physics:quantum-numbers', 'chemistry:orbital-shapes'],
  body: `
Angular momentum is where, in quantum mechanics, a symmetry turns directly into a number. Feynman approached it through rotations. Turn your apparatus about the $z$-axis by an angle $\\phi$, and a state with a definite $z$-component of angular momentum comes back as itself multiplied by a [[?phase]] factor $e^{im\\phi}$. The conserved number $m$ counts the turns of phase the state makes as you rotate once round the axis, and the $z$-component of angular momentum is

$$L_z = m\\hbar$$

For orbital motion the wave function must be single-valued — a rotation by $2\\pi$ brings it back to itself — so $m$ is a whole number. For spin, a turn of $2\\pi$ may reverse the sign of the amplitude, as it does for [[spin-half|spin one-half]], and half-integers are allowed too.

### The ladder of m
A state of angular momentum quantum number $l$ has $2l + 1$ possible values of $m$: $-l, -l + 1, \\ldots, l$. That is why a Stern–Gerlach magnet splits a beam of atoms into $2l + 1$ beams ([[stern-gerlach-filters]]). The size of the angular momentum is not $l\\hbar$ but

$$|\\mathbf{L}| = \\sqrt{l(l + 1)}\\,\\hbar$$

always larger than the largest $L_z$. So the angular momentum never points exactly along the axis. In the "vector model" it lies somewhere on a cone round $z$, with a definite $L_z$ but no definite $L_x$ or $L_y$: the components are [[?operator|operators]] that do not [[?commutator|commute]], and knowing one exactly leaves the others uncertain.

| $l$ | name | states $2l + 1$ | $\\lvert\\mathbf{L}\\rvert/\\hbar$ | smallest angle to the axis |
|---|---|---|---|---|
| 0 | s | 1 | 0 | — |
| 1 | p | 3 | 1.41 | 45° |
| 2 | d | 5 | 2.45 | 35.3° |
| 3 | f | 7 | 3.46 | 30° |

### Orbitals as shapes
For an electron in an atom the angular part of the wave function is a spherical harmonic, $Y_{lm}(\\theta,\\phi) \\propto P_l^m(\\cos\\theta)\\,e^{im\\phi}$. The factor $e^{im\\phi}$ has absolute value 1, so the [[?probability-density|probability density]] of a state of definite $m$ is the same all the way round the $z$-axis: states with $m = \\pm l$ are doughnuts around the axis, $m = 0$ states are stretched along it. The familiar dumbbells $p_x$ and $p_y$ are sums of $m = +1$ and $m = -1$ — [[?superposition|superpositions]] with no definite $L_z$. In the simulation the colours of the cloud show the phase winding $m$ times round the axis.

### Rules for light and decay
A photon carries one unit of angular momentum. So when an atom emits light in the usual (electric dipole) way, $l$ changes by one and $m$ by at most one: $\\Delta l = \\pm1$, $\\Delta m = 0, \\pm1$. Hydrogen's 2p state falls to 1s in 1.6 ns, emitting the 121.6 nm Lyman-α line; the 2s state cannot do that with one photon and lives about 0.12 s, until it emits two. The same bookkeeping, together with parity, decides that positronium with opposite spins decays into two photons in 0.12 ns, while with parallel spins it must make three and lives 142 ns — one of the examples Feynman worked through.

### Magnets and the Zeeman effect
An orbiting electron is a tiny current loop with magnetic moment $\\mu_z = -m\\mu_B$, where the Bohr magneton $\\mu_B = 5.79\\times10^{-5}$ eV/T. In a field $B$ the $2l + 1$ states split in energy by $m\\mu_B B$: in 1 T neighbouring $m$ are $5.8\\times10^{-5}$ eV apart, a frequency of 14 GHz, and spectral lines split into several — the Zeeman effect.

> [!key] Angular momentum is quantised because rotations are a symmetry: $L_z = m\\hbar$ with $m$ from $-l$ to $l$ in whole steps, and $|\\mathbf{L}| = \\sqrt{l(l + 1)}\\,\\hbar$. Its states are the orbital shapes of chemistry, and its conservation decides which transitions are allowed.

Angular momenta combine by the same rules: two spin-halves make a total of 1 (three states) or 0 (one state), which is the origin of hydrogen's [[hyperfine-21cm|21-cm line]].
`,
  ideas: [
    'A rotation by φ about z multiplies a state of definite L_z by e^{imφ}; L_z = mħ.',
    'For orbital motion m is an integer from −l to l: 2l + 1 states. Spin also allows half-integers.',
    'The size of the angular momentum is √(l(l + 1)) ħ, so it can never point exactly along the axis.',
    'The spherical harmonics Y_lm are the shapes of s, p, d and f orbitals; states of definite m are symmetric about the z-axis.',
    'A photon carries one unit of angular momentum, so dipole transitions obey Δl = ±1, Δm = 0, ±1.'
  ],
  pitfalls: [
    'With m = l the angular momentum points straight along z — Its size √(l(l + 1))ħ is larger than lħ, so it always leans at an angle; L_x and L_y cannot both be zero.',
    'The p orbitals are dumbbells because the electron swings along them — The shapes are probability clouds of standing waves; a state of definite m is a doughnut about the axis, and the dumbbells are superpositions of +m and −m.',
    'Orbital angular momentum can take half-integer values — Orbital wave functions must come back to themselves after a full turn, so m is an integer; half-integers belong to spin.'
  ],
  formulas: [
    {
      name: 'The component along an axis',
      expr: 'Lz = m*hbar', tex: 'L_z = m\\hbar',
      vars: {
        Lz: { name: 'component of angular momentum along z', q: 'angmom', unit: 'ħ', signed: true, tex: 'L_z' },
        m: { name: 'magnetic quantum number (−l … l)', int: true, signed: true, value: 2 },
        hbar: { const: 'hbar' }
      },
      note: 'Switch the unit to J·s to see how small ħ = 1.055 × 10⁻³⁴ J·s is.',
      stories: { Lz: 'An electron is in a state with m = {m}. What is its angular momentum along the axis?' }
    },
    {
      name: 'The size of the angular momentum',
      expr: 'L = sqrt(l*(l + 1))*hbar', tex: 'L = \\sqrt{l(l + 1)}\\,\\hbar',
      vars: {
        L: { name: 'size of the angular momentum', q: 'angmom', unit: 'ħ' },
        l: { name: 'orbital quantum number (0, 1, 2 …)', int: true, value: 2 },
        hbar: { const: 'hbar' }
      },
      note: 'For large l, √(l(l + 1)) ≈ l + ½: the classical limit.',
      stories: { L: 'What is the size of the orbital angular momentum of a d electron (l = {l})?', l: 'An electron has orbital angular momentum of size {L}. What is l?' }
    },
    {
      name: 'The angle of the cone',
      expr: 'theta = acos(m/sqrt(l*(l + 1)))', tex: '\\cos\\theta = \\dfrac{m}{\\sqrt{l(l + 1)}}',
      vars: {
        theta: { name: 'angle between the angular momentum and the axis', q: 'angle', unit: '°', tex: '\\theta', min: 0, max: 180 },
        m: { name: 'magnetic quantum number', int: true, signed: true, value: 1 },
        l: { name: 'orbital quantum number', int: true, value: 2 }
      },
      note: 'The vector model: L lies on a cone about z. Even m = l leaves an angle.',
      stories: { theta: 'In the vector model, at what angle to the axis does the angular momentum of a state with l = {l}, m = {m} lie?' },
      practice: { unknowns: ['theta'] }
    },
    {
      name: 'Zeeman splitting',
      expr: 'dE = m*muB*B', tex: '\\Delta E = m\\,\\mu_B B',
      vars: {
        dE: { name: 'energy shift of the state', q: 'energy', unit: 'eV', signed: true, tex: '\\Delta E' },
        m: { name: 'magnetic quantum number', int: true, signed: true, value: 1 },
        muB: { const: 'muB' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 }
      },
      note: 'For orbital angular momentum (the normal Zeeman effect); with spin the factor g changes it.',
      stories: { dE: 'An atom in a state with m = {m} sits in a field of {B}. By how much is its energy shifted?', B: 'What field shifts the m = {m} state by {dE}?' }
    }
  ],
  examples: [
    {
      title: 'The five states of a d electron',
      q: 'For $l = 2$, list the possible $L_z$, the size of $\\mathbf{L}$, and the smallest angle it can make with the axis.',
      steps: [
        '$m = -2, -1, 0, 1, 2$, so $L_z = -2\\hbar, -\\hbar, 0, \\hbar, 2\\hbar$ — five states.',
        '$|\\mathbf{L}| = \\sqrt{2 \\times 3}\\,\\hbar = 2.45\\hbar = 2.58\\times10^{-34}$ J·s.',
        'The smallest angle is for $m = 2$: $\\cos\\theta = 2/2.45 = 0.816$, $\\theta = 35.3°$.'
      ],
      a: 'Five values from −2ħ to 2ħ; |L| = 2.45ħ; the angle is at least 35.3°.'
    },
    {
      title: 'A p level in a magnet',
      q: 'A p state ($l = 1$) sits in a field of 1.5 T. How far apart are its three energies, as an energy and as a frequency?',
      steps: [
        'Neighbouring $m$ differ by $\\mu_B B = 5.788\\times10^{-5} \\times 1.5 = 8.68\\times10^{-5}$ eV.',
        'As a frequency, $\\Delta E/h = 8.68\\times10^{-5}\\ \\text{eV}/4.136\\times10^{-15}\\ \\text{eV·s} = 2.1\\times10^{10}$ Hz.'
      ],
      a: '8.7 × 10⁻⁵ eV apart, or 21 GHz.'
    },
    {
      title: 'Why the 2s state of hydrogen lives so long',
      q: 'Hydrogen in its 2p state decays to 1s in about 1.6 ns. Why does the 2s state last some 0.12 s?',
      steps: [
        'A photon carries one unit of angular momentum, so a single-photon dipole transition must change $l$ by one.',
        '2s → 1s has $\\Delta l = 0$: forbidden for one photon. The atom must emit two photons at once, a far slower process.'
      ],
      a: 'Conservation of angular momentum forbids the one-photon decay, so it waits for the rare two-photon one — about 10⁸ times longer.'
    }
  ],
  quiz: [
    { q: 'How many values of $m$ are there for an f electron ($l = 3$)?', choices: ['7', '3', '4', '6'], a: 0, why: 'm runs from −3 to 3 in whole steps: 2l + 1 = 7.' },
    { q: 'For a state with $m = l$, is $L_z$ equal to the size of $\\mathbf{L}$?', choices: ['no: lħ is less than √(l(l + 1))ħ unless l = 0', 'yes, the vector points along z', 'only for l = 1', 'only in a magnetic field'], a: 0, why: 'l < √(l(l + 1)) for every l ≥ 1: the angular momentum always leans away from the axis.' },
    { q: 'An electron in an s state has zero orbital angular momentum.', a: true, why: 'l = 0 gives √(0·1)ħ = 0 and m = 0; the s cloud is spherical.' },
    { q: 'Can hydrogen go from 3d to 1s by emitting one photon (electric dipole)?', choices: ['no: Δl would be 2', 'yes, always', 'only if m does not change', 'only in a magnetic field'], a: 0, why: 'A single photon carries one unit: Δl = ±1. 3d reaches 1s through 2p.' },
    { q: 'For orbital angular momentum $m$ must be a whole number because…', choices: ['the wave function must return to itself after a turn of 2π', 'energy is quantised', 'electrons are fermions', 'of the exclusion principle'], a: 0, why: 'e^{imφ} must equal 1 at φ = 2π, which needs integer m.' }
  ],
  problems: [
    { q: 'At what angle to the axis does the angular momentum of a state with l = 3, m = 3 lie (vector model)?', answer: 30, unit: '°', tol: 0.02, hint: 'cos θ = m/√(l(l + 1)).',
      steps: ['$\\sqrt{3 \\times 4} = 3.464$.', '$\\cos\\theta = 3/3.464 = 0.866$, $\\theta = 30°$.'] },
    { q: 'In a field of 0.5 T, what is the frequency corresponding to the splitting between neighbouring m states (orbital moment)?', answer: 7.0, unit: 'GHz', tol: 0.02, hint: 'ΔE = μ_B B, f = ΔE/h.',
      steps: ['$\\mu_B B = 9.274\\times10^{-24} \\times 0.5 = 4.64\\times10^{-24}$ J.', '$f = 4.64\\times10^{-24}/6.626\\times10^{-34} = 7.0\\times10^{9}$ Hz.'] }
  ],
  applications: [
    'Chemistry: the s, p, d and f orbitals — and the directions of chemical bonds — are the angular momentum states of electrons.',
    'Selection rules explain which lines appear in spectra, why some excited states are long-lived, and how lasers are designed to store energy.',
    'Magnetic resonance (MRI, ESR) flips angular momentum states split by a magnetic field.',
    'The Zeeman splitting of spectral lines measures magnetic fields on the Sun and on other stars.'
  ],
  history: 'Niels Bohr quantised angular momentum in steps of ħ in his 1913 model of hydrogen. Pieter Zeeman saw spectral lines split in a magnetic field in 1896. Otto Stern and Walther Gerlach split a beam of silver atoms with a magnet in 1922, a result later understood as the electron\'s spin, which George Uhlenbeck and Samuel Goudsmit proposed in 1925. Positronium was discovered by Martin Deutsch in 1951.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 18 (Angular Momentum) — electric dipole radiation, light scattering, the annihilation of positronium, the rotation matrix for any spin, and the composition of angular momentum.',
    'Vol. III, ch. 17 (Symmetry and Conservation Laws) — how symmetry under rotations goes with the conservation of angular momentum, with polarized light and the disintegration of the Λ⁰ as examples.',
    'Vol. III, ch. 20 (Operators) — angular momentum as an operator.',
    'Vol. II, ch. 34 (The Magnetism of Matter) — magnetic moments of atoms and the quantization of angular momentum.'
  ],
  sim: 'wim-orbitals'
},

{
  id: 'hydrogen-and-periodic-table', parent: 'waves-in-matter', title: 'The hydrogen atom and the periodic table', level: 2,
  short: 'The Schrödinger equation for an electron bound to a proton gives energies −13.6 eV/n², with 2n² states in level n labelled by n, l, m and spin. Photons between the levels make hydrogen\'s spectral lines. Fill such states with electrons, two to an orbital and lowest energy first, and out comes the periodic table.',
  keywords: ['hydrogen atom', 'energy levels', 'Rydberg constant', 'Balmer series', 'Lyman series', 'spectral lines', 'radial probability', 'Bohr radius', 'quantum numbers', 'orbitals', 'shells', 'electron configuration', 'periodic table', 'noble gases', 'ionisation energy', 'screening'],
  prereq: ['schrodinger-equation-feyn', 'angular-momentum-quantum', 'exclusion-principle'],
  related: ['uncertainty-feyn', 'hyperfine-21cm', 'identical-particles', 'physics:hydrogen-atom-quantum', 'physics:hydrogen-spectrum', 'physics:bohr-model', 'chemistry:electron-configuration', 'chemistry:periodic-table', 'chemistry:atomic-spectra'],
  body: `
Hydrogen is the one atom whose Schrödinger equation can be solved exactly, and its solution explains the rest of the periodic table almost for free.

### How big is an atom?
Before solving anything, Feynman estimated the size of hydrogen from the [[uncertainty-feyn|uncertainty principle]]. Confine the electron within a radius $a$ and its momentum is at least about $\\hbar/a$, so its energy is roughly

$$E(a) = \\frac{\\hbar^2}{2ma^2} - \\frac{e^2}{4\\pi\\varepsilon_0 a}$$

Squeezing lowers the potential energy but raises the kinetic energy. The best compromise, where the [[?derivative]] $dE/da$ is zero, is at $a_0 = 4\\pi\\varepsilon_0\\hbar^2/me^2 = 0.0529$ nm, with $E = -13.6$ eV — both, as it happens, exactly right. Atoms are the size they are because electrons are waves.

### The exact solution
With $V = -e^2/4\\pi\\varepsilon_0 r$ the wave function separates into a radial and an angular part, $\\psi = R_{nl}(r)\\,Y_{lm}(\\theta,\\phi)$, with the angular shapes of [[angular-momentum-quantum]]. The energies depend only on the principal quantum number $n$:

$$E_n = -\\frac{13.6\\ \\text{eV}}{n^2}$$

For each $n$, $l$ runs from 0 to $n - 1$ and $m$ from $-l$ to $l$: $n^2$ states, or $2n^2$ counting the electron's two spin states. The radial part has $n - l - 1$ nodes — spheres on which the density is zero.

### Where the electron is
The chance of finding the electron between $r$ and $r + dr$ is $P(r)\\,dr = r^2R_{nl}^2\\,dr$: the [[?probability-density|probability density]] times the area $4\\pi r^2$ of a thin shell. For 1s it peaks at exactly $a_0$, though the average distance is $1.5\\,a_0$. For the "circular" states $l = n - 1$ the peak is at $n^2a_0$: an atom with $n = 10$ is a hundred times bigger than in its ground state.

| $n$ | $E_n$ | states (with spin) | peak for $l = n - 1$ |
|---|---|---|---|
| 1 | −13.6 eV | 2 | $a_0 = 0.053$ nm |
| 2 | −3.40 eV | 8 | $4a_0$ |
| 3 | −1.51 eV | 18 | $9a_0$ |
| 4 | −0.85 eV | 32 | $16a_0$ |

### Spectral lines
When the electron drops from level $n_i$ to $n_f$ a photon carries away the difference, so $1/\\lambda = R_\\infty(1/n_f^2 - 1/n_i^2)$, with the Rydberg constant $R_\\infty = 1.097\\times10^7$ m⁻¹. Drops to $n = 2$ give the visible Balmer lines: red Hα at 656 nm (3 → 2), blue-green Hβ at 486 nm, violet lines at 434 and 410 nm. Drops to $n = 1$ make the ultraviolet Lyman series (Lyman-α at 121.6 nm), drops to $n = 3$ the infrared Paschen series.

### Building the periodic table
In a many-electron atom each electron moves in the field of the nucleus, partly screened by the other electrons. States of low $l$ reach in close to the nucleus, where the screening is weak, so they lie lower: 2s below 2p, and 4s even below 3d. Filling the states in order of energy, two electrons per orbital — spin up and spin down, as the [[exclusion-principle]] allows — gives shells that close at 2, 10, 18, 36, 54 and 86 electrons: helium, neon, argon, krypton, xenon and radon. The rows of the table have 2, 8, 8, 18, 18 and 32 elements.

A closed shell is hard to break into: helium needs 24.6 eV to lose an electron, neon 21.6 eV. The next element has one electron alone in a new, larger shell, easily lost — lithium 5.4 eV, sodium 5.1 eV, potassium 4.3 eV — which is why the alkali metals are so reactive. Chemistry, in this picture, is the arithmetic of filling shells.

> [!key] Hydrogen's energies are $-13.6\\ \\text{eV}/n^2$, with $2n^2$ states in level $n$; photons between the levels make its spectral lines. Fill such states with electrons, two to an orbital and lowest energy first, and the periodic table appears.

In the simulations, click two levels to emit a photon and see its colour, compare the radial probabilities of 2s and 2p, and add electrons one at a time to watch the shells close at the noble gases.
`,
  ideas: [
    'The uncertainty principle alone gives the size of hydrogen, a₀ = 0.053 nm, and its binding energy, 13.6 eV.',
    'Hydrogen\'s energies are E_n = −13.6 eV/n², with n² orbitals (2n² states with spin) in level n.',
    'The radial probability r²R² shows where the electron is; the size of the atom grows as n².',
    'Spectral lines come from jumps between levels: 1/λ = R∞(1/n_f² − 1/n_i²).',
    'Screening lifts states of higher l; filling orbitals two at a time in order of energy builds the periodic table.'
  ],
  pitfalls: [
    'The electron orbits the proton on a circle of radius a₀ — It has no orbit: a₀ is where the radial probability peaks, and the electron can be found closer or farther, even inside the proton.',
    'In every atom the 3d states fill before 4s, because 3 is less than 4 — Screening makes 4s lower in potassium and calcium; the order of filling is not the order of n.',
    'The shells hold 2, 8, 8, 18… electrons because of hydrogen\'s 2n² — Hydrogen gives 2, 8, 18, 32 per n; the periods of the table differ because screening regroups the subshells.'
  ],
  formulas: [
    {
      name: 'Energy levels of hydrogen (and one-electron ions)',
      expr: 'E = -Z^2*Ry/n^2', tex: 'E_n = -\\dfrac{Z^2\\,\\mathrm{Ry}}{n^2}',
      vars: {
        E: { name: 'energy of level n', q: 'energy', unit: 'eV', signed: true, tex: 'E_n' },
        Z: { name: 'nuclear charge number (1 for hydrogen, 2 for He⁺)', int: true, value: 1 },
        Ry: { const: 'Ry' },
        n: { name: 'principal quantum number', int: true, value: 2 }
      },
      note: 'Ry = 13.6 eV, the Rydberg energy. Measured from the ionised atom: E_n is negative for a bound electron.',
      stories: { E: 'What is the energy of level n = {n} of an ion with Z = {Z}?', n: 'Which level of hydrogen (Z = {Z}) has the energy {E}?' }
    },
    {
      name: 'Wavelength of a spectral line',
      expr: 'lambda = 1/(Rinf*(1/nf^2 - 1/ni^2))', tex: '\\dfrac{1}{\\lambda} = R_\\infty\\left(\\dfrac{1}{n_f^2} - \\dfrac{1}{n_i^2}\\right)',
      vars: {
        lambda: { name: 'wavelength of the photon', q: 'length', unit: 'nm', tex: '\\lambda' },
        Rinf: { const: 'Rinf' },
        nf: { name: 'final level', int: true, value: 2, tex: 'n_f' },
        ni: { name: 'initial level', int: true, value: 3, tex: 'n_i' }
      },
      solveFor: 'lambda',
      note: 'n_f = 1 Lyman (ultraviolet), 2 Balmer (visible), 3 Paschen (infrared). R∞ ignores the motion of the proton, a 0.05 % correction.',
      stories: { lambda: 'Hydrogen falls from level {ni} to level {nf}. What wavelength does it emit?', ni: 'A hydrogen line of {lambda} ends on level {nf}. Which level did it start from?' }
    },
    {
      name: 'Size of a circular state',
      expr: 'r = n^2*a0/Z', tex: 'r_n = \\dfrac{n^2 a_0}{Z}',
      vars: {
        r: { name: 'most probable radius for l = n − 1', q: 'length', unit: 'nm', tex: 'r_n' },
        n: { name: 'principal quantum number', int: true, value: 2 },
        a0: { const: 'a0' },
        Z: { name: 'nuclear charge number', int: true, value: 1 }
      },
      note: 'Where r²R² peaks for the states with l = n − 1 (the same radii as Bohr\'s orbits).',
      stories: { r: 'How big is hydrogen in its circular state with n = {n}?', n: 'A hydrogen atom in a circular state is {r} in radius. What is n?' }
    }
  ],
  examples: [
    {
      title: 'The red line of hydrogen',
      q: 'Find the energy and wavelength of the photon emitted when hydrogen falls from $n = 3$ to $n = 2$.',
      steps: [
        '$\\Delta E = 13.6\\ \\text{eV}\\,(1/4 - 1/9) = 13.6 \\times 0.1389 = 1.89$ eV.',
        '$\\lambda = hc/\\Delta E = 1239.8\\ \\text{eV·nm}/1.89\\ \\text{eV} = 656$ nm.'
      ],
      a: '1.89 eV, 656 nm — the red Hα line that colours emission nebulae.'
    },
    {
      title: 'The size of hydrogen from the uncertainty principle',
      q: 'Minimise $E(a) = \\hbar^2/2ma^2 - e^2/4\\pi\\varepsilon_0 a$ to find the size and energy of hydrogen.',
      steps: [
        '$dE/da = -\\hbar^2/ma^3 + e^2/4\\pi\\varepsilon_0 a^2 = 0$ gives $a = 4\\pi\\varepsilon_0\\hbar^2/me^2 = 5.29\\times10^{-11}$ m.',
        'Put it back: the kinetic energy is half the size of the potential energy, and $E = -\\tfrac12 e^2/4\\pi\\varepsilon_0 a_0 = -2.18\\times10^{-18}$ J $= -13.6$ eV.'
      ],
      a: 'a₀ = 0.053 nm and E = −13.6 eV — the exact values, from a rough argument.'
    },
    {
      title: 'Why sodium gives up an electron',
      q: 'Sodium\'s outer electron is in a 3s state and needs 5.14 eV to remove. Hydrogen\'s $n = 3$ needs only 1.51 eV. What effective nuclear charge does the 3s electron feel?',
      steps: [
        'Write $5.14 = 13.6\\,Z_{\\text{eff}}^2/9$.',
        '$Z_{\\text{eff}}^2 = 3.40$, so $Z_{\\text{eff}} = 1.84$.',
        'The ten inner electrons do not screen the nucleus (charge 11) completely: the 3s wave function reaches inside them.'
      ],
      a: 'About 1.8 — more than 1 because the 3s electron penetrates the inner shells.'
    }
  ],
  quiz: [
    { q: 'How many states (counting spin) does hydrogen have with $n = 3$?', choices: ['18', '9', '6', '3'], a: 0, why: 'l = 0, 1, 2 gives 1 + 3 + 5 = 9 orbitals, each with two spin states.' },
    { q: 'Which jump in hydrogen emits the shortest wavelength?', choices: ['n = 2 → 1', 'n = 3 → 2', 'n = 4 → 3', 'n = 5 → 4'], a: 0, why: 'The biggest energy gap is the one to the ground state: 10.2 eV, 122 nm.' },
    { q: 'In hydrogen, according to the Schrödinger equation, the 2s and 2p states have the same energy.', a: true, why: 'Hydrogen\'s energies depend only on n. In other atoms screening separates them.' },
    { q: 'Why is 4s filled before 3d in potassium?', choices: ['the 4s electron reaches close to the nucleus, where screening is weak, so it lies lower', '4s has more nodes', 'd orbitals are forbidden by the exclusion principle', 'because 4s has higher energy'], a: 0, why: 'Penetration makes low-l states feel more of the nuclear charge.' },
    { q: 'Neon needs 21.6 eV to lose an electron, sodium only 5.1 eV. Why?', choices: ['sodium\'s outer electron is alone in a new, larger shell', 'neon has fewer protons', 'sodium is a metal and metals have no binding', 'neon\'s electrons have no spin'], a: 0, why: 'A closed shell is tightly bound; the next electron starts a new shell, far out and well screened.' }
  ],
  problems: [
    { q: 'What is the wavelength of Lyman-α (hydrogen, n = 2 → 1), using R∞ = 1.0974 × 10⁷ m⁻¹?', answer: 121.5, unit: 'nm', tol: 0.01, hint: '1/λ = R∞(1 − 1/4).',
      steps: ['$1/\\lambda = 1.0974\\times10^7 \\times 0.75 = 8.23\\times10^6$ m⁻¹.', '$\\lambda = 121.5$ nm, in the ultraviolet.'] },
    { q: 'What is the ground-state energy of the helium ion He⁺ (one electron, Z = 2)?', answer: -54.4, unit: 'eV', tol: 0.01, hint: 'E = −Z² × 13.6 eV/n².',
      steps: ['$E_1 = -4 \\times 13.6 = -54.4$ eV — four times deeper than hydrogen.'] }
  ],
  applications: [
    'Astronomers read hydrogen\'s lines in the light of stars and galaxies; the red glow of emission nebulae is hydrogen falling from n = 3 to n = 2.',
    'The pattern of ionisation energies, valences and atomic sizes across the periodic table follows from the filling of shells — see [[chemistry:electron-configuration|electron configurations]].',
    'Rydberg atoms, with n of 50 to 100, are nearly a micrometre across and are used in experiments on quantum computing.',
    'Hydrogen spectroscopy tests quantum electrodynamics: the 1s–2s transition has been measured to about 15 significant figures.'
  ],
  history: 'Dmitri Mendeleev arranged the elements by their properties in 1869. Johann Balmer found the formula for hydrogen\'s visible lines in 1885 and Johannes Rydberg generalised it in 1888. Niels Bohr explained the levels with his model in 1913, the same year Henry Moseley showed that the order of the table is the nuclear charge. Wolfgang Pauli stated the exclusion principle in 1925, and Erwin Schrödinger solved hydrogen exactly in 1926.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 19 (The Hydrogen Atom and The Periodic Table) — the Schrödinger equation for hydrogen, spherically symmetric solutions, states with an angular dependence, the hydrogen wave functions, and the periodic table.',
    'Vol. III, ch. 2 (The Relation of Wave and Particle Viewpoints) — the size of an atom estimated from the uncertainty principle (also Vol. I, ch. 38).',
    'Vol. III, ch. 4 (Identical Particles) — the exclusion principle that fills the shells.'
  ],
  sim: ['wim-hydrogen', 'wim-shells']
},

{
  id: 'operators-feyn', parent: 'waves-in-matter', title: 'Operators', level: 3,
  short: 'An operator is an instruction that makes one state out of another. Every measurable quantity has one, and the average of many measurements is the "sandwich" ⟨ψ|Â|ψ⟩. For momentum the instruction is "take −iħ times the slope". Because position and momentum do not commute, Δx Δp can never be smaller than ħ/2.',
  keywords: ['operator', 'Hamiltonian', 'expectation value', 'average energy', 'position operator', 'momentum operator', '−iħ d/dx', 'commutator', 'uncertainty product', 'Ehrenfest theorem', 'observable', 'eigenstate', 'Hermitian'],
  prereq: ['schrodinger-equation-feyn', 'hamiltonian-matrix', 'uncertainty-feyn'],
  related: ['angular-momentum-quantum', 'probability-amplitudes', 'symmetry-and-conservation-qm', 'physics:uncertainty-principle', 'math:eigenvalues', 'math:expected-value', 'math:matrices'],
  body: `
In the language Feynman built up from base states, an operator is simply an instruction: it takes one state and makes another from it, $\\hat{A}|\\psi\\rangle = |\\phi\\rangle$. The most important is the Hamiltonian: $\\hat{H}|\\psi\\rangle$, divided by $i\\hbar$, is how fast $|\\psi\\rangle$ changes. In a set of base states an operator is a [[?matrix]], $A_{ij} = \\langle i|\\hat{A}|j\\rangle$ in the [[?bra-ket|bracket notation]]; for a wave function spread through space it is a rule that acts on the function $\\psi(x)$.

### Averages as sandwiches
Suppose a state is a mixture of stationary states, $|\\psi\\rangle = \\sum_i C_i|\\eta_i\\rangle$, with energies $E_i$. Measure the energy many times: you get $E_i$ with probability $|C_i|^2$, so the average is $\\langle E\\rangle = \\sum_i E_i|C_i|^2$. The same number can be written as a sandwich,

$$\\langle E\\rangle = \\langle\\psi|\\hat{H}|\\psi\\rangle = \\int \\psi^*\\,\\hat{H}\\psi\\,dx$$

— let the operator act on $\\psi$, multiply by the [[?conjugate|complex conjugate]] $\\psi^*$ and add up. No single measurement gives this [[?expectation-value|expectation value]]; it is the mean of many.

### The operators of position and momentum
For position the instruction is "multiply by $x$": $\\langle x\\rangle = \\int \\psi^*x\\,\\psi\\,dx$, the centre of the [[?probability-density|probability density]]. For momentum it is

$$\\hat{p} = -i\\hbar\\frac{\\partial}{\\partial x}$$

Why? A state of definite momentum is a wave $e^{ipx/\\hbar}$. Taking its slope brings down $ip/\\hbar$, and multiplying by $-i\\hbar$ leaves exactly $p$ times the same wave: the plane wave is an [[?eigenvalue|eigenstate]] of $\\hat{p}$, with eigenvalue $p$. A packet is a mixture of many momenta, and the sandwich gives their average.

| Quantity | Operator | What it does to $\\psi(x)$ |
|---|---|---|
| Position | $\\hat{x}$ | multiply by $x$ |
| Momentum | $\\hat{p} = -i\\hbar\\,\\partial/\\partial x$ | take the slope, times $-i\\hbar$ |
| Energy | $\\hat{H} = \\hat{p}^2/2m + V(x)$ | curvature term plus $V\\psi$ |
| Angular momentum | $\\hat{L}_z = -i\\hbar\\,\\partial/\\partial\\phi$ | slope round the $z$-axis |

All of them are [[?hermitian]], which is what makes their averages real numbers.

### Order matters: the uncertainty product
Apply $\\hat{p}$ and then $\\hat{x}$, or the other way round, and the results differ: $\\hat{x}\\hat{p}\\psi - \\hat{p}\\hat{x}\\psi = i\\hbar\\psi$ for any wave function. This [[?commutator]], $[\\hat{x},\\hat{p}] = i\\hbar$, is not zero, and from it follows that the spreads — the [[?standard-deviation|standard deviations]] $\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$ and $\\Delta p$ — cannot both be small:

$$\\Delta x\\,\\Delta p \\ge \\frac{\\hbar}{2}$$

A Gaussian packet reaches the limit exactly; every other shape does worse. A free packet starts at the limit and then spreads, so its product grows; the ground state of a harmonic well stays at the limit for ever.

### How averages move
Feynman also asked how averages change in time. The answers look like Newton's laws: $d\\langle x\\rangle/dt = \\langle p\\rangle/m$ and $d\\langle p\\rangle/dt = \\langle -dV/dx\\rangle$. When the force hardly varies across the packet, its centre moves like a classical particle — which is why the everyday world looks classical.

> [!key] An operator is an instruction acting on a state. The average of a quantity is $\\langle\\psi|\\hat{A}|\\psi\\rangle$; momentum's instruction is $-i\\hbar\\,\\partial/\\partial x$; and because $x$ and $p$ do not commute, $\\Delta x\\,\\Delta p \\ge \\hbar/2$.

In the simulation, pick an operator and see $\\hat{A}\\psi$ drawn under $\\psi$, with the integrand whose area is the average. Put a packet in a harmonic well and follow $\\langle x\\rangle$ and $\\langle p\\rangle$ round their classical ellipse, while the readout checks $\\Delta x\\,\\Delta p$ against $\\hbar/2$.
`,
  ideas: [
    'An operator turns one state into another; in base states it is a matrix, for wave functions a rule acting on ψ(x).',
    'The average of a quantity over many measurements is ⟨ψ|Â|ψ⟩ = ∫ψ*Âψ dx.',
    'The momentum operator is −iħ ∂/∂x: plane waves e^{ipx/ħ} are its eigenstates.',
    'x and p do not commute, [x̂, p̂] = iħ, so Δx Δp ≥ ħ/2; Gaussian packets reach the limit.',
    'Averages obey Newton-like laws: d⟨x⟩/dt = ⟨p⟩/m and d⟨p⟩/dt = ⟨−dV/dx⟩.'
  ],
  pitfalls: [
    'The expectation value is the value you will most likely measure — It is the mean of many measurements; a single energy measurement gives one of the E_i, and may never give the average itself.',
    'An operator acting on a state is a measurement of it — An operator is a mathematical instruction; Âψ is generally a different function, not "ψ after measuring A".',
    'A particle in a stationary state of a box is at rest, since ⟨p⟩ = 0 — ⟨p⟩ = 0 because +p and −p are equally likely; ⟨p²⟩ is not zero, and the spread Δp = ħπ/L for the ground state.'
  ],
  formulas: [
    {
      name: 'Momentum of a plane wave (eigenvalue of −iħ ∂/∂x)',
      expr: 'p = hbar*k', tex: 'p = \\hbar k',
      vars: {
        p: { name: 'momentum', q: 'momentum', unit: 'kg·m/s' },
        hbar: { const: 'hbar' },
        k: { name: 'wave number', q: 'wavenumber', unit: '1/nm', value: 10 }
      },
      note: '−iħ ∂/∂x applied to e^{ikx} gives ħk e^{ikx}.',
      stories: { p: 'An electron wave has wave number {k}. What is its momentum?', k: 'What wave number does a particle with momentum {p} have?' }
    },
    {
      name: 'Average energy of a two-state mixture',
      expr: 'Eavg = P1*E1 + (1 - P1)*E2', tex: '\\bar{E} = P_1E_1 + (1 - P_1)E_2',
      vars: {
        Eavg: { name: 'average of many energy measurements', q: 'energy', unit: 'eV', tex: '\\bar{E}' },
        P1: { name: 'probability |C₁|² of the first state', q: 'ratio', unit: '%', value: 40, min: 0, max: 100, tex: 'P_1' },
        E1: { name: 'energy of the first state', q: 'energy', unit: 'eV', value: 0.376, tex: 'E_1' },
        E2: { name: 'energy of the second state', q: 'energy', unit: 'eV', value: 1.504, tex: 'E_2' }
      },
      note: 'Each measurement gives E₁ or E₂, never the average. The defaults are the two lowest states of an electron in a 1 nm box.',
      stories: { Eavg: 'An electron is in a mixture with probability {P1} of energy {E1} and the rest of {E2}. What is the average energy?', P1: 'Energies {E1} and {E2} average to {Eavg}. What is the probability of the first?' }
    },
    {
      name: 'The smallest momentum spread for a given position spread',
      expr: 'dp = hbar/(2*dx)', tex: '\\Delta p = \\dfrac{\\hbar}{2\\,\\Delta x}',
      vars: {
        dp: { name: 'smallest possible momentum spread', q: 'momentum', unit: 'kg·m/s', tex: '\\Delta p' },
        hbar: { const: 'hbar' },
        dx: { name: 'position spread (standard deviation)', q: 'length', unit: 'nm', value: 0.1, tex: '\\Delta x' }
      },
      note: 'Reached only by a Gaussian packet; every other state has a larger product Δx Δp.',
      stories: { dp: 'An electron is localised with a spread of {dx}. What is the least spread its momentum can have?', dx: 'A particle has momentum spread {dp}. How small could its position spread be?' }
    },
    {
      name: 'Position spread in the ground state of a harmonic well',
      expr: 'dx = sqrt(hbar/(2*m*omega))', tex: '\\Delta x = \\sqrt{\\dfrac{\\hbar}{2m\\omega}}',
      vars: {
        dx: { name: 'position spread (standard deviation)', q: 'length', unit: 'nm', tex: '\\Delta x' },
        hbar: { const: 'hbar' },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' },
        omega: { name: 'angular frequency of the well', q: 'angvel', unit: 'rad/s', value: 1e15, tex: '\\omega' }
      },
      note: 'With Δp = √(ħmω/2) the product is exactly ħ/2: the ground state is a minimum-uncertainty Gaussian.',
      stories: { dx: 'An electron sits in the ground state of a harmonic well with {omega}. How wide is it?', omega: 'An electron\'s ground state in a harmonic well has a spread of {dx}. What is the angular frequency of the well?' }
    }
  ],
  examples: [
    {
      title: 'Average of a mixture',
      q: 'An electron in a 1 nm box is in the mixture $\\sqrt{0.4}\\,\\psi_1 + \\sqrt{0.6}\\,\\psi_2$, with $E_1 = 0.376$ eV and $E_2 = 1.504$ eV. What is its average energy, and what can one measurement give?',
      steps: [
        '$\\langle E\\rangle = 0.4 \\times 0.376 + 0.6 \\times 1.504 = 0.150 + 0.902 = 1.053$ eV.',
        'A single measurement gives 0.376 eV (40 % of the time) or 1.504 eV (60 %) — never 1.053 eV.'
      ],
      a: 'An average of 1.05 eV, made of results that are always 0.376 or 1.504 eV.'
    },
    {
      title: 'The uncertainty product in a box',
      q: 'For the ground state of a box of width $L$, $\\psi = \\sqrt{2/L}\\sin(\\pi x/L)$, show that $\\Delta x\\,\\Delta p$ is above $\\hbar/2$.',
      steps: [
        '$\\psi$ is real, so $\\langle p\\rangle = 0$. It is a sum of $e^{i\\pi x/L}$ and $e^{-i\\pi x/L}$, so $p = \\pm\\hbar\\pi/L$ and $\\Delta p = \\hbar\\pi/L$.',
        'Working out $\\langle x^2\\rangle - \\langle x\\rangle^2$ gives $\\Delta x = L\\sqrt{1/12 - 1/2\\pi^2} = 0.181\\,L$.',
        '$\\Delta x\\,\\Delta p = 0.181\\pi\\,\\hbar = 0.568\\,\\hbar$, a little above $0.5\\,\\hbar$: the state is not a Gaussian.'
      ],
      a: 'Δx Δp ≈ 0.57ħ, whatever the width of the box.'
    },
    {
      title: 'Squeezing an electron',
      q: 'An electron is localised to $\\Delta x = 0.1$ nm. What is the least spread of its momentum and of its velocity?',
      steps: [
        '$\\Delta p \\ge \\hbar/2\\Delta x = 1.055\\times10^{-34}/(2\\times10^{-10}) = 5.3\\times10^{-25}$ kg·m/s.',
        '$\\Delta v = \\Delta p/m = 5.3\\times10^{-25}/9.11\\times10^{-31} = 5.8\\times10^5$ m/s.'
      ],
      a: 'At least 5.3 × 10⁻²⁵ kg·m/s, a velocity spread of about 580 km/s — atomic electrons are fast.'
    }
  ],
  quiz: [
    { q: 'For a real wave function, such as a stationary state of a box, $\\langle p\\rangle$ is…', choices: ['zero', 'ħk', 'always positive', 'undefined'], a: 0, why: 'A real ψ has equal amplitudes for +p and −p; ∫ψ(−iħψ′)dx is imaginary unless it vanishes, and an average must be real.' },
    { q: 'Apply $-i\\hbar\\,\\partial/\\partial x$ to $e^{ikx}$. You get…', choices: ['ħk e^{ikx}', '−ħk e^{ikx}', 'ik e^{ikx}', 'ħ e^{ikx}'], a: 0, why: 'The slope is ik e^{ikx}; times −iħ gives ħk e^{ikx}: an eigenstate with p = ħk.' },
    { q: 'A single energy measurement on the mixture of 0.376 eV and 1.504 eV can give the average, 1.053 eV.', a: false, why: 'Each measurement gives one of the energies of the stationary states; only the mean of many is 1.053 eV.' },
    { q: 'The commutator $\\hat{x}\\hat{p} - \\hat{p}\\hat{x}$ equals…', choices: ['iħ', 'zero', 'ħ/2', '−ħ²'], a: 0, why: 'x(−iħψ′) − (−iħ)(xψ)′ = iħψ for every ψ.' },
    { q: 'A wave packet in a harmonic well: its average position…', choices: ['oscillates exactly like a classical particle at ω', 'stays at the centre', 'drifts steadily to one side', 'oscillates at 2ω'], a: 0, why: 'd⟨p⟩/dt = ⟨−mω²x⟩ = −mω²⟨x⟩: the averages obey the classical equation exactly for a harmonic force.' }
  ],
  problems: [
    { q: 'An electron is confined to Δx = 0.05 nm. What is the smallest possible Δp?', answer: 1.055e-24, unit: 'kg·m/s', tol: 0.02, hint: 'Δp = ħ/(2Δx).',
      steps: ['$\\Delta p = 1.0546\\times10^{-34}/(2 \\times 5\\times10^{-11}) = 1.05\\times10^{-24}$ kg·m/s.'] },
    { q: 'How wide (Δx) is the ground state of an electron in a harmonic well with ω = 1 × 10¹⁵ rad/s?', answer: 0.241, unit: 'nm', tol: 0.02, hint: 'Δx = √(ħ/2mω).',
      steps: ['$\\hbar/2m\\omega = 1.0546\\times10^{-34}/(2 \\times 9.109\\times10^{-31} \\times 10^{15}) = 5.79\\times10^{-20}$ m².', '$\\Delta x = 2.41\\times10^{-10}$ m = 0.24 nm.'] }
  ],
  applications: [
    'Every prediction of quantum chemistry — bond lengths, dipole moments, reaction energies — is an expectation value ⟨ψ|Â|ψ⟩ computed from a wave function.',
    'Quantum computers read out their answers by measuring operators on qubits and averaging over many runs.',
    'Gravitational-wave detectors inject "squeezed" light, which trades uncertainty between two non-commuting quantities, to beat the usual quantum noise.',
    'Electron-microscope and accelerator designers follow classical trajectories, justified because averages obey Newton\'s laws.'
  ],
  history: 'Werner Heisenberg wrote quantum mechanics with arrays of numbers in 1925, and Max Born and Pascual Jordan found that position and momentum obey xp − px = iħ. Erwin Schrödinger showed in 1926 that his wave mechanics is equivalent, with momentum as −iħ ∂/∂x. In 1927 Paul Ehrenfest showed that averages follow Newton\'s laws and Earle Kennard proved Δx Δp ≥ ħ/2, just after Heisenberg\'s paper on uncertainty. Paul Dirac introduced the bracket notation in 1939.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 20 (Operators) — operations and operators, average energies, the position and momentum operators, angular momentum, and the change of averages with time.',
    'Vol. III, ch. 8 (The Hamiltonian Matrix) — the Hamiltonian as a matrix between base states.',
    'Vol. III, ch. 16 (The Dependence of Amplitudes on Position) — states of definite momentum and the normalisation of states in x.'
  ],
  sim: 'wim-operators'
},

{
  id: 'superconductivity-feyn', parent: 'waves-in-matter', title: 'Superconductivity', level: 3,
  short: 'Below a critical temperature the electrons of some metals pair up and every pair falls into the same quantum state, so one wave function √ρ e^{iθ} describes the whole current. Quantum mechanics becomes visible on a bench: resistance vanishes, fields are pushed out, the flux through a ring comes in steps of h/2e, and a thin insulating gap makes the Josephson junction.',
  keywords: ['superconductivity', 'Cooper pairs', 'macroscopic wave function', 'Meissner effect', 'flux quantum', 'flux quantization', 'h/2e', 'Josephson junction', 'Josephson effect', 'SQUID', 'BCS theory', 'critical temperature', 'persistent current', 'voltage standard', 'phase'],
  prereq: ['schrodinger-equation-feyn', 'bosons-and-lasers', 'vector-potential'],
  related: ['tunnelling-feyn', 'identical-particles', 'superfluid-helium', 'induction-laws', 'magnetism-of-matter', 'physics:superconductivity'],
  body: `
Quantum mechanics usually hides in the small — the wave function of one electron, the amplitude of one photon. In a superconductor it appears on the scale of a laboratory bench. Volume III closes with a lecture presented as a seminar on superconductivity, in which Feynman shows the Schrödinger equation describing something almost classical: a current you can measure with an ammeter.

### One wave function for all the pairs
Below a critical temperature the electrons of some metals bind into pairs — Cooper pairs, of charge $q = 2e$ — through a weak attraction carried by the vibrations of the lattice. A pair has whole-number spin, so pairs behave as bosons and, like photons in a laser ([[bosons-and-lasers]]), crowd into one and the same state. A single [[?wave-function|wave function]] then describes all of them, and it can be treated like a classical field:

$$\\psi(\\mathbf{r}) = \\sqrt{\\rho(\\mathbf{r})}\\,e^{i\\theta(\\mathbf{r})}$$

with $\\rho$ the density of pairs and $\\theta$ a [[?phase]]. The Schrödinger equation with a magnetic field then says that the pairs flow with velocity

$$m\\mathbf{v} = \\hbar\\,\\nabla\\theta - q\\mathbf{A}$$

where $\\mathbf{A}$ is the [[vector-potential|vector potential]]. The current is set by how fast the phase changes from place to place — its [[?gradient]].

### No resistance, no field inside
A current carried by one shared state cannot be slowed by knocking a single electron aside: every pair is locked into the same wave. Currents set going in superconducting rings have run for years without measurable decay. A superconductor also pushes magnetic fields out of its interior (the Meissner effect); the field enters only a skin a few tens of nanometres deep, where the screening currents flow.

### Flux comes in steps of h/2e
Deep inside a thick superconducting ring there is no current, so $\\hbar\\nabla\\theta = q\\mathbf{A}$ all the way round. Add it up round the loop — a [[?closed-integral|closed line integral]]:

$$\\hbar\\oint\\nabla\\theta\\cdot d\\mathbf{s} = q\\oint\\mathbf{A}\\cdot d\\mathbf{s} = q\\,\\Phi$$

The loop integral of $\\mathbf{A}$ is the magnetic [[?flux]] $\\Phi$ through the ring. The phase must come back to itself after a full circuit, so it can change only by a whole number of turns, $2\\pi n$. Therefore

$$\\Phi = n\\,\\frac{2\\pi\\hbar}{q} = n\\,\\frac{h}{2e} = n \\times 2.068\\times10^{-15}\\ \\text{Wb}$$

Trapped flux is quantised. The step is tiny: through a loop 10 µm square one flux quantum is a field of about 20 µT, less than the Earth's. When it was measured, in 1961, it came out as $h/2e$, not $h/e$ — direct evidence that the carriers are pairs.

### The Josephson junction
Separate two superconductors by an insulating layer a nanometre or two thick. Pairs [[tunnelling-feyn|tunnel]] through it, and Feynman treated the junction as a two-state system, with amplitudes $\\psi_1$ and $\\psi_2$ on the two sides. With a phase difference $\\delta = \\theta_2 - \\theta_1$ and a voltage $V$ across the gap the result is

$$I = I_c\\sin\\delta, \\qquad \\frac{d\\delta}{dt} = \\frac{2eV}{\\hbar}$$

With no voltage, a steady supercurrent up to $I_c$ flows, its size set by the phase difference alone. With a steady voltage the phase difference runs on and the current oscillates at $f = 2eV/h$ — 483.6 GHz for every millivolt. Turned around, junctions irradiated at a known frequency make exact voltages, and arrays of thousands of them are the world's voltage standards.

Two junctions in a ring interfere like two slits: the largest current the pair can carry, $2I_c|\\cos(\\pi\\Phi/\\Phi_0)|$, swings with every flux quantum through the ring. This device, the SQUID, measures fields a billion times weaker than the Earth's, such as those made by currents in the human brain.

| Material | Critical temperature |
|---|---|
| Mercury | 4.2 K |
| Lead | 7.2 K |
| Niobium | 9.3 K |
| Nb₃Sn | 18 K |
| MgB₂ | 39 K |
| YBa₂Cu₃O₇ | 92 K |

> [!key] In a superconductor all the electron pairs share one wave function $\\sqrt{\\rho}\\,e^{i\\theta}$. Its phase controls the current: the flux through a ring comes in quanta of $h/2e$, and across a Josephson junction the current is $I_c\\sin\\delta$ with $d\\delta/dt = 2eV/\\hbar$.

In the simulations, trap flux in a ring and watch the phase arrows wind a whole number of times; push the applied flux until a quantum slips in; then drive a Josephson junction and a SQUID.
`,
  ideas: [
    'Below T_c electrons form pairs of charge 2e which, as bosons, all share one macroscopic wave function √ρ e^{iθ}.',
    'The supercurrent is set by the gradient of the phase and the vector potential: mv = ħ∇θ − qA.',
    'The phase must return to itself round a ring, so the trapped flux is n h/2e = n × 2.07 × 10⁻¹⁵ Wb.',
    'A Josephson junction carries I = I_c sin δ with no voltage; with a voltage V the phase runs at 2eV/ħ and the current oscillates at 483.6 GHz per mV.',
    'Two junctions in a ring (a SQUID) interfere, making the most sensitive magnetometers known.'
  ],
  pitfalls: [
    'A superconductor is just a perfect conductor — A perfect conductor would freeze in whatever field it had; a superconductor actively expels the field (the Meissner effect), a property of its quantum state.',
    'The flux quantum is h/e, one electron\'s worth — Measurements give h/2e, because the carriers are pairs of charge 2e.',
    'With no voltage no current can cross an insulating gap — Pairs tunnel through, and a supercurrent up to I_c flows at zero voltage, set by the phase difference.'
  ],
  formulas: [
    {
      name: 'Flux quantisation',
      expr: 'Phi = n*h/(2*qe)', tex: '\\Phi = n\\,\\dfrac{h}{2e}',
      vars: {
        Phi: { name: 'magnetic flux trapped in the ring', q: 'flux', unit: 'Wb', tex: '\\Phi' },
        n: { name: 'number of flux quanta (turns of phase)', int: true, value: 1 },
        h: { const: 'h' },
        qe: { const: 'qe' }
      },
      note: 'h/2e = 2.068 × 10⁻¹⁵ Wb. The 2 is the charge of a Cooper pair.',
      stories: { Phi: 'A superconducting ring holds {n} flux quanta. How much flux is that?', n: 'A ring traps {Phi}. How many flux quanta is that?' }
    },
    {
      name: 'The AC Josephson effect',
      expr: 'f = 2*qe*V/h', tex: 'f = \\dfrac{2eV}{h}',
      vars: {
        f: { name: 'frequency of the supercurrent', q: 'frequency', unit: 'GHz' },
        qe: { const: 'qe' },
        V: { name: 'voltage across the junction', q: 'voltage', unit: 'µV', value: 10 },
        h: { const: 'h' }
      },
      note: '2e/h = 483 597.8 GHz per volt, exact since the 2019 SI. Used backwards, it turns a frequency into a voltage.',
      stories: { f: 'A Josephson junction has {V} across it. At what frequency does its supercurrent oscillate?', V: 'Microwaves of {f} lock a junction onto its first step. What voltage is that?' }
    },
    {
      name: 'The DC Josephson effect',
      expr: 'I = Ic*sin(delta)', tex: 'I = I_c\\sin\\delta',
      vars: {
        I: { name: 'supercurrent through the junction', q: 'current', unit: 'µA', signed: true },
        Ic: { name: 'critical current of the junction', q: 'current', unit: 'µA', value: 100, tex: 'I_c' },
        delta: { name: 'phase difference across the junction', q: 'angle', unit: '°', value: 30, min: -180, max: 180, tex: '\\delta' }
      },
      note: 'At zero voltage. Driven above I_c the junction switches to a state with a voltage.',
      stories: { I: 'A junction with {Ic} has a phase difference of {delta}. What supercurrent flows?', delta: 'A junction with {Ic} carries {I} at zero voltage. What is the phase difference?' }
    },
    {
      name: 'Two junctions in a ring: the SQUID',
      expr: 'Imax = 2*Ic*abs(cos(pi*Phi/Phi0))', tex: 'I_{\\max} = 2I_c\\left|\\cos\\dfrac{\\pi\\Phi}{\\Phi_0}\\right|',
      vars: {
        Imax: { name: 'largest supercurrent of the pair', q: 'current', unit: 'µA', tex: 'I_{\\max}' },
        Ic: { name: 'critical current of each junction', q: 'current', unit: 'µA', value: 100, tex: 'I_c' },
        Phi: { name: 'magnetic flux through the ring', q: 'flux', unit: 'Wb', value: 5.1696e-16, min: 0, max: 2.0678e-15, tex: '\\Phi' },
        Phi0: { name: 'flux quantum h/2e', q: 'flux', unit: 'Wb', value: 2.0678e-15, fixed: true, tex: '\\Phi_0' }
      },
      note: 'Identical junctions and a ring of small inductance. The pattern repeats with every flux quantum.',
      stories: { Imax: 'A SQUID with two junctions of {Ic} has {Phi} through its ring. What is the largest current it can carry without a voltage?', Phi: 'A SQUID with {Ic} per junction can carry at most {Imax}. What flux (below one quantum) threads it?' }
    }
  ],
  examples: [
    {
      title: 'How big is a flux quantum?',
      q: 'What magnetic field makes one flux quantum through a loop 10 µm by 10 µm?',
      steps: [
        'The area is $10^{-10}$ m².',
        '$B = \\Phi_0/A = 2.068\\times10^{-15}/10^{-10} = 2.07\\times10^{-5}$ T.'
      ],
      a: 'About 21 µT — less than half the Earth\'s field.'
    },
    {
      title: 'Voltage from frequency',
      q: 'A junction is irradiated with 70 GHz microwaves and locks onto its first step, where $2eV/h$ equals the microwave frequency. What voltage does it hold? How many such steps add up to 10 V?',
      steps: [
        '$V = hf/2e = 70\\times10^9/483.6\\times10^{12}\\ \\text{Hz/V} = 1.45\\times10^{-4}$ V = 145 µV.',
        '$10/1.45\\times10^{-4} \\approx 69\\,000$ junction-steps in series.'
      ],
      a: '145 µV per junction; about 69 000 of them for 10 V — why voltage standards are big chips of junctions.'
    },
    {
      title: 'Evidence for pairs',
      q: 'If single electrons carried the supercurrent, what flux quantum would be measured?',
      steps: [
        'With $q = e$ the phase condition gives $\\Phi_0 = h/e = 4.14\\times10^{-15}$ Wb.',
        'The 1961 experiments found half that, $2.07\\times10^{-15}$ Wb.'
      ],
      a: 'h/e = 4.14 × 10⁻¹⁵ Wb; the measured h/2e showed that the carriers have charge 2e.'
    }
  ],
  quiz: [
    { q: 'The flux quantum is $h/2e$ rather than $h/e$ because…', choices: ['the supercurrent is carried by pairs of electrons', 'flux is shared between two surfaces of the ring', 'spin halves every magnetic moment', 'the ring has two ends'], a: 0, why: 'The phase winding gives Φ = nh/q, and q = 2e for a Cooper pair.' },
    { q: 'A Josephson junction has 1 mV across it. Its supercurrent oscillates at about…', choices: ['484 GHz', '484 MHz', '1 kHz', '2.4 GHz'], a: 0, why: 'f = 2eV/h = 483.6 GHz per millivolt.' },
    { q: 'A superconductor is simply a perfect conductor, which keeps whatever magnetic field it had inside when it was cooled.', a: false, why: 'A superconductor expels the field when it becomes superconducting (the Meissner effect) — more than zero resistance alone would do.' },
    { q: 'With no voltage across a Josephson junction, the current through it…', choices: ['can be anything up to I_c, set by the phase difference', 'must be zero', 'is always exactly I_c', 'oscillates at 483.6 GHz'], a: 0, why: 'I = I_c sin δ at zero voltage: the DC Josephson effect.' },
    { q: 'The largest current a SQUID can carry without a voltage is greatest when the flux through its ring is…', choices: ['a whole number of flux quanta', 'half a flux quantum', 'zero only', 'as large as possible'], a: 0, why: '2I_c|cos(πΦ/Φ₀)| peaks at Φ = nΦ₀ and vanishes at half-integer values.' }
  ],
  problems: [
    { q: 'What magnetic field puts one flux quantum through a ring of area 1 mm²?', answer: 2.07, unit: 'nT', tol: 0.02, hint: 'B = Φ₀/A.',
      steps: ['$B = 2.068\\times10^{-15}\\ \\text{Wb}/10^{-6}\\ \\text{m}^2 = 2.07\\times10^{-9}$ T.'] },
    { q: 'At what frequency does the supercurrent of a junction oscillate when 50 µV is across it?', answer: 24.18, unit: 'GHz', tol: 0.01, hint: 'f = 2eV/h.',
      steps: ['$f = 483.6\\ \\text{GHz/mV} \\times 0.050\\ \\text{mV} = 24.2$ GHz.'] }
  ],
  applications: [
    'MRI scanners use coils of niobium–titanium wire, superconducting at about 4 K, to make steady fields of 1.5–3 T with no power lost in the wire.',
    'The Large Hadron Collider bends its protons with superconducting magnets cooled to 1.9 K.',
    'Josephson junction arrays define the volt in national standards laboratories; SQUIDs record the magnetic fields of the brain (magnetoencephalography).',
    'Many quantum computers are built from superconducting circuits whose non-linear element is a Josephson junction.'
  ],
  history: 'Heike Kamerlingh Onnes found in 1911 that mercury loses all resistance at 4.2 K. Walther Meissner and Robert Ochsenfeld discovered the expulsion of magnetic fields in 1933; Fritz and Heinz London described it in 1935, and Fritz London later predicted that trapped flux should be quantised. Leon Cooper showed in 1956 how electrons can pair, and with John Bardeen and Robert Schrieffer built the theory of superconductivity in 1957 (Nobel Prize 1972). In 1961 Bascom Deaver and William Fairbank, and independently Robert Doll and Martin Näbauer, measured the flux quantum h/2e. Brian Josephson, a graduate student at Cambridge, predicted the junction effects in 1962, and Philip Anderson and John Rowell observed the supercurrent in 1963. Georg Bednorz and Alex Müller found superconductivity in copper oxides in 1986.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 21 (The Schrödinger Equation in a Classical Context: A Seminar on Superconductivity) — the Schrödinger equation in a magnetic field, the equation of continuity for probabilities, the meaning of the wave function, superconductivity, the Meissner effect, flux quantization, the dynamics of superconductivity and the Josephson junction.',
    'Vol. II, ch. 15 (The Vector Potential) — the vector potential as a real field in quantum mechanics, acting on electrons that never enter the magnetic field.',
    'Vol. III, ch. 4 (Identical Particles) — bosons crowding into the same state.'
  ],
  sim: ['wim-flux', 'wim-josephson']
}

);
