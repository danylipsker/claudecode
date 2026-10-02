/* Curves Workshop · data/sections/evolutes.js — pages 86–92 */
Curves.section({
  id: 'evolutes',
  title: 'Evolutes',
  pages: [86, 92],
  history: 'The idea of the evolute is usually credited to Huygens (1673), who met it while studying light. It can be traced back much further, to the fifth book of the Conics of Apollonius (about 200 BC).',
  description: 'The **evolute** of a curve is the locus of its centres of curvature (Fig. 80). If $(x,y)$ is a point of the curve, $\\varphi$ the angle of the tangent there (the tangential angle) and $R$ the radius of curvature, the centre of curvature $(\\alpha,\\beta)$ lies on the normal at distance $R$, and $x$, $y$, $R$, $\\sin\\varphi$, $\\cos\\varphi$ can all be written with one parameter, which then parametrises the evolute. Differentiating shows that the tangent of the evolute at $(\\alpha,\\beta)$ is the normal of the given curve at $(x,y)$: the evolute is the envelope of the normals of the curve (see [[envelopes]]). Moreover the length of an arc of the evolute is the difference of the radii of curvature at its ends, so the given curve is an *involute* of its evolute: a string stretched along the evolute and unwound keeps the shape of the original curve (Fig. 81; see [[involutes]]).',
  equations: [
    { tex: '\\alpha = x - R\\sin\\varphi,\\qquad \\beta = y + R\\cos\\varphi', note: 'the centre of curvature (Fig. 80)' },
    { tex: '\\frac{d\\alpha}{ds} = \\frac{dx}{ds} - R\\cos\\varphi\\,\\frac{d\\varphi}{ds} - \\sin\\varphi\\,\\frac{dR}{ds},\\qquad \\frac{d\\beta}{ds} = \\frac{dy}{ds} - R\\sin\\varphi\\,\\frac{d\\varphi}{ds} + \\cos\\varphi\\,\\frac{dR}{ds}', note: 'differentiating with respect to the arc length $s$ of the given curve' },
    { tex: '\\sin\\varphi = \\frac{dy}{ds},\\quad \\cos\\varphi = \\frac{dx}{ds},\\quad R = \\frac{ds}{d\\varphi} \\ \\Longrightarrow\\ \\frac{d\\alpha}{ds} = -\\sin\\varphi\\,\\frac{dR}{ds},\\quad \\frac{d\\beta}{ds} = \\cos\\varphi\\,\\frac{dR}{ds}' },
    { tex: '\\frac{d\\beta}{d\\alpha} = -\\cot\\varphi = -\\frac1{y\'}', note: 'the tangent of the evolute is perpendicular to the tangent of the curve: it is the normal' },
    { tex: 'd\\sigma = \\pm\\, dR,\\quad d\\sigma^2 = d\\alpha^2 + d\\beta^2 \\ \\Longrightarrow\\ \\sigma = R_1 - R_2', note: 'arc of the evolute between the centres belonging to radii $R_1$, $R_2$ ($R$ monotone), Fig. 81' },
    { tex: '\\Big(\\frac xa\\Big)^2 + \\Big(\\frac yb\\Big)^2 = 1 \\ \\to\\ \\Big(\\frac xA\\Big)^{2/3} + \\Big(\\frac yB\\Big)^{2/3} = 1,\\qquad Aa = Bb = a^2 - b^2', note: 'evolute of the ellipse (Fig. 82a)' },
    { tex: '\\Big(\\frac xa\\Big)^2 - \\Big(\\frac yb\\Big)^2 = 1 \\ \\to\\ \\Big(\\frac xH\\Big)^{2/3} - \\Big(\\frac yK\\Big)^{2/3} = 1,\\qquad Ha = Kb = a^2 + b^2', note: 'evolute of the hyperbola (Fig. 82c)' },
    { tex: 'x^2 = 2ky \\ \\to\\ x^2 = \\frac{8}{27k}\\,(y-k)^3', note: 'evolute of the parabola (Fig. 82b)' },
    { tex: 'y = x^n:\\quad R_0 = \\lim \\frac{x^2}{2y} = \\lim \\frac{x^{2-n}}{2}', note: 'radius of curvature at the origin when the $x$-axis is tangent there' },
    { tex: '\\sigma = R_P - R_0 = \\frac{ds}{d\\varphi} - R_0 = f\'(\\varphi) - R_0 = f\'\\Big(\\beta - \\frac\\pi2\\Big) - R_0', note: 'intrinsic equation of the evolute of the curve $s = f(\\varphi)$, with $\\beta = \\varphi + \\pi/2$ the tangential angle of the evolute (Fig. 85)' },
    { tex: 's = 4a\\sin\\varphi\\ \\Longrightarrow\\ \\sigma = 4a\\cos\\varphi = 4a\\cos\\Big(\\beta - \\frac\\pi2\\Big) = 4a\\sin\\beta', note: 'example: the cycloid' },
    { tex: 'y^3 + 2(1-h)\\,y - 2k = 0', note: 'feet of the normals from $(h,k)$ to the parabola $y^2 = 2x$ (section 6)' },
    { tex: 'h = 1 + \\frac{3y^2}2,\\quad k = -y^3', note: 'the points from which two normals coincide: the evolute of the parabola' }
  ],
  items: [
    { label: 'a', text: 'The evolute of a parabola is a semi-cubic parabola (see [[semi-cubic-parabola]]).' },
    { label: 'b', text: 'The evolute of a central conic is the Lamé curve $\\big(\\tfrac xA\\big)^{2/3} \\pm \\big(\\tfrac yB\\big)^{2/3} = 1$.' },
    { label: 'c', text: 'The evolute of an equiangular spiral is an equal equiangular spiral (see [[spirals]]).' },
    { label: 'd', text: 'The evolute of a tractrix is a catenary (see [[tractrix]], [[catenary]]).' },
    { label: 'e', text: 'The evolute of an epicycloid or a hypocycloid is a curve of the same species (see [[intrinsic]] and Fig. 83).' },
    { label: 'f', text: 'The evolute of a Cayley sextic is a nephroid.' },
    { label: 'g', text: 'The catacaustic of a curve is the evolute of its orthotomic curve (see [[caustics]]).' },
    { label: 'h', text: 'In general a flex of the curve corresponds to an asymptote of the evolute (an exception is $y^3 = x^5$, Fig. 84d).' },
    { label: 'Cycloidal curves', text: 'The evolutes of the cycloid, cardioid, nephroid, deltoid and astroid are curves of the same family (Fig. 83): the evolute of the cycloid is an equal cycloid shifted by half a period; of the cardioid a cardioid one third as large, turned half way round; of the nephroid a nephroid half as large, turned through a right angle; of the deltoid a deltoid three times as large, turned through $60^\\circ$; of the astroid an astroid twice as large, turned through $45^\\circ$. The figure prints the intrinsic equations of both curves ($s$ the given curve, $\\sigma$ its evolute).' },
    { label: 'Symmetry', text: 'Where a curve is symmetric about a line, its evolute has a cusp in general (the normals on both sides of the axis of symmetry become a double tangent of the evolute), except at points of osculation and double flexes; this alone does not suffice. If a curve has a cusp of the first kind, its evolute in general passes through the cusp (Fig. 84e); a cusp of the second kind corresponds to a flex of the evolute.' },
    { label: 'Normals to a curve', text: 'The evolute splits the plane into regions according to how many normals can be drawn to the curve from a point. For the parabola $y^2 = 2x$ and a point $(h,k)$ the feet of the normals are the roots of $y^3 + 2(1-h)y - 2k = 0$, so there are three of them in general and $y_1 + y_2 + y_3 = 0$. A double root, from $3y^2 + 2(1-h) = 0$, gives $h = 1 + \\tfrac32 y^2$, $k = -y^3$: the evolute. It divides the plane into a region from which one normal can be drawn and a region from which three can, and from its points exactly two (counting the coincident pair).' },
    { label: 'A theorem', text: 'A circle $x^2 + y^2 + ax + by + c = 0$ meets the parabola $y^2 = x$ in four points with $y_1 + y_2 + y_3 + y_4 = 0$. If three of them are feet of concurrent normals to the parabola, then $y_4 = 0$: the circle must pass through the vertex. A similar theorem for the cardioid follows by inversion (see [[inversion]]).' },
    { label: 'The power curves', text: 'For $y = x^n$ with the $x$-axis tangent at the origin, $R_0 = 0$ if $n < 2$, $R_0 = \\infty$ if $n > 2$, and $R_0 = \\tfrac12$ if $n = 2$. Fig. 84 shows six cases with their evolutes: $y^3 = x^4$ and $y^3 = x^5$ and $y^2 = x^3$ ($R_0 = 0$: the evolute starts at the origin), and $y = x^4$, $y = x^3$, $y^2 = x^5$ ($R_0 = \\infty$: the evolute has branches running off along the $y$-axis, with cusps).' }
  ],
  constructions: [
    { fig: 'fig-080', title: 'The centre of curvature: the circle of curvature and the right triangle', level: 1 },
    { fig: 'fig-081', title: 'The arc of the evolute is the difference of the radii', level: 1 },
    { fig: 'fig-082a', title: 'The evolute of the ellipse', level: 2 },
    { fig: 'fig-082b', title: 'The evolute of the parabola', level: 2 },
    { fig: 'fig-082c', title: 'The evolute of the hyperbola', level: 3 },
    { fig: 'fig-083a', title: 'The evolute of the cycloid', level: 2 },
    { fig: 'fig-083b', title: 'The evolute of the cardioid', level: 3 },
    { fig: 'fig-083c', title: 'The evolute of the nephroid', level: 3 },
    { fig: 'fig-083d', title: 'The evolute of the deltoid', level: 3 },
    { fig: 'fig-083e', title: 'The evolute of the astroid', level: 3 },
    { fig: 'fig-084a', title: 'y³ = x⁴ and its evolute (R₀ = 0)', level: 3 },
    { fig: 'fig-084b', title: 'y = x⁴ and its evolute (R₀ = ∞)', level: 3 },
    { fig: 'fig-084c', title: 'y = x³ and its evolute (R₀ = ∞)', level: 3 },
    { fig: 'fig-084d', title: 'y³ = x⁵ and its evolute (R₀ = 0)', level: 3 },
    { fig: 'fig-084e', title: 'y² = x³ and its evolute (R₀ = 0)', level: 3 },
    { fig: 'fig-084f', title: 'y² = x⁵ and its evolute (R₀ = ∞)', level: 3 },
    { fig: 'fig-085', title: 'The intrinsic equation of the evolute', level: 2 }
  ],
  tables: [
    {
      title: 'Evolutes of some curves (section 3 and Fig. 82)',
      head: ['Curve', 'Evolute'],
      rows: [
        ['Parabola $x^2 = 2ky$', 'semi-cubic parabola $x^2 = \\tfrac{8}{27k}(y-k)^3$'],
        ['Ellipse $(x/a)^2 + (y/b)^2 = 1$', 'Lamé curve $(x/A)^{2/3} + (y/B)^{2/3} = 1$, $Aa = Bb = a^2 - b^2$'],
        ['Hyperbola $(x/a)^2 - (y/b)^2 = 1$', '$(x/H)^{2/3} - (y/K)^{2/3} = 1$, $Ha = Kb = a^2 + b^2$'],
        ['Equiangular spiral', 'an equal equiangular spiral'],
        ['Tractrix', 'catenary'],
        ['Epicycloids, hypocycloids', 'curves of the same species'],
        ['Cayley sextic', 'nephroid']
      ]
    },
    {
      title: 'The evolutes of the cycloidal curves (Fig. 83): intrinsic equations',
      head: ['Curve $s$', 'Given curve', 'Evolute $\\sigma$'],
      rows: [
        ['Cycloid', '$s = 4a\\sin t$', '$\\sigma = 4a\\cos t$'],
        ['Cardioid', '$s = 8a\\cos\\tfrac\\varphi3$', '$\\sigma = \\tfrac83\\,a\\sin\\tfrac\\varphi3$'],
        ['Nephroid', '$s = 3a\\sin\\tfrac\\varphi2$', '$\\sigma = \\tfrac32\\,a\\cos\\tfrac\\varphi2$'],
        ['Deltoid', '$s = \\tfrac{8a}{9}\\cos 3t$', '$\\sigma = \\tfrac{8a}{3}\\sin 3t$'],
        ['Astroid', '$s = \\tfrac{3a}{4}\\cos 2t$', '$\\sigma = \\tfrac{3a}{2}\\sin 2t$']
      ]
    },
    {
      title: 'The curves $y = x^n$ and their relatives at the origin (Fig. 84)',
      head: ['Curve', '$R_0$', 'Evolute'],
      rows: [
        ['$y^3 = x^4$', '$0$', 'two arcs leaving the origin upwards'],
        ['$y = x^4$', '$\\infty$', 'two spikes along the $y$-axis, two cusps, two crossing arms'],
        ['$y = x^3$', '$\\infty$', 'the $y$-axis is an asymptote (a flex); two cusps'],
        ['$y^3 = x^5$', '$0$', 'one smooth curve through the origin'],
        ['$y^2 = x^3$', '$0$', 'passes through the cusp, vertical tangent'],
        ['$y^2 = x^5$', '$\\infty$', 'two spikes along the $y$-axis, two cusps']
      ]
    }
  ],
  bibliography: [
    'Byerly, W. E.: Differential Calculus, Ginn and Co. (1879).',
    'Encyclopaedia Britannica, 14th Ed. under "Curves, Special."',
    'Edwards, J.: Calculus, Macmillan (1892) 268 ff.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 82 ff.',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908) 169 ff.'
  ],
  seeAlso: ['involutes', 'envelopes', 'curvature', 'caustics', 'conics', 'epi-hypo-cycloids', 'intrinsic', 'cycloid', 'cardioid', 'nephroid', 'deltoid', 'astroid', 'semi-cubic-parabola', 'tractrix', 'catenary', 'spirals']
});
