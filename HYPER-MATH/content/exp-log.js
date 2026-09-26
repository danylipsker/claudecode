/* HYPER-MATH · content/exp-log.js — Algebra › Exponentials and logarithms:
 * exponential functions, the number e, logarithms, growth and decay, and
 * logarithmic scales. */
Hyper.add(

{
  id: 'exponential-functions', parent: 'exp-log', title: 'Exponential functions', level: 2,
  short: 'Functions a·bˣ with the variable in the exponent: every equal step multiplies by the same factor, giving explosive growth or steady decay.',
  keywords: ['exponential function', 'growth factor', 'exponential growth', 'exponential decay', 'b^x', 'doubling', 'constant ratio', 'asymptote', 'compound growth'],
  prereq: ['exponents', 'functions', 'percentages'],
  related: ['exponential-growth-decay', 'number-e', 'logarithms', 'geometric-series', 'power-functions'],
  body: `
In an **exponential function** the variable sits in the exponent:
$$f(x) = a \\cdot b^{x} \\qquad (b > 0,\\ b \\ne 1)$$
$a = f(0)$ is the starting value and $b$ the **growth factor**: every step of 1 in $x$ multiplies $f$ by $b$. That is the whole idea. A linear function adds the same amount at every step; an exponential multiplies by the same factor.

| $x$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| linear, $3 + 2x$ | 3 | 5 | 7 | 9 | 11 | 13 |
| exponential, $3 \\cdot 2^x$ | 3 | 6 | 12 | 24 | 48 | 96 |

Data are exponential when the **ratios** of successive values are constant (here always 2), just as they are linear when the differences are constant.

### Growth and decay
- $b > 1$: **exponential growth**, rising ever faster. A growth rate $r$ per step means $b = 1 + r$: 3 % a year is $b = 1.03$ ([[percentages]]).
- $0 < b < 1$: **exponential decay**, falling towards zero without ever reaching it; the $x$-axis is a horizontal asymptote. Losing 20 % per step is $b = 0.8$.

With $a > 0$ an exponential is always positive, crosses the $y$-axis at $a$, and is one-to-one — so it has an inverse, the [[logarithms|logarithm]].

### Doubling and halving
Because every step multiplies by the same factor, the time to double is the same wherever you start. Bacteria that double every 20 minutes go 1, 2, 4, 8, … and after 10 hours (30 doublings) number $2^{30} \\approx 10^9$. Fold a sheet of paper 0.1 mm thick 42 times — if only you could — and it would be $0.1\\ \\mathrm{mm} \\times 2^{42} \\approx 440\\,000$ km thick, further than the Moon. Decay has a half-life instead of a doubling time ([[exponential-growth-decay|exponential growth and decay]]).

### Exponential beats power
Compare $x^2$ with $2^x$: at $x = 4$ both are 16; at $x = 10$ they are 100 and 1024; at $x = 30$, 900 and about a billion. Any exponential with $b > 1$ eventually overtakes any [[power-functions|power]] $x^p$, however large $p$ is. The simulation lets you race them.

### Base e
Any base can be rewritten in any other, because $b^x = \\mathrm{e}^{x \\ln b}$. Scientists mostly use the natural base $\\mathrm{e} \\approx 2.718$, because $\\mathrm{e}^{kx}$ has the simplest rate of change — its slope is $k$ times its own value ([[number-e|the number e]]).

### Where exponentials appear
Wherever a quantity changes at a rate proportional to itself: populations and savings (more makes more), radioactive nuclei ([[physics:half-life|half-life]]), a capacitor discharging through a resistor ([[physics:rc-circuits|RC circuits]]), light absorbed as it passes through tinted glass, and air pressure, which roughly halves for every 5.5 km of height.
`,
  ideas: [
    'In $a \\cdot b^x$ each unit step in $x$ multiplies the value by $b$; linear functions add, exponentials multiply.',
    '$b > 1$ gives growth, $0 < b < 1$ gives decay towards the asymptote $y = 0$.',
    'A fixed factor takes a fixed time: doubling times and half-lives do not depend on the starting value.',
    'Exponential growth eventually outruns any power of $x$.'
  ],
  pitfalls: [
    'Treating $2^x$ as a power function like $x^2$ — The variable is in the exponent. The two agree at $x = 2$ and $x = 4$ and then part company spectacularly.',
    'A 20 % loss per year empties the tank in 5 years — Each year removes 20 % of what is left, so after 5 years $0.8^5 = 33\\ \\%$ remains. Decay never quite reaches zero.',
    'Growth rate and growth factor are the same number — A 5 % rate is a factor of 1.05, not 5 or 0.05.'
  ],
  formulas: [
    {
      name: 'An exponential function',
      expr: 'y = a*b^x', tex: 'y = a \\cdot b^{x}',
      vars: {
        y: { name: 'value' },
        a: { name: 'starting value (at x = 0)', value: 3 },
        b: { name: 'growth factor per step', value: 2 },
        x: { name: 'number of steps', value: 5, signed: true }
      },
      note: 'Solve for $x$ to find how many steps it takes to reach a value — a logarithm does the work.',
      stories: {
        y: 'A culture starts with {a} thousand bacteria and grows by a factor of {b} every hour. How many thousand are there after {x} hours?',
        x: 'A quantity starts at {a} and is multiplied by {b} at every step. After how many steps does it reach {y}?'
      }
    },
    {
      name: 'Doubling time for a growth factor',
      expr: 'T = ln(2)/ln(b)', tex: 'T = \\frac{\\ln 2}{\\ln b}',
      vars: {
        T: { name: 'doubling time, in steps', signed: true },
        b: { name: 'growth factor per step', value: 1.03 }
      },
      note: 'For decay ($b < 1$) this comes out negative; its size is the half-life.'
    }
  ],
  examples: [
    {
      title: 'Is it exponential?',
      q: 'Measurements give $y$ = 5, 7.5, 11.25, 16.875 at $x$ = 0, 1, 2, 3. Find a formula.',
      steps: [
        'Differences: 2.5, 3.75, 5.625 — not constant, so not linear.',
        'Ratios: $7.5/5 = 1.5$, $11.25/7.5 = 1.5$, $16.875/11.25 = 1.5$ — constant.',
        'So $y = 5 \\cdot 1.5^{x}$.'
      ],
      a: '$y = 5 \\cdot 1.5^x$'
    },
    {
      title: 'Through two points',
      q: 'An exponential $y = a \\cdot b^x$ passes through $(1, 6)$ and $(3, 54)$. Find $a$ and $b$.',
      steps: [
        'Divide the two equations: $\\dfrac{ab^3}{ab^1} = b^2 = \\dfrac{54}{6} = 9$, so $b = 3$.',
        'Then $a = 6/3 = 2$.',
        'Check: $2 \\cdot 3^3 = 54$.'
      ],
      a: '$y = 2 \\cdot 3^x$'
    },
    {
      title: 'A medicine leaving the body',
      q: 'The kidneys remove 20 % of a drug from the blood every hour. How much of a 400 mg dose is left after 6 hours?',
      steps: [
        'Each hour 80 % remains: the factor is $b = 0.8$.',
        '$400 \\times 0.8^6 = 400 \\times 0.262 = 104.9$ mg.'
      ],
      a: 'About 105 mg'
    }
  ],
  quiz: [
    { q: 'Which sequence of values could come from an exponential function?', choices: ['2, 4, 6, 8', '2, 4, 8, 16', '2, 4, 7, 11', '1, 4, 9, 16'], a: 1,
      why: 'Constant ratio 2. The first is linear (constant difference), the last is $x^2$.' },
    { q: 'Write $8^x$ as a power of 2.', answer: '2^(3x)', vars: ['x'],
      why: '$8 = 2^3$, so $8^x = (2^3)^x = 2^{3x}$.' },
    { q: 'A car loses 15 % of its value each year. After $t$ years its value is $V_0 \\times$…', choices: ['$0.15^t$', '$0.85^t$', '$1.15^t$', '$(1 - 0.15t)$'], a: 1,
      why: 'Each year 85 % of the value remains. The last choice is a linear loss, which would reach zero after under 7 years.' },
    { q: 'For large enough $x$, $1.01^x$ is larger than $x^{100}$.', a: true,
      why: 'Any exponential with base above 1 eventually beats any power — here only beyond $x \\approx 117\\,000$, but it does.' },
    { q: 'The graph of $y = 3 \\cdot 0.5^x$…', choices: ['crosses the $x$-axis at $x = 3$', 'has the $x$-axis as an asymptote', 'passes through $(0, 0.5)$', 'rises to the right'], a: 1,
      why: 'It halves at each step, approaching 0 without reaching it. It passes through $(0, 3)$ and falls to the right.' }
  ],
  applications: [
    'Population growth, interest, inflation.',
    'Radioactive decay, drug elimination, capacitor discharge.',
    'Absorption of light and X-rays in matter.',
    'The barometric formula for air pressure with height.'
  ],
  sim: 'alg-growth-race'
},

{
  id: 'number-e', parent: 'exp-log', title: 'The number e', level: 2,
  short: 'e = 2.71828…, the limit of compounding interest ever more often, and the base whose exponential is its own slope — the natural base for all growth and decay.',
  keywords: ['e', 'Euler\'s number', '2.718', 'natural base', 'continuous compounding', 'compound interest', 'limit', 'exp', 'natural exponential', 'time constant'],
  prereq: ['exponential-functions', 'percentages'],
  related: ['logarithms', 'exponential-growth-decay', 'derivatives-of-functions', 'taylor-series', 'eulers-formula', 'exponential-models'],
  body: `
The number
$$\\mathrm{e} = 2.718\\,281\\,828\\,459\\ldots$$
is, after $\\pi$, the most important constant in mathematics. It appears in two ways that look unrelated and turn out to be the same.

### Interest compounded ever more often
Put £1 into a (wildly generous) account paying 100 % a year. Paid once at the end of the year, you have £2. Paid as 50 % twice: $1.5^2 = 2.25$. Quarterly: $1.25^4 = 2.441$. Monthly: $(1 + \\tfrac{1}{12})^{12} = 2.613$. Daily: $(1 + \\tfrac{1}{365})^{365} = 2.7146$. More frequent compounding always helps, but by less and less, and the amounts close in on a limit:
$$\\mathrm{e} = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^{n}$$
At a yearly rate $r$ for $t$ years, the same limit turns compound interest into **continuous compounding**:
$$A = P \\left(1 + \\frac{r}{n}\\right)^{nt} \\;\\xrightarrow{\\;n \\to \\infty\\;}\\; P\\,\\mathrm{e}^{rt}$$

### The function that is its own slope
Draw $2^x$ and $3^x$ and measure their slopes where they cross the $y$-axis: about 0.69 and 1.10. Somewhere between 2 and 3 is a base whose graph crosses with slope exactly 1 — and that base is e. Something remarkable follows: the slope of $\\mathrm{e}^x$ at **every** point equals its height there,
$$\\frac{d}{dx}\\,\\mathrm{e}^{x} = \\mathrm{e}^{x}$$
(see [[derivatives-of-functions|derivatives of the standard functions]]). Apart from its multiples, no other function does this. So e appears wherever a quantity changes at a rate proportional to itself, and physics writes its exponentials as $\\mathrm{e}^{kt}$ rather than $2^{t/T}$.

### Other faces of e
- As a series: $\\mathrm{e} = 1 + 1 + \\tfrac{1}{2!} + \\tfrac{1}{3!} + \\tfrac{1}{4!} + \\cdots$, which converges fast: ten terms give six correct decimal places ([[taylor-series|Taylor series]]).
- The logarithm to base e is the **natural logarithm**, $\\ln x$ ([[logarithms]]).
- Euler's formula $\\mathrm{e}^{i\\theta} = \\cos\\theta + i\\sin\\theta$ ties e to the trigonometric functions and gives $\\mathrm{e}^{i\\pi} + 1 = 0$ ([[eulers-formula|Euler's formula]]).
- e is irrational, and even transcendental: no polynomial equation with integer coefficients has it as a root.

### e in science
Radioactive decay, a capacitor discharging, an unchecked population, a drug cleared by the kidneys, a hot drink cooling towards room temperature: all follow $\\mathrm{e}^{kt}$ ([[exponential-growth-decay|exponential growth and decay]]). The **time constant** $\\tau = 1/|k|$ is the time for a factor of e. After one time constant a decaying quantity is down to $1/\\mathrm{e} \\approx 37\\ \\%$; after five, to under 1 %.

> [!fact] Compounding more often helps surprisingly little at realistic rates: at 5 % a year, £1000 becomes £1050.00 with yearly compounding and £1051.27 with continuous compounding.
`,
  ideas: [
    '$\\mathrm{e} \\approx 2.71828$ is the limit of $(1 + 1/n)^n$ as $n \\to \\infty$.',
    'Continuous compounding at rate $r$ multiplies by $\\mathrm{e}^{rt}$ in time $t$.',
    '$\\mathrm{e}^x$ is its own derivative: its slope everywhere equals its value.',
    'In $\\mathrm{e}^{-t/\\tau}$, one time constant $\\tau$ reduces a quantity to about 37 %.'
  ],
  pitfalls: [
    'Compounding more and more often makes the balance grow without limit — It approaches $P\\mathrm{e}^{rt}$, a finite ceiling.',
    'e is just a convenient rounded number like 2.7 — It is irrational; 2.7 and 2.718 are approximations, and the exact value matters in long calculations.',
    'Writing $\\mathrm{e}^{a + b} = \\mathrm{e}^a + \\mathrm{e}^b$ — Exponents that add mean factors that multiply: $\\mathrm{e}^{a + b} = \\mathrm{e}^a \\mathrm{e}^b$.'
  ],
  formulas: [
    {
      name: 'Compound interest',
      expr: 'A = P*(1 + r/n)^(n*t)', tex: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
      vars: {
        A: { name: 'final amount' },
        P: { name: 'amount deposited', value: 1000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5 },
        n: { name: 'compounding periods per year', value: 12, int: true },
        t: { name: 'time, in years', value: 10 }
      },
      practice: { unknowns: ['A', 'P', 't', 'r'] },
      stories: {
        A: '{P} pounds is invested at {r} a year, compounded {n} times a year. How much is there after {t} years?',
        t: 'How many years does {P} pounds take to grow to {A} pounds at {r} a year, compounded {n} times a year?'
      }
    },
    {
      name: 'Continuous compounding',
      expr: 'A = P*exp(r*t)', tex: 'A = P\\,\\mathrm{e}^{rt}',
      vars: {
        A: { name: 'final amount' },
        P: { name: 'amount deposited', value: 1000 },
        r: { name: 'yearly rate', q: 'ratio', unit: '%', value: 5 },
        t: { name: 'time, in years', value: 10 }
      },
      stories: { r: 'An account compounding continuously turns {P} pounds into {A} pounds in {t} years. What yearly rate is that?' }
    },
    {
      name: 'e as a limit',
      expr: 'y = (1 + 1/n)^n', tex: 'y = \\left(1 + \\frac{1}{n}\\right)^{n}',
      vars: {
        y: { name: 'value, approaching e' },
        n: { name: 'number of compounding steps', value: 1000 }
      },
      note: 'With $n = 1000$ the value is 2.7169, still 0.05 % below e; the error shrinks roughly like $\\mathrm{e}/2n$.',
      practice: { unknowns: ['y'] }
    }
  ],
  examples: [
    {
      title: 'Monthly or continuous?',
      q: '£5000 is invested for 20 years at 4 % a year. Compare monthly compounding with continuous compounding.',
      steps: [
        'Monthly: $5000\\left(1 + \\dfrac{0.04}{12}\\right)^{240} = 5000 \\times 2.2226 = 11\\,112.91$ pounds.',
        'Continuous: $5000\\,\\mathrm{e}^{0.04 \\times 20} = 5000\\,\\mathrm{e}^{0.8} = 5000 \\times 2.2255 = 11\\,127.70$ pounds.',
        'The difference is under £15 on £11 000.'
      ],
      a: '£11 112.91 against £11 127.70'
    },
    {
      title: 'Measuring the slope at zero',
      q: 'Estimate the slopes of $\\mathrm{e}^x$ and $2^x$ at $x = 0$ using a tiny step $h = 0.001$.',
      steps: [
        'For $\\mathrm{e}^x$: $\\dfrac{\\mathrm{e}^{0.001} - 1}{0.001} = \\dfrac{0.0010005}{0.001} = 1.0005$.',
        'For $2^x$: $\\dfrac{2^{0.001} - 1}{0.001} = 0.6934$.',
        'As $h$ shrinks these approach 1 and $\\ln 2 = 0.6931$: the exponential with slope 1 at zero has base e.'
      ],
      a: 'About 1 and about 0.693'
    },
    {
      title: 'A discharging capacitor',
      q: 'A capacitor discharges as $V = V_0\\,\\mathrm{e}^{-t/\\tau}$ with $\\tau = 2$ s. What fraction of the voltage remains after 2 s and after 6 s?',
      steps: [
        'After 2 s, one time constant: $\\mathrm{e}^{-1} = 0.368$, about 37 %.',
        'After 6 s, three time constants: $\\mathrm{e}^{-3} = 0.050$, about 5 %.'
      ],
      a: '37 % and 5 %'
    }
  ],
  quiz: [
    { q: 'As $n$ grows, $(1 + 1/n)^n$…', choices: ['grows without limit', 'approaches 1', 'approaches e ≈ 2.718', 'approaches 2'], a: 2,
      why: 'Two effects compete — a base shrinking towards 1 and an exponent growing — and they balance at e.' },
    { q: 'Simplify $\\mathrm{e}^{2\\ln x}$ (for $x > 0$).', answer: 'x^2', vars: ['x'],
      why: '$2\\ln x = \\ln x^2$, and $\\mathrm{e}^{\\ln u} = u$.' },
    { q: 'What is the slope of $y = \\mathrm{e}^x$ at the point where $y = 5$?', choices: ['1', '5', '$\\ln 5$', 'e'], a: 1,
      why: 'The slope of $\\mathrm{e}^x$ equals its value, so it is 5 there.' },
    { q: 'Compounding every second instead of every day would roughly double the interest you earn.', a: false,
      why: 'Daily compounding is already within a whisker of the continuous limit; at 5 % a year, going from daily to continuous adds less than a penny per £1000 in a year.' },
    { q: 'After one time constant, a quantity decaying as $\\mathrm{e}^{-t/\\tau}$ has fallen to about…', choices: ['50 %', '37 %', '10 %', '63 %'], a: 1,
      why: '$\\mathrm{e}^{-1} = 0.368$. (63 % is the part that has gone; 50 % takes $0.69\\tau$, the half-life.)' }
  ],
  problems: [
    { q: 'How long does money take to double at 3 % a year compounded continuously?', answer: 23.10, unit: 'yr',
      steps: ['$2 = \\mathrm{e}^{0.03t}$, so $t = \\dfrac{\\ln 2}{0.03}$', '$t = \\dfrac{0.6931}{0.03} = 23.1$ years'] }
  ],
  applications: [
    'Continuous compounding in finance.',
    'Every first-order decay and growth law: radioactivity, RC circuits, cooling, drug clearance.',
    'The normal distribution $\\mathrm{e}^{-x^2/2}$ and the Boltzmann factor $\\mathrm{e}^{-E/kT}$.',
    'Waves and alternating currents through $\\mathrm{e}^{i\\omega t}$.'
  ],
  history: 'Jacob Bernoulli met the limit $(1 + 1/n)^n$ in 1683 while studying compound interest. Leonhard Euler named the number e, proved that it is irrational, and computed it to 23 decimal places in the 1740s.',
  sim: 'alg-compound'
},

{
  id: 'logarithms', parent: 'exp-log', title: 'Logarithms', level: 2,
  short: 'The logarithm answers "what power?": log_b x = y means bʸ = x. It turns multiplication into addition and brings unknowns down from exponents.',
  keywords: ['logarithm', 'log', 'ln', 'natural logarithm', 'common logarithm', 'log base', 'change of base', 'laws of logarithms', 'log rules', 'solve exponential equation', 'log2', 'bits', 'slide rule'],
  prereq: ['exponential-functions', 'inverse-functions', 'exponents'],
  related: ['logarithmic-scales', 'number-e', 'scientific-notation', 'exponential-growth-decay', 'derivatives-of-functions', 'physics:sound-intensity', 'physics:entropy'],
  body: `
A **logarithm** answers the question "which power?":
$$\\log_b x = y \\quad\\Longleftrightarrow\\quad b^{y} = x$$
$\\log_2 8 = 3$ because $2^3 = 8$; $\\log_{10} 1000 = 3$; $\\log_{10} 0.01 = -2$; $\\log_5 1 = 0$. The logarithm is the [[inverse-functions|inverse]] of the exponential $b^x$. Its graph is the exponential's mirror image in the line $y = x$: defined only for $x > 0$, passing through $(1, 0)$, growing without limit but very slowly — $\\log_{10}$ of a billion is only 9.

### The laws
Logarithms are exponents, so the laws of [[exponents]] become laws of logarithms (for positive $x$ and $y$):
$$\\log(xy) = \\log x + \\log y, \\qquad \\log\\frac{x}{y} = \\log x - \\log y, \\qquad \\log x^{n} = n\\log x$$
Multiplication becomes addition — the reason logarithms were invented. Before calculators, astronomers and engineers multiplied long numbers by looking up their logarithms in printed tables, adding them, and looking the sum up backwards; a **slide rule** does the same with two sliding logarithmic scales.

### Which base?
- $\\log_{10}$, the **common logarithm**, suits decimal numbers: its whole-number part is the order of magnitude ([[scientific-notation]]). Calculators label it "log".
- $\\ln = \\log_{\\mathrm e}$, the **natural logarithm**, is the one calculus prefers ([[number-e|the number e]]). Calculators label it "ln"; many programming languages call it log.
- $\\log_2$ counts doublings and measures information: choosing one of 1024 possibilities takes $\\log_2 1024 = 10$ bits.

Any base converts to any other:
$$\\log_b x = \\frac{\\ln x}{\\ln b} = \\frac{\\log_{10} x}{\\log_{10} b}$$

### Solving exponential equations
Take logarithms of both sides to bring the unknown down from the exponent. For $2^x = 10$: $x \\ln 2 = \\ln 10$, so $x = \\ln 10 / \\ln 2 = 3.32$. How long does £500 take to become £800 at 4 % a year? $1.04^t = 1.6$, so $t = \\ln 1.6 / \\ln 1.04 = 12.0$ years.

### Logarithms in science
Logarithms squeeze huge ranges into handy numbers: sound levels in decibels ([[physics:sound-intensity|sound intensity]]), acidity as pH, earthquake and star magnitudes ([[logarithmic-scales]]). They undo exponential laws: the time for radioactive decay to reach a level, or the age of a bone from its carbon-14 ([[physics:radiocarbon-dating|radiocarbon dating]]). And they sit inside the laws themselves: the entropy of a system is $S = k_B \\ln W$ ([[physics:entropy|entropy]]).

> [!warn] There is no law for $\\log(x + y)$. Logarithms turn products into sums, not sums into anything simpler.
`,
  ideas: [
    '$\\log_b x$ is the power to which $b$ must be raised to give $x$.',
    'Logarithms turn products into sums, quotients into differences and powers into multiples.',
    'Change of base: $\\log_b x = \\ln x / \\ln b$.',
    'Taking logarithms solves equations with the unknown in an exponent.'
  ],
  pitfalls: [
    '$\\log(x + y) = \\log x + \\log y$ — The law is for products: $\\log(xy) = \\log x + \\log y$. $\\log(1 + 1) = 0.301$, not 0.',
    '$\\dfrac{\\log x}{\\log y} = \\log\\dfrac{x}{y}$ — A quotient of logs is a change of base, $\\log_y x$; the log of a quotient is a difference of logs.',
    'Pressing log when the formula means ln — On calculators "log" is base 10 and "ln" is base e; they differ by a factor of 2.303.'
  ],
  derivation: {
    title: 'The product law and the change of base',
    steps: [
      { text: 'Name the logarithms: let $p = \\log_b x$ and $q = \\log_b y$, so that', tex: 'x = b^{p}, \\qquad y = b^{q}' },
      { text: 'Multiply, using the law of exponents:', tex: 'xy = b^{p} b^{q} = b^{p + q}' },
      { text: 'By definition the logarithm of $xy$ is that exponent:', tex: '\\log_b (xy) = p + q = \\log_b x + \\log_b y' },
      { text: 'For the change of base, let $y = \\log_b x$, so $b^y = x$. Take natural logarithms of both sides, using the power law:', tex: 'y \\ln b = \\ln x \\;\\Rightarrow\\; \\log_b x = \\frac{\\ln x}{\\ln b}' }
    ]
  },
  formulas: [
    {
      name: 'Logarithm to any base',
      expr: 'x = log(y)/log(b)', tex: 'x = \\log_b y = \\frac{\\log y}{\\log b}',
      vars: {
        x: { name: 'the logarithm (the power)', signed: true },
        y: { name: 'the number', value: 1000 },
        b: { name: 'the base', value: 2 }
      },
      note: 'Solving for $y$ gives back the exponential, $y = b^x$; solving for $b$ finds the base that gives $y$ after $x$ steps.',
      stories: { x: 'To what power must {b} be raised to give {y}?' }
    },
    {
      name: 'Bits needed to choose among N possibilities',
      expr: 'n = log2(N)', tex: 'n = \\log_2 N',
      vars: {
        n: { name: 'number of bits (doublings)' },
        N: { name: 'number of possibilities', value: 1024 }
      },
      stories: { n: 'How many yes/no questions are needed to pick one item out of {N}?' }
    },
    {
      name: 'Time to reach a target at a fixed growth rate',
      expr: 't = ln(A/P)/ln(1 + r)', tex: 't = \\frac{\\ln (A/P)}{\\ln (1 + r)}',
      vars: {
        t: { name: 'number of periods' },
        A: { name: 'target amount', value: 800 },
        P: { name: 'starting amount', value: 500 },
        r: { name: 'growth rate per period', q: 'ratio', unit: '%', value: 4 }
      },
      stories: { t: 'How many years does it take {P} pounds to grow to {A} pounds at {r} a year?' }
    }
  ],
  examples: [
    {
      title: 'Logarithms without a calculator',
      q: 'Evaluate $\\log_2 32$, $\\log_{10} 0.001$, $\\log_9 3$ and $\\log_4 8$.',
      steps: [
        '$2^5 = 32$, so $\\log_2 32 = 5$. $10^{-3} = 0.001$, so $\\log_{10} 0.001 = -3$.',
        '$9^{1/2} = 3$, so $\\log_9 3 = \\tfrac12$.',
        '$4^{3/2} = (\\sqrt4)^3 = 8$, so $\\log_4 8 = \\tfrac32$.'
      ],
      a: '5, −3, 1/2 and 3/2'
    },
    {
      title: 'Combining logarithms',
      q: 'Write $2\\log x + \\log 5 - \\log 10$ as a single logarithm.',
      steps: [
        'Power law: $2\\log x = \\log x^2$.',
        'Product and quotient laws: $\\log x^2 + \\log 5 - \\log 10 = \\log\\dfrac{5x^2}{10}$.'
      ],
      a: '$\\log\\dfrac{x^2}{2}$'
    },
    {
      title: 'An exponential equation',
      q: 'Solve $5 \\cdot 3^{2x} = 200$.',
      steps: [
        'Divide by 5: $3^{2x} = 40$.',
        'Take natural logarithms: $2x \\ln 3 = \\ln 40$.',
        '$x = \\dfrac{\\ln 40}{2 \\ln 3} = \\dfrac{3.689}{2.197} = 1.679$.',
        'Check: $3^{3.358} = 40.0$.'
      ],
      a: '$x \\approx 1.679$'
    }
  ],
  quiz: [
    { q: 'Evaluate $\\log_2 32$.', answer: '5', vars: [],
      why: '$2^5 = 32$.' },
    { q: 'Write $\\ln x - \\ln y$ as a single logarithm. (Type it as ln(...).)', answer: 'ln(x/y)', vars: ['x', 'y'],
      why: 'A difference of logarithms is the logarithm of a quotient.' },
    { q: '$\\log(a + b)$ equals…', choices: ['$\\log a + \\log b$', '$\\log a \\cdot \\log b$', '$\\log(ab)$', 'none of these, in general'], a: 3,
      why: 'There is no law for the logarithm of a sum. $\\log a + \\log b$ is $\\log(ab)$, which is a different thing.' },
    { q: 'Solve $10^x = 500$.', choices: ['$x = 50$', '$x \\approx 2.70$', '$x = 5.0$', '$x = 0.2$'], a: 1,
      why: '$x = \\log_{10} 500 = \\log 5 + \\log 100 = 0.699 + 2 = 2.699$.' },
    { q: '$\\ln 0$ is a large negative number.', a: false,
      why: 'No power of e gives 0, so $\\ln 0$ is not defined. As $x$ shrinks towards 0, $\\ln x$ heads to $-\\infty$ without ever getting there.' }
  ],
  problems: [
    { q: 'How many years does it take money to triple at 5 % a year, compounded yearly?', answer: 22.52, unit: 'yr',
      steps: ['$1.05^t = 3$', '$t = \\dfrac{\\ln 3}{\\ln 1.05} = \\dfrac{1.0986}{0.04879} = 22.5$ years'] }
  ],
  applications: [
    'Decibels, pH, earthquake and star magnitudes.',
    'Solving for time in growth and decay problems; radiometric dating.',
    'Information theory (bits) and the complexity of algorithms ($\\log n$ steps for a binary search).',
    'Slide rules and log tables, which made large calculations practical for three centuries.'
  ],
  history: 'John Napier published the first logarithm tables in 1614 to speed up astronomical calculation. Henry Briggs reworked them to base 10, and within a decade Edmund Gunter and William Oughtred had turned logarithms into the slide rule, which engineers used until pocket calculators arrived in the 1970s.',
  sim: 'alg-log-mirror'
},

{
  id: 'exponential-growth-decay', parent: 'exp-log', title: 'Exponential growth and decay', level: 2,
  short: 'When a quantity changes at a rate proportional to itself it follows N₀eᵏᵗ: fixed doubling times or half-lives, time constants, and straight lines on semi-log paper.',
  keywords: ['exponential growth', 'exponential decay', 'half-life', 'doubling time', 'rate constant', 'time constant', 'rule of 70', 'rule of 72', 'decay constant', 'semi-log plot', 'N0 e^kt'],
  prereq: ['exponential-functions', 'number-e', 'logarithms'],
  related: ['exponential-models', 'separable-equations', 'logistic-equation', 'logarithmic-scales', 'physics:half-life', 'physics:radiocarbon-dating', 'physics:rc-circuits', 'physics:newtons-law-of-cooling', 'physics:activity'],
  body: `
When a quantity changes at a rate proportional to its own size, it grows or decays exponentially:
$$N(t) = N_0\\, \\mathrm{e}^{kt}$$
$N_0$ is the amount at $t = 0$ and $k$ the **rate constant**, positive for growth and negative for decay. A colony with twice as many bacteria produces twice as many new cells per minute; a sample with twice as many radioactive nuclei has twice as many decays per second. "Rate proportional to amount" is the differential equation $dN/dt = kN$, and $\\mathrm{e}^{kt}$ is its solution ([[exponential-models|exponential models]]).

### Doubling time and half-life
The signature of exponential change is a fixed time for a fixed factor. Growth doubles every
$$T_2 = \\frac{\\ln 2}{k} \\approx \\frac{0.693}{k}$$
and decay halves every **half-life** $T_{1/2} = \\ln 2/|k|$, whatever the amount at the start. So the decay law can equally be written
$$N = N_0 \\left(\\tfrac12\\right)^{t/T_{1/2}}$$
After one half-life $\\tfrac12$ is left, after two $\\tfrac14$, after three $\\tfrac18$, after ten about a thousandth. Carbon-14 has a half-life of 5730 years, which is why [[physics:radiocarbon-dating|radiocarbon dating]] reaches back about 50 000 years ([[physics:half-life|decay law and half-life]]).

### Percentage rates and the rule of 70
Growth of $p$ % per year means $N = N_0(1 + p/100)^t$, the same as $\\mathrm{e}^{kt}$ with $k = \\ln(1 + p/100)$, slightly less than $p/100$. The doubling time is then close to $70/p$ years: 7 % a year doubles in about 10 years, 2 % in about 35. (70 is roughly $100\\ln 2 = 69.3$; bankers often use 72 because it divides evenly by more numbers.)

### Time constants
Engineers usually write decay as $\\mathrm{e}^{-t/\\tau}$ with the **time constant** $\\tau = 1/|k|$. After one time constant 37 % remains — 63 % has gone. After $5\\tau$ less than 1 % remains, and a capacitor is usually treated as fully discharged ([[physics:rc-circuits|RC circuits]]). In [[physics:newtons-law-of-cooling|Newton's law of cooling]] it is the *difference* from room temperature that decays this way.

### Straight on semi-log paper
Taking logarithms, $\\ln N = \\ln N_0 + kt$. With a logarithmic $N$-axis, exponential data fall on a straight line whose slope is $k$ ([[logarithmic-scales|logarithmic scales]]) — the standard test for exponential behaviour in a laboratory.

### Nothing grows exponentially for ever
Food, space and money run out. Real growth slows as it nears a limit and follows the S-shaped [[logistic-equation|logistic curve]], exponential at first and then levelling off. Decay has a limit of its own: when only a few nuclei are left, the smooth curve dissolves into the statistics of individual random events.
`,
  ideas: [
    'A rate proportional to the amount gives $N = N_0\\mathrm{e}^{kt}$: growth for $k > 0$, decay for $k < 0$.',
    'Equal times give equal factors: a fixed doubling time $\\ln 2/k$ or half-life $\\ln 2/|k|$.',
    'Growth of $p$ % per period doubles in about $70/p$ periods.',
    'On a logarithmic vertical axis, exponential data lie on a straight line of slope $k$.'
  ],
  pitfalls: [
    'After two half-lives nothing is left — Two half-lives leave a quarter; decay halves what remains each time.',
    'The same amount is lost every hour — The same *fraction* is lost; the amount lost shrinks as the quantity shrinks.',
    'Using $k$ in "per year" with $t$ in months — $kt$ must be a pure number; the units of $k$ and $t$ must match.'
  ],
  formulas: [
    {
      name: 'Exponential change',
      expr: 'N = N0*exp(k*t)', tex: 'N = N_0\\,\\mathrm{e}^{kt}',
      vars: {
        N: { name: 'amount at time t' },
        N0: { name: 'amount at t = 0', value: 1000 },
        k: { name: 'rate constant (negative for decay), per unit time', value: -0.1, signed: true },
        t: { name: 'time', value: 10 }
      },
      note: 'With $k = -0.1$ and $t = 10$ exactly one time constant has passed: $N = N_0/\\mathrm{e}$.'
    },
    {
      name: 'Decay with a half-life',
      expr: 'N = N0*0.5^(t/T)', tex: 'N = N_0 \\left(\\tfrac12\\right)^{t/T}', solveFor: 't',
      vars: {
        N: { name: 'amount left', value: 25 },
        N0: { name: 'starting amount', value: 100 },
        t: { name: 'time elapsed' },
        T: { name: 'half-life', value: 5730 }
      },
      stories: {
        t: 'A sample starts with {N0} g of a radioactive isotope whose half-life is {T} years. How many years until only {N} g is left?',
        N: 'A sample holds {N0} g of an isotope with a half-life of {T} days. How much is left after {t} days?'
      }
    },
    {
      name: 'Doubling time at p % per period',
      expr: 'T = ln(2)/ln(1 + p/100)', tex: 'T = \\frac{\\ln 2}{\\ln\\left(1 + \\frac{p}{100}\\right)}',
      vars: {
        T: { name: 'doubling time, in periods' },
        p: { name: 'growth per period, in %', value: 7 }
      },
      note: 'Compare with the rule of 70: $70/p$.',
      stories: { T: 'An economy grows by {p} per cent a year. How many years does it take to double?' }
    }
  ],
  examples: [
    {
      title: 'Radiocarbon age',
      q: 'A piece of charcoal has 20 % of the carbon-14 found in living wood. Half-life 5730 years: how old is it?',
      steps: [
        '$0.20 = \\left(\\tfrac12\\right)^{t/5730}$.',
        'Take logarithms: $\\dfrac{t}{5730} = \\dfrac{\\ln 0.20}{\\ln 0.5} = \\dfrac{-1.609}{-0.693} = 2.32$.',
        '$t = 2.32 \\times 5730 = 13\\,300$ years.'
      ],
      a: 'About 13 300 years'
    },
    {
      title: 'Bacteria in a warm kitchen',
      q: '200 bacteria double every 30 minutes. How many are there after 4 hours, and what is the rate constant $k$?',
      steps: [
        '4 hours is 8 doublings: $200 \\times 2^8 = 51\\,200$.',
        '$k = \\ln 2 / T_2 = 0.693 / 0.5\\ \\mathrm{h} = 1.39$ per hour; check: $200\\,\\mathrm{e}^{1.386 \\times 4} = 200\\,\\mathrm{e}^{5.545} = 51\\,200$.'
      ],
      a: '51 200 bacteria; $k \\approx 1.39\\ \\mathrm{h}^{-1}$'
    },
    {
      title: 'Half-life from two measurements',
      q: 'A drug\'s concentration in blood is 12 mg/L one hour after a dose and 3 mg/L five hours after. Assuming exponential decay, find the half-life and the starting concentration.',
      steps: [
        'In 4 hours it fell by a factor of 4 = two halvings, so the half-life is 2 hours.',
        '$k = -\\ln 2 / 2 = -0.347\\ \\mathrm{h}^{-1}$.',
        'Back one hour from 12 mg/L: $C_0 = 12 \\times 2^{1/2} = 17.0$ mg/L.'
      ],
      a: 'Half-life 2 h; about 17 mg/L at the start'
    }
  ],
  quiz: [
    { q: 'After 3 half-lives, the fraction of a radioactive sample left is…', choices: ['1/3', '1/6', '1/8', '1/9'], a: 2,
      why: '$\\left(\\tfrac12\\right)^3 = \\tfrac18$.' },
    { q: 'An investment grows 7 % a year. It doubles in roughly…', choices: ['7 years', '10 years', '14 years', '70 years'], a: 1,
      why: 'Rule of 70: $70/7 = 10$. Exactly, $\\ln 2/\\ln 1.07 = 10.2$ years.' },
    { q: 'Solve $N = N_0\\,\\mathrm{e}^{kt}$ for $t$.', answer: 'ln(N/N0)/k', vars: ['N', 'N0', 'k'],
      why: 'Divide by $N_0$, take natural logarithms, divide by $k$: $t = \\ln(N/N_0)/k$.' },
    { q: 'In exponential decay the amount lost each hour stays the same.', a: false,
      why: 'The same fraction is lost each hour. As the quantity shrinks, so does the amount that fraction represents.' },
    { q: 'A capacitor discharges with a time constant of 2 s. After 10 s its voltage is…', choices: ['exactly zero', 'less than 1 % of the start', 'about 20 % of the start', 'about 37 % of the start'], a: 1,
      why: '10 s is five time constants: $\\mathrm{e}^{-5} = 0.0067$. Exponential decay never reaches zero exactly.' }
  ],
  problems: [
    { q: 'Iodine-131, used in medicine, has a half-life of 8.0 days. What percentage of a dose remains after 30 days?', answer: 7.43, tol: 0.02,
      steps: ['$\\left(\\tfrac12\\right)^{30/8} = 0.5^{3.75}$', '$= 0.0743$, that is 7.4 %'] }
  ],
  applications: [
    'Radioactive decay, radiometric dating and nuclear medicine.',
    'Charging and discharging capacitors; current in inductors.',
    'Drug elimination and dosing intervals in pharmacology.',
    'Early population growth, epidemics and compound interest.'
  ],
  sim: 'alg-compound'
},

{
  id: 'logarithmic-scales', parent: 'exp-log', title: 'Logarithmic scales', level: 2,
  short: 'Scales on which equal steps are equal ratios: decibels, pH, magnitudes and octaves, and log graphs that turn exponentials and power laws into straight lines.',
  keywords: ['logarithmic scale', 'log scale', 'decibel', 'dB', 'pH', 'Richter', 'magnitude', 'octave', 'semi-log', 'log-log', 'orders of magnitude', 'decade'],
  prereq: ['logarithms', 'scientific-notation'],
  related: ['power-functions', 'exponential-growth-decay', 'physics:sound-intensity', 'physics:stellar-magnitude', 'physics:em-spectrum', 'physics:musical-scales'],
  body: `
On an ordinary ruler equal distances mean equal **differences**: 1 to 2 is as long as 101 to 102. On a **logarithmic scale** equal distances mean equal **ratios**: 1 to 10 is as long as 10 to 100 or 1000 to 10 000. Each step multiplies. One scale can then show a range of billions — and it matches the way our senses work.

### Why use one
- **Huge ranges.** The electromagnetic spectrum runs from radio waves kilometres long to gamma rays of $10^{-12}$ m and less ([[physics:em-spectrum|the electromagnetic spectrum]]); on a linear axis everything but the longest waves would be crushed into a dot.
- **Ratios matter more than differences.** A rise from 10 to 20 and one from 1000 to 2000 are both doublings, and on a log scale they look alike.
- **Straight lines from curves.** Exponentials become straight lines on semi-log axes and power laws on log–log axes ([[exponential-growth-decay|exponential growth and decay]], [[power-functions|power functions]]).

### Decibels
The intensity of sound spans a factor of $10^{12}$ between the faintest sound you can hear and the threshold of pain. The **sound level** in decibels compresses that:
$$L = 10 \\log_{10}\\frac{I}{I_0}\\ \\mathrm{dB}, \\qquad I_0 = 10^{-12}\\ \\mathrm{W/m^2}$$
Every 10 dB is a factor of 10 in intensity, and 3 dB is almost exactly a factor of 2 ($10\\log_{10} 2 = 3.01$). A 90 dB workshop is ten times as intense as an 80 dB street ([[physics:sound-intensity|sound intensity and decibels]]). Engineers use decibels for any ratio of powers: amplifier gain, losses in cables and optical fibres, noise.

### pH, magnitudes and octaves
- **pH** $= -\\log_{10}[\\mathrm{H^+}]$, with the concentration in mol/L. Pure water has $10^{-7}$ mol/L, pH 7; lemon juice is about pH 2, a hundred thousand times more acidic.
- **Earthquake magnitudes**: each step of 1 releases about 32 times more energy ($10^{1.5}$), so a magnitude-7 earthquake releases about a thousand times the energy of a magnitude 5.
- **Star magnitudes** run backwards: 5 magnitudes brighter is exactly 100 times the light, so one magnitude is a factor $100^{1/5} \\approx 2.512$ ([[physics:stellar-magnitude|luminosity and magnitude]]).
- **Musical pitch**: an octave doubles the frequency, and each of the 12 equal-tempered semitones multiplies it by $2^{1/12} \\approx 1.0595$ ([[physics:musical-scales|musical scales]]).

### Reading a log axis
Between 1 and 10 the gridlines bunch up towards the right, at 2, 3, …, 9; the 2 sits 30 % of the way along ($\\log 2 = 0.301$) and the 5 about 70 %. There is no zero on a log axis — zero is infinitely far away — and negative numbers cannot be shown at all. Each factor of 10 is called a **decade**. To read the exponent of a power law from a log–log plot, count decades up and divide by decades across.

> [!key] Linear scales add; logarithmic scales multiply. Our ears and eyes respond roughly logarithmically, which is why decibels and magnitudes feel natural.
`,
  ideas: [
    'On a logarithmic scale equal distances are equal ratios; each decade is a factor of 10.',
    'Decibels: $10\\log_{10}$ of a power ratio; +10 dB is ×10 and +3 dB is ×2.',
    'pH, earthquake and star magnitudes, and musical intervals are logarithmic scales.',
    'Semi-log plots straighten exponentials; log–log plots straighten power laws.'
  ],
  pitfalls: [
    'Twice the decibels means twice as loud — 80 dB is 10⁴ times the intensity of 40 dB. Decibels add when intensities multiply.',
    'pH 4 is twice as acidic as pH 8 — Each pH unit is a factor of 10, so it is $10^4$ times more acidic.',
    'Reading a log-axis gridline halfway between 1 and 10 as 5.5 — Halfway is $\\sqrt{10} \\approx 3.16$.'
  ],
  formulas: [
    {
      name: 'Level difference in decibels',
      expr: 'L = 10*log(P2/P1)', tex: 'L = 10\\log_{10}\\frac{P_2}{P_1}',
      vars: {
        L: { name: 'level difference, in dB', signed: true },
        P2: { name: 'power (or intensity) compared', value: 100 },
        P1: { name: 'reference power (or intensity)', value: 1 }
      },
      note: 'Positive for gain, negative for loss. For sound levels, $P_1 = I_0 = 10^{-12}\\ \\mathrm{W/m^2}$.',
      stories: {
        L: 'An amplifier turns {P1} W of input into {P2} W of output. What is its gain in decibels?',
        P2: 'A signal of {P1} mW passes through a cable with a gain of {L} dB. How many mW come out?'
      }
    },
    {
      name: 'pH',
      expr: 'pH = -log(c)', tex: '\\mathrm{pH} = -\\log_{10} c',
      vars: {
        pH: { name: 'pH' },
        c: { name: 'hydrogen-ion concentration, in mol/L', value: 1e-7 }
      },
      stories: { pH: 'A solution has a hydrogen-ion concentration of {c} mol/L. What is its pH?', c: 'What hydrogen-ion concentration (mol/L) does a pH of {pH} mean?' }
    },
    {
      name: 'Difference of two star magnitudes',
      expr: 'm2 - m1 = 2.5*log(F1/F2)', tex: 'm_2 - m_1 = 2.5\\log_{10}\\frac{F_1}{F_2}', solveFor: 'm2',
      vars: {
        m2: { name: 'magnitude of the fainter star', signed: true },
        m1: { name: 'magnitude of the brighter star', value: 1, signed: true },
        F1: { name: 'light received from the brighter star', value: 100 },
        F2: { name: 'light received from the fainter star', value: 1 }
      },
      note: 'Larger magnitudes are fainter; a flux ratio of 100 is exactly 5 magnitudes.'
    }
  ],
  examples: [
    {
      title: 'Adding noisy machines',
      q: 'One machine produces 80 dB. What level do two identical machines produce? And ten?',
      steps: [
        'Intensities add: two machines give twice the intensity, $+10\\log_{10} 2 = +3$ dB, so 83 dB.',
        'Ten machines give ten times the intensity: +10 dB, so 90 dB.',
        'Decibels themselves never add directly: 80 dB + 80 dB is not 160 dB.'
      ],
      a: '83 dB and 90 dB'
    },
    {
      title: 'The pH of a solution',
      q: 'A solution has $[\\mathrm{H^+}] = 3.2 \\times 10^{-5}$ mol/L. What is its pH?',
      steps: [
        '$\\log_{10}(3.2 \\times 10^{-5}) = \\log_{10} 3.2 - 5 = 0.505 - 5 = -4.495$.',
        'pH $= 4.49$: acidic, between black coffee and tomato juice.'
      ],
      a: 'pH ≈ 4.5'
    },
    {
      title: 'An exponent from a log–log plot',
      q: 'On log–log axes, data pass through $(1, 3)$ and $(100, 30\\,000)$ in a straight line. Find the power law.',
      steps: [
        'Decades up: $\\log_{10}(30\\,000/3) = \\log_{10} 10^4 = 4$. Decades across: $\\log_{10} 100 = 2$.',
        'Slope $p = 4/2 = 2$, and at $x = 1$, $y = 3$, so $k = 3$.'
      ],
      a: '$y = 3x^2$'
    }
  ],
  quiz: [
    { q: 'Raising a sound level by 20 dB multiplies its intensity by…', choices: ['2', '20', '100', '200'], a: 2,
      why: 'Each 10 dB is a factor of 10, so 20 dB is $10^2 = 100$.' },
    { q: 'Lemon juice has pH 2 and tomato juice pH 4. Lemon juice has how many times the hydrogen-ion concentration?', choices: ['2', '2.5', '100', '10 000'], a: 2,
      why: 'Two pH units are two factors of 10.' },
    { q: 'What is the pH of a solution with $[\\mathrm{H^+}] = 10^{-9}$ mol/L?', answer: '9', vars: [],
      why: '$-\\log_{10} 10^{-9} = 9$ — an alkaline solution.' },
    { q: 'Zero can be marked on a logarithmic axis.', a: false,
      why: 'Each decade down divides by 10: 1, 0.1, 0.01, … never reaching zero. Zero lies infinitely far down the axis.' },
    { q: 'On a log–log plot, measurements lie along a straight line of slope −2. The quantity is…', choices: ['decreasing exponentially', 'inversely proportional to the square of $x$', 'proportional to $x^2$', 'constant'], a: 1,
      why: 'A straight line on log–log axes is a power law $y = kx^p$ with $p$ the slope: $y \\propto x^{-2}$.' }
  ],
  problems: [
    { q: 'A rock concert reaches 110 dB and quiet conversation is 60 dB. How many times more intense is the sound at the concert?', answer: 1e5,
      steps: ['The difference is 50 dB.', '$10^{50/10} = 10^5$: a hundred thousand times.'] }
  ],
  applications: [
    'Sound levels, amplifier gains and signal losses in decibels.',
    'Acidity (pH), earthquake magnitudes and star magnitudes.',
    'Frequency axes of audio and filter plots (Bode plots); musical pitch.',
    'Charts of data spanning many orders of magnitude, from the spectrum to the sizes of things in the universe.'
  ],
  sim: { id: 'alg-growth-race', params: { axes: 'semilog' } }
}

);
