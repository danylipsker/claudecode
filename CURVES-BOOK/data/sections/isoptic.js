/* Curves Workshop · data/sections/isoptic.js — Isoptic Curves (pages 138–140) */
Curves.section({
  id: 'isoptic',
  title: 'Isoptic Curves',
  pages: [138, 140],
  history: 'Where the idea of isoptic curves began is not known. Among those who developed it are La Hire, who studied the isoptics of cycloids (1704), and Chasles, who treated those of the conics and of the epitrochoids (1837).',
  description: 'Take a curve (or two curves) and look at the points from which two tangents can be drawn that meet at a fixed angle $\\alpha$. The locus of those points is the **isoptic** of the curve; when $\\alpha = \\tfrac{\\pi}{2}$ it is called the **orthoptic**. Isoptic curves are glissettes in disguise: the vertex of a rigid angle whose two sides slide along the curve traces one (see [[glissettes]]). The pedal of a curve with respect to a point is a special orthoptic: a carpenter\'s square with one edge always through the fixed point and the other edge tangent to the curve carries its corner along the pedal (see [[pedal-curves]]). Fig. 136 shows the two best-known cases: the orthoptic of a parabola is its directrix (left), and the orthoptics of the ellipse and the hyperbola are two concentric circles (right).',
  equations: [
    { tex: '\\begin{cases} y - mx + pm^2 = 0 \\\\ m^2 y + mx + p = 0 \\end{cases}', note: 'two perpendicular tangents of the parabola $x^2 = 4py$, slopes $m$ and $-1/m$; eliminating $m$ gives the directrix $y = -p$' },
    { tex: '\\begin{cases} y - mx \\pm \\sqrt{a^2 m^2 \\pm b^2} = 0 \\\\ my + x \\pm \\sqrt{a^2 \\pm b^2 m^2} = 0 \\end{cases}', note: 'two perpendicular tangents of the central conic (the inner $\\pm$ is $+$ for the ellipse, $-$ for the hyperbola)' },
    { tex: 'x^2 + y^2 = a^2 \\pm b^2', note: 'the orthoptic of the ellipse (upper sign) and of the hyperbola (lower sign): eliminating $m$ above' },
    { tex: '\\tan^2\\alpha\\,(a + x)^2 = y^2 - 4ax', note: '$\\alpha$-isoptic of the parabola $y^2 = 4ax$ (a hyperbola)' },
    { tex: '\\tan^2\\alpha\\,(x^2 + y^2 - a^2 \\mp b^2)^2 = 4(a^2y^2 \\pm b^2x^2 \\mp a^2b^2)', note: '$\\alpha$-isoptic of the ellipse (top signs) and the hyperbola (bottom signs); these include the $\\pi - \\alpha$ isoptics' }
  ],
  items: [
    { label: 'a', text: 'The orthoptic is the envelope of the circles that have $PQ$ as a diameter, where $P$ and $Q$ are the points of contact of two perpendicular tangents (Fig. 137; see [[envelopes]]).' },
    { label: 'b', text: 'The locus of the intersection of two perpendicular normals of a curve is the orthoptic of its evolute (see [[evolutes]]).' },
    { label: 'c', text: 'Tangent construction (Fig. 137): let the normals of the given curve at $P$ and $Q$ meet in $H$. For a rigid angle $PRQ$ sliding with its sides on the curve, $H$ is its instantaneous centre of rotation (see [[instantaneous-center]]), so $R$ moves at right angles to $HR$: $HR$ is the normal at $R$ to the isoptic that $R$ draws.' },
    { label: 'd', text: 'The orthoptic of the hyperbola is the circle through the foci of the corresponding ellipse, and the orthoptic of the ellipse is the circle through the foci of the corresponding hyperbola (Fig. 136, right).' }
  ],
  constructions: [
    { fig: 'fig-136a', title: 'The orthoptic of a parabola: tangents from a point of the directrix', level: 2 },
    { fig: 'fig-136b', title: 'The director circles of the ellipse and the hyperbola', level: 2 },
    { fig: 'fig-137', title: 'The normal to an isoptic from the instantaneous centre', level: 3 }
  ],
  tables: [
    {
      title: 'Isoptic curves of given curves',
      head: ['Given curve', 'Isoptic curve'],
      rows: [
        ['Cycloid', 'Curtate or prolate cycloid'],
        ['Epicycloid', 'Epitrochoid'],
        ['Sinusoidal spiral', 'Sinusoidal spiral'],
        ['Two circles', 'Limaçons (see Glissettes, 4)'],
        ['Parabola', 'Hyperbola (same focus and directrix)']
      ]
    },
    {
      title: 'Orthoptic curves',
      head: ['Given curve', 'Orthoptic curve'],
      rows: [
        ['Two confocal conics', 'Concentric circle'],
        ['Hypocycloid', '$r = (a - 2b)\\,\\sin\\!\\left[\\dfrac{a}{a - 2b}\\left(\\dfrac{\\pi}{2} - \\theta\\right)\\right]$ (the book prints the bracket closed before $\\left(\\tfrac{\\pi}{2} - \\theta\\right)$)'],
        ['Deltoid', 'Its inscribed circle'],
        ['Cardioid', 'A circle and a limaçon'],
        ['Astroid: $x^{2/3} + y^{2/3} = a^{2/3}$', 'Quadrifolium: $r^2 = \\dfrac{a^2}{2}\\cos^2 2\\theta$'],
        ['Sinusoidal spiral: $r^n = a^n \\cos n\\theta$', 'Sinusoidal spiral: $r = a\\cos^k\\!\\left(\\dfrac{\\theta}{k}\\right)$, where $k = \\dfrac{n + 1}{n}$'],
        ['$y^2 = x^3$', '$729y^2 = 180x - 16$'],
        ['$3(x + y) = x^3$', '$81y^2(x^2 + y^2) - 36(x^2 - 2xy + 5y^2) + 128 = 0$'],
        ['$x^2y^2 - 4a(x^3 + y^3) + 18a^2xy - 2ya^4 = 0$', '$x + y + 2a = 0$']
      ]
    }
  ],
  bibliography: [
    'Duporcq: L\'Interm. d. Math. (1896) 291.',
    'Encyclopaedia Britannica: 14th Ed., "Curves, Special."',
    'Hilton, H.: Plane Algebraic Curves, Oxford (1932) 169.'
  ],
  seeAlso: ['glissettes', 'pedal-curves', 'conics', 'evolutes', 'instantaneous-center', 'envelopes']
});
