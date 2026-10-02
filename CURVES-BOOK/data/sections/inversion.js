/* Curves Workshop · data/sections/inversion.js — Inversion (pages 127–134) */
Curves.section({
  id: 'inversion',
  title: 'Inversion',
  pages: [127, 134],
  history: 'Inversion in a circle seems to be due to Jakob Steiner, who showed in 1824 that he knew it; Quetelet printed examples the next year. Bellavitis (1836), Stubbs and Ingram (1842–43) and Lord Kelvin (1845) found it independently, and Kelvin used it with great success in his work on electricity.',
  description: 'Take a circle with centre $O$ and radius $k$. Two points $A$ and $\\bar A$ on a line through $O$ are *mutually inverse* when $OA\\cdot O\\bar A=k^2$: a point inside the circle goes outside, a point outside comes in, and the points of the circle stay where they are (Fig. 122). Two curves are inverse to each other when every point of one has its inverse on the other. If the product is taken negative, the two points lie on opposite sides of $O$ (*negative* inverses). Inversion sends circles to circles or lines and keeps angles, so it turns hard problems into easy ones: it changes a parabola into a [[cissoid]], a rectangular hyperbola into a [[strophoid]] or a [[lemniscate]], a conic into a [[limacon]]; it solves the problem of Apollonius; and it is the idea behind the linkages that draw a straight line (Figs. 129, 130).',
  equations: [
    { tex: 'OA\\cdot O\\bar A = k^2', note: 'definition of inverse points' },
    { tex: 'r\\,\\rho = k^2', note: 'polar coordinates with pole O (r and ρ are the distances of the two points from O)' },
    { tex: 'x_1 = \\frac{k^2 x}{x^2+y^2}, \\qquad y_1 = \\frac{k^2 y}{x^2+y^2}', note: 'in rectangular coordinates, origin at $O$' },
    { tex: 'x^2+y^2+Ax+By+C=0 \\;\\longleftrightarrow\\; C(x^2+y^2)+Ax+By+1=0', note: 'a circle inverts into a circle (here k = 1); when C = 0 the circle passes through O and becomes the line 1 + Ax + By = 0' },
    { tex: 'y^2=hx \\;\\longleftrightarrow\\; \\frac{y^2}{x^2+y^2}=hx \\quad\\text{or}\\quad y^2=\\frac{hx^3}{1-hx}', note: 'parabola at its vertex gives the cissoid (k = 1; the book prints 1 − kx in the denominator)' },
    { tex: 'x^2-y^2+2ax=0 \\;\\longleftrightarrow\\; x^2-y^2+2ax(x^2+y^2)=0 \\quad\\text{or}\\quad y^2=x^2\\,\\frac{1+2ax}{1-2ax}', note: 'rectangular hyperbola at a vertex gives the strophoid' },
    { tex: 'r^2\\cos 2\\theta=1 \\;\\longleftrightarrow\\; \\rho^2=\\cos 2\\theta', note: 'rectangular hyperbola at its centre gives the lemniscate' },
    { tex: 'r=\\frac{1}{a+b\\cos\\theta} \\;\\longleftrightarrow\\; \\rho=a+b\\cos\\theta', note: 'a conic at a focus gives a limaçon' },
    { tex: '\\frac{x^2}{a^2+\\lambda}+\\frac{y^2}{b^2+\\lambda}=1 \\;\\longleftrightarrow\\; \\frac{x^2}{a^2+\\lambda}+\\frac{y^2}{b^2+\\lambda}=(x^2+y^2)^2', note: 'confocal central conics at their centre' }
  ],
  metrical: [
    { tex: 'OP\\cdot OQ = OD\\cdot OC = b^2-a^2', note: 'Peaucellier cell: P and Q are inverse points with k² = b² − a² (bars a and b)' },
    { tex: 'BF\\cdot BA = BP\\cdot BD, \\qquad OP\\cdot OQ = OF\\cdot OA', note: 'Hart cell: F is a fixed point of the bar AB, and the product is constant' }
  ],
  items: [
    { label: 'a', text: 'As $A$ approaches $O$, the distance $O\\bar A$ grows without limit.' },
    { label: 'b', text: 'The points of the circle of inversion are their own inverses (invariant).' },
    { label: 'c', text: 'A circle that cuts the circle of inversion at right angles is carried into itself.' },
    { label: 'd', text: 'The angle between two curves is kept in size but reversed in sense.' },
    { label: 'e', text: 'A circle not through $O$ inverts into another circle; a circle through $O$ (the constant term $C$ is zero) inverts into a straight line.' },
    { label: 'f', text: 'A line through $O$ is carried into itself.' },
    { label: 'g', text: 'An asymptote of a curve becomes a tangent, at $O$, of the inverse curve.' },
    { label: '4a', text: 'With the centre of inversion at its vertex, a parabola inverts into the cissoid of Diocles (Fig. 124); the two points where the parabola crosses the circle stay fixed.' },
    { label: '4b', text: 'With the centre at a vertex, a rectangular hyperbola inverts into the ordinary strophoid (Fig. 125): one branch gives the loop, the other the two arms.' },
    { label: '4c', text: 'With the centre at its own centre, a rectangular hyperbola inverts into a lemniscate (Fig. 126); the asymptotes become the tangents at the node.' },
    { label: '4d', text: 'With the centre at a focus, a conic inverts into a limaçon $\\rho=a+b\\cos\\theta$: an ellipse ($a>b$) into one without an inner loop, a parabola ($a=b$) into the cardioid, a hyperbola ($a<b$) into one with an inner loop (Fig. 127).' },
    { label: '4e', text: 'With the centre at their common centre, confocal central conics invert into a family of ovals (from the ellipses) and figures eight (from the hyperbolas), Fig. 128.' },
    { label: '5a', text: 'The Peaucellier cell (1864), the first mechanical inversor, is two rhombuses (Fig. 129a). Its discovery ended a long search for an exact way to turn circular motion into straight-line motion, a problem many had thought impossible. If the long bars are $b$ and the rhombus side is $a$, then $OP\\cdot OQ=b^2-a^2$.' },
    { label: '5b', text: 'The Hart crossed parallelogram (Fig. 129b) carries four collinear points $O,P,Q,R$ on a line parallel to the bases; they stay collinear when the linkage moves. The circle through $D, A, P, Q$ meets $AB$ again at the fixed point $F$, so $OP\\cdot OQ=OF\\cdot OA$ is constant. Four bars therefore do the work of the Peaucellier cell\'s eight.' },
    { label: '5c', text: 'For line motion add one bar to either mechanism, so that one of the inverse points moves on a circle through the centre of inversion (Fig. 130); the other then moves on a straight line, perpendicular to the line of the two fixed pivots.' },
    { label: '6', text: 'Because $A$ lies on the polar of $\\bar A$, inversion is the theory of poles and polars for the circle (Fig. 131). $A$ and $\\bar A$ divide the diameter through them harmonically. Polars with respect to curves other than the circle lead to the polar theory of the conics (see [[conics]]).' },
    { label: '7', text: 'The problem of Apollonius — a circle tangent to three given circles — is solved by inversion (Fig. 132). If the circles do not meet, increase all three radii by a length $a$ until two of them touch; invert about that point of contact. The two touching circles become parallel lines, the third a circle, and the circle tangent to all three is easy to draw. Invert it back and change its radius by $a$.' },
    { label: '8', text: 'Inversion also produces theorems. A quadrilateral $OABC$ with supplementary opposite angles is cyclic. Invert about $O$: the circle through $O,A,B,C$ becomes a line through $\\bar A,\\bar B,\\bar C$. Letting $B$ run round the circle, $\\bar B$ runs along the line: the locus of the intersection of circles through $O,\\bar A$ and $O,\\bar C$ that meet at a constant angle $\\pi-\\theta$ is the line $\\bar A\\bar C$ (Fig. 133).' }
  ],
  constructions: [
    { fig: 'fig-123b', title: 'The inverse of a point with the compass alone', level: 1 },
    { fig: 'fig-123a', title: 'The inverse of a point by the tangent and the perpendicular', level: 1 },
    { fig: 'fig-131', title: 'Poles and polars: the polar of a point', level: 2 },
    { fig: 'fig-122', title: 'Inverting a triangle with a curved side', level: 2 },
    { fig: 'fig-133', title: 'A cyclic quadrilateral inverted into a line', level: 2 },
    { fig: 'fig-124', title: 'Parabola into cissoid', level: 2 },
    { fig: 'fig-126', title: 'Rectangular hyperbola into lemniscate', level: 2 },
    { fig: 'fig-125', title: 'Rectangular hyperbola into strophoid', level: 3 },
    { fig: 'fig-132', title: 'The problem of Apollonius by inversion', level: 3 },
    { fig: 'fig-127a', title: 'An ellipse into a limaçon', level: 3 },
    { fig: 'fig-127b', title: 'A parabola into a cardioid', level: 3 },
    { fig: 'fig-127c', title: 'A hyperbola into a limaçon with an inner loop', level: 3 },
    { fig: 'fig-128', title: 'Confocal conics into ovals and figures eight', level: 3 },
    { fig: 'fig-129a', title: 'The Peaucellier cell', level: 3 },
    { fig: 'fig-129b', title: 'The Hart crossed parallelogram', level: 3 },
    { fig: 'fig-130a', title: 'Peaucellier cell with the extra bar', level: 3 },
    { fig: 'fig-130b', title: 'Hart cell with the extra bar', level: 3 }
  ],
  tables: [
    {
      title: 'Some inversions',
      head: ['Curve', 'Centre of inversion', 'Inverse'],
      rows: [
        ['Parabola', 'its vertex', 'cissoid of Diocles'],
        ['Rectangular hyperbola', 'a vertex', 'ordinary strophoid'],
        ['Rectangular hyperbola', 'its centre', 'lemniscate of Bernoulli'],
        ['Conic', 'a focus', 'limaçon of Pascal'],
        ['Confocal central conics', 'their centre', 'ovals and figures eight'],
        ['Circle', 'a point not on it', 'a circle'],
        ['Circle', 'a point on it', 'a straight line'],
        ['Straight line', 'a point not on it', 'a circle through the centre']
      ]
    }
  ],
  bibliography: [
    'Adler, A.: Geometrischen Konstruktionen, Leipzig (1906) 37 ff.',
    'Courant and Robbins: What is Mathematics? Oxford (1941) 158.',
    'Daus, P. H.: College Geometry, Prentice-Hall (1941) Chap. 3.',
    'Johnson, R. A.: Modern Geometry, Houghton-Mifflin (1929) 43 ff.',
    'Shively, L. S.: Modern Geometry, John Wiley (1939) 80.',
    'Yates, R. C.: Tools, A Mathematical Sketch and Model Book, L. S. U. Press (1941).'
  ],
  seeAlso: ['circle', 'conics', 'cissoid', 'strophoid', 'lemniscate', 'limacon', 'cassinian', 'pedal-curves']
});
