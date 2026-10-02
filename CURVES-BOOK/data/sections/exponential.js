/* Curves Workshop · data/sections/exponential.js — Exponential Curves (pages 93–97) */
Curves.section({
  id: 'exponential',
  title: 'Exponential Curves',
  pages: [93, 97],
  history: 'The number e comes down from Napier and the year 1614, when it entered his logarithms, oddly enough before exponents were properly understood. The idea of a normally distributed variable began with De Moivre in 1733, a letter written while he lived in England as an exile from France and made his living by advising gamblers on games of chance. The approach through the binomial expansion, due to the Bernoullis, appeared after Jacob Bernoulli\'s death, in 1713.',
  description: 'The number $e \\approx 2.718281$ is the natural base of the exponential curves $y = c\\,e^{kx}$. It can be defined as the limit of $(1 + 1/x)^x$ as $x \\to \\infty$, as the limit of $(1 + x)^{1/x}$ as $x \\to 0$, or as the sum of the series of reciprocal factorials; the graphs of both limit expressions are drawn in Fig. 86 (a, b), each with an open point where the expression is not defined. Exponentials describe growth and decay in which the rate of change is proportional to the quantity present (Fig. 87a shows the limited-growth, or logistic, form), and the bell-shaped probability curve $y = e^{-x^2/2}$ (Fig. 87b), whose area is $\\sqrt{\\pi}$ for the form $e^{-x^2}$. A shot-board, a funnel of nails over a row of bins (Fig. 88), makes the binomial law, and with it the normal curve, visible.',
  equations: [
    { tex: 'e = \\lim_{x\\to\\infty}\\left(1 + \\tfrac{1}{x}\\right)^{x} = \\lim_{x\\to 0}(1 + x)^{1/x} = \\sum_{k=0}^{\\infty}\\frac{1}{k!} \\approx 2.718281', note: 'definitions of e (the last is the series of e^x at x = 1)' },
    { tex: 'S_k = \\left(1 + \\tfrac{1}{k}\\right)^{k} = 1 + 1 + \\frac{k(k-1)}{2!}\\cdot\\frac{1}{k^2} + \\frac{k(k-1)(k-2)}{3!}\\cdot\\frac{1}{k^3} + \\cdots + \\frac{1}{k^k}', note: 'one dollar at 100% interest compounded k times a year, after one year' },
    { tex: '\\lim_{k\\to\\infty} S_k = \\lim_{k\\to\\infty}\\left(1 + \\tfrac{1}{k}\\right)^{k} = e \\approx \\$2.72', note: 'compounded continuously' },
    { tex: 'e^{ix} = \\cos x + i\\sin x, \\qquad e^{i\\pi} + 1 = 0, \\qquad e^{i\\pi/2} = i', note: 'the Euler form and two of its consequences' },
    { tex: '(\\sqrt{-1})^{\\sqrt{-1}} = \\left(e^{i\\pi/2}\\right)^{i} = e^{-\\pi/2} \\approx 0.208', note: 'a real value for i^i' },
    { tex: '\\frac{dx}{dt} = kx, \\qquad x = c\\,e^{kt}', note: 'law of growth (k > 0) or decay (k < 0)' },
    { tex: '\\frac{dx}{dt} = k\\,x\\,(n - x), \\qquad x = \\frac{c\\,n}{c + e^{-nkt}}', note: 'growth limited by the maximum population n' },
    { tex: '\\frac{dx}{dt} = f(t)\\,x\\,(n - x), \\qquad x = \\frac{c\\,n}{c + e^{-n\\int f\\,dt}}', note: 'the general form with a function f(t), perhaps periodic (Fig. 87a)' },
    { tex: 'x = \\dfrac{1}{a + b\\,e^{-t}}', note: 'the logistic curve drawn in Fig. 87a; it tends to 1/a, equals 1/(a + b) at t = 0, and has its flex at t = ln(b/a), x = 1/(2a)' },
    { tex: 'a = \\ddot{s} = \\dot{v} = -k^2 v, \\qquad v = v_0 e^{-k^2 t}, \\qquad s = \\frac{v_0}{k^2}\\left(1 - e^{-k^2 t}\\right)', note: 'resistance of water or air proportional to the velocity (the book prints the factor v₀/k in front of s; integrating v gives v₀/k²)' },
    { tex: 'y = e^{-x^2/2}', note: 'the probability (normal, Gaussian) curve, Fig. 87b' },
    { tex: 'y = \\frac{n}{\\sigma\\sqrt{2\\pi}}\\,e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}', note: 'the normal curve in full: n the size of the population, μ the mean, σ the standard deviation' },
    { tex: 'y = k\\,e^{-x^2/2\\sigma^2}', note: 'the same, with the centre moved to the origin and the constants collected' },
    { tex: '\\Gamma(n) = \\int_0^{\\infty} z^{\\,n-1}e^{-z}\\,dz = 2\\int_0^{\\infty} x^{2n-1}e^{-x^2}\\,dx \\quad (z = x^2)', note: 'the gamma function' },
    { tex: '\\Gamma\\!\\left(\\tfrac12\\right) = 2\\int_0^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}', note: 'the area under y = e^{−x²} over the whole line' }
  ],
  metrical: [
    { tex: 'y\' = -xy, \\qquad y\'\' = y\\,(x^2 - 1)', note: 'for y = e^{−x²/2}' },
    { tex: '\\left(\\pm 1,\\; e^{-1/2}\\right)', note: 'the flex points of y = e^{−x²/2}' },
    { tex: '\\left(\\pm\\sigma,\\; k\\,e^{-1/2}\\right) = (\\pm\\sigma,\\; y_0)', note: 'the flex points of y = k e^{−x²/2σ²}' },
    { tex: 'y - y_0 = \\mp\\frac{y_0}{\\sigma}\\,(x \\mp \\sigma)', note: 'the flex tangents at (±σ, y₀) (the book writes the second sign the other way round); they meet the x-axis at ±2σ whatever unit is chosen on the y-axis' },
    { tex: 'A = xy = -y\'', note: 'area of a rectangle inscribed with one side on the x-axis, for y = e^{−x²/2}; it is largest when y″ = 0, i.e. with two corners at the flex points' }
  ],
  items: [
    { label: '2a', text: 'Compound interest: one dollar at 100% a year, compounded $k$ times a year, becomes $(1 + 1/k)^k$ dollars; as $k$ grows without bound, the interest is compounded continuously and the total tends to $e$, about 2.72 dollars.' },
    { label: '2b', text: 'The Euler form $e^{ix} = \\cos x + i\\sin x$ gives the beautiful relations $e^{i\\pi} + 1 = 0$ and $e^{i\\pi/2} = i$; from the second, $i^i = (e^{i\\pi/2})^i = e^{-\\pi/2} \\approx 0.208$, a real number (see [[trigonometric]] and [[hyperbolic]]).' },
    { label: '3a', text: 'The law of growth (or decay) is a product of experience: in an ideal state, without disease, war or famine, many natural populations increase at a rate proportional to their size, $dx/dt = kx$, so that $x = c\\,e^{kt}$. It governs controlled bacteria cultures, the decomposition and conversion of chemical substances (radium, sugar), accumulating interest, some electrical circuits, and the history of colonies such as fruit flies and people.' },
    { label: '3b', text: 'A further hypothesis lets the rate vanish as the population reaches a ceiling $n$ fixed by the food supply: $dx/dt = kx(n - x)$. This gives the S-shaped logistic curve $x = cn/(c + e^{-nkt})$, which tends to the level $n$; a function $f(t)$, perhaps periodic, may stand in place of the constant $k$ to fit observations (Fig. 87a).' },
    { label: '3c', text: 'At moderate speeds the resistance of water to a ship, or of air to a car or a parachute, is roughly proportional to the velocity; then $\\dot v = -k^2 v$ and the velocity dies away exponentially.' },
    { label: '4a', text: 'The flex points of the probability curve $y = e^{-x^2/2}$ are at $x = \\pm 1$ because $y\'\' = y(x^2 - 1)$. An inscribed rectangle with one side on the x-axis has the area $xy = -y\'$, so the largest such rectangle is the one with $y\'\' = 0$: two of its corners are the flex points.' },
    { label: '4b', text: 'The area under $e^{-x^2}$ is found from the gamma function: with $z = x^2$ one gets $\\Gamma(\\tfrac12) = 2\\int_0^\\infty e^{-x^2}dx = \\sqrt\\pi$. In its general form the normal curve has the size $n$ of the population as a factor, the mean $\\mu$ as the position of the top and the standard deviation $\\sigma$ as the distance from the top to the flex points.' },
    { label: '4c', text: 'The flex tangents of the normal curve meet the x-axis at the points $\\pm 2\\sigma$ from the centre, whichever unit is used on the y-axis, so the width of the curve can be read off the graph without knowing the height scale.' },
    { label: '5', text: 'The "slot machine" (Fig. 88) sends a stream of shot through rows of nails into bins. The numbers of shot in the bins follow the coefficients of a binomial expansion, so the heap forms a histogram that approximates the normal curve.' }
  ],
  constructions: [
    { fig: 'fig-087b', title: 'The probability curve with its flex points and inscribed rectangle', level: 1 },
    { fig: 'fig-087a', title: 'The logistic curve of limited growth', level: 2 },
    { fig: 'fig-086a', title: 'The graph of (1 + 1/x)^x with its asymptotes', level: 2 },
    { fig: 'fig-086b', title: 'The graph of (1 + x)^(1/x) with its asymptotes', level: 2 },
    { fig: 'fig-088', title: 'The shot-board and its binomial histogram', level: 3 }
  ],
  note: 'The figures of this section are graphs and a mechanical sketch, not ruler-and-compass constructions, so the "constructions" are graph-plotting exercises: each curve is drawn point by point from its equation with the pencil, after its asymptotes have been ruled in.',
  bibliography: [
    'Kenney, J. F.: Mathematics of Statistics, Van Nostrand II (1941) 7 ff.',
    'Rietz, H. L.: Mathematical Statistics, Open Court (1926).',
    'Steinhaus, H.: Mathematical Snapshots, Stechert (1938) 120.'
  ],
  seeAlso: ['hyperbolic', 'trigonometric', 'catenary', 'sketching', 'discontinuous']
});
