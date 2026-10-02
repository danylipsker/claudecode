/* Curves Workshop · data/sections/astroid.js — the reference section file (pages 1–3) */
Curves.section({
  id: 'astroid',
  title: 'Astroid',
  pages: [1, 3],
  history: 'The cycloidal curves, the astroid among them, were found by Roemer in 1674 while he looked for the best shape for gear teeth. Daniel Bernoulli noticed the double generation in 1725.',
  description: 'The astroid is a hypocycloid of four cusps: the path of a point $P$ on a circle that rolls inside a fixed circle of four times its radius (Fig. 1a). It is also traced by a point on a circle of radius $\\tfrac{3a}{4}$ rolling inside the fixed circle of radius $a$ (Fig. 1b, the *double generation*; see [[epi-hypo-cycloids]]).',
  equations: [
    { tex: 'x^{2/3} + y^{2/3} = a^{2/3}', note: 'rectangular' },
    { tex: 'x = a\\cos^3 t = \\tfrac{a}{4}(3\\cos t + \\cos 3t), \\qquad y = a\\sin^3 t = \\tfrac{a}{4}(3\\sin t - \\sin 3t)', note: 'parametric' },
    { tex: 'r^2 = a^2 - 3p^2', note: 'pedal equation' },
    { tex: 's = \\tfrac{3a}{4}\\cos 2\\varphi', note: 'Whewell intrinsic equation' },
    { tex: 'R^2 + 4s^2 = \\tfrac{9a^2}{4}', note: 'Cesàro intrinsic equation' }
  ],
  metrical: [
    { tex: 'L = 6a', note: 'length' },
    { tex: 'A = \\tfrac{3}{8}\\pi a^2', note: 'area' },
    { tex: 'V_x = \\tfrac{32}{105}\\pi a^3', note: 'volume of revolution about OX' },
    { tex: '\\Sigma_x = \\tfrac{12}{5}\\pi a^2', note: 'surface of revolution about OX' },
    { tex: '\\varphi = \\pi - t', note: 'inclination of the tangent' },
    { tex: 'R = \\tfrac{3a}{2}\\sin 2t = 3\\sqrt[3]{axy}', note: 'radius of curvature' }
  ],
  items: [
    { label: 'a', text: 'Its evolute is another astroid, twice as large and turned through 45° (see [[evolutes]], Fig. 83).' },
    { label: 'b', text: 'It is the envelope of a family of ellipses whose semi-axes have a constant sum (Fig. 2b).' },
    { label: 'c', text: 'The piece of any tangent cut off between the cusp tangents (the axes) has the constant length $a$. So the astroid is the envelope of a trammel of Archimedes: a rod of fixed length sliding with its ends on two perpendicular lines (Fig. 2a; see [[glissettes]]).' },
    { label: 'd', text: 'Its orthoptic with respect to its centre is the curve $r^2 = \\tfrac{a^2}{2}\\cos^2 2\\theta$ (see [[isoptic]]).' },
    { label: 'e', text: 'Tangent construction (Fig. 1a): through $P$ draw the circle whose centre lies on the circle of radius $\\tfrac{3a}{4}$ and which touches the fixed circle, say at $T$. $T$ is the instantaneous centre of rotation of $P$, so $TP$ is the normal at $P$ and the tangent is the line through $P$ and the point of the rolling circle opposite $T$.' }
  ],
  constructions: [
    { fig: 'fig-001a', title: 'The astroid by a rolling circle, with its tangent', level: 2 },
    { fig: 'fig-001b', title: 'Double generation', level: 2 },
    { fig: 'fig-002a', title: 'The astroid as the envelope of a sliding rod', level: 1 },
    { fig: 'fig-002b', title: 'The astroid as the envelope of ellipses', level: 2 }
  ],
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 337.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 278.',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908).',
    'Williamson, B.: Differential Calculus, Longmans, Green (1895) 339.'
  ],
  seeAlso: ['epi-hypo-cycloids', 'evolutes', 'glissettes', 'envelopes']
});
