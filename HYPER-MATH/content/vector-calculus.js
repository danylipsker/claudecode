/* HYPER-MATH · content/vector-calculus.js — fields and how they change: gradient,
 * divergence, curl, line and flux integrals, and the integral theorems.
 * Simulations in sims/vectors-linalg-complex.js. */
Hyper.add(

{
  id: 'scalar-vector-fields', parent: 'vector-calculus', title: 'Scalar and vector fields', level: 2,
  short: 'A quantity with a value at every point of space: a number, like temperature or potential, or an arrow, like wind or an electric field.',
  keywords: ['field', 'scalar field', 'vector field', 'contour', 'level curve', 'level surface', 'isobar', 'field line', 'streamline', 'potential', 'heat map'],
  prereq: ['vectors', 'functions'],
  related: ['gradient', 'divergence', 'curl', 'partial-derivatives', 'physics:electric-field', 'physics:gravitational-field', 'physics:magnetic-field'],
  body: `
### Maps of the invisible
A weather forecast shows two kinds of map. One gives the **temperature** at every place — a single number at each point. The other shows the **wind** — an arrow at each point, with a speed and a direction. Both are **fields**: rules that assign something to every point of a region of space, and often to every moment of time as well.

- A **scalar field** assigns a number: temperature $T(x, y, z)$, pressure, density, the height of the land, an electric potential $V$.
- A **vector field** assigns a vector: $\\vec F(x, y, z) = \\big(F_x(x, y, z),\\, F_y(x, y, z),\\, F_z(x, y, z)\\big)$ — the velocity of a fluid, a force per unit mass or per unit charge, a flow of heat.

Mathematically, a scalar field is just a [[functions|function]] of several variables, and a vector field is three such functions at once, one for each component.

### Picturing a scalar field
Join the points where the field has the same value. In the plane you get **level curves** — contour lines on a map, isobars on a weather chart, isotherms; in space you get **level surfaces**, such as the equipotential surfaces around a charge. Where contours crowd together the field changes quickly, like a steep slope on a hiking map. A colour scale does the same job as a heat map.

### Picturing a vector field
Draw a small arrow at each point of a grid, or draw **field lines** (streamlines): curves that are tangent to the field everywhere, the paths that dust would follow in a steady wind. Field lines cannot cross where the field is smooth and non-zero, because at a crossing the field would point two ways at once. Their spacing can show the strength: crowded lines, strong field.

Some basic examples in the plane:

| Field | What it looks like |
|---|---|
| $\\vec F = (x, y)$ | arrows pointing straight away from the origin and growing with distance: a **source** |
| $\\vec F = (-y, x)$ | arrows circling anticlockwise, longer further out: a rigid **rotation** |
| $\\vec F = (y, 0)$ | horizontal arrows, faster higher up: a **shear** flow, like a river above its bed |
| $\\vec F = -\\hat r / r^2$ | arrows pointing inwards, strongest near the centre: the pull of a planet |

### Fields in physics
[[physics:gravitational-field|Gravity]] is a vector field $\\vec g = -GM\\,\\hat r/r^2$; so are the [[physics:electric-field|electric field]] and the [[physics:magnetic-field|magnetic field]], while the electric potential is a scalar field. Many vector fields of physics come from a scalar one — the field points "downhill" on a potential — and three operations describe how fields vary from place to place:

| Operation | Acts on | Gives | Measures |
|---|---|---|---|
| [[gradient]] $\\nabla f$ | a scalar field | a vector field | the direction and rate of steepest increase |
| [[divergence]] $\\nabla\\cdot\\vec F$ | a vector field | a scalar field | outflow per unit volume |
| [[curl]] $\\nabla\\times\\vec F$ | a vector field | a vector field | swirl per unit area |

> [!tip] In the simulation, the colours and contour lines are a scalar field (the potential) and the arrows and drifting dots are a vector field. Try several fields and see which ones have a potential at all.
`,
  ideas: [
    'A scalar field gives a number at each point; a vector field gives an arrow at each point.',
    'Scalar fields are pictured by level curves or surfaces; vector fields by arrows or field lines.',
    'Field lines are tangent to the field everywhere and never cross where the field is smooth and non-zero.',
    'Gradient, divergence and curl describe how fields change from point to point.'
  ],
  pitfalls: [
    'Field lines are the paths objects follow — They show the direction of the field (the force or acceleration), not the velocity of a moving object. A planet crosses the lines of the Sun\'s gravitational field at right angles.',
    'Longer arrows in the picture mean more field lines — Arrow length and line density are two different ways of drawing strength; do not mix them in one reading.',
    'A vector field is a single vector — It is a whole family of vectors, one attached to every point, each possibly different.'
  ],
  formulas: [
    {
      name: 'Strength of an inverse-square field',
      expr: 'F = k/r^2', tex: 'F = \\frac{k}{r^2}',
      vars: {
        F: { name: 'strength of the field at distance r' },
        k: { name: 'source strength', value: 8 },
        r: { name: 'distance from the source', value: 2 }
      },
      note: 'The shape of the gravitational field of a point mass ($k = GM$) and the electric field of a point charge ($k = q/4\\pi\\varepsilon_0$). Double the distance and the field falls to a quarter.',
      stories: { r: 'A field falls off as k / r² with k = {k}. At what distance has it dropped to {F}?' }
    }
  ],
  examples: [
    {
      title: 'Reading a temperature field',
      q: 'The temperature on a metal plate is $T(x, y) = 20 + 0.5x - 0.2y^2$ (°C, with $x, y$ in cm). Find the temperature at $(4, 3)$ and describe the isotherm through that point.',
      steps: [
        '$T(4, 3) = 20 + 0.5 \\times 4 - 0.2 \\times 9 = 20 + 2 - 1.8 = 20.2$ °C.',
        'The isotherm is the level curve $T = 20.2$: $0.5x - 0.2y^2 = 0.2$, that is $x = 0.4 + 0.4y^2$.',
        'It is a parabola opening in the $+x$ direction; along it the temperature is the same everywhere.',
        'Moving across the isotherms (for instance along $+x$ at $y = 0$) the temperature rises by 0.5 °C per cm.'
      ],
      a: '20.2 °C; the isotherm is the parabola x = 0.4 + 0.4y².'
    },
    {
      title: 'Sketching a vector field',
      q: 'Sketch $\\vec F(x, y) = (-y, x)$ and find its field lines.',
      steps: [
        'Sample points: at $(1, 0)$ the arrow is $(0, 1)$, pointing up; at $(0, 1)$ it is $(-1, 0)$, pointing left; at $(-1, 0)$, down; at $(0, -1)$, right.',
        'Each arrow is perpendicular to the position vector, since $(x, y)\\cdot(-y, x) = 0$, and its length is $\\sqrt{x^2 + y^2}$, the distance from the origin.',
        'So the arrows circle the origin anticlockwise and grow outwards.',
        'Field lines satisfy $dy/dx = F_y/F_x = -x/y$, so $x\\,dx + y\\,dy = 0$ and $x^2 + y^2 = C$: circles.'
      ],
      a: 'An anticlockwise rotation; the field lines are circles centred on the origin.'
    }
  ],
  quiz: [
    { q: 'Which of these is a vector field?', choices: ['the air pressure over Europe', 'the height of the land on a map', 'the wind velocity over the Atlantic', 'the density inside a star'], a: 2,
      why: 'Wind has a speed and a direction at each point. Pressure, height and density are single numbers at each point: scalar fields.' },
    { q: 'Two field lines of a smooth, non-zero vector field can cross.', a: false,
      why: 'At a crossing the field would have two different directions at the same point. Lines can only meet where the field is zero or undefined.' },
    { q: 'On a hiking map the contour lines crowd close together. There the ground is…', choices: ['flat', 'steep', 'at a summit', 'at sea level'], a: 1,
      why: 'Each contour is a fixed step in height; close spacing means that height changes a lot over a short distance.' },
    { q: 'For $\\vec F(x, y) = (xy,\\; x - y)$, write $|\\vec F|^2$ as an expression in $x$ and $y$.', answer: 'x^2*y^2 + (x - y)^2', vars: ['x', 'y'],
      why: 'Square each component and add: $(xy)^2 + (x - y)^2$. The magnitude of a vector field is itself a scalar field.' },
    { q: 'The field $\\vec F = (x, y)$ at the point $(3, 4)$ has magnitude…', choices: ['1', '5', '7', '25'], a: 1,
      why: 'At $(3, 4)$ the arrow is $(3, 4)$, of length 5. In this field the strength equals the distance from the origin.' }
  ],
  problems: [
    { q: 'A field falls off as $k/r^2$. At 2 m from its source it has strength 18 (in some unit). What is its strength at 6 m?', answer: 2, tol: 0.01,
      steps: ['Tripling the distance divides the strength by $3^2 = 9$.', '$18 / 9 = 2$.'] }
  ],
  applications: [
    'Weather forecasting: temperature, pressure and humidity are scalar fields; wind is a vector field.',
    'Electromagnetism and gravitation: the fields around charges, currents and masses.',
    'Fluid dynamics and aerodynamics: the velocity field round a wing or through a pipe.',
    'Geology and mapping: height, gravity anomalies and magnetic surveys.'
  ],
  sim: { id: 'vlc-vector-field', params: { field: 'dipole', pot: true } }
},

{
  id: 'gradient', parent: 'vector-calculus', title: 'Gradient', level: 2,
  short: 'The vector of partial derivatives of a scalar field: it points uphill, in the direction of fastest increase, and its length is the steepest slope.',
  keywords: ['gradient', 'nabla', 'del', 'grad', 'directional derivative', 'steepest ascent', 'level curve', 'normal', 'potential', 'gradient descent'],
  prereq: ['partial-derivatives', 'scalar-vector-fields', 'dot-product'],
  related: ['divergence', 'curl', 'line-integrals', 'lagrange-multipliers', 'extrema', 'physics:electric-potential', 'physics:conservative-forces'],
  body: `
### Which way is uphill?
You stand on a hillside in fog. Step north and you climb a little; step east and you go down; somewhere in between lies the direction of steepest climb. The **gradient** of the height function points that way, and its length is the slope in that direction.

For a scalar field $f(x, y, z)$ the gradient is the vector of its [[partial-derivatives|partial derivatives]]:

$$\\nabla f = \\left(\\frac{\\partial f}{\\partial x},\\; \\frac{\\partial f}{\\partial y},\\; \\frac{\\partial f}{\\partial z}\\right)$$

The symbol $\\nabla$ ("nabla", or "del") stands for the operator $(\\partial/\\partial x,\\, \\partial/\\partial y,\\, \\partial/\\partial z)$ applied to $f$. For $f = x^2 + 3xy$ in the plane, $\\nabla f = (2x + 3y,\\; 3x)$, which at the point $(1, 2)$ is $(8, 3)$.

### The rate of change in any direction
How fast does $f$ change if you move away from a point in the direction of a unit vector $\\hat u$? The [[chain-rule|chain rule]] answers with a dot product, the **directional derivative**:

$$D_{\\hat u} f = \\nabla f\\cdot\\hat u = |\\nabla f|\\cos\\theta$$

where $\\theta$ is the angle between $\\hat u$ and the gradient. Three facts follow at once:

- The rate is greatest, $|\\nabla f|$, when you move **along** the gradient: it points in the direction of steepest ascent.
- Moving against it gives the steepest descent, at the rate $-|\\nabla f|$.
- Moving at right angles gives no change at all: the gradient is **perpendicular to the level curves** (and level surfaces).

At $(1, 2)$ in the example, $f$ grows fastest in the direction $(8, 3)$, at $\\sqrt{73} = 8.5$ per unit distance, and does not change at all in the direction $(-3, 8)$.

### Flat places
Where $\\nabla f = \\vec 0$ there is no uphill direction: a summit, the bottom of a hollow, or a saddle such as a mountain pass. Finding the [[extrema|maxima and minima]] of a function of several variables starts by solving $\\nabla f = \\vec 0$, and constrained problems use the condition that $\\nabla f$ is parallel to the gradient of the constraint ([[lagrange-multipliers|Lagrange multipliers]]). Machine-learning models are trained by **gradient descent**: many small steps against the gradient of the error, downhill until it stops falling.

### Gradients in physics
Many force fields are gradients. A [[physics:conservative-forces|conservative force]] is minus the gradient of its potential energy, $\\vec F = -\\nabla U$, and the electric field is minus the gradient of the [[physics:electric-potential|electric potential]], $\\vec E = -\\nabla V$: it points downhill in voltage, at right angles to the equipotential surfaces. Heat flows down the temperature gradient, $\\vec q = -k\\nabla T$ (Fourier's law of conduction), and molecules diffuse down a concentration gradient.

Gradient fields are special: their [[curl]] is zero, and their [[line-integrals|line integral]] between two points depends only on the end points, $\\int_A^B \\nabla f\\cdot d\\vec r = f(B) - f(A)$. That is why the work done by gravity on a hiker depends only on the change of height, not on the path.

> [!tip] In the simulation the colours are the height of two hills and the arrows are its gradient. Check that every arrow crosses the contour lines at right angles and points uphill, and that the arrows vanish on the summits and at the saddle between them.
`,
  ideas: [
    '∇f collects the partial derivatives of f into a vector.',
    'It points in the direction of steepest increase, and its length is the rate of increase in that direction.',
    'The rate of change in the direction û is ∇f · û.',
    'The gradient is perpendicular to level curves and level surfaces.',
    'At a maximum, minimum or saddle point the gradient is zero.'
  ],
  pitfalls: [
    'The gradient is a number — It is a vector. Its length is the steepest slope, and its direction is where that slope is found.',
    'The gradient points along the contour lines — It is perpendicular to them; along a contour f does not change at all.',
    'Moving along ∇f the rate of change is ∇f · ∇f — Directional derivatives use a unit vector. Along the gradient the rate is |∇f|, not |∇f|².'
  ],
  derivation: {
    title: 'Why the gradient is the steepest direction',
    steps: [
      { text: 'Move from a point $\\vec r_0$ along a unit vector $\\hat u$: $\\vec r(t) = \\vec r_0 + t\\hat u$. By the chain rule the rate of change of $f$ is', tex: '\\frac{d}{dt}f\\big(\\vec r(t)\\big) = \\frac{\\partial f}{\\partial x}u_x + \\frac{\\partial f}{\\partial y}u_y + \\frac{\\partial f}{\\partial z}u_z = \\nabla f\\cdot\\hat u' },
      { text: 'Write the dot product with the angle $\\theta$ between $\\hat u$ and $\\nabla f$, remembering $|\\hat u| = 1$:', tex: '\\nabla f\\cdot\\hat u = |\\nabla f|\\cos\\theta' },
      { text: 'This is largest when $\\cos\\theta = 1$, that is when $\\hat u$ points along $\\nabla f$, and the largest rate is $|\\nabla f|$.' },
      { text: 'Along a level curve $f$ stays constant, so the rate is zero: $\\nabla f\\cdot\\hat u = 0$, and the gradient is perpendicular to the curve.' }
    ]
  },
  formulas: [
    {
      name: 'Directional derivative from the steepness',
      expr: 'D = G*cos(theta)', tex: 'D = G\\cos\\theta',
      vars: {
        D: { name: 'rate of change in the chosen direction, D_u f', signed: true },
        G: { name: 'steepness |∇f|', value: 5 },
        theta: { name: 'angle between the direction and ∇f', q: 'angle', unit: '°', value: 60, min: 0, max: 180 }
      },
      note: 'At 90° the direction runs along a contour and the rate is zero; beyond 90° the function decreases.'
    },
    {
      name: 'Steepness from the partial derivatives',
      expr: 'G = sqrt(fx^2 + fy^2)', tex: 'G = \\sqrt{f_x^2 + f_y^2}',
      vars: {
        G: { name: 'steepness |∇f|' },
        fx: { name: 'partial derivative ∂f/∂x', tex: 'f_x', value: 8, signed: true },
        fy: { name: 'partial derivative ∂f/∂y', tex: 'f_y', value: 3, signed: true }
      }
    },
    {
      name: 'Rate of change along a direction (a, b)',
      expr: 'D = (fx*a + fy*b)/sqrt(a^2 + b^2)', tex: 'D = \\frac{f_x a + f_y b}{\\sqrt{a^2 + b^2}}',
      vars: {
        D: { name: 'directional derivative', signed: true },
        fx: { name: 'partial derivative ∂f/∂x', tex: 'f_x', value: 8, signed: true },
        fy: { name: 'partial derivative ∂f/∂y', tex: 'f_y', value: 3, signed: true },
        a: { name: 'x-part of the direction', value: 3, signed: true },
        b: { name: 'y-part of the direction', value: 4, signed: true }
      },
      note: 'The direction $(a, b)$ need not be a unit vector: the square root normalises it.',
      practice: { unknowns: ['D'] }
    }
  ],
  examples: [
    {
      title: 'Which way is uphill?',
      q: 'A hill has height $h(x, y) = 500 - 0.002x^2 - 0.001y^2$ metres, with $x$ east and $y$ north in metres. Standing at $(100, 200)$, which way is steepest uphill, how steep is it, and how steep is the ground if you walk due east?',
      steps: [
        '$\\nabla h = (-0.004x,\\; -0.002y) = (-0.4,\\; -0.4)$ at $(100, 200)$.',
        'Steepest uphill is along $(-0.4, -0.4)$: towards the south-west.',
        'Steepness $|\\nabla h| = \\sqrt{0.16 + 0.16} = 0.566$, a slope of $\\arctan 0.566 = 29.5°$.',
        'Due east $\\hat u = (1, 0)$: $D_{\\hat u}h = -0.4$, so the ground falls 0.4 m per metre.',
        'Along the contour, $\\hat u = (1, -1)/\\sqrt 2$: $D_{\\hat u}h = (-0.4 + 0.4)/\\sqrt 2 = 0$.'
      ],
      a: 'Steepest uphill towards the south-west at a slope of 0.57 (29.5°); walking east the ground falls 0.4 m per metre.'
    },
    {
      title: 'Electric field from a potential',
      q: 'In a region of space the potential is $V = 2x^2 - 3yz$ volts (coordinates in metres). Find the electric field $\\vec E = -\\nabla V$ at $(1, 2, -1)$.',
      steps: [
        '$\\nabla V = (4x,\\; -3z,\\; -3y)$.',
        '$\\vec E = -\\nabla V = (-4x,\\; 3z,\\; 3y)$, which at $(1, 2, -1)$ is $(-4, -3, 6)$ V/m.',
        'Its strength is $\\sqrt{16 + 9 + 36} = \\sqrt{61} = 7.8$ V/m.',
        'It points towards lower potential, perpendicular to the equipotential surface through the point.'
      ],
      a: 'E = (−4, −3, 6) V/m, of strength 7.8 V/m.'
    }
  ],
  quiz: [
    { q: 'At a point on a contour map, the gradient of the height is…', choices: ['along the contour line', 'perpendicular to the contour line, pointing uphill', 'perpendicular to the contour line, pointing downhill', 'always zero'], a: 1,
      why: 'Along a contour the height does not change, so the gradient has no component along it. It points to the steepest increase: uphill.' },
    { q: 'For $f = x^2 y$, write the $x$-component of $\\nabla f$.', answer: '2x*y', vars: ['x', 'y'],
      why: 'Differentiate with respect to $x$ holding $y$ fixed: $\\partial(x^2 y)/\\partial x = 2xy$. (The $y$-component is $x^2$.)' },
    { q: 'You move in a direction making 90° with $\\nabla f$. The rate of change of $f$ is…', choices: ['$|\\nabla f|$', '$-|\\nabla f|$', 'zero', 'undefined'], a: 2,
      why: '$\\nabla f\\cdot\\hat u = |\\nabla f|\\cos 90° = 0$: you are walking along a level curve.' },
    { q: 'At the top of a smooth hill the gradient of the height is zero.', a: true,
      why: 'At a summit no direction leads up, so every directional derivative is zero, and so is the gradient.' },
    { q: 'At some point $|\\nabla f| = 5$. The greatest rate of change of $f$ there, per unit distance, is…', choices: ['1', '5', '25', 'it depends on the direction'], a: 1,
      why: 'The steepest rate is exactly the length of the gradient, reached by moving along it.' }
  ],
  problems: [
    { q: 'What is the greatest rate of increase of $f(x, y) = x^2 y + y^3$ at the point $(1, 2)$?', answer: 13.6, tol: 0.01,
      steps: ['$\\nabla f = (2xy,\\; x^2 + 3y^2) = (4, 13)$ at $(1, 2)$.', '$|\\nabla f| = \\sqrt{16 + 169} = \\sqrt{185} = 13.6$.'] }
  ],
  applications: [
    'Electric fields from potentials, forces from potential energies.',
    'Heat conduction and diffusion, which run down the gradient.',
    'Gradient descent: the workhorse of optimisation and machine learning.',
    'Image processing: edges are where the gradient of the brightness is large.'
  ],
  sim: { id: 'vlc-vector-field', params: { field: 'hills', pot: true } }
},

{
  id: 'divergence', parent: 'vector-calculus', title: 'Divergence', level: 3,
  short: 'How much a vector field spreads out from a point: the net outflow per unit volume, positive at sources and negative at sinks.',
  keywords: ['divergence', 'div', 'source', 'sink', 'outflow', 'flux density', 'incompressible', 'nabla dot', 'Laplacian', 'continuity'],
  prereq: ['partial-derivatives', 'scalar-vector-fields', 'dot-product'],
  related: ['curl', 'divergence-theorem', 'flux-integrals', 'laplace-equation', 'heat-equation', 'physics:gauss-law', 'physics:continuity-equation', 'physics:maxwells-equations'],
  body: `
### Sources and sinks
Picture a fluid moving with velocity field $\\vec v$. Surround a point with a tiny imaginary box and compare the fluid leaving through its walls with the fluid coming in. If more leaves than enters, fluid must be appearing inside — a **source**, like a spring or a tap under water. If less leaves, it is disappearing — a **sink**. The **divergence** measures this net outflow per unit volume:

$$\\nabla\\cdot\\vec F = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}$$

It turns a vector field into a scalar field: positive at sources, negative at sinks, and zero wherever everything that flows in flows out again. The notation is a "dot product" of the operator $\\nabla$ with the field.

### Examples in the plane
- $\\vec F = (x, y)$: $\\nabla\\cdot\\vec F = 1 + 1 = 2$ everywhere — a uniform source, like a gas expanding evenly.
- $\\vec F = (-y, x)$, a rotation: $0 + 0 = 0$. The fluid goes round and round and piles up nowhere.
- $\\vec F = (x, 0)$: divergence 1, although all the arrows are parallel. They grow along the flow, so every small box loses more through one side than it gains through the other.
- $\\vec F = (x, y)/(x^2 + y^2)$, arrows pointing straight out of the origin: divergence **zero** away from the origin. The arrows spread, but they weaken exactly fast enough to compensate. (In three dimensions the same is true of $\\hat r/r^2$, the shape of the field of a point charge or a point mass.)

So the pattern of the arrows can mislead: divergence is about how the field *changes* along itself, not about which way it points.

### Why the formula works
Take a small box with sides $dx$, $dy$, $dz$. Through the two faces perpendicular to $x$, the net outward flow is $F_x(x + dx)\\,dy\\,dz - F_x(x)\\,dy\\,dz \\approx \\frac{\\partial F_x}{\\partial x}\\,dx\\,dy\\,dz$. Adding the three pairs of faces gives $(\\nabla\\cdot\\vec F)\\,dV$. So the divergence is the outflow from a tiny region divided by its volume — a description that does not depend on the axes, and that leads straight to the [[divergence-theorem|divergence theorem]].

### Where it appears
- **Incompressible flow.** Water barely compresses, so a steady flow of water has $\\nabla\\cdot\\vec v = 0$. For a compressible fluid the [[physics:continuity-equation|continuity equation]], $\\partial\\rho/\\partial t + \\nabla\\cdot(\\rho\\vec v) = 0$, says that any net outflow of mass is lost from the region.
- **Electric charge.** [[physics:gauss-law|Gauss's law]] in differential form, $\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0$: charges are the sources and sinks of the electric field. Its partner $\\nabla\\cdot\\vec B = 0$ says there are no magnetic charges. Both are among [[physics:maxwells-equations|Maxwell's equations]].
- **Heat and diffusion.** The divergence of a gradient is the **Laplacian**, $\\nabla^2 f = \\nabla\\cdot\\nabla f = f_{xx} + f_{yy} + f_{zz}$, the operator in the [[heat-equation|heat equation]] and [[laplace-equation|Laplace's equation]].

> [!tip] In the simulation, the probe circle measures the flux out through its rim. Divide by its area and compare with the divergence read-out: for a small circle they agree, whatever the field.
`,
  ideas: [
    'Divergence is the net outflow per unit volume: positive at sources, negative at sinks.',
    '∇ · F = ∂Fₓ/∂x + ∂F_y/∂y + ∂F_z/∂z, a scalar field.',
    'An incompressible flow has zero divergence.',
    'Arrows that spread out do not by themselves mean positive divergence; what matters is how the field changes.',
    'Charges are the sources of the electric field: ∇ · E = ρ/ε₀.'
  ],
  pitfalls: [
    'Arrows pointing away from a point mean positive divergence there — The field of a point charge points away everywhere, yet its divergence is zero at every point except the charge itself.',
    'Parallel arrows mean zero divergence — F = (x, 0) has parallel arrows and divergence 1, because the arrows grow along the flow.',
    'Divergence is a vector — It is a scalar: one number per point, the sum of three partial derivatives.'
  ],
  derivation: {
    title: 'Divergence as the outflow of a tiny box',
    steps: [
      { text: 'Take a box with corner $(x, y, z)$ and sides $dx$, $dy$, $dz$. Through the face at $x + dx$ the outflow is $F_x(x + dx, y, z)\\,dy\\,dz$; through the face at $x$ the inflow is $F_x(x, y, z)\\,dy\\,dz$.' },
      { text: 'Their difference, to first order in $dx$:', tex: '\\big[F_x(x + dx) - F_x(x)\\big]\\,dy\\,dz \\approx \\frac{\\partial F_x}{\\partial x}\\,dx\\,dy\\,dz' },
      { text: 'The other two pairs of faces give the same with $y$ and $z$. The total outflow is', tex: '\\left(\\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}\\right) dV = (\\nabla\\cdot\\vec F)\\,dV' },
      { text: 'Divide by the volume and let the box shrink: the divergence is outflow per unit volume at the point.' }
    ]
  },
  formulas: [
    {
      name: 'Flux out of a small circle (plane)',
      expr: 'Phi = D*pi*r^2', tex: '\\Phi = D\\,\\pi r^2',
      vars: {
        Phi: { name: 'flux out through the circle', tex: '\\Phi', signed: true },
        D: { name: 'divergence at the centre', value: 2, signed: true },
        r: { name: 'radius of the circle', value: 0.6 }
      },
      note: 'Exact when the divergence is the same throughout the circle, as for the source field; otherwise good for small circles.'
    },
    {
      name: 'Divergence of a radial field rⁿ r̂ (in space)',
      expr: 'D = (n + 2)*r^(n - 1)', tex: 'D = (n + 2)\\,r^{\\,n - 1}',
      vars: {
        D: { name: 'divergence of rⁿ r̂', signed: true },
        n: { name: 'power of r in the field strength', value: -1, signed: true },
        r: { name: 'distance from the origin', value: 2 }
      },
      note: 'For $n = 1$ ($\\vec F = \\vec r$) the divergence is 3 everywhere. For $n = -2$, the inverse-square field of a point charge, it is zero away from the origin.',
      practice: { unknowns: ['D'] }
    }
  ],
  examples: [
    {
      title: 'Where are the sources?',
      q: 'Find the divergence of $\\vec F = (x^2,\\; -xy,\\; z)$ and say where the field has sources and sinks.',
      steps: [
        '$\\nabla\\cdot\\vec F = \\frac{\\partial}{\\partial x}(x^2) + \\frac{\\partial}{\\partial y}(-xy) + \\frac{\\partial}{\\partial z}(z) = 2x - x + 1 = x + 1$.',
        'At $(2, 0, 0)$ it is 3: a source. At $(-3, 0, 0)$ it is $-2$: a sink.',
        'On the plane $x = -1$ the divergence is zero: there the outflow balances the inflow.'
      ],
      a: '∇ · F = x + 1: sources where x > −1, sinks where x < −1.'
    },
    {
      title: 'An expanding gas',
      q: 'A cloud of gas expands uniformly: every parcel moves directly away from the centre with velocity $\\vec v = k\\vec r$, where $k = 0.1\\ \\mathrm{s^{-1}}$. Find $\\nabla\\cdot\\vec v$ and what it says about the density.',
      steps: [
        '$\\vec v = (kx, ky, kz)$, so $\\nabla\\cdot\\vec v = k + k + k = 3k = 0.3\\ \\mathrm{s^{-1}}$.',
        'Divergence is the rate at which a small volume of gas grows, per unit volume: every parcel swells by 30 % per second.',
        'Mass is conserved, so the density falls at the same fractional rate: $d\\rho/dt = -\\rho\\,\\nabla\\cdot\\vec v$, and $\\rho = \\rho_0 e^{-0.3t}$.',
        'After one second the density is $e^{-0.3} = 0.74$ of its starting value.'
      ],
      a: '∇ · v = 0.3 s⁻¹; the density falls by about 26 % in the first second.'
    }
  ],
  quiz: [
    { q: 'At a point, $\\nabla\\cdot\\vec F > 0$. That point is…', choices: ['a source: more flows out than in', 'a sink: more flows in than out', 'the centre of a whirlpool', 'a point where the field is zero'], a: 0,
      why: 'Positive divergence means net outflow from every small region round the point.' },
    { q: 'The rotation field $\\vec F = (-y, x)$ has divergence…', choices: ['2', '0', '−2', '1'], a: 1,
      why: '$\\partial(-y)/\\partial x + \\partial(x)/\\partial y = 0 + 0$. A rotation moves fluid round without compressing or spreading it.' },
    { q: 'Write $\\nabla\\cdot\\vec F$ for $\\vec F = (x^2 y,\\; yz,\\; xz)$.', answer: '2x*y + z + x', vars: ['x', 'y', 'z'],
      why: '$\\partial(x^2y)/\\partial x = 2xy$, $\\partial(yz)/\\partial y = z$, $\\partial(xz)/\\partial z = x$; add them.' },
    { q: 'A field whose arrows all point away from the origin must have positive divergence everywhere.', a: false,
      why: 'The point-charge field $\\hat r/r^2$ points away everywhere, but it weakens so quickly that its divergence is zero away from the origin.' },
    { q: 'Water flows steadily through a pipe that narrows. The divergence of its velocity field is…', choices: ['positive where the pipe narrows', 'negative where the pipe narrows', 'zero everywhere', 'equal to the speed'], a: 2,
      why: 'Water is practically incompressible: it speeds up in the narrow part so that the same volume flows through every cross-section, and nothing accumulates anywhere.' }
  ],
  problems: [
    { q: 'Find the divergence of $\\vec F = (x^3, y^3, z^3)$ at the point $(1, -1, 2)$.', answer: 18, tol: 0.01,
      steps: ['$\\nabla\\cdot\\vec F = 3x^2 + 3y^2 + 3z^2$.', 'At $(1, -1, 2)$: $3 + 3 + 12 = 18$.'] }
  ],
  applications: [
    'Fluid dynamics: incompressibility and the continuity equation.',
    'Electrostatics: Gauss\'s law links the field to the charge density.',
    'Heat flow and diffusion, through the Laplacian.',
    'Weather: diverging surface winds mark high-pressure regions, converging ones storms.'
  ],
  sim: { id: 'vlc-vector-field', params: { field: 'source' } }
},

{
  id: 'curl', parent: 'vector-calculus', title: 'Curl', level: 3,
  short: 'How much a vector field swirls around a point: a vector along the axis of the local rotation, whose length is the circulation per unit area.',
  keywords: ['curl', 'rot', 'rotation', 'vorticity', 'circulation', 'paddle wheel', 'irrotational', 'conservative', 'nabla cross'],
  prereq: ['partial-derivatives', 'scalar-vector-fields', 'cross-product'],
  related: ['divergence', 'stokes-theorem', 'line-integrals', 'gradient', 'physics:amperes-law', 'physics:faradays-law', 'physics:conservative-forces'],
  body: `
### The paddle-wheel test
Drop a tiny paddle wheel into a flowing stream and hold its axle still. If the water pushes harder on one side of the wheel than on the other, the wheel spins. The **curl** of the velocity field measures that tendency: it is a vector along the axle of the most strongly spinning orientation (by the right-hand rule), with a length that measures the spin.

$$\\nabla\\times\\vec F = \\left(\\frac{\\partial F_z}{\\partial y} - \\frac{\\partial F_y}{\\partial z},\\; \\frac{\\partial F_x}{\\partial z} - \\frac{\\partial F_z}{\\partial x},\\; \\frac{\\partial F_y}{\\partial x} - \\frac{\\partial F_x}{\\partial y}\\right)$$

It is the [[cross-product|cross product]] of the operator $\\nabla$ with the field, and it can be remembered with the same determinant:

$$\\nabla\\times\\vec F = \\begin{vmatrix} \\hat\\imath & \\hat\\jmath & \\hat k \\\\ \\partial_x & \\partial_y & \\partial_z \\\\ F_x & F_y & F_z \\end{vmatrix}$$

For a field in the plane only the last component survives, the **scalar curl** $\\partial F_y/\\partial x - \\partial F_x/\\partial y$, positive for anticlockwise spin.

### Three surprising examples
- **Rigid rotation** $\\vec F = (-y, x)$: curl $1 - (-1) = 2$ everywhere. For any rigid rotation at angular velocity $\\omega$ the curl of the velocity is $2\\omega$.
- **Shear flow** $\\vec F = (y, 0)$: every streamline is straight, yet the curl is $0 - 1 = -1$. The water over the top of the wheel moves faster than the water underneath, so the wheel turns clockwise.
- **Point vortex** $\\vec F = (-y, x)/(x^2 + y^2)$, the flow round a plughole: the streamlines are circles, yet the curl is **zero** everywhere except the centre. The flow is faster near the centre in exactly the way that cancels the turning, so a small wheel is carried round the drain without spinning on its axle.

Like divergence, curl is about how the field changes from point to point, not about the shape of its lines.

### Circulation per unit area
Precisely: the component of the curl along a unit vector $\\hat n$ equals the **circulation** — the [[line-integrals|line integral]] of the field round a tiny loop perpendicular to $\\hat n$ — divided by the area of the loop:

$$(\\nabla\\times\\vec F)\\cdot\\hat n = \\lim_{A\\to 0} \\frac{1}{A}\\oint \\vec F\\cdot d\\vec r$$

Adding up these little circulations over a whole surface gives [[stokes-theorem|Stokes' theorem]].

### Curl-free fields
Two identities hold for every smooth field: the curl of a gradient is zero, $\\nabla\\times\\nabla f = \\vec 0$, and the divergence of a curl is zero, $\\nabla\\cdot(\\nabla\\times\\vec F) = 0$. Conversely, on a region without holes, a field with zero curl is the [[gradient]] of some potential. So *curl-free*, *conservative* and *a gradient* mean the same there — the test for whether a force has a potential energy ([[physics:conservative-forces|conservative forces]]).

### In physics
In fluids the curl of the velocity is the **vorticity**, concentrated in eddies, smoke rings and tornadoes. In electromagnetism, [[physics:faradays-law|Faraday's law]] $\\nabla\\times\\vec E = -\\partial\\vec B/\\partial t$ says that a changing magnetic field produces a swirling electric field, and [[physics:amperes-law|Ampère's law]] $\\nabla\\times\\vec B = \\mu_0\\vec J$ (for steady currents) that a current produces a swirling magnetic field.
`,
  ideas: [
    'Curl measures local rotation: would a tiny paddle wheel spin?',
    'In the plane, curl F = ∂F_y/∂x − ∂Fₓ/∂y, positive for anticlockwise swirl.',
    'The curl of a rigid rotation is twice its angular velocity.',
    'Circling streamlines do not guarantee curl, and straight ones do not rule it out.',
    'The curl of a gradient is always zero; a curl-free field on a region without holes is a gradient.'
  ],
  pitfalls: [
    'Straight streamlines mean zero curl — The shear flow (y, 0) has straight lines and curl −1.',
    'Circular streamlines mean non-zero curl — The point vortex has circular lines and zero curl away from its centre.',
    'Zero curl everywhere means zero circulation round every loop — Only if the loop can be filled in without leaving the region where the field is smooth. Round the centre of a point vortex the circulation is 2π.'
  ],
  derivation: {
    title: 'The scalar curl as circulation round a tiny rectangle',
    steps: [
      { text: 'Go anticlockwise round a rectangle with corner $(x, y)$ and sides $dx$, $dy$. The bottom and top edges contribute', tex: 'F_x(x, y)\\,dx - F_x(x, y + dy)\\,dx \\approx -\\frac{\\partial F_x}{\\partial y}\\,dx\\,dy' },
      { text: 'The right and left edges contribute', tex: 'F_y(x + dx, y)\\,dy - F_y(x, y)\\,dy \\approx \\frac{\\partial F_y}{\\partial x}\\,dx\\,dy' },
      { text: 'Add them and divide by the area $dx\\,dy$:', tex: '\\frac{1}{dA}\\oint \\vec F\\cdot d\\vec r = \\frac{\\partial F_y}{\\partial x} - \\frac{\\partial F_x}{\\partial y}' },
      { text: 'Doing the same for small loops facing the $x$ and $y$ axes gives the other two components of $\\nabla\\times\\vec F$.' }
    ]
  },
  formulas: [
    {
      name: 'Circulation round a small circle (plane)',
      expr: 'Gamma = C*pi*r^2', tex: '\\Gamma = C\\,\\pi r^2',
      vars: {
        Gamma: { name: 'circulation round the circle', tex: '\\Gamma', signed: true },
        C: { name: 'curl at the centre', value: 2, signed: true },
        r: { name: 'radius of the circle', value: 0.6 }
      },
      note: 'Exact when the curl is uniform inside the circle, as for a rigid rotation; otherwise good for small circles.'
    },
    {
      name: 'Curl of a rigid rotation',
      expr: 'C = 2*w', tex: 'C = 2\\omega',
      vars: {
        C: { name: 'curl of the velocity field (vorticity)', q: 'angvel', unit: 'rad/s' },
        w: { name: 'angular velocity of the rotation', tex: '\\omega', q: 'angvel', unit: 'rad/s', value: 3 }
      },
      stories: { C: 'A turntable spins at {w}. What is the curl of the velocity field of its surface?' }
    }
  ],
  examples: [
    {
      title: 'Computing a curl',
      q: 'Find the curl of $\\vec F = (yz,\\; 3xz,\\; xy)$ and evaluate it at $(1, 5, 2)$.',
      steps: [
        '$x$-component: $\\partial(xy)/\\partial y - \\partial(3xz)/\\partial z = x - 3x = -2x$.',
        '$y$-component: $\\partial(yz)/\\partial z - \\partial(xy)/\\partial x = y - y = 0$.',
        '$z$-component: $\\partial(3xz)/\\partial x - \\partial(yz)/\\partial y = 3z - z = 2z$.',
        'So $\\nabla\\times\\vec F = (-2x, 0, 2z)$, which at $(1, 5, 2)$ is $(-2, 0, 4)$.'
      ],
      a: '∇ × F = (−2x, 0, 2z) = (−2, 0, 4) at (1, 5, 2).'
    },
    {
      title: 'Is this force conservative?',
      q: 'Is $\\vec F = (2xy + z^3,\\; x^2,\\; 3xz^2)$ conservative? If so, find a potential and the work it does from $(0, 0, 0)$ to $(1, 2, 1)$.',
      steps: [
        'Curl: $x$: $\\partial(3xz^2)/\\partial y - \\partial(x^2)/\\partial z = 0$; $y$: $\\partial(2xy + z^3)/\\partial z - \\partial(3xz^2)/\\partial x = 3z^2 - 3z^2 = 0$; $z$: $\\partial(x^2)/\\partial x - \\partial(2xy + z^3)/\\partial y = 2x - 2x = 0$.',
        'The curl is zero everywhere in space, which has no holes, so $\\vec F$ is a gradient.',
        'Integrate $F_x$ in $x$: $\\varphi = x^2 y + xz^3 + g(y, z)$. Checking $F_y = x^2$ and $F_z = 3xz^2$ shows $g$ is a constant.',
        'Work $= \\varphi(1, 2, 1) - \\varphi(0, 0, 0) = 2 + 1 = 3$, along any path.'
      ],
      a: 'Yes; φ = x²y + xz³, and the work is 3.'
    }
  ],
  quiz: [
    { q: 'In the shear flow $\\vec F = (y, 0)$ all the streamlines are straight. Its curl is…', choices: ['zero, because nothing goes round', 'non-zero: a paddle wheel would spin', 'undefined', 'equal to its divergence'], a: 1,
      why: 'The flow is faster on one side of a wheel than on the other, so it turns: curl $= 0 - 1 = -1$.' },
    { q: 'The curl of any gradient field is zero.', a: true,
      why: 'The mixed partial derivatives cancel in pairs, for instance $\\partial^2 f/\\partial x\\partial y - \\partial^2 f/\\partial y\\partial x = 0$.' },
    { q: 'For $\\vec F = (x^2 y,\\; xy^2,\\; 0)$, write the $z$-component of $\\nabla\\times\\vec F$.', answer: 'y^2 - x^2', vars: ['x', 'y'],
      why: '$\\partial F_y/\\partial x - \\partial F_x/\\partial y = y^2 - x^2$.' },
    { q: 'A turntable spins at 3 rad/s. The curl of the velocity field of its surface is…', choices: ['3 rad/s', '6 rad/s', '1.5 rad/s', '0'], a: 1,
      why: 'For a rigid rotation $\\vec v = \\vec\\omega\\times\\vec r$, and $\\nabla\\times\\vec v = 2\\vec\\omega$.' },
    { q: 'Which of Maxwell\'s equations says that a changing magnetic field creates a circulating electric field?', choices: ['$\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0$', '$\\nabla\\cdot\\vec B = 0$', '$\\nabla\\times\\vec E = -\\partial\\vec B/\\partial t$', '$\\nabla\\times\\vec B = \\mu_0\\vec J + \\mu_0\\varepsilon_0\\,\\partial\\vec E/\\partial t$'], a: 2,
      why: 'Faraday\'s law in differential form: the curl of $\\vec E$ is set by the rate of change of $\\vec B$. It is the principle of every generator and transformer.' }
  ],
  problems: [
    { q: 'Find the magnitude of the curl of $\\vec F = (xy,\\; yz,\\; zx)$ at the point $(2, 3, 1)$.', answer: 3.742, tol: 0.01,
      steps: ['$\\nabla\\times\\vec F = (0 - y,\\; 0 - z,\\; 0 - x) = (-y, -z, -x)$.', 'At $(2, 3, 1)$: $(-3, -1, -2)$, of length $\\sqrt{9 + 1 + 4} = \\sqrt{14} = 3.74$.'] }
  ],
  applications: [
    'Testing whether a force field is conservative.',
    'Vorticity in weather systems, wakes and tornadoes.',
    'Electromagnetic induction (Faraday) and the magnetic field of currents (Ampère).',
    'Computer animation of smoke and water, which tracks the vorticity of the flow.'
  ],
  sim: { id: 'vlc-vector-field', params: { field: 'shear', ring: 'circ' } }
},

{
  id: 'line-integrals', parent: 'vector-calculus', title: 'Line integrals', level: 3,
  short: 'Adding up a field along a curve: the work a force does along a path, or the circulation of a flow round a loop.',
  keywords: ['line integral', 'path integral', 'work', 'circulation', 'parametrisation', 'conservative field', 'path independence', 'potential', 'closed loop', 'contour integral'],
  prereq: ['definite-integral', 'parametric-curves', 'dot-product', 'scalar-vector-fields'],
  related: ['gradient', 'curl', 'stokes-theorem', 'flux-integrals', 'arc-length', 'physics:work', 'physics:conservative-forces', 'physics:amperes-law'],
  body: `
### Adding along a path
Push a trolley round a windy car park. On some stretches the wind helps, on others it hinders, and where it blows across your path it does nothing. To find the total work the wind does, chop the path into small steps $d\\vec r$, take the part of the force along each step, $\\vec F\\cdot d\\vec r$, and add them up. In the limit of tiny steps this sum is the **line integral** of $\\vec F$ along the curve $C$:

$$\\int_C \\vec F\\cdot d\\vec r$$

### Computing one
Describe the curve by a [[parametric-curves|parametrisation]] $\\vec r(t)$ with $a \\le t \\le b$. Then each step is $d\\vec r = \\vec r\\,'(t)\\,dt$, and the line integral becomes an ordinary [[definite-integral|definite integral]]:

$$\\int_C \\vec F\\cdot d\\vec r = \\int_a^b \\vec F\\big(\\vec r(t)\\big)\\cdot\\vec r\\,'(t)\\,dt$$

Take $\\vec F = (-y, x)$ once round the unit circle, $\\vec r = (\\cos t, \\sin t)$ for $0 \\le t \\le 2\\pi$. Then $\\vec r\\,' = (-\\sin t, \\cos t)$ and $\\vec F = (-\\sin t, \\cos t)$, so the integrand is $\\sin^2 t + \\cos^2 t = 1$ and the integral is $2\\pi$: the field pushes along the whole way round. An integral round a closed loop is called a **circulation** and written $\\oint$.

The value does not depend on how fast you move along the curve — any parametrisation gives the same answer — but it does depend on the **direction**: going the other way changes the sign.

There is also a scalar version, $\\int_C f\\,ds$ with $ds = |\\vec r\\,'(t)|\\,dt$, which adds a quantity along a curve without any direction: the mass of a bent wire of varying density, or, with $f = 1$, the [[arc-length|arc length]].

### Path independence
Take $\\vec F = (y, x)$ from $(0, 0)$ to $(1, 1)$. Along the straight line $\\vec r = (t, t)$ the integrand is $2t$ and the integral is 1. Along the parabola $\\vec r = (t, t^2)$ it is $t^2 + 2t^2 = 3t^2$, and the integral is again 1. That is no coincidence: $\\vec F$ is the [[gradient]] of $\\varphi = xy$, and for any gradient field

$$\\int_C \\nabla\\varphi\\cdot d\\vec r = \\varphi(B) - \\varphi(A)$$

— the **fundamental theorem for line integrals**, the several-variable version of the [[fundamental-theorem|fundamental theorem of calculus]]. Such fields are called **conservative**: the integral depends only on the end points, and round any closed loop it is zero. The rotation $(-y, x)$ is not conservative: from $(1, 0)$ to $(-1, 0)$ it gives $\\pi$ over the top of the unit circle but $-\\pi$ along the bottom.

### In physics
Work is a line integral, $W = \\int\\vec F\\cdot d\\vec r$. For a [[physics:conservative-forces|conservative force]] it equals minus the change in potential energy, which is what makes energy conservation work. The potential difference between two points is $V_B - V_A = -\\int_A^B \\vec E\\cdot d\\vec r$ ([[physics:electric-potential|electric potential]]). And circulations state two of the laws of electromagnetism: [[physics:amperes-law|Ampère's law]] $\\oint\\vec B\\cdot d\\vec r = \\mu_0 I$, and Faraday's law, in which the circulation of $\\vec E$ round a loop is the induced EMF.
`,
  ideas: [
    'A line integral adds F · dr along a curve: the work done by F along the path.',
    'With a parametrisation r(t) it becomes an ordinary integral of F(r(t)) · r′(t).',
    'Reversing the direction of travel changes the sign.',
    'For a gradient field the integral is φ(B) − φ(A), independent of the path, and zero round any loop.',
    'Round a closed loop the line integral is called the circulation.'
  ],
  pitfalls: [
    'Integrating |F| along the path — Only the component of F along the path counts: the integrand is F · dr, not |F| ds.',
    'Every field gives the same answer along every path between two points — Only conservative fields do; the rotation (−y, x) does not.',
    'Forgetting to substitute the path into the field — F must be evaluated on the curve, F(r(t)), before taking the dot product with r′(t).'
  ],
  derivation: {
    title: 'The fundamental theorem for line integrals',
    steps: [
      { text: 'Let $\\vec F = \\nabla\\varphi$ and let the curve run from $A = \\vec r(a)$ to $B = \\vec r(b)$. By the chain rule,', tex: '\\frac{d}{dt}\\varphi\\big(\\vec r(t)\\big) = \\nabla\\varphi\\big(\\vec r(t)\\big)\\cdot\\vec r\\,\'(t)' },
      { text: 'So the integrand of the line integral is an exact derivative:', tex: '\\int_C \\nabla\\varphi\\cdot d\\vec r = \\int_a^b \\frac{d}{dt}\\varphi\\big(\\vec r(t)\\big)\\,dt' },
      { text: 'The ordinary fundamental theorem of calculus finishes it:', tex: '\\int_C \\nabla\\varphi\\cdot d\\vec r = \\varphi(B) - \\varphi(A)' },
      { text: 'Nothing about the path survives, only its end points; for a closed loop $B = A$ and the integral is zero.' }
    ]
  },
  formulas: [
    {
      name: 'Circulation of a rotation round a circle',
      expr: 'G = 2*pi*k*R^2', tex: '\\Gamma = 2\\pi k R^2',
      vars: {
        G: { name: 'circulation ∮F · dr (anticlockwise)', tex: '\\Gamma', signed: true },
        k: { name: 'strength k of the field F = k(−y, x)', value: 1, signed: true },
        R: { name: 'radius of the circle', value: 1.5 }
      },
      note: 'On the circle the field has length $kR$ and runs along the path, which is $2\\pi R$ long. The result equals the curl $2k$ times the area $\\pi R^2$, as Stokes\' theorem requires.'
    },
    {
      name: 'Line integral of a gradient field',
      expr: 'W = phiB - phiA', tex: 'W = \\varphi_B - \\varphi_A',
      vars: {
        W: { name: 'line integral ∫∇φ · dr from A to B', signed: true },
        phiB: { name: 'potential at the end point', tex: '\\varphi_B', value: 7, signed: true },
        phiA: { name: 'potential at the start point', tex: '\\varphi_A', value: 2, signed: true }
      },
      note: 'Holds for every path from A to B, however winding.'
    }
  ],
  examples: [
    {
      title: 'Two routes, two answers',
      q: 'Integrate $\\vec F = (-y, x)$ from $(1, 0)$ to $(-1, 0)$ along the upper half of the unit circle, and then along the lower half.',
      steps: [
        'Upper half: $\\vec r = (\\cos t, \\sin t)$, $0 \\le t \\le \\pi$. As on the full circle the integrand is 1, so the integral is $\\pi$.',
        'Lower half: $\\vec r = (\\cos t, -\\sin t)$, $0 \\le t \\le \\pi$, so $\\vec r\\,\' = (-\\sin t, -\\cos t)$ and $\\vec F = (\\sin t, \\cos t)$.',
        'The integrand is $-\\sin^2 t - \\cos^2 t = -1$, and the integral is $-\\pi$.',
        'Different paths, different answers: $\\vec F$ is not conservative (its curl is 2). Going round the whole loop gives $\\pi - (-\\pi) = 2\\pi$.'
      ],
      a: 'π over the top, −π along the bottom.'
    },
    {
      title: 'Work in a conservative field',
      q: 'Find $\\int \\vec F\\cdot d\\vec r$ for $\\vec F = (2x, 3)$ along the straight line from $(0, 0)$ to $(2, 1)$, first directly and then with a potential.',
      steps: [
        'Path: $\\vec r = (2t, t)$, $0 \\le t \\le 1$, so $\\vec r\\,\' = (2, 1)$ and $\\vec F = (4t, 3)$.',
        'Integrand: $4t \\cdot 2 + 3 \\cdot 1 = 8t + 3$. Integral: $4 + 3 = 7$.',
        'Potential: $\\varphi = x^2 + 3y$ has $\\nabla\\varphi = (2x, 3) = \\vec F$.',
        '$\\varphi(2, 1) - \\varphi(0, 0) = 4 + 3 = 7$ — the same, with no integration.'
      ],
      a: '7'
    }
  ],
  quiz: [
    { q: 'Reversing the direction of travel along a curve changes $\\int_C\\vec F\\cdot d\\vec r$ by…', choices: ['nothing', 'a factor of −1', 'a factor of 2', 'an amount that depends on F'], a: 1,
      why: 'Every step $d\\vec r$ reverses, so every term $\\vec F\\cdot d\\vec r$ changes sign.' },
    { q: 'For a gradient field, the line integral round any closed loop is zero.', a: true,
      why: 'It equals $\\varphi(\\text{end}) - \\varphi(\\text{start})$, and on a closed loop the end is the start.' },
    { q: 'What is $\\oint\\vec F\\cdot d\\vec r$ for $\\vec F = (-y, x)$ once anticlockwise round a circle of radius 2 centred at the origin?', choices: ['0', '$4\\pi$', '$8\\pi$', '$2\\pi$'], a: 2,
      why: 'On the circle the field has length 2 and points along the path, which is $4\\pi$ long: $2 \\times 4\\pi = 8\\pi$ (that is, $2\\pi R^2$).' },
    { q: 'For $\\vec r(t) = (t, t^2)$ and $\\vec F = (y, x)$, write the integrand $\\vec F(\\vec r(t))\\cdot\\vec r\\,\'(t)$ in terms of $t$.', answer: '3t^2', vars: ['t'],
      why: '$\\vec F(\\vec r(t)) = (t^2, t)$ and $\\vec r\\,\'(t) = (1, 2t)$, so the dot product is $t^2 + 2t^2 = 3t^2$.' },
    { q: 'A hiker climbs from 200 m to 700 m altitude along a winding 3 km path. The work done on her by gravity depends on…', choices: ['the length of the path', 'only the change in height', 'her speed', 'the number of bends'], a: 1,
      why: 'Gravity near the ground is a gradient field, so its line integral depends only on the end points: $W = -mg\\,\\Delta h$.' }
  ],
  problems: [
    { q: 'Evaluate $\\int_C (x\\,dx + y\\,dy + z\\,dz)$ along any path from $(1, 0, 0)$ to $(2, 2, 1)$.', answer: 4, tol: 0.01,
      hint: 'The field $(x, y, z)$ is the gradient of $\\tfrac12(x^2 + y^2 + z^2)$.',
      steps: ['$\\varphi = \\tfrac12(x^2 + y^2 + z^2)$, so the integral is $\\varphi(2, 2, 1) - \\varphi(1, 0, 0)$.', '$\\tfrac12(4 + 4 + 1) - \\tfrac12(1) = 4.5 - 0.5 = 4$.'] }
  ],
  applications: [
    'Work done by forces along a path, and potential energy.',
    'Voltage between two points as the line integral of the electric field.',
    'Ampère\'s and Faraday\'s laws, which are statements about circulations.',
    'Aerodynamic lift, which is proportional to the circulation of the air round a wing.'
  ],
  sim: { id: 'vlc-vector-field', params: { field: 'vortex', ring: 'circ' } }
},

{
  id: 'flux-integrals', parent: 'vector-calculus', title: 'Surface and flux integrals', level: 3,
  short: 'Adding up how much of a vector field passes through a surface: the flow of water through a net, or the electric flux through a closed surface.',
  keywords: ['flux', 'surface integral', 'flux integral', 'normal vector', 'area vector', 'oriented surface', 'flow rate', 'electric flux', 'magnetic flux', 'parametrised surface'],
  prereq: ['multiple-integrals', 'dot-product', 'cross-product', 'scalar-vector-fields'],
  related: ['divergence-theorem', 'stokes-theorem', 'divergence', 'line-integrals', 'physics:gauss-law', 'physics:magnetic-flux', 'physics:faradays-law'],
  body: `
### How much passes through
Hold a hoop net in a river. How much water passes through it each second? It depends on the speed of the water, the area of the hoop and its tilt: face-on to the current the most water goes through, edge-on none at all. For a uniform flow $\\vec v$ through a flat surface of area $A$ whose unit normal $\\hat n$ makes an angle $\\theta$ with the flow,

$$\\Phi = \\vec v\\cdot\\hat n\\,A = vA\\cos\\theta$$

in cubic metres per second. The **area vector** $\\vec A = A\\hat n$ packs size and tilt together, so $\\Phi = \\vec v\\cdot\\vec A$. This rate of passing through is the **flux**.

### The flux integral
For a curved surface, or a field that changes from place to place, cut the surface $S$ into small, nearly flat patches of area $dA$ with unit normal $\\hat n$, and add up:

$$\\Phi = \\iint_S \\vec F\\cdot\\hat n\\,dA = \\iint_S \\vec F\\cdot d\\vec A$$

Only the part of the field **through** the surface counts; the part sliding along it carries nothing across. Each surface has two sides, so it must be **oriented** — a choice of which normal counts as positive. For a closed surface such as a balloon or a box the convention is the outward normal, so outflow is positive and inflow negative, and the integral is written $\\oiint$.

### A standard example
Take $\\vec F = (x, y, z) = \\vec r$ and a sphere of radius $R$ centred at the origin. On the sphere $\\hat n = \\vec r/R$, so $\\vec F\\cdot\\hat n = R$ at every point, and the flux is $R$ times the area $4\\pi R^2$: $\\Phi = 4\\pi R^3$.

For the inverse-square field $\\vec F = k\\hat r/r^2$ the same sphere gives $\\vec F\\cdot\\hat n = k/R^2$ and $\\Phi = 4\\pi k$ — **the same for every radius**. The field weakens as $1/R^2$ while the area grows as $R^2$. This is the heart of [[physics:gauss-law|Gauss's law]]: the electric flux out of any closed surface depends only on the charge inside, $\\oiint\\vec E\\cdot d\\vec A = Q/\\varepsilon_0$.

### Parametrised surfaces
To compute a flux over a general surface, describe it with two parameters, $\\vec r(u, v)$. Small steps $du$ and $dv$ trace a tiny parallelogram with sides $\\vec r_u\\,du$ and $\\vec r_v\\,dv$, and the [[cross-product|cross product]] gives both its area and its normal:

$$d\\vec A = \\left(\\vec r_u\\times\\vec r_v\\right)du\\,dv, \\qquad \\Phi = \\iint \\vec F\\big(\\vec r(u, v)\\big)\\cdot\\left(\\vec r_u\\times\\vec r_v\\right)du\\,dv$$

For a surface given as a graph $z = g(x, y)$, taking $u = x$ and $v = y$ gives $d\\vec A = (-g_x, -g_y, 1)\\,dx\\,dy$, with the normal pointing up. With a scalar function in place of $\\vec F\\cdot d\\vec A$ the same machinery gives the scalar surface integral $\\iint f\\,dA$: a surface area, the mass of a curved shell, or an average temperature over a surface.

### In physics
Flux integrals carry the conservation laws: the flow of fluid through a pipe's cross-section, the heat escaping through a wall, the electric flux of Gauss's law, and the [[physics:magnetic-flux|magnetic flux]] $\\Phi_B = \\iint\\vec B\\cdot d\\vec A$, whose change drives [[physics:faradays-law|Faraday's law]] of induction. The magnetic flux out of any closed surface is zero: magnetic field lines have no ends. For closed surfaces the [[divergence-theorem|divergence theorem]] often trades the surface integral for an easier volume integral.
`,
  ideas: [
    'Flux measures how much of a field passes through a surface: Φ = ∬ F · n̂ dA.',
    'Only the component of the field normal to the surface counts.',
    'A surface must be oriented; closed surfaces use the outward normal.',
    'For a parametrised surface, dA = (r_u × r_v) du dv gives both size and direction.',
    'The flux of an inverse-square field out of a sphere is the same for every radius — the root of Gauss\'s law.'
  ],
  pitfalls: [
    'Flux is field times area — Only when the field is uniform and perpendicular to a flat surface. In general take the normal component, patch by patch.',
    'Using the angle between the field and the surface itself — The θ in Φ = FA cos θ is measured from the normal. A field lying along the surface gives zero flux.',
    'A closed surface round a region with no charge has no field through it — Field lines can pass right through it; the net flux is zero because what enters also leaves.'
  ],
  derivation: {
    title: 'The area element of a parametrised surface',
    steps: [
      { text: 'Changing $u$ by $du$ moves the point by $\\vec r_u\\,du$; changing $v$ by $dv$ moves it by $\\vec r_v\\,dv$. The patch is a small parallelogram with these sides.' },
      { text: 'The cross product of the two sides is perpendicular to the patch and its length is the patch\'s area:', tex: 'd\\vec A = \\vec r_u\\,du\\times\\vec r_v\\,dv = \\left(\\vec r_u\\times\\vec r_v\\right)du\\,dv' },
      { text: 'For a sphere of radius $R$, $\\vec r = R(\\sin u\\cos v, \\sin u\\sin v, \\cos u)$, this gives', tex: '|\\vec r_u\\times\\vec r_v| = R^2\\sin u, \\qquad \\iint R^2\\sin u\\,du\\,dv = 4\\pi R^2' },
      { text: 'which is the familiar area of the sphere.' }
    ]
  },
  formulas: [
    {
      name: 'Flow through a flat, tilted surface',
      expr: 'Q = v*A*cos(theta)', tex: 'Q = vA\\cos\\theta',
      vars: {
        Q: { name: 'volume flow rate (flux)', q: 'flowrate', unit: 'm³/s', signed: true },
        v: { name: 'flow speed', q: 'speed', unit: 'm/s', value: 1.5 },
        A: { name: 'area of the surface', q: 'area', unit: 'm²', value: 0.5 },
        theta: { name: 'angle between the flow and the normal', q: 'angle', unit: '°', value: 50, min: 0, max: 180 }
      },
      stories: { Q: 'A river flowing at {v} passes through a hoop net of area {A} whose normal is tilted {theta} from the current. How much water goes through each second?' }
    },
    {
      name: 'Flux of a radial field k r̂/rⁿ out of a sphere',
      expr: 'Phi = 4*pi*k*R^(2 - n)', tex: '\\Phi = 4\\pi k R^{\\,2 - n}',
      vars: {
        Phi: { name: 'flux out of the sphere', tex: '\\Phi', signed: true },
        k: { name: 'field strength constant', value: 1, signed: true },
        R: { name: 'radius of the sphere', value: 2 },
        n: { name: 'power of r in the fall-off', value: 1, signed: true }
      },
      note: 'Only $n = 2$, the inverse-square law, gives a flux independent of $R$ — so only inverse-square fields have a Gauss\'s law.',
      practice: { unknowns: ['Phi', 'k'] }
    }
  ],
  examples: [
    {
      title: 'Water through a tilted net',
      q: 'A river flows at 1.5 m/s. A circular net of radius 0.4 m is held with its normal at 50° to the current. How much water passes through it each second?',
      steps: [
        'Area: $A = \\pi (0.4)^2 = 0.503$ m².',
        'Flux: $\\Phi = vA\\cos\\theta = 1.5 \\times 0.503 \\times \\cos 50° = 1.5 \\times 0.503 \\times 0.643$.',
        '$\\Phi = 0.485$ m³/s, about 485 litres a second.',
        'Face-on it would be $1.5 \\times 0.503 = 0.754$ m³/s; edge-on, zero.'
      ],
      a: 'About 0.48 m³/s.'
    },
    {
      title: 'Flux out of a cube',
      q: 'Find the flux of $\\vec F = (x, 0, 0)$ out of the unit cube $0 \\le x, y, z \\le 1$.',
      steps: [
        'Face $x = 1$: outward normal $\\hat\\imath$, $\\vec F\\cdot\\hat n = 1$, area 1: flux 1.',
        'Face $x = 0$: normal $-\\hat\\imath$, but $\\vec F = \\vec 0$ there: flux 0.',
        'The four other faces have normals along $\\pm\\hat\\jmath$ or $\\pm\\hat k$, perpendicular to $\\vec F$: flux 0.',
        'Total: 1. (The divergence is 1 and the volume is 1 — the divergence theorem at work.)'
      ],
      a: '1'
    }
  ],
  quiz: [
    { q: 'A net is turned edge-on to a steady current. The flux through it is…', choices: ['as large as possible', 'zero', 'negative', 'half the maximum'], a: 1,
      why: 'Edge-on, the normal is perpendicular to the flow, so $\\vec v\\cdot\\hat n = 0$: the water slides past without crossing.' },
    { q: 'With the outward normal convention, flux out of a closed surface counts as positive.', a: true,
      why: 'The outward normal makes $\\vec F\\cdot\\hat n > 0$ where the field leaves and negative where it enters, so the total is the net outflow.' },
    { q: 'Doubling the radius of a sphere centred on a point charge changes the electric flux through it by a factor of…', choices: ['2', '4', '½', '1 (no change)'], a: 3,
      why: 'The field falls as $1/R^2$ while the area grows as $R^2$: the flux is $Q/\\varepsilon_0$ for any radius.' },
    { q: 'Write the flux of the uniform field $(0, 0, c)$ upwards through a horizontal disc of radius $r$.', answer: 'c*pi*r^2', vars: ['c', 'r'],
      why: 'The field is parallel to the normal, so the flux is field × area $= c\\,\\pi r^2$.' },
    { q: 'For a parametrised surface $\\vec r(u, v)$, the area element $d\\vec A$ comes from…', choices: ['the dot product $\\vec r_u\\cdot\\vec r_v$', 'the cross product $\\vec r_u\\times\\vec r_v$', 'the sum $\\vec r_u + \\vec r_v$', 'the gradient of $\\vec r$'], a: 1,
      why: 'The cross product of the two edge vectors of the small parallelogram gives its area and its normal direction at once.' }
  ],
  problems: [
    { q: 'Find the flux of $\\vec F = (x, y, z)$ out of a sphere of radius 3 centred at the origin.', answer: 339.3, tol: 0.01,
      steps: ['On the sphere $\\vec F\\cdot\\hat n = R = 3$.', 'Flux $= 3 \\times 4\\pi \\times 3^2 = 108\\pi = 339.3$.'] }
  ],
  applications: [
    'Flow rates of fluids through pipes, filters and nets.',
    'Gauss\'s law for electric and gravitational fields.',
    'Magnetic flux and induction in generators and transformers.',
    'Heat loss through walls and windows, and radiation through a surface.'
  ],
  sim: { id: 'vlc-vector-field', params: { field: 'point' } }
},

{
  id: 'divergence-theorem', parent: 'vector-calculus', title: 'The divergence theorem', level: 3,
  short: 'The total outflow through a closed surface equals the sum of the divergence over the volume inside: whatever leaves must have been produced within.',
  keywords: ['divergence theorem', 'Gauss\'s theorem', 'Ostrogradsky', 'flux', 'closed surface', 'volume integral', 'conservation law', 'Green\'s theorem'],
  prereq: ['divergence', 'flux-integrals', 'multiple-integrals'],
  related: ['stokes-theorem', 'fundamental-theorem', 'heat-equation', 'physics:gauss-law', 'physics:continuity-equation', 'physics:maxwells-equations'],
  body: `
### What leaves had to be made inside
Think of a region full of tiny taps and drains. The net amount of fluid leaving through the region's skin each second must equal what the taps produce inside minus what the drains swallow. The [[divergence]] is exactly that production per unit volume, so

$$\\oiint_{S} \\vec F\\cdot d\\vec A = \\iiint_{V} \\nabla\\cdot\\vec F\\;dV$$

where $S$ is the closed surface bounding the region $V$, with its normal pointing outwards. This is the **divergence theorem**, also called Gauss's theorem (or Ostrogradsky's).

### Why it is true
Chop the region into many small boxes. For each box, the outflow through its six faces is $(\\nabla\\cdot\\vec F)\\,dV$ — that is what divergence means. Now add up all the boxes. Every inside face is shared by two neighbouring boxes, and what flows out of one flows into the other, so the two contributions cancel exactly. Only the faces on the outer surface are left unpaired: the sum of all the little outflows is the flux through the outer skin.

It is the [[fundamental-theorem|fundamental theorem of calculus]] one step up. There, $\\int_a^b f'(x)\\,dx = f(b) - f(a)$ turns the integral of a derivative over an interval into values at its two end points. Here the "derivative" is the divergence, and the "end points" are the whole boundary surface.

### Checking it, and using it
For $\\vec F = (x, y, z)$ and a sphere of radius $R$: $\\nabla\\cdot\\vec F = 3$, so the volume integral is $3 \\cdot \\tfrac43\\pi R^3 = 4\\pi R^3$ — the same as the direct flux calculation in [[flux-integrals]]. The theorem often saves a great deal of work. For $\\vec F = (x^3, y^3, z^3)$ the surface integral over a sphere is tedious, but $\\nabla\\cdot\\vec F = 3(x^2 + y^2 + z^2) = 3r^2$, and adding over thin shells of area $4\\pi r^2$,

$$\\iiint 3r^2\\,dV = \\int_0^R 3r^2 \\cdot 4\\pi r^2\\,dr = \\frac{12\\pi R^5}{5}$$

### In the plane
In two dimensions the theorem says that the outward flux through a closed curve equals the double integral of the divergence over the region inside — the flux form of Green's theorem. The simulation shows exactly this. For small circles, flux ÷ area approaches the divergence at the centre; for the **source** field, whose divergence is 2 everywhere, flux ÷ area is exactly 2 for any circle.

### Conservation laws
Every conservation law has two forms, linked by this theorem. The **integral form**: the amount of something inside a region changes only by what crosses its boundary. The **differential form**: at every point, $\\partial\\rho/\\partial t + \\nabla\\cdot\\vec J = 0$, where $\\rho$ is the density of the quantity and $\\vec J$ its flow. That is how the [[physics:continuity-equation|continuity equation]] of fluids, the conservation of charge and the [[heat-equation|heat equation]] are derived. The theorem also turns [[physics:gauss-law|Gauss's law]] from its integral form, $\\oiint\\vec E\\cdot d\\vec A = Q_\\text{inside}/\\varepsilon_0$, into the differential form $\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0$, one of [[physics:maxwells-equations|Maxwell's equations]].

> [!warn] The field must be smooth throughout the region. The point-charge field $k\\hat r/r^2$ has zero divergence everywhere except the origin, yet its flux out of any sphere round the origin is $4\\pi k$: all of it comes from the single point where the field blows up. In the simulation, pick the point source and drag the probe over the origin.
`,
  ideas: [
    'Net outflow through a closed surface = total divergence inside.',
    'Proof idea: sum the outflows of small boxes; the shared inner faces cancel.',
    'It is the fundamental theorem of calculus in three dimensions.',
    'It links the integral and differential forms of conservation laws and of Gauss\'s law.',
    'The field must be smooth inside; a singular point can hold hidden flux.'
  ],
  pitfalls: [
    'Applying it to an open surface — The surface must be closed and bound a region; for an open surface, close it off and subtract the flux through the lid.',
    'Using the inward normal — The theorem uses the outward normal; with the inward one the sign flips.',
    'Zero divergence in the formula means zero flux, even round a point charge — Only if the field is smooth everywhere inside. The point charge sits at a singularity, which carries all the flux.'
  ],
  derivation: {
    title: 'From small boxes to the whole region',
    steps: [
      { text: 'Divide $V$ into small boxes $V_i$. By the meaning of divergence, the outflow of each is', tex: '\\oiint_{\\partial V_i}\\vec F\\cdot d\\vec A \\approx (\\nabla\\cdot\\vec F)_i\\,\\Delta V_i' },
      { text: 'Sum over all boxes. On a face shared by two boxes, the outward normals are opposite, so the two flux terms cancel:', tex: '\\sum_i \\oiint_{\\partial V_i}\\vec F\\cdot d\\vec A = \\oiint_{S}\\vec F\\cdot d\\vec A' },
      { text: 'The right-hand sides add up to a Riemann sum for the volume integral:', tex: '\\sum_i (\\nabla\\cdot\\vec F)_i\\,\\Delta V_i \\to \\iiint_V \\nabla\\cdot\\vec F\\,dV' },
      { text: 'As the boxes shrink, the approximations become exact and the theorem follows.' }
    ]
  },
  formulas: [
    {
      name: 'Outflow from a ball with uniform divergence',
      expr: 'Phi = D*4/3*pi*R^3', tex: '\\Phi = D\\cdot\\tfrac43\\pi R^3',
      vars: {
        Phi: { name: 'flux out of the sphere', tex: '\\Phi', signed: true },
        D: { name: 'divergence (the same everywhere inside)', value: 4, signed: true },
        R: { name: 'radius of the sphere', value: 2 }
      },
      stories: { Phi: 'A field has divergence {D} everywhere. What is its flux out of a sphere of radius {R}?' }
    },
    {
      name: 'Gauss\'s law: flux from the enclosed charge',
      expr: 'Phi = Q/eps0', tex: '\\Phi_E = \\frac{Q}{\\varepsilon_0}',
      vars: {
        Phi: { name: 'electric flux out of the closed surface', tex: '\\Phi_E', q: 'eflux', unit: 'V·m', signed: true },
        Q: { name: 'charge enclosed', q: 'charge', unit: 'nC', value: 5, signed: true },
        eps0: { const: 'eps0' }
      },
      note: 'The divergence theorem applied to $\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0$. The shape and size of the surface do not matter.'
    }
  ],
  examples: [
    {
      title: 'Flux out of a cube, two ways',
      q: 'Find the flux of $\\vec F = (2x,\\; y^2,\\; 3z)$ out of the unit cube $0 \\le x, y, z \\le 1$.',
      steps: [
        'Divergence: $2 + 2y + 3 = 5 + 2y$.',
        'Volume integral: $\\int_0^1\\!\\int_0^1\\!\\int_0^1 (5 + 2y)\\,dx\\,dy\\,dz = 5 + 2 \\cdot \\tfrac12 = 6$.',
        'Check face by face: $x = 1$ gives $2$, $y = 1$ gives $1$, $z = 1$ gives $3$; on the faces $x = 0$, $y = 0$, $z = 0$ the normal component of $\\vec F$ is zero.',
        'Total $2 + 1 + 3 = 6$, as the theorem promised.'
      ],
      a: '6'
    },
    {
      title: 'A charge inside a box',
      q: 'A charge of 5 nC sits somewhere inside a closed cardboard box. What is the electric flux out of the box? What if a second charge of −5 nC is added inside?',
      steps: [
        'Gauss\'s law: $\\Phi_E = Q/\\varepsilon_0 = 5\\times 10^{-9} / 8.85\\times 10^{-12} = 565$ V·m.',
        'The position of the charge and the shape of the box do not matter.',
        'With $-5$ nC added the enclosed charge is zero, so the net flux is zero — though field lines still pass through the box walls, going out and coming back in.'
      ],
      a: '565 V·m; zero with both charges inside.'
    }
  ],
  quiz: [
    { q: 'A closed surface surrounds a region where $\\nabla\\cdot\\vec F = 0$ everywhere, and $\\vec F$ is smooth there. The net flux out is…', choices: ['positive', 'zero', 'negative', 'impossible to tell'], a: 1,
      why: 'The flux equals the integral of the divergence over the inside, which is zero.' },
    { q: 'The flux of the Earth\'s gravitational field through a closed surface around the Earth depends on…', choices: ['the shape of the surface', 'the mass enclosed', 'the size of the surface', 'the rotation of the Earth'], a: 1,
      why: 'Gravity is also an inverse-square field: $\\oiint\\vec g\\cdot d\\vec A = -4\\pi G M_\\text{inside}$, whatever the surface.' },
    { q: 'The divergence theorem applies only to closed surfaces.', a: true,
      why: 'The surface must be the complete boundary of a region; an open surface has no inside to integrate over.' },
    { q: 'Using the theorem, write the flux of $\\vec F = (ax, ay, az)$ out of a sphere of radius $R$, where $a$ is a constant.', answer: '4*a*pi*R^3', vars: ['a', 'R'],
      why: '$\\nabla\\cdot\\vec F = 3a$, and $3a \\times \\tfrac43\\pi R^3 = 4\\pi a R^3$.' },
    { q: 'In the proof, the fluxes through the inner faces of the small boxes cancel because…', choices: ['the field is zero on them', 'each is counted twice with opposite outward normals', 'they are much smaller than the outer faces', 'the divergence is zero there'], a: 1,
      why: 'A shared face is outflow for one box and exactly the same amount of inflow for its neighbour.' }
  ],
  problems: [
    { q: 'Use the divergence theorem to find the flux of $\\vec F = (3x, -y, 2z)$ out of a sphere of radius 2.', answer: 134.04, tol: 0.01,
      steps: ['$\\nabla\\cdot\\vec F = 3 - 1 + 2 = 4$, constant.', 'Flux $= 4 \\times \\tfrac43\\pi \\times 2^3 = \\tfrac{128\\pi}{3} = 134.0$.'] }
  ],
  applications: [
    'Deriving the continuity equation, charge conservation and the heat equation.',
    'Gauss\'s law for electricity and gravity, and finding fields of symmetric charge and mass distributions.',
    'Numerical simulation of fluids and heat by finite volumes, which balance the fluxes through cell faces.'
  ],
  history: 'Joseph-Louis Lagrange and Carl Friedrich Gauss used special cases in the 18th and early 19th centuries; Mikhail Ostrogradsky gave a general statement and proof in 1826, and George Green published a version in 1828.',
  sim: { id: 'vlc-vector-field', params: { field: 'source' } }
},

{
  id: 'stokes-theorem', parent: 'vector-calculus', title: 'Stokes\' theorem', level: 3,
  short: 'The circulation of a field round a closed loop equals the flux of its curl through any surface bounded by the loop; in the plane this is Green\'s theorem.',
  keywords: ['Stokes\' theorem', 'Green\'s theorem', 'circulation', 'curl', 'boundary', 'orientation', 'right-hand rule', 'shoelace formula', 'planimeter'],
  prereq: ['curl', 'line-integrals', 'flux-integrals'],
  related: ['divergence-theorem', 'fundamental-theorem', 'physics:amperes-law', 'physics:faradays-law', 'physics:maxwells-equations'],
  body: `
### Adding up little whirlpools
Cover a surface with a mesh of tiny loops, all turning the same way. The circulation round each little loop is the [[curl]] through it times its area. Now add all the circulations. Every inner edge is shared by two neighbouring loops that run along it in opposite directions, so their contributions cancel; only the outer rim survives:

$$\\oint_{C} \\vec F\\cdot d\\vec r = \\iint_{S} (\\nabla\\times\\vec F)\\cdot d\\vec A$$

This is **Stokes' theorem**: the circulation of a field round a closed curve $C$ equals the flux of its curl through any surface $S$ that has $C$ as its edge. The directions are tied by the right-hand rule: curl your fingers along the direction of travel round $C$, and your thumb shows which side of $S$ the normal points to.

### Green's theorem
For a flat region $R$ in the $xy$-plane, with its boundary $C$ traversed anticlockwise, only the $z$-component of the curl matters, and Stokes' theorem becomes **Green's theorem**:

$$\\oint_C (P\\,dx + Q\\,dy) = \\iint_R \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$$

Check it on $\\vec F = (-y, x)$ and a circle of radius $R$: the circulation is $2\\pi R^2$ (see [[line-integrals]]), and the curl is 2 over an area $\\pi R^2$ — the same. Choosing $P = -y/2$ and $Q = x/2$ makes the integrand 1, so the **area** of a region is a line integral round its edge, $A = \\tfrac12\\oint (x\\,dy - y\\,dx)$. For a polygon this becomes the surveyor's **shoelace formula**, and mechanical planimeters measure areas on maps by tracing their outlines on exactly this principle.

### Any surface will do
The theorem does not care which surface you pick, as long as it has the right edge: a flat disc and a bulging butterfly net on the same hoop carry the same flux of curl. (Together the two surfaces enclose a volume, and the flux of a curl out of a closed surface is zero, because $\\nabla\\cdot(\\nabla\\times\\vec F) = 0$.)

### Curl-free fields and holes
If $\\nabla\\times\\vec F = \\vec 0$ on a surface spanning a loop, the circulation round the loop is zero. On a region without holes, every loop spans such a surface, so a curl-free field is conservative. The **point vortex** $(-y, x)/(x^2 + y^2)$ shows why the condition matters: its curl is zero wherever it is defined, yet its circulation round the unit circle is $2\\pi$. The origin, where the field blows up, is a hole in the domain, and every surface spanning the circle has to pass through it. In the simulation, choose the point vortex and drag the probe circle over its centre.

### In physics
Stokes' theorem translates the laws of electromagnetism between their two forms. [[physics:amperes-law|Ampère's law]] $\\oint\\vec B\\cdot d\\vec r = \\mu_0 I$ round a loop is equivalent to $\\nabla\\times\\vec B = \\mu_0\\vec J$ at each point, and [[physics:faradays-law|Faraday's law]] — the EMF round a loop equals minus the rate of change of the magnetic flux through it — is equivalent to $\\nabla\\times\\vec E = -\\partial\\vec B/\\partial t$. In aerodynamics the lift on a wing is proportional to the circulation of the air round it.

> [!key] The fundamental theorem of calculus, the fundamental theorem for line integrals, Green's theorem, Stokes' theorem and the divergence theorem are one idea: integrating a derivative over a region gives the same as integrating the original function over the region's boundary.
`,
  ideas: [
    'Circulation round a loop = flux of the curl through any surface bounded by the loop.',
    'Proof idea: add the circulations of small loops; shared inner edges cancel.',
    'The orientation of the loop and of the surface are linked by the right-hand rule.',
    'In the plane it is Green\'s theorem, which also gives areas from boundaries (the shoelace formula).',
    'A curl-free field has zero circulation round loops that can be filled in without leaving its domain.'
  ],
  pitfalls: [
    'Any orientation will do — The loop direction and the surface normal must match by the right-hand rule, or the sign comes out wrong.',
    'Zero curl means zero circulation round every loop — Not if the loop encircles a point or line where the field is undefined, like the point vortex or the magnetic field round a wire.',
    'The surface must be flat — Any surface with the given edge gives the same flux of the curl.'
  ],
  derivation: {
    title: 'Green\'s theorem on a rectangle',
    steps: [
      { text: 'Let $R = [a, b]\\times[c, d]$, traversed anticlockwise. The $P\\,dx$ terms come from the bottom edge ($y = c$, left to right) and the top edge ($y = d$, right to left):', tex: '\\int_a^b \\big[P(x, c) - P(x, d)\\big]dx = -\\int_a^b\\!\\int_c^d \\frac{\\partial P}{\\partial y}\\,dy\\,dx' },
      { text: 'The $Q\\,dy$ terms come from the right edge (up) and the left edge (down):', tex: '\\int_c^d \\big[Q(b, y) - Q(a, y)\\big]dy = \\int_c^d\\!\\int_a^b \\frac{\\partial Q}{\\partial x}\\,dx\\,dy' },
      { text: 'Each step used the fundamental theorem of calculus. Adding the two:', tex: '\\oint_C (P\\,dx + Q\\,dy) = \\iint_R \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA' },
      { text: 'Any region can be approximated by rectangles whose shared edges cancel, which extends the result.' }
    ]
  },
  formulas: [
    {
      name: 'Area of a triangle from its corners (shoelace)',
      expr: 'A = 0.5*abs(x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2))',
      tex: 'A = \\tfrac12\\left| x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2) \\right|',
      vars: {
        A: { name: 'area', q: 'area', unit: 'm²' },
        x1: { name: 'x of corner 1', q: 'length', unit: 'm', value: 1, signed: true },
        y1: { name: 'y of corner 1', q: 'length', unit: 'm', value: 1, signed: true },
        x2: { name: 'x of corner 2', q: 'length', unit: 'm', value: 5, signed: true },
        y2: { name: 'y of corner 2', q: 'length', unit: 'm', value: 2, signed: true },
        x3: { name: 'x of corner 3', q: 'length', unit: 'm', value: 2, signed: true },
        y3: { name: 'y of corner 3', q: 'length', unit: 'm', value: 4, signed: true }
      },
      note: 'Green\'s theorem with $A = \\tfrac12\\oint(x\\,dy - y\\,dx)$ applied to the three straight sides. Without the absolute value the sign tells whether the corners run anticlockwise (+) or clockwise (−).',
      practice: { unknowns: ['A'] }
    },
    {
      name: 'Circulation when the curl is uniform',
      expr: 'G = C*A', tex: '\\Gamma = C A',
      vars: {
        G: { name: 'circulation round the boundary', tex: '\\Gamma', signed: true },
        C: { name: 'curl (the same everywhere inside)', value: 2, signed: true },
        A: { name: 'area enclosed', value: 3 }
      },
      note: 'Green\'s theorem when $\\partial Q/\\partial x - \\partial P/\\partial y$ is constant — for a rigid rotation, twice the angular velocity.'
    }
  ],
  examples: [
    {
      title: 'Checking Stokes\' theorem',
      q: 'For $\\vec F = (-y, x, 0)$ and the circle of radius $R$ in the $xy$-plane, compare the circulation with the flux of the curl through (a) the flat disc and (b) the upper hemisphere with the same rim.',
      steps: [
        'Circulation: $\\oint\\vec F\\cdot d\\vec r = 2\\pi R^2$ (field of length $R$ along a path of length $2\\pi R$).',
        'Curl: $\\nabla\\times\\vec F = (0, 0, 2)$, uniform.',
        '(a) Disc, normal $\\hat k$: flux $= 2 \\times \\pi R^2 = 2\\pi R^2$.',
        '(b) Hemisphere: the flux of a uniform field through it equals the flux through its shadow on the $xy$-plane, again $2\\pi R^2$.'
      ],
      a: 'All three give 2πR².'
    },
    {
      title: 'The area of a field from its fence posts',
      q: 'A field has corners at $(0, 0)$, $(60, 0)$, $(80, 50)$ and $(20, 70)$ metres, in anticlockwise order. Find its area with the shoelace formula.',
      steps: [
        'Green\'s theorem on each straight side gives $A = \\tfrac12\\sum (x_i y_{i+1} - x_{i+1} y_i)$.',
        'Side terms: $0\\cdot 0 - 60\\cdot 0 = 0$; $60\\cdot 50 - 80\\cdot 0 = 3000$; $80\\cdot 70 - 20\\cdot 50 = 4600$; $20\\cdot 0 - 0\\cdot 70 = 0$.',
        'Sum 7600, so $A = 3800$ m², or 0.38 hectares.',
        'Check: the diagonal from $(0, 0)$ to $(80, 50)$ splits it into triangles of 1500 and 2300 m².'
      ],
      a: '3800 m²'
    }
  ],
  quiz: [
    { q: 'Two different surfaces share the same boundary loop. The fluxes of $\\nabla\\times\\vec F$ through them (with matching orientation) are…', choices: ['always equal', 'equal only if both are flat', 'opposite in sign', 'unrelated'], a: 0,
      why: 'Both equal the circulation round the common edge.' },
    { q: 'Green\'s theorem is Stokes\' theorem for a flat region in the plane.', a: true,
      why: 'For a surface in the $xy$-plane the normal is $\\hat k$, and only the $z$-component of the curl, $\\partial Q/\\partial x - \\partial P/\\partial y$, enters.' },
    { q: 'The point vortex has zero curl away from the origin, yet its circulation round the unit circle is $2\\pi$. Why does Stokes\' theorem not give 0?', choices: ['the field is undefined at the origin, inside the loop', 'Stokes\' theorem only works for squares', 'the curl was computed wrongly', 'the loop is traversed clockwise'], a: 0,
      why: 'The theorem needs a smooth field on the whole surface. Every surface spanning the circle passes through the origin, where the field blows up.' },
    { q: 'By Green\'s theorem, what is $\\oint(-y\\,dx + x\\,dy)$ anticlockwise round the edge of a region of area $A$?', answer: '2A', vars: ['A'],
      why: '$\\partial Q/\\partial x - \\partial P/\\partial y = 1 - (-1) = 2$, integrated over the region: $2A$.' },
    { q: 'Ampère\'s law $\\oint\\vec B\\cdot d\\vec r = \\mu_0 I$ is the integral form of which differential law?', choices: ['$\\nabla\\cdot\\vec B = 0$', '$\\nabla\\times\\vec B = \\mu_0\\vec J$ (steady currents)', '$\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0$', '$\\nabla\\times\\vec E = \\vec 0$'], a: 1,
      why: 'Stokes\' theorem turns the circulation of $\\vec B$ into the flux of $\\nabla\\times\\vec B$, and the current $I$ into the flux of the current density $\\vec J$.' }
  ],
  problems: [
    { q: 'Use Green\'s theorem to evaluate $\\oint(-y^3\\,dx + x^3\\,dy)$ once anticlockwise round the unit circle.', answer: 4.712, tol: 0.01,
      steps: ['$\\partial Q/\\partial x - \\partial P/\\partial y = 3x^2 + 3y^2 = 3r^2$.', 'In polar coordinates: $\\int_0^{2\\pi}\\!\\int_0^1 3r^2\\,r\\,dr\\,d\\theta = 2\\pi \\cdot \\tfrac34 = \\tfrac{3\\pi}{2} = 4.71$.'] }
  ],
  applications: [
    'Ampère\'s and Faraday\'s laws in integral and differential form.',
    'Surveying: the shoelace formula for the area of a plot from its corner coordinates.',
    'Planimeters, which measure areas on maps by tracing their boundaries.',
    'Aerodynamics: lift from the circulation round a wing.'
  ],
  history: 'The theorem first appeared in a letter from William Thomson (Lord Kelvin) to George Stokes in 1850. Stokes set it as a question in the Cambridge Smith\'s Prize examination of 1854, and his name stuck.',
  sim: { id: 'vlc-vector-field', params: { field: 'rotation', ring: 'circ' } }
}

);
