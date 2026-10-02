/* Curves Workshop · data/sections/cones.js — Cones (pages 34–35) */
Curves.section({
  id: 'cones',
  title: 'Cones',
  pages: [34, 35],
  history: 'The cone is as old as the conic sections: the Greek geometers, Apollonius above all, produced the ellipse, the parabola and the hyperbola by cutting a cone with a plane.',
  description: 'A cone is a ruled surface all of whose straight lines (its generators) pass through one fixed point, the vertex. It is fixed by its vertex and a curve it passes through (Fig. 30); the section on [[conics]] studies the plane curves cut from a cone.',
  equations: [
    { tex: 'x - a = k(x_1 - a), \\qquad y - b = k(y_1 - b), \\qquad z - c = k(z_1 - c)', note: 'a point $P(x, y, z)$ of the cone on the line through the vertex $V(a, b, c)$ and a point $P_1(x_1, y_1, z_1)$ of the given curve; $k$ takes all values' },
    { tex: '\\begin{cases} f(x_1, y_1, z_1) = 0 \\\\ g(x_1, y_1, z_1) = 0 \\end{cases}', note: 'the given curve, the intersection of the surfaces $f = 0$ and $g = 0$' },
    { tex: '\\begin{cases} f\\left[\\dfrac{x-a}{k} + a,\\ \\dfrac{y-b}{k} + b,\\ \\dfrac{z-c}{k} + c\\right] = 0 \\\\ g\\left[\\dfrac{x-a}{k} + a,\\ \\dfrac{y-b}{k} + b,\\ \\dfrac{z-c}{k} + c\\right] = 0 \\end{cases}', note: 'the cone; these two conditions must hold for every $k$, so eliminating $k$ gives the rectangular equation of the cone' }
  ],
  metrical: [],
  items: [
    { label: 'Note', text: 'Any equation homogeneous in $x, y, z$ is a cone with its vertex at the origin.' },
    { label: 'Ex. 1', text: 'The cone with vertex at the origin through the curve $x^2 + y^2 - 2z = 0,\\ z - 1 = 0$: the substitution gives $x^2 + y^2 - 2kz = 0,\\ z - k = 0$, and eliminating $k$ leaves $x^2 + y^2 - 2z^2 = 0$.' },
    { label: 'Ex. 2', text: 'The cone with vertex at the origin through the curve $x^2 - 2x + y^2 - 4y = 0,\\ z^2 - 4y = 0$ (the book prints the first equation with a slip, $x^2 - y^2 + y^2$; its result shows what is meant): the substitution gives $x^2 - 2kx + y^2 - 4ky = 0,\\ z^2 - 4ky = 0$, and eliminating $k = z^2/4y$ leaves $2x^2 y - x z^2 + 2y^3 - 2y z^2 = 0$.' },
    { label: 'Ex. 3', text: 'The cone with vertex $(1, 2, 3)$ through the curve $x^2 + y^2 - 2z = 0,\\ z - 4 = 0$: the substitution gives $\\dfrac{(x-1)^2 + (y-2)^2}{k^2} + \\dfrac{2(x-1) + 4(y-2)}{k} - \\dfrac{2(z-3)}{k} - 1 = 0,\\ \\dfrac{z-3}{k} - 1 = 0$, so $k = z - 3$ and the cone is $(x-1)^2 + (y-2)^2 + 2(x-1)(z-3) + 4(y-2)(z-3) - 3(z-3)^2 = 0$.' }
  ],
  constructions: [
    { fig: 'fig-030', title: 'A cone through a plane curve, with vertex V', level: 1 }
  ],
  bibliography: [
    'Smith, Gale, Neelley: Analytic Geometry, Ginn (1938) 284.'
  ],
  seeAlso: ['conics']
});
