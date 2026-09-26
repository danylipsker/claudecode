/* HYPER-MATH · content/pdes.js — partial differential equations: the wave, heat and
 * Laplace equations. Simulations are in sims/series-odes.js. */
Hyper.add(

{
  id: 'wave-equation', parent: 'pdes', title: 'The wave equation', level: 3,
  short: 'The partial differential equation $u_{tt} = c^2 u_{xx}$: each bit of a string (or of air, or of a field) accelerates according to the curvature around it. Its solutions are shapes that travel at speed c — and, between fixed ends, standing waves with whole-number harmonics.',
  keywords: ['wave equation', 'd\'Alembert', 'travelling wave', 'standing wave', 'normal modes', 'harmonics', 'separation of variables', 'vibrating string', 'wave speed', 'boundary conditions', 'Mersenne\'s laws', 'partial differential equation'],
  prereq: ['partial-derivatives', 'fourier-series', 'harmonic-oscillator-ode'],
  related: ['heat-equation', 'laplace-equation', 'second-order-linear', 'physics:waves-on-strings', 'physics:standing-waves', 'physics:harmonics-timbre', 'physics:electromagnetic-waves', 'physics:speed-of-sound', 'physics:musical-instruments'],
  body: `
Take a string stretched with tension $T$, with mass $\\mu$ per unit length, and let $u(x, t)$ be its small sideways displacement. A short piece of length $dx$ is pulled along the string at both ends. If the string is straight the two pulls cancel; if it is **curved**, they do not, and the leftover sideways force is $T\\,\\big(u_x(x + dx) - u_x(x)\\big) \\approx T\\,u_{xx}\\,dx$. [[physics:newtons-second-law|Newton's second law]] for the piece, $\\mu\\,dx\\,u_{tt} = T\\,u_{xx}\\,dx$, gives the **wave equation**:

$$\\frac{\\partial^2 u}{\\partial t^2} = c^2\\,\\frac{\\partial^2 u}{\\partial x^2}, \\qquad c = \\sqrt{\\frac{T}{\\mu}}$$

Curvature drives acceleration: where the string sags into a valley ($u_{xx} > 0$) it is pulled up, where it bulges it is pulled down. (The derivation assumes small slopes, which is why the equation is linear.)

### Travelling waves
In 1747 d'Alembert found the general solution:

$$u(x, t) = f(x - ct) + g(x + ct)$$

any shape $f$ sliding to the right at speed $c$ plus any shape $g$ sliding to the left. (Check: both $u_{tt}$ and $c^2u_{xx}$ equal $c^2(f'' + g'')$.) A string pulled into a shape $u_0(x)$ and released from rest moves as $\\tfrac12\\left[u_0(x - ct) + u_0(x + ct)\\right]$: the pluck splits into two half-height copies that run apart. And the solution at $(x, t)$ depends only on the starting data between $x - ct$ and $x + ct$ — news travels at speed $c$ and no faster.

### Standing waves between fixed ends
For a string fixed at $x = 0$ and $x = L$, look for solutions of the form $u = X(x)\\,\\tau(t)$ — **separation of variables**. Substituting and dividing by $X\\tau$ gives $\\tau''/(c^2\\tau) = X''/X$. The left side depends only on $t$ and the right only on $x$, so both must equal a constant $-k^2$. The ends force $X = \\sin(n\\pi x/L)$, and then $\\tau$ obeys a [[harmonic-oscillator-ode|harmonic oscillator equation]]. The **normal modes** are

$$u_n = \\sin\\frac{n\\pi x}{L}\\left(A_n\\cos\\omega_n t + B_n\\sin\\omega_n t\\right), \\qquad f_n = \\frac{\\omega_n}{2\\pi} = \\frac{n\\,c}{2L}$$

Each mode is a separate oscillator, and every motion of the string is a superposition of them, with amplitudes given by the [[fourier-series|Fourier series]] of the starting shape. The frequencies are whole-number multiples of the fundamental, which is why a string gives a clear pitch; the mix of amplitudes sets its [[physics:harmonics-timbre|timbre]]. A string plucked at one fifth of its length has no 5th, 10th, 15th … harmonics, because those modes have a node exactly where it was plucked.

### Numbers for a guitar
The top E string of a guitar (329.6 Hz) has a vibrating length of 0.648 m, so $c = 2Lf = 427$ m/s. A plain steel string 0.25 mm thick has $\\mu = 0.39$ g/m, so the tension is $T = \\mu c^2 \\approx 70$ N — about the weight of 7 kg. Tightening it by 10% raises the pitch by $\\sqrt{1.1} = 1.049$, just under a semitone.

### Everywhere waves travel
The same equation, in one, two or three dimensions ($u_{tt} = c^2\\nabla^2 u$), describes [[physics:speed-of-sound|sound]] in air ($c = 343$ m/s), [[physics:electromagnetic-waves|light and radio]] ($c = 1/\\sqrt{\\mu_0\\varepsilon_0}$), seismic waves and the membrane of a drum — whose mode frequencies are *not* whole-number multiples, which is why most drums have no definite pitch. Energy is conserved and nothing is forgotten, in sharp contrast with the [[heat-equation|heat equation]].
`,
  ideas: [
    '$u_{tt} = c^2u_{xx}$: curvature drives acceleration; for a string $c = \\sqrt{T/\\mu}$.',
    'Any shape travels unchanged at speed c: $u = f(x - ct) + g(x + ct)$.',
    'Between fixed ends the normal modes are $\\sin(n\\pi x/L)$, each a harmonic oscillator at $f_n = nc/2L$.',
    'Every motion is a superposition of modes, with amplitudes from the Fourier series of the starting shape.',
    'Signals travel at the finite speed c, and energy is conserved.'
  ],
  pitfalls: [
    'The wave speed is how fast the string itself moves — It is how fast the *shape* travels; each bit of string only moves sideways. It depends on tension and mass per length, not on the amplitude.',
    'A standing wave is a wave that does not move — It is the sum of two equal waves travelling in opposite directions. The pattern stays put while energy sloshes between the nodes.',
    'The wave equation holds at any amplitude — It assumes small slopes. Large swings stretch the string, change its tension and make the equation nonlinear.'
  ],
  derivation: {
    title: 'The wave equation from a piece of string',
    steps: [
      { text: 'A piece between $x$ and $x + dx$ is pulled by the tension $T$ along the string at each end. For small slopes, the sideways part of the pull is $T$ times the slope:', tex: 'F_\\text{side} = T\\,u_x(x + dx, t) - T\\,u_x(x, t)' },
      { text: 'The difference of slopes is the change of slope over $dx$:', tex: 'F_\\text{side} \\approx T\\,u_{xx}\\,dx' },
      { text: 'Newton\'s second law for the piece, of mass $\\mu\\,dx$:', tex: '\\mu\\,dx\\;u_{tt} = T\\,u_{xx}\\,dx' },
      { text: 'Divide by $\\mu\\,dx$:', tex: 'u_{tt} = \\frac{T}{\\mu}\\,u_{xx} = c^2 u_{xx}, \\qquad c = \\sqrt{T/\\mu}' }
    ]
  },
  formulas: [
    {
      name: 'Wave speed on a string',
      expr: 'c = sqrt(T/mu)', tex: 'c = \\sqrt{\\frac{T}{\\mu}}',
      vars: {
        c: { name: 'wave speed', q: 'speed', unit: 'm/s' },
        T: { name: 'tension', q: 'force', unit: 'N', value: 70 },
        mu: { name: 'mass per unit length', q: 'lindensity', unit: 'g/m', value: 0.385, tex: '\\mu' }
      },
      stories: { c: 'A string with {mu} is stretched to a tension of {T}. How fast do waves travel along it?', T: 'What tension gives waves a speed of {c} on a string with {mu}?' }
    },
    {
      name: 'Harmonics of a string fixed at both ends',
      expr: 'f = n*c/(2*L)', tex: 'f_n = \\frac{n\\,c}{2L}',
      vars: {
        f: { name: 'frequency of harmonic n', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'harmonic number', int: true, value: 1 },
        c: { name: 'wave speed', q: 'speed', unit: 'm/s', value: 427 },
        L: { name: 'vibrating length', q: 'length', unit: 'm', value: 0.648 }
      },
      stories: { f: 'Waves travel at {c} along a string whose vibrating length is {L}. What is the frequency of harmonic number {n}?' }
    },
    {
      name: 'Frequency from tension (Mersenne\'s laws)',
      expr: 'f = n/(2*L)*sqrt(T/mu)', tex: 'f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'harmonic number', int: true, value: 1 },
        L: { name: 'vibrating length', q: 'length', unit: 'm', value: 0.648 },
        T: { name: 'tension', q: 'force', unit: 'N', value: 70 },
        mu: { name: 'mass per unit length', q: 'lindensity', unit: 'g/m', value: 0.385, tex: '\\mu' }
      },
      note: 'Pitch rises with tension (as its square root), falls with length and with heavier strings.',
      practice: { unknowns: ['f', 'T', 'L'] },
      stories: {
        T: 'A guitar string {L} long with {mu} must sound {f} as its fundamental (n = {n}). What tension is needed?',
        f: 'A string {L} long with {mu} is under a tension of {T}. What is the frequency of harmonic {n}?'
      }
    }
  ],
  examples: [
    {
      title: 'Tuning a guitar string',
      q: 'The top E string of a guitar sounds 329.6 Hz with a vibrating length of 0.648 m. It is steel (7850 kg/m³), 0.25 mm in diameter. Find the wave speed and the tension.',
      steps: [
        'Fundamental: $f_1 = c/2L$, so $c = 2 \\times 0.648 \\times 329.6 = 427$ m/s.',
        'Mass per length: $\\mu = \\rho\\,\\pi d^2/4 = 7850 \\times \\pi \\times (0.25\\times10^{-3})^2/4 = 3.85\\times10^{-4}$ kg/m.',
        'Tension: $T = \\mu c^2 = 3.85\\times10^{-4} \\times 427^2 = 70$ N.',
        'Tightening by 10% raises $c$, and the pitch, by $\\sqrt{1.1}$: about 5%, close to one semitone (6%).'
      ],
      a: 'c ≈ 427 m/s, T ≈ 70 N.'
    },
    {
      title: 'A pluck splits in two',
      q: 'A 1 m string with wave speed 50 m/s is pulled into a narrow 1 cm bump at its centre and released. Describe the motion.',
      steps: [
        'By d\'Alembert, the bump splits into two 0.5 cm bumps moving left and right at 50 m/s.',
        'After $0.5/50 = 0.01$ s they reach the fixed ends and reflect upside down.',
        'At $t = L/c = 0.02$ s they meet at the centre, recreating the full 1 cm bump — inverted.',
        'At $t = 2L/c = 0.04$ s the string is back to its starting shape: the period is $2L/c$, matching the fundamental $f_1 = c/2L = 25$ Hz.'
      ],
      a: 'Two half-height pulses bounce between the ends; the pattern repeats every 0.04 s.'
    }
  ],
  quiz: [
    { q: 'Quadrupling the tension of a string (same length and string) multiplies its fundamental frequency by…', choices: ['2', '4', '16', '½'], a: 0,
      why: '$f \\propto c = \\sqrt{T/\\mu}$, and $\\sqrt 4 = 2$: one octave up.' },
    { q: 'Which of these solves $u_{tt} = c^2u_{xx}$ for any smooth function $f$?', choices: ['$f(x)\\,f(t)$', '$f(x - ct)$', '$f(x^2 - c^2t)$', '$f(ct)/x$'], a: 1,
      why: 'For $u = f(x - ct)$, $u_{tt} = c^2f\'\'$ and $u_{xx} = f\'\'$: a shape moving right at speed $c$.' },
    { q: 'For a string fixed at both ends, the frequencies of the normal modes are whole-number multiples of the fundamental.', a: true,
      why: '$f_n = nc/2L$. That harmonic series is what makes a string\'s note sound pitched, unlike a drum.' },
    { q: 'A string is plucked exactly at its midpoint. Which harmonics are missing from its sound?', choices: ['The odd ones', 'The even ones', 'None', 'All but the fundamental'], a: 1,
      why: 'Even modes have a node at the midpoint, so a shape symmetric about the middle gives them zero amplitude.' },
    { q: 'A string 0.5 m long carries waves at 200 m/s. Write the frequency of harmonic $n$ (in Hz) as an expression in $n$.', answer: '200n', vars: ['n'],
      why: '$f_n = \\dfrac{nc}{2L} = \\dfrac{200n}{1} = 200n$ Hz: 200, 400, 600 … Hz.' }
  ],
  applications: [
    'Stringed instruments, and the design of their strings and scale lengths.',
    'Acoustics of pipes, rooms and loudspeakers.',
    'Electromagnetic waves in cables, waveguides and free space.',
    'Seismology: locating earthquakes from wave arrival times.'
  ],
  history: 'Jean le Rond d\'Alembert derived and solved the equation for the vibrating string in 1747. Daniel Bernoulli proposed in 1753 that every motion is a sum of sine modes, sparking a long dispute with Euler and d\'Alembert over whether such sums could represent any shape — a question Fourier\'s work finally answered.',
  sim: { id: 'so-pde', params: { mode: 'wave' } }
},

{
  id: 'heat-equation', parent: 'pdes', title: 'The heat (diffusion) equation', level: 3,
  short: 'The partial differential equation $u_t = \\alpha u_{xx}$: temperature — or the concentration of anything that diffuses — rises where the profile curves up and falls where it curves down, so every bump spreads out and fades.',
  keywords: ['heat equation', 'diffusion equation', 'thermal diffusivity', 'Fourier\'s law', 'diffusion', 'Fick\'s law', 'Gaussian', 'fundamental solution', 'separation of variables', 'decay of modes', 'maximum principle', 'square-root law', 'Brownian motion'],
  prereq: ['partial-derivatives', 'fourier-series', 'exponential-models'],
  related: ['wave-equation', 'laplace-equation', 'normal-distribution', 'physics:conduction', 'physics:newtons-law-of-cooling', 'physics:specific-heat'],
  body: `
Two facts give the heat equation. **Fourier's law**: heat flows from hot to cold at a rate proportional to the temperature gradient, $q = -k\\,\\partial u/\\partial x$ ([[physics:conduction|conduction]]). **Energy conservation**: a thin slice of a rod, of density $\\rho$ and specific heat $c$, warms up at a rate set by how much more heat flows in than out, $\\rho c\\,u_t\\,dx = q(x) - q(x + dx) = k\\,u_{xx}\\,dx$. Together:

$$\\frac{\\partial u}{\\partial t} = \\alpha\\,\\frac{\\partial^2 u}{\\partial x^2}, \\qquad \\alpha = \\frac{k}{\\rho c}$$

The **thermal diffusivity** $\\alpha$ (in m²/s) measures how quickly temperature differences even out: about $1.1\\times10^{-4}$ for copper, $1.2\\times10^{-5}$ for steel, $1.4\\times10^{-7}$ for water and meat. The rule is simple: where the temperature profile curves **up** (a cold dip) it warms, where it curves **down** (a hot peak) it cools. Everything smooths.

The same equation, with a diffusion coefficient $D$ in place of $\\alpha$, governs dye spreading in water, perfume in a room, dopant atoms in a silicon chip (Fick's law) — and, after a change of variables, the Black–Scholes model of option prices.

### How far, how fast: the square-root law
The only length you can build from $\\alpha$ and a time $t$ is $\\sqrt{\\alpha t}$. So heat spreads a distance of about $\\sqrt{\\alpha t}$ in time $t$: **twice as far takes four times as long**.
- Heat reaches the middle of a 2 cm steak (1 cm in) in roughly $L^2/\\alpha = (0.01)^2/1.4\\times10^{-7} \\approx 700$ s, about 12 minutes; a steak twice as thick takes about four times as long.
- A sugar molecule in still water ($D \\approx 5\\times10^{-10}$ m²/s) needs about two days to wander 1 cm — which is why you stir your tea.
- The daily swing of temperature penetrates soil only 10–20 cm, the yearly swing a few metres, which is why cellars stay at an even temperature all year.

### A spreading Gaussian
Put a pulse of heat $Q$ at $x = 0$. It spreads as

$$u(x, t) = \\frac{Q}{\\sqrt{4\\pi\\alpha t}}\\,e^{-x^2/4\\alpha t}$$

a bell curve — the [[normal-distribution|normal distribution]] — whose width $\\sigma = \\sqrt{2\\alpha t}$ grows as the square root of time while the area under it, the total heat, stays fixed. That is no coincidence: diffusion is the large-scale face of countless random molecular steps, as Einstein showed for Brownian motion in 1905.

### Modes that fade
For a rod of length $L$ with both ends held at 0, **separation of variables** gives modes $\\sin(n\\pi x/L)$, each decaying on its own:

$$u(x, t) = \\sum_{n=1}^{\\infty} b_n\\,\\sin\\frac{n\\pi x}{L}\\;e^{-\\alpha n^2\\pi^2 t/L^2}$$

with the $b_n$ from the [[fourier-series|Fourier series]] of the starting profile — the very problem for which Fourier invented his series. Mode $n$ dies $n^2$ times faster than the first: the tenth mode 100 times faster. Fine detail vanishes almost at once; soon only the smooth fundamental hump remains, shrinking steadily. If the ends are held at different temperatures the profile settles on a straight line, the steady solution of [[laplace-equation|Laplace's equation]].

### Unlike waves
- **Irreversible**: the heat equation forgets. Run it backwards and any tiny error explodes — you cannot un-mix milk from coffee.
- **Maximum principle**: no point ever gets hotter than the hottest starting or boundary temperature.
- **Infinitely fast, infinitely faint**: mathematically a pulse is felt everywhere at once, but so weakly that at everyday scales it makes no difference — the contrast with the finite speed of the [[wave-equation|wave equation]].
`,
  ideas: [
    '$u_t = \\alpha u_{xx}$: the rate of change is proportional to the curvature, so peaks sink and dips fill in.',
    'Diffusivity $\\alpha = k/\\rho c$; heat spreads a distance of about $\\sqrt{\\alpha t}$ — twice as far takes four times as long.',
    'A point pulse spreads as a Gaussian of width $\\sqrt{2\\alpha t}$.',
    'Fourier modes decay independently, mode n as $e^{-\\alpha n^2\\pi^2 t/L^2}$: fine detail disappears first.',
    'The process is irreversible, obeys a maximum principle, and ends in the steady state given by Laplace\'s equation.'
  ],
  pitfalls: [
    'Heat spreads at a steady speed — Diffusion distance grows like $\\sqrt t$, not $t$: quick over millimetres, painfully slow over metres.',
    'Diffusion can be run backwards like a film — The heat equation smooths and forgets. Backwards in time it magnifies every tiny error without limit.',
    'The best conductor always warms through fastest — What counts is the diffusivity $k/\\rho c$: a material that conducts well but stores a lot of heat per degree can still be slow.'
  ],
  derivation: {
    title: 'The heat equation from Fourier\'s law',
    steps: [
      { text: 'Fourier\'s law: the heat flux (W/m²) runs down the temperature gradient.', tex: 'q = -k\\,\\frac{\\partial u}{\\partial x}' },
      { text: 'Energy balance for a slice of thickness $dx$ and unit area: heat in minus heat out raises its temperature.', tex: '\\rho c\\,dx\\,\\frac{\\partial u}{\\partial t} = q(x) - q(x + dx) \\approx -\\frac{\\partial q}{\\partial x}\\,dx' },
      { text: 'Substitute Fourier\'s law (for constant $k$):', tex: '\\rho c\\,\\frac{\\partial u}{\\partial t} = k\\,\\frac{\\partial^2 u}{\\partial x^2}' },
      { text: 'Divide by $\\rho c$:', tex: '\\frac{\\partial u}{\\partial t} = \\alpha\\,\\frac{\\partial^2 u}{\\partial x^2}, \\qquad \\alpha = \\frac{k}{\\rho c}' }
    ]
  },
  formulas: [
    {
      name: 'Thermal diffusivity',
      expr: 'alpha = k/(rho*c)', tex: '\\alpha = \\frac{k}{\\rho c}',
      vars: {
        alpha: { name: 'thermal diffusivity', q: 'kinvisc', unit: 'mm²/s', tex: '\\alpha' },
        k: { name: 'thermal conductivity', q: 'thermcond', unit: 'W/(m·K)', value: 401 },
        rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 8960, tex: '\\rho' },
        c: { name: 'specific heat capacity', q: 'specificheat', unit: 'J/(kg·K)', value: 385 }
      },
      note: 'Starting values are for copper. Water: $k = 0.6$, $\\rho = 1000$, $c = 4186$, giving 0.14 mm²/s.',
      stories: { alpha: 'A material has conductivity {k}, density {rho} and specific heat {c}. What is its thermal diffusivity?' }
    },
    {
      name: 'Time for heat to diffuse a distance',
      expr: 't = L^2/alpha', tex: 't \\sim \\frac{L^2}{\\alpha}',
      vars: {
        t: { name: 'time scale', q: 'time', unit: 'min' },
        L: { name: 'distance', q: 'length', unit: 'cm', value: 1 },
        alpha: { name: 'thermal diffusivity', q: 'kinvisc', unit: 'mm²/s', value: 0.14, tex: '\\alpha' }
      },
      note: 'An order-of-magnitude estimate, not an exact time: it tells you how the time scales with size.',
      stories: { t: 'Roughly how long does heat take to reach {L} into meat with a diffusivity of {alpha}?' }
    },
    {
      name: 'Decay time of mode n in a rod',
      expr: 'tau = L^2/(alpha*pi^2*n^2)', tex: '\\tau_n = \\frac{L^2}{\\alpha\\,\\pi^2 n^2}',
      vars: {
        tau: { name: 'time for mode n to fall by a factor e', q: 'time', unit: 'min', tex: '\\tau_n' },
        L: { name: 'length of the rod', q: 'length', unit: 'm', value: 0.5 },
        alpha: { name: 'thermal diffusivity', q: 'kinvisc', unit: 'mm²/s', value: 12, tex: '\\alpha' },
        n: { name: 'mode number', int: true, value: 1 }
      },
      practice: { unknowns: ['tau', 'L'] }
    },
    {
      name: 'Width of a spreading pulse',
      expr: 'sigma = sqrt(2*alpha*t)', tex: '\\sigma = \\sqrt{2\\alpha t}',
      vars: {
        sigma: { name: 'width (standard deviation) of the pulse', q: 'length', unit: 'mm', tex: '\\sigma' },
        alpha: { name: 'diffusivity (or diffusion coefficient)', q: 'kinvisc', unit: 'mm²/s', value: 0.0005, tex: '\\alpha' },
        t: { name: 'time', q: 'time', unit: 'h', value: 1 }
      },
      note: 'Starting values: sugar in water, $D \\approx 5\\times10^{-10}$ m²/s. In an hour it spreads only about 2 mm.',
      stories: { sigma: 'A drop of dye with diffusion coefficient {alpha} is placed in still water. How wide has it spread after {t}?' }
    }
  ],
  examples: [
    {
      title: 'A steel rod forgets its wiggles',
      q: 'A steel rod 0.5 m long ($\\alpha = 1.2\\times10^{-5}$ m²/s) has its ends held at 0 °C and starts with a lumpy temperature profile. How quickly do the first and third modes fade?',
      steps: [
        { text: 'Decay time of mode 1:', tex: '\\tau_1 = \\frac{L^2}{\\alpha\\pi^2} = \\frac{0.25}{1.2\\times10^{-5}\\times 9.87} = 2110\\ \\mathrm{s} \\approx 35\\ \\mathrm{min}' },
        'Mode 3 decays 9 times faster: $\\tau_3 \\approx 3.9$ min.',
        'So after about 10 minutes the short-scale lumps are down to a few percent, while the broad hump takes an hour or two to go.'
      ],
      a: 'About 35 min for mode 1, 4 min for mode 3.'
    },
    {
      title: 'Why cellars are cool in summer',
      q: 'The ground surface temperature swings yearly, $T = \\bar T + A\\cos\\omega t$. In soil with $\\alpha = 5\\times10^{-7}$ m²/s, how deep does the swing reach?',
      steps: [
        { text: 'The heat equation has the decaying-wave solution', tex: 'u = A\\,e^{-x/\\delta}\\cos\\!\\left(\\omega t - \\frac{x}{\\delta}\\right), \\qquad \\delta = \\sqrt{\\frac{2\\alpha}{\\omega}}' },
        'For a yearly cycle $\\omega = 2\\pi/(3.16\\times10^7\\ \\mathrm{s}) = 1.99\\times10^{-7}\\ \\mathrm{s^{-1}}$, so $\\delta = \\sqrt{2 \\times 5\\times10^{-7}/1.99\\times10^{-7}} = 2.2$ m.',
        'At 4.5 m depth the swing is down to $e^{-2} \\approx 14\\%$ of the surface swing — and lags by about four months, so at that depth it is coldest in late spring and warmest in late autumn.'
      ],
      a: 'The yearly swing fades over a few metres (δ ≈ 2.2 m).'
    }
  ],
  quiz: [
    { q: 'Heat takes 10 minutes to diffuse 1 cm into a material. Roughly how long to diffuse 3 cm?', choices: ['30 min', '90 min', '17 min', '1000 min'], a: 1,
      why: 'Diffusion time grows as distance squared: $3^2 \\times 10 = 90$ minutes.' },
    { q: 'In a rod with both ends held at 0 °C, which Fourier mode of the temperature profile dies away fastest?', choices: ['The first', 'The highest', 'They all decay at the same rate', 'None of them decays'], a: 1,
      why: 'Mode $n$ decays like $e^{-\\alpha n^2\\pi^2 t/L^2}$: the higher the mode, the faster it fades.' },
    { q: 'Under the heat equation, a point inside a rod can become hotter than both the hottest starting temperature and the boundary temperatures.', a: false,
      why: 'The maximum principle forbids it: without heat sources, the maximum is always at the start or on the boundary.' },
    { q: 'Where a temperature profile curves upwards ($u_{xx} > 0$), the temperature there…', choices: ['rises', 'falls', 'stays the same', 'oscillates'], a: 0,
      why: '$u_t = \\alpha u_{xx} > 0$. A dip is warmer on both sides, so heat flows in and fills it.' },
    { q: 'For what value of $k$ does $u = e^{-kt}\\sin 2x$ solve $u_t = 3u_{xx}$?', answer: '12', vars: [],
      why: '$u_t = -ku$ and $u_{xx} = -4u$, so $-k = 3 \\times (-4)$: $k = 12$. Mode with wavenumber 2 decays at rate $\\alpha \\cdot 2^2$.' }
  ],
  applications: [
    'Heating and cooling of buildings, engines and electronics.',
    'Cooking, and the heat treatment of metals.',
    'Diffusion of dopants in semiconductor manufacturing, and of drugs through tissue.',
    'Smoothing and denoising of images, which runs a heat equation on the pixels.'
  ],
  history: 'Joseph Fourier derived the heat equation and solved it with his series in a memoir of 1807 and his book of 1822. Adolf Fick stated the same law for diffusing substances in 1855, and Albert Einstein linked diffusion to the random motion of molecules in 1905.',
  sim: { id: 'so-pde', params: { mode: 'heat' } }
},

{
  id: 'laplace-equation', parent: 'pdes', title: 'Laplace\'s equation', level: 3,
  short: 'The equation $\\nabla^2 u = 0$ of steady temperatures, electric potential in empty space, gravity outside masses and ideal fluid flow. Its solutions are as smooth as possible: each value is the average of its surroundings.',
  keywords: ['Laplace\'s equation', 'Laplacian', 'harmonic function', 'potential', 'steady state', 'boundary value problem', 'Dirichlet condition', 'Neumann condition', 'mean value property', 'maximum principle', 'Poisson\'s equation', 'relaxation method', 'Earnshaw\'s theorem'],
  prereq: ['partial-derivatives', 'heat-equation', 'divergence'],
  related: ['gradient', 'wave-equation', 'complex-plane', 'physics:electric-potential', 'physics:gauss-law', 'physics:gravitational-potential', 'physics:conduction'],
  body: `
$$\\nabla^2 u = \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} + \\frac{\\partial^2 u}{\\partial z^2} = 0$$

The **Laplacian** $\\nabla^2 u$ — the [[divergence|divergence]] of the [[gradient|gradient]] — measures how much the value of $u$ at a point differs from the average of $u$ around it. Laplace's equation says there is no difference at all: **every value is the average of its neighbours**. Functions that satisfy it are called **harmonic**.

### Where it comes from
- **Steady heat flow**: when the [[heat-equation|heat equation]] $u_t = \\alpha\\nabla^2 u$ has settled, $u_t = 0$.
- **Electrostatics**: with $\\vec E = -\\nabla V$, [[physics:gauss-law|Gauss's law]] gives $\\nabla^2 V = -\\rho/\\varepsilon_0$ (**Poisson's equation**), and in empty space $\\nabla^2 V = 0$ ([[physics:electric-potential|electric potential]]).
- **Gravity** outside the masses that produce it ([[physics:gravitational-potential|gravitational potential]]).
- **Ideal fluid flow**, incompressible and without swirl, where the velocity is the gradient of a potential.
- A **soap film** or rubber sheet stretched across a bent wire frame, when its slopes are small.

### Boundary values instead of initial values
There is no time in the equation, so there are no initial conditions. Instead you give **boundary conditions** all round the region: the values themselves (a fixed temperature or voltage — *Dirichlet*) or the outward slope (a fixed heat flux, or insulation — *Neumann*). With Dirichlet values given, the solution is **unique** — so any solution you can guess, by symmetry or cunning, is *the* solution. The method of images in electrostatics rests on this.

### Mean values and maxima
The average of a harmonic function over any circle (or sphere) equals its value at the centre. It follows that a harmonic function has **no maximum or minimum inside** its region: the extremes lie on the boundary. A steady temperature distribution has no hot spot in the middle without a heater there. And a charge placed in an electrostatic field made by other, fixed charges has no stable resting place, because the potential has no minimum in empty space — **Earnshaw's theorem**, which rules out holding a charge in place with static fields alone.

### Solving it
- In **one dimension**, $u'' = 0$: the solution is a straight line. The steady temperature through a uniform wall falls linearly from the warm face to the cold one.
- In **two dimensions**, separation of variables on a strip $0 < x < a$ gives solutions $\\sin(n\\pi x/a)\\,e^{-n\\pi y/a}$: a ripple of wavelength $\\lambda$ imposed along a boundary dies away as $e^{-2\\pi y/\\lambda}$ going inwards — by a factor of 500 within one wavelength. Fine detail on a boundary is invisible a short way off, which is why a wire-mesh Faraday cage shields almost as well as solid metal.
- The real and imaginary parts of smooth functions of a complex variable are harmonic — for example $x^2 - y^2$ and $e^x\\cos y$ — which makes [[complex-plane|complex numbers]] a powerful tool for two-dimensional problems.
- **Numerically**, the mean-value property is the method: lay a grid over the region, fix the boundary values, and repeatedly replace every interior value by the average of its four neighbours. This **relaxation** converges to the solution.
`,
  ideas: [
    '$\\nabla^2 u = 0$: each value equals the average of its surroundings.',
    'It governs steady heat flow and the potentials of electrostatics, gravity and ideal fluid flow in source-free regions.',
    'It needs boundary conditions, not initial conditions; given the boundary values, the solution is unique.',
    'Harmonic functions have their maxima and minima on the boundary — no hot spots inside, and no stable equilibrium for a charge.',
    'Detail imposed on a boundary fades within about one wavelength of it.'
  ],
  pitfalls: [
    'Laplace\'s equation needs initial conditions — There is no time in it. It needs conditions all round the boundary of the region.',
    'A steady temperature can peak in the middle of a plate — Only with a heat source there (then it obeys Poisson\'s equation). Without sources, the hottest point is on the edge.',
    'Laplace\'s equation and the Laplace transform are the same idea — Both are named after Laplace, but one is a PDE for steady fields and the other a tool for solving ODEs in time.'
  ],
  formulas: [
    {
      name: 'Steady temperature through a wall',
      expr: 'T = T1 + (T2 - T1)*x/L', tex: 'T = T_1 + (T_2 - T_1)\\,\\frac{x}{L}',
      vars: {
        T: { name: 'temperature at depth x', q: 'temperature', unit: '°C' },
        T1: { name: 'inner face temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        T2: { name: 'outer face temperature', q: 'temperature', unit: '°C', value: -5, tex: 'T_2' },
        x: { name: 'depth from the inner face', q: 'length', unit: 'cm', value: 10, min: 0, max: 30 },
        L: { name: 'thickness of the wall', q: 'length', unit: 'cm', value: 30 }
      },
      note: 'The one-dimensional Laplace equation $T\'\' = 0$: a straight line between the face temperatures.',
      practice: { unknowns: ['T', 'x'] },
      stories: { T: 'A wall {L} thick is at {T1} on the inside and {T2} outside. What is the temperature {x} in from the inside face?' }
    },
    {
      name: 'A boundary pattern fading inwards',
      expr: 'u = U*exp(-2*pi*y/lam)', tex: 'u = U\\,e^{-2\\pi y/\\lambda}',
      vars: {
        u: { name: 'amplitude of the pattern at distance y', q: 'voltage', unit: 'V' },
        U: { name: 'amplitude on the boundary', q: 'voltage', unit: 'V', value: 10 },
        y: { name: 'distance from the boundary', q: 'length', unit: 'mm', value: 2 },
        lam: { name: 'wavelength of the pattern', q: 'length', unit: 'mm', value: 5, tex: '\\lambda' }
      },
      note: 'A potential that varies like $\\sin(2\\pi x/\\lambda)$ along a boundary. One wavelength away it has shrunk by $e^{-2\\pi} \\approx 1/535$.',
      stories: { u: 'A grid of wires {lam} apart imposes a potential ripple of amplitude {U}. How large is the ripple {y} away from the grid?' }
    },
    {
      name: 'Relaxation: the discrete mean value',
      expr: 'u = (uE + uW + uN + uS)/4', tex: 'u_{i,j} = \\frac{u_E + u_W + u_N + u_S}{4}',
      vars: {
        u: { name: 'value at a grid point', tex: 'u_{i,j}', signed: true },
        uE: { name: 'east neighbour', tex: 'u_E', value: 10, signed: true },
        uW: { name: 'west neighbour', tex: 'u_W', value: 20, signed: true },
        uN: { name: 'north neighbour', tex: 'u_N', value: 30, signed: true },
        uS: { name: 'south neighbour', tex: 'u_S', value: 40, signed: true }
      },
      note: 'Sweep over the grid, replacing every interior value by this average, until nothing changes.',
      practice: { unknowns: ['u'] }
    }
  ],
  examples: [
    {
      title: 'Which functions are harmonic?',
      q: 'Which of $x^2 - y^2$, $x^2 + y^2$, $xy$ and $e^x\\sin y$ satisfy $u_{xx} + u_{yy} = 0$?',
      steps: [
        '$x^2 - y^2$: $2 - 2 = 0$. Harmonic.',
        '$x^2 + y^2$: $2 + 2 = 4$. Not harmonic — it has a minimum at the origin, which a harmonic function cannot have.',
        '$xy$: $0 + 0 = 0$. Harmonic.',
        '$e^x\\sin y$: $e^x\\sin y - e^x\\sin y = 0$. Harmonic (it is the imaginary part of $e^{x + iy}$).'
      ],
      a: 'All but x² + y².'
    },
    {
      title: 'Relaxation by hand',
      q: 'A square plate has its top edge held at 100 °C and the other three edges at 0 °C. On a grid with four interior points (two upper, two lower), find the steady temperatures.',
      steps: [
        'By symmetry the two upper points share a value $a$ and the two lower points a value $b$.',
        'Upper point: neighbours are the top edge (100), a side edge (0), the other upper point ($a$) and the point below ($b$): $a = (100 + 0 + a + b)/4$, so $3a - b = 100$.',
        'Lower point: neighbours $a$, $b$, 0 and 0: $b = (a + b)/4$, so $a = 3b$.',
        'Then $9b - b = 100$: $b = 12.5$ and $a = 37.5$.',
        'Check the symmetry argument: the average of the four is 25, a quarter of the way to 100 — as it must be, since rotating the problem four times and adding gives 100 on every edge.'
      ],
      a: 'Upper points 37.5 °C, lower points 12.5 °C.'
    }
  ],
  quiz: [
    { q: 'A function that satisfies Laplace\'s equation throughout a region has its largest value…', choices: ['somewhere inside', 'on the boundary', 'always at the centre', 'anywhere — no rule'], a: 1,
      why: 'Because each value is the average of the values around it, an interior maximum is impossible unless the function is constant.' },
    { q: 'Which function is harmonic, with $u_{xx} + u_{yy} = 0$?', choices: ['$x^2 + y^2$', '$x^2 - y^2$', '$x^3$', '$e^{x+y}$'], a: 1,
      why: '$2 + (-2) = 0$. The others give 4, $6x$ and $2e^{x+y}$.' },
    { q: 'A charged particle can rest in stable equilibrium in empty space in the electrostatic field of fixed charges elsewhere.', a: false,
      why: 'Earnshaw\'s theorem: the potential satisfies Laplace\'s equation there, so it has no minimum, and the particle can always escape in some direction.' },
    { q: 'In one dimension Laplace\'s equation reads $u\'\' = 0$. So the steady temperature through a uniform wall is…', choices: ['the same everywhere', 'a straight line between the two face temperatures', 'exponential', 'a parabola'], a: 1,
      why: 'Zero second derivative means constant slope: the temperature falls linearly through the wall.' },
    { q: 'On a relaxation grid a point has neighbours 10, 20, 30 and 40. What value satisfies the discrete Laplace equation there?', answer: '25', vars: [],
      why: 'The discrete version of $\\nabla^2 u = 0$ sets each value to the average of its four neighbours: $(10 + 20 + 30 + 40)/4 = 25$.' }
  ],
  applications: [
    'Electrostatics: fields around electrodes, capacitors and shielding.',
    'Steady heat conduction in walls, heat sinks and machine parts.',
    'Groundwater and ideal fluid flow around obstacles.',
    'Image editing: filling a hole smoothly from the surrounding pixels.'
  ],
  history: 'Pierre-Simon Laplace studied the equation for gravitational potentials in the 1780s, and Siméon Denis Poisson added the source term in 1813. George Green\'s essay of 1828 and later work by Gauss built the potential theory that underpins electrostatics.',
  sim: { id: 'so-pde', params: { mode: 'heat', shape: 'bump', TL: 1, TR: -0.5 } }
}

);
