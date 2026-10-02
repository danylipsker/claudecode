/* Curves Workshop · data/sections/cissoid.js — Cissoid (pages 26–30) */
Curves.section({
  id: 'cissoid',
  title: 'Cissoid',
  pages: [26, 30],
  history: 'Diocles, working somewhere between 250 and 100 BC, used the ordinary cissoid (the Greek word means "ivy") to find two mean proportionals between two given lengths, which is the same as extracting a cube root. In 1689 J. C. Sturm described in his Mathesis Enucleata a linkage that draws the cissoid of Diocles.',
  description: 'Take two curves and a fixed point $O$. A secant through $O$ meets the first curve at $Q$ and the second at $R$ (Fig. 23). The point $P$ of the secant with $OP = QR$ describes the *cissoid* of the two curves with respect to $O$. When the curves are a line and a circle the *ordinary* family of cissoids appears, and it is the only one studied here. The circle has radius $a$, its centre $K$ lies on $OX$ and it passes through $O$; the line $L$ is perpendicular to $OX$ at the distance $2(a+b)$ from $O$. The cissoid is the locus of $P$ on the secant with $OP = r = QR$ (Fig. 24). Equivalently, $P$ is the second intersection of the secant $OR$ with a circle of radius $a$ that rolls along $L$ and touches it at $R$. The curve has a cusp at $O$ when $b = 0$ (the *cissoid of Diocles*) and a double point when the rolling circle passes between $O$ and $K$. The line $L$ is its asymptote.',
  equations: [
    { tex: 'r = 2(a+b)\\sec\\theta - 2a\\cos\\theta', note: 'polar, pole at $O$' },
    { tex: 'y^2 = \\dfrac{x^2\\,(2b - x)}{x - 2(a+b)}', note: 'rectangular' },
    { tex: 'x = \\dfrac{2\\left[b + (a+b)t^2\\right]}{1+t^2}, \\qquad y = \\dfrac{2\\left[bt + (a+b)t^3\\right]}{1+t^2}', note: 'parametric' },
    { tex: 'r = 2a\\sin\\theta\\tan\\theta, \\qquad y^2 = \\dfrac{x^3}{2a - x}', note: 'cissoid of Diocles ($b = 0$)' }
  ],
  metrical: [
    { tex: 'V = 2\\pi^2 a^3', note: 'cissoid of Diocles: volume of revolution about the asymptote' },
    { tex: '\\bar{x} = \\tfrac{5a}{3}', note: 'cissoid of Diocles: centroid of the area between curve and asymptote' },
    { tex: 'A = 3\\pi a^2', note: 'cissoid of Diocles: area between curve and asymptote, three times the generating circle (the book prints $\\pi a^2$, which is a misprint)' }
  ],
  items: [
    { label: 'a', text: 'The Peaucellier cell (Fig. 25) draws a whole family of these cissoids. Let the fixed pivots be $O$ and $C$ with $OC = c$, let the bar $CQ$ also have length $c$, and let $Q$, $O$, $P$ stay on one line with $(OQ)(QP) = k^2 = 1$. Then $2c\\cos\\theta\\,(2c\\cos\\theta + r) = 1$, that is $r = \\tfrac{1}{2c}\\sec\\theta - 2c\\cos\\theta$. For $c < \\tfrac12$, $c = \\tfrac12$, $c > \\tfrac12$ the curve has no loop, a cusp, a loop respectively.' },
    { label: 'b', text: 'The inverse of the family in (a) with respect to $O$ (with $r\\rho = 1$) is $y^2 + x^2(1 - 4c^2) = 2cx$: an ellipse, a parabola or a hyperbola as $c$ is less than, equal to or greater than $\\tfrac12$ (see [[conics]]).' },
    { label: 'c', text: 'Newton\'s carpenter\'s square (Fig. 26) draws cissoids. The right angle of the square is at $Q$; the corner end $A$ of the edge $AQ$ slides along the line $CA$ while the other edge passes through the fixed point $B$ of the line $BC$ perpendicular to $AC$. With $AP = OB = b$ and $BC = AQ = 2a$, $O$ the origin and $P$ a fixed point of $AQ$, we have $AB = 2a\\sec\\theta$ and the path of $P$ is $r = 2a\\sec\\theta - 2b\\cos\\theta$. The point $Q$ itself describes a strophoid (see [[strophoid]]).' },
    { label: 'd', text: 'Tangent construction (Fig. 26): $A$ moves along the direction $CA$ while the point of the square at $B$ moves along $BQ$. The normals to $AC$ at $A$ and to $BQ$ at $B$ meet in $H$, the centre of rotation, so $HP$ is the normal to the path of $P$.' },
    { label: 'e', text: 'The cissoid $y^2 = \\dfrac{x^3}{a - x}$ is the pedal of the parabola $y^2 = -4ax$ with respect to its vertex (see [[pedal-curves]]).' },
    { label: 'f', text: 'It is a special kieroid (see [[kieroid]]).' },
    { label: 'g', text: 'The cissoid as a roulette: it is the locus of the vertex of a parabola that rolls on an equal fixed parabola. The common tangent always reflects the fixed vertex into the moving vertex, so the locus is a curve similar to the pedal with respect to the vertex (see [[roulettes]]).' },
    { label: 'h', text: 'The cissoid of an algebraic curve and a line is itself algebraic.' },
    { label: 'i', text: 'The cissoid of a line and a circle with respect to the centre of the circle is the conchoid of Nicomedes (see [[conchoid]]).' },
    { label: 'j', text: 'The strophoid is the cissoid of a circle and a line through its centre, taken with respect to a point of the circle. The cissoid of Diocles is used in the design of planing hulls (Lord).' },
    { label: 'k', text: 'The cissoid of two concentric circles with respect to their common centre is a circle.' },
    { label: 'l', text: 'The cissoid of a pair of parallel lines is a line.' }
  ],
  constructions: [
    { fig: 'fig-023', title: 'The cissoid of two curves: lay off QR from O on the secant', level: 1 },
    { fig: 'fig-024', title: 'The cissoid of a circle and a line, with the rolling circle', level: 2 },
    { fig: 'fig-026', title: 'The carpenter\'s square, and the centre of rotation H', level: 3 },
    { fig: 'fig-025', title: 'The Peaucellier cell', level: 3 }
  ],
  bibliography: [
    'Hilton, H.: Plane Algebraic Curves, Oxford (1932) 175, 203.',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908) 37ff.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 182ff.',
    'Niewenglowski, B.: Cours de Géométrie Analytique, Paris (1895) II, 115.',
    'Lord, Lindsay: The Naval Architecture of Planing Hulls, Cornell Maritime Press (1946) 77.'
  ],
  seeAlso: ['conchoid', 'strophoid', 'kieroid', 'conics', 'pedal-curves', 'roulettes', 'inversion']
});
