/* HYPER-FEYNMAN · content/quantum-behaviour.js — the Quantum Behaviour branch (except the reference page
 * bullets-waves-electrons, in content/reference.js): watching the electrons, the uncertainty principle, the wave and
 * particle viewpoints, the rules of probability amplitudes, identical particles, bosons and lasers, the exclusion
 * principle, and what all this says about reality. Simulations: sims/quantum-behaviour.js (ids qb-…). */
Hyper.add(

{
  id: 'watching-electrons', parent: 'two-slits', title: 'Watching the electrons', level: 2,
  short: 'Shine a light behind the slits to see which one each electron goes through, and the interference fringes vanish: electrons that are watched land like bullets. Light gentle enough to leave the fringes alone turns out to be too blurred to tell the slits apart.',
  keywords: ['which-way', 'which path', 'measurement', 'observer', 'Heisenberg microscope', 'photon kick', 'recoil', 'decoherence', 'complementarity', 'fringe contrast', 'visibility', 'two-slit experiment', 'watching'],
  prereq: ['bullets-waves-electrons', 'physics:photon', 'physics:de-broglie-wavelength'],
  related: ['uncertainty-feyn', 'probability-amplitudes', 'quantum-reality', 'wave-and-particle', 'physics:double-slit'],
  body: `
The electrons of [[bullets-waves-electrons]] arrive as lumps and yet build fringes, as if each one had gone through both slits. The obvious thing to do is to look. Feynman's version of the experiment puts a bright light just behind the wall, between the two slits. Electrons scatter light, so every electron that passes makes a small flash — near slit 1 if it came through slit 1, near slit 2 if it came through slit 2. Now the claim "each electron goes through one slit or the other" can be checked directly.

### What the light shows
Every click at the screen comes with exactly one flash, either at slit 1 or at slit 2 — never at both, never half a flash at each. So an electron that is watched is always found at one slit. Now sort the arrivals by their flash. Those seen at slit 1 pile up in a smooth heap $P_1'$, just as when slit 2 is closed; those seen at slit 2 give $P_2'$. Together they follow the bullets' rule:

$$P_{12}' = P_1' + P_2'$$

The fringes are gone. Switch the light off and they come back. Electrons that are watched land differently from electrons that are not.

### Gentler light
Seeing an electron means scattering at least one photon off it, and a photon carries momentum $p = h/\\lambda$. So try to be gentle. There are two ways.

- **Dim the light.** Dimming does not make each photon weaker; it makes photons rarer (light comes in lumps, [[photons-as-particles]]). Some electrons now slip past unseen. The ones that were seen land like bullets; the ones that were missed land with fringes. The pattern is a blend whose fringes grow as the light dims — but no electron is ever "half seen".
- **Use longer waves.** Each photon then kicks more softly. But a flash made with light of wavelength $\\lambda$ is a blur roughly $\\lambda/2$ across, however good the microscope. Once the blur is wider than the distance $d$ between the slits, the flash can no longer say which slit — and just then the fringes return.

No setting shows the path and keeps the fringes.

### The numbers
A photon of wavelength $\\lambda_L$ can give the electron a sideways kick of up to about $h/\\lambda_L$. The electron's own momentum is $p_e = h/\\lambda_e$, so it is deflected by an angle up to about $\\lambda_e/\\lambda_L$. The fringes are $\\lambda_e/d$ apart in angle. The ratio of the two,

$$\\frac{\\lambda_e/\\lambda_L}{\\lambda_e/d} = \\frac{d}{\\lambda_L},$$

says by how many fringe spacings one photon can shift the pattern — and the electron's wavelength has dropped out. Light that resolves the slits has $\\lambda_L$ below about $2d$, so the random shifts spread over a whole fringe spacing or more: the [[?phase]] of the interference is scrambled and the stripes blur into a smooth heap.

| Light, slits 1 µm apart | Blur of each flash | Can it tell the slit? | Shift of the fringes, up to | Contrast left (model) |
|---|---|---|---|---|
| 300 nm ultraviolet | 0.15 µm | clearly | 3.3 spacings | 4 % |
| 600 nm orange | 0.3 µm | yes | 1.7 spacings | 8 %, shifted |
| 3 µm infrared | 1.5 µm | no | 0.33 spacing | 41 % |
| 10 µm infrared | 5 µm | no | 0.1 spacing | 94 % |

The last column assumes the photon scatters equally in all directions; the contrast is then $\\sin x/x$ with $x = 2\\pi d/\\lambda_L$ (a [[?sine-cosine|sine]] divided by its argument). In the simulation, watch the photon arrows: each one's up-and-down kick shifts that electron's fringes, and many random shifts wash them out.

### Information, not clumsiness
It is tempting to blame a clumsy photon. Feynman put the rule more sharply, as a first principle: when an experiment is able to tell which alternative happened, the [[?probability|probabilities]] add; when nothing can tell, the [[?amplitude|amplitudes]] add. "Able to" means in principle. The photon need not be caught, and nobody need read the result: a scattered photon heading off into the walls already carries the which-slit information, and the fringes are gone. The simulation shows the other side of the coin: keep only the electrons whose photon happened to leave with no up-and-down kick, and even with short-wavelength light the fringes come back for that selection.

> [!key] Whenever anything in the world records which slit an electron used — a photon, a recoiling wall, a flipped spin — the probabilities add and the fringes vanish, whether or not anyone looks at the record. What erases interference is information, not a conscious observer.

The next page, [[uncertainty-feyn]], shows why no cleverer gadget can beat this.
`,
  ideas: [
    'An electron that is watched is always found at one slit, whole — never at both.',
    'Watched electrons land like bullets: P₁₂ = P₁ + P₂, no fringes.',
    'Dimmer light sees fewer electrons; the unseen ones still interfere, so the pattern is a blend.',
    'Longer waves kick more gently but blur the flash; once λ is longer than about twice the slit spacing the path cannot be told, and the fringes return.',
    'What destroys interference is the existence of which-path information anywhere, not a person looking at it.'
  ],
  pitfalls: [
    'Watching only works on some electrons, which then split — Every electron that scatters a photon is seen at one slit, whole; dimming the light only changes how many are seen.',
    'The fringes vanish because someone reads the detector — The record only has to exist: a photon scattered off into the walls is enough, and nobody need ever catch it.',
    'A cleverer light could see the slit without disturbing the fringes — Any light that resolves slits d apart has a wavelength below about 2d, and its kick then shifts the fringes by a whole spacing or more.'
  ],
  formulas: [
    {
      name: 'Momentum of one watching photon',
      expr: 'p = h/lambda', tex: 'p = \\dfrac{h}{\\lambda}',
      vars: {
        p: { name: 'momentum of the photon', q: 'momentum', unit: 'kg·m/s' },
        h: { const: 'h' },
        lambda: { name: 'wavelength of the light', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' }
      },
      note: 'The largest sideways kick a scattered photon can give is of this order.',
      stories: { p: 'Green light of wavelength {lambda} is used to watch the electrons. What momentum does each photon carry?', lambda: 'What wavelength of light carries a momentum of {p} per photon?' }
    },
    {
      name: 'Deflection of the electron by one photon',
      expr: 'alpha = lambdae/lambdaL', tex: '\\alpha = \\dfrac{\\lambda_e}{\\lambda_L}',
      vars: {
        alpha: { name: 'largest deflection of the electron', q: 'angle', unit: 'mrad', tex: '\\alpha' },
        lambdae: { name: 'wavelength of the electron', q: 'length', unit: 'pm', value: 173, tex: '\\lambda_e' },
        lambdaL: { name: 'wavelength of the light', q: 'length', unit: 'nm', value: 500, tex: '\\lambda_L' }
      },
      note: 'The kick h/λ_L divided by the electron\'s momentum h/λ_e. Compare with the fringe spacing in angle, λ_e/d.',
      stories: { alpha: 'A 50 eV electron (wavelength {lambdae}) scatters a photon of {lambdaL}. By up to what angle can it be deflected?' }
    },
    {
      name: 'Fringe contrast left when every electron scatters one photon',
      expr: 'V = sin(2*pi*d/lambda)/(2*pi*d/lambda)', tex: 'V = \\dfrac{\\sin(2\\pi d/\\lambda_L)}{2\\pi d/\\lambda_L}',
      vars: {
        V: { name: 'contrast of the fringes (1 = full, 0 = none, negative = shifted)', signed: true, tex: 'V' },
        d: { name: 'distance between the slits', q: 'length', unit: 'µm', value: 1 },
        lambda: { name: 'wavelength of the light', q: 'length', unit: 'µm', value: 3, tex: '\\lambda_L' }
      },
      note: 'A simple model: the photon comes in at right angles to the line joining the slits and scatters equally in all directions. Contrast = (brightest − darkest)/(brightest + darkest).',
      stories: { V: 'Slits {d} apart are watched with light of {lambda}. What contrast is left in the fringes?', lambda: 'Slits are {d} apart. What wavelength of watching light leaves a fringe contrast of {V}?' }
    }
  ],
  examples: [
    {
      title: 'How hard does one photon hit?',
      q: 'Electrons of 50 eV (wavelength 0.173 nm) pass two slits 1 µm apart and are watched with green light of 500 nm. Compare the deflection one photon can cause with the angle between the fringes.',
      steps: [
        'Photon momentum: $p_L = h/\\lambda_L = 6.63\\times10^{-34}/5\\times10^{-7} = 1.33\\times10^{-27}$ kg·m/s.',
        'Electron momentum: $p_e = h/\\lambda_e = 6.63\\times10^{-34}/1.73\\times10^{-10} = 3.83\\times10^{-24}$ kg·m/s.',
        'Largest deflection: $p_L/p_e = 3.5\\times10^{-4}$ rad. Angle between fringes: $\\lambda_e/d = 1.73\\times10^{-10}/10^{-6} = 1.7\\times10^{-4}$ rad.',
        'The kick can shift an electron\'s fringes by up to $d/\\lambda_L = 2$ spacings — random from electron to electron, so the stripes are washed out.'
      ],
      a: 'A deflection of up to 0.35 mrad against fringes 0.17 mrad apart: the pattern is smeared over two spacings.'
    },
    {
      title: 'Light gentle enough to keep the fringes',
      q: 'The slits are 1 µm apart. What wavelength of watching light keeps 90 % of the fringe contrast, and can it still tell the slits apart?',
      steps: [
        'We need $\\sin x/x = 0.9$. Trying values: $x = 0.78$ gives 0.902, $x = 0.79$ gives 0.899, so $x \\approx 0.787$.',
        '$\\lambda_L = 2\\pi d/x = 2\\pi \\times 1\\ \\mu\\mathrm{m}/0.787 \\approx 8\\ \\mu$m (far infrared).',
        'The flash is then a blur about $\\lambda_L/2 = 4\\ \\mu$m wide, four times the distance between the slits: it cannot say which slit.'
      ],
      a: 'About 8 µm — and at that wavelength the flash is far too blurred to show the path.'
    }
  ],
  quiz: [
    { q: 'The light is bright enough to see every electron, and both slits are open. The pattern on the screen is…', choices: ['P₁ + P₂, with no fringes', 'the usual fringes', 'fringes twice as sharp', 'nothing: watched electrons are stopped'], a: 0, why: 'Each electron is seen at one slit and lands with that slit\'s one-slit heap; the heaps add like bullets.' },
    { q: 'You dim the light so that only half the electrons scatter a photon. The fringes…', choices: ['partly return: the unseen electrons interfere, the seen ones do not', 'stay completely gone', 'come back fully', 'shift sideways by half a spacing'], a: 0, why: 'Dimming makes photons rarer, not weaker. The pattern is a blend of seen (no fringes) and unseen (fringes) electrons.' },
    { q: 'The fringes disappear only if a person actually looks at the flashes.', a: false, why: 'It is enough that the which-slit information exists somewhere — in a scattered photon flying off into the walls, say.' },
    { q: 'Using light of longer wavelength brings the fringes back because…', choices: ['each photon kicks less, and the flash becomes too blurred to tell the slits apart', 'long waves pass straight through electrons', 'the electrons slow down', 'fewer photons are emitted'], a: 0, why: 'Both happen at once, and at the same wavelength (about twice the slit spacing): the gentler kick and the loss of which-slit information go together.' },
    { q: 'Slits 0.5 µm apart are watched with 250 nm light. By up to how many fringe spacings can one photon\'s kick shift an electron\'s fringes?', answer: 2, why: 'The shift in spacings is d/λ_L = 0.5/0.25 = 2, whatever the electron\'s wavelength.' }
  ],
  problems: [
    { q: 'What momentum does a photon of violet light, 400 nm, carry?', answer: 1.66e-27, unit: 'kg·m/s', tol: 0.02, hint: 'p = h/λ.',
      steps: ['$p = h/\\lambda = 6.626\\times10^{-34}/4.00\\times10^{-7} = 1.66\\times10^{-27}$ kg·m/s.'] },
    { q: 'An electron of 100 eV has a wavelength of 0.1226 nm. It scatters a photon of 600 nm. What is the largest angle by which it can be deflected, in milliradians?', answer: 0.204, unit: 'mrad', tol: 0.03, hint: 'The angle is λ_e/λ_L.',
      steps: ['$\\alpha = \\lambda_e/\\lambda_L = 0.1226\\times10^{-9}/600\\times10^{-9} = 2.04\\times10^{-4}$ rad = 0.204 mrad.'] }
  ],
  applications: [
    'Atom and molecule interferometers lose their fringes when the particles scatter even one stray photon or gas molecule — a practical limit on their precision.',
    'Decoherence: the reason large objects never show interference is that air molecules, light and heat radiation constantly record where they are, just as the photon records the slit.',
    'Quantum key distribution rests on the same fact: an eavesdropper who gains information about the photons must disturb them, and the disturbance can be detected.',
    'Try the light in [the two-slit lab](#/tools/slits), one electron at a time.'
  ],
  history: 'Heisenberg analysed seeing an electron with a gamma-ray microscope in 1927, and in the same year, as Niels Bohr later recalled, Einstein proposed detecting the path through the recoil of the slitted screen — to which Bohr replied that the screen\'s own uncertain position would wash out the fringes. In his lectures of 1961–63 Feynman treated the watched two-slit experiment as a thought experiment. It has since been done in several forms; in 1995 David Pritchard\'s group at MIT let sodium atoms in an atom interferometer scatter single photons, saw the fringe contrast fall as the two paths moved apart by more than about half a wavelength of the light, and recovered part of it by counting only atoms whose photons had gone in a narrow range of directions.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 1 (Quantum Behavior), section 6 "Watching the electrons" and section 7 "First principles of quantum mechanics": the light behind the slits, dimming it, changing its wavelength, and the rule that distinguishable alternatives add probabilities.',
    'Vol. I, ch. 37 (Quantum Behavior) — the same lecture in its first form.',
    'Vol. III, ch. 3 (Probability Amplitudes) — the watched two-slit experiment worked out with amplitudes for the scattered photon.',
    '*The Character of Physical Law*, lecture 6, "Probability and Uncertainty — the Quantum Mechanical View of Nature" — watching which hole the electron goes through, told for a general audience.'
  ],
  sim: 'qb-watch'
},

{
  id: 'uncertainty-feyn', parent: 'two-slits', title: 'The uncertainty principle', level: 2,
  short: 'No state and no apparatus can pin down both where a particle is and how it is moving: the spreads obey Δx·Δp ≥ ħ/2. Squeeze a beam through a narrower slit and its momenta fan out wider. The principle keeps the two-slit experiment consistent, and it sets the size of atoms.',
  keywords: ['Heisenberg', 'uncertainty relation', 'Δx Δp', 'hbar', 'wave packet', 'Fourier', 'diffraction', 'single slit', 'size of an atom', 'Bohr radius', 'zero-point energy', 'energy–time', 'natural line width', 'Kennard'],
  prereq: ['watching-electrons', 'bullets-waves-electrons', 'math:normal-distribution'],
  related: ['wave-and-particle', 'quantum-reality', 'hydrogen-and-periodic-table', 'diffraction-feyn', 'physics:uncertainty-principle', 'math:fourier-series'],
  body: `
In 1927 Werner Heisenberg found a limit built into quantum mechanics. If a particle's position along a line is uncertain by $\\Delta x$ and its momentum along the same line by $\\Delta p$, then

$$\\Delta x\\,\\Delta p \\ge \\frac{\\hbar}{2}$$

Here $\\hbar = h/2\\pi = 1.055\\times10^{-34}$ J·s ([[?hbar]]) and each $\\Delta$ is a [[?standard-deviation]]: prepare the particle the same way many times, measure, and $\\Delta x$ is the typical scatter of the results about their mean. The rule applies to every state and every apparatus. Feynman presented it as the guard that keeps the two-slit experiment consistent: a gadget that told which slit an electron used without spoiling the fringes would break the whole scheme — and none can.

### The wall on rollers
His example, retold: mount the wall with the slits on rollers so that it can recoil. An electron bound for a given point on the screen is deflected differently through slit 1 than through slit 2, so it pushes the wall differently. Measure the recoil and you know the slit. But to notice that small difference, the wall's momentum must be known beforehand more precisely than the difference itself — and then, by the rule, the wall's position is uncertain by about a fringe spacing. The slits wobble, the fringes smear, and we are back to the light of [[watching-electrons]].

### A slit makes momenta spread
Send a beam of electrons, all with momentum $p$ along $x$, at a single slit of width $B$. Just behind it, the electron's $y$ is known to within $B$. But the wave diffracts: the first dark direction is at $\\sin\\theta = \\lambda/B$, so the sideways momentum $p_y = p\\sin\\theta$ is spread over about

$$p_y \\approx p\\,\\frac{\\lambda}{B} = \\frac{h}{B}$$

using $\\lambda = h/p$. Position spread times momentum spread is about $h$, whatever the slit. Narrow the slit and the fan of momenta opens wider — watch it in the first simulation. The electron's energy drops out as well: faster electrons fan out through smaller angles, but with the same spread of sideways momentum.

### Short needs broad
Why exactly $\\hbar/2$? The momentum distribution is the [[?fourier|Fourier]] content of the wave. A packet of width $\\Delta x$ is built by adding waves $e^{ikx}$ with a spread of wave numbers $\\Delta k$, and a short packet needs a broad spread: $\\Delta x\\,\\Delta k \\ge 1/2$. With $p = \\hbar k$ this is Heisenberg's rule. A [[?gaussian]] packet reaches the limit exactly; every other shape — flat-topped, two humps, chirped — lies above it (second simulation). The same mathematics limits radio and laser pulses: a pulse lasting $\\Delta t$ contains a band of frequencies at least about $1/(4\\pi\\Delta t)$ wide.

### How big is an atom?
Feynman's favourite use of the rule: an electron held within a distance $r$ of the nucleus has a momentum of about $\\hbar/r$, and so a kinetic energy of about $\\hbar^2/2mr^2$. Pulling it closer lowers its electric energy but raises this confinement energy, and the total is lowest at

$$a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{me^2} = 0.0529\\ \\mathrm{nm},\\qquad E = -13.6\\ \\mathrm{eV}$$

— the actual size and binding energy of hydrogen (see the derivation). Without the uncertainty principle nothing would stop the electron falling into the nucleus.

### Energy and time
A state that lasts only a time $\\tau$ has an energy spread of about $\\hbar/\\tau$: its spectral line has a natural width $\\Delta f = 1/2\\pi\\tau$. The yellow sodium light comes from a state living 16 ns, so the line is about 10 MHz wide.

| Confined object | $\\Delta x$ | Smallest speed spread $\\hbar/2m\\Delta x$ |
|---|---|---|
| electron in an atom | 0.1 nm | 580 km/s |
| electron in a 10 nm quantum dot | 10 nm | 5.8 km/s |
| proton in a nucleus | 5 fm | 6300 km/s |
| dust grain of 1 µg | 1 µm | $5\\times10^{-20}$ m/s |

> [!warn] The principle is not only about clumsy instruments disturbing a particle that "really" has an exact position and momentum. A state with a sharp position *is* a [[?superposition]] of all momenta. There is no hidden exact pair of values for the apparatus to spoil.
`,
  ideas: [
    'Δx·Δp ≥ ħ/2 for every state, with Δx and Δp the standard deviations of many repeated measurements.',
    'A slit of width B spreads the sideways momentum over about h/B, whatever the particle\'s energy.',
    'Momentum is the Fourier content of the wave: a short packet needs a wide band of wavelengths; a Gaussian packet reaches the limit exactly.',
    'Confinement costs kinetic energy ~ħ²/2mr²; balancing it against the electric attraction gives the size of the atom, 0.053 nm.',
    'A state living a time τ has an energy spread ~ħ/τ: the natural width of spectral lines.'
  ],
  pitfalls: [
    'The principle only says that measuring disturbs — It says more: no state has both a sharp position and a sharp momentum. A sharply located state is a superposition of all momenta.',
    'Δx·Δp is always exactly ħ/2 — That is the minimum, reached only by Gaussian packets; every other state has a larger product.',
    'Uncertainty matters for everyday objects if you look closely enough — For a 1 µg grain located to 1 µm the speed spread is 5×10⁻²⁰ m/s, far below anything measurable.'
  ],
  derivation: {
    title: 'The size of the hydrogen atom from the uncertainty principle',
    steps: [
      { text: 'Confine the electron within a distance r of the proton. Its momentum is then at least about ħ/r (we drop factors of order one).', tex: 'p \\approx \\frac{\\hbar}{r}' },
      { text: 'Its kinetic energy p²/2m therefore grows as the electron is squeezed closer:', tex: 'E_{\\mathrm{kin}} \\approx \\frac{\\hbar^2}{2mr^2}' },
      { text: 'The electric attraction lowers the energy by e²/4πε₀r — more, the closer it is. Add the two:', tex: 'E(r) \\approx \\frac{\\hbar^2}{2mr^2} - \\frac{e^2}{4\\pi\\varepsilon_0 r}' },
      { text: 'Nature settles where the total is lowest. At the minimum the derivative dE/dr is zero:', tex: '\\frac{dE}{dr} = -\\frac{\\hbar^2}{mr^3} + \\frac{e^2}{4\\pi\\varepsilon_0 r^2} = 0' },
      { text: 'Multiply through by r³ and solve for r — this is the Bohr radius:', tex: 'a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{me^2} = 5.29\\times10^{-11}\\ \\mathrm{m}' },
      { text: 'Put r = a₀ back into E(r). The kinetic term is half the size of the electric one, so E is minus half the electric energy:', tex: 'E = -\\frac{me^4}{2(4\\pi\\varepsilon_0)^2\\hbar^2} = -13.6\\ \\mathrm{eV}' },
      { text: 'Both numbers are exactly those of the full theory — partly luck in the rough factors, but the reasoning is sound: squeezing the electron closer costs more kinetic energy than it gains in electric energy, so atoms have a size.' }
    ]
  },
  formulas: [
    {
      name: 'The uncertainty limit, at its minimum',
      expr: 'dp = hbar/(2*dx)', tex: '\\Delta p = \\dfrac{\\hbar}{2\\,\\Delta x}',
      vars: {
        dp: { name: 'smallest possible momentum spread', q: 'momentum', unit: 'kg·m/s', tex: '\\Delta p' },
        hbar: { const: 'hbar' },
        dx: { name: 'position spread', q: 'length', unit: 'nm', value: 0.1, tex: '\\Delta x' }
      },
      note: 'Equality holds for a Gaussian packet; every other state has a larger product. Δx and Δp are standard deviations.',
      stories: { dp: 'An electron is confined to within {dx}. What is the least possible spread of its momentum?', dx: 'A particle\'s momentum is known to within {dp}. How well can its position be known at best?' }
    },
    {
      name: 'Sideways momentum behind a slit',
      expr: 'py = h/B', tex: 'p_y = \\dfrac{h}{B}',
      vars: {
        py: { name: 'sideways momentum at the first dark direction', q: 'momentum', unit: 'kg·m/s', tex: 'p_y' },
        h: { const: 'h' },
        B: { name: 'width of the slit', q: 'length', unit: 'µm', value: 1 }
      },
      note: 'From sin θ = λ/B and λ = h/p. It does not depend on the particle\'s energy: position spread × momentum spread ≈ h.',
      stories: { py: 'A beam passes a slit {B} wide. How much sideways momentum does it pick up, out to the first dark direction?', B: 'How narrow must a slit be to spread the sideways momentum out to {py}?' }
    },
    {
      name: 'The size of an atom',
      expr: 'a = 4*pi*eps0*hbar^2/(m*qe^2)', tex: 'a = \\dfrac{4\\pi\\varepsilon_0\\hbar^2}{m e^2}',
      vars: {
        a: { name: 'radius of the atom (Bohr radius)', q: 'length', unit: 'pm' },
        eps0: { const: 'eps0', tex: '\\varepsilon_0' },
        hbar: { const: 'hbar' },
        m: { name: 'mass of the orbiting particle', q: 'mass', unit: 'MeV/c²', value: 0.511 },
        qe: { const: 'qe', tex: 'e' }
      },
      note: 'For hydrogen, 52.9 pm. A heavier orbiting particle makes a smaller atom (strictly, use the reduced mass).',
      stories: { a: 'A particle of mass {m} and charge −e orbits a proton. Roughly how big is the atom?', m: 'What mass would an orbiting particle need for an atom only {a} across?' }
    },
    {
      name: 'Natural width of a spectral line',
      expr: 'df = 1/(2*pi*tau)', tex: '\\Delta f = \\dfrac{1}{2\\pi\\tau}',
      vars: {
        df: { name: 'width of the line (full width at half maximum)', q: 'frequency', unit: 'MHz', tex: '\\Delta f' },
        tau: { name: 'lifetime of the excited state', q: 'time', unit: 'ns', value: 16, tex: '\\tau' }
      },
      note: 'The energy–time form of the uncertainty principle: ΔE ≈ ħ/τ, so Δf = ΔE/h = 1/2πτ.',
      stories: { df: 'An excited state lives {tau}. How wide in frequency is the light it emits?', tau: 'A spectral line is {df} wide. How long does the excited state live?' }
    }
  ],
  examples: [
    {
      title: 'An electron in an atom',
      q: 'An electron is confined to a region 0.1 nm across. What is the least spread of its momentum and of its speed?',
      steps: [
        '$\\Delta p = \\hbar/2\\Delta x = 1.055\\times10^{-34}/(2\\times10^{-10}) = 5.3\\times10^{-25}$ kg·m/s.',
        '$\\Delta v = \\Delta p/m = 5.3\\times10^{-25}/9.11\\times10^{-31} = 5.8\\times10^{5}$ m/s.',
        'That is a quarter of the actual speed of the electron in hydrogen (2.2×10⁶ m/s): being confined to an atom forces an electron to move fast.'
      ],
      a: '5.3×10⁻²⁵ kg·m/s, or about 580 km/s.'
    },
    {
      title: 'Electrons through a slit',
      q: 'Electrons of 50 eV (λ = 0.173 nm, p = 3.83×10⁻²⁴ kg·m/s) pass a slit 1 µm wide. Find the first dark direction, the sideways momentum there, and the product with the slit width.',
      steps: [
        '$\\sin\\theta = \\lambda/B = 0.173\\times10^{-9}/10^{-6} = 1.73\\times10^{-4}$, so $\\theta = 0.173$ mrad; on a screen 1 m away, 0.17 mm from the centre.',
        '$p_y = p\\sin\\theta = 3.83\\times10^{-24}\\times1.73\\times10^{-4} = 6.63\\times10^{-28}$ kg·m/s, which is $h/B$.',
        '$B\\,p_y = 10^{-6}\\times6.63\\times10^{-28} = 6.63\\times10^{-34}$ J·s $= h$.'
      ],
      a: '0.17 mrad; 6.6×10⁻²⁸ kg·m/s; the product is h, for any slit.'
    },
    {
      title: 'The width of the sodium line',
      q: 'The excited state that emits yellow sodium light (509 THz) lives 16 ns. How wide is the line?',
      steps: [
        '$\\Delta f = 1/2\\pi\\tau = 1/(2\\pi\\times16\\times10^{-9}) = 9.9\\times10^{6}$ Hz.',
        'Relative to the frequency: $9.9\\times10^6/5.09\\times10^{14} = 2\\times10^{-8}$ — a very sharp line, which is why atoms make good clocks.'
      ],
      a: 'About 10 MHz, two parts in a hundred million of the frequency.'
    }
  ],
  quiz: [
    { q: 'You make the slit narrower. The central spot on a distant screen…', choices: ['gets wider', 'gets narrower', 'stays the same', 'splits into two'], a: 0, why: 'Knowing y better (smaller B) spreads the sideways momentum more, h/B: the pattern widens.' },
    { q: 'For which shape of wave packet is Δx·Δp smallest?', choices: ['a Gaussian', 'a flat-topped box with sharp edges', 'two separated humps', 'a chirped Gaussian'], a: 0, why: 'The Gaussian reaches ħ/2 exactly; sharp edges, two humps or a chirp all need extra momentum components.' },
    { q: 'The uncertainty principle only says that our instruments disturb what they measure.', a: false, why: 'It is a property of the states themselves: no state has both a sharp position and a sharp momentum.' },
    { q: 'If electrons were four times heavier (same charge), atoms would be…', choices: ['four times smaller', 'four times bigger', 'sixteen times smaller', 'the same size'], a: 0, why: 'a₀ = 4πε₀ħ²/me² is inversely proportional to the mass: a heavier particle needs less room for the same confinement energy.' },
    { q: 'A proton is confined within 5 fm, the size of a nucleus. What is the least spread of its momentum, in kg·m/s?', answer: 1.05e-20, unit: 'kg·m/s', why: 'Δp = ħ/2Δx = 1.055×10⁻³⁴/(2×5×10⁻¹⁵) = 1.05×10⁻²⁰ kg·m/s — a speed spread of 6300 km/s.' }
  ],
  problems: [
    { q: 'A marble of 1 g is located to within 1 µm. What is the least possible spread of its speed?', answer: 5.27e-26, unit: 'm/s', tol: 0.02, hint: 'Δv = ħ/(2mΔx).',
      steps: ['$\\Delta v = \\hbar/(2m\\Delta x) = 1.055\\times10^{-34}/(2\\times10^{-3}\\times10^{-6}) = 5.3\\times10^{-26}$ m/s.', 'At that speed the marble would take far longer than the age of the universe to move one atom\'s width.'] },
    { q: 'In muonic hydrogen a muon (105.7 MeV/c²) replaces the electron (0.511 MeV/c²). Ignoring the reduced mass, how big is the atom, in femtometres?', answer: 256, unit: 'fm', tol: 0.02, hint: 'The radius is inversely proportional to the mass.',
      steps: ['$a = a_0 \\times m_e/m_\\mu = 52.9\\ \\mathrm{pm}\\times0.511/105.7 = 0.256$ pm = 256 fm.', 'With the reduced mass (186 electron masses) it is 285 fm — so small that the muon spends measurable time inside the proton.'] },
    { q: 'An excited state lives 3.2 ns. What is the natural width of the line it emits, in MHz?', answer: 49.7, unit: 'MHz', tol: 0.02, hint: 'Δf = 1/2πτ.',
      steps: ['$\\Delta f = 1/(2\\pi\\times3.2\\times10^{-9}) = 4.97\\times10^{7}$ Hz = 49.7 MHz.'] }
  ],
  applications: [
    'Microscopes of every kind: focusing a beam into a spot of width Δx needs a cone of directions wide enough to supply sideways momentum of order ħ/Δx — the diffraction limit.',
    'Helium stays liquid down to absolute zero at ordinary pressure: locked into a crystal, its light atoms would carry too much confinement (zero-point) energy.',
    'Ultrashort laser pulses: a pulse of 10 femtoseconds necessarily contains a band of colours tens of terahertz wide.',
    'Atomic clocks: the longer the atoms are left undisturbed, the narrower the resonance they can resolve.'
  ],
  history: 'Werner Heisenberg published the uncertainty relation in 1927, arguing from a thought experiment with a gamma-ray microscope. Earle Kennard proved the exact form Δx Δp ≥ ħ/2 for standard deviations later the same year, and Howard Robertson extended it to any pair of quantities in 1929. Feynman\'s recoiling wall echoes a proposal Einstein made in his debates with Niels Bohr in 1927, which Bohr answered with the same kind of argument.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 1 (Quantum Behavior), section 8 "The uncertainty principle" — the wall on rollers that would reveal which slit.',
    'Vol. III, ch. 2 (The Relation of Wave and Particle Viewpoints) — measuring position and momentum with a slit, crystal diffraction, and the size of an atom estimated from the uncertainty principle.',
    'Vol. I, ch. 6 (Probability) — ends with a first look at the uncertainty principle.',
    '*The Character of Physical Law*, lecture 6, "Probability and Uncertainty — the Quantum Mechanical View of Nature".'
  ],
  sim: ['qb-slit-spread', 'qb-packet']
},

{
  id: 'wave-and-particle', parent: 'two-slits', title: 'The wave and particle viewpoints', level: 2,
  short: 'A particle\'s amplitude is a wave with p = ħk and E = ħω. A wave of one wavelength is everywhere at once; adding waves of nearby wavelengths makes a packet that moves at the particle\'s speed and spreads — while every detection is a single click, drawn from |ψ|².',
  keywords: ['wave packet', 'group velocity', 'phase velocity', 'de Broglie', 'probability density', 'wave function', 'spreading', 'Bragg', 'crystal diffraction', 'Davisson–Germer', 'energy levels', 'complementarity', 'matter waves'],
  prereq: ['uncertainty-feyn', 'bullets-waves-electrons', 'beats-feyn'],
  related: ['probability-amplitudes', 'schrodinger-equation-feyn', 'electrons-in-crystals', 'physics:wave-particle-duality', 'physics:wavefunction', 'physics:de-broglie-wavelength'],
  body: `
The amplitude to find a particle at a place $x$ is a function of $x$, and for a particle of definite momentum it is the simplest wave there is. Feynman spent a lecture on how the wave picture and the particle picture fit together — and where each one stops working.

### One amplitude, two pictures
A particle of momentum $p$ and energy $E$ has the amplitude

$$\\psi(x,t) = e^{i(kx-\\omega t)},\\qquad p = \\hbar k,\\qquad E = \\hbar\\omega$$

At every place it is a [[?rotating-arrow|rotating arrow]] of the same length, turning at the frequency $\\omega$ and advancing one full turn per wavelength $\\lambda = 2\\pi/k = h/p$ along $x$. Because $|\\psi|^2$ is the same everywhere, such a particle is equally likely to be anywhere — the extreme of the uncertainty principle, with $\\Delta p = 0$ and $\\Delta x$ infinite.

### A particle made of waves
To say that a particle is "about here", add waves of slightly different wave numbers — a [[?superposition]]. Like two notes beating ([[beats-feyn]]), they reinforce in one region and cancel elsewhere: a **wave packet**. Its [[?absolute-square|absolute square]] is a [[?probability-density]]: the chance of finding the particle between $x$ and $x + dx$ is $|\\psi(x)|^2dx$. A detector never registers a spread-out cloud, though. It clicks once, at one place; only the clicks of many repeats pile up into the shape of $|\\psi|^2$.

### Two speeds
The crests move at the phase velocity $\\omega/k$; the packet as a whole moves at the group velocity $d\\omega/dk$, the [[?derivative]] of the frequency with respect to the wave number. For a free particle $\\hbar\\omega = E = \\hbar^2k^2/2m$, so

$$v_g = \\frac{d\\omega}{dk} = \\frac{\\hbar k}{m} = \\frac{p}{m},\\qquad v_p = \\frac{\\omega}{k} = \\frac{v_g}{2}$$

The packet travels at exactly the particle's classical speed, while the crests drift backwards through it at half that speed. No experiment sees the crests — only $|\\psi|^2$ — so the odd phase velocity does no harm. In the simulation a triangle rides one crest and a dot rides the packet: watch the crest fall behind.

### Spreading
A packet of width $\\sigma_0$ carries a spread of momenta $\\hbar/2\\sigma_0$, so its faster parts pull ahead and it widens:

$$\\sigma(t) = \\sigma_0\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma_0^2}\\right)^2}$$

An electron localised to 0.1 nm widens by 40 % in $1.7\\times10^{-16}$ s; a marble of 1 g localised to 1 µm would need $6\\times10^{11}$ years. Remarkably, a cloud of *classical* particles given the same spread of starting points and speeds widens at exactly the same rate — the simulation runs both side by side.

### Where the pictures part
The cloud and the packet agree until two parts of the wave overlap. When the packet reflects from a wall and runs back through itself, the wave shows fringes half a wavelength apart — $|e^{ikx} + e^{-ikx}|^2 = 4\\cos^2 kx$ — with places where the particle is never found; the classical cloud stays smooth. The same happens when waves scatter from the regular planes of atoms in a crystal: they add where $2d\\sin\\theta = n\\lambda$ (Bragg's condition), which is how electrons and neutrons are diffracted. And a wave confined to a box can only form standing waves with certain energies — the origin of energy levels ([[schrodinger-equation-feyn]]).

| | Particle picture | Wave picture |
|---|---|---|
| What a detector registers | one click, at one place | — |
| Where it will be found | — | with probability density $\\lvert\\psi\\rvert^2$ |
| Momentum | $p = mv$ | $p = \\hbar k = h/\\lambda$ |
| Energy | $E$ | $E = \\hbar\\omega = hf$ |
| Speed | $v = p/m$ | group velocity $d\\omega/dk$ |
| Two ways that cannot be told apart | — | amplitudes add and interfere |

> [!key] The wave tells where the particle is likely to be found; the particle is what is found. Neither picture alone is the whole story, but the amplitude rule contains both — Niels Bohr called this complementarity.
`,
  ideas: [
    'A particle of definite momentum has the amplitude e^{i(kx − ωt)} with p = ħk and E = ħω: the same everywhere, so its position is completely unknown.',
    'Adding waves of nearby wave numbers makes a packet; |ψ|² is the probability density of finding the particle.',
    'The packet moves at the group velocity dω/dk = p/m, the classical speed; the crests move at half of it.',
    'A packet spreads at the same rate as a classical cloud with the same spreads of position and momentum.',
    'The pictures differ where parts of the wave overlap: interference fringes, crystal diffraction and energy levels are purely wave effects.'
  ],
  pitfalls: [
    'The particle is smeared out over the whole packet — Every detection finds it whole, at one place; |ψ|² gives the probability of each place.',
    'The crests show how fast the particle moves — The crests move at the phase velocity, half the particle\'s speed; the packet (group velocity) carries the particle.',
    'Spreading is a strange quantum effect with no classical counterpart — A classical cloud with the same spreads of position and velocity spreads identically; what is quantum is that no state can have smaller spreads.'
  ],
  formulas: [
    {
      name: 'Speed of a packet (group velocity)',
      expr: 'v = hbar*k/m', tex: 'v_g = \\dfrac{\\hbar k}{m}',
      vars: {
        v: { name: 'speed of the packet', q: 'speed', unit: 'm/s', tex: 'v_g' },
        hbar: { const: 'hbar' },
        k: { name: 'wave number (2π/λ)', q: 'wavenumber', unit: '1/nm', value: 36.3 },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' }
      },
      note: 'Non-relativistic. The crests move at half this speed.',
      stories: { v: 'An electron wave packet has wave number {k}. How fast does the packet move?', k: 'An electron moves at {v}. What is the wave number of its amplitude?' }
    },
    {
      name: 'Spreading of a free Gaussian packet',
      expr: 'sigma = sigma0*sqrt(1 + (hbar*t/(2*m*sigma0^2))^2)', tex: '\\sigma = \\sigma_0\\sqrt{1 + \\left(\\dfrac{\\hbar t}{2m\\sigma_0^2}\\right)^2}',
      vars: {
        sigma: { name: 'width of the packet at time t', q: 'length', unit: 'nm', tex: '\\sigma' },
        sigma0: { name: 'starting width', q: 'length', unit: 'nm', value: 0.1, tex: '\\sigma_0' },
        hbar: { const: 'hbar' },
        t: { name: 'time', q: 'time', unit: 'ps', value: 0.001 },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' }
      },
      note: 'Widths are standard deviations of |ψ|². A narrower start spreads faster; the same holds for a classical cloud with the same spreads.',
      stories: { sigma: 'An electron is localised to {sigma0}. How wide is its packet after {t}?', t: 'How long does an electron packet starting {sigma0} wide take to reach {sigma}?' }
    },
    {
      name: 'Bragg\'s condition for waves reflected by crystal planes',
      expr: '2*d*sin(theta) = n*lambda', tex: '2d\\sin\\theta = n\\lambda',
      vars: {
        d: { name: 'spacing of the atomic planes', q: 'length', unit: 'nm', value: 0.2 },
        theta: { name: 'glancing angle to the planes', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        n: { name: 'order', int: true, value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 0.1, tex: '\\lambda' }
      },
      solveFor: 'theta',
      note: 'Waves reflected from successive planes add when their extra path 2d sin θ is a whole number of wavelengths — for X-rays, electrons and neutrons alike.',
      stories: { theta: 'Waves of {lambda} fall on crystal planes {d} apart. At what glancing angle is the order-{n} reflection?', lambda: 'A reflection of order {n} appears at {theta} from planes {d} apart. What is the wavelength?' }
    }
  ],
  examples: [
    {
      title: 'Two speeds of a 50 eV electron',
      q: 'An electron of 50 eV has a wavelength of 0.173 nm. Find its wave number, the speed of its packet and the speed of its crests.',
      steps: [
        '$k = 2\\pi/\\lambda = 2\\pi/0.173\\ \\mathrm{nm} = 36.3\\ \\mathrm{nm^{-1}} = 3.63\\times10^{10}$ m⁻¹.',
        '$v_g = \\hbar k/m = 1.055\\times10^{-34}\\times3.63\\times10^{10}/9.11\\times10^{-31} = 4.2\\times10^{6}$ m/s — the same as $\\sqrt{2E/m}$.',
        '$v_p = v_g/2 = 2.1\\times10^{6}$ m/s.'
      ],
      a: 'k = 36.3 nm⁻¹; the packet moves at 4.2×10⁶ m/s, the crests at 2.1×10⁶ m/s.'
    },
    {
      title: 'How fast does a packet spread?',
      q: 'An electron starts as a packet 0.1 nm wide. How wide is it after 1 fs? How long would a 1 g marble localised to 1 µm take to spread by the same factor?',
      steps: [
        'The time scale is $\\tau = 2m\\sigma_0^2/\\hbar = 2\\times9.11\\times10^{-31}\\times10^{-20}/1.055\\times10^{-34} = 1.73\\times10^{-16}$ s.',
        'After 1 fs: $\\sigma = 0.1\\ \\mathrm{nm}\\times\\sqrt{1 + (10^{-15}/1.73\\times10^{-16})^2} = 0.1\\times5.9 = 0.59$ nm.',
        'For the marble $\\tau = 2\\times10^{-3}\\times10^{-12}/1.055\\times10^{-34} = 1.9\\times10^{19}$ s — about 600 billion years for the width to grow by 41 %, and far longer for a factor of 6.'
      ],
      a: 'The electron reaches 0.59 nm in a femtosecond; the marble would take longer than the age of the universe many times over.'
    },
    {
      title: 'Electrons reflected by a crystal',
      q: 'Electrons of 54 eV (λ = 0.167 nm) fall on atomic planes 0.2 nm apart. At what glancing angle is the first-order reflection?',
      steps: [
        '$\\sin\\theta = n\\lambda/2d = 0.167/0.4 = 0.417$.',
        '$\\theta = 24.7°$. Electrons of this energy were the ones Davisson and Germer used.'
      ],
      a: 'About 24.7°.'
    }
  ],
  quiz: [
    { q: 'A free electron\'s wave packet moves at…', choices: ['the group velocity dω/dk, equal to p/m', 'the phase velocity ω/k', 'the speed of light', 'half of p/m'], a: 0, why: 'The envelope moves at dω/dk = ħk/m = p/m, the classical speed; the crests move at half of it.' },
    { q: 'The crests inside a free electron\'s packet move…', choices: ['at half the packet\'s speed, drifting backwards through it', 'at twice the packet\'s speed', 'at the packet\'s speed', 'not at all'], a: 0, why: 'For ω = ħk²/2m the phase velocity ω/k is half the group velocity dω/dk.' },
    { q: 'A packet made narrower at the start will…', choices: ['spread faster', 'spread more slowly', 'not spread', 'move faster'], a: 0, why: 'A narrower packet has a wider spread of momenta, ħ/2σ₀, so its parts separate faster.' },
    { q: 'A cloud of classical particles with the same spread of starting positions and speeds spreads at the same rate as a free Gaussian wave packet.', a: true, why: 'For a free particle the widths obey the same law; the quantum part is that the spreads cannot both be small.' },
    { q: 'Where do the wave and particle pictures give different predictions?', choices: ['where two parts of the wave overlap and interfere', 'for the average position of the packet', 'for the speed of the packet', 'nowhere'], a: 0, why: 'Averages and widths agree; interference fringes, as when a packet meets its own reflection, have no classical counterpart.' }
  ],
  problems: [
    { q: 'Neutrons of wavelength 0.18 nm are reflected by crystal planes 0.31 nm apart. At what glancing angle is the first-order reflection, in degrees?', answer: 16.9, unit: '°', tol: 0.02, hint: 'sin θ = nλ/2d.',
      steps: ['$\\sin\\theta = 0.18/(2\\times0.31) = 0.290$.', '$\\theta = \\arcsin 0.290 = 16.9°$.'] },
    { q: 'An electron\'s amplitude has a wave number of 10 nm⁻¹. How fast does its packet move?', answer: 1.16e6, unit: 'm/s', tol: 0.02, hint: 'v = ħk/m.',
      steps: ['$v = \\hbar k/m = 1.055\\times10^{-34}\\times10^{10}/9.11\\times10^{-31} = 1.16\\times10^{6}$ m/s.'] }
  ],
  applications: [
    'Electron diffraction and electron microscopes use the short wavelength of fast electrons to image atoms; low-energy electron diffraction maps crystal surfaces.',
    'Neutron diffraction finds hydrogen atoms and magnetic order in materials that X-rays cannot see well.',
    'Matter-wave interferometers with atoms and even large molecules measure gravity, rotation and fundamental constants.',
    'Explore packets and stationary states in [the quantum wells tool](#/tools/wells).'
  ],
  history: 'Louis de Broglie proposed in 1924 that matter has a wavelength h/p. In 1926 Erwin Schrödinger wrote the wave equation and Max Born proposed that |ψ|² gives the probability of finding the particle. In 1927 Clinton Davisson and Lester Germer in New York, and George Paget Thomson in Aberdeen, diffracted electrons with crystals; Immanuel Estermann and Otto Stern diffracted helium atoms around 1930; and in 1999 Markus Arndt, Anton Zeilinger and colleagues in Vienna diffracted C₆₀ molecules of sixty carbon atoms.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 2 (The Relation of Wave and Particle Viewpoints) — probability wave amplitudes, measuring position and momentum, crystal diffraction, the size of an atom, energy levels.',
    'Vol. I, ch. 38 — the same lecture in its first form.',
    'Vol. I, ch. 48 (Beats) — adding waves of nearby frequencies, group velocity, and the probability amplitudes of particles.',
    'Vol. III, ch. 16 (The Dependence of Amplitudes on Position) — the amplitude as a function of position: the wave function and states of definite momentum.'
  ],
  sim: 'qb-wave-particle'
},

{
  id: 'probability-amplitudes', parent: 'amplitudes-topic', title: 'Probability amplitudes and their rules', level: 2,
  short: 'Quantum mechanics in a few rules: every way an event can happen has an amplitude, an arrow. For steps in succession, multiply the arrows; for ways that cannot be told apart, add them; at the end, the probability is the square of the length. Ways that could be told apart add probabilities instead.',
  keywords: ['probability amplitude', 'bra-ket', 'Dirac notation', 'complex number', 'add amplitudes', 'multiply amplitudes', 'distinguishable', 'interference', 'which-way marker', 'crystal scattering', 'spin flip', 'Bragg peaks', 'arrows'],
  prereq: ['bullets-waves-electrons', 'watching-electrons', 'math:complex-numbers'],
  related: ['identical-particles', 'arrow-rule', 'stern-gerlach-filters', 'amplitudes-in-time', 'path-integral', 'math:polar-form'],
  body: `
The two-slit experiment boils down to a handful of rules. Feynman stated them early in volume III, and everything that follows there — spin, atoms, chemistry, lasers — is these rules applied with care.

### The rules
| Rule | In symbols | With arrows |
|---|---|---|
| The probability of an event is the square of the size of its amplitude | $P = \\lvert\\phi\\rvert^2$ | square the length of the arrow |
| An event that can happen in several ways that cannot be told apart | $\\phi = \\phi_1 + \\phi_2$ | put the arrows head to tail |
| A way made of successive steps | $\\phi = \\langle x|1\\rangle\\langle 1|s\\rangle$ | multiply the lengths, add the angles |
| Ways that could be told apart, even in principle | $P = P_1 + P_2$ | square each arrow first, then add |

### Brackets
Dirac's shorthand $\\langle x|s\\rangle$ — a [[?bra-ket|bracket]] — means "the amplitude that a particle leaving $s$ arrives at $x$", read from right to left. The whole two-slit experiment fits on one line:

$$\\langle x|s\\rangle = \\langle x|1\\rangle\\langle 1|s\\rangle + \\langle x|2\\rangle\\langle 2|s\\rangle$$

### Arrows that multiply
An amplitude is a [[?complex-number|complex number]]: an arrow with a length and a direction, its [[?phase]]. Adding means head to tail. Multiplying means the lengths multiply and the angles add — shrink and turn — which is [[?euler-formula|Euler's formula]] at work: $r e^{i\\alpha}\\cdot s e^{i\\beta} = rs\\, e^{i(\\alpha+\\beta)}$. A route through slit 1 whose two steps have arrows of 0.5 at 30° and 0.4 at 100° has the amplitude 0.2 at 130°. If the route through slit 2 gives 0.2 at 310°, the two arrows point opposite ways and cancel: a dark fringe, where adding probabilities would have given 0.08. In the first simulation you drag the four arrows yourself.

### Telling the ways apart
When the electron scatters a photon, the rules still work, but the final event now includes where the photon went. Let $a$ be the amplitude for a photon scattered at slit 1 to reach a photon detector D1, and $b$ for one scattered at slit 2 to reach D1 (for detector D2 the roles swap). Then

$$P(x,\\mathrm{D1}) = |a\\phi_1 + b\\phi_2|^2,\\qquad P(x,\\mathrm{D2}) = |b\\phi_1 + a\\phi_2|^2$$

A photon in D1 and a photon in D2 are different final events, so these two probabilities add. If $b = 0$ the photon tells the slit exactly and the fringes vanish; if $a = b$ it tells nothing and they survive; in between they are partly washed out. What sets the fringe contrast is how alike the two "marks" are — the overlap $g$ in the first formula ($g = 1$: identical marks, $g = 0$: perfectly distinguishable).

### Scattering from a crystal
Feynman's second example: neutrons scattering from a crystal. If a neutron leaves every nucleus as it found it, nothing can tell which nucleus scattered it: the $N$ amplitudes add, and in the directions where they all line up the probability is $N^2$ times that from one nucleus — sharp Bragg peaks. But when the nuclei have spin, the neutron sometimes flips a nucleus's spin (and its own). That nucleus is now marked; flip events at different nuclei are different final states and add as probabilities, giving a smooth background only $N$ times that from one nucleus. Real diffraction patterns show both, just as the rules say. The second simulation adds the arrows of a row of atoms.

### Why arrows?
Probabilities are positive and can only pile up; arrows can cancel. That is all interference needs. Nobody knows a deeper reason why nature keeps its accounts with arrows — the rules are simply what experiment demands.

> [!key] Multiply along a route, add the alternatives, square at the end. "Alternatives" means ways that leave no trace anywhere that could tell them apart; ways that could be told apart add as probabilities.
`,
  ideas: [
    'The probability of an event is the absolute square of its amplitude, P = |φ|².',
    'For ways that cannot be told apart, add the amplitudes (head to tail); for ways that could be, add the probabilities.',
    'For successive steps, multiply the amplitudes: lengths multiply, angles add.',
    'A partial which-way mark, with overlap g between its two states, leaves fringes of contrast g.',
    'Coherent scattering from N atoms gives peaks N² times one atom; spin-flip scattering, which marks the atom, gives a smooth background N times one atom.'
  ],
  pitfalls: [
    'Amplitudes for alternatives add only if nobody looks — They add only if nothing, anywhere, records which way; a trace left in the apparatus is enough to make probabilities add.',
    'Multiplying two amplitudes multiplies their angles — The lengths multiply and the angles add.',
    'An amplitude is just the square root of a probability — It also has a direction (phase), and that is what lets two ways cancel.'
  ],
  formulas: [
    {
      name: 'Two ways, partly marked',
      expr: 'P = P1 + P2 + 2*g*sqrt(P1*P2)*cos(delta)', tex: 'P = P_1 + P_2 + 2g\\sqrt{P_1P_2}\\cos\\delta',
      vars: {
        P: { name: 'probability with both ways open (relative)', q: false, unit: 'relative' },
        P1: { name: 'probability by way 1 alone (relative)', q: false, unit: 'relative', value: 1, tex: 'P_1' },
        P2: { name: 'probability by way 2 alone (relative)', q: false, unit: 'relative', value: 1, tex: 'P_2' },
        g: { name: 'overlap of the two marks (1 = no mark, 0 = fully distinguishable)', value: 0.5, min: 0, max: 1 },
        delta: { name: 'angle between the two arrows', q: 'angle', unit: '°', value: 60, tex: '\\delta' }
      },
      note: 'g = 1 is the two-slit rule without watching; g = 0 is the bullets\' rule. The fringe contrast equals g when P₁ = P₂.',
      stories: { P: 'Each way alone gives {P1} and {P2}; a partial marker has overlap {g}; the arrows meet at {delta}. What is the probability?', g: 'Each way alone gives {P1} and {P2}; at a point where the arrows meet at {delta} the probability is {P}. How alike are the two marks?' }
    },
    {
      name: 'Bragg peak over the spin-flip background',
      expr: 'R = N*(1 - f)/f', tex: 'R = \\dfrac{N(1 - f)}{f}',
      vars: {
        R: { name: 'height of a peak over the smooth background' },
        N: { name: 'number of atoms scattering together', int: true, value: 1000 },
        f: { name: 'share of scatterings that flip a spin', value: 0.2, min: 0, max: 1 }
      },
      note: 'Coherent: |N arrows in line|² = N²(1 − f). Spin flip: N separate probabilities, N·f.',
      stories: { R: 'A row of {N} atoms scatters neutrons; a share {f} of the events flip a spin. How high are the peaks over the background?', f: 'Peaks stand {R} times above the background from {N} atoms. What share of the scatterings flip a spin?' }
    }
  ],
  examples: [
    {
      title: 'A dark fringe from two routes',
      q: 'Route 1: ⟨1|s⟩ = 0.5 at 30°, ⟨x|1⟩ = 0.4 at 100°. Route 2: ⟨2|s⟩ = 0.5 at 30°, ⟨x|2⟩ = 0.4 at 280°. What is the probability of arriving at x, and what would adding probabilities give?',
      steps: [
        'Route 1: lengths $0.5\\times0.4 = 0.2$, angles $30° + 100° = 130°$.',
        'Route 2: lengths $0.2$, angles $30° + 280° = 310°$ — exactly opposite to route 1.',
        'Head to tail the two arrows return to the start: $|\\phi_1 + \\phi_2|^2 = 0$.',
        'Adding probabilities instead: $0.2^2 + 0.2^2 = 0.08$.'
      ],
      a: 'Zero — a dark fringe. Adding probabilities would wrongly give 0.08.'
    },
    {
      title: 'A photon that half-tells',
      q: 'A scattered photon from slit 1 reaches detector D1 with amplitude a = √0.9 and D2 with b = √0.1 (and the other way round from slit 2). With P₁ = P₂ = 1, what are the brightest and darkest values on the screen?',
      steps: [
        'The overlap of the two marks is $g = 2ab = 2\\sqrt{0.9\\times0.1} = 0.6$.',
        'Brightest ($\\delta = 0$): $1 + 1 + 2\\times0.6 = 3.2$. Darkest ($\\delta = 180°$): $2 - 1.2 = 0.8$.',
        'Contrast $(3.2 - 0.8)/(3.2 + 0.8) = 0.6 = g$.'
      ],
      a: '3.2 and 0.8: fringes of 60 % contrast instead of 100 %.'
    },
    {
      title: 'Peaks and background from a crystal row',
      q: 'Ten thousand atoms in a row scatter neutrons; 10 % of the scatterings flip a nuclear spin. How much higher than the background is a Bragg peak?',
      steps: [
        'Coherent part at a peak: $N^2(1-f) = 10^8\\times0.9$ (in units of one atom).',
        'Background: $Nf = 10^4\\times0.1 = 10^3$.',
        'Ratio: $9\\times10^7/10^3 = 9\\times10^4$.'
      ],
      a: 'About 90 000 times higher.'
    }
  ],
  quiz: [
    { q: 'For a way made of two successive steps, the amplitudes of the steps are…', choices: ['multiplied', 'added', 'squared and added', 'averaged'], a: 0, why: 'Successive steps multiply; alternatives add.' },
    { q: 'Two indistinguishable ways have arrows of length 0.6 and 0.8 pointing the same way. The probability is…', choices: ['1.96', '1.00', '1.4', '0.04'], a: 0, why: '(0.6 + 0.8)² = 1.96. Adding probabilities would give 1.00; 1.4 forgets to square; 0.04 is for opposite arrows.' },
    { q: 'If a trace left in the apparatus could reveal the path, the amplitudes still add as long as nobody reads the trace.', a: false, why: 'Distinguishable in principle is enough: the final states differ, and different final states add as probabilities.' },
    { q: 'Multiplying an arrow of 0.5 at 40° by one of 0.4 at 70° gives…', choices: ['0.2 at 110°', '0.9 at 110°', '0.2 at 2800°', '0.2 at 30°'], a: 0, why: 'Lengths multiply (0.5 × 0.4) and angles add (40° + 70°).' },
    { q: 'In neutron scattering from a crystal, the smooth background comes from…', choices: ['neutrons that flipped a nuclear spin, marking which atom scattered them', 'neutrons that missed the crystal', 'the Bragg peaks spreading out', 'neutrons scattered twice'], a: 0, why: 'A flipped spin tells which atom did it, so those events add as probabilities: no peaks.' }
  ],
  problems: [
    { q: 'Two ways each give P = 1 alone, and a which-way marker has overlap g = 0.4. What is the ratio of the brightest to the darkest probability on the screen?', answer: 2.33, tol: 0.02, hint: 'P ranges from 2 − 2g to 2 + 2g.',
      steps: ['Brightest $2 + 0.8 = 2.8$, darkest $2 - 0.8 = 1.2$.', 'Ratio $2.8/1.2 = 2.33$.'] },
    { q: 'Route 1 has steps of lengths 0.7 and 0.3 (angles adding to 20°); route 2 has the same total length but its product points at 110°. What is the probability?', answer: 0.0882, tol: 0.02, hint: 'Two arrows of length 0.21 at right angles.',
      steps: ['Each route: $0.7\\times0.3 = 0.21$.', 'The arrows are 90° apart, so $|\\phi|^2 = 0.21^2 + 0.21^2 = 0.0882$.'] }
  ],
  applications: [
    'Every quantum calculation — atoms, molecules, transistors, lasers — is these rules applied: amplitudes of successive steps multiplied, amplitudes of alternatives added.',
    'Neutron and X-ray diffraction: the sharp peaks of coherent scattering reveal crystal structures, while the diffuse background from spin-flip and isotope scattering carries information about the nuclei.',
    'Quantum computers are machines for adding and multiplying amplitudes, arranged so that the arrows for wrong answers cancel.',
    'Add arrows for light in [the QED arrows tool](#/tools/arrows).'
  ],
  history: 'Max Born proposed in 1926 that the square of a wave\'s amplitude is a probability. Paul Dirac introduced the bracket notation in 1939. Feynman\'s own route to quantum mechanics (his 1942 thesis and his 1948 paper) takes the rule "add the amplitudes of the alternatives" to its limit: a particle going from one place to another adds an arrow for every possible path. Clifford Shull and Bertram Brockhouse shared the 1994 Nobel Prize in Physics for developing neutron scattering.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 3 (Probability Amplitudes) — the laws for combining amplitudes, the two-slit pattern with a scattered photon, scattering from a crystal, and identical particles.',
    'Vol. III, ch. 1 (Quantum Behavior), section 7 "First principles of quantum mechanics".',
    '*QED: The Strange Theory of Light and Matter*, ch. 1–3 — the same rules as arrows for light: arrows for successive steps shrink and turn, arrows for alternatives add head to tail.',
    '"Space-Time Approach to Non-Relativistic Quantum Mechanics" (Reviews of Modern Physics, 1948) — the rules extended to a sum over every path.'
  ],
  sim: ['qb-arrow-rules', 'qb-crystal']
},

{
  id: 'identical-particles', parent: 'amplitudes-topic', title: 'Identical particles: bosons and fermions', level: 3,
  short: 'When two identical particles collide, "a goes to D1 and b to D2" and "b goes to D1 and a to D2" end in the same final state, so their amplitudes combine: added for bosons, subtracted for fermions. At 90° this doubles the rate for bosons and wipes it out for fermions with the same spin.',
  keywords: ['identical particles', 'indistinguishable', 'boson', 'fermion', 'exchange', 'symmetric', 'antisymmetric', 'Mott scattering', 'spin–statistics', 'alpha particle', 'helium', 'thermal wavelength', 'Hong–Ou–Mandel'],
  prereq: ['probability-amplitudes', 'physics:electron-spin', 'math:complex-numbers'],
  related: ['bosons-and-lasers', 'exclusion-principle', 'spin-half', 'superfluid-helium', 'physics:pauli-exclusion'],
  body: `
Two particles fly at each other, collide and fly apart. Watch in the centre-of-mass frame, where they approach head-on with equal speeds and leave back to back. A detector D1 sits at an angle $\\theta$ from the incoming direction, and D2 opposite it. Call the particles a and b, and let $f(\\theta)$ be the [[?amplitude]] that a ends up in D1 (and so b in D2). The other way to get one particle in each detector is for a to go to D2 and b to D1 — scattering through $\\pi - \\theta$ — with amplitude $f(\\pi - \\theta)$.

### Different particles
If a and b differ — an α-particle and an oxygen nucleus — we can check which one arrived in D1. The two ways are distinguishable, so the probabilities add:

$$P = |f(\\theta)|^2 + |f(\\pi - \\theta)|^2$$

### Identical particles
If both are α-particles, "a in D1, b in D2" and "b in D1, a in D2" are not two final states but one: no experiment, even in principle, can say which α came from where. So the amplitudes combine — and nature adds a sign that depends on the kind of particle:

$$P = |f(\\theta) \\pm f(\\pi - \\theta)|^2$$

with **+ for bosons** and **− for fermions**. Swapping two identical bosons leaves the amplitude as it was; swapping two identical fermions turns its arrow round by 180°.

### At 90 degrees
At $\\theta = 90°$ the two ways have the same amplitude, $f$:

| Particles | Rule | Rate at 90° |
|---|---|---|
| different (or labelled) | $\\lvert f\\rvert^2 + \\lvert f\\rvert^2$ | $2\\lvert f\\rvert^2$ |
| identical bosons (α on α) | $\\lvert f + f\\rvert^2$ | $4\\lvert f\\rvert^2$ — twice as many |
| identical fermions, same spin | $\\lvert f - f\\rvert^2$ | 0 — none at all |
| electrons with random spins | same-spin pairs interfere, others do not | $\\lvert f\\rvert^2$ — half as many |

Two electrons with the same spin never leave at right angles to each other in this frame. The last line needs one more idea: spin can serve as a label. If a spin-up electron meets a spin-down one and neither spin flips, the spins tell which electron went where, so those ways add as probabilities; only same-spin pairs interfere, with the minus sign. Averaged over random spins, the negative interference term is half as large as for equal spins.

### Who is which?
Particles of whole-number spin (0, 1, 2 … in units of ħ) are **bosons**: photons, gluons, the W, Z and Higgs, and composites of an even number of fermions — α-particles, helium-4 atoms, deuterons. Particles of half-integer spin are **fermions**: electrons, quarks, protons, neutrons, neutrinos, and composites of an odd number of fermions, such as helium-3 atoms. The link between spin and sign was proved by Markus Fierz (1939) and Wolfgang Pauli (1940) from relativity and quantum mechanics. Feynman was open with his students that he could offer no elementary reason for it: the rule is certain, the simple "why" is missing.

### The simulation
For charged particles the amplitude $f$ has a [[?phase]] that turns as the angle changes, so the interference term swings up and down away from 90° — Mott's formula, the first calculator below. In the simulation the parameter η sets how fast that phase turns; η = 0 switches it off.

### When does identity matter?
Only when the particles could end in the same state — when their wave packets overlap. In a gas that happens when the thermal wavelength $\\lambda_{th} = h/\\sqrt{2\\pi m k_BT}$ reaches the spacing between particles. Nitrogen in air: 0.019 nm against 3.4 nm — a classical gas. Helium at 2 K: 0.62 nm against 0.36 nm in the liquid — a quantum fluid, superfluid below 2.17 K ([[superfluid-helium]]). Electrons in copper at room temperature: 4.3 nm against 0.23 nm — ruled by the [[exclusion-principle]].

> [!key] Identical particles are not merely alike: swapping them gives the same final state, so their amplitudes combine. Bosons add, fermions subtract — and from that one sign come lasers, superfluids, the periodic table and the solidity of matter.
`,
  ideas: [
    'If swapping two particles gives the same final state, the two ways are indistinguishable and their amplitudes combine.',
    'Bosons (whole-number spin) combine with +, fermions (half-integer spin) with −.',
    'At 90° in the centre-of-mass frame, identical bosons scatter at twice the classical rate and identical same-spin fermions not at all.',
    'Spin can label particles: fermions with different, unflipped spins do not interfere.',
    'Identity matters when wave packets overlap: when the thermal wavelength h/√(2πmkT) reaches the spacing between particles.'
  ],
  pitfalls: [
    'Identical particles behave like ordinary particles that happen to look alike — Their indistinguishability changes the counting: rates at 90° double for bosons and vanish for same-spin fermions.',
    'Two electrons can never scatter at 90° — Only electrons with the same spin; with opposite, unflipped spins they behave like distinguishable particles.',
    'Whether a composite particle is a boson depends on its mass — It depends on the number of fermions inside: helium-4 (six fermions) is a boson, helium-3 (five) a fermion.'
  ],
  formulas: [
    {
      name: 'Scattering of two identical charged particles (Mott)',
      expr: 'R = 1/sin(theta/2)^4 + 1/cos(theta/2)^4 + w*cos(eta*ln(tan(theta/2)^2))/(sin(theta/2)^2*cos(theta/2)^2)',
      tex: 'R = \\dfrac{1}{\\sin^4\\frac{\\theta}{2}} + \\dfrac{1}{\\cos^4\\frac{\\theta}{2}} + \\dfrac{w\\cos\\left(\\eta\\ln\\tan^2\\frac{\\theta}{2}\\right)}{\\sin^2\\frac{\\theta}{2}\\cos^2\\frac{\\theta}{2}}',
      vars: {
        R: { name: 'rate in units of the Rutherford constant', q: false, unit: 'relative' },
        theta: { name: 'scattering angle in the centre-of-mass frame', q: 'angle', unit: '°', value: 60, min: 1, max: 179, tex: '\\theta' },
        eta: { name: 'Coulomb parameter η (how fast the phase turns)', value: 1, min: 0, max: 20, tex: '\\eta' },
        w: { name: 'exchange weight: +2 bosons, 0 different particles, −2 same-spin fermions, −1 unpolarised spin ½', signed: true, value: 2, min: -2, max: 2 }
      },
      note: 'The first two terms are the two Rutherford ways added as probabilities; the third is their interference. At 90° it is w/2 times the sum of the first two.',
      stories: { R: 'Two identical particles with exchange weight {w} scatter at {theta} with Coulomb parameter {eta}. What is the rate, in Rutherford units?', w: 'At {theta} with Coulomb parameter {eta} the rate is {R} Rutherford units. What is the exchange weight?' },
      practice: { unknowns: ['R', 'w'] }
    },
    {
      name: 'Thermal de Broglie wavelength',
      expr: 'lambda = h/sqrt(2*pi*m*kB*T)', tex: '\\lambda_{th} = \\dfrac{h}{\\sqrt{2\\pi m k_B T}}',
      vars: {
        lambda: { name: 'thermal wavelength', q: 'length', unit: 'nm', tex: '\\lambda_{th}' },
        h: { const: 'h' },
        m: { name: 'mass of one particle', q: 'mass', unit: 'u', value: 4.0026 },
        kB: { const: 'kB', tex: 'k_B' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 2 }
      },
      note: 'When λ_th approaches the spacing between the particles, their identity (boson or fermion) takes over.',
      stories: { lambda: 'What is the thermal wavelength of particles of mass {m} at {T}?', T: 'At what temperature do particles of mass {m} have a thermal wavelength of {lambda}?' }
    }
  ],
  examples: [
    {
      title: 'Counting at 90 degrees',
      q: 'A detector at 90° (centre-of-mass frame) counts 100 a minute when the two colliding particles are different. What does it count for identical spin-0 bosons, for identical electrons all with spin up, and for electrons with random spins (same beam and angle)?',
      steps: [
        'Different particles: $|f|^2 + |f|^2 = 100$, so each way alone gives 50.',
        'Bosons: $|f + f|^2 = 4|f|^2 = 200$.',
        'Same-spin fermions: $|f - f|^2 = 0$.',
        'Random spins: half the pairs have equal spins (0), half are labelled by their spins (100): on average 50.'
      ],
      a: '200, 0 and 50 a minute.'
    },
    {
      title: 'α on α at 60°, without the Coulomb phase',
      q: 'Using Mott\'s formula with η = 0, compare the rate of identical spin-0 particles (w = 2) with distinguishable ones (w = 0) at 60°.',
      steps: [
        '$\\sin 30° = 0.5$, so $1/\\sin^4 = 16$; $\\cos 30° = 0.866$, so $1/\\cos^4 = 1.78$.',
        'Interference: $2/(\\sin^2 30°\\cos^2 30°) = 2/(0.25\\times0.75) = 10.7$.',
        'Bosons: $16 + 1.78 + 10.7 = 28.4$; distinguishable: $17.8$. Ratio 1.6.'
      ],
      a: 'Identical bosons scatter 1.6 times more at 60° (and exactly twice as much at 90°).'
    },
    {
      title: 'Why liquid helium is a quantum fluid',
      q: 'Find the thermal wavelength of helium-4 atoms (4.0026 u) at 2 K and compare it with the spacing of atoms in the liquid, about 0.36 nm.',
      steps: [
        '$m = 4.0026\\times1.661\\times10^{-27} = 6.65\\times10^{-27}$ kg.',
        '$\\lambda_{th} = 6.626\\times10^{-34}/\\sqrt{2\\pi\\times6.65\\times10^{-27}\\times1.381\\times10^{-23}\\times2} = 6.2\\times10^{-10}$ m.',
        '0.62 nm is larger than the spacing: the atoms\' waves overlap, and their being bosons decides how the liquid behaves.'
      ],
      a: 'About 0.62 nm — nearly twice the spacing.'
    }
  ],
  quiz: [
    { q: 'Two identical spin-0 bosons scatter at 90° in the centre-of-mass frame. Compared with distinguishable particles, the counting rate is…', choices: ['twice as large', 'the same', 'half as large', 'zero'], a: 0, why: '|f + f|² = 4|f|² against |f|² + |f|² = 2|f|².' },
    { q: 'Two electrons with the same spin scatter at 90° in the centre-of-mass frame. The rate is…', choices: ['zero', 'twice the classical rate', 'the classical rate', 'half the classical rate'], a: 0, why: 'For fermions the amplitudes subtract: |f − f|² = 0.' },
    { q: 'Which of these is a boson?', choices: ['a helium-4 atom', 'a helium-3 atom', 'a proton', 'a neutron'], a: 0, why: 'Helium-4 contains six fermions (2 protons, 2 neutrons, 2 electrons), an even number; helium-3 contains five.' },
    { q: 'Two electrons with opposite spins, neither of which flips, scatter like distinguishable particles.', a: true, why: 'Their spins label them, so the two ways lead to different final states and add as probabilities.' },
    { q: 'An unpolarised beam of electrons scatters from electrons at 90°. Compared with distinguishable particles the rate is…', choices: ['half', 'the same', 'twice', 'zero'], a: 0, why: 'Half the pairs have equal spins and give zero; the other half are labelled by spin and count normally.' }
  ],
  problems: [
    { q: 'Rubidium-87 atoms (86.91 u) are cooled to 100 nK. What is their thermal wavelength, in micrometres?', answer: 0.592, unit: 'µm', tol: 0.02, hint: 'λ = h/√(2πmk_BT).',
      steps: ['$m = 86.91\\times1.6605\\times10^{-27} = 1.443\\times10^{-25}$ kg.', '$\\lambda = 6.626\\times10^{-34}/\\sqrt{2\\pi\\times1.443\\times10^{-25}\\times1.381\\times10^{-23}\\times10^{-7}} = 5.92\\times10^{-7}$ m — larger than the spacing in the cloud, which is why it condenses.'] },
    { q: 'With Mott\'s formula, η = 0, θ = 90°, and unpolarised spin-½ particles (w = −1): what is R?', answer: 4, tol: 0.01, hint: 'At 90°, sin² = cos² = ½.',
      steps: ['$1/\\sin^4 45° + 1/\\cos^4 45° = 4 + 4 = 8$.', 'Interference: $-1/(0.5\\times0.5) = -4$.', '$R = 8 - 4 = 4$: half the distinguishable rate.'] }
  ],
  applications: [
    'The Hong–Ou–Mandel effect (1987): two identical photons meeting at a half-silvered mirror always leave by the same side, because the two ways of leaving by different sides cancel. It is a standard test of how identical single photons are.',
    'Nuclear physics: the scattering of identical nuclei, such as α on α or carbon-12 on carbon-12, shows Mott\'s interference and tests the spins of nuclei.',
    'Superfluids and atomic Bose–Einstein condensates (bosons); metals, white dwarfs and neutron stars (fermions).'
  ],
  history: 'Satyendra Nath Bose counted photons as indistinguishable in 1924, and Einstein extended the counting to atoms in 1924–25. Enrico Fermi and Paul Dirac worked out the statistics of particles that obey the exclusion principle in 1926. Nevill Mott calculated the scattering of identical particles in 1929–30, and experiments with α-particles in helium soon confirmed the extra interference. Markus Fierz (1939) and Wolfgang Pauli (1940) proved the connection between spin and statistics.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 3 (Probability Amplitudes), section 4 "Identical particles" — two α-particles colliding, the plus sign, and electrons whose spins may or may not tell them apart.',
    'Vol. III, ch. 4 (Identical Particles) — Bose particles and Fermi particles, and the frank admission that no elementary explanation of the spin–statistics connection is known.'
  ],
  sim: 'qb-identical-scatter'
},

{
  id: 'bosons-and-lasers', parent: 'amplitudes-topic', title: 'Bosons crowd together: lasers and black-body light', level: 3,
  short: 'Bosons like company: the chance that a photon is emitted into a state already holding n photons is n + 1 times the chance for an empty one. This one rule gives stimulated emission, the laser, and Planck\'s law of black-body light.',
  keywords: ['stimulated emission', 'spontaneous emission', 'n + 1', 'laser', 'maser', 'population inversion', 'Einstein A and B coefficients', 'Planck distribution', 'black body', 'Bose–Einstein', 'photons per mode', 'Bose–Einstein condensate', 'threshold'],
  prereq: ['identical-particles', 'physics:photon', 'physics:blackbody-radiation'],
  related: ['exclusion-principle', 'equipartition-failure', 'ammonia-maser', 'superfluid-helium', 'physics:lasers'],
  body: `
Photons, helium-4 atoms and other bosons tend to pile into the same state. Feynman derived this from the plus sign of [[identical-particles]] in a few lines, then used it for the theory of the laser and of the light from hot bodies.

### Two bosons in one state
Two bosons come from different sources. Particle 1 reaches a state $\\chi$ with amplitude $a_1$, particle 2 with amplitude $a_2$; let $\\chi'$ be a second state very close to $\\chi$. Different particles can put one in each state in two distinguishable ways, with total probability $2|a_1a_2|^2$. For identical bosons these are two routes to a single final state, so their amplitudes add: $|a_1a_2 + a_2a_1|^2 = 4|a_1a_2|^2$ — **twice as likely**. Pushed further, the chance of adding one more boson to a state already holding $n$ is $n + 1$ times the chance for an empty state. Bosons already in a state invite others in.

### Photons: emitted with n + 1, absorbed with n
Photons are bosons. An excited atom emits into a particular *mode* — one direction, frequency and polarisation — at a rate proportional to $n + 1$, where $n$ is the number of photons already in that mode; an atom in the lower state absorbs from the mode at a rate proportional to $n$:

$$W_{\\text{emit}} = (n+1)\\,W_0,\\qquad W_{\\text{absorb}} = n\\,W_0$$

The "1" is **spontaneous emission**, what an atom does in the dark. The $n$ is **stimulated emission**, and the new photon joins the crowd: same direction, frequency, polarisation and [[?phase]]. Einstein showed in 1916–17 that both kinds of emission must exist, long before anyone spoke of bosons.

### Planck's law from n + 1
Let atoms at temperature $T$ trade photons with one mode of frequency $f$. In equilibrium the upper-state atoms emit as fast as the lower-state atoms absorb, $N_e(\\bar n + 1) = N_g\\bar n$, and the [[?boltzmann-factor|Boltzmann factor]] fixes $N_e/N_g = e^{-hf/k_BT}$. Solving for the average number of photons in the mode:

$$\\bar n = \\frac{1}{e^{hf/k_BT} - 1}$$

Multiply by the number of modes and the energy $hf$ of each photon, and this is Planck's black-body law (see the derivation).

| Light | $hf/k_BT$ | Photons per mode $\\bar n$ |
|---|---|---|
| green (500 nm) at the Sun's surface, 5800 K | 5.0 | 0.007 |
| green from a room at 300 K | 96 | $2\\times10^{-42}$ |
| infrared (10 µm) at 300 K | 4.8 | 0.008 |
| microwaves (1 cm) of the cosmic background, 2.7 K | 0.53 | 1.4 |
| the mode of a 1 mW helium–neon laser | — | about $6\\times10^{8}$ |

In sunlight fewer than one emission in a hundred is stimulated. In a laser nearly all of it is.

### The laser
To make stimulated emission win, a laser keeps more atoms in the upper state than in the lower — a population inversion — and places them between two mirrors, so that one mode keeps its photons for a while. A photon emitted spontaneously into that mode stimulates more into the same mode, and as long as the gain beats the loss through the mirrors the number grows exponentially, until the pump cannot keep up. The simulation shows the threshold: below it, a faint glow in all directions; above it, a beam. Switch off the $n$ in $n + 1$ and there is no laser at any pump rate. The first maser (1954) used ammonia molecules ([[ammonia-maser]]); the first laser (1960) a ruby crystal.

### Bosons of matter
Atoms that are bosons crowd together the same way. Liquid helium-4 becomes a superfluid below 2.17 K, and in 1995 dilute gases of rubidium and sodium atoms, cooled below a millionth of a kelvin, fell into a single quantum state — a Bose–Einstein condensate.

> [!key] A boson enters a state already holding n bosons n + 1 times more readily than an empty one. Spontaneous emission is the "1"; stimulated emission, lasers and Planck's law are the "n".
`,
  ideas: [
    'Two identical bosons are twice as likely to be found in the same state as two different particles.',
    'The rate of emission into a mode holding n photons is (n + 1) times the rate into an empty mode; absorption goes as n.',
    'The "1" is spontaneous emission; the "n" is stimulated emission, which copies the photons already there.',
    'Balancing emission and absorption at temperature T gives n̄ = 1/(e^{hf/kT} − 1), Planck\'s law.',
    'A laser needs a population inversion and a cavity: above threshold, one mode fills with a huge number of photons.'
  ],
  pitfalls: [
    'Stimulated emission produces photons in random directions — The stimulated photon goes into the same mode as those already there: same direction, frequency, polarisation and phase.',
    'Ordinary light is mostly stimulated emission — In sunlight n̄ ≈ 0.007 per mode, so fewer than one emission in a hundred is stimulated.',
    'Pumping harder always makes a laser — Below threshold the gain does not beat the mirror loss and the light stays a weak spontaneous glow.'
  ],
  derivation: {
    title: 'Planck\'s law from the n + 1 rule',
    steps: [
      { text: 'Take atoms with two levels hf apart. In equilibrium at temperature T their populations follow the Boltzmann factor:', tex: '\\frac{N_e}{N_g} = e^{-hf/k_BT}' },
      { text: 'Upper atoms emit into a mode holding n̄ photons at the rate (n̄ + 1)W₀ each; lower atoms absorb at n̄W₀ each. In equilibrium the two flows balance:', tex: 'N_e(\\bar n + 1)\\,W_0 = N_g\\,\\bar n\\,W_0' },
      { text: 'Divide by N_g and use the Boltzmann factor; then gather the terms in n̄ and solve:', tex: '\\bar n = \\frac{1}{e^{hf/k_BT} - 1}' },
      { text: 'A box of volume V holds 8πf²V df/c³ modes between f and f + df (all directions, two polarisations). Each holds n̄ photons of energy hf, so the energy per unit volume is:', tex: 'u(f)\\,df = \\frac{8\\pi f^2}{c^3}\\,\\frac{hf}{e^{hf/k_BT} - 1}\\,df' },
      { text: 'That is Planck\'s law. At low frequencies (hf ≪ k_BT), n̄ ≈ k_BT/hf and each mode holds energy k_BT — the classical answer, which fails at high frequencies (see [[equipartition-failure]]).' }
    ]
  },
  formulas: [
    {
      name: 'Average number of photons in a mode (Planck)',
      expr: 'n = 1/(exp(h*f/(kB*T)) - 1)', tex: '\\bar n = \\dfrac{1}{e^{hf/k_BT} - 1}',
      vars: {
        n: { name: 'average number of photons in the mode', tex: '\\bar n' },
        h: { const: 'h' },
        f: { name: 'frequency', q: 'frequency', unit: 'THz', value: 600 },
        kB: { const: 'kB', tex: 'k_B' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 5800 }
      },
      note: 'Also the ratio of stimulated to spontaneous emission in thermal light.',
      stories: { n: 'Light of {f} is in equilibrium with a body at {T}. How many photons does each mode hold on average?', T: 'At what temperature does a mode of {f} hold {n} photons on average?' }
    },
    {
      name: 'Emission into a mode that already holds n photons',
      expr: 'W = W0*(n + 1)', tex: 'W = W_0\\,(n + 1)',
      vars: {
        W: { name: 'rate of emission into the mode', q: 'rate', unit: '1/s' },
        W0: { name: 'rate into an empty mode (spontaneous)', q: 'rate', unit: '1/s', value: 100, tex: 'W_0' },
        n: { name: 'photons already in the mode', int: true, value: 9 }
      },
      note: 'The absorption rate from the same mode is W₀·n.',
      stories: { W: 'An excited atom emits into an empty mode at {W0}. How fast does it emit into the mode when it holds {n} photons?', n: 'The emission rate into a mode has risen from {W0} to {W}. How many photons are in the mode?' }
    },
    {
      name: 'How long a photon stays in a laser cavity',
      expr: 'tau = 2*L/(c*(1 - Rm))', tex: '\\tau = \\dfrac{2L}{c\\,(1 - R)}',
      vars: {
        tau: { name: 'photon lifetime in the cavity', q: 'time', unit: 'ns', tex: '\\tau' },
        L: { name: 'length of the cavity', q: 'length', unit: 'm', value: 0.3 },
        c: { const: 'c' },
        Rm: { name: 'reflectance of the output mirror (the other reflects fully)', q: 'ratio', unit: '%', value: 99, min: 0, max: 99.99, tex: 'R' }
      },
      note: 'Each round trip (time 2L/c) loses the fraction 1 − R; valid when the loss per trip is small.',
      stories: { tau: 'A laser cavity {L} long has an output mirror of reflectance {Rm}. How long does a photon stay inside?', Rm: 'What mirror reflectance keeps photons in a {L} cavity for {tau}?' }
    },
    {
      name: 'Photons stored in the laser mode',
      expr: 'N = P*tau*lambda/(h*c)', tex: 'N = \\dfrac{P\\tau\\lambda}{hc}',
      vars: {
        N: { name: 'photons in the laser mode' },
        P: { name: 'output power', q: 'power', unit: 'mW', value: 1 },
        tau: { name: 'photon lifetime in the cavity', q: 'time', unit: 'ns', value: 200, tex: '\\tau' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      note: 'The output power is the stored photons times their energy hc/λ, leaking out at the rate 1/τ.',
      stories: { N: 'A laser of {lambda} gives {P}, and its photons live {tau} in the cavity. How many photons are in the mode?', P: 'A cavity holds {N} photons of {lambda} with lifetime {tau}. What power comes out?' }
    }
  ],
  examples: [
    {
      title: 'Photons per mode in sunlight',
      q: 'The Sun\'s surface is at about 5800 K. How many photons does a mode of green light (500 nm) hold on average?',
      steps: [
        '$f = c/\\lambda = 3.0\\times10^8/5\\times10^{-7} = 6.0\\times10^{14}$ Hz; $hf = 3.97\\times10^{-19}$ J.',
        '$k_BT = 1.381\\times10^{-23}\\times5800 = 8.01\\times10^{-20}$ J, so $hf/k_BT = 4.96$.',
        '$\\bar n = 1/(e^{4.96} - 1) = 1/141.8 = 0.0071$.'
      ],
      a: 'About 0.007: for every stimulated emission there are about 140 spontaneous ones.'
    },
    {
      title: 'Photons inside a helium–neon laser',
      q: 'A helium–neon laser (632.8 nm) has a cavity 0.3 m long with a 99 % output mirror and gives 1 mW. How long does a photon stay in the cavity, and how many photons are in the mode?',
      steps: [
        '$\\tau = 2L/c(1 - R) = 0.6/(3.0\\times10^8\\times0.01) = 2.0\\times10^{-7}$ s = 200 ns.',
        'Photon energy $hc/\\lambda = 3.14\\times10^{-19}$ J.',
        '$N = P\\tau/(hc/\\lambda) = 10^{-3}\\times2\\times10^{-7}/3.14\\times10^{-19} = 6.4\\times10^{8}$.'
      ],
      a: '200 ns, and about 6×10⁸ photons in one mode — against 0.007 for sunlight.'
    },
    {
      title: 'A crowded mode',
      q: 'An excited atom emits spontaneously into a given mode at 100 per second (if the atom stayed excited). What is its emission rate into that mode when the mode holds 999 photons?',
      steps: ['$W = W_0(n + 1) = 100\\times1000 = 10^5$ per second.', 'Of this, 99.9 % is stimulated, copying the photons already there.'],
      a: '10⁵ per second — a thousand times faster.'
    }
  ],
  quiz: [
    { q: 'An excited atom sits in a cavity mode holding 9 photons. Its rate of emission into that mode, compared with an empty mode, is…', choices: ['10 times', '9 times', 'the same', '81 times'], a: 0, why: 'The factor is n + 1 = 10: 1 spontaneous, 9 stimulated.' },
    { q: 'A stimulated photon has…', choices: ['the same direction, frequency, polarisation and phase as the photons already in the mode', 'a random direction', 'twice the energy', 'the opposite polarisation'], a: 0, why: 'It is emitted into the same mode — the same state — as the photons that stimulated it.' },
    { q: 'For a laser to work you need…', choices: ['more atoms in the upper level than in the lower', 'more atoms in the lower level than in the upper', 'a very hot gas', 'fermions instead of bosons'], a: 0, why: 'Stimulated emission (∝ N_e) must beat absorption (∝ N_g) and the mirror losses.' },
    { q: 'Most of the light from the Sun is stimulated emission.', a: false, why: 'Visible modes at 5800 K hold about 0.007 photons, so stimulated emission is under 1 % of the total.' },
    { q: 'At what value of hf/k_BT does a mode hold on average exactly one photon?', answer: 0.693, why: '1/(e^x − 1) = 1 when e^x = 2, x = ln 2 = 0.693.' }
  ],
  problems: [
    { q: 'The cosmic microwave background is at 2.725 K. How many photons does a mode of wavelength 1 cm hold on average?', answer: 1.44, tol: 0.02, hint: 'Compute hf/k_BT first.',
      steps: ['$hf = hc/\\lambda = 1.986\\times10^{-23}$ J; $k_BT = 3.762\\times10^{-23}$ J; ratio 0.528.', '$\\bar n = 1/(e^{0.528} - 1) = 1/0.695 = 1.44$.'] },
    { q: 'A laser cavity is 0.5 m long and its output mirror reflects 98 %. How long does a photon stay in the cavity, in nanoseconds?', answer: 167, unit: 'ns', tol: 0.02, hint: 'τ = 2L/(c(1 − R)).',
      steps: ['$\\tau = 2\\times0.5/(3.0\\times10^8\\times0.02) = 1.67\\times10^{-7}$ s = 167 ns.'] }
  ],
  applications: [
    'Lasers everywhere: fibre-optic links, barcode scanners, eye surgery, cutting and welding, and the kilometre-long interferometers that detect gravitational waves.',
    'Hydrogen masers keep time in radio observatories and navigation systems; maser amplifiers once received the faint radio signals of space probes.',
    'Black-body radiation: thermal cameras, the temperatures of stars, and the cosmic microwave background.',
    'Superfluid helium and atomic Bose–Einstein condensates, in which matter behaves as one quantum wave.'
  ],
  history: 'Max Planck found his radiation law in 1900. Einstein showed in 1916–17 that thermal equilibrium requires stimulated emission alongside spontaneous emission and absorption. Satyendra Nath Bose derived Planck\'s law in 1924 by counting photons as indistinguishable. Charles Townes, James Gordon and Herbert Zeiger built the ammonia maser in 1954, and Theodore Maiman the first laser, with ruby, in 1960. Pyotr Kapitsa, and John Allen with Don Misener, discovered the superfluidity of helium in 1937–38; Eric Cornell, Carl Wieman and Wolfgang Ketterle made the first atomic Bose–Einstein condensates in 1995 (Nobel Prize 2001).',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 4 (Identical Particles) — states with two and with n Bose particles, emission and absorption of photons, the black-body spectrum, liquid helium.',
    'Vol. I, ch. 42 (Applications of Kinetic Theory) — Einstein\'s laws of radiation: spontaneous and stimulated emission balanced against absorption.',
    'Vol. I, ch. 41 (The Brownian Movement) — thermal equilibrium of radiation and the quantum oscillator: why the classical energy per mode fails.',
    'Vol. III, ch. 9 (The Ammonia Maser) — how the first maser worked.'
  ],
  sim: 'qb-laser'
},

{
  id: 'exclusion-principle', parent: 'amplitudes-topic', title: 'The exclusion principle', level: 2,
  short: 'For fermions the two exchange amplitudes subtract, so two identical fermions can never be in the same state. Electrons therefore fill energy levels two at a time, spin up and spin down — which gives atoms their shells, the periodic table its rows, metals their Fermi energy and matter its solidity.',
  keywords: ['Pauli exclusion principle', 'fermion', 'electron shells', 'periodic table', 'spin up spin down', 'Fermi energy', 'Fermi sea', 'degeneracy pressure', 'white dwarf', 'Chandrasekhar limit', 'noble gases', 'ionisation energy', 'antisymmetric', 'stability of matter'],
  prereq: ['identical-particles', 'physics:electron-spin', 'physics:quantum-numbers'],
  related: ['hydrogen-and-periodic-table', 'bosons-and-lasers', 'semiconductors-feyn', 'physics:pauli-exclusion', 'physics:fermi-energy'],
  body: `
Put two identical fermions into the same state and the rule of [[identical-particles]] gives an amplitude of the form $a - a = 0$. The probability is zero: **no two identical fermions can occupy the same state.** Wolfgang Pauli found the rule in 1925 by analysing atomic spectra; the minus sign behind it was recognised a year later.

### Two per level
For an electron the "state" includes its spin, which has two values, up and down. So each orbital — each spatial pattern of the wave — holds at most two electrons, with opposite spins. Feed electrons one at a time into a set of energy levels and they must stack up: two in the lowest level, two in the next, and so on. Bosons, by contrast, all settle into the lowest level at low temperature. The simulation fills a well both ways.

| Particles in a well with levels $\\hbar\\omega$ apart | Bosons: all in the ground level | Spin-½ fermions: two per level |
|---|---|---|
| 2 | $1\\,\\hbar\\omega$ | $1\\,\\hbar\\omega$ |
| 10 | $5\\,\\hbar\\omega$ | $25\\,\\hbar\\omega$ |
| 20 | $10\\,\\hbar\\omega$ | $100\\,\\hbar\\omega$ |

For fermions the total is $N^2\\hbar\\omega/4$: it grows as the [[?exponent|square]] of the number, because each new pair has to sit higher than the last.

### Atoms and the periodic table
In an atom the levels are shells and subshells. An s subshell holds 2 electrons, p holds 6, d 10 and f 14 — twice the number of orbitals, $2l + 1$ — and the shell with principal number $n$ holds $2n^2$. Filling them in order of energy (1s, 2s, 2p, 3s, 3p, 4s, 3d …) builds the periodic table. A full shell is hard to disturb: helium needs 24.6 eV to lose an electron, neon 21.6 eV. The next electron must start a new shell, farther out and loosely held: lithium gives it up for 5.4 eV, sodium for 5.1 eV. So the noble gases are inert and the alkali metals violently reactive. Without the exclusion principle every electron would drop into 1s and there would be no chemistry ([[hydrogen-and-periodic-table]]). The atom mode of the simulation fills the shells element by element and plots the ionisation energies.

### Why matter takes up room
Squeeze matter and you try to push electrons into the same place. The exclusion principle forces them into states of shorter wavelength — higher momentum, higher energy — and that costs energy: a pressure that comes from quantum mechanics, not from electric repulsion. In a metal the conduction electrons fill every level up to the **Fermi energy**

$$E_F = \\frac{\\hbar^2}{2m}\\left(3\\pi^2 n\\right)^{2/3}$$

where $n$ is the number of electrons per unit volume. For copper $E_F = 7.0$ eV, nearly 300 times the thermal energy $k_BT = 0.025$ eV at room temperature. Only electrons within about $k_BT$ of the top can take up heat, which is why the electrons of a metal add so little to its heat capacity. In a white dwarf the same electron pressure holds up a star the size of the Earth; above about 1.4 solar masses (Chandrasekhar's limit) it gives way. Freeman Dyson and Andrew Lenard proved in 1967 that ordinary matter is stable — its energy grows only in proportion to the number of particles, instead of collapsing into ever denser lumps — and their proof needs the electrons to be fermions.

> [!key] Two identical fermions never share a state. Electrons therefore fill levels two at a time — spin up, spin down — and that single rule gives atoms their shells, chemistry its periodic table, metals their Fermi sea and matter its bulk.
`,
  ideas: [
    'For identical fermions the amplitude to be in the same state is a − a = 0: no two share a state.',
    'With spin up and spin down, each orbital holds two electrons; levels fill two at a time.',
    'Subshells hold 2(2l + 1) electrons and shells 2n²; full shells make the noble gases, a lone outer electron the alkali metals.',
    'Electrons in a metal fill a Fermi sea up to E_F = (ħ²/2m)(3π²n)^{2/3}, several electronvolts.',
    'Degeneracy pressure from the exclusion principle holds up white dwarfs and gives ordinary matter its size.'
  ],
  pitfalls: [
    'Two electrons can never be in the same orbital — They can, if their spins are opposite; what is forbidden is the same complete state, spin included.',
    'Matter is hard because electrons repel electrically — Electric forces alone cannot make bulk matter stable; the exclusion principle is essential.',
    'At room temperature all the electrons of a metal are thermally agitated — Only those within about k_BT of the Fermi energy can change state; the rest have nowhere to go.'
  ],
  derivation: {
    title: 'The Fermi energy, by counting states',
    steps: [
      { text: 'Put N electrons in a cube of side L. With periodic boundaries the allowed wave vectors form a grid, each point taking up a volume (2π/L)³ of wave-number space:', tex: '\\Delta^3 k = \\left(\\frac{2\\pi}{L}\\right)^3' },
      { text: 'At zero temperature the electrons fill every state inside a sphere of radius k_F, two per point (spin up and spin down). Count them:', tex: 'N = 2\\cdot\\frac{\\tfrac{4}{3}\\pi k_F^3}{(2\\pi/L)^3} = \\frac{k_F^3L^3}{3\\pi^2}' },
      { text: 'Write n = N/L³ for the number per unit volume and solve for the radius of the sphere:', tex: 'k_F = \\left(3\\pi^2 n\\right)^{1/3}' },
      { text: 'The electrons at the top have energy ħ²k_F²/2m:', tex: 'E_F = \\frac{\\hbar^2}{2m}\\left(3\\pi^2 n\\right)^{2/3}' },
      { text: 'The top of the sea rises as n^{2/3}: squeeze the electrons into half the volume and E_F grows by 2^{2/3} = 1.59. That rising cost of squeezing is the degeneracy pressure.' }
    ]
  },
  formulas: [
    {
      name: 'The Fermi energy of free electrons',
      expr: 'EF = hbar^2/(2*m)*(3*pi^2*n)^(2/3)', tex: 'E_F = \\dfrac{\\hbar^2}{2m}\\left(3\\pi^2 n\\right)^{2/3}',
      vars: {
        EF: { name: 'Fermi energy', q: 'energy', unit: 'eV', tex: 'E_F' },
        hbar: { const: 'hbar' },
        m: { const: 'me', name: 'mass of the electron', tex: 'm' },
        n: { name: 'free electrons per unit volume', q: 'numberdensity', unit: '1/m³', value: 8.49e28 }
      },
      note: 'Copper: 8.49×10²⁸ m⁻³ gives 7.0 eV. Measured from the bottom of the conduction band.',
      stories: { EF: 'A metal has {n} free electrons. What is its Fermi energy?', n: 'What density of free electrons gives a Fermi energy of {EF}?' }
    },
    {
      name: 'Speed of the electrons at the top of the Fermi sea',
      expr: 'vF = sqrt(2*EF/m)', tex: 'v_F = \\sqrt{\\dfrac{2E_F}{m}}',
      vars: {
        vF: { name: 'Fermi speed', q: 'speed', unit: 'm/s', tex: 'v_F' },
        EF: { name: 'Fermi energy', q: 'energy', unit: 'eV', value: 7, tex: 'E_F' },
        m: { const: 'me', name: 'mass of the electron', tex: 'm' }
      },
      note: 'Even at absolute zero the fastest electrons of a metal move at about 1% of the speed of light.',
      stories: { vF: 'The Fermi energy of a metal is {EF}. How fast do its fastest electrons move at absolute zero?' }
    },
    {
      name: 'Electrons in a full shell',
      expr: 'N = 2*n^2', tex: 'N = 2n^2',
      vars: {
        N: { name: 'electrons in the full shell', int: true },
        n: { name: 'principal quantum number', int: true, value: 3 }
      },
      note: 'The shell holds subshells l = 0 … n − 1, each with 2(2l + 1) places.',
      stories: { N: 'How many electrons fit into the shell with n = {n}?' }
    },
    {
      name: 'Spin-½ fermions filling a harmonic well',
      expr: 'E = N^2*E0/4', tex: 'E = \\dfrac{N^2 E_0}{4}',
      vars: {
        E: { name: 'total energy of the ground state', q: 'energy', unit: 'eV' },
        N: { name: 'number of fermions (even)', int: true, value: 10 },
        E0: { name: 'spacing of the levels, ħω', q: 'energy', unit: 'eV', value: 0.1, tex: 'E_0' }
      },
      note: 'Two per level, levels (k + ½)ħω. The same number of bosons would have N·E₀/2.',
      stories: { E: '{N} spin-½ fermions fill a harmonic well whose levels are {E0} apart. What is the total energy of the ground state?' }
    }
  ],
  examples: [
    {
      title: 'The Fermi sea of copper',
      q: 'Copper has 8.49×10²⁸ free electrons per cubic metre. Find the Fermi energy, the equivalent temperature E_F/k_B and the Fermi speed.',
      steps: [
        '$3\\pi^2 n = 29.6\\times8.49\\times10^{28} = 2.51\\times10^{30}$ m⁻³; to the power 2/3: $1.85\\times10^{20}$ m⁻².',
        '$\\hbar^2/2m = (1.055\\times10^{-34})^2/(2\\times9.11\\times10^{-31}) = 6.11\\times10^{-39}$ J·m²; $E_F = 1.13\\times10^{-18}$ J = 7.0 eV.',
        '$E_F/k_B = 1.13\\times10^{-18}/1.381\\times10^{-23} = 82\\,000$ K; $v_F = \\sqrt{2E_F/m} = 1.57\\times10^6$ m/s.'
      ],
      a: '7.0 eV, like a temperature of 82 000 K, with the top electrons moving at 1.6×10⁶ m/s.'
    },
    {
      title: 'Ten particles in a well',
      q: 'Ten particles go into a harmonic well with levels (k + ½)ħω. Find the lowest total energy if they are spin-0 bosons, spin-½ fermions, or fermions all with the same spin.',
      steps: [
        'Bosons: all in the ground level, $10\\times\\tfrac12\\hbar\\omega = 5\\hbar\\omega$.',
        'Spin-½ fermions: two in each of the levels k = 0 … 4: $2(\\tfrac12 + \\tfrac32 + \\tfrac52 + \\tfrac72 + \\tfrac92)\\hbar\\omega = 25\\hbar\\omega$.',
        'Same-spin fermions: one in each of the levels k = 0 … 9: $(0 + 1 + \\dots + 9 + 5)\\hbar\\omega = 50\\hbar\\omega$.'
      ],
      a: '5, 25 and 50 ħω: the fewer places per level, the higher the particles must climb.'
    },
    {
      title: 'Neon and sodium',
      q: 'Neon has 10 electrons, sodium 11. Why does neon need 21.6 eV to lose an electron but sodium only 5.1 eV?',
      steps: [
        'Neon: 1s² 2s² 2p⁶ — the n = 2 shell is full ($2n^2 = 8$ plus the two in 1s).',
        'Sodium\'s eleventh electron cannot join it: it must go into 3s, a new shell farther out, shielded from the nucleus by the ten inner electrons.',
        'It feels an effective charge of only about one proton and is easily removed.'
      ],
      a: 'The exclusion principle forces sodium\'s last electron into a new, loosely bound shell.'
    }
  ],
  quiz: [
    { q: 'How many electrons fit into the shell with n = 3?', choices: ['18', '9', '6', '8'], a: 0, why: '2n² = 18: 3s (2) + 3p (6) + 3d (10).' },
    { q: 'Five spin-½ fermions are put into a harmonic well at zero temperature. The highest occupied level is…', choices: ['the third level (k = 2)', 'the fifth level', 'the ground level', 'the second level (k = 1)'], a: 0, why: 'Two in k = 0, two in k = 1, and the fifth in k = 2.' },
    { q: 'Two electrons can never be in the same orbital.', a: false, why: 'They can, with opposite spins. The exclusion principle forbids the same complete state, spin included.' },
    { q: 'The Fermi energy of copper (7 eV) compared with k_BT at room temperature (0.025 eV) means that…', choices: ['only electrons near the top of the sea can take up heat', 'all the electrons are thermally agitated', 'copper is a superconductor', 'the electrons are at rest'], a: 0, why: 'Deeper electrons would need to jump into levels that are already full.' },
    { q: 'If electrons were bosons…', choices: ['they would all crowd into the 1s level and there would be no shell structure or chemistry as we know it', 'atoms would be larger', 'nothing would change', 'atoms could not form at all'], a: 0, why: 'Without exclusion nothing stops every electron from occupying the lowest state.' }
  ],
  problems: [
    { q: 'Sodium has 2.65×10²⁸ free electrons per cubic metre. What is its Fermi energy, in eV?', answer: 3.24, unit: 'eV', tol: 0.02, hint: 'E_F = (ħ²/2m)(3π²n)^{2/3}.',
      steps: ['$3\\pi^2 n = 7.85\\times10^{29}$ m⁻³; to the power 2/3: $8.51\\times10^{19}$ m⁻².', '$E_F = 6.11\\times10^{-39}\\times8.51\\times10^{19} = 5.20\\times10^{-19}$ J = 3.24 eV.'] },
    { q: 'Twenty spin-½ electrons fill a harmonic well whose levels are 0.1 eV apart. What is the total energy of the ground state, in eV?', answer: 10, unit: 'eV', tol: 0.01, hint: 'E = N²ħω/4.',
      steps: ['$E = 20^2\\times0.1/4 = 10$ eV (two electrons in each of the levels k = 0 … 9).'] }
  ],
  applications: [
    'Semiconductors and transistors: electrons fill energy bands two per state, and whether a solid conducts depends on whether its top band is full ([[semiconductors-feyn]]).',
    'White dwarfs are held up by electron degeneracy pressure; neutron stars by neutron degeneracy pressure together with nuclear forces.',
    'Chemistry: valence, bonding and the shapes of molecules all follow from electrons pairing up two per orbital.',
    'The nuclear shell model: protons and neutrons also fill levels by the exclusion principle, giving the magic numbers 2, 8, 20, 28, 50, 82 and 126.'
  ],
  history: 'Edmund Stoner counted the electrons in subshells in 1924, and Wolfgang Pauli stated the exclusion principle in 1925 (Nobel Prize 1945). In 1926 Heisenberg and Dirac connected it with amplitudes that change sign when two electrons are swapped, and Fermi and Dirac worked out the statistics. Arnold Sommerfeld described the electrons of metals as a Fermi gas in 1927–28; Subrahmanyan Chandrasekhar found the mass limit of white dwarfs in 1930–31 (Nobel Prize 1983); Freeman Dyson and Andrew Lenard proved the stability of matter in 1967.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 4 (Identical Particles), section 7 "The exclusion principle" — why two fermions cannot share a state, and what follows for atoms and chemistry.',
    'Vol. III, ch. 19 (The Hydrogen Atom and The Periodic Table) — the elements built up electron by electron.'
  ],
  sim: 'qb-fill'
},

{
  id: 'quantum-reality', parent: 'amplitudes-topic', title: 'Probability, uncertainty and reality', level: 2,
  short: 'The rules of quantum mechanics predict probabilities — and nothing more about single events — and every experiment agrees with them. Bell\'s theorem (1964) and the experiments since show that no "hidden instructions" carried by the particles can reproduce the predictions. Feynman\'s stance: nature is what it is; our job is to find out how it behaves, not to make it seem reasonable.',
  keywords: ['interpretation', 'reality', 'perception', 'measurement', 'observer', 'hidden variables', 'Bell inequality', 'CHSH', 'entanglement', 'EPR', 'locality', 'determinism', 'Copenhagen', 'many worlds', 'decoherence', 'Nobel 2022'],
  prereq: ['watching-electrons', 'probability-amplitudes', 'uncertainty-feyn'],
  related: ['identical-particles', 'spin-half', 'quantum-computing-origin', 'doubt-and-uncertainty', 'seeking-new-laws', 'past-and-future'],
  body: `
Where *was* the electron before it reached the screen — is its path merely unknown, or does it not exist? Here is what the rules say, what they do not, what experiments have settled, and Feynman's attitude.

### What the rules say
Given how an experiment is set up, quantum mechanics predicts the [[?probability]] of each result — in the best cases to better than a part in a billion — but not which result a single run will give. Nobody, with any instrument or theory yet found, can say where one electron will land; only the distribution of many landings is fixed. Feynman stressed that this is not a matter of better instruments, and the fringes show that the randomness is not simple ignorance: ignorance of the slit would make the probabilities add.

### What they do not say
The rules say nothing about which slit an unwatched electron used — any way of finding out changes the experiment — and offer no everyday picture of the electron in flight: not a ball on a path, and not a spread-out cloud, since every detection finds it whole at one point. The [[?amplitude|amplitudes]] are a recipe for probabilities; whether they are "real things" is exactly what people still argue about.

### Perception: records, not minds
Everything anyone has ever observed is a record: a click, a spot, a pointer, a memory. Interference vanishes when such a record exists somewhere — a scattered photon, a recoiling wall — not when a person sees it ([[watching-electrons]]). Air molecules and light constantly record where big things are, which is why a football never shows fringes (decoherence). No mind is needed.

### Could there be hidden instructions?
Perhaps each particle carries sealed instructions that fix every result, and the randomness is only our ignorance of them — Einstein, Podolsky and Rosen argued in 1935 that something of the kind must be true. In 1964 John Bell showed that the idea can be tested. Pairs of photons are emitted together and sent to two polarisers far apart, set at angles differing by $\\theta$; each photon passes or not. Quantum mechanics predicts that the two results agree with probability $\\cos^2\\theta$. In any theory where each photon carries its own instructions and no influence travels faster than light, a combination $S$ of four settings (the form of Clauser, Horne, Shimony and Holt) cannot exceed 2. Quantum mechanics gives $2\\sqrt2 = 2.83$.

| Polarisers apart | Quantum: $\\cos^2\\theta$ | A simple instruction model: $1 - \\theta/90°$ |
|---|---|---|
| 0° | 1 | 1 |
| 22.5° | 0.854 | 0.750 |
| 45° | 0.5 | 0.5 |
| 67.5° | 0.146 | 0.250 |
| 90° | 0 | 0 |

Experiments since 1972 — Freedman and Clauser, Aspect's group (1982, switching the settings in flight), Zeilinger's group, and three loophole-free tests in 2015 — all agree with quantum mechanics and break the inequality; Aspect, Clauser and Zeilinger shared the 2022 Nobel Prize in Physics. The simulation runs a Bell test on quantum mechanics and on two instruction models.

### What survives
Each observer alone sees a random sequence, half passing, whatever the other does — so the correlation carries no signal, and relativity is safe. What cannot survive is the pair "every result was fixed in advance by the particle" and "no influence faster than light". Physicists differ over which to give up; the main interpretations — Copenhagen (Bohr, Heisenberg), pilot waves (de Broglie 1927, Bohm 1952), many worlds (Everett 1957), spontaneous collapse (Ghirardi, Rimini and Weber 1986) — predict the same results for every experiment done so far.

### Feynman's view
Feynman took no side among interpretations in his lectures; his position was more basic: physics must find out how nature behaves, and experiment is the only judge. If the answer looks absurd by the standards of everyday life, that says something about everyday life — our intuitions were formed by big, slow things — not about nature. In 1981, asking what kind of computer could imitate nature, he worked through a two-photon correlation experiment of just this kind to show that no local classical machine can reproduce quantum probabilities — one of the seeds of quantum computing ([[quantum-computing-origin]]).

> [!key] Quantum mechanics predicts probabilities, and they have never failed. Single events are unpredictable, and Bell tests show that the randomness is not hidden instructions carried along by the particles. What reality "is" beneath the rules remains open; what it does is known with astonishing precision.
`,
  ideas: [
    'Quantum mechanics predicts the probabilities of results exactly, but not the result of a single run.',
    'The randomness is not ignorance of a hidden path: ignorance would make probabilities add, and they do not.',
    'Interference is destroyed by the existence of a record anywhere, not by a mind looking at it.',
    'Bell\'s theorem: any theory of local hidden instructions obeys S ≤ 2; quantum mechanics gives 2√2, and experiments since 1972 agree with quantum mechanics.',
    'Feynman\'s stance: describe how nature behaves, judged by experiment, however strange it seems to intuition built on everyday objects.'
  ],
  pitfalls: [
    'The electron really went through one slit; we just do not know which — Then the probabilities would add, P₁ + P₂, and there would be no fringes.',
    'A Bell test lets one observer send messages to the other faster than light — Each observer\'s own results are 50/50 random whatever the other does; the correlation only appears when the records are compared.',
    'Quantum mechanics says reality is created by consciousness — Nothing in the rules needs a mind; any physical record, such as a scattered photon, is enough to make probabilities add.'
  ],
  formulas: [
    {
      name: 'Agreement of two polarisers on an entangled photon pair (quantum)',
      expr: 'P = cos(theta)^2', tex: 'P = \\cos^2\\theta',
      vars: {
        P: { name: 'probability that the two results agree' },
        theta: { name: 'angle between the two polarisers', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'For photon pairs in the state that gives perfect agreement at equal settings.',
      stories: { P: 'The polarisers are {theta} apart. How often do the two photons of a pair give the same result?', theta: 'At what angle between the polarisers do the results agree with probability {P}?' }
    },
    {
      name: 'Agreement in a simple hidden-instruction model',
      expr: 'P = 1 - 2*theta/pi', tex: 'P = 1 - \\dfrac{2\\theta}{\\pi}',
      vars: {
        P: { name: 'probability that the two results agree' },
        theta: { name: 'angle between the two polarisers', q: 'angle', unit: '°', value: 22.5, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'Each pair carries a shared hidden polarisation; each photon passes if its polariser lies within 45° of it. Equal to cos²θ at 0°, 45° and 90° only.',
      stories: { P: 'In the instruction model, how often do the results agree when the polarisers are {theta} apart?' }
    },
    {
      name: 'The CHSH combination for equally spaced settings',
      expr: 'S = 3*cos(2*theta) - cos(6*theta)', tex: 'S = 3\\cos 2\\theta - \\cos 6\\theta',
      vars: {
        S: { name: 'Bell–CHSH value (local instructions: at most 2)', signed: true },
        theta: { name: 'spacing of the four settings a, b, a′, b′', q: 'angle', unit: '°', value: 15, min: 0, max: 45, tex: '\\theta' }
      },
      note: 'S = E(a,b) + E(a′,b) + E(a′,b′) − E(a,b′), with E = cos 2Δ the quantum correlation. At θ = 22.5° it reaches 2√2 = 2.83.',
      stories: { S: 'The settings a, b, a′, b′ are spaced {theta} apart. What value of S does quantum mechanics predict?' }
    }
  ],
  examples: [
    {
      title: 'The 22.5° test',
      q: 'The polarisers are 22.5° apart and 10 000 pairs are measured. How many agreements does quantum mechanics predict, and how many the simple instruction model? Is the difference measurable?',
      steps: [
        'Quantum: $\\cos^2 22.5° = 0.854$, so about 8540 agreements.',
        'Instruction model: $1 - 22.5/90 = 0.75$, so about 7500.',
        'The statistical scatter of such a count is about $\\sqrt{10\\,000\\times0.25} = 50$: the difference of 1040 is some 20 times larger.'
      ],
      a: '8540 against 7500 — easily told apart.'
    },
    {
      title: 'Computing S',
      q: 'Settings a = 0°, b = 22.5°, a′ = 45°, b′ = 67.5°. Using the quantum correlation E = cos 2Δ (Δ the angle between the two polarisers), compute S = E(a,b) − E(a,b′) + E(a′,b) + E(a′,b′).',
      steps: [
        '$E(a,b) = \\cos 45° = 0.707$; $E(a,b\') = \\cos 135° = -0.707$.',
        '$E(a\',b) = \\cos(-45°) = 0.707$; $E(a\',b\') = \\cos(-45°) = 0.707$.',
        '$S = 0.707 + 0.707 + 0.707 + 0.707 = 2.83$, above the limit 2 for any theory of local instructions. The simple instruction model gives exactly 2.'
      ],
      a: 'S = 2√2 ≈ 2.83.'
    }
  ],
  quiz: [
    { q: 'In a Bell experiment, each observer looking only at her own results sees…', choices: ['half the photons pass, at random, whatever the other observer does', 'a pattern that depends on the other observer\'s setting', 'all photons pass', 'a message from the other side'], a: 0, why: 'The correlation appears only when the two records are compared, so no signal can be sent.' },
    { q: 'The violation of Bell\'s inequality rules out…', choices: ['every theory in which each particle carries its own instructions and no influence travels faster than light', 'quantum mechanics', 'relativity', 'all hidden structure of any kind'], a: 0, why: 'Bell\'s theorem concerns local hidden variables; non-local ones, such as pilot waves, are not excluded.' },
    { q: 'The fringes of the two-slit experiment disappear only when a conscious observer looks at the which-slit detector.', a: false, why: 'Any record is enough — a photon that scattered off into the walls destroys the fringes as well.' },
    { q: 'The polarisers are 60° apart. What is the quantum probability that the results agree?', choices: ['0.25', '0.33', '0.5', '0.75'], a: 0, why: 'cos² 60° = 0.25. The simple instruction model would give 1 − 60/90 = 0.33.' },
    { q: 'Feynman\'s attitude to the strangeness of quantum mechanics was…', choices: ['to accept what experiments show and describe it precisely, even when it defies intuition', 'that it must be wrong because it is absurd', 'that it describes only our knowledge, not nature', 'that a better theory would soon restore certainty'], a: 0, why: 'For him experiment was the judge; intuition built on everyday objects has no authority over atoms.' }
  ],
  problems: [
    { q: 'What is the quantum probability that the two photons of a pair agree when the polarisers are 30° apart?', answer: 0.75, tol: 0.01, hint: 'cos²θ.',
      steps: ['$\\cos^2 30° = 0.866^2 = 0.75$.'] },
    { q: 'With four settings spaced 15° apart, what value of S does quantum mechanics predict?', answer: 2.60, tol: 0.01, hint: 'S = 3 cos 2θ − cos 6θ.',
      steps: ['$3\\cos 30° - \\cos 90° = 3\\times0.866 - 0 = 2.60$ — still above 2, but less than the best, 2.83 at 22.5°.'] }
  ],
  applications: [
    'Quantum key distribution with entangled photons: a Bell test checks that no eavesdropper has tampered with the key.',
    'Random numbers certified by a Bell test to have been unpredictable, even to the maker of the device.',
    'Quantum computers exploit exactly the correlations that no local classical machine can imitate.'
  ],
  history: 'Einstein, Boris Podolsky and Nathan Rosen published their argument in 1935; David Bohm recast it with spins in 1951. John Bell proved his theorem in 1964, and John Clauser, Michael Horne, Abner Shimony and Richard Holt turned it into a practical test in 1969. Stuart Freedman and John Clauser made the first test in 1972; Alain Aspect, Jean Dalibard and Gérard Roger changed the settings during the photons\' flight in 1982; in 2015 groups in Delft, Vienna and Boulder closed the main loopholes in single experiments. Aspect, Clauser and Zeilinger received the 2022 Nobel Prize in Physics.',
  sources: [
    '*The Character of Physical Law*, lecture 6, "Probability and Uncertainty — the Quantum Mechanical View of Nature" — the two-slit experiment for a general audience, why single events cannot be predicted, and his view that nature must be taken as experiment shows it.',
    '*The Feynman Lectures on Physics*, Vol. III, ch. 1 (Quantum Behavior) — why nobody can predict where a single electron will land.',
    'Vol. III, ch. 2 (The Relation of Wave and Particle Viewpoints), section 6 "Philosophical implications" — what the uncertainty principle does and does not mean for prediction and for questions no experiment can test.',
    '*QED: The Strange Theory of Light and Matter*, ch. 1 — the theory is to be judged by its agreement with experiment, however strange it seems.',
    '"Simulating Physics with Computers" (talk 1981; International Journal of Theoretical Physics, 1982) — a two-photon correlation experiment showing that no local classical computer can reproduce quantum probabilities.'
  ],
  sim: 'qb-bell'
}

);
