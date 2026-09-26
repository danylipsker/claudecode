/* HYPER-MATH · content/first-order-odes.js — first-order differential equations:
 * what they are, slope fields, separable and linear equations, exponential and
 * logistic models, and Euler's method. Simulations are in sims/series-odes.js. */
Hyper.add(

{
  id: 'differential-equations-intro', parent: 'first-order-odes', title: 'What is a differential equation?', level: 1,
  short: 'An equation linking an unknown function to its own rates of change. Solving it turns a local rule — how fast things change right now — into a whole history.',
  keywords: ['differential equation', 'ODE', 'ordinary differential equation', 'PDE', 'order', 'linear', 'nonlinear', 'initial value problem', 'initial condition', 'general solution', 'particular solution', 'existence and uniqueness', 'verify a solution'],
  prereq: ['derivative', 'antiderivatives', 'functions'],
  related: ['slope-fields', 'separable-equations', 'second-order-linear', 'physics:newtons-second-law'],
  body: `
Most laws of nature are statements about **change**, not about values:

- A radioactive sample decays at a rate proportional to how much is left: $\\dfrac{dN}{dt} = -\\lambda N$ ([[physics:half-life|half-life]]).
- A hot drink cools at a rate proportional to how much hotter it is than the room: $\\dfrac{dT}{dt} = -k\\,(T - T_\\text{room})$ ([[physics:newtons-law-of-cooling|Newton's law of cooling]]).
- A mass on a spring accelerates in proportion to its displacement: $m\\dfrac{d^2x}{dt^2} = -kx$ ([[physics:newtons-second-law|Newton's second law]] with [[physics:hookes-law|Hooke's law]]).

Each is a **differential equation**: an equation involving an unknown function and its derivatives. The unknown is not a number but a whole function — a complete history $N(t)$, $T(t)$ or $x(t)$.

### The vocabulary
- **Ordinary** differential equations (ODEs) have one independent variable, usually time. **Partial** differential equations (PDEs) have several, as in a temperature $u(x, t)$ that depends on place and time — see the [[heat-equation|heat]] and [[wave-equation|wave]] equations.
- The **order** is the highest derivative that appears: decay and cooling are first order, the spring is second order.
- An equation is **linear** when the unknown and its derivatives appear only to the first power, are not multiplied together and do not sit inside other functions. $y'' + 3y' + 2y = \\sin t$ is linear; $y' = y^2$ and the pendulum's $\\theta'' = -\\tfrac{g}{L}\\sin\\theta$ are not.

### Checking a solution
You never need to take a claimed solution on trust: substitute it. Is $y = e^{-2t}$ a solution of $y' + 2y = 0$? Its derivative is $-2e^{-2t}$, and $-2e^{-2t} + 2e^{-2t} = 0$ for every $t$, so yes. Is $y = \\sin 3t$ a solution of $y'' + 9y = 0$? $y'' = -9\\sin 3t$, so yes again.

### Families and initial conditions
The equation $dy/dt = 3t^2$ is solved by $y = t^3 + C$ for *every* constant $C$: the **general solution** is a family of curves. Each integration brings one constant, so an $n$-th order equation has $n$ of them. To pick out a single member you add **initial conditions**, and the package is an **initial value problem**. If $y(0) = 5$ then $C = 5$. Newton's second-order law needs two conditions — starting position and starting velocity — which is exactly what physics says you must know to predict a trajectory.

### One solution through each point
If the right-hand side of $y' = f(t, y)$ is smooth, exactly one solution passes through each starting point, at least for a while. So solution curves never cross, and the present state fixes the future: this is determinism in mathematical form. "For a while" matters: $y' = y^2$ with $y(0) = 1$ has the solution $1/(1 - t)$, which blows up at $t = 1$. And without smoothness uniqueness can fail: $y' = 3y^{2/3}$ with $y(0) = 0$ is solved both by $y = 0$ and by $y = t^3$. (Torricelli's law for a draining tank has the same flaw: an empty tank does not reveal when it emptied.)

### Three ways in
1. **Exact formulas**, for special but important types: [[separable-equations|separable]], [[first-order-linear|linear first-order]] and [[second-order-linear|linear second-order]] equations.
2. **Pictures**: a [[slope-fields|slope field]] shows every solution at once, with equilibria and their stability.
3. **Numbers**: [[euler-method|Euler's method]] and its descendants, which is how every simulation — including the ones in this app — is run.
`,
  ideas: [
    'A differential equation relates an unknown function to its derivatives; a solution is a whole function, not a number.',
    'The order is the highest derivative; an n-th order equation has n arbitrary constants in its general solution.',
    'Initial conditions pick one solution out of the family.',
    'For smooth equations exactly one solution passes through each starting point, so solution curves never cross.',
    'Equations are solved exactly, graphically with slope fields, or numerically step by step.'
  ],
  pitfalls: [
    'A differential equation has one solution — Without initial conditions it has a whole family, with one arbitrary constant for each order.',
    'Nonlinear means the solution is not a straight line — Linearity is a property of the equation, not of the graph of its solution: $y\'\' + y = 0$ is linear and is solved by sines.',
    'Solutions always exist for all time — $y\' = y^2$ with $y(0) = 1$ gives $y = 1/(1-t)$, which reaches infinity at $t = 1$.'
  ],
  examples: [
    {
      title: 'Verify, then fit a solution',
      q: 'Show that $y = Ce^{-2t} + 3$ solves $y\' = 6 - 2y$ for every $C$, then find the solution with $y(0) = 10$.',
      steps: [
        'Left side: $y\' = -2Ce^{-2t}$.',
        'Right side: $6 - 2y = 6 - 2Ce^{-2t} - 6 = -2Ce^{-2t}$. The two agree for every $t$ and every $C$.',
        'Initial condition: $y(0) = C + 3 = 10$, so $C = 7$ and $y = 7e^{-2t} + 3$.',
        'As $t$ grows the exponential dies away and $y$ settles at 3, where the right side $6 - 2y$ is zero: an equilibrium.'
      ],
      a: 'y = 7e^(−2t) + 3'
    },
    {
      title: 'Classifying equations',
      q: 'Give the order of each equation and say whether it is linear: (a) $y\' + t\\,y = \\cos t$; (b) $y\'\' + y\\,y\' = 0$; (c) $\\theta\'\' + \\tfrac{g}{L}\\sin\\theta = 0$; (d) $\\dfrac{\\partial u}{\\partial t} = \\alpha\\dfrac{\\partial^2 u}{\\partial x^2}$.',
      steps: [
        '(a) First order, linear: $y$ and $y\'$ appear to the first power (a coefficient like $t$ is allowed).',
        '(b) Second order, nonlinear: the product $y\\,y\'$ multiplies the unknown by its derivative.',
        '(c) Second order, nonlinear because of $\\sin\\theta$ — but for small swings $\\sin\\theta \\approx \\theta$ makes it linear, the simple pendulum.',
        '(d) A partial differential equation (the heat equation), second order in $x$, and linear.'
      ],
      a: '(a) 1st, linear; (b) 2nd, nonlinear; (c) 2nd, nonlinear; (d) PDE, 2nd order, linear.'
    }
  ],
  quiz: [
    { q: 'What is the order of $\\dfrac{d^2y}{dt^2} + \\left(\\dfrac{dy}{dt}\\right)^3 = t$?', choices: ['1', '2', '3', '6'], a: 1,
      why: 'The order is the highest derivative, here the second. The cube is a power, which makes the equation nonlinear but does not raise its order.' },
    { q: "The function $y = e^{3t}$ is a solution of $y'' - 9y = 0$.", a: true,
      why: '$y\'\' = 9e^{3t}$, so $y\'\' - 9y = 9e^{3t} - 9e^{3t} = 0$ for every $t$. (So is $e^{-3t}$.)' },
    { q: 'Which equation is nonlinear?', choices: ['$y\' + 4y = e^t$', '$y\'\' + t^2 y = 0$', '$y\' = y^2 - 1$', '$t\\,y\' + y = \\sin t$'], a: 2,
      why: 'The $y^2$ term makes it nonlinear. Coefficients that depend on $t$, like $t^2$ or $t$, keep an equation linear.' },
    { q: 'The general solution of $y\' = 2y$ is $y = Ce^{2t}$. Give the solution with $y(0) = 5$.', answer: '5e^(2t)', vars: ['t'],
      why: 'At $t = 0$, $Ce^0 = C$, so $C = 5$: $y = 5e^{2t}$.' },
    { q: 'How many initial conditions does a second-order equation such as $m\\ddot x = -kx$ need to fix a unique solution?', choices: ['One: the starting position', 'Two: the starting position and velocity', 'Three', 'None'], a: 1,
      why: 'Its general solution has two arbitrary constants, $x = A\\cos\\omega t + B\\sin\\omega t$; position and velocity at the start determine both.' }
  ],
  applications: [
    'Mechanics: every trajectory is the solution of Newton\'s second law.',
    'Chemistry: rate laws for reactions are differential equations for concentrations.',
    'Biology and medicine: population models, epidemics, drug levels in the blood.',
    'Engineering: circuits, control systems and structures are designed from their differential equations.'
  ],
  history: 'Newton and Leibniz wrote the first differential equations as soon as they had calculus — Newton\'s laws of motion are second-order ODEs. The guarantee that smooth equations have exactly one solution through each point was proved in the 19th century by Cauchy, Lipschitz and Picard.',
  sim: { id: 'so-slope-field', params: { eq: 'exp' } }
},

{
  id: 'slope-fields', parent: 'first-order-odes', title: 'Slope fields', level: 1,
  short: 'Draw a tiny segment at every point with the slope the equation demands there. Solutions are the curves that follow the segments — you can see the answer before solving anything.',
  keywords: ['slope field', 'direction field', 'isocline', 'equilibrium solution', 'autonomous equation', 'phase line', 'stability', 'stable equilibrium', 'unstable equilibrium', 'qualitative analysis', 'tangent field'],
  prereq: ['differential-equations-intro', 'derivative'],
  related: ['euler-method', 'logistic-equation', 'separable-equations', 'physics:drag-force'],
  body: `
A first-order equation $y' = f(x, y)$ makes a promise: if a solution passes through the point $(x, y)$, its slope there is $f(x, y)$. So without solving anything you can draw, at each point of a grid, a short segment with that slope. The result is a **slope field** (or direction field). A solution is a curve that is tangent to the segments everywhere it goes — the way iron filings trace a magnetic field, or leaves on a river trace its currents. Choose a starting point and follow the arrows.

### Reading a field: $y' = x - y$
The slope is zero along the line $y = x$, 1 along $y = x - 1$, and $-1$ along $y = x + 1$. Curves on which the slope has one fixed value are **isoclines**, and sketching a few of them is the quickest way to draw a field by hand. Notice something special: along $y = x - 1$ the slope is 1, and the line itself has slope 1. That line is a solution, and every other solution is drawn onto it. (Solving exactly gives $y = x - 1 + Ce^{-x}$, confirming the picture.)

### Autonomous equations and equilibria
When the slope depends only on $y$, $y' = g(y)$, the equation is **autonomous**: the rule does not change with time, and every column of the field looks the same. Each zero $c$ of $g$ gives an **equilibrium**, a constant solution $y = c$. Its **stability** is visible at a glance:

- **stable** if $g$ changes from positive to negative as $y$ increases through $c$ — solutions on both sides move towards it (then $g'(c) < 0$);
- **unstable** if $g$ changes from negative to positive — solutions move away ($g'(c) > 0$);
- **semi-stable** if $g$ has the same sign on both sides.

The whole story fits on a **phase line**: a vertical line marked with the equilibria and with arrows up where $g > 0$ and down where $g < 0$. For the [[logistic-equation|logistic equation]] $y' = y(1 - y)$, the line has an unstable point at 0 and a stable one at 1, and arrows pointing towards 1 from both sides.

### What the picture guarantees
- **Solutions never cross** (for smooth equations). So a solution that starts between two equilibria stays between them for ever: a population starting between 0 and its carrying capacity never overshoots it.
- **Autonomous first-order solutions are monotonic.** To turn round, $y'$ would have to pass through zero — but zero slope happens only on an equilibrium, where the solution would have to stay. So a first-order autonomous system can never oscillate; oscillations need second order (like the [[harmonic-oscillator-ode|harmonic oscillator]]) or a time-varying drive.

### A physical example
A falling object with air drag proportional to speed obeys $m\\,v' = mg - bv$. The field of $v' = g - (b/m)v$ has one stable equilibrium at $v = mg/b$: whatever the starting speed — dropped from rest or fired downwards fast — the velocity is drawn to this **terminal velocity** ([[physics:drag-force|air resistance]]). Following the field in small straight steps is exactly [[euler-method|Euler's method]].
`,
  ideas: [
    'At each point, $y\' = f(x, y)$ fixes the slope of any solution through that point; drawing those slopes gives the field.',
    'Solutions are curves tangent to the field everywhere; for smooth equations they never cross.',
    'Isoclines, curves of equal slope, make fields quick to sketch by hand.',
    'For an autonomous equation $y\' = g(y)$, the zeros of g are equilibria: stable if g changes from + to −, unstable if from − to +.',
    'First-order autonomous solutions are monotonic and cannot oscillate.'
  ],
  pitfalls: [
    'A slope field shows just a few solutions — It shows all of them at once: every point has a solution through it. Drawing a curve means choosing a starting point.',
    'A solution can cross an equilibrium line — For a smooth equation uniqueness forbids it. Solutions approach equilibria but never reach or pass them in finite time.',
    'An isocline is a solution curve — It is a curve along which the slope takes one value. It is a solution only in the special case where its own slope matches, like $y = x - 1$ for $y\' = x - y$.'
  ],
  examples: [
    {
      title: 'A phase line',
      q: 'Find and classify the equilibria of $y\' = y^2 - 4y + 3$, and describe the solutions starting at $y(0) = 2$ and $y(0) = 3.5$.',
      steps: [
        'Factor: $g(y) = (y - 1)(y - 3)$, so the equilibria are $y = 1$ and $y = 3$.',
        'Signs: for $y < 1$ both factors are negative, so $g > 0$; for $1 < y < 3$, $g < 0$; for $y > 3$, $g > 0$.',
        'At $y = 1$, $g$ goes from $+$ to $-$: **stable**. At $y = 3$, from $-$ to $+$: **unstable**. (Check: $g\'(y) = 2y - 4$ is $-2$ at 1 and $+2$ at 3.)',
        'Starting at 2 the solution decreases and approaches 1 as $t \\to \\infty$. Starting at 3.5 it increases, and since $g$ grows like $y^2$ it blows up in finite time.'
      ],
      a: 'y = 1 stable, y = 3 unstable; from 2 → 1; from 3.5 → blows up.'
    },
    {
      title: 'Sketching a field by isoclines',
      q: 'Sketch the slope field of $y\' = x - y$ using isoclines, and predict the long-run behaviour of all solutions.',
      steps: [
        'Isocline for slope $m$: $x - y = m$, the line $y = x - m$. All isoclines are parallel lines of slope 1.',
        'On $y = x$ draw flat segments; on $y = x - 1$ segments of slope 1; on $y = x + 1$ segments of slope $-1$; on $y = x - 2$ segments of slope 2.',
        'The segments on $y = x - 1$ point along the line itself, so it is a solution.',
        'Above that line slopes are less than 1, below it they are more than 1: solutions on both sides are steered towards it.'
      ],
      a: 'Every solution approaches the line y = x − 1.'
    }
  ],
  quiz: [
    { q: 'In the slope field of $y\' = y^2$, the segments along the $x$-axis are…', choices: ['vertical', 'horizontal', 'at 45°', 'absent'], a: 1,
      why: 'On the $x$-axis $y = 0$, so the slope $y^2$ is 0: flat segments. The $x$-axis is an equilibrium solution.' },
    { q: 'For $y\' = g(y)$, an equilibrium $y = c$ with $g\'(c) < 0$ is…', choices: ['stable', 'unstable', 'semi-stable', 'not an equilibrium'], a: 0,
      why: 'A negative slope of $g$ means $g$ is positive just below $c$ and negative just above it, so solutions on both sides move towards $c$.' },
    { q: 'Two different solution curves of $y\' = x - y$ can cross each other.', a: false,
      why: 'At a crossing point one starting value would lead to two different solutions, which uniqueness rules out for this smooth equation.' },
    { q: 'A solution of $y\' = y(1 - y)$ starts at $y(0) = 0.5$. As $t \\to \\infty$ it…', choices: ['grows without bound', 'approaches 1', 'returns to 0', 'oscillates about 1'], a: 1,
      why: 'Between the equilibria 0 and 1 the slope is positive, and the solution cannot cross $y = 1$, so it rises towards 1. It cannot oscillate: it is first order and autonomous.' },
    { q: 'How can you tell from its slope field that an equation is autonomous, $y\' = g(y)$?', choices: ['All the segments are parallel', 'The segments are the same all along each horizontal line', 'The segments are the same all along each vertical line', 'All the segments are horizontal'], a: 1,
      why: 'The slope depends only on $y$, so moving left or right (changing $x$ at fixed $y$) does not change it.' }
  ],
  applications: [
    'Seeing the long-term behaviour — equilibria, stability, blow-up — of equations that have no formula solution.',
    'Phase lines in population biology, chemistry and economics.',
    'The same idea in two dimensions gives phase portraits of oscillators and streamlines of fluid flow.'
  ],
  sim: 'so-slope-field'
},

{
  id: 'separable-equations', parent: 'first-order-odes', title: 'Separable equations', level: 2,
  short: 'When the rate splits into a factor in x times a factor in y, gather each variable on its own side and integrate both sides.',
  keywords: ['separable equation', 'separation of variables', 'integrate both sides', 'implicit solution', 'Torricelli', 'draining tank', 'blow-up', 'dy/dx = g(x)h(y)', 'equilibrium solution'],
  prereq: ['differential-equations-intro', 'antiderivatives', 'integration-by-substitution'],
  related: ['exponential-models', 'logistic-equation', 'partial-fractions', 'physics:bernoullis-equation'],
  body: `
A first-order equation is **separable** when its right-hand side factors into a function of $x$ times a function of $y$:

$$\\frac{dy}{dx} = g(x)\\,h(y)$$

Divide by $h(y)$, "multiply by $dx$", and integrate each side with respect to its own variable:

$$\\int \\frac{dy}{h(y)} = \\int g(x)\\,dx + C$$

The step with the differentials looks like sleight of hand, but it is just the chain rule. If $y(x)$ is a solution, then $\\dfrac{1}{h(y(x))}\\,y'(x) = g(x)$; integrating both sides with respect to $x$ and [[integration-by-substitution|substituting]] $u = y(x)$ on the left gives exactly the formula above.

### Two quick examples
**Growth:** $y' = ky$ gives $\\int dy/y = \\int k\\,dt$, so $\\ln|y| = kt + C$ and $y = Ae^{kt}$ — the [[exponential-models|exponential model]].

**A bell curve:** $y' = xy$ gives $\\ln|y| = x^2/2 + C$, so $y = Ae^{x^2/2}$; the sign-flipped $y' = -xy$ gives the Gaussian $Ae^{-x^2/2}$.

### Draining a tank
Water leaves a hole of area $a$ in the bottom of a tank with cross-section $A$ at the speed $\\sqrt{2gh}$ found by Torricelli — the [[physics:bernoullis-equation|Bernoulli equation]] in its simplest form. The volume lost per second is $a\\sqrt{2gh}$, so the level obeys

$$A\\frac{dh}{dt} = -a\\sqrt{2gh}$$

Separate: $h^{-1/2}\\,dh = -\\dfrac{a}{A}\\sqrt{2g}\\,dt$. Integrating from the start, when the level is $H$, gives $2\\sqrt h = 2\\sqrt H - \\dfrac{a}{A}\\sqrt{2g}\\,t$, so $\\sqrt h$ falls linearly and the tank is empty at

$$T = \\frac{A}{a}\\sqrt{\\frac{2H}{g}}$$

The flow slows as the level falls: the bottom half of the height takes about 71% of the total time. (A real sharp-edged hole behaves as if its area were about 0.6 of its true area, because the jet contracts; use that effective area.)

### Things to watch
- **Lost solutions.** Dividing by $h(y)$ assumes $h(y) \\ne 0$. Each zero of $h$ is a constant solution — an equilibrium — that must be added back (often it is the case $A = 0$).
- **Implicit answers.** $\\int dy/h$ may not be solvable for $y$; a relation such as $y^3 + y = x^2 + C$ is a perfectly good answer.
- **Blow-up.** $y' = y^2$ separates to $-1/y = x + C$; with $y(0) = 1$, $y = 1/(1 - x)$, which is infinite at $x = 1$. Nothing in the equation warns you.
- **One constant is enough**, but it must appear when you integrate, before solving for $y$: $\\ln y = x^2/2 + C$ leads to $y = Ae^{x^2/2}$, not to $e^{x^2/2} + C$.

Separation also solves the [[logistic-equation|logistic equation]] (with [[partial-fractions|partial fractions]]), Newton's law of cooling and many rate laws of chemistry. Equations that do not separate, like $y' = x + y$, often yield to the [[first-order-linear|integrating factor]] instead.
`,
  ideas: [
    'Separable means $dy/dx = g(x)\\,h(y)$: the rate is a product of a function of x and a function of y.',
    'Put each variable on its own side and integrate: $\\int dy/h(y) = \\int g(x)\\,dx + C$.',
    'The manipulation of differentials is the chain rule in reverse, so it is fully rigorous.',
    'Zeros of h(y) are constant solutions that division throws away; check them separately.',
    'Answers may be implicit, and solutions may blow up at a finite x.'
  ],
  pitfalls: [
    'Adding the constant at the very end — Add it when you integrate. From $\\ln y = x^2/2 + C$ you get $y = Ae^{x^2/2}$, a multiplicative constant, not $e^{x^2/2} + C$.',
    'Dividing by h(y) without a second thought — Where $h(y) = 0$ there are constant solutions that the division silently loses.',
    'Every first-order equation can be separated — $y\' = x + y$ cannot; it is linear and needs an integrating factor.'
  ],
  formulas: [
    {
      name: 'Time to drain a tank (Torricelli)',
      expr: 'T = A/a*sqrt(2*H/g)', tex: 'T = \\frac{A}{a}\\sqrt{\\frac{2H}{g}}',
      vars: {
        T: { name: 'time to empty', q: 'time', unit: 'min' },
        A: { name: 'cross-section of the tank', q: 'area', unit: 'm²', value: 0.5 },
        a: { name: 'area of the hole', q: 'area', unit: 'cm²', value: 2 },
        H: { name: 'starting depth of water', q: 'length', unit: 'm', value: 1 },
        g: { const: 'g' }
      },
      note: 'Straight-sided tank, water leaving at $\\sqrt{2gh}$. For a sharp-edged hole use about 0.6 of its real area.',
      stories: {
        T: 'A water butt with a cross-section of {A} is filled to {H}. A hole of {a} is opened in its base. How long until it is empty?',
        a: 'How large a drain hole empties a tank of cross-section {A}, filled to {H}, in {T}?'
      }
    },
    {
      name: 'Depth while draining',
      expr: 'h = (sqrt(H) - a/A*sqrt(g/2)*t)^2', tex: 'h = \\left(\\sqrt{H} - \\frac{a}{A}\\sqrt{\\frac{g}{2}}\\;t\\right)^2',
      vars: {
        h: { name: 'depth at time t', q: 'length', unit: 'm' },
        H: { name: 'starting depth', q: 'length', unit: 'm', value: 1 },
        a: { name: 'area of the hole', q: 'area', unit: 'cm²', value: 2 },
        A: { name: 'cross-section of the tank', q: 'area', unit: 'm²', value: 0.5 },
        t: { name: 'time since opening', q: 'time', unit: 'min', value: 5, min: 0, max: 18 },
        g: { const: 'g' }
      },
      note: 'Valid until the tank is empty, at $t = T$; after that the formula means nothing.',
      practice: { unknowns: ['h'] },
      stories: { h: 'A tank of cross-section {A}, filled to {H}, drains through a hole of {a}. How deep is the water after {t}?' }
    },
    {
      name: 'Blow-up time of y′ = ky²',
      expr: 'T = 1/(k*y0)', tex: 'T = \\frac{1}{k\\,y_0}',
      vars: {
        T: { name: 'time at which y becomes infinite', tex: 'T' },
        k: { name: 'coefficient k', value: 1 },
        y0: { name: 'starting value (positive)', tex: 'y_0', value: 0.5 }
      },
      note: 'The solution is $y = y_0/(1 - k y_0 t)$. Doubling the start halves the time to blow-up.'
    }
  ],
  examples: [
    {
      title: 'A bell-shaped solution',
      q: 'Solve $y\' = xy$ with $y(0) = 2$ and find $y(1)$.',
      steps: [
        'Separate: $\\dfrac{dy}{y} = x\\,dx$.',
        'Integrate: $\\ln|y| = \\dfrac{x^2}{2} + C$, so $y = Ae^{x^2/2}$ with $A = \\pm e^C$ (and $A = 0$ gives the lost solution $y = 0$).',
        'Initial condition: $y(0) = A = 2$, so $y = 2e^{x^2/2}$.',
        '$y(1) = 2e^{0.5} = 3.297$.'
      ],
      a: 'y = 2e^(x²/2); y(1) ≈ 3.30'
    },
    {
      title: 'Emptying a water butt',
      q: 'A cylindrical water butt 1.2 m tall with cross-section 0.3 m² is full. A hole with an effective area of 1 cm² is opened at the bottom. How long does it take to empty, and how long to fall to half its depth?',
      steps: [
        '$T = \\dfrac{A}{a}\\sqrt{\\dfrac{2H}{g}} = \\dfrac{0.3}{1\\times10^{-4}}\\sqrt{\\dfrac{2.4}{9.81}} = 3000 \\times 0.4946 = 1484\\ \\mathrm{s}$, about 25 minutes.',
        'Since $\\sqrt h$ falls linearly in time, reaching $h = H/2$ takes the fraction $1 - \\sqrt{1/2} = 0.293$ of $T$.',
        'That is $0.293 \\times 1484 = 435\\ \\mathrm{s}$, about 7 minutes: the top half goes in 7 minutes, the bottom half takes 18.'
      ],
      a: 'About 25 min to empty; 7 min to half depth.'
    }
  ],
  quiz: [
    { q: 'Which equation is separable?', choices: ['$y\' = x + y$', '$y\' = xy + x$', '$y\' = \\sin(xy)$', '$y\' = x^2 + y^2$'], a: 1,
      why: '$xy + x = x(y + 1)$, a function of $x$ times a function of $y$. The others cannot be factored that way.' },
    { q: 'Solve $y\' = y\\cos x$ with $y(0) = 1$. Give $y(x)$.', answer: 'e^(sin(x))', vars: ['x'],
      why: '$\\int dy/y = \\int \\cos x\\,dx$ gives $\\ln y = \\sin x + C$; $y(0) = 1$ makes $C = 0$, so $y = e^{\\sin x}$.' },
    { q: 'A tank drains through a hole in its base. Compared with the time for the top half of the depth to drain, the bottom half takes…', choices: ['the same time', 'less time', 'about 2.4 times as long', 'exactly twice as long'], a: 2,
      why: '$\\sqrt h$ falls at a steady rate. From $H$ to $H/2$ it drops by $0.29\\sqrt H$; from $H/2$ to 0 by $0.71\\sqrt H$ — about 2.4 times as much.' },
    { q: 'When separating $dy/dx = y(1 - y)$, dividing by $y(1 - y)$ can lose the solutions $y = 0$ and $y = 1$.', a: true,
      why: 'Both make $y(1-y)$ zero, so division is not allowed there. They are the two equilibrium solutions and must be added back.' },
    { q: 'Separating $y\' = -y^2$ with $y(0) = 1$ gives…', choices: ['$y = e^{-x}$', '$y = \\dfrac{1}{1 + x}$', '$y = 1 - x$', '$y = \\dfrac{1}{1 - x}$'], a: 1,
      why: '$\\int dy/y^2 = -\\int dx$ gives $-1/y = -x + C$; $y(0) = 1$ gives $C = -1$, so $1/y = x + 1$.' }
  ],
  applications: [
    'Draining and filling tanks, reservoirs and hourglasses.',
    'Chemical rate laws such as $d[A]/dt = -k[A]^2$ for second-order reactions.',
    'Population and growth models, including the logistic equation.',
    'Cooling, charging and decay laws, which all separate.'
  ],
  sim: { id: 'so-slope-field', params: { eq: 'circ' } }
},

{
  id: 'first-order-linear', parent: 'first-order-odes', title: 'First-order linear equations', level: 2,
  short: 'Equations $y\' + p(x)\\,y = q(x)$, solved by an integrating factor that turns the left side into one derivative. They describe everything that relaxes towards a steady state.',
  keywords: ['linear first-order equation', 'integrating factor', 'time constant', 'steady state', 'transient', 'step response', 'relaxation', 'RC circuit', 'mixing tank', 'terminal velocity', 'Newton cooling'],
  prereq: ['differential-equations-intro', 'differentiation-rules', 'antiderivatives'],
  related: ['separable-equations', 'exponential-models', 'second-order-linear', 'physics:rc-circuits', 'physics:rl-circuits', 'physics:newtons-law-of-cooling', 'physics:drag-force'],
  body: `
A first-order equation is **linear** when it can be written in the **standard form**

$$\\frac{dy}{dx} + p(x)\\,y = q(x)$$

with $y$ and $y'$ appearing only to the first power. The functions $p$ and $q$ may be anything.

### The integrating factor
The trick is to multiply the whole equation by a function $\\mu(x)$ chosen so that the left side becomes the derivative of a product. By the product rule $(\\mu y)' = \\mu y' + \\mu' y$, which matches $\\mu y' + \\mu p y$ exactly when $\\mu' = p\\mu$, that is

$$\\mu(x) = e^{\\int p(x)\\,dx}$$

Then the equation reads $(\\mu y)' = \\mu q$, and one integration finishes the job:

$$y = \\frac{1}{\\mu(x)}\\left(\\int \\mu(x)\\,q(x)\\,dx + C\\right)$$

### Constant coefficients: relaxation
The most important case in physics and engineering has constant coefficients. Written with a **time constant** $\\tau$ and a **steady value** $y_\\infty$,

$$\\tau\\,\\frac{dy}{dt} + y = y_\\infty \\quad\\Longrightarrow\\quad y(t) = y_\\infty + (y_0 - y_\\infty)\\,e^{-t/\\tau}$$

The gap between $y$ and its steady value shrinks by the same factor in every interval of length $\\tau$: after $\\tau$ you have covered 63% of the way, after $3\\tau$ 95%, after $5\\tau$ 99.3%. The same equation appears everywhere:

| System | Equation | Time constant | Steady value |
|---|---|---|---|
| capacitor charging through a resistor | $RC\\,\\dot V + V = V_s$ | $RC$ | $V_s$ |
| current building up in an inductor | $L\\,\\dot I + RI = V$ | $L/R$ | $V/R$ |
| a drink cooling in a room | $\\dot T = -k(T - T_a)$ | $1/k$ | $T_a$ |
| falling with drag proportional to speed | $m\\dot v = mg - bv$ | $m/b$ | $mg/b$ |

These are the [[physics:rc-circuits|RC]] and [[physics:rl-circuits|RL]] circuits, [[physics:newtons-law-of-cooling|Newton's law of cooling]] and the approach to [[physics:drag-force|terminal velocity]].

### Transient plus steady state
The solution always has the shape **particular + homogeneous**: a particular solution $y_p$ that describes the steady response to the input $q$, plus $Ce^{-\\int p\\,dx}$, the solution with no input, which carries the memory of the starting value and (when $p > 0$) dies away — the *transient*. The same structure returns, richer, in [[second-order-linear|second-order linear equations]].

### A mixing tank
A 100 L tank of pure water receives brine with 20 g of salt per litre at 5 L/min, and the well-stirred mixture leaves at the same rate. The salt $S$ (in grams) enters at $20 \\times 5 = 100$ g/min and leaves at $5 \\times S/100$ g/min:

$$\\frac{dS}{dt} = 100 - \\frac{S}{20} \\quad\\Rightarrow\\quad S = 2000\\left(1 - e^{-t/20}\\right)$$

The time constant is 20 min (the tank volume divided by the flow), and the salt approaches 2000 g — a concentration of 20 g/L, equal to the inflow. After 30 min there are 1554 g.
`,
  ideas: [
    'Standard form $y\' + p(x)y = q(x)$; multiplying by $\\mu = e^{\\int p\\,dx}$ turns the left side into $(\\mu y)\'$.',
    'With constant coefficients the solution relaxes exponentially: $y = y_\\infty + (y_0 - y_\\infty)e^{-t/\\tau}$.',
    'The time constant τ sets the pace: 63% of the way after τ, 99% after about 5τ.',
    'General solution = a particular (steady) response + the homogeneous (transient) part.',
    'RC and RL circuits, cooling, mixing and linear drag are all the same equation.'
  ],
  pitfalls: [
    'Multiplying only the left side by the integrating factor — The whole equation must be multiplied, right side included.',
    'Skipping the standard form — $\\mu = e^{\\int p\\,dx}$ assumes the coefficient of $y\'$ is 1. For $x\\,y\' + 2y = x^2$ divide by $x$ first: $p = 2/x$, not 2.',
    'The time constant is the time to reach the steady state — After one τ you are only 63% of the way there. In theory you never arrive; in practice about 5τ counts as settled.'
  ],
  derivation: {
    title: 'Where the integrating factor comes from',
    steps: [
      { text: 'Multiply $y\' + py = q$ by an unknown $\\mu(x)$:', tex: '\\mu y\' + \\mu p\\,y = \\mu q' },
      { text: 'The product rule gives $(\\mu y)\' = \\mu y\' + \\mu\' y$. The left side matches it if', tex: '\\mu\' = p\\,\\mu \\;\\Rightarrow\\; \\frac{\\mu\'}{\\mu} = p \\;\\Rightarrow\\; \\mu = e^{\\int p\\,dx}' },
      { text: 'Now the equation is a single derivative, so integrate:', tex: '(\\mu y)\' = \\mu q \\;\\Rightarrow\\; \\mu y = \\int \\mu q\\,dx + C' },
      { text: 'Divide by $\\mu$:', tex: 'y = e^{-\\int p\\,dx}\\left(\\int e^{\\int p\\,dx}\\,q\\,dx + C\\right)' }
    ]
  },
  formulas: [
    {
      name: 'Step response (relaxation)',
      expr: 'y = yinf + (y0 - yinf)*exp(-t/tau)', tex: 'y = y_\\infty + (y_0 - y_\\infty)\\,e^{-t/\\tau}',
      vars: {
        y: { name: 'value at time t', signed: true },
        yinf: { name: 'steady (final) value', tex: 'y_\\infty', value: 12, signed: true },
        y0: { name: 'starting value', tex: 'y_0', value: 2, signed: true },
        t: { name: 'time', q: 'time', unit: 's', value: 2 },
        tau: { name: 'time constant', q: 'time', unit: 's', value: 1, tex: '\\tau' }
      },
      note: 'Works for any first-order system with a constant input: a capacitor charging towards the supply voltage, a thermometer settling, a tank filling.',
      stories: {
        y: 'A capacitor starts at {y0} volts and charges towards {yinf} volts with a time constant of {tau}. What is its voltage after {t}?',
        t: 'A sensor reads {y0} and settles towards {yinf} with time constant {tau}. When does it read {y}?',
        tau: 'A thermometer moved into a bath reads {y0}, then {y} after {t}; the bath is at {yinf}. What is its time constant?'
      }
    },
    {
      name: 'Time to settle within a fraction',
      expr: 't = tau*ln(1/f)', tex: 't = \\tau\\ln\\frac{1}{f}',
      vars: {
        t: { name: 'time needed', q: 'time', unit: 's' },
        tau: { name: 'time constant', q: 'time', unit: 's', value: 20, tex: '\\tau' },
        f: { name: 'fraction of the gap still remaining', q: 'ratio', unit: '%', value: 1, min: 0.0001, max: 100 }
      },
      note: 'To within 1% takes $\\tau\\ln 100 = 4.6\\tau$; to within 5% takes $3\\tau$.'
    },
    {
      name: 'Time constant of an RC circuit',
      expr: 'tau = R*C', tex: '\\tau = RC',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 's', tex: '\\tau' },
        R: { name: 'resistance', q: 'resistance', unit: 'kΩ', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 100 }
      },
      stories: { tau: 'A {C} capacitor charges through a {R} resistor. What is the time constant?', C: 'What capacitor gives a time constant of {tau} with a {R} resistor?' }
    }
  ],
  examples: [
    {
      title: 'Salt in a mixing tank',
      q: 'A 100 L tank of pure water receives brine (20 g/L) at 5 L/min; the mixture drains at 5 L/min. How much salt is in the tank after 30 minutes?',
      steps: [
        'Rate in: $20 \\times 5 = 100$ g/min. Rate out: the concentration $S/100$ times 5 L/min.',
        'So $S\' + \\dfrac{S}{20} = 100$, linear with constant coefficients: $\\tau = 20$ min, steady value $S_\\infty = 100 \\times 20 = 2000$ g.',
        'With $S(0) = 0$: $S = 2000\\left(1 - e^{-t/20}\\right)$.',
        'At $t = 30$: $2000(1 - e^{-1.5}) = 2000 \\times 0.777 = 1554$ g.'
      ],
      a: 'About 1550 g (on the way to 2000 g).'
    },
    {
      title: 'A variable coefficient',
      q: 'Solve $x\\,y\' + 2y = x^2$ for $x > 0$.',
      steps: [
        'Standard form first: divide by $x$ to get $y\' + \\dfrac{2}{x}y = x$, so $p = 2/x$ and $q = x$.',
        'Integrating factor: $\\mu = e^{\\int 2/x\\,dx} = e^{2\\ln x} = x^2$.',
        'Then $(x^2 y)\' = x^3$, so $x^2 y = \\dfrac{x^4}{4} + C$.',
        { text: 'Divide by $x^2$:', tex: 'y = \\frac{x^2}{4} + \\frac{C}{x^2}' },
        'Check: $x y\' = \\dfrac{x^2}{2} - \\dfrac{2C}{x^2}$ and $2y = \\dfrac{x^2}{2} + \\dfrac{2C}{x^2}$; they add to $x^2$.'
      ],
      a: 'y = x²/4 + C/x²'
    }
  ],
  quiz: [
    { q: 'What integrating factor solves $y\' + 3y = e^x$?', choices: ['$e^{3x}$', '$3x$', '$e^x$', '$e^{-3x}$'], a: 0,
      why: '$p = 3$, so $\\mu = e^{\\int 3\\,dx} = e^{3x}$. Then $(e^{3x}y)\' = e^{4x}$.' },
    { q: 'Solve $\\dfrac{dy}{dt} + y = 1$ with $y(0) = 0$. Give $y(t)$.', answer: '1 - e^(-t)', vars: ['t'],
      why: 'Time constant 1, steady value 1, start 0: $y = 1 + (0 - 1)e^{-t} = 1 - e^{-t}$.' },
    { q: 'After three time constants, a first-order system has covered roughly what fraction of the way to its steady value?', choices: ['50%', '63%', '95%', '99.3%'], a: 2,
      why: 'The remaining gap is $e^{-3} = 0.050$ of the original, so 95% is done.' },
    { q: 'Starting twice as far from its steady state, a first-order linear system takes twice as long to get halfway there.', a: false,
      why: 'The halfway time is $\\tau\\ln 2$ whatever the starting gap: the gap shrinks by the same factor in equal times. That independence from amplitude is the mark of a linear system.' },
    { q: 'The equation $y\' + p(x)\\,y = q(x)$ is called linear because…', choices: ['its solution is a straight line', '$y$ and $y\'$ appear only to the first power and are not multiplied together', '$p$ and $q$ must be linear functions', 'its coefficients are constant'], a: 1,
      why: 'Linearity is about how the unknown enters. Sums of solutions of the equation with $q = 0$ are again solutions — that is the practical meaning.' }
  ],
  applications: [
    'Charging and discharging capacitors, and current build-up in inductors.',
    'Sensors and thermometers settling to a new reading.',
    'Pollutants, drugs or salt in well-mixed tanks, lakes and organs.',
    'Simple models of heating a building with a thermostat off.'
  ],
  sim: { id: 'so-slope-field', params: { eq: 'lin' } }
},

{
  id: 'exponential-models', parent: 'first-order-odes', title: 'Exponential models', level: 1,
  short: 'When a quantity changes at a rate proportional to itself, it grows or decays exponentially: populations, radioactivity, interest, drugs in the blood, cooling and discharging.',
  keywords: ['exponential growth', 'exponential decay', 'dN/dt = kN', 'growth rate', 'decay constant', 'half-life', 'doubling time', 'rule of 70', 'continuous compounding', 'Newton cooling', 'e-folding time', 'semi-log plot'],
  prereq: ['differential-equations-intro', 'exponential-growth-decay', 'logarithms'],
  related: ['logistic-equation', 'first-order-linear', 'separable-equations', 'number-e', 'physics:half-life', 'physics:radiocarbon-dating', 'physics:activity', 'physics:rc-circuits', 'physics:newtons-law-of-cooling'],
  body: `
The simplest differential equation of all says that a quantity changes at a rate proportional to its own size:

$$\\frac{dN}{dt} = kN \\quad\\Longrightarrow\\quad N(t) = N_0\\,e^{kt}$$

Each bacterium divides at the same rate, so twice the bacteria make twice the new ones; each unstable nucleus has the same chance of decaying in the next second, so twice the nuclei give twice the decays; each euro in an account earns the same interest. With $k > 0$ the solution grows, with $k < 0$ (often written $-\\lambda$) it decays. The solution follows by [[separable-equations|separating variables]], and it is the reason the [[number-e|number e]] is everywhere: $e^{kt}$ is the function whose rate of change is $k$ times itself.

### Doubling time and half-life
The time for a factor of 2 is the same at every stage — from 1000 to 2000 takes as long as from a million to two million:

$$T_2 = \\frac{\\ln 2}{k} \\approx \\frac{0.693}{k}, \\qquad t_{1/2} = \\frac{\\ln 2}{\\lambda}, \\qquad N = N_0\\left(\\tfrac12\\right)^{t/t_{1/2}}$$

With a growth rate of $p$ percent per year, $T_2 \\approx 70/p$ years (the **rule of 70**, from $100\\ln 2 = 69.3$): 3% a year doubles in about 23 years, 7% in about 10.

| Process | Rate | Time scale |
|---|---|---|
| bacteria (*E. coli*) in rich broth | $k \\approx 2.1\\ \\mathrm{h^{-1}}$ | doubles every 20 min |
| carbon-14 | $\\lambda = 1.21\\times10^{-4}\\ \\mathrm{yr^{-1}}$ | half-life 5730 years |
| caffeine in an adult | $\\lambda \\approx 0.14\\ \\mathrm{h^{-1}}$ | half-life about 5 h |
| money at 3% a year, compounded continuously | $k = 0.03\\ \\mathrm{yr^{-1}}$ | doubles in 23 years |
| a 100 µF capacitor discharging through 10 kΩ | $1/RC = 1\\ \\mathrm{s^{-1}}$ | time constant 1 s |

These are the [[physics:half-life|decay law]], [[physics:radiocarbon-dating|radiocarbon dating]] and [[physics:rc-circuits|RC circuits]] of physics.

### Why exponential growth cannot last
*E. coli* doubling every 20 minutes would, after 48 hours, number $2^{144} \\approx 2\\times10^{43}$ cells — at a picogram each, thousands of times the mass of the Earth. Real growth runs out of food or space, and the rate per individual falls: that is the [[logistic-equation|logistic equation]].

### Decay of a gap
Many processes approach a final value exponentially rather than zero: a hot drink cooling to room temperature, a capacitor charging to the supply voltage. There it is the **gap** that decays: $T - T_a = (T_0 - T_a)e^{-kt}$ in [[physics:newtons-law-of-cooling|Newton's law of cooling]]. These are the constant-coefficient [[first-order-linear|linear equations]].

### Spotting an exponential in data
Take logarithms: $\\ln N = \\ln N_0 + kt$ is a straight line in $t$. On a [[logarithmic-scales|semi-logarithmic plot]] exponential data line up, and the slope gives $k$ directly — the standard way to measure a half-life or a growth rate.
`,
  ideas: [
    'A rate proportional to the amount, $dN/dt = kN$, gives $N = N_0 e^{kt}$.',
    'Every doubling or halving takes the same time: $T = \\ln 2/|k|$; at p% per year, about 70/p years.',
    'On a logarithmic axis an exponential is a straight line whose slope is k.',
    'For cooling, charging and similar processes it is the gap to the final value that decays exponentially.',
    'No real growth stays exponential for long; limits lead to the logistic equation.'
  ],
  pitfalls: [
    'After two half-lives nothing is left — Each half-life halves what remains: a quarter is left after two, about a thousandth after ten.',
    'Percentage growth rates add up — 10% a year for 10 years multiplies by $1.1^{10} = 2.59$, not by 2.',
    'Exponential means fast — What makes growth exponential is a steady percentage rate. Even 0.5% a year is exponential, and it eventually overtakes any fixed polynomial growth.'
  ],
  formulas: [
    {
      name: 'Exponential growth or decay',
      expr: 'N = N0*exp(k*t)', tex: 'N = N_0\\,e^{kt}',
      vars: {
        N: { name: 'amount at time t' },
        N0: { name: 'starting amount', tex: 'N_0', value: 1000 },
        k: { name: 'growth rate (negative for decay)', q: 'decayconst', unit: '1/h', value: 0.5, signed: true },
        t: { name: 'time', q: 'time', unit: 'h', value: 4 }
      },
      stories: {
        N: 'A culture of {N0} cells grows at a rate {k}. How many cells are there after {t}?',
        t: 'Starting from {N0}, how long does growth at the rate {k} take to reach {N}?',
        k: 'A colony grows from {N0} to {N} in {t}. What is its growth rate?'
      }
    },
    {
      name: 'Doubling time or half-life',
      expr: 'T = ln(2)/k', tex: 'T = \\frac{\\ln 2}{k}',
      vars: {
        T: { name: 'doubling time (or half-life)', q: 'time', unit: 'yr' },
        k: { name: 'growth (or decay) rate', q: 'decayconst', unit: '1/yr', value: 0.03 }
      },
      stories: { T: 'An investment grows continuously at a rate {k}. How long does it take to double?', k: 'An isotope has a half-life of {T}. What is its decay constant?' }
    },
    {
      name: 'Decay measured in half-lives',
      expr: 'N = N0*0.5^(t/th)', tex: 'N = N_0\\left(\\tfrac12\\right)^{t/t_{1/2}}',
      vars: {
        N: { name: 'amount left', q: 'ratio', unit: '%' },
        N0: { name: 'starting amount', tex: 'N_0', q: 'ratio', unit: '%', value: 100 },
        t: { name: 'time elapsed', q: 'time', unit: 'yr', value: 10000 },
        th: { name: 'half-life', q: 'time', unit: 'yr', value: 5730, tex: 't_{1/2}' }
      },
      stories: {
        N: 'Carbon-14 has a half-life of {th}. What percentage of it is left in a bone after {t}?',
        t: 'A sample keeps {N} of its original carbon-14 (half-life {th}). How old is it?'
      }
    },
    {
      name: 'Newton\'s law of cooling',
      expr: 'T = Ta + (T0 - Ta)*exp(-k*t)', tex: 'T = T_a + (T_0 - T_a)\\,e^{-kt}',
      vars: {
        T: { name: 'temperature at time t', q: 'temperature', unit: '°C' },
        Ta: { name: 'surrounding temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_a' },
        T0: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 90, tex: 'T_0' },
        k: { name: 'cooling constant', q: 'decayconst', unit: '1/min', value: 0.056 },
        t: { name: 'time', q: 'time', unit: 'min', value: 10 }
      },
      stories: {
        T: 'A cup of tea at {T0} stands in a room at {Ta}; its cooling constant is {k}. How hot is it after {t}?',
        t: 'Tea at {T0} cools in a room at {Ta} with cooling constant {k}. When does it reach {T}?'
      }
    }
  ],
  examples: [
    {
      title: 'Radiocarbon dating',
      q: 'Charcoal from an old hearth has 30% of the carbon-14 found in living wood. How old is it? (Half-life 5730 years.)',
      steps: [
        'Write $0.30 = \\left(\\tfrac12\\right)^{t/5730}$.',
        'Take logarithms: $\\dfrac{t}{5730} = \\dfrac{\\ln(1/0.30)}{\\ln 2} = \\dfrac{1.204}{0.693} = 1.737$ half-lives.',
        '$t = 1.737 \\times 5730 \\approx 9950$ years.'
      ],
      a: 'About 10 000 years.'
    },
    {
      title: 'A cooling cup of coffee',
      q: 'Coffee at 90 °C is left in a 20 °C room. After 10 minutes it is at 60 °C. When will it reach 40 °C?',
      steps: [
        'The gap decays: $T - 20 = 70\\,e^{-kt}$.',
        'At 10 min the gap is 40: $40 = 70\\,e^{-10k}$, so $k = \\dfrac{\\ln(70/40)}{10} = 0.0560\\ \\mathrm{min^{-1}}$.',
        'For 40 °C the gap is 20: $20 = 70\\,e^{-kt}$, so $t = \\dfrac{\\ln 3.5}{0.0560} = 22.4$ min.',
        'Each 10 minutes the gap shrinks by the same factor, 40/70: from 70 to 40 to 22.9 to 13.1 …'
      ],
      a: 'After about 22 minutes.'
    }
  ],
  quiz: [
    { q: 'A population doubles every 3 hours. How long does it take to grow sixteenfold?', choices: ['12 h', '16 h', '48 h', '5.3 h'], a: 0,
      why: '$16 = 2^4$: four doublings of 3 hours each.' },
    { q: 'After 5 half-lives, what fraction of a radioactive sample remains?', choices: ['1/5', '1/10', '1/32', '1/25'], a: 2,
      why: '$(1/2)^5 = 1/32$, about 3%.' },
    { q: 'Solve $dN/dt = -0.2N$ with $N(0) = 50$. Give $N(t)$.', answer: '50e^(-0.2t)', vars: ['t'],
      why: 'Exponential decay with $k = -0.2$ and $N_0 = 50$: $N = 50e^{-0.2t}$.' },
    { q: 'Growth at 7% a year doubles the quantity in about 10 years.', a: true,
      why: 'Rule of 70: $70/7 = 10$. Exactly, $\\ln 2/\\ln 1.07 = 10.2$ years with yearly compounding.' },
    { q: 'On a graph of $\\ln N$ against $t$, exponential decay appears as…', choices: ['a straight line with negative slope', 'a parabola', 'a hyperbola', 'a curve that levels off'], a: 0,
      why: '$\\ln N = \\ln N_0 - \\lambda t$ is linear in $t$, with slope $-\\lambda$.' }
  ],
  applications: [
    'Dating archaeological finds and rocks by radioactive decay.',
    'Dosing medicines, using the elimination half-life.',
    'Early phases of epidemics and bacterial growth.',
    'Continuous compounding and inflation in finance.'
  ],
  history: 'Thomas Malthus argued in 1798 that populations tend to grow geometrically. Ernest Rutherford measured the first radioactive half-life, of thorium emanation, in 1900, and with Frederick Soddy explained radioactivity as exponential transformation in 1902.',
  sim: { id: 'so-logistic', params: { r: 0.3 } }
},

{
  id: 'logistic-equation', parent: 'first-order-odes', title: 'The logistic equation', level: 2,
  short: 'Growth that starts exponential and levels off at a carrying capacity: $P\' = rP(1 - P/K)$, whose S-shaped solution describes populations, epidemics, autocatalytic reactions and the spread of new ideas.',
  keywords: ['logistic equation', 'logistic growth', 'carrying capacity', 'S-curve', 'sigmoid', 'Verhulst', 'inflection point', 'maximum sustainable yield', 'harvesting', 'saturation', 'logistic map'],
  prereq: ['exponential-models', 'separable-equations', 'partial-fractions'],
  related: ['slope-fields', 'euler-method', 'first-order-linear'],
  body: `
[[exponential-models|Exponential growth]] assumes unlimited resources. In 1838 Pierre-François Verhulst proposed the simplest correction: let the growth rate *per individual* fall in a straight line as the population $P$ approaches a limit $K$, the **carrying capacity**:

$$\\frac{dP}{dt} = rP\\left(1 - \\frac{P}{K}\\right)$$

When $P$ is small compared with $K$, the bracket is nearly 1 and growth is exponential at rate $r$. As $P$ approaches $K$ the bracket shrinks to zero and growth stops. Above $K$ the bracket is negative and the population falls back.

### The solution
The equation is [[separable-equations|separable]], and [[partial-fractions|partial fractions]] do the integral (see the derivation below). The result is

$$P(t) = \\frac{K}{1 + A\\,e^{-rt}}, \\qquad A = \\frac{K - P_0}{P_0}$$

— the **logistic** or **sigmoid** curve, an S that starts off exponential, straightens, and levels out at $K$.

### Reading the S-curve
- **Equilibria**: $P = 0$ is unstable (any small population grows), $P = K$ is stable ([[slope-fields|see the slope field]]).
- **Fastest growth at half capacity**: $P' = rP - rP^2/K$ is a downward parabola in $P$, largest at $P = K/2$, where the growth rate is $rK/4$. That is the inflection point of the S.
- **When**: the curve passes $K/2$ at $t^* = \\dfrac1r\\ln\\dfrac{K - P_0}{P_0}$, and it is symmetric about that moment.

### Harvesting and collapse
A fishery that removes a steady $H$ fish per year obeys $P' = rP(1 - P/K) - H$. The equilibria are where the parabola $rP(1 - P/K)$ meets the line at height $H$:
- if $H < rK/4$ there are two — an upper stable one and a lower unstable one — and the stock survives;
- at $H = rK/4$, the **maximum sustainable yield**, they merge at $K/2$;
- if $H > rK/4$ there are none, and the population collapses whatever its size.

Near the threshold the margin is thin: a bad year can push the stock below the unstable equilibrium, and then even the old catch drives it to extinction. The collapse of the Newfoundland cod fishery around 1992 is often discussed in these terms.

### The same curve elsewhere
- **Epidemics**: early in an outbreak each case infects others at a steady rate; as susceptible people run out, new infections slow — the cumulative number of cases traces an S.
- **Autocatalytic reactions**, where a product speeds up its own formation: rate ∝ [product] × [remaining reactant].
- **Adoption of technologies**, from telephones to smartphones, often follows an S-curve of market share.
- The function $1/(1 + e^{-x})$ is the "sigmoid" of statistics and neural networks.

Replace the continuous equation with generations, $x_{n+1} = r\\,x_n(1 - x_n)$, and something remarkable happens: for $r$ above about 3.57 the **logistic map** becomes chaotic, as Robert May showed in 1976. The continuous equation is always tame; the discrete one is not.
`,
  ideas: [
    'Per-capita growth falls linearly with population: $P\' = rP(1 - P/K)$.',
    'The solution is the S-curve $P = K/(1 + Ae^{-rt})$ with $A = (K - P_0)/P_0$.',
    '0 is an unstable equilibrium and K a stable one; populations above K fall back to it.',
    'Growth is fastest at $P = K/2$, where it equals $rK/4$ — the maximum sustainable harvest.',
    'Harvesting more than rK/4 removes every equilibrium and the population collapses.'
  ],
  pitfalls: [
    'The carrying capacity can never be exceeded — A population can start above K (after restocking, or a good year) and then declines towards K.',
    'Logistic growth is fastest at the start — Per individual, yes; in total numbers it is fastest at K/2, where the S is steepest.',
    'Real populations follow the logistic curve exactly — It is a first model. Delays, seasons, predators and chance make real populations overshoot, oscillate or crash.'
  ],
  derivation: {
    title: 'Solving the logistic equation',
    steps: [
      { text: 'Separate the variables:', tex: '\\int \\frac{dP}{P\\,(1 - P/K)} = \\int r\\,dt' },
      { text: 'Partial fractions split the left side:', tex: '\\frac{1}{P\\,(1 - P/K)} = \\frac{K}{P(K - P)} = \\frac1P + \\frac{1}{K - P}' },
      { text: 'Integrate (for $0 < P < K$):', tex: '\\ln P - \\ln(K - P) = rt + C \\;\\Rightarrow\\; \\frac{P}{K - P} = B\\,e^{rt}' },
      { text: 'Solve for $P$ and use $P(0) = P_0$, which gives $B = P_0/(K - P_0)$:', tex: 'P = \\frac{K}{1 + \\frac{1}{B}e^{-rt}} = \\frac{K}{1 + \\frac{K - P_0}{P_0}\\,e^{-rt}}' }
    ]
  },
  formulas: [
    {
      name: 'Logistic growth',
      expr: 'P = K/(1 + (K/P0 - 1)*exp(-r*t))', tex: 'P = \\frac{K}{1 + \\left(\\frac{K}{P_0} - 1\\right)e^{-rt}}',
      vars: {
        P: { name: 'population at time t' },
        K: { name: 'carrying capacity', value: 500 },
        P0: { name: 'starting population', tex: 'P_0', value: 10 },
        r: { name: 'growth rate per unit time (e.g. per year)', value: 0.5 },
        t: { name: 'time (in the same units)', value: 10 }
      },
      practice: { unknowns: ['P', 't', 'P0'] },
      stories: {
        P: 'A lake that can support {K} fish is stocked with {P0}; their growth rate is {r} per year. How many fish are there after {t} years?',
        t: 'With carrying capacity {K}, growth rate {r} per year and a start of {P0}, how many years until the population reaches {P}?'
      }
    },
    {
      name: 'Time to reach half capacity',
      expr: 't = ln(K/P0 - 1)/r', tex: 't_{K/2} = \\frac{1}{r}\\ln\\left(\\frac{K}{P_0} - 1\\right)',
      vars: {
        t: { name: 'time of fastest growth', tex: 't_{K/2}' },
        K: { name: 'carrying capacity', value: 2000 },
        P0: { name: 'starting population', tex: 'P_0', value: 100 },
        r: { name: 'growth rate per unit time', value: 0.8 }
      },
      stories: { t: 'An outbreak in a closed community of {K} people starts with {P0} cases and spreads at a rate {r} per day. After how many days are half infected?' }
    },
    {
      name: 'Fastest growth and maximum sustainable yield',
      expr: 'G = r*K/4', tex: 'G = \\frac{rK}{4}',
      vars: {
        G: { name: 'fastest growth rate, reached at P = K/2 (individuals per unit time)' },
        r: { name: 'growth rate per unit time', value: 0.8 },
        K: { name: 'carrying capacity', value: 2000 }
      },
      note: 'Reached at $P = K/2$. It is also the largest steady harvest the population can sustain.',
      stories: { G: 'A fish stock has carrying capacity {K} and growth rate {r} per year. What is the largest catch per year it can sustain?' }
    }
  ],
  examples: [
    {
      title: 'Fish in a lake',
      q: 'A lake can support 2000 fish. It is stocked with 100, and the growth rate is $r = 0.8$ per year. When is growth fastest, how many fish are there after 5 years, and what steady catch is sustainable?',
      steps: [
        '$A = (2000 - 100)/100 = 19$, so $P = \\dfrac{2000}{1 + 19e^{-0.8t}}$.',
        'Fastest growth at $P = 1000$: $t^* = \\ln 19/0.8 = 2.944/0.8 = 3.7$ years.',
        'After 5 years: $P = \\dfrac{2000}{1 + 19e^{-4}} = \\dfrac{2000}{1.348} = 1484$ fish.',
        'Maximum sustainable yield: $rK/4 = 0.8 \\times 2000/4 = 400$ fish a year, taken from a stock held at 1000.'
      ],
      a: 'Fastest at 3.7 years; about 1480 fish after 5 years; at most 400 fish a year.'
    },
    {
      title: 'An outbreak in a school',
      q: 'In a boarding school of 1000 pupils, a cold starts with 5 cases and spreads at $r = 0.9$ per day, modelled as logistic. When have half the pupils caught it?',
      steps: [
        'Here $K = 1000$ and $P_0 = 5$, so $A = 995/5 = 199$.',
        '$t^* = \\dfrac{\\ln 199}{0.9} = \\dfrac{5.29}{0.9} = 5.9$ days.',
        'The first 5 cases take about a day to double; by day 6 the school is at the steepest part of the S, and by day 12 almost everyone has had it.'
      ],
      a: 'After about 6 days.'
    }
  ],
  quiz: [
    { q: 'In the logistic model, the population grows fastest (in individuals per year) when $P$ equals…', choices: ['$P_0$', '$K/4$', '$K/2$', '$K$'], a: 2,
      why: '$P\' = rP(1 - P/K)$ is a downward parabola in $P$ with its peak halfway between its zeros, 0 and $K$.' },
    { q: 'A logistic population starts above its carrying capacity. It…', choices: ['grows exponentially', 'falls towards K', 'crashes to zero', 'stays where it is'], a: 1,
      why: 'For $P > K$ the bracket $1 - P/K$ is negative, so $P\' < 0$, and the stable equilibrium $K$ attracts it from above.' },
    { q: 'For $P\' = 0.4P\\,(1 - P/1000)$, what is the largest possible growth rate $P\'$?', answer: '100', vars: [],
      why: 'At $P = 500$: $0.4 \\times 500 \\times \\tfrac12 = 100$, which is $rK/4$.' },
    { q: 'With a steady harvest just below $rK/4$, the population can survive — but a modest disturbance can still send it to collapse.', a: true,
      why: 'The stable and unstable equilibria are then very close together, so a small drop can carry the population below the unstable one, from which it declines to zero.' },
    { q: 'Early on, while $P \\ll K$, the logistic curve looks like…', choices: ['a straight line', 'exponential growth', 'a downward parabola', 'logarithmic growth'], a: 1,
      why: 'With $P/K$ negligible the equation is $P\' \\approx rP$.' }
  ],
  applications: [
    'Population ecology and fisheries management.',
    'Epidemic curves and the spread of rumours or innovations.',
    'Autocatalytic chemical reactions and tumour growth models.',
    'The sigmoid function in statistics (logistic regression) and neural networks.'
  ],
  history: 'Pierre-François Verhulst introduced the equation in 1838 as a response to Malthus, and named its solution the logistic curve. Raymond Pearl and Lowell Reed popularised it for populations in the 1920s; in 1976 Robert May showed that its discrete-time cousin can behave chaotically.',
  sim: 'so-logistic'
},

{
  id: 'euler-method', parent: 'first-order-odes', title: 'Euler\'s method', level: 2,
  short: 'The simplest way to solve a differential equation on a computer: from where you are, step a short way along the tangent, then repeat.',
  keywords: ['Euler method', 'numerical solution', 'step size', 'truncation error', 'local error', 'global error', 'order of accuracy', 'Heun', 'improved Euler', 'Runge-Kutta', 'RK4', 'stability', 'stiff equation', 'implicit method'],
  prereq: ['slope-fields', 'linear-approximation', 'differential-equations-intro'],
  related: ['numerical-integration', 'newtons-method', 'taylor-series', 'sequences'],
  body: `
Most differential equations have no formula solution — a pendulum swinging through large angles, three bodies under gravity, the weather. So we compute. At the point $(t_n, y_n)$ the equation $y' = f(t, y)$ tells us the slope; follow the tangent for a short step $h$:

$$y_{n+1} = y_n + h\\,f(t_n, y_n), \\qquad t_{n+1} = t_n + h$$

That is **Euler's method**: the [[linear-approximation|linear approximation]] used again and again, or, in pictures, walking through the [[slope-fields|slope field]] in straight segments.

### A table by hand
For $y' = y$, $y(0) = 1$ with $h = 0.5$, each step multiplies by $1 + h = 1.5$: $1,\\ 1.5,\\ 2.25,\\ 3.375,\\ 5.0625$ at $t = 2$, against the exact $e^2 = 7.389$ — 32% low, because the true curve bends upwards away from every tangent. Smaller steps help:

| step $h$ | steps | Euler's $y(2)$ | error |
|---|---|---|---|
| 0.5 | 4 | 5.063 | 2.33 |
| 0.25 | 8 | 5.960 | 1.43 |
| 0.1 | 20 | 6.727 | 0.66 |

Here Euler's answer is $(1 + h)^{2/h}$, the same expression as compound interest, and its limit as $h \\to 0$ is $e^2$: the [[sequences|sequence]] that defines $e$.

### How the error behaves
Each step makes a **local error** of order $h^2$ — the tangent misses the curvature term $\\tfrac12 y'' h^2$ of the [[taylor-series|Taylor series]]. Covering a fixed time takes $T/h$ steps, so the **global error** is of order $h$: Euler's method is **first order**. Ten times more accuracy costs ten times more steps — to get $e^2$ right to 0.01 needs about 1500 steps.

### Better methods
- **Heun's method** (improved Euler) takes a trial Euler step, measures the slope at its end, and moves with the average of the two slopes. Error of order $h^2$.
- The classical **Runge–Kutta method (RK4)** samples the slope four times per step and combines them with weights $1, 2, 2, 1$. Error of order $h^4$: halve the step and the error falls sixteenfold. With $h = 0.1$ its error in $e^2$ is only about $1\\times10^{-5}$. It is the workhorse of scientific computing, and the simulations in this app use it.
- Professional solvers also **adapt the step**, shrinking it where the solution changes quickly and stretching it where it is smooth.

### Stability
Apply Euler's method to decay, $y' = -\\lambda y$: each step multiplies by $1 - \\lambda h$. If $h > 2/\\lambda$ that factor is less than $-1$, and the numbers oscillate and grow while the true solution quietly decays. Equations that mix fast and slow time scales — **stiff** equations, common in chemistry and circuits — force tiny steps on such methods. **Implicit** methods cure this: backward Euler, $y_{n+1} = y_n + h\\,f(t_{n+1}, y_{n+1})$, gives $y_{n+1} = y_n/(1 + \\lambda h)$, stable for any step.

Oscillators reveal another flaw. For $y'' = -y$, written as $y' = v$, $v' = -y$, each Euler step multiplies the amplitude by $\\sqrt{1 + h^2}$: the computed orbit spirals outwards, creating energy from nothing. Updating the velocity first and then using the *new* velocity to move — the semi-implicit (symplectic) Euler method — keeps the energy in check, which is why game physics engines use it.
`,
  ideas: [
    'Euler\'s method steps along the tangent: $y_{n+1} = y_n + h\\,f(t_n, y_n)$.',
    'Its local error is of order $h^2$ and its global error of order h: first order.',
    'Heun (second order) and RK4 (fourth order) sample the slope more cleverly and are far more accurate for the same work.',
    'Too large a step can make a computed solution blow up even when the true one decays: $h < 2/\\lambda$ for $y\' = -\\lambda y$.',
    'Halving the step and comparing is the simplest check on a numerical answer.'
  ],
  pitfalls: [
    'A smaller step always gives a better answer — Only down to a point: with extremely small steps, rounding errors from millions of additions take over. And no step size fixes a wrong model.',
    'A smooth-looking numerical answer must be accurate — A first-order method can drift steadily (Euler\'s planet spirals outwards). Halve the step and see if the answer changes.',
    'The local error is the error you end up with — Each step errs by about $h^2$, but there are $T/h$ steps, so the accumulated error is of order $h$.'
  ],
  formulas: [
    {
      name: 'One Euler step',
      expr: 'y1 = y0 + h*f', tex: 'y_{n+1} = y_n + h\\,f_n',
      vars: {
        y1: { name: 'next value', tex: 'y_{n+1}', signed: true },
        y0: { name: 'current value', tex: 'y_n', value: 1, signed: true },
        h: { name: 'step size', value: 0.1 },
        f: { name: 'slope f(tₙ, yₙ) at the current point', tex: 'f_n', value: 1, signed: true }
      }
    },
    {
      name: 'Euler\'s method for y′ = ky after N steps',
      expr: 'y = y0*(1 + k*T/N)^N', tex: 'y_N = y_0\\left(1 + \\frac{kT}{N}\\right)^N',
      vars: {
        y: { name: 'Euler\'s estimate at time T', tex: 'y_N', signed: true },
        y0: { name: 'starting value', tex: 'y_0', value: 1 },
        k: { name: 'rate k', value: 1, signed: true },
        T: { name: 'end time', value: 2 },
        N: { name: 'number of steps', int: true, value: 4 }
      },
      note: 'The exact answer is $y_0 e^{kT}$. As $N$ grows, $(1 + kT/N)^N \\to e^{kT}$ — compound interest in disguise.',
      practice: { unknowns: ['y'] }
    },
    {
      name: 'Largest stable Euler step for decay',
      expr: 'h = 2/lambda', tex: 'h_{\\max} = \\frac{2}{\\lambda}',
      vars: {
        h: { name: 'largest stable step', tex: 'h_{\\max}', q: 'time', unit: 's' },
        lambda: { name: 'decay rate λ in y′ = −λy', q: 'decayconst', unit: '1/s', value: 8, tex: '\\lambda' }
      },
      note: 'For $h > 2/\\lambda$ the factor $1 - \\lambda h$ is below $-1$ and the numbers explode. For a faithful, non-oscillating answer you need $h < 1/\\lambda$.'
    }
  ],
  examples: [
    {
      title: 'Three Euler steps by hand',
      q: 'Use Euler\'s method with $h = 0.1$ on $y\' = x + y$, $y(0) = 1$, to estimate $y(0.3)$. The exact solution is $y = 2e^x - x - 1$.',
      steps: [
        'Step 1: slope at $(0, 1)$ is $0 + 1 = 1$, so $y_1 = 1 + 0.1 \\times 1 = 1.1$.',
        'Step 2: slope at $(0.1, 1.1)$ is $1.2$, so $y_2 = 1.1 + 0.12 = 1.22$.',
        'Step 3: slope at $(0.2, 1.22)$ is $1.42$, so $y_3 = 1.22 + 0.142 = 1.362$.',
        'Exact: $2e^{0.3} - 1.3 = 2.69972 - 1.3 = 1.39972$. The error, $0.038$, is about 3%; halving $h$ would roughly halve it.'
      ],
      a: 'y(0.3) ≈ 1.362 (exact 1.3997).'
    },
    {
      title: 'When Euler goes unstable',
      q: 'Apply Euler\'s method to $y\' = -8y$, $y(0) = 1$, with $h = 0.3$.',
      steps: [
        'Each step multiplies by $1 - 8 \\times 0.3 = -1.4$.',
        'The computed values are $1,\\ -1.4,\\ 1.96,\\ -2.74,\\ 3.84, \\dots$ — growing and flipping sign.',
        'The true solution $e^{-8t}$ is already below 0.1 after 0.3 time units. The step exceeds $2/\\lambda = 0.25$, so the method is unstable.',
        'With $h = 0.1$ the factor is $0.2$: the numbers shrink (1, 0.2, 0.04, …), too fast but at least in the right direction.'
      ],
      a: 'The numbers explode: h = 0.3 is above the stability limit 0.25.'
    }
  ],
  quiz: [
    { q: 'One Euler step with $h = 0.1$ on $y\' = x + y$, $y(0) = 1$, gives $y(0.1) \\approx$ ?', answer: '1.1', vars: [],
      why: 'The slope at $(0, 1)$ is 1, so $y_1 = 1 + 0.1 \\times 1 = 1.1$.' },
    { q: 'Halving the step size in Euler\'s method roughly…', choices: ['halves the error at a fixed end time', 'quarters it', 'leaves it unchanged', 'doubles it'], a: 0,
      why: 'Euler\'s method is first order: the global error is proportional to $h$.' },
    { q: 'For $y\' = -10y$, which Euler step size is unstable?', choices: ['0.05', '0.1', '0.15', '0.25'], a: 3,
      why: 'Stability needs $|1 - 10h| \\le 1$, that is $h \\le 0.2$. At $h = 0.25$ each step multiplies by $-1.5$.' },
    { q: 'RK4 needs four slope evaluations per step, so for the same accuracy it is always more work than Euler\'s method.', a: false,
      why: 'Its error falls like $h^4$, so it can take far larger steps. For $e^2$ to within $10^{-5}$ RK4 needs about 20 steps; Euler\'s method would need over a million.' },
    { q: 'Applied to the oscillator $y\'\' = -y$, Euler\'s method makes the amplitude…', choices: ['stay exactly constant', 'slowly grow', 'slowly shrink', 'jump about at random'], a: 1,
      why: 'Every step multiplies the amplitude by $\\sqrt{1 + h^2} > 1$: the computed orbit spirals outwards.' }
  ],
  applications: [
    'Every simulation — weather, orbits, circuits, games — advances its equations step by step.',
    'Real-time physics in games uses cheap, stable variants such as semi-implicit Euler.',
    'Adaptive Runge–Kutta solvers (like the ones in scientific software libraries) are refined descendants.'
  ],
  history: 'Leonhard Euler described the method in his *Institutiones calculi integralis* (1768). Carl Runge (1895) and Martin Wilhelm Kutta (1901) developed the higher-order methods that bear their names.',
  sim: 'so-euler'
}

);
