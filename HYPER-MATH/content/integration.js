/* HYPER-MATH · content/integration.js — integrals: antiderivatives, Riemann sums,
 * the definite integral, the fundamental theorem, techniques and numerics. */
Hyper.add(

{
  id: 'antiderivatives', parent: 'integration', title: 'Antiderivatives', level: 1,
  short: 'Running differentiation backwards: a function whose derivative is the one you were given, determined up to an added constant.',
  keywords: ['antiderivative', 'indefinite integral', 'primitive', 'constant of integration', '+C', 'integral table', 'initial condition', 'reverse differentiation'],
  prereq: ['derivative', 'derivatives-of-functions'],
  related: ['fundamental-theorem', 'definite-integral', 'integration-by-substitution', 'differential-equations-intro', 'physics:constant-acceleration', 'physics:motion-graphs'],
  body: `
Differentiation turns position into velocity. Very often we need the reverse: we know the velocity, or the acceleration, or a rate of growth, and want the quantity itself. A function $F$ with $F'(x) = f(x)$ is an **antiderivative** of $f$.

For $f(x) = 2x$, one antiderivative is $x^2$. But so are $x^2 + 5$ and $x^2 - 17$: adding a constant changes the height of a graph, never its slope. In fact every antiderivative of $2x$ is $x^2 + C$ for some constant $C$ (on an interval, two functions with the same derivative differ by a constant). We write the whole family as an **indefinite integral**:

$$\\int 2x\\,dx = x^2 + C.$$

Picture the family as the same curve stacked at every height. To pick out one member you need one extra fact, an **initial condition** such as "$F(0) = 3$".

### A table, read backwards
| $f(x)$ | $\\int f(x)\\,dx$ |
|---|---|
| $x^n$ ($n \\ne -1$) | $\\dfrac{x^{n+1}}{n+1} + C$ |
| $1/x$ | $\\ln\\lvert x\\rvert + C$ |
| $e^{kx}$ | $\\dfrac{1}{k}e^{kx} + C$ |
| $\\sin kx$ | $-\\dfrac1k\\cos kx + C$ |
| $\\cos kx$ | $\\dfrac1k\\sin kx + C$ |
| $\\dfrac{1}{1 + x^2}$ | $\\arctan x + C$ |

Every entry can be checked by differentiating the answer, and you should: it is the one integration step that can always be verified. The power rule runs backwards by raising the power by one and dividing by the new power; its single exception, $n = -1$, is filled by the logarithm.

Like differentiation, antidifferentiation is linear, so sums and constant multiples can be handled term by term. But there is **no product rule** and no chain rule to apply mechanically; instead there are techniques ([[integration-by-substitution|substitution]], [[integration-by-parts|parts]], [[partial-fractions|partial fractions]]) and sometimes nothing works at all. $e^{-x^2}$, central to statistics, has no antiderivative made of elementary functions; its antiderivative is simply given a name, the error function.

### From acceleration to position
Near the ground a thrown ball has acceleration $a = -g$. One antiderivative gives the velocity, with the constant fixed by the launch speed:
$$v(t) = v_0 - g t.$$
A second gives the position, with the launch height as the constant:
$$y(t) = y_0 + v_0 t - \\tfrac12 g t^2.$$
These are the [[physics:constant-acceleration|equations of constant acceleration]], derived rather than memorised. Solving any [[differential-equations-intro|differential equation]] is, at heart, a sophisticated search for antiderivatives.
`,
  ideas: [
    'F is an antiderivative of f when F′ = f.',
    'Antiderivatives of the same function differ by a constant: write + C.',
    'An initial condition such as F(0) = 3 fixes the constant.',
    'Check any antiderivative by differentiating it.',
    'Integrating acceleration twice, with the initial velocity and position as constants, gives the equations of motion.'
  ],
  pitfalls: [
    'Forgetting + C — Without it you have one antiderivative, not all of them, and initial-value problems come out wrong.',
    '∫ x⁻¹ dx = x⁰/0 — The power rule fails for n = −1; the answer is ln|x| + C.',
    '∫ f g dx = (∫ f dx)(∫ g dx) — There is no product rule for integrals: ∫ x · x dx = x³/3, not (x²/2)².'
  ],
  examples: [
    {
      title: 'Term by term',
      q: 'Find $\\displaystyle\\int (6x^2 - 4x + 5)\\,dx$.',
      steps: [
        'Raise each power by one and divide by the new power: $6\\cdot\\dfrac{x^3}{3} - 4\\cdot\\dfrac{x^2}{2} + 5x$.',
        'So the integral is $2x^3 - 2x^2 + 5x + C$.',
        'Check: the derivative of $2x^3 - 2x^2 + 5x$ is $6x^2 - 4x + 5$.'
      ],
      a: '2x³ − 2x² + 5x + C'
    },
    {
      title: 'Fixing the constant',
      q: 'Find $f$ if $f\'(x) = 3x^2 + 2$ and $f(1) = 5$.',
      steps: [
        'Antidifferentiate: $f(x) = x^3 + 2x + C$.',
        'Use the condition: $f(1) = 1 + 2 + C = 5$, so $C = 2$.'
      ],
      a: 'f(x) = x³ + 2x + 2'
    },
    {
      title: 'A braking car',
      q: 'A car at 30 m/s brakes with a steady deceleration of 6 m/s². How long does it take to stop, and how far does it travel?',
      steps: [
        'Acceleration $a = -6$. Antidifferentiate: $v(t) = -6t + C$, and $v(0) = 30$ gives $v = 30 - 6t$.',
        'It stops when $v = 0$: $t = 5\\ \\mathrm{s}$.',
        'Antidifferentiate again with $x(0) = 0$: $x(t) = 30t - 3t^2$. At $t = 5$: $x = 150 - 75 = 75\\ \\mathrm{m}$.'
      ],
      a: '5 s and 75 m'
    }
  ],
  quiz: [
    { q: 'Find the antiderivative of $3x^2 + 4x$ that is 0 at $x = 0$.', answer: 'x^3 + 2x^2', vars: ['x'],
      why: 'Power rule backwards on each term; the condition at 0 makes the constant zero.' },
    { q: 'Find the antiderivative of $\\cos 2x$ that is 0 at $x = 0$.', answer: 'sin(2x)/2', vars: ['x'],
      why: 'The derivative of $\\sin 2x$ is $2\\cos 2x$, so divide by 2. Check: $\\tfrac12\\sin 0 = 0$.' },
    { q: 'Find the antiderivative of $e^{3x}$ whose value at $x = 0$ is $\\tfrac13$.', answer: 'e^(3x)/3', vars: ['x'],
      why: '$\\frac{d}{dx}\\tfrac13 e^{3x} = e^{3x}$, and at 0 it equals $\\tfrac13$, so no extra constant is needed.' },
    { q: 'Two antiderivatives of the same function on an interval…', choices: ['are equal', 'differ by a constant', 'differ by a multiple of x', 'can be completely different'], a: 1,
      why: 'Their difference has derivative zero everywhere on the interval, so it is constant.' },
    { q: '$\\displaystyle\\int \\frac{1}{x}\\,dx = \\frac{x^0}{0} + C$.', a: false,
      why: 'The power rule excludes $n = -1$. The answer is $\\ln|x| + C$.' }
  ],
  applications: [
    'Velocity from acceleration, position from velocity: the equations of motion.',
    'Total amount from a rate: charge from current, volume from flow rate, energy from power.',
    'Solving differential equations, from population growth to radioactive decay.'
  ],
  sim: 'calc-ftc'
},

{
  id: 'riemann-sums', parent: 'integration', title: 'Riemann sums', level: 1,
  short: 'Approximating the area under a curve by adding up thin rectangles: left, right and midpoint sums, which close in on the exact area as the strips get thinner.',
  keywords: ['Riemann sum', 'left sum', 'right sum', 'midpoint sum', 'rectangles', 'area under a curve', 'sigma notation', 'partition', 'approximation'],
  prereq: ['area', 'functions', 'arithmetic-series'],
  related: ['definite-integral', 'numerical-integration', 'fundamental-theorem', 'physics:work', 'physics:motion-graphs'],
  body: `
A car's speedometer is read every 10 seconds. How far did the car go? If the speed were constant, distance would be speed times time, the area of a rectangle under a flat line on a speed–time graph. It is not constant, but over each short interval it is *nearly* constant, so we add up many thin rectangles. That is a **Riemann sum**.

### The recipe
Split $[a, b]$ into $n$ strips of width $\\Delta x = (b - a)/n$. In each strip pick a sample point $x_i^*$, and add up height times width:

$$S_n = \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x.$$

The choice of sample point gives the common versions:
- **left sum**: the left end of each strip;
- **right sum**: the right end;
- **midpoint sum**: the middle, usually much more accurate.

### An example: $x^2$ on $[0, 1]$
With $n = 4$ strips of width $\\tfrac14$:
- left: $\\tfrac14\\left(0 + \\tfrac1{16} + \\tfrac4{16} + \\tfrac9{16}\\right) = 0.21875$,
- right: $\\tfrac14\\left(\\tfrac1{16} + \\tfrac4{16} + \\tfrac9{16} + 1\\right) = 0.46875$,
- midpoint: $0.328125$.

The true area is $\\tfrac13$. Because $x^2$ is increasing, left rectangles sit below the curve and underestimate, right ones overestimate. For $n$ strips the right sum works out, using $1^2 + 2^2 + \\cdots + n^2 = \\tfrac16 n(n+1)(2n+1)$, as
$$S_n = \\frac{(n + 1)(2n + 1)}{6n^2} = \\frac13 + \\frac{1}{2n} + \\frac{1}{6n^2} \\;\\to\\; \\frac13.$$
The limit of the sums is the exact area: that is the definition of the [[definite-integral|definite integral]].

### How fast they converge
The left and right sums have errors that shrink like $1/n$: doubling the number of strips halves the error. The midpoint sum's error shrinks like $1/n^2$, because within each strip its over- and under-estimates largely cancel. The simulation plots the error against $n$ on logarithmic axes, where these rates appear as straight lines of slope $-1$ and $-2$. Better rules still are in [[numerical-integration]].

### Signed area
Where $f$ is negative the rectangles have negative height and **subtract**. A Riemann sum measures signed area, which is what physics needs: a velocity that is negative for a while means going backwards, and the sum of $v\\,\\Delta t$ gives the net displacement.

### Everywhere in physics
Distance from speed samples, [[physics:work|work]] from a force that varies along the path ($W \\approx \\sum F_i\\,\\Delta x$), charge from a current reading, energy from a power meter: each is a Riemann sum, and each becomes an integral in the limit.
`,
  ideas: [
    'A Riemann sum adds up f(sample point) × strip width over all strips.',
    'Left, right and midpoint sums differ in where each strip is sampled.',
    'For an increasing function, left sums underestimate and right sums overestimate.',
    'As the strips get thinner, the sums converge to the definite integral.',
    'Parts below the axis count negative: the sum measures signed area.'
  ],
  pitfalls: [
    'More strips always means exact — More strips means smaller error, but a finite sum is still an approximation (except in special cases).',
    'The left sum is always too small — Only for increasing functions; for decreasing ones it overestimates.',
    'Riemann sums are only about geometry — They are how every accumulated quantity (distance, work, charge) is computed from rates.'
  ],
  formulas: [
    {
      name: 'Right Riemann sum for x² on [0, b]',
      expr: 'S = b^3*(n + 1)*(2*n + 1)/(6*n^2)', tex: 'S = b^3\\,\\frac{(n + 1)(2n + 1)}{6n^2}',
      vars: {
        S: { name: 'right sum' },
        b: { name: 'right end b', value: 1 },
        n: { name: 'number of strips', value: 4, int: true }
      },
      note: 'The exact area is $b^3/3$; the right sum exceeds it by $b^3\\left(\\frac1{2n} + \\frac1{6n^2}\\right)$.',
      stories: { S: 'Estimate the area under $y = x^2$ from 0 to {b} with a right Riemann sum of {n} strips.' }
    }
  ],
  examples: [
    {
      title: 'Three sums for one area',
      q: 'Estimate $\\displaystyle\\int_0^1 x^2\\,dx$ with left, right and midpoint sums using 4 strips.',
      steps: [
        'Width $\\Delta x = 0.25$. Left endpoints $0, 0.25, 0.5, 0.75$; right endpoints $0.25, \\ldots, 1$; midpoints $0.125, 0.375, 0.625, 0.875$.',
        'Left: $0.25(0 + 0.0625 + 0.25 + 0.5625) = 0.21875$.',
        'Right: $0.25(0.0625 + 0.25 + 0.5625 + 1) = 0.46875$.',
        'Midpoint: $0.25(0.015625 + 0.140625 + 0.390625 + 0.765625) = 0.328125$, within 2% of the true $\\tfrac13$.'
      ],
      a: 'Left 0.219, right 0.469, midpoint 0.328 (exact 0.333)'
    },
    {
      title: 'Distance from a speedometer',
      q: 'A car\'s speed is logged every 10 s: 0, 12, 20, 25 and 28 m/s. Estimate the distance covered in those 40 s.',
      steps: [
        'Left sum (speeds at the start of each interval): $10(0 + 12 + 20 + 25) = 570\\ \\mathrm{m}$.',
        'Right sum: $10(12 + 20 + 25 + 28) = 850\\ \\mathrm{m}$.',
        'The car is speeding up, so the truth lies between. Their average, the trapezoid estimate, is $710\\ \\mathrm{m}$.'
      ],
      a: 'Between 570 m and 850 m; about 710 m.'
    }
  ],
  quiz: [
    { q: 'For an increasing function, the left Riemann sum is…', choices: ['an overestimate', 'an underestimate', 'exact', 'impossible to say'], a: 1,
      why: 'Each rectangle takes the height at the lowest point of its strip, so it sits below the curve.' },
    { q: 'The midpoint sum with 2 strips for $\\int_0^2 x^2\\,dx$ is…', choices: ['2', '2.5', '2.667', '5'], a: 1,
      why: 'Midpoints 0.5 and 1.5, width 1: $0.25 + 2.25 = 2.5$. The exact value is $8/3 \\approx 2.667$.' },
    { q: 'A Riemann sum can be negative.', a: true,
      why: 'Where $f < 0$ the rectangles have negative heights. The sum measures signed area.' },
    { q: 'For a smooth function, the error of the left Riemann sum shrinks roughly like…', choices: ['$1/n$', '$1/n^2$', '$1/n^4$', 'it does not shrink'], a: 0,
      why: 'Each strip is off by about half its width times the change in height, and adding $n$ of them leaves an error proportional to $1/n$. Midpoints do better: $1/n^2$.' }
  ],
  applications: [
    'Distance from sampled speeds, energy from sampled power, dose from sampled dose rates.',
    'Work done by a varying force, estimated from force readings along the path.',
    'The basis of every numerical integration routine.'
  ],
  sim: { id: 'calc-riemann', params: { method: 'left' } }
},

{
  id: 'definite-integral', parent: 'integration', title: 'The definite integral', level: 2,
  short: 'The exact signed area under a curve between two limits, defined as the limit of Riemann sums: the total accumulated by a rate over an interval.',
  keywords: ['definite integral', 'integral', 'signed area', 'limits of integration', 'integrand', 'area under a curve', 'accumulation', 'properties of integrals'],
  prereq: ['riemann-sums', 'limits'],
  related: ['fundamental-theorem', 'area-between-curves', 'average-value', 'improper-integrals', 'physics:work', 'physics:impulse'],
  body: `
Take Riemann sums with ever thinner strips. For any reasonable function (continuous, or with a few jumps) they all settle on the same number, whichever sample points you use. That number is the **definite integral**:

$$\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty}\\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x.$$

The notation remembers where it came from: the elongated S, $\\int$, is Leibniz's "summa", $f(x)\\,dx$ is the area of one infinitely thin strip, and $a$ and $b$ are the **limits of integration**. The variable $x$ is a dummy: $\\int_a^b f(t)\\,dt$ is the same number.

### Signed area
The integral counts area above the axis as positive and area below as negative. For $\\int_0^3 (2x - 2)\\,dx$ the line is below the axis from 0 to 1 (a triangle of area 1) and above from 1 to 3 (a triangle of area 4), so the integral is $4 - 1 = 3$. If you want the total area regardless of sign, integrate $|f|$.

Some integrals can be read straight from geometry: $\\int_{-2}^{2}\\sqrt{4 - x^2}\\,dx$ is the area of a half-disc of radius 2, namely $2\\pi$.

### Properties
| Property | Statement |
|---|---|
| Linearity | $\\int_a^b (f + g) = \\int_a^b f + \\int_a^b g$ and $\\int_a^b cf = c\\int_a^b f$ |
| Joining intervals | $\\int_a^b f + \\int_b^c f = \\int_a^c f$ |
| Reversing limits | $\\int_b^a f = -\\int_a^b f$, and $\\int_a^a f = 0$ |
| Comparison | if $f \\le g$ on $[a, b]$ then $\\int_a^b f \\le \\int_a^b g$ |
| Bounds | $m(b - a) \\le \\int_a^b f \\le M(b - a)$ if $m \\le f \\le M$ |
| Symmetry | an odd function integrates to 0 over $[-a, a]$ |

Computing integrals from the definition is laborious; the [[fundamental-theorem|fundamental theorem of calculus]] turns it into antidifferentiation.

### Units and meaning
The integral has the units of $f$ times the units of $x$, and it means **the total accumulated**:
- $\\int v\\,dt$ is the displacement (m/s × s = m), the area under a velocity–time graph;
- $\\int F\\,dx$ is the [[physics:work|work]] done by a varying force (N × m = J);
- $\\int F\\,dt$ is the [[physics:impulse|impulse]], the change in momentum;
- $\\int P\\,dt$ is energy: a 2 kW heater for 3 hours uses 6 kWh;
- $\\int I\\,dt$ is the charge delivered by a current;
- $\\int \\rho\\,dV$ is a mass, $\\int p\\,dA$ a force on a dam wall.

Whenever a rate or a density must be added up over time, space or anything else, a definite integral appears.
`,
  ideas: [
    'The definite integral is the limit of Riemann sums: exact signed area.',
    'Area below the axis counts negatively.',
    'Its units are those of f times those of x; it measures a total.',
    'Integrals are linear, add over adjoining intervals, and change sign when the limits are swapped.',
    'Odd functions integrate to zero over symmetric intervals.'
  ],
  pitfalls: [
    'The integral is always the area between the graph and the axis — It is the signed area; parts below the axis subtract.',
    'An integral of zero means the function is zero — sin x on [0, 2π] integrates to 0 while being far from zero.',
    'dx is decoration — It names the variable of integration and carries its units: the integral of a force over dx is work, over dt it is impulse.'
  ],
  formulas: [
    {
      name: 'Signed area under a straight line',
      expr: 'I = m*(b^2 - a^2)/2 + c*(b - a)', tex: 'I = \\frac{m}{2}\\left(b^2 - a^2\\right) + c\\,(b - a)',
      vars: {
        I: { name: 'integral of mx + c from a to b', signed: true },
        m: { name: 'slope m', value: 2, signed: true },
        c: { name: 'intercept c', value: -2, signed: true },
        a: { name: 'lower limit a', value: 2, signed: true },
        b: { name: 'upper limit b', value: 3, signed: true }
      },
      note: 'The trapezium (or two triangles) under $y = mx + c$, with parts below the axis counted negative.'
    }
  ],
  examples: [
    {
      title: 'Signed area from geometry',
      q: 'Evaluate $\\displaystyle\\int_0^3 (2x - 2)\\,dx$ by drawing the graph.',
      steps: [
        'The line crosses zero at $x = 1$. From 0 to 1 it forms a triangle below the axis with base 1 and height 2: area 1, counted as $-1$.',
        'From 1 to 3: a triangle above the axis with base 2 and height 4: area 4.',
        'Signed total: $4 - 1 = 3$. (The total unsigned area would be 5.)'
      ],
      a: '3'
    },
    {
      title: 'A half-disc',
      q: 'Evaluate $\\displaystyle\\int_{-2}^{2}\\sqrt{4 - x^2}\\,dx$.',
      steps: [
        '$y = \\sqrt{4 - x^2}$ means $x^2 + y^2 = 4$ with $y \\ge 0$: the upper half of a circle of radius 2.',
        'The integral is the half-disc area: $\\tfrac12\\pi(2)^2 = 2\\pi \\approx 6.283$.'
      ],
      a: '2π'
    },
    {
      title: 'Energy from a power profile',
      q: 'An electric car charger delivers 7 kW for 2 hours, then its power falls steadily to zero over the next hour. How much energy is delivered?',
      steps: [
        'The power–time graph is a rectangle followed by a triangle.',
        'Rectangle: $7\\ \\mathrm{kW} \\times 2\\ \\mathrm{h} = 14\\ \\mathrm{kWh}$. Triangle: $\\tfrac12 \\times 7 \\times 1 = 3.5\\ \\mathrm{kWh}$.',
        'Total $\\int P\\,dt = 17.5\\ \\mathrm{kWh}$, enough for roughly 100 km of driving.'
      ],
      a: '17.5 kWh'
    }
  ],
  quiz: [
    { q: '$\\displaystyle\\int_{-1}^{1} x^3\\,dx = $', choices: ['0', '1/2', '1/4', '2'], a: 0,
      why: '$x^3$ is odd: the area to the left of 0 is exactly cancelled by the area to the right.' },
    { q: 'If $\\int_0^2 f = 5$ and $\\int_2^5 f = -3$, then $\\int_0^5 f = $', choices: ['8', '2', '−2', '−15'], a: 1,
      why: 'Adjoining intervals add: $5 + (-3) = 2$.' },
    { q: '$\\int_a^b f(x)\\,dx$ always equals the area between the graph of $f$ and the $x$-axis.', a: false,
      why: 'Parts below the axis count negatively. The geometric area is $\\int_a^b |f(x)|\\,dx$.' },
    { q: '$\\int_3^1 f(x)\\,dx$ equals…', choices: ['$\\int_1^3 f(x)\\,dx$', '$-\\int_1^3 f(x)\\,dx$', '0', '$\\int_1^3 -f(-x)\\,dx$'], a: 1,
      why: 'Swapping the limits reverses the direction of the strips, so the sign flips.' },
    { q: 'A force in newtons is integrated over a distance in metres. The result is measured in…', choices: ['N', 'N/m', 'J', 'W'], a: 2,
      why: 'N × m = J: the integral of force over distance is work.' }
  ],
  applications: [
    'Work, energy, impulse, charge, mass: totals of rates and densities.',
    'Hydrostatic force on dams and hull plates.',
    'Probabilities as areas under probability density curves.'
  ],
  sim: { id: 'calc-riemann', params: { method: 'mid' } }
},

{
  id: 'fundamental-theorem', parent: 'integration', title: 'The fundamental theorem of calculus', level: 2,
  short: 'Differentiation and integration undo each other: the area function of f has derivative f, and a definite integral is the change in any antiderivative.',
  keywords: ['fundamental theorem of calculus', 'FTC', 'area function', 'accumulation function', 'evaluate integral', 'antiderivative', 'net change theorem', 'F(b) − F(a)'],
  prereq: ['definite-integral', 'antiderivatives', 'derivative'],
  related: ['integration-by-substitution', 'average-value', 'area-between-curves', 'physics:work-energy-theorem', 'physics:motion-graphs'],
  body: `
Slopes and areas look like unrelated problems: one is about a single point, the other about a whole interval. The fundamental theorem of calculus says they are two sides of one coin, and it turns the hard problem of computing areas into the easier one of finding antiderivatives.

### Part 1: the area function grows at the rate f
Fix a starting point $a$ and let the end $x$ move. The area accumulated so far,
$$A(x) = \\int_a^x f(t)\\,dt,$$
is a function of $x$. Move $x$ on by a tiny $h$ and the area gains a thin strip of width $h$ and height about $f(x)$, so $A(x + h) - A(x) \\approx f(x)\\,h$. Dividing by $h$ and letting it shrink:
$$\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x).$$
The rate at which area piles up is the height of the curve at the moving edge. Filling a bath works the same way: the rate at which the volume grows is the flow from the tap.

### Part 2: evaluating integrals
Since $A$ is an antiderivative of $f$, and any other antiderivative $F$ differs from it by a constant, we get
$$\\int_a^b f(x)\\,dx = F(b) - F(a) = \\Big[F(x)\\Big]_a^b.$$
The whole limit of Riemann sums collapses to two function values. For example
$$\\int_0^1 x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^1 = \\frac13,$$
the value the Riemann sums crawled towards, and $\\int_0^\\pi \\sin x\\,dx = [-\\cos x]_0^\\pi = 1 - (-1) = 2$: one arch of the sine curve has an area of exactly 2.

### The net change theorem
Read backwards, part 2 says: **integrating a rate of change gives the total change**,
$$\\int_a^b F'(t)\\,dt = F(b) - F(a).$$
- Integrate velocity and you get displacement, $x(b) - x(a)$ (see [[physics:motion-graphs|motion graphs]]).
- Integrate a force along a path and you get the change in kinetic energy: the [[physics:work-energy-theorem|work–energy theorem]].
- Integrate the flow into a reservoir and you get the change in stored volume.

### A variable upper limit
Combined with the [[chain-rule|chain rule]], part 1 handles limits that are functions:
$$\\frac{d}{dx}\\int_0^{x^2}\\cos t\\,dt = \\cos(x^2)\\cdot 2x.$$
It also guarantees that every continuous function has an antiderivative, even when no formula for it exists: $\\int_0^x e^{-t^2}\\,dt$ is a perfectly good function (proportional to the error function), whose derivative is $e^{-x^2}$.

> [!tip] In the simulation, press **Play** and compare the height of $f$ with the slope of the area graph below it. Then move the start $a$ and watch the area graph slide up and down: that is the $+C$.
`,
  ideas: [
    'The area function A(x) = ∫ₐˣ f(t) dt has derivative f(x).',
    '∫ₐᵇ f dx = F(b) − F(a) for any antiderivative F.',
    'Integrating a rate of change gives the net change of the quantity.',
    'Changing the starting point of the area function adds a constant.',
    'Every continuous function has an antiderivative.'
  ],
  pitfalls: [
    'F(b) − F(a) is the area whatever f does — It is the signed area; if f dips below the axis, those parts subtract.',
    'The constant C matters in a definite integral — It cancels in F(b) − F(a), so any antiderivative will do.',
    'd/dx ∫₀^(x²) f(t) dt = f(x²) — The upper limit moves at rate 2x, so the chain rule gives f(x²) · 2x.'
  ],
  formulas: [
    {
      name: 'Integral of a power',
      expr: 'I = (b^(n + 1) - a^(n + 1))/(n + 1)', tex: 'I = \\frac{b^{n+1} - a^{n+1}}{n + 1}',
      vars: {
        I: { name: 'integral of xⁿ from a to b', signed: true },
        a: { name: 'lower limit a (≥ 0)', value: 1 },
        b: { name: 'upper limit b', value: 3 },
        n: { name: 'power n (not −1)', value: 2, signed: true }
      },
      note: 'The fundamental theorem with the antiderivative $x^{n+1}/(n+1)$. For $n = -1$ use $\\ln(b/a)$ instead.'
    },
    {
      name: 'Energy from a sine-shaped power curve',
      expr: 'E = 2*Pm*T/pi', tex: 'E = \\frac{2P_{\\max}T}{\\pi}',
      vars: {
        E: { name: 'energy delivered', q: 'energy', unit: 'kWh' },
        Pm: { name: 'peak power', tex: 'P_{\\max}', q: 'power', unit: 'W', value: 300 },
        T: { name: 'length of the day (sunrise to sunset)', q: 'time', unit: 'h', value: 12 }
      },
      note: 'For $P(t) = P_{\\max}\\sin(\\pi t/T)$ on $[0, T]$: $\\int_0^T P\\,dt = P_{\\max}\\,\\frac{T}{\\pi}\\big[-\\cos(\\pi t/T)\\big]_0^T = \\frac{2P_{\\max}T}{\\pi}$. A solar panel on a clear day follows this shape roughly.',
      stories: { E: 'A solar panel\'s output rises and falls like a sine arch, peaking at {Pm}, over a day of {T}. How much energy does it produce?' }
    }
  ],
  derivation: {
    title: 'Why the area function has derivative f',
    steps: [
      { text: 'By joining intervals, the extra area from $x$ to $x + h$ is', tex: 'A(x + h) - A(x) = \\int_x^{x+h} f(t)\\,dt' },
      { text: 'On that short interval $f$ lies between its smallest value $m_h$ and largest value $M_h$, so the strip is squeezed between two rectangles:', tex: 'm_h\\,h \\le \\int_x^{x+h} f(t)\\,dt \\le M_h\\,h' },
      { text: 'Divide by $h$. As $h \\to 0$ both $m_h$ and $M_h$ tend to $f(x)$ because $f$ is continuous, so', tex: 'A\'(x) = \\lim_{h\\to 0}\\frac{A(x+h) - A(x)}{h} = f(x)' },
      { text: 'If $F$ is any antiderivative, $F - A$ is constant, so $F(b) - F(a) = A(b) - A(a) = \\int_a^b f$.' }
    ]
  },
  examples: [
    {
      title: 'Evaluating an integral',
      q: 'Evaluate $\\displaystyle\\int_1^3 (x^2 + 1)\\,dx$.',
      steps: [
        'An antiderivative is $F(x) = \\dfrac{x^3}{3} + x$.',
        '$F(3) = 9 + 3 = 12$ and $F(1) = \\tfrac13 + 1 = \\tfrac43$.',
        'The integral is $12 - \\tfrac43 = \\tfrac{32}{3} \\approx 10.67$.'
      ],
      a: '32/3'
    },
    {
      title: 'A day of solar power',
      q: 'A solar panel\'s output on a clear day is roughly $P(t) = 300\\sin(\\pi t/12)$ watts for $0 \\le t \\le 12$ hours. How much energy does it produce?',
      steps: [
        { text: 'Integrate the power:', tex: 'E = \\int_0^{12} 300\\sin\\frac{\\pi t}{12}\\,dt = 300\\cdot\\frac{12}{\\pi}\\left[-\\cos\\frac{\\pi t}{12}\\right]_0^{12}' },
        'The bracket is $-\\cos\\pi + \\cos 0 = 2$, so $E = \\dfrac{7200}{\\pi} = 2292\\ \\mathrm{Wh}$.',
        'About 2.3 kWh: the same as running at the 300 W peak for 7.6 hours.'
      ],
      a: '≈ 2.29 kWh'
    },
    {
      title: 'A moving upper limit',
      q: 'Find $\\dfrac{d}{dx}\\displaystyle\\int_1^{x^2}\\cos t\\,dt$.',
      steps: [
        'Let $G(u) = \\int_1^u \\cos t\\,dt$, so that $G\'(u) = \\cos u$ by part 1.',
        'The expression is $G(x^2)$; by the chain rule its derivative is $\\cos(x^2)\\cdot 2x$.',
        'Check: $G(u) = \\sin u - \\sin 1$, so $G(x^2) = \\sin(x^2) - \\sin 1$, whose derivative is indeed $2x\\cos(x^2)$.'
      ],
      a: '2x cos(x²)'
    }
  ],
  quiz: [
    { q: 'Find $\\dfrac{d}{dx}\\displaystyle\\int_0^x \\sin(t^2)\\,dt$.', answer: 'sin(x^2)', vars: ['x'],
      why: 'Part 1: the derivative of the area function is the integrand evaluated at the moving end. No antiderivative is needed (and none exists in elementary form).' },
    { q: '$\\displaystyle\\int_0^\\pi \\sin x\\,dx = $', choices: ['0', '1', '2', 'π'], a: 2,
      why: '$[-\\cos x]_0^\\pi = -(-1) - (-1) = 2$.' },
    { q: 'If $v(t)$ is a velocity, $\\int_a^b v(t)\\,dt$ is…', choices: ['the distance travelled', 'the displacement', 'the average velocity', 'the acceleration'], a: 1,
      why: 'Integrating the rate $dx/dt$ gives the net change $x(b) - x(a)$. Distance would need $|v|$.' },
    { q: 'Every continuous function has an antiderivative.', a: true,
      why: 'Its area function $\\int_a^x f(t)\\,dt$ is one, by part 1 of the theorem, even if no formula for it exists.' },
    { q: 'Let $A(x) = \\int_0^x (3t^2 + 1)\\,dt$. Write $A(x)$.', answer: 'x^3 + x', vars: ['x'],
      why: 'Antiderivative $t^3 + t$, evaluated from 0 to $x$: $x^3 + x - 0$.' }
  ],
  applications: [
    'Evaluating definite integrals exactly: areas, work, energy, charge.',
    'The net change theorem: from rates (velocity, flow, reaction rate) to totals.',
    'The work–energy theorem and many conservation laws are integrated forms of equations of motion.'
  ],
  history: 'Isaac Barrow, Newton\'s teacher at Cambridge, proved a geometric form of the theorem in the 1660s. Newton and Leibniz recognised its full power and built calculus on it; Riemann\'s 1854 definition of the integral later made it rigorous.',
  sim: 'calc-ftc'
},

{
  id: 'integration-by-substitution', parent: 'integration', title: 'Integration by substitution', level: 2,
  short: 'The chain rule run backwards: spot an inner function u and its derivative, rewrite the integral in terms of u, and integrate the simpler result.',
  keywords: ['substitution', 'u-substitution', 'change of variable', 'reverse chain rule', 'du', 'change of limits', 'trigonometric substitution'],
  prereq: ['chain-rule', 'fundamental-theorem', 'antiderivatives'],
  related: ['integration-by-parts', 'partial-fractions', 'improper-integrals', 'multiple-integrals', 'physics:rc-circuits', 'physics:energy-in-capacitor'],
  body: `
The [[chain-rule|chain rule]] says $\\dfrac{d}{dx}F(g(x)) = F'(g(x))\\,g'(x)$. Read backwards, it says that an integrand of the form "a function of $g(x)$, times $g'(x)$" can be integrated:

$$\\int f\\big(g(x)\\big)\\,g'(x)\\,dx = \\int f(u)\\,du, \\qquad u = g(x).$$

### The method
1. Choose $u$: usually an "inner" function whose derivative also appears (up to a constant factor).
2. Write $du = g'(x)\\,dx$ and replace everything in $x$ by $u$.
3. Integrate in $u$.
4. Substitute back $u = g(x)$ (for an indefinite integral).

For $\\int 2x\\cos(x^2)\\,dx$, take $u = x^2$, so $du = 2x\\,dx$ and the integral becomes $\\int \\cos u\\,du = \\sin u + C = \\sin(x^2) + C$. Differentiating the answer returns the integrand, as it should.

The derivative only has to be present **up to a constant**, which you can adjust: for $\\int x e^{x^2}\\,dx$, $du = 2x\\,dx$ means $x\\,dx = \\tfrac12 du$, giving $\\tfrac12 e^{x^2} + C$. But a missing *variable* factor cannot be conjured up: $\\int e^{x^2}\\,dx$ has no elementary answer.

### Common patterns
| Integral | Substitution | Result |
|---|---|---|
| $\\int f(ax + b)\\,dx$ | $u = ax + b$ | $\\tfrac1a F(ax + b) + C$ |
| $\\int \\dfrac{g'(x)}{g(x)}\\,dx$ | $u = g(x)$ | $\\ln\\lvert g(x)\\rvert + C$ |
| $\\int g(x)^n g'(x)\\,dx$ | $u = g(x)$ | $\\dfrac{g(x)^{n+1}}{n+1} + C$ |
| $\\int \\tan x\\,dx$ | $u = \\cos x$ | $-\\ln\\lvert\\cos x\\rvert + C$ |

### Definite integrals: change the limits
With limits, convert them to $u$-values and never go back to $x$:
$$\\int_0^2 x\\,e^{x^2}\\,dx = \\frac12\\int_0^4 e^{u}\\,du = \\frac12\\left(e^4 - 1\\right) \\approx 26.8,$$
since $u = x^2$ runs from 0 to 4.

### Substitutions that go the other way
Sometimes it pays to put $x$ in terms of a new variable. For $\\int_{-1}^{1}\\sqrt{1 - x^2}\\,dx$, set $x = \\sin\\theta$: then $\\sqrt{1 - x^2} = \\cos\\theta$ and $dx = \\cos\\theta\\,d\\theta$, and the integral becomes $\\int_{-\\pi/2}^{\\pi/2}\\cos^2\\theta\\,d\\theta = \\pi/2$, the area of a half unit disc. Such **trigonometric substitutions** handle square roots of quadratics.

### In physics
A capacitor $C$ charged to $V_0$ discharges through a resistor $R$. The current is $I = (V_0/R)e^{-t/\\tau}$ with $\\tau = RC$, and the energy turned into heat up to time $t$ is
$$\\int_0^t I^2 R\\,dt' = \\frac{V_0^2}{R}\\int_0^t e^{-2t'/\\tau}\\,dt' = \\tfrac12 C V_0^2\\left(1 - e^{-2t/\\tau}\\right),$$
using $u = 2t'/\\tau$. As $t \\to \\infty$ this is exactly the [[physics:energy-in-capacitor|energy that was stored]], $\\tfrac12 CV_0^2$, as it must be.
`,
  ideas: [
    'Substitution is the chain rule in reverse: look for a function and its derivative.',
    'Set u = inner function, replace dx using du = g′(x) dx, integrate in u.',
    'Constant factors can be adjusted; missing variable factors cannot.',
    'For definite integrals, change the limits to u-values.',
    'Trigonometric substitutions (x = sin θ, …) tame square roots of quadratics.'
  ],
  pitfalls: [
    'Substituting u but leaving some x behind — Every x, including the dx, must be expressed in u before integrating.',
    'Keeping the old limits after substituting — With u = x², the limits x = 0 to 2 become u = 0 to 4.',
    '∫ e^(x²) dx = e^(x²)/(2x) + C — Differentiate that and you do not get e^(x²). The factor 2x must already be in the integrand for substitution to work.'
  ],
  formulas: [
    {
      name: 'Heat released by a discharging capacitor',
      expr: 'E = 0.5*C*V^2*(1 - exp(-2*t/tau))', tex: 'E = \\tfrac12 C V^2\\left(1 - e^{-2t/\\tau}\\right)',
      vars: {
        E: { name: 'energy released so far', q: 'energy', unit: 'mJ' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 100 },
        V: { name: 'starting voltage', q: 'voltage', unit: 'V', value: 12 },
        t: { name: 'time since discharge began', q: 'time', unit: 'ms', value: 50 },
        tau: { name: 'time constant RC', tex: '\\tau', q: 'time', unit: 'ms', value: 100 }
      },
      note: 'The integral of $I^2R$ with the substitution $u = 2t/\\tau$. Half the energy is gone after $t = \\tfrac12\\tau\\ln 2 \\approx 0.35\\tau$.',
      stories: { E: 'A {C} capacitor charged to {V} discharges through a resistor with time constant {tau}. How much energy has been turned into heat after {t}?' }
    }
  ],
  examples: [
    {
      title: 'Spot the derivative',
      q: 'Find $\\displaystyle\\int 2x\\cos(x^2)\\,dx$.',
      steps: [
        'Let $u = x^2$; then $du = 2x\\,dx$, which is exactly the rest of the integrand.',
        '$\\int \\cos u\\,du = \\sin u + C = \\sin(x^2) + C$.'
      ],
      a: 'sin(x²) + C'
    },
    {
      title: 'Changing the limits',
      q: 'Evaluate $\\displaystyle\\int_0^2 x e^{x^2}\\,dx$.',
      steps: [
        'Let $u = x^2$, $du = 2x\\,dx$, so $x\\,dx = \\tfrac12\\,du$.',
        'Limits: $x = 0 \\Rightarrow u = 0$ and $x = 2 \\Rightarrow u = 4$.',
        '$\\tfrac12\\int_0^4 e^u\\,du = \\tfrac12(e^4 - 1) = \\tfrac12(54.598 - 1) = 26.80$.'
      ],
      a: '(e⁴ − 1)/2 ≈ 26.80'
    },
    {
      title: 'A power of sine',
      q: 'Find $\\displaystyle\\int \\sin^3 x\\cos x\\,dx$.',
      steps: [
        'Let $u = \\sin x$, $du = \\cos x\\,dx$.',
        '$\\int u^3\\,du = \\dfrac{u^4}{4} + C = \\dfrac{\\sin^4 x}{4} + C$.'
      ],
      a: 'sin⁴x / 4 + C'
    }
  ],
  quiz: [
    { q: 'Find the antiderivative of $2x(x^2 + 1)^3$ whose value at $x = 0$ is $\\tfrac14$.', answer: '(x^2 + 1)^4/4', vars: ['x'],
      why: 'With $u = x^2 + 1$, $du = 2x\\,dx$ and $\\int u^3\\,du = u^4/4$. At $x = 0$ this is $1/4$, so no extra constant is needed.' },
    { q: 'Find the antiderivative of $\\cos 5x$ that is 0 at $x = 0$.', answer: 'sin(5x)/5', vars: ['x'],
      why: 'Linear substitution $u = 5x$, $dx = du/5$.' },
    { q: 'For $\\int x^2\\sin(x^3)\\,dx$, the natural substitution is…', choices: ['$u = x^2$', '$u = \\sin x$', '$u = x^3$', '$u = \\sin(x^3)$'], a: 2,
      why: '$du = 3x^2\\,dx$, and $x^2\\,dx$ is present: the integral becomes $\\tfrac13\\int\\sin u\\,du = -\\tfrac13\\cos(x^3) + C$.' },
    { q: 'With $u = x^2 + 1$, the integral $\\int_0^1 \\frac{2x}{x^2 + 1}\\,dx$ becomes…', choices: ['$\\int_0^1 \\frac{du}{u}$', '$\\int_1^2 \\frac{du}{u}$', '$\\int_0^2 \\frac{du}{u}$', '$\\int_1^2 \\frac{2\\,du}{u}$'], a: 1,
      why: '$du = 2x\\,dx$, and $u$ runs from $0^2 + 1 = 1$ to $1^2 + 1 = 2$. The value is $\\ln 2$.' },
    { q: '$\\displaystyle\\int e^{x^2}\\,dx = \\frac{e^{x^2}}{2x} + C$.', a: false,
      why: 'Differentiating the right-hand side with the quotient rule does not give $e^{x^2}$. Substitution needs the factor $2x$ to be in the integrand already; $e^{x^2}$ has no elementary antiderivative.' }
  ],
  applications: [
    'Energy and charge in exponentially decaying circuits.',
    'Changing variables to match the symmetry of a problem, e.g. polar or spherical coordinates in multiple integrals.',
    'Probability: transforming random variables and normalising distributions.'
  ]
},

{
  id: 'integration-by-parts', parent: 'integration', title: 'Integration by parts', level: 2,
  short: 'The product rule run backwards, ∫u dv = uv − ∫v du: it trades a hard integral of a product for an easier one.',
  keywords: ['integration by parts', 'product rule', 'LIATE', 'tabular integration', 'x e^x', 'ln x integral', 'reduction formula'],
  prereq: ['differentiation-rules', 'antiderivatives', 'fundamental-theorem'],
  related: ['integration-by-substitution', 'laplace-transform', 'fourier-series', 'expected-value', 'physics:half-life', 'physics:wavefunction'],
  body: `
The product rule, $(uv)' = u'v + uv'$, integrated on both sides and rearranged, gives **integration by parts**:

$$\\int u\\,dv = uv - \\int v\\,du \\qquad\\text{or}\\qquad \\int u\\,v'\\,dx = uv - \\int u'\\,v\\,dx.$$

It does not finish an integral; it **trades** it for another. The trade is worth making when differentiating $u$ simplifies it and $dv$ is easy to integrate.

### The classic: $\\int x e^x\\,dx$
Take $u = x$ (it simplifies to 1 when differentiated) and $dv = e^x\\,dx$ (so $v = e^x$):
$$\\int x e^x\\,dx = x e^x - \\int e^x\\,dx = (x - 1)e^x + C.$$
Check by the product rule: $\\frac{d}{dx}(x - 1)e^x = e^x + (x - 1)e^x = xe^x$.

### Choosing u
A handy priority list for $u$ is **LIATE**: Logarithms, Inverse trigonometric functions, Algebraic (powers of $x$), Trigonometric, Exponentials. Whatever comes first becomes $u$, the rest is $dv$. It is a guide, not a law.

- $\\int \\ln x\\,dx$: take $u = \\ln x$ and $dv = dx$, so $v = x$: $\\;x\\ln x - \\int x\\cdot\\frac1x\\,dx = x\\ln x - x + C$.
- $\\int x^2\\sin x\\,dx$: parts twice, each time lowering the power of $x$.
- $\\int e^x\\sin x\\,dx$: after two rounds the original integral reappears on the right; move it to the left and solve: $\\tfrac12 e^x(\\sin x - \\cos x) + C$.

### With limits
$$\\int_a^b u\\,dv = \\Big[uv\\Big]_a^b - \\int_a^b v\\,du.$$
For example $\\int_0^1 x e^x\\,dx = [(x - 1)e^x]_0^1 = 0 - (-1) = 1$.

### Why physicists love it
- **Averages over decays.** A radioactive nucleus with decay constant $\\lambda$ survives to time $t$ with probability density $\\lambda e^{-\\lambda t}$. Its mean lifetime is $\\int_0^\\infty t\\,\\lambda e^{-\\lambda t}\\,dt = 1/\\lambda$, by parts. With the [[physics:half-life|half-life]] $t_{1/2} = \\ln 2/\\lambda$, the mean lifetime is $1.44$ half-lives.
- **Moving a derivative.** Integration by parts shifts a derivative from one factor to the other, with a boundary term. In quantum mechanics, [[physics:wavefunction|wavefunctions]] vanish at infinity, the boundary terms drop out, and this is how momentum and energy expectation values are computed.
- **Fourier and Laplace transforms** of powers, pulses and ramps ([[fourier-series|Fourier series]], [[laplace-transform|the Laplace transform]]) are computed by parts.
`,
  ideas: [
    '∫u dv = uv − ∫v du: the product rule integrated.',
    'Pick u to simplify when differentiated, dv to be easy to integrate (LIATE is a guide).',
    'It may need repeating; sometimes the original integral reappears and can be solved for.',
    'With limits, evaluate the boundary term [uv] at both ends.',
    'Averages such as a mean lifetime ∫ t λe^(−λt) dt are classic applications.'
  ],
  pitfalls: [
    'Choosing u = eˣ and dv = x dx for ∫x eˣ dx — Then the new integral ∫(x²/2)eˣ dx is harder. Let the power of x be u.',
    'Forgetting the boundary term with definite integrals — ∫ₐᵇ u dv = [uv]ₐᵇ − ∫ₐᵇ v du; the [uv] part is not optional.',
    'Sign slips in repeated parts — Each round brings a minus sign; the tabular method (alternating signs) helps.'
  ],
  examples: [
    {
      title: 'Algebraic times trigonometric',
      q: 'Find $\\displaystyle\\int x\\cos x\\,dx$.',
      steps: [
        'Take $u = x$, $dv = \\cos x\\,dx$: then $du = dx$ and $v = \\sin x$.',
        '$\\int x\\cos x\\,dx = x\\sin x - \\int \\sin x\\,dx = x\\sin x + \\cos x + C$.',
        'Check: $\\frac{d}{dx}(x\\sin x + \\cos x) = \\sin x + x\\cos x - \\sin x = x\\cos x$.'
      ],
      a: 'x sin x + cos x + C'
    },
    {
      title: 'The logarithm',
      q: 'Evaluate $\\displaystyle\\int_1^e \\ln x\\,dx$.',
      steps: [
        'Take $u = \\ln x$, $dv = dx$: $du = dx/x$, $v = x$.',
        '$\\int \\ln x\\,dx = x\\ln x - \\int 1\\,dx = x\\ln x - x$.',
        'From 1 to $e$: $(e\\cdot 1 - e) - (0 - 1) = 1$.'
      ],
      a: '1'
    },
    {
      title: 'Going round in a circle',
      q: 'Find $I = \\displaystyle\\int e^x\\sin x\\,dx$.',
      steps: [
        'Parts with $u = \\sin x$, $dv = e^x dx$: $I = e^x\\sin x - \\int e^x\\cos x\\,dx$.',
        'Again with $u = \\cos x$: $\\int e^x\\cos x\\,dx = e^x\\cos x + \\int e^x \\sin x\\,dx = e^x\\cos x + I$.',
        'So $I = e^x\\sin x - e^x\\cos x - I$, and $2I = e^x(\\sin x - \\cos x)$.'
      ],
      a: '½ eˣ(sin x − cos x) + C'
    }
  ],
  quiz: [
    { q: 'Find the antiderivative of $x e^x$ that equals $-1$ at $x = 0$.', answer: '(x - 1)e^x', vars: ['x'],
      why: 'By parts: $x e^x - e^x$. At $x = 0$ this is $-1$, as required.' },
    { q: 'Find the antiderivative of $\\ln x$ that equals $-1$ at $x = 1$.', answer: 'x ln(x) - x', vars: ['x'],
      why: 'By parts with $u = \\ln x$, $v = x$: $x\\ln x - x$, which is $-1$ at $x = 1$.' },
    { q: 'For $\\int x^2 e^{3x}\\,dx$, the best first choice of $u$ is…', choices: ['$u = e^{3x}$', '$u = x^2$', '$u = x^2e^{3x}$', '$u = 3x$'], a: 1,
      why: 'Differentiating $x^2$ lowers the power; two rounds remove it completely. $e^{3x}$ is equally easy to integrate each time.' },
    { q: '$\\displaystyle\\int_0^1 x e^x\\,dx = $', choices: ['$e$', '1', '$e - 1$', '0'], a: 1,
      why: '$[(x - 1)e^x]_0^1 = 0 - (-1) = 1$.' },
    { q: 'Integration by parts is the integral form of the product rule.', a: true,
      why: 'Integrate $(uv)\' = u\'v + uv\'$ and rearrange.' }
  ],
  applications: [
    'Mean lifetimes and other expectation values of exponential and related distributions.',
    'Fourier coefficients and Laplace transforms of signals.',
    'Quantum-mechanical expectation values, and the derivation of the Euler–Lagrange equations.'
  ]
},

{
  id: 'partial-fractions', parent: 'integration', title: 'Partial fractions', level: 3,
  short: 'Splitting a ratio of polynomials into a sum of simple fractions, each of which integrates to a logarithm, a power or an arctangent.',
  keywords: ['partial fractions', 'partial fraction decomposition', 'cover-up method', 'Heaviside', 'rational function integral', 'repeated factor', 'irreducible quadratic'],
  prereq: ['rational-functions', 'polynomial-division', 'integration-by-substitution'],
  related: ['laplace-transform', 'logistic-equation', 'systems-of-equations', 'factoring'],
  body: `
Adding fractions is routine: $\\dfrac{1}{x - 1} - \\dfrac{1}{x + 1} = \\dfrac{2}{x^2 - 1}$. **Partial fractions** run this backwards, breaking a complicated rational function into simple pieces:

$$\\frac{1}{x^2 - 1} = \\frac{1}{2}\\left(\\frac{1}{x - 1} - \\frac{1}{x + 1}\\right).$$

Each piece integrates to a logarithm, so
$$\\int\\frac{dx}{x^2 - 1} = \\frac12\\ln\\left|\\frac{x - 1}{x + 1}\\right| + C.$$

### The recipe
1. **Proper fraction first.** If the degree of the top is not less than that of the bottom, do [[polynomial-division|polynomial division]] first, leaving a polynomial plus a proper fraction.
2. **Factor the denominator** into linear factors and irreducible quadratics.
3. **Write the form**, one term per factor:

| Factor in the denominator | Terms |
|---|---|
| $(x - a)$ | $\\dfrac{A}{x - a}$ |
| $(x - a)^2$ | $\\dfrac{A}{x - a} + \\dfrac{B}{(x - a)^2}$ |
| $x^2 + bx + c$ (no real roots) | $\\dfrac{Ax + B}{x^2 + bx + c}$ |

4. **Find the constants**: multiply through by the denominator and either compare coefficients or substitute convenient values of $x$.
5. **Integrate** each term: $\\int\\frac{A}{x - a}dx = A\\ln\\lvert x - a\\rvert$, $\\int\\frac{B}{(x-a)^2}dx = -\\frac{B}{x - a}$, and quadratics give a logarithm plus an arctangent.

### The cover-up trick
For a distinct linear factor $(x - a)$, the constant $A$ is found by covering up that factor and evaluating the rest at $x = a$. For $\\dfrac{3x + 5}{(x + 1)(x + 2)}$: cover $(x + 1)$ and put $x = -1$ in what remains: $A = \\dfrac{-3 + 5}{-1 + 2} = 2$. Cover $(x + 2)$ and put $x = -2$: $B = \\dfrac{-6 + 5}{-2 + 1} = 1$. So
$$\\frac{3x + 5}{(x + 1)(x + 2)} = \\frac{2}{x + 1} + \\frac{1}{x + 2}.$$

### Where it is needed
- **The logistic equation** $\\dfrac{dP}{dt} = rP\\left(1 - \\dfrac{P}{K}\\right)$ for a population with limited resources separates into $\\displaystyle\\int\\frac{K\\,dP}{P(K - P)} = \\int r\\,dt$, and partial fractions, $\\dfrac{K}{P(K-P)} = \\dfrac1P + \\dfrac{1}{K - P}$, produce the S-shaped [[logistic-equation|logistic curve]].
- **Circuits and control.** The [[laplace-transform|Laplace transform]] turns circuit equations into rational functions of $s$; partial fractions split them into terms whose inverse transforms are exponentials and sinusoids: the natural modes of the circuit.
- **Chemistry.** Second-order reaction kinetics such as $A + B \\to C$ lead to integrals of $\\frac{1}{(a - x)(b - x)}$.
`,
  ideas: [
    'A proper rational function splits into simple fractions, one per factor of the denominator.',
    'Improper fractions need polynomial division first.',
    'Distinct linear factors give A/(x − a); repeated ones add B/(x − a)²; irreducible quadratics give (Ax + B)/(quadratic).',
    'The cover-up method finds the coefficient of a distinct linear factor in one step.',
    'The pieces integrate to logarithms, powers and arctangents.'
  ],
  pitfalls: [
    'Skipping the division — x³/(x² − 1) is improper: divide first to get x + x/(x² − 1).',
    'Using A/(x − a) alone for a repeated factor — (x − a)² needs both A/(x − a) and B/(x − a)².',
    'Putting a constant over an irreducible quadratic — The numerator must be a general linear term Ax + B.'
  ],
  formulas: [
    {
      name: 'Cover-up coefficient for (px + q)/((x − a)(x − b))',
      expr: 'A = (p*a + q)/(a - b)', tex: 'A = \\frac{p\\,a + q}{a - b}',
      vars: {
        A: { name: 'coefficient of 1/(x − a)', signed: true },
        p: { name: 'coefficient p in the numerator', value: 3, signed: true },
        q: { name: 'constant q in the numerator', value: 5, signed: true },
        a: { name: 'root a of the first factor', value: -1, signed: true },
        b: { name: 'root b of the second factor', value: -2, signed: true }
      },
      note: 'Swap $a$ and $b$ to get the other coefficient $B = (pb + q)/(b - a)$. The defaults are $\\frac{3x + 5}{(x+1)(x+2)}$, with $A = 2$.'
    }
  ],
  examples: [
    {
      title: 'Two linear factors',
      q: 'Find $\\displaystyle\\int\\frac{3x + 5}{(x + 1)(x + 2)}\\,dx$.',
      steps: [
        'Cover-up: $A = \\dfrac{3(-1) + 5}{-1 + 2} = 2$, $B = \\dfrac{3(-2) + 5}{-2 + 1} = 1$.',
        'Check by recombining: $\\dfrac{2(x + 2) + (x + 1)}{(x + 1)(x + 2)} = \\dfrac{3x + 5}{(x+1)(x+2)}$.',
        'Integrate: $2\\ln|x + 1| + \\ln|x + 2| + C$.'
      ],
      a: '2 ln|x + 1| + ln|x + 2| + C'
    },
    {
      title: 'A repeated factor',
      q: 'Decompose $\\dfrac{1}{x^2(x + 1)}$ and integrate it.',
      steps: [
        'Form: $\\dfrac{A}{x} + \\dfrac{B}{x^2} + \\dfrac{C}{x + 1}$, so $1 = Ax(x + 1) + B(x + 1) + Cx^2$.',
        '$x = 0$ gives $B = 1$; $x = -1$ gives $C = 1$; the $x^2$ coefficients give $A + C = 0$, so $A = -1$.',
        'Integrate: $-\\ln|x| - \\dfrac{1}{x} + \\ln|x + 1| + C$.'
      ],
      a: '−1/x + 1/x² + 1/(x + 1); integral ln|(x + 1)/x| − 1/x + C'
    }
  ],
  quiz: [
    { q: 'The correct form for $\\dfrac{x + 3}{(x - 1)(x^2 + 1)}$ is…', choices: ['$\\dfrac{A}{x - 1} + \\dfrac{B}{x^2 + 1}$', '$\\dfrac{A}{x - 1} + \\dfrac{Bx + C}{x^2 + 1}$', '$\\dfrac{A}{x - 1} + \\dfrac{B}{x + 1} + \\dfrac{C}{x - 1}$', '$\\dfrac{Ax + B}{(x - 1)(x^2 + 1)}$'], a: 1,
      why: '$x^2 + 1$ has no real roots, so it keeps a linear numerator $Bx + C$.' },
    { q: 'Which is the partial-fraction form of $\\dfrac{1}{x(x + 1)}$?', choices: ['$\\dfrac1x + \\dfrac{1}{x + 1}$', '$\\dfrac1x - \\dfrac{1}{x + 1}$', '$\\dfrac{1}{x + 1} - \\dfrac1x$', '$\\dfrac{2}{x} - \\dfrac{1}{x+1}$'], a: 1,
      why: 'Cover-up: at $x = 0$ the rest is $1/(0 + 1) = 1$; at $x = -1$ it is $1/(-1) = -1$.' },
    { q: 'For $x > 0$, find the antiderivative of $\\dfrac{1}{x(x + 1)}$ that equals $\\ln\\tfrac12$ at $x = 1$.', answer: 'ln(x/(x + 1))', vars: ['x'],
      why: '$\\int\\left(\\frac1x - \\frac1{x+1}\\right)dx = \\ln x - \\ln(x + 1) = \\ln\\frac{x}{x+1}$, which is $\\ln\\frac12$ at $x = 1$.' },
    { q: 'Before using partial fractions on $\\dfrac{x^3}{x^2 - 1}$ you must divide the polynomials.', a: true,
      why: 'The top has the higher degree. Division gives $x + \\dfrac{x}{x^2 - 1}$, and only the proper part is split.' },
    { q: 'In $\\dfrac{5x - 1}{(x - 1)(x + 2)} = \\dfrac{A}{x - 1} + \\dfrac{B}{x + 2}$, what is $A$?', choices: ['4/3', '11/3', '5', '−1/2'], a: 0,
      why: 'Cover-up at $x = 1$: $A = \\dfrac{5 - 1}{1 + 2} = \\dfrac43$. (And $B = \\dfrac{-11}{-3} = \\dfrac{11}{3}$; they add to 5, the coefficient of $x$.)' }
  ],
  applications: [
    'Solving the logistic equation for populations, epidemics and product adoption.',
    'Inverting Laplace transforms in circuit analysis and control engineering.',
    'Integrated rate laws in chemical kinetics.'
  ]
},

{
  id: 'numerical-integration', parent: 'integration', title: 'Numerical integration', level: 2,
  short: 'Computing integrals with arithmetic when no formula exists: the trapezoid rule, the midpoint rule and Simpson\'s rule, with their error estimates.',
  keywords: ['numerical integration', 'quadrature', 'trapezoid rule', 'trapezium rule', 'midpoint rule', 'Simpson\'s rule', 'error bound', 'order of accuracy'],
  prereq: ['riemann-sums', 'definite-integral'],
  related: ['euler-method', 'newtons-method', 'taylor-series', 'improper-integrals', 'normal-distribution', 'physics:simple-pendulum'],
  body: `
Most integrals that matter in practice cannot be done by hand. $\\int_0^1 e^{-x^2}\\,dx$ (probabilities for the [[normal-distribution|normal distribution]]), the period of a pendulum at large amplitude, the length of an ellipse: none has an elementary antiderivative. And often there is no formula at all, only a table of measurements. **Numerical integration** (quadrature) computes the value directly, to any accuracy you are willing to pay for.

### The trapezoid rule
Join neighbouring points with straight lines instead of flat tops. With $n$ strips of width $h = (b - a)/n$ and values $f_0, f_1, \\ldots, f_n$:
$$T_n = h\\left(\\tfrac12 f_0 + f_1 + f_2 + \\cdots + f_{n-1} + \\tfrac12 f_n\\right).$$
It is the average of the left and right [[riemann-sums|Riemann sums]]. Its error is
$$E_T \\approx -\\frac{(b - a)\\,h^2}{12}\\,f'',$$
so halving $h$ divides the error by 4. For a concave-up function the chords lie above the curve and the rule overestimates.

### The midpoint rule
Sample at the middle of each strip. Its error is about half the trapezoid error and of the opposite sign, $+\\frac{(b - a)h^2}{24}f''$, which is why the midpoint rule quietly beats the trapezoid rule.

### Simpson's rule
Fit a **parabola** through each pair of strips (three points) instead of a straight line. For an even $n$:
$$S_n = \\frac{h}{3}\\left(f_0 + 4f_1 + 2f_2 + 4f_3 + \\cdots + 2f_{n-2} + 4f_{n-1} + f_n\\right).$$
Its error is $-\\frac{(b - a)h^4}{180}f^{(4)}$: halving $h$ divides the error by **16**, and the rule is exact for cubics (a pleasant bonus from the symmetry of the parabola fit).

### A comparison: $\\int_0^1 e^{-x^2}\\,dx = 0.746824\\ldots$
| Rule, 4 strips | Value | Error |
|---|---|---|
| Trapezoid | 0.742984 | −0.0038 |
| Midpoint | 0.748747 | +0.0019 |
| Simpson | 0.746855 | +0.00003 |

With the same five function values, Simpson's rule is over a hundred times more accurate than the trapezoid rule.

### How many strips?
The error formulas become calculators: to reach a given accuracy, bound $|f''|$ (or $|f^{(4)}|$) on the interval and solve for $n$. For $e^{-x^2}$ on $[0,1]$, $|f''| \\le 2$ and $|f^{(4)}| \\le 12$; an accuracy of $10^{-6}$ needs $n \\ge 409$ trapezoids but only $n = 18$ Simpson strips.

### Beyond
Modern software uses **adaptive** rules that put more points where the function wiggles, and **Gaussian quadrature**, which chooses the sample points themselves cleverly. In many dimensions every grid becomes hopeless and **Monte Carlo** integration, averaging $f$ at random points, takes over.
`,
  ideas: [
    'Trapezoid rule: join the points with straight lines; error ∝ h².',
    'Midpoint rule: sample at strip centres; error about half the trapezoid error, opposite sign.',
    'Simpson\'s rule: parabolas through pairs of strips; error ∝ h⁴, exact for cubics.',
    'Error bounds tell you how many strips a given accuracy needs.',
    'Doubling the strips divides the error by 4 (trapezoid, midpoint) or 16 (Simpson).'
  ],
  pitfalls: [
    'Using Simpson\'s rule with an odd number of strips — It works on pairs of strips; n must be even.',
    'More strips always help — Once the error reaches rounding level, more strips add rounding noise; and for data with noise, the rules cannot beat the noise.',
    'The error bound is the actual error — It is a worst-case guarantee; the real error is often much smaller.'
  ],
  formulas: [
    {
      name: 'Trapezoid rule: error bound',
      expr: 'E = w^3*M/(12*n^2)', tex: 'E \\le \\frac{w^3 M}{12\\,n^2}',
      vars: {
        E: { name: 'maximum error' },
        w: { name: 'interval length b − a', value: 1 },
        M: { name: 'bound on |f″| over the interval', value: 2 },
        n: { name: 'number of strips', value: 100 }
      },
      note: 'Solve for $n$ to find how many strips a given accuracy needs (then round up).',
      stories: { n: 'How many trapezoid strips guarantee an error below {E} for a function with $|f\'\'| \\le$ {M} over an interval of length {w}?' }
    },
    {
      name: 'Simpson\'s rule: error bound',
      expr: 'E = w^5*K/(180*n^4)', tex: 'E \\le \\frac{w^5 K}{180\\,n^4}',
      vars: {
        E: { name: 'maximum error' },
        w: { name: 'interval length b − a', value: 1 },
        K: { name: 'bound on |f⁗| over the interval', value: 12 },
        n: { name: 'number of strips (even)', value: 10 }
      },
      note: 'Round $n$ up to the next even number.',
      stories: { n: 'How many Simpson strips guarantee an error below {E} when $|f^{(4)}| \\le$ {K} over an interval of length {w}?' }
    }
  ],
  examples: [
    {
      title: 'Three rules, one integral',
      q: 'Estimate $\\displaystyle\\int_0^1 e^{-x^2}\\,dx$ with the trapezoid rule and Simpson\'s rule using 4 strips.',
      steps: [
        'Values at $x = 0, 0.25, 0.5, 0.75, 1$: $1,\\ 0.939413,\\ 0.778801,\\ 0.569783,\\ 0.367879$.',
        'Trapezoid: $0.25\\,(0.5 + 0.939413 + 0.778801 + 0.569783 + 0.183940) = 0.742984$.',
        'Simpson: $\\dfrac{0.25}{3}(1 + 4\\times0.939413 + 2\\times0.778801 + 4\\times0.569783 + 0.367879) = 0.746855$.',
        'The true value is 0.746824: errors of 0.0038 and 0.00003.'
      ],
      a: 'Trapezoid 0.74298, Simpson 0.74686 (exact 0.74682)'
    },
    {
      title: 'Planning the accuracy',
      q: 'How many strips does each rule need to guarantee $\\int_0^1 e^{-x^2}dx$ to within $10^{-6}$?',
      steps: [
        'Here $f\'\' = (4x^2 - 2)e^{-x^2}$, with $|f\'\'| \\le 2$ on $[0,1]$; and $|f^{(4)}| = |(16x^4 - 48x^2 + 12)e^{-x^2}| \\le 12$.',
        'Trapezoid: $\\dfrac{2}{12n^2} \\le 10^{-6}$ gives $n \\ge 408.2$, so 409 strips.',
        'Simpson: $\\dfrac{12}{180 n^4} \\le 10^{-6}$ gives $n \\ge 16.1$, so 18 strips (even).'
      ],
      a: '409 trapezoids or 18 Simpson strips'
    }
  ],
  quiz: [
    { q: 'Halving the strip width reduces the trapezoid rule\'s error by a factor of about…', choices: ['2', '4', '8', '16'], a: 1,
      why: 'Its error is proportional to $h^2$. (For Simpson\'s rule, proportional to $h^4$, the factor is 16.)' },
    { q: 'Simpson\'s rule gives the exact integral of every polynomial of degree at most…', choices: ['1', '2', '3', '4'], a: 2,
      why: 'Its error involves $f^{(4)}$, which is zero for cubics: the symmetric parabola fit cancels the cubic error.' },
    { q: 'For a function that is concave up, the trapezoid rule overestimates the integral.', a: true,
      why: 'The chords of a concave-up curve lie above it, so every trapezoid is slightly too big.' },
    { q: 'Simpson\'s rule requires…', choices: ['an odd number of strips', 'an even number of strips', 'equal function values at the ends', 'a polynomial integrand'], a: 1,
      why: 'Each parabola spans two strips, so the strips must pair up.' },
    { q: 'With the same number of strips, which is usually more accurate for a smooth function?', choices: ['Left Riemann sum', 'Trapezoid rule', 'Midpoint rule', 'Right Riemann sum'], a: 2,
      why: 'The midpoint error is about half the trapezoid error, and both beat the one-sided sums by a whole order of $h$.' }
  ],
  applications: [
    'Normal-distribution probabilities, error functions and other special functions.',
    'Integrating measured data: flow logs, power meters, accelerometer records.',
    'Pendulum periods at large amplitude, orbital elements, heat loads — anywhere a closed form is missing.'
  ],
  sim: { id: 'calc-riemann', params: { method: 'simp' } }
},

{
  id: 'improper-integrals', parent: 'integration', title: 'Improper integrals', level: 3,
  short: 'Integrals over an infinite range, or of a function that blows up, defined as limits: some add up to a finite value, others diverge.',
  keywords: ['improper integral', 'infinite limit', 'convergent integral', 'divergent integral', 'p-integral', 'comparison test', 'Gabriel\'s horn', 'Gaussian integral', 'escape energy'],
  prereq: ['definite-integral', 'limits-at-infinity', 'fundamental-theorem'],
  related: ['convergence-tests', 'lhopitals-rule', 'normal-distribution', 'laplace-transform', 'physics:escape-velocity', 'physics:gravitational-potential'],
  body: `
Can an infinitely long region have a finite area? Surprisingly often, yes. An integral with an infinite limit, or with an integrand that blows up somewhere in the range, is called **improper**, and it is defined as a limit of ordinary integrals.

### Infinite ranges
$$\\int_1^{\\infty} f(x)\\,dx = \\lim_{b \\to \\infty}\\int_1^b f(x)\\,dx.$$
If the limit exists the integral **converges**; otherwise it **diverges**. Compare two very similar curves:
$$\\int_1^b \\frac{dx}{x^2} = 1 - \\frac1b \\;\\to\\; 1, \\qquad \\int_1^b \\frac{dx}{x} = \\ln b \\;\\to\\; \\infty.$$
The tail of $1/x^2$ thins out fast enough for the area to stay finite; the tail of $1/x$ does not, however slowly the area grows (it passes 10 only at $b \\approx 22\\,000$).

### The p-test
$\\displaystyle\\int_1^\\infty \\frac{dx}{x^p}$ converges exactly when $p > 1$, with value $\\dfrac{1}{p - 1}$. Near zero it is the other way round: $\\displaystyle\\int_0^1\\frac{dx}{x^p}$ converges exactly when $p < 1$, e.g. $\\int_0^1 x^{-1/2}\\,dx = 2$. These benchmarks, together with the **comparison test** (a function smaller than a convergent one converges; one larger than a divergent one diverges), settle most cases. They mirror the tests for [[convergence-tests|convergence of series]].

### Unbounded integrands
If $f$ blows up at an end, take the limit there; if it blows up inside, split the integral at that point. Ignoring this gives nonsense: blindly writing $\\int_{-1}^1 \\frac{dx}{x^2} = [-1/x]_{-1}^{1} = -2$ produces a *negative* area for a *positive* function. In fact the integral diverges.

### Some famous values
- $\\int_0^\\infty e^{-kt}\\,dt = \\dfrac1k$: the total of any exponential decay is its initial rate divided by the decay constant.
- $\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt\\pi$: the Gaussian integral behind the [[normal-distribution|normal distribution]], computed with a [[multiple-integrals|double integral]] in polar coordinates.
- **Gabriel's horn**, $y = 1/x$ for $x \\ge 1$ spun about the $x$-axis, has finite volume $\\pi\\int_1^\\infty x^{-2}dx = \\pi$ but infinite surface area: you could fill it with paint but never paint it.

### In physics
The work needed to lift a mass $m$ from a planet's surface (radius $R$, mass $M$) to infinity is
$$W = \\int_R^\\infty \\frac{GMm}{r^2}\\,dr = \\left[-\\frac{GMm}{r}\\right]_R^\\infty = \\frac{GMm}{R}.$$
Finite! Although gravity reaches out for ever, it weakens fast enough ($p = 2 > 1$). For the Earth this is 62.6 MJ per kilogram, which sets the [[physics:escape-velocity|escape velocity]] of 11.2 km/s, and "work from infinity" is how the [[physics:gravitational-potential|gravitational potential]] is defined. Normalising a quantum wavefunction, the total energy radiated by a cooling body, and the Laplace transform are all improper integrals.
`,
  ideas: [
    'An improper integral is a limit of ordinary integrals as a limit of integration goes to infinity or to a point where f blows up.',
    'It converges if that limit is finite, and diverges otherwise.',
    '∫₁^∞ x⁻ᵖ dx converges only for p > 1; ∫₀¹ x⁻ᵖ dx converges only for p < 1.',
    'Comparison with known integrals decides most cases.',
    'A singularity inside the range must be found and treated; otherwise the answer can be absurd.'
  ],
  pitfalls: [
    'If f(x) → 0 as x → ∞, the integral converges — 1/x tends to 0 but its integral diverges; the decay must be fast enough.',
    '∫₋₁¹ dx/x² = −2 — The integrand blows up at 0, inside the range. The integral actually diverges; a negative result for a positive function is the warning sign.',
    'Infinite length means infinite area — The region under 1/x² from 1 to ∞ has area exactly 1.'
  ],
  formulas: [
    {
      name: 'Tail of a power: ∫ from R to ∞ of x⁻ᵖ dx',
      expr: 'I = R^(1 - p)/(p - 1)', tex: 'I = \\frac{R^{1-p}}{p - 1}',
      vars: {
        I: { name: 'value of the integral' },
        R: { name: 'lower limit R', value: 2 },
        p: { name: 'power p (must exceed 1)', value: 2, min: 1.000001, max: 50 }
      },
      note: 'Valid only for $p > 1$; for $p \\le 1$ the integral diverges.'
    },
    {
      name: 'Work to escape a planet\'s gravity',
      expr: 'W = G*M*m/R', tex: 'W = \\frac{GMm}{R}',
      vars: {
        W: { name: 'work from the surface to infinity', q: 'energy', unit: 'MJ' },
        G: { const: 'G' },
        M: { name: 'mass of the planet', q: 'mass', unit: 'M⊕', value: 1 },
        m: { name: 'mass lifted', q: 'mass', unit: 'kg', value: 1 },
        R: { name: 'radius of the planet', q: 'length', unit: 'km', value: 6371 }
      },
      note: 'The improper integral $\\int_R^\\infty GMm\\,r^{-2}\\,dr$. Setting it equal to $\\tfrac12 m v^2$ gives the escape velocity $\\sqrt{2GM/R}$.',
      stories: { W: 'How much energy is needed to send {m} from the surface of a planet of mass {M} and radius {R} out to infinity (ignoring air)?' }
    }
  ],
  examples: [
    {
      title: 'Converges or not?',
      q: 'Evaluate $\\displaystyle\\int_1^\\infty\\frac{dx}{x^2}$ and $\\displaystyle\\int_1^\\infty\\frac{dx}{\\sqrt x}$.',
      steps: [
        '$\\int_1^b x^{-2}\\,dx = [-x^{-1}]_1^b = 1 - 1/b \\to 1$: converges to 1.',
        '$\\int_1^b x^{-1/2}\\,dx = [2\\sqrt x]_1^b = 2\\sqrt b - 2 \\to \\infty$: diverges ($p = \\tfrac12 \\le 1$).'
      ],
      a: '1, and divergent'
    },
    {
      title: 'A singularity at the end',
      q: 'Evaluate $\\displaystyle\\int_0^1\\frac{dx}{\\sqrt x}$.',
      steps: [
        'The integrand blows up at 0, so use $\\lim_{a \\to 0^+}\\int_a^1 x^{-1/2}\\,dx$.',
        '$[2\\sqrt x]_a^1 = 2 - 2\\sqrt a \\to 2$.',
        'An infinitely tall region with area 2.'
      ],
      a: '2'
    },
    {
      title: 'Escape energy',
      q: 'How much energy does it take to move 1 kg from the Earth\'s surface to infinity? ($GM = 3.986\\times10^{14}\\ \\mathrm{m^3/s^2}$, $R = 6371$ km.)',
      steps: [
        '$W = \\int_R^\\infty \\dfrac{GM}{r^2}\\,dr = \\dfrac{GM}{R} = \\dfrac{3.986\\times10^{14}}{6.371\\times10^{6}} = 6.26\\times10^{7}\\ \\mathrm{J}$.',
        'About 63 MJ, roughly the chemical energy in 2 litres of petrol.',
        'Giving that as kinetic energy: $v = \\sqrt{2 \\times 6.26\\times10^7} = 11.2\\ \\mathrm{km/s}$, the escape velocity.'
      ],
      a: '62.6 MJ per kg (escape speed 11.2 km/s)'
    }
  ],
  quiz: [
    { q: 'Which integral converges?', choices: ['$\\int_1^\\infty x^{-1/2}\\,dx$', '$\\int_1^\\infty x^{-1}\\,dx$', '$\\int_1^\\infty x^{-1.01}\\,dx$', '$\\int_1^\\infty x^{-0.99}\\,dx$'], a: 2,
      why: 'The p-test on $[1, \\infty)$ needs $p > 1$; only $p = 1.01$ qualifies (its value is $1/0.01 = 100$).' },
    { q: '$\\displaystyle\\int_{-1}^{1}\\frac{dx}{x^2} = -2$.', a: false,
      why: 'The integrand blows up at $x = 0$ inside the range. Split there: $\\int_0^1 x^{-2}\\,dx$ diverges, so the whole integral does.' },
    { q: '$\\displaystyle\\int_0^\\infty e^{-2t}\\,dt = $', choices: ['2', '1/2', '∞', '0'], a: 1,
      why: '$[-\\tfrac12 e^{-2t}]_0^\\infty = 0 - (-\\tfrac12) = \\tfrac12$.' },
    { q: 'For $k > 0$, find $\\int_0^\\infty e^{-kt}\\,dt$ as an expression in $k$.', answer: '1/k', vars: ['k'],
      why: '$\\left[-\\tfrac1k e^{-kt}\\right]_0^\\infty = \\tfrac1k$. A faster decay (larger $k$) leaves a smaller total.' },
    { q: 'A solid can have a finite volume but an infinite surface area.', a: true,
      why: 'Gabriel\'s horn ($y = 1/x$, $x \\ge 1$, spun about the axis) has volume $\\pi$ but a surface integral that diverges like $\\int dx/x$.' }
  ],
  applications: [
    'Escape energies and gravitational and electric potentials, measured from infinity.',
    'Probability: total probability 1 for distributions on infinite ranges, and their means and variances.',
    'Laplace transforms, normalised wavefunctions and total energy radiated by decaying sources.'
  ]
}

);
