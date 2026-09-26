/* HYPER-PHYSICS · content/radioactivity.js — unstable nuclei: how they decay, how fast,
 * how we count them, how we date things with them and what their radiation does to us. */
Hyper.add(

{
  id: 'radioactive-decay', parent: 'radioactivity', title: 'Types of radioactive decay', level: 1,
  short: 'Unstable nuclei change into more stable ones by throwing out an alpha particle, an electron or positron, or a gamma ray — each with its own rules and its own penetrating power.',
  keywords: ['radioactivity', 'alpha decay', 'beta decay', 'gamma decay', 'positron emission', 'electron capture', 'neutrino', 'decay chain', 'ionizing radiation', 'penetration', 'Becquerel', 'Curie'],
  prereq: ['nuclear-structure', 'mass-energy'],
  related: ['half-life', 'radiation-dose', 'quantum-tunneling', 'antimatter', 'q-value'],
  body: `
In 1896 Henri Becquerel found that uranium salts fogged photographic plates wrapped in black paper, with no light at all. Marie and Pierre Curie then tracked the effect to new elements, polonium and radium, far more active than uranium. The rays came from the **nucleus**: an unstable nucleus spontaneously turns into a more stable one and emits the difference in energy as radiation. Three kinds were named, in order of penetrating power, alpha, beta and gamma.

### Alpha decay
Heavy nuclei shed a helium-4 nucleus, a tightly bound package of two protons and two neutrons:

$$ {}^{A}_{Z}\\mathrm{X} \\to {}^{A-4}_{Z-2}\\mathrm{Y} + {}^{4}_{2}\\mathrm{He}, \\qquad \\text{e.g. } {}^{238}_{92}\\mathrm{U} \\to {}^{234}_{90}\\mathrm{Th} + \\alpha$$

The alpha particle leaves with a sharp energy of a few MeV (4.2 MeV for uranium-238). It has to [[quantum-tunneling|tunnel]] through the electric barrier around the nucleus, which is why alpha half-lives range from microseconds to billions of years.

### Beta decay
A nucleus with too many neutrons turns one into a proton, creating an electron and an antineutrino (**beta-minus**); one with too many protons does the reverse and emits a positron and a neutrino (**beta-plus**):

$$ n \\to p + e^- + \\bar\\nu_e \\qquad\\qquad p \\to n + e^+ + \\nu_e$$

Carbon-14 decays by beta-minus to nitrogen-14; fluorine-18, used in PET scans, by beta-plus to oxygen-18. A proton-rich nucleus can also swallow one of its own inner electrons, **electron capture**. In all three, $A$ stays the same and $Z$ changes by one. The electrons come out with every energy from zero up to a maximum, because an unseen third particle shares the energy: that is how Wolfgang Pauli inferred the **neutrino** in 1930, 26 years before it was detected. Beta decay is driven by the weak force (see [[fundamental-forces]]).

### Gamma decay
After alpha or beta decay the daughter is often left in an excited state. It drops to its ground state by emitting a **gamma-ray photon**, just as an atom emits light, but with energies of keV to MeV. Neither $A$ nor $Z$ changes. Cobalt-60 beta-decays to nickel-60, which then emits gammas of 1.17 and 1.33 MeV.

### What stops them
| Radiation | What it is | Charge | Typically stopped by |
|---|---|---|---|
| alpha | helium-4 nucleus | $+2e$ | a sheet of paper, the dead layer of skin, 4 cm of air |
| beta | electron or positron | $\\mp e$ | a few millimetres of aluminium or plastic |
| gamma | photon | 0 | never fully: about 1 cm of lead halves 1 MeV gammas |

The heavily charged alpha particle ionizes densely and loses its energy fast; the neutral gamma ray interacts rarely, so it penetrates far. What makes each one dangerous is discussed in [[radiation-dose]].

### Bookkeeping
In every decay the **mass number** and the **charge** balance, and the products are lighter than the parent: the mass lost, times $c^2$, is the energy released, the [[q-value|Q-value]]. Many heavy nuclei decay in long **chains**. Uranium-238 reaches stable lead-206 after 8 alpha and 6 beta-minus decays, passing through radium and the radioactive gas radon on the way.

> [!key] Alpha: A − 4, Z − 2. Beta-minus: Z + 1. Beta-plus and electron capture: Z − 1. Gamma: no change.
`,
  ideas: [
    'Radioactive decay is a nucleus changing into a more stable one and emitting the energy difference.',
    'Alpha decay lowers A by 4 and Z by 2; beta decay changes Z by one and leaves A alone; gamma decay changes neither.',
    'Mass number and charge are conserved in every decay, and the products are lighter than the parent.',
    'Alpha particles are stopped by paper, beta particles by millimetres of metal, gamma rays only weakened by centimetres of lead.',
    'The continuous spectrum of beta electrons revealed the neutrino.'
  ],
  pitfalls: [
    'Beta electrons were orbiting the nucleus before they left — They are created in the decay, as a neutron turns into a proton. Nuclei contain no electrons.',
    'Gamma radiation makes an element change — Gamma decay only releases energy from an excited nucleus; the element stays the same.',
    'The most penetrating radiation is always the most dangerous — Inside the body, alpha emitters are the most damaging, because they deposit all their energy in a tiny volume of tissue.'
  ],
  formulas: [
    {
      name: 'Energy released in alpha decay',
      expr: 'Q = (MP - MD - MHe)*c^2', tex: 'Q = (M_P - M_D - M_\\alpha)\\, c^2',
      vars: {
        Q: { name: 'energy released (Q-value)', q: 'energy', unit: 'MeV', signed: true },
        MP: { name: 'atomic mass of the parent', q: 'mass', unit: 'u', value: 238.050788, tex: 'M_P' },
        MD: { name: 'atomic mass of the daughter', q: 'mass', unit: 'u', value: 234.043601, tex: 'M_D' },
        MHe: { name: 'atomic mass of helium-4', q: 'mass', unit: 'u', value: 4.002603, tex: 'M_\\alpha' },
        c: { const: 'c' }
      },
      note: 'Atomic masses, so the electrons cancel. Defaults: uranium-238 to thorium-234. A negative Q means the decay cannot happen.',
      practice: false
    },
    {
      name: 'Kinetic energy of the alpha particle',
      expr: 'K = Q*(A - 4)/A', tex: 'K_\\alpha = Q\\,\\frac{A - 4}{A}',
      vars: {
        K: { name: 'kinetic energy of the alpha particle', q: 'energy', unit: 'MeV', tex: 'K_\\alpha' },
        Q: { name: 'energy released (Q-value)', q: 'energy', unit: 'MeV', value: 4.27 },
        A: { name: 'mass number of the parent', q: 'count', value: 238 }
      },
      note: 'Momentum conservation: the daughter recoils with the same momentum, so the light alpha takes most of the energy. The rest, $Q - K_\\alpha$, is the recoil energy of the daughter.',
      stories: { K: 'A nucleus with mass number {A} alpha-decays, releasing {Q}. What kinetic energy does the alpha particle carry away?' }
    },
    {
      name: 'Energy released in beta-minus decay',
      expr: 'Q = (MP - MD)*c^2', tex: 'Q = (M_P - M_D)\\, c^2',
      vars: {
        Q: { name: 'energy released (Q-value)', q: 'energy', unit: 'keV', signed: true },
        MP: { name: 'atomic mass of the parent', q: 'mass', unit: 'u', value: 14.003242, tex: 'M_P' },
        MD: { name: 'atomic mass of the daughter', q: 'mass', unit: 'u', value: 14.003074, tex: 'M_D' },
        c: { const: 'c' }
      },
      note: 'With atomic masses the created electron is already accounted for. Defaults: carbon-14 to nitrogen-14, 156 keV, shared between the electron and the antineutrino.',
      practice: false
    }
  ],
  examples: [
    {
      title: 'Uranium-238 throws out an alpha',
      q: 'Write the decay of $ {}^{238}_{92}\\mathrm{U}$ by alpha emission and find the energy released and the alpha particle\'s kinetic energy. Atomic masses: U-238 238.050788 u, Th-234 234.043601 u, He-4 4.002603 u.',
      steps: [
        'Balance $A$ and $Z$: $ {}^{238}_{92}\\mathrm{U} \\to {}^{234}_{90}\\mathrm{Th} + {}^{4}_{2}\\mathrm{He}$ (238 = 234 + 4, 92 = 90 + 2).',
        'Mass lost: $238.050788 - 234.043601 - 4.002603 = 0.004584\\ \\mathrm{u}$.',
        '$Q = 0.004584 \\times 931.5\\ \\mathrm{MeV} = 4.27\\ \\mathrm{MeV}$.',
        'Momentum is shared equally, so kinetic energy divides in inverse proportion to mass: $K_\\alpha = 4.27 \\times 234/238 = 4.20\\ \\mathrm{MeV}$; the thorium recoils with the remaining 0.07 MeV.'
      ],
      a: 'Q = 4.27 MeV; the alpha carries 4.20 MeV.'
    },
    {
      title: 'From uranium to lead',
      q: 'Uranium-238 ($Z = 92$) ends its decay chain as stable lead-206 ($Z = 82$). How many alpha and beta-minus decays happen on the way?',
      steps: [
        'Only alpha decay changes $A$, by 4 each time: $(238 - 206)/4 = 8$ alpha decays.',
        'Eight alphas lower $Z$ by 16, from 92 to 76.',
        'Lead has $Z = 82$, so six beta-minus decays must raise $Z$ from 76 to 82.'
      ],
      a: '8 alpha decays and 6 beta-minus decays.'
    }
  ],
  quiz: [
    { q: 'Radium-226 ($Z = 88$) decays by alpha emission. The daughter is…', choices: ['$ {}^{222}_{86}\\mathrm{Rn}$', '$ {}^{226}_{86}\\mathrm{Rn}$', '$ {}^{222}_{88}\\mathrm{Ra}$', '$ {}^{226}_{89}\\mathrm{Ac}$'], a: 0,
      why: 'Alpha decay removes 2 protons and 2 neutrons: $A = 226 - 4 = 222$, $Z = 88 - 2 = 86$, which is radon.' },
    { q: 'In beta-minus decay the nucleus…', choices: ['loses 4 nucleons', 'keeps its mass number and gains one proton', 'keeps its mass number and loses one proton', 'only loses energy'], a: 1,
      why: 'A neutron becomes a proton: $Z$ goes up by one while the total number of nucleons stays the same.' },
    { q: 'A source behind 1 cm of aluminium still sets a detector clicking. What is getting through?', choices: ['Alpha particles', 'Beta particles', 'Gamma rays', 'Nothing — it must be background'], a: 2,
      why: 'Alphas stop in paper and betas in a few mm of aluminium; gamma rays pass through centimetres of metal.' },
    { q: 'Gamma decay changes a nucleus into a different element.', a: false,
      why: 'Gamma decay only carries off excitation energy. $A$ and $Z$, and so the element, stay the same.' },
    { q: 'Why do beta electrons come out with a spread of energies while alpha particles have one sharp energy?', choices: ['Electrons lose energy escaping the atom', 'An antineutrino shares the energy in beta decay', 'The nucleus recoils more in beta decay', 'Beta decay happens from many excited states at once'], a: 1,
      why: 'Alpha decay makes two bodies, so momentum fixes how the energy splits. Beta decay makes three, and the electron and antineutrino can share the energy in any proportion.' }
  ],
  applications: ['Smoke detectors use americium-241, whose alpha particles ionize the air in a small chamber; smoke interrupts the current.', 'PET scanners image the positrons of fluorine-18 labelled sugar.', 'Gamma sources such as cobalt-60 sterilize medical equipment and treat tumours.', 'Radon, an alpha emitter in the uranium chain, is the largest natural radiation dose most people receive.'],
  history: 'Becquerel discovered radioactivity in 1896; Rutherford named alpha and beta rays in 1899 and Paul Villard found gamma rays in 1900. Rutherford and Frederick Soddy showed in 1902 that radioactivity transmutes one element into another.'
},

{
  id: 'half-life', parent: 'radioactivity', title: 'Decay law and half-life', level: 2,
  short: 'Each unstable nucleus has a fixed chance of decaying per second, so a large sample shrinks exponentially: after every half-life, half of what was left is gone.',
  keywords: ['half-life', 'decay constant', 'exponential decay', 'mean lifetime', 'decay law', 'random', 'probability', 'N = N0 e^-λt', 'T1/2'],
  prereq: ['radioactive-decay', 'math:exponential-growth-decay', 'math:logarithms'],
  related: ['activity', 'radiocarbon-dating', 'math:exponential-distribution', 'math:poisson-distribution', 'math:separable-equations'],
  body: `
Nobody can say when a particular nucleus will decay. It has no memory and no clock: a uranium nucleus that has sat quietly for a billion years is exactly as likely to decay in the next second as a newly made one. All that is fixed is the **probability per unit time**, the **decay constant** $\\lambda$. Temperature, pressure and chemistry leave it essentially unchanged.

### The exponential law
With $N$ nuclei present, about $\\lambda N\\,dt$ decay in a short time $dt$:

$$\\frac{dN}{dt} = -\\lambda N \\quad\\Rightarrow\\quad N(t) = N_0\\, e^{-\\lambda t}$$

The number falls by the same *factor* in every equal interval. The time for it to halve is the **half-life**,

$$T_{1/2} = \\frac{\\ln 2}{\\lambda} \\approx \\frac{0.693}{\\lambda}$$

and the law can equally be written $N = N_0 \\,(1/2)^{t/T_{1/2}}$: after one half-life a half remains, after two a quarter, after ten about a thousandth. The average life of a nucleus, the **mean lifetime** $\\tau = 1/\\lambda = 1.443\\,T_{1/2}$, is a little longer than the half-life because a few nuclei survive for a very long time.

### An enormous range
| Nuclide | Half-life |
|---|---|
| polonium-212 | 0.3 µs |
| radon-222 | 3.8 days |
| iodine-131 | 8.0 days |
| cobalt-60 | 5.3 years |
| caesium-137 | 30 years |
| carbon-14 | 5730 years |
| uranium-238 | 4.5 billion years |
| bismuth-209 | 2 × 10¹⁹ years |

The spread comes largely from alpha particles [[quantum-tunneling|tunnelling]] through barriers of different thickness: a small change in decay energy changes the half-life by many powers of ten.

### Chance, not clockwork
The smooth exponential is a statement about **large numbers**. With a handful of nuclei the count jumps down irregularly, and after one half-life you may find three left out of eight, or six. The number decaying in a fixed interval follows a [[math:poisson-distribution|Poisson distribution]], with a typical scatter of $\\sqrt N$: count 100 decays and expect about ±10. The waiting time for a single nucleus follows the [[math:exponential-distribution|exponential distribution]]. Try both in the simulation: small samples wander, large ones hug the curve.

> [!tip] To estimate quickly, count half-lives: 10 half-lives reduce anything by a factor of $2^{10} \\approx 1000$, 20 by a million.
`,
  ideas: [
    'Each nucleus decays at random with a fixed probability per second, λ, independent of its age.',
    'A large sample decays exponentially: N = N₀ e^(−λt).',
    'The half-life is the time for half the nuclei to decay: T½ = ln 2 / λ.',
    'After n half-lives the fraction left is (1/2)ⁿ: ten half-lives leave about a thousandth.',
    'Small samples fluctuate around the exponential by about √N.'
  ],
  pitfalls: [
    'After two half-lives everything has decayed — Half decays in the first half-life and half of the remainder in the second: a quarter is still left.',
    'An old nucleus is "due" to decay — Nuclei do not age. The chance of decaying in the next second is the same whether a nucleus is one second or a billion years old.',
    'The half-life depends on how much material there is — It is a property of the nuclide. A gram and a tonne of iodine-131 both halve in 8 days.'
  ],
  derivation: {
    title: 'From a constant decay probability to the half-life',
    steps: [
      { text: 'A fraction $\\lambda\\,dt$ of the nuclei decays in each short interval:', tex: 'dN = -\\lambda N\\, dt' },
      { text: 'Separate the variables and integrate from $N_0$ at $t = 0$ (see [[math:separable-equations|separable equations]]):', tex: '\\int_{N_0}^{N} \\frac{dN\'}{N\'} = -\\lambda \\int_0^t dt\' \\;\\Rightarrow\\; \\ln\\frac{N}{N_0} = -\\lambda t' },
      { text: 'Exponentiate:', tex: 'N = N_0\\, e^{-\\lambda t}' },
      { text: 'Half remain when $e^{-\\lambda T_{1/2}} = \\tfrac12$:', tex: '\\lambda T_{1/2} = \\ln 2 \\;\\Rightarrow\\; T_{1/2} = \\frac{\\ln 2}{\\lambda}' }
    ]
  },
  formulas: [
    {
      name: 'Nuclei left after a time (half-life form)',
      expr: 'N = N0*2^(-t/T)', tex: 'N = N_0 \\left(\\tfrac12\\right)^{t/T_{1/2}}',
      vars: {
        N: { name: 'nuclei remaining', q: 'count' },
        N0: { name: 'nuclei at the start', q: 'count', value: 1000000 },
        t: { name: 'elapsed time', q: 'time', unit: 'day', value: 20 },
        T: { name: 'half-life', q: 'time', unit: 'day', value: 8.02, tex: 'T_{1/2}' }
      },
      note: 'Works just as well for mass, activity or count rate, which are all proportional to $N$. Defaults: iodine-131.',
      stories: {
        N: 'A sample holds {N0} atoms of iodine-131 (half-life {T}). How many are left after {t}?',
        t: 'How long does it take {N0} nuclei with a half-life of {T} to dwindle to {N}?',
        T: 'A sample falls from {N0} to {N} radioactive nuclei in {t}. What is the half-life?'
      }
    },
    {
      name: 'Decay constant and half-life',
      expr: 'lambda = ln(2)/T', tex: '\\lambda = \\frac{\\ln 2}{T_{1/2}}',
      vars: {
        lambda: { name: 'decay constant', q: 'decayconst', unit: '1/day' },
        T: { name: 'half-life', q: 'time', unit: 'day', value: 8.02, tex: 'T_{1/2}' }
      },
      stories: { lambda: 'Iodine-131 has a half-life of {T}. What fraction of the nuclei decays per day?', T: 'A nuclide has a decay constant of {lambda}. What is its half-life?' }
    },
    {
      name: 'Nuclei left after a time (decay-constant form)',
      expr: 'N = N0*exp(-lambda*t)', tex: 'N = N_0\\, e^{-\\lambda t}',
      vars: {
        N: { name: 'nuclei remaining', q: 'count' },
        N0: { name: 'nuclei at the start', q: 'count', value: 1000000000 },
        lambda: { name: 'decay constant', q: 'decayconst', unit: '1/h', value: 0.1153 },
        t: { name: 'elapsed time', q: 'time', unit: 'h', value: 24 }
      },
      note: 'Defaults: technetium-99m, the workhorse of nuclear medicine, with $T_{1/2} = 6.01$ h.',
      stories: { N: 'A hospital receives {N0} nuclei of technetium-99m (decay constant {lambda}). How many remain after {t}?' }
    },
    {
      name: 'Mean lifetime',
      expr: 'tau = T/ln(2)', tex: '\\tau = \\frac{T_{1/2}}{\\ln 2}',
      vars: {
        tau: { name: 'mean lifetime', q: 'time', unit: 'yr' },
        T: { name: 'half-life', q: 'time', unit: 'yr', value: 5730, tex: 'T_{1/2}' }
      },
      note: 'The average life of a nucleus, $\\tau = 1/\\lambda$: 44 % longer than the half-life.'
    }
  ],
  examples: [
    {
      title: 'Iodine-131 after a thyroid treatment',
      q: 'A patient receives iodine-131 (half-life 8.0 days). What fraction of it is still radioactive after 24 days, and after 80 days (ignoring what the body excretes)?',
      steps: [
        '24 days is $24/8 = 3$ half-lives: $(1/2)^3 = 1/8 = 12.5\\ \\%$.',
        '80 days is 10 half-lives: $(1/2)^{10} = 1/1024 \\approx 0.1\\ \\%$.',
        'In practice the body also excretes iodine, so the real amount falls faster (the "effective" half-life is shorter).'
      ],
      a: '12.5 % after 24 days, about 0.1 % after 80 days.'
    },
    {
      title: 'Waiting for caesium-137',
      q: 'Soil is contaminated with caesium-137 (half-life 30.1 years). How long until its activity falls to 1 % of today\'s?',
      steps: [
        'Solve $(1/2)^{t/T} = 0.01$: $t/T = \\log_2 100 = \\dfrac{\\ln 100}{\\ln 2} = 6.64$ half-lives.',
        '$t = 6.64 \\times 30.1 = 200$ years.',
        'Equivalently $\\lambda = 0.693/30.1 = 0.0230\\ \\mathrm{yr^{-1}}$ and $t = \\ln(100)/\\lambda = 200$ years.'
      ],
      a: 'About 200 years.'
    }
  ],
  quiz: [
    { q: 'What fraction of a radioactive sample is left after three half-lives?', choices: ['1/3', '1/6', '1/8', '0'], a: 2, why: 'Each half-life halves what is left: $\\tfrac12 \\times \\tfrac12 \\times \\tfrac12 = \\tfrac18$.' },
    { q: 'A nucleus with a half-life of 1 hour has already survived 5 hours. The chance that it decays during the next hour is…', choices: ['almost certain', '50 %', '1/32', 'about 97 %'], a: 1,
      why: 'Nuclei have no memory. Whatever its past, the probability of decaying in any one half-life is one half.' },
    { q: 'You start with 4 radioactive nuclei. After one half-life, exactly 2 will be left.', a: false,
      why: 'Decay is random. On average 2 are left, but 0, 1, 3 or 4 are all possible; the half-life is a statement about averages over large numbers.' },
    { q: 'Samples X (half-life 2 days) and Y (half-life 6 days) start with equal numbers of nuclei. After 6 days, the ratio of X nuclei to Y nuclei is…', choices: ['1/3', '1/4', '1/8', '3'], a: 1,
      why: 'X has been through 3 half-lives ($\\tfrac18$ left), Y through one ($\\tfrac12$ left): $\\tfrac18 / \\tfrac12 = \\tfrac14$.' },
    { q: 'The decay constant of a nuclide is doubled (a different nuclide). Its half-life…', choices: ['doubles', 'halves', 'stays the same', 'is squared'], a: 1, why: '$T_{1/2} = \\ln 2/\\lambda$ is inversely proportional to $\\lambda$.' }
  ],
  applications: ['Choosing medical isotopes: technetium-99m (6 h) lasts long enough to image and short enough to be gone within a day or two.', 'Planning nuclear waste storage: caesium-137 and strontium-90 (about 30 years) dominate the first few centuries.', 'Radiometric dating of rocks, bones and wood (see [[radiocarbon-dating]]).'],
  sim: 'nc-decay'
},

{
  id: 'activity', parent: 'radioactivity', title: 'Activity', level: 2,
  short: 'How many nuclei in a sample decay per second, measured in becquerels. It is proportional to the number of nuclei and inversely proportional to the half-life.',
  keywords: ['activity', 'becquerel', 'Bq', 'curie', 'Ci', 'decay rate', 'count rate', 'specific activity', 'Geiger counter', 'counting statistics'],
  prereq: ['half-life', 'math:derivative'],
  related: ['radiation-dose', 'radiocarbon-dating', 'math:poisson-distribution'],
  body: `
A Geiger counter does not see nuclei; it sees decays. The number of decays per second in a sample is its **activity**:

$$A = -\\frac{dN}{dt} = \\lambda N = \\frac{\\ln 2}{T_{1/2}}\\, N$$

The SI unit is the **becquerel**, one decay per second. The older **curie**, $1\\ \\mathrm{Ci} = 3.7 \\times 10^{10}\\ \\mathrm{Bq}$, was chosen as the activity of one gram of radium-226.

### Many atoms, or short-lived ones
The formula has two factors. A sample is very active if it contains **many** nuclei or if they are **short-lived**. A gram of uranium-238 and a gram of radium-226 contain similar numbers of atoms, but radium's half-life (1600 years) is almost three million times shorter, so its activity is almost three million times higher. The activity per unit mass, the **specific activity**, is

$$\\frac{A}{m} = \\frac{\\ln 2\\; N_A}{M\\, T_{1/2}}$$

with $M$ the molar mass. Since $A = \\lambda N$ and $N$ falls exponentially, the activity decays with the same half-life as the nuclei.

### Everyday activities
| Source | Activity |
|---|---|
| a banana (its potassium-40) | about 15 Bq |
| your own body (potassium-40 and carbon-14) | about 8 kBq |
| a household smoke detector (americium-241) | about 37 kBq |
| technetium-99m for a bone scan | about 600 MBq |
| one gram of radium-226 | 37 GBq = 1 Ci |
| a cobalt-60 radiotherapy source | hundreds of TBq |

Activity says nothing by itself about danger: that depends on the kind and energy of the radiation and where the source is (see [[radiation-dose]]).

### Counting
A detector records only a fraction of the decays — those whose radiation heads its way and triggers it — so the **count rate** is the activity times an efficiency, plus a **background** of a few counts per second from cosmic rays and the surroundings. Because decays are random, a count of $N$ has an uncertainty of about $\\sqrt N$ (see [[math:poisson-distribution|Poisson statistics]]): 100 counts are known to 10 %, 10 000 counts to 1 %. Precise measurements of weak sources therefore need long counting times.

> [!fact] Your body undergoes about 8000 radioactive decays every second, most of them potassium-40 in your muscles and carbon-14 in every tissue.
`,
  ideas: [
    'Activity is the number of decays per second: A = λN, measured in becquerels (1 Bq = 1 decay/s).',
    'Short half-lives and large numbers of nuclei both make high activity.',
    'Activity decays with the same half-life as the number of nuclei.',
    'A detector counts only a fraction of the decays, on top of a background.',
    'Counting N random events gives an uncertainty of about √N.'
  ],
  pitfalls: [
    'A high activity means a dangerous source — Activity counts decays, not energy or type. A few kBq of an alpha emitter swallowed can matter more than MBq of a weak beta emitter in a sealed box.',
    'The count rate on the detector is the activity — It is usually a small fraction of it: radiation goes in all directions, and detectors miss some of what reaches them.',
    'Long-lived isotopes are the most radioactive — Per atom they are the least: uranium-238 is only weakly radioactive precisely because its half-life is so long.'
  ],
  formulas: [
    {
      name: 'Activity from the number of nuclei',
      expr: 'A = ln(2)*N/T', tex: 'A = \\frac{\\ln 2}{T_{1/2}}\\, N',
      vars: {
        A: { name: 'activity', q: 'activity', unit: 'Bq' },
        N: { name: 'number of radioactive nuclei', q: 'count', value: 2.47e20 },
        T: { name: 'half-life', q: 'time', unit: 'yr', value: 1.248e9, tex: 'T_{1/2}' }
      },
      note: 'Defaults: the potassium-40 in an adult body, about 16 mg of it.',
      stories: {
        A: 'An adult body contains about {N} potassium-40 nuclei (half-life {T}). What is their activity?',
        N: 'A source of half-life {T} has an activity of {A}. How many radioactive nuclei does it contain?'
      }
    },
    {
      name: 'Activity after a time',
      expr: 'A = A0*2^(-t/T)', tex: 'A = A_0 \\left(\\tfrac12\\right)^{t/T_{1/2}}',
      vars: {
        A: { name: 'activity after the time', q: 'activity', unit: 'MBq' },
        A0: { name: 'activity at the start', q: 'activity', unit: 'MBq', value: 500 },
        t: { name: 'elapsed time', q: 'time', unit: 'h', value: 24 },
        T: { name: 'half-life', q: 'time', unit: 'h', value: 6.01, tex: 'T_{1/2}' }
      },
      note: 'Defaults: technetium-99m, delivered in the morning and used through the day.',
      stories: {
        A: 'A dose of technetium-99m (half-life {T}) has an activity of {A0}. What is its activity {t} later?',
        A0: 'A patient must receive {A} of a tracer with half-life {T}, injected {t} after preparation. What activity must be prepared?'
      }
    },
    {
      name: 'Activity of a given mass',
      expr: 'A = ln(2)*m*NA/(M*T)', tex: 'A = \\frac{\\ln 2\\; m N_A}{M\\, T_{1/2}}',
      vars: {
        A: { name: 'activity', q: 'activity', unit: 'GBq' },
        m: { name: 'mass of the radioactive substance', q: 'mass', unit: 'g', value: 1 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 226 },
        T: { name: 'half-life', q: 'time', unit: 'yr', value: 1600, tex: 'T_{1/2}' },
        NA: { const: 'NA' }
      },
      note: 'Defaults: one gram of radium-226, about 37 GBq — the original definition of the curie.',
      stories: { A: 'What is the activity of {m} of a nuclide with molar mass {M} and half-life {T}?', m: 'What mass of a nuclide (molar mass {M}, half-life {T}) has an activity of {A}?' }
    }
  ],
  examples: [
    {
      title: 'The gram of radium that defined the curie',
      q: 'Radium-226 has a half-life of 1600 years. Find the activity of 1.00 g.',
      steps: [
        'Number of atoms: $N = \\dfrac{1.00}{226} \\times 6.022\\times10^{23} = 2.66\\times10^{21}$.',
        'Decay constant: $\\lambda = \\dfrac{0.693}{1600 \\times 3.156\\times10^{7}\\ \\mathrm{s}} = 1.37\\times10^{-11}\\ \\mathrm{s^{-1}}$.',
        '$A = \\lambda N = 1.37\\times10^{-11} \\times 2.66\\times10^{21} = 3.66\\times10^{10}\\ \\mathrm{Bq}$.',
        'That is 0.99 Ci: the curie was defined from exactly this measurement.'
      ],
      a: 'About 3.7 × 10¹⁰ Bq, one curie.'
    },
    {
      title: 'How sure is a count?',
      q: 'A detector records 400 counts in 100 s with a source present and 100 counts in 100 s without it. What is the source\'s count rate and its uncertainty?',
      steps: [
        'Rates: $4.0 \\pm 0.2\\ \\mathrm{s^{-1}}$ (since $\\sqrt{400} = 20$ counts) and background $1.0 \\pm 0.1\\ \\mathrm{s^{-1}}$ ($\\sqrt{100} = 10$).',
        'Net rate: $4.0 - 1.0 = 3.0\\ \\mathrm{s^{-1}}$.',
        'Independent uncertainties add in quadrature: $\\sqrt{0.2^2 + 0.1^2} = 0.22\\ \\mathrm{s^{-1}}$.',
        'To halve the uncertainty, count four times as long.'
      ],
      a: '3.0 ± 0.2 counts per second.'
    }
  ],
  quiz: [
    { q: 'Two samples contain the same number of atoms. X has a half-life of 1 day, Y of 1 year. Their activities compare as…', choices: ['equal', 'X is about 365 times more active', 'Y is about 365 times more active', 'X is twice as active'], a: 1,
      why: '$A = \\lambda N$ with $\\lambda = \\ln 2 / T_{1/2}$. With equal $N$, activity is inversely proportional to half-life.' },
    { q: 'A source has an activity of 800 Bq. Three half-lives later its activity is…', choices: ['400 Bq', '267 Bq', '100 Bq', '0 Bq'], a: 2, why: 'Activity is proportional to $N$, so it halves every half-life: 800 → 400 → 200 → 100 Bq.' },
    { q: 'The activity of a sample tells you how much energy its radiation carries.', a: false,
      why: 'Activity counts decays per second. The energy per decay, and the type of radiation, must be known separately.' },
    { q: 'You count 10 000 decays. The relative uncertainty of this count is about…', choices: ['0.01 %', '1 %', '10 %', '100 %'], a: 1, why: '$\\sqrt{10\\,000} = 100$, and $100/10\\,000 = 1\\ \\%$.' }
  ],
  applications: ['Dosing radiopharmaceuticals, which are ordered and injected by activity (MBq).', 'Measuring radon in homes, in becquerels per cubic metre of air.', 'Food and water safety limits, set in becquerels per kilogram or litre.']
},

{
  id: 'radiocarbon-dating', parent: 'radioactivity', title: 'Radiocarbon dating', level: 2,
  short: 'Living things keep topping up their carbon-14; after death it decays with a half-life of 5730 years. Measuring what is left tells how long ago the organism died.',
  keywords: ['radiocarbon dating', 'carbon-14', 'C-14', 'carbon dating', 'Libby', 'calibration', 'tree rings', 'accelerator mass spectrometry', 'AMS', 'bomb pulse', 'radiometric dating'],
  prereq: ['half-life', 'activity'],
  related: ['radioactive-decay', 'math:logarithms', 'particle-accelerators'],
  body: `
High in the atmosphere, cosmic rays knock neutrons out of nuclei, and those neutrons convert nitrogen into radioactive carbon:

$$n + {}^{14}_{7}\\mathrm{N} \\to {}^{14}_{6}\\mathrm{C} + p$$

The new carbon-14 is oxidised to carbon dioxide and mixes through the air, the oceans and, through photosynthesis and food chains, every living thing. Production balances decay, so all living tissue carries about the same tiny proportion — roughly one carbon-14 atom for every $10^{12}$ carbon-12 atoms — which gives an activity of about **0.23 Bq per gram of carbon** (14 decays per minute).

### The clock starts at death
When an organism dies it stops exchanging carbon. Its carbon-14 decays back to nitrogen with a [[half-life]] of 5730 years and is not replaced. Comparing the activity per gram of carbon today, $A$, with the living value $A_0$ gives the time since death:

$$t = \\frac{T_{1/2}}{\\ln 2}\\, \\ln\\frac{A_0}{A}$$

Charcoal with a quarter of the living activity died two half-lives, about 11 500 years, ago.

### Limits
The method works for anything that once took in carbon from the air: wood, charcoal, bone, shell, cloth, parchment, food remains. It does not work for rocks, or for fossils whose original carbon has been replaced by minerals. The range is set by what is left to measure. After 50 000 years (8.7 half-lives) only 0.24 % of the carbon-14 remains: a gram of carbon then gives about two decays an hour, lost in the background. Modern laboratories therefore count the atoms themselves with **accelerator mass spectrometry**, which needs only milligrams and pushes the limit towards 50 000 years; beyond that, other clocks take over (potassium–argon, uranium–lead).

### Calibration
The assumption that $A_0$ has always been the same is only approximately true. The production rate changes with the Sun's activity and the Earth's magnetic field; burning fossil fuels has diluted atmospheric carbon-14 with "dead" carbon; and atmospheric bomb tests almost doubled it in the early 1960s. Radiocarbon ages are therefore **calibrated** against samples of known age: tree rings counted year by year for more than 12 000 years, corals and layered lake sediments. The raw "radiocarbon years" can differ from calendar years by several centuries.

> [!history] Willard Libby developed the method in the late 1940s and tested it on wood from Egyptian tombs of known date. He received the 1960 Nobel Prize in Chemistry.
`,
  ideas: [
    'Cosmic rays make carbon-14 from nitrogen; living things carry it at a steady level of about 0.23 Bq per gram of carbon.',
    'After death the carbon-14 decays with a half-life of 5730 years and is not replaced.',
    'Age follows from the measured activity: t = (T½ / ln 2) ln(A₀/A).',
    'The method reaches back about 50 000 years and only dates material that was once alive.',
    'Radiocarbon ages are calibrated with tree rings and other records of known age.'
  ],
  pitfalls: [
    'Carbon dating can date rocks and dinosaur fossils — Only once-living material, and only up to about 50 000 years. Dinosaurs died 66 million years ago, more than 11 000 half-lives.',
    'The method measures the age of the carbon atoms — It measures the time since the organism stopped taking in carbon: when a tree ring formed or an animal died.',
    'Radiocarbon years are calendar years — They must be calibrated, because the carbon-14 level in the air has varied.'
  ],
  formulas: [
    {
      name: 'Age from the measured activity',
      expr: 't = T*ln(A0/A)/ln(2)', tex: 't = \\frac{T_{1/2}}{\\ln 2}\\, \\ln \\frac{A_0}{A}',
      vars: {
        t: { name: 'time since death', q: 'time', unit: 'yr' },
        T: { name: 'half-life of carbon-14', q: 'time', unit: 'yr', value: 5730, tex: 'T_{1/2}' },
        A0: { name: 'activity per gram of carbon, living', q: 'activity', unit: 'Bq', value: 0.23 },
        A: { name: 'activity per gram of carbon, sample', q: 'activity', unit: 'Bq', value: 0.058 }
      },
      note: 'Activities per gram of carbon. The result is an uncalibrated radiocarbon age.',
      stories: {
        t: 'Charcoal from an ancient hearth shows {A} per gram of carbon; living wood shows {A0}. How old is the charcoal?',
        A: 'What activity per gram of carbon would you expect from a bone {t} old, if living tissue shows {A0}?'
      }
    },
    {
      name: 'Fraction of carbon-14 left',
      expr: 'f = 2^(-t/T)', tex: 'f = \\left(\\tfrac12\\right)^{t/T_{1/2}}',
      vars: {
        f: { name: 'fraction of the carbon-14 left', q: 'ratio', unit: '%' },
        t: { name: 'time since death', q: 'time', unit: 'yr', value: 5300 },
        T: { name: 'half-life of carbon-14', q: 'time', unit: 'yr', value: 5730, tex: 'T_{1/2}' }
      },
      stories: { f: 'A body frozen in an Alpine glacier died {t} ago. What fraction of its original carbon-14 remains?', t: 'A piece of wood keeps {f} of its original carbon-14. How long ago was the tree felled?' }
    },
    {
      name: 'Age uncertainty from counting statistics',
      expr: 'dt = T/(ln(2)*sqrt(Nc))', tex: '\\Delta t = \\frac{T_{1/2}}{\\ln 2}\\,\\frac{1}{\\sqrt{N_c}}',
      vars: {
        dt: { name: 'uncertainty of the age', q: 'time', unit: 'yr', tex: '\\Delta t' },
        T: { name: 'half-life of carbon-14', q: 'time', unit: 'yr', value: 5730, tex: 'T_{1/2}' },
        Nc: { name: 'decays (or atoms) counted', q: 'count', value: 10000, tex: 'N_c' }
      },
      note: 'A count of $N_c$ is uncertain by $\\sqrt{N_c}$, a fraction $1/\\sqrt{N_c}$ of the activity, and each 1 % of activity is worth 83 years of age.',
      stories: { dt: 'A laboratory counts {Nc} carbon-14 decays from a sample. How precise is the age, from counting statistics alone?', Nc: 'How many carbon-14 decays must be counted to date a sample to within ±{dt}?' }
    }
  ],
  examples: [
    {
      title: 'Charcoal from a cave hearth',
      q: 'Charcoal from a hearth shows 0.029 Bq per gram of carbon; modern wood shows 0.23 Bq per gram. How long ago was the fire lit?',
      steps: [
        'Ratio: $A_0/A = 0.23/0.029 = 7.9$ — close to $2^3 = 8$, so about three half-lives.',
        'Exactly: $t = \\dfrac{5730}{0.693} \\ln 7.9 = 8267 \\times 2.07 = 17\\,100$ years.',
        'This is a radiocarbon age; calibration against the tree-ring and sediment records would shift it by some centuries.'
      ],
      a: 'About 17 000 years ago.'
    },
    {
      title: 'Why the method runs out',
      q: 'A 1 g carbon sample is 50 000 years old. How many carbon-14 decays per hour does it produce? How many carbon-14 atoms are left in it?',
      steps: [
        'Fraction left: $(1/2)^{50\\,000/5730} = 2^{-8.73} = 2.4\\times10^{-3}$.',
        'Activity: $0.23 \\times 2.4\\times10^{-3} = 5.5\\times10^{-4}\\ \\mathrm{Bq}$, or about 2 decays per hour — hopeless against a background of hundreds per hour.',
        'Atoms: a gram of living carbon holds $\\tfrac{1}{12} \\times 6.02\\times10^{23} \\times 1.2\\times10^{-12} = 6\\times10^{10}$ carbon-14 atoms; $2.4\\times10^{-3}$ of that is $1.4\\times10^{8}$.',
        'An accelerator mass spectrometer counting atoms directly still has plenty to work with, which is why it replaced decay counting.'
      ],
      a: 'About 2 decays per hour, but still about 10⁸ carbon-14 atoms.'
    }
  ],
  quiz: [
    { q: 'A bone has 25 % of the carbon-14 activity of living bone. Its age is about…', choices: ['1430 years', '2870 years', '11 500 years', '17 200 years'], a: 2, why: '25 % is $(1/2)^2$: two half-lives, $2 \\times 5730 = 11\\,460$ years.' },
    { q: 'Why can\'t radiocarbon date a dinosaur bone?', choices: ['Dinosaurs contained no carbon', 'After 66 million years essentially no carbon-14 is left', 'Bones cannot be dated', 'Carbon-14 did not exist then'], a: 1,
      why: '66 million years is over 11 000 half-lives: the fraction left, $2^{-11\\,500}$, is effectively zero. Such fossils are dated from the volcanic rocks around them.' },
    { q: 'A plant grew in 1965, when bomb tests had nearly doubled atmospheric carbon-14. Dated with the usual $A_0$, it would appear…', choices: ['much older than it is', 'younger than it is — "from the future"', 'exactly right', 'impossible to date'], a: 1,
      why: 'It started with more carbon-14 than the standard living value, so it looks as if less has decayed: a negative or too-young age. Such bomb carbon is now used to date recent tissue and wine.' },
    { q: 'Radiocarbon dating can find the age of a granite boulder.', a: false,
      why: 'Granite never exchanged carbon with the atmosphere as a living thing does. Rocks are dated with long-lived clocks such as uranium–lead or potassium–argon.' },
    { q: 'Why is the carbon-14 level in living things constant rather than slowly rising?', choices: ['Plants reject carbon-14', 'Production by cosmic rays balances radioactive decay', 'Carbon-14 is stable in living tissue', 'The oceans absorb it all'], a: 1,
      why: 'The atmosphere holds a steady state: new carbon-14 is made about as fast as the existing stock decays, and living things keep exchanging carbon with it.' }
  ],
  applications: ['Archaeology: dating hearths, burials, seeds and textiles over the last 50 000 years.', 'Climate science: dating layers of peat, lake mud and ocean sediments.', 'Forensics and authentication: bomb-pulse carbon reveals whether ivory, wine or tissue formed after the 1950s.'],
  history: 'Libby\'s first tests in 1949 used acacia wood from the tomb of the pharaoh Djoser and matched the historical dates within the counting uncertainty.',
  sim: 'nc-carbon-dating'
},

{
  id: 'radiation-dose', parent: 'radioactivity', title: 'Radiation dose and its effects', level: 2,
  short: 'How much ionizing radiation a body absorbs (grays), how harmful that is for the kind of radiation (sieverts), and how time, distance and shielding keep the dose down.',
  keywords: ['absorbed dose', 'gray', 'Gy', 'equivalent dose', 'effective dose', 'sievert', 'Sv', 'radiation weighting factor', 'ionizing radiation', 'background radiation', 'radon', 'shielding', 'half-value layer', 'inverse square law'],
  prereq: ['radioactive-decay', 'activity'],
  related: ['x-rays', 'photon', 'light-intensity', 'nuclear-reactors'],
  body: `
Alpha, beta and gamma radiation, X-rays and neutrons are **ionizing**: they carry enough energy to knock electrons out of atoms and break chemical bonds. In living tissue the damage that matters is to DNA. Cells repair most of it, but a mis-repaired break can kill a cell or, years later, start a cancer.

### Absorbed dose
The starting point is the energy deposited per kilogram of tissue, the **absorbed dose**:

$$D = \\frac{E}{m}, \\qquad 1\\ \\mathrm{gray\\ (Gy)} = 1\\ \\mathrm{J/kg}$$

The energies are tiny. A whole-body dose of 5 Gy, likely to be fatal without treatment, deposits 350 J in a 70 kg person — enough to warm them by about a thousandth of a degree. Radiation is harmful not because of the heat but because each joule arrives as millions of concentrated molecular breakages.

### Equivalent and effective dose
The same absorbed dose does more harm when it is packed densely along a track. An alpha particle ionizes a thousand times more densely than an electron, and its damage to DNA is harder to repair. The **equivalent dose** weights the absorbed dose by a **radiation weighting factor** $w_R$:

$$H = w_R\\, D, \\qquad \\text{measured in sieverts (Sv)}$$

with $w_R = 1$ for gamma rays, X-rays and electrons, 2 for protons, 20 for alpha particles, and 2.5 to 20 for neutrons depending on their energy. Organs differ in sensitivity too; weighting each organ's dose and adding gives the **effective dose**, the number quoted for medical scans and safety limits.

| Exposure | Effective dose |
|---|---|
| dental X-ray | about 0.005 mSv |
| chest X-ray | about 0.02 mSv |
| long-haul flight | about 0.05 mSv |
| natural background, one year (world average) | about 2.4 mSv |
| CT scan of the abdomen | about 8 mSv |
| annual limit for radiation workers | 20 mSv |
| acute dose causing radiation sickness | above about 1000 mSv |

About half of the natural background comes from **radon**, an alpha-emitting gas that seeps from the ground and is breathed in; the rest from cosmic rays, rocks and building materials, and the potassium-40 and carbon-14 in our own bodies.

### Two kinds of effect
Large doses received quickly cause **deterministic** effects above a threshold: skin burns, radiation sickness, death of blood-forming cells. Radiotherapy exploits this, giving tumours 60–70 Gy in daily fractions of about 2 Gy. Small doses cause **stochastic** effects: they raise the chance of cancer, by roughly 5 % per sievert in the usual linear estimate, which is assumed (not proven) to continue down to the smallest doses.

### Keeping doses low
- **Time**: dose is dose rate times time.
- **Distance**: from a small source the dose rate falls with the [[light-intensity|inverse square]] of distance.
- **Shielding**: gamma rays are attenuated exponentially; each **half-value layer** — about 1 cm of lead for cobalt-60 — halves the intensity.

> [!warn] For alpha emitters, the danger is inside the body. Outside, the dead layer of skin stops them; inhaled or swallowed, they deposit all their energy in living cells, with $w_R = 20$.
`,
  ideas: [
    'Absorbed dose is energy per mass, in grays (1 Gy = 1 J/kg).',
    'Equivalent dose, in sieverts, weights it by the radiation type: alpha particles count 20 times as much as gamma rays.',
    'Natural background gives about 2.4 mSv a year, half of it from radon.',
    'Large quick doses cause deterministic harm above a threshold; small doses slightly raise cancer risk.',
    'Protection: less time, more distance (inverse square) and shielding (half-value layers).'
  ],
  pitfalls: [
    'Irradiated food or instruments become radioactive — Gamma rays and electron beams used for sterilization cannot make the target radioactive; they pass their energy on and are gone.',
    'Gray and sievert are the same thing — The gray measures energy absorbed; the sievert weights it by how damaging that radiation is. They coincide only for gamma rays, X-rays and electrons.',
    'Any radiation dose is dangerous — Everyone receives a few millisieverts a year naturally. Risk grows with dose; a chest X-ray adds about as much as a few days of background.'
  ],
  formulas: [
    {
      name: 'Absorbed dose',
      expr: 'D = E/m',
      vars: {
        D: { name: 'absorbed dose', q: 'dose', unit: 'mGy' },
        E: { name: 'energy absorbed', q: 'energy', unit: 'J', value: 0.35 },
        m: { name: 'mass of tissue', q: 'mass', unit: 'kg', value: 70 }
      },
      stories: { D: 'A {m} person absorbs {E} of gamma radiation. What is the absorbed dose?', E: 'How much energy does a {m} body absorb from a whole-body dose of {D}?' }
    },
    {
      name: 'Equivalent dose',
      expr: 'H = wR*D', tex: 'H = w_R\\, D',
      vars: {
        H: { name: 'equivalent dose', q: 'doseeq', unit: 'mSv' },
        wR: { name: 'radiation weighting factor', q: 'none', value: 20, tex: 'w_R' },
        D: { name: 'absorbed dose', q: 'dose', unit: 'mGy', value: 0.5 }
      },
      note: '$w_R$ = 1 for photons and electrons, 2 for protons, 20 for alpha particles, 2.5–20 for neutrons.',
      stories: { H: 'Lung tissue absorbs {D} from inhaled alpha emitters ($w_R$ = {wR}). What is the equivalent dose?' }
    },
    {
      name: 'Dose rate and distance from a small source',
      expr: 'H2 = H1*(r1/r2)^2', tex: '\\dot H_2 = \\dot H_1 \\left(\\frac{r_1}{r_2}\\right)^2', solveFor: 'H2',
      vars: {
        H2: { name: 'dose rate at the new distance', unit: 'µSv/h', tex: '\\dot H_2' },
        H1: { name: 'dose rate at the first distance', unit: 'µSv/h', value: 40, tex: '\\dot H_1' },
        r1: { name: 'first distance', q: 'length', unit: 'm', value: 1 },
        r2: { name: 'new distance', q: 'length', unit: 'm', value: 3 }
      },
      note: 'For a point source with no shielding in between; any dose-rate unit works as long as both use the same one.',
      stories: {
        H2: 'A gamma source gives {H1} at {r1}. What dose rate would you receive at {r2}?',
        r2: 'A source gives {H1} at {r1}. How far away must you stand to receive only {H2}?'
      }
    },
    {
      name: 'Transmission through a shield',
      expr: 'f = 2^(-x/d)', tex: 'f = \\left(\\tfrac12\\right)^{x/d_{1/2}}',
      vars: {
        f: { name: 'fraction of the gamma rays getting through', q: 'ratio', unit: '%' },
        x: { name: 'shield thickness', q: 'length', unit: 'cm', value: 5 },
        d: { name: 'half-value layer', q: 'length', unit: 'cm', value: 1.2, tex: 'd_{1/2}' }
      },
      note: 'Half-value layers in lead: about 0.65 cm for caesium-137 gammas (0.66 MeV), 1.2 cm for cobalt-60 (1.25 MeV). Concrete needs roughly five times the thickness.',
      stories: { f: 'What fraction of cobalt-60 gamma rays passes through {x} of lead, whose half-value layer is {d}?', x: 'How thick a shield (half-value layer {d}) cuts the gamma dose rate to {f}?' }
    }
  ],
  examples: [
    {
      title: 'A lethal dose is a warm-up',
      q: 'A whole-body gamma dose of 5 Gy is often fatal. How much energy does it deposit in a 70 kg person, and how much would it warm them? (Take the specific heat of the body as 3500 J/(kg·K).)',
      steps: [
        '$E = D m = 5\\ \\mathrm{J/kg} \\times 70\\ \\mathrm{kg} = 350\\ \\mathrm{J}$.',
        'Temperature rise: $\\Delta T = \\dfrac{E}{m c} = \\dfrac{350}{70 \\times 3500} = 0.0014\\ \\mathrm{K}$.',
        'A sip of hot tea delivers more energy. The harm comes from ionization — broken DNA — not from heating.'
      ],
      a: '350 J, warming the body by about 0.001 K.'
    },
    {
      title: 'Distance and lead',
      q: 'A cobalt-60 source gives 40 µSv/h at 1 m. What does a technician receive at 3 m, and at 3 m behind 5 cm of lead (half-value layer 1.2 cm)?',
      steps: [
        'Inverse square: $40 \\times (1/3)^2 = 4.4\\ \\mathrm{\\mu Sv/h}$.',
        'Lead: $5/1.2 = 4.2$ half-value layers, transmitting $2^{-4.2} = 0.056$.',
        'Together: $4.4 \\times 0.056 = 0.25\\ \\mathrm{\\mu Sv/h}$ — a working day adds about 2 µSv, well under a day of natural background (about 7 µSv).'
      ],
      a: '4.4 µSv/h at 3 m; 0.25 µSv/h with the lead.'
    }
  ],
  quiz: [
    { q: 'An alpha source is harmless held outside the body but dangerous if inhaled. Why?', choices: ['Alpha particles only become ionizing inside the body', 'The dead outer layer of skin stops them, but inside they deposit all their energy in living cells', 'The lungs concentrate the activity', 'Alpha particles turn into gamma rays inside the body'], a: 1,
      why: 'Alpha particles travel only a few hundredths of a millimetre in tissue. Outside, that is within dead skin; in the lungs it is living cells, and alpha damage has $w_R = 20$.' },
    { q: 'You move from 2 m to 4 m from a small gamma source. Your dose rate becomes…', choices: ['half', 'a quarter', 'an eighth', 'unchanged'], a: 1, why: 'From a point source the dose rate falls as $1/r^2$: doubling the distance gives $(1/2)^2 = 1/4$.' },
    { q: 'Tissue absorbs 1 mGy from alpha particles and, separately, 1 mGy from gamma rays. The equivalent doses are…', choices: ['1 mSv each', '20 mSv and 1 mSv', '1 mSv and 20 mSv', '20 mSv each'], a: 1, why: '$H = w_R D$ with $w_R = 20$ for alpha particles and 1 for gamma rays.' },
    { q: 'Food sterilized with gamma rays becomes radioactive.', a: false,
      why: 'Gamma rays from cobalt-60 or caesium-137 lack the energy to make nuclei radioactive; they only ionize molecules, killing bacteria.' },
    { q: 'Two half-value layers of shielding let through…', choices: ['50 %', '25 %', '0 %', '12.5 %'], a: 1, why: 'Each layer halves the intensity: $\\tfrac12 \\times \\tfrac12 = 25\\ \\%$. Attenuation is exponential, so it never quite reaches zero.' }
  ],
  applications: ['Radiotherapy plans deliver tens of grays to a tumour while sparing the tissue around it.', 'Film and electronic dosimeters worn by hospital and nuclear workers.', 'Radon testing and ventilation of basements in granite regions.', 'Sterilizing syringes, spices and surgical gloves with gamma rays or electron beams.']
}

);
