/* Curves Workshop · data/sections/pedal-equations.js — Pedal Equations (pages 166–169) */
Curves.section({
  id: 'pedal-equations',
  title: 'Pedal Equations',
  pages: [166, 169],
  history: 'The book gives no history for this topic; its sources are the calculus and curve-theory texts of 1892–1908 listed in the bibliography.',
  description: 'Many curves have a very simple equation when they are described by two lengths: the distance $r$ from a chosen fixed point (the pole, or pedal point) to a point of the curve, and the perpendicular distance $p$ from the pole to the tangent at that point. A relation between $r$ and $p$ is the **pedal equation** of the curve (Fig. 154). It is the natural language for curvature (the radius of curvature is just $R = r\\,dr/dp$, Fig. 155) and for pedal curves: the pedal equation of the pedal of a curve is obtained by a simple substitution (see [[pedal-curves]]).',
  equations: [
    { tex: 'f(x_0, y_0) = 0, \\qquad (f_y)_0(y - y_0) + (f_x)_0(x - x_0) = 0, \\qquad p^2 = \\dfrac{[x_0(f_x)_0 + y_0(f_y)_0]^2}{(f_x)_0^2 + (f_y)_0^2}', note: 'rectangular to pedal: the curve, its tangent at $(x_0, y_0)$ and the square of the distance from the origin to the tangent; the pedal point is the origin. Eliminating $x_0, y_0$ with $r^2 = x_0^2 + y_0^2$ gives the pedal equation' },
    { tex: 'r = f(\\theta), \\qquad p = r\\sin\\psi, \\qquad \\tan\\psi = \\dfrac{r}{r\'}', note: 'polar to pedal ($r\' = dr/d\\theta$, pole at the origin): eliminate $\\theta$ and $\\psi$' },
    { tex: 'ds^2 = dr^2 + r^2 d\\theta^2, \\qquad \\tan\\psi = \\dfrac{r}{r\'} = r\\,\\dfrac{d\\theta}{dr}', note: 'the small triangle of Fig. 155' },
    { tex: 't = r\\,\\dfrac{dr}{ds} = \\dfrac{p}{r}\\,\\dfrac{dr}{d\\theta}, \\qquad \\dfrac{d\\theta}{ds} = \\dfrac{p}{r^2}', note: '$t$ is the perpendicular from the pole on the normal' },
    { tex: 'dp = (\\sin\\psi)\\,dr + r(\\cos\\psi)\\,d\\psi, \\qquad \\dfrac{dp}{ds} = \\dfrac{p}{r}\\,\\dfrac{dr}{ds} + t\\,\\dfrac{d\\psi}{ds}, \\qquad \\dfrac{d\\psi}{ds} = \\dfrac{1}{r}\\,\\dfrac{dp}{dr} - \\dfrac{p}{r^2}', note: 'differentiating $p = r\\sin\\psi$' },
    { tex: 'K = \\dfrac{d\\alpha}{ds} = \\dfrac{d\\psi}{ds} + \\dfrac{d\\theta}{ds} = \\dfrac{1}{r}\\,\\dfrac{dp}{dr}', note: 'curvature' },
    { tex: 'R = r\\,\\dfrac{dr}{dp}', note: 'radius of curvature in pedal coordinates' },
    { tex: '\\tan\\theta = p\\,\\dfrac{d\\alpha}{dp}, \\qquad \\alpha = \\theta + \\varphi', note: 'pedal of a pedal (Fig. 155): $p$ makes the angle $\\alpha - \\pi/2$ with the axis' },
    { tex: '\\varphi = \\psi, \\qquad p^2 = r\\,p_1', note: 'from $\\tan\\varphi\\,\\dfrac{dp}{ds} = r\\sin\\psi\\cdot\\dfrac{1}{r}\\dfrac{dp}{dr}$, so $\\tan\\varphi = \\sin\\psi\\,\\dfrac{ds}{dr} = \\tan\\psi$; $p_1$ is the perpendicular from the pole on the tangent to the first positive pedal' },
    { tex: 'r^2 = p\\,f(r)', note: 'the pedal equation of the first positive pedal of the curve $r = f(p)$ (here $p$ and $p_1$ play the roles that $r$ and $p$ have for the given curve); later pedals follow in the same way' },
    { tex: 'r^n = a^n\\sin n\\theta, \\qquad \\dfrac{r}{r\'} = \\tan n\\theta = \\tan\\psi, \\qquad \\psi = n\\theta', note: 'sinusoidal spirals; the relation $\\psi = n\\theta$ gives the construction of tangents to all curves of the family' },
    { tex: 'p = r\\sin\\psi = r\\sin n\\theta = \\dfrac{r^{n+1}}{a^n}, \\qquad a^n p = r^{n+1}', note: 'the pedal equation of the sinusoidal spirals (see Spirals 3 and Pedal Curves 3)' }
  ],
  metrical: [
    { tex: 'R = r\\,\\dfrac{dr}{dp}', note: 'radius of curvature' },
    { tex: 'R = \\dfrac{a^n}{(n+1)\\,r^{n-1}} = \\dfrac{r^2}{(n+1)\\,p}', note: 'radius of curvature of the sinusoidal spirals $r^n = a^n\\sin n\\theta$' }
  ],
  items: [
    { label: '1', text: 'A pedal equation relates $r$, the distance from a fixed point to the curve, with $p$, the distance from the same point to the variable tangent (Fig. 154).' },
    { label: '2', text: 'From rectangular coordinates, write the curve, its tangent at $(x_0, y_0)$ and the expression for $p^2$ as one system and eliminate $(x_0, y_0)$. From polar coordinates, eliminate $\\theta$ and $\\psi$ among $r = f(\\theta)$, $p = r\\sin\\psi$ and $\\tan\\psi = r/r\'$.' },
    { label: '3', text: 'The radius of curvature has the strikingly simple form $R = r\\,dr/dp$ (Fig. 155).' },
    { label: '4', text: 'The angle between $p$ and the tangent to the pedal equals the angle $\\psi$ between $r$ and the tangent to the given curve, and $p^2 = r\\,p_1$. So the pedal equation of the first positive pedal of $r = f(p)$ is $r^2 = p\\,f(r)$ (Fig. 155).' },
    { label: '5', text: 'For the sinusoidal spiral $r^n = a^n\\sin n\\theta$ the angle $\\psi$ is simply $n\\theta$, which gives a construction of the tangent for every curve of the family; the pedal equation is $a^n p = r^{n+1}$, and the special members are listed in the first table.' }
  ],
  constructions: [
    { fig: 'fig-154', title: 'r, p, ψ and θ for a curve f(x, y) = 0', level: 1 },
    { fig: 'fig-155', title: 'Curvature in pedal coordinates: the normal, the pedal curve, φ = ψ and p² = r·p1', level: 3 }
  ],
  tables: [
    {
      title: 'Sinusoidal spirals $r^n = a^n \\sin n\\theta$ and their pedal equations',
      head: ['$n$', '$r^n = a^n\\sin n\\theta$', 'Curve', 'Pedal equation', '$R = \\dfrac{a^n}{(n+1)r^{n-1}} = \\dfrac{r^2}{(n+1)p}$'],
      rows: [
        ['$-2$', '$r^2\\sin 2\\theta + a^2 = 0$', 'Rectangular hyperbola', '$rp = a^2$', '$-r^3/a^2$'],
        ['$-1$', '$r\\sin\\theta + a = 0$', 'Line', '$p = a$', '$\\infty$'],
        ['$-\\tfrac{1}{2}$', '$r = \\dfrac{2a}{1 - \\cos\\theta}$', 'Parabola', '$p^2 = ar$', '$2\\sqrt{r^3/a}$'],
        ['$+\\tfrac{1}{2}$', '$r = \\dfrac{a}{2}(1 - \\cos\\theta)$', 'Cardioid', '$p^2 a = r^3$', '$\\tfrac{2}{3}\\sqrt{ar}$'],
        ['$+1$', '$r = a\\sin\\theta$', 'Circle', '$pa = r^2$', '$\\dfrac{a}{2}$'],
        ['$+2$', '$r^2 = a^2\\sin 2\\theta$', 'Lemniscate', '$pa^2 = r^3$', '$\\dfrac{a^2}{3r}$']
      ]
    },
    {
      title: 'Other curves and their pedal equations',
      head: ['Curve', 'Pedal point', 'Pedal equation'],
      rows: [
        ['Parabola (latus rectum $= 4a$)', 'Vertex', '$a^2(r^2 - p^2)^2 = p^2(r^2 + 4a^2)(p^2 + 4a^2)$'],
        ['Ellipse', 'Focus', '$\\dfrac{b^2}{p^2} = \\dfrac{2a}{r} - 1$'],
        ['Ellipse', 'Centre', '$\\dfrac{a^2 b^2}{p^2} - r^2 = a^2 + b^2$'],
        ['Hyperbola', 'Focus', '$\\dfrac{b^2}{p^2} = \\dfrac{2a}{r} + 1$'],
        ['Hyperbola', 'Centre', '$\\dfrac{a^2 b^2}{p^2} - r^2 = a^2 - b^2$'],
        ['Epi- and hypocycloids', 'Centre', '$p^2 = Ar^2 + B$, with $A = \\dfrac{(a + 2b)^2}{4b(a + b)}$ and $B = -a^2 A$'],
        ['Astroid', 'Centre', '$r^2 + 3p^2 = a^2$'],
        ['Equiangular ($\\alpha$) spiral', 'Pole', '$p = r\\sin\\alpha$'],
        ['Deltoid', 'Centre', '$8p^2 + 9r^2 = a^2$'],
        ["Cotes' spirals", 'Pole', '$\\dfrac{1}{p^2} = \\dfrac{A}{r^2} + B$'],
        ['$r^m = a^m\\theta$ (Sacchi, 1854): $m = 1$ Archimedean spiral, $m = -1$ hyperbolic spiral, $m = 2$ Fermat\'s spiral, $m = -2$ lituus', 'Pole', '$p^2(m^2 r^{2m} + a^{2m}) = m^2 r^{2m+2}$']
      ]
    }
  ],
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 161.',
    'Encyclopaedia Britannica: 14th Ed., under "Curves, Special."',
    'Wieleitner, H.: Spezielle ebene Kurven (1908) under "Fusspunktskurven."',
    'Williamson, B.: Calculus, Longmans, Green (1895) 227 ff.'
  ],
  seeAlso: ['pedal-curves', 'curvature', 'spirals', 'conics', 'intrinsic', 'radial', 'epi-hypo-cycloids', 'deltoid', 'astroid', 'cardioid', 'lemniscate']
});
