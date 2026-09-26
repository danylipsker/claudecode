/* HYPER-MATH · content/polynomials.js — Algebra › Polynomials:
 * polynomials and their graphs, factorising, division and the factor theorem,
 * rational functions and the binomial theorem. */
Hyper.add(

{
  id: 'polynomials', parent: 'polynomials-topic', title: 'Polynomials', level: 2,
  short: 'Sums of whole-number powers of x with constant coefficients: how to add and multiply them, what their graphs look like, and how their roots behave.',
  keywords: ['polynomial', 'degree', 'leading coefficient', 'constant term', 'cubic', 'quartic', 'expand', 'like terms', 'end behaviour', 'turning points', 'multiplicity', 'fundamental theorem of algebra', 'Horner'],
  prereq: ['exponents', 'functions'],
  related: ['factoring', 'polynomial-division', 'quadratic-equations', 'taylor-series', 'curve-sketching'],
  body: `
A **polynomial** is a sum of whole-number powers of $x$, each multiplied by a constant:
$$p(x) = a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0, \\qquad a_n \\ne 0$$
The highest power $n$ is the **degree**, $a_n$ the **leading coefficient** and $a_0$ the **constant term**. Degree 0 is a constant, 1 a straight line, 2 a quadratic, 3 a cubic, 4 a quartic. $\\sqrt x$, $1/x$ and $2^x$ are not polynomials: the powers must be whole numbers, 0 or more.

### Arithmetic
Add and subtract by collecting **like terms**, those with the same power: $(3x^2 + 2x - 1) + (x^2 - 5x + 4) = 4x^2 - 3x + 3$. Multiply by multiplying every term of one by every term of the other:
$$(2x + 3)(x^2 - x + 4) = 2x^3 - 2x^2 + 8x + 3x^2 - 3x + 12 = 2x^3 + x^2 + 5x + 12$$
When polynomials are multiplied their degrees add. Two products are worth knowing by heart: $(a + b)^2 = a^2 + 2ab + b^2$ and $(a + b)(a - b) = a^2 - b^2$.

### Graphs
Polynomial graphs are smooth and unbroken, with no corners and no asymptotes. Far from the origin the leading term wins, so the **ends** depend only on the degree and the sign of $a_n$: with an even degree both ends go the same way (up if $a_n > 0$), with an odd degree they go opposite ways. In between, a polynomial of degree $n$ has at most $n - 1$ turning points and crosses the $x$-axis at most $n$ times.

### Roots and multiplicity
Every real root $r$ comes with a factor $(x - r)$ (the [[polynomial-division|factor theorem]]). A root that appears twice, as in $(x - 2)^2$, is a **double root**: the graph touches the axis there and turns back. A triple root flattens out as it crosses. The **fundamental theorem of algebra** says a polynomial of degree $n$ has exactly $n$ roots, counting repeats and [[complex-numbers|complex roots]]. Complex roots of a real polynomial come in conjugate pairs, so every polynomial of odd degree has at least one real root.

### Why polynomials matter
They are the functions a computer can evaluate with nothing but additions and multiplications, so other functions are approximated by them: a [[taylor-series|Taylor series]] turns $\\sin x$ into $x - x^3/6 + \\cdots$. Engineers fit polynomials to measurements — a thermocouple's voltage against temperature, a pump's head against flow. Physicists expand an energy in powers of a small displacement; keeping the square term is why so many systems oscillate like [[physics:simple-harmonic-motion|simple harmonic motion]] near equilibrium.

> [!tip] To evaluate a polynomial by hand, nest it (Horner's method): $2x^3 + x^2 + 5x + 12 = ((2x + 1)x + 5)x + 12$ — three multiplications and three additions.
`,
  ideas: [
    'A polynomial is a sum of terms $a_k x^k$ with whole-number powers; the highest power is its degree.',
    'Multiplying polynomials multiplies every term by every term, and the degrees add.',
    'The ends of the graph are set by the leading term: same side for even degree, opposite sides for odd.',
    'Degree $n$ allows at most $n$ real roots and $n - 1$ turning points; a double root touches the axis without crossing.'
  ],
  pitfalls: [
    '$(x + 3)^2 = x^2 + 9$ — The middle term is missing: $(x + 3)^2 = x^2 + 6x + 9$.',
    'Adding unlike terms: $x^2 + x^3 = x^5$ — Only terms with the same power combine. Exponents add when you multiply, not when you add.',
    'A cubic always has three real roots — It has three roots counting complex ones; $x^3 + x$ has only one real root, 0.'
  ],
  formulas: [
    {
      name: 'A cubic polynomial',
      expr: 'y = a*x^3 + b*x^2 + c*x + d', tex: 'y = ax^3 + bx^2 + cx + d', solveFor: 'y',
      vars: {
        y: { name: 'value of the polynomial', signed: true },
        x: { name: 'input', value: 2, signed: true },
        a: { name: 'coefficient of x³', value: 1, signed: true },
        b: { name: 'coefficient of x²', value: -2, signed: true },
        c: { name: 'coefficient of x', value: -5, signed: true },
        d: { name: 'constant term', value: 6, signed: true }
      },
      note: 'Solve for $x$ to find every input that gives a chosen $y$. With $y = 0$ these coefficients give the roots 1, −2 and 3, because $x^3 - 2x^2 - 5x + 6 = (x - 1)(x + 2)(x - 3)$.',
      practice: { unknowns: ['y'] }
    }
  ],
  examples: [
    {
      title: 'Expand and simplify',
      q: 'Simplify $(x + 2)(x^2 - 3x + 1) - x(x - 1)^2$.',
      steps: [
        '$(x + 2)(x^2 - 3x + 1) = x^3 - 3x^2 + x + 2x^2 - 6x + 2 = x^3 - x^2 - 5x + 2$.',
        '$x(x - 1)^2 = x(x^2 - 2x + 1) = x^3 - 2x^2 + x$.',
        'Subtract: $x^3 - x^2 - 5x + 2 - x^3 + 2x^2 - x = x^2 - 6x + 2$.',
        'The cubes cancel, so the result has degree 2.'
      ],
      a: '$x^2 - 6x + 2$'
    },
    {
      title: 'Reading a graph from the factors',
      q: 'Describe the graph of $p(x) = -(x + 1)(x - 2)^2$ without plotting it.',
      steps: [
        'Degree $1 + 2 = 3$ with leading coefficient −1: the graph comes down from the upper left and leaves towards the lower right.',
        'It crosses the axis at $x = -1$ (a single root) and touches it at $x = 2$ (a double root), turning back there.',
        'The $y$-intercept is $p(0) = -(1)(4) = -4$.'
      ],
      a: 'Up on the left, down on the right; crosses at −1, touches at 2, passes through (0, −4).'
    },
    {
      title: 'An open box',
      q: 'Squares of side $x$ cm are cut from the corners of a 20 cm × 30 cm card, and the sides are folded up into an open box. Write its volume as a polynomial and evaluate it for $x = 4$.',
      steps: [
        'The base is $(30 - 2x)$ by $(20 - 2x)$ and the height $x$: $V = x(30 - 2x)(20 - 2x)$.',
        'Expand: $V = x(600 - 100x + 4x^2) = 4x^3 - 100x^2 + 600x$, a cubic valid for $0 < x < 10$.',
        'At $x = 4$: $V = 256 - 1600 + 2400 = 1056\\ \\mathrm{cm^3}$ (check: $4 \\times 22 \\times 12 = 1056$).'
      ],
      a: '$V = 4x^3 - 100x^2 + 600x$; 1056 cm³ at x = 4. The best $x$ is a job for [[optimization]].'
    }
  ],
  quiz: [
    { q: 'Expand $(x + 2)(x - 3)$.', answer: 'x^2 - x - 6', vars: ['x'],
      why: '$x \\cdot x + x(-3) + 2x + 2(-3) = x^2 - x - 6$.' },
    { q: 'What is the degree of $(x^3 + 1)(2x^2 - x)$?', choices: ['3', '5', '6', '2'], a: 1,
      why: 'The leading terms multiply to $2x^5$: degrees add when polynomials are multiplied.' },
    { q: 'For large positive $x$, the graph of $y = -2x^5 + x^2 + 7$…', choices: ['rises', 'falls', 'levels off at 7', 'oscillates'], a: 1,
      why: 'Far out the leading term $-2x^5$ dominates, and it is hugely negative for large positive $x$.' },
    { q: 'A polynomial of degree 4 can have exactly 3 different real roots.', a: true,
      why: 'For example $(x - 1)^2(x - 2)(x - 3)$: four roots counted with multiplicity, three of them different.' },
    { q: 'Every cubic polynomial with real coefficients has at least one real root.', a: true,
      why: 'Its ends go to opposite infinities, so the unbroken graph must cross the axis somewhere. (Equivalently, complex roots come in pairs, and 3 is odd.)' }
  ],
  applications: [
    'Approximating functions for computation (Taylor polynomials, splines in design software).',
    'Calibration curves for sensors such as thermocouples.',
    'Trajectories and shapes: cubic curves in road and rail transitions, Bézier curves in fonts and CAD.',
    'Characteristic polynomials whose roots decide how a mechanical or electrical system responds.'
  ],
  sim: 'alg-poly-roots'
},

{
  id: 'factoring', parent: 'polynomials-topic', title: 'Factoring', level: 2,
  short: 'Writing a sum as a product: common factors, differences of squares, trinomials, grouping — the reverse of expanding, and the quickest route to roots and simplifications.',
  keywords: ['factorise', 'factorize', 'factor', 'common factor', 'difference of two squares', 'perfect square', 'trinomial', 'splitting the middle term', 'AC method', 'grouping', 'sum of cubes', 'zero product'],
  prereq: ['polynomials', 'exponents'],
  related: ['quadratic-equations', 'polynomial-division', 'rational-functions', 'partial-fractions'],
  body: `
Factorising is expanding in reverse: writing a sum as a product, so that $x^2 + 5x + 6$ becomes $(x + 2)(x + 3)$. Products are easier to work with. A product is zero only when one of its factors is, so factors give roots at once; common factors cancel in fractions; and the sign of a product is easy to read.

### The toolkit, in the order to try it
1. **A common factor.** $6x^3 - 9x^2 = 3x^2(2x - 3)$.
2. **A difference of two squares.** $a^2 - b^2 = (a - b)(a + b)$: $x^2 - 49 = (x - 7)(x + 7)$ and $4x^2 - 9 = (2x - 3)(2x + 3)$.
3. **A perfect square.** $a^2 \\pm 2ab + b^2 = (a \\pm b)^2$: $x^2 - 10x + 25 = (x - 5)^2$.
4. **A trinomial $x^2 + bx + c$.** Find two numbers with product $c$ and sum $b$. For $x^2 - x - 12$: $(-4) \\times 3 = -12$ and $-4 + 3 = -1$, so it is $(x - 4)(x + 3)$.
5. **A trinomial $ax^2 + bx + c$.** Find two numbers with product $ac$ and sum $b$, split the middle term with them, and group. For $6x^2 + 7x - 3$: $ac = -18 = 9 \\times (-2)$ and $9 - 2 = 7$. So $6x^2 + 9x - 2x - 3 = 3x(2x + 3) - (2x + 3) = (3x - 1)(2x + 3)$.
6. **Grouping** four terms: $x^3 + 2x^2 - 9x - 18 = x^2(x + 2) - 9(x + 2) = (x - 3)(x + 3)(x + 2)$.
7. **Cubes.** $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ and $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$.

Always check by expanding again. For cubics and beyond, find one root by trial and split off its factor with the [[polynomial-division|factor theorem]].

### When it will not factorise
Most quadratics do not factorise over the integers. $x^2 + x - 1$ has roots $\\tfrac{-1 \\pm \\sqrt5}{2}$, so its factors contain surds. The discriminant tells you in advance: with integer coefficients, $b^2 - 4ac$ must be a perfect square for rational factors to exist. $x^2 + 1$ has no real factors at all, only $(x - i)(x + i)$ over the [[complex-numbers|complex numbers]]. In those cases use the [[quadratic-equations|quadratic formula]] instead.

### What factorising is for
- **Solving**: $(3x - 1)(2x + 3) = 0$ gives $x = \\tfrac13$ or $x = -\\tfrac32$.
- **Simplifying**: $\\dfrac{x^2 - 9}{x^2 + 3x} = \\dfrac{(x - 3)(x + 3)}{x(x + 3)} = \\dfrac{x - 3}{x}$, for $x \\ne -3$.
- **Signs**: a factorised expression makes the sign chart of an [[inequalities|inequality]] immediate.
- **Integrating**: splitting a fraction into [[partial-fractions|partial fractions]] starts by factorising its denominator.

> [!warn] Cancel factors, never terms. In $\\dfrac{x^2 + 3}{x + 3}$ nothing cancels at all.
`,
  ideas: [
    'Factorising turns a sum into a product; expanding the product must give back the original.',
    'Try in order: common factor, difference of squares, perfect square, trinomial, grouping.',
    'A product is zero exactly when one of its factors is zero — the key to solving by factorising.',
    'Not everything factorises nicely; the discriminant tells you whether a quadratic has rational factors.'
  ],
  pitfalls: [
    '$x^2 + 9 = (x + 3)(x + 3)$ — That expands to $x^2 + 6x + 9$. A *sum* of squares has no real factors; only a difference of squares splits.',
    'Stopping too early — $x^4 - 16 = (x^2 - 4)(x^2 + 4)$ is not finished: $x^2 - 4 = (x - 2)(x + 2)$.',
    'Cancelling terms across a fraction bar — In $\\tfrac{x + 6}{x + 3}$ neither the $x$ nor the 3 cancels; only whole common factors do.'
  ],
  examples: [
    {
      title: 'Factorise completely',
      q: 'Factorise $2x^3 - 8x$.',
      steps: [
        'Common factor first: $2x(x^2 - 4)$.',
        '$x^2 - 4$ is a difference of squares: $(x - 2)(x + 2)$.',
        'Check by expanding: $2x(x^2 - 4) = 2x^3 - 8x$.'
      ],
      a: '$2x(x - 2)(x + 2)$'
    },
    {
      title: 'Splitting the middle term',
      q: 'Factorise $10x^2 - x - 3$.',
      steps: [
        '$ac = 10 \\times (-3) = -30$. Two numbers with product −30 and sum −1: −6 and 5.',
        'Split: $10x^2 - 6x + 5x - 3$.',
        'Group: $2x(5x - 3) + 1(5x - 3) = (2x + 1)(5x - 3)$.',
        'Check: $(2x + 1)(5x - 3) = 10x^2 - 6x + 5x - 3$.'
      ],
      a: '$(2x + 1)(5x - 3)$'
    },
    {
      title: 'Factorising in your head',
      q: 'Work out $103 \\times 97$ without a calculator.',
      steps: [
        'Write it as $(100 + 3)(100 - 3)$, a difference of squares.',
        '$100^2 - 3^2 = 10\\,000 - 9 = 9991$.'
      ],
      a: '9991'
    }
  ],
  quiz: [
    { q: 'Simplify $\\dfrac{x^2 - 9}{x - 3}$ (for $x \\ne 3$).', answer: 'x + 3', vars: ['x'],
      why: '$x^2 - 9 = (x - 3)(x + 3)$, and the common factor $x - 3$ cancels.' },
    { q: 'Factorise $x^2 - 5x + 6$.', answer: '(x - 2)(x - 3)', vars: ['x'],
      why: 'Two numbers with product 6 and sum −5 are −2 and −3.' },
    { q: 'Which quadratic factorises over the integers?', choices: ['$x^2 + x - 1$', '$x^2 + 4$', '$x^2 + x - 6$', '$x^2 - 2$'], a: 2,
      why: '$x^2 + x - 6 = (x + 3)(x - 2)$; its discriminant is 25, a perfect square. The others have discriminants 5, −16 and 8.' },
    { q: '$x^4 - 16$ factorised completely over the real numbers is…', choices: ['$(x^2 - 4)(x^2 + 4)$', '$(x - 2)(x + 2)(x^2 + 4)$', '$(x - 2)^2(x + 2)^2$', '$(x - 2)^4$'], a: 1,
      why: 'A difference of squares twice: $x^4 - 16 = (x^2 - 4)(x^2 + 4)$, then $x^2 - 4 = (x - 2)(x + 2)$. The sum $x^2 + 4$ has no real factors.' },
    { q: '$\\dfrac{x + 6}{x + 3} = 2$ for all $x$, by cancelling the 3 into the 6.', a: false,
      why: 'Terms cannot be cancelled. At $x = 1$ the fraction is $7/4$. (It happens to equal 2 only at $x = 0$.)' }
  ],
  applications: [
    'Solving polynomial equations and finding where graphs cross the axis.',
    'Simplifying algebraic fractions and transfer functions.',
    'Partial fractions for integration and for the Laplace transform.',
    'Mental arithmetic tricks based on the difference of squares.'
  ],
  sim: { id: 'alg-poly-roots', params: { n: 2, a: 1 } }
},

{
  id: 'polynomial-division', parent: 'polynomials-topic', title: 'Polynomial division and the factor theorem', level: 2,
  short: 'Dividing one polynomial by another leaves a quotient and a remainder; dividing by x − a leaves the remainder p(a), so x − a is a factor exactly when a is a root.',
  keywords: ['polynomial long division', 'synthetic division', 'quotient', 'remainder', 'remainder theorem', 'factor theorem', 'rational root theorem', 'roots of a cubic', 'Horner'],
  prereq: ['polynomials', 'factoring'],
  related: ['rational-functions', 'partial-fractions', 'newtons-method', 'complex-numbers'],
  body: `
Dividing polynomials works like long division of numbers. Just as $17 = 5 \\times 3 + 2$, any polynomial $p(x)$ divided by a non-zero polynomial $d(x)$ gives a **quotient** $q(x)$ and a **remainder** $r(x)$ of lower degree than $d(x)$:
$$p(x) = d(x)\\,q(x) + r(x)$$

### Long division
Divide $2x^3 - 3x^2 + 4x - 5$ by $x - 2$:
1. Divide the leading terms: $2x^3 / x = 2x^2$. Multiply back, $2x^2(x - 2) = 2x^3 - 4x^2$, and subtract: $x^2 + 4x - 5$ is left.
2. $x^2 / x = x$. Subtract $x(x - 2) = x^2 - 2x$: $6x - 5$ is left.
3. $6x / x = 6$. Subtract $6(x - 2) = 6x - 12$: the remainder is 7.

So $2x^3 - 3x^2 + 4x - 5 = (x - 2)(2x^2 + x + 6) + 7$.

### Synthetic division
For a divisor $x - a$ there is a shortcut that keeps only the coefficients. Write $a = 2$ beside the coefficients 2, −3, 4, −5. Bring the first one down; then repeatedly multiply by $a$ and add the result to the next coefficient:
$$\\begin{array}{r|rrrr} 2 & 2 & -3 & 4 & -5 \\\\ & & 4 & 2 & 12 \\\\ \\hline & 2 & 1 & 6 & 7 \\end{array}$$
The bottom row holds the quotient $2x^2 + x + 6$ and the remainder 7. It is Horner's nested evaluation of $p(2)$ in disguise.

### The remainder and factor theorems
Put $x = a$ into $p(x) = (x - a)\\,q(x) + r$. The first term vanishes, so
$$p(a) = r$$
This is the **remainder theorem**: the remainder on dividing by $x - a$ is $p(a)$. Check: $p(2) = 16 - 12 + 8 - 5 = 7$. In particular $x - a$ divides $p(x)$ exactly when $p(a) = 0$ — the **factor theorem**. Finding a root and finding a factor are one and the same job.

### Finding the roots of a cubic
If the coefficients are integers, any rational root $p/q$ in lowest terms has $p$ dividing the constant term and $q$ dividing the leading coefficient (the **rational root theorem**). For $x^3 - 6x^2 + 11x - 6$, try the divisors of 6: $p(1) = 0$, so $x - 1$ is a factor. Dividing it out leaves $x^2 - 5x + 6 = (x - 2)(x - 3)$, so the roots are 1, 2 and 3. When no rational root exists, numerical methods such as [[newtons-method|Newton's method]] take over.

### Where it is used
Dividing out a known root lowers the degree of an equation. Division gives the slanted asymptotes of [[rational-functions|rational functions]] and is the first step of [[partial-fractions|partial fractions]]. Control engineers divide transfer functions to separate fast and slow behaviour, and the CRC check codes that protect every network packet and disk sector are remainders of polynomial division (with coefficients 0 and 1).
`,
  ideas: [
    'Division gives $p(x) = d(x)\\,q(x) + r(x)$ with the remainder of lower degree than the divisor.',
    'Synthetic division is a fast bookkeeping scheme for dividing by $x - a$.',
    'Remainder theorem: dividing by $x - a$ leaves $p(a)$.',
    'Factor theorem: $x - a$ is a factor of $p(x)$ exactly when $p(a) = 0$.'
  ],
  pitfalls: [
    'Leaving out missing powers — Divide $x^3 - 4$ as $x^3 + 0x^2 + 0x - 4$. Without the zeros the columns slip out of line.',
    'Using the wrong sign of $a$ — Dividing by $x + 3$ means $a = -3$ in synthetic division and in the remainder theorem.',
    'Stopping when the remainder is not zero — A non-zero remainder only says $x - a$ is not a factor; try another candidate root.'
  ],
  derivation: {
    title: 'Why the remainder is p(a)',
    steps: [
      { text: 'Divide $p(x)$ by $x - a$. The divisor has degree 1, so the remainder is a constant $r$:', tex: 'p(x) = (x - a)\\,q(x) + r' },
      { text: 'This is an identity: it holds for every $x$. So set $x = a$:', tex: 'p(a) = (a - a)\\,q(a) + r = 0 + r' },
      { text: 'Hence the remainder is $p(a)$, and it is zero exactly when $a$ is a root:', tex: 'r = p(a), \\qquad p(a) = 0 \\iff (x - a) \\text{ divides } p(x)' }
    ]
  },
  formulas: [
    {
      name: 'Remainder on dividing a cubic by (x − k)',
      expr: 'R = a*k^3 + b*k^2 + c*k + d', tex: 'R = ak^3 + bk^2 + ck + d', solveFor: 'R',
      vars: {
        R: { name: 'remainder', signed: true },
        k: { name: 'the number k in the divisor x − k', value: 2, signed: true },
        a: { name: 'coefficient of x³', value: 2, signed: true },
        b: { name: 'coefficient of x²', value: -3, signed: true },
        c: { name: 'coefficient of x', value: 4, signed: true },
        d: { name: 'constant term', value: -5, signed: true }
      },
      note: 'Set $R = 0$ and solve for $k$: every value found is a root, and $x - k$ is a factor.',
      practice: { unknowns: ['R'] }
    }
  ],
  examples: [
    {
      title: 'Using the factor theorem',
      q: 'Show that $x + 2$ is a factor of $x^3 + 3x^2 - 4$ and factorise it completely.',
      steps: [
        '$p(-2) = -8 + 12 - 4 = 0$, so $x + 2$ is a factor.',
        'Synthetic division by $-2$ on 1, 3, 0, −4: bring down 1; $1 \\times (-2) + 3 = 1$; $1 \\times (-2) + 0 = -2$; $-2 \\times (-2) - 4 = 0$.',
        'Quotient $x^2 + x - 2 = (x + 2)(x - 1)$.',
        'So $p(x) = (x + 2)^2(x - 1)$: a double root at −2 and a single root at 1.'
      ],
      a: '$(x + 2)^2(x - 1)$'
    },
    {
      title: 'Finding an unknown coefficient',
      q: 'For which $k$ is $x - 2$ a factor of $x^3 + kx^2 - x + 6$?',
      steps: [
        'By the factor theorem we need $p(2) = 0$: $8 + 4k - 2 + 6 = 0$.',
        '$12 + 4k = 0$, so $k = -3$.',
        'Check by dividing $x^3 - 3x^2 - x + 6$ by $x - 2$: the quotient is $x^2 - x - 3$ and the remainder 0.'
      ],
      a: '$k = -3$'
    }
  ],
  quiz: [
    { q: 'Divide $x^3 - 1$ by $x - 1$. Type the quotient.', answer: 'x^2 + x + 1', vars: ['x'],
      why: 'This is the difference of cubes: $x^3 - 1 = (x - 1)(x^2 + x + 1)$, with remainder 0.' },
    { q: 'What is the remainder when $x^3 + 2x - 5$ is divided by $x - 2$?', answer: '7', vars: [],
      why: 'By the remainder theorem it is $p(2) = 8 + 4 - 5 = 7$ — no division needed.' },
    { q: 'A polynomial satisfies $p(3) = 0$. Which must be true?', choices: ['$x + 3$ is a factor', '$x - 3$ is a factor', '$p(0) = 3$', '$p$ has degree 3'], a: 1,
      why: 'The factor theorem: a root at 3 means a factor $x - 3$. The sign trips many people up.' },
    { q: 'Dividing a degree-5 polynomial by a degree-2 polynomial gives a quotient of degree…', choices: ['2', '3', '5', '7'], a: 1,
      why: 'Degrees subtract in division: $5 - 2 = 3$. The remainder has degree at most 1.' },
    { q: 'If $x^3 - 6x^2 + 11x - 6$ has a rational root, it must be one of ±1, ±2, ±3, ±6.', a: true,
      why: 'By the rational root theorem the numerator divides 6 and the denominator divides the leading coefficient 1. (In fact the roots are 1, 2 and 3.)' }
  ],
  applications: [
    'Reducing a polynomial equation to a lower degree once one root is known.',
    'Slanted asymptotes of rational functions.',
    'Cyclic redundancy checks in networking and storage.',
    'Partial fractions in integration and Laplace transforms.'
  ],
  sim: { id: 'alg-poly-roots', params: { n: 3, a: 1 } }
},

{
  id: 'rational-functions', parent: 'polynomials-topic', title: 'Rational functions', level: 2,
  short: 'Ratios of two polynomials: they blow up where the denominator vanishes, settle down to an asymptote far away, and describe parallel combinations and saturation.',
  keywords: ['rational function', 'asymptote', 'vertical asymptote', 'horizontal asymptote', 'oblique asymptote', 'slant asymptote', 'hole', 'removable discontinuity', 'hyperbola', '1/x', 'saturation', 'domain'],
  prereq: ['polynomial-division', 'factoring', 'functions'],
  related: ['limits-at-infinity', 'partial-fractions', 'power-functions', 'physics:thin-lenses', 'physics:resistors-combinations'],
  body: `
A **rational function** is a ratio of two polynomials,
$$f(x) = \\frac{p(x)}{q(x)}$$
just as a rational number is a ratio of two integers. The simplest is $y = 1/x$, a [[hyperbola]]: huge near $x = 0$, tiny for large $x$, never touching either axis. Every rational function is assembled from the same few features.

### Where the denominator vanishes
$f$ is undefined wherever $q(x) = 0$. Near such a point, if the numerator is not zero as well, $|f(x)|$ grows without bound: a **vertical asymptote**. Factorise before deciding, though. In
$$\\frac{x^2 - 1}{x - 1} = \\frac{(x - 1)(x + 1)}{x - 1} = x + 1 \\qquad (x \\ne 1)$$
the zero cancels, and the graph is the line $y = x + 1$ with a single point missing — a **hole**, not an asymptote.

### Far away
For large $|x|$ only the leading terms matter (see [[limits-at-infinity|limits at infinity]]). If $p$ has degree $m$ and $q$ degree $n$:
- $m < n$: $f \\to 0$, so the $x$-axis is a horizontal asymptote.
- $m = n$: $f$ approaches the ratio of the leading coefficients; $\\tfrac{3x^2 + 1}{x^2 - 4}$ approaches 3.
- $m = n + 1$: a slanted asymptote, found by [[polynomial-division|polynomial division]]: $\\tfrac{x^2 + 1}{x} = x + \\tfrac1x$ hugs the line $y = x$.

### Sketching one
List the zeros (from the numerator), the vertical asymptotes and holes (from the denominator), the behaviour far away (from the degrees) and the $y$-intercept $f(0)$. Then find the sign in each interval between the special points — the sign chart of [[inequalities]]. That is usually enough for a faithful sketch.

### Rational functions in science
They appear whenever things combine "in parallel" or saturate. Two resistors in parallel give $R = \\tfrac{R_1 R_2}{R_1 + R_2}$ ([[physics:resistors-combinations|resistors in combination]]). The thin-lens equation gives the image distance $v = \\tfrac{fu}{u - f}$, with a vertical asymptote when the object sits at the focal point and the image runs off to infinity ([[physics:thin-lenses|thin lenses]]). Enzyme reaction rates and many sensor responses follow the saturation curve
$$y = \\frac{Vx}{K + x}$$
proportional to $x$ at first, levelling off at $V$, and exactly half-way there when $x = K$. The transfer functions of filters and control systems are rational functions of frequency, and their poles — the zeros of the denominator — decide whether a system is stable.

> [!key] Zeros of the numerator are where the graph meets the axis; zeros of the denominator are where it blows up — unless the two cancel and leave a hole.
`,
  ideas: [
    'A rational function is a ratio $p(x)/q(x)$ of polynomials, undefined where $q(x) = 0$.',
    'A zero of the denominator gives a vertical asymptote, unless it cancels with the numerator and leaves a hole.',
    'The degrees of top and bottom decide the behaviour far away: zero, a constant, or a slanted line.',
    'Saturation curves $Vx/(K + x)$ and parallel combinations $R_1R_2/(R_1 + R_2)$ are rational functions.'
  ],
  pitfalls: [
    'Every zero of the denominator is an asymptote — Not if it cancels: $\\tfrac{x^2 - 1}{x - 1}$ has a hole at $x = 1$ and no asymptote.',
    'A graph can never cross an asymptote — It never crosses a vertical one, but it may cross a horizontal one: $\\tfrac{x}{x^2 + 1}$ crosses $y = 0$ at the origin.',
    'The horizontal asymptote is found by setting $x = 0$ — It comes from large $|x|$, where the leading terms dominate; $x = 0$ gives the $y$-intercept.'
  ],
  formulas: [
    {
      name: 'A linear-over-linear function',
      expr: 'y = (a*x + b)/(c*x + d)', tex: 'y = \\frac{ax + b}{cx + d}', solveFor: 'y',
      vars: {
        y: { name: 'value', signed: true },
        x: { name: 'input', value: 5, signed: true },
        a: { name: 'a', value: 2, signed: true },
        b: { name: 'b', value: 1, signed: true },
        c: { name: 'c', value: 1, signed: true },
        d: { name: 'd', value: -3, signed: true }
      },
      note: 'Asymptotes at $x = -d/c$ and $y = a/c$. Solving for $x$ inverts the function — its inverse is again of this form.',
      practice: { unknowns: ['y', 'x'] }
    },
    {
      name: 'Saturation curve',
      expr: 'y = V*x/(K + x)', tex: 'y = \\frac{Vx}{K + x}',
      vars: {
        y: { name: 'response' },
        V: { name: 'saturation level', value: 10 },
        x: { name: 'input (dose, concentration, signal)', value: 3 },
        K: { name: 'half-saturation input', value: 2 }
      },
      note: 'At $x = K$ the response is exactly $V/2$; for $x \\ll K$ it is nearly proportional, $y \\approx (V/K)x$.'
    },
    {
      name: 'Parallel combination',
      expr: 'R = R1*R2/(R1 + R2)', tex: 'R = \\frac{R_1 R_2}{R_1 + R_2}',
      vars: {
        R: { name: 'combined value' },
        R1: { name: 'first value', value: 6 },
        R2: { name: 'second value', value: 3 }
      },
      note: 'Resistors in parallel, springs in series, capacitors in series, and the "reduced mass" of two bodies all combine this way. The result is always smaller than either part.',
      stories: { R: 'Resistors of {R1} Ω and {R2} Ω are connected in parallel. What is the combined resistance (in Ω)?', R2: 'What resistance must be put in parallel with {R1} Ω to make {R} Ω?' }
    }
  ],
  examples: [
    {
      title: 'Anatomy of a rational function',
      q: 'Find the zeros, asymptotes and intercepts of $f(x) = \\dfrac{2x - 4}{x + 1}$, and its sign.',
      steps: [
        'Zero: $2x - 4 = 0$ at $x = 2$. Vertical asymptote: $x = -1$ (nothing cancels).',
        'Equal degrees: the horizontal asymptote is $y = 2/1 = 2$.',
        '$y$-intercept: $f(0) = -4$.',
        'Signs: for $x < -1$ both factors are negative, so $f > 0$; for $-1 < x < 2$, $f < 0$; for $x > 2$, $f > 0$.'
      ],
      a: 'Zero at 2, asymptotes $x = -1$ and $y = 2$, crosses the y-axis at −4.'
    },
    {
      title: 'A hole in the graph',
      q: 'Simplify $g(x) = \\dfrac{x^2 - 4}{x^2 - x - 2}$ and describe its graph.',
      steps: [
        'Factorise: $\\dfrac{(x - 2)(x + 2)}{(x - 2)(x + 1)} = \\dfrac{x + 2}{x + 1}$ for $x \\ne 2$.',
        'The cancelled factor leaves a hole at $x = 2$, where the simplified form would give $4/3$.',
        'The factor $x + 1$ remains: a vertical asymptote at $x = -1$. Equal degrees: horizontal asymptote $y = 1$.'
      ],
      a: 'The curve $y = (x + 2)/(x + 1)$ with a hole at $(2, 4/3)$.'
    },
    {
      title: 'Image distance of a lens',
      q: 'A lens of focal length 20 cm forms an image of an object $u$ cm away at $v = \\dfrac{20u}{u - 20}$ cm. Find $v$ for $u = 30$ and describe what happens as $u$ approaches 20 cm.',
      steps: [
        '$v = \\dfrac{600}{10} = 60$ cm.',
        'As $u \\to 20$ from above, the denominator $\\to 0^+$ and $v \\to +\\infty$: a vertical asymptote. An object at the focal point sends out parallel light and forms no image at a finite distance.',
        'For large $u$, $v \\to 20$ cm: a distant object is focused at the focal point, the horizontal asymptote.'
      ],
      a: '60 cm; the image recedes to infinity as the object approaches the focal point.'
    }
  ],
  quiz: [
    { q: 'Where does $f(x) = \\dfrac{x^2 - 1}{x - 1}$ have a vertical asymptote?', choices: ['$x = 1$', '$x = -1$', '$x = \\pm 1$', 'nowhere: it has a hole at $x = 1$'], a: 3,
      why: 'The factor $x - 1$ cancels, leaving $x + 1$ with the single point $x = 1$ removed.' },
    { q: 'The horizontal asymptote of $y = \\dfrac{3x^2 + 1}{x^2 - 4}$ is…', choices: ['$y = 0$', '$y = 3$', '$y = -\\tfrac14$', 'there is none'], a: 1,
      why: 'Equal degrees: the ratio of the leading coefficients, 3/1. (−1/4 is the value at $x = 0$.)' },
    { q: 'Write $\\dfrac{1}{x} + \\dfrac{1}{x + 1}$ as a single fraction.', answer: '(2x + 1)/(x(x + 1))', vars: ['x'],
      why: 'Common denominator $x(x + 1)$: $\\dfrac{(x + 1) + x}{x(x + 1)} = \\dfrac{2x + 1}{x(x + 1)}$.' },
    { q: 'The graph of a rational function can cross its horizontal asymptote.', a: true,
      why: 'Asymptotes describe the far-away behaviour only. $y = \\tfrac{x}{x^2 + 1}$ crosses its asymptote $y = 0$ at the origin.' },
    { q: 'For $y = \\dfrac{10x}{2 + x}$ with $x \\ge 0$, what happens as $x$ grows?', choices: ['$y$ grows without limit', '$y$ approaches 10', '$y$ approaches 5', '$y$ approaches 0'], a: 1,
      why: 'Equal degrees, leading coefficients 10 and 1: the curve saturates at 10. It reaches half of that, 5, at $x = 2$.' }
  ],
  applications: [
    'Parallel resistors, series capacitors and springs, reduced mass.',
    'Lens and mirror equations.',
    'Saturation in enzyme kinetics, sensors and population models.',
    'Transfer functions of filters and control systems.'
  ],
  sim: { id: 'alg-transform', params: { fn: 'recip' } }
},

{
  id: 'binomial-theorem', parent: 'polynomials-topic', title: 'The binomial theorem', level: 2,
  short: 'A formula for every term of (a + b)ⁿ using binomial coefficients from Pascal\'s triangle, and the approximation (1 + x)ⁿ ≈ 1 + nx that physics uses constantly.',
  keywords: ['binomial theorem', 'binomial expansion', 'binomial coefficient', 'n choose k', 'Pascal\'s triangle', 'factorial', 'general term', 'binomial approximation', 'binomial series', '(1+x)^n'],
  prereq: ['polynomials', 'combinatorics', 'exponents'],
  related: ['binomial-distribution', 'taylor-series', 'linear-approximation', 'physics:relativistic-energy'],
  body: `
Expanding $(a + b)^2 = a^2 + 2ab + b^2$ is easy; $(a + b)^7$ by repeated multiplication is not. The **binomial theorem** writes the answer down directly:
$$(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^{k} = a^n + n a^{n-1} b + \\binom{n}{2} a^{n-2} b^2 + \\cdots + b^n$$
where the **binomial coefficient**
$$\\binom{n}{k} = \\frac{n!}{k!\\,(n - k)!}$$
counts the ways of choosing $k$ things from $n$ (see [[combinatorics]]).

### Why choosing?
Multiply out $(a + b)(a + b)(a + b)$: each term of the result is made by picking either $a$ or $b$ from every bracket. A term $ab^2$ arises whenever $b$ is picked from exactly two of the three brackets, and there are $\\binom32 = 3$ ways to choose which two. So $(a + b)^3 = a^3 + 3a^2 b + 3ab^2 + b^3$.

### Pascal's triangle
Written in rows, the coefficients form a triangle in which each number is the sum of the two above it:
$$\\begin{array}{c} 1 \\\\ 1 \\quad 1 \\\\ 1 \\quad 2 \\quad 1 \\\\ 1 \\quad 3 \\quad 3 \\quad 1 \\\\ 1 \\quad 4 \\quad 6 \\quad 4 \\quad 1 \\\\ 1 \\quad 5 \\quad 10 \\quad 10 \\quad 5 \\quad 1 \\end{array}$$
Row $n$ adds up to $2^n$ (put $a = b = 1$), and the "sum of the two above" rule is the identity $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$.

### The approximation physics lives on
When $x$ is small the terms of $(1 + x)^n$ shrink fast, so
$$(1 + x)^n \\approx 1 + nx \\qquad (|x| \\ll 1)$$
Remarkably this holds for **any** real $n$, negative or fractional: Newton's binomial series $1 + nx + \\tfrac{n(n-1)}{2}x^2 + \\cdots$ converges for $|x| < 1$, a special case of a [[taylor-series|Taylor series]]. A few uses:
- $1.02^5 \\approx 1.10$ (true value 1.104) and $\\sqrt{1.1} = (1 + 0.1)^{1/2} \\approx 1.05$ (true 1.049).
- Gravity at height $h$ is $g(1 + h/R)^{-2} \\approx g(1 - 2h/R)$: at 10 km it is weaker by about 0.3 %.
- The relativistic factor $\\gamma = (1 - v^2/c^2)^{-1/2} \\approx 1 + \\tfrac12 v^2/c^2$ turns $E = \\gamma mc^2$ into $mc^2 + \\tfrac12 mv^2$ at everyday speeds ([[physics:relativistic-energy|relativistic energy]]).
- A 1 % larger radius gives a sphere about 3 % more volume, since $1.01^3 \\approx 1.03$: relative errors multiply by the power ([[error-propagation]]).

### Probability
The same coefficients count outcomes. The chance of exactly 5 heads in 10 fair tosses is $\\binom{10}{5}/2^{10} = 252/1024 \\approx 0.25$ — the [[binomial-distribution|binomial distribution]].
`,
  ideas: [
    '$(a + b)^n$ is a sum of terms $\\binom{n}{k}a^{n-k}b^k$, $k = 0, 1, \\dots, n$.',
    'The coefficient $\\binom{n}{k}$ counts the ways of picking $b$ from $k$ of the $n$ brackets.',
    'Pascal\'s triangle builds the coefficients: each is the sum of the two above it.',
    'For small $x$, $(1 + x)^n \\approx 1 + nx$ for any real power $n$.'
  ],
  pitfalls: [
    '$(a + b)^n = a^n + b^n$ — All the middle terms are missing. Even $(1 + 1)^2 = 4$, not 2.',
    'Forgetting to raise the coefficient inside the bracket — In $(1 + 2x)^5$ the $x^2$ term is $\\binom52 (2x)^2 = 40x^2$, not $10x^2$.',
    'Using $1 + nx$ when $x$ is not small — $1.5^4 = 5.06$, but $1 + 4 \\times 0.5 = 3$. The approximation needs $|nx| \\ll 1$.'
  ],
  formulas: [
    {
      name: 'Binomial coefficient',
      expr: 'C = nCr(n, k)', tex: 'C = \\binom{n}{k}',
      vars: {
        C: { name: 'number of ways to choose' },
        n: { name: 'number of items (the power)', value: 10, int: true },
        k: { name: 'number chosen', value: 3, int: true }
      },
      note: 'The coefficient of $a^{n-k}b^k$ in $(a + b)^n$. Solving for $k$ finds both $k$ and $n - k$, since $\\binom{n}{k} = \\binom{n}{n-k}$.',
      practice: { unknowns: ['C'] }
    },
    {
      name: 'The general term of (a + b)ⁿ',
      expr: 'T = nCr(n, k)*a^(n - k)*b^k', tex: 'T = \\binom{n}{k} a^{n-k} b^{k}',
      vars: {
        T: { name: 'value of the term', signed: true },
        n: { name: 'power', value: 5, int: true },
        k: { name: 'index of the term (power of b)', value: 2, int: true, min: 0, max: 30 },
        a: { name: 'first term of the binomial', value: 2, signed: true },
        b: { name: 'second term of the binomial', value: 3, signed: true }
      },
      practice: { unknowns: ['T'] }
    }
  ],
  examples: [
    {
      title: 'Expanding a power',
      q: 'Expand $(2x - 1)^4$.',
      steps: [
        'Row 4 of Pascal\'s triangle: 1, 4, 6, 4, 1. Here $a = 2x$ and $b = -1$.',
        '$(2x)^4 + 4(2x)^3(-1) + 6(2x)^2(-1)^2 + 4(2x)(-1)^3 + (-1)^4$.',
        '$= 16x^4 - 32x^3 + 24x^2 - 8x + 1$.',
        'Check with $x = 1$: $(2 - 1)^4 = 1$ and $16 - 32 + 24 - 8 + 1 = 1$.'
      ],
      a: '$16x^4 - 32x^3 + 24x^2 - 8x + 1$'
    },
    {
      title: 'One coefficient',
      q: 'Find the coefficient of $x^3$ in $(1 + 2x)^8$.',
      steps: [
        'The term with $x^3$ has $k = 3$: $\\binom83 \\cdot 1^5 \\cdot (2x)^3$.',
        '$\\binom83 = \\dfrac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = 56$ and $2^3 = 8$.'
      ],
      a: '$56 \\times 8 = 448$'
    },
    {
      title: 'How good is the approximation?',
      q: 'Estimate $0.98^{10}$ with the binomial approximation, then with one more term.',
      steps: [
        '$0.98^{10} = (1 - 0.02)^{10} \\approx 1 - 10 \\times 0.02 = 0.80$.',
        'Next term: $\\binom{10}{2}(0.02)^2 = 45 \\times 0.0004 = 0.018$, so $\\approx 0.818$.',
        'The true value is 0.8171: two terms are good to 0.1 %.'
      ],
      a: '≈ 0.80 with one term, ≈ 0.818 with two (exact 0.8171)'
    }
  ],
  quiz: [
    { q: 'Expand $(x + 1)^3$.', answer: 'x^3 + 3x^2 + 3x + 1', vars: ['x'],
      why: 'Row 3 of Pascal\'s triangle is 1, 3, 3, 1.' },
    { q: 'What is the coefficient of $x^2$ in $(1 + 2x)^5$?', answer: '40', vars: [],
      why: '$\\binom52 (2x)^2 = 10 \\times 4x^2 = 40x^2$. Forgetting to square the 2 gives 10.' },
    { q: 'Using $(1 + x)^n \\approx 1 + nx$, estimate $1.001^{50}$.', choices: ['1.0005', '1.05', '1.5', '50.05'], a: 1,
      why: '$1 + 50 \\times 0.001 = 1.05$. The true value is 1.0513.' },
    { q: 'The numbers in row 6 of Pascal\'s triangle add up to…', choices: ['12', '36', '64', '720'], a: 2,
      why: 'Put $a = b = 1$: $(1 + 1)^6 = 2^6 = 64$. (The row is 1, 6, 15, 20, 15, 6, 1.)' },
    { q: 'The approximation $(1 + x)^n \\approx 1 + nx$ works only when $n$ is a positive whole number.', a: false,
      why: 'It holds for any real $n$ when $x$ is small: $\\sqrt{1.02} \\approx 1.01$ and $1/1.02 = 1.02^{-1} \\approx 0.98$.' }
  ],
  applications: [
    'Quick approximations in physics: gravity with height, relativistic energy, small-angle and small-strain expansions.',
    'Propagating relative errors through powers.',
    'Probabilities of repeated independent trials.',
    'Expanding powers in algebra and in the proof of the power rule for derivatives.'
  ],
  history: 'Pascal\'s triangle was known long before Pascal: to al-Karaji and Omar Khayyam in Persia around 1000–1100, and to Jia Xian and Yang Hui in China, whose 1261 book printed it. Blaise Pascal studied its properties in a treatise of 1654. Isaac Newton extended the expansion to fractional and negative powers in 1665.'
}

);
