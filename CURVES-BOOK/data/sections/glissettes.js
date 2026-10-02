/* Curves Workshop · data/sections/glissettes.js — Glissettes, pages 108–112 */
Curves.section({
  id: 'glissettes',
  title: 'Glissettes',
  pages: [108, 112],
  history: 'The idea is as old as the Greeks: the trammel of Archimedes and the conchoid of Nicomedes are both glissettes. A systematic study had to wait for W. H. Besant, who published a short tract on the subject in 1869 (his book *Roulettes and Glissettes* is dated 1870).',
  description: 'A *glissette* is the locus of a point, or the envelope of a curve, that is carried by a curve while that curve slides between given curves. The simplest case is the rod of the trammel of Archimedes, whose ends run on two perpendicular lines (Fig. 104): every point of the rod describes an ellipse, and the rod itself envelops an [[astroid]]. A rigid angle whose sides slide on two fixed points carries its vertex round an arc of a circle (Fig. 104a); a rod through a fixed point, with one point on a given curve, carries a point on the conchoid of that curve (Fig. 105). A close relative is the curve that is made to touch a given curve always at the same fixed point (items 6b and 6c). By the general theorem of item 5 every motion of a figure in its plane is a rolling of one curve on another, so the problem of glissettes reduces to a problem of roulettes (see [[roulettes]] and [[instantaneous-center]]).',
  equations: [
    { tex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1', note: 'path of the point P of the trammel rod AB, with PB = a (the semi-axis along the line that carries A) and PA = b (Fig. 104b)' },
    { tex: 'x^{2/3} + y^{2/3} = L^{2/3}', note: 'envelope of the rod AB of length L = AB: an astroid (Fig. 104c)' },
    { tex: 'r = f(\\theta) + k', note: 'glissette of the point P of the rod, k from A, when A runs on the curve r = f(θ) and the rod passes through the pole O: the conchoid of the curve (Fig. 105)' },
    { tex: 'y = p = f(\\varphi), \\qquad x = f\\!\\left(\\varphi + \\tfrac{\\pi}{2}\\right)', note: 'point glissette of a curve p = f(φ), referred to the carried point P, sliding on the coordinate axes (Fig. 106)' },
    { tex: 'x = \\sin 2\\varphi, \\qquad y = -\\sin 2\\varphi', note: 'the astroid p = sin 2φ, referred to its centre, gives for the centre a segment of the line x + y = 0' },
    { tex: 'x^2 y^2 (x^2 + y^2 + 3a^2) = a^6', note: 'locus of the vertex of a parabola that slides on the x and y axes (item 6a)' },
    { tex: 'x^2 y^2 = a^2 (x^2 + y^2)', note: 'locus of the focus of that parabola (item 6a)' },
    { tex: 'x^2 y^2 = (a^2 - y^2)(y^2 - b^2)', note: 'path of the centre of an ellipse that touches a straight line always at the same point (item 6b)' }
  ],
  metrical: [
    { tex: 'A_{\\text{curve}} - A_{\\text{locus of }P} = \\pi a b', note: 'bar APB with PA = a, PB = b and its ends on a simple closed curve (Fig. 109, item 6d)' },
    { tex: 'OI = AB, \\qquad r_{\\text{rolling}} = \\tfrac12\\, r_{\\text{fixed}}', note: 'the instantaneous centre I of the trammel lies on the circle of centre O and radius AB; the circle on AB as diameter rolls inside it (Fig. 108)' }
  ],
  items: [
    { label: '1', text: 'The glissette of any point of the trammel rod, or of any point rigidly attached to it, is an ellipse.' },
    { label: '2', text: 'The envelope glissette of the rod itself is the astroid (see [[envelopes]], Fig. 104c).' },
    { label: '2a', text: 'If a rigid angle has its two sides sliding on two fixed points A and B, its vertex P describes an arc of a circle through A and B, because the angle APB stays the same (Fig. 104a). Any point Q of AP then describes a limacon (see [[limacon]]).' },
    { label: '2c', text: 'A rod passes always through a fixed point $O$ while its point $A$ moves on a given curve $r = f(\\theta)$. A point $P$ of the rod, at the distance $k$ from $A$, describes the conchoid $r = f(\\theta) + k$ of the given curve (Fig. 105; see [[conchoid]]). Moritz (University of Washington Publications, 1923) shows many members of this family, for the base curve $r = \\cos(p\\theta/q)$.' },
    { label: '3', text: 'Point glissette of a curve that slides between the coordinate axes: if the curve is given as $p = f(\\varphi)$ with respect to the carried point $P$, then $y = p = f(\\varphi)$ and $x = f(\\varphi + \\pi/2)$ are parametric equations of the path of $P$ (Fig. 106). The astroid $p = \\sin 2\\varphi$, referred to its centre, gives $x = \\sin 2\\varphi$, $y = -\\sin 2\\varphi$: the centre moves along a segment of $x + y = 0$.' },
    { label: '4', text: 'A triangle ABC moves with two of its sides touching two fixed circles with centres X and Y. The parallels XA\' and YA\' to those sides are fixed in the triangle, and the circle through A\', X and Y is a fixed circle. The side BC then touches a fixed circle whose centre D is a fixed point of that circle and whose radius is the altitude of the triangle A\'B\'C\' (Fig. 107). The point glissettes of the triangle (for instance, of any point F of A\'C\') are limacons.' },
    { label: '5', text: 'General theorem: any motion of a configuration in its plane can be represented by the rolling of a determinate curve on another determinate curve, so a glissette problem is a roulette problem. In the trammel, the instantaneous centre $I$ lies on the fixed circle of radius $AB$ about $O$ and also on the circle with diameter $AB$ that travels with the rod; the motion is that of a circle rolling inside a circle twice as large (Fig. 108).' },
    { label: '6a', text: 'A parabola slides on the $x$ and $y$ axes: the vertex describes $x^2y^2(x^2 + y^2 + 3a^2) = a^6$ and the focus describes $x^2y^2 = a^2(x^2 + y^2)$.' },
    { label: '6b', text: 'The centre of an ellipse (semi-axes $a$, $b$) that touches a straight line always at the same point describes the curve $x^2y^2 = (a^2 - y^2)(y^2 - b^2)$.' },
    { label: '6c', text: 'A parabola slides on a straight line, touching it always at a fixed point of the line: its focus describes a hyperbola.' },
    { label: '6d', text: 'The bar $APB$, with $PA = a$ and $PB = b$, moves with its ends on a simple closed curve. The area between the curve and the locus of $P$ is $\\pi ab$, whatever the curve (Fig. 109). The bar has to be short enough to be able to go all the way round.' },
    { label: '6e', text: 'The vertex of a carpenter\'s square moves on a circle while one arm passes through a fixed point F. The envelope of the other arm is a conic with F as focus: a hyperbola if F is outside the circle, an ellipse if it is inside, a parabola if the circle is replaced by a line (Fig. 110; see [[conics]]).' }
  ],
  constructions: [
    { fig: 'fig-104b', title: 'The trammel of Archimedes: the ellipse of a point of the rod', level: 1 },
    { fig: 'fig-104c', title: 'The astroid as the envelope of the trammel rod', level: 1 },
    { fig: 'fig-104a', title: 'The vertex of a rigid angle moves on a circle', level: 1 },
    { fig: 'fig-105', title: 'The conchoid of a given curve as a glissette', level: 2 },
    { fig: 'fig-108', title: 'The trammel as a circle rolling in a circle twice as large', level: 2 },
    { fig: 'fig-106', title: 'Point glissette of a curve sliding between the axes', level: 2 },
    { fig: 'fig-107', title: 'A triangle touching two fixed circles', level: 3 },
    { fig: 'fig-110', title: 'The carpenter\'s square and the conic with focus F', level: 3 }
  ],
  bibliography: [
    'American Mathematical Monthly: v 52, 384.',
    'Besant, W. H.: Roulettes and Glissettes, London (1870).',
    'Encyclopaedia Britannica, 14th Ed., "Curves, Special."',
    'Walker, G.: National Mathematics Magazine, 12, 13 (1937-8, 1938-9).'
  ],
  seeAlso: ['astroid', 'conchoid', 'conics', 'envelopes', 'instantaneous-center', 'limacon', 'roulettes']
});
