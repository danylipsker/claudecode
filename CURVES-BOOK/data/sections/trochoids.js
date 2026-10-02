/* Curves Workshop · data/sections/trochoids.js — Trochoids (pages 233–236) */
Curves.section({
  id: 'trochoids',
  title: 'Trochoids',
  pages: [233, 236],
  history: 'Special trochoids were first thought of by Dürer in 1525 and by Roemer in 1674; Roemer met them while looking for the best shape for gear teeth.',
  description: 'A trochoid is a roulette (see [[roulettes]]): the path of a point that is rigidly attached to a curve while that curve rolls on a fixed curve. In practice the name is nearly always kept for the *epitrochoids* and *hypotrochoids*, where the rolling curve is a circle of radius $b$ rolling outside, or inside, a fixed circle of radius $a$, and this section is limited to them. In Fig. 207 a rod fixed to the rolling circle at its centre $A$ carries tracing points at the distances $AP = k$ from $A$. For $k = b$ the point is on the circle and the path is an epicycloid or hypocycloid (see [[epi-hypo-cycloids]]); for $k < b$ the path is a *curtate* trochoid, without loops; for $k > b$ it is a *prolate* trochoid, with a loop at every turn. The picture shows the three paths of three such points, starting on the axis $OX$, with the rolling circle at the angle $t$.',
  equations: [
    { tex: 'x = m\\cos t - k\\cos\\tfrac{mt}{b}, \\qquad y = m\\sin t - k\\sin\\tfrac{mt}{b} \\qquad (m = a + b)', note: 'epitrochoid; with $k = b$ it is the epicycloid' },
    { tex: 'x = n\\cos t + k\\cos\\tfrac{nt}{b}, \\qquad y = n\\sin t - k\\sin\\tfrac{nt}{b} \\qquad (n = a - b)', note: 'hypotrochoid; with $k = b$ it is the hypocycloid' },
    { tex: 'r = a\\cos n\\theta \\quad\\text{and}\\quad r = a\\sin n\\theta', note: 'the rose curves, which are hypotrochoids (see item (e))' },
    { tex: 'a\\alpha = b\\beta, \\qquad \\beta = 2(\\alpha + \\theta) = \\tfrac{a}{b}\\,\\alpha, \\qquad \\alpha = \\tfrac{2b}{a - 2b}\\,\\theta', note: 'the angles of Fig. 210(b), with $OB = a$, $AB = b$, $OA = AP$' },
    { tex: 'r = 2(a - b)\\cos(\\alpha + \\theta) = 2(a - b)\\cos\\tfrac{a}{a - 2b}\\,\\theta', note: 'the path of $P$ in polar coordinates, the initial line passing through the centre of the fixed circle and a maximum point of the curve' }
  ],
  items: [
    { label: 'a', text: 'The limaçon is the epitrochoid for which $a = b$ (see [[limacon]]).' },
    { label: 'b', text: 'The prolate and curtate cycloids are the trochoids of a circle rolling on a straight line (Fig. 208): the tracing point is outside the wheel (loops) or inside it (a wavy curve without cusps); on the rim it is the ordinary cycloid (see [[cycloid]]).' },
    { label: 'c', text: 'The ellipse is the hypotrochoid for which $a = 2b$. Follow the point $P$ of the rolling circle that touches the fixed circle at $X$ at the start (Fig. 209a): the arc $TP$ equals the arc $TX$, so $P$ stays on the line $OX$. The point $Q$ diametrically opposite stays on $OY$, perpendicular to $OX$, and every point of the rolling circle runs along a diameter of the fixed circle. The motion is that of a rod sliding with its ends on two perpendicular lines, a *trammel of Archimedes*. Any point $F$ of the rod describes an ellipse with axes $OX$ and $OY$; and any point $G$ fixed to the rolling circle describes an ellipse whose axes are the lines run by the ends of the diameter through $G$ (Nasir, about 1250). The diameter $PQ$ envelopes an astroid with $OX$ and $OY$ as axes, and the same astroid is the envelope of the ellipses of the various fixed points $F$ of $PQ$ (see [[envelopes]], [[astroid]], [[conics]]).' },
    { label: 'd', text: 'The double generation theorem (see [[epi-hypo-cycloids]]) holds here. Hold the smaller circle fixed and roll the larger one on it (Fig. 209b): any diameter $RX$ of the large circle always passes through a fixed point $P$ of the small circle. Take a point $S$ of this diameter: $SO$ has a constant length and $SO$ extended always goes through the fixed point $P$, so $S$ describes a limaçon (see [[limacon]] for a linkage built on this). Any point fixed to the rolling circle therefore describes a limaçon, and if it is taken on the circle itself, as $R$, its path is a cardioid with the cusp at $P$ (see [[cardioid]]). *Envelope roulette:* any line fixed to the rolling circle envelopes a circle (see [[limacon]], [[roulettes]], [[glissettes]]).' },
    { label: 'e', text: 'The rose curves $r = a\\cos n\\theta$ and $r = a\\sin n\\theta$ are hypotrochoids: they are drawn by a point at the distance $\\tfrac{a}{2}$ from the centre of a circle of radius $\\tfrac{(n-1)a}{2(n+1)}$ that rolls inside a fixed circle of radius $\\tfrac{na}{n+1}$ (Suardi, 1752; later Ridolphi, 1844; see Loria). Fig. 210(a) shows the three-leaved rose, $n = 3$, with $3b = a$.' }
  ],
  constructions: [
    { fig: 'fig-208', title: 'The prolate and curtate cycloids of a wheel on a line', level: 1 },
    { fig: 'fig-207', title: 'The epitrochoid: tracing points on a rod fixed to the rolling circle', level: 2 },
    { fig: 'fig-209a', title: 'The ellipse as a hypotrochoid (a = 2b): the trammel of Archimedes', level: 2 },
    { fig: 'fig-210a', title: 'The three-leaved rose as a hypotrochoid', level: 2 },
    { fig: 'fig-209b', title: 'Double generation: the larger circle rolling on the smaller', level: 3 },
    { fig: 'fig-210b', title: 'The rose in polar coordinates: the angles α, β, θ', level: 3 }
  ],
  tables: [
    {
      title: 'Special trochoids',
      head: ['Curve', 'Trochoid', 'Condition'],
      rows: [
        ['Epicycloid / hypocycloid', 'epitrochoid / hypotrochoid', 'the tracing point on the rolling circle, $k = b$'],
        ['Limaçon', 'epitrochoid', '$a = b$'],
        ['Prolate and curtate cycloids', 'trochoid of a circle on a line', 'the tracing point outside / inside the wheel'],
        ['Ellipse', 'hypotrochoid', '$a = 2b$'],
        ['Cardioid', 'double generation of Fig. 209(b)', 'the tracing point on the rolling (larger) circle'],
        ['Rose $r = a\\cos n\\theta$', 'hypotrochoid', 'rolling radius $\\tfrac{(n-1)a}{2(n+1)}$, fixed radius $\\tfrac{na}{n+1}$, tracing point $\\tfrac{a}{2}$ from the centre']
      ]
    }
  ],
  bibliography: [
    'Atwood and Pengelly: Theoretical Naval Architecture (for connection with study of ocean waves).',
    'Edwards, J.: Calculus, Macmillan (1892) 343 ff.',
    'Loria, G.: Spezielle algebraische und Transzendente ebene Kurven, Leipzig (1902) II 109.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) VII.',
    'Williamson, B.: Calculus, Longmans, Green (1895) 348 ff.'
  ],
  seeAlso: ['epi-hypo-cycloids', 'cycloid', 'limacon', 'roulettes', 'glissettes', 'envelopes', 'astroid', 'cardioid', 'conics']
});
