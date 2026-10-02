/* Curves Workshop · data/sections/curvature.js — Curvature (pages 60–64) */
Curves.section({
  id: 'curvature',
  title: 'Curvature',
  pages: [60, 64],
  history: 'Curvature is a notion of the calculus: Newton gave the rule for the curvature at the origin that is drawn in Fig. 61, and the circle that fits a curve most closely at a point is called its osculating circle or circle of curvature.',
  description: 'Curvature measures how fast the direction of the tangent turns as one moves along the curve: if $\\varphi$ is the inclination of the tangent and $s$ the arc length, the curvature is $K = \\tfrac{d\\varphi}{ds}$ and the radius of curvature is its reciprocal $R = \\tfrac{1}{K}$. At a maximum or a minimum point, where $y\' = 0$, $K = y\'\'$ (which may be $\\infty$ or $0$); at a point of inflexion, if $y\'\'$ is continuous, $K = 0$ (or $R = \\infty$); at a cusp $R = 0$. See [[evolutes]].\n\n**The osculating circle** (Fig. 60). At the point $(x, y)$ of a curve the circle that has $(x, y)$, $y\'$ and $y\'\'$ in common with the curve is the osculating circle, also called the circle of curvature. Its centre $(\\alpha, \\beta)$ and radius $r$ satisfy the three conditions $(x-\\alpha)^2 + (y-\\beta)^2 = r^2$, $(x-\\alpha) + (y-\\beta)y\' = 0$ and $(1+y\'^2) + (y-\\beta)y\'\' = 0$, for the values of $x$, $y$, $y\'$ and $y\'\'$ that belong to the curve. They give $r = R$, $\\alpha = x - R\\sin\\varphi$ and $\\beta = y + R\\cos\\varphi$, where $\\varphi$ is the tangential angle: the centre lies on the normal, at the distance $R$ from the point.\n\n**Curvature at the origin** (Newton, Fig. 61). Consider rational algebraic curves that touch the $x$-axis at the origin $O$. Let $A$ be the centre of a circle that touches the curve at $O$ and cuts it again at $P = (x, y)$; as $P$ approaches $O$ this circle approaches the osculating circle. In the right triangle $OPC$ (with $OC = 2R$ the diameter through $O$) the perpendicular $BP = x$ is the mean proportional between $OB = y$ and $BC = 2R - y$, with $AO = R$. Hence $2R - y = \\tfrac{x^2}{y}$, and $R_0 = \\lim R = \\lim\\tfrac{x^2}{2y}$ as $P \\to O$. So the curvature at the origin depends only on the coefficients of $y$ and of $x^2$. If the curve is given in polar coordinates through the pole and tangent to the polar axis, the same figure gives $2R\\sin\\theta = r$, and $R_0 = \\lim_{\\theta\\to 0}\\tfrac{r}{2\\sin\\theta} = \\lim_{\\theta\\to 0}\\tfrac{r}{2\\theta}$.\n\n**Curvature at a singular point.** At a singular point of the curve $f(x, y) = 0$, $f_x = f_y = 0$. The character of the point is shown by $F = f_{xy}^2 - f_{xx}f_{yy}$: for $F < 0$ it is an isolated point, for $F = 0$ a cusp, for $F > 0$ a node. The curvature there (except for an isolated point) is found from the usual $K = \\tfrac{y\'\'}{(1+y\'^2)^{3/2}}$ once $y\'$ and $y\'\'$ have been worked out; the slopes $y\'$ come from the indeterminate form $-\\tfrac{f_x}{f_y}$ by differentiating (unless $y\'$ does not exist).',
  equations: [
    { tex: 'K = \\dfrac{d\\varphi}{ds}, \\qquad R = \\dfrac{1}{K}', note: 'definition' },
    { tex: '(x-\\alpha)^2 + (y-\\beta)^2 = r^2, \\quad (x-\\alpha) + (y-\\beta)y\' = 0, \\quad (1+y\'^2) + (y-\\beta)y\'\' = 0', note: 'conditions for the osculating circle' },
    { tex: 'r = R, \\qquad \\alpha = x - R\\sin\\varphi, \\qquad \\beta = y + R\\cos\\varphi', note: 'radius and centre of the osculating circle ($\\varphi$ the tangential angle)' },
    { tex: '2R - y = \\dfrac{x^2}{y}, \\qquad R_0 = \\lim_{P\\to O} R = \\lim_{\\substack{x\\to 0\\\\ y\\to 0}} \\dfrac{x^2}{2y}', note: 'curvature at the origin (Newton)' },
    { tex: '2R\\sin\\theta = r, \\qquad R = \\dfrac{r}{2\\sin\\theta}, \\qquad R_0 = \\lim_{\\theta\\to 0}\\dfrac{r}{2\\sin\\theta} = \\lim_{\\theta\\to 0}\\dfrac{r}{2\\theta}', note: 'curvature at the pole, polar coordinates' },
    { tex: 'R^2 = \\dfrac{(1+y\'^2)^3}{y\'\'^2}', note: 'rectangular coordinates, $y = y(x)$' },
    { tex: 'K^2 = \\left(\\dfrac{d^2x}{ds^2}\\right)^2 + \\left(\\dfrac{d^2y}{ds^2}\\right)^2', note: 'arc length as the parameter' },
    { tex: 'R^2 = \\dfrac{(\\dot x^2 + \\dot y^2)^3}{(\\dot x\\ddot y - \\ddot x\\dot y)^2}', note: 'parametric, $x = x(t)$, $y = y(t)$, the dot meaning $\\tfrac{d}{dt}$' },
    { tex: 'R = \\dfrac{v^2}{a_n}', note: '$v$ and $a_n$ the magnitudes of the velocity and of the normal acceleration of a moving point' },
    { tex: 'R = \\dfrac{ds}{d\\varphi}', note: 'intrinsic form (the book prints $d\\varphi/ds$, the curvature, by a slip)' },
    { tex: 'R = r\\,\\dfrac{dr}{dp}', note: 'pedal coordinates $(r, p)$' },
    { tex: 'R = p + \\dfrac{d^2p}{d\\varphi^2}', note: 'tangential coordinates $(p, \\varphi)$' },
    { tex: 'R^2 = \\dfrac{(r^2 + r\'^2)^3}{(r^2 + 2r\'^2 - rr\'\')^2}', note: 'polar coordinates, $r = r(\\theta)$' },
    { tex: 'R^2 = \\dfrac{(f_x^2 + f_y^2)^3}{(f_{xx}f_y^2 - 2f_{xy}f_xf_y + f_{yy}f_x^2)^2}', note: 'the curve given as $f(x, y) = 0$' },
    { tex: 'R = \\dfrac{N^3}{y^3 y\'\'}, \\qquad N^2 = y^2(1 + y\'^2)', note: 'the form used for the conics (see [[conics]], 18); the book prints $R^2$ on the left, but the right side is already a length' },
    { tex: 'F = f_{xy}^2 - f_{xx}f_{yy}', note: 'at a singular point: $F < 0$ isolated point, $F = 0$ cusp, $F > 0$ node' }
  ],
  items: [
    { label: 'a', text: 'The osculating circles at two corresponding points of inverse curves are inverse to each other (see [[inversion]]).' },
    { label: 'b', text: 'If $R$ and $R\'$ are the radii of curvature of a curve and of its pedal at corresponding points, then $R\'\\,(2r^2 - pR) = r^3$ (see [[pedal-curves]]).' },
    { label: 'c', text: 'The curve $y = x^n$ is a useful test case for curvature: look at the origin for rational $n$, in the three cases $n < 2$, $n = 2$ and $n > 2$ (see [[evolutes]]).' },
    { label: 'd', text: 'For a parabola the radius of curvature is twice the length of the normal cut off between the curve and its directrix.' }
  ],
  constructions: [
    { fig: 'fig-060', title: 'The osculating circle: centre (α, β), radius R, angle φ', level: 1 },
    { fig: 'fig-061', title: 'Curvature at the origin: the circle through O and P', level: 2 }
  ],
  tables: [
    {
      title: 'Curvature at the origin: the examples of the book',
      head: ['Curve', 'Equation', '$x^2/2y$ or $r/2\\theta$', '$R_0$'],
      rows: [
        ['Parabola', '$2y = x^2$', '$1$', '$1$'],
        ['Cubic', '$y^2 = x^3$', '$\\dfrac{x^2}{2y} = \\dfrac{\\sqrt{x}}{2}$', '$0$'],
        ['Quintic', '$y^2 = x^5$', '$\\dfrac{x^2}{2y} = \\dfrac{1}{2\\sqrt{x}}$', '$\\infty$'],
        ['Circle', '$r = a\\sin\\theta$', '$\\dfrac{r}{2\\theta} = \\dfrac{a\\sin\\theta}{2\\theta}$', '$\\dfrac{a}{2}$'],
        ['Cardioid', '$r = 1 - \\cos\\theta$', '$\\dfrac{r}{2\\theta} = \\dfrac{1-\\cos\\theta}{2\\theta}$', '$0$']
      ]
    },
    {
      title: '6. Curvature for various curves',
      head: ['Curve', 'Equation', 'R'],
      rows: [
        ['Rectangular hyperbola', '$r^2\\sin 2\\theta = 2k^2$', '$\\dfrac{r^3}{2k^2}$'],
        ['Catenary', '$y^2 = c^2 + s^2$', '$\\dfrac{y^2}{c} = c\\sec^2\\varphi$ (see the construction under [[catenary]])'],
        ['Cycloid', '$s = \\sqrt{8ay}$', '$4a\\sqrt{1 - \\dfrac{y}{2a}}$ (see the construction under [[cycloid]])'],
        ['Cycloid (parametric form)', '$x = a(t - \\sin t), \\quad y = a(1 - \\cos t)$', '$4a\\cos\\dfrac{t}{2}$'],
        ['Tractrix', '$s = c\\ln\\sec\\varphi$', '$c\\tan\\varphi$'],
        ['Equiangular spiral', '$s = a(e^{m\\varphi} - 1)$', '$ma\\,e^{m\\varphi}$'],
        ['Lemniscate', '$r^3 = a^2 p$', '$\\dfrac{a^2}{3r}$ (see the construction under [[lemniscate]])'],
        ['Ellipse', '$a^2 + b^2 - r^2 = \\dfrac{a^2b^2}{p^2}$', '$\\dfrac{a^2b^2}{p^3}$'],
        ['Sinusoidal spirals', '$r^n = a^n\\cos n\\theta$', '$\\dfrac{a^n}{(n+1)r^{n-1}} = \\dfrac{r^2}{(n+1)p}$'],
        ['Astroid', '$x^{2/3} + y^{2/3} = a^{2/3}$', '$3(axy)^{1/3}$'],
        ['Epi- and hypo-cycloids', '$p = a\\sin b\\varphi$', '$a(1-b^2)\\sin b\\varphi = (1-b^2)\\,p$']
      ],
      note: 'The letters are those of the book: $s$ is the arc length, $\\varphi$ the tangential angle, $p$ the perpendicular from the origin to the tangent.'
    }
  ],
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 252.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 84.'
  ],
  seeAlso: ['evolutes', 'intrinsic', 'pedal-curves', 'pedal-equations', 'inversion', 'conics', 'cycloid', 'epi-hypo-cycloids']
});
