/* Curves Workshop · data/sections/conchoid.js — Conchoid (pages 31–33) */
Curves.section({
  id: 'conchoid',
  title: 'Conchoid',
  pages: [31, 33],
  history: 'Nicomedes, about 225 BC, used the conchoid (the name means "shell-like") to find two mean proportionals between two given lengths, which amounts to extracting a cube root.',
  description: 'Take a curve and a fixed point $O$. A variable line through $O$ meets the curve at $A$. On the line, at the distances $+k$ and $-k$ from $A$, mark the points $P_1$ and $P_2$ (Fig. 27). The locus of $P_1$ and $P_2$ is the *conchoid* of the given curve with respect to $O$. The conchoid of a straight line is the *conchoid of Nicomedes* (Fig. 28), and the conchoid of a circle with the fixed point on the circle is the limaçon of Pascal (see [[limacon]]). The pole $O$ is a singular point of the conchoid of Nicomedes: a double point (the inner branch makes a loop) if $a < k$, a cusp if $a = k$, and an isolated point if $a > k$.',
  equations: [
    { tex: 'r = f(\\theta) \\pm k', note: 'general: conchoid of the curve $r = f(\\theta)$ with respect to the origin $O$' },
    { tex: 'r = a\\csc\\theta \\pm k', note: 'conchoid of Nicomedes (Fig. 28), $O$ at the distance $a$ from the line' },
    { tex: '(x^2 + y^2)(y - a)^2 = k^2 y^2', note: 'conchoid of Nicomedes, rectangular' }
  ],
  metrical: [],
  items: [
    { label: 'a', text: 'Tangent construction (Fig. 28): draw the perpendicular to $AX$ at $A$ and the perpendicular to $OA$ at $O$. They meet at $H$, the centre of rotation of every point of $OA$. So $HP_1$ and $HP_2$ are the normals to the curve at $P_1$ and $P_2$.' },
    { label: 'b', text: 'Trisection of an angle $XOY$ with a marked ruler (Fig. 29), which uses the conchoid of Nicomedes. The two marks $P$ and $Q$ of the ruler are $2k$ apart. Take $OB = k$ on $OY$, draw $BC$ parallel to $OX$ and $BA$ perpendicular to $OX$. Slide the ruler with its edge through $O$ and the mark $P$ on $AB$; the mark $Q$ traces a conchoid, and when $Q$ falls on $BC$ the edge makes the angle $\\tfrac13 XOY$ with $OX$.' },
    { label: 'c', text: 'The conchoid of Nicomedes is a special kieroid (see [[kieroid]]).' }
  ],
  constructions: [
    { fig: 'fig-027', title: 'The conchoid of a curve: lay off $\\pm k$ along each secant', level: 1 },
    { fig: 'fig-028', title: 'The conchoid of Nicomedes and its tangent', level: 2 },
    { fig: 'fig-029', title: 'Trisecting an angle with the marked ruler', level: 3 }
  ],
  bibliography: [
    'Mortiz, R. E.: Univ. of Washington Publications, (1923) [for conchoids of r = cos(p/q)θ].',
    'Hilton, H.: Plane Algebraic Curves, Oxford (1932).'
  ],
  seeAlso: ['cissoid', 'kieroid', 'limacon', 'strophoid', 'instantaneous-center']
});
