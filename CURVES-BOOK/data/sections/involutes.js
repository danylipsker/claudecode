/* Curves Workshop · data/sections/involutes.js — Involutes (pages 135–137) */
Curves.section({
  id: 'involutes',
  title: 'Involutes',
  pages: [135, 137],
  history: 'Huygens studied and used the involute of a circle in 1693, when he was designing clocks without pendulums that could keep time at sea.',
  description: 'The involute of a given curve is the path of the end of a taut string that is unwound from the curve; equivalently, the path of a point of a straight line that rolls along the curve as its tangent. The line is always normal to the path, so *all involutes of one curve are parallel to each other* (Fig. 134a), and the curve itself is the *evolute*: the envelope of the normals of every one of its involutes (see [[evolutes]], [[parallel]]). The rest of the section concerns the **involute of a circle** (Fig. 134b), a curve famous for its use in gearing: the string is unwound from a circle of radius $a$ and $P$ is its free end, at the distance $at$ from the point of contact $T$ when the radius to $T$ has turned through the angle $t$ from $OA$.',
  equations: [
    { tex: 'x = a(\\cos t + t\\sin t), \\qquad y = a(\\sin t - t\\cos t)', note: 'parametric; $t$ is the angle $AOT$ in radians' },
    { tex: 'p^2 = r^2 - a^2', note: 'pedal equation, with respect to $O$' },
    { tex: '\\sqrt{r^2 - a^2} = a\\left(\\theta + \\arccos\\frac{a}{r}\\right)', note: 'polar equation (the book prints $a\\theta + \\arccos\\frac{a}{r}$; the factor $a$ belongs to both terms)' },
    { tex: '2s = a\\theta^2', note: 'Whewell intrinsic equation, $s$ measured from $A$ and $\\theta$ the angle of the tangent' },
    { tex: 'R^2 = 2as \\quad (= a^2 t^2)', note: 'Cesàro intrinsic equation, $R$ the radius of curvature' }
  ],
  metrical: [
    { tex: 'A = \\frac{p^3}{6a}', note: 'area bounded by $OA$, $OP$ and the arc $AP$, where $p = at$ is the length of the string $TP$' }
  ],
  items: [
    { label: 'a', text: 'The normal of the involute at $P$ is the tangent to the circle at $T$.' },
    { label: 'b', text: 'It is the path of the pole of an equiangular spiral that rolls on a circle concentric with the base circle (Maxwell, 1849).' },
    { label: 'c', text: 'Its pedal with respect to the centre of the base circle is a spiral of Archimedes (see [[pedal-curves]], [[spirals]]).' },
    { label: 'd', text: 'Take an ordinate perpendicular to $OA$: it meets the circle and also the cycloid with its vertex at $A$. The tangents drawn at those two points meet on the involute (the book\'s statement of this property is brief).' },
    { label: 'e', text: 'Starting from any curve and taking involute after involute, the limit of the series is an equiangular spiral (see [[spirals]]).' },
    { label: 'f', text: 'In 1891 the dome of the Royal Observatory at Greenwich was built as a surface of revolution whose profile is an arc of the involute of a circle (Monthly Notices of the Royal Astronomical Society, vol. 51, p. 436).' },
    { label: 'g', text: 'It is a special case of the Euler (Cornu) spirals.' },
    { label: 'h', text: 'When the involute rolls on a straight line, the centre of its base circle, carried along with it, traces a parabola (see [[roulettes]]).' },
    { label: 'i', text: 'Its inverse with respect to the base circle is a spiral tractrix, a curve whose tangent length is constant in polar coordinates (see [[inversion]]).' },
    { label: 'j', text: 'It is used often in the design of cams.' },
    { label: 'k', text: 'Gear teeth (Fig. 135): let a circle with its plane roll along a straight line; the path of a point $P$ of the line, carried with the moving plane, is the involute of the circle, and at each instant the centre of rotation of $P$ is the point $C$ of contact. So two circles with fixed centres can have involutes touching at $P$, always on their common internal tangent, the line of action; the velocity ratio stays constant and the basic law of gearing holds. Compared with cycloidal teeth: the velocity ratio does not change when the distance between centres changes; the pressure on the axes is constant; the teeth have a single curvature and are easier to cut; the wear is more uniform.' }
  ],
  constructions: [
    { fig: 'fig-134b', title: 'The involute of a circle, point by point with dividers', level: 1 },
    { fig: 'fig-134a', title: 'Involutes of any curve: tangents and string lengths', level: 2 },
    { fig: 'fig-135', title: 'Involute gear teeth: line of action and profiles in contact', level: 3 }
  ],
  bibliography: [
    'American Mathematical Monthly, v 28 (1921) 328.',
    'Byerly, W. E.: Calculus, Ginn (1889) 133.',
    'Encyclopaedia Britannica, 14th Ed., under "Curves, Special".',
    'Huygens, C.: Works, la Société Hollandaise des Sciences (1888) 514.',
    'Keown and Faires: Mechanism, McGraw-Hill (1931) 61, 125.'
  ],
  seeAlso: ['evolutes', 'parallel', 'spirals', 'pedal-curves', 'inversion', 'roulettes', 'envelopes']
});
