/* HYPER-PROJECTIONS · content/descriptive-geometry.js — the topic "Descriptive geometry":
 * Monge's two planes, points and lines in the two views, true length by rotation, planes and their traces,
 * auxiliary views, developments, intersections of solids, shadows. Constructions in
 * constructions/descriptive-geometry.js (dg-…), simulations in sims/descriptive-geometry.js.
 * Convention throughout: a point is (x, d, h): x along the ground line xy, d its depth in front of the vertical
 * plane V, h its height above the horizontal plane H; elevation above xy, plan below. */
Hyper.add(
{
  id: 'monge-method',
  parent: 'descriptive-geometry',
  title: 'Monge\'s method: two planes',
  level: 2,
  short: 'Project the object perpendicularly onto two perpendicular planes, then fold them into one sheet: every point gets an elevation above the ground line and a plan below it, both on one perpendicular to it. Two views fix a point; three give a check.',
  keywords: ['Monge', 'descriptive geometry', 'elevation', 'plan', 'ground line', 'fold line', 'quadrant', 'first angle', 'rabatment', 'line of recall'],
  prereq: ['projectors-and-picture-plane', 'parallel-vs-central', 'math:coordinate-geometry'],
  related: ['point-and-line-in-monge', 'first-angle-projection', 'third-angle-projection', 'the-third-view', 'orthographic-projection', 'true-length-by-rotation'],
  body: `One view of an object throws its depth away: every point of a projector lands in the same place. The remedy of Gaspard Monge, the foundation of descriptive geometry, is to project the object perpendicularly onto **two** planes at right angles, and then fold the two into the single plane of the paper.

### The two planes
The **vertical plane V** receives the **elevation** (the front view); the **horizontal plane H** receives the **plan** (the top view). They meet in the **ground line** $xy$, also called the fold line. A point $A$ is given by three numbers: its distance $x$ along $xy$, its **height** $h$ above H and its **depth** $d$ in front of V. Its elevation $a'$ is in V at $(x, h)$; its plan $a$ is in H at $(x, d)$.

### Folding them open
Turn H down about $xy$ through a right angle until it lies in the plane of V. The front half of H goes downward, so on the sheet the plan lies **below** $xy$ at distance $d$ and the elevation **above** it at distance $h$, both on **one perpendicular to $xy$**, the line of recall (French *ligne de rappel*). The two projectors $Aa'$ and $Aa$ span a plane perpendicular to $xy$, and folding keeps them in it. As matrices, each view just drops a coordinate:
$$\\text{elevation}\\ \\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}\\begin{bmatrix} x \\\\ d \\\\ h \\end{bmatrix},\\qquad \\text{plan}\\ \\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & -1 & 0 \\end{bmatrix}\\begin{bmatrix} x \\\\ d \\\\ h \\end{bmatrix}.$$
The coordinate the two views share is $x$, and that is what ties them together: the two images of a point always have the same $x$.

### Reading a pair of points
Two points on one perpendicular to $xy$ are the views of exactly one point of space. Above $xy$ in the elevation means above H; below $xy$ in the plan means in front of V. The planes cut space into four quarters, the **quadrants**:

| Quadrant | Position | Elevation $a'$ | Plan $a$ |
|---|---|---|---|
| 1st | in front of V, above H | above $xy$ | below $xy$ |
| 2nd | behind V, above H | above $xy$ | above $xy$ |
| 3rd | behind V, below H | below $xy$ | above $xy$ |
| 4th | in front of V, below H | below $xy$ | below $xy$ |

Monge and the ISO first-angle method put the object in the first quadrant; American practice puts it in the third, so that the view planes lie between the viewer and the object ([[first-angle-projection]], [[third-angle-projection]]).

### What two views give
Two views fix every point and therefore the whole object. A third view (a side view) adds no new information, only a check ([[the-third-view]]). What two views do not hand over directly are true lengths and true shapes; for these see [[true-length-by-rotation]] and [[auxiliary-views]]. The distance between two points $A$ and $B$ comes from the three differences, $\\Delta x$ from either view, $\\Delta d$ from the plan and $\\Delta h$ from the elevation.

### How it is drawn
The construction starts from the end view, with V and H as two perpendicular lines, and shows why the plan lands below the elevation: the arc turns H down.`,
  ideas: [
    'Two perpendicular planes V and H, meeting in the ground line xy, receive the elevation and the plan of the object; folding H down about xy makes one sheet.',
    'The elevation is at height h above xy, the plan at depth d below it, and both are on one perpendicular to xy.',
    'The pair of points tells the quadrant: elevation above and plan below is the first quadrant (in front of V, above H).',
    'Two views fix a point; a third is a check. True lengths and shapes need further constructions.'
  ],
  pitfalls: [
    'The distance of a′ from xy is the distance of A from V — It is the height of A above H. The distance of the plan a from xy is the distance of A from V.',
    'The elevation and the plan can be put anywhere on the sheet — They must be on a common perpendicular to xy; the shared x is the link between them.',
    'The plan is a view from the side — It is a view from above: the horizontal plane H seen from straight above, then folded down about xy so it can be drawn on the same sheet.'
  ],
  formulas: [
    {
      name: 'Distance between two points from their views',
      expr: 'D = sqrt(dx^2 + dd^2 + dh^2)',
      tex: 'D = \\sqrt{\\Delta x^2 + \\Delta d^2 + \\Delta h^2}',
      vars: {
        D: { name: 'distance AB in space', q: 'length', unit: 'mm' },
        dx: { name: 'difference along xy (from either view)', q: 'length', unit: 'mm', value: 40, tex: '\\Delta x' },
        dd: { name: 'difference of depth (from the plan)', q: 'length', unit: 'mm', value: 70, tex: '\\Delta d' },
        dh: { name: 'difference of height (from the elevation)', q: 'length', unit: 'mm', value: 30, tex: '\\Delta h' }
      },
      solveFor: 'D',
      note: 'Neither view shows this length: each shows only two of the three differences. The true length is found by rotation or by the right triangle.'
    }
  ],
  examples: [
    {
      title: 'Reading two points',
      q: 'A has its elevation 50 above $xy$ and its plan 35 below; B has its elevation 20 above $xy$ and its plan 35 above, 40 to the right of A. Where are they, and how far apart?',
      steps: [
        'A: elevation above, plan below, so the first quadrant: height 50 above H, depth 35 in front of V. B: both above, so the second: height 20, depth 35 behind V.',
        { text: 'The differences are $\\Delta x = 40$, $\\Delta d = 35 - (-35) = 70$ and $\\Delta h = 50 - 20 = 30$:', tex: 'AB = \\sqrt{40^2 + 70^2 + 30^2} = \\sqrt{7400} = 86.0' }
      ],
      a: 'A in the first quadrant, B in the second; AB = 86.0.'
    },
    {
      title: 'A point in words',
      q: 'A point is 40 above the horizontal plane and 25 behind the vertical plane. Where are its elevation and its plan?',
      steps: [
        'The elevation is at the height: 40 above $xy$.',
        'Behind V means a negative depth, and the plan lies at distance 25 on the other side of $xy$ from the usual: 25 **above** $xy$.',
        'Both above $xy$: the second quadrant, as expected for a point above H and behind V.'
      ],
      a: 'Elevation 40 above xy, plan 25 above xy, on one perpendicular to xy.'
    }
  ],
  quiz: [
    { q: 'The elevation and the plan of a point both lie above xy. The point is in the', choices: ['1st quadrant', '2nd quadrant', '3rd quadrant', '4th quadrant'], a: 1, why: 'Elevation above xy means above H; plan above xy means behind V. Above H and behind V is the second quadrant.' },
    { q: 'The line joining the plan and the elevation of a point is', choices: ['parallel to xy', 'perpendicular to xy', 'at 45° to xy', 'any direction'], a: 1, why: 'The two projectors span a plane perpendicular to xy; folding H keeps them in it. This line is the line of recall.' },
    { q: 'The distance of the elevation a′ from xy tells the distance of A from V.', a: false, why: 'It tells the height of A above H. The distance from V is read from the plan.' },
    { q: 'Two points differ by 30 along xy, 40 in depth and 0 in height. How far apart are they, in the units of the drawing?', answer: 50, why: 'Distance = √(30² + 40² + 0²) = 50. The plan shows it true, because the line is horizontal.' }
  ],
  applications: [
    'Every multiview drawing is a Monge drawing: plan and elevation (and a side view) of a part, building or machine.',
    'Architecture: plans and elevations are the two views from which a building is read and built.',
    'CAD systems store points in three coordinates and generate the views with exactly the matrices above.',
    'Military engineering, where it began: finding whether a work is visible from the enemy\'s position (defilade) was Monge\'s first problem.'
  ],
  history: 'Gaspard Monge devised the method in the 1760s as a young draughtsman at the military school of Mézières, where it solved problems of fortification (above all defilade, hiding a work from enemy view) so quickly that it was kept a military secret. He taught it publicly in lectures at the École normale in 1795; the *Géométrie descriptive* was published in 1799 and the École polytechnique made it the foundation of engineering drawing in France and, through it, the world.',
  sources: ['Gaspard Monge, *Géométrie descriptive* (1799).', 'René Taton, *L\'œuvre scientifique de Monge* (1951).', 'Gary R. Bertoline et al., *Technical Graphics Communication*, the chapters on orthographic projection.', 'ISO 5456-2, Technical drawings — Projection methods — Part 2: Orthographic representations.'],
  sim: 'dg-monge-fold',
  construction: 'dg-monge-point'
},

{
  id: 'point-and-line-in-monge',
  parent: 'descriptive-geometry',
  title: 'Points and lines in the two views',
  level: 2,
  short: 'A line is two points, so its views are the joins of the views of two points. Lines parallel to a plane show true length in that plane\'s view; where a line pierces H and V are its traces; two lines meet only if their crossings lie on one perpendicular to xy.',
  keywords: ['line', 'trace', 'horizontal line', 'frontal line', 'profile line', 'inclination', 'skew lines', 'intersecting lines', 'quadrant', 'Monge'],
  prereq: ['monge-method', 'math:vectors'],
  related: ['true-length-by-rotation', 'planes-and-traces', 'intersections-of-solids', 'the-third-view', 'true-length-and-true-shape'],
  body: `A line is fixed by two of its points, so its views are the lines joining the views of two points: $a'b'$ in the elevation and $ab$ in the plan. Every point of the line has its elevation on $a'b'$ and its plan on $ab$, and the pair is on one perpendicular to $xy$. The two views of a line are therefore not independent: they are tied by that rule.

### Lines in special positions
Many lines in practice are parallel or perpendicular to a plane, and then the views are simple. The table shows what is seen:

| Line | Plan | Elevation | True length seen in |
|---|---|---|---|
| horizontal (parallel to H) | any direction | parallel to $xy$ | the plan |
| frontal (parallel to V) | parallel to $xy$ | any direction | the elevation |
| vertical (perpendicular to H) | a point | perpendicular to $xy$ | the elevation |
| perpendicular to V | perpendicular to $xy$ | a point | the plan |
| profile (in a plane perpendicular to $xy$) | perpendicular to $xy$ | perpendicular to $xy$ | neither (needs a side view) |
| general (oblique) | oblique to $xy$ | oblique to $xy$ | neither |

### The traces
A line pierces H at its **horizontal trace** $H_t$ and V at its **vertical trace** $V_t$. At $H_t$ the height is zero, so the elevation of $H_t$ is where $a'b'$ meets $xy$; drop a perpendicular to $ab$ for the plan. At $V_t$ the depth is zero, so the plan of $V_t$ is where $ab$ meets $xy$; raise a perpendicular to $a'b'$ for the elevation. A line passes from one quadrant to the next at a trace: through V into the second quadrant (behind V), through H into the fourth (below H).

### The angles of a line
Let $p$ be the plan length, $q$ the elevation length, $L$ the true length. The inclination of the line to H is $\\alpha$ with $\\tan\\alpha = \\Delta h / p$, to V is $\\beta$ with $\\sin\\beta = \\Delta d/L$, and to the profile plane is $\\gamma$ with $\\sin\\gamma = \\Delta x/L$. These are the direction cosines of the line with the three coordinate directions, so
$$\\sin^2\\alpha + \\sin^2\\beta + \\sin^2\\gamma = 1.$$
A line cannot be steep to H and steep to V at once: the sines of its inclinations to the three planes squared add up to 1.

### Two lines
Two lines **intersect** only if the point where their plans cross and the point where their elevations cross lie on one perpendicular to $xy$. If the crossing points are not so placed, the lines are **skew**: they pass one over the other. **Parallel** lines have parallel plans and parallel elevations.

### How it is drawn
The construction finds the traces of the line $AB$ with $A = (20, 10, 50)$ and $B = (80, 40, 20)$ by extending its two views.`,
  ideas: [
    'The views of a line are the joins of the views of two of its points; each point of the line has its pair on one perpendicular to xy.',
    'A line parallel to H shows its true length in the plan; one parallel to V shows it in the elevation; an oblique line shows it in neither.',
    'The traces are where the line pierces H (elevation on xy, plan found by a perpendicular) and V (plan on xy); the line changes quadrant at a trace.',
    'Two lines meet only if the crossings of their plans and of their elevations are on one perpendicular to xy; otherwise they are skew.'
  ],
  pitfalls: [
    'If the plans of two lines cross, the lines cross — Only if the crossing of the elevations is on the same perpendicular to xy. Otherwise one line passes over the other (skew lines).',
    'A line with a short plan is short — It may be steep. A vertical line has a plan that is a point and may be as long as you like.',
    'A line is in one quadrant — A line crosses from quadrant to quadrant at its traces; the segment AB is only the part between A and B.'
  ],
  formulas: [
    {
      name: 'Inclination of a line to H',
      expr: 'alpha = atan(dh/p)',
      tex: '\\alpha = \\arctan\\frac{\\Delta h}{p}',
      vars: {
        alpha: { name: 'inclination to the horizontal plane', q: 'angle', unit: '°' },
        dh: { name: 'difference of height of the ends', q: 'length', unit: 'mm', value: 30, tex: '\\Delta h' },
        p: { name: 'plan length', q: 'length', unit: 'mm', value: 67.1 }
      },
      solveFor: 'alpha',
      note: 'The angle at the plan end of the right triangle whose legs are the plan length and the height difference.'
    },
    {
      name: 'The three inclinations of a line',
      expr: 'sin(a)^2 + sin(b)^2 + sin(c)^2 = 1',
      tex: '\\sin^2\\alpha + \\sin^2\\beta + \\sin^2\\gamma = 1',
      vars: {
        a: { name: 'inclination to the horizontal plane H', q: 'angle', unit: '°', value: 24.1, min: 0, max: 90, tex: '\\alpha' },
        b: { name: 'inclination to the vertical plane V', q: 'angle', unit: '°', value: 24.1, min: 0, max: 90, tex: '\\beta' },
        c: { name: 'inclination to the profile plane', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\gamma' }
      },
      solveFor: 'c',
      note: 'The direction cosines of the line with the three axes: sin α = Δh/L, sin β = Δd/L, sin γ = Δx/L.'
    }
  ],
  examples: [
    {
      title: 'The traces of a line',
      q: 'Find the traces and the inclinations of the line through $A = (20, 10, 50)$ and $B = (80, 40, 20)$, in the form $(x, d, h)$.',
      steps: [
        'The direction is $(60, 30, -30)$, so the point at parameter $t$ is $(20 + 60t,\\ 10 + 30t,\\ 50 - 30t)$.',
        'Horizontal trace: height zero when $t = 5/3$, giving $H_t = (120,\\ 60,\\ 0)$. Vertical trace: depth zero when $t = -1/3$, giving $V_t = (0,\\ 0,\\ 60)$.',
        { text: 'The true length is $L = \\sqrt{60^2 + 30^2 + 30^2} = 73.5$, and the angles are', tex: '\\sin\\alpha = \\tfrac{30}{73.5},\\ \\sin\\beta = \\tfrac{30}{73.5},\\ \\sin\\gamma = \\tfrac{60}{73.5}\\ \\Rightarrow\\ \\alpha = \\beta = 24.1°,\\ \\gamma = 54.7°' },
        'Check: $0.167 + 0.167 + 0.667 = 1$.'
      ],
      a: 'H_t = (120, 60, 0), V_t = (0, 0, 60); L = 73.5; α = β = 24.1°, γ = 54.7°.'
    }
  ],
  quiz: [
    { q: 'A line whose plan is a single point is', choices: ['horizontal', 'frontal', 'vertical', 'a profile line'], a: 2, why: 'Looking straight down the line you see only a point: the line is perpendicular to H. Its elevation is perpendicular to xy and is the true length.' },
    { q: 'The elevation of a line is parallel to xy and its plan is oblique. The line is', choices: ['horizontal (parallel to H)', 'frontal (parallel to V)', 'vertical', 'a profile line'], a: 0, why: 'A constant height in the elevation means the line is parallel to H. Its plan then shows the true length.' },
    { q: 'The plans of two lines cross at a point, and so do their elevations, but the two crossing points are not on one perpendicular to xy. The lines are', choices: ['intersecting', 'parallel', 'skew', 'coincident'], a: 2, why: 'If they met, the point of meeting would have one pair of views on one perpendicular. They pass one over the other.' },
    { q: 'A line has Δx = 60, Δd = 30, Δh = 30. How many degrees is its inclination to the profile plane?', answer: 54.7, unit: '°', why: 'sin γ = Δx / L = 60 / 73.5 = 0.816, so γ = 54.7°.' }
  ],
  applications: [
    'Pipework and ductwork: a run of pipe is a line in space whose traces and inclinations determine where it meets walls and floors.',
    'Surveying and mining: a drift or a borehole is a line given by plan and section; its inclination and its intersections with strata are found with the same rules.',
    'Roof framing: the hip, valley and jack rafters of a roof are lines whose true lengths and angles are found from plan and rise.',
    'Collision and clearance checks in design: do two pipes or cables meet, or pass one over the other?'
  ],
  history: 'The treatment of the line, its traces and its inclinations as the first topic after the point was Monge\'s own order of exposition (1795); the notation of primed letters for the elevation and plain ones for the plan comes from the École polytechnique tradition. The three direction cosines of a line were a standard result of analytic geometry by the time of Monge\'s pupils.',
  sources: ['Gaspard Monge, *Géométrie descriptive* (1799).', 'Gary R. Bertoline et al., *Technical Graphics Communication*.', 'Frederick E. Giesecke et al., *Technical Drawing*, the chapters on points, lines and planes.'],
  sim: 'dg-monge-fold',
  construction: 'dg-monge-line'
},

{
  id: 'true-length-by-rotation',
  parent: 'descriptive-geometry',
  title: 'True length by rotation',
  level: 2,
  short: 'Neither view of an oblique line shows its length. Turn the line about a vertical through one end until it is parallel to V: heights do not change, the plan length does not change, and the new elevation is the true length. The right triangle gives the same without any turning.',
  keywords: ['true length', 'rotation', 'revolution', 'inclination', 'right triangle', 'hip rafter', 'Monge', 'plan', 'elevation'],
  prereq: ['point-and-line-in-monge', 'true-length-and-true-shape', 'math:right-triangle-trig'],
  related: ['auxiliary-views', 'developments', 'planes-and-traces', 'monge-method', 'sheet-metal-and-developments'],
  body: `A line shows its true length in a view in which it is parallel to the picture. An oblique line is parallel to neither H nor V, so neither view shows its length: both are shorter. Instead of making a new view ([[auxiliary-views]]) you can **move the line** until one of the existing views shows its true length.

### Rotation about a vertical
Take the line $AB$ and turn it about the **vertical through $A$**, an axis perpendicular to H.
- In the **plan** the axis is a point, and $B$ swings on a circle about it: the plan length $ab$ does not change. Turn until $ab_r$ is parallel to $xy$.
- In the **elevation** the axis is a vertical line. Rotation about it does not change a height, so $b'$ moves along the **horizontal** through it, to $b'_r$ directly above $b_r$.

Now the line is parallel to V, so its new elevation $a'b'_r$ is the **true length**. The angle it makes with the horizontal is the **inclination to H**.

### The right triangle
The result of the rotation is a right triangle in the elevation whose legs are the plan length $p$ (horizontal) and the difference of heights $\\Delta h$ (vertical). You can draw that triangle without rotating anything: on the plan, erect at $b$ a perpendicular to $ab$ of length $\\Delta h$ and join its end to $a$. The hypotenuse is the true length,
$$L = \\sqrt{p^2 + \\Delta h^2},\\qquad \\tan\\alpha = \\frac{\\Delta h}{p}.$$
The inclination to V is found the same way from the elevation, with the depth difference as the second leg.

### The general rule
The rule of all rotations in Monge's method: choose the axis **perpendicular to one plane**. In that plane's view the axis is a point and the figure turns without changing shape, a true circle; in the other view the axis is a line and every point slides along a parallel to $xy$. That is why rotations are quick to draw with compass and T-square. The same idea turns a plane flat (**rabatment**, folding down about one of its lines) and brings a solid to a convenient position before it is drawn.

### How it is drawn
The construction rotates the line $AB$ with $A = (20, 15, 55)$ and $B = (95, 55, 25)$ and then checks the result with the right triangle: the two true lengths agree.`,
  ideas: [
    'To find a true length, turn the line about an axis perpendicular to one plane until it is parallel to the other.',
    'About a vertical axis the plan length is unchanged and the heights are unchanged; the elevation slides on a horizontal to the true length.',
    'The right triangle with legs the plan length and the height difference gives the same length and the inclination without any rotation.',
    'In all of Monge\'s rotations the axis is perpendicular to one plane: there the motion is a true circle, in the other view a movement parallel to xy.'
  ],
  pitfalls: [
    'The longer view shows the true length — Neither does, unless the line is parallel to that plane. Both are shortened, by cos α and cos β.',
    'Rotation changes the line — It is the same segment turned into a convenient position. Its length and its inclination to H do not change when it is turned about a vertical.',
    'The right triangle needs a second drawing — It needs only the plan length and the height difference, one taken from each view.'
  ],
  formulas: [
    {
      name: 'True length from plan length and height difference',
      expr: 'L = sqrt(p^2 + dh^2)',
      tex: 'L = \\sqrt{p^2 + \\Delta h^2}',
      vars: {
        L: { name: 'true length', q: 'length', unit: 'mm' },
        p: { name: 'plan length', q: 'length', unit: 'mm', value: 85 },
        dh: { name: 'difference of heights', q: 'length', unit: 'mm', value: 30, tex: '\\Delta h' }
      },
      solveFor: 'L',
      note: 'The hypotenuse of the right triangle on the plan length.'
    },
    {
      name: 'Inclination to the horizontal plane',
      expr: 'alpha = atan(dh/p)',
      tex: '\\alpha = \\arctan\\frac{\\Delta h}{p}',
      vars: { alpha: { name: 'inclination of the line to H', q: 'angle', unit: '°' }, dh: { name: 'difference of heights', q: 'length', unit: 'mm', value: 30, tex: '\\Delta h' }, p: { name: 'plan length', q: 'length', unit: 'mm', value: 85 } },
      solveFor: 'alpha',
      note: 'The angle between the line and the horizontal, read in the rotated elevation or at the end of the plan triangle.'
    },
    {
      name: 'Inclination to the vertical plane',
      expr: 'sin(beta) = dd/L',
      tex: '\\sin\\beta = \\frac{\\Delta d}{L}',
      vars: { beta: { name: 'inclination of the line to V', q: 'angle', unit: '°', min: 0, max: 90 }, dd: { name: 'difference of depths', q: 'length', unit: 'mm', value: 40, tex: '\\Delta d' }, L: { name: 'true length', q: 'length', unit: 'mm', value: 90.1 } },
      solveFor: 'beta',
      note: 'Rotating about an axis perpendicular to V instead gives this angle and the same true length.'
    }
  ],
  examples: [
    {
      title: 'The line of the construction',
      q: 'A line has A = (20, 15, 55) and B = (95, 55, 25) in the form (x, d, h). Find its true length and its inclinations to H and to V.',
      steps: [
        { text: 'The differences are $\\Delta x = 75$, $\\Delta d = 40$, $\\Delta h = 30$. The plan length is', tex: 'p = \\sqrt{75^2 + 40^2} = 85.0' },
        { text: 'The right triangle on the plan:', tex: 'L = \\sqrt{85.0^2 + 30^2} = \\sqrt{8125} = 90.1,\\qquad \\alpha = \\arctan\\frac{30}{85.0} = 19.4°' },
        { text: 'The depth difference gives the inclination to V:', tex: '\\beta = \\arcsin\\frac{40}{90.1} = 26.3°' }
      ],
      a: 'L = 90.1; α = 19.4° to H; β = 26.3° to V.'
    },
    {
      title: 'A hip rafter',
      q: 'The common rafters of a hipped roof run 3.0 m horizontally from the wall to the ridge and the roof is pitched at 30°. The hip rafter runs diagonally from a corner of the walls. How long is it, and at what angle does it rise?',
      steps: [
        { text: 'The common rafter rises $3.0 \\tan 30° = 1.73$ m. The hip runs along the diagonal of the square corner, so its plan is $3.0\\sqrt 2 = 4.24$ m long and it rises the same 1.73 m. True length:', tex: 'L = \\sqrt{4.24^2 + 1.73^2} = \\sqrt{21.0} = 4.58\\ \\text{m}' },
        { text: 'Its pitch:', tex: '\\alpha = \\arctan\\frac{1.73}{4.24} = 22.2°' },
        'The common rafter, for comparison, is $\\sqrt{3.0^2 + 1.73^2} = 3.46$ m: the hip is flatter and longer.'
      ],
      a: 'Hip rafter 4.58 m, rising at 22.2° (the common rafter is 3.46 m at 30°).'
    }
  ],
  quiz: [
    { q: 'Rotating a line about a vertical axis through one end, which quantity does NOT change?', choices: ['The plan length and the heights of the ends', 'The elevation length', 'The plan direction', 'The depths of the ends'], a: 0, why: 'About a vertical axis the plan is a circular motion (length unchanged) and heights stay as they are. The elevation length and the plan direction change.' },
    { q: 'The plan of a sloping line is 6 long and the ends differ in height by 8. Its true length is', answer: 10, why: '√(6² + 8²) = 10.' },
    { q: 'After rotating a line about a vertical axis until its plan is parallel to xy, the angle its elevation makes with xy is its inclination to V.', a: false, why: 'It is the inclination to H. The inclination to V needs a rotation about an axis perpendicular to V.' },
    { q: 'A line has plan length 85 and height difference 30. Its inclination to H, in degrees, is about', answer: 19.4, unit: '°', why: 'α = arctan(30/85) = 19.4°.' }
  ],
  applications: [
    'Carpentry: the true length and the cutting angles of hip, valley and jack rafters from the plan and the pitch.',
    'Sheet metal and pipework: the true lengths of the edges of a transition or a cone before the pattern is drawn ([[developments]]).',
    'Structural steel: the true lengths of braces in a space frame from plan and elevation.',
    'Surveying: reducing a slope distance to a horizontal one, or the reverse, is the right triangle.'
  ],
  history: 'Rotation (Monge\'s *révolution*) and the change of plane were the two methods he offered for finding true quantities, and rotation was favoured by hand because it needs only the compass and the T-square. The stonecutters\' manuals of the French baroque, such as Frézier\'s (1737–39), already turned lines and faces flat in the same way; Monge systematised what the masons did.',
  sources: ['Gaspard Monge, *Géométrie descriptive* (1799).', 'Amédée-François Frézier, *La théorie et la pratique de la coupe des pierres* (1737–39).', 'Frederick E. Giesecke et al., *Technical Drawing*, the chapters on revolution.'],
  sim: 'dg-true-length-rotation',
  construction: 'dg-true-length'
},

{
  id: 'planes-and-traces',
  parent: 'descriptive-geometry',
  title: 'Planes and their traces',
  level: 2,
  short: 'A plane is given by three points, a line and a point, or two lines; or by its traces, the lines in which it meets H and V, which always meet on xy. Contour lines parallel to the horizontal trace give its slope.',
  keywords: ['plane', 'trace', 'horizontal trace', 'vertical trace', 'contour', 'steepest slope', 'inclination', 'intercepts', 'dip', 'Monge'],
  prereq: ['point-and-line-in-monge', 'math:vectors', 'math:cross-product'],
  related: ['auxiliary-views', 'intersections-of-solids', 'true-length-by-rotation', 'true-length-and-true-shape'],
  body: `A plane in space is fixed by three points not in a line, by a line and a point outside it, or by two intersecting or parallel lines. In Monge's method the favourite description is by its **traces**: the **horizontal trace** $H_t$, the line in which it meets H, and the **vertical trace** $V_t$, the line in which it meets V. The two traces meet at one point of $xy$ (where the plane cuts $xy$), or are both parallel to it. Given the two traces the plane is known, and the plan and elevation of any figure in it can be read.

### Intercepts
A plane that cuts the axes at distances $a$ along $xy$, $b$ in depth and $c$ in height has the equation
$$\\frac{x}{a} + \\frac{d}{b} + \\frac{h}{c} = 1.$$
Its horizontal trace joins $(a, 0, 0)$ to $(0, b, 0)$ and its vertical trace joins $(a, 0, 0)$ to $(0, 0, c)$, which is why they meet on $xy$ at $x = a$.

### Traces from three points
Take two lines of the plane, say $AB$ and $AC$, find the traces of each (see [[point-and-line-in-monge]]) and join the two horizontal traces $h_1 h_2$ and the two vertical traces $v'_1 v'_2$. The plane's traces must meet on $xy$: a free check on the drawing.

### Lines of the plane and the slope
A **horizontal line** of the plane is parallel to its horizontal trace in the plan and parallel to $xy$ in the elevation; these are the contour lines of the plane, at constant heights. A **line of steepest slope** is perpendicular to them in the plan, and the angle it makes with H is the plane's **inclination** $\\theta$. With contours spaced $s$ apart (measured at right angles to them) for a height step $\\Delta h$,
$$\\tan\\theta = \\frac{\\Delta h}{s},$$
the formula of the geologist's dip and of the road engineer's gradient. From the intercepts, with $\\cos\\theta_H = \\dfrac{1/c}{\\sqrt{1/a^2 + 1/b^2 + 1/c^2}}$, the normal being proportional to $(1/a, 1/b, 1/c)$.

### Special planes
A plane **parallel to H** has only a vertical trace, parallel to $xy$, and shows true shape in the plan. A **vertical plane** is edge-on in the plan: its plan is its horizontal trace. A plane **perpendicular to V** is edge-on in the elevation; a plane **parallel to V** shows true shape in the elevation. A **profile plane** (perpendicular to $xy$) has both traces perpendicular to $xy$.

### Two planes
Two planes meet in a line. It passes through the point where their horizontal traces meet and the point where their vertical traces meet: join them (see [[intersections-of-solids]]).

### How it is drawn
The construction finds the traces of the plane through three points and checks that they meet on $xy$.`,
  ideas: [
    'A plane is fixed by three points, a line and a point, two lines, or its two traces; the traces meet on xy (or are both parallel to it).',
    'The traces of a plane through three points come from the traces of two of its lines.',
    'Horizontal lines of the plane are parallel to the horizontal trace (contour lines); the lines of steepest slope are perpendicular to them in the plan.',
    'The inclination θ to H follows from tan θ = height step / contour spacing, or from the intercepts.'
  ],
  pitfalls: [
    'The traces of a plane are its edges — They are the lines in which the plane meets H and V; the plane goes on beyond them, and the part between the traces (in the first quadrant) is just one region.',
    'The inclination of the plane is the angle of its horizontal trace with xy — That angle is something else (the trace angle). The inclination to H is measured perpendicular to the horizontal trace.',
    'Any two lines in the plan and elevation are the traces of a plane — They must meet on xy, or be parallel to it.'
  ],
  formulas: [
    {
      name: 'Inclination of a plane from its intercepts',
      expr: 'cos(theta) = (1/c)/sqrt(1/a^2 + 1/b^2 + 1/c^2)',
      tex: '\\cos\\theta = \\frac{1/c}{\\sqrt{1/a^2 + 1/b^2 + 1/c^2}}',
      vars: {
        theta: { name: 'inclination of the plane to H', q: 'angle', unit: '°', min: 0, max: 90 },
        a: { name: 'intercept on xy', q: 'length', unit: 'mm', value: 60 },
        b: { name: 'intercept in depth', q: 'length', unit: 'mm', value: 40 },
        c: { name: 'intercept in height', q: 'length', unit: 'mm', value: 30 }
      },
      solveFor: 'theta',
      note: 'The normal of the plane is proportional to (1/a, 1/b, 1/c); θ is its angle with the vertical.'
    },
    {
      name: 'Inclination from the contour lines',
      expr: 'theta = atan(dh/s)',
      tex: '\\theta = \\arctan\\frac{\\Delta h}{s}',
      vars: {
        theta: { name: 'inclination of the plane to H', q: 'angle', unit: '°' },
        dh: { name: 'height step between two contours', q: 'length', unit: 'm', value: 5, tex: '\\Delta h' },
        s: { name: 'horizontal spacing of the contours, measured at right angles to them', q: 'length', unit: 'm', value: 12 }
      },
      solveFor: 'theta',
      note: 'The same relation as a gradient: rise over run along the line of steepest slope.'
    }
  ],
  examples: [
    {
      title: 'A plane from its intercepts',
      q: 'A plane cuts xy at 60, the depth axis at 40 and the height axis at 30. Draw its traces, and find its inclination to H and to V.',
      steps: [
        'On the sheet, the horizontal trace (in the plan) joins the point 60 on $xy$ to the point 40 below $xy$ on the depth axis; the vertical trace (in the elevation) joins the same point of $xy$ to the point 30 above $xy$ on the height axis.',
        { text: 'The normal is proportional to $(1/60,\\ 1/40,\\ 1/30)$, of length $0.0449$:', tex: '\\cos\\theta_H = \\frac{0.0333}{0.0449} = 0.743\\ \\Rightarrow\\ \\theta_H = 42.0°,\\qquad \\cos\\theta_V = \\frac{0.0250}{0.0449} = 0.557\\ \\Rightarrow\\ \\theta_V = 56.2°' },
        'Check with the contours: the horizontal trace is $1/0.0300 = 33.3$ from the origin, so the plane rises 30 over a horizontal run of 33.3: $\\arctan(30/33.3) = 42.0°$.'
      ],
      a: 'θ to H = 42.0°, θ to V = 56.2°; the traces meet on xy at 60.'
    },
    {
      title: 'The dip of a slope',
      q: 'On a plan, contour lines at 5 m intervals of height are 12 m apart. What is the slope of the ground, supposed plane?',
      steps: [
        { text: 'Rise over run:', tex: '\\tan\\theta = \\frac{5}{12}\\ \\Rightarrow\\ \\theta = 22.6°' },
        'That is a gradient of 42 %, steep for a road and gentle for a mountain.'
      ],
      a: '22.6°, a gradient of 42 %.'
    }
  ],
  quiz: [
    { q: 'The horizontal and vertical traces of a plane always meet', choices: ['on xy', 'at the origin', 'at 90°', 'nowhere'], a: 0, why: 'Both traces contain the point where the plane cuts the line xy (or are both parallel to xy). That point is on both H and V.' },
    { q: 'A plane parallel to H has', choices: ['two traces', 'only a vertical trace, parallel to xy', 'only a horizontal trace', 'no traces'], a: 1, why: 'It never meets H, so it has no horizontal trace; it meets V in a line parallel to xy.' },
    { q: 'Contours at 2 m height steps are 8 m apart in plan. The slope is how many degrees?', answer: 14, unit: '°', why: 'θ = arctan(2/8) = 14.0°.' },
    { q: 'The contour lines of a plane (its horizontal lines) are parallel to its horizontal trace.', a: true, why: 'A horizontal line of the plane is a line of constant height, parallel to the intersection of the plane with H, which is the horizontal trace.' }
  ],
  applications: [
    'Geology: the strike (direction of a contour) and the dip (the slope angle) of a rock layer are exactly the horizontal trace direction and the inclination of a plane.',
    'Surveying and civil engineering: planes fitted to terrain by contour lines for roads, roofs and drainage.',
    'Roof geometry: the planes of a hipped roof are given by their traces on the wall plane; their intersections are the hips and valleys.',
    'Computer graphics: a plane is a normal and a point; the traces are the lines where it cuts the coordinate planes.'
  ],
  history: 'Planes given by their traces were Monge\'s main way to describe a plane; the strike-and-dip notation of geology (William Smith\'s geological map of 1815, and the field practice of the nineteenth century) uses the same two elements, direction of a horizontal line and angle of steepest slope.',
  sources: ['Gaspard Monge, *Géométrie descriptive* (1799).', 'Frederick E. Giesecke et al., *Technical Drawing*, the chapter on planes.', 'Haakon Fossen, *Structural Geology* (2nd ed., 2016): strike and dip.'],
  sim: 'dg-plane-and-traces',
  construction: 'dg-plane-traces'
},

{
  id: 'auxiliary-views',
  parent: 'descriptive-geometry',
  title: 'Auxiliary views',
  level: 2,
  short: 'When a face is inclined to both planes, add a new plane parallel to it and a new fold line. The new view is projected from an old one by perpendiculars to the new fold line, and the distances from the new fold line are taken from the other old view.',
  keywords: ['auxiliary view', 'new fold line', 'true shape', 'edge view', 'inclined face', 'change of plane', 'Monge', 'second auxiliary'],
  prereq: ['true-length-by-rotation', 'planes-and-traces', 'true-length-and-true-shape'],
  related: ['developments', 'intersections-of-solids', 'section-views', 'the-third-view'],
  body: `A face that is inclined to both H and V appears in neither the plan nor the elevation in true shape. The remedy is to add a **new plane of projection**, one chosen so that the face is parallel to it. It must be perpendicular to one of the old planes, so that the pair still forms an orthogonal system, and it brings its own fold line.

### The rule of the new fold line
Suppose the face is perpendicular to V, so that it is seen **edge-on** in the elevation. Choose the new plane perpendicular to V and parallel to the face. Its fold line $x_1y_1$ is drawn parallel to the edge-on face, at any convenient distance from it. Then:
1. From each point of the face in the elevation draw a **perpendicular to $x_1y_1$** (the new projectors).
2. On each projector lay off from $x_1y_1$ the **distance from $xy$ that the same point has in the plan**.

Why: distances from V are shared by every plane perpendicular to V. In the plan that distance is measured from $xy$; in the new view it is measured from $x_1y_1$. This is the one rule of all auxiliary views: *the distance from the new fold line is the distance from the old fold line in the other view.* In coordinates, if the new fold line makes the angle $\\varphi$ with $xy$ in the elevation, a point $(x, d, z)$ has new coordinates
$$u = x\\cos\\varphi + z\\sin\\varphi\\quad(\\text{along } x_1y_1),\\qquad w = -x\\sin\\varphi + z\\cos\\varphi\\quad(\\text{from } x_1y_1),$$
and the depth $d$ is unchanged.

### Edge views and true shapes
- A face seen **edge-on** in one view is turned into **true shape** by an auxiliary view with its fold line parallel to the edge: one step.
- A face inclined to both planes needs **two** auxiliary views. First look along a horizontal line of the face (one seen true length in the plan) to get an edge view; then take a second auxiliary parallel to that edge for the true shape.
- A **line** gives a point view when seen along its true length.

How much the new view shows is a simple function of the angle between the fold line and the face: the dimension along the slope is multiplied by $\\cos(\\beta - \\alpha)$, where $\\alpha$ is the face's slope and $\\beta$ the fold line's, and the dimension across the slope is unchanged. At $\\beta = \\alpha$ you see the true shape; at 90° more, the edge.

### How it is drawn
The construction takes a hexagonal prism cut by an inclined plane and draws the true shape of the cut face, using a new fold line at the face's slope.`,
  ideas: [
    'A new plane of projection, parallel to the face and perpendicular to an old plane, gives the face in true shape; its fold line is parallel to the edge-on face.',
    'From each point draw a perpendicular to the new fold line; on it lay off the distance the point has from the old fold line in the other view.',
    'An oblique face needs two auxiliary views: an edge view first, then a true shape.',
    'The foreshortening along the slope is cos(β − α) for a fold line turned through β from a face at slope α; across the slope nothing changes.'
  ],
  pitfalls: [
    'The distances are taken from the same view that the projectors come from — They are taken from the other view: projectors from the elevation, distances from the plan (and the reverse).',
    'The new fold line has to be at a particular distance — Any distance will do; the distance only moves the new view about the sheet.',
    'An auxiliary view shows the object from a new side — It shows the whole object projected onto the new plane, not only the face; the other parts of the object appear foreshortened too.'
  ],
  formulas: [
    {
      name: 'Coordinate along the new fold line',
      expr: 'u = x*cos(phi) + z*sin(phi)',
      tex: 'u = x\\cos\\varphi + z\\sin\\varphi',
      vars: {
        u: { name: 'coordinate along the new fold line', q: 'length', unit: 'mm' },
        x: { name: 'x in the elevation (along xy)', q: 'length', unit: 'mm', value: 100 },
        z: { name: 'height in the elevation', q: 'length', unit: 'mm', value: 60 },
        phi: { name: 'angle of the new fold line to xy', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\varphi' }
      },
      solveFor: 'u',
      note: 'The new view is the old one turned through φ in the elevation plane; the depth d is carried over unchanged.'
    },
    {
      name: 'Foreshortening along the slope of a face',
      expr: 'k = cos(beta - alpha)',
      tex: 'k = \\cos(\\beta - \\alpha)',
      vars: {
        k: { name: 'length along the slope in the view / true length' },
        beta: { name: 'angle of the new fold line to xy', q: 'angle', unit: '°', value: 0, signed: true, min: -90, max: 90, tex: '\\beta' },
        alpha: { name: 'slope of the face', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\alpha' }
      },
      solveFor: 'k',
      note: 'β = 0 gives the plan (cos α); β = α the true shape (1); β = α + 90° the edge view (0).'
    }
  ],
  examples: [
    {
      title: 'The cut face of a hexagonal prism',
      q: 'A regular hexagonal prism of circumradius 36 stands on H and is cut by a plane perpendicular to V that rises at 30°. In the plan the cut face is the hexagon itself, 72 wide along $xy$. What is the length of the face along the slope, and what does the plan show of it?',
      steps: [
        'In the elevation the face is a line at 30° from the lowest to the highest point of the hexagon, which are 72 apart along $xy$.',
        { text: 'Its true length along the slope:', tex: '\\frac{72}{\\cos 30°} = 83.1' },
        'The plan shows the face compressed along the slope to 72, which is $\\cos 30° = 0.866$ of the true length; the width across the slope ($36\\sqrt 3 = 62.4$) is the same in all views.'
      ],
      a: '83.1 along the slope; the plan shows only 87 % of it.'
    }
  ],
  quiz: [
    { q: 'In an auxiliary view projected from the elevation, the distances laid off from the new fold line are taken from', choices: ['the elevation', 'the plan, measured from xy', 'the side view', 'anywhere'], a: 1, why: 'The new plane is perpendicular to V, like H, so distances from V are common to the plan and the new view. In the plan they are measured from xy.' },
    { q: 'To see an inclined plane face in true shape, the new fold line must be', choices: ['perpendicular to the edge-on face', 'parallel to the edge-on face', 'parallel to xy', 'at 45° to xy'], a: 1, why: 'The new plane must be parallel to the face, so its fold line (which is its trace on V) is parallel to the edge-on face in the elevation.' },
    { q: 'A face at 30° to the horizontal is viewed with the new fold line at 0° (the plan). The length along the slope is shortened by the factor', answer: 0.866, why: 'cos(β − α) = cos(0 − 30°) = 0.866.' },
    { q: 'A face inclined to both H and V needs one auxiliary view for its true shape.', a: false, why: 'It needs two: the first gives an edge view (looking along a true-length line of the face), the second, parallel to the edge, the true shape.' }
  ],
  applications: [
    'Drafting a part with inclined faces: slanted flanges, chamfers and gussets are dimensioned in the auxiliary view where they are true.',
    'Sheet metal and ductwork: the true shape of an inclined cut is needed to lay out the pattern ([[developments]]).',
    'CAD: "view normal to face" is an auxiliary view made automatically.',
    'Structural steel and piping: true angles between inclined members are measured in the view where both are seen true length.'
  ],
  history: 'Monge called the method *changement de plans de projection*; it was refined by his pupils at the École polytechnique and became the standard way to solve problems with an inclined face. The name "auxiliary view" and the drafting-room rules of "projectors perpendicular to the new fold line" were fixed in the American textbooks of the late nineteenth century.',
  sources: ['Gaspard Monge, *Géométrie descriptive* (1799).', 'Frederick E. Giesecke et al., *Technical Drawing*, the chapters on auxiliary views.', 'Gary R. Bertoline et al., *Technical Graphics Communication*.'],
  sim: 'dg-auxiliary-turn',
  construction: 'dg-auxiliary-view'
},

{
  id: 'developments',
  parent: 'descriptive-geometry',
  title: 'Developments: unfolding a surface',
  level: 2,
  short: 'A development is a surface laid flat without stretching. Prisms and cylinders unroll into strips, pyramids and cones into fans and sectors, and a cone of radius r and slant L becomes a sector of angle 360° r / L. The sphere cannot be developed.',
  keywords: ['development', 'unfolding', 'pattern', 'net', 'cone', 'pyramid', 'cylinder', 'sector', 'sheet metal', 'developable surface'],
  prereq: ['true-length-by-rotation', 'math:surface-area', 'math:solid-geometry'],
  related: ['sheet-metal-and-developments', 'developable-surfaces', 'intersections-of-solids', 'polyhedral-maps', 'why-the-sphere-cannot-be-flattened'],
  body: `A **development** is the flat pattern of a surface: cut the surface along some lines, lay it flat without stretching or tearing, and the outline is the pattern from which the surface can be made again. The sheet-metal worker, the packaging designer and the paper-folder all work from developments. A surface can be laid flat in this way only if it is **developable**: planes, prisms, cylinders, cones and pyramids are; the sphere, the torus and the saddle are not.

### The methods
- **Parallel-line method** (prisms, cylinders): the lateral surface is a rectangle, with one side the height and the other the perimeter of the base. For a cylinder of diameter $D$ the strip is $\\pi D$ wide.
- **Radial-line method** (pyramids, cones): all the lateral edges meet at the apex, so the pattern is a **fan** of triangles about the apex. A right cone of base radius $r$ and slant length $L$ develops into a **sector of radius $L$ and angle**
$$\\varphi = 2\\pi\\,\\frac{r}{L} = 360°\\,\\frac{r}{L},\\qquad L = \\sqrt{r^2 + h^2}.$$
The arc of the sector is as long as the base circle, $L\\varphi = 2\\pi r$.
- **Triangulation** (oblique and irregular surfaces): divide the surface into triangles, find the true length of each side by rotation, and lay the triangles side by side in order.

### The true lengths are the heart of it
Every development rests on true lengths: the slant edge of a pyramid, the generator of a cone, the sides of the triangles. They come from the views by rotation or from an edge that is parallel to one plane (in the construction, the outline edge of the elevation). Without them a pattern would be wrong.

### The frustum
A frustum of a cone develops into an **annular sector**: the sector of the complete cone with the small cone's sector cut away from the apex. Its two radii are the slant lengths of the complete large and small cones, and both arcs subtend the same angle $\\varphi$.

### Allowances and bends
A real pattern adds margins for seams and laps and shows the bend lines, which are the creases of a polyhedron. A cone or cylinder has no crease; the pattern is rolled.

### The sphere
No part of a sphere can be laid flat. A globe is made of **gores** (lens-shaped strips) that fit only approximately, and that is exactly the problem of map projections ([[why-the-sphere-cannot-be-flattened]]).

### How it is drawn
Two constructions: a square pyramid, whose pattern is four triangles found from the true length of the slant edge, and a cone, whose pattern is a sector found with the compass and the protractor.`,
  ideas: [
    'A developable surface can be laid flat without stretching: planes, prisms, cylinders, cones, pyramids; not the sphere.',
    'Prisms and cylinders unroll into strips (width π D for a cylinder); pyramids and cones into fans or sectors about the apex.',
    'A cone of base radius r and slant length L becomes a sector of radius L and angle 360° r / L.',
    'Every development needs the true lengths of the edges or generators, found by rotation or from an edge parallel to a plane.'
  ],
  pitfalls: [
    'The sector of a cone has the base circle\'s radius — Its radius is the slant length L; the base radius appears in the angle 360° r / L and in the attached base circle.',
    'Any surface can be developed — Only surfaces that bend without stretching. A sphere, a bowl or a saddle cannot be flattened without tearing or stretching.',
    'Stepping the chord of the base along the arc gives the exact pattern — It makes the sector slightly too small, because a chord is shorter than its arc; lay off the exact angle instead.'
  ],
  formulas: [
    {
      name: 'Slant length of a cone',
      expr: 'L = sqrt(r^2 + h^2)',
      tex: 'L = \\sqrt{r^2 + h^2}',
      vars: { L: { name: 'slant length (generator)', q: 'length', unit: 'mm' }, r: { name: 'radius of the base', q: 'length', unit: 'mm', value: 50 }, h: { name: 'height', q: 'length', unit: 'mm', value: 120 } },
      solveFor: 'L',
      note: 'The radius of the development of the lateral surface.'
    },
    {
      name: 'Angle of the sector of a cone',
      expr: 'phi = 2*pi*r/L',
      tex: '\\varphi = 2\\pi\\,\\frac{r}{L}',
      vars: { phi: { name: 'angle of the sector', q: 'angle', unit: '°', min: 0, max: 360, tex: '\\varphi' }, r: { name: 'radius of the base', q: 'length', unit: 'mm', value: 50 }, L: { name: 'slant length', q: 'length', unit: 'mm', value: 130 } },
      solveFor: 'phi',
      note: 'The arc of the sector is the base circumference: L φ = 2π r. A tall thin cone gives a narrow sector; a flat cone approaches a full disc.'
    },
    {
      name: 'Width of the development of a cylinder',
      expr: 'W = pi*D',
      tex: 'W = \\pi D',
      vars: { W: { name: 'width of the strip', q: 'length', unit: 'mm' }, D: { name: 'diameter of the cylinder', q: 'length', unit: 'mm', value: 100 } },
      solveFor: 'W',
      note: 'The strip is as high as the cylinder and as wide as its circumference.'
    },
    {
      name: 'Lateral area of a cone',
      expr: 'A = pi*r*L',
      tex: 'A = \\pi r L',
      vars: { A: { name: 'lateral area', q: 'area', unit: 'mm²' }, r: { name: 'radius of the base', q: 'length', unit: 'mm', value: 50 }, L: { name: 'slant length', q: 'length', unit: 'mm', value: 130 } },
      solveFor: 'A',
      note: 'The area of the sector, ½ L² φ = ½ L (2π r).'
    }
  ],
  examples: [
    {
      title: 'A cone',
      q: 'A cone has a base radius of 50 mm and a height of 120 mm. Describe its development.',
      steps: [
        { text: 'Slant length:', tex: 'L = \\sqrt{50^2 + 120^2} = 130\\ \\text{mm}' },
        { text: 'Sector angle:', tex: '\\varphi = 360°\\times\\frac{50}{130} = 138.5°' },
        { text: 'Lateral area, which is the area of the sector:', tex: 'A = \\pi \\times 50 \\times 130 = 20\\,420\\ \\text{mm}^2' }
      ],
      a: 'A sector of radius 130 mm and angle 138.5°, area 20 420 mm².'
    },
    {
      title: 'A funnel',
      q: 'A funnel is a frustum of a cone with radii 40 mm and 100 mm and a height of 120 mm. Describe the pattern.',
      steps: [
        { text: 'The slant length of the frustum is $\\sqrt{60^2 + 120^2} = 134.2$ mm. The complete cone has slant lengths in proportion to the radii:', tex: 'L_{\\text{big}} = 134.2\\times\\frac{100}{60} = 223.6,\\qquad L_{\\text{small}} = 134.2\\times\\frac{40}{60} = 89.4' },
        { text: 'The angle, from the large cone:', tex: '\\varphi = 360°\\times\\frac{100}{223.6} = 161.0°' },
        'The pattern is the part of a disc between radii 89.4 and 223.6 mm over an angle of 161.0°; the small arc is as long as the small circle ($89.4 \\times 2.810 = 251$ mm = $2\\pi \\times 40$).'
      ],
      a: 'An annular sector, radii 89.4 and 223.6 mm, angle 161.0°.'
    }
  ],
  quiz: [
    { q: 'A cone has base radius r and slant length L. The angle of its developed sector is', choices: ['360° L / r', '360° r / L', '180° r / L', '360° r / h'], a: 1, why: 'The arc of the sector (L φ) must equal the base circumference 2π r, so φ = 2π r / L.' },
    { q: 'A cylinder 100 mm in diameter develops into a strip how many millimetres wide (to the nearest)?', answer: 314, unit: 'mm', why: 'W = π D = 314 mm.' },
    { q: 'A sphere can be developed if the pattern is cut into enough gores.', a: false, why: 'A sphere cannot be flattened without stretching; gores only approximate the result, better as they get narrower. Only developable surfaces unfold exactly.' },
    { q: 'A cone has L = 130 and r = 50. The sector angle in degrees is about', answer: 138.5, unit: '°', why: '360° × 50/130 = 138.5°.' }
  ],
  applications: [
    'Sheet-metal work: ducts, hoppers, funnels, chimneys and transition pieces are cut from developments ([[sheet-metal-and-developments]]).',
    'Packaging: the net of a box or carton is a development with fold lines and glue flaps.',
    'Papercraft and architecture: models of buildings from nets; folded-plate structures.',
    'Globes and maps: gores for a globe are an approximate development of the sphere.'
  ],
  history: 'The developing of surfaces is as old as tailoring and tinsmithing; Dürer\'s *Underweysung* (1525) gives the nets of the five regular solids, folded out flat, and the theory of the surfaces that can be laid flat ("developable surfaces") was founded by Euler in 1771. Monge made the development of cones, cylinders and warped surfaces a chapter of descriptive geometry.',
  sources: ['Albrecht Dürer, *Underweysung der Messung* (1525): the nets of the regular solids.', 'Leonhard Euler, *De solidis quorum superficiem in planum explicare licet* (1772).', 'Frederick E. Giesecke et al., *Technical Drawing*, the chapter on developments.', 'Gaspard Monge, *Géométrie descriptive* (1799).'],
  sim: 'dg-unfold',
  construction: ['dg-development-pyramid', 'dg-development-cone']
},

{
  id: 'intersections-of-solids',
  parent: 'descriptive-geometry',
  title: 'Intersections of solids',
  level: 3,
  short: 'Where two solids meet, their surfaces cut in a line. Find its points with cutting planes that slice both solids in simple figures, or directly when one view shows a surface edge-on; the line of a line with a plane comes from a projecting plane through the line.',
  keywords: ['intersection', 'cutting plane', 'penetration', 'prism', 'cylinder', 'cone', 'line and plane', 'piercing point', 'visibility', 'Steinmetz', 'Monge'],
  prereq: ['planes-and-traces', 'auxiliary-views', 'point-and-line-in-monge'],
  related: ['developments', 'shadows-by-projection', 'section-views', 'sheet-metal-and-developments', 'perspective-shadows'],
  body: `Two solids that penetrate one another meet along a **line of intersection**, a polygon for polyhedra and a curve for curved surfaces. Drawing that line is the working problem behind a chimney through a roof, a branch pipe on a main, a hole drilled through a shaft. The idea is always the same: find **points** of the line one at a time and join them in the right order.

### A line and a plane
Where does the line $PQ$ pierce the plane of the triangle $ABC$? Take the vertical plane through the plan $pq$: in the plan it is **edge-on** (it is the line $pq$), so the points where it cuts the sides of the triangle are found directly there. Carry those two points up to the elevation, join them, and the join is the section of the triangle by the cutting plane. It lies in the plane of the triangle and in the cutting plane, and so does the line, so the line and the join cross exactly at the **piercing point**. Drop it to the plan. Then decide the **visibility**: in each view the part of the line that is nearer the viewer than the plane is visible, the rest is hidden where it passes behind the triangle.

### The cutting-plane method
Choose a family of auxiliary planes, cutting both solids at once. Each plane slices a prism, a pyramid, a cone or a cylinder in a simple figure (a polygon, a circle, a triangle, a pair of lines); where the two sections cross are points of the line of intersection. The best planes are those that give **lines or circles**: horizontal planes for solids of revolution with vertical axes, planes through the apex for cones and pyramids. For surfaces of revolution with intersecting axes, **concentric spheres** do the same job.

### The direct method
If one solid has all its faces **edge-on** in the plan (a vertical prism) and the other has all its faces edge-on in the elevation (a prism with its axis perpendicular to V), the points are found at once: a vertical edge of the first pierces a face of the second where the edge's elevation meets that face's edge-on line. The construction does this for a chimney through a gable roof, then checks the result with an isometric picture.

### Some good facts
Two equal cylinders meeting at right angles with intersecting axes meet in two **ellipses** lying in two planes at 45°, so the intersection is seen as straight lines in the view along the axis of the plane. This is why mitred pipe joints can be cut straight. (It is a case of a theorem of Monge: two surfaces of revolution of second degree that are circumscribed about a common sphere meet in plane curves.) The volume common to those two cylinders is $16r^3/3$.

### How it is drawn
Two constructions: a line piercing a triangle by the cutting-plane method, and two prisms by the direct method.`,
  ideas: [
    'The line of intersection of two solids is found point by point: each point is the meeting of an edge of one with a face of the other, or of two sections cut by an auxiliary plane.',
    'A line and a plane: pass a projecting plane through the line; its section with the plane crosses the line at the piercing point; visibility follows from which part is nearer the viewer.',
    'Choose cutting planes that cut both solids in lines or circles: horizontal for vertical solids of revolution, through the apex for cones and pyramids, concentric spheres for revolution surfaces with intersecting axes.',
    'When faces are edge-on in the views (vertical and horizontal prisms) the points appear directly.'
  ],
  pitfalls: [
    'The points are joined in any order — They are joined along the surfaces: a point on one face is joined only to the next point on the same face of both solids.',
    'Visibility is the same in both views — It must be decided in each view separately: what is nearer the viewer in the plan (higher) is not what is nearer in the elevation (in front).',
    'The line of intersection is a plane curve — Only in special cases (equal cylinders, cutting a cone by a plane); in general it is a space curve with plan and elevation different.'
  ],
  formulas: [
    {
      name: 'Height at which a vertical edge pierces a roof plane',
      expr: 'z = zr - x*tan(beta)',
      tex: 'z = z_r - x\\tan\\beta',
      vars: {
        z: { name: 'height of the piercing point', q: 'length', unit: 'mm' },
        zr: { name: 'height of the ridge', q: 'length', unit: 'mm', value: 40, tex: 'z_r' },
        x: { name: 'distance of the edge from the ridge, across the slope', q: 'length', unit: 'mm', value: 24 },
        beta: { name: 'pitch of the roof', q: 'angle', unit: '°', value: 33.7, min: 0, max: 80, tex: '\\beta' }
      },
      solveFor: 'z',
      note: 'Valid for the plane of the roof sloping away from the ridge. A vertical edge at distance x from the ridge meets it at this height.'
    },
    {
      name: 'Volume common to two equal cylinders at right angles',
      expr: 'V = 16*r^3/3',
      tex: 'V = \\frac{16}{3}\\,r^3',
      vars: { V: { name: 'volume of the common part (Steinmetz solid)', q: 'volume', unit: 'mm³' }, r: { name: 'radius of the cylinders', q: 'length', unit: 'mm', value: 50 } },
      solveFor: 'V',
      note: 'Found by Archimedes in the *Method*: 2/3 of the cube that contains it. Its surface consists of the two pairs of elliptical arcs of the intersection.'
    }
  ],
  examples: [
    {
      title: 'A chimney through a roof',
      q: 'A gable roof is 120 wide (half-width 60) and its ridge is 40 above the eaves. A chimney of square plan 48 × 40 rises through it, centred on the ridge. At what height do its four vertical edges pierce the roof, and what is the pitch?',
      steps: [
        { text: 'The pitch of the roof:', tex: '\\tan\\beta = \\frac{40}{60}\\ \\Rightarrow\\ \\beta = 33.7°' },
        { text: 'The edges are at $x = \\pm 24$ from the ridge:', tex: 'z = 40 - 24\\tan 33.7° = 40 - 16 = 24' },
        'The ridge itself, at $x = 0$ and height 40, meets the front and back faces of the chimney at $m$ and $n$. The line of intersection is the closed polygon of six points on the four faces: the front and back faces each meet the roof in a "Λ" through the ridge point, the side faces in a horizontal line at height 24.'
      ],
      a: 'The four vertical edges pierce the roof at height 24 (pitch 33.7°); the front and back faces meet it in a Λ peaking at 40.'
    },
    {
      title: 'Common volume of two pipes',
      q: 'Two cylindrical pipes of radius 50 mm cross at right angles with intersecting axes. What is the volume common to both?',
      steps: [
        { text: 'The Steinmetz solid:', tex: 'V = \\frac{16}{3}\\,r^3 = \\frac{16}{3}\\times 125\\,000 = 666\\,700\\ \\text{mm}^3' },
        'That is 0.667 litres, two thirds of the cube $(2r)^3 = 10^6$ mm³ that contains it.'
      ],
      a: 'About 0.667 litre, 2/3 of the circumscribing cube.'
    }
  ],
  quiz: [
    { q: 'To find where a line pierces a plane given by a triangle, one passes through the line', choices: ['a projecting (edge-on) plane', 'a sphere', 'any curved surface', 'the origin'], a: 0, why: 'A plane perpendicular to V or H appears as a line in one view, so its section with the triangle is found directly there.' },
    { q: 'Two equal cylinders cross at right angles with intersecting axes. Their line of intersection is', choices: ['two ellipses in two planes', 'a circle', 'a straight line', 'a parabola'], a: 0, why: 'This special case splits into two plane curves, ellipses in planes at 45°, which is why mitred pipe joints can be cut straight.' },
    { q: 'A gable roof has half-width 60, ridge height 40. A vertical edge 30 from the ridge pierces the roof at what height?', answer: 20, why: 'z = 40 − 30 × (40/60) = 20.' },
    { q: 'The visibility of a line passing behind a triangle is the same in the plan and in the elevation.', a: false, why: 'In the plan the nearer part is the higher; in the elevation it is the one with the greater depth in front of V. The two decisions are separate and may disagree.' }
  ],
  applications: [
    'Pipework and ducting: the line of intersection of a branch with a main gives the saddle cut and the weld preparation; its development is the pattern ([[sheet-metal-and-developments]]).',
    'Roof flashings: the lines where chimneys, dormers and vents meet a roof set the shapes of the flashings.',
    'Machine design: the curves where holes meet shafts and fillets meet faces.',
    'CAD and solid modelling: Boolean operations (union, difference, intersection) are computed from exactly these intersections of surfaces.'
  ],
  history: 'Finding the line where two surfaces meet was already the stonecutter\'s daily work in vaults (Philibert de l\'Orme, 1567; Frézier, 1737–39). Monge treated it systematically with cutting planes and spheres and, in his theory of surfaces, proved the theorem about quadrics with a common inscribed sphere. The volume common to two equal cylinders, 16 r³/3, was found by Archimedes in the *Method*, and by Zu Chongzhi and his son Zu Gengzhi in fifth-century China; it is called the Steinmetz solid after the engineer Charles Proteus Steinmetz, who later studied it.',
  sources: ['Gaspard Monge, *Géométrie descriptive* (1799).', 'Amédée-François Frézier, *La théorie et la pratique de la coupe des pierres* (1737–39).', 'Archimedes, *The Method*.', 'Frederick E. Giesecke et al., *Technical Drawing*, the chapter on intersections.'],
  construction: ['dg-line-plane', 'dg-two-prisms']
},

{
  id: 'shadows-by-projection',
  parent: 'descriptive-geometry',
  title: 'Shadows as projections',
  level: 2,
  short: 'A shadow is a projection onto a surface. The sun gives parallel projectors, so the shadow of a figure is shifted; a lamp gives projectors through a point, so the shadow is scaled about the lamp\'s foot. The same constructions give the shadows of buildings, posts and sundials.',
  keywords: ['shadow', 'sciography', 'sun', 'lamp', 'point source', 'altitude', 'azimuth', 'parallel rays', 'sundial', 'shading'],
  prereq: ['parallel-vs-central', 'monge-method', 'math:similar-triangles'],
  related: ['perspective-shadows', 'sundials-as-projections', 'sun-path-diagrams', 'horizon-coordinates', 'shadow-maps-and-projective-textures', 'intersections-of-solids'],
  body: `A shadow is a projection with a very physical meaning: the projectors are the light rays, the picture plane is the surface the shadow falls on, and the shadow of a point is where the ray through it meets that surface. Everything said so far about parallel and central projection applies unchanged.

### The sun: parallel rays
The sun is so distant that its rays are parallel (see [[parallel-vs-central]]). The direction is given by two angles, the **altitude** $\\alpha$ above the horizon and the **azimuth**, which is the compass direction of the sun, the shadow lying in the opposite one. A point at height $h$ above the ground is carried to the ground along the ray, and its shadow is displaced from its foot by
$$S = \\frac{h}{\\tan\\alpha}$$
in the direction away from the sun. Every point at height $h$ is displaced by the **same vector**, so the shadow of a horizontal figure is a **translated copy** of it. The altitude at noon on a given day is $90° - \\varphi + \\delta$, with $\\varphi$ the latitude and $\\delta$ the sun's declination ([[horizon-coordinates]]).

### The lamp: central rays
A point source at height $H$ over the point $F$ of the ground (its foot) is a centre of projection. The shadow of a point at height $h$ and horizontal distance $x$ from $F$ is at the distance
$$x_s = \\frac{H\\,x}{H - h}$$
from $F$, on the same ray. All points at height $h$ are scaled about $F$ by the factor $H/(H - h)$, so the shadow of a horizontal figure is a **scaled copy** of it. The scale is the key: the lamp must be higher than the thing, and as $h$ approaches $H$ the shadow runs off to infinity.

### The shadow of a solid
For a convex solid the shadow on the ground is the **hull** of the shadows of its corners: for a post, the footprint together with the shifted or scaled top. A figure on a wall or on a roof needs the intersection of the rays with that plane (a line and a plane again).

### The old convention
In the sciography of the architectural schools the light was drawn along the diagonal of a cube, at 45° in plan and in elevation. Its true altitude is $\\arctan(1/\\sqrt 2) = 35.26°$, so a vertical edge casts a shadow $\\sqrt 2$ times its height. The convention made hand rendering quick.

### How it is drawn
Two constructions on the same square post: the lamp (turn the section of one ray into a scale factor, then use parallels) and the sun (the angle $\\alpha$ with the protractor, then shift the corners).`,
  ideas: [
    'A shadow is a projection: the rays are the projectors and the receiving surface is the picture plane.',
    'Under the sun (parallel rays) a horizontal figure at height h is shifted by h / tan α on the ground; under a lamp it is scaled by H / (H − h) about the lamp\'s foot.',
    'The shadow of a convex solid is the hull of the footprint and of the shadow of its top.',
    'The altitude of the sun at noon is 90° − latitude + declination; the length of a shadow follows from it.'
  ],
  pitfalls: [
    'The shadow of a vertical post is as long as the post — Only when the sun is 45° high. At altitude α the shadow is h / tan α: shorter than the post above 45°, longer below.',
    'Shadows from a lamp are parallel like those of the sun — They radiate from the lamp\'s foot and the shadow of a vertical post lies on the line from the lamp\'s foot through the post.',
    'The sun is a point — It has an angular diameter of about half a degree, so the edge of a shadow is soft (penumbra); the construction gives the centre-line shadow.'
  ],
  formulas: [
    {
      name: 'Length of a shadow under the sun',
      expr: 'S = h/tan(alpha)',
      tex: 'S = \\frac{h}{\\tan\\alpha}',
      vars: { S: { name: 'horizontal length of the shadow', q: 'length', unit: 'm' }, h: { name: 'height of the object', q: 'length', unit: 'm', value: 12 }, alpha: { name: 'altitude of the sun', q: 'angle', unit: '°', value: 61.9, min: 1, max: 90, tex: '\\alpha' } },
      solveFor: 'S',
      note: 'The projectors are parallel; every point at height h is shifted by S.'
    },
    {
      name: 'Shadow under a lamp',
      expr: 'xs = H*x/(H - h)',
      tex: 'x_s = \\frac{H\\,x}{H - h}',
      vars: { xs: { name: 'distance of the shadow of the top from the lamp\'s foot', q: 'length', unit: 'm', tex: 'x_s' }, H: { name: 'height of the lamp', q: 'length', unit: 'm', value: 3 }, x: { name: 'distance of the post from the lamp\'s foot', q: 'length', unit: 'm', value: 4 }, h: { name: 'height of the post', q: 'length', unit: 'm', value: 1.8 } },
      solveFor: 'xs',
      note: 'Similar triangles in the vertical plane through the lamp and the post. The scale factor is H / (H − h).'
    },
    {
      name: 'Altitude of the sun at noon',
      expr: 'alpha = pi/2 - phi + delta',
      tex: '\\alpha = 90° - \\varphi + \\delta',
      vars: { alpha: { name: 'altitude of the sun on the meridian', q: 'angle', unit: '°', signed: true, tex: '\\alpha' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, signed: true, min: -90, max: 90, tex: '\\varphi' }, delta: { name: 'declination of the sun', q: 'angle', unit: '°', value: 23.4, signed: true, min: -23.5, max: 23.5, tex: '\\delta' } },
      solveFor: 'alpha',
      note: 'For a place north of the sun at noon. London at midsummer: 61.9°; at midwinter (δ = −23.4°): 15.1°.'
    }
  ],
  examples: [
    {
      title: 'A building\'s shadow at noon',
      q: 'A building is 12 m high, in London (latitude 51.5° N). How long is its shadow at noon on the longest day and on the shortest?',
      steps: [
        { text: 'Summer solstice, $\\delta = +23.4°$:', tex: '\\alpha = 90° - 51.5° + 23.4° = 61.9°,\\quad S = \\frac{12}{\\tan 61.9°} = 6.4\\ \\text{m}' },
        { text: 'Winter solstice, $\\delta = -23.4°$:', tex: '\\alpha = 90° - 51.5° - 23.4° = 15.1°,\\quad S = \\frac{12}{\\tan 15.1°} = 44.5\\ \\text{m}' }
      ],
      a: '6.4 m in midsummer and 44.5 m in midwinter: seven times longer.'
    },
    {
      title: 'The shadow of a person under a street lamp',
      q: 'A lamp is 3 m above the ground. A person 1.8 m tall stands 4 m from the lamp\'s foot. Where does the shadow of the head fall, and how long is the shadow?',
      steps: [
        { text: 'By the lamp formula:', tex: 'x_s = \\frac{3\\times 4}{3 - 1.8} = 10\\ \\text{m}' },
        'The shadow of the head is 10 m from the lamp\'s foot, so the shadow is $10 - 4 = 6$ m long, more than three times the person\'s height. The scale factor is $3/1.2 = 2.5$.'
      ],
      a: 'The head\'s shadow is 10 m from the foot of the lamp; the shadow is 6 m long.'
    }
  ],
  quiz: [
    { q: 'Under the sun, the shadow on level ground of a flat horizontal square at height h is', choices: ['a smaller square', 'a translated copy of the square', 'a scaled copy about a point', 'a circle'], a: 1, why: 'Parallel rays carry every point of the square by the same vector, h / tan α along the ground.' },
    { q: 'Under a lamp, the shadow on level ground of a flat horizontal square at height h is', choices: ['a translated copy', 'a copy scaled by H/(H − h) about the lamp\'s foot', 'a smaller square', 'a line'], a: 1, why: 'The rays pass through the lamp, so the top square is projected centrally onto the ground and scaled about the foot by H/(H − h).' },
    { q: 'The sun is 45° above the horizon. A 2 m post casts a shadow how many metres long?', answer: 2, unit: 'm', why: 'S = h / tan 45° = 2 m.' },
    { q: 'A lamp 5 m high lights a 2 m post. By what factor is the shadow of the top scaled about the lamp\'s foot?', answer: 1.667, why: 'H / (H − h) = 5 / 3 = 1.667.' },
    { q: 'The edge of a shadow cast by the sun is sharp.', a: false, why: 'The sun has an angular diameter of about 0.5°, so the rays from its different parts give a penumbra whose width grows with the distance from the object.' }
  ],
  applications: [
    'Architecture: shading studies and sun-path diagrams decide whether a building overshadows its neighbours or a room gets winter sun ([[sun-path-diagrams]]).',
    'Sundials: the shadow of a pointer parallel to the earth\'s axis traces the hours ([[sundials-as-projections]]).',
    'Computer graphics: shadow maps render the scene from the light as a centre of projection, and test which points the light sees ([[shadow-maps-and-projective-textures]]).',
    'Solar energy and landscape design: spacing of rows of panels and trees from the shadow lengths at the worst times of year.',
    'Astronomy: eclipses are shadows, the umbra and penumbra of the Moon and Earth, cast by the sun as a source of finite size.'
  ],
  history: 'Leonardo da Vinci analysed light and shade at length for painters. The drawing of cast shadows from a point light and from the sun, with parallel rays, became a regular part of architectural drawing in the nineteenth century ("shades and shadows", or *sciography*), built on Monge\'s methods, and the light along the diagonal of a cube, at 45° in both views, was the standard convention for hand rendering.',
  sources: ['Leonardo da Vinci, *Treatise on Painting* (compiled after his death), the books on light and shade.', 'Gaspard Monge, *Géométrie descriptive* (1799), the section on shadows.', 'Frederick E. Giesecke et al., *Technical Drawing*, the chapter on shades and shadows.', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998): the sun\'s altitude.'],
  sim: 'dg-shadow-light',
  construction: ['dg-shadow-point-light', 'dg-shadow-sun']
}
);
