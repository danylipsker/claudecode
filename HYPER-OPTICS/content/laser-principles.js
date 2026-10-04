/* HYPER-OPTICS · content/laser-principles.js — the topic "How lasers work"
 *   stimulated-emission                   absorption, spontaneous and stimulated emission; gain needs N₂ > N₁
 *   population-inversion-and-pumping      three- and four-level schemes, pumping, threshold, quantum defect
 *   the-laser-cavity                      two mirrors, round-trip gain = loss, the output coupler, photon lifetime
 *   cavity-stability                      g₁g₂ between 0 and 1, the named cavities, the mode waist, unstable resonators
 *   laser-modes                           longitudinal modes c/2nL apart, transverse TEM patterns, mode selection
 *   linewidth-and-coherence-of-lasers     Δν, coherence time and length, fringe visibility, what sets a linewidth
 *   continuous-and-pulsed-lasers          CW and pulsed operation, energy, peak and average power, duty cycle
 *   q-switching-and-mode-locking          nanosecond giant pulses and femtosecond trains
 *   what-makes-laser-light-special        one wavelength, coherent, directional, bright: against a lamp and an LED
 *   laser-power-and-energy-measures       W and J, irradiance and fluence, what each matters for
 *   laser-safety-classes                  IEC 60825-1 classes, MPE and the nominal ocular hazard distance
 *   laser-eye-hazards-and-eyewear         where each wavelength is absorbed, retinal gain, optical density of eyewear
 * Simulations: sims/laser-principles.js (lp-…).
 */
Hyper.add(

/* ================================================================ stimulated emission */
{
  id: 'stimulated-emission', parent: 'laser-principles', title: 'Stimulated emission', level: 1,
  short: 'An excited atom can be made to emit by a passing photon of exactly the right energy, and the photon it emits is a perfect copy: same frequency, same direction, same polarization, same phase. Absorption, spontaneous emission and stimulated emission are the three ways light and atoms exchange energy; the third is the "S" and the "E" of "laser".',
  keywords: ['stimulated emission', 'spontaneous emission', 'absorption', 'Einstein coefficients', 'A and B coefficients', 'induced emission', 'photon cloning', 'amplification', 'LASER acronym', 'two-level atom', 'coherent amplification', 'cross-section', 'population'],
  prereq: ['photon-energy', 'how-light-is-made', 'physics:photon'],
  related: ['population-inversion-and-pumping', 'the-laser-cavity', 'what-makes-laser-light-special', 'coherence', 'light-emitting-diodes', 'laser-families-overview', 'physics:lasers'],
  body: `
A laser is named for what it does: **L**ight **A**mplification by **S**timulated **E**mission of **R**adiation. Everything else about it grows from the last three words, so begin there.

### Three things a photon and an atom can do
Give an atom two energy levels, a lower $E_1$ and an upper $E_2$, and light whose photon energy matches the gap, $h\\nu = E_2 - E_1$ ([[photon-energy]]). There are exactly three ways the two can exchange energy:

| Process | Starts with | Ends with | Rate per atom |
|---|---|---|---|
| **Absorption** | a photon, an atom in $E_1$ | the atom in $E_2$, the photon gone | $B_{12}\\,\\rho$ |
| **Spontaneous emission** | an atom in $E_2$ | the atom in $E_1$, a photon in a random direction and phase | $A_{21}$ |
| **Stimulated emission** | a photon, an atom in $E_2$ | the atom in $E_1$, **two** identical photons | $B_{21}\\,\\rho$ |

Here $\\rho$ is the energy density of the light at that frequency. Spontaneous emission is what every flame, filament and LED does: each atom drops on its own schedule and the photons are unrelated to one another. Stimulated emission is different in kind. The passing photon is not used up; it *triggers* the atom, and the second photon is a **clone** of the first, with the same frequency, the same direction, the same polarization, and in step with it. One photon in, two identical photons out.

### Why the copy is exact
Einstein found the third process in 1916–17 by asking how atoms could stay in thermal equilibrium with Planck's radiation. Absorption and spontaneous emission alone cannot do it; a process proportional to the radiation density itself is needed. For two non-degenerate levels his coefficients obey $B_{12} = B_{21}$: **an atom is exactly as likely to be stimulated down by a photon as to be lifted by it.** Whether a beam grows or fades therefore depends on one thing only, which level holds more atoms.

### Gain and the populations
Let a beam of intensity $I$ cross a medium with $N_2$ atoms per unit volume in the upper level and $N_1$ in the lower (equal statistical weights), and let $\\sigma$ be the **cross-section** of the transition:

$$\\frac{\\mathrm{d}I}{\\mathrm{d}z} = \\sigma\\,(N_2 - N_1)\\,I$$

If $N_2 < N_1$ the beam is absorbed, as in every ordinary material. If $N_2 > N_1$ it is **amplified**. For the 1064 nm line of Nd:YAG $\\sigma \\approx 3\\times10^{-19}$ cm², so $2\\times10^{16}$ excited ions per cm³ give a gain of about 0.6 % per centimetre.

### Why ordinary matter never amplifies
In thermal equilibrium the populations follow the Boltzmann ratio $N_2/N_1 = e^{-h\\nu/kT}$. For the red light of a helium–neon laser (632.8 nm, $h\\nu = 1.96$ eV) at 300 K that is about $10^{-33}$: essentially no atom is up, and absorption always wins. To amplify, the material has to be driven far from equilibrium so that the upper level holds *more* atoms than the lower, a **population inversion**: the subject of [[population-inversion-and-pumping]].

### What it is not
A laser does not make light from nothing: each stimulated photon carries energy that a pump stored in the atom. Stimulated emission alone does not make a beam either; it takes the feedback of a [[the-laser-cavity|cavity]] to turn an amplifier into an oscillator. And an LED emits by the spontaneous process; it becomes a laser diode only when its junction is also made to amplify and is placed between mirrors.

> [!key] A photon can lift an atom (absorption), an excited atom can drop alone (spontaneous emission), or a photon can make it drop and produce an exact copy of itself (stimulated emission). Copies outnumber losses only when more atoms are up than down.
`,
  ideas: [
    'A photon of the right energy can be absorbed by an atom, can trigger an excited atom to emit, and an excited atom can also emit by itself: three processes.',
    'Stimulated emission yields an exact clone of the triggering photon: same frequency, direction, polarization and phase.',
    'Per atom, absorption and stimulated emission are equally likely ($B_{12} = B_{21}$): a beam grows only if the upper level holds more atoms than the lower.',
    'The gain of a medium is $g = \\sigma(N_2 - N_1)$; negative gain is absorption.',
    'In thermal equilibrium at room temperature essentially no atoms are in the upper level of a visible transition (about $10^{-33}$): inversion has to be created.'
  ],
  pitfalls: [
    'A laser makes light out of nothing — It makes none: every stimulated photon is paid for by energy that the pump stored in the atoms. A laser is an energy converter with an unusually well-behaved output.',
    'Stimulated emission uses up the photon that triggers it — The triggering photon carries on, and the atom adds a second one. The count goes from one to two, which is what "amplification" means here.',
    'A bright lamp is bright because of stimulated emission — A lamp, a flame and an LED emit almost entirely spontaneously, however bright: the photons are independent, with random directions and phases. Only stimulated photons are clones.',
    'Any beam passing an excited atom is amplified — Only if its photon energy matches the transition and the atom is still excited, and in most media most atoms are in the ground state, so absorption beats stimulated emission.'
  ],
  terms: [
    { term: 'Stimulated emission', also: ['induced emission'], def: 'Emission of a photon by an excited atom or molecule that is triggered by a passing photon of the right energy. The new photon has the same frequency, direction, polarization and phase as the one that triggered it.' },
    { term: 'Spontaneous emission', def: 'Emission of a photon by an excited atom with no outside trigger, at a random moment (set by the lifetime of the level), in a random direction and with a random phase. It is how lamps, flames and LEDs make light.' },
    { term: 'Absorption', def: 'The taking up of a photon by an atom, which jumps from a lower to a higher level whose energy gap equals the photon energy.' },
    { term: 'Einstein coefficients', also: ['A and B coefficients', 'A₂₁', 'B₁₂', 'B₂₁'], def: 'A₂₁ is the probability per second of spontaneous emission; B₁₂ and B₂₁ give the rates of absorption and of stimulated emission per unit energy density of the light. For non-degenerate levels B₁₂ = B₂₁.' },
    { term: 'Cross-section', also: ['σ', 'transition cross-section'], def: 'A measure of how strongly a transition interacts with light: the effective area, usually in cm², that one atom presents to the beam. For Nd:YAG at 1064 nm it is about 3 × 10⁻¹⁹ cm².' },
    { term: 'Population', also: ['level population', 'N₁', 'N₂'], def: 'The number of atoms (per unit volume) in a given energy level. A medium amplifies light of the transition frequency only when the upper level has the larger population.' }
  ],
  formulas: [
    {
      name: 'Gain of a medium',
      expr: 'g = sigma*(N2 - N1)', tex: 'g = \\sigma\\,(N_{2} - N_{1})',
      vars: {
        g: { name: 'gain coefficient (negative: absorption)', q: 'wavenumber', unit: '1/cm', signed: true, tex: 'g' },
        sigma: { name: 'cross-section of the transition', q: 'area', unit: 'cm²', value: 2.8e-19, tex: '\\sigma' },
        N2: { name: 'atoms per volume in the upper level', q: 'numberdensity', unit: '1/cm³', value: 2e16, tex: 'N_{2}' },
        N1: { name: 'atoms per volume in the lower level', q: 'numberdensity', unit: '1/cm³', value: 1e13, tex: 'N_{1}' }
      },
      solveFor: 'g',
      note: 'For equal statistical weights of the two levels. The beam intensity changes as e^(gz).',
      stories: { g: 'A medium has {N2} atoms in the upper level and {N1} in the lower; the transition has a cross-section of {sigma}. What is the gain coefficient?', N2: 'A medium with a cross-section of {sigma} must provide a gain of {g} with {N1} atoms in the lower level. How many must be in the upper level?' }
    },
    {
      name: 'Thermal population ratio',
      expr: 'r = exp(-E/(kB*T))', tex: 'r = e^{-E/(k_{B}T)}',
      vars: {
        r: { name: 'population ratio N₂/N₁ in thermal equilibrium', tex: 'r' },
        E: { name: 'energy gap = photon energy', q: 'energy', unit: 'eV', value: 1.96, tex: 'E' },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300, tex: 'T' }
      },
      solveFor: 'r',
      note: 'The Boltzmann factor, for levels of equal statistical weight. For visible light the ratio is astronomically small at any temperature of everyday matter.',
      stories: { r: 'A transition has a gap of {E}. What fraction of the population N₂/N₁ is in the upper level at {T}?' }
    },
    {
      name: 'Photons carried by a beam',
      expr: 'n = P*lambda/(h*c)', tex: 'n = \\frac{P\\,\\lambda}{h\\,c}',
      vars: {
        n: { name: 'photons per second', q: 'rate', unit: '1/s', tex: 'n' },
        P: { name: 'power of the beam', q: 'power', unit: 'mW', value: 1, tex: 'P' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      solveFor: 'n',
      stories: { n: 'A beam of {P} at {lambda} falls on a detector. How many photons arrive each second?' }
    }
  ],
  examples: [
    {
      title: 'Nobody home in the upper level',
      q: 'How large is the population ratio $N_2/N_1$ at 300 K for the 632.8 nm line of a helium–neon laser, and what does it say about amplifying light with the gas unpumped?',
      steps: [
        'The photon energy is $h\\nu = 1239.84\\ \\mathrm{eV\\,nm} / 632.8\\ \\mathrm{nm} = 1.959$ eV.',
        'At 300 K, $kT = 0.02585$ eV, so the exponent is $-1.959/0.02585 = -75.8$.',
        { text: 'The ratio is', tex: '\\frac{N_2}{N_1} = e^{-75.8} \\approx 1.2\\times10^{-33}' }
      ],
      a: 'About one atom in $10^{33}$ is in the upper level. The unpumped gas absorbs the light and amplifies nothing; the pump has to create an inversion.'
    },
    {
      title: 'One pass through a rod',
      q: 'A 10 cm Nd:YAG rod holds $2\\times10^{16}$ excited ions per cm³ and has an empty lower level. The cross-section is $2.8\\times10^{-19}$ cm². By what factor is a weak beam amplified in one pass?',
      steps: [
        { text: 'The gain coefficient is', tex: 'g = \\sigma\\,N_2 = 2.8\\times10^{-19} \\times 2\\times10^{16} = 5.6\\times10^{-3}\\ \\mathrm{cm^{-1}}' },
        { text: 'Over 10 cm the beam intensity is multiplied by', tex: 'e^{gL} = e^{0.056} = 1.058' }
      ],
      a: 'A 5.8 % gain per pass. That is a lot of excited ions and still only a small amplification: a laser needs the beam to pass through the medium many times, which is the job of the mirrors.'
    }
  ],
  quiz: [
    { q: 'A photon passes an atom that is already excited and triggers it to emit. What does the new photon have in common with the first?', choices: ['Only its energy', 'Energy and polarization, but a random direction', 'Energy, direction, polarization and phase', 'Nothing: it is an independent photon'], a: 2, why: 'Stimulated emission clones the photon that triggered it, in every respect. A random direction and phase belong to spontaneous emission.' },
    { q: 'A medium has exactly as many atoms in the upper level as in the lower. A weak beam of the right wavelength passes through. What happens to it?', choices: ['It is amplified', 'It is absorbed', 'It emerges unchanged on average', 'It is split into two beams'], a: 2, why: 'Absorption and stimulated emission are equally likely per atom, so with equal populations they cancel: the medium is transparent. Inversion, $N_2 > N_1$, is needed for gain.' },
    { q: 'At room temperature, in thermal equilibrium, a gas of atoms with a visible transition can amplify light of that colour.', a: false, why: 'The Boltzmann ratio $e^{-h\\nu/kT}$ is about $10^{-33}$ for red light at 300 K: practically every atom is in the ground state, so the gas absorbs.' },
    { q: 'How many photons per second does a 1 mW He–Ne beam (632.8 nm) carry? Answer in photons per second.', answer: 3.19e15, unit: '1/s', why: 'Each photon has $1.959\\ \\mathrm{eV} = 3.14\\times10^{-19}$ J, so $10^{-3}\\ \\mathrm{W} / 3.14\\times10^{-19}\\ \\mathrm{J} = 3.2\\times10^{15}$ per second.' },
    { q: 'Why is an ordinary LED not a laser, although it emits light of one colour?', choices: ['Its light is not visible', 'It emits almost entirely spontaneously and has no feedback to turn amplification into a beam', 'Its photon energy is too low', 'It has no energy levels'], a: 1, why: 'An LED\'s photons are independent, with random directions and phases. A laser diode is an LED whose junction also amplifies by stimulated emission and sits between mirrors.' }
  ],
  applications: [
    'Every laser, from a pointer to a fusion driver: stimulated emission is the amplification, and mirrors add the feedback.',
    'Optical amplifiers: an erbium-doped fibre amplifier boosts 1550 nm telecommunication signals by stimulated emission, with no mirrors at all ([[fibre-optic-links]]).',
    'Masers, the microwave ancestors: hydrogen masers keep time in atomic clocks, and cooled ruby masers amplified the faint signals of early deep-space probes.',
    'Superluminescent diodes: spontaneous emission amplified by a single pass of stimulated emission gives bright, broad-band light for [[optical-coherence-tomography]].',
    'Natural masers: hydroxyl and water vapour in star-forming regions are inverted by starlight and shine at microwave frequencies.'
  ],
  history: 'Einstein introduced stimulated emission in 1916–17. The idea lay dormant until 1954, when Gordon, Zeiger and Townes at Columbia built an ammonia maser, amplifying microwaves by the same process, and Basov and Prokhorov in Moscow worked it out independently. Schawlow and Townes proposed an optical version in 1958. Gordon Gould coined the word "laser" in 1957, and Theodore Maiman made the first one, from ruby, at Hughes Research Laboratories on 16 May 1960. Townes, Basov and Prokhorov shared the 1964 Nobel Prize in Physics.',
  sources: [
    'A. Einstein, "Zur Quantentheorie der Strahlung", *Physikalische Zeitschrift* 18 (1917) 121 — where stimulated emission and the A and B coefficients are introduced.',
    'A. E. Siegman, *Lasers* (University Science Books) — the chapters on radiative transitions and on laser amplification.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — the chapters on photons and atoms, and on laser amplifiers.',
    'O. Svelto, *Principles of Lasers* — the first chapters on the interaction of radiation with matter.'
  ],
  sim: [{ id: 'lp-emission', params: { mode: 'stim' } }]
},

/* ================================================================ inversion and pumping */
{
  id: 'population-inversion-and-pumping', parent: 'laser-principles', title: 'Population inversion and pumping', level: 2,
  short: 'To amplify rather than absorb, more atoms must sit in the upper laser level than in the lower: a population inversion, which no material has in thermal equilibrium. A pump (light, electric current, collisions) drives it, and the level scheme, three-level or four-level, decides how hard the pumping must be.',
  keywords: ['population inversion', 'pumping', 'optical pumping', 'three-level laser', 'four-level laser', 'metastable level', 'threshold', 'pump power', 'flash lamp', 'diode pumping', 'quantum defect', 'ruby', 'Nd:YAG', 'gain clamping', 'slope efficiency'],
  prereq: ['stimulated-emission', 'photon-energy'],
  related: ['the-laser-cavity', 'solid-state-lasers', 'diode-lasers', 'helium-neon-laser', 'fibre-lasers', 'xenon-arc-and-flash-lamps', 'continuous-and-pulsed-lasers'],
  body: `
A laser needs more atoms in its upper level than in its lower one, and [[stimulated-emission|the previous page]] showed that matter never has that by itself. To get it, energy has to be fed in and kept flowing. That is **pumping**.

### The two-level trap
Pump a two-level system with light of the transition's own frequency. Absorption and stimulated emission are equally likely per atom ($B_{12} = B_{21}$), so the pump lifts atoms until the two levels are *equally* full and then drops as many as it lifts. The best it can do is make the medium transparent, never amplifying. An inversion needs a third level, or a fourth, so that the populations can be made unequal along a path the light does not retrace.

### Three levels: ruby
Theodore Maiman's laser of 1960 used chromium ions in a ruby rod. A flash lamp lifts the ions from the ground state into broad absorption bands (the green and blue light that makes ruby red); within nanoseconds they drop, without emitting light, into a **metastable** level that lives about 3 ms. The laser line, 694.3 nm, runs from that level back to the ground state. Because the lower laser level is the ground state, which starts full, **more than half of all the chromium ions must be lifted** before the upper level outnumbers it. For a rod holding $1.6\\times10^{19}$ ions per cm³ that is about $8\\times10^{18}$ per cm³: of order 3 J stored in every cubic centimetre, and tens of joules from the lamp, delivered in a violent flash.

### Four levels: Nd:YAG
In a four-level laser the lower laser level is *not* the ground state, and it drains into the ground state within nanoseconds. Neodymium in YAG is pumped near 808 nm into a band that empties quickly into the upper laser level (lifetime 230 µs); the 1064 nm line ends on a level about 0.26 eV above the ground state, which is empty at room temperature (a Boltzmann factor of $4\\times10^{-5}$) and stays empty. **Any** population in the upper level is now an inversion; the only hurdle is the loss of the cavity.

| | Three-level (ruby) | Four-level (Nd:YAG) |
|---|---|---|
| Lower laser level | the ground state | an empty level above it |
| Cross-section × ion density $\\sigma N$ | 0.4 cm⁻¹ | 39 cm⁻¹ |
| Ions that must be up at threshold, for a loss $g = 0.01$ cm⁻¹ | just over half (51 %) | $2.6\\times10^{-4}$ of them |
| Practical operation | pulsed | continuous or pulsed |

(Typical rod values: ruby 0.05 % chromium by weight, $\\sigma = 2.5\\times10^{-20}$ cm²; Nd:YAG 1 % neodymium, $\\sigma = 2.8\\times10^{-19}$ cm².)

### Threshold, and gain clamping
The gain is $g = \\sigma N\\,\\Delta n$, with $\\Delta n$ the inversion as a fraction of all the ions. The laser starts when $g$ reaches the loss of the cavity. From then on the gain is **clamped**: every extra bit of pump makes more light, not more gain, so the output rises roughly linearly above threshold, with a *slope efficiency* that depends on the laser.

### How the pump is delivered
- **Light.** Flash lamps and arc lamps, whose broad spectrum suits solid-state crystals with broad absorption bands; **laser diodes** tuned to the absorption line (808 nm for neodymium, 976 nm for ytterbium), which put far less heat into the crystal; or another laser, as a green laser pumps a Ti:sapphire laser.
- **Electric current.** In a gas discharge (He–Ne, argon, CO₂) electrons excite the atoms by collision. In a diode laser the current itself injects the electrons and holes whose recombination makes the light.
- **Efficiency.** The ratio of laser to pump photon energy, the **quantum defect**, caps the efficiency: 808 nm pump to 1064 nm laser, 76 %; 976 nm to 1030 nm in ytterbium, 95 %. The rest is heat. Whole-system "wall-plug" efficiencies are typically below 0.1 % for He–Ne, 1–3 % for flash-lamp Nd:YAG, 10–30 % for diode-pumped solid-state lasers and 30–50 % for fibre lasers and diodes.

> [!key] Inversion needs a pump and at least three levels. A four-level scheme, with an empty lower level, needs only a trace of inversion; a three-level scheme needs over half the ions lifted. Above threshold the gain stays pinned at the loss and the extra pump becomes output.
`,
  ideas: [
    'A two-level system cannot be inverted by light of its own frequency: the best a pump achieves is equal populations (transparency).',
    'In a three-level laser the lower level is the ground state, so more than half the ions must be pumped up before there is gain.',
    'In a four-level laser the lower laser level drains quickly and is empty, so a small inversion is enough and the threshold is far lower.',
    'The threshold inversion is the loss of the cavity divided by $\\sigma N$; above threshold the gain is clamped at the loss.',
    'The quantum defect (laser photon energy ÷ pump photon energy) is the ceiling on pumping efficiency; diode pumping at the absorption line wastes little as heat.'
  ],
  pitfalls: [
    'Pump harder with the laser\'s own light and you will get inversion — Light of the transition frequency absorbs and stimulates equally, so it can only equalize the populations. A third or fourth level is what allows inversion.',
    'A three-level laser is just a four-level laser with worse luck — The difference is structural: its lower level is the full ground state, so over half the ions must be excited, which is why ruby works only in flashes while Nd:YAG runs continuously.',
    'Above threshold the gain keeps rising with the pump — It stays at the value of the loss. The extra pump energy is turned into more laser light.',
    'Pump efficiency means electrical efficiency — The quantum defect only limits the optical conversion; the lamp or diode, the coupling of its light and the heat removal all lower the overall wall-plug efficiency further.'
  ],
  terms: [
    { term: 'Population inversion', also: ['inversion', 'N₂ > N₁'], def: 'A state in which the upper level of a transition holds more atoms than the lower level. It is not found in thermal equilibrium and is the condition for amplification by stimulated emission.' },
    { term: 'Pumping', also: ['optical pumping', 'electrical pumping'], def: 'Supplying energy to the gain medium, as light, electric current or collisions, to create and maintain a population inversion.' },
    { term: 'Metastable level', def: 'An excited level with a long lifetime (microseconds to milliseconds), because its decay to lower levels is weakly allowed. Atoms pile up in it, which makes an inversion possible: the 3 ms level of ruby, the 230 µs level of Nd:YAG.' },
    { term: 'Three-level laser', def: 'A laser whose lower laser level is the ground state. More than half of the active ions must be excited before there is gain, so the threshold is high; ruby is the classic example.' },
    { term: 'Four-level laser', def: 'A laser whose lower laser level lies above the ground state and empties rapidly, so even a small population in the upper level is an inversion. Nd:YAG, He–Ne and most efficient lasers are four-level.' },
    { term: 'Quantum defect', def: 'The difference in energy between a pump photon and a laser photon, which ends up as heat. The ratio of their wavelengths (pump ÷ laser) is the greatest efficiency the scheme can reach.' },
    { term: 'Threshold', def: 'The pump level at which the gain of the medium equals the losses of the cavity and laser action begins.' }
  ],
  formulas: [
    {
      name: 'Inversion needed at threshold',
      expr: 'x = gth/(sigma*N)', tex: 'x = \\frac{g_{th}}{\\sigma\\,N}',
      vars: {
        x: { name: 'fraction of the ions that must be inverted', q: 'ratio', unit: '%', tex: 'x' },
        gth: { name: 'threshold gain (the loss to be made up)', q: 'wavenumber', unit: '1/cm', value: 0.01, tex: 'g_{th}' },
        sigma: { name: 'cross-section', q: 'area', unit: 'cm²', value: 2.8e-19, tex: '\\sigma' },
        N: { name: 'density of active ions', q: 'numberdensity', unit: '1/cm³', value: 1.4e20, tex: 'N' }
      },
      solveFor: 'x',
      note: 'For a four-level medium: the inversion is the upper-level fraction. For a three-level medium add the lower-level population: at threshold the upper fraction is (1 + x)/2.',
      stories: { x: 'A cavity needs a gain of {gth}. The rod has {N} active ions with a cross-section of {sigma}. What fraction of them must be in the upper level?' }
    },
    {
      name: 'Quantum defect: the greatest pump efficiency',
      expr: 'eta = lp/ll', tex: '\\eta = \\frac{\\lambda_{p}}{\\lambda_{L}}',
      vars: {
        eta: { name: 'highest possible efficiency of the conversion', q: 'ratio', unit: '%', tex: '\\eta' },
        lp: { name: 'pump wavelength', q: 'length', unit: 'nm', value: 808, tex: '\\lambda_{p}' },
        ll: { name: 'laser wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda_{L}' }
      },
      solveFor: 'eta',
      note: 'The photon energy ratio. The rest of the pump energy becomes heat in the medium.',
      stories: { eta: 'A crystal is pumped at {lp} and lases at {ll}. What is the greatest fraction of the pump energy that can come out as laser light?' }
    },
    {
      name: 'Pump power that holds the inversion',
      expr: 'Pth = h*c*N2*Vol/(lp*tau)', tex: 'P = \\frac{h\\,c\\,N_{2}\\,V}{\\lambda_{p}\\,\\tau}',
      vars: {
        Pth: { name: 'absorbed pump power', q: 'power', unit: 'W', tex: 'P' },
        h: { const: 'h' },
        c: { const: 'c' },
        N2: { name: 'inverted ions per volume', q: 'numberdensity', unit: '1/cm³', value: 3.6e15, tex: 'N_{2}' },
        Vol: { name: 'pumped volume', q: 'volume', unit: 'cm³', value: 1, tex: 'V' },
        lp: { name: 'pump wavelength', q: 'length', unit: 'nm', value: 808, tex: '\\lambda_{p}' },
        tau: { name: 'lifetime of the upper level', q: 'time', unit: 'µs', value: 230, tex: '\\tau' }
      },
      solveFor: 'Pth',
      note: 'Every excited ion decays after about one lifetime and must be replaced by one pump photon. This is the least power needed to hold the inversion; a real laser needs more.',
      stories: { Pth: 'A volume of {Vol} must hold {N2} excited ions with a lifetime of {tau}, pumped at {lp}. What is the least absorbed pump power?' }
    }
  ],
  examples: [
    {
      title: 'Why ruby needs flashes and Nd:YAG does not',
      q: 'Two rods of 1 cm³ need the same cavity loss, $g_{th} = 0.01\\ \\mathrm{cm^{-1}}$. Compare the energy that must be stored in the excited ions of a ruby rod ($1.6\\times10^{19}$ Cr ions per cm³, 550 nm pump photons) and of an Nd:YAG rod ($N_2 = g_{th}/\\sigma$, $\\sigma = 2.8\\times10^{-19}$ cm²).',
      steps: [
        'Ruby, three-level: over half the ions, about $8\\times10^{18}$, must be excited. Each stores about 2.25 eV = $3.6\\times10^{-19}$ J, so the rod holds about 2.8 J.',
        { text: 'Nd:YAG, four-level: only', tex: 'N_2 = \\frac{g_{th}}{\\sigma} = \\frac{0.01}{2.8\\times10^{-19}} = 3.6\\times10^{15}\\ \\mathrm{cm^{-3}}' },
        'Each stores 1.17 eV (1064 nm), so the rod holds about $6.7\\times10^{-4}$ J.'
      ],
      a: 'About 2.8 J against 0.7 mJ: roughly four thousand times more energy in the ruby rod. The ruby must be pumped in a brief flash; the Nd:YAG can be held just above threshold continuously.'
    },
    {
      title: 'Holding the inversion in Nd:YAG',
      q: 'How much pump power at 808 nm must be absorbed to hold $3.6\\times10^{15}$ excited ions per cm³ in 1 cm³ of Nd:YAG, if the upper level lives 230 µs?',
      steps: [
        'An 808 nm photon carries $h\\nu = 2.46\\times10^{-19}$ J.',
        { text: 'The ions must be re-excited once per lifetime:', tex: 'P = \\frac{N_2 V\\,h\\nu}{\\tau} = \\frac{3.6\\times10^{15} \\times 2.46\\times10^{-19}\\ \\mathrm{J}}{230\\times10^{-6}\\ \\mathrm{s}} = 3.8\\ \\mathrm{W}' }
      ],
      a: 'About 4 W absorbed, as a floor: real lasers need more because not all of the pump reaches the upper level, but it shows why a few-watt diode can drive a small Nd:YAG laser.'
    }
  ],
  quiz: [
    { q: 'Why can a two-level atom not be inverted by pumping it with light of its own transition frequency?', choices: ['The atoms cool down', 'The light is too weak', 'The upper level decays at once', 'Absorption and stimulated emission are equally probable per atom, so the populations only equalize'], a: 3, why: 'With $B_{12} = B_{21}$ the pump lifts atoms exactly as fast as it stimulates them down once the levels are equally full. Inversion needs a third or fourth level.' },
    { q: 'What must be true of the lower laser level of a four-level laser?', choices: ['It must empty quickly', 'It must be the ground state', 'It must live a long time', 'It must lie above the pump band'], a: 0, why: 'A lower laser level that drains fast stays almost empty, so any atom in the upper level is an inversion. A long-lived lower level would fill up and stop the laser (a "self-terminating" transition).' },
    { q: 'A ruby laser needs more than half of its chromium ions excited before it can amplify.', a: true, why: 'The lower laser level is the ground state, which starts with all the ions. The upper level must outnumber it, so over 50 % must be lifted.' },
    { q: 'A crystal is pumped at 976 nm and lases at 1030 nm. What is the greatest efficiency of the conversion (the quantum defect limit), in per cent?', answer: 94.8, unit: '%', why: 'The photon energy ratio is the wavelength ratio, $976/1030 = 0.948$. The remaining 5 % is heat.' },
    { q: 'A laser is running steadily well above threshold. If you raise the pump power, the gain of the medium…', choices: ['rises in proportion', 'stays equal to the loss, and the output power rises', 'falls to zero', 'rises, but the output stays constant'], a: 1, why: 'Gain clamping: the gain stays pinned at the loss. The additional excitation is converted into more stimulated emission, i.e. more output.' }
  ],
  applications: [
    'Ruby and flash-lamp lasers: pulsed three-level systems, once the workhorses of holography and tattoo removal.',
    'Diode-pumped solid-state lasers: a diode at 808 nm or 976 nm pumps Nd or Yb crystals with a small quantum defect, giving compact green pointers and kilowatt-class industrial lasers ([[solid-state-lasers]]).',
    'Erbium-doped fibre amplifiers, pumped at 980 or 1480 nm: a three-level-like system whose pump power sets the gain.',
    'Gas lasers: He–Ne, argon, CO₂ are pumped by a discharge, in which electron collisions and, in He–Ne, resonant energy transfer from helium create the inversion.',
    'Semiconductor lasers: the injection current creates the inversion directly, with no separate pump light ([[diode-lasers]]).'
  ],
  history: 'Bloembergen proposed the three-level scheme for masers in 1956, and Maiman used it in his ruby laser four years later. The first four-level laser, uranium-doped calcium fluoride, was demonstrated by Sorokin and Stevenson at IBM in late 1960. Nd:YAG, the four-level crystal that dominates solid-state lasers, was first run at Bell Laboratories in 1964 by Geusic, Marcos and Van Uitert.',
  sources: [
    'A. E. Siegman, *Lasers* — the chapters on laser pumping and on three- and four-level systems.',
    'O. Svelto, *Principles of Lasers* — pumping processes and the rate equations of three- and four-level lasers.',
    'W. Koechner, *Solid-State Laser Engineering* — ruby and Nd:YAG: spectroscopic data and pumping.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — laser amplifiers and the conditions for inversion.'
  ],
  sim: 'lp-inversion'
},

/* ================================================================ the cavity */
{
  id: 'the-laser-cavity', parent: 'laser-principles', title: 'The laser cavity', level: 1,
  short: 'Two mirrors with a gain medium between them, one of them partly transparent so that the beam can leave: that is a laser. The light makes round trips, grows while the gain exceeds the losses, and settles where gain equals loss. The cavity supplies feedback and, by its geometry, chooses what the beam can look like.',
  keywords: ['laser cavity', 'resonator', 'optical cavity', 'output coupler', 'feedback', 'threshold', 'round trip', 'photon lifetime', 'oscillator', 'Fabry-Perot', 'saturation', 'gain equals loss', 'ring cavity', 'circulating power', 'back mirror'],
  prereq: ['stimulated-emission', 'population-inversion-and-pumping'],
  related: ['cavity-stability', 'laser-modes', 'linewidth-and-coherence-of-lasers', 'q-switching-and-mode-locking', 'fabry-perot-interferometer', 'dielectric-mirrors', 'helium-neon-laser', 'diode-lasers'],
  body: `
An amplifier makes light stronger as it passes through. A **laser** is an amplifier given *feedback*: put a mirror at each end of the gain medium and the light travels back and forth, growing every time, until its own strength drags the gain down to the level of the losses. The mirrors and the space between them are the **laser cavity**, or resonator. The laser is an oscillator in exactly the sense of an electronic one: an amplifier whose output is fed back to its input.

### The round trip
Follow the light once round. It crosses the gain medium twice and meets two mirrors, of reflectance $R_1$ and $R_2$. If other losses (scattering, a dirty window) take a fraction $\\delta$ per round trip, then for a medium of length $L$ and gain coefficient $g$ the power is multiplied, per round trip, by

$$R_1\\,R_2\\,(1 - \\delta)\\,e^{2gL}$$

If that exceeds 1 the light grows; if it is below 1 the light dies away. **Threshold** is where it equals 1:

$$2\\,g_{th}\\,L = \\ln\\frac{1}{R_1R_2(1-\\delta)}$$

A 30 cm He–Ne tube with $R_1 = 99.9\\,\\%$, $R_2 = 99\\,\\%$ and 0.5 % other loss needs a threshold gain of 0.027 m⁻¹, just 0.8 % per pass: the medium can give a few per cent at most, which is why laser mirrors have to be so good.

### Build-up and steady state
The light starts as a trace of spontaneous emission, the few photons that happen to travel along the axis. While the round-trip factor exceeds 1 they grow exponentially. But a strong beam *depletes* the inversion faster than the pump can refill it (**saturation**), so the gain falls as the power rises, until the round-trip factor is exactly 1. There the power stays constant. The defining feature of a running laser is that **the gain is clamped to equal the loss**; the simulation shows the power climbing and then levelling off.

### Where the beam comes out
One mirror, the **output coupler**, is partly transparent, with transmission $T_2 = 1 - R_2$. The light that leaves is the useful output; it is also a loss that the gain must beat.

| Laser | Typical output coupler |
|---|---|
| Helium–neon | $R_2 \\approx 99\\,\\%$ ($T \\approx 1\\,\\%$) |
| Laser diode | the cleaved semiconductor facet itself: $((n-1)/(n+1))^2 \\approx 31\\,\\%$ for $n = 3.5$ |
| Solid-state rod | a few per cent up to about half transmitted |

The power travelling inside is larger than the output by about $1/T_2$: 1 mW from a 1 % coupler means about 100 mW circulating. Too little coupling and the light is eaten by internal losses before it can leave; too much and the threshold rises until the laser stops. In between there is a **best coupling** (the second graph in the simulation).

### Time scales
The round trip takes $2L/c$: 2 ns for 30 cm. The **photon lifetime** is about that time divided by the fraction lost per round trip: with 1.1 % lost, 180 ns, or about 90 round trips and a 54 m path. This lifetime governs how fast a laser can react and the width of the pulses in [[q-switching-and-mode-locking]].

### What the cavity does besides feedback
- It chooses the **direction**: only light along the axis is fed back; anything else leaves after a few passes. That is why laser beams are narrow.
- It chooses the **frequencies**: only waves that fit between the mirrors survive ([[laser-modes]]).
- It chooses the **shape** of the beam: a stable geometry has a Gaussian mode ([[cavity-stability]]).

Two flat or curved mirrors form a Fabry–Perot cavity; a **ring** cavity sends light round a loop so that a wave travels one way only; in diode and fibre lasers the feedback comes from gratings or from the facets themselves.

> [!key] A laser is an amplifier with feedback. In steady operation the round-trip gain, $R_1R_2(1-\\delta)e^{2gL}$, is exactly 1: saturation pulls the gain down to the loss. The output coupler is the deliberate leak that carries the beam out.
`,
  ideas: [
    'Mirrors turn an amplifier into an oscillator: the light is amplified on every round trip until the gain falls to equal the loss.',
    'Threshold: $2g_{th}L = \\ln[1/(R_1R_2(1-\\delta))]$; below it the light dies away, above it the light grows.',
    'Saturation clamps the gain at the loss; the extra pump becomes output.',
    'The output coupler is a deliberate loss: too little wastes power inside, too much raises the threshold; there is an optimum.',
    'The circulating power is about the output divided by the coupler\'s transmission, and a photon lives in the cavity for about the round-trip time divided by the loss per round trip.'
  ],
  pitfalls: [
    'The mirrors amplify the light — They only return it. The gain medium amplifies, a little at each pass, and the mirrors let it pass again and again.',
    'A better output mirror is always one that reflects more — A mirror that reflects too much leaves the power trapped and wasted in internal losses. For a given gain there is a best transmission.',
    'A laser keeps growing until the pump is exhausted — Saturation pulls the gain down to the loss, and the power settles at a steady value set by the pump above threshold.',
    'The output power equals the power inside the cavity — Inside, the beam is stronger by roughly $1/T$: a 1 mW He–Ne beam is 100 mW within the tube, travelling both ways.'
  ],
  terms: [
    { term: 'Laser cavity', also: ['optical resonator', 'resonator'], def: 'The arrangement of mirrors (or gratings) that feeds the light back through the gain medium. It sets the direction, the frequencies and the transverse shape of the laser beam.' },
    { term: 'Output coupler', also: ['OC', 'output mirror'], def: 'The partly transmitting mirror of a laser cavity through which the beam leaves. Its transmission is the main design choice of a laser: too small and the power is wasted inside, too large and the laser cannot reach threshold.' },
    { term: 'Round-trip gain', def: 'The factor by which the light power changes in one complete trip through the cavity: gain of the medium (twice) times the reflectances and other losses. It is 1 in steady operation.' },
    { term: 'Saturation', also: ['gain saturation', 'gain clamping'], def: 'The fall of the gain as the light grows strong enough to deplete the inversion. It holds the gain of a running laser at the level of the losses.' },
    { term: 'Photon lifetime', also: ['cavity lifetime', 'τ_c'], def: 'The mean time a photon survives in the cavity: about the round-trip time divided by the fraction of the power lost per round trip. It sets how quickly a laser responds and how short a Q-switched pulse can be.' },
    { term: 'Ring cavity', def: 'A cavity in which light circulates round a closed loop of mirrors, so a wave travels in one direction only; used for single-frequency and ring-gyroscope lasers.' }
  ],
  formulas: [
    {
      name: 'Threshold condition',
      expr: 'R1*R2*(1 - d)*exp(2*g*L) = 1', tex: 'R_{1}\\,R_{2}\\,(1 - \\delta)\\,e^{2gL} = 1',
      vars: {
        R1: { name: 'reflectance of the back mirror', q: 'ratio', unit: '%', value: 99.9, min: 1, max: 99.999, tex: 'R_{1}' },
        R2: { name: 'reflectance of the output coupler', q: 'ratio', unit: '%', value: 99, min: 1, max: 99.999, tex: 'R_{2}' },
        d: { name: 'other losses per round trip', q: 'ratio', unit: '%', value: 0.5, min: 0, max: 50, tex: '\\delta' },
        g: { name: 'threshold gain coefficient', q: 'wavenumber', unit: '1/m', tex: 'g' },
        L: { name: 'length of the gain medium (the cavity)', q: 'length', unit: 'm', value: 0.3, tex: 'L' }
      },
      solveFor: 'g',
      note: 'The gain medium is taken to fill the cavity. Gain per pass at threshold = e^(gL) − 1.',
      stories: { g: 'A cavity {L} long has mirrors of {R1} and {R2} and loses {d} otherwise per round trip. What gain coefficient does the medium need to reach threshold?' }
    },
    {
      name: 'Photon lifetime',
      expr: 'tc = 2*L/(c*loss)', tex: '\\tau_{c} = \\frac{2L}{c\\,\\ell}',
      vars: {
        tc: { name: 'photon lifetime', q: 'time', unit: 'ns', tex: '\\tau_{c}' },
        L: { name: 'length of the cavity', q: 'length', unit: 'm', value: 0.3, tex: 'L' },
        c: { const: 'c' },
        loss: { name: 'fraction of the power lost per round trip', q: 'ratio', unit: '%', value: 1.1, min: 0.001, max: 100, tex: '\\ell' }
      },
      solveFor: 'tc',
      note: 'Round-trip time 2L/c divided by the loss per round trip; good for losses of a few tens of per cent or less.',
      stories: { tc: 'A cavity {L} long loses {loss} of the power per round trip. How long does a photon live in it?' }
    },
    {
      name: 'Power circulating inside',
      expr: 'Pin = Pout/T', tex: 'P_{in} = \\frac{P_{out}}{T}',
      vars: {
        Pin: { name: 'power travelling inside in one direction', q: 'power', unit: 'mW', tex: 'P_{in}' },
        Pout: { name: 'output power', q: 'power', unit: 'mW', value: 1, tex: 'P_{out}' },
        T: { name: 'transmission of the output coupler', q: 'ratio', unit: '%', value: 1, min: 0.001, max: 100, tex: 'T' }
      },
      solveFor: 'Pin',
      note: 'Valid when the other losses are small compared with the output coupling.',
      stories: { Pin: 'A laser delivers {Pout} through an output coupler that transmits {T}. How much power travels inside?' }
    }
  ],
  examples: [
    {
      title: 'The gain a helium–neon tube needs',
      q: 'A He–Ne tube is 30 cm long. The back mirror reflects 99.9 %, the output coupler 99 %, and other losses take 0.5 % per round trip. What gain per pass must the discharge provide to reach threshold?',
      steps: [
        { text: 'The round-trip factor from the mirrors and losses is', tex: 'R_1R_2(1-\\delta) = 0.999 \\times 0.99 \\times 0.995 = 0.9841' },
        { text: 'The gain must make up for it over the two passes:', tex: 'e^{2gL} = \\frac{1}{0.9841} \\quad\\Rightarrow\\quad gL = \\frac{1}{2}\\ln 1.0162 = 0.0080' },
        'So the gain per pass is $e^{0.0080} - 1 = 0.8\\,\\%$, and $g = 0.027\\ \\mathrm{m^{-1}}$.'
      ],
      a: 'A gain of 0.8 % per pass is enough. A tube that can give a few per cent runs comfortably above threshold.'
    },
    {
      title: 'Why a diode needs no mirror coating',
      q: 'The cleaved end of a gallium-arsenide laser chip ($n = 3.5$) meets air. What fraction of the light does the facet reflect at normal incidence, and what does that make it?',
      steps: [
        { text: 'The Fresnel reflectance at normal incidence is', tex: 'R = \\left(\\frac{n-1}{n+1}\\right)^2 = \\left(\\frac{2.5}{4.5}\\right)^2 = 0.31' }
      ],
      a: 'The bare facet reflects 31 %. That is enough, because a diode\'s gain is large (about 40 cm⁻¹ at threshold) over a path of a third of a millimetre; both facets serve as mirrors and about 69 % of the light leaves through each uncoated facet.'
    }
  ],
  quiz: [
    { q: 'A laser is running steadily. What is the round-trip gain, counting the mirrors and all losses?', choices: ['Exactly 1', 'Greater than 1 and growing', 'Less than 1', 'It depends on the colour only'], a: 0, why: 'Saturation lowers the gain until amplification exactly balances the losses (including the useful output). If the factor were above 1 the power would still be rising; below 1 it would be dying away.' },
    { q: 'Raising the transmission of the output coupler, with everything else fixed, always raises the output power.', a: false, why: 'More transmission means more output for a given circulating power, but it also raises the threshold and lowers the circulating power. Past an optimum the output falls, and the laser stops altogether if the coupling is too high.' },
    { q: 'A laser has a 2 % output coupler and delivers 5 mW. About how much power travels inside the cavity, in milliwatts?', answer: 250, unit: 'mW', why: '$P_{in} \\approx P_{out}/T = 5/0.02 = 250$ mW, if the other losses are small.' },
    { q: 'A cavity is 60 cm long and loses 2 % of the power per round trip. What is the photon lifetime, in nanoseconds?', answer: 200, unit: 'ns', why: 'The round trip takes $2L/c = 1.2\\ \\mathrm{m}/(3\\times10^8\\ \\mathrm{m/s}) = 4$ ns; dividing by the 2 % lost per round trip gives 200 ns, about 50 round trips.' },
    { q: 'Why does light that travels at an angle to the axis of a laser cavity not contribute to the beam?', choices: ['It is absorbed by the gain medium', 'It leaves the cavity after a few reflections and is never fed back often enough to grow', 'It has the wrong colour', 'It is cancelled by interference'], a: 1, why: 'Only light close to the axis is returned by the mirrors pass after pass and so amplified many times. Off-axis light escapes after a few passes, which is why laser beams are directional.' }
  ],
  applications: [
    'Helium–neon laser tubes: a long, narrow discharge with one back mirror and a 99 % output coupler, built to give a few milliwatts.',
    'Diode lasers: the cleaved facets of the chip, 31 % reflecting, form the whole cavity.',
    'Fibre lasers: a doped fibre between two fibre Bragg gratings, one a high reflector and one the output coupler ([[fibre-lasers]]).',
    'Ring laser gyroscopes: two beams circulate in opposite directions round a loop cavity and their beat measures rotation.',
    'Fabry–Perot interferometers and optical reference cavities use the same two-mirror geometry without the gain ([[fabry-perot-interferometer]]).'
  ],
  history: 'The two-mirror cavity is the Fabry–Perot interferometer of 1899, and Schawlow and Townes proposed it for the optical maser in 1958; Maiman simply silvered the polished ends of his ruby rod. Fox and Li at Bell Laboratories computed in 1961 what field patterns survive between two mirrors, and Boyd and Gordon worked out the confocal cavity the same year; between them they turned "a pair of mirrors" into the theory of resonators used today.',
  sources: [
    'A. E. Siegman, *Lasers* — the chapters on laser oscillation, threshold and output coupling.',
    'O. Svelto, *Principles of Lasers* — the continuous-wave laser: threshold, power and optimum output coupling.',
    'A. G. Fox and T. Li, "Resonant modes in a maser interferometer", *Bell System Technical Journal* 40 (1961) 453.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — laser oscillators.'
  ],
  sim: 'lp-cavity'
},

/* ================================================================ stability */
{
  id: 'cavity-stability', parent: 'laser-principles', title: 'Cavity stability', level: 2,
  short: 'Two mirrors a distance L apart, with radii R₁ and R₂, trap light only if g₁g₂ = (1 − L/R₁)(1 − L/R₂) lies between 0 and 1. Plane-parallel, confocal, concentric and hemispherical cavities sit on or at the edge of the stable region; outside it a ray walks off the mirrors, which high-power lasers exploit on purpose.',
  keywords: ['cavity stability', 'stability diagram', 'g parameter', 'g1 g2', 'plane-parallel', 'confocal', 'concentric', 'hemispherical', 'unstable resonator', 'resonator', 'mode waist', 'half-symmetric', 'ray matrix', 'alignment tolerance', 'thermal lens'],
  prereq: ['the-laser-cavity', 'curved-mirrors', 'the-gaussian-beam'],
  related: ['laser-modes', 'beam-waist-and-divergence', 'helium-neon-laser', 'fabry-perot-interferometer', 'focal-length-and-optical-power', 'solid-state-lasers', 'co2-and-excimer-lasers'],
  body: `
Put two mirrors face to face and send a ray in, a little off the axis. Will it stay between them? With flat mirrors a tilted ray walks sideways and escapes after a few passes. Curved mirrors *refocus* it at each reflection and can trap it for ever. A cavity that traps rays is **stable**, and a stable cavity has a well-defined Gaussian beam as its mode ([[the-gaussian-beam]]).

### The g parameters
Describe each mirror by

$$g = 1 - \\frac{L}{R}$$

where $L$ is the distance between the mirrors and $R$ the radius of curvature, positive for a mirror that is concave towards the cavity. A flat mirror has $R = \\infty$ and $g = 1$. The cavity is **stable** when

$$0 \\le g_1 g_2 \\le 1$$

Plotted as $g_2$ against $g_1$, that is the region between the axes and the hyperbola $g_1g_2 = 1$ in the first and third quadrants (the green area of the simulation). The condition comes straight from ray matrices: one round trip has the half-trace $2g_1g_2 - 1$, and a ray stays bounded only if that lies between $-1$ and $1$.

### Named cavities
| Cavity | $R_1$, $R_2$ | $g_1$, $g_2$ | $g_1g_2$ | Character |
|---|---|---|---|---|
| Plane-parallel | ∞, ∞ | 1, 1 | 1 | on the edge: a ray with the least tilt walks off; needs perfect alignment |
| Large-radius symmetric | $4L$, $4L$ | 0.75, 0.75 | 0.56 | stable, a large mode that fills a big gain volume |
| Half-symmetric (flat + concave) | ∞, $R > L$ | 1, $1 - L/R$ | 0 to 1 | the usual He–Ne and rod-laser geometry; stable while $L < R$ |
| Confocal | $L$, $L$ | 0, 0 | 0 | a ray retraces its path after two round trips; the smallest mirror spots of any symmetric cavity |
| Hemispherical | ∞, $L$ | 1, 0 | 0 | on the edge: a tiny waist on the flat mirror |
| Concentric | $L/2$, $L/2$ | −1, −1 | 1 | on the edge: a tiny waist at the centre |
| Unstable | for instance convex + concave | | above 1 or below 0 | a ray escapes round the mirror |

### The size of the mode
A stable cavity has a mode with a beam waist of radius

$$w_0^2 = \\frac{\\lambda L}{\\pi}\\sqrt{\\frac{g_1g_2\\,(1 - g_1g_2)}{(g_1 + g_2 - 2g_1g_2)^2}}$$

For a symmetric cavity ($g_1 = g_2 = g$) this is $w_0^2 = \\frac{\\lambda L}{2\\pi}\\sqrt{\\frac{1+g}{1-g}}$. A confocal cavity 0.5 m long at 632.8 nm has $w_0 = 0.22$ mm. A He–Ne tube of 30 cm with a flat mirror and a concave one of 50 cm ($g = 1$ and 0.4) has $w_0 = 0.22$ mm too, and the beam leaves with a divergence $\\lambda/\\pi w_0 = 0.9$ mrad ([[beam-waist-and-divergence]]). As the point in the diagram approaches the edge, the waist shrinks and the spot on one mirror grows without limit: diffraction loss rises and the alignment becomes critical.

### Why a given geometry is chosen
- **A big mode** extracts power from a big gain volume, which wants $g_1g_2$ near 1; the price is sensitivity to tilt.
- **A small, matched waist** is wanted at the crystal in an end-pumped laser, where the pump spot and the mode must overlap.
- **Thermal lensing:** a pumped rod heats and becomes a lens whose power grows with the pump. The cavity is stable only over a range of pump powers, a *stability zone*, and high-power designs are drawn to sit in the middle of it.

### Unstable resonators
Outside the stable region a ray's height grows by a fixed factor, the **magnification** $M$, every round trip, and the beam spills round the edge of the smaller mirror. For a confocal unstable resonator with round mirrors a fraction $1 - 1/M^2$ of the power leaves per round trip as output, with no partially reflecting mirror to burn. The loss is large, so it suits only high-gain media (CO₂, excimer, big Nd:glass), but it fills a large gain volume with a beam that is not Gaussian but a ring, which is cleaned up later.

> [!key] A two-mirror cavity is stable when $0 \\le g_1g_2 \\le 1$, $g = 1 - L/R$. The edges (plane-parallel, hemispherical, concentric) give extreme waists and extreme alignment sensitivity; the confocal point is the symmetric cavity with the smallest mirror spots. Outside, rays escape: wanted only in high-gain lasers.
`,
  derivation: {
    title: 'Why the condition is 0 ≤ g₁g₂ ≤ 1',
    intro: 'Treat each mirror as a thin lens of focal length $R/2$ and follow a ray, written as a height and a slope, once round the cavity: across $L$, off mirror 2, across $L$, off mirror 1.',
    steps: [
      { text: 'Multiply the four ray matrices. With $g_i = 1 - L/R_i$ the diagonal elements of the round-trip matrix come out as', tex: 'A = 2g_2 - 1 \\qquad D = 4g_1g_2 - 2g_2 - 1' },
      { text: 'Their half-sum, half the trace, depends on the product $g_1g_2$ only:', tex: '\\tfrac{1}{2}(A + D) = 2g_1g_2 - 1' },
      { text: 'The matrix has determinant 1, so after $k$ round trips a ray is multiplied by the $k$th power of a matrix whose eigenvalues are $e^{\\pm i\\theta}$ with $\\cos\\theta = \\tfrac12(A+D)$. The heights stay bounded only if $\\theta$ is real, that is if', tex: '-1 \\le 2g_1g_2 - 1 \\le 1' },
      { text: 'which is the stability condition:', tex: '0 \\le g_1g_2 \\le 1' }
    ]
  },
  ideas: [
    'Define $g = 1 - L/R$ for each mirror; the cavity is stable when $0 \\le g_1g_2 \\le 1$.',
    'The stability diagram has two stable lobes bounded by the axes and the hyperbola $g_1g_2 = 1$; plane-parallel, concentric and hemispherical cavities sit on the boundary.',
    'A stable cavity has a Gaussian mode whose waist follows from $\\lambda$, $L$ and the $g$ values; near the edge the waist shrinks and the mirror spots grow.',
    'The confocal cavity ($R = L$) gives the smallest mirror spots of any symmetric stable cavity of that length.',
    'Unstable resonators spill a growing beam round the mirror edge: wasteful but good for high-gain, high-power lasers.'
  ],
  pitfalls: [
    'Two curved mirrors always make a stable cavity — Only for the right product $g_1g_2$. Two concave mirrors of radius $R < L/2$ have $g < -1$ and are unstable, and a convex mirror can destroy stability altogether.',
    'Flat mirrors are the most stable choice — A plane-parallel cavity is on the very edge of stability: the slightest tilt walks a ray out. Curved mirrors with $g_1g_2$ well inside 0 to 1 are far more forgiving.',
    'A confocal cavity is unstable because it is "at the boundary" — The confocal point $g_1 = g_2 = 0$ is a stable cavity in which every ray repeats after two round trips; it is the boundary only in the sense that two lobes of the diagram meet there.',
    'An unstable resonator cannot make a laser — It does, when the gain is high: the beam grows each trip but the gain is large enough to pay the geometric loss, and the loss is the useful output.'
  ],
  terms: [
    { term: 'Stability condition', also: ['0 ≤ g₁g₂ ≤ 1'], def: 'The requirement that the product of the two mirrors\' g parameters lies between 0 and 1. Then rays are trapped and the cavity has a Gaussian mode; outside it rays escape.' },
    { term: 'g parameter', also: ['g', 'resonator g factor'], def: 'The number g = 1 − L/R for a mirror of radius R in a cavity of length L. Flat mirror: g = 1. Concave mirror with R = L: g = 0.' },
    { term: 'Confocal cavity', def: 'A cavity whose mirrors have radius equal to the cavity length, R₁ = R₂ = L (g₁ = g₂ = 0). The focus of each mirror lies on the other; the mirror spots are the smallest possible in a symmetric cavity.' },
    { term: 'Hemispherical cavity', def: 'A flat mirror and a concave mirror whose radius equals the cavity length. It sits on the edge of stability, with a very small waist on the flat mirror.' },
    { term: 'Concentric cavity', also: ['spherical cavity'], def: 'Two concave mirrors of radius L/2 whose centres of curvature coincide at the centre of the cavity (g₁ = g₂ = −1). It sits on the edge of stability, with a tiny waist at the centre.' },
    { term: 'Unstable resonator', def: 'A cavity outside the stability region, in which a ray\'s height grows each round trip. The light leaves round the edge of a mirror; used in high-power, high-gain lasers.' },
    { term: 'Thermal lens', def: 'The lens formed in a laser rod or slab by the temperature profile of the pump heat. Its power changes with the pump, so a cavity is stable only over a range of pump powers.' }
  ],
  formulas: [
    {
      name: 'g parameter of a mirror',
      expr: 'g = 1 - L/R', tex: 'g = 1 - \\frac{L}{R}',
      vars: {
        g: { name: 'g parameter', signed: true, tex: 'g' },
        L: { name: 'distance between the mirrors', q: 'length', unit: 'mm', value: 300, tex: 'L' },
        R: { name: 'radius of curvature (positive: concave)', q: 'length', unit: 'mm', signed: true, value: 500, tex: 'R' }
      },
      solveFor: 'g',
      note: 'A flat mirror has R = ∞ and g = 1. The cavity is stable when 0 ≤ g₁g₂ ≤ 1.',
      stories: { g: 'A cavity {L} long has a mirror of radius {R}. What is its g parameter?', R: 'In a cavity {L} long a mirror must have g = {g}. What radius of curvature does it need?' }
    },
    {
      name: 'Half the trace of the round-trip matrix',
      expr: 'm = 2*g1*g2 - 1', tex: 'm = 2g_{1}g_{2} - 1',
      vars: {
        m: { name: 'half the trace of the round-trip ray matrix', signed: true, tex: 'm' },
        g1: { name: 'g parameter of mirror 1', signed: true, value: 1, tex: 'g_{1}' },
        g2: { name: 'g parameter of mirror 2', signed: true, value: 0.4, tex: 'g_{2}' }
      },
      solveFor: 'm',
      note: 'Stable when −1 ≤ m ≤ 1. If |m| > 1 a ray grows by a factor |m| + √(m² − 1) each round trip.',
      stories: { m: 'A cavity has g parameters {g1} and {g2}. What is half the trace of its round-trip matrix?' }
    },
    {
      name: 'Waist of a symmetric cavity',
      expr: 'w0 = sqrt(lambda*L/(2*pi))*((1 + g)/(1 - g))^(1/4)', tex: 'w_{0} = \\sqrt{\\frac{\\lambda L}{2\\pi}}\\left(\\frac{1+g}{1-g}\\right)^{1/4}',
      vars: {
        w0: { name: 'waist radius (1/e² of the intensity)', q: 'length', unit: 'mm', tex: 'w_{0}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        L: { name: 'cavity length', q: 'length', unit: 'm', value: 0.5, tex: 'L' },
        g: { name: 'g of both mirrors', value: 0, min: -0.99, max: 0.99, signed: true, tex: 'g' }
      },
      solveFor: 'w0',
      note: 'Two identical mirrors, so g₁ = g₂ = g. At g = 0 (confocal) w₀ = √(λL/2π); the waist shrinks to zero at g = −1 and grows without limit at g = 1.',
      stories: { w0: 'A symmetric cavity {L} long with mirrors of g = {g} runs at {lambda}. How wide is the waist?' }
    },
    {
      name: 'Divergence of the beam from the waist',
      expr: 'theta = lambda/(pi*w0)', tex: '\\theta = \\frac{\\lambda}{\\pi\\,w_{0}}',
      vars: {
        theta: { name: 'half-angle divergence', q: 'angle', unit: 'mrad', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 0.22, tex: 'w_{0}' }
      },
      solveFor: 'theta',
      note: 'For a diffraction-limited Gaussian beam; the full angle is twice this.',
      stories: { theta: 'A cavity mode at {lambda} has a waist of {w0}. How fast does the beam spread (half-angle)?' }
    }
  ],
  examples: [
    {
      title: 'How long can the tube be?',
      q: 'A He–Ne laser has a flat mirror at one end and a concave mirror of radius 0.5 m at the other. For which cavity lengths is it stable, and what happens at 0.55 m?',
      steps: [
        'Flat mirror: $g_1 = 1$. Concave mirror: $g_2 = 1 - L/0.5$.',
        { text: 'Stability needs $0 \\le g_1g_2 = g_2 \\le 1$:', tex: '0 \\le 1 - \\frac{L}{0.5} \\le 1 \\quad\\Rightarrow\\quad 0 \\le L \\le 0.5\\ \\mathrm{m}' },
        'At $L = 0.55$ m, $g_2 = -0.1$, so $g_1g_2 = -0.1 < 0$.'
      ],
      a: 'Stable for lengths up to the mirror\'s radius, 0.5 m. At 0.55 m the cavity is unstable and the laser stops: a tube cannot be stretched beyond the radius of its curved mirror.'
    },
    {
      title: 'Waist of a short He–Ne cavity',
      q: 'A cavity 0.45 m long has a flat mirror and a concave mirror of radius 0.6 m. Find the waist radius at 632.8 nm and the divergence of the beam.',
      steps: [
        'The g values are $g_1 = 1$ and $g_2 = 1 - 0.45/0.6 = 0.25$, so $g_1g_2 = 0.25$, stable.',
        { text: 'The waist formula gives', tex: 'w_0^2 = \\frac{\\lambda L}{\\pi}\\sqrt{\\frac{0.25 \\times 0.75}{(1 + 0.25 - 0.5)^2}} = 9.06\\times10^{-8}\\ \\mathrm{m^2} \\times 0.577 = 5.23\\times10^{-8}\\ \\mathrm{m^2}' },
        'So $w_0 = 0.229$ mm, and the half-angle divergence is $\\lambda/\\pi w_0 = 0.88$ mrad.'
      ],
      a: 'A waist of 0.23 mm (on the flat mirror) and a divergence of about 0.9 mrad: a beam about 0.5 mm across that widens by under a millimetre per metre.'
    }
  ],
  quiz: [
    { q: 'Which pair of g parameters describes a stable cavity?', choices: ['$g_1 = 0.5,\\ g_2 = 0.5$', '$g_1 = -0.5,\\ g_2 = 0.5$', '$g_1 = 2,\\ g_2 = 1$', '$g_1 = 1.5,\\ g_2 = -1$'], a: 0, why: 'The products are 0.25 (stable), −0.25 (negative: unstable), 2 (above 1: unstable) and −1.5 (negative: unstable). Both parameters must have the same sign, and their product must not exceed 1.' },
    { q: 'A flat mirror faces a concave mirror of radius 1 m. For which separations is the cavity stable?', choices: ['0 to 0.5 m', '0 to 1 m', '1 m to 2 m', 'for any separation'], a: 1, why: '$g_1 = 1$, $g_2 = 1 - L/1\\ \\mathrm{m}$ must lie between 0 and 1, so $0 \\le L \\le 1$ m. At $L = 1$ m it is hemispherical, on the edge.' },
    { q: 'A confocal cavity, with both mirrors of radius equal to the separation, is unstable.', a: false, why: 'It has $g_1 = g_2 = 0$, so $g_1g_2 = 0$ and every ray retraces itself after two round trips: it is stable (it lies where the two lobes of the diagram meet).' },
    { q: 'A mirror of radius 0.5 m in a cavity 0.3 m long has what g parameter?', answer: 0.4, why: '$g = 1 - L/R = 1 - 0.3/0.5 = 0.4$.' },
    { q: 'Why would anyone build a laser with an unstable resonator?', choices: ['It gives the smallest possible beam', 'It makes the laser more stable against vibration', 'It fills a large gain volume with light and needs no partly transmitting mirror, which suits high-gain high-power lasers', 'It works at lower pump power'], a: 2, why: 'The geometric spill past the mirror edge is the output coupling, the beam fills a wide gain region, and no coated output mirror has to survive the power; the cost is a large loss, tolerable only with high gain.' }
  ],
  applications: [
    'He–Ne lasers and many diode-pumped rod lasers use flat-concave (half-symmetric) cavities with $g_1g_2$ well inside the stable region.',
    'Confocal scanning Fabry–Perot interferometers, used to look at laser modes, are made of two mirrors with $R = L$ ([[fabry-perot-interferometer]]).',
    'High-power CO₂ and excimer lasers use unstable resonators so that the beam fills the whole discharge ([[co2-and-excimer-lasers]]).',
    'End-pumped solid-state lasers choose their mirror radii and spacing so that the mode waist in the crystal matches the pump spot, and so that the cavity stays stable as the thermal lens grows.',
    'Optical reference cavities and gravitational-wave interferometers rely on long stable cavities with a precisely known mode.'
  ],
  history: 'Boyd and Gordon at Bell Laboratories showed in 1961 that light can be trapped between two spherical mirrors, and worked out the confocal case; Fox and Li found the mode patterns by computer in the same year. Kogelnik and Li\'s 1966 review put the stability diagram and the Gaussian-beam description into the form used ever since, and Siegman proposed the unstable resonator for lasers in 1965.',
  sources: [
    'H. Kogelnik and T. Li, "Laser beams and resonators", *Applied Optics* 5 (1966) 1550 — the g parameters, the stability diagram and the mode waist.',
    'A. E. Siegman, *Lasers* — the chapters on stable and unstable optical resonators.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — resonator optics: ray-matrix stability and Gaussian modes.',
    'G. D. Boyd and J. P. Gordon, "Confocal multimode resonator for millimeter through optical wavelength masers", *Bell System Technical Journal* 40 (1961) 489.'
  ],
  sim: 'lp-stability'
},

/* ================================================================ modes */
{
  id: 'laser-modes', parent: 'laser-principles', title: 'Laser modes', level: 2,
  short: 'Only certain light waves fit in a laser cavity: a comb of frequencies spaced c/2L apart (longitudinal modes) and a family of patterns across the beam (transverse modes, TEMₘₙ). A laser runs on every longitudinal mode whose gain clears the loss, and precision lasers are built to run on just one, in the plain Gaussian TEM₀₀.',
  keywords: ['laser modes', 'longitudinal modes', 'transverse modes', 'TEM00', 'TEM mode', 'Hermite-Gauss', 'mode spacing', 'free spectral range', 'single-mode laser', 'multimode', 'mode competition', 'mode hopping', 'etalon', 'doughnut mode', 'mode sweep', 'c/2L'],
  prereq: ['the-laser-cavity', 'cavity-stability', 'constructive-and-destructive-interference'],
  related: ['higher-order-modes', 'linewidth-and-coherence-of-lasers', 'beam-quality-m-squared', 'fabry-perot-interferometer', 'helium-neon-laser', 'diode-lasers', 'the-gaussian-beam', 'q-switching-and-mode-locking'],
  body: `
Not every wave can live between two mirrors. A wave that makes a round trip must come back in step with itself, or it cancels itself by interference. The waves that survive are the **modes** of the cavity, and they come in two families: those that differ *along* the axis (**longitudinal** modes) and those that differ *across* the beam (**transverse** modes).

### Longitudinal modes: a comb of frequencies
The wave must fit a whole number $q$ of half-wavelengths between the mirrors, $2nL = q\\lambda$, so the allowed frequencies form an even comb:

$$\\nu_q = q\\,\\frac{c}{2nL} \\qquad \\Delta\\nu = \\frac{c}{2nL}$$

The spacing is the **free spectral range**, the inverse of the round-trip time.

| Laser | Cavity | Mode spacing |
|---|---|---|
| Diode laser ($n \\approx 3.6$) | 0.3 mm | 139 GHz (0.33 nm at 850 nm) |
| Short He–Ne | 15 cm | 1 GHz |
| Ordinary He–Ne, or an Nd:YAG rod laser | 30 cm | 500 MHz |
| Mode-locked laser | 1.5 m | 100 MHz |
| Fibre laser ($n \\approx 1.45$) | 10 m | 10 MHz |

Every comb line under the gain curve whose gain exceeds the loss can lase, so the **number of modes** is the width of the gain above threshold divided by the spacing. The He–Ne's gain is only 1.5 GHz wide (Doppler broadening), so a 30 cm tube runs on two or three modes; the 120 GHz of Nd:YAG allows hundreds; a diode's 4 THz allows dozens.

Move a mirror by half a wavelength and every mode shifts by exactly one spacing: the comb returns to itself. Because $\\Delta\\nu/\\nu = -\\Delta L/L$, a change of 1 µm in a 30 cm cavity moves the modes by 1.6 GHz, three spacings. As a He–Ne tube warms and grows, its modes therefore slide through the gain curve, one fading as the next arrives, and the power rises and falls periodically while the tube warms up: the **mode sweep**. In many tubes neighbouring modes are polarized at right angles, and balancing the two is one way of stabilizing the laser.

### Transverse modes: patterns across the beam
Across the beam the field can take a family of shapes, the **Hermite–Gauss modes** $\\mathrm{TEM}_{mn}$ of a cavity with rectangular symmetry, where $m$ and $n$ count the dark lines across and down.

- **TEM₀₀** is the smooth Gaussian spot of a good laser: the narrowest beam, the best focus, a beam quality $M^2 = 1$ ([[beam-quality-m-squared]]).
- **Higher modes** are wider and have lobes separated by dark lines. Their beam quality is $M^2 = 2m + 1$ (and $2n + 1$): TEM₂₀ is already five times worse. Combining TEM₁₀ and TEM₀₁ gives the **doughnut**, a ring with a dark centre ([[higher-order-modes]]).

Each transverse mode also has its own resonant frequency, $\\nu = \\frac{c}{2nL}\\left[q + (m + n + 1)\\,\\frac{\\arccos\\sqrt{g_1g_2}}{\\pi}\\right]$ for mirrors with $g > 0$. In a confocal cavity the fraction is exactly one half, so the modes with $m + n$ even sit halfway between those with $m + n$ odd and the cavity behaves as if its spacing were $c/4L$.

### Choosing the modes
- **TEM₀₀ only:** a small aperture inside the cavity, or a pumped region no wider than the fundamental mode, makes the fundamental the lowest-loss mode. Cutting and welding with M² of 5 to 20 does not mind; focusing to a few micrometres or collimating over a kilometre does.
- **One longitudinal mode:** shorten the cavity until the spacing exceeds the gain width; or put an etalon in the cavity (the simulation shows how its transmission peaks strike out lines); or use a ring cavity with an element that lets light go round one way only; or, in a diode, a grating that supports only one wavelength.
- **Who needs it:** interferometry, spectroscopy, holography and fibre sensing want a single longitudinal mode and TEM₀₀. Pumping other lasers, cutting and illumination are happy with many.

> [!key] Longitudinal modes are a comb at $c/2nL$ intervals; the laser runs on those under the gain curve above the loss. Transverse modes are patterns across the beam; TEM₀₀ is the Gaussian, and a mode of index $m$ has $M^2 = 2m + 1$. Single-mode lasers are built by shortening the cavity, adding etalons or gratings, and adding apertures.
`,
  ideas: [
    'Waves that fit the cavity are its modes: longitudinal modes differ along the axis, transverse modes across the beam.',
    'The longitudinal modes form a comb $\\nu_q = qc/2nL$, evenly spaced by the inverse of the round-trip time.',
    'The number of lasing modes is the gain bandwidth above threshold divided by the spacing: two or three in a He–Ne, hundreds in Nd:YAG.',
    'TEM₀₀ is the Gaussian, the best beam; a mode of order $m$ has $M^2 = 2m + 1$.',
    'Single-mode operation needs a short cavity, an etalon, a ring cavity or a grating; TEM₀₀ operation needs an aperture or a matched pump spot.'
  ],
  pitfalls: [
    'A laser emits a single frequency — Most lasers run on many longitudinal modes at once; a single-frequency laser takes special design. A He–Ne tube typically emits two or three lines, 500 MHz apart.',
    'The modes are fixed once the laser is built — Their frequencies move with the cavity length ($\\Delta\\nu/\\nu = -\\Delta L/L$): a micrometre is a few spacings. That is why lasers drift in frequency as they warm up.',
    'Transverse modes are defects — They are the other solutions of the same cavity. Higher orders carry more power through a large gain volume, which is welcome in a cutting laser; only when beam quality matters must they be suppressed.',
    'A higher gain makes the comb spacing wider — The spacing depends on the cavity length alone; more gain only lets more comb lines clear the loss.'
  ],
  terms: [
    { term: 'Longitudinal mode', also: ['axial mode'], def: 'One of the standing-wave solutions along the axis of a cavity, for which a whole number of half-wavelengths fits between the mirrors. Its frequency is q·c/2nL.' },
    { term: 'Free spectral range', also: ['FSR', 'mode spacing', 'c/2L'], def: 'The frequency interval between neighbouring longitudinal modes of a cavity, c/2nL: the inverse of the round-trip time.' },
    { term: 'Transverse mode', also: ['TEM mode'], def: 'A self-reproducing pattern of the field across the beam in a cavity. Written TEMₘₙ, with m and n counting the dark lines across and down.' },
    { term: 'TEM₀₀', also: ['fundamental mode', 'Gaussian mode'], def: 'The lowest transverse mode: a smooth, round Gaussian spot with no dark lines, the narrowest and best-focusing beam, with M² = 1.' },
    { term: 'Single-longitudinal-mode laser', also: ['SLM', 'single-frequency laser'], def: 'A laser that runs on one longitudinal mode, with a linewidth far below the mode spacing. Needed for interferometry, holography and spectroscopy.' },
    { term: 'Mode sweep', def: 'The slow movement of the comb of modes through the gain curve as the cavity length changes with temperature, which makes the power of a multimode laser vary periodically.' }
  ],
  formulas: [
    {
      name: 'Mode spacing',
      expr: 'dnu = c/(2*n*L)', tex: '\\Delta\\nu = \\frac{c}{2\\,n\\,L}',
      vars: {
        dnu: { name: 'spacing of the longitudinal modes', q: 'frequency', unit: 'MHz', tex: '\\Delta\\nu' },
        c: { const: 'c' },
        n: { name: 'refractive index filling the cavity', value: 1, min: 1, max: 5, tex: 'n' },
        L: { name: 'cavity length', q: 'length', unit: 'm', value: 0.3, tex: 'L' }
      },
      solveFor: 'dnu',
      stories: { dnu: 'A laser cavity {L} long is filled with a medium of index {n}. How far apart in frequency are its longitudinal modes?', L: 'The modes of a laser are {dnu} apart. How long is its cavity (index {n})?' }
    },
    {
      name: 'Mode spacing in wavelength',
      expr: 'dl = lambda^2/(2*n*L)', tex: '\\Delta\\lambda = \\frac{\\lambda^{2}}{2\\,n\\,L}',
      vars: {
        dl: { name: 'spacing of the modes in wavelength', q: 'length', unit: 'pm', tex: '\\Delta\\lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        n: { name: 'refractive index', value: 1, min: 1, max: 5, tex: 'n' },
        L: { name: 'cavity length', q: 'length', unit: 'm', value: 0.3, tex: 'L' }
      },
      solveFor: 'dl',
      stories: { dl: 'A cavity {L} long (index {n}) lases at {lambda}. How far apart in wavelength are its modes?' }
    },
    {
      name: 'Number of modes under the gain',
      expr: 'Nm = B/dnu', tex: 'N = \\frac{B}{\\Delta\\nu}',
      vars: {
        Nm: { name: 'number of lasing modes (about)', tex: 'N' },
        B: { name: 'width of the gain above threshold', q: 'frequency', unit: 'GHz', value: 1.15, tex: 'B' },
        dnu: { name: 'mode spacing', q: 'frequency', unit: 'MHz', value: 500, tex: '\\Delta\\nu' }
      },
      solveFor: 'Nm',
      note: 'For a Doppler-broadened medium, where every line above threshold lases independently.',
      stories: { Nm: 'The gain exceeds the loss over a width of {B}, and the modes are {dnu} apart. About how many modes lase?' }
    },
    {
      name: 'Frequency shift when a mirror moves',
      expr: 'df = c*dL/(lambda*L)', tex: '\\delta\\nu = \\frac{c\\,\\delta L}{\\lambda\\,L}',
      vars: {
        df: { name: 'shift of every mode', q: 'frequency', unit: 'MHz', tex: '\\delta\\nu' },
        c: { const: 'c' },
        dL: { name: 'change of the cavity length', q: 'length', unit: 'nm', value: 316.4, tex: '\\delta L' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        L: { name: 'cavity length', q: 'length', unit: 'm', value: 0.3, tex: 'L' }
      },
      solveFor: 'df',
      note: 'Equal to one mode spacing when δL is half a wavelength.',
      stories: { df: 'The cavity of a {lambda} laser, {L} long, changes length by {dL}. By how much does each mode move in frequency?' }
    }
  ],
  examples: [
    {
      title: 'Two or three lines from a He–Ne tube',
      q: 'A He–Ne tube is 30 cm long and its gain curve is 1.5 GHz wide (FWHM), with the peak gain 1.5 times the loss. How many longitudinal modes lase?',
      steps: [
        { text: 'The spacing is', tex: '\\Delta\\nu = \\frac{c}{2L} = \\frac{3\\times10^8}{0.6} = 500\\ \\mathrm{MHz}' },
        { text: 'The gain falls to the loss at', tex: '\\Delta\\nu_{>}= 1.5\\ \\mathrm{GHz} \\times \\sqrt{\\frac{\\ln 1.5}{\\ln 2}} = 1.15\\ \\mathrm{GHz}' },
        'That width holds $1.15 / 0.5 = 2.3$ modes: two or three, depending on where the comb sits.'
      ],
      a: 'Two or three modes. As the tube warms the comb slides and the count alternates between two and three.'
    },
    {
      title: 'A diode laser\'s comb',
      q: 'A GaAs laser chip is 0.3 mm long (group index about 3.6) and lases near 850 nm. What are its mode spacing in frequency and in wavelength?',
      steps: [
        { text: 'Frequency:', tex: '\\Delta\\nu = \\frac{c}{2nL} = \\frac{3\\times10^8}{2 \\times 3.6 \\times 3\\times10^{-4}} = 139\\ \\mathrm{GHz}' },
        { text: 'Wavelength:', tex: '\\Delta\\lambda = \\frac{\\lambda^2}{2nL} = \\frac{(850\\ \\mathrm{nm})^2}{2 \\times 3.6 \\times 3\\times10^{5}\\ \\mathrm{nm}} = 0.33\\ \\mathrm{nm}' }
      ],
      a: 'The lines are 0.33 nm apart. The gain spans some 10 nm, so a plain Fabry–Perot diode can have dozens of modes; in practice a few dominate, and single-mode diodes use a built-in grating.'
    }
  ],
  quiz: [
    { q: 'You halve the length of a laser cavity. The spacing of its longitudinal modes…', choices: ['doubles', 'halves', 'is unchanged', 'becomes zero'], a: 0, why: 'The spacing is $c/2nL$, inversely proportional to the length. A shorter cavity has a wider comb, which is the simplest way to get a single mode.' },
    { q: 'What is the mode spacing of a 50 cm cavity in air, in MHz?', answer: 300, unit: 'MHz', why: '$c/2L = 3\\times10^8/(2 \\times 0.5) = 3\\times10^8$ Hz = 300 MHz.' },
    { q: 'Every laser emits light at exactly one frequency.', a: false, why: 'Most lasers run on many longitudinal modes at once, spaced by $c/2nL$. A single frequency takes a short cavity, an etalon or grating, or a ring design.' },
    { q: 'A TEM₂₀ beam compared with a TEM₀₀ beam of the same size parameter has a beam quality that is…', choices: ['the same', '$M^2 = 3$', '$M^2 = 5$', '$M^2 = 20$'], a: 2, why: 'For Hermite–Gauss modes $M^2 = 2m + 1$ in the direction with $m$ nodes, so TEM₂₀ has $M^2 = 5$ across and 1 down.' },
    { q: 'A He–Ne tube warms up and its length increases by half a wavelength. What happens to its mode frequencies?', choices: ['Nothing', 'Each shifts by one mode spacing, so the comb looks the same again', 'They all disappear', 'Their spacing doubles'], a: 1, why: 'Each mode must still fit a whole number of half-wavelengths: lengthening by $\\lambda/2$ moves every mode to where its neighbour was. In between, the modes slide through the gain curve.' }
  ],
  applications: [
    'Single-frequency lasers for interferometry, spectroscopy and holography, made short, or with etalons, gratings or ring cavities ([[linewidth-and-coherence-of-lasers]]).',
    'Stabilized He–Ne lasers used as length standards, locked by balancing two orthogonally polarized modes.',
    'TEM₀₀ beams for focusing to micrometre spots in marking, microscopy and lithography ([[focusing-a-laser-beam]]).',
    'Multimode lasers in cutting and welding, where several transverse modes spread the power through a large rod and a flat beam is acceptable.',
    'Mode-locked lasers, which lock thousands to millions of longitudinal modes together to make femtosecond pulses and optical frequency combs ([[q-switching-and-mode-locking]]).'
  ],
  history: 'Fox and Li at Bell Laboratories found in 1961, by iterating the field back and forth between two mirrors on a computer, that a stable pattern appears after a few hundred passes: the modes of the resonator. Boyd, Gordon and Kogelnik gave them closed forms as the Hermite–Gauss family, and in 1964 Hargrove, Fork and Pollack first locked the modes of a He–Ne laser together.',
  sources: [
    'A. G. Fox and T. Li, "Resonant modes in a maser interferometer", *Bell System Technical Journal* 40 (1961) 453.',
    'H. Kogelnik and T. Li, "Laser beams and resonators", *Applied Optics* 5 (1966) 1550 — Hermite–Gauss modes and their frequencies.',
    'A. E. Siegman, *Lasers* — the chapters on longitudinal modes and on transverse mode patterns.',
    'O. Svelto, *Principles of Lasers* — laser modes and mode selection.'
  ],
  sim: 'lp-modes'
},

/* ================================================================ linewidth and coherence */
{
  id: 'linewidth-and-coherence-of-lasers', parent: 'laser-principles', title: 'Linewidth and coherence of lasers', level: 2,
  short: 'A laser\'s spectral line can be a hundred thousand times narrower than anything a lamp can make: tens of gigahertz for a multimode diode, megahertz for a single-mode He–Ne, kilohertz for a stabilized ring laser. The narrower the line, the longer the wave trains and the further apart two beams can be and still make fringes: a coherence length from a fraction of a millimetre to hundreds of kilometres.',
  keywords: ['linewidth', 'coherence length', 'coherence time', 'temporal coherence', 'single-frequency laser', 'narrow linewidth', 'fringe visibility', 'Schawlow-Townes', 'frequency stabilization', 'frequency noise', 'laser spectrum', 'Gaussian line', 'Lorentzian line', 'holography', 'interferometry'],
  prereq: ['laser-modes', 'coherence', 'wavelength-frequency-and-colour'],
  related: ['michelson-interferometer', 'speckle', 'what-makes-laser-light-special', 'optical-coherence-tomography', 'diode-lasers', 'helium-neon-laser', 'interferometers-in-precision-engineering', 'holograms-and-what-they-show'],
  body: `
A laser's spectrum can be a hundred thousand times narrower than that of a lamp, and the narrower the line, the longer the light stays in step with itself. [[coherence|Coherence]] was introduced for light in general; here is what it means for a laser, and what limits it.

### Linewidth, coherence time, coherence length
The **linewidth** $\\Delta\\nu$ is the full width at half maximum of the spectral line. A wave train lasts about the **coherence time** $\\tau_c \\approx 1/\\Delta\\nu$ and is about

$$L_c \\approx c\\,\\tau_c = \\frac{c}{\\Delta\\nu} = \\frac{\\lambda^2}{\\Delta\\lambda}$$

long. (The exact factor, between about 0.3 and 1, depends on the shape of the line and on how coherence is defined.)

| Source | Linewidth | Coherence length $c/\\Delta\\nu$ |
|---|---|---|
| Sunlight, filament lamp (300 nm wide) | 300 THz | 1 µm |
| White LED (100 nm) | 100 THz | 3 µm |
| Femtosecond Ti:sapphire (35 nm at 800 nm) | 16 THz | 18 µm |
| Multimode laser diode (1.5 nm at 650 nm) | 1.1 THz | 0.28 mm |
| He–Ne, two or three modes | 1.5 GHz | 0.2 m |
| Single-mode He–Ne | about 1 MHz | 300 m |
| Single-frequency diode (DFB) | 1 to 10 MHz | 30 to 300 m |
| Nd:YAG ring laser | about 1 kHz | 300 km |

### Fringes fade, they do not stop
Split a beam, delay one half by a path difference $\\Delta$, and recombine. The **visibility** of the fringes falls as $\\Delta$ grows, as the Fourier transform of the line: for a Gaussian line

$$V = \\exp\\!\\left[-\\frac{(\\pi\\,\\Delta\\nu\\,\\Delta/c)^2}{4\\ln 2}\\right]$$

and for a Lorentzian line $V = \\exp(-\\pi\\Delta\\nu\\,\\Delta/c)$. The fringes fall to half at about $0.44\\,c/\\Delta\\nu$ and are down to 3 or 4 % at $c/\\Delta\\nu$. A two-mode He–Ne ($c/\\Delta\\nu = 0.2$ m) still gives a fringe visibility of 41 % at a path difference of 10 cm and almost none at 20 cm; the simulation lets you try any laser.

### What sets a laser's linewidth
- **Many modes.** The line is the whole comb: three He–Ne modes 500 MHz apart make a 1.5 GHz line, and the coherence length is that of the group, not of one mode.
- **Noise in the cavity length.** A single mode follows the cavity: $\\Delta\\nu/\\nu = \\Delta L/L$. A change of 1 nm in a 30 cm He–Ne tube moves it by 1.6 MHz, and vibration, temperature and acoustic noise easily make nanometres. **Frequency stabilization** feeds the error back to a mirror, locking to a reference cavity or to an atomic or molecular line, and takes the linewidth from megahertz down to kilohertz or below.
- **A fundamental limit.** Spontaneous emission adds phase noise to every laser. The **Schawlow–Townes limit** scales as the square of the cavity's own bandwidth divided by the output power: a long, low-loss cavity at high power gets down to a fraction of a hertz, far below what technical noise normally allows.
- **Semiconductor lasers** are broadened by the way gain and refractive index move together: a **linewidth enhancement factor** $\\alpha$ of typically 2 to 7 multiplies the Schawlow–Townes width by $1 + \\alpha^2$, so DFB diodes give megahertz rather than hertz.

### Across the beam as well
A laser running in TEM₀₀ is also *spatially* coherent: every point of the beam has a fixed phase relation to every other, so a double slit placed anywhere in it makes fringes. A lamp has to be filtered through a pinhole to approach that. The same coherence is what makes the grainy [[speckle]] pattern on a rough surface.

### Where it matters
- **Interferometry and holography:** the path difference between the arms, or between object and reference beam, must stay below the coherence length. A stabilized He–Ne is the length standard of workshops; a single-frequency laser lets a hologram record a scene metres deep.
- **Coherent lidar and fibre sensing:** the returning light is mixed with a copy of the outgoing beam, which only works if the laser remembers its phase for the round-trip time.
- **The opposite wish:** optical coherence tomography wants a *short* coherence length, since it sets the depth resolution; displays try to *reduce* coherence to hide speckle.

> [!key] Linewidth $\\Delta\\nu$ sets the coherence time $1/\\Delta\\nu$ and the coherence length $c/\\Delta\\nu$ (about $\\lambda^2/\\Delta\\lambda$). Fringe visibility falls smoothly with the path difference and is nearly gone at $c/\\Delta\\nu$. Real linewidths are set by cavity-length noise long before the fundamental limit.
`,
  ideas: [
    'Linewidth $\\Delta\\nu$ ↔ coherence time $\\approx 1/\\Delta\\nu$ ↔ coherence length $c/\\Delta\\nu = \\lambda^2/\\Delta\\lambda$.',
    'Laser coherence lengths range from a fraction of a millimetre (multimode diodes) to hundreds of kilometres (kilohertz lasers).',
    'Fringe visibility falls smoothly with path difference: to half at about $0.44\\,c/\\Delta\\nu$, to a few per cent at $c/\\Delta\\nu$.',
    'A single mode drifts with the cavity length ($\\Delta\\nu/\\nu = \\Delta L/L$); stabilization to a reference narrows the line by orders of magnitude.',
    'Different applications want opposite things: interferometry and holography a long coherence length, optical coherence tomography and speckle-free displays a short one.'
  ],
  pitfalls: [
    'Every laser has a long coherence length — Only single-frequency lasers do. A multimode laser diode or a femtosecond laser has a coherence length of a fraction of a millimetre to a few tens of micrometres.',
    'The coherence length is a sharp limit — Fringes fade smoothly; at $c/\\Delta\\nu$ they are down to a few per cent and at half that distance they are still visible. It is an order of magnitude with a factor between 0.3 and 1 depending on definition.',
    'The linewidth of a laser is set by quantum noise — Only in the best-isolated lasers. In practice the cavity length noise (vibration, temperature) and, in diodes, the current noise and the $\\alpha$ factor set it, many orders of magnitude above the Schawlow–Townes limit.',
    'A narrow linewidth means a pure sine wave for ever — It means a long wave train, not an endless one: the phase still wanders, over a coherence time.'
  ],
  terms: [
    { term: 'Linewidth', also: ['Δν', 'spectral width', 'FWHM'], def: 'The full width at half maximum of the spectrum of a source, in hertz or as Δλ in nanometres. For a laser it ranges from about 1 THz for a multimode diode to below 1 kHz for stabilized lasers.' },
    { term: 'Coherence time', def: 'The time over which the phase of the light remains predictable, about 1/Δν. After it the wave has largely forgotten its own phase.' },
    { term: 'Schawlow–Townes limit', def: 'The fundamental lower bound on a laser\'s linewidth, set by spontaneous emission adding phase noise; it falls as the output power rises and as the cavity bandwidth narrows. Real lasers are usually far above it.' },
    { term: 'Frequency stabilization', also: ['frequency locking'], def: 'Feeding back a measured frequency error to the laser (to a mirror or the drive current) so that it follows a reference such as a stable cavity or an atomic line, narrowing and fixing its frequency.' },
    { term: 'Linewidth enhancement factor', also: ['α factor', 'Henry factor'], def: 'A dimensionless number (typically 2 to 7) of a semiconductor laser that couples changes of gain to changes of refractive index. It widens the intrinsic linewidth by the factor 1 + α².' }
  ],
  formulas: [
    {
      name: 'Coherence length from the wavelength width',
      expr: 'Lc = lambda^2/dl', tex: 'L_{c} = \\frac{\\lambda^{2}}{\\Delta\\lambda}',
      vars: {
        Lc: { name: 'coherence length', q: 'length', unit: 'm', tex: 'L_{c}' },
        lambda: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        dl: { name: 'spectral width', q: 'length', unit: 'nm', value: 0.002, tex: '\\Delta\\lambda' }
      },
      solveFor: 'Lc',
      note: 'An order of magnitude: the exact factor depends on the line shape.',
      stories: { Lc: 'A laser at {lambda} has a line {dl} wide. What is its coherence length?', dl: 'A light source at {lambda} must have a coherence length of {Lc}. How narrow must its line be?' }
    },
    {
      name: 'Coherence length from the linewidth',
      expr: 'Lc = c/dnu', tex: 'L_{c} = \\frac{c}{\\Delta\\nu}',
      vars: {
        Lc: { name: 'coherence length', q: 'length', unit: 'm', tex: 'L_{c}' },
        c: { const: 'c' },
        dnu: { name: 'linewidth', q: 'frequency', unit: 'MHz', value: 1, tex: '\\Delta\\nu' }
      },
      solveFor: 'Lc',
      stories: { Lc: 'A single-frequency laser has a linewidth of {dnu}. How far does its light stay coherent?' }
    },
    {
      name: 'Wavelength width from the linewidth',
      expr: 'dl = lambda^2*dnu/c', tex: '\\Delta\\lambda = \\frac{\\lambda^{2}\\,\\Delta\\nu}{c}',
      vars: {
        dl: { name: 'spectral width', q: 'length', unit: 'pm', tex: '\\Delta\\lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        dnu: { name: 'linewidth', q: 'frequency', unit: 'GHz', value: 1.5, tex: '\\Delta\\nu' },
        c: { const: 'c' }
      },
      solveFor: 'dl',
      stories: { dl: 'A laser at {lambda} has a linewidth of {dnu}. How wide is the line in wavelength?' }
    },
    {
      name: 'Linewidth from cavity-length noise',
      expr: 'dnu = c*dL/(lambda*L)', tex: '\\delta\\nu = \\frac{c\\,\\delta L}{\\lambda\\,L}',
      vars: {
        dnu: { name: 'frequency wander of the mode', q: 'frequency', unit: 'MHz', tex: '\\delta\\nu' },
        c: { const: 'c' },
        dL: { name: 'change of the cavity length', q: 'length', unit: 'nm', value: 1, tex: '\\delta L' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        L: { name: 'cavity length', q: 'length', unit: 'm', value: 0.3, tex: 'L' }
      },
      solveFor: 'dnu',
      stories: { dnu: 'The cavity of a {lambda} laser, {L} long, wanders by {dL}. How far does its frequency wander?' }
    },
    {
      name: 'Fringe visibility for a Gaussian line',
      expr: 'V = exp(-(pi*dnu*D/c)^2/(4*ln(2)))', tex: 'V = \\exp\\!\\left[-\\frac{(\\pi\\,\\Delta\\nu\\,D/c)^{2}}{4\\ln 2}\\right]',
      vars: {
        V: { name: 'fringe visibility', tex: 'V' },
        dnu: { name: 'linewidth (FWHM)', q: 'frequency', unit: 'GHz', value: 1.5, tex: '\\Delta\\nu' },
        D: { name: 'path difference between the beams', q: 'length', unit: 'm', value: 0.1, tex: 'D' },
        c: { const: 'c' }
      },
      solveFor: 'V',
      note: 'For a Lorentzian line: V = exp(−π Δν D / c).',
      stories: { V: 'Two beams from a laser with a Gaussian line {dnu} wide are recombined with a path difference of {D}. What is the fringe visibility?' }
    }
  ],
  examples: [
    {
      title: 'How far apart can the arms be?',
      q: 'A Michelson interferometer is lit by a He–Ne laser whose modes spread over 1.5 GHz. Its two arms differ by 5 cm. How good are the fringes?',
      steps: [
        'The beams differ in path by twice the arm difference: $D = 10$ cm.',
        { text: 'The coherence length is', tex: 'L_c = \\frac{c}{\\Delta\\nu} = \\frac{3\\times10^8}{1.5\\times10^9} = 0.2\\ \\mathrm{m}' },
        { text: 'For a Gaussian line the visibility at $D = 0.1$ m is', tex: 'V = \\exp\\!\\left[-\\frac{(\\pi \\times 1.5\\times10^9 \\times 0.1/3\\times10^8)^2}{4\\ln 2}\\right] = e^{-0.89} = 0.41' }
      ],
      a: 'A visibility of 41 %: usable, but already fading. At an arm difference of 10 cm (path 20 cm) the fringes would be down to 3 %. A single-mode laser has no such limit.'
    },
    {
      title: 'A nanometre of vibration',
      q: 'The mirrors of a 30 cm He–Ne tube move by 1 nm relative to each other. By how much does a single mode move?',
      steps: [
        { text: 'The frequency follows the cavity length:', tex: '\\delta\\nu = \\frac{c\\,\\delta L}{\\lambda\\,L} = \\frac{3\\times10^8 \\times 10^{-9}}{632.8\\times10^{-9} \\times 0.3} = 1.6\\ \\mathrm{MHz}' }
      ],
      a: 'About 1.6 MHz for one nanometre. A good laboratory floor moves by more than that, which is why single-frequency lasers are rigidly built and electronically locked.'
    }
  ],
  quiz: [
    { q: 'A laser has a linewidth of 3 MHz. About how long, in metres, is its coherence length $c/\\Delta\\nu$?', answer: 100, unit: 'm', why: '$c/\\Delta\\nu = 3\\times10^8 / 3\\times10^6 = 100$ m.' },
    { q: 'You halve a source\'s linewidth. Its coherence length…', choices: ['halves', 'is unchanged', 'quadruples', 'doubles'], a: 3, why: '$L_c \\approx c/\\Delta\\nu$ is inversely proportional to the linewidth.' },
    { q: 'A multimode laser diode, a femtosecond laser and a white LED all have long coherence lengths because they are "lasers" or bright.', a: false, why: 'Coherence length depends on spectral width, not on brightness or on being a laser. These sources have broad spectra and coherence lengths from tens of micrometres to a fraction of a millimetre.' },
    { q: 'Which change of a He–Ne tube would shift its single mode the most?', choices: ['A 1 nm change of the cavity length', 'A 1 pm change of the cavity length', 'A 1 µm change of the cavity length', 'Doubling the output power'], a: 2, why: '$\\delta\\nu/\\nu = \\delta L/L$: the shift is proportional to the length change, and a micrometre moves the mode by 1.6 GHz, three mode spacings.' },
    { q: 'For which application do you want the shortest coherence length?', choices: ['Holography of a deep scene', 'Optical coherence tomography', 'A Michelson interferometer with long arms', 'Coherent lidar'], a: 1, why: 'In optical coherence tomography the coherence length sets the depth resolution, so a broad-spectrum source is chosen. The other three need the light to stay in step over a long path.' }
  ],
  applications: [
    'Stabilized He–Ne lasers as the length standard of coordinate-measuring machines and interferometers ([[interferometers-in-precision-engineering]]).',
    'Holography: single-frequency lasers let a hologram record scenes metres deep ([[holograms-and-what-they-show]]).',
    'Coherent lidar and fibre-optic sensing, which beat the returning light against a delayed copy of the outgoing beam.',
    'Optical coherence tomography, where a broad-band source with a coherence length of a few micrometres sets the depth resolution ([[optical-coherence-tomography]]).',
    'Optical clocks and gravitational-wave detectors, whose lasers are stabilized to hertz-level linewidths.'
  ],
  history: 'Michelson used his interferometer in the 1890s to study how the visibility of fringes falls as one mirror is moved, and so measured the width and structure of spectral lines: the first coherence measurements. Schawlow and Townes derived the fundamental linewidth of the laser in 1958, and the Nobel Prize of 2005 (Hall and Hänsch, with Glauber for the quantum theory of coherence) recognized the stabilization of lasers to atomic references and the optical frequency comb.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — the chapters on partial coherence and on laser noise and linewidth.',
    'M. Born and E. Wolf, *Principles of Optics* — the chapter on the theory of partial coherence.',
    'A. E. Siegman, *Lasers* — the chapters on noise and linewidth of laser oscillators.',
    'E. Hecht, *Optics* — the sections on coherence and on the Michelson interferometer.'
  ],
  sim: 'lp-coherence'
},

/* ================================================================ continuous and pulsed */
{
  id: 'continuous-and-pulsed-lasers', parent: 'laser-principles', title: 'Continuous and pulsed lasers', level: 1,
  short: 'A continuous-wave laser emits a steady beam; a pulsed laser stores energy and releases it in bursts. The same average power can be a steady 1 W or a stream of flashes reaching gigawatts at the peak: what changes is the energy per pulse and the peak power, which is the pulse energy divided by its duration.',
  keywords: ['continuous wave', 'CW', 'pulsed laser', 'quasi-CW', 'pulse energy', 'peak power', 'average power', 'duty cycle', 'repetition rate', 'pulse duration', 'femtosecond', 'nanosecond', 'ultrafast', 'transform limit', 'time-bandwidth product'],
  prereq: ['population-inversion-and-pumping', 'the-laser-cavity'],
  related: ['q-switching-and-mode-locking', 'laser-power-and-energy-measures', 'laser-safety-classes', 'laser-marking-and-cutting-heads', 'laser-damage-and-coating-durability', 'solid-state-lasers', 'fibre-lasers'],
  body: `
Some lasers shine steadily and some in flashes, and the difference decides what they can do. A **continuous-wave** (CW) laser delivers a constant power; a **pulsed** laser stores energy and releases it in bursts. The same *average* power can be a steady 1 W or a stream of flashes whose peaks reach gigawatts.

### Four numbers describe a pulse train
The **pulse energy** $E$, the **duration** $\\tau$ (full width at half maximum), the **repetition rate** $f$ and the **average power** $P$ are tied together by

$$P_{avg} = E\\,f \\qquad P_{peak} \\approx \\frac{E}{\\tau} \\qquad D = \\tau f$$

where $D$ is the **duty cycle**, the fraction of the time the laser is on. (The peak power is $0.94\\,E/\\tau$ for a Gaussian pulse and $0.88\\,E/\\tau$ for a sech² pulse; "E over τ" is the usual round figure.)

### Kinds of operation
| Operation | Pulse duration | Repetition rate | Typical energy and peak |
|---|---|---|---|
| Continuous wave | none | none | 1 mW (pointer) to 100 kW (fibre, CO₂) |
| Quasi-CW (diode bars) | 0.1 to 1 ms | 10 to 1000 Hz | a few times the CW power, with low duty cycle |
| Free-running, flash-lamp pumped | 0.1 to 1 ms | 1 to 50 Hz | joules; kilowatts |
| [[q-switching-and-mode-locking|Q-switched]] | 1 to 100 ns | 10 Hz to 100 kHz | mJ to J; MW to GW |
| Mode-locked oscillator | 10 fs to 100 ps | 10 MHz to 10 GHz | nJ; kW to MW |
| Amplified ultrafast | 30 fs to 10 ps | 1 Hz to 1 MHz | µJ to J; GW to PW |

### One watt, four ways
| Laser | Pulse energy | Duration | Rate | Average | Peak |
|---|---|---|---|---|---|
| Laser pointer | — | continuous | — | 1 W | 1 W |
| Q-switched Nd:YAG | 100 mJ | 10 ns | 10 Hz | 1 W | 10 MW |
| Ti:sapphire oscillator | 12.5 nJ | 100 fs | 80 MHz | 1 W | 125 kW |
| Ultrafast amplifier | 1 mJ | 100 fs | 1 kHz | 1 W | 10 GW |

The duty cycle of the last is $10^{-10}$: it is dark for ten billion times longer than it is on.

### Why bother with pulses?
- **Peak power and irradiance.** Nonlinear optics, such as frequency doubling and multiphoton processes, needs gigawatts per square centimetre and more, which only short pulses give.
- **Energy before the heat spreads.** A picosecond or femtosecond pulse dumps its energy faster than heat can diffuse, so it removes material with almost no melting: "cold" micromachining and the cutting of the corneal flap in refractive surgery.
- **Time resolution.** Femtosecond pulses stroboscopically photograph chemical reactions; pulses timed to the nanosecond measure distance by time of flight ([[lidar]]).
- **Energy storage.** A Q-switched Nd:YAG laser stores energy for about the 230 µs lifetime of its upper level and releases it in 10 ns, a peak power some 23 000 times what the pump supplies.

### Pulse length and spectrum
A short pulse must contain a wide band of frequencies: $\\Delta\\nu\\,\\Delta t \\ge 0.44$ for a Gaussian pulse (0.32 for sech²). A 100 fs pulse therefore spans at least 4.4 THz, 9 nm at 800 nm. Short pulses and long coherence are opposites ([[linewidth-and-coherence-of-lasers]]).

> [!key] Average power $= E f$; peak power $\\approx E/\\tau$; duty cycle $= \\tau f$. A pulsed laser trades time for peak power: the same average power spent in shorter flashes means a higher peak, a higher irradiance, and, for the eye and for optics, a different kind of hazard ([[laser-power-and-energy-measures]]).
`,
  ideas: [
    'A CW laser has a constant power; a pulsed laser releases stored energy in bursts of energy $E$ and duration $\\tau$ at rate $f$.',
    'Average power $= E f$, peak power $\\approx E/\\tau$, duty cycle $= \\tau f$: the same average can be a very different peak.',
    'Nanosecond (Q-switched), picosecond and femtosecond (mode-locked) pulses reach MW to PW peaks from watts of average power.',
    'Short pulses deliver peak irradiance for nonlinear optics and remove material before heat spreads.',
    'Shorter pulses need wider spectra: $\\Delta\\nu\\,\\Delta t \\ge 0.44$ for a Gaussian pulse.'
  ],
  pitfalls: [
    'A laser with a high peak power is a high-power laser — Not necessarily: a mode-locked Ti:sapphire oscillator averages 1 W and peaks at 125 kW; a 5 mW pointer is Class 3R; the pulse energy, not the peak, usually decides what a pulse can do to a target.',
    'Pulsed lasers create more energy than they consume — The pulse energy is stored energy, accumulated from the pump over a much longer time; the pulse only releases it faster.',
    'Peak power and average power are two names for the same number — They differ by the factor $1/D$, the reciprocal of the duty cycle: $P_{peak} \\approx P_{avg}/D$. A 1 W laser with $D = 10^{-7}$ peaks at 10 MW; for a continuous beam $D = 1$ and the two are equal.',
    'Femtosecond pulses are one wavelength long — A 100 fs pulse is 30 µm long, about forty wavelengths at 800 nm; a few-cycle pulse of 5 fs is 1.5 µm.'
  ],
  terms: [
    { term: 'Continuous-wave laser', also: ['CW laser'], def: 'A laser that emits a steady, uninterrupted beam of constant power for as long as it is pumped.' },
    { term: 'Pulse energy', def: 'The energy in one pulse, in joules. The average power is the pulse energy times the repetition rate.' },
    { term: 'Peak power', also: ['pulse power'], def: 'The highest power within a pulse, about the pulse energy divided by its duration. It is far above the average power when the duty cycle is small.' },
    { term: 'Duty cycle', def: 'The fraction of time a pulsed laser is on: pulse duration times repetition rate. 100 % for a CW laser, 10⁻¹⁰ for a femtosecond amplifier.' },
    { term: 'Repetition rate', also: ['pulse repetition frequency', 'PRF'], def: 'The number of pulses per second, in hertz. Mode-locked lasers repeat at the round-trip frequency c/2L of their cavity.' },
    { term: 'Quasi-CW', also: ['QCW'], def: 'Operation in long pulses (hundreds of microseconds to milliseconds) at a low duty cycle, so that the peak power of a diode bar or lamp-pumped rod exceeds what it could sustain continuously without overheating.' }
  ],
  formulas: [
    {
      name: 'Average power of a pulse train',
      expr: 'P = E*f', tex: 'P = E\\,f',
      vars: {
        P: { name: 'average power', q: 'power', unit: 'W', tex: 'P' },
        E: { name: 'energy per pulse', q: 'energy', unit: 'mJ', value: 100, tex: 'E' },
        f: { name: 'repetition rate', q: 'frequency', unit: 'Hz', value: 10, tex: 'f' }
      },
      solveFor: 'P',
      stories: { P: 'A laser emits pulses of {E} at {f}. What is its average power?', E: 'A laser with an average power of {P} runs at {f}. How much energy is in each pulse?' }
    },
    {
      name: 'Peak power of a pulse',
      expr: 'Ppk = E/tau', tex: 'P_{pk} = \\frac{E}{\\tau}',
      vars: {
        Ppk: { name: 'peak power', q: 'power', unit: 'MW', tex: 'P_{pk}' },
        E: { name: 'energy per pulse', q: 'energy', unit: 'mJ', value: 100, tex: 'E' },
        tau: { name: 'pulse duration (FWHM)', q: 'time', unit: 'ns', value: 10, tex: '\\tau' }
      },
      solveFor: 'Ppk',
      note: 'Multiply by 0.94 for a Gaussian pulse or 0.88 for a sech² pulse, for the exact peak.',
      stories: { Ppk: 'A pulse carries {E} in {tau}. What is its peak power?' }
    },
    {
      name: 'Duty cycle',
      expr: 'D = tau*f', tex: 'D = \\tau\\,f',
      vars: {
        D: { name: 'duty cycle', q: 'ratio', unit: '%', tex: 'D' },
        tau: { name: 'pulse duration', q: 'time', unit: 'fs', value: 100, tex: '\\tau' },
        f: { name: 'repetition rate', q: 'frequency', unit: 'MHz', value: 80, tex: 'f' }
      },
      solveFor: 'D',
      stories: { D: 'A mode-locked laser emits {tau} pulses at {f}. What fraction of the time is it on?' }
    },
    {
      name: 'Least bandwidth of a Gaussian pulse',
      expr: 'dnu = 0.441/tau', tex: '\\Delta\\nu = \\frac{0.441}{\\tau}',
      vars: {
        dnu: { name: 'smallest spectral width (FWHM)', q: 'frequency', unit: 'THz', tex: '\\Delta\\nu' },
        tau: { name: 'pulse duration (FWHM)', q: 'time', unit: 'fs', value: 100, tex: '\\tau' }
      },
      solveFor: 'dnu',
      note: 'The time–bandwidth product of a Gaussian pulse; 0.315 for a sech² pulse.',
      stories: { dnu: 'A Gaussian pulse lasts {tau}. What is the narrowest spectrum it can have?' }
    }
  ],
  examples: [
    {
      title: 'Ten megawatts from one watt',
      q: 'A Q-switched Nd:YAG laser delivers 100 mJ in 10 ns at 10 Hz. Find its average power, peak power and duty cycle.',
      steps: [
        { text: 'Average power:', tex: 'P = E f = 0.1\\ \\mathrm{J} \\times 10\\ \\mathrm{Hz} = 1\\ \\mathrm{W}' },
        { text: 'Peak power:', tex: 'P_{pk} \\approx \\frac{E}{\\tau} = \\frac{0.1\\ \\mathrm{J}}{10^{-8}\\ \\mathrm{s}} = 10\\ \\mathrm{MW}' },
        { text: 'Duty cycle:', tex: 'D = \\tau f = 10^{-8} \\times 10 = 10^{-7}' }
      ],
      a: '1 W on average, 10 MW at the peak, on for one part in ten million of the time. The peak is $10^7$ times the average, the reciprocal of the duty cycle.'
    },
    {
      title: 'The cost of ten gigawatts',
      q: 'An ultrafast amplifier gives 1 mJ pulses of 100 fs at 1 kHz. What are its average and peak powers, and how wide a spectrum must the pulses have at least?',
      steps: [
        { text: 'Average: $P = E f = 10^{-3} \\times 10^3 = 1$ W. Peak:', tex: 'P_{pk} = \\frac{10^{-3}\\ \\mathrm{J}}{10^{-13}\\ \\mathrm{s}} = 10^{10}\\ \\mathrm{W}' },
        { text: 'Bandwidth, for a Gaussian pulse:', tex: '\\Delta\\nu \\ge \\frac{0.441}{10^{-13}\\ \\mathrm{s}} = 4.4\\ \\mathrm{THz}' },
        'At 800 nm, $\\Delta\\lambda = \\lambda^2\\Delta\\nu/c = 9.4$ nm.'
      ],
      a: '1 W average, 10 GW peak, and at least 9 nm of spectrum around 800 nm. A source with a narrower spectrum cannot make 100 fs pulses.'
    }
  ],
  quiz: [
    { q: 'Two lasers both deliver 1 W on average. One is a pointer; the other emits 10 ns pulses at 10 Hz. Compared with the pointer, the pulsed laser\'s peak power is…', choices: ['the same', 'ten times higher', 'ten million times higher', 'a hundred times lower'], a: 2, why: 'Each pulse carries $E = P/f = 0.1$ J in 10 ns, so $P_{pk} = 10^7$ W, ten million times the pointer\'s 1 W.' },
    { q: 'What is the peak power of a pulse of 2 mJ lasting 5 ns, in kilowatts?', answer: 400, unit: 'kW', why: '$P_{pk} \\approx E/\\tau = 2\\times10^{-3}/5\\times10^{-9} = 4\\times10^5$ W = 400 kW.' },
    { q: 'A pulsed laser can have a peak power greater than the electrical power it draws from the mains.', a: true, why: 'The pulse energy is stored over a long time (the pumping period) and released in a very short one. Nothing is created: the energy per pulse is small compared with what the supply gives over the same interval.' },
    { q: 'A mode-locked laser emits 100 fs pulses at 80 MHz. What is its duty cycle, in parts per million?', answer: 8, unit: 'ppm', why: '$D = \\tau f = 10^{-13} \\times 8\\times10^{7} = 8\\times10^{-6}$, which is 8 parts per million.' },
    { q: 'Why can a 10 fs pulse not have a spectrum 1 nm wide at 800 nm?', choices: ['Because 800 nm is infrared', 'Because a short pulse needs a broad spectrum: at least about 0.44/10 fs = 44 THz, some 100 nm', 'Because the pulse would not fit in the cavity', 'Because the power would be too low'], a: 1, why: 'The time–bandwidth product $\\Delta\\nu\\,\\Delta t \\ge 0.44$ forbids it: 1 nm at 800 nm is only 0.47 THz, which supports pulses no shorter than about 0.9 ps.' }
  ],
  applications: [
    'Laser cutting and welding with continuous fibre and CO₂ lasers, and drilling and marking with Q-switched lasers ([[laser-marking-and-cutting-heads]]).',
    'Micromachining and eye surgery with picosecond and femtosecond pulses, which remove tissue and metal with little heat damage.',
    'Lidar and range-finding, which time the return of nanosecond pulses ([[lidar]]).',
    'Multiphoton microscopy, which needs the peak irradiance of femtosecond pulses to excite fluorescence only at the focus.',
    'Pump sources: quasi-CW diode bars that pump solid-state lasers without overheating.'
  ],
  history: 'The first lasers were pulsed: Maiman\'s ruby laser of 1960 fired in flashes of about a millisecond. The first continuous laser, the helium–neon of Javan, Bennett and Herriott, ran at the end of 1960; continuous diode lasers at room temperature followed in 1970. Chirped-pulse amplification, by Strickland and Mourou in 1985, took pulses from gigawatts to petawatts and earned the 2018 Nobel Prize in Physics, shared with Ashkin.',
  sources: [
    'A. E. Siegman, *Lasers* — the chapters on laser pulses, Q-switching and mode-locking.',
    'W. Koechner, *Solid-State Laser Engineering* — pulsed operation, energy storage and the relations between energy, duration and peak power.',
    'J.-C. Diels and W. Rudolph, *Ultrashort Laser Pulse Phenomena* — pulse durations, spectra and the time–bandwidth product.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — ultrashort pulses.'
  ],
  sim: [{ id: 'lp-pulses', params: { preset: 'qs' } }]
},

/* ================================================================ q-switching and mode-locking */
{
  id: 'q-switching-and-mode-locking', parent: 'laser-principles', title: 'Q-switching and mode-locking', level: 3,
  short: 'Two ways to squeeze a laser\'s output into extremely short pulses. Q-switching holds the cavity closed while the pump stores energy, then opens it: a giant pulse of tens of nanoseconds. Mode-locking puts all the cavity\'s modes in step, so they add into a pulse once per round trip: picoseconds to femtoseconds, with a peak power N times the average.',
  keywords: ['Q-switching', 'mode-locking', 'giant pulse', 'Q-switched laser', 'mode-locked laser', 'passive mode locking', 'Kerr-lens', 'saturable absorber', 'SESAM', 'Pockels cell', 'acousto-optic', 'femtosecond laser', 'chirped pulse amplification', 'pulse train', 'frequency comb'],
  prereq: ['laser-modes', 'continuous-and-pulsed-lasers', 'the-laser-cavity'],
  related: ['laser-power-and-energy-measures', 'optical-isolators-and-modulators', 'acousto-optic-and-electro-optic-deflectors', 'solid-state-lasers', 'fibre-lasers', 'laser-marking-and-cutting-heads', 'laser-damage-and-coating-durability'],
  body: `
Both techniques control the cavity to get very short, very intense pulses. **Q-switching** makes pulses of some tens of nanoseconds by *storing* energy; **mode-locking** makes pulses of picoseconds to femtoseconds by putting the cavity's modes *in step*.

### Q-switching: store, then release
The quality factor $Q$ of a cavity measures how little it loses per cycle. In a Q-switched laser the cavity is spoiled, with so much loss that the laser cannot start, while the pump fills the upper level. The inversion climbs far above the normal threshold, to $r$ times it. Then the loss is switched off, in a few nanoseconds: light avalanches from the noise, rises to a huge peak, and empties the inversion in a pulse of tens of nanoseconds, the **giant pulse**. Two rate equations, for the photon number and the inversion, describe it; the simulation solves them.

- The fraction of the stored energy that comes out is $\\eta$, given by $\\eta = 1 - e^{-r\\eta}$: 80 % at $r = 2$, 94 % at 3, 99 % at 5.
- The pulse lasts one to a few photon lifetimes of the cavity, $\\tau_c = (2L/c)/\\text{loss}$ (about $8\\tau_c$ at $r = 1.5$, $2.7\\tau_c$ at 3, $1.2\\tau_c$ at 10), getting shorter as $r$ grows.
- The peak power is $P_{pk} = E_s\\,(r - 1 - \\ln r)/(\\tau_c\\,r)$ for a stored energy $E_s$ (when all the loss is output coupling).

For a 0.2 m cavity with 40 % loss per round trip, $\\tau_c = 3.3$ ns; with $r = 5$ and 100 mJ stored, 99 mJ leave in a pulse about 6 ns wide with a peak of about 14 MW, a typical Nd:YAG laser.

**The switch** is *active* (an acousto-optic modulator diffracting light out of the cavity, for rates of kilohertz and low energies; a Pockels cell between polarizers, for high energy at 10 to 1000 Hz; formerly a spinning mirror) or *passive* (a saturable absorber such as Cr:YAG, which becomes transparent when the light is strong enough, so the laser fires by itself). Microchip lasers with passive switches reach pulses under a nanosecond.

### Mode-locking: modes in step
A laser with $N$ longitudinal modes spaced by $c/2L$ ([[laser-modes]]) normally has random phases between them and a steady but noisy output. **Lock** the phases together and the modes add constructively once every round trip $T = 2L/c$ and cancel in between: a train of pulses, one per round trip.

- The pulse duration is of the order of $T/N = 1/(\\text{bandwidth})$ (a smooth spectrum gives 0.3 to 0.5 of that): the broader the spectrum, the shorter the pulse.
- The peak power is $N$ times the average, since the amplitudes add ($N^2$) while the average of the powers adds ($N$).
- The repetition rate is $c/2L$: 100 MHz for a 1.5 m cavity.

A Ti:sapphire laser at 800 nm with 35 nm of bandwidth (16 THz) in a cavity with an 80 MHz round trip has some 200 000 locked modes and pulses of about 20 fs.

**How the phases are locked.** *Actively*, by modulating the loss or the phase at exactly $c/2L$. *Passively*, which is how the shortest pulses are made: a saturable absorber (a semiconductor mirror, SESAM) or the Kerr effect, in which a strong pulse focuses itself in the crystal and sees less loss than weak light (Kerr-lens mode-locking), or nonlinear polarization rotation in fibre lasers. Dispersion has to be balanced with prisms or chirped mirrors, or the pulse would spread.

### Higher still
Mode-locked pulses are only nanojoules. **Chirped-pulse amplification** stretches the pulse in time, amplifies it without damaging the amplifier, and recompresses it, reaching terawatts and petawatts.

> [!key] Q-switching: store energy with the cavity spoiled, then release it: nanoseconds, millijoules to joules, megawatts. Mode-locking: lock $N$ modes in step: one pulse per round trip, duration about $T/N$, peak $N$ times the average, picoseconds to femtoseconds.
`,
  ideas: [
    'Q-switching spoils the cavity while the pump stores a large inversion, then opens it, releasing the stored energy as a giant pulse of tens of nanoseconds.',
    'The extraction fraction obeys $\\eta = 1 - e^{-r\\eta}$ and the pulse duration is a few photon lifetimes, shrinking as the inversion rises above threshold.',
    'Mode-locking puts $N$ longitudinal modes in phase, giving one pulse per round trip of duration $\\approx T/N$ and peak power $N$ times the average.',
    'Passive switches (saturable absorber, Kerr lens) are automatic and make the shortest pulses; active ones (modulators) are controllable.',
    'Q-switching and mode-locking are different mechanisms: one stores energy over microseconds, the other synchronizes the modes of a steady laser.'
  ],
  pitfalls: [
    'A Q-switched laser has a larger gain than a CW laser — It has the same medium; it merely lets the inversion grow far past threshold before lasing starts, so the energy comes out all at once.',
    'Q-switching and mode-locking are two names for pulsing — Q-switching makes nanosecond pulses at a rate set by the switch; mode-locking makes picosecond to femtosecond pulses at the cavity\'s round-trip rate c/2L. A laser can use both.',
    'Locked modes make the laser more powerful — The average power is unchanged; the same energy is gathered into short bursts, so the peak rises by a factor $N$.',
    'The shortest pulse is limited by the pump — It is limited by the bandwidth of the gain medium: the pulse cannot be shorter than about the inverse of the spectrum width.'
  ],
  terms: [
    { term: 'Q-switching', def: 'Holding the loss of a laser cavity high while the pump builds up inversion, then lowering it suddenly, so that the stored energy leaves as one short giant pulse of nanoseconds.' },
    { term: 'Giant pulse', def: 'The intense pulse, tens of nanoseconds long, emitted when a Q-switch opens; typical energies run from millijoules to joules and peak powers from megawatts to gigawatts.' },
    { term: 'Mode-locking', def: 'Making the longitudinal modes of a laser oscillate with fixed phase relations, so they interfere to form a train of ultrashort pulses, one per cavity round trip.' },
    { term: 'Saturable absorber', also: ['SESAM'], def: 'A material whose absorption falls at high intensity. In a cavity it passes strong light and blocks weak light, which starts passive Q-switching or mode-locking; a SESAM is a semiconductor mirror that does it.' },
    { term: 'Kerr-lens mode-locking', also: ['KLM'], def: 'Passive mode-locking in which the intensity-dependent refractive index makes the crystal a lens for strong pulses, which then pass an aperture with less loss than weak light. The way Ti:sapphire lasers make 10 fs pulses.' },
    { term: 'Chirped-pulse amplification', also: ['CPA'], def: 'Stretching a short pulse in time, amplifying it, and recompressing it, so the amplifier is never exposed to the full peak power. It takes femtosecond pulses to terawatts and petawatts.' }
  ],
  formulas: [
    {
      name: 'Inversion ratio for a given extraction',
      expr: 'r = -ln(1 - eta)/eta', tex: 'r = \\frac{-\\ln(1 - \\eta)}{\\eta}',
      vars: {
        r: { name: 'inversion when the switch opens, in units of the threshold inversion', tex: 'r' },
        eta: { name: 'fraction of the stored energy extracted', value: 0.94, min: 0.01, max: 0.9999, tex: '\\eta' }
      },
      solveFor: 'r',
      note: 'The relation η = 1 − e^(−rη) solved for r: r = 3 gives 94 %.',
      stories: { r: 'A Q-switched laser must extract {eta} of its stored energy in the giant pulse. How many times the threshold inversion must be reached before the switch opens?' }
    },
    {
      name: 'Peak power of a Q-switched pulse',
      expr: 'Ppk = Es*(r - 1 - ln(r))/(tc*r)', tex: 'P_{pk} = \\frac{E_{s}\\,(r - 1 - \\ln r)}{\\tau_{c}\\,r}',
      vars: {
        Ppk: { name: 'peak power', q: 'power', unit: 'MW', tex: 'P_{pk}' },
        Es: { name: 'energy stored in the inversion', q: 'energy', unit: 'mJ', value: 100, tex: 'E_{s}' },
        r: { name: 'inversion ratio', value: 5, min: 1.01, max: 20, tex: 'r' },
        tc: { name: 'photon lifetime of the cavity', q: 'time', unit: 'ns', value: 3.33, tex: '\\tau_{c}' }
      },
      solveFor: 'Ppk',
      note: 'Four-level medium, all the cavity loss being output coupling.',
      stories: { Ppk: 'A Q-switched laser stores {Es}, reaches {r} times threshold and has a photon lifetime of {tc}. What is the peak power of its pulse?' }
    },
    {
      name: 'Duration of a mode-locked pulse',
      expr: 'tau = 2*L/(c*N)', tex: '\\tau \\approx \\frac{2L}{c\\,N}',
      vars: {
        tau: { name: 'pulse duration (about)', q: 'time', unit: 'ps', tex: '\\tau' },
        L: { name: 'cavity length', q: 'length', unit: 'm', value: 1.5, tex: 'L' },
        c: { const: 'c' },
        N: { name: 'number of locked modes', value: 1000, min: 1, tex: 'N' }
      },
      solveFor: 'tau',
      note: 'Round-trip time divided by the number of locked modes: about the inverse of the total bandwidth.',
      stories: { tau: 'A laser cavity {L} long has {N} locked modes. About how long is each pulse?' }
    },
    {
      name: 'Peak power of a mode-locked train',
      expr: 'Ppk = N*Pavg', tex: 'P_{pk} \\approx N\\,P_{avg}',
      vars: {
        Ppk: { name: 'peak power', q: 'power', unit: 'W', tex: 'P_{pk}' },
        N: { name: 'number of locked modes', value: 200000, min: 1, tex: 'N' },
        Pavg: { name: 'average power', q: 'power', unit: 'mW', value: 1000, tex: 'P_{avg}' }
      },
      solveFor: 'Ppk',
      note: 'For equal modes in step; real pulse shapes lower it by a factor close to 1.',
      stories: { Ppk: 'A mode-locked laser of {Pavg} average power has {N} locked modes. What is its peak power?' }
    }
  ],
  examples: [
    {
      title: 'A Nd:YAG giant pulse',
      q: 'A Q-switched Nd:YAG laser has a 0.2 m cavity that loses 40 % of the power per round trip. The inversion reaches 5 times threshold and stores 100 mJ. Find the photon lifetime, the pulse energy and the peak power.',
      steps: [
        { text: 'Round trip $2L/c = 1.33$ ns, so', tex: '\\tau_c = \\frac{1.33\\ \\mathrm{ns}}{0.4} = 3.3\\ \\mathrm{ns}' },
        { text: 'Extraction: $\\eta = 1 - e^{-5\\eta}$ gives $\\eta = 0.993$, so the pulse carries', tex: 'E = 0.993 \\times 100\\ \\mathrm{mJ} = 99\\ \\mathrm{mJ}' },
        { text: 'Peak power:', tex: 'P_{pk} = \\frac{0.1\\ \\mathrm{J} \\times (5 - 1 - \\ln 5)}{3.3\\times10^{-9}\\ \\mathrm{s} \\times 5} = 1.4\\times10^{7}\\ \\mathrm{W}' }
      ],
      a: 'A photon lifetime of 3.3 ns, a pulse energy of 99 mJ and a peak power of about 14 MW. (The pulse width, from the rate equations, is about 6 ns.)'
    },
    {
      title: 'Counting the modes of a femtosecond laser',
      q: 'A Ti:sapphire laser has a 1.9 m cavity (round trip 12.5 ns) and a spectrum 16 THz wide. How many modes are locked, and how short can the pulse be?',
      steps: [
        { text: 'The modes are $c/2L = 80$ MHz apart, so', tex: 'N = \\frac{16\\ \\mathrm{THz}}{80\\ \\mathrm{MHz}} = 2\\times10^{5}' },
        { text: 'The pulse is about', tex: '\\tau \\approx \\frac{T}{N} = \\frac{12.5\\ \\mathrm{ns}}{2\\times10^{5}} = 63\\ \\mathrm{fs}' },
        'A better estimate for a smooth (sech²) pulse uses $\\Delta\\nu\\,\\Delta t \\approx 0.32$: $\\Delta t \\approx 0.32 / 16\\ \\mathrm{THz} = 20$ fs.'
      ],
      a: 'About 200 000 modes. The round trip over $N$ gives 63 fs and the time–bandwidth product of a smooth pulse gives 20 fs: the same order of magnitude, differing by the factor that depends on the shape of the spectrum.'
    }
  ],
  quiz: [
    { q: 'While the pump fills the upper level of a Q-switched laser, the cavity is kept…', choices: ['at its best Q', 'empty', 'unpumped', 'at a low Q, so that the laser cannot start'], a: 3, why: 'Spoiling the Q (high loss) stops the laser from starting, so the inversion can climb far above the normal threshold. The Q is switched high at the end.' },
    { q: 'A mode-locked laser has 50 modes locked in step. By what factor does the peak power exceed the average power?', answer: 50, why: 'The amplitudes add in step: peak power $\\propto N^2$, while the average power is the sum of the mode powers, $\\propto N$. The ratio is $N = 50$.' },
    { q: 'Q-switching and mode-locking are the same technique, applied to lasers of different sizes.', a: false, why: 'Q-switching stores energy and releases it in one nanosecond-scale pulse. Mode-locking synchronizes the longitudinal modes of a laser and gives a train of picosecond or femtosecond pulses at the round-trip rate.' },
    { q: 'A mode-locked laser has a 1.5 m cavity. What is the time between its pulses, in nanoseconds?', answer: 10, unit: 'ns', why: 'One pulse per round trip: $T = 2L/c = 3\\ \\mathrm{m}/(3\\times10^8\\ \\mathrm{m/s}) = 10$ ns, a rate of 100 MHz.' },
    { q: 'To make the pulses of a mode-locked laser half as long with the same cavity, you must…', choices: ['double the pump power', 'double the number of locked modes, so double the spectral width', 'halve the cavity length', 'lock the modes at random phases'], a: 1, why: 'The pulse duration is about the inverse of the bandwidth, which is $N\\,c/2L$. Twice the bandwidth gives half the duration. Halving the cavity length would raise the rate but also halve the number of modes in the same gain width.' }
  ],
  applications: [
    'Q-switched lasers for marking, engraving and micromachining, for range-finders and lidar, and for the removal of tattoos and pigmented skin lesions ([[laser-marking-and-cutting-heads]]).',
    'Mode-locked femtosecond lasers in multiphoton microscopy, in the cutting of the corneal flap in eye surgery, and in spectroscopy of chemical reactions.',
    'Optical frequency combs: a mode-locked laser is a ruler of equally spaced optical frequencies that links optical and microwave clocks.',
    'Chirped-pulse amplified systems for high-intensity physics, reaching petawatt peak power.',
    'Passively Q-switched microchip lasers, sub-nanosecond sources inside compact range-finders.'
  ],
  history: 'Hellwarth proposed Q-switching in 1961 and it was demonstrated with a ruby laser and a Kerr-cell shutter in 1961–62, giving the first "giant pulses". Hargrove, Fork and Pollack locked the modes of a He–Ne laser with an intracavity modulator in 1964. Spence, Kean and Sibbett found self mode-locking by the Kerr effect in Ti:sapphire in 1990–91, making femtosecond lasers a laboratory tool. Strickland and Mourou invented chirped-pulse amplification in 1985; with Ashkin they shared the 2018 Nobel Prize in Physics.',
  sources: [
    'W. Koechner, *Solid-State Laser Engineering* — Q-switched operation: rate equations, extraction efficiency and pulse width.',
    'J.-C. Diels and W. Rudolph, *Ultrashort Laser Pulse Phenomena* — mode-locking and Kerr-lens operation.',
    'L. E. Hargrove, R. L. Fork and M. A. Pollack, "Locking of He–Ne laser modes induced by synchronous intracavity modulation", *Applied Physics Letters* 5 (1964) 4.',
    'D. Strickland and G. Mourou, "Compression of amplified chirped optical pulses", *Optics Communications* 55 (1985) 447.'
  ],
  sim: [{ id: 'lp-switching', params: { mode: 'qs' } }, { id: 'lp-switching', params: { mode: 'ml' } }]
},

/* ================================================================ what makes laser light special */
{
  id: 'what-makes-laser-light-special', parent: 'laser-principles', title: 'What makes laser light special', level: 1,
  short: 'Laser light is monochromatic, coherent, directional and bright: one wavelength ("one lambda"), a phase that holds for metres or kilometres, a beam that spreads a milliradian or less, and a radiance that no lamp or LED approaches. Each property is set against a lamp and an LED, with numbers.',
  keywords: ['laser light', 'monochromatic', 'coherent', 'directional', 'brightness', 'radiance', 'one lambda', 'laser versus LED', 'laser versus lamp', 'divergence', 'spectral width', 'laser properties', 'collimated', 'diffraction limited', 'étendue'],
  prereq: ['stimulated-emission', 'the-laser-cavity', 'the-optical-spectrum'],
  related: ['linewidth-and-coherence-of-lasers', 'laser-modes', 'beam-waist-and-divergence', 'radiance-and-its-conservation', 'etendue', 'light-emitting-diodes', 'collimating-a-laser-diode', 'laser-families-overview'],
  body: `
A torch, a filament lamp, an LED and a laser are all "sources of light", yet laser light behaves in ways none of the others can imitate. Four properties make the difference, and each can be put in numbers. The simulation sets seven sources side by side.

### One wavelength: monochromatic
A lamp makes every colour at once ([[the-optical-spectrum]]): about 300 nm of spectrum for the Sun or a filament, 100 nm for a white LED, 20 to 30 nm for a coloured LED. A laser line is far narrower: about 1 nm for a multimode diode, 0.002 nm (1.5 GHz) for a He–Ne laser and a millionth of a nanometre for a single-frequency laser a kilohertz wide. "One lambda" is the laser's signature.

### Coherent
A narrow line means long wave trains, and long wave trains mean the light stays in step with itself. The coherence length $\\approx \\lambda^2/\\Delta\\lambda$ runs from 1 to 3 µm for a lamp or white LED, to 0.4 mm for a multimode diode, 0.2 m for a He–Ne, and 300 km for a kilohertz laser ([[linewidth-and-coherence-of-lasers]]). A laser beam is also coherent *across* its width, so any two points make fringes.

### Directional
The cavity favours light along its axis, and what remains spreads only by diffraction: a Gaussian beam of waist radius $w_0$ has a half-angle $\\theta = \\lambda/\\pi w_0$ ([[beam-waist-and-divergence]]). A He–Ne beam with $w_0 = 0.4$ mm spreads by 1 mrad: a 1.8 mm spot at 1 m and 1.1 cm at 10 m. A bare LED chip or filament radiates into a whole hemisphere. A lens can narrow that only down to the angle the source subtends: a 1 mm chip behind a 50 mm lens still spreads by 20 mrad, twenty times more than the laser. Even the Sun, 150 million kilometres away, subtends 9.3 mrad.

### Bright
The strict word is **radiance**, the power per unit area *and* per unit solid angle, in W m⁻² sr⁻¹ ([[radiance-and-its-conservation]]). No passive optical system can raise it. A diffraction-limited beam has an area times solid angle of just $\\lambda^2$, so its radiance is $P/\\lambda^2$, or $P/(M^2\\lambda)^2$ for a real beam of quality $M^2$. One milliwatt of 632.8 nm light gives $2.5\\times10^9$ W m⁻² sr⁻¹.

| Source | Spectral width | Coherence length | Divergence | Radiance, W m⁻² sr⁻¹ |
|---|---|---|---|---|
| The Sun, from Earth | 300 nm | 1 µm | 9.3 mrad (its size) | $2\\times10^7$ |
| Halogen filament | 300 nm | 1 µm | a hemisphere | $5\\times10^5$ |
| White LED chip | 100 nm | 3 µm | 120° | $3\\times10^5$ |
| Red LED chip | 25 nm | 16 µm | 120° | $3\\times10^5$ |
| Laser diode, 5 mW (bare) | 1 nm | 0.4 mm | 30° × 8° | $8\\times10^9$ |
| He–Ne laser, 1 mW | 0.002 nm | 0.2 m | 1 mrad | $2\\times10^9$ |
| Single-frequency green, 100 mW | $10^{-6}$ nm | 300 km | 1 mrad | $3\\times10^{11}$ |

(Typical rounded figures; the LED and filament values are for the bare source.) A 1 mW laser outshines the *whole* radiance of the Sun's disc by a factor of about a hundred, and inside its own narrow line, where the Sun supplies only about $2\\times10^{4}$ W m⁻² sr⁻¹ per nanometre, by tens of millions. This is why a laser can be focused to a spot of a few micrometres and burn through steel while a 1000 W lamp cannot.

### What it is not
- Not necessarily *powerful*: a 1 mW pointer carries a thousandth of a 1 W torch's power; it is the radiance that is extreme.
- Not all four at once: a multimode laser diode is neither very coherent nor, until collimated, very directional; a multi-kilowatt cutting laser has a beam of $M^2 = 10$ or more.
- Not parallel for ever: diffraction spreads every beam; even a 1 mrad pointer beam is some 400 km wide at the distance of the Moon.

> [!key] A laser's light is narrow in wavelength, long in coherence, small in divergence and, above all, high in radiance: its power comes from a small area into a small solid angle, which neither lamps nor LEDs can match and no lens can create.
`,
  ideas: [
    'Monochromatic: a laser line is 10⁴ to 10¹⁰ times narrower than a lamp\'s spectrum.',
    'Coherent: the narrow line means a coherence length from fractions of a millimetre to hundreds of kilometres, and the beam is coherent across its width.',
    'Directional: diffraction alone spreads a good laser beam, by about a milliradian; a lamp or LED fills a hemisphere.',
    'Bright: radiance (W m⁻² sr⁻¹) is the quantity that counts; for a diffraction-limited beam it is $P/\\lambda^2$, and no passive optics can increase it.',
    'Real lasers do not have every property: coherence and directionality depend on the type and the beam quality.'
  ],
  pitfalls: [
    'Laser light is powerful light — A 1 mW pointer is far less powerful than a torch. Its radiance is extreme because the power is in a tiny area and solid angle.',
    'A lens can make a lamp as bright as a laser — Radiance cannot be raised by passive optics. A lens can concentrate a lamp\'s light into a small spot only by gathering it from a large angle; the spot and the cone together keep the same étendue.',
    'Laser beams do not spread — Diffraction spreads every beam by about $\\lambda/\\pi w_0$. A 1 mrad beam is 1 m wide at 1 km.',
    'Laser light is always coherent over a long distance — Only for a narrow line. A multimode diode or a femtosecond laser has a coherence length of tens of micrometres to a fraction of a millimetre.'
  ],
  terms: [
    { term: 'Monochromatic', def: 'Of a single colour or wavelength. In practice, of a narrow spectral line: a laser\'s is 1 nm or much less, a lamp\'s hundreds of nanometres.' },
    { term: 'Coherence', also: ['temporal coherence', 'spatial coherence'], def: 'The property that the phase of a light wave is predictable, in time (long wave trains) and across the beam. Laser light has far higher coherence than lamp light.' },
    { term: 'Directionality', also: ['collimation'], def: 'How little a beam spreads as it travels, usually the full angle of divergence. A good laser beam is limited only by diffraction, about λ/πw₀ in half-angle.' },
    { term: 'Radiance', also: ['brightness', 'L'], def: 'The power emitted per unit area of source and per unit solid angle, in W m⁻² sr⁻¹. It cannot be increased by passive optical systems and measures how much light can be concentrated onto a spot.' },
    { term: 'Diffraction-limited beam', def: 'A beam that spreads as little as the wave nature of light permits for its size: a Gaussian beam with M² = 1. Its radiance is P/λ².' }
  ],
  formulas: [
    {
      name: 'Radiance of a diffraction-limited beam',
      expr: 'Lr = P/(M2*lambda)^2', tex: 'L = \\frac{P}{(M^{2}\\lambda)^{2}}',
      vars: {
        Lr: { name: 'radiance', q: 'radiance', unit: 'W/(m²·sr)', tex: 'L' },
        P: { name: 'power of the beam', q: 'power', unit: 'mW', value: 1, tex: 'P' },
        M2: { name: 'beam quality M²', value: 1.05, min: 1, max: 1000, tex: 'M^{2}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'Lr',
      note: 'Area × solid angle of a beam is (M²λ)²; the radiance is the power divided by it.',
      stories: { Lr: 'A beam of {P} at {lambda} has a beam quality of M² = {M2}. What is its radiance?' }
    },
    {
      name: 'Spread of a laser beam',
      expr: 'D = 2*w0 + 2*theta*z', tex: 'D = 2w_{0} + 2\\,\\theta\\,z',
      vars: {
        D: { name: 'beam diameter at the distance z (far field)', q: 'length', unit: 'mm' , tex: 'D' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 0.4, tex: 'w_{0}' },
        theta: { name: 'half-angle divergence', q: 'angle', unit: 'mrad', value: 0.5, tex: '\\theta' },
        z: { name: 'distance from the waist', q: 'length', unit: 'm', value: 10, tex: 'z' }
      },
      solveFor: 'D',
      note: 'A far-field estimate: valid when the distance is well beyond the Rayleigh range.',
      stories: { D: 'A laser beam with a waist radius of {w0} spreads with a half-angle of {theta}. How wide is it at {z}?' }
    },
    {
      name: 'Coherence length from the spectral width',
      expr: 'Lc = lambda^2/dl', tex: 'L_{c} = \\frac{\\lambda^{2}}{\\Delta\\lambda}',
      vars: {
        Lc: { name: 'coherence length', q: 'length', unit: 'm', tex: 'L_{c}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        dl: { name: 'spectral width', q: 'length', unit: 'nm', value: 100, tex: '\\Delta\\lambda' }
      },
      solveFor: 'Lc',
      stories: { Lc: 'A white LED emits at {lambda} over a width of {dl}. How long are its coherent wave trains?' }
    }
  ],
  examples: [
    {
      title: 'A pointer against the Sun',
      q: 'A 1 mW He–Ne beam of $M^2 = 1.05$ at 632.8 nm is compared with the Sun, whose radiance is $2.0\\times10^7$ W m⁻² sr⁻¹. Which is brighter, and by how much?',
      steps: [
        { text: 'The radiance of the laser:', tex: 'L = \\frac{P}{(M^2\\lambda)^2} = \\frac{10^{-3}}{(1.05 \\times 6.328\\times10^{-7})^2} = 2.3\\times10^{9}\\ \\mathrm{W\\,m^{-2}\\,sr^{-1}}' },
        { text: 'The ratio:', tex: '\\frac{2.3\\times10^{9}}{2.0\\times10^{7}} \\approx 110' }
      ],
      a: 'The one-milliwatt laser is about a hundred times brighter than the Sun\'s whole disc. Counting only the Sun\'s light in the same narrow line, it is tens of millions of times brighter.'
    },
    {
      title: 'Why a lens cannot rescue a lamp',
      q: 'A 1 mm LED chip is put at the focus of a 50 mm lens. How much does the collimated beam spread, and how does it compare with a He–Ne beam of 1 mrad?',
      steps: [
        'A source of size $s$ at the focus of a lens of focal length $f$ gives a beam of full angle about $s/f = 1\\ \\mathrm{mm}/50\\ \\mathrm{mm} = 20$ mrad.',
        'Against the He–Ne\'s 1 mrad that is a factor of 20 more spread, and at 10 m the LED spot is 20 cm wide against 1 cm.'
      ],
      a: 'The LED beam spreads by 20 mrad: even a perfect lens cannot make a source narrower in angle than its size divided by the focal length. That is the conservation of radiance (étendue) at work.'
    }
  ],
  quiz: [
    { q: 'Which property best explains why a laser beam can be focused to a spot of a few micrometres?', choices: ['Its high power', 'Its very high radiance: a small emitting area into a small solid angle', 'Its colour', 'Its low cost'], a: 1, why: 'A spot size is limited by how large the source is and how widely it radiates; the laser has both small. A weak laser can still be focused tighter than a powerful lamp.' },
    { q: 'A 1 mW laser pointer is brighter in the sense of radiance than a 100 W filament lamp.', a: true, why: 'Radiance is power per area per solid angle. The lamp\'s 100 W is spread over a large area and a hemisphere; the pointer\'s milliwatt is in a fraction of a square millimetre and about a milliradian.' },
    { q: 'A He–Ne beam with a divergence of 1 mrad (full angle) starts 1 mm wide. About how wide is it at 100 m, in centimetres?', answer: 10, unit: 'cm', why: 'The beam grows by 1 mrad × 100 m = 10 cm, plus the starting 1 mm: about 10 cm.' },
    { q: 'Which source has the longest coherence length?', choices: ['A white LED', 'A multimode laser diode', 'A multimode He–Ne laser', 'A single-frequency ring laser'], a: 3, why: 'Coherence length is about $c/\\Delta\\nu$: the ring laser with a linewidth around 1 kHz has some 300 km, against 0.2 m for the He–Ne, 0.4 mm for the diode and 3 µm for the LED.' },
    { q: 'You collimate a 1 mm LED chip with a perfect 100 mm lens. The beam then spreads by about…', choices: ['0.01 mrad', '1 mrad', '10 mrad', '100 mrad'], a: 2, why: 'The full angle is about source size ÷ focal length: 1 mm / 100 mm = 10 mrad. Better collimation than that would need a smaller source or a longer lens, i.e. lower étendue.' }
  ],
  applications: [
    'Alignment, levelling and surveying lasers: the narrow beam draws a straight line across a room or a building site.',
    'Barcode scanners and laser printers: a beam focused to a spot of tens of micrometres and swept across a surface ([[barcode-scanners]], [[laser-printers]]).',
    'Interferometry, holography and metrology, which need a long coherence length ([[holograms-and-what-they-show]]).',
    'Spectroscopy and communications, where the single wavelength selects a transition or a channel.',
    'Cutting, welding and surgery, which need a radiance high enough to concentrate kilowatts onto a spot a tenth of a millimetre across.'
  ],
  history: 'Schawlow and Townes\' 1958 paper argued that an optical maser would give light unlike any before it, with a narrow spectral line and a beam of small divergence. The first lasers of 1960 confirmed the beam at once, and the helium–neon laser that followed in the same year showed how long the light stayed coherent; within a few years holography, which needs exactly that, had been born.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — the properties of laser light: monochromaticity, coherence, directionality and brightness.',
    'A. E. Siegman, *Lasers* — the chapters on laser beams and on the definition of brightness.',
    'O. Svelto, *Principles of Lasers* — the chapter on the properties of laser beams: monochromaticity, coherence, directionality, brightness.',
    'A. L. Schawlow and C. H. Townes, "Infrared and optical masers", *Physical Review* 112 (1958) 1940.'
  ],
  sim: 'lp-compare'
},

/* ================================================================ power, energy, irradiance, fluence */
{
  id: 'laser-power-and-energy-measures', parent: 'laser-principles', title: 'Power, energy, irradiance and fluence', level: 1,
  short: 'A laser beam is described by its power in watts or its pulse energy in joules, but its effect on a target depends on how much lands per unit area: irradiance in W/cm² for a continuous beam and fluence in J/cm² for a pulse. Knowing which of the four numbers matters for which job is the first step in reading any laser specification.',
  keywords: ['laser power', 'pulse energy', 'irradiance', 'fluence', 'intensity', 'W/cm2', 'J/cm2', 'peak irradiance', 'radiant exposure', 'power density', 'energy density', 'damage threshold', 'power meter', 'energy meter', 'Gaussian beam'],
  prereq: ['continuous-and-pulsed-lasers', 'radiometric-quantities'],
  related: ['the-gaussian-beam', 'laser-damage-and-coating-durability', 'laser-safety-classes', 'measuring-light', 'focusing-a-laser-beam', 'laser-marking-and-cutting-heads', 'inverse-square-and-cosine-laws'],
  body: `
Three clerks could describe the same laser as "5 mW", "2 W/cm²" and "300 µJ". All can be right, and each answers a different question. Reading a laser's specification, or a coating's damage threshold, means knowing which of the four measures matters for the job.

### Four quantities
| Quantity | Unit | Meaning | Matters for |
|---|---|---|---|
| **Power** $P$ | W, mW | energy per second | heating by a continuous beam; the safety class of a CW laser |
| **Energy** $E$ | J, mJ | the total in a pulse or in an exposure | pulsed damage; a surgical or marking dose |
| **Irradiance** | W/cm², W/m² | power per area (often called "intensity") | cutting, welding, heating, ionization; the eye's exposure limit for CW light |
| **Fluence** (radiant exposure) | J/cm², J/m² | energy per area | damage of optics by pulses, ablation thresholds, skin and eye limits for short pulses |

Dividing by area turns power into irradiance and energy into fluence. They are tied by the duration: fluence $=$ irradiance $\\times$ time (for a flat pulse), so the same beam can be "1 kW/cm²" and "1 mJ/cm²" for a microsecond.

### The area of a laser beam
A beam has no sharp edge, so what area? For a Gaussian beam of $1/e^2$ radius $w$, 86.5 % of the power is inside radius $w$, and the **peak** at the centre is twice the average over that circle:

$$I_0 = \\frac{2P}{\\pi w^2} \\qquad F_0 = \\frac{2E}{\\pi w^2}$$

State which definition is meant: a datasheet may quote the peak, the average over $1/e^2$, or the average over the full width at half maximum, which differ by factors of two. The beam diameter itself is defined in ISO 11146 by the second moment of the profile.

### How big are the numbers?
| Situation | Irradiance |
|---|---|
| Sunlight on the ground | 0.1 W/cm² |
| Maximum permissible exposure of the eye, visible, 0.25 s | 2.6 mW/cm² |
| 5 mW pointer, beam 1 mm across (peak) | 1.3 W/cm² |
| 1 W focused to a 20 µm spot (peak) | 0.64 MW/cm² |
| 1 kW fibre laser on a 100 µm spot (peak) | 25 MW/cm² |
| A femtosecond pulse focused in air | above $10^{13}$ W/cm² |

| Situation | Fluence |
|---|---|
| Ablation of the cornea by a 193 nm excimer laser | about 0.15 to 0.2 J/cm² |
| 100 mJ pulse over a 5 mm beam (peak) | 1 J/cm² |
| Laser-grade fused silica, 10 ns pulses at 1064 nm | of order 10 J/cm² |

### Which to quote
A **continuous** beam is described by power, spot size and irradiance. A **pulsed** beam needs energy, duration, repetition rate, spot size, the fluence and the peak irradiance. When pulses come fast the average power matters too: heat accumulates even when each pulse is harmless. A damage threshold is quoted for *one* specified pulse length, wavelength and repetition rate, because it changes with all three: in the nanosecond to microsecond range thresholds in J/cm² rise roughly as the square root of the pulse length ([[laser-damage-and-coating-durability]]).

### Measuring them
A **thermopile** head absorbs the beam and converts the heat to a voltage: it reads watts of almost any wavelength, slowly. A **photodiode** is fast but responds differently at each wavelength. A **pyroelectric** sensor measures the energy of single pulses. A camera **beam profiler** measures the area, from which the irradiance follows. A meter head can be burned by too much power or too high an irradiance, so it is chosen for the beam, not the other way round.

> [!key] Power and energy say how much light; irradiance (W/cm²) and fluence (J/cm²) say how much lands per area, which is what heats, cuts, ablates or damages. For a Gaussian beam the peak is $2P/\\pi w^2$ and $2E/\\pi w^2$, and fluence is irradiance times duration.
`,
  ideas: [
    'Power (W) and energy (J) are totals; irradiance (W/cm²) and fluence (J/cm²) divide them by area and say what lands per area.',
    'Irradiance suits continuous beams; fluence suits pulses; fluence = irradiance × duration for a flat pulse.',
    'For a Gaussian beam of $1/e^2$ radius $w$, the peak irradiance is $2P/\\pi w^2$, twice the average over the $1/e^2$ circle; always check which definition is meant.',
    'Halving the spot diameter multiplies irradiance and fluence by four; neither power nor energy changes.',
    'Damage thresholds are quoted for one wavelength, pulse length and repetition rate, and scale roughly with the square root of the pulse length for nanoseconds to microseconds.'
  ],
  pitfalls: [
    'A laser\'s power tells how dangerous it is — Power alone does not: a 5 W beam spread over a wall is harmless to look at, while 5 mW focused by the eye\'s lens onto the retina is not. Irradiance (and exposure time) decides.',
    'W/cm² and J/cm² are the same thing for lasers — They are different quantities: one is a rate per area, the other an amount per area. A CW beam has irradiance only (in one second it delivers a fluence equal to its irradiance in J/cm²); a pulse has both.',
    'The peak irradiance is the beam power divided by the beam area — For a Gaussian beam it is twice that, since the centre is brighter than the average over the $1/e^2$ circle.',
    'A damage threshold in J/cm² is a property of the optic alone — It depends on the wavelength, the pulse length, the repetition rate and the beam size used in the test, and holds only for conditions like them.'
  ],
  terms: [
    { term: 'Irradiance', also: ['intensity', 'power density', 'W/cm²'], def: 'The power per unit area falling on a surface, in W/m² or W/cm². For a laser beam it is highest at the centre; for a Gaussian beam the peak is 2P/πw².' },
    { term: 'Fluence', also: ['radiant exposure', 'energy density', 'J/cm²'], def: 'The energy per unit area delivered by a pulse or by an exposure, in J/m² or J/cm². Damage thresholds and ablation thresholds of pulsed lasers are quoted as fluences.' },
    { term: 'Peak irradiance', def: 'The irradiance at the brightest point of a beam at the brightest moment of a pulse: the peak power divided by an effective beam area. For a Gaussian beam, twice the average over the 1/e² circle.' },
    { term: 'Beam diameter', also: ['1/e² diameter', 'D4σ'], def: 'The width of a beam, which has no sharp edge, so it needs a definition: the 1/e² points of the intensity, the full width at half maximum, or the second-moment diameter of ISO 11146.' },
    { term: 'Thermopile', def: 'A power-meter sensor that absorbs the beam and measures the heat flow with thermocouples. It covers a wide range of wavelengths and powers but responds slowly.' }
  ],
  formulas: [
    {
      name: 'Energy delivered by a continuous beam',
      expr: 'E = P*t', tex: 'E = P\\,t',
      vars: {
        E: { name: 'energy', q: 'energy', unit: 'J', tex: 'E' },
        P: { name: 'power', q: 'power', unit: 'W', value: 5, tex: 'P' },
        t: { name: 'exposure time', q: 'time', unit: 's', value: 10, tex: 't' }
      },
      solveFor: 'E',
      stories: { E: 'A beam of {P} acts for {t}. How much energy does it deliver?' }
    },
    {
      name: 'Peak irradiance of a Gaussian beam',
      expr: 'I0 = 2*P/(pi*w^2)', tex: 'I_{0} = \\frac{2P}{\\pi\\,w^{2}}',
      vars: {
        I0: { name: 'peak irradiance', q: 'intensity', unit: 'W/cm²', tex: 'I_{0}' },
        P: { name: 'power', q: 'power', unit: 'mW', value: 5, tex: 'P' },
        w: { name: '1/e² radius of the beam', q: 'length', unit: 'mm', value: 0.5, tex: 'w' }
      },
      solveFor: 'I0',
      note: 'For a pulse use the peak power. The average over the 1/e² circle is half of this.',
      stories: { I0: 'A Gaussian beam of {P} has a 1/e² radius of {w}. What is its peak irradiance?', w: 'A beam of {P} must reach a peak irradiance of {I0}. What 1/e² radius must it be focused to?' }
    },
    {
      name: 'Peak fluence of a Gaussian pulse',
      expr: 'F0 = 2*E/(pi*w^2)', tex: 'F_{0} = \\frac{2E}{\\pi\\,w^{2}}',
      vars: {
        F0: { name: 'peak fluence', q: 'fluence', unit: 'J/cm²', tex: 'F_{0}' },
        E: { name: 'pulse energy', q: 'energy', unit: 'mJ', value: 100, tex: 'E' },
        w: { name: '1/e² radius of the beam', q: 'length', unit: 'mm', value: 2.5, tex: 'w' }
      },
      solveFor: 'F0',
      stories: { F0: 'A Gaussian pulse of {E} has a 1/e² radius of {w}. What is its peak fluence?', w: 'A pulse of {E} must not exceed a peak fluence of {F0} on an optic. What 1/e² radius does the beam need?' }
    },
    {
      name: 'Fluence from irradiance',
      expr: 'F = I*tau', tex: 'F = I\\,\\tau',
      vars: {
        F: { name: 'fluence', q: 'fluence', unit: 'J/cm²', tex: 'F' },
        I: { name: 'irradiance during the pulse', q: 'intensity', unit: 'kW/m²', value: 1e4, tex: 'I' },
        tau: { name: 'pulse duration', q: 'time', unit: 'ns', value: 10, tex: '\\tau' }
      },
      solveFor: 'F',
      note: 'For a pulse of constant irradiance; a real pulse differs by a factor close to 1.',
      stories: { F: 'An irradiance of {I} lasts {tau}. What fluence does it deliver?' }
    }
  ],
  examples: [
    {
      title: 'The pointer on the wall',
      q: 'A 5 mW laser pointer has a beam 1 mm across (1/e² diameter). What are its average irradiance over the 1/e² circle and its peak irradiance? Compare with sunlight, 0.1 W/cm².',
      steps: [
        { text: 'With $w = 0.5$ mm = 0.05 cm, the 1/e² area is', tex: '\\pi w^2 = \\pi \\times (0.05\\ \\mathrm{cm})^2 = 7.85\\times10^{-3}\\ \\mathrm{cm^2}' },
        'The average over it is $5\\times10^{-3}\\ \\mathrm{W}/7.85\\times10^{-3}\\ \\mathrm{cm^2} = 0.64$ W/cm² (and 86.5 % of the power is within this circle).',
        'The peak at the centre is twice that: 1.3 W/cm².'
      ],
      a: 'Peak 1.3 W/cm², some thirteen times the Sun\'s irradiance, from a few milliwatts: that, not the power, is why a pointer can dazzle and a bigger one can burn.'
    },
    {
      title: 'Will the mirror survive?',
      q: 'A Q-switched laser emits 100 mJ in 10 ns. Its beam on a mirror is Gaussian with a $1/e^2$ diameter of 5 mm. The mirror coating is rated for about 10 J/cm² at 10 ns. Find the peak fluence and the peak irradiance.',
      steps: [
        { text: 'With $w = 2.5$ mm = 0.25 cm,', tex: 'F_0 = \\frac{2E}{\\pi w^2} = \\frac{2 \\times 0.1\\ \\mathrm{J}}{\\pi \\times (0.25\\ \\mathrm{cm})^2} = 1.0\\ \\mathrm{J/cm^2}' },
        { text: 'The peak irradiance, for a flat 10 ns pulse:', tex: 'I_0 \\approx \\frac{F_0}{\\tau} = \\frac{1.0\\ \\mathrm{J/cm^2}}{10^{-8}\\ \\mathrm{s}} = 1\\times10^{8}\\ \\mathrm{W/cm^2}' }
      ],
      a: 'A peak fluence of 1 J/cm², a tenth of the rating, and a peak irradiance of 100 MW/cm². Fine for a clean coating; a dust particle or a hot spot in the beam, locally ten times brighter, is what really damages optics, so a safety factor of several is used.'
    }
  ],
  quiz: [
    { q: 'Which quantity is the one you should compare with the damage threshold of a mirror for 10 ns pulses?', choices: ['Average power', 'Wavelength', 'Pulse repetition rate only', 'Fluence in J/cm²'], a: 3, why: 'Pulsed damage thresholds are quoted as fluences (J/cm²) for a stated pulse length, wavelength and repetition rate. The beam\'s total energy alone says nothing until it is divided by its area.' },
    { q: 'You focus a laser beam to half its spot diameter. The peak irradiance changes by a factor of…', choices: ['2', '4', '8', 'it does not change'], a: 1, why: 'The area goes as the square of the diameter, so halving the diameter divides the area by 4 and raises the irradiance by 4. The power is unchanged.' },
    { q: 'For a continuous beam, irradiance in W/cm² and fluence in J/cm² are equal numbers.', a: false, why: 'They have different units and meanings: irradiance is a rate; fluence is an amount. A CW beam delivers a fluence equal to its irradiance times the exposure time in seconds, so the numbers coincide only for a one-second exposure.' },
    { q: 'What is the peak irradiance, in W/cm², of a 1 W Gaussian beam focused to a $1/e^2$ radius of 10 µm?', answer: 6.4e5, unit: 'W/cm²', why: '$I_0 = 2P/\\pi w^2 = 2 / (\\pi \\times (10^{-3}\\ \\mathrm{cm})^2) = 6.4\\times10^{5}$ W/cm².' },
    { q: 'Why can a laser power meter be damaged by a beam of modest power?', choices: ['Because meters are fragile', 'Because lasers produce radio waves', 'Because a small spot gives a high irradiance, and every sensor has a damage threshold in W/cm²', 'Because the meter\'s calibration drifts'], a: 2, why: 'A sensor\'s absorber survives only up to a certain irradiance (and, for pulses, fluence). A few watts focused to a 0.1 mm spot exceed it, so the beam must be expanded or attenuated first.' }
  ],
  applications: [
    'Reading the damage threshold of mirrors, windows and coatings, quoted in J/cm² for a stated pulse length ([[laser-damage-and-coating-durability]]).',
    'Setting the dose of a laser treatment in medicine: the fluence in J/cm² at the tissue, for tattoo removal or corneal ablation.',
    'Choosing a laser and a lens for cutting or welding, where irradiance in W/cm² at the focus decides the process ([[laser-marking-and-cutting-heads]]).',
    'Laser safety: the exposure limits for the eye and skin are irradiances for long exposures and fluences for short pulses ([[laser-safety-classes]]).',
    'Choosing a power or energy meter for a beam, so that neither its range nor its damage threshold is exceeded.'
  ],
  sources: [
    'ISO 11146, *Lasers and laser-related equipment — Test methods for laser beam widths, divergence angles and beam propagation ratios* — the definition of beam diameter.',
    'ISO 21254, *Lasers and laser-related equipment — Test methods for laser-induced damage threshold* — how thresholds in J/cm² are measured.',
    'A. E. Siegman, *Lasers* — the sections on Gaussian beams, power and intensity.',
    'D. H. Sliney and M. L. Wolbarsht, *Safety with Lasers and Other Optical Sources* — radiometric quantities for laser exposure.'
  ],
  sim: [{ id: 'lp-pulses', params: { preset: 'fs' } }]
},

/* ================================================================ safety classes */
{
  id: 'laser-safety-classes', parent: 'laser-principles', title: 'Laser safety classes', level: 1,
  short: 'Lasers are sorted into classes 1, 1M, 2, 2M, 3R, 3B and 4 by the harm their beam can do. The class, printed on a label, tells the user what precautions apply; behind it lie the maximum permissible exposure of the eye and the distance within which a beam is hazardous. Invisible beams are the more dangerous, because nothing makes you look away.',
  keywords: ['laser safety', 'laser classes', 'class 1', 'class 2', 'class 3R', 'class 3B', 'class 4', 'IEC 60825-1', 'MPE', 'maximum permissible exposure', 'NOHD', 'nominal ocular hazard distance', 'blink reflex', 'aversion response', 'laser pointer', 'warning label', 'accessible emission limit'],
  prereq: ['laser-power-and-energy-measures', 'continuous-and-pulsed-lasers'],
  related: ['laser-eye-hazards-and-eyewear', 'what-makes-laser-light-special', 'neutral-density-and-optical-density', 'laser-families-overview', 'aligning-an-optical-system', 'laser-processing-systems', 'the-pupil'],
  body: `
Lasers are classified by the harm their light can do, so that the label on the box tells the user which precautions apply. The system is **IEC 60825-1**, with the US standard ANSI Z136.1 describing the safe *use* of lasers. It is the manufacturer who classifies a product; the user does not need to measure it, but must understand what the label means.

> [!warn] This page explains the system; it is not a safety procedure. Real work with Class 3B and Class 4 lasers is governed by the standard and by a laser safety officer. Never look into a beam or its mirror-like reflection, and never point a laser at a person, a vehicle or an aircraft: that is dangerous, and in many countries a crime.

### The classes
The limits below are for **visible, continuous** beams (400 to 700 nm); other wavelengths and pulsed beams have limits of their own.

| Class | Power limit | Meaning | Examples |
|---|---|---|---|
| **1** | 0.39 mW | safe in normal use, even for a long stare; includes strong lasers sealed inside a product | laser printers, disc players |
| **1M** | as Class 1 | safe to the naked eye; may be hazardous with a magnifier, telescope or binoculars (large or divergent beams) | some fibre-optic sources |
| **2** | 1 mW, visible only | the blink reflex (about 0.25 s) protects the eye; do not stare | barcode scanners, spirit-level lasers |
| **2M** | as Class 2 | as Class 2, but not safe with optical aids | |
| **3R** | 5 mW | low risk but the limit can be exceeded: avoid direct eye exposure | stronger pointers, alignment lasers |
| **3B** | 500 mW | the direct beam and mirror-like reflections injure the eye at once; a diffuse reflection is normally safe | laboratory lasers, show projectors, therapy lasers |
| **4** | above 500 mW | injures the eye and skin even by diffuse reflection; a fire hazard | cutting, welding, marking, surgery |

A label carries the class, the wavelength and the maximum power, and, from Class 2 upwards, a yellow warning triangle and the words "laser radiation — do not stare into beam" or "avoid exposure to beam".

### Where the limits come from: the MPE
The **maximum permissible exposure** (MPE) is the most that the eye or skin can receive without injury, set well below the level that harms, and it depends on the wavelength and on how long the exposure lasts. For visible light from 18 µs to 10 s, the exposure at the cornea is $H = 18\\,t^{0.75}$ J/m², an irradiance of $18\\,t^{-0.25}$ W/m²: 25.5 W/m² (2.6 mW/cm²) for a blink of 0.25 s and 10 W/m² for 10 s. Pass that irradiance through a 7 mm pupil, of area $3.85\\times10^{-5}$ m²: **0.98 mW** for the blink, **0.39 mW** for 10 s. Those are the limits of Class 2 and Class 1. The classes are the MPE, seen through the pupil.

### How far away is it still hazardous?
A beam spreads. With power $P$, an exit diameter $a$ and a full divergence $\\varphi$, its irradiance at distance $d$ is about $4P/\\pi(a + \\varphi d)^2$. The **nominal ocular hazard distance** is where that falls to the MPE:

$$\\mathrm{NOHD} = \\frac{1}{\\varphi}\\left(\\sqrt{\\frac{4P}{\\pi\\,\\mathrm{MPE}}} - a\\right)$$

A 5 mW pointer with a 1.5 mm beam spreading by 1.5 mrad has an NOHD of about 10 m for a blink; a 1 W laser with a 3 mm beam and 1 mrad, about 220 m. The simulation lets you vary both.

### Invisible beams are worse
The blink and the turning away of the head, the *aversion response*, work only for visible light, which is why Classes 2 and 2M exist for visible beams alone. An infrared beam of the same power gives no glare, no warning and, on the retina, no pain. The invisible beam from an infrared laser, or the infrared leaking from a "green" pointer, is the real hazard of the laboratory ([[laser-eye-hazards-and-eyewear]]).

### What each class asks of the user
Class 3B adds a key switch, an interlock on the room, a beam stop, a warning light, controlled access and eyewear. Class 4 adds enclosure of the beam wherever possible, trained users and a laser safety officer, because even a diffuse reflection and the skin and fire hazards matter. Beams are kept above or below eye level, reflective jewellery is removed, and alignment is done at low power.

> [!key] Classes follow from the power a beam can put through the pupil compared with the MPE: 0.39 mW (Class 1), 1 mW (2), 5 mW (3R), 0.5 W (3B), above (4), for visible continuous beams. The hazard distance (NOHD) tells how far a beam stays above the MPE. Invisible beams are the more dangerous, because nothing makes the eye avoid them.
`,
  ideas: [
    'Lasers are put into classes 1, 1M, 2, 2M, 3R, 3B and 4 by the manufacturer under IEC 60825-1; the class tells what precautions apply.',
    'For visible continuous beams the limits are 0.39 mW (1), 1 mW (2), 5 mW (3R), 500 mW (3B), and above that Class 4.',
    'The class limits are the maximum permissible exposure at the cornea multiplied by the area of a 7 mm pupil; the MPE depends on wavelength and duration.',
    'The nominal ocular hazard distance is where the beam falls to the MPE; it grows with power and shrinks as the divergence rises.',
    'Invisible beams are more dangerous because the blink reflex does not protect against them; Class 2 exists for visible light only.'
  ],
  pitfalls: [
    'Class 2 is "completely safe" — It is safe against a *glance*: the blink reflex limits the exposure to 0.25 s. A deliberate stare, or a magnifying optic, can exceed the MPE.',
    'A 5 mW pointer is harmless beyond a few metres — Its beam is still above the exposure limit for ten metres or more, and its reflection from a mirror or glass is just as bad.',
    'The class tells how bright a laser looks — It tells the harm: an invisible infrared laser of Class 3B looks like nothing at all, yet it injures the retina at once.',
    'Diffuse reflections from a wall are always safe — For Class 4 they are not: the reflected light of a beam of tens of watts can exceed the MPE, and it can start a fire.'
  ],
  terms: [
    { term: 'Laser class', also: ['laser product class', 'Class 1', 'Class 2', 'Class 3R', 'Class 3B', 'Class 4'], def: 'A category (1, 1M, 2, 2M, 3R, 3B, 4) assigned by the manufacturer under IEC 60825-1 according to the accessible emission of a laser product. The class sets the labels and the precautions.' },
    { term: 'Maximum permissible exposure', also: ['MPE'], def: 'The highest level of laser radiation at the eye or skin that is not expected to cause injury, in W/m² or J/m². It depends on wavelength, exposure time and size of the source.' },
    { term: 'Nominal ocular hazard distance', also: ['NOHD'], def: 'The distance from a laser beyond which the beam irradiance is below the MPE, so that the direct beam is not hazardous to the eye.' },
    { term: 'Accessible emission limit', also: ['AEL'], def: 'The greatest power or energy that a laser of a given class may emit through its accessible beam, according to IEC 60825-1. The numbers of the class table are AELs.' },
    { term: 'Aversion response', also: ['blink reflex'], def: 'The protective reflex, about 0.25 s, of blinking and turning the head from a bright light. It limits the exposure to a visible laser beam, but does not act against invisible beams.' },
    { term: 'Laser safety officer', also: ['LSO'], def: 'The person responsible for the safe use of lasers at a site: classifying the work, setting controls, training users and checking eyewear. Required where Class 3B and Class 4 lasers are used.' }
  ],
  formulas: [
    {
      name: 'MPE for visible light, blink to 10 s',
      expr: 'E = 18*t^(-0.25)', tex: 'E_{MPE} = 18\\,t^{-0.25}',
      vars: {
        E: { name: 'MPE as an irradiance at the cornea', q: 'intensity', unit: 'W/m²', tex: 'E_{MPE}' },
        t: { name: 'exposure time', q: 'time', unit: 's', value: 0.25, min: 1.8e-5, max: 10, tex: 't' }
      },
      solveFor: 'E',
      note: 'For visible light 400–700 nm, durations from 18 µs to 10 s; beyond 10 s the limit stays near 10 W/m². Other wavelengths and pulses have other limits.',
      stories: { E: 'A visible beam falls on the eye for {t}. What is the MPE as an irradiance at the cornea?' }
    },
    {
      name: 'Power allowed into the pupil',
      expr: 'P = E*pi*(d/2)^2', tex: 'P = E_{MPE}\\,\\pi\\left(\\frac{d}{2}\\right)^{2}',
      vars: {
        P: { name: 'power through the pupil that reaches the MPE', q: 'power', unit: 'mW', tex: 'P' },
        E: { name: 'MPE as an irradiance', q: 'intensity', unit: 'W/m²', value: 25.5, tex: 'E_{MPE}' },
        d: { name: 'pupil diameter', q: 'length', unit: 'mm', value: 7, tex: 'd' }
      },
      solveFor: 'P',
      note: '25.5 W/m² through a 7 mm pupil gives 0.98 mW: the Class 2 limit.',
      stories: { P: 'The MPE is {E}. How much power passes through a pupil {d} across when the beam fills it at the limit?' }
    },
    {
      name: 'Beam irradiance at a distance',
      expr: 'E = 4*P/(pi*(a + phi*z)^2)', tex: 'E = \\frac{4P}{\\pi\\,(a + \\varphi z)^{2}}',
      vars: {
        E: { name: 'irradiance on axis (uniform-beam estimate)', q: 'intensity', unit: 'W/m²', tex: 'E' },
        P: { name: 'power of the beam', q: 'power', unit: 'W', value: 0.005, tex: 'P' },
        a: { name: 'beam diameter at the laser', q: 'length', unit: 'mm', value: 1.5, tex: 'a' },
        phi: { name: 'full divergence angle', q: 'angle', unit: 'mrad', value: 1.5, tex: '\\varphi' },
        z: { name: 'distance from the laser', q: 'length', unit: 'm', value: 5, tex: 'z' }
      },
      solveFor: 'E',
      stories: { E: 'A beam of {P} leaves a laser {a} across and spreads by {phi}. What is its irradiance at {z}?' }
    },
    {
      name: 'Nominal ocular hazard distance',
      expr: 'Dn = (sqrt(4*P/(pi*E)) - a)/phi', tex: '\\mathrm{NOHD} = \\frac{1}{\\varphi}\\left(\\sqrt{\\frac{4P}{\\pi E_{MPE}}} - a\\right)',
      vars: {
        Dn: { name: 'nominal ocular hazard distance', q: 'length', unit: 'm', tex: '\\mathrm{NOHD}' },
        P: { name: 'power of the beam', q: 'power', unit: 'W', value: 0.005, tex: 'P' },
        E: { name: 'MPE as an irradiance', q: 'intensity', unit: 'W/m²', value: 25.5, tex: 'E_{MPE}' },
        a: { name: 'beam diameter at the laser', q: 'length', unit: 'mm', value: 1.5, tex: 'a' },
        phi: { name: 'full divergence angle', q: 'angle', unit: 'mrad', value: 1.5, tex: '\\varphi' }
      },
      solveFor: 'Dn',
      note: 'A conservative uniform-beam estimate for a visible continuous beam; the result is zero if the beam never exceeds the MPE.',
      stories: { Dn: 'A {P} beam leaves the laser {a} wide and spreads by {phi}. Beyond what distance is it below the MPE of {E}?' }
    }
  ],
  examples: [
    {
      title: 'The green pointer',
      q: 'A 5 mW green pointer emits a beam 1.5 mm across, spreading by 1.5 mrad. How far is the beam above the MPE for a blink, 25.5 W/m²?',
      steps: [
        { text: 'The beam must have spread until', tex: '\\sqrt{\\frac{4P}{\\pi\\,E_{MPE}}} = \\sqrt{\\frac{4 \\times 0.005}{\\pi \\times 25.5}} = 15.8\\ \\mathrm{mm}' },
        { text: 'The diameter grows from 1.5 mm, so the distance is', tex: '\\mathrm{NOHD} = \\frac{15.8 - 1.5}{1.5\\ \\mathrm{mm/m}} = 9.5\\ \\mathrm{m}' }
      ],
      a: 'About 10 m for a blink: much more for a stare, since the MPE for 10 s is 10 W/m² and the NOHD about 16 m. "Class 3R, avoid direct eye exposure" has to be read at that scale.'
    },
    {
      title: 'A one-watt blue laser',
      q: 'A 1 W laser has a 3 mm exit beam and spreads by 1 mrad. What is its NOHD for a blink?',
      steps: [
        { text: 'The beam must reach a diameter of', tex: '\\sqrt{\\frac{4 \\times 1}{\\pi \\times 25.5}} = 0.223\\ \\mathrm{m}' },
        { text: 'So', tex: '\\mathrm{NOHD} = \\frac{0.223 - 0.003}{10^{-3}\\ \\mathrm{m/mrad}\\ \\cdot\\ 1\\ \\mathrm{mrad}} = 220\\ \\mathrm{m}' }
      ],
      a: 'About 220 m. A Class 4 beam from a handheld-sized device is hazardous to the eye across the length of two football pitches, and its diffuse reflection within a few metres.'
    }
  ],
  quiz: [
    { q: 'Which class is a visible continuous beam of 3 mW?', choices: ['Class 1', 'Class 2', 'Class 3R', 'Class 3B'], a: 2, why: 'It is above the 1 mW limit of Class 2 and below the 5 mW limit of Class 3R. Class 3R is "low risk, but avoid direct eye exposure".' },
    { q: 'What is the power, in milliwatts, that passes through a 7 mm pupil when the beam irradiance equals the 0.25 s MPE of 25.5 W/m²?', answer: 0.98, unit: 'mW', why: '$25.5\\ \\mathrm{W/m^2} \\times \\pi (3.5\\times10^{-3}\\ \\mathrm{m})^2 = 25.5 \\times 3.85\\times10^{-5} = 0.98$ mW: the Class 2 limit.' },
    { q: 'Class 2 lasers exist for infrared wavelengths as well as for visible ones.', a: false, why: 'Class 2 relies on the blink reflex, which acts only against light that is seen. For invisible wavelengths there is no aversion response, so no Class 2.' },
    { q: 'You increase the divergence of a laser beam while leaving its power unchanged. The nominal ocular hazard distance…', choices: ['shrinks', 'grows', 'stays the same', 'becomes infinite'], a: 0, why: 'A more divergent beam dilutes its power faster, so it falls to the MPE sooner. The formula has the divergence $\\varphi$ in the denominator.' },
    { q: 'Why is an invisible 1064 nm Class 3B beam in some ways more dangerous than a visible green one of the same power?', choices: ['It is more powerful', 'The eye cannot see it, so there is no glare and no blink reflex to limit the exposure, and the retina feels no pain', 'It cannot be blocked by eyewear', 'It is always pulsed'], a: 1, why: 'The aversion response relies on the beam being seen. The retina absorbs near-infrared light and is injured without any warning sensation.' }
  ],
  applications: [
    'Choosing and labelling laser products: every pointer, scanner and printer carries its class.',
    'Planning a laboratory or workshop: the class decides interlocks, enclosures, eyewear and training.',
    'Outdoor and show lasers: the hazard distance sets how far from the audience and the airspace a beam must be kept.',
    'Machine vision and lidar: Class 1 or 1M products are required where people pass; the designer chooses the wavelength and power to meet the limit ([[lidar]]).',
    'Checking a beam dump or enclosure: the question is always whether anything accessible can exceed the MPE.'
  ],
  history: 'The first laser safety standards appeared in the 1960s and 70s, after the first retinal burns in the laboratories of the new ruby and neodymium lasers; ANSI Z136.1 was first issued in 1973 and the International Electrotechnical Commission published its first laser standard, IEC 825, in 1984, later renumbered 60825-1. The classes have been revised several times, adding 1M, 2M and 3R in 2001 and refining the limits since.',
  sources: [
    'IEC 60825-1, *Safety of laser products — Part 1: Equipment classification and requirements* — the classes, the accessible emission limits, the labels.',
    'ANSI Z136.1, *Safe Use of Lasers* — the maximum permissible exposure and control measures in use.',
    'D. H. Sliney and M. L. Wolbarsht, *Safety with Lasers and Other Optical Sources* — the biological basis of the exposure limits.',
    'R. Henderson and K. Schulmeister, *Laser Safety* — the classification and the hazard distance in practice.'
  ],
  sim: 'lp-safety'
},

/* ================================================================ eye hazards and eyewear */
{
  id: 'laser-eye-hazards-and-eyewear', parent: 'laser-principles', title: 'Eye hazards and laser eyewear', level: 2,
  short: 'The eye focuses light of 400 to 1400 nm onto the retina and raises its irradiance there by a factor of about 100 000, so a beam too weak to burn skin can injure sight. Each band of the spectrum is absorbed somewhere different, and protective eyewear is marked with the wavelengths it covers and its optical density; engineering controls come first.',
  keywords: ['laser eye safety', 'retinal injury', 'retinal hazard region', 'cornea', 'photokeratitis', 'optical density', 'OD', 'laser protective eyewear', 'laser goggles', 'EN 207', 'retinal gain', 'invisible laser', 'infrared laser hazard', 'ultraviolet laser hazard', 'beam dump', 'interlock', 'alignment eyewear'],
  prereq: ['laser-safety-classes', 'the-eye-as-a-camera', 'transmission-and-absorption'],
  related: ['neutral-density-and-optical-density', 'the-pupil', 'anatomy-of-the-eye', 'uv-and-infrared-sources', 'laser-families-overview', 'aligning-an-optical-system', 'laser-processing-systems', 'photochromic-tinted-and-polarized-lenses'],
  body: `
> [!warn] Never look into a laser beam or its specular reflection, and never point a laser at a person, a vehicle or an aircraft. The retina has no pain nerves: an injury can happen without any sensation. Sudden loss or blurring of vision, a dark or missing spot in the centre of the view, flashes or floaters, or a painful red eye after exposure to a laser can mean injury; after any suspected exposure, seek urgent eye care.

The eye is a superb light collector, and that is the problem. It was built to gather faint light and focus it onto a patch of sensitive tissue a fraction of a millimetre across; give it a laser and it does exactly the same, with much more effect. This page explains how; real work with Class 3B and Class 4 lasers is governed by the safety standard and a laser safety officer ([[laser-safety-classes]]).

### Where each wavelength goes
The eye's media (the cornea, the aqueous fluid, the lens, the gel) transmit from about 400 to 1400 nm. Outside that window the light is stopped near the front.

| Band | Wavelengths | Absorbed mainly in | Injury, in general terms |
|---|---|---|---|
| Ultraviolet C and B | 100–315 nm | the cornea | inflammation of the surface (photokeratitis), felt hours later |
| Ultraviolet A | 315–400 nm | the lens | long or repeated exposure is a risk to the lens |
| Visible | 400–700 nm | the retina | thermal burn; with blue light, photochemical injury too |
| Near infrared | 700–1400 nm | the retina | the same, with no glare and no blink reflex |
| Short-wave infrared | 1400–3000 nm | cornea, aqueous, lens (water absorbs) | heating of the front of the eye at high power |
| Mid and far infrared | above 3000 nm (CO₂, 10.6 µm) | the surface of the cornea | burn of the surface |

The range 400 to 1400 nm is called the **retinal hazard region**.

### The retinal gain
A collimated beam enters through the pupil, up to 7 mm across in the dark, and the eye brings it to a focus on the retina. The focused spot is not a point: aberrations and scatter keep it near 20 µm. The irradiance at the retina is therefore greater than at the cornea by about the ratio of areas:

$$G = \\left(\\frac{D}{d}\\right)^2 = \\left(\\frac{7\\ \\mathrm{mm}}{20\\ \\mu\\mathrm{m}}\\right)^2 \\approx 1.2\\times10^{5}$$

So 1 mW in a beam 3 mm across is only 14 mW/cm² at the cornea, but some 250 W/cm² on the retina, enough to burn it if it stays long. A blink, 0.25 s, is the margin that Class 2 relies on. Pulses add a different mechanism: nanosecond pulses can injure by shock and microbubbles at far lower energies than heat would need, and a Q-switched laser can cause bleeding in the retina.

### Invisible beams
Near-infrared light passes the eye like visible light but produces almost no sensation of brightness, so there is no glare and no look-away. The visible "green" pointer is often a frequency-doubled infrared laser, and some leaks infrared through its filter ([[frequency-doubling-and-nonlinear-optics]]).

### Eyewear
Laser protective eyewear absorbs or reflects the dangerous wavelengths and passes enough of the rest to see. It is marked with the **wavelength range** it covers and its **optical density**, $\\mathrm{OD} = -\\log_{10}T$: OD 3 passes 1/1000, OD 6 one millionth ([[neutral-density-and-optical-density]]). In Europe, EN 207 adds a letter for the kind of laser (D continuous, I pulsed, R giant pulses, M mode-locked) and a scale number. The OD needed is $\\log_{10}$ of the exposure divided by the MPE: for a 1 W, 2 mm beam, $3.2\\times10^{5}$ W/m² against 25.5 W/m² is a ratio of $1.2\\times10^{4}$, OD 4.1, so OD 5 or more with a margin. It must also *survive* the beam for some seconds without burning through.

- Eyewear works **only at its marked wavelengths**. Goggles for 532 nm may pass 1064 nm; use eyewear that covers every wavelength the laser emits.
- *Alignment eyewear* passes a little visible light so that the beam spot can be seen at low power; it is not protection from a strong beam.
- Eyewear is the **last** line of defence. Before it come enclosure, beam stops and dumps, interlocks, warning lights, a beam path away from eye level, removal of reflective objects, low power for alignment, and training.

> [!key] The eye focuses 400 to 1400 nm onto the retina with a gain near $10^5$, so milliwatts can injure sight; ultraviolet and long infrared are stopped by the cornea and lens. Invisible beams give no warning. Eyewear is chosen by wavelength range and OD, and engineering controls come first.
`,
  ideas: [
    'The eye transmits 400 to 1400 nm to the retina; ultraviolet is absorbed in the cornea and lens, long infrared in the cornea.',
    'Focusing raises the irradiance on the retina by $(D/d)^2$, about $10^5$ for a 7 mm pupil and a 20 µm spot.',
    'Invisible and pulsed beams are especially dangerous: no blink reflex, no pain, and pulses can injure by shock.',
    'Eyewear is rated by wavelength range and optical density, $\\mathrm{OD} = -\\log_{10}T$, and must be chosen for every wavelength the laser emits.',
    'Eyewear is the last line of defence, after enclosures, beam stops, interlocks and safe procedures.'
  ],
  pitfalls: [
    'If it does not hurt, nothing is wrong — The retina has no pain nerves. A retinal burn is painless; the first sign may be a blind spot or blurred vision.',
    'Green laser goggles protect against any laser — They protect only at the wavelengths marked. A "green" pointer often emits invisible infrared as well, which green-only goggles may not stop.',
    'Strong sunglasses are laser eyewear — Ordinary dark lenses have an OD of about 1 over the visible and little or nothing in the near infrared; they carry no marking for laser wavelengths or for resistance to the beam.',
    'The eye is safe from a laser at 10.6 µm because it is infrared — A CO₂ beam does not reach the retina, but it burns the surface of the cornea; the eye is not safe from it.'
  ],
  terms: [
    { term: 'Retinal hazard region', def: 'The range of wavelengths, 400 to 1400 nm, that the eye transmits to the retina, where the focusing of the eye makes the exposure much higher than at the cornea.' },
    { term: 'Retinal gain', def: 'The factor by which the eye\'s focusing raises the irradiance on the retina above that at the cornea, about (D/d)² ≈ 10⁵ for a 7 mm pupil and a 20 µm focal spot.' },
    { term: 'Optical density', also: ['OD', 'absorbance'], def: 'The logarithm of the attenuation of a filter or eyewear: OD = −log₁₀T. OD 3 passes one thousandth of the light, OD 6 one millionth.' },
    { term: 'Laser protective eyewear', also: ['laser goggles', 'laser safety glasses'], def: 'Eyewear that attenuates stated laser wavelengths by a stated optical density and survives the beam for a stated time; marked with the wavelength range, the OD or scale number and the type of laser.' },
    { term: 'Photokeratitis', also: ['arc eye', 'welder\'s flash'], def: 'A painful inflammation of the surface of the cornea caused by ultraviolet light, which usually shows several hours after the exposure and heals in days.' },
    { term: 'Alignment eyewear', def: 'Eyewear that reduces visible laser light to about the Class 2 level so that a beam spot can be seen at low power. It is not protection for stronger beams.' }
  ],
  formulas: [
    {
      name: 'Retinal gain',
      expr: 'G = (D/d)^2', tex: 'G = \\left(\\frac{D}{d}\\right)^{2}',
      vars: {
        G: { name: 'irradiance gain from cornea to retina', tex: 'G' },
        D: { name: 'diameter of the beam entering the eye (pupil)', q: 'length', unit: 'mm', value: 7, tex: 'D' },
        d: { name: 'diameter of the focused spot on the retina', q: 'length', unit: 'µm', value: 20, tex: 'd' }
      },
      solveFor: 'G',
      note: 'The ratio of the area of the beam at the pupil to the area of its image.',
      stories: { G: 'A beam fills a pupil {D} wide and is focused to a spot {d} across. How many times is the irradiance increased?' }
    },
    {
      name: 'Optical density of a filter',
      expr: 'OD = -log(T)', tex: '\\mathrm{OD} = -\\log_{10}T',
      vars: {
        OD: { name: 'optical density', tex: '\\mathrm{OD}' },
        T: { name: 'transmittance of the eyewear at the laser wavelength', q: 'ratio', unit: '%', value: 0.1, min: 1e-9, max: 100, tex: 'T' }
      },
      solveFor: 'OD',
      stories: { OD: 'Eyewear passes {T} of the light at the laser wavelength. What is its optical density?', T: 'Eyewear of optical density {OD} is used. What fraction of the light does it pass?' }
    },
    {
      name: 'Optical density needed',
      expr: 'OD = log(E/mpe)', tex: '\\mathrm{OD} = \\log_{10}\\frac{E}{E_{MPE}}',
      vars: {
        OD: { name: 'optical density needed (at least)', tex: '\\mathrm{OD}' },
        E: { name: 'irradiance at the eye without eyewear', q: 'intensity', unit: 'W/m²', value: 3.18e5, tex: 'E' },
        mpe: { name: 'maximum permissible exposure', q: 'intensity', unit: 'W/m²', value: 25.5, tex: 'E_{MPE}' }
      },
      solveFor: 'OD',
      note: 'The minimum for the exposure to fall to the MPE; real eyewear is chosen with a margin and must resist the beam.',
      stories: { OD: 'A beam produces {E} at the eye; the exposure limit is {mpe}. What optical density must eyewear have, at least?' }
    },
    {
      name: 'Irradiance on the retina',
      expr: 'Er = 4*P*10^(-OD)/(pi*d^2)', tex: 'E_{r} = \\frac{4P\\,10^{-\\mathrm{OD}}}{\\pi\\,d^{2}}',
      vars: {
        Er: { name: 'irradiance on the retina', q: 'intensity', unit: 'W/cm²', tex: 'E_{r}' },
        P: { name: 'power entering the pupil', q: 'power', unit: 'mW', value: 1, tex: 'P' },
        OD: { name: 'optical density of the eyewear', value: 0, min: 0, max: 10, tex: '\\mathrm{OD}' },
        d: { name: 'diameter of the focused spot', q: 'length', unit: 'µm', value: 20, tex: 'd' }
      },
      solveFor: 'Er',
      note: 'Ignores the small losses in the eye\'s media (typically 50 to 90 % transmitted in the visible).',
      stories: { Er: 'A beam of {P} enters the eye behind eyewear of optical density {OD} and is focused to a spot {d} across. What is the irradiance on the retina?' }
    }
  ],
  examples: [
    {
      title: 'One milliwatt on the retina',
      q: 'A beam of 1 mW, 3 mm across, enters an eye with a 5 mm pupil and is focused to a spot 22 µm across. Find the irradiance at the cornea and on the retina, and the gain.',
      steps: [
        { text: 'At the cornea:', tex: 'E_c = \\frac{4P}{\\pi D^2} = \\frac{4 \\times 10^{-3}\\ \\mathrm{W}}{\\pi \\times (0.3\\ \\mathrm{cm})^2} = 14\\ \\mathrm{mW/cm^2}' },
        { text: 'On the retina:', tex: 'E_r = \\frac{4 \\times 10^{-3}\\ \\mathrm{W}}{\\pi \\times (2.2\\times10^{-3}\\ \\mathrm{cm})^2} = 260\\ \\mathrm{W/cm^2}' },
        'The gain is the ratio, $(3000/22)^2 \\approx 1.9\\times10^4$ (it would be $10^5$ with the whole 7 mm pupil filled).'
      ],
      a: '14 mW/cm² at the cornea, 260 W/cm² on the retina: a gain of about twenty thousand. The Class 2 limit (1 mW) is safe against a glance of 0.25 s, not against a stare.'
    },
    {
      title: 'Eyewear for a one-watt beam',
      q: 'A 1 W laser beam 2 mm across must be viewed with a blink-time exposure limit of 25.5 W/m². What optical density is the minimum for eyewear?',
      steps: [
        { text: 'The irradiance of the beam:', tex: 'E = \\frac{4P}{\\pi D^2} = \\frac{4}{\\pi \\times (2\\times10^{-3}\\ \\mathrm{m})^2} = 3.2\\times10^{5}\\ \\mathrm{W/m^2}' },
        { text: 'The ratio to the limit and its logarithm:', tex: '\\mathrm{OD} = \\log_{10}\\frac{3.2\\times10^{5}}{25.5} = 4.1' }
      ],
      a: 'At least OD 4.1, so in practice eyewear of OD 5 or more at that wavelength, one that withstands the beam for seconds. This is only the minimum for a beam entering the eye; the laser safety officer chooses eyewear from the wavelength, the power, the pulse structure and the exposure.'
    }
  ],
  quiz: [
    { q: 'An ultraviolet laser beam of 266 nm falls on the eye. Where is it absorbed?', choices: ['In the cornea', 'In the retina', 'In the vitreous gel', 'It passes through the eye'], a: 0, why: 'Ultraviolet B and C are absorbed in the cornea, the clear front surface. Light reaches the retina only between about 400 and 1400 nm.' },
    { q: 'What is the retinal gain for a 7 mm beam focused to a 20 µm spot?', answer: 1.2e5, why: '$G = (D/d)^2 = (7000/20)^2 = 122\\,500$, about $10^5$.' },
    { q: 'Eyewear marked "OD 4 at 532 nm" protects against an invisible 1064 nm beam from the same laser.', a: false, why: 'Eyewear is rated only for the wavelengths marked. A frequency-doubled "green" laser often leaks 1064 nm light that goggles for 532 nm may pass; eyewear must cover every wavelength the laser emits.' },
    { q: 'What fraction of the light does eyewear of optical density 4 pass at its rated wavelength?', choices: ['1/4', '1/40', '1/10 000', '1/4000'], a: 2, why: '$\\mathrm{OD} = -\\log_{10}T$, so $T = 10^{-4}$: one part in ten thousand.' },
    { q: 'Why is a near-infrared beam of 1 mW in some ways more dangerous to the eye than a green beam of 1 mW?', choices: ['It carries more energy per photon', 'It cannot be focused', 'It is invisible: no glare, no blink reflex and no pain warn the eye while the retina is injured', 'It does not reach the retina'], a: 2, why: 'Both are focused on the retina with the same gain. The green beam makes the person blink and look away; the infrared one is detected by nothing in time.' }
  ],
  applications: [
    'Laser laboratories and workshops, where eyewear is selected by wavelength, power, pulse structure and exposure time.',
    'Lasers in surgery and dermatology: the patient\'s and the staff\'s eyes are protected with eyewear marked for the laser in use.',
    'Light shows and outdoor lasers, where beams are kept above heads and out of the airspace.',
    'Welding and cutting machines: enclosures with interlocked, filter-windowed doors keep the beam, its reflections and the process light from the operator ([[laser-processing-systems]]).',
    'Product design: choosing Class 1 sealed enclosures so that users need no eyewear at all.'
  ],
  history: 'Retinal burns from the new ruby and neodymium lasers were reported in the early 1960s, and animal studies in those years gave the first exposure limits. The retinal hazard region and the ocular-media transmission data of the 1960s and 70s still underlie the standards; eyewear standards, such as the European EN 207 for protection and EN 208 for alignment, followed in the 1990s.',
  sources: [
    'D. H. Sliney and M. L. Wolbarsht, *Safety with Lasers and Other Optical Sources* — the interaction of light with the eye and the exposure limits.',
    'IEC 60825-1, *Safety of laser products* — the exposure limits and the classification.',
    'ANSI Z136.1, *Safe Use of Lasers* — hazard evaluation, controls and eyewear selection.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the transmission of the ocular media and the retinal image.'
  ],
  sim: 'lp-eye'
}

);
