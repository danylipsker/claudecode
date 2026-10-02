/* Curves Workshop · data/sections/nephroid.js — Nephroid (pages 152–154) */
Curves.section({
  id: 'nephroid',
  title: 'Nephroid',
  pages: [152, 154],
  history: 'Huygens and Tschirnhausen studied the curve around 1679 while working on caustics. Jacques Bernoulli showed in 1692 that it is the catacaustic of a cardioid for a light at the cusp, and Daniel Bernoulli found its double generation in 1725.',
  description: 'The nephroid is an epicycloid with two cusps: the path of a point $P$ on a circle that rolls on the outside of a fixed circle. The rolling circle has either half the radius ($a = 2b$) or three halves of the radius ($3a = 2b$) of the fixed circle. For the double generation (Fig. 146) let the fixed circle have centre $O$ and radius $OT = OE = a$, and let the small rolling circle have centre $A\'$ and radius $A\'T\' = A\'F = \\tfrac{a}{2}$; it carries the tracing point $P$. Draw $ET\'$, $OT\'F$ and $PT\'$ down to $T$. If $D$ is where $TO$ meets $FP$, the circle on $T$, $P$, $D$ touches the fixed circle (the angle $DPT$ is a right angle). Because $PD$ is parallel to $T\'E$, the triangles $OET\'$ and $OFD$ are isosceles, so $TD = 3a$. The arcs satisfy arc $TT\' = 2a\\theta$ and arc $T\'P = a\\theta = $ arc $T\'X$, so arc $TX = 3a\\theta = $ arc $TP$: a point attached to the circle of radius $\\tfrac{a}{2}$ or to the one of radius $\\tfrac{3a}{2}$ describes the same nephroid.',
  equations: [
    { tex: 'x = b(3\\cos t - \\cos 3t), \\qquad y = b(3\\sin t - \\sin 3t) \\qquad (a = 2b)', note: 'parametric' },
    { tex: '(x^2 + y^2 - 4b^2)^3 = 108\\,b^4 y^2', note: 'rectangular (the book writes a for the radius b of the rolling circle here)' },
    { tex: 's = 6b\\sin\\tfrac{\\varphi}{2}, \\qquad 4R^2 + s^2 = 36b^2', note: 'Whewell and Cesàro intrinsic equations' },
    { tex: 'p = 4b\\sin\\tfrac{\\varphi}{2}, \\qquad r^2 = 4b^2 + \\tfrac{3p^2}{4}', note: 'tangential and pedal equations' },
    { tex: '\\left(\\tfrac{r}{2}\\right)^{2/3} = b^{2/3}\\left[\\sin^{2/3}\\tfrac{\\theta}{2} + \\cos^{2/3}\\tfrac{\\theta}{2}\\right]', note: 'polar (the book writes a for the radius b of the rolling circle)' },
    { tex: 'x\\cos\\varphi + y\\sin\\varphi = 4b\\sin\\tfrac{\\varphi}{2}', note: 'equation of the tangent' }
  ],
  metrical: [
    { tex: 'L = 24b', note: 'length (a = 2b)' },
    { tex: 'A = 12\\pi b^2', note: 'area' },
    { tex: 'R = \\tfrac{3p}{4}', note: 'radius of curvature' }
  ],
  items: [
    { label: 'a', text: 'It is the catacaustic of a cardioid for a light source at the cusp (see [[caustics]], [[cardioid]]).' },
    { label: 'b', text: 'It is the catacaustic of a circle for a set of parallel rays (see [[caustics]]).' },
    { label: 'c', text: 'Its evolute is another nephroid (see [[evolutes]]).' },
    { label: 'd', text: 'It is the evolute of a Cayley sextic, which is a curve parallel to the nephroid (see [[parallel]]).' },
    { label: 'e', text: 'It is the envelope of a diameter of the circle that generates a cardioid.' },
    { label: 'f', text: 'Tangent construction: $T\'$ (or $T$) is the instantaneous centre of rotation of $P$, so $T\'P$ is the normal and the tangent is $PF$ (or $PD$) (Fig. 151, see [[pedal-curves]]).' }
  ],
  constructions: [
    { fig: 'fig-146', title: 'Double generation of the nephroid', level: 3 }
  ],
  bibliography: [
    'Edwards, J.: Calculus, Macmillan (1892) 343 ff.',
    'Proctor, R. A.: A Treatise on the Cycloid (1878).',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908) 139 ff.'
  ],
  seeAlso: ['epi-hypo-cycloids', 'cardioid', 'deltoid', 'caustics', 'evolutes']
});
