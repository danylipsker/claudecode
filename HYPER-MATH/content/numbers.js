/* HYPER-MATH · content/numbers.js — Algebra › Numbers and powers:
 * the kinds of numbers, fractions and ratios, powers and roots,
 * scientific notation and percentages. */
Hyper.add(

{
  id: 'number-systems', parent: 'numbers', title: 'Number systems', level: 1,
  short: 'Natural numbers, integers, rationals, reals and complex numbers: each family extends the one before so that one more operation always has an answer.',
  keywords: ['natural numbers', 'integers', 'rational', 'irrational', 'real numbers', 'number line', 'decimal', 'repeating decimal', 'sqrt 2', 'sets', 'N Z Q R C'],
  prereq: [],
  related: ['fractions-ratios', 'exponents', 'complex-numbers', 'scientific-notation'],
  body: `
Numbers were invented one problem at a time. Counting sheep needs only 1, 2, 3, …; owing a sheep needs negative numbers; sharing a loaf needs fractions; measuring the diagonal of a square needs something more again. Each new family repairs an operation the old one could not always carry out, and each contains the family before it.

### The nested families

| Family | Symbol | Examples | Always possible |
|---|---|---|---|
| Natural numbers | $\\mathbb{N}$ | 0, 1, 2, 3, … | adding, multiplying |
| Integers | $\\mathbb{Z}$ | …, −2, −1, 0, 1, 2, … | also subtracting |
| Rational numbers | $\\mathbb{Q}$ | $\\tfrac12$, $-\\tfrac73$, 0.25, 5 | also dividing (except by 0) |
| Real numbers | $\\mathbb{R}$ | $\\sqrt2$, $\\pi$, $\\mathrm{e}$, −4.1 | also limits and roots of positives |
| Complex numbers | $\\mathbb{C}$ | $3 + 2i$, $i$ | also roots of negatives |

So $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$. (Books disagree on whether 0 is a natural number; nothing important hangs on it.) "Always possible" is what mathematicians call **closure**: $3 - 5$ has no answer among the natural numbers, which is exactly why the integers are needed.

### Rational and irrational
A **rational** number is a ratio $p/q$ of two integers with $q \\ne 0$. Written as a decimal it either stops, like $\\tfrac38 = 0.375$, or repeats a block forever, like $\\tfrac17 = 0.\\overline{142857}$. An **irrational** number is not such a ratio: its decimals go on for ever without settling into a repeating pattern. $\\sqrt2 = 1.41421\\ldots$, $\\pi = 3.14159\\ldots$ and $\\mathrm{e} = 2.71828\\ldots$ are the famous ones, but in a precise sense *almost all* real numbers are irrational.

The rationals are **dense** — between any two of them lies another, their average — and yet they leave gaps; $\\sqrt 2$ sits in one of them. The rationals and irrationals together make the **real number line**: every point of the line is a real number and every real number is a point.

### Why it matters in science
Every measurement you ever write down is rational: a finite string of digits. The theories that predict measurements need the reals, though: a pendulum's period contains $\\pi$, radioactive decay contains $\\mathrm{e}$, the diagonal of a unit square is $\\sqrt2$. Integers count things that come whole — charges, protons in a nucleus, [[physics:quantum-numbers|quantum numbers]]. And admitting $\\sqrt{-1}$ gives the [[complex-numbers|complex numbers]], the natural language of alternating current and quantum mechanics.

> [!fact] Computers store numbers as binary fractions with a fixed number of digits, so most decimals are only approximated: in floating-point arithmetic 0.1 + 0.2 comes out as 0.30000000000000004.

> [!key] Each extension repairs an operation: subtraction gives the integers, division the rationals, limits and roots the reals, square roots of negatives the complex numbers.
`,
  ideas: [
    'The families nest: every natural number is an integer, every integer is rational, every rational is real, every real is complex.',
    'A rational number is a ratio of integers; its decimal expansion stops or repeats.',
    'An irrational number has a decimal expansion that never repeats; $\\sqrt2$, $\\pi$ and $\\mathrm{e}$ are irrational.',
    'The real numbers fill the number line with no gaps.'
  ],
  pitfalls: [
    '$\\pi = 22/7$ — 22/7 = 3.142857… is a handy approximation, good to about 0.04 %. $\\pi$ is irrational, so no fraction equals it.',
    'A decimal that goes on for ever must be irrational — Only if it never repeats. $0.333\\ldots = \\tfrac13$ and $0.\\overline{142857} = \\tfrac17$ are rational.',
    'There is a smallest positive rational number — Halve any candidate and you get a smaller one; the rationals have no smallest positive member.'
  ],
  derivation: {
    title: 'Why √2 is irrational',
    intro: 'A classic proof by contradiction: assume the opposite and show it cannot hold.',
    steps: [
      { text: 'Suppose $\\sqrt2$ were a fraction in lowest terms, so $p$ and $q$ are integers with no common factor:', tex: '\\sqrt2 = \\frac{p}{q}' },
      { text: 'Square both sides and multiply by $q^2$. Then $p^2$ is even, and so $p$ is even (the square of an odd number is odd). Write $p = 2k$.', tex: 'p^2 = 2q^2' },
      { text: 'Substitute $p = 2k$: now $q^2$ is even, so $q$ is even too.', tex: '4k^2 = 2q^2 \\;\\Rightarrow\\; q^2 = 2k^2' },
      { text: 'Both $p$ and $q$ are even, so they share the factor 2 — contradicting "lowest terms". No such fraction exists: $\\sqrt 2$ is irrational.' }
    ]
  },
  formulas: [
    {
      name: 'A repeating decimal as a fraction',
      expr: 'x = D/(10^n - 1)', tex: 'x = \\frac{D}{10^{n} - 1}',
      vars: {
        x: { name: 'the repeating decimal 0.DDD…', signed: false },
        D: { name: 'the repeating block, read as a whole number', value: 142857, int: true },
        n: { name: 'number of digits in the block', value: 6, int: true }
      },
      note: 'For a decimal that repeats straight after the point, such as $0.\\overline{27} = \\tfrac{27}{99} = \\tfrac{3}{11}$. With $D = 142857$ and $n = 6$ you get $\\tfrac17$.',
      practice: { unknowns: ['x'] }
    }
  ],
  examples: [
    {
      title: 'Sorting numbers into families',
      q: 'Classify each number: $-7$, $0.125$, $\\sqrt{16}$, $\\sqrt{20}$, $0.\\overline{3}$, $\\tfrac{22}{7}$, $\\tfrac{\\pi}{2}$.',
      steps: [
        '$\\sqrt{16} = 4$: natural (and so also an integer, rational and real).',
        '$-7$: an integer, not natural.',
        '$0.125 = \\tfrac18$ and $0.\\overline{3} = \\tfrac13$: rational. So is $\\tfrac{22}{7}$ — it is a fraction, whatever it is used to approximate.',
        '$\\sqrt{20} = 2\\sqrt5$ and $\\tfrac{\\pi}{2}$: irrational (a non-zero rational multiple of an irrational number is irrational).'
      ],
      a: 'Natural: √16. Integer: −7. Rational: 0.125, 0.333…, 22/7. Irrational: √20, π/2.'
    },
    {
      title: 'A repeating decimal back to a fraction',
      q: 'Write $0.363636\\ldots$ and $0.1666\\ldots$ as fractions.',
      steps: [
        'Let $x = 0.3636\\ldots$ The block has two digits, so multiply by 100: $100x = 36.3636\\ldots$',
        'Subtract to kill the tail: $100x - x = 36$, so $99x = 36$ and $x = \\tfrac{36}{99} = \\tfrac{4}{11}$.',
        'For $y = 0.1666\\ldots$ the repetition starts one place late: $100y = 16.666\\ldots$ and $10y = 1.666\\ldots$',
        'Subtract: $90y = 15$, so $y = \\tfrac{15}{90} = \\tfrac16$.'
      ],
      a: '0.3636… = 4/11 and 0.1666… = 1/6'
    }
  ],
  quiz: [
    { q: 'Which of these numbers is irrational?', choices: ['$\\sqrt{49}$', '$0.\\overline{12}$', '$\\sqrt{12}$', '$\\tfrac{22}{7}$'], a: 2,
      why: '$\\sqrt{49} = 7$; a repeating decimal is rational ($0.\\overline{12} = \\tfrac{12}{99} = \\tfrac{4}{33}$); $\\tfrac{22}{7}$ is a fraction. But $\\sqrt{12} = 2\\sqrt3$, and $\\sqrt3$ is irrational.' },
    { q: '$0.999\\ldots$, with nines for ever, is exactly equal to 1.', a: true,
      why: 'Let $x = 0.999\\ldots$; then $10x = 9.999\\ldots$ and $10x - x = 9$, so $x = 1$. Put another way, no number fits between them, so they are the same point of the line.' },
    { q: 'The sum of a rational number and an irrational number is…', choices: ['always rational', 'always irrational', 'sometimes rational, sometimes not', 'always an integer'], a: 1,
      why: 'If $r + s = t$ with $r$ and $t$ rational, then $s = t - r$ would be rational too. So an irrational $s$ always gives an irrational sum.' },
    { q: 'The product of two irrational numbers is always irrational.', a: false,
      why: '$\\sqrt2 \\times \\sqrt2 = 2$. Irrational numbers are not closed under multiplication.' },
    { q: 'Write the repeating decimal $0.\\overline{45} = 0.454545\\ldots$ as a fraction.', answer: '5/11', vars: [],
      why: 'With $x = 0.4545\\ldots$, $100x - x = 45$, so $x = \\tfrac{45}{99} = \\tfrac{5}{11}$. Any equal fraction, such as 45/99, is accepted.' }
  ],
  applications: [
    'Floating-point arithmetic: a computer\'s numbers are a finite set of binary fractions, so decimal values such as 0.1 are stored only approximately.',
    'Counting quantities in physics — electric charge in units of $e$, nucleon numbers, quantum numbers — are integers.',
    'Complex numbers describe alternating currents, waves and quantum states.'
  ],
  history: 'The Pythagoreans, around 500 BC, are said to have been shaken to find that the diagonal of a unit square has no fractional length. Negative numbers were used in Chinese mathematics two thousand years ago and given arithmetic rules by Brahmagupta in 628, long before Europe accepted them. A rigorous construction of the real numbers came only in 1872, from Richard Dedekind and Georg Cantor.'
},

{
  id: 'fractions-ratios', parent: 'numbers', title: 'Fractions, ratios and proportion', level: 1,
  short: 'Parts of a whole, comparisons between quantities, and the two simplest ways one quantity can depend on another: in direct or in inverse proportion.',
  keywords: ['fraction', 'numerator', 'denominator', 'common denominator', 'reciprocal', 'ratio', 'proportion', 'direct proportion', 'inverse proportion', 'cross-multiply', 'scale', 'unit rate'],
  prereq: ['number-systems'],
  related: ['percentages', 'linear-functions', 'power-functions', 'rational-functions'],
  body: `
A fraction $\\tfrac{a}{b}$ is a division waiting to happen: $a$ shared into $b$ equal parts. Cut a pizza into 8 slices and take 3: you have $\\tfrac38$ of it, which is also $3 \\div 8 = 0.375$ of a pizza.

### Working with fractions
- **Equivalent fractions.** Multiplying top and bottom by the same non-zero number changes nothing: $\\tfrac34 = \\tfrac68 = \\tfrac{75}{100}$. To simplify, divide both by their greatest common factor: $\\tfrac{18}{24} = \\tfrac34$.
- **Adding and subtracting** need pieces of the same size, a common denominator: $\\tfrac14 + \\tfrac16 = \\tfrac{3}{12} + \\tfrac{2}{12} = \\tfrac{5}{12}$.
- **Multiplying**: tops times tops, bottoms times bottoms. $\\tfrac23 \\times \\tfrac35 = \\tfrac{6}{15} = \\tfrac25$.
- **Dividing** is multiplying by the reciprocal. $\\tfrac23 \\div \\tfrac49 = \\tfrac23 \\times \\tfrac94 = \\tfrac32$: one and a half pieces of size $\\tfrac49$ fit into $\\tfrac23$.

The same rules work with letters, and they matter in physics:
$$\\frac{1}{x} + \\frac{1}{y} = \\frac{x + y}{xy}$$
is the step behind [[physics:resistors-combinations|resistors in parallel]] and the [[physics:thin-lenses|thin-lens equation]].

### Ratios
A ratio $a : b$ compares two quantities of the same kind. Concrete mixed 1 : 2 : 3 (cement : sand : gravel) is $\\tfrac16$ cement, because there are $1 + 2 + 3 = 6$ parts. To share a total in the ratio $a : b$, the shares are $\\tfrac{a}{a+b}$ and $\\tfrac{b}{a+b}$ of it. A map at 1 : 25 000 turns 1 cm of paper into 25 000 cm = 250 m of ground; a gearbox with a 3 : 1 ratio turns the output shaft once for every three turns of the motor.

### Proportion
Two quantities are **directly proportional**, $y \\propto x$, when their ratio is fixed:
$$y = kx$$
Double one and the other doubles; the graph is a straight line **through the origin**. They are **inversely proportional** when their product is fixed, $y = k/x$: double one and the other halves.

Physics is full of both. At fixed resistance the current through a wire is proportional to the voltage ([[physics:ohms-law|Ohm's law]]); the mass of a block is proportional to its volume, with the [[physics:density|density]] as the constant; at fixed temperature a gas's pressure is inversely proportional to its volume ([[physics:ideal-gas-law|Boyle's law]]).

A proportion $\\tfrac{a}{b} = \\tfrac{c}{d}$ is solved by **cross-multiplying**, $ad = bc$. If 3 kg of apples cost £4.50, then 5 kg cost $x$ pounds where $\\tfrac{3}{4.50} = \\tfrac{5}{x}$, so $3x = 22.5$ and $x = 7.50$.

> [!tip] Converting units is multiplying by fractions equal to 1: $72\\ \\mathrm{km/h} \\times \\dfrac{1000\\ \\mathrm{m}}{1\\ \\mathrm{km}} \\times \\dfrac{1\\ \\mathrm{h}}{3600\\ \\mathrm{s}} = 20\\ \\mathrm{m/s}$. The units cancel exactly like numbers.
`,
  ideas: [
    'A fraction is a division; equivalent fractions are different names for the same number.',
    'Add fractions over a common denominator; multiply straight across; divide by multiplying by the reciprocal.',
    'To share in the ratio $a : b$, give $\\tfrac{a}{a+b}$ and $\\tfrac{b}{a+b}$ of the total.',
    'Direct proportion $y = kx$: a fixed ratio and a straight line through the origin. Inverse proportion $y = k/x$: a fixed product.'
  ],
  pitfalls: [
    '$\\tfrac12 + \\tfrac13 = \\tfrac25$ — Adding tops and bottoms mixes pieces of different sizes. In sixths: $\\tfrac36 + \\tfrac26 = \\tfrac56$.',
    'Cancelling terms: $\\tfrac{x + 3}{3} = x$ — Only common *factors* cancel. $\\tfrac{x + 3}{3} = \\tfrac{x}{3} + 1$.',
    'Every straight-line graph shows proportion — Only a line through the origin. $y = 2x + 5$ is linear, but doubling $x$ does not double $y$.'
  ],
  formulas: [
    {
      name: 'A proportion (cross-multiplication)',
      expr: 'a/b = c/d', tex: '\\frac{a}{b} = \\frac{c}{d}', solveFor: 'd',
      vars: {
        a: { name: 'first quantity, first case', value: 6 },
        b: { name: 'second quantity, first case', value: 100 },
        c: { name: 'first quantity, second case', value: 45 },
        d: { name: 'second quantity, second case' }
      },
      stories: {
        d: 'A car uses {a} litres of fuel every {b} km. At the same rate, how far does {c} litres take it?',
        c: 'A car uses {a} litres of fuel every {b} km. How much fuel does a trip of {d} km need?'
      }
    },
    {
      name: 'Sharing in a ratio a : b',
      expr: 'A = T*a/(a + b)', tex: 'A = T\\,\\frac{a}{a + b}',
      vars: {
        A: { name: 'share of the first part' },
        T: { name: 'total', value: 120 },
        a: { name: 'first number of the ratio', value: 3 },
        b: { name: 'second number of the ratio', value: 5 }
      },
      stories: { A: 'A prize of {T} pounds is shared in the ratio {a} : {b}. How much is the first share?' }
    },
    {
      name: 'Direct proportion',
      expr: 'y = k*x',
      vars: {
        y: { name: 'dependent quantity', signed: true },
        k: { name: 'constant of proportionality', value: 2.5, signed: true },
        x: { name: 'independent quantity', value: 4, signed: true }
      }
    },
    {
      name: 'Inverse proportion',
      expr: 'y = k/x',
      vars: {
        y: { name: 'dependent quantity' },
        k: { name: 'constant (the fixed product x·y)', value: 60 },
        x: { name: 'independent quantity', value: 6 }
      },
      stories: { y: 'A job takes {k} worker-days. How many days does it take {x} workers?' }
    }
  ],
  examples: [
    {
      title: 'Sharing winnings fairly',
      q: 'Three friends put £20, £30 and £50 into a prize draw and win £400. They share it in proportion to what they put in. Who gets what?',
      steps: [
        'The ratio 20 : 30 : 50 simplifies to 2 : 3 : 5, which is $2 + 3 + 5 = 10$ parts.',
        'One part is $400 / 10 = 40$ pounds.',
        'The shares are $2 \\times 40 = 80$, $3 \\times 40 = 120$ and $5 \\times 40 = 200$ pounds. Check: $80 + 120 + 200 = 400$.'
      ],
      a: '£80, £120 and £200'
    },
    {
      title: 'Adding fractions with letters',
      q: 'Write $\\dfrac{1}{R_1} + \\dfrac{1}{R_2}$ as a single fraction, and use it to find the combined resistance $R$ of 6 Ω and 3 Ω in parallel, where $\\dfrac1R = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$.',
      steps: [
        'Common denominator $R_1 R_2$: $\\dfrac{R_2}{R_1 R_2} + \\dfrac{R_1}{R_1 R_2} = \\dfrac{R_1 + R_2}{R_1 R_2}$.',
        'So $\\dfrac1R = \\dfrac{R_1 + R_2}{R_1 R_2}$; take reciprocals of both sides: $R = \\dfrac{R_1 R_2}{R_1 + R_2}$.',
        'With 6 Ω and 3 Ω: $R = \\dfrac{18}{9} = 2\\ \\Omega$ — less than either resistor alone, as it must be with two paths for the current.'
      ],
      a: 'R = R₁R₂/(R₁ + R₂) = 2 Ω'
    },
    {
      title: 'More hands, less time',
      q: 'Six workers take 10 days to lay a floor. How long would 15 workers take, working at the same rate?',
      steps: [
        'The job is a fixed amount of work: $6 \\times 10 = 60$ worker-days. Days and workers are inversely proportional.',
        '$\\text{days} = 60 / 15 = 4$.'
      ],
      a: '4 days'
    }
  ],
  quiz: [
    { q: 'Simplify $\\dfrac{x}{2} + \\dfrac{x}{3}$ to a single fraction.', answer: '5x/6', vars: ['x'],
      why: 'Over the common denominator 6: $\\dfrac{3x}{6} + \\dfrac{2x}{6} = \\dfrac{5x}{6}$.' },
    { q: '$\\tfrac23 \\div \\tfrac16$ equals…', choices: ['$\\tfrac19$', '4', '$\\tfrac14$', '3'], a: 1,
      why: 'Multiply by the reciprocal: $\\tfrac23 \\times 6 = 4$. Four sixths make two thirds.' },
    { q: '$y$ is inversely proportional to $x$. If $x$ is tripled, $y$…', choices: ['triples', 'is divided by 3', 'is divided by 9', 'goes down by 3'], a: 1,
      why: 'The product $xy$ stays fixed, so if $x$ becomes $3x$, $y$ must become $y/3$.' },
    { q: 'A taxi charges £3 plus £2 per km. The fare is proportional to the distance.', a: false,
      why: 'The fare is linear in the distance but not proportional: 1 km costs £5 and 2 km costs £7, not £10. The fixed £3 puts the line above the origin.' },
    { q: 'On a map at 1 : 50 000, two villages are 7 cm apart. How far apart are they really?', choices: ['350 m', '3.5 km', '35 km', '7.14 km'], a: 1,
      why: '$7 \\times 50\\,000 = 350\\,000$ cm $= 3500$ m $= 3.5$ km.' }
  ],
  applications: [
    'Mixing concrete, mortar, fertiliser or medicine in fixed ratios; dilutions in chemistry obey $C_1V_1 = C_2V_2$.',
    'Maps, plans and scale models.',
    'Gear, pulley and transformer ratios in machines.',
    'Unit conversion and "best buy" comparisons by unit price.'
  ]
},

{
  id: 'exponents', parent: 'numbers', title: 'Exponents and roots', level: 1,
  short: 'Powers are repeated multiplication; their laws decide what zero, negative and fractional exponents mean, and roots are fractional powers.',
  keywords: ['exponent', 'power', 'index', 'indices', 'laws of exponents', 'negative exponent', 'zero exponent', 'fractional exponent', 'root', 'square root', 'cube root', 'surd', 'rationalise'],
  prereq: ['number-systems', 'fractions-ratios'],
  related: ['scientific-notation', 'power-functions', 'exponential-functions', 'logarithms', 'binomial-theorem'],
  body: `
Writing $2^5$ for $2 \\times 2 \\times 2 \\times 2 \\times 2 = 32$ is shorthand: the **base** 2 is multiplied by itself as many times as the **exponent** (or index) says. But the shorthand has rules of its own, and insisting that those rules keep working tells us what $2^0$, $2^{-3}$ and $2^{1/2}$ must mean.

### The laws
For a positive base $a$ and any exponents $m$ and $n$:
$$a^m a^n = a^{m+n}, \\qquad \\frac{a^m}{a^n} = a^{m-n}, \\qquad (a^m)^n = a^{mn}, \\qquad (ab)^n = a^n b^n$$
Each is just counting factors: $a^3 a^2 = (aaa)(aa) = a^5$, and $(a^2)^3 = (aa)(aa)(aa) = a^6$.

### Zero, negative and fractional exponents
- $a^0 = 1$, because $a^n / a^n$ must be both 1 and $a^{n-n}$.
- $a^{-n} = 1/a^n$, because $a^{-n} \\cdot a^n = a^0 = 1$. So $10^{-3} = 0.001$.
- $a^{1/n} = \\sqrt[n]{a}$, because $(a^{1/n})^n = a^1$. So $9^{1/2} = 3$ and $8^{1/3} = 2$.
- $a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m$: $8^{2/3} = 2^2 = 4$ and $16^{-3/4} = 1/2^3 = \\tfrac18$.

### Roots and surds
$\\sqrt{x}$ means the **non-negative** number whose square is $x$: $\\sqrt9 = 3$, even though $(-3)^2 = 9$ as well. Roots that are not whole numbers are left as **surds** and tidied by pulling out square factors, $\\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt2$, and a surd in a denominator is cleared by **rationalising**: $\\dfrac{1}{\\sqrt2} = \\dfrac{\\sqrt2}{2}$. Even roots of negative numbers are not real numbers (they need [[complex-numbers|complex numbers]]); odd roots are fine: $\\sqrt[3]{-8} = -2$.

### Powers in physics
Powers say how quantities scale. Light intensity falls as $r^{-2}$ with distance ([[physics:light-intensity|the inverse-square law]]); a planet's period obeys $T^2 \\propto a^3$ ([[physics:keplers-laws|Kepler's third law]]), so $T \\propto a^{3/2}$; a pendulum's period grows as $L^{1/2}$ ([[physics:simple-pendulum|simple pendulum]]); a hot body radiates in proportion to $T^4$ ([[physics:thermal-radiation|Stefan–Boltzmann law]]). Units carry exponents too: $\\mathrm{m/s^2}$ is $\\mathrm{m}\\,\\mathrm{s}^{-2}$.

> [!warn] Exponents do not distribute over sums: $(a + b)^2 = a^2 + 2ab + b^2$, never $a^2 + b^2$. Expanding such powers is the job of the [[binomial-theorem|binomial theorem]].
`,
  ideas: [
    'Multiplying powers of the same base adds the exponents; a power of a power multiplies them.',
    '$a^0 = 1$ and $a^{-n} = 1/a^n$ are not arbitrary: they are the only meanings that keep the laws true.',
    'A fractional exponent is a root: $a^{m/n} = \\left(\\sqrt[n]{a}\\right)^m$.',
    '$\\sqrt{x}$ is the non-negative root: $x^2 = 9$ has two solutions, $\\pm 3$, but $\\sqrt9 = 3$.'
  ],
  pitfalls: [
    '$(a + b)^2 = a^2 + b^2$ — Squaring a sum makes a cross term: $(a + b)^2 = a^2 + 2ab + b^2$. Test with $a = b = 1$: 4, not 2.',
    '$-3^2 = 9$ — The power binds tighter than the minus sign: $-3^2 = -(3^2) = -9$, while $(-3)^2 = 9$.',
    'A negative exponent makes a number negative — It makes a reciprocal: $2^{-3} = \\tfrac18$, still positive.'
  ],
  derivation: {
    title: 'Why a⁰ = 1 and a⁻ⁿ = 1/aⁿ',
    steps: [
      { text: 'For whole numbers $m > n$, dividing cancels $n$ factors:', tex: '\\frac{a^m}{a^n} = a^{m-n}' },
      { text: 'Ask the law to hold when $m = n$ too. The left side is 1, the right side is $a^0$:', tex: 'a^0 = 1' },
      { text: 'Now let $m = 0$:', tex: '\\frac{a^0}{a^n} = a^{-n} \\;\\Rightarrow\\; a^{-n} = \\frac{1}{a^n}' },
      { text: 'And ask $(a^m)^n = a^{mn}$ to hold for $m = 1/n$: the $n$-th power of $a^{1/n}$ is $a$, so $a^{1/n}$ is the $n$-th root.', tex: '\\left(a^{1/n}\\right)^n = a \\;\\Rightarrow\\; a^{1/n} = \\sqrt[n]{a}' }
    ]
  },
  formulas: [
    {
      name: 'A power',
      expr: 'y = a^p', tex: 'y = a^{p}',
      vars: {
        y: { name: 'value of the power' },
        a: { name: 'base', value: 2 },
        p: { name: 'exponent', value: 10, signed: true }
      },
      note: 'Solving for the exponent needs a logarithm, $p = \\ln y / \\ln a$ — see [[logarithms]].'
    },
    {
      name: 'An n-th root',
      expr: 'r = x^(1/n)', tex: 'r = \\sqrt[n]{x} = x^{1/n}',
      vars: {
        r: { name: 'the root' },
        x: { name: 'the number', value: 243 },
        n: { name: 'order of the root', value: 5 }
      }
    }
  ],
  examples: [
    {
      title: 'Using the laws together',
      q: 'Simplify $\\dfrac{(2x^3)^2 \\cdot x^{-1}}{4x^2}$.',
      steps: [
        '$(2x^3)^2 = 2^2 (x^3)^2 = 4x^6$.',
        'Multiply by $x^{-1}$: $4x^{6-1} = 4x^5$.',
        'Divide by $4x^2$: $\\dfrac{4x^5}{4x^2} = x^{3}$.'
      ],
      a: '$x^3$'
    },
    {
      title: 'A negative fractional power',
      q: 'Evaluate $27^{-2/3}$ without a calculator.',
      steps: [
        'The denominator 3 is a cube root: $\\sqrt[3]{27} = 3$.',
        'The numerator 2 squares it: $3^2 = 9$.',
        'The minus sign takes the reciprocal: $27^{-2/3} = \\tfrac19$.'
      ],
      a: '1/9'
    },
    {
      title: 'Kepler\'s third law as a power',
      q: 'Planet B orbits 4 times farther from its star than planet A. Using $T^2 \\propto a^3$, how many times longer is its year?',
      steps: [
        '$T \\propto a^{3/2}$, so the ratio of periods is $4^{3/2}$.',
        '$4^{1/2} = 2$ and $2^3 = 8$.'
      ],
      a: '8 times longer'
    }
  ],
  quiz: [
    { q: 'Simplify $x^3 \\cdot x^5 \\div x^2$.', answer: 'x^6', vars: ['x'],
      why: 'Add the exponents of the product and subtract that of the divisor: $3 + 5 - 2 = 6$.' },
    { q: 'Write $\\dfrac{1}{\\sqrt{x}}$ as a single power of $x$.', answer: 'x^(-1/2)', vars: ['x'],
      why: '$\\sqrt{x} = x^{1/2}$, and a reciprocal flips the sign of the exponent.' },
    { q: '$16^{3/4}$ equals…', choices: ['12', '8', '6', '$\\tfrac18$'], a: 1,
      why: 'Take the fourth root first, $\\sqrt[4]{16} = 2$, then cube: $2^3 = 8$. (12 is $16 \\times \\tfrac34$, a common slip.)' },
    { q: '$\\sqrt{x^2} = x$ for every real number $x$.', a: false,
      why: 'The square root is never negative, so $\\sqrt{x^2} = |x|$. For $x = -3$ it gives 3, not −3.' },
    { q: 'Which is largest?', choices: ['$2^{10}$', '$10^{3}$', '$4^{4}$', '$3^{6}$'], a: 0,
      why: '$2^{10} = 1024$, $10^3 = 1000$, $4^4 = 256$ and $3^6 = 729$.' }
  ],
  applications: [
    'Scaling laws in physics and biology: inverse-square fields, Kepler\'s third law, the $T^4$ of thermal radiation.',
    'Units written with exponents, such as $\\mathrm{kg\\,m^{-3}}$ and $\\mathrm{m\\,s^{-2}}$.',
    'Root-mean-square values in electricity and statistics.'
  ]
},

{
  id: 'scientific-notation', parent: 'numbers', title: 'Scientific notation and significant figures', level: 1,
  short: 'Writing very large and very small numbers as a × 10ⁿ, calculating with them, and keeping only the digits a measurement can justify.',
  keywords: ['scientific notation', 'standard form', 'powers of ten', 'order of magnitude', 'SI prefixes', 'significant figures', 'sig figs', 'rounding', 'precision', 'mantissa'],
  prereq: ['exponents', 'number-systems'],
  related: ['logarithmic-scales', 'logarithms', 'error-propagation', 'percentages'],
  body: `
The mass of an electron is 0.000 000 000 000 000 000 000 000 000 000 910 9 kg; the number of atoms in 12 g of carbon is 602 200 000 000 000 000 000 000. Nobody wants to count those zeros. **Scientific notation** (standard form) writes every number as
$$x = a \\times 10^{n}, \\qquad 1 \\le |a| < 10, \\quad n \\text{ an integer}$$
so the two become $9.109 \\times 10^{-31}\\ \\mathrm{kg}$ and $6.022 \\times 10^{23}$. The exponent $n$ gives the **order of magnitude** at a glance; the number $a$ carries the digits.

### Calculating
Multiply the numbers and add the exponents: $(3 \\times 10^{4})(2 \\times 10^{-6}) = 6 \\times 10^{-2}$. Divide the numbers and subtract the exponents: $\\dfrac{8 \\times 10^{5}}{4 \\times 10^{9}} = 2 \\times 10^{-4}$. Tidy up afterwards if needed: $(5 \\times 10^{3})(4 \\times 10^{2}) = 20 \\times 10^{5} = 2 \\times 10^{6}$. To add or subtract, first give both numbers the same power of ten.

### SI prefixes
Engineers usually write powers of ten as prefixes in steps of a thousand:

| Prefix | Factor | Prefix | Factor |
|---|---|---|---|
| kilo (k) | $10^{3}$ | milli (m) | $10^{-3}$ |
| mega (M) | $10^{6}$ | micro (µ) | $10^{-6}$ |
| giga (G) | $10^{9}$ | nano (n) | $10^{-9}$ |
| tera (T) | $10^{12}$ | pico (p) | $10^{-12}$ |

So 4.7 µF is $4.7 \\times 10^{-6}$ F and 2.4 GHz is $2.4 \\times 10^{9}$ Hz.

### Significant figures
The digits you write should say how well you know a number. $2.50 \\times 10^{3}$ m claims three significant figures — known to within about 5 m — while $2.5 \\times 10^{3}$ m claims only two. The rules:
- non-zero digits count, and so do zeros between them (1.05 has three);
- leading zeros never count (0.0042 has two);
- trailing zeros after a decimal point count (4.20 has three);
- trailing zeros in a whole number such as 2500 are ambiguous — scientific notation removes the doubt.

When you **multiply or divide**, keep as many significant figures as the least precise input: $2.5 \\times 3.14159 = 7.9$. When you **add or subtract**, the decimal places decide: $12.1 + 0.345 = 12.4$. Carry extra digits through a long calculation and round once, at the end. The careful version of all this is [[error-propagation|error propagation]].

> [!fact] The observable universe is nearly $10^{27}$ m across and a proton about $10^{-15}$ m: some 42 orders of magnitude apart, a span that scientific notation writes in a few characters. Plotting such ranges needs [[logarithmic-scales|logarithmic scales]].
`,
  ideas: [
    'A number in scientific notation is $a \\times 10^n$ with $1 \\le |a| < 10$; $n$ is its order of magnitude.',
    'Multiplying adds exponents; dividing subtracts them; adding needs a common power of ten first.',
    'Significant figures show how precisely a value is known; leading zeros never count.',
    'Round a product to the fewest significant figures of its inputs, a sum to the fewest decimal places.'
  ],
  pitfalls: [
    '$3.0 \\times 10^{-4}$ is bigger than $2.0 \\times 10^{-3}$ because 3 > 2 — Compare the exponents first: $10^{-4}$ is ten times smaller than $10^{-3}$, so 0.0003 < 0.002.',
    'More digits are more accurate — A calculator\'s 7.853981634 from $2.5 \\times 3.14159$ only looks precise; the input 2.5 limits the answer to 7.9.',
    'Rounding at every step — Rounding errors pile up. Keep guard digits and round only the final answer.'
  ],
  formulas: [
    {
      name: 'Scientific notation',
      expr: 'x = a*10^n', tex: 'x = a \\times 10^{n}', solveFor: 'x',
      vars: {
        x: { name: 'the number' },
        a: { name: 'the digits, between 1 and 10', value: 6.022, min: 1, max: 10 },
        n: { name: 'power of ten', value: 23, int: true, signed: true }
      },
      note: 'Solving for $n$ is taking a logarithm: $n = \\log_{10}(x/a)$. Try $x = 9.109 \\times 10^{-31}$ with $a = 9.109$.',
      practice: { unknowns: ['x'] }
    },
    {
      name: 'Orders of magnitude between two values',
      expr: 'N = log(B/A)', tex: 'N = \\log_{10}\\frac{B}{A}',
      vars: {
        N: { name: 'number of orders of magnitude', signed: true },
        B: { name: 'larger value', value: 8.8e26 },
        A: { name: 'smaller value', value: 1.7e-15 }
      },
      stories: { N: 'A proton is about {A} m across and the observable universe about {B} m. How many orders of magnitude apart are they?' }
    }
  ],
  examples: [
    {
      title: 'Molecules in a glass of water',
      q: 'A glass holds 250 g of water. One mole of water is 18.0 g and contains $6.022 \\times 10^{23}$ molecules. How many molecules are in the glass?',
      steps: [
        'Moles: $250 / 18.0 = 13.9$ mol.',
        'Molecules: $13.9 \\times 6.022 \\times 10^{23} = 83.6 \\times 10^{23}$.',
        'Tidy up: $8.36 \\times 10^{24}$. Both inputs have three significant figures, so three are justified.'
      ],
      a: 'About $8.36 \\times 10^{24}$ molecules'
    },
    {
      title: 'A calculation in powers of ten',
      q: 'Evaluate $\\dfrac{(6.0 \\times 10^{-3})(4.0 \\times 10^{8})}{8.0 \\times 10^{2}}$.',
      steps: [
        'Numerator: $6.0 \\times 4.0 = 24$ and $10^{-3} \\times 10^{8} = 10^{5}$, so $24 \\times 10^{5}$.',
        'Divide: $24 / 8.0 = 3.0$ and $10^{5} / 10^{2} = 10^{3}$.'
      ],
      a: '$3.0 \\times 10^{3}$'
    }
  ],
  quiz: [
    { q: 'How many significant figures does 0.004050 have?', choices: ['2', '3', '4', '7'], a: 2,
      why: 'The leading zeros only place the point. The 4, the 0 between 4 and 5, the 5 and the final 0 (after the decimal point) all count: four.' },
    { q: 'Calculate $(4 \\times 10^{-3}) \\times (5 \\times 10^{7})$. Type the answer, for example as 3e5 or 3*10^5.', answer: '2e5', vars: [],
      why: '$4 \\times 5 = 20$ and $10^{-3 + 7} = 10^{4}$, so $20 \\times 10^{4} = 2 \\times 10^{5}$.' },
    { q: '$3.0 \\times 10^{-4}$ is larger than $2.0 \\times 10^{-3}$.', a: false,
      why: '0.00030 against 0.0020: the second is almost seven times larger. The exponent matters more than the leading digit.' },
    { q: '12.1 m + 0.345 m, written to the precision the data justify, is…', choices: ['12.445 m', '12.44 m', '12.4 m', '12 m'], a: 2,
      why: 'In a sum the least precise term sets the decimal places: 12.1 is known to a tenth of a metre, so the sum is 12.4 m.' },
    { q: 'A nanosecond is how many times shorter than a millisecond?', choices: ['1000', '$10^{6}$', '$10^{-6}$', '$10^{9}$'], a: 1,
      why: '$10^{-3} / 10^{-9} = 10^{6}$: a million nanoseconds make a millisecond.' }
  ],
  problems: [
    { q: 'Light travels at $3.00 \\times 10^{8}$ m/s. How far does it go in one year, $3.16 \\times 10^{7}$ s? (That distance is a light-year.)', answer: 9.48e15, unit: 'm',
      steps: ['$d = vt = (3.00 \\times 10^{8})(3.16 \\times 10^{7})$', '$= 9.48 \\times 10^{15}$ m'] }
  ],
  applications: [
    'Every physical constant table: $c = 2.998 \\times 10^{8}$ m/s, $e = 1.602 \\times 10^{-19}$ C.',
    'Component values in electronics: 4.7 kΩ, 100 nF, 2.4 GHz.',
    'Order-of-magnitude (Fermi) estimates that check whether an answer is sensible.'
  ]
},

{
  id: 'percentages', parent: 'numbers', title: 'Percentages', level: 1,
  short: 'Fractions out of a hundred: finding a percentage of something, percentage change, multipliers, reverse percentages and the difference between per cent and percentage points.',
  keywords: ['percent', 'per cent', 'percentage', 'percentage change', 'increase', 'decrease', 'multiplier', 'reverse percentage', 'percentage point', 'discount', 'interest', 'VAT', 'relative error', 'efficiency'],
  prereq: ['fractions-ratios', 'number-systems'],
  related: ['exponential-growth-decay', 'number-e', 'error-propagation', 'physics:efficiency'],
  body: `
**Per cent** means *per hundred*: 7 % is $\\tfrac{7}{100} = 0.07$. Percentages put quantities of different sizes on one scale — 18 out of 24 and 45 out of 60 are both 75 % — which is why they are everywhere: interest rates, efficiencies, uncertainties, election results.

### Three questions, one relation
Everything rests on part = percentage × whole:
$$A = \\frac{p}{100}\\, B$$
- *What is 15 % of 240?* $A = 0.15 \\times 240 = 36$.
- *What percentage of 240 is 36?* $p = 100 \\times 36 / 240 = 15$.
- *36 is 15 % of what?* $B = 36 / 0.15 = 240$.

### Percentage change and multipliers
A change is always measured against the **starting** value:
$$\\text{percentage change} = \\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100$$
The quickest way to apply a change is a **multiplier**: increasing by 20 % is multiplying by 1.20, decreasing by 20 % is multiplying by 0.80. Successive changes multiply — they do not add. Up 10 % and then down 10 % is $1.10 \\times 0.90 = 0.99$, a 1 % loss overall. Ten years at 5 % a year is $1.05^{10} = 1.63$, a 63 % rise rather than 50 %: the seed of [[exponential-growth-decay|exponential growth]].

**Reverse percentages** undo a multiplier by dividing. A coat costs £96 after a 20 % reduction, so before it cost $96 / 0.80 = 120$ pounds — not £96 plus 20 %, which would be £115.20.

### Per cent and percentage points
If an interest rate goes from 4 % to 5 %, it has risen by **one percentage point**, but by **25 per cent** of its old value. Both statements are true; confusing them is the commonest way percentages mislead.

### In science and engineering
A length measured as 2.50 ± 0.05 m has a **relative uncertainty** of 2 %, and relative uncertainties combine simply when quantities are multiplied (see [[error-propagation]]). A motor that turns 800 W of electrical power into 600 W of mechanical power has an [[physics:efficiency|efficiency]] of 75 %. Small concentrations use parts per million: 1 ppm is 0.0001 %.

> [!tip] To increase by $p$ %, multiply by $1 + p/100$; to decrease, by $1 - p/100$. To undo a change, divide by the same multiplier.
`,
  ideas: [
    '$p$ % of $B$ is $\\tfrac{p}{100}B$; the three percentage questions are the same relation solved for different unknowns.',
    'Percentage change is measured against the original value.',
    'Changes by a percentage are multiplications, so successive changes multiply.',
    'A change of one percentage point is not a change of one per cent.'
  ],
  pitfalls: [
    'Up 10 % then down 10 % leaves you where you started — $1.1 \\times 0.9 = 0.99$: the second 10 % is taken from a bigger number, so you end 1 % down.',
    'Reversing a 20 % cut by adding 20 % — After a 20 % cut the price is 0.8 of the original; getting back needs ×1.25, a 25 % rise. Divide by 0.8 instead.',
    'Measuring a change against the new value — Percentage change always divides by the old value: from 80 to 100 is +25 %, from 100 to 80 is −20 %.'
  ],
  formulas: [
    {
      name: 'A percentage of a whole',
      expr: 'A = p/100*B', tex: 'A = \\frac{p}{100}\\, B',
      vars: {
        A: { name: 'part' },
        p: { name: 'percentage, in %', value: 15 },
        B: { name: 'whole', value: 240 }
      },
      stories: {
        A: 'What is {p} per cent of {B}?',
        p: 'What percentage of {B} is {A}?',
        B: '{A} is {p} per cent of what number?'
      }
    },
    {
      name: 'Changing by a percentage',
      expr: 'V2 = V1*(1 + p/100)', tex: 'V_2 = V_1 \\left(1 + \\frac{p}{100}\\right)',
      vars: {
        V2: { name: 'new value' },
        V1: { name: 'original value', value: 120 },
        p: { name: 'percentage change, in % (negative for a decrease)', value: -20, signed: true }
      },
      stories: {
        V2: 'A price of {V1} pounds changes by {p} per cent. What is the new price?',
        V1: 'After a change of {p} per cent a coat costs {V2} pounds. What did it cost before?',
        p: 'A town grows from {V1} to {V2} people. What is the percentage change?'
      }
    },
    {
      name: 'Repeated percentage change',
      expr: 'V = V0*(1 + p/100)^n', tex: 'V = V_0 \\left(1 + \\frac{p}{100}\\right)^{n}',
      vars: {
        V: { name: 'value after n periods' },
        V0: { name: 'starting value', value: 1000 },
        p: { name: 'percentage change per period, in %', value: 5, signed: true },
        n: { name: 'number of periods', value: 10 }
      },
      note: 'Compound interest, inflation, population growth or a loss every period. Solving for $n$ gives the time to reach a target.',
      stories: {
        V: 'A savings account holding {V0} pounds pays {p} per cent a year, compounded yearly. How much is in it after {n} years?',
        n: 'Money grows by {p} per cent a year. How many years does it take {V0} pounds to become {V} pounds?'
      }
    }
  ],
  examples: [
    {
      title: 'Up and then down',
      q: 'A share price rises by 25 % and then falls by 20 %. What is the overall change?',
      steps: [
        'The multipliers are 1.25 and 0.80.',
        'Overall: $1.25 \\times 0.80 = 1.00$.'
      ],
      a: 'No change: the price is back where it started.'
    },
    {
      title: 'Taking tax back out',
      q: 'A bill of £150 includes 20 % VAT. What was the price before tax, and how much is the tax?',
      steps: [
        'Adding 20 % is multiplying by 1.20, so the price before tax is $150 / 1.20 = 125$ pounds.',
        'The tax is $150 - 125 = 25$ pounds — which is 20 % of 125, not of 150.'
      ],
      a: '£125 before tax; £25 of tax'
    },
    {
      title: 'The efficiency of a kettle',
      q: 'A kettle draws 2.0 kW for 180 s and heats 1.0 kg of water from 20 °C to 100 °C, which takes 335 kJ. What is its efficiency?',
      steps: [
        'Energy in: $2000\\ \\mathrm{W} \\times 180\\ \\mathrm{s} = 360\\ \\mathrm{kJ}$.',
        'Useful energy out: 335 kJ (see [[physics:specific-heat|specific heat]]).',
        'Efficiency: $\\dfrac{335}{360} \\times 100 = 93$ %.'
      ],
      a: 'About 93 %'
    }
  ],
  quiz: [
    { q: 'A price rises by 50 % and then falls by 50 %. Overall it has…', choices: ['returned to the start', 'fallen by 25 %', 'risen by 25 %', 'fallen by 50 %'], a: 1,
      why: '$1.5 \\times 0.5 = 0.75$: the fall is taken from the larger, raised price.' },
    { q: 'A mortgage rate goes up from 2 % to 3 %. It has risen by…', choices: ['1 %', '1 percentage point, which is a 50 % increase', '50 percentage points', '3 %'], a: 1,
      why: 'The difference of the rates is 1 percentage point; relative to the old rate of 2 %, that is a rise of half, 50 %.' },
    { q: 'An amount $x$ is increased by 15 %. Write the new amount.', answer: '1.15x', vars: ['x'],
      why: 'Increasing by 15 % multiplies by $1 + 0.15$.' },
    { q: 'An amount $x$ is cut by 30 %, and the result is then increased by 30 %. Write the final amount.', answer: '0.91x', vars: ['x'],
      why: '$x \\times 0.70 \\times 1.30 = 0.91x$ — a net loss of 9 %.' },
    { q: 'After a 20 % discount a jacket costs £60. What was the original price?', choices: ['£72', '£75', '£80', '£48'], a: 1,
      why: 'The sale price is 0.80 of the original, so the original is $60 / 0.80 = 75$ pounds. Adding 20 % of 60 (giving £72) measures the change against the wrong value.' }
  ],
  problems: [
    { q: 'A city of 8.0 million people grows by 1.5 % a year. What is its population after 12 years, in millions?', answer: 9.565, tol: 0.02,
      steps: ['Each year multiplies the population by 1.015.', '$8.0 \\times 1.015^{12} = 8.0 \\times 1.1956 = 9.56$ million.'] }
  ],
  applications: [
    'Interest rates, inflation and loan repayments.',
    'Efficiencies of engines, motors and power stations.',
    'Relative uncertainties in measurements and tolerances in manufacturing.',
    'Concentrations: mass per cent, parts per million.'
  ]
}

);
