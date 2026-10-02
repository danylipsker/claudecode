/* Curves Workshop · data/sections/discontinuous.js — Functions with Discontinuous Properties (pages 100–107) */
Curves.section({
  id: 'discontinuous',
  title: 'Functions with Discontinuous Properties',
  pages: [100, 107],
  history: 'This section is a small museum of counter-examples: functions that behave unlike the smooth functions one meets first. The "snowflake" procession of Fig. 102 is credited in the book to Boltzmann, who devised it to picture certain theorems in the theory of gases (Mathematische Annalen 50, 1898); the book names Sierpinski for the space-filling curve of Fig. 103 and Weierstrass for the continuous function that has no derivative anywhere.',
  description: 'The ordinary functions of analysis are continuous and have derivatives; the examples here break one rule at a time, and each is a useful counter-example when a statement about "all functions" is tested. A **removable** discontinuity (Figs. 90–93) is a single missing point whose limit exists: giving the function that value mends it. A **non-removable** discontinuity (Figs. 94–98) has unequal one-sided limits, an infinite limit, or no limit at all because the curve oscillates without settling. A function can also be discontinuous at every point of an interval, as $x^x$ and $x^{1/x}$ are for $x < 0$ (Figs. 99, 100), where the points exist only at rational values and are drawn dotted. Finally three limit-processes (Figs. 101–103) produce a path of constant length with no tangent at its corners, the snowflake curve of infinite length and finite area, and a continuous curve that fills a square; the Weierstrass series is a continuous function with no derivative anywhere. In the drawings a missing point is an open circle, the asymptotes and the bounding curves are dashed or thin, and the dotted branches are the points that exist only at some values of $x$.',
  equations: [
    { tex: 'y = \\frac{x^2 - 4}{x - 2} = x + 2 \\quad (x \\neq 2), \\qquad \\lim_{x\\to 2} y = 4', note: 'removable discontinuity, Fig. 90' },
    { tex: 'y = \\frac{x^3 - 1}{x - 1} = x^2 + x + 1 \\quad (x \\neq 1), \\qquad \\lim_{x\\to 1} y = 3', note: 'removable discontinuity, Fig. 91' },
    { tex: 'y = \\frac{\\sin x}{x}, \\qquad \\lim_{x\\to 0} y = 1, \\qquad |y| \\le \\frac{1}{|x|} \\;\\;(xy = \\pm 1)', note: 'removable discontinuity, bounded by the hyperbolas xy = ±1, Fig. 92' },
    { tex: 'y = x\\,\\sin\\frac{1}{x}, \\qquad \\lim_{x\\to 0} y = 0, \\qquad |y| \\le |x| \\;\\;(y = \\pm x)', note: 'removable discontinuity, bounded by the lines y = ±x, Fig. 93' },
    { tex: 'y = \\operatorname{arc\\,tan}\\frac{1}{x}, \\qquad \\lim_{x\\to 0+} y = \\frac{\\pi}{2}, \\qquad \\lim_{x\\to 0-} y = -\\frac{\\pi}{2}', note: 'a jump: finite but different one-sided limits, Fig. 94' },
    { tex: 'y = \\sin\\frac{1}{x}, \\qquad -1 \\le y \\le 1', note: 'no limit as x → 0; every value between −1 and 1 is taken in every neighbourhood of 0; the x-axis is an asymptote, Fig. 95' },
    { tex: 'y = \\lim_{t\\to\\infty}\\frac{(1 + \\sin\\pi x)^t + 1}{(1 + \\sin\\pi x)^t - 1}', note: 'equal to +1 where sin πx > 0 and −1 where sin πx < 0; undefined at x = 0, ±1, ±2, …, Fig. 96' },
    { tex: 'y = 2^{1/x}, \\qquad \\lim_{x\\to 0-} y = 0, \\qquad \\lim_{x\\to 0+} y = \\infty', note: 'unequal one-sided limits, Fig. 97' },
    { tex: 'y = \\frac{1}{2^{1/x} + 1}, \\qquad \\lim_{x\\to 0-} y = 1, \\qquad \\lim_{x\\to 0+} y = 0', note: 'finite but different one-sided limits, Fig. 98' },
    { tex: 'y = x^{x}, \\qquad \\lim_{x\\to 0+} y = 1', note: 'undefined at 0, everywhere discontinuous for x < 0, Fig. 99' },
    { tex: 'y = x^{1/x}, \\qquad \\lim_{x\\to 0+} y = 0', note: 'undefined at 0, everywhere discontinuous for x < 0, Fig. 100' },
    { tex: 'x = K\\cdot\\frac{AB}{2^{n}}, \\qquad K = 1, \\dots, n', note: 'the points, measured from A, where the n-th saw-tooth path has no unique slope, Fig. 101' },
    { tex: 'y = \\sum_{n=0}^{\\infty} b^{\\,n}\\cos\\left(a^{n}\\pi x\\right), \\qquad ab > 1 + \\frac{3\\pi}{2}', note: 'the Weierstrass function (a an odd positive integer, 0 < b < 1): continuous, with no derivative anywhere' }
  ],
  items: [
    { label: '1a', text: 'The quotient $(x^2 - 4)/(x - 2)$ is undefined at $x = 2$ but equals the line $y = x + 2$ at every other point; since the limit is 4, the discontinuity is removable (Fig. 90).' },
    { label: '1b', text: 'The quotient $(x^3 - 1)/(x - 1)$ is the parabola $y = x^2 + x + 1$ with the one point $x = 1$ missing; its limit there is 3 (Fig. 91).' },
    { label: '1c', text: 'The important function $\\sin x / x$ is undefined at $x = 0$ but has the limit 1 there, so it too has a removable discontinuity. The hyperbolas $xy = \\pm 1$ form a bound for the curve (Fig. 92).' },
    { label: '1d', text: 'The function $x\\sin(1/x)$ is undefined at $x = 0$; its limit there is 0, so the discontinuity is removable. The lines $y = \\pm x$ bound the curve (Fig. 93).' },
    { label: '2a', text: '$\\operatorname{arc\\,tan}(1/x)$ is undefined at 0; the right-hand limit is $\\pi/2$ and the left-hand limit $-\\pi/2$. The two limits are finite but different (Fig. 94).' },
    { label: '2b', text: '$\\sin(1/x)$ is undefined at 0, and in every neighbourhood of 0 it takes all values between $-1$ and $1$. The x-axis is an asymptote, and $\\lim \\sin(1/x)$ does not exist (Fig. 95).' },
    { label: '2c', text: 'The limit function of $\\bigl((1 + \\sin\\pi x)^t + 1\\bigr)/\\bigl((1 + \\sin\\pi x)^t - 1\\bigr)$ is discontinuous at the set $x = 0, \\pm 1, \\pm 2, \\ldots$ and has the value $+1$ or $-1$ elsewhere (Fig. 96).' },
    { label: '2d', text: '$2^{1/x}$ is undefined at $x = 0$; the limit from the left is 0 and from the right is infinite, so the one-sided limits differ (Fig. 97).' },
    { label: '2e', text: '$1/(2^{1/x} + 1)$ is undefined at $x = 0$: the limit from the left is 1 and from the right 0, finite but different (Fig. 98).' },
    { label: '3a', text: '$x^x$ is undefined at $x = 0$, but its limit from the right is 1; for $x < 0$ the function is everywhere discontinuous (Fig. 99).' },
    { label: '3b', text: '$x^{1/x}$ is undefined at $x = 0$, its limit from the right is 0, and it is everywhere discontinuous for $x < 0$ (Fig. 100).' },
    { label: '3c', text: 'Halve the sides $AC$ and $CB$ of the isosceles triangle $ABC$ and continue as shown (Fig. 101): the saw-tooth path from $A$ to $B$ is continuous and has constant length. The $n$-th path of the sequence has no unique slope at the points whose distances from $A$ are $K\\cdot AB/2^n$, $K = 1, \\ldots, n$.' },
    { label: '3d', text: 'The "snowflake" (von Koch) curve is the limit of the procession of Fig. 102: trisect each side of the equilateral triangle, discard the middle segment and build on it an external equilateral triangle, and repeat on every side. The limiting curve has a finite area, an infinite length, and no derivative anywhere; finding its length and area makes good exercises in numerical series.' },
    { label: '3e', text: 'The Sierpinski "space-filling" curve is the limit of the procession of Fig. 103. It has a finite area, an infinite length, no derivative anywhere, and it passes through every point within the original square.' },
    { label: '3f', text: 'The Weierstrass function $y = \\sum b^n\\cos(a^n\\pi x)$, with $a$ an odd positive integer and $b$ a positive constant less than 1, is continuous but has no derivative anywhere when $ab > 1 + 3\\pi/2$.' }
  ],
  tables: [
    {
      title: 'The kinds of discontinuity in the figures',
      head: ['Fig.', 'Function', 'Where', 'Left limit', 'Right limit', 'Kind'],
      rows: [
        ['90', '$(x^2 - 4)/(x - 2)$', '$x = 2$', '4', '4', 'removable'],
        ['91', '$(x^3 - 1)/(x - 1)$', '$x = 1$', '3', '3', 'removable'],
        ['92', '$\\sin x / x$', '$x = 0$', '1', '1', 'removable'],
        ['93', '$x\\sin(1/x)$', '$x = 0$', '0', '0', 'removable'],
        ['94', '$\\operatorname{arc\\,tan}(1/x)$', '$x = 0$', '$-\\pi/2$', '$\\pi/2$', 'jump'],
        ['95', '$\\sin(1/x)$', '$x = 0$', 'none', 'none', 'infinitely many oscillations'],
        ['96', 'limit of $\\dfrac{(1+\\sin\\pi x)^t + 1}{(1+\\sin\\pi x)^t - 1}$', 'every integer', '±1', '∓1', 'jump (undefined there)'],
        ['97', '$2^{1/x}$', '$x = 0$', '0', '∞', 'infinite jump'],
        ['98', '$1/(2^{1/x}+1)$', '$x = 0$', '1', '0', 'jump'],
        ['99', '$x^x$', '$x = 0$', 'not defined', '1', 'everywhere discontinuous for $x < 0$'],
        ['100', '$x^{1/x}$', '$x = 0$', 'not defined', '0', 'everywhere discontinuous for $x < 0$']
      ],
      note: 'Compiled from the text of the section; the left and right limits are those as x tends to the point from below and from above.'
    }
  ],
  constructions: [
    { fig: 'fig-090', title: 'A line with one point missing', level: 1 },
    { fig: 'fig-091', title: 'A parabola with one point missing', level: 1 },
    { fig: 'fig-094', title: 'The jump of arc tan (1/x)', level: 1 },
    { fig: 'fig-096', title: 'The function that equals +1 and −1 on alternate intervals', level: 1 },
    { fig: 'fig-097', title: 'The curve 2^(1/x)', level: 2 },
    { fig: 'fig-098', title: 'The curve 1/(2^(1/x) + 1)', level: 2 },
    { fig: 'fig-092', title: 'sin x / x between the hyperbolas xy = ±1', level: 2 },
    { fig: 'fig-093', title: 'x sin(1/x) between the lines y = ±x', level: 2 },
    { fig: 'fig-095', title: 'The oscillating curve sin(1/x)', level: 2 },
    { fig: 'fig-101', title: 'The saw-tooth path by halving', level: 2 },
    { fig: 'fig-102', title: 'The snowflake curve, stage by stage', level: 2 },
    { fig: 'fig-099', title: 'The curve x^x with its dotted branches', level: 3 },
    { fig: 'fig-100', title: 'The curve x^(1/x) with its dotted branches', level: 3 },
    { fig: 'fig-103', title: 'The Sierpinski space-filling curve, stage by stage', level: 3 }
  ],
  note: 'The graphs of this section are not compass-and-straightedge constructions; they are plotted point by point from their equations, and the saw-tooth path and the snowflake curve are built by an explicit repeated construction with the straightedge.',
  extra: 'In Figs. 93 and 95 the plotted curves are exact; in Fig. 93 the book\'s sketch lets the two branches run up along the diagonals, while the true graph of $x\\sin(1/x)$ is even and tends to the line $y = 1$ for large $|x|$ — the drawing here follows the equation.',
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 235.',
    'Hardy, G. H.: Pure Mathematics, Macmillan (1933) 162 ff.',
    'Kasner and Newman: Mathematics and Imagination, Simon and Schuster (1940).',
    'Osgood, W. F.: Real Variables, Stechert (1938) Chap. III.',
    'Pierpont, J.: Real Variables, Ginn and Co. (1912) Chap. XIV.',
    'Steinhaus, H.: Mathematical Snapshots, Stechert (1938) 60.'
  ],
  seeAlso: ['sketching', 'exponential', 'trigonometric', 'hyperbolic']
});
