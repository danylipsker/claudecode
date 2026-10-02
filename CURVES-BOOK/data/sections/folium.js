/* Curves Workshop · data/sections/folium.js — Folium of Descartes (pages 98–99) */
Curves.section({
  id: 'folium',
  title: 'Folium of Descartes',
  pages: [98, 99],
  history: 'Descartes discussed this curve for the first time in 1638.',
  description: 'The folium of Descartes is the cubic $x^3 + y^3 = 3axy$ (Fig. 89). It has a node at the origin where the two axes are the tangents, and a loop in the first quadrant. Two infinite branches, one above and one below, approach the straight line $x + y + a = 0$. They are reached by the parameter $t = y/x$: for $-\\infty < t < -1$ the lower branch, for $-1 < t < 0$ the upper branch, and for $0 < t < +\\infty$ the loop.',
  equations: [
    { tex: 'x^3 + y^3 = 3axy', note: 'rectangular' },
    { tex: 'x = \\dfrac{3at}{1 + t^3}, \\qquad y = \\dfrac{3at^2}{1 + t^3}', note: 'parametric, $t = y/x$' },
    { tex: 'r = \\dfrac{3a\\sin\\theta\\cos\\theta}{\\sin^3\\theta + \\cos^3\\theta}', note: 'polar' }
  ],
  metrical: [
    { tex: 'A_{\\text{loop}} = \\tfrac{3a^2}{2}', note: 'area of the loop, which is also the area between the curve and its asymptote' }
  ],
  items: [
    { label: 'a', text: 'Its asymptote is the line $x + y + a = 0$.' },
    { label: 'b', text: 'Its Hessian is another folium of Descartes.' }
  ],
  constructions: [
    { fig: 'fig-089', title: 'The folium from its parametric equations', level: 1 }
  ],
  bibliography: [
    'Encyclopaedia Britannica, 14th Ed. under "Curves, Special."'
  ],
  seeAlso: ['cubic-parabola', 'sketching']
});
