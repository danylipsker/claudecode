/* Curves Workshop · data/sections/envelopes.js — pages 75–80 */
Curves.section({
  id: 'envelopes',
  title: 'Envelopes',
  pages: [75, 80],
  history: 'Leibniz (1694) and Taylor (1715) were the first to meet singular solutions of differential equations; Lagrange (1774) showed that geometrically they are envelopes. Cayley (1872) and Hill (1888, 1918) studied them closely.',
  description: 'A family of curves $F(x,y,c)=0$, one curve for each value of the parameter $c$, has an **envelope** when there is a curve that touches a member of the family at every one of its points (Figs. 70–77). The family usually comes from a differential equation $f(x,y,p)=0$ of degree $n$ in $p = \\tfrac{dy}{dx}$: at each point of the plane it gives $n$ slopes $p$ (real, imaginary or equal), so $n$ integral curves, with $n$ values of $c$, pass through the point. The points where two or more slopes (equivalently, two or more values of $c$) coincide form the envelope. Its equation satisfies the differential equation but is in general not one of the integral curves: it is the *singular solution*. To find it, eliminate $p$ between $f=0$ and $f_p=0$, or $c$ between $F=0$ and $F_c=0$ (the discriminant relations); either pair is also a parametric equation of the envelope. Drawn by hand, an envelope appears when many members of the family (lines, circles, ellipses, creases of a folded sheet) are drawn: the curve they all touch shows up as the boundary of the crowded region.',
  equations: [
    { tex: 'f(x,y,p)=0,\\quad f_p(x,y,p)=0', note: 'discriminant relations in the slope p: the envelope in parametric form' },
    { tex: 'F(x,y,c)=0,\\quad F_c(x,y,c)=0', note: 'discriminant relations in the parameter c' },
    { tex: 'y = px + g(p)', note: 'Clairaut equation: its integral curves are the lines $y = cx + g(c)$; the envelope comes from $x + g\'(p) = 0$ (Figs. 71, 72)' },
    { tex: 'f = y - px - \\frac4p = 0,\\ \\ f_p = -x + \\frac4{p^2} = 0 \\ \\Longrightarrow\\ y^2 = 16x', note: 'example (a), Fig. 71: the tangents of a parabola' },
    { tex: 'f = y - px - \\frac{p}{p-1} = 0,\\ \\ f_p = -x + \\frac1{(p-1)^2} = 0 \\ \\Longrightarrow\\ \\sqrt x + \\sqrt y = 1', note: 'example (b), Fig. 72: lines whose intercepts have the sum 1, $F = x\\sec^2\\theta + y\\csc^2\\theta - 1 = 0$; the whole envelope is the parabola $(x-y)^2 - 2(x+y) + 1 = 0$' },
    { tex: 'f_a = \\lambda g_a,\\quad f_b = \\lambda g_b', note: 'family $f(x,y,a,b)=0$ with its two parameters tied by $g(a,b)=0$: eliminate $a$, $b$, $\\lambda$ (Technique, 3)' },
    { tex: '\\frac xa + \\frac yb = 1,\\ \\ a^2 + b^2 = 1 \\ \\Longrightarrow\\ x = a^3,\\ y = b^3 \\ \\Longrightarrow\\ x^{2/3} + y^{2/3} = 1', note: 'example (a) of the technique, Fig. 73: the astroid, envelope of the trammel of Archimedes' },
    { tex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1,\\ \\ ab = k \\ \\Longrightarrow\\ \\lambda = \\frac1{2k},\\ \\ x^2y^2 = \\frac{k^2}{4}', note: 'example (b) of the technique, Fig. 74: a pair of hyperbolas, $xy = \\pm k/2$; the book prints $k^3/2$, a misprint for $k^2/4$' },
    { tex: 'L c^2 + 2M c + N = 0 \\ \\Longrightarrow\\ M^2 = LN', note: 'general item (f), Fig. 76: $L$, $M$, $N$ linear in $x,y$' }
  ],
  items: [
    { label: 'Clairaut', text: 'Differentiate $y = px + g(p)$ with respect to $x$: $\\tfrac{dp}{dx}\\,[\\,x + g\'(p)\\,] = 0$. The factor $\\tfrac{dp}{dx} = 0$ gives $p = c$ and the family of straight lines $y = cx + g(c)$; the other factor, $x + g\'(p) = 0$, is exactly $f_p = 0$: the envelope of the lines. Both examples of the section (Figs. 71, 72) are of this form.' },
    { label: 'Technique', text: 'When the parameters $a$, $b$ of the family $f(x,y,a,b)=0$ are tied by a relation $g(a,b)=0$, the differentials give $f_a\\,da + f_b\\,db = 0$ and $g_a\\,da + g_b\\,db = 0$, so $f_a = \\lambda g_a$ and $f_b = \\lambda g_b$ for a factor $\\lambda$ still to be found; $a$, $b$ and $\\lambda$ are then eliminated. The method works best when the equations are homogeneous in the parameters.' },
    { label: 'Folding', text: 'The conics are envelopes of lines, and a sheet of wax paper shows it (Fig. 75). Let $C$ be the centre of a circle of radius $r$ and $P$ a point of its plane. Fold $P$ onto a point $P\'$ of the circle and crease. The line $CP\'$ cuts the crease at $Q$; the crease is the perpendicular bisector of $PP\'$, so $PQ = P\'Q = u$ and $QC = v$. For $P$ inside the circle $u+v=r$: the creases envelope an ellipse with foci $P$, $C$. For $P$ outside, $u - v = r$: a hyperbola. The crease bisects the angle between the focal radii, hence it is the tangent at $Q$. For the parabola, $P$ is folded onto a line $L$ (a circle of infinite radius): $P\'Q \\perp L$ and $PQ = P\'Q$, so $Q$ lies on the parabola with focus $P$ and directrix $L$ (see [[conics]]).' },
    { label: 'Notation', text: 'Here $p$ is the derivative $dy/dx$, as is customary in the theory of differential equations; it is not the distance from the origin to a tangent that $p$ means in the pedal equations of [[pedal-equations]].' },
    { label: 'Special loci', text: 'Other loci, such as the tac-locus, the cuspidal locus and the nodal locus, appear as factors of one or both discriminants. They are treated in Hill (1918); examples are in Cohen, Murray and Glaisher (see the bibliography).' },
    { label: 'a', text: 'The evolute of a curve is the envelope of its normals (see [[evolutes]]).' },
    { label: 'b', text: 'The catacaustic of a curve is the envelope of its reflected rays, the diacaustic the envelope of its refracted rays (see [[caustics]]).' },
    { label: 'c', text: 'A curve parallel to a given curve is the envelope of circles of fixed radius whose centres lie on the given curve; or of circles of fixed radius that touch the given curve; or of lines parallel to the tangents of the given curve at a fixed distance from them (see [[parallel]]).' },
    { label: 'd', text: 'The first positive pedal of a curve is the envelope of the circles that have, as diameter, the radius vector from the pedal point to a point of the curve (see [[pedal-curves]]).' },
    { label: 'e', text: 'The first negative pedal is the envelope of the line through a point of the curve perpendicular to the radius vector from the pedal point.' },
    { label: 'f', text: 'If $L$, $M$, $N$ are linear functions of $x$ and $y$, the envelope of the lines $Lc^2 + 2Mc + N = 0$ is the conic $M^2 = LN$. Here $L=0$ and $N=0$ are two of its tangents and $M=0$ is their chord of contact (Fig. 76).' },
    { label: 'g', text: 'The envelope of a line (or curve) carried along by a curve rolling on a fixed curve is a roulette (see [[roulettes]]). A diameter of a circle rolling on a line envelopes a cycloid; the directrix of a parabola rolling on a line envelopes a catenary.' },
    { label: 'h', text: 'An envelope turns up in a problem of the calculus of variations (Fig. 77): given a curve $F=0$, a point $A$ and a constant force, with $y=c$ the line of zero velocity, the path of shortest time from $A$ to $F=0$ is the cycloid normal to $F=0$ made by a circle rolling under $y=c$. All the cycloids normal to $F=0$ together envelope a curve $E=0$. If $E=0$ passes between $A$ and $F=0$, the problem has no unique solution.' }
  ],
  constructions: [
    { fig: 'fig-075c', title: 'Folding a point onto a line: the creases envelope a parabola', level: 1 },
    { fig: 'fig-072', title: 'Lines whose intercepts have a constant sum', level: 1 },
    { fig: 'fig-071', title: 'The tangents y = px + 4/p of the parabola y² = 16x', level: 1 },
    { fig: 'fig-075a', title: 'Folding a point inside a circle: an ellipse', level: 2 },
    { fig: 'fig-075b', title: 'Folding a point outside a circle: a hyperbola', level: 2 },
    { fig: 'fig-073', title: 'The astroid as the envelope of the trammel of Archimedes', level: 2 },
    { fig: 'fig-074', title: 'Ellipses of equal area and their envelope', level: 2 },
    { fig: 'fig-076', title: 'A conic, two tangents and the chord of contact', level: 3 },
    { fig: 'fig-070', title: 'Two slopes at every point of the plane', level: 3 },
    { fig: 'fig-077', title: 'Cycloids normal to a curve and their envelope', level: 3 }
  ],
  tables: [
    {
      title: 'Families and their envelopes (the examples of the section)',
      head: ['Family', 'Condition', 'Envelope'],
      rows: [
        ['Lines $y = px + 4/p$ (Fig. 71)', 'none: one parameter $p$', 'parabola $y^2 = 16x$'],
        ['Lines $x/a + y/(1-a) = 1$ (Fig. 72)', 'intercepts add up to 1', 'parabola $\\sqrt x + \\sqrt y = 1$'],
        ['Segments from $(a,0)$ to $(0,b)$ (Fig. 73)', '$a^2 + b^2 = 1$ (rod of length 1)', 'astroid $x^{2/3} + y^{2/3} = 1$'],
        ['Ellipses $x^2/a^2 + y^2/b^2 = 1$ (Fig. 74)', '$ab = k$ (equal area)', 'hyperbolas $x^2y^2 = k^2/4$'],
        ['Creases of $P$ folded onto a circle (Fig. 75)', '$P$ inside / outside the circle', 'ellipse / hyperbola with foci $P$, $C$'],
        ['Creases of $P$ folded onto a line (Fig. 75)', '—', 'parabola with focus $P$, directrix $L$'],
        ['Lines $Lc^2 + 2Mc + N = 0$ (Fig. 76)', '$L, M, N$ linear', 'conic $M^2 = LN$']
      ]
    },
    {
      title: 'Curves obtained as envelopes (general items)',
      head: ['Curve', 'Is the envelope of'],
      rows: [
        ['Evolute', 'the normals of the given curve'],
        ['Catacaustic / diacaustic', 'the reflected / refracted rays'],
        ['Parallel curve', 'circles of fixed radius centred on the curve (or lines at a fixed distance from the tangents)'],
        ['First positive pedal', 'circles with the radius vector as diameter'],
        ['First negative pedal', 'lines perpendicular to the radius vector at the point of the curve'],
        ['Cycloid', 'a diameter of a circle rolling on a line'],
        ['Catenary', 'the directrix of a parabola rolling on a line']
      ]
    }
  ],
  bibliography: [
    'Bliss, G. A.: Calculus of Variations, Open Court (1935).',
    'Cayley, A.: Mess. Math., II (1872).',
    'Clairaut: Mem. Paris Acad. Sci., (1734).',
    'Cohen, A.: Differential Equations, D. C. Heath (1933) 86-100.',
    'Glaisher, J. W. L.: Mess. Math., XII (1882) 1-14 (examples).',
    'Hill, M. J. M.: Proc. Lond. Math. Soc. XIX (1888) 561-589, ibid., S 2, XVII (1918) 149.',
    'Kells, L. M.: Differential Equations, McGraw Hill (1935) 73ff.',
    'Lagrange: Mem. Berlin Acad. Sci., (1774).',
    'Murray, D. A.: Differential Equations, Longmans, Green (1935) 40-49.'
  ],
  seeAlso: ['evolutes', 'caustics', 'parallel', 'pedal-curves', 'roulettes', 'conics', 'astroid', 'cycloid', 'catenary', 'glissettes']
});
