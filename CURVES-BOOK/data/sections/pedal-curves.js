/* Curves Workshop · data/sections/pedal-curves.js — Pedal Curves (pages 160–165) */
Curves.section({
  id: 'pedal-curves',
  title: 'Pedal Curves',
  pages: [160, 165],
  history: 'Colin Maclaurin had the idea of positive and negative pedals in 1718; the name "pedal" comes from Terquem. Pedals matter in the theory of caustics: the orthotomic is an enlarged copy of the pedal of the reflecting curve with respect to the light source (Quetelet, 1822). The notion can be widened by dropping the perpendiculars on a line that makes a fixed angle with the tangent, which gives the pedals on the normals of a curve.',
  description: 'Take a curve $C$ and a fixed point $P$, the *pedal point*. Drop the perpendicular from $P$ on the tangent at each point of $C$. The locus $C_1$ of the feet is the **first positive pedal** of $C$ with respect to $P$ (Fig. 151a); $C$ is then the **first negative pedal** of $C_1$. The angle $\\psi$ between the tangent to a curve and the radius vector $r$ from $P$ is the same for the curve and for its pedal, so the tangent to the pedal at the foot touches the circle on $r$ as diameter (Fig. 151b). Hence the first positive pedal is the envelope of all these circles (see [[envelopes]]). Conversely, the first negative pedal is the envelope of the line drawn through a moving point of the curve at right angles to the radius vector from the pedal point.',
  equations: [
    { tex: 'y = mx + k, \\qquad my + x = 0', note: 'rectangular: for the curve $f(x, y) = 0$ the pedal about the origin comes from eliminating $m$ between the tangent and its perpendicular through the origin; $k$ is fixed by the condition that the line touches the curve' },
    { tex: 'y = mx + \\tfrac{1}{2m}, \\quad my + x = 0 \\;\\Longrightarrow\\; y^2 = -\\dfrac{2x^3}{2x + 1}', note: 'example: the pedal of the parabola $y^2 = 2x$ about its vertex is a cissoid' },
    { tex: '\\tan\\psi = r\\,\\dfrac{d\\theta}{dr}, \\qquad r_0 = r\\sin\\psi, \\qquad \\psi + (\\theta - \\theta_0) = \\dfrac{\\pi}{2}', note: 'polar (Fig. 152): $(r_0, \\theta_0)$ are the coordinates of the foot of the perpendicular from the pole' },
    { tex: '\\dfrac{r^2}{r_0^2} = 1 + \\dfrac{1}{r^2}\\left(\\dfrac{dr}{d\\theta}\\right)^2', note: 'the relation between $r$ and $r_0$ that remains after eliminating $\\psi$' },
    { tex: 'r^n = a^n\\cos n\\theta \\;\\Longrightarrow\\; \\psi = \\dfrac{\\pi}{2} + n\\theta, \\quad \\theta = \\dfrac{\\theta_0}{n+1}, \\quad r_0 = a\\cos^{(n+1)/n}\\!\\left[\\dfrac{n\\theta_0}{n+1}\\right]', note: 'example: sinusoidal spirals (rectifiable when $1/n$ is an integer)' },
    { tex: 'r^{n_1} = a^{n_1}\\cos n_1\\theta, \\qquad n_1 = \\dfrac{n}{n+1}', note: 'the first positive pedal of a sinusoidal spiral about the pole is another one' },
    { tex: 'r^{n_k} = a^{n_k}\\cos n_k\\theta, \\qquad n_k = \\dfrac{n}{kn + 1}', note: 'the $k$-th positive pedal' },
    { tex: 'p^2 = r\\,p_1 = f(p)\\,p_1', note: 'pedal equations of pedals (Fig. 153): the given curve is $r = f(p)$ and $p_1$ is the perpendicular from the pole on the tangent to the pedal' },
    { tex: 'r^2 = f(r)\\cdot p', note: 'the pedal equation of the pedal' },
    { tex: 'r^2 = ap \\;\\Longrightarrow\\; r^2 = \\sqrt{ar}\\,p, \\quad\\text{i.e. } r^3 = ap^2', note: 'example: the pedal of a circle about a point on it is a cardioid' },
    { tex: '[(x - b)^2 + y^2]\\,[y^2 + x(x - b)] = 4a(x - b)y^2', note: 'pedal of the deltoid with respect to the point $(b, 0)$; here $x^2 + y^2 = 9a^2$ is the circumcircle of the deltoid' }
  ],
  metrical: [
    { tex: "R'(2r^2 - pR) = r^3", note: "$R$ and $R'$ are the radii of curvature of a curve and of its pedal at corresponding points" }
  ],
  items: [
    { label: '1', text: 'A curve is the first negative pedal of its first positive pedal (Fig. 151a).' },
    { label: '2', text: 'The tangent to the pedal at the foot $F$ is also the tangent to the circle on the radius vector $r$ as diameter, because the angle $\\psi$ between $r$ and the tangent equals the corresponding angle for the pedal (Fig. 151b; proved under [[pedal-equations]]).' },
    { label: '3', text: 'The first negative pedal is the envelope of the line through a variable point of the curve that is perpendicular to the radius vector from the pedal point.' },
    { label: '4', text: 'The pedal equation of the pedal of $r = f(p)$ is $r^2 = f(r)\\,p$; the equations of further pedals follow the same pattern.' },
    { label: 'a', text: 'The 4th negative pedal of the cardioid with respect to its cusp is a parabola.' },
    { label: 'b', text: 'The 4th positive pedal of $r^{2/9}\\cos\\left(\\tfrac{2}{9}\\theta\\right) = a^{2/9}$ with respect to the pole is a rectangular hyperbola.' },
    { label: 'c', text: "The radii of curvature $R$ of a curve and $R'$ of its pedal at corresponding points satisfy $R'(2r^2 - pR) = r^3$." }
  ],
  constructions: [
    { fig: 'fig-151a', title: 'The foot of the perpendicular on the tangent: the first positive pedal', level: 1 },
    { fig: 'fig-152', title: 'Polar coordinates of the foot: r, ψ, r0, θ0', level: 1 },
    { fig: 'fig-151b', title: 'The tangent to the pedal from the circle on r as diameter', level: 2 },
    { fig: 'fig-153', title: 'The perpendicular p1 on the tangent to the pedal: p² = r·p1', level: 2 }
  ],
  tables: [
    {
      title: 'Some curves and their pedals (first positive pedal)',
      head: ['Given curve', 'Pedal point', 'First positive pedal'],
      rows: [
        ['Circle', 'Any point', 'Limacon'],
        ['Circle', 'Point on the circle', 'Cardioid'],
        ['Parabola', 'Vertex', 'Cissoid'],
        ['Parabola', 'Focus', 'Tangent at the vertex (see Conics, 16)'],
        ['Central conic', 'Focus', 'Auxiliary circle (see Conics, 16)'],
        ['Central conic', 'Centre', '$r^2 = A + B\\cos 2\\theta$'],
        ['Rectangular hyperbola', 'Centre', 'Lemniscate'],
        ['Equiangular spiral', 'Pole', 'Equiangular spiral'],
        ['Cardioid ($p^2 a = r^3$)', 'Pole (cusp)', "Cayley's sextic ($r^4 = ap^3$)"],
        ['Lemniscate ($pa^2 = r^3$)', 'Pole', '$r^5 = ap^3$'],
        ['Catacaustic of a parabola for rays perpendicular to its axis, $r\\cos^3\\left(\\tfrac{\\theta}{3}\\right) = a$', 'Pole', 'Parabola'],
        ['Sinusoidal spiral ($r^{n+1} = a^n p$)', 'Pole', 'Sinusoidal spiral'],
        ['Astroid $x^{2/3} + y^{2/3} = a^{2/3}$', 'Centre', '$2r = \\pm a\\sin 2\\theta$ (quadrifolium)'],
        ['Parabola', 'Foot of the directrix', 'Right strophoid'],
        ['Parabola', 'Arbitrary point of the directrix', 'Strophoid'],
        ['Parabola', 'Reflection of the focus in the directrix', 'Trisectrix of Maclaurin'],
        ['Cissoid', 'Ordinary focus', 'Cardioid'],
        ['Epi- and hypocycloids', 'Centre', 'Roses'],
        ['Deltoid (see the note below the table)', 'Cusp', 'Simple folium'],
        ['Deltoid', 'Vertex', 'Double folium'],
        ['Deltoid', 'Centre', 'Trifolium'],
        ['Involute of a circle', 'Centre of the circle', 'Archimedean spiral'],
        ['$x^3 + y^3 = a^3$', 'Origin', '$(x^2 + y^2)^{3/2} = a^{3/2}\\left(x^{3/2} + y^{3/2}\\right)$'],
        ['$x^m y^n = a^{m+n}$', 'Origin', '$r^{n+m} = a^{m+n}\\,\\dfrac{(m+n)^{m+n}}{m^m n^n}\\,\\cos^m\\theta\\,\\sin^n\\theta$'],
        ['$\\left(\\dfrac{x}{a}\\right)^n + \\left(\\dfrac{y}{b}\\right)^n = 1$ (Lamé curve; for $n = 2$ an ellipse, for $n = \\tfrac{1}{2}$ a parabola)', 'Origin', '$(ax)^{n/(n-1)} + (by)^{n/(n-1)} = (x^2 + y^2)^{n/(n-1)}$']
      ]
    }
  ],
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 163 ff.',
    'Encyclopaedia Britannica: 14th Ed., under "Curves, Special."',
    'Hilton, H.: Plane Alg. Curves, Oxford (1932) 166 ff.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 99 ff.',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908) 101 etc.',
    'Williamson, B.: Calculus, Longmans, Green (1895) 224 ff.'
  ],
  seeAlso: ['pedal-equations', 'caustics', 'envelopes', 'limacon', 'cardioid', 'cissoid', 'strophoid', 'conics', 'spirals', 'inversion', 'radial', 'involutes']
});
