/* HYPER-PHYSICS · content/atomic-physics.js — atoms: the Bohr model, the hydrogen
 * spectrum, quantum numbers, spin, the exclusion principle, X-rays and lasers. */
Hyper.add(

{
  id: 'bohr-model', parent: 'atomic-physics', title: 'The Bohr model', level: 2,
  short: 'Electrons in hydrogen can only occupy certain orbits, each with a fixed energy, and emit or absorb light only when they jump between them.',
  keywords: ['Bohr model', 'Bohr atom', 'energy levels', 'stationary states', 'quantized orbits', 'Bohr radius', '13.6 eV', 'ionization energy', 'ground state', 'excited state', 'hydrogen-like ion', 'Rutherford atom'],
  prereq: ['coulombs-law', 'centripetal-force', 'photon', 'angular-momentum'],
  related: ['hydrogen-spectrum', 'hydrogen-atom-quantum', 'de-broglie-wavelength', 'uncertainty-principle'],
  body: `
In 1911 Ernest Rutherford showed that an atom has a tiny, heavy, positive nucleus with electrons somewhere around it. The obvious picture — electrons orbiting the nucleus like planets round the Sun — has a fatal flaw. An orbiting electron is accelerating, and an accelerating charge radiates. Classical electromagnetism predicts that it would spiral into the nucleus in about $10^{-11}$ s, sending out a smear of light of every colour on the way. Real atoms are stable, and they emit light only at a few sharp wavelengths ([[hydrogen-spectrum]]).

### Bohr's rules
In 1913 Niels Bohr kept the orbits but added rules that simply overrule classical physics:

1. The electron can move only in certain **stationary orbits**, in which it does not radiate.
2. The allowed orbits are those whose angular momentum is a whole number of $\\hbar$: $\\;m_e v r = n\\hbar$, with $n = 1, 2, 3, \\dots$
3. Light is emitted or absorbed only when the electron **jumps** between orbits, as a single [[photon]] carrying the difference in energy: $hf = E_\\text{upper} - E_\\text{lower}$.

### What follows
Combining rule 2 with the Coulomb force supplying the [[centripetal-force|centripetal force]] (see the derivation) gives, for one electron around a nucleus of charge $Ze$,

$$r_n = \\frac{n^2 a_0}{Z}, \\qquad E_n = -\\frac{13.6\\ \\mathrm{eV}\\; Z^2}{n^2}, \\qquad v_n = \\frac{Z\\alpha c}{n}$$

where $a_0 = 0.0529$ nm is the **Bohr radius** and $\\alpha \\approx 1/137$. The orbits grow as $n^2$; the energies are negative because zero is chosen for an electron at rest far away, so a bound electron has less energy than a free one. The lowest level, the **ground state**, has $E_1 = -13.6$ eV: that is the **ionization energy** of hydrogen, measured to be exactly that. The levels crowd together below zero as $n$ grows. In the ground state the electron moves at $2.2 \\times 10^6$ m/s, about $c/137$.

The model works for any atom or ion with a single electron — He⁺, Li²⁺ — whose energies are $Z^2$ times deeper and whose orbits are $Z$ times smaller.

### A matter-wave picture
De Broglie later gave rule 2 a meaning: an orbit is allowed when a whole number of electron wavelengths fits round it, $2\\pi r = n\\lambda$. With $\\lambda = h/m_ev$ this is exactly $m_e v r = n\\hbar$ ([[de-broglie-wavelength]]).

### Where it fails
The Bohr model gets hydrogen's energy levels exactly right, which is why it is still taught. But it cannot handle atoms with two or more electrons, cannot say how bright each spectral line is, and gives the ground state an angular momentum of $\\hbar$ when the true value is zero. The electron does not follow a circular path at all. Schrödinger's quantum mechanics replaced the orbits with standing waves spread round the nucleus ([[hydrogen-atom-quantum]]) — and gave the same energies.

> [!tip] In the simulation, make the electron jump between levels and watch each photon land on the spectrum. The big jumps down to $n = 1$ are ultraviolet; only jumps down to $n = 2$ are visible.
`,
  ideas: [
    'Electrons occupy stationary orbits with angular momentum nħ and do not radiate there.',
    'The allowed energies of hydrogen are E_n = −13.6 eV / n²; the orbit radii are n²a₀ with a₀ = 0.0529 nm.',
    'A jump between levels emits or absorbs one photon of energy equal to the difference.',
    'For a one-electron ion of nuclear charge Ze the energies scale as Z² and the radii as 1/Z.',
    'The model is right about the energy levels of hydrogen but wrong about orbits; quantum mechanics replaced it.'
  ],
  pitfalls: [
    'A negative energy means something unphysical — It only means the electron is bound: zero is the energy of an electron at rest far from the nucleus, and you must add energy to get it there.',
    'Electrons really move in circular orbits — The orbits are a stepping stone. In quantum mechanics the electron has no path; it has a probability cloud whose energies happen to match Bohr\'s.',
    'The energy levels are evenly spaced — They crowd together as n increases; the gap from n = 1 to 2 (10.2 eV) is larger than all the others put together (3.4 eV).'
  ],
  formulas: [
    {
      name: 'Energy levels of a one-electron atom',
      expr: 'E = -Ry*Z^2/n^2', tex: 'E_n = -\\frac{E_{\\mathrm{Ry}}\\, Z^2}{n^2}',
      vars: {
        E: { name: 'energy of level n', q: 'energy', unit: 'eV', tex: 'E_n', signed: true },
        Ry: { const: 'Ry', tex: 'E_{\\mathrm{Ry}}' },
        Z: { name: 'charge number of the nucleus', value: 1, int: true },
        n: { name: 'principal quantum number', value: 2, int: true }
      },
      note: '$E_{\\mathrm{Ry}} = 13.606$ eV is the Rydberg energy (13.598 eV for hydrogen itself, whose nucleus is not infinitely heavy). $Z = 1$ for hydrogen, 2 for He⁺, 3 for Li²⁺.',
      stories: {
        E: 'What is the energy of the electron in level n = {n} of an atom with nuclear charge Z = {Z} and a single electron?',
        n: 'A one-electron atom with Z = {Z} has its electron in a level of energy {E}. Which level is it?'
      }
    },
    {
      name: 'Radius of orbit n',
      expr: 'r = n^2*a0/Z', tex: 'r_n = \\frac{n^2 a_0}{Z}',
      vars: {
        r: { name: 'orbit radius', q: 'length', unit: 'nm', tex: 'r_n' },
        n: { name: 'principal quantum number', value: 2, int: true },
        a0: { const: 'a0' },
        Z: { name: 'charge number of the nucleus', value: 1, int: true }
      },
      stories: {
        r: 'In the Bohr model, what is the radius of orbit n = {n} of a one-electron atom with Z = {Z}?',
        n: 'Which Bohr orbit of hydrogen-like Z = {Z} has a radius of {r}?'
      }
    },
    {
      name: 'Speed in orbit n',
      expr: 'v = Z*alpha*c/n', tex: 'v_n = \\frac{Z\\alpha c}{n}',
      vars: {
        v: { name: 'orbital speed', q: 'speed', unit: 'm/s', tex: 'v_n' },
        Z: { name: 'charge number of the nucleus', value: 1, int: true },
        alpha: { const: 'alpha' }, c: { const: 'c' },
        n: { name: 'principal quantum number', value: 1, int: true }
      },
      note: '$\\alpha = 1/137.04$ is the fine-structure constant. For large $Z$ the speed approaches $c$ and relativistic effects matter.',
      stories: { v: 'How fast does the electron move in Bohr orbit n = {n} of a one-electron atom with Z = {Z}?' }
    }
  ],
  derivation: {
    title: 'Derive the Bohr radius and energies',
    steps: [
      { text: 'The Coulomb attraction of the nucleus ($Ze$) supplies the centripetal force, with $k = 1/4\\pi\\varepsilon_0$:', tex: '\\frac{kZe^2}{r^2} = \\frac{m_e v^2}{r}' },
      { text: 'Bohr\'s rule quantizes the angular momentum:', tex: 'm_e v r = n\\hbar \\;\\Rightarrow\\; v = \\frac{n\\hbar}{m_e r}' },
      { text: 'Substitute $v$ into the force equation and solve for $r$:', tex: 'r_n = \\frac{n^2\\hbar^2}{Z m_e k e^2} = \\frac{n^2 a_0}{Z}, \\qquad a_0 = \\frac{\\hbar^2}{m_e k e^2} = 0.0529\\ \\mathrm{nm}' },
      { text: 'The force equation also gives $\\tfrac12 m_ev^2 = \\tfrac12 kZe^2/r$: the kinetic energy is minus half the potential energy. The total is', tex: 'E = \\tfrac12 m_e v^2 - \\frac{kZe^2}{r} = -\\frac{kZe^2}{2r_n}' },
      { text: 'Insert $r_n$:', tex: 'E_n = -\\frac{m_e k^2 e^4}{2\\hbar^2}\\,\\frac{Z^2}{n^2} = -13.6\\ \\mathrm{eV}\\;\\frac{Z^2}{n^2}' }
    ]
  },
  examples: [
    {
      title: 'Ionizing hydrogen from an excited state',
      q: 'How much energy does it take to ionize a hydrogen atom whose electron is in level n = 2, and what is the longest wavelength of light that can do it?',
      steps: [
        '$E_2 = -13.6/2^2 = -3.40\\ \\mathrm{eV}$.',
        'To free the electron its energy must be raised to zero: 3.40 eV.',
        'Longest wavelength: $\\lambda = hc/E = 1240\\ \\mathrm{eV\\,nm}/3.40\\ \\mathrm{eV} = 365\\ \\mathrm{nm}$, in the near ultraviolet. This is the short-wavelength limit of the Balmer series.'
      ],
      a: '3.40 eV; light shorter than about 365 nm.'
    },
    {
      title: 'Inside the ground state',
      q: 'For hydrogen\'s ground state in the Bohr model, find the electron\'s speed, the time for one orbit, and the kinetic and potential energies.',
      steps: [
        'Speed: $v_1 = \\alpha c = 2.19\\times10^6\\ \\mathrm{m/s}$, less than 1 % of the speed of light.',
        'Period: $T = 2\\pi a_0/v_1 = 2\\pi(5.29\\times10^{-11})/2.19\\times10^6 = 1.5\\times10^{-16}\\ \\mathrm{s}$.',
        'Kinetic energy $+13.6$ eV and potential energy $-27.2$ eV, adding to $E_1 = -13.6$ eV (the kinetic energy is always minus half the potential energy for a Coulomb orbit).'
      ],
      a: '2.2 × 10⁶ m/s, 1.5 × 10⁻¹⁶ s per orbit, KE +13.6 eV and PE −27.2 eV.'
    },
    {
      title: 'A helium ion',
      q: 'He⁺ has a single electron around a nucleus with Z = 2. Find its ground-state energy and radius, and the energy of the photon emitted in a jump from n = 2 to n = 1.',
      steps: [
        '$E_1 = -13.6 \\times 2^2 = -54.4\\ \\mathrm{eV}$ and $r_1 = a_0/2 = 0.026\\ \\mathrm{nm}$.',
        '$E_2 = -54.4/4 = -13.6\\ \\mathrm{eV}$.',
        'Photon: $54.4 - 13.6 = 40.8\\ \\mathrm{eV}$, $\\lambda = 1240/40.8 = 30.4\\ \\mathrm{nm}$ — far ultraviolet. Solar telescopes image the Sun\'s hot atmosphere in exactly this line.'
      ],
      a: '−54.4 eV, 0.026 nm, and a 40.8 eV (30.4 nm) photon.'
    }
  ],
  quiz: [
    { q: 'In the Bohr model, the radius of the n = 3 orbit compared with n = 1 is…', choices: ['3 times larger', '9 times larger', '1/3 as large', '1/9 as large'], a: 1,
      why: '$r_n = n^2 a_0$, so $r_3 = 9a_0$.' },
    { q: 'Ionizing hydrogen from its ground state takes 13.6 eV. From n = 2 it takes…', choices: ['13.6 eV', '6.8 eV', '3.4 eV', '27.2 eV'], a: 2,
      why: '$E_2 = -13.6/4 = -3.4$ eV, so 3.4 eV brings it to zero.' },
    { q: 'Why are the Bohr energies negative?', choices: ['Because the electron\'s charge is negative', 'Zero is the energy of an electron at rest far away, and a bound electron has less energy than that', 'The kinetic energy in orbit is negative', 'It is an error in the model'], a: 1,
      why: 'The zero of potential energy is at infinite separation. Binding lowers the energy, and you must supply energy to separate the electron.' },
    { q: 'The Bohr model correctly predicts the spectra of all atoms.', a: false,
      why: 'It works only for one-electron atoms and ions. Electron–electron repulsion in other atoms needs full quantum mechanics.' },
    { q: 'As n increases, the electron\'s speed in the Bohr orbits…', choices: ['increases', 'decreases as 1/n', 'stays the same', 'decreases as 1/n²'], a: 1,
      why: '$v_n = Z\\alpha c/n$. Outer orbits are larger and slower, as for planets.' }
  ],
  applications: [
    'Estimating energies and sizes of hydrogen-like ions in stars and fusion plasmas.',
    'Rydberg atoms — atoms with an electron in a very high level, n of 100 or more — are micrometres across and are used in quantum computing and sensing.',
    'The Bohr-model scaling explains why X-ray energies of heavy atoms grow roughly as Z² (see Moseley\'s law in [[x-rays]]).'
  ],
  history: 'Bohr published his model in 1913, working in Rutherford\'s laboratory in Manchester, and received the Nobel Prize in 1922. The Franck–Hertz experiment of 1914 confirmed that atoms absorb energy only in discrete amounts.',
  sim: 'qm-bohr'
},

{
  id: 'hydrogen-spectrum', parent: 'atomic-physics', title: 'The hydrogen spectrum', level: 2,
  short: 'Hot hydrogen glows at a set of sharp wavelengths — red, blue-green, violet and many invisible ones — each from a jump between two of its energy levels.',
  keywords: ['hydrogen spectrum', 'spectral lines', 'Balmer series', 'Lyman series', 'Paschen series', 'Rydberg formula', 'Rydberg constant', 'H-alpha', 'emission spectrum', 'absorption spectrum', 'series limit', '21 cm line'],
  prereq: ['bohr-model', 'photon', 'diffraction-grating'],
  related: ['stellar-spectra', 'quantum-numbers', 'lasers', 'hubbles-law'],
  body: `
Pass an electric discharge through hydrogen gas and it glows pinkish-red. Spread the light with a prism or a [[diffraction-grating|grating]] and instead of a rainbow you see four sharp coloured lines on a dark background:

| Line | Colour | Wavelength (in air) |
|---|---|---|
| Hα | red | 656.3 nm |
| Hβ | blue-green | 486.1 nm |
| Hγ | violet | 434.0 nm |
| Hδ | violet | 410.2 nm |

In 1885 Johann Balmer, a Swiss schoolteacher, found by trial that these wavelengths fit a simple formula. Johannes Rydberg generalized it a few years later:

$$\\frac{1}{\\lambda} = R_H \\left(\\frac{1}{n_f^2} - \\frac{1}{n_i^2}\\right), \\qquad R_H = 1.0968 \\times 10^7\\ \\mathrm{m^{-1}}$$

with whole numbers $n_i > n_f$. The visible lines have $n_f = 2$ and $n_i = 3, 4, 5, 6$.

### Where the formula comes from
The [[bohr-model|Bohr model]] explained it in 1913. The energy levels are $E_n = -13.6\\ \\mathrm{eV}/n^2$, and a jump from level $n_i$ down to $n_f$ releases one [[photon]] carrying the difference:

$$hf = \\frac{hc}{\\lambda} = 13.6\\ \\mathrm{eV}\\left(\\frac{1}{n_f^2} - \\frac{1}{n_i^2}\\right)$$

Dividing by $hc$ gives Rydberg's formula, and Bohr's theory predicted the value of $R$ from $m_e$, $e$, $h$ and $c$. (The measured $R_H$ is 0.05 % smaller than the ideal $R_\\infty$ because the proton is not infinitely heavy: electron and proton both circle their common centre of mass.)

### Series
Each lower level gathers a family of lines, a **series**, which crowds together towards a **series limit** — the jump from the edge of ionization, $n_i \\to \\infty$:

| Series | Lower level | Region | Wavelengths |
|---|---|---|---|
| Lyman | 1 | ultraviolet | 121.6 nm down to 91.2 nm |
| Balmer | 2 | visible and near UV | 656.3 nm down to 364.6 nm |
| Paschen | 3 | infrared | 1875 nm down to 820 nm |
| Brackett | 4 | infrared | 4051 nm down to 1458 nm |
| Pfund | 5 | infrared | 7460 nm down to 2279 nm |

Only the Balmer series reaches the visible. The Lyman series is ultraviolet because every jump to the ground state releases at least 10.2 eV.

### Emission and absorption
Hot, thin gas **emits** at these wavelengths. Cooler gas in front of a hotter source **absorbs** at the same wavelengths, leaving dark lines in a continuous spectrum. Joseph von Fraunhofer mapped hundreds of dark lines in sunlight in 1814; two of the strongest, which he labelled C and F, are Hα and Hβ. Spectral lines are how astronomers know what stars are made of, how hot they are ([[stellar-spectra]]) and, from the shift of the lines, how fast they move ([[hubbles-law]]).

### Fine details
Measured closely, each line splits into components (fine structure, from [[electron-spin]] and relativity). In 1931 Harold Urey found faint companions of the Balmer lines shifted by about 0.18 nm and so discovered deuterium, heavy hydrogen, whose slightly different $R$ comes from its heavier nucleus. And a tiny flip of the electron's spin in the ground state emits the 21 cm radio line, with which radio astronomers map cold hydrogen across the Galaxy.

> [!note] Tables list wavelengths measured in air, about 0.03 % shorter than in vacuum. The Rydberg formula gives vacuum wavelengths: 656.5 nm for Hα.
`,
  ideas: [
    'Hydrogen emits and absorbs only at sharp wavelengths given by 1/λ = R_H (1/n_f² − 1/n_i²).',
    'Each line is a jump between two Bohr levels; the photon carries the energy difference.',
    'Lines ending on n = 1 form the ultraviolet Lyman series, on n = 2 the visible Balmer series, on n = 3 the infrared Paschen series.',
    'Each series crowds towards a series limit, set by the ionization energy of its lower level.',
    'The same wavelengths appear as dark absorption lines when cooler hydrogen lies in front of a hotter source.'
  ],
  pitfalls: [
    'A jump from a higher level always gives a shorter wavelength — Only within one series. The 7 → 6 line (12.4 µm) has a far longer wavelength than 2 → 1 (122 nm), although it starts higher.',
    'Hydrogen has only four spectral lines — It has infinitely many; only four Balmer lines fall where the eye can see them.',
    'Absorption lines come from a different set of transitions — They are the same transitions run backwards, starting from whichever levels are populated.'
  ],
  formulas: [
    {
      name: 'Rydberg formula',
      expr: '1/lambda = RH*(1/nf^2 - 1/ni^2)', tex: '\\frac{1}{\\lambda} = R_H\\left(\\frac{1}{n_f^2} - \\frac{1}{n_i^2}\\right)', solveFor: 'lambda',
      vars: {
        lambda: { name: 'wavelength (in vacuum)', q: 'length', unit: 'nm' },
        RH: { name: 'Rydberg constant for hydrogen', q: 'wavenumber', unit: '1/m', value: 1.09678e7, tex: 'R_H' },
        nf: { name: 'lower level', value: 2, int: true, tex: 'n_f' },
        ni: { name: 'upper level', value: 3, int: true, tex: 'n_i' }
      },
      note: 'Needs $n_i > n_f$. For a one-electron ion of charge $Z$ multiply $R$ by $Z^2$.',
      practice: { unknowns: ['lambda', 'ni'] },
      stories: {
        lambda: 'What is the wavelength of the light emitted when hydrogen\'s electron jumps from level {ni} to level {nf}?',
        ni: 'Hydrogen emits a line of wavelength {lambda} in a jump that ends on level {nf}. Which level did it start from?'
      }
    },
    {
      name: 'Energy of the photon from a jump',
      expr: 'E = Ry*(1/nf^2 - 1/ni^2)', tex: 'E = E_{\\mathrm{Ry}}\\left(\\frac{1}{n_f^2} - \\frac{1}{n_i^2}\\right)',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        Ry: { const: 'Ry', tex: 'E_{\\mathrm{Ry}}' },
        nf: { name: 'lower level', value: 2, int: true, tex: 'n_f' },
        ni: { name: 'upper level', value: 3, int: true, tex: 'n_i' }
      },
      practice: { unknowns: ['E', 'ni'] },
      stories: {
        E: 'How much energy does the photon carry when hydrogen\'s electron drops from level {ni} to level {nf}?',
        ni: 'A hydrogen atom emits a {E} photon in a jump down to level {nf}. From which level did it jump?'
      }
    },
    {
      name: 'Series limit',
      expr: 'lambda = nf^2/RH', tex: '\\lambda_\\infty = \\frac{n_f^2}{R_H}',
      vars: {
        lambda: { name: 'shortest wavelength of the series', q: 'length', unit: 'nm', tex: '\\lambda_\\infty' },
        nf: { name: 'lower level of the series', value: 2, int: true, tex: 'n_f' },
        RH: { name: 'Rydberg constant for hydrogen', q: 'wavenumber', unit: '1/m', value: 1.09678e7, tex: 'R_H' }
      },
      practice: { unknowns: ['lambda'] },
      stories: { lambda: 'What is the shortest wavelength in the hydrogen series that ends on level {nf}?' }
    }
  ],
  examples: [
    {
      title: 'The red line of hydrogen',
      q: 'Find the wavelength and photon energy of the jump from n = 3 to n = 2.',
      steps: [
        '$\\dfrac{1}{\\lambda} = 1.0968\\times10^7 \\left(\\dfrac14 - \\dfrac19\\right) = 1.0968\\times10^7 \\times 0.13889 = 1.5233\\times10^6\\ \\mathrm{m^{-1}}$.',
        '$\\lambda = 656.5\\ \\mathrm{nm}$ in vacuum (656.3 nm in air) — red, Hα.',
        'Energy: $E = 13.6\\ \\mathrm{eV}\\,(1/4 - 1/9) = 1.89\\ \\mathrm{eV}$, and indeed $1240/656.5 = 1.89$ eV.'
      ],
      a: '656 nm, 1.89 eV.'
    },
    {
      title: 'Which lines can we see?',
      q: 'Show that only the Balmer series has lines between 400 and 700 nm.',
      steps: [
        'Visible photons carry between $1240/700 = 1.77$ eV and $1240/400 = 3.10$ eV.',
        'Lyman: every jump to n = 1 releases at least $13.6(1 - 1/4) = 10.2$ eV — ultraviolet.',
        'Paschen: jumps to n = 3 release at most $13.6/9 = 1.51$ eV — infrared. Higher series release even less.',
        'Balmer: from $13.6(1/4 - 1/9) = 1.89$ eV up to $13.6/4 = 3.40$ eV. The lines from n = 3, 4, 5 and 6 (1.89, 2.55, 2.86 and 3.02 eV) are visible; from n = 7 upwards they are in the near ultraviolet.'
      ],
      a: 'Only Balmer lines (from n = 3 to 6) are visible.'
    }
  ],
  quiz: [
    { q: 'Which series of hydrogen lines lies in the visible?', choices: ['Lyman', 'Balmer', 'Paschen', 'Brackett'], a: 1,
      why: 'Jumps ending on n = 2 release 1.9–3.4 eV, which covers the visible. Lyman is ultraviolet and the others infrared.' },
    { q: 'The jump n = 3 → 2 gives red light at 656 nm. The jump n = 4 → 2 gives…', choices: ['infrared light', 'blue-green light at 486 nm', 'the same red light', 'X-rays'], a: 1,
      why: 'Falling from higher up releases more energy, so the wavelength is shorter: Hβ at 486 nm.' },
    { q: 'The shortest wavelength of the Balmer series comes from…', choices: ['the jump 3 → 2', 'an electron captured from far away (n → ∞) into n = 2', 'the jump 2 → 1', 'the jump ∞ → 1'], a: 1,
      why: 'The series limit is the largest possible energy release ending on n = 2: 3.40 eV, 365 nm.' },
    { q: 'Within each series, the lines get closer together towards the short-wavelength end.', a: true,
      why: 'The upper levels crowd together as n grows, so the energy differences to the lower level bunch up towards the series limit.' },
    { q: 'White light shines through cool hydrogen gas. The spectrum that comes out shows…', choices: ['bright lines on a dark background', 'dark lines at wavelengths the gas could also emit', 'a continuous rainbow, unchanged', 'lines at wavelengths different from its emission lines'], a: 1,
      why: 'Atoms absorb photons whose energy matches a jump up from an occupied level — the same transitions as in emission, run backwards.' }
  ],
  applications: [
    'Identifying elements and measuring temperatures and velocities of stars and gas clouds.',
    'Hα filters for photographing glowing nebulae and the solar chromosphere.',
    'Mapping the Milky Way\'s spiral arms with the 21 cm radio line of cold hydrogen.',
    'Measuring the expansion of the universe from the redshift of hydrogen lines in distant galaxies.'
  ],
  history: 'Ångström measured the four visible hydrogen lines precisely in the 1860s; Balmer found his formula in 1885 and Rydberg the general form in 1888. Lyman (1906), Paschen (1908), Brackett (1922) and Pfund (1924) found the other series, each where the Rydberg formula said it should be.',
  sim: 'qm-bohr'
},

{
  id: 'quantum-numbers', parent: 'atomic-physics', title: 'Quantum numbers', level: 2,
  short: 'Four numbers label every electron state in an atom: the shell n, the orbital shape ℓ, its orientation m_ℓ, and the spin m_s.',
  keywords: ['quantum numbers', 'principal quantum number', 'orbital quantum number', 'magnetic quantum number', 'spin quantum number', 'orbital angular momentum', 'space quantization', 's p d f', 'shell', 'subshell', 'orbital', 'Zeeman effect', 'degeneracy'],
  prereq: ['bohr-model', 'angular-momentum', 'de-broglie-wavelength'],
  related: ['electron-spin', 'pauli-exclusion', 'hydrogen-atom-quantum', 'magnetic-materials'],
  body: `
Bohr's model labels hydrogen's states with a single number $n$. But an electron moves in three dimensions, and a standing wave in three dimensions needs three numbers to specify it — just as the vibrations of a drum need two. Quantum mechanics ([[hydrogen-atom-quantum]]) gives three, and the electron's [[electron-spin|spin]] adds a fourth.

| Symbol | Name | Allowed values | What it describes |
|---|---|---|---|
| $n$ | principal | 1, 2, 3, … | shell: size and (mostly) energy |
| $\\ell$ | orbital | 0, 1, …, n − 1 | shape; magnitude of orbital angular momentum |
| $m_\\ell$ | magnetic | −ℓ, …, 0, …, +ℓ | orientation of the orbit |
| $m_s$ | spin | +½ or −½ | spin up or down |

Values of $\\ell$ have letters from old spectroscopy: $\\ell = 0, 1, 2, 3$ are **s, p, d, f** (for sharp, principal, diffuse, fundamental). A "3d electron" has $n = 3$, $\\ell = 2$.

### Angular momentum, quantized twice
The orbital angular momentum has magnitude

$$L = \\sqrt{\\ell(\\ell + 1)}\\;\\hbar$$

— not $\\ell\\hbar$ — and its component along any chosen axis (call it $z$, usually the direction of a magnetic field) can take only the values

$$L_z = m_\\ell\\,\\hbar$$

This is **space quantization**: a d electron's angular momentum, of size $\\sqrt 6\\,\\hbar = 2.45\\hbar$, can point only in five directions relative to the field, with $L_z = -2\\hbar$ to $+2\\hbar$. Since $|m_\\ell| < \\sqrt{\\ell(\\ell+1)}$, the vector can never lie exactly along the axis; the other components stay uncertain, and the vector can be pictured as lying anywhere on a cone. An s electron ($\\ell = 0$) has no orbital angular momentum at all, something no classical orbit could manage.

### Counting states
For each $n$ there are $n$ values of $\\ell$, and each $\\ell$ has $2\\ell + 1$ values of $m_\\ell$, making $n^2$ orbitals; with two spin states, a shell has room for $2n^2$ states: 2, 8, 18, 32. In hydrogen all the states of one shell have the same energy (they are *degenerate*). In atoms with more electrons, states with smaller $\\ell$ dip closer to the nucleus, feel more of its charge and lie lower, so the energy depends on $n$ and $\\ell$ — the key to the [[pauli-exclusion|periodic table]].

### The Zeeman effect
An orbiting electron is a small current loop with a magnetic moment $\\mu_z = -m_\\ell\\,\\mu_B$, where $\\mu_B = e\\hbar/2m_e = 5.79 \\times 10^{-5}$ eV/T is the **Bohr magneton**. In a magnetic field $B$ the $2\\ell + 1$ orientations get slightly different energies, $\\Delta E = m_\\ell\\,\\mu_B B$, and a spectral line splits into components. Pieter Zeeman saw the splitting in 1896; in 1908 George Ellery Hale used it to discover that sunspots are regions of strong magnetic field.

### Selection rules
A photon carries one unit of angular momentum, so in the usual transitions $\\ell$ changes by exactly 1 and $m_\\ell$ by 0 or ±1. A 2p electron can drop to 1s; a 2s electron cannot emit a photon that way and can linger for about a tenth of a second.
`,
  ideas: [
    'Each electron state in an atom is labelled by n, ℓ, m_ℓ and m_s.',
    'ℓ runs from 0 to n − 1 (s, p, d, f …) and m_ℓ from −ℓ to +ℓ; m_s is ±½.',
    'The orbital angular momentum has size √(ℓ(ℓ+1)) ħ, and its component along any axis is m_ℓħ.',
    'A shell n holds 2n² electron states.',
    'In a magnetic field the m_ℓ states separate in energy (the Zeeman effect).'
  ],
  pitfalls: [
    'The orbital angular momentum is ℓħ — Its size is √(ℓ(ℓ+1)) ħ; ℓħ is the largest possible component along one axis.',
    'Higher ℓ always means higher energy — In hydrogen, states with the same n have the same energy whatever ℓ; ℓ matters for energy only in atoms with several electrons.',
    'm_ℓ describes where the electron is on its orbit — It describes the orientation of the angular momentum relative to a chosen axis, not a position.'
  ],
  formulas: [
    {
      name: 'Size of the orbital angular momentum',
      expr: 'L = sqrt(l*(l + 1))*hbar', tex: 'L = \\sqrt{\\ell(\\ell + 1)}\\;\\hbar',
      vars: {
        L: { name: 'orbital angular momentum', q: 'angmom', unit: 'ħ' },
        l: { name: 'orbital quantum number', value: 2, int: true, tex: '\\ell' },
        hbar: { const: 'hbar' }
      },
      stories: { L: 'How large is the orbital angular momentum of an electron with ℓ = {l}?' }
    },
    {
      name: 'Angle between L and the field axis',
      expr: 'cos(theta) = ml/sqrt(l*(l + 1))', tex: '\\cos\\theta = \\frac{m_\\ell}{\\sqrt{\\ell(\\ell + 1)}}', solveFor: 'theta',
      vars: {
        theta: { name: 'angle between L and the z axis', q: 'angle', unit: '°', min: 0, max: 180 },
        ml: { name: 'magnetic quantum number', value: 2, int: true, signed: true, tex: 'm_\\ell' },
        l: { name: 'orbital quantum number', value: 2, int: true, tex: '\\ell' }
      },
      note: 'Even for $m_\\ell = \\ell$ the angle is not zero: the angular momentum can never lie along the axis.',
      practice: { unknowns: ['theta'] },
      stories: { theta: 'An electron has ℓ = {l} and m_ℓ = {ml}. What angle does its orbital angular momentum make with the z axis?' }
    },
    {
      name: 'States in a shell',
      expr: 'N = 2*n^2',
      vars: {
        N: { name: 'number of electron states', int: true },
        n: { name: 'principal quantum number', value: 3, int: true }
      },
      stories: { N: 'How many electrons fit in the shell with n = {n}?', n: 'Which shell holds {N} electron states?' }
    },
    {
      name: 'Zeeman shift of an orbital level',
      expr: 'dE = ml*muB*B', tex: '\\Delta E = m_\\ell\\,\\mu_B B',
      vars: {
        dE: { name: 'energy shift', q: 'energy', unit: 'eV', tex: '\\Delta E', signed: true },
        ml: { name: 'magnetic quantum number', value: 1, int: true, signed: true, tex: 'm_\\ell' },
        muB: { const: 'muB' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 }
      },
      note: 'Orbital motion only (the "normal" Zeeman effect). Spin adds its own, slightly larger shifts.',
      stories: {
        dE: 'By how much does a magnetic field of {B} shift the energy of a state with m_ℓ = {ml}?',
        B: 'What field shifts a state with m_ℓ = {ml} by {dE}?'
      }
    }
  ],
  examples: [
    {
      title: 'Counting the states of the third shell',
      q: 'List the states with n = 3 and count them.',
      steps: [
        '$\\ell$ can be 0, 1 or 2: the 3s, 3p and 3d subshells.',
        '3s: $m_\\ell = 0$, one orbital. 3p: $m_\\ell = -1, 0, 1$, three orbitals. 3d: $m_\\ell = -2 \\dots 2$, five orbitals.',
        'That is $1 + 3 + 5 = 9 = 3^2$ orbitals, each with two spin states: 18 electron states.'
      ],
      a: '9 orbitals, 18 states (3s: 2, 3p: 6, 3d: 10).'
    },
    {
      title: 'How big is the Zeeman effect?',
      q: 'Hydrogen\'s red line (656.3 nm, 1.89 eV) is observed in a 1.0 T field. By how much are the outer Zeeman components shifted in wavelength?',
      steps: [
        'Energy shift: $\\Delta E = \\mu_B B = 5.79\\times10^{-5}\\ \\mathrm{eV}$ for $\\Delta m_\\ell = \\pm 1$.',
        'Since $\\lambda = hc/E$, a small change gives $|\\Delta\\lambda| = \\lambda\\,\\Delta E/E = 656.3 \\times 5.79\\times10^{-5}/1.89$.',
        '$|\\Delta\\lambda| = 0.020\\ \\mathrm{nm}$ — three parts in $10^5$. A good spectrograph resolves it easily.'
      ],
      a: 'About 0.02 nm either side of the line.'
    }
  ],
  quiz: [
    { q: 'How many values of $m_\\ell$ are allowed when $\\ell = 3$?', choices: ['3', '4', '6', '7'], a: 3,
      why: '$m_\\ell$ runs from −3 to +3: that is $2\\ell + 1 = 7$ values.' },
    { q: 'For n = 2, which value of ℓ is not allowed?', choices: ['0', '1', '2', 'all are allowed'], a: 2,
      why: 'ℓ goes up to n − 1 = 1. There is no 2d subshell; d orbitals start at n = 3.' },
    { q: 'A p electron (ℓ = 1) has orbital angular momentum of size…', choices: ['ħ', '√2 ħ', '2ħ', 'zero'], a: 1,
      why: '$\\sqrt{\\ell(\\ell+1)}\\,\\hbar = \\sqrt 2\\,\\hbar$. Its largest component along an axis is ħ.' },
    { q: 'In hydrogen, the 2s and 2p states have the same energy (ignoring tiny corrections).', a: true,
      why: 'For a pure Coulomb field the energy depends only on n. In other atoms, screening by inner electrons separates them.' },
    { q: 'Why can the orbital angular momentum never point exactly along the z axis?', choices: ['Because |m_ℓ| is always smaller than √(ℓ(ℓ+1))', 'Because the electron spins', 'Because of the Pauli principle', 'It can, when m_ℓ = ℓ'], a: 0,
      why: 'Even the largest component, ℓħ, is less than the magnitude √(ℓ(ℓ+1))ħ, so some angular momentum always remains in the other directions.' }
  ],
  applications: [
    'The layout of the periodic table and the shapes of chemical bonds follow from s, p, d and f orbitals.',
    'Zeeman splitting measures magnetic fields on the Sun and other stars.',
    'Magneto-optical traps use Zeeman shifts to cool and hold atoms at microkelvin temperatures.'
  ],
  history: 'Arnold Sommerfeld added elliptical orbits and a second quantum number to Bohr\'s model in 1916; the complete set emerged from Schrödinger\'s equation in 1926, with Pauli and Uhlenbeck and Goudsmit contributing the fourth, spin, in 1925.'
},

{
  id: 'electron-spin', parent: 'atomic-physics', title: 'Electron spin', level: 2,
  short: 'Every electron carries a built-in angular momentum of ħ/2 and a tiny magnetic moment. Measured along any axis, the spin is always either up or down.',
  keywords: ['spin', 'electron spin', 'spin up', 'spin down', 'Stern–Gerlach', 'spin ½', 'magnetic moment', 'Bohr magneton', 'g-factor', 'fine structure', 'ESR', 'EPR', 'fermion', 'boson', 'spintronics'],
  prereq: ['quantum-numbers', 'torque-on-loop', 'angular-momentum'],
  related: ['pauli-exclusion', 'magnetic-materials', 'hydrogen-atom-quantum'],
  body: `
In 1922 Otto Stern and Walther Gerlach sent a beam of silver atoms through a strongly **non-uniform** magnetic field. A uniform field only twists a magnetic moment ([[torque-on-loop]]); a field that changes across the beam also pushes it, up or down depending on how the moment points. Classically the atoms' tiny magnets would be oriented at random, and the beam should have spread into a continuous smear. Instead it split cleanly into **two** spots.

Two was a puzzle even for quantum theory. Orbital angular momentum gives $2\\ell + 1$ orientations — an odd number ([[quantum-numbers]]) — and silver's outer electron has $\\ell = 0$ anyway. In 1925 George Uhlenbeck and Samuel Goudsmit proposed that the electron itself carries an intrinsic angular momentum, **spin**, with quantum number $s = \\tfrac12$:

$$S = \\sqrt{s(s+1)}\\;\\hbar = \\frac{\\sqrt 3}{2}\\hbar, \\qquad S_z = m_s\\hbar = \\pm\\frac{\\hbar}{2}$$

Along whatever axis you measure, you find one of just two values: **spin up** or **spin down**.

### A magnet you cannot switch off
The spin comes with a magnetic moment of almost exactly one **Bohr magneton**, $\\mu_B = e\\hbar/2m_e = 9.274 \\times 10^{-24}$ J/T. Written as $\\mu_z = -g\\,m_s\\,\\mu_B$, the **g-factor** of the electron is 2.0023: twice what a spinning charged ball would have. Dirac's relativistic equation of 1928 predicted the 2; quantum electrodynamics explains the extra 0.0023, and theory and experiment now agree to about one part in a trillion.

In a field $B$ the spin-down and spin-up states differ in energy by

$$\\Delta E = g\\,\\mu_B B \\approx 1.16 \\times 10^{-4}\\ \\mathrm{eV}\\ \\text{per tesla},$$

and microwaves of frequency $f = \\Delta E/h$ — 28 GHz per tesla — can flip it. That is **electron spin resonance**, used to study free radicals and defects in materials.

### Not a spinning ball
It is tempting to imagine a tiny charged sphere rotating. It does not work: an electron small enough to fit the experimental limits on its size would need a surface speed far beyond the speed of light to carry $\\hbar/2$. Spin is a basic property of the electron, like its charge and mass, with no classical picture.

### Why spin matters
- **Fine structure.** The electron's magnetic moment feels the magnetic field of its own orbital motion, which splits levels with $\\ell > 0$ in two. Sodium's bright yellow line is a pair: 589.0 and 589.6 nm.
- **The periodic table.** Each orbital holds two electrons, one of each spin ([[pauli-exclusion]]).
- **Magnetism.** Permanent magnets are materials in which many electron spins line up ([[magnetic-materials]]).
- **Fermions and bosons.** Particles with half-integer spin (electrons, protons, neutrons) obey the exclusion principle; particles with whole-number spin (photons) do not.

Protons and neutrons have spin ½ too, with much smaller magnetic moments. Flipping proton spins in a strong field is the basis of MRI.
`,
  ideas: [
    'The electron has an intrinsic angular momentum, spin, with s = ½.',
    'Measured along any axis, the spin component is +ħ/2 or −ħ/2 — never anything in between.',
    'The spin carries a magnetic moment of about one Bohr magneton (g ≈ 2.0023).',
    'In a field B the two spin states differ in energy by g μ_B B; microwaves can flip them.',
    'Spin explains fine structure, the two electrons per orbital, and ferromagnetism.'
  ],
  pitfalls: [
    'Spin means the electron rotates like a tiny ball — No consistent spinning-ball model exists; spin is an intrinsic property with no classical counterpart.',
    'The spin points exactly up or down — Only its component along the measured axis is ±ħ/2; the size of the spin is √3/2 ħ, so it always has components in other directions too.',
    'A uniform field would split the beam in Stern–Gerlach — A uniform field exerts only a torque. A gradient is needed to push the two orientations apart.'
  ],
  formulas: [
    {
      name: 'Energy between spin up and spin down',
      expr: 'dE = gs*muB*B', tex: '\\Delta E = g_s\\,\\mu_B B',
      vars: {
        dE: { name: 'energy difference', q: 'energy', unit: 'eV', tex: '\\Delta E' },
        gs: { name: 'electron g-factor', value: 2.0023, tex: 'g_s' },
        muB: { const: 'muB' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 }
      },
      stories: { dE: 'How far apart in energy are the two spin states of a free electron in a field of {B}?', B: 'In what field are an electron\'s spin states {dE} apart?' }
    },
    {
      name: 'Spin-resonance frequency',
      expr: 'f = gs*muB*B/h', tex: 'f = \\frac{g_s\\,\\mu_B B}{h}',
      vars: {
        f: { name: 'resonance frequency', q: 'frequency', unit: 'GHz' },
        gs: { name: 'electron g-factor', value: 2.0023, tex: 'g_s' },
        muB: { const: 'muB' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 0.34 },
        h: { const: 'h' }
      },
      stories: {
        f: 'An ESR spectrometer uses a field of {B}. At what microwave frequency do free electrons absorb?',
        B: 'An ESR spectrometer runs at {f}. What field is needed for free electrons to resonate?'
      }
    },
    {
      name: 'Stern–Gerlach deflection',
      expr: 'z = muB*G*L^2/(2*m*v^2)', tex: 'z = \\frac{\\mu_B G L^2}{2 m v^2}',
      vars: {
        z: { name: 'sideways deflection of each beam', q: 'length', unit: 'mm' },
        muB: { const: 'muB' },
        G: { name: 'field gradient', unit: 'T/m', value: 1000 },
        L: { name: 'length of the magnet', q: 'length', unit: 'cm', value: 3.5 },
        m: { name: 'mass of the atom', q: 'mass', unit: 'u', value: 107.87 },
        v: { name: 'speed of the atoms', q: 'speed', unit: 'm/s', value: 550 }
      },
      note: 'Force $\\mu_B G$ on an atom whose moment is one Bohr magneton, acting for the time $L/v$ spent inside the magnet. The default is silver.',
      stories: {
        z: 'Silver atoms (mass {m}) at {v} cross a magnet {L} long with a field gradient of {G}. How far is each half of the beam deflected?',
        G: 'What field gradient deflects atoms of mass {m} moving at {v} by {z} over a magnet {L} long?'
      }
    }
  ],
  examples: [
    {
      title: 'The original Stern–Gerlach experiment',
      q: 'Silver atoms (108 u) leave an oven at about 550 m/s and cross a 3.5 cm long magnet with a field gradient of 1000 T/m. How far apart are the two beams as they leave the magnet?',
      steps: [
        'Force on a moment of one Bohr magneton: $F = \\mu_B G = 9.27\\times10^{-24} \\times 1000 = 9.3\\times10^{-21}\\ \\mathrm{N}$.',
        'Acceleration: $a = F/m = 9.3\\times10^{-21}/(108 \\times 1.66\\times10^{-27}) = 5.2\\times10^4\\ \\mathrm{m/s^2}$ — some 5000 g.',
        'Time in the magnet: $t = L/v = 0.035/550 = 6.4\\times10^{-5}\\ \\mathrm{s}$, so each beam moves $z = \\tfrac12 a t^2 = 0.10\\ \\mathrm{mm}$ sideways.',
        'The beams separate by about 0.2 mm — what Stern and Gerlach saw on their glass plate.'
      ],
      a: 'About 0.1 mm each way, 0.2 mm apart.'
    },
    {
      title: 'Electron spin resonance',
      q: 'A laboratory ESR spectrometer works at 0.34 T. What microwave frequency flips the spin of a free electron?',
      steps: [
        '$\\Delta E = g\\mu_B B = 2.0023 \\times 9.274\\times10^{-24} \\times 0.34 = 6.31\\times10^{-24}\\ \\mathrm{J}$ ($3.9\\times10^{-5}$ eV).',
        '$f = \\Delta E/h = 6.31\\times10^{-24}/6.626\\times10^{-34} = 9.5\\times10^9\\ \\mathrm{Hz}$.',
        'That is 9.5 GHz, in the microwave X band — the standard ESR frequency.'
      ],
      a: 'About 9.5 GHz.'
    }
  ],
  quiz: [
    { q: 'In the Stern–Gerlach experiment, silver atoms crossing the non-uniform field make on the screen…', choices: ['a continuous smear', 'two separate spots', 'three spots', 'a single spot'], a: 1,
      why: 'The spin component along the field direction can only be +ħ/2 or −ħ/2, so the beam splits in two.' },
    { q: 'The component of an electron\'s spin along any axis you choose to measure is…', choices: ['any value between −ħ and +ħ', '+ħ/2 or −ħ/2', '0 or ±ħ', '√3/2 ħ'], a: 1,
      why: 'Whatever axis is chosen, exactly two results are possible.' },
    { q: 'Electron spin means that the electron is a tiny ball rotating on its axis.', a: false,
      why: 'Such a ball would have to rotate faster than light. Spin is an intrinsic property without a classical picture.' },
    { q: 'Why must the magnet in a Stern–Gerlach apparatus produce a strongly non-uniform field?', choices: ['A uniform field only twists a magnetic moment; a gradient is needed to push it sideways', 'To heat the atoms', 'To ionize the atoms', 'A uniform field would split the beam into more parts'], a: 0,
      why: 'The force on a magnetic moment is $\\mu_z\\,\\partial B/\\partial z$; without a gradient there is no net force.' }
  ],
  applications: [
    'Electron spin resonance (EPR) spectroscopy of radicals, catalysts and radiation damage.',
    'MRI, which works with the spins of hydrogen nuclei in the body.',
    'Hard-disk read heads based on giant magnetoresistance, a spin effect (Nobel Prize 2007).',
    'Spin qubits in quantum computers.'
  ],
  history: 'Stern and Gerlach did their experiment in Frankfurt in 1922 — without knowing about spin, which Uhlenbeck and Goudsmit proposed in 1925. Pauli had already written down a two-valued "hidden" quantum number for the electron earlier that year.'
},

{
  id: 'pauli-exclusion', parent: 'atomic-physics', title: 'Pauli exclusion and the periodic table', level: 2,
  short: 'No two electrons in an atom can share all four quantum numbers. Filling the states one electron at a time builds the periodic table.',
  keywords: ['Pauli exclusion principle', 'exclusion principle', 'periodic table', 'electron configuration', 'aufbau', 'shells', 'subshells', 'Hund\'s rule', 'valence electrons', 'noble gases', 'alkali metals', 'ionization energy', 'fermions', 'degeneracy pressure'],
  prereq: ['quantum-numbers', 'electron-spin', 'bohr-model'],
  related: ['fermi-energy', 'compact-stars', 'band-theory', 'lasers'],
  body: `
In 1925 Wolfgang Pauli stated the rule that gives atoms their structure: **no two electrons in an atom can have the same four quantum numbers** $n$, $\\ell$, $m_\\ell$, $m_s$. An orbital — a set of $n$, $\\ell$, $m_\\ell$ — can therefore hold at most two electrons, one spin up and one spin down. The rule applies to all identical particles with half-integer spin, the **fermions**: electrons, protons, neutrons. Particles with whole-number spin, **bosons** such as photons, can crowd into the same state in any number — which is what makes [[lasers]] possible.

### Building up the elements
Without the exclusion principle every electron of every atom would drop into the 1s orbital, and all elements would behave much alike. Instead, each extra electron must go into the lowest state still free:

- **Hydrogen** 1s¹, **helium** 1s² — the first shell is full.
- **Lithium** has to start the second shell, 2s¹. Its outer electron is far from the nucleus and shielded by the two 1s electrons, so it is easy to remove: lithium is a reactive metal.
- **Neon**, 1s² 2s² 2p⁶, fills the second shell; the next electron, in **sodium**, starts the third, and the pattern repeats.

In atoms with many electrons the inner electrons **screen** the nucleus. An s electron has more probability close to the nucleus than a p electron of the same shell, feels more of the nuclear charge, and lies lower; d and f lie higher still. The filling order that results is

$$1s,\\ 2s,\\ 2p,\\ 3s,\\ 3p,\\ 4s,\\ 3d,\\ 4p,\\ 5s,\\ 4d,\\ 5p,\\ 6s,\\ 4f,\\ 5d,\\ 6p,\\ 7s,\\ 5f,\\ 6d,\\ 7p$$

so 4s fills before 3d, which is why the transition metals appear in the fourth row. Within a subshell, electrons first occupy separate orbitals with parallel spins (**Hund's rule**), which is why iron, with four unpaired 3d electrons, is strongly magnetic.

### The periodic table explained
A subshell holds $2(2\\ell + 1)$ electrons: 2, 6, 10, 14 for s, p, d, f. The rows of the table have lengths 2, 8, 8, 18, 18, 32, 32 because each row fills an s subshell, then the d and f subshells left over from earlier shells, and finally a p subshell. Elements in one column have the same arrangement of outer electrons, and so similar chemistry.

| Element | Configuration | First ionization energy |
|---|---|---|
| Helium | 1s² | 24.6 eV |
| Lithium | [He] 2s¹ | 5.4 eV |
| Neon | [He] 2s² 2p⁶ | 21.6 eV |
| Sodium | [Ne] 3s¹ | 5.1 eV |
| Argon | [Ne] 3s² 3p⁶ | 15.8 eV |
| Potassium | [Ar] 4s¹ | 4.3 eV |

Closed shells (the noble gases) hold their electrons tightly and react with almost nothing; one electron beyond a closed shell (the alkali metals) is easily lost.

### Beyond chemistry
The exclusion principle is why matter takes up room: squeezing atoms together would force electrons into higher states, which costs energy. Electrons in a metal fill their states up to the [[fermi-energy|Fermi energy]], and the pattern of filled and empty bands decides whether a solid conducts ([[band-theory]]). In a white dwarf star the same "degeneracy pressure" of electrons holds up a Sun's worth of matter compressed to the size of the Earth ([[compact-stars]]).
`,
  ideas: [
    'No two electrons in an atom share all four quantum numbers; each orbital holds at most two, with opposite spins.',
    'Electrons fill the lowest free states first; screening makes s lie below p below d in the same shell.',
    'The filling order (1s 2s 2p 3s 3p 4s 3d …) produces rows of 2, 8, 8, 18, 18, 32, 32 elements.',
    'Elements with the same outer configuration have similar chemistry.',
    'The principle applies to all fermions and underlies the rigidity of matter and the stability of white dwarfs.'
  ],
  pitfalls: [
    'Shells always fill in order of n — Not in heavier atoms: 4s fills before 3d, and 6s before 4f and 5d.',
    'The exclusion principle is a force that pushes electrons apart — It is not a force but a rule about which states identical fermions may occupy; its effects, like degeneracy pressure, can nevertheless be enormous.',
    'All particles obey it — Only fermions. Photons and helium-4 atoms are bosons and happily share states.'
  ],
  formulas: [
    {
      name: 'Capacity of a subshell',
      expr: 'N = 2*(2*l + 1)', tex: 'N = 2(2\\ell + 1)',
      vars: {
        N: { name: 'maximum number of electrons', int: true },
        l: { name: 'orbital quantum number', value: 2, int: true, tex: '\\ell' }
      },
      stories: { N: 'How many electrons can a subshell with ℓ = {l} hold?', l: 'Which kind of subshell (value of ℓ) holds {N} electrons?' }
    },
    {
      name: 'Ionization energy with an effective nuclear charge',
      expr: 'E = Ry*Zeff^2/n^2', tex: 'E_{\\mathrm{ion}} \\approx \\frac{E_{\\mathrm{Ry}}\\,Z_{\\mathrm{eff}}^2}{n^2}',
      vars: {
        E: { name: 'ionization energy', q: 'energy', unit: 'eV', tex: 'E_{\\mathrm{ion}}' },
        Ry: { const: 'Ry', tex: 'E_{\\mathrm{Ry}}' },
        Zeff: { name: 'effective nuclear charge seen by the electron', value: 1.84, tex: 'Z_{\\mathrm{eff}}' },
        n: { name: 'shell of the outer electron', value: 3, int: true }
      },
      note: 'A Bohr-model estimate that lumps the screening by inner electrons into $Z_\\mathrm{eff}$. The default fits sodium (5.14 eV).',
      stories: {
        Zeff: 'The outer electron of an atom is in shell n = {n} and its ionization energy is {E}. What effective nuclear charge does it feel?',
        E: 'Estimate the ionization energy of an electron in shell n = {n} that feels an effective nuclear charge of {Zeff}.'
      }
    }
  ],
  examples: [
    {
      title: 'The configuration of iron',
      q: 'Write the electron configuration of iron (Z = 26) and find how many unpaired electrons it has.',
      steps: [
        'Fill in order: 1s² 2s² 2p⁶ 3s² 3p⁶ (18 electrons, the argon core), then 4s² (20), then 3d.',
        'Six electrons remain for 3d: $26 - 20 = 6$. Configuration: [Ar] 4s² 3d⁶.',
        'The five 3d orbitals take one electron each with parallel spins (Hund\'s rule); the sixth pairs up in one of them.',
        'That leaves four unpaired 3d electrons, whose aligned spins make iron strongly magnetic.'
      ],
      a: '[Ar] 4s² 3d⁶, with 4 unpaired electrons.'
    },
    {
      title: 'How strongly is sodium\'s outer electron held?',
      q: 'Sodium\'s 3s electron needs 5.14 eV to remove. What effective nuclear charge does it feel?',
      steps: [
        'Use $E = 13.6\\ \\mathrm{eV}\\,Z_\\mathrm{eff}^2/n^2$ with $n = 3$.',
        '$Z_\\mathrm{eff} = 3\\sqrt{5.14/13.6} = 1.84$.',
        'Far less than the nuclear charge of 11 — the ten inner electrons screen most of it — but more than 1, because the 3s electron spends some time inside the inner shells.'
      ],
      a: 'Z_eff ≈ 1.8.'
    }
  ],
  quiz: [
    { q: 'How many electrons can the 3d subshell hold?', choices: ['2', '6', '10', '18'], a: 2,
      why: 'ℓ = 2 gives 5 orbitals, each holding two electrons: 10.' },
    { q: 'Why does potassium put its 19th electron in 4s rather than 3d?', choices: ['4s is closer to the nucleus on average', 'The 4s orbital penetrates the inner shells, feels more nuclear charge and ends up lower in energy', 'Pauli\'s principle forbids 3d', '3d is already full'], a: 1,
      why: 'Screening lifts 3d above 4s in potassium. Penetration, not average distance, decides the order.' },
    { q: 'Without the exclusion principle, the ground state of every atom would have…', choices: ['all its electrons in 1s', 'no electrons at all', 'electrons spread evenly over all shells', 'the same chemistry as now'], a: 0,
      why: 'The lowest state would take every electron, and the periodic table\'s variety would vanish.' },
    { q: 'Photons obey the Pauli exclusion principle.', a: false,
      why: 'Photons are bosons (spin 1). Many photons in the same state is exactly what a laser beam is.' },
    { q: 'Which element has chemistry most like sodium (Z = 11)?', choices: ['magnesium (12)', 'neon (10)', 'potassium (19)', 'chlorine (17)'], a: 2,
      why: 'Potassium, [Ar] 4s¹, has one electron outside a closed shell, just like sodium, [Ne] 3s¹.' }
  ],
  applications: [
    'Predicting chemical behaviour, valence and bonding from electron configurations.',
    'Magnetic materials: unpaired d and f electrons in iron, cobalt, nickel and rare-earth magnets.',
    'Semiconductor physics: electrons filling energy bands up to the Fermi level.',
    'White dwarfs and neutron stars, held up by degeneracy pressure.'
  ],
  history: 'Mendeleev arranged the elements by their chemistry in 1869, long before anyone knew why it worked. Pauli\'s principle (1925) and the quantum numbers explained the pattern; Pauli received the Nobel Prize in 1945.'
},

{
  id: 'x-rays', parent: 'atomic-physics', title: 'X-rays', level: 2,
  short: 'Fast electrons slamming into metal produce X-rays: a continuous spectrum with a sharp short-wavelength cut-off, plus lines that fingerprint the target element.',
  keywords: ['X-rays', 'Röntgen', 'X-ray tube', 'bremsstrahlung', 'characteristic X-rays', 'K alpha', 'Duane–Hunt law', 'cut-off wavelength', 'Moseley\'s law', 'Bragg\'s law', 'X-ray diffraction', 'crystallography', 'radiography', 'CT scan'],
  prereq: ['photon', 'bohr-model', 'em-spectrum'],
  related: ['compton-scattering', 'radiation-dose', 'crystal-structure', 'diffraction-grating'],
  body: `
In November 1895 Wilhelm Röntgen noticed a fluorescent screen glowing across his laboratory while a cathode-ray tube, wrapped in black card, was running. The invisible rays passed through paper, wood and flesh but were stopped by bone and metal; within weeks he had photographed the bones of his wife's hand. He called them X-rays because he did not know what they were. They turned out to be electromagnetic waves with wavelengths around 0.01–10 nm, and photons of roughly 100 eV to 100 keV ([[photon]]).

### The X-ray tube
Electrons from a hot filament are accelerated through a voltage $V$ — typically 20 to 150 kV — and hit a metal target such as tungsten, copper or molybdenum. About 1 % of their energy comes out as X-rays; the rest heats the target, which is why medical tubes use a spinning anode. The spectrum has two parts.

**Bremsstrahlung** ("braking radiation"). An electron swerving past a nucleus decelerates and radiates. It may lose any fraction of its energy in one go, giving a continuous spectrum. But no photon can carry more than the electron's whole kinetic energy $eV$, so there is a sharp **cut-off** at

$$\\lambda_{\\min} = \\frac{hc}{eV} \\approx \\frac{1.24\\ \\mathrm{nm}}{V/\\mathrm{kV}}$$

— the Duane–Hunt law. It does not depend on the target at all; it is the [[photoelectric-effect]] run backwards.

**Characteristic lines.** An incoming electron can knock out one of the target atom's innermost (K shell, $n = 1$) electrons. An electron from the L shell ($n = 2$) drops into the hole and emits a **Kα** photon; one from the M shell gives **Kβ**. These sharp lines sit on top of the continuum at energies fixed by the element.

### Moseley's law
In 1913 Henry Moseley measured the Kα lines of dozens of elements and found that the square root of the frequency grows in a straight line with the atomic number. The [[bohr-model|Bohr model]] explains it: an L electron falling into the K shell sees the nuclear charge $Z$ screened by the one remaining K electron, so

$$E_{K\\alpha} \\approx 13.6\\ \\mathrm{eV}\\,(Z - 1)^2 \\left(1 - \\frac{1}{4}\\right) = 10.2\\ \\mathrm{eV}\\,(Z-1)^2$$

For copper ($Z = 29$) this gives 8.0 keV, close to the measured 8.05 keV. Moseley showed that atomic number, not atomic mass, orders the periodic table, and found gaps at $Z = 43$, 61, 72 and 75 for elements not yet discovered. He was killed at Gallipoli in 1915, aged 27.

### Seeing inside
X-rays are absorbed mainly by the photoelectric effect at medical energies, and that absorption rises steeply with atomic number — roughly as $Z^3$ to $Z^4$. Bone, rich in calcium ($Z = 20$), stops far more than soft tissue made of hydrogen, carbon and oxygen; lead ($Z = 82$) makes a good shield. CT scanners combine thousands of X-ray images taken from different angles into cross-sections of the body. The price is a [[radiation-dose]], because X-ray photons carry enough energy to ionize atoms.

### Diffraction by crystals
X-ray wavelengths are comparable with the spacing of atoms, so crystals diffract them. Rays reflected from successive planes of atoms, a distance $d$ apart, reinforce when

$$2d\\sin\\theta = n\\lambda$$

(**Bragg's law**, with $\\theta$ measured from the planes). Measuring the angles reveals the arrangement of atoms: X-ray crystallography solved the structures of salt, of DNA and of thousands of proteins ([[crystal-structure]]).
`,
  ideas: [
    'X-rays are photons of roughly 0.1–100 keV, made when fast electrons hit a target.',
    'Bremsstrahlung gives a continuous spectrum with a cut-off λ_min = hc/eV set by the tube voltage alone.',
    'Characteristic lines appear when inner-shell vacancies are filled; they identify the element.',
    'Moseley\'s law: E_Kα ≈ 10.2 eV (Z − 1)², which ordered the periodic table by atomic number.',
    'Crystals diffract X-rays according to Bragg\'s law 2d sin θ = nλ.'
  ],
  pitfalls: [
    'A higher tube current gives more penetrating X-rays — The current sets how many photons there are; the voltage sets how energetic they can be.',
    'The cut-off wavelength depends on the target — It depends only on the voltage. The characteristic lines depend on the target.',
    'Bragg\'s angle θ is measured from the normal, as in optics — In Bragg\'s law it is the angle between the ray and the atomic planes; the ray is deflected by 2θ in total.'
  ],
  formulas: [
    {
      name: 'Cut-off wavelength (Duane–Hunt law)',
      expr: 'lmin = h*c/(qe*V)', tex: '\\lambda_{\\min} = \\frac{hc}{eV}',
      vars: {
        lmin: { name: 'shortest wavelength emitted', q: 'length', unit: 'pm', tex: '\\lambda_{\\min}' },
        h: { const: 'h' }, c: { const: 'c' }, qe: { const: 'qe' },
        V: { name: 'tube voltage', q: 'voltage', unit: 'kV', value: 30 }
      },
      stories: {
        lmin: 'An X-ray tube runs at {V}. What is the shortest wavelength in its spectrum?',
        V: 'The X-ray spectrum of a tube stops at {lmin}. What voltage is the tube running at?'
      }
    },
    {
      name: 'Moseley\'s law for Kα lines',
      expr: 'E = 0.75*Ry*(Z - 1)^2', tex: 'E_{K\\alpha} = \\tfrac34\\,E_{\\mathrm{Ry}}\\,(Z - 1)^2',
      vars: {
        E: { name: 'Kα photon energy', q: 'energy', unit: 'keV', tex: 'E_{K\\alpha}' },
        Ry: { const: 'Ry', tex: 'E_{\\mathrm{Ry}}' },
        Z: { name: 'atomic number of the target', value: 29, int: true }
      },
      note: 'Accurate to a few per cent for mid-range elements.',
      stories: {
        E: 'Estimate the energy of the Kα X-rays from an element with atomic number {Z}.',
        Z: 'A sample emits Kα X-rays of {E}. What is the atomic number of the element?'
      }
    },
    {
      name: 'Bragg\'s law',
      expr: '2*d*sin(theta) = n*lambda', tex: '2d\\sin\\theta = n\\lambda', solveFor: 'theta',
      vars: {
        d: { name: 'spacing of the atomic planes', q: 'length', unit: 'nm', value: 0.282 },
        theta: { name: 'glancing angle to the planes', q: 'angle', unit: '°', min: 0, max: 90 },
        n: { name: 'order of reflection', value: 1, int: true },
        lambda: { name: 'X-ray wavelength', q: 'length', unit: 'pm', value: 154.1 }
      },
      note: 'Defaults: copper Kα X-rays on rock salt.',
      practice: { unknowns: ['theta', 'd', 'lambda'] },
      stories: {
        theta: 'X-rays of wavelength {lambda} fall on a crystal whose planes are {d} apart. At what glancing angle is the order-{n} reflection?',
        d: 'X-rays of wavelength {lambda} are strongly reflected (order {n}) at a glancing angle of {theta}. How far apart are the atomic planes?'
      }
    }
  ],
  examples: [
    {
      title: 'A dental X-ray unit',
      q: 'A dental X-ray tube runs at 70 kV. What are the largest photon energy and the shortest wavelength it produces?',
      steps: [
        'The most energetic photon takes an electron\'s whole kinetic energy: $E_{\\max} = eV = 70\\ \\mathrm{keV}$.',
        '$\\lambda_{\\min} = \\dfrac{hc}{eV} = \\dfrac{1240\\ \\mathrm{eV\\,nm}}{70\\,000\\ \\mathrm{eV}} = 0.0177\\ \\mathrm{nm} = 17.7\\ \\mathrm{pm}$.'
      ],
      a: '70 keV and 17.7 pm.'
    },
    {
      title: 'What metal is it?',
      q: 'An unknown metal emits Kα X-rays of 6.40 keV when bombarded with electrons. Identify it.',
      steps: [
        'Moseley: $(Z - 1)^2 = \\dfrac{E}{0.75 \\times 13.6\\ \\mathrm{eV}} = \\dfrac{6400}{10.2} = 627$.',
        '$Z - 1 = 25.0$, so $Z = 26$.',
        'Element 26 is iron — the same 6.40 keV line astronomers see from hot gas around black holes.'
      ],
      a: 'Iron (Z = 26).'
    },
    {
      title: 'Diffraction from rock salt',
      q: 'Copper Kα X-rays (0.154 nm) fall on a NaCl crystal whose planes are 0.282 nm apart. At what glancing angle is the first-order reflection?',
      steps: [
        '$\\sin\\theta = \\dfrac{n\\lambda}{2d} = \\dfrac{0.154}{2 \\times 0.282} = 0.273$.',
        '$\\theta = 15.8°$; the beam is turned through $2\\theta = 31.7°$.'
      ],
      a: '15.8°'
    }
  ],
  quiz: [
    { q: 'The voltage of an X-ray tube is doubled. The shortest wavelength emitted…', choices: ['doubles', 'halves', 'stays the same', 'is quartered'], a: 1,
      why: '$\\lambda_{\\min} = hc/eV$: twice the voltage gives electrons, and so the most energetic photons, twice the energy.' },
    { q: 'The positions of the sharp lines in an X-ray spectrum depend on…', choices: ['the tube voltage only', 'the element of the target', 'the tube current', 'the temperature of the filament'], a: 1,
      why: 'Characteristic lines come from inner-shell energy levels of the target atoms (the voltage only has to be high enough to excite them).' },
    { q: 'Why do bones show up clearly in an X-ray image?', choices: ['Calcium, with its higher atomic number, absorbs X-rays far more strongly than the light elements of soft tissue', 'Bones emit X-rays', 'Bones reflect X-rays', 'Bones are colder'], a: 0,
      why: 'Photoelectric absorption grows roughly as $Z^3$–$Z^4$, and bone contains calcium (Z = 20) and phosphorus (Z = 15).' },
    { q: 'Turning up the tube current makes the X-rays more penetrating.', a: false,
      why: 'More current means more photons of the same energies. Penetration depends on photon energy, which the voltage controls.' },
    { q: 'Moseley\'s law contains (Z − 1) rather than Z because…', choices: ['the electron left in the K shell screens one unit of nuclear charge', 'the nucleus loses a proton', 'of the neutrons in the nucleus', 'of relativity'], a: 0,
      why: 'The electron falling into the K-shell hole sees the nucleus partly shielded by the other K electron.' }
  ],
  applications: [
    'Medical and dental radiography, CT scanning and radiotherapy.',
    'Airport baggage and cargo scanners.',
    'X-ray crystallography of minerals, drugs and proteins.',
    'X-ray fluorescence analysis, which identifies elements in paintings, alloys and soil from their characteristic lines.',
    'X-ray astronomy of million-degree gas around black holes and in galaxy clusters.'
  ],
  history: 'Röntgen discovered X-rays in 1895 and received the first Nobel Prize in Physics (1901). Max von Laue showed in 1912 that crystals diffract them; William Henry and William Lawrence Bragg turned diffraction into a tool for finding crystal structures the following year.'
},

{
  id: 'lasers', parent: 'atomic-physics', title: 'Lasers', level: 2,
  short: 'A laser amplifies light by stimulated emission: an excited atom, nudged by a photon, emits an identical twin. The result is intense, single-colour, parallel, coherent light.',
  keywords: ['laser', 'stimulated emission', 'spontaneous emission', 'population inversion', 'optical cavity', 'coherence', 'monochromatic', 'He-Ne laser', 'ruby laser', 'Nd:YAG', 'diode laser', 'metastable state', 'Einstein coefficients', 'maser'],
  prereq: ['photon', 'hydrogen-spectrum', 'standing-waves'],
  related: ['maxwell-boltzmann', 'pn-junction', 'semiconductors', 'pauli-exclusion'],
  body: `
An atom with two energy levels, separated by $\\Delta E$, can interact with light of frequency $f = \\Delta E/h$ in three ways, as Einstein showed in 1917:

1. **Absorption**: a photon is absorbed and the atom jumps up.
2. **Spontaneous emission**: an excited atom drops down on its own after a typical time — nanoseconds for most visible transitions — emitting a photon in a random direction.
3. **Stimulated emission**: a passing photon of the right frequency triggers an excited atom to drop down and emit a *second photon identical to the first* — same frequency, same direction, same phase, same polarization.

Stimulated emission is the heart of the laser (light amplification by stimulated emission of radiation). One photon becomes two, two become four, and a cascade of identical photons builds up.

### The catch: population inversion
Absorption and stimulated emission are equally likely per atom. So light is amplified only if more atoms are in the upper level than the lower — a **population inversion**. In thermal equilibrium the populations follow the Boltzmann factor

$$\\frac{N_2}{N_1} = e^{-\\Delta E/k_B T}$$

For a visible transition of 2 eV at room temperature ($k_BT = 0.026$ eV) that ratio is about $10^{-33}$: essentially every atom is in the lower state, and light is absorbed, not amplified. Heating does not help — even at 6000 K the ratio is only 0.02 ([[maxwell-boltzmann]]).

Pumping with light does not work for just two levels either: the pump light stimulates emission as readily as it causes absorption, so at best the populations become equal. Real lasers use three or four levels:

- **Three-level** (the ruby laser, 1960, 694 nm): atoms are pumped to a broad upper band, drop within nanoseconds to a **metastable** level that lives about 3 ms, and lase from there down to the ground state. More than half the atoms must be pumped, which takes a powerful flash lamp.
- **Four-level** (helium–neon at 632.8 nm, Nd:YAG at 1064 nm): the lower laser level is itself above the ground state and empties quickly, so even a few excited atoms make an inversion.

### The optical cavity
The gain medium sits between two mirrors, one of them letting through about 1 % of the light. Photons travelling along the axis bounce back and forth, stimulating more emission on each pass; everything else leaks away. The light forms [[standing-waves]] between the mirrors, so only frequencies with a whole number of half-wavelengths in the cavity length $L$ survive. These **longitudinal modes** are spaced by

$$\\Delta f = \\frac{c}{2L}$$

— 500 MHz for a 30 cm cavity. A single-mode laser picks just one.

### What makes laser light special
- **Monochromatic**: a stabilized laser can have a linewidth below 1 Hz on a frequency of $5 \\times 10^{14}$ Hz.
- **Coherent**: the wave keeps step with itself over metres or kilometres, so laser light makes clean interference patterns.
- **Directional**: the beam spreads only by diffraction, at an angle of about $\\lambda/\\pi w_0$ for a beam of radius $w_0$ — well under a milliradian for a laser pointer.
- **Intense**: all the power in one narrow beam and one colour; focused pulsed lasers reach intensities above $10^{20}$ W/cm².

Most lasers made today are **semiconductor diode lasers**, where the inversion is created by an electric current in a [[pn-junction]]: in every fibre-optic link, barcode scanner and laser pointer.
`,
  ideas: [
    'Stimulated emission creates a photon identical to the one that triggered it.',
    'Amplification needs a population inversion, which thermal equilibrium never provides.',
    'Three- and four-level schemes with a long-lived (metastable) upper level make inversion possible.',
    'Mirrors form a cavity whose standing-wave modes are spaced by c/2L.',
    'Laser light is monochromatic, coherent, directional and intense.'
  ],
  pitfalls: [
    'A laser works by heating atoms until most are excited — Heating can never make the upper level more populated than the lower; an inversion needs a non-thermal pump.',
    'Laser light is powerful — Many lasers emit milliwatts. What stands out is that the power is concentrated in one direction, one colour and one phase.',
    'Stimulated emission destroys the incoming photon — The incoming photon continues on; a second, identical photon joins it.'
  ],
  formulas: [
    {
      name: 'Thermal population ratio (Boltzmann)',
      expr: 'r = exp(-dE/(kB*T))', tex: 'r = \\frac{N_2}{N_1} = e^{-\\Delta E/k_BT}',
      vars: {
        r: { name: 'ratio of upper to lower population', tex: 'r' },
        dE: { name: 'energy gap', q: 'energy', unit: 'eV', value: 1.96, tex: '\\Delta E' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'In thermal equilibrium the ratio is always below 1, so no inversion. The default gap is the helium–neon laser transition.',
      stories: {
        r: 'In a gas at {T}, what fraction of atoms is in an upper level {dE} above the lower one, relative to the lower level?',
        T: 'At what temperature would a level {dE} up hold a fraction {r} of the population of the lower level?'
      }
    },
    {
      name: 'Spacing of the cavity modes',
      expr: 'df = c/(2*L)', tex: '\\Delta f = \\frac{c}{2L}',
      vars: {
        df: { name: 'frequency spacing of the longitudinal modes', q: 'frequency', unit: 'MHz', tex: '\\Delta f' },
        c: { const: 'c' },
        L: { name: 'cavity length', q: 'length', unit: 'cm', value: 30 }
      },
      stories: {
        df: 'A laser cavity is {L} long. How far apart in frequency are its longitudinal modes?',
        L: 'A laser\'s modes are {df} apart. How long is its cavity?'
      }
    },
    {
      name: 'Beam divergence',
      expr: 'theta = lambda/(pi*w0)', tex: '\\theta = \\frac{\\lambda}{\\pi w_0}',
      vars: {
        theta: { name: 'half-angle of spread', q: 'angle', unit: 'mrad' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8 },
        w0: { name: 'beam radius at its narrowest', q: 'length', unit: 'mm', value: 0.5 }
      },
      note: 'For an ideal (Gaussian) beam far from its waist. Widening the beam reduces the spread.',
      stories: {
        theta: 'A laser beam of wavelength {lambda} has a radius of {w0} at its narrowest point. At what angle does it spread?',
        w0: 'How wide must a beam of wavelength {lambda} be at its waist to spread by only {theta}?'
      }
    }
  ],
  examples: [
    {
      title: 'Why hot gas does not lase',
      q: 'The helium–neon laser line at 632.8 nm corresponds to a gap of 1.96 eV. Find the thermal population ratio of the two levels at 300 K and at 6000 K.',
      steps: [
        'At 300 K, $k_BT = 0.0259$ eV, so $\\Delta E/k_BT = 75.8$ and $N_2/N_1 = e^{-75.8} \\approx 10^{-33}$.',
        'At 6000 K, $k_BT = 0.517$ eV, so $N_2/N_1 = e^{-3.79} = 0.023$.',
        'Even at the temperature of the Sun\'s surface the upper level holds only 2 % as many atoms as the lower. Lasers need a pump that drives the atoms out of equilibrium.'
      ],
      a: 'About 10⁻³³ at 300 K and 0.02 at 6000 K — never an inversion.'
    },
    {
      title: 'Modes of a helium–neon laser',
      q: 'A He–Ne laser has a 30 cm cavity. Its gain extends over about 1.5 GHz. How many longitudinal modes can lase?',
      steps: [
        'Mode spacing: $\\Delta f = c/2L = 3.00\\times10^8/(2 \\times 0.30) = 5.0\\times10^8\\ \\mathrm{Hz} = 500\\ \\mathrm{MHz}$.',
        'Modes fitting under the gain curve: $1.5\\ \\mathrm{GHz}/500\\ \\mathrm{MHz} = 3$.',
        'So the laser typically runs on two or three frequencies at once. Shortening the cavity to 10 cm would leave room for just one.'
      ],
      a: 'Modes 500 MHz apart; about three fit.'
    }
  ],
  quiz: [
    { q: 'In stimulated emission, the emitted photon…', choices: ['goes off in a random direction', 'matches the stimulating photon in frequency, direction and phase', 'has twice the energy of the stimulating photon', 'is immediately absorbed again'], a: 1,
      why: 'That copying is what makes laser light coherent and directional.' },
    { q: 'Why can a two-level system not be made to lase by shining pump light on it?', choices: ['The pump light stimulates emission as often as absorption, so at best the populations become equal', 'The upper level lives too long', 'Photons cannot be absorbed by such atoms', 'It can, easily'], a: 0,
      why: 'Absorption and stimulated emission have equal probabilities per atom, so a two-level system saturates at $N_2 = N_1$.' },
    { q: 'A laser cavity is made twice as long. The frequency spacing of its modes…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 1,
      why: '$\\Delta f = c/2L$.' },
    { q: 'Expanding a laser beam to a larger diameter reduces how fast it spreads.', a: true,
      why: 'The diffraction spread is about $\\lambda/\\pi w_0$. Beam expanders and telescopes are used to send lasers to the Moon.' },
    { q: 'Population inversion means…', choices: ['more atoms in the upper laser level than in the lower one', 'all atoms in the ground state', 'the atoms are upside down', 'the gas is at a very high temperature'], a: 0,
      why: 'Only then does stimulated emission outnumber absorption, so light is amplified.' }
  ],
  applications: [
    'Fibre-optic communication at 1.3 and 1.55 µm, carrying most of the world\'s data.',
    'Barcode scanners, optical discs and laser printers.',
    'Surgery and eye correction; cutting, welding and 3-D printing of metals.',
    'Lidar for self-driving cars and mapping; laser ranging to the Moon.',
    'Atomic clocks, gravitational-wave detectors and laser cooling of atoms.'
  ],
  history: 'Einstein introduced stimulated emission in 1917. Charles Townes built a microwave amplifier, the maser, in 1954; Theodore Maiman made the first laser, from a ruby crystal, in 1960, and the helium–neon laser followed later that year. Semiconductor lasers appeared in 1962.'
}

);
