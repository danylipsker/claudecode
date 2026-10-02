/* Curves Workshop · data/sections/cassinian.js — Cassinian Curves (pages 8–11) */
Curves.section({
  id: 'cassinian',
  title: 'Cassinian Curves',
  pages: [8, 11],
  history: 'Giovanni Domenico Cassini introduced these curves in 1680 when he was studying the relative motion of the earth and the sun.',
  description: 'A Cassinian curve is the locus of a point $P$ for which the *product* of the distances to two fixed points $F_1$ and $F_2$ (the foci) is constant, $PF_1\\cdot PF_2 = k^2$ (compare the ellipse, where the sum is constant). Put the foci at $(\\mp a, 0)$. Then the shape depends on $k$ (Fig. 6): for $k < a$ the curve falls into two separate ovals, one around each focus; for $k = a$ it is the figure eight called the lemniscate of Bernoulli, with a double point at the midpoint of $F_1F_2$; for $k > a$ it is a single curve around both foci, with a waist while $k$ stays below $\\sqrt2\\,a$ and convex beyond. The metrical properties are those of the lemniscate (see [[lemniscate]]).',
  equations: [
    { tex: '\\bigl[(x-a)^2 + y^2\\bigr]\\cdot\\bigl[(x+a)^2 + y^2\\bigr] = k^4', note: 'rectangular, foci F_1 = (-a, 0), F_2 = (a, 0)' },
    { tex: 'r^4 + a^4 - 2r^2a^2\\cos 2\\theta = k^4', note: 'polar' },
    { tex: '\\rho^2 = c^2 - 4a^2\\sin^2\\theta', note: 'the linkage of Fig. 8: the polar radius \\rho of Q' },
    { tex: 'r(r - \\rho) = d^2 - \\tfrac{c^2}{4}', note: 'the Peaucellier cell of Fig. 8 inverts Q to P' },
    { tex: '\\bigl(d^2 - \\tfrac{c^2}{4} - r^2\\bigr)^2 = r^2c^2 - 4r^2a^2\\sin^2\\theta', note: 'polar equation of the path of P' },
    { tex: '(x^2+y^2)^2 + Ax^2 + By^2 + C = 0, \\qquad d = \\sqrt{a^2 - \\tfrac{c^2}{4}}', note: 'rectangular form; it is a Cassinian curve when d has this value' }
  ],
  metrical: [],
  items: [
    { label: 'a', text: 'Let $b$ be the inner radius of the generating circle of a torus. A plane parallel to the axis of the torus, at the distance $a$ from it, cuts the torus in a Cassinian curve (Fig. 7); when $b = a$ the section is a lemniscate.' },
    { label: 'b', text: 'The set of curves $(x^2+y^2)^2 + A(y^2 - x^2) + B = 0$ with $B \\ne 0$ inverts into itself (see [[inversion]]).' },
    { label: 'c', text: 'For $k = a$ the curve is the lemniscate of Bernoulli, $r^2 = 2a^2\\cos 2\\theta$, which is also the inverse and the pedal, with respect to its centre, of a rectangular hyperbola.' },
    { label: 'd', text: 'Linkage (Fig. 8): the points $P$ and $P\'$ trace the curve. The bars are $AD = AO = OB = a$, $DC = CQ = EO = OC = \\tfrac{c}{2}$ and $CP = PE = EP\' = P\'C = d$ (the points $A$ and $B$ at the distance $a$ from $O$ are the foci). Since $O$, $D$, $Q$ lie on a circle with centre $C$, the lines $DO$ and $OQ$ are always at right angles, so $\\rho^2 = (DQ)^2 - (DO)^2 = c^2 - 4a^2\\sin^2\\theta$ for $Q = (\\rho,\\theta)$. The Peaucellier cell inverts $Q$ to $P = (r, \\theta)$ with $r(r-\\rho) = d^2 - \\tfrac{c^2}{4}$; eliminating $\\rho$ gives the equation of the path, which is a Cassinian curve exactly when $d^2 = a^2 - \\tfrac{c^2}{4}$.' },
    { label: 'e', text: 'The inflection points of the curves of a confocal family lie on a lemniscate of Bernoulli (the dashed curve of Fig. 6).' },
    { label: 'f', text: 'Pointwise construction (Fig. 9). Raise $F_1C = k$ perpendicular to the axis at $F_1$. Draw the circle about $F_1$ with any radius $F_1X$, then $CX$ and the perpendicular to it at $C$, which meets the axis at $Y$. Since $CF_1$ is the altitude of the right triangle $XCY$, $F_1X\\cdot F_1Y = k^2$, so $F_1X$ and $F_1Y$ are the two focal radii of a point $P$ of the curve: it is where the circle about $F_1$ of radius $F_1X$ meets the circle about $F_2$ of radius $F_1Y$. By symmetry each pair of radii gives four points. If $M$ is the midpoint of $F_1F_2$, the circle about $M$ through $C$ cuts the axis at the extreme points $A$ and $B$ of the curve.' }
  ],
  constructions: [
    { fig: 'fig-009', title: 'A Cassinian curve point by point with compass and straightedge', level: 2 },
    { fig: 'fig-008', title: 'A Peaucellier-cell linkage that draws a Cassinian curve', level: 3 }
  ],
  bibliography: [
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 44, 126.',
    'Willson, F. N.: Graphics, Graphics Press (1909) 74.',
    'Williamson, B.: Calculus, Longmans, Green (1895) 233, 333.',
    'Yates, R. C.: Tools, A Mathematical Sketch and Model Book, L. S. U. Press (1941) 186.'
  ],
  seeAlso: ['lemniscate', 'inversion', 'conics', 'limacon']
});
