/* Curves Workshop · data/sections/kieroid.js — Kieroid (pages 141–142) */
Curves.section({
  id: 'kieroid',
  title: 'Kieroid',
  pages: [141, 142],
  history: 'P. J. Kiernan devised this curve in 1945 to show that the conchoid, the cissoid and the strophoid belong to one family.',
  description: 'A circle of radius $a$ has its centre $B$ on a line $AB$. A fixed point $O$ lies at the distance $c$ from $AB$ ($A$ is the foot of the perpendicular from $O$). A second line $DE$ is parallel to $AB$ at the distance $b$, and $D$ is the point of $DE$ directly "below" $B$, that is, the middle of the chord that the circle cuts from $DE$ (Fig. 138). The secant $OD$ meets the circle at $P_1$ and $P_2$, and as $B$ slides along $AB$ these two points trace the *kieroid*. The curve has two branches. It has a double point if $c < a$ and a cusp if $c = a$. The book says that there are two asymptotes, "as shown" in the figure; the construction itself shows that far out both branches run along the line $DE$.\n\nThree special cases matter (Fig. 139). If $b = 0$ the lines $AB$ and $DE$ coincide, $D = B$, and the curve is the conchoid of Nicomedes (see [[conchoid]]). If $b = a$ the circle touches $DE$ at $D$; $P_1$ stays on the line $DE$, which is the "asymptote" that accompanies the curve, and $P_2$ traces a cissoid (see [[cissoid]]). If $b = a$ and $O$ lies on $AB$ (the book writes $b = a = -c$ and says that $O$ and $A$ coincide), $P_2$ traces a strophoid together with its asymptote (see [[strophoid]]).',
  equations: [
    { tex: 'r = (b + c)\\sec\\theta - b\\cos\\theta \\pm \\sqrt{a^2 - b^2\\sin^2\\theta}', note: 'polar, pole at $O$, $\\theta$ measured from the perpendicular $OA$ to $AB$ (worked out here from the construction; the book leaves the equations as an exercise)' },
    { tex: 'r = c\\sec\\theta \\pm a', note: '$b = 0$: conchoid of Nicomedes' },
    { tex: 'r = (a + c)\\sec\\theta - 2a\\cos\\theta, \\qquad r = (a + c)\\sec\\theta', note: '$b = a$: a cissoid and the line $DE$' },
    { tex: 'r = a\\sec\\theta - 2a\\cos\\theta, \\qquad r = a\\sec\\theta', note: '$b = a$, $c = 0$: a strophoid and the line $DE$' }
  ],
  metrical: [],
  items: [],
  constructions: [
    { fig: 'fig-139a', title: 'Special case b = 0: the conchoid', level: 1 },
    { fig: 'fig-139b', title: 'Special case b = a: the cissoid', level: 2 },
    { fig: 'fig-139c', title: 'Special case b = a, O on AB: the strophoid', level: 2 },
    { fig: 'fig-138', title: 'The general kieroid', level: 2 }
  ],
  bibliography: [],
  seeAlso: ['conchoid', 'cissoid', 'strophoid']
});
