/* HYPER-PHYSICS · content/quantum-mechanics.js — wavefunctions, the Schrödinger
 * equation and its classic solutions: the box, tunnelling, the harmonic oscillator
 * and the hydrogen atom. */
Hyper.add(

{
  id: 'wavefunction', parent: 'quantum-mechanics', title: 'The wavefunction', level: 2,
  short: 'Quantum mechanics describes a particle by a complex wave ψ spread through space. Its squared size |ψ|² gives the probability of finding the particle at each place.',
  keywords: ['wavefunction', 'wave function', 'psi', 'ψ', 'probability density', 'probability amplitude', 'Born rule', 'normalization', 'expectation value', 'superposition', 'phase', 'collapse', 'measurement', 'plane wave'],
  prereq: ['wave-particle-duality', 'uncertainty-principle', 'math:probability-basics', 'math:complex-numbers'],
  related: ['schrodinger-equation', 'particle-in-a-box', 'math:eulers-formula', 'math:definite-integral'],
  body: `
Classical mechanics describes a particle by its position and velocity at each moment. Quantum mechanics describes it by a **wavefunction** $\\psi(x, t)$: a complex number at every point of space, which changes in time according to the [[schrodinger-equation|Schrödinger equation]]. Everything that can be known about the particle is in $\\psi$, and the results of measurements are extracted from it by definite rules.

### Born's rule
The wavefunction is not a wave you could see, and the particle is not smeared out along it. Its meaning, proposed by Max Born in 1926, is statistical: $|\\psi|^2$ is the **probability density** for finding the particle, so

$$P(a \\le x \\le b) = \\int_a^b |\\psi(x,t)|^2\\, dx$$

where $|\\psi|^2 = \\psi^*\\psi$ is the squared modulus of the complex number. The particle must be somewhere, so the total probability is one and the wavefunction is **normalized**:

$$\\int_{-\\infty}^{\\infty} |\\psi|^2\\, dx = 1$$

In one dimension $|\\psi|^2$ therefore has units of 1/length, and $\\psi$ itself units of $1/\\sqrt{\\text{length}}$.

### Why complex numbers?
A free particle with a definite momentum $p$ and energy $E$ is described by a plane wave

$$\\psi = A\\, e^{i(kx - \\omega t)}, \\qquad p = \\hbar k, \\quad E = \\hbar\\omega$$

(see [[math:eulers-formula|Euler's formula]]). Its probability density $|A|^2$ is the same everywhere — no position is preferred, just as the [[uncertainty-principle|uncertainty principle]] demands for a perfectly sharp momentum. The momentum is recorded in the **phase**: how fast the complex number turns as you move along $x$. Phases are what interfere. Multiplying the whole wavefunction by the same phase factor $e^{i\\alpha}$ changes nothing measurable, but the *relative* phase between two parts of a wavefunction changes everything.

### Superposition and interference
If $\\psi_1$ and $\\psi_2$ are possible states, so is any combination $a\\psi_1 + b\\psi_2$. Its probability density contains a cross term,

$$|a\\psi_1 + b\\psi_2|^2 = |a\\psi_1|^2 + |b\\psi_2|^2 + 2\\,\\mathrm{Re}\\left(a^* b\\, \\psi_1^* \\psi_2\\right),$$

and that cross term is interference: it can add probability or remove it. That is why the two paths of the [[wave-particle-duality|double-slit experiment]] do not simply add.

### Averages and spreads
The **expectation value** of the position — the average over many measurements on identically prepared particles — is

$$\\langle x \\rangle = \\int x\\, |\\psi|^2\\, dx$$

and the standard deviation around it is the $\\Delta x$ of the uncertainty principle. Other quantities are found by letting operators act on $\\psi$; momentum, for instance, corresponds to $\\hat p = -i\\hbar\\, \\partial/\\partial x$, which pulls $\\hbar k$ out of a plane wave.

### Measurement
If a measurement finds the particle at some place, an immediate second measurement finds it there again: the wavefunction has become concentrated at that spot. This "collapse" is not described by the Schrödinger equation, and how best to understand it is still argued about. The rules for predicting results, however, are not in doubt; they have passed every experimental test.

### What makes a wavefunction acceptable
It must be single-valued and continuous, its slope must be continuous wherever the potential is finite, and it must be normalizable. Applied at the walls of a box or far from an atom, these innocent-looking conditions are exactly what pick out the allowed energies ([[particle-in-a-box]]).
`,
  ideas: [
    'A particle is described by a complex wavefunction ψ(x, t).',
    '|ψ|² is a probability density: integrated over a region, it gives the probability of finding the particle there.',
    'A wavefunction is normalized so that the total probability is 1.',
    'The phase of ψ carries momentum and causes interference; an overall phase has no effect.',
    'Superpositions are allowed, and their probabilities include interference terms.'
  ],
  pitfalls: [
    'ψ is the probability — The probability density is |ψ|²; ψ itself is a complex amplitude that can be negative or imaginary.',
    'The particle is spread out along the wavefunction — Every measurement finds the whole particle at one place; ψ tells where that is likely to be.',
    'Probabilities from two paths add — Amplitudes add, and the probability is the square of the sum, which includes interference.'
  ],
  formulas: [
    {
      name: 'Probability in the left part of a box',
      expr: 'P = x/L - sin(2*n*pi*x/L)/(2*n*pi)', tex: 'P = \\frac{x}{L} - \\frac{\\sin(2n\\pi x/L)}{2n\\pi}',
      vars: {
        P: { name: 'probability of finding the particle between 0 and x', q: 'ratio', unit: '%' },
        x: { name: 'position', q: 'length', unit: 'nm', value: 0.25 },
        L: { name: 'width of the box', q: 'length', unit: 'nm', value: 1 },
        n: { name: 'quantum number of the state', value: 1, int: true }
      },
      note: 'The integral of $|\\psi_n|^2 = (2/L)\\sin^2(n\\pi x/L)$ from 0 to $x$. A classical particle bouncing back and forth would give simply $x/L$.',
      practice: { unknowns: ['P', 'x'] },
      stories: {
        P: 'A particle is in state n = {n} of a box {L} wide. What is the probability of finding it between the left wall and {x}?',
        x: 'For state n = {n} of a box {L} wide, how far from the left wall must you look to have a probability {P} of finding the particle?'
      }
    },
    {
      name: 'Momentum of a plane wave',
      expr: 'p = hbar*k', tex: 'p = \\hbar k',
      vars: {
        p: { name: 'momentum', q: 'momentum', unit: 'kg·m/s' },
        hbar: { const: 'hbar' },
        k: { name: 'wave number (2π/λ)', q: 'wavenumber', unit: '1/nm', value: 10 }
      },
      stories: { p: 'A wavefunction winds its phase at a wave number of {k}. What momentum does it describe?', k: 'What wave number describes a particle with momentum {p}?' }
    }
  ],
  examples: [
    {
      title: 'Where is a particle in a box likely to be?',
      q: 'A particle is in the ground state of a box of width $L$, $\\psi = \\sqrt{2/L}\\,\\sin(\\pi x/L)$. What is the probability of finding it in the middle half, between $L/4$ and $3L/4$?',
      steps: [
        'Integrate $|\\psi|^2$: $\\;P(0 \\to x) = \\dfrac{x}{L} - \\dfrac{\\sin(2\\pi x/L)}{2\\pi}$.',
        '$P(0 \\to 3L/4) = 0.75 - \\dfrac{\\sin(3\\pi/2)}{2\\pi} = 0.75 + 0.159 = 0.909$.',
        '$P(0 \\to L/4) = 0.25 - \\dfrac{\\sin(\\pi/2)}{2\\pi} = 0.25 - 0.159 = 0.091$.',
        'Difference: $0.818$. A classical particle bouncing at constant speed would spend exactly half its time there.'
      ],
      a: 'About 82 % (classically 50 %).'
    },
    {
      title: 'Normalizing a wavefunction',
      q: 'A particle has $\\psi(x) = A\\,e^{-|x|/a}$. Find $A$, and the probability that the particle is within a distance $a$ of the origin.',
      steps: [
        'Normalize: $\\displaystyle\\int_{-\\infty}^{\\infty} A^2 e^{-2|x|/a}\\,dx = 2A^2 \\cdot \\frac{a}{2} = A^2 a = 1$, so $A = 1/\\sqrt a$.',
        'Probability within $|x| < a$: $\\displaystyle 2\\int_0^a \\frac{1}{a} e^{-2x/a}\\,dx = 1 - e^{-2}$.',
        '$1 - e^{-2} = 0.865$.'
      ],
      a: 'A = 1/√a; the probability is 1 − e⁻² ≈ 86 %.'
    }
  ],
  quiz: [
    { q: 'The probability density of finding a particle at $x$ is…', choices: ['ψ(x)', '|ψ(x)|²', 'the real part of ψ(x)', 'ψ(x)/x'], a: 1,
      why: 'Born\'s rule: the density is the squared modulus. ψ itself can be negative or complex.' },
    { q: 'Multiplying a whole wavefunction by a constant phase factor $e^{i\\alpha}$…', choices: ['changes every probability', 'changes nothing measurable', 'spoils the normalization', 'reverses the momentum'], a: 1,
      why: '$|e^{i\\alpha}\\psi|^2 = |\\psi|^2$. Only phase differences between parts of a wavefunction are observable.' },
    { q: 'For a particle with a perfectly definite momentum, $|\\psi|^2$ is the same everywhere.', a: true,
      why: 'A plane wave $Ae^{ikx}$ has $|\\psi|^2 = |A|^2$ at every $x$: sharp momentum, completely uncertain position.' },
    { q: 'Two paths lead to the same point with amplitudes of equal size but opposite sign. The probability of arriving there is…', choices: ['twice that for one path', 'the same as for one path', 'zero', 'four times that for one path'], a: 2,
      why: 'The amplitudes cancel, $|\\psi - \\psi|^2 = 0$: a dark fringe.' },
    { q: 'A normalized one-dimensional wavefunction has units of…', choices: ['1/m', '1/√m', 'm', 'none'], a: 1,
      why: '$\\int|\\psi|^2dx$ is a pure number, so $|\\psi|^2$ is per metre and $\\psi$ per square root of a metre.' }
  ],
  applications: [
    'Every prediction of quantum chemistry and solid-state physics is computed from wavefunctions.',
    'Electron-density maps from X-ray crystallography are measurements of |ψ|² summed over a molecule\'s electrons.',
    'Quantum computers manipulate the amplitudes and phases of many-particle wavefunctions directly.'
  ],
  history: 'Schrödinger introduced ψ in 1926, first hoping it described a smeared-out electron. Max Born proposed the probability interpretation the same year and received the Nobel Prize for it in 1954.',
  sim: 'qm-wavepacket'
},

{
  id: 'schrodinger-equation', parent: 'quantum-mechanics', title: 'The Schrödinger equation', level: 3,
  short: 'The wave equation of quantum mechanics: it tells a wavefunction how to evolve, and its standing-wave solutions give the allowed energies.',
  keywords: ['Schrödinger equation', 'Schrodinger equation', 'time-independent Schrödinger equation', 'Hamiltonian', 'stationary state', 'eigenvalue', 'energy eigenstate', 'potential well', 'classically forbidden', 'quantization', 'superposition', 'separation of variables'],
  prereq: ['wavefunction', 'de-broglie-wavelength', 'math:partial-derivatives', 'math:second-order-linear'],
  related: ['particle-in-a-box', 'quantum-tunneling', 'quantum-harmonic-oscillator', 'hydrogen-atom-quantum', 'math:wave-equation'],
  body: `
In 1926 Erwin Schrödinger found the equation that tells a matter wave how to evolve. For a particle of mass $m$ moving along $x$ with potential energy $V(x)$,

$$i\\hbar\\,\\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\,\\frac{\\partial^2 \\psi}{\\partial x^2} + V(x)\\,\\psi$$

It plays the part that $F = ma$ plays in classical mechanics: given the [[wavefunction]] now, it fixes the wavefunction at every later time.

### Where it comes from
It cannot be derived from classical physics, but it can be made plausible. A free particle with momentum $p = \\hbar k$ and energy $E = \\hbar\\omega$ is the plane wave $e^{i(kx - \\omega t)}$. One time derivative brings down $-i\\omega$ and two space derivatives $-k^2$, so

$$i\\hbar\\frac{\\partial \\psi}{\\partial t} = E\\,\\psi, \\qquad -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\psi}{\\partial x^2} = \\frac{p^2}{2m}\\,\\psi$$

The Schrödinger equation is energy conservation, $E = p^2/2m + V$, written for waves. Its real justification is that its predictions agree with experiment — spectacularly well.

### Stationary states
When $V$ does not depend on time there are special solutions in which space and time separate: $\\psi(x,t) = \\phi(x)\\, e^{-iEt/\\hbar}$, where $\\phi$ obeys the **time-independent Schrödinger equation**

$$-\\frac{\\hbar^2}{2m}\\frac{d^2\\phi}{dx^2} + V(x)\\,\\phi = E\\,\\phi$$

In such a state only the phase rotates; $|\\psi|^2$ never changes, which is why they are called **stationary states**. They are the energy levels of atoms, molecules and solids.

### Reading the equation
Rewrite it as $\\phi'' = -\\dfrac{2m}{\\hbar^2}(E - V)\\,\\phi$. The second derivative is the curvature of the graph of $\\phi$.

- Where $E > V$ — classically **allowed** — the curvature is opposite in sign to $\\phi$: the graph always bends back towards the axis, so it **oscillates**, with a local wavelength $\\lambda = h/\\sqrt{2m(E - V)}$. That is de Broglie's wavelength for the local kinetic energy: more kinetic energy, shorter waves.
- Where $E < V$ — classically **forbidden** — the curvature has the same sign as $\\phi$: the graph bends away from the axis and grows or dies away **exponentially**, over a length $\\delta = \\hbar/\\sqrt{2m(V - E)}$. The particle can be found there, with a probability that falls off quickly — the root of [[quantum-tunneling]].

For a bound particle $\\phi$ must die away on both sides. At most energies, a solution that decays on the left bends the wrong way somewhere and blows up on the right. Only at special energies does it turn back in just the right way on both sides. That is how the equation produces **quantized energies** — for the [[particle-in-a-box|box]], the [[quantum-harmonic-oscillator|harmonic oscillator]] and the [[hydrogen-atom-quantum|hydrogen atom]] — with no extra rules added.

### Superpositions move
The equation is **linear**: any sum of solutions is a solution. A mixture of two stationary states with energies $E_1$ and $E_2$ is not stationary. Its probability density sloshes back and forth at the frequency

$$f = \\frac{E_2 - E_1}{h}$$

— the frequency of the photon the atom emits when it drops from one state to the other. A sloshing charge cloud is an oscillating dipole, which is how the light is produced.

> [!note] In three dimensions $\\partial^2/\\partial x^2$ becomes the Laplacian $\\nabla^2$. For several particles, $\\psi$ depends on all their positions at once, which is why exact solutions exist only for the simplest systems and chemistry leans on computers.
`,
  ideas: [
    'The Schrödinger equation is energy conservation for waves: kinetic plus potential energy acting on ψ.',
    'In stationary states ψ = φ(x) e^(−iEt/ħ); |ψ|² does not change in time.',
    'Where E > V the wavefunction oscillates, faster where the kinetic energy is larger; where E < V it grows or decays exponentially.',
    'Requiring a bound wavefunction to die away on both sides allows only certain energies.',
    'Superpositions of different energies slosh at the frequency (E₂ − E₁)/h.'
  ],
  pitfalls: [
    'The Schrödinger equation gives the path of the particle — It gives the wavefunction, which yields probabilities; there is no path.',
    'The wavefunction must vanish wherever E < V — It decays exponentially but is not zero, except where V is infinite.',
    'Quantization is an extra assumption added to the equation — It follows from the equation plus the requirement that ψ stay finite and normalizable.'
  ],
  formulas: [
    {
      name: 'Local wavelength where E > V',
      expr: 'lambda = h/sqrt(2*me*(E - V))', tex: '\\lambda = \\frac{h}{\\sqrt{2m_e(E - V)}}',
      vars: {
        lambda: { name: 'local de Broglie wavelength', q: 'length', unit: 'nm' },
        h: { const: 'h' }, me: { const: 'me' },
        E: { name: 'total energy', q: 'energy', unit: 'eV', value: 5, signed: true },
        V: { name: 'potential energy there', q: 'energy', unit: 'eV', value: 1, signed: true }
      },
      note: 'For an electron; change the constant $m_e$ for another particle.',
      stories: {
        lambda: 'An electron with total energy {E} crosses a region where its potential energy is {V}. What is its wavelength there?',
        V: 'An electron with total energy {E} has a local wavelength of {lambda}. What is the potential energy there?'
      }
    },
    {
      name: 'Decay length where E < V',
      expr: 'delta = hbar/sqrt(2*me*(V - E))', tex: '\\delta = \\frac{\\hbar}{\\sqrt{2m_e(V - E)}}',
      vars: {
        delta: { name: 'distance over which ψ falls by a factor e', q: 'length', unit: 'nm' },
        hbar: { const: 'hbar' }, me: { const: 'me' },
        V: { name: 'potential energy there', q: 'energy', unit: 'eV', value: 5, signed: true },
        E: { name: 'total energy', q: 'energy', unit: 'eV', value: 1, signed: true }
      },
      stories: {
        delta: 'An electron with energy {E} meets a region where its potential energy is {V}. Over what distance does its wavefunction die away?',
        V: 'Inside a barrier an electron\'s wavefunction (energy {E}) falls off over {delta}. How high is the barrier?'
      }
    },
    {
      name: 'Sloshing frequency of a superposition',
      expr: 'f = (E2 - E1)/h', tex: 'f = \\frac{E_2 - E_1}{h}',
      vars: {
        f: { name: 'frequency of the oscillation', q: 'frequency', unit: 'THz' },
        E2: { name: 'energy of the higher state', q: 'energy', unit: 'eV', value: -3.4, signed: true },
        E1: { name: 'energy of the lower state', q: 'energy', unit: 'eV', value: -13.6, signed: true },
        h: { const: 'h' }
      },
      stories: { f: 'An atom is in a superposition of states with energies {E1} and {E2}. At what frequency does its charge cloud oscillate?' }
    }
  ],
  derivation: {
    title: 'Separating space and time',
    steps: [
      { text: 'Try a product of a function of $x$ and a function of $t$, $\\psi = \\phi(x)\\,T(t)$, and divide the Schrödinger equation by $\\phi T$:', tex: 'i\\hbar\\,\\frac{1}{T}\\frac{dT}{dt} = \\frac{1}{\\phi}\\left(-\\frac{\\hbar^2}{2m}\\frac{d^2\\phi}{dx^2} + V\\phi\\right)' },
      { text: 'The left side depends only on $t$ and the right side only on $x$, so both must equal the same constant. Call it $E$.', tex: 'i\\hbar\\,\\frac{dT}{dt} = E\\,T \\;\\Rightarrow\\; T(t) = e^{-iEt/\\hbar}' },
      { text: 'The space part obeys the time-independent equation:', tex: '-\\frac{\\hbar^2}{2m}\\frac{d^2\\phi}{dx^2} + V\\phi = E\\phi' },
      { text: 'The time factor has modulus 1, so the probability density does not change: the state is stationary.', tex: '|\\psi|^2 = |\\phi|^2\\,\\left|e^{-iEt/\\hbar}\\right|^2 = |\\phi|^2' },
      { text: 'Two stationary states together give a cross term that oscillates at $(E_2 - E_1)/\\hbar$:', tex: '|\\phi_1 e^{-iE_1t/\\hbar} + \\phi_2 e^{-iE_2t/\\hbar}|^2 = \\phi_1^2 + \\phi_2^2 + 2\\phi_1\\phi_2\\cos\\frac{(E_2 - E_1)t}{\\hbar}' }
    ],
    outro: 'The last line assumes real $\\phi_1$ and $\\phi_2$, as for the box and the oscillator.'
  },
  examples: [
    {
      title: 'An electron meets a step',
      q: 'An electron with 5.0 eV of kinetic energy (V = 0) reaches a region where V = 3.0 eV. Find its wavelength before and after. What if the step were 7.0 eV high?',
      steps: [
        'Before: $\\lambda = \\dfrac{h}{\\sqrt{2m_e \\cdot 5.0\\ \\mathrm{eV}}} = 0.55\\ \\mathrm{nm}$.',
        'After, the kinetic energy is $5.0 - 3.0 = 2.0$ eV, so $\\lambda = 0.87\\ \\mathrm{nm}$: slower particle, longer waves.',
        'With a 7.0 eV step, $E < V$ by 2.0 eV. The wave dies away over $\\delta = \\dfrac{\\hbar}{\\sqrt{2m_e \\cdot 2.0\\ \\mathrm{eV}}} = 0.14\\ \\mathrm{nm}$ — less than the size of an atom.'
      ],
      a: '0.55 nm before, 0.87 nm after; with a 7 eV step the wave decays over about 0.14 nm.'
    },
    {
      title: 'A sloshing hydrogen atom',
      q: 'A hydrogen atom is put into a superposition of the 1s state ($-13.6$ eV) and a 2p state ($-3.4$ eV). How often does its charge cloud slosh back and forth, and what light does it give off?',
      steps: [
        '$f = \\dfrac{E_2 - E_1}{h} = \\dfrac{10.2\\ \\mathrm{eV}}{4.136\\times10^{-15}\\ \\mathrm{eV\\,s}} = 2.47\\times10^{15}\\ \\mathrm{Hz}$.',
        'An oscillating charge distribution radiates at its own frequency: $\\lambda = c/f = 122\\ \\mathrm{nm}$.',
        'That is Lyman-α, the first line of the Lyman series. The emission gradually empties the 2p part of the superposition, leaving the atom in 1s.'
      ],
      a: '2.5 × 10¹⁵ times a second, emitting 122 nm ultraviolet light.'
    }
  ],
  quiz: [
    { q: 'In a region where $E < V$, a solution of the Schrödinger equation…', choices: ['oscillates with a short wavelength', 'grows or decays exponentially', 'is exactly zero', 'is a straight line'], a: 1,
      why: 'There $\\phi\'\'$ has the same sign as $\\phi$, so the graph curves away from the axis — exponential behaviour.' },
    { q: 'For a stationary state, as time passes the probability density $|\\psi|^2$…', choices: ['moves to the right', 'spreads out', 'stays the same; only the phase rotates', 'oscillates at the frequency E/h'], a: 2,
      why: '$\\psi = \\phi\\,e^{-iEt/\\hbar}$ and $|e^{-iEt/\\hbar}| = 1$.' },
    { q: 'Where a particle has more kinetic energy, its wavefunction has…', choices: ['a longer wavelength', 'a shorter wavelength', 'always a smaller amplitude', 'no oscillation'], a: 1,
      why: '$\\lambda = h/\\sqrt{2m(E - V)}$: more kinetic energy means more momentum and shorter waves.' },
    { q: 'Because the Schrödinger equation is linear, the sum of two solutions is also a solution.', a: true,
      why: 'That is the principle of superposition, the source of all quantum interference.' },
    { q: 'Why does the Schrödinger equation allow only certain energies for a bound particle?', choices: ['Because energy is conserved', 'Only at special energies does the solution die away on both sides instead of blowing up', 'Because the particle is a point', 'Because of the exclusion principle'], a: 1,
      why: 'Normalizability is a boundary condition at both ends, and only a discrete set of energies satisfies both.' }
  ],
  applications: [
    'Computing the structure and reactions of molecules (quantum chemistry).',
    'Designing semiconductor quantum wells, quantum dots and lasers.',
    'Band structure of solids: the Schrödinger equation in a periodic potential.'
  ],
  history: 'Schrödinger published the equation in a series of papers in 1926, solving hydrogen in the first. Heisenberg\'s matrix mechanics, found a year earlier, turned out to be mathematically equivalent. Schrödinger shared the 1933 Nobel Prize with Dirac.',
  sim: ['qm-box', 'qm-tunnel']
},

{
  id: 'particle-in-a-box', parent: 'quantum-mechanics', title: 'Particle in a box', level: 2,
  short: 'A particle trapped between two hard walls can only have energies E_n = n²h²/8mL². The simplest example of how confinement creates quantized levels.',
  keywords: ['particle in a box', 'infinite square well', 'infinite potential well', 'energy levels', 'quantization', 'zero-point energy', 'standing waves', 'nodes', 'quantum dot', 'quantum well', 'correspondence principle', 'conjugated molecule'],
  prereq: ['schrodinger-equation', 'de-broglie-wavelength', 'standing-waves'],
  related: ['quantum-harmonic-oscillator', 'uncertainty-principle', 'fermi-energy', 'semiconductors'],
  body: `
The simplest system that shows quantization is a particle of mass $m$ trapped between two impenetrable walls a distance $L$ apart and free to move between them. Inside, the potential energy is zero; the walls are infinitely high, so the wavefunction must vanish at them. It is the quantum version of a guitar string fixed at both ends.

### Standing waves
Between the walls the particle is free, so its wavefunction is a sine wave, and to vanish at both walls it must fit a whole number of half-wavelengths:

$$L = n\\,\\frac{\\lambda}{2}, \\qquad \\psi_n(x) = \\sqrt{\\frac{2}{L}}\\,\\sin\\frac{n\\pi x}{L}, \\qquad n = 1, 2, 3, \\dots$$

With $p = h/\\lambda = nh/2L$ ([[de-broglie-wavelength]]) the energy $p^2/2m$ can take only the values

$$E_n = \\frac{n^2 h^2}{8 m L^2} = n^2 E_1$$

### What it teaches
- **Confinement causes quantization.** A free particle can have any energy; fencing it in allows only a discrete set. The levels grow as $n^2$ — 1, 4, 9, 16 … times $E_1$ — so they get further apart as they go up.
- **Zero-point energy.** The lowest energy is not zero. $n = 0$ would make $\\psi$ vanish everywhere: no particle at all. A confined particle is never at rest, just as the [[uncertainty-principle]] requires: $\\Delta x \\sim L$ forces $\\Delta p \\sim h/L$.
- **Smaller box, bigger gaps.** $E_1 \\propto 1/mL^2$. An electron in a 1 nm box has $E_1 = 0.38$ eV; in a 0.1 nm box, the size of an atom, 38 eV; a proton in a 10 fm box, the size of a nucleus, about 2 MeV. Those are the energy scales of chemistry and of nuclear physics.
- **Nodes.** State $n$ has $n - 1$ nodes inside the box, points where the particle is never found. In the ground state it is most likely near the middle — unlike a classical particle bouncing back and forth at steady speed, which would be equally likely anywhere.
- **Correspondence.** For large $n$ the ripples of $|\\psi|^2$ become so fine that, averaged over any small region, the probability is uniform: the classical answer returns.

### Light from a box
A jump from level $n_i$ down to $n_f$ emits a photon of energy $(n_i^2 - n_f^2)E_1$. Because the levels spread apart, the highest jumps between neighbouring levels give the bluest light — the opposite of hydrogen. **Quantum dots**, semiconductor crystals a few nanometres across, are real boxes for electrons: shrinking a cadmium selenide dot from about 6 nm to 2 nm shifts its glow from red to blue, which is how quantum-dot displays make pure colours. In long chain-shaped dye molecules the outer electrons roam freely along the chain, and treating the chain as a box, filled two electrons per level ([[pauli-exclusion]]), predicts the colours of the dyes surprisingly well.

### Superpositions slosh
A mixture of states $n = 1$ and $n = 2$ is not stationary: its probability density sloshes from wall to wall at the frequency $(E_2 - E_1)/h$ ([[schrodinger-equation]]). Try it in the simulation.
`,
  ideas: [
    'The wavefunctions are standing waves with a whole number of half-wavelengths across the box.',
    'Energies are E_n = n²h²/8mL²: quantized, growing as n², with a non-zero minimum.',
    'Smaller boxes and lighter particles give larger level spacings.',
    'State n has n − 1 nodes; at large n the probability becomes uniform, as in classical physics.',
    'Quantum dots and conjugated molecules are real-world boxes whose colours depend on their size.'
  ],
  pitfalls: [
    'The ground state has zero energy — The lowest state is n = 1 with E₁ = h²/8mL². A state with n = 0 would contain no particle.',
    'The particle is equally likely to be anywhere in the box — That is the classical answer. In the ground state it is most likely in the middle, and each state has nodes where it is never found.',
    'The levels crowd together as in hydrogen — In a box they spread apart as n². The spacing depends on the shape of the potential.'
  ],
  formulas: [
    {
      name: 'Energy levels of an electron in a box',
      expr: 'E = n^2*h^2/(8*me*L^2)', tex: 'E_n = \\frac{n^2 h^2}{8 m_e L^2}',
      vars: {
        E: { name: 'energy of level n', q: 'energy', unit: 'eV', tex: 'E_n' },
        n: { name: 'quantum number', value: 1, int: true },
        h: { const: 'h' }, me: { const: 'me' },
        L: { name: 'width of the box', q: 'length', unit: 'nm', value: 1 }
      },
      note: 'For another particle change the constant $m_e$; for electrons in a semiconductor use their effective mass.',
      stories: {
        E: 'An electron is confined to a box {L} wide. What is the energy of level n = {n}?',
        L: 'How wide must a box be for an electron in level n = {n} to have an energy of {E}?'
      }
    },
    {
      name: 'Wavelength of a photon from a jump',
      expr: 'lambda = 8*me*c*L^2/(h*(ni^2 - nf^2))', tex: '\\lambda = \\frac{8 m_e c L^2}{h\\,(n_i^2 - n_f^2)}',
      vars: {
        lambda: { name: 'wavelength of the emitted photon', q: 'length', unit: 'nm' },
        me: { const: 'me' }, c: { const: 'c' }, h: { const: 'h' },
        L: { name: 'width of the box', q: 'length', unit: 'nm', value: 1 },
        ni: { name: 'upper level', value: 2, int: true, tex: 'n_i' },
        nf: { name: 'lower level', value: 1, int: true, tex: 'n_f' }
      },
      practice: { unknowns: ['lambda', 'L'] },
      stories: {
        lambda: 'An electron in a box {L} wide drops from level {ni} to level {nf}. What wavelength of light does it emit?',
        L: 'An electron in a box emits light of wavelength {lambda} when it drops from level {ni} to level {nf}. How wide is the box?'
      }
    }
  ],
  derivation: {
    title: 'Solve the box',
    steps: [
      { text: 'Inside, $V = 0$, so the time-independent Schrödinger equation is', tex: '\\frac{d^2\\psi}{dx^2} = -k^2\\psi, \\qquad k = \\frac{\\sqrt{2mE}}{\\hbar}' },
      { text: 'Its general solution is a combination of sine and cosine:', tex: '\\psi = A\\sin kx + B\\cos kx' },
      { text: 'At the left wall $\\psi(0) = 0$, so $B = 0$. At the right wall $\\psi(L) = 0$, so $\\sin kL = 0$:', tex: 'kL = n\\pi, \\qquad n = 1, 2, 3, \\dots' },
      { text: 'The energy follows from $k$:', tex: 'E_n = \\frac{\\hbar^2 k^2}{2m} = \\frac{n^2\\pi^2\\hbar^2}{2mL^2} = \\frac{n^2 h^2}{8mL^2}' },
      { text: 'Normalize, using $\\int_0^L \\sin^2(n\\pi x/L)\\,dx = L/2$:', tex: 'A^2\\,\\frac{L}{2} = 1 \\;\\Rightarrow\\; A = \\sqrt{\\frac{2}{L}}' }
    ]
  },
  examples: [
    {
      title: 'An electron in a 1 nm box',
      q: 'Find the first three energy levels of an electron in a box 1.0 nm wide, and the wavelength emitted in the jump from n = 2 to n = 1.',
      steps: [
        '$E_1 = \\dfrac{h^2}{8m_eL^2} = \\dfrac{(6.626\\times10^{-34})^2}{8(9.109\\times10^{-31})(1.0\\times10^{-9})^2} = 6.02\\times10^{-20}\\ \\mathrm{J} = 0.376\\ \\mathrm{eV}$.',
        '$E_2 = 4E_1 = 1.50$ eV and $E_3 = 9E_1 = 3.38$ eV.',
        'Photon from 2 → 1: $E = 3E_1 = 1.13$ eV, so $\\lambda = 1240/1.13 = 1100\\ \\mathrm{nm}$, in the near infrared.'
      ],
      a: '0.38, 1.50 and 3.38 eV; the 2 → 1 photon has λ ≈ 1100 nm.'
    },
    {
      title: 'The colour of a dye, from a box',
      q: 'The 8 outer electrons of a dye molecule move freely along a chain about 1.2 nm long. Filling the box levels two electrons at a time, estimate the wavelength of light the molecule absorbs most strongly.',
      steps: [
        'Two electrons per level fill $n = 1$ to $4$. The lowest empty level is $n = 5$.',
        'The cheapest excitation lifts an electron from 4 to 5: $\\Delta E = (25 - 16)E_1 = 9E_1$.',
        '$E_1 = 0.376\\ \\mathrm{eV}/(1.2)^2 = 0.261$ eV, so $\\Delta E = 2.35$ eV and $\\lambda = 1240/2.35 = 528$ nm.',
        'The molecule absorbs green light and so looks magenta — a fair estimate for such a crude model.'
      ],
      a: 'About 530 nm (green absorbed; the dye looks purplish).'
    }
  ],
  quiz: [
    { q: 'The width of a box is doubled. The ground-state energy…', choices: ['doubles', 'halves', 'falls to a quarter', 'is unchanged'], a: 2,
      why: '$E_1 \\propto 1/L^2$.' },
    { q: 'In the ground state of a box, where is the particle most likely to be found?', choices: ['near the walls', 'in the middle', 'equally likely anywhere', 'outside the box'], a: 1,
      why: '$|\\psi_1|^2 \\propto \\sin^2(\\pi x/L)$ peaks at the centre and vanishes at the walls.' },
    { q: 'How many nodes inside the box does the n = 4 wavefunction have?', choices: ['2', '3', '4', '5'], a: 1,
      why: 'Four half-wavelengths fit across the box, meeting at three interior zeros: $n - 1 = 3$.' },
    { q: 'A particle in a box can have zero energy if it sits still.', a: false,
      why: 'The lowest level is $E_1 > 0$. Sitting still in a known region would violate the uncertainty principle.' },
    { q: 'Which jump emits the shortest wavelength?', choices: ['2 → 1', '3 → 2', '4 → 3', 'all give the same'], a: 2,
      why: 'Energies differ by $(2n - 1)E_1$ between neighbours: $3E_1$, $5E_1$, $7E_1$. The 4 → 3 photon has the most energy — the reverse of hydrogen, whose levels crowd together.' }
  ],
  applications: [
    'Quantum dots in displays, solar cells and biological labels, whose colour is set by their size.',
    'Quantum-well lasers in fibre-optic networks and Blu-ray players, with layers a few nanometres thick.',
    'Free-electron models of dyes and of electrons in metals.'
  ],
  sim: 'qm-box'
},

{
  id: 'quantum-tunneling', parent: 'quantum-mechanics', title: 'Quantum tunnelling', level: 3,
  short: 'A particle can pass through a barrier it does not have the energy to climb. The chance falls exponentially with the barrier\'s width and height.',
  keywords: ['tunnelling', 'tunneling', 'quantum tunnelling', 'barrier penetration', 'transmission coefficient', 'evanescent wave', 'alpha decay', 'Gamow', 'scanning tunnelling microscope', 'STM', 'tunnel diode', 'flash memory', 'Josephson junction', 'fusion'],
  prereq: ['schrodinger-equation', 'wavefunction', 'math:exponential-functions'],
  related: ['radioactive-decay', 'fusion', 'semiconductors', 'particle-in-a-box', 'superconductivity'],
  body: `
Roll a ball at a hill without enough energy to get over, and it rolls back every time. A quantum particle with the same energy has a small but real chance of turning up on the far side, as if it had gone through. This is **tunnelling**, and without it the Sun would not shine.

### Why it happens
Inside a barrier of height $V_0$ greater than the particle's energy $E$, the [[schrodinger-equation|Schrödinger equation]] does not allow an oscillating wave, but it does allow one that dies away exponentially:

$$\\psi \\propto e^{-\\kappa x}, \\qquad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}$$

If the barrier is thin enough, the wave has not died away completely when it reaches the far side, and it carries on there as a travelling wave of the same wavelength — the same energy — but smaller amplitude. The probability of getting through is the **transmission coefficient** $T$. For a rectangular barrier of width $a$,

$$T = \\left[\\,1 + \\frac{V_0^2 \\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1} \\;\\approx\\; 16\\,\\frac{E}{V_0}\\left(1 - \\frac{E}{V_0}\\right) e^{-2\\kappa a}$$

the approximation holding once $\\kappa a$ is larger than about 1. The exponential dominates, so $T$ is extremely sensitive to the width, to the height of the barrier above the particle's energy, and to the mass.

### How big is it?
For an electron facing a barrier 1 eV above its energy, $\\kappa = 5.1\\ \\mathrm{nm^{-1}}$: the wave falls by a factor $e$ every 0.2 nm. With $E = 1$ eV and $V_0 = 2$ eV, it gets through a 0.5 nm barrier about 2 % of the time, a 1 nm barrier 0.014 % of the time and a 2 nm barrier once in 200 million tries. A proton, 1836 times heavier, has $\\kappa$ 43 times larger: through the same 0.5 nm barrier its chance is about $10^{-95}$. Tunnelling is a feature of light particles and short distances.

### Where it matters
- **Alpha decay.** An alpha particle rattles around inside a nucleus behind a Coulomb barrier some 25–30 MeV high, with only 4–9 MeV of energy. It escapes by tunnelling, as George Gamow showed in 1928. The exponential makes half-lives extraordinarily sensitive to energy: polonium-212 emits 8.8 MeV alpha particles with a half-life of 0.3 µs, thorium-232 emits 4.0 MeV ones with a half-life of 14 billion years ([[radioactive-decay]]).
- **Fusion in the Sun.** At 15 million kelvin, protons have typical energies of about 1 keV, hundreds of times less than the Coulomb barrier between two protons. They fuse only because they occasionally tunnel through it ([[fusion]]).
- **The scanning tunnelling microscope.** A sharp metal tip is held a few tenths of a nanometre above a surface, and electrons tunnel across the gap. The current changes about tenfold for every 0.1 nm of distance, so a feedback loop that keeps it constant makes the tip trace the bumps of individual atoms. Gerd Binnig and Heinrich Rohrer won the 1986 Nobel Prize for it.
- **Electronics.** Flash memory stores each bit as charge pushed onto an isolated gate by tunnelling through a thin oxide; tunnel diodes and superconducting Josephson junctions use it; and in the smallest transistors, tunnelling through insulating layers only a nanometre thick is a leak that engineers must fight.

> [!key] Tunnelling does not break energy conservation: the particle arrives on the far side with the energy it started with. Catching it inside the barrier would take a measurement that locates it within about $1/\\kappa$, and by the uncertainty principle that measurement supplies at least the missing energy $V_0 - E$.
`,
  ideas: [
    'Inside a barrier higher than the particle\'s energy the wavefunction decays as e^(−κx), κ = √(2m(V₀ − E))/ħ.',
    'If the barrier is thin, part of the wave emerges on the far side: the particle can tunnel through.',
    'The transmission probability falls roughly as e^(−2κa), so it is extremely sensitive to width, height and mass.',
    'Tunnelling explains alpha decay and solar fusion, and makes the scanning tunnelling microscope and flash memory work.'
  ],
  pitfalls: [
    'A tunnelling particle loses energy in the barrier — It emerges with the same energy and wavelength; only the probability of finding it there is reduced.',
    'Doubling the width halves the transmission — The transmission depends exponentially on width; doubling a thick barrier roughly squares an already small number.',
    'Tunnelling is instantaneous or faster than light — It takes a finite time, and it cannot be used to send signals faster than light.'
  ],
  formulas: [
    {
      name: 'Decay constant inside the barrier',
      expr: 'kappa = sqrt(2*me*(V0 - E))/hbar', tex: '\\kappa = \\frac{\\sqrt{2m_e(V_0 - E)}}{\\hbar}',
      vars: {
        kappa: { name: 'decay constant', q: 'wavenumber', unit: '1/nm' },
        me: { const: 'me' }, hbar: { const: 'hbar' },
        V0: { name: 'height of the barrier', q: 'energy', unit: 'eV', value: 2 },
        E: { name: 'energy of the electron', q: 'energy', unit: 'eV', value: 1 }
      },
      note: 'The wavefunction falls by a factor $e$ over $1/\\kappa$. For another particle change $m_e$.',
      stories: {
        kappa: 'An electron with energy {E} meets a barrier {V0} high. How fast does its wavefunction decay inside?',
        V0: 'Inside a barrier the wavefunction of a {E} electron decays with κ = {kappa}. How high is the barrier?'
      }
    },
    {
      name: 'Transmission through a rectangular barrier',
      expr: 'T = 1/(1 + V0^2*sinh(a*sqrt(2*me*(V0 - E))/hbar)^2/(4*E*(V0 - E)))',
      tex: 'T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1},\\quad \\kappa = \\frac{\\sqrt{2m_e(V_0 - E)}}{\\hbar}',
      vars: {
        T: { name: 'transmission probability', q: 'ratio', unit: '%' },
        V0: { name: 'height of the barrier', q: 'energy', unit: 'eV', value: 2 },
        a: { name: 'width of the barrier', q: 'length', unit: 'nm', value: 0.5 },
        me: { const: 'me' }, hbar: { const: 'hbar' },
        E: { name: 'energy of the electron', q: 'energy', unit: 'eV', value: 1 }
      },
      note: 'Exact for $E < V_0$ and a flat-topped barrier. Solving for $E$ or $V_0$ is done numerically.',
      practice: { unknowns: ['T', 'a'] },
      stories: {
        T: 'An electron of energy {E} meets a barrier {V0} high and {a} wide. What is the probability that it tunnels through?',
        a: 'How wide can a barrier {V0} high be if an electron of energy {E} is to get through with probability {T}?'
      }
    },
    {
      name: 'Tunnelling current against gap (STM)',
      expr: 'I2 = I1*exp(-2*dd*sqrt(2*me*phi)/hbar)', tex: 'I_2 = I_1\\, e^{-2\\,\\Delta d\\,\\sqrt{2m_e\\phi}/\\hbar}',
      vars: {
        I2: { name: 'current after the gap widens', q: 'current', unit: 'nA', tex: 'I_2' },
        I1: { name: 'current before', q: 'current', unit: 'nA', value: 1, tex: 'I_1' },
        dd: { name: 'increase in the gap', q: 'length', unit: 'nm', value: 0.1, signed: true, tex: '\\Delta d' },
        me: { const: 'me' }, hbar: { const: 'hbar' },
        phi: { name: 'work function (barrier height)', q: 'energy', unit: 'eV', value: 4.5 }
      },
      note: 'Only the exponential factor changes as the gap changes. A negative $\\Delta d$ brings the tip closer.',
      stories: {
        I2: 'An STM tip draws {I1}. It is lifted by {dd} over a metal with a work function of {phi}. What current flows now?',
        dd: 'The tunnelling current of an STM falls from {I1} to {I2} over a surface with work function {phi}. How far did the tip move away?'
      }
    }
  ],
  examples: [
    {
      title: 'An electron and a thin barrier',
      q: 'An electron with 1.0 eV of energy meets a barrier 2.0 eV high and 0.50 nm wide. Find κ and the probability of tunnelling. What would it be for a proton?',
      steps: [
        '$\\kappa = \\dfrac{\\sqrt{2(9.11\\times10^{-31})(1.0 \\times 1.602\\times10^{-19})}}{1.055\\times10^{-34}} = 5.12\\times10^9\\ \\mathrm{m^{-1}}$, so $\\kappa a = 2.56$.',
        'Exact: $\\sinh(2.56) = 6.43$, so $T = \\left[1 + \\dfrac{4 \\times 41.4}{4 \\times 1 \\times 1}\\right]^{-1} = \\dfrac{1}{42.4} = 0.024$.',
        'Approximation: $16 \\times 0.5 \\times 0.5 \\times e^{-5.12} = 4 \\times 0.0060 = 0.024$ — already excellent.',
        'For a proton, $\\kappa$ is $\\sqrt{1836} = 43$ times larger, $2\\kappa a = 220$, and $T \\approx 4e^{-220} \\approx 10^{-95}$.'
      ],
      a: 'κ = 5.1 nm⁻¹ and T ≈ 2.4 % for the electron; about 10⁻⁹⁵ for a proton.'
    },
    {
      title: 'Why an STM sees atoms',
      q: 'Electrons tunnel from a tip to a metal surface whose work function is 4.5 eV. By what factor does the current change when the gap widens by 0.10 nm? By 0.01 nm?',
      steps: [
        '$\\kappa = \\sqrt{2m_e \\times 4.5\\ \\mathrm{eV}}/\\hbar = 10.9\\ \\mathrm{nm^{-1}}$.',
        'The current goes as $e^{-2\\kappa d}$. For $\\Delta d = 0.10$ nm: $e^{-2.17} = 0.11$ — about a tenfold drop.',
        'For $\\Delta d = 0.01$ nm, one-twentieth of an atom\'s diameter: $e^{-0.217} = 0.80$, a 20 % change, easy to measure. Height differences of a few picometres show up clearly.'
      ],
      a: 'About ×0.11 per 0.1 nm, and ×0.80 per 0.01 nm.'
    }
  ],
  quiz: [
    { q: 'Doubling the width of a thick barrier changes the transmission probability roughly by…', choices: ['a factor of 2', 'a factor of 4', 'squaring it (10⁻³ becomes about 10⁻⁶)', 'nothing'], a: 2,
      why: '$T \\propto e^{-2\\kappa a}$, and $e^{-2\\kappa(2a)} = (e^{-2\\kappa a})^2$.' },
    { q: 'An electron and a proton with the same energy meet the same barrier. Which is more likely to tunnel through?', choices: ['the electron', 'the proton', 'both equally', 'neither can'], a: 0,
      why: '$\\kappa \\propto \\sqrt m$, so the lighter electron decays far more slowly inside the barrier.' },
    { q: 'Inside the barrier, the wavefunction…', choices: ['oscillates with a long wavelength', 'decays exponentially', 'is exactly zero', 'grows linearly'], a: 1,
      why: 'Where $E < V$ the solutions are exponentials.' },
    { q: 'A particle that tunnels through a barrier comes out with less energy than it had before.', a: false,
      why: 'The transmitted wave has the same wavelength, hence the same energy. Only its amplitude, and so the probability, is smaller.' },
    { q: 'Why do alpha-decay half-lives range from microseconds to billions of years?', choices: ['The tunnelling probability depends exponentially on the alpha particle\'s energy compared with the barrier', 'Nuclei are at different temperatures', 'Chemical bonds hold some nuclei together', 'It is pure chance'], a: 0,
      why: 'A factor of two in energy changes $\\kappa$ and the barrier width enough to change the exponential by some 24 powers of ten.' }
  ],
  applications: [
    'Scanning tunnelling microscopes that image and move individual atoms.',
    'Flash memory in phones, cameras and solid-state drives.',
    'Josephson junctions in SQUID magnetometers and superconducting qubits.',
    'Nuclear fusion in stars and radioactive alpha decay.'
  ],
  history: 'Friedrich Hund applied tunnelling to molecules in 1927. In 1928 Gamow, and independently Gurney and Condon, explained alpha decay with it, and Fowler and Nordheim explained how strong electric fields pull electrons out of metals. Leo Esaki (tunnel diode, 1957), Ivar Giaever and Brian Josephson shared the 1973 Nobel Prize for tunnelling in solids.',
  sim: 'qm-tunnel'
},

{
  id: 'quantum-harmonic-oscillator', parent: 'quantum-mechanics', title: 'Quantum harmonic oscillator', level: 3,
  short: 'A particle on a quantum spring has evenly spaced energy levels (n + ½)ħω. It is the model for vibrating molecules and solids, and even for light.',
  keywords: ['quantum harmonic oscillator', 'harmonic oscillator', 'zero-point energy', 'evenly spaced levels', 'ħω', 'molecular vibration', 'vibrational spectrum', 'infrared absorption', 'phonon', 'Hermite polynomials', 'Gaussian ground state', 'classical turning point'],
  prereq: ['schrodinger-equation', 'simple-harmonic-motion', 'particle-in-a-box'],
  related: ['heat-capacity-solids', 'blackbody-radiation', 'equipartition', 'uncertainty-principle'],
  body: `
Anything sitting at the bottom of a smooth potential well feels, for small displacements, a restoring force proportional to the displacement: a spring. Atoms in a molecule, atoms in a crystal, the electromagnetic field in a cavity — all are, to a first approximation, harmonic oscillators, and in the quantum world they share one strikingly simple set of energy levels.

### The levels
With the potential $V = \\tfrac12 m\\omega^2 x^2$ of a mass on a spring of classical angular frequency $\\omega = \\sqrt{k/m}$ ([[simple-harmonic-motion]]), the [[schrodinger-equation|Schrödinger equation]] has acceptable solutions only when

$$E_n = \\left(n + \\tfrac12\\right)\\hbar\\omega, \\qquad n = 0, 1, 2, \\dots$$

The levels are **evenly spaced**, one quantum $\\hbar\\omega = hf$ apart — exactly the packets Planck postulated for the walls of his oven ([[blackbody-radiation]]), plus a half-quantum he did not know about. Compare the box, whose levels spread out as $n^2$, and hydrogen, whose levels crowd together: the shape of the potential decides the spacing.

### Zero-point energy
The lowest energy is $\\tfrac12\\hbar\\omega$, not zero. Resting motionless at the bottom would mean a sharp position and a sharp momentum together, which the [[uncertainty-principle|uncertainty principle]] forbids. The ground state is a Gaussian,

$$\\psi_0(x) \\propto e^{-x^2/2x_0^2}, \\qquad x_0 = \\sqrt{\\frac{\\hbar}{m\\omega}},$$

and it is the minimum-uncertainty wave packet: $\\Delta x\\,\\Delta p = \\hbar/2$ exactly. Zero-point motion is why helium stays liquid down to absolute zero unless it is squeezed to about 25 atmospheres.

### Shapes and correspondence
State $n$ has $n$ nodes; its wavefunction is a polynomial of degree $n$ (a Hermite polynomial) times the Gaussian. Each extends a little beyond the **classical turning points**, where an oscillator with the same energy would stop and turn back — into the forbidden region, as in [[quantum-tunneling]]. At large $n$ the probability density approaches the classical one, which is largest near the turning points, where a pendulum moves slowest and spends most time.

### Molecules and solids
A diatomic molecule vibrates like two masses on a spring. For carbon monoxide the quantum is $\\hbar\\omega = 0.27$ eV, so the molecule absorbs infrared light at 4.7 µm, the band that CO detectors and exhaust-gas analysers use. Since $k_BT$ at room temperature is only 0.026 eV, almost every molecule is in the ground state: the vibrations are "frozen out", which is why the heat capacity of air is that of molecules that move and rotate but hardly vibrate ([[equipartition]]). The same freezing makes the heat capacity of solids fall towards zero at low temperature, where the quanta of lattice vibration are called phonons ([[heat-capacity-solids]]). When an oscillator absorbs or emits light, $n$ changes by exactly one, so an ideal harmonic molecule absorbs at a single frequency — its own classical frequency $\\omega$.

> [!tip] In the simulation, compare the harmonic well with the box: evenly spaced levels against levels spreading as n². Tick the classical comparison and raise n to watch the quantum probability approach the classical one.
`,
  ideas: [
    'The energy levels (n + ½)ħω are evenly spaced, one quantum ħω apart.',
    'The zero-point energy ½ħω cannot be removed; the ground state is a minimum-uncertainty Gaussian.',
    'Wavefunctions extend beyond the classical turning points; at large n they approach the classical distribution.',
    'Molecular vibrations and lattice vibrations are quantum oscillators; at room temperature most molecular vibrations are frozen in their ground state.'
  ],
  pitfalls: [
    'An oscillator at absolute zero stops moving — It keeps its zero-point energy ½ħω and a spread in position of about x₀.',
    'Oscillator levels spread apart like those of a box — They are evenly spaced; the spacing is the same ħω all the way up (in the ideal harmonic case).',
    'The quantum particle is most likely found at the turning points — That is true for large n. In the ground state it is most likely at the centre.'
  ],
  formulas: [
    {
      name: 'Energy levels',
      expr: 'E = (n + 1/2)*h*f', tex: 'E_n = \\left(n + \\tfrac12\\right) h f',
      vars: {
        E: { name: 'energy of level n', q: 'energy', unit: 'eV', tex: 'E_n' },
        n: { name: 'quantum number', value: 1, int: true },
        h: { const: 'h' },
        f: { name: 'classical frequency of the oscillator', q: 'frequency', unit: 'THz', value: 64.3 }
      },
      note: '$hf = \\hbar\\omega$. The default frequency is that of the carbon monoxide molecule.',
      stories: {
        E: 'An oscillator of frequency {f} is in level n = {n}. What is its energy?',
        f: 'A quantum oscillator has a ground-state energy of {E} (n = {n}). What is its classical frequency?'
      }
    },
    {
      name: 'Vibration quantum from a spring constant',
      expr: 'E = hbar*sqrt(k/m)', tex: 'E = \\hbar\\sqrt{\\frac{k}{m}}',
      vars: {
        E: { name: 'energy quantum ħω', q: 'energy', unit: 'eV' },
        hbar: { const: 'hbar' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 1857 },
        m: { name: 'mass (reduced mass for a molecule)', q: 'mass', unit: 'u', value: 6.86 }
      },
      note: 'For a two-atom molecule use the reduced mass $m_1m_2/(m_1 + m_2)$. Defaults: carbon monoxide.',
      stories: {
        E: 'A molecule behaves like a spring of stiffness {k} with a reduced mass of {m}. What is its vibrational quantum?',
        k: 'A molecule with reduced mass {m} absorbs infrared photons of {E}. What is the stiffness of its bond?'
      }
    },
    {
      name: 'Size of the ground state',
      expr: 'x0 = sqrt(hbar/(m*omega))', tex: 'x_0 = \\sqrt{\\frac{\\hbar}{m\\omega}}',
      vars: {
        x0: { name: 'width of the ground-state wavefunction', q: 'length', unit: 'pm' },
        hbar: { const: 'hbar' },
        m: { name: 'mass', q: 'mass', unit: 'u', value: 6.86 },
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 4.04e14 }
      },
      note: 'The ground state spreads over roughly $\\pm x_0$; the standard deviation is $x_0/\\sqrt 2$.',
      stories: { x0: 'An oscillator of mass {m} vibrates at {omega}. How wide is its zero-point spread?' }
    }
  ],
  derivation: {
    title: 'Check the ground state',
    steps: [
      { text: 'Try a Gaussian, $\\psi = e^{-x^2/2x_0^2}$. Differentiating twice:', tex: '\\frac{d^2\\psi}{dx^2} = \\left(\\frac{x^2}{x_0^4} - \\frac{1}{x_0^2}\\right)\\psi' },
      { text: 'Put it into $-\\frac{\\hbar^2}{2m}\\psi\'\' + \\tfrac12 m\\omega^2x^2\\psi = E\\psi$ and divide by $\\psi$:', tex: '-\\frac{\\hbar^2}{2m}\\left(\\frac{x^2}{x_0^4} - \\frac{1}{x_0^2}\\right) + \\tfrac12 m\\omega^2x^2 = E' },
      { text: 'This must hold at every $x$, so the $x^2$ terms must cancel:', tex: '\\frac{\\hbar^2}{2m x_0^4} = \\tfrac12 m\\omega^2 \\;\\Rightarrow\\; x_0^2 = \\frac{\\hbar}{m\\omega}' },
      { text: 'What is left is the energy:', tex: 'E = \\frac{\\hbar^2}{2m x_0^2} = \\tfrac12\\hbar\\omega' }
    ]
  },
  examples: [
    {
      title: 'The vibration of carbon monoxide',
      q: 'The C≡O bond behaves like a spring with k = 1857 N/m, and the reduced mass is 6.86 u. Find ħω, the infrared wavelength the molecule absorbs, and the fraction of molecules in n = 1 at 300 K.',
      steps: [
        '$m = 6.86 \\times 1.661\\times10^{-27} = 1.139\\times10^{-26}$ kg, so $\\omega = \\sqrt{k/m} = 4.04\\times10^{14}\\ \\mathrm{rad/s}$.',
        '$\\hbar\\omega = 1.055\\times10^{-34} \\times 4.04\\times10^{14} = 4.26\\times10^{-20}\\ \\mathrm{J} = 0.266\\ \\mathrm{eV}$.',
        'Absorbed light: $\\lambda = 1240/0.266\\ \\mathrm{nm} = 4.66\\ \\mathrm{µm}$.',
        'Population of n = 1 relative to n = 0: $e^{-0.266/0.0259} = e^{-10.3} = 3\\times10^{-5}$. The vibration is frozen out.'
      ],
      a: 'ħω ≈ 0.27 eV, absorption near 4.7 µm, and only about 3 molecules in 100 000 in n = 1.'
    },
    {
      title: 'Is a mass on a spring quantum?',
      q: 'A 1.0 kg mass oscillates on a spring at ω = 1.0 rad/s with 1.0 J of energy. What is its quantum number, and how large is its zero-point spread?',
      steps: [
        'The quantum is $\\hbar\\omega = 1.05\\times10^{-34}$ J, so $n \\approx E/\\hbar\\omega = 9.5\\times10^{33}$.',
        'Neighbouring levels differ by one part in $10^{34}$ — a perfectly smooth continuum for any practical purpose.',
        '$x_0 = \\sqrt{\\hbar/m\\omega} = 1.0\\times10^{-17}\\ \\mathrm{m}$, a hundred times smaller than a proton.'
      ],
      a: 'n ≈ 10³⁴; zero-point spread about 10⁻¹⁷ m. Classical physics works perfectly.'
    }
  ],
  quiz: [
    { q: 'The energy levels of the quantum harmonic oscillator are…', choices: ['evenly spaced', 'spaced as n²', 'crowded together as n grows', 'randomly spaced'], a: 0,
      why: '$E_n = (n + \\tfrac12)\\hbar\\omega$: every step is one quantum $\\hbar\\omega$.' },
    { q: 'The lowest possible energy of the oscillator is…', choices: ['0', '½ħω', 'ħω', 'k_BT'], a: 1,
      why: 'The zero-point energy. A lower energy would require position and momentum to be sharper than the uncertainty principle allows.' },
    { q: 'A molecular vibration has ħω = 0.3 eV. At room temperature ($k_BT$ = 0.026 eV) most of the molecules are…', choices: ['in the vibrational ground state', 'spread evenly over many levels', 'in n = 1', 'broken apart'], a: 0,
      why: 'The Boltzmann factor $e^{-0.3/0.026} \\approx 10^{-5}$ leaves almost all molecules in n = 0.' },
    { q: 'In the ground state the particle is never found beyond the classical turning points.', a: false,
      why: 'The Gaussian extends past them: about 16 % of the probability lies in the classically forbidden region.' },
    { q: 'Making the spring stiffer (larger k, same mass) makes the level spacing…', choices: ['larger', 'smaller', 'unchanged', 'zero'], a: 0,
      why: 'The spacing is $\\hbar\\omega = \\hbar\\sqrt{k/m}$.' }
  ],
  applications: [
    'Infrared and Raman spectroscopy identify molecules by their vibrational quanta.',
    'Heat capacities of gases and solids at low temperature.',
    'Each mode of light in a cavity is a harmonic oscillator; its quanta are photons.',
    'Ion traps and nanomechanical resonators cooled to their quantum ground state.'
  ],
  sim: { id: 'qm-box', params: { well: 'ho' } }
},

{
  id: 'hydrogen-atom-quantum', parent: 'quantum-mechanics', title: 'The hydrogen atom, quantum mechanically', level: 3,
  short: 'Solving the Schrödinger equation for hydrogen gives Bohr\'s energies — but replaces orbits with orbitals: three-dimensional clouds of probability labelled by n, ℓ and m.',
  keywords: ['hydrogen atom', 'orbitals', 'atomic orbital', 'electron cloud', 'radial probability', '1s orbital', '2p orbital', 'spherical harmonics', 'Bohr radius', 'most probable radius', 'radial nodes', 'degeneracy', 'fine structure', 'Lamb shift', 'hyperfine structure'],
  prereq: ['schrodinger-equation', 'bohr-model', 'quantum-numbers'],
  related: ['electron-spin', 'pauli-exclusion', 'hydrogen-spectrum', 'math:coordinate-systems-3d'],
  body: `
Hydrogen is the one real atom whose Schrödinger equation can be solved exactly, and solving it was Schrödinger's first triumph in 1926. The electron moves in three dimensions in the Coulomb potential of the proton, $V(r) = -ke^2/r$, which depends only on the distance $r$. In [[math:coordinate-systems-3d|spherical coordinates]] the wavefunction splits into a radial part and an angular part,

$$\\psi_{n\\ell m}(r, \\theta, \\varphi) = R_{n\\ell}(r)\\; Y_{\\ell m}(\\theta, \\varphi)$$

and demanding that it be single-valued and die away at large $r$ produces the three [[quantum-numbers|quantum numbers]] $n$, $\\ell$ and $m_\\ell$, with exactly the allowed ranges listed there.

### The same energies as Bohr
The allowed energies are

$$E_n = -\\frac{13.6\\ \\mathrm{eV}}{n^2}$$

just as in the [[bohr-model|Bohr model]], and they depend only on $n$. Level $n$ holds $n^2$ different orbitals of equal energy ($2n^2$ states with spin). So the [[hydrogen-spectrum|hydrogen spectrum]] comes out as before; what is new is everything else.

### No orbits, but clouds
There is no path. The electron is described by a probability cloud, $|\\psi|^2$, dense in some places and empty in others.

- The **ground state** 1s is spherically symmetric: $\\psi_{100} = e^{-r/a_0}/\\sqrt{\\pi a_0^3}$. Its density per unit volume is highest *at the nucleus*. Yet the most likely distance is not zero, because the amount of space at distance $r$ grows as the area $4\\pi r^2$ of a sphere. The **radial probability density** $P(r) = 4\\pi r^2 |\\psi|^2$ peaks exactly at $r = a_0$: the Bohr radius survives as the most probable distance, not the radius of an orbit. The average distance is $1.5\\,a_0$.
- The ground state has **zero angular momentum**, where Bohr had $\\hbar$. The electron is not circling, and a stationary charge cloud does not radiate, so the old stability problem simply disappears.
- An orbital has $n - 1$ nodes in all: $n - \\ell - 1$ spherical ones and $\\ell$ planes or cones through the nucleus. The 2s orbital has a spherical node at $2a_0$; the three 2p orbitals are the familiar dumbbells along $x$, $y$ and $z$.
- Orbitals of larger $n$ are larger: the average distance is $\\bar r = \\tfrac12 a_0\\,[3n^2 - \\ell(\\ell + 1)]$, growing roughly as $n^2$, as Bohr found.

These shapes, suitably modified by the other electrons, are the building blocks of chemistry: they explain bond angles, the shapes of molecules and the structure of the [[pauli-exclusion|periodic table]].

### Beyond Schrödinger
Precise spectroscopy finds small shifts the simple equation misses. Relativity and the electron's [[electron-spin|spin]] split the levels by roughly one part in $10^5$ (fine structure, explained by Dirac's equation in 1928). Fluctuations of the electromagnetic vacuum push 2s slightly above 2p (the Lamb shift, 1947). The magnetic interaction between the electron's and the proton's spins splits the ground state by $5.9 \\times 10^{-6}$ eV, the origin of the 21 cm radio line. The 1s–2s transition frequency has been measured to about 15 significant figures and agrees with theory — hydrogen is one of the best-tested systems in physics.
`,
  ideas: [
    'The Schrödinger equation for hydrogen separates into radial and angular parts labelled by n, ℓ and m_ℓ.',
    'Its energies are exactly Bohr\'s, E_n = −13.6 eV/n², with n² orbitals per level.',
    'Orbits are replaced by orbitals, clouds of probability with nodes; the 1s cloud is spherical and densest at the nucleus.',
    'The radial probability of 1s peaks at the Bohr radius a₀; the mean distance is 1.5 a₀.',
    'Small corrections — fine structure, the Lamb shift, hyperfine structure — are explained by relativity, spin and quantum field theory.'
  ],
  pitfalls: [
    'The electron in 1s is most likely found at the nucleus, so the most probable distance is zero — The density per volume is largest at the nucleus, but there is very little volume there; the radial probability peaks at a₀.',
    'Quantum mechanics changes hydrogen\'s energy levels from Bohr\'s — It reproduces them exactly; it changes the picture of the states and their angular momenta.',
    'Orbitals are paths the electron follows — They are standing waves of probability; the electron has no trajectory.'
  ],
  formulas: [
    {
      name: 'Probability of the 1s electron within a radius',
      expr: 'P = 1 - exp(-2*R/a0)*(1 + 2*R/a0 + 2*R^2/a0^2)', tex: 'P = 1 - e^{-2R/a_0}\\left(1 + \\frac{2R}{a_0} + \\frac{2R^2}{a_0^2}\\right)',
      vars: {
        P: { name: 'probability of finding the electron within R', q: 'ratio', unit: '%' },
        R: { name: 'radius of the sphere', q: 'length', unit: 'nm', value: 0.0529 },
        a0: { const: 'a0' }
      },
      note: 'The integral of $4\\pi r^2|\\psi_{100}|^2$ from 0 to $R$.',
      stories: {
        P: 'What is the probability of finding hydrogen\'s ground-state electron within {R} of the nucleus?',
        R: 'Within what radius is hydrogen\'s ground-state electron found with probability {P}?'
      }
    },
    {
      name: 'Average distance in an orbital',
      expr: 'r = a0/2*(3*n^2 - l*(l + 1))', tex: '\\bar r = \\frac{a_0}{2}\\left[3n^2 - \\ell(\\ell + 1)\\right]',
      vars: {
        r: { name: 'average distance from the nucleus', q: 'length', unit: 'nm', tex: '\\bar r' },
        a0: { const: 'a0' },
        n: { name: 'principal quantum number', value: 2, int: true },
        l: { name: 'orbital quantum number', value: 1, int: true, tex: '\\ell' }
      },
      note: 'For hydrogen; needs $\\ell \\le n - 1$.',
      practice: { unknowns: ['r'] },
      stories: { r: 'What is the average distance from the nucleus of a hydrogen electron with n = {n} and ℓ = {l}?' }
    }
  ],
  examples: [
    {
      title: 'How far out is the electron?',
      q: 'For hydrogen\'s ground state, find the probability that the electron is within $a_0$ of the nucleus, within $2a_0$, and farther than $5a_0$.',
      steps: [
        'Use $P(R) = 1 - e^{-u}\\left(1 + u + u^2/2\\right)$ with $u = 2R/a_0$.',
        '$R = a_0$: $u = 2$, $P = 1 - 5e^{-2} = 0.32$.',
        '$R = 2a_0$: $u = 4$, $P = 1 - 13e^{-4} = 0.76$.',
        'Beyond $5a_0$: $u = 10$, $1 - P = 61e^{-10} = 0.0028$. The cloud has no edge, but it thins out fast.'
      ],
      a: '32 % within a₀, 76 % within 2a₀, and 0.3 % beyond 5a₀.'
    },
    {
      title: 'Nodes of the 3p orbital',
      q: 'How many nodes does a 3p orbital have, and of which kinds?',
      steps: [
        '$n = 3$, $\\ell = 1$: in total $n - 1 = 2$ nodes.',
        'Angular nodes: $\\ell = 1$, a plane through the nucleus (as for every p orbital).',
        'Radial nodes: $n - \\ell - 1 = 1$, a sphere around the nucleus where the probability vanishes.'
      ],
      a: 'Two: one nodal plane and one spherical node.'
    }
  ],
  quiz: [
    { q: 'In the quantum-mechanical hydrogen atom, the ground state has orbital angular momentum…', choices: ['ħ, as in Bohr\'s model', 'zero', '√2 ħ', 'ħ/2'], a: 1,
      why: 'The 1s state has ℓ = 0. Bohr\'s value of ħ was wrong, although his energy was right.' },
    { q: 'For the 1s state, the most probable distance between electron and nucleus is…', choices: ['zero', 'a₀', '1.5 a₀', 'infinite'], a: 1,
      why: 'The radial probability $4\\pi r^2|\\psi|^2 \\propto r^2 e^{-2r/a_0}$ has its maximum at $r = a_0$.' },
    { q: 'Where is the 1s probability density $|\\psi|^2$ (per unit volume) largest?', choices: ['at the nucleus', 'at r = a₀', 'at r = 1.5 a₀', 'it is the same everywhere'], a: 0,
      why: '$|\\psi|^2 \\propto e^{-2r/a_0}$ is largest at $r = 0$. The radial probability peaks at $a_0$ only because of the growing volume of shells.' },
    { q: 'The Schrödinger equation gives hydrogen different energy levels from the Bohr model.', a: false,
      why: 'Both give $E_n = -13.6\\ \\mathrm{eV}/n^2$. The differences are in the wavefunctions and the angular momenta.' },
    { q: 'How many orbitals share the energy of n = 3 in hydrogen (ignoring spin)?', choices: ['3', '6', '9', '18'], a: 2,
      why: 'One 3s, three 3p and five 3d: $n^2 = 9$.' }
  ],
  applications: [
    'Orbital shapes underlie chemical bonding and molecular geometry.',
    'Hydrogen spectroscopy tests quantum electrodynamics and measures the Rydberg constant and the size of the proton.',
    'The 21 cm hyperfine line maps hydrogen gas throughout the Galaxy and the early universe.'
  ],
  history: 'Schrödinger solved hydrogen in the first of his 1926 papers. Wolfgang Pauli had obtained the same energies from Heisenberg\'s matrix mechanics a few months earlier. Willis Lamb measured the Lamb shift in 1947, a result that launched modern quantum electrodynamics.'
}

);
