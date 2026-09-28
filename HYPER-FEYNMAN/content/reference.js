/* HYPER-FEYNMAN · content/reference.js — the reference concept for Hyper Feynman authors:
 * its depth, tone, [[?term]] marking, sources, numbers and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'bullets-waves-electrons', parent: 'two-slits', title: 'Bullets, waves and electrons', level: 2,
  short: 'Fire bullets at two slits and they pile up behind each slit; send water waves and they interfere; send electrons one at a time and each arrives as a single lump — yet together they build an interference pattern. The rule that describes it: add amplitudes, then square.',
  keywords: ['two-slit experiment', 'double slit', 'interference', 'electron', 'probability amplitude', 'wave–particle', 'quantum behaviour', 'Young', 'fringes', 'de Broglie wavelength', 'one electron at a time'],
  prereq: ['interference-feyn', 'probability-feyn', 'physics:double-slit'],
  related: ['watching-electrons', 'probability-amplitudes', 'uncertainty-feyn', 'wave-and-particle', 'arrow-rule', 'quantum-reality', 'physics:wave-particle-duality', 'math:complex-numbers'],
  body: `
Feynman opened his lectures on quantum mechanics with a single experiment, because it holds the whole puzzle in a nutshell. Picture a wall with two narrow slits, a source on one side and a detector that can be moved along a screen on the other. We try it three times: with bullets, with water waves, and with electrons.

### Bullets: lumps that add
A gun that sprays bullets in random directions sits in front of the wall; the detector is a box of sand. Bullets always arrive in whole lumps — never half a bullet. With only slit 1 open, they land in a broad heap behind slit 1, with a [[?probability]] per unit length $P_1(x)$; with only slit 2 open, a heap $P_2(x)$ behind slit 2. With both open, each bullet goes through one slit or the other, so the chances simply add:

$$P_{12} = P_1 + P_2$$

No interference: opening a second slit can only *increase* the number arriving anywhere.

### Water waves: intensities that do not add
Now a wave source in a pool. What arrives is not lumps but an intensity that can take any value. With one slit open, the wave spreads out from it smoothly. With both open, the two circular waves overlap: where crests meet crests the motion is strong, where crests meet troughs it cancels. The heights $h_1$ and $h_2$ of the two waves add, and the intensity is the square of the total height:

$$I_{12} = |h_1 + h_2|^2 = I_1 + I_2 + 2\\sqrt{I_1 I_2}\\cos\\delta$$

where $\\delta$ is the [[?phase]] difference between the two waves at that point. The last term is the **interference**: at some places $I_{12}$ is four times $I_1$, at others zero — so opening the second slit can make the water *calmer*.

### Electrons: lumps that interfere
Now an electron gun, and a detector — a Geiger counter or a screen that flashes — that clicks when an electron arrives. The clicks are all equally loud: electrons, like bullets, arrive whole. Each click happens at one place. Turn the rate down until the electrons come one at a time, a second apart, and let them pile up. With one slit open, a smooth heap. With both open, the heap is striped: the curve of $P_{12}$ has exactly the fringes of the water waves, with places that get *fewer* electrons when the second slit is opened than when it was closed.

So $P_{12} \\neq P_1 + P_2$. The statement "each electron goes through slit 1 or through slit 2" cannot be true in the ordinary sense — if it were, the chances would add, as they did for bullets.

### The rule that works
Nature follows a rule we can state exactly even though nobody can say *why* it is so. For each way an event can happen, there is a [[?amplitude|probability amplitude]] — a [[?complex-number|complex number]], which you can draw as an arrow. For the electron arriving at $x$ there is an amplitude $\\phi_1$ for the way through slit 1 and $\\phi_2$ for the way through slit 2. When the ways cannot be told apart, their amplitudes add, and the probability is the [[?absolute-square|absolute square]] of the sum:

$$P_{12} = |\\phi_1 + \\phi_2|^2 = P_1 + P_2 + 2\\sqrt{P_1P_2}\\cos\\delta$$

The arrow for each path turns as the electron travels, one full turn per wavelength of path, so the angle between the two arrows is set by the difference of the path lengths: $\\delta = 2\\pi\\, d\\sin\\theta/\\lambda$. Where the paths differ by a whole number of wavelengths, the arrows point the same way and add; where they differ by half a wavelength, they cancel.

### The wavelength of an electron
The turning rate — the wavelength — is set by the electron's momentum through de Broglie's relation $\\lambda = h/p$. An electron accelerated through 50 volts has $\\lambda \\approx 0.17$ nm, about the spacing of atoms in a crystal; at 50 kV, about 5 pm. With slits a micrometre apart, the fringes are a few micrometres apart on a screen a metre away — invisible to the eye, which is why, in his lectures, Feynman presented it as an experiment that had not been done in exactly this form.

| Experiment | What arrives | With both slits open |
|---|---|---|
| Bullets | whole lumps | $P_{12} = P_1 + P_2$ — no fringes |
| Water waves | any intensity | $I_{12} = \\lvert h_1 + h_2\\rvert^2$ — fringes |
| Electrons | whole lumps | $P_{12} = \\lvert\\phi_1 + \\phi_2\\rvert^2$ — fringes, built dot by dot |

> [!key] Electrons arrive like particles, with a probability that is distributed like the intensity of a wave. Add the amplitudes for the indistinguishable ways, then square — never add the probabilities.

What happens if we set up a light to *see* which slit each electron goes through is the subject of the next page, [[watching-electrons]]; how the same rule works for light is the story of QED, beginning with [[arrow-rule]].
`,
  ideas: [
    'Bullets arrive in lumps and their probabilities add: P₁₂ = P₁ + P₂.',
    'Waves arrive with any intensity; their heights add, so intensities interfere: I₁₂ = |h₁ + h₂|².',
    'Electrons arrive in lumps, but their probabilities interfere like waves.',
    'Each way gets a complex amplitude; for indistinguishable ways the amplitudes add, and the probability is the absolute square of the total.',
    'The phase difference between two paths is 2π times the path difference divided by the de Broglie wavelength λ = h/p.'
  ],
  pitfalls: [
    'Each electron splits and half goes through each slit — Every detector click is a whole electron; nobody ever finds half an electron at a slit.',
    'The fringes come from electrons in the beam interfering with each other — The pattern builds up the same way when the electrons come one at a time, seconds apart.',
    'Quantum probabilities are just ordinary ignorance about which slit was used — Ordinary ignorance would make probabilities add (P₁ + P₂); the fringes show that they do not.'
  ],
  formulas: [
    {
      name: 'Two indistinguishable ways: add the amplitudes, then square',
      expr: 'P12 = P1 + P2 + 2*sqrt(P1*P2)*cos(delta)', tex: 'P_{12} = P_1 + P_2 + 2\\sqrt{P_1P_2}\\cos\\delta',
      vars: {
        P12: { name: 'probability with both slits open (relative)', q: false, unit: 'relative', tex: 'P_{12}' },
        P1: { name: 'probability with slit 1 alone (relative)', q: false, unit: 'relative', value: 1, tex: 'P_1' },
        P2: { name: 'probability with slit 2 alone (relative)', q: false, unit: 'relative', value: 1, tex: 'P_2' },
        delta: { name: 'phase difference between the two ways', q: 'angle', unit: 'rad', value: 1, tex: '\\delta' }
      },
      note: 'The same as |φ₁ + φ₂|² for arrows of lengths √P₁ and √P₂ at angle δ. With δ = 0 and equal P, four times one slit; with δ = π, zero.',
      stories: {
        P12: 'Slit 1 alone gives {P1} and slit 2 alone gives {P2} at a point where the arrows differ in phase by {delta}. What do both slits give?',
        delta: 'Each slit alone gives {P1}; both together give {P12}. What is the phase difference of the arrows at that point?'
      }
    },
    {
      name: 'Phase difference from the path difference',
      expr: 'delta = 2*pi*d*sin(theta)/lambda', tex: '\\delta = \\dfrac{2\\pi\\, d\\sin\\theta}{\\lambda}',
      vars: {
        delta: { name: 'phase difference', q: 'angle', unit: 'rad', tex: '\\delta' },
        d: { name: 'distance between the slits', q: 'length', unit: 'µm', value: 1 },
        theta: { name: 'angle from the centre line', q: 'angle', unit: '°', value: 0.2, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 5, tex: '\\lambda' }
      },
      note: 'For a distant screen; d sin θ is the extra distance along the longer path.',
      stories: { theta: 'Slits {d} apart, wavelength {lambda}: at what angle are the arrows {delta} out of phase?' }
    },
    {
      name: 'Spacing of the fringes',
      expr: 'dx = lambda*L/d', tex: '\\Delta x = \\dfrac{\\lambda L}{d}',
      vars: {
        dx: { name: 'distance between bright fringes', q: 'length', unit: 'mm', tex: '\\Delta x' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' },
        L: { name: 'distance from slits to screen', q: 'length', unit: 'm', value: 2 },
        d: { name: 'distance between the slits', q: 'length', unit: 'mm', value: 0.2 }
      },
      note: 'Small angles (Δx ≪ L).',
      stories: { dx: 'Light of {lambda} passes two slits {d} apart onto a screen {L} away. How far apart are the bright fringes?', d: 'Fringes {dx} apart appear on a screen {L} from two slits lit with {lambda}. How far apart are the slits?' }
    },
    {
      name: 'The wavelength of an electron (de Broglie)',
      expr: 'lambda = h/sqrt(2*m*E)', tex: '\\lambda = \\dfrac{h}{p} = \\dfrac{h}{\\sqrt{2mE}}',
      vars: {
        lambda: { name: 'de Broglie wavelength', q: 'length', unit: 'nm', tex: '\\lambda' },
        h: { const: 'h' },
        m: { const: 'me', name: 'mass of the particle', tex: 'm' },
        E: { name: 'kinetic energy', q: 'energy', unit: 'eV', value: 50 }
      },
      note: 'Non-relativistic: fine below about 10 keV for electrons (at 50 keV the correction is about 2 %).',
      stories: { lambda: 'What is the wavelength of an electron with {E} of kinetic energy?', E: 'What kinetic energy gives an electron a wavelength of {lambda}?' }
    }
  ],
  examples: [
    {
      title: 'Fringes that make the second slit darken the screen',
      q: 'At a certain point each slit alone gives 100 counts a minute. What does the detector count with both open where the phase difference is 0, π/2, 2π/3 and π?',
      steps: [
        'Use $P_{12} = P_1 + P_2 + 2\\sqrt{P_1P_2}\\cos\\delta = 200 + 200\\cos\\delta$.',
        '$\\delta = 0$: 400; $\\delta = \\pi/2$: 200; $\\delta = 2\\pi/3$: $200 - 100 = 100$; $\\delta = \\pi$: 0.',
        'At $\\delta = 2\\pi/3$ opening the second slit leaves the count unchanged at 100; beyond it, opening a slit *reduces* the count.'
      ],
      a: '400, 200, 100 and 0 counts a minute.'
    },
    {
      title: 'How big is an electron\'s wavelength?',
      q: 'Find the de Broglie wavelength of an electron accelerated through 50 V.',
      steps: [
        'Kinetic energy $E = 50\\ \\mathrm{eV} = 50 \\times 1.602\\times10^{-19} = 8.01\\times10^{-18}$ J.',
        '$p = \\sqrt{2mE} = \\sqrt{2 \\times 9.109\\times10^{-31} \\times 8.01\\times10^{-18}} = 3.82\\times10^{-24}$ kg·m/s.',
        '$\\lambda = h/p = 6.626\\times10^{-34}/3.82\\times10^{-24} = 1.73\\times10^{-10}$ m.'
      ],
      a: 'About 0.17 nm — comparable with the spacing of atoms, which is why crystals diffract electrons.'
    },
    {
      title: 'Why nobody saw electron fringes by eye',
      q: 'Electrons of wavelength 5 pm pass slits 1 µm apart. How far apart are the fringes on a screen 1 m away? And for light of 600 nm through slits 0.2 mm apart onto a screen 2 m away?',
      steps: [
        'Electrons: $\\Delta x = \\lambda L/d = 5\\times10^{-12} \\times 1/10^{-6} = 5\\times10^{-6}$ m = 5 µm.',
        'Light: $\\Delta x = 600\\times10^{-9} \\times 2/(0.2\\times10^{-3}) = 6\\times10^{-3}$ m = 6 mm.',
        'Electron fringes are a thousand times finer; experimenters magnify them with electron lenses.'
      ],
      a: '5 µm for the electrons, 6 mm for the light.'
    }
  ],
  quiz: [
    { q: 'With bullets, opening the second slit can…', choices: ['only increase the number arriving at any point', 'decrease the number at some points', 'make a striped pattern', 'change the size of each bullet'], a: 0, why: 'Bullet probabilities add: P₁₂ = P₁ + P₂ ≥ P₁ everywhere.' },
    { q: 'Electrons are sent one at a time, a second apart. The pattern that builds up with both slits open…', choices: ['shows interference fringes', 'is the sum of the one-slit heaps', 'is uniform', 'depends on how fast they are sent'], a: 0, why: 'The interference is a property of each electron\'s amplitudes, not of electrons meeting each other.' },
    { q: 'What is added for two indistinguishable ways an event can happen?', choices: ['the probability amplitudes', 'the probabilities', 'the squares of the probabilities', 'the wavelengths'], a: 0, why: 'Add the arrows (amplitudes) first; the probability is the square of the length of the sum.' },
    { q: 'Where the two paths differ by exactly half a wavelength, with equal P₁ and P₂…', choices: ['no electrons arrive', 'twice as many arrive as through one slit', 'four times as many arrive', 'the electrons slow down'], a: 0, why: 'The arrows are opposite (δ = π): they cancel, so P₁₂ = 0.' },
    { q: 'Doubling the speed of the electrons (non-relativistic) makes the fringes…', choices: ['half as far apart', 'twice as far apart', 'unchanged', 'four times as far apart'], a: 0, why: 'λ = h/p halves when p doubles, and the spacing λL/d halves with it.' }
  ],
  problems: [
    { q: 'An electron has a de Broglie wavelength of 0.1 nm. What kinetic energy does it have?', answer: 150, unit: 'eV', tol: 0.02, hint: 'E = p²/2m with p = h/λ.',
      steps: ['$p = h/\\lambda = 6.63\\times10^{-34}/10^{-10} = 6.63\\times10^{-24}$ kg·m/s.', '$E = p^2/2m = (6.63\\times10^{-24})^2/(2 \\times 9.11\\times10^{-31}) = 2.41\\times10^{-17}$ J = 150 eV.'] },
    { q: 'With P₁ = 1 and P₂ = 4 (in the same relative units), what is the smallest value P₁₂ can take anywhere on the screen?', answer: 1, unit: 'relative', tol: 0.01, hint: 'The arrows have lengths √P₁ = 1 and √P₂ = 2.',
      steps: ['Arrows of lengths 1 and 2 pointing opposite ways leave an arrow of length 1; squared, 1.', 'In line they would give 3, squared 9. Unequal slits never give complete darkness.'] }
  ],
  applications: [
    'Electron microscopes and electron diffraction use the wavelength of electrons — a few picometres — to see atoms.',
    'Neutron and atom interferometers measure gravity and rotation with the same two-path interference.',
    'Try the two-slit experiment yourself, one electron at a time, in [the two-slit lab](#/tools/slits).'
  ],
  history: 'Thomas Young showed interference of light through two slits around 1801–03. Louis de Broglie proposed in 1924 that electrons have a wavelength h/p, and Clinton Davisson and Lester Germer confirmed it in 1927 by reflecting electrons from a nickel crystal. When Feynman gave his lectures in 1961–63 he presented the two-slit experiment for electrons largely as a thought experiment; Claus Jönsson had just made real slits fine enough for electrons (1961), Pier Giorgio Merli, Gian Franco Missiroli and Giulio Pozzi recorded single electrons building up the fringes in 1974, and Akira Tonomura\'s group filmed the build-up dot by dot in 1989.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. III, ch. 1 (Quantum Behavior), sections 1–5: bullets, water waves and electrons at two slits.',
    'Vol. I, ch. 37 (Quantum Behavior) — the same lecture as it first appeared in volume I.',
    '*The Character of Physical Law*, lecture 6, "Probability and Uncertainty — the Quantum Mechanical View of Nature" (Messenger Lectures, Cornell, 1964; filmed by the BBC).',
    '*QED: The Strange Theory of Light and Matter*, ch. 1 — the same rule told with stopwatch arrows for light.'
  ],
  sim: ['ref-twoslit', 'ref-slit-arrows']
}

);
