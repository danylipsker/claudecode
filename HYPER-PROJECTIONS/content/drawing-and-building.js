/* HYPER-PROJECTIONS · content/drawing-and-building.js — the topic "Drawing and building" (branch Projections at Work).
 *
 *   engineering-drawings           orthographic views, first and third angle, ISO 128 and ASME Y14, sections, scale and dimensions
 *   architectural-drawings         plans, elevations and sections, the roof's true slope, scales, the architect's perspective
 *   technical-illustration         isometric, dimetric and oblique pictures, exploded views and balloons for manuals and catalogues
 *   patent-and-assembly-drawings   what a patent office and an assembly shop require of a figure: numerals, lead lines, hatching rules
 *   surveying-and-site-plans       plan projection with heights: traverses, closing error, contours, profiles, curvature
 *   sheet-metal-and-developments   developments of cylinders and cones, mitre elbows, bend allowance
 * Each page says which projection the practice relies on, why that one, the conventions, a worked case and what goes wrong.
 */
Hyper.add(
{
  id: 'engineering-drawings',
  parent: 'drawing-and-building',
  title: 'Engineering drawings and ISO 128',
  level: 1,
  short: 'A part is described for the person who must make it by orthographic views in first or third angle, with sections, standard lines and dimensions: the projection is chosen so that every face parallel to a view is true shape and every size can be written once and read without calculation.',
  keywords: ['engineering drawing', 'ISO 128', 'multiview', 'first angle', 'third angle', 'section view', 'title block', 'ASME Y14', 'projection symbol', 'dimensioning', 'scale', 'orthographic'],
  prereq: ['first-angle-projection', 'third-angle-projection', 'section-views'],
  related: ['line-conventions', 'dimensioning-basics', 'six-principal-views', 'auxiliary-views', 'technical-illustration', 'architectural-drawings'],
  body: `A drawing is a contract. The designer cannot hand the part to the machinist, so the sheet must say, without a conversation, what to make: its shape, its sizes, the tolerances and the finish. The choice of projection follows from two demands: **what must be measurable** and **what must not be ambiguous**.

### Why orthographic views
Project the part perpendicularly onto planes parallel to its main faces ([[orthographic-projection]]) and three things come free. A face parallel to a plane is drawn in **true shape**: a hole is a circle, a slot a rectangle of its real size. A length parallel to a plane is drawn at the **scale of the sheet**, one factor for the whole view, so it can be written once as a dimension. And an edge parallel to the line of sight shrinks to a point, so the views are exact and few: a block needs two or three, a turned shaft one. The front view is the matrix $\\mathrm{diag}(1,1,0,1)$; the top view is the same after a $90°$ turn about the horizontal axis. Perspective and isometric pictures keep none of these properties; they serve another reader ([[technical-illustration]]).

### First angle, third angle
Two arrangements of the views are standard. In **first angle** (the ISO default, Europe, most of Asia) the part lies between the viewer and the picture plane, so the top view lands *below* the front view and the view from the right lands on the *left*. In **third angle** (ASME Y14.3, Canada, Japan) the plane lies between viewer and part, like a glass box unfolded, and each view lands on the side it was taken from. Only a small symbol, a truncated cone seen from the front and from its end, tells the reader which was used; ISO 7200 puts it in the title block. Read a [[first-angle-projection|first-angle]] sheet as [[third-angle-projection|third angle]] and the top and bottom are exchanged: a classic source of scrapped parts.

### The conventions
ISO 128 fixes the language: thick continuous lines for visible edges, thin dashed lines for hidden ones, thin chain lines for axes, and 45° hatching at equal spacing for what a [[section-views|section]] cuts ([[line-conventions]]). Choose as the front view the one that shows most of the shape, in the position in which the part works (or, for a turned part, with its axis horizontal), and add only the views needed to define it. Give each size once, where the feature is clearest ([[dimensioning-basics]]; ISO 129-1, ASME Y14.5), and write the scale from the ISO 5455 series: 1:1, 1:2, 1:5, 1:10 … 2:1, 5:1. Sheets follow ISO 5457: A4 is 210 × 297 mm and each size is half the one above.

### Where it goes wrong
Anything not parallel to a view is shortened. A face tilted by $\\theta$ from the picture plane shows its sloping lengths multiplied by $\\cos\\theta$ and its circles squashed into ellipses. The cure is an **auxiliary view** looking square onto the face ([[auxiliary-views]]), never a calculation from the drawing. Hence the note on every sheet, *do not scale the drawing*: the written dimensions govern, and a print may have been enlarged by the copier.

> [!tip] In the construction below, the 45° mitre line carries the depths of the top view into the right view, and the hatching marks the material cut by the section plane A–A. The same rules, step by step, produce any three-view sheet.`,
  ideas: [
    'A drawing must be measurable and unambiguous; orthographic views are used because true-shape faces and true-length edges need no calculation.',
    'First angle puts the top view below the front view, third angle above it; the projection symbol in the title block says which was used.',
    'Use the fewest views that define the part, to a standard scale, with each size given once; the dimensions govern and the drawing is never scaled.',
    'Anything inclined to a view is shortened by cos θ and its circles become ellipses: an auxiliary view shows it true.'
  ],
  pitfalls: [
    'The top view always goes above the front view — Only in third angle. In ISO first angle it goes below, and the right view goes to the left; look for the symbol in the title block.',
    'Hidden lines show everything inside the part — They show only the edges that lie behind a surface in that view. Where there are many, a section is clearer, and the standard prefers it.',
    'A length measured on the drawing is a dimension — The numbers written on the sheet govern. The drawing may have been reduced or enlarged by copying, and even an exact 1:1 plot is not accurate enough for tolerances.'
  ],
  formulas: [
    {
      name: 'Length on the sheet',
      expr: 'Ld = s*L',
      tex: 'L_d = s\\,L',
      vars: { Ld: { name: 'length drawn on the sheet', q: 'length', unit: 'mm' }, s: { name: 'scale (sheet : part)' , value: 0.2 }, L: { name: 'true length on the part', q: 'length', unit: 'mm', value: 640 } },
      note: 'Scale 1:5 is s = 0.2, scale 2:1 is s = 2. Every length parallel to the view is multiplied by the same factor.'
    },
    {
      name: 'Three views on a sheet',
      expr: 'Wa = s*(w + d) + g',
      tex: 'W_a = s\\,(w + d) + g',
      vars: { Wa: { name: 'width of the drawing area', q: 'length', unit: 'mm', value: 380 }, s: { name: 'scale (sheet : part)', value: 0.2 }, w: { name: 'width of the part', q: 'length', unit: 'mm', value: 640 }, d: { name: 'depth of the part', q: 'length', unit: 'mm', value: 240 }, g: { name: 'gap between the views (dimension space)', q: 'length', unit: 'mm', value: 30 } },
      solveFor: 's',
      note: 'The front view and the side view stand side by side in the width, and the front and top views one above the other in the height. Solve for the scale in each direction and take the smaller, then the next standard scale below it.'
    },
    {
      name: 'Foreshortening of an inclined face',
      expr: 'lp = L*cos(theta)',
      tex: 'l_p = L\\cos\\theta',
      vars: { lp: { name: 'length drawn in the view', q: 'length', unit: 'mm' }, L: { name: 'true length along the slope', q: 'length', unit: 'mm', value: 40 }, theta: { name: 'angle between the face and the picture plane', q: 'angle', unit: '°', value: 30, min: 0, max: 89, tex: '\\theta' } },
      note: 'A circle of diameter D in that face appears as an ellipse with major axis D and minor axis D cos θ.'
    }
  ],
  examples: [
    {
      title: 'Choosing the scale for a housing',
      q: 'A housing is 640 mm wide, 360 mm high and 240 mm deep. It is to be drawn in third angle (front view, top view above it, right view beside it) on an A3 sheet whose drawing area is 380 × 230 mm, leaving 30 mm between views for dimensions. Which standard scale?',
      steps: [
        { text: 'Across the sheet the front and right views stand side by side:', tex: 's\\,(640 + 240) + 30 \\le 380 \\;\\Rightarrow\\; s \\le 0.398' },
        { text: 'Up the sheet the front and top views are stacked:', tex: 's\\,(360 + 240) + 30 \\le 230 \\;\\Rightarrow\\; s \\le 0.333' },
        'The height is the tighter limit. The preferred reductions are 1:2 (0.5), 1:5 (0.2), 1:10 (0.1): 1:2 does not fit, so 1:5 is the largest standard scale. The views then measure 128 × 72, 128 × 48 and 48 × 72 mm.'
      ],
      a: 'Scale 1:5; the three views take 176 mm across and 120 mm up, leaving room for the dimensions and the title block.'
    },
    {
      title: 'A hole in a sloping face',
      q: 'A face of a casting is tilted 30° from the picture plane. In it a slot is 40 mm long along the slope and a hole of Ø20 has been drilled square to the face. What does the view show, and which view shows them true?',
      steps: [
        { text: 'The length along the slope is multiplied by cos 30°:', tex: '40\\cos 30° = 34.6\\ \\text{mm}' },
        { text: 'The circle becomes an ellipse of major axis 20 (along the line where the face meets the picture plane) and minor axis', tex: '20\\cos 30° = 17.3\\ \\text{mm}' },
        'Neither the slot length nor the hole diameter can be dimensioned correctly from this view. An auxiliary view, looking square onto the face, shows the slot 40 long and the hole as a true circle Ø20.'
      ],
      a: 'The slot looks 34.6 long and the hole a 20 × 17.3 ellipse; the auxiliary view shows 40 and Ø20.'
    }
  ],
  quiz: [
    { q: 'In first-angle projection the top view is drawn', choices: ['above the front view', 'below the front view', 'to the right of the front view', 'on a separate sheet'], a: 1, why: 'The part sits between the viewer and the plane, so the top view is projected down and unfolds below the front view; in third angle it is above.' },
    { q: 'A square plate 100 mm on a side is turned 60° about a vertical axis from facing the viewer. How wide is it in the front view?', answer: 50, unit: 'mm', why: 'The width is multiplied by cos 60° = 0.5 (the depth of the plate adds nothing for a thin plate).' },
    { q: 'You may find a missing dimension by measuring the printed drawing with a ruler.', a: false, why: 'The drawing may be reduced or enlarged by copying, and the rule is that the written dimensions govern; ask the designer.' },
    { q: 'A turned shaft is usually shown in a single view because', choices: ['it is too small for more', 'a view along its axis would add nothing a diameter note cannot say', 'the standard forbids more than one view', 'it has no hidden edges'], a: 1, why: 'The end view of a body of revolution is a circle; the diameters are written in front of the dimensions (Ø) and the one side view shows everything else.' },
    { q: 'A machinist reads a first-angle sheet as if it were third angle. Which error is most likely?', choices: ['all sizes are doubled', 'features seen in the top view are put on the bottom face', 'the holes are drilled to the wrong diameter', 'the part is made in the wrong material'], a: 1, why: 'The view below the front view is the top view in first angle but the bottom view in third angle, so features go on the opposite face.' }
  ],
  applications: [
    'Part drawings for machining, casting and sheet-metal work: the machinist reads each feature in its true shape from the view in which it is clearest and takes sizes without calculation.',
    'CAD and model-based definition: the 3-D model is the master, but the sheet is still generated as orthographic views of it (ISO 128-34, ASME Y14.41), because tolerances and notes belong to flat, true-shape views.',
    'Shop drawings for steelwork and joinery, drawn as plan, elevation and section at 1:20 to 1:5, with every member dimensioned from a common datum.',
    'Inspection: a coordinate-measuring machine compares measured features with the dimensions of the sheet, so the datum scheme (ISO 5459) must be read from the same views.'
  ],
  history: 'The system comes from Gaspard Monge, who invented descriptive geometry in the 1760s–80s for the design of fortifications at Mézières, kept it a military secret, and taught it at the École normale and the École polytechnique from 1795 (the *Géométrie descriptive* was published in 1799). Monge placed the object in the first dihedral angle, and first-angle layout spread across Europe with the engineering schools. American drafting had settled on third angle by the early twentieth century, the usual argument being that it puts each view next to the side it is seen from. The ISO 128 series, first issued in 1982 and revised from 1996 as separate parts, recognises both and requires the symbol.',
  sources: ['ISO 128 (series), Technical product documentation — General principles of presentation; ISO 5456-2, Projection methods — Orthographic representations.', 'ISO 5455, scales; ISO 5457, sheet sizes; ISO 7200, title blocks; ISO 129-1, dimensioning.', 'ASME Y14.3, Orthographic and Pictorial Views; ASME Y14.5, Dimensioning and Tolerancing.', 'Giesecke, Mitchell, Spencer et al., *Technical Drawing with Engineering Graphics*, chapters on multiview drawing and sections.'],
  sim: 'db-third-angle',
  construction: 'db-part-drawing'
},

{
  id: 'architectural-drawings',
  parent: 'drawing-and-building',
  title: 'Architectural plans, sections and elevations',
  level: 1,
  short: 'A building is described by a plan (a horizontal cut seen from above), elevations (the faces seen square on) and sections (vertical cuts): all orthographic, all to a scale in whole numbers, so that heights, widths and the true slope of a roof can be measured; perspective is added for the client, not for the builder.',
  keywords: ['plan', 'section', 'elevation', 'architectural drawing', 'roof pitch', 'scale 1:50', 'ISO 7519', 'poché', 'axonometric', 'cutting plane', 'building'],
  prereq: ['first-angle-projection', 'section-views', 'orthographic-projection'],
  related: ['engineering-drawings', 'surveying-and-site-plans', 'planometric-projection', 'one-point-perspective', 'two-point-perspective', 'plan-and-elevation-method'],
  body: `A builder needs to know how long, how wide and how high; a client wants to know what it will look like. Architectural drawing uses two families of projection for those two readers. For the builder the building is cut and viewed orthographically, so every wall can be measured on the drawing with a scale rule. For the client the architect adds a perspective, a [[planometric-projection|planometric]] or an axonometric picture.

### Plan, elevation, section
A **plan** is a horizontal section: the building is cut about 1 m above the floor, the upper part is thrown away, and what remains is projected straight down. Walls that are cut are filled in or hatched (the *poché*); what lies below the cut, steps and door swings, is drawn lightly; what lies above, such as a roof overhang, is dashed. An **elevation** is a view of one face from a point far enough away for the projectors to be parallel, so a window 2.0 m wide is drawn 2.0 m wide wherever the wall is. A **section** is a vertical cut, and it is the only drawing that shows floor levels, wall thicknesses and the *true pitch of a roof*. Their arrangement is the one of [[first-angle-projection|multiview drawing]]: the elevation stands above the plan and shares its widths through vertical projectors; the section stands beside the elevation and shares its heights through horizontal ones.

### Why the roof slope is read in section
Take a house 8 m long and 6 m deep with a roof pitched at 30° on both sides of a ridge along the length. In the front elevation the roof is a plain band: its height is only the rise, $3.5\\tan 30° = 2.02$ m. In the plan it is a rectangle 3.5 m deep on each side, the horizontal run. Neither shows the pitch or the length of the rafter. A section cut across the ridge shows the slope as a line at 30° and the rafter at its true length, $3.5/\\cos 30° = 4.04$ m. The roofer who orders tiles from the elevation would buy half of what is needed, since at 30° the elevation shows only $\\sin 30° = 0.5$ of the slope: the true area of a slope is the plan area divided by $\\cos\\alpha$, 15 % more than the plan.

### Scales and conventions
ISO 7519 sets the conventions for building drawings, with scales taken from the ISO 5455 series (1:1, 1:2, 1:5, 1:10, 1:20, 1:50, 1:100, 1:200, 1:500 …); 1:100 is usual for general arrangements, 1:50 for plans of a dwelling, 1:20 to 1:5 for details, 1:500 for a site. Cutting planes are marked on the plan with arrows that show the way you look, and the sections are lettered. Dimensions are in millimetres and, unlike machine drawings, are often written as a chain from the grid lines.

### The client's picture
The plan can be tilted into a **planometric** or a worm's-eye axonometric, which keep every wall to scale; or the architect draws a perspective with two vanishing points ([[two-point-perspective]]) or one for an interior ([[one-point-perspective]]) from a chosen eye height. They cannot be measured, and they are made from the plan and elevation by the [[plan-and-elevation-method|plan-and-elevation construction]].

> [!note] The construction below sets the three drawings of a small house on one sheet. Heights come across from the elevation; depths come round from the plan with quarter-circle arcs; the roof is drawn at 30° in the section, where it is true.`,
  ideas: [
    'A plan is a horizontal section seen from above, an elevation a view of one face, a section a vertical cut: all are orthographic, so everything in them can be measured to scale.',
    'Widths are shared through vertical projectors between plan and elevation, heights through horizontal projectors between elevation and section.',
    'The pitch and the true length of a roof appear only in a section across the ridge; the plan shortens the slope and the elevation shows only the rise.',
    'Perspective and axonometric views are added for clients: pleasant, but not to be measured.'
  ],
  pitfalls: [
    'The elevation shows the true size of the roof — It shows the true width and the rise only. A slope tilted away from the viewer is shortened by sin of its pitch in the elevation and cos of it in the plan; the true length appears in a section square to the ridge.',
    'A plan is a view from above of the whole building — It is a section: the cut is at about 1 m, so the roof is not drawn at all (only dashed, if shown) and the walls appear at their thickness.',
    'A perspective gives the dimensions the client will see — A perspective shows proportions from one viewpoint; the sizes in it vary with distance, so nothing can be taken from it with a rule.'
  ],
  formulas: [
    {
      name: 'True length of a rafter',
      expr: 'L = r/cos(alpha)',
      tex: 'L = \\frac{r}{\\cos\\alpha}',
      vars: { L: { name: 'true length of the slope', q: 'length', unit: 'm' }, r: { name: 'horizontal run', q: 'length', unit: 'm', value: 3.5 }, alpha: { name: 'pitch', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\alpha' } },
      note: 'Read in a section square to the ridge. For 30° the slope is 1.155 times its run.'
    },
    {
      name: 'Rise of a pitched roof',
      expr: 'h = r*tan(alpha)',
      tex: 'h = r\\tan\\alpha',
      vars: { h: { name: 'rise (height of the ridge above the eaves line)', q: 'length', unit: 'm' }, r: { name: 'horizontal run', q: 'length', unit: 'm', value: 3.5 }, alpha: { name: 'pitch', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\alpha' } },
      note: 'This is all of the roof that the elevation shows.'
    },
    {
      name: 'Surface of a pitched roof',
      expr: 'A = Ap/cos(alpha)',
      tex: 'A = \\frac{A_p}{\\cos\\alpha}',
      vars: { A: { name: 'true area of the slope', q: 'area', unit: 'm²' }, Ap: { name: 'area of the slope in plan', q: 'area', unit: 'm²', value: 30.1, tex: 'A_p' }, alpha: { name: 'pitch', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\alpha' } },
      note: 'Plan area times 1.155 at 30°; 1.414 at 45°. Tiles, felt and insulation are bought by this area.'
    }
  ],
  examples: [
    {
      title: 'The small house',
      q: 'A house is 8.0 m long and 6.0 m deep with a ridge along its length at mid-depth, the roof pitched at 30° and overhanging the walls by 0.5 m at the eaves and 0.3 m at the gables. The wall plate is 2.7 m above the floor. How high is the ridge? How long is a rafter? How much tile area is on the two slopes?',
      steps: [
        { text: 'The run from the outside of the wall to the ridge is 3.0 m, and the roof underside passes through the top outer corner of the wall:', tex: 'h_{\\text{ridge}} = 2.7 + 3.0\\tan 30° = 4.43\\ \\text{m}' },
        { text: 'The eaves overhang adds 0.5 m of run, so the roof edge is lower by 0.5 tan 30° = 0.29 m, at 2.41 m. The rafter runs from the edge to the ridge, 3.5 m of run:', tex: 'L = \\frac{3.5}{\\cos 30°} = 4.04\\ \\text{m}' },
        'The length of each slope with the gable overhang is 8.0 + 2 × 0.3 = 8.6 m, so one slope has the plan area 8.6 × 3.5 = 30.1 m² and the true area 30.1 ÷ cos 30° = 34.8 m².'
      ],
      a: 'Ridge 4.43 m above the floor, rafter 4.04 m, two slopes together 69.5 m² of roof.'
    },
    {
      title: 'Fitting a facade on a sheet',
      q: 'The street facade of a building is 24 m long. A sheet of 420 mm usable width is to carry it. Which standard scale? How wide is a window 1.8 m wide on that drawing?',
      steps: [
        'Scale needed: 420 mm for 24 m is 24 000 ÷ 420 = 57; the smallest standard reduction that makes the drawing no larger than the sheet is the next larger denominator, 1:100.',
        'At 1:100 the facade is 240 mm long on the sheet and the window 18 mm wide.'
      ],
      a: 'Scale 1:100; the facade is 240 mm long and the window 18 mm wide.'
    }
  ],
  quiz: [
    { q: 'Which drawing shows the true pitch of a roof whose ridge runs along the length of the house?', choices: ['The plan', 'The front elevation', 'A section across the house', 'A section along the ridge'], a: 2, why: 'Only a vertical plane square to the ridge contains the line of steepest slope; in the plan the slope is shortened by cos of the pitch, in the front elevation only the rise appears.' },
    { q: 'A roof slope has a plan area of 40 m² and a pitch of 45°. How many square metres of tile are needed for it (ignore waste)?', answer: 56.6, unit: 'm²', why: '40 ÷ cos 45° = 40 × 1.414 = 56.6 m².' },
    { q: 'A plan of a house shows the roof outline as a solid line.', a: false, why: 'A plan is a horizontal section cut about 1 m above the floor; what lies above the cut, such as a roof overhang, is shown dashed if at all.' },
    { q: 'At 1:50 a wall 6.30 m long is drawn how long, in millimetres?', answer: 126, unit: 'mm', why: '6300 mm ÷ 50 = 126 mm.' },
    { q: 'Why does a client get a perspective as well as the builder\'s drawings?', choices: ['the builder\'s drawings are not to scale', 'a perspective can be measured more accurately', 'the orthographic views are hard for a non-specialist to picture as a whole', 'standards require it'], a: 2, why: 'Plans and elevations are exact but each shows one face; a perspective or axonometric shows the whole as the eye would, at the cost of measurability.' }
  ],
  applications: [
    'Building permits and construction documents: the plan, the four elevations and the sections that cut every staircase and every change of roof are the minimum set, drawn to ISO 7519 or the national equivalent.',
    'Quantity surveying: wall lengths, openings and roof areas are taken off the plan and sections to price the work, with the 1/cos α factor for sloping surfaces.',
    'Setting out on site: the surveyor transfers the plan, with its grid lines and levels, to pegs and profiles in the ground, so the drawing must be dimensioned from the same grid.',
    'Presentation and planning applications: the same plan is rendered as a worm\'s-eye axonometric or a two-point perspective, keeping the sizes of the plan in one and showing the street view in the other.'
  ],
  history: 'Vitruvius (first century BC) named three kinds of drawing for a building, the *ichnographia* (plan), *orthographia* (elevation) and *scaenographia* (a drawing with receding lines, the perspective). A letter to Pope Leo X of about 1519, attributed to Raphael and Baldassare Castiglione, asks for the antiquities of Rome to be recorded in plan, elevation and section, because those can be measured. The section as a standard drawing is largely a sixteenth-century invention (Palladio\'s *Quattro libri*, 1570). Auguste Choisy used the worm\'s-eye axonometric in his *Histoire de l\'architecture* (1899) to show the structure of whole buildings from below.',
  sources: ['ISO 7519, Technical drawings — Construction drawings — General principles of presentation for general arrangement and assembly drawings.', 'Francis D. K. Ching, *Architectural Graphics* (any edition), chapters on orthographic drawing and sections.', 'Vitruvius, *De architectura*, I.2 (the three kinds of drawing).', 'ISO 128-30, Basic conventions for views, and ISO 128-40, Basic conventions for cuts and sections.'],
  construction: 'db-house-set'
},

{
  id: 'technical-illustration',
  parent: 'drawing-and-building',
  title: 'Technical illustration',
  level: 2,
  short: 'Pictures that show what a thing is and how it goes together, for readers who have not learnt to combine three views: isometric or dimetric pictures in which parts keep their size wherever they are, exploded along their assembly axes, with numbered balloons.',
  keywords: ['technical illustration', 'exploded view', 'isometric', 'dimetric', 'cutaway', 'balloon', 'assembly instructions', 'parts catalogue', 'S1000D', 'ISO 6433', 'pictorial'],
  prereq: ['isometric-projection', 'exploded-and-cutaway', 'dimetric-projection'],
  related: ['patent-and-assembly-drawings', 'engineering-drawings', 'cabinet-projection', 'axonometric-scales', 'isometric-circles'],
  body: `An engineering drawing says *how big, to what tolerance*. A technical illustration says *what it is and how it goes together*, to a reader (a fitter, an owner, a buyer) who has never learnt to put three views together in the head. It therefore shows several faces at once, and it is made by a few simple rules.

### Why a parallel projection
The classical choice is a parallel pictorial: [[isometric-projection|isometric]], [[dimetric-projection|dimetric]], or an oblique view ([[cabinet-projection]]). With parallel projectors a part has the same size wherever it lies on the page, and that is exactly what an **exploded view** needs: parts pulled apart along an axis must not grow or shrink as they separate. Edges parallel to an axis share one scale, so the artwork can be built on a grid or traced from a CAD model. Perspective is kept for advertising and for cutaway views of whole machines, where realism matters more than measuring.

### Which parallel projection
Isometric is the easiest to construct: three axes at 120° on the paper, one scale, a circle in any face drawn as the same ellipse turned ([[isometric-circles]]). Its weakness is coincidence: edges along the line of sight collapse to points and an object can read as its own mirror image. A dimetric (the axes at about 7° and 41°) or trimetric position cures it at the price of unequal scales ([[axonometric-scales]]); cabinet keeps the front face true, good for a machine seen mainly from the front. Choose the view that shows the faces where the fasteners are.

### The rules of an exploded view
- Parts keep their orientation and move **along the axes they assemble on**, drawn as thin chain lines.
- The order down the axis is the order of assembly; the gaps are about one to one and a half part-thicknesses.
- No part hides another: in isometric, two parts stacked on a vertical axis with half-sides $a_1$ and $a_2$ need a gap greater than $a_1 + a_2$, because the vertical half-extent of the isometric square equals its half-side.
- Each part carries a **balloon**, a numbered circle outside the drawing joined by a thin leader that ends in a dot on the part (ISO 6433); the numbers refer to a parts list.

### Line, tone, detail
Silhouettes are drawn heavier than inner edges; hidden edges are simply left out, because the picture shows only what is seen. Shading is by fine hatching or flat tone, with the light from the upper left. In aviation and defence the pictures are vector art with hot spots linked to the parts data (S1000D).

> [!note] The construction below builds the pictured stack: the isometric axes at 30°, the levels laid off along the vertical axis, the isometric squares and the four-centre ellipses. In the simulation you can pull it apart and change the projection.`,
  ideas: [
    'A technical illustration is for a reader who cannot combine views: it shows several faces at once and answers "what is it, how does it go together?".',
    'Parallel projection keeps the size of a part constant as it moves, which is what an exploded view needs; perspective is used where realism outweighs measuring.',
    'In an exploded view the parts keep their orientation, move along the assembly axes in the order of assembly, and never hide one another.',
    'Balloons with leaders ending in dots link each part to the parts list; the leaders never cross.'
  ],
  pitfalls: [
    'An isometric picture is a perspective with the vanishing points far away — Isometric has no vanishing points at all; its parallels are exactly parallel. A distant perspective is close to it but not the same.',
    'Rotating each part slightly shows more of it in an exploded view — Parts must keep the orientation they have in the assembly; the reader matches mating features by their direction.',
    'Isometric is always the best choice — Its three equal axes make features coincide (the far bottom corner of a cube lies behind the near top corner); a dimetric or trimetric angle often shows the important face better.'
  ],
  formulas: [
    {
      name: 'Height of an isometric drawing',
      expr: 'Hp = (a + b)/2 + c',
      tex: 'H_p = \\frac{a + b}{2} + c',
      vars: { Hp: { name: 'height of the picture (full-size isometric drawing)', q: 'length', unit: 'mm' }, a: { name: 'length of the part along the x axis', q: 'length', unit: 'mm', value: 60 }, b: { name: 'length of the part along the z axis', q: 'length', unit: 'mm', value: 60 }, c: { name: 'height of the part', q: 'length', unit: 'mm', value: 12 } },
      note: 'The two horizontal edges run up at 30° and contribute (a + b) sin 30°; the vertical edge adds its full length. A true projection is 0.8165 of this.'
    },
    {
      name: 'Width of an isometric drawing',
      expr: 'Wp = (a + b)*sqrt(3)/2',
      tex: 'W_p = (a + b)\\,\\frac{\\sqrt 3}{2}',
      vars: { Wp: { name: 'width of the picture', q: 'length', unit: 'mm' }, a: { name: 'length along x', q: 'length', unit: 'mm', value: 60 }, b: { name: 'length along z', q: 'length', unit: 'mm', value: 60 } },
      note: '(a + b) cos 30°: the two receding edges lie on either side of the vertical through the nearest corner.'
    },
    {
      name: 'Smallest gap in a stacked isometric explosion',
      expr: 'g = a1 + a2',
      tex: 'g_{\\min} = a_1 + a_2',
      vars: { g: { name: 'gap between the parts along the axis', q: 'length', unit: 'mm', tex: 'g_{\\min}' }, a1: { name: 'half-side of the lower part', q: 'length', unit: 'mm', value: 30, tex: 'a_1' }, a2: { name: 'half-side of the upper part', q: 'length', unit: 'mm', value: 22, tex: 'a_2' } },
      note: 'The top face of the lower part reaches a1 above its centre; the bottom face of the upper part reaches a2 below its centre; the gap must exceed the sum (for a round part use 0.707 × its radius).'
    }
  ],
  examples: [
    {
      title: 'Fitting the exploded stack on the page',
      q: 'The three parts of the construction below (a base plate 60 × 60 × 12, a ring Ø40 × 18, a cover plate 44 × 44 × 8) are drawn in isometric at full size with gaps of 50 along the axis. The picture must fit a space 100 mm high. Which scale? How wide is the picture?',
      steps: [
        'Heights along the axis: the base occupies 0 to 12, the ring 62 to 80, the cover 130 to 138. Add the half-sides: the near bottom corner of the base is 30 below its centre line, the far top corner of the cover is 22 above its top: the picture is $138 + 30 + 22 = 190$ high.',
        { text: 'Width: that of the base, the widest part:', tex: 'W_p = (60 + 60)\\,\\tfrac{\\sqrt 3}{2} = 103.9\\ \\text{mm}' },
        'Scale to 100 mm: $100 / 190 = 0.53$; the next standard scale below is 1:2, and the picture is 95 mm high and 52 mm wide.',
        { text: 'Check the gaps:', tex: 'g_{\\min} = 30 + 14.1 = 44 < 50 \\text{ (base, ring)},\\qquad 14.1 + 22 = 36 < 50 \\text{ (ring, cover)}' }
      ],
      a: 'Scale 1:2; the picture is 95 mm high and 52 mm wide, and the gaps of 50 are large enough for nothing to be hidden.'
    },
    {
      title: 'Drawing and projection',
      q: 'A cube of 40 mm edge is drawn in isometric. Give the height and width of the picture as a full-size isometric drawing, and as a true projection.',
      steps: [
        { text: 'As a drawing:', tex: 'H_p = \\frac{40 + 40}{2} + 40 = 80\\ \\text{mm},\\qquad W_p = 80\\,\\tfrac{\\sqrt 3}{2} = 69.3\\ \\text{mm}' },
        'A true projection is smaller by $\\sqrt{2/3} = 0.8165$: 65.3 mm high, 56.6 mm wide.'
      ],
      a: 'Drawing 80 × 69.3 mm; projection 65.3 × 56.6 mm; the shape is the same.'
    }
  ],
  quiz: [
    { q: 'Why is a parallel projection preferred for an exploded view?', choices: ['it is cheaper to print', 'parts keep their size as they move apart', 'it shows more perspective depth', 'standards forbid perspective'], a: 1, why: 'In perspective a part would shrink as it moves away along the axis; in a parallel projection it does not, and mating parts can be compared directly.' },
    { q: 'What is the width in millimetres of the full-size isometric drawing of a plate 60 × 60 × 12?', answer: 103.9, unit: 'mm', why: '(60 + 60) cos 30° = 103.9 mm.' },
    { q: 'In an exploded view, each part should be turned slightly as it is drawn so that its other faces show.', a: false, why: 'Parts must keep their assembled orientation; the reader recognises mating features by their direction.' },
    { q: 'Two square plates, half-sides 30 and 22, are stacked on a vertical axis in an isometric explosion. What is the smallest gap that keeps them from overlapping in the picture, in millimetres?', answer: 52, unit: 'mm', why: 'The vertical half-extent of an isometric square equals its half-side, so the gap must exceed 30 + 22.' },
    { q: 'Which is a rule for balloons?', choices: ['leaders should cross to show the order of assembly', 'the numbers go inside the drawing, on the parts', 'the leader ends in a dot on the part and the balloon stays outside the drawing', 'every part needs its own balloon in each view only if it is cut'], a: 2, why: 'The numbered circle stands clear of the drawing; its thin leader ends in a dot on the part; leaders never cross.' }
  ],
  applications: [
    'Assembly instructions and maintenance manuals (aviation S1000D, ATA iSpec 2200, flat-pack furniture): exploded isometric or dimetric views with numbered call-outs show the order of assembly to a reader without drawing training.',
    'Illustrated parts catalogues: each balloon number links a picture to a part number and an order code; parts keep their size so that the picture can be compared with the part in the hand.',
    'Product marketing and owner\'s manuals: cutaway views, often in perspective, show how a machine works inside; realism matters more than measurability.',
    'Training and safety material, where an isometric picture of an installation or a piping run lets the reader see which valve is which without learning to read plan and elevation together.'
  ],
  history: 'Exploded drawings are old. Leonardo da Vinci drew machine elements separated along their axes (Codex Atlanticus, c. 1480–1510); Georgius Agricola\'s *De re metallica* (1556) and Agostino Ramelli\'s *Le diverse et artificiose machine* (1588) used cutaways and exploded parts to teach mining and machinery. The isometric projection was set out by William Farish in 1822, and isometric and dimetric pictorials, drawn with the 30°–60° set square, became the standard of the technical manual in the twentieth century. Digital illustration now derives the views from the CAD model.',
  sources: ['ISO 5456-3, Technical drawings — Projection methods — Part 3: Axonometric representations; ISO 6433, Item references.', 'S1000D, International specification for technical publications using a common source database.', 'Eugene S. Ferguson, *Engineering and the Mind\'s Eye* (1992), on the history of exploded and cutaway drawings.', 'Giesecke et al., *Technical Drawing with Engineering Graphics*, the chapter on pictorial drawing.'],
  sim: 'db-explode',
  construction: 'db-exploded-assembly'
},

{
  id: 'patent-and-assembly-drawings',
  parent: 'drawing-and-building',
  title: 'Patent and assembly drawings',
  level: 2,
  short: 'A patent figure must let a stranger understand and build the invention, so it is a plain black line drawing in any projection that shows the parts and their relations, every part carrying one numeral joined by a lead line; an assembly drawing adds sections, hatching rules and a parts list so that the shop can put the parts together.',
  keywords: ['patent drawing', 'reference numeral', 'lead line', 'assembly drawing', 'hatching', 'balloon', 'parts list', '37 CFR 1.84', 'Rule 46 EPC', 'design patent', 'ISO 6433', 'item list'],
  prereq: ['third-angle-projection', 'section-views', 'exploded-and-cutaway'],
  related: ['technical-illustration', 'engineering-drawings', 'isometric-projection', 'line-conventions'],
  body: `Two kinds of sheet answer the question "what does it consist of?". The **patent drawing** has to show an invention so completely that a skilled person could build it, and so exactly that a court can decide whether a rival's device falls inside the claims. The **assembly drawing** shows how the parts of a product fit in the shop. Both use a numbered-parts language.

### What a patent office asks for
Patent drawings (37 CFR 1.84 in the United States, Rule 46 of the European Patent Convention, Rule 11 of the PCT regulations) are black line drawings: no colour and no tone but line shading, the lines heavy and equally black, no frames round the figure, the views numbered FIG. 1, FIG. 2 and so on. The sheet is A4 or letter with a usable area of 17 × 26.2 cm (margins about 25 mm at top and left, 15 mm at the right, 10 mm at the bottom). Reference numerals, letters and digits are at least **3.2 mm high**, and each part has one numeral, **the same in every view**, joined to it by a thin curved lead line that ends in a dot on the part, or in an arrow if it names the whole. Numerals are never put inside hatched areas without a gap; lead lines never cross.

### Which projection and why
The law does not choose a projection; it asks for clarity. In practice two kinds of view are combined: a perspective or isometric view, which lets the examiner recognise the thing, and orthographic or section views, which show how parts relate. An exploded view shows the assembly. Dimensions are not written on the drawing: a patent protects a principle, not a size, and claims are read against the proportions of the figure. Designs (appearance only) need the opposite: enough views, normally a perspective and all six orthographic faces, to define the shape completely, drawn so that no surface is left to the imagination.

### The assembly drawing
In the factory the assembly drawing shows the parts in their working position, in section where something must be seen inside. ISO 128-40 and 128-50 set the hatching rules: **adjoining parts are hatched in different directions or at different spacing; the same part is hatched the same way in every view; solid parts such as shafts, bolts, pins, keys and ribs are not hatched when the plane passes through their axis.** Each part is called out by a balloon with an item number (ISO 6433), listed in a parts list with its name, quantity and material (ISO 7573).

### What goes wrong
Two parts with one numeral, or one part with two, make the claims ambiguous. A lead line that crosses an edge reads as part of the object. Numerals smaller than the rule are lost when the sheet is reduced for printing, which is why they are specified for the original. A claim that mentions a feature that no figure shows is open to objection.

> [!note] The construction below is a patent-style figure of the bracket: an isometric view and a plan, with the numerals and lead lines placed one step at a time. The reduction rule determines how big to draw the digits.`,
  ideas: [
    'A patent figure is a black line drawing in whatever projection explains the invention; each part has one numeral, the same in every view, joined by a lead line that ends in a dot.',
    'Numerals must be at least 3.2 mm high on the original so they survive reduction; margins and the usable area (17 × 26.2 cm) are fixed.',
    'Assembly drawings show parts in working position; adjoining parts are hatched differently, the same part always the same, and shafts, bolts and pins cut lengthwise are left unhatched.',
    'No dimensions on a patent figure: the proportions in the drawing and the words of the claims carry the invention.'
  ],
  pitfalls: [
    'A patent drawing must be to scale — It must be proportionate and clear, but it states no scale, and it is the claims that define the invention. Do not measure a patent figure.',
    'The same hatching can be used on all the parts of a section — Adjoining parts must be distinguished by the direction or the spacing of the hatching; otherwise the reader cannot tell where one part ends and the next begins.',
    'A bolt in a section is hatched like everything else — Not when the cutting plane passes through its axis: solid parts such as bolts, shafts, pins and ribs are shown uncut so they do not look like part of the housing.'
  ],
  formulas: [
    {
      name: 'Usable width of the sheet',
      expr: 'Wu = Ws - ml - mr',
      tex: 'W_u = W_s - m_l - m_r',
      vars: { Wu: { name: 'usable width', q: 'length', unit: 'mm' }, Ws: { name: 'sheet width', q: 'length', unit: 'mm', value: 210, tex: 'W_s' }, ml: { name: 'left margin', q: 'length', unit: 'mm', value: 25, tex: 'm_l' }, mr: { name: 'right margin', q: 'length', unit: 'mm', value: 15, tex: 'm_r' } },
      note: 'On A4 the margins of EPC Rule 46 leave 170 mm across and (297 − 25 − 10) = 262 mm up.'
    },
    {
      name: 'Reduction of a figure',
      expr: 'k = Wu/Wo',
      tex: 'k = \\frac{W_u}{W_o}',
      vars: { k: { name: 'reduction factor' }, Wu: { name: 'usable width', q: 'length', unit: 'mm', value: 170, tex: 'W_u' }, Wo: { name: 'width of the original drawing', q: 'length', unit: 'mm', value: 400, tex: 'W_o' } },
      note: 'A figure drawn larger than the sheet is photographically reduced by this factor; everything on it, lines and digits, shrinks with it.'
    },
    {
      name: 'Height of the numerals on the original',
      expr: 'hn = hmin/k',
      tex: 'h_n = \\frac{h_{\\min}}{k}',
      vars: { hn: { name: 'height of the numerals on the original', q: 'length', unit: 'mm' }, hmin: { name: 'smallest legible height after reduction', q: 'length', unit: 'mm', value: 3.2, tex: 'h_{\\min}' }, k: { name: 'reduction factor', value: 0.425 } },
      note: 'The rule is 3.2 mm on the sheet that is filed; if the original is to be reduced, the digits must be larger by 1/k.'
    }
  ],
  examples: [
    {
      title: 'Drawing large, filing small',
      q: 'A mechanism is drawn on an oversize sheet so that the original is 400 mm wide. It will be reduced to fit the 170 mm usable width of an A4 sheet. How high must the numerals be on the original, and what is the thinnest line that survives if the smallest line on the printed sheet must be 0.15 mm?',
      steps: [
        { text: 'Reduction factor:', tex: 'k = \\frac{170}{400} = 0.425' },
        { text: 'Numerals, so that they are still 3.2 mm high when filed:', tex: 'h_n = \\frac{3.2}{0.425} = 7.5\\ \\text{mm}' },
        { text: 'Lines:', tex: '\\frac{0.15}{0.425} = 0.35\\ \\text{mm}' }
      ],
      a: 'Numerals 7.5 mm high and no line thinner than 0.35 mm on the original.'
    }
  ],
  quiz: [
    { q: 'The reference numerals on a patent figure must be at least', answer: 3.2, unit: 'mm', why: 'Rule 46 EPC and 37 CFR 1.84 both give 3.2 mm (1/8 inch) as the minimum height, measured on the original.' },
    { q: 'The same numeral may name two different parts if they appear in different figures.', a: false, why: 'A numeral belongs to one part everywhere; two parts with one numeral would make the claims ambiguous.' },
    { q: 'In a sectioned assembly, a bolt whose axis lies in the cutting plane is', choices: ['hatched at 45° like the housing', 'hatched at 90°', 'left unhatched', 'drawn dashed'], a: 2, why: 'Solid parts cut along their axis (bolts, shafts, pins, keys, ribs) are not hatched, so they do not look like part of what surrounds them.' },
    { q: 'Two adjoining parts in a section must be', choices: ['hatched in the same direction and spacing', 'hatched in different directions or at different spacings', 'left blank', 'shaded grey'], a: 1, why: 'Different hatching shows where one part ends and the next begins (ISO 128-50).' },
    { q: 'An original drawing 340 mm wide is reduced to 170 mm. How high, in millimetres, must the numerals be on the original to be 3.2 mm when filed?', answer: 6.4, unit: 'mm', why: 'The reduction factor is 0.5, so 3.2 ÷ 0.5 = 6.4 mm.' }
  ],
  applications: [
    'Patent applications and design registrations in every office that follows the PCT and EPC rules; the same figure is usually accepted by all if it obeys the common 3.2 mm, black-line, margin rules.',
    'Litigation: claim charts compare the numbered parts of the patent figure with the parts of the accused device, so one numeral per part is the key to a readable argument.',
    'Machine shops and assembly lines: the assembly drawing and its balloons tell the fitter the order, the fasteners and the torque notes, and the hatching tells the inspector which parts touch.',
    'Technical files for certification and spare-parts catalogues, where the numbered exploded view must match the parts list line for line.'
  ],
  history: 'Patent offices first accepted drawings as part of a grant in the early nineteenth century; in the United States the 1836 Patent Act made them routine, and until 1880 most applications also had to include a working model. The Patent Cooperation Treaty (1970) and the European Patent Convention (signed 1973, in force 1977) later aligned the rules, which is why one figure usually satisfies several offices. The hatching and item-reference conventions of the assembly drawing come from the drawing-office standards (the ISO 128 series and ISO 6433) developed in the twentieth century.',
  sources: ['37 CFR 1.84, Standards for drawings (United States); European Patent Convention, Implementing Regulations, Rule 46; PCT Regulations, Rule 11 and the Administrative Instructions.', 'ISO 128-40 and 128-50, Basic conventions for cuts and sections, and for areas on cuts and sections; ISO 6433, Item references; ISO 7573, Item lists.', 'Giesecke et al., *Technical Drawing with Engineering Graphics*, the chapters on assembly and working drawings.'],
  construction: 'db-patent-figure'
},

{
  id: 'surveying-and-site-plans',
  parent: 'drawing-and-building',
  title: 'Surveying and site plans',
  level: 2,
  short: 'The ground is drawn by orthographic projection onto a horizontal datum, with heights kept as numbers and contour lines: lengths are reduced to the horizontal, a closed traverse is plotted from bearings and distances, its closing error is shared out, and contours turn spot heights into slopes and profiles.',
  keywords: ['surveying', 'traverse', 'bearing', 'closing error', 'compass rule', 'Bowditch', 'contour', 'spot height', 'site plan', 'profile', 'horizontal distance', 'curvature of the earth', 'plan scale'],
  prereq: ['orthographic-projection', 'true-length-and-true-shape', 'first-angle-projection'],
  related: ['architectural-drawings', 'surveys-and-national-grids', 'transverse-mercator-and-utm', 'charts-and-navigation', 'monge-method'],
  body: `Surveying turns the ground into a drawing. The instrument measures angles and distances; the client needs a plan from which areas can be calculated, boundaries set out and earthworks estimated. The projection is orthographic onto a horizontal datum surface, with the third dimension kept as **numbers**: spot heights, and contour lines.

### Why a plan
Land is bought, taxed and built on in horizontal measure: the plot of 400 m², the boundary 12.00 m from the road. Project every point straight down onto a level surface and a slope of any steepness is replaced by its horizontal distance. A tape laid on a slope, or a slope distance from an electronic instrument, is reduced by $D_h = D_s\\cos\\alpha$, where $\\alpha$ is the angle of the slope. Heights are measured separately, by levelling from a datum, and written beside the points or drawn as contours. This is the old projection with elevations (*projection cotée*) of the military engineers, which Monge placed at the root of descriptive geometry ([[monge-method]]).

### The traverse
A traverse is a chain of stations walked round the site. At each station the angle to the next is read and the distance taped. The plan is plotted leg by leg from the **bearing** (clockwise from north) and the length: with protractor and scale on paper, or as coordinates $\\Delta E = d\\sin\\beta$, $\\Delta N = d\\cos\\beta$. A closed traverse must return to its start; the gap is the **closing error** $e$, and the **relative accuracy** is $P / e$, the perimeter over the gap: 1 in 5000 is a common requirement for property surveys, 1 in 200 or 300 is a compass-and-tape traverse. The error is shared out by the **compass (Bowditch) rule**: each station is moved along the closing error by the fraction of the perimeter walked to reach it.

### Contours and profiles
A **contour** is the line where a horizontal plane at a stated height cuts the ground: a family of sections at equal intervals. Between two surveyed points the ground is taken to slope evenly, so the point where a contour crosses the line joining them is found by proportion; joined smoothly, the points give the contour. The slope is the interval over the horizontal spacing: contours 1 m apart and 14 m apart on the ground mean a slope of 1 in 14, 7 %. The **profile** along a section line is drawn by carrying each crossing down, setting it at its height with the vertical scale enlarged (here ten times), and joining the points.

### How big can a plane be?
A plane is only an approximation to a level surface. The difference grows with the square of the distance: $c = d^2/2R$, 8 mm at 1 km and 7.85 m at 10 km, which is why levelling corrects for curvature (and refraction) while horizontal plans of a few kilometres need none. For large areas the survey is reduced to a national grid ([[surveys-and-national-grids]], [[transverse-mercator-and-utm]]).

> [!note] The two constructions below plot a pentagon traverse with its closing error and adjustment, and draw contours from spot heights on a 20 m grid with a profile cut across the hill.`,
  ideas: [
    'A plan is an orthographic projection on a horizontal datum: distances are reduced to horizontal (D cos α) and heights are carried as numbers and contours.',
    'A traverse is plotted from bearings and distances; it ought to close, and the closing error over the perimeter measures its quality (relative accuracy 1 in P ÷ e).',
    'The compass rule shares the closing error among the stations in proportion to the distance walked; it spreads the error, it cannot remove it.',
    'A contour is a horizontal section of the ground; the closer the contours, the steeper the slope (slope = interval ÷ spacing).'
  ],
  pitfalls: [
    'The area of a plot is the area on the slope — Land is measured in horizontal area; a sloping plot is larger than its plan by 1/cos α, which is why the plan, not the surface, is registered.',
    'Adjusting a traverse removes the errors — The compass rule makes the figure close; each station is still in error, by an amount of the same order as the misclosure, and a traverse can close well while its stations are off. Only better measurements reduce the errors.',
    'Contour lines may cross where the slope is steep — Contours of different heights never cross; they merge only on a vertical cliff, and meet in a point only at a top or a hollow.'
  ],
  formulas: [
    {
      name: 'Horizontal distance from a slope distance',
      expr: 'Dh = Ds*cos(alpha)',
      tex: 'D_h = D_s\\cos\\alpha',
      vars: { Dh: { name: 'horizontal distance', q: 'length', unit: 'm', tex: 'D_h' }, Ds: { name: 'slope distance', q: 'length', unit: 'm', value: 85, tex: 'D_s' }, alpha: { name: 'slope angle', q: 'angle', unit: '°', value: 12, min: 0, max: 89, tex: '\\alpha' } },
      note: 'Equivalently $\\sqrt{D_s^2 - \\Delta h^2}$ when the height difference is known.'
    },
    {
      name: 'Relative accuracy of a traverse',
      expr: 'N = P/er',
      tex: 'N = \\frac{P}{e}',
      vars: { N: { name: 'relative accuracy, 1 in N' }, P: { name: 'perimeter of the traverse', q: 'length', unit: 'm', value: 512.1 }, er: { name: 'closing error', q: 'length', unit: 'm', value: 2.09, tex: 'e' } },
      note: 'The example of the construction: 512.1 m round, 2.09 m short: about 1 in 245.'
    },
    {
      name: 'Curvature of the earth',
      expr: 'c = d^2/(2*R)',
      tex: 'c = \\frac{d^2}{2R_\\oplus}',
      vars: { c: { name: 'drop of the level surface below the tangent plane', q: 'length', unit: 'm' }, d: { name: 'distance', q: 'length', unit: 'km', value: 10 }, R: { const: 'Rearth' } },
      note: 'Over 1 km it is 78 mm; over 10 km 7.85 m. Atmospheric refraction reduces the apparent effect on a sight line by about one seventh.'
    }
  ],
  examples: [
    {
      title: 'The pentagon traverse',
      q: 'A traverse A–B–C–D–E–A has the legs AB 74.5° 116.2 m, BC 150.0° 90.6 m, CD 226.0° 102.4 m, DE 286.0° 113.6 m, EA 15.5° 89.3 m. Plotted from A, the last leg ends 1.72 m west and 1.18 m south of A. What is the closing error and the relative accuracy, and how far does the compass rule move B and E?',
      steps: [
        { text: 'The perimeter is 512.1 m and the closing error', tex: 'e = \\sqrt{1.72^2 + 1.18^2} = 2.09\\ \\text{m},\\qquad N = \\frac{512.1}{2.09} \\approx 245' },
        'The share of the error that each station takes is the fraction of the perimeter already walked: B 116.2 ÷ 512.1 = 0.227; E 422.8 ÷ 512.1 = 0.826.',
        { text: 'So B is moved 0.227 × 2.09 = 0.47 m and E is moved 0.826 × 2.09 = 1.72 m, along the line from A′ to A (towards the north-east).', tex: '(\\Delta E, \\Delta N)_B = 0.227\\,(1.72, 1.18) = (0.39,\\,0.27)\\ \\text{m}' },
        'After the adjustment the pentagon closes and encloses 17 506 m² (1.75 ha), computed from the adjusted coordinates by the shoelace formula.'
      ],
      a: 'Closing error 2.09 m, about 1 in 245; B moves 0.47 m and E 1.72 m towards A; the area is 1.75 ha.'
    },
    {
      title: 'Reading a slope from contours',
      q: 'On a plan at 1:1000 with contours every 1 m, two neighbouring contours are 14 mm apart. What is the slope, in per cent and in degrees?',
      steps: [
        '14 mm on the plan is 14 m on the ground.',
        { text: 'Slope:', tex: '\\tan\\alpha = \\frac{1}{14} = 0.0714\\ (7.1\\ \\%),\\qquad \\alpha = 4.1°' }
      ],
      a: 'A slope of 1 in 14, 7.1 %, which is 4.1°.'
    }
  ],
  quiz: [
    { q: 'A slope distance of 85.00 m is measured on a slope of 12°. The horizontal distance in metres is', answer: 83.14, unit: 'm', why: '85 cos 12° = 85 × 0.9781 = 83.14 m.' },
    { q: 'A closed traverse of perimeter 700 m misses its starting point by 0.35 m. Its relative accuracy is 1 in', answer: 2000, why: '700 ÷ 0.35 = 2000.' },
    { q: 'The compass (Bowditch) rule distributes the closing error', choices: ['equally among all stations', 'in proportion to the distance walked to reach each station', 'only to the last station', 'in proportion to the angle at each station'], a: 1, why: 'The longer the walk to a station, the more error it has collected, so it takes a proportionally larger correction.' },
    { q: 'Two contour lines of different heights can cross on a map of natural ground.', a: false, why: 'A contour is the section of the ground by a horizontal plane; two different planes never meet. On a vertical cliff they merge into one line.' },
    { q: 'By how many metres does the level surface of the earth fall below a horizontal plane at a distance of 2 km?', answer: 0.31, unit: 'm', why: 'c = d²/2R = 2000² ÷ (2 × 6 371 000) = 0.314 m.' }
  ],
  applications: [
    'Cadastral surveys: boundaries and areas are fixed in horizontal measure on a plan, with the closing error of the boundary traverse required to meet a stated relative accuracy.',
    'Setting out a building or a road: the plan\'s coordinates are transferred to pegs on the ground, with the heights from the contour plan or from levels.',
    'Earthworks: profiles and cross-sections cut from the contour plan give the areas of cut and fill, whose sum times the spacing is the volume to move.',
    'Hydrographic and mining surveys, where depths and levels are noted as numbers on a plan and drawn as contours of the sea floor or of a seam.'
  ],
  history: 'The Egyptian *harpedonaptai* (rope-stretchers) and the Roman *agrimensores* with their *groma* set out fields and cities with right angles and straight lines. Gunter\'s chain (1620, 22 yards, 100 links) fixed the land survey of Britain; Jesse Ramsden\'s great theodolite of 1787, used for the link between the Greenwich and Paris observatories, made precise angles routine. Contour lines first appeared in the eighteenth century: Nicolaas Cruquius drew the depths of the river Merwede as lines of equal depth in 1728, Philippe Buache did the same for the English Channel in 1737, and Jean-Louis Dupain-Triel used them for the land surface of France in 1791.',
  sources: ['W. Schofield and M. Breach, *Engineering Surveying* (any edition), chapters on traversing, adjustment and contouring.', 'Charles D. Ghilani and Paul R. Wolf, *Elementary Surveying*, the chapters on traverse computation and adjustment.', 'ISO 17123 (series), Optics and optical instruments — Field procedures for testing geodetic and surveying instruments.'],
  construction: ['db-traverse', 'db-contours'],
  sim: 'db-traverse-closure'
},

{
  id: 'sheet-metal-and-developments',
  parent: 'drawing-and-building',
  title: 'Sheet metal, pipes and developments',
  level: 2,
  short: 'A flat sheet is all a shear or a laser can cut, so a duct, a hopper or a pipe elbow is made from its development: the flat pattern that rolls into the surface without stretching. Cylinders unroll by their elements, cones by sectors, and every length on the pattern is found from true lengths in orthographic views.',
  keywords: ['development', 'sheet metal', 'pattern', 'elbow', 'mitre', 'cone', 'sector', 'stretch-out line', 'parallel-line development', 'radial-line development', 'bend allowance', 'K-factor', 'transition piece'],
  prereq: ['developments', 'true-length-by-rotation', 'intersections-of-solids'],
  related: ['auxiliary-views', 'engineering-drawings', 'why-the-sphere-cannot-be-flattened', 'developable-surfaces', 'technical-illustration'],
  body: `The tools of a sheet-metal shop (shear, press brake, rolls, laser) all act on flat plate, and anything that is to be made of it must first be flattened on paper. The flat shape that bends or rolls into a given surface without stretching or tearing is its **development** or pattern ([[developments]]). Only surfaces made of straight lines whose tangent plane does not turn along each line can be developed: prisms, pyramids, cylinders and cones ([[developable-surfaces]]). A sphere cannot, and the same fact is behind the failure of every flat map of the globe ([[why-the-sphere-cannot-be-flattened]]).

### What the drawing has to supply
A development is made of **true lengths** and **true shapes**. An orthographic view gives them directly for any line or face parallel to the picture plane; for others the draughtsman finds them by rotation ([[true-length-by-rotation]]) or by an auxiliary view ([[auxiliary-views]]). The intersection where two surfaces meet, the mitre of an elbow or the saddle of a branch pipe, comes from the intersection of solids ([[intersections-of-solids]]).

### Parallel-line development: cylinders and prisms
All the elements of a cylinder are parallel and equally long where the cut is square to the axis. Roll it out and the rim becomes a straight **stretch-out line** of length $\\pi D$, the elements stand upright on it at equal spacings, and a cut that is slanted becomes a curve. For the two-piece elbow of a bend $\\beta$ the mitre makes the angle $\\psi = \\beta/2$ with the square cut, and the length of the element at angle $\\varphi$ round the pipe is
$$h = h_0 + \\frac{D}{2}\\tan\\psi\\,(1 - \\cos\\varphi),$$
a cosine curve whose total variation is $D\\tan\\psi$. For $90°$ that is $D$ itself.

### Radial-line development: cones and pyramids
All elements of a cone pass through the apex, so the pattern is a **sector** of a circle whose radius is the slant length $L$ and whose arc is as long as the circumference of the base, $2\\pi r$. The angle of the sector is
$$\\theta = 360°\\,\\frac{r}{L},$$
and a truncated cone is the part between two radii, $L_1$ and $L_2$. The slant length is found where it is true, in the view in which the line is parallel to the picture plane.

### Bends and allowances
A bent sheet is not a sharp fold: the metal on the outer side stretches and the inner side compresses, and a neutral surface at about a third to a half of the thickness from the inside keeps its length. The length used up in a bend of angle $\\theta$ (radians) is the **bend allowance**, $BA = \\theta\\,(R + K t)$, with the inside radius $R$, the thickness $t$ and a K-factor of 0.3 to 0.5. Flat lengths of formed parts are the sum of the straight sides and the allowances; modern CAD unfolds them automatically.

> [!tip] Stepping the chords of twelve equal divisions along the stretch-out line, or along the arc of a cone, is a classic shortcut and comes out 1 % short; use the calculated arc length $\\pi D / 12$ or the calculated sector angle.`,
  ideas: [
    'A development is the flat pattern that bends into a surface without stretching; only cylinders, cones, prisms and pyramids (developable surfaces) have one, a sphere does not.',
    'Cylinders and prisms develop by parallel elements on a stretch-out line of length πD; cones and pyramids by radial elements in a sector of angle 360° r ÷ L.',
    'The cut edge of a slanted cylinder develops into a cosine curve; a two-piece 90° elbow has a variation of exactly D between the shortest and the longest element.',
    'Every length on a pattern must be a true length, found in a view where the line is parallel to the plane, or by rotation.'
  ],
  pitfalls: [
    'The mitre edge of the pattern is an ellipse — In space the mitre is an ellipse, but the pattern is a cosine curve, because the rim has been unrolled onto a straight line.',
    'The sector angle of the cone pattern equals the apex angle of the cone — It is 360° r ÷ L, much larger: a cone with half-angle 18.4° (r/L = 0.316) develops into a sector of 114°.',
    'Stepping the chord of a twelfth round the base gives the arc — A chord is shorter than its arc (31.06 against 31.42 for r = 60); twelve of them are 1.1 % short. Calculate the arc or the angle.'
  ],
  formulas: [
    {
      name: 'Angle of the sector of a cone',
      expr: 'theta = 2*pi*r/L',
      tex: '\\theta = \\frac{2\\pi r}{L}',
      vars: { theta: { name: 'angle of the sector', q: 'angle', unit: '°', tex: '\\theta' }, r: { name: 'radius of the base', q: 'length', unit: 'mm', value: 60 }, L: { name: 'slant length (apex to base edge)', q: 'length', unit: 'mm', value: 189.7 } },
      note: 'The arc of length 2πr on a circle of radius L has the angle 2πr/L radians; r/L = sin of the cone\'s half-angle. The sector is always less than 360°.'
    },
    {
      name: 'Length of an element of a mitred cylinder',
      expr: 'h = h0 + (D/2)*tan(psi)*(1 - cos(phi))',
      tex: 'h = h_0 + \\frac{D}{2}\\tan\\psi\\,(1 - \\cos\\varphi)',
      vars: { h: { name: 'length of the element', q: 'length', unit: 'mm' }, h0: { name: 'shortest element', q: 'length', unit: 'mm', value: 30, tex: 'h_0' }, D: { name: 'pipe diameter', q: 'length', unit: 'mm', value: 80 }, psi: { name: 'mitre angle (half the bend)', q: 'angle', unit: '°', value: 45, min: 1, max: 80, tex: '\\psi' }, phi: { name: 'angle round the pipe from the short side', q: 'angle', unit: '°', value: 90, min: 0, max: 360, tex: '\\varphi' } },
      note: 'The stretch-out position of this element is s = (D/2)φ; at φ = 180° the element is longest, h0 + D tan ψ.'
    },
    {
      name: 'Bend allowance',
      expr: 'BA = theta*(R + K*t)',
      tex: '\\mathrm{BA} = \\theta\\,(R + K\\,t)',
      vars: { BA: { name: 'length of the bend on the flat blank', q: 'length', unit: 'mm' }, theta: { name: 'angle through which the sheet is bent', q: 'angle', unit: '°', value: 90, min: 1, max: 180, tex: '\\theta' }, R: { name: 'inside bend radius', q: 'length', unit: 'mm', value: 3 }, K: { name: 'K-factor (neutral surface position)', value: 0.4 }, t: { name: 'thickness of the sheet', q: 'length', unit: 'mm', value: 2 } },
      note: 'The K-factor of 0.3 to 0.5 depends on material, radius and method; it is found by trial bends or from the maker\'s tables.'
    }
  ],
  examples: [
    {
      title: 'The pattern of a cone hopper',
      q: 'A hopper is a truncated cone, Ø120 at the bottom, Ø60 at the top, 90 high. Find the pattern.',
      steps: [
        'The sides rise 90 while the radius falls 30, so the apex lies 90 × 60 ÷ 30 = 180 above the base. The slant length from the apex to the bottom edge is',
        { text: '', tex: 'L_1 = \\sqrt{180^2 + 60^2} = 189.7,\\qquad L_2 = \\tfrac12 L_1 = 94.9' },
        { text: 'The angle of the sector:', tex: '\\theta = 360°\\,\\frac{60}{189.7} = 113.8°' },
        'The pattern is the part of a sector of 113.8° lying between the radii 94.9 and 189.7. The outer arc is 189.7 × 1.987 rad = 377.0 long, the circumference of the base, and the inner arc 188.5, the circumference of the top.'
      ],
      a: 'A sector of 113.8°, radii 94.9 and 189.7; the arcs are 188.5 and 377.0 long.'
    },
    {
      title: 'The flat blank of a formed bracket',
      q: 'A 2 mm sheet is bent 90° with an inside radius of 3 mm to make an L with outside legs of 40 mm. What is the flat length of the blank? Take K = 0.4.',
      steps: [
        { text: 'The bend allowance:', tex: 'BA = \\tfrac{\\pi}{2}\\,(3 + 0.4 \\times 2) = 5.97\\ \\text{mm}' },
        'The straight part of each leg is its outside length less the outside radius (inside radius + thickness = 5): 40 − 5 = 35.',
        { text: 'Blank:', tex: '35 + 35 + 5.97 = 75.97\\ \\text{mm}' }
      ],
      a: 'A blank 76.0 mm long.'
    }
  ],
  quiz: [
    { q: 'A cone with base radius 50 mm and slant length 200 mm develops into a sector of angle', answer: 90, unit: '°', why: 'θ = 360° × r ÷ L = 360 × 50 ÷ 200 = 90°.' },
    { q: 'Which of these surfaces has a development?', choices: ['a sphere', 'a cylinder', 'a torus (a doughnut)', 'a saddle surface'], a: 1, why: 'A cylinder is made of parallel straight lines with a constant tangent plane along each; it unrolls without stretching. A sphere, torus and saddle cannot.' },
    { q: 'The cut edge of one piece of a two-piece mitre elbow, laid flat, is a straight line.', a: false, why: 'It is a cosine curve: the cylinder has been unrolled onto a straight line, while its mitre cut is an ellipse in space.' },
    { q: 'How long is the stretch-out line, in millimetres, for a pipe of diameter 80?', answer: 251.3, unit: 'mm', why: 'π × 80 = 251.3 mm.' },
    { q: 'For a two-piece 90° elbow in pipe of diameter D the difference between the longest and the shortest element of one piece is', choices: ['D / 2', 'D', '2D', 'π D'], a: 1, why: 'The mitre is at 45°, tan 45° = 1, and the variation is D tan ψ = D.' }
  ],
  applications: [
    'Heating, ventilation and air-conditioning ducting: elbows, offsets, reducers and square-to-round transition pieces are cut flat from galvanised sheet and joined in the shop or on site.',
    'Boilers, silos and pressure vessels: cones and cylinders are cut from plate, rolled and welded, with the intersections of nozzles and branches laid out from developed patterns.',
    'Pipe fabrication: branch (tee) pipes are cut with a wrap-around template or a computed profile so that the branch fits the main pipe, the saddle curve of two intersecting cylinders.',
    'Sheet-metal parts for cars, aircraft and electronics enclosures, where CAD unfolds the model with the bend allowances and the flat blank is cut by laser.'
  ],
  history: 'Albrecht Dürer printed the first nets of polyhedra, flat patterns that fold up into solids, in his *Underweysung der Messung* of 1525. Monge made the development a part of descriptive geometry, and the engineering schools of the nineteenth century taught it as the geometry of the boiler-maker, the shipwright and the tinsmith: pattern drafting became a skilled trade in the boiler works and shipyards. Today the work of laying out the pattern is done by the CAD program, but the geometry is the same.',
  sources: ['Giesecke et al., *Technical Drawing with Engineering Graphics*, the chapter on developments and intersections.', 'Erik Oberg et al., *Machinery\'s Handbook*, the sections on sheet-metal layout and bend allowances.', 'Albrecht Dürer, *Underweysung der Messung mit dem Zirckel und Richtscheyt* (1525).', 'Gaspard Monge, *Géométrie descriptive* (1799).'],
  construction: ['db-elbow-development', 'db-cone-development'],
  sim: 'db-elbow-unroll'
}
);
