/* HYPER-PHYSICS · content/oscillations.js — simple harmonic motion, springs and pendulums,
 * energy, damping, driving and resonance. Simulations in sims/mechanics-2.js. */
Hyper.add(

{
  id: 'simple-harmonic-motion', parent: 'oscillations', title: 'Simple harmonic motion', level: 2,
  short: 'The smooth back-and-forth motion of anything pulled back towards equilibrium with a force proportional to its displacement. Its period does not depend on how far it swings.',
  keywords: ['simple harmonic motion', 'SHM', 'oscillation', 'amplitude', 'period', 'frequency', 'angular frequency', 'phase', 'restoring force', 'sinusoidal', 'reference circle', 'isochronous'],
  prereq: ['newtons-second-law', 'uniform-circular-motion', 'math:trig-graphs', 'math:harmonic-oscillator-ode'],
  related: ['mass-spring-system', 'simple-pendulum', 'energy-in-shm', 'wave-properties', 'quantum-harmonic-oscillator'],
  body: `
Pull a mass on a spring aside and let go; pluck a guitar string; nudge a ship so it rolls. Each swings back through its resting position, overshoots, comes back, and repeats. When the pull back towards equilibrium is **proportional to the displacement**,
$$F = -kx$$
the motion has a special, perfectly regular form called **simple harmonic motion** (SHM).

### The equation and its solution
[[newtons-second-law|Newton's second law]] turns $F = -kx$ into
$$\\frac{d^2x}{dt^2} = -\\omega^2 x, \\qquad \\omega = \\sqrt{\\frac{k}{m}}$$
The acceleration is always directed back towards equilibrium and grows with the distance from it. The functions whose second derivative is minus a constant times themselves are sines and cosines ([[math:harmonic-oscillator-ode|the harmonic oscillator equation]]), so
$$x(t) = A\\cos(\\omega t + \\varphi)$$
- $A$, the **amplitude**, is the largest displacement;
- $\\omega$, the **angular frequency** in rad/s, sets how fast it repeats: period $T = 2\\pi/\\omega$, frequency $f = 1/T = \\omega/2\\pi$;
- $\\varphi$, the **phase constant**, says where in the cycle it was at $t = 0$.

### Velocity and acceleration
Differentiating,
$$v = -A\\omega\\sin(\\omega t + \\varphi), \\qquad a = -A\\omega^2\\cos(\\omega t + \\varphi) = -\\omega^2 x$$
The speed is greatest, $A\\omega$, passing through the centre, where the acceleration is zero. At the turning points the speed is zero and the acceleration is greatest, $A\\omega^2$. A tuning-fork prong vibrating at 440 Hz with an amplitude of just 1 mm reaches 2.8 m/s and an acceleration of about 7600 m/s² — nearly 800 g.

### The period does not depend on the amplitude
Double the amplitude and the restoring force doubles too, so the oscillator covers twice the distance with twice the speed: the time for a cycle is unchanged. This **isochronism** is what makes oscillators good clocks, from pendulums to quartz crystals (32 768 Hz) and the atoms in atomic clocks.

### A shadow of circular motion
Imagine a point going round a circle of radius $A$ at a steady angular velocity $\\omega$ ([[uniform-circular-motion|uniform circular motion]]). Its shadow on a diameter moves exactly as $A\\cos\\omega t$. SHM is one component of circular motion, which is why the same $\\omega$ appears in both.

> [!key] Why SHM is everywhere: near almost any stable equilibrium the restoring force is, to a first approximation, proportional to the displacement. So small vibrations of springs, pendulums, bridges, molecules, the air in a flute and the electrons in a circuit are all simple harmonic.

The simulation shows a [[mass-spring-system|mass on a spring]] tracing out the cosine curve in time; see also the [[simple-pendulum|pendulum]] and [[energy-in-shm|energy in SHM]].
`,
  ideas: [
    'SHM happens when the restoring force is proportional to the displacement: F = −kx, a = −ω²x.',
    'The motion is sinusoidal: x = A cos(ωt + φ), with period T = 2π/ω.',
    'The period does not depend on the amplitude.',
    'Speed is greatest at the centre (Aω); acceleration is greatest at the turning points (Aω²).',
    'SHM is the projection of uniform circular motion onto a diameter.'
  ],
  pitfalls: [
    'A bigger swing takes longer — Not for SHM: the force grows in step with the distance, so the period stays the same.',
    'At the turning points the acceleration is zero because the object stops — The velocity is zero there, but the restoring force, and so the acceleration, is at its largest.',
    'Any repeating motion is simple harmonic — A bouncing ball or a sawtooth vibration repeats but is not sinusoidal; SHM needs a force exactly proportional to −x.'
  ],
  formulas: [
    {
      name: 'Position during the cycle (released from x = A at t = 0)',
      expr: 'x = A*cos(2*pi*t/T)', tex: 'x = A\\cos\\frac{2\\pi t}{T}', solveFor: 'x',
      vars: {
        x: { name: 'displacement from equilibrium', q: 'length', unit: 'm', signed: true },
        A: { name: 'amplitude', q: 'length', unit: 'm', value: 0.5 },
        t: { name: 'time since release', q: 'time', unit: 's', value: 0.5, min: 0, max: 20 },
        T: { name: 'period', q: 'time', unit: 's', value: 4 }
      },
      note: 'Solving for $t$ lists every moment in the first 20 s when the oscillator is at that position.',
      practice: { unknowns: ['x'] },
      stories: { x: 'A buoy bobs with amplitude {A} and period {T}, starting at its highest point. Where is it {t} later?', t: 'A buoy bobbing with amplitude {A} and period {T} starts at its top. When is its displacement {x}?' }
    },
    {
      name: 'Angular frequency and period',
      expr: 'omega = 2*pi/T', tex: '\\omega = \\frac{2\\pi}{T}',
      vars: {
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s' },
        T: { name: 'period', q: 'time', unit: 'ms', value: 2.2727 }
      },
      stories: { omega: 'A tuning fork has a period of {T}. What is its angular frequency?' }
    },
    {
      name: 'Maximum speed',
      expr: 'vmax = A*omega', tex: 'v_{\\max} = A\\omega',
      vars: {
        vmax: { name: 'maximum speed (at the centre)', q: 'speed', unit: 'm/s', tex: 'v_{\\max}' },
        A: { name: 'amplitude', q: 'length', unit: 'mm', value: 1 },
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 2765 }
      },
      stories: { vmax: 'A tuning-fork prong vibrates with amplitude {A} at ω = {omega}. What is its top speed?' }
    },
    {
      name: 'Maximum acceleration',
      expr: 'amax = A*omega^2', tex: 'a_{\\max} = A\\omega^2',
      vars: {
        amax: { name: 'maximum acceleration (at the turning points)', q: 'accel', unit: 'm/s²', tex: 'a_{\\max}' },
        A: { name: 'amplitude', q: 'length', unit: 'mm', value: 1 },
        omega: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 2765 }
      },
      stories: { amax: 'A prong vibrates with amplitude {A} at ω = {omega}. What is its greatest acceleration?', A: 'A loudspeaker cone at ω = {omega} must not exceed {amax}. What is the largest amplitude it can have?' }
    }
  ],
  examples: [
    {
      title: 'A bobbing buoy',
      q: 'A buoy rises and falls with an amplitude of 0.50 m and a period of 4.0 s. It is at its highest point at $t = 0$. Where is it at $t = 0.5$ s, and what is its greatest speed?',
      steps: [
        '$x = A\\cos(2\\pi t/T) = 0.50\\cos(2\\pi \\times 0.5/4.0) = 0.50\\cos 45° = 0.35\\ \\mathrm{m}$ above the mean level.',
        '$\\omega = 2\\pi/T = 1.57\\ \\mathrm{rad/s}$, so $v_{\\max} = A\\omega = 0.50 \\times 1.57 = 0.79\\ \\mathrm{m/s}$, reached at mid-height.'
      ],
      a: '0.35 m above the mean; top speed 0.79 m/s.'
    },
    {
      title: 'Inside a tuning fork',
      q: 'The prongs of a 440 Hz tuning fork vibrate with an amplitude of 1.0 mm. Find their maximum speed and acceleration.',
      steps: [
        '$\\omega = 2\\pi f = 2\\pi \\times 440 = 2765\\ \\mathrm{rad/s}$.',
        '$v_{\\max} = A\\omega = 0.0010 \\times 2765 = 2.8\\ \\mathrm{m/s}$.',
        '$a_{\\max} = A\\omega^2 = 0.0010 \\times 2765^2 = 7.6\\times10^{3}\\ \\mathrm{m/s^2}$, almost 800 g — tiny motions at high frequency mean enormous accelerations.'
      ],
      a: '2.8 m/s and 7600 m/s².'
    }
  ],
  quiz: [
    { q: 'You double the amplitude of a simple harmonic oscillator. Its period…', choices: ['doubles', 'halves', 'stays the same', 'grows by √2'], a: 2,
      why: 'Twice the distance, but also twice the force and twice the speed: the period is set by ω = √(k/m) alone.' },
    { q: 'At the centre of its swing, an object in SHM has…', choices: ['zero speed and maximum acceleration', 'maximum speed and zero acceleration', 'maximum speed and maximum acceleration', 'zero speed and zero acceleration'], a: 1,
      why: 'At x = 0 the restoring force (and acceleration) is zero; all the energy is kinetic, so the speed is greatest.' },
    { q: 'Which force law produces simple harmonic motion?', choices: ['F = −kx', 'F = −kx³', 'F = constant', 'F = −k/x²'], a: 0,
      why: 'Only a force proportional to −x gives sinusoidal motion with an amplitude-independent period. F = −kx³ oscillates, but its period depends on the amplitude.' },
    { q: 'An oscillator starts at x = A when t = 0. A quarter of a period later it is…', choices: ['at x = A again', 'at x = 0, moving fastest', 'at x = −A', 'at x = A/2'], a: 1, why: 'x = A cos(2πt/T), and cos(π/2) = 0: it passes the centre at top speed.' }
  ],
  applications: ['Clocks and watches: pendulums, balance wheels and quartz crystals.', 'Modelling vibrations of buildings, bridges, car suspensions and machine parts.', 'Molecular vibrations seen in infrared spectroscopy, and the vibrating atoms that carry heat through solids.'],
  sim: 'mech2-spring'
},

{
  id: 'mass-spring-system', parent: 'oscillations', title: 'Mass on a spring', level: 1,
  short: 'A mass on a spring oscillates with period T = 2π√(m/k): heavier is slower, stiffer is faster, and the size of the swing does not matter.',
  keywords: ['mass on a spring', 'spring oscillator', 'period of a spring', 'natural frequency', 'spring constant', 'suspension', 'vertical spring', 'static deflection'],
  prereq: ['hookes-law', 'simple-harmonic-motion', 'newtons-second-law'],
  related: ['energy-in-shm', 'damped-oscillations', 'driven-oscillations', 'elastic-potential-energy'],
  body: `
The mass on a spring is the model oscillator of physics. A spring pulls back with a force proportional to its stretch, [[hookes-law|Hooke's law]] $F = -kx$, so a mass $m$ on the end performs [[simple-harmonic-motion|simple harmonic motion]] with
$$\\omega = \\sqrt{\\frac{k}{m}}, \\qquad T = 2\\pi\\sqrt{\\frac{m}{k}}, \\qquad f = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}$$

### What the formula says
- **Heavier is slower.** More mass is harder to get moving and to stop; four times the mass doubles the period.
- **Stiffer is faster.** A stiffer spring pushes harder for the same stretch; four times the stiffness halves the period.
- **The amplitude does not appear.** Small or large bounces take the same time, as long as the spring stays within its linear, elastic range.
- **Gravity does not appear either.** The same spring and mass would oscillate at the same rate on the Moon.

A 0.5 kg mass on a 20 N/m spring has a period of about 1 s. A car body is a mass on springs too: a quarter of a 1200 kg car (300 kg) on a 20 kN/m spring gives $f \\approx 1.3\\ \\mathrm{Hz}$, close to the 1–1.5 Hz that designers aim for because it feels comfortable to people.

### Hanging it vertically
A spring hung from a hook stretches by $d = mg/k$ before anything oscillates. Gravity simply moves the equilibrium point down by $d$; measured from that new position, the restoring force is again $-kx$ and the period is unchanged. That gives a neat trick: since $m/k = d/g$,
$$T = 2\\pi\\sqrt{\\frac{d}{g}}$$
Measure how far a car sinks when loaded and you know how fast it will bounce: 15 cm of sag means a period of 0.77 s.

### Weighing without weight
Because the period depends on mass but not on gravity, a spring oscillator measures mass even where nothing has weight. Astronauts on the Space Station sit on a spring-mounted chair and time its oscillation: $m = kT^2/4\\pi^2$.

> [!note] A real spring has mass of its own, which also moves. To a good approximation it adds about one third of the spring's mass to $m$ in the formula.

> [!tip] In the simulation, change the mass and the spring constant and watch the period in the readout. Then change the amplitude: the period stays put.
`,
  ideas: [
    'A mass on a spring performs SHM with ω = √(k/m) and T = 2π√(m/k).',
    'Four times the mass doubles the period; four times the stiffness halves it.',
    'The period depends neither on the amplitude nor on gravity.',
    'Hanging vertically shifts the equilibrium by mg/k but leaves the period unchanged: T = 2π√(d/g).'
  ],
  pitfalls: [
    'Pulling the mass farther makes it oscillate faster — It moves faster, but covers more distance; the period is the same.',
    'A spring oscillator would run slower on the Moon, like a pendulum — Gravity is not in T = 2π√(m/k); only the resting position changes.',
    'Doubling the mass doubles the period — The period goes as the square root: doubling the mass multiplies it by √2 ≈ 1.41.'
  ],
  formulas: [
    {
      name: 'Period of a mass on a spring',
      expr: 'T = 2*pi*sqrt(m/k)', tex: 'T = 2\\pi\\sqrt{\\frac{m}{k}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 20 }
      },
      stories: {
        T: 'A {m} mass hangs from a spring with k = {k}. What is its period of oscillation?',
        m: 'An astronaut on a spring chair (k = {k}) oscillates with period {T}. What is her mass (including the chair)?',
        k: 'A {m} mass should bounce with a period of {T}. What spring constant is needed?'
      }
    },
    {
      name: 'Natural frequency',
      expr: 'f = sqrt(k/m)/(2*pi)', tex: 'f = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}',
      vars: {
        f: { name: 'natural frequency', q: 'frequency', unit: 'Hz' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'kN/m', value: 20 },
        m: { name: 'mass on the spring', q: 'mass', unit: 'kg', value: 300 }
      },
      stories: { f: 'A corner of a car carries {m} on a suspension spring of {k}. At what frequency does it bounce?', k: 'A corner carrying {m} should bounce at {f}. How stiff must the spring be?' }
    },
    {
      name: 'Period from the static stretch',
      expr: 'T = 2*pi*sqrt(d/g)', tex: 'T = 2\\pi\\sqrt{\\frac{d}{g}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        d: { name: 'stretch when the mass hangs at rest', q: 'length', unit: 'cm', value: 15 },
        g: { const: 'g' }
      },
      stories: { T: 'A car sinks {d} when loaded. What period does it bounce with?', d: 'A spring should oscillate with period {T}. How far must it stretch when the mass is hung on it?' }
    }
  ],
  examples: [
    {
      title: 'Weighing an astronaut',
      q: 'On the Space Station, an astronaut on a spring chair (k = 606 N/m) oscillates with a period of 2.40 s. What is the total oscillating mass?',
      steps: [
        'From $T = 2\\pi\\sqrt{m/k}$: $m = \\dfrac{kT^2}{4\\pi^2}$.',
        '$m = \\dfrac{606 \\times 2.40^2}{39.48} = 88.4\\ \\mathrm{kg}$ — chair and astronaut together; subtract the chair\'s own mass.'
      ],
      a: '88.4 kg'
    },
    {
      title: 'How bouncy is the car?',
      q: 'A 1200 kg car rests on four springs of 20 kN/m. Find its bounce frequency and how far it sinks under its own weight.',
      steps: [
        'Each spring carries 300 kg: $f = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{20\\,000}{300}} = \\dfrac{8.16}{2\\pi} = 1.30\\ \\mathrm{Hz}$.',
        'Sag: $d = mg/k = 300 \\times 9.81/20\\,000 = 0.147\\ \\mathrm{m}$.',
        'Check: $T = 2\\pi\\sqrt{d/g} = 2\\pi\\sqrt{0.147/9.81} = 0.77\\ \\mathrm{s} = 1/1.30\\ \\mathrm{Hz}$. ✓'
      ],
      a: '1.3 Hz; about 15 cm of sag.'
    }
  ],
  quiz: [
    { q: 'The mass on a spring is made four times larger. The period…', choices: ['is four times longer', 'doubles', 'halves', 'is unchanged'], a: 1, why: 'T ∝ √m, and √4 = 2.' },
    { q: 'A mass bobbing on a spring is taken to the Moon. Its period…', choices: ['becomes 2.5 times longer', 'becomes shorter', 'is unchanged', 'becomes infinite'], a: 2,
      why: 'T = 2π√(m/k) does not contain g. (A pendulum, by contrast, would slow down.)' },
    { q: 'A spring stretches 10 cm when a mass is hung on it. The period of oscillation is about…', choices: ['0.1 s', '0.63 s', '1 s', '2 s'], a: 1, why: 'T = 2π√(d/g) = 2π√(0.10/9.81) = 0.63 s, whatever the mass.' },
    { q: 'A spring is cut in half and the same mass is hung on one half. The period…', choices: ['doubles', 'grows by √2', 'shrinks by a factor √2', 'is unchanged'], a: 2,
      why: 'Each half stretches half as much for the same force, so it is twice as stiff; T ∝ 1/√k falls by √2.' }
  ],
  applications: ['Vehicle suspensions tuned to about 1–1.5 Hz.', 'Measuring mass in orbit with spring oscillators.', 'Accelerometers and seismometers: a small mass on a spring whose motion is sensed electronically.'],
  sim: 'mech2-spring'
},

{
  id: 'simple-pendulum', parent: 'oscillations', title: 'Simple pendulum', level: 1,
  short: 'A weight on a string swings with period T = 2π√(L/g) — set by the length and gravity, not by the mass, and hardly by the size of the swing.',
  keywords: ['pendulum', 'simple pendulum', 'period', 'length', 'seconds pendulum', 'pendulum clock', 'large amplitude', 'measuring g', 'Galileo', 'Huygens', 'Foucault'],
  prereq: ['simple-harmonic-motion', 'free-fall', 'math:linear-approximation'],
  related: ['physical-pendulum', 'energy-in-shm', 'weight-mass', 'damped-oscillations'],
  body: `
A small heavy bob on a light string, swinging to and fro, is one of the oldest instruments in physics. Galileo noticed that a swinging lamp in the cathedral of Pisa seemed to take the same time for big and small swings, and pendulums went on to keep the world's time for three centuries.

### Why it swings harmonically
When the string makes an angle $\\theta$ with the vertical, the component of gravity along the arc pulls the bob back:
$$F = -mg\\sin\\theta$$
For small angles $\\sin\\theta \\approx \\theta$ (in radians — the [[math:linear-approximation|linear approximation]]), and the displacement along the arc is $s = L\\theta$. So $F \\approx -\\dfrac{mg}{L}s$: a restoring force proportional to the displacement, which is [[simple-harmonic-motion|simple harmonic motion]] with $\\omega^2 = g/L$:
$$T = 2\\pi\\sqrt{\\frac{L}{g}}$$

### What it depends on
- **Length**: four times as long, twice the period. A 1 m pendulum takes 2.0 s; a "seconds pendulum", which ticks once a second each way, is 0.994 m long.
- **Gravity**: on the Moon ($g = 1.62\\ \\mathrm{m/s^2}$) the same pendulum is 2.5 times slower. Timing a pendulum is a simple way to **measure $g$**: $g = 4\\pi^2 L/T^2$.
- **Not the mass**: a heavier bob feels more force but has more inertia, and the two cancel, just as in [[free-fall|free fall]].

### When the swing is large
The small-angle formula is an approximation. The true period grows with the amplitude $\\theta_0$:
$$T \\approx 2\\pi\\sqrt{\\frac{L}{g}}\\left(1 + \\frac{\\theta_0^2}{16} + \\frac{11\\,\\theta_0^4}{3072} + \\cdots\\right)$$

| Amplitude | 5° | 20° | 45° | 90° | 150° |
|---|---|---|---|---|---|
| Period / small-angle period | 1.0005 | 1.008 | 1.040 | 1.180 | 1.76 |

Up to about 15° the error is below half a per cent, but for a clock that is not good enough: if the amplitude of a pendulum clock drifts from 4° to 5°, it loses about 15 seconds a day. Near 180° — a bob balanced upside down on a rigid rod — the period grows without limit. The simulation runs the exact motion beside the small-angle version so you can watch them drift apart.

### Clocks and the Earth
Huygens built the first accurate pendulum clock in 1656. Pendulum clocks run slow in summer because the rod expands, so good ones use rods of invar or compensating combinations of metals. In 1851 Léon Foucault hung a 67 m pendulum in the Panthéon in Paris; its plane of swing slowly turned, showing the Earth rotating beneath it.

> [!tip] A pendulum that is not a point on a string — a swinging leg, a rod, a hoop on a nail — is a [[physical-pendulum|physical pendulum]]; its period depends on how its mass is spread.
`,
  ideas: [
    'For small swings a pendulum is simple harmonic, with T = 2π√(L/g).',
    'The period depends on the length and on g, but not on the mass.',
    'Large amplitudes lengthen the period: by 0.8 % at 20°, 18 % at 90°.',
    'Timing a pendulum of known length measures g.'
  ],
  pitfalls: [
    'A heavier bob swings faster — The mass cancels out, as in free fall.',
    'The period is exactly the same for every amplitude — Only approximately, for small angles. At 45° it is 4 % longer than the formula says.',
    'Using the angle in degrees in sin θ ≈ θ — The approximation needs radians: 10° is 0.1745 rad, and sin 10° = 0.1736.'
  ],
  formulas: [
    {
      name: 'Period of a simple pendulum (small swings)',
      expr: 'T = 2*pi*sqrt(L/g)', tex: 'T = 2\\pi\\sqrt{\\frac{L}{g}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        L: { name: 'length to the centre of the bob', q: 'length', unit: 'm', value: 1 },
        g: { const: 'g' }
      },
      stories: {
        T: 'A pendulum is {L} long. What is its period?',
        L: 'How long must a pendulum be to have a period of {T}?'
      }
    },
    {
      name: 'Period at larger amplitude',
      expr: 'T = 2*pi*sqrt(L/g)*(1 + theta^2/16 + 11*theta^4/3072)', tex: 'T = 2\\pi\\sqrt{\\frac{L}{g}}\\left(1 + \\frac{\\theta_0^2}{16} + \\frac{11\\,\\theta_0^4}{3072}\\right)',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        L: { name: 'length', q: 'length', unit: 'm', value: 1 },
        g: { const: 'g' },
        theta: { name: 'amplitude (largest angle from the vertical)', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\theta_0' }
      },
      note: 'Accurate to about 0.1 % up to 60° and 0.4 % at 90°. $\\theta_0$ is used in radians inside the brackets.',
      practice: { unknowns: ['T', 'theta'] },
      stories: { T: 'A {L} pendulum is released from {theta}. What is its period?', theta: 'A {L} pendulum swings with period {T}. What is its amplitude?' }
    },
    {
      name: 'Measuring g with a pendulum',
      expr: 'gm = 4*pi^2*L/T^2', tex: 'g = \\frac{4\\pi^2 L}{T^2}',
      vars: {
        gm: { name: 'measured gravitational acceleration', q: 'accel', unit: 'm/s²', tex: 'g' },
        L: { name: 'length', q: 'length', unit: 'm', value: 0.75 },
        T: { name: 'measured period', q: 'time', unit: 's', value: 1.74 }
      },
      stories: { gm: 'A pendulum {L} long has a period of {T}. What value of g does that give?' }
    }
  ],
  examples: [
    {
      title: 'Measuring g in the lab',
      q: 'A pendulum 0.750 m long makes 20 complete swings in 34.8 s. What value of g does this give?',
      steps: [
        'Period: $T = 34.8/20 = 1.74\\ \\mathrm{s}$. Timing many swings shrinks the error of starting and stopping the watch.',
        '$g = \\dfrac{4\\pi^2 L}{T^2} = \\dfrac{39.48 \\times 0.750}{1.74^2} = \\dfrac{29.6}{3.03} = 9.78\\ \\mathrm{m/s^2}$.'
      ],
      a: 'g ≈ 9.78 m/s²'
    },
    {
      title: 'A clock that loses time',
      q: 'A pendulum clock is regulated to keep time with a 4° swing. As its spring weakens the swing grows to 5°. How much time does it lose per day?',
      steps: [
        'Fractional change of period ≈ $\\dfrac{\\theta_2^2 - \\theta_1^2}{16}$ with angles in radians: $\\dfrac{0.0873^2 - 0.0698^2}{16} = 1.71\\times10^{-4}$.',
        'Each tick takes that much longer, so over a day the clock falls behind by $1.71\\times10^{-4} \\times 86\\,400\\ \\mathrm{s} \\approx 15\\ \\mathrm{s}$.'
      ],
      a: 'About 15 s per day.'
    }
  ],
  quiz: [
    { q: 'You replace a pendulum\'s bob with one twice as heavy (same size, same string). The period…', choices: ['doubles', 'halves', 'stays the same', 'grows by √2'], a: 2, why: 'The mass cancels: more pull but also more inertia.' },
    { q: 'A pendulum clock is taken from London to the Moon. It will…', choices: ['run 2.5 times slow', 'run 6 times slow', 'keep time', 'run fast'], a: 0, why: 'T ∝ 1/√g and √(9.81/1.62) = 2.46: each swing takes 2.5 times as long.' },
    { q: 'In summer a brass pendulum rod expands slightly. The clock…', choices: ['gains time', 'loses time', 'is unaffected', 'stops'], a: 1, why: 'A longer pendulum has a longer period, so it ticks less often and the clock runs slow.' },
    { q: 'Compared with a 5° swing, a 60° swing of the same pendulum takes about…', choices: ['the same time', '7 % longer', '50 % longer', 'half as long'], a: 1,
      why: 'The exact period at 60° is 1.073 times the small-angle value; the small-angle formula is only an approximation.' },
    { q: 'A pendulum hangs in a lift accelerating upwards. Its period is shorter than when the lift is at rest.', a: true,
      why: 'In the accelerating lift the effective gravity is g + a, larger than g, so T = 2π√(L/(g + a)) is shorter.' }
  ],
  applications: ['Pendulum clocks, metronomes and the pendulum escapements that made accurate timekeeping possible.', 'Measuring g for geophysics, historically with reversible pendulums.', 'Foucault pendulums demonstrating the Earth\'s rotation.'],
  history: 'Galileo noticed the near-constant period around 1602; Huygens built the first pendulum clock in 1656 and found the ideal cycloidal path whose period is exactly independent of amplitude.',
  sim: 'mech2-pendulum'
},

{
  id: 'physical-pendulum', parent: 'oscillations', title: 'Physical pendulum', level: 3,
  short: 'Any rigid body swinging about a pivot: its period depends on its moment of inertia and on how far its centre of mass hangs below the pivot.',
  keywords: ['physical pendulum', 'compound pendulum', 'rod pendulum', 'equivalent length', 'centre of oscillation', 'centre of percussion', 'Kater\'s pendulum', 'walking', 'leg swing'],
  prereq: ['simple-pendulum', 'moment-of-inertia', 'rotational-dynamics'],
  related: ['torque', 'center-of-mass', 'simple-harmonic-motion'],
  body: `
A real swinging object is rarely a point on a string. A leg, a baseball bat hung on a finger, a door on a slanted hinge, a clock's heavy pendulum: each is a rigid body turning about a pivot, a **physical** (or compound) **pendulum**.

### Deriving the period
Let the centre of mass hang a distance $d$ below the pivot. Tilted by $\\theta$, gravity acting at the centre of mass produces a restoring [[torque]] $\\tau = -mgd\\sin\\theta$. The [[rotational-dynamics|rotational second law]] $\\tau = I\\alpha$, with $I$ the [[moment-of-inertia|moment of inertia]] about the pivot, gives
$$I\\frac{d^2\\theta}{dt^2} = -mgd\\sin\\theta \\approx -mgd\\,\\theta$$
for small angles — simple harmonic motion with $\\omega^2 = mgd/I$:
$$T = 2\\pi\\sqrt{\\frac{I}{mgd}}$$
For a point bob, $I = mL^2$ and $d = L$, and this reduces to the [[simple-pendulum|simple pendulum]]'s $2\\pi\\sqrt{L/g}$.

### Equivalent length
Every physical pendulum swings like a simple pendulum of length
$$L_\\text{eq} = \\frac{I}{md}$$
A uniform rod of length $L$ swinging from one end has $I = \\tfrac13 mL^2$ and $d = L/2$, so $L_\\text{eq} = \\tfrac23 L$: it swings faster than a simple pendulum of the same length, because its mass is spread up towards the pivot. A hoop hung on a nail ($I = 2mR^2$ by the parallel-axis theorem, $d = R$) swings like a simple pendulum of length $2R$, its diameter.

### Walking
Your leg swings forward like a physical pendulum from the hip. Treating a 0.9 m leg as a uniform rod gives $T = 2\\pi\\sqrt{2L/3g} \\approx 1.6\\ \\mathrm{s}$; a step takes half a swing, about 0.8 s. Relaxed walking pace really is close to this: we let gravity do most of the work. Children, with shorter legs, take quicker steps; giraffes and elephants stride slowly.

### Centre of oscillation and percussion
The point a distance $L_\\text{eq}$ below the pivot is the **centre of oscillation**. Remarkably, if you hang the body from that point instead, its period is exactly the same. Kater's reversible pendulum (1817) used this to measure $g$ precisely: adjust the two pivots until the periods match, and their separation is $L_\\text{eq}$, which can be measured far more accurately than the position of a centre of mass. The same point is the **centre of percussion**: strike a bat or a racket there and the hands at the pivot feel no jolt — the "sweet spot".

> [!note] If the pivot passes through the centre of mass, $d = 0$: gravity exerts no torque, the body balances in any position and does not oscillate at all. Moving the pivot outwards from there, the period first falls and then rises again; it is shortest when $d$ equals the radius of gyration about the centre of mass.
`,
  ideas: [
    'A rigid body pivoted a distance d above its centre of mass oscillates with T = 2π√(I/mgd), I measured about the pivot.',
    'It swings like a simple pendulum of length L_eq = I/md.',
    'A uniform rod pivoted at one end has L_eq = 2L/3 and swings faster than a simple pendulum of length L.',
    'Pivoting at the centre of oscillation gives the same period — the principle of Kater\'s pendulum.'
  ],
  pitfalls: [
    'A rod pendulum of length L has the period of a simple pendulum of length L — It is faster: its equivalent length is only 2L/3.',
    'Using the moment of inertia about the centre of mass — T = 2π√(I/mgd) needs I about the pivot; add md² with the parallel-axis theorem.',
    'Hanging a body closer to its centre of mass always makes it swing faster — Close to the centre of mass the period grows again, becoming infinite when the pivot is at the centre of mass.'
  ],
  formulas: [
    {
      name: 'Period of a physical pendulum',
      expr: 'T = 2*pi*sqrt(I/(m*g*d))', tex: 'T = 2\\pi\\sqrt{\\frac{I}{m g d}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        I: { name: 'moment of inertia about the pivot', q: 'inertia', unit: 'kg·m²', value: 0.3333 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        g: { const: 'g' },
        d: { name: 'distance from the pivot to the centre of mass', q: 'length', unit: 'm', value: 0.5 }
      },
      stories: {
        T: 'A {m} body with I = {I} about its pivot has its centre of mass {d} below the pivot. What is its period?',
        I: 'A {m} body swings with period {T} about a pivot {d} above its centre of mass. What is its moment of inertia about the pivot?'
      }
    },
    {
      name: 'Uniform rod swinging from one end',
      expr: 'T = 2*pi*sqrt(2*L/(3*g))', tex: 'T = 2\\pi\\sqrt{\\frac{2L}{3g}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        L: { name: 'length of the rod', q: 'length', unit: 'm', value: 0.9 },
        g: { const: 'g' }
      },
      stories: { T: 'Treating a {L} leg as a uniform rod swinging from the hip, what is its natural period?', L: 'A uniform rod swinging from one end has a period of {T}. How long is it?' }
    },
    {
      name: 'Equivalent simple-pendulum length',
      expr: 'Leq = I/(m*d)', tex: 'L_{\\text{eq}} = \\frac{I}{m d}',
      vars: {
        Leq: { name: 'equivalent length', q: 'length', unit: 'm', tex: 'L_{\\text{eq}}' },
        I: { name: 'moment of inertia about the pivot', q: 'inertia', unit: 'kg·m²', value: 0.125 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        d: { name: 'distance from the pivot to the centre of mass', q: 'length', unit: 'm', value: 0.25 }
      },
      stories: { Leq: 'A {m} hoop with I = {I} about a nail {d} above its centre hangs and swings. What simple pendulum has the same period?' }
    }
  ],
  examples: [
    {
      title: 'A hoop on a nail',
      q: 'A thin hoop of radius 0.25 m hangs on a nail and swings in its own plane. Find its period.',
      steps: [
        'About its centre $I_\\text{cm} = mR^2$; the nail is $d = R$ away, so $I = mR^2 + mR^2 = 2mR^2$.',
        '$T = 2\\pi\\sqrt{\\dfrac{2mR^2}{mgR}} = 2\\pi\\sqrt{\\dfrac{2R}{g}} = 2\\pi\\sqrt{\\dfrac{0.50}{9.81}} = 1.42\\ \\mathrm{s}$.',
        'The same as a simple pendulum as long as the hoop\'s diameter, whatever its mass.'
      ],
      a: '1.42 s'
    },
    {
      title: 'A metre rule',
      q: 'A metre rule swings about a hole at its 0 cm end. Then it is hung from a hole at the 20 cm mark. Compare the periods.',
      steps: [
        'End pivot: $T = 2\\pi\\sqrt{2L/3g} = 2\\pi\\sqrt{0.667/9.81} = 1.64\\ \\mathrm{s}$.',
        'At 20 cm: $d = 0.30\\ \\mathrm{m}$ and $I = \\tfrac1{12}mL^2 + md^2 = m(0.0833 + 0.090) = 0.1733\\,m$.',
        '$T = 2\\pi\\sqrt{0.1733/(9.81 \\times 0.30)} = 1.52\\ \\mathrm{s}$ — slightly faster, although the pivot is closer to the centre.'
      ],
      a: '1.64 s from the end, 1.52 s from the 20 cm mark.'
    }
  ],
  quiz: [
    { q: 'A uniform rod swinging from one end, compared with a simple pendulum of the same length, has a period that is…', choices: ['the same', 'longer', 'shorter', 'infinite'], a: 2,
      why: 'Its equivalent length is 2L/3, so it swings faster: T is √(2/3) ≈ 0.82 times as long.' },
    { q: 'A rod is pivoted exactly at its centre of mass. When displaced, it…', choices: ['oscillates very fast', 'oscillates very slowly', 'stays wherever it is put', 'swings like a simple pendulum'], a: 2,
      why: 'With d = 0 gravity exerts no torque about the pivot; the rod is in neutral equilibrium and does not oscillate.' },
    { q: 'A heavy weight is clamped to the bottom end of a rod pendulum pivoted at its top. The period…', choices: ['decreases', 'increases', 'stays the same', 'drops to zero'], a: 1,
      why: 'The mass distribution moves towards the tip; the equivalent length grows from 2L/3 towards L, so the period grows.' },
    { q: 'A hoop hung on a nail swings with the same period as a simple pendulum whose length equals the hoop\'s diameter.', a: true, why: 'I = 2mR² and d = R give L_eq = I/md = 2R.' }
  ],
  applications: ['Walking and running: the natural swing of the legs sets a comfortable stride rate.', 'The sweet spot of bats, rackets and hammers (centre of percussion).', 'Kater\'s reversible pendulum for precise measurement of g.'],
  sim: 'mech2-pendulum'
},

{
  id: 'energy-in-shm', parent: 'oscillations', title: 'Energy in simple harmonic motion', level: 2,
  short: 'An oscillator swaps energy back and forth between kinetic and potential. The total, ½kA², stays constant and grows with the square of the amplitude.',
  keywords: ['energy in SHM', 'kinetic energy', 'potential energy', 'total energy', 'half k A squared', 'energy exchange', 'speed at a position', 'oscillator energy'],
  prereq: ['simple-harmonic-motion', 'elastic-potential-energy', 'conservation-of-energy'],
  related: ['mass-spring-system', 'damped-oscillations', 'quantum-harmonic-oscillator'],
  body: `
Watch an oscillator in terms of energy and its motion becomes a steady exchange. At each turning point it stops: all its energy is stored potential energy. Passing the centre it moves fastest with nothing stored: all kinetic. In between, some of each.

### The total is constant
For a mass on a spring, the [[elastic-potential-energy|spring's potential energy]] is $\\tfrac12 kx^2$ and the [[kinetic-energy|kinetic energy]] $\\tfrac12 mv^2$. Without friction their sum is conserved, and at a turning point ($x = \\pm A$, $v = 0$) it is easy to evaluate:
$$E = \\tfrac12 mv^2 + \\tfrac12 kx^2 = \\tfrac12 kA^2$$
Energy grows with the **square of the amplitude**: twice the swing, four times the energy. Using $k = m\\omega^2$ it can also be written $E = \\tfrac12 m\\omega^2 A^2$, growing with the square of the frequency too — which is why high-pitched vibrations of even tiny amplitude can carry a lot of energy.

### Speed at any position
Rearranging the energy equation gives the speed wherever the oscillator is, without knowing the time:
$$v = \\omega\\sqrt{A^2 - x^2}$$
greatest, $\\omega A$, at the centre and zero at $x = \\pm A$. The kinetic share of the energy at position $x$ is $1 - (x/A)^2$: at half the amplitude three quarters of the energy is kinetic. Kinetic and potential energy are equal at $x = A/\\sqrt2 \\approx 0.71A$.

### Twice as fast as the motion
Since $x = A\\cos\\omega t$, the potential energy is $\\tfrac12 kA^2\\cos^2\\omega t$ and the kinetic energy $\\tfrac12 kA^2\\sin^2\\omega t$. Each swings between 0 and $E$ **twice** per period, and each averages $E/2$ over a cycle.

### The same story for a pendulum
For a pendulum the stored energy is gravitational: at the top of the swing the bob is higher by $h = L(1 - \\cos\\theta_0)$, and at the bottom that becomes kinetic, $v = \\sqrt{2gL(1-\\cos\\theta_0)}$. A 1 m pendulum released from 30° passes the bottom at 1.6 m/s.

### Where the energy goes
In a real oscillator friction takes a little energy each cycle, and the amplitude shrinks ([[damped-oscillations|damping]]). A small push in step with the motion can put energy back in — the principle of pushing a swing, and of [[driven-oscillations|resonance]].

> [!tip] The energy bars in the simulation show it directly: kinetic and potential take turns, and their sum is flat — until you add damping.
`,
  ideas: [
    'In SHM energy passes back and forth between kinetic and potential; the total stays constant.',
    'The total energy is E = ½kA² = ½mω²A²: it grows with the square of the amplitude.',
    'The speed at position x is v = ω√(A² − x²).',
    'Kinetic and potential energy each average E/2 and oscillate at twice the frequency of the motion.'
  ],
  pitfalls: [
    'Doubling the amplitude doubles the energy — Energy goes as A², so it quadruples.',
    'At half the amplitude the energy is half kinetic and half potential — At x = A/2 the potential energy is only (1/2)² = 1/4 of the total; kinetic and potential are equal at x = A/√2.',
    'The maximum speed is the same for all amplitudes because the period is — The period is fixed, so a bigger swing must be covered faster: v_max = ωA.'
  ],
  formulas: [
    {
      name: 'Total energy of an oscillator',
      expr: 'E = 0.5*k*A^2', tex: 'E = \\tfrac12 k A^2',
      vars: {
        E: { name: 'total energy', q: 'energy', unit: 'J' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 200 },
        A: { name: 'amplitude', q: 'length', unit: 'cm', value: 5 }
      },
      stories: { E: 'A spring with k = {k} oscillates with amplitude {A}. How much energy does it hold?', A: 'An oscillator with k = {k} holds {E}. What is its amplitude?' }
    },
    {
      name: 'Speed at a given position',
      expr: 'v = sqrt(k/m)*sqrt(A^2 - x^2)', tex: 'v = \\sqrt{\\frac{k}{m}}\\sqrt{A^2 - x^2}',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'm/s' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 200 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        A: { name: 'amplitude', q: 'length', unit: 'cm', value: 5 },
        x: { name: 'position', q: 'length', unit: 'cm', value: 3, signed: true }
      },
      stories: { v: 'A {m} mass on a spring (k = {k}) oscillates with amplitude {A}. How fast is it moving at x = {x}?', x: 'A {m} mass on a spring (k = {k}) oscillates with amplitude {A}. Where is it moving at {v}?' }
    },
    {
      name: 'Kinetic share of the energy',
      expr: 'f = 1 - (x/A)^2', tex: 'f_K = 1 - \\left(\\frac{x}{A}\\right)^2',
      vars: {
        f: { name: 'fraction of the energy that is kinetic, K/E', q: 'ratio', unit: '%', tex: 'f_K' },
        x: { name: 'position', q: 'length', unit: 'cm', value: 2.5, signed: true },
        A: { name: 'amplitude', q: 'length', unit: 'cm', value: 5 }
      },
      stories: { f: 'An oscillator of amplitude {A} is at x = {x}. What fraction of its energy is kinetic?', x: 'Where, for amplitude {A}, is the kinetic energy {f} of the total?' }
    }
  ],
  examples: [
    {
      title: 'Energy and speed',
      q: 'A 0.50 kg block on a spring with k = 200 N/m oscillates with an amplitude of 5.0 cm. Find the total energy, the maximum speed and the speed at x = 3.0 cm.',
      steps: [
        '$E = \\tfrac12 kA^2 = \\tfrac12 (200)(0.050)^2 = 0.25\\ \\mathrm{J}$.',
        'All kinetic at the centre: $v_{\\max} = \\sqrt{2E/m} = \\sqrt{0.50/0.50} = 1.0\\ \\mathrm{m/s}$.',
        '$\\omega = \\sqrt{k/m} = 20\\ \\mathrm{rad/s}$, so at 3.0 cm: $v = 20\\sqrt{0.050^2 - 0.030^2} = 20 \\times 0.040 = 0.80\\ \\mathrm{m/s}$.'
      ],
      a: '0.25 J; 1.0 m/s at the centre; 0.80 m/s at 3 cm.'
    },
    {
      title: 'The bottom of the swing',
      q: 'A 1.0 m pendulum is released from 30°. How fast is the bob moving at the bottom?',
      steps: [
        'Height lost: $h = L(1 - \\cos 30°) = 1.0 \\times (1 - 0.866) = 0.134\\ \\mathrm{m}$.',
        '$v = \\sqrt{2gh} = \\sqrt{2 \\times 9.81 \\times 0.134} = 1.62\\ \\mathrm{m/s}$.'
      ],
      a: '1.6 m/s'
    }
  ],
  quiz: [
    { q: 'The amplitude of an oscillator is doubled. Its total energy…', choices: ['doubles', 'quadruples', 'stays the same', 'halves'], a: 1, why: 'E = ½kA²: energy goes with the square of the amplitude.' },
    { q: 'At what displacement are the kinetic and potential energies equal?', choices: ['x = A/2', 'x = A/√2', 'x = A/4', 'x = 0'], a: 1, why: '½kx² = ½E = ¼kA² gives x² = A²/2, so x = A/√2 ≈ 0.71A.' },
    { q: 'Over a whole cycle, the average kinetic energy of an undamped oscillator is…', choices: ['zero', 'E/4', 'E/2', 'E'], a: 2, why: 'K = E sin²ωt, and the average of sin² over a cycle is ½. The potential energy averages E/2 too.' },
    { q: 'Two identical springs oscillate with the same mass; one has twice the amplitude. They have the same maximum speed.', a: false,
      why: 'Same ω, so v_max = ωA is twice as large for the larger amplitude — it must cover twice the distance in the same time.' }
  ],
  applications: ['Energy harvesters that tap vibrations of machines and bridges.', 'Why earthquake shaking of larger amplitude does disproportionately more damage (energy ∝ A²).', 'The quantum harmonic oscillator, whose energy comes in steps of ħω.'],
  sim: 'mech2-spring'
},

{
  id: 'damped-oscillations', parent: 'oscillations', title: 'Damped oscillations', level: 3,
  short: 'Friction makes an oscillation die away. Light damping gives a slowly shrinking swing; critical damping returns to rest fastest with no overshoot; heavy damping creeps back.',
  keywords: ['damping', 'damped oscillation', 'underdamped', 'critically damped', 'overdamped', 'quality factor', 'Q factor', 'decay', 'shock absorber', 'damping ratio', 'logarithmic decrement'],
  prereq: ['simple-harmonic-motion', 'drag-force', 'math:damped-oscillator-ode'],
  related: ['driven-oscillations', 'energy-in-shm', 'mass-spring-system', 'rlc-impedance'],
  body: `
A plucked string fades, a pushed swing coasts to a stop, a car settles after a bump. Real oscillators lose energy to friction, air and internal heating, and their swings shrink. This is **damping**.

### The model
The simplest and most useful model is a drag force proportional to velocity, $F = -bv$ (think of a piston moving through oil). With the spring force, Newton's second law becomes
$$m\\ddot x + b\\dot x + kx = 0$$
the [[math:damped-oscillator-ode|damped oscillator equation]]. Two rates compete: the natural angular frequency $\\omega_0 = \\sqrt{k/m}$ and the decay rate $\\gamma = b/2m$.

### Light damping: a fading swing
When $\\gamma < \\omega_0$ (**underdamped**) the mass still oscillates, inside an exponentially shrinking envelope:
$$x(t) = A_0\\, e^{-\\gamma t}\\cos(\\omega_d t + \\varphi), \\qquad \\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2}$$
The oscillation is slightly slower than without damping, though for light damping the difference is tiny. The amplitude falls by the same **factor** every cycle; the energy, which goes as the amplitude squared, decays twice as fast, as $e^{-2\\gamma t}$.

### Critical and heavy damping
As $b$ grows the oscillations fade faster, until at $\\gamma = \\omega_0$, that is $b_c = 2\\sqrt{mk}$, they disappear altogether. This **critically damped** system returns to equilibrium in the shortest possible time without overshooting — what you want for a door closer, the needle of a meter or a car suspension (which is usually set a little below critical, for comfort). With even more damping (**overdamped**) the return is sluggish: the mass oozes back as if through treacle.

### Quality factor
How long an oscillator rings is summed up by its **quality factor**
$$Q = \\frac{\\omega_0}{2\\gamma} = \\frac{\\sqrt{mk}}{b}$$
Roughly, $Q$ is the number of oscillations before the amplitude has dropped to a few per cent (after $Q$ cycles it is down to $e^{-\\pi} \\approx 4\\,\\%$). Equivalently, $2\\pi$ divided by the fraction of energy lost per cycle.

| Oscillator | Typical Q |
|---|---|
| Car suspension | about 1–2 |
| Loudspeaker cone | a few |
| Guitar string | about 1000 |
| Tuning fork | several thousand |
| Quartz watch crystal | 10⁴–10⁵ |
| Atomic-clock transition | about 10¹⁰ |

The **damping ratio** $\\zeta = \\gamma/\\omega_0 = 1/2Q$ is the engineer's version: $\\zeta = 1$ is critical.

> [!tip] In the spring simulation, raise the damping slowly: watch the envelope tighten, the ringing shorten, and — at critical damping — the overshoot vanish.

High-$Q$ oscillators make sharp [[driven-oscillations|resonances]]; low-$Q$ ones respond broadly. The same equation, with inductance, resistance and capacitance in place of $m$, $b$ and $1/k$, describes an [[rlc-impedance|RLC circuit]].
`,
  ideas: [
    'Velocity-proportional damping gives m ẍ + b ẋ + kx = 0 with decay rate γ = b/2m.',
    'Underdamped: oscillation at ω_d = √(ω₀² − γ²) inside an envelope e^(−γt).',
    'Critical damping (b = 2√(mk)) returns to rest fastest without overshoot; overdamping is slower.',
    'The quality factor Q = ω₀/2γ is about the number of cycles an oscillator rings.'
  ],
  pitfalls: [
    'Damping changes the period a lot — For light damping ω_d is almost ω₀; a Q of 10 changes the period by only 0.1 %.',
    'More damping always means a faster return to rest — Beyond critical damping the return gets slower again.',
    'The amplitude decreases by the same amount each cycle — With viscous damping it decreases by the same factor (exponential decay). A constant loss per cycle is the signature of dry sliding friction instead.'
  ],
  formulas: [
    {
      name: 'Decay of the amplitude',
      expr: 'A = A0*exp(-b*t/(2*m))', tex: 'A = A_0\\, e^{-b t/2m}',
      vars: {
        A: { name: 'amplitude after time t', q: 'length', unit: 'cm' },
        A0: { name: 'starting amplitude', q: 'length', unit: 'cm', value: 10 },
        b: { name: 'damping coefficient', unit: 'N·s/m', value: 0.2 },
        t: { name: 'time', q: 'time', unit: 's', value: 5 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 }
      },
      stories: { A: 'A {m} mass oscillates with damping b = {b}, starting at amplitude {A0}. What is the amplitude after {t}?', t: 'How long does it take a {m} oscillator with b = {b} to decay from {A0} to {A}?' }
    },
    {
      name: 'Frequency of damped oscillation',
      expr: 'wd = sqrt(k/m - (b/(2*m))^2)', tex: '\\omega_d = \\sqrt{\\frac{k}{m} - \\left(\\frac{b}{2m}\\right)^2}',
      vars: {
        wd: { name: 'damped angular frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega_d' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 20 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        b: { name: 'damping coefficient', unit: 'N·s/m', value: 2 }
      },
      stories: { wd: 'A {m} mass on a spring of {k} has damping b = {b}. At what angular frequency does it oscillate?' }
    },
    {
      name: 'Quality factor',
      expr: 'Q = sqrt(m*k)/b', tex: 'Q = \\frac{\\sqrt{m k}}{b}',
      vars: {
        Q: { name: 'quality factor' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 20 },
        b: { name: 'damping coefficient', unit: 'N·s/m', value: 0.2 }
      },
      stories: { Q: 'What is the quality factor of a {m} mass on a {k} spring with damping b = {b}?', b: 'A {m} mass on a {k} spring should have Q = {Q}. What damping coefficient is needed?' }
    },
    {
      name: 'Critical damping',
      expr: 'bc = 2*sqrt(m*k)', tex: 'b_c = 2\\sqrt{m k}',
      vars: {
        bc: { name: 'critical damping coefficient', unit: 'N·s/m', tex: 'b_c' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 300 },
        k: { name: 'spring constant', q: 'stiffness', unit: 'kN/m', value: 20 }
      },
      stories: { bc: 'A {m} quarter-car rests on a {k} spring. What damping coefficient would make it critically damped?' }
    }
  ],
  examples: [
    {
      title: 'A fading bounce',
      q: 'A 0.50 kg mass on a 20 N/m spring has damping coefficient 0.20 N·s/m and starts with an amplitude of 10 cm. Find its Q, its amplitude after 5 s, and how much its frequency differs from the undamped one.',
      steps: [
        '$\\omega_0 = \\sqrt{20/0.50} = 6.32\\ \\mathrm{rad/s}$ and $\\gamma = b/2m = 0.20\\ \\mathrm{s^{-1}}$.',
        '$Q = \\omega_0/2\\gamma = 6.32/0.40 = 15.8$.',
        'After 5 s: $A = 10\\ \\mathrm{cm} \\times e^{-0.20 \\times 5} = 10 \\times 0.368 = 3.7\\ \\mathrm{cm}$.',
        '$\\omega_d = \\sqrt{6.32^2 - 0.20^2} = 6.321\\ \\mathrm{rad/s}$ against 6.325: a difference of 0.05 %.'
      ],
      a: 'Q ≈ 16; 3.7 cm after 5 s; the frequency is almost unchanged.'
    },
    {
      title: 'Choosing a shock absorber',
      q: 'A quarter of a car (300 kg) sits on a 20 kN/m spring. What damping coefficient makes it critically damped, and what value gives a damping ratio of 0.3?',
      steps: [
        '$b_c = 2\\sqrt{mk} = 2\\sqrt{300 \\times 20\\,000} = 2 \\times 2449 = 4900\\ \\mathrm{N\\,s/m}$.',
        'For $\\zeta = 0.3$: $b = 0.3\\, b_c = 1470\\ \\mathrm{N\\,s/m}$. The car then overshoots a little after a bump but rides more softly.'
      ],
      a: '4900 N·s/m for critical damping; about 1500 N·s/m for ζ = 0.3.'
    }
  ],
  quiz: [
    { q: 'A door closer should be…', choices: ['undamped', 'lightly damped', 'critically damped', 'as heavily damped as possible'], a: 2,
      why: 'Critical damping shuts the door as fast as possible without it swinging past and banging; overdamping would make it close too slowly.' },
    { q: 'In a lightly damped oscillator the amplitude falls exponentially. The energy falls…', choices: ['linearly', 'at the same exponential rate', 'exponentially, twice as fast', 'not at all'], a: 2, why: 'E ∝ A², so if A ∝ e^(−γt) then E ∝ e^(−2γt).' },
    { q: 'An oscillator has Q = 100. Roughly how many oscillations does it make before its amplitude is only a few per cent of the start?', choices: ['1', '10', '100', '10 000'], a: 2, why: 'After Q cycles the amplitude has fallen by e^(−π) ≈ 4 %.' },
    { q: 'Increasing the damping beyond the critical value makes the system return to equilibrium faster still.', a: false,
      why: 'Overdamped systems creep back more slowly. Critical damping is the fastest return without overshoot.' }
  ],
  applications: ['Car shock absorbers and building dampers.', 'Door closers and the needles of analogue meters (near critical damping).', 'High-Q resonators for clocks, filters and sensors, where damping must be as small as possible.'],
  sim: 'mech2-spring'
},

{
  id: 'driven-oscillations', parent: 'oscillations', title: 'Driven oscillations and resonance', level: 3,
  short: 'Pushed periodically, an oscillator settles at the driving frequency. Near its own natural frequency the response grows enormously: resonance.',
  keywords: ['resonance', 'driven oscillation', 'forced oscillation', 'natural frequency', 'resonance curve', 'bandwidth', 'phase lag', 'tuned mass damper', 'Tacoma Narrows', 'Millennium Bridge'],
  prereq: ['damped-oscillations', 'mass-spring-system', 'math:forced-oscillator-ode'],
  related: ['standing-waves', 'lc-resonance', 'air-columns', 'tides'],
  body: `
Push a child on a swing at random moments and not much happens. Push once per swing, just as it starts moving away from you, and every push adds energy: the swing goes higher and higher. Pushing in step with an oscillator's natural rhythm is **resonance**.

### The driven oscillator
Add a periodic force $F_0\\cos\\omega t$ to a [[damped-oscillations|damped oscillator]]:
$$m\\ddot x + b\\dot x + kx = F_0\\cos\\omega t$$
At first the motion is messy, a mix of the natural oscillation and the forced one. The natural part dies away (in about $Q$ cycles), and what remains, the **steady state**, oscillates at the **driving frequency** $\\omega$, whatever the natural frequency $\\omega_0 = \\sqrt{k/m}$:
$$x(t) = A\\cos(\\omega t - \\delta), \\qquad A = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (b\\omega/m)^2}}$$

### Reading the resonance curve
- **Slow driving** ($\\omega \\ll \\omega_0$): $A \\to F_0/k$, the static stretch. The mass just follows the force, in phase with it.
- **At resonance** ($\\omega \\approx \\omega_0$): the first term under the root vanishes and only damping limits the response. The amplitude is about $Q$ times the static value, and the displacement lags the force by 90°: the force is then in step with the **velocity**, so it does positive work all the time.
- **Fast driving** ($\\omega \\gg \\omega_0$): $A \\to F_0/m\\omega^2$, small, and the mass moves opposite to the force (lag 180°). Inertia wins.

The peak has a width $\\Delta\\omega \\approx \\omega_0/Q$ (between the points where the power absorbed is half its maximum). Lightly damped systems respond hugely, but only in a narrow band; heavily damped ones respond modestly over a broad range. That trade-off is the whole art of tuning: a radio receiver is a high-$Q$ [[lc-resonance|electrical resonator]] that picks one station out of many.

### Resonance in the world
- Musical instruments, [[air-columns|air columns]] and [[standing-waves|strings]] are resonators that pick out and amplify particular frequencies.
- Bus windows rattle at one particular engine speed; a washing machine shakes the floor during spin-up as it passes through resonance.
- A car on a washboard road with ridges every 5 m resonates at the speed where the ridges come at its bounce frequency: $5\\ \\mathrm{m} \\times 1.3\\ \\mathrm{Hz} = 6.5\\ \\mathrm{m/s}$.
- In 2000 London's Millennium Bridge swayed sideways because walkers unconsciously fell into step with its sway, driving it at its own lateral frequency; dampers were fitted.
- Tall buildings carry **tuned mass dampers**: Taipei 101 hangs a 660-tonne pendulum tuned to the tower's sway, which soaks up the energy of wind and earthquakes.

> [!warn] The collapse of the Tacoma Narrows Bridge in 1940 is often told as simple resonance with gusts of wind. It was not: the steady wind fed energy into a twisting motion through aerodynamic flutter, a self-excited oscillation. Resonance needs a periodic drive; flutter creates its own.

> [!tip] In the simulation, sweep the driving frequency slowly through the natural frequency and watch the amplitude and the phase lag change. Then lower Q and repeat: the peak grows taller and narrower.
`,
  ideas: [
    'After the transients die out, a driven oscillator moves at the driving frequency, not its natural one.',
    'The amplitude peaks near the natural frequency; at resonance it is about Q times the static response.',
    'The displacement lags the force by 0° far below resonance, 90° at resonance and 180° far above.',
    'The resonance width is about ω₀/Q: low damping gives a tall, narrow peak.'
  ],
  pitfalls: [
    'A driven oscillator vibrates at its own natural frequency — In the steady state it follows the driving frequency; the natural frequency only sets how strongly it responds.',
    'At resonance the amplitude becomes infinite — Only without damping. Real damping limits it to about Q times the static response.',
    'The Tacoma Narrows Bridge fell because wind gusts matched its natural frequency — It failed by aerodynamic flutter, a self-excited twisting driven by a steady wind.'
  ],
  formulas: [
    {
      name: 'Steady-state amplitude',
      expr: 'A = (F0/m)/sqrt((w0^2 - w^2)^2 + (b*w/m)^2)', tex: 'A = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (b\\omega/m)^2}}',
      vars: {
        A: { name: 'amplitude', q: 'length', unit: 'cm' },
        F0: { name: 'amplitude of the driving force', q: 'force', unit: 'N', value: 0.2, tex: 'F_0' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 6.32, tex: '\\omega_0' },
        w: { name: 'driving angular frequency', q: 'angvel', unit: 'rad/s', value: 6, tex: '\\omega' },
        b: { name: 'damping coefficient', unit: 'N·s/m', value: 0.2 }
      },
      note: 'Solving for $\\omega$ usually gives two driving frequencies, one each side of the peak.',
      practice: { unknowns: ['A', 'F0'] },
      stories: { A: 'A {m} oscillator (ω₀ = {w0}, b = {b}) is driven by a force of amplitude {F0} at ω = {w}. What is its steady amplitude?', w: 'A {m} oscillator (ω₀ = {w0}, b = {b}) driven with {F0} swings with amplitude {A}. At what driving frequencies can that happen?' }
    },
    {
      name: 'Amplitude at resonance',
      expr: 'Ares = Q*F0/k', tex: 'A_{\\text{res}} \\approx Q\\,\\frac{F_0}{k}',
      vars: {
        Ares: { name: 'amplitude at resonance', q: 'length', unit: 'mm', tex: 'A_{\\text{res}}' },
        Q: { name: 'quality factor', value: 20 },
        F0: { name: 'amplitude of the driving force', q: 'force', unit: 'N', value: 0.5, tex: 'F_0' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 500 }
      },
      note: 'For light damping (Q of about 3 or more). $F_0/k$ is the static deflection.',
      stories: { Ares: 'An oscillator with Q = {Q} and k = {k} is driven at resonance by a force of amplitude {F0}. How large is its amplitude?' }
    },
    {
      name: 'Width of the resonance',
      expr: 'dw = w0/Q', tex: '\\Delta\\omega = \\frac{\\omega_0}{Q}',
      vars: {
        dw: { name: 'full width of the peak (half-power points)', q: 'angvel', unit: 'rad/s', tex: '\\Delta\\omega' },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 6.32, tex: '\\omega_0' },
        Q: { name: 'quality factor', value: 15.8 }
      },
      stories: { dw: 'An oscillator with ω₀ = {w0} has Q = {Q}. How wide is its resonance peak?', Q: 'A resonance at {w0} is {dw} wide. What is the Q?' }
    }
  ],
  examples: [
    {
      title: 'The washboard road',
      q: 'A car bounces naturally at 1.3 Hz. A gravel road has ripples every 5.0 m. At what speed does the car resonate?',
      steps: [
        'At speed $v$ the ripples arrive at a frequency $f = v/\\lambda$.',
        'Resonance when $f = 1.3\\ \\mathrm{Hz}$: $v = f\\lambda = 1.3 \\times 5.0 = 6.5\\ \\mathrm{m/s} \\approx 23\\ \\mathrm{km/h}$.',
        'Drivers find the shaking eases if they go faster — above resonance the response falls off.'
      ],
      a: 'About 6.5 m/s (23 km/h).'
    },
    {
      title: 'Above, at and below resonance',
      q: 'An oscillator with Q = 20 has a static deflection $F_0/k = 1.0\\ \\mathrm{mm}$. Estimate its amplitude when driven at half, at, and at twice its natural frequency.',
      steps: [
        'Write the amplitude as $A = \\dfrac{F_0/k}{\\sqrt{(1 - r^2)^2 + (r/Q)^2}}$ with $r = \\omega/\\omega_0$.',
        '$r = 0.5$: $\\sqrt{0.75^2 + 0.025^2} = 0.750$, so $A = 1.33\\ \\mathrm{mm}$.',
        '$r = 1$: $A = Q \\times 1.0 = 20\\ \\mathrm{mm}$.',
        '$r = 2$: $\\sqrt{3^2 + 0.1^2} = 3.00$, so $A = 0.33\\ \\mathrm{mm}$ — and moving opposite to the force.'
      ],
      a: '1.3 mm, 20 mm and 0.33 mm.'
    }
  ],
  quiz: [
    { q: 'Once transients have died away, a driven oscillator vibrates at…', choices: ['its natural frequency', 'the driving frequency', 'the average of the two', 'zero frequency'], a: 1,
      why: 'The steady-state response always follows the drive. The natural frequency decides only how big the response is.' },
    { q: 'The damping of an oscillator is halved (Q doubles). Its resonance peak becomes…', choices: ['lower and wider', 'taller and narrower', 'taller and wider', 'unchanged'], a: 1,
      why: 'Peak amplitude ≈ Q F₀/k doubles, and the width ω₀/Q halves.' },
    { q: 'At resonance, the displacement lags the driving force by…', choices: ['0°', '45°', '90°', '180°'], a: 2,
      why: 'At resonance the force is in phase with the velocity, which is 90° ahead of the displacement, so the force always does positive work.' },
    { q: 'An oscillator is driven far above its natural frequency. Compared with the static deflection F₀/k, its amplitude is…', choices: ['much larger', 'about the same', 'much smaller, and opposite in phase to the force', 'infinite'], a: 2,
      why: 'At high frequency inertia dominates: A ≈ F₀/mω², small, with the mass moving against the force.' },
    { q: 'The collapse of the Tacoma Narrows Bridge is a textbook case of resonance with periodic wind gusts.', a: false,
      why: 'It was aerodynamic flutter: a steady wind fed a self-excited twisting motion. No periodic driving was needed.' }
  ],
  applications: ['Tuning radios and filters; MRI scanners and atomic clocks, which work at sharp resonances.', 'Musical instruments and loudspeaker enclosures.', 'Tuned mass dampers in skyscrapers and bridges, and avoiding resonance in engines, turbines and washing machines.'],
  sim: 'mech2-resonance'
}

);
