/* HYPER-MATH · content/multivariable.js — calculus of functions of several
 * variables: partial derivatives, multiple integrals, constrained optimisation. */
Hyper.add(

{
  id: 'partial-derivatives', parent: 'multivariable', title: 'Partial derivatives', level: 3,
  short: 'For a function of several variables, the rate of change in one variable while all the others are held fixed; together they form the gradient.',
  keywords: ['partial derivative', '∂f/∂x', 'multivariable', 'function of two variables', 'surface', 'contour map', 'gradient', 'directional derivative', 'total differential', 'mixed partials', 'tangent plane'],
  prereq: ['derivative', 'chain-rule', 'functions'],
  related: ['gradient', 'multiple-integrals', 'lagrange-multipliers', 'error-propagation', 'heat-equation', 'wave-equation', 'physics:ideal-gas-law'],
  body: `
Most quantities depend on more than one thing. The height of a hillside depends on how far east ($x$) and how far north ($y$) you stand; the pressure of a gas depends on its temperature and volume. A function $z = f(x, y)$ can be pictured as a **surface** above the $xy$-plane, or as a **contour map** with lines of equal height, like a hiking map.

### One variable at a time
Walk due east across the hillside. Along that path $y$ is constant, and the steepness you feel is an ordinary derivative in $x$. That is the **partial derivative**

$$\\frac{\\partial f}{\\partial x} = \\lim_{h\\to0}\\frac{f(x + h, y) - f(x, y)}{h},$$

written with a curly $\\partial$ to signal that the other variables are frozen. Likewise $\\partial f/\\partial y$ is the slope walking due north. To compute one, treat the other variables as constants and use the ordinary rules:

$$f = x^2y + 3y^3: \\qquad \\frac{\\partial f}{\\partial x} = 2xy, \\qquad \\frac{\\partial f}{\\partial y} = x^2 + 9y^2.$$

Geometrically, $\\partial f/\\partial x$ is the slope of the curve cut from the surface by a vertical plane $y = $ const.

### Second partials
Differentiating again gives $f_{xx}$, $f_{yy}$ and the **mixed** partials $f_{xy}$ and $f_{yx}$. For any function with continuous second partials the order does not matter: $f_{xy} = f_{yx}$ (Schwarz's theorem). Above, both equal $2x$.

### The gradient
Collect the partials into a vector, the **gradient** $\\nabla f = \\left(\\dfrac{\\partial f}{\\partial x}, \\dfrac{\\partial f}{\\partial y}\\right)$. It points in the direction of **steepest ascent**, its length $|\\nabla f|$ is that steepest slope, and it is always **perpendicular to the contour lines**. The slope in any other direction, at angle $\\theta$ from the $x$-axis, is the **directional derivative**
$$D_\\theta f = \\frac{\\partial f}{\\partial x}\\cos\\theta + \\frac{\\partial f}{\\partial y}\\sin\\theta = \\nabla f\\cdot\\hat u.$$
Water runs down $-\\nabla h$; heat flows down $-\\nabla T$; a ball on a surface rolls along $-\\nabla U$. See [[gradient]].

### Small changes: the total differential
Change both inputs a little and, to first order, the effects add:
$$df = \\frac{\\partial f}{\\partial x}\\,dx + \\frac{\\partial f}{\\partial y}\\,dy.$$
This is the [[linear-approximation|linear approximation]] of a surface by its **tangent plane**, and it is how measurement errors combine ([[error-propagation]]). For the [[physics:ideal-gas-law|ideal gas]], $P = nRT/V$ gives
$$\\frac{dP}{P} = \\frac{dT}{T} - \\frac{dV}{V}:$$
warm a gas by 1% while letting it expand by 2%, and its pressure drops by about 1%. For any product of powers $z = x^a y^b$, relative changes combine as $\\dfrac{dz}{z} = a\\dfrac{dx}{x} + b\\dfrac{dy}{y}$.

### The language of physical law
The great equations of physics are **partial differential equations**: the [[heat-equation|heat equation]] $\\partial T/\\partial t = \\alpha\\,\\partial^2 T/\\partial x^2$, the [[wave-equation|wave equation]], Maxwell's equations, Schrödinger's equation. Thermodynamics is written almost entirely in partial derivatives, with subscripts to say what is held fixed: $(\\partial U/\\partial T)_V$ is the heat capacity at constant volume.
`,
  ideas: [
    '∂f/∂x is the ordinary derivative in x with every other variable held constant.',
    'Mixed partials agree: f_xy = f_yx for smooth functions.',
    'The gradient (∂f/∂x, ∂f/∂y) points uphill, perpendicular to the contours; its length is the steepest slope.',
    'The directional derivative ∇f · û gives the slope in any direction.',
    'The total differential df = f_x dx + f_y dy adds the effects of small changes in each input.'
  ],
  pitfalls: [
    'Treating the other variables as zero — They are held constant, not set to zero: ∂/∂x of x²y is 2xy, not 2x.',
    'Mixing up ∂ and d — ∂f/∂x holds the other inputs fixed; a total derivative df/dt lets all of them change along a path.',
    'The gradient points along the contour lines — It is perpendicular to them, straight up the steepest slope.'
  ],
  formulas: [
    {
      name: 'Relative change of z = xᵃ yᵇ',
      expr: 'rz = a*rx + b*ry', tex: 'r_z = a\\,r_x + b\\,r_y',
      vars: {
        rz: { name: 'relative change of z', tex: 'r_z', q: 'ratio', unit: '%', signed: true },
        a: { name: 'power of x', value: 1, signed: true },
        rx: { name: 'relative change of x', tex: 'r_x', q: 'ratio', unit: '%', value: 1, signed: true },
        b: { name: 'power of y', value: -1, signed: true },
        ry: { name: 'relative change of y', tex: 'r_y', q: 'ratio', unit: '%', value: 2, signed: true }
      },
      note: 'The total differential divided by $z$. The defaults are the ideal gas, $P \\propto T\\,V^{-1}$: 1% warmer and 2% bigger gives 1% less pressure.',
      stories: { rz: 'A quantity is proportional to $x^a y^b$ with $a$ = {a} and $b$ = {b}. If $x$ changes by {rx} and $y$ by {ry}, by how much does it change?' }
    },
    {
      name: 'Directional derivative in the plane',
      expr: 'D = fx*cos(theta) + fy*sin(theta)', tex: 'D = f_x\\cos\\theta + f_y\\sin\\theta',
      vars: {
        D: { name: 'slope in the chosen direction', signed: true },
        fx: { name: 'partial derivative ∂f/∂x', tex: 'f_x', value: -0.6, signed: true },
        fy: { name: 'partial derivative ∂f/∂y', tex: 'f_y', value: -1.6, signed: true },
        theta: { name: 'direction, measured from the x-axis', q: 'angle', unit: '°', value: 45, min: 0, max: 360 }
      },
      note: 'Largest when $\\theta$ points along $\\nabla f$, where it equals $|\\nabla f|$; zero along the contour. Solving for $\\theta$ gives the two directions with a chosen slope.'
    },
    {
      name: 'Steepest slope |∇f|',
      expr: 'G = sqrt(fx^2 + fy^2)', tex: 'G = \\sqrt{f_x^2 + f_y^2}',
      vars: {
        G: { name: 'size of the gradient (steepest slope)' },
        fx: { name: 'partial derivative ∂f/∂x', tex: 'f_x', value: -0.6, signed: true },
        fy: { name: 'partial derivative ∂f/∂y', tex: 'f_y', value: -1.6, signed: true }
      },
      note: 'The slope along the direction of steepest ascent. On a hillside, a slope of 1 means 45°.'
    }
  ],
  examples: [
    {
      title: 'Computing partials',
      q: 'For $f(x, y) = x^2 y + 3y^3$, find $f_x$, $f_y$ and $f_{xy}$ at $(1, 2)$.',
      steps: [
        'Hold $y$ fixed: $f_x = 2xy$, which is 4 at $(1, 2)$.',
        'Hold $x$ fixed: $f_y = x^2 + 9y^2$, which is $1 + 36 = 37$.',
        '$f_{xy} = \\partial(2xy)/\\partial y = 2x = 2$; and $f_{yx} = \\partial(x^2 + 9y^2)/\\partial x = 2x = 2$ as well.'
      ],
      a: 'f_x = 4, f_y = 37, f_xy = 2'
    },
    {
      title: 'On a hillside',
      q: 'A hill has height $h = 100 - 0.01x^2 - 0.02y^2$ metres ($x$ east, $y$ north, in metres). A walker stands at $(30, 40)$. How steep is it walking east, and what is the steepest slope?',
      steps: [
        '$h_x = -0.02x = -0.6$ and $h_y = -0.04y = -1.6$.',
        'Walking east the ground falls 0.6 m per metre.',
        'Steepest slope: $|\\nabla h| = \\sqrt{0.36 + 2.56} = 1.71$, about $60°$, in the direction of $\\nabla h = (-0.6, -1.6)$ uphill, towards the summit at the origin.'
      ],
      a: 'East: −0.6 (downhill); steepest: 1.71'
    },
    {
      title: 'Error in a pendulum measurement of g',
      q: 'The pendulum formula gives $g = 4\\pi^2 L/T^2$. The length is measured to 0.5% and the period to 0.2%. How uncertain is $g$ (worst case)?',
      steps: [
        'Here $g \\propto L^1 T^{-2}$, so $\\dfrac{dg}{g} = \\dfrac{dL}{L} - 2\\dfrac{dT}{T}$.',
        'In the worst case the errors add in size: $0.5\\% + 2 \\times 0.2\\% = 0.9\\%$.',
        'The period is measured more precisely, but because it is squared its error counts double.'
      ],
      a: 'About 0.9%'
    }
  ],
  quiz: [
    { q: 'Find $\\dfrac{\\partial}{\\partial x}\\left(x^2y + \\sin y\\right)$.', answer: '2x y', vars: ['x', 'y'],
      why: '$y$ is a constant here: $x^2y$ gives $2xy$ and $\\sin y$ gives 0.' },
    { q: 'Find $\\dfrac{\\partial}{\\partial y}\\left(x^2y + \\sin y\\right)$.', answer: 'x^2 + cos(y)', vars: ['x', 'y'],
      why: 'Now $x$ is the constant: $x^2y$ gives $x^2$ and $\\sin y$ gives $\\cos y$.' },
    { q: 'The gradient of a function at a point is…', choices: ['along the contour line through that point', 'perpendicular to the contour, pointing uphill', 'perpendicular to the contour, pointing downhill', 'always vertical'], a: 1,
      why: 'Along a contour the function does not change, so the direction of fastest increase is at right angles to it.' },
    { q: 'For a function with continuous second partial derivatives, $f_{xy} = f_{yx}$.', a: true,
      why: 'Schwarz\'s (or Clairaut\'s) theorem: the order of differentiation does not matter for smooth functions.' },
    { q: 'On a contour map, where the contour lines are closest together the ground is…', choices: ['flattest', 'steepest', 'highest', 'lowest'], a: 1,
      why: 'Closely spaced lines mean the height changes a lot over a short distance: a large gradient.' }
  ],
  applications: [
    'Error propagation for quantities computed from several measurements.',
    'Gradients of temperature, pressure and potential drive heat flow, winds and forces.',
    'Thermodynamics, and every partial differential equation of physics.'
  ]
},

{
  id: 'multiple-integrals', parent: 'multivariable', title: 'Double and triple integrals', level: 3,
  short: 'Integrals over areas and volumes: add up a function times tiny area or volume elements, usually by integrating one variable at a time.',
  keywords: ['double integral', 'triple integral', 'iterated integral', 'Fubini', 'volume under a surface', 'polar coordinates', 'dA = r dr dθ', 'Jacobian', 'mass', 'centre of mass', 'Gaussian integral'],
  prereq: ['definite-integral', 'partial-derivatives', 'polar-coordinates'],
  related: ['volumes-of-revolution', 'coordinate-systems-3d', 'flux-integrals', 'divergence-theorem', 'normal-distribution', 'physics:center-of-mass', 'physics:moment-of-inertia'],
  body: `
A single integral adds up $f(x)\\,dx$ along a line. A **double integral** adds up $f(x, y)\\,dA$ over a region $R$ of the plane, where $dA$ is a tiny patch of area:

$$\\iint_R f(x, y)\\,dA.$$

If $f$ is a height, this is the **volume** under the surface $z = f(x, y)$. If $f$ is a density in kg/m², it is a **mass**; if $f = 1$, it is simply the area of $R$.

### Doing it one variable at a time
In practice a double integral is evaluated as an **iterated integral**: integrate in $y$ with $x$ held fixed (a slice), then integrate the slice areas in $x$. For a rectangle $[a, b] \\times [c, d]$,
$$\\iint_R f\\,dA = \\int_a^b\\left(\\int_c^d f(x, y)\\,dy\\right)dx,$$
and **Fubini's theorem** says the other order gives the same answer. Example: over $[0, 2]\\times[0, 3]$,
$$\\iint xy^2\\,dA = \\int_0^2 x\\left[\\frac{y^3}{3}\\right]_0^3 dx = \\int_0^2 9x\\,dx = 18.$$

For a region that is not a rectangle, the inner limits depend on the outer variable. For the triangle $0 \\le y \\le x \\le 1$:
$$\\int_0^1\\!\\!\\int_0^x xy\\,dy\\,dx = \\int_0^1 \\frac{x^3}{2}\\,dx = \\frac18,$$
and slicing the other way, $\\int_0^1\\!\\int_y^1 xy\\,dx\\,dy$, also gives $\\tfrac18$. Choosing the easier order can turn an impossible integral into a routine one.

### Polar coordinates
Discs, rings and anything with circular symmetry are easier in [[polar-coordinates|polar coordinates]]. The small patch between radii $r$ and $r + dr$ and angles $\\theta$ and $\\theta + d\\theta$ is nearly a rectangle with sides $dr$ and $r\\,d\\theta$, so
$$dA = r\\,dr\\,d\\theta.$$
The extra factor $r$ (the Jacobian) is the whole trick, and forgetting it is the classic mistake. It gives the famous Gaussian integral:
$$\\left(\\int_{-\\infty}^{\\infty}e^{-x^2}dx\\right)^2 = \\iint e^{-(x^2 + y^2)}\\,dA = \\int_0^{2\\pi}\\!\\!\\int_0^\\infty e^{-r^2}\\,r\\,dr\\,d\\theta = 2\\pi\\cdot\\frac12 = \\pi,$$
so $\\int_{-\\infty}^{\\infty}e^{-x^2}dx = \\sqrt\\pi$, the normalising constant of the [[normal-distribution|normal distribution]].

### Triple integrals
In three dimensions, $\\iiint_V f\\,dV$ adds up $f$ over a solid. In [[coordinate-systems-3d|cylindrical and spherical coordinates]] the volume element becomes $dV = r\\,dr\\,d\\theta\\,dz$ and $dV = r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta$. The sphere's volume, for instance, is $\\int_0^{2\\pi}\\int_0^\\pi\\int_0^R r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta = \\tfrac43\\pi R^3$.

### In physics
- **Mass and centre of mass** of plates and solids with varying density ([[physics:center-of-mass|centre of mass]]).
- **Moments of inertia**: $I = \\iint r^2\\,dm$ gives $\\tfrac12MR^2$ for a uniform disc ([[physics:moment-of-inertia|moment of inertia]]).
- **Charge** from a charge density, **flux** through a surface ([[flux-integrals]]), **probability** from a joint density.
`,
  ideas: [
    '∬ f dA adds up f over a region; with f = height it is a volume, with f = density a mass.',
    'Evaluate as iterated integrals, one variable at a time; for a rectangle either order works (Fubini).',
    'For other regions the inner limits depend on the outer variable.',
    'In polar coordinates dA = r dr dθ; in spherical coordinates dV = r² sin φ dr dφ dθ.',
    'The polar trick gives ∫ e^(−x²) dx = √π over the whole line.'
  ],
  pitfalls: [
    'Writing dA = dr dθ in polar coordinates — The patch has sides dr and r dθ: dA = r dr dθ.',
    'Putting the outer variable\'s constants on the inside — The limits of the outer integral must be numbers; only inner limits may depend on the outer variable.',
    'Swapping the order without redrawing the region — The limits change when you swap; sketch the region and read them off again.'
  ],
  formulas: [
    {
      name: 'The Gaussian integral',
      expr: 'I = sqrt(pi/a)', tex: 'I = \\sqrt{\\frac{\\pi}{a}}',
      vars: {
        I: { name: 'integral of e^(−ax²) over the whole real line' },
        a: { name: 'width parameter a (a > 0)', value: 1 }
      },
      note: 'From the polar-coordinate trick, then substituting $x\\sqrt a$. With $a = 1/(2\\sigma^2)$ it gives $\\sigma\\sqrt{2\\pi}$, the constant in the normal distribution.'
    },
    {
      name: 'Mass of a disc whose density rises towards the rim',
      expr: 'M = 2*pi*s0*R^2/3', tex: 'M = \\frac{2\\pi\\sigma_0 R^2}{3}',
      vars: {
        M: { name: 'mass of the disc', q: 'mass', unit: 'kg' },
        s0: { name: 'areal density at the rim', tex: '\\sigma_0', q: 'arealdensity', unit: 'kg/m²', value: 12 },
        R: { name: 'radius', q: 'length', unit: 'm', value: 0.5 }
      },
      note: 'Density $\\sigma(r) = \\sigma_0 r/R$ (zero at the centre): $M = \\int_0^{2\\pi}\\!\\int_0^R \\sigma_0\\frac rR\\,r\\,dr\\,d\\theta$. A uniform disc of the same rim density would be 1.5 times heavier.',
      stories: { M: 'A disc of radius {R} has an areal density that grows steadily from zero at the centre to {s0} at the rim. What is its mass?' }
    }
  ],
  examples: [
    {
      title: 'Over a rectangle',
      q: 'Evaluate $\\displaystyle\\iint_R xy^2\\,dA$ over $R = [0, 2]\\times[0, 3]$.',
      steps: [
        'Inner integral in $y$, with $x$ fixed: $\\int_0^3 xy^2\\,dy = x\\cdot 9$.',
        'Outer integral in $x$: $\\int_0^2 9x\\,dx = 18$.',
        'Here $f$ is a product, so the integral also factorises: $\\int_0^2 x\\,dx\\cdot\\int_0^3 y^2\\,dy = 2\\times 9 = 18$.'
      ],
      a: '18'
    },
    {
      title: 'Over a triangle, both ways',
      q: 'Evaluate $\\displaystyle\\iint_T xy\\,dA$ where $T$ is the triangle $0 \\le y \\le x \\le 1$.',
      steps: [
        'Vertical slices: for each $x$, $y$ runs from 0 to $x$. $\\int_0^1\\left[\\frac{xy^2}{2}\\right]_0^x dx = \\int_0^1\\frac{x^3}{2}dx = \\frac18$.',
        'Horizontal slices: for each $y$, $x$ runs from $y$ to 1. $\\int_0^1 y\\left[\\frac{x^2}{2}\\right]_y^1 dy = \\int_0^1 \\frac{y - y^3}{2}dy = \\frac12\\left(\\frac12 - \\frac14\\right) = \\frac18$.'
      ],
      a: '1/8'
    },
    {
      title: 'Volume under a paraboloid',
      q: 'Find the volume under $z = 4 - x^2 - y^2$ and above the $xy$-plane.',
      steps: [
        'The surface meets the plane where $x^2 + y^2 = 4$: a disc of radius 2. In polar coordinates $z = 4 - r^2$.',
        '$V = \\int_0^{2\\pi}\\!\\int_0^2 (4 - r^2)\\,r\\,dr\\,d\\theta = 2\\pi\\left[2r^2 - \\frac{r^4}{4}\\right]_0^2 = 2\\pi(8 - 4) = 8\\pi$.',
        'Half the volume of the cylinder of radius 2 and height 4, as for every paraboloid.'
      ],
      a: '8π ≈ 25.1'
    }
  ],
  quiz: [
    { q: 'In polar coordinates the area element is…', choices: ['$dr\\,d\\theta$', '$r\\,dr\\,d\\theta$', '$r^2\\,dr\\,d\\theta$', '$\\theta\\,dr\\,d\\theta$'], a: 1,
      why: 'A small polar patch has radial side $dr$ and arc side $r\\,d\\theta$.' },
    { q: '$\\iint_R 1\\,dA$ over the unit square $[0,1]\\times[0,1]$ equals…', choices: ['0', '1', '2', '1/2'], a: 1,
      why: 'Integrating 1 over a region gives its area.' },
    { q: 'Evaluate the inner integral $\\int_0^1 (x + y)\\,dy$, leaving the answer in terms of $x$.', answer: 'x + 1/2', vars: ['x'],
      why: '$x$ is constant in the inner integral: $[xy + y^2/2]_0^1 = x + \\tfrac12$.' },
    { q: 'For a continuous function on a rectangle, the order of integration can be swapped without changing the result.', a: true,
      why: 'That is Fubini\'s theorem. For non-rectangular regions it still holds, but the limits must be worked out afresh.' },
    { q: 'The volume under $z = 4 - x^2 - y^2$ and above the plane $z = 0$ is…', choices: ['$4\\pi$', '$8\\pi$', '$16\\pi$', '$32\\pi/3$'], a: 1,
      why: 'In polar coordinates $\\int_0^{2\\pi}\\int_0^2 (4 - r^2)r\\,dr\\,d\\theta = 8\\pi$.' }
  ],
  applications: [
    'Mass, centre of mass and moment of inertia of plates, beams and solids.',
    'Probabilities from joint probability densities; normalising the Gaussian.',
    'Total charge, heat content and flux through surfaces in electromagnetism and heat transfer.'
  ]
},

{
  id: 'lagrange-multipliers', parent: 'multivariable', title: 'Constrained optimization (Lagrange multipliers)', level: 3,
  short: 'To find the largest or smallest value of f(x, y) on a constraint curve g(x, y) = c, look for points where the two gradients are parallel: ∇f = λ∇g.',
  keywords: ['Lagrange multiplier', 'constrained optimisation', 'constrained optimization', 'constraint', 'lambda', 'gradient parallel', 'shadow price', 'maximise subject to'],
  prereq: ['partial-derivatives', 'optimization', 'gradient'],
  related: ['extrema', 'multiple-integrals', 'linear-regression', 'physics:static-equilibrium', 'physics:entropy', 'physics:maxwell-boltzmann'],
  body: `
Optimisation problems rarely come free of conditions. Make the biggest box *from a fixed amount of cardboard*; find the point *on a given road* closest to a village; distribute energy among molecules *with a fixed total*. We want to maximise or minimise $f(x, y)$ subject to a **constraint** $g(x, y) = c$.

### The picture
Draw the contour lines of $f$ and the constraint curve $g = c$ on one map. Walk along the constraint curve. Where it **crosses** a contour of $f$, you are passing from lower to higher values, so you can do better by walking on. At the best point the constraint curve must just **touch** a contour, tangent to it. Two curves that touch share a tangent line, so their normals, the gradients, are parallel:

$$\\nabla f = \\lambda\\,\\nabla g, \\qquad g(x, y) = c.$$

The number $\\lambda$ is the **Lagrange multiplier**. In two dimensions these are three equations ($f_x = \\lambda g_x$, $f_y = \\lambda g_y$, and the constraint) for three unknowns $x, y, \\lambda$. In more dimensions, or with several constraints, the pattern is the same: one equation per variable plus the constraints.

### A first example
Maximise $f = xy$ with $x + y = 10$. Then $\\nabla f = (y, x)$ and $\\nabla g = (1, 1)$, so $y = \\lambda$ and $x = \\lambda$: $x = y = 5$ and $f = 25$. Of all rectangles with perimeter 20 the square has the largest area, as [[optimization]] found by substitution. Lagrange's method shines when substitution is messy or impossible.

### What λ means
The multiplier measures how much the optimum improves if the constraint is relaxed:
$$\\lambda = \\frac{d f_{\\text{best}}}{dc}.$$
Above, $f_{\\text{best}} = c^2/4$ for a general $x + y = c$, so $df_{\\text{best}}/dc = c/2 = 5 = \\lambda$. One more metre of perimeter buys about 5 more square metres of area. Economists call $\\lambda$ a **shadow price**; in mechanics, where constraints are enforced by forces, $\\lambda$ turns out to be the **constraint force** itself, such as the tension in a pendulum rod.

### A check list
- Solve the system for **all** candidate points: $\\nabla f = \\lambda \\nabla g$ is necessary, not sufficient, and its solutions include minima, maxima and other stationary points.
- Evaluate $f$ at each candidate (and at any ends of the constraint curve) and compare.
- If $\\nabla g = 0$ somewhere on the constraint, check that point separately.

### In physics
In statistical mechanics one asks how $N$ molecules share a fixed total energy $E$ in the most probable way: maximise the number of arrangements (the [[physics:entropy|entropy]]) subject to fixed $N$ and $E$. Two Lagrange multipliers appear, and the one attached to the energy turns out to be $1/k_BT$: that is where the Boltzmann factor $e^{-E/k_BT}$ and the [[physics:maxwell-boltzmann|Maxwell–Boltzmann distribution]] come from. Temperature itself enters physics as a Lagrange multiplier.
`,
  ideas: [
    'At a constrained extremum the constraint curve is tangent to a contour of f.',
    'Tangency means parallel gradients: ∇f = λ∇g, together with g = c.',
    'Solve for all candidates and compare their values; the condition is necessary, not sufficient.',
    'λ is the rate at which the best value changes as the constraint is relaxed (a shadow price).',
    'In physics, multipliers become constraint forces and even temperature (1/k_BT).'
  ],
  pitfalls: [
    'Setting ∇f = 0 — That finds unconstrained critical points; on the constraint the gradient need not vanish, only be parallel to ∇g.',
    'Every solution of ∇f = λ∇g is a maximum — Solutions include minima and saddle-like points; evaluate f at all of them.',
    'Forgetting the constraint equation — ∇f = λ∇g alone has too many solutions; the constraint g = c pins them down.'
  ],
  formulas: [
    {
      name: 'Largest box for a given surface area',
      expr: 'V = (S/6)^1.5', tex: 'V = \\left(\\frac{S}{6}\\right)^{3/2}',
      vars: {
        V: { name: 'largest volume', q: 'volume', unit: 'cm³' },
        S: { name: 'total surface area', q: 'area', unit: 'cm²', value: 600 }
      },
      note: 'Maximising $xyz$ subject to $2(xy + yz + zx) = S$ gives $x = y = z$: a cube of side $\\sqrt{S/6}$.',
      stories: { V: 'A closed rectangular box is made from {S} of card. What is the largest volume it can hold?' }
    },
    {
      name: 'Distance from the origin to a line ax + by = c',
      expr: 'd = c/sqrt(a^2 + b^2)', tex: 'd = \\frac{c}{\\sqrt{a^2 + b^2}}',
      vars: {
        d: { name: 'shortest distance' },
        c: { name: 'right-hand side c (> 0)', value: 25 },
        a: { name: 'coefficient a', value: 3, signed: true },
        b: { name: 'coefficient b', value: 4, signed: true }
      },
      note: 'Minimising $x^2 + y^2$ subject to $ax + by = c$: the closest point is $\\frac{c}{a^2+b^2}(a, b)$, in the direction of the line\'s normal.'
    }
  ],
  examples: [
    {
      title: 'Largest rectangle, the Lagrange way',
      q: 'Maximise $f = xy$ subject to $x + y = 10$.',
      steps: [
        '$\\nabla f = (y, x)$, $\\nabla g = (1, 1)$. So $y = \\lambda$ and $x = \\lambda$.',
        'The constraint gives $2\\lambda = 10$, so $\\lambda = 5$ and $x = y = 5$.',
        'Maximum $f = 25$. Check the meaning of $\\lambda$: with $x + y = 10.2$ the best product is $5.1^2 = 26.01$, about $5 \\times 0.2 = 1$ more.'
      ],
      a: 'x = y = 5, f = 25, λ = 5'
    },
    {
      title: 'The best box',
      q: 'Find the largest volume of a closed box with surface area 600 cm².',
      steps: [
        'Maximise $V = xyz$ with $g = 2(xy + yz + zx) = 600$.',
        '$\\nabla V = (yz, xz, xy) = \\lambda\\,(2(y + z), 2(x + z), 2(x + y))$.',
        'Multiplying the first equation by $x$ and the second by $y$ gives $xyz = 2\\lambda x(y + z) = 2\\lambda y(x + z)$, so $xz = yz$ and $x = y$; similarly $y = z$.',
        'A cube: $6x^2 = 600$, $x = 10$ cm, $V = 1000\\ \\mathrm{cm^3}$.'
      ],
      a: 'A 10 cm cube, 1000 cm³'
    },
    {
      title: 'Closest point on a line',
      q: 'Find the point of the line $3x + 4y = 25$ closest to the origin.',
      steps: [
        'Minimise $f = x^2 + y^2$. $\\nabla f = (2x, 2y) = \\lambda(3, 4)$, so $x = \\tfrac32\\lambda$, $y = 2\\lambda$.',
        'Constraint: $\\tfrac92\\lambda + 8\\lambda = 25$, so $\\lambda = 2$ and the point is $(3, 4)$.',
        'Distance 5, matching $25/\\sqrt{3^2 + 4^2}$.'
      ],
      a: '(3, 4), at distance 5'
    }
  ],
  quiz: [
    { q: 'At a constrained maximum of $f$ on the curve $g = c$, the gradient $\\nabla f$ is…', choices: ['zero', 'parallel to $\\nabla g$', 'perpendicular to $\\nabla g$', 'tangent to the constraint curve'], a: 1,
      why: 'The constraint curve touches a contour of $f$; both gradients are normal to that shared tangent, hence parallel.' },
    { q: 'Every solution of $\\nabla f = \\lambda\\nabla g$, $g = c$ is a maximum of $f$ on the constraint.', a: false,
      why: 'The condition is also met at minima and other stationary points. Evaluate $f$ at each candidate and compare.' },
    { q: 'The largest value of $x + y$ on the circle $x^2 + y^2 = 2$ is…', choices: ['$\\sqrt 2$', '2', '$2\\sqrt2$', '4'], a: 1,
      why: '$(1, 1) = \\lambda(2x, 2y)$ gives $x = y$, so $x = y = 1$ and $x + y = 2$. (The point $(-1, -1)$ gives the minimum $-2$.)' },
    { q: 'For the largest product $xy$ with $x + y = c$, write the maximum value as an expression in $c$.', answer: 'c^2/4', vars: ['c'],
      why: '$x = y = c/2$, so $xy = c^2/4$. Its derivative $c/2$ is the multiplier $\\lambda$.' },
    { q: 'The Lagrange multiplier $\\lambda$ tells you…', choices: ['the maximum value of f', 'how much the best value changes per unit change of the constraint constant', 'the angle between the gradients', 'nothing: it is only an auxiliary unknown'], a: 1,
      why: '$\\lambda = df_{\\text{best}}/dc$: the shadow price of the constraint.' }
  ],
  applications: [
    'Engineering design under budgets of material, weight or power.',
    'Economics: maximising utility or output under a budget, with λ as the marginal value of money.',
    'Statistical mechanics (the Boltzmann distribution) and mechanics with constraints (constraint forces).'
  ],
  history: 'Joseph-Louis Lagrange introduced the multipliers in his *Mécanique analytique* (1788), where they handled the constraints of mechanical systems, such as a bead forced to stay on a wire.'
}

);
