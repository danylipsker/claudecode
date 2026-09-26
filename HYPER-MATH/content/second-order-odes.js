/* HYPER-MATH · content/second-order-odes.js — second-order linear equations with
 * constant coefficients: the characteristic equation, the harmonic, damped and
 * driven oscillators, and the Laplace transform. Simulations: sims/series-odes.js. */
Hyper.add(

{
  id: 'second-order-linear', parent: 'second-order-odes', title: 'Second-order linear equations', level: 2,
  short: 'Equations $ay\'\' + by\' + cy = f(t)$. Trying an exponential turns them into a quadratic, and its roots — real, repeated or complex — decide whether solutions grow, decay or oscillate.',
  keywords: ['second-order linear equation', 'constant coefficients', 'characteristic equation', 'auxiliary equation', 'homogeneous', 'nonhomogeneous', 'superposition', 'complementary function', 'particular solution', 'undetermined coefficients', 'repeated root', 'complex roots'],
  prereq: ['first-order-linear', 'quadratic-equations', 'complex-numbers'],
  related: ['harmonic-oscillator-ode', 'damped-oscillator-ode', 'forced-oscillator-ode', 'eulers-formula', 'laplace-transform', 'eigenvalues'],
  body: `
Springs, pendulums, electrical circuits, vibrating beams and suspension systems are all described, at least for small motions, by one kind of equation:

$$a\\,y'' + b\\,y' + c\\,y = f(t)$$

with constant coefficients $a$, $b$, $c$ and a **forcing** $f(t)$. When $f = 0$ the equation is **homogeneous**: the system is left to itself.

### Superposition
Because the equation is linear, if $y_1$ and $y_2$ solve the homogeneous equation then so does any combination $C_1y_1 + C_2y_2$. Two solutions that are not multiples of each other give the **general solution**, with two constants — matching the two initial conditions, position and velocity, that a second-order system needs.

### Try an exponential
Guess $y = e^{rt}$. Every derivative just brings down a factor $r$, so substituting gives $e^{rt}(ar^2 + br + c) = 0$, and since $e^{rt}$ is never zero:

$$a r^2 + b r + c = 0$$

This **characteristic equation** turns a differential equation into a [[quadratic-equations|quadratic]]. Its discriminant $b^2 - 4ac$ sorts the solutions into three families:

| Roots | General solution | Behaviour |
|---|---|---|
| two real, $r_1 \\ne r_2$ | $C_1 e^{r_1 t} + C_2 e^{r_2 t}$ | growth or decay, no oscillation |
| one repeated, $r$ | $(C_1 + C_2 t)\\,e^{rt}$ | the borderline case |
| complex, $\\alpha \\pm i\\beta$ | $e^{\\alpha t}\\left(C_1\\cos\\beta t + C_2\\sin\\beta t\\right)$ | oscillation inside an envelope |

The complex case is where [[complex-numbers|complex numbers]] earn their keep. By [[eulers-formula|Euler's formula]], $e^{(\\alpha + i\\beta)t} = e^{\\alpha t}(\\cos\\beta t + i\\sin\\beta t)$, and its real and imaginary parts are two real solutions. The real part $\\alpha$ of the roots sets the envelope — decay if negative, growth if positive — and the imaginary part $\\beta$ is the angular frequency of the oscillation. For a repeated root the second solution is $te^{rt}$; substituting it confirms it works precisely because $r$ is a double root.

### Forcing and particular solutions
With a forcing term the general solution is

$$y = y_h + y_p$$

the homogeneous solution (with its two constants) plus **any one** particular solution. The method of **undetermined coefficients** guesses $y_p$ in the same form as the forcing: a polynomial for a polynomial, $Ae^{kt}$ for $e^{kt}$, $A\\cos\\omega t + B\\sin\\omega t$ for a cosine or sine. If the guess already solves the homogeneous equation, multiply it by $t$ — which is exactly what happens at [[forced-oscillator-ode|resonance]].

For $y'' + 3y' + 2y = 4$, the constant $y_p = 2$ works, and the characteristic roots $-1, -2$ give $y = 2 + C_1e^{-t} + C_2e^{-2t}$: every solution settles at 2. The homogeneous part is the **transient**, the particular part the **steady response** — the same structure as in [[first-order-linear|first-order linear equations]], one derivative higher. The [[laplace-transform|Laplace transform]] packages the whole procedure, initial conditions included, into algebra.

> [!note] Written as a first-order system for $(y, y')$, the equation has a 2 × 2 matrix whose [[eigenvalues|eigenvalues]] are exactly the characteristic roots.
`,
  ideas: [
    'Linear homogeneous equations obey superposition: any combination of solutions is a solution.',
    'Substituting $y = e^{rt}$ turns $ay\'\' + by\' + cy = 0$ into the characteristic equation $ar^2 + br + c = 0$.',
    'Distinct real roots give exponentials; a repeated root adds $te^{rt}$; complex roots $\\alpha \\pm i\\beta$ give $e^{\\alpha t}\\cos\\beta t$ and $e^{\\alpha t}\\sin\\beta t$.',
    'With forcing, the general solution is the homogeneous solution plus one particular solution.',
    'Two initial conditions — position and velocity — fix the two constants.'
  ],
  pitfalls: [
    'Adding solutions of a forced equation — Superposition holds for the homogeneous equation. The sum of two solutions of $y\'\' + y = f$ solves $y\'\' + y = 2f$; their difference solves the homogeneous equation.',
    'Writing $C_1e^{rt} + C_2e^{rt}$ for a repeated root — That is one solution with the constant $C_1 + C_2$. The second independent solution is $te^{rt}$.',
    'Fitting the initial conditions to $y_h$ alone — The constants must be fitted to the complete solution $y_h + y_p$.'
  ],
  formulas: [
    {
      name: 'The characteristic equation',
      expr: 'a*r^2 + b*r + c = 0', tex: 'a r^2 + b r + c = 0',
      vars: {
        a: { name: 'coefficient of y″', value: 1, signed: true },
        b: { name: 'coefficient of y′', value: 3, signed: true },
        c: { name: 'coefficient of y', value: 2, signed: true },
        r: { name: 'characteristic root', signed: true }
      },
      solveFor: 'r',
      note: 'Solving for $r$ finds both real roots. When there are none, the roots are complex, $\\alpha \\pm i\\beta$ — use the next formula.',
      practice: { unknowns: ['r'] }
    },
    {
      name: 'Complex roots: frequency of oscillation',
      expr: 'beta = sqrt(4*a*c - b^2)/(2*a)', tex: '\\beta = \\frac{\\sqrt{4ac - b^2}}{2a}',
      vars: {
        beta: { name: 'imaginary part of the roots (angular frequency)', tex: '\\beta' },
        a: { name: 'coefficient of y″', value: 1 },
        b: { name: 'coefficient of y′', value: 2 },
        c: { name: 'coefficient of y', value: 10 }
      },
      note: 'When $b^2 < 4ac$ the roots are $\\alpha \\pm i\\beta$ with $\\alpha = -b/2a$: the solution oscillates at angular frequency $\\beta$ inside the envelope $e^{\\alpha t}$.',
      practice: { unknowns: ['beta', 'c'] }
    }
  ],
  examples: [
    {
      title: 'Real roots',
      q: 'Solve $y\'\' - y\' - 6y = 0$ with $y(0) = 1$, $y\'(0) = 8$.',
      steps: [
        'Characteristic equation: $r^2 - r - 6 = (r - 3)(r + 2) = 0$, so $r = 3$ and $r = -2$.',
        'General solution: $y = C_1e^{3t} + C_2e^{-2t}$.',
        'Initial conditions: $C_1 + C_2 = 1$ and $3C_1 - 2C_2 = 8$. Substituting $C_2 = 1 - C_1$: $5C_1 = 10$, so $C_1 = 2$, $C_2 = -1$.'
      ],
      a: 'y = 2e^(3t) − e^(−2t)'
    },
    {
      title: 'Complex roots',
      q: 'Solve $y\'\' + 2y\' + 10y = 0$ with $y(0) = 1$, $y\'(0) = 2$.',
      steps: [
        '$r^2 + 2r + 10 = 0$ gives $r = \\dfrac{-2 \\pm \\sqrt{4 - 40}}{2} = -1 \\pm 3i$.',
        'General solution: $y = e^{-t}(C_1\\cos 3t + C_2\\sin 3t)$ — an oscillation at 3 rad/s decaying like $e^{-t}$.',
        '$y(0) = C_1 = 1$. Differentiating, $y\'(0) = -C_1 + 3C_2 = 2$, so $C_2 = 1$.'
      ],
      a: 'y = e^(−t)(cos 3t + sin 3t)'
    },
    {
      title: 'A sinusoidal forcing',
      q: 'Find the general solution of $y\'\' + 3y\' + 2y = 10\\cos t$.',
      steps: [
        'Homogeneous part: roots $-1$ and $-2$, so $y_h = C_1e^{-t} + C_2e^{-2t}$.',
        'Guess $y_p = A\\cos t + B\\sin t$. Then $y_p\'\' + 3y_p\' + 2y_p = (A + 3B)\\cos t + (B - 3A)\\sin t$.',
        'Match with $10\\cos t$: $A + 3B = 10$ and $B - 3A = 0$, so $B = 3A$, $10A = 10$: $A = 1$, $B = 3$.',
        'After the transients die away the solution is $\\cos t + 3\\sin t = \\sqrt{10}\\cos(t - 71.6°)$: the same frequency as the forcing, with its own amplitude and a phase lag.'
      ],
      a: 'y = C₁e^(−t) + C₂e^(−2t) + cos t + 3 sin t'
    }
  ],
  quiz: [
    { q: 'The characteristic equation of $y\'\' + 4y\' + 13y = 0$ has roots…', choices: ['$-2 \\pm 3i$', '$2 \\pm 3i$', '$-4$ and $13$', '$-2 \\pm 9i$'], a: 0,
      why: '$r = \\dfrac{-4 \\pm \\sqrt{16 - 52}}{2} = -2 \\pm \\dfrac{\\sqrt{-36}}{2} = -2 \\pm 3i$: oscillation at 3 rad/s inside $e^{-2t}$.' },
    { q: 'Solve $y\'\' - 4y = 0$ with $y(0) = 2$ and $y\'(0) = 0$.', answer: 'e^(2t) + e^(-2t)', vars: ['t'],
      why: 'Roots $\\pm 2$: $y = C_1e^{2t} + C_2e^{-2t}$ with $C_1 + C_2 = 2$ and $2C_1 - 2C_2 = 0$, so both are 1. (That is $2\\cosh 2t$.)' },
    { q: 'For a repeated characteristic root $r$, the second independent solution is…', choices: ['$e^{2rt}$', '$t\\,e^{rt}$', '$e^{rt}\\cos t$', '$r\\,e^{rt}$'], a: 1,
      why: '$r\\,e^{rt}$ is just a multiple of $e^{rt}$. Multiplying by $t$ gives a genuinely new solution, as substitution confirms.' },
    { q: 'If $y_1$ and $y_2$ both solve $y\'\' + 3y\' + 2y = 4$, then so does $y_1 + y_2$.', a: false,
      why: 'The sum solves the equation with right side 8. Superposition works only for the homogeneous equation; $y_1 - y_2$ solves that one.' },
    { q: 'Solutions of $y\'\' + by\' + cy = 0$ (with $c > 0$) oscillate when…', choices: ['$b^2 > 4c$', '$b^2 = 4c$', '$b^2 < 4c$', 'never'], a: 2,
      why: 'A negative discriminant gives complex roots, and complex roots mean sines and cosines.' }
  ],
  applications: [
    'Mechanical vibrations: springs, beams, vehicle suspensions and machine mounts.',
    'Electrical circuits with a resistor, inductor and capacitor.',
    'Control systems, whose response to a command is designed by placing the characteristic roots.',
    'Small oscillations about equilibrium in almost any physical system.'
  ],
  sim: { id: 'so-oscillator', params: { zeta: 0.3 } }
},

{
  id: 'harmonic-oscillator-ode', parent: 'second-order-odes', title: 'The harmonic oscillator equation', level: 2,
  short: 'The equation $\\ddot x = -\\omega^2 x$ — acceleration proportional to displacement and pointing back — whose solutions are sines and cosines: the pattern of every small vibration in nature.',
  keywords: ['harmonic oscillator', 'simple harmonic motion', 'SHM', 'angular frequency', 'natural frequency', 'period', 'amplitude', 'phase', 'phase plane', 'energy conservation', 'spring', 'pendulum', 'LC circuit', 'isochronism'],
  prereq: ['second-order-linear', 'trig-graphs', 'sum-and-difference'],
  related: ['damped-oscillator-ode', 'taylor-series', 'eulers-formula', 'phasors', 'physics:simple-harmonic-motion', 'physics:mass-spring-system', 'physics:simple-pendulum', 'physics:lc-resonance', 'physics:energy-in-shm', 'physics:quantum-harmonic-oscillator'],
  body: `
Hang a mass $m$ on a spring of stiffness $k$. Displaced by $x$, it feels a restoring force $-kx$, and [[physics:newtons-second-law|Newton's second law]] gives $m\\ddot x = -kx$, or

$$\\ddot x + \\omega^2 x = 0, \\qquad \\omega = \\sqrt{\\frac{k}{m}}$$

In words: *the acceleration is proportional to the displacement and points back towards equilibrium*. That sentence is the definition of [[physics:simple-harmonic-motion|simple harmonic motion]].

### The solution
The [[second-order-linear|characteristic equation]] $r^2 + \\omega^2 = 0$ has the imaginary roots $\\pm i\\omega$, so

$$x(t) = A\\cos\\omega t + B\\sin\\omega t = R\\cos(\\omega t - \\varphi)$$

where the [[sum-and-difference|sum formula]] converts one form into the other: $R = \\sqrt{A^2 + B^2}$ is the **amplitude** and $\\tan\\varphi = B/A$ gives the **phase**. From the starting position $x_0$ and velocity $v_0$: $A = x_0$ and $B = v_0/\\omega$, so $R = \\sqrt{x_0^2 + (v_0/\\omega)^2}$.

The **period** $T = 2\\pi/\\omega = 2\\pi\\sqrt{m/k}$ and the frequency $f = \\omega/2\\pi$ do **not depend on the amplitude**. A large swing takes exactly as long as a small one — the property (isochronism) that let pendulum clocks, and later quartz watches, keep time.

### The same equation everywhere

| System | Equation | $\\omega$ |
|---|---|---|
| mass on a spring | $m\\ddot x = -kx$ | $\\sqrt{k/m}$ |
| pendulum, small swings | $\\ddot\\theta = -\\dfrac{g}{L}\\theta$ | $\\sqrt{g/L}$ |
| LC circuit | $L\\ddot q = -q/C$ | $1/\\sqrt{LC}$ |
| floating block bobbing | $m\\ddot y = -\\rho g A\\,y$ | $\\sqrt{\\rho g A/m}$ |

and there is a reason. Near any stable equilibrium a smooth potential energy is, by [[taylor-series|Taylor's theorem]], a parabola $\\tfrac12 k(x - x_0)^2$ plus smaller terms — so small vibrations of molecules, bridges, crystals and planets' orbits about their average paths are all harmonic. In quantum mechanics the same equation, as the [[physics:quantum-harmonic-oscillator|quantum harmonic oscillator]], describes molecular vibrations and the modes of light.

### Energy and the phase plane
Multiply the equation by $\\dot x$ and notice that both terms are derivatives:

$$\\dot x\\ddot x + \\omega^2 x\\dot x = \\frac{d}{dt}\\left(\\tfrac12\\dot x^2 + \\tfrac12\\omega^2 x^2\\right) = 0$$

so $\\tfrac12 m\\dot x^2 + \\tfrac12 kx^2$ — kinetic plus spring energy — stays constant ([[physics:energy-in-shm|energy in SHM]]). Plotted in the **phase plane**, with $x$ across and $\\dot x/\\omega$ up, the motion goes round a circle whose radius is the amplitude; each circle is one energy. Add friction and the circles become inward spirals — the [[damped-oscillator-ode|damped oscillator]].

### The rotating picture
Since $\\cos\\omega t = \\operatorname{Re}\\,e^{i\\omega t}$, harmonic motion is the shadow of a point going steadily round a circle — a [[phasors|phasor]]. That picture, via [[eulers-formula|Euler's formula]], is how engineers add oscillations of the same frequency by adding arrows.
`,
  ideas: [
    '$\\ddot x = -\\omega^2 x$: acceleration proportional to displacement and pointing back towards equilibrium.',
    'Solutions are $A\\cos\\omega t + B\\sin\\omega t = R\\cos(\\omega t - \\varphi)$, with A and B fixed by the starting position and velocity.',
    'The period $2\\pi/\\omega$ does not depend on the amplitude.',
    'Energy $\\tfrac12 m\\dot x^2 + \\tfrac12 kx^2$ is conserved, so the motion traces a closed circle in the phase plane.',
    'Any stable equilibrium, for small displacements, obeys this equation.'
  ],
  pitfalls: [
    'A bigger swing takes longer — Not for a true harmonic oscillator: the period is independent of amplitude. A real pendulum does slow slightly at large angles, because $\\sin\\theta \\approx \\theta$ stops being accurate.',
    'ω is the frequency in hertz — ω is in radians per second; the frequency is $f = \\omega/2\\pi$. A spring with $\\omega = 20$ rad/s vibrates 3.2 times a second.',
    'The mass is fastest at the ends of its swing — It is momentarily at rest there; it is fastest passing through equilibrium, where the acceleration is zero.'
  ],
  derivation: {
    title: 'Energy conservation from the equation of motion',
    steps: [
      { text: 'Start from Newton\'s second law for the spring:', tex: 'm\\ddot x + kx = 0' },
      { text: 'Multiply by the velocity $\\dot x$:', tex: 'm\\dot x\\ddot x + kx\\dot x = 0' },
      { text: 'Each term is an exact derivative, by the chain rule:', tex: '\\frac{d}{dt}\\left(\\tfrac12 m\\dot x^2\\right) + \\frac{d}{dt}\\left(\\tfrac12 kx^2\\right) = 0' },
      { text: 'So the total energy never changes:', tex: '\\tfrac12 m\\dot x^2 + \\tfrac12 kx^2 = E = \\tfrac12 kR^2' }
    ]
  },
  formulas: [
    {
      name: 'Natural angular frequency',
      expr: 'w = sqrt(k/m)', tex: '\\omega_0 = \\sqrt{\\frac{k}{m}}',
      vars: {
        w: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega_0' },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 200 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 }
      },
      stories: { w: 'A {m} mass hangs on a spring of stiffness {k}. What is its natural angular frequency?', k: 'What spring gives a {m} mass a natural angular frequency of {w}?' }
    },
    {
      name: 'Period',
      expr: 'T = 2*pi*sqrt(m/k)', tex: 'T = 2\\pi\\sqrt{\\frac{m}{k}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 's' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 200 }
      },
      stories: { T: 'A {m} mass bounces on a spring of stiffness {k}. How long does one full oscillation take?', m: 'What mass on a {k} spring oscillates with period {T}?' }
    },
    {
      name: 'Amplitude from the starting conditions',
      expr: 'R = sqrt(x0^2 + (v0/w)^2)', tex: 'R = \\sqrt{x_0^2 + \\left(\\frac{v_0}{\\omega}\\right)^2}',
      vars: {
        R: { name: 'amplitude', q: 'length', unit: 'cm' },
        x0: { name: 'starting displacement', q: 'length', unit: 'cm', value: 3, signed: true, tex: 'x_0' },
        v0: { name: 'starting velocity', q: 'speed', unit: 'm/s', value: 0.8, signed: true, tex: 'v_0' },
        w: { name: 'angular frequency', q: 'angvel', unit: 'rad/s', value: 20, tex: '\\omega' }
      },
      stories: { R: 'A mass with ω = {w} is pulled {x0} from equilibrium and given a velocity of {v0}. What is the amplitude of the motion?' }
    }
  ],
  examples: [
    {
      title: 'Fitting the starting conditions',
      q: 'A 0.5 kg mass on a 200 N/m spring is pulled 3 cm from equilibrium and pushed outwards at 0.8 m/s. Find $x(t)$, the amplitude and the top speed.',
      steps: [
        '$\\omega = \\sqrt{200/0.5} = 20$ rad/s, so the period is $2\\pi/20 = 0.314$ s.',
        '$A = x_0 = 0.03$ m and $B = v_0/\\omega = 0.8/20 = 0.04$ m, so $x = 0.03\\cos 20t + 0.04\\sin 20t$.',
        'Amplitude $R = \\sqrt{0.03^2 + 0.04^2} = 0.05$ m; phase $\\varphi = \\arctan(0.04/0.03) = 53.1°$: $x = 0.05\\cos(20t - 53.1°)$.',
        'Top speed, passing through equilibrium: $R\\omega = 0.05 \\times 20 = 1.0$ m/s.'
      ],
      a: 'x = 5 cm · cos(20t − 53°); amplitude 5 cm; top speed 1 m/s.'
    },
    {
      title: 'A bobbing buoy',
      q: 'A cylindrical buoy of mass 50 kg and cross-section 0.2 m² floats upright in sea water ($\\rho = 1025$ kg/m³). Pushed down and released, how fast does it bob?',
      steps: [
        'Pushing it down by $y$ adds a buoyant force $\\rho g A y$ (Archimedes) — a restoring force proportional to displacement.',
        'So $m\\ddot y = -\\rho g A\\,y$, a harmonic oscillator with $\\omega = \\sqrt{\\rho g A/m} = \\sqrt{1025 \\times 9.81 \\times 0.2/50} = 6.34$ rad/s.',
        'Period $T = 2\\pi/6.34 = 0.99$ s. (Water dragged along with the buoy makes the real period somewhat longer.)'
      ],
      a: 'About one bob per second.'
    }
  ],
  quiz: [
    { q: 'Doubling the mass on a spring multiplies the period by…', choices: ['2', '$\\sqrt 2$', '$\\tfrac12$', '4'], a: 1,
      why: '$T = 2\\pi\\sqrt{m/k}$ grows like the square root of the mass.' },
    { q: 'Solve $\\ddot x + 4x = 0$ with $x(0) = 3$ and $\\dot x(0) = 0$.', answer: '3cos(2t)', vars: ['t'],
      why: '$\\omega = 2$; released from rest means $B = 0$ and $A = 3$: $x = 3\\cos 2t$.' },
    { q: 'Doubling the amplitude of a harmonic oscillator…', choices: ['doubles the period', 'leaves the period unchanged', 'halves the period', 'multiplies the period by four'], a: 1,
      why: 'The equation is linear, so twice a solution is a solution with the same time dependence. The mass goes twice as far at twice the speed.' },
    { q: 'In the phase plane $(x, \\dot x/\\omega)$, an undamped harmonic oscillator goes round a circle whose radius is set by its energy.', a: true,
      why: 'Conservation of $\\tfrac12\\dot x^2 + \\tfrac12\\omega^2x^2$ means $x^2 + (\\dot x/\\omega)^2$ is constant — a circle of radius equal to the amplitude.' },
    { q: 'A system obeys $\\ddot\\theta + 25\\,\\theta = 0$ (time in seconds). What is its period? Give the exact value.', answer: '2pi/5', vars: [],
      why: '$\\omega^2 = 25$, so $\\omega = 5$ rad/s and $T = 2\\pi/5 \\approx 1.26$ s.' }
  ],
  applications: [
    'Clocks and watches, from pendulums and balance wheels to quartz crystals.',
    'Vehicle suspensions, loudspeaker cones and seismometers.',
    'LC circuits in radios and the vibrations of molecules seen in infrared spectra.'
  ],
  history: 'Robert Hooke stated his law of springs in 1678. Christiaan Huygens built the first pendulum clock in 1656, relying on the near-constant period of small swings, and later found the cycloidal pendulum whose period is exactly independent of amplitude.',
  sim: { id: 'so-oscillator', params: { zeta: 0 } }
},

{
  id: 'damped-oscillator-ode', parent: 'second-order-odes', title: 'The damped oscillator', level: 2,
  short: 'Add friction to the harmonic oscillator and the swings die away — or, with enough damping, the system creeps back without swinging at all. One number, the damping ratio ζ, decides which.',
  keywords: ['damped oscillator', 'damping ratio', 'underdamped', 'critically damped', 'overdamped', 'decay envelope', 'quality factor', 'Q factor', 'logarithmic decrement', 'damped frequency', 'shock absorber', 'RLC circuit'],
  prereq: ['harmonic-oscillator-ode', 'second-order-linear'],
  related: ['forced-oscillator-ode', 'laplace-transform', 'physics:damped-oscillations', 'physics:rlc-impedance', 'physics:lc-resonance'],
  body: `
Real oscillators lose energy — to air resistance, to internal friction, to a shock absorber, to the resistor in a circuit. The simplest model adds a force proportional to velocity, $-c\\dot x$:

$$m\\ddot x + c\\dot x + kx = 0 \\quad\\Longrightarrow\\quad \\ddot x + 2\\zeta\\omega_0\\dot x + \\omega_0^2 x = 0$$

with the natural frequency $\\omega_0 = \\sqrt{k/m}$ and the dimensionless **damping ratio**

$$\\zeta = \\frac{c}{2\\sqrt{mk}}$$

The characteristic roots are $r = \\omega_0\\left(-\\zeta \\pm \\sqrt{\\zeta^2 - 1}\\right)$, and the sign under the root splits the behaviour into three regimes.

### Underdamped: ζ < 1
Complex roots $-\\zeta\\omega_0 \\pm i\\omega_d$ give

$$x(t) = R\\,e^{-\\zeta\\omega_0 t}\\cos(\\omega_d t - \\varphi), \\qquad \\omega_d = \\omega_0\\sqrt{1 - \\zeta^2}$$

an oscillation inside a shrinking exponential envelope. Light damping barely changes the frequency — at $\\zeta = 0.1$ it drops by only 0.5% — but it decides how long the ringing lasts.

### Critically damped: ζ = 1
A double root $-\\omega_0$ gives $x = (C_1 + C_2t)\\,e^{-\\omega_0 t}$: the **fastest return to rest that never overshoots**.

### Overdamped: ζ > 1
Two negative real roots: no oscillation, just a slow creep back. For heavy damping the slow root is about $-\\omega_0/2\\zeta$, so *more* damping makes the return *slower* — think of a door closer filled with thick oil.

### Measuring damping
For light damping the **quality factor** $Q = 1/(2\\zeta)$ says how good an oscillator is: the amplitude falls by a factor $e$ in about $Q/\\pi$ swings, and each cycle loses the fraction $2\\pi/Q$ of the stored energy. A car suspension has $Q$ of order 1, a tuning fork about 1000, a quartz watch crystal tens of thousands or more. In the lab, damping is read from a recording: the ratio of successive peaks gives the **logarithmic decrement** $\\delta = \\ln(x_n/x_{n+1}) = 2\\pi\\zeta/\\sqrt{1 - \\zeta^2}$.

### Choosing ζ on purpose
Engineers pick the damping ratio for the job:

| Application | Typical ζ | Why |
|---|---|---|
| car suspension | 0.2 – 0.4 | a compromise between comfort and road grip |
| analogue meters, measuring instruments | 0.6 – 0.7 | settles within a few percent fastest |
| door closers, gun recoil systems | about 1 | no bounce back |
| buildings (design value for earthquakes) | 0.05 | what structures naturally have |

The same equation governs a series RLC circuit, $L\\ddot q + R\\dot q + q/C = 0$, with $\\omega_0 = 1/\\sqrt{LC}$ and $\\zeta = \\tfrac{R}{2}\\sqrt{C/L}$ ([[physics:rlc-impedance|RLC circuits]]). Drive a damped oscillator and you get [[forced-oscillator-ode|resonance]], whose sharpness is set by the same $Q$.
`,
  ideas: [
    'Standard form $\\ddot x + 2\\zeta\\omega_0\\dot x + \\omega_0^2 x = 0$, with the damping ratio $\\zeta = c/2\\sqrt{mk}$.',
    'ζ < 1: a decaying oscillation at $\\omega_d = \\omega_0\\sqrt{1 - \\zeta^2}$ inside the envelope $e^{-\\zeta\\omega_0 t}$.',
    'ζ = 1 is the fastest return without overshoot; ζ > 1 creeps back more and more slowly.',
    'The quality factor $Q \\approx 1/2\\zeta$ measures how many swings survive: the amplitude falls by e in about Q/π cycles.',
    'Engineers choose ζ deliberately: about 0.3 for car suspensions, 0.6–0.7 for meters, near 1 for door closers.'
  ],
  pitfalls: [
    'Critical damping stops the motion immediately — It still takes several times $1/\\omega_0$; it is only the fastest return that never overshoots.',
    'More damping always settles faster — Beyond ζ = 1 extra damping slows the return: an overdamped door creeps shut.',
    'Damping lowers the frequency a lot — At ζ = 0.1 the frequency falls by 0.5%. Damping mainly controls how quickly the swings die away.'
  ],
  formulas: [
    {
      name: 'Damping ratio',
      expr: 'zeta = c/(2*sqrt(m*k))', tex: '\\zeta = \\frac{c}{2\\sqrt{mk}}',
      vars: {
        zeta: { name: 'damping ratio', tex: '\\zeta' },
        c: { name: 'damping coefficient', unit: 'N·s/m', value: 4 },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        k: { name: 'spring constant', q: 'stiffness', unit: 'N/m', value: 200 }
      },
      note: 'ζ < 1 oscillates, ζ = 1 is critical, ζ > 1 creeps. Critical damping needs $c = 2\\sqrt{mk}$.',
      stories: { c: 'A {m} mass sits on a {k} spring. What damping coefficient makes the damping ratio {zeta}?' }
    },
    {
      name: 'Frequency of damped oscillation',
      expr: 'wd = w0*sqrt(1 - zeta^2)', tex: '\\omega_d = \\omega_0\\sqrt{1 - \\zeta^2}',
      vars: {
        wd: { name: 'damped angular frequency', q: 'angvel', unit: 'rad/s', tex: '\\omega_d' },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 20, tex: '\\omega_0' },
        zeta: { name: 'damping ratio', tex: '\\zeta', value: 0.2, min: 0, max: 0.999 }
      }
    },
    {
      name: 'Logarithmic decrement',
      expr: 'delta = 2*pi*zeta/sqrt(1 - zeta^2)', tex: '\\delta = \\ln\\frac{x_n}{x_{n+1}} = \\frac{2\\pi\\zeta}{\\sqrt{1 - \\zeta^2}}',
      vars: {
        delta: { name: 'logarithmic decrement (ln of the ratio of successive peaks)', tex: '\\delta' },
        zeta: { name: 'damping ratio', tex: '\\zeta', value: 0.05, min: 0, max: 0.999 }
      },
      note: 'Measure two successive peaks, take the log of their ratio, and solve for ζ.',
      stories: { zeta: 'Successive peaks of a ringing structure shrink so that the logarithm of their ratio is {delta}. What is its damping ratio?' }
    },
    {
      name: 'Damping ratio of a series RLC circuit',
      expr: 'zeta = R/2*sqrt(C/L)', tex: '\\zeta = \\frac{R}{2}\\sqrt{\\frac{C}{L}}',
      vars: {
        zeta: { name: 'damping ratio', tex: '\\zeta' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 10 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 100 }
      },
      stories: { R: 'A series circuit has {L} and {C}. What resistance makes it critically damped (ζ = {zeta})?' }
    }
  ],
  examples: [
    {
      title: 'A car\'s suspension',
      q: 'One corner of a car carries 300 kg on a spring of 30 kN/m with a damper of 2400 N·s/m. Find $\\omega_0$, $\\zeta$, the damped frequency, and how far the body overshoots after a bump.',
      steps: [
        '$\\omega_0 = \\sqrt{30\\,000/300} = 10$ rad/s, about 1.6 Hz.',
        '$\\zeta = \\dfrac{2400}{2\\sqrt{300 \\times 30\\,000}} = \\dfrac{2400}{6000} = 0.4$: underdamped.',
        '$\\omega_d = 10\\sqrt{1 - 0.16} = 9.17$ rad/s.',
        'After half a damped period the envelope has fallen by $e^{-\\zeta\\omega_0\\,\\pi/\\omega_d} = e^{-0.4\\pi/0.917} = 0.25$: a 25% overshoot, then it settles.',
        'Critical damping would need $c = 2\\sqrt{mk} = 6000$ N·s/m — a harsher ride.'
      ],
      a: 'ω₀ = 10 rad/s, ζ = 0.4, ω_d ≈ 9.2 rad/s, overshoot about 25%.'
    },
    {
      title: 'Reading damping off a recording',
      q: 'A vibrating beam\'s recorded peaks are 10.0 mm and then 8.0 mm one cycle later. Find ζ and Q.',
      steps: [
        '$\\delta = \\ln(10/8) = 0.223$.',
        { text: 'Invert $\\delta = 2\\pi\\zeta/\\sqrt{1 - \\zeta^2}$:', tex: '\\zeta = \\frac{\\delta}{\\sqrt{4\\pi^2 + \\delta^2}} = \\frac{0.223}{6.287} = 0.035' },
        '$Q = 1/(2\\zeta) \\approx 14$: the beam rings for about $Q/\\pi \\approx 4.5$ cycles before its amplitude falls by a factor $e$.'
      ],
      a: 'ζ ≈ 0.035, Q ≈ 14'
    }
  ],
  quiz: [
    { q: 'A system with ζ = 1 is displaced and released. It…', choices: ['oscillates with slowly shrinking swings', 'returns to rest as fast as possible without overshooting', 'creeps back very slowly', 'oscillates for ever'], a: 1,
      why: 'That is critical damping, the boundary between oscillating and creeping.' },
    { q: 'Increasing ζ well beyond 1 makes the return to equilibrium…', choices: ['faster', 'slower', 'oscillatory', 'unchanged'], a: 1,
      why: 'The slow root is about $-\\omega_0/2\\zeta$: heavy damping resists motion in both directions, so the system oozes back.' },
    { q: 'Light damping with ζ = 0.05 changes the oscillation frequency by about…', choices: ['0.1%', '5%', '50%', 'nothing at all'], a: 0,
      why: '$\\sqrt{1 - 0.05^2} = 0.99875$: a change of about 0.13%. The damping shows up in the decay, not the pitch.' },
    { q: 'The motion described by $\\ddot x + 2\\dot x + 5x = 0$ is underdamped.', a: true,
      why: '$r^2 + 2r + 5 = 0$ has discriminant $4 - 20 < 0$: complex roots $-1 \\pm 2i$. Here $\\omega_0 = \\sqrt 5$ and $\\zeta = 1/\\sqrt 5 \\approx 0.45$.' },
    { q: 'Solve $\\ddot x + 2\\dot x + x = 0$ with $x(0) = 1$ and $\\dot x(0) = 0$.', answer: '(1 + t)e^(-t)', vars: ['t'],
      why: 'Critical damping: double root $-1$, so $x = (C_1 + C_2t)e^{-t}$. $x(0) = 1$ gives $C_1 = 1$; $\\dot x(0) = C_2 - C_1 = 0$ gives $C_2 = 1$.' }
  ],
  applications: [
    'Shock absorbers, door closers and recoil buffers.',
    'Galvanometers, balances and other instruments that must settle quickly.',
    'Seismic design of buildings and bridges, and tuned dampers.',
    'Series RLC circuits and the ringing of electronic filters.'
  ],
  sim: { id: 'so-oscillator', params: { zeta: 0.1 } }
},

{
  id: 'forced-oscillator-ode', parent: 'second-order-odes', title: 'Forced oscillations and resonance', level: 3,
  short: 'Push a damped oscillator periodically and, once the start-up transient has died, it moves at the pushing frequency — with an amplitude that peaks sharply near its natural frequency: resonance.',
  keywords: ['forced oscillation', 'driven oscillator', 'resonance', 'resonance curve', 'steady state', 'transient', 'amplitude response', 'phase lag', 'quality factor', 'bandwidth', 'beats', 'tuned mass damper', 'frequency response', 'vibration isolation'],
  prereq: ['damped-oscillator-ode', 'second-order-linear'],
  related: ['laplace-transform', 'phasors', 'fourier-series', 'physics:driven-oscillations', 'physics:lc-resonance', 'physics:rlc-impedance'],
  body: `
A child on a swing, a building shaken by an earthquake, a loudspeaker cone, a radio circuit fed by an antenna: each is a damped oscillator pushed by a periodic force,

$$\\ddot x + 2\\zeta\\omega_0\\dot x + \\omega_0^2 x = \\frac{F_0}{m}\\cos\\omega t$$

By the rule of [[second-order-linear|linear equations]] the solution is a **transient** — the free, damped oscillation, which dies away like $e^{-\\zeta\\omega_0 t}$ — plus a **steady response** at the driving frequency $\\omega$: $x = A\\cos(\\omega t - \\varphi)$. After a while only the steady response is left, whatever the starting conditions.

### The response
Substituting the steady form (most neatly with complex exponentials — see the derivation) gives

$$A = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\zeta\\omega_0\\omega)^2}}, \\qquad \\tan\\varphi = \\frac{2\\zeta\\omega_0\\omega}{\\omega_0^2 - \\omega^2}$$

Three regions tell the story:
- **Slow driving** ($\\omega \\ll \\omega_0$): $A \\approx F_0/k$, the static deflection, in step with the force ($\\varphi \\approx 0$). The spring does all the work.
- **At resonance** ($\\omega = \\omega_0$): $A = \\dfrac{F_0}{2\\zeta k} = Q\\,\\dfrac{F_0}{k}$ and $\\varphi = 90°$. The force is in step with the *velocity*, so it feeds energy in on every cycle; only damping limits the build-up.
- **Fast driving** ($\\omega \\gg \\omega_0$): $A \\approx F_0/(m\\omega^2)$, small and opposite to the force ($\\varphi \\to 180°$). Inertia wins: the mass cannot keep up.

The displacement peaks slightly below $\\omega_0$, at $\\omega_0\\sqrt{1 - 2\\zeta^2}$ (for $\\zeta < 1/\\sqrt2$). The width of the peak — the range over which the power absorbed is at least half its maximum — is about $\\omega_0/Q$: high-$Q$ resonances are tall and narrow.

### No damping
With $\\zeta = 0$ and $\\omega = \\omega_0$ the guess $A\\cos\\omega t$ fails — it solves the homogeneous equation — and multiplying by $t$ gives $x = \\dfrac{F_0}{2m\\omega_0}\\,t\\sin\\omega_0 t$: an amplitude that grows **without limit**. Just off resonance, starting from rest, the undamped solution is $\\dfrac{F_0/m}{\\omega_0^2 - \\omega^2}(\\cos\\omega t - \\cos\\omega_0 t)$, which pulses in **beats** at the difference frequency.

### Resonance at work — and at large
- **Tuning**: an LC circuit picks one radio station out of thousands ([[physics:lc-resonance|resonance in RLC circuits]]). With $f_0 = 1$ MHz and $Q = 100$ the bandwidth is 10 kHz — about one AM channel.
- **Vibration isolation**: machines are mounted on soft springs so that they run well above the mounting's natural frequency, where little motion gets through.
- **Tuned mass dampers**, like the 660-tonne pendulum inside Taipei 101, resonate against a building's sway and drain its energy.
- London's Millennium Bridge swayed on its opening day in 2000 when walkers fell into step with a sideways mode near 1 Hz; dampers fixed it.
- The Tacoma Narrows Bridge (1940) is often blamed on resonance, but it failed by **flutter**: the wind's force depended on the deck's own motion, feeding a self-excited oscillation rather than pushing at a fixed frequency.

A periodic force that is not a pure cosine can be split into its [[fourier-series|Fourier harmonics]]; a linear system responds to each with its own amplitude and phase — the **frequency response** at the heart of electronics and control, and of the [[physics:driven-oscillations|physics of driven oscillations]].
`,
  ideas: [
    'Driven solution = transient (dies away) + steady oscillation at the driving frequency.',
    'Steady amplitude $A = (F_0/m)/\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\zeta\\omega_0\\omega)^2}$, largest near $\\omega_0$.',
    'The phase lag rises from 0° (slow driving) through 90° (resonance) to 180° (fast driving).',
    'At resonance the amplitude is Q times the static deflection, and the peak is about $\\omega_0/Q$ wide.',
    'Without damping, driving exactly at $\\omega_0$ makes the amplitude grow without limit.'
  ],
  pitfalls: [
    'A driven oscillator vibrates at its own natural frequency — Once the transient is gone it moves at the *driving* frequency; the natural frequency only sets how strongly it responds.',
    'The displacement peaks exactly at $\\omega_0$ — It peaks at $\\omega_0\\sqrt{1 - 2\\zeta^2}$, slightly lower. The velocity amplitude and the power absorbed peak exactly at $\\omega_0$.',
    'The Tacoma Narrows Bridge fell because the wind matched its natural frequency — It failed by aeroelastic flutter, a self-excited oscillation, not by resonance with a steady periodic push.'
  ],
  derivation: {
    title: 'The steady response with complex exponentials',
    steps: [
      { text: 'Write the drive as the real part of $\\tfrac{F_0}{m}e^{i\\omega t}$ and look for a response $x = \\operatorname{Re}(X e^{i\\omega t})$. Each time derivative multiplies by $i\\omega$:', tex: '\\left(-\\omega^2 + 2i\\zeta\\omega_0\\omega + \\omega_0^2\\right)X = \\frac{F_0}{m}' },
      { text: 'So the complex amplitude is', tex: 'X = \\frac{F_0/m}{(\\omega_0^2 - \\omega^2) + i\\,2\\zeta\\omega_0\\omega}' },
      { text: 'Its size is the real amplitude and its angle the phase lag:', tex: 'A = |X| = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\zeta\\omega_0\\omega)^2}}, \\qquad \\tan\\varphi = \\frac{2\\zeta\\omega_0\\omega}{\\omega_0^2 - \\omega^2}' },
      { text: 'At $\\omega = \\omega_0$ the real part of the denominator vanishes:', tex: 'A = \\frac{F_0/m}{2\\zeta\\omega_0^2} = \\frac{F_0}{2\\zeta k}' }
    ]
  },
  formulas: [
    {
      name: 'Steady-state amplitude',
      expr: 'A = F0/(m*sqrt((w0^2 - w^2)^2 + (2*zeta*w0*w)^2))', tex: 'A = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\zeta\\omega_0\\omega)^2}}',
      vars: {
        A: { name: 'amplitude of the steady oscillation', q: 'length', unit: 'cm' },
        F0: { name: 'amplitude of the driving force', q: 'force', unit: 'N', value: 2, tex: 'F_0' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 0.5 },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 20, tex: '\\omega_0' },
        w: { name: 'driving angular frequency', q: 'angvel', unit: 'rad/s', value: 18, tex: '\\omega' },
        zeta: { name: 'damping ratio', value: 0.05, tex: '\\zeta' }
      },
      note: 'Solving for $\\omega$ usually gives two answers, one on each side of the resonance peak.',
      practice: { unknowns: ['A', 'F0', 'w'] },
      stories: {
        A: 'A {m} mass on a spring (natural frequency {w0}, damping ratio {zeta}) is pushed by a force of amplitude {F0} at {w}. How large are its steady oscillations?',
        w: 'At what driving frequency does a {m} oscillator with ω₀ = {w0} and ζ = {zeta}, pushed with {F0}, oscillate with amplitude {A}?'
      }
    },
    {
      name: 'Phase lag behind the force',
      expr: 'phi = atan2(2*zeta*w0*w, w0^2 - w^2)', tex: '\\tan\\varphi = \\frac{2\\zeta\\omega_0\\omega}{\\omega_0^2 - \\omega^2}',
      vars: {
        phi: { name: 'phase lag', q: 'angle', unit: '°', tex: '\\varphi', min: 0, max: 180 },
        zeta: { name: 'damping ratio', value: 0.05, tex: '\\zeta' },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 20, tex: '\\omega_0' },
        w: { name: 'driving angular frequency', q: 'angvel', unit: 'rad/s', value: 18, tex: '\\omega' }
      },
      note: '0° far below resonance, 90° at resonance, approaching 180° far above.',
      practice: { unknowns: ['phi'] }
    },
    {
      name: 'Amplification at resonance',
      expr: 'M = 1/(2*zeta)', tex: '\\frac{A(\\omega_0)}{F_0/k} = \\frac{1}{2\\zeta} = Q',
      vars: {
        M: { name: 'amplitude at resonance ÷ static deflection', tex: 'Q' },
        zeta: { name: 'damping ratio', value: 0.05, tex: '\\zeta' }
      }
    },
    {
      name: 'Frequency of the amplitude peak',
      expr: 'wr = w0*sqrt(1 - 2*zeta^2)', tex: '\\omega_r = \\omega_0\\sqrt{1 - 2\\zeta^2}',
      vars: {
        wr: { name: 'frequency of largest amplitude', q: 'angvel', unit: 'rad/s', tex: '\\omega_r' },
        w0: { name: 'natural angular frequency', q: 'angvel', unit: 'rad/s', value: 20, tex: '\\omega_0' },
        zeta: { name: 'damping ratio', value: 0.2, min: 0, max: 0.707, tex: '\\zeta' }
      },
      note: 'Only for $\\zeta < 1/\\sqrt 2$; with more damping the amplitude simply falls as the frequency rises.'
    }
  ],
  examples: [
    {
      title: 'A machine on springs',
      q: 'A 60 kg machine stands on mounts with total stiffness 150 kN/m and damping ratio 0.1. An out-of-balance part shakes it with a force of amplitude 200 N. Find the vibration amplitude when the shaking is at 20 rad/s, 50 rad/s and 150 rad/s.',
      steps: [
        '$\\omega_0 = \\sqrt{150\\,000/60} = 50$ rad/s, and the static deflection is $F_0/k = 200/150\\,000 = 1.33$ mm.',
        'In ratio form, $A = \\dfrac{F_0/k}{\\sqrt{(1 - \\rho^2)^2 + (2\\zeta\\rho)^2}}$ with $\\rho = \\omega/\\omega_0$.',
        'At 20 rad/s ($\\rho = 0.4$): $A = 1.33/\\sqrt{0.706 + 0.006} = 1.58$ mm.',
        'At 50 rad/s ($\\rho = 1$): $A = 1.33/0.2 = 6.7$ mm — five times the static value, since $Q = 5$.',
        'At 150 rad/s ($\\rho = 3$): $A = 1.33/\\sqrt{64 + 0.36} = 0.17$ mm. Running well above resonance isolates the vibration.'
      ],
      a: '1.6 mm, 6.7 mm and 0.17 mm.'
    },
    {
      title: 'Choosing a radio station',
      q: 'A tuned circuit resonates at 1 MHz with $Q = 100$. Roughly how wide a band of frequencies does it pass?',
      steps: [
        'The half-power width of a resonance is about $f_0/Q$.',
        '$1\\ \\mathrm{MHz}/100 = 10$ kHz, which is about the spacing of AM broadcast channels — so the circuit picks out one station and rejects its neighbours.'
      ],
      a: 'About 10 kHz.'
    }
  ],
  quiz: [
    { q: 'Far below its natural frequency, a driven oscillator\'s displacement…', choices: ['follows the force in step, with amplitude about $F_0/k$', 'lags the force by 90°', 'is opposite to the force', 'is zero'], a: 0,
      why: 'Slowly varying forces just stretch the spring as if statically; inertia and damping hardly matter.' },
    { q: 'At exact resonance ($\\omega = \\omega_0$) with light damping, the displacement lags the force by…', choices: ['0°', '45°', '90°', '180°'], a: 2,
      why: 'Then the force is in phase with the velocity, which is why it pumps energy in so effectively.' },
    { q: 'Halving the damping of a lightly damped oscillator doubles its amplitude at resonance.', a: true,
      why: 'At resonance $A = F_0/(2\\zeta k)$, inversely proportional to ζ.' },
    { q: 'Machines are often mounted on soft springs so that they run well above the mounting\'s natural frequency. Why?', choices: ['To make them resonate', 'Above resonance the vibration passed on is small', 'Soft springs are cheaper', 'It increases the damping'], a: 1,
      why: 'Far above resonance the amplitude falls like $1/\\omega^2$: the mass barely follows the shaking, so little reaches the floor.' },
    { q: 'An undamped oscillator is driven exactly at its natural frequency. Its amplitude…', choices: ['stays at $F_0/k$', 'grows linearly with time', 'grows exponentially', 'rises and falls in beats'], a: 1,
      why: 'The particular solution is $\\dfrac{F_0}{2m\\omega_0}\\,t\\sin\\omega_0 t$, whose envelope grows in proportion to $t$. Beats happen slightly off resonance.' }
  ],
  applications: [
    'Tuning radios, and filters that pass or block chosen frequencies.',
    'Vibration isolation of machines, and tuned mass dampers in tall buildings and bridges.',
    'Musical instruments, whose bodies resonate to amplify the strings.',
    'Magnetic resonance imaging, where nuclei are driven at their natural precession frequency.'
  ],
  sim: { id: 'so-oscillator', params: { zeta: 0.1, F: 0.2, rho: 1, x0: 0 } }
},

{
  id: 'laplace-transform', parent: 'second-order-odes', title: 'The Laplace transform', level: 3,
  short: 'A transform that turns linear differential equations into algebra: derivatives become multiplication by s, initial conditions come along automatically, and the answer is read back from a table.',
  keywords: ['Laplace transform', 'inverse Laplace transform', 's-domain', 'transfer function', 'poles', 'partial fractions', 'step function', 'impulse', 'Dirac delta', 'convolution', 'final value theorem', 'control theory'],
  prereq: ['second-order-linear', 'improper-integrals', 'partial-fractions'],
  related: ['damped-oscillator-ode', 'forced-oscillator-ode', 'fourier-series', 'complex-plane', 'physics:rlc-impedance'],
  body: `
The **Laplace transform** of a function $f(t)$, defined for $t \\ge 0$, is

$$F(s) = \\mathcal{L}\\{f\\}(s) = \\int_0^{\\infty} e^{-st}f(t)\\,dt$$

an [[improper-integrals|improper integral]] that weighs $f$ with a decaying exponential and so produces a new function of the variable $s$. For example, $\\mathcal L\\{1\\} = 1/s$ and $\\mathcal L\\{e^{at}\\} = \\int_0^\\infty e^{-(s-a)t}\\,dt = 1/(s - a)$, valid for $s > a$.

### Why bother: derivatives become multiplication
Integrating by parts gives the property that makes the transform useful:

$$\\mathcal L\\{f'\\} = sF(s) - f(0), \\qquad \\mathcal L\\{f''\\} = s^2F(s) - s f(0) - f'(0)$$

Differentiating in time becomes multiplying by $s$ — and the initial values are built in. A linear differential equation with constant coefficients becomes an *algebraic* equation for $F(s)$.

### A short table

| $f(t)$ | $F(s)$ |
|---|---|
| $1$ | $1/s$ |
| $t^n$ | $n!/s^{n+1}$ |
| $e^{at}$ | $1/(s - a)$ |
| $\\sin\\omega t$ | $\\omega/(s^2 + \\omega^2)$ |
| $\\cos\\omega t$ | $s/(s^2 + \\omega^2)$ |
| $e^{at}f(t)$ | $F(s - a)$ |
| unit step switched on at $t = c$ | $e^{-cs}/s$ |
| impulse $\\delta(t)$ | $1$ |

### Solving an initial value problem
Take $y'' + 3y' + 2y = 0$ with $y(0) = 1$, $y'(0) = 0$. Transform term by term:

$$\\left(s^2Y - s\\right) + 3\\left(sY - 1\\right) + 2Y = 0 \\quad\\Rightarrow\\quad Y = \\frac{s + 3}{(s + 1)(s + 2)}$$

[[partial-fractions|Partial fractions]] split it into $\\dfrac{2}{s + 1} - \\dfrac{1}{s + 2}$, and the table reads back $y = 2e^{-t} - e^{-2t}$. No general solution, no constants to fit afterwards: the initial conditions went in at the start.

### Transfer functions and poles
With zero initial conditions the equation $ay'' + by' + cy = x(t)$ becomes $Y(s) = G(s)\\,X(s)$ with the **transfer function** $G(s) = 1/(as^2 + bs + c)$. The input is simply multiplied. The **poles** of $G$ — where its denominator vanishes — are the characteristic roots of the equation, and their place in the [[complex-plane|complex s-plane]] tells you everything about stability: poles in the left half-plane mean decaying responses, their imaginary parts are oscillation frequencies, and a single pole in the right half-plane means an unstable system. Setting $s = i\\omega$ turns $G$ into the frequency response — the [[forced-oscillator-ode|resonance curve]]. In circuit analysis the same idea gives each component an impedance: $R$, $sL$ and $1/(sC)$ ([[physics:rlc-impedance|RLC circuits]]).

### Switches and kicks
Engineering inputs are often abrupt: a switch closed at $t = 2$ s, a hammer blow. Their transforms are simple ($e^{-2s}/s$, and $1$ for an impulse), so such problems are no harder than smooth ones. The response to an impulse is the inverse transform of $G(s)$ itself; the response to any other input is a **convolution** with it, which the transform turns into a plain product. And the **final value theorem**, $\\lim_{t\\to\\infty} f(t) = \\lim_{s\\to 0} sF(s)$ (when the system settles), gives the steady state without solving anything.
`,
  ideas: [
    '$F(s) = \\int_0^\\infty e^{-st}f(t)\\,dt$ turns a function of time into a function of s.',
    'Derivatives become multiplication by s, with the initial values included: $\\mathcal L\\{f\'\\} = sF - f(0)$.',
    'A linear constant-coefficient ODE becomes algebra: solve for Y(s), split it by partial fractions, and read y(t) from a table.',
    'The poles of the transfer function are the characteristic roots: left half-plane means decay, imaginary parts mean oscillation.',
    'Steps, impulses and delays have simple transforms, which is why engineers use the method for switched systems.'
  ],
  pitfalls: [
    'Dropping the initial values from the derivative rule — $\\mathcal L\\{f\'\\}$ is $sF(s) - f(0)$, not $sF(s)$. The initial conditions are the whole convenience of the method.',
    'Every function has a Laplace transform — The integral must converge: $e^{t^2}$ grows too fast and has none. Functions that grow at most exponentially are fine.',
    'The method works for any differential equation — It is built for linear equations with constant coefficients; a term like $y^2$ does not transform into anything useful.'
  ],
  derivation: {
    title: 'The derivative rule',
    steps: [
      { text: 'Start from the definition applied to $f\'$:', tex: '\\mathcal L\\{f\'\\} = \\int_0^\\infty e^{-st}f\'(t)\\,dt' },
      { text: 'Integrate by parts, with $u = e^{-st}$ and $dv = f\'\\,dt$:', tex: '= \\Big[e^{-st}f(t)\\Big]_0^\\infty + s\\int_0^\\infty e^{-st}f(t)\\,dt' },
      { text: 'For large enough $s$ the boundary term vanishes at infinity, leaving $-f(0)$:', tex: '\\mathcal L\\{f\'\\} = sF(s) - f(0)' },
      { text: 'Apply the rule twice for the second derivative:', tex: '\\mathcal L\\{f\'\'\\} = s\\big(sF - f(0)\\big) - f\'(0) = s^2F - s f(0) - f\'(0)' }
    ]
  },
  formulas: [
    {
      name: 'Transform of an exponential',
      expr: 'F = 1/(s - a)', tex: 'F = \\frac{1}{s - a}',
      vars: {
        F: { name: 'value of the transform F(s)' },
        s: { name: 'transform variable (s > a)', value: 3 },
        a: { name: 'exponent a in e^(at)', value: 1, signed: true }
      },
      note: 'The integral converges only for $s > a$: the weight $e^{-st}$ must beat the growth of $e^{at}$.'
    },
    {
      name: 'Transform of a sine',
      expr: 'F = w/(s^2 + w^2)', tex: 'F = \\frac{\\omega}{s^2 + \\omega^2}',
      vars: {
        F: { name: 'value of the transform F(s)' },
        w: { name: 'angular frequency ω in sin ωt', value: 3, tex: '\\omega' },
        s: { name: 'transform variable', value: 2 }
      },
      practice: { unknowns: ['F'] }
    }
  ],
  examples: [
    {
      title: 'An initial value problem in one sweep',
      q: 'Solve $y\'\' + 3y\' + 2y = 0$ with $y(0) = 1$, $y\'(0) = 0$ by Laplace transform.',
      steps: [
        'Transform: $s^2Y - s \\cdot 1 - 0 + 3(sY - 1) + 2Y = 0$.',
        'Collect: $(s^2 + 3s + 2)\\,Y = s + 3$, so $Y = \\dfrac{s + 3}{(s + 1)(s + 2)}$.',
        'Partial fractions: $\\dfrac{s + 3}{(s+1)(s+2)} = \\dfrac{A}{s + 1} + \\dfrac{B}{s + 2}$ with $A = \\dfrac{-1 + 3}{-1 + 2} = 2$ and $B = \\dfrac{-2 + 3}{-2 + 1} = -1$.',
        'Invert with the table: $y = 2e^{-t} - e^{-2t}$. Check: $y(0) = 1$ and $y\'(0) = -2 + 2 = 0$.'
      ],
      a: 'y = 2e^(−t) − e^(−2t)'
    },
    {
      title: 'A suddenly applied load',
      q: 'An undamped spring–mass system at rest, $\\ddot y + y = 0$, has a constant force switched on at $t = 0$, so that $\\ddot y + y = 1$. Find $y(t)$.',
      steps: [
        'Transform with zero initial conditions: $s^2Y + Y = \\dfrac1s$, so $Y = \\dfrac{1}{s(s^2 + 1)}$.',
        'Partial fractions: $\\dfrac{1}{s(s^2+1)} = \\dfrac1s - \\dfrac{s}{s^2 + 1}$.',
        'Invert: $y = 1 - \\cos t$.',
        'The mass swings between 0 and 2 about the new equilibrium at 1: a suddenly applied load gives **twice** the static deflection — a rule structural engineers use.'
      ],
      a: 'y = 1 − cos t, peaking at twice the static deflection.'
    }
  ],
  quiz: [
    { q: 'What is the Laplace transform of $e^{-3t}$?', choices: ['$\\dfrac{1}{s - 3}$', '$\\dfrac{1}{s + 3}$', '$\\dfrac{3}{s^2 + 9}$', '$\\dfrac{s}{s + 3}$'], a: 1,
      why: '$\\mathcal L\\{e^{at}\\} = 1/(s - a)$ with $a = -3$.' },
    { q: 'Under the Laplace transform, the derivative $f\'(t)$ becomes…', choices: ['$F\'(s)$', '$sF(s) - f(0)$', '$F(s)/s$', '$-F\'(s)$'], a: 1,
      why: 'Integration by parts moves the derivative onto $e^{-st}$, bringing down a factor $s$ and leaving the boundary term $-f(0)$.' },
    { q: 'Find the inverse transform of $Y(s) = \\dfrac{1}{s(s + 1)}$, as a function of $t$.', answer: '1 - e^(-t)', vars: ['t'],
      why: 'Partial fractions: $\\dfrac1s - \\dfrac{1}{s + 1}$, whose inverse is $1 - e^{-t}$ — a first-order system charging up.' },
    { q: 'If every pole of a transfer function lies in the left half of the complex s-plane, its impulse response dies away.', a: true,
      why: 'Each pole $p$ contributes a term like $e^{pt}$, which decays when the real part of $p$ is negative.' },
    { q: 'A constant force is suddenly applied to an undamped spring–mass system at rest. Its largest displacement is…', choices: ['the static deflection', 'twice the static deflection', 'half the static deflection', 'infinite'], a: 1,
      why: 'The response is $(F/k)(1 - \\cos\\omega_0 t)$, which reaches $2F/k$.' }
  ],
  applications: [
    'Circuit analysis with impedances $R$, $sL$ and $1/(sC)$.',
    'Control engineering: transfer functions, pole placement and stability.',
    'Switching transients in power systems and structures under sudden loads.',
    'Solving heat-flow and diffusion problems in time.'
  ],
  history: 'Pierre-Simon Laplace used integrals of this kind in his work on probability around 1780–1812. Oliver Heaviside\'s operational calculus for circuits (1880s–1890s) got answers by treating $d/dt$ as an algebraic symbol; in the early 20th century Bromwich, Carson and Doetsch justified it with the Laplace transform.'
}

);
