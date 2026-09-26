/* HYPER-MATH · content/differentiation.js — the derivative: its definition, the
 * rules for finding it, and derivatives of derivatives. */
Hyper.add(

{
  id: 'derivative', parent: 'differentiation', title: 'The derivative', level: 1,
  short: 'The instantaneous rate of change of a function: the slope of its graph at a single point, found as the limit of slopes over shrinking intervals.',
  keywords: ['derivative', 'slope', 'tangent line', 'rate of change', 'difference quotient', 'secant', 'instantaneous', 'dy/dx', 'differentiable', 'Leibniz notation'],
  prereq: ['limits', 'linear-functions', 'functions'],
  related: ['differentiation-rules', 'linear-approximation', 'higher-derivatives', 'physics:speed-velocity', 'physics:acceleration', 'physics:motion-graphs'],
  body: `
A straight line has one slope everywhere: rise over run. A curve is steeper in some places than others, so we ask for its slope **at a point**. The trick is to measure an average first and then shrink it.

### From average to instantaneous
Pick a point $P = (a, f(a))$ and a second point $Q$ a small step $h$ further along, at $(a + h, f(a+h))$. The line through them, a **secant**, has slope

$$\\frac{\\Delta y}{\\Delta x} = \\frac{f(a + h) - f(a)}{h},$$

the **difference quotient**: the average rate of change over the step. Now slide $Q$ towards $P$. The secant swings round and settles on the **tangent line**, the line that just grazes the curve at $P$. Its slope is the **derivative**:

$$f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}.$$

For $f(x) = x^2$ at $a = 3$: $\\dfrac{(3 + h)^2 - 9}{h} = \\dfrac{6h + h^2}{h} = 6 + h$, which tends to $6$. With $h = 0.1$ the secant slope is 6.1; with $h = 0.001$ it is 6.001. The tangent to the parabola at $(3, 9)$ has slope 6.

### The derivative as a function
Doing this at every $x$ gives a new function, $f'(x)$: for $x^2$ it is $2x$. Its sign tells you the shape of $f$. Where $f' > 0$ the graph rises, where $f' < 0$ it falls, and where $f' = 0$ the tangent is horizontal, the candidates for peaks and valleys ([[extrema]]).

Several notations are in use:
$$f'(x), \\qquad \\frac{dy}{dx}, \\qquad \\frac{d}{dx}f(x), \\qquad \\dot x \\;(\\text{for a rate in time}).$$
Leibniz's $\\dfrac{dy}{dx}$ is a reminder of where it came from, a ratio $\\Delta y / \\Delta x$ of vanishingly small changes. Its **units** are the units of $y$ per unit of $x$: metres per second, degrees per minute, pounds per litre.

### Where there is no derivative
The limit can fail. At a **corner** such as $|x|$ at $0$, secants from the right have slope $+1$ and from the left $-1$. At a **vertical tangent** such as $\\sqrt[3]{x}$ at 0 the slopes grow without bound. And at a jump nothing works. A function whose derivative exists at $a$ is **differentiable** there; differentiable functions are always [[continuity|continuous]].

### Why it matters
The derivative is the language of physics. [[physics:speed-velocity|Velocity]] is the derivative of position, $v = dx/dt$, the slope of the position–time graph; [[physics:acceleration|acceleration]] is the derivative of velocity; electric current is $dQ/dt$; power is $dW/dt$; and a conservative force is $F = -dU/dx$, the downhill slope of the potential energy. Whenever something "changes at a rate", a derivative is at work.

> [!tip] In the simulation, press **Let h → 0** and watch the secant turn into the tangent while its slope converges on $f'(a)$.
`,
  ideas: [
    'The derivative f′(a) is the slope of the tangent line at x = a.',
    'It is the limit of the difference quotient [f(a+h) − f(a)]/h as h → 0.',
    'f′ > 0 where f rises, f′ < 0 where it falls, f′ = 0 where the tangent is horizontal.',
    'Its units are units of output per unit of input: position per time is velocity.',
    'Corners, vertical tangents and jumps have no derivative.'
  ],
  pitfalls: [
    'The derivative at a point is f(a) — It is the slope there, not the height. A curve can be high and flat, or low and steep.',
    'Setting h = 0 in the difference quotient gives the derivative — That gives 0/0. You must simplify first (or take the limit) and only then let h shrink.',
    'Every continuous function has a derivative — |x| is continuous at 0 but its graph has a corner, where the left and right slopes disagree.'
  ],
  formulas: [
    {
      name: 'Average rate of change (slope of a secant)',
      expr: 'm = (y2 - y1)/(x2 - x1)', tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
      vars: {
        m: { name: 'average rate of change', signed: true },
        y2: { name: 'output at the second point', value: 22.05, signed: true },
        y1: { name: 'output at the first point', value: 20, signed: true },
        x2: { name: 'second input', value: 2.1, signed: true },
        x1: { name: 'first input', value: 2, signed: true }
      },
      note: 'Shrink the gap between $x_1$ and $x_2$ and this tends to the derivative at $x_1$. The defaults are the car of the first example: position $5t^2$ at $t = 2$ and $2.1$ s.',
      stories: { m: 'A car is at {y1} metres at {x1} seconds and at {y2} metres at {x2} seconds. What is its average velocity over that interval (in m/s)?' }
    },
    {
      name: 'Central-difference estimate of a derivative',
      expr: 'D = (fp - fm)/(2*h)', tex: 'D = \\frac{f_{+} - f_{-}}{2h}',
      vars: {
        D: { name: 'estimated derivative', signed: true },
        fp: { name: 'f(a + h)', tex: 'f_{+}', value: 0.8912, signed: true },
        fm: { name: 'f(a − h)', tex: 'f_{-}', value: 0.7833, signed: true },
        h: { name: 'step h', value: 0.1 }
      },
      note: 'Using points on both sides cancels the leading error: it shrinks like $h^2$ instead of $h$. The defaults are $\\sin 1.1$ and $\\sin 0.9$, giving 0.5395 against the exact $\\cos 1 = 0.5403$.'
    }
  ],
  derivation: {
    title: 'Why a differentiable function must be continuous',
    steps: [
      { text: 'For $h \\ne 0$, write the change in $f$ as the difference quotient times the step:', tex: 'f(a + h) - f(a) = \\frac{f(a + h) - f(a)}{h}\\cdot h' },
      { text: 'Let $h \\to 0$. The first factor tends to $f\'(a)$, a finite number; the second tends to 0:', tex: '\\lim_{h \\to 0}\\big[f(a + h) - f(a)\\big] = f\'(a)\\cdot 0 = 0' },
      { text: 'So $f(a + h) \\to f(a)$: the graph cannot jump at $a$. The converse fails, as $|x|$ shows.' }
    ]
  },
  examples: [
    {
      title: 'From the definition: 1/x',
      q: 'Use the definition to differentiate $f(x) = \\dfrac1x$.',
      steps: [
        { text: 'Form the difference quotient and combine the fractions:', tex: '\\frac{\\frac{1}{x+h} - \\frac1x}{h} = \\frac{x - (x + h)}{h\\,x(x+h)} = \\frac{-1}{x(x + h)}' },
        'Now the $h$ in the denominator has cancelled, so let $h \\to 0$: the limit is $-\\dfrac{1}{x^2}$.',
        'The slope is negative everywhere (the graph always falls) and very steep near $x = 0$.'
      ],
      a: 'f′(x) = −1/x²'
    },
    {
      title: 'The speed of a car from its position',
      q: 'A car starting from rest has position $x(t) = 5t^2$ metres. Estimate its velocity at $t = 2$ s from the interval $[2, 2.1]$, then find it exactly.',
      steps: [
        'Average over $[2, 2.1]$: $\\dfrac{5(2.1)^2 - 5(2)^2}{0.1} = \\dfrac{22.05 - 20}{0.1} = 20.5\\ \\mathrm{m/s}$.',
        { text: 'Exactly: the difference quotient at $t = 2$ is', tex: '\\frac{5(2 + h)^2 - 20}{h} = \\frac{20h + 5h^2}{h} = 20 + 5h \\;\\to\\; 20' },
        'So $v(2) = 20\\ \\mathrm{m/s}$ (72 km/h). The one-sided average overshoots by $5h$.'
      ],
      a: '20 m/s (the interval estimate gives 20.5 m/s)'
    }
  ],
  quiz: [
    { q: 'The derivative of $f$ at $x = a$ is…', choices: ['the value $f(a)$', 'the slope of the secant from 0 to $a$', 'the limit of secant slopes over shrinking intervals at $a$', 'the area under $f$ up to $a$'], a: 2,
      why: 'The derivative is the limit of $[f(a+h) - f(a)]/h$ as $h \\to 0$: the slope of the tangent. The area is the integral.' },
    { q: 'If $f$ is continuous at $a$, it is differentiable at $a$.', a: false,
      why: 'Continuity is necessary but not enough: $|x|$ is continuous at 0 and has a corner there.' },
    { q: 'Find $f\'(x)$ for $f(x) = x^2 + 4x$ (from the definition or otherwise).', answer: '2x + 4', vars: ['x'],
      why: '$\\dfrac{(x+h)^2 + 4(x+h) - x^2 - 4x}{h} = 2x + h + 4 \\to 2x + 4$.' },
    { q: 'At a point where the graph of $f$ has a horizontal tangent,', choices: ['$f = 0$', '$f\' = 0$', '$f\' $ is undefined', '$f\'\' = 0$'], a: 1,
      why: 'A horizontal tangent has slope zero, so the derivative is zero there. The function itself can have any value.' },
    { q: 'The temperature $T$ of a cup of tea (in °C) is recorded against time $t$ in minutes. The units of $dT/dt$ are…', choices: ['°C', 'minutes', '°C per minute', '°C × minutes'], a: 2,
      why: 'A derivative is a rate: units of the output divided by units of the input.' }
  ],
  applications: [
    'Velocity, acceleration, current, power, reaction rates, marginal cost: every rate is a derivative.',
    'Reading a speedometer: it reports the derivative of the distance travelled.',
    'Finding where a quantity is largest or smallest, by solving f′ = 0.'
  ],
  history: 'Newton, in the 1660s, called derivatives "fluxions" and wrote them with dots, as physicists still do for time derivatives ($\\dot x$). Leibniz developed the same ideas independently in the 1670s and published first, in 1684; his $dy/dx$ notation won out because it makes the chain rule and substitution look obvious.',
  sim: ['calc-secant-tangent', 'calc-derivative-grapher']
},

{
  id: 'differentiation-rules', parent: 'differentiation', title: 'Rules of differentiation', level: 1,
  short: 'A handful of rules — power, sum, constant multiple, product and quotient — that differentiate any polynomial or rational expression without limits.',
  keywords: ['power rule', 'product rule', 'quotient rule', 'sum rule', 'constant multiple', 'linearity', 'differentiate polynomial', 'd/dx'],
  prereq: ['derivative', 'exponents', 'polynomials'],
  related: ['chain-rule', 'derivatives-of-functions', 'higher-derivatives', 'integration-by-parts', 'physics:kinetic-energy', 'physics:rocket-propulsion'],
  body: `
Working from the limit definition every time would be exhausting. Instead, a few rules, each proved once from the definition, do almost all the work.

### The basic rules
| Rule | In symbols |
|---|---|
| Constant | $\\dfrac{d}{dx}\\,c = 0$ |
| Power | $\\dfrac{d}{dx}\\,x^n = n\\,x^{n-1}$ (any real $n$) |
| Constant multiple | $(c\\,f)' = c\\,f'$ |
| Sum | $(f + g)' = f' + g'$ |
| Product | $(fg)' = f'g + fg'$ |
| Quotient | $\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f'g - fg'}{g^2}$ |

The **power rule** is the workhorse. It covers roots and reciprocals once you write them as powers: $\\sqrt x = x^{1/2}$ has derivative $\\tfrac12 x^{-1/2} = \\dfrac{1}{2\\sqrt x}$, and $\\dfrac{1}{x^3} = x^{-3}$ has derivative $-3x^{-4}$. The sum and constant-multiple rules together say that differentiation is **linear**, so a polynomial is differentiated term by term:
$$\\frac{d}{dx}\\left(4x^3 - 5x^2 + 7\\right) = 12x^2 - 10x.$$

### The product rule, pictured
Think of $f(x)g(x)$ as the area of a rectangle with sides $f$ and $g$. Nudge $x$ and both sides grow a little, by $\\Delta f$ and $\\Delta g$. The area gains two thin strips, $\\Delta f\\cdot g$ and $f \\cdot\\Delta g$, plus a tiny corner $\\Delta f\\,\\Delta g$. Divide by $\\Delta x$ and let it shrink: the strips give $f'g + fg'$, and the corner, a product of two small quantities, vanishes. That is the whole rule. It is **not** $f'g'$.

The quotient rule follows from the product rule (and the [[chain-rule|chain rule]]) applied to $f \\cdot g^{-1}$. A useful memory aid for its numerator is "bottom times derivative of top, minus top times derivative of bottom", with the order mattering because of the minus sign.

### In physics
- Kinetic energy $K = \\tfrac12 m v^2$ has $\\dfrac{dK}{dv} = mv$: the rate at which kinetic energy grows with speed is the [[physics:momentum|momentum]].
- Momentum is $p = mv$. When the mass changes too, as in a [[physics:rocket-propulsion|rocket]], the product rule gives $\\dfrac{dp}{dt} = m\\dfrac{dv}{dt} + v\\dfrac{dm}{dt}$, and the second term is the heart of rocket physics.
- A rectangle whose sides both grow has area growing at $\\dot A = L\\,\\dot W + W\\dot L$ (see the calculator).

> [!tip] Before reaching for the quotient rule, see whether you can simplify. $\\dfrac{x^3 + x}{x} = x^2 + 1$ for $x \\ne 0$, with derivative $2x$, no quotient rule needed.
`,
  ideas: [
    'Power rule: d/dx xⁿ = n xⁿ⁻¹, for every real power n, including roots and reciprocals.',
    'Differentiation is linear: differentiate sums term by term and keep constant factors.',
    'Product rule: (fg)′ = f′g + fg′, never f′g′.',
    'Quotient rule: (f/g)′ = (f′g − fg′)/g².',
    'Rewrite roots and fractions as powers before differentiating.'
  ],
  pitfalls: [
    'The derivative of a product is the product of the derivatives — (x · x)′ = 2x, but x′ · x′ = 1. Use f′g + fg′.',
    'd/dx (1/x²) = 1/(2x) — Write it as x⁻² first: the derivative is −2x⁻³ = −2/x³.',
    'In the quotient rule the order does not matter — Swapping f′g and fg′ flips the sign of the answer.'
  ],
  formulas: [
    {
      name: 'Slope of c·xⁿ at a point',
      expr: 'k = c*n*a^(n - 1)', tex: 'k = c\\,n\\,a^{n-1}',
      vars: {
        k: { name: 'slope of the curve at x = a', signed: true },
        c: { name: 'coefficient c', value: 1, signed: true },
        n: { name: 'power n', value: 3, signed: true },
        a: { name: 'the point a (a > 0)', value: 2 }
      },
      note: 'The power rule evaluated at $x = a$. Negative and fractional powers are fine for $a > 0$: $n = -1$ gives the slope of $c/x$, $n = 0.5$ that of $c\\sqrt x$.',
      stories: { k: 'A curve is $y = c\\,x^n$ with $c$ = {c} and $n$ = {n}. How steep is it at $x$ = {a}?' }
    },
    {
      name: 'Product rule: a growing rectangle',
      expr: 'R = L*v + W*u', tex: '\\dot{A} = L\\,\\dot{W} + W\\,\\dot{L}',
      vars: {
        R: { name: 'rate of change of the area', tex: '\\dot{A}', unit: 'm²/s', signed: true },
        L: { name: 'length', q: 'length', unit: 'm', value: 4 },
        W: { name: 'width', q: 'length', unit: 'm', value: 3 },
        u: { name: 'rate of change of the length', tex: '\\dot{L}', q: 'speed', unit: 'm/s', value: 0.2, signed: true },
        v: { name: 'rate of change of the width', tex: '\\dot{W}', q: 'speed', unit: 'm/s', value: 0.1, signed: true }
      },
      note: 'Differentiate $A = LW$ with respect to time using the product rule. Each side\'s growth is multiplied by the other side.',
      stories: { R: 'A rectangle measures {L} by {W}. Its length grows at {u} and its width at {v}. How fast is its area growing (in m²/s)?' }
    }
  ],
  derivation: {
    title: 'The power rule for whole-number powers',
    steps: [
      { text: 'Expand $(x + h)^n$ with the [[binomial-theorem|binomial theorem]]:', tex: '(x + h)^n = x^n + n x^{n-1} h + \\binom{n}{2} x^{n-2} h^2 + \\cdots + h^n' },
      { text: 'Subtract $x^n$ and divide by $h$. Every term but the first still contains a factor $h$:', tex: '\\frac{(x+h)^n - x^n}{h} = n x^{n-1} + \\binom{n}{2}x^{n-2}h + \\cdots + h^{n-1}' },
      { text: 'Let $h \\to 0$:', tex: '\\frac{d}{dx}x^n = n x^{n-1}' },
      { text: 'The rule holds for all real $n$ too; the general proof uses $x^n = e^{n \\ln x}$ and the [[chain-rule|chain rule]].' }
    ]
  },
  examples: [
    {
      title: 'Powers in disguise',
      q: 'Differentiate $y = 3x^4 - \\dfrac{2}{x} + \\sqrt{x}$.',
      steps: [
        'Rewrite as powers: $y = 3x^4 - 2x^{-1} + x^{1/2}$.',
        'Term by term: $12x^3$, then $-2 \\cdot (-1) x^{-2} = 2x^{-2}$, then $\\tfrac12 x^{-1/2}$.',
        'So $\\dfrac{dy}{dx} = 12x^3 + \\dfrac{2}{x^2} + \\dfrac{1}{2\\sqrt x}$.'
      ],
      a: 'y′ = 12x³ + 2/x² + 1/(2√x)'
    },
    {
      title: 'Product rule',
      q: 'Differentiate $y = x^2 \\sin x$.',
      steps: [
        'Take $f = x^2$ and $g = \\sin x$, so $f\' = 2x$ and $g\' = \\cos x$ (see [[derivatives-of-functions]]).',
        '$y\' = f\'g + fg\' = 2x\\sin x + x^2 \\cos x$.'
      ],
      a: 'y′ = 2x sin x + x² cos x'
    },
    {
      title: 'Quotient rule',
      q: 'Differentiate $y = \\dfrac{x^2 + 1}{x - 1}$.',
      steps: [
        'Top $f = x^2 + 1$, $f\' = 2x$; bottom $g = x - 1$, $g\' = 1$.',
        { text: 'Apply the rule:', tex: 'y\' = \\frac{2x(x - 1) - (x^2 + 1)\\cdot 1}{(x - 1)^2} = \\frac{x^2 - 2x - 1}{(x-1)^2}' },
        'Check at $x = 2$: the formula gives $-1$. Numerically, $y(2.001) - y(1.999) \\approx -0.002$ over a step of $0.002$: slope $-1$.'
      ],
      a: 'y′ = (x² − 2x − 1)/(x − 1)²'
    }
  ],
  quiz: [
    { q: 'Differentiate $4x^3 - 5x^2 + 7$.', answer: '12x^2 - 10x', vars: ['x'],
      why: 'Term by term with the power rule; the constant 7 has derivative 0.' },
    { q: 'Differentiate $x^2 (x^3 + 1)$. (Expanding first is allowed.)', answer: '5x^4 + 2x', vars: ['x'],
      why: 'Expanded, it is $x^5 + x^2$ with derivative $5x^4 + 2x$. The product rule gives the same: $2x(x^3 + 1) + x^2 \\cdot 3x^2$.' },
    { q: 'The derivative of a product $uv$ is…', choices: ["$u'v'$", "$u'v + uv'$", "$u'v - uv'$", "$(u'v - uv')/v^2$"], a: 1,
      why: 'Both factors change; each change is weighted by the other factor. The last choice is the quotient rule.' },
    { q: 'Differentiate $\\dfrac{1}{x^3}$.', answer: '-3/x^4', vars: ['x'],
      why: '$x^{-3}$ has derivative $-3x^{-4} = -3/x^4$.' },
    { q: '$\\dfrac{d}{dx}\\sqrt x = \\dfrac{1}{2\\sqrt x}$.', a: true,
      why: '$\\sqrt x = x^{1/2}$, so the power rule gives $\\tfrac12 x^{-1/2}$.' }
  ],
  applications: [
    'Differentiating polynomial models: trajectories, cost curves, beam deflection formulas.',
    'Deriving physical relations such as dK/dv = mv and the rocket equation.',
    'Computer algebra systems apply exactly these rules, recursively, to any formula.'
  ],
  sim: 'calc-derivative-grapher'
},

{
  id: 'chain-rule', parent: 'differentiation', title: 'The chain rule', level: 2,
  short: 'How to differentiate a function of a function: multiply the rates of change along the chain, outside derivative times inside derivative.',
  keywords: ['chain rule', 'composite function', 'function of a function', 'outside inside', 'dy/du du/dx', 'nested functions', 'rates multiply'],
  prereq: ['differentiation-rules', 'composition-of-functions'],
  related: ['implicit-differentiation', 'related-rates', 'integration-by-substitution', 'derivatives-of-functions', 'partial-derivatives', 'physics:wave-properties'],
  body: `
Suppose a car's fuel use depends on its speed, and its speed depends on time. How fast is the fuel use changing in time? Rates along a chain **multiply**. If $y$ changes 3 times as fast as $u$, and $u$ changes 2 times as fast as $x$, then $y$ changes $3 \\times 2 = 6$ times as fast as $x$. In Leibniz notation:

$$\\frac{dy}{dx} = \\frac{dy}{du}\\cdot\\frac{du}{dx}.$$

It looks as if the $du$'s cancel, which is a good memory aid, and it is essentially the proof. In function notation, for a **composite** $y = f(g(x))$:

$$\\frac{d}{dx} f\\big(g(x)\\big) = f'\\big(g(x)\\big)\\cdot g'(x).$$

In words: **differentiate the outside function, leaving the inside alone, then multiply by the derivative of the inside.**

### Examples
- $(3x^2 + 1)^5$: outside $u^5$, inside $u = 3x^2 + 1$. Derivative $5(3x^2 + 1)^4 \\cdot 6x = 30x(3x^2+1)^4$. Expanding the power first would take a page.
- $\\sin(x^2)$: $\\cos(x^2)\\cdot 2x$.
- $e^{-kt}$: $e^{-kt} \\cdot (-k) = -k e^{-kt}$. This is why exponential decay obeys $dN/dt = -kN$.
- $\\sqrt{1 + x^2}$: $\\dfrac{1}{2\\sqrt{1 + x^2}}\\cdot 2x = \\dfrac{x}{\\sqrt{1 + x^2}}$.

Chains can be longer: $\\sin^3(2x) = [\\sin(2x)]^3$ has three links, giving $3\\sin^2(2x)\\cdot\\cos(2x)\\cdot 2$.

### The chain rule in physics
- **Changing variables in time.** Climb a mountain and the air temperature you feel changes at $\\dfrac{dT}{dt} = \\dfrac{dT}{dh}\\,\\dfrac{dh}{dt}$: about $-6.5$ K per km of height times your climbing speed.
- **Air pressure in a climbing aircraft.** With $P = P_0 e^{-h/H}$, the chain rule gives $\\dfrac{dP}{dt} = -\\dfrac{P}{H}\\,\\dfrac{dh}{dt}$ — the rate at which your ears feel the change (calculator below).
- **Waves.** For a travelling wave $y = A\\sin(kx - \\omega t)$, the inner function brings out a factor: $\\partial y/\\partial t = -A\\omega\\cos(kx - \\omega t)$, so the peak speed of each bit of string is $A\\omega$.
- **Energy.** $\\dfrac{d}{dt}\\left(\\tfrac12 m v^2\\right) = m v \\dfrac{dv}{dt} = F v$: the power delivered by a force.

The chain rule is also the engine behind [[implicit-differentiation|implicit differentiation]], [[related-rates|related rates]] and, run backwards, [[integration-by-substitution|integration by substitution]]. In machine learning, "backpropagation" is the chain rule applied through millions of nested functions.
`,
  ideas: [
    'Rates along a chain multiply: dy/dx = (dy/du)(du/dx).',
    'For f(g(x)): derivative of the outside at the inside, times the derivative of the inside.',
    'Forgetting the inner derivative is the commonest mistake in calculus.',
    'Long chains just give longer products, one factor per link.',
    'The chain rule underlies implicit differentiation, related rates and substitution.'
  ],
  pitfalls: [
    'd/dx sin(x²) = cos(x²) — The inside x² also changes: multiply by its derivative 2x, giving 2x cos(x²).',
    'd/dx (2x + 1)⁴ = 4(2x + 1)³ — The inner derivative is 2, so the answer is 8(2x + 1)³.',
    'The chain rule is only for "complicated" functions — Even e^(3x) or √(x + 1) are compositions; the inner derivative just happens to be simple.'
  ],
  formulas: [
    {
      name: 'Pressure change in a climbing aircraft',
      expr: 'Pd = -P*v/H', tex: '\\dot{P} = -\\frac{P}{H}\\,\\dot{h}',
      vars: {
        Pd: { name: 'rate of change of outside pressure', tex: '\\dot{P}', unit: 'Pa/s', signed: true },
        P: { name: 'air pressure at the current height', q: 'pressure', unit: 'kPa', value: 79.8 },
        H: { name: 'scale height of the atmosphere', q: 'length', unit: 'km', value: 8.4 },
        v: { name: 'rate of climb', tex: '\\dot{h}', q: 'speed', unit: 'm/s', value: 10, signed: true }
      },
      note: 'From $P = P_0 e^{-h/H}$: the chain rule gives $dP/dt = (dP/dh)(dh/dt) = -(P/H)\\,dh/dt$. Scale height about 8.4 km near the ground.',
      stories: {
        Pd: 'An airliner climbs at {v} through air at {P}. Taking a scale height of {H}, how fast does the outside pressure change (in Pa/s)?',
        v: 'Your ears can comfortably follow a pressure change of {Pd}. At a height where the pressure is {P} (scale height {H}), how fast may you climb?'
      }
    }
  ],
  derivation: {
    title: 'Why the rates multiply',
    steps: [
      { text: 'Let $u = g(x)$ and $y = f(u)$. A step $\\Delta x$ causes a change $\\Delta u$, which causes $\\Delta y$. When $\\Delta u \\ne 0$,', tex: '\\frac{\\Delta y}{\\Delta x} = \\frac{\\Delta y}{\\Delta u}\\cdot\\frac{\\Delta u}{\\Delta x}' },
      { text: 'As $\\Delta x \\to 0$, $\\Delta u \\to 0$ as well because $g$ is continuous, so each factor tends to its derivative:', tex: '\\frac{dy}{dx} = f\'(u)\\,g\'(x) = f\'\\big(g(x)\\big)\\,g\'(x)' },
      { text: 'A careful proof also handles functions for which $\\Delta u$ is zero infinitely often near the point, by comparing with the linear approximation of $f$ instead of dividing by $\\Delta u$.' }
    ]
  },
  examples: [
    {
      title: 'A power of a polynomial',
      q: 'Differentiate $y = (3x^2 + 1)^5$.',
      steps: [
        'Outside: $u^5$, with derivative $5u^4$. Inside: $u = 3x^2 + 1$, with derivative $6x$.',
        '$\\dfrac{dy}{dx} = 5(3x^2 + 1)^4\\cdot 6x = 30x\\,(3x^2 + 1)^4$.'
      ],
      a: '30x(3x² + 1)⁴'
    },
    {
      title: 'A bell curve',
      q: 'Differentiate $y = e^{-x^2/2}$ and find where it is steepest going down.',
      steps: [
        'Outside $e^u$ (its own derivative), inside $u = -x^2/2$ with derivative $-x$.',
        '$y\' = -x\\,e^{-x^2/2}$: positive for $x < 0$ (rising), negative for $x > 0$ (falling), zero at the peak $x = 0$.',
        'Differentiating again gives $y\'\' = (x^2 - 1)e^{-x^2/2}$, which is zero at $x = \\pm 1$: the steepest points are one standard deviation from the centre, where the slope is $\\mp e^{-1/2} = \\mp 0.607$.'
      ],
      a: 'y′ = −x e^(−x²/2); steepest descent at x = 1.'
    },
    {
      title: 'Popping ears',
      q: 'Air pressure falls with height roughly as $P = 101.3\\,e^{-h/8.4}$ kPa, with $h$ in km. A plane passes 2 km while climbing at 10 m/s. How fast is the outside pressure falling?',
      steps: [
        'At 2 km: $P = 101.3\\,e^{-2/8.4} = 101.3 \\times 0.788 = 79.8\\ \\mathrm{kPa}$.',
        'Chain rule: $\\dfrac{dP}{dt} = \\dfrac{dP}{dh}\\,\\dfrac{dh}{dt} = -\\dfrac{P}{H}\\,\\dfrac{dh}{dt}$.',
        'In SI units: $-\\dfrac{79\\,800\\ \\mathrm{Pa}}{8400\\ \\mathrm{m}} \\times 10\\ \\mathrm{m/s} = -95\\ \\mathrm{Pa/s}$.',
        'Over a minute that is almost 6 kPa, about 7% of the pressure: enough to make your ears pop.'
      ],
      a: 'About −95 Pa/s.'
    }
  ],
  quiz: [
    { q: 'Differentiate $(2x + 1)^4$.', answer: '8(2x + 1)^3', vars: ['x'],
      why: 'Outside derivative $4(2x+1)^3$, times the inner derivative 2.' },
    { q: 'Differentiate $\\sin(3x)$.', answer: '3cos(3x)', vars: ['x'],
      why: '$\\cos(3x)$ times the derivative of $3x$, which is 3.' },
    { q: 'Differentiate $e^{x^2}$.', answer: '2x e^(x^2)', vars: ['x'],
      why: 'The exponential is its own derivative; the inner function $x^2$ contributes the factor $2x$.' },
    { q: '$\\dfrac{d}{dx}\\sqrt{x^2 + 1} = $', choices: ['$\\dfrac{1}{2\\sqrt{x^2+1}}$', '$\\dfrac{x}{\\sqrt{x^2+1}}$', '$2x\\sqrt{x^2+1}$', '$\\dfrac{1}{2x}$'], a: 1,
      why: '$\\tfrac12(x^2+1)^{-1/2}\\cdot 2x$. The first choice forgets the inner derivative.' },
    { q: 'The derivative of $\\cos^2 x$ is $2\\cos x$.', a: false,
      why: 'It is $[\\cos x]^2$: the outside gives $2\\cos x$, the inside $\\cos x$ gives $-\\sin x$, so the answer is $-2\\sin x\\cos x = -\\sin 2x$.' }
  ],
  applications: [
    'Rates in time of anything that depends on a moving quantity: temperature on a climb, pressure in a lift, intensity as you walk from a lamp.',
    'Backpropagation in neural networks: the chain rule through many layers.',
    'Changing variables in physics, e.g. from time to position in dv/dt = v dv/dx.'
  ],
  sim: { id: 'calc-derivative-grapher', params: { fn: 'x e^(-x^2)' } }
},

{
  id: 'derivatives-of-functions', parent: 'differentiation', title: 'Derivatives of the standard functions', level: 2,
  short: 'The derivatives of exponentials, logarithms, trigonometric, inverse trigonometric and hyperbolic functions, and where they come from.',
  keywords: ['derivative of sin', 'derivative of cos', 'derivative of e^x', 'derivative of ln', 'derivative of tan', 'derivative of arctan', 'derivative of a^x', 'table of derivatives', 'radians'],
  prereq: ['differentiation-rules', 'trig-graphs', 'number-e', 'logarithms'],
  related: ['chain-rule', 'implicit-differentiation', 'hyperbolic-functions', 'inverse-trig', 'physics:simple-harmonic-motion', 'physics:radioactive-decay'],
  body: `
Beyond polynomials, a short list of functions covers nearly everything in science. Here are their derivatives; combine them with the product, quotient and [[chain-rule|chain]] rules and you can differentiate almost any formula.

| $f(x)$ | $f'(x)$ | Note |
|---|---|---|
| $e^x$ | $e^x$ | its own derivative |
| $a^x$ | $a^x \\ln a$ | since $a^x = e^{x\\ln a}$ |
| $\\ln x$ | $1/x$ | for $x > 0$ |
| $\\log_a x$ | $\\dfrac{1}{x\\ln a}$ | |
| $\\sin x$ | $\\cos x$ | $x$ in radians |
| $\\cos x$ | $-\\sin x$ | |
| $\\tan x$ | $\\sec^2 x = 1/\\cos^2 x$ | |
| $\\arcsin x$ | $1/\\sqrt{1 - x^2}$ | |
| $\\arctan x$ | $1/(1 + x^2)$ | |
| $\\sinh x$, $\\cosh x$ | $\\cosh x$, $\\sinh x$ | no minus sign |

### The exponential is special
Of all exponentials $a^x$, only one has slope exactly 1 where it crosses the $y$-axis. That base is [[number-e|the number e]], $e = 2.71828\\ldots$, and for it the slope everywhere equals the height: $\\dfrac{d}{dx}e^x = e^x$. Other bases pick up a constant factor $\\ln a$: $2^x$ grows at $0.693\\times 2^x$, $10^x$ at $2.303 \\times 10^x$. Anything that grows or decays at a rate proportional to its size (bacteria, [[physics:radioactive-decay|radioactive nuclei]], money at compound interest, charge on a discharging capacitor) is therefore an exponential.

### The logarithm
$\\ln x$ is the inverse of $e^x$, so its graph is the mirror image, and mirroring swaps rise and run: the slope becomes the reciprocal. At the point $(x, \\ln x)$ the mirror image has slope $1/e^{\\ln x} = 1/x$. The log grows ever more slowly: from $x = 100$ to $x = 101$, $\\ln x$ rises by only about $0.01$.

### Sine and cosine
Picture a point moving round the unit circle at unit speed. Its height is $\\sin t$ and its velocity is tangent to the circle, at right angles to the radius. That velocity's vertical part is $\\cos t$, so $(\\sin t)' = \\cos t$; its horizontal part is $-\\sin t$, so $(\\cos t)' = -\\sin t$. Differentiating four times brings you back to the start: $\\sin \\to \\cos \\to -\\sin \\to -\\cos \\to \\sin$.

This neat result needs **radians**. With the angle in degrees, $\\dfrac{d}{dx}\\sin(x°) = \\dfrac{\\pi}{180}\\cos(x°)$: an ugly factor that radians exist to remove.

### In physics
For [[physics:simple-harmonic-motion|simple harmonic motion]] $x = A\\cos\\omega t$, the chain rule gives $v = -A\\omega\\sin\\omega t$ and $a = -A\\omega^2\\cos\\omega t = -\\omega^2 x$. The acceleration is proportional to the displacement and opposite to it: exactly the signature of a spring. The peak speed is $A\\omega$ and the peak acceleration $A\\omega^2$.
`,
  ideas: [
    'd/dx eˣ = eˣ: the exponential with base e is its own derivative.',
    'd/dx ln x = 1/x; other bases bring in a factor ln a.',
    'd/dx sin x = cos x and d/dx cos x = −sin x, with angles in radians.',
    'Four derivatives of sin bring you back to sin: the root of all oscillation.',
    'Combine the table with the chain rule: d/dx e^(kx) = k e^(kx), d/dx sin(ωt) = ω cos(ωt).'
  ],
  pitfalls: [
    'd/dx aˣ = x aˣ⁻¹ — That is the power rule, which needs a fixed exponent. For a variable exponent, d/dx aˣ = aˣ ln a.',
    'd/dx cos x = sin x — There is a minus sign: cos starts falling as x grows from 0, so its slope there is −sin x ≤ 0.',
    'Using degrees in calculus — d/dx sin x = cos x only in radians; in degrees an extra factor π/180 appears.'
  ],
  formulas: [
    {
      name: 'Slope of an exponential bˣ',
      expr: 'k = b^x*ln(b)', tex: 'k = b^{x}\\ln b',
      vars: {
        k: { name: 'slope of y = bˣ', signed: true },
        b: { name: 'base b', value: 2 },
        x: { name: 'position x', value: 3, signed: true }
      },
      note: 'For $b = e$ the factor $\\ln b$ is 1 and the slope equals the height. For $0 < b < 1$ the slope is negative: decay.',
      stories: { k: 'How steep is the curve $y = b^x$ with $b$ = {b} at $x$ = {x}?' }
    },
    {
      name: 'Slope of a logarithm log_b x',
      expr: 'k = 1/(x*ln(b))', tex: 'k = \\frac{1}{x\\ln b}',
      vars: {
        k: { name: 'slope of y = log_b x' },
        x: { name: 'position x (x > 0)', value: 100 },
        b: { name: 'base b', value: 10 }
      },
      note: 'Logarithms flatten out: $\\log_{10} x$ climbs by only 0.0043 per unit at $x = 100$, which is why log scales squeeze huge ranges onto one axis.'
    }
  ],
  derivation: {
    title: 'The derivative of sin x from the definition',
    steps: [
      { text: 'Use the sum formula $\\sin(x + h) = \\sin x\\cos h + \\cos x \\sin h$ ([[sum-and-difference|sum and difference formulas]]):', tex: '\\frac{\\sin(x+h) - \\sin x}{h} = \\sin x\\,\\frac{\\cos h - 1}{h} + \\cos x\\,\\frac{\\sin h}{h}' },
      { text: 'Two limits are needed, both with $h$ in radians. The second is the squeeze-theorem limit from [[limits]]:', tex: '\\lim_{h \\to 0}\\frac{\\sin h}{h} = 1, \\qquad \\lim_{h\\to 0}\\frac{\\cos h - 1}{h} = \\lim_{h\\to 0}\\frac{-\\sin^2 h}{h(\\cos h + 1)} = 0' },
      { text: 'So the difference quotient tends to', tex: '\\frac{d}{dx}\\sin x = \\sin x\\cdot 0 + \\cos x\\cdot 1 = \\cos x' }
    ]
  },
  examples: [
    {
      title: 'Product and chain together',
      q: 'Differentiate $y = e^{3x}\\sin 2x$.',
      steps: [
        'Product rule with $f = e^{3x}$ ($f\' = 3e^{3x}$ by the chain rule) and $g = \\sin 2x$ ($g\' = 2\\cos 2x$).',
        '$y\' = 3e^{3x}\\sin 2x + 2e^{3x}\\cos 2x = e^{3x}(3\\sin 2x + 2\\cos 2x)$.'
      ],
      a: 'y′ = e^(3x)(3 sin 2x + 2 cos 2x)'
    },
    {
      title: 'A logarithm of a function',
      q: 'Differentiate $y = \\ln(x^2 + 1)$.',
      steps: [
        'Outside $\\ln u$ with derivative $1/u$; inside $u = x^2 + 1$ with derivative $2x$.',
        '$y\' = \\dfrac{2x}{x^2 + 1}$. In general $\\dfrac{d}{dx}\\ln g(x) = \\dfrac{g\'(x)}{g(x)}$, the relative rate of change of $g$.'
      ],
      a: 'y′ = 2x/(x² + 1)'
    },
    {
      title: 'A vibrating speaker cone',
      q: 'A speaker cone moves as $x = 0.05\\cos(4\\pi t)$ metres. Find its peak speed and peak acceleration.',
      steps: [
        '$v = \\dfrac{dx}{dt} = -0.05 \\cdot 4\\pi\\sin(4\\pi t)$, so the peak speed is $0.2\\pi = 0.628\\ \\mathrm{m/s}$.',
        '$a = \\dfrac{dv}{dt} = -0.05\\,(4\\pi)^2\\cos(4\\pi t)$, so the peak acceleration is $0.05 \\times 16\\pi^2 = 7.90\\ \\mathrm{m/s^2}$, about $0.8\\,g$.'
      ],
      a: '0.63 m/s and 7.9 m/s²'
    }
  ],
  quiz: [
    { q: 'Differentiate $x\\ln x$.', answer: 'ln(x) + 1', vars: ['x'],
      why: 'Product rule: $1\\cdot\\ln x + x \\cdot \\dfrac1x = \\ln x + 1$.' },
    { q: 'Differentiate $\\tan x$ (write your answer using sin, cos or sec).', answer: '1/cos(x)^2', vars: ['x'],
      why: 'Quotient rule on $\\sin x/\\cos x$: $\\dfrac{\\cos^2 x + \\sin^2 x}{\\cos^2 x} = \\dfrac{1}{\\cos^2 x} = \\sec^2 x$.' },
    { q: 'Differentiate $2^x$.', answer: '2^x ln(2)', vars: ['x'],
      why: '$2^x = e^{x\\ln 2}$, and the chain rule brings down the constant $\\ln 2 \\approx 0.693$.' },
    { q: 'With $x$ measured in degrees, $\\dfrac{d}{dx}\\sin x$ equals…', choices: ['$\\cos x$', '$\\dfrac{\\pi}{180}\\cos x$', '$\\dfrac{180}{\\pi}\\cos x$', '$-\\cos x$'], a: 1,
      why: '$\\sin(x°) = \\sin(\\pi x/180)$ in radians, and the chain rule brings out $\\pi/180$.' },
    { q: 'Apart from constant multiples (and zero), $e^x$ is the only function equal to its own derivative.', a: true,
      why: 'If $y\' = y$ then $(y e^{-x})\' = (y\' - y)e^{-x} = 0$, so $y e^{-x}$ is a constant $C$ and $y = Ce^x$.' }
  ],
  applications: [
    'Oscillators, waves and AC circuits: sine and cosine turn into each other under differentiation.',
    'Growth and decay: populations, radioactivity, discharging capacitors, cooling coffee.',
    'Sensitivity of logarithmic scales (decibels, pH, magnitudes) to changes in the underlying quantity.'
  ],
  sim: { id: 'calc-derivative-grapher', params: { fn: 'sin(x)' } }
},

{
  id: 'implicit-differentiation', parent: 'differentiation', title: 'Implicit differentiation', level: 2,
  short: 'Finding dy/dx when x and y are tied together by an equation instead of y = f(x): differentiate both sides, treating y as a function of x.',
  keywords: ['implicit differentiation', 'implicit function', 'dy/dx', 'tangent to a circle', 'logarithmic differentiation', 'x^x', 'derivative of inverse function'],
  prereq: ['chain-rule', 'circles'],
  related: ['related-rates', 'inverse-functions', 'derivatives-of-functions', 'partial-derivatives', 'physics:ideal-gas-law', 'physics:speed-of-sound'],
  body: `
Not every curve is the graph of a function. The circle $x^2 + y^2 = 25$ fails the vertical line test, yet near most of its points it is a perfectly smooth curve with a well-defined tangent. **Implicit differentiation** finds the slope without solving for $y$.

### The method
Treat $y$ as an unknown function of $x$ and differentiate **both sides** of the equation with respect to $x$. Whenever you differentiate something containing $y$, the [[chain-rule|chain rule]] attaches a factor $dy/dx$. Then solve for $dy/dx$.

For the circle:
$$\\frac{d}{dx}\\left(x^2 + y^2\\right) = \\frac{d}{dx}25 \\;\\Rightarrow\\; 2x + 2y\\,\\frac{dy}{dx} = 0 \\;\\Rightarrow\\; \\frac{dy}{dx} = -\\frac{x}{y}.$$

At $(3, 4)$ the slope is $-3/4$. The geometry agrees: the radius to $(3,4)$ has slope $4/3$, and a tangent to a circle is perpendicular to the radius, so its slope is the negative reciprocal. Notice that the answer involves both $x$ and $y$; that is normal, since one $x$ can belong to several points of the curve. At $(3, -4)$ the slope is $+3/4$.

The key step is $\\dfrac{d}{dx}\\,y^2 = 2y\\dfrac{dy}{dx}$, not $2y$. Forgetting the factor $dy/dx$ is the classic slip.

### Logarithmic differentiation
To differentiate awkward products, quotients or variable powers, take logarithms first. For $y = x^x$ (neither a power function nor an exponential):
$$\\ln y = x\\ln x \\;\\Rightarrow\\; \\frac{1}{y}\\frac{dy}{dx} = \\ln x + 1 \\;\\Rightarrow\\; \\frac{dy}{dx} = x^x(\\ln x + 1).$$

### Derivatives of inverse functions
Implicit differentiation explains the inverse-function entries in the [[derivatives-of-functions|table of derivatives]]. If $y = \\arcsin x$ then $\\sin y = x$; differentiate: $\\cos y\\,\\dfrac{dy}{dx} = 1$, so $\\dfrac{dy}{dx} = \\dfrac{1}{\\cos y} = \\dfrac{1}{\\sqrt{1 - x^2}}$ (using $\\cos y \\ge 0$ on the arcsine's range). The same argument gives $\\dfrac{d}{dx}\\ln x = 1/x$ from $e^y = x$.

### In physics: slopes of gas laws
Thermodynamics is full of implicit relations. For a gas kept at constant temperature, $PV = $ constant; differentiating gives $P + V\\,\\dfrac{dP}{dV} = 0$, so $\\dfrac{dP}{dV} = -\\dfrac{P}{V}$. For a quick (adiabatic) compression, $PV^{\\gamma} = $ constant, and
$$\\gamma P V^{\\gamma - 1} + V^{\\gamma}\\frac{dP}{dV} = 0 \\;\\Rightarrow\\; \\frac{dP}{dV} = -\\gamma\\,\\frac{P}{V}.$$
Sound waves are adiabatic compressions, and this steeper slope, a factor $\\gamma = 1.4$ for air, is exactly what Newton missed when he underestimated the [[physics:speed-of-sound|speed of sound]] by about 15%.
`,
  ideas: [
    'Differentiate both sides with respect to x, treating y as a function of x.',
    'Every term containing y picks up a factor dy/dx by the chain rule.',
    'The slope may depend on both x and y, because several points can share one x.',
    'Logarithmic differentiation handles variable powers such as xˣ.',
    'The derivatives of inverse functions (arcsin, ln) follow by differentiating sin y = x and eʸ = x.'
  ],
  pitfalls: [
    'd/dx (y²) = 2y — y depends on x, so the chain rule gives 2y · dy/dx.',
    'Implicit differentiation is only for curves you cannot solve for y — It works for any relation, and gives the same answer as solving first when that is possible.',
    'Forgetting the product rule on terms like xy — d/dx (xy) = y + x dy/dx.'
  ],
  formulas: [
    {
      name: 'Slope of a circle centred at the origin',
      expr: 'm = -x/y', tex: 'm = -\\frac{x}{y}',
      vars: {
        m: { name: 'slope of the tangent', signed: true },
        x: { name: 'x-coordinate of the point', value: 3, signed: true },
        y: { name: 'y-coordinate of the point', value: 4, signed: true }
      },
      note: 'From differentiating $x^2 + y^2 = r^2$. Any point $(x, y)$ with $y \\ne 0$ lies on exactly one such circle. At $y = 0$ the tangent is vertical.'
    },
    {
      name: 'Slope of an adiabat, PV^γ = constant',
      expr: 'k = -gam*P/V', tex: 'k = -\\gamma\\,\\frac{P}{V}',
      vars: {
        k: { name: 'slope dP/dV of the adiabat', unit: 'Pa/m³', signed: true },
        gam: { name: 'heat capacity ratio γ', tex: '\\gamma', value: 1.4 },
        P: { name: 'pressure', q: 'pressure', unit: 'kPa', value: 101.3 },
        V: { name: 'volume', q: 'volume', unit: 'L', value: 1 }
      },
      note: 'Implicit differentiation of $PV^{\\gamma} = $ const. With $\\gamma = 1$ it is the isothermal slope $-P/V$. $\\gamma$ is 1.4 for air, 1.67 for helium.'
    }
  ],
  examples: [
    {
      title: 'A tangent to a circle',
      q: 'Find the tangent line to $x^2 + y^2 = 25$ at $(3, 4)$.',
      steps: [
        'Differentiate: $2x + 2y\\,y\' = 0$, so $y\' = -x/y$.',
        'At $(3, 4)$: $y\' = -3/4$.',
        'Tangent: $y - 4 = -\\tfrac34(x - 3)$, or $3x + 4y = 25$.'
      ],
      a: 'y = −¾x + 25/4, i.e. 3x + 4y = 25'
    },
    {
      title: 'The folium of Descartes',
      q: 'Find the slope of $x^3 + y^3 = 6xy$ at the point $(3, 3)$.',
      steps: [
        'Check the point lies on the curve: $27 + 27 = 54 = 6\\cdot 3\\cdot 3$. It does.',
        'Differentiate both sides, using the product rule on $6xy$: $3x^2 + 3y^2 y\' = 6y + 6x y\'$.',
        'Collect the $y\'$ terms: $y\'(3y^2 - 6x) = 6y - 3x^2$, so $y\' = \\dfrac{2y - x^2}{y^2 - 2x}$.',
        'At $(3,3)$: $y\' = \\dfrac{6 - 9}{9 - 6} = -1$.'
      ],
      a: '−1'
    },
    {
      title: 'A variable power',
      q: 'Differentiate $y = x^x$ and evaluate the slope at $x = 2$.',
      steps: [
        'Take logs: $\\ln y = x\\ln x$.',
        'Differentiate: $\\dfrac{y\'}{y} = \\ln x + 1$, so $y\' = x^x(\\ln x + 1)$.',
        'At $x = 2$: $4(\\ln 2 + 1) = 4 \\times 1.693 = 6.77$.'
      ],
      a: 'y′ = xˣ(ln x + 1); 6.77 at x = 2'
    }
  ],
  quiz: [
    { q: 'For $x^2 + y^2 = 25$, $\\dfrac{dy}{dx} = $', choices: ['$-\\dfrac{x}{y}$', '$\\dfrac{x}{y}$', '$-\\dfrac{y}{x}$', '$-2x$'], a: 0,
      why: '$2x + 2y\\,y\' = 0$ gives $y\' = -x/y$.' },
    { q: 'Differentiating $y^3$ with respect to $x$ gives…', choices: ['$3y^2$', '$3y^2\\dfrac{dy}{dx}$', '$3x^2$', '$y^3\\dfrac{dy}{dx}$'], a: 1,
      why: 'The chain rule: the outside $u^3$ gives $3y^2$, and the inside $y(x)$ gives $dy/dx$.' },
    { q: 'For $xy = 1$, what is the slope at $(2, \\tfrac12)$?', choices: ['$-\\tfrac14$', '$-4$', '$\\tfrac14$', '$-2$'], a: 0,
      why: '$y + x\\,y\' = 0$ gives $y\' = -y/x = -\\tfrac{1/2}{2} = -\\tfrac14$. (Directly: $y = 1/x$, $y\' = -1/x^2 = -1/4$.)' },
    { q: 'Find $\\dfrac{dy}{dx}$ for $y = x^x$ with $x > 0$.', answer: 'x^x (ln(x) + 1)', vars: ['x'],
      why: 'Logarithmic differentiation: $\\ln y = x\\ln x$, so $y\'/y = \\ln x + 1$.' },
    { q: 'Implicit differentiation only works for curves that cannot be solved for $y$.', a: false,
      why: 'It works for any differentiable relation. When you can also solve for $y$, both methods give the same derivative.' }
  ],
  applications: [
    'Tangent lines to circles, ellipses and other conic sections.',
    'Slopes of isotherms and adiabats in thermodynamics, and hence compressibilities and the speed of sound.',
    'Derivatives of inverse functions: logarithms and inverse trigonometric functions.'
  ]
},

{
  id: 'higher-derivatives', parent: 'differentiation', title: 'Higher derivatives', level: 2,
  short: 'Differentiating again and again: the second derivative measures how the slope changes (concavity, acceleration), the third measures jerk, and so on.',
  keywords: ['second derivative', 'third derivative', 'concavity', 'concave up', 'concave down', 'inflection point', 'jerk', 'acceleration', 'nth derivative', 'curvature'],
  prereq: ['derivative', 'differentiation-rules'],
  related: ['curve-sketching', 'extrema', 'taylor-series', 'harmonic-oscillator-ode', 'physics:acceleration', 'physics:simple-harmonic-motion'],
  body: `
The derivative $f'$ is itself a function, so it can be differentiated in turn. The result is the **second derivative**,

$$f''(x) = \\frac{d}{dx}f'(x) = \\frac{d^2 y}{dx^2},$$

and you can keep going: $f'''$, $f^{(4)}$, …, $f^{(n)} = \\dfrac{d^n y}{dx^n}$.

### What the second derivative means
$f''$ is the rate of change of the slope. Where $f'' > 0$ the slope is increasing: the graph bends upwards, **concave up**, like a cup that holds water. Where $f'' < 0$ it bends downwards, **concave down**, like a cap. A point where the concavity changes is an **inflection point**. For $f(x) = x^3$: $f'' = 6x$, so the curve is concave down for $x < 0$, concave up for $x > 0$, with an inflection at the origin.

This gives a quick test for [[extrema]]: at a point where $f' = 0$, a positive $f''$ means the graph is a cup there, a local **minimum**; a negative $f''$ means a cap, a local **maximum**.

### Motion
For a position $x(t)$:

| Derivative | Meaning | Unit |
|---|---|---|
| $x$ | position | m |
| $\\dot x = dx/dt$ | velocity | m/s |
| $\\ddot x = d^2x/dt^2$ | acceleration | m/s² |
| $\\dddot{x}$, the third derivative | jerk | m/s³ |

[[physics:acceleration|Acceleration]] is the second derivative of position, which is why Newton's second law $F = m\\ddot x$ is a *second-order* [[differential-equations-intro|differential equation]]. **Jerk**, the rate of change of acceleration, is what makes a ride uncomfortable: lift and railway engineers shape their speed profiles to keep it small, typically below about 1–2 m/s³ for passenger comfort.

### Patterns
- A polynomial of degree $n$ becomes a constant after $n$ differentiations and 0 after $n + 1$.
- $\\dfrac{d^n}{dx^n}e^{kx} = k^n e^{kx}$.
- Sine and cosine cycle with period four: $\\sin \\to \\cos \\to -\\sin \\to -\\cos \\to \\sin$. So $\\dfrac{d^2}{dt^2}\\sin\\omega t = -\\omega^2\\sin\\omega t$, the equation of every [[physics:simple-harmonic-motion|simple harmonic oscillator]].

The derivatives at a single point hold a lot of information: the [[taylor-series|Taylor series]] rebuilds a whole function from $f(a), f'(a), f''(a), \\ldots$.

### Estimating from data
With measurements at equal spacing $h$, the second derivative is estimated by the **second difference**
$$f''(x) \\approx \\frac{f(x + h) - 2f(x) + f(x - h)}{h^2},$$
the difference of two neighbouring slopes divided by $h$. Engineers use it to get acceleration from position samples, and it is the building block of numerical methods for the [[heat-equation|heat]] and [[wave-equation|wave]] equations. The second derivative also measures how sharply a road or rail bends: the **radius of curvature** of $y(x)$ is $R = (1 + y'^2)^{3/2}/|y''|$.
`,
  ideas: [
    'f″ is the derivative of f′: the rate at which the slope changes.',
    'f″ > 0: concave up (cup); f″ < 0: concave down (cap); a sign change of f″ is an inflection point.',
    'Acceleration is the second derivative of position; jerk is the third.',
    'Second-derivative test: f′ = 0 with f″ > 0 is a minimum, with f″ < 0 a maximum.',
    'The second difference [f(x+h) − 2f(x) + f(x−h)]/h² estimates f″ from data.'
  ],
  pitfalls: [
    'f″(a) = 0 means a is an inflection point — Only if f″ changes sign there. For x⁴, f″(0) = 0 but the graph is concave up on both sides.',
    'The second derivative is the square of the first — (f′)² and f″ are unrelated: for x², (f′)² = 4x² but f″ = 2.',
    'Concave up means increasing — e⁻ˣ is concave up and decreasing. Concavity describes bending, not direction.'
  ],
  formulas: [
    {
      name: 'Second derivative from three samples',
      expr: 'a = (x2 - 2*x1 + x0)/h^2', tex: 'a \\approx \\frac{x_2 - 2x_1 + x_0}{h^2}',
      vars: {
        a: { name: 'second derivative (acceleration)', q: 'accel', unit: 'm/s²', signed: true },
        x2: { name: 'position at t + h', q: 'length', unit: 'm', value: 15.4, signed: true },
        x1: { name: 'position at t', q: 'length', unit: 'm', value: 12.6, signed: true },
        x0: { name: 'position at t − h', q: 'length', unit: 'm', value: 10.0, signed: true },
        h: { name: 'time between samples', q: 'time', unit: 's', value: 0.5 }
      },
      note: 'The error shrinks like $h^2$, but measurement noise is amplified by $1/h^2$: with noisy data, a very small $h$ makes the estimate worse, not better.',
      stories: { a: 'A car\'s GPS logs positions {x0}, {x1} and {x2} at intervals of {h}. Estimate its acceleration at the middle reading.' }
    },
    {
      name: 'Radius of curvature of a graph',
      expr: 'R = (1 + s^2)^1.5/q', tex: 'R = \\frac{(1 + s^2)^{3/2}}{q}',
      vars: {
        R: { name: 'radius of curvature', q: 'length', unit: 'm' },
        s: { name: 'slope y′ at the point', value: 0.2, signed: true },
        q: { name: 'size of the second derivative |y″|', unit: '1/m', value: 0.002 }
      },
      note: 'The radius of the circle that best hugs the curve at that point. Where the graph is nearly flat ($s \\approx 0$), $R \\approx 1/|y\'\'|$.',
      stories: { R: 'A road follows $y = 0.001x^2$ (metres). At a point where its slope is {s} and $|y\'\'|$ = {q}, what is the radius of the bend?' }
    }
  ],
  examples: [
    {
      title: 'Concavity and inflection points',
      q: 'Where is $f(x) = x^4 - 4x^3$ concave up, and where are its inflection points?',
      steps: [
        '$f\'(x) = 4x^3 - 12x^2$ and $f\'\'(x) = 12x^2 - 24x = 12x(x - 2)$.',
        '$f\'\'$ is positive for $x < 0$, negative for $0 < x < 2$, positive for $x > 2$.',
        'So $f$ is concave up on $(-\\infty, 0)$ and $(2, \\infty)$, concave down on $(0, 2)$, with inflection points at $x = 0$ and $x = 2$ (heights $0$ and $-16$).'
      ],
      a: 'Concave up for x < 0 and x > 2; inflection points (0, 0) and (2, −16).'
    },
    {
      title: 'Motion from a formula',
      q: 'A particle moves along a line with $x(t) = t^3 - 6t^2 + 9t$ (metres, seconds). Find its velocity and acceleration at $t = 1$ s and at $t = 3$ s.',
      steps: [
        '$v = \\dot x = 3t^2 - 12t + 9 = 3(t - 1)(t - 3)$ and $a = \\ddot x = 6t - 12$.',
        'At $t = 1$: $v = 0$, $a = -6\\ \\mathrm{m/s^2}$. The particle is momentarily at rest and about to move backwards.',
        'At $t = 3$: $v = 0$, $a = +6\\ \\mathrm{m/s^2}$. It stops again and turns forwards.'
      ],
      a: 't = 1: v = 0, a = −6 m/s²; t = 3: v = 0, a = +6 m/s².'
    },
    {
      title: 'Many derivatives at once',
      q: 'Find $\\dfrac{d^{10}}{dx^{10}}e^{2x}$ and $\\dfrac{d^{4}}{dx^{4}}\\sin x$.',
      steps: [
        'Each differentiation of $e^{2x}$ multiplies by 2, so ten give $2^{10}e^{2x} = 1024\\,e^{2x}$.',
        'Four derivatives of $\\sin x$ complete one cycle: $\\cos x, -\\sin x, -\\cos x, \\sin x$.'
      ],
      a: '1024 e^(2x) and sin x'
    }
  ],
  quiz: [
    { q: 'Find $f\'\'(x)$ for $f(x) = x^4$.', answer: '12x^2', vars: ['x'],
      why: '$f\' = 4x^3$, then $f\'\' = 12x^2$.' },
    { q: 'Find the second derivative of $\\sin(3x)$.', answer: '-9sin(3x)', vars: ['x'],
      why: 'Each differentiation brings out a factor 3; the second also brings a minus sign: $3\\cos 3x$, then $-9\\sin 3x$.' },
    { q: 'At a point where $f\'(a) = 0$ and $f\'\'(a) > 0$, the graph has…', choices: ['a local maximum', 'a local minimum', 'an inflection point', 'a vertical tangent'], a: 1,
      why: 'A horizontal tangent on a cup-shaped (concave up) curve is the bottom of the cup.' },
    { q: 'The 100th derivative of $\\cos x$ is…', choices: ['$\\cos x$', '$-\\cos x$', '$\\sin x$', '$-\\sin x$'], a: 0,
      why: 'Derivatives of $\\cos$ repeat every four steps, and 100 is a multiple of 4.' },
    { q: 'If $f\'\'(a) = 0$, then $a$ is an inflection point.', a: false,
      why: 'The concavity must actually change. For $f(x) = x^4$, $f\'\'(0) = 0$ but the curve is concave up on both sides.' }
  ],
  applications: [
    'Acceleration and jerk in vehicle and lift design.',
    'Bending of beams: the deflection y(x) of a beam satisfies EI y″ = M(x), the bending moment.',
    'The second-derivative test for maxima and minima, and Taylor series for approximations.'
  ],
  sim: { id: 'calc-derivative-grapher', params: { fn: 'x^4/4 - x^2', second: true } }
}

);
