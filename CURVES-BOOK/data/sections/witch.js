/* Curves Workshop · data/sections/witch.js — Witch of Agnesi (pages 237–238) */
Curves.section({
  id: 'witch',
  title: 'Witch of Agnesi',
  pages: [237, 238],
  history: 'Fermat dealt with this curve before 1666, and Grandi in 1703, who named it the *versorio*, an old Italian word for something free to turn in any direction. Maria Gaetana Agnesi, a linguist, philosopher and sleepwalker whom Pope Benedict XIV had made professor of mathematics at Bologna, wrote it up in 1748. The English name seems to come from a mix-up: her *versiera* was read as the similar-sounding Italian word for a goblin or "devil\'s wife".',
  description: 'Draw a circle with the diameter $OK$ ($OK = 2a$) and pick a point $O$ of it as the origin. A secant $OA$ through $O$ meets the circle again at $Q$ and the tangent at $K$ at $A$ (Fig. 211). Draw $QP$ perpendicular to the diameter $OK$ and $AP$ parallel to it. The path of $P$ is the *witch*, a bell-shaped curve with the axis $OX$ as its asymptote; it is also called the versiera.',
  equations: [
    { tex: 'x = 2a\\tan\\theta, \\qquad y = 2a\\cos^2\\theta', note: 'parametric, $\\theta = \\angle KOA$' },
    { tex: 'y\\,(x^2 + 4a^2) = 8a^3', note: 'rectangular' }
  ],
  metrical: [
    { tex: 'A = 4\\pi a^2', note: 'area between the witch and its asymptote: four times the area of the fixed circle' },
    { tex: '(\\bar{x}, \\bar{y}) = \\left(0, \\tfrac{a}{2}\\right)', note: 'centroid of that area' },
    { tex: 'V_x = 4\\pi^2 a^3', note: 'volume of revolution about the asymptote $OX$' },
    { tex: '\\theta = \\pm\\tfrac{\\pi}{6}', note: 'inflection points' }
  ],
  items: [
    { label: '', text: 'Doubling the ordinates of the witch gives the *pseudo-witch*. J. Gregory studied it in 1658, and Leibniz used it in 1674 to derive his famous series $\\dfrac{\\pi}{4} = 1 - \\dfrac13 + \\dfrac15 - \\dfrac17 + \\cdots$.' }
  ],
  constructions: [
    { fig: 'fig-211', title: 'The witch from a circle and a tangent', level: 1 }
  ],
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 355.',
    'Encyclopaedia Britannica: 14th Ed., under "Curves, Special."',
    'On the name: Scripta Mathematica VI (1939) 211; VIII (1941) 135; School Science and Mathematics XLVI (1946) 57.'
  ],
  seeAlso: ['circle', 'cissoid', 'trigonometric']
});
