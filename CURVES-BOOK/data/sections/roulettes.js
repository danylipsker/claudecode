/* Curves Workshop · data/sections/roulettes.js — Roulettes (pages 175–185) */
Curves.section({
  id: 'roulettes',
  title: 'Roulettes',
  pages: [175, 185],
  history: 'Besant (1869) seems to have been the first to treat roulettes systematically. Before him Dürer (1525), D. Bernoulli, de la Hire, Desargues, Leibniz, Newton, Maxwell and others had contributed in one form or another, above all on the cycloidal curves.',
  description: 'A **roulette** is the path of a point, or the envelope of a line, attached to the plane of a curve that rolls without slipping on a fixed curve (with the obvious continuity conditions). The cycloids, trochoids and involutes are familiar roulettes of a point (see [[cycloid]], [[trochoids]] and [[involutes]]). The book treats the general roulette first (Fig. 159), then the case of a fixed line (the polar and the pedal equation of the rolling curve, Figs. 160–162), the locus of the centre of curvature (Fig. 163), the envelope of a carried line (Figs. 164–166), the case of a curve rolling on an equal curve (Fig. 167), a table of roulettes, and finally the mechanisms that make conics roll (Figs. 168–169).',
  equations: [
    { tex: 'x = v\\sin(\\varphi + \\varphi_1) - u\\cos(\\varphi + \\varphi_1) - x_1, \\qquad y = -v\\cos(\\varphi + \\varphi_1) - u\\sin(\\varphi + \\varphi_1) + y_1', note: 'general roulette of the point $O$ (Fig. 159): $O$ is the point that touched the fixed curve at $O_1$, the axes are the tangent and normal of the fixed curve at $O_1$, $T = (x_1, y_1)$ is the point of contact, $(u, v)$ its coordinates referred to the tangent and normal at $O$, $\\varphi$ and $\\varphi_1$ the angles of the normals; all the quantities on the right are functions of the arc length $s = O_1T$ (= the arc $OT$ of the rolling curve), so these are parametric equations of the locus of $O$' },
    { tex: '\\dfrac{dy}{dx} = \\cot\\psi, \\qquad \\tan\\psi = r\\,\\dfrac{d\\theta}{dr}, \\qquad y = r\\sin\\psi = r\\,\\dfrac{dx}{ds}', note: 'roulette of a point $Q$ (pole) carried by the curve $r = f(\\theta)$ rolling on the $x$-axis (Fig. 160): $P$, the point of contact, is the instantaneous centre of rotation of $Q$' },
    { tex: 'r = f(\\theta), \\qquad \\dfrac{dx}{dy} = r\\,\\dfrac{d\\theta}{dr}, \\qquad y = r\\,\\dfrac{dx}{ds}', note: 'eliminate $r$ and $\\theta$ to get the rectangular equation of the path of $Q$' },
    { tex: 'r = \\dfrac{2a}{1 - \\sin\\theta}, \\qquad \\dfrac{dx}{dy} = \\dfrac{1 - \\sin\\theta}{\\cos\\theta}, \\qquad y = r\\,\\dfrac{dx}{ds} \\;\\Longrightarrow\\; a\\,ds = y\\,dx, \\quad a\\,s = \\int_0^x y\\,dx = A', note: 'the focus of a parabola rolling on a line, starting with the tangent at its vertex on the line (Fig. 161): the catenary, with its defining property (see [[catenary]])' },
    { tex: 'y = f\\!\\left(y\\,\\dfrac{ds}{dx}\\right)', note: 'pedal equation $p = f(r)$ of the rolling curve (with respect to $Q$): $p = QN = y = r\\,dx/ds$ gives the rectangular equation of the roulette' },
    { tex: 'B p^2 = A^2(r^2 - a^2), \\qquad A = a + 2b, \\quad B = 4b(a + b)', note: 'pedal equation of the cycloidal family with respect to the centre of the fixed circle; the curve rolls on the $x$-axis, starting with a cusp tangent on it' },
    { tex: 'B y^2 = A^2\\left[y^2\\left(\\dfrac{ds}{dx}\\right)^2 - a^2\\right] = A^2 y^2(1 + y\'^2) - a^2 A^2, \\qquad \\dfrac{2a\\,dx}{A} = \\dfrac{2y\\,dy}{\\sqrt{A^2 - y^2}}, \\qquad \\dfrac{a x}{A} = -\\sqrt{A^2 - y^2}', note: 'the roulette of that point (the constant of integration is dropped by choosing the fixed tangent suitably)' },
    { tex: 'A^2 y^2 + a^2 x^2 = A^4', note: 'the roulette is an ellipse' },
    { tex: 'x^2 + 9y^2 = 81a^2', note: 'the case of the cardioid, $a = b$ (Fig. 162); the cardioid rolls on the top of the line until the cusp touches, then on the underside in the reverse direction' },
    { tex: 's = f(\\varphi), \\qquad x = s = f(\\varphi), \\quad y = R = f\'(\\varphi)', note: 'locus of the centre of curvature at the point of contact, for a curve with Whewell equation $s = f(\\varphi)$ rolling on a line (Fig. 163)' },
    { tex: 's = A\\sin B\\varphi, \\quad x = A\\sin B\\varphi, \\quad y = AB\\cos B\\varphi \\;\\Longrightarrow\\; B^2 x^2 + y^2 = A^2 B^2', note: 'cycloidal family: the locus of the centre of curvature is an ellipse' },
    { tex: 'd\\sigma = QT + TQ_1 = \\sin\\varphi\\,ds + z\\,d\\varphi, \\qquad \\dfrac{d\\sigma}{d\\varphi} = \\sin\\varphi\\,\\dfrac{ds}{d\\varphi} + z', note: 'envelope of a line carried by a curve rolling on a fixed line (Fig. 164): $\\sigma$ is the arc length of the envelope; $Q$ is the foot of the perpendicular $PQ = z$ from the point of contact $P$ on the line' },
    { tex: 'z = a\\sin\\varphi, \\quad \\dfrac{ds}{d\\varphi} = a \\;\\Longrightarrow\\; \\dfrac{d\\sigma}{d\\varphi} = 2a\\sin\\varphi, \\quad \\sigma = -2a\\cos\\varphi', note: 'the envelope of a diameter of a circle of radius $a$ (Fig. 165): the intrinsic equation of an ordinary cycloid' },
    { tex: '\\dfrac{d\\sigma}{d\\varphi} = z + (\\cos\\alpha)\\,\\dfrac{R_1 R_2}{R_1 + R_2}', note: 'envelope of a line carried by a curve rolling on a fixed curve (Fig. 166): the normals to the line and to the curves meet at the angle $\\alpha$, $R_1$ and $R_2$ are the radii of curvature of the rolling and the fixed curve at the contact' }
  ],
  metrical: [
    { tex: 'A_{\\text{roulette and line}} = 2\\,A_{\\text{pedal of the rolling curve}}', note: 'Steiner I: a point rigidly attached to a closed curve rolling on a line makes a roulette through one revolution; the area between the roulette and the line is twice the area of the pedal of the rolling curve with respect to the generating point. Examples: one arch of the ordinary cycloid, area $3\\pi a^2$, and the cardioid that is the pedal of the circle with respect to a point on it, area $\\tfrac{3\\pi a^2}{2}$; the elliptic catenary generated by a focus of an ellipse of semi-major axis $a$ has area $2\\pi a^2$ under one arch, since the pedal of an ellipse with respect to a focus is the circle on the major axis' },
    { tex: 'L_{\\text{roulette}} = L_{\\text{pedal}}', note: 'Steiner II: when a curve rolls on a line, the arc length of the roulette described by a point equals the corresponding arc length of the pedal of the rolling curve with respect to that point. Examples: one arch of the cycloid has the length $8a$, the same as the cardioid; one arch of the elliptic catenary has the length $2\\pi a$, the circumference of the circle on the major axis' }
  ],
  items: [
    { label: '1', text: 'The roulette of a point carried by a curve that rolls on a line has parametric equations in the arc length $s = OT$ (Fig. 159); it is not difficult to generalise from the point $O$ of the rolling curve to any carried point. Familiar roulettes of a point are the cycloids, trochoids and involutes.' },
    { label: '2a', text: 'Polar equation (Fig. 160): when $Q$ is carried by $r = f(\\theta)$ rolling on the $x$-axis, $P$ is the instantaneous centre of rotation of $Q$ and the path has $dy/dx = \\cot\\psi$; eliminating $r$ and $\\theta$ gives its rectangular equation. The focus of a parabola rolling on a line (Fig. 161) describes a catenary, with $a\\,s = \\int y\\,dx$.' },
    { label: '2b', text: 'Pedal equation: if the rolling curve is $p = f(r)$ with respect to $Q$, the roulette satisfies $y = f(y\\,ds/dx)$. The pedal point of the cycloidal family (the centre of the fixed circle) describes an ellipse; for the cardioid, $x^2 + 9y^2 = 81a^2$ (Fig. 162).' },
    { label: '2c', text: 'Steiner\'s theorems tie the areas and lengths of roulettes to those of pedal curves (see the metrical properties and [[pedal-curves]]).' },
    { label: '3', text: 'The locus of the centre of curvature of a rolling curve, measured at the contact, is $x = f(\\varphi)$, $y = f\'(\\varphi)$ when the curve has the Whewell equation $s = f(\\varphi)$ (Fig. 163); for the cycloidal family it is an ellipse.' },
    { label: '4', text: 'Envelope of a carried line, curve rolling on a line (Fig. 164): the point of tangency $Q$ is the foot of the perpendicular from the contact point $P$ on the line, because every point of the line turns about $P$. Hence $d\\sigma/d\\varphi = \\sin\\varphi\\,ds/d\\varphi + z$. The envelope of a diameter of a circle is a cycloid (Fig. 165). Intrinsic equations of such envelopes are often easy to obtain.' },
    { label: '5', text: 'Envelope of a carried line, curve rolling on a curve (Fig. 166): $d\\sigma/d\\varphi = z + \\cos\\alpha\\cdot R_1R_2/(R_1 + R_2)$.' },
    { label: '6', text: 'A curve rolling on an equal curve, with corresponding points in contact, is always the reflection of the fixed curve in their common tangent (Maclaurin, 1720; Fig. 167). So the roulette of any carried point $O$ is similar to the pedal with respect to $O_1$ (the reflection of $O$), with twice its linear dimensions; the cardioid is a simple illustration (see [[caustics]]).' },
    { label: '7', text: 'The table lists some roulettes. The surfaces of revolution of the catenary, the elliptic catenary and the hyperbolic catenary (the starred entries) all have constant mean curvature; they appear in minimal problems such as soap films.' },
    { label: '8', text: 'Mechanisms (Figs. 168, 169). A four-bar linkage whose bars are equal in pairs forms a crossed parallelogram, and its action is equivalent to a roulette. With the smaller side $AB$ fixed, the longer bars meet on an ellipse with foci $A$ and $B$; $C$ and $D$ are the foci of an equal ellipse touching it at $P$, and the action is that of rolling ellipses (this linkage is used as a "quick return" mechanism in machines). With a long bar $BC$ fixed, the short bars (extended) meet on a hyperbola with foci $B$ and $C$, on which an equal hyperbola with foci $A$ and $D$ rolls with contact at $P$.' },
    { label: '9', text: 'If $P$ (the crossing of the long bars) is moved along a line and toothed wheels are put on the bars $BC$ and $AD$ (Fig. 169a), the roulette of $C$ (or $D$) is an elliptic catenary, a plane section of the unduloid; the wheels make the motion of $C$ and $D$ perpendicular to the bars so that $P$ is the centre of rotation of any point of $CD$: an ellipse rolling on the line. If the meeting point of the shorter bars extended, with wheels attached, moves along the line (Fig. 169b), the roulette of $D$ (or $A$) is the hyperbolic catenary; $A$ and $D$ are the foci of the hyperbola that touches the line at $P$.' }
  ],
  constructions: [
    { fig: 'fig-165', title: 'The envelope of a diameter of a rolling circle: a cycloid', level: 1 },
    { fig: 'fig-167', title: 'A curve rolling on an equal curve: the reflection in the common tangent', level: 1 },
    { fig: 'fig-163', title: 'The centre of curvature of a rolling curve at the contact', level: 1 },
    { fig: 'fig-166', title: 'The envelope of a line carried by a curve rolling on a curve', level: 2 },
    { fig: 'fig-161', title: 'The focus of a rolling parabola traces a catenary', level: 2 },
    { fig: 'fig-160', title: 'The roulette of a point carried by a curve rolling on a line', level: 2 },
    { fig: 'fig-164', title: 'The envelope of a line carried by a curve rolling on a line', level: 2 },
    { fig: 'fig-168a', title: 'The crossed parallelogram: ellipses rolling on ellipses', level: 2 },
    { fig: 'fig-168b', title: 'The crossed parallelogram: hyperbolas rolling on hyperbolas', level: 2 },
    { fig: 'fig-159', title: 'The general roulette: coordinates of the point O', level: 3 },
    { fig: 'fig-162', title: 'A cardioid rolling on a line: the pedal point describes an ellipse', level: 3 },
    { fig: 'fig-169a', title: 'The linkage rolling an ellipse on a line: the elliptic catenary', level: 3 },
    { fig: 'fig-169b', title: 'The linkage rolling a hyperbola on a line: the hyperbolic catenary', level: 3 }
  ],
  tables: [
    {
      title: 'Some roulettes (pages 182–183); the starred curves (*) give surfaces of revolution of constant mean curvature (soap films)',
      head: ['Rolling curve', 'Fixed curve', 'Carried element', 'Roulette'],
      rows: [
        ['Circle', 'Line', 'Point of the circle', 'Cycloid'],
        ['Parabola', 'Line', 'Focus', 'Catenary (ordinary)*'],
        ['Ellipse', 'Line', 'Focus', 'Elliptic catenary*'],
        ['Hyperbola', 'Line', 'Focus', 'Hyperbolic catenary*'],
        ['Reciprocal spiral', 'Line', 'Pole', 'Tractrix'],
        ['Involute of a circle', 'Line', 'Centre of the circle', 'Parabola'],
        ['Cycloidal family', 'Line', 'Centre', 'Ellipse'],
        ['Line', 'Any curve', 'Point of the line', 'Involute of the curve'],
        ['Any curve', 'Equal curve', 'Any point', 'Curve similar to the pedal'],
        ['Parabola', 'Equal parabola', 'Vertex', 'Ordinary cissoid'],
        ['Circle', 'Circle', 'Any point', 'Cycloidal family'],
        ['Parabola', 'Line', 'Directrix', 'Catenary'],
        ['Circle', 'Circle', 'Any line', 'Involute of an epicycloid'],
        ['Catenary', 'Line', 'Any line', 'Involute of a parabola']
      ]
    }
  ],
  bibliography: [
    'Aoust: Courbes Planes, Paris (1873) 200.',
    'Besant, W. H.: Roulettes and Glissettes, London (1870).',
    'Cohn-Vossen: Anschauliche Geometrie, Berlin (1932) 225.',
    'Encyclopaedia Britannica: "Curves, Special", 14th Ed.',
    'Maxwell, J. C.: Scientific Papers, v 1 (1849).',
    'Moritz, R. E.: U. of Wash. Publ. (1923).',
    'Taylor, C.: Curves Formed by the Action of ... Geometric Chucks, London (1874).',
    'Wieleitner, H.: Spezielle ebene Kurven, Leipzig (1908) 169 ff.',
    'Williamson, B.: Integral Calculus, Longmans, Green (1895) 203 ff., 238.',
    'Yates, R. C.: Tools, A Mathematical Sketch and Model Book, L. S. U. Press (1941).'
  ],
  seeAlso: ['cycloid', 'trochoids', 'epi-hypo-cycloids', 'catenary', 'cardioid', 'cissoid', 'tractrix', 'involutes', 'pedal-curves', 'pedal-equations', 'glissettes', 'envelopes', 'intrinsic', 'instantaneous-center', 'conics']
});
