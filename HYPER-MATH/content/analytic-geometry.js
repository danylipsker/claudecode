/* HYPER-MATH · content/analytic-geometry.js — geometry done with coordinates: points and
 * distances, lines, the conic sections, polar and three-dimensional coordinates, and
 * curves traced by a moving point. */
Hyper.add(

{
  id: 'coordinate-geometry', parent: 'analytic-geometry', title: 'Coordinates, distance and midpoint', level: 1,
  short: 'Give every point a pair of numbers (x, y) and geometry becomes algebra: distance comes from Pythagoras, a midpoint is an average, and a circle is an equation.',
  keywords: ['coordinates', 'Cartesian', 'x-axis', 'y-axis', 'origin', 'quadrant', 'distance formula', 'midpoint', 'section formula', 'equation of a circle', 'Descartes', 'ordered pair'],
  prereq: ['pythagorean-theorem', 'number-systems'],
  related: ['equation-of-a-line', 'vectors', 'polar-coordinates', 'coordinate-systems-3d', 'systems-of-equations', 'physics:position-displacement'],
  body: `
In 1637 René Descartes published an idea that joined two branches of mathematics: label every point of the plane with a pair of numbers, and every question of geometry becomes a question about numbers. Draw two perpendicular number lines, the **x-axis** and the **y-axis**, crossing at the **origin** $O$. A point $P$ is then given by its **coordinates** $(x, y)$: how far across and how far up it is from $O$. The axes split the plane into four **quadrants**, numbered anticlockwise from the top right, where both coordinates are positive.

### Distance
Two points $P_1(x_1, y_1)$ and $P_2(x_2, y_2)$ are the ends of the hypotenuse of a right triangle whose legs are $\\Delta x = x_2 - x_1$ and $\\Delta y = y_2 - y_1$. By the [[pythagorean-theorem|Pythagorean theorem]],

$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

The signs of the differences do not matter, because they are squared. In three dimensions, add $(z_2 - z_1)^2$ under the root.

### Midpoint and points in between
The midpoint of $P_1P_2$ averages the coordinates: $\\left(\\tfrac{x_1 + x_2}{2}, \\tfrac{y_1 + y_2}{2}\\right)$. More generally, the point a fraction $t$ of the way from $P_1$ to $P_2$ is $(x_1 + t\\,\\Delta x,\\ y_1 + t\\,\\Delta y)$ — the idea behind [[parametric-curves|parametric]] lines, and behind every animation that glides an object from one place to another.

### Curves as equations
A curve becomes the set of points whose coordinates satisfy an equation. The circle of radius $r$ about the centre $(a, b)$ is every point at distance $r$ from it:

$$(x - a)^2 + (y - b)^2 = r^2$$

A straight line is a linear equation ([[equation-of-a-line]]), and the [[conic-sections|conic sections]] are the equations of second degree. Where two curves cross, the coordinates satisfy both equations at once, so finding intersections means solving [[systems-of-equations|simultaneous equations]].

### Coordinates in science
Physics describes where things are with coordinates ([[physics:position-displacement|position]]), and the coordinate system is a choice made to suit the problem: the origin where the ball is thrown, the x-axis along the slope. Maps use eastings and northings; computer screens count pixels from the top-left corner, with $y$ increasing *downwards*; GPS gives latitude and longitude, which are coordinates on a sphere ([[coordinate-systems-3d]]). When a problem has a centre, [[polar-coordinates|polar coordinates]] are often the better choice.

> [!tip] A quick check for a right angle in coordinates: compute the three squared side lengths and see whether the two smaller add up to the largest.
`,
  ideas: [
    'A point in the plane is an ordered pair (x, y) measured from the origin along two perpendicular axes.',
    'The distance between two points is √(Δx² + Δy²): Pythagoras on the coordinate differences.',
    'The midpoint averages the coordinates.',
    'A curve is the set of points satisfying an equation; intersections solve two equations together.'
  ],
  pitfalls: [
    'Mixing up the order (x, y) — The first number is always across (x), the second up (y). (3, 5) and (5, 3) are different points.',
    'A negative difference gives a negative distance — The differences are squared, so the distance is always positive; only the direction has a sign.',
    'x² + y² = 25 has radius 25 — The right side is r², so the radius is 5.'
  ],
  formulas: [
    {
      name: 'Distance between two points',
      expr: 'd = sqrt((x2 - x1)^2 + (y2 - y1)^2)', tex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
      vars: {
        d: { name: 'distance' },
        x1: { name: 'x of the first point', value: 1, signed: true },
        y1: { name: 'y of the first point', value: 2, signed: true },
        x2: { name: 'x of the second point', value: 7, signed: true },
        y2: { name: 'y of the second point', value: 10, signed: true }
      },
      practice: { unknowns: ['d'] },
      stories: { d: 'On a map grid in kilometres, a village is at ({x1}, {y1}) and a mast at ({x2}, {y2}). How far apart are they, in a straight line?' }
    },
    {
      name: 'Points on a circle',
      expr: '(x - a)^2 + (y - b)^2 = r^2', tex: '(x - a)^2 + (y - b)^2 = r^2', solveFor: 'y',
      vars: {
        x: { name: 'x of the point', value: 5, signed: true },
        y: { name: 'y of the point', signed: true },
        a: { name: 'x of the centre', value: 2, signed: true },
        b: { name: 'y of the centre', value: -1, signed: true },
        r: { name: 'radius', value: 5 }
      },
      note: 'Solving for $y$ gives the two points of the circle above and below the given $x$ (none if the vertical line misses the circle).',
      practice: { unknowns: ['r', 'y'] }
    }
  ],
  examples: [
    {
      title: 'Distance on a map grid',
      q: 'On a grid in kilometres, a farm is at (2, 3) and a church at (14, 8). How far apart are they as the crow flies, and where is the halfway point?',
      steps: [
        '$\\Delta x = 14 - 2 = 12$, $\\Delta y = 8 - 3 = 5$.',
        '$d = \\sqrt{12^2 + 5^2} = \\sqrt{169} = 13\\ \\mathrm{km}$.',
        'Midpoint: $\\left(\\tfrac{2 + 14}{2}, \\tfrac{3 + 8}{2}\\right) = (8, 5.5)$.'
      ],
      a: '13 km; halfway at (8, 5.5)'
    },
    {
      title: 'Centre and radius from an equation',
      q: 'Find the centre and radius of the circle $x^2 + y^2 - 6x + 4y - 12 = 0$.',
      steps: [
        'Group and complete the squares: $(x^2 - 6x + 9) + (y^2 + 4y + 4) = 12 + 9 + 4$.',
        '$(x - 3)^2 + (y + 2)^2 = 25$.',
        'Compare with $(x - a)^2 + (y - b)^2 = r^2$: centre $(3, -2)$, radius 5.'
      ],
      a: 'Centre (3, −2), radius 5'
    },
    {
      title: 'Is there a right angle?',
      q: 'Show that the triangle with corners $A(1, 1)$, $B(4, 5)$ and $C(8, 2)$ has a right angle.',
      steps: [
        '$AB^2 = 3^2 + 4^2 = 25$, $BC^2 = 4^2 + (-3)^2 = 25$, $AC^2 = 7^2 + 1^2 = 50$.',
        '$AB^2 + BC^2 = 50 = AC^2$, so by the converse of Pythagoras the angle at $B$ is 90°.',
        'Since $AB = BC$, it is also isosceles.'
      ],
      a: 'Right-angled (and isosceles) at B'
    }
  ],
  quiz: [
    { q: 'The distance between $(-2, 3)$ and $(4, -5)$ is…', choices: ['$\\sqrt{20}$', '10', '14', '100'], a: 1,
      why: '$\\Delta x = 6$, $\\Delta y = -8$: $\\sqrt{36 + 64} = 10$. 14 adds the sizes of the differences instead of using Pythagoras.' },
    { q: 'The midpoint of $(1, 7)$ and $(5, -3)$ is…', choices: ['(3, 2)', '(2, 5)', '(6, 4)', '(3, 5)'], a: 0, why: 'Average each coordinate: $(1 + 5)/2 = 3$ and $(7 - 3)/2 = 2$.' },
    { q: 'In which quadrant is the point $(-3, 4)$?', choices: ['First', 'Second', 'Third', 'Fourth'], a: 1, why: 'Negative x and positive y: up and to the left, the second quadrant (counting anticlockwise from the top right).' },
    { q: 'Write the square of the distance from the point $(x, 0)$ to the point $(0, 3)$.', answer: 'x^2 + 9', vars: ['x'], why: '$(x - 0)^2 + (0 - 3)^2 = x^2 + 9$.' },
    { q: 'The equation $x^2 + y^2 = 25$ describes a circle of radius 25.', a: false, why: 'The right-hand side is $r^2$, so $r = 5$.' }
  ],
  applications: [
    'Maps, GPS and surveying.',
    'Computer graphics and games, where every object has coordinates and distances decide collisions.',
    'Physics, where choosing good axes is often half the solution.'
  ],
  history: 'René Descartes (La Géométrie, 1637) and Pierre de Fermat, independently, invented coordinate geometry, turning curves into equations.'
},

{
  id: 'equation-of-a-line', parent: 'analytic-geometry', title: 'The equation of a line', level: 1,
  short: 'A straight line is fixed by its slope and one point: y = mx + c. Parallel lines share a slope; perpendicular slopes multiply to −1.',
  keywords: ['straight line', 'slope', 'gradient', 'intercept', 'y = mx + c', 'point-slope form', 'general form', 'parallel lines', 'perpendicular lines', 'distance from a point to a line', 'rise over run'],
  prereq: ['coordinate-geometry', 'linear-functions', 'linear-equations'],
  related: ['linear-regression', 'derivative', 'right-triangle-trig', 'systems-of-equations', 'physics:motion-graphs'],
  body: `
A straight line is the simplest curve, and its equation is the simplest equation. Any line that is not vertical can be written

$$y = mx + c$$

where $m$ is the **slope** (or **gradient**) and $c$ the **intercept**, the height at which the line crosses the y-axis. Give it an $x$ and it returns the height of the line there.

### Slope: rise over run
Between any two points $(x_1, y_1)$ and $(x_2, y_2)$ on the line,

$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\text{rise}}{\\text{run}}$$

and the answer is the same whichever two points you pick, because the slope triangles they make are all [[similar-triangles|similar]]. A positive slope climbs to the right, a negative slope falls, zero is horizontal, and a vertical line has no slope at all (its run is zero). The slope is also the tangent of the angle $\\theta$ the line makes with the x-axis, $m = \\tan\\theta$ ([[right-triangle-trig]]): a road sign warning of a 10 % gradient means $m = 0.10$, an angle of 5.7°.

### Other ways to write a line
- **Point–slope form:** through $(x_1, y_1)$ with slope $m$: $\\;y - y_1 = m(x - x_1)$. Usually the quickest to write down.
- **Through two points:** find $m$ from the two points, then use point–slope.
- **General form:** $ax + by + c = 0$. It includes vertical lines ($b = 0$), and the vector $(a, b)$ is perpendicular to the line.

### Parallel and perpendicular
Parallel lines have equal slopes. Perpendicular lines have slopes whose product is $-1$:

$$m_1 m_2 = -1, \\qquad m_2 = -\\frac{1}{m_1}$$

Turning a slope triangle with run 1 and rise $m$ through 90° gives run $-m$ and rise 1, a slope of $-1/m$.

### Distance from a point to a line
The shortest distance from $(x_0, y_0)$ to the line $ax + by + c = 0$ is measured along the perpendicular:

$$d = \\frac{|a x_0 + b y_0 + c|}{\\sqrt{a^2 + b^2}}$$

### Lines in science
A straight-line graph means a **linear relationship**, and its slope is the rate of change: on a position–time graph it is the velocity ([[physics:motion-graphs|motion graphs]]), on a graph of voltage against current the resistance. When measured points scatter about a line, the best line through them is found by [[linear-regression|least squares]]. And the [[derivative]] of a function is the slope of its tangent line — the straight line that best matches a curve at one point — which is where calculus begins.
`,
  ideas: [
    'y = mx + c: slope m (rise over run) and intercept c.',
    'The slope is the same between any two points of a line, and equals tan of its angle to the x-axis.',
    'Point–slope form y − y₁ = m(x − x₁) writes a line through a known point.',
    'Parallel: equal slopes. Perpendicular: slopes multiply to −1.'
  ],
  pitfalls: [
    'A vertical line has slope 0 — A horizontal line has slope 0. A vertical line has an undefined slope and is written x = constant.',
    'Mixing the order of the points — Subtract in the same order on top and bottom: (y₂ − y₁)/(x₂ − x₁), not (y₂ − y₁)/(x₁ − x₂).',
    'The perpendicular slope is the negative, −m — It is the negative reciprocal, −1/m. Slope 2 is perpendicular to −1/2, not −2.'
  ],
  formulas: [
    {
      name: 'Slope through two points',
      expr: 'm = (y2 - y1)/(x2 - x1)', tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
      vars: {
        m: { name: 'slope', signed: true },
        x1: { name: 'x of the first point', value: 2, signed: true },
        y1: { name: 'y of the first point', value: 3, signed: true },
        x2: { name: 'x of the second point', value: 6, signed: true },
        y2: { name: 'y of the second point', value: 11, signed: true }
      }
    },
    {
      name: 'Point–slope form',
      expr: 'y = y1 + m*(x - x1)', tex: 'y = y_1 + m(x - x_1)',
      vars: {
        y: { name: 'height of the line at x', signed: true },
        y1: { name: 'y of the known point', value: 3, signed: true },
        m: { name: 'slope', value: 2, signed: true },
        x: { name: 'x', value: 5, signed: true },
        x1: { name: 'x of the known point', value: 2, signed: true }
      }
    },
    {
      name: 'Slope and angle of inclination',
      expr: 'm = tan(theta)', tex: 'm = \\tan\\theta',
      vars: {
        m: { name: 'slope (rise over run)', signed: true },
        theta: { name: 'angle to the horizontal', q: 'angle', unit: '°', value: 10, min: -89.9, max: 89.9, signed: true }
      },
      note: 'A gradient quoted as a percentage is 100 m: a 12 % road has $m = 0.12$.',
      stories: { theta: 'A road climbs with a gradient of {m} (rise over run). At what angle to the horizontal does it climb?', m: 'A ramp is inclined at {theta}. What is its slope, rise over run?' }
    },
    {
      name: 'Distance from a point to a line',
      expr: 'd = abs(a*x0 + b*y0 + c)/sqrt(a^2 + b^2)', tex: 'd = \\frac{|a x_0 + b y_0 + c|}{\\sqrt{a^2 + b^2}}',
      vars: {
        d: { name: 'shortest distance' },
        a: { name: 'coefficient of x in ax + by + c = 0', value: 3, signed: true },
        b: { name: 'coefficient of y', value: 4, signed: true },
        c: { name: 'constant term', value: -26, signed: true },
        x0: { name: 'x of the point', value: 1, signed: true },
        y0: { name: 'y of the point', value: 2, signed: true }
      },
      practice: { unknowns: ['d'] }
    }
  ],
  examples: [
    {
      title: 'A line and its perpendicular',
      q: 'Find the line through $(2, 3)$ and $(6, 11)$, and the line perpendicular to it through $(6, 11)$.',
      steps: [
        'Slope: $m = \\dfrac{11 - 3}{6 - 2} = 2$.',
        'Point–slope through $(2, 3)$: $y - 3 = 2(x - 2)$, that is $y = 2x - 1$.',
        'Perpendicular slope: $-1/2$. Through $(6, 11)$: $y - 11 = -\\tfrac12(x - 6)$, that is $y = -\\tfrac12 x + 14$.'
      ],
      a: 'y = 2x − 1, and y = −x/2 + 14'
    },
    {
      title: 'How far from the line?',
      q: 'How far is the point $(1, 2)$ from the line $3x + 4y - 26 = 0$?',
      steps: [
        '$d = \\dfrac{|3(1) + 4(2) - 26|}{\\sqrt{3^2 + 4^2}} = \\dfrac{|-15|}{5}$.',
        '$d = 3$.'
      ],
      a: '3 units'
    }
  ],
  quiz: [
    { q: 'What is the slope of a line perpendicular to $y = 3x + 2$?', choices: ['3', '−3', '1/3', '−1/3'], a: 3, why: 'Perpendicular slopes multiply to −1: $3 \\times (-1/3) = -1$.' },
    { q: 'Which line is parallel to $2x + y = 5$?', choices: ['$y = 2x + 1$', '$y = -2x + 1$', '$y = \\tfrac12 x + 5$', '$y = -\\tfrac12 x$'], a: 1,
      why: 'Rewrite $2x + y = 5$ as $y = -2x + 5$: slope −2. Parallel lines share the slope.' },
    { q: 'Write the line through $(1, 5)$ with slope 3 in the form $y = \\ldots$ (as an expression in $x$).', answer: '3x + 2', vars: ['x'], why: '$y - 5 = 3(x - 1)$, so $y = 3x + 2$.' },
    { q: 'A vertical line has slope 0.', a: false, why: 'Its run is zero, so rise ÷ run is undefined. Horizontal lines have slope 0.' },
    { q: 'A road sign shows a 12 % gradient. The road rises at about…', choices: ['1.2°', '6.8°', '12°', '27°'], a: 1, why: 'Slope 0.12 = tan θ, so θ = arctan 0.12 ≈ 6.8°. A 100 % gradient would be 45°.' }
  ],
  applications: [
    'Reading rates from straight-line graphs: speed, resistance, cost per item.',
    'Road and rail gradients, roof pitches and wheelchair ramps.',
    'Fitting straight lines to experimental data.'
  ]
},

{
  id: 'conic-sections', parent: 'analytic-geometry', title: 'Conic sections', level: 2,
  short: 'Slice a double cone with a plane and you get a circle, an ellipse, a parabola or a hyperbola. All of them are the curves whose distance to a focus is a fixed multiple e of the distance to a line.',
  keywords: ['conic section', 'cone', 'eccentricity', 'focus', 'directrix', 'circle', 'ellipse', 'parabola', 'hyperbola', 'Apollonius', 'second-degree equation', 'discriminant', 'orbit', 'semi-latus rectum'],
  prereq: ['coordinate-geometry', 'circles', 'quadratic-equations'],
  related: ['ellipse', 'parabola', 'hyperbola', 'polar-coordinates', 'physics:keplers-laws', 'physics:projectile-motion'],
  body: `
Shine a torch at a wall. Pointed straight at it, the lit patch is a circle; tilt the torch and the circle stretches into an ellipse; tilt it further and the patch opens into a parabola and then a hyperbola that runs off without end. The beam is a cone of light and the wall a plane slicing it: these four curves are the **conic sections**, studied by Greek geometers some two thousand years before anyone knew that planets and comets move along them.

### Slicing a cone
Take a double cone — two cones tip to tip — and cut it with a plane that misses the tip.
- Perpendicular to the axis: a **circle**.
- Tilted, but less steeply than the side of the cone: a closed oval, an **ellipse**.
- Exactly parallel to the side: a **parabola**, open at one end.
- Steeper than the side, cutting both halves of the cone: a **hyperbola**, with two separate branches.

Planes through the tip give the "degenerate" conics: a single point, one line, or a pair of crossing lines.

### One definition for all: focus and directrix
Choose a point $F$, the **focus**, and a line, the **directrix**. The points $P$ whose distance to the focus is a fixed multiple $e$ of their distance to the directrix,

$$PF = e \\cdot PD,$$

form a conic. The number $e$ is the **eccentricity**: $e < 1$ gives an ellipse, $e = 1$ a parabola, $e > 1$ a hyperbola, and the circle is the limiting case $e \\to 0$. In the simulation you can slide $e$ and watch one family turn into the next.

### Their equations
In coordinates every conic is an equation of the second degree,

$$Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0,$$

and the sign of $B^2 - 4AC$ tells which one it is: negative for an ellipse (or circle), zero for a parabola, positive for a hyperbola. With the axes along the curve's lines of symmetry, the equations become the tidy standard forms of the [[ellipse]], the [[parabola]] and the [[hyperbola]].

With the focus at the origin and the angle $\\theta$ measured from the direction of the nearest point of the curve, all of them share one [[polar-coordinates|polar]] equation,

$$r = \\frac{\\ell}{1 + e\\cos\\theta}$$

where $\\ell$, the **semi-latus rectum**, sets the size: it is the distance from the focus to the curve measured at right angles to the axis.

### Why physics cares
That polar equation is exactly the path of a body under an inverse-square force. Newton showed that the orbit of a planet or comet about the Sun is a conic with the Sun at a focus ([[physics:keplers-laws|Kepler's laws]]): bound orbits are ellipses, and a body faster than [[physics:escape-velocity|escape velocity]] follows a hyperbola and never returns. A thrown ball traces a parabola ([[physics:projectile-motion|projectile motion]]), and curved mirrors and antennas exploit the focusing properties of the parabola and the ellipse.
`,
  ideas: [
    'Circle, ellipse, parabola and hyperbola are the curves made by slicing a double cone with a plane.',
    'Each is the set of points with PF = e·PD for a focus F and a directrix; the eccentricity e decides the type.',
    'In coordinates they are the second-degree equations; the sign of B² − 4AC classifies them.',
    'With a focus at the origin every conic is r = ℓ/(1 + e cos θ) — the shape of every orbit under gravity.'
  ],
  pitfalls: [
    'A parabola is half of an ellipse — An ellipse closes up; a parabola never does, and its arms do not approach straight lines either (a hyperbola\'s do).',
    'The hyperbola is two parabolas back to back — Its branches straighten out along asymptotes, while a parabola keeps bending more slowly without ever approaching a line.',
    'The circle has eccentricity 1 — It has e = 0: it is the least eccentric conic. e = 1 is the parabola.'
  ],
  formulas: [
    {
      name: 'Conic with a focus at the origin (polar form)',
      expr: 'r = l/(1 + ecc*cos(theta))', tex: 'r = \\frac{\\ell}{1 + e\\cos\\theta}',
      vars: {
        r: { name: 'distance from the focus', q: 'length', unit: 'km' },
        l: { name: 'semi-latus rectum', q: 'length', unit: 'km', value: 5.546e7, tex: '\\ell' },
        ecc: { name: 'eccentricity', value: 0.2056, tex: 'e' },
        theta: { name: 'angle from the nearest point', q: 'angle', unit: '°', value: 60, min: -180, max: 180, signed: true }
      },
      note: 'The starting values are Mercury\'s orbit round the Sun: closest 46.0 million km, farthest 69.8 million km.',
      practice: { unknowns: ['r'] },
      stories: { r: 'A planet\'s orbit has semi-latus rectum {l} and eccentricity {ecc}. How far is it from the Sun when it is {theta} round from its closest point?' }
    },
    {
      name: 'Which conic? The discriminant',
      expr: 'D = B^2 - 4*A*C', tex: 'D = B^2 - 4AC',
      vars: {
        D: { name: 'discriminant (negative: ellipse, zero: parabola, positive: hyperbola)', signed: true },
        A: { name: 'coefficient of x²', value: 4, signed: true },
        B: { name: 'coefficient of xy', value: 2, signed: true },
        C: { name: 'coefficient of y²', value: 9, signed: true }
      },
      note: 'For $Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0$ (the $D$ of the equation is a different number from this discriminant).'
    }
  ],
  examples: [
    {
      title: 'Classify and tidy up',
      q: 'What kind of conic is $4x^2 + 9y^2 - 16x - 20 = 0$? Find its standard form.',
      steps: [
        '$A = 4$, $B = 0$, $C = 9$: $B^2 - 4AC = -144 < 0$, an ellipse.',
        'Complete the square in $x$: $4(x^2 - 4x + 4) + 9y^2 = 20 + 16$, so $4(x - 2)^2 + 9y^2 = 36$.',
        'Divide by 36: $\\dfrac{(x - 2)^2}{9} + \\dfrac{y^2}{4} = 1$ — centre $(2, 0)$, semi-axes 3 and 2.'
      ],
      a: 'An ellipse: (x − 2)²/9 + y²/4 = 1'
    },
    {
      title: 'A tilted curve',
      q: 'Classify $x^2 - 4xy + 4y^2 + x = 0$ and $xy = 4$.',
      steps: [
        'First: $A = 1$, $B = -4$, $C = 4$: $B^2 - 4AC = 16 - 16 = 0$, a parabola (tilted, because of the $xy$ term).',
        'Second: $A = 0$, $B = 1$, $C = 0$: $B^2 - 4AC = 1 > 0$, a hyperbola — the graph of $y = 4/x$.'
      ],
      a: 'A parabola and a hyperbola'
    },
    {
      title: 'Mercury near and far',
      q: 'Mercury\'s orbit has $\\ell = 55.5$ million km and $e = 0.206$. Find its closest and farthest distances from the Sun.',
      steps: [
        'Closest at $\\theta = 0$: $r = \\dfrac{55.5}{1 + 0.206} = 46.0$ million km.',
        'Farthest at $\\theta = 180°$: $r = \\dfrac{55.5}{1 - 0.206} = 69.9$ million km.',
        'Sunlight at perihelion is $(69.9/46.0)^2 \\approx 2.3$ times as intense as at aphelion.'
      ],
      a: 'About 46 and 70 million km'
    }
  ],
  quiz: [
    { q: 'A conic has eccentricity exactly 1. It is…', choices: ['a circle', 'an ellipse', 'a parabola', 'a hyperbola'], a: 2, why: '$e = 1$ means every point is exactly as far from the focus as from the directrix: the parabola.' },
    { q: 'A plane parallel to the side of a cone cuts it in…', choices: ['a circle', 'an ellipse', 'a parabola', 'a hyperbola'], a: 2,
      why: 'Parallel to a side, the plane never meets that side, so the curve never closes, yet it cuts only one half of the cone.' },
    { q: 'The curve $x^2 - 4xy + 4y^2 + x = 0$ is…', choices: ['an ellipse', 'a parabola', 'a hyperbola', 'a circle'], a: 1, why: '$B^2 - 4AC = 16 - 4(1)(4) = 0$.' },
    { q: 'A circle is an ellipse with eccentricity 0.', a: true, why: '$e = c/a$ where $c$ is the centre-to-focus distance. For a circle the two foci coincide at the centre, so $c = 0$.' },
    { q: 'A comet passes the Sun on an orbit with $e = 1.2$. It will…', choices: ['return periodically', 'fall into the Sun', 'leave the Solar System for good', 'settle into a circular orbit'], a: 2,
      why: 'With $e > 1$ the orbit is a hyperbola, an open curve: the comet is moving faster than escape speed.' }
  ],
  applications: [
    'Orbits of planets, comets and spacecraft.',
    'Reflectors: parabolic dishes and headlamps, elliptical reflectors in lithotripsy and theatre lighting.',
    'The shapes of shadows, projections and the paths of thrown objects.'
  ],
  history: 'Menaechmus (4th century BCE) discovered the conics; Apollonius of Perga (about 200 BCE) named the ellipse, parabola and hyperbola and wrote eight books about them. Kepler (1609) found the planets move on ellipses, and Newton (1687) explained why.',
  sim: 'gt-conics'
},

{
  id: 'ellipse', parent: 'analytic-geometry', title: 'The ellipse', level: 2,
  short: 'The points whose distances to two foci add up to a constant: a stretched circle, x²/a² + y²/b² = 1, and the shape of every planetary orbit.',
  keywords: ['ellipse', 'foci', 'focus', 'major axis', 'minor axis', 'semi-major axis', 'semi-minor axis', 'eccentricity', 'string construction', 'orbit', 'perihelion', 'aphelion', 'whispering gallery', 'area pi a b'],
  prereq: ['conic-sections', 'circles', 'coordinate-geometry'],
  related: ['parametric-curves', 'polar-coordinates', 'physics:keplers-laws', 'physics:circular-orbits'],
  body: `
Push two drawing pins into a board, drop a loop of string over them, and pull it tight with a pencil. As the pencil goes round, the two stretches of string from the pins to the pencil always add up to the same length. The curve it draws is an **ellipse**, and the pins are its two **foci**:

$$PF_1 + PF_2 = 2a$$

### The standard equation
Put the centre at the origin with the foci on the x-axis at $(\\pm c, 0)$. The ellipse is

$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1, \\qquad c^2 = a^2 - b^2$$

where $a$ is the **semi-major axis** (half the longest diameter) and $b$ the **semi-minor axis** (half the shortest). The link between $a$, $b$ and $c$ comes from the pencil at the top of the curve, $(0, b)$: it is equally far from both pins, so each stretch of string is $a$, and Pythagoras gives $b^2 + c^2 = a^2$.

The **eccentricity** $e = c/a$ says how stretched it is: 0 for a circle, where the foci merge at the centre, and close to 1 for a long thin ellipse.

### A stretched circle
Squash a circle of radius $a$ vertically by the factor $b/a$ and you get this ellipse. That gives two facts at once. The **area** is the circle's area squashed by the same factor, $\\pi a^2 \\cdot b/a = \\pi ab$. And the curve can be traced as $x = a\\cos t$, $y = b\\sin t$ ([[parametric-curves]]). The **perimeter**, oddly, has no simple exact formula; Ramanujan's approximation $\\pi\\left[3(a + b) - \\sqrt{(3a + b)(a + 3b)}\\right]$ is excellent.

A circle seen at an angle looks like an ellipse — which is why round plates, wheels and the rings of Saturn appear elliptical in photographs.

### The reflection property
A ray from one focus bounces off the inside of an ellipse straight through the other focus. In an elliptical room a whisper at one focus is heard clearly at the other ("whispering galleries"). In lithotripsy, shock waves made at one focus of an elliptical reflector converge on a kidney stone placed at the other and shatter it without surgery.

### Orbits
Kepler discovered in 1609 that the planets move on ellipses with the Sun at one focus ([[physics:keplers-laws|Kepler's first law]]). The closest approach is $a(1 - e)$ (perihelion) and the farthest $a(1 + e)$ (aphelion). The Earth's orbit has $e = 0.0167$, so nearly circular that its distance from the Sun changes by only about 3 % over the year. Halley's comet, with $e = 0.967$, swings from inside the orbit of Venus to beyond Neptune. A [[physics:circular-orbits|circular orbit]] is the special case $e = 0$.
`,
  ideas: [
    'An ellipse is the set of points whose distances to two foci add up to 2a.',
    'Standard form x²/a² + y²/b² = 1 with c² = a² − b²; eccentricity e = c/a between 0 and 1.',
    'It is a circle stretched in one direction: area πab, parametrised by (a cos t, b sin t).',
    'Rays from one focus reflect through the other; planets orbit with the Sun at one focus.'
  ],
  pitfalls: [
    'The Sun is at the centre of a planet\'s orbit — It is at one focus. The centre of the ellipse is empty space.',
    'c² = a² + b² — That is the hyperbola. For the ellipse the foci lie inside, and c² = a² − b².',
    'Seasons come from the Earth\'s changing distance from the Sun — The orbit is nearly circular (3 % variation) and the Earth is closest in January; seasons come from the tilt of its axis.'
  ],
  formulas: [
    {
      name: 'Eccentricity from the semi-axes',
      expr: 'ecc = sqrt(1 - b^2/a^2)', tex: 'e = \\sqrt{1 - \\frac{b^2}{a^2}}',
      vars: {
        ecc: { name: 'eccentricity', tex: 'e' },
        a: { name: 'semi-major axis', value: 5 },
        b: { name: 'semi-minor axis', value: 3 }
      },
      practice: { unknowns: ['ecc', 'b'] }
    },
    {
      name: 'Area of an ellipse',
      expr: 'A = pi*a*b', tex: 'A = \\pi a b',
      vars: {
        A: { name: 'area', q: 'area', unit: 'm²' },
        a: { name: 'semi-major axis', q: 'length', unit: 'm', value: 3 },
        b: { name: 'semi-minor axis', q: 'length', unit: 'm', value: 2 }
      },
      stories: { A: 'An elliptical flower bed is {a} from the centre to its far end and {b} from the centre to its side. What is its area?' }
    },
    {
      name: 'Closest distance to the focus (perihelion)',
      expr: 'rp = a*(1 - ecc)', tex: 'r_p = a(1 - e)',
      vars: {
        rp: { name: 'closest distance to the focus', q: 'length', unit: 'km', tex: 'r_p' },
        a: { name: 'semi-major axis', q: 'length', unit: 'km', value: 1.496e8 },
        ecc: { name: 'eccentricity', value: 0.0167, min: 0, max: 0.999, tex: 'e' }
      },
      note: 'The farthest distance (aphelion) is $a(1 + e)$. The starting values are the Earth\'s orbit.',
      stories: { rp: 'A planet orbits with semi-major axis {a} and eccentricity {ecc}. How close does it come to its star?' }
    },
    {
      name: 'Perimeter (Ramanujan\'s approximation)',
      expr: 'P = pi*(3*(a + b) - sqrt((3*a + b)*(a + 3*b)))', tex: 'P \\approx \\pi\\left[3(a + b) - \\sqrt{(3a + b)(a + 3b)}\\right]',
      vars: {
        P: { name: 'perimeter', q: 'length', unit: 'm' },
        a: { name: 'semi-major axis', q: 'length', unit: 'm', value: 5 },
        b: { name: 'semi-minor axis', q: 'length', unit: 'm', value: 3 }
      },
      note: 'Accurate to better than one part in 10⁴ unless the ellipse is extremely thin.',
      practice: { unknowns: ['P'] }
    }
  ],
  examples: [
    {
      title: 'Reading an equation',
      q: 'For $\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$, find the foci, the eccentricity and the area.',
      steps: [
        '$a = 5$, $b = 3$, so $c = \\sqrt{25 - 9} = 4$: foci at $(\\pm 4, 0)$.',
        '$e = c/a = 0.8$.',
        'Area $= \\pi ab = 15\\pi \\approx 47.1$.'
      ],
      a: 'Foci (±4, 0), e = 0.8, area 15π ≈ 47.1'
    },
    {
      title: 'A gardener\'s ellipse',
      q: 'You want an elliptical bed 6 m long and 4 m wide, marked out with two pegs and a loop of rope. Where do the pegs go and how long is the loop?',
      steps: [
        '$a = 3$ m and $b = 2$ m, so $c = \\sqrt{9 - 4} = \\sqrt5 = 2.24$ m: pegs 2.24 m either side of the centre, 4.47 m apart.',
        'The loop goes round both pegs and the marker: its length is $PF_1 + PF_2 + F_1F_2 = 2a + 2c = 6 + 4.47 = 10.47$ m.'
      ],
      a: 'Pegs 4.47 m apart on the long axis; a loop 10.5 m long'
    },
    {
      title: 'Halley\'s comet',
      q: 'Halley\'s comet has $a = 17.8$ AU and $e = 0.967$. How close to and how far from the Sun does it go?',
      steps: [
        'Perihelion $a(1 - e) = 17.8 \\times 0.033 = 0.59$ AU — inside the orbit of Venus (0.72 AU).',
        'Aphelion $a(1 + e) = 17.8 \\times 1.967 = 35.0$ AU — beyond Neptune (30 AU).'
      ],
      a: '0.59 AU and 35 AU'
    }
  ],
  quiz: [
    { q: 'For the ellipse $\\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$, the sum $PF_1 + PF_2$ for any point on it is…', choices: ['4', '6', '8', '16'], a: 2, why: 'It is $2a$, and $a = 4$.' },
    { q: 'The foci of $\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$ are at…', choices: ['$(\\pm 3, 0)$', '$(\\pm 4, 0)$', '$(\\pm 5, 0)$', '$(0, \\pm 3)$'], a: 0, why: '$c = \\sqrt{25 - 16} = 3$, on the long (x) axis.' },
    { q: 'As the eccentricity of an ellipse goes to 0, the ellipse becomes a circle.', a: true, why: 'Then $c \\to 0$, the foci merge at the centre, and $b \\to a$.' },
    { q: 'An ellipse is twice as long as it is wide ($a = 2b$). Its eccentricity is about…', choices: ['0.5', '0.71', '0.87', '2'], a: 2, why: '$e = \\sqrt{1 - b^2/a^2} = \\sqrt{1 - 1/4} = \\sqrt{3}/2 \\approx 0.87$.' },
    { q: 'Where is the Sun in the Earth\'s elliptical orbit?', choices: ['At the centre of the ellipse', 'At one focus', 'At one end of the major axis', 'Midway between the foci and the orbit'], a: 1, why: 'Kepler\'s first law. The other focus is empty.' }
  ],
  applications: [
    'Planetary, satellite and comet orbits.',
    'Whispering galleries, elliptical reflectors for lithotripsy and stage lighting.',
    'Gears and cams with elliptical profiles, and the appearance of circles in perspective.'
  ],
  sim: { id: 'gt-conics', params: { e: 0.6 } }
},

{
  id: 'parabola', parent: 'analytic-geometry', title: 'The parabola', level: 2,
  short: 'Every point equally far from a focus and a line: the curve y = ax² that thrown balls follow and that dishes use to gather signals into a single point.',
  keywords: ['parabola', 'focus', 'directrix', 'vertex', 'axis of symmetry', 'y = ax^2', 'focal length', 'reflector', 'satellite dish', 'headlamp', 'projectile', 'quadratic graph', 'suspension bridge'],
  prereq: ['conic-sections', 'quadratic-equations', 'coordinate-geometry'],
  related: ['function-transformations', 'hyperbolic-functions', 'physics:projectile-motion', 'physics:spherical-mirrors'],
  body: `
A **parabola** is the set of points that are equally far from a fixed point, the **focus**, and a fixed line, the **directrix**. It is the conic with eccentricity exactly 1: the borderline between the closed ellipses and the open hyperbolas.

### The standard equation
Put the **vertex** — the point halfway between focus and directrix — at the origin, the focus at $(0, p)$ and the directrix along $y = -p$. For a point $(x, y)$ the distance to the focus is $\\sqrt{x^2 + (y - p)^2}$ and the distance to the directrix is $y + p$. Setting them equal and squaring,

$$x^2 + y^2 - 2py + p^2 = y^2 + 2py + p^2 \\quad\\Rightarrow\\quad x^2 = 4py$$

So $y = x^2/(4p)$: every graph $y = ax^2$ is a parabola with **focal length** $p = 1/(4a)$. A general quadratic $y = ax^2 + bx + c$ is the same curve moved: completing the square puts its vertex at $x = -b/(2a)$ ([[quadratic-equations]], [[function-transformations]]). The focal length sets how open it looks — a long focal length gives a flat, wide curve.

### The focusing property
Every ray travelling parallel to the axis reflects off a parabolic mirror straight through the focus: at each point the tangent makes equal angles with the vertical and with the line to the focus. Run the rays the other way and a source at the focus sends out a parallel beam. So
- satellite dishes and radio telescopes gather faint parallel signals into a receiver at the focus;
- reflecting telescopes, solar cookers and solar-thermal troughs concentrate starlight or sunlight;
- car headlamps and torches put the bulb at the focus to throw a straight beam.

Spherical mirrors are easier to make and behave almost identically close to the axis, which is why they are used when a narrow aperture will do ([[physics:spherical-mirrors|spherical mirrors]]).

### Parabolas in motion and in structures
A ball thrown in uniform gravity, without air resistance, follows a parabola: its horizontal position grows steadily while its height changes quadratically with time ([[physics:projectile-motion|projectile motion]]). The main cable of a suspension bridge, carrying a deck whose weight is spread evenly along its length, also hangs as a parabola — whereas a free chain hanging under its own weight forms a slightly different curve, the catenary ([[hyperbolic-functions]]).

> [!fact] A dish 60 cm across and 6 cm deep has $x = 30$ cm at $y = 6$ cm. Then $4p = 30^2/6 = 150$ cm, so the receiver belongs $p = 37.5$ cm in front of the centre of the dish.
`,
  ideas: [
    'A parabola is the set of points equidistant from a focus and a directrix (eccentricity 1).',
    'With vertex at the origin and focus (0, p), its equation is x² = 4py, i.e. y = x²/(4p).',
    'Every quadratic graph y = ax² + bx + c is a parabola with focal length 1/(4|a|).',
    'Rays parallel to the axis reflect through the focus — the principle of dishes, telescopes and headlamps.'
  ],
  pitfalls: [
    'The focus of y = x² is at (0, 1) — 4p = 1, so p = 1/4: the focus is at (0, 0.25).',
    'Any U-shaped curve is a parabola — A hanging chain (catenary) and y = x⁴ are U-shaped but are not parabolas; they do not focus parallel rays to a point.',
    'A spherical dish focuses perfectly — Only near its axis; rays near the rim cross the axis closer to the mirror (spherical aberration).'
  ],
  formulas: [
    {
      name: 'Parabola with vertex at the origin',
      expr: 'y = x^2/(4*p)', tex: 'y = \\frac{x^2}{4p}',
      vars: {
        y: { name: 'height above the vertex', q: 'length', unit: 'cm' },
        x: { name: 'distance from the axis', q: 'length', unit: 'cm', value: 6, signed: true },
        p: { name: 'focal length', q: 'length', unit: 'cm', value: 3 }
      },
      stories: { p: 'A headlamp reflector is {y} deep at a distance {x} from its axis. Where should the bulb go (the focal length)?' }
    },
    {
      name: 'Focal length of a dish from its size',
      expr: 'p = D^2/(16*d)', tex: 'p = \\frac{D^2}{16\\,d}',
      vars: {
        p: { name: 'focal length', q: 'length', unit: 'cm' },
        D: { name: 'diameter of the dish', q: 'length', unit: 'cm', value: 60 },
        d: { name: 'depth of the dish at its centre', q: 'length', unit: 'cm', value: 6 }
      },
      stories: {
        p: 'A satellite dish is {D} across and {d} deep. How far in front of its centre should the receiver be?',
        d: 'A solar cooker {D} across must focus sunlight {p} above its centre. How deep must it be?'
      }
    }
  ],
  examples: [
    {
      title: 'Vertex, focus and directrix',
      q: 'Find the vertex, focus and directrix of $y = 2x^2 - 8x + 3$.',
      steps: [
        'Complete the square: $y = 2(x^2 - 4x + 4) + 3 - 8 = 2(x - 2)^2 - 5$. The vertex is $(2, -5)$.',
        'Here $a = 2$, so the focal length is $p = 1/(4 \\times 2) = 1/8$.',
        'The parabola opens upward: focus $(2, -5 + 0.125) = (2, -4.875)$, directrix $y = -5.125$.'
      ],
      a: 'Vertex (2, −5), focus (2, −4.875), directrix y = −5.125'
    },
    {
      title: 'How deep is the dish?',
      q: 'A radio dish 1.2 m across has a focal length of 45 cm. How deep is it?',
      steps: [
        'At the rim $x = 60$ cm, and $y = x^2/(4p) = 3600/180$.',
        '$y = 20$ cm.'
      ],
      a: '20 cm'
    }
  ],
  quiz: [
    { q: 'Where is the focus of $y = x^2/8$?', choices: ['(0, 8)', '(0, 2)', '(0, 1/8)', '(0, 1/32)'], a: 1, why: 'Compare with $y = x^2/(4p)$: $4p = 8$, so $p = 2$.' },
    { q: 'Rays parallel to the axis of a parabolic mirror, after reflection, …', choices: ['spread out', 'pass through the focus', 'return along their paths', 'pass through the vertex'], a: 1, why: 'That is the focusing property the dish and the telescope rely on.' },
    { q: 'The directrix of $x^2 = 12y$ is…', choices: ['$y = 3$', '$y = -3$', '$y = -12$', '$x = -3$'], a: 1, why: '$4p = 12$, so $p = 3$: focus $(0, 3)$, directrix $y = -3$.' },
    { q: 'Without air resistance, the path of a thrown ball is part of a parabola.', a: true, why: 'Horizontal distance grows linearly in time and height quadratically, so height is a quadratic function of horizontal distance.' },
    { q: 'Where is the vertex of $y = x^2 - 6x + 1$?', choices: ['(3, −8)', '(−3, 28)', '(6, 1)', '(3, 1)'], a: 0, why: '$x = -b/(2a) = 3$ and $y = 9 - 18 + 1 = -8$.' }
  ],
  applications: [
    'Satellite dishes, radio telescopes and reflecting telescopes.',
    'Headlamps, torches and solar concentrators.',
    'Trajectories of projectiles and the cables of suspension bridges.'
  ],
  sim: { id: 'gt-conics', params: { e: 1 } }
},

{
  id: 'hyperbola', parent: 'analytic-geometry', title: 'The hyperbola', level: 2,
  short: 'The points whose distances from two foci differ by a constant: two mirror-image branches that straighten out along their asymptotes, x²/a² − y²/b² = 1.',
  keywords: ['hyperbola', 'asymptote', 'foci', 'branches', 'eccentricity', 'rectangular hyperbola', 'xy = k', 'inverse proportion', 'hyperbolic navigation', 'multilateration', 'hyperbolic orbit', 'hyperboloid', 'cooling tower'],
  prereq: ['conic-sections', 'ellipse', 'coordinate-geometry'],
  related: ['hyperbolic-functions', 'rational-functions', 'physics:spacetime-interval', 'physics:escape-velocity', 'physics:ideal-gas-law'],
  body: `
Two radio stations send out a pulse at the same instant. A ship that hears one pulse 100 microseconds before the other knows it is 30 km closer to the first station than to the second — not where it is, but that it lies on one particular curve. That curve, the set of points whose distances from two fixed points differ by a constant, is a **hyperbola**:

$$|PF_1 - PF_2| = 2a$$

### The standard equation
With the foci at $(\\pm c, 0)$,

$$\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1, \\qquad c^2 = a^2 + b^2$$

The curve has two separate **branches**, one wrapped round each focus, with vertices at $(\\pm a, 0)$. Far from the centre each branch straightens out along the **asymptotes**, the lines $y = \\pm\\frac{b}{a}x$, which it approaches but never reaches. The eccentricity $e = c/a$ is always greater than 1: close to 1 the branches bend sharply, and for large $e$ they open out almost flat.

Compare the [[ellipse]]: a plus sign, a *sum* of distances and $c^2 = a^2 - b^2$ there; a minus sign, a *difference* of distances and $c^2 = a^2 + b^2$ here.

### The rectangular hyperbola and inverse proportion
When $a = b$ the asymptotes are perpendicular. Turned through 45°, this **rectangular hyperbola** becomes

$$xy = k$$

— the graph of $y = k/x$, the shape of every inverse proportion ([[rational-functions]]). The pressure and volume of a gas at fixed temperature, $pV = \\text{constant}$ ([[physics:ideal-gas-law|ideal gas law]]), and the frequency and wavelength of a wave at fixed speed both trace hyperbolas.

### Where hyperbolas appear
- **Navigation and location.** A time difference between two signals fixes a difference of distances, so the receiver lies on a hyperbola; a third station gives a second hyperbola, and the two cross at the position. Systems of this kind guided ships and aircraft for decades, and the same principle locates lightning strikes and earthquakes.
- **Orbits.** A body passing the Sun faster than escape speed follows one branch of a hyperbola with the Sun at the focus ([[physics:escape-velocity|escape velocity]]). The interstellar object ʻOumuamua did so in 2017, with $e \\approx 1.2$.
- **Relativity.** The events of spacetime at a fixed interval from the origin lie on hyperbolas $x^2 - c^2t^2 = \\text{constant}$ ([[physics:spacetime-interval|the invariant interval]]), traced by the [[hyperbolic-functions|hyperbolic functions]] cosh and sinh just as a circle is traced by cos and sin.
- **Architecture.** Spin a hyperbola about the axis between its branches and you get a hyperboloid, a curved surface made entirely of straight lines — which is why cooling towers can be built from straight members.
`,
  ideas: [
    'A hyperbola is the set of points whose distances to two foci differ by 2a.',
    'Standard form x²/a² − y²/b² = 1 with c² = a² + b²; eccentricity e = c/a > 1.',
    'Its two branches approach the asymptotes y = ±(b/a)x.',
    'The rectangular hyperbola xy = k is the graph of inverse proportion.'
  ],
  pitfalls: [
    'The branches eventually touch the asymptotes — They get ever closer but never meet them.',
    'c² = a² − b², as for the ellipse — For the hyperbola the foci lie beyond the vertices, so c² = a² + b².',
    'b is where the curve crosses the y-axis — The hyperbola x²/a² − y²/b² = 1 never crosses the y-axis. b only sets the slope of the asymptotes.'
  ],
  formulas: [
    {
      name: 'Eccentricity from a and b',
      expr: 'ecc = sqrt(1 + b^2/a^2)', tex: 'e = \\sqrt{1 + \\frac{b^2}{a^2}}',
      vars: {
        ecc: { name: 'eccentricity', tex: 'e' },
        a: { name: 'distance from the centre to a vertex', value: 3 },
        b: { name: 'the other semi-axis (sets the asymptotes)', value: 4 }
      },
      practice: { unknowns: ['ecc'] }
    },
    {
      name: 'Points on a hyperbola',
      expr: 'x^2/a^2 - y^2/b^2 = 1', tex: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1', solveFor: 'y',
      vars: {
        x: { name: 'x', value: 5, signed: true },
        y: { name: 'y', signed: true },
        a: { name: 'semi-axis a', value: 3 },
        b: { name: 'semi-axis b', value: 4 }
      },
      note: 'Solving for $y$ gives two points, one above and one below the axis; there are none for $|x| < a$.',
      practice: { unknowns: ['y'] }
    }
  ],
  examples: [
    {
      title: 'Reading an equation',
      q: 'Find the vertices, foci, eccentricity and asymptotes of $\\dfrac{x^2}{9} - \\dfrac{y^2}{16} = 1$.',
      steps: [
        '$a = 3$, $b = 4$: vertices $(\\pm 3, 0)$.',
        '$c = \\sqrt{9 + 16} = 5$: foci $(\\pm 5, 0)$, and $e = 5/3$.',
        'Asymptotes $y = \\pm\\tfrac43 x$.'
      ],
      a: 'Vertices (±3, 0), foci (±5, 0), e = 5/3, asymptotes y = ±4x/3'
    },
    {
      title: 'Locating a bang',
      q: 'Two microphones are 1000 m apart. A bang is heard 1.5 s earlier at microphone A than at B (sound travels at 343 m/s). On what curve is the source?',
      steps: [
        'The source is $343 \\times 1.5 = 514.5$ m closer to A: $PF_B - PF_A = 2a = 514.5$ m, so $a = 257$ m.',
        'The foci are 1000 m apart, so $c = 500$ m and $b = \\sqrt{500^2 - 257^2} \\approx 429$ m.',
        'With the microphones on the x-axis and the origin midway, the source is on the branch of $\\dfrac{x^2}{257^2} - \\dfrac{y^2}{429^2} = 1$ nearer A. A third microphone would pin it down.'
      ],
      a: 'On the branch near A of x²/257² − y²/429² = 1 (metres)'
    }
  ],
  quiz: [
    { q: 'The asymptotes of $\\dfrac{x^2}{4} - \\dfrac{y^2}{9} = 1$ are…', choices: ['$y = \\pm\\tfrac23 x$', '$y = \\pm\\tfrac32 x$', '$y = \\pm\\tfrac49 x$', '$y = \\pm\\tfrac94 x$'], a: 1, why: '$y = \\pm\\tfrac{b}{a}x$ with $a = 2$, $b = 3$.' },
    { q: 'The eccentricity of a hyperbola is always…', choices: ['0', 'between 0 and 1', 'exactly 1', 'greater than 1'], a: 3, why: '$e = c/a$ and $c^2 = a^2 + b^2 > a^2$.' },
    { q: 'The graph of $y = 6/x$ is a hyperbola.', a: true, why: 'It is $xy = 6$, a rectangular hyperbola with the coordinate axes as its asymptotes.' },
    { q: 'The foci of $x^2 - y^2 = 8$ are at…', choices: ['$(\\pm 2\\sqrt2, 0)$', '$(\\pm 4, 0)$', '$(\\pm 8, 0)$', '$(0, \\pm 4)$'], a: 1, why: '$a^2 = b^2 = 8$, so $c^2 = 16$ and $c = 4$.' },
    { q: 'A point on a hyperbola is 10 units from one focus and 4 units from the other. What is $2a$?', choices: ['6', '14', '40', '2.5'], a: 0, why: 'The difference of the distances is $2a$: $10 - 4 = 6$.' }
  ],
  applications: [
    'Hyperbolic navigation and locating sources of sound, lightning or earthquakes from arrival times.',
    'Hyperbolic flyby trajectories of spacecraft and interstellar objects.',
    'Inverse-proportion graphs, such as Boyle\'s law, and the geometry of spacetime.'
  ],
  sim: { id: 'gt-conics', params: { e: 1.6 } }
},

{
  id: 'polar-coordinates', parent: 'analytic-geometry', title: 'Polar coordinates', level: 2,
  short: 'Locate a point by its distance r from the origin and its angle θ from the x-axis. Circles, spirals and flower-shaped roses become one-line equations.',
  keywords: ['polar coordinates', 'r theta', 'radius', 'angle', 'conversion', 'atan2', 'rose curve', 'cardioid', 'Archimedean spiral', 'logarithmic spiral', 'limaçon', 'lemniscate', 'radar', 'polar area'],
  prereq: ['coordinate-geometry', 'unit-circle', 'angle-measure'],
  related: ['polar-form', 'complex-plane', 'coordinate-systems-3d', 'conic-sections', 'parametric-curves', 'physics:uniform-circular-motion'],
  body: `
A radar screen does not report a ship's position as "so far east, so far north". It shows how far away the ship is and in which direction: a **distance** $r$ from the centre and an **angle** $\\theta$ from a reference direction. Those two numbers are the **polar coordinates** of a point. The reference direction is usually the positive x-axis, with angles measured anticlockwise, normally in [[angle-measure|radians]].

### Converting
The point at distance $r$ and angle $\\theta$ has Cartesian coordinates given by the [[unit-circle]], scaled by $r$:

$$x = r\\cos\\theta, \\qquad y = r\\sin\\theta$$

and going back,

$$r = \\sqrt{x^2 + y^2}, \\qquad \\tan\\theta = \\frac{y}{x}$$

Careful with the angle: $\\arctan(y/x)$ only returns angles between −90° and 90°, so for points with $x < 0$ you must add 180°. The point $(-3, 3)$ gives $\\arctan(-1) = -45°$, but it actually lies at 135°. Calculators and programming languages offer $\\operatorname{atan2}(y, x)$, which looks at the signs of both coordinates and always gets the quadrant right.

Polar coordinates are not unique: $(r, \\theta)$, $(r, \\theta + 360°)$ and $(-r, \\theta + 180°)$ are all the same point — a negative $r$ means "go backwards along the direction $\\theta$". The origin has $r = 0$ and any angle at all.

### Curves that are simple in polar form
Circles about the origin are $r = a$, and lines through it $\\theta = \\text{constant}$. Many beautiful curves have one-line polar equations:
- $r = 2a\\cos\\theta$: a circle through the origin.
- $r = a\\theta$: the **Archimedean spiral**, whose turns are equally spaced, like the groove of a record or a rolled-up carpet.
- $r = a e^{b\\theta}$: the **logarithmic spiral**, which crosses every radius at the same angle — seen in nautilus shells and the arms of spiral galaxies.
- $r = a\\cos k\\theta$: a **rose**, with $k$ petals when $k$ is odd and $2k$ petals when $k$ is even.
- $r = a(1 + \\cos\\theta)$: the heart-shaped **cardioid**, the pick-up pattern of a "cardioid" microphone that hears the front and ignores the back.
- $r = \\ell/(1 + e\\cos\\theta)$: every [[conic-sections|conic section]] with a focus at the origin.

### Area in polar form
A thin wedge of angle $d\\theta$ is nearly a sector of radius $r$, with area $\\tfrac12 r^2\\,d\\theta$, so the area swept out between two angles is $\\int \\tfrac12 r^2\\,d\\theta$. For the cardioid $r = 1 + \\cos\\theta$ this gives $3\\pi/2$. Kepler's second law — a planet sweeps out equal areas in equal times — is a statement about exactly this integral ([[physics:keplers-laws|Kepler's laws]]).

### Why physicists like them
Whenever a problem has a centre — a planet's gravity, the field of a charge, a wheel, a whirlpool — polar coordinates replace a tangle of $x$ and $y$ with a dependence on $r$ alone. Circular motion is simply $r$ constant with $\\theta$ increasing steadily ([[physics:uniform-circular-motion|uniform circular motion]]). In three dimensions polar coordinates grow into cylindrical and spherical ones ([[coordinate-systems-3d]]), and in the complex plane into the [[polar-form|polar form]] of a complex number.
`,
  ideas: [
    'A point is (r, θ): its distance from the origin and its angle from the positive x-axis.',
    'x = r cos θ, y = r sin θ; r = √(x² + y²), and θ = atan2(y, x) with the quadrant taken into account.',
    'The same point has many polar descriptions; negative r points the opposite way.',
    'Curves with a centre — circles, spirals, roses, orbits — have simple polar equations; area is ∫½r² dθ.'
  ],
  pitfalls: [
    'θ = arctan(y/x) always — arctan only covers −90° to 90°. For x < 0 add 180°, or use atan2(y, x).',
    'Each point has one pair of polar coordinates — Adding 360° to θ, or reversing r and adding 180°, describes the same point.',
    'r = cos 2θ has two petals — k = 2 is even, so the rose has 2k = 4 petals.'
  ],
  formulas: [
    {
      name: 'Polar to Cartesian: x',
      expr: 'x = r*cos(theta)', tex: 'x = r\\cos\\theta',
      vars: {
        x: { name: 'x coordinate', signed: true },
        r: { name: 'distance from the origin', value: 2 },
        theta: { name: 'angle from the x-axis', q: 'angle', unit: '°', value: 210, min: 0, max: 360 }
      }
    },
    {
      name: 'Polar to Cartesian: y',
      expr: 'y = r*sin(theta)', tex: 'y = r\\sin\\theta',
      vars: {
        y: { name: 'y coordinate', signed: true },
        r: { name: 'distance from the origin', value: 2 },
        theta: { name: 'angle from the x-axis', q: 'angle', unit: '°', value: 210, min: 0, max: 360 }
      }
    },
    {
      name: 'Cartesian to polar: distance',
      expr: 'r = sqrt(x^2 + y^2)', tex: 'r = \\sqrt{x^2 + y^2}',
      vars: {
        r: { name: 'distance from the origin' },
        x: { name: 'x coordinate', value: -3, signed: true },
        y: { name: 'y coordinate', value: 3, signed: true }
      },
      practice: { unknowns: ['r'] }
    },
    {
      name: 'Cartesian to polar: angle',
      expr: 'theta = atan2(y, x)', tex: '\\theta = \\operatorname{atan2}(y, x)',
      vars: {
        theta: { name: 'angle from the x-axis', q: 'angle', unit: '°', min: -180, max: 180, signed: true },
        y: { name: 'y coordinate', value: 3, signed: true },
        x: { name: 'x coordinate', value: -3, signed: true }
      },
      note: 'atan2 gives the angle in the correct quadrant, between −180° and 180°.',
      practice: { unknowns: ['theta'] }
    }
  ],
  examples: [
    {
      title: 'Into polar form',
      q: 'Write the point $(-3, 3)$ in polar coordinates.',
      steps: [
        '$r = \\sqrt{(-3)^2 + 3^2} = \\sqrt{18} = 3\\sqrt2 \\approx 4.24$.',
        '$\\arctan(3/(-3)) = \\arctan(-1) = -45°$, but the point is in the second quadrant ($x < 0$, $y > 0$), so add 180°: $\\theta = 135°$.'
      ],
      a: '(4.24, 135°)'
    },
    {
      title: 'Out of polar form',
      q: 'Convert $(r, \\theta) = (2, 210°)$ to Cartesian coordinates.',
      steps: [
        '$x = 2\\cos 210° = 2 \\times (-\\tfrac{\\sqrt3}{2}) = -\\sqrt3 \\approx -1.73$.',
        '$y = 2\\sin 210° = 2 \\times (-\\tfrac12) = -1$.'
      ],
      a: '(−1.73, −1)'
    },
    {
      title: 'A circle in disguise',
      q: 'What curve is $r = 2\\cos\\theta$?',
      steps: [
        'Multiply by $r$: $r^2 = 2r\\cos\\theta$, and substitute $r^2 = x^2 + y^2$, $r\\cos\\theta = x$: $\\;x^2 + y^2 = 2x$.',
        'Complete the square: $(x - 1)^2 + y^2 = 1$.'
      ],
      a: 'A circle of radius 1 centred at (1, 0), passing through the origin'
    }
  ],
  quiz: [
    { q: 'In polar coordinates, the point $(0, -2)$ is…', choices: ['$(2, 90°)$', '$(2, 270°)$', '$(-2, 270°)$', '$(2, 180°)$'], a: 1, why: 'Distance 2, straight down: 270° (equally, −90°). $(-2, 270°)$ would be the point $(0, 2)$.' },
    { q: 'How many petals has the rose $r = 4\\sin 5\\theta$?', choices: ['4', '5', '10', '20'], a: 1, why: 'For odd $k$ the rose has $k$ petals; the curve retraces itself after 180°.' },
    { q: 'The polar equation $r = 3$ describes…', choices: ['the line x = 3', 'a circle of radius 3 about the origin', 'a spiral', 'the point (3, 0)'], a: 1, why: 'Every point at distance 3 from the origin, whatever its angle.' },
    { q: 'Every point has exactly one pair of polar coordinates.', a: false, why: '$(r, \\theta)$, $(r, \\theta + 360°)$ and $(-r, \\theta + 180°)$ are the same point, and the origin has any angle.' },
    { q: 'The curve $r = 2\\cos\\theta$ is a circle. Where is its centre?', choices: ['(0, 0)', '(1, 0)', '(2, 0)', '(0, 1)'], a: 1, why: 'Converted, it is $(x - 1)^2 + y^2 = 1$: centre (1, 0), radius 1.' }
  ],
  applications: [
    'Radar and sonar displays, and navigation by range and bearing.',
    'Orbits and central forces in physics.',
    'Antenna and microphone radiation patterns, which are plotted as r(θ).'
  ],
  sim: 'gt-polar'
},

{
  id: 'coordinate-systems-3d', parent: 'analytic-geometry', title: 'Cylindrical and spherical coordinates', level: 3,
  short: 'In three dimensions a point can be given as (x, y, z), as a cylinder\'s (ρ, φ, z) or as a globe\'s (r, θ, φ). Choose the system that matches the symmetry of the problem.',
  keywords: ['cylindrical coordinates', 'spherical coordinates', '3D coordinates', 'azimuth', 'polar angle', 'latitude', 'longitude', 'right-hand rule', 'great circle', 'volume element', 'Jacobian'],
  prereq: ['polar-coordinates', 'coordinate-geometry', 'right-triangle-trig'],
  related: ['multiple-integrals', 'vectors', 'law-of-cosines', 'physics:gauss-law', 'physics:field-of-wire', 'physics:hydrogen-atom-quantum'],
  body: `
A point in space needs three numbers. The obvious choice is three perpendicular axes, $(x, y, z)$, arranged by the **right-hand rule**: curl the fingers of your right hand from the x-axis towards the y-axis and your thumb points along z. But just as [[polar-coordinates|polar coordinates]] suit problems with a centre in the plane, two other systems suit problems in space with an axis or a centre.

### Cylindrical coordinates (ρ, φ, z)
Use polar coordinates in the horizontal plane and keep the height:

$$x = \\rho\\cos\\varphi, \\qquad y = \\rho\\sin\\varphi, \\qquad z = z$$

Here $\\rho = \\sqrt{x^2 + y^2}$ is the distance from the z-axis (many books write $r$) and $\\varphi$ the angle round it. Holding $\\rho$ fixed gives a cylinder, $\\varphi$ a half-plane, $z$ a horizontal plane. This is the natural system for anything with an axis: a wire, a pipe, a coil, a spinning shaft. The magnetic field of a long straight wire depends on $\\rho$ alone ([[physics:field-of-wire|field of a wire]]), and a charged particle spiralling along a magnetic field traces a helix — $\\rho$ constant, with $\\varphi$ and $z$ growing steadily ([[physics:charged-particle-motion|charged particles in a field]]).

### Spherical coordinates (r, θ, φ)
Give the distance $r$ from the origin, the **polar angle** $\\theta$ measured down from the positive z-axis (0 to 180°), and the **azimuth** $\\varphi$ measured round from the x-axis (0 to 360°):

$$x = r\\sin\\theta\\cos\\varphi, \\qquad y = r\\sin\\theta\\sin\\varphi, \\qquad z = r\\cos\\theta$$

The factor $r\\sin\\theta$ is the distance from the z-axis, which is then split into $x$ and $y$ exactly as in the plane. Surfaces of constant $r$ are spheres, of constant $\\theta$ cones, of constant $\\varphi$ half-planes.

This is the geography of the globe: longitude is $\\varphi$, and latitude, measured up from the equator, is $90° - \\theta$. It is also the natural system for anything with a centre — the gravity of a planet, the field of a point charge ([[physics:gauss-law|Gauss's law]]), the shapes of atomic orbitals ([[physics:hydrogen-atom-quantum|the hydrogen atom]]).

> [!warn] Physicists (and the ISO standard) use $\\theta$ for the polar angle and $\\varphi$ for the azimuth; many mathematics books swap the two letters. Check the convention before using anyone's formulas.

### Distances on a sphere
Two places at latitudes $\\phi_1$ and $\\phi_2$ with a difference of longitude $\\Delta\\lambda$ are separated, along the shortest route over the surface (a **great circle**), by an angle $\\sigma$ at the Earth's centre, where

$$\\cos\\sigma = \\sin\\phi_1\\sin\\phi_2 + \\cos\\phi_1\\cos\\phi_2\\cos\\Delta\\lambda$$

— the [[law-of-cosines|law of cosines]] for a triangle drawn on a sphere. The distance is $R\\sigma$ with $\\sigma$ in radians. London to New York comes out at about 5570 km.

### Volume elements
In integrals, a small box in cylindrical coordinates has sides $d\\rho$, $\\rho\\,d\\varphi$ and $dz$, so $dV = \\rho\\,d\\rho\\,d\\varphi\\,dz$. In spherical coordinates the sides are $dr$, $r\\,d\\theta$ and $r\\sin\\theta\\,d\\varphi$, so

$$dV = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$$

Integrating this over a ball of radius $R$ gives $\\tfrac43\\pi R^3$ in three short steps ([[multiple-integrals]]).
`,
  ideas: [
    'Cylindrical coordinates are polar coordinates in the xy-plane plus the height z.',
    'Spherical coordinates give the distance r, the polar angle θ from the z-axis and the azimuth φ.',
    'x = r sin θ cos φ, y = r sin θ sin φ, z = r cos θ; latitude is 90° − θ.',
    'Volume elements: ρ dρ dφ dz (cylindrical) and r² sin θ dr dθ dφ (spherical).'
  ],
  pitfalls: [
    'θ and φ mean the same in every book — Physics uses θ for the polar angle and φ for the azimuth; many maths texts swap them.',
    'The polar angle is the latitude — Latitude is measured from the equator; θ is measured from the north pole, so θ = 90° − latitude.',
    'dV = dr dθ dφ in spherical coordinates — The box has sides dr, r dθ and r sin θ dφ, so the volume element carries the factor r² sin θ.'
  ],
  formulas: [
    {
      name: 'Spherical to Cartesian: x',
      expr: 'x = r*sin(theta)*cos(phi)', tex: 'x = r\\sin\\theta\\cos\\varphi',
      vars: {
        x: { name: 'x coordinate', signed: true },
        r: { name: 'distance from the origin', value: 2 },
        theta: { name: 'polar angle from the z-axis', q: 'angle', unit: '°', value: 60, min: 0, max: 180 },
        phi: { name: 'azimuth from the x-axis', q: 'angle', unit: '°', value: 45, min: 0, max: 360, tex: '\\varphi' }
      },
      practice: { unknowns: ['x'] }
    },
    {
      name: 'Spherical to Cartesian: z',
      expr: 'z = r*cos(theta)', tex: 'z = r\\cos\\theta',
      vars: {
        z: { name: 'height z', signed: true },
        r: { name: 'distance from the origin', value: 2 },
        theta: { name: 'polar angle from the z-axis', q: 'angle', unit: '°', value: 60, min: 0, max: 180 }
      }
    },
    {
      name: 'Great-circle distance',
      expr: 'd = R*acos(sin(p1)*sin(p2) + cos(p1)*cos(p2)*cos(dl))',
      tex: 'd = R\\arccos\\left(\\sin\\phi_1\\sin\\phi_2 + \\cos\\phi_1\\cos\\phi_2\\cos\\Delta\\lambda\\right)',
      vars: {
        d: { name: 'distance along the surface', q: 'length', unit: 'km' },
        R: { name: 'radius of the sphere', q: 'length', unit: 'km', value: 6371 },
        p1: { name: 'latitude of the first place', q: 'angle', unit: '°', value: 51.51, min: -90, max: 90, signed: true, tex: '\\phi_1' },
        p2: { name: 'latitude of the second place', q: 'angle', unit: '°', value: 40.71, min: -90, max: 90, signed: true, tex: '\\phi_2' },
        dl: { name: 'difference in longitude', q: 'angle', unit: '°', value: 73.88, min: 0, max: 180, tex: '\\Delta\\lambda' }
      },
      note: 'The starting values are London and New York. Latitudes south of the equator are negative.',
      practice: { unknowns: ['d'] },
      stories: { d: 'Two airports are at latitudes {p1} and {p2}, and their longitudes differ by {dl}. How long is the shortest flight path between them (Earth radius {R})?' }
    }
  ],
  examples: [
    {
      title: 'From spherical to Cartesian',
      q: 'Find the Cartesian coordinates of the point with $r = 2$, $\\theta = 60°$, $\\varphi = 45°$.',
      steps: [
        'Distance from the z-axis: $r\\sin\\theta = 2 \\times 0.866 = 1.732$.',
        '$x = 1.732\\cos 45° = 1.225$ and $y = 1.732\\sin 45° = 1.225$.',
        '$z = r\\cos\\theta = 2 \\times 0.5 = 1$.'
      ],
      a: '(1.22, 1.22, 1.00)'
    },
    {
      title: 'London to New York',
      q: 'London is at 51.51° N, 0.13° W and New York at 40.71° N, 74.01° W. How far apart are they along a great circle ($R = 6371$ km)?',
      steps: [
        '$\\Delta\\lambda = 74.01° - 0.13° = 73.88°$.',
        '$\\cos\\sigma = \\sin 51.51°\\sin 40.71° + \\cos 51.51°\\cos 40.71°\\cos 73.88° = 0.5105 + 0.1310 = 0.6415$.',
        '$\\sigma = \\arccos 0.6415 = 0.8743$ rad, so $d = 6371 \\times 0.8743 \\approx 5570$ km.'
      ],
      a: 'About 5570 km'
    },
    {
      title: 'Into cylindrical coordinates',
      q: 'Write the point $(3, 4, 5)$ in cylindrical coordinates.',
      steps: ['$\\rho = \\sqrt{3^2 + 4^2} = 5$.', '$\\varphi = \\operatorname{atan2}(4, 3) = 53.13°$.', '$z = 5$ is unchanged.'],
      a: '(ρ, φ, z) = (5, 53.13°, 5)'
    }
  ],
  quiz: [
    { q: 'In spherical coordinates, the surface $\\theta = 30°$ is…', choices: ['a sphere', 'a cone', 'a plane', 'a cylinder'], a: 1, why: 'Every point on a line making 30° with the z-axis, in every direction round it: a cone with its tip at the origin.' },
    { q: 'In cylindrical coordinates, $\\rho = 2$ describes…', choices: ['a sphere of radius 2', 'a cylinder of radius 2 about the z-axis', 'a circle in the xy-plane only', 'a cone'], a: 1, why: 'Every point 2 from the z-axis, at every angle and every height.' },
    { q: 'A town at latitude 30° N has polar angle…', choices: ['30°', '60°', '90°', '120°'], a: 1, why: '$\\theta$ is measured from the north pole: $90° - 30° = 60°$.' },
    { q: 'The volume element in spherical coordinates is…', choices: ['$dr\\,d\\theta\\,d\\varphi$', '$r\\,dr\\,d\\theta\\,d\\varphi$', '$r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$', '$r^2\\cos\\theta\\,dr\\,d\\theta\\,d\\varphi$'], a: 2,
      why: 'The small box has sides $dr$, $r\\,d\\theta$ and $r\\sin\\theta\\,d\\varphi$.' },
    { q: 'With $\\theta$ measured from the z-axis, the height of a point is $z = r\\cos\\theta$.', a: true, why: 'At the north pole ($\\theta = 0$) $z = r$, on the equator ($\\theta = 90°$) $z = 0$.' }
  ],
  applications: [
    'Navigation and aviation: great-circle routes and GPS positions.',
    'Fields with symmetry: wires and coaxial cables (cylindrical), charges, planets and stars (spherical).',
    'Atomic physics and chemistry, where orbitals are described in spherical coordinates.'
  ]
},

{
  id: 'parametric-curves', parent: 'analytic-geometry', title: 'Parametric curves', level: 2,
  short: 'Describe a curve by where a moving point is at each moment: x = f(t), y = g(t). The parameter carries the timing as well as the shape.',
  keywords: ['parametric equations', 'parameter', 'trajectory', 'eliminating the parameter', 'cycloid', 'Lissajous figure', 'helix', 'Bézier curve', 'tangent', 'velocity vector', 'epicycloid', 'spirograph'],
  prereq: ['functions', 'coordinate-geometry', 'unit-circle'],
  related: ['polar-coordinates', 'arc-length', 'chain-rule', 'vectors', 'physics:projectile-motion', 'physics:simple-harmonic-motion'],
  body: `
Describe the flight of a bee by giving its position at every moment: $x = f(t)$, $y = g(t)$. As $t$ runs on, the point $(x(t), y(t))$ moves and traces a curve. That is a **parametric curve**, and $t$ is the **parameter** — often time, sometimes an angle, sometimes just a label that runs along the curve.

### Why use a parameter?
- **Curves that are not graphs.** A circle, a figure of eight or a looping spiral cannot be written as $y = f(x)$, because some values of $x$ have several $y$ values. Parametrically they are easy: the unit circle is $x = \\cos t$, $y = \\sin t$, for $0 \\le t < 2\\pi$.
- **Timing as well as shape.** The parameter records *when* the point is where. $(\\cos t, \\sin t)$ and $(\\cos 3t, \\sin 3t)$ trace the same circle, but the second goes round three times as fast; $(\\cos t, -\\sin t)$ goes round the other way.
- **Motion splits into components.** A projectile is $x = v_0\\cos\\alpha\\,t$, $y = v_0\\sin\\alpha\\,t - \\tfrac12 g t^2$: two simple motions that together make a parabola ([[physics:projectile-motion|projectile motion]]).

### Eliminating the parameter
To recover an ordinary equation, remove $t$. From $x = a\\cos t$, $y = b\\sin t$: $\\cos t = x/a$ and $\\sin t = y/b$, and since $\\cos^2 t + \\sin^2 t = 1$,

$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$$

— an [[ellipse]]. A straight line through $(x_0, y_0)$ in the direction $(u, v)$ is $x = x_0 + ut$, $y = y_0 + vt$, the form that carries over most easily to three dimensions ([[vectors]]).

### Velocity, slope and length
The velocity of the moving point is $\\left(\\dfrac{dx}{dt}, \\dfrac{dy}{dt}\\right)$, and it points along the tangent. The slope of the curve follows from the [[chain-rule|chain rule]],

$$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt},$$

and adding up the small pieces $\\sqrt{\\dot x^2 + \\dot y^2}\\,dt$ gives the [[arc-length|arc length]]. Where both derivatives vanish at once the point stops, and the curve may have a sharp cusp there.

### A gallery
- **Cycloid:** a point on the rim of a rolling wheel of radius $r$, $x = r(t - \\sin t)$, $y = r(1 - \\cos t)$. It moves in arches and comes to a dead stop each time it touches the ground. Turned upside down it is the curve of fastest descent, and the curve along which a pendulum keeps the same period however wide it swings — Huygens built clocks on this idea.
- **Lissajous figures:** $x = \\sin(at + \\delta)$, $y = \\sin bt$, two [[physics:simple-harmonic-motion|oscillations]] at right angles. On an oscilloscope the shape reveals the ratio of two frequencies: a line or ellipse for 1 : 1, a figure of eight for 1 : 2. The curve closes only when $a/b$ is a fraction.
- **Epicycloids and hypocycloids:** a point on a circle rolling round the outside or inside of another — the patterns of a Spirograph, and the curves ancient astronomers used, as epicycles, to model the planets.
- **Helix:** $x = \\cos t$, $y = \\sin t$, $z = ct$ — a spring, a screw thread, a strand of DNA.
- **Bézier curves:** polynomials in $t$ that shape the letters of every font on this screen.
`,
  ideas: [
    'A parametric curve gives both coordinates as functions of a parameter: (x(t), y(t)).',
    'The same shape can be traced at different speeds or directions; the parameter carries the timing.',
    'Eliminating t gives the ordinary equation; e.g. (a cos t, b sin t) is an ellipse.',
    'Velocity (ẋ, ẏ) is tangent to the curve, dy/dx = ẏ/ẋ, and arc length is ∫√(ẋ² + ẏ²) dt.'
  ],
  pitfalls: [
    'The parameter is always time — It can be any quantity that runs along the curve: an angle, a distance, or a pure number.',
    'dy/dx = (dy/dt)·(dx/dt) — It is the quotient (dy/dt)/(dx/dt), by the chain rule.',
    'Eliminating t loses nothing — The equation keeps the shape but forgets the direction, the speed, and sometimes the range of the curve (x = cos t, y = cos² t gives only the part of y = x² with |x| ≤ 1).'
  ],
  formulas: [
    {
      name: 'Cycloid: horizontal position',
      expr: 'x = r*(t - sin(t))', tex: 'x = r(t - \\sin t)',
      vars: {
        x: { name: 'distance along the ground', q: 'length', unit: 'm' },
        r: { name: 'radius of the wheel', q: 'length', unit: 'm', value: 0.35 },
        t: { name: 'angle the wheel has turned', q: 'angle', unit: 'rad', value: 2 }
      },
      stories: { x: 'A bicycle wheel of radius {r} has turned through {t}. How far along has the point that started at the bottom of the rim moved?' }
    },
    {
      name: 'Cycloid: height',
      expr: 'y = r*(1 - cos(t))', tex: 'y = r(1 - \\cos t)',
      vars: {
        y: { name: 'height above the ground', q: 'length', unit: 'm' },
        r: { name: 'radius of the wheel', q: 'length', unit: 'm', value: 0.35 },
        t: { name: 'angle the wheel has turned', q: 'angle', unit: 'rad', value: 2, min: 0, max: 3.14159 }
      },
      note: 'Between $t = 0$ and $t = \\pi$ the point rises from the ground to the top of the wheel.',
      stories: { y: 'A pebble stuck to a tyre of radius {r} starts at the bottom. How high is it after the wheel turns through {t}?' }
    }
  ],
  examples: [
    {
      title: 'Eliminating the parameter',
      q: 'What curve is traced by $x = 3\\cos t$, $y = 2\\sin t$?',
      steps: [
        '$\\cos t = x/3$ and $\\sin t = y/2$.',
        '$\\cos^2 t + \\sin^2 t = 1$ gives $\\dfrac{x^2}{9} + \\dfrac{y^2}{4} = 1$.'
      ],
      a: 'An ellipse with semi-axes 3 and 2, traced anticlockwise once as t goes from 0 to 2π'
    },
    {
      title: 'A cusp',
      q: 'For $x = t^2$, $y = t^3$, find the slope $dy/dx$ and describe the curve near $t = 0$.',
      steps: [
        '$\\dot x = 2t$, $\\dot y = 3t^2$, so $\\dfrac{dy}{dx} = \\dfrac{3t^2}{2t} = \\dfrac{3t}{2}$ (for $t \\ne 0$).',
        'At $t = 0$ both derivatives vanish: the point stops. Eliminating $t$ gives $y^2 = x^3$.',
        'For $t < 0$ the curve comes in below the axis, for $t > 0$ it leaves above, both tangent to the x-axis: a sharp cusp at the origin.'
      ],
      a: 'dy/dx = 3t/2; a cusp at the origin (the curve y² = x³)'
    },
    {
      title: 'The valve on a bicycle wheel',
      q: 'A valve sits on the rim of a wheel of radius 0.35 m, starting at the bottom. Where is it after half a turn?',
      steps: [
        'Half a turn is $t = \\pi$.',
        '$x = 0.35(\\pi - \\sin\\pi) = 0.35\\pi = 1.10$ m, $y = 0.35(1 - \\cos\\pi) = 0.70$ m.',
        'The valve is at the top of the wheel, which has rolled forward 1.10 m.'
      ],
      a: '1.10 m along, 0.70 m up'
    }
  ],
  quiz: [
    { q: 'As $t$ goes from 0 to $2\\pi$, the point $(\\cos t, \\sin t)$…', choices: ['goes once clockwise round the unit circle', 'goes once anticlockwise round the unit circle, starting at (1, 0)', 'goes twice round', 'moves along a line'], a: 1,
      why: 'At $t = 0$ it is at (1, 0); at $t = \\pi/2$ at (0, 1): anticlockwise, once.' },
    { q: 'Eliminate the parameter from $x = 2t$, $y = 4t^2$.', choices: ['$y = 2x^2$', '$y = x^2$', '$y = 4x^2$', '$y = x^2/4$'], a: 1, why: '$t = x/2$, so $y = 4(x/2)^2 = x^2$.' },
    { q: 'A Lissajous figure with frequency ratio 1 : 2 looks like…', choices: ['a circle', 'a straight line', 'a figure of eight (or a parabola-like arch)', 'a spiral'], a: 2,
      why: 'One coordinate oscillates twice while the other oscillates once; with suitable phase the curve crosses itself once, making a figure of eight.' },
    { q: 'A parametric curve can pass through the same point twice.', a: true, why: 'Different values of $t$ can give the same point — a figure of eight crosses itself.' },
    { q: 'For $x = t^2$, $y = t^3$, write the slope $dy/dx$ in terms of $t$.', answer: '3t/2', vars: ['t'], why: '$\\dfrac{dy/dt}{dx/dt} = \\dfrac{3t^2}{2t} = \\dfrac{3t}{2}$.' }
  ],
  applications: [
    'Trajectories of projectiles, planets and robots.',
    'Computer graphics and fonts, built from Bézier curves.',
    'Gears (cycloidal and involute teeth), cams and linkages.',
    'Oscilloscope Lissajous patterns for comparing frequencies and phases.'
  ],
  sim: 'gt-parametric'
}

);
