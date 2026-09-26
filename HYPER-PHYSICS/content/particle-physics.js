/* HYPER-PHYSICS · content/particle-physics.js — the forces, the particles of the
 * Standard Model, quarks and hadrons, antimatter, and the machines that probe them. */
Hyper.add(

{
  id: 'fundamental-forces', parent: 'particle-physics', title: 'The four fundamental forces', level: 1,
  short: 'Every push and pull in nature comes from just four interactions — gravity, electromagnetism, the strong force and the weak force — which differ enormously in strength and range.',
  keywords: ['fundamental forces', 'fundamental interactions', 'gravity', 'electromagnetism', 'strong force', 'weak force', 'force carrier', 'gauge boson', 'range', 'electroweak unification', 'relative strength'],
  prereq: ['newtons-law-of-gravitation', 'coulombs-law', 'strong-force'],
  related: ['standard-model', 'radioactive-decay', 'quarks', 'maxwells-equations'],
  body: `
Friction, tension, the lift on a wing, the stiffness of steel, the chemistry of your cells, the glow of the Sun: as far as anyone knows, every interaction in nature comes down to just **four** fundamental forces.

| Force | Acts on | Carried by | Range | Strength (relative) |
|---|---|---|---|---|
| strong | quarks and gluons | 8 gluons | about $10^{-15}$ m | 1 |
| electromagnetic | electric charges | photon | infinite | $10^{-2}$ |
| weak | all quarks and leptons | $W^+$, $W^-$, $Z^0$ | about $10^{-18}$ m | $10^{-6}$ |
| gravity | mass and energy | (graviton, not observed) | infinite | $10^{-38}$ |

The strengths compare the forces between two protons just touching; they are rough, because the forces fall off with distance in different ways.

### Who does what
- **Gravity** is by far the weakest, yet it rules the universe on large scales: it always attracts, and it adds up over every particle of a planet or galaxy (see [[newtons-law-of-gravitation]]).
- **Electromagnetism** holds atoms and molecules together. Almost every everyday force — contact, friction, tension, elasticity — is electrical at heart. It does not dominate the cosmos only because matter is almost perfectly neutral: positive and negative charges cancel.
- The **strong force** binds quarks into protons and neutrons, and — as a residual effect — protons and neutrons into nuclei (see [[strong-force]]).
- The **weak force** is the only one that can change one kind of particle into another: it turns a neutron into a proton in [[radioactive-decay|beta decay]], lets the Sun start fusing hydrogen, and is the only force (besides gravity) that neutrinos feel.

### Forces as exchanged particles
In quantum field theory a force is carried by exchanging particles, the **gauge bosons**. The mass of the carrier sets the range: a particle of rest energy $mc^2$ can only be exchanged over roughly

$$r \\approx \\frac{\\hbar}{mc} = \\frac{\\hbar c}{mc^2}$$

The photon is massless, so electromagnetism reaches to infinity. The $W$ boson weighs 80.4 GeV, so the weak force reaches only about $2.5 \\times 10^{-18}$ m — which, rather than any intrinsic feebleness, is why it is weak at low energies. Gluons are massless, but the strong force is confined for a different reason (see [[quarks]]).

### Towards unification
Maxwell showed in the 1860s that electricity and magnetism are one force. A century later Sheldon Glashow, Abdus Salam and Steven Weinberg showed that electromagnetism and the weak force are two faces of a single **electroweak** interaction, which separate at energies below about 100 GeV. The predicted $W$ and $Z$ bosons were found at CERN in 1983. Whether the strong force joins them at still higher energies, and how gravity fits with quantum physics, are open questions.

> [!key] Four forces: gravity (weakest, cosmic), electromagnetism (atoms, chemistry, everyday forces), strong (nuclei), weak (changes particle identity, beta decay).
`,
  ideas: [
    'All known interactions reduce to four forces: gravity, electromagnetism, the strong force and the weak force.',
    'They differ by some 38 powers of ten in strength; gravity is by far the weakest.',
    'Gravity and electromagnetism have infinite range; the strong and weak forces act only across nuclear distances or less.',
    'Each force is carried by exchange particles; a heavy carrier means a short range, r ≈ ħ/mc.',
    'Electromagnetism and the weak force unite into the electroweak force at high energy.'
  ],
  pitfalls: [
    'Gravity must be strong because it holds planets together — It is the weakest force by far; it wins on large scales only because it always attracts and nothing cancels it.',
    'Contact forces like friction and the normal force are a fifth kind of force — They are electromagnetic: the repulsion between the electron clouds of touching atoms.',
    'The weak force is weak because its coupling is tiny — Its intrinsic strength is similar to electromagnetism; it seems weak at everyday energies because its carriers are so heavy.'
  ],
  formulas: [
    {
      name: 'Electric versus gravitational force between two identical particles',
      expr: 'ratio = ke*qe^2/(G*m^2)', tex: 'R = \\frac{k e^2}{G m^2}',
      vars: {
        ratio: { name: 'ratio of the electric to the gravitational force', q: 'none', tex: 'R' },
        m: { name: 'mass of each particle', q: 'mass', unit: 'u', value: 1.00728 },
        ke: { const: 'ke' },
        qe: { const: 'qe' },
        G: { const: 'G' }
      },
      note: 'Independent of distance, since both forces fall as $1/r^2$. Defaults: two protons. For two electrons use 0.000549 u.',
      practice: { unknowns: ['ratio'] },
      stories: { ratio: 'Two particles of mass {m} each carry one elementary charge. How many times stronger is their electric repulsion than their gravitational attraction?' }
    },
    {
      name: 'Range of a force from the mass of its carrier',
      expr: 'r = hbar*c/E', tex: 'r = \\frac{\\hbar c}{E}',
      vars: {
        r: { name: 'range', q: 'length', unit: 'm' },
        E: { name: 'rest energy of the carrier (mc²)', q: 'energy', unit: 'GeV', value: 80.4 },
        hbar: { const: 'hbar' },
        c: { const: 'c' }
      },
      note: 'Defaults: the $W$ boson. The $Z$ (91.2 GeV) gives about the same; the pion (0.140 GeV) gives the 1.4 fm range of the nuclear force.',
      stories: { r: 'The carrier of a force has a rest energy of {E}. Roughly how far does the force reach?', E: 'A force reaches about {r}. What rest energy should its carrier have?' }
    }
  ],
  examples: [
    {
      title: 'How weak is gravity?',
      q: 'Compare the electric repulsion and the gravitational attraction between two protons.',
      steps: [
        'Both forces fall off as $1/r^2$, so the distance cancels in the ratio: $\\dfrac{F_E}{F_G} = \\dfrac{k e^2}{G m_p^2}$.',
        'Numerator: $8.99\\times10^{9} \\times (1.602\\times10^{-19})^2 = 2.31\\times10^{-28}\\ \\mathrm{N\\,m^2}$.',
        'Denominator: $6.674\\times10^{-11} \\times (1.673\\times10^{-27})^2 = 1.87\\times10^{-64}\\ \\mathrm{N\\,m^2}$.',
        'Ratio: $1.2\\times10^{36}$. For two electrons it is $4\\times10^{42}$.'
      ],
      a: 'The electric force is about 10³⁶ times stronger.'
    },
    {
      title: 'Why the weak force is short-ranged',
      q: 'Estimate the range of the weak force from the $W$ boson\'s rest energy, 80.4 GeV.',
      steps: [
        '$r \\approx \\hbar c / mc^2$, with $\\hbar c = 197.3\\ \\mathrm{MeV\\,fm} = 0.1973\\ \\mathrm{GeV\\,fm}$.',
        '$r \\approx 0.1973/80.4 = 2.5\\times10^{-3}\\ \\mathrm{fm} = 2.5\\times10^{-18}\\ \\mathrm{m}$.',
        'That is about a thousandth of a proton\'s radius, so weak processes need the particles almost on top of each other — which is why they are rare at low energies.'
      ],
      a: 'About 2.5 × 10⁻¹⁸ m.'
    }
  ],
  quiz: [
    { q: 'When you lean on a wall, the wall pushes back. Which fundamental force is that?', choices: ['gravity', 'electromagnetism', 'the strong force', 'the weak force'], a: 1,
      why: 'The normal force is the electric repulsion between the electron clouds of the atoms in your hand and in the wall.' },
    { q: 'Which force turns a neutron into a proton in beta decay?', choices: ['gravity', 'electromagnetism', 'the strong force', 'the weak force'], a: 3,
      why: 'Only the weak interaction changes one type of quark into another (here a down quark into an up quark).' },
    { q: 'Which two forces have infinite range?', choices: ['strong and weak', 'gravity and electromagnetism', 'electromagnetism and strong', 'gravity and weak'], a: 1,
      why: 'Both are carried by massless particles (the photon, and presumably the graviton), and both fall off as $1/r^2$.' },
    { q: 'Gravity is the weakest force, yet it governs the motion of planets and galaxies because…', choices: ['it has the longest range of all forces', 'it only attracts, so it adds up, while electric charges cancel', 'the strong force is blocked by space', 'planets are made of neutrons'], a: 1,
      why: 'Large bodies are electrically neutral, so electric forces between them nearly cancel. Gravity has no negative mass to cancel it.' }
  ],
  history: 'The electroweak theory earned Glashow, Salam and Weinberg the 1979 Nobel Prize; Carlo Rubbia and Simon van der Meer shared the 1984 prize for the discovery of the W and Z at CERN.'
},

{
  id: 'standard-model', parent: 'particle-physics', title: 'The Standard Model', level: 2,
  short: 'The theory of all known particles: six quarks, six leptons, the bosons that carry three of the forces, and the Higgs boson — tested to extraordinary precision, yet known to be incomplete.',
  keywords: ['Standard Model', 'quarks', 'leptons', 'fermions', 'bosons', 'generations', 'Higgs boson', 'neutrino', 'muon', 'tau', 'gauge boson', 'conservation laws', 'lepton number', 'baryon number', 'CERN'],
  prereq: ['fundamental-forces', 'quarks', 'antimatter'],
  related: ['particle-accelerators', 'electron-spin', 'big-bang', 'dark-matter-energy'],
  body: `
By the 1970s a few hundred "elementary" particles had been found, and physicists sorted them into a remarkably compact theory. The **Standard Model** says that all known matter is built from twelve particles, held together by forces carried by five kinds of boson.

### Matter: quarks and leptons
The matter particles are **fermions** with spin ½. They come in three **generations**, each a heavier copy of the one before:

| | Generation 1 | Generation 2 | Generation 3 | Charge |
|---|---|---|---|---|
| up-type quarks | up, 2.2 MeV | charm, 1.27 GeV | top, 173 GeV | $+\\tfrac23$ |
| down-type quarks | down, 4.7 MeV | strange, 93 MeV | bottom, 4.18 GeV | $-\\tfrac13$ |
| charged leptons | electron, 0.511 MeV | muon, 106 MeV | tau, 1777 MeV | $-1$ |
| neutrinos | electron neutrino | muon neutrino | tau neutrino | 0 |

Everything around you is first-generation: up and down [[quarks]] make protons and neutrons, and electrons complete the atoms. The heavier particles are made in cosmic-ray collisions and accelerators and decay within fractions of a second — a muon lives 2.2 µs on average. Neutrinos have tiny masses, below about 1 eV, and pass through the Earth almost unhindered. Each particle has an [[antimatter|antiparticle]].

### Forces: the bosons
The forces are carried by spin-1 **gauge bosons**: the photon (electromagnetism), eight gluons (strong force) and the $W^+$, $W^-$ and $Z^0$ (weak force, 80.4 and 91.2 GeV). Quarks feel all three forces; charged leptons feel the electromagnetic and weak forces; neutrinos only the weak force. Gravity is not part of the Standard Model.

### The Higgs boson
In the theory, the $W$, $Z$ and the fermions would all be massless unless something gave them mass. That something is the **Higgs field**, which fills all of space; particles that interact with it acquire mass. Its particle, the Higgs boson (spin 0, 125 GeV), was discovered at CERN's Large Hadron Collider in 2012 by the ATLAS and CMS experiments, almost fifty years after it was proposed. Note that the Higgs field provides only about 1 % of the mass of a proton; the rest is the energy of the gluon field and the quarks' motion inside it.

### Rules of the game
Every process must conserve energy, momentum, electric charge, **baryon number** (+⅓ per quark, −⅓ per antiquark) and **lepton number** (+1 per lepton, −1 per antilepton). These rules say which reactions can happen. Beta decay, seen at the quark level, is a down quark turning into an up quark by emitting a $W^-$ that becomes an electron and an antineutrino:

$$d \\to u + W^- \\to u + e^- + \\bar\\nu_e$$

Charge ($-\\tfrac13 = \\tfrac23 - 1 + 0$), baryon number and lepton number ($0 = 1 - 1$) all balance.

### What it does not explain
The Standard Model agrees with every accelerator measurement, some to ten or more significant figures. Yet it has no place for gravity, no candidate for [[dark-matter-energy|dark matter]] or dark energy, no reason why the universe holds matter but almost no antimatter, and no explanation for its own roughly two dozen measured constants — or for why there are exactly three generations. Neutrino masses already require an extension. Finding physics beyond it is the main goal of particle physics today.

> [!fact] The top quark weighs about as much as a gold atom, yet it is as point-like as the electron as far as anyone can measure.
`,
  ideas: [
    'Matter is made of 12 fermions: six quarks and six leptons, in three generations.',
    'Ordinary matter needs only the first generation: up and down quarks and electrons.',
    'Forces are carried by gauge bosons: photon, gluons, W and Z. Gravity is not included.',
    'The Higgs field gives mass to the W, Z and fermions; its boson was found in 2012.',
    'Reactions must conserve energy, momentum, charge, baryon number and lepton number.'
  ],
  pitfalls: [
    'Protons and neutrons are fundamental particles — Each is made of three quarks bound by gluons.',
    'The Higgs gives everything its mass — It gives the elementary particles their mass, but 99 % of your mass is the binding energy of quarks and gluons inside protons and neutrons.',
    'The Standard Model explains all of physics — It leaves out gravity, dark matter, dark energy and the matter–antimatter imbalance.'
  ],
  examples: [
    {
      title: 'Allowed or forbidden?',
      q: 'Which of these can happen? (a) $n \\to p + e^- + \\bar\\nu_e$ (b) a free proton: $p \\to n + e^+ + \\nu_e$ (c) $\\mu^- \\to e^- + \\gamma$ (d) $p + p \\to p + p + \\pi^0$ in a collision.',
      steps: [
        '(a) Charge $0 = 1 - 1 + 0$; baryon number $1 = 1$; lepton number $0 = 1 - 1$; the neutron is heavier than proton plus electron. **Allowed**: free neutron decay, half-life about 10 minutes.',
        '(b) Every quantity balances except energy: the neutron is heavier than the proton, so a free proton cannot do this. **Forbidden** — although inside a proton-rich nucleus, where binding supplies the energy, it is beta-plus decay.',
        '(c) Charge and energy balance, but muon number goes from 1 to 0 and electron number from 0 to 1. **Forbidden**, and never seen despite searches sensitive to one in $10^{13}$ decays.',
        '(d) Charge, baryon number and lepton number all balance; the pion is made from the collision energy. **Allowed** if the incoming proton has enough kinetic energy (about 280 MeV on a fixed target).'
      ],
      a: '(a) and (d) are allowed; (b) is forbidden for a free proton; (c) is forbidden.'
    }
  ],
  quiz: [
    { q: 'How many kinds of elementary matter particle (fermions) does the Standard Model contain, not counting antiparticles?', choices: ['3', '6', '12', '18'], a: 2, why: 'Six quarks (up, down, charm, strange, top, bottom) and six leptons (electron, muon, tau and three neutrinos).' },
    { q: 'Which particle feels only the weak force (apart from gravity)?', choices: ['the electron', 'the neutrino', 'the up quark', 'the photon'], a: 1,
      why: 'Neutrinos have no electric charge and no colour charge, so only the weak force acts on them — which is why they cross the whole Earth unhindered.' },
    { q: 'Most of the mass of a proton comes from the Higgs field giving mass to its three quarks.', a: false,
      why: 'The up and down quark masses add up to only about 9 MeV of the proton\'s 938 MeV. The rest is the energy of the gluon field and the quarks\' motion.' },
    { q: 'The decay $\\mu^- \\to e^- + \\gamma$ has never been observed. Which rule forbids it?', choices: ['charge conservation', 'energy conservation', 'lepton family (flavour) number conservation', 'baryon number conservation'], a: 2,
      why: 'Muon number would drop from 1 to 0 and electron number rise from 0 to 1. The observed decay is $\\mu^- \\to e^- + \\bar\\nu_e + \\nu_\\mu$, which keeps both balanced.' },
    { q: 'Where does the matter in ordinary atoms come from, in Standard Model terms?', choices: ['all three generations equally', 'first-generation particles only: up and down quarks and electrons', 'mostly strange and charm quarks', 'Higgs bosons'], a: 1,
      why: 'Heavier generations decay quickly into lighter ones; stable matter is built from u and d quarks (in protons and neutrons) and electrons.' }
  ],
  applications: ['The muon\'s short life, stretched by time dilation, lets cosmic-ray muons reach the ground; muography uses them to image pyramids and volcanoes.', 'Neutrino detectors watch the Sun\'s core and nuclear reactors, and caught the neutrinos of supernova 1987A.', 'Precision tests of the Standard Model guide the design of new colliders.'],
  history: 'Murray Gell-Mann and George Zweig proposed quarks in 1964; the electroweak theory was completed around 1967–71; the top quark was found at Fermilab in 1995, the tau neutrino in 2000 and the Higgs boson in 2012.'
},

{
  id: 'quarks', parent: 'particle-physics', title: 'Quarks and hadrons', level: 2,
  short: 'Protons, neutrons and hundreds of other particles are built of quarks with fractional charge, held by gluons so tightly that no quark has ever been seen alone.',
  keywords: ['quark', 'hadron', 'baryon', 'meson', 'up quark', 'down quark', 'strange quark', 'colour charge', 'gluon', 'confinement', 'asymptotic freedom', 'QCD', 'pion', 'kaon', 'quark-gluon plasma'],
  prereq: ['nuclear-structure', 'strong-force', 'electric-charge'],
  related: ['standard-model', 'particle-accelerators', 'pauli-exclusion', 'fundamental-forces'],
  body: `
In the 1950s and 60s accelerators produced a bewildering "zoo" of short-lived particles — pions, kaons, lambdas, sigmas and many more. In 1964 Murray Gell-Mann and George Zweig showed that the whole zoo could be built from a few simpler constituents, which Gell-Mann named **quarks**. The scheme even predicted a missing particle, the $\\Omega^-$, found that same year with the predicted mass. In 1968 electron-scattering experiments at SLAC saw point-like objects inside the proton, much as Rutherford had seen the nucleus inside the atom.

### Fractional charges
Quarks carry charges of $+\\tfrac23 e$ (up, charm, top) or $-\\tfrac13 e$ (down, strange, bottom). Particles made of quarks are called **hadrons**, and come in two main families:

- **baryons**, three quarks: the proton $uud$ has charge $\\tfrac23 + \\tfrac23 - \\tfrac13 = +1$, the neutron $udd$ has $\\tfrac23 - \\tfrac13 - \\tfrac13 = 0$;
- **mesons**, a quark and an antiquark: the pion $\\pi^+ = u\\bar d$ has charge $\\tfrac23 + \\tfrac13 = +1$.

| Hadron | Quarks | Charge | Mass (MeV/c²) |
|---|---|---|---|
| proton | uud | +1 | 938.3 |
| neutron | udd | 0 | 939.6 |
| pion $\\pi^+$ | u, anti-d | +1 | 139.6 |
| kaon $K^+$ | u, anti-s | +1 | 493.7 |
| lambda $\\Lambda^0$ | uds | 0 | 1115.7 |
| omega $\\Omega^-$ | sss | −1 | 1672.5 |
| J/psi | c, anti-c | 0 | 3096.9 |

### Colour
The $\\Delta^{++}$ is made of three up quarks in the same state, which the [[pauli-exclusion|exclusion principle]] forbids — unless the quarks differ in some hidden property. That property is **colour charge**: each quark is "red", "green" or "blue" (nothing to do with real colours). The strong force acts on colour, carried by eight **gluons** that themselves carry colour. The theory is **quantum chromodynamics** (QCD). Every hadron is colour-neutral: three quarks of the three colours, or a quark and an antiquark of a colour and its anticolour.

### Confinement
Unlike the electric force, the force between quarks does not weaken with distance. Pulling two quarks apart stretches the gluon field into a narrow **flux tube** whose energy grows in proportion to its length — about 1 GeV per femtometre, a tension of some 160 kN, the weight of 16 tonnes. Long before the quarks separate, the tube has enough energy to create a new quark–antiquark pair, and it snaps into two hadrons instead of freeing a quark. High-energy collisions therefore produce narrow sprays of hadrons called **jets**, never lone quarks. Conversely, at very short distances the force weakens and quarks move almost freely: **asymptotic freedom**, which earned David Gross, Frank Wilczek and David Politzer the 2004 Nobel Prize.

### Where the mass comes from
The up and down quarks weigh only a few MeV each, yet a proton weighs 938 MeV. About 99 % of the mass of the proton — and so of you — is the energy of the confined quarks and gluons, through $E = mc^2$. At temperatures above about two trillion kelvin, reached briefly in collisions of heavy nuclei at RHIC and the LHC, hadrons melt into a **quark–gluon plasma**, the state of the whole universe in its first microseconds.

> [!note] The nuclear force of the [[strong-force|previous topic]] is the leftover of QCD between colour-neutral nucleons, much as forces between neutral molecules are leftovers of electromagnetism.
`,
  ideas: [
    'Hadrons are built of quarks: baryons from three quarks, mesons from a quark and an antiquark.',
    'Quarks have fractional charges, +2/3 or −1/3 of e; hadrons always have whole-number charges.',
    'Quarks carry colour charge, and every hadron is colour-neutral.',
    'Confinement: the energy of the gluon flux tube grows with distance, so quarks are never seen alone.',
    'About 99 % of a proton\'s mass is the energy of its quarks and gluons, not their rest mass.'
  ],
  pitfalls: [
    'Colour charge means quarks are coloured — It is just a name for a threefold charge; red, green and blue combine to "white" as the charges combine to neutral.',
    'Split a proton hard enough and you get a free quark — The energy creates new quark–antiquark pairs and new hadrons instead.',
    'A proton weighs the sum of its three quark masses — Those add up to only about 9 MeV of the proton\'s 938 MeV.'
  ],
  formulas: [
    {
      name: 'Charge of a hadron from its quarks',
      expr: 'Q = (2*Nu - Nd)/3', tex: 'Q = \\tfrac23 N_u - \\tfrac13 N_d',
      vars: {
        Q: { name: 'charge, in units of e', q: 'none', signed: true },
        Nu: { name: 'net number of up-type quarks (u, c, t; antiquarks count −1)', q: 'none', value: 2, int: true, signed: true, tex: 'N_u' },
        Nd: { name: 'net number of down-type quarks (d, s, b; antiquarks count −1)', q: 'none', value: 1, int: true, signed: true, tex: 'N_d' }
      },
      note: 'Proton: $N_u = 2$, $N_d = 1$. $\\pi^+ = u\\bar d$: $N_u = 1$, $N_d = -1$. $\\Omega^- = sss$: $N_u = 0$, $N_d = 3$.',
      practice: { unknowns: ['Q'] },
      stories: { Q: 'A hadron contains a net {Nu} up-type quarks and {Nd} down-type quarks. What is its charge?' }
    },
    {
      name: 'Energy stored in a stretched colour flux tube',
      expr: 'E = kappa*r', tex: 'E = \\kappa\\, r',
      vars: {
        E: { name: 'energy in the flux tube', q: 'energy', unit: 'MeV' },
        kappa: { name: 'string tension', q: 'force', unit: 'kN', value: 160, tex: '\\kappa' },
        r: { name: 'separation of the quarks', q: 'length', unit: 'fm', value: 1.2 }
      },
      note: 'A tension of about 1 GeV/fm (160 kN). Once the stored energy is enough to make a quark–antiquark pair, usually by 1–2 fm, the tube breaks into two hadrons.',
      stories: { E: 'How much energy is stored in the gluon field between two quarks pulled {r} apart, with a string tension of {kappa}?' }
    }
  ],
  examples: [
    {
      title: 'Building the nucleons',
      q: 'Show that $uud$ and $udd$ give the charges and baryon numbers of the proton and neutron, and find the charge of the $K^-$ meson, $s\\bar u$.',
      steps: [
        'Proton: $\\tfrac23 + \\tfrac23 - \\tfrac13 = +1$. Neutron: $\\tfrac23 - \\tfrac13 - \\tfrac13 = 0$.',
        'Baryon number: each quark carries $+\\tfrac13$, so three quarks give 1.',
        '$K^-$: a strange quark ($-\\tfrac13$) and an anti-up quark ($-\\tfrac23$): charge $-1$, baryon number $\\tfrac13 - \\tfrac13 = 0$, as for every meson.'
      ],
      a: 'Proton +1, neutron 0, both baryon number 1; the K⁻ has charge −1.'
    },
    {
      title: 'Sixteen tonnes on a quark',
      q: 'The QCD string tension is about 1 GeV per femtometre. Express it in newtons.',
      steps: [
        '$1\\ \\mathrm{GeV} = 1.602\\times10^{-10}\\ \\mathrm{J}$ and $1\\ \\mathrm{fm} = 10^{-15}\\ \\mathrm{m}$.',
        'Tension $= 1.602\\times10^{-10}/10^{-15} = 1.6\\times10^{5}\\ \\mathrm{N}$.',
        'That is the weight of about 16 tonnes — constant however far the quarks are pulled, until the tube breaks.'
      ],
      a: 'About 1.6 × 10⁵ N.'
    }
  ],
  quiz: [
    { q: 'The neutron is made of…', choices: ['uud', 'udd', 'uuu', 'a quark and an antiquark'], a: 1, why: 'Two down quarks and an up quark: $\\tfrac23 - \\tfrac13 - \\tfrac13 = 0$.' },
    { q: 'Why has no one ever isolated a single quark?', choices: ['Quarks are too small to detect', 'The energy put into separating them creates new quark–antiquark pairs, forming new hadrons', 'Quarks decay instantly', 'Quarks have no charge'], a: 1,
      why: 'The flux tube between quarks stores energy in proportion to its length; it breaks by pair creation long before a quark is free. This is confinement.' },
    { q: 'A meson made of a strange quark and an anti-up quark has charge…', choices: ['+1', '0', '−1', '−1/3'], a: 2, why: 'Strange: $-\\tfrac13$. Anti-up: $-\\tfrac23$. Total $-1$: this is the $K^-$.' },
    { q: 'Most of a proton\'s mass is the rest mass of its three quarks.', a: false,
      why: 'The quark masses add up to about 1 % of the proton\'s mass; the rest is energy of the gluon field and the quarks\' motion.' },
    { q: 'What is the baryon number of a pion?', choices: ['0', '1/3', '2/3', '1'], a: 0, why: 'A quark ($+\\tfrac13$) and an antiquark ($-\\tfrac13$) cancel: all mesons have baryon number 0.' }
  ],
  applications: ['Heavy-ion colliders recreate the quark–gluon plasma of the early universe.', 'Lattice QCD computations on supercomputers now predict the proton and neutron masses from first principles.', 'Neutron stars test the behaviour of quark matter at extreme density.']
},

{
  id: 'antimatter', parent: 'particle-physics', title: 'Antimatter', level: 2,
  short: 'Every particle has an antiparticle with the same mass and opposite charge. When they meet they annihilate, turning all their mass into energy — used every day in PET scanners.',
  keywords: ['antimatter', 'antiparticle', 'positron', 'antiproton', 'antihydrogen', 'annihilation', 'pair production', 'Dirac', 'PET', '511 keV', 'matter-antimatter asymmetry', 'CERN'],
  prereq: ['mass-energy', 'electric-charge', 'photon'],
  related: ['standard-model', 'radioactive-decay', 'big-bang', 'particle-accelerators'],
  body: `
In 1928 Paul Dirac wrote down an equation for the electron that combined quantum mechanics with special relativity. It worked beautifully, but it also had solutions describing a particle with the electron's mass and the opposite charge. In 1932 Carl Anderson found exactly such tracks in a cloud chamber exposed to cosmic rays: particles that curved the "wrong" way in a magnetic field. The **positron**, the anti-electron, was the first antimatter.

### Opposites with the same mass
Every particle has an **antiparticle** with the same mass, spin and lifetime, and opposite charge, baryon number, lepton number and magnetic moment. The antiproton was made in 1955 at Berkeley's Bevatron; the antineutron, made of antiquarks, a year later. A few neutral particles, such as the photon and the neutral pion, are their own antiparticles. Antiparticles combine as particles do: in 1995 CERN made the first atoms of **antihydrogen**, an antiproton orbited by a positron, and since 2010 its experiments have trapped them for minutes. Their spectrum matches ordinary hydrogen to about a part in $10^{12}$, and in 2023 antihydrogen was seen to fall under gravity like ordinary matter.

### Annihilation
When a particle meets its antiparticle they can **annihilate**, turning all their rest energy into other particles. An electron and a positron at rest become two gamma-ray photons:

$$e^+ + e^- \\to 2\\gamma, \\qquad E_\\gamma = m_e c^2 = 511\\ \\mathrm{keV}\\ \\text{each}$$

Two photons, not one, because the total momentum was zero and must stay zero: the photons fly off back to back. Annihilation converts 100 % of the mass to energy — compared with 0.1 % in fission and 0.7 % in fusion. One gram of antimatter meeting one gram of matter releases $1.8 \\times 10^{14}$ J, about the energy of 43 kilotonnes of TNT. That is no practical energy source, though: all the antimatter CERN has ever made amounts to a few nanograms, and making it takes billions of times more energy than it returns.

### Pair production
The reverse also happens: a photon with more than $2 m_e c^2 = 1.022$ MeV passing close to a nucleus can turn into an electron–positron pair. (The nucleus is needed to take up some momentum; a lone photon cannot do it.) Above a few MeV, pair production is the main way gamma rays lose energy in lead.

### Antimatter at work
A **PET scan** injects a tracer labelled with a beta-plus emitter, usually fluorine-18 in a glucose analogue. Each positron travels about a millimetre, annihilates, and sends two 511 keV photons in opposite directions. A ring of detectors registers the pairs in coincidence, and each pair defines a line through the point of emission; millions of lines reconstruct a 3-D map of where the sugar is used — tumours and active brain regions light up.

### The great asymmetry
The big bang should have made matter and antimatter in equal amounts, which would have annihilated completely. Instead, for every billion pairs there was roughly one extra quark, and that leftover is all the matter in the universe. The Standard Model contains a small matter–antimatter difference (CP violation), but far too little to explain it: one of the major open problems of physics (see [[standard-model]]).

> [!fact] A banana emits a positron roughly once every hour or so, from the rare beta-plus branch of its potassium-40.
`,
  ideas: [
    'Every particle has an antiparticle with the same mass and opposite charge and quantum numbers.',
    'Particle and antiparticle can annihilate, converting all their rest energy into photons or other particles.',
    'An electron–positron pair at rest gives two back-to-back 511 keV photons.',
    'A photon above 1.022 MeV can create an electron–positron pair near a nucleus.',
    'The universe is almost entirely matter; why is still unexplained.'
  ],
  pitfalls: [
    'Antimatter has negative mass and falls upwards — It has ordinary positive mass; antihydrogen has been seen to fall downwards.',
    'Annihilation makes a single photon — Momentum conservation requires at least two photons for a pair at rest.',
    'Antimatter could be a fuel — It stores energy superbly, but making it costs far more energy than it can ever return.'
  ],
  formulas: [
    {
      name: 'Energy released by annihilation',
      expr: 'E = 2*m*c^2', tex: 'E = 2 m c^2',
      vars: {
        E: { name: 'energy released', q: 'energy', unit: 'GJ' },
        m: { name: 'mass of antimatter (meeting an equal mass of matter)', q: 'mass', unit: 'g', value: 1 },
        c: { const: 'c' }
      },
      note: 'Also the threshold for pair production: a photon needs $E \\ge 2 m_e c^2 = 1.022$ MeV to make an electron–positron pair.',
      stories: { E: '{m} of antimatter annihilates with the same mass of matter. How much energy is released?', m: 'How much antimatter would release {E} by annihilation?' }
    },
    {
      name: 'Wavelength of an annihilation photon',
      expr: 'lambda = h*c/E', tex: '\\lambda = \\frac{h c}{E}',
      vars: {
        lambda: { name: 'photon wavelength', q: 'length', unit: 'pm' },
        E: { name: 'photon energy', q: 'energy', unit: 'keV', value: 511 },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      note: 'For $E = m_e c^2$ this is the Compton wavelength of the electron, 2.43 pm.',
      stories: { lambda: 'An electron and a positron annihilate at rest, each photon carrying {E}. What is the photons\' wavelength?' }
    }
  ],
  examples: [
    {
      title: 'The photons in a PET scanner',
      q: 'A positron from fluorine-18 annihilates with an electron, both essentially at rest. Find the energy, wavelength and directions of the photons.',
      steps: [
        'Total energy: $2 m_e c^2 = 2 \\times 0.511 = 1.022\\ \\mathrm{MeV}$. Total momentum: zero.',
        'Two photons with zero total momentum must have equal energies and opposite directions: 511 keV each.',
        'Wavelength: $\\lambda = hc/E = \\dfrac{1240\\ \\mathrm{eV\\,nm}}{511\\,000\\ \\mathrm{eV}} = 2.43\\times10^{-3}\\ \\mathrm{nm} = 2.43\\ \\mathrm{pm}$.',
        'Detectors on opposite sides of the ring firing within a few nanoseconds mark a line through the annihilation point.'
      ],
      a: 'Two 511 keV photons (λ = 2.43 pm), back to back.'
    },
    {
      title: 'A gram of antimatter',
      q: 'How much energy is released when 1.0 g of antimatter annihilates with 1.0 g of matter? Compare it with a kilotonne of TNT ($4.18\\times10^{12}$ J).',
      steps: [
        'All 2.0 g becomes energy: $E = 2 m c^2 = 0.002 \\times (3.00\\times10^{8})^2 = 1.8\\times10^{14}\\ \\mathrm{J}$.',
        'In kilotonnes of TNT: $1.8\\times10^{14}/4.18\\times10^{12} = 43$.',
        'Fission of the same 2 g of uranium-235 would release about $1.6\\times10^{11}$ J — a thousand times less.'
      ],
      a: '1.8 × 10¹⁴ J, about 43 kilotonnes of TNT.'
    }
  ],
  quiz: [
    { q: 'What does a positron have in common with an electron?', choices: ['charge', 'mass', 'lepton number', 'magnetic moment direction'], a: 1, why: 'Antiparticles share mass, spin and lifetime; charge, lepton number and magnetic moment are reversed.' },
    { q: 'An electron and positron at rest annihilate. Why are there two photons rather than one?', choices: ['Each particle makes its own photon', 'A single photon would carry momentum, but the total momentum is zero', 'Photons always come in pairs', 'To conserve charge'], a: 1,
      why: 'A photon always carries momentum $E/c$. Only two (or more) photons in opposite directions can add up to zero momentum.' },
    { q: 'The minimum photon energy to create an electron–positron pair is…', choices: ['0.511 MeV', '1.022 MeV', '938 MeV', 'any energy'], a: 1, why: 'The photon must supply the rest energy of both particles: $2 \\times 0.511$ MeV (a nearby nucleus takes up the momentum).' },
    { q: 'Antihydrogen atoms fall upwards in the Earth\'s gravity.', a: false,
      why: 'In 2023 the ALPHA-g experiment at CERN saw antihydrogen fall downwards, with an acceleration consistent with ordinary $g$.' },
    { q: 'The universe today contains almost no antimatter because…', choices: ['antimatter decays into matter', 'a tiny excess of matter survived when matter and antimatter annihilated in the early universe', 'antimatter is hidden in black holes', 'antimatter was never created'], a: 1,
      why: 'About one extra particle per billion pairs survived annihilation. Why that excess arose is still not understood.' }
  ],
  applications: ['PET imaging of cancer, the heart and the brain.', 'Positron annihilation spectroscopy finds vacancies and defects in metals and semiconductors.', 'Antiproton and antihydrogen experiments test whether the laws of physics treat matter and antimatter alike.'],
  history: 'Dirac predicted the positron in 1928–31; Anderson found it in 1932 and shared the 1936 Nobel Prize. Emilio Segrè and Owen Chamberlain received the 1959 prize for the antiproton.'
},

{
  id: 'particle-accelerators', parent: 'particle-physics', title: 'Particle accelerators', level: 2,
  short: 'Machines that use electric fields to push charged particles to enormous energies and magnetic fields to steer them — to probe tiny distances, create heavy particles, treat cancer and make isotopes.',
  keywords: ['particle accelerator', 'cyclotron', 'synchrotron', 'linear accelerator', 'linac', 'collider', 'LHC', 'CERN', 'Van de Graaff', 'centre-of-mass energy', 'synchrotron radiation', 'proton therapy'],
  prereq: ['electric-potential', 'charged-particle-motion', 'relativistic-energy'],
  related: ['standard-model', 'quarks', 'antimatter', 'de-broglie-wavelength', 'x-rays'],
  body: `
Why build machines kilometres long to accelerate particles smaller than atoms? For two reasons. To **see** small things you need a short wavelength, and a particle's [[de-broglie-wavelength|de Broglie wavelength]] $\\lambda = h/p$ shrinks as its momentum grows: resolving a femtometre needs momenta of about 1 GeV/c. And to **make** heavy particles you need energy, since $E = mc^2$: a Higgs boson needs at least 125 GeV.

### Electric fields push, magnetic fields steer
A charge $q$ crossing a potential difference $V$ gains kinetic energy $qV$ (see [[electric-potential]]); an electron through 1 V gains 1 eV. The first accelerators — Cockcroft and Walton's voltage multiplier, Van de Graaff's belt generator — used a single large voltage, a few million volts at most before sparks jump. Everything since reuses a modest voltage many times.

- **Linear accelerators** pass particles through a row of cavities in which radio-frequency fields are timed so the particles always meet an accelerating push. Hospital linacs, a metre or two long, give electrons 4–25 MeV for radiotherapy; SLAC's 3 km linac reached 50 GeV.
- **Cyclotrons** (Ernest Lawrence, 1931) bend ions into a spiral with a constant [[charged-particle-motion|magnetic field]], kicking them across a gap twice per turn. The trick is that the time per orbit does not depend on the radius:

$$f = \\frac{qB}{2\\pi m}$$

so a fixed radio frequency stays in step as the ions spiral outwards — until relativity makes them heavier. Hospital cyclotrons accelerate protons to about 10–20 MeV to make PET isotopes, and 230–250 MeV for proton therapy.
- **Synchrotrons** keep particles on a fixed ring and ramp up the magnetic field as the momentum grows, since the radius of the orbit is $r = p/qB$. Particles pass the accelerating cavities millions of times.

### The Large Hadron Collider
CERN's LHC is a 27 km ring of 1232 superconducting dipole magnets, cooled to 1.9 K, that bend protons with 8.3 T fields. With a bending radius of 2.8 km that holds protons of 7 TeV/c momentum (it runs at 6.8 TeV): each proton travels only 3 m/s slower than light, going round 11 000 times a second.

### Why collide beams
Hitting a stationary target wastes most of the energy on moving the debris forward, because momentum must be conserved. What matters is the energy in the centre-of-momentum frame. Two beams of energy $E$ colliding head-on give $2E$; a beam hitting a fixed proton gives only about $\\sqrt{2 E\\, m c^2}$. A 6.8 TeV proton on a fixed target gives 113 GeV; two such protons colliding head-on give 13.6 TeV.

### The price of bending
A charge on a curved path radiates **synchrotron radiation**, and the loss per turn grows as the fourth power of the energy divided by the mass. Electrons, 1836 times lighter than protons, lose $10^{13}$ times more at the same energy, which is why the largest electron colliders are linear and the highest-energy rings accelerate protons. The same radiation, tamed, is the product of **synchrotron light sources**: brilliant X-ray beams for studying proteins, materials and paintings.

> [!fact] Of the roughly 30 000 accelerators in the world, only a handful are used for particle physics. Most implant ions into computer chips, sterilize products, make isotopes or treat cancer.
`,
  ideas: [
    'Accelerators push charges with electric fields (energy qV per pass) and steer them with magnetic fields.',
    'High momentum means short de Broglie wavelength, to see small structures; high energy creates heavy particles.',
    'In a cyclotron the orbit frequency qB/2πm does not depend on the radius.',
    'Synchrotrons ramp the magnetic field so particles stay on one ring: p = qBr.',
    'Colliding beams give far more usable energy than hitting a fixed target.'
  ],
  pitfalls: [
    'Accelerators make particles faster than light — Energy keeps rising, but the speed only creeps closer to c: LHC protons are 3 m/s short of it.',
    'A larger ring is needed because particles move faster — It is needed because the momentum is higher: at a given magnetic field the radius is proportional to p.',
    'Colliding a beam with a fixed target is as good as colliding two beams — Most of the energy goes into motion of the products; the useful energy grows only as the square root of the beam energy.'
  ],
  formulas: [
    {
      name: 'Kinetic energy from an accelerating voltage',
      expr: 'K = q*V',
      vars: {
        K: { name: 'kinetic energy gained', q: 'energy', unit: 'MeV' },
        q: { name: 'charge of the particle', q: 'charge', unit: 'e', value: 1 },
        V: { name: 'accelerating voltage', q: 'voltage', unit: 'MV', value: 5 }
      },
      stories: { K: 'A proton (charge {q}) falls through a potential difference of {V}. What kinetic energy does it gain?', V: 'What voltage would give a particle of charge {q} a kinetic energy of {K} in one step?' }
    },
    {
      name: 'Cyclotron frequency',
      expr: 'f = q*B/(2*pi*m)', tex: 'f = \\frac{q B}{2\\pi m}',
      vars: {
        f: { name: 'orbit frequency', q: 'frequency', unit: 'MHz' },
        q: { name: 'charge of the particle', q: 'charge', unit: 'e', value: 1 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1.5 },
        m: { name: 'mass of the particle', q: 'mass', unit: 'u', value: 1.00728 }
      },
      note: 'Non-relativistic: valid while the kinetic energy is small compared with $mc^2$ (938 MeV for a proton).',
      stories: { f: 'A cyclotron for protons (charge {q}, mass {m}) has a field of {B}. At what frequency must its accelerating voltage alternate?', B: 'What magnetic field makes protons (mass {m}) circle at {f}?' }
    },
    {
      name: 'Momentum of a particle bent in a magnetic field',
      expr: 'p = q*B*r',
      vars: {
        p: { name: 'momentum', q: 'momentum', unit: 'MeV/c' },
        q: { name: 'charge of the particle', q: 'charge', unit: 'e', value: 1 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 8.33 },
        r: { name: 'bending radius', q: 'length', unit: 'm', value: 2804 }
      },
      note: 'Holds relativistically. Defaults: the LHC dipoles, about $7\\times10^{6}$ MeV/c = 7 TeV/c. Handy form: $p\\,[\\mathrm{GeV}/c] = 0.3\\, B\\,[\\mathrm{T}]\\; r\\,[\\mathrm{m}]$.',
      stories: { p: 'A ring bends particles of charge {q} on a radius of {r} with {B} magnets. What momentum can it hold?', B: 'What field is needed to bend protons of momentum {p} on a radius of {r}?' }
    },
    {
      name: 'Collision energy on a fixed target',
      expr: 'Ecm = sqrt(2*E*E0)', tex: 'E_\\mathrm{cm} = \\sqrt{2 E E_0}',
      vars: {
        Ecm: { name: 'energy available in the centre-of-momentum frame', q: 'energy', unit: 'GeV', tex: 'E_\\mathrm{cm}' },
        E: { name: 'beam energy', q: 'energy', unit: 'GeV', value: 6800 },
        E0: { name: 'rest energy of the target particle', q: 'energy', unit: 'GeV', value: 0.938, tex: 'E_0' }
      },
      note: 'Approximation for beam energies far above the rest energies. Two beams of energy $E$ colliding head-on give $2E$.',
      stories: { Ecm: 'A {E} proton beam strikes protons at rest (rest energy {E0}). How much energy is available for making new particles?', E: 'What beam energy on a fixed proton target (rest energy {E0}) gives a collision energy of {Ecm}?' }
    }
  ],
  examples: [
    {
      title: 'Holding 7 TeV protons',
      q: 'The LHC dipoles give 8.33 T along a bending radius of 2804 m. What proton momentum can the ring hold?',
      steps: [
        '$p = qBr = 1.602\\times10^{-19} \\times 8.33 \\times 2804 = 3.74\\times10^{-15}\\ \\mathrm{kg\\,m/s}$.',
        'In particle units: $1\\ \\mathrm{GeV}/c = 5.34\\times10^{-19}\\ \\mathrm{kg\\,m/s}$, so $p = 7.0\\times10^{3}\\ \\mathrm{GeV}/c$.',
        'Or quickly: $0.2998 \\times 8.33 \\times 2804 = 7000\\ \\mathrm{GeV}/c$.'
      ],
      a: 'About 7 TeV/c.'
    },
    {
      title: 'A cyclotron for PET isotopes',
      q: 'A hospital cyclotron with a 1.5 T field accelerates protons. At what frequency must the voltage alternate, and what radius do 16 MeV protons reach?',
      steps: [
        '$f = \\dfrac{qB}{2\\pi m} = \\dfrac{1.602\\times10^{-19} \\times 1.5}{2\\pi \\times 1.673\\times10^{-27}} = 22.9\\ \\mathrm{MHz}$ — a radio frequency.',
        'Speed at 16 MeV: $v = \\sqrt{2K/m} = \\sqrt{2 \\times 16 \\times 1.602\\times10^{-13}/1.673\\times10^{-27}} = 5.5\\times10^{7}\\ \\mathrm{m/s}$ (0.18 c, so still nearly classical).',
        'Radius: $r = mv/qB = \\dfrac{1.673\\times10^{-27} \\times 5.5\\times10^{7}}{1.602\\times10^{-19} \\times 1.5} = 0.38\\ \\mathrm{m}$.'
      ],
      a: '22.9 MHz; the protons leave at a radius of about 0.4 m.'
    },
    {
      title: 'Collider or fixed target?',
      q: 'Compare the collision energy of a 6.8 TeV proton beam hitting protons at rest with two 6.8 TeV beams colliding head-on.',
      steps: [
        'Fixed target: $E_\\mathrm{cm} \\approx \\sqrt{2 \\times 6800 \\times 0.938} = 113\\ \\mathrm{GeV}$.',
        'Head-on: $E_\\mathrm{cm} = 2 \\times 6800 = 13\\,600\\ \\mathrm{GeV}$.',
        'The collider makes 120 times more energy available — enough to produce Higgs bosons, which the fixed target could never do.'
      ],
      a: '113 GeV against 13.6 TeV.'
    }
  ],
  quiz: [
    { q: 'In a cyclotron, as the ions speed up, the time for one orbit…', choices: ['gets shorter', 'gets longer', 'stays the same (until relativity matters)', 'drops to zero'], a: 2,
      why: 'The radius grows in proportion to the speed, so the time per turn $2\\pi m/qB$ does not change. That is what lets a fixed radio frequency keep accelerating them.' },
    { q: 'Why do the most powerful circular colliders accelerate protons rather than electrons?', choices: ['Protons are easier to produce', 'Electrons lose far more energy to synchrotron radiation', 'Electrons cannot be accelerated in rings', 'Protons have more charge'], a: 1,
      why: 'Radiation losses scale as $(E/m)^4$; electrons are 1836 times lighter, so at the same energy they radiate about $10^{13}$ times more.' },
    { q: 'Why are colliders built instead of firing beams at fixed targets?', choices: ['Targets would melt', 'Much more of the energy is available to create new particles', 'Fixed targets are radioactive', 'The beams are easier to aim'], a: 1,
      why: 'Momentum conservation forces fixed-target products to keep moving, locking up energy; in a head-on collision the total momentum is zero.' },
    { q: 'At the LHC, protons are accelerated to speeds above the speed of light.', a: false,
      why: 'Their energy is 7000 times their rest energy, but their speed is 0.999999991 c — about 3 m/s less than light.' },
    { q: 'An electron is accelerated from rest through 20 kV. Its kinetic energy is…', choices: ['20 eV', '20 keV', '20 MeV', '3.2 × 10⁻¹⁵ eV'], a: 1, why: '$K = qV$: one elementary charge through 20 000 V gains 20 000 eV $= 3.2 \\times 10^{-15}$ J.' }
  ],
  applications: ['Radiotherapy linacs and proton-therapy cyclotrons in hospitals.', 'Cyclotrons producing fluorine-18 and other isotopes for PET.', 'Ion implanters that dope silicon for computer chips.', 'Synchrotron light sources for protein crystallography and materials science.'],
  history: 'Cockcroft and Walton split lithium with 400 keV protons in 1932, the same year Lawrence\'s early cyclotrons reached 1 MeV. The LHC began colliding protons in 2010.'
}

);
