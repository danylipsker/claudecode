/* Curves Workshop · data/sections/caustics.js — Caustics (pages 15–20) */
Curves.section({
  id: 'caustics',
  title: 'Caustics',
  pages: [15, 20],
  history: 'Caustics were first studied by Tschirnhausen in 1682. Huygens, Quetelet and Lagrange added to the theory, and Cayley\'s long memoir of 1856 gathered most of what is known about them.',
  description: 'A *caustic* is the envelope of the light rays that leave a radiant point $S$ and are changed in direction by a given curve $f = 0$ (Fig. 12): by reflection, giving the *catacaustic*, or by refraction, giving the *diacaustic*. Wherever the rays crowd together on this envelope they paint a bright curve, like the bright curve on the surface of coffee in a cup. The book works out the reflection at a circle for every position of the radiant point (Figs. 13 and 14) and the refraction at a straight line (Figs. 15 to 17).',
  equations: [
    { tex: '[(4c^2 - a^2)(x^2 + y^2) - 2a^2 c x - a^2 c^2]^3 - 27 a^4 c^2 y^2 (x^2 + y^2 - c^2)^2 = 0', note: 'catacaustic of a circle of radius $a$ about $O$, radiant point $(c, 0)$' },
    { tex: '\\mu = \\dfrac{\\sin\\theta_1}{\\sin\\theta_2} = \\dfrac{AS}{PS} = \\dfrac{A\\bar S}{P\\bar S}', note: 'refraction at a line $L$, index $\\mu$ (Fig. 15)' },
    { tex: 'PS + P\\bar S = \\dfrac{S\\bar S}{\\mu} \\quad (\\mu < 1)', note: 'dense to rare medium: $P$ is on an ellipse with foci $S$ and $\\bar S$ (Fig. 16)' },
    { tex: 'P\\bar S - PS = \\dfrac{S\\bar S}{\\mu} \\quad (\\mu > 1)', note: 'rare to dense medium: $P$ is on a hyperbola with foci $S$ and $\\bar S$ (Fig. 17)' }
  ],
  metrical: [],
  items: [
    { label: '2', text: 'The *orthotomic* (or secondary caustic) is the locus of the point $\\bar S$, the reflection of $S$ in the tangent at $T$ (Fig. 12). See also [[pedal-curves]].' },
    { label: '3', text: 'The instantaneous centre of motion of $\\bar S$ is $T$, so the normal of the orthotomic at $\\bar S$ is the line $\\bar S T$, the reflected ray $TQ$. Hence the caustic, the envelope of these rays, is the *evolute of the orthotomic* (see [[evolutes]]).' },
    { label: '4', text: 'The foot $P$ of the perpendicular from $S$ to the tangent describes the pedal of the reflecting curve with respect to $S$. Since $S\\bar S = 2\\,SP$, the orthotomic is similar to the pedal, with double its linear dimensions.' },
    { label: '5', text: 'The catacaustic of a circle is the evolute of a limaçon whose pole is the radiant point (see [[limacon]]). Its equation is the first one above. Fig. 13 shows its forms: (a) radiant point at infinity, the nephroid; (b) outside the circle, a closed curve with two cusps on the axis that touches the circle at the points of contact of the tangents from the radiant point; (c) on the circle, the cardioid; (d), (e), (f) inside the circle, four cusps, two of them (K and K′) off the axis. For (d) the branches run off to infinity; in (e) the radiant point is half way to the circle and the three cusps K, K′ and the one on the axis lie on one line perpendicular to the axis; in (f) the radiant point is near the centre and the caustic is small.' },
    { label: '6', text: 'Two cases of the circle can be settled by an elementary rolling argument. With the source at infinity (Fig. 14a) the incident and the reflected ray make the same angle $\\theta$ with the normal $OT$. The arc $AB$ of the circle of radius $a/2$ about $O$ equals the arc $AP$ of the circle of radius $a/4$ through $A$, $P$, $T$, so $P$ describes a nephroid and the reflected ray $TPQ$, which is perpendicular to $AP$, is its tangent. With the source on the circle (Fig. 14b) the two angles at $T$ are $\\theta/2$: the fixed circle (radius $a/3$) and the equal rolling circle have equal arcs $AB$ and $AP$, $P$ describes a cardioid, and $TPQ$ is its tangent (see [[nephroid]] and [[cardioid]]). These are the bright curves seen on the coffee in a cup, or on a table inside a napkin ring.' },
    { label: '7', text: 'Refraction at a line $L$ (Fig. 15). $ST$ is the incident ray, $QT$ the refracted ray, and $\\bar S$ the reflection of $S$ in $L$. Produce $TQ$ backwards to meet in $P$ the circle through $S$, $Q$, $\\bar S$; $A$ is where it meets $S\\bar S$. Because $Q$ is the middle of the arc $S\\bar S$, $SP$ and $\\bar S P$ make equal angles with $PQ$, and the sine rule gives $\\mu = \\sin\\theta_1/\\sin\\theta_2 = AS/PS = A\\bar S/P\\bar S$ (with $A$ between $S$ and $\\bar S$, add numerators and denominators to get $S\\bar S/(PS + P\\bar S)$; with $A$ outside, subtract them to get $S\\bar S/(P\\bar S - PS)$). So for a ray passing from a dense to a rare medium ($\\theta_1 < \\theta_2$, $\\mu < 1$) $P$ describes the ellipse with foci $S$, $\\bar S$, major axis $S\\bar S/\\mu$ and eccentricity $\\mu$; in the other direction ($\\theta_1 > \\theta_2$, $\\mu > 1$) it describes the hyperbola with the same foci. $PQT$ is the normal of the conic, so the refracted rays envelope its evolute, which is the diacaustic (Fig. 16 for the ellipse, Fig. 17 for the hyperbola; see [[evolutes]] and [[conics]]).' },
    { label: '8a', text: 'If the radiant point is the focus of a parabola, the caustic of the evolute of that parabola is the evolute of another parabola.' },
    { label: '8b', text: 'If the radiant point is at the vertex of a reflecting parabola, the caustic is the evolute of a cissoid (see [[cissoid]]).' },
    { label: '8c', text: 'If the radiant point is the centre of a circle, the caustic of the involute of that circle is the evolute of the spiral of Archimedes (see [[involutes]] and [[spirals]]).' },
    { label: '8d', text: 'If the radiant point is the centre of a conic, the reflected rays are all normal to the quartic $r^2 = A\\cos 2\\theta + B$, which has the radiant point as a double point.' },
    { label: '8e', text: 'If the radiant point moves along a fixed diameter of a reflecting circle of radius $a$, the two cusps of the caustic that are not on that diameter move on the curve $r = a\\cos\\tfrac{\\theta}{2}$.' },
    { label: '8f', text: 'If the radiant point is the pole of the reflecting spiral $r = a e^{\\theta\\cot\\alpha}$, the caustic is a similar spiral.' },
    { label: '8g', text: 'If light rays parallel to the $y$-axis fall on the reflecting curve $y = e^x$, the caustic is a catenary (see [[catenary]]).' },
    { label: '8h', text: 'The orthotomic of a parabola, for rays perpendicular to its axis, is the sinusoidal spiral $r = a\\sec^3\\tfrac{\\theta}{3}$.' }
  ],
  constructions: [
    { fig: 'fig-012', title: 'The reflection of a point in the tangent: the orthotomic point', level: 1 },
    { fig: 'fig-013a', title: 'Catacaustic of a circle for parallel rays (the nephroid)', level: 1 },
    { fig: 'fig-013c', title: 'Catacaustic of a circle for a source on it (the cardioid)', level: 1 },
    { fig: 'fig-013b', title: 'Radiant point outside the circle: tangents and chord of contact', level: 2 },
    { fig: 'fig-014b', title: 'The cardioid as a caustic, by the rolling circle', level: 2 },
    { fig: 'fig-014a', title: 'The nephroid as a caustic, by the rolling circle', level: 2 },
    { fig: 'fig-015a', title: 'Refraction at a line, dense to rare: the circle through S, Q, S̄', level: 2 },
    { fig: 'fig-015b', title: 'Refraction at a line, rare to dense', level: 2 },
    { fig: 'fig-013d', title: 'Radiant point inside, near the circle: the cusps K and K′', level: 3 },
    { fig: 'fig-013e', title: 'Radiant point half way from the centre to the circle', level: 3 },
    { fig: 'fig-013f', title: 'Radiant point near the centre', level: 3 },
    { fig: 'fig-016', title: 'The diacaustic for μ < 1: the evolute of an ellipse', level: 3 },
    { fig: 'fig-017', title: 'The diacaustic for μ > 1: the evolute of a hyperbola', level: 3 }
  ],
  bibliography: [
    'American Mathematical Monthly: 28 (1921) 182, 187.',
    'Cayley, A.: "Memoir on Caustics", Philosophical Transactions (1856).',
    'Heath, R. S.: Geometrical Optics (1895) 105.',
    'Salmon, G.: Higher Plane Curves, Dublin (1879) 98.'
  ],
  seeAlso: ['evolutes', 'pedal-curves', 'envelopes', 'nephroid', 'cardioid', 'limacon', 'conics']
});
