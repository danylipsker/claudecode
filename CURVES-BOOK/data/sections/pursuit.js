/* Curves Workshop · data/sections/pursuit.js — Pursuit Curve (pages 170–171) */
Curves.section({
  id: 'pursuit',
  title: 'Pursuit Curve',
  pages: [170, 171],
  history: 'Some writers credit the problem to Leonardo da Vinci. It was probably first posed and solved by Bouguer in 1732.',
  description: 'One particle moves along a given curve while a second one chases it: the chaser always moves straight towards the first, and the two speeds are related by a given law. The path of the chaser is the **pursuit curve** (Fig. 156). Give the pursuer the coordinates $(x, y)$, the pursued particle the coordinates $(\\xi, \\eta)$, and let $s$ and $\\sigma$ be the arc lengths each has travelled. Three conditions fix the problem: the pursued particle is on its curve, the tangent to the pursuer\'s path points at it, and a function $g$ ties the two speeds together. Eliminating $\\xi$ and $\\eta$ leaves the differential equation of the pursuit curve. In the special case treated in detail, the pursued particle starts from rest on the $x$-axis and runs along the line $x = a$, while the pursuer leaves the origin at the same instant with $k$ times its speed (see [[tractrix]] for another curve with a tangent of constant length, and [[curvature]]).',
  equations: [
    { tex: 'f(\\xi, \\eta) = 0, \\qquad \\dfrac{\\eta - y}{\\xi - x} = y\', \\qquad g\\!\\left(\\dfrac{ds}{dt}, \\dfrac{d\\sigma}{dt}\\right) = 0', note: 'the three conditions: the pursued is on its curve; the tangent of the pursuer points at the pursued; the law relating the speeds' },
    { tex: '\\xi = a, \\qquad \\dfrac{\\eta - y}{a - x} = y\' \\;\\; (\\eta = y + (a - x)y\'), \\qquad ds = k\\,d\\sigma \\;\\; (dx^2 + dy^2 = k^2 d\\eta^2)', note: 'special case, Fig. 156: pursued on the line $x = a$, speed ratio $k$' },
    { tex: 'dx^2 + dy^2 = k^2\\,[dy - y\'dx + (a - x)dy\']^2 = k^2 (a - x)^2 (dy\')^2', note: 'substituting $\\eta$' },
    { tex: '1 + y\'^2 = k^2 (a - x)^2 y\'\'^2', note: 'the differential equation of the pursuit curve (solved by first putting $y\' = p$)' },
    { tex: '2y = \\dfrac{k\\,a^{1/k}(a - x)^{(k-1)/k}}{1 - k} + \\dfrac{k\\,a^{-1/k}(a - x)^{(k+1)/k}}{1 + k} - \\dfrac{2ka}{1 - k^2}', note: 'solution for $k \\ne 1$' },
    { tex: '\\pm 4ay = (a - x)^2 - 2a^2\\ln\\dfrac{a - x}{a} - a^2', note: 'solution for $k = 1$' },
    { tex: 'a(3y - 2a)^2 = (a - x)(x + 2a)^2', note: 'the special case $k = 2$ is a cubic with a loop' }
  ],
  metrical: [
    { tex: 's = k\\,\\eta = k\\,[\\,y + (a - x)\\,y\'\\,]', note: 'arc length of the pursuit curve measured from the origin, which follows at once from $ds = k\\,d\\sigma$ and $\\sigma = \\eta$ (the curve is rectifiable)' }
  ],
  items: [
    { label: 'a', text: 'A much harder problem is the one in which the pursued particle runs round a circle. It seems not to have been solved before 1921 (F. V. Morley and A. S. Hathaway).' },
    { label: 'b', text: 'Three dogs at the corners of a triangle set off together, each running at the same speed straight at the next. The path of each dog is an equiangular spiral (E. Lucas and H. Brocard, 1877; see [[spirals]]).' },
    { label: 'c', text: 'Since the speeds of the two particles are given, the curves that satisfy the differential equation of the special case are all rectifiable. The book leaves it as an exercise to prove this from the differential equation.' }
  ],
  constructions: [
    { fig: 'fig-156', title: 'The path of a pursuer chasing a particle that runs along a line, with its tangent', level: 2 }
  ],
  bibliography: [
    'American Mathematical Monthly, v 28, (1921) 54, 91, 278.',
    'Cohen, A.: Differential Equations, D. C. Heath (1933) 173.',
    'Encyclopaedia Britannica: 14th Ed., under "Curves, Special."',
    'Johns Hopkins Univ. Circ., (1908) 135.',
    'Luterbacher, J.: Dissertation, Bern (1900).',
    'Mathematical Gazette (1930-1) 436.',
    'Nouv. Corresp. Math. v 3 (1877) 175, 280.'
  ],
  seeAlso: ['tractrix', 'spirals', 'curvature', 'intrinsic', 'glissettes']
});
