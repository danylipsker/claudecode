/* Curves Workshop · data/sections/semi-cubic-parabola.js — Semi-Cubic Parabola (pages 186–187) */
Curves.section({
  id: 'semi-cubic-parabola',
  title: 'Semi-Cubic Parabola',
  pages: [186, 187],
  history: 'The curve $ay^2 = x^3$ was the first algebraic curve whose length could be found exactly (Neil, 1659). In 1687 Leibniz asked for the curve down which a particle falls through equal vertical distances in equal times, when it starts with a speed that is not zero; Huygens announced that the answer is a semi-cubic parabola whose cusp tangent is vertical.',
  description: 'The semi-cubic parabola is the curve $y^2 = Ax^3 + Bx^2 + Cx + D = A(x-a)(x^2+bx+c)$: the square of $y$ is a cubic polynomial in $x$. Its simplest form is $ay^2 = x^3$, which has a cusp at the origin. Because of a fancied likeness to flowers the general curve was also called a *calyx*, and according to the relative values of the constants it includes shapes named Tulip, Hyacinth, Convolvulus, Pink, Fuchsia, Bulbus and so on (Loria).\n\nTo sketch it, first draw the cubic $y_1 = y^2$ (the cubic parabola, see [[sketching]], section 10) and then take square roots of its ordinates: where $y_1 < 0$ there is no real $y$, where $y_1 > 0$ there are two values $\\pm\\sqrt{y_1}$, so the curve is symmetric about the $x$-axis ([[fig-170a]] to [[fig-170d]]). The book draws the two scales differently on purpose; only the shape matters.',
  equations: [
    { tex: 'y^2 = Ax^3 + Bx^2 + Cx + D = A(x-a)(x^2+bx+c)', note: 'general semi-cubic parabola (the calyx)' },
    { tex: 'ay^2 = x^3', note: 'the semi-cubic parabola proper' },
    { tex: 'x = at^2,\\quad y = at^3', note: 'parametric form of $ay^2 = x^3$ (not in the book; it satisfies $ay^2 = a^3t^6 = x^3$)' },
    { tex: '27ay^2 = 4(x-2a)^3', note: 'the semi-cubic parabola that is the evolute of the parabola $y^2 = 4ax$' },
    { tex: 'a(a-18x)^3 = \\left[54ax + \\tfrac{729}{16}\\,y^2 + a^2\\right]^2', note: 'evolute of $ay^2 = x^3$' }
  ],
  metrical: [
    { tex: 's = \\tfrac{8a}{27}\\left[\\left(1+\\tfrac{9x}{4a}\\right)^{3/2}-1\\right]', note: 'length of $ay^2 = x^3$ from the cusp to the abscissa $x$ (not in the book; from the parametric form, $ds = at\\sqrt{4+9t^2}\\,dt$)' }
  ],
  items: [
    { label: 'a', text: 'The curve $27ay^2 = 4(x-2a)^3$ is the evolute of the parabola $y^2 = 4ax$ (see [[evolutes]]).' },
    { label: 'b', text: 'The evolute of $ay^2 = x^3$ is the curve $a(a-18x)^3 = \\left[54ax + \\tfrac{729}{16}y^2 + a^2\\right]^2$.' },
    { label: 'c', text: 'Sketching: draw $y_1 = P(x)$ with the intercepts, then take the square root of every ordinate. $y_1 < 0$ gives imaginary $y$; the maxima of $y_1$ and of $y$ occur at the same $x$; the curve meets the axis of $x$ where $y_1 = 0$.' },
    { label: 'd', text: 'Slope at an intercept $x = r$: it is $\\lim y/(x - r)$. For $y_1 = (x-1)(x-2)(x-3)$ the limit at $x = 1$ is $\\lim\\sqrt{(x-2)(x-3)/(x-1)} = \\infty$: the tangent is vertical, as at the ends of the oval and at the vertex of the open branch.' },
    { label: 'e', text: 'For $y_1 = (x-1)(x-2)^2$ the slope at $x = 2$ is $\\lim \\pm\\sqrt{x-1} = \\pm 1$: two distinct tangents, so $(2,0)$ is a node where the loop meets the two arms.' }
  ],
  constructions: [
    { fig: 'fig-170a', title: 'The cubic $y_1 = (x-1)(x-2)(x-3)$', level: 1 },
    { fig: 'fig-170c', title: 'The semi-cubic $y^2 = (x-1)(x-2)(x-3)$: an oval and an open branch', level: 1 },
    { fig: 'fig-170b', title: 'The cubic $y_1 = (x-1)(x-2)^2$ with its double root', level: 2 },
    { fig: 'fig-170d', title: 'The semi-cubic $y^2 = (x-1)(x-2)^2$ with a node at $(2,0)$', level: 2 }
  ],
  tables: [
    {
      title: 'Slopes at the intercepts (Fig. 170)',
      head: ['Curve', 'At', 'Limit of $y/(x-r)$', 'The tangent'],
      rows: [
        ['$y^2 = (x-1)(x-2)(x-3)$', '$x = 1$ (etc.)', '$\\sqrt{(x-2)(x-3)/(x-1)} \\to \\infty$', 'vertical'],
        ['$y^2 = (x-1)(x-2)^2$', '$x = 2$ (etc.)', '$\\pm\\sqrt{x-1} \\to \\pm 1$', 'two tangents of slope $\\pm 1$ (a node)']
      ]
    }
  ],
  bibliography: [
    'Loria, G.: Spezielle Algebraische und Transzendente ebene Kurven, Leipzig (1902) 21.'
  ],
  seeAlso: ['cubic-parabola', 'sketching', 'evolutes', 'conics']
});
