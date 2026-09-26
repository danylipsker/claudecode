/* HYPER-PHYSICS · content/em-waves.js — Maxwell's equations and the waves they
 * predict: from radio to gamma rays, with their energy and momentum. */
Hyper.add(

{
  id: 'maxwells-equations', parent: 'em-waves', title: 'Maxwell\'s equations', level: 3,
  short: 'Four equations that contain all of classical electricity and magnetism — and predict that light is an electromagnetic wave travelling at 1/√(μ₀ε₀).',
  keywords: ['Maxwell', 'Maxwell equations', 'displacement current', 'Ampère–Maxwell law', 'Gauss', 'Faraday', 'no magnetic monopoles', 'speed of light', 'divergence', 'curl', 'electromagnetism'],
  prereq: ['gauss-law', 'faradays-law', 'amperes-law', 'math:curl'],
  related: ['electromagnetic-waves', 'magnetic-flux', 'lorentz-force', 'relativity-postulates', 'math:stokes-theorem', 'math:divergence-theorem'],
  body: `
By the 1860s the laws of electricity and magnetism were known one by one: how charges make electric fields ([[gauss-law|Gauss]]), how currents make magnetic fields ([[amperes-law|Ampère]]), how a changing magnetic field makes an electric one ([[faradays-law|Faraday]]). James Clerk Maxwell set out to write them as one consistent theory — and found that one of them was incomplete. His repair turned four separate laws into a single system that predicted something new: waves of electric and magnetic field travelling at the speed of light.

### The four equations
In integral form, for fields in a vacuum with charges and currents present:

| Law | Equation | What it says |
|---|---|---|
| Gauss (electric) | $\\oint \\vec E \\cdot d\\vec A = \\dfrac{Q_\\text{enc}}{\\varepsilon_0}$ | charges are the sources and sinks of $\\vec E$ |
| Gauss (magnetic) | $\\oint \\vec B \\cdot d\\vec A = 0$ | there are no magnetic charges; $\\vec B$ lines always close |
| Faraday | $\\oint \\vec E \\cdot d\\vec \\ell = -\\dfrac{d\\Phi_B}{dt}$ | a changing magnetic flux drives a circulating $\\vec E$ |
| Ampère–Maxwell | $\\oint \\vec B \\cdot d\\vec \\ell = \\mu_0 I_\\text{enc} + \\mu_0\\varepsilon_0\\dfrac{d\\Phi_E}{dt}$ | currents **and changing electric flux** drive a circulating $\\vec B$ |

Together with the force law $\\vec F = q(\\vec E + \\vec v \\times \\vec B)$ ([[lorentz-force]]), they describe every electric and magnetic phenomenon outside the quantum world: motors, generators, radio, radar, rainbows.

### The missing term
Ampère's original law said the circulation of $\\vec B$ round a loop equals $\\mu_0$ times the current through **any** surface bounded by the loop. Now charge a capacitor. Take a flat surface that the wire pierces: current $I$ crosses it. Take a surface that bulges out between the plates: no charge crosses it at all. Same loop, two answers — the law contradicts itself whenever charge builds up somewhere.

Maxwell noticed that between the plates the electric field is growing. The term $\\varepsilon_0\\, d\\Phi_E/dt$, which he called the **displacement current**, is exactly equal to the current $I$ in the wire. Adding it makes both surfaces give the same answer and makes the equations consistent with conservation of charge. In ordinary circuits it is tiny and hard to notice; its real importance is what it predicts.

### Light
In empty space, with no charges or currents, Faraday's law and the Ampère–Maxwell law feed each other: a changing $\\vec E$ makes a $\\vec B$, whose change makes an $\\vec E$, and so on. Combining them gives a [[math:wave-equation|wave equation]] whose speed is fixed by two constants measured on a laboratory bench with capacitors and coils:

$$c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} = 2.998 \\times 10^{8}\\ \\mathrm{m/s}$$

Maxwell's estimate agreed with the measured speed of light to within a few per cent, and he concluded that light itself is an electromagnetic wave ([[electromagnetic-waves]]). Heinrich Hertz generated and detected such waves with sparks and wire loops in 1887–88: the birth of radio.

### Differential form
Using the [[math:divergence-theorem|divergence theorem]] and [[math:stokes-theorem|Stokes' theorem]], the same equations hold at every point:

$$\\nabla \\cdot \\vec E = \\frac{\\rho}{\\varepsilon_0}, \\quad \\nabla \\cdot \\vec B = 0, \\quad \\nabla \\times \\vec E = -\\frac{\\partial \\vec B}{\\partial t}, \\quad \\nabla \\times \\vec B = \\mu_0 \\vec J + \\mu_0\\varepsilon_0\\frac{\\partial \\vec E}{\\partial t}$$

> [!history] The equations fixed the speed of light without saying relative to what. Trying to answer that question led Einstein to [[relativity-postulates|special relativity]] in 1905: Maxwell's equations are the same for every observer moving at constant velocity, and so is $c$.
`,
  ideas: [
    'Four equations — two Gauss laws, Faraday\'s law and the Ampère–Maxwell law — describe all classical electromagnetism.',
    'There are no magnetic charges: the net magnetic flux out of any closed surface is zero.',
    'A changing electric field acts like a current (the displacement current) and makes a magnetic field.',
    'In empty space the equations allow waves travelling at $c = 1/\\sqrt{\\mu_0\\varepsilon_0}$: light.'
  ],
  pitfalls: [
    'The displacement current is a flow of charge — No charge moves across the gap; it is a changing electric field that acts like a current in the Ampère–Maxwell law.',
    'Electromagnetic waves need a medium, the "ether" — The fields sustain each other in empty space; no medium has ever been found or needed.',
    'Maxwell\'s equations are four unrelated laws — They are linked: the two curl equations together produce waves, and the displacement current makes them consistent with conservation of charge.'
  ],
  formulas: [
    {
      name: 'Speed of an electromagnetic wave',
      expr: 'v = 1/sqrt(mur*mu0*kappa*eps0)', tex: 'v = \\frac{1}{\\sqrt{\\mu_r \\mu_0\\,\\kappa\\,\\varepsilon_0}}',
      vars: {
        v: { name: 'wave speed', q: 'speed', unit: 'm/s' },
        mur: { name: 'relative permeability', value: 1, tex: '\\mu_r', min: 0.5 },
        kappa: { name: 'relative permittivity (at the wave\'s frequency)', value: 2.25, min: 1 },
        mu0: { const: 'mu0' },
        eps0: { const: 'eps0' }
      },
      note: 'With $\\mu_r = \\kappa = 1$ this is $c$ in vacuum. The permittivity must be taken at the frequency of the wave: water has $\\kappa = 80$ for static fields but only about 1.8 at optical frequencies, which gives its refractive index of 1.33.',
      stories: {
        v: 'A non-magnetic material has relative permittivity {kappa} at the frequency of a wave. How fast does the wave travel in it?',
        kappa: 'Light travels at {v} in a non-magnetic glass. What is the glass\'s relative permittivity at optical frequencies?'
      }
    },
    {
      name: 'Displacement current between capacitor plates',
      expr: 'Id = eps0*A*Edot', tex: 'I_d = \\varepsilon_0 A \\dot{E}',
      vars: {
        Id: { name: 'displacement current', q: 'current', unit: 'A', tex: 'I_d' },
        A: { name: 'plate area', q: 'area', unit: 'cm²', value: 100 },
        Edot: { name: 'rate of change of the field between the plates', unit: 'V/(m·s)', value: 1.13e13, tex: '\\dot{E}' },
        eps0: { const: 'eps0' }
      },
      note: 'For a uniform field between the plates, $\\Phi_E = EA$, so $I_d = \\varepsilon_0\\, d\\Phi_E/dt = \\varepsilon_0 A\\, dE/dt$ — and it equals the conduction current in the wires.',
      stories: { Edot: 'A capacitor with plates of area {A} is charged by a current of {Id}. How fast is the field between its plates growing?' }
    }
  ],
  examples: [
    {
      title: 'The speed of light from a bench measurement',
      q: 'Compute $1/\\sqrt{\\mu_0\\varepsilon_0}$ from $\\mu_0 = 1.2566 \\times 10^{-6}\\ \\mathrm{N/A^2}$ and $\\varepsilon_0 = 8.854 \\times 10^{-12}\\ \\mathrm{F/m}$.',
      steps: [
        '$\\mu_0\\varepsilon_0 = 1.2566 \\times 10^{-6} \\times 8.854 \\times 10^{-12} = 1.1127 \\times 10^{-17}\\ \\mathrm{s^2/m^2}$.',
        '$\\sqrt{1.1127 \\times 10^{-17}} = 3.336 \\times 10^{-9}$ s/m.',
        '$c = 1/3.336 \\times 10^{-9} = 2.998 \\times 10^{8}$ m/s — the speed of light, from constants that know nothing about light.'
      ],
      a: '$2.998 \\times 10^{8}$ m/s.'
    },
    {
      title: 'Displacement current in a capacitor',
      q: 'A current of 1.0 A charges a parallel-plate capacitor with plates of 100 cm², 1.0 mm apart. How fast is the field between the plates changing, and what is the displacement current?',
      steps: [
        'The plate charge grows at $dQ/dt = 1.0$ A, and $E = Q/(\\varepsilon_0 A)$, so $\\dfrac{dE}{dt} = \\dfrac{I}{\\varepsilon_0 A} = \\dfrac{1.0}{8.85 \\times 10^{-12} \\times 0.010} = 1.1 \\times 10^{13}$ V/(m·s).',
        'Displacement current: $I_d = \\varepsilon_0 A\\, dE/dt = 1.0$ A — the same as the current in the wires, so the "current" is continuous through the gap.',
        'Across the 1 mm gap the voltage climbs at $1.1 \\times 10^{10}$ V/s, 11 volts every nanosecond.'
      ],
      a: '$1.1 \\times 10^{13}$ V/(m·s); $I_d = 1.0$ A.'
    }
  ],
  quiz: [
    { q: 'Which of Maxwell\'s equations says that there are no isolated magnetic poles?', choices: ['Gauss\'s law for electricity', 'Gauss\'s law for magnetism', 'Faraday\'s law', 'The Ampère–Maxwell law'], a: 1,
      why: '$\\oint \\vec B \\cdot d\\vec A = 0$: as much magnetic flux enters any closed surface as leaves, so there is no magnetic "charge" inside.' },
    { q: 'What did Maxwell add to the existing laws?', choices: ['The Lorentz force', 'A changing electric flux term in Ampère\'s law', 'The inverse-square law', 'Magnetic monopoles'], a: 1,
      why: 'The displacement current $\\mu_0\\varepsilon_0\\, d\\Phi_E/dt$ repaired Ampère\'s law for changing fields — and made waves possible.' },
    { q: 'A changing magnetic field in empty space, with no wire present, produces…', choices: ['nothing', 'a circulating electric field', 'a static charge', 'a current'], a: 1,
      why: 'Faraday\'s law holds for any loop, real or imagined. A wire only reveals the induced field by letting charges move.' },
    { q: 'Electromagnetic waves need a medium to travel through, just as sound does.', a: false,
      why: 'Changing electric and magnetic fields sustain each other in a vacuum. Sunlight crosses 150 million km of nearly empty space.' },
    { q: 'Maxwell\'s theory gave the speed of light from…', choices: ['astronomical observations', 'the electric and magnetic constants $\\varepsilon_0$ and $\\mu_0$', 'the mass of the electron', 'the refractive index of glass'], a: 1,
      why: '$c = 1/\\sqrt{\\mu_0\\varepsilon_0}$, both measurable with charges, currents and forces in a laboratory.' }
  ],
  applications: [
    'Designing antennas, waveguides, microwave circuits and optical fibres.',
    'Computer simulations of fields (finite-element and finite-difference solvers) for motors, MRI scanners and chips.',
    'Special relativity grew from the symmetry of Maxwell\'s equations.'
  ],
  history: 'Maxwell published his theory in stages between 1861 and 1865, and in full in his Treatise of 1873. The compact four-equation vector form was written later by Oliver Heaviside. Hertz\'s experiments of 1887–88 confirmed the waves.',
  sim: 'em1-wave'
},

{
  id: 'electromagnetic-waves', parent: 'em-waves', title: 'Electromagnetic waves', level: 2,
  short: 'Travelling, self-sustaining oscillations of electric and magnetic field, perpendicular to each other and to the direction of travel, moving at c in a vacuum.',
  keywords: ['electromagnetic wave', 'light', 'radio wave', 'speed of light', 'c = f lambda', 'transverse', 'E = cB', 'antenna', 'polarization', 'plane wave'],
  prereq: ['maxwells-equations', 'wave-properties', 'transverse-longitudinal'],
  related: ['em-spectrum', 'em-wave-energy', 'polarization', 'refraction', 'photon'],
  body: `
An **electromagnetic wave** is a pattern of electric and magnetic fields that travels through space on its own. A changing electric field creates a magnetic field, and a changing magnetic field creates an electric field ([[maxwells-equations|Maxwell's equations]]); in the right arrangement each keeps regenerating the other, and the pair moves off at the speed of light. Radio, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays are all the same thing at different frequencies — the [[em-spectrum|electromagnetic spectrum]].

### What the fields do
For a plane wave travelling along $x$:

- The wave is **transverse**: $\\vec E$ and $\\vec B$ are both perpendicular to the direction of travel, and to each other. The direction of travel is along $\\vec E \\times \\vec B$.
- $\\vec E$ and $\\vec B$ oscillate **in phase**: they peak and pass through zero together.
- At every point and instant their sizes are locked together: $E = cB$. In SI units the magnetic field looks tiny — sunlight with $E_0 \\approx 1000$ V/m has $B_0 \\approx 3.4$ µT, less than a tenth of the Earth's field — but the two carry equal energy ([[em-wave-energy]]).

Mathematically, $E_y = E_0 \\cos(kx - \\omega t)$ and $B_z = B_0 \\cos(kx - \\omega t)$, with wave number $k = 2\\pi/\\lambda$ and angular frequency $\\omega = 2\\pi f$.

### Speed, frequency, wavelength
In a vacuum every electromagnetic wave travels at

$$c = 299\\,792\\,458\\ \\mathrm{m/s}$$

exactly (the metre is defined from it), whatever its frequency. As for any wave, $c = f\\lambda$. In a material the wave is slowed to $v = c/n$, where $n$ is the refractive index — the root of [[refraction]] — and the frequency stays the same while the wavelength shrinks.

| Wave | Frequency | Wavelength |
|---|---|---|
| FM radio | 100 MHz | 3.0 m |
| Wi-Fi | 2.4 GHz | 12.5 cm |
| Green light | 566 THz | 530 nm |

### How they are made
Any **accelerating** charge radiates; a charge at rest or moving steadily does not. In an antenna, electrons are driven back and forth at frequency $f$, and the disturbance of their field ripples outward as a wave of the same frequency. A simple dipole antenna works best when it is about half a wavelength long, which is why FM aerials are around a metre and a half and phone antennas a few centimetres. Light comes from electrons changing energy levels in atoms, heat radiation from the jostling charges of every warm body, and gamma rays from excited nuclei.

### Polarization
The direction in which $\\vec E$ oscillates is the wave's **polarization**. It can be fixed (linear), rotate steadily (circular), or change randomly, as in sunlight and lamplight. Polarizing sunglasses, LCD screens and satellite dishes all make use of it — see [[polarization]].

> [!tip] In the simulation, pause the wave and check that $\\vec E \\times \\vec B$ points along the direction of travel at every point.
`,
  ideas: [
    'Electromagnetic waves are self-sustaining oscillations of $\\vec E$ and $\\vec B$ that need no medium.',
    '$\\vec E$, $\\vec B$ and the direction of travel are mutually perpendicular; the wave travels along $\\vec E \\times \\vec B$.',
    'In a vacuum all electromagnetic waves travel at $c$, and $c = f\\lambda$.',
    'At every point $E = cB$, and the two fields oscillate in phase.',
    'Accelerating charges radiate; antennas are driven charges.'
  ],
  pitfalls: [
    'Light and radio waves are different kinds of thing — They are the same kind of wave, differing only in frequency and wavelength.',
    'The magnetic field is out of phase with the electric field — In a travelling wave in free space they rise and fall together.',
    'Higher-frequency waves travel faster — In a vacuum all frequencies travel at exactly $c$.'
  ],
  formulas: [
    {
      name: 'Wave speed, frequency and wavelength',
      expr: 'c = f*lambda', tex: 'c = f\\lambda', solveFor: 'lambda',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'm' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 100 },
        c: { const: 'c' }
      },
      stories: {
        lambda: 'An FM station broadcasts at {f}. What is its wavelength?',
        f: 'What is the frequency of light of wavelength {lambda}?'
      }
    },
    {
      name: 'Electric and magnetic amplitudes',
      expr: 'E = c*B', tex: 'E = cB', solveFor: 'B',
      vars: {
        B: { name: 'magnetic field', q: 'bfield', unit: 'uT' },
        E: { name: 'electric field', q: 'efield', unit: 'V/m', value: 1013 },
        c: { const: 'c' }
      },
      stories: {
        B: 'The electric field of a wave has amplitude {E}. What is the amplitude of its magnetic field?',
        E: 'A radio wave\'s magnetic field amplitude is {B}. What is its electric field amplitude?'
      }
    },
    {
      name: 'Speed in a material',
      expr: 'v = c/n', tex: 'v = \\frac{c}{n}',
      vars: {
        v: { name: 'speed in the material', q: 'speed', unit: 'm/s' },
        n: { name: 'refractive index', value: 1.5, min: 1 },
        c: { const: 'c' }
      },
      stories: { v: 'How fast does light travel in glass of refractive index {n}?', n: 'Light travels at {v} in a liquid. What is its refractive index?' }
    }
  ],
  examples: [
    {
      title: 'An FM aerial',
      q: 'An FM station broadcasts at 100 MHz. What is the wavelength, and how long is a half-wave dipole aerial for it?',
      steps: [
        '$\\lambda = c/f = 3.00 \\times 10^{8} / 1.00 \\times 10^{8} = 3.00$ m.',
        'A half-wave dipole is $\\lambda/2 = 1.5$ m end to end (in practice a few per cent shorter).'
      ],
      a: '3.0 m; about 1.5 m.'
    },
    {
      title: 'The fields in sunlight',
      q: 'Sunlight at the top of the atmosphere has an electric field amplitude of about 1010 V/m. What is the magnetic amplitude?',
      steps: [
        '$B_0 = E_0/c = 1010 / 3.00 \\times 10^{8} = 3.4 \\times 10^{-6}$ T.',
        'About 3.4 µT — much smaller than the Earth\'s steady field of about 50 µT, yet it carries just as much energy as the electric part of the wave.'
      ],
      a: '3.4 µT.'
    }
  ],
  quiz: [
    { q: 'A wave travels in the $+x$ direction and at some instant its electric field points along $+y$. Its magnetic field there points along…', choices: ['$+x$', '$+y$', '$+z$', '$-z$'], a: 2,
      why: 'The wave travels along $\\vec E \\times \\vec B$. With $\\vec E$ along $\\hat y$, $\\hat y \\times \\hat z = \\hat x$, so $\\vec B$ must be along $+z$.' },
    { q: 'Radio waves and visible light differ in…', choices: ['their speed in a vacuum', 'their frequency and wavelength', 'whether they need a medium', 'whether they carry energy'], a: 1,
      why: 'All electromagnetic waves travel at $c$ in a vacuum; they differ only in frequency, and hence wavelength.' },
    { q: 'The frequency of an electromagnetic wave in a vacuum is doubled. Its wavelength…', choices: ['doubles', 'halves', 'is unchanged', 'quadruples'], a: 1, why: '$\\lambda = c/f$ with $c$ fixed.' },
    { q: 'Which of these does NOT radiate electromagnetic waves?', choices: ['electrons oscillating in an antenna', 'a charge moving in a circle', 'a charge moving in a straight line at constant speed', 'a hot filament'], a: 2,
      why: 'Radiation needs acceleration. A charge moving uniformly carries its field along with it but sends out no wave.' },
    { q: 'When light passes from air into water, its frequency changes.', a: false,
      why: 'The frequency is set by the source; the speed and wavelength both fall by the refractive index.' }
  ],
  applications: [
    'Radio, television, mobile phones, Wi-Fi, GPS and radar.',
    'Optical fibres carry most of the world\'s data as infrared light.',
    'Astronomy across the spectrum, from radio telescopes to gamma-ray satellites.'
  ],
  sim: 'em1-wave'
},

{
  id: 'em-spectrum', parent: 'em-waves', title: 'The electromagnetic spectrum', level: 1,
  short: 'All electromagnetic waves, arranged by wavelength: radio, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays.',
  keywords: ['electromagnetic spectrum', 'radio', 'microwave', 'infrared', 'visible', 'ultraviolet', 'X-ray', 'gamma ray', 'photon energy', 'wavelength', 'frequency', 'ionizing radiation'],
  prereq: ['electromagnetic-waves', 'math:logarithmic-scales', 'math:scientific-notation'],
  related: ['photon', 'blackbody-radiation', 'x-rays', 'color-vision', 'thermal-radiation', 'cosmic-microwave-background'],
  body: `
Visible light is a tiny slice of a vast family. Every electromagnetic wave travels at the same speed in a vacuum, so a single number — wavelength or frequency, tied by $c = f\\lambda$ — places it on the **electromagnetic spectrum**. The span is enormous: from radio waves kilometres long to gamma rays smaller than an atomic nucleus, more than twenty powers of ten, which is why the spectrum is always drawn on a [[math:logarithmic-scales|logarithmic scale]].

### Photon energy
Light is also absorbed and emitted in lumps, [[photon|photons]], each carrying energy

$$E = hf = \\frac{hc}{\\lambda}, \\qquad hc = 1240\\ \\mathrm{eV\\,nm}$$

with $h = 6.63 \\times 10^{-34}$ J·s. A green photon at 550 nm carries 2.25 eV; a microwave-oven photon, 10 µeV; a medical X-ray photon, tens of keV. Photon energy is what decides how radiation interacts with matter: it is the difference between warming something and breaking its molecules apart.

### The bands
| Band | Wavelength | Frequency | Photon energy | Made by / used for |
|---|---|---|---|---|
| Radio | above 1 m | below 300 MHz | below 1 µeV | broadcasting, MRI, radio astronomy |
| Microwaves | 1 mm – 1 m | 300 MHz – 300 GHz | 1 µeV – 1 meV | ovens, Wi-Fi, radar, the cosmic background |
| Infrared | 750 nm – 1 mm | 0.3 – 400 THz | 1 meV – 1.7 eV | warm bodies, remote controls, fibre optics |
| Visible | 380 – 750 nm | 400 – 790 THz | 1.7 – 3.3 eV | the Sun, lamps, our eyes |
| Ultraviolet | 10 – 380 nm | $7.9 \\times 10^{14}$ – $3 \\times 10^{16}$ Hz | 3.3 – 124 eV | sunburn, sterilization, fluorescence |
| X-rays | 10 pm – 10 nm | $3 \\times 10^{16}$ – $3 \\times 10^{19}$ Hz | 124 eV – 124 keV | medical imaging, crystallography |
| Gamma rays | below 10 pm | above $3 \\times 10^{19}$ Hz | above 124 keV | nuclear decays, cosmic explosions |

The boundaries are conventions, not physics. X-rays and gamma rays overlap and are usually named by their origin — electrons for X-rays, nuclei for gamma rays.

### Ionizing or not
A photon of more than roughly 10 eV (wavelengths below about 120 nm) can knock an electron out of an atom. **Ionizing radiation** — far ultraviolet, X-rays and gamma rays — can break DNA one photon at a time, which is why it is limited by dose. Radio waves, microwaves and visible light cannot ionize, however intense: a stronger beam delivers more photons, not more energetic ones. Their main biological effect is heating. Ultraviolet sits at the border: UV-B photons (about 4 eV) cannot ionize, but they can damage DNA directly, which is why sunburn raises the risk of skin cancer.

### Windows in the sky
The atmosphere lets through visible light, some infrared and most radio waves, and blocks the rest: ozone absorbs ultraviolet below about 300 nm, and X-rays and gamma rays are stopped high up. That is why X-ray and gamma-ray telescopes have to fly in space, and why life on the surface is shielded from the harshest radiation.

> [!fact] Our eyes see from about 380 to 750 nm — less than a factor of two in wavelength, one "octave" out of more than sixty. The Sun's output peaks near 500 nm, in the middle of that window.
`,
  ideas: [
    'All electromagnetic waves travel at $c$ in a vacuum; they differ in frequency and wavelength.',
    'Photon energy $E = hf = hc/\\lambda$ rises with frequency; $hc = 1240$ eV·nm.',
    'From long to short wavelength: radio, microwaves, infrared, visible, ultraviolet, X-rays, gamma rays.',
    'Photons above about 10 eV ionize atoms; below that, radiation mainly heats.',
    'Band boundaries are conventions; visible light is a narrow window.'
  ],
  pitfalls: [
    'Stronger microwaves or radio waves can ionize — Ionization depends on the energy of each photon, not on how many there are.',
    'X-rays travel faster than radio waves — Every electromagnetic wave travels at $c$ in a vacuum.',
    'Infrared is "heat" and visible light is not — All absorbed radiation heats; infrared is simply what warm objects around room temperature mostly emit.'
  ],
  formulas: [
    {
      name: 'Photon energy from wavelength',
      expr: 'E = h*c/lambda', tex: 'E = \\frac{hc}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550 },
        h: { const: 'h' },
        c: { const: 'c' }
      },
      stories: {
        E: 'What is the energy of one photon of light of wavelength {lambda}?',
        lambda: 'A photon carries {E}. What is its wavelength?'
      }
    },
    {
      name: 'Photon energy from frequency',
      expr: 'E = h*f', tex: 'E = hf',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        f: { name: 'frequency', q: 'frequency', unit: 'GHz', value: 2.45 },
        h: { const: 'h' }
      },
      stories: { E: 'A microwave oven works at {f}. How much energy does each of its photons carry?', f: 'What frequency has photons of {E}?' }
    }
  ],
  examples: [
    {
      title: 'Why microwaves cannot ionize',
      q: 'Compare the photon energy of a microwave oven (2.45 GHz) with that of green light (550 nm) and with the 13.6 eV needed to ionize hydrogen.',
      steps: [
        'Microwave: $E = hf = 6.63 \\times 10^{-34} \\times 2.45 \\times 10^{9} = 1.6 \\times 10^{-24}$ J $= 1.0 \\times 10^{-5}$ eV.',
        'Green light: $E = hc/\\lambda = 1240\\ \\mathrm{eV\\,nm} / 550\\ \\mathrm{nm} = 2.25$ eV.',
        'Ionizing hydrogen takes 13.6 eV — over a million times a microwave photon. Microwaves heat food by making water molecules rotate, never by breaking atoms apart.'
      ],
      a: '10 µeV versus 2.25 eV; ionization needs 13.6 eV.'
    },
    {
      title: 'Photons from a laser pointer',
      q: 'A red laser pointer emits 1.0 mW at 650 nm. How many photons does it send out each second?',
      steps: [
        'Energy per photon: $E = 1240/650 = 1.91$ eV $= 3.06 \\times 10^{-19}$ J.',
        '$N = P/E = 1.0 \\times 10^{-3} / 3.06 \\times 10^{-19} = 3.3 \\times 10^{15}$ photons per second.'
      ],
      a: 'About $3 \\times 10^{15}$ photons per second.'
    }
  ],
  quiz: [
    { q: 'Which list is in order of increasing frequency?', choices: ['X-rays, UV, visible, infrared', 'radio, infrared, visible, ultraviolet', 'visible, radio, gamma, microwave', 'gamma, X-rays, radio, visible'], a: 1,
      why: 'Frequency rises from radio through microwaves, infrared, visible and ultraviolet to X-rays and gamma rays.' },
    { q: 'Which carries more energy per photon, red light or blue light?', choices: ['red', 'blue', 'the same', 'it depends on the brightness'], a: 1, why: 'Blue light has the shorter wavelength and so the higher frequency; $E = hf$.' },
    { q: 'X-rays travel faster through space than radio waves.', a: false, why: 'All electromagnetic waves travel at $c$ in a vacuum.' },
    { q: 'The wavelength of 2.4 GHz Wi-Fi is about…', choices: ['12.5 m', '1.25 m', '12.5 cm', '1.25 mm'], a: 2, why: '$\\lambda = c/f = 3 \\times 10^{8} / 2.4 \\times 10^{9} = 0.125$ m.' },
    { q: 'Why can a weak X-ray beam ionize atoms when an intense radio beam cannot?', choices: ['X-rays travel faster', 'Each X-ray photon carries enough energy to free an electron', 'Radio waves are absorbed by air', 'X-rays are made of charged particles'], a: 1,
      why: 'Ionization is a one-photon event. A radio photon has about a millionth of an eV; an X-ray photon has thousands.' }
  ],
  applications: [
    'Choosing frequencies for communication: long waves bend round hills, microwaves carry more data.',
    'Medical imaging across the spectrum: MRI (radio), thermal cameras (infrared), X-ray and PET (gamma) scans.',
    'Remote sensing of the Earth\'s surface and atmosphere from satellites.',
    'Multi-wavelength astronomy: each band shows a different side of the universe.'
  ],
  sim: 'em1-spectrum'
},

{
  id: 'em-wave-energy', parent: 'em-waves', title: 'Energy and intensity of EM waves', level: 2,
  short: 'An electromagnetic wave carries energy in its electric and magnetic fields in equal shares; its intensity is ½cε₀E₀² and falls with the square of distance from a point source.',
  keywords: ['intensity', 'energy density', 'Poynting vector', 'irradiance', 'solar constant', 'W/m²', 'RMS field', 'inverse square', 'laser safety'],
  prereq: ['electromagnetic-waves', 'energy-in-capacitor', 'energy-in-inductor'],
  related: ['radiation-pressure', 'light-intensity', 'solar-constant', 'sound-intensity', 'photon'],
  body: `
Sunlight warms your skin and powers solar panels, so electromagnetic waves must carry energy. It is stored in the fields themselves: an electric field holds $\\tfrac12\\varepsilon_0E^2$ per cubic metre ([[energy-in-capacitor|as in a capacitor]]) and a magnetic field $B^2/2\\mu_0$ ([[energy-in-inductor|as in an inductor]]).

### Equal shares
In a travelling wave $B = E/c$ and $c^2 = 1/\\mu_0\\varepsilon_0$, so

$$\\frac{B^2}{2\\mu_0} = \\frac{E^2}{2\\mu_0 c^2} = \\tfrac12\\varepsilon_0E^2$$

The magnetic field, tiny as it looks in teslas, carries exactly as much energy as the electric field. The total energy density is $u = \\varepsilon_0E^2$, and since $E^2$ averages to half its peak value over a cycle, $\\langle u \\rangle = \\tfrac12 \\varepsilon_0 E_0^2$.

### Intensity
The energy moves at speed $c$, so the power crossing each square metre facing the wave — the **intensity** — is the energy density times $c$:

$$I = \\tfrac12 c\\,\\varepsilon_0 E_0^2 = \\frac{c B_0^2}{2\\mu_0} = \\frac{E_0 B_0}{2\\mu_0}$$

measured in W/m². Intensity goes as the **square** of the field amplitude: double $E_0$ and you carry four times the power. Engineers often quote the RMS field instead, $E_\\text{rms} = E_0/\\sqrt2$, which gives $I = c\\varepsilon_0E_\\text{rms}^2$.

The direction and rate of energy flow at every point are given by the **Poynting vector** $\\vec S = \\vec E \\times \\vec B/\\mu_0$, which points along the direction of travel and whose time average is $I$.

### Spreading out
A small source radiating power $P$ equally in all directions spreads it over spheres of area $4\\pi r^2$:

$$I = \\frac{P}{4\\pi r^2}$$

the same [[light-intensity|inverse-square law]] as for sound and gravity. Twice as far, a quarter of the intensity.

### Real numbers
| Situation | Intensity | Peak field $E_0$ |
|---|---|---|
| Sunlight above the atmosphere | 1361 W/m² | about 1000 V/m |
| 1 W phone, 1 m away (spread evenly) | 0.08 W/m² | about 8 V/m |
| 1 mW laser pointer, 1 mm² spot | 1000 W/m² | about 900 V/m |
| Powerful pulsed lasers, focused | $10^{22}$ W/m² and more | above $10^{12}$ V/m |

> [!warn] A 1 mW laser pointer is as intense as sunlight at its spot, and the eye's lens focuses that parallel beam to a tiny point on the retina. Never look into a laser, however "weak" it seems.
`,
  ideas: [
    'Electric and magnetic fields in a wave carry equal energy.',
    'Intensity is $I = \\tfrac12 c\\varepsilon_0E_0^2$: it grows as the square of the amplitude.',
    'Energy flows along the Poynting vector $\\vec E \\times \\vec B/\\mu_0$, the direction of travel.',
    'From a point source, intensity falls as $1/r^2$.'
  ],
  pitfalls: [
    'The magnetic field is so small that it carries almost no energy — Its energy density $B^2/2\\mu_0$ equals $\\tfrac12\\varepsilon_0E^2$ exactly.',
    'Doubling the field amplitude doubles the intensity — Intensity goes as $E_0^2$, so it quadruples.',
    'A low-power laser is safe to look into because it is weaker than a light bulb — Its power is concentrated in a narrow parallel beam that the eye focuses to a point.'
  ],
  derivation: {
    title: 'Intensity from the fields',
    steps: [
      { text: 'Energy densities of the two fields, using $B = E/c$ and $c^2 = 1/\\mu_0\\varepsilon_0$:', tex: 'u_E = \\tfrac12\\varepsilon_0E^2, \\qquad u_B = \\frac{B^2}{2\\mu_0} = \\frac{E^2}{2\\mu_0c^2} = \\tfrac12\\varepsilon_0E^2' },
      { text: 'For $E = E_0\\cos(kx - \\omega t)$ the square averages to $\\tfrac12E_0^2$ over a cycle, so', tex: '\\langle u \\rangle = \\langle u_E + u_B \\rangle = \\varepsilon_0\\langle E^2\\rangle = \\tfrac12\\varepsilon_0E_0^2' },
      { text: 'In a time $\\Delta t$ the energy in a column of length $c\\,\\Delta t$ crosses an area $A$, so the power per area is', tex: 'I = \\frac{\\langle u\\rangle\\, A\\,c\\,\\Delta t}{A\\,\\Delta t} = \\tfrac12 c\\,\\varepsilon_0E_0^2' }
    ]
  },
  formulas: [
    {
      name: 'Intensity from the electric amplitude',
      expr: 'I = 0.5*c*eps0*E0^2', tex: 'I = \\tfrac12 c\\,\\varepsilon_0 E_0^2',
      vars: {
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²' },
        E0: { name: 'electric field amplitude', q: 'efield', unit: 'V/m', value: 1013 },
        c: { const: 'c' },
        eps0: { const: 'eps0' }
      },
      stories: {
        I: 'An electromagnetic wave has an electric field amplitude of {E0}. What is its intensity?',
        E0: 'Sunlight arrives with an intensity of {I}. What is the amplitude of its electric field?'
      }
    },
    {
      name: 'Intensity from the magnetic amplitude',
      expr: 'I = c*B0^2/(2*mu0)', tex: 'I = \\frac{c B_0^2}{2\\mu_0}',
      vars: {
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²' },
        B0: { name: 'magnetic field amplitude', q: 'bfield', unit: 'uT', value: 3.38 },
        c: { const: 'c' },
        mu0: { const: 'mu0' }
      },
      stories: { I: 'A wave\'s magnetic field amplitude is {B0}. What is its intensity?' }
    },
    {
      name: 'Inverse-square spreading from a point source',
      expr: 'I = P/(4*pi*r^2)', tex: 'I = \\frac{P}{4\\pi r^2}',
      vars: {
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²' },
        P: { name: 'power radiated (equally in all directions)', q: 'power', unit: 'W', value: 1 },
        r: { name: 'distance', q: 'length', unit: 'm', value: 1 }
      },
      stories: {
        I: 'A small transmitter radiates {P} equally in all directions. What is the intensity {r} away?',
        r: 'At what distance from a {P} isotropic source has the intensity fallen to {I}?'
      }
    }
  ],
  examples: [
    {
      title: 'The fields in sunlight',
      q: 'Sunlight above the atmosphere has an intensity of 1361 W/m². Find the amplitudes of its electric and magnetic fields.',
      steps: [
        '$E_0 = \\sqrt{\\dfrac{2I}{c\\varepsilon_0}} = \\sqrt{\\dfrac{2 \\times 1361}{3.00 \\times 10^{8} \\times 8.85 \\times 10^{-12}}} = \\sqrt{1.03 \\times 10^{6}} = 1010$ V/m.',
        '$B_0 = E_0/c = 3.4 \\times 10^{-6}$ T.',
        'Real sunlight is a jumble of frequencies and polarizations; these are the amplitudes of a single wave carrying the same power.'
      ],
      a: '$E_0 \\approx 1010$ V/m, $B_0 \\approx 3.4$ µT.'
    },
    {
      title: 'A phone at arm\'s length',
      q: 'A phone transmits 1 W, and suppose it spreads evenly in all directions. What are the intensity and the field amplitude 1 m away?',
      steps: [
        '$I = \\dfrac{P}{4\\pi r^2} = \\dfrac{1}{4\\pi \\times 1^2} = 0.080$ W/m².',
        '$E_0 = \\sqrt{2I/c\\varepsilon_0} = \\sqrt{2 \\times 0.080 / 2.65 \\times 10^{-3}} = 7.7$ V/m.',
        'About 17 000 times less intense than sunlight, and at a frequency too low to ionize.'
      ],
      a: '0.08 W/m², about 8 V/m.'
    }
  ],
  quiz: [
    { q: 'You move twice as far from a small lamp. The intensity you receive…', choices: ['halves', 'falls to a quarter', 'is unchanged', 'falls to an eighth'], a: 1, why: 'The same power spreads over four times the area: $I \\propto 1/r^2$.' },
    { q: 'The electric field amplitude of a wave is doubled. Its intensity…', choices: ['doubles', 'quadruples', 'is unchanged', 'halves'], a: 1, why: '$I = \\tfrac12 c\\varepsilon_0E_0^2$ goes as the square of the amplitude.' },
    { q: 'In an electromagnetic wave in vacuum, how is the energy shared between the electric and magnetic fields?', choices: ['almost all in the electric field', 'almost all in the magnetic field', 'equally', 'it depends on the frequency'], a: 2,
      why: 'With $B = E/c$, $B^2/2\\mu_0 = \\tfrac12\\varepsilon_0E^2$ at every point and instant.' },
    { q: 'The Poynting vector of a travelling wave points…', choices: ['along $\\vec E$', 'along $\\vec B$', 'in the direction the wave travels', 'back towards the source'], a: 2,
      why: '$\\vec S = \\vec E \\times \\vec B/\\mu_0$, which is along the direction of propagation.' },
    { q: 'A 5 mW laser pointer is safe to look into because it has far less power than a 60 W lamp.', a: false,
      why: 'Its power is packed into a tiny, parallel beam; the eye focuses it to a point on the retina with an intensity far above that from a lamp.' }
  ],
  applications: [
    'Solar power: about 1000 W/m² reaches the ground on a clear day.',
    'Exposure limits for radio transmitters and phones are set as intensities (W/m²) or field strengths (V/m).',
    'Laser safety classes are based on the power that can enter the eye.'
  ],
  sim: 'em1-wave'
},

{
  id: 'radiation-pressure', parent: 'em-waves', title: 'Radiation pressure', level: 2,
  short: 'Light carries momentum as well as energy, so it pushes on whatever absorbs or reflects it: a pressure I/c, doubled for a mirror.',
  keywords: ['radiation pressure', 'momentum of light', 'p = E/c', 'solar sail', 'optical tweezers', 'comet tail', 'photon momentum', 'light pressure'],
  prereq: ['em-wave-energy', 'momentum', 'pressure'],
  related: ['photon', 'compton-scattering', 'relativistic-momentum', 'impulse', 'stellar-evolution'],
  body: `
Electromagnetic waves carry **momentum** as well as energy. For light, the two are tied together very simply: a pulse carrying energy $E$ carries momentum

$$p = \\frac{E}{c}$$

in its direction of travel. When light is absorbed, that momentum is handed to the absorber; when it is reflected, the light's momentum is reversed and the mirror receives twice as much. The steady push per unit area is the **radiation pressure**:

$$P_\\text{rad} = \\frac{I}{c}\\ \\text{(absorbed)}, \\qquad P_\\text{rad} = \\frac{2I}{c}\\ \\text{(reflected)}$$

For a surface that reflects a fraction $\\mathcal{R}$ and absorbs the rest, $P_\\text{rad} = (1 + \\mathcal{R})\\,I/c$, for light striking it head on.

### Why light pushes
In the wave picture, the electric field of the wave drives the charges in the surface back and forth along $\\vec E$; the wave's magnetic field then exerts a force $q\\vec v \\times \\vec B$ on those moving charges, and that force points along the direction of travel. In the photon picture, each [[photon]] carries momentum $h/\\lambda = E/c$, and the pressure is simply the rate at which photons deliver it — the same reasoning as gas pressure from molecules striking a wall.

### How big?
Tiny, by everyday standards. Sunlight at the Earth (1361 W/m²) exerts 4.5 µPa on a black surface and 9.1 µPa on a mirror — about $10^{-10}$ of atmospheric pressure. On the whole Earth it adds up to $6 \\times 10^{8}$ N, some $10^{14}$ times weaker than the Sun's gravitational pull.

But in space, where nothing else pushes, it matters:

- **Comet tails** point away from the Sun, because sunlight pushes the dust (and the solar wind pushes the ions).
- **Solar sails**: in 2010 the Japanese probe IKAROS, with a sail about 14 m across, became the first spacecraft driven by sunlight; later sails have followed. The push is small but lasts for ever and costs no fuel.
- Spacecraft navigators must allow for sunlight's steady nudge on solar panels, and it slowly changes the orbits of satellites.
- Inside massive stars, the outward push of radiation helps hold the star up against gravity, and limits how bright a star can be without blowing off its outer layers.
- In the laboratory, **optical tweezers** hold and move living cells and single molecules with forces of piconewtons, and laser light can slow atoms to a standstill — the basis of laser cooling.

> [!note] A Crookes radiometer — the little vane in a glass bulb that spins in sunlight — turns the "wrong" way for radiation pressure: its black faces retreat, not its shiny ones. It is driven by the thin gas left in the bulb, warmed unevenly by the light. With a truly good vacuum it barely turns at all.
`,
  ideas: [
    'Light carries momentum $p = E/c$ along its direction of travel.',
    'Radiation pressure is $I/c$ on an absorber and $2I/c$ on a perfect mirror.',
    'Sunlight at the Earth pushes with only a few micropascals, but in space that is enough to steer comets and sails.',
    'Optical tweezers and laser cooling use the same push on microscopic scales.'
  ],
  pitfalls: [
    'Light has no mass, so it cannot push anything — Light carries momentum without rest mass; absorbing or reflecting it transfers momentum.',
    'A black surface feels more pressure than a mirror — A mirror reverses the light\'s momentum and feels twice the push.',
    'A Crookes radiometer is driven by radiation pressure — It is driven by gas effects, and turns the opposite way to what radiation pressure alone would do.'
  ],
  formulas: [
    {
      name: 'Radiation pressure on a surface',
      expr: 'Prad = (1 + Rf)*I/c', tex: 'P_{\\text{rad}} = (1 + \\mathcal{R})\\frac{I}{c}',
      vars: {
        Prad: { name: 'radiation pressure', q: 'pressure', unit: 'Pa', tex: 'P_{\\text{rad}}' },
        Rf: { name: 'reflectance (0 = black, 1 = perfect mirror)', value: 0.9, min: 0, max: 1, tex: '\\mathcal{R}' },
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²', value: 1361 },
        c: { const: 'c' }
      },
      note: 'Light arriving perpendicular to the surface; whatever is not reflected is absorbed.',
      stories: {
        Prad: 'Sunlight of {I} falls straight onto a sail that reflects {Rf} of it. What pressure does it exert?',
        I: 'A black surface feels a radiation pressure of {Prad} (take reflectance {Rf}). How intense is the light?'
      }
    },
    {
      name: 'Force of sunlight on a sail',
      expr: 'F = (1 + Rf)*I*A/c', tex: 'F = (1 + \\mathcal{R})\\frac{IA}{c}',
      vars: {
        F: { name: 'force', q: 'force', unit: 'mN' },
        Rf: { name: 'reflectance', value: 0.9, min: 0, max: 1, tex: '\\mathcal{R}' },
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²', value: 1361 },
        A: { name: 'sail area facing the light', q: 'area', unit: 'm²', value: 32 },
        c: { const: 'c' }
      },
      stories: {
        F: 'A solar sail of {A}, reflecting {Rf} of the light, faces sunlight of {I}. What force does it feel?',
        A: 'What sail area (reflectance {Rf}) is needed to get a force of {F} from sunlight of {I}?'
      }
    },
    {
      name: 'Momentum of a pulse of light',
      expr: 'p = E/c', tex: 'p = \\frac{E}{c}',
      vars: {
        p: { name: 'momentum', q: 'momentum', unit: 'kg·m/s' },
        E: { name: 'energy of the pulse', q: 'energy', unit: 'J', value: 1 },
        c: { const: 'c' }
      },
      stories: { p: 'A laser pulse carries {E}. How much momentum does it deliver when absorbed?' }
    }
  ],
  examples: [
    {
      title: 'Sailing on sunlight',
      q: 'A 5.0 kg spacecraft has a 32 m² sail reflecting 90 % of sunlight (1361 W/m²), facing the Sun. Find the force, the acceleration and the speed gained in a day.',
      steps: [
        '$F = (1 + 0.9)\\dfrac{IA}{c} = 1.9 \\times \\dfrac{1361 \\times 32}{3.00 \\times 10^{8}} = 2.8 \\times 10^{-4}$ N — about the weight of a grain of rice.',
        '$a = F/m = 2.8 \\times 10^{-4} / 5.0 = 5.5 \\times 10^{-5}\\ \\mathrm{m/s^2}$.',
        'In one day (86 400 s): $\\Delta v = 4.8$ m/s; in a month, about 140 m/s — with no fuel at all.'
      ],
      a: '0.28 mN; $5.5 \\times 10^{-5}$ m/s²; about 5 m/s per day.'
    },
    {
      title: 'Sunlight pushing on the Earth',
      q: 'Estimate the force of sunlight on the Earth (radius 6371 km), treating it as a black disc, and compare it with the Sun\'s gravitational pull, $3.5 \\times 10^{22}$ N.',
      steps: [
        'The Earth intercepts sunlight over its cross-section, $\\pi R^2 = \\pi (6.371 \\times 10^{6})^2 = 1.28 \\times 10^{14}\\ \\mathrm{m^2}$.',
        '$F = \\dfrac{I}{c} \\pi R^2 = 4.54 \\times 10^{-6} \\times 1.28 \\times 10^{14} = 5.8 \\times 10^{8}$ N.',
        'Ratio to gravity: $5.8 \\times 10^{8} / 3.5 \\times 10^{22} \\approx 2 \\times 10^{-14}$. Utterly negligible for a planet — but not for a dust grain, whose light-catching area is huge compared with its mass.'
      ],
      a: 'About $6 \\times 10^{8}$ N, $10^{14}$ times weaker than gravity.'
    }
  ],
  quiz: [
    { q: 'The same beam of light falls on a perfect mirror and on a black surface. The mirror feels…', choices: ['no pressure', 'half the pressure', 'the same pressure', 'twice the pressure'], a: 3,
      why: 'Absorbing stops the light\'s momentum; reflecting reverses it, a change twice as large.' },
    { q: 'Sunlight at the Earth pushes on a black surface with a pressure of about…', choices: ['5 Pa', '5 mPa', '5 µPa', '5 kPa'], a: 2, why: '$I/c = 1361 / 3 \\times 10^{8} = 4.5 \\times 10^{-6}$ Pa.' },
    { q: 'Why do small dust grains feel sunlight\'s push more than planets do?', choices: ['Dust is black', 'Radiation force grows with area (∝ r²) but gravity with mass (∝ r³), so small bodies have far more area per unit mass', 'Planets have magnetic fields', 'Sunlight cannot reach planets'], a: 1,
      why: 'Shrinking an object reduces its mass faster than its area, so light pressure wins for tiny grains.' },
    { q: 'The spinning of a Crookes radiometer in sunlight is due to radiation pressure.', a: false,
      why: 'Its black vanes move away from the light, opposite to what radiation pressure predicts; the thin gas inside, heated unevenly, drives it.' },
    { q: 'A solar sail moves from 1 AU to 2 AU from the Sun. The radiation force on it becomes…', choices: ['half', 'a quarter', 'the same', 'twice as large'], a: 1, why: 'The intensity, and with it the pressure, falls as $1/r^2$.' }
  ],
  applications: [
    'Solar sails for fuel-free spacecraft propulsion.',
    'Optical tweezers in biology and physics (Arthur Ashkin shared the 2018 Nobel Prize for them).',
    'Laser cooling and trapping of atoms for atomic clocks and quantum experiments.',
    'Correcting the orbits of satellites and interplanetary probes for sunlight\'s push.'
  ],
  history: 'Maxwell predicted radiation pressure in 1873. It was first measured in 1900–1901, by Pyotr Lebedev in Moscow and by Ernest Nichols and Gordon Hull in the United States, who had to separate it carefully from the much larger gas effects that drive a radiometer.'
}

);
