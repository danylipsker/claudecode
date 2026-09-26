/* HYPER-MATH · content/derivative-applications.js — using derivatives: linked
 * rates, maxima and minima, sketching, approximation and root finding. */
Hyper.add(

{
  id: 'related-rates', parent: 'derivative-applications', title: 'Related rates', level: 2,
  short: 'When quantities are linked by an equation and change in time, differentiating the equation links their rates of change.',
  keywords: ['related rates', 'rates of change', 'ladder problem', 'balloon', 'conical tank', 'dV/dt', 'dr/dt', 'chain rule in time'],
  prereq: ['chain-rule', 'implicit-differentiation'],
  related: ['linear-approximation', 'volume', 'pythagorean-theorem', 'physics:speed-velocity', 'physics:continuity-equation', 'physics:ideal-gas-law'],
  body: `
Pump air into a spherical balloon at a steady rate and its radius grows, but more and more slowly: the same extra volume is spread over an ever larger surface. The volume and the radius are tied together by $V = \\tfrac43\\pi r^3$, and so their **rates** are tied together too. Differentiate both sides with respect to time, using the [[chain-rule|chain rule]] on the right:

$$\\frac{dV}{dt} = 4\\pi r^2\\,\\frac{dr}{dt}.$$

Blow in $100\\ \\mathrm{cm^3/s}$ when the radius is 10 cm, and the radius grows at $\\dfrac{100}{4\\pi\\cdot 100} = 0.080\\ \\mathrm{cm/s}$. At 20 cm it will grow four times more slowly.

### A recipe
1. **Draw a picture** and name every quantity that changes. Anything that varies in time is a variable, even if you are given its value at one instant.
2. **Write the equation** that links them (geometry, Pythagoras, similar triangles, a physical law).
3. **Differentiate with respect to time** $t$. Every variable $q$ produces its rate $dq/dt$.
4. **Only now substitute** the values at the instant you care about, and solve for the unknown rate.

Substituting before differentiating is the classic error: a quantity frozen at its current value has no rate of change.

### The sliding ladder
A 5 m ladder leans against a wall; its foot slides outward. With the foot at distance $x$ and the top at height $y$, Pythagoras gives $x^2 + y^2 = 25$. Differentiating in time: $2x\\,\\dot x + 2y\\,\\dot y = 0$, so
$$\\dot y = -\\frac{x}{y}\\,\\dot x.$$
The foot moving at a steady speed makes the top fall ever faster: as $y \\to 0$ the ratio $x/y$ blows up. (A real ladder leaves the wall before that, which is why this is a model and not a prediction.)

### Why it matters
Related rates are how physicists and engineers turn one measured rate into another:
- the [[physics:continuity-equation|continuity equation]] links the flow rate in a pipe to the speed at each cross-section;
- in a gas at constant temperature, $PV = $ const gives $\\dot P = -\\dfrac{P}{V}\\dot V$, the rate at which pressure rises as a piston moves;
- radar measures how fast the distance to an aircraft changes, and geometry converts that into the aircraft's ground speed;
- the level in a conical funnel or a spherical tank rises at a rate that depends on how full it is, because the cross-section changes (calculator below).
`,
  ideas: [
    'If quantities are linked by an equation, their rates of change are linked by its time derivative.',
    'Differentiate first, substitute the instantaneous values afterwards.',
    'Every changing quantity gets its own rate symbol, such as dr/dt or ẋ.',
    'The same input rate can produce very different output rates depending on the current state (radius, depth, angle).'
  ],
  pitfalls: [
    'Plugging in r = 10 and then differentiating — r = 10 is true at one instant only; a constant has zero derivative. Differentiate the general relation first.',
    'A steady input rate means a steady output rate — Filling a cone at a steady volume rate makes the level rise quickly at first and slowly later.',
    'Ignoring signs — A distance that is shrinking has a negative rate; keep the sign to know which way things move.'
  ],
  formulas: [
    {
      name: 'Inflating a sphere',
      expr: 'Q = 4*pi*r^2*u', tex: 'Q = 4\\pi r^2\\,\\dot{r}',
      vars: {
        Q: { name: 'volume flow into the balloon', q: 'flowrate', unit: 'cm³/s', value: 100 },
        r: { name: 'radius', q: 'length', unit: 'cm', value: 10 },
        u: { name: 'rate of growth of the radius', tex: '\\dot{r}', q: 'speed', unit: 'cm/s' }
      },
      solveFor: 'u',
      stories: {
        u: 'Air is pumped into a spherical balloon at {Q}. How fast is the radius growing when it is {r}?',
        r: 'A balloon is inflated at {Q}. At what radius does the radius grow at only {u}?'
      }
    },
    {
      name: 'The sliding ladder',
      expr: 'v = x*u/sqrt(L^2 - x^2)', tex: 'v = \\frac{x\\,u}{\\sqrt{L^2 - x^2}}',
      vars: {
        v: { name: 'speed at which the top slides down', q: 'speed', unit: 'm/s' },
        x: { name: 'distance of the foot from the wall', q: 'length', unit: 'm', value: 3 },
        u: { name: 'speed at which the foot moves out', q: 'speed', unit: 'm/s', value: 0.5 },
        L: { name: 'length of the ladder', q: 'length', unit: 'm', value: 5 }
      },
      note: 'From $x^2 + y^2 = L^2$ differentiated in time, with $y = \\sqrt{L^2 - x^2}$. Valid while the top touches the wall ($x < L$).',
      stories: { v: 'A {L} ladder slides with its foot moving away from the wall at {u}. How fast is the top sliding down when the foot is {x} from the wall?' }
    },
    {
      name: 'Filling a conical tank (point down)',
      expr: 'w = Q/(pi*k^2*h^2)', tex: '\\dot{h} = \\frac{Q}{\\pi k^2 h^2}',
      vars: {
        w: { name: 'rate at which the level rises', tex: '\\dot{h}', q: 'speed', unit: 'cm/s' },
        Q: { name: 'inflow', q: 'flowrate', unit: 'L/s', value: 33.3 },
        k: { name: 'ratio of radius to height of the cone', value: 0.5 },
        h: { name: 'depth of water', q: 'length', unit: 'm', value: 3 }
      },
      note: 'The water forms a cone of radius $kh$, so $V = \\tfrac13\\pi k^2 h^3$ and $\\dot V = \\pi k^2 h^2\\,\\dot h$.',
      stories: { w: 'A conical tank, point down, has radius-to-height ratio {k}. Water flows in at {Q}. How fast does the level rise when the water is {h} deep?' }
    }
  ],
  examples: [
    {
      title: 'The sliding ladder',
      q: 'A 5 m ladder leans against a wall. Its foot slides away at 0.5 m/s. How fast is the top sliding down when the foot is 3 m from the wall?',
      steps: [
        'Variables: foot distance $x(t)$, top height $y(t)$, linked by $x^2 + y^2 = 25$.',
        'Differentiate in time: $2x\\dot x + 2y \\dot y = 0$.',
        'Now substitute: at $x = 3$, $y = \\sqrt{25 - 9} = 4$, and $\\dot x = 0.5$. So $\\dot y = -\\dfrac{3 \\times 0.5}{4} = -0.375\\ \\mathrm{m/s}$.',
        'The minus sign says the height is decreasing.'
      ],
      a: 'The top slides down at 0.375 m/s.'
    },
    {
      title: 'Filling a cone',
      q: 'A conical tank, point down, is 4 m tall with a top radius of 2 m. Water flows in at 2 m³/min. How fast is the level rising when the water is 3 m deep?',
      steps: [
        'By similar triangles the water surface has radius $r = h/2$, so $V = \\tfrac13\\pi r^2 h = \\dfrac{\\pi h^3}{12}$.',
        'Differentiate in time: $\\dot V = \\dfrac{\\pi h^2}{4}\\,\\dot h$.',
        'Substitute $\\dot V = 2$, $h = 3$: $\\dot h = \\dfrac{4 \\times 2}{9\\pi} = 0.283\\ \\mathrm{m/min}$.',
        'At $h = 1$ m it would be $2.55$ m/min: nine times faster, because the surface is nine times smaller.'
      ],
      a: 'About 0.28 m/min (28 cm per minute).'
    },
    {
      title: 'A ripple on a pond',
      q: 'A circular ripple spreads at 0.3 m/s. How fast is the disturbed area growing when the radius is 2 m?',
      steps: [
        '$A = \\pi r^2$, so $\\dot A = 2\\pi r\\,\\dot r$.',
        '$\\dot A = 2\\pi \\times 2 \\times 0.3 = 1.2\\pi = 3.77\\ \\mathrm{m^2/s}$.',
        'The rate is the circumference times the speed of the edge: the new area is a thin ring.'
      ],
      a: 'About 3.8 m²/s.'
    }
  ],
  quiz: [
    { q: 'A spherical balloon is inflated at a constant volume rate. As it grows, its radius increases…', choices: ['at a constant rate', 'faster and faster', 'more and more slowly', 'first slowly, then quickly'], a: 2,
      why: '$\\dot r = \\dot V/(4\\pi r^2)$: with $\\dot V$ fixed, a larger $r$ means a smaller $\\dot r$.' },
    { q: 'In a related-rates problem, when should you substitute the values at the given instant?', choices: ['Before writing the equation', 'Before differentiating', 'After differentiating', 'It makes no difference'], a: 2,
      why: 'Substituting first freezes quantities that are really changing, and their rates would then (wrongly) come out as zero.' },
    { q: 'If the foot of a sliding ladder moves out at a constant speed, the top slides down at a constant speed too.', a: false,
      why: '$\\dot y = -(x/y)\\dot x$, and $x/y$ grows as the ladder falls, so the top speeds up.' },
    { q: 'A square has side $s$ growing at 1 unit per second. Write $dA/dt$ as an expression in $s$.', answer: '2s', vars: ['s'],
      why: '$A = s^2$, so $\\dot A = 2s\\,\\dot s = 2s \\times 1$.' }
  ],
  applications: [
    'Tank and reservoir levels from inflow rates.',
    'Radar and sonar: converting the rate of change of range into speed.',
    'Thermodynamics: how fast pressure or temperature change as a gas is compressed.'
  ]
},

{
  id: 'extrema', parent: 'derivative-applications', title: 'Maxima and minima', level: 2,
  short: 'Finding the highest and lowest values of a function: critical points where the derivative is zero or undefined, the first- and second-derivative tests, and endpoints.',
  keywords: ['maximum', 'minimum', 'extremum', 'extrema', 'critical point', 'stationary point', 'local maximum', 'global maximum', 'first derivative test', 'second derivative test', 'closed interval method'],
  prereq: ['derivative', 'higher-derivatives', 'continuity'],
  related: ['optimization', 'curve-sketching', 'lagrange-multipliers', 'physics:static-equilibrium', 'physics:conservative-forces'],
  body: `
At the top of a smooth hill the ground is momentarily level. That simple observation is the key to finding maxima and minima: at a smooth peak or valley the tangent is horizontal, so

$$f'(c) = 0.$$

Points where $f'(c) = 0$, or where $f'$ does not exist, are called **critical points**. Every local maximum or minimum inside an interval is a critical point. The converse fails: $x^3$ has $f'(0) = 0$ but just flattens out for a moment and keeps climbing.

### Local or global?
A **local** maximum is higher than everything *nearby*; a **global** maximum is the highest of all. A mountain range has many local peaks and one summit.

### Classifying a critical point
- **First-derivative test.** Watch the sign of $f'$ as you pass through $c$. From $+$ to $-$: the function rises then falls, a **maximum**. From $-$ to $+$: a **minimum**. No change: neither.
- **Second-derivative test.** If $f'(c) = 0$ and $f''(c) < 0$ the graph is a cap there, a maximum; if $f''(c) > 0$ it is a cup, a minimum. If $f''(c) = 0$ the test is silent and you must look closer.

### The closed-interval method
On a closed interval $[a, b]$ a continuous function always has a global maximum and minimum (the extreme value theorem, see [[continuity]]). They occur either at critical points or at the **endpoints**. So:
1. find the critical points inside $(a, b)$;
2. evaluate $f$ at them and at $a$ and $b$;
3. the largest value is the global maximum, the smallest the global minimum.

For $f(x) = x^3 - 3x$ on $[-2, 3]$: $f'(x) = 3x^2 - 3 = 0$ at $x = \\pm 1$. The candidates give $f(-2) = -2$, $f(-1) = 2$, $f(1) = -2$, $f(3) = 18$. The global maximum is $18$, at the endpoint $x = 3$, even though $x = -1$ is a local maximum. The global minimum $-2$ is reached twice.

### Physics: equilibrium and stability
A ball rolling on a landscape of potential energy $U(x)$ feels a force $F = -dU/dx$. At a critical point of $U$ the force vanishes: an **equilibrium**. At a minimum of $U$ ($U'' > 0$) any small push creates a force back towards the bottom: **stable** equilibrium, like a pendulum hanging down. At a maximum ($U'' < 0$) a push grows: **unstable**, like a pencil on its tip. The size of $U''$ at a minimum even sets how fast things oscillate about it: near the minimum the system behaves like a spring of stiffness $k = U''$ ([[physics:simple-harmonic-motion|simple harmonic motion]]).
`,
  ideas: [
    'At a smooth interior maximum or minimum, f′ = 0.',
    'Critical points (f′ = 0 or undefined) are only candidates: check them.',
    'First-derivative test: + to − is a maximum, − to + a minimum.',
    'Second-derivative test: f″ < 0 maximum, f″ > 0 minimum, f″ = 0 inconclusive.',
    'On a closed interval, compare the critical points with the endpoints.'
  ],
  pitfalls: [
    'f′(c) = 0 means c is a maximum or minimum — x³ has f′(0) = 0 and neither: the sign of f′ does not change.',
    'The global maximum must be where f′ = 0 — On a closed interval it can sit at an endpoint, where the slope need not be zero.',
    'If f″(c) = 0 there is no extremum — The test is merely inconclusive: x⁴ has f″(0) = 0 and a minimum at 0.'
  ],
  formulas: [
    {
      name: 'Vertex of a parabola ax² + bx + c',
      expr: 'x = -b/(2*a)', tex: 'x = -\\frac{b}{2a}',
      vars: {
        x: { name: 'position of the maximum or minimum', signed: true },
        a: { name: 'coefficient of x²', value: 1, signed: true },
        b: { name: 'coefficient of x', value: -6, signed: true }
      },
      note: 'From $f\'(x) = 2ax + b = 0$. A minimum if $a > 0$, a maximum if $a < 0$.'
    },
    {
      name: 'Critical points of a cubic ax³ + bx² + cx + d',
      expr: '3*a*x^2 + 2*b*x + c = 0', tex: '3a\\,x^2 + 2b\\,x + c = 0', solveFor: 'x',
      vars: {
        x: { name: 'critical point', signed: true },
        a: { name: 'coefficient of x³', value: 1, signed: true },
        b: { name: 'coefficient of x²', value: 0, signed: true },
        c: { name: 'coefficient of x', value: -3, signed: true }
      },
      note: 'Setting the derivative to zero gives a quadratic: two critical points, one or none. The defaults are $x^3 - 3x$, with critical points $\\pm 1$.'
    }
  ],
  examples: [
    {
      title: 'The closed-interval method',
      q: 'Find the global maximum and minimum of $f(x) = x^3 - 3x$ on $[-2, 3]$.',
      steps: [
        '$f\'(x) = 3x^2 - 3 = 0$ gives $x = -1$ and $x = 1$, both inside the interval.',
        'Evaluate: $f(-2) = -2$, $f(-1) = 2$, $f(1) = -2$, $f(3) = 18$.',
        'Largest: 18 at $x = 3$ (an endpoint). Smallest: $-2$, at $x = -2$ and $x = 1$.'
      ],
      a: 'Maximum 18 at x = 3; minimum −2 at x = −2 and x = 1.'
    },
    {
      title: 'The second-derivative test',
      q: 'Find and classify the critical points of $f(x) = x e^{-x}$.',
      steps: [
        'Product rule: $f\'(x) = e^{-x} - x e^{-x} = (1 - x)e^{-x}$, which is zero only at $x = 1$.',
        'Again: $f\'\'(x) = -e^{-x} - (1 - x)e^{-x} = (x - 2)e^{-x}$, so $f\'\'(1) = -e^{-1} < 0$.',
        'A local maximum, of height $f(1) = 1/e \\approx 0.368$. It is also the global maximum, since $f\'$ is positive before and negative after.'
      ],
      a: 'A maximum at x = 1, value 1/e ≈ 0.368.'
    },
    {
      title: 'A double well',
      q: 'A particle moves in the potential $U(x) = x^4 - 2x^2$ (in joules, $x$ in metres). Where are its equilibria, and which are stable?',
      steps: [
        '$U\'(x) = 4x^3 - 4x = 4x(x - 1)(x + 1)$: equilibria at $x = -1, 0, 1$.',
        '$U\'\'(x) = 12x^2 - 4$: $U\'\'(0) = -4 < 0$ (a maximum of $U$: unstable), $U\'\'(\\pm 1) = 8 > 0$ (minima: stable).',
        'Physically: two valleys separated by a hump, as in a molecule that can flip between two shapes.'
      ],
      a: 'Stable at x = ±1, unstable at x = 0.'
    }
  ],
  quiz: [
    { q: 'If $f\'(c) = 0$, then at $x = c$ the function…', choices: ['has a maximum', 'has a minimum', 'has a horizontal tangent, which may or may not be an extremum', 'is zero'], a: 2,
      why: 'A zero derivative only guarantees a horizontal tangent. $x^3$ at 0 shows it need not be a maximum or minimum.' },
    { q: 'A continuous function on a closed interval always has a global maximum and a global minimum.', a: true,
      why: 'That is the extreme value theorem. On open intervals or for discontinuous functions it can fail.' },
    { q: 'For $f(x) = x^3$, the point $x = 0$ is…', choices: ['a local maximum', 'a local minimum', 'a critical point that is not an extremum', 'not a critical point'], a: 2,
      why: '$f\'(0) = 0$, so it is critical, but $f\'$ is positive on both sides: the graph keeps rising.' },
    { q: 'Where is the minimum of $x^2 - 6x + 1$? Type the value of $x$.', answer: '3', vars: [],
      why: '$f\'(x) = 2x - 6 = 0$ at $x = 3$, and $f\'\' = 2 > 0$ confirms a minimum.' },
    { q: 'On a closed interval, the global maximum of a differentiable function can occur…', choices: ['only where f′ = 0', 'only at an endpoint', 'at a critical point or at an endpoint', 'only where f″ < 0'], a: 2,
      why: 'Interior extrema are critical points, but the maximum may simply be at the edge, where the function is still climbing.' }
  ],
  applications: [
    'Stable and unstable equilibria of mechanical systems and molecules.',
    'The best launch angle, the maximum height of a projectile, peak power transfer in a circuit.',
    'Every optimisation problem in engineering and economics starts here.'
  ],
  sim: { id: 'calc-derivative-grapher', params: { fn: 'x^3 - 3x' } }
},

{
  id: 'optimization', parent: 'derivative-applications', title: 'Optimization', level: 2,
  short: 'Turning a real question — the biggest volume, the least material, the shortest time — into a function of one variable and finding its best value with derivatives.',
  keywords: ['optimisation', 'optimization', 'maximise', 'minimise', 'open box', 'least material', 'can design', 'Fermat principle', 'constraint', 'word problem'],
  prereq: ['extrema', 'functions'],
  related: ['lagrange-multipliers', 'newtons-method', 'curve-sketching', 'physics:refraction', 'physics:projectile-motion'],
  body: `
Calculus earns its keep when you want the *best* of something: the strongest beam from a log, the cheapest can for a given volume, the path of least time. The derivative finds the best value; the real work is in setting up the function.

### A recipe
1. **Name the quantity to optimise** (volume, cost, time) and the variables it depends on.
2. **Use the constraint** (fixed perimeter, fixed volume, fixed sheet size) to write everything in terms of **one** variable.
3. **State the domain**: which values make physical sense?
4. **Find the critical points** by solving $f'(x) = 0$.
5. **Check** them against the endpoints of the domain ([[extrema|closed-interval method]]) or with the second derivative.
6. **Answer the question** in words and units, and sanity-check it.

### The open box
Cut equal squares of side $x$ from the corners of a square sheet of side $s$ and fold up the sides. The box has volume
$$V(x) = x\\,(s - 2x)^2, \\qquad 0 \\le x \\le s/2.$$
Both ends of the domain give $V = 0$: no height, or no base. In between,
$$V'(x) = (s - 2x)^2 - 4x(s - 2x) = (s - 2x)(s - 6x) = 0$$
at $x = s/2$ (the useless end) or $x = s/6$. So cut one sixth of the side. For a 30 cm sheet: $x = 5$ cm and $V = 5 \\times 20^2 = 2000\\ \\mathrm{cm^3}$, two litres. The simulation lets you try rectangular sheets too.

### The cheapest can
A closed cylinder must hold a volume $V$. Its surface area (the metal) is $S = 2\\pi r^2 + 2\\pi r h$, and the constraint $V = \\pi r^2 h$ gives $h = V/(\\pi r^2)$, so
$$S(r) = 2\\pi r^2 + \\frac{2V}{r}, \\qquad S'(r) = 4\\pi r - \\frac{2V}{r^2} = 0 \\;\\Rightarrow\\; r^3 = \\frac{V}{2\\pi}.$$
Then $h = V/(\\pi r^2) = 2r$: the least metal is used when the **height equals the diameter**. For 330 ml, $r = 3.74$ cm and $h = 7.49$ cm. Real drink cans are taller and slimmer; their ends are made of much thicker metal than the walls, and once that extra cost is included the best shape shifts towards narrower ends.

### Nature optimises too
Light travelling from air into water bends so as to take the **least time** (Fermat's principle). A lifeguard running on sand and swimming in the sea faces the same problem. If the time is
$$T(x) = \\frac{\\sqrt{a^2 + x^2}}{v_1} + \\frac{\\sqrt{b^2 + (d - x)^2}}{v_2},$$
setting $T'(x) = 0$ gives $\\dfrac{\\sin\\theta_1}{v_1} = \\dfrac{\\sin\\theta_2}{v_2}$ — which is [[physics:refraction|Snell's law of refraction]]. Soap films minimise area, hanging chains minimise potential energy, and a projectile's range is greatest at 45° because $\\dfrac{d}{d\\theta}\\sin 2\\theta = 0$ there ([[physics:projectile-motion|projectile motion]]).
`,
  ideas: [
    'Write the quantity to optimise as a function of a single variable, using the constraint.',
    'Decide the physically sensible domain before differentiating.',
    'Solve f′ = 0, then compare with the endpoints or use the second derivative.',
    'For a square sheet the best open box cuts one sixth of the side; the cheapest closed can has height equal to its diameter.',
    'Snell\'s law of refraction is the answer to a minimum-time problem.'
  ],
  pitfalls: [
    'Stopping at f′ = 0 — A critical point could be a minimum when you wanted a maximum, or lie outside the physical domain. Check.',
    'Optimising a function of two variables directly — Use the constraint to eliminate one variable first (or use Lagrange multipliers).',
    'Forgetting the endpoints — Sometimes the best choice is an extreme one: all running, or all swimming.'
  ],
  formulas: [
    {
      name: 'Open box from a square sheet',
      expr: 'V = x*(s - 2*x)^2', tex: 'V = x\\,(s - 2x)^2', solveFor: 'V',
      vars: {
        V: { name: 'volume of the box', q: 'volume', unit: 'cm³' },
        x: { name: 'side of the squares cut out', q: 'length', unit: 'cm', value: 4 },
        s: { name: 'side of the sheet', q: 'length', unit: 'cm', value: 30 }
      },
      note: 'The volume is largest when $x = s/6$, giving $V_{\\max} = 2s^3/27$. Most volumes below the maximum can be reached with two different cuts.',
      stories: { V: 'Squares of side {x} are cut from the corners of a {s} square sheet, and the sides are folded up. What is the volume of the box?' }
    },
    {
      name: 'Radius of the least-material closed can',
      expr: 'r = (Vc/(2*pi))^(1/3)', tex: 'r = \\left(\\frac{V}{2\\pi}\\right)^{1/3}',
      vars: {
        r: { name: 'best radius', q: 'length', unit: 'cm' },
        Vc: { name: 'volume to hold', tex: 'V', q: 'volume', unit: 'cm³', value: 330 }
      },
      note: 'The height is then $h = 2r$ and the metal area is $S = 6\\pi r^2$.',
      stories: { r: 'A closed cylindrical tin must hold {Vc}. What radius uses the least metal?' }
    }
  ],
  examples: [
    {
      title: 'Fencing beside a river',
      q: 'A farmer has 100 m of fence to enclose a rectangular field against a straight river (no fence needed along the river). What is the largest area?',
      steps: [
        'Let $x$ be the length of each side perpendicular to the river. The side parallel to it is $100 - 2x$.',
        'Area: $A(x) = x(100 - 2x) = 100x - 2x^2$, for $0 \\le x \\le 50$.',
        '$A\'(x) = 100 - 4x = 0$ at $x = 25$; $A\'\' = -4 < 0$, a maximum. The endpoints give $A = 0$.',
        'The field is 25 m by 50 m, with area $1250\\ \\mathrm{m^2}$: twice as long as it is deep.'
      ],
      a: '1250 m² (25 m × 50 m)'
    },
    {
      title: 'The open box',
      q: 'Squares are cut from the corners of a 30 cm × 30 cm sheet to make an open box. Which cut gives the largest volume?',
      steps: [
        '$V(x) = x(30 - 2x)^2$ for $0 \\le x \\le 15$.',
        '$V\'(x) = (30 - 2x)(30 - 6x) = 0$ at $x = 15$ (no base) or $x = 5$.',
        '$V(5) = 5 \\times 20^2 = 2000\\ \\mathrm{cm^3}$, while the endpoints give 0.'
      ],
      a: 'Cut 5 cm squares: V = 2000 cm³.'
    },
    {
      title: 'The least-metal can',
      q: 'What dimensions minimise the surface area of a closed cylinder holding 330 cm³?',
      steps: [
        '$S(r) = 2\\pi r^2 + \\dfrac{660}{r}$ (using $h = 330/(\\pi r^2)$).',
        '$S\'(r) = 4\\pi r - \\dfrac{660}{r^2} = 0$ gives $r^3 = \\dfrac{330}{2\\pi} = 52.5$, so $r = 3.74$ cm.',
        '$h = 2r = 7.49$ cm, and $S = 6\\pi r^2 = 264\\ \\mathrm{cm^2}$. $S\'\'(r) = 4\\pi + 1320/r^3 > 0$ confirms a minimum.'
      ],
      a: 'r ≈ 3.74 cm, h ≈ 7.49 cm (height = diameter), S ≈ 264 cm².'
    }
  ],
  quiz: [
    { q: 'Of all rectangles with a given perimeter, the one with the largest area is…', choices: ['a square', 'twice as long as it is wide', 'as long and thin as possible', 'any of them: the area is fixed'], a: 0,
      why: 'With perimeter $P$ and side $x$, $A = x(P/2 - x)$, largest at $x = P/4$: all sides equal.' },
    { q: 'You found a critical point of the function to be maximised. What else must you do?', choices: ['Nothing', 'Check it is a maximum and compare with the endpoints of the domain', 'Differentiate again and set that to zero', 'Check that f is positive there'], a: 1,
      why: 'Critical points can be minima or lie outside the sensible domain, and the best value may be at an endpoint.' },
    { q: 'The closed cylinder that holds a given volume with the least surface area has its height equal to its diameter.', a: true,
      why: 'Minimising $S = 2\\pi r^2 + 2V/r$ gives $r^3 = V/2\\pi$ and then $h = V/\\pi r^2 = 2r$.' },
    { q: 'A rectangle has perimeter 20 and one side $x$. Write its area as an expression in $x$.', answer: 'x(10 - x)', vars: ['x'],
      why: 'The other side is $(20 - 2x)/2 = 10 - x$, so $A = x(10 - x)$, largest at $x = 5$.' },
    { q: 'For an open box cut from a square sheet of side $s$, the best cut is…', choices: ['$s/4$', '$s/6$', '$s/3$', '$s/8$'], a: 1,
      why: '$V\'(x) = (s - 2x)(s - 6x)$ vanishes inside the domain only at $x = s/6$.' }
  ],
  applications: [
    'Packaging and structural design: most volume or strength for the least material.',
    'Optics and mechanics: Fermat\'s principle, least potential energy, least action.',
    'Economics and operations: maximum profit, minimum cost, best stock levels.'
  ],
  sim: 'calc-open-box'
},

{
  id: 'curve-sketching', parent: 'derivative-applications', title: 'Curve sketching', level: 2,
  short: 'Drawing an accurate graph from the formula: domain, intercepts, symmetry, asymptotes, and what the first and second derivatives say about rising, falling and bending.',
  keywords: ['curve sketching', 'graph a function', 'increasing', 'decreasing', 'concavity', 'inflection point', 'sign chart', 'asymptote', 'symmetry'],
  prereq: ['extrema', 'higher-derivatives', 'limits-at-infinity'],
  related: ['rational-functions', 'polynomials', 'function-transformations', 'functions'],
  body: `
A graphing calculator draws a curve in an instant, but it can hide what matters: an asymptote just off screen, a tiny wiggle, a behaviour far away. Sketching by hand from the derivatives tells you *why* the graph looks the way it does and makes sure you have not missed anything.

### A checklist
1. **Domain.** Where is $f$ defined? Look for division by zero, square roots of negatives, logs of non-positive numbers.
2. **Intercepts.** $f(0)$ gives the $y$-intercept; solving $f(x) = 0$ gives the $x$-intercepts.
3. **Symmetry.** Even ($f(-x) = f(x)$, mirror in the $y$-axis) or odd ($f(-x) = -f(x)$, symmetric through the origin)? Periodic?
4. **Asymptotes.** Vertical ones where $f$ blows up; horizontal or slanted ones from [[limits-at-infinity|limits at infinity]].
5. **First derivative.** Where $f' > 0$ the graph rises, where $f' < 0$ it falls; critical points are the candidate peaks and valleys.
6. **Second derivative.** Where $f'' > 0$ the graph is concave up, where $f'' < 0$ concave down; sign changes are inflection points.
7. **Plot** the key points and join them, respecting all of the above.

### A worked sketch: $f(x) = \\dfrac{x}{1 + x^2}$
- Defined everywhere; passes through the origin; **odd**, so the left half is the right half rotated by 180°.
- As $x \\to \\pm\\infty$, $f(x) \\to 0$: the $x$-axis is a horizontal asymptote.
- $f'(x) = \\dfrac{1 - x^2}{(1 + x^2)^2}$, zero at $x = \\pm 1$. Positive between them, negative outside: a **minimum** $f(-1) = -\\tfrac12$ and a **maximum** $f(1) = \\tfrac12$.
- $f''(x) = \\dfrac{2x(x^2 - 3)}{(1 + x^2)^3}$, zero at $x = 0$ and $x = \\pm\\sqrt 3 \\approx \\pm 1.73$: three **inflection points**.

The resulting shape — rising through the origin, peaking at $(1, \\tfrac12)$, then sagging back towards the axis — turns up in physics too: in suitable units it is the part of a driven, damped oscillator's response that stays in step with the drive, as the driving frequency is swept through resonance.

### Reading a sign chart
| Interval | $f'$ | $f''$ | Shape |
|---|---|---|---|
| $x < -\\sqrt3$ | $-$ | $-$ | falling, concave down |
| $-\\sqrt3 < x < -1$ | $-$ | $+$ | falling, concave up |
| $-1 < x < 0$ | $+$ | $+$ | rising, concave up |
| $0 < x < 1$ | $+$ | $-$ | rising, concave down |
| $1 < x < \\sqrt 3$ | $-$ | $-$ | falling, concave down |
| $x > \\sqrt 3$ | $-$ | $+$ | falling, concave up |

> [!tip] In the simulation choose **Your formula** and type \`x/(1 + x^2)\`, then tick **f″**: the circles and diamonds sit exactly where this table changes.
`,
  ideas: [
    'Domain, intercepts, symmetry and asymptotes give the skeleton of a graph.',
    'The sign of f′ tells you where the graph rises and falls.',
    'The sign of f″ tells you how it bends; sign changes of f″ are inflection points.',
    'A sign chart of f′ and f″ over intervals summarises the whole shape.'
  ],
  pitfalls: [
    'At an inflection point f′ changes sign — It is f″ that changes sign there; f′ usually just reaches a peak or valley of its own.',
    'Concave down means decreasing — √x is concave down and increasing. Rising/falling and bending are independent.',
    'Plotting a few points is enough — Points between samples can hide peaks, asymptotes and wiggles; the derivatives tell you what happens in between.'
  ],
  formulas: [
    {
      name: 'Inflection point of a cubic ax³ + bx² + cx + d',
      expr: 'x = -b/(3*a)', tex: 'x = -\\frac{b}{3a}',
      vars: {
        x: { name: 'position of the inflection point', signed: true },
        a: { name: 'coefficient of x³', value: 1, signed: true },
        b: { name: 'coefficient of x²', value: -3, signed: true }
      },
      note: 'From $f\'\'(x) = 6ax + 2b = 0$. Every cubic has exactly one inflection point, and the graph is symmetric about it (rotated by 180°).'
    }
  ],
  examples: [
    {
      title: 'Sketching a cubic',
      q: 'Sketch $f(x) = x^3 - 3x^2 - 9x + 5$: find its turning points and its inflection point.',
      steps: [
        '$f\'(x) = 3x^2 - 6x - 9 = 3(x - 3)(x + 1)$: critical points at $x = -1$ and $x = 3$.',
        '$f\'$ is positive for $x < -1$, negative between, positive for $x > 3$: a maximum $f(-1) = -1 - 3 + 9 + 5 = 10$ and a minimum $f(3) = 27 - 27 - 27 + 5 = -22$.',
        '$f\'\'(x) = 6x - 6$: concave down for $x < 1$, up for $x > 1$, inflection at $(1, -6)$, exactly halfway between the turning points.',
        'The curve comes up from $-\\infty$, peaks at $(-1, 10)$, bends through $(1, -6)$, bottoms out at $(3, -22)$ and climbs to $+\\infty$.'
      ],
      a: 'Maximum (−1, 10), minimum (3, −22), inflection (1, −6).'
    },
    {
      title: 'An exponential shape',
      q: 'Describe the graph of $f(x) = x e^{-x}$ for $x \\ge 0$.',
      steps: [
        '$f(0) = 0$ and $f(x) \\to 0$ as $x \\to \\infty$ (the exponential wins), so the positive $x$-axis is an asymptote.',
        '$f\'(x) = (1 - x)e^{-x}$: rising until $x = 1$, falling after, peak $1/e \\approx 0.37$.',
        '$f\'\'(x) = (x - 2)e^{-x}$: concave down until $x = 2$, concave up after, inflection at $(2, 2e^{-2}) \\approx (2, 0.27)$.',
        'The shape of a quick rise and slow tail, like the response of a critically damped system or a drug concentration after a dose.'
      ],
      a: 'Peak (1, 0.37), inflection (2, 0.27), tail towards 0.'
    }
  ],
  quiz: [
    { q: 'On an interval where $f\' > 0$ and $f\'\' < 0$, the graph is…', choices: ['rising and bending upwards', 'rising and bending downwards', 'falling and bending upwards', 'falling and bending downwards'], a: 1,
      why: 'Positive slope means rising; negative $f\'\'$ means the slope is decreasing, a cap shape, like $\\sqrt x$.' },
    { q: 'At an inflection point, $f\'$ changes sign.', a: false,
      why: 'It is $f\'\'$ that changes sign. At an inflection point $f\'$ typically has a local maximum or minimum.' },
    { q: 'Which function has the horizontal asymptote $y = 1$?', choices: ['$\\dfrac{x^2 + 1}{x^2 - 1}$', '$\\dfrac{x + 1}{x^2}$', '$\\dfrac{x^3}{x - 1}$', '$x + \\dfrac1x$'], a: 0,
      why: 'Equal degrees on top and bottom with leading coefficients 1 and 1. The second tends to 0, the others grow without bound.' },
    { q: 'Where is the inflection point of $x^3 - 6x^2 + 5$? Type its $x$-coordinate.', answer: '2', vars: [],
      why: '$f\'\'(x) = 6x - 12 = 0$ at $x = 2$, and $f\'\'$ changes sign there.' }
  ],
  applications: [
    'Checking computer plots and choosing sensible plot windows.',
    'Understanding response curves: resonance peaks, dose–response curves, potential-energy curves.',
    'Spotting the physically important points of a model: maxima, thresholds, points of fastest change.'
  ],
  sim: { id: 'calc-derivative-grapher', params: { second: true } }
},

{
  id: 'linear-approximation', parent: 'derivative-applications', title: 'Linear approximation and differentials', level: 2,
  short: 'Near a point, a smooth curve is almost its tangent line, so f(x) ≈ f(a) + f′(a)(x − a): the basis of small-angle approximations and error estimates.',
  keywords: ['linear approximation', 'linearisation', 'tangent line approximation', 'differential', 'dy = f\'(x) dx', 'small angle approximation', 'error estimate', 'binomial approximation', 'local linearity'],
  prereq: ['derivative', 'equation-of-a-line'],
  related: ['taylor-series', 'newtons-method', 'error-propagation', 'partial-derivatives', 'physics:simple-pendulum', 'physics:relativistic-energy'],
  body: `
Zoom in far enough on any smooth curve and it looks straight. The straight line it turns into is the tangent. That is the whole idea of **linear approximation**: near $x = a$, replace the curve by its tangent line,

$$f(x) \\approx L(x) = f(a) + f'(a)\\,(x - a).$$

### An example
What is $\\sqrt{4.1}$? Use $f(x) = \\sqrt x$ at $a = 4$, where everything is easy: $f(4) = 2$ and $f'(4) = \\dfrac{1}{2\\sqrt4} = \\dfrac14$. Then
$$\\sqrt{4.1} \\approx 2 + \\tfrac14(0.1) = 2.025.$$
The true value is $2.02485$: the error is only $0.00015$.

### How good is it?
The error comes from the bending of the curve, measured by $f''$. For small steps,
$$f(x) - L(x) \\approx \\tfrac12 f''(a)\\,(x - a)^2,$$
so halving the step quarters the error. Here $f''(4) = -\\tfrac{1}{32}$, predicting an error of $-\\tfrac12 \\cdot \\tfrac{1}{32}(0.1)^2 = -0.00016$, just as observed. The sign tells you which side you are on: for a curve that is concave down, the tangent lies above it and overestimates. Keeping the squared term gives the quadratic approximation, the first step towards a [[taylor-series|Taylor series]].

### Differentials
Write the change in input as $dx$ and the corresponding change along the tangent as
$$dy = f'(x)\\,dx.$$
This **differential** is the linear estimate of the true change $\\Delta y$. It is how uncertainties propagate. A ball bearing's radius is measured as 10.0 mm ± 0.1 mm; its volume $V = \\tfrac43\\pi r^3$ is then uncertain by
$$dV = 4\\pi r^2\\,dr = 4\\pi(10)^2(0.1) = 126\\ \\mathrm{mm^3},$$
about 3% of the volume. Relative errors are neat: for $y = x^n$, $\\dfrac{dy}{y} = n\\,\\dfrac{dx}{x}$, so a 1% error in a length becomes a 3% error in a volume. See [[error-propagation]].

### The approximations physicists live on
For small $x$ (in radians where it is an angle):

| Function | Linear approximation |
|---|---|
| $\\sin x$ | $x$ |
| $\\tan x$ | $x$ |
| $\\cos x$ | $1$ (or $1 - x^2/2$ to second order) |
| $e^x$ | $1 + x$ |
| $\\ln(1 + x)$ | $x$ |
| $(1 + x)^n$ | $1 + nx$ |

- The [[physics:simple-pendulum|pendulum]] equation becomes solvable when $\\sin\\theta \\approx \\theta$; at 10° the error is only 0.5%.
- The relativistic energy $mc^2/\\sqrt{1 - v^2/c^2} \\approx mc^2 + \\tfrac12 mv^2$ for $v \\ll c$ recovers ordinary kinetic energy (see [[physics:relativistic-energy|relativistic energy]]).
- Gravity at height $h$ above the Earth's radius $R$: $g(1 + h/R)^{-2} \\approx g(1 - 2h/R)$, so at 10 km up it is weaker by about 0.3%.

> [!tip] In the simulation, push the zoom up: at ×100 the curve and its tangent are indistinguishable, however curved the graph looked at first.
`,
  ideas: [
    'Near x = a, f(x) ≈ f(a) + f′(a)(x − a): the tangent line.',
    'The error is about ½ f″(a)(x − a)², so it shrinks with the square of the step.',
    'The differential dy = f′(x) dx estimates a small change and propagates measurement errors.',
    'For y = xⁿ, relative errors multiply by n.',
    'sin x ≈ x, eˣ ≈ 1 + x and (1 + x)ⁿ ≈ 1 + nx underlie countless physics results.'
  ],
  pitfalls: [
    'The approximation is good for any step — It is good for small steps; the error grows like the square of the distance from a.',
    'sin x ≈ x with x in degrees — Only in radians: sin 10° = 0.174, not 10.',
    'Relative errors simply add up for a power — For x³ the relative error triples, because the same factor appears three times.'
  ],
  formulas: [
    {
      name: 'Tangent-line approximation',
      expr: 'L = fa + s*(x - a)', tex: 'L = f_a + s\\,(x - a)',
      vars: {
        L: { name: 'approximate value of f(x)', signed: true },
        fa: { name: 'known value f(a)', tex: 'f_a', value: 2, signed: true },
        s: { name: 'known slope f′(a)', value: 0.25, signed: true },
        x: { name: 'point of interest x', value: 4.1, signed: true },
        a: { name: 'base point a', value: 4, signed: true }
      },
      note: 'The defaults estimate $\\sqrt{4.1}$ from $\\sqrt 4 = 2$ and the slope $\\tfrac14$ there.',
      stories: { L: 'A function has value {fa} and slope {s} at $x$ = {a}. Estimate its value at $x$ = {x}.' }
    },
    {
      name: 'Relative error of a power',
      expr: 'ry = n*rx', tex: 'r_y = n\\,r_x',
      vars: {
        ry: { name: 'relative error in y = xⁿ', tex: 'r_y', q: 'ratio', unit: '%', signed: true },
        n: { name: 'power n', value: 3, signed: true },
        rx: { name: 'relative error in x', tex: 'r_x', q: 'ratio', unit: '%', value: 1, signed: true }
      },
      note: 'From $dy = n x^{n-1}\\,dx$, divided by $y = x^n$: $\\dfrac{dy}{y} = n\\dfrac{dx}{x}$. A square root halves the relative error ($n = \\tfrac12$).',
      stories: { ry: 'The side of a cube is measured with an uncertainty of {rx}. What is the relative uncertainty of its volume (power {n})?' }
    }
  ],
  examples: [
    {
      title: 'A square root by hand',
      q: 'Estimate $\\sqrt{4.1}$ with a linear approximation, and estimate the error.',
      steps: [
        'Use $f(x) = \\sqrt x$ at $a = 4$: $f(4) = 2$, $f\'(4) = \\tfrac14$.',
        '$L(4.1) = 2 + \\tfrac14(0.1) = 2.025$.',
        'Error estimate: $\\tfrac12 f\'\'(4)(0.1)^2 = \\tfrac12(-\\tfrac1{32})(0.01) = -0.00016$. The true value $2.024846$ is indeed $0.00015$ below.'
      ],
      a: '√4.1 ≈ 2.025 (true 2.02485)'
    },
    {
      title: 'Error in a volume',
      q: 'A sphere\'s radius is measured as 10.0 cm with an uncertainty of 0.1 cm. Estimate the uncertainty of its volume.',
      steps: [
        '$V = \\tfrac43\\pi r^3 = 4189\\ \\mathrm{cm^3}$.',
        '$dV = 4\\pi r^2\\,dr = 4\\pi(100)(0.1) = 126\\ \\mathrm{cm^3}$.',
        'Relative: $126/4189 = 3\\%$, three times the 1% uncertainty in $r$.'
      ],
      a: 'About ±126 cm³ (3%).'
    },
    {
      title: 'The small-angle approximation',
      q: 'How good is $\\sin\\theta \\approx \\theta$ at $\\theta = 10°$?',
      steps: [
        'In radians, $10° = 0.17453$.',
        '$\\sin 10° = 0.17365$.',
        'The approximation is high by $0.00088$, a relative error of 0.51%. The error grows like $\\theta^3/6$, so at 20° it is about 2%.'
      ],
      a: 'Within 0.5% at 10°.'
    }
  ],
  quiz: [
    { q: 'The linear approximation of $e^x$ near $x = 0$ is…', choices: ['$x$', '$1 + x$', '$e + x$', '$1 + x + x^2$'], a: 1,
      why: '$f(0) = 1$ and $f\'(0) = 1$, so $L(x) = 1 + x$. The last choice is a quadratic approximation (and would need $x^2/2$).' },
    { q: 'Write the linear approximation of $\\sqrt x$ at $x = 9$, as an expression in $x$.', answer: '3 + (x - 9)/6', vars: ['x'],
      why: '$f(9) = 3$ and $f\'(9) = \\dfrac{1}{2\\cdot 3} = \\dfrac16$, so $L(x) = 3 + \\tfrac16(x - 9)$.' },
    { q: 'Estimate $(1.02)^{10}$ with $(1 + x)^n \\approx 1 + nx$.', choices: ['1.02', '1.2', '1.22', '2.0'], a: 1,
      why: '$1 + 10 \\times 0.02 = 1.2$. The true value is 1.219: the neglected squared terms add about 2%.' },
    { q: 'For a function that is concave up, the tangent-line approximation underestimates the function.', a: true,
      why: 'A concave-up curve lies above its tangent lines, so the tangent value is too low.' },
    { q: 'The edge of a cube is measured with a 1% error. The volume has an error of about…', choices: ['1%', '2%', '3%', '9%'], a: 2,
      why: 'For $V = s^3$, $dV/V = 3\\,ds/s$.' }
  ],
  applications: [
    'Error propagation in every laboratory measurement.',
    'Small-angle and small-speed approximations: pendulums, optics, low-speed limits of relativity.',
    'Linearising non-linear systems (circuits, control systems, oscillators) about an operating point.'
  ],
  sim: 'calc-secant-tangent'
},

{
  id: 'newtons-method', parent: 'derivative-applications', title: 'Newton\'s method', level: 2,
  short: 'A fast way to solve f(x) = 0: follow the tangent line down to the axis, and repeat. Near a root the number of correct digits roughly doubles each step.',
  keywords: ['Newton\'s method', 'Newton-Raphson', 'root finding', 'iteration', 'tangent', 'quadratic convergence', 'square root algorithm', 'Heron', 'numerical solution'],
  prereq: ['linear-approximation', 'derivative'],
  related: ['continuity', 'quadratic-equations', 'optimization', 'euler-method', 'physics:keplers-laws'],
  body: `
Most equations cannot be solved with algebra: $\\cos x = x$, $x^5 - x - 1 = 0$, Kepler's $M = E - e\\sin E$. **Newton's method** solves them numerically with astonishing speed, using nothing but the tangent line.

### The idea
Start from a guess $x_0$. The curve is hard to deal with, but its [[linear-approximation|tangent line]] at $x_0$ is easy: find where the *tangent* crosses the axis and use that as a better guess. Setting $f(x_0) + f'(x_0)(x - x_0) = 0$ gives

$$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}.$$

Repeat until the numbers stop changing.

### Square roots
To find $\\sqrt 2$, solve $f(x) = x^2 - 2 = 0$. The step becomes $x_{n+1} = x_n - \\dfrac{x_n^2 - 2}{2x_n} = \\tfrac12\\left(x_n + \\dfrac{2}{x_n}\\right)$: average your guess with 2 divided by it. From $x_0 = 1$:

| $n$ | $x_n$ | correct digits |
|---|---|---|
| 0 | 1 | 1 |
| 1 | 1.5 | 1 |
| 2 | 1.416 666 67 | 3 |
| 3 | 1.414 215 69 | 6 |
| 4 | 1.414 213 562 37 | 12 |

The number of correct digits **doubles** each step. This is **quadratic convergence**: the new error is proportional to the square of the old one, $e_{n+1} \\approx \\dfrac{f''}{2f'}\\,e_n^2$. The Babylonians used this averaging rule for square roots nearly 4000 years ago, and computers still use Newton-type iterations for square roots and division.

### When it goes wrong
Newton's method is fast but not foolproof:
- **Horizontal tangent.** If $f'(x_n) = 0$ the tangent never meets the axis.
- **Overshooting.** For $\\arctan x$, starting beyond $|x_0| \\approx 1.39$ each tangent lands further out on the other side, and the iterates fly off to infinity.
- **Cycles.** For $x^3 - 2x + 2$ from $x_0 = 0$ the iterates go $0, 1, 0, 1, \\ldots$ for ever.
- **The wrong root.** With several roots, the one you reach can depend delicately on the start.

In practice a good first guess (from a graph, or a few steps of the [[continuity|bisection method]], which is slow but cannot fail) followed by Newton's method is the standard recipe.

### In science and engineering
- **Orbits.** Finding a planet's position at a given time means solving Kepler's equation $M = E - e\\sin E$ for $E$; Newton's method is the classic approach (see [[physics:keplers-laws|Kepler's laws]]).
- **Optimisation.** A minimum of $g$ is a root of $g'$, so Newton's method applied to $g'$ finds optima; this generalises to many variables in engineering design and machine learning.
- **Circuit simulators** solve the non-linear equations of diodes and transistors with Newton iterations at every time step.
`,
  ideas: [
    'Newton\'s step: x_{n+1} = x_n − f(x_n)/f′(x_n), where the tangent meets the axis.',
    'Near a simple root the correct digits roughly double at each step.',
    'It can fail: horizontal tangents, overshooting, cycles, convergence to an unexpected root.',
    'A good starting guess matters; bisection or a graph can provide one.',
    'Applied to f′ instead of f, it finds maxima and minima.'
  ],
  pitfalls: [
    'Newton\'s method always converges — Only from close enough to a root where f′ ≠ 0; otherwise it can diverge or cycle.',
    'If the iterates stop changing you have a root — Check that f(x) is actually near zero; slow creeping can mimic convergence near a double root.',
    'Using the wrong sign: x_{n+1} = x_n + f/f′ — The step must move against the function\'s value along the slope: subtract.'
  ],
  formulas: [
    {
      name: 'One Newton step',
      expr: 'x1 = x0 - f0/s0', tex: 'x_{n+1} = x_n - \\frac{f_n}{s_n}',
      vars: {
        x1: { name: 'next guess', tex: 'x_{n+1}', signed: true },
        x0: { name: 'current guess', tex: 'x_n', value: 1, signed: true },
        f0: { name: 'function value f(xₙ)', tex: 'f_n', value: -1, signed: true },
        s0: { name: 'slope f′(xₙ)', tex: 's_n', value: 2, signed: true }
      },
      note: 'The defaults are the first step for $x^2 - 2$ from $x_0 = 1$: $f = -1$, $f\' = 2$, giving 1.5.'
    },
    {
      name: 'Square roots by Newton\'s method (Heron\'s rule)',
      expr: 'x1 = (x0 + S/x0)/2', tex: 'x_{n+1} = \\frac12\\left(x_n + \\frac{S}{x_n}\\right)',
      vars: {
        x1: { name: 'next guess', tex: 'x_{n+1}' },
        x0: { name: 'current guess', tex: 'x_n', value: 1.5 },
        S: { name: 'number whose root you want', value: 2 }
      },
      note: 'Newton\'s method for $x^2 - S = 0$. Put the result back in as the new $x_n$ and watch the digits settle on $\\sqrt S$.'
    }
  ],
  examples: [
    {
      title: 'Where cos x = x',
      q: 'Solve $\\cos x = x$ with Newton\'s method, starting from $x_0 = 1$.',
      steps: [
        'Take $f(x) = \\cos x - x$, so $f\'(x) = -\\sin x - 1$.',
        '$x_1 = 1 - \\dfrac{0.5403 - 1}{-0.8415 - 1} = 1 - \\dfrac{-0.4597}{-1.8415} = 0.75036$.',
        '$x_2 = 0.739113$, $x_3 = 0.7390851$, $x_4 = 0.7390851332$: settled to ten digits after four steps.'
      ],
      a: 'x ≈ 0.739085'
    },
    {
      title: 'Kepler\'s equation',
      q: 'For an orbit of eccentricity $e = 0.5$, solve $E - 0.5\\sin E = 1$ for the eccentric anomaly $E$ (radians), starting at $E_0 = 1$.',
      steps: [
        '$f(E) = E - 0.5\\sin E - 1$ and $f\'(E) = 1 - 0.5\\cos E$.',
        '$E_1 = 1 - \\dfrac{1 - 0.4207 - 1}{1 - 0.2702} = 1 + \\dfrac{0.4207}{0.7298} = 1.5765$.',
        '$E_2 = 1.50021$, $E_3 = 1.498702$, $E_4 = 1.4987011$.'
      ],
      a: 'E ≈ 1.4987 rad'
    },
    {
      title: 'A trap',
      q: 'Apply Newton\'s method to $f(x) = x^3 - 2x + 2$ from $x_0 = 0$.',
      steps: [
        '$f\'(x) = 3x^2 - 2$. At $0$: $f = 2$, $f\' = -2$, so $x_1 = 0 - 2/(-2) = 1$.',
        'At $1$: $f = 1$, $f\' = 1$, so $x_2 = 1 - 1 = 0$. Back where we started.',
        'The iterates cycle $0, 1, 0, 1, \\ldots$ for ever. The real root is near $-1.77$; starting at $x_0 = -2$ finds it in a few steps.'
      ],
      a: 'The iteration cycles between 0 and 1 and never converges.'
    }
  ],
  quiz: [
    { q: 'Newton\'s method breaks down at a step where…', choices: ['$f(x_n) = 0$', '$f\'(x_n) = 0$', '$f\'\'(x_n) = 0$', '$x_n = 0$'], a: 1,
      why: 'The step divides by $f\'(x_n)$: a horizontal tangent never reaches the axis. ($f(x_n) = 0$ just means you are done.)' },
    { q: 'Write the Newton iteration for $f(x) = x^2 - 5$: the next guess as an expression in the current guess $x$.', answer: 'x - (x^2 - 5)/(2x)', vars: ['x'],
      why: '$x - f(x)/f\'(x)$ with $f\'(x) = 2x$. It simplifies to $\\tfrac12(x + 5/x)$.' },
    { q: 'Close to a simple root, an estimate has 3 correct digits. After one more Newton step it will typically have about…', choices: ['4', '6', '9', '30'], a: 1,
      why: 'Quadratic convergence: the error is roughly squared, so the number of correct digits roughly doubles.' },
    { q: 'Started close enough to a root where $f\' \\ne 0$ (for a smooth $f$), Newton\'s method converges to that root.', a: true,
      why: 'That is the local convergence theorem. The trouble all comes from starting too far away or from roots where $f\' = 0$.' },
    { q: 'For $x^2 - 2$ starting at $x_0 = 1$, what is $x_1$?', choices: ['1.25', '1.5', '2', '1.414'], a: 1,
      why: '$x_1 = 1 - (1 - 2)/2 = 1.5$.' }
  ],
  applications: [
    'Square roots, reciprocals and other functions inside calculators and processors.',
    'Solving Kepler\'s equation, equations of state and implicit design equations.',
    'Optimisation and non-linear circuit simulation.'
  ],
  history: 'Newton described the method in the 1660s for polynomials; Joseph Raphson published a simpler version in 1690, which is why it is often called the Newton–Raphson method. The averaging rule for square roots is far older: it appears on Babylonian tablets and in Heron of Alexandria\'s work.',
  sim: 'calc-newton'
},

{
  id: 'lhopitals-rule', parent: 'derivative-applications', title: 'L\'Hôpital\'s rule', level: 2,
  short: 'A limit of the form 0/0 or ∞/∞ can be found by differentiating the top and the bottom separately and taking the limit again.',
  keywords: ['L\'Hôpital', 'L\'Hospital', 'indeterminate form', '0/0', 'infinity over infinity', '0 times infinity', '1 to the infinity', 'limits'],
  prereq: ['limits', 'derivative', 'limits-at-infinity'],
  related: ['taylor-series', 'improper-integrals', 'derivatives-of-functions', 'linear-approximation', 'physics:damped-oscillations', 'physics:blackbody-radiation'],
  body: `
When a limit comes out as $\\dfrac00$ or $\\dfrac{\\infty}{\\infty}$, it is **indeterminate**: the answer depends on *how fast* the top and bottom go to zero (or infinity). L'Hôpital's rule compares those speeds using derivatives:

$$\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x \\to a}\\frac{f'(x)}{g'(x)},$$

provided the original limit is $0/0$ or $\\infty/\\infty$ and the right-hand limit exists. The point $a$ may also be $\\pm\\infty$.

### Why it works
Near $x = a$, with $f(a) = g(a) = 0$, both functions are close to their [[linear-approximation|tangent lines]]: $f(x) \\approx f'(a)(x - a)$ and $g(x) \\approx g'(a)(x - a)$. The factors $(x - a)$ cancel in the ratio, leaving $f'(a)/g'(a)$. Two quantities racing to zero are compared by their speeds.

### Examples
- $\\displaystyle\\lim_{x\\to 0}\\frac{e^{2x} - 1}{x} = \\lim_{x\\to0}\\frac{2e^{2x}}{1} = 2.$
- Apply it twice if needed: $\\displaystyle\\lim_{x\\to 0}\\frac{e^x - 1 - x}{x^2} = \\lim\\frac{e^x - 1}{2x} = \\lim\\frac{e^x}{2} = \\frac12.$
- At infinity: $\\displaystyle\\lim_{x\\to\\infty}\\frac{\\ln x}{x} = \\lim\\frac{1/x}{1} = 0$, one of the growth rankings from [[limits-at-infinity|limits at infinity]].

### Other indeterminate forms
Rewrite them as a quotient first.
- **$0\\cdot\\infty$:** $x\\ln x$ as $x \\to 0^+$ becomes $\\dfrac{\\ln x}{1/x}$, an $\\infty/\\infty$ form: $\\dfrac{1/x}{-1/x^2} = -x \\to 0$.
- **$\\infty - \\infty$:** combine into one fraction.
- **$1^\\infty$, $0^0$, $\\infty^0$:** take logarithms. For $\\left(1 + \\dfrac{a}{x}\\right)^x$, the log is $x\\ln(1 + a/x) = \\dfrac{\\ln(1 + a/x)}{1/x} \\to a$, so the limit is $e^a$: the continuous-compounding formula.

### In physics
- At low frequency, Planck's law for [[physics:blackbody-radiation|blackbody radiation]] turns into the classical Rayleigh–Jeans law because $\\dfrac{x}{e^x - 1} \\to 1$ as $x = h\\nu/kT \\to 0$.
- The motion of a lightly damped oscillator contains $\\dfrac{\\sin\\omega t}{\\omega}$. As the damping is raised to the critical value, $\\omega \\to 0$ and this tends to $t$: l'Hôpital explains where the extra factor of $t$ in the [[physics:damped-oscillations|critically damped]] solution comes from.

> [!warn] Use the rule only on genuine $0/0$ or $\\infty/\\infty$ forms. For $\\lim_{x \\to 0}\\dfrac{x + 1}{x + 2}$ the answer is simply $\\tfrac12$; blindly differentiating would give 1.
`,
  ideas: [
    'For 0/0 or ∞/∞, lim f/g = lim f′/g′ (when the second limit exists).',
    'Differentiate the top and the bottom separately, not with the quotient rule.',
    'It may need applying more than once.',
    'Other forms (0·∞, ∞ − ∞, 1^∞, 0⁰) must first be rewritten as a quotient, often via logarithms.',
    'It works because near the point both functions are close to their tangent lines.'
  ],
  pitfalls: [
    'Using the quotient rule on f/g — The rule differentiates numerator and denominator separately.',
    'Applying it to limits that are not indeterminate — (x + 1)/(x + 2) at 0 is simply ½; differentiating would give the wrong answer 1.',
    'Concluding the limit does not exist because lim f′/g′ does not — The rule only works one way. For (x + sin x)/x at infinity, f′/g′ = 1 + cos x has no limit, yet the original limit is 1.'
  ],
  formulas: [
    {
      name: 'The Planck factor x/(eˣ − 1)',
      expr: 'y = x/(exp(x) - 1)', tex: 'y = \\frac{x}{e^{x} - 1}',
      vars: {
        y: { name: 'value of the factor' },
        x: { name: 'x = hν/kT', value: 0.1 }
      },
      note: 'A $0/0$ form at $x = 0$ whose limit, by l\'Hôpital, is $1/e^0 = 1$. For small $x$ it is about $1 - x/2$; for large $x$ it dies like $x e^{-x}$.'
    }
  ],
  examples: [
    {
      title: 'Twice in a row',
      q: 'Find $\\displaystyle\\lim_{x \\to 0}\\frac{1 - \\cos x}{x^2}$.',
      steps: [
        'At $x = 0$: $0/0$. Differentiate top and bottom: $\\dfrac{\\sin x}{2x}$, still $0/0$.',
        'Again: $\\dfrac{\\cos x}{2} \\to \\dfrac12$.',
        'So $1 - \\cos x \\approx \\tfrac12 x^2$ for small $x$: the second-order cosine approximation.'
      ],
      a: '1/2'
    },
    {
      title: 'Exponential beats power',
      q: 'Find $\\displaystyle\\lim_{x \\to \\infty} x^2 e^{-x}$.',
      steps: [
        'Write it as $\\dfrac{x^2}{e^x}$, an $\\infty/\\infty$ form.',
        'Differentiate: $\\dfrac{2x}{e^x}$, still $\\infty/\\infty$. Again: $\\dfrac{2}{e^x} \\to 0$.',
        'The same argument, repeated $n$ times, shows $x^n e^{-x} \\to 0$ for every $n$.'
      ],
      a: '0'
    },
    {
      title: 'A zero-to-the-zero form',
      q: 'Find $\\displaystyle\\lim_{x \\to 0^+} x^x$.',
      steps: [
        'Take logs: $\\ln(x^x) = x\\ln x = \\dfrac{\\ln x}{1/x}$, an $\\infty/\\infty$ form.',
        'Differentiate: $\\dfrac{1/x}{-1/x^2} = -x \\to 0$.',
        'So $\\ln(x^x) \\to 0$ and $x^x \\to e^0 = 1$. (At $x = 0.001$, $x^x = 0.9931$.)'
      ],
      a: '1'
    }
  ],
  quiz: [
    { q: '$\\displaystyle\\lim_{x \\to 0}\\frac{e^{2x} - 1}{x} = $', choices: ['0', '1', '2', 'It does not exist'], a: 2,
      why: '$0/0$, and differentiating gives $2e^{2x}/1 \\to 2$.' },
    { q: 'Which of these is NOT an indeterminate form?', choices: ['0/0', '∞/∞', '0 · ∞', '0/∞'], a: 3,
      why: 'A quantity going to zero divided by one growing without bound simply goes to zero. The others can come out as anything.' },
    { q: 'L\'Hôpital\'s rule says to differentiate $f/g$ with the quotient rule.', a: false,
      why: 'You differentiate $f$ and $g$ separately and take the limit of $f\'/g\'$.' },
    { q: 'Find $\\displaystyle\\lim_{x \\to 0}\\frac{\\sin 5x}{x}$ (type the number).', answer: '5', vars: [],
      why: '$0/0$; differentiating gives $5\\cos 5x / 1 \\to 5$.' },
    { q: 'What is $\\displaystyle\\lim_{x \\to 0}\\frac{x + 1}{x + 2}$?', choices: ['1, by l\'Hôpital', '1/2', '0', 'It is indeterminate'], a: 1,
      why: 'Substitution gives $1/2$ directly. The form is not $0/0$, so l\'Hôpital does not apply — and would give the wrong answer 1.' }
  ],
  applications: [
    'Classical limits of quantum formulas, such as Rayleigh–Jeans from Planck.',
    'Special cases of general formulas: critical damping, resonance exactly at the natural frequency, a lens at its focal length.',
    'Comparing growth rates of algorithms and functions.'
  ],
  history: 'The rule appeared in 1696 in the first calculus textbook, written by the Marquis de l\'Hôpital. The result itself was due to Johann Bernoulli, whom l\'Hôpital paid for lessons and for the rights to his discoveries.'
}

);
