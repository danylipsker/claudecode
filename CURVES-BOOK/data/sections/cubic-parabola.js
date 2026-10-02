/* Curves Workshop · data/sections/cubic-parabola.js — Cubic Parabola (pages 56–59) */
Curves.section({
  id: 'cubic-parabola',
  title: 'Cubic Parabola',
  pages: [56, 59],
  history: 'Newton and Leibniz studied the curve about 1675, looking for a curve whose subnormal is inversely proportional to its ordinate. In 1815 Monge showed that the single parabola $y = x^3$ is enough to solve every cubic equation of the form $x^3 + hx + k = 0$.',
  description: 'The cubic parabola is the graph of a polynomial of the third degree, $y = Ax^3 + Bx^2 + Cx + D$. Taking out the real root $a$, every such cubic can be written $A(x-a)(x^2+bx+c)$, and the sign of $b^2 - 4ac$ decides the shape (Fig. 56): when it is positive the curve crosses the $x$-axis three times and has a maximum and a minimum between the crossings; when it is zero the curve touches the axis at a double root; when it is negative it crosses the axis once. In the simplest case $y = Ax^3$ the curve is a flattened S with a point of inflexion at the origin, where it lies along the $x$-axis. Because one fixed curve $y = x^3$ is enough to solve any cubic by a straight line, the cubic parabola is also a calculating device: see [[fig-057]] (graphical), [[fig-058]] (mechanical) and [[fig-059]] (trisecting an angle).',
  equations: [
    { tex: 'y = Ax^3 + Bx^2 + Cx + D = A(x-a)(x^2 + bx + c)', note: 'rectangular, general and factored form' },
    { tex: 'a^2 y = x^3 \\quad (\\text{or } 3a^2 y = x^3)', note: 'the basic form used for the evolute and the radius of curvature' },
    { tex: '\\begin{cases} y = x^3 \\\\ y + hx + k = 0 \\end{cases}', note: 'the system equivalent to x³ + hx + k = 0 (Fig. 57)' },
    { tex: 'x_1 = \\tfrac{k}{h}\\,x \\;\\Rightarrow\\; x^3 + m(x+1) = 0, \\qquad m = \\tfrac{h^3}{k^2}', note: 'the reduction that leaves one parameter, the slope (Fig. 58)' },
    { tex: '4x^3 - 3x - a = 0 \\quad (x = \\cos\\theta,\\; a = \\cos 3\\theta)', note: 'the trisection equation, from cos 3θ = 4cos³θ − 3cos θ (Fig. 59)' }
  ],
  metrical: [
    { tex: 'b^2 - 4ac \\;>\\; 0,\\; =\\; 0,\\; <\\; 0', note: 'three real roots, a double root, one real root' },
    { tex: 'x = -\\dfrac{B}{3A}', note: 'abscissa of the point of inflexion' },
    { tex: '\\left|R\\right| = \\dfrac{\\left(a^4 + x^4\\right)^{3/2}}{2a^4 x}', note: 'radius of curvature of 3a²y = x³' },
    { tex: '3a^2\\left(x^2 - \\tfrac{9}{125}y^2\\right)^2 + \\tfrac{128}{125}\\left(\\tfrac{2}{5}a^2 - \\tfrac{9}{2}xy\\right)\\left(\\tfrac{1}{5}a^4 - \\tfrac{3}{2}a^2xy - \\tfrac{243}{400}y^4\\right) = 0', note: 'evolute of a²y = x³, as printed in the book' },
    { tex: 'X = \\tfrac{t}{2} - \\tfrac{9t^5}{2a^4}, \\quad Y = \\tfrac{5t^3}{2a^2} + \\tfrac{a^2}{6t}', note: 'the same evolute in parameter form (centre of curvature of (t, t³/a²); it satisfies the equation above)' },
    { tex: '\\Delta = -m^2(27 + 4m)', note: 'discriminant of x³ + m(x+1) = 0' }
  ],
  items: [
    { label: 'a', text: 'The curve has a maximum and a minimum only when $B^2 - 3AC > 0$, that is when the derivative $3Ax^2 + 2Bx + C$ has real zeros.' },
    { label: 'b', text: 'Its point of inflexion is at $x = -B/(3A)$. Moving the $y$-axis to that abscissa removes the square term, so the origin is taken at the mean of the three roots.' },
    { label: 'c', text: 'The curve is symmetrical about its point of inflexion (a half-turn about that point carries it into itself).' },
    { label: 'd', text: 'It is a special case of the Pearls of Sluze, a family of curves given by a product of powers of $x$ and $a - x$.' },
    { label: 'e', text: 'It is much used in railway engineering as a transition curve: its curvature grows almost in proportion to the distance along it, which eases a train from a straight track into a circular curve.' },
    { label: 'f', text: 'It is continuous for every $x$ and has no asymptotes, cusps or double points.' },
    { label: 'g', text: 'The evolute of $a^2 y = x^3$ is the sextic given in the equations above (see [[evolutes]]).' },
    { label: 'h', text: 'For $3a^2 y = x^3$ the radius of curvature is $R = \\dfrac{(a^4 + x^4)^{3/2}}{2a^4 x}$ (see [[curvature]]).' },
    { label: 'i-1', text: 'Graphical solution (Fig. 57): replace $x^3 + hx + k = 0$ by the system $y = x^3$, $y + hx + k = 0$. The abscissas of the meetings of the line with the curve are the roots. One cubic parabola, drawn once, serves for every cubic; only the line changes.' },
    { label: 'i-2', text: 'Mechanical solution (Fig. 58): the substitution $x_1 = (k/h)x$ turns the cubic into $x^3 + m(x+1) = 0$ with $m = h^3/k^2$, i.e. the system $y = x^3$, $y + m(x+1) = 0$. The line passes through $(-1, 0)$ and has slope $-m$, so a straightedge pivoted at $(-1,0)$ and set by the height $-m$ on the $y$-axis finds the root where it meets the curve.' },
    { label: 'i-3', text: 'How many roots are real: the discriminant $\\Delta = -m^2(27+4m)$ (the square of the product of the differences of the roots) is negative for $m > -27/4$, giving one real root and two complex ones; for $m < -27/4$ all three roots are real and different; for $m = 0$ or $m = -27/4$ two or more roots are equal. The straightedge position $-m = 27/4$ is the line through $(-1,0)$ that touches the curve, at $x = -3/2$, and it separates the two regions.' },
    { label: 'j', text: 'Trisection of an angle (Fig. 59): given $\\angle AOB = 3\\theta$ and the unit circle, the projection of $A$ is $a = \\cos 3\\theta$. Since $\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta$, the number $x = \\cos\\theta$ solves $4x^3 - 3x - a = 0$, the intersection of $y = 4x^3$ with the line $y - 3x - a = 0$ (slope 3, through $(0, a)$). Draw that line parallel to the fixed line $L$ of slope 3; it meets the curve at $P$. The perpendicular from $P$ to $OB$ cuts the unit circle at $T$, and $OT$ is the trisecting line.' }
  ],
  constructions: [
    { fig: 'fig-057', title: 'Solving x³ + hx + k = 0 with the curve y = x³ and a straight line', level: 1 },
    { fig: 'fig-058', title: 'The straightedge pivoting at (−1, 0)', level: 2 },
    { fig: 'fig-059', title: 'Trisecting an angle with y = 4x³ and the unit circle', level: 3 }
  ],
  bibliography: [
    'Yates, R. C.: Tools, A Mathematical Sketch and Model Book, L. S. U. Press (1941).',
    'Yates, R. C.: The Trisection Problem, The Franklin Press (1942).'
  ],
  seeAlso: ['semi-cubic-parabola', 'evolutes', 'curvature', 'sketching']
});
