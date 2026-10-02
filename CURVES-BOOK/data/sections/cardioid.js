/* Curves Workshop · data/sections/cardioid.js — Cardioid (pages 4–7) */
Curves.section({
  id: 'cardioid',
  title: 'Cardioid',
  pages: [4, 7],
  history: 'The cardioid belongs to the family of cycloidal curves that Roemer studied in 1674 while looking for the best profile for gear teeth.',
  description: 'The cardioid is an epicycloid with a single cusp: the path of a point $P$ on a circle that rolls on the outside of a fixed circle of the same size (Fig. 3a; see [[epi-hypo-cycloids]]). It has a second description, the *double generation*: the same curve is traced by a point of a circle of radius $2a$ that rolls round the fixed circle of radius $a$ and encloses it (Fig. 3b). The proof uses the line $OT\'F$ through the contact point $T\'$ and the line $FP$, which meets the line through the centre at $D$: the circle through $T$, $P$, $D$ has $DT$ as diameter (the angle $DPT$ is a right angle), $PD$ is parallel to $T\'E$, and by similar triangles $DE = 2a$. Because the arcs $TT\'$, $T\'P$ and $T\'X$ are equal, the arc $TP$ is twice the arc $TT\'$, and a point of either circle describes the same curve.',
  equations: [
    { tex: '(x^2 + y^2 \\mp 2ax)^2 = 4a^2(x^2 + y^2)', note: 'rectangular, origin at the cusp' },
    { tex: 'r = 2a(1 \\pm \\cos\\theta), \\qquad r = 2a(1 \\pm \\sin\\theta)', note: 'polar, origin at the cusp' },
    { tex: '9(r^2 - a^2) = 8p^2', note: 'pedal equation, origin at the centre of the fixed circle' },
    { tex: 'x = a(2\\cos t - \\cos 2t), \\qquad y = a(2\\sin t - \\sin 2t)', note: 'parametric' },
    { tex: 'z = a(2e^{it} - e^{2it})', note: 'complex form' },
    { tex: 'r^3 = 4ap^2', note: 'pedal equation, origin at the cusp' },
    { tex: 's = 8a\\cos\\tfrac{\\varphi}{3}', note: 'Whewell intrinsic equation' },
    { tex: '9R^2 + s^2 = 64a^2', note: 'Cesàro intrinsic equation' }
  ],
  metrical: [
    { tex: 'L = 16a', note: 'length' },
    { tex: 'A = 6\\pi a^2', note: 'area' },
    { tex: '\\varphi = \\tfrac{3}{2}\\,t', note: 'inclination of the tangent' },
    { tex: '\\Sigma_x = \\tfrac{128}{5}\\pi a^2', note: 'surface of revolution about OX' },
    { tex: 'R = \\tfrac{2}{3}\\sqrt{2ar} \\quad\\text{for } r = a(1 - \\cos\\theta)', note: 'radius of curvature' }
  ],
  items: [
    { label: 'a', text: 'It is the inverse of a parabola with respect to the parabola\'s focus (see [[inversion]]).' },
    { label: 'b', text: 'Its evolute is another cardioid (see [[evolutes]]).' },
    { label: 'c', text: 'It is the pedal of a circle with respect to a point on the circle (see [[pedal-curves]]).' },
    { label: 'd', text: 'It is the limaçon $r = a + b\\cos\\theta$ in the special case $a = b$ (see [[limacon]]).' },
    { label: 'e', text: 'It is the caustic of a circle for a radiant point on the circle (see [[caustics]]).' },
    { label: 'f', text: 'The tangents at two points whose angles, measured at the cusp, differ by $\\tfrac{2\\pi}{3}$ are parallel.' },
    { label: 'g', text: 'The four distances from the cusp to the four points where any line meets the curve add up to a constant.' },
    { label: 'h', text: 'Cam (Fig. 4). Pivot a cam of this shape at its cusp and turn it at constant angular velocity $\\dot\\theta = k$. A pin that is held on a fixed straight line through the cusp and bears on the cam moves with simple harmonic motion: from $r = a(1+\\cos\\theta)$ one gets $\\dot r = -(a\\sin\\theta)\\dot\\theta$ and $\\ddot r = -(a\\cos\\theta)\\dot\\theta^2 - (a\\sin\\theta)\\ddot\\theta$, and with $\\dot\\theta = k$ this is $\\ddot r = -k^2 (r - a)$, that is $\\tfrac{d^2}{dt^2}(r-a) = -k^2(r-a)$.' },
    { label: 'i', text: 'Linkage (Fig. 5). The curve is the path of the point $P$ of two similar crossed parallelograms joined as in the figure, with the points $O$ and $A$ fixed. The bars satisfy $AB = OD = b$, $AO = BD = CP = a$, $BP = DC = c$ and $a^2 = bc$; at every moment the angle $PCO$ equals the angle $COX$ ($=\\theta$). A point rigidly fixed to the bar $CP$ describes a limaçon.' }
  ],
  constructions: [
    { fig: 'fig-003a', title: 'The cardioid by a rolling circle, with its tangent', level: 2 },
    { fig: 'fig-003b', title: 'Double generation: the circle of radius 2a', level: 3 },
    { fig: 'fig-005', title: 'The cardioid traced by two crossed parallelograms', level: 3 }
  ],
  bibliography: [
    'Keown and Faires: Mechanism, McGraw Hill (1931).',
    'Morley and Morley: Inversive Geometry, Ginn (1933) 239.',
    'Yates, R. C.: Tools, A Mathematical Sketch and Model Book, L. S. U. Press (1941) 182.'
  ],
  seeAlso: ['epi-hypo-cycloids', 'limacon', 'evolutes', 'nephroid', 'pedal-curves', 'caustics', 'inversion']
});
