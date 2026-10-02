/* Curves Workshop · data/sections/intrinsic.js — Intrinsic Equations, pages 123–126 */
Curves.section({
  id: 'intrinsic',
  title: 'Intrinsic Equations',
  pages: [123, 126],
  history: 'Two intrinsic descriptions are in use: Whewell introduced the relation between arc length and tangential angle, and Cesàro the relation between arc length and curvature.',
  description: 'Rectangular coordinates suit curves whose slope matters, polar coordinates suit curves with a central property about a pole, and pedal coordinates suit problems about the distance from a fixed point to the tangent. The equations in those systems are "local": they change when the system changes. A transformation that keeps lengths and angles leaves the area, the arc length, the curvature and the number of singular points unchanged; a curve described by such invariants alone has an *intrinsic* equation, which says something about the curve itself and not about the way it is placed. The **Whewell equation** connects the arc length $s$ measured from a starting point with the angle $\\varphi$ that the tangent at the end of the arc makes with the tangent at the starting point (Fig. 121); that initial tangent is taken as the $x$-axis, or as the initial line in polar coordinates. The **Cesàro equation** connects $s$ with the radius of curvature $R = ds/d\\varphi$, and follows from the Whewell equation by eliminating $\\varphi$. The table at the end gives both for a dozen curves.',
  equations: [
    { tex: 's = f(\\varphi)', note: 'Whewell equation: arc length against tangential angle, φ measured from the tangent at the start of the arc' },
    { tex: 'R = \\frac{ds}{d\\varphi}', note: 'radius of curvature; eliminating φ from s = f(φ) gives the Cesàro equation F(s, R) = 0' },
    { tex: 'y = a\\cosh\\frac{x}{a}, \\quad y\' = \\sinh\\frac{x}{a} = \\tan\\varphi, \\quad ds^2 = \\Bigl[1 + \\sinh^2\\frac{x}{a}\\Bigr]dx^2', note: 'the catenary: slope and element of arc' },
    { tex: 's = \\int_0^x \\cosh\\frac{x}{a}\\,dx = a\\sinh\\frac{x}{a}, \\qquad s = a\\tan\\varphi', note: 'Whewell equation of the catenary (a direct consequence of its physical definition)' },
    { tex: 'r = 2a(1 - \\cos\\theta), \\quad \\tan\\psi = \\frac{1 - \\cos\\theta}{\\sin\\theta} = \\tan\\frac{\\theta}{2}, \\quad \\psi = \\frac{\\theta}{2}, \\quad \\varphi = \\psi + \\theta = \\frac{3\\theta}{2}', note: 'the cardioid: the angle ψ between the radius vector and the tangent, and the tangential angle φ' },
    { tex: 'ds^2 = 8a^2(1 - \\cos\\theta)\\,d\\theta^2, \\qquad s = -8a\\cos\\frac{\\theta}{2} = -8a\\cos\\frac{\\varphi}{3}', note: 'arc length and Whewell equation of the cardioid' },
    { tex: '\\sigma = a\\varphi \\;\\Longrightarrow\\; s = \\frac{a\\varphi^2}{2}', note: 'the circle and its involute: the Whewell equation of an involute follows by integration, the constant of integration being chosen conveniently' },
    { tex: 's = k\\cos\\frac{\\varphi}{3} \\quad\\text{or}\\quad s = k\\sin\\frac{\\varphi}{3}', note: 'two Whewell equations of the cardioid, according to the choice of the point where s starts' },
    { tex: 's = a\\sin b\\varphi, \\quad R = \\frac{ds}{d\\varphi} = ab\\cos b\\varphi, \\quad R^2 + b^2 s^2 = a^2 b^2', note: 'the family of cycloidal curves: from the Whewell to the Cesàro equation' }
  ],
  items: [
    { label: '1', text: 'The Whewell equation depends on where the arc starts. If the starting point is moved to a point where the tangent is perpendicular to the first one, φ changes by a right angle and the equation involves the cofunction: the cardioid has both s = k cos(φ/3) and s = k sin(φ/3).' },
    { label: '2', text: 'An involute of a given curve is obtained directly from its Whewell equation by integration: the circle σ = aφ has the involute s = aφ²/2.' },
    { label: '3', text: 'Cesàro equations are definitive; they follow from the Whewell equations by using R = ds/dφ, as in the cycloidal family above: from s = a sin bφ comes R² + b²s² = a²b².' },
    { label: '*', text: 'In the row of the epi- and hypocycloids: b < 1 gives an epicycloid, b = 1 the ordinary cycloid, b > 1 a hypocycloid.' },
    { label: '4', text: 'The letter a of the table is not always the one used in the section on a curve. For the astroid with cusps at distance A from the centre, a = 3A/4 (so the Whewell equation reads s = (3A/4) cos 2φ; see [[astroid]]).' }
  ],
  constructions: [
    { fig: 'fig-121', title: 'The arc s and the tangential angle φ of a curve', level: 1 }
  ],
  tables: [
    {
      title: '3. Intrinsic equations of some curves',
      head: ['Curve', 'Whewell equation', 'Cesàro equation'],
      rows: [
        ['Astroid', '$s = a\\cos 2\\varphi$', '$4s^2 + R^2 = 4a^2$'],
        ['Cardioid', '$s = a\\cos\\frac{\\varphi}{3}$', '$s^2 + 9R^2 = a^2$'],
        ['Catenary', '$s = a\\tan\\varphi$', '$s^2 + a^2 = aR$'],
        ['Circle', '$s = a\\varphi$', '$R = a$'],
        ['Cissoid', '$s = a(\\sec^3\\varphi - 1)$', '$729(s + a)^8 = a^2\\left[9(s + a)^2 + R^2\\right]^3$'],
        ['Cycloid', '$s = a\\sin\\varphi$', '$s^2 + R^2 = a^2$'],
        ['Deltoid', '$s = \\frac{8b}{3}\\cos 3\\varphi$', '$9s^2 + R^2 = 64b^2$'],
        ['Epi- and Hypo-cycloids (*)', '$s = a\\sin b\\varphi$', '$R^2 + b^2 \\cdot s^2 = a^2 b^2$'],
        ['Equiangular Spiral', '$s = a\\left(e^{m\\varphi} - 1\\right)$', '$m(s + a) = R$'],
        ['Involute of Circle', '$s = \\frac{a\\varphi^2}{2}$', '$2a\\cdot s = R^2$'],
        ['Nephroid', '$s = 6b\\sin\\frac{\\varphi}{2}$', '$4R^2 + s^2 = 36b^2$'],
        ['Tractrix', '$s = a\\ln\\sec\\varphi$', '$a^2 + R^2 = a^2\\cdot e^{2s/a}$']
      ],
      note: '(*) b < 1: epicycloid; b = 1: ordinary cycloid; b > 1: hypocycloid.'
    }
  ],
  bibliography: [
    'Boole, G.: Differential Equations, London, 263.',
    'Cambridge Philosophical Transactions: VIII 689; IX 150.',
    'Edwards, J.: Calculus, Macmillan (1892).'
  ],
  seeAlso: ['curvature', 'evolutes', 'involutes', 'pedal-equations', 'catenary', 'cardioid', 'astroid', 'tractrix']
});
