/* Curves Workshop · data/sections/radial.js — Radial Curves (pages 172–174) */
Curves.section({
  id: 'radial',
  title: 'Radial Curves',
  pages: [172, 174],
  history: 'The radial of a curve seems to have occurred first to Tucker, in 1864.',
  description: 'Choose a point $O$. At every point $P$ of a given curve draw from $O$ a line that is equal in length and parallel to the radius of curvature $PC$ at $P$. The locus of the end points of these lines is the **radial** of the given curve. (In the figures of the book the line from $O$ is drawn in the sense from the centre of curvature $C$ towards $P$, so the end point is $O + (P - C)$; the opposite sense gives the same curve turned through $\\pi$.) The radial depends only on how the curvature radius turns along the curve, not on where the curve is, so it is a handy way to see the curvature of a curve all at once: see [[curvature]] and [[evolutes]].',
  equations: [
    { tex: 'R = 2\\,PH = 4a\\sin\\frac{t}{2}, \\qquad \\theta = \\pi - \\frac{t}{2}', note: 'radius of curvature of the cycloid and its inclination $\\theta$ (Fig. 157a; $H$ is the point where the rolling circle touches the base)' },
    { tex: 'r = 4a\\sin\\frac{t}{2} = 4a\\sin\\theta', note: 'radial of the cycloid, $O$ at a cusp: a circle of radius $2a$' },
    { tex: 's = a\\,(e^{m\\varphi} - 1), \\qquad R = m\\,a\\,e^{m\\varphi}', note: 'the equiangular spiral and its radius of curvature (Fig. 157b)' },
    { tex: '\\theta = \\frac{\\pi}{2} + \\varphi, \\qquad r = m\\,a\\,e^{m(\\theta - \\pi/2)}', note: 'radial of the equiangular spiral: another equiangular spiral' },
    { tex: 'x^3 = \\pm k\\,(x^2 + y^2)', note: 'radial of the parabola (Fig. 158a; $k = 2p$ for $y^2 = 4px$ with $O$ at the vertex)' },
    { tex: '(a^2x^2 + b^2y^2)^3 = a^4b^4\\,(x^2 + y^2)^2', note: 'radial of the central conics: ellipse for $b^2 > 0$, hyperbola for $b^2 < 0$ (Fig. 158b, c)' }
  ],
  items: [
    { label: 'a', text: 'The degree of the radial of an algebraic curve is the same as the degree of the curve\'s evolute (see [[evolutes]]).' },
    { label: 'b', text: 'For the cycloid the radius of curvature is twice the chord $PH$, so with $O$ at a cusp the radial is a circle of radius $2a$ through $O$ (Fig. 157a; see [[cycloid]]).' },
    { label: 'c', text: 'The radial of an equiangular spiral about its pole is another equiangular spiral (Fig. 157b; see [[spirals]]): the centre of curvature lies on the perpendicular to the radius vector at the pole, and $R = r\\sqrt{1 + m^2}$ for $r = a\\,e^{m\\varphi}$.' },
    { label: 'd', text: 'The radial of the parabola about its vertex is the cubic $x^3 = \\pm k(x^2 + y^2)$ (a cissoid-like curve with one branch on each side of $O$); the radials of the ellipse and the hyperbola have degree 6 (Fig. 158; see [[conics]]).' }
  ],
  constructions: [
    { fig: 'fig-157a', title: 'The radial of the cycloid', level: 2 },
    { fig: 'fig-157b', title: 'The radial of an equiangular spiral', level: 3 },
    { fig: 'fig-158a', title: 'The radial of the parabola', level: 2 },
    { fig: 'fig-158b', title: 'The radial of the ellipse', level: 2 },
    { fig: 'fig-158c', title: 'The radial of the hyperbola', level: 2 }
  ],
  tables: [
    {
      title: 'Examples',
      head: ['Curve', 'Radial'],
      rows: [
        ['Ordinary catenary', 'Kampyle of Eudoxus'],
        ['Catenary of uniform strength', 'Straight line'],
        ['Tractrix', 'Kappa curve'],
        ['Cycloid', 'Circle'],
        ['Epicycloid', 'Roses'],
        ['Deltoid', 'Trifolium'],
        ['Astroid', 'Quadrifolium']
      ]
    }
  ],
  bibliography: [
    'Encyclopaedia Britannica: 14th Ed., "Curves, Special."',
    'Tucker: Proc. Lon. Math. Soc., 1, (1865).',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908) 362.'
  ],
  seeAlso: ['evolutes', 'curvature', 'cycloid', 'spirals', 'conics', 'catenary', 'tractrix', 'epi-hypo-cycloids', 'deltoid', 'astroid']
});
