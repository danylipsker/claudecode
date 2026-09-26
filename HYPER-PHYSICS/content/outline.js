/* HYPER-PHYSICS · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the branch files (mechanics.js, electromagnetism.js, ...) and
 * hang under these topics with `parent: '<topic id>'`.
 *
 * `plan` lists the concepts each topic is meant to hold, [id, title]. The
 * validator reports planned concepts that are still missing, and authors use
 * the ids to link across branches before every page exists.
 */
Hyper.add(
  {
    id: 'physics', kind: 'root', title: 'Hyper Physics',
    short: 'Physics as a web of connected ideas. Every concept has a map of what it builds on and leads to, formulas you can solve for any variable, simulations to play with, and practice with worked solutions.',
    body: ''
  },

  /* ================================================================ MECHANICS */
  {
    id: 'mechanics', kind: 'branch', parent: 'physics', title: 'Mechanics', icon: 'mechanics', hue: 212,
    short: 'How things move and why: motion, forces, energy, momentum, rotation, gravity, oscillations and fluids.',
    body: 'Mechanics is where physics begins and where most of its tools are forged. A handful of ideas — position and its rates of change, force, energy and momentum — describe a thrown ball, a planet in orbit, a spinning wheel and the water in a pipe. Start with **describing motion**, then learn **why** it changes with Newton\'s laws, and finally meet the great **conservation laws** that let you skip the details altogether.'
  },
  { id: 'kinematics', kind: 'topic', parent: 'mechanics', title: 'Describing motion', short: 'Position, velocity and acceleration, and the equations that link them.',
    plan: [['position-displacement', 'Position and displacement'], ['speed-velocity', 'Speed and velocity'], ['acceleration', 'Acceleration'], ['motion-graphs', 'Motion graphs'],
           ['constant-acceleration', 'Equations of constant acceleration'], ['free-fall', 'Free fall'], ['relative-velocity', 'Relative velocity'], ['projectile-motion', 'Projectile motion'], ['uniform-circular-motion', 'Uniform circular motion']] },
  { id: 'dynamics', kind: 'topic', parent: 'mechanics', title: 'Forces and Newton\'s laws', short: 'What makes motion change: forces, mass and the three laws.',
    plan: [['force', 'Force'], ['newtons-first-law', 'Newton\'s first law'], ['newtons-second-law', 'Newton\'s second law'], ['newtons-third-law', 'Newton\'s third law'], ['weight-mass', 'Weight and mass'],
           ['free-body-diagrams', 'Free-body diagrams'], ['normal-force', 'Normal force'], ['friction', 'Friction'], ['tension-pulleys', 'Tension and pulleys'], ['inclined-plane', 'Inclined plane'],
           ['centripetal-force', 'Centripetal force'], ['drag-force', 'Air resistance and terminal velocity']] },
  { id: 'work-energy', kind: 'topic', parent: 'mechanics', title: 'Work and energy', short: 'Energy is what a force transfers by acting over a distance, and its total never changes.',
    plan: [['work', 'Work'], ['kinetic-energy', 'Kinetic energy'], ['work-energy-theorem', 'Work–energy theorem'], ['gravitational-potential-energy', 'Gravitational potential energy'],
           ['elastic-potential-energy', 'Elastic potential energy'], ['conservative-forces', 'Conservative forces'], ['conservation-of-energy', 'Conservation of energy'], ['power', 'Power'], ['efficiency', 'Efficiency']] },
  { id: 'momentum-collisions', kind: 'topic', parent: 'mechanics', title: 'Momentum and collisions', short: 'Mass in motion, how forces change it over time, and why the total is conserved.',
    plan: [['momentum', 'Momentum'], ['impulse', 'Impulse'], ['conservation-of-momentum', 'Conservation of momentum'], ['elastic-collisions', 'Elastic collisions'], ['inelastic-collisions', 'Inelastic collisions'],
           ['center-of-mass', 'Centre of mass'], ['rocket-propulsion', 'Rocket propulsion']] },
  { id: 'rotation', kind: 'topic', parent: 'mechanics', title: 'Rotational motion', short: 'Spinning things: angular motion, torque, moment of inertia and angular momentum.',
    plan: [['angular-kinematics', 'Angular kinematics'], ['torque', 'Torque'], ['moment-of-inertia', 'Moment of inertia'], ['rotational-dynamics', 'Newton\'s second law for rotation'],
           ['rotational-kinetic-energy', 'Rotational kinetic energy'], ['rolling-motion', 'Rolling motion'], ['angular-momentum', 'Angular momentum'], ['static-equilibrium', 'Static equilibrium']] },
  { id: 'gravitation', kind: 'topic', parent: 'mechanics', title: 'Gravitation', short: 'The universal attraction between masses, from falling apples to planetary orbits.',
    plan: [['newtons-law-of-gravitation', 'Newton\'s law of gravitation'], ['gravitational-field', 'Gravitational field'], ['gravitational-potential', 'Gravitational potential energy (general)'],
           ['circular-orbits', 'Circular orbits'], ['keplers-laws', 'Kepler\'s laws'], ['escape-velocity', 'Escape velocity'], ['tides', 'Tides']] },
  { id: 'oscillations', kind: 'topic', parent: 'mechanics', title: 'Oscillations', short: 'Motion that repeats: springs, pendulums, damping and resonance.',
    plan: [['simple-harmonic-motion', 'Simple harmonic motion'], ['mass-spring-system', 'Mass on a spring'], ['simple-pendulum', 'Simple pendulum'], ['physical-pendulum', 'Physical pendulum'],
           ['energy-in-shm', 'Energy in simple harmonic motion'], ['damped-oscillations', 'Damped oscillations'], ['driven-oscillations', 'Driven oscillations and resonance']] },
  { id: 'fluids', kind: 'topic', parent: 'mechanics', title: 'Fluids', short: 'Liquids and gases at rest and in motion: pressure, buoyancy and flow.',
    plan: [['density', 'Density'], ['pressure', 'Pressure'], ['hydrostatic-pressure', 'Pressure in a fluid at rest'], ['pascals-principle', 'Pascal\'s principle'], ['buoyancy', 'Buoyancy and Archimedes\' principle'],
           ['continuity-equation', 'Continuity equation'], ['bernoullis-equation', 'Bernoulli\'s equation'], ['viscosity', 'Viscosity and Poiseuille flow'], ['surface-tension', 'Surface tension']] },
  { id: 'elasticity', kind: 'topic', parent: 'mechanics', title: 'Elasticity', short: 'How solids stretch, squeeze and shear under load, and spring back.',
    plan: [['hookes-law', 'Hooke\'s law'], ['stress-strain', 'Stress, strain and Young\'s modulus'], ['shear-bulk-modulus', 'Shear and bulk modulus']] },

  /* ================================================================ ELECTRICITY AND MAGNETISM */
  {
    id: 'electromagnetism', kind: 'branch', parent: 'physics', title: 'Electricity & Magnetism', icon: 'em', hue: 35,
    short: 'Charges, fields, circuits and currents, magnets, induction and the light that ties them together.',
    body: 'Electric charge comes in two kinds, and everything electrical follows from how charges push and pull on each other. Fields turn that action at a distance into something you can map; potential turns it into energy per charge. Moving charges make currents and magnetism, changing magnetism makes currents again, and the loop closes in Maxwell\'s equations, whose waves are light.'
  },
  { id: 'electrostatics', kind: 'topic', parent: 'electromagnetism', title: 'Electrostatics', short: 'Charges at rest: forces, fields, potential and stored energy.',
    plan: [['electric-charge', 'Electric charge'], ['coulombs-law', 'Coulomb\'s law'], ['electric-field', 'Electric field'], ['gauss-law', 'Gauss\'s law'], ['electric-potential', 'Electric potential'],
           ['electric-potential-energy', 'Electric potential energy'], ['capacitance', 'Capacitance'], ['capacitors-combinations', 'Capacitors in series and parallel'], ['dielectrics', 'Dielectrics'], ['energy-in-capacitor', 'Energy stored in a capacitor']] },
  { id: 'dc-circuits', kind: 'topic', parent: 'electromagnetism', title: 'Direct-current circuits', short: 'Current, resistance, power and the rules for networks of components.',
    plan: [['electric-current', 'Electric current'], ['ohms-law', 'Ohm\'s law and resistance'], ['resistivity', 'Resistivity'], ['electric-power', 'Electric power'], ['resistors-combinations', 'Resistors in series and parallel'],
           ['kirchhoffs-laws', 'Kirchhoff\'s laws'], ['emf-internal-resistance', 'EMF and internal resistance'], ['rc-circuits', 'RC circuits']] },
  { id: 'magnetism', kind: 'topic', parent: 'electromagnetism', title: 'Magnetism', short: 'Magnetic fields, the forces they exert on moving charges, and the currents that make them.',
    plan: [['magnetic-field', 'Magnetic field'], ['lorentz-force', 'Magnetic force on a moving charge'], ['charged-particle-motion', 'Charged particles in a magnetic field'], ['force-on-current', 'Force on a current-carrying wire'],
           ['torque-on-loop', 'Torque on a current loop and motors'], ['field-of-wire', 'Magnetic field of a wire (Biot–Savart)'], ['amperes-law', 'Ampère\'s law'], ['solenoid', 'Solenoids and electromagnets'], ['hall-effect', 'Hall effect']] },
  { id: 'induction', kind: 'topic', parent: 'electromagnetism', title: 'Electromagnetic induction', short: 'Changing magnetic flux drives currents: generators, inductors and transformers.',
    plan: [['magnetic-flux', 'Magnetic flux'], ['faradays-law', 'Faraday\'s law'], ['lenzs-law', 'Lenz\'s law'], ['motional-emf', 'Motional EMF'], ['generators', 'Generators'],
           ['inductance', 'Inductance'], ['energy-in-inductor', 'Energy in a magnetic field'], ['rl-circuits', 'RL circuits'], ['transformers', 'Transformers']] },
  { id: 'ac-circuits', kind: 'topic', parent: 'electromagnetism', title: 'Alternating current', short: 'Sinusoidal voltages and currents, reactance, impedance and resonance.',
    plan: [['alternating-current', 'Alternating current and RMS values'], ['reactance', 'Capacitive and inductive reactance'], ['rlc-impedance', 'RLC circuits and impedance'], ['lc-resonance', 'Resonance in RLC circuits'], ['ac-power', 'Power in AC circuits']] },
  { id: 'em-waves', kind: 'topic', parent: 'electromagnetism', title: 'Electromagnetic waves', short: 'Maxwell\'s equations and the waves they predict: radio, light, X-rays.',
    plan: [['maxwells-equations', 'Maxwell\'s equations'], ['electromagnetic-waves', 'Electromagnetic waves'], ['em-spectrum', 'The electromagnetic spectrum'], ['em-wave-energy', 'Energy and intensity of EM waves'], ['radiation-pressure', 'Radiation pressure']] },

  /* ================================================================ LIGHT AND VISION */
  {
    id: 'light', kind: 'branch', parent: 'physics', title: 'Light & Vision', icon: 'light', hue: 272,
    short: 'Rays and waves of light: mirrors, lenses and instruments, interference and diffraction, colour and the eye.',
    body: 'Light can be followed as rays when the things it meets are large compared with its wavelength — that is geometric optics, the physics of mirrors, lenses, cameras and telescopes. When the openings shrink to a few wavelengths, light shows that it is a wave: it interferes, diffracts and polarizes. And at the end of every optical path is an eye and a brain that turn wavelengths into colour.'
  },
  { id: 'geometric-optics', kind: 'topic', parent: 'light', title: 'Geometric optics', short: 'Light as rays: reflection, refraction, mirrors, lenses and optical instruments.',
    plan: [['reflection', 'Reflection'], ['plane-mirrors', 'Plane mirrors'], ['spherical-mirrors', 'Spherical mirrors'], ['refraction', 'Refraction and Snell\'s law'], ['total-internal-reflection', 'Total internal reflection'],
           ['dispersion', 'Dispersion and prisms'], ['thin-lenses', 'Thin lenses'], ['lensmakers-equation', 'The lensmaker\'s equation'], ['magnification', 'Magnification'], ['optical-instruments', 'Optical instruments']] },
  { id: 'wave-optics', kind: 'topic', parent: 'light', title: 'Wave optics', short: 'Light as a wave: interference, diffraction, resolution and polarization.',
    plan: [['huygens-principle', 'Huygens\' principle'], ['double-slit', 'Young\'s double slit'], ['thin-film-interference', 'Thin-film interference'], ['single-slit-diffraction', 'Single-slit diffraction'],
           ['diffraction-grating', 'Diffraction grating'], ['resolution', 'Resolving power'], ['polarization', 'Polarization and Malus\'s law'], ['brewsters-angle', 'Brewster\'s angle']] },
  { id: 'vision-color', kind: 'topic', parent: 'light', title: 'Vision and colour', short: 'How the eye forms images, how glasses correct it, and where colour comes from.',
    plan: [['the-eye', 'The eye'], ['vision-correction', 'Vision defects and correction'], ['color-vision', 'Colour vision'], ['color-mixing', 'Additive and subtractive colour'], ['light-intensity', 'Intensity and the inverse-square law']] },

  /* ================================================================ HEAT AND THERMODYNAMICS */
  {
    id: 'heat', kind: 'branch', parent: 'physics', title: 'Heat & Thermodynamics', icon: 'heat', hue: 8,
    short: 'Temperature, heat and how it moves, the gas laws seen from the molecules, and the laws of engines and entropy.',
    body: 'Heat is energy on the move because of a temperature difference. Following it explains why metal feels colder than wood, why a pot of water takes so long to boil and why a gas pushes harder when warmed. Counting molecules turns the gas laws into mechanics, and the laws of thermodynamics set the limits every engine, refrigerator and living thing must obey.'
  },
  { id: 'temperature-heat', kind: 'topic', parent: 'heat', title: 'Temperature and heat', short: 'What a thermometer measures, how much heat a change of temperature or phase takes.',
    plan: [['temperature', 'Temperature and temperature scales'], ['thermal-expansion', 'Thermal expansion'], ['heat-internal-energy', 'Heat and internal energy'], ['specific-heat', 'Specific heat and calorimetry'], ['latent-heat', 'Phase changes and latent heat']] },
  { id: 'heat-transfer', kind: 'topic', parent: 'heat', title: 'Heat transfer', short: 'The three ways heat travels: conduction, convection and radiation.',
    plan: [['conduction', 'Conduction'], ['convection', 'Convection'], ['thermal-radiation', 'Thermal radiation (Stefan–Boltzmann)'], ['newtons-law-of-cooling', 'Newton\'s law of cooling']] },
  { id: 'kinetic-theory', kind: 'topic', parent: 'heat', title: 'Gases and kinetic theory', short: 'The gas laws, and the molecular motion behind them.',
    plan: [['ideal-gas-law', 'The ideal gas law'], ['kinetic-theory-gases', 'Kinetic theory of gases'], ['maxwell-boltzmann', 'Molecular speeds (Maxwell–Boltzmann)'], ['equipartition', 'Equipartition of energy'], ['mean-free-path', 'Mean free path']] },
  { id: 'thermodynamics', kind: 'topic', parent: 'heat', title: 'Laws of thermodynamics', short: 'Energy bookkeeping, the direction of time, engines, refrigerators and entropy.',
    plan: [['zeroth-law', 'Zeroth law and thermal equilibrium'], ['first-law-thermodynamics', 'First law of thermodynamics'], ['thermodynamic-processes', 'Thermodynamic processes'], ['second-law-thermodynamics', 'Second law of thermodynamics'],
           ['heat-engines', 'Heat engines'], ['carnot-cycle', 'The Carnot cycle'], ['refrigerators-heat-pumps', 'Refrigerators and heat pumps'], ['entropy', 'Entropy'], ['third-law', 'Third law and absolute zero']] },

  /* ================================================================ SOUND AND HEARING */
  {
    id: 'sound', kind: 'branch', parent: 'physics', title: 'Sound & Hearing', icon: 'sound', hue: 150,
    short: 'Waves in general, sound in particular: speed, loudness, the Doppler effect, resonance, music and the ear.',
    body: 'A wave carries energy without carrying the medium along. Sound is the pressure wave our ears were built for, and nearly everything about it — why a voice changes pitch as a car passes, why a flute and a violin sound different on the same note, why a whisper carries across a quiet lake — follows from a few wave ideas: speed, frequency, superposition and resonance.'
  },
  { id: 'wave-basics', kind: 'topic', parent: 'sound', title: 'Waves', short: 'What every wave shares: wavelength, frequency, speed, superposition and standing waves.',
    plan: [['wave-properties', 'Wave properties'], ['transverse-longitudinal', 'Transverse and longitudinal waves'], ['waves-on-strings', 'Waves on a string'], ['superposition', 'Superposition and interference'],
           ['standing-waves', 'Standing waves'], ['wave-reflection', 'Reflection and transmission of waves']] },
  { id: 'sound-waves', kind: 'topic', parent: 'sound', title: 'Sound', short: 'Pressure waves in air: speed, intensity, decibels, Doppler shifts and resonating pipes.',
    plan: [['speed-of-sound', 'Speed of sound'], ['sound-intensity', 'Sound intensity and decibels'], ['doppler-effect', 'The Doppler effect'], ['beats', 'Beats'],
           ['air-columns', 'Resonance in air columns'], ['shock-waves', 'Shock waves and sonic booms'], ['ultrasound', 'Ultrasound']] },
  { id: 'hearing-music', kind: 'topic', parent: 'sound', title: 'Hearing and music', short: 'How the ear hears, what makes a note, and how instruments make them.',
    plan: [['the-ear', 'The ear'], ['loudness-pitch', 'Loudness and pitch'], ['harmonics-timbre', 'Harmonics and timbre'], ['musical-scales', 'Musical scales'], ['musical-instruments', 'Musical instruments']] },

  /* ================================================================ RELATIVITY */
  {
    id: 'relativity', kind: 'branch', parent: 'physics', title: 'Relativity', icon: 'relativity', hue: 330,
    short: 'Space and time mixed by motion and bent by gravity: time dilation, length contraction, E = mc² and black holes.',
    body: 'Two assumptions — the laws of physics are the same for every observer moving steadily, and all of them measure the same speed of light — force a new picture of space and time. Moving clocks run slow, moving rulers shrink, and mass turns out to be a form of energy. Add gravity and the picture becomes curved spacetime, with black holes and ripples that were detected a century after they were predicted.'
  },
  { id: 'special-relativity', kind: 'topic', parent: 'relativity', title: 'Special relativity', short: 'Uniform motion and the speed of light: time, length, simultaneity, momentum and energy.',
    plan: [['relativity-postulates', 'The postulates of special relativity'], ['time-dilation', 'Time dilation'], ['length-contraction', 'Length contraction'], ['simultaneity', 'Relativity of simultaneity'],
           ['lorentz-transformation', 'Lorentz transformation'], ['velocity-addition', 'Relativistic velocity addition'], ['relativistic-momentum', 'Relativistic momentum'], ['mass-energy', 'Mass–energy equivalence'],
           ['relativistic-energy', 'Relativistic energy'], ['relativistic-doppler', 'Relativistic Doppler effect'], ['spacetime-interval', 'Spacetime and the invariant interval'], ['twin-paradox', 'The twin paradox']] },
  { id: 'general-relativity', kind: 'topic', parent: 'relativity', title: 'General relativity', short: 'Gravity as curved spacetime: equivalence, gravitational time dilation, black holes, waves.',
    plan: [['equivalence-principle', 'The equivalence principle'], ['gravitational-time-dilation', 'Gravitational time dilation'], ['gravitational-lensing', 'Gravitational lensing'], ['black-holes', 'Black holes'], ['gravitational-waves', 'Gravitational waves']] },

  /* ================================================================ QUANTUM PHYSICS */
  {
    id: 'quantum', kind: 'branch', parent: 'physics', title: 'Quantum Physics', icon: 'quantum', hue: 248,
    short: 'Light in packets, matter as waves, atoms with energy levels, and the Schrödinger equation.',
    body: 'Around 1900 physics met things it could not explain: the colours of hot objects, electrons knocked out of metal by light, the sharp lines in the light of atoms. The answers — energy comes in quanta, light behaves as particles and matter as waves — built quantum mechanics, the most precisely tested theory we have, and the physics behind lasers, chips and chemistry.'
  },
  { id: 'quantum-origins', kind: 'topic', parent: 'quantum', title: 'Birth of quantum physics', short: 'The experiments that forced quanta on physics: blackbody light, photons, matter waves.',
    plan: [['blackbody-radiation', 'Blackbody radiation'], ['photon', 'The photon'], ['photoelectric-effect', 'The photoelectric effect'], ['compton-scattering', 'Compton scattering'],
           ['de-broglie-wavelength', 'Matter waves (de Broglie)'], ['wave-particle-duality', 'Wave–particle duality'], ['uncertainty-principle', 'The uncertainty principle']] },
  { id: 'atomic-physics', kind: 'topic', parent: 'quantum', title: 'Atoms', short: 'Energy levels, spectra, quantum numbers, the periodic table, X-rays and lasers.',
    plan: [['bohr-model', 'The Bohr model'], ['hydrogen-spectrum', 'The hydrogen spectrum'], ['quantum-numbers', 'Quantum numbers'], ['electron-spin', 'Electron spin'], ['pauli-exclusion', 'Pauli exclusion and the periodic table'],
           ['x-rays', 'X-rays'], ['lasers', 'Lasers']] },
  { id: 'quantum-mechanics', kind: 'topic', parent: 'quantum', title: 'Quantum mechanics', short: 'Wavefunctions and the Schrödinger equation, with its simplest solutions.',
    plan: [['wavefunction', 'The wavefunction'], ['schrodinger-equation', 'The Schrödinger equation'], ['particle-in-a-box', 'Particle in a box'], ['quantum-tunneling', 'Quantum tunnelling'],
           ['quantum-harmonic-oscillator', 'Quantum harmonic oscillator'], ['hydrogen-atom-quantum', 'The hydrogen atom, quantum mechanically']] },

  /* ================================================================ NUCLEAR AND PARTICLE PHYSICS */
  {
    id: 'nuclear', kind: 'branch', parent: 'physics', title: 'Nuclear & Particle Physics', icon: 'nuclear', hue: 88,
    short: 'The nucleus and its energy: radioactivity, half-life, fission, fusion, and the particles everything is made of.',
    body: 'A nucleus is a hundred thousand times smaller than its atom but holds almost all of its mass, bound by a force strong enough to outweigh the electric repulsion of its protons. Rearranging nuclei releases millions of times more energy than chemistry: in decays, in reactors, in the Sun. Deeper still are quarks and leptons, the particles of the Standard Model.'
  },
  { id: 'the-nucleus', kind: 'topic', parent: 'nuclear', title: 'The nucleus', short: 'Protons and neutrons, isotopes, nuclear size, and the binding energy that holds them.',
    plan: [['nuclear-structure', 'Nuclear structure and isotopes'], ['nuclear-size', 'Nuclear size and density'], ['strong-force', 'The strong nuclear force'], ['binding-energy', 'Mass defect and binding energy']] },
  { id: 'radioactivity', kind: 'topic', parent: 'nuclear', title: 'Radioactivity', short: 'Unstable nuclei: kinds of decay, half-life, activity, dating and radiation dose.',
    plan: [['radioactive-decay', 'Types of radioactive decay'], ['half-life', 'Decay law and half-life'], ['activity', 'Activity'], ['radiocarbon-dating', 'Radiocarbon dating'], ['radiation-dose', 'Radiation dose and its effects']] },
  { id: 'nuclear-reactions', kind: 'topic', parent: 'nuclear', title: 'Nuclear reactions', short: 'Energy from splitting and joining nuclei: Q-values, fission, reactors and fusion.',
    plan: [['q-value', 'Nuclear reactions and Q-value'], ['fission', 'Nuclear fission'], ['nuclear-reactors', 'Nuclear reactors'], ['fusion', 'Nuclear fusion']] },
  { id: 'particle-physics', kind: 'topic', parent: 'nuclear', title: 'Particle physics', short: 'Quarks, leptons, the four forces, antimatter and the Standard Model.',
    plan: [['fundamental-forces', 'The four fundamental forces'], ['standard-model', 'The Standard Model'], ['quarks', 'Quarks and hadrons'], ['antimatter', 'Antimatter'], ['particle-accelerators', 'Particle accelerators']] },

  /* ================================================================ CONDENSED MATTER */
  {
    id: 'condensed-matter', kind: 'branch', parent: 'physics', title: 'Condensed Matter', icon: 'condensed', hue: 188,
    short: 'Solids from the atoms up: crystals, electrons in metals, bands, semiconductors, magnetism and superconductivity.',
    body: 'Put 10²³ atoms together and new behaviour appears that no single atom shows: metals that conduct, insulators that do not, semiconductors that can be switched, magnets and superconductors. Condensed-matter physics explains these properties from quantum mechanics and is the science behind every transistor, LED, solar cell and hard disk.'
  },
  { id: 'solid-state', kind: 'topic', parent: 'condensed-matter', title: 'Solids and electrons', short: 'Crystal lattices, free electrons in metals, energy bands and semiconductors.',
    plan: [['crystal-structure', 'Crystal structure'], ['free-electron-model', 'Electrons in metals and drift velocity'], ['band-theory', 'Energy bands: conductors, insulators, semiconductors'], ['fermi-energy', 'Fermi energy'],
           ['semiconductors', 'Semiconductors and doping'], ['pn-junction', 'The p–n junction and the diode'], ['heat-capacity-solids', 'Heat capacity of solids']] },
  { id: 'material-properties', kind: 'topic', parent: 'condensed-matter', title: 'Magnetism and superconductivity', short: 'How materials respond to magnetic fields, and how some lose all resistance.',
    plan: [['magnetic-materials', 'Dia-, para- and ferromagnetism'], ['superconductivity', 'Superconductivity']] },

  /* ================================================================ ASTROPHYSICS */
  {
    id: 'astrophysics', kind: 'branch', parent: 'physics', title: 'Astrophysics', icon: 'astro', hue: 292,
    short: 'Physics on the largest scales: the Sun and planets, the life of stars, and the expanding universe.',
    body: 'Every other branch meets here. Gravity shapes orbits and collapses stars; nuclear fusion powers them; quantum physics explains their spectra; relativity governs black holes and the expanding universe. Astrophysics is also a detective story: almost everything we know comes from light gathered across enormous distances.'
  },
  { id: 'solar-system', kind: 'topic', parent: 'astrophysics', title: 'The Sun and planets', short: 'Our star\'s output, and the planets that orbit it.',
    plan: [['the-sun', 'The Sun'], ['planets', 'The planets'], ['solar-constant', 'Solar energy and planetary temperature']] },
  { id: 'stars', kind: 'topic', parent: 'astrophysics', title: 'Stars', short: 'Distances, brightness, colour and temperature, and how stars live and die.',
    plan: [['stellar-parallax', 'Parallax and stellar distances'], ['stellar-magnitude', 'Luminosity and magnitude'], ['stellar-spectra', 'Stellar spectra and temperature'], ['hr-diagram', 'The Hertzsprung–Russell diagram'],
           ['stellar-evolution', 'Stellar evolution'], ['compact-stars', 'White dwarfs and neutron stars']] },
  { id: 'cosmology', kind: 'topic', parent: 'astrophysics', title: 'Cosmology', short: 'The universe as a whole: expansion, the big bang, its afterglow and its dark ingredients.',
    plan: [['hubbles-law', 'Hubble\'s law and redshift'], ['big-bang', 'The big bang'], ['cosmic-microwave-background', 'The cosmic microwave background'], ['dark-matter-energy', 'Dark matter and dark energy']] }
);
