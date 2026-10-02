/* Curves Workshop · data/sections/parallel.js — Parallel Curves (pages 155–159) */
Curves.section({
  id: 'parallel',
  title: 'Parallel Curves',
  pages: [155, 159],
  history: 'Leibniz was the first to study parallel curves, in 1692–94; he was most likely led to them by the involutes that Huygens had found in 1673.',
  description: 'Take a moving point $P$ on a given curve and measure the distance $k$ along the normal at $P$, once on each side: the two points $Q$ and $Q\'$ (at $+k$ and $-k$) trace a **parallel curve** of the given one (Fig. 147). It has two branches, one on each side of the curve. For some values of $k$ a parallel curve looks much like the curve it comes from; for other values it can be quite unlike it, with cusps and loops (Fig. 149). A pair of wheels on a common axle, perpendicular to their planes, leaves two parallel tracks.',
  equations: [
    { tex: 'x_k = x \\mp \\frac{k\\,y\'}{\\sqrt{x\'^2 + y\'^2}}, \\qquad y_k = y \\pm \\frac{k\\,x\'}{\\sqrt{x\'^2 + y\'^2}}', note: 'a parallel curve of the curve $(x(t), y(t))$: the point moved by $\\mp k$, $\\pm k$ along the unit normal (follows from the definition)' },
    { tex: 'ax + by + c = \\pm k\\sqrt{a^2 + b^2}', note: 'the lines of which a parallel curve is the envelope: parallel to the tangent $ax + by + c = 0$ at distance $\\pm k$' },
    { tex: '\\left[\\,3(x^2 + y^2 - a^2) - 4k^2\\,\\right]^3 + \\left[\\,27axy - 9k(x^2 + y^2) - 18a^2k + 8k^3\\,\\right]^2 = 0', note: 'the parallel curves of the astroid $x^{2/3} + y^{2/3} = a^{2/3}$, both branches at once (replace $k$ by $-k$ for the other)' }
  ],
  metrical: [
    { tex: 'L_{+k} - L_{-k} = 4\\pi k', note: 'the two branches of a parallel curve of a closed curve differ in length by $4\\pi k$' }
  ],
  items: [
    { label: 'a', text: 'Parallel curves share their normals, so they share their evolute (see [[evolutes]]).' },
    { label: 'b', text: 'The tangent to the given curve at $P$ is parallel to the tangent of the parallel curve at $Q$. A parallel curve is therefore the envelope of the lines $ax + by + c = \\pm k\\sqrt{a^2 + b^2}$, at distance $\\pm k$ from the tangent $ax + by + c = 0$ of the given curve (see [[envelopes]]).' },
    { label: 'c', text: 'A parallel curve is also the envelope of the circles of radius $k$ whose centres run along the given curve: a quick way to sketch parallel curves.' },
    { label: 'd', text: 'All involutes of one curve are parallel to each other (Fig. 148; see [[involutes]]).' },
    { label: 'e', text: 'The two branches of a parallel curve differ in length by $4\\pi k$.' },
    { label: 'f', text: 'Curves parallel to a parabola have degree 6; those parallel to the central conics have degree 8 (see Salmon, Conics, in the bibliography; [[conics]]).' },
    { label: 'g', text: 'The parallel curves of the astroid are given by the sextic above (see [[astroid]]).' }
  ],
  constructions: [
    { fig: 'fig-147', title: 'The definition: laying off k on the normal', level: 1 },
    { fig: 'fig-149a', title: 'Curves parallel to an ellipse, point by point', level: 2 },
    { fig: 'fig-149b', title: 'Curves parallel to a parabola (a swallowtail inside)', level: 2 },
    { fig: 'fig-148', title: 'Involutes of a curve as parallel curves', level: 2 },
    { fig: 'fig-149f', title: 'Curves parallel to an astroid', level: 3 },
    { fig: 'fig-150', title: 'A linkage that draws curves parallel to an ellipse', level: 3 }
  ],
  extra: '### A linkage for curves parallel to the ellipse (Fig. 150)\n\nTwo *proportional* crossed parallelograms, $OO\'EDO$ and $OO\'FAO$, make a straight-line mechanism. On $OA$ and $OH$ the rhombus $OABH$ is completed. Because $OO\'$, the line of the frame, always bisects the angle $AOH$, the corner $B$ is forced to slide along $OO\'$. Any point $P$ of the bar $AB$ then describes an ellipse whose semi-axes are $OA + AP$ and $PB$.\n\nSince $A$ moves on a circle about $O$ and $B$ along the line $OO\'$, the instantaneous centre of rotation of $P$ is the point $C$ where $OA$ produced meets the perpendicular to $OO\'$ at $B$; $C$ always lies on the circle about $O$ of radius $2\\,OA$. The kite $CAPG$ is completed with $AP = PG$ and $CA = CG$, and two more crossed parallelograms, $APMJA$ and $PMNRP$, are attached so that $PM$ bisects the angle $APG$ and is always directed towards $C$. So $PM$ is the normal to the path of $P$, and any point $Q$ of that bar describes a curve parallel to the ellipse.',
  bibliography: [
    'Dienger: Arch. der Math. IX (1847).',
    'Loria, G.: Spezielle Algebraische und Transzendente ebene Kurven, Leipzig (1902).',
    'Salmon, G.: Conic Sections, Longmans, Green (1879) 337; Par. 372, Ex. 2.',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908).',
    'Yates, R. C.: American Mathematical Monthly (1938) 607.'
  ],
  seeAlso: ['involutes', 'evolutes', 'envelopes', 'conics', 'astroid', 'lemniscate', 'semi-cubic-parabola', 'instantaneous-center']
});
