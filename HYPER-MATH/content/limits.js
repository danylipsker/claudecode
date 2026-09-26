/* HYPER-MATH · content/limits.js — limits and continuity: what a function
 * approaches, when it has no jumps, and how it behaves far away. */
Hyper.add(

{
  id: 'limits', parent: 'limits-continuity', title: 'Limits', level: 1,
  short: 'The value a function gets as close as you like to when its input approaches a point, whether or not the function is defined there.',
  keywords: ['limit', 'approach', 'tends to', 'one-sided limit', 'epsilon delta', 'squeeze theorem', 'sandwich theorem', '0/0', 'indeterminate', 'sin x over x'],
  prereq: ['functions', 'absolute-value', 'factoring'],
  related: ['continuity', 'limits-at-infinity', 'derivative', 'lhopitals-rule', 'sequences', 'physics:speed-velocity'],
  body: `
Try to evaluate $f(x) = \\dfrac{x^2 - 1}{x - 1}$ at $x = 1$ and you get $0/0$, which means nothing. Yet the function is perfectly well behaved *near* 1:

| $x$ | 0.9 | 0.99 | 0.999 | 1.001 | 1.01 | 1.1 |
|---|---|---|---|---|---|---|
| $f(x)$ | 1.9 | 1.99 | 1.999 | 2.001 | 2.01 | 2.1 |

As $x$ closes in on 1 from either side, $f(x)$ closes in on 2. We write

$$\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} = 2$$

and say "the limit of $f(x)$ as $x$ tends to 1 is 2". The algebra agrees: for $x \\ne 1$ the fraction simplifies to $x + 1$, a straight line with a single point punched out of it. The graph has a **hole** at $(1, 2)$, and the limit is the height of the hole. A limit is about what happens *near* a point, never *at* it.

### When there is no limit
- **Different sides disagree.** $|x|/x$ is $-1$ just left of 0 and $+1$ just right of it. The **one-sided limits** $\\lim_{x \\to 0^-}$ and $\\lim_{x \\to 0^+}$ exist but differ, so the two-sided limit does not exist.
- **The values blow up.** $1/x^2$ grows without bound near 0. We write $\\lim_{x \\to 0} 1/x^2 = \\infty$, which is shorthand for "no finite limit, and here is how it fails".
- **The values never settle.** $\\sin(1/x)$ swings between $-1$ and $1$ infinitely often as $x \\to 0$.

### Finding limits
1. **Substitute.** For polynomials, $\\sin$, $\\exp$ and other [[continuity|continuous]] functions, the limit is just the value: $\\lim_{x\\to 2}(x^2 + 3) = 7$.
2. **Simplify a 0/0.** Factor and cancel, as above, or multiply by a conjugate to clear a square root.
3. **Squeeze.** If $g(x) \\le f(x) \\le h(x)$ near $a$ and $g$ and $h$ share the limit $L$, then so does $f$. Squeezing gives the most important limit in calculus, $\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$ (with $x$ in radians). At $x = 0.1$ the ratio is already $0.99833$.

The **limit laws** let you split problems up: the limit of a sum, product or quotient is the sum, product or quotient of the limits, as long as each exists and you never divide by a limit of zero.

### The precise definition
"As close as you like" can be made exact. $\\lim_{x \\to a} f(x) = L$ means: for every tolerance $\\varepsilon > 0$ there is a $\\delta > 0$ such that
$$0 < |x - a| < \\delta \\;\\Rightarrow\\; |f(x) - L| < \\varepsilon.$$
Think of it as a game. A sceptic names how close to $L$ the output must be; you reply with how close to $a$ the input must be. If you can always win, however small $\\varepsilon$ gets, the limit is $L$. The simulation lets you play it.

### Why it matters
Every idea in calculus is a limit in disguise. The [[derivative]] is the limit of average slopes over shrinking intervals, which is how physics defines [[physics:speed-velocity|instantaneous velocity]]. The [[definite-integral|definite integral]] is the limit of sums of ever thinner strips. Limits are what let calculus divide by "nothing" without dividing by zero.
`,
  ideas: [
    'A limit describes what f(x) approaches as x approaches a, not the value f(a).',
    'The limit exists only if the left-hand and right-hand limits exist and agree.',
    'A 0/0 form is a question, not an answer: simplify, rationalise or squeeze to find the limit.',
    'For continuous functions the limit is simply the value at the point.',
    'Formally: for every ε > 0 there is a δ > 0 that keeps f(x) within ε of L whenever x is within δ of a.'
  ],
  pitfalls: [
    'If f(a) is undefined, the limit at a cannot exist — The value at a is never consulted. (x² − 1)/(x − 1) is undefined at 1 but has limit 2 there.',
    'The limit is whatever you get by plugging in — Only for continuous functions. A step function has value 1 at 0 but no limit there.',
    'A table of values proves the limit — Tables suggest; they can mislead (sin(π/x) is 0 at x = 1, ½, ⅓, … yet has no limit at 0). Algebra or the squeeze theorem proves.'
  ],
  formulas: [
    {
      name: 'The largest δ for a straight line',
      expr: 'delta = eps/m', tex: '\\delta = \\frac{\\varepsilon}{|m|}',
      vars: {
        delta: { name: 'largest δ that works', tex: '\\delta' },
        eps: { name: 'tolerance ε on the output', tex: '\\varepsilon', value: 0.01 },
        m: { name: 'size of the slope |m|', value: 3 }
      },
      note: 'For $f(x) = mx + c$ the output changes $|m|$ times as much as the input, so an input tolerance of $\\varepsilon/|m|$ is exactly enough. For curves, $\\delta$ also depends on where you are.',
      stories: {
        delta: 'You need $3x - 1$ to stay within {eps} of its limit 5 as $x \\to 2$. The slope has size {m}. How close to 2 must $x$ be?',
        eps: 'Keeping $x$ within {delta} of the point, how far can a line of slope size {m} stray from its limit?'
      }
    }
  ],
  derivation: {
    title: 'Why sin x / x → 1: a squeeze in the unit circle',
    steps: [
      { text: 'Take $0 < x < \\pi/2$ in radians and draw the unit circle. The triangle inside the sector, the sector itself and the tangent triangle outside it are nested, so their areas are in order:', tex: '\\tfrac12 \\sin x \\;\\le\\; \\tfrac12 x \\;\\le\\; \\tfrac12 \\tan x' },
      { text: 'Divide by $\\tfrac12 \\sin x > 0$ and take reciprocals, which reverses the inequalities:', tex: '\\cos x \\;\\le\\; \\frac{\\sin x}{x} \\;\\le\\; 1' },
      { text: 'Both outer functions tend to 1 as $x \\to 0^+$, so the middle one is squeezed to 1. Since $\\sin x / x$ is even, the left-hand limit is the same:', tex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },
      { text: 'This result is what makes the derivative of $\\sin x$ equal to $\\cos x$ — and it only holds when angles are measured in radians.' }
    ]
  },
  examples: [
    {
      title: 'Factor and cancel',
      q: 'Find $\\displaystyle\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$.',
      steps: [
        'Substituting gives $0/0$, so simplify first.',
        'Factor the top: $x^2 - 9 = (x - 3)(x + 3)$. For $x \\ne 3$ the fraction equals $x + 3$.',
        'The limit ignores $x = 3$ itself, so $\\lim_{x \\to 3} (x + 3) = 6$.'
      ],
      a: '6'
    },
    {
      title: 'Clearing a square root',
      q: 'Find $\\displaystyle\\lim_{x \\to 0} \\frac{\\sqrt{x + 9} - 3}{x}$.',
      steps: [
        'Again $0/0$. Multiply top and bottom by the conjugate $\\sqrt{x+9} + 3$:',
        { text: 'The top becomes a difference of squares:', tex: '\\frac{(x + 9) - 9}{x\\,(\\sqrt{x+9} + 3)} = \\frac{1}{\\sqrt{x + 9} + 3}' },
        'Now substitute: $\\dfrac{1}{3 + 3} = \\dfrac16$.',
        'Check numerically: at $x = 0.01$ the original fraction is $0.16662$.'
      ],
      a: '1/6 ≈ 0.1667'
    },
    {
      title: 'Winning the ε–δ game',
      q: 'Show that $\\lim_{x \\to 2} (3x - 1) = 5$, and find $\\delta$ when $\\varepsilon = 0.01$.',
      steps: [
        'We need $|(3x - 1) - 5| < \\varepsilon$, that is $|3x - 6| = 3|x - 2| < \\varepsilon$.',
        'This holds whenever $|x - 2| < \\varepsilon/3$, so choose $\\delta = \\varepsilon/3$. Since that works for every $\\varepsilon > 0$, the limit is 5.',
        'For $\\varepsilon = 0.01$: $\\delta = 0.00333$. Any $x$ between 1.99667 and 2.00333 keeps $3x - 1$ within 0.01 of 5.'
      ],
      a: 'δ = ε/3; for ε = 0.01, δ ≈ 0.0033.'
    }
  ],
  quiz: [
    { q: 'What is $\\displaystyle\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$?', choices: ['0', '1', '2', 'It does not exist, because of 0/0'], a: 2,
      why: 'For $x \\ne 1$ the fraction equals $x + 1$, which approaches 2. The $0/0$ at $x = 1$ only says that substitution fails, not that the limit is missing.' },
    { q: 'If $f(2)$ is undefined, then $\\lim_{x\\to 2} f(x)$ cannot exist.', a: false,
      why: 'Limits never look at the point itself, only at points near it. A graph with a hole still has a limit: the height of the hole.' },
    { q: 'What is $\\displaystyle\\lim_{x \\to 0} \\frac{|x|}{x}$?', choices: ['1', '−1', '0', 'It does not exist'], a: 3,
      why: 'From the right the ratio is $+1$, from the left $-1$. The one-sided limits disagree, so there is no two-sided limit.' },
    { q: 'Simplify $\\dfrac{x^2 - 9}{x - 3}$ for $x \\ne 3$ (the expression whose value at 3 gives the limit).', answer: 'x + 3', vars: ['x'],
      why: '$x^2 - 9 = (x-3)(x+3)$; cancel the common factor, which is allowed because $x \\ne 3$.' },
    { q: 'Since $-x^2 \\le x^2 \\sin(1/x) \\le x^2$, the limit of $x^2\\sin(1/x)$ as $x \\to 0$ is…', choices: ['0', '1', 'undefined, because sin(1/x) has no limit', '−1'], a: 0,
      why: 'Both bounds tend to 0, so the squeeze theorem forces the middle to 0 as well, even though $\\sin(1/x)$ on its own never settles.' }
  ],
  applications: [
    'Instantaneous velocity and every other rate of change are limits of averages.',
    'Numerical software replaces limits by very small steps; understanding the limit tells you how small is small enough.',
    'Limits of sequences decide whether iterative methods (Newton\'s method, series for π or e) converge.'
  ],
  history: 'Newton and Leibniz built calculus in the 1660s–1680s on "vanishing quantities" that critics such as Bishop Berkeley mocked as "ghosts of departed quantities". Bolzano and Cauchy in the early nineteenth century made limits the foundation, and Weierstrass gave the ε–δ definition its modern form around 1860.',
  sim: 'calc-epsilon-delta'
},

{
  id: 'continuity', parent: 'limits-continuity', title: 'Continuity', level: 1,
  short: 'A function is continuous at a point when its limit there equals its value: the graph passes through without a hole, jump or blow-up.',
  keywords: ['continuous', 'discontinuity', 'removable discontinuity', 'jump', 'intermediate value theorem', 'bisection', 'extreme value theorem', 'step function'],
  prereq: ['limits', 'functions'],
  related: ['derivative', 'extrema', 'newtons-method', 'limits-at-infinity', 'physics:rc-circuits'],
  body: `
Informally, a function is **continuous** if you can draw its graph without lifting the pen. Precisely, $f$ is continuous at $a$ when three things hold:

1. $f(a)$ is defined,
2. $\\lim_{x \\to a} f(x)$ exists, and
3. the two are equal: $\\lim_{x \\to a} f(x) = f(a)$.

Small changes in the input then cause only small changes in the output, which is what makes measurement possible at all: a thermometer read at 20.0 °C or 20.1 °C should not report wildly different states of the world.

### Ways to fail
| Kind | Example at $x = 0$ | What goes wrong |
|---|---|---|
| Removable (a hole) | $\\sin x / x$ | the limit exists but $f(0)$ is missing or wrong; define $f(0) = 1$ and the hole is filled |
| Jump | the step $H(x)$: 0 for $x<0$, 1 for $x\\ge 0$ | the one-sided limits differ |
| Infinite | $1/x$ | the function blows up |
| Oscillating | $\\sin(1/x)$ | the values never settle |

The good news is that almost every formula you meet is continuous wherever it is defined: polynomials, $e^x$, $\\sin x$ and $\\cos x$ everywhere; rational functions, $\\ln x$ and $\\tan x$ on their domains. Sums, products, quotients (away from zeros of the denominator) and [[composition-of-functions|compositions]] of continuous functions are continuous.

### The intermediate value theorem
If $f$ is continuous on $[a, b]$, it takes **every** value between $f(a)$ and $f(b)$ somewhere in between. A continuous path from below sea level to a mountain top must cross every height on the way. In particular, if $f(a)$ and $f(b)$ have opposite signs, $f$ has a **root** between them.

That turns into an algorithm, **bisection**: check the sign at the midpoint, keep the half where the sign changes, repeat. Each step halves the interval, so after $n$ steps the root is pinned to within $(b - a)/2^n$. Twenty steps shrink an interval of width 1 below $10^{-6}$. Bisection is slow but it never fails, which is why solvers often use it as a safety net under faster methods such as [[newtons-method|Newton's method]].

### The extreme value theorem
A function continuous on a **closed** interval $[a, b]$ has a largest and a smallest value there. Both conditions matter: $1/x$ on $(0, 1]$ has no maximum, and neither does $x$ on the open interval $(0, 1)$. This theorem is what guarantees that the search for [[extrema|maxima and minima]] has something to find.

### Continuity and smoothness
Every [[derivative|differentiable]] function is continuous, but not the other way round: $|x|$ is continuous at 0 yet has a corner there. Continuity forbids jumps; differentiability also forbids corners.

> [!note] Physics idealises some quantities as jumping — the voltage when a switch closes, the density at the surface of a solid. In an [[physics:rc-circuits|RC circuit]] the current may jump when the switch closes, but the capacitor's voltage cannot, because charge takes time to arrive. Deciding which quantities must be continuous is often the key step in solving such problems.
`,
  ideas: [
    'Continuous at a: f(a) exists, the limit exists, and they are equal.',
    'Discontinuities come as holes (removable), jumps, blow-ups or wild oscillations.',
    'Intermediate value theorem: a continuous function cannot skip values, so a sign change means a root.',
    'Bisection halves the bracket around a root at every step.',
    'Differentiable implies continuous, but continuous functions can still have corners.'
  ],
  pitfalls: [
    'Continuous means differentiable — |x| is continuous everywhere but has no derivative at 0, where it has a corner.',
    'A function that is not defined at a point is discontinuous "for no reason" — Often the gap can be filled: (x² − 4)/(x − 2) becomes continuous if you define its value at 2 to be 4.',
    'The intermediate value theorem finds the root — It only promises one exists. Bisection or Newton\'s method then locates it.'
  ],
  formulas: [
    {
      name: 'Bisection: halvings needed for a tolerance',
      expr: 'n = log2(w/eps)', tex: 'n = \\log_2 \\frac{w}{\\varepsilon}',
      vars: {
        n: { name: 'number of halvings (round up)' },
        w: { name: 'width of the starting interval', value: 1 },
        eps: { name: 'required accuracy', tex: '\\varepsilon', value: 0.000001 }
      },
      note: 'Each halving gains one binary digit, about 0.3 decimal digits. Round $n$ up to the next whole number.',
      stories: { n: 'A root is known to lie in an interval of width {w}. How many bisection steps pin it down to within {eps}?' }
    }
  ],
  examples: [
    {
      title: 'Gluing two pieces together',
      q: 'For which $k$ is $f(x) = \\begin{cases} x^2 + k & x < 1 \\\\ 3x - 1 & x \\ge 1 \\end{cases}$ continuous?',
      steps: [
        'Each piece is a polynomial, so the only question is the join at $x = 1$.',
        'From the left: $\\lim_{x \\to 1^-} f(x) = 1 + k$. From the right and at the point: $f(1) = 3 - 1 = 2$.',
        'Continuity needs $1 + k = 2$, so $k = 1$.'
      ],
      a: 'k = 1'
    },
    {
      title: 'A root by bisection',
      q: 'Show that $x^3 + x - 1 = 0$ has a root between 0 and 1, and narrow it down.',
      steps: [
        '$f(0) = -1 < 0$ and $f(1) = 1 > 0$, and $f$ is a continuous polynomial, so by the intermediate value theorem there is a root in $(0, 1)$.',
        '$f(0.5) = -0.375 < 0$: the root is in $(0.5, 1)$.',
        '$f(0.75) = 0.172 > 0$: the root is in $(0.5, 0.75)$.',
        '$f(0.625) = -0.131 < 0$: the root is in $(0.625, 0.75)$.',
        'Continuing, the interval closes in on $x = 0.6823$. Since $f\'(x) = 3x^2 + 1 > 0$, this is the only real root.'
      ],
      a: 'The root is x ≈ 0.6823.'
    }
  ],
  quiz: [
    { q: 'Which of these functions is continuous at $x = 0$?', choices: ['$|x|$', '$1/x$', '$|x|/x$', 'the step function $H(x)$'], a: 0,
      why: '$|x|$ has a corner at 0 but no gap. $1/x$ blows up, while $|x|/x$ and the step function jump.' },
    { q: 'Every continuous function is differentiable.', a: false,
      why: 'Continuity forbids jumps, not corners. $|x|$ at 0 is the standard counterexample.' },
    { q: '$f$ is continuous on $[1, 3]$ with $f(1) = 4$ and $f(3) = -2$. Which statement must be true?', choices: ['f has a maximum at x = 1', 'f(2) = 1', 'f(c) = 0 for some c between 1 and 3', 'f is decreasing'], a: 2,
      why: 'The intermediate value theorem guarantees every value between $-2$ and $4$, including 0. Nothing forces the other statements.' },
    { q: 'What value should $f(2)$ have to make $f(x) = \\dfrac{x^2 - 4}{x - 2}$ continuous at $x = 2$?', choices: ['0', '2', '4', 'No value works'], a: 2,
      why: 'For $x \\ne 2$, $f(x) = x + 2 \\to 4$. Defining $f(2) = 4$ fills the hole: the discontinuity was removable.' }
  ],
  applications: [
    'Root finding: bisection, and the safety checks inside every equation solver.',
    'Guaranteeing that an optimisation problem on a closed range actually has a best answer.',
    'Deciding which physical quantities must be continuous across a boundary (temperature in a wall, voltage on a capacitor).'
  ],
  sim: { id: 'calc-epsilon-delta', params: { fn: 4 } }
},

{
  id: 'limits-at-infinity', parent: 'limits-continuity', title: 'Limits at infinity and asymptotes', level: 2,
  short: 'How a function behaves as its input grows without bound, and the lines its graph approaches: horizontal, vertical and slanted asymptotes.',
  keywords: ['limit at infinity', 'asymptote', 'horizontal asymptote', 'vertical asymptote', 'oblique asymptote', 'slant asymptote', 'end behaviour', 'dominant term', 'growth rates'],
  prereq: ['limits', 'rational-functions', 'exponential-functions'],
  related: ['lhopitals-rule', 'curve-sketching', 'improper-integrals', 'convergence-tests', 'number-e', 'physics:drag-force', 'physics:rc-circuits'],
  body: `
Many questions in science are about the long run. Where does a falling skydiver's speed end up? What voltage does a charging capacitor approach? How does a population behave after a century? Each asks for a **limit at infinity**:

$$\\lim_{x \\to \\infty} f(x) = L$$

means that $f(x)$ can be made as close to $L$ as you like by taking $x$ large enough. The line $y = L$ is then a **horizontal asymptote**: the graph hugs it far out to the right.

### Rational functions: the leading terms win
For large $x$ only the highest powers matter. Divide top and bottom by the highest power in the denominator:

$$\\frac{3x^2 - 5x}{6x^2 + 1} = \\frac{3 - 5/x}{6 + 1/x^2} \\;\\to\\; \\frac{3}{6} = \\frac12.$$

At $x = 1000$ the value is already $0.49917$. The rule of thumb:

- degree of top **less** than bottom: the limit is 0;
- degrees **equal**: the ratio of the leading coefficients;
- top degree **greater**: no finite limit. If it is greater by exactly one, the graph approaches a slanted line, an **oblique asymptote**. For example $\\dfrac{x^2 + 3x + 1}{x} = x + 3 + \\dfrac1x$ hugs the line $y = x + 3$.

### Vertical asymptotes
Where a denominator vanishes and the top does not, the function blows up: $\\dfrac{2x+1}{x-3}$ heads to $+\\infty$ as $x \\to 3^+$ and to $-\\infty$ as $x \\to 3^-$, so $x = 3$ is a **vertical asymptote**. (If the top vanishes too, look closer: it may be only a removable hole, as on the [[limits]] page.)

### Who grows fastest
As $x \\to \\infty$,
$$\\ln x \\;\\ll\\; x^p \\;\\ll\\; e^{x} \\qquad (p > 0),$$
where $\\ll$ means "is eventually negligible compared with". Any exponential beats any power, and any power beats the logarithm: $x^{100}e^{-x} \\to 0$ and $\\dfrac{\\ln x}{\\sqrt x} \\to 0$, although both take a while to show it. [[lhopitals-rule|L'Hôpital's rule]] proves these rankings. Radioactive decay, drug clearance and discharging capacitors all die away exponentially, which is why a factor such as $t^2$ in front never rescues them.

### Physics in the long run
A capacitor charging through a resistor has voltage $V(t) = V_0(1 - e^{-t/\\tau})$, which tends to $V_0$. The gap still to go, $V_0 e^{-t/\\tau}$, shrinks by a factor $e$ every time constant $\\tau$: after $5\\tau$ less than 1% remains, which is why engineers treat five time constants as "fully charged". A skydiver's speed approaches the [[physics:drag-force|terminal velocity]] in the same asymptotic way, and the famous limit
$$\\lim_{n \\to \\infty}\\left(1 + \\frac1n\\right)^n = e \\approx 2.71828$$
comes from compounding interest ever more often (see [[number-e|the number e]]).

> [!warn] A graph may cross its horizontal asymptote — even infinitely often, like $\\sin x / x$ crossing $y = 0$. The asymptote only describes where the graph ends up.
`,
  ideas: [
    'A horizontal asymptote y = L means f(x) → L as x → ∞ (or −∞).',
    'For rational functions compare the degrees: the leading terms decide the end behaviour.',
    'A vertical asymptote appears where the function blows up, typically where a denominator vanishes.',
    'Exponentials outgrow every power, and every power outgrows the logarithm.',
    'Exponential approach closes the remaining gap by a factor e every time constant.'
  ],
  pitfalls: [
    'Infinity is a number you can substitute — ∞/∞ and ∞ − ∞ are not numbers; rewrite the expression (divide by the dominant term, rationalise) before taking the limit.',
    'A graph never crosses its asymptote — Horizontal asymptotes describe the far ends only; sin x / x crosses y = 0 again and again.',
    'Every zero of a denominator is a vertical asymptote — Not if the numerator vanishes there too; (x² − 1)/(x − 1) just has a hole at 1.'
  ],
  formulas: [
    {
      name: 'Closing the gap to an exponential asymptote',
      expr: 'r = exp(-t/tau)', tex: 'r = e^{-t/\\tau}',
      vars: {
        r: { name: 'fraction of the gap still left', q: 'ratio', unit: '%' },
        t: { name: 'time elapsed', q: 'time', unit: 's', value: 5 },
        tau: { name: 'time constant', q: 'time', unit: 's', value: 1, tex: '\\tau' }
      },
      solveFor: 'r',
      note: 'For $V_0(1 - e^{-t/\\tau})$ the distance still to go is the fraction $r$ of $V_0$. One time constant leaves 36.8%, five leave 0.67%.',
      stories: {
        r: 'A capacitor with time constant {tau} has been charging for {t}. What fraction of the way to its final voltage is still to go?',
        t: 'A capacitor charges with time constant {tau}. How long until only {r} of the gap to the final voltage remains?'
      }
    },
    {
      name: 'The compound-interest limit that defines e',
      expr: 'y = (1 + 1/n)^n', tex: 'y = \\left(1 + \\frac{1}{n}\\right)^{n}',
      vars: {
        y: { name: 'value of (1 + 1/n)ⁿ' },
        n: { name: 'number of compounding steps', value: 1000 }
      },
      note: 'As $n \\to \\infty$ this tends to $e = 2.71828\\ldots$, but slowly: the shortfall is about $e/(2n)$.'
    }
  ],
  examples: [
    {
      title: 'Leading terms',
      q: 'Find $\\displaystyle\\lim_{x \\to \\infty} \\frac{3x^2 - 5x}{6x^2 + 1}$.',
      steps: [
        'Divide every term by $x^2$: $\\dfrac{3 - 5/x}{6 + 1/x^2}$.',
        'As $x \\to \\infty$, $5/x \\to 0$ and $1/x^2 \\to 0$.',
        'The limit is $3/6 = 1/2$, so $y = 1/2$ is a horizontal asymptote.'
      ],
      a: '1/2'
    },
    {
      title: 'An ∞ − ∞ in disguise',
      q: 'Find $\\displaystyle\\lim_{x \\to \\infty} \\left(\\sqrt{x^2 + x} - x\\right)$.',
      steps: [
        'Both terms grow without bound, so "$\\infty - \\infty$" tells us nothing. Multiply and divide by the conjugate:',
        { text: 'The difference of squares removes the root from the top:', tex: '\\sqrt{x^2 + x} - x = \\frac{(x^2 + x) - x^2}{\\sqrt{x^2 + x} + x} = \\frac{x}{\\sqrt{x^2 + x} + x}' },
        'Divide top and bottom by $x$: $\\dfrac{1}{\\sqrt{1 + 1/x} + 1} \\to \\dfrac{1}{1 + 1} = \\dfrac12$.',
        'Numerically, at $x = 1000$ the expression is $0.49988$.'
      ],
      a: '1/2'
    },
    {
      title: 'All the asymptotes of a rational function',
      q: 'Find the asymptotes of $f(x) = \\dfrac{2x + 1}{x - 3}$.',
      steps: [
        'Vertical: the denominator vanishes at $x = 3$ while the numerator is $7 \\ne 0$ there, so $x = 3$ is a vertical asymptote.',
        'Horizontal: top and bottom have degree 1, so $f(x) \\to 2/1 = 2$ as $x \\to \\pm\\infty$.',
        'No oblique asymptote, since the degrees are equal.'
      ],
      a: 'x = 3 (vertical) and y = 2 (horizontal).'
    }
  ],
  quiz: [
    { q: '$\\displaystyle\\lim_{x \\to \\infty} \\frac{5x^3 + 2}{x^4 - 1} = $', choices: ['5', '0', '∞', '−2'], a: 1,
      why: 'The denominator has the higher degree, so it wins: dividing by $x^4$ gives $(5/x + 2/x^4)/(1 - 1/x^4) \\to 0$.' },
    { q: 'For very large $x$, which of these is largest?', choices: ['$x^{100}$', '$e^x$', '$1000\\ln x$', '$10^6 x$'], a: 1,
      why: 'An exponential eventually outgrows every power, however large the exponent. (For $x^{100}$ it takes until about $x \\approx 650$.)' },
    { q: 'The graph of a function can cross its horizontal asymptote.', a: true,
      why: 'The asymptote describes the far ends only. $\\sin x / x$ crosses $y = 0$ infinitely often while approaching it.' },
    { q: 'Find the oblique asymptote of $y = \\dfrac{x^2 + 3x + 1}{x}$: type the line as an expression in $x$.', answer: 'x + 3', vars: ['x'],
      why: 'Dividing gives $x + 3 + 1/x$, and the $1/x$ dies away, leaving the line $y = x + 3$.' },
    { q: '$\\displaystyle\\lim_{x \\to \\infty} x e^{-x} = $', choices: ['1', '∞', '0', 'It does not exist'], a: 2,
      why: 'The exponential decay beats the linear growth. (At $x = 20$ the product is already $4 \\times 10^{-8}$.)' }
  ],
  applications: [
    'Steady states: terminal velocity, a fully charged capacitor, the final temperature of a cooling cup.',
    'Comparing algorithms: the growth rate of running time with problem size.',
    'Deciding whether an improper integral or an infinite series has a finite value.'
  ]
}

);
