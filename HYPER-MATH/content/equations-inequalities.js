/* HYPER-MATH · content/equations-inequalities.js — Algebra › Equations and inequalities:
 * linear and quadratic equations, systems, inequalities and absolute value. */
Hyper.add(

{
  id: 'linear-equations', parent: 'equations-inequalities', title: 'Linear equations', level: 1,
  short: 'Equations in which the unknown appears only to the first power, solved by doing the same thing to both sides — and the same moves that rearrange any formula.',
  keywords: ['linear equation', 'solve for x', 'balance', 'inverse operations', 'rearrange', 'change the subject', 'subject of a formula', 'literal equation', 'identity', 'contradiction'],
  prereq: ['number-systems', 'fractions-ratios'],
  related: ['linear-functions', 'systems-of-equations', 'inequalities', 'physics:constant-acceleration'],
  body: `
An equation is a balance: whatever is on the left weighs the same as whatever is on the right. Solving it means finding the value of the unknown that keeps the balance level, and there is one rule — **do the same thing to both sides**.

A **linear equation** has the unknown only to the first power: no $x^2$, no $1/x$, no $\\sqrt x$. It can always be brought to the form
$$ax + b = c \\quad\\Longrightarrow\\quad x = \\frac{c - b}{a} \\qquad (a \\ne 0)$$

### The routine
1. Clear fractions by multiplying every term by a common denominator.
2. Expand brackets.
3. Collect the terms with $x$ on one side and the numbers on the other.
4. Divide by the coefficient of $x$.
5. Check by putting the answer back into the original equation.

For example, $\\dfrac{x}{3} + 2 = \\dfrac{x - 1}{2}$. Multiply every term by 6: $2x + 12 = 3x - 3$. Subtract $2x$ and add 3: $15 = x$. Check: $15/3 + 2 = 7$ and $14/2 = 7$.

Each step applies an **inverse operation** — subtraction undoes addition, division undoes multiplication — to both sides, so the new equation has exactly the same solutions as the old one.

### No solution, or every number
Sometimes the $x$ terms cancel. $2(x + 3) = 2x + 5$ becomes $6 = 5$, a contradiction: there is **no solution**. $2(x + 3) = 2x + 6$ becomes $6 = 6$, an identity: **every** $x$ works. The simulation shows why. The solution of $m x + b = c$ is where the line $y = mx + b$ meets the horizontal line $y = c$; a line parallel to it never meets it, and a line on top of it meets it everywhere.

### Rearranging formulas
The same moves rearrange a formula for any of its letters, which is the everyday use of algebra in science. From $v = u + at$, subtract $u$ and divide by $a$: $t = (v - u)/a$. From the temperature conversion $F = \\tfrac95 C + 32$ you get $C = \\tfrac59 (F - 32)$, so a body temperature of 98.6 °F is 37 °C. Every calculator in this app does exactly this when you click a different variable; the equations of [[physics:constant-acceleration|constant acceleration]] are a good place to practise.

> [!tip] Write one step per line and keep the unknown on the side where its coefficient comes out positive. Most algebra mistakes are sign slips made while doing two things at once.
`,
  ideas: [
    'Whatever you do to one side of an equation, do to the other; the solutions do not change.',
    'Undo operations in reverse order: first additions and subtractions, then multiplications and divisions.',
    'A linear equation has exactly one solution, none (a contradiction) or infinitely many (an identity).',
    'Rearranging a formula for a different letter is solving a linear equation in that letter.'
  ],
  pitfalls: [
    'Changing the sign on only one side — From $5 - 2x = 11$, subtracting 5 from both sides gives $-2x = 6$, and dividing by −2 gives $x = -3$. Forgetting the minus in the last step gives $x = 3$, which fails the check.',
    'Multiplying only some terms by the common denominator — Every term on both sides must be multiplied, including the whole numbers: $\\tfrac{x}{3} + 2$ times 6 is $2x + 12$, not $2x + 2$.',
    'Dividing both sides by an expression that might be zero — Dividing $x(x - 4) = 3x$ by $x$ loses the solution $x = 0$. Division by a letter is only safe when it cannot be zero.'
  ],
  formulas: [
    {
      name: 'A linear equation',
      expr: 'a*x + b = c', tex: 'ax + b = c', solveFor: 'x',
      vars: {
        x: { name: 'the unknown', signed: true },
        a: { name: 'coefficient of x', value: 3, signed: true },
        b: { name: 'constant on the left', value: -4, signed: true },
        c: { name: 'right-hand side', value: 11, signed: true }
      },
      note: 'With $a = 0$ there is no unique solution: either none or every $x$.'
    },
    {
      name: 'Celsius to Fahrenheit',
      expr: 'F = 9/5*C + 32', tex: 'F = \\tfrac95 C + 32',
      vars: {
        F: { name: 'temperature in degrees Fahrenheit', signed: true },
        C: { name: 'temperature in degrees Celsius', value: 37, signed: true }
      },
      note: 'Solve for $C$ to see the rearranged formula $C = \\tfrac59(F - 32)$. The two scales agree at −40.',
      stories: {
        F: 'A thermometer reads {C} degrees Celsius. What is that in degrees Fahrenheit?',
        C: 'A recipe says to bake at {F} degrees Fahrenheit. What is that in degrees Celsius?'
      }
    }
  ],
  examples: [
    {
      title: 'Clearing fractions',
      q: 'Solve $\\dfrac{x}{3} + 2 = \\dfrac{x - 1}{2}$.',
      steps: [
        'The common denominator of 3 and 2 is 6. Multiply every term by 6: $2x + 12 = 3(x - 1) = 3x - 3$.',
        'Subtract $2x$ from both sides: $12 = x - 3$.',
        'Add 3: $x = 15$.',
        'Check: left side $5 + 2 = 7$, right side $14/2 = 7$.'
      ],
      a: '$x = 15$'
    },
    {
      title: 'Changing the subject of a formula',
      q: 'Simple interest gives $A = P(1 + rt)$. Make $r$ the subject, and find the rate that turns £2000 into £2300 in 3 years.',
      steps: [
        'Divide both sides by $P$: $\\dfrac{A}{P} = 1 + rt$.',
        'Subtract 1: $\\dfrac{A}{P} - 1 = rt$.',
        'Divide by $t$: $r = \\dfrac{A/P - 1}{t} = \\dfrac{A - P}{Pt}$.',
        'Numbers: $r = \\dfrac{300}{2000 \\times 3} = 0.05$, that is 5 % a year.'
      ],
      a: '$r = \\dfrac{A - P}{Pt}$; 5 % a year'
    },
    {
      title: 'Which taxi is cheaper?',
      q: 'Taxi A charges £3.00 plus £1.50 per km; taxi B charges £5.00 plus £1.10 per km. For what distance do they cost the same?',
      steps: [
        'Let $d$ be the distance in km. Equal fares: $3 + 1.5d = 5 + 1.1d$.',
        'Subtract $1.1d$ and 3 from both sides: $0.4d = 2$.',
        'Divide by 0.4: $d = 5$ km. Both fares are then £10.50.',
        'For shorter trips A is cheaper, for longer ones B — the start of an [[inequalities|inequality]].'
      ],
      a: '5 km'
    }
  ],
  quiz: [
    { q: 'Solve $3(x - 2) = x + 4$. Type the value of $x$.', answer: '5', vars: [],
      why: 'Expand: $3x - 6 = x + 4$. Collect: $2x = 10$, so $x = 5$. Check: $3 \\times 3 = 9 = 5 + 4$.' },
    { q: 'Make $t$ the subject of $v = u + at$.', answer: '(v - u)/a', vars: ['v', 'u', 'a'],
      why: 'Subtract $u$ from both sides, $v - u = at$, then divide by $a$.' },
    { q: 'Solving $2(x + 3) = 2x + 5$ gives…', choices: ['$x = 0$', '$x = 1$', 'no solution', 'every $x$ is a solution'], a: 2,
      why: 'The $x$ terms cancel and leave $6 = 5$, which is never true. The two sides are parallel lines, $y = 2x + 6$ and $y = 2x + 5$.' },
    { q: 'A student solves $5 - 2x = 11$ and writes $-2x = 6$, so $x = 3$. What went wrong?', choices: ['subtracting 5 from both sides', 'dividing 6 by −2 gives −3, not 3', 'nothing: $x = 3$ is right', 'the 11 should have become 16'], a: 1,
      why: 'The first step is right. Dividing by −2 gives $x = -3$; check: $5 - 2(-3) = 11$. With $x = 3$ the left side is −1.' },
    { q: 'Multiplying both sides of an equation by $x$ is always safe.', a: false,
      why: 'If $x$ can be zero, it can add a false solution. $x = 3$ multiplied by $x$ becomes $x^2 = 3x$, which is also solved by $x = 0$.' }
  ],
  applications: [
    'Rearranging physics and engineering formulas for whichever quantity is unknown.',
    'Unit and temperature conversions.',
    'Break-even points: when do two tariffs, machines or plans cost the same?',
    'Calibrating an instrument with a straight-line response.'
  ],
  sim: { id: 'alg-systems', params: { m1: 2, b1: -3, m2: 0, b2: 5 } }
},

{
  id: 'quadratic-equations', parent: 'equations-inequalities', title: 'Quadratic equations', level: 2,
  short: 'Equations with the unknown squared: solved by factorising, completing the square or the quadratic formula, with the discriminant counting the real roots.',
  keywords: ['quadratic', 'quadratic formula', 'discriminant', 'roots', 'completing the square', 'vertex', 'parabola', 'factorise', 'zero product', 'complex roots', 'sum and product of roots', 'Vieta'],
  prereq: ['linear-equations', 'factoring', 'exponents'],
  related: ['parabola', 'complex-numbers', 'polynomials', 'physics:constant-acceleration', 'physics:projectile-motion'],
  body: `
A quadratic equation has the unknown squared:
$$ax^2 + bx + c = 0, \\qquad a \\ne 0$$
It appears whenever something depends on a quantity multiplied by itself: the area of a square, the distance fallen in a time ($\\tfrac12 g t^2$), the energy of a moving body ($\\tfrac12 m v^2$). Its graph $y = ax^2 + bx + c$ is a [[parabola]], and the solutions — the **roots** — are where the parabola meets the $x$-axis. A parabola can cross the axis twice, touch it once or miss it, so a quadratic has two, one or no real roots.

### Three ways to solve
**Factorising**, when the roots are tidy: $x^2 - 5x + 6 = (x - 2)(x - 3) = 0$. A product is zero only when one of its factors is, so $x = 2$ or $x = 3$. (See [[factoring]].)

**Completing the square**, which always works and also shows the vertex: $x^2 + 6x + 5 = (x + 3)^2 - 4$. So $(x + 3)^2 = 4$, $x + 3 = \\pm 2$, and $x = -1$ or $x = -5$. The lowest point of the parabola is $(-3, -4)$.

**The quadratic formula**, which is completing the square done once and for all (see the derivation below):
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### The discriminant
The expression under the root, $\\Delta = b^2 - 4ac$, decides how many real roots there are:
- $\\Delta > 0$: two different real roots;
- $\\Delta = 0$: one repeated root, $x = -b/2a$, where the parabola just touches the axis;
- $\\Delta < 0$: no real roots — the two roots are a pair of [[complex-numbers|complex numbers]] $p \\pm qi$.

The roots sit symmetrically on either side of $x = -b/2a$, the axis of the parabola. Their sum is $-b/a$ and their product is $c/a$, a quick check on any answer.

### In physics
A ball thrown up at 15 m/s: when is it 10 m high? The equation $10 = 15t - 4.9t^2$ has two positive roots, 0.98 s on the way up and 2.08 s on the way down (see [[physics:constant-acceleration|constant acceleration]] and [[physics:projectile-motion|projectile motion]]). A negative discriminant is the mathematics saying the ball never gets that high. Quadratics also give stopping distances, the resonant frequency of a circuit and the energy levels of simple quantum systems.

> [!warn] Never divide both sides of $x^2 = 3x$ by $x$: you lose the root $x = 0$. Bring everything to one side and factorise: $x(x - 3) = 0$.
`,
  ideas: [
    'The roots of $ax^2 + bx + c = 0$ are where the parabola $y = ax^2 + bx + c$ meets the $x$-axis.',
    'Factorise when you can; complete the square or use the formula when you cannot.',
    'The discriminant $b^2 - 4ac$ tells you the number of real roots: two, one or none.',
    'The roots are symmetric about $x = -b/2a$; their sum is $-b/a$ and their product $c/a$.'
  ],
  pitfalls: [
    'Using the formula before the equation equals zero — $x^2 + 3x = 4$ must first become $x^2 + 3x - 4 = 0$, so $c = -4$, not 0.',
    'Writing $-b \\pm \\sqrt{\\Delta}$ over 2 instead of over $2a$ — The whole numerator is divided by $2a$. With $a = 3$, dividing by 2 gives roots three times too large.',
    'Throwing away a negative root without thinking — In a problem about time or length a negative root is often unphysical, but check what it means first: it may be a moment in the past or a position behind you.'
  ],
  derivation: {
    title: 'Derive the quadratic formula by completing the square',
    steps: [
      { text: 'Divide by $a$ (allowed, since $a \\ne 0$):', tex: 'x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0' },
      { text: 'Half the coefficient of $x$ is $b/2a$. Add and subtract its square, so the first terms form a perfect square:', tex: '\\left(x + \\frac{b}{2a}\\right)^2 - \\frac{b^2}{4a^2} + \\frac{c}{a} = 0' },
      { text: 'Move the constants to the right and put them over one denominator:', tex: '\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}' },
      { text: 'Take square roots, remembering both signs:', tex: 'x + \\frac{b}{2a} = \\pm\\frac{\\sqrt{b^2 - 4ac}}{2a}' },
      { text: 'Subtract $b/2a$. The expression under the root is real only when $b^2 - 4ac \\ge 0$:', tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' }
    ]
  },
  formulas: [
    {
      name: 'A quadratic equation',
      expr: 'a*x^2 + b*x + c = 0', tex: 'ax^2 + bx + c = 0', solveFor: 'x',
      vars: {
        x: { name: 'a root', signed: true },
        a: { name: 'coefficient of x²', value: 1, signed: true },
        b: { name: 'coefficient of x', value: -5, signed: true },
        c: { name: 'constant term', value: 6, signed: true }
      },
      note: 'Both real roots are found. If the discriminant is negative there is no real root to show.'
    },
    {
      name: 'The discriminant',
      expr: 'D = b^2 - 4*a*c', tex: '\\Delta = b^2 - 4ac',
      vars: {
        D: { name: 'discriminant', tex: '\\Delta', signed: true },
        a: { name: 'coefficient of x²', value: 1, signed: true },
        b: { name: 'coefficient of x', value: -5, signed: true },
        c: { name: 'constant term', value: 6, signed: true }
      },
      note: 'Positive: two real roots. Zero: one repeated root. Negative: a complex pair.'
    },
    {
      name: 'The axis of symmetry (vertex)',
      expr: 'h = -b/(2*a)', tex: 'h = -\\frac{b}{2a}',
      vars: {
        h: { name: 'x-coordinate of the vertex', signed: true },
        a: { name: 'coefficient of x²', value: 2, signed: true },
        b: { name: 'coefficient of x', value: -8, signed: true }
      },
      note: 'The vertex is $(h, k)$ with $k$ the value of the quadratic at $h$; the roots are $h \\pm \\sqrt{\\Delta}/2a$.'
    }
  ],
  examples: [
    {
      title: 'Two methods, one answer',
      q: 'Solve $2x^2 - 3x - 2 = 0$ by factorising, and check with the formula.',
      steps: [
        'Look for factors: $(2x + 1)(x - 2) = 2x^2 - 4x + x - 2 = 2x^2 - 3x - 2$.',
        'So $2x + 1 = 0$ or $x - 2 = 0$: $x = -\\tfrac12$ or $x = 2$.',
        'Formula: $\\Delta = 9 + 16 = 25$, so $x = \\dfrac{3 \\pm 5}{4}$, giving 2 and $-\\tfrac12$.',
        'Check with the sum and product: $2 - \\tfrac12 = \\tfrac32 = -b/a$ and $2 \\times (-\\tfrac12) = -1 = c/a$.'
      ],
      a: '$x = 2$ or $x = -\\tfrac12$'
    },
    {
      title: 'Completing the square',
      q: 'Solve $x^2 - 4x + 1 = 0$ exactly, and give the vertex of $y = x^2 - 4x + 1$.',
      steps: [
        'Half of −4 is −2: $x^2 - 4x + 1 = (x - 2)^2 - 4 + 1 = (x - 2)^2 - 3$.',
        'Set it to zero: $(x - 2)^2 = 3$, so $x - 2 = \\pm\\sqrt3$.',
        '$x = 2 \\pm \\sqrt3$, about 3.732 and 0.268.',
        'The vertex is where the square is zero: $(2, -3)$.'
      ],
      a: '$x = 2 \\pm \\sqrt3$; vertex $(2, -3)$'
    },
    {
      title: 'A path round a garden',
      q: 'A rectangular lawn 10 m by 6 m is surrounded by a gravel path of constant width $w$. Lawn and path together cover 120 m². How wide is the path?',
      steps: [
        'The outer rectangle is $(10 + 2w)$ by $(6 + 2w)$: $(10 + 2w)(6 + 2w) = 120$.',
        'Expand: $60 + 32w + 4w^2 = 120$, so $4w^2 + 32w - 60 = 0$, or $w^2 + 8w - 15 = 0$.',
        '$w = \\dfrac{-8 \\pm \\sqrt{64 + 60}}{2} = \\dfrac{-8 \\pm 11.14}{2}$.',
        'The negative root, −9.57 m, is not a width. So $w = 1.57$ m.'
      ],
      a: 'About 1.57 m'
    }
  ],
  quiz: [
    { q: 'The discriminant of $x^2 + 4x + 5$ is negative. The graph of $y = x^2 + 4x + 5$ therefore…', choices: ['crosses the $x$-axis twice', 'touches the $x$-axis once', 'never meets the $x$-axis', 'is a straight line'], a: 2,
      why: '$\\Delta = 16 - 20 = -4 < 0$: no real roots. The parabola opens upwards with its vertex at $(-2, 1)$, above the axis.' },
    { q: 'Complete the square: $x^2 + 6x + 11 = (x + 3)^2 + k$. Type $k$.', answer: '2', vars: [],
      why: '$(x + 3)^2 = x^2 + 6x + 9$, so $k = 11 - 9 = 2$.' },
    { q: 'Without solving, what is the sum of the roots of $2x^2 - 8x + 3 = 0$?', answer: '4', vars: [],
      why: 'The sum of the roots is $-b/a = 8/2 = 4$. (The roots are $2 \\pm \\sqrt{2.5}$, which do add to 4.)' },
    { q: 'Dividing $x^2 = 5x$ by $x$ gives the complete solution, $x = 5$.', a: false,
      why: 'It loses $x = 0$. Write $x^2 - 5x = x(x - 5) = 0$: the solutions are 0 and 5.' },
    { q: 'A ball\'s height is $h = 20t - 5t^2$ (metres, seconds). Solving $h = 25$ gives a negative discriminant. This means…', choices: ['the ball reaches 25 m twice', 'the ball never reaches 25 m', 'it reaches 25 m at $t = 2$ s', 'the equation must be wrong'], a: 1,
      why: '$5t^2 - 20t + 25 = 0$ has $\\Delta = 400 - 500 < 0$. The highest point is 20 m, at $t = 2$ s.' }
  ],
  problems: [
    { q: 'A stone is thrown upwards at 12 m/s from the top of a 30 m cliff. Its height above the ground is $h = 30 + 12t - 4.9t^2$. When does it hit the ground?', answer: 3.985, unit: 's',
      hint: 'Set $h = 0$ and keep the positive root.',
      steps: ['$4.9t^2 - 12t - 30 = 0$', '$t = \\dfrac{12 + \\sqrt{144 + 588}}{9.8} = \\dfrac{12 + 27.06}{9.8}$', '$t = 3.99$ s (the other root, −1.54 s, is before the throw).'] }
  ],
  applications: [
    'Times and heights in projectile motion; braking distances.',
    'Areas and optimal dimensions in design problems.',
    'Resonance in circuits and the characteristic equation of oscillators.',
    'Lens and mirror equations, which become quadratics when object and image distances are linked.'
  ],
  history: 'Babylonian scribes solved quadratic problems about areas nearly 4000 years ago by what amounts to completing the square. Al-Khwarizmi\'s ninth-century book on "restoring and balancing" — al-jabr, the origin of the word algebra — treated them systematically, with geometric proofs.',
  sim: 'alg-quadratic'
},

{
  id: 'systems-of-equations', parent: 'equations-inequalities', title: 'Systems of equations', level: 2,
  short: 'Several equations that must hold at once: solved by substitution or elimination, pictured as graphs that meet, with exactly one, no or infinitely many solutions.',
  keywords: ['simultaneous equations', 'system of equations', 'substitution', 'elimination', 'intersection', 'Cramer\'s rule', 'determinant', 'consistent', 'inconsistent', 'parallel lines', 'two unknowns'],
  prereq: ['linear-equations', 'linear-functions'],
  related: ['gaussian-elimination', 'determinants', 'matrices', 'quadratic-equations', 'physics:kirchhoffs-laws'],
  body: `
One equation in two unknowns, such as $2x + 3y = 12$, has infinitely many solutions: every point of a line. A second equation, $x - y = 1$, pins things down. The solution of the **system** is the pair $(x, y)$ that satisfies both — the point where the two lines cross, here $(3, 2)$.

### Substitution
Solve one equation for one unknown and put the result into the other. From $x - y = 1$, $x = y + 1$. Then $2(y + 1) + 3y = 12$, so $5y = 10$, $y = 2$ and $x = 3$.

### Elimination
Add or subtract multiples of the equations so that one unknown disappears. Multiply $x - y = 1$ by 3 and add it to the first: $5x = 15$, so $x = 3$. Elimination scales up without trouble: organised properly it is [[gaussian-elimination|Gaussian elimination]], which solves thousands of equations at once.

### One, none or infinitely many
Two lines in a plane can cross, be parallel, or be the same line:

| Picture | Equations | Solutions |
|---|---|---|
| lines cross | different slopes | exactly one |
| parallel lines | same slope, different intercepts | none |
| the same line twice | one equation a multiple of the other | infinitely many |

For $a_1 x + b_1 y = c_1$ and $a_2 x + b_2 y = c_2$ the test is the **determinant** $D = a_1 b_2 - a_2 b_1$. If $D \\ne 0$ there is exactly one solution, given by **Cramer's rule**:
$$x = \\frac{c_1 b_2 - c_2 b_1}{D}, \\qquad y = \\frac{a_1 c_2 - a_2 c_1}{D}$$
If $D = 0$ the lines are parallel or identical. This is the 2 × 2 case of [[determinants]] and of the [[matrix-inverse|inverse matrix]].

### Non-linear systems
A line and a parabola meet in two, one or no points. Substituting the line into the parabola gives a [[quadratic-equations|quadratic equation]], and its discriminant counts the meeting points. A line and a circle work the same way.

### Where systems come from
From every situation in which several conditions hold at once. The currents in a circuit satisfy one equation per junction and one per loop ([[physics:kirchhoffs-laws|Kirchhoff's laws]]); a structure at rest balances the forces in each direction; a balanced chemical equation matches the atoms of each element; two moving objects meet where their position equations agree; a GPS receiver finds its position from several distance equations at once.

> [!tip] Count before you start: in general you need as many independent equations as unknowns.
`,
  ideas: [
    'A solution of a system satisfies every equation at once: graphically, it is where the graphs meet.',
    'Substitution replaces one unknown by an expression; elimination adds multiples of equations to remove it.',
    'Two linear equations have exactly one solution, none (parallel lines) or infinitely many (the same line).',
    'The determinant $a_1b_2 - a_2b_1$ is non-zero exactly when there is a single solution.'
  ],
  pitfalls: [
    'Stopping after finding one unknown — A solution is a pair. Once you have $x$, substitute back to find $y$, and check both in both equations.',
    'Two equations always give one solution — Not if they are parallel or equivalent. $x + y = 2$ and $2x + 2y = 4$ are the same line in disguise.',
    'Adding equations without multiplying every term — When you scale an equation to eliminate, the right-hand side must be scaled too.'
  ],
  formulas: [
    {
      name: 'The determinant of a 2 × 2 system',
      expr: 'D = a1*b2 - a2*b1', tex: 'D = a_1 b_2 - a_2 b_1',
      vars: {
        D: { name: 'determinant', signed: true },
        a1: { name: 'x-coefficient, equation 1', value: 2, signed: true },
        b1: { name: 'y-coefficient, equation 1', value: 3, signed: true },
        a2: { name: 'x-coefficient, equation 2', value: 1, signed: true },
        b2: { name: 'y-coefficient, equation 2', value: -1, signed: true }
      },
      note: 'For $a_1x + b_1y = c_1$, $a_2x + b_2y = c_2$. Zero means parallel or identical lines.'
    },
    {
      name: 'Cramer\'s rule for x',
      expr: 'x = (c1*b2 - c2*b1)/(a1*b2 - a2*b1)', tex: 'x = \\frac{c_1 b_2 - c_2 b_1}{a_1 b_2 - a_2 b_1}',
      vars: {
        x: { name: 'solution x', signed: true },
        a1: { name: 'x-coefficient, equation 1', value: 2, signed: true },
        b1: { name: 'y-coefficient, equation 1', value: 3, signed: true },
        c1: { name: 'right-hand side, equation 1', value: 12, signed: true },
        a2: { name: 'x-coefficient, equation 2', value: 1, signed: true },
        b2: { name: 'y-coefficient, equation 2', value: -1, signed: true },
        c2: { name: 'right-hand side, equation 2', value: 1, signed: true }
      },
      practice: { unknowns: ['x'] }
    },
    {
      name: 'Cramer\'s rule for y',
      expr: 'y = (a1*c2 - a2*c1)/(a1*b2 - a2*b1)', tex: 'y = \\frac{a_1 c_2 - a_2 c_1}{a_1 b_2 - a_2 b_1}',
      vars: {
        y: { name: 'solution y', signed: true },
        a1: { name: 'x-coefficient, equation 1', value: 2, signed: true },
        b1: { name: 'y-coefficient, equation 1', value: 3, signed: true },
        c1: { name: 'right-hand side, equation 1', value: 12, signed: true },
        a2: { name: 'x-coefficient, equation 2', value: 1, signed: true },
        b2: { name: 'y-coefficient, equation 2', value: -1, signed: true },
        c2: { name: 'right-hand side, equation 2', value: 1, signed: true }
      },
      practice: { unknowns: ['y'] }
    }
  ],
  examples: [
    {
      title: 'Tickets',
      q: 'A theatre sells 30 tickets for £285. Adult tickets cost £12 and child tickets £7. How many of each were sold?',
      steps: [
        'Let $a$ and $c$ be the numbers of adult and child tickets: $a + c = 30$ and $12a + 7c = 285$.',
        'Substitute $c = 30 - a$: $12a + 210 - 7a = 285$, so $5a = 75$ and $a = 15$.',
        'Then $c = 15$. Check: $12 \\times 15 + 7 \\times 15 = 180 + 105 = 285$.'
      ],
      a: '15 adult and 15 child tickets'
    },
    {
      title: 'Mixing two solutions',
      q: 'How many litres of 10 % acid and of 25 % acid must be mixed to make 30 L of 20 % acid?',
      steps: [
        'Volumes: $x + y = 30$. Amount of acid: $0.10x + 0.25y = 0.20 \\times 30 = 6$.',
        'Multiply the first by 0.10 and subtract it from the second: $0.15y = 3$, so $y = 20$.',
        'Then $x = 10$. Check: $1 + 5 = 6$ L of acid.'
      ],
      a: '10 L of the 10 % acid and 20 L of the 25 % acid'
    },
    {
      title: 'A line meets a parabola',
      q: 'Where does the line $y = x + 1$ meet the parabola $y = x^2 - 1$?',
      steps: [
        'At a meeting point both give the same $y$: $x^2 - 1 = x + 1$.',
        'So $x^2 - x - 2 = 0$, which factorises as $(x - 2)(x + 1) = 0$.',
        '$x = 2$ gives $y = 3$; $x = -1$ gives $y = 0$.'
      ],
      a: '$(2, 3)$ and $(-1, 0)$'
    }
  ],
  quiz: [
    { q: 'The system $y = 2x + 1$, $y = 2x - 3$ has…', choices: ['one solution', 'two solutions', 'no solution', 'infinitely many solutions'], a: 2,
      why: 'Same slope, different intercepts: parallel lines never meet. Subtracting gives $0 = 4$.' },
    { q: 'Solve $x + y = 10$ and $x - y = 4$. Type the value of $x$.', answer: '7', vars: [],
      why: 'Adding the equations eliminates $y$: $2x = 14$, so $x = 7$ (and $y = 3$).' },
    { q: 'For which $k$ do $2x + ky = 5$ and $4x + 6y = 1$ fail to have a single solution? Type $k$.', answer: '3', vars: [],
      why: 'The determinant $2 \\times 6 - 4k$ must be zero, so $k = 3$. Then the lines are parallel: $4x + 6y = 10$ against $4x + 6y = 1$.' },
    { q: 'Three linear equations in two unknowns can never have a solution.', a: false,
      why: 'They can, if all three lines pass through one point. Usually they do not — such a system is overdetermined — which is why measured data are fitted by [[linear-regression|least squares]] instead.' },
    { q: 'How many points do the line $y = 3$ and the parabola $y = x^2 + 4$ share?', choices: ['two', 'one', 'none', 'infinitely many'], a: 2,
      why: '$x^2 + 4 = 3$ would need $x^2 = -1$, which has no real solution: the parabola lies entirely above $y = 4$.' }
  ],
  applications: [
    'Circuit analysis with Kirchhoff\'s laws.',
    'Force balance in structures and statics.',
    'Balancing chemical equations and mixture problems.',
    'Satellite navigation, which solves distance equations for position and clock error.'
  ],
  sim: 'alg-systems'
},

{
  id: 'inequalities', parent: 'equations-inequalities', title: 'Inequalities', level: 1,
  short: 'Statements that one quantity is larger than another: solved almost like equations, except that multiplying by a negative number flips the sign, with intervals as answers.',
  keywords: ['inequality', 'less than', 'greater than', 'interval notation', 'number line', 'flip the sign', 'quadratic inequality', 'sign chart', 'rational inequality', 'double inequality', 'tolerance'],
  prereq: ['linear-equations', 'number-systems'],
  related: ['absolute-value', 'quadratic-equations', 'optimization'],
  body: `
An inequality says which way the balance tips: $x < 5$ (less than), $x \\le 5$ (less than or equal to), $x > 5$, $x \\ge 5$. Its solution is usually not a single number but a whole stretch of the number line, an **interval**.

### Interval notation

| Inequality | Interval | On the number line |
|---|---|---|
| $2 < x \\le 5$ | $(2, 5]$ | open dot at 2, filled dot at 5 |
| $x \\ge -1$ | $[-1, \\infty)$ | filled dot at −1, arrow to the right |
| $x < 3$ | $(-\\infty, 3)$ | open dot at 3, arrow to the left |

A round bracket leaves the end out, a square bracket keeps it in. Infinity always takes a round bracket: it is not a number you can reach.

### Solving linear inequalities
Nearly everything works as for [[linear-equations|equations]]. You may add or subtract anything on both sides, and multiply or divide both sides by a **positive** number. The one new rule: **multiplying or dividing by a negative number reverses the inequality**. $3 > 1$, but $-3 < -1$. So
$$5 - 2x > 11 \\;\\Rightarrow\\; -2x > 6 \\;\\Rightarrow\\; x < -3$$
Check with a test value: $x = -4$ gives $5 + 8 = 13 > 11$.

A **double inequality** handles two conditions at once: $-1 \\le 2x + 3 < 7$ gives $-4 \\le 2x < 4$, so $-2 \\le x < 2$.

### Quadratic and rational inequalities
For $x^2 - x - 6 < 0$, first find where the expression is zero: $(x + 2)(x - 3) = 0$ at $x = -2$ and $x = 3$. The parabola opens upwards, so it is below the axis between its roots: $-2 < x < 3$. A **sign chart** does the same for any product or quotient: each factor changes sign only at its own zero, so test one value in each interval.

For a fraction such as $\\dfrac{x - 1}{x + 2} \\ge 0$, never multiply through by $x + 2$ — you do not know its sign. The sign chart says the quotient is positive when both factors have the same sign: $x < -2$ or $x \\ge 1$. ($x = -2$ is excluded because it divides by zero; $x = 1$ is included because $0 \\ge 0$.)

### In science and engineering
Tolerances are inequalities: a shaft specified as 20.00 ± 0.02 mm must satisfy $19.98 \\le d \\le 20.02$, which [[absolute-value|absolute value]] writes compactly. Safety limits, stability conditions, the constraints of [[optimization]] problems and the error bounds of numerical methods are all inequalities.

> [!warn] Flip the sign whenever you multiply or divide by a negative number. Squaring both sides or taking reciprocals can also reverse or break an inequality — check with test values.
`,
  ideas: [
    'The solution of an inequality is usually an interval, not a single number.',
    'Adding, subtracting, and multiplying or dividing by a positive number keep the inequality; multiplying or dividing by a negative number reverses it.',
    'For quadratic and rational inequalities, find the zeros and the forbidden points, then test the sign in each interval between them.',
    'Round brackets exclude an end point, square brackets include it; $\\infty$ always takes a round bracket.'
  ],
  pitfalls: [
    'Dividing $-2x > 6$ by −2 to get $x > -3$ — Dividing by a negative reverses the sign: $x < -3$. The test value $x = 0$ gives $0 > 6$, which is false, so $x > -3$ cannot be right.',
    '$x^2 < 9$ means $x < 3$ — It also needs $x > -3$: the solution is $-3 < x < 3$. Taking square roots of an inequality needs care with signs.',
    'If $a < b$ then $\\tfrac1a < \\tfrac1b$ — For positive numbers reciprocals reverse the order: $2 < 4$ but $\\tfrac12 > \\tfrac14$. With mixed signs anything can happen.'
  ],
  examples: [
    {
      title: 'Solve and check',
      q: 'Solve $3 - 4x \\le 15$ and write the answer as an interval.',
      steps: [
        'Subtract 3: $-4x \\le 12$.',
        'Divide by −4 and reverse the sign: $x \\ge -3$.',
        'Check: $x = 0$ gives $3 \\le 15$, true; $x = -5$ gives $23 \\le 15$, false. Good.'
      ],
      a: '$x \\ge -3$, that is $[-3, \\infty)$'
    },
    {
      title: 'A quadratic inequality',
      q: 'Solve $2x^2 - 5x - 3 \\ge 0$.',
      steps: [
        'Factorise: $2x^2 - 5x - 3 = (2x + 1)(x - 3)$, which is zero at $x = -\\tfrac12$ and $x = 3$.',
        'The parabola opens upwards, so it is at or above the axis outside the roots.',
        'Test $x = 0$: $-3 \\ge 0$ is false, confirming that the middle interval is excluded.'
      ],
      a: '$x \\le -\\tfrac12$ or $x \\ge 3$'
    },
    {
      title: 'A tolerance',
      q: 'A resistor is marked 470 Ω ± 5 %. Between which values must its resistance lie?',
      steps: [
        '5 % of 470 Ω is 23.5 Ω.',
        '$470 - 23.5 \\le R \\le 470 + 23.5$.'
      ],
      a: '$446.5\\ \\Omega \\le R \\le 493.5\\ \\Omega$'
    }
  ],
  quiz: [
    { q: 'Solve $-3x \\ge 12$.', choices: ['$x \\ge -4$', '$x \\le -4$', '$x \\ge 4$', '$x \\le 4$'], a: 1,
      why: 'Divide by −3 and reverse the inequality: $x \\le -4$. Check: $x = -5$ gives $15 \\ge 12$.' },
    { q: 'The solution of $x^2 > 4$ is…', choices: ['$x > 2$', '$x > \\pm 2$', '$x < -2$ or $x > 2$', '$-2 < x < 2$'], a: 2,
      why: 'The parabola $x^2 - 4$ is positive outside its roots ±2. $x = -3$ works too: $9 > 4$.' },
    { q: 'If $a < b$, then $a^2 < b^2$.', a: false,
      why: 'Try $a = -3$ and $b = 1$: $a < b$, but $9 > 1$. Squaring keeps the order only when both numbers are non-negative.' },
    { q: 'Which interval is $-1 < x \\le 4$?', choices: ['$[-1, 4]$', '$(-1, 4]$', '$[-1, 4)$', '$(-1, 4)$'], a: 1,
      why: '−1 is excluded (round bracket), 4 is included (square bracket).' },
    { q: 'For which $x$ is $\\dfrac1x < 1$?', choices: ['$x > 1$', '$x < 0$ or $x > 1$', '$0 < x < 1$', 'every $x$ except 0'], a: 1,
      why: 'Negative $x$ make $1/x$ negative, which is less than 1. For positive $x$ you need $x > 1$. Multiplying by $x$ without knowing its sign loses the negative half.' }
  ],
  applications: [
    'Manufacturing tolerances and quality control.',
    'Safety limits: maximum loads, speeds, doses and temperatures.',
    'Constraints in optimisation and linear programming.',
    'Error bounds that guarantee a numerical answer is close enough.'
  ],
  sim: { id: 'alg-quadratic', params: { a: 1, b: -1, c: -6, shade: true } }
},

{
  id: 'absolute-value', parent: 'equations-inequalities', title: 'Absolute value', level: 1,
  short: 'The size of a number without its sign — its distance from zero — and the distance between two numbers, the natural language of tolerances and errors.',
  keywords: ['absolute value', 'modulus', 'magnitude', '|x|', 'distance', 'V-shaped graph', 'triangle inequality', 'tolerance', 'error', 'percentage error'],
  prereq: ['number-systems', 'inequalities'],
  related: ['function-transformations', 'vectors', 'complex-plane', 'error-propagation'],
  body: `
The **absolute value** $|x|$ is the distance of $x$ from zero on the number line, so it is never negative: $|7| = 7$, $|-7| = 7$ and $|0| = 0$. As a rule,
$$|x| = \\begin{cases} x & x \\ge 0 \\\\ -x & x < 0 \\end{cases}$$
The minus sign in the second line turns a negative number positive. The graph of $y = |x|$ is a V with its corner at the origin.

### The distance between two numbers
The distance between $a$ and $b$ is $|a - b|$, whichever is larger: $|2 - 9| = |9 - 2| = 7$. Reading absolute values as distances solves most problems at once:
- $|x - 3| = 5$: $x$ is 5 away from 3, so $x = -2$ or $x = 8$.
- $|x - 3| < 5$: $x$ is within 5 of 3, so $-2 < x < 8$.
- $|x - 3| > 5$: $x$ is more than 5 away from 3, so $x < -2$ or $x > 8$.

In general, for $d > 0$,
$$|x - a| < d \\iff a - d < x < a + d$$
which is exactly how a tolerance is written: a length of 20.00 ± 0.02 mm means $|L - 20.00| \\le 0.02$. An equation such as $|2x + 1| = 7$ splits into two linear ones, $2x + 1 = 7$ or $2x + 1 = -7$, giving $x = 3$ or $x = -4$.

### Rules
$|ab| = |a|\\,|b|$ and $|a/b| = |a|/|b|$. For sums only an inequality survives, the **triangle inequality**:
$$|a + b| \\le |a| + |b|$$
Walk 3 km and then 5 km in a straight line and you end at most 8 km from home (and at least 2 km). The same inequality for [[vectors]] says that one side of a triangle is never longer than the other two together. Note also that $\\sqrt{x^2} = |x|$, not $x$.

### Size without direction
"How big, ignoring which way" is an idea that keeps coming back. The length of a vector $|\\vec v|$, the modulus $|z|$ of a complex number (see [[complex-plane|the complex plane]]) and the size of an error in a measurement (see [[error-propagation]]) all generalise the absolute value. A speed is the absolute value of a velocity along a line ([[physics:speed-velocity|speed and velocity]]).

> [!tip] Read $|x - a|$ as "the distance from $x$ to $a$" and most absolute-value problems solve themselves.
`,
  ideas: [
    '$|x|$ is the distance from $x$ to 0; it is never negative.',
    '$|a - b|$ is the distance between $a$ and $b$ on the number line.',
    '$|x - a| < d$ means $a - d < x < a + d$: within $d$ of $a$.',
    'The triangle inequality $|a + b| \\le |a| + |b|$ holds for numbers, vectors and complex numbers.'
  ],
  pitfalls: [
    '$|a + b| = |a| + |b|$ — Only when $a$ and $b$ have the same sign. $|3 + (-3)| = 0$, but $|3| + |-3| = 6$.',
    '$|x| = 5$ means $x = 5$ — It also allows $x = -5$: two points are at distance 5 from zero.',
    '$|x - 3| < 5$ means $x - 3 < 5$, so $x < 8$ — That keeps only half the condition; $x$ must also exceed −2.'
  ],
  formulas: [
    {
      name: 'Distance on the number line',
      expr: 'd = abs(x - a)', tex: 'd = \\left| x - a \\right|', solveFor: 'd',
      vars: {
        d: { name: 'distance' },
        x: { name: 'a number', value: 8, signed: true },
        a: { name: 'reference point', value: 3, signed: true }
      },
      note: 'Solve for $x$ to get both numbers at a distance $d$ from $a$: $x = a \\pm d$.',
      stories: { x: 'Which numbers lie at a distance {d} from {a} on the number line?' }
    },
    {
      name: 'Percentage error, with its sign',
      expr: 'E = 100*(M - T)/T', tex: 'E = \\frac{M - T}{T} \\times 100',
      vars: {
        E: { name: 'signed percentage error, in %', signed: true },
        M: { name: 'measured value', value: 9.62 },
        T: { name: 'accepted value', value: 9.81 }
      },
      note: 'The sign says whether the measurement is too high or too low; the size of the error, the number usually quoted, is $|E|$. A measurement $|E|$ per cent too high and one $|E|$ per cent too low are equally good.',
      stories: { E: 'A pendulum experiment gives g = {M} m/s², while the accepted value is {T} m/s². What is the percentage error?' }
    }
  ],
  examples: [
    {
      title: 'An absolute-value equation',
      q: 'Solve $|2x - 5| = 9$.',
      steps: [
        'Either $2x - 5 = 9$, so $2x = 14$ and $x = 7$;',
        'or $2x - 5 = -9$, so $2x = -4$ and $x = -2$.',
        'Check: $|14 - 5| = 9$ and $|-4 - 5| = 9$.'
      ],
      a: '$x = 7$ or $x = -2$'
    },
    {
      title: 'An absolute-value inequality',
      q: 'Solve $|3x + 1| \\le 8$.',
      steps: [
        'Within 8 of zero: $-8 \\le 3x + 1 \\le 8$.',
        'Subtract 1 throughout: $-9 \\le 3x \\le 7$.',
        'Divide by 3: $-3 \\le x \\le \\tfrac73$.'
      ],
      a: '$-3 \\le x \\le \\tfrac73$'
    },
    {
      title: 'Passing inspection',
      q: 'A bolt must be 12.00 mm thick to within 0.05 mm. Which of these pass: 11.96 mm, 12.07 mm, 11.95 mm?',
      steps: [
        'The condition is $|d - 12.00| \\le 0.05$, that is $11.95 \\le d \\le 12.05$.',
        '11.96: distance 0.04, passes. 12.07: distance 0.07, fails. 11.95: distance exactly 0.05, passes (the end point is included).'
      ],
      a: '11.96 mm and 11.95 mm pass; 12.07 mm fails.'
    }
  ],
  quiz: [
    { q: 'Solve $|x + 2| = 5$.', choices: ['$x = 3$', '$x = 3$ or $x = -7$', '$x = -3$ or $x = 7$', '$x = \\pm 5$'], a: 1,
      why: '$|x + 2| = |x - (-2)|$ is the distance from −2. The points 5 away from −2 are 3 and −7.' },
    { q: '$|x - 4| < 1$ describes…', choices: ['$3 < x < 5$', '$x < 5$', '$x < 3$ or $x > 5$', '$-5 < x < -3$'], a: 0,
      why: 'Every number within 1 of 4.' },
    { q: '$|a + b| = |a| + |b|$ for all real numbers $a$ and $b$.', a: false,
      why: 'With $a = 3$ and $b = -3$ the left side is 0 and the right side is 6. Only $\\le$ holds in general.' },
    { q: '$|x| = -x$ can be true.', a: true,
      why: 'For every $x \\le 0$. If $x = -4$, then $-x = 4 = |x|$. The expression $-x$ is positive when $x$ is negative.' },
    { q: 'How many solutions does $|x - 1| = -2$ have?', choices: ['two', 'one', 'none', 'infinitely many'], a: 2,
      why: 'A distance cannot be negative, so no $x$ works.' }
  ],
  applications: [
    'Tolerances in engineering drawings and quality control.',
    'Errors and residuals: how far a measurement or a fitted value is from the truth.',
    'Magnitudes of vectors and complex numbers.',
    'Full-wave rectifiers in electronics, which output the absolute value of an alternating voltage.'
  ],
  sim: { id: 'alg-transform', params: { fn: 'abs' } }
}

);
