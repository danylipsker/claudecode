/* HYPER-PHYSICS · content/wave-basics.js — what every wave shares: wavelength,
 * frequency and speed, the two kinds of wave, waves on strings, superposition,
 * standing waves, and what happens at a boundary. */
Hyper.add(

{
  id: 'wave-properties', parent: 'wave-basics', title: 'Wave properties', level: 1,
  short: 'A wave is a travelling disturbance that carries energy from place to place while the medium itself only oscillates about where it is. Amplitude, wavelength, frequency and speed describe it.',
  keywords: ['wave', 'wavelength', 'frequency', 'period', 'amplitude', 'wave speed', 'v = f lambda', 'wave number', 'angular frequency', 'phase', 'crest', 'trough', 'sinusoidal wave', 'hertz'],
  prereq: ['simple-harmonic-motion', 'speed-velocity', 'math:trig-graphs'],
  related: ['transverse-longitudinal', 'speed-of-sound', 'electromagnetic-waves', 'math:wave-equation'],
  body: `
Drop a pebble into a pond. Rings spread outwards across the whole surface, yet a leaf floating on the water only bobs up and down; it does not ride out with the rings. A **wave** is a pattern of disturbance that travels, carrying energy and information, while each bit of the medium only oscillates about its own resting place. A stadium "Mexican wave" is the same thing made of people: the wave runs round the stands at perhaps 12 m/s while every spectator just stands up and sits down again.

### Four numbers describe a wave
- **Amplitude** $A$: the largest displacement from the resting position. The energy a wave carries grows as $A^2$.
- **Wavelength** $\\lambda$: the distance from one crest to the next (or between any two neighbouring points doing the same thing at the same moment).
- **Period** $T$: the time one point takes for a full oscillation. The **frequency** $f = 1/T$ counts oscillations per second, in hertz (Hz).
- **Speed** $v$: how fast a crest moves along.

In one period every point completes one oscillation and the pattern moves on by exactly one wavelength, so

$$v = \\frac{\\lambda}{T} = f\\lambda$$

### Who sets what
The **medium sets the speed** — the tension and mass of a string, the stiffness and density of air or water. The **source sets the frequency** — how often it shakes the medium. When a wave passes into a new medium its frequency stays the same and its wavelength changes to fit the new speed ([[wave-reflection]]). A 440 Hz note has a wavelength of 0.78 m in air (343 m/s) and 3.4 m in water (1480 m/s).

### The sinusoidal wave
A source moving in [[simple-harmonic-motion|simple harmonic motion]] sends out a sine-shaped wave. Travelling towards $+x$ it is

$$y(x, t) = A\\sin(kx - \\omega t), \\qquad k = \\frac{2\\pi}{\\lambda}, \\quad \\omega = 2\\pi f$$

The **wave number** $k$ counts radians of phase per metre, the **angular frequency** $\\omega$ radians per second. Freeze time and you see a sine curve in space, a snapshot; stand at one place and you see simple harmonic motion in time. A crest is a point of constant phase $kx - \\omega t$; keeping it constant as $t$ grows needs $x$ to grow at $dx/dt = \\omega/k = f\\lambda$, the wave speed again. A plus sign, $\\sin(kx + \\omega t)$, is a wave travelling towards $-x$. Every such wave solves the [[math:wave-equation|wave equation]].

| Wave | Frequency | Speed | Wavelength |
|---|---|---|---|
| Ocean swell | 0.1 Hz | about 16 m/s | about 160 m |
| Middle C in air | 262 Hz | 343 m/s | 1.31 m |
| FM radio | 100 MHz | 3.00 × 10⁸ m/s | 3.0 m |
| Ultrasound in tissue | 5 MHz | 1540 m/s | 0.31 mm |
| Green light | 5.6 × 10¹⁴ Hz | 3.00 × 10⁸ m/s | 535 nm |

> [!key] The pattern moves; the medium does not travel with it. What a wave carries from place to place is energy, momentum and information — never the material itself.
`,
  ideas: [
    'A wave carries energy and information from place to place; the medium only oscillates about its resting position.',
    'In one period the wave advances one wavelength, so v = fλ.',
    'The medium sets the wave speed; the source sets the frequency. Crossing into a new medium changes λ, not f.',
    'A sinusoidal wave travelling towards +x is y = A sin(kx − ωt), with k = 2π/λ and ω = 2πf.',
    'The energy a wave carries grows as the square of its amplitude.'
  ],
  pitfalls: [
    'A higher frequency makes a wave travel faster — In a given medium the speed is fixed (for sound in air, to a very good approximation). A higher frequency just means a shorter wavelength.',
    'The water in an ocean wave travels across the ocean with it — Water parcels move in near-circles and end each cycle almost where they started; only the pattern and its energy cross the ocean.',
    'The amplitude is the height from trough to crest — It is measured from the resting position to a crest, half the trough-to-crest height.'
  ],
  formulas: [
    {
      name: 'Wave speed, frequency and wavelength',
      expr: 'v = f*lambda', tex: 'v = f\\lambda', solveFor: 'lambda',
      vars: {
        v: { name: 'wave speed', q: 'speed', unit: 'm/s', value: 343 },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 440 },
        lambda: { name: 'wavelength', q: 'length', unit: 'm' }
      },
      stories: {
        lambda: 'A source vibrating at {f} sends waves through a medium in which they travel at {v}. What is the wavelength?',
        f: 'Waves with crests {lambda} apart travel at {v}. How many crests pass a fixed point each second?',
        v: 'A wave of frequency {f} has a wavelength of {lambda}. How fast does it travel?'
      }
    },
    {
      name: 'Period and frequency',
      expr: 'T = 1/f', tex: 'T = \\frac{1}{f}',
      vars: {
        T: { name: 'period', q: 'time', unit: 'ms' },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 262 }
      },
      stories: { T: 'A tone has a frequency of {f}. How long is one period?', f: 'Each oscillation of a wave takes {T}. What is its frequency?' }
    },
    {
      name: 'Wave number',
      expr: 'k = 2*pi/lambda', tex: 'k = \\frac{2\\pi}{\\lambda}',
      vars: {
        k: { name: 'wave number', q: 'wavenumber', unit: 'rad/m' },
        lambda: { name: 'wavelength', q: 'length', unit: 'm', value: 0.78 }
      }
    },
    {
      name: 'Wave speed from ω and k',
      expr: 'v = omega/k', tex: 'v = \\frac{\\omega}{k}',
      vars: {
        v: { name: 'wave speed', q: 'speed', unit: 'm/s' },
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 2765 },
        k: { name: 'wave number', q: 'wavenumber', unit: 'rad/m', value: 8.06 }
      },
      note: 'Read $\\omega$ and $k$ straight off a wave written as $y = A\\sin(kx - \\omega t)$.',
      stories: { v: 'A wave is described by y = A sin(kx − ωt) with ω = {omega} and k = {k}. How fast does it travel?' }
    }
  ],
  examples: [
    {
      title: 'From a tuning fork to a radio station',
      q: 'Find the wavelength of the note from a 440 Hz tuning fork in air at 20 °C (343 m/s), and of an FM station broadcasting at 98.5 MHz ($3.00 \\times 10^8$ m/s).',
      steps: [
        'Sound: $\\lambda = v/f = 343 / 440 = 0.780\\ \\mathrm{m}$.',
        'Radio: $\\lambda = (3.00 \\times 10^8) / (98.5 \\times 10^6) = 3.05\\ \\mathrm{m}$.',
        'The frequencies differ by a factor of about 220 000, but so do the speeds (radio waves are about 870 000 times faster), so the wavelengths come out of similar size.'
      ],
      a: '0.78 m for the sound, 3.05 m for the radio wave.'
    },
    {
      title: 'Reading a wave equation',
      q: 'A wave on a rope is $y = 0.05\\sin(3.0x - 12t)$ in SI units. Find its amplitude, wavelength, frequency, speed and direction, and the fastest speed of any piece of the rope.',
      steps: [
        'Amplitude: $A = 0.05\\ \\mathrm{m}$.',
        'Wavelength: $\\lambda = 2\\pi/k = 2\\pi/3.0 = 2.09\\ \\mathrm{m}$.',
        'Frequency: $f = \\omega/2\\pi = 12/2\\pi = 1.91\\ \\mathrm{Hz}$.',
        'Speed: $v = \\omega/k = 12/3.0 = 4.0\\ \\mathrm{m/s}$, towards $+x$ (the minus sign).',
        'A piece of rope moves up and down in simple harmonic motion with top speed $A\\omega = 0.05 \\times 12 = 0.60\\ \\mathrm{m/s}$ — nothing to do with the wave speed.'
      ],
      a: 'A = 5 cm, λ = 2.09 m, f = 1.91 Hz, v = 4.0 m/s towards +x; the rope itself moves at up to 0.6 m/s.'
    }
  ],
  quiz: [
    { q: 'A sound wave passes from air into water, where it travels about four times faster. Which quantity stays the same?', choices: ['Wavelength', 'Frequency', 'Speed', 'All three change'], a: 1,
      why: 'The water at the surface is pushed back and forth at the same rate as the air touching it, so the frequency is passed on unchanged. The speed rises, so $\\lambda = v/f$ becomes about four times longer.' },
    { q: 'You play a note twice as high (double the frequency) in the same room. Its wavelength…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 1,
      why: 'The air fixes the speed, so $\\lambda = v/f$ halves when $f$ doubles.' },
    { q: 'The wave $y = A\\sin(kx + \\omega t)$ travels…', choices: ['towards +x', 'towards −x', 'nowhere: it is a standing wave', 'upwards'], a: 1,
      why: 'A crest keeps $kx + \\omega t$ constant, so $x$ must decrease as $t$ increases: $dx/dt = -\\omega/k$.' },
    { q: 'The speed at which a piece of rope moves up and down equals the wave speed along the rope.', a: false,
      why: 'The rope element oscillates with speeds up to $A\\omega$; the pattern moves at $\\omega/k$. In the worked example these are 0.6 m/s and 4 m/s.' },
    { q: 'You double the amplitude of a wave, keeping its frequency. The energy it carries each second becomes…', choices: ['the same', 'twice as much', 'four times as much', 'half as much'], a: 2,
      why: 'Wave energy goes as the square of the amplitude.' }
  ],
  applications: [
    'Tsunami warnings: in the deep ocean a tsunami has a wavelength of around 200 km and travels at about 200 m/s, so its arrival time on distant coasts can be predicted hours ahead.',
    'Antenna design: a quarter-wave antenna for 100 MHz FM radio is about 75 cm long.',
    'Seismology: timing the waves from an earthquake at several stations locates its source.'
  ],
  sim: 'sound-travelling-wave'
},

{
  id: 'transverse-longitudinal', parent: 'wave-basics', title: 'Transverse and longitudinal waves', level: 1,
  short: 'In a transverse wave the medium moves across the direction of travel, as on a shaken rope; in a longitudinal wave it moves back and forth along it, as in sound.',
  keywords: ['transverse wave', 'longitudinal wave', 'compression', 'rarefaction', 'slinky', 'P-wave', 'S-wave', 'seismic waves', 'earthquake', 'polarization', 'surface wave', 'shear wave', 'pressure wave'],
  prereq: ['wave-properties', 'shear-bulk-modulus'],
  related: ['speed-of-sound', 'polarization', 'electromagnetic-waves', 'waves-on-strings'],
  body: `
Stretch a slinky along a table. Flick one end sideways and a hump runs along it: each coil moves sideways, **across** the direction the hump travels — a **transverse** wave. Now push and pull the end along the spring's length: a bunch of crowded coils (a **compression**) runs along, followed by a stretched-out region (a **rarefaction**). Each coil moves back and forth **along** the direction of travel — a **longitudinal** wave.

### Transverse waves
Waves on strings, ropes and drumskins; S-waves ("secondary", shear waves) in rock; and [[electromagnetic-waves|light and radio]], which are transverse oscillations of electric and magnetic fields and need no medium at all. A mechanical transverse wave needs a medium that pushes back when one layer slides past the next — that resists **shear**. Solids do, and so do stretched strings and membranes; the bulk of a liquid or a gas does not, so it cannot carry transverse waves.

Transverse waves can be **polarized**: the oscillation can be up-down, side-to-side or at any angle (or can rotate). Polarizing sunglasses use this to block glare ([[polarization]]). A longitudinal wave has only one direction to oscillate in, so it cannot be polarized.

### Longitudinal waves
Sound in air and water, and P-waves ("primary") in rock. The molecules swing back and forth along the direction of travel, so compressions (pressure and density slightly above normal) alternate with rarefactions (slightly below). Every material resists being squeezed, so longitudinal waves cross solids, liquids and gases alike.

The usual sine curve drawn for sound is a **graph**, not a picture: it plots how far each layer of air is displaced (or how much the pressure changes) against position. Displacement and pressure are a quarter of a wavelength out of step: the pressure change is greatest where the layers on either side have both moved towards the same point, and there the displacement itself is zero.

### Both at once
Water waves are neither: at the surface, water parcels move in near-circles, forward under a crest and backward under a trough. Some earthquake surface waves roll the ground in the same way.

### Listening to the Earth
In the crust P-waves travel at about 6 km/s and S-waves at about 3.5 km/s, so a seismometer records the P-wave first. The lag grows with distance $d$:

$$\\Delta t = \\frac{d}{v_S} - \\frac{d}{v_P}$$

— roughly 8 km for every second of delay. S-waves never reach the side of the Earth opposite a large earthquake: beyond about 104° from the epicentre there is an S-wave "shadow". Early twentieth-century seismologists read this as the signature of a **liquid** outer core, which transverse waves cannot cross.
`,
  ideas: [
    'Transverse: the medium moves perpendicular to the direction of travel. Longitudinal: the medium moves along it.',
    'Sound in air and water is longitudinal: a train of compressions and rarefactions.',
    'Mechanical transverse waves need a medium that resists shear, so they cannot cross the bulk of a liquid or a gas.',
    'Only transverse waves can be polarized.',
    'Light is a transverse wave of electric and magnetic fields and needs no medium.'
  ],
  pitfalls: [
    'Sound wiggles up and down like a wave on a rope — The sine curve drawn for sound is a graph of displacement or pressure against position. The air itself moves back and forth along the direction the sound travels.',
    'Longitudinal waves only happen in gases — Any material that resists compression carries them: sound crosses water and steel faster than air, and P-waves cross the whole Earth.',
    'Water waves are transverse — Surface water moves in near-circles, forward at the crests and backward in the troughs, so surface waves mix both kinds.'
  ],
  formulas: [
    {
      name: 'Earthquake distance from the S–P delay',
      expr: 'dt = d/vS - d/vP', tex: '\\Delta t = \\frac{d}{v_S} - \\frac{d}{v_P}', solveFor: 'd',
      vars: {
        dt: { name: 'delay of the S-wave after the P-wave', q: 'time', unit: 's', value: 12, tex: '\\Delta t' },
        d: { name: 'distance to the earthquake', q: 'length', unit: 'km' },
        vS: { name: 'S-wave speed', q: 'speed', unit: 'km/s', value: 3.5, tex: 'v_S' },
        vP: { name: 'P-wave speed', q: 'speed', unit: 'km/s', value: 6.0, tex: 'v_P' }
      },
      note: 'Assumes both waves travel straight at constant speeds; real seismology uses travel-time tables for the layered Earth.',
      stories: {
        d: 'A seismometer records the P-wave, then the S-wave {dt} later. With P-waves at {vP} and S-waves at {vS}, how far away was the earthquake?',
        dt: 'An earthquake strikes {d} from a station. With P-waves at {vP} and S-waves at {vS}, how long after the P-wave does the S-wave arrive?'
      }
    },
    {
      name: 'Speed of shear (S) waves in a solid',
      expr: 'vS = sqrt(G/rho)', tex: 'v_S = \\sqrt{\\frac{G}{\\rho}}',
      vars: {
        vS: { name: 'S-wave speed', q: 'speed', unit: 'm/s', tex: 'v_S' },
        G: { name: 'shear modulus', q: 'stress', unit: 'GPa', value: 30 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 2700 }
      },
      note: 'Typical granite: $G \\approx 30$ GPa, $\\rho \\approx 2700$ kg/m³. For a liquid $G = 0$: no S-waves.'
    },
    {
      name: 'Speed of compressional (P) waves in a solid',
      expr: 'vP = sqrt((K + 4*G/3)/rho)', tex: 'v_P = \\sqrt{\\frac{K + \\tfrac43 G}{\\rho}}',
      vars: {
        vP: { name: 'P-wave speed', q: 'speed', unit: 'm/s', tex: 'v_P' },
        K: { name: 'bulk modulus', q: 'stress', unit: 'GPa', value: 50 },
        G: { name: 'shear modulus', q: 'stress', unit: 'GPa', value: 30 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 2700 }
      },
      note: 'In a large solid, squeezing one layer also shears it, so both moduli appear. With $G = 0$ this becomes the speed of sound in a fluid, $\\sqrt{K/\\rho}$.'
    }
  ],
  examples: [
    {
      title: 'How far away was the earthquake?',
      q: 'A seismometer records the S-wave 30 s after the P-wave. Taking $v_P = 6.0$ km/s and $v_S = 3.5$ km/s, how far away was the earthquake?',
      steps: [
        'Each kilometre costs the S-wave $1/3.5 = 0.2857$ s and the P-wave $1/6.0 = 0.1667$ s.',
        'So the lag grows by $0.1190$ s per kilometre: $\\Delta t = d\\,(1/v_S - 1/v_P)$.',
        '$d = 30 / 0.1190 = 252\\ \\mathrm{km}$.',
        'One station gives only the distance. Circles drawn from three stations cross at the epicentre.'
      ],
      a: 'About 250 km'
    },
    {
      title: 'Granite: P- and S-waves',
      q: 'Granite has bulk modulus $K = 50$ GPa, shear modulus $G = 30$ GPa and density 2700 kg/m³. Estimate the speeds of its P- and S-waves.',
      steps: [
        '$v_S = \\sqrt{G/\\rho} = \\sqrt{30\\times10^9 / 2700} = 3.3\\ \\mathrm{km/s}$.',
        '$v_P = \\sqrt{(K + \\tfrac43 G)/\\rho} = \\sqrt{(50 + 40)\\times10^9 / 2700} = 5.8\\ \\mathrm{km/s}$.',
        'The P-wave is always the faster one, because squeezing the rock meets both its bulk and its shear stiffness.'
      ],
      a: 'About 5.8 km/s for P-waves and 3.3 km/s for S-waves.'
    }
  ],
  quiz: [
    { q: 'Which of these cannot be polarized?', choices: ['Light', 'A wave on a guitar string', 'Sound in air', 'A radio wave'], a: 2,
      why: 'Sound in air is longitudinal: the air can only move along the direction of travel, so there is no choice of direction to filter.' },
    { q: 'Why do S-waves from a large earthquake not reach the far side of the Earth?', choices: ['They are too slow to get there', 'The liquid outer core cannot carry transverse waves', 'The crust absorbs them', 'They turn into P-waves at the surface'], a: 1,
      why: 'A liquid does not resist shear, so a transverse wave has nothing to push it along. The S-wave shadow was the evidence for a liquid outer core.' },
    { q: 'A sound wave travels east. The air molecules in it move…', choices: ['east only', 'up and down', 'back and forth along the east–west line', 'in circles'], a: 2,
      why: 'Sound is longitudinal: each layer of air oscillates along the direction of travel and ends up where it started.' },
    { q: 'A longitudinal wave can travel through a solid.', a: true,
      why: 'Solids resist compression, so they carry longitudinal waves — P-waves in rock, sound in a steel rail. They also resist shear, so they carry transverse waves too.' }
  ],
  applications: [
    'Earthquake early-warning systems detect the fast P-wave and send alerts before the more damaging S-waves and surface waves arrive.',
    'Polarizing filters in sunglasses and camera lenses (transverse light waves).',
    'Ultrasonic testing of welds uses both longitudinal and shear waves, which reflect differently from cracks.'
  ],
  sim: { id: 'sound-travelling-wave', params: { mode: 'L' } }
},

{
  id: 'waves-on-strings', parent: 'wave-basics', title: 'Waves on a string', level: 2,
  short: 'A wave on a stretched string travels at √(T/μ): faster under more tension, slower on a heavier string. This one relation sets the pitch of every stringed instrument.',
  keywords: ['string', 'tension', 'linear density', 'mass per length', 'wave speed', 'sqrt(T/mu)', 'guitar string', 'wave equation', 'power of a wave', 'rope', 'pulse'],
  prereq: ['wave-properties', 'tension-pulleys', 'newtons-second-law'],
  related: ['standing-waves', 'wave-reflection', 'musical-instruments', 'math:wave-equation', 'centripetal-force'],
  body: `
Pluck a stretched string and a kink runs along it. Two things set how fast. The **tension** $T$ pulls a displaced piece back towards the straight line — the restoring force. The **mass per unit length** $\\mu$ (in kg/m) is the inertia that resists being accelerated. More restoring force and less inertia mean a faster wave:

$$v = \\sqrt{\\frac{T}{\\mu}}$$

The units work: $\\sqrt{\\mathrm{N} / (\\mathrm{kg/m})} = \\sqrt{\\mathrm{m^2/s^2}} = \\mathrm{m/s}$. In fact this is the only way to make a speed out of a force and a mass per length, so the formula could be guessed up to a number; the derivation shows the number is exactly 1.

### Why the square root: riding along with a pulse
Run alongside a pulse at its own speed. In your frame the pulse stands still and the string streams through it at speed $v$. Near the top of the pulse the string follows a small arc of radius $R$. A short piece spanning an angle $2\\theta$ has length $2R\\theta$ and mass $2\\mu R\\theta$; to follow the arc at speed $v$ it needs a [[centripetal-force|centripetal force]] $2\\mu R\\theta \\cdot v^2/R = 2\\mu\\theta v^2$. The tension at its two ends, each tilted by $\\theta$, supplies $2T\\sin\\theta \\approx 2T\\theta$. Setting them equal gives $T = \\mu v^2$ — whatever the radius, so every part of the pulse, and every pulse shape, moves at the same speed.

### Real numbers
The thinnest string on a steel-strung guitar is plain steel 0.254 mm across. Its mass per metre is $\\mu = \\rho\\pi d^2/4 = 3.98 \\times 10^{-4}$ kg/m, about 0.4 grams per metre. Tuned to E4 (329.6 Hz) on a 648 mm scale it carries 72.6 N — the weight of a 7.4 kg mass — and waves run along it at 427 m/s. The thickest string, a wound one, is about 17 times heavier per metre at a similar tension, so its waves are about 4 times slower and its note two octaves lower.

Doubling the tension raises the speed by only $\\sqrt 2 \\approx 1.41$: turning a tuning peg to double the tension lifts the pitch by about six semitones, not an octave.

### The wave equation
Newton's second law applied to a short piece of string (see the derivation) gives

$$\\frac{\\partial^2 y}{\\partial t^2} = \\frac{T}{\\mu}\\,\\frac{\\partial^2 y}{\\partial x^2}$$

the [[math:wave-equation|wave equation]]. Any shape $y = f(x - vt)$ solves it when $v^2 = T/\\mu$: on an ideal string a pulse keeps its shape as it travels. Real strings are slightly stiff, which makes high frequencies travel a little faster — the reason piano tuners stretch their octaves ([[musical-instruments]]).

### Energy carried
A sinusoidal wave of amplitude $A$ and angular frequency $\\omega$ delivers an average power

$$P = \\tfrac12 \\mu\\, \\omega^2 A^2\\, v$$

Twice the amplitude or twice the frequency means four times the power.
`,
  ideas: [
    'The wave speed on a string is v = √(T/μ): tension speeds waves up, mass per length slows them down.',
    'The speed depends only on the string, not on the frequency or the shape of the pulse.',
    'Quadrupling the tension doubles the speed.',
    'On an ideal string any pulse shape travels without changing — a property of the wave equation.',
    'The power a wave carries grows as the square of both its amplitude and its frequency.'
  ],
  pitfalls: [
    'Doubling the tension doubles the wave speed — The speed goes as the square root: doubling T raises v by only 41%.',
    'A harder shake sends a faster pulse — For small displacements the speed is set by T and μ alone. A bigger shake carries more energy at the same speed.',
    'The T in √(T/μ) is the period — Here it is the tension, a force in newtons.'
  ],
  derivation: {
    title: 'Derive the wave equation for a string',
    steps: [
      { text: 'Take a short piece of string between $x$ and $x + \\Delta x$, of mass $\\mu\\,\\Delta x$. The tension $T$ pulls along the string at each end. For small slopes the vertical part of each pull is $T$ times the local slope, and the two ends pull in opposite directions:', tex: 'F_y = T\\left(\\frac{\\partial y}{\\partial x}\\right)_{x + \\Delta x} - T\\left(\\frac{\\partial y}{\\partial x}\\right)_{x}' },
      { text: 'The change in slope over a short distance is the second derivative times that distance:', tex: 'F_y \\approx T\\,\\frac{\\partial^2 y}{\\partial x^2}\\,\\Delta x' },
      { text: 'Newton\'s second law for the piece, which moves only up and down:', tex: '\\mu\\,\\Delta x\\,\\frac{\\partial^2 y}{\\partial t^2} = T\\,\\frac{\\partial^2 y}{\\partial x^2}\\,\\Delta x' },
      { text: 'Cancel $\\Delta x$ to get the wave equation:', tex: '\\frac{\\partial^2 y}{\\partial t^2} = \\frac{T}{\\mu}\\,\\frac{\\partial^2 y}{\\partial x^2}' },
      { text: 'Try any travelling shape $y = f(x - vt)$. Differentiating twice with respect to $t$ brings out a factor $v^2$, differentiating twice with respect to $x$ brings out nothing, so both sides agree for every shape when', tex: 'v^2 = \\frac{T}{\\mu} \\;\\Rightarrow\\; v = \\sqrt{\\frac{T}{\\mu}}' }
    ]
  },
  formulas: [
    {
      name: 'Wave speed on a string',
      expr: 'v = sqrt(T/mu)', tex: 'v = \\sqrt{\\frac{T}{\\mu}}',
      vars: {
        v: { name: 'wave speed', q: 'speed', unit: 'm/s' },
        T: { name: 'tension', q: 'force', unit: 'N', value: 72.6 },
        mu: { name: 'mass per unit length', q: 'lindensity', unit: 'g/m', value: 0.398 }
      },
      stories: {
        v: 'A guitar string with mass per unit length {mu} is tuned to a tension of {T}. How fast do waves run along it?',
        T: 'What tension makes waves travel at {v} on a string with mass per unit length {mu}?',
        mu: 'Waves travel at {v} along a cable under a tension of {T}. What is its mass per metre?'
      }
    },
    {
      name: 'Mass per unit length of a round string',
      expr: 'mu = rho*pi*d^2/4', tex: '\\mu = \\frac{\\rho\\,\\pi d^2}{4}',
      vars: {
        mu: { name: 'mass per unit length', q: 'lindensity', unit: 'g/m' },
        rho: { name: 'density of the material', q: 'density', unit: 'kg/m³', value: 7850 },
        d: { name: 'diameter', q: 'length', unit: 'mm', value: 0.254 }
      },
      note: 'Steel is about 7850 kg/m³, nylon about 1140 kg/m³. Wound strings are heavier than their outer diameter suggests.'
    },
    {
      name: 'Average power carried by a sinusoidal wave',
      expr: 'P = 0.5*mu*omega^2*A^2*v', tex: 'P = \\tfrac12 \\mu\\, \\omega^2 A^2\\, v',
      vars: {
        P: { name: 'average power', q: 'power', unit: 'W' },
        mu: { name: 'mass per unit length', q: 'lindensity', unit: 'kg/m', value: 0.2 },
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 12.57 },
        A: { name: 'amplitude', q: 'length', unit: 'cm', value: 10 },
        v: { name: 'wave speed', q: 'speed', unit: 'm/s', value: 20 }
      },
      stories: { P: 'A rope with {mu} carries waves at {v}. You shake it with amplitude {A} at angular frequency {omega}. What power are you sending along it?' }
    }
  ],
  examples: [
    {
      title: 'Tuning a guitar string',
      q: 'A plain steel string 0.254 mm in diameter (density 7850 kg/m³) is stretched over a 0.648 m scale and tuned to E4, 329.6 Hz. Its fundamental has a wavelength of twice the string length (see [[standing-waves]]). Find the wave speed and the tension.',
      steps: [
        'Wave speed: $v = f\\lambda = 329.6 \\times (2 \\times 0.648) = 427.2\\ \\mathrm{m/s}$.',
        'Mass per metre: $\\mu = \\rho\\pi d^2/4 = 7850 \\times \\pi \\times (2.54\\times10^{-4})^2 / 4 = 3.98\\times10^{-4}\\ \\mathrm{kg/m}$.',
        'Tension: $T = \\mu v^2 = 3.98\\times10^{-4} \\times 427.2^2 = 72.6\\ \\mathrm{N}$.',
        'That is the weight of about 7.4 kg; the six strings of a guitar together pull on its neck with roughly 450–750 N, depending on the string set.'
      ],
      a: 'v ≈ 427 m/s, T ≈ 73 N'
    },
    {
      title: 'Power along a rope',
      q: 'A rope of 0.20 kg/m is under 80 N of tension. You shake one end at 2.0 Hz with an amplitude of 10 cm. How fast do the waves travel, how long are they, and what power do you supply?',
      steps: [
        '$v = \\sqrt{T/\\mu} = \\sqrt{80/0.20} = 20\\ \\mathrm{m/s}$, and $\\lambda = v/f = 10\\ \\mathrm{m}$.',
        '$\\omega = 2\\pi f = 12.57\\ \\mathrm{rad/s}$.',
        '$P = \\tfrac12 \\mu\\omega^2 A^2 v = 0.5 \\times 0.20 \\times 12.57^2 \\times 0.10^2 \\times 20 = 3.2\\ \\mathrm{W}$.'
      ],
      a: '20 m/s, 10 m wavelength, about 3.2 W'
    }
  ],
  quiz: [
    { q: 'To double the wave speed on a string, you must multiply the tension by…', choices: ['√2', '2', '4', '8'], a: 2,
      why: 'v goes as √T, so doubling v needs four times the tension.' },
    { q: 'Two strings are under the same tension; string B has four times the mass per metre of string A. Waves on B travel…', choices: ['four times faster', 'twice as fast', 'half as fast', 'a quarter as fast'], a: 2,
      why: 'v goes as $1/\\sqrt{\\mu}$: four times the mass per metre halves the speed.' },
    { q: 'A rope hangs from the ceiling with its lower end free; its own weight provides the tension. A pulse sent down from the top…', choices: ['speeds up on the way down', 'slows down on the way down', 'keeps a constant speed', 'stops halfway'], a: 1,
      why: 'At height $y$ above the bottom the tension is the weight of the rope below, $\\mu g y$, so $v = \\sqrt{g y}$: the pulse slows as it nears the free end.' },
    { q: 'Shaking the end of a rope twice as often (same amplitude) makes the waves travel faster.', a: false,
      why: 'The speed is set by T and μ. The wavelength halves and the power carried quadruples, but the speed is unchanged.' }
  ],
  applications: [
    'Stringed instruments: makers choose string material, diameter and tension so that each string reaches its note at a comfortable tension.',
    'Checking the tension in bridge cables, guy wires and power lines by timing a pulse or measuring the vibration frequency.',
    'The same wave equation describes signals on transmission lines, sound in pipes and waves on stretched membranes.'
  ],
  sim: { id: 'sound-reflection', params: { boundary: 'heavy' } }
},

{
  id: 'superposition', parent: 'wave-basics', title: 'Superposition and interference', level: 2,
  short: 'When waves overlap, their displacements simply add. Where crest meets crest they reinforce; where crest meets trough they cancel — and afterwards each wave carries on as if nothing had happened.',
  keywords: ['superposition', 'interference', 'constructive interference', 'destructive interference', 'path difference', 'phase difference', 'noise cancelling', 'coherent', 'in phase', 'out of phase', 'linear medium'],
  prereq: ['wave-properties', 'math:sum-and-difference'],
  related: ['standing-waves', 'beats', 'double-slit', 'thin-film-interference', 'huygens-principle'],
  body: `
Send two pulses towards each other along a rope. Where they overlap, the rope's displacement at every point is simply the sum of what each pulse alone would give there. Two humps make a hump twice as tall; a hump and an equal dip cancel, and for an instant the rope is flat. A moment later both pulses emerge unchanged and carry on. This is the **principle of superposition**:

$$y(x, t) = y_1(x, t) + y_2(x, t)$$

It holds whenever the medium responds in proportion to the push — for small waves on strings, for everyday sound, and exactly for light in empty space. Very violent waves, such as the pressure jumps of [[shock-waves|shock waves]], break it.

Where does the energy go when the rope is momentarily flat? Into motion: at that instant the rope is straight but moving fast, and all the energy is kinetic.

### Interference of two sources
Two loudspeakers driven by the same signal send out waves with a fixed phase relation (they are **coherent**). At a listener a distance $r_1$ from one and $r_2$ from the other, the waves arrive with a **path difference** $\\Delta r = |r_1 - r_2|$ and so with a **phase difference**

$$\\varphi = 2\\pi\\,\\frac{\\Delta r}{\\lambda}$$

- **Constructive** interference (loud) when $\\Delta r = 0, \\lambda, 2\\lambda, \\dots$ — crest meets crest.
- **Destructive** interference (quiet) when $\\Delta r = \\tfrac12\\lambda, \\tfrac32\\lambda, \\dots$ — crest meets trough.

For two waves of equal amplitude $A$ the result is a wave of the same frequency with amplitude

$$A_R = 2A\\left|\\cos\\frac{\\varphi}{2}\\right|$$

which follows from the identity $\\sin\\alpha + \\sin\\beta = 2\\sin\\tfrac{\\alpha+\\beta}{2}\\cos\\tfrac{\\alpha-\\beta}{2}$ ([[math:sum-and-difference|sum and difference formulas]]). Since intensity goes as amplitude squared, the loud spots get **four** times the intensity of one speaker and the quiet spots none; averaged over the room it comes to twice. Energy is not created or destroyed, only redistributed.

### Noise cancelling
Headphones with active noise cancellation pick up the outside noise with a microphone and play an inverted copy ($\\varphi = \\pi$), which cancels it at the ear. It works best for steady low-frequency noise — engine drone, the rumble of a train — whose long wavelengths make the timing easy.

> [!note] Interference needs a steady phase relation. Two independent sources, such as two people talking, drift in and out of step thousands of times a second, and on average their intensities just add.

The same idea, with light instead of sound, gives the fringes of the [[double-slit|double slit]] and the colours of [[thin-film-interference|soap films]]; with two slightly different frequencies it gives [[beats]]; with two equal waves travelling in opposite directions, [[standing-waves|standing waves]].
`,
  ideas: [
    'Overlapping waves add displacement by displacement: y = y₁ + y₂.',
    'Waves pass through each other unchanged; they interact only where and while they overlap.',
    'A path difference of a whole number of wavelengths gives constructive interference; an odd number of half-wavelengths gives destructive interference.',
    'Interference redistributes energy: the loud spots gain what the quiet spots lose.'
  ],
  pitfalls: [
    'When two waves cancel, their energy is destroyed — It is moved elsewhere: into the loud spots of the pattern, or (for two colliding pulses) briefly into the motion of the medium.',
    'Two loudspeakers always give twice the intensity of one — In some places four times, in others nothing; only the average over many places is twice.',
    'Colliding pulses bounce off each other — They pass straight through. With two lopsided pulses you can see that each keeps its own shape and direction.'
  ],
  derivation: {
    title: 'The amplitude of two equal waves with a phase difference',
    steps: [
      { text: 'Two waves of equal amplitude and frequency arrive at a point with phase difference $\\varphi$:', tex: 'y = A\\sin(\\omega t) + A\\sin(\\omega t + \\varphi)' },
      { text: 'Apply $\\sin\\alpha + \\sin\\beta = 2\\sin\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}$:', tex: 'y = 2A\\cos\\frac{\\varphi}{2}\\,\\sin\\left(\\omega t + \\frac{\\varphi}{2}\\right)' },
      { text: 'This is a single oscillation of the same frequency. Its amplitude is the size of the factor in front:', tex: 'A_R = 2A\\left|\\cos\\frac{\\varphi}{2}\\right|' },
      { text: 'It is $2A$ for $\\varphi = 0, 2\\pi, \\dots$ and zero for $\\varphi = \\pi, 3\\pi, \\dots$. The intensity, proportional to $A_R^2$, averages to $2A^2$ over all phases: twice that of one wave.', tex: '\\overline{A_R^2} = 4A^2\\,\\overline{\\cos^2\\frac{\\varphi}{2}} = 2A^2' }
    ]
  },
  formulas: [
    {
      name: 'Phase difference from path difference',
      expr: 'phi = 2*pi*dr/lambda', tex: '\\varphi = 2\\pi\\,\\frac{\\Delta r}{\\lambda}',
      vars: {
        phi: { name: 'phase difference', q: 'angle', unit: '°', tex: '\\varphi' },
        dr: { name: 'path difference', q: 'length', unit: 'm', value: 0.85, tex: '\\Delta r' },
        lambda: { name: 'wavelength', q: 'length', unit: 'm', value: 1.7 }
      },
      stories: { phi: 'Two speakers playing in step send waves of wavelength {lambda} to a listener whose distances from them differ by {dr}. What is the phase difference between the arriving waves?' }
    },
    {
      name: 'Resultant of two equal waves',
      expr: 'AR = 2*A*cos(phi/2)', tex: 'A_R = 2A\\cos\\frac{\\varphi}{2}',
      vars: {
        AR: { name: 'resultant amplitude', q: 'length', unit: 'mm', tex: 'A_R' },
        A: { name: 'amplitude of each wave', q: 'length', unit: 'mm', value: 10 },
        phi: { name: 'phase difference', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\varphi' }
      },
      note: 'Written for $0 \\le \\varphi \\le 180°$; beyond that use $|\\cos(\\varphi/2)|$ (the pattern repeats symmetrically).',
      stories: { AR: 'Two waves of amplitude {A} overlap with a phase difference of {phi}. What is the amplitude of the result?', phi: 'Two waves of amplitude {A} combine into a wave of amplitude {AR}. What is their phase difference?' }
    },
    {
      name: 'Frequencies that cancel at a listener',
      expr: 'f = (n + 0.5)*v/dr', tex: 'f = \\left(n + \\tfrac12\\right)\\frac{v}{\\Delta r}',
      vars: {
        f: { name: 'frequency of a quiet spot', q: 'frequency', unit: 'Hz' },
        n: { name: 'order (0, 1, 2 …)', int: true, value: 0 },
        v: { name: 'speed of sound', q: 'speed', unit: 'm/s', value: 343, min: 300, max: 360 },
        dr: { name: 'path difference', q: 'length', unit: 'm', value: 0.85, tex: '\\Delta r' }
      },
      practice: { unknowns: ['f', 'dr'] },
      note: 'Two sources in step. Destructive interference needs $\\Delta r = (n + \\tfrac12)\\lambda$; with $\\lambda = v/f$ this picks out the frequencies that cancel at that spot.',
      stories: { f: 'A listener is {dr} farther from one loudspeaker than from the other; both play the same tone in step, and sound travels at {v}. Which frequency is cancelled there for n = {n}?' }
    }
  ],
  examples: [
    {
      title: 'Dead spots in front of two speakers',
      q: 'Two loudspeakers play the same tone in step. You sit 4.00 m from one and 4.85 m from the other. Which frequencies below 1100 Hz are cancelled at your seat, and which are reinforced? (Sound speed 343 m/s.)',
      steps: [
        'Path difference: $\\Delta r = 0.85\\ \\mathrm{m}$.',
        'Destructive when $\\Delta r = (n + \\tfrac12)\\lambda$, so $f = (n + \\tfrac12)\\,v/\\Delta r = (n + \\tfrac12) \\times 403.5\\ \\mathrm{Hz}$: 202 Hz, 605 Hz and 1009 Hz.',
        'Constructive when $\\Delta r = n\\lambda$: $f = n \\times 403.5$ Hz, so 404 Hz and 807 Hz.',
        'In a real room, reflections from the walls blur this pattern, which is why it is most noticeable outdoors or for low notes.'
      ],
      a: 'Cancelled: about 202, 605 and 1009 Hz. Reinforced: about 404 and 807 Hz.'
    },
    {
      title: 'Adding waves with a phase difference',
      q: 'Two waves of amplitude 2.0 mm meet with a phase difference of 90°, and then of 120°. Find the resultant amplitude and compare the intensity with one wave alone.',
      steps: [
        '90°: $A_R = 2 \\times 2.0 \\times \\cos 45° = 2.83\\ \\mathrm{mm}$. Intensity ratio $(2.83/2.0)^2 = 2$: exactly the sum of the two intensities.',
        '120°: $A_R = 2 \\times 2.0 \\times \\cos 60° = 2.0\\ \\mathrm{mm}$ — the same as one wave alone. The second wave adds nothing here.'
      ],
      a: '2.83 mm (twice the intensity) at 90°; 2.0 mm (same as one wave) at 120°.'
    }
  ],
  quiz: [
    { q: 'An upright pulse and an equal inverted pulse meet on a rope. At the instant they overlap exactly, the rope is straight. At that instant the rope is…', choices: ['at rest everywhere', 'moving: all the energy is kinetic', 'storing all the energy in its stretch', 'broken into two'], a: 1,
      why: 'The displacements cancel but the velocities do not: the rope is flat and moving, and a moment later the pulses re-form.' },
    { q: 'Two speakers play a 343 Hz tone in step (wavelength 1.00 m). At a point 3.5 m from one and 5.0 m from the other you hear…', choices: ['a loud spot (constructive)', 'a quiet spot (destructive)', 'beats', 'a note at twice the frequency'], a: 1,
      why: 'The path difference is 1.5 m = 1.5 λ, an odd number of half-wavelengths.' },
    { q: 'Two waves of amplitude A meet with a phase difference of 120°. The resultant amplitude is…', choices: ['0', 'A', '√2 A', '2A'], a: 1,
      why: '$A_R = 2A\\cos 60° = A$.' },
    { q: 'Superposition means that waves bounce off each other when they meet.', a: false,
      why: 'They add while they overlap and then pass on unchanged, each in its original direction.' },
    { q: 'Two coherent sources give 4I₀ at their loud spots, where one alone gives I₀. Averaged over the whole pattern, the intensity is…', choices: ['I₀', '2I₀', '4I₀', '0'], a: 1,
      why: 'Energy is conserved: the pattern moves intensity from the quiet spots to the loud ones, and the average is the sum of the two, 2I₀.' }
  ],
  applications: [
    'Active noise control in headphones, car cabins and aircraft.',
    'Loudspeaker and subwoofer placement, avoiding low-frequency dead spots in a listening room.',
    'Phased-array sonar, radar and ultrasound probes steer a beam by adjusting the phase of many small sources.'
  ],
  sim: 'sound-superposition'
},

{
  id: 'standing-waves', parent: 'wave-basics', title: 'Standing waves', level: 2,
  short: 'Two equal waves travelling in opposite directions make a pattern that stays put: points that never move (nodes) alternate with points of largest motion (antinodes). On a string of fixed length only certain frequencies fit.',
  keywords: ['standing wave', 'stationary wave', 'node', 'antinode', 'harmonic', 'fundamental', 'overtone', 'normal mode', 'resonance', 'harmonic series', 'natural frequency', 'Melde'],
  prereq: ['superposition', 'waves-on-strings', 'wave-reflection'],
  related: ['air-columns', 'harmonics-timbre', 'musical-instruments', 'driven-oscillations', 'particle-in-a-box'],
  body: `
Tie a rope to a wall and shake the free end at just the right rate: the rope stops looking like a travelling wave and divides into loops that swell and shrink in place. The wave you send and its reflection from the wall run through each other in opposite directions and [[superposition|superpose]]:

$$y = A\\sin(kx - \\omega t) + A\\sin(kx + \\omega t) = 2A\\sin(kx)\\,\\cos(\\omega t)$$

Space and time have separated. Every point oscillates in step, following $\\cos\\omega t$, but each with its own amplitude $2A|\\sin kx|$:
- **Nodes**, where $\\sin kx = 0$ ($x = 0, \\tfrac12\\lambda, \\lambda, \\dots$), never move.
- **Antinodes**, halfway between, swing with the full amplitude $2A$.

Neighbouring nodes are **half a wavelength** apart. All points within one loop move together; neighbouring loops move in opposite directions. Energy sloshes between motion and stretch inside each loop, but on average none flows past a node: a standing wave stores energy rather than carrying it.

### A string fixed at both ends
Both ends must be nodes, so a whole number of half-wavelengths has to fit on the string: $L = n\\lambda/2$. With $f = v/\\lambda$ and the [[waves-on-strings|string's wave speed]] $v = \\sqrt{T/\\mu}$,

$$\\lambda_n = \\frac{2L}{n}, \\qquad f_n = \\frac{n v}{2L} = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}, \\qquad n = 1, 2, 3, \\dots$$

These are the **normal modes** — the string's natural frequencies. The lowest, $f_1$, is the **fundamental** or first harmonic; the others are whole-number multiples $2f_1, 3f_1, \\dots$, the **harmonic series**. Drive the string at one of them and a large vibration builds up: [[driven-oscillations|resonance]]. Pluck or bow it and many modes sound at once; their mixture is the tone's [[harmonics-timbre|timbre]].

### Numbers and tricks
A cello's A string is 0.69 m long and tuned to 220 Hz, so waves on it travel at $v = 2Lf = 304$ m/s; its harmonics are 440, 660, 880 Hz and so on. Touch the string lightly at its midpoint: the odd modes, which need that point to move, are killed, the even ones (with a node there) survive, and the note jumps an octave — the "harmonics" string players use.

### Standing waves everywhere
The air in [[air-columns|pipes and wind instruments]], drumheads and bells (in two dimensions), the microwaves bouncing inside an oven — and, in quantum physics, the electron in an atom, whose allowed energies are the "harmonics" of a matter wave ([[particle-in-a-box]]).

> [!tip] Measure the speed of light in the kitchen. Take the turntable out of a microwave oven and heat a plate of chocolate for a few seconds. It melts first at the antinodes, which are half a wavelength apart — about 6.1 cm. With the oven's 2.45 GHz (printed on its label), $c = 2 \\times 0.061\\ \\mathrm{m} \\times 2.45 \\times 10^9\\ \\mathrm{Hz} \\approx 3.0 \\times 10^8$ m/s.
`,
  ideas: [
    'Two identical waves travelling in opposite directions superpose into a standing wave, y = 2A sin kx cos ωt.',
    'Nodes never move; antinodes swing the most; neighbouring nodes are half a wavelength apart.',
    'A string fixed at both ends holds a whole number of half-wavelengths: fₙ = nv/2L.',
    'The allowed frequencies form the harmonic series f₁, 2f₁, 3f₁, …',
    'On average a standing wave carries no energy along the string; it stores it.'
  ],
  pitfalls: [
    'A standing wave is not really a wave, since nothing travels — It is the sum of two travelling waves carrying equal energy in opposite directions; their net transport is zero.',
    'Only the fundamental can resonate — Every harmonic is a natural frequency. Drive a string at 3f₁ and it vibrates in three loops.',
    'The wavelength of the fundamental equals the string length — It is twice the length: the string holds only half a wavelength.'
  ],
  derivation: {
    title: 'Add two opposite travelling waves',
    steps: [
      { text: 'The wave sent along the string and its reflection have equal amplitude and frequency and opposite directions:', tex: 'y_1 = A\\sin(kx - \\omega t), \\qquad y_2 = A\\sin(kx + \\omega t)' },
      { text: 'Use $\\sin\\alpha + \\sin\\beta = 2\\sin\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}$ with $\\alpha = kx - \\omega t$ and $\\beta = kx + \\omega t$:', tex: 'y = y_1 + y_2 = 2A\\sin(kx)\\cos(\\omega t)' },
      { text: 'The end $x = 0$ is a node automatically. The other end, $x = L$, must be a node too:', tex: '\\sin kL = 0 \\;\\Rightarrow\\; kL = n\\pi \\;\\Rightarrow\\; \\lambda_n = \\frac{2L}{n}' },
      { text: 'With $f = v/\\lambda$ and $v = \\sqrt{T/\\mu}$:', tex: 'f_n = \\frac{n v}{2L} = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}' }
    ]
  },
  formulas: [
    {
      name: 'Harmonics of a string fixed at both ends',
      expr: 'f = n*v/(2*L)', tex: 'f_n = \\frac{n v}{2L}',
      vars: {
        f: { name: 'frequency of the nth harmonic', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'harmonic number', int: true, value: 1 },
        v: { name: 'wave speed on the string', q: 'speed', unit: 'm/s', value: 303.6 },
        L: { name: 'string length', q: 'length', unit: 'm', value: 0.69 }
      },
      stories: {
        f: 'Waves travel at {v} on a cello string {L} long. What is the frequency of harmonic number {n}?',
        v: 'A string {L} long vibrates in harmonic {n} at {f}. How fast do waves travel on it?'
      }
    },
    {
      name: 'Frequency from tension and mass (Mersenne\'s laws)',
      expr: 'f = n/(2*L)*sqrt(T/mu)', tex: 'f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}',
      vars: {
        f: { name: 'frequency of the nth harmonic', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'harmonic number', int: true, value: 1 },
        L: { name: 'vibrating length', q: 'length', unit: 'm', value: 0.648 },
        T: { name: 'tension', q: 'force', unit: 'N', value: 72.6 },
        mu: { name: 'mass per unit length', q: 'lindensity', unit: 'g/m', value: 0.398 }
      },
      stories: {
        f: 'A string {L} long with mass {mu} is under a tension of {T}. What is the frequency of harmonic {n}?',
        T: 'A string {L} long with mass {mu} must sound {f} as harmonic {n}. What tension is needed?'
      }
    },
    {
      name: 'Wave speed from the node spacing',
      expr: 'v = 2*d*f', tex: 'v = 2 d f',
      vars: {
        v: { name: 'wave speed', q: 'speed', unit: 'm/s' },
        d: { name: 'distance between neighbouring nodes (or antinodes)', q: 'length', unit: 'cm', value: 6.1 },
        f: { name: 'frequency', q: 'frequency', unit: 'GHz', value: 2.45 }
      },
      note: 'Neighbouring nodes are half a wavelength apart, so $\\lambda = 2d$ and $v = f\\lambda$.',
      practice: { unknowns: ['v'] },
      stories: { v: 'In a standing wave of frequency {f}, neighbouring nodes are {d} apart. How fast do the travelling waves that make it up move?' }
    }
  ],
  examples: [
    {
      title: 'The microwave-oven measurement',
      q: 'Melted spots in chocolate heated in a 2.45 GHz microwave oven (turntable removed) are 6.1 cm apart. What is the wavelength, and what speed of light does this give?',
      steps: [
        'Hot spots are antinodes, half a wavelength apart: $\\lambda = 2 \\times 6.1 = 12.2\\ \\mathrm{cm}$.',
        '$c = f\\lambda = 2.45\\times10^9 \\times 0.122 = 2.99\\times10^8\\ \\mathrm{m/s}$.',
        'Measuring the spacing to a few millimetres gives the speed of light to within a few per cent.'
      ],
      a: 'λ ≈ 12 cm, c ≈ 3.0 × 10⁸ m/s'
    },
    {
      title: 'Harmonics and their nodes',
      q: 'A guitar string 0.648 m long has a fundamental of 110 Hz (A2). List its first four harmonics, and find where the nodes of the third harmonic are.',
      steps: [
        '$f_n = n f_1$: 110, 220, 330 and 440 Hz.',
        'The third harmonic has three loops, so its nodes are at 0, $L/3$, $2L/3$ and $L$: 0, 21.6 cm, 43.2 cm and 64.8 cm from the nut.',
        'Touching the string lightly 21.6 cm from either end silences every mode that needs that point to move, leaving the third harmonic (and its multiples): a clear 330 Hz.'
      ],
      a: '110, 220, 330, 440 Hz; nodes of the 3rd harmonic every 21.6 cm.'
    }
  ],
  quiz: [
    { q: 'A string fixed at both ends vibrates in its 4th harmonic. How many nodes are there, counting both ends?', choices: ['3', '4', '5', '8'], a: 2,
      why: 'n loops need n + 1 nodes: 5 for the 4th harmonic.' },
    { q: 'The distance between neighbouring nodes of a standing wave is…', choices: ['λ/4', 'λ/2', 'λ', '2λ'], a: 1,
      why: '$\\sin kx = 0$ every time $kx$ grows by π, which is half a wavelength.' },
    { q: 'A string\'s fundamental is 196 Hz (G3). Which of these can NOT be one of its natural frequencies?', choices: ['392 Hz', '588 Hz', '490 Hz', '784 Hz'], a: 2,
      why: '490/196 = 2.5 is not a whole number; the others are the 2nd, 3rd and 4th harmonics.' },
    { q: 'The tension in a string is increased by a factor of 4. Every harmonic frequency…', choices: ['doubles', 'quadruples', 'halves', 'is unchanged'], a: 0,
      why: 'fₙ is proportional to √T.' },
    { q: 'All the points between two neighbouring nodes move in phase: they reach their highest points together.', a: true,
      why: 'Every point follows the same factor cos ωt; only its amplitude 2A sin kx differs. The next loop has sin kx of the opposite sign, so it moves the opposite way.' }
  ],
  applications: [
    'Every stringed instrument: the length, tension and mass of each string fix its harmonic series.',
    'Microwave ovens have hot and cold spots at the antinodes and nodes of their standing waves; the turntable carries food through them.',
    'Engineers keep the standing-wave modes of bridges, turbine blades and tall buildings away from the frequencies of wind, traffic and machinery.'
  ],
  sim: 'sound-standing-waves'
},

{
  id: 'wave-reflection', parent: 'wave-basics', title: 'Reflection and transmission of waves', level: 2,
  short: 'At a boundary between two media part of a wave bounces back and part goes on. How much of each, and whether the reflection comes back upside down, depends on how different the two media are — their impedances.',
  keywords: ['reflection', 'transmission', 'impedance', 'acoustic impedance', 'fixed end', 'free end', 'phase inversion', 'echo', 'boundary', 'reflection coefficient', 'impedance matching', 'rayl'],
  prereq: ['waves-on-strings', 'superposition'],
  related: ['standing-waves', 'reflection', 'ultrasound', 'the-ear', 'refraction'],
  body: `
Send a pulse along a rope tied to a wall. It comes back — **upside down**. Tie the rope instead to a light ring that slides freely on a smooth pole, and the pulse comes back **upright**.

### Fixed and free ends
At a fixed end the rope cannot move. As the pulse arrives it pulls up on the wall; the wall pulls down on the rope (Newton's third law) and launches an inverted pulse back. Another way to see it: the rope behaves as if an inverted mirror-image pulse were arriving from beyond the wall, timed so that the two always cancel at the end — [[superposition]] keeps the end still.

At a free end nothing can hold the rope sideways, so the string there must stay level (a massless ring cannot take a sideways force). The end overshoots to **twice** the pulse height and sends back an upright pulse, as if an upright mirror image were arriving from beyond.

### Joining two strings: impedance
Knot a light string to a heavier one under the same tension. A pulse reaching the knot splits: part goes on, part comes back. What decides the split is the **impedance** $Z$ of each medium — for a string $Z = \\sqrt{T\\mu} = \\mu v$, for sound the **acoustic impedance** $Z = \\rho v$. As fractions of the incoming amplitude,

$$r = \\frac{Z_1 - Z_2}{Z_1 + Z_2}, \\qquad t = \\frac{2Z_1}{Z_1 + Z_2}$$

- Into a **higher** impedance (light to heavy string, air to water) $r$ is negative: the reflection is inverted, as at a fixed end ($Z_2 \\to \\infty$ gives $r = -1$).
- Into a **lower** impedance $r$ is positive: the reflection is upright, as at a free end ($Z_2 \\to 0$ gives $r = +1$).
- **Equal** impedances give $r = 0$: everything goes through. Making them equal on purpose is **impedance matching**.

The frequency never changes at a boundary; the speed and wavelength do. A pulse entering a heavier string slows down and gets shorter.

Energy is shared out, not amplitude. The fractions of the power reflected and transmitted are $R = r^2$ and $\\mathcal{T} = (Z_2/Z_1)\\,t^2$, and they always add up to 1. Going into a lighter string, $t$ can approach 2 — a taller pulse — but it carries less power because the light string's impedance is small.

### Sound at a boundary
| Medium | Acoustic impedance (kg m⁻² s⁻¹) |
|---|---|
| Air | 413 |
| Water | 1.48 × 10⁶ |
| Soft tissue | 1.63 × 10⁶ |
| Bone | about 7 × 10⁶ |
| Steel | 4.6 × 10⁷ |

Air and water differ by a factor of 3600, so only about 0.1% of the sound power crosses between them — a loss of 30 dB. That is why the world goes quiet when you put your head under water, why [[ultrasound]] scanners need a layer of gel on the skin, and why the middle ear needs its lever system to pass sound into the fluid of the inner ear ([[the-ear]]). It is also why an open pipe end reflects sound back into the pipe, even though nothing is there but more air: the sudden widening is a change of impedance ([[air-columns]]).

> [!note] For sound, $r$ as written refers to the displacement of the air. The pressure wave reflects with the opposite sign: a hard wall sends pressure back upright and doubles it at the wall.
`,
  ideas: [
    'At any boundary a wave is partly reflected and partly transmitted; its frequency does not change.',
    'A reflection from a fixed end or a higher-impedance medium is inverted; from a free end or a lower-impedance medium it is upright.',
    'The split is set by the impedances: r = (Z₁ − Z₂)/(Z₁ + Z₂). Equal impedances mean no reflection.',
    'A large impedance mismatch, such as air to water, reflects almost all the energy.'
  ],
  pitfalls: [
    'A wave slows down at a boundary because it loses energy — The speed changes because the new medium has a different stiffness and density. The frequency stays, so the wavelength adapts.',
    'A transmitted pulse taller than the incoming one breaks energy conservation — Power goes as Z A², and a lighter string has a smaller impedance; the reflected and transmitted powers still add up to the incoming power.',
    'Only hard walls reflect sound — Any change of impedance reflects some: even the open end of a pipe reflects most low-frequency sound back inside.'
  ],
  formulas: [
    {
      name: 'Acoustic impedance',
      expr: 'Z = rho*v', tex: 'Z = \\rho v',
      vars: {
        Z: { name: 'acoustic impedance', unit: 'kg/(m²·s)' },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 1000 },
        v: { name: 'speed of sound in the medium', q: 'speed', unit: 'm/s', value: 1480 }
      },
      note: 'The unit kg m⁻² s⁻¹ is also called the rayl. For a string the matching quantity is $Z = \\mu v = \\sqrt{T\\mu}$.'
    },
    {
      name: 'Reflected amplitude at a boundary',
      expr: 'r = (Z1 - Z2)/(Z1 + Z2)', tex: 'r = \\frac{Z_1 - Z_2}{Z_1 + Z_2}',
      vars: {
        r: { name: 'reflected ÷ incoming amplitude', signed: true },
        Z1: { name: 'impedance of the first medium', unit: 'kg/(m²·s)', value: 413 },
        Z2: { name: 'impedance of the second medium', unit: 'kg/(m²·s)', value: 1.48e6 }
      },
      note: 'Negative $r$: the reflection is inverted. For sound, $r$ refers to the displacement of the medium.',
      stories: { r: 'Sound in a medium of impedance {Z1} meets one of impedance {Z2}. What fraction of the amplitude is reflected, and with which sign?' }
    },
    {
      name: 'Fraction of the power transmitted',
      expr: 'tau = 4*Z1*Z2/(Z1 + Z2)^2', tex: '\\tau = \\frac{4 Z_1 Z_2}{(Z_1 + Z_2)^2}',
      vars: {
        tau: { name: 'fraction of the power transmitted', q: 'ratio', unit: '%', tex: '\\tau' },
        Z1: { name: 'impedance of the first medium', unit: 'kg/(m²·s)', value: 413 },
        Z2: { name: 'impedance of the second medium', unit: 'kg/(m²·s)', value: 1.48e6 }
      },
      note: 'Symmetric in $Z_1$ and $Z_2$: the same fraction crosses in either direction. The rest, $1 - \\tau = r^2$, is reflected.',
      stories: { tau: 'What fraction of the sound power crosses from a medium of impedance {Z1} into one of impedance {Z2}?' }
    }
  ],
  examples: [
    {
      title: 'Why the swimming pool goes quiet',
      q: 'What fraction of the sound power in air ($Z_1 = 413$ kg m⁻² s⁻¹) crosses into water ($Z_2 = 1.48\\times10^6$)? Express the loss in decibels.',
      steps: [
        '$\\tau = \\dfrac{4 Z_1 Z_2}{(Z_1 + Z_2)^2} = \\dfrac{4 \\times 413 \\times 1.48\\times10^6}{(1.4804\\times10^6)^2} = 1.12\\times10^{-3}$.',
        'Only about 0.11% gets through; 99.9% is reflected.',
        'In decibels: $10\\log_{10}(1.12\\times10^{-3}) = -29.5$ dB ([[sound-intensity]]).'
      ],
      a: 'About 0.1% of the power, a loss of about 30 dB.'
    },
    {
      title: 'From a light string to a heavy one',
      q: 'A pulse 2.0 cm tall runs along a string of 5 g/m towards a knot joining it to a string of 20 g/m under the same tension. Describe the reflected and transmitted pulses.',
      steps: [
        'At equal tension $Z = \\sqrt{T\\mu}$, so $Z_2/Z_1 = \\sqrt{20/5} = 2$.',
        '$r = (1 - 2)/(1 + 2) = -1/3$: a reflected pulse 0.67 cm tall, **inverted**.',
        '$t = 2/(1 + 2) = 2/3$: a transmitted pulse 1.33 cm tall, upright, travelling at half the speed ($v \\propto 1/\\sqrt{\\mu}$) and half as long.',
        'Energy check: $R = r^2 = 1/9$ and $\\mathcal{T} = (Z_2/Z_1)t^2 = 2 \\times 4/9 = 8/9$; together 1.'
      ],
      a: 'Reflected: inverted, 0.67 cm (11% of the energy). Transmitted: upright, 1.33 cm, half speed (89%).'
    }
  ],
  quiz: [
    { q: 'A pulse on a rope reaches an end tied firmly to a wall. It comes back…', choices: ['upright', 'inverted', 'with double the height', 'not at all: the wall absorbs it'], a: 1,
      why: 'The fixed end cannot move, so the wall pulls the rope the opposite way and launches an inverted pulse.' },
    { q: 'A pulse travels from a thick rope into a thin rope under the same tension. The reflected pulse is…, and the transmitted pulse travels…', choices: ['inverted; slower', 'upright; faster', 'inverted; faster', 'upright; slower'], a: 1,
      why: 'Going into lower impedance gives r > 0 (upright). The thin rope has smaller μ, so waves on it are faster.' },
    { q: 'When a wave crosses into a new medium, which quantity does not change?', choices: ['Speed', 'Wavelength', 'Frequency', 'Amplitude'], a: 2,
      why: 'Both sides of the boundary move together, so they oscillate at the same rate. Speed and wavelength change together.' },
    { q: 'Gel is spread on the skin before an ultrasound scan because…', choices: ['it cools the probe', 'it replaces the air gap, whose impedance mismatch would reflect almost all the sound', 'it amplifies the sound', 'it slows the sound down for sharper images'], a: 1,
      why: 'Air and tissue differ in impedance by a factor of about 4000; even a thin air gap would reflect nearly everything back into the probe.' },
    { q: 'Two strings with equal impedance are knotted together. A pulse crossing the knot is partly reflected.', a: false,
      why: 'With $Z_1 = Z_2$, $r = 0$: the knot is invisible to the wave.' }
  ],
  applications: [
    'Ultrasound gel, and the quarter-wave matching layers on the face of ultrasound transducers.',
    'Loudspeaker horns and the bells of brass instruments ease the impedance change from a narrow throat to open air.',
    'Seismic reflection surveys map buried rock layers from the echoes at each boundary; mismatched cable ends echo signals back in the same way.'
  ],
  sim: 'sound-reflection'
}

);
