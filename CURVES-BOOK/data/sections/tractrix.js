/* Curves Workshop · data/sections/tractrix.js — Tractrix (pages 221–224) */
Curves.section({
  id: 'tractrix',
  title: 'Tractrix',
  pages: [221, 224],
  history: 'Huygens studied the curve in 1692, and Leibniz, Jean Bernoulli, Liouville and Beltrami took it up later. It is also called the tractory or the equitangential curve, because the length of the tangent between the curve and its asymptote is the same everywhere.',
  description: String.raw`The tractrix is the track of a particle $P$ that is dragged by an inextensible string $AP$ of length $a$ whose other end $A$ is made to run along a straight line, the asymptote (Fig. 199, [[fig-199]]). It is the path of a toy wagon pulled by a child, or of the rear wheel of a bicycle. The particle always moves straight toward $A$, so the string is the tangent of the curve, and the length of the tangent from the curve to the asymptote is the constant $a$. If $A$ is made to follow some other prescribed curve, the track is called a *general tractrix*. With the $x$-axis as asymptote the curve has a cusp at $(0, a)$ and runs out to infinity on both sides, approaching the axis without meeting it.`,
  equations: [
    { tex: String.raw`y' = \frac{y}{\pm\sqrt{a^2 - y^2}}`, note: 'differential equation: P moves toward A' },
    { tex: String.raw`x = a\,\operatorname{arsech}\frac{y}{a} - \sqrt{a^2 - y^2}`, note: 'rectangular' },
    { tex: String.raw`x = a\ln(\sec\theta + \tan\theta) - a\sin\theta,\qquad y = a\cos\theta`, note: 'parametric' },
    { tex: String.raw`s = a\ln\sec\varphi`, note: 'Whewell intrinsic equation' },
    { tex: String.raw`a^2 + R^2 = a^2 e^{2s/a}`, note: 'Cesàro intrinsic equation' }
  ],
  metrical: [
    { tex: String.raw`K = \frac{y'}{a}`, note: 'curvature' },
    { tex: String.raw`R = a\cot\varphi`, note: 'radius of curvature' },
    { tex: String.raw`A = \pi a^2 \qquad \Big[A = 4\int_0^a\sqrt{a^2 - y^2}\,dy\Big]`, note: 'area between the curve with its mirror image and the asymptote: four pieces of πa²/4, equal to the area of the circle of Fig. 199' },
    { tex: String.raw`V_x = \frac{2\pi a^3}{3}`, note: 'volume of revolution about the asymptote: half the volume of the sphere of radius a' },
    { tex: String.raw`\Sigma_x = 4\pi a^2`, note: 'surface of revolution about the asymptote: the area of the sphere of radius a' }
  ],
  items: [
    { label: 'a', text: 'The tractrix is an involute of the catenary (see [[catenary]] and [[involutes]]). The catenary of Fig. 199 is the locus of the centres of curvature of the tractrix, that is, its evolute (see [[evolutes]]).' },
    { label: 'b', text: 'Tangent construction: with $P$ as centre and radius $a$ draw a circle; it cuts the asymptote at $A$, and the tangent at $P$ is the line $AP$ (Fig. 199).' },
    { label: 'c', text: 'Its radial curve is a kappa curve (see [[radial]]).' },
    { label: 'd', text: 'Roulette: it is the path of the pole of a reciprocal spiral that rolls on a straight line (see [[spirals]]).' },
    { label: 'e', text: 'Schiele\'s pivot: a shaft that turns in a step so that its wear is spread evenly over the face of the bearing has, as the best shape of its end, an arc of the tractrix (Miller and Lilly).' },
    { label: 'f', text: 'The tractrix is used in details of map projection (Leslie, Craig).' },
    { label: 'g', text: 'The surface obtained by turning the curve about its asymptote has constant negative curvature: its Gaussian curvature is $-1/a^2$ (the book writes the constant as $-1/a$). Together with the volume and the area above, which are those of a sphere of radius $a$ (half of the volume), this is why the surface is called the pseudosphere. It is a useful model in the study of non-Euclidean geometry (Wolfe, Eisenhart, Graustein; Fig. 200).' },
    { label: 'h', text: 'From the defining property (Fig. 200) the tractrix is an orthogonal trajectory of the family of circles of radius $a$ whose centres lie on the asymptote: it cuts each circle at right angles at the point $P$.' }
  ],
  constructions: [
    { fig: 'fig-199', title: 'The tangent AP = a of the tractrix, the circle of radius a, and the centre of curvature on the catenary', level: 2 },
    { fig: 'fig-200', title: 'The tractrix as the envelope of its strings, and the pseudosphere in section', level: 2 }
  ],
  bibliography: [
    'Craig: Treatise on Projections.',
    'Edwards, J.: Calculus, Macmillan (1892) 357.',
    'Eisenhart, L. P.: Differential Geometry, Ginn (1909).',
    'Encyclopaedia Britannica: 14th Ed. under "Curves, Special."',
    'Graustein, W. C.: Differential Geometry, Macmillan (1935).',
    'Leslie: Geometrical Analysis (1821).',
    'Miller and Lilly: Mechanics, D. C. Heath (1915) 285.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 289.',
    'Wolfe, H. E.: Non Euclidean Geometry, Dryden (1945).'
  ],
  seeAlso: ['catenary', 'evolutes', 'involutes', 'pursuit', 'spirals', 'radial', 'envelopes']
});
