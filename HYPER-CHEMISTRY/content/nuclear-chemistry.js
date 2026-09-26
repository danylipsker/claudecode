/* HYPER-CHEMISTRY · content/nuclear-chemistry.js — which nuclei are stable and how
 * the others decay, nuclear equations, half-life and activity, and the energy of
 * fission and fusion. The nuclear physics is in Hyper Physics. */
Hyper.add(

{
  id: 'nuclear-stability', parent: 'nuclear-chemistry', title: 'Nuclear stability and decay modes', level: 2,
  short: 'A nucleus is stable only with the right balance of neutrons and protons. Nuclides off the band of stability decay — by alpha, beta-minus, beta-plus or electron capture — towards it.',
  keywords: ['nuclear stability', 'band of stability', 'belt of stability', 'N/Z ratio', 'neutron to proton ratio', 'magic numbers', 'strong force', 'binding energy', 'mass defect', 'alpha decay', 'beta decay', 'positron emission', 'electron capture', 'gamma emission', 'chart of nuclides'],
  prereq: ['isotopes', 'physics:strong-force', 'physics:binding-energy'],
  related: ['nuclear-equations', 'radioactive-half-life', 'fission-fusion', 'physics:nuclear-structure', 'physics:radioactive-decay', 'physics:mass-energy'],
  body: `
About 3300 different nuclides are known, but only about 250 are stable. The rest fall apart, some in microseconds, some over billions of years. Which ones survive is decided by a tug of war inside the nucleus.

### The tug of war
All nucleons attract one another through the **strong force**, which is enormously strong but reaches only 1–2 fm, so each nucleon feels just its nearest neighbours. Protons also repel one another electrically, and that repulsion reaches across the whole nucleus. Neutrons add strong-force glue without adding repulsion, so the heavier the nucleus, the more neutrons it needs per proton:

- light nuclei are stable with $N \\approx Z$: $\\ce{^{4}He}$, $\\ce{^{12}C}$, $\\ce{^{16}O}$, and $\\ce{^{40}Ca}$, the heaviest with $N = Z$;
- iron-56 has $N/Z = 1.15$, tin-120 1.40, lead-208 1.54.

On a chart of $N$ against $Z$ the stable nuclides form a narrow **band of stability** that curves away from the line $N = Z$. Beyond bismuth ($Z = 83$) the band ends: every heavier element is radioactive, and two lighter ones, technetium ($Z = 43$) and promethium ($Z = 61$), have no stable isotope either.

### Where a nuclide sits tells you how it decays
Decays move a nuclide towards the band:
- **Too many neutrons** (above the band): **beta-minus decay**. A neutron turns into a proton, emitting an electron and an antineutrino. $Z$ rises by 1, $N$ falls by 1. Carbon-14, iodine-131, caesium-137 and most fission products decay this way.
- **Too few neutrons** (below the band): a proton turns into a neutron, either by **positron emission** (beta-plus) or by **electron capture** of an inner electron. $Z$ falls by 1. Fluorine-18 and potassium-40 (in part) do this.
- **Too heavy** ($Z > 83$, and some lighter ones): **alpha decay**, the emission of a helium-4 nucleus, which lowers $Z$ and $N$ by 2 each. Uranium, radium, polonium and americium are alpha emitters.
- **Gamma emission** does not change $Z$ or $N$: an excited nucleus, usually left behind by one of the decays above, drops to its ground state and emits a high-energy photon. The very heaviest nuclei can also split by **spontaneous fission**.

Explore the band, and the decay each nuclide undergoes, in the simulation below.

### Patterns inside the band
- **Pairing**: about 150 stable nuclides have even $Z$ and even $N$, while only four light ones have both odd ($\\ce{^{2}H}$, $\\ce{^{6}Li}$, $\\ce{^{10}B}$, $\\ce{^{14}N}$). Paired nucleons, like paired electrons, lower the energy.
- **Magic numbers**: nuclei with 2, 8, 20, 28, 50, 82 or 126 protons or neutrons are especially stable — filled nuclear shells, the counterpart of noble-gas configurations. Tin ($Z = 50$) has ten stable isotopes, more than any other element; lead-208, with 82 protons and 126 neutrons, is "doubly magic" and is where the thorium decay chain ends.

### Binding energy
A nucleus weighs less than its separate protons and neutrons. The missing mass, the **mass defect**, is the **binding energy** $E_B = \\Delta m\\,c^2$ that would be needed to pull it apart. With atomic masses in u,
$$E_B = \\left(Z m_\\mathrm{H} + N m_n - m_\\text{atom}\\right) c^2, \\qquad 1\\ \\mathrm{u}\\,c^2 = 931.5\\ \\mathrm{MeV}$$
Helium-4 is 0.0304 u lighter than two hydrogen atoms and two neutrons: 28.3 MeV. Per nucleon, the binding energy rises steeply to about 8.8 MeV around iron and nickel and then falls slowly to 7.6 MeV for uranium — the curve that makes [[fission-fusion|fission and fusion]] release energy. A chemical bond is worth a few electronvolts; a nuclear binding energy is a few *million* electronvolts per nucleon. That factor of a million is the whole difference between a lump of coal and a fuel pellet.
`,
  ideas: [
    'The strong force binds all nucleons over short range; proton–proton repulsion acts across the whole nucleus.',
    'Stable nuclides lie in a band that starts at N ≈ Z and bends to N/Z ≈ 1.5 for lead; nothing beyond bismuth is stable.',
    'Neutron-rich nuclides undergo β⁻ decay; proton-rich ones β⁺ decay or electron capture; very heavy ones α decay.',
    'Even numbers of protons and neutrons, and the magic numbers 2, 8, 20, 28, 50, 82, 126, favour stability.',
    'Binding energy is the mass defect times c²; per nucleon it peaks near iron at about 8.8 MeV.'
  ],
  pitfalls: [
    'Stable nuclei have equal numbers of protons and neutrons — Only light ones. Heavier nuclei need an excess of neutrons to dilute the proton repulsion: lead-208 has 126 neutrons for 82 protons.',
    'Beta-minus particles come from the electron cloud — The electron is created in the nucleus when a neutron turns into a proton. The atom\'s electrons are not involved (electron capture is the process that does use one).',
    'Adding neutrons always makes a nucleus more stable — Too many neutrons is as unstable as too few: carbon-14, with two extra neutrons, is radioactive.'
  ],
  formulas: [
    {
      name: 'Nuclear binding energy from the atomic mass',
      expr: 'EB = (Z*mH + N*mn - m)*c^2', tex: 'E_B = \\left(Z m_\\mathrm{H} + N m_n - m\\right) c^2',
      vars: {
        EB: { name: 'binding energy of the nucleus', q: 'energy', unit: 'MeV', tex: 'E_B' },
        Z: { name: 'number of protons', int: true, value: 2, tex: 'Z' },
        mH: { name: 'mass of a hydrogen-1 atom', q: 'mass', unit: 'u', value: 1.00782503, fixed: true, tex: 'm_\\mathrm{H}' },
        N: { name: 'number of neutrons', int: true, value: 2, tex: 'N' },
        mn: { name: 'mass of a neutron', q: 'mass', unit: 'u', value: 1.00866492, fixed: true, tex: 'm_n' },
        m: { name: 'atomic mass of the nuclide', q: 'mass', unit: 'u', value: 4.00260325, tex: 'm' },
        c: { const: 'c' }
      },
      note: 'Hydrogen-atom masses rather than proton masses, so that the electrons cancel against the atomic mass. Divide by $A = Z + N$ for the binding energy per nucleon. Default: helium-4, 28.3 MeV.',
      practice: { unknowns: ['EB'] },
      stories: {
        EB: 'An atom with {Z} protons and {N} neutrons has an atomic mass of {m}. What is the binding energy of its nucleus?'
      }
    },
    {
      name: 'Most stable atomic number for a mass number',
      expr: 'Z = A/(1.98 + 0.0155*A^(2/3))', tex: 'Z \\approx \\frac{A}{1.98 + 0.0155\\,A^{2/3}}',
      vars: {
        Z: { name: 'atomic number at the centre of the band of stability', tex: 'Z' },
        A: { name: 'mass number', int: true, value: 208, tex: 'A' }
      },
      note: 'From the liquid-drop model of the nucleus: the balance between the asymmetry term, which favours $N = Z$, and the Coulomb term, which favours neutrons. Default: $A = 208$, giving 82.4 — lead.',
      practice: { unknowns: ['Z'] },
      stories: {
        Z: 'Around which atomic number do the stable nuclides of mass number {A} lie?'
      }
    }
  ],
  examples: [
    {
      title: 'Binding energy of iron-56',
      q: 'The atomic mass of iron-56 is 55.934936 u. Find its binding energy and its binding energy per nucleon. ($m_\\mathrm{H} = 1.007825$ u, $m_n = 1.008665$ u.)',
      steps: [
        'Iron has $Z = 26$, so $N = 30$. Mass of the parts: $26 \\times 1.007825 + 30 \\times 1.008665 = 56.463400$ u.',
        'Mass defect: $56.463400 - 55.934936 = 0.528464$ u.',
        '$E_B = 0.528464 \\times 931.494 = 492.3$ MeV, or $492.3/56 = 8.79$ MeV per nucleon — near the top of the curve.'
      ],
      a: '492 MeV in all, 8.79 MeV per nucleon.'
    },
    {
      title: 'Predicting decay modes',
      q: 'Predict how each decays: (a) phosphorus-32; (b) carbon-11; (c) radium-226. (Stable isotopes: phosphorus-31, carbon-12 and -13; radium has none.)',
      steps: [
        '(a) Phosphorus-32 has one neutron more than stable phosphorus-31: neutron-rich, so **β⁻** decay, to sulfur-32.',
        '(b) Carbon-11 has 5 neutrons for 6 protons, fewer than any stable carbon: proton-rich, so **β⁺** decay (or electron capture), to boron-11.',
        '(c) Radium ($Z = 88$) is beyond bismuth, so **α** decay, to radon-222.'
      ],
      a: 'P-32: β⁻; C-11: β⁺/EC; Ra-226: α.'
    }
  ],
  quiz: [
    { q: 'Why do heavy stable nuclei have more neutrons than protons?', choices: ['neutrons are lighter than protons', 'neutrons add strong-force attraction without adding electrical repulsion', 'protons decay into neutrons over time', 'the electrons need neutrons to orbit'], a: 1,
      why: 'Proton–proton repulsion grows with the square of the number of protons and reaches across the whole nucleus, while the strong force acts only between neighbours. Extra neutrons dilute the repulsion.' },
    { q: 'A nuclide lies above the band of stability (too many neutrons for its protons). How does it most likely decay?', choices: ['α emission', 'β⁻ emission', 'positron emission', 'electron capture'], a: 1,
      why: 'β⁻ decay turns a neutron into a proton, lowering N and raising Z — straight towards the band.' },
    { q: 'Helium-4 (4.002603 u) is made of two hydrogen atoms (1.007825 u each) and two neutrons (1.008665 u each). What is its binding energy in MeV?', answer: 28.3, unit: 'MeV',
      why: 'Mass defect: $2(1.007825) + 2(1.008665) - 4.002603 = 0.030377$ u. Times 931.5 MeV/u: 28.3 MeV, about 7.1 MeV per nucleon.' },
    { q: 'Every element with an atomic number above 83 is radioactive.', a: true,
      why: 'Beyond bismuth the proton repulsion is too large for any combination of neutrons to hold the nucleus together indefinitely. (Bismuth-209 itself decays, with a half-life of about 2 × 10¹⁹ years, a billion times the age of the universe.)' },
    { q: 'Which nucleus is "doubly magic"?', choices: ['carbon-12', 'iron-56', 'lead-208', 'uranium-238'], a: 2,
      why: 'Lead-208 has 82 protons and 126 neutrons, both magic numbers. It is the end point of the thorium decay chain and one of the most tightly bound heavy nuclei.' }
  ],
  applications: ['Choosing isotopes for medicine and industry by their decay mode: β⁺ emitters for PET, γ emitters for imaging, α emitters for smoke detectors and targeted therapy.', 'Predicting which fission products will be radioactive, and how.', 'Nuclear mass tables in reactor and astrophysics calculations.'],
  sim: 'atom-stability'
},

{
  id: 'nuclear-equations', parent: 'nuclear-chemistry', title: 'Nuclear equations', level: 1,
  short: 'A nuclear equation shows a decay or a nuclear reaction. Mass numbers and atomic numbers must balance on both sides — but, unlike a chemical equation, the elements themselves change.',
  keywords: ['nuclear equation', 'alpha particle', 'beta particle', 'positron', 'electron capture', 'gamma ray', 'neutron', 'transmutation', 'decay chain', 'Q-value', 'mass number', 'atomic number', 'balancing'],
  prereq: ['nuclear-stability', 'chemical-equations'],
  related: ['radioactive-half-life', 'fission-fusion', 'physics:q-value', 'physics:nuclear-reactions', 'physics:antimatter'],
  body: `
In a chemical reaction the atoms are only rearranged: the same elements appear on both sides. In a nuclear reaction the nucleus itself changes, so one element turns into another — the transmutation the alchemists dreamt of. A **nuclear equation** records it with each nuclide written with its mass number $A$ above and atomic number $Z$ below the symbol, and it balances two things:

- the **sum of mass numbers** (nucleons are not created or destroyed);
- the **sum of atomic numbers** (charge is conserved).

### The particles
| particle | symbol | $A$ | $Z$ |
|---|---|---|---|
| alpha | $\\ce{^{4}_{2}He}$ or $\\alpha$ | 4 | 2 |
| beta-minus (electron) | $\\ce{^{0}_{-1}e}$ or $\\beta^-$ | 0 | −1 |
| positron | $\\ce{^{0}_{+1}e}$ or $\\beta^+$ | 0 | +1 |
| neutron | $\\ce{^{1}_{0}n}$ | 1 | 0 |
| proton | $\\ce{^{1}_{1}p}$ or $\\ce{^{1}_{1}H}$ | 1 | 1 |
| gamma photon | $\\gamma$ | 0 | 0 |

### The four common decays
- **Alpha**: $\\ce{^{238}_{92}U -> ^{234}_{90}Th + ^{4}_{2}He}$. $A$ falls by 4, $Z$ by 2.
- **Beta-minus**: $\\ce{^{14}_{6}C -> ^{14}_{7}N + ^{0}_{-1}e} + \\bar\\nu_e$. $A$ unchanged, $Z$ up by 1.
- **Beta-plus**: $\\ce{^{18}_{9}F -> ^{18}_{8}O + ^{0}_{+1}e} + \\nu_e$. $Z$ down by 1. The positron meets an electron almost at once and both vanish into two 511 keV gamma photons flying apart — which a PET scanner detects.
- **Electron capture**: $\\ce{^{40}_{19}K + ^{0}_{-1}e -> ^{40}_{18}Ar} + \\nu_e$. The same change as beta-plus, using an inner electron. Much of the argon in the air came from potassium-40 this way.

Gamma emission changes neither number: technetium-99m, the workhorse of medical imaging, relaxes to technetium-99 by emitting a 140 keV photon. Neutrinos carry no charge and almost no mass, so they do not affect the balance, but they carry off part of the energy of beta decay.

### Decay chains
A heavy nucleus often needs several steps to reach stability. Uranium-238 ends as lead-206 after 8 alpha and 6 beta-minus decays: $A$ falls by $8 \\times 4 = 32$ (238 → 206), and $Z$ changes by $-16 + 6 = -10$ (92 → 82). Radium-226 and radon-222 are links in this chain, which is why radon seeps from granite and uranium-bearing soils into basements.

### Nuclear reactions and making isotopes
Bombarding nuclei with particles makes new ones. Rutherford made the first artificial transmutation in 1919, $\\ce{^{14}_{7}N + ^{4}_{2}He -> ^{17}_{8}O + ^{1}_{1}H}$; Chadwick found the neutron in 1932 from $\\ce{^{9}_{4}Be + ^{4}_{2}He -> ^{12}_{6}C + ^{1}_{0}n}$. Today reactors and cyclotrons make isotopes to order — molybdenum-99 for technetium generators, fluorine-18 for PET from $\\ce{^{18}_{8}O + ^{1}_{1}H -> ^{18}_{9}F + ^{1}_{0}n}$ (written compactly $\\ce{^{18}O}$(p, n)$\\ce{^{18}F}$), cobalt-60 for sterilising medical supplies from $\\ce{^{59}Co}$(n, γ)$\\ce{^{60}Co}$.

### How much energy
The energy released, the **Q-value**, comes from the mass lost:
$$Q = \\left(\\textstyle\\sum m_\\text{before} - \\sum m_\\text{after}\\right) c^2, \\qquad 1\\ \\mathrm{u}\\,c^2 = 931.5\\ \\mathrm{MeV}$$
With atomic masses the electrons balance automatically for alpha and beta-minus decay (for beta-plus, subtract two electron masses, 1.022 MeV). Uranium-238's alpha decay has $Q = 4.27$ MeV. Since momentum is conserved and the alpha particle is light, it takes most of it: $K_\\alpha = Q\\,(A-4)/A = 4.20$ MeV, the energy measured in the lab. Rutherford's reaction, by contrast, has $Q = -1.19$ MeV: it only works because the alpha particles bring in that energy.
`,
  ideas: [
    'Nuclear equations conserve the total mass number and the total atomic number.',
    'Alpha decay lowers A by 4 and Z by 2; β⁻ raises Z by 1; β⁺ and electron capture lower Z by 1; γ changes neither.',
    'Decay chains take heavy nuclei through several steps to a stable end, such as uranium-238 to lead-206.',
    'Bombarding nuclei with neutrons, protons or alpha particles makes new isotopes on purpose.',
    'The energy released is Q = Δm c², with 1 u equivalent to 931.5 MeV.'
  ],
  pitfalls: [
    'Balance the atoms of each element, as in chemistry — The elements change. Balance the mass numbers and the atomic numbers instead.',
    'In β⁻ decay the mass number drops by one because an electron leaves — An electron has A = 0. The mass number is unchanged; one neutron has become a proton.',
    'Gamma emission changes the element — A gamma photon has A = 0 and Z = 0; the nucleus only loses energy.'
  ],
  formulas: [
    {
      name: 'Energy released from the mass lost',
      expr: 'Q = dm*c^2', tex: 'Q = \\Delta m\\, c^2',
      vars: {
        Q: { name: 'energy released (Q-value)', q: 'energy', unit: 'MeV', tex: 'Q' },
        dm: { name: 'mass lost in the reaction', q: 'mass', unit: 'u', value: 0.0052288, tex: '\\Delta m' },
        c: { const: 'c' }
      },
      note: 'Δm is the sum of the atomic masses before minus the sum after. Default: the alpha decay of radium-226, $226.025410 - 222.017578 - 4.002603$ u.',
      stories: {
        Q: 'In the alpha decay of radium-226, the products are lighter than the parent atom by {dm}. How much energy is released?',
        dm: 'A nuclear decay releases {Q}. How much mass disappears?'
      }
    },
    {
      name: 'Kinetic energy of the alpha particle',
      expr: 'Ka = Q*(A - 4)/A', tex: 'K_\\alpha = Q\\,\\frac{A - 4}{A}',
      vars: {
        Ka: { name: 'kinetic energy of the alpha particle', q: 'energy', unit: 'MeV', tex: 'K_\\alpha' },
        Q: { name: 'Q-value of the decay', q: 'energy', unit: 'MeV', value: 4.270, tex: 'Q' },
        A: { name: 'mass number of the parent', int: true, value: 238, tex: 'A' }
      },
      note: 'Momentum conservation shares $Q$ between the alpha particle and the recoiling daughter in inverse proportion to their masses. Default: uranium-238.',
      practice: { unknowns: ['Ka', 'Q'] },
      stories: {
        Ka: 'A nucleus of mass number {A} undergoes alpha decay with a Q-value of {Q}. What kinetic energy does the alpha particle carry?',
        Q: 'Alpha particles from a nuclide of mass number {A} are measured at {Ka}. What is the Q-value of the decay?'
      }
    }
  ],
  examples: [
    {
      title: 'Completing nuclear equations',
      q: 'Identify X: (a) $\\ce{^{226}_{88}Ra -> X + ^{4}_{2}He}$; (b) $\\ce{^{131}_{53}I -> X + ^{0}_{-1}e}$; (c) $\\ce{^{27}_{13}Al + ^{4}_{2}He -> ^{30}_{15}P + X}$.',
      steps: [
        '(a) $A$: $226 - 4 = 222$; $Z$: $88 - 2 = 86$, radon. X is $\\ce{^{222}_{86}Rn}$.',
        '(b) $A$: 131; $Z$: $53 + 1 = 54$, xenon. X is $\\ce{^{131}_{54}Xe}$.',
        '(c) $A$: $27 + 4 - 30 = 1$; $Z$: $13 + 2 - 15 = 0$. X is a neutron, $\\ce{^{1}_{0}n}$. (This is how Irène Curie and Frédéric Joliot made the first artificial radioactive isotope in 1934.)'
      ],
      a: '(a) Rn-222; (b) Xe-131; (c) a neutron.'
    },
    {
      title: 'Energy of an alpha decay',
      q: 'Polonium-210 (209.982874 u) decays to lead-206 (205.974465 u) and an alpha particle (helium-4, 4.002603 u). Find Q and the energy of the alpha particle.',
      steps: [
        'Mass lost: $209.982874 - 205.974465 - 4.002603 = 0.005806$ u.',
        '$Q = 0.005806 \\times 931.5 = 5.41$ MeV.',
        '$K_\\alpha = 5.41 \\times 206/210 = 5.30$ MeV. With a half-life of 138 days, a milligram of polonium-210 gives off about 0.14 W of heat — which is why it served as a compact heat source in early spacecraft, and why it is so deadly if swallowed.'
      ],
      a: 'Q = 5.41 MeV; the alpha particle carries 5.30 MeV.'
    }
  ],
  quiz: [
    { q: 'Thorium-234 ($Z = 90$) emits a beta-minus particle. What is formed?', choices: ['$\\ce{^{234}_{91}Pa}$', '$\\ce{^{234}_{89}Ac}$', '$\\ce{^{230}_{88}Ra}$', '$\\ce{^{233}_{90}Th}$'], a: 0,
      why: 'β⁻ decay keeps A and raises Z by one: 234, 91 — protactinium-234, the next link in the uranium-238 chain.' },
    { q: 'How many alpha particles are emitted when thorium-232 decays through its chain to lead-208?', answer: 6,
      why: 'Only alpha decay changes A, by 4 each time: $(232 - 208)/4 = 6$. Then $Z$ would fall by 12, from 90 to 78; lead is 82, so 4 β⁻ decays are needed as well.' },
    { q: 'Which decay does not change the atomic number?', choices: ['alpha', 'beta-minus', 'electron capture', 'gamma'], a: 3,
      why: 'A gamma photon has no charge and no mass number; it only removes excitation energy from the nucleus.' },
    { q: 'In $\\ce{^{59}_{27}Co + ^{1}_{0}n -> X}$, X is cobalt-60.', a: true,
      why: 'Mass numbers: 59 + 1 = 60; atomic numbers: 27 + 0 = 27, cobalt. Neutron capture makes a heavier isotope of the same element; cobalt-60 is then a β⁻ emitter used for radiotherapy and sterilisation.' },
    { q: 'Carbon-14 (14.003242 u) decays to nitrogen-14 (14.003074 u). About how much energy is released, in keV?', answer: 156, unit: 'keV',
      why: 'For β⁻ decay with atomic masses, $Q = (14.003242 - 14.003074) \\times 931.5\\ \\mathrm{MeV} = 0.156$ MeV = 156 keV, shared between the electron and the antineutrino.' }
  ],
  applications: ['Producing medical isotopes: Tc-99m generators, F-18 for PET, I-131 for thyroid therapy.', 'Sterilising medical supplies and food with Co-60 gamma rays.', 'Tracing radon from the uranium chain in buildings.', 'Neutron activation analysis of trace elements in forensics and archaeology.'],
  history: 'Rutherford and Soddy recognised radioactive decay as transmutation in 1902. Rutherford made the first artificial transmutation in 1919, and Irène Curie and Frédéric Joliot the first artificial radioactive isotope, phosphorus-30, in 1934.',
  sim: { id: 'atom-stability', params: { z: 92, n: 146 } }
},

{
  id: 'radioactive-half-life', parent: 'nuclear-chemistry', title: 'Radioactive decay and half-life', level: 2,
  short: 'Radioactive nuclei decay at random, each with the same chance per second. The result is exponential decay: whatever the starting amount, half is left after one half-life, a quarter after two.',
  keywords: ['half-life', 'radioactive decay', 'decay constant', 'activity', 'becquerel', 'curie', 'exponential decay', 'first order', 'radiocarbon dating', 'carbon-14', 'radiometric dating', 'medical isotopes', 'nuclear waste'],
  prereq: ['nuclear-equations', 'math:exponential-growth-decay', 'math:logarithms', 'physics:half-life'],
  related: ['reaction-half-life', 'integrated-rate-laws', 'physics:activity', 'physics:radiocarbon-dating', 'physics:radiation-dose', 'math:exponential-distribution'],
  body: `
Pick one atom of iodine-131 and ask when it will decay. There is no answer: it might go in the next second or in a month. What *is* fixed is the probability — each nucleus has the same chance, $\\lambda$, of decaying in each second, regardless of how long it has already existed, of its chemical form, or of the temperature. A nucleus does not age.

With many nuclei, the randomness averages out. The number decaying per second is proportional to the number present, $dN/dt = -\\lambda N$, and that gives an **exponential decay**:
$$N = N_0\\, e^{-\\lambda t} = N_0 \\left(\\tfrac12\\right)^{t/t_{1/2}}$$
The **half-life** $t_{1/2}$ is the time for half of any sample to decay:
$$t_{1/2} = \\frac{\\ln 2}{\\lambda}$$
After one half-life half is left, after two a quarter, after ten less than a thousandth ($2^{-10} = 1/1024$). This is exactly a [[integrated-rate-laws|first-order]] process in chemical kinetics — nuclear decay is the purest example of one ([[reaction-half-life]]).

### Activity
What a detector counts is the **activity**, the number of decays per second:
$$A = \\lambda N$$
Its unit is the becquerel, 1 Bq = one decay per second; the older curie, 1 Ci = $3.7\\times10^{10}$ Bq, was the activity of a gram of radium-226. Activity is proportional to $N$, so it too halves every half-life. For a given number of atoms, a short half-life means a fierce activity that is soon over, a long one a feeble activity that lasts: gram for gram, fluorine-18 is about $3\\times10^{14}$ times more active than uranium-238.

| nuclide | half-life | used for |
|---|---|---|
| polonium-214 | 164 µs | (a link in the uranium chain) |
| fluorine-18 | 109.8 min | PET scans |
| technetium-99m | 6.01 h | medical imaging |
| iodine-131 | 8.02 days | thyroid treatment |
| cobalt-60 | 5.27 years | radiotherapy, sterilising |
| caesium-137 | 30.1 years | a major fission product |
| carbon-14 | 5730 years | radiocarbon dating |
| uranium-238 | $4.47\\times10^{9}$ years | dating rocks, nuclear fuel |

### Radiocarbon dating
Cosmic-ray neutrons turn nitrogen in the upper air into carbon-14, which mixes into the carbon dioxide that plants take up. Everything alive therefore carries carbon-14 at a steady level, about 0.23 Bq per gram of carbon. At death the intake stops and the carbon-14 decays with its 5730-year half-life, so the remaining activity dates the sample:
$$t = t_{1/2}\\,\\log_2\\frac{A_0}{A}$$
The method reaches back about 50 000 years (nine half-lives); beyond that too little is left. Because the atmospheric level has varied, raw ages are corrected with calibration curves built from tree rings and cave deposits. For rocks, the much longer half-lives of potassium-40 and uranium-238 play the same role: uranium–lead dating of meteorites gives the age of the Earth, 4.54 billion years.

### Half-lives in practice
- **Hospitals**: fluorine-18 must be made in a cyclotron near the scanner and injected within hours. Technetium-99m is "milked" daily from a generator containing its parent, molybdenum-99 (half-life 66 h), shipped weekly.
- **Nuclear waste**: caesium-137 and strontium-90, with 30-year half-lives, dominate the heat and radiation of spent fuel for centuries; 300 years (ten half-lives) cut them a thousandfold. Plutonium-239 (24 100 years) is the long-term problem.
- **Accidents**: iodine-131 is the main early danger after a reactor release, but with an 8-day half-life it is essentially gone in three months; potassium iodide tablets saturate the thyroid so that it does not absorb it.
`,
  ideas: [
    'Each nucleus decays at random with a fixed probability per unit time λ, unaffected by chemistry or temperature.',
    'Large numbers of nuclei decay exponentially: N = N₀(½)^(t/t½).',
    't½ = ln 2 / λ; after n half-lives a fraction (½)ⁿ remains.',
    'Activity A = λN, in becquerels, halves every half-life too.',
    'Radiocarbon and other radiometric clocks read ages from how much of a parent isotope is left.'
  ],
  pitfalls: [
    'After two half-lives the sample is gone — Half is left after one, a quarter after two, an eighth after three. The amount approaches zero but, for a large sample, never reaches it in any practical time.',
    'Heating or dissolving a radioactive substance changes its half-life — Nuclear decay is essentially independent of temperature, pressure and chemical bonding (electron capture is changed by well under 1 %).',
    'A nucleus that has survived a long time is "due" to decay — Nuclei have no memory. The chance of decaying in the next second is the same for a nucleus made a second ago and one made a billion years ago.'
  ],
  formulas: [
    {
      name: 'Amount remaining after a time t',
      expr: 'N = N0*(1/2)^(t/th)', tex: 'N = N_0 \\left(\\tfrac12\\right)^{t/t_{1/2}}',
      vars: {
        N: { name: 'amount remaining', q: 'mass', unit: 'mg', tex: 'N' },
        N0: { name: 'amount at the start', q: 'mass', unit: 'mg', value: 100, tex: 'N_0' },
        t: { name: 'time elapsed', q: 'time', unit: 'day', value: 24, tex: 't' },
        th: { name: 'half-life', q: 'time', unit: 'day', value: 8.02, tex: 't_{1/2}' }
      },
      note: 'Works the same for a mass, a number of atoms or an activity. Defaults: iodine-131 after 24 days, three half-lives, 12.5 % left.',
      practice: { unknowns: ['N', 't', 'th'] },
      stories: {
        N: 'A hospital receives {N0} of iodine-131 (half-life {th}). How much is left after {t}?',
        t: 'A sample of wood contains only {N} for every {N0} of carbon-14 that living wood contains. Carbon-14 has a half-life of {th}. How old is the wood?',
        th: 'A {N0} sample of a radioactive isotope has decayed to {N} after {t}. What is its half-life?'
      }
    },
    {
      name: 'Decay constant and half-life',
      expr: 'lambda = ln(2)/th', tex: '\\lambda = \\frac{\\ln 2}{t_{1/2}}',
      vars: {
        lambda: { name: 'decay constant', q: 'decayconst', unit: '1/yr', tex: '\\lambda' },
        th: { name: 'half-life', q: 'time', unit: 'yr', value: 5730, tex: 't_{1/2}' }
      },
      note: 'λ is the probability per unit time that a given nucleus decays. Default: carbon-14.',
      stories: {
        lambda: 'What is the decay constant of an isotope with a half-life of {th}?',
        th: 'An isotope has a decay constant of {lambda}. What is its half-life?'
      }
    },
    {
      name: 'Activity of a mass of a radioisotope',
      expr: 'A = ln(2)/th*m/M*NA', tex: 'A = \\frac{\\ln 2}{t_{1/2}}\\,\\frac{m}{M}\\,N_A',
      vars: {
        A: { name: 'activity', q: 'activity', unit: 'Bq', tex: 'A' },
        th: { name: 'half-life', q: 'time', unit: 'yr', value: 1600, tex: 't_{1/2}' },
        m: { name: 'mass of the isotope', q: 'mass', unit: 'g', value: 1, tex: 'm' },
        M: { name: 'molar mass of the isotope', q: 'molarmass', unit: 'g/mol', value: 226.03, tex: 'M' },
        NA: { const: 'NA' }
      },
      note: '$A = \\lambda N$ with $N = (m/M)\\,N_A$ atoms. Default: a gram of radium-226, which gives almost exactly 1 Ci.',
      practice: { unknowns: ['A', 'm'] },
      stories: {
        A: 'What is the activity of {m} of radium-226 (half-life {th}, molar mass {M})?',
        m: 'A smoke detector contains americium-241 (half-life {th}, molar mass {M}) with an activity of {A}. What mass of americium is that?'
      }
    }
  ],
  examples: [
    {
      title: 'Dating a wooden bowl',
      q: 'Carbon from a wooden bowl has an activity of 0.0850 Bq per gram; living wood gives 0.226 Bq per gram. How old is the bowl? (Carbon-14: 5730 years.)',
      steps: [
        'Fraction left: $0.0850/0.226 = 0.376$.',
        { text: 'Number of half-lives:', tex: '\\frac{t}{t_{1/2}} = \\log_2\\frac{0.226}{0.0850} = \\frac{\\ln 2.659}{\\ln 2} = 1.411' },
        '$t = 1.411 \\times 5730 = 8080$ years (before calibration).'
      ],
      a: 'About 8100 years old.'
    },
    {
      title: 'How much americium in a smoke detector?',
      q: 'A household smoke detector holds americium-241 (half-life 432.2 years, 241.06 g/mol) with an activity of 37 kBq (1 µCi). What mass is that?',
      steps: [
        'Half-life in seconds: $432.2 \\times 3.156\\times10^{7} = 1.364\\times10^{10}$ s, so $\\lambda = 0.6931/1.364\\times10^{10} = 5.08\\times10^{-11}$ s⁻¹.',
        'Atoms: $N = A/\\lambda = 3.7\\times10^{4}/5.08\\times10^{-11} = 7.28\\times10^{14}$.',
        'Mass: $7.28\\times10^{14}/6.022\\times10^{23} \\times 241.06 = 2.9\\times10^{-7}$ g.'
      ],
      a: 'About 0.29 µg — less than a grain of dust, yet 37 000 decays every second.'
    }
  ],
  quiz: [
    { q: 'A sample of technetium-99m (half-life 6.0 h) has an activity of 800 MBq at 8 am. What is its activity at 8 pm the same day?', choices: ['400 MBq', '200 MBq', '100 MBq', '0 MBq'], a: 1,
      why: 'Twelve hours is two half-lives: 800 → 400 → 200 MBq.' },
    { q: 'What fraction of a radioactive sample remains after five half-lives, as a percentage?', answer: 3.125, unit: '%',
      why: '$(1/2)^5 = 1/32 = 3.125\\ \\%$.' },
    { q: 'Radioactive waste can be made safe faster by heating it to a high temperature.', a: false,
      why: 'Half-lives are set by the nucleus and are practically unaffected by temperature, pressure or chemical form. Waste is made safe only by time — or by transmuting it in a reactor or accelerator.' },
    { q: 'Two samples contain the same number of atoms. Sample A has a half-life of 1 day, sample B of 100 days. Which is true now?', choices: ['A has 100 times the activity of B', 'B has 100 times the activity of A', 'they have the same activity', 'A has 10 times the activity of B'], a: 0,
      why: '$A = \\lambda N = (\\ln 2/t_{1/2})N$: with equal N, activity is inversely proportional to half-life. A burns out quickly; B lasts longer at a lower rate.' },
    { q: 'Why can\'t radiocarbon dating be used on a 2-million-year-old fossil bone?', choices: ['bones contain no carbon', 'after about 350 half-lives no carbon-14 is left to measure', 'carbon-14 half-life is too short to change measurably', 'fossils absorb carbon-14 from the ground'], a: 1,
      why: '2 million years is 350 half-lives: the fraction left, $2^{-350}$, is effectively zero. Longer-lived clocks such as potassium–argon are used for such ages.' }
  ],
  problems: [
    { q: 'A PET centre receives a dose of fluorine-18 (half-life 109.8 min) with an activity of 10.0 GBq at 7:00. What is its activity at 9:00, when it is injected?', answer: 4.69, unit: 'GBq', tol: 0.02,
      steps: ['Time elapsed: 120 min, or $120/109.8 = 1.093$ half-lives.', '$A = 10.0 \\times 2^{-1.093} = 10.0 \\times 0.469 = 4.69$ GBq.'] },
    { q: 'An adult body contains about 140 g of potassium, 0.0117 % of it potassium-40 (half-life $1.25\\times10^{9}$ years, 39.96 g/mol). What is the activity of the potassium-40 in the body, in becquerels?', answer: 4340, unit: 'Bq', tol: 0.03,
      steps: ['Mass of potassium-40: $140 \\times 1.17\\times10^{-4} = 0.0164$ g, or $4.10\\times10^{-4}$ mol = $2.47\\times10^{20}$ atoms.', '$\\lambda = 0.693/(1.25\\times10^{9} \\times 3.156\\times10^{7}\\ \\mathrm{s}) = 1.76\\times10^{-17}$ s⁻¹.', '$A = \\lambda N \\approx 4300$ Bq: about four thousand nuclei in you decay every second.'] }
  ],
  applications: ['Radiocarbon dating of archaeological finds; potassium–argon and uranium–lead dating of rocks.', 'Timing the production and use of medical isotopes.', 'Planning the storage of nuclear waste.', 'Smoke detectors, radioisotope thermoelectric generators and industrial gauges.'],
  history: 'Rutherford introduced the half-life in 1900 while studying thorium emanation (radon-220). Willard Libby developed radiocarbon dating in 1949 and received the Nobel Prize in Chemistry for it in 1960.',
  sim: 'atom-decay'
},

{
  id: 'fission-fusion', parent: 'nuclear-chemistry', title: 'Fission and fusion', level: 2,
  short: 'Splitting a very heavy nucleus (fission) or joining very light ones (fusion) moves towards the most tightly bound nuclei near iron, releasing millions of times more energy per atom than any chemical reaction.',
  keywords: ['fission', 'fusion', 'chain reaction', 'critical mass', 'uranium-235', 'enrichment', 'moderator', 'control rods', 'plutonium', 'deuterium', 'tritium', 'tokamak', 'binding energy per nucleon', 'mass defect', 'nuclear reactor', 'energy density'],
  prereq: ['nuclear-stability', 'nuclear-equations', 'physics:mass-energy'],
  related: ['physics:fission', 'physics:fusion', 'physics:nuclear-reactors', 'physics:q-value', 'isotopes', 'enthalpy'],
  body: `
The binding energy per nucleon ([[nuclear-stability]]) rises from about 1 MeV for deuterium to a peak of 8.8 MeV near iron and nickel, then slowly falls to 7.6 MeV for uranium. Any change that moves nuclei *towards* the peak turns mass into energy. There are two ways: split a heavy nucleus — **fission** — or fuse two light ones — **fusion**.

### Fission
Uranium-235 absorbs a slow neutron, becomes uranium-236 in a highly excited state, wobbles and splits, typically into two unequal fragments plus two or three neutrons:
$$\\ce{^{235}_{92}U + ^{1}_{0}n -> ^{141}_{56}Ba + ^{92}_{36}Kr + 3^{1}_{0}n}$$
The products weigh about 0.19 u less than the reactants, so this split releases 173 MeV; counting the decays of the fragments that follow, a fission yields about **200 MeV** — some fifty million times the energy of burning one carbon atom (4 eV). The fragments have the neutron-rich $N/Z$ of uranium, far above the band of stability for their size, so they are strongly radioactive β⁻ emitters: that is the origin of most nuclear waste.

The released neutrons can split more nuclei — a **chain reaction**. In a reactor it is held exactly at one new fission per fission:
- natural uranium has only 0.72 % uranium-235, so power-reactor fuel is **enriched** to 3–5 % (weapons need over 90 %);
- a **moderator** (water, heavy water or graphite) slows the neutrons, because slow neutrons are far more easily captured by uranium-235;
- **control rods** of neutron absorbers — boron-10, cadmium, hafnium — trim the rate;
- uranium-238, which does not fission with slow neutrons, captures some of them and turns via two β⁻ decays into plutonium-239, which does. Spent fuel therefore contains plutonium, and reprocessing separates it chemically.

A kilogram of uranium-235, fully fissioned, releases $8.2\\times10^{13}$ J — as much heat as burning about 2800 tonnes of coal.

### Fusion
At the light end, joining nuclei climbs the steep side of the curve. The easiest reaction to ignite is deuterium with tritium:
$$\\ce{^{2}_{1}H + ^{3}_{1}H -> ^{4}_{2}He + ^{1}_{0}n} \\qquad Q = 17.6\\ \\mathrm{MeV}$$
Per kilogram of fuel that is about four times more than fission. The difficulty is the electrical repulsion of the nuclei: they must hit each other at energies corresponding to 100–150 million kelvin, as a **plasma** held away from any wall — by magnetic fields in a tokamak such as ITER, or for a few billionths of a second by laser implosion, as at the National Ignition Facility, which in 2022 first released more fusion energy (3.15 MJ) than its lasers delivered to the target (2.05 MJ).

The Sun manages at 15 million kelvin thanks to its gravity and immense size, fusing hydrogen to helium through the proton–proton chain, $4\\,\\ce{^{1}H -> ^{4}He} + 2e^+ + 2\\nu_e$, 26.7 MeV per helium nucleus. To shine as it does it turns 4.26 million tonnes of mass into energy every second.

### The chemistry in nuclear technology
Nuclear energy is physics, but its fuel cycle is chemistry: uranium ore is leached and purified as "yellowcake", converted to volatile uranium hexafluoride, $\\ce{UF6}$, for enrichment in centrifuges, then to ceramic $\\ce{UO2}$ pellets. Spent fuel is dissolved in nitric acid and uranium and plutonium are extracted with tributyl phosphate. And the chemistry of fission products decides what escapes in an accident: volatile iodine and caesium travel far, while strontium and plutonium, which form involatile oxides, mostly stay put.
`,
  ideas: [
    'Binding energy per nucleon peaks near iron; fission of heavy and fusion of light nuclei both release energy.',
    'A U-235 fission releases about 200 MeV and two or three neutrons that can sustain a chain reaction.',
    'Reactors use enriched fuel, a moderator to slow neutrons and control rods to absorb them.',
    'D–T fusion releases 17.6 MeV but needs a plasma at over 100 million kelvin.',
    'Nuclear reactions release millions of times more energy per atom than chemical reactions.'
  ],
  pitfalls: [
    'Fission and fusion break the conservation of mass-energy — Mass is converted into an equivalent amount of energy, E = Δm c²; the total of mass-energy is conserved.',
    'Any nucleus releases energy when split — Only nuclei heavier than the iron peak. Splitting a light nucleus, or fusing heavy ones, absorbs energy.',
    'A nuclear reactor can explode like a nuclear bomb — Reactor fuel is enriched to only a few per cent, far from the fast, supercritical assembly a bomb needs. Reactor accidents are steam explosions, fires and releases of radioactive material, serious as they are.'
  ],
  formulas: [
    {
      name: 'Energy from a mass of nuclear fuel',
      expr: 'E = m/M*NA*Ef', tex: 'E = \\frac{m}{M}\\,N_A\\,E_f',
      vars: {
        E: { name: 'energy released', q: 'energy', unit: 'GJ', tex: 'E' },
        m: { name: 'mass of fuel that reacts', q: 'mass', unit: 'kg', value: 1, tex: 'm' },
        M: { name: 'molar mass of the fuel', q: 'molarmass', unit: 'g/mol', value: 235.04, tex: 'M' },
        NA: { const: 'NA' },
        Ef: { name: 'energy per reaction', q: 'energy', unit: 'MeV', value: 200, tex: 'E_f' }
      },
      note: 'Number of nuclei times energy per reaction. Defaults: uranium-235, 200 MeV per fission. For D–T fusion use $M = 5.03$ g/mol (one D plus one T) and 17.6 MeV.',
      practice: { unknowns: ['E', 'm'] },
      stories: {
        E: 'How much energy is released when {m} of uranium-235 (molar mass {M}) undergoes fission at {Ef} per nucleus?',
        m: 'A reactor delivers {E} of heat in a day, at {Ef} per fission of uranium-235 (molar mass {M}). What mass of uranium-235 does it use?'
      }
    },
    {
      name: 'Mass turned into energy each second',
      expr: 'mdot = P/c^2', tex: '\\dot m = \\frac{P}{c^2}',
      vars: {
        mdot: { name: 'rate of mass loss', q: 'massflow', unit: 'kg/s', tex: '\\dot m' },
        P: { name: 'power released', q: 'power', unit: 'W', value: 3.828e26, tex: 'P' },
        c: { const: 'c' }
      },
      note: 'Holds for any source of energy, chemical included: a coal fire also loses mass $E/c^2$, but only about three parts in ten billion of the fuel — far too little to weigh. Default: the luminosity of the Sun.',
      stories: {
        mdot: 'The Sun radiates {P}. How much mass does it convert into energy each second?',
        P: 'A reactor converts {mdot} of mass into energy. What is its thermal power?'
      }
    }
  ],
  examples: [
    {
      title: 'A reactor\'s daily appetite',
      q: 'A power station produces 3.0 GW of heat from uranium-235 fission at 200 MeV per fission. How much uranium-235 does it consume per day?',
      steps: [
        'Energy per day: $3.0\\times10^{9} \\times 86\\,400 = 2.59\\times10^{14}$ J.',
        'Fissions: $2.59\\times10^{14}/(200 \\times 1.602\\times10^{-13}\\ \\mathrm{J}) = 8.09\\times10^{24}$.',
        'Moles: $8.09\\times10^{24}/6.022\\times10^{23} = 13.4$ mol, or $13.4 \\times 235.04 = 3.2$ kg.',
        'A coal plant of the same output burns about 9000 tonnes a day.'
      ],
      a: 'About 3.2 kg of uranium-235 per day.'
    },
    {
      title: 'The energy of D–T fusion',
      q: 'Masses: deuterium 2.014102 u, tritium 3.016049 u, helium-4 4.002603 u, neutron 1.008665 u. Find the energy released per reaction and per kilogram of fuel.',
      steps: [
        'Mass lost: $(2.014102 + 3.016049) - (4.002603 + 1.008665) = 0.018883$ u.',
        '$Q = 0.018883 \\times 931.5 = 17.6$ MeV.',
        'Per kilogram: one reaction uses 5.030 u of fuel, so $17.6 \\times 1.602\\times10^{-13}\\ \\mathrm{J}/(5.030 \\times 1.661\\times10^{-27}\\ \\mathrm{kg}) = 3.4\\times10^{14}$ J/kg — about four times fission per kilogram, and some seven million times petrol.'
      ],
      a: '17.6 MeV per reaction, 3.4 × 10¹⁴ J per kg.'
    }
  ],
  quiz: [
    { q: 'Why does fusing two light nuclei release energy, while fusing two heavy nuclei would absorb it?', choices: ['light nuclei have no protons', 'the binding energy per nucleon rises up to iron and falls beyond it', 'heavy nuclei are already fused', 'fusion only works in stars'], a: 1,
      why: 'Energy is released whenever the products are more tightly bound per nucleon. Below iron that happens by fusing; above iron, by splitting.' },
    { q: 'What is the job of the moderator in a thermal nuclear reactor?', choices: ['to absorb neutrons and stop the reaction', 'to slow neutrons down so that uranium-235 captures them', 'to cool the fuel', 'to shield the operators'], a: 1,
      why: 'Fission neutrons are fast; uranium-235 is far more likely to capture slow ones. Water, heavy water or graphite slow them by collisions. Absorbing them is the job of the control rods.' },
    { q: 'Why are fission fragments radioactive?', choices: ['they are too heavy', 'they carry the high neutron-to-proton ratio of uranium, far too neutron-rich for their size', 'they have absorbed the gamma rays', 'they are proton-rich'], a: 1,
      why: 'Uranium has N/Z ≈ 1.55; nuclei half its size are stable at about 1.3. The fragments are neutron-rich and undergo a series of β⁻ decays towards the band.' },
    { q: 'How much energy, in joules, is released by converting 1.00 g of mass completely into energy?', answer: 8.99e13, unit: 'J',
      why: '$E = mc^2 = 1.00\\times10^{-3} \\times (3.00\\times10^{8})^2 = 9.0\\times10^{13}$ J — about 21 kilotonnes of TNT.' },
    { q: 'Deuterium–tritium fusion releases more energy per kilogram of fuel than uranium fission.', a: true,
      why: 'About $3.4\\times10^{14}$ J/kg against $8.2\\times10^{13}$ J/kg: per reaction fusion releases less (17.6 against 200 MeV) but its fuel nuclei are about 47 times lighter.' }
  ],
  applications: ['Nuclear power: about a tenth of the world\'s electricity.', 'Naval propulsion and radioisotope production in reactors.', 'Fusion research in tokamaks, stellarators and laser facilities.', 'Stellar nucleosynthesis: the origin of every element heavier than hydrogen and helium.'],
  history: 'Hahn and Strassmann found barium among the products of neutron-irradiated uranium in December 1938; Meitner and Frisch explained it as fission within weeks. Fermi\'s team ran the first controlled chain reaction in Chicago in 1942. Bethe worked out how stars shine by fusion in 1939.',
  sim: { id: 'atom-stability', params: { view: 'binding' } }
}

);
