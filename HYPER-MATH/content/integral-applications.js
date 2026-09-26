/* HYPER-MATH · content/integral-applications.js — what integrals measure:
 * areas between curves, volumes of revolution, lengths of curves, averages. */
Hyper.add(

{
  id: 'area-between-curves', parent: 'integral-applications', title: 'Area between curves', level: 2,
  short: 'The area of the region between two graphs is the integral of the top curve minus the bottom one, taken between the points where they meet.',
  keywords: ['area between curves', 'enclosed area', 'region between graphs', 'intersection points', 'top minus bottom', 'integrate with respect to y', 'Archimedes parabola'],
  prereq: ['definite-integral', 'fundamental-theorem', 'quadratic-equations'],
  related: ['volumes-of-revolution', 'average-value', 'multiple-integrals', 'physics:heat-engines', 'physics:thermodynamic-processes', 'physics:center-of-mass'],
  body: `
Slice the region between two curves into thin vertical strips. Each strip has height (top curve) − (bottom curve) and width $dx$. Adding them up:

$$A = \\int_a^b \\big[\\,f(x) - g(x)\\,\\big]\\,dx, \\qquad f(x) \\ge g(x) \\text{ on } [a, b].$$

It does not matter where the $x$-axis is: subtracting the bottom from the top gives the strip's true height even when both curves are below the axis.

### The steps
1. **Sketch** the curves to see which is on top.
2. **Find the intersections** by solving $f(x) = g(x)$. They are usually the limits of integration.
3. **Integrate top minus bottom.** If the curves cross in between, split the interval at the crossing and swap roles, or integrate $|f - g|$.

### Example: a line and a parabola
Where do $y = 2x$ and $y = x^2 - 3$ meet? $x^2 - 3 = 2x$ gives $x^2 - 2x - 3 = (x - 3)(x + 1) = 0$, so $x = -1$ and $x = 3$. The line is on top in between (check $x = 0$: $0 > -3$). Then
$$A = \\int_{-1}^{3}\\big(2x - x^2 + 3\\big)\\,dx = \\left[x^2 - \\frac{x^3}{3} + 3x\\right]_{-1}^{3} = 9 - \\left(-\\frac53\\right) = \\frac{32}{3}.$$

Archimedes found this kind of area around 250 BC, long before calculus: a parabolic segment has $\\tfrac43$ the area of the triangle inscribed in it. In modern terms, if top minus bottom is a quadratic with leading coefficient $-a$ and roots $x_1 < x_2$, the area is $\\dfrac{a\\,(x_2 - x_1)^3}{6}$.

### Slicing the other way
Some regions are easier in horizontal strips. Between $x = y^2$ and $x = y + 2$ the right-hand curve is the line, and they meet where $y^2 = y + 2$, at $y = -1$ and $y = 2$:
$$A = \\int_{-1}^{2}\\big[(y + 2) - y^2\\big]\\,dy = \\frac92.$$
In vertical strips the same region needs two integrals, because its lower boundary changes formula at $x = 1$.

### In physics and beyond
- **Engine cycles.** On a pressure–volume diagram, the work done by a gas in a process is the area under its path, $\\int P\\,dV$ ([[physics:thermodynamic-processes|thermodynamic processes]]). Over a closed cycle, the **area enclosed** between the expansion curve and the compression curve is the net work per cycle of a [[physics:heat-engines|heat engine]].
- **Hysteresis.** The area of a magnet's hysteresis loop is the energy lost as heat per cycle, which is why transformer cores use materials with thin loops.
- **Economics and statistics.** Consumer surplus is the area between a demand curve and the price line; the Gini index of inequality is an area between the Lorenz curve and the line of perfect equality.
`,
  ideas: [
    'Area between curves = ∫ (top − bottom) dx between the intersection points.',
    'The position of the x-axis does not matter; only the difference of the curves does.',
    'If the curves cross, split the interval so that each piece is top minus bottom.',
    'Sometimes horizontal strips (integrating in y) need fewer pieces.',
    'The area enclosed by a cycle on a PV diagram is the net work done.'
  ],
  pitfalls: [
    '∫(f − g) dx is the area even when the curves cross — Where g is on top the integrand is negative and the pieces cancel. Split at the crossings.',
    'The limits are where the curves meet the x-axis — They are where the curves meet each other.',
    'Area below the axis must come out negative — For the area between two curves only top minus bottom matters; the result is positive.'
  ],
  formulas: [
    {
      name: 'Area between a parabola and a line (Archimedes)',
      expr: 'A = a*(x2 - x1)^3/6', tex: 'A = \\frac{a\\,(x_2 - x_1)^3}{6}',
      vars: {
        A: { name: 'enclosed area' },
        a: { name: 'size of the x² coefficient of top minus bottom', value: 1 },
        x2: { name: 'right intersection', value: 3, signed: true },
        x1: { name: 'left intersection', value: -1, signed: true }
      },
      note: 'Works whenever top minus bottom is a quadratic $-a(x - x_1)(x - x_2)$: a parabola and a line, or two parabolas.',
      stories: { A: 'A parabola and a line meet at $x$ = {x1} and $x$ = {x2}; their difference has $x^2$-coefficient of size {a}. What area do they enclose?' }
    }
  ],
  examples: [
    {
      title: 'A lens-shaped region',
      q: 'Find the area between $y = x$ and $y = x^2$.',
      steps: [
        'They meet where $x^2 = x$: at $x = 0$ and $x = 1$. In between, $x > x^2$ (try $x = 0.5$).',
        '$A = \\int_0^1 (x - x^2)\\,dx = \\tfrac12 - \\tfrac13 = \\tfrac16$.',
        'Check with Archimedes: $a = 1$, width 1, so $1^3/6 = 1/6$.'
      ],
      a: '1/6'
    },
    {
      title: 'A line and a parabola',
      q: 'Find the area enclosed by $y = 2x$ and $y = x^2 - 3$.',
      steps: [
        'Intersections: $x^2 - 2x - 3 = 0$, so $x = -1$ and $x = 3$; the line is on top.',
        '$A = \\int_{-1}^3 (2x - x^2 + 3)\\,dx = [x^2 - x^3/3 + 3x]_{-1}^3 = 9 - (-5/3) = 32/3$.',
        'Archimedes: $a = 1$, $(3 - (-1))^3/6 = 64/6 = 32/3$. ✓'
      ],
      a: '32/3 ≈ 10.67'
    },
    {
      title: 'Horizontal strips',
      q: 'Find the area between $x = y^2$ and $x = y + 2$.',
      steps: [
        'They meet where $y^2 = y + 2$: $y = -1$ and $y = 2$. The line is to the right.',
        '$A = \\int_{-1}^{2}(y + 2 - y^2)\\,dy = \\left[\\tfrac{y^2}{2} + 2y - \\tfrac{y^3}{3}\\right]_{-1}^{2} = \\tfrac{10}{3} - \\left(-\\tfrac76\\right) = \\tfrac92$.'
      ],
      a: '9/2'
    }
  ],
  quiz: [
    { q: 'What is the area between $y = \\sin x$ and $y = \\cos x$ for $0 \\le x \\le \\pi/2$?', choices: ['0', '$2(\\sqrt2 - 1) \\approx 0.83$', '1', '$\\sqrt 2$'], a: 1,
      why: 'They cross at $\\pi/4$. Each half contributes $\\sqrt2 - 1$. Integrating $\\cos x - \\sin x$ over the whole range without splitting gives the wrong answer 0.' },
    { q: 'For any two curves, $\\int_a^b (f - g)\\,dx$ is the area between them on $[a, b]$.', a: false,
      why: 'Only if $f \\ge g$ throughout. Where they cross, parts cancel; split the interval or integrate $|f - g|$.' },
    { q: 'Which integral gives the area between $y = x^2$ and $y = 4$?', choices: ['$\\int_0^4 (4 - x^2)\\,dx$', '$\\int_{-2}^{2}(x^2 - 4)\\,dx$', '$\\int_{-2}^{2}(4 - x^2)\\,dx$', '$\\int_{-2}^{2}x^2\\,dx$'], a: 2,
      why: 'They meet at $x = \\pm2$ and the line $y = 4$ is on top. The value is $32/3$.' },
    { q: 'Find the area between $y = x^2$ and $y = x$ for $0 \\le x \\le 1$ (type the number).', answer: '1/6', vars: [],
      why: '$\\int_0^1 (x - x^2)\\,dx = \\tfrac12 - \\tfrac13$.' },
    { q: 'On a pressure–volume diagram, the area enclosed by a heat engine\'s cycle equals…', choices: ['the heat taken in', 'the net work done per cycle', 'the change in internal energy', 'the efficiency'], a: 1,
      why: 'Work is $\\int P\\,dV$: the expansion adds the area under the upper path, the compression subtracts the area under the lower one, leaving the enclosed area.' }
  ],
  applications: [
    'Net work of engine and refrigerator cycles from PV diagrams.',
    'Energy loss in magnetic hysteresis loops.',
    'Cross-sectional areas of beams, channels and airfoils between two profile curves.'
  ]
},

{
  id: 'volumes-of-revolution', parent: 'integral-applications', title: 'Volumes of revolution', level: 2,
  short: 'Spinning a curve about an axis sweeps out a solid; its volume is the integral of disc (or washer, or shell) volumes: V = ∫ π r² dx.',
  keywords: ['volume of revolution', 'solid of revolution', 'disc method', 'washer method', 'shell method', 'cylindrical shells', 'Pappus', 'Cavalieri', 'cross-section'],
  prereq: ['definite-integral', 'volume', 'circles'],
  related: ['area-between-curves', 'arc-length', 'multiple-integrals', 'improper-integrals', 'surface-area', 'physics:moment-of-inertia'],
  body: `
Turn a curve on a lathe and it becomes a solid: a vase, a bowl, a bullet, a nose cone. To find its volume, slice it perpendicular to the axis. Each slice is a thin **disc** of radius $r = f(x)$ and thickness $dx$, with volume $\\pi r^2\\,dx$. Adding the discs:

$$V = \\int_a^b \\pi\\,[f(x)]^2\\,dx.$$

### Checking familiar formulas
- **Cone.** The line $y = \\dfrac{R}{h}x$ from 0 to $h$, spun about the $x$-axis: $V = \\pi\\dfrac{R^2}{h^2}\\int_0^h x^2\\,dx = \\tfrac13\\pi R^2 h$. The mysterious third in the cone formula is the $\\int x^2 = x^3/3$.
- **Sphere.** The semicircle $y = \\sqrt{R^2 - x^2}$: $V = \\pi\\int_{-R}^{R}(R^2 - x^2)\\,dx = \\pi\\left(2R^3 - \\tfrac23R^3\\right) = \\tfrac43\\pi R^3$.
- **Paraboloid.** $y = \\sqrt{x}$ from 0 to $h$ (a dish of depth $h$ and rim radius $R = \\sqrt h$): $V = \\pi\\int_0^h x\\,dx = \\tfrac12\\pi h^2 = \\tfrac12\\pi R^2 h$, exactly half the surrounding cylinder.

### Washers: solids with a hole
If the region between two curves $f \\ge g$ is spun, each slice is a **washer** with outer radius $f$ and inner radius $g$:
$$V = \\int_a^b \\pi\\left(f^2 - g^2\\right)dx.$$
Note $f^2 - g^2$, not $(f - g)^2$.

### Shells: spinning about the other axis
Spinning a region under $y = f(x)$ about the **$y$-axis**, it is often easier to use cylindrical **shells**: a thin strip at distance $x$ from the axis sweeps out a tube of circumference $2\\pi x$, height $f(x)$ and thickness $dx$:
$$V = \\int_a^b 2\\pi x\\,f(x)\\,dx.$$

### Pappus and Cavalieri
**Pappus's theorem** gives a shortcut: the volume swept by a region of area $A$ turning about an axis is $A$ times the distance travelled by its centroid, $V = 2\\pi d\\,A$. A torus with tube radius $r$ and centre radius $R$ has $V = (\\pi r^2)(2\\pi R) = 2\\pi^2 R r^2$. **Cavalieri's principle** — solids with equal cross-sections at every height have equal volumes — is the disc method in words.

### Why engineers care
Tanks, bottles, pressure vessels, nozzles and turned parts are solids of revolution. The same slicing gives more than volume: weight each disc by its density to get the mass, or by $r^2$ to get the [[physics:moment-of-inertia|moment of inertia]] of a flywheel or a solid ball ($\\tfrac25 MR^2$). Kepler wrote a whole book in 1615 on estimating the volumes of wine barrels this way.
`,
  ideas: [
    'Disc method: V = ∫ π f(x)² dx, slices perpendicular to the axis.',
    'Washer method: V = ∫ π (f² − g²) dx for a solid with a hole.',
    'Shell method about the y-axis: V = ∫ 2π x f(x) dx.',
    'The cone\'s ⅓ and the sphere\'s 4/3 come straight out of these integrals.',
    'Pappus: volume = area × distance travelled by the centroid.'
  ],
  pitfalls: [
    'Using π(f − g)² for a washer — The hole removes π g², so the area of a washer is π(f² − g²).',
    'Spinning about the y-axis with the x-axis formula — Rotating about a different axis gives a different solid and volume; use shells or rewrite x as a function of y.',
    'Forgetting to square the radius — Each disc has area π r², not π r.'
  ],
  formulas: [
    {
      name: 'Volume of a paraboloid (dish)',
      expr: 'V = pi*R^2*h/2', tex: 'V = \\tfrac12\\pi R^2 h',
      vars: {
        V: { name: 'volume', q: 'volume', unit: 'L' },
        R: { name: 'rim radius', q: 'length', unit: 'cm', value: 30 },
        h: { name: 'depth', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'Half the cylinder that just contains it — from the disc method with $f(x) = \\sqrt{x}$ scaled.',
      stories: { V: 'A satellite dish (a paraboloid) has rim radius {R} and depth {h}. How much water would it hold?' }
    },
    {
      name: 'Liquid in a spherical tank (a spherical cap)',
      expr: 'V = pi*h^2*(3*R - h)/3', tex: 'V = \\frac{\\pi h^2 (3R - h)}{3}',
      vars: {
        V: { name: 'volume of liquid', q: 'volume', unit: 'L' },
        h: { name: 'depth of liquid (0 to 2R)', q: 'length', unit: 'm', value: 0.5 },
        R: { name: 'radius of the tank', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Discs from $x = R - h$ to $R$ of the sphere $x^2 + y^2 = R^2$. When solving for the depth, take the root between 0 and $2R$.',
      stories: {
        V: 'A spherical tank of radius {R} holds liquid to a depth of {h}. How much liquid is in it?',
        h: 'A spherical tank of radius {R} holds {V}. How deep is the liquid?'
      }
    }
  ],
  examples: [
    {
      title: 'The cone, by discs',
      q: 'Derive the volume of a cone of radius $R$ and height $h$ by spinning $y = Rx/h$, $0 \\le x \\le h$, about the $x$-axis.',
      steps: [
        'Each disc at $x$ has radius $Rx/h$ and volume $\\pi\\dfrac{R^2x^2}{h^2}\\,dx$.',
        '$V = \\dfrac{\\pi R^2}{h^2}\\int_0^h x^2\\,dx = \\dfrac{\\pi R^2}{h^2}\\cdot\\dfrac{h^3}{3} = \\tfrac13\\pi R^2 h$.'
      ],
      a: 'V = ⅓πR²h'
    },
    {
      title: 'A washer',
      q: 'The region between $y = x$ and $y = x^2$ is spun about the $x$-axis. Find the volume.',
      steps: [
        'For $0 \\le x \\le 1$ the outer radius is $x$ and the inner radius $x^2$.',
        '$V = \\pi\\int_0^1 (x^2 - x^4)\\,dx = \\pi\\left(\\tfrac13 - \\tfrac15\\right) = \\dfrac{2\\pi}{15} \\approx 0.419$.'
      ],
      a: '2π/15'
    },
    {
      title: 'A partly filled spherical tank',
      q: 'A spherical tank of radius 1 m holds water 0.5 m deep. How many litres?',
      steps: [
        'Put the sphere as $x^2 + y^2 = 1$ with the bottom at $x = 1$; the water fills $0.5 \\le x \\le 1$.',
        '$V = \\pi\\int_{0.5}^{1}(1 - x^2)\\,dx = \\pi\\left[x - \\tfrac{x^3}{3}\\right]_{0.5}^1 = \\pi\\left(\\tfrac23 - \\tfrac{11}{24}\\right) = \\dfrac{5\\pi}{24} = 0.654\\ \\mathrm{m^3}$.',
        'That is 654 litres, only 16% of the full tank, although it is a quarter full by depth.'
      ],
      a: 'About 654 L'
    }
  ],
  quiz: [
    { q: 'The curve $y = \\sqrt x$, $0 \\le x \\le 4$, is spun about the $x$-axis. The volume is…', choices: ['$4\\pi$', '$8\\pi$', '$16\\pi$', '$\\dfrac{16\\pi}{3}$'], a: 1,
      why: '$\\pi\\int_0^4 (\\sqrt x)^2\\,dx = \\pi\\int_0^4 x\\,dx = 8\\pi$: half of the cylinder of radius 2 and length 4.' },
    { q: 'Spinning the same region about the $x$-axis and about the $y$-axis gives the same volume.', a: false,
      why: 'Different axes give different solids. The region under $y = x$ on $[0, 1]$ gives $\\pi/3$ about the $x$-axis but $2\\pi/3$ about the $y$-axis.' },
    { q: 'Write the volume obtained by spinning $y = x$, $0 \\le x \\le h$, about the $x$-axis, as an expression in $h$.', answer: 'pi h^3/3', vars: ['h'],
      why: '$\\pi\\int_0^h x^2\\,dx = \\pi h^3/3$: a cone of radius $h$ and height $h$.' },
    { q: 'The cross-section of a washer with outer radius $f$ and inner radius $g$ has area…', choices: ['$\\pi(f - g)^2$', '$\\pi(f^2 - g^2)$', '$2\\pi(f - g)$', '$\\pi f^2 g^2$'], a: 1,
      why: 'A disc of radius $f$ minus a disc of radius $g$.' },
    { q: 'The region under $y = x^2$ for $0 \\le x \\le 2$ is spun about the $y$-axis. By shells, its volume is…', choices: ['$4\\pi$', '$8\\pi$', '$\\dfrac{32\\pi}{5}$', '$16\\pi$'], a: 1,
      why: '$\\int_0^2 2\\pi x\\cdot x^2\\,dx = 2\\pi\\cdot\\dfrac{2^4}{4} = 8\\pi$.' }
  ],
  applications: [
    'Capacities of tanks, bottles, dishes and pressure vessels.',
    'Mass and moment of inertia of turned parts and flywheels.',
    'Gauging the contents of partly filled horizontal and spherical tanks from the liquid depth.'
  ],
  history: 'Kepler\'s *New Solid Geometry of Wine Barrels* (1615) sliced barrels into thin discs to find their volumes — an early step towards integral calculus, prompted by doubts about how wine merchants measured their casks.',
  sim: 'calc-revolution'
},

{
  id: 'arc-length', parent: 'integral-applications', title: 'Arc length', level: 3,
  short: 'The length of a curve, found by adding up tiny straight segments: L = ∫ √(1 + (dy/dx)²) dx, or ∫ √(ẋ² + ẏ²) dt for a path traced in time.',
  keywords: ['arc length', 'length of a curve', 'ds', 'catenary', 'hanging cable', 'parametric arc length', 'distance travelled', 'rectification'],
  prereq: ['definite-integral', 'derivative', 'pythagorean-theorem'],
  related: ['parametric-curves', 'line-integrals', 'numerical-integration', 'surface-area', 'hyperbolic-functions', 'physics:speed-velocity'],
  body: `
How long is a curve? Approximate it by many short straight segments. A segment that covers $dx$ horizontally and $dy$ vertically has length, by [[pythagorean-theorem|Pythagoras]],

$$ds = \\sqrt{dx^2 + dy^2} = \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2}\\,dx.$$

Adding the segments and letting them shrink gives the **arc length** of $y = f(x)$ from $a$ to $b$:

$$L = \\int_a^b \\sqrt{1 + f'(x)^2}\\,dx.$$

A flat curve ($f' = 0$) has $L = b - a$; steeper parts contribute more length per unit of $x$. For a straight line of slope $m$, $L = \\sqrt{1 + m^2}\\,(b - a)$, Pythagoras again. The line $y = \\tfrac34x$ from 0 to 4 has length $\\tfrac54 \\times 4 = 5$: the 3–4–5 triangle.

### A curve that works out exactly
For $y = x^{3/2}$, $f' = \\tfrac32\\sqrt x$ and $1 + f'^2 = 1 + \\tfrac94 x$, whose square root integrates by [[integration-by-substitution|substitution]]:
$$L = \\int_0^4 \\sqrt{1 + \\tfrac94x}\\,dx = \\frac{8}{27}\\left[\\left(1 + \\tfrac94x\\right)^{3/2}\\right]_0^4 = \\frac{8}{27}\\left(10^{3/2} - 1\\right) \\approx 9.07.$$
Such tidy cases are rare: the square root usually has no elementary antiderivative. Even the length of a parabola needs inverse hyperbolic functions, and the perimeter of an ellipse cannot be written in elementary terms at all. In practice arc lengths are computed by [[numerical-integration|numerical integration]].

### Hanging cables
A flexible cable or chain hanging under its own weight takes the shape of a **catenary**, $y = a\\cosh(x/a)$. Because $1 + \\sinh^2 u = \\cosh^2 u$, its arc length is beautifully simple: between supports at $x = \\pm d$,
$$L = \\int_{-d}^{d}\\cosh\\frac{x}{a}\\,dx = 2a\\sinh\\frac{d}{a},$$
and the sag at the middle is $a\\left(\\cosh\\frac da - 1\\right)$. Engineers use exactly these formulas to decide how much cable a power line or a suspension footbridge needs (see [[hyperbolic-functions]]).

### Curves traced in time
For a path $(x(t), y(t))$ traced over time (a [[parametric-curves|parametric curve]]),
$$L = \\int_{t_1}^{t_2}\\sqrt{\\dot x^2 + \\dot y^2}\\,dt.$$
The integrand is the **speed**. So the arc length of a trajectory is simply the distance travelled, the integral of [[physics:speed-velocity|speed]] over time, which is what a car's odometer computes. In three dimensions add $\\dot z^2$ under the root. Arc length is also the natural way to measure along a curve in [[line-integrals|line integrals]].
`,
  ideas: [
    'Arc length adds up tiny hypotenuses: ds = √(1 + y′²) dx.',
    'For a parametric path, L = ∫ √(ẋ² + ẏ²) dt: the integral of speed, i.e. the distance travelled.',
    'The integrals are usually impossible in closed form and are done numerically.',
    'The catenary y = a cosh(x/a) has the neat length 2a sinh(d/a) between x = ±d.'
  ],
  pitfalls: [
    'L = ∫ (1 + y′) dx or ∫ √(1 + y′) dx — The derivative is squared under the root: √(1 + y′²).',
    'Arc length is the displacement between the ends — It is the length of the path; a semicircle of radius 1 has length π but its ends are only 2 apart.',
    'A hanging cable is a parabola — It is a catenary; the two are close only when the sag is small compared with the span.'
  ],
  formulas: [
    {
      name: 'Length of a hanging cable (catenary)',
      expr: 'L = 2*a*sinh(d/a)', tex: 'L = 2a\\sinh\\frac{d}{a}',
      vars: {
        L: { name: 'cable length', q: 'length', unit: 'm' },
        a: { name: 'catenary parameter a (tension ÷ weight per metre)', q: 'length', unit: 'm', value: 50 },
        d: { name: 'half the span between supports', q: 'length', unit: 'm', value: 20 }
      },
      note: 'For $y = a\\cosh(x/a)$ between $x = -d$ and $x = d$. A large $a$ (a tight cable) gives $L$ just above the span $2d$.',
      stories: {
        L: 'A cable hangs as a catenary with parameter {a} between supports {d} either side of its lowest point. How long is it?',
        a: 'A cable of length {L} hangs between supports {d} either side of its lowest point. What is its catenary parameter?'
      }
    },
    {
      name: 'Length of the parabola y = x² from 0 to b',
      expr: 'L = b*sqrt(1 + 4*b^2)/2 + asinh(2*b)/4', tex: 'L = \\frac{b\\sqrt{1 + 4b^2}}{2} + \\frac{\\operatorname{arsinh}(2b)}{4}',
      vars: {
        L: { name: 'arc length' },
        b: { name: 'end point b', value: 1 }
      },
      note: 'From $\\int_0^b \\sqrt{1 + 4x^2}\\,dx$ with the substitution $2x = \\sinh u$. For $b = 1$ the length is 1.4789, a little more than the chord $\\sqrt 2 = 1.4142$.'
    }
  ],
  examples: [
    {
      title: 'An exact arc length',
      q: 'Find the length of $y = x^{3/2}$ from $x = 0$ to $x = 4$.',
      steps: [
        '$y\' = \\tfrac32 x^{1/2}$, so $1 + y\'^2 = 1 + \\tfrac94 x$.',
        'Substitute $u = 1 + \\tfrac94x$, $dx = \\tfrac49\\,du$, with $u$ from 1 to 10: $L = \\tfrac49\\int_1^{10}u^{1/2}\\,du = \\tfrac49\\cdot\\tfrac23\\left[u^{3/2}\\right]_1^{10}$.',
        '$L = \\tfrac{8}{27}(31.623 - 1) = 9.07$. The straight chord from $(0,0)$ to $(4,8)$ is $\\sqrt{80} = 8.94$, slightly shorter, as it must be.'
      ],
      a: '≈ 9.07'
    },
    {
      title: 'The circumference, recovered',
      q: 'Use the arc-length formula on $y = \\sqrt{r^2 - x^2}$ to find the length of a semicircle.',
      steps: [
        '$y\' = \\dfrac{-x}{\\sqrt{r^2 - x^2}}$, so $1 + y\'^2 = \\dfrac{r^2}{r^2 - x^2}$.',
        '$L = \\int_{-r}^{r}\\dfrac{r\\,dx}{\\sqrt{r^2 - x^2}} = r\\left[\\arcsin\\frac xr\\right]_{-r}^{r} = r\\left(\\frac\\pi2 + \\frac\\pi2\\right) = \\pi r$.',
        'Doubling gives the circumference $2\\pi r$. (The integral is improper at both ends, but converges.)'
      ],
      a: 'πr'
    },
    {
      title: 'A power line',
      q: 'A cable hangs as $y = 50\\cosh(x/50)$ metres between towers 40 m apart. How long is it, and how much does it sag?',
      steps: [
        'Half-span $d = 20$ m, $a = 50$ m.',
        'Length: $2 \\times 50\\sinh(0.4) = 100 \\times 0.41075 = 41.08$ m, just 1.08 m more than the span.',
        'Sag: $50(\\cosh 0.4 - 1) = 50 \\times 0.08107 = 4.05$ m. A 2.7% longer cable sags about a tenth of the span.'
      ],
      a: 'Length 41.1 m, sag 4.05 m'
    }
  ],
  quiz: [
    { q: 'The length of $y = \\tfrac34 x$ from $x = 0$ to $x = 4$ is…', choices: ['3', '4', '5', '7'], a: 2,
      why: '$\\sqrt{1 + (3/4)^2} = 5/4$ per unit of $x$, times 4: the hypotenuse of a 3–4–5 triangle.' },
    { q: 'Write the integrand of the arc-length integral for $y = x^3$.', answer: 'sqrt(1 + 9x^4)', vars: ['x'],
      why: '$y\' = 3x^2$, so $\\sqrt{1 + (y\')^2} = \\sqrt{1 + 9x^4}$ — which, like most arc-length integrands, has no elementary antiderivative.' },
    { q: 'Most arc-length integrals can be evaluated with elementary antiderivatives.', a: false,
      why: 'The square root usually defeats the standard techniques; even the ellipse\'s perimeter needs special functions or numerics.' },
    { q: 'For a particle with position $(x(t), y(t))$, $\\int_{t_1}^{t_2}\\sqrt{\\dot x^2 + \\dot y^2}\\,dt$ is…', choices: ['its displacement', 'the distance it travels', 'its average speed', 'its final speed'], a: 1,
      why: 'The integrand is the speed; integrating speed over time gives the path length travelled.' }
  ],
  applications: [
    'Cable, chain and pipe lengths: power lines, suspension bridges, cable-stayed structures.',
    'Distance travelled along a curved trajectory; odometers and GPS track lengths.',
    'Road and rail design, where curves are laid out by arc length.'
  ]
},

{
  id: 'average-value', parent: 'integral-applications', title: 'Average value of a function', level: 2,
  short: 'The mean height of a function over an interval: its integral divided by the length of the interval, the height of the rectangle with the same area.',
  keywords: ['average value', 'mean value', 'mean value theorem for integrals', 'RMS', 'root mean square', 'time average', 'average of sine'],
  prereq: ['definite-integral', 'fundamental-theorem'],
  related: ['expected-value', 'riemann-sums', 'area-between-curves', 'physics:alternating-current', 'physics:ac-power', 'physics:center-of-mass'],
  body: `
The average of a list of numbers is their sum divided by how many there are. A function on an interval has infinitely many values, but the same idea works with an integral in place of the sum:

$$\\bar f = \\frac{1}{b - a}\\int_a^b f(x)\\,dx.$$

To see why, sample $f$ at $n$ equally spaced points and average: $\\frac1n\\sum f(x_i) = \\frac{1}{b-a}\\sum f(x_i)\\,\\Delta x$, a [[riemann-sums|Riemann sum]] divided by $b - a$. As $n$ grows it becomes the formula above.

**Geometrically**, $\\bar f$ is the height of the rectangle on $[a, b]$ with the same area as the region under the curve: level off the hills into the valleys and $\\bar f$ is the height of the flat result.

### The mean value theorem for integrals
If $f$ is continuous, it actually takes its average value somewhere: $f(c) = \\bar f$ for at least one $c$ in $[a, b]$. The average of $x^2$ on $[0, 3]$ is $\\frac13\\int_0^3 x^2\\,dx = 3$, reached at $x = \\sqrt 3$.

### Averages in time
Average velocity, $\\dfrac{1}{T}\\int_0^T v\\,dt$, is displacement divided by time, as in kinematics. The average temperature over a day, the average power of an engine over a cycle and the average current through a rectifier are all time averages.

### Sines and alternating current
Over a whole period the average of $\\sin$ is zero: the positive and negative halves cancel. Two related averages matter in electrical engineering:
- The average of $|\\sin|$, the output of a full-wave rectifier, is $\\dfrac{2}{\\pi} \\approx 0.637$ times the peak.
- The average of $\\sin^2$ over a period is exactly $\\tfrac12$, because $\\sin^2 + \\cos^2 = 1$ and the two have equal averages.

The second fact sets the **root-mean-square** value of an [[physics:alternating-current|alternating current]]: the square root of the average of the square,
$$V_{\\mathrm{rms}} = \\sqrt{\\overline{V^2}} = \\frac{V_0}{\\sqrt2}.$$
Resistive heating goes as $V^2/R$, so the RMS value is the steady voltage that would deliver the same average power ([[physics:ac-power|AC power]]). European mains is 230 V RMS, which means a peak of $230\\sqrt2 = 325$ V.

### Beyond time
Averages weighted by mass give the [[physics:center-of-mass|centre of mass]]; averages weighted by a probability density are [[expected-value|expected values]]. The idea is the same each time: integrate, then divide by the total.
`,
  ideas: [
    'Average value = (1/(b − a)) ∫ₐᵇ f(x) dx.',
    'It is the height of the rectangle with the same area as the region under f.',
    'A continuous function takes its average value somewhere on the interval.',
    'Over a period, sin averages to 0, |sin| to 2/π and sin² to ½.',
    'The RMS value of a sinusoid is its peak divided by √2.'
  ],
  pitfalls: [
    'The average value is (f(a) + f(b))/2 — Only for straight lines. For x² on [0, 3] the endpoint average is 4.5 but the true average is 3.',
    'The average of a sine wave is its RMS value — The average over a period is zero; RMS squares first, averages, then takes the root.',
    'Dividing by the number of samples — For a function, divide the integral by the length of the interval b − a.'
  ],
  formulas: [
    {
      name: 'RMS value of a sinusoid',
      expr: 'Vr = V0/sqrt(2)', tex: 'V_{\\mathrm{rms}} = \\frac{V_0}{\\sqrt 2}',
      vars: {
        Vr: { name: 'RMS value', tex: 'V_{\\mathrm{rms}}', q: 'voltage', unit: 'V' },
        V0: { name: 'peak value', q: 'voltage', unit: 'V', value: 325 }
      },
      note: 'From the average of $\\sin^2$ over a period, $\\tfrac12$. It applies to currents too.',
      stories: { Vr: 'An AC supply swings between +{V0} and −{V0}. What is its RMS voltage?', V0: 'A mains supply is rated {Vr} RMS. What is its peak voltage?' }
    },
    {
      name: 'Average of a rectified sine',
      expr: 'Va = 2*V0/pi', tex: 'V_{\\mathrm{avg}} = \\frac{2V_0}{\\pi}',
      vars: {
        Va: { name: 'average of |V| over a cycle', tex: 'V_{\\mathrm{avg}}', q: 'voltage', unit: 'V' },
        V0: { name: 'peak value', q: 'voltage', unit: 'V', value: 325 }
      },
      note: 'Average of one arch: $\\frac{1}{\\pi}\\int_0^\\pi \\sin x\\,dx = \\frac2\\pi$. What a moving-coil meter reads after a full-wave rectifier.'
    },
    {
      name: 'Average of xⁿ on [0, b]',
      expr: 'm = b^n/(n + 1)', tex: '\\bar{f} = \\frac{b^n}{n + 1}',
      vars: {
        m: { name: 'average value', tex: '\\bar{f}' },
        b: { name: 'end of the interval b', value: 3 },
        n: { name: 'power n', value: 2 }
      },
      note: '$\\frac1b\\int_0^b x^n\\,dx$. The average of $x^n$ is only $\\frac{1}{n+1}$ of its largest value $b^n$: high powers are small most of the way.'
    }
  ],
  examples: [
    {
      title: 'Where the average is reached',
      q: 'Find the average of $f(x) = x^2$ on $[0, 3]$, and where $f$ takes that value.',
      steps: [
        '$\\bar f = \\frac13\\int_0^3 x^2\\,dx = \\frac13\\cdot 9 = 3$.',
        '$x^2 = 3$ at $x = \\sqrt 3 \\approx 1.73$, inside the interval, as the mean value theorem promises.',
        'The endpoint average $(0 + 9)/2 = 4.5$ would overstate it: the parabola spends most of its time low.'
      ],
      a: 'Average 3, reached at x = √3.'
    },
    {
      title: 'Mains voltage',
      q: 'A mains supply peaks at 325 V. Find its RMS value and the average of its rectified voltage.',
      steps: [
        'RMS: $325/\\sqrt2 = 230\\ \\mathrm{V}$.',
        'Rectified average: $2 \\times 325/\\pi = 207\\ \\mathrm{V}$.',
        'The RMS value is the larger because squaring gives extra weight to the high parts of the wave.'
      ],
      a: '230 V RMS; 207 V rectified average'
    },
    {
      title: 'A warm afternoon',
      q: 'The temperature over a day is modelled as $T(t) = 15 - 6\\cos(\\pi t/12)$ °C ($t$ in hours from midnight). Find the average over the whole day and over 6:00–18:00.',
      steps: [
        'Over 24 h the cosine averages to zero: $\\bar T = 15\\ \\mathrm{°C}$.',
        { text: 'From 6 to 18 h:', tex: '\\bar T = 15 - \\frac{6}{12}\\int_6^{18}\\cos\\frac{\\pi t}{12}\\,dt = 15 - \\frac{6}{\\pi}\\left[\\sin\\frac{\\pi t}{12}\\right]_6^{18} = 15 + \\frac{12}{\\pi}' },
        'That is $18.8\\ \\mathrm{°C}$ for the daytime half.'
      ],
      a: '15 °C over the day; 18.8 °C from 6:00 to 18:00'
    }
  ],
  quiz: [
    { q: 'The average of $\\sin x$ over $[0, 2\\pi]$ is…', choices: ['1', '1/2', '$2/\\pi$', '0'], a: 3,
      why: 'The positive and negative halves have equal areas and cancel.' },
    { q: 'The average of $\\sin^2 x$ over a full period is…', choices: ['0', '1/2', '$1/\\sqrt2$', '1'], a: 1,
      why: '$\\sin^2$ and $\\cos^2$ have the same average and add up to 1, so each averages $\\tfrac12$.' },
    { q: 'The average value of $f$ on $[a, b]$ always equals $\\tfrac12\\big(f(a) + f(b)\\big)$.', a: false,
      why: 'Only for linear functions. For $x^2$ on $[0, 3]$ it is 3, not 4.5.' },
    { q: 'Write the average value of $x^2$ on $[0, b]$ as an expression in $b$.', answer: 'b^2/3', vars: ['b'],
      why: '$\\frac1b\\int_0^b x^2\\,dx = \\frac1b\\cdot\\frac{b^3}{3}$.' },
    { q: 'A car\'s velocity $v(t)$ is averaged over $0 \\le t \\le T$. The result equals…', choices: ['the displacement divided by T', 'the distance divided by T', 'the final velocity', 'half the maximum velocity'], a: 0,
      why: '$\\frac1T\\int_0^T v\\,dt = \\frac{x(T) - x(0)}{T}$ by the fundamental theorem.' }
  ],
  applications: [
    'RMS voltages and currents, average power in AC circuits.',
    'Climate and weather statistics: daily, monthly and yearly averages.',
    'Centres of mass, centroids and expected values.'
  ]
}

);
