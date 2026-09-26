/* HYPER-PHYSICS · content/the-nucleus.js — what a nucleus is made of, how big it is,
 * what holds it together and how much energy that binding is worth. */
Hyper.add(

{
  id: 'nuclear-structure', parent: 'the-nucleus', title: 'Nuclear structure and isotopes', level: 1,
  short: 'Every nucleus is a tight cluster of protons and neutrons. The number of protons fixes the element; the number of neutrons picks the isotope.',
  keywords: ['nucleus', 'proton', 'neutron', 'nucleon', 'atomic number', 'mass number', 'isotope', 'isobar', 'nuclide', 'atomic mass unit', 'Rutherford', 'neutron number'],
  prereq: ['electric-charge', 'bohr-model'],
  related: ['nuclear-size', 'radioactive-decay', 'quarks', 'charged-particle-motion'],
  body: `
In 1911 Ernest Rutherford's students fired alpha particles at a thin gold foil. Almost all of them went straight through, but about one in several thousand bounced back as if it had hit something small, heavy and positively charged. That was the **nucleus**: it holds more than 99.9 % of an atom's mass in about a hundred-thousandth of its width.

### What it is made of
A nucleus contains two kinds of **nucleons**:

- **protons**, charge $+e$, mass $1.00728\\ \\mathrm{u}$;
- **neutrons**, no charge, mass $1.00866\\ \\mathrm{u}$ (discovered by James Chadwick in 1932).

Three whole numbers describe it: the **atomic number** $Z$ (protons), the **neutron number** $N$ and the **mass number** $A = Z + N$. A particular nucleus, a **nuclide**, is written

$$ {}^{A}_{Z}\\mathrm{X}, \\qquad \\text{for example } {}^{56}_{26}\\mathrm{Fe} \\text{ with } 26 \\text{ protons and } 30 \\text{ neutrons.}$$

The symbol already fixes $Z$ (iron is always 26), so people often write just Fe-56.

### Isotopes
$Z$ decides the element, because the protons set how many electrons the neutral atom holds and so its chemistry. Nuclei with the same $Z$ but different $N$ are **isotopes** of one element: hydrogen-1, deuterium ($ {}^{2}\\mathrm{H}$) and tritium ($ {}^{3}\\mathrm{H}$); carbon-12, carbon-13 and carbon-14; uranium-235 and uranium-238. Isotopes behave almost identically in chemical reactions, which is why separating them — enriching uranium, making heavy water — takes giant centrifuge halls or distillation columns that exploit the tiny mass difference. Nuclei with the same $A$ but different $Z$ (such as $ {}^{14}\\mathrm{C}$ and $ {}^{14}\\mathrm{N}$) are **isobars**.

Most elements are natural mixtures. Chlorine is about 76 % Cl-35 and 24 % Cl-37, which is why the periodic table gives it the odd mass 35.45: an average weighted by abundance.

### Masses and the atomic mass unit
Nuclear masses are quoted in **unified atomic mass units**, defined so that one neutral carbon-12 atom is exactly $12\\ \\mathrm{u}$: $1\\ \\mathrm{u} = 1.66054 \\times 10^{-27}\\ \\mathrm{kg}$, whose energy equivalent is $931.494\\ \\mathrm{MeV}$. Tables usually list **atomic** masses, electrons included; the electrons cancel in most calculations if you use atomic masses on both sides.

### Which nuclei exist
About 250 stable nuclides and more than 3000 radioactive ones are known. On a chart of $N$ against $Z$ the stable ones hug a narrow **valley of stability**: light nuclei have $N \\approx Z$ (carbon-12, oxygen-16), while heavy ones need extra neutrons to dilute the electric repulsion of their protons — lead-208 has $N/Z = 126/82 \\approx 1.54$. Nuclei off the valley decay towards it: see [[radioactive-decay]]. Why the neutrons help, and why too many of them do not, is the story of the [[strong-force|strong force]].

> [!key] Protons choose the element, neutrons choose the isotope, and the two together choose whether the nucleus is stable.
`,
  ideas: [
    'A nucleus is made of Z protons and N neutrons; the mass number is A = Z + N.',
    'The atomic number Z fixes the element and its chemistry.',
    'Isotopes share Z but differ in N, so they differ in mass and nuclear stability, not in chemistry.',
    'Light stable nuclei have N ≈ Z; heavy ones need more neutrons than protons.',
    'Nuclear masses are measured in atomic mass units: 1 u = 1.66054 × 10⁻²⁷ kg ≈ 931.5 MeV/c².'
  ],
  pitfalls: [
    'The mass number is the mass in atomic mass units — Close, but not equal: iron-56 has a mass of 55.935 u, not 56 u. The difference is the binding energy, and it matters in every nuclear calculation.',
    'Isotopes are different elements — They are the same element with the same chemistry; only the number of neutrons, and so the mass and stability, differs.',
    'Neutrons are just protons without charge — They are distinct particles, slightly heavier than protons, and a free neutron decays into a proton with a half-life of about 10 minutes.'
  ],
  formulas: [
    {
      name: 'Mass number',
      expr: 'A = Z + N',
      vars: {
        A: { name: 'mass number (nucleons)', q: 'count', int: true },
        Z: { name: 'atomic number (protons)', q: 'count', value: 26, int: true },
        N: { name: 'neutron number', q: 'count', value: 30, int: true }
      },
      stories: {
        A: 'A nucleus holds {Z} protons and {N} neutrons. What is its mass number?',
        N: 'A uranium nucleus (Z = {Z}) has mass number {A}. How many neutrons does it have?'
      }
    },
    {
      name: 'Average atomic mass of a two-isotope element',
      expr: 'M = f*m1 + (1 - f)*m2', tex: 'M = f\\,m_1 + (1 - f)\\,m_2', solveFor: 'M',
      vars: {
        M: { name: 'average atomic mass', q: 'mass', unit: 'u' },
        f: { name: 'abundance of isotope 1', q: 'ratio', unit: '%', value: 75.76, min: 0, max: 100 },
        m1: { name: 'mass of isotope 1', q: 'mass', unit: 'u', value: 34.96885 },
        m2: { name: 'mass of isotope 2', q: 'mass', unit: 'u', value: 36.96590 }
      },
      note: 'The defaults are chlorine: Cl-35 and Cl-37. The average is what a chemist weighs out per atom.',
      practice: { unknowns: ['M', 'f'] },
      stories: {
        M: 'An element is {f} isotope 1 (mass {m1}) and the rest isotope 2 (mass {m2}). What is its average atomic mass?',
        f: 'Natural chlorine averages {M} per atom, from isotopes of {m1} and {m2}. What fraction is the lighter isotope?'
      }
    }
  ],
  examples: [
    {
      title: 'Counting nucleons in uranium',
      q: 'Natural uranium is mostly $ {}^{238}_{92}\\mathrm{U}$ with 0.72 % $ {}^{235}_{92}\\mathrm{U}$. How many protons, neutrons and (in the neutral atom) electrons does each have?',
      steps: [
        'Both are uranium, so both have $Z = 92$ protons and, when neutral, 92 electrons.',
        'Uranium-238: $N = A - Z = 238 - 92 = 146$ neutrons.',
        'Uranium-235: $N = 235 - 92 = 143$ neutrons — three fewer.',
        'That small difference changes everything in a reactor: U-235 splits after capturing a slow neutron, U-238 almost never does (see [[fission]]).'
      ],
      a: 'Both: 92 protons and 92 electrons; U-238 has 146 neutrons, U-235 has 143.'
    },
    {
      title: 'Why chlorine weighs 35.45',
      q: 'Chlorine-35 (34.969 u) makes up 75.76 % of natural chlorine and chlorine-37 (36.966 u) the rest. Find the average atomic mass.',
      steps: [
        'Weight each mass by its abundance: $M = 0.7576 \\times 34.969 + 0.2424 \\times 36.966$.',
        '$= 26.492 + 8.961 = 35.453\\ \\mathrm{u}$.',
        'No single chlorine atom has this mass; it is the average over the natural mixture.'
      ],
      a: '35.45 u'
    }
  ],
  quiz: [
    { q: 'Carbon-12 and carbon-14 differ in…', choices: ['the number of protons', 'the number of neutrons', 'the number of electrons in the neutral atom', 'their chemical behaviour'], a: 1,
      why: 'Both are carbon, so both have 6 protons and 6 electrons. Carbon-14 has 8 neutrons instead of 6; chemically they behave the same way.' },
    { q: 'Which pair are isotopes of each other?', choices: ['$ {}^{14}_{6}\\mathrm{C}$ and $ {}^{14}_{7}\\mathrm{N}$', '$ {}^{40}_{19}\\mathrm{K}$ and $ {}^{40}_{20}\\mathrm{Ca}$', '$ {}^{235}_{92}\\mathrm{U}$ and $ {}^{238}_{92}\\mathrm{U}$', '$ {}^{3}_{1}\\mathrm{H}$ and $ {}^{3}_{2}\\mathrm{He}$'], a: 2,
      why: 'Isotopes share the atomic number. The other pairs share the mass number $A$ instead: they are isobars.' },
    { q: 'Lead-208 has 82 protons. Compared with its protons, its neutrons are…', choices: ['equal in number', 'fewer', 'about 1.5 times as many', 'about twice as many'], a: 2,
      why: '$N = 208 - 82 = 126$ and $126/82 \\approx 1.54$. Heavy stable nuclei need extra neutrons to offset the electric repulsion of so many protons.' },
    { q: 'A nucleus of iron-56 has a mass of exactly 56 u.', a: false,
      why: 'Its atomic mass is 55.935 u. Nucleons bound in a nucleus weigh less than free ones; the missing mass is the [[binding-energy|binding energy]].' }
  ],
  applications: ['Mass spectrometers sort isotopes by bending ions in a magnetic field, for dating rocks and tracing pollution.', 'Isotope labelling in medicine and biology: deuterium, carbon-13 and nitrogen-15 act as tags that behave chemically like the ordinary atoms.', 'Uranium enrichment raises the U-235 share from 0.72 % to 3–5 % for power reactors.'],
  history: 'Rutherford inferred the nucleus in 1911 from the scattering experiments of Hans Geiger and Ernest Marsden. He named the proton in 1920, and James Chadwick identified the neutron in 1932, completing the picture of a nucleus made of two kinds of nucleon.'
},

{
  id: 'nuclear-size', parent: 'the-nucleus', title: 'Nuclear size and density', level: 2,
  short: 'Nuclei are a few femtometres across, their volume grows in proportion to the number of nucleons, and they all share one staggering density: about 2 × 10¹⁷ kg/m³.',
  keywords: ['nuclear radius', 'femtometre', 'fermi', 'nuclear density', 'R = R0 A^(1/3)', 'Rutherford scattering', 'distance of closest approach', 'electron scattering', 'nuclear matter'],
  prereq: ['nuclear-structure', 'density', 'math:volume'],
  related: ['strong-force', 'compact-stars', 'de-broglie-wavelength', 'electric-potential-energy'],
  body: `
Nuclear sizes are measured in **femtometres**: $1\\ \\mathrm{fm} = 10^{-15}\\ \\mathrm{m}$, a unit nuclear physicists call the *fermi*. A proton is about 0.84 fm in radius; a uranium nucleus about 7.4 fm. An atom is roughly $10^{-10}$ m across, so if the nucleus of a gold atom were a marble one centimetre wide, the atom around it would be about two hundred metres wide — the rest empty space thinly populated by electrons.

### Measuring it
Rutherford got an upper limit by asking how close an alpha particle can come. A head-on alpha stops when its kinetic energy has all turned into electric [[electric-potential-energy|potential energy]]:

$$d = \\frac{k\\,(z e)(Z e)}{K}$$

For 7.7 MeV alphas on gold this is about 30 fm, and since the scattering still followed Coulomb's law exactly, the nucleus had to be smaller than that. Later, fast electrons were used as probes: they feel only the electric charge, and when their [[de-broglie-wavelength|de Broglie wavelength]] is a few femtometres their diffraction pattern maps the charge inside the nucleus.

### The size rule
The measurements show that nuclei are roughly spheres whose volume is proportional to the number of nucleons:

$$R = R_0 A^{1/3}, \\qquad R_0 \\approx 1.2\\ \\mathrm{fm}$$

Doubling the number of nucleons doubles the volume but raises the radius only by $2^{1/3} = 1.26$. Carbon-12 has $R \\approx 2.7\\ \\mathrm{fm}$, iron-56 about 4.6 fm, uranium-238 about 7.4 fm.

### One density for all
If volume is proportional to $A$, the density is the same for every nucleus:

$$\\rho = \\frac{A\\,m_u}{\\tfrac43 \\pi R_0^3 A} = \\frac{3 m_u}{4\\pi R_0^3} \\approx 2.3 \\times 10^{17}\\ \\mathrm{kg/m^3}$$

A teaspoon (5 cm³) of nuclear matter would weigh about a billion tonnes. Nucleons pack together like drops of an incompressible liquid, each touching only its neighbours: a first hint that the force between them has a very short range (see [[strong-force]]). The only place such matter exists in bulk is a [[compact-stars|neutron star]], essentially a single nucleus 20 km wide.

> [!fact] The edge of a nucleus is not sharp: the density falls from its central value to near zero over about 2 fm, whatever the size of the nucleus. $R_0 A^{1/3}$ is the radius where it has fallen to half.
`,
  ideas: [
    'Nuclei are a few femtometres (10⁻¹⁵ m) in radius, about 10⁵ times smaller than atoms.',
    'The radius grows as the cube root of the mass number: R ≈ 1.2 fm × A^(1/3).',
    'Volume proportional to A means every nucleus has the same density, about 2.3 × 10¹⁷ kg/m³.',
    'Constant density shows that nucleons behave like an incompressible liquid held by a short-range force.'
  ],
  pitfalls: [
    'A nucleus with twice the nucleons is twice as wide — Its volume doubles; its radius grows only by the cube root of 2, about 26 %.',
    'Heavy nuclei are denser than light ones — Nuclear density is nearly the same for all nuclei; heavy nuclei are simply bigger.',
    'The distance of closest approach is the nuclear radius — It is only an upper limit. The alpha particle turns back before touching unless its energy is high enough to overcome the repulsion.'
  ],
  formulas: [
    {
      name: 'Nuclear radius',
      expr: 'R = R0*A^(1/3)', tex: 'R = R_0 A^{1/3}',
      vars: {
        R: { name: 'nuclear radius', q: 'length', unit: 'fm' },
        R0: { name: 'radius constant', q: 'length', unit: 'fm', value: 1.2 },
        A: { name: 'mass number', q: 'count', value: 197 }
      },
      note: 'Fits most nuclei to within a few per cent; $R_0$ between 1.1 and 1.25 fm depending on how "radius" is defined.',
      stories: {
        R: 'Estimate the radius of a nucleus with mass number {A}.',
        A: 'A nucleus has a measured radius of {R}. Roughly how many nucleons does it contain?'
      }
    },
    {
      name: 'Density of a nucleus',
      expr: 'rho = 3*A*amu/(4*pi*R^3)', tex: '\\rho = \\frac{3 A\\, m_u}{4 \\pi R^3}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'kg/m³' },
        A: { name: 'mass number', q: 'count', value: 56 },
        R: { name: 'nuclear radius', q: 'length', unit: 'fm', value: 4.59 },
        amu: { const: 'amu', tex: 'm_u' }
      },
      note: 'Each nucleon weighs about $1\\ \\mathrm{u}$. With $R = R_0 A^{1/3}$ the mass number cancels, which is why every nucleus comes out near $2.3 \\times 10^{17}\\ \\mathrm{kg/m^3}$.',
      practice: { unknowns: ['rho', 'R'] },
      stories: { rho: 'An iron-56 nucleus has a radius of about {R}. What is its density?' }
    },
    {
      name: 'Distance of closest approach',
      expr: 'd = ke*z*Z*qe^2/K', tex: 'd = \\frac{k\\, z Z e^2}{K}',
      vars: {
        d: { name: 'distance of closest approach', q: 'length', unit: 'fm' },
        z: { name: 'charge number of the projectile', q: 'count', value: 2 },
        Z: { name: 'charge number of the target nucleus', q: 'count', value: 79 },
        K: { name: 'kinetic energy of the projectile', q: 'energy', unit: 'MeV', value: 7.7 },
        ke: { const: 'ke' },
        qe: { const: 'qe' }
      },
      note: 'Head-on collision with a heavy nucleus that does not recoil: all the kinetic energy becomes electric potential energy. A handy product: $k e^2 = 1.44\\ \\mathrm{MeV\\,fm}$.',
      practice: { unknowns: ['d', 'K'] },
      stories: {
        d: 'An alpha particle (z = {z}) of {K} heads straight for a gold nucleus (Z = {Z}). How close does it get before turning back?',
        K: 'What kinetic energy must an alpha particle (z = {z}) have to reach within {d} of a nucleus with Z = {Z}?'
      }
    }
  ],
  examples: [
    {
      title: 'Rutherford\'s upper limit',
      q: 'Alpha particles of 7.7 MeV strike gold ($Z = 79$). How close can one get, and what does the answer say about the size of the gold nucleus?',
      steps: [
        'At closest approach all the kinetic energy is potential energy: $K = k (2e)(79e)/d$.',
        'With $k e^2 = 1.44\\ \\mathrm{MeV\\,fm}$: $d = \\dfrac{2 \\times 79 \\times 1.44\\ \\mathrm{MeV\\,fm}}{7.7\\ \\mathrm{MeV}} = 29.5\\ \\mathrm{fm}$.',
        'Since these alphas still scattered exactly as Coulomb\'s law predicts, nothing else touched them: the gold nucleus is smaller than 30 fm.',
        'The size rule gives $R = 1.2 \\times 197^{1/3} = 7.0\\ \\mathrm{fm}$, comfortably inside the limit.'
      ],
      a: 'About 30 fm, so the gold nucleus is smaller than that (it is about 7 fm).'
    },
    {
      title: 'A teaspoon of nuclear matter',
      q: 'Using $R_0 = 1.2\\ \\mathrm{fm}$, find the density of nuclear matter and the mass of 5 cm³ of it.',
      steps: [
        '$\\rho = \\dfrac{3 m_u}{4\\pi R_0^3} = \\dfrac{3 \\times 1.661\\times10^{-27}}{4\\pi \\times (1.2\\times10^{-15})^3}$.',
        '$(1.2\\times10^{-15})^3 = 1.728\\times10^{-45}\\ \\mathrm{m^3}$, so $\\rho = \\dfrac{4.98\\times10^{-27}}{2.17\\times10^{-44}} = 2.3\\times10^{17}\\ \\mathrm{kg/m^3}$.',
        'Mass of $5\\times10^{-6}\\ \\mathrm{m^3}$: $m = 2.3\\times10^{17} \\times 5\\times10^{-6} \\approx 1.1\\times10^{12}\\ \\mathrm{kg}$.'
      ],
      a: '2.3 × 10¹⁷ kg/m³; a teaspoon would weigh about 10¹² kg — a billion tonnes.'
    }
  ],
  quiz: [
    { q: 'Nucleus B has 8 times as many nucleons as nucleus A. Its radius is…', choices: ['the same', 'twice as large', '8 times as large', '512 times as large'], a: 1,
      why: '$R \\propto A^{1/3}$ and $8^{1/3} = 2$. Its volume is 8 times larger, as the eightfold number of nucleons requires.' },
    { q: 'Compared with a helium nucleus, the density of a uranium nucleus is…', choices: ['about 60 times larger', 'about the same', 'much smaller', 'about 4 times larger'], a: 1,
      why: 'Volume grows in proportion to the number of nucleons, so mass per volume is the same. That constant density is one of the key facts about nuclei.' },
    { q: 'Doubling the kinetic energy of an alpha particle in a head-on collision with a nucleus changes its distance of closest approach by a factor of…', choices: ['4', '2', '1/2', '1/4'], a: 2,
      why: '$d = kzZe^2/K$ is inversely proportional to $K$. Faster alphas get closer — which is how scattering eventually reveals where the nucleus ends.' },
    { q: 'If the nucleus of an atom were enlarged to the size of a pea (5 mm), the atom would be about…', choices: ['5 cm across', '5 m across', '500 m across', '5000 km across'], a: 2,
      why: 'Atoms are about $10^5$ times wider than their nuclei: 5 mm × 10⁵ = 500 m.' }
  ],
  applications: ['Neutron stars: 1.4 solar masses of nuclear-density matter in a ball about 20 km wide.', 'Electron-scattering facilities map the charge and neutron-skin thickness of heavy nuclei.', 'The same density sets the size scale of the fission fragments and fusion products in [[nuclear-reactions]].']
},

{
  id: 'strong-force', parent: 'the-nucleus', title: 'The strong nuclear force', level: 2,
  short: 'The attraction between nucleons that holds nuclei together: stronger than the electric repulsion of the protons, but reaching only about the width of a nucleon.',
  keywords: ['strong force', 'nuclear force', 'strong interaction', 'short range', 'Yukawa', 'pion', 'charge independence', 'saturation', 'residual strong force', 'gluon'],
  prereq: ['nuclear-structure', 'coulombs-law', 'nuclear-size'],
  related: ['binding-energy', 'fundamental-forces', 'quarks', 'radioactive-decay'],
  body: `
Two protons 2 fm apart in a nucleus repel each other with a force of about 58 N — the weight of a 6 kg bag of shopping, acting on a particle of $1.7\\times10^{-27}$ kg. On its own that would fling them apart with an acceleration of $3 \\times 10^{28}\\ \\mathrm{m/s^2}$. Something far stronger must hold nuclei together: the **strong nuclear force**.

### Its character
Decades of scattering experiments show that the force between two nucleons:

- is **attractive and very strong** at distances around 1 fm, roughly a hundred times stronger than the electric repulsion there;
- has a **short range**: it fades to almost nothing beyond 2–3 fm, so a nucleon feels only its nearest neighbours;
- is **charge independent**: proton–proton, neutron–neutron and proton–neutron pairs attract equally (apart from the protons' electric repulsion);
- turns **repulsive at very short distance**, below about 0.5 fm, which keeps nucleons from collapsing into each other.

Short range explains the constant density of [[nuclear-size|nuclei]]: like molecules in a drop of liquid, each nucleon bonds only with those touching it. It also explains why the binding energy per nucleon is roughly the same for all but the lightest nuclei (see [[binding-energy]]), whereas the electric repulsion, which reaches across the whole nucleus, grows with the square of the number of protons.

### Why neutrons are needed
Neutrons add attraction without adding repulsion, so they glue protons together: no nucleus with two or more protons is stable without neutrons. But neutrons cannot be added freely either — they obey the [[pauli-exclusion|exclusion principle]] and must fill ever higher energy levels, which pushes light nuclei towards $N \\approx Z$. In heavy nuclei the long-range repulsion wins more and more: beyond lead ($Z = 82$) no nucleus is truly stable, and alpha decay and fission take over.

### Where it comes from
In 1935 Hideki Yukawa proposed that nucleons attract by exchanging a massive particle. A particle of rest energy $mc^2$ can be "borrowed" only briefly, for about $\\hbar/mc^2$, and so travel only about

$$r_0 \\approx \\frac{\\hbar}{mc} = \\frac{\\hbar c}{mc^2}$$

Yukawa's potential falls off as $e^{-r/r_0}/r$ instead of $1/r$. The exchanged particle, the **pion** with $mc^2 \\approx 140\\ \\mathrm{MeV}$, was found in 1947 and gives $r_0 \\approx 1.4\\ \\mathrm{fm}$, just right. Today the nucleon–nucleon force is understood as a leftover of the deeper force between [[quarks]], carried by gluons: much as the van der Waals attraction between neutral molecules is a residue of the electric forces inside them.

> [!note] Electrons and neutrinos do not feel the strong force at all. That is why electrons make clean probes of the nucleus, and why atoms have their electrons outside rather than inside the nucleus.
`,
  ideas: [
    'The strong force binds nucleons together and is much stronger than the electric repulsion at nuclear distances.',
    'Its range is only about 1–2 fm, so each nucleon interacts with its near neighbours only.',
    'It acts equally between protons and neutrons; neutrons add attraction without repulsion.',
    'Its short range comes from the mass of the exchanged pion: $r_0 \\approx \\hbar/m_\\pi c \\approx 1.4$ fm.',
    'At a deeper level it is a residue of the colour force between quarks, carried by gluons.'
  ],
  pitfalls: [
    'The strong force is strong at all distances — It dies away within a few femtometres; between two nuclei a few fm apart only the electric repulsion is left.',
    'Neutrons hold the nucleus together because they are neutral — Being neutral only means they do not repel; the binding itself comes from the strong attraction they share with every neighbour.',
    'More neutrons always make a nucleus more stable — Too many neutrons make it unstable too: neutron-rich nuclei beta-decay, turning neutrons into protons.'
  ],
  formulas: [
    {
      name: 'Electric repulsion between two protons',
      expr: 'F = ke*qe^2/r^2', tex: 'F = \\frac{k e^2}{r^2}',
      vars: {
        F: { name: 'repulsive force', q: 'force', unit: 'N' },
        r: { name: 'separation', q: 'length', unit: 'fm', value: 2 },
        ke: { const: 'ke' },
        qe: { const: 'qe' }
      },
      note: 'The strong attraction must beat this inside every nucleus.',
      stories: { F: 'Two protons in a nucleus are {r} apart. How hard do they repel each other?', r: 'At what separation do two protons repel each other with a force of {F}?' }
    },
    {
      name: 'Electric potential energy of two protons',
      expr: 'U = ke*qe^2/r', tex: 'U = \\frac{k e^2}{r}',
      vars: {
        U: { name: 'potential energy', q: 'energy', unit: 'MeV' },
        r: { name: 'separation', q: 'length', unit: 'fm', value: 1 },
        ke: { const: 'ke' },
        qe: { const: 'qe' }
      },
      note: '$k e^2 = 1.44\\ \\mathrm{MeV\\,fm}$: a useful number to remember for nuclear estimates.',
      stories: { U: 'How much electric potential energy do two protons {r} apart have?' }
    },
    {
      name: 'Range of a force carried by a massive particle',
      expr: 'r0 = hbar*c/E', tex: 'r_0 = \\frac{\\hbar c}{E}',
      vars: {
        r0: { name: 'range', q: 'length', unit: 'fm' },
        E: { name: 'rest energy of the exchanged particle (mc²)', q: 'energy', unit: 'MeV', value: 139.6 },
        hbar: { const: 'hbar' },
        c: { const: 'c' }
      },
      note: 'Yukawa\'s estimate. $\\hbar c = 197.3\\ \\mathrm{MeV\\,fm}$, so a 140 MeV pion gives about 1.4 fm.',
      stories: { r0: 'The pion has a rest energy of {E}. Estimate the range of the force it carries.', E: 'A force has a range of {r0}. What rest energy should its carrier particle have?' }
    }
  ],
  examples: [
    {
      title: 'How hard is the push?',
      q: 'Two protons sit 2.0 fm apart in a nucleus. Find their electric repulsion and the acceleration it would give a free proton.',
      steps: [
        '$F = \\dfrac{k e^2}{r^2} = \\dfrac{8.99\\times10^{9} \\times (1.602\\times10^{-19})^2}{(2.0\\times10^{-15})^2}$.',
        'Numerator $2.31\\times10^{-28}\\ \\mathrm{N\\,m^2}$, denominator $4.0\\times10^{-30}\\ \\mathrm{m^2}$: $F = 58\\ \\mathrm{N}$.',
        '$a = F/m_p = 58/1.67\\times10^{-27} = 3.5\\times10^{28}\\ \\mathrm{m/s^2}$.',
        'The strong attraction between the same two protons is larger still, which is why the nucleus holds.'
      ],
      a: 'About 58 N, enough to accelerate a proton at 3.5 × 10²⁸ m/s².'
    },
    {
      title: 'Yukawa\'s prediction',
      q: 'Nuclear forces were known to reach about 1.4 fm. What mass did Yukawa predict for the particle that carries them?',
      steps: [
        'Invert the range estimate: $mc^2 = \\dfrac{\\hbar c}{r_0}$.',
        'With $\\hbar c = 197.3\\ \\mathrm{MeV\\,fm}$: $mc^2 = 197.3/1.4 = 141\\ \\mathrm{MeV}$, about 270 electron masses.',
        'The charged pions (139.6 MeV) and neutral pion (135.0 MeV) were found in cosmic rays and accelerators in 1947–50.'
      ],
      a: 'A rest energy of about 140 MeV — the pion.'
    }
  ],
  quiz: [
    { q: 'Why is there no stable nucleus made of two protons and no neutrons?', choices: ['Protons do not feel the strong force', 'The strong force between two protons alone is not enough to beat their repulsion and the exclusion principle', 'Protons are unstable', 'The weak force pushes them apart'], a: 1,
      why: 'The diproton is unbound: without neutrons to add attraction, the balance tips the wrong way. Deuterium (one proton, one neutron) is bound, but only just, by 2.2 MeV.' },
    { q: 'The strong force between two nucleons 10 fm apart is…', choices: ['much larger than their electric force', 'about equal to it', 'negligible', 'repulsive and large'], a: 2,
      why: 'Its range is only 1–2 fm; at 10 fm it has died away completely, and for two protons only the electric repulsion remains.' },
    { q: 'Which particle does not feel the strong force?', choices: ['proton', 'neutron', 'electron', 'pion'], a: 2,
      why: 'Electrons are leptons: they feel the electromagnetic, weak and gravitational forces only. Protons, neutrons and pions are made of quarks.' },
    { q: 'Because the strong force is short-ranged, the binding energy per nucleon is roughly the same for most nuclei.', a: true,
      why: 'Each nucleon bonds with its near neighbours only, so adding nucleons adds a fixed amount of binding each — like adding molecules to a drop of liquid.' }
  ],
  history: 'Hideki Yukawa proposed the meson theory of nuclear forces in 1935 and received the Nobel Prize in 1949, two years after Cecil Powell\'s group found the pion in photographic plates exposed to cosmic rays on mountain tops.'
},

{
  id: 'binding-energy', parent: 'the-nucleus', title: 'Mass defect and binding energy', level: 2,
  short: 'A nucleus weighs less than the protons and neutrons it is made of. The missing mass, times c², is the binding energy — and its curve explains why both fission and fusion release energy.',
  keywords: ['binding energy', 'mass defect', 'binding energy per nucleon', 'E = mc^2', 'iron peak', 'nickel-62', 'semi-empirical mass formula', 'liquid drop model', 'Weizsäcker', 'mass excess'],
  prereq: ['mass-energy', 'nuclear-structure', 'strong-force'],
  related: ['q-value', 'fission', 'fusion', 'stellar-evolution'],
  body: `
Weigh a helium-4 atom and compare it with two hydrogen atoms plus two neutrons. The helium is lighter by 0.0304 u — about 0.75 % of its mass. The mass has not vanished; it left as energy when the nucleons came together, following [[mass-energy|$E = mc^2$]]. To pull the nucleus apart again you must put that energy back.

### Mass defect and binding energy
For a nucleus with $Z$ protons and $N$ neutrons, using atomic masses (so the electrons cancel),

$$\\Delta m = Z\\,m_\\mathrm{H} + N\\,m_n - M, \\qquad B = \\Delta m\\, c^2$$

$\\Delta m$ is the **mass defect** and $B$ the **binding energy**, conveniently $B = \\Delta m \\times 931.494\\ \\mathrm{MeV/u}$. For helium-4, $B = 28.3\\ \\mathrm{MeV}$. Compare a chemical bond of a few eV: nuclear binding is about a million times stronger.

### The curve that explains nuclear energy
The telling quantity is the **binding energy per nucleon**, $B/A$: how tightly, on average, each nucleon is held.

| Nucleus | $B$ (MeV) | $B/A$ (MeV) |
|---|---|---|
| $ {}^{2}\\mathrm{H}$ | 2.22 | 1.11 |
| $ {}^{4}\\mathrm{He}$ | 28.3 | 7.07 |
| $ {}^{12}\\mathrm{C}$ | 92.2 | 7.68 |
| $ {}^{56}\\mathrm{Fe}$ | 492.3 | 8.79 |
| $ {}^{238}\\mathrm{U}$ | 1801.7 | 7.57 |

$B/A$ rises steeply among the light nuclei, peaks near iron and nickel at about 8.8 MeV, then declines slowly towards uranium. Any change that moves nucleons towards the peak releases energy:

- **[[fission|Fission]]**: split uranium ($7.6$ MeV per nucleon) into two medium nuclei ($\\approx 8.5$): about $0.9 \\times 236 \\approx 200\\ \\mathrm{MeV}$ per event.
- **[[fusion|Fusion]]**: join hydrogen isotopes into helium, climbing the steep left side: 17.6 MeV from one deuterium and one tritium.

Stars fuse their way up the curve until they reach iron; beyond it, fusion costs energy, which is why a massive star's iron core collapses (see [[stellar-evolution]]).

### Why the curve has this shape: the liquid drop
Treating the nucleus as a charged liquid drop gives the **semi-empirical mass formula** (Weizsäcker, 1935):

$$B = a_V A - a_S A^{2/3} - a_C \\frac{Z(Z-1)}{A^{1/3}} - a_A \\frac{(A-2Z)^2}{A} \\pm \\delta$$

The **volume** term counts neighbour bonds ($a_V \\approx 15.8$ MeV); the **surface** term removes bonds missing at the surface, which hurts small nuclei most; the **Coulomb** term is the repulsion of all proton pairs, which hurts large nuclei most; the **asymmetry** term (from the [[pauli-exclusion|exclusion principle]]) penalises unequal $N$ and $Z$; the **pairing** term $\\delta \\approx 12/\\sqrt A$ MeV favours even numbers of protons and neutrons. The surface loss falling and the Coulomb loss rising produce the maximum in the middle. The formula matches measured binding energies of heavy nuclei to better than 1 %.

> [!key] Binding energy is the energy needed to take a nucleus apart; the same energy was released when it formed. A more tightly bound product means energy out.
`,
  ideas: [
    'A nucleus is lighter than its separate nucleons; the mass defect times c² is the binding energy.',
    '1 u of mass is equivalent to 931.5 MeV of energy.',
    'Binding energy per nucleon peaks at about 8.8 MeV near iron and nickel.',
    'Moving towards the peak releases energy: fission of heavy nuclei, fusion of light ones.',
    'The liquid-drop formula explains the curve: volume binding minus surface, Coulomb and asymmetry penalties.'
  ],
  pitfalls: [
    'Binding energy is energy stored in the nucleus, released when it breaks up — It is the opposite: energy released when the nucleus formed, and needed to break it up. Energy comes out of fission because the fragments are more tightly bound than the uranium.',
    'The nucleus with the most binding energy is the most stable — Compare B per nucleon, not the total. Uranium has far more total binding energy than iron, but less per nucleon.',
    'Using nuclear masses for the nucleus and hydrogen-atom masses for protons — Be consistent: with atomic masses use $m_\\mathrm{H}$ for the protons, so the electrons cancel.'
  ],
  derivation: {
    title: 'Binding energy of helium-4, step by step',
    steps: [
      { text: 'Two hydrogen atoms and two neutrons, from the tables:', tex: '2 m_\\mathrm{H} + 2 m_n = 2(1.007825) + 2(1.008665) = 4.032980\\ \\mathrm{u}' },
      { text: 'The helium-4 atom weighs less:', tex: '\\Delta m = 4.032980 - 4.002603 = 0.030377\\ \\mathrm{u}' },
      { text: 'Convert with $1\\ \\mathrm{u}\\,c^2 = 931.494\\ \\mathrm{MeV}$:', tex: 'B = 0.030377 \\times 931.494 = 28.30\\ \\mathrm{MeV}' },
      { text: 'Per nucleon:', tex: '\\frac{B}{A} = \\frac{28.30}{4} = 7.07\\ \\mathrm{MeV}' }
    ]
  },
  formulas: [
    {
      name: 'Mass defect',
      expr: 'dm = Z*mH + N*mn - M', tex: '\\Delta m = Z\\, m_\\mathrm{H} + N\\, m_n - M',
      vars: {
        dm: { name: 'mass defect', q: 'mass', unit: 'u', tex: '\\Delta m' },
        Z: { name: 'protons', q: 'count', value: 2, int: true },
        N: { name: 'neutrons', q: 'count', value: 2, int: true },
        M: { name: 'atomic mass of the nuclide', q: 'mass', unit: 'u', value: 4.00260325 },
        mH: { name: 'mass of a hydrogen-1 atom', q: 'mass', unit: 'u', value: 1.00782503, fixed: true, tex: 'm_\\mathrm{H}' },
        mn: { name: 'mass of a neutron', q: 'mass', unit: 'u', value: 1.00866492, fixed: true, tex: 'm_n' }
      },
      note: 'Defaults: helium-4. Other atomic masses: C-12 12 u exactly, O-16 15.994915 u, Fe-56 55.934936 u, U-238 238.050788 u.',
      practice: false
    },
    {
      name: 'Binding energy from the mass defect',
      expr: 'B = dm*c^2', tex: 'B = \\Delta m\\, c^2',
      vars: {
        B: { name: 'binding energy', q: 'energy', unit: 'MeV' },
        dm: { name: 'mass defect', q: 'mass', unit: 'u', value: 0.030377, tex: '\\Delta m' },
        c: { const: 'c' }
      },
      stories: { B: 'A nucleus has a mass defect of {dm}. What is its binding energy?', dm: 'A nucleus is bound by {B}. How much lighter is it than its separate nucleons?' }
    },
    {
      name: 'Binding energy per nucleon',
      expr: 'b = B/A', tex: 'b = \\frac{B}{A}',
      vars: {
        b: { name: 'binding energy per nucleon', q: 'energy', unit: 'MeV' },
        B: { name: 'binding energy', q: 'energy', unit: 'MeV', value: 492.26 },
        A: { name: 'mass number', q: 'count', value: 56 }
      },
      stories: { b: 'Iron-56 has a total binding energy of {B}. How strongly is each of its {A} nucleons bound on average?' }
    },
    {
      name: 'Liquid-drop (semi-empirical) binding energy',
      expr: 'B = aV*A - aS*A^(2/3) - aC*Z*(Z - 1)/A^(1/3) - aA*(A - 2*Z)^2/A',
      tex: 'B = a_V A - a_S A^{2/3} - a_C \\frac{Z(Z-1)}{A^{1/3}} - a_A \\frac{(A-2Z)^2}{A}',
      vars: {
        B: { name: 'binding energy', q: 'energy', unit: 'MeV' },
        A: { name: 'mass number', q: 'count', value: 56, min: 1, max: 300 },
        Z: { name: 'atomic number', q: 'count', value: 26, min: 1, max: 120 },
        aV: { name: 'volume coefficient', q: 'energy', unit: 'MeV', value: 15.8, fixed: true, tex: 'a_V' },
        aS: { name: 'surface coefficient', q: 'energy', unit: 'MeV', value: 18.3, fixed: true, tex: 'a_S' },
        aC: { name: 'Coulomb coefficient', q: 'energy', unit: 'MeV', value: 0.714, fixed: true, tex: 'a_C' },
        aA: { name: 'asymmetry coefficient', q: 'energy', unit: 'MeV', value: 23.2, fixed: true, tex: 'a_A' }
      },
      note: 'Pairing is left out: add about $12/\\sqrt{A}$ MeV when $Z$ and $N$ are both even, subtract it when both are odd. Iron-56 comes out at 489 MeV (measured 492 MeV); two values of $Z$ give each binding energy, one either side of the most stable isobar.',
      practice: { unknowns: ['B'] },
      stories: { B: 'Estimate the binding energy of a nucleus with A = {A} and Z = {Z} from the liquid-drop model.' }
    }
  ],
  examples: [
    {
      title: 'The most tightly bound family',
      q: 'The atomic mass of iron-56 is 55.934936 u. Find its binding energy and its binding energy per nucleon.',
      steps: [
        'Separate parts: $26 m_\\mathrm{H} + 30 m_n = 26(1.007825) + 30(1.008665) = 26.20345 + 30.25995 = 56.46340\\ \\mathrm{u}$.',
        'Mass defect: $\\Delta m = 56.46340 - 55.93494 = 0.52846\\ \\mathrm{u}$ — nearly 1 % of the mass.',
        '$B = 0.52846 \\times 931.494 = 492.3\\ \\mathrm{MeV}$.',
        '$B/A = 492.3/56 = 8.79\\ \\mathrm{MeV}$ per nucleon, close to the top of the curve.'
      ],
      a: 'B = 492 MeV, 8.79 MeV per nucleon.'
    },
    {
      title: 'Where the energy of fission comes from',
      q: 'Uranium-236 ($B/A = 7.59$ MeV) splits into two fragments averaging $B/A = 8.5$ MeV. Estimate the energy released.',
      steps: [
        'The nucleons are the same before and after (236 of them); only how tightly they are bound changes.',
        'Extra binding per nucleon: $8.5 - 7.59 = 0.91\\ \\mathrm{MeV}$.',
        'Total: $236 \\times 0.91 \\approx 215\\ \\mathrm{MeV}$, released mostly as kinetic energy of the fragments.',
        'The measured figure is about 200 MeV per fission (see [[fission]]).'
      ],
      a: 'About 200 MeV per fission.'
    }
  ],
  quiz: [
    { q: 'A nucleus has a mass defect of 0.1 u. Its binding energy is about…', choices: ['0.1 MeV', '9.3 MeV', '93 MeV', '931 MeV'], a: 2, why: '$0.1 \\times 931.5\\ \\mathrm{MeV} = 93\\ \\mathrm{MeV}$.' },
    { q: 'Which process releases energy?', choices: ['Splitting iron-56 into two aluminium nuclei', 'Fusing two iron nuclei', 'Fusing two deuterium nuclei into helium', 'Splitting helium-4 into two deuterons'], a: 2,
      why: 'Energy is released when the products have a higher binding energy per nucleon. Among light nuclei that means fusing upward; iron is at the top, so both splitting and fusing it cost energy.' },
    { q: 'Uranium-238 has about 1800 MeV of binding energy, iron-56 only about 490 MeV. Which is more tightly bound?', choices: ['Uranium-238', 'Iron-56', 'They are equally bound', 'It cannot be told from binding energy'], a: 1,
      why: 'Compare per nucleon: 1800/238 = 7.6 MeV against 490/56 = 8.8 MeV. Iron holds each nucleon more tightly.' },
    { q: 'In the liquid-drop model, which term makes very heavy nuclei less tightly bound?', choices: ['The volume term', 'The surface term', 'The Coulomb term', 'The pairing term'], a: 2,
      why: 'Every proton repels every other, so the Coulomb penalty grows roughly as $Z^2/A^{1/3}$, faster than the number of nucleons. The surface term is what hurts light nuclei.' },
    { q: 'Binding energy is energy that must be supplied to separate a nucleus into its nucleons.', a: true,
      why: 'That is its definition. The same amount was released — as gamma rays or kinetic energy — when the nucleus was assembled.' }
  ],
  applications: ['Every nuclear power source, from reactors to the Sun, draws on the difference in binding energy per nucleon.', 'Nuclear mass measurements in Penning traps pin down binding energies to a few keV, testing models of exotic nuclei.', 'The iron peak explains the abundance of iron in the universe and why supernovae follow the collapse of iron cores.'],
  sim: 'nc-binding-curve'
}

);
