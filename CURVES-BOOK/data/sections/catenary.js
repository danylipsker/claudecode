/* Curves Workshop · data/sections/catenary.js — Catenary (pages 12–14) */
Curves.section({
  id: 'catenary',
  title: 'Catenary',
  pages: [12, 14],
  history: 'Galileo was the first to study the hanging chain and took its shape for a parabola. James Bernoulli found the true curve in 1691 and worked out several of its properties.',
  description: 'The catenary is the curve in which a perfectly flexible, inextensible chain of uniform density hangs when it is held at two supports that are not on the same vertical (Fig. 10). Take the origin below the lowest point $V$, at the distance $a$. The horizontal pull at $V$ is $ka$, where $k$ is the weight of the chain per unit length; the weight of an arc of length $s$ is $ks$; so the tension $T$ at a point $P$, along the tangent at the angle $\\varphi$ to the horizontal, has components $T\\cos\\varphi = ka$ and $T\\sin\\varphi = ks$, and hence $s = a\\tan\\varphi$. Integrating this gives the hyperbolic cosine.',
  equations: [
    { tex: 'T\\cos\\varphi = ka, \\qquad T\\sin\\varphi = ks', note: 'tension T at P (the book prints ka in the second equation, but the figure shows the weight ks)' },
    { tex: 's = a y\' = a\\tan\\varphi, \\qquad aR = a^2 + s^2', note: 'arc from the vertex and radius of curvature' },
    { tex: 'y = a\\cosh\\tfrac{x}{a} = \\tfrac{a}{2}\\left(e^{x/a} + e^{-x/a}\\right), \\qquad y^2 = a^2 + s^2', note: 'Cartesian' }
  ],
  metrical: [
    { tex: 'A = a\\cdot s = 2\\,(\\text{area of the triangle } PCB)', note: 'area under the curve from the vertex' },
    { tex: '\\Sigma_x = \\pi(ys + ax)', note: 'surface of revolution about OX' },
    { tex: 'R = \\tfrac{y^2}{a}', note: 'radius of curvature' },
    { tex: 'V_x = \\tfrac{a}{2}\\cdot\\Sigma_x', note: 'volume of revolution about OX' },
    { tex: 'N = -R', note: 'length of the normal' }
  ],
  items: [
    { label: 'a', text: 'The tangent at any point $(x, y)$ is also a tangent to the circle of radius $a$ with centre $(x, 0)$: $y\' = \\sinh\\tfrac{x}{a} = \\pm\\tfrac{\\sqrt{y^2 - a^2}}{a}$ (Fig. 10).' },
    { label: 'b', text: 'The tangents at points with the same abscissa to the curves $y = e^{x/a}$, $y = e^{-x/a}$ and $y = a\\cosh\\tfrac{x}{a}$ pass through one point (the first two curves taken with the factor $a$, $y = a e^{\\pm x/a}$, or with $a = 1$).' },
    { label: 'c', text: 'The point $B$ where the tangent touches the circle describes, as the point $P$ moves, a curve of which the catenary is the evolute: an involute of the catenary. It is the tractrix (see [[tractrix]], [[involutes]]), because $\\tan\\theta = \\tfrac{s}{a}$ and $PB = s$.' },
    { label: 'd', text: 'As a roulette, the catenary is the path of the focus of a parabola that rolls along a straight line (see [[roulettes]]).' },
    { label: 'e', text: 'It is a plane section of the surface of least area, the soap-film catenoid, stretched between two circular disks (Fig. 11a). The catenoid is the only minimal surface of revolution.' },
    { label: 'f', text: 'It is a plane section of a sail stretched between two rods, when the wind is perpendicular to the plane of the rods and the pressure on each element of the sail is normal to the element and proportional to the square of the velocity (Fig. 11b; see Routh).' }
  ],
  constructions: [
    { fig: 'fig-010', title: 'The tangent to the catenary from the circle of radius a, and the tractrix', level: 2 }
  ],
  bibliography: [
    'Encyclopaedia Britannica, 14th Ed. under "Curves, Special".',
    'Routh, E. J.: Analytical Statics, 2nd Ed. (1896) I, p. 458, p. 310.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 287.',
    'Wallis: Edinburgh Trans. XIV, 625.'
  ],
  seeAlso: ['tractrix', 'involutes', 'roulettes', 'hyperbolic', 'curvature']
});
