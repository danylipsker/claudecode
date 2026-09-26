/* HYPER-MATH · content/series.js — sequences and series: progressions, convergence,
 * power, Taylor and Fourier series. Simulations are in sims/series-odes.js. */
Hyper.add(

{
  id: 'sequences', parent: 'sequences-series', title: 'Sequences', level: 1,
  short: 'An endless ordered list of numbers — given by a formula or by a rule that builds each term from the one before — and the question of where it is heading.',
  keywords: ['sequence', 'term', 'nth term', 'general term', 'recursive', 'recurrence relation', 'limit of a sequence', 'convergent', 'divergent', 'monotone', 'bounded', 'Fibonacci', 'fixed point'],
  prereq: ['functions', 'exponents'],
  related: ['limits-at-infinity', 'number-e', 'newtons-method', 'euler-method'],
  body: `
A **sequence** is a list of numbers in a definite order that never ends: $a_1, a_2, a_3, \\dots$ Formally it is a [[functions|function]] whose inputs are the whole numbers $n = 1, 2, 3, \\dots$, and the output $a_n$ is the $n$-th **term**. Readings taken once a second, the balance of a savings account at the end of each year, the population of a species generation by generation and the successive guesses of a root-finding algorithm are all sequences.

### Two ways to give one
- An **explicit formula** says how to get any term directly: $a_n = 1/n$ gives $1, \\tfrac12, \\tfrac13, \\tfrac14, \\dots$ and the thousandth term is simply $0.001$.
- A **recursive rule** gives a starting value and a recipe for the next term from the previous ones. With $a_1 = 1$ and $a_{n+1} = \\tfrac12\\left(a_n + 2/a_n\\right)$ you get $1,\\ 1.5,\\ 1.41667,\\ 1.414216, \\dots$ — closing in on $\\sqrt 2$ astonishingly fast. The Fibonacci numbers, $F_{n+1} = F_n + F_{n-1}$, are recursive too.

Recursive rules are how computers and step-by-step processes naturally work (every numerical method, including [[newtons-method|Newton's method]] and [[euler-method|Euler's method]], produces one); explicit formulas are what you want when you need to jump straight to the millionth term.

### Where is it going? The limit
The central question is the long-run behaviour. A sequence **converges** to the limit $L$ when its terms eventually stay as close to $L$ as you care to demand:

$$\\lim_{n\\to\\infty} a_n = L$$

Precisely: for every tolerance $\\varepsilon > 0$ there is a point $N$ beyond which $|a_n - L| < \\varepsilon$ for *every* term. For $a_n = 1/n$ and $\\varepsilon = 0.001$, every term after $n = 1000$ qualifies, and a smaller $\\varepsilon$ just moves $N$ further out, so the limit is $0$. A sequence that does not converge **diverges**, either by growing without bound ($2^n$) or by never settling down ($(-1)^n$ flips between $-1$ and $1$ for ever).

### Facts worth knowing
- **Powers:** $r^n \\to 0$ when $|r| < 1$, stays at 1 when $r = 1$, and diverges otherwise.
- **Who wins:** for large $n$, $\\ln n \\ll n^p \\ll b^n \\ll n!$ (with $p > 0$, $b > 1$). So $n^{10}/2^n \\to 0$ — although it first climbs to about eighteen million near $n = 14$.
- **Monotone and bounded means convergent.** An increasing sequence with a ceiling must level off somewhere. The sequence $(1 + 1/n)^n$ runs $2,\\ 2.25,\\ 2.370,\\ 2.441, \\dots$, keeps rising and never passes 3; its limit is [[number-e|the number e]] $= 2.71828\\ldots$
- **Fixed points.** If $a_{n+1} = g(a_n)$ with $g$ continuous and the sequence converges, the limit satisfies $L = g(L)$. For the square-root rule above, $L = \\tfrac12(L + 2/L)$ gives $L^2 = 2$.

> [!key] Convergence is a property of the tail. Change the first million terms and the limit does not move.

Adding up the terms of a sequence gives a series, which is the subject of [[arithmetic-series|arithmetic]] and [[geometric-series|geometric]] series and of the [[convergence-tests|convergence tests]].
`,
  ideas: [
    'A sequence is a function of the whole numbers: a rule that gives the n-th term.',
    'It can be given explicitly, by a formula in n, or recursively, each term from earlier ones.',
    'It converges to L if its terms eventually stay within any tolerance of L; otherwise it diverges.',
    'An increasing sequence that is bounded above always converges.',
    'A convergent recursion $a_{n+1} = g(a_n)$ ends at a fixed point, where $L = g(L)$.'
  ],
  pitfalls: [
    'A sequence and a series are the same thing — A sequence is a list; a series is the sum of the list. The sequence $1/n$ converges to 0, while the series $1 + \\tfrac12 + \\tfrac13 + \\cdots$ grows without bound.',
    'If the gaps between terms shrink, the sequence converges — $\\sqrt n$ has gaps that shrink to zero and still grows for ever. Convergence needs the terms to approach one fixed number.',
    'The first few terms show where a sequence is going — $n^{10}/2^n$ climbs past ten million before collapsing towards zero. Only the tail decides.'
  ],
  formulas: [
    {
      name: 'The sequence that defines e',
      expr: 'a = (1 + 1/n)^n', tex: 'a_n = \\left(1 + \\frac{1}{n}\\right)^n',
      vars: {
        a: { name: 'n-th term', tex: 'a_n' },
        n: { name: 'term number', int: true, value: 10 }
      },
      note: 'The terms increase towards $e = 2.71828\\ldots$ but never reach it. Solve for $n$ to see how far out you must go for a given accuracy.',
      stories: { n: 'How many terms of $(1 + 1/n)^n$ do you need before the term reaches {a}?' }
    },
    {
      name: 'A linear recursion and its fixed point',
      expr: 'an = b/(1 - r) + (a0 - b/(1 - r))*r^n', tex: 'a_n = \\frac{b}{1-r} + \\left(a_0 - \\frac{b}{1-r}\\right) r^n',
      vars: {
        an: { name: 'value after n steps', tex: 'a_n' },
        a0: { name: 'starting value', tex: 'a_0', value: 0, signed: true },
        r: { name: 'fraction kept at each step', value: 0.5, min: 0, max: 0.99 },
        b: { name: 'amount added at each step', value: 100, signed: true },
        n: { name: 'number of steps', int: true, value: 5 }
      },
      solveFor: 'an',
      note: 'The solution of $a_{n+1} = r\\,a_n + b$. For $0 \\le r < 1$ it approaches the fixed point $b/(1-r)$ whatever the start — the steady level of a daily dose of medicine, or of a lake that loses a fixed fraction of its pollutant each year while more flows in.',
      practice: { unknowns: ['an', 'n'] },
      stories: {
        an: 'A patient starts with none of a drug, takes {b} mg once a day, and a fraction {r} of what is in the body survives each day. How many milligrams are there just after dose number {n}?',
        n: 'A recursion keeps a fraction {r} of the previous value and adds {b} at each step, starting from {a0}. After how many steps does it reach {an}?'
      }
    }
  ],
  examples: [
    {
      title: 'Square roots by averaging',
      q: 'Starting from $a_1 = 1$, compute three more terms of $a_{n+1} = \\tfrac12\\left(a_n + 2/a_n\\right)$ and find its limit.',
      steps: [
        '$a_2 = \\tfrac12(1 + 2) = 1.5$',
        '$a_3 = \\tfrac12(1.5 + 1.33333) = 1.416667$',
        '$a_4 = \\tfrac12(1.416667 + 1.411765) = 1.414216$',
        'The errors against $\\sqrt 2 = 1.4142136$ are $0.41,\\ 0.086,\\ 0.0025,\\ 0.000002$: the number of correct digits roughly doubles each step.',
        { text: 'If the limit is $L$, it must be a fixed point of the rule:', tex: 'L = \\tfrac12\\left(L + \\frac{2}{L}\\right) \\;\\Rightarrow\\; L^2 = 2 \\;\\Rightarrow\\; L = \\sqrt 2' }
      ],
      a: '1.5, 1.41667, 1.414216 …, converging to √2.'
    },
    {
      title: 'How far out for a given accuracy?',
      q: 'The sequence $a_n = \\dfrac{2n + 1}{n + 3}$ converges to 2. From which term on is it within 0.01 of its limit?',
      steps: [
        { text: 'Measure the distance from the limit:', tex: '|a_n - 2| = \\left|\\frac{2n + 1 - 2(n+3)}{n+3}\\right| = \\frac{5}{n + 3}' },
        'Demand $\\dfrac{5}{n+3} < 0.01$, that is $n + 3 > 500$, so $n > 497$.',
        'Check: $a_{498} = 997/501 = 1.99002$, just inside the tolerance.'
      ],
      a: 'From n = 498 onwards.'
    }
  ],
  quiz: [
    { q: 'Which sequence converges?', choices: ['$a_n = (-1)^n$', '$a_n = \\dfrac{n}{n+1}$', '$a_n = \\ln n$', '$a_n = 1.01^n$'], a: 1,
      why: '$n/(n+1) = 1 - 1/(n+1) \\to 1$. The first oscillates, $\\ln n$ grows without bound (slowly), and $1.01^n$ grows exponentially.' },
    { q: 'A sequence whose successive terms get closer and closer together must converge.', a: false,
      why: 'The gaps of $\\sqrt n$ or $\\ln n$ shrink to zero, yet both grow for ever. Converging means approaching one fixed number, not just taking smaller steps.' },
    { q: 'Find $\\displaystyle\\lim_{n\\to\\infty} \\frac{3n^2 - n}{n^2 + 5}$.', answer: '3', vars: [],
      why: 'Divide top and bottom by $n^2$: $\\dfrac{3 - 1/n}{1 + 5/n^2} \\to \\dfrac{3}{1} = 3$.' },
    { q: 'The recursion $a_{n+1} = \\tfrac12 a_n + 3$ converges. To what?', choices: ['3', '6', '1.5', 'It depends on the first term'], a: 1,
      why: 'A limit must be a fixed point: $L = \\tfrac12 L + 3$ gives $L = 6$. Because each step halves the distance to 6, the start does not matter.' },
    { q: 'For very large $n$, which is largest?', choices: ['$n^{100}$', '$2^n$', '$n!$', '$100^n$'], a: 2,
      why: 'Each step multiplies $n!$ by $n + 1$, which eventually exceeds any fixed base such as 100, so the factorial overtakes every exponential — and exponentials overtake every power.' }
  ],
  applications: [
    'Iterative algorithms — square roots, Newton\'s method, ODE solvers — produce sequences whose limit is the answer.',
    'Finance: account balances or loan balances year by year.',
    'Population biology: counts from one generation to the next in discrete-time models.'
  ],
  history: 'Sequences defined by recursion are ancient — the averaging rule for square roots was used in Babylon — but the modern definition of a limit, with its tolerance $\\varepsilon$ and threshold $N$, took shape in the 19th century with Cauchy and Weierstrass.'
},

{
  id: 'arithmetic-series', parent: 'sequences-series', title: 'Arithmetic sequences and series', level: 1,
  short: 'Sequences that go up by the same step every time, and the trick — pair the first term with the last — for adding them up.',
  keywords: ['arithmetic sequence', 'arithmetic progression', 'AP', 'common difference', 'arithmetic series', 'sum of integers', 'Gauss', 'triangular numbers', 'sum of odd numbers'],
  prereq: ['sequences', 'linear-functions'],
  related: ['geometric-series', 'physics:constant-acceleration', 'riemann-sums'],
  body: `
An **arithmetic sequence** adds the same **common difference** $d$ at every step: $3, 7, 11, 15, \\dots$ has $d = 4$; $50, 47, 44, \\dots$ has $d = -3$. Theatre rows that each hold two more seats than the row in front, the rungs of a tapering ladder, and a salary that rises by a fixed amount each year are all arithmetic. So are the distances a falling stone covers in successive seconds — $4.9,\\ 14.7,\\ 24.5\\ \\mathrm{m}, \\dots$, with $d = 9.8\\ \\mathrm{m}$ (see [[physics:free-fall|free fall]]).

To reach the $n$-th term you take $n - 1$ steps from the first:

$$a_n = a_1 + (n-1)\\,d$$

That is a [[linear-functions|linear function]] of $n$: plotted against $n$, the terms sit on a straight line of slope $d$.

### Adding them up
There is a famous story of the schoolboy Carl Friedrich Gauss being told to add the numbers from 1 to 100 and answering almost at once. Write the sum forwards and backwards and add the two rows column by column:

$$\\begin{aligned} S &= 1 + 2 + 3 + \\cdots + 100 \\\\ S &= 100 + 99 + 98 + \\cdots + 1 \\\\ 2S &= 101 + 101 + 101 + \\cdots + 101 = 100 \\times 101 \\end{aligned}$$

so $S = 5050$. The same pairing works for any arithmetic sequence, because moving one step in from each end adds $d$ to one term and removes it from the other:

$$S_n = \\frac{n}{2}\\,(a_1 + a_n) = \\frac{n}{2}\\left(2a_1 + (n-1)\\,d\\right)$$

In words: **the number of terms times the average of the first and the last**.

### Two sums worth remembering
- $1 + 2 + \\cdots + n = \\dfrac{n(n+1)}{2}$, the *triangular numbers* (dots stacked in a triangle).
- $1 + 3 + 5 + \\cdots + (2n - 1) = n^2$: each odd number is an L-shaped layer that turns an $(n-1)$-square into an $n$-square.

### A picture from physics
An arithmetic sum is the area of a staircase of equal-width columns whose heights rise in a straight line — the discrete cousin of the area under a straight line. That is exactly why the displacement under a straight velocity–time graph is "average velocity times time", $\\tfrac12(v_0 + v)\\,t$, in the [[physics:constant-acceleration|equations of constant acceleration]].

> [!warn] An infinite arithmetic series never has a finite sum (unless every term is zero): the terms do not shrink, so the partial sums grow without limit. For infinite sums that *do* work, see [[geometric-series|geometric series]].
`,
  ideas: [
    'Each term is the previous one plus a fixed difference d, so $a_n = a_1 + (n-1)d$ — a linear function of n.',
    'The sum of n terms is n times the average of the first and last terms.',
    '$1 + 2 + \\cdots + n = n(n+1)/2$ and $1 + 3 + \\cdots + (2n-1) = n^2$.',
    'An infinite arithmetic series diverges unless every term is zero.'
  ],
  pitfalls: [
    'The n-th term is $a_1 + nd$ — It is $a_1 + (n-1)d$: the first term has had no steps added to it.',
    'The number of terms is (last − first)/d — Add one. From 5 to 50 in steps of 5 there are $45/5 + 1 = 10$ terms, not 9 (count fence posts, not gaps).'
  ],
  formulas: [
    {
      name: 'The n-th term',
      expr: 'an = a1 + (n - 1)*d',
      vars: {
        an: { name: 'n-th term', tex: 'a_n', signed: true },
        a1: { name: 'first term', tex: 'a_1', value: 20, signed: true },
        d: { name: 'common difference', value: 2, signed: true },
        n: { name: 'term number', int: true, value: 25 }
      },
      stories: {
        an: 'A theatre\'s front row has {a1} seats and each row has {d} more than the one in front. How many seats are in row {n}?',
        n: 'An arithmetic sequence starts at {a1} and goes up by {d}. Which term equals {an}?'
      }
    },
    {
      name: 'Sum of n terms',
      expr: 'S = n/2*(2*a1 + (n - 1)*d)', tex: 'S_n = \\frac{n}{2}\\left(2a_1 + (n-1)\\,d\\right)',
      vars: {
        S: { name: 'sum of the first n terms', tex: 'S_n', signed: true },
        n: { name: 'number of terms', int: true, value: 100 },
        a1: { name: 'first term', tex: 'a_1', value: 1, signed: true },
        d: { name: 'common difference', value: 1, signed: true }
      },
      note: 'Solving for $n$ means solving a quadratic; only a positive whole-number root counts.',
      stories: {
        S: 'A theatre has {n} rows. The front row seats {a1} people and every row has {d} more seats than the one in front. How many seats are there in all?',
        n: 'Starting at {a1} and going up by {d} each time, how many terms add up to {S}?'
      }
    },
    {
      name: 'Sum from the first and last terms',
      expr: 'S = n*(a1 + an)/2', tex: 'S_n = \\frac{n\\,(a_1 + a_n)}{2}',
      vars: {
        S: { name: 'sum', tex: 'S_n', signed: true },
        n: { name: 'number of terms', int: true, value: 25 },
        a1: { name: 'first term', tex: 'a_1', value: 20, signed: true },
        an: { name: 'last term', tex: 'a_n', value: 68, signed: true }
      }
    }
  ],
  examples: [
    {
      title: 'Seats in a theatre',
      q: 'A theatre has 25 rows. The front row has 20 seats and each row has 2 more than the one in front. How many seats are in the back row, and in the whole theatre?',
      steps: [
        'Back row: $a_{25} = 20 + (25 - 1)\\times 2 = 68$ seats.',
        'Total: $S_{25} = \\dfrac{25}{2}(20 + 68) = 25 \\times 44 = 1100$ seats.'
      ],
      a: '68 seats in the back row, 1100 in all.'
    },
    {
      title: 'How many terms are needed?',
      q: 'How many terms of $5 + 8 + 11 + \\cdots$ are needed for the sum to exceed 1000?',
      steps: [
        'Here $a_1 = 5$ and $d = 3$, so $S_n = \\dfrac{n}{2}\\left(10 + 3(n-1)\\right) = \\dfrac{n(3n + 7)}{2}$.',
        'Solve $3n^2 + 7n - 2000 = 0$: $n = \\dfrac{-7 + \\sqrt{49 + 24000}}{6} = \\dfrac{-7 + 155.1}{6} \\approx 24.7$.',
        'The sum first passes 1000 at the next whole number. Check: $S_{24} = 948$, $S_{25} = 1025$.'
      ],
      a: '25 terms.'
    }
  ],
  quiz: [
    { q: 'What is $1 + 2 + 3 + \\cdots + 200$?', choices: ['20 000', '20 100', '40 200', '20 200'], a: 1,
      why: '$\\tfrac{n(n+1)}{2} = \\tfrac{200 \\times 201}{2} = 20\\,100$: 200 terms with an average of 100.5.' },
    { q: 'Write the sum of the first $n$ odd numbers, $1 + 3 + 5 + \\cdots + (2n - 1)$, as an expression in $n$.', answer: 'n^2', vars: ['n'],
      why: 'Using $S_n = \\tfrac{n}{2}(a_1 + a_n) = \\tfrac{n}{2}(1 + 2n - 1) = n^2$. Geometrically, each odd number is an L-shaped layer that grows a square by one.' },
    { q: 'A stone falls 4.9 m in the first second, 14.7 m in the second and 24.5 m in the third. How far does it fall during the tenth second?', choices: ['49 m', '93.1 m', '98 m', '490 m'], a: 1,
      why: 'The distances form an arithmetic sequence with $d = 9.8$ m: $a_{10} = 4.9 + 9 \\times 9.8 = 93.1$ m. The total over ten seconds is $\\tfrac{10}{2}(4.9 + 93.1) = 490$ m, which is $\\tfrac12 g t^2$.' },
    { q: 'The infinite series $1 + 1.001 + 1.002 + 1.003 + \\cdots$ converges because its common difference is so small.', a: false,
      why: 'Its terms never shrink — they grow — so the partial sums grow without limit. Any non-zero arithmetic series diverges.' }
  ],
  applications: [
    'Counting seats, bricks in a stepped wall, or logs in a triangular stack.',
    'Straight-line depreciation and salaries with fixed yearly rises.',
    'The distances covered in equal time intervals under constant acceleration.'
  ],
  history: 'The Gauss anecdote is told in many versions and has probably grown in the telling; the pairing trick itself is far older and appears in ancient Indian and Greek mathematics.'
},

{
  id: 'geometric-series', parent: 'sequences-series', title: 'Geometric sequences and series', level: 1,
  short: 'Sequences that multiply by the same ratio every time — and their sums, which stay finite for ever when the ratio is smaller than one in size.',
  keywords: ['geometric sequence', 'geometric progression', 'GP', 'common ratio', 'geometric series', 'infinite sum', 'sum to infinity', 'Zeno', 'repeating decimal', '0.999...', 'bouncing ball', 'steady state'],
  prereq: ['sequences', 'exponents'],
  related: ['exponential-functions', 'convergence-tests', 'power-series', 'exponential-growth-decay'],
  body: `
A **geometric sequence** multiplies by the same **common ratio** $r$ at every step: $3, 6, 12, 24, \\dots$ ($r = 2$); $80, 40, 20, 10, \\dots$ ($r = \\tfrac12$); $1, -\\tfrac13, \\tfrac19, -\\tfrac1{27}, \\dots$ ($r = -\\tfrac13$). Its $n$-th term is

$$a_n = a\\,r^{\\,n-1}$$

— the whole-number version of an [[exponential-functions|exponential function]]. Bacteria doubling each generation, a ball bouncing back to 70% of its previous height, light losing 8% at each pane of glass and money earning interest are all geometric.

### The finite sum
Call the sum $S_n = a + ar + ar^2 + \\cdots + ar^{n-1}$. Multiply it by $r$ and every term moves one place along; subtract, and everything cancels except the two ends:

$$S_n - rS_n = a - ar^n \\quad\\Rightarrow\\quad S_n = a\\,\\frac{1 - r^n}{1 - r} \\qquad (r \\ne 1)$$

### The infinite sum
If $|r| < 1$ then $r^n \\to 0$, and the partial sums approach a finite limit:

$$S_\\infty = a + ar + ar^2 + \\cdots = \\frac{a}{1 - r}, \\qquad |r| < 1$$

So $\\tfrac12 + \\tfrac14 + \\tfrac18 + \\cdots = \\dfrac{1/2}{1 - 1/2} = 1$ exactly. This is Zeno's paradox of walking to a wall by always covering half of the remaining distance: infinitely many steps, a finite total — and at a steady walking speed, a finite time. If $|r| \\ge 1$ the terms do not shrink and there is no sum; with $r = -1$ the partial sums of $1 - 1 + 1 - \\cdots$ just flip between 1 and 0.

### Repeating decimals
Every repeating decimal is a geometric series in disguise, which is why it is always a fraction:

$$0.999\\ldots = \\frac{9}{10} + \\frac{9}{100} + \\cdots = \\frac{9/10}{1 - 1/10} = 1, \\qquad 0.2727\\ldots = \\frac{27/100}{1 - 1/100} = \\frac{27}{99} = \\frac{3}{11}$$

### Steady states
Take 200 mg of a medicine every 8 hours, and suppose half of it is cleared in 8 hours. Just after the $n$-th dose the body holds $200(1 + \\tfrac12 + \\tfrac14 + \\cdots + \\tfrac1{2^{n-1}})$ mg, which climbs towards $200/(1 - \\tfrac12) = 400$ mg. After five doses it is already at 387.5 mg, within 3% of the steady level. The same arithmetic sets the equilibrium of any process with a fixed input and a fixed fractional loss per step — pollutants in a lake, heat in a building, charge on a capacitor fed by pulses.

> [!key] $1 + x + x^2 + x^3 + \\cdots = \\dfrac{1}{1-x}$ for $|x| < 1$. Read as a function of $x$, this is the first [[power-series|power series]], and it is the yardstick the [[convergence-tests|convergence tests]] measure other series against.
`,
  ideas: [
    'Each term is the previous one times a fixed ratio r: $a_n = a\\,r^{n-1}$.',
    'Multiply the sum by r and subtract: $S_n = a(1 - r^n)/(1 - r)$.',
    'For $|r| < 1$ the infinite sum is finite, $a/(1-r)$; for $|r| \\ge 1$ there is no sum.',
    'Repeating decimals, bouncing balls and repeated doses are all geometric series.'
  ],
  pitfalls: [
    'Infinitely many terms must add up to infinity — Not if they shrink fast enough: $\\tfrac12 + \\tfrac14 + \\tfrac18 + \\cdots$ is exactly 1.',
    'Using $a/(1-r)$ when $|r| \\ge 1$ — With $r = 2$ it would claim $1 + 2 + 4 + \\cdots = -1$. The formula only holds for $|r| < 1$.',
    'Taking the ratio as the first term — In $\\tfrac13 + \\tfrac19 + \\tfrac1{27} + \\cdots$ both are $\\tfrac13$, and the sum is $\\dfrac{1/3}{1 - 1/3} = \\tfrac12$. For $\\tfrac19 + \\tfrac1{27} + \\cdots$ the first term is $\\tfrac19$ and the sum is $\\tfrac16$.'
  ],
  derivation: {
    title: 'The shift-and-subtract trick',
    steps: [
      { text: 'Write the sum and the same sum multiplied by $r$:', tex: '\\begin{aligned} S_n &= a + ar + ar^2 + \\cdots + ar^{n-1} \\\\ rS_n &= \\phantom{a + {}} ar + ar^2 + \\cdots + ar^{n-1} + ar^n \\end{aligned}' },
      { text: 'Subtract: all the middle terms cancel.', tex: 'S_n(1 - r) = a - ar^n \\;\\Rightarrow\\; S_n = a\\,\\frac{1 - r^n}{1 - r}' },
      { text: 'Let $n \\to \\infty$. When $|r| < 1$, $r^n \\to 0$:', tex: 'S_\\infty = \\frac{a}{1 - r}' }
    ]
  },
  formulas: [
    {
      name: 'The n-th term',
      expr: 'an = a*r^(n - 1)', tex: 'a_n = a\\,r^{\\,n-1}',
      vars: {
        an: { name: 'n-th term', tex: 'a_n', signed: true },
        a: { name: 'first term', value: 3, signed: true },
        r: { name: 'common ratio', value: 2, signed: true },
        n: { name: 'term number', int: true, value: 8 }
      },
      practice: { unknowns: ['an', 'n'] },
      stories: { an: 'A culture starts with {a} thousand bacteria and multiplies by {r} each hour. How many thousand are there in hour number {n} (the first hour counts as term 1)?' }
    },
    {
      name: 'Sum of the first n terms',
      expr: 'S = a*(1 - r^n)/(1 - r)', tex: 'S_n = a\\,\\frac{1 - r^n}{1 - r}',
      vars: {
        S: { name: 'sum of n terms', tex: 'S_n', signed: true },
        a: { name: 'first term', value: 1, signed: true },
        r: { name: 'common ratio', value: 0.5, signed: true },
        n: { name: 'number of terms', int: true, value: 10 }
      },
      practice: { unknowns: ['S', 'a'] },
      stories: { S: 'A geometric series starts at {a} and has ratio {r}. What is the sum of its first {n} terms?' }
    },
    {
      name: 'Sum to infinity',
      expr: 'S = a/(1 - r)', tex: 'S_\\infty = \\frac{a}{1 - r}',
      vars: {
        S: { name: 'sum of the infinite series', tex: 'S_\\infty', signed: true },
        a: { name: 'first term', value: 200, signed: true },
        r: { name: 'common ratio', value: 0.5, signed: true, min: -0.999, max: 0.999 }
      },
      note: 'Only for $|r| < 1$.',
      stories: {
        S: 'A patient takes {a} mg of a drug at regular intervals, and a fraction {r} of what is in the body is still there when the next dose is due. How much is in the body just after a dose, in the long run?',
        r: 'An infinite geometric series starts at {a} and adds up to {S}. What is its ratio?'
      }
    }
  ],
  examples: [
    {
      title: 'The bouncing ball',
      q: 'A ball dropped from 2 m rebounds to 60% of its previous height every time. How far does it travel before it comes to rest, and for how long does it bounce?',
      steps: [
        'Down 2 m, then up and down $1.2$ m, $0.72$ m, $0.432$ m, …: the rebounds form a geometric series with $a = 1.2$ and $r = 0.6$.',
        'Distance: $2 + 2\\times\\dfrac{1.2}{1 - 0.6} = 2 + 6 = 8\\ \\mathrm{m}$.',
        'Time: the first fall takes $t_0 = \\sqrt{2h/g} = \\sqrt{4/9.81} = 0.639\\ \\mathrm{s}$. A rebound of height $h_k$ lasts $2\\sqrt{2h_k/g}$, and since the heights shrink by 0.6 the times shrink by $\\sqrt{0.6} = 0.775$ — another geometric series.',
        { text: 'Adding up all the flight times:', tex: 't = t_0 + 2t_0\\,\\frac{0.775}{1 - 0.775} = t_0\\,(1 + 6.87) = 5.03\\ \\mathrm{s}' },
        'Infinitely many bounces, finite distance, finite time. (A real ball stops sooner: at small heights it no longer keeps a fixed fraction of its energy.)'
      ],
      a: '8 m in about 5.0 s.'
    },
    {
      title: 'A repeating decimal as a fraction',
      q: 'Write $0.41818\\ldots$ (the 18 repeating) as a fraction.',
      steps: [
        'Split off the part that does not repeat: $0.41818\\ldots = 0.4 + 0.01818\\ldots$',
        'The rest is geometric with $a = 0.018$ and $r = 0.01$: $\\dfrac{0.018}{1 - 0.01} = \\dfrac{0.018}{0.99} = \\dfrac{18}{990} = \\dfrac{1}{55}$.',
        'So $0.41818\\ldots = \\dfrac{2}{5} + \\dfrac{1}{55} = \\dfrac{22 + 1}{55} = \\dfrac{23}{55}$.'
      ],
      a: '23/55'
    }
  ],
  quiz: [
    { q: 'Find the exact sum $\\displaystyle\\sum_{n=0}^{\\infty}\\left(\\frac23\\right)^n$.', answer: '3', vars: [],
      why: 'First term $a = 1$ (the $n = 0$ term), ratio $\\tfrac23$: $\\dfrac{1}{1 - 2/3} = 3$.' },
    { q: 'Which of these series converges?', choices: ['$1 + 1.1 + 1.21 + \\cdots$', '$1 - 1 + 1 - 1 + \\cdots$', '$5 - \\tfrac52 + \\tfrac54 - \\cdots$', '$2 + 2 + 2 + \\cdots$'], a: 2,
      why: 'Only the third has $|r| < 1$ ($r = -\\tfrac12$); its sum is $5/(1 + \\tfrac12) = \\tfrac{10}{3}$. The others have $r = 1.1$, $-1$ and $1$.' },
    { q: 'The number $0.999\\ldots$, with nines for ever, is slightly less than 1.', a: false,
      why: 'It is the geometric series $\\tfrac{9}{10} + \\tfrac{9}{100} + \\cdots = \\dfrac{9/10}{1 - 1/10} = 1$ exactly. Two decimal expansions can name the same number.' },
    { q: 'Write $0.363636\\ldots$ as a fraction in lowest terms.', answer: '4/11', vars: [],
      why: '$\\dfrac{36/100}{1 - 1/100} = \\dfrac{36}{99} = \\dfrac{4}{11}$.' },
    { q: 'A ball is dropped from 1 m and always rebounds to half its previous height. What total distance does it travel?', choices: ['2 m', '3 m', '4 m', 'It is infinite'], a: 1,
      why: '1 m down, then each rebound $\\tfrac12 + \\tfrac14 + \\cdots = 1$ m is travelled up and down: $1 + 2\\times 1 = 3$ m.' }
  ],
  applications: [
    'Pharmacology: the steady level built up by regular doses.',
    'Finance: loan repayments, annuities and the present value of a stream of payments.',
    'Optics: light bouncing between two partly silvered mirrors (a Fabry–Pérot interferometer) adds up as a geometric series.',
    'Computing: an array that doubles its size when full copies each element fewer than two times on average, because $1 + \\tfrac12 + \\tfrac14 + \\cdots < 2$.'
  ],
  sim: { id: 'so-partial-sums', params: { series: 'geom' } }
},

{
  id: 'convergence-tests', parent: 'sequences-series', title: 'Convergence of series', level: 2,
  short: 'How to decide whether an infinite sum has a finite value without finding it: the n-th-term, comparison, ratio, integral and alternating-series tests.',
  keywords: ['convergence', 'divergence', 'partial sums', 'harmonic series', 'p-series', 'ratio test', 'comparison test', 'integral test', 'alternating series test', 'absolute convergence', 'conditional convergence', 'Basel problem', 'rearrangement'],
  prereq: ['geometric-series', 'limits-at-infinity', 'improper-integrals'],
  related: ['power-series', 'sequences', 'fourier-series'],
  body: `
An infinite series $\\sum a_n$ **converges** when its **partial sums** $S_N = a_1 + a_2 + \\cdots + a_N$ approach a limit as $N \\to \\infty$; that limit is the sum. Only a few series — geometric, telescoping, a handful of famous ones — can be summed exactly. For the rest you first want to know *whether* a sum exists, and then how many terms give it to the accuracy you need. A small toolkit answers both.

### Test zero: do the terms shrink?
If $a_n$ does not tend to 0, the series **diverges** — you keep adding lumps that do not get smaller. But terms tending to zero is **not** enough. The **harmonic series** is the classic warning:

$$1 + \\tfrac12 + \\underbrace{\\tfrac13 + \\tfrac14}_{\\ge 1/2} + \\underbrace{\\tfrac15 + \\cdots + \\tfrac18}_{\\ge 1/2} + \\underbrace{\\tfrac19 + \\cdots + \\tfrac1{16}}_{\\ge 1/2} + \\cdots$$

Each bracket adds at least $\\tfrac12$, and there are infinitely many brackets. The growth is glacial — $S_N \\approx \\ln N + 0.5772$, so a million terms reach only 14.39 and you need 12 367 terms to pass 10 — but it never stops.

### p-series and comparison
$\\sum 1/n^p$ converges exactly when $p > 1$. With $p = 2$, Euler's celebrated result is $1 + \\tfrac14 + \\tfrac19 + \\cdots = \\pi^2/6$. These, with geometric series, are the yardsticks for **comparison**: if $0 \\le a_n \\le b_n$ and $\\sum b_n$ converges, so does $\\sum a_n$; if $a_n \\ge b_n \\ge 0$ and $\\sum b_n$ diverges, so does $\\sum a_n$. In practice, keep the dominant powers: $\\dfrac{n + 1}{n^3 - 2}$ behaves like $1/n^2$ for large $n$, so its series converges (the *limit comparison test* makes this rigorous).

### Ratio test
Compare each term with the one before: $L = \\lim |a_{n+1}/a_n|$. If $L < 1$ the terms eventually shrink at least as fast as a geometric series and the series converges; if $L > 1$ it diverges; if $L = 1$ the test is silent. It is the tool for factorials and powers: for $\\sum 2^n/n!$ the ratio is $2/(n+1) \\to 0$, so it converges (to $e^2 - 1$, summing from $n = 1$).

### Integral test and error estimates
If $a_n = f(n)$ for a positive, decreasing $f$, then $\\sum a_n$ and $\\int_1^\\infty f(x)\\,dx$ converge or diverge together — the sum is the area of a staircase that hugs the curve (compare an [[improper-integrals|improper integral]]). It also brackets what you leave out: the tail after $N$ terms lies between $\\int_{N+1}^\\infty f\\,dx$ and $\\int_N^\\infty f\\,dx$.

### Alternating series
If the signs alternate, the sizes decrease, and the terms tend to zero, the series converges — and the error after stopping is smaller than the first term you left out. So $1 - \\tfrac12 + \\tfrac13 - \\tfrac14 + \\cdots$ converges (to $\\ln 2$) although its sizes form the divergent harmonic series.

### Absolute and conditional convergence
A series is **absolutely convergent** if $\\sum |a_n|$ converges; then its terms can be reordered freely without changing the sum. The alternating harmonic series is only **conditionally convergent**, and Riemann showed such a series can be rearranged to add up to *any* number you like. Taking two positive terms for each negative one, $1 + \\tfrac13 - \\tfrac12 + \\tfrac15 + \\tfrac17 - \\tfrac14 + \\cdots$, gives $\\tfrac32\\ln 2$ instead of $\\ln 2$.

| The series looks like | Try |
|---|---|
| terms that do not tend to 0 | stop: it diverges |
| a ratio of powers of $n$ | compare with a p-series |
| factorials or $c^n$ | the ratio test |
| $f(n)$ with $f$ easy to integrate | the integral test |
| alternating signs | the alternating series test |

These tests decide where [[power-series|power series]] converge and underpin every error estimate in numerical work.
`,
  ideas: [
    'A series converges when its sequence of partial sums approaches a limit.',
    'Terms that do not shrink to zero guarantee divergence; terms that do shrink guarantee nothing.',
    'Compare with geometric series (the ratio test) or with p-series (comparison and integral tests): $\\sum 1/n^p$ converges only for $p > 1$.',
    'An alternating series with shrinking terms converges, with an error smaller than the first term left out.',
    'Only absolutely convergent series can be rearranged without changing the sum.'
  ],
  pitfalls: [
    'Terms going to zero means the series converges — The harmonic series is the counterexample: its terms shrink to zero, yet the sum is infinite.',
    'The ratio test settles everything — When the limiting ratio is exactly 1, as for every p-series, it tells you nothing. Use comparison or the integral test.',
    'A convergent series can be reordered at will — Only an absolutely convergent one. A conditionally convergent series changes its sum when rearranged.'
  ],
  derivation: {
    title: 'Why the harmonic series diverges',
    steps: [
      { text: 'Group the terms in blocks that end at powers of two:', tex: '1 + \\tfrac12 + \\left(\\tfrac13 + \\tfrac14\\right) + \\left(\\tfrac15 + \\tfrac16 + \\tfrac17 + \\tfrac18\\right) + \\cdots' },
      { text: 'Each term in a block is at least the last one, so each block of $2^k$ terms is at least $2^k \\cdot \\tfrac{1}{2^{k+1}} = \\tfrac12$:', tex: '\\tfrac13 + \\tfrac14 \\ge \\tfrac14 + \\tfrac14 = \\tfrac12, \\qquad \\tfrac15 + \\cdots + \\tfrac18 \\ge 4\\cdot\\tfrac18 = \\tfrac12' },
      { text: 'After $2^k$ terms the partial sum is at least $1 + k/2$, which grows without bound:', tex: 'S_{2^k} \\ge 1 + \\frac{k}{2} \\to \\infty' }
    ]
  },
  formulas: [
    {
      name: 'Harmonic partial sums',
      expr: 'H = ln(n) + 0.5772157 + 1/(2*n)', tex: 'H_n \\approx \\ln n + \\gamma + \\frac{1}{2n}',
      vars: {
        H: { name: 'sum of the first n terms of the harmonic series', tex: 'H_n' },
        n: { name: 'number of terms', value: 1000 }
      },
      note: '$\\gamma = 0.5772\\ldots$ is the Euler–Mascheroni constant. Already very accurate for $n = 10$ ($2.92897$ against the exact $2.92897$). Solving for $n$ gives the number of terms needed to reach a total: round up.',
      stories: { n: 'Roughly how many terms of $1 + \\tfrac12 + \\tfrac13 + \\cdots$ are needed before the total reaches {H}?' }
    },
    {
      name: 'Tail of a p-series (integral test)',
      expr: 'R = N^(1 - p)/(p - 1)', tex: 'R_N < \\frac{N^{1-p}}{p - 1}',
      vars: {
        R: { name: 'bound on everything after term N', tex: 'R_N' },
        N: { name: 'terms already added', value: 100 },
        p: { name: 'power p (> 1)', value: 2, min: 1.001, max: 10 }
      },
      note: 'The sum of $1/n^p$ for all $n > N$ is less than $\\int_N^\\infty x^{-p}\\,dx$. For $p = 2$ the tail after $N$ terms is below $1/N$: a thousand terms of $\\sum 1/n^2$ give $\\pi^2/6$ to about three decimals.',
      stories: { N: 'For the series of $1/n^p$ with the power p = {p}, how many terms make sure that what is left over is less than {R}?' }
    }
  ],
  examples: [
    {
      title: 'The ratio test meets e',
      q: 'Does $\\displaystyle\\sum_{n=1}^{\\infty} \\frac{n!}{n^n}$ converge?',
      steps: [
        { text: 'Take the ratio of consecutive terms and simplify:', tex: '\\frac{a_{n+1}}{a_n} = \\frac{(n+1)!}{(n+1)^{n+1}}\\cdot\\frac{n^n}{n!} = \\frac{n^n}{(n+1)^n} = \\frac{1}{(1 + 1/n)^n}' },
        'As $n \\to \\infty$, $(1 + 1/n)^n \\to e$, so the ratio tends to $1/e \\approx 0.37 < 1$.',
        'By the ratio test the series converges; its terms eventually shrink faster than a geometric series with ratio 0.4.'
      ],
      a: 'It converges.'
    },
    {
      title: 'How many terms for three decimals?',
      q: 'How many terms of $\\sum 1/n^2$ are needed to be sure of its sum within 0.001? And of the alternating version $1 - \\tfrac14 + \\tfrac19 - \\cdots$?',
      steps: [
        'Positive series: by the integral test the tail after $N$ terms is less than $\\int_N^\\infty x^{-2}\\,dx = 1/N$. For $1/N \\le 0.001$ take $N = 1000$.',
        'Alternating series: the error is less than the first omitted term, $1/(N+1)^2$. For that to be below 0.001 you need $N + 1 > 31.6$, so $N = 31$.',
        'Alternation cancels most of the error: thirty-odd terms do the work of a thousand.'
      ],
      a: 'About 1000 terms for the positive series; 31 for the alternating one.'
    }
  ],
  quiz: [
    { q: 'The terms of a series tend to zero. Then the series…', choices: ['converges', 'diverges', 'may converge or diverge', 'converges to zero'], a: 2,
      why: 'Shrinking terms are necessary but not sufficient: $\\sum 1/n^2$ converges, $\\sum 1/n$ does not.' },
    { q: 'Which of these converges?', choices: ['$\\sum 1/\\sqrt n$', '$\\sum 1/n^{1.1}$', '$\\sum 1/n$', '$\\sum n/(n+1)$'], a: 1,
      why: 'A p-series converges when $p > 1$, and $1.1 > 1$ — although slowly. $p = \\tfrac12$ and $p = 1$ diverge, and $n/(n+1) \\to 1$ fails even test zero.' },
    { q: 'The ratio test applied to $\\sum 1/n^2$ gives $L = 1$. What does that tell you?', choices: ['The series converges', 'The series diverges', 'Nothing: the test is inconclusive', 'The sum is 1'], a: 2,
      why: 'Every p-series has ratio limit 1, convergent or not. Here the integral test (or knowing p-series) shows it converges.' },
    { q: 'Rearranging the order of the terms of $1 - \\tfrac12 + \\tfrac13 - \\tfrac14 + \\cdots$ can change its sum.', a: true,
      why: 'It converges only conditionally, and Riemann\'s rearrangement theorem says such a series can be reordered to give any sum at all.' },
    { q: 'You add $1 - \\tfrac13 + \\tfrac15 - \\tfrac17 + \\cdots$ (which equals $\\pi/4$) up to and including $\\tfrac1{99}$. The error is at most about…', choices: ['0.1', '0.01', '0.0001', '0'], a: 1,
      why: 'For an alternating series with shrinking terms the error is less than the first omitted term, $\\tfrac1{101} \\approx 0.0099$.' }
  ],
  applications: [
    'Deciding where power series, and so calculator algorithms, can be trusted.',
    'Error bounds for truncated sums in numerical work.',
    'Physics sums such as the Madelung constant of a crystal, which converge only conditionally and must be added in a careful order.'
  ],
  history: 'Nicole Oresme proved around 1350 that the harmonic series diverges, with the grouping argument still used today. In 1734 Leonhard Euler showed that $\\sum 1/n^2 = \\pi^2/6$, solving the "Basel problem" that had defeated the Bernoullis.',
  sim: { id: 'so-partial-sums', params: { series: 'harm' } }
},

{
  id: 'power-series', parent: 'sequences-series', title: 'Power series', level: 2,
  short: 'An infinite polynomial $\\sum c_n (x-a)^n$: it converges on an interval around its centre, and inside that interval it can be differentiated and integrated term by term.',
  keywords: ['power series', 'radius of convergence', 'interval of convergence', 'term-by-term differentiation', 'term-by-term integration', 'analytic function', 'centre', 'Leibniz series', 'arctan series'],
  prereq: ['geometric-series', 'convergence-tests', 'polynomials'],
  related: ['taylor-series', 'complex-plane', 'eulers-formula'],
  body: `
A **power series** is a polynomial that never stops:

$$\\sum_{n=0}^{\\infty} c_n (x-a)^n = c_0 + c_1(x-a) + c_2(x-a)^2 + c_3(x-a)^3 + \\cdots$$

The number $a$ is its **centre** and the $c_n$ are its coefficients. For each value of $x$ it is an ordinary series of numbers, which may or may not converge; where it does, it defines a function. The prototype is the [[geometric-series|geometric series]] read as a function of $x$:

$$\\frac{1}{1 - x} = 1 + x + x^2 + x^3 + \\cdots, \\qquad |x| < 1$$

At $x = 0.5$ the right side adds up to 2, just as it should; at $x = 2$ the left side is $-1$ but the right side runs off to infinity. A power series can represent a function perfectly in one place and not at all in another.

### The radius of convergence
Every power series has a **radius of convergence** $R$ (possibly $0$ or $\\infty$): it converges — absolutely — for $|x - a| < R$ and diverges for $|x - a| > R$. At the two endpoints anything can happen and each must be checked separately. When the limit exists, the [[convergence-tests|ratio test]] gives

$$R = \\lim_{n\\to\\infty}\\left|\\frac{c_n}{c_{n+1}}\\right|$$

- $\\sum x^n/n!$: $R = \\infty$. It converges everywhere (it is $e^x$).
- $\\sum n!\\,x^n$: $R = 0$. Useless except at the centre.
- $\\sum x^n/n$: $R = 1$. At $x = -1$ it is the alternating harmonic series and converges; at $x = 1$ it is the harmonic series and diverges. The interval is $-1 \\le x < 1$.

Why an interval centred on $a$? Because the true home of power series is the [[complex-plane|complex plane]], where the region of convergence is a disc and $R$ is the distance from the centre to the nearest point where the function misbehaves. That explains a puzzle: $1/(1+x^2)$ is perfectly smooth for every real $x$, yet its series $1 - x^2 + x^4 - \\cdots$ only converges for $|x| < 1$. The function blows up at the complex points $x = \\pm i$, one unit from the centre.

### Calculus term by term
Inside its radius a power series can be differentiated or integrated one term at a time, like a polynomial, and the new series has the same radius. This manufactures new series from old:

- Differentiating $1/(1-x)$: $\\dfrac{1}{(1-x)^2} = 1 + 2x + 3x^2 + 4x^3 + \\cdots$
- Integrating $\\dfrac{1}{1+t} = 1 - t + t^2 - \\cdots$ from 0 to $x$: $\\ln(1+x) = x - \\dfrac{x^2}{2} + \\dfrac{x^3}{3} - \\cdots$
- Integrating $\\dfrac{1}{1+t^2}$: $\\arctan x = x - \\dfrac{x^3}{3} + \\dfrac{x^5}{5} - \\cdots$

Setting $x = 1$ in the last gives $\\dfrac{\\pi}{4} = 1 - \\dfrac13 + \\dfrac15 - \\dfrac17 + \\cdots$, beautiful and nearly useless: at the edge of the interval it converges so slowly that 500 terms give barely three decimals. Evaluating the same series well inside the interval, as in Machin's formula $\\tfrac{\\pi}{4} = 4\\arctan\\tfrac15 - \\arctan\\tfrac1{239}$, gains more than a decimal per term.

> [!tip] Convergence is fastest near the centre and slowest near the edge of the radius. Good numerical methods first move the argument close to the centre, then sum a few terms.

### Why they matter
Power series are how functions such as $e^x$, $\\sin x$ and $\\cos x$ are defined for complex arguments (leading to [[eulers-formula|Euler's formula]]), how many differential equations are solved (Bessel and Legendre functions of physics arise this way), and how functions are computed. Which power series belongs to a given function is answered by [[taylor-series|Taylor series]].
`,
  ideas: [
    'A power series is an infinite polynomial in $(x - a)$, centred at $a$.',
    'It converges inside a radius R about its centre and diverges outside; the endpoints need their own check.',
    'R usually comes from the ratio test: $R = \\lim |c_n/c_{n+1}|$.',
    'Inside the radius it can be differentiated and integrated term by term, which turns known series into new ones.',
    'R is the distance from the centre to the nearest singularity of the function — complex ones included.'
  ],
  pitfalls: [
    'Wherever the function is defined, its series converges — $1/(1+x^2)$ exists for every real $x$, but its series converges only for $|x| < 1$, because of the complex singularities at $\\pm i$.',
    'The endpoints behave like the interior — On $|x - a| = R$ anything can happen: $\\sum x^n/n$ converges at $x = -1$ and diverges at $x = 1$.',
    'Term-by-term calculus works everywhere — Only strictly inside the radius. The new series has the same radius, but its endpoint behaviour can change.'
  ],
  formulas: [
    {
      name: 'Truncation error of 1/(1 − x)',
      expr: 'err = x^N/(1 - x)', tex: 'E_N = \\frac{x^N}{1 - x}',
      vars: {
        err: { name: 'error after N terms', tex: 'E_N' },
        x: { name: 'point of evaluation (0 ≤ x < 1)', value: 0.5, min: 0, max: 0.999 },
        N: { name: 'number of terms kept', int: true, value: 10 }
      },
      note: 'Exactly $\\dfrac{1}{1-x} - (1 + x + \\cdots + x^{N-1})$. At $x = 0.5$ ten terms leave an error of 0.002; at $x = 0.95$ you need about 150 terms for the same accuracy.',
      stories: { N: 'How many terms of $1 + x + x^2 + \\cdots$ are needed at x = {x} to bring the error below {err}?' }
    },
    {
      name: 'How slowly the arctan series gives π',
      expr: 'err = 1/(2*N + 1)', tex: 'E_N < \\frac{1}{2N + 1}',
      vars: {
        err: { name: 'error in π/4 after N terms', tex: 'E_N' },
        N: { name: 'number of terms', int: true, value: 500 }
      },
      note: 'The error of $1 - \\tfrac13 + \\tfrac15 - \\cdots$ after $N$ terms is less than the next term, $1/(2N+1)$ — and not much less. Multiply by 4 for the error in $\\pi$.',
      stories: { N: 'How many terms of $1 - \\tfrac13 + \\tfrac15 - \\cdots$ guarantee $\\pi/4$ to within {err}?' }
    }
  ],
  examples: [
    {
      title: 'Radius and interval of convergence',
      q: 'Find where $\\displaystyle\\sum_{n=1}^{\\infty} \\frac{(x-2)^n}{n\\,3^n}$ converges.',
      steps: [
        { text: 'Ratio test on the terms:', tex: '\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{|x-2|}{3}\\cdot\\frac{n}{n+1} \\to \\frac{|x-2|}{3}' },
        'It converges when $|x - 2|/3 < 1$: centre 2, radius $R = 3$, so certainly for $-1 < x < 5$.',
        'Endpoint $x = 5$: the series becomes $\\sum 1/n$, which diverges.',
        'Endpoint $x = -1$: it becomes $\\sum (-1)^n/n$, which converges by the alternating series test.'
      ],
      a: 'R = 3; it converges for −1 ≤ x < 5.'
    },
    {
      title: 'A fast series for ln 2',
      q: 'The series $\\ln 2 = 1 - \\tfrac12 + \\tfrac13 - \\cdots$ is hopelessly slow. Find a better one.',
      steps: [
        'Replace $x$ by $-x$ in $\\ln(1+x)$: $-\\ln(1 - x) = x + \\dfrac{x^2}{2} + \\dfrac{x^3}{3} + \\cdots$ for $|x| < 1$.',
        'Now put $x = \\tfrac12$, well inside the radius: $-\\ln\\tfrac12 = \\ln 2 = \\dfrac12 + \\dfrac18 + \\dfrac1{24} + \\dfrac1{64} + \\dfrac1{160} + \\cdots$',
        'Ten terms give 0.69306, against $\\ln 2 = 0.693147$ — an error below $10^{-4}$. The alternating series would need about ten thousand terms for that.'
      ],
      a: 'ln 2 = Σ 1/(n·2ⁿ), which converges like a geometric series with ratio ½.'
    }
  ],
  quiz: [
    { q: 'The series $1 - x^2 + x^4 - x^6 + \\cdots$ equals $1/(1 + x^2)$. What is its radius of convergence?', choices: ['1', '∞, since $1/(1+x^2)$ is defined for every real $x$', '2', '0'], a: 0,
      why: 'It is geometric with ratio $-x^2$, so it needs $x^2 < 1$. In the complex plane the function blows up at $\\pm i$, at distance 1 from the centre.' },
    { q: 'A power series centred at 0 is known to converge at $x = 3$. At $x = -2$ it…', choices: ['converges', 'diverges', 'might do either', 'converges only if it also converges at $x = -3$'], a: 0,
      why: 'Converging at $x = 3$ means $R \\ge 3$, and $|-2| < 3$ lies strictly inside the radius, where convergence is guaranteed (and absolute).' },
    { q: 'Differentiate $\\dfrac{1}{1-x} = \\sum x^n$ term by term and use the result to find $\\displaystyle\\sum_{n=1}^{\\infty} n\\left(\\tfrac12\\right)^{n-1}$.', answer: '4', vars: [],
      why: '$\\sum n x^{n-1} = \\dfrac{1}{(1-x)^2}$ for $|x| < 1$; at $x = \\tfrac12$ that is $\\dfrac{1}{(1/2)^2} = 4$.' },
    { q: 'Every power series converges at its own centre.', a: true,
      why: 'At $x = a$ every term after $c_0$ is zero, so the sum is just $c_0$. Some series (like $\\sum n!\\,x^n$) converge nowhere else.' },
    { q: 'What is the radius of convergence of $\\sum n!\\,x^n$?', choices: ['0', '1', '$e$', '∞'], a: 0,
      why: 'The ratio of terms is $(n+1)|x|$, which exceeds 1 eventually for any $x \\ne 0$. The factorial beats every power.' }
  ],
  applications: [
    'Computing $\\ln$, $\\arctan$, $\\exp$ and other functions to full precision in software.',
    'Solving differential equations such as Bessel\'s and Legendre\'s by series, as in vibrating drums and atomic orbitals.',
    'Generating functions in probability and counting, whose coefficients encode a whole sequence.'
  ],
  history: 'Series for the sine, cosine and arctangent were found around 1400 by Madhava of Sangamagrama in Kerala, and rediscovered in Europe in the 17th century by Gregory, Newton and Leibniz. Abel and Cauchy made the notion of a radius of convergence precise in the 1820s.',
  sim: { id: 'so-taylor', params: { fn: 'geo' } }
},

{
  id: 'taylor-series', parent: 'sequences-series', title: 'Taylor series', level: 2,
  short: 'A smooth function can be rebuilt near a point from its derivatives there: a polynomial that matches its value, slope, curvature and more — the source of almost every approximation in physics.',
  keywords: ['Taylor series', 'Maclaurin series', 'Taylor polynomial', 'remainder', 'Lagrange remainder', 'error bound', 'small-angle approximation', 'binomial series', 'series expansion', 'approximation', 'analytic'],
  prereq: ['power-series', 'higher-derivatives', 'derivatives-of-functions'],
  related: ['linear-approximation', 'eulers-formula', 'lhopitals-rule', 'error-propagation', 'physics:simple-pendulum', 'physics:simple-harmonic-motion'],
  body: `
The [[linear-approximation|tangent line]] matches a function's value and slope at one point, and is good very close to it. A parabola that also matches the *curvature* stays close for longer; a cubic that matches the rate of change of curvature, longer still. Keep going and you get the **Taylor polynomial** of degree $n$ about $x = a$:

$$P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(a)}{k!}\\,(x-a)^k = f(a) + f'(a)(x-a) + \\frac{f''(a)}{2!}(x-a)^2 + \\cdots$$

The factorials are not decoration: differentiating $(x-a)^k$ $k$ times leaves $k!$, so dividing by $k!$ makes the $k$-th derivative of $P_n$ at $a$ equal to $f^{(k)}(a)$. Letting $n \\to \\infty$ gives the **Taylor series**; about $a = 0$ it is often called a **Maclaurin series**.

### The series everyone uses

$$e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots \\qquad \\text{(all } x)$$

$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots, \\qquad \\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots \\qquad \\text{(all } x)$$

$$\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots \\quad (-1 < x \\le 1), \\qquad (1+x)^k = 1 + kx + \\frac{k(k-1)}{2!}x^2 + \\cdots \\quad (|x| < 1)$$

Sine, an odd function, has only odd powers; cosine only even ones. The last line, the **binomial series**, works for any exponent $k$, including fractions and negatives.

### How good is the approximation?
The error $R_n = f - P_n$ has an exact form due to Lagrange: for some point $\\xi$ between $a$ and $x$,

$$R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}\\,(x-a)^{n+1}, \\qquad\\text{so}\\qquad |R_n| \\le \\frac{M\\,|x-a|^{n+1}}{(n+1)!}$$

where $M$ bounds $|f^{(n+1)}|$ on the way. For $\\sin 0.5$ with $x - x^3/6$ (which is also the degree-4 polynomial), $M = 1$ and the bound is $0.5^5/5! = 0.00026$; the actual error is $0.000259$. Two lessons: close to the centre ($|x - a|$ small) and with many terms (the factorial wins), the error collapses.

### The approximations of physics
| Approximation | Where it is used |
|---|---|
| $\\sin\\theta \\approx \\theta$, $\\cos\\theta \\approx 1 - \\theta^2/2$ | pendulums, paraxial optics, small vibrations |
| $(1 + x)^k \\approx 1 + kx$ | relativity: $\\gamma \\approx 1 + \\tfrac12 v^2/c^2$ turns $(\\gamma - 1)mc^2$ into $\\tfrac12 mv^2$ |
| $e^x \\approx 1 + x$, $\\ln(1+x) \\approx x$ | small growth rates, small percentage changes |
| $U(x) \\approx U(x_0) + \\tfrac12 U''(x_0)(x - x_0)^2$ | any stable equilibrium behaves like a spring |

The last line explains why [[physics:simple-harmonic-motion|simple harmonic motion]] is everywhere. Expand any smooth potential energy about a minimum: the slope term vanishes at the minimum, so the first term that matters is quadratic — a spring with stiffness $k = U''(x_0)$. Atoms in a crystal, a ball in a bowl and a pendulum all oscillate harmonically when the swings are small, and the [[harmonic-oscillator-ode|harmonic oscillator equation]] is their common description.

### Limits of the idea
A Taylor series only converges within its [[power-series|radius of convergence]]; the series for $\\ln(1+x)$ is useless at $x = 2$ however many terms you take. And a series can converge to the wrong function: $e^{-1/x^2}$ (with value 0 at 0) has every derivative zero at the origin, so its Taylor series is identically 0. Functions that do equal their Taylor series near every point are called **analytic**; almost all the functions of physics are. Substituting $ix$ into the series for $e^x$ and separating real and imaginary parts gives [[eulers-formula|Euler's formula]] $e^{ix} = \\cos x + i\\sin x$.
`,
  ideas: [
    'The Taylor polynomial matches the value and the first n derivatives of f at the centre.',
    'The coefficient of $(x-a)^k$ is $f^{(k)}(a)/k!$.',
    'The Lagrange remainder bounds the error: $|R_n| \\le M|x-a|^{n+1}/(n+1)!$.',
    'The approximations of physics — $\\sin\\theta \\approx \\theta$, $(1+x)^k \\approx 1 + kx$, harmonic motion near equilibrium — are truncated Taylor series.',
    'The series only represents the function inside its radius of convergence.'
  ],
  pitfalls: [
    'More terms always give a better approximation — Only inside the radius of convergence. Outside it (try $\\ln(1+x)$ at $x = 1.5$ in the simulation) the partial sums swing ever more wildly.',
    'The coefficient is $f^{(k)}(a)$ — It is $f^{(k)}(a)/k!$. Forgetting the factorial gives $e^x \\approx 1 + x + x^2$, which is already wrong at second order.',
    'Using degrees in $\\sin\\theta \\approx \\theta$ — The series assumes radians. $\\sin 10° = 0.1736$, close to $10° = 0.1745$ rad, not to 10.'
  ],
  derivation: {
    title: 'Why the coefficients are $f^{(k)}(a)/k!$',
    steps: [
      { text: 'Suppose $f$ is a power series about $a$ and try to find its coefficients:', tex: 'f(x) = c_0 + c_1(x-a) + c_2(x-a)^2 + c_3(x-a)^3 + \\cdots' },
      { text: 'Put $x = a$: every term but the first vanishes.', tex: 'f(a) = c_0' },
      { text: 'Differentiate term by term, then put $x = a$:', tex: 'f\'(x) = c_1 + 2c_2(x-a) + 3c_3(x-a)^2 + \\cdots \\;\\Rightarrow\\; f\'(a) = c_1' },
      { text: 'Differentiate $k$ times: $(x-a)^k$ leaves $k!$ and lower powers disappear, higher ones vanish at $a$.', tex: 'f^{(k)}(a) = k!\\,c_k \\;\\Rightarrow\\; c_k = \\frac{f^{(k)}(a)}{k!}' }
    ]
  },
  formulas: [
    {
      name: 'Lagrange error bound',
      expr: 'R = M*h^(n + 1)/fact(n + 1)', tex: '|R_n| \\le \\frac{M\\,h^{n+1}}{(n+1)!}',
      vars: {
        R: { name: 'largest possible error', tex: 'R_n' },
        M: { name: 'bound on the (n+1)-th derivative', value: 1 },
        h: { name: 'distance from the centre, |x − a|', value: 0.5 },
        n: { name: 'degree of the Taylor polynomial', int: true, value: 4 }
      },
      note: 'For $\\sin$ and $\\cos$, $M = 1$. For $e^x$ on $[0, 1]$, $M = e < 3$.',
      stories: {
        R: 'You approximate $\\sin x$ at a point {h} from the centre by its Taylor polynomial of degree {n} (so M = {M}). What is the largest the error can be?',
        n: 'What degree of Taylor polynomial guarantees an error below {R} at distance {h} from the centre, if the derivatives are bounded by {M}?'
      }
    },
    {
      name: 'Error of the small-angle approximation',
      expr: 'err = 1 - sin(theta)/theta', tex: '\\varepsilon = 1 - \\frac{\\sin\\theta}{\\theta} \\approx \\frac{\\theta^2}{6}',
      vars: {
        err: { name: 'relative error of sin θ ≈ θ', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        theta: { name: 'angle', q: 'angle', unit: '°', value: 10, min: 0.1, max: 90 }
      },
      note: 'The next Taylor term gives $\\sin\\theta \\approx \\theta(1 - \\theta^2/6)$, so the relative error is about $\\theta^2/6$ with $\\theta$ in radians. Below 14° it is under 1%.',
      stories: { theta: 'Up to what angle is $\\sin\\theta \\approx \\theta$ accurate to within {err}?' }
    }
  ],
  examples: [
    {
      title: 'The cosine series from its derivatives',
      q: 'Find the Maclaurin series of $\\cos x$ and use four terms to estimate $\\cos 0.2$.',
      steps: [
        'The derivatives cycle: $\\cos x,\\ -\\sin x,\\ -\\cos x,\\ \\sin x,\\ \\cos x, \\dots$ At 0 they are $1, 0, -1, 0, 1, \\dots$',
        { text: 'Divide each by $k!$:', tex: '\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\cdots' },
        'At $x = 0.2$: $1 - 0.02 + 0.0000667 - \\ldots = 0.9800667$.',
        'The true value is $0.98006658$; the error, about $9\\times10^{-8}$, is just under the next term, $0.2^6/720$.'
      ],
      a: 'cos 0.2 ≈ 0.9800667'
    },
    {
      title: 'Newton hiding inside Einstein',
      q: 'The relativistic kinetic energy is $E_k = (\\gamma - 1)mc^2$ with $\\gamma = (1 - v^2/c^2)^{-1/2}$. Show it reduces to $\\tfrac12 mv^2$ at low speeds, and find the size of the first correction.',
      steps: [
        { text: 'Binomial series with $x = -v^2/c^2$ and $k = -\\tfrac12$:', tex: '\\gamma = 1 + \\frac12\\frac{v^2}{c^2} + \\frac38\\frac{v^4}{c^4} + \\cdots' },
        { text: 'Subtract 1 and multiply by $mc^2$:', tex: 'E_k = \\frac12 mv^2 + \\frac38\\,\\frac{mv^4}{c^2} + \\cdots' },
        'The correction relative to $\\tfrac12 mv^2$ is $\\tfrac34 v^2/c^2$. For an airliner at 250 m/s that is $5\\times10^{-13}$ — invisible — while at a tenth of light speed it is 0.75%.'
      ],
      a: 'E_k ≈ ½mv²(1 + ¾ v²/c²); Newton is the first term.'
    },
    {
      title: 'How many terms for e?',
      q: 'How many terms of $e = \\sum 1/k!$ make the error smaller than $5\\times10^{-5}$ (four correct decimals)?',
      steps: [
        'With $f = e^x$ on $[0, 1]$, every derivative is at most $e < 3$, so $|R_n| \\le \\dfrac{3}{(n+1)!}$.',
        '$n = 7$: $3/8! = 7.4\\times10^{-5}$ — not quite guaranteed. $n = 8$: $3/9! = 8.3\\times10^{-6}$ — guaranteed.',
        'In fact $P_7(1) = 2.718254$ already has error $2.8\\times10^{-5}$ (the bound is cautious), and $P_8(1) = 2.7182788$, error $3\\times10^{-6}$.'
      ],
      a: 'Degree 8 (nine terms) is guaranteed; degree 7 happens to suffice.'
    }
  ],
  quiz: [
    { q: 'Write the Taylor polynomial of degree 2 of $e^{2x}$ about $x = 0$.', answer: '1 + 2x + 2x^2', vars: ['x'],
      why: 'Substitute $2x$ into $1 + u + u^2/2$: $1 + 2x + (2x)^2/2 = 1 + 2x + 2x^2$.' },
    { q: 'In the Maclaurin series of $\\sin x$, the coefficient of $x^3$ is…', choices: ['$\\tfrac13$', '$-\\tfrac16$', '$\\tfrac16$', '$-\\tfrac13$'], a: 1,
      why: 'The third derivative of $\\sin$ is $-\\cos$, which is $-1$ at 0; divided by $3! = 6$ it gives $-\\tfrac16$.' },
    { q: 'Near a stable equilibrium, any smooth potential energy curve looks like…', choices: ['a straight line', 'a parabola — a spring', 'an exponential', 'a cubic'], a: 1,
      why: 'At a minimum the slope is zero, so the Taylor series starts with a constant and then a quadratic term: small oscillations are simple harmonic.' },
    { q: 'Adding more terms of the Taylor series of $\\ln(1+x)$ about 0 always improves the approximation at $x = 2$.', a: false,
      why: 'The radius of convergence is 1. At $x = 2$ the terms $2^n/n$ grow, and each extra term makes the partial sum worse.' },
    { q: 'Using $\\sin x \\approx x - x^3/6$, find $\\displaystyle\\lim_{x\\to 0}\\frac{\\sin x - x}{x^3}$.', answer: '-1/6', vars: [],
      why: '$\\sin x - x \\approx -x^3/6 + x^5/120 - \\cdots$, so the ratio tends to $-\\tfrac16$. Series often settle limits faster than L\'Hôpital\'s rule.' }
  ],
  applications: [
    'Calculators and software libraries compute $\\sin$, $\\exp$ and $\\ln$ with short polynomial approximations after shifting the argument near the centre.',
    'Linearising equations: small-angle pendulums, small-signal models of transistors, and control systems about an operating point.',
    'The standard formula for propagating measurement uncertainty is a first-order Taylor expansion.',
    'Perturbation theory in mechanics and quantum physics expands in powers of a small parameter.'
  ],
  history: 'Brook Taylor published the general series in 1715; Colin Maclaurin used the special case about zero extensively in 1742. Madhava of Sangamagrama had found the series for sine and cosine around 1400, and James Gregory knew several Taylor expansions in 1671.',
  sim: 'so-taylor'
},

{
  id: 'fourier-series', parent: 'sequences-series', title: 'Fourier series', level: 3,
  short: 'Any periodic signal — a square wave, a violin note, the ripple from a rectifier — can be written as a sum of sines and cosines at whole-number multiples of its basic frequency.',
  keywords: ['Fourier series', 'harmonics', 'fundamental frequency', 'square wave', 'sawtooth', 'triangle wave', 'Gibbs phenomenon', 'orthogonality', 'spectrum', 'Fourier coefficients', 'Parseval', 'periodic function', 'overtones'],
  prereq: ['trig-graphs', 'definite-integral', 'trig-identities'],
  related: ['taylor-series', 'heat-equation', 'wave-equation', 'eulers-formula', 'dot-product', 'physics:harmonics-timbre', 'physics:standing-waves', 'physics:superposition'],
  body: `
A [[taylor-series|Taylor series]] rebuilds a function near one point out of powers. A **Fourier series** rebuilds a *periodic* function over a whole period out of waves. If $f$ repeats every $2L$, then

$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty}\\left(a_n\\cos\\frac{n\\pi x}{L} + b_n\\sin\\frac{n\\pi x}{L}\\right)$$

The $n = 1$ terms are the **fundamental**, which repeats once per period; the $n$-th terms are the **harmonics**, repeating $n$ times per period. For a signal in time with period $T$, the harmonics sit at the frequencies $f_n = n/T$. Played on an instrument, the fundamental sets the pitch and the mixture of harmonics the tone colour, or [[physics:harmonics-timbre|timbre]].

### Finding the coefficients: orthogonality
The key fact is that different harmonics are **orthogonal**: over a full period, the product of two different ones integrates to zero,

$$\\int_{-L}^{L}\\sin\\frac{m\\pi x}{L}\\,\\sin\\frac{n\\pi x}{L}\\,dx = \\begin{cases} 0 & m \\ne n \\\\ L & m = n \\end{cases}$$

and the same holds for cosines, while every sine is orthogonal to every cosine. So multiply $f$ by one harmonic and integrate over a period: every term of the series drops out except the one you multiplied by,

$$a_n = \\frac1L\\int_{-L}^{L} f(x)\\cos\\frac{n\\pi x}{L}\\,dx, \\qquad b_n = \\frac1L\\int_{-L}^{L} f(x)\\sin\\frac{n\\pi x}{L}\\,dx$$

This is exactly how you find the components of a vector by taking [[dot-product|dot products]] with perpendicular unit vectors: the harmonics are the axes, and the integral is the dot product. The constant $a_0/2$ is simply the average of $f$ over a period. Symmetry saves work: an even function needs only cosines, an odd one only sines.

### The square wave
Let $f = 1$ on $(0, \\pi)$ and $-1$ on $(-\\pi, 0)$, repeating (so $L = \\pi$). It is odd, and $b_n = \\frac{2}{\\pi}\\int_0^\\pi \\sin nx\\,dx = \\frac{2(1 - \\cos n\\pi)}{n\\pi}$, which is $\\frac{4}{n\\pi}$ for odd $n$ and 0 for even $n$:

$$f(x) = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$$

Only odd harmonics, with amplitudes falling like $1/n$. At $x = \\pi/2$ it even gives $\\tfrac{\\pi}{4} = 1 - \\tfrac13 + \\tfrac15 - \\cdots$ again.

### Convergence, jumps and the Gibbs overshoot
Where $f$ is smooth the series converges to $f$. At a jump it converges to the **midpoint** of the jump. Near a jump the partial sums **overshoot** by about 9% of the jump, and adding more terms does not reduce the overshoot — it only squeezes it closer to the jump. For the square wave the peaks stay near 1.18 for ever. This is the **Gibbs phenomenon**, and it shows up as ringing next to sharp edges in filtered signals and compressed images.

The smoother the function, the faster the coefficients shrink: a jump gives amplitudes $\\sim 1/n$, a corner (like the triangle wave) $\\sim 1/n^2$, a smooth function faster still. That is why a square wave sounds harsh and buzzy — it is loaded with strong high harmonics — while a triangle wave sounds soft.

### Energy: Parseval's theorem
The average of $f^2$ over a period equals $\\left(\\tfrac{a_0}{2}\\right)^2 + \\tfrac12\\sum (a_n^2 + b_n^2)$: the power of a signal is shared out among its harmonics. For the square wave the left side is 1, which gives $\\sum_{n\\ \\text{odd}} 1/n^2 = \\pi^2/8$.

### Why it matters
Joseph Fourier invented the series to solve the [[heat-equation|heat equation]]: each sine mode of a temperature profile decays on its own, at its own rate. The same idea solves the [[wave-equation|wave equation]], where each mode is a harmonic of a vibrating string. In electronics, a square clock signal carries odd harmonics that can interfere with radios; the ripple on a rectified supply is analysed harmonic by harmonic; filters and equalisers act on the spectrum. With [[eulers-formula|Euler's formula]] the series becomes $\\sum c_n e^{in\\pi x/L}$, the gateway to the Fourier transform, and the discrete cosine transform behind JPEG and MP3 is its close relative.
`,
  ideas: [
    'A periodic function is a sum of harmonics at whole-number multiples of its fundamental frequency.',
    'Sines and cosines of different frequencies are orthogonal, so each coefficient comes from a single integral.',
    'Even functions need only cosines; odd functions only sines.',
    'At a jump the series converges to the midpoint, and partial sums overshoot by about 9% of the jump (the Gibbs phenomenon).',
    'Smoother functions have faster-shrinking coefficients: $1/n$ with jumps, $1/n^2$ with corners.'
  ],
  pitfalls: [
    'At a jump, the series equals the function — It converges to the average of the values on either side, whatever value $f$ itself takes there.',
    'The Gibbs overshoot is a numerical error that goes away with enough terms — It is a true property of the partial sums: about 9% of the jump however many terms you take; it only gets narrower.',
    'Fourier series are only for smooth, wave-like signals — Any reasonable periodic function has one, jumps and corners included; the roughness just shows up as slowly shrinking coefficients.'
  ],
  formulas: [
    {
      name: 'Frequency of the n-th harmonic',
      expr: 'fn = n/T', tex: 'f_n = \\frac{n}{T}',
      vars: {
        fn: { name: 'frequency of harmonic n', q: 'frequency', unit: 'Hz', tex: 'f_n' },
        n: { name: 'harmonic number', int: true, value: 3 },
        T: { name: 'period of the signal', q: 'time', unit: 'ms', value: 20 }
      },
      stories: { fn: 'Mains electricity repeats every {T}. Distorting loads add harmonics to it. What is the frequency of harmonic number {n}?' }
    },
    {
      name: 'Square-wave harmonics',
      expr: 'b = 4*A/(n*pi)', tex: 'b_n = \\frac{4A}{n\\pi}\\quad (n\\ \\text{odd})',
      vars: {
        b: { name: 'amplitude of harmonic n', tex: 'b_n' },
        A: { name: 'height of the square wave', value: 1 },
        n: { name: 'harmonic number (odd)', int: true, value: 3 }
      },
      note: 'A square wave switching between $+A$ and $-A$ with equal times. Even harmonics are absent.',
      practice: { unknowns: ['b'] }
    },
    {
      name: 'Triangle-wave harmonics',
      expr: 'b = 8*A/(pi^2*n^2)', tex: 'b_n = \\frac{8A}{\\pi^2 n^2}\\quad (n\\ \\text{odd})',
      vars: {
        b: { name: 'amplitude of harmonic n', tex: 'b_n' },
        A: { name: 'peak of the triangle wave', value: 1 },
        n: { name: 'harmonic number (odd)', int: true, value: 3 }
      },
      note: 'The triangle wave has corners but no jumps, so its harmonics fall off like $1/n^2$: the 3rd is 1/9 of the fundamental, against 1/3 for a square wave.',
      practice: { unknowns: ['b'] }
    }
  ],
  examples: [
    {
      title: 'The coefficients of a square wave',
      q: 'Find the Fourier series of $f(x) = -1$ for $-\\pi < x < 0$ and $f(x) = 1$ for $0 < x < \\pi$, repeated with period $2\\pi$.',
      steps: [
        'The function is odd, so every $a_n = 0$: only sines appear.',
        { text: 'For the sine coefficients, the two halves contribute equally:', tex: 'b_n = \\frac1\\pi\\int_{-\\pi}^{\\pi} f(x)\\sin nx\\,dx = \\frac2\\pi\\int_0^\\pi \\sin nx\\,dx = \\frac{2}{n\\pi}\\left(1 - \\cos n\\pi\\right)' },
        'Since $\\cos n\\pi = (-1)^n$, $b_n = \\dfrac{4}{n\\pi}$ for odd $n$ and 0 for even $n$.',
        { text: 'So', tex: 'f(x) = \\frac4\\pi\\left(\\sin x + \\tfrac13\\sin 3x + \\tfrac15\\sin 5x + \\cdots\\right)' }
      ],
      a: 'Odd harmonics only, with amplitudes 4/(nπ).'
    },
    {
      title: 'A sawtooth solves the Basel problem',
      q: 'Expand $f(x) = x$ on $(-\\pi, \\pi)$ in a Fourier series, then use Parseval\'s theorem to find $\\sum 1/n^2$.',
      steps: [
        { text: 'The function is odd; integrate by parts for the sine coefficients:', tex: 'b_n = \\frac2\\pi\\int_0^\\pi x\\sin nx\\,dx = \\frac2\\pi\\left[-\\frac{x\\cos nx}{n}\\right]_0^\\pi + \\frac2\\pi\\int_0^\\pi\\frac{\\cos nx}{n}\\,dx = \\frac{2(-1)^{n+1}}{n}' },
        'So $x = 2\\left(\\sin x - \\tfrac12\\sin 2x + \\tfrac13\\sin 3x - \\cdots\\right)$ on $(-\\pi, \\pi)$.',
        { text: 'Parseval, in the form $\\frac1\\pi\\int_{-\\pi}^{\\pi} f^2\\,dx = \\sum b_n^2$:', tex: '\\frac1\\pi\\int_{-\\pi}^{\\pi} x^2\\,dx = \\frac{2\\pi^2}{3} = \\sum_{n=1}^\\infty \\frac{4}{n^2}' },
        'Divide by 4: $\\sum 1/n^2 = \\pi^2/6$.'
      ],
      a: 'x = 2 Σ (−1)ⁿ⁺¹ sin(nx)/n, and Σ 1/n² = π²/6.'
    }
  ],
  quiz: [
    { q: 'A periodic function is even (symmetric about $x = 0$). Its Fourier series contains…', choices: ['only sines', 'only cosines, and possibly a constant', 'both sines and cosines', 'only the constant term'], a: 1,
      why: 'Cosines are even and sines are odd. The sine coefficients of an even function are integrals of an odd function over a symmetric interval, so they vanish.' },
    { q: 'As more and more terms are added, the overshoot of a square wave\'s partial sums next to a jump…', choices: ['shrinks to zero', 'stays about 9% of the jump but gets narrower', 'grows without limit', 'disappears after about ten terms'], a: 1,
      why: 'That is the Gibbs phenomenon. The partial sums still converge at every fixed point away from the jump, because the overshoot moves ever closer to the jump.' },
    { q: 'Which signal has Fourier coefficients that shrink fastest with $n$?', choices: ['A square wave', 'A sawtooth', 'A triangle wave', 'They all shrink at the same rate'], a: 2,
      why: 'The triangle wave is continuous (only its slope jumps), so its coefficients fall like $1/n^2$. The square and sawtooth waves jump, giving $1/n$.' },
    { q: 'A symmetric square wave (equal times high and low) contains only odd harmonics.', a: true,
      why: 'Shifting it by half a period flips its sign; even harmonics are unchanged by that shift, so they cannot appear. Change the duty cycle and even harmonics come back.' },
    { q: 'What is the constant term $a_0/2$ in the Fourier series of $f(x) = |\\sin x|$? Give the exact value.', answer: '2/pi', vars: [],
      why: 'The constant term is the average over a period: $\\frac1\\pi\\int_0^\\pi \\sin x\\,dx = \\frac2\\pi$ — the DC level of a full-wave rectified sine.' }
  ],
  applications: [
    'Music and speech: timbre is the pattern of harmonic amplitudes, and synthesisers build sounds by adding them.',
    'Power engineering: rectifiers and switching supplies add harmonics that distort the mains waveform and heat transformers.',
    'Solving the heat and wave equations mode by mode.',
    'Spectrum analysers, audio equalisers, and the transforms behind JPEG and MP3 compression.'
  ],
  history: 'Joseph Fourier presented his series in 1807 while studying heat flow and published them in *Théorie analytique de la chaleur* (1822), against strong doubts that sums of smooth sines could produce jumps. The overshoot was noticed by Henry Wilbraham in 1848 and explained again by J. Willard Gibbs in 1899, whose name it carries.',
  sim: 'so-fourier'
}

);
