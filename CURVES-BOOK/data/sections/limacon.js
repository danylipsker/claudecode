/* Curves Workshop · data/sections/limacon.js — Limacon of Pascal (pages 148–151) */
Curves.section({
  id: 'limacon',
  title: 'Limacon of Pascal',
  pages: [148, 151],
  history: 'The curve was found by Étienne Pascal, the father of Blaise Pascal, and Roberval wrote about it in 1650.',
  description: 'The limacon of Pascal can be made in two ways. It is the epitrochoid traced by a point carried by a circle that rolls on an equal fixed circle (Fig. 143a), and it is the conchoid of a circle with respect to a fixed point $B$ of the circle: along every secant through $B$, measure a constant length $k$ beyond the second intersection $A$ with the circle (Fig. 143b; see [[conchoid]]). The tracing point lies at distance $k$ from the centre of the rolling circle. The shape depends on how $k$ compares with $2a$, the radius of the fixed circle: if $2a > k$ the curve has an indentation, if $2a = k$ it has a cusp (the cardioid, see [[cardioid]]), and if $2a < k$ it has a double point with an inner loop.',
  equations: [
    { tex: 'x = 4a\\cos t - k\\cos 2t, \\qquad y = 4a\\sin t - k\\sin 2t', note: 'parametric, origin at the centre of the fixed circle (the book prints a cosine in the y line by a slip)' },
    { tex: 'r = 2a\\cos\\theta + k', note: 'polar, pole at the singular point' },
    { tex: '(x^2 + y^2 - 2ax)^2 = k^2(x^2 + y^2)', note: 'rectangular, origin at the singular point' }
  ],
  metrical: [
    { tex: 'R = \\dfrac{(2a \\pm k)^2}{4a \\pm k}', note: 'radius of curvature at the vertices on the axis (upper signs at the far vertex, lower signs at the near one)' }
  ],
  items: [
    { label: 'a', text: 'It is the pedal of a circle with respect to any point (see [[pedal-curves]]). If the pedal point is on the circle the pedal is the cardioid. The book refers to its *Tools* for a mechanical drawing instrument.' },
    { label: 'b', text: 'Its evolute is the catacaustic of a circle for any point source of light (see [[caustics]] and [[evolutes]]).' },
    { label: 'c', text: 'It is the glissette of a chosen point of a rigid triangle that slides so that two of its sides always pass through two fixed points (see [[glissettes]]).' },
    { label: 'd', text: 'A point rigidly attached to a constant angle whose sides keep touching two fixed circles describes a pair of limacons (Glissettes 2a and 4).' },
    { label: 'e', text: 'It is the inverse of a conic with respect to a focus: inverting $r = 2a\\cos\\theta + k$ about the pole gives $r(2a\\cos\\theta + k) = c^2$, an ellipse, a parabola or a hyperbola according as $2a < k$, $2a = k$, $2a > k$ (see [[inversion]]). The book prints the right-hand side as 0, which is a slip for the constant of inversion.' },
    { label: 'f', text: 'It is a special Cartesian oval.' },
    { label: 'g', text: 'It forms part of the orthoptic of a cardioid (see [[isoptic]]).' },
    { label: 'h', text: 'For $k = a$ it is a trisectrix: the angle between the axis and the line from the point $(a, 0)$ to any point $(r, \\theta)$ of the curve is $3\\theta$. (Not to be mixed up with the trisectrix of Maclaurin, which looks like the folium of Descartes.)' },
    { label: 'i', text: 'Tangent (Fig. 144). In the conchoid mechanism the point $A$ of the bar moves at right angles to $OA$, so its normal is $AO$; the point of the bar at $B$ moves along the bar, so its normal is the perpendicular to the bar at $B$. The two normals meet in $H$, the end of the diameter through $A$. $H$ is the centre of rotation of the bar, so $HP$ is the normal at $P$ and the perpendicular to it at $P$ is the tangent. In the rolling-circle version the point of contact $T$ plays the same part: $TP$ is the normal.' },
    { label: 'j', text: 'Centre of curvature (Fig. 144a). Draw $HQ$ perpendicular to $HP$ until it meets the line $AB$ in $Q$; the line $QO$ cuts $HP$ in $C$, the centre of curvature of the path of $P$.' },
    { label: 'k', text: 'Double generation (see [[epi-hypo-cycloids]]): the same curve is traced by a point of a circle that rolls *inside* a fixed circle half its size (centres on the same side of the common tangent).' },
    { label: 'l', text: 'Linkage (Fig. 145). $CDKF$ and $CGED$ are two similar crossed parallelograms with $C$ and $F$ fixed in the plane. $CHJD$ is an ordinary parallelogram, and $P$ lies on the extension of $JD$. $D$ behaves like the centre of a circle rolling on an equal fixed circle about $C$, so $P$, or any point rigidly attached to $JD$, describes a limacon. An equivalent mechanism is given under [[cardioid]].' }
  ],
  constructions: [
    { fig: 'fig-143b', title: 'The limacon as the conchoid of a circle: point by point, then by a linkage', level: 1 },
    { fig: 'fig-143a', title: 'The limacon as an epitrochoid of two equal circles', level: 2 },
    { fig: 'fig-144b', title: 'The tangent from the point of contact T', level: 2 },
    { fig: 'fig-144a', title: 'Tangent and centre of curvature by the instantaneous centre H', level: 3 },
    { fig: 'fig-145', title: 'The linkage of two crossed parallelograms', level: 3 }
  ],
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 349.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879).',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908) 88.',
    'Yates, R. C.: Tools, A Mathematical Sketch and Model Book, L. S. U. Press (1941) 182.'
  ],
  seeAlso: ['conchoid', 'cardioid', 'trochoids', 'epi-hypo-cycloids', 'pedal-curves', 'inversion', 'glissettes', 'caustics', 'evolutes', 'isoptic', 'instantaneous-center']
});
