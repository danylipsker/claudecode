/* HYPER-PHYSICS · content/solid-state.js — solids from the atoms up: crystal lattices,
 * free electrons, energy bands, the Fermi level, semiconductors, the p–n junction and
 * the heat capacity of the lattice. */
Hyper.add(

{
  id: 'crystal-structure', parent: 'solid-state', title: 'Crystal structure', level: 2,
  short: 'In a crystal the atoms sit in a pattern that repeats in three dimensions. A small unit cell, repeated, builds the whole solid — and sets its density, its X-ray pattern and many of its properties.',
  keywords: ['crystal', 'lattice', 'unit cell', 'lattice constant', 'Bravais lattice', 'face-centred cubic', 'body-centred cubic', 'hexagonal close-packed', 'packing fraction', 'coordination number', 'Bragg\'s law', 'X-ray diffraction', 'Miller indices', 'dislocation', 'amorphous'],
  prereq: ['density', 'math:vectors', 'math:volume'],
  related: ['x-rays', 'diffraction-grating', 'free-electron-model', 'heat-capacity-solids', 'stress-strain'],
  body: `
Salt grains are tiny cubes, snowflakes are hexagons, and quartz grows as six-sided prisms: the outward shapes betray an inner order. In a **crystal** the atoms are arranged in a pattern that repeats regularly in three directions, over billions of atoms.

### Lattice, basis and unit cell
Describe a crystal in two steps. The **lattice** is an infinite array of points, each with identical surroundings. The **basis** is the atom or group of atoms placed at every lattice point. The smallest box that builds the whole crystal when stacked is the **unit cell**; its edge is the **lattice constant** $a$, a few tenths of a nanometre. Only fourteen distinct lattices (the Bravais lattices, in seven crystal systems) can fill space.

Most metals choose one of three simple arrangements:

| Structure | Atoms per cell | Nearest neighbours | Space filled | Examples |
|---|---|---|---|---|
| simple cubic | 1 | 6 | 52 % | polonium |
| body-centred cubic | 2 | 8 | 68 % | iron, chromium, tungsten, sodium |
| face-centred cubic | 4 | 12 | 74 % | copper, aluminium, gold, nickel |
| hexagonal close-packed | 2 | 12 | 74 % | magnesium, zinc, titanium |
| diamond | 8 | 4 | 34 % | diamond, silicon, germanium |

Counting atoms per cell needs care: a corner atom is shared by 8 cells, a face atom by 2. The face-centred cubic cell has $8 \\times \\tfrac18 + 6 \\times \\tfrac12 = 4$ atoms. Face-centred cubic and hexagonal close packing are the two densest ways to stack equal spheres — the way greengrocers pile oranges. Covalent crystals such as silicon choose the open diamond structure because each atom forms four directional bonds.

### Density from the cell
A cell of volume $a^3$ holding $n$ atoms of molar mass $M$ has density

$$\\rho = \\frac{n M}{N_A a^3}$$

For copper, face-centred cubic with $a = 0.3615$ nm, this gives 8940 kg/m³, matching the measured 8960 kg/m³. Run backwards, measured densities and lattice constants gave one of the most accurate early values of Avogadro's number.

### Seeing the lattice: X-ray diffraction
Atomic spacings are comparable to X-ray wavelengths, so a crystal acts as a three-dimensional [[diffraction-grating|diffraction grating]]. X-rays reflected from successive planes of atoms, a distance $d$ apart, reinforce only when the extra path is a whole number of wavelengths — **Bragg's law**:

$$2 d \\sin\\theta = m\\lambda$$

For a cubic crystal the planes labelled by the Miller indices $(hkl)$ are spaced $d = a/\\sqrt{h^2 + k^2 + l^2}$. Measuring the angles of the reflections reveals the lattice; their intensities reveal the basis. The structures of DNA, of proteins and of most materials were solved this way (see [[x-rays]]).

### Real crystals
Real crystals are imperfect, and the imperfections matter. **Vacancies** let atoms diffuse; **dislocations** — extra half-planes of atoms — let metals bend, because slipping one row at a time takes far less force than shearing a whole plane at once; **grain boundaries** separate the tiny crystals of an ordinary polycrystalline metal. Solids without long-range order, such as glass, are **amorphous**.

> [!key] A crystal is a lattice plus a basis. The unit cell, repeated, builds everything: count its atoms, divide by its volume, and you have the density.
`,
  ideas: [
    'A crystal is a lattice of identical points with the same group of atoms (the basis) at each.',
    'The unit cell, repeated in three directions, builds the whole crystal; its edge is the lattice constant.',
    'Face-centred cubic and hexagonal close-packed structures fill 74 % of space, the densest packing of spheres.',
    'Density follows from the cell: $\\rho = nM/N_A a^3$.',
    'X-rays diffract from atomic planes according to Bragg\'s law, 2d sin θ = mλ.'
  ],
  pitfalls: [
    'Every atom drawn in a unit cell belongs to that cell — Corner atoms are shared by 8 cells and face atoms by 2; the face-centred cubic cell holds only 4 atoms, not 14.',
    'Glass is a crystal because it is hard and transparent — Glass is amorphous: its atoms have no long-range order.',
    'Metals are soft because their bonds are weak — Their bonds are strong; metals yield at low stress because dislocations let atomic planes slip one row at a time.'
  ],
  derivation: {
    title: 'How much space do face-centred cubic spheres fill?',
    steps: [
      { text: 'In the face-centred cubic cell the spheres touch along a face diagonal, which is four radii long:', tex: '4r = a\\sqrt2 \\;\\Rightarrow\\; r = \\frac{\\sqrt2}{4}\\, a' },
      { text: 'The cell holds 4 atoms ($8 \\times \\tfrac18$ corners and $6 \\times \\tfrac12$ faces). Their volume:', tex: '4 \\times \\tfrac43 \\pi r^3 = \\tfrac{16}{3}\\pi \\left(\\frac{\\sqrt2}{4}\\right)^3 a^3 = \\frac{\\sqrt2\\,\\pi}{6}\\, a^3' },
      { text: 'Divide by the cell volume $a^3$:', tex: '\\text{packing fraction} = \\frac{\\pi\\sqrt2}{6} = 0.740' }
    ]
  },
  formulas: [
    {
      name: 'Density from the unit cell',
      expr: 'rho = n*M/(NA*a^3)', tex: '\\rho = \\frac{n M}{N_A a^3}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'kg/m³' },
        n: { name: 'atoms per unit cell', q: 'count', value: 4, int: true },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 63.546 },
        a: { name: 'lattice constant', q: 'length', unit: 'nm', value: 0.3615 },
        NA: { const: 'NA' }
      },
      note: 'Defaults: copper (face-centred cubic). Iron: $n = 2$, $a = 0.2866$ nm, 55.85 g/mol. Silicon: $n = 8$, $a = 0.5431$ nm, 28.09 g/mol.',
      stories: {
        rho: 'A metal with molar mass {M} has {n} atoms in a cubic cell of edge {a}. What is its density?',
        a: 'Aluminium (molar mass {M}, density {rho}) is face-centred cubic with {n} atoms per cell. What is its lattice constant?'
      }
    },
    {
      name: 'Bragg\'s law',
      expr: '2*d*sin(theta) = m*lambda', tex: '2 d \\sin\\theta = m \\lambda', solveFor: 'theta',
      vars: {
        theta: { name: 'glancing angle (from the planes)', q: 'angle', unit: '°', min: 0, max: 90 },
        d: { name: 'spacing of the atomic planes', q: 'length', unit: 'nm', value: 0.2087 },
        m: { name: 'order of reflection', q: 'count', value: 1, int: true },
        lambda: { name: 'X-ray wavelength', q: 'length', unit: 'nm', value: 0.15406 }
      },
      note: 'Defaults: copper K-alpha X-rays (0.154 nm) on the (111) planes of copper. The angle between incoming and diffracted beams is $2\\theta$.',
      practice: { unknowns: ['theta', 'd'] },
      stories: {
        theta: 'X-rays of wavelength {lambda} reflect in order {m} from planes {d} apart. At what glancing angle is the reflection?',
        d: 'A first-order reflection (m = {m}) of {lambda} X-rays appears at a glancing angle of {theta}. How far apart are the planes?'
      }
    },
    {
      name: 'Plane spacing in a cubic crystal',
      expr: 'd = a/sqrt(h^2 + k^2 + l^2)', tex: 'd = \\frac{a}{\\sqrt{h^2 + k^2 + l^2}}',
      vars: {
        d: { name: 'spacing of the (hkl) planes', q: 'length', unit: 'nm' },
        a: { name: 'lattice constant', q: 'length', unit: 'nm', value: 0.3615 },
        h: { name: 'Miller index h', q: 'count', value: 1, int: true },
        k: { name: 'Miller index k', q: 'count', value: 1, int: true },
        l: { name: 'Miller index l', q: 'count', value: 1, int: true }
      },
      practice: { unknowns: ['d', 'a'] },
      stories: { d: 'A cubic crystal has a lattice constant of {a}. How far apart are its ({h}{k}{l}) planes?' }
    }
  ],
  examples: [
    {
      title: 'The density of copper',
      q: 'Copper is face-centred cubic with $a = 0.3615$ nm and a molar mass of 63.55 g/mol. Predict its density.',
      steps: [
        'Atoms per cell: $8 \\times \\tfrac18 + 6 \\times \\tfrac12 = 4$.',
        'Mass of the cell: $\\dfrac{4 \\times 0.06355\\ \\mathrm{kg/mol}}{6.022\\times10^{23}\\ \\mathrm{mol^{-1}}} = 4.221\\times10^{-25}\\ \\mathrm{kg}$.',
        'Volume: $(0.3615\\times10^{-9})^3 = 4.724\\times10^{-29}\\ \\mathrm{m^3}$.',
        '$\\rho = 4.221\\times10^{-25}/4.724\\times10^{-29} = 8935\\ \\mathrm{kg/m^3}$ (measured: 8960).'
      ],
      a: 'About 8940 kg/m³.'
    },
    {
      title: 'Copper in an X-ray diffractometer',
      q: 'Copper K-alpha X-rays (0.1541 nm) strike a copper sample ($a = 0.3615$ nm). At what angle $2\\theta$ does the (111) reflection appear?',
      steps: [
        'Plane spacing: $d_{111} = 0.3615/\\sqrt3 = 0.2087\\ \\mathrm{nm}$.',
        'First order: $\\sin\\theta = \\lambda/2d = 0.1541/0.4174 = 0.3692$, so $\\theta = 21.7°$.',
        'Diffractometers plot intensity against $2\\theta$, so the peak appears at $43.3°$ — the strongest line in every powder pattern of copper.'
      ],
      a: '2θ = 43.3°'
    }
  ],
  quiz: [
    { q: 'How many atoms does a face-centred cubic unit cell contain?', choices: ['14', '8', '4', '2'], a: 2,
      why: 'Eight corner atoms each shared by 8 cells give 1; six face atoms each shared by 2 give 3. Total 4.' },
    { q: 'Which structure packs equal spheres most densely?', choices: ['simple cubic', 'body-centred cubic', 'face-centred cubic', 'diamond'], a: 2,
      why: 'Face-centred cubic (and hexagonal close-packed) fill 74 % of space, the maximum possible for equal spheres.' },
    { q: 'In Bragg diffraction, planes that are closer together reflect X-rays of a given wavelength at…', choices: ['smaller angles', 'larger angles', 'the same angle', 'no angle at all'], a: 1,
      why: '$\\sin\\theta = m\\lambda/2d$: a smaller spacing needs a larger angle — like a finer grating spreading light more.' },
    { q: 'Window glass is a crystal.', a: false,
      why: 'Glass is amorphous: its silicon and oxygen atoms are bonded in a disordered network with no repeating unit cell.' },
    { q: 'Metals can be bent without breaking mainly because…', choices: ['their atoms are soft', 'dislocations let planes of atoms slip one row at a time', 'their electrons are free', 'they have no crystal structure'], a: 1,
      why: 'Moving a dislocation breaks and re-forms bonds along a single line, needing far less force than sliding whole planes at once.' }
  ],
  applications: ['X-ray crystallography of proteins and drugs.', 'Powder diffraction to identify minerals, corrosion products and pigments.', 'Silicon wafers cut along chosen crystal planes for chip manufacture.', 'Heat treatment of steel, which switches iron between body- and face-centred cubic forms.'],
  history: 'Max von Laue showed in 1912 that crystals diffract X-rays; William Henry and Lawrence Bragg, father and son, turned it into a way of solving crystal structures and shared the 1915 Nobel Prize.'
},

{
  id: 'free-electron-model', parent: 'solid-state', title: 'Electrons in metals and drift velocity', level: 2,
  short: 'A metal holds a sea of free electrons darting about at over a thousand kilometres per second. An electric field adds only a slow drift — a fraction of a millimetre per second — and that drift is the current.',
  keywords: ['free electron model', 'Drude model', 'drift velocity', 'conduction electrons', 'collision time', 'mean free path', 'conductivity', 'mobility', 'current density', 'resistivity', 'Wiedemann-Franz'],
  prereq: ['electric-current', 'resistivity', 'kinetic-theory-gases'],
  related: ['fermi-energy', 'ohms-law', 'hall-effect', 'band-theory', 'conduction'],
  body: `
In a metal each atom gives up one or more of its outer electrons to the whole crystal. Those **conduction electrons** — about $8.5 \\times 10^{28}$ per cubic metre in copper, one per atom — wander freely among the positive ions, like the molecules of a gas in a box. Paul Drude built the first model of electrical conduction on this picture in 1900.

### Fast chaos, slow drift
With no field applied the electrons dash about at random, colliding and changing direction, so on average they go nowhere. Quantum physics gives their typical speed: about $1.6 \\times 10^{6}$ m/s in copper, the [[fermi-energy|Fermi speed]]. Apply a field $\\vec E$ and each electron is accelerated opposite to it between collisions, gaining a tiny extra velocity that the next collision randomizes again. Averaged over many electrons, this appears as a slow **drift velocity** $v_d$ against the field. The current through a wire of cross-section $A$ is the charge crossing it per second:

$$I = n e A\\, v_d \\quad\\Rightarrow\\quad v_d = \\frac{I}{n e A}$$

For 1 A in a 1 mm² copper wire, $v_d = 7 \\times 10^{-5}$ m/s: less than a tenth of a millimetre per second, slower than a snail. An electron would take hours to travel a metre of wire.

### So why does the light come on at once?
Because the wire is already full of electrons. Closing the switch sets up the electric field along the whole circuit at nearly the speed of light, and every electron starts drifting at the same moment — as water flows from a full hose the instant the tap opens, although no drop travels far.

### Ohm's law from collisions
If collisions happen on average every $\\tau$ seconds, an electron gains $v_d = eE\\tau/m$ between them. The current density $J = n e v_d$ is then proportional to $E$:

$$J = \\sigma E, \\qquad \\sigma = \\frac{n e^2 \\tau}{m}$$

This is [[ohms-law|Ohm's law]], with the conductivity explained by the number of carriers and the time between collisions. Copper's conductivity, $5.96 \\times 10^{7}$ S/m, implies $\\tau \\approx 2.5 \\times 10^{-14}$ s, and so a **mean free path** of about 40 nm — well over a hundred atomic spacings.

### What the electrons really collide with
That long free path puzzled physicists: why do electrons slip past so many ions? The quantum answer is that an electron wave passes through a *perfect* lattice without scattering at all (see [[band-theory]]). What scatters it is anything that breaks the perfect repetition: lattice vibrations, impurities and defects. Vibrations grow with temperature, so the resistivity of a pure metal rises roughly in proportion to absolute temperature; the impurities leave a residual resistivity that remains near absolute zero. Heating a wire does not slow its electrons down — it makes them collide more often.

> [!fact] The same free electrons carry heat: good electrical conductors are good thermal conductors, and the ratio of the two conductivities is nearly the same for all metals at a given temperature (the Wiedemann–Franz law).
`,
  ideas: [
    'Conduction electrons move randomly at about 10⁶ m/s; a field adds only a tiny net drift.',
    'The current is $I = neAv_d$, so drift speeds are a fraction of a millimetre per second.',
    'Signals travel fast because the field spreads along the whole circuit almost at once.',
    'Collisions every τ ≈ 10⁻¹⁴ s give Ohm\'s law with σ = n e² τ / m.',
    'Electrons scatter from lattice vibrations and defects, not from a perfect lattice; hotter metals resist more.'
  ],
  pitfalls: [
    'Electrons race around the circuit at nearly the speed of light — The field travels that fast; the electrons themselves drift at fractions of a millimetre per second.',
    'Without a current the electrons in a wire are at rest — They move very fast, randomly; the current is only the small average drift.',
    'Resistance rises with temperature because the electrons slow down — Their speed hardly changes; they collide more often with the more strongly vibrating lattice.'
  ],
  derivation: {
    title: 'From random collisions to Ohm\'s law',
    steps: [
      { text: 'Between collisions the field accelerates each electron:', tex: 'a = \\frac{eE}{m}' },
      { text: 'Each collision randomizes the velocity, so on average an electron has gained velocity for one mean collision time $\\tau$:', tex: 'v_d = a\\tau = \\frac{e E \\tau}{m}' },
      { text: 'The current density is the charge density times the drift velocity:', tex: 'J = n e v_d = \\frac{n e^2 \\tau}{m}\\, E' },
      { text: 'That is Ohm\'s law, $J = \\sigma E$, with', tex: '\\sigma = \\frac{n e^2 \\tau}{m}, \\qquad \\rho = \\frac{1}{\\sigma} = \\frac{m}{n e^2 \\tau}' }
    ]
  },
  formulas: [
    {
      name: 'Drift velocity',
      expr: 'vd = I/(n*qe*A)', tex: 'v_d = \\frac{I}{n e A}',
      vars: {
        vd: { name: 'drift velocity', q: 'speed', unit: 'm/s', tex: 'v_d' },
        I: { name: 'current', q: 'current', unit: 'A', value: 1 },
        n: { name: 'free-electron density', q: 'numberdensity', unit: '1/m³', value: 8.49e28 },
        A: { name: 'cross-sectional area of the wire', q: 'area', unit: 'mm²', value: 1 },
        qe: { const: 'qe' }
      },
      note: 'Free electrons per m³: copper $8.49\\times10^{28}$, aluminium $1.81\\times10^{29}$, silver $5.86\\times10^{28}$.',
      stories: {
        vd: 'A copper wire of cross-section {A} ({n} free electrons) carries {I}. How fast do its electrons drift?',
        I: 'Electrons in a {A} copper wire ({n}) drift at {vd}. What current flows?'
      }
    },
    {
      name: 'Drude conductivity',
      expr: 'sigma = n*qe^2*tau/me', tex: '\\sigma = \\frac{n e^2 \\tau}{m_e}',
      vars: {
        sigma: { name: 'electrical conductivity', q: 'conductivity', unit: 'MS/m' },
        n: { name: 'free-electron density', q: 'numberdensity', unit: '1/m³', value: 8.49e28 },
        tau: { name: 'mean time between collisions', q: 'time', unit: 'ps', value: 0.025 },
        qe: { const: 'qe' },
        me: { const: 'me' }
      },
      stories: {
        sigma: 'A metal has {n} free electrons that collide every {tau} on average. What is its conductivity?',
        tau: 'Copper has {n} free electrons and a conductivity of {sigma}. How long, on average, between collisions?'
      }
    },
    {
      name: 'Free-electron density of a metal',
      expr: 'n = z*rho*NA/M', tex: 'n = \\frac{z \\rho N_A}{M}',
      vars: {
        n: { name: 'free-electron density', q: 'numberdensity', unit: '1/m³' },
        z: { name: 'free electrons per atom (valence)', q: 'count', value: 1, int: true },
        rho: { name: 'density of the metal', q: 'density', unit: 'kg/m³', value: 8960 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 63.546 },
        NA: { const: 'NA' }
      },
      note: 'Copper, silver, gold and the alkali metals give 1 electron per atom; magnesium and zinc 2; aluminium 3.',
      stories: { n: 'Aluminium (density {rho}, molar mass {M}) releases {z} electrons per atom. How many free electrons are there per cubic metre?' }
    }
  ],
  examples: [
    {
      title: 'A snail\'s pace in the kitchen',
      q: 'A kettle draws 13 A through copper wire of cross-section 1.5 mm². What is the drift velocity, and how long would an electron take to travel 1 m along the flex?',
      steps: [
        '$v_d = \\dfrac{I}{neA} = \\dfrac{13}{8.49\\times10^{28} \\times 1.602\\times10^{-19} \\times 1.5\\times10^{-6}}$.',
        'Denominator: $2.04\\times10^{4}$, so $v_d = 6.4\\times10^{-4}\\ \\mathrm{m/s}$, about 0.6 mm/s.',
        'One metre takes $1/6.4\\times10^{-4} = 1600\\ \\mathrm{s}$, about 26 minutes. With alternating current the electrons merely jiggle back and forth by a few micrometres.'
      ],
      a: 'About 0.6 mm/s — 26 minutes per metre.'
    },
    {
      title: 'How often do electrons collide in copper?',
      q: 'Copper has $n = 8.49\\times10^{28}\\ \\mathrm{m^{-3}}$ and $\\sigma = 5.96\\times10^{7}$ S/m. Find the collision time and, with a Fermi speed of $1.57\\times10^{6}$ m/s, the mean free path.',
      steps: [
        '$\\tau = \\dfrac{\\sigma m_e}{n e^2} = \\dfrac{5.96\\times10^{7} \\times 9.11\\times10^{-31}}{8.49\\times10^{28} \\times (1.602\\times10^{-19})^2}$.',
        'Numerator $5.43\\times10^{-23}$, denominator $2.18\\times10^{-9}$: $\\tau = 2.5\\times10^{-14}\\ \\mathrm{s}$.',
        'Mean free path: $\\ell = v_F \\tau = 1.57\\times10^{6} \\times 2.5\\times10^{-14} = 3.9\\times10^{-8}\\ \\mathrm{m} = 39\\ \\mathrm{nm}$.',
        'That is about 150 atomic spacings: electrons do not bump into every ion.'
      ],
      a: 'τ ≈ 25 fs; mean free path ≈ 40 nm.'
    }
  ],
  quiz: [
    { q: 'The drift velocity of electrons in a household wire is typically about…', choices: ['the speed of light', '1000 km/s', '1 m/s', 'a fraction of a millimetre per second'], a: 3,
      why: '$v_d = I/neA$ is tiny because $n$ is enormous: so many electrons share the current that each needs to move only very slowly.' },
    { q: 'The same current flows through a wire of half the diameter. The drift velocity becomes…', choices: ['half', 'the same', 'twice as large', 'four times as large'], a: 3,
      why: 'Half the diameter means a quarter of the area, and $v_d = I/neA$.' },
    { q: 'Why does a lamp light almost the moment the switch is closed?', choices: ['Electrons move at nearly the speed of light', 'The electric field spreads along the wire almost at light speed and all the electrons start drifting together', 'The bulb stores charge', 'Electrons jump directly from the switch to the lamp'], a: 1,
      why: 'The wire is already full of electrons; the field that sets them moving is established throughout the circuit almost instantly.' },
    { q: 'A copper wire\'s resistance rises when it is heated because its electrons move more slowly.', a: false,
      why: 'Their speeds barely change; the ions vibrate more strongly and scatter the electrons more often, shortening the collision time.' },
    { q: 'Aluminium is less dense than copper but gives 3 free electrons per atom. Its free-electron density compared with copper\'s is…', choices: ['smaller', 'about the same', 'about twice as large', 'about ten times larger'], a: 2,
      why: '$n = z\\rho N_A/M$: aluminium $3 \\times 2700/0.02698 \\times 6.02\\times10^{23} = 1.8\\times10^{29}$, copper $8.5\\times10^{28}$ m⁻³.' }
  ],
  applications: ['Choosing conductor sizes: current density limits in wiring and power lines.', 'Resistance thermometers (platinum), which use the steady rise of a metal\'s resistivity with temperature.', 'Aluminium overhead lines, which conduct better per kilogram than copper.'],
  sim: 'nc-drift'
},

{
  id: 'band-theory', parent: 'solid-state', title: 'Energy bands: conductors, insulators, semiconductors', level: 2,
  short: 'In a solid, the sharp energy levels of atoms spread into bands separated by gaps. Whether the highest occupied band is full or partly empty decides whether a material conducts.',
  keywords: ['energy bands', 'band gap', 'valence band', 'conduction band', 'conductor', 'insulator', 'semiconductor', 'forbidden gap', 'hole', 'band structure', 'Bloch', 'transparency'],
  prereq: ['pauli-exclusion', 'crystal-structure', 'particle-in-a-box'],
  related: ['fermi-energy', 'semiconductors', 'free-electron-model', 'photoelectric-effect', 'photon'],
  body: `
Why is copper a conductor, diamond an insulator and silicon something in between? Their atoms all have electrons; the difference lies in how the electrons' energy levels change when atoms come together.

### From levels to bands
An isolated atom has sharp energy levels. Bring two atoms close and their outer electron waves overlap: each level splits into two, slightly apart. Bring $N$ atoms together — $10^{23}$ in a sugar-cube-sized crystal — and each level splits into $N$ levels packed so closely that they form a continuous **energy band**. Between bands lie **band gaps**: ranges of energy that no electron in the crystal can have.

The same result follows from the other end. An electron wave travelling through a periodic lattice is reflected by the rows of atoms whenever its wavelength fits the spacing — the electron version of Bragg reflection (see [[crystal-structure]]). At those wavelengths standing waves form, and two standing waves with different energies (one piling charge onto the ions, one between them) open a gap.

### Filling the bands
Electrons fill the available states from the bottom up, two per state ([[pauli-exclusion|exclusion principle]]). What matters is what happens at the top:

- **Metals**: the highest occupied band is only partly full. Empty states lie just above the occupied ones, so an electric field can nudge electrons into slightly faster states: current flows. (Divalent metals like magnesium conduct because two bands overlap.)
- **Insulators**: the highest occupied band, the **valence band**, is completely full, and the next, the **conduction band**, is empty and several eV higher. A full band carries no current — every electron moving one way is matched by one moving the other — and nothing can be promoted. Diamond has a gap of 5.5 eV.
- **Semiconductors**: the same arrangement with a small gap, about 1 eV. At room temperature a few electrons are thermally kicked into the conduction band, and each leaves behind a **hole** in the valence band that also carries current. The fraction excited goes roughly as $e^{-E_g/2k_BT}$: about $4\\times10^{-10}$ for silicon at 300 K, $10^{-46}$ for diamond.

### Band gaps and light
A photon can lift an electron across the gap only if its energy exceeds $E_g$, which sets a cut-off wavelength $\\lambda = hc/E_g$:

| Material | Band gap (eV) | Absorbs light shorter than |
|---|---|---|
| germanium | 0.66 | 1.88 µm |
| silicon | 1.12 | 1.11 µm |
| gallium arsenide | 1.42 | 873 nm |
| gallium nitride | 3.4 | 365 nm |
| diamond | 5.5 | 225 nm |
| silica glass | about 9 | about 140 nm |

Visible photons carry 1.8–3.1 eV. Diamond and glass cannot absorb them, so they are transparent; silicon absorbs all visible light and looks grey and opaque, yet is transparent to infrared beyond 1.1 µm; cadmium sulfide (2.4 eV) absorbs blue and looks yellow. Metals, with empty states just above occupied ones, absorb and re-emit light of every colour, which is why they are shiny.

> [!key] Partly filled band: metal. Full band and a big gap: insulator. Full band and a small gap: semiconductor, whose conductivity rises steeply with temperature.
`,
  ideas: [
    'In a crystal the sharp levels of the atoms broaden into bands separated by forbidden gaps.',
    'A partly filled band conducts; a completely full band does not.',
    'Insulators have a full valence band and a large gap; semiconductors have a gap of about 1 eV.',
    'Thermal excitation across the gap scales roughly as $e^{-E_g/2k_BT}$, so semiconductors conduct better when hot.',
    'Photons below the gap energy pass through: this sets colour and transparency.'
  ],
  pitfalls: [
    'Insulators have no electrons that can move because they have no electrons in bands — Their valence band is packed full; a full band carries no net current, and the next empty band is out of reach.',
    'Holes are positrons or missing atoms — A hole is an empty electron state in an almost full band; the band behaves as if it contained a positive carrier.',
    'Metals conduct because they have more electrons — They conduct because their highest band is only partly filled, whatever the number of electrons.'
  ],
  formulas: [
    {
      name: 'Longest wavelength absorbed across the gap',
      expr: 'lambda = h*c/Eg', tex: '\\lambda = \\frac{h c}{E_g}',
      vars: {
        lambda: { name: 'cut-off wavelength', q: 'length', unit: 'nm' },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 1.12, tex: 'E_g' },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      note: 'Light with a longer wavelength passes through. A handy form: $\\lambda\\,[\\mathrm{nm}] \\approx 1240 / E_g\\,[\\mathrm{eV}]$.',
      stories: {
        lambda: 'A semiconductor has a band gap of {Eg}. What is the longest wavelength of light it can absorb?',
        Eg: 'A detector responds to light up to {lambda} and no further. What is the band gap of its material?'
      }
    },
    {
      name: 'Thermal excitation across the gap (rough)',
      expr: 'f = exp(-Eg/(2*kB*T))', tex: 'f \\approx e^{-E_g / 2 k_B T}',
      vars: {
        f: { name: 'relative fraction of electrons excited', q: 'ratio' },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 1.12, tex: 'E_g' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        kB: { const: 'kB' }
      },
      note: 'Order-of-magnitude factor; the intrinsic carrier density is this times about $2.5\\times10^{19}\\ \\mathrm{cm^{-3}}$ for silicon (see [[semiconductors]]).',
      practice: { unknowns: ['f', 'T'] },
      stories: { f: 'By what rough factor are electrons thermally promoted across a gap of {Eg} at {T}?' }
    }
  ],
  examples: [
    {
      title: 'Why a silicon camera cannot see telecom light',
      q: 'Optical fibres carry signals at 1550 nm. Can a silicon photodiode (gap 1.12 eV) detect them?',
      steps: [
        'Photon energy: $E = hc/\\lambda = 1240\\ \\mathrm{eV\\,nm}/1550\\ \\mathrm{nm} = 0.80\\ \\mathrm{eV}$.',
        'That is less than 1.12 eV, so a photon cannot lift an electron across silicon\'s gap: the light passes straight through.',
        'Telecom receivers use indium gallium arsenide (gap about 0.75 eV) or germanium (0.66 eV) instead.'
      ],
      a: 'No: 0.80 eV photons are below silicon\'s 1.12 eV gap.'
    },
    {
      title: 'Silicon against diamond',
      q: 'Compare the factor $e^{-E_g/2k_BT}$ at 300 K for silicon (1.12 eV) and diamond (5.5 eV).',
      steps: [
        '$2k_BT = 2 \\times 8.617\\times10^{-5} \\times 300 = 0.0517\\ \\mathrm{eV}$.',
        'Silicon: $e^{-1.12/0.0517} = e^{-21.7} = 4\\times10^{-10}$ — about $10^{10}$ electrons per cm³ in the conduction band.',
        'Diamond: $e^{-5.5/0.0517} = e^{-106} \\approx 10^{-46}$ — effectively none in any real crystal.'
      ],
      a: 'About 4 × 10⁻¹⁰ for silicon and 10⁻⁴⁶ for diamond.'
    }
  ],
  quiz: [
    { q: 'Diamond is transparent but silicon is opaque to visible light because…', choices: ['diamond has fewer electrons', 'diamond\'s 5.5 eV gap exceeds visible photon energies; silicon\'s 1.1 eV gap does not', 'silicon is a metal', 'diamond reflects all light'], a: 1,
      why: 'Visible photons (1.8–3.1 eV) can cross silicon\'s gap and are absorbed; they cannot cross diamond\'s, so they pass through.' },
    { q: 'What makes a material a metal in band theory?', choices: ['A large band gap', 'A partly filled highest band', 'A completely empty valence band', 'Having more than 30 electrons per atom'], a: 1,
      why: 'Only a partly filled band has empty states right next to occupied ones, so a field can change the electrons\' motion.' },
    { q: 'As a pure semiconductor warms up, its conductivity…', choices: ['falls, like a metal\'s', 'rises steeply', 'stays constant', 'drops to zero'], a: 1,
      why: 'More electrons are excited across the gap, roughly as $e^{-E_g/2k_BT}$, so the number of carriers grows rapidly with temperature.' },
    { q: 'A completely filled band carries no electric current.', a: true,
      why: 'For every electron moving one way there is another moving the opposite way, and there are no empty states to change that.' },
    { q: 'A material absorbs all wavelengths shorter than 500 nm and transmits longer ones. Its band gap is about…', choices: ['0.5 eV', '1.2 eV', '2.5 eV', '5 eV'], a: 2, why: '$E_g = 1240/500 = 2.5$ eV. It absorbs blue and violet and looks yellow-orange.' }
  ],
  applications: ['Choosing detector materials: silicon for visible cameras, InGaAs for telecom, mercury cadmium telluride for thermal imaging.', 'Transparent conductors such as indium tin oxide, with gaps above visible photon energies.', 'Colour of pigments and gemstones.'],
  sim: 'nc-bands'
},

{
  id: 'fermi-energy', parent: 'solid-state', title: 'Fermi energy', level: 3,
  short: 'Because no two electrons can share a state, even at absolute zero the electrons of a metal fill energies up to several electronvolts. The top of that "Fermi sea" is the Fermi energy.',
  keywords: ['Fermi energy', 'Fermi level', 'Fermi-Dirac distribution', 'Fermi temperature', 'Fermi speed', 'Fermi sea', 'degenerate electron gas', 'chemical potential', 'density of states', 'degeneracy pressure'],
  prereq: ['pauli-exclusion', 'free-electron-model', 'particle-in-a-box'],
  related: ['band-theory', 'compact-stars', 'heat-capacity-solids', 'maxwell-boltzmann', 'photoelectric-effect'],
  body: `
Classical physics expects the electrons of a metal to come to rest as it is cooled to absolute zero. Quantum physics says otherwise. Electrons are fermions: by the [[pauli-exclusion|exclusion principle]] each quantum state holds at most one electron (two per orbital, one of each spin). So at absolute zero the electrons fill the lowest available states one after another, like water filling a vessel, up to a sharp surface. The energy of that surface is the **Fermi energy** $E_F$.

### How high the sea is
For free electrons in a box (a [[particle-in-a-box]] in three dimensions), counting the states gives

$$E_F = \\frac{\\hbar^2}{2 m_e}\\left(3\\pi^2 n\\right)^{2/3}$$

where $n$ is the number of free electrons per unit volume. It depends only on how densely they are packed.

| Metal | Electrons per m³ | $E_F$ | Fermi temperature | Fermi speed |
|---|---|---|---|---|
| sodium | $2.65\\times10^{28}$ | 3.2 eV | 37 600 K | $1.07\\times10^{6}$ m/s |
| copper | $8.49\\times10^{28}$ | 7.0 eV | 81 700 K | $1.57\\times10^{6}$ m/s |
| aluminium | $1.81\\times10^{29}$ | 11.7 eV | 135 000 K | $2.03\\times10^{6}$ m/s |

The **Fermi temperature** $T_F = E_F/k_B$ is the temperature at which ordinary thermal energy would match the Fermi energy: tens of thousands of kelvin. Even at absolute zero, the fastest electrons in copper move at 1570 km/s.

### Warm electrons: the Fermi–Dirac distribution
At a temperature $T$ the probability that a state of energy $E$ is occupied is

$$f(E) = \\frac{1}{e^{(E - E_F)/k_BT} + 1}$$

At $T = 0$ this is a sharp step: 1 below $E_F$, 0 above. At room temperature the step is rounded off over only a few $k_BT$ — 0.026 eV each — around $E_F$, whatever the temperature, $f(E_F) = \\tfrac12$. Far above $E_F$ the tail becomes the classical Boltzmann factor $e^{-(E - E_F)/k_BT}$.

### Consequences
- **Only electrons near the top matter.** An electron deep in the sea cannot take a small amount of energy, because the states just above it are full. Only those within about $k_BT$ of $E_F$ can be excited — about $T/T_F$, a few tenths of a per cent at room temperature. This is why the electrons add so little to a metal's [[heat-capacity-solids|heat capacity]], a puzzle that had defeated Drude's classical model.
- **Conduction is done at the Fermi surface**, by electrons moving at the Fermi speed, which fixes the mean free path in the [[free-electron-model]].
- **The Fermi level is the chemical potential of the electrons.** Put two materials in contact and electrons flow until their Fermi levels line up — the origin of contact potentials, thermocouples and the built-in voltage of a [[pn-junction|p–n junction]]. The **work function** is the gap from the Fermi level to the vacuum outside.
- **Degeneracy pressure.** A Fermi sea pushes back when compressed, because squeezing raises $E_F$. Electron degeneracy pressure holds up white dwarfs, neutron degeneracy pressure neutron stars (see [[compact-stars]]).

> [!note] In a semiconductor or insulator the Fermi level lies in the band gap, where there are no states at all: it still marks where $f = \\tfrac12$, and doping moves it towards one band or the other.
`,
  ideas: [
    'At absolute zero the electrons of a metal fill all states up to the Fermi energy, several eV.',
    '$E_F = (\\hbar^2/2m)(3\\pi^2 n)^{2/3}$ depends only on the free-electron density.',
    'The Fermi–Dirac function gives the occupation of each state; it is ½ at $E_F$ and blurs over a few $k_BT$.',
    'Only electrons within about $k_BT$ of $E_F$ can gain energy, so few take part in heat capacity.',
    'Fermi levels line up in contact, and degeneracy pressure holds up white dwarfs and neutron stars.'
  ],
  pitfalls: [
    'At absolute zero all electrons are at rest — They fill every state up to $E_F$; the fastest still move at over a million metres per second.',
    'Heating a metal gives every electron about $k_BT$ more energy — Only those within a few $k_BT$ of the Fermi level can change state; the rest are locked in by the exclusion principle.',
    'The Fermi energy is the energy of an average electron — It is the energy of the highest occupied state at T = 0; the average in three dimensions is 3/5 of it.'
  ],
  derivation: {
    title: 'Counting states up to the Fermi energy',
    steps: [
      { text: 'In a cube of side $L$, standing waves have wave vectors on a grid with spacing $2\\pi/L$ in each direction (periodic boundaries), so each allowed $\\vec k$ occupies a volume $(2\\pi/L)^3$ of $k$-space.', tex: '\\text{states per unit } k\\text{-volume} = \\frac{L^3}{(2\\pi)^3}' },
      { text: 'At $T = 0$ the occupied states fill a sphere of radius $k_F$. With two spin states each, the number of electrons is', tex: 'N = 2 \\cdot \\frac{L^3}{(2\\pi)^3} \\cdot \\frac43 \\pi k_F^3 = \\frac{L^3 k_F^3}{3\\pi^2}' },
      { text: 'So the electron density fixes the radius of the Fermi sphere:', tex: 'n = \\frac{N}{L^3} = \\frac{k_F^3}{3\\pi^2} \\;\\Rightarrow\\; k_F = (3\\pi^2 n)^{1/3}' },
      { text: 'The energy of a free electron is $\\hbar^2 k^2/2m$, so', tex: 'E_F = \\frac{\\hbar^2 k_F^2}{2 m_e} = \\frac{\\hbar^2}{2 m_e}\\left(3\\pi^2 n\\right)^{2/3}' }
    ]
  },
  formulas: [
    {
      name: 'Fermi energy of free electrons',
      expr: 'EF = hbar^2/(2*me)*(3*pi^2*n)^(2/3)', tex: 'E_F = \\frac{\\hbar^2}{2 m_e}\\left(3\\pi^2 n\\right)^{2/3}',
      vars: {
        EF: { name: 'Fermi energy', q: 'energy', unit: 'eV', tex: 'E_F' },
        n: { name: 'free-electron density', q: 'numberdensity', unit: '1/m³', value: 8.49e28 },
        hbar: { const: 'hbar' },
        me: { const: 'me' }
      },
      stories: { EF: 'A metal has {n} free electrons. What is its Fermi energy?', n: 'A metal has a Fermi energy of {EF}. How many free electrons does it have per cubic metre?' }
    },
    {
      name: 'Fermi–Dirac occupation',
      expr: 'f = 1/(exp((E - EF)/(kB*T)) + 1)', tex: 'f = \\frac{1}{e^{(E - E_F)/k_B T} + 1}',
      vars: {
        f: { name: 'probability that the state is occupied', q: 'ratio' },
        E: { name: 'energy of the state', q: 'energy', unit: 'eV', value: 7.1 },
        EF: { name: 'Fermi energy', q: 'energy', unit: 'eV', value: 7.0, tex: 'E_F' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        kB: { const: 'kB' }
      },
      note: 'Energies measured from the bottom of the band. $f(E_F) = \\tfrac12$ at every temperature.',
      practice: { unknowns: ['f', 'E'] },
      stories: {
        f: 'In a metal with Fermi energy {EF} at {T}, what is the chance that a state at {E} is occupied?',
        E: 'At {T}, in a metal with Fermi energy {EF}, at what energy is a state occupied with probability {f}?'
      }
    },
    {
      name: 'Fermi speed',
      expr: 'vF = sqrt(2*EF/me)', tex: 'v_F = \\sqrt{\\frac{2 E_F}{m_e}}',
      vars: {
        vF: { name: 'Fermi speed', q: 'speed', unit: 'm/s', tex: 'v_F' },
        EF: { name: 'Fermi energy', q: 'energy', unit: 'eV', value: 7.04, tex: 'E_F' },
        me: { const: 'me' }
      },
      stories: { vF: 'How fast do the most energetic conduction electrons move in a metal with a Fermi energy of {EF}?' }
    },
    {
      name: 'Fermi temperature',
      expr: 'TF = EF/kB', tex: 'T_F = \\frac{E_F}{k_B}',
      vars: {
        TF: { name: 'Fermi temperature', q: 'temperature', unit: 'K', tex: 'T_F' },
        EF: { name: 'Fermi energy', q: 'energy', unit: 'eV', value: 7.04, tex: 'E_F' },
        kB: { const: 'kB' }
      },
      stories: { TF: 'What is the Fermi temperature of a metal with a Fermi energy of {EF}?' }
    }
  ],
  examples: [
    {
      title: 'The Fermi sea of copper',
      q: 'Copper has $8.49\\times10^{28}$ free electrons per m³. Find its Fermi energy, Fermi temperature and Fermi speed.',
      steps: [
        '$3\\pi^2 n = 29.61 \\times 8.49\\times10^{28} = 2.514\\times10^{30}\\ \\mathrm{m^{-3}}$; to the power $2/3$: $1.849\\times10^{20}\\ \\mathrm{m^{-2}}$.',
        '$\\hbar^2/2m_e = (1.0546\\times10^{-34})^2/(2 \\times 9.109\\times10^{-31}) = 6.10\\times10^{-39}\\ \\mathrm{J\\,m^2}$.',
        '$E_F = 6.10\\times10^{-39} \\times 1.849\\times10^{20} = 1.13\\times10^{-18}\\ \\mathrm{J} = 7.0\\ \\mathrm{eV}$.',
        '$T_F = E_F/k_B = 81\\,700\\ \\mathrm{K}$; $v_F = \\sqrt{2E_F/m_e} = 1.57\\times10^{6}\\ \\mathrm{m/s}$.'
      ],
      a: '$E_F$ = 7.0 eV, $T_F$ ≈ 82 000 K, $v_F$ = 1.6 × 10⁶ m/s.'
    },
    {
      title: 'How sharp is the edge at room temperature?',
      q: 'In copper at 300 K, what is the occupation of states 0.1 eV above and 0.1 eV below the Fermi level?',
      steps: [
        '$k_BT = 8.617\\times10^{-5} \\times 300 = 0.0259\\ \\mathrm{eV}$, so $0.1\\ \\mathrm{eV} = 3.87\\,k_BT$.',
        'Above: $f = 1/(e^{3.87} + 1) = 1/(47.9 + 1) = 0.020$.',
        'Below: $f = 1/(e^{-3.87} + 1) = 0.980$ — the same 2 % of states emptied as are filled above, by symmetry.',
        'The whole blurred zone is a few tenths of an eV wide, compared with a 7 eV deep sea.'
      ],
      a: '2 % occupied at 0.1 eV above $E_F$; 98 % at 0.1 eV below.'
    }
  ],
  quiz: [
    { q: 'At absolute zero, the Fermi–Dirac occupation is…', choices: ['½ for every state', '1 below $E_F$ and 0 above', 'a smooth exponential', '0 for every state'], a: 1, why: 'With no thermal energy the electrons fill the lowest states exactly, up to $E_F$: a sharp step.' },
    { q: 'At any temperature, a state exactly at the Fermi energy is occupied with probability…', choices: ['0', '½', '1', 'it depends on the temperature'], a: 1, why: 'At $E = E_F$ the exponential is $e^0 = 1$, so $f = 1/(1 + 1) = \\tfrac12$.' },
    { q: 'If the free-electron density of a metal were doubled, its Fermi energy would be multiplied by…', choices: ['2', '1.59', '1.26', '4'], a: 1, why: '$E_F \\propto n^{2/3}$ and $2^{2/3} = 1.59$.' },
    { q: 'Why do conduction electrons add so little to the heat capacity of a metal?', choices: ['They have no kinetic energy', 'Only the few within about $k_BT$ of the Fermi level can take up thermal energy', 'They are bound to atoms', 'They leave the metal when heated'], a: 1,
      why: 'Deeper electrons would need to jump into states that are already occupied. Only a fraction of order $T/T_F$ — a few tenths of a per cent — can be excited.' },
    { q: 'Even at absolute zero, the fastest conduction electrons in copper move at more than a thousand kilometres per second.', a: true, why: 'The Fermi speed of copper is $1.57\\times10^{6}$ m/s, set by the exclusion principle, not by temperature.' }
  ],
  applications: ['Thermocouples and contact potentials, set by the alignment of Fermi levels.', 'The work function and thermionic emission from hot cathodes.', 'White dwarfs and neutron stars, held up by degeneracy pressure.'],
  sim: { id: 'nc-bands', params: { mat: 'metal' } }
},

{
  id: 'semiconductors', parent: 'solid-state', title: 'Semiconductors and doping', level: 2,
  short: 'Pure silicon has only a few free carriers, but adding one impurity atom in a few million creates plenty — electrons with phosphorus, holes with boron. That controllable conductivity is the basis of all electronics.',
  keywords: ['semiconductor', 'silicon', 'germanium', 'doping', 'donor', 'acceptor', 'n-type', 'p-type', 'hole', 'intrinsic', 'extrinsic', 'mass action law', 'carrier density', 'mobility', 'majority carriers', 'minority carriers'],
  prereq: ['band-theory', 'crystal-structure', 'electric-current'],
  related: ['pn-junction', 'fermi-energy', 'hall-effect', 'photoelectric-effect', 'resistivity'],
  body: `
Silicon has four outer electrons, and in its diamond-type crystal each atom shares them in four bonds with its neighbours. The [[band-theory|valence band]] is full and the conduction band is 1.12 eV above it.

### Intrinsic: electrons and holes
At room temperature thermal vibration breaks a few bonds, freeing an electron into the conduction band and leaving a **hole** behind. A neighbouring bond electron can hop into the hole, which moves the hole the other way, so holes drift along a field like positive charges. In pure (**intrinsic**) silicon, electrons and holes come in pairs, $n = p = n_i$, with

$$n_i \\approx N_0\\, e^{-E_g/2k_BT}$$

where $N_0 \\approx 2.5\\times10^{19}\\ \\mathrm{cm^{-3}}$ for silicon at 300 K. That gives $n_i \\approx 1\\times10^{10}\\ \\mathrm{cm^{-3}}$ — one free carrier for every $5\\times10^{12}$ atoms. Pure silicon is a poor conductor, with a resistivity of about 3000 Ω·m. And the exponential makes it very sensitive to temperature: $n_i$ roughly doubles for every 9 K near room temperature.

### Doping
Replace a few silicon atoms with **phosphorus**, which has five outer electrons. Four go into bonds; the fifth is held by only 0.045 eV and at room temperature is almost always set free. Phosphorus is a **donor**, and the silicon becomes **n-type**, with electrons as the majority carriers. Doping with **boron**, which has three outer electrons, leaves a bond one electron short: boron is an **acceptor**, it grabs an electron from the valence band and creates a hole, and the silicon becomes **p-type**. Typical doping levels are $10^{15}$ to $10^{18}$ atoms per cm³ — one impurity per few million silicon atoms or fewer — yet they raise the conductivity a million-fold.

### Mass action
Electrons and holes recombine when they meet, and thermal excitation creates new pairs. In equilibrium the product of their densities is fixed:

$$n\\,p = n_i^2$$

Doping with $10^{16}$ donors per cm³ gives $n = 10^{16}$ and therefore only $p = 10^{20}/10^{16} = 10^{4}$ holes per cm³: the **minority carriers** are suppressed as the majority carriers are boosted. Doping also moves the [[fermi-energy|Fermi level]] from mid-gap towards the conduction band (n-type) or the valence band (p-type).

### Conductivity
Each type of carrier contributes its density times its **mobility** $\\mu$ (drift speed per unit field):

$$\\sigma = e\\,(n\\,\\mu_n + p\\,\\mu_p)$$

In silicon $\\mu_n \\approx 0.14$ and $\\mu_p \\approx 0.045\\ \\mathrm{m^2/(V\\,s)}$ — electrons are about three times more mobile than holes. The [[hall-effect|Hall effect]] tells which carrier dominates, and how many there are, from the sign and size of a sideways voltage.

### Beyond silicon
Compound semiconductors such as gallium arsenide and gallium nitride have **direct** gaps, in which an electron can drop across the gap by emitting a photon: the basis of LEDs and laser diodes. Silicon's gap is **indirect**, so it emits light very poorly but makes excellent transistors and solar cells. Wide-gap silicon carbide and gallium nitride now switch the power in electric cars and fast chargers.

> [!key] Donors (group 15: P, As) give n-type; acceptors (group 13: B, Ga) give p-type. Majority carriers come from the dopant; minority carriers follow from $np = n_i^2$.
`,
  ideas: [
    'In a pure semiconductor, heat creates electron–hole pairs: $n = p = n_i \\approx 10^{10}\\ \\mathrm{cm^{-3}}$ for silicon at 300 K.',
    'Donor atoms (phosphorus) add free electrons: n-type. Acceptor atoms (boron) add holes: p-type.',
    'A few parts per million of dopant can raise the conductivity a million times.',
    'In equilibrium $np = n_i^2$: boosting one carrier suppresses the other.',
    'Conductivity is $\\sigma = e(n\\mu_n + p\\mu_p)$; in silicon electrons are about three times as mobile as holes.'
  ],
  pitfalls: [
    'n-type silicon is negatively charged — Every free electron came from a neutral donor atom that is now a positive ion: the crystal as a whole stays neutral.',
    'Holes are just a bookkeeping trick with no physical effect — They behave as real positive carriers: the Hall voltage of p-type material has the opposite sign.',
    'More doping always means more of both carriers — Adding donors raises the electron density but lowers the hole density, since $np = n_i^2$.'
  ],
  formulas: [
    {
      name: 'Mass-action law',
      expr: 'n*p = ni^2', tex: 'n\\, p = n_i^2', solveFor: 'p',
      vars: {
        n: { name: 'electron density', q: 'numberdensity', unit: '1/cm³', value: 1e16 },
        p: { name: 'hole density', q: 'numberdensity', unit: '1/cm³' },
        ni: { name: 'intrinsic carrier density', q: 'numberdensity', unit: '1/cm³', value: 1e10, tex: 'n_i' }
      },
      note: 'Silicon at 300 K: $n_i \\approx 1\\times10^{10}\\ \\mathrm{cm^{-3}}$; germanium: $2\\times10^{13}$; gallium arsenide: $2\\times10^{6}$.',
      stories: {
        p: 'Silicon ({ni} intrinsic carriers) is doped to {n} free electrons. How many holes remain?',
        n: 'A p-type silicon sample (intrinsic density {ni}) has {p} holes. How many free electrons does it have?'
      }
    },
    {
      name: 'Conductivity of a semiconductor',
      expr: 'sigma = qe*(n*mun + p*mup)', tex: '\\sigma = e\\,(n\\,\\mu_n + p\\,\\mu_p)',
      vars: {
        sigma: { name: 'conductivity', q: 'conductivity', unit: 'S/m' },
        n: { name: 'electron density', q: 'numberdensity', unit: '1/cm³', value: 1e10 },
        p: { name: 'hole density', q: 'numberdensity', unit: '1/cm³', value: 1e10 },
        mun: { name: 'electron mobility', unit: 'm²/(V·s)', value: 0.14, tex: '\\mu_n' },
        mup: { name: 'hole mobility', unit: 'm²/(V·s)', value: 0.045, tex: '\\mu_p' },
        qe: { const: 'qe' }
      },
      note: 'Defaults: intrinsic silicon. Mobilities in SI units, $\\mathrm{m^2/(V\\,s)}$ (silicon: 0.14 for electrons, 0.045 for holes). In a doped sample one term dominates.',
      practice: { unknowns: ['sigma'] },
      stories: { sigma: 'A silicon sample has {n} free electrons and {p} holes. What is its conductivity?' }
    },
    {
      name: 'Intrinsic carrier density',
      expr: 'ni = N0*exp(-Eg/(2*kB*T))', tex: 'n_i = N_0\\, e^{-E_g/2k_BT}',
      vars: {
        ni: { name: 'intrinsic carrier density', q: 'numberdensity', unit: '1/cm³', tex: 'n_i' },
        N0: { name: 'effective density of states', q: 'numberdensity', unit: '1/cm³', value: 2.5e19, tex: 'N_0' },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 1.12, tex: 'E_g' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        kB: { const: 'kB' }
      },
      note: '$N_0 = \\sqrt{N_c N_v}$ itself grows as $T^{3/2}$; keeping it fixed is fine over a few tens of kelvin.',
      practice: { unknowns: ['ni', 'T'] },
      stories: { ni: 'Estimate the intrinsic carrier density of a semiconductor with a {Eg} gap at {T}.', T: 'At what temperature does silicon ({Eg} gap) reach an intrinsic carrier density of {ni}?' }
    }
  ],
  examples: [
    {
      title: 'Doping silicon with phosphorus',
      q: 'Silicon is doped with $10^{16}$ phosphorus atoms per cm³. Find the electron and hole densities and the resistivity at 300 K ($n_i = 10^{10}\\ \\mathrm{cm^{-3}}$, $\\mu_n = 0.14\\ \\mathrm{m^2/(V\\,s)}$).',
      steps: [
        'Each donor gives one electron: $n = 10^{16}\\ \\mathrm{cm^{-3}} = 10^{22}\\ \\mathrm{m^{-3}}$.',
        'Mass action: $p = n_i^2/n = 10^{20}/10^{16} = 10^{4}\\ \\mathrm{cm^{-3}}$ — negligible.',
        '$\\sigma \\approx e n \\mu_n = 1.602\\times10^{-19} \\times 10^{22} \\times 0.14 = 224\\ \\mathrm{S/m}$, so $\\rho = 1/\\sigma = 4.5\\times10^{-3}\\ \\mathrm{\\Omega\\,m} = 0.45\\ \\mathrm{\\Omega\\,cm}$.',
        'Intrinsic silicon: $\\sigma = 1.602\\times10^{-19} \\times 10^{16} \\times (0.14 + 0.045) = 3.0\\times10^{-4}$ S/m. One phosphorus atom per five million silicon atoms raised the conductivity about 750 000 times.'
      ],
      a: 'n = 10¹⁶ cm⁻³, p = 10⁴ cm⁻³, ρ ≈ 0.45 Ω·cm.'
    },
    {
      title: 'A warm chip',
      q: 'Using $n_i = N_0 e^{-E_g/2k_BT}$ with fixed $N_0$, by what factor does $n_i$ in silicon grow between 300 K and 350 K?',
      steps: [
        'Ratio: $\\exp\\!\\left[\\dfrac{E_g}{2k_B}\\left(\\dfrac{1}{300} - \\dfrac{1}{350}\\right)\\right]$.',
        '$E_g/2k_B = 1.12/(2 \\times 8.617\\times10^{-5}) = 6500\\ \\mathrm{K}$; $\\tfrac{1}{300} - \\tfrac{1}{350} = 4.76\\times10^{-4}\\ \\mathrm{K^{-1}}$.',
        'Factor $e^{3.09} = 22$; including the $T^{3/2}$ growth of $N_0$ it is about 28.',
        'This is why the leakage currents of chips, carried by thermally generated carriers, grow so fast when they run hot.'
      ],
      a: 'About 20–30 times more intrinsic carriers.'
    }
  ],
  quiz: [
    { q: 'Adding phosphorus to silicon makes it…', choices: ['p-type', 'n-type', 'an insulator', 'intrinsic'], a: 1, why: 'Phosphorus has five outer electrons; the fifth is freed into the conduction band, so electrons become the majority carriers.' },
    { q: 'Silicon with $n_i = 10^{10}\\ \\mathrm{cm^{-3}}$ is doped with $10^{17}$ donors per cm³. The hole density is about…', choices: ['$10^{17}\\ \\mathrm{cm^{-3}}$', '$10^{10}\\ \\mathrm{cm^{-3}}$', '$10^{3}\\ \\mathrm{cm^{-3}}$', 'zero'], a: 2, why: '$p = n_i^2/n = 10^{20}/10^{17} = 10^{3}\\ \\mathrm{cm^{-3}}$.' },
    { q: 'As temperature rises, the resistance of a pure silicon sample…', choices: ['rises, like copper\'s', 'falls sharply', 'stays the same', 'first rises, then becomes infinite'], a: 1,
      why: 'The number of thermally excited carriers grows exponentially, far outweighing the slight fall in mobility. Thermistors exploit this.' },
    { q: 'n-type silicon carries a net negative charge.', a: false, why: 'Each free electron left behind a positively charged donor ion. The material stays electrically neutral.' },
    { q: 'In an electric field, holes drift…', choices: ['against the field, like electrons', 'along the field, like positive charges', 'not at all', 'at the speed of light'], a: 1,
      why: 'As bound electrons hop against the field into the vacancy, the vacancy moves along the field, exactly as a positive carrier would.' }
  ],
  applications: ['Every transistor, diode and integrated circuit is made of selectively doped regions of silicon.', 'Thermistors, whose resistance falls steeply with temperature.', 'LEDs and laser diodes in gallium arsenide and gallium nitride.', 'Silicon carbide and gallium nitride power switches in electric vehicles.'],
  sim: { id: 'nc-bands', params: { mat: 'n' } }
},

{
  id: 'pn-junction', parent: 'solid-state', title: 'The p–n junction and the diode', level: 2,
  short: 'Where p-type meets n-type semiconductor, carriers diffuse across and leave a thin depletion layer with a built-in voltage. It lets current through in one direction only — the diode — and underlies LEDs, solar cells and transistors.',
  keywords: ['p-n junction', 'diode', 'depletion region', 'built-in potential', 'forward bias', 'reverse bias', 'Shockley equation', 'saturation current', 'rectifier', 'LED', 'solar cell', 'photodiode', 'breakdown', 'thermal voltage'],
  prereq: ['semiconductors', 'electric-potential', 'fermi-energy'],
  related: ['band-theory', 'electric-current', 'capacitance', 'lasers', 'photoelectric-effect'],
  body: `
Take a crystal of silicon that is p-type on one side and n-type on the other. The n side is full of free electrons, the p side full of holes, and at the boundary each diffuses into the other region, like two gases mixing. Electrons crossing into the p side meet holes and recombine; so do holes crossing the other way.

### The depletion region
The carriers that diffused away leave their dopant atoms behind as fixed ions: positive donors on the n side, negative acceptors on the p side. This thin **depletion region**, empty of mobile carriers and typically a fraction of a micrometre thick, holds an electric field pointing from n to p, which pushes back against further diffusion. Equilibrium is reached when the [[fermi-energy|Fermi levels]] of the two sides line up, with a **built-in potential**

$$V_{bi} = \\frac{k_BT}{e}\\,\\ln\\frac{N_A N_D}{n_i^2}$$

about 0.7 V for silicon with $10^{16}$ dopants per cm³ on each side. (A voltmeter across an unconnected diode reads nothing: the contact potentials at the metal leads cancel it.)

### One-way street
Apply a voltage $V$ with the p side positive — **forward bias** — and the barrier drops to $V_{bi} - V$. The number of carriers able to climb it rises exponentially, and a large current flows. Reverse the voltage and the barrier grows; the depletion layer widens, and only a tiny **saturation current** $I_s$ flows, carried by the few minority carriers that thermal generation supplies. The current follows the **Shockley diode equation**:

$$I = I_s\\left(e^{eV/n k_BT} - 1\\right)$$

with $k_BT/e = 25.9$ mV at room temperature (the thermal voltage) and an ideality factor $n$ between 1 and 2. For a small silicon diode $I_s \\sim 10^{-12}$ A, so the current is negligible until about 0.5 V, then shoots up: each extra 60 mV multiplies it by ten. That is why a silicon diode seems to "turn on" at about 0.6–0.7 V. $I_s$ grows very fast with temperature, roughly doubling every 5 K, so at fixed current the forward voltage falls by about 2 mV per kelvin — a simple thermometer. A large enough reverse voltage causes **breakdown** (by avalanche multiplication or by tunnelling, the Zener effect), which Zener diodes use as voltage references.

### A family of devices
- **Rectifiers** turn alternating current into direct current in every phone charger.
- **Light-emitting diodes**: in a direct-gap semiconductor, electrons and holes recombining in the junction emit photons of energy close to the [[band-theory|band gap]] — red at about 1.9 eV, blue (indium gallium nitride) at about 2.7 eV.
- **Photodiodes and solar cells** run it backwards: a photon absorbed in or near the depletion region makes an electron–hole pair, and the built-in field sweeps them apart, driving current through an external circuit. A silicon solar cell gives about 0.6 V in full sunlight.
- **Transistors** combine two junctions, or a junction and a gate, so that a small signal controls a large current.

> [!tip] Rules of thumb for silicon: forward drop about 0.6–0.7 V, current ×10 per 60 mV, forward voltage −2 mV/K, reverse current nanoamps or less.
`,
  ideas: [
    'At a p–n junction, carriers diffuse and recombine, leaving a depletion region of fixed ions.',
    'The depletion region\'s field creates a built-in potential of about 0.7 V in silicon.',
    'Forward bias lowers the barrier and the current grows exponentially; reverse bias leaves only a tiny saturation current.',
    'Shockley\'s equation: $I = I_s(e^{eV/nk_BT} - 1)$; ten times more current per 60 mV at room temperature.',
    'The same junction emits light (LED) or turns light into current (photodiode, solar cell).'
  ],
  pitfalls: [
    'The built-in voltage can power a circuit — In equilibrium it is balanced by the contact potentials at the metal leads; no current flows without light or an external source.',
    'A diode has a fixed "turn-on voltage" below which no current flows — The current grows exponentially and continuously; 0.6–0.7 V is just where it becomes milliamps for a typical diode.',
    'In reverse bias the depletion region conducts because of its strong field — It has almost no free carriers, which is why the reverse current is so small until breakdown.'
  ],
  formulas: [
    {
      name: 'Shockley diode equation',
      expr: 'I = Is*(exp(qe*V/(n*kB*T)) - 1)', tex: 'I = I_s\\left(e^{eV/n k_B T} - 1\\right)', solveFor: 'I',
      vars: {
        I: { name: 'diode current', q: 'current', unit: 'mA', signed: true },
        Is: { name: 'saturation current', q: 'current', unit: 'A', value: 1e-12, tex: 'I_s' },
        V: { name: 'voltage across the diode (p side positive)', q: 'voltage', unit: 'V', value: 0.6, signed: true },
        n: { name: 'ideality factor', q: 'none', value: 1 },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        qe: { const: 'qe' },
        kB: { const: 'kB' }
      },
      note: 'Negative $V$ is reverse bias, where $I \\to -I_s$. The ideality factor is 1 for an ideal junction, up to 2 when recombination in the depletion layer matters (many LEDs).',
      practice: { unknowns: ['I', 'V'] },
      stories: {
        I: 'A silicon diode with a saturation current of {Is} is forward-biased at {V} at {T}. What current flows?',
        V: 'What forward voltage drives {I} through a diode with {Is} saturation current at {T}?'
      }
    },
    {
      name: 'Built-in potential',
      expr: 'Vbi = kB*T/qe*ln(Na*Nd/ni^2)', tex: 'V_{bi} = \\frac{k_B T}{e}\\ln\\frac{N_A N_D}{n_i^2}',
      vars: {
        Vbi: { name: 'built-in potential', q: 'voltage', unit: 'V', tex: 'V_{bi}' },
        Na: { name: 'acceptor density (p side)', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'N_A' },
        Nd: { name: 'donor density (n side)', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'N_D' },
        ni: { name: 'intrinsic carrier density', q: 'numberdensity', unit: '1/cm³', value: 1e10, tex: 'n_i' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        kB: { const: 'kB' },
        qe: { const: 'qe' }
      },
      stories: { Vbi: 'A silicon junction (intrinsic density {ni}) has {Na} acceptors on one side and {Nd} donors on the other. What is its built-in potential at {T}?' }
    },
    {
      name: 'Width of the depletion region',
      expr: 'W = sqrt(2*epsr*eps0*(Vbi - V)/qe*(1/Na + 1/Nd))', tex: 'W = \\sqrt{\\frac{2\\varepsilon_r \\varepsilon_0 (V_{bi} - V)}{e}\\left(\\frac{1}{N_A} + \\frac{1}{N_D}\\right)}',
      vars: {
        W: { name: 'depletion width', q: 'length', unit: 'µm' },
        epsr: { name: 'relative permittivity (silicon 11.7)', q: 'none', value: 11.7, tex: '\\varepsilon_r' },
        Vbi: { name: 'built-in potential', q: 'voltage', unit: 'V', value: 0.714, tex: 'V_{bi}' },
        V: { name: 'applied voltage (negative for reverse bias)', q: 'voltage', unit: 'V', value: -2, signed: true },
        Na: { name: 'acceptor density', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'N_A' },
        Nd: { name: 'donor density', q: 'numberdensity', unit: '1/cm³', value: 1e16, tex: 'N_D' },
        eps0: { const: 'eps0' },
        qe: { const: 'qe' }
      },
      note: 'Abrupt junction. Reverse bias widens the layer as $\\sqrt{V_{bi} - V}$, which lowers its capacitance: varactor diodes tune radios this way.',
      practice: { unknowns: ['W', 'V'] },
      stories: { W: 'A silicon junction with {Na} and {Nd} on its two sides (built-in potential {Vbi}) is biased at {V}. How wide is its depletion region?' }
    }
  ],
  examples: [
    {
      title: 'Sixty millivolts per decade',
      q: 'A silicon diode has $I_s = 1.0\\times10^{-12}$ A and $n = 1$. Find the current at 0.60 V and at 0.66 V, at 300 K.',
      steps: [
        'Thermal voltage: $k_BT/e = 1.381\\times10^{-23} \\times 300/1.602\\times10^{-19} = 25.9\\ \\mathrm{mV}$.',
        'At 0.60 V: $e^{0.600/0.0259} = e^{23.2} = 1.2\\times10^{10}$, so $I = 12\\ \\mathrm{mA}$.',
        'At 0.66 V: $e^{25.5} = 1.2\\times10^{11}$, so $I = 120\\ \\mathrm{mA}$ — ten times more for 60 mV.',
        'In reverse, at $-5$ V: $I = -I_s = -10^{-12}$ A, eleven orders of magnitude smaller.'
      ],
      a: '12 mA at 0.60 V and 120 mA at 0.66 V.'
    },
    {
      title: 'Built-in voltage and depletion width',
      q: 'A silicon junction has $N_A = N_D = 10^{16}\\ \\mathrm{cm^{-3}}$. Find the built-in potential at 300 K and the depletion width with no bias ($\\varepsilon_r = 11.7$).',
      steps: [
        '$V_{bi} = 0.0259 \\ln\\dfrac{10^{16} \\times 10^{16}}{(10^{10})^2} = 0.0259 \\times \\ln 10^{12} = 0.0259 \\times 27.6 = 0.714\\ \\mathrm{V}$.',
        'In SI: $N_A = N_D = 10^{22}\\ \\mathrm{m^{-3}}$, so $\\tfrac{1}{N_A} + \\tfrac{1}{N_D} = 2\\times10^{-22}\\ \\mathrm{m^3}$.',
        '$W = \\sqrt{\\dfrac{2 \\times 11.7 \\times 8.85\\times10^{-12} \\times 0.714}{1.602\\times10^{-19}} \\times 2\\times10^{-22}} = \\sqrt{1.85\\times10^{-13}}\\ \\mathrm{m} = 0.43\\ \\mathrm{\\mu m}$.',
        'The field in the layer is roughly $V_{bi}/W \\approx 2\\times10^{6}$ V/m — strong enough to sweep any carrier across in picoseconds.'
      ],
      a: '$V_{bi}$ ≈ 0.71 V; $W$ ≈ 0.43 µm.'
    }
  ],
  quiz: [
    { q: 'Under forward bias, the depletion region…', choices: ['widens', 'narrows', 'stays the same', 'disappears for any voltage'], a: 1, why: 'The applied voltage opposes the built-in potential; the barrier $V_{bi} - V$ and with it the depletion width shrink.' },
    { q: 'Raising the forward voltage of a silicon diode at room temperature by 60 mV multiplies its current by about…', choices: ['1.06', '2', '10', '60'], a: 2, why: '$e^{0.060/0.0259} = e^{2.32} \\approx 10$.' },
    { q: 'Why is the reverse current of a diode so small?', choices: ['The diode has a very large resistor inside', 'It is carried only by the few thermally generated minority carriers', 'Electrons cannot move backwards', 'The depletion region is full of carriers that block it'], a: 1,
      why: 'The raised barrier stops majority carriers; only minority carriers, which the field sweeps across, contribute, and there are very few.' },
    { q: 'The depletion region of a p–n junction contains many free electrons and holes.', a: false, why: 'It is depleted of mobile carriers — that is its name — and holds only fixed donor and acceptor ions.' },
    { q: 'The colour of an LED is set mainly by…', choices: ['the colour of its plastic case', 'the band gap of its semiconductor', 'the voltage of the battery', 'its current'], a: 1, why: 'Photons come from electrons dropping across the gap, so $E_\\text{photon} \\approx E_g$: indium gallium nitride for blue, aluminium gallium indium phosphide for red.' }
  ],
  applications: ['Rectifiers in every power supply.', 'LEDs for lighting and displays; laser diodes in fibre-optic links.', 'Solar cells and photodiodes.', 'Temperature sensors that read the −2 mV/K drift of a diode\'s forward voltage.'],
  history: 'Russell Ohl found the p–n junction by accident in 1940, in a silicon rod that produced a voltage when lit. William Shockley worked out its theory in 1949, two years after the invention of the transistor at Bell Labs.',
  sim: 'nc-pn-junction'
},

{
  id: 'heat-capacity-solids', parent: 'solid-state', title: 'Heat capacity of solids', level: 3,
  short: 'Classically every atom in a solid stores $3k_BT$ of heat, giving 25 J per mole per kelvin. Quantum physics freezes the vibrations out at low temperature, and the heat capacity falls towards zero as T³.',
  keywords: ['heat capacity', 'Dulong-Petit', 'Einstein model', 'Debye model', 'Debye temperature', 'phonons', 'T cubed law', 'lattice vibrations', 'molar heat capacity', 'electronic heat capacity', 'equipartition'],
  prereq: ['specific-heat', 'equipartition', 'quantum-harmonic-oscillator'],
  related: ['fermi-energy', 'crystal-structure', 'third-law', 'thermal-expansion', 'blackbody-radiation'],
  body: `
In 1819 Pierre Dulong and Alexis Petit noticed something remarkable: although the [[specific-heat|specific heats]] of metals per kilogram differ widely, per mole of atoms they are almost all the same, about 25 J/(mol·K).

### The classical answer: 3R
[[equipartition|Equipartition]] explains it. Each atom in a solid vibrates about its place in three directions, and each vibration stores thermal energy both as kinetic energy and as elastic potential energy, $\\tfrac12 k_BT$ each. So every atom holds $3k_BT$, a mole holds $3RT$, and

$$C = 3R \\approx 24.9\\ \\mathrm{J/(mol\\,K)}$$

Per kilogram that is $c = 3R/M$: about 390 J/(kg·K) for copper, 920 for aluminium and only 120 for lead, whose heavy atoms mean few atoms per kilogram — which is why lead warms so quickly.

### The failure
The rule fails badly for light, stiff solids — diamond manages only 6.1 J/(mol·K) at room temperature — and for everything at low temperature: all heat capacities fall towards zero as $T \\to 0$, as the [[third-law|third law]] requires. Classical physics has no way to switch vibrations off.

### Einstein: quantized vibrations
In 1907 Einstein treated each atom as a [[quantum-harmonic-oscillator|quantum oscillator]] whose energy comes in steps of $\\hbar\\omega$. When $k_BT$ is well below $\\hbar\\omega$ an oscillator can rarely be excited at all, and it stops contributing. Defining the **Einstein temperature** $\\theta_E = \\hbar\\omega/k_B$,

$$C = 3R \\left(\\frac{\\theta_E}{T}\\right)^2 \\frac{e^{\\theta_E/T}}{\\left(e^{\\theta_E/T} - 1\\right)^2}$$

which approaches $3R$ at high temperature and falls exponentially at low temperature. Stiff bonds and light atoms mean high frequencies: diamond's vibrations are still largely frozen at room temperature.

### Debye: sound waves in the crystal
Atoms do not vibrate independently; they vibrate together, as waves travelling through the crystal. Their quanta are called **phonons**, the sound-wave counterpart of photons. Peter Debye (1912) counted these waves up to a maximum frequency fixed by the atomic spacing, the **Debye temperature** $\\theta_D$ being the corresponding temperature. Long, low-frequency waves can always be excited, so the heat capacity does not vanish exponentially but as

$$C \\approx \\frac{12\\pi^4}{5}\\, R \\left(\\frac{T}{\\theta_D}\\right)^3 \\qquad (T \\ll \\theta_D)$$

the **Debye $T^3$ law** — the same mathematics as the $T^4$ energy of [[blackbody-radiation|blackbody radiation]], with sound instead of light.

| Solid | $\\theta_D$ |
|---|---|
| lead | 105 K |
| gold | 165 K |
| copper | 343 K |
| aluminium | 428 K |
| iron | 470 K |
| silicon | 645 K |
| diamond | 2230 K |

Above $\\theta_D$ Dulong and Petit are right; well below it, the $T^3$ law takes over.

### The electrons' share
Why do the free electrons of a metal not add another $\\tfrac32 R$? Because only those within about $k_BT$ of the [[fermi-energy|Fermi level]] can take up energy, a fraction of order $T/T_F$. Their contribution, $\\gamma T$ with $\\gamma \\approx 0.7$ mJ/(mol·K²) for copper, is tiny at room temperature but beats the $T^3$ lattice term below a few kelvin.

> [!fact] Warming a mole of copper (64 g) from absolute zero to 10 K takes only about 0.15 J — which is why a tiny heat leak ruins a cryogenic experiment, and why low-temperature detectors are so sensitive.
`,
  ideas: [
    'Classically each atom stores $3k_BT$, so C = 3R ≈ 25 J/(mol·K) for any solid (Dulong–Petit).',
    'At low temperature vibrations freeze out, because their energy comes in quanta ħω.',
    'Einstein\'s model explains the fall; Debye\'s phonon model gives the correct T³ law at low temperature.',
    'The Debye temperature marks the change: light, stiff solids like diamond have high $\\theta_D$.',
    'Conduction electrons add only a small γT term, because of the Fermi–Dirac distribution.'
  ],
  pitfalls: [
    'All solids have about the same specific heat — The same per mole of atoms, near room temperature; per kilogram they differ by the ratio of atomic masses.',
    'Heat capacity is a fixed material constant — It depends strongly on temperature, dropping towards zero near absolute zero.',
    'Free electrons contribute a large share of a metal\'s heat capacity — Only those near the Fermi level can absorb heat; their share is about 1 % at room temperature.'
  ],
  formulas: [
    {
      name: 'Dulong–Petit specific heat',
      expr: 'c = 3*R/M', tex: 'c = \\frac{3R}{M}',
      vars: {
        c: { name: 'specific heat', q: 'specificheat', unit: 'J/(kg·K)' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 63.546 },
        R: { const: 'R' }
      },
      note: 'Good near room temperature for most metals ($T \\gtrsim \\theta_D$); too high for diamond, beryllium and silicon.',
      stories: { c: 'Estimate the specific heat of a metal with molar mass {M} from the Dulong–Petit rule.', M: 'A metal has a specific heat of {c}. Using Dulong and Petit, what is its molar mass?' }
    },
    {
      name: 'Einstein heat capacity',
      expr: 'C = 3*R*(thetaE/T)^2*exp(thetaE/T)/(exp(thetaE/T) - 1)^2',
      tex: 'C = 3R \\left(\\frac{\\theta_E}{T}\\right)^2 \\frac{e^{\\theta_E/T}}{\\left(e^{\\theta_E/T} - 1\\right)^2}',
      vars: {
        C: { name: 'molar heat capacity', q: 'molarheat', unit: 'J/(mol·K)' },
        thetaE: { name: 'Einstein temperature', q: 'temperature', unit: 'K', value: 240, tex: '\\theta_E' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 100 },
        R: { const: 'R' }
      },
      note: 'Copper fits roughly with $\\theta_E \\approx 240$ K. The model falls off too fast at the lowest temperatures, where Debye\'s $T^3$ law is right.',
      practice: { unknowns: ['C'] },
      stories: { C: 'In the Einstein model, what is the molar heat capacity of a solid with an Einstein temperature of {thetaE} at {T}?', T: 'At what temperature does a solid with an Einstein temperature of {thetaE} reach a molar heat capacity of {C}?' }
    },
    {
      name: 'Debye T³ law',
      expr: 'C = 12*pi^4/5*R*(T/thetaD)^3', tex: 'C = \\frac{12\\pi^4}{5} R \\left(\\frac{T}{\\theta_D}\\right)^3',
      vars: {
        C: { name: 'molar heat capacity (lattice)', q: 'molarheat', unit: 'J/(mol·K)' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 10 },
        thetaD: { name: 'Debye temperature', q: 'temperature', unit: 'K', value: 343, tex: '\\theta_D' },
        R: { const: 'R' }
      },
      note: 'Valid well below the Debye temperature (about $T < \\theta_D/10$). $12\\pi^4 R/5 = 1944\\ \\mathrm{J/(mol\\,K)}$.',
      stories: { C: 'What is the lattice heat capacity of copper (Debye temperature {thetaD}) at {T}?', thetaD: 'A crystal has a molar heat capacity of {C} at {T}. What is its Debye temperature?' }
    }
  ],
  examples: [
    {
      title: 'Copper, aluminium and lead',
      q: 'Use the Dulong–Petit rule to estimate the specific heats of copper (63.5 g/mol), aluminium (27.0 g/mol) and lead (207 g/mol). Measured: 385, 897 and 129 J/(kg·K).',
      steps: [
        '$3R = 24.94\\ \\mathrm{J/(mol\\,K)}$; divide by the molar mass in kg/mol.',
        'Copper: $24.94/0.0635 = 393$. Aluminium: $24.94/0.0270 = 924$. Lead: $24.94/0.207 = 120\\ \\mathrm{J/(kg\\,K)}$.',
        'All within about 7 % of the measured values. A kilogram of lead has only a third as many atoms as a kilogram of copper, so it needs a third of the heat.'
      ],
      a: 'About 393, 924 and 120 J/(kg·K).'
    },
    {
      title: 'Warming copper near absolute zero',
      q: 'How much heat warms one mole of copper from 0 K to 10 K? Use the Debye law with $\\theta_D = 343$ K and add the electrons, $\\gamma = 0.70\\ \\mathrm{mJ/(mol\\,K^2)}$.',
      steps: [
        'Lattice: $C = aT^3$ with $a = 1944/343^3 = 4.82\\times10^{-5}\\ \\mathrm{J/(mol\\,K^4)}$, so $Q = \\int_0^{10} aT^3\\, dT = a \\cdot 10^4/4 = 0.12\\ \\mathrm{J}$.',
        'Electrons: $Q = \\int_0^{10} \\gamma T\\, dT = \\gamma \\cdot 100/2 = 0.035\\ \\mathrm{J}$.',
        'Total about 0.16 J — at room temperature the same 0.16 J would warm the mole by only 0.006 K.'
      ],
      a: 'About 0.16 J.'
    }
  ],
  quiz: [
    { q: 'Why does diamond have a much lower molar heat capacity than lead at room temperature?', choices: ['Diamond has fewer electrons', 'Its stiff bonds and light atoms give high vibration frequencies that are still frozen out', 'Diamond is transparent', 'Lead is a metal'], a: 1,
      why: 'Diamond\'s Debye temperature is 2230 K; at 300 K most of its vibrational modes need more energy than $k_BT$ provides. Lead\'s is 105 K, so it is fully classical.' },
    { q: 'Well below the Debye temperature, halving the temperature changes the lattice heat capacity by a factor of…', choices: ['1/2', '1/4', '1/8', '1/16'], a: 2, why: 'The Debye law says $C \\propto T^3$, and $(1/2)^3 = 1/8$.' },
    { q: 'Per kilogram, which of these takes the least heat to warm by 1 K at room temperature?', choices: ['aluminium', 'iron', 'copper', 'lead'], a: 3, why: 'Each follows roughly $3R/M$; lead has the largest molar mass, so the fewest atoms per kilogram.' },
    { q: 'The heat capacity of every solid tends to zero as the temperature approaches absolute zero.', a: true, why: 'Vibrations freeze out as $T^3$ and electrons contribute only $\\gamma T$; both vanish at $T = 0$, as the third law of thermodynamics demands.' },
    { q: 'The Dulong–Petit value for the molar heat capacity of a solid is about…', choices: ['8.3 J/(mol·K)', '12.5 J/(mol·K)', '25 J/(mol·K)', '4186 J/(mol·K)'], a: 2, why: '$3R = 3 \\times 8.314 = 24.9$ J/(mol·K): three vibration directions, each with $k_BT$ of energy per atom.' }
  ],
  applications: ['Cryogenic design: at liquid-helium temperatures tiny heat leaks cause large temperature rises.', 'Bolometers and microcalorimeters that detect single X-ray photons through minute warming.', 'Measuring Debye temperatures to estimate stiffness and sound speeds of new materials.'],
  history: 'Einstein\'s 1907 paper was the first application of quantum ideas to matter rather than light. Debye refined it in 1912; Walther Nernst\'s measurements of heat capacities near absolute zero confirmed both and led him to the third law.'
}

);
