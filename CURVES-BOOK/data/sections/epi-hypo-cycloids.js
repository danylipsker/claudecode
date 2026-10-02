/* Curves Workshop · data/sections/epi-hypo-cycloids.js — Epi- and Hypo-Cycloids (pages 81–85) */
Curves.section({
  id: 'epi-hypo-cycloids',
  title: 'Epi- and Hypo-Cycloids',
  pages: [81, 85],
  history: 'The cycloidal curves were first thought of by the Dane Roemer in 1674, when he was looking for the best shape for gear teeth; Galileo and Mersenne had already found the ordinary cycloid in 1599. Daniel Bernoulli noticed the double generation theorem in 1725. Astronomers meet forms of these curves in the various coronas (see Proctor), they occur as caustics, and Newton rectified them in the Principia.',
  description: 'The *epicycloid* is traced by a point $P$ of a circle of radius $b$ that rolls on the **outside** of a fixed circle of radius $a$; the *hypocycloid* by a point of a circle that rolls on the **inside** of it (Fig. 78). The tracing point starts at a cusp on the fixed circle; $t$ is the angle at the centre $O$ between the starting radius and the radius $OT$ to the point of contact, and, because the rolling circle does not slip, its arc from the contact point $T$ to $P$ equals the arc $a\\,t$ of the fixed circle, so the angle between $T$ and $P$ at the rolling centre is $\\tfrac{a\\,t}{b}$.\n\n**Double generation.** Each of these curves can be generated in two ways, by two rolling circles whose radii add up (epicycloid) or differ (hypocycloid) to the radius of the fixed circle. Take the fixed circle with centre $O$ and radius $OT = OE = a$, and a rolling circle with centre $A\'$ and radius $A\'T\' = A\'F = b$, the point $F$ carrying the tracing point $P$ (Fig. 79). Draw $ET\'$, the line $OT\'F$, and $PT\'$ continued to $T$; let $D$ be where $TO$ meets $FP$, and draw the circle on $T$, $P$, $D$. The angle $DPT$ is a right angle, so this circle touches the fixed circle at $T$. Since $PD$ is parallel to $T\'E$, the triangles $OET\'$ and $OFD$ are isosceles, so $DE = 2b$. The arcs are $TT\' = a\\theta$ and $T\'P = b\\theta = T\'X$, hence $\\operatorname{arc} TX = (a+b)\\theta = \\operatorname{arc} TP$ for the epicycloid and $(a-b)\\theta = \\operatorname{arc} TP$ for the hypocycloid. So the second circle, of radius $a+b$ or $a-b$, carries the same point $P$ the same distance: the same curve is drawn.\n\nThe analytic form shows it too (Euler, 1784). In the hypocycloid $x = (a-b)\\cos t + b\\cos\\tfrac{(a-b)t}{b}$, $y = (a-b)\\sin t - b\\sin\\tfrac{(a-b)t}{b}$, put $b = \\tfrac{a+c}{2}$ and $t = \\tfrac{(a+c)t_1}{c}$; dropping the subscript the equations become the pair below, which does not change when the sign of $c$ is reversed. So rolling circles of radii $\\tfrac{a+c}{2}$ and $\\tfrac{a-c}{2}$ on a fixed circle of radius $a$ give the same hypocycloid: the difference of the radii of the fixed and the rolling circle is the radius of a third circle that generates the same curve. The epicycloid is treated in the same way.',
  equations: [
    { tex: 'x = (a+b)\\cos t - b\\cos\\tfrac{(a+b)t}{b}, \\qquad y = (a+b)\\sin t - b\\sin\\tfrac{(a+b)t}{b}', note: 'epicycloid, $x$-axis through a cusp' },
    { tex: 'x = (a+b)\\cos t + b\\cos\\tfrac{(a+b)t}{b}, \\qquad y = (a+b)\\sin t + b\\sin\\tfrac{(a+b)t}{b}', note: 'epicycloid, $x$-axis bisecting the arc between two successive cusps' },
    { tex: 'x = (a-b)\\cos t + b\\cos\\tfrac{(a-b)t}{b}, \\qquad y = (a-b)\\sin t - b\\sin\\tfrac{(a-b)t}{b}', note: 'hypocycloid, $x$-axis through a cusp' },
    { tex: 'x = (a-b)\\cos t - b\\cos\\tfrac{(a-b)t}{b}, \\qquad y = (a-b)\\sin t + b\\sin\\tfrac{(a-b)t}{b}', note: 'hypocycloid, $x$-axis bisecting the arc between two successive cusps' },
    { tex: 'x = \\tfrac{a-c}{2}\\cos\\tfrac{(a+c)t}{c} + \\tfrac{a+c}{2}\\cos\\tfrac{(a-c)t}{c}, \\qquad y = \\tfrac{a-c}{2}\\sin\\tfrac{(a+c)t}{c} - \\tfrac{a+c}{2}\\sin\\tfrac{(a-c)t}{c}', note: 'hypocycloid, rolling radius $\\tfrac{a+c}{2}$ or $\\tfrac{a-c}{2}$ (double generation)' },
    { tex: 's = \\dfrac{4b(a+b)}{a}\\,\\sin\\dfrac{a}{a+2b}\\varphi', note: 'epicycloid, Whewell intrinsic equation' },
    { tex: 's = \\dfrac{4b(b-a)}{a}\\,\\sin\\dfrac{a}{a-2b}\\varphi', note: 'hypocycloid, Whewell intrinsic equation' },
    { tex: 's = A\\sin B\\varphi \\qquad (B < 1 \\text{ epicycloid},\\ B = 1 \\text{ ordinary cycloid},\\ B > 1 \\text{ hypocycloid})', note: 'both in one form (the cosine would do as well)' },
    { tex: 'R^2 + B^2 s^2 = A^2 B^2', note: 'Cesàro intrinsic equation' },
    { tex: 'r^2 = a^2 + \\dfrac{4mp^2}{(m+1)^2} \\quad\\text{or}\\quad p^2 = C^2\\,(r^2 - a^2)', note: 'pedal equation, with $m = \\tfrac{a+b}{b}$ for the epicycloid, $m = \\tfrac{b-a}{b}$ for the hypocycloid' },
    { tex: 'C^2 = \\dfrac{(a+2b)^2}{4b(a+b)} \\quad\\text{or}\\quad C^2 = \\dfrac{(a-2b)^2}{4b(b-a)}', note: 'the constant of the pedal equation, epicycloid or hypocycloid' },
    { tex: 'B\\,p = a\\sin B\\varphi', note: '$(p, \\varphi)$ equation' }
  ],
  metrical: [
    { tex: 'L = \\dfrac{8b^2k}{a}, \\qquad k = \\dfrac{a+b}{b} \\ \\text{or}\\ \\dfrac{b-a}{b}', note: 'length of one arch (epicycloid or hypocycloid; the length is the absolute value)' },
    { tex: 'A = k(k+1)\\,\\dfrac{\\pi a^2}{(k-1)^3}', note: 'area of the segment formed by one arch and the centre, with $k$ as above' },
    { tex: 'R = AB\\cos B\\varphi = \\dfrac{4kp}{(k+1)^2}', note: 'radius of curvature, with the values of $k$ above ($\\varphi$ can be found in terms of $t$ from the figures)' }
  ],
  items: [
    { label: 'a', text: 'The evolute of any cycloidal curve is another of the same kind. All of them have the form $s = A\\sin B\\varphi$, so their evolutes $\\sigma = ds/d\\varphi = AB\\sin B\\varphi$ are similar curves with all lengths multiplied by $B$: the evolutes of epicycloids are smaller than the curves themselves, those of hypocycloids larger (see [[evolutes]]).' },
    { label: 'b', text: 'The envelope of the family of lines $x\\cos\\theta + y\\sin\\theta = c\\sin n\\theta$, with parameter $\\theta$, is an epi- or hypocycloid (see [[envelopes]]).' },
    { label: 'c', text: 'The pedals with respect to the centre are the rose curves $r = c\\sin n\\theta$ (see [[trochoids]]).' },
    { label: 'd', text: 'The isoptic of an epicycloid is an epitrochoid (Chasles, 1837; see [[isoptic]]).' },
    { label: 'e', text: 'The epicycloids are tautochrones (see Ohrtmann).' },
    { label: 'f', text: 'Tangent construction (Fig. 78): $T$ is the instantaneous centre of rotation of $P$, so $TP$ is the normal of the path, and the perpendicular to $TP$ at $P$ is the tangent. That perpendicular is the chord of the rolling circle through $N$, the point diametrically opposite $T$, where $T$ is the point of contact of the two circles. The tangent makes the angle $\\varphi = \\tfrac{a+2b}{2b}t$ with $OX$ for the epicycloid and $\\varphi = \\pi - \\tfrac{a-2b}{2b}t$ for the hypocycloid.' }
  ],
  constructions: [
    { fig: 'fig-078a', title: 'The epicycloid with its tangent through N', level: 2 },
    { fig: 'fig-078b', title: 'The hypocycloid with its tangent through N', level: 2 },
    { fig: 'fig-079a', title: 'Double generation of the hypocycloid (radii b and a − b)', level: 3 },
    { fig: 'fig-079b', title: 'Double generation of the epicycloid (radii b and a + b)', level: 3 }
  ],
  tables: [
    {
      title: 'Special cases (a = radius of the fixed circle, b = radius of the rolling circle)',
      head: ['Kind', 'Condition', 'Curve'],
      rows: [
        ['Epicycloid', '$b = a$', 'Cardioid (see [[cardioid]])'],
        ['Epicycloid', '$2b = a$', 'Nephroid (see [[nephroid]])'],
        ['Hypocycloid', '$2b = a$', 'A line segment (see [[trochoids]])'],
        ['Hypocycloid', '$3b = a$', 'Deltoid (see [[deltoid]])'],
        ['Hypocycloid', '$4b = a$', 'Astroid (see [[astroid]])']
      ]
    }
  ],
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 337.',
    'Encyclopaedia Britannica, 14th Ed., "Curves, Special".',
    'Ohrtmann, C.: Das Problem der Tautochronen.',
    'Proctor, R. A.: The Geometry of Cycloids (1878).',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 278.',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908).',
    'Am. Math. Monthly (1944) p. 587 (an elementary demonstration of the metrical properties).'
  ],
  seeAlso: ['cycloid', 'astroid', 'cardioid', 'nephroid', 'deltoid', 'trochoids', 'roulettes', 'evolutes', 'envelopes', 'isoptic']
});
