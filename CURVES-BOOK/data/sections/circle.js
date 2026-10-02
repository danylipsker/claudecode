/* Curves Workshop · data/sections/circle.js — The Circle (pages 21–25) */
Curves.section({
  id: 'circle',
  title: 'The Circle',
  pages: [21, 25],
  history: 'The circle is the oldest curve of geometry. The properties collected here come from classical sources: Archimedes studied the arbelos, Apollonius set the problem of the circle tangent to three circles, Pappus found the chain of circles inside the arbelos, and Jakob Steiner studied the chains of tangent circles that close up and bear his name.',
  description: 'A circle is a plane curve whose points are all at the same distance, the radius $a$, from a fixed point of the plane, the centre. It is the simplest curve of constant curvature, and the starting point of most of the roulettes and envelopes of this book (see [[epi-hypo-cycloids]] and [[roulettes]]).',
  equations: [
    { tex: '(x - h)^2 + (y - k)^2 = a^2', note: 'rectangular, centre $(h, k)$, radius $a$' },
    { tex: 'x^2 + y^2 + Ax + By + C = 0', note: 'general form' },
    { tex: '\\begin{vmatrix} x^2 + y^2 & x & y & 1 \\\\ x_1^2 + y_1^2 & x_1 & y_1 & 1 \\\\ x_2^2 + y_2^2 & x_2 & y_2 & 1 \\\\ x_3^2 + y_3^2 & x_3 & y_3 & 1 \\end{vmatrix} = 0', note: 'the circle through three points $(x_1, y_1)$, $(x_2, y_2)$, $(x_3, y_3)$' },
    { tex: 'x = h + a\\cos\\theta, \\qquad y = k + a\\sin\\theta', note: 'parametric' },
    { tex: 's = a\\varphi', note: 'Whewell intrinsic equation (arc length against inclination of the tangent)' },
    { tex: 'R = a', note: 'radius of curvature' },
    { tex: 'p\\,a = r^2', note: 'pedal equation for a pole on the circle ($a$ is then the diameter; with $a$ the radius it reads $r^2 = 2ap$)' }
  ],
  metrical: [
    { tex: 'L = 2\\pi a', note: 'circumference' },
    { tex: 'A = \\pi a^2', note: 'area' },
    { tex: '\\Sigma = 4\\pi a^2', note: 'surface of revolution (the sphere)' },
    { tex: 'V = \\dfrac{4\\pi a^3}{3}', note: 'volume of revolution (the sphere)' },
    { tex: 'R = a', note: 'radius of curvature' }
  ],
  items: [
    { label: 'a', text: '*The secant property* (Fig. 18a). Lines drawn from a fixed point $P$ to cut a fixed circle give a constant product of the two parts of each line: $PA\\cdot PB = PD\\cdot PC$. The reason is that the triangles $PAD$ and $PCB$ are similar (the two arcs subtended by the angles at $C$ and $A$ together make the whole circumference). To find the constant $p$, take the line through $P$ and the centre $O$: $(PO - a)(PO + a) = p = PO^2 - a^2$. This $p$ is the *power of the point* $P$ with respect to the circle; it is negative, zero or positive according as $P$ is inside, on or outside the circle.' },
    { label: 'a2', text: '*The radical axis* (Fig. 18b). The locus of the points of equal power with respect to two fixed circles is a straight line, their *radical axis*; when the circles cut, it is their common chord. The three radical axes of three circles meet in one point, the *radical centre*, which has equal power for all three circles. To construct the radical axis of two circles, draw an arbitrary third circle cutting both: the two common chords meet on the required axis.' },
    { label: 'b', text: '*Similitude* (Fig. 19). Any two coplanar circles have two centres of similitude: the points $I$ and $E$ where the lines joining the ends of parallel diameters meet; they lie on the line of centres. The six centres of similitude of three circles lie three by three on four straight lines. The external centre of similitude of the circumcircle and the nine-point circle of a triangle is its orthocentre.' },
    { label: 'c', text: '*The problem of Apollonius* (Fig. 20) asks for a circle tangent to three given circles that do not belong to one coaxal pencil; in general there are eight solutions. By inversion (see [[inversion]]) the problem is reduced to drawing a circle through three given points.' },
    { label: 'd', text: '*Trains* (Fig. 21). A series of circles, each tangent to two given non-intersecting circles and to another member of the series, is a *train*. A train does not in general close up on itself; when it does, it is a *Steiner chain*. Any Steiner chain can be inverted into one tangent to two concentric circles. Two concentric circles admit a Steiner chain of $n$ circles going $k$ times round the common centre when the angle each circle subtends at the centre is commensurable with $360^\\circ$, namely $\\tfrac{k}{n}\\cdot 360^\\circ$. If two circles admit one Steiner chain, they admit infinitely many.' },
    { label: 'e1', text: '*The arbelos* (Fig. 22), or shoemaker\'s knife, is the figure bounded by the three semicircles $AXB$, $BYC$ and $AZC$ on the collinear points $A$, $B$, $C$. It was studied by Archimedes. First, the arcs satisfy $\\text{arc } AXB + \\text{arc } BYC = \\text{arc } AZC$ in length.' },
    { label: 'e2', text: 'The area of the arbelos equals the area of the circle on $BZ$ as diameter, where $BZ$ is the perpendicular to $AC$ at $B$ meeting the large semicircle at $Z$.' },
    { label: 'e3', text: 'The circles inscribed in the two three-sided figures $ABZ$ and $CBZ$ are equal (Archimedes\' twin circles), each with diameter $\\dfrac{AB\\cdot BC}{AC}$.' },
    { label: 'e4', text: '*Pappus.* Take the train of circles $c_0, c_1, c_2, \\ldots$ all tangent to the circles on $AC$ and $AB$, with $c_0$ the circle on $BC$. If $r_n$ is the radius of $c_n$ and $h_n$ the distance of its centre from the line $ABC$, then $h_n = 2n\\,r_n$. (Invert with $A$ as centre: the circles on $AB$ and $AC$ become parallel lines and the train becomes a stack of equal circles between them.)' }
  ],
  constructions: [
    { fig: 'fig-018a', title: 'The secant property: two secants and the similar triangles', level: 1 },
    { fig: 'fig-018b', title: 'The radical axis of two circles by a third circle', level: 2 },
    { fig: 'fig-019', title: 'The centres of similitude I and E', level: 2 },
    { fig: 'fig-021b', title: 'A Steiner chain between two concentric circles', level: 2 },
    { fig: 'fig-022', title: 'The arbelos and the train of Pappus', level: 2 },
    { fig: 'fig-021a', title: 'A train between two circles that are not concentric', level: 3 },
    { fig: 'fig-020', title: 'The problem of Apollonius: a circle tangent to three circles', level: 3 }
  ],
  bibliography: [
    'Daus, P. H.: College Geometry, Prentice-Hall (1941).',
    'Johnson, R. A.: Modern Geometry, Houghton Mifflin (1929) 113.',
    'Mackay, J. S.: Proc. Ed. Math. Soc. III (1884) 2.',
    'Shively, L. S.: Modern Geometry, John Wiley (1939) 151.'
  ],
  seeAlso: ['inversion', 'conics', 'curvature', 'intrinsic', 'epi-hypo-cycloids']
});
