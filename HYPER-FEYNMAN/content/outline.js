/* HYPER-FEYNMAN · content/outline.js
 *
 * The shape of the app: the root, its branches and their topics. Concepts live in the topic files and hang
 * under these topics with `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold.
 *
 * Hyper Feynman follows the physics Richard Feynman presented in The Feynman Lectures on Physics (Caltech
 * 1961–63; volumes I, II and III), The Character of Physical Law (the Messenger Lectures, Cornell, 1964),
 * QED: The Strange Theory of Light and Matter (1985; the Douglas Robb lectures in Auckland, 1979, are the
 * filmed version) and his famous talks — explained in original words, drawn and simulated, with every math
 * term clickable. Sources are cited as "FLP I-26" (volume I, chapter 26), "Character, lecture 4", "QED, ch. 2".
 * Physics is linked as physics:<id>, mathematics as math:<id>.
 */
Hyper.add(
  {
    id: 'feynman', kind: 'root', title: 'Hyper Feynman',
    short: 'The physics Richard Feynman taught — atoms, energy, least action, symmetry, relativity, light, heat and chance, electromagnetism, quantum behaviour and QED — made visible: every idea drawn and simulated, every math term explained.',
    links: [['QED arrows', '#/tools/arrows', 'arrows'], ['Two-slit lab', '#/tools/slits', 'quantum'], ['Spacetime', '#/tools/spacetime', 'relativity'], ['Field lines', '#/tools/fields', 'em'], ['Quantum wells', '#/tools/wells', 'waves'], ['Math terms', '#/tools/terms', 'book']],
    body: `Richard Feynman (1918–1988) shared the 1965 Nobel Prize in Physics for quantum electrodynamics, but he is remembered as much for the way he explained things. In 1961–63 he gave the introductory physics course at Caltech; the lectures became the three red volumes of *The Feynman Lectures on Physics*. In 1964 he gave the Messenger Lectures at Cornell, *The Character of Physical Law*, and in 1979 in Auckland a filmed set of public lectures on light and electrons; the same story, told again in the Alix G. Mautner Memorial Lectures at UCLA, became the book *QED: The Strange Theory of Light and Matter* (1985). Their common thread is a way of seeing: start from what nature does, find the simplest honest picture of it, and follow that picture wherever it leads — to atoms jiggling, to light trying every path at once, to arrows that add and cancel.

Hyper Feynman retells that physics in its own words and, above all, **shows** it. Nearly every page has a simulation you can play with; every formula is a calculator; and every piece of mathematics — a [[?derivative]], an [[?integral]], a [[?curl]], a [[?complex-number|complex number]] — is clickable, with a short card saying what it means and how to deal with it. Each page ends with **Where Feynman tells it**: the lecture, volume and chapter to read next.

> [!note] Hyper Feynman is an independent study companion. It is not affiliated with or endorsed by Caltech, the Feynman estate or the publishers of Feynman's books, and it quotes none of them: the explanations, pictures and exercises are original. The lectures themselves are well worth reading — Caltech publishes *The Feynman Lectures on Physics* free to read online at [feynmanlectures.caltech.edu](https://www.feynmanlectures.caltech.edu).`
  },

  /* ================================================================ FEYNMAN'S WAY */
  {
    id: 'feynman-way', kind: 'branch', parent: 'feynman', title: 'Feynman\'s Way of Thinking', icon: 'bulb', hue: 22,
    short: 'What physics is and how it is done: the atomic hypothesis, a map of the laws, how mathematics and nature fit together, how new laws are found — and the honesty, doubt and delight that science needs.',
    body: `Feynman opened his course not with equations but with a question: if all scientific knowledge were lost and only one sentence could be passed on, which one would carry the most? His answer was the atomic hypothesis. The pages of this branch follow that spirit — the big picture before the details. They cover how the laws of physics fit together, why they are written in mathematics, how a new law is guessed and tested, and the attitudes Feynman prized: to doubt, to admit ignorance, to bend over backwards to show how you might be wrong, and to enjoy finding things out.`
  },
  { id: 'how-physics-works', kind: 'topic', parent: 'feynman-way', title: 'How physics works', short: 'Atoms, the map of basic physics, physics among the sciences, the law of gravitation as a model law, mathematics and physics, how new laws are found (FLP I-1 to I-3; Character, lectures 1, 2 and 7).',
    plan: [['atomic-hypothesis', 'The atomic hypothesis'], ['basic-physics', 'A map of basic physics'], ['physics-and-other-sciences', 'Physics and the other sciences'],
           ['law-of-gravitation-example', 'The law of gravitation as an example of physical law'], ['math-and-physics', 'The relation of mathematics to physics'], ['seeking-new-laws', 'Seeking new laws: guess, compute, compare']] },
  { id: 'scientific-attitude', kind: 'topic', parent: 'feynman-way', title: 'The scientific attitude', short: 'Doubt and the pleasure of finding things out, knowing a name versus knowing something, and scientific integrity.',
    plan: [['doubt-and-uncertainty', 'Doubt, uncertainty and the pleasure of finding things out'], ['knowing-vs-naming', 'Knowing the name versus knowing something'], ['cargo-cult-science', 'Cargo cult science and scientific integrity']] },

  /* ================================================================ MOTION, ENERGY, GRAVITATION */
  {
    id: 'motion-energy', kind: 'branch', parent: 'feynman', title: 'Motion, Energy and Gravitation', icon: 'mechanics', hue: 205,
    short: 'Conservation of energy, measuring time and distance, motion and the calculus, Newton\'s laws solved step by step, momentum, vectors, work and potential energy, and the theory of gravitation — including Feynman\'s "lost lecture" on why orbits are ellipses.',
    body: `Feynman taught mechanics the way it was discovered and the way it is used. Energy comes first, as an abstract bookkeeping — a number that never changes however the pieces are shuffled. Then motion: what speed means at an instant (the [[?derivative]]), how Newton's law predicts the future one small step at a time, why momentum is conserved, and why laws written with [[?vector|vectors]] do not care which way you face. Gravitation is the showcase: one simple law explains falling apples, tides, planets, galaxies — and Feynman's own geometric proof that the orbits are ellipses.`
  },
  { id: 'energy-and-motion', kind: 'topic', parent: 'motion-energy', title: 'Energy and motion', short: 'Conservation of energy, time and distance, motion and calculus, Newton\'s laws step by step, momentum, vectors, force, work and potential energy (FLP I-4 to I-14).',
    plan: [['conservation-of-energy', 'Conservation of energy'], ['time-and-distance', 'Time and distance: the scales of nature'], ['motion-and-calculus', 'Motion, speed and the calculus'],
           ['newtons-laws-numerically', 'Newton\'s laws, solved step by step'], ['conservation-of-momentum', 'Conservation of momentum'], ['vectors-and-symmetry', 'Vectors: laws that do not care which way you face'],
           ['characteristics-of-force', 'What a force is'], ['work-and-potential-energy', 'Work, potential energy and fields']] },
  { id: 'gravitation-topic', kind: 'topic', parent: 'motion-energy', title: 'Gravitation', short: 'The theory of gravitation, Kepler\'s laws and Newton\'s explanation, the lost lecture on ellipses, gravity against electricity (FLP I-7; Feynman\'s Lost Lecture).',
    plan: [['theory-of-gravitation', 'The theory of gravitation'], ['keplers-laws-feyn', 'Kepler\'s laws and Newton\'s explanation'], ['lost-lecture-ellipses', 'The lost lecture: why orbits are ellipses'], ['gravity-vs-electricity', 'Gravity and electricity: a factor of 10⁴²']] },

  /* ================================================================ LEAST ACTION */
  {
    id: 'least-action', kind: 'branch', parent: 'feynman', title: 'The Principle of Least Action', icon: 'route', hue: 280,
    short: 'Light takes the path of least time; a thrown ball takes the path of least action. Why nature seems to "know" the best path — and Feynman\'s answer: it tries them all, and the arrows of the others cancel.',
    body: `Newton's laws say what happens from one instant to the next. There is another way to say the same thing, all at once: of all the paths a particle could take between two points in a given time, it takes the one for which a certain number — the [[?action]] — is [[?stationary]]. Light does the same with time. Feynman loved this "whole path" view (he said a teacher, Mr Bader, showed it to him in high school) and built his own quantum mechanics on it: every path contributes an arrow, and near the path of stationary action the arrows line up. This branch shows the principle, the [[?lagrangian|Lagrangian]], the [[?variation|calculus of variations]], and the sum over histories.`
  },
  { id: 'least-time-action', kind: 'topic', parent: 'least-action', title: 'Least time and least action', short: 'The principle of least time, the principle of least action, the Lagrangian and Euler–Lagrange equation, the calculus of variations, least action in electrostatics (FLP I-26, II-19).',
    plan: [['least-time', 'The principle of least time'], ['least-action-mechanics', 'The principle of least action'], ['lagrangian-mechanics', 'The Lagrangian and the Euler–Lagrange equation'],
           ['calculus-of-variations', 'The calculus of variations'], ['least-action-fields', 'Least action for fields']] },
  { id: 'sum-over-paths', kind: 'topic', parent: 'least-action', title: 'The sum over paths', short: 'Why least action works, Feynman\'s path integral, and how classical physics emerges from quantum paths (FLP II-19; QED, ch. 2; Feynman 1948).',
    plan: [['why-least-action', 'Why nature seems to know the best path'], ['path-integral', 'Feynman\'s sum over histories'], ['classical-limit', 'How classical physics emerges from quantum paths']] },

  /* ================================================================ SYMMETRY */
  {
    id: 'symmetry-conservation', kind: 'branch', parent: 'feynman', title: 'Symmetry and Conservation', icon: 'mirror', hue: 330,
    short: 'The laws of physics do not change when you move, turn, wait — or, almost, look in a mirror. Each such symmetry brings a conservation law; the exceptions (parity violation) were among the great surprises of the century.',
    body: `A symmetry, in Feynman's use of Hermann Weyl's definition, is something you can do to a system that leaves it looking the same. The laws of physics have many: they are the same here and there, now and later, facing north or east, standing still or moving uniformly. Each of these symmetries goes hand in hand with a conserved quantity — momentum, energy, angular momentum. Nature is not symmetric in everything: in 1956–57 it turned out that the weak interaction can tell left from right. This branch explores symmetries, the great conservation laws, their quantum-mechanical meaning, and the mirror that is not quite a mirror.`
  },
  { id: 'symmetry-topic', kind: 'topic', parent: 'symmetry-conservation', title: 'Symmetry and conservation', short: 'Symmetry in physical law, the great conservation principles, symmetry and conservation in quantum mechanics, parity violation, matter and antimatter (FLP I-52, III-17; Character, lectures 3 and 4).',
    plan: [['symmetry-in-physical-law', 'Symmetry in physical law'], ['great-conservation-principles', 'The great conservation principles'], ['conservation-from-symmetry', 'Every symmetry gives a conservation law'],
           ['symmetry-and-conservation-qm', 'Symmetry and conservation in quantum mechanics'], ['parity-violation', 'Is nature left–right symmetric?'], ['matter-antimatter', 'Matter, antimatter and mirrors']] },

  /* ================================================================ RELATIVITY */
  {
    id: 'relativity-branch', kind: 'branch', parent: 'feynman', title: 'Space, Time and Relativity', icon: 'relativity', hue: 190,
    short: 'The principle of relativity, the Michelson–Morley experiment, the Lorentz transformation, simultaneity and time dilation, E = mc², the geometry of space-time, four-vectors, fields in moving frames, and curved space.',
    body: `If the laws of physics are the same for everyone moving uniformly, and one of those laws fixes the speed of light, then everyone measures the same speed of light — and space and time must bend to allow it. Feynman presented relativity as a consequence of symmetry, then turned it into geometry: space and time form one four-dimensional space-time in which a change of observer is a kind of rotation, and energy and momentum are the parts of a single [[?four-vector]]. At the end of volume II he gave a famous picture of curved space: bugs on a hot plate whose rulers expand in the heat.`
  },
  { id: 'special-relativity', kind: 'topic', parent: 'relativity-branch', title: 'Special relativity', short: 'The principle of relativity, Michelson–Morley, the Lorentz transformation, simultaneity, time dilation, relativistic energy and momentum (FLP I-15, I-16).',
    plan: [['principle-of-relativity', 'The principle of relativity'], ['michelson-morley-feyn', 'The Michelson–Morley experiment'], ['lorentz-transformation-feyn', 'The Lorentz transformation'],
           ['simultaneity-feyn', 'The relativity of simultaneity'], ['time-dilation-feyn', 'Moving clocks run slow'], ['relativistic-mass-energy', 'Relativistic energy, momentum and E = mc²']] },
  { id: 'spacetime-topic', kind: 'topic', parent: 'relativity-branch', title: 'Space-time', short: 'The geometry of space-time, four-vectors, electric and magnetic fields in moving frames, curved space (FLP I-17, II-25, II-26, II-42).',
    plan: [['spacetime-geometry', 'The geometry of space-time'], ['four-vectors-feyn', 'Four-vectors'], ['relativity-of-fields', 'Electric and magnetic fields in moving frames'], ['curved-space', 'Curved space and gravity']] },

  /* ================================================================ OSCILLATIONS AND WAVES */
  {
    id: 'vibrations-waves', kind: 'branch', parent: 'feynman', title: 'Rotation, Oscillations and Waves', icon: 'waves', hue: 160,
    short: 'Rotation and the gyroscope, the harmonic oscillator, complex numbers as rotating arrows, resonance, transients, linear systems, sound and the wave equation, beats, modes, harmonics and bow waves.',
    body: `Few ideas in physics recur as often as the oscillator: a mass on a spring, a pendulum, an electric circuit, an atom radiating light. Feynman used it to teach the most useful trick in physics — writing an oscillation as the real part of a rotating [[?complex-number|complex number]], [[?rotating-arrow|e^{iωt}]] — and devoted a whole lecture to the algebra behind it, ending with Euler's formula, which he called a jewel. From one oscillator he went to resonance, to how motion starts and dies, to superposition, and then to waves: sound, beats, standing modes, harmonics and the shock waves of a supersonic plane. Rotation and the surprising gyroscope open the branch.`
  },
  { id: 'oscillators', kind: 'topic', parent: 'vibrations-waves', title: 'Rotation and oscillators', short: 'Rotation, angular momentum and the gyroscope; the harmonic oscillator, complex numbers, resonance, transients and linear systems (FLP I-18 to I-25).',
    plan: [['rotation-feyn', 'Rotation, torque and angular momentum'], ['gyroscope-feyn', 'The gyroscope'], ['harmonic-oscillator-feyn', 'The harmonic oscillator'], ['algebra-complex-numbers', 'Algebra, complex numbers and Euler\'s formula'],
           ['resonance-feyn', 'Resonance'], ['transients-feyn', 'Transients: how oscillations start and die'], ['linear-systems', 'Linear systems and superposition']] },
  { id: 'waves-sound', kind: 'topic', parent: 'vibrations-waves', title: 'Waves and sound', short: 'Sound and the wave equation, beats, modes, harmonics and Fourier analysis, bow and shock waves (FLP I-47 to I-51).',
    plan: [['wave-equation-sound', 'Sound and the wave equation'], ['beats-feyn', 'Beats and group velocity'], ['modes-feyn', 'Modes of vibration'], ['harmonics-feyn', 'Harmonics and Fourier analysis'], ['waves-feyn', 'Bow waves, shock waves and surface waves']] },

  /* ================================================================ LIGHT */
  {
    id: 'light-optics', kind: 'branch', parent: 'feynman', title: 'Light and Vision', icon: 'light', hue: 50,
    short: 'Geometrical optics, radiation from an accelerated charge, interference, diffraction, why glass slows light, the blue sky, polarization, synchrotron light, colour vision and how eyes work.',
    body: `Feynman built the whole of classical optics on one formula: the electric field radiated by an accelerated charge, as seen from far away. With it and the rule that fields add, the rest follows — interference and diffraction, the refractive index (the slowing of light in glass turns out to be an illusion made by the added fields of the glass's own electrons), scattering and the blue sky, polarization, and the searing beams of synchrotrons. He finished with living optics: how three kinds of cone make colour, and how the eye and brain process light.`
  },
  { id: 'optics-topic', kind: 'topic', parent: 'light-optics', title: 'Optics and radiation', short: 'Geometrical optics, radiation, interference, diffraction, the refractive index, scattering, polarization, relativistic radiation (FLP I-26 to I-34).',
    plan: [['geometrical-optics-feyn', 'Geometrical optics'], ['radiation-accelerated-charge', 'Radiation from an accelerated charge'], ['interference-feyn', 'Interference'], ['diffraction-feyn', 'Diffraction and gratings'],
           ['origin-of-refractive-index', 'The origin of the refractive index'], ['scattering-blue-sky', 'Scattering and the blue sky'], ['polarization-feyn', 'Polarization'], ['synchrotron-radiation', 'Relativistic effects in radiation']] },
  { id: 'seeing', kind: 'topic', parent: 'light-optics', title: 'Seeing', short: 'Colour vision and the mechanisms of seeing (FLP I-35, I-36).',
    plan: [['color-vision-feyn', 'Colour vision'], ['mechanisms-of-seeing', 'How eyes work']] },

  /* ================================================================ HEAT AND CHANCE */
  {
    id: 'heat-chance', kind: 'branch', parent: 'feynman', title: 'Heat, Chance and the Arrow of Time', icon: 'dice', hue: 12,
    short: 'Probability and fluctuations, the kinetic theory of gases, Boltzmann\'s law, equipartition and its failure, Brownian motion, diffusion, the laws of thermodynamics, entropy, the ratchet and pawl — and why the past differs from the future.',
    body: `Heat is atoms in random motion. From that one idea and the laws of [[?probability]], Feynman derived the pressure of gases, the thinning of the atmosphere with height (the [[?boltzmann-factor]]), the jiggling of pollen grains, and the slow spread of a drop of ink by a [[?random-walk]]. He then showed what the second law of thermodynamics forbids with a beautiful machine that seems to extract work from random motion — the ratchet and pawl — and why it cannot. The deepest question comes last: every microscopic law runs equally well backwards, so why does time have a direction?`
  },
  { id: 'kinetic-statistical', kind: 'topic', parent: 'heat-chance', title: 'Atoms and chance', short: 'Probability and fluctuations, kinetic theory, Boltzmann\'s law, equipartition and its failure, Brownian motion, diffusion (FLP I-6, I-39 to I-43).',
    plan: [['probability-feyn', 'Probability and fluctuations'], ['kinetic-theory-feyn', 'The kinetic theory of gases'], ['boltzmann-law', 'Boltzmann\'s law and the atmosphere'],
           ['equipartition-failure', 'Equipartition, and where classical physics failed'], ['brownian-movement', 'Brownian motion'], ['diffusion-random-walk', 'Diffusion and the random walk']] },
  { id: 'thermo-arrow', kind: 'topic', parent: 'heat-chance', title: 'Thermodynamics and time', short: 'The laws of thermodynamics and Carnot\'s engine, entropy, the ratchet and pawl, the distinction of past and future (FLP I-44 to I-46; Character, lecture 5).',
    plan: [['laws-of-thermodynamics-feyn', 'The laws of thermodynamics and Carnot\'s engine'], ['entropy-and-order', 'Entropy and disorder'], ['ratchet-and-pawl', 'The ratchet and pawl'], ['past-and-future', 'The distinction of past and future']] },

  /* ================================================================ ELECTROMAGNETISM: FIELDS */
  {
    id: 'em-fields', kind: 'branch', parent: 'feynman', title: 'Electromagnetism: Fields', icon: 'em', hue: 230,
    short: 'The field idea, the calculus of vector fields (gradient, divergence, curl), Gauss\'s law, electrostatic energy, electricity in the atmosphere, dielectrics, analogies, magnetostatics, the vector potential and induction.',
    body: `Volume II begins with an estimate that startles every reader: two people standing an arm's length apart, each carrying just one per cent more electrons than protons, would push each other apart with a force comparable to the weight of the whole Earth. Electricity is overwhelmingly strong — and almost perfectly balanced. To describe it, Feynman introduced the language of [[?field|fields]] — the [[?gradient]], [[?divergence]] and [[?curl]] — and then used it everywhere: charges and conductors, thunderstorms, dielectrics, the surprising fact that the same equations describe heat flow and membranes, magnetism, the reality of the vector potential, and induction.`
  },
  { id: 'electrostatics-feyn', kind: 'topic', parent: 'em-fields', title: 'Electrostatics', short: 'The field idea, vector calculus, Gauss\'s law, electrostatic energy, atmospheric electricity, dielectrics and electrostatic analogues (FLP II-1 to II-12).',
    plan: [['em-introduction', 'Electromagnetism: the field idea'], ['vector-calculus-fields', 'The calculus of vector fields'], ['gauss-law-feyn', 'Gauss\'s law and electrostatics'], ['electrostatic-energy-feyn', 'Electrostatic energy'],
           ['atmospheric-electricity', 'Electricity in the atmosphere'], ['dielectrics-feyn', 'Dielectrics'], ['electrostatic-analogs', 'Same equations, same solutions']] },
  { id: 'magnetism-induction', kind: 'topic', parent: 'em-fields', title: 'Magnetism and induction', short: 'Magnetostatics, the vector potential, induction and the flux rule (FLP II-13 to II-17).',
    plan: [['magnetostatics-feyn', 'Magnetostatics'], ['vector-potential', 'The vector potential and its reality'], ['induction-laws', 'Induction and the flux rule']] },

  /* ================================================================ MAXWELL */
  {
    id: 'maxwell-branch', kind: 'branch', parent: 'feynman', title: 'Maxwell\'s Equations', icon: 'antenna', hue: 255,
    short: 'Maxwell\'s equations, waves in free space, fields of moving charges, field energy and momentum, Feynman\'s disk paradox, electromagnetic mass, charges in fields, waveguides and AC circuits.',
    body: `In one of his best-known remarks, Feynman judged that, from a long view of history, Maxwell's discovery of the laws of electrodynamics would be seen as the most significant event of the nineteenth century. Four equations — written with [[?divergence]] and [[?curl]] — contain all of electricity, magnetism and light. This branch shows them at work: waves that carry themselves through empty space, the fields of moving charges, energy flowing through space in unexpected places, a disk that must start turning when a current is switched off, the mass an electron gets from its own field, and the guided waves of cavities and circuits.`
  },
  { id: 'maxwell-topic', kind: 'topic', parent: 'maxwell-branch', title: 'Maxwell\'s equations and their consequences', short: 'The equations, free-space waves, retarded fields, field energy and momentum, the disk paradox, electromagnetic mass, charges in fields, waveguides, AC circuits (FLP II-18 to II-29).',
    plan: [['maxwell-equations-feyn', 'Maxwell\'s equations'], ['em-waves-feyn', 'Electromagnetic waves in free space'], ['retarded-potentials', 'Fields from moving charges and currents'], ['field-energy-momentum', 'Field energy and field momentum'],
           ['angular-momentum-paradox', 'Feynman\'s disk paradox'], ['electromagnetic-mass', 'Electromagnetic mass'], ['charges-in-fields', 'Charges moving in electric and magnetic fields'], ['waveguides-feyn', 'Waveguides and cavity resonators'], ['ac-circuits-feyn', 'AC circuits and impedance']] },

  /* ================================================================ MATTER */
  {
    id: 'matter-branch', kind: 'branch', parent: 'feynman', title: 'Inside Matter', icon: 'crystal', hue: 95,
    short: 'The geometry of crystals, tensors, why magnetism needs quantum mechanics, paramagnetism and magnetic resonance, ferromagnetism, elasticity, and the flow of "dry" and "wet" water.',
    body: `The second half of volume II turns the laws of electromagnetism and mechanics loose on real materials. Crystals repeat a pattern and so allow only certain symmetries; their properties need [[?tensor|tensors]]. Magnetism turns out to be impossible in classical physics — every magnet is a quantum effect — and magnetic resonance lets us flip nuclear spins with radio waves. Solids stretch and bend by the laws of elasticity; fluids flow, first in the idealised "dry water" without viscosity, then in real "wet water", where viscosity and turbulence rule — a problem Feynman called one of the great unsolved problems of classical physics.`
  },
  { id: 'solids-magnets', kind: 'topic', parent: 'matter-branch', title: 'Crystals, magnets and solids', short: 'Crystal geometry, tensors, the magnetism of matter, paramagnetism and magnetic resonance, ferromagnetism, elasticity (FLP II-30 to II-39).',
    plan: [['crystal-geometry', 'The geometry of crystals'], ['tensors-feyn', 'Tensors'], ['magnetism-of-matter', 'Why magnetism needs quantum mechanics'], ['paramagnetism-nmr', 'Paramagnetism and magnetic resonance'],
           ['ferromagnetism-feyn', 'Ferromagnetism'], ['elasticity-feyn', 'Elasticity']] },
  { id: 'fluids-feyn', kind: 'topic', parent: 'matter-branch', title: 'Fluids', short: 'The flow of "dry" water and of "wet" water: viscosity and turbulence (FLP II-40, II-41).',
    plan: [['flow-of-dry-water', 'The flow of "dry" water'], ['flow-of-wet-water', 'The flow of "wet" water: viscosity and turbulence']] },

  /* ================================================================ QUANTUM BEHAVIOUR */
  {
    id: 'quantum-behaviour', kind: 'branch', parent: 'feynman', title: 'Quantum Behaviour', icon: 'quantum', hue: 300,
    short: 'Bullets, waves and electrons at two slits, what happens when you watch, the uncertainty principle, wave and particle, probability amplitudes, identical particles — and what all this says about reality.',
    body: `Feynman began the quantum course with one experiment, which he said contains the only mystery: electrons sent one at a time towards two slits arrive as single lumps, like bullets, yet build up an interference pattern, like waves — and the pattern vanishes the moment you watch which slit each one uses. Nobody can explain *why* nature behaves this way; physics can only describe *how*, with a rule: every way something can happen gets a [[?amplitude|probability amplitude]], a complex number or arrow; indistinguishable ways add their arrows, and the [[?probability]] is the [[?absolute-square]] of the total. Everything in the next branches follows from that rule.`
  },
  { id: 'two-slits', kind: 'topic', parent: 'quantum-behaviour', title: 'The two-slit experiment', short: 'Bullets, waves and electrons; watching the electrons; the uncertainty principle; wave and particle viewpoints (FLP I-37, I-38, III-1, III-2).',
    plan: [['bullets-waves-electrons', 'Bullets, waves and electrons'], ['watching-electrons', 'Watching the electrons'], ['uncertainty-feyn', 'The uncertainty principle'], ['wave-and-particle', 'The wave and particle viewpoints']] },
  { id: 'amplitudes-topic', kind: 'topic', parent: 'quantum-behaviour', title: 'Amplitudes', short: 'The rules of probability amplitudes, identical particles, bosons and lasers, the exclusion principle, probability and reality (FLP III-3, III-4; Character, lecture 6).',
    plan: [['probability-amplitudes', 'Probability amplitudes and their rules'], ['identical-particles', 'Identical particles: bosons and fermions'], ['bosons-and-lasers', 'Bosons crowd together: lasers and black-body light'],
           ['exclusion-principle', 'The exclusion principle'], ['quantum-reality', 'Probability, uncertainty and reality']] },

  /* ================================================================ QUANTUM MECHANICS AT WORK */
  {
    id: 'quantum-mechanics-feyn', kind: 'branch', parent: 'feynman', title: 'Quantum Mechanics at Work', icon: 'atom', hue: 275,
    short: 'Spin filters, spin one-half, how amplitudes change in time, the Hamiltonian matrix, the ammonia maser, two-state systems, the 21-cm line, electrons in crystals, semiconductors, the Schrödinger equation, hydrogen, operators and superconductivity.',
    body: `Volume III does not start from the Schrödinger equation. Feynman started from the simplest quantum systems — atoms passing through Stern–Gerlach filters, a molecule that can sit in just two states — and built up the machinery from the rules of amplitudes: [[?base-states|base states]], [[?bra-ket|brackets]], the [[?matrix|Hamiltonian matrix]] that tells amplitudes how to change in time. Only then did he let the number of states become infinite, turning a chain of atoms into a wave equation. Along the way come the maser, the 21-cm radio line of hydrogen, the band structure of solids and transistors, the hydrogen atom and the periodic table, and superconductivity as quantum mechanics on a human scale.`
  },
  { id: 'spin-states', kind: 'topic', parent: 'quantum-mechanics-feyn', title: 'Spin and two-state systems', short: 'Spin-one filters, spin one-half, amplitudes in time, the Hamiltonian matrix, the ammonia maser, two-state systems, the hyperfine splitting of hydrogen (FLP III-5 to III-12).',
    plan: [['stern-gerlach-filters', 'Spin one: filtering atoms'], ['spin-half', 'Spin one-half'], ['amplitudes-in-time', 'How amplitudes change in time'], ['hamiltonian-matrix', 'The Hamiltonian matrix'],
           ['ammonia-maser', 'The ammonia maser'], ['two-state-systems', 'Two-state systems everywhere'], ['hyperfine-21cm', 'The hyperfine splitting of hydrogen']] },
  { id: 'waves-in-matter', kind: 'topic', parent: 'quantum-mechanics-feyn', title: 'Waves in matter', short: 'Electrons in a crystal, semiconductors, the Schrödinger equation, tunnelling, angular momentum, the hydrogen atom and the periodic table, operators, superconductivity (FLP III-13 to III-21).',
    plan: [['electrons-in-crystals', 'Electrons in a crystal lattice'], ['semiconductors-feyn', 'Semiconductors'], ['schrodinger-equation-feyn', 'The Schrödinger equation'], ['tunnelling-feyn', 'Tunnelling through barriers'],
           ['angular-momentum-quantum', 'Angular momentum in quantum mechanics'], ['hydrogen-and-periodic-table', 'The hydrogen atom and the periodic table'], ['operators-feyn', 'Operators'], ['superconductivity-feyn', 'Superconductivity']] },

  /* ================================================================ QED */
  {
    id: 'qed-branch', kind: 'branch', parent: 'feynman', title: 'QED: The Strange Theory of Light and Matter', icon: 'feyndiag', hue: 35,
    short: 'Light comes in clicks; each way it can go gets an arrow; the arrows add. Partial reflection, mirrors and gratings, lenses, the three basic actions of electrons and photons, Feynman diagrams, the electron\'s magnetic moment, renormalization and what lies beyond.',
    body: `In four lectures for a general audience, Feynman explained quantum electrodynamics — the theory of light and electrons — without equations. Imagine a tiny stopwatch hand turning as a photon travels: for each way the photon could go there is an [[?amplitude|arrow]], and the arrows for all the ways are added head to tail; the square of the final arrow's length is the probability. With nothing more he explained why glass reflects 4 % of light from each surface yet anywhere from 0 to 16 % from a sheet, why a mirror reflects at equal angles, how a grating makes colours, and why light seems to take the path of least time. Add electrons, and three basic actions — expressed as Feynman diagrams — account for all of chemistry and light, with a precision better than one part in a billion.`
  },
  { id: 'qed-light', kind: 'topic', parent: 'qed-branch', title: 'Photons and arrows', short: 'Light as particles, the rule of the arrows, partial reflection by glass, every path counts (mirrors and gratings), lenses and least time (QED, ch. 1 and 2).',
    plan: [['photons-as-particles', 'Light comes in clicks'], ['arrow-rule', 'The rule of the arrows'], ['partial-reflection', 'Partial reflection by glass'], ['every-path-counts', 'Every path counts: mirrors and gratings'], ['lens-and-least-time', 'Lenses, least time and the arrows']] },
  { id: 'qed-matter', kind: 'topic', parent: 'qed-branch', title: 'Electrons and their interactions', short: 'Three basic actions, Feynman diagrams, the magnetic moment of the electron, renormalization, beyond QED (QED, ch. 3 and 4).',
    plan: [['three-basic-actions', 'Electrons and photons: three basic actions'], ['feynman-diagrams', 'Feynman diagrams'], ['magnetic-moment-g2', 'The electron\'s magnetic moment'], ['renormalization-idea', 'Renormalization: taming the infinities'], ['beyond-qed', 'Beyond QED: quarks, gluons and the weak force']] },

  /* ================================================================ FRONTIERS */
  {
    id: 'frontiers', kind: 'branch', parent: 'feynman', title: 'Feynman\'s Frontiers', icon: 'sparkle', hue: 60,
    short: 'Ideas Feynman launched beyond the lectures: nanotechnology, quantum computers, the physics of computation, superfluid helium, the weak interaction, partons inside the proton, the Challenger O-ring — and his life in physics.',
    body: `Some of Feynman's most influential contributions were a single talk or paper. In 1959 he invited physicists to write the Encyclopaedia Britannica on the head of a pin. In 1981 he argued that nature, being quantum, can only be simulated efficiently by a quantum computer. He explained superfluid helium, found (with Murray Gell-Mann) the form of the weak interaction, proposed that protons are made of point-like "partons", and in 1986 showed a televised hearing why the Space Shuttle Challenger was lost, with a clamp, a piece of rubber and a glass of iced water. The branch ends with a timeline of his life in physics.`
  },
  { id: 'feynman-ideas', kind: 'topic', parent: 'frontiers', title: 'Feynman\'s ideas and life', short: 'Room at the bottom, simulating physics with computers, the physics of computation, superfluid helium, the V−A theory, partons, the Challenger O-ring, his life in physics.',
    plan: [['room-at-the-bottom', 'There\'s plenty of room at the bottom'], ['quantum-computing-origin', 'Simulating physics with computers'], ['computation-reversible', 'The physics of computation'], ['superfluid-helium', 'Superfluid helium, rotons and vortices'],
           ['weak-interaction-v-a', 'The V−A theory of the weak interaction'], ['parton-model', 'Partons: looking inside the proton'], ['challenger-o-ring', 'The Challenger O-ring'], ['feynman-life', 'Richard Feynman\'s life in physics']] }
);
