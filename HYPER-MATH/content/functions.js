/* HYPER-MATH · content/functions.js — Algebra › Functions:
 * functions and their graphs, straight lines, power laws, transformations,
 * composition and inverses. */
Hyper.add(

{
  id: 'functions', parent: 'functions-topic', title: 'Functions', level: 1,
  short: 'A rule that turns each allowed input into exactly one output: its domain and range, its graph, and the ways of describing its shape.',
  keywords: ['function', 'f(x)', 'input', 'output', 'domain', 'range', 'graph', 'vertical line test', 'even function', 'odd function', 'piecewise', 'increasing', 'decreasing', 'zeros', 'rate of change'],
  prereq: ['number-systems', 'coordinate-geometry'],
  related: ['function-transformations', 'composition-of-functions', 'inverse-functions', 'limits', 'continuity', 'physics:motion-graphs'],
  body: `
A **function** is a rule that takes an input and gives back exactly one output. Think of a machine: put in a number $x$ and out comes $f(x)$. The squaring function turns 3 into 9 and −3 into 9; a thermometer record turns each moment into one temperature; postage turns each weight of letter into one price.
$$f(x) = x^2 - 3: \\qquad f(2) = 1, \\quad f(-1) = -2, \\quad f(a + 1) = a^2 + 2a - 2$$
The $x$ in the brackets is only a placeholder: whatever goes in replaces $x$ everywhere in the rule.

### Domain and range
The **domain** is the set of inputs allowed; the **range** is the set of outputs that actually come out. For $f(x) = \\sqrt{x - 2}$ the domain is $x \\ge 2$ (no square roots of negatives) and the range is $y \\ge 0$. For $g(x) = 1/x$ the domain leaves out 0, and so does the range. In applications common sense narrows the domain further: a length is not negative, and a clock starts at zero.

### Four ways to give a function
- a **formula**, such as the area of a circle $A(r) = \\pi r^2$;
- a **table** of values, as from an experiment;
- a **graph**, the set of all points $(x, f(x))$;
- **words**: "the fare depends on the distance travelled".

The formula is best for calculating, the table for data, and the graph for seeing the whole shape at a glance.

### The vertical-line test
Because each input has only one output, a vertical line crosses the graph of a function at most once. The circle $x^2 + y^2 = 1$ fails: at $x = 0$ it has $y = 1$ and $y = -1$. It is a perfectly good curve, but not the graph of a function of $x$; describing it takes two functions, $y = \\pm\\sqrt{1 - x^2}$.

### Describing a graph
A function is **increasing** where its graph rises from left to right and **decreasing** where it falls. Its **zeros** are the inputs with $f(x) = 0$, where the graph meets the $x$-axis. It is **even** if $f(-x) = f(x)$ — mirror-symmetric in the $y$-axis, like $x^2$ and $\\cos x$ — and **odd** if $f(-x) = -f(x)$ — unchanged by a half-turn about the origin, like $x^3$ and $\\sin x$. **Piecewise** functions use different rules on different parts of the domain: tax bands, postage rates, or $|x|$ itself.

The **average rate of change** between two inputs is the slope of the chord joining their points:
$$\\frac{f(x_2) - f(x_1)}{x_2 - x_1}$$
Shrinking the gap to nothing gives the [[derivative]].

### Functions in science
Nearly every law of physics is a function: position against time $x(t)$ ([[physics:motion-graphs|motion graphs]]), a gas's pressure against its volume, a spring's force against its stretch. The questions calculus asks — how fast does $f$ change, how much does it add up to — are questions about functions, and functions of several inputs, such as the temperature at each point of a room, lead on to [[scalar-vector-fields|fields]].

> [!key] One input, exactly one output. Formulas, tables and graphs are just different ways of writing the rule down.
`,
  ideas: [
    'A function assigns to each input in its domain exactly one output.',
    'The domain is what may go in; the range is what comes out.',
    'A curve is the graph of a function of $x$ when no vertical line meets it twice.',
    'Even functions are symmetric in the $y$-axis, odd functions under a half-turn about the origin.'
  ],
  pitfalls: [
    'A function must be given by a single formula — Tables, graphs and piecewise rules are functions too, as long as each input gets one output.',
    '$f(a + b) = f(a) + f(b)$ — True only for special functions. With $f(x) = x^2$: $f(1 + 2) = 9$ but $f(1) + f(2) = 5$.',
    'Two inputs with the same output break the definition — That is allowed ($x^2$ sends 3 and −3 to 9). What is forbidden is one input with two outputs.'
  ],
  formulas: [
    {
      name: 'Average rate of change',
      expr: 'r = (y2 - y1)/(x2 - x1)', tex: 'r = \\frac{y_2 - y_1}{x_2 - x_1}',
      vars: {
        r: { name: 'average rate of change', signed: true },
        y2: { name: 'output at the second input, f(x₂)', value: 110, signed: true },
        y1: { name: 'output at the first input, f(x₁)', value: 20, signed: true },
        x2: { name: 'second input', value: 5, signed: true },
        x1: { name: 'first input', value: 2, signed: true }
      },
      note: 'The slope of the chord between two points of the graph. For a position–time graph it is the average velocity.',
      stories: { r: 'A function has f({x1}) = {y1} and f({x2}) = {y2}. What is its average rate of change between these inputs?' }
    }
  ],
  examples: [
    {
      title: 'Putting things into a function',
      q: 'For $f(x) = 2x^2 - x$, find $f(3)$, $f(-2)$ and $f(a + h) - f(a)$.',
      steps: [
        '$f(3) = 18 - 3 = 15$ and $f(-2) = 8 + 2 = 10$.',
        '$f(a + h) = 2(a + h)^2 - (a + h) = 2a^2 + 4ah + 2h^2 - a - h$.',
        'Subtract $f(a) = 2a^2 - a$: $f(a + h) - f(a) = 4ah + 2h^2 - h$.'
      ],
      a: '$15$, $10$ and $4ah + 2h^2 - h$ (dividing the last by $h$ is the first step towards the [[derivative]]).'
    },
    {
      title: 'Domain and range',
      q: 'Find the domain and range of $f(x) = \\sqrt{4 - x^2}$.',
      steps: [
        'The square root needs $4 - x^2 \\ge 0$, so $-2 \\le x \\le 2$.',
        'Inside that interval $4 - x^2$ runs from 0 (at the ends) to 4 (at $x = 0$), so $f$ runs from 0 to 2.',
        'The graph is the upper half of the circle of radius 2.'
      ],
      a: 'Domain $[-2, 2]$, range $[0, 2]$.'
    },
    {
      title: 'A piecewise function',
      q: 'Postage costs £0.85 up to 100 g, £1.30 from over 100 g to 250 g, and £1.80 from over 250 g to 750 g. What do letters of 100 g and 101 g cost, and what does the graph look like?',
      steps: [
        '100 g is in the first band: £0.85. 101 g is in the second: £1.30.',
        'The graph is a staircase of horizontal steps, jumping at 100 g and 250 g.',
        'Each weight has one price, so it is a function — even though the graph is not a single unbroken curve (it is not [[continuity|continuous]]).'
      ],
      a: '£0.85 and £1.30; a step graph.'
    }
  ],
  quiz: [
    { q: 'Which of these is **not** the graph of a function of $x$?', choices: ['the line $y = 3x - 1$', 'the parabola $y = x^2$', 'the circle $x^2 + y^2 = 4$', 'the horizontal line $y = 5$'], a: 2,
      why: 'A vertical line such as $x = 0$ meets the circle twice, at $y = 2$ and $y = -2$. The horizontal line is fine: every input has the one output 5.' },
    { q: 'The domain of $f(x) = \\sqrt{x - 2}$ is…', choices: ['$x > 2$', '$x \\ge 2$', '$x \\ge 0$', 'every real $x$'], a: 1,
      why: 'The expression under the root must not be negative: $x - 2 \\ge 0$. At $x = 2$ the root is 0, which is allowed.' },
    { q: 'If $f(x) = 2x + 1$, write $f(x + h)$.', answer: '2x + 2h + 1', vars: ['x', 'h'],
      why: 'Replace every $x$ in the rule by $x + h$: $2(x + h) + 1$.' },
    { q: 'A function can give the same output for two different inputs.', a: true,
      why: '$x^2$ gives 9 for both 3 and −3. What a function cannot do is give two outputs for one input.' },
    { q: '$f(x) = x^3 - x$ is…', choices: ['even', 'odd', 'both even and odd', 'neither'], a: 1,
      why: '$f(-x) = -x^3 + x = -(x^3 - x) = -f(x)$.' }
  ],
  applications: [
    'Physical laws: position against time, force against extension, pressure against volume.',
    'Calibration curves that turn an instrument reading into a quantity.',
    'Tariffs and tax bands (piecewise functions).',
    'Computer programs: a function in code is the same idea — inputs in, one result out.'
  ]
},

{
  id: 'linear-functions', parent: 'functions-topic', title: 'Linear functions and slope', level: 1,
  short: 'Functions that change at a constant rate: straight lines y = mx + b, their slope and intercept, and what the slope means when it carries units.',
  keywords: ['linear function', 'straight line', 'slope', 'gradient', 'rise over run', 'intercept', 'y = mx + b', 'y = mx + c', 'point-slope form', 'parallel', 'perpendicular', 'rate of change'],
  prereq: ['functions', 'linear-equations'],
  related: ['equation-of-a-line', 'derivative', 'systems-of-equations', 'linear-regression', 'physics:speed-velocity', 'physics:hookes-law', 'physics:ohms-law'],
  body: `
A **linear function** changes at a constant rate: each step of 1 in $x$ changes $y$ by the same amount $m$. Its graph is a straight line,
$$y = mx + b$$
where $m$ is the **slope** (or gradient) and $b$ is the **$y$-intercept**, the value of $y$ when $x = 0$. (Many books write $c$ for the intercept.)

### Slope
The slope is rise over run between any two points of the line:
$$m = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}$$
Because the line is straight, every pair of points gives the same answer. $m > 0$: rising; $m < 0$: falling; $m = 0$: horizontal. A vertical line has no slope — the run is zero — and is not a function at all; its equation is $x = c$. The slope also fixes the angle to the $x$-axis, $\\tan\\theta = m$: a slope of 1 is 45°, and a road sign warning of a 10 % gradient means a slope of 0.1, about 5.7°.

### Finding the equation
Through the point $(x_1, y_1)$ with slope $m$ the line is
$$y - y_1 = m(x - x_1)$$
the **point–slope form**. Through two points, find $m$ first, then use either point. For $(1, 3)$ and $(4, 9)$: $m = 6/3 = 2$, so $y - 3 = 2(x - 1)$, that is $y = 2x + 1$.

### Parallel and perpendicular
Parallel lines have equal slopes. Perpendicular lines have slopes whose product is −1: turning a line through a right angle turns $m$ into $-1/m$. So $y = 2x + 1$ and $y = -\\tfrac12 x + 4$ cross at right angles. (More on lines drawn on axes in [[equation-of-a-line|the equation of a line]].)

### A slope has units
In science a slope is a **rate** and carries units. On a position–time graph it is a [[physics:speed-velocity|velocity]] in m/s; on a force–extension graph of a spring it is the spring constant in N/m ([[physics:hookes-law|Hooke's law]]); on a voltage–current graph of a resistor it is the resistance in ohms ([[physics:ohms-law|Ohm's law]]). The intercept means something too: a starting position, a fixed charge on a bill, the 32 °F that corresponds to 0 °C.

### Linear models
A line through the origin ($b = 0$) is [[fractions-ratios|direct proportion]]. Measured data scatter, and the best line through them is found by [[linear-regression|least squares]]. Curved relationships are often *made* straight by a clever choice of axes — $\\log y$, or $1/x$ — so that a line can be fitted. And the [[derivative]] is the slope of the line that best matches a curve at one point: much of calculus treats curves as straight lines seen close up.

> [!tip] If $x$ goes up by 1, $y$ goes up by $m$; if $x$ goes up by 5, $y$ goes up by $5m$. That is all "linear" means.
`,
  ideas: [
    'A linear function changes by the same amount for every equal step in $x$; its graph is a straight line.',
    'The slope is rise over run, the same between any two points; the intercept is the value at $x = 0$.',
    'Parallel lines have equal slopes; perpendicular slopes multiply to −1.',
    'In applications the slope is a rate with units — a speed, a stiffness, a resistance.'
  ],
  pitfalls: [
    'Run over rise — The slope is $\\Delta y / \\Delta x$. From $(1, 3)$ to $(4, 9)$ it is $6/3 = 2$, not $3/6$.',
    'Subtracting in a different order on top and bottom — $\\tfrac{y_2 - y_1}{x_1 - x_2}$ flips the sign. Take both differences in the same order.',
    'Perpendicular slope is $-m$ or $1/m$ — It is both at once: $-1/m$. A line of slope 2 is perpendicular to slope $-\\tfrac12$.'
  ],
  formulas: [
    {
      name: 'Slope–intercept form',
      expr: 'y = m*x + b', tex: 'y = mx + b',
      vars: {
        y: { name: 'output', signed: true },
        m: { name: 'slope', value: 2, signed: true },
        x: { name: 'input', value: 3, signed: true },
        b: { name: 'y-intercept', value: 1, signed: true }
      }
    },
    {
      name: 'Slope through two points',
      expr: 'm = (y2 - y1)/(x2 - x1)', tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
      vars: {
        m: { name: 'slope', signed: true },
        y2: { name: 'y of the second point', value: 9, signed: true },
        y1: { name: 'y of the first point', value: 3, signed: true },
        x2: { name: 'x of the second point', value: 4, signed: true },
        x1: { name: 'x of the first point', value: 1, signed: true }
      },
      stories: { m: 'A line passes through ({x1}, {y1}) and ({x2}, {y2}). What is its slope?' }
    },
    {
      name: 'Perpendicular slope',
      expr: 'm2 = -1/m1', tex: 'm_2 = -\\frac{1}{m_1}',
      vars: {
        m2: { name: 'slope of the perpendicular line', signed: true },
        m1: { name: 'slope of the given line', value: 2, signed: true }
      }
    }
  ],
  examples: [
    {
      title: 'A line through two points',
      q: 'Find the equation of the line through $(-2, 7)$ and $(4, -2)$.',
      steps: [
        'Slope: $m = \\dfrac{-2 - 7}{4 - (-2)} = \\dfrac{-9}{6} = -1.5$.',
        'Point–slope form with $(-2, 7)$: $y - 7 = -1.5(x + 2)$.',
        'Tidy up: $y = -1.5x + 4$. Check with the other point: $-6 + 4 = -2$.'
      ],
      a: '$y = -1.5x + 4$'
    },
    {
      title: 'The slope of a spring',
      q: 'A spring stretches 2.0 cm under a force of 3.0 N and 5.0 cm under 7.5 N. Find the slope of the force–extension line in N/m, and its intercept.',
      steps: [
        'Slope: $\\dfrac{7.5 - 3.0}{0.050 - 0.020} = \\dfrac{4.5\\ \\mathrm{N}}{0.030\\ \\mathrm{m}} = 150\\ \\mathrm{N/m}$.',
        'Intercept: $3.0 = 150 \\times 0.020 + b$ gives $b = 0$.',
        'The line passes through the origin: force is proportional to extension, as [[physics:hookes-law|Hooke\'s law]] says, with spring constant 150 N/m.'
      ],
      a: '150 N/m, intercept 0'
    },
    {
      title: 'Where two scales agree',
      q: 'Water freezes at 0 °C = 32 °F and boils at 100 °C = 212 °F. Find the line $F(C)$ and the temperature that reads the same on both scales.',
      steps: [
        'Slope: $\\dfrac{212 - 32}{100 - 0} = 1.8$; intercept 32. So $F = 1.8C + 32$.',
        'Same reading: $t = 1.8t + 32$, so $-0.8t = 32$ and $t = -40$.'
      ],
      a: '$F = 1.8C + 32$; −40 °C = −40 °F'
    }
  ],
  quiz: [
    { q: 'Find the line through $(1, 3)$ and $(3, 7)$. Type $y$ in terms of $x$.', answer: '2x + 1', vars: ['x'],
      why: 'Slope $4/2 = 2$; then $3 = 2 \\times 1 + b$ gives $b = 1$.' },
    { q: 'What is the slope of a line perpendicular to $y = \\tfrac23 x - 5$?', answer: '-3/2', vars: [],
      why: 'Perpendicular slopes multiply to −1: $-1 \\div \\tfrac23 = -\\tfrac32$.' },
    { q: 'On a distance–time graph of a cyclist, the slope is…', choices: ['the distance travelled', 'the speed', 'the acceleration', 'the time taken'], a: 1,
      why: 'Slope is change in distance over change in time: metres per second.' },
    { q: 'Every straight line in the plane is the graph of a function $y = mx + b$.', a: false,
      why: 'Vertical lines $x = c$ have no slope and fail the vertical-line test.' },
    { q: 'A line has slope −3 and passes through $(2, 1)$. Its $y$-intercept is…', choices: ['−5', '7', '1', '−3'], a: 1,
      why: '$1 = -3 \\times 2 + b$, so $b = 7$.' }
  ],
  applications: [
    'Reading rates from graphs: velocities, stiffnesses, resistances, growth rates.',
    'Calibration of instruments with a linear response.',
    'Linear cost models and break-even analysis.',
    'Straight-line fits to data and linearised plots.'
  ],
  sim: 'alg-line'
},

{
  id: 'power-functions', parent: 'functions-topic', title: 'Power functions and proportionality', level: 2,
  short: 'Functions y = kxᵖ: the shapes they take, the scaling rule "multiply x by s and y is multiplied by sᵖ", and the power laws that run through physics and biology.',
  keywords: ['power function', 'power law', 'proportional to', 'inverse square', 'square-cube law', 'scaling', 'allometry', 'log-log plot', 'exponent', 'Kepler', 'y = kx^p'],
  prereq: ['exponents', 'functions', 'fractions-ratios'],
  related: ['scaling-laws', 'logarithmic-scales', 'rational-functions', 'exponential-functions', 'physics:newtons-law-of-gravitation', 'physics:light-intensity', 'physics:keplers-laws', 'physics:simple-pendulum', 'physics:drag-force'],
  body: `
A **power function** has the variable in the base and a fixed exponent:
$$y = k\\,x^{p}$$
It is the mathematical form of "$y$ is proportional to the $p$-th power of $x$", written $y \\propto x^p$. Physics and engineering are full of them.

### The family of shapes
For $x > 0$ all of them pass through $(1, k)$, and:
- $p > 1$ ($x^2$, $x^3$): flat at first, then curving up ever more steeply;
- $p = 1$: a straight line through the origin — plain proportion;
- $0 < p < 1$ ($\\sqrt x = x^{1/2}$): steep at first, then rising more and more slowly, but never levelling off;
- $p < 0$ ($1/x$, $1/x^2$): falling from infinity near 0 towards 0 far away — inverse proportion and inverse-square laws.

### The scaling rule
The single most useful fact about a power law: **multiply $x$ by a factor $s$ and $y$ is multiplied by $s^p$**, whatever $x$ was:
$$\\frac{y_2}{y_1} = \\left(\\frac{x_2}{x_1}\\right)^{p}$$
Double the radius of a sphere and its surface ($\\propto r^2$) grows 4 times while its volume ($\\propto r^3$) grows 8 times — which is why large animals need thick legs and lose heat slowly ([[scaling-laws]]). Double your distance from a lamp and the light on you drops to a quarter ([[physics:light-intensity|the inverse-square law]]). Make a pendulum four times longer and its period doubles, since $T \\propto L^{1/2}$ ([[physics:simple-pendulum|simple pendulum]]). Double a car's speed and the air drag on it roughly quadruples ([[physics:drag-force|drag]]).

### Famous power laws

| Law | Exponent |
|---|---|
| Gravitational and electric force, $F \\propto r^{-2}$ | −2 |
| Kepler's third law, $T \\propto a^{3/2}$ | 1.5 |
| Radiated power of a hot body, $P \\propto T^{4}$ | 4 |
| Kinetic energy, $E \\propto v^{2}$ | 2 |
| Metabolic rate of animals, roughly $\\propto M^{3/4}$ | 0.75 |

### Finding the exponent from data
Take logarithms of $y = kx^p$: $\\log y = \\log k + p \\log x$. On **log–log** axes a power law is a straight line whose slope is the exponent ([[logarithmic-scales]]). From two measurements,
$$p = \\frac{\\log(y_2/y_1)}{\\log(x_2/x_1)}$$
This is how Kepler's third law was confirmed and how the $M^{3/4}$ law of metabolism was found, from data spanning mice to elephants.

### Power or exponential?
$x^3$ and $3^x$ look alike on paper and are utterly different. In a power function the variable is the base; in an [[exponential-functions|exponential function]] it is the exponent. Any exponential with a base above 1 eventually overtakes any power, however large — race them in the simulation.
`,
  ideas: [
    'A power function is $y = kx^p$: variable in the base, fixed exponent.',
    'Scaling $x$ by a factor $s$ scales $y$ by $s^p$, independently of where you start.',
    'Negative powers describe inverse and inverse-square laws; fractional powers describe roots.',
    'On log–log axes a power law is a straight line with slope $p$.'
  ],
  pitfalls: [
    'Doubling the distance halves an inverse-square effect — It divides it by $2^2 = 4$.',
    'Confusing $x^2$ with $2^x$ — One is a power function, the other exponential. At $x = 10$ they are 100 and 1024; at $x = 30$, 900 and about a billion.',
    'Reading the exponent off a linear graph — Curves on ordinary axes all look similar; plot on log–log axes and measure the slope.'
  ],
  formulas: [
    {
      name: 'A power function',
      expr: 'y = k*x^p', tex: 'y = k\\,x^{p}',
      vars: {
        y: { name: 'output' },
        k: { name: 'constant of proportionality', value: 2 },
        x: { name: 'input', value: 3 },
        p: { name: 'exponent', value: 2, signed: true }
      }
    },
    {
      name: 'Scaling with a power law',
      expr: 'y2 = y1*(x2/x1)^p', tex: 'y_2 = y_1 \\left(\\frac{x_2}{x_1}\\right)^{p}',
      vars: {
        y2: { name: 'new output' },
        y1: { name: 'old output', value: 100 },
        x2: { name: 'new input', value: 2 },
        x1: { name: 'old input', value: 1 },
        p: { name: 'exponent', value: -2, signed: true }
      },
      note: 'Solving for $p$ gives the exponent from two measurements: $p = \\log(y_2/y_1) / \\log(x_2/x_1)$.',
      stories: {
        y2: 'A lamp gives {y1} lux at {x1} m. Light intensity falls off with exponent {p}. How bright is it at {x2} m?',
        p: 'A quantity is {y1} when x = {x1} and {y2} when x = {x2}. If it follows a power law, what is the exponent?'
      }
    }
  ],
  examples: [
    {
      title: 'The year on Mars',
      q: 'Mars orbits the Sun at 1.524 times the Earth\'s distance. Using $T \\propto a^{3/2}$, how long is its year?',
      steps: [
        'The scaling rule with $p = 1.5$: $T_\\text{Mars} = 1\\ \\text{year} \\times 1.524^{1.5}$.',
        '$\\sqrt{1.524} = 1.2345$, and $1.524 \\times 1.2345 = 1.881$.'
      ],
      a: 'About 1.88 Earth years (687 days)'
    },
    {
      title: 'A statue three times as large',
      q: 'A bronze statue is copied at three times the size in every direction. How do the paint needed, the mass and the pressure on its base change?',
      steps: [
        'Paint covers the surface, $\\propto L^2$: $3^2 = 9$ times as much.',
        'Mass follows volume, $\\propto L^3$: $3^3 = 27$ times as much.',
        'Pressure on the base is weight over area: $27/9 = 3$ times as much. Scaled-up structures are relatively weaker — Galileo\'s argument about the sizes of animals.'
      ],
      a: 'Paint ×9, mass ×27, base pressure ×3'
    },
    {
      title: 'An exponent from two measurements',
      q: 'A pendulum of length 0.25 m has period 1.00 s; one of length 1.00 m has period 2.01 s. Assuming $T \\propto L^p$, find $p$.',
      steps: [
        '$p = \\dfrac{\\log(2.01/1.00)}{\\log(1.00/0.25)} = \\dfrac{\\log 2.01}{\\log 4}$.',
        '$= \\dfrac{0.3032}{0.6021} = 0.504$.'
      ],
      a: '$p \\approx 0.50$: the period grows as the square root of the length.'
    }
  ],
  quiz: [
    { q: 'Light intensity follows an inverse-square law. Moving three times farther from a lamp makes the intensity…', choices: ['one third', 'one sixth', 'one ninth', 'nine times larger'], a: 2,
      why: '$3^{-2} = \\tfrac19$.' },
    { q: '$y \\propto x^3$. If $x$ is doubled, $y$ is multiplied by what number?', answer: '8', vars: [],
      why: '$2^3 = 8$, whatever the starting value of $x$.' },
    { q: 'On log–log axes, data following $y = 5x^{-1.5}$ lie on a straight line with slope…', choices: ['5', '−1.5', '1.5', '$\\log 5$'], a: 1,
      why: '$\\log y = \\log 5 - 1.5\\log x$: the exponent is the slope; $\\log 5$ is the intercept.' },
    { q: '$y = 2^x$ is a power function.', a: false,
      why: 'The variable is in the exponent, so it is an exponential function. $x^2$ is the power function.' },
    { q: 'A pendulum\'s period is proportional to $\\sqrt L$. To double the period, the length must be…', choices: ['doubled', 'multiplied by $\\sqrt2$', 'multiplied by 4', 'halved'], a: 2,
      why: 'With $p = \\tfrac12$ the factor $s$ must satisfy $s^{1/2} = 2$, so $s = 4$.' }
  ],
  applications: [
    'Inverse-square laws for gravity, electric forces, light and sound.',
    'Scaling of structures, animals and machines (the square–cube law).',
    'Allometry in biology: metabolic rate, heart rate and lifespan against body mass.',
    'Drag, lift and power in fluid flow, which scale with powers of speed.'
  ],
  sim: { id: 'alg-growth-race', params: { axes: 'loglog' } }
},

{
  id: 'function-transformations', parent: 'functions-topic', title: 'Transforming graphs', level: 2,
  short: 'Shifting, stretching and reflecting graphs: y = a f(b(x − h)) + k, why changes inside the bracket act backwards, and how a travelling wave is a moving graph.',
  keywords: ['transformation', 'translation', 'shift', 'stretch', 'compression', 'reflection', 'horizontal shift', 'vertical shift', 'vertex form', 'f(x - h)', 'af(x)', 'travelling wave'],
  prereq: ['functions', 'linear-functions'],
  related: ['trig-graphs', 'quadratic-equations', 'composition-of-functions', 'absolute-value', 'physics:wave-properties'],
  body: `
Once you know a handful of basic graphs — $x^2$, $|x|$, $\\sqrt x$, $1/x$, $\\sin x$, $2^x$ — you can sketch thousands more, because most functions you meet are basic ones shifted, stretched or flipped. All the moves fit in one formula:
$$y = a\\, f\\big(b(x - h)\\big) + k$$

### Outside the bracket: vertical changes
Changes made **after** $f$ act on the outputs, the $y$-values, and do what they look like:
- $f(x) + k$ moves the graph **up** by $k$;
- $a\\,f(x)$ stretches it vertically by the factor $a$ (squashes it if $|a| < 1$);
- $-f(x)$ reflects it in the $x$-axis.

### Inside the bracket: horizontal changes, backwards
Changes made **before** $f$ act on the inputs, and they work the opposite way to what you might expect:
- $f(x - h)$ moves the graph **right** by $h$. What used to happen at $x = 0$ now happens at $x = h$, because that is where the input $x - h$ is zero.
- $f(bx)$ **squeezes** the graph horizontally by the factor $b$: $f(2x)$ reaches each value at half the $x$ it used to.
- $f(-x)$ reflects the graph in the $y$-axis.

Altogether, a point $(x, y)$ of the original graph ends up at
$$\\left(\\frac{x}{b} + h,\\;\\; a y + k\\right)$$
Horizontally: squeeze, then shift. Vertically: stretch, then shift.

### Examples
- $y = (x - 3)^2 + 1$ is $y = x^2$ moved 3 right and 1 up, with its vertex at $(3, 1)$. Completing the square writes every quadratic in this "vertex form" ([[quadratic-equations]]).
- $y = 2\\sin(3x)$ has amplitude 2 and a period one third of $2\\pi$ ([[trig-graphs|graphs of sine and cosine]]).
- $y = \\dfrac{1}{x + 2} - 1$ is the hyperbola $1/x$ with its asymptotes moved to $x = -2$ and $y = -1$.
- $f(2x - 6)$ is $f\\big(2(x - 3)\\big)$: a squeeze by 2 and a shift of 3 to the right — not 6. Factor out $b$ before reading off the shift.

### In physics
A **travelling wave** is a shape moving without changing. If a pulse on a rope is $y = f(x)$ at time 0, then at time $t$ it is $y = f(x - vt)$: the same graph shifted right by $vt$ ([[physics:wave-properties|wave properties]]). A time delay in a signal is a horizontal shift, an amplifier is a vertical stretch, and changing the units of an axis — seconds to milliseconds — is a stretch. Transformations are also [[composition-of-functions|compositions]] with linear functions, which is how they combine.

> [!warn] Inside the bracket everything goes backwards: $+3$ moves left and $\\times 2$ squeezes. Outside, everything does what it says.
`,
  ideas: [
    'Adding $k$ outside moves a graph up; subtracting $h$ inside, $f(x - h)$, moves it right.',
    'A factor $a$ outside stretches vertically; a factor $b$ inside squeezes horizontally by $b$.',
    'A minus sign outside reflects in the $x$-axis; inside, in the $y$-axis.',
    'A point $(x, y)$ moves to $(x/b + h,\\ ay + k)$ under $y = a f(b(x - h)) + k$.'
  ],
  pitfalls: [
    '$f(x + 2)$ moves the graph 2 to the right — It moves it left: the old behaviour at $x = 0$ now happens at $x = -2$.',
    '$f(2x)$ stretches the graph horizontally — It squeezes it by a factor of 2; $f(x/2)$ stretches.',
    'Reading the shift of $f(2x - 6)$ as 6 — Factor first: $f(2(x - 3))$ is shifted by 3.'
  ],
  formulas: [
    {
      name: 'Where a point goes: x-coordinate',
      expr: 'X = x/b + h', tex: 'X = \\frac{x}{b} + h',
      vars: {
        X: { name: 'new x-coordinate', signed: true },
        x: { name: 'x on the original graph', value: 4, signed: true },
        b: { name: 'horizontal factor b', value: 2, signed: true },
        h: { name: 'horizontal shift h', value: 1, signed: true }
      },
      note: 'For $y = a\\,f(b(x - h)) + k$.'
    },
    {
      name: 'Where a point goes: y-coordinate',
      expr: 'Y = a*y + k', tex: 'Y = a\\,y + k',
      vars: {
        Y: { name: 'new y-coordinate', signed: true },
        a: { name: 'vertical factor a', value: 3, signed: true },
        y: { name: 'y on the original graph', value: 2, signed: true },
        k: { name: 'vertical shift k', value: 1, signed: true }
      }
    }
  ],
  examples: [
    {
      title: 'Reading a transformation',
      q: 'Describe $y = -2(x + 1)^2 + 3$ as a transformation of $y = x^2$, and give its vertex.',
      steps: [
        '$(x + 1)^2 = (x - (-1))^2$: shift 1 to the left.',
        'Factor −2 outside: stretch vertically by 2 and reflect in the $x$-axis — the parabola opens downwards.',
        '$+3$: shift up 3. The vertex $(0, 0)$ moves to $(-1, 3)$.'
      ],
      a: 'Left 1, stretched ×2, flipped, up 3; vertex $(-1, 3)$, opening down.'
    },
    {
      title: 'Following one point',
      q: 'The graph of $y = f(x)$ passes through $(4, 2)$. Which point must lie on $y = 3f(2x - 2) + 1$?',
      steps: [
        'Factor the inside: $f(2(x - 1))$, so $b = 2$, $h = 1$, $a = 3$, $k = 1$.',
        '$X = 4/2 + 1 = 3$ and $Y = 3 \\times 2 + 1 = 7$.',
        'Check: at $x = 3$ the input is $2 \\times 3 - 2 = 4$, $f(4) = 2$, and $3 \\times 2 + 1 = 7$.'
      ],
      a: '$(3, 7)$'
    },
    {
      title: 'A travelling pulse',
      q: 'A pulse on a rope has the shape $y = \\mathrm{e}^{-x^2}$ at $t = 0$ and moves at 2 m/s in the $+x$ direction. Where is its peak at $t = 3$ s, and what is its equation?',
      steps: [
        'A shape moving right at speed $v$ is $f(x - vt)$.',
        'So $y = \\mathrm{e}^{-(x - 2t)^2}$; at $t = 3$ s, $y = \\mathrm{e}^{-(x - 6)^2}$.',
        'The peak, where the exponent is zero, is at $x = 6$ m.'
      ],
      a: 'At $x = 6$ m; $y = \\mathrm{e}^{-(x - 6)^2}$'
    }
  ],
  quiz: [
    { q: 'The graph of $y = f(x + 2)$ is the graph of $y = f(x)$ moved…', choices: ['2 up', '2 down', '2 right', '2 left'], a: 3,
      why: 'Inside the bracket, changes work backwards: what happened at $x = 0$ now happens at $x = -2$.' },
    { q: 'Write the equation of $y = x^2$ moved 3 units right and 1 unit up.', answer: '(x - 3)^2 + 1', vars: ['x'],
      why: 'Right by 3 replaces $x$ by $x - 3$; up by 1 adds 1 outside.' },
    { q: 'Compared with $y = f(x)$, the graph of $y = f(2x)$ is…', choices: ['stretched horizontally by 2', 'squeezed horizontally by 2', 'stretched vertically by 2', 'shifted right by 2'], a: 1,
      why: 'Each output is now reached at half the input: the graph is squeezed towards the $y$-axis.' },
    { q: 'Which transformation turns $y = x^3$ into $y = -x^3$?', choices: ['a reflection in the $x$-axis', 'a reflection in the $y$-axis', 'either — for this function they give the same graph', 'a shift'], a: 2,
      why: '$x^3$ is odd, so $-f(x) = f(-x)$: reflecting in either axis gives the same curve.' },
    { q: 'The vertex of $y = 2(x - 5)^2 - 7$ is $(-5, -7)$.', a: false,
      why: '$(x - 5)$ means a shift to the right: the vertex is $(5, -7)$.' }
  ],
  applications: [
    'Vertex form of quadratics and the amplitude, period and phase of waves.',
    'Travelling waves and signals delayed in time.',
    'Changing units or zero points on the axes of a graph.',
    'Fitting a standard curve shape to data by shifting and scaling it.'
  ],
  sim: 'alg-transform'
},

{
  id: 'composition-of-functions', parent: 'functions-topic', title: 'Composition of functions', level: 2,
  short: 'Feeding the output of one function into another, f(g(x)): why the order matters, how domains combine, and how to take a complicated function apart into a chain.',
  keywords: ['composition', 'composite function', 'f(g(x))', 'f of g', 'chain', 'inner function', 'outer function', 'decompose', 'iteration', 'fixed point'],
  prereq: ['functions', 'function-transformations'],
  related: ['chain-rule', 'inverse-functions', 'integration-by-substitution', 'newtons-method'],
  body: `
Feed the output of one function into another and you have a **composition**:
$$(f \\circ g)(x) = f\\big(g(x)\\big)$$
read "$f$ of $g$ of $x$", or "$f$ after $g$": first $g$ acts, then $f$. Picture two machines in a row, the first one's output chute feeding the second one's hopper.

### Order matters
With $f(x) = x^2$ and $g(x) = x + 3$:
$$f\\big(g(x)\\big) = (x + 3)^2, \\qquad g\\big(f(x)\\big) = x^2 + 3$$
These are different functions: at $x = 1$ the first gives 16 and the second 4. Composition is not commutative — putting on socks and then shoes is not the same as shoes and then socks.

### Domains
$f(g(x))$ only makes sense when $g(x)$ lands in the domain of $f$. With $f(x) = \\sqrt x$ and $g(x) = 1 - x^2$, the composite $\\sqrt{1 - x^2}$ needs $1 - x^2 \\ge 0$, so $-1 \\le x \\le 1$ — even though $g$ on its own accepts every $x$.

### Taking functions apart
Seeing a complicated function as a chain of simple ones is a skill of its own. $h(x) = \\sqrt{1 + x^2}$ is $f(g(x))$ with the **inner** function $g(x) = 1 + x^2$ and the **outer** function $f(u) = \\sqrt u$. $\\mathrm{e}^{-kt^2}$ is an exponential of a quadratic; $\\sin(\\omega t + \\varphi)$ is a sine of a linear function. This decomposition is exactly what the [[chain-rule|chain rule]] for derivatives and [[integration-by-substitution|substitution]] in integrals need.

### Transformations are compositions
Every transformation of a graph composes $f$ with a linear function: $f(x - h)$ is $f$ after $x \\mapsto x - h$, and $a f(x) + k$ is $u \\mapsto au + k$ after $f$ ([[function-transformations|transforming graphs]]). That is why changes inside act on the inputs and changes outside on the outputs.

### Repeating a function
Composing a function with itself, $f(f(x))$, $f(f(f(x)))$, … is **iteration**. A year of 5 % interest is the map $x \\mapsto 1.05x$, and ten years iterate it ten times ([[percentages]]). A calculator can find $\\sqrt2$ by iterating $x \\mapsto \\tfrac12(x + 2/x)$: from $x = 1$ it gives 1.5, 1.41667, 1.414216, … — [[newtons-method|Newton's method]]. A value with $f(x) = x$ is a **fixed point**, and $\\sqrt 2$ is the fixed point of that map.

### Chains in physics
Dependence often comes in chains. The kinetic energy of a falling stone depends on its speed, which depends on time: $E(v(t))$. A probe moving along a heated rod reads a temperature that depends on its position, which depends on time. In a chain of amplifiers or filters each stage acts on the output of the one before, and the overall gain is the product of the stage gains — just as the chain rule multiplies rates.

> [!tip] Read $f(g(x))$ from the inside out: work out $g(x)$ first, then apply $f$ to the result.
`,
  ideas: [
    '$(f \\circ g)(x) = f(g(x))$: apply $g$ first, then $f$.',
    'In general $f(g(x)) \\ne g(f(x))$: the order matters.',
    'The composite is defined only where $g(x)$ lies in the domain of $f$.',
    'Spotting the inner and outer functions is the key step of the chain rule.'
  ],
  pitfalls: [
    '$f(g(x))$ means $f(x) \\cdot g(x)$ — Composition feeds one into the other; it is not multiplication.',
    'Applying the functions in the order they are written — In $f(g(x))$ the function written first, $f$, acts last.',
    'Using the domain of $g$ alone — $\\sqrt{1 - x^2}$ is defined only on $[-1, 1]$, although $1 - x^2$ accepts every $x$.'
  ],
  formulas: [
    {
      name: 'Composing two linear functions',
      expr: 'y = a*(c*x + d) + b', tex: 'y = a\\,(c\\,x + d) + b',
      vars: {
        y: { name: 'output of f(g(x))', signed: true },
        a: { name: 'slope of f', value: 2, signed: true },
        c: { name: 'slope of g', value: 3, signed: true },
        x: { name: 'input', value: 2, signed: true },
        d: { name: 'intercept of g', value: -4, signed: true },
        b: { name: 'intercept of f', value: 1, signed: true }
      },
      note: 'With $f(u) = au + b$ and $g(x) = cx + d$, the composite $f(g(x)) = ac\\,x + (ad + b)$ is linear with slope $ac$: slopes multiply, the simplest case of the chain rule.'
    }
  ],
  examples: [
    {
      title: 'Both orders',
      q: 'For $f(x) = 2x - 1$ and $g(x) = x^2$, find $f(g(x))$ and $g(f(x))$, and compare them at $x = 2$.',
      steps: [
        '$f(g(x)) = 2x^2 - 1$.',
        '$g(f(x)) = (2x - 1)^2 = 4x^2 - 4x + 1$.',
        'At $x = 2$: $f(g(2)) = 7$ but $g(f(2)) = 9$.'
      ],
      a: '$2x^2 - 1$ and $4x^2 - 4x + 1$; 7 and 9 at $x = 2$.'
    },
    {
      title: 'Taking functions apart',
      q: 'Write $h(x) = (3x + 1)^5$ and $k(x) = \\dfrac{1}{x^2 + 1}$ as compositions.',
      steps: [
        '$h$: inner $g(x) = 3x + 1$, outer $f(u) = u^5$.',
        '$k$: inner $g(x) = x^2 + 1$, outer $f(u) = 1/u$.',
        'Other splits are possible, but "the last thing you do is the outer function" gives the useful one.'
      ],
      a: '$h = f \\circ g$ with $g = 3x + 1$, $f = u^5$; $k = f \\circ g$ with $g = x^2 + 1$, $f = 1/u$.'
    },
    {
      title: 'A probe on a hot rod',
      q: 'The temperature along a rod is $T(x) = 20 + 5x$ (°C, with $x$ in cm). A probe moves along it with $x(t) = 2t$ (cm, with $t$ in s). What temperature does the probe read at time $t$, and how fast does its reading rise?',
      steps: [
        'Compose: $T(x(t)) = 20 + 5(2t) = 20 + 10t$.',
        'The reading rises at 10 °C/s: 5 °C per cm times 2 cm per s. Rates in a chain multiply — the [[chain-rule|chain rule]] in its simplest form.'
      ],
      a: '$20 + 10t$ °C, rising at 10 °C/s'
    }
  ],
  quiz: [
    { q: '$f(x) = x^2$ and $g(x) = x + 3$. Write $f(g(x))$.', answer: '(x + 3)^2', vars: ['x'],
      why: '$g$ acts first and gives $x + 3$; then $f$ squares it.' },
    { q: 'With the same $f$ and $g$, write $g(f(x))$.', answer: 'x^2 + 3', vars: ['x'],
      why: '$f$ acts first and gives $x^2$; then $g$ adds 3. Different from $f(g(x))$.' },
    { q: '$f(x) = 2x - 1$. Write $f(f(x))$.', answer: '4x - 3', vars: ['x'],
      why: '$f(2x - 1) = 2(2x - 1) - 1 = 4x - 3$.' },
    { q: '$h(x) = \\sqrt{x^2 + 1}$ is $f(g(x))$ with…', choices: ['$f(x) = x^2 + 1$, $g(x) = \\sqrt x$', '$f(x) = \\sqrt x$, $g(x) = x^2 + 1$', '$f(x) = \\sqrt x$, $g(x) = x^2$', '$f(x) = x + 1$, $g(x) = \\sqrt{x^2}$'], a: 1,
      why: 'The last operation is the square root, so it is the outer function; inside it sits $x^2 + 1$. The last option gives $|x| + 1$.' },
    { q: '$f(g(x)) = g(f(x))$ for any two functions $f$ and $g$.', a: false,
      why: 'With $f(x) = x^2$ and $g(x) = x + 3$, at $x = 1$ one gives 16 and the other 4. Some pairs do commute — a function and its inverse, for instance — but not in general.' }
  ],
  applications: [
    'The chain rule and substitution in calculus.',
    'Signal chains: sensors, amplifiers and filters in series.',
    'Iterative algorithms and repeated growth.',
    'Unit conversions done in stages.'
  ]
},

{
  id: 'inverse-functions', parent: 'functions-topic', title: 'Inverse functions', level: 2,
  short: 'The function that undoes another: when it exists (one-to-one), how to find it (swap and solve), and why its graph is the mirror image in the line y = x.',
  keywords: ['inverse function', 'f inverse', 'one-to-one', 'injective', 'horizontal line test', 'restrict the domain', 'reflection in y = x', 'undo', 'swap x and y'],
  prereq: ['functions', 'composition-of-functions'],
  related: ['logarithms', 'inverse-trig', 'exponential-functions', 'matrix-inverse', 'linear-equations'],
  body: `
An **inverse function** undoes what a function does. If $f$ turns 3 into 7, then $f^{-1}$ turns 7 back into 3:
$$f^{-1}\\big(f(x)\\big) = x \\qquad\\text{and}\\qquad f\\big(f^{-1}(y)\\big) = y$$
Converting Celsius to Fahrenheit, $F = 1.8C + 32$, is undone by $C = (F - 32)/1.8$; squaring a positive number is undone by the square root; $10^x$ is undone by $\\log_{10} x$ ([[logarithms]]); $\\sin$, on a suitable interval, by $\\arcsin$.

### Which functions have inverses?
An inverse must send each output back to **one** input, so $f$ must never give the same output twice: it must be **one-to-one**. On a graph this is the **horizontal-line test** — no horizontal line may cross the graph more than once. $x^3$ passes. $x^2$ fails, because $2^2 = (-2)^2 = 4$: asked to undo 4, an inverse would not know whether to answer 2 or −2.

The cure is to **restrict the domain**. Keep only $x \\ge 0$ and $x^2$ becomes one-to-one, with inverse $\\sqrt x$. The same trick defines the [[inverse-trig|inverse trigonometric functions]]: $\\arcsin$ undoes $\\sin$ only on $-\\tfrac{\\pi}{2} \\le x \\le \\tfrac{\\pi}{2}$.

### Finding an inverse
Write $y = f(x)$, solve for $x$, then rename the variables. For $f(x) = \\dfrac{2x + 1}{x - 3}$:
$$y(x - 3) = 2x + 1 \\;\\Rightarrow\\; xy - 2x = 3y + 1 \\;\\Rightarrow\\; x = \\frac{3y + 1}{y - 2}$$
so $f^{-1}(x) = \\dfrac{3x + 1}{x - 2}$. Check: $f(0) = -\\tfrac13$, and $f^{-1}(-\\tfrac13) = \\dfrac{0}{-7/3} = 0$.

### The mirror picture
Swapping inputs and outputs swaps the coordinates of every point: $(a, b)$ on the graph of $f$ becomes $(b, a)$ on the graph of $f^{-1}$. So the two graphs are **mirror images in the line $y = x$**, and the domain of one is the range of the other. The exponential $2^x$, defined for every $x$ with only positive values, mirrors into $\\log_2 x$, defined only for positive $x$.

### A warning about notation
$f^{-1}(x)$ is the inverse function, **not** $1/f(x)$. The inverse of $f(x) = 2x$ is $x/2$, whereas $1/f(x) = 1/(2x)$. Awkwardly, $\\sin^2 x$ does mean $(\\sin x)^2$, while $\\sin^{-1} x$ means $\\arcsin x$.

### Why inverses matter
Every time you rearrange a formula to find a different quantity you use an inverse: the time from a distance, a temperature from a thermocouple voltage, the age of a sample from its remaining carbon-14 ([[physics:radiocarbon-dating|radiocarbon dating]]). Instruments are calibrated as a function from true value to reading and used through its inverse, from reading to true value. Composing a function with its inverse in either order gives back the input — one of the few cases where [[composition-of-functions|composition]] does not depend on the order.
`,
  ideas: [
    'The inverse undoes the function: $f^{-1}(f(x)) = x$.',
    'Only one-to-one functions have inverses — the horizontal-line test; restricting the domain can make a function one-to-one.',
    'To find $f^{-1}$, solve $y = f(x)$ for $x$.',
    'The graph of $f^{-1}$ is the reflection of the graph of $f$ in the line $y = x$; domain and range swap.'
  ],
  pitfalls: [
    '$f^{-1}(x) = \\dfrac{1}{f(x)}$ — The $-1$ is not a power here. For $f(x) = x + 3$, $f^{-1}(x) = x - 3$ while $1/f(x) = 1/(x + 3)$.',
    'Every function has an inverse — Only one-to-one ones do. $x^2$ on all real numbers has none; on $x \\ge 0$ it has $\\sqrt x$.',
    'Reflecting in the $x$-axis instead of the line $y = x$ — The inverse swaps $x$ and $y$; reflecting in an axis only changes a sign.'
  ],
  examples: [
    {
      title: 'Inverse of a cubic',
      q: 'Find the inverse of $f(x) = x^3 + 1$ and check it.',
      steps: [
        'Write $y = x^3 + 1$, so $x^3 = y - 1$ and $x = \\sqrt[3]{y - 1}$.',
        'Rename: $f^{-1}(x) = \\sqrt[3]{x - 1}$. Cubes are one-to-one, so no restriction is needed.',
        'Check: $f(2) = 9$ and $f^{-1}(9) = \\sqrt[3]{8} = 2$.'
      ],
      a: '$f^{-1}(x) = \\sqrt[3]{x - 1}$'
    },
    {
      title: 'Restricting the domain',
      q: 'Find the inverse of $f(x) = (x - 2)^2 + 1$ on the domain $x \\ge 2$.',
      steps: [
        '$y - 1 = (x - 2)^2$. Because $x \\ge 2$, take the positive root: $x - 2 = \\sqrt{y - 1}$.',
        'So $f^{-1}(x) = 2 + \\sqrt{x - 1}$.',
        'Domain of $f^{-1}$: $x \\ge 1$ (the range of $f$). Range of $f^{-1}$: $y \\ge 2$ (the domain of $f$).'
      ],
      a: '$f^{-1}(x) = 2 + \\sqrt{x - 1}$ for $x \\ge 1$'
    },
    {
      title: 'Using a sensor backwards',
      q: 'A temperature sensor outputs $V = 0.5 + 0.02\\,T$ volts at $T$ °C. What temperature does a reading of 1.1 V mean?',
      steps: [
        'Invert: $T = \\dfrac{V - 0.5}{0.02} = 50V - 25$.',
        '$T = 50 \\times 1.1 - 25 = 30$.'
      ],
      a: '30 °C'
    }
  ],
  quiz: [
    { q: 'Find the inverse of $f(x) = 3x - 4$.', answer: '(x + 4)/3', vars: ['x'],
      why: 'From $y = 3x - 4$: $x = (y + 4)/3$. Undo in reverse order: add 4, then divide by 3.' },
    { q: 'Find the inverse of $f(x) = \\dfrac{x}{x + 1}$.', answer: 'x/(1 - x)', vars: ['x'],
      why: '$y(x + 1) = x$ gives $x(y - 1) = -y$, so $x = \\dfrac{y}{1 - y}$.' },
    { q: 'For $f(x) = 2x$, $f^{-1}(x)$ is…', choices: ['$\\dfrac{1}{2x}$', '$\\dfrac{x}{2}$', '$-2x$', '$2^{-x}$'], a: 1,
      why: 'The inverse undoes doubling, which is halving. $\\tfrac{1}{2x}$ is the reciprocal, a different thing.' },
    { q: '$f(x) = x^2$, defined for all real $x$, has an inverse function.', a: false,
      why: 'It fails the horizontal-line test: 3 and −3 both give 9. Restricted to $x \\ge 0$ it has the inverse $\\sqrt x$.' },
    { q: 'The point $(2, 9)$ lies on the graph of a one-to-one function $f$. Which point lies on the graph of $f^{-1}$?', choices: ['$(-2, -9)$', '$(9, 2)$', '$(2, \\tfrac19)$', '$(\\tfrac12, 9)$'], a: 1,
      why: '$f(2) = 9$ means $f^{-1}(9) = 2$: the coordinates swap.' }
  ],
  applications: [
    'Rearranging formulas to find a different quantity.',
    'Using calibration curves backwards: reading to true value.',
    'Logarithms as inverses of exponentials, arcsine as the inverse of sine.',
    'Decoding: every encryption or encoding scheme needs an inverse to read the message.'
  ],
  sim: { id: 'alg-log-mirror', params: { fn: 'sqr' } }
}

);
