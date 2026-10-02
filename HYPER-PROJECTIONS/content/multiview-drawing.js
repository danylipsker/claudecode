/* HYPER-PROJECTIONS · content/multiview-drawing.js — Multiview drawing: the drawing office.
 *
 *   orthographic-projection   parallel perpendicular projectors; true shape, foreshortening, the matrix that forgets z
 *   first-angle-projection    the object between the viewer and the planes; top view below, right view on the left
 *   third-angle-projection    the glass box between the viewer and the object; each view on the side it was seen from
 *   six-principal-views       the six views A to F, their alignment, how many to draw and which to choose
 *   the-third-view            finding a view from two: heights by T-square, depths round the 45° mitre line
 *   section-views             cutting planes, hatching at 45°, full, half, offset and other sections, what is not hatched
 *   line-conventions          the ISO line types, widths, dash lengths and the order of priority
 *   dimensioning-basics       extension and dimension lines, arrowheads, symbols, placing, not repeating, chain against datum
 * Simulations: sims/multiview-drawing.js. Constructions: constructions/multiview-drawing.js.
 */
Hyper.add(
{
  id: 'orthographic-projection',
  parent: 'multiview-drawing',
  title: 'Orthographic projection',
  level: 1,
  short: `Parallel projectors, all perpendicular to the picture plane: each point lands where the perpendicular from it meets the sheet. A face parallel to the sheet keeps its true shape and size; one tilted by θ is drawn cos θ times too small; and a single view never tells the depth.`,
  keywords: ['orthographic', 'orthogonal projection', 'multiview', 'view', 'elevation', 'plan', 'true shape', 'foreshortening', 'projector', 'picture plane', 'engineering drawing', 'Monge', 'ellipse'],
  prereq: ['projectors-and-picture-plane', 'parallel-vs-central', 'true-length-and-true-shape'],
  related: ['first-angle-projection', 'third-angle-projection', 'six-principal-views', 'axonometric-projection', 'monge-method', 'engineering-drawings'],
  body: `Look at a block of wood from far away, straight at one face. The sides vanish and you see one rectangle, exactly as big as the face is. That is an **orthographic view**. Draw from every point of the object a line perpendicular to a flat sheet, the **picture plane**, and mark where each line meets the sheet: these lines, the **projectors**, are parallel, so nothing shrinks with distance, and the picture is what an observer infinitely far away would see. (The word is Greek: *orthos*, right, and *graphe*, drawing, for the right angle between projector and plane.)

### What it keeps and what it loses
Anything **parallel to the picture plane** is drawn true: a length keeps its length, an angle its size, a circle stays a circle. Tilt it by an angle $\\theta$ and a length along the direction of tilt is drawn $\\cos\\theta$ times as long, while lengths across the tilt are untouched. A line perpendicular to the plane becomes a point; a face perpendicular to it becomes a line (an *edge view*). So a round hole in an inclined face is drawn as an **ellipse** with axes $D$ and $D\\cos\\theta$ ([[math:ellipse|the ellipse]]), and no single view can say how deep things are: every point on one projector lands on the same spot.

### The matrix
With the viewer looking along $-z$ and the sheet the $xy$-plane, orthographic projection just forgets $z$:
$$\\begin{bmatrix} x' \\\\ y' \\\\ z' \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix}.$$
That is the **front view**, $(x, y, z) \\mapsto (x, y)$. Every other view is the same projection after turning the object so that the wanted face looks at you: a quarter turn about the $x$-axis gives the **top view**, $(x, y, z) \\mapsto (x, -z)$, and a quarter turn about the vertical gives the **right view**, $(x, y, z) \\mapsto (-z, y)$ ([[math:matrices|matrices]]). A point has three coordinates and a view keeps two, so **two views fix a point**: the idea of [[monge-method|Monge's method]] and of the whole of multiview drawing.

### Why several views
A drawing for a machinist must be unambiguous, measurable and quick to make, so the engineer draws the object from the front, from above and from the side, arranged so that matching points line up ([[first-angle-projection|first angle]] or [[third-angle-projection|third angle]]), and adds dashed lines and [[section-views|sections]] for what the views hide. The pictorial projections ([[axonometric-projection|axonometric]], oblique, perspective) are kinder to the eye and poorer to measure on.

> [!tip] Hold a card in the sun with the wall behind it square to the rays: its shadow is an orthographic projection of the card. Turn the card and the shadow narrows by cos θ; edge-on, it is a line.`,
  ideas: [
    `Orthographic projectors are parallel and perpendicular to the picture plane, so size does not change with distance.`,
    `A face or length parallel to the plane is drawn true; tilted by θ it is drawn cos θ times as large; perpendicular to the plane it becomes a line or a point.`,
    `The matrix simply drops z; the other views turn the object first. One view loses the depth, so a drawing uses two or three.`,
    `A circle in an inclined face is an ellipse with axes D and D cos θ: the sign that a face is tilted away from the view.`
  ],
  pitfalls: [
    `An orthographic view is a photograph taken from the side — A photograph is a central projection: far things are smaller and parallel edges converge. In an orthographic view parallel edges stay parallel and a distant part is drawn exactly as big as a near one.`,
    `A tilted face is drawn at its true size — Only a face parallel to the picture plane is. A face tilted by θ is drawn cos θ times too small in one direction; to measure it you need a view that looks square at it (an auxiliary view).`,
    `If a feature shows in the front view I know how deep it is — The depth of every point is lost in that view; it is found in the top or the side view.`
  ],
  formulas: [
    {
      name: 'Foreshortening of a length',
      expr: 'Lp = L*cos(theta)',
      tex: 'L_p = L\\cos\\theta',
      vars: {
        Lp: { name: 'length on the view', q: 'length', unit: 'mm', tex: 'L_p' },
        L: { name: 'true length', q: 'length', unit: 'mm', value: 50 },
        theta: { name: 'angle between the line and the picture plane', q: 'angle', unit: '°', value: 40, min: 0, max: 90 }
      },
      note: `A line parallel to the plane (θ = 0) is drawn in full; at θ = 60° it is drawn half as long; perpendicular to the plane (θ = 90°) it is a point.`
    },
    {
      name: 'True length from two views',
      expr: 'L = sqrt(Lf^2 + dz^2)',
      tex: 'L = \\sqrt{L_f^2 + \\Delta z^2}',
      vars: {
        L: { name: 'true length of the line', q: 'length', unit: 'mm' },
        Lf: { name: 'length of the line in the front view', q: 'length', unit: 'mm', value: 50, tex: 'L_f' },
        dz: { name: 'difference in depth of its two ends (from the top view)', q: 'length', unit: 'mm', value: 30, tex: '\\Delta z' }
      },
      note: `The front view gives Δx and Δy, the top view gives Δz: Pythagoras in three dimensions. This is the right-angled triangle that is rotated flat in descriptive geometry to find a true length.`
    },
    {
      name: 'Minor axis of a tilted circle',
      expr: 'b = D*cos(theta)',
      tex: 'b = D\\cos\\theta',
      vars: {
        b: { name: 'minor axis of the ellipse on the view', q: 'length', unit: 'mm' },
        D: { name: 'diameter of the circle (the major axis)', q: 'length', unit: 'mm', value: 40 },
        theta: { name: 'tilt of the face away from the picture plane', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      note: `The diameter along the axis of the tilt keeps its length; the one across it is shortened. The ellipse is as wide as the circle and cos θ as tall.`
    }
  ],
  examples: [
    {
      title: 'A plate turned about a vertical axis',
      q: `A plate 80 mm wide and 50 mm high with a hole of diameter 30 mm is turned through 50° about its vertical centre line. What does the front view show?`,
      steps: [
        `The height is along the axis of the turn, so it is untouched: 50 mm.`,
        { text: `The width is shortened:`, tex: '80 \\cos 50° = 80 \\times 0.643 = 51.4\\ \\text{mm}' },
        { text: `The hole becomes an ellipse with the full height as its long axis and the shortened width as its short one:`, tex: '30 \\times 30\\cos 50° = 30 \\times 19.3\\ \\text{mm}' },
        `The area of the view is $\\cos 50° = 64\\ \\%$ of the true area.`
      ],
      a: `A rectangle 51.4 mm wide and 50 mm high containing an ellipse 19.3 mm wide and 30 mm high.`
    },
    {
      title: 'True length from two views',
      q: `A line AB is 50 mm long in the front view, and the top view shows that B is 30 mm further from the viewer than A. How long is AB really, and how much is it foreshortened in the front view?`,
      steps: [
        { text: `The front view holds the other two coordinate differences, the top view the depth difference:`, tex: 'AB = \\sqrt{50^2 + 30^2} = 58.3\\ \\text{mm}' },
        `The angle between AB and the front plane satisfies $\\cos\\theta = 50 / 58.3 = 0.857$, so $\\theta = 31°$.`,
        `The front view shows 86 % of the true length: it is foreshortened by 14 %.`
      ],
      a: `AB is 58.3 mm long and is drawn 14 % too short in the front view; it leans 31° out of the plane.`
    }
  ],
  quiz: [
    { q: `A square plate 100 mm wide is turned through 60° about a vertical axis. In the front view its width is`, choices: ['100 mm', '86.6 mm', '50 mm', '173 mm'], a: 2, why: `The width is shortened by cos 60° = 0.5, so it is 50 mm; the height does not change. (86.6 mm would be sin 60°, from using the wrong side of the triangle.)` },
    { q: `In an orthographic view a part twice as far from the viewer is drawn half as big.`, a: false, why: `That is perspective. The projectors are parallel, so the size of a part does not depend on its distance from the plane.` },
    { q: `A circular hole of diameter 40 mm lies in a face tilted 45° from the picture plane. The ellipse it makes has a minor axis of about how many millimetres?`, answer: 28.3, unit: 'mm', why: `40 cos 45° = 28.3 mm; the major axis keeps its length of 40 mm.` },
    { q: `Which measure of an object is lost in a front view?`, choices: ['heights', 'widths', 'depths', 'angles lying in the front plane'], a: 2, why: `The projectors run along the depth, so every point on one projector lands in the same place. Heights and widths are kept; angles in planes parallel to the sheet too.` },
    { q: `A line is parallel to the picture plane. Its view is`, choices: ['shorter than the line', 'a point', 'equal in length to the line', 'longer than the line'], a: 2, why: `cos 0° = 1: a line parallel to the plane is drawn at its true length, which is how true lengths are read from a view.` }
  ],
  applications: [
    `Workshop drawings of machine parts: the machinist reads and measures every edge parallel to a view directly, and the views carry dimensions, tolerances and hidden detail.`,
    `Building plans and elevations: the plan is the view from above of a horizontal cut through the building, the elevations are its side views.`,
    `CAD systems derive the drawing views of a 3-D model by this projection, and the orthographic camera of a modelling window uses the same matrix.`,
    `Orthophotographs: an aerial photograph is corrected so that every point lies where the plumb line from it meets the ground, as in an orthographic view; maps made from it can be measured.`,
    `Sheet-metal work: the flat blank is cut from true lengths, which only edges parallel to a view show without calculation.`
  ],
  history: `The Roman architect Vitruvius already names three drawings of a building: *ichnographia*, the plan, *orthographia*, the elevation drawn without foreshortening, and *scaenographia*, the perspective. Renaissance architects and Dürer (*Underweysung der Messung*, 1525) drew objects in plan and elevation. Gaspard Monge (1746–1818) turned the practice into a science, *descriptive geometry*, at the military school of Mézières in the 1760s, where it served the design of fortifications and was kept secret; he taught it in public from 1795 and published *Géométrie descriptive* in 1799. The drawing offices of the nineteenth century took over his plan and elevation, and the first-angle and third-angle layouts followed.`,
  sources: [
    `ISO 5456-2:1996, Technical drawings — Projection methods — Part 2: Orthographic representations.`,
    `ISO 128-30:2001, Technical drawings — General principles of presentation — Part 30: Basic conventions for views.`,
    `Gaspard Monge, *Géométrie descriptive* (1799).`,
    `Thomas E. French, Charles J. Vierck and Robert J. Foster, *Engineering Drawing and Graphic Technology*, the chapters on orthographic projection.`
  ],
  sim: 'mv-projectors',
  construction: 'mv-two-views'
},

{
  id: 'first-angle-projection',
  parent: 'multiview-drawing',
  title: 'First-angle projection',
  level: 1,
  short: `The object stands between the viewer and the planes, which are behind it; each view is projected through the object onto the plane behind it, and the planes are unfolded so that the top view falls below the front view and the right view on the left. The ISO tradition, marked by the truncated cone with its circles on the right.`,
  keywords: ['first angle', 'first-angle', 'European projection', 'ISO projection', 'method E', 'projection symbol', 'truncated cone', 'mitre line', 'view arrangement', 'unfolding'],
  prereq: ['orthographic-projection', 'projectors-and-picture-plane'],
  related: ['third-angle-projection', 'six-principal-views', 'the-third-view', 'monge-method', 'engineering-drawings'],
  body: `Imagine the object in the first of the four quarters of space that a vertical plane (the *front plane*) and a horizontal plane cut out: **in front of the front plane and above the horizontal one**. You, the observer, stand in front of the object; behind it stands the vertical plane and beneath it lies the horizontal plane. To make a view you look at the object and carry each point back along its projector onto the plane behind (or below) it. The object is **between you and the plane**.

### Unfolding the planes
The planes are hinged along their common edges. Turn the horizontal plane down about its hinge until it lies in the plane of the front view, and the side plane out in the same way. The picture on the plane **under** the object, the top view, comes to lie **below** the front view; the picture on the plane to the **left** of the object, which is what you see when you look from the right, lies on the **left**. As a rule: **each view is drawn on the side opposite to the one it was seen from.**

| You look from | The view is drawn |
|---|---|
| the right | to the left of the front view |
| the left | to the right of the front view |
| above | below the front view |
| below | above the front view |
| behind | at the far end of the row |

### Reading it
Because of the unfolding, the **front of the object points away from the front view** in the neighbouring views: in the top view the front edge is at the bottom, farthest from the front view, and in the right view it is at the left, again farthest. It is the quickest way to tell first angle from third on a drawing that carries no symbol.

### Drawing it
Heights are carried between the front view and the side views with the T-square, widths between the front and the top view with the set square. Depths are the one measure that changes direction: a vertical distance in the top view must become a horizontal one in the right view, which is what the **45° mitre line** does ([[the-third-view]]); dividers or a strip of paper do the same. Leave equal gaps between the views (20 to 30 mm) for the dimensions.

### The symbol
Every drawing should state its method, usually in the title block, with the symbol of ISO 5456-2: a truncated cone seen from the front together with its end view of two concentric circles. For first angle the circles stand **to the right** of the cone; for [[third-angle-projection|third angle]] to the left.

> [!note] First angle is the traditional system of Britain, continental Europe, China and India; the United States, Canada and Japan use third angle. ISO standards allow both, provided the drawing carries the symbol. Drawings travel, so a draughtsman learns to read both.`,
  ideas: [
    `In first angle the object lies between the observer and the planes; each view is projected backwards through the object.`,
    `After unfolding, a view lies on the side opposite to the direction it was seen from: the top view below, the right view on the left.`,
    `In the neighbouring views the front of the object points away from the front view; this tells first angle from third angle at a glance.`,
    `The depth is carried from the top view to the right view by a 45° mitre line, or with dividers; the symbol (cone, circles on the right) states the method.`
  ],
  pitfalls: [
    `The right view is drawn on the right because it is the right view — In first angle the view seen from the right is drawn on the left of the front view; the name tells where you stood, not where the view goes.`,
    `The two systems differ in the shape of the views — The views themselves are identical; only their positions are exchanged (top with bottom, left with right). Reading a first-angle drawing as third angle gives an object turned upside down or back to front.`,
    `The symbol is a decoration — It is the only way to know which system a drawing uses; a missing or wrong symbol is a drawing error, because the same layout means two different objects.`
  ],
  formulas: [
    {
      name: 'Scale that fits the width',
      expr: 's = Aw/(W + D + g)',
      tex: 's = \\frac{A_w}{W + D + g}',
      vars: {
        s: { name: 'scale (size on the paper : size of the part)' },
        Aw: { name: 'width of the drawing area', q: 'length', unit: 'mm', value: 400, tex: 'A_w' },
        W: { name: 'width of the front view', q: 'length', unit: 'mm', value: 120 },
        D: { name: 'depth of the part (the width of the side view)', q: 'length', unit: 'mm', value: 72 },
        g: { name: 'gap between the views', q: 'length', unit: 'mm', value: 30 }
      },
      note: `The right view, the gap and the front view stand side by side. Do the same for the height with H instead of W and the height of the area; take the smaller scale and round it down to a standard one (1:1, 1:2, 1:5, 2:1 …).`
    },
    {
      name: 'Where a point falls in the right view (first angle)',
      expr: 'u = g + d',
      tex: 'u = g + d',
      vars: {
        u: { name: 'distance to the left of the front view', q: 'length', unit: 'mm' },
        g: { name: 'gap between the views', q: 'length', unit: 'mm', value: 30 },
        d: { name: 'depth of the point, measured from the back face', q: 'length', unit: 'mm', value: 40 }
      },
      note: `The back face (d = 0) is the edge of the right view nearest the front view, the front face (d = D) the farthest one; so the front of the part points away from the front view.`
    }
  ],
  examples: [
    {
      title: 'Where the views fall',
      q: `A part 90 mm wide, 60 high and 50 deep is drawn at 1:2 in first angle with a gap of 20 mm between the views on the sheet. How far from the centre of the front view are the centres of the top and right views, and how big is the whole arrangement?`,
      steps: [
        `At 1:2 the views measure 45 × 30 (front), 45 × 25 (top) and 25 × 30 (right).`,
        { text: `The top view lies below the front view; its centre is half a height, the gap and half a depth away:`, tex: '15 + 20 + 12.5 = 47.5\\ \\text{mm below}' },
        { text: `The right view lies to the left; its centre is half a width, the gap and half a depth away:`, tex: '22.5 + 20 + 12.5 = 55\\ \\text{mm to the left}' },
        `The arrangement is $25 + 20 + 45 = 90$ mm wide and $30 + 20 + 25 = 75$ mm high.`
      ],
      a: `The top view is centred 47.5 mm below the front view, the right view 55 mm to its left; the three views fill 90 × 75 mm.`
    },
    {
      title: 'Reading a drawing without a symbol',
      q: `On a drawing in first angle, a step in the part shows in the top view at the lower edge. On which side of the part is the step?`,
      steps: [
        `In first angle the front of the part points away from the front view in the top view, that is towards the bottom of the sheet.`,
        `The lower edge of the top view is therefore the front face of the part.`
      ],
      a: `The step is on the front face of the part (the side the front view looks at).`
    }
  ],
  quiz: [
    { q: `In first angle the view seen from the right is drawn`, choices: ['to the right of the front view', 'to the left of the front view', 'above it', 'below it'], a: 1, why: `The object is between you and the planes, so the view falls on the side opposite to the one you looked from: from the right, so on the left.` },
    { q: `In a first-angle drawing the front of the object points towards the front view in the top view.`, a: false, why: `It points away from it: the front edge is at the bottom of the top view, farthest from the front view. In third angle it is the other way round.` },
    { q: `The symbol of first-angle projection is a truncated cone with its two circles`, choices: ['on its right', 'on its left', 'above it', 'inside it'], a: 0, why: `The circles are the end view of the cone, which in first angle falls to the right of its front view. In third angle they stand on the left.` },
    { q: `A part is 80 mm wide and 50 mm deep, drawn 1:1 in first angle with 25 mm between views. How far to the left of the front view does the right view extend (to its far edge), in millimetres?`, answer: 75, unit: 'mm', why: `The right view starts one gap (25 mm) from the front view and is as wide as the part is deep (50 mm): its far edge is 25 + 50 = 75 mm away.` },
    { q: `Which view is drawn directly above the front view in first angle?`, choices: ['the top view', 'the bottom view', 'the rear view', 'the right view'], a: 1, why: `The view from below is drawn on the opposite side, above. The top view is below.` }
  ],
  applications: [
    `The layout of machine drawings in Europe, India and China: a drawing from these countries is normally read in first angle.`,
    `Parts exchanged between countries: a drawing that carries the symbol can be read correctly in either system.`,
    `Descriptive-geometry courses, where the first quadrant puts the object between viewer and plane and the horizontal plane is folded down.`,
    `Drawing-board practice with the mitre line: a quick, exact way to project the side view from the top view.`
  ],
  history: `The two planes of Monge's descriptive geometry (1795–99) put the object in the first quadrant, in front of the vertical plane and above the horizontal one, and folded the horizontal plane down. European draughtsmen kept that habit, and it became the arrangement of the Continental drawing office. American drawing offices moved during the twentieth century to the glass box, which is third angle. Both are defined in ISO 128 and ISO 5456-2, with their symbols, so that a drawing crossing a border cannot be misread.`,
  sources: [
    `ISO 5456-2:1996, Technical drawings — Projection methods — Part 2: Orthographic representations.`,
    `ISO 128-30:2001, Technical drawings — General principles of presentation — Part 30: Basic conventions for views.`,
    `Gaspard Monge, *Géométrie descriptive* (1799).`,
    `Colin H. Simmons and Dennis E. Maguire, *Manual of Engineering Drawing*, the chapter on orthographic projection.`
  ],
  sim: { id: 'mv-glass-box', params: { system: 'first' } },
  construction: 'mv-first-angle'
},

{
  id: 'third-angle-projection',
  parent: 'multiview-drawing',
  title: 'Third-angle projection',
  level: 1,
  short: `Put the object in a glass box and look at it from outside: the plane of projection stands between you and the object, and each view is marked on the pane nearest the eye. Unfolded, every view lies on the side it was seen from: top above, right on the right. The American, Canadian and Japanese system, marked by the cone with its circles on the left.`,
  keywords: ['third angle', 'third-angle', 'glass box', 'American projection', 'ASME Y14.3', 'method A', 'projection symbol', 'truncated cone', 'view arrangement'],
  prereq: ['orthographic-projection', 'first-angle-projection'],
  related: ['six-principal-views', 'the-third-view', 'monge-method', 'engineering-drawings', 'axonometric-projection'],
  body: `Put the object in a transparent box and walk round it. Looking at it from the front, you mark on the front pane what you see through the glass; looking from above, on the top pane; from the right, on the right pane. The **plane of projection is between you and the object**, and each point is carried back to you along its projector. Now open the box by folding the panes out about the front pane until all six lie in one plane: that is **third-angle projection**. (In Monge's planes the object lies in the third quadrant, behind the vertical plane and below the horizontal one, and the planes are seen through.)

### The rule
Because the panes are between you and the object, each view falls **on the side from which it was seen**: the top view above the front view, the right view on the right, the left view on the left, the bottom view below. It is the easy system for the eye: the picture of the top is where the top is. In the neighbouring views the **front of the object points towards the front view**: in the top view the front edge is the one nearest the front view, and in the right view too.

### The same views, exchanged
The views themselves are exactly those of [[first-angle-projection|first angle]]; only their positions change, as the matrices show: a quarter turn about the $x$-axis makes the top view $(x, y, z) \\mapsto (x, -z)$, in both systems, and in third angle that picture is put above the front view, in first angle below it. To convert a drawing from one system to the other, swap the top and bottom views and swap the left and right ones; the front and rear views stay where they are.

### Drawing it
Heights run along T-square lines between the front, left and right views, widths along verticals between the front and the top or bottom views. Depths turn the corner through the **45° mitre line**, which now stands in the empty corner above and to the right of the front view; or step them with dividers ([[the-third-view]]).

### The symbol
The symbol of third angle in ISO 5456-2 and in ASME Y14.3 is a truncated cone with the two concentric circles of its end view drawn **on the left** of it. It belongs in the title block.

> [!warn] Read a first-angle drawing as third angle, or the reverse, and the top view is mistaken for the bottom view and the left for the right: the part is made upside down or back to front. If the layout and the symbol disagree, ask before you cut.`,
  ideas: [
    `In third angle the plane of projection (the glass) stands between the observer and the object.`,
    `After unfolding, each view lies on the side it was seen from: top above, right on the right, bottom below, left on the left.`,
    `In the neighbouring views the front of the object points towards the front view. The mitre line stands in the corner beyond the top and right views.`,
    `Third angle uses the same views as first angle in different places; the symbol, with the circles on the left, tells which system a drawing is in.`
  ],
  pitfalls: [
    `Third angle is the same as first angle seen in a mirror — The views are not mirrored: the same six pictures are used, with top and bottom exchanged and left and right exchanged. A mirror would also reverse the left and right sides within each view.`,
    `The glass box is a real object — It is a thinking tool: the views are made by parallel projection, not through glass. Its use is to show where each view belongs on the sheet.`,
    `The system does not matter if the views are labelled — Labels such as top and right are names of the direction of view; without the symbol or the layout rule the reader cannot be sure which side of the part a view shows.`
  ],
  formulas: [
    {
      name: 'Scale that fits the height',
      expr: 's = Ah/(H + D + g)',
      tex: 's = \\frac{A_h}{H + D + g}',
      vars: {
        s: { name: 'scale (size on the paper : size of the part)' },
        Ah: { name: 'height of the drawing area', q: 'length', unit: 'mm', value: 277, tex: 'A_h' },
        H: { name: 'height of the front view', q: 'length', unit: 'mm', value: 120 },
        D: { name: 'depth of the part (the height of the top view)', q: 'length', unit: 'mm', value: 72 },
        g: { name: 'gap between the views', q: 'length', unit: 'mm', value: 30 }
      },
      note: `The front view, the gap and the top view stand one above the other. Use it together with the width formula of first angle; the smaller scale wins.`
    },
    {
      name: 'Where a point falls in the right view (third angle)',
      expr: 'u = g + f',
      tex: 'u = g + f',
      vars: {
        u: { name: 'distance to the right of the front view', q: 'length', unit: 'mm' },
        g: { name: 'gap between the views', q: 'length', unit: 'mm', value: 30 },
        f: { name: 'distance of the point behind the front face', q: 'length', unit: 'mm', value: 40 }
      },
      note: `The front face (f = 0) is the edge of the right view nearest the front view; the farther a point is behind it, the farther it is drawn.`
    }
  ],
  examples: [
    {
      title: 'Which face is nearest?',
      q: `The L-bracket of the constructions is drawn with a gap of 30 mm. In first angle the edge of the right view nearest the front view is 30 mm to its left; in third angle it is 30 mm to its right. Which face of the part is that edge in each case?`,
      steps: [
        `In first angle the front of the part points away from the front view, so the nearest edge is the **back** face.`,
        `In third angle the front points towards the front view, so the nearest edge is the **front** face.`,
        `The mitre line passes through the corner point 30 mm from the front view in both directions, and in third angle that corner is on the near side of the part's front.`
      ],
      a: `First angle: the nearest edge is the back face; third angle: the front face.`
    },
    {
      title: 'The glass box by numbers',
      q: `A part 100 mm wide, 60 mm high and 40 mm deep is drawn 1:1 in third angle with 20 mm between the views. How big is the arrangement of front, top and right views, and how far above the front view's centre is the centre of the top view?`,
      steps: [
        { text: `Width: front view, gap and right view:`, tex: '100 + 20 + 40 = 160\\ \\text{mm}' },
        { text: `Height: front view, gap and top view:`, tex: '60 + 20 + 40 = 120\\ \\text{mm}' },
        { text: `The centre of the top view lies above the centre of the front view by half a height, the gap and half a depth:`, tex: '30 + 20 + 20 = 70\\ \\text{mm}' }
      ],
      a: `The three views need 160 × 120 mm; the top view is centred 70 mm above the front view.`
    }
  ],
  quiz: [
    { q: `In third angle the view from below (the bottom view) is drawn`, choices: ['above the front view', 'below the front view', 'to the right of the front view', 'beside the rear view'], a: 1, why: `The panes are between you and the object, so every view lies on the side it was seen from: from below, so below.` },
    { q: `In a third-angle drawing the front of the object points away from the front view in the top view.`, a: false, why: `It points towards the front view: the near edge of the top view is the front of the part. In first angle it is the other way round.` },
    { q: `Why is it called the glass box method?`, choices: ['The plane of projection stands between the observer and the object, like a pane of glass', 'The object is drawn on glass', 'The views are transparent', 'The object lies in a glass case'], a: 0, why: `In third angle each view is marked on the pane nearest the eye, so the pane is between you and the object. In first angle the object is between you and the planes.` },
    { q: `A drawing has the top view above the front view and the right view to its right, but the symbol shows the circles on the right of the cone. What should you do?`, choices: ['Trust the layout and build it in third angle', 'Trust the symbol and build it in first angle', 'Ask the drawing office: the drawing contradicts itself', 'Build one of each'], a: 2, why: `The layout is third angle and the symbol is first angle. Neither can be trusted over the other, and a guess gives a part made upside down or back to front: the author must clarify.` }
  ],
  applications: [
    `Drawings made to ASME Y14.3 in the United States and Canada, and to JIS B 0001 in Japan, are in third angle.`,
    `Suppliers and aerospace or automotive companies that follow ASME standards: their drawing templates carry the third-angle symbol.`,
    `CAD packages offer a switch between the two methods; the template for a drawing sets it, and with it the symbol.`,
    `Product design and model sheets, where the six views of a thing are shown as if folded from a box.`
  ],
  history: `The glass box is the American teaching device for orthographic projection, and in the twentieth century American industry settled on third angle, in which each view lies on the side it was seen from; the standards that became ASME Y14.3 fixed it. Japan adopted the same arrangement. Because the two systems met in international trade, ISO 128 and ISO 5456-2 give both with a symbol, the cone and its circles, so that a drawing states which one it uses.`,
  sources: [
    `ASME Y14.3, Orthographic and Pictorial Views.`,
    `ISO 5456-2:1996, Technical drawings — Projection methods — Part 2: Orthographic representations.`,
    `Frederick E. Giesecke and others, *Technical Drawing with Engineering Graphics*, the chapter on multiview projection.`
  ],
  sim: { id: 'mv-glass-box', params: { system: 'third' } },
  construction: 'mv-third-angle'
},

{
  id: 'six-principal-views',
  parent: 'multiview-drawing',
  title: 'The six principal views',
  level: 1,
  short: `An object has six sides, so six principal views: front, top, bottom, right, left and rear, the faces of the projection box unfolded into one sheet. Choose the front view for its shape, draw only as many of the others as the part needs, and keep their edges aligned.`,
  keywords: ['principal views', 'six views', 'front view', 'rear view', 'left view', 'bottom view', 'alignment', 'ISO 128-30', 'view selection', 'glass box'],
  prereq: ['first-angle-projection', 'third-angle-projection'],
  related: ['the-third-view', 'orthographic-projection', 'section-views', 'engineering-drawings', 'auxiliary-views'],
  body: `The box that surrounds an object has six faces, so there are six **principal views**. ISO 128-30 names them with letters: **A** from the front (the *principal view*), **B** from above, **C** from the left, **D** from the right, **E** from below and **F** from the rear. Each is the orthographic projection along one of the three axes, from one end or the other.

### The six projections
| View | You look from | Turn first | A point $(x, y, z)$ is drawn at |
|---|---|---|---|
| A front | the front | nothing | $(x,\\ y)$ |
| F rear | behind | half a turn about the vertical | $(-x,\\ y)$ |
| D right | the right | quarter turn about the vertical | $(-z,\\ y)$ |
| C left | the left | quarter turn the other way | $(z,\\ y)$ |
| B top | above | quarter turn about the $x$-axis | $(x,\\ -z)$ |
| E bottom | below | quarter turn the other way | $(x,\\ z)$ |

Here $z$ points towards the viewer of the front view, so the minus sign in the top view puts the front of the object at the bottom of the picture.

### Alignment
The views are placed so that the same measure lies on the same line. **Heights** are shared by the front, left, right and rear views, which sit in one horizontal band; **widths** by the front, top and bottom views, in one vertical band; **depths** by the top, bottom, left and right views, which is why the mitre line (or the dividers) is needed to carry them from a vertical to a horizontal position. With a gap $g$ between neighbours, all six together need a sheet $2W + 2D + 3g$ wide and $H + 2D + 2g$ high.

### How many, and which
Draw the **fewest views that describe the part completely**. A turned part needs one view and the diameter symbol; a plate one view and its thickness; most parts two or three. Choose the **front view** to show the shape best, in the working position of the part, and then:
- prefer, between a left and a right view, the one with fewer hidden lines (the right view of the L-bracket has none, its left view has one);
- add the views that show features no other shows; omit the ones that merely repeat;
- when a view cannot sit in its normal place, mark the direction with an arrow and a letter and name the view with the same letter.

> [!tip] Hold the object in your hand and name the sides you would walk round to see: each side that has a feature of its own deserves a view, and no more.`,
  ideas: [
    `The six principal views are the projections along the three axes from both ends: front, rear, right, left, top and bottom (A to F in ISO 128-30).`,
    `Heights are shared by the views in one horizontal band, widths by those in one vertical band; depths link the top, bottom and side views.`,
    `Draw the fewest views that describe the part; choose the front view for shape and working position, and avoid views full of hidden lines.`,
    `All six views of a part with gap g need 2W + 2D + 3g by H + 2D + 2g.`
  ],
  pitfalls: [
    `A proper drawing shows all six views — Most parts need two or three; each additional view must show something the others do not. Drawing too many costs time and invites contradictions.`,
    `The rear view is the front view mirrored — It is the front view's counterpart seen from behind: left and right exchanged, and features hidden from the front shown in full. The bracket's upright stands on the left in the front view and on the right in the rear one.`,
    `The front view is the face on the front of the part — It is whichever view shows the shape best, in its working position, whatever face that is.`
  ],
  formulas: [
    {
      name: 'Width of all six views',
      expr: 'Wt = 2*W + 2*D + 3*g',
      tex: 'W_t = 2W + 2D + 3g',
      vars: {
        Wt: { name: 'total width of the six views', q: 'length', unit: 'mm', tex: 'W_t' },
        W: { name: 'width of the part', q: 'length', unit: 'mm', value: 120 },
        D: { name: 'depth of the part', q: 'length', unit: 'mm', value: 72 },
        g: { name: 'gap between views', q: 'length', unit: 'mm', value: 30 }
      },
      note: `Right, front, left and rear views in a row: two widths, two depths and three gaps. The L-bracket of the constructions needs 474 mm at full size.`
    },
    {
      name: 'Height of all six views',
      expr: 'Ht = H + 2*D + 2*g',
      tex: 'H_t = H + 2D + 2g',
      vars: {
        Ht: { name: 'total height of the six views', q: 'length', unit: 'mm', tex: 'H_t' },
        H: { name: 'height of the part', q: 'length', unit: 'mm', value: 120 },
        D: { name: 'depth of the part', q: 'length', unit: 'mm', value: 72 },
        g: { name: 'gap between views', q: 'length', unit: 'mm', value: 30 }
      },
      note: `Top, front and bottom views in a column: one height, two depths and two gaps. For the L-bracket, 324 mm.`
    }
  ],
  examples: [
    {
      title: 'How many views does a flanged bush need?',
      q: `A flanged bush has a flange Ø60 × 8 thick, a body Ø36 and a bore Ø20, 38 mm long overall. Which views describe it?`,
      steps: [
        `It is a body of revolution: the front view shows the stepped outline and, in section, the bore; the diameters are given with the symbol Ø.`,
        `A top view would show only three concentric circles, which the Ø dimensions already say.`,
        `One view, drawn as a half section ([[section-views]]) with the dimensions Ø60, Ø36, Ø20, 8 and 38, is complete.`
      ],
      a: `One view is enough, drawn as a half section with the diameters dimensioned; a second view would only repeat it.`
    },
    {
      title: 'Which sheet for six views?',
      q: `The six views of the L-bracket with gaps of 30 mm need 474 × 324 mm at 1:1. Which scale fits an A4 sheet whose drawing area is 277 × 190 mm?`,
      steps: [
        `Width: $277 / 474 = 0.58$. Height: $190 / 324 = 0.59$. The smaller is 0.58.`,
        `Standard scales below 0.58 are 1:2 (0.5), 1:5, 1:10 …; take **1:2**.`,
        `At 1:2 the views need $237 \\times 162$ mm, which fits.`
      ],
      a: `Scale 1:2; the six views then occupy 237 × 162 mm of the 277 × 190 mm area.`
    }
  ],
  quiz: [
    { q: `Which of these views lies in the same horizontal band as the front view, sharing its heights?`, choices: ['the top view', 'the right view', 'the bottom view', 'none of them'], a: 1, why: `Heights are shared by the front, left, right and rear views. The top and bottom views share widths with the front view, in a vertical band.` },
    { q: `A complete drawing must always show all six principal views.`, a: false, why: `Draw the fewest views that describe the part. A turned part may need one, most parts two or three.` },
    { q: `The hidden line in the left view of the L-bracket is`, choices: ['the top of the foot, hidden behind the left face of the upright', 'the inner face of the upright', 'a hole', 'the rear edge'], a: 0, why: `From the left you see only the big left face of the upright; the top surface of the foot is behind it, so its edge is drawn dashed at the height of the foot's top.` },
    { q: `The six views of a part 100 wide, 80 high and 50 deep with gaps of 20 mm need a sheet at least how wide, in millimetres?`, answer: 360, unit: 'mm', why: `W_t = 2 × 100 + 2 × 50 + 3 × 20 = 360 mm: two widths, two depths and three gaps.` },
    { q: `The front view of a part should be chosen as`, choices: ['the largest face', 'the view that shows the shape best, in the working position', 'whatever is on top', 'the view with the most hidden lines'], a: 1, why: `The front view is the principal view: the one that describes the part most, usually in its working position. The others are chosen around it.` }
  ],
  applications: [
    `Castings and housings, which need front, top and side views and often rear or bottom ones to show every boss and rib.`,
    `Architectural elevations: the four sides of a building are its front, rear, left and right views, with the roof plan as the top view.`,
    `CAD drawing generation: the user picks the front view and the other views follow in the standard arrangement, aligned to it.`,
    `Character and vehicle turnarounds in animation and games: six-view orthographic sheets are the reference for modelling.`
  ],
  history: `Folding the faces of a cube into a plane is an old idea: Dürer printed nets of solids in 1525, and Monge's two planes of 1795 are the same thought at its smallest. The six-view box is the teaching form that engineering drawing took in the twentieth century. ISO 128-30 designates the views A to F so that a drawing can refer to any of them, wherever it is placed.`,
  sources: [
    `ISO 128-30:2001, Technical drawings — General principles of presentation — Part 30: Basic conventions for views.`,
    `ISO 5456-2:1996, Technical drawings — Projection methods — Part 2: Orthographic representations.`,
    `ASME Y14.3, Orthographic and Pictorial Views.`,
    `Colin H. Simmons and Dennis E. Maguire, *Manual of Engineering Drawing*.`
  ],
  sim: 'mv-glass-box',
  construction: 'mv-six-views'
},

{
  id: 'the-third-view',
  parent: 'multiview-drawing',
  title: 'Finding the third view',
  level: 2,
  short: `Every point has three coordinates and each view shows two, so two views usually fix the third. Carry heights across with the T-square, widths with the set square and depths round the 45° mitre line, join the new points as the given views say, and decide which edges are hidden.`,
  keywords: ['third view', 'missing view', 'mitre line', '45 degree line', 'projector', 'hidden lines', 'point by point', 'Euler', 'reconstruction'],
  prereq: ['first-angle-projection', 'third-angle-projection', 'orthographic-projection'],
  related: ['six-principal-views', 'section-views', 'line-conventions', 'monge-method', 'point-and-line-in-monge'],
  body: `Given the front and top views of an object, can you draw the right view? Usually yes. It is the classic exercise of the drawing class and the best test of whether you see the object in your head.

### The method
A point $P = (x, y, z)$ appears as $(x, y)$ in the front view, $(x, z)$ in the top view and $(z, y)$ in the right view. The two given images already hold all three coordinates, the **height** $y$ in the front view and the **depth** $z$ in the top view. The new image lies where the **horizontal** through the front image (it carries $y$) meets the **vertical** that comes up from the mitre line (it carries $z$).

The depth must turn a corner: in the top view it is a distance up or down the sheet, in the right view a distance sideways. A line at **45°** does the turning, because reflecting in a 45° line exchanges the horizontal and the vertical: run a horizontal from the top view until it meets the line, then go vertical. The same can be done with dividers.

### Step by step
1. Label the corners in both given views, and read off which are joined.
2. For each corner, draw the horizontal from its front-view image and the horizontal-then-vertical route from its top-view image; mark where they cross.
3. Join the new points in the same order as the given views join theirs.
4. Decide what is hidden: an edge is dashed if some face lies between it and the viewer. Ask, for each edge, what you would meet looking along the projectors.
5. Check every corner appears in all three views; for a solid without holes, count corners, edges and faces: $V - E + F = 2$ (Euler).

### Not always unique
Two views do not always fix the object. A tunnel drilled along the length of a block shows two dashed lines in the front view and two in the top view, whether the tunnel is round or square; only the third view shows its section. That is why hidden lines are drawn, and why a third view, or a section, is added whenever the first two leave a doubt.

> [!tip] When you carry a point round the mitre line, name it in all three views (P′, P″, P‴, or 1, 1′, 1″). A numbered corner that is lost in one view is usually an edge you forgot to draw.`,
  ideas: [
    `A point has three coordinates and a view shows two: the front view gives x and y, the top view x and z, the right view z and y.`,
    `Heights come from the front view by horizontals, depths from the top view round the 45° mitre line (or by dividers), and their crossing is the new point.`,
    `Join the new points as the given views join theirs, then decide which edges are hidden and draw them dashed.`,
    `Two views can fit more than one solid; hidden lines, a third view or a section removes the doubt.`
  ],
  pitfalls: [
    `The third view is just a copy of one of the others — It has its own shape: the new view takes its heights from the front view and its depths from the top view, so it shows features the other two only imply, such as the end of a tunnel.`,
    `Two views always define the solid — They often do not. Two dashed lines in each of two views can be a round or a square tunnel; only a third view tells.`,
    `The 45° line is a stylistic habit — It does real work: it exchanges a vertical distance for a horizontal one of equal size. Any 45° line works, but it must be at exactly 45° and the two gaps must match its position.`
  ],
  formulas: [
    {
      name: 'Euler\'s check for a solid without holes',
      expr: 'V - E + F = 2',
      tex: 'V - E + F = 2',
      vars: {
        V: { name: 'number of corners', value: 10, int: true },
        E: { name: 'number of edges', value: 15, int: true },
        F: { name: 'number of faces', value: 7, int: true }
      },
      solveFor: 'F',
      note: `Valid for a solid with no through holes whose faces are flat polygons: a cube has 8 − 12 + 6 = 2; a cube with one corner sliced off has 10 − 15 + 7 = 2. If your three views give a different number, a corner or edge is missing.`
    },
    {
      name: 'The mitre rule',
      expr: 'xR = xN + (yT - yN)',
      tex: 'x_R = x_N + (y_T - y_N)',
      vars: {
        xR: { name: 'horizontal position of the point in the right view', q: 'length', unit: 'mm', signed: true, tex: 'x_R' },
        xN: { name: 'horizontal position of the mitre corner N', q: 'length', unit: 'mm', value: -30, signed: true, tex: 'x_N' },
        yN: { name: 'vertical position of the mitre corner N', q: 'length', unit: 'mm', value: -30, signed: true, tex: 'y_N' },
        yT: { name: 'vertical position of the point in the top view', q: 'length', unit: 'mm', value: -70, signed: true, tex: 'y_T' }
      },
      note: `A point at distance d beyond the corner N in the top view is at distance d from N in the right view: the 45° line carries equal steps. With the figures of the construction (N at −30, −30) a point at y = −70 falls at x = −70.`
    }
  ],
  examples: [
    {
      title: 'One point round the mitre line',
      q: `In first angle with a gap of 30 mm, a corner of a tunnel is 22 mm above the base and 40 mm from the back face. Where is it in the right view, measured from the lower left corner of the front view?`,
      steps: [
        `In the top view the back edge is 30 mm below the front view; the corner is 40 mm further down: $y_T = -30 - 40 = -70$.`,
        `The horizontal from the top view meets the mitre line (through $N = (-30, -30)$) at $(-70, -70)$.`,
        `The vertical from there rises to the horizontal drawn at the height 22 from the front view.`
      ],
      a: `The corner is at x = −70, y = 22 in the right view: 70 mm to the left of the front view's left edge and 22 mm up.`
    },
    {
      title: 'Counting for Euler',
      q: `A cube has a corner sliced off by a plane through three points, one on each edge at the corner. Check Euler's formula.`,
      steps: [
        `Corners: the cube had 8; the cut removes one and adds three, giving $8 - 1 + 3 = 10$.`,
        `Edges: 12 of the cube plus the three sides of the cut triangle: 15.`,
        `Faces: 6 of the cube plus the triangle: 7.`,
        { text: `Then`, tex: 'V - E + F = 10 - 15 + 7 = 2.' }
      ],
      a: `10 − 15 + 7 = 2, so the count is consistent.`
    }
  ],
  quiz: [
    { q: `To draw the right view from the front and top views you take the heights from the ___ and the depths from the ___.`, choices: ['front view … top view', 'top view … front view', 'front view … front view', 'top view … top view'], a: 0, why: `The front view shows height y, the top view shows depth z; the right view shows z and y, so it combines the two.` },
    { q: `The 45° mitre line is needed because the same quantity, depth, is a vertical distance in the top view and a horizontal one in the right view.`, a: true, why: `Reflecting in a 45° line swaps the two directions while keeping every distance, which is exactly the change from the top view's vertical depth to the right view's horizontal one.` },
    { q: `Two dashed lines run the whole length of a block in the front view, and two more in the top view. What do you need to know whether the tunnel is round or square?`, choices: ['the right view', 'a larger scale', 'nothing: it must be square', 'only the bottom view'], a: 0, why: `Both shapes give two dashed lines in both views. The end view, the right view, shows a circle or a rectangle.` },
    { q: `In first angle with a gap of 30 mm, a point is 40 mm from the back face. How far to the left of the front view's left edge is it in the right view, in millimetres?`, answer: 70, unit: 'mm', why: `The back face is one gap (30 mm) from the front view in the right view, and the point is 40 mm beyond it: 30 + 40 = 70 mm.` }
  ],
  applications: [
    `Reading drawings: the machinist or inspector builds the part in the head by supplying the view that is not drawn.`,
    `Checking a drawing: projecting the missing view reveals contradictions between the given views and hidden-line errors.`,
    `Reconstructing a 3-D model from old paper drawings: extrude each view and intersect the results, then remove what a third view forbids.`,
    `Engineering-graphics tests and exams, which ask for the missing view as a measure of spatial reasoning.`,
    `Shape from silhouettes in 3-D scanning: intersecting the extruded outlines seen from several directions is the same idea.`
  ],
  history: `Monge's descriptive geometry (1795–99) was built on exactly this: a point fixed by its two projections on perpendicular planes, and a third plane when needed. The device of the 45° line to transfer distances between the plan and the side view is a commonplace of the drawing-board textbooks of the nineteenth and twentieth centuries; computer systems now do the intersection numerically, but the reasoning is unchanged.`,
  sources: [
    `Gaspard Monge, *Géométrie descriptive* (1799).`,
    `Thomas E. French, Charles J. Vierck and Robert J. Foster, *Engineering Drawing and Graphic Technology*, the chapter on multiview drawing.`,
    `N. D. Bhatt, *Elementary Engineering Drawing*, the chapters on orthographic projection and missing views.`
  ],
  sim: 'mv-mitre-line',
  construction: 'mv-third-view'
},

{
  id: 'section-views',
  parent: 'multiview-drawing',
  title: 'Section views',
  level: 2,
  short: `A hollow part drawn in plain views is a thicket of dashed lines. Cut it with an imaginary plane, throw away the half between the plane and the viewer, and draw what is left: the cut faces hatched at 45°, the cutting plane marked on another view by a chain line with letters and arrows.`,
  keywords: ['section', 'cutting plane', 'hatching', 'full section', 'half section', 'offset section', 'revolved section', 'broken-out section', 'ribs', 'chain line', 'A-A'],
  prereq: ['six-principal-views', 'line-conventions', 'the-third-view'],
  related: ['dimensioning-basics', 'engineering-drawings', 'architectural-drawings', 'auxiliary-views', 'developments'],
  body: `A drawing of a hollow part in ordinary views is full of dashed lines: the bores, the cavities, the ribs inside. Cut the part with an imaginary plane, remove the portion between the plane and the viewer, and draw what remains. The result is a **section**.

### Making a section
1. Mark the **cutting plane** on a neighbouring view: a thin chain line, thick at its ends and wherever it changes direction, with arrows showing the direction of view and a letter at each end (A–A).
2. Draw the remaining part as seen along the arrows. A *section view* contains the cut faces and everything visible beyond them.
3. **Hatch** the cut faces with thin continuous lines at 45° to the main outline or axis, evenly spaced (never closer than about 0.7 mm; 2 to 4 mm for ordinary parts), the same direction and spacing across all the cut faces of one part. Different parts of an assembly get different directions or spacings.
4. Leave out hidden lines unless they are needed, and name the view "Section A–A". The edges of the cut faces are drawn thick, like any visible edge.

### Kinds of section
- **Full section**: one plane cuts straight through.
- **Half section**: for symmetrical parts, one half is cut and the other half left as an outside view, divided by the centre line: no hidden lines are needed in either.
- **Offset section**: the plane steps to pass through several features; the steps are marked by thick ends on the plane line but not drawn in the section.
- **Revolved and removed sections**: the profile of a rib, arm or spoke turned into the view (thin outline) or drawn beside it.
- **Partial (broken-out) section**: a local cut, bounded by a thin freehand line.
- **Aligned section**: spokes or holes set round a hub are turned into the cutting plane.

### What is not hatched
Ribs, webs, spokes, shafts, bolts, screws, nuts, washers, pins and keys are shown **uncut** when the plane runs lengthwise through them: hatching a thin rib would make the part look solid and heavy, and a section through a bolt would suggest a hollow tube round it.

### What the plane does to a hole
A plane that misses the axis of a hole by a distance $c$ cuts a chord of half-width $a = \\sqrt{r^2 - c^2}$, so the hole looks narrower; at $c = r$ the plane only grazes it, beyond that the section shows solid material. Cut walls obliquely and they look thicker, by $1/\\sin\\alpha$; that is why cutting planes are placed square to walls.`,
  ideas: [
    `A section is an imaginary cut: the part between the plane and the viewer is removed, and the cut faces are hatched with thin lines at 45°.`,
    `The cutting plane is marked on another view by a thin chain line, thick at the ends and bends, with arrows for the direction of view and letters A–A.`,
    `Full, half, offset, revolved, partial and aligned sections serve different shapes; a half section of a symmetrical part needs no hidden lines.`,
    `Ribs, webs, shafts, bolts and similar parts cut lengthwise are drawn uncut, without hatching.`
  ],
  pitfalls: [
    `A section view shows only the hatched area — It shows the cut faces and also whatever is visible beyond them; the hatching marks only what the plane actually cut.`,
    `The removed half is drawn as a ghost — The convention is that the removal is imaginary and complete: in the other views the part is shown whole, not cut away, and no ghost is drawn.`,
    `A thick line divides the two halves of a half section — A centre line (thin chain) does; a thick line would suggest an edge that does not exist.`
  ],
  formulas: [
    {
      name: 'Chord of a hole cut off-centre',
      expr: 'a = sqrt(r^2 - c^2)',
      tex: 'a = \\sqrt{r^2 - c^2}',
      vars: {
        a: { name: 'half-width of the hole in the section', q: 'length', unit: 'mm' },
        r: { name: 'radius of the hole', q: 'length', unit: 'mm', value: 10 },
        c: { name: 'distance of the cutting plane from the axis', q: 'length', unit: 'mm', value: 6 }
      },
      note: `On the axis (c = 0) the section shows the full diameter; the width shrinks to nothing at c = r. This is the half-chord of Pythagoras in the circle of the hole.`
    },
    {
      name: 'Apparent thickness of a wall cut obliquely',
      expr: 'ta = t/sin(alpha)',
      tex: 't_a = \\frac{t}{\\sin\\alpha}',
      vars: {
        ta: { name: 'thickness of the wall in the section', q: 'length', unit: 'mm', tex: 't_a' },
        t: { name: 'true thickness of the wall', q: 'length', unit: 'mm', value: 6 },
        alpha: { name: 'angle between the cutting plane and the wall surface', q: 'angle', unit: '°', value: 60, min: 5, max: 90 }
      },
      note: `A plane square to the wall (α = 90°) shows the true thickness; at 30° the wall looks twice as thick.`
    }
  ],
  examples: [
    {
      title: 'An off-centre cut',
      q: `A block has a hole of diameter 20 mm and a counterbore of diameter 36 mm. A cutting plane runs parallel to the front, 6 mm in front of the axis. What are the widths of the hole and the counterbore in the section?`,
      steps: [
        { text: `Hole, $r = 10$:`, tex: '2\\sqrt{10^2 - 6^2} = 2\\times 8 = 16\\ \\text{mm}' },
        { text: `Counterbore, $r = 18$:`, tex: '2\\sqrt{18^2 - 6^2} = 2\\times 16.97 = 33.9\\ \\text{mm}' },
        `Both are narrower than the true diameters, and the section cut face is in two pieces, since the plane passes through the hole.`
      ],
      a: `The hole shows 16 mm wide and the counterbore 33.9 mm; the cut face is in two pieces.`
    },
    {
      title: 'How many hatching lines?',
      q: `A rectangular cut face 60 × 40 mm is hatched at 45° with a spacing of 2.5 mm between the lines. About how many lines are drawn?`,
      steps: [
        `The lines are 45° lines; the rectangle's extent across them is the projection of its sides on the perpendicular direction: $(60 + 40)/\\sqrt 2 = 70.7$ mm.`,
        `Number of lines: $70.7 / 2.5 \\approx 28$.`
      ],
      a: `About 28 lines, each running from outline to outline.`
    }
  ],
  quiz: [
    { q: `The hatching lines of a section are`, choices: ['thin, continuous and at 45° to the main outline or axis', 'thick and vertical', 'dashed at 30°', 'chain lines'], a: 0, why: `ISO 128 hatching is a thin continuous line, preferably at 45°, evenly spaced, in the same direction over all cut faces of one part.` },
    { q: `In a half section of a symmetrical part, a thick line divides the sectioned half from the outside half.`, a: false, why: `The dividing line is the centre line (thin chain). A thick line would suggest a visible edge there.` },
    { q: `A rib is cut lengthwise by the cutting plane. In the section view it is`, choices: ['hatched like the rest', 'drawn uncut, without hatching', 'drawn dashed', 'left out altogether'], a: 1, why: `Ribs, webs, spokes, shafts, bolts and similar parts are shown uncut when the plane passes along them, so that they do not look like solid slabs.` },
    { q: `A cutting plane lies 8 mm from the axis of a hole of diameter 20 mm. How wide is the hole in the section, in millimetres?`, answer: 12, unit: 'mm', why: `2 √(10² − 8²) = 2 × 6 = 12 mm.` },
    { q: `Why are hidden lines normally left out of a section view?`, choices: ['The cut was made to remove them from view, and dashed lines would clutter the hatched drawing again', 'They do not exist in a section', 'The standard forbids thick lines', 'They are drawn in the plan instead'], a: 0, why: `The purpose of a section is to show the inside plainly. Hidden lines are added only when they are needed to understand the part.` }
  ],
  applications: [
    `Castings and forgings: sections show wall thickness, cores, ribs and bosses that outside views can only hint at.`,
    `Valves, pumps, engines and gearboxes: assembly drawings are largely sections, showing how the parts fit inside.`,
    `Architecture: a building section cuts through floors, stairs, foundations and roof to show how it is built.`,
    `Medical imaging and earth science: CT and MRI slices and geological cross-sections are sections too, with the same idea of a cutting plane.`,
    `CAD systems cut a 3-D model with a plane and hatch the result automatically, following the rules above.`
  ],
  history: `The section is as old as architectural drawing, since a building section is just a cut through it, and Leonardo's notebooks are full of cutaway and sectional views of mechanisms. Engineers of the eighteenth and nineteenth centuries carried the section into machine drawings, and the modern conventions (hatching at 45°, chain-line cutting planes, uncut ribs and shafts) were fixed in national standards in the twentieth century and then in ISO 128-40, 128-44 and 128-50.`,
  sources: [
    `ISO 128-40:2001, Technical drawings — General principles of presentation — Part 40: Basic conventions for cuts and sections.`,
    `ISO 128-44:2001, Part 44: Sections on mechanical engineering drawings.`,
    `ISO 128-50:2001, Part 50: Basic conventions for representing areas on cuts and sections.`,
    `ASME Y14.3, Orthographic and Pictorial Views.`
  ],
  sim: 'mv-cutting-plane',
  construction: ['mv-full-section', 'mv-half-section']
},

{
  id: 'line-conventions',
  parent: 'multiview-drawing',
  title: 'Lines, hidden lines and conventions',
  level: 1,
  short: `A drawing speaks in line widths and patterns: thick continuous lines for what you see, thin dashes for what is hidden, chain lines for centres and cutting planes, thin continuous lines for dimensions and hatching. ISO 128 fixes the types, the 2 : 1 widths, the dash lengths and the order of priority when lines coincide.`,
  keywords: ['line types', 'ISO 128', 'hidden lines', 'dashed', 'centre line', 'chain line', 'line width', 'visible edge', 'phantom line', 'priority of lines', 'ASME Y14.2'],
  prereq: ['orthographic-projection', 'six-principal-views'],
  related: ['section-views', 'dimensioning-basics', 'the-third-view', 'engineering-drawings', 'first-angle-projection'],
  body: `Every line on an engineering drawing says two things at once, by its **pattern** and by its **width**. Learn the alphabet and a drawing can be read without notes: thick means seen, dashes mean hidden, chains mean centres or cuts, thin continuous lines mean dimensions and hatching.

### The standard types (ISO 128-24)
| Type | Appearance | Used for |
|---|---|---|
| 01.2 | continuous thick | visible outlines and edges |
| 01.1 | continuous thin | dimension, extension and leader lines, hatching, short centre lines, outlines of revolved sections |
| 02.1 | dashed thin | hidden outlines and edges |
| 04.1 | long-dash dotted thin (chain) | centre lines, axes of symmetry, pitch circles |
| 04.1 with 04.2 | chain, thick at the ends and bends | cutting planes |
| 05.1 | long-dash double-dotted thin | outlines of adjacent parts, extreme positions of moving parts, original shape before forming |
| 01.1 | freehand or zigzag thin | limits of partial and interrupted views |

### Widths and lengths
Widths follow a series that grows by $\\sqrt 2$: 0.13, 0.18, 0.25, 0.35, 0.5, 0.7, 1, 1.4 and 2 mm. A thick line is **twice** a thin one: on an A3 or A4 sheet 0.5 and 0.25 mm, or 0.7 and 0.35 mm. Within one drawing a line type keeps the same width in every view. The pieces of broken lines scale with the width $d$: a dash is $12\\,d$ long with $3\\,d$ between dashes, a long dash $24\\,d$, a dot at most $0.5\\,d$. With a 0.35 mm line, hidden dashes are about 4 mm long with 1 mm gaps.

### Drawing them by hand
- A hidden line starts and ends with a dash where it leaves a visible line, but when it continues a visible line it starts with a gap; dashes meet at corners, and at tangent points an arc begins with a dash.
- Centre lines cross on long dashes, project 2 to 3 mm beyond the outline, and never run on into the next view; for small circles use a thin continuous centre cross.
- Use a hard pencil (H or 2H) sharpened to a point for thin lines and a softer one (HB or F), rounded, for thick lines; check the whole sheet for even weight.
- Light construction lines are not part of the drawing; they should be faint enough to be ignored.

### Priority
When two lines would fall on the same place, only the higher one is drawn: **visible edge, hidden edge, cutting plane, centre line, projection (extension) line.** A centre line that coincides with a hidden line gives way to it, and then continues beyond the outline.

> [!tip] If a dashed line meets a visible line at a T or corner, make the dash touch it; if it seems to stop short, the reader will guess a gap where there is none.`,
  ideas: [
    `Pattern and width carry the meaning: thick continuous means visible, thin dashed hidden, thin chain a centre line or axis, thick-ended chain a cutting plane.`,
    `A thick line is twice as wide as a thin one, and the standard widths grow by √2; dashes and gaps scale with the width (dash 12 d, gap 3 d).`,
    `Where lines coincide the order of priority is: visible edge, hidden edge, cutting plane, centre line, projection line.`,
    `Hidden lines are dashes that meet visible lines and corners cleanly; centre lines cross at long dashes and project a little beyond the outline.`
  ],
  pitfalls: [
    `All lines can be the same weight — Then the drawing cannot be read at a glance: the 2 : 1 contrast between thick (seen) and thin (everything else) is what lets the eye pick out the shape.`,
    `Hidden lines are optional decoration — They carry real information about internal shapes. Draw those that are needed, and leave out those that only clutter (as in a section).`,
    `Dashes of any length will do — Dash and gap lengths follow the line width so that the pattern reads as one kind of line; a long-dash chain and a short-dash hidden line can only be told apart if each keeps its proportions.`
  ],
  formulas: [
    {
      name: 'Length of a dash of a hidden line',
      expr: 'a = 12*d',
      tex: 'a = 12\\,d',
      vars: {
        a: { name: 'length of a dash', q: 'length', unit: 'mm' },
        d: { name: 'line width', q: 'length', unit: 'mm', value: 0.35 }
      },
      note: `ISO 128-20 also fixes the gap at 3 d. For a 0.25 mm thin line a dash is 3 mm and the gap 0.75 mm.`
    },
    {
      name: 'Pitch of a chain line',
      expr: 'p = 30.5*d',
      tex: 'p = (24 + 3 + 0.5 + 3)\\,d',
      vars: {
        p: { name: 'distance from one long dash to the next', q: 'length', unit: 'mm' },
        d: { name: 'line width', q: 'length', unit: 'mm', value: 0.25 }
      },
      note: `A long dash (24 d), a gap (3 d), a dot (about 0.5 d) and another gap (3 d). Centre lines cross on the long dashes, so adjust the spacing when you reach a crossing.`
    },
    {
      name: 'The next width in the series',
      expr: 'wn = w*sqrt(2)',
      tex: 'w_n = \\sqrt{2}\\,w',
      vars: {
        wn: { name: 'next line width', q: 'length', unit: 'mm', tex: 'w_n' },
        w: { name: 'line width', q: 'length', unit: 'mm', value: 0.25 }
      },
      note: `The preferred widths 0.13, 0.18, 0.25, 0.35, 0.5, 0.7, 1.0, 1.4, 2.0 mm each grow by about 1.41, so that a sheet reduced to the next smaller size (a factor of 1/√2) keeps its line widths in proportion.`
    }
  ],
  examples: [
    {
      title: 'Dashes for a 0.5 mm pencil',
      q: `The thick lines of a drawing are 0.5 mm. How long are the dashes and gaps of the hidden lines, and the pitch of the centre lines?`,
      steps: [
        `The thin lines are half of the thick ones: $d = 0.25$ mm.`,
        `Hidden dashes: $12 d = 3$ mm with gaps of $3 d = 0.75$ mm.`,
        `Chain lines: long dash $24 d = 6$ mm, so the pitch is $30.5 d = 7.6$ mm.`
      ],
      a: `Hidden dashes 3 mm long with 0.75 mm gaps; centre lines repeat every 7.6 mm.`
    },
    {
      title: 'Which line is drawn?',
      q: `In the front view of a block, a hidden edge falls exactly under the centre line of a hole. Which line do you draw?`,
      steps: [
        `The order of priority puts hidden edges above centre lines.`,
        `Draw the dashes; the centre line stops at the dashes and carries on beyond the outline.`
      ],
      a: `The hidden (dashed) line; the centre line is not drawn over it.`
    }
  ],
  quiz: [
    { q: `A hidden edge is drawn as`, choices: ['a thin dashed line', 'a thick continuous line', 'a chain line', 'a dotted line'], a: 0, why: `Hidden outlines and edges are line type 02.1, thin and dashed. (02.2, thick dashed, is allowed but not mixed with 02.1 on one drawing.)` },
    { q: `A centre line and the visible edge of a face fall at exactly the same place. Both are drawn.`, a: false, why: `Only the line of higher priority is drawn. A visible edge outranks a centre line.` },
    { q: `With a 0.35 mm thin line, a dash of a hidden line is about how many millimetres long?`, answer: 4.2, unit: 'mm', why: `12 d = 12 × 0.35 = 4.2 mm, with 3 d ≈ 1 mm between the dashes.` },
    { q: `The ratio of thick to thin line width in ISO 128 is`, choices: ['2 : 1', '1.5 : 1', '4 : 1', '1 : 1'], a: 0, why: `Thick lines are twice as wide as thin ones; the widths come in a series that grows by √2.` },
    { q: `Which of these is drawn with a thin continuous line?`, choices: ['a visible edge', 'hatching', 'a hidden edge', 'the end of a cutting-plane line'], a: 1, why: `Hatching, dimension and extension lines and leader lines are thin continuous (01.1). Visible edges are thick, hidden edges thin dashed, the ends of the cutting-plane line thick.` }
  ],
  applications: [
    `Every engineering drawing: the machinist reads the hidden detail and the symmetry from the line types without needing notes.`,
    `CAD layers and linetype libraries follow the same alphabet, called continuous, hidden, centre and phantom in the American names.`,
    `Architectural and electrical drawings reuse the idea: dashes for what lies above or below the plane of the cut.`,
    `Sheet-metal flat patterns mark bend lines as thin chain lines, so that cutting and folding instructions stay separate from the outline.`
  ],
  history: `Early engineering drawings were washed in colour; once the blueprint process of the nineteenth century copied only the lines, weight and pattern had to carry all the meaning, and national standards began to fix them, such as British Standard 308 (first issued in the 1920s). ISO 128 put the system on an international footing, with the types and widths now in parts 20 and 24, while the American equivalents are ASME Y14.2.`,
  sources: [
    `ISO 128-20:1996, Technical drawings — General principles of presentation — Part 20: Basic conventions for lines.`,
    `ISO 128-24:1999, Part 24: Lines on mechanical engineering drawings.`,
    `ASME Y14.2, Line Conventions and Lettering.`,
    `Thomas E. French, Charles J. Vierck and Robert J. Foster, *Engineering Drawing and Graphic Technology*, the chapter on lines.`
  ],
  construction: 'mv-line-types'
},

{
  id: 'dimensioning-basics',
  parent: 'multiview-drawing',
  title: 'Dimensioning a drawing',
  level: 2,
  short: `The views say what the part is; the dimensions say how big and where. Give each size once, on the view that shows it best, with thin extension and dimension lines outside the view, arrowheads, figures read from the bottom or right, and symbols (Ø, R, □) for the shape.`,
  keywords: ['dimensioning', 'extension line', 'dimension line', 'arrowhead', 'leader', 'diameter symbol', 'chain dimensioning', 'datum', 'ISO 129', 'tolerance', 'scale', 'redundant dimension'],
  prereq: ['line-conventions', 'six-principal-views'],
  related: ['section-views', 'engineering-drawings', 'first-angle-projection', 'the-third-view', 'third-angle-projection'],
  body: `Dimensions are numbers in the **true size** of the part, whatever scale the drawing is drawn in: a 250 mm shaft drawn at 1:2 occupies 125 mm of paper and is marked 250. The reader must never measure a drawing with a ruler; the figures are the contract between the designer and the machinist.

### The elements
- **Extension (projection) lines**: thin continuous, starting a hair (about 1 mm) from the feature and running about 2 mm past the dimension line. Outlines and centre lines may serve as extension lines.
- **Dimension line**: thin continuous, parallel to the length it measures, with a termination at each end: usually a narrow, closed, filled **arrowhead** about three times as long as wide; architects use oblique strokes.
- **Figure**: above the line, centred, about 3.5 mm high, read from the bottom or the right-hand side of the sheet (the *aligned* method) or always horizontal (the *unidirectional* one). No unit is written when the whole drawing is in millimetres.
- **Leader line**: a thin line at an angle, with an arrowhead on the feature (a dot inside a surface), carrying a note.
- **Symbols**: Ø diameter, R radius, □ square, SØ sphere, t thickness, and **4 ×** for identical features: "4 × Ø8" is four holes of diameter 8.

### Placing
Put each dimension on the view where the feature is seen as it really is (a hole as a circle, not as dashes). Keep dimension lines outside the view, the first about 10 mm from the outline and the next ones about 7 mm apart, **smaller dimensions nearer the view** so that no dimension line crosses an extension line. A dimension line is never a continuation of a centre line or an outline.

### Giving each size once
Every feature gets one dimension. A closed chain that dimensions every part *and* the overall length is **redundant**, since one of the numbers follows from the others and the two can disagree; leave one open, or put it in brackets as an *auxiliary* dimension. Give **functional** dimensions first, the ones the part's job depends on.

### Chain or datum?
In **chain** dimensioning each step is measured from the last, so the tolerances of the steps add up along the chain. In **parallel** (datum) dimensioning every size is measured from one datum edge, and each size keeps its own tolerance. Choose the datum for what the part must do; a datum edge that fits against another part is a good one.

> [!note] General tolerances for dimensions without their own are fixed in ISO 2768 and quoted in the title block; the precise ones are written after the figure. The rules on this page are those of ISO 129-1; ASME Y14.5 differs in details (for example in the spacing of dimension lines).`,
  ideas: [
    `Dimensions give true sizes in millimetres whatever the scale; never scale a drawing with a ruler.`,
    `A dimension is made of thin extension lines, a dimension line with arrowheads outside the view, and a figure above it, read from the bottom or right.`,
    `Each feature is dimensioned once, on the view that shows it best; smaller dimensions go nearer the view, and a closed chain is over-dimensioned.`,
    `Chain dimensioning adds tolerances along the chain; dimensioning from a datum keeps them separate.`
  ],
  pitfalls: [
    `I can scale an unclear dimension off the drawing — A drawing may be printed or copied at any size, and the figures are the only authority. Drawings carry the note "do not scale".`,
    `More dimensions are always safer — Redundant dimensions can contradict each other and force the reader to decide which to trust; complete means every size once, no more and no fewer.`,
    `Dimension to the hidden lines where it is convenient — Hidden lines are harder to read and to check; put the dimension on a view where the feature is visible, or on a section.`
  ],
  formulas: [
    {
      name: 'Size on the paper',
      expr: 'l = s*L',
      tex: 'l = s\\,L',
      vars: {
        l: { name: 'length on the paper', q: 'length', unit: 'mm' },
        s: { name: 'scale (paper : part)', value: 0.5 },
        L: { name: 'true length, as dimensioned', q: 'length', unit: 'mm', value: 250 }
      },
      note: `At 1:2 the scale is 0.5, at 2:1 it is 2. The figure on the drawing is always L, never l.`
    },
    {
      name: 'Tolerance of a chain of dimensions',
      expr: 'T = n*t',
      tex: 'T = n\\,t',
      vars: {
        T: { name: 'tolerance zone of the whole chain (worst case)', q: 'length', unit: 'mm' },
        n: { name: 'number of dimensions in the chain', value: 4, int: true, min: 1, max: 20 },
        t: { name: 'tolerance zone of each dimension', q: 'length', unit: 'mm', value: 0.15 }
      },
      note: `In the worst case the errors of a chain all go the same way and add. Measuring every dimension from a datum keeps the tolerance of each at t.`
    },
    {
      name: 'Distance of the nth dimension line from the outline',
      expr: 'y = 10 + 7*(n - 1)',
      tex: 'y = 10 + 7\\,(n - 1)',
      vars: {
        y: { name: 'distance of the dimension line from the outline', q: 'length', unit: 'mm' },
        n: { name: 'order of the dimension line, counting outwards from the view', value: 3, int: true, min: 1, max: 12 }
      },
      note: `A rule of thumb: the first line about 10 mm from the view, then about 7 mm for each further one. The smallest dimension stands nearest the view.`
    }
  ],
  examples: [
    {
      title: 'Chain or datum?',
      q: `Three steps of a stepped pin are each 20 ± 0.1 mm (a tolerance zone of 0.2 mm). What is the position tolerance of the end of the third step if the steps are dimensioned in a chain, and if they are dimensioned from the datum end?`,
      steps: [
        { text: `Chain: the three zones add in the worst case:`, tex: 'T = 3 \\times 0.2 = 0.6\\ \\text{mm (that is } \\pm 0.3\\text{)}' },
        `Datum: the dimensions are 20, 40 and 60, each measured from the datum end; the third keeps its own zone, ±0.1 (0.2 mm), if that is what is written.`,
        `The datum method gives the end its tolerance directly, at the cost of a tighter requirement on the longest dimension.`
      ],
      a: `A chain lets the end wander ±0.3 mm in the worst case; from a datum it is held to ±0.1 mm.`
    },
    {
      title: 'Not dimensioning the margin',
      q: `A plate 100 mm long has four holes whose centres are 76 mm apart along its length, symmetrical about the middle. Should the margin from the end to the first hole be dimensioned?`,
      steps: [
        { text: `It follows from the other two figures:`, tex: '(100 - 76)/2 = 12\\ \\text{mm}' },
        `Dimensioning it as well would be redundant: the three numbers could disagree.`
      ],
      a: `No: 12 mm follows from 100 and 76, so it is left out (or given in brackets as an auxiliary dimension).`
    }
  ],
  quiz: [
    { q: `A part is drawn at 1:5. The figure on a dimension gives`, choices: ['the true size of the part', 'the size on the paper', '1/5 of the true size', '5 times the size on the paper'], a: 0, why: `Dimensions always give the real size; the scale only says how large the drawing is.` },
    { q: `A dimension line may be drawn as a continuation of a centre line.`, a: false, why: `Dimension lines are separate thin continuous lines. Using a centre line or an outline as a dimension line would make them impossible to tell apart.` },
    { q: `A bar 100 mm long has a step at 40 mm. Which set of dimensions is redundant?`, choices: ['100 and 40', '100, 40 and 60, all given as ordinary dimensions', '40 and 60', '100 and 60'], a: 1, why: `The three numbers cannot all be independent: 40 + 60 = 100. One of them should be omitted or put in brackets.` },
    { q: `Four dimensions in a chain each have a tolerance zone of 0.15 mm. The zone of the whole chain, worst case, is how many millimetres?`, answer: 0.6, unit: 'mm', why: `In the worst case the four zones add: 4 × 0.15 = 0.6 mm.` },
    { q: `A hole of diameter 8 occurs four times. The note on the drawing is`, choices: ['4 × Ø8', 'Ø8 × 4 in the margin', '8 × 4', 'four holes'], a: 0, why: `The count comes first with the multiplication sign, then the diameter symbol and the value: 4 × Ø8, with one leader to one of the holes.` }
  ],
  applications: [
    `Manufacturing drawings: the toolmaker or CNC programmer takes each size and tolerance directly from the drawing, and the choice of datums fixes how the part is set up on the machine.`,
    `Inspection: coordinate-measuring programmes and gauge designs follow the datums and dimensions as their checking plan.`,
    `Tolerance stack-up analysis in assemblies: whether a part is dimensioned in a chain or from a datum decides how its errors add up.`,
    `Building plans: dimension chains with oblique strokes set out columns, openings and floors for the builders.`,
    `Electronics mechanics: printed-circuit board outlines and hole positions are dimensioned from a datum corner.`
  ],
  history: `Dimensioned drawings became the contract of manufacture with interchangeable parts in the nineteenth century, when each piece had to fit without filing: the dimensions and limits on the drawing replaced the craftsman's fitting. Rules for placing them were gathered in national standards and then in ISO 129 (first published in 1985, now ISO 129-1:2018), and in the United States in the standard that became ASME Y14.5, first issued in the 1960s.`,
  sources: [
    `ISO 129-1:2018, Technical product documentation — Indication of dimensions and tolerances — Part 1: General principles.`,
    `ASME Y14.5, Dimensioning and Tolerancing.`,
    `ISO 2768-1:1989, General tolerances — Tolerances for linear and angular dimensions without individual tolerance indications.`,
    `Frederick E. Giesecke and others, *Technical Drawing with Engineering Graphics*, the chapter on dimensioning.`
  ],
  construction: 'mv-dimensioning'
}
);
