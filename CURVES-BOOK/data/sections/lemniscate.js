/* Curves Workshop · data/sections/lemniscate.js — Lemniscate of Bernoulli (pages 143–147) */
Curves.section({
  id: 'lemniscate',
  title: 'Lemniscate of Bernoulli',
  pages: [143, 147],
  history: 'Jakob Bernoulli discovered and discussed the curve in 1694; Maclaurin studied it too. James Watt (1784) used a crossed-parallelogram linkage that traces part of it as a near-straight line, and so cut nine feet from the height of his engine house.',
  description: 'The lemniscate is a Cassinian curve of a special kind: the locus of a point $P$ whose distances from two fixed points (the foci $F_1,F_2$, $2a$ apart) have the constant product $a^2$ (Fig. 140a; see [[cassinian]]). Equivalently it is the *cissoid* of a circle of radius $\\tfrac a2$ with respect to a point $O$ at distance $\\tfrac{a\\sqrt2}{2}$ from its centre: a line through $O$ cuts the circle at $A$ and $B$, and $OP=OB-OA=AB$ (Fig. 140b). In Fig. 140a the foci are $2a$ apart, so the curve there is $r^2=2a^2\\cos2\\theta$ with vertices $a\\sqrt2$ from the centre; the equations below use the other usual scale, vertices at distance $a$ and $r^2=a^2\\cos2\\theta$, as in Fig. 140b — the same curve in two sizes.',
  equations: [
    { tex: 'r^2 = a^2\\cos 2\\theta \\quad\\text{or}\\quad r^2=a^2\\sin 2\\theta,\\ \\text{etc.}', note: 'polar (the second is turned through 45°)' },
    { tex: '(x^2+y^2)^2 = a^2(x^2-y^2) \\quad\\text{or}\\quad (x^2+y^2)^2=2a^2xy', note: 'rectangular' },
    { tex: 'r^3 = a^2 p', note: 'pedal equation' },
    { tex: 'x=\\frac{a\\cos t}{1+\\sin^2 t}, \\qquad y=\\frac{a\\sin t\\cos t}{1+\\sin^2 t}', note: 'parametric (used for the drawings)' },
    { tex: '(F_1P)(F_2P)=a^2', note: 'Cassinian definition, foci 2a apart' }
  ],
  metrical: [
    { tex: 'A = a^2', note: 'area of the whole curve' },
    { tex: 'L = 4a\\left(1+\\frac{1}{2\\cdot5}+\\frac{1\\cdot3}{2\\cdot4\\cdot9}+\\frac{1\\cdot3\\cdot5}{2\\cdot4\\cdot6\\cdot13}+\\cdots\\right)', note: 'length (an elliptic integral)' },
    { tex: '2\\pi a^2(2-\\sqrt2)', note: 'r² = a² cos 2θ revolved about the polar axis: the surface of revolution (the book calls it V, but the value has the dimensions of an area)' },
    { tex: 'R=\\frac{a^2}{3r}=\\frac{r^2}{3p}', note: 'radius of curvature' },
    { tex: '\\psi = 2\\theta+\\frac{\\pi}{2}', note: 'angle between the radius vector and the tangent' }
  ],
  items: [
    { label: 'a', text: 'It is the pedal of a rectangular hyperbola with respect to its centre (see [[pedal-curves]]).' },
    { label: 'b', text: 'It is the inverse of a rectangular hyperbola with respect to its centre; the asymptotes of the hyperbola become the tangents of the lemniscate at the node (see [[inversion]], Fig. 126).' },
    { label: 'c', text: 'It is the sinusoidal spiral $r^n=a^n\\cos n\\theta$ for $n=2$ (see [[spirals]]).' },
    { label: 'd', text: 'It is the locus of the points of inflexion of a family of confocal Cassinian curves.' },
    { label: 'e', text: 'It is the envelope of the circles that have their centres on a rectangular hyperbola and pass through its centre (see [[envelopes]]).' },
    { label: 'f', text: 'Tangent construction (Fig. 141): since $\\psi=2\\theta+\\tfrac\\pi2$, the normal makes the angle $2\\theta$ with the radius vector and $3\\theta$ with the polar axis. The tangent is then the perpendicular to the normal.' },
    { label: 'g', text: 'Radius of curvature: $R=a^2/3r$, and its projection on the radius vector is $R\\cos2\\theta=r/3$. So the perpendicular to the radius vector at its trisection point farther from $O$ meets the normal at $C$, the centre of curvature (Fig. 141).' },
    { label: 'h', text: 'It is the path of a body acted on by a central force that varies inversely as the seventh power of the distance (see [[spirals]]).' },
    { label: 'j', text: 'Linkages (Fig. 142). (1) $OA=AB=a$ and $BC=CP=OC=a/\\sqrt2$: since $C$ is the circumcentre of triangle $BOP$, the angle $BOP$ is always a right angle, so $r^2=BP^2-OB^2=2a^2-4a^2\\sin^2\\theta=2a^2\\cos2\\theta$. (2) The crossed parallelogram $AB=CD=a\\sqrt2$, $AD=BC=a$ with $O$ and $P$ the midpoints of $AB$ and $DC$: $r^2=a^2\\cos2\\theta$.' }
  ],
  constructions: [
    { fig: 'fig-140a', title: 'Pointwise construction of the lemniscate from its foci', level: 2 },
    { fig: 'fig-140b', title: 'The lemniscate as a cissoid of a circle', level: 2 },
    { fig: 'fig-141', title: 'Tangent and centre of curvature', level: 2 },
    { fig: 'fig-142a', title: 'A linkage with a right angle at O', level: 3 },
    { fig: 'fig-142b', title: 'The crossed parallelogram of Watt', level: 3 }
  ],
  bibliography: [
    'Encyclopaedia Britannica: 14th Ed., "Curves, Special."',
    'Hilton, H.: Plane Algebraic Curves, Oxford (1932).',
    'Phillips, A. W.: Linkwork for the Lemniscate, Am. J. Math. I (1878) 386.',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908).',
    'Williamson, B.: Differential Calculus, Longmans, Green (1895).',
    'Yates, R. C.: Tools, A Mathematical Sketch and Model Book, L. S. U. Press (1941) 172.'
  ],
  seeAlso: ['cassinian', 'cissoid', 'inversion', 'pedal-curves', 'spirals', 'envelopes', 'glissettes']
});
