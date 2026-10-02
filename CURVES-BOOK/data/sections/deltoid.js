/* Curves Workshop · data/sections/deltoid.js — Deltoid (pages 71–74) */
Curves.section({
  id: 'deltoid',
  title: 'Deltoid',
  pages: [71, 74],
  history: 'Euler arrived at the deltoid in 1745 while studying caustic curves.',
  description: 'The deltoid is a hypocycloid with three cusps. The point $P$ is on a circle that rolls inside a fixed circle, and the rolling circle can be either one third (radius $b$, $a = 3b$) or two thirds (radius $\\tfrac{2a}{3} = 2b$) of the radius $a$ of the fixed circle (Fig. 69). For the double generation take the right-hand figure: $OE = OT = a$, $AD = AT = \\tfrac{2a}{3}$, where $O$ is the centre of the fixed circle and $A$ that of the larger rolling circle, which carries $P$. Draw $TP$ to $T\'$, then $T\'E$, $PD$ and $T\'O$, which meet in $F$. The circle through $F$, $P$, $T\'$ (centre $A\'$) touches the fixed circle at $T\'$, because the angle $FPT\'$ is a right angle, and its diameter $FT\'$ passes through $O$. The triangles $TET\'$, $TDP$ and $T\'FP$ are similar and $TP : T\'P = 2 : 1$, which gives the radius $\\tfrac{a}{3}$ for that circle. The arcs of the two circles add up to the arc $TT\'$ of the fixed circle, so if $P$ started at the cusp $X$ on either circle it would trace the same deltoid, the two circles rolling in opposite senses; $PD$ is the tangent at $P$.',
  equations: [
    { tex: 'x = b(2\\cos t + \\cos 2t), \\qquad y = b(2\\sin t - \\sin 2t) \\qquad (a = 3b)', note: 'parametric' },
    { tex: '(x^2+y^2)^2 + 8bx^3 - 24bxy^2 + 18b^2(x^2+y^2) = 27b^4', note: 'rectangular' },
    { tex: 's = \\tfrac{8b}{3}\\cos 3\\varphi', note: 'Whewell intrinsic equation' },
    { tex: 'R^2 + 9s^2 = 64b^2', note: 'Cesàro intrinsic equation' },
    { tex: 'r^2 = 9b^2 - 8p^2', note: 'pedal equation' },
    { tex: 'p = b\\sin 3\\varphi', note: 'tangential (p, φ) equation' },
    { tex: 'z = b\\left(2e^{it} + e^{-2it}\\right)', note: 'complex form' }
  ],
  metrical: [
    { tex: 'L = 16b', note: 'length' },
    { tex: '\\varphi = \\pi - \\tfrac{t}{2}', note: 'inclination of the tangent' },
    { tex: 'R = \\tfrac{ds}{d\\varphi} = -8p', note: 'radius of curvature' },
    { tex: 'A = 2\\pi b^2', note: 'area: twice the area of the inscribed circle' },
    { tex: 'BC = 4b', note: 'length of any tangent between its two meetings B, C with the curve' }
  ],
  items: [
    { label: 'a', text: 'It is the envelope of the Simson line of a fixed triangle (the line through the feet of the perpendiculars dropped from a point of the circumcircle on the three sides). The centre of the curve is the centre of the nine-point circle of the triangle.' },
    { label: 'b', text: 'Its evolute is another deltoid (see [[evolutes]]).' },
    { label: 'c', text: 'Kakeya conjectured that it is the region of least area inside which a straight rod can be turned round through all orientations and come back reversed; Besicovitch showed that no such least area exists.' },
    { label: 'd', text: 'Its inverse is a Cotes\' spiral (see [[inversion]]).' },
    { label: 'e', text: 'Its pedal with respect to the point $(c, 0)$ is the family of folia $[(x-c)^2 + y^2]\\,[y^2 + (x-c)x] = 4b(x-c)y^2$, which reduces to $r = 4b\\cos\\theta\\sin^2\\theta - c\\cos\\theta$: a simple, a double and a three-leaved folium (trifolium) for a pole at a cusp, a vertex and the centre respectively (see [[pedal-curves]]).' },
    { label: 'f', text: 'Tangent construction (Fig. 69a): $T$ is the instantaneous centre of rotation of $P$, so $TP$ is normal to the path and the tangent passes through $N$, the end of the diameter of the rolling circle through $T$.' },
    { label: 'g', text: 'The length of any tangent that is cut off by the curve is constant ($BC = 4b$).' },
    { label: 'h', text: 'The inscribed circle bisects the tangent $BC$, at the point $N$.' },
    { label: 'i', text: 'Its catacaustic for a set of parallel rays is an astroid (see [[caustics]]).' },
    { label: 'j', text: 'Its orthoptic curve is a circle, the inscribed circle (see [[isoptic]]).' },
    { label: 'k', text: 'Its radial curve is a trifolium (see [[radial]]).' },
    { label: 'l', text: 'It is the envelope of the tangent at the vertex of a parabola that touches three given lines (a roulette), and also the envelope of that parabola.' },
    { label: 'm', text: 'The tangents at the end points $B$ and $C$ of a tangent segment meet at a right angle, on the inscribed circle.' },
    { label: 'n', text: 'The normals to the curve at $B$, $C$ and $P$ all pass through the point $T$ of the circumcircle (the fixed circle).' },
    { label: 'o', text: 'Hold the tangent $BC$ fixed and let the deltoid move so that it keeps touching it: the locus of its cusps is a nephroid (see [[nephroid]]; an elementary geometric proof is in Nat. Math. Mag. XIX (1945) p. 330).' }
  ],
  constructions: [
    { fig: 'fig-069a', title: 'The deltoid by a rolling circle, with its tangent', level: 2 },
    { fig: 'fig-069b', title: 'Double generation: the circle of radius 2a/3', level: 3 }
  ],
  bibliography: [
    'American Mathematical Monthly, v29 (1922) 160.',
    'Bull. A. M. S., v28 (1922) 45.',
    'Cremona, Crelle (1865).',
    'Ferrers, Quar. Jour. Math. (1866).',
    'L\'Interm. d. Math., v3, p. 166; v4, 7.',
    'Proc. Edin. Math. Soc., v23, 80.',
    'Serret; Nouv. Ann. (1870).',
    'Townsend, Educ. Times Reprint (1866).',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908) 142.',
    '(1) Tohoku Sc. Reports (1917) 71.',
    '(2) Mathematische Zeitschrift (1928) 312.'
  ],
  seeAlso: ['epi-hypo-cycloids', 'astroid', 'nephroid', 'evolutes', 'envelopes', 'caustics']
});
