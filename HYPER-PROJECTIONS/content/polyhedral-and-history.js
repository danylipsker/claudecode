/* HYPER-PROJECTIONS · content/polyhedral-and-history.js
 *
 * Topic "Polyhedral maps and the history of mapping" (branch: Mapping the Sphere). Ten concepts:
 *   polyhedral-maps · dymaxion-map · cahill-butterfly · cube-map-of-the-earth            (the sphere on a solid, unfolded)
 *   ancient-world-maps · ptolemys-geography · medieval-and-portolan-charts · mercator-1569 · lambert-1772 · surveys-and-national-grids
 *                                                                                      (how the world came to be drawn)
 * Constructions: constructions/polyhedral-and-history.js · simulations: sims/polyhedral-and-history.js.
 * Every figure quoted in the text is computed from the same formulas as the lab (see the checks in the sims file).
 */
Hyper.add(

{
  id: 'polyhedral-maps',
  parent: 'polyhedral-and-history',
  title: 'Polyhedral maps',
  level: 2,
  short: 'The sphere carried from its centre onto the flat faces of a solid and unfolded into a net: many small gnomonic maps joined edge to edge, with less stretch the more faces there are.',
  keywords: ['polyhedron', 'net', 'icosahedron', 'octahedron', 'cube', 'gnomonic', 'faces', 'unfolding', 'interrupted map', 'Dymaxion', 'Cahill', 'cube map', 'regular solids'],
  prereq: ['gnomonic-projection', 'why-the-sphere-cannot-be-flattened', 'developable-surfaces', 'tissot-indicatrix'],
  related: ['dymaxion-map', 'cahill-butterfly', 'cube-map-of-the-earth', 'cube-maps', 'equal-area-maps', 'goode-homolosine'],
  body: `A sphere cannot be laid flat, but a polyhedron can. Its faces are flat polygons, and cut along a few edges it opens out into a **net**, as a cardboard box does. So an old idea is to fit a solid round the globe, carry the surface onto it face by face, and unfold the solid: a world map made of a handful of flat pieces.

### The projection on each face
The carrying is done from the centre of the globe. A ray from the centre through a point of the globe meets one face, and that is where the point is drawn: this is the [[gnomonic-projection|gnomonic projection]], with a different plane for every face. Great circles are straight lines in it, so the edges of the solid, which are great-circle arcs on the globe, become the straight edges of the faces, and two faces that meet along an edge agree on where it is. The map is *continuous* across every edge; what changes at an edge is the direction of the graticule, which bends there.

On a face the scale grows from the centre towards a corner. If $\\rho$ is the angle at the centre of the globe between the middle of a face and one of its corners, then lengths along the radius are stretched by $1/\\cos^2\\rho$, lengths across it by $1/\\cos\\rho$, and areas by $1/\\cos^3\\rho$. For the cube and the octahedron $\\rho = 54.7°$, so a corner is stretched 5.2 times in area; for the dodecahedron and the icosahedron $\\rho = 37.4°$ and the stretch is 2.0; for the tetrahedron $\\rho = 70.5°$ and it is 27. The more faces, the smaller each one and the gentler the distortion, which is the whole case for the icosahedron.

### Where to cut
A net needs cuts, and the cuts tear the map. A good layout puts them in the sea, where a tear does no harm, and keeps the continents whole. The same twenty triangles can leave Asia whole or cut it in two; the difference is only how the solid is turned under the globe, which the simulation lets you try. Finding the orientation that spares the land was Fuller's great step.

### Drawing it by hand
Each face is an equilateral triangle or a square, easy to draw, and the meridians are straight lines through the pole of the face. The construction on this page projects one face of the icosahedron: a triangle, straight meridians from the pole, parallels by points. The pages that follow draw the net of the icosahedron, the octant of the octahedron and the cube.

> [!fact] The same idea runs the other way. A game engine paints the sky on the six faces of a cube and looks out from the middle ([[cube-maps]]); a weather model computes on the cells of a cube or an icosahedron; a geographic index gives each cell of an icosahedral grid a code.`,
  ideas: [
    'A solid fitted round the globe is projected onto from the centre (gnomonic projection), face by face, and unfolded: a map made of flat pieces.',
    'Great circles are straight in the gnomonic projection, so the map is continuous across every edge of the solid, though the graticule bends there.',
    'At a corner of a face the area is stretched by 1/cos³ρ: 27 for the tetrahedron, 5.2 for the cube and octahedron, 2.0 for the dodecahedron and icosahedron.',
    'The cuts of the net tear the map; a good layout puts them through the oceans, which depends on how the solid is turned.'
  ],
  pitfalls: [
    'A polyhedral map is one projection with one formula — It is a different gnomonic projection on each face, about the centre of that face; the formulas have the same form but the planes differ, and the graticule has a kink at every edge.',
    'Flat faces mean no distortion — Each face is itself stretched (a corner of a cube face by 5.2 in area); it is the smaller size of the pieces, not their flatness, that helps.',
    'More faces always make a better map — They reduce the stretch within a face but multiply the edges and the cuts; the icosahedron is a compromise, and finer grids are used when the stretch matters more than the seams.'
  ],
  formulas: [
    {
      name: 'Edge of a gnomonic face',
      expr: 'L = 2*R*tan(rho)*sin(pi/n)',
      tex: 'L = 2R_\\oplus\\tan\\rho\\,\\sin\\frac{\\pi}{n}',
      vars: {
        L: { name: 'edge of the face on the tangent plane', q: 'length', unit: 'km' },
        R: { const: 'Rearth' },
        rho: { name: 'angle from the face centre to a corner', q: 'angle', unit: '°', value: 37.38, min: 1, max: 80, tex: '\\rho' },
        n: { name: 'sides of a face', int: true, value: 3, min: 3, max: 6 }
      },
      note: 'The sphere touches the middle of each face, so a corner is R tan ρ from the centre of its face. Cube: n = 4, ρ = 54.74°, L = 2R. Octahedron: n = 3, ρ = 54.74°, L = 2.449 R. Icosahedron: n = 3, ρ = 37.38°, L = 1.3231 R.'
    },
    {
      name: 'Area stretch at a corner of a face',
      expr: 'A = 1/cos(rho)^3',
      tex: 'A = \\frac{1}{\\cos^3\\rho}',
      vars: {
        A: { name: 'area scale at the corner, against the centre of the face' },
        rho: { name: 'angle from the face centre to a corner', q: 'angle', unit: '°', value: 54.74, min: 0, max: 85, tex: '\\rho' }
      },
      note: 'A face is the gnomonic map about its own centre, where the scale is 1; at an angular distance ρ the radial scale is sec²ρ and the transverse sec ρ.'
    },
    {
      name: 'Area of the globe covered by one face',
      expr: 'S = 4*pi*R^2/F',
      tex: 'S = \\frac{4\\pi R_\\oplus^2}{F}',
      vars: {
        S: { name: 'area covered by one face', q: 'area', unit: 'km²' },
        R: { const: 'Rearth' },
        F: { name: 'number of faces', int: true, value: 20, min: 4, max: 20 }
      }
    }
  ],
  examples: [
    {
      title: 'The corners of three solids',
      q: 'By what factor is an area stretched at a corner of a face of the cube, of the icosahedron, and of the tetrahedron? The angle $\\rho$ between the middle of a face and one of its corners is $54.74°$, $37.38°$ and $70.53°$.',
      steps: [
        { text: 'The area scale at the corner is $1/\\cos^3\\rho$.', tex: 'A = \\frac{1}{\\cos^3\\rho}' },
        'Cube: $\\cos 54.74° = 0.5774$, cubed $0.1925$, so $A = 5.20$.',
        'Icosahedron: $\\cos 37.38° = 0.7947$, cubed $0.5019$, so $A = 1.99$.',
        'Tetrahedron: $\\cos 70.53° = 1/3$, cubed $1/27$, so $A = 27$: the corner of a tetrahedral map is drawn 27 times too large.'
      ],
      a: 'About 5.2 for the cube, 2.0 for the icosahedron and 27 for the tetrahedron.'
    },
    {
      title: 'How big is a face?',
      q: 'The Earth ($R = 6371$ km) is mapped on an icosahedron. How long is an edge of a face on the plane tangent to the globe, and how much of the Earth does each face cover?',
      steps: [
        { text: 'An edge is $2R\\tan\\rho\\sin(\\pi/n)$ with $\\rho = 37.38°$ and $n = 3$:', tex: 'L = 2 \\cdot 6371 \\cdot 0.7639 \\cdot 0.8660 = 8430\\ \\text{km}' },
        'The Earth\'s surface is $4\\pi R^2 = 510.1$ million km², so each of the twenty faces covers $510.1/20 = 25.5$ million km².'
      ],
      a: 'An edge of 8430 km on the tangent plane (1.3231 R); 25.5 million km² of the Earth per face.'
    }
  ],
  quiz: [
    { q: 'Why is a polyhedral map continuous across the edge between two faces?', choices: ['Each face is projected from a different point, so that the edges line up', 'Both faces are projected from the centre of the globe, so the edge is the image of itself from either side', 'The net is cut along the edge and glued back', 'It is not continuous: every edge is a gap'], a: 1, why: 'The edge of the solid is the same line in space for both faces, and projection from the centre sends a point of the globe to where its ray meets that line. Both faces give the same position on the edge.' },
    { q: 'For which of these solids is the area stretch at the corner of a face the largest?', choices: ['Icosahedron', 'Octahedron', 'Cube', 'Tetrahedron'], a: 3, why: 'The corners of a tetrahedron face are 70.5° from its centre: 1/cos³ 70.5° = 27. The cube and octahedron give 5.2, the icosahedron 2.0.' },
    { q: 'By what factor is an area stretched at a corner of a cube face (ρ = 54.74°)?', answer: 5.196, why: '1/cos³ 54.74° = 1/0.5774³ = 5.196, which is √3 cubed.' },
    { q: 'Cutting a polyhedral net through the middle of a continent tears the continent, so good layouts put the cuts through the oceans.', a: true, why: 'The cuts follow edges of the solid, and the map is broken along them. Turning the solid under the globe changes which coastlines the edges cross.' },
    { q: 'What changes when you turn the sphere under the solid (the orientation slider of the lab)?', choices: ['The stretch on each face', 'Which coastlines the edges of the faces cut', 'The number of faces', 'Nothing at all'], a: 1, why: 'The shape of each face and the stretch are fixed by the solid; the turning only moves the edges over the land and the sea.' }
  ],
  applications: [
    'Cube maps for skies, reflections and 360° video: six rectilinear 90° views, which the graphics card handles natively.',
    'Geographic indexes: Google\'s S2 geometry cells the globe on the six faces of a cube; Uber\'s H3 uses an icosahedron, oriented in the spirit of Fuller\'s so that the twelve corners fall in the sea.',
    'Weather and climate models: the cubed-sphere grid of the US FV3 model and the icosahedral grid of the German weather service\'s ICON model avoid the crowding of a latitude–longitude grid at the poles.',
    'Atlases and teaching: folded paper globes and world maps that show the continents without a tear along the Pacific or the poles (Dymaxion, Cahill, Waterman).'
  ],
  history: 'Albrecht Dürer printed the nets of the regular solids in 1525 (*Underweysung der Messung*), but mapping the Earth on a polyhedron is a twentieth-century idea: Bernard Cahill\'s octahedral butterfly (1909), Buckminster Fuller\'s map on a cuboctahedron (*Life*, 1943; patented in 1946) and on an icosahedron (the Airocean map of 1954), the Cahill–Keyes map (1975), Steve Waterman\'s (1996). The cube map entered computer graphics with Ned Greene\'s paper of 1986, and polyhedral grids entered weather prediction with Sadourny\'s cubed sphere (1972).',
  sources: ['John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), the chapters on the twentieth century.', 'John P. Snyder, *An equal-area map projection for polyhedral globes*, Cartographica 29 (1992).', 'Albrecht Dürer, *Underweysung der Messung* (1525), the book of solids.'],
  sim: 'hp-polyhedral-unfold',
  construction: 'hp-icosahedral-face'
},

{
  id: 'dymaxion-map',
  parent: 'polyhedral-and-history',
  title: 'The Dymaxion map',
  level: 2,
  short: 'Fuller\'s map of the world on an icosahedron, cut and turned so that the continents form one island: no up and no down, modest distortion of shape, and a sheet that folds back into a solid.',
  keywords: ['Dymaxion', 'Fuller', 'Airocean', 'icosahedron', 'world island', 'twenty triangles', 'geodesic', 'Sadao', 'net', 'orientation'],
  prereq: ['polyhedral-maps', 'gnomonic-projection', 'compromise-maps'],
  related: ['cahill-butterfly', 'cube-map-of-the-earth', 'goode-homolosine', 'choosing-a-projection'],
  body: `In 1943 the American designer and inventor Richard Buckminster Fuller published a world map in *Life* magazine that showed the Earth on a solid made of triangles and squares (a cuboctahedron). The version that people remember came a decade later, in 1954: the Airocean World Map, drawn with the architect Shoji Sadao, which puts the globe on an **icosahedron**, cut open and spread out as twenty triangles. Fuller gave the whole idea the name *Dymaxion*, a word of his own made from "dynamic", "maximum" and "tension".

### Why an icosahedron
The icosahedron is the regular solid with the most faces: twenty equilateral triangles, five at each of twelve corners. Each triangle takes a twentieth of the Earth, 25.5 million km², small enough that the flat face stays close to the sphere: at a corner the central projection stretches area 2.0 times against 1.0 at the middle of a face. Fuller worked the triangles with a mapping of his own, tuned to spread the distortion more evenly (Robert Gray published exact equations for it in 1995); the plain central projection of the simulation shows the idea and the same layout, with somewhat more stretch.

### The orientation: one island
What made the map famous is how the solid is turned before it is cut. Fuller turned the icosahedron so that **its twelve corners and nearly all the cuts, which run along edges, fall in the oceans**. Spread out, the continents then form a single almost unbroken "world island" in one ocean. There is no up and no down, no privileged centre, and no tear through Eurasia or the Americas as in every map cut along a meridian. Antarctica is the awkward continent: it is spread over several triangles at the margin of the sheet.

### What it keeps and loses
The map is neither conformal nor equal-area, but over the land both shapes and sizes are reasonably true. It cannot be better, for a reason that is easy to see: five 60° corners of the flat triangles meet at a vertex, 300° where the globe needs 360°, so a gap of 60° has to be torn open at every corner, and the oceans carry the tears. Distances and directions are not preserved. The sheet folds back into a solid, which is the pleasure of it, and it can be arranged on the table in other ways to put another continent or ocean in the middle.

### Drawing it
The net is a zigzag strip of twenty triangles in four rows of five: draw one edge, step it off with the dividers, raise the triangles with the 60° set square. The construction on this page does that; the one on the previous page draws a single triangle with its meridians.

> [!note] The net of the Map lab, and the one drawn here, has a corner at the north pole: that is the easy way to draw the grid. It is not Fuller's orientation, in which the corners and nearly all the cuts are in the sea.`,
  ideas: [
    'Twenty equilateral triangles cover the Earth, each the central projection of a spherical triangle of 25.5 million km².',
    'Fuller turned the solid so that its twelve corners and nearly all the cuts fall in the oceans, leaving the land as one island.',
    'At every corner five flat triangles leave a gap of 60°: the net must be torn there, and the tears are put in the sea.',
    'There is no up on the map: the same net can be laid out in other ways to centre another continent or ocean.'
  ],
  pitfalls: [
    'The Dymaxion map has no distortion, and keeps all sizes and shapes — It distorts less than most world maps, but it does distort: shapes bend near the corners and edges of the triangles, and neither angles nor areas are exactly kept.',
    'The icosahedral net of the Map lab is Fuller\'s map — It has the same twenty triangles but a corner at the pole and cuts through land; Fuller\'s orientation puts the corners in the sea. What matters is the turning of the solid.',
    'Fuller published the icosahedral map in 1943 — The map of *Life* in 1943 was on a cuboctahedron; the icosahedral Airocean map followed in 1954.'
  ],
  formulas: [
    {
      name: 'Area of a spherical triangle (Girard)',
      expr: 'A = R^2*E',
      tex: 'A = R_\\oplus^2 E',
      vars: {
        A: { name: 'area of the triangle', q: 'area', unit: 'km²' },
        R: { const: 'Rearth' },
        E: { name: 'spherical excess: angle sum minus 180°', q: 'angle', unit: '°', value: 36, min: 0.001, max: 700, tex: 'E' }
      },
      note: 'A face of the icosahedron on the globe has three angles of 72°, so its excess is 216° − 180° = 36° (π/5): its area is π/5 R², a twentieth of the sphere.'
    },
    {
      name: 'Gap left at a corner of the net',
      expr: 'g = 360 - n*60',
      tex: 'g = 360° - 60°\\,n',
      vars: {
        g: { name: 'gap at a corner (°)' },
        n: { name: 'triangles meeting at the corner', int: true, value: 5, min: 3, max: 6 }
      },
      note: 'Flat equilateral triangles have 60° corners. Five meet at a vertex of the icosahedron: 300° of paper where 360° of angle is needed.'
    }
  ],
  examples: [
    {
      title: 'One face on the globe',
      q: 'A face of the icosahedron, drawn on the globe, is a spherical triangle with three angles of $72°$. What is its area on the Earth?',
      steps: [
        'The spherical excess is the angle sum minus $180°$: $3 \\times 72° - 180° = 36°$, which is $\\pi/5 = 0.6283$ radians.',
        { text: 'Girard\'s theorem gives the area:', tex: 'A = R^2 E = 6371^2 \\times 0.6283 = 25.5 \\times 10^6\\ \\text{km}^2' },
        'That is 1/20 of the whole surface, $510.1 \\times 10^6$ km², as it must be.'
      ],
      a: '25.5 million km², a twentieth of the Earth.'
    },
    {
      title: 'The gap at a corner',
      q: 'On the globe five triangles meet at a vertex of the icosahedron, with angles of $72°$ each. How much do they fall short when flattened as equilateral triangles of $60°$?',
      steps: ['On the globe the angles add to $5 \\times 72° = 360°$: they fill the neighbourhood of the vertex.', 'Flat triangles give $5 \\times 60° = 300°$.', 'The gap is $360° - 300° = 60°$, an opening in the net at every one of the twelve corners.'],
      a: 'A gap of 60°, which is why the net has to be cut at the corners.'
    }
  ],
  quiz: [
    { q: 'How many triangles of the icosahedron meet at each corner?', choices: ['3', '4', '5', '6'], a: 2, why: 'Twenty triangles with 12 corners: 20 × 3 / 12 = 5 at each corner.' },
    { q: 'Why did Fuller turn the icosahedron before cutting it?', choices: ['To make the poles come out at the top of the sheet', 'To put the corners and cuts in the oceans, so that the land stays in one piece', 'To make the map equal-area', 'To make the triangles equilateral'], a: 1, why: 'The orientation is the whole trick: with no corner on land and every cut across water, the continents form one island.' },
    { q: 'How many million square kilometres of the Earth does one face of the icosahedron cover? (The Earth has 510 million.)', answer: 25.5, why: '510.1 / 20 = 25.5 million km².' },
    { q: 'The first Dymaxion map, in *Life* in 1943, was on an icosahedron.', a: false, why: 'It was on a cuboctahedron; the icosahedral Airocean map is from 1954.' },
    { q: 'Five flat equilateral triangles meet at a corner of the net. How many degrees are missing from the full turn?', answer: 60, why: '360° − 5 × 60° = 60°.' }
  ],
  applications: [
    'Folded Dymaxion maps and paper globes as teaching objects; the same twenty triangles unfold into a map and fold into a solid.',
    'Geodesic domes: Fuller\'s domes are the icosahedron with each face divided into smaller triangles, the same subdivision that finer polyhedral map grids use.',
    'Weather and climate models: icosahedral–triangular grids such as that of the German weather service\'s ICON model have no poles to crowd the cells.',
    'Hexagon indexes of the whole globe (Uber\'s H3) start from an icosahedron turned so that its corners are in the sea, for the reason Fuller gave.',
    'Pictures of the "world island": migration routes, shipping, and the size of the land relative to the sea shown without a privileged north.'
  ],
  history: 'R. Buckminster Fuller (1895–1983) published a "Dymaxion" world map on a cuboctahedron in *Life* on 1 March 1943, took out a US patent for the method in 1946 (no. 2,393,676) and, with Shoji Sadao, drew the icosahedral Airocean World Map of 1954, the version usually meant today. Robert W. Gray published exact transformation equations for Fuller\'s mapping in 1995.',
  sources: ['US patent 2,393,676, *Cartography*, R. Buckminster Fuller (1946).', 'Robert W. Gray, *Exact transformation equations for Fuller\'s world map*, Cartographica 32 (1995).', 'John P. Snyder, *Flattening the Earth* (1993), the section on polyhedral maps.', 'Jerry Brotton, *A History of the World in Twelve Maps* (2012), on the politics of the map.'],
  sim: { id: 'hp-polyhedral-unfold', params: { solid: 'icosahedron' } },
  construction: 'hp-icosahedron-net'
},

{
  id: 'cahill-butterfly',
  parent: 'polyhedral-and-history',
  title: 'Cahill\'s butterfly',
  level: 2,
  short: 'The globe on the eight triangles of an octahedron, unfolded into the wings of a butterfly: Cahill\'s map of 1909, which keeps the continents nearly whole and puts the cuts in the oceans.',
  keywords: ['Cahill', 'butterfly', 'octahedron', 'octant', 'Keyes', 'Waterman', 'eight triangles', 'equilateral', 'net', 'Cahill–Keyes'],
  prereq: ['polyhedral-maps', 'gnomonic-projection', 'great-circles-and-rhumb-lines'],
  related: ['dymaxion-map', 'cube-map-of-the-earth', 'equal-area-maps'],
  body: `The octahedron has eight faces, each an equilateral triangle, and six corners: the two poles and four points spaced round the equator. It cuts the sphere into eight **octants**, each bounded by the equator and two meridians 90° apart, and each octant becomes a triangle whose corners are a pole and two points of the equator. In 1909 the architect Bernard J. S. Cahill published a world map made of eight such triangles, laid out in the shape of a butterfly, on which the continents, with the cuts well placed, are hardly broken. Gene Keyes revised it in 1975 (the Cahill–Keyes map), and Steve Waterman made a related map in the 1990s.

### One octant
Take the octant between the meridians 45° E and 135° E. Projected from the centre of the globe onto the flat triangle with the same three corners (the gnomonic projection) it becomes an equilateral triangle: the equator is its base and the two meridians its sides. Every meridian is a great circle, so it is a straight line from the pole to the base. A meridian that lies $\\mu$ east or west of the middle one meets the base at the distance $\\tfrac{a}{2}\\tan\\mu$ from the midpoint, where $a$ is the length of the base; and the parallel at latitude $\\varphi$ crosses that meridian at the fraction
$$s = \\frac{1}{1 + \\tan\\varphi / (\\sqrt{2}\\cos\\mu)}$$
of its length, measured from the pole. The parallels are curved: the 60° parallel is an arc of an ellipse, the 30° parallel an arc of a hyperbola, and the parallel of 54.7° N between them is a parabola.

### The net of eight
All eight octants are alike: the four northern ones are copies of one triangle and the four southern ones are its mirror images. So the net is one drawing, stepped off four times along the equator and mirrored below. How the triangles are joined is the author's choice, and decides the shape of the map. Joined in a row along the equator, as the Map lab does, they make a zigzag strip with the pole repeated four times; other layouts join them at the poles and open out the wings. In every layout the cuts follow meridians, and turning the globe moves them, which decides which continents survive.

### What it costs
The corners of an octant are 54.7° from its centre, so there the central projection stretches area 5.2 times. Cahill's own maps, and Keyes's refinement of them, fill the triangles in other ways to reduce this; the plain central projection is what is drawn here, because it can be constructed by hand and shows the principle: **few big faces mean few seams and much stretch**, against the icosahedron's twenty small faces.

> [!note] The strip of the Map lab is one of several ways of joining the eight triangles. Rotating the sphere (the orientation slider) moves the cuts across the Pacific or through the Atlantic.`,
  ideas: [
    'The octahedron cuts the sphere into eight octants; each becomes an equilateral triangle with the pole and two equator points as corners.',
    'In an octant every meridian is a straight line from the pole; a meridian μ from the middle one meets the equator side at (a/2) tan μ from the midpoint.',
    'The four northern triangles are copies of one drawing and the southern ones are their mirror images.',
    'Few large faces mean few seams but a stretch of 5.2 in area at the corners; the layout of the triangles and the cuts decide which land stays whole.'
  ],
  pitfalls: [
    'The butterfly map is a single formula for the whole globe — It is eight copies of one triangle, each projected about its own centre.',
    'Cahill\'s map is equal-area or conformal — Neither: no map of this kind is exactly one or the other; its virtue is the layout, which keeps the land in few pieces.',
    'The zigzag strip of the Map lab is Cahill\'s butterfly — It is one layout of the same eight triangles; Cahill\'s own joins them differently, and the triangles are filled in his way, not the plain central projection.'
  ],
  formulas: [
    {
      name: 'Where a meridian meets the base of an octant',
      expr: 'd = a/2*tan(mu)',
      tex: 'd = \\frac{a}{2}\\tan\\mu',
      vars: {
        d: { name: 'distance from the midpoint of the base', q: 'length', unit: 'mm', signed: true },
        a: { name: 'edge of the triangle', q: 'length', unit: 'mm', value: 300, min: 1 },
        mu: { name: 'longitude measured from the middle meridian of the octant', q: 'angle', unit: '°', value: 15, min: -45, max: 45, signed: true, tex: '\\mu' }
      },
      note: 'At μ = ±45° the meridian reaches the end of the base, a/2 from the midpoint.'
    },
    {
      name: 'Where a parallel crosses a meridian of an octant',
      expr: 's = 1/(1 + tan(phi)/(sqrt(2)*cos(mu)))',
      tex: 's = \\frac{1}{1 + \\tan\\varphi / (\\sqrt{2}\\cos\\mu)}',
      vars: {
        s: { name: 'fraction of the way from the pole to the base' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 89, tex: '\\varphi' },
        mu: { name: 'longitude from the middle meridian of the octant', q: 'angle', unit: '°', value: 0, min: -45, max: 45, signed: true, tex: '\\mu' }
      },
      note: 'On the equator (φ = 0) s = 1: the base itself. The pole is at s = 0.'
    },
    {
      name: 'Area stretch at a corner of an octant',
      expr: 'A = 1/cos(rho)^3',
      tex: 'A = \\frac{1}{\\cos^3\\rho}',
      vars: {
        A: { name: 'area scale against the centre of the face' },
        rho: { name: 'angle from the centre of the face to a corner', q: 'angle', unit: '°', value: 54.74, min: 0, max: 85, tex: '\\rho' }
      }
    }
  ],
  examples: [
    {
      title: 'Drawing the octant to 300 mm',
      q: 'An octant is drawn on an equilateral triangle of edge $a = 300$ mm. Where do the meridians of $75°$ E and $105°$ E meet the base, and how far above the base is the point of the $90°$ E meridian that lies at $60°$ N?',
      steps: [
        'The middle meridian of the octant is 90° E, so the two meridians are $\\mu = \\mp 15°$ from it. On the base: $d = \\tfrac{a}{2}\\tan 15° = 150 \\times 0.2679 = 40.2$ mm each side of the midpoint.',
        { text: 'On the middle meridian $\\mu = 0$, so the fraction from the pole is', tex: 's = \\frac{1}{1 + \\tan 60° / \\sqrt{2}} = 0.4495' },
        'The height of the triangle is $a\\sqrt3/2 = 259.8$ mm, so the point is $0.4495 \\times 259.8 = 116.8$ mm below the pole, which is $259.8 - 116.8 = 143.0$ mm above the base.'
      ],
      a: '40.2 mm either side of the midpoint of the base; the 60° N point is 143.0 mm above the base.'
    }
  ],
  quiz: [
    { q: 'Into how many triangles does the octahedron cut the globe?', answer: 8, why: 'Eight faces: four in the northern hemisphere and four in the southern.' },
    { q: 'Where does a meridian 15° from the middle meridian of an octant meet the equator side, measured from the midpoint of the base as a fraction of the base a?', choices: ['0.134 a', '0.268 a', '0.067 a', '0.259 a'], a: 0, why: 'The distance is (a/2) tan 15° = 0.5 × 0.2679 a = 0.134 a.' },
    { q: 'Why are the four northern triangles of the net all alike?', choices: ['The map is conformal', 'Every northern octant has the same shape and the same corners, a pole and two equator points 90° apart, so projecting it gives the same triangle', 'The sphere is turned four times', 'Cahill drew them from a template'], a: 1, why: 'The four northern octants are congruent on the sphere; the gnomonic map of each is the same drawing, only the longitudes labelled on it change.' },
    { q: 'In an octant of the gnomonic map the meridians are straight lines but the parallels are not.', a: true, why: 'A meridian is a great circle and great circles are straight; a parallel is a small circle (a cone of directions cut by a plane), an ellipse or a hyperbola.' },
    { q: 'By what factor is the area stretched at a corner of an octant?', answer: 5.196, why: 'The corners are 54.74° from the centre of the face: 1/cos³ 54.74° = 5.196.' }
  ],
  applications: [
    'Octahedral layouts for world maps that must keep the continents in a few pieces: the Cahill–Keyes and Waterman maps.',
    'Hierarchical grids of the globe: the "quaternary triangular mesh" starts from the octahedron and divides every triangle into four, again and again.',
    'Teaching globes: eight equilateral triangles cut from paper fold into a faceted globe that can be photographed and measured.',
    'Data displays for a whole planet (cloud cover, sea ice) in which no ocean or pole should be given more space than the continents.'
  ],
  history: 'Bernard J. S. Cahill, an architect, published his butterfly map in 1909 and developed it in later versions. Gene Keyes reworked it in 1975 as the Cahill–Keyes map; Steve Waterman made a related map from a truncated octahedron in the 1990s.',
  sources: ['John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), the section on polyhedral and "butterfly" maps.', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), on the gnomonic projection.', 'Gene Keyes, *Cahill–Keyes World Map* (the 1975 revision and its later versions).'],
  sim: { id: 'hp-polyhedral-unfold', params: { solid: 'octahedron' } },
  construction: 'hp-cahill-octant'
},

{
  id: 'cube-map-of-the-earth',
  parent: 'polyhedral-and-history',
  title: 'The Earth on a cube',
  level: 2,
  short: 'The Earth projected from its centre onto the six faces of a cube and unfolded as a cross: straight meridians and hyperbolic parallels on the side faces, rays and circles on the poles. The cube map of games and 360° video, drawn for the globe.',
  keywords: ['cube', 'cube map', 'cubed sphere', 'six faces', 'cross', 'gnomonic', 'skybox', 'S2', 'rectilinear', 'net'],
  prereq: ['polyhedral-maps', 'gnomonic-projection', 'aspects-of-a-projection'],
  related: ['cube-maps', 'equirectangular-images', 'dymaxion-map', 'cahill-butterfly'],
  body: `Put the globe inside a cube so that it touches the middle of each face, and project from its centre onto the faces. Each face then shows a 90° by 90° piece of the world as an ordinary rectilinear picture: straight lines stay straight, exactly as in a photograph. Unfold the cube into a cross and you have six squares. This is the **cube map** of computer graphics, wrapped here round the Earth instead of round a viewer.

### The four side faces
Let a face be centred on the equator at longitude $\\lambda_0$, let $\\Delta = \\lambda - \\lambda_0$ be the longitude measured from its middle, and let the sphere have radius $R$, which is also the half-width of the face. Then
$$x = R\\tan\\Delta, \\qquad y = \\frac{R\\tan\\varphi}{\\cos\\Delta}.$$
The meridians are verticals at $R\\tan\\Delta$: equally spaced in angle, not in distance, crowding at the middle and spreading out towards the edges at $\\Delta = \\pm 45°$ where $x = \\pm R$. The parallels are hyperbolas, lowest on the middle meridian, and the equator is a straight line across the four faces.

### The polar faces
The top face looks straight down the axis, and is the polar gnomonic map: the meridians are straight rays from the pole at their true angles, and the parallels are circles of radius
$$r = R\\cot\\varphi,$$
so that the 45° parallel just touches the four sides of the square, and everything south of 45° lies on the side faces. With the top face drawn above the front face, the ray for longitude $\\lambda_0$ points down, towards the front face, and longitudes increase to the right.

### What it keeps and loses
Great circles are straight lines on every face, so a shortest route is a line segment there. The price is the stretch from the centre of a face to its corner, where an area is 5.2 times too large, and the twelve edges of the cube are creases in the graticule. The middle of each face is nearly true; the corners are far from it. The faces are nevertheless easy to compute and to draw, which is what has made the cube the standard for graphics.

### Drawing it
Draw the cross of six squares of side $2R$ with the T-square and the set square. For the meridians take $R\\tan\\Delta$ from rays drawn at the angle $\\Delta$ from a point $R$ below the equator (the protractor does it); for the parallels multiply by $\\sec\\Delta$. On the top face use compass circles of radius $R\\cot\\varphi$ and protractor rays.

> [!tip] A game's cube map is this map applied to the sky instead of the Earth: the same six squares, with the viewer at the centre looking outwards. See [[cube-maps]].`,
  ideas: [
    'Projected from the centre onto the faces of a cube, the globe gives six rectilinear 90° pictures; unfolded they form a cross of six squares.',
    'On a side face the meridians are verticals at R tan Δ and the parallels are hyperbolas at height R tan φ / cos Δ.',
    'On the top face the meridians are rays at their true angles and the parallels are circles of radius R cot φ; the 45° parallel touches the sides.',
    'Great circles are straight on every face, and the worst stretch (5.2 in area) is at the corners of the cube.'
  ],
  pitfalls: [
    'The cube map is the same as an equirectangular map — Both are used to wrap a sphere, but the equirectangular map has one formula and shears at the poles; the cube map has six rectilinear faces with no pole singularity.',
    'The parallels on a side face are straight lines — Only the equator is. The others are hyperbolas, rising towards the edges of the face.',
    'Equal steps of longitude give equal steps on a face — The position is R tan Δ: the first 15° from the middle take 0.27 R, the last 15° (from 30° to 45°) take 0.42 R, so the meridians spread out towards the edges.'
  ],
  formulas: [
    {
      name: 'Meridian on a side face',
      expr: 'x = R*tan(Delta)',
      tex: 'x = R\\tan\\Delta',
      vars: {
        x: { name: 'distance from the middle of the face', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the sphere (half the face)', q: 'length', unit: 'mm', value: 80, min: 1 },
        Delta: { name: 'longitude measured from the middle of the face', q: 'angle', unit: '°', value: 20, min: -45, max: 45, signed: true, tex: '\\Delta' }
      }
    },
    {
      name: 'Parallel on a side face',
      expr: 'y = R*tan(phi)/cos(Delta)',
      tex: 'y = \\frac{R\\tan\\varphi}{\\cos\\Delta}',
      vars: {
        y: { name: 'height above the equator', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the sphere', q: 'length', unit: 'mm', value: 80, min: 1 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 25, min: -45, max: 45, signed: true, tex: '\\varphi' },
        Delta: { name: 'longitude from the middle of the face', q: 'angle', unit: '°', value: 20, min: -45, max: 45, signed: true, tex: '\\Delta' }
      },
      note: 'The point must lie inside the face: |y| ≤ R. Beyond that it belongs to the top or the bottom face.'
    },
    {
      name: 'Parallel on a polar face',
      expr: 'r = R/tan(phi)',
      tex: 'r = R\\cot\\varphi',
      vars: {
        r: { name: 'radius of the circle round the pole', q: 'length', unit: 'mm' },
        R: { name: 'radius of the sphere', q: 'length', unit: 'mm', value: 80, min: 1 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 70, min: 45, max: 89, tex: '\\varphi' }
      },
      note: 'At φ = 45° the circle has radius R and touches the sides of the square.'
    }
  ],
  examples: [
    {
      title: 'Plotting a point on a face',
      q: 'On a cube face with $R = 80$ mm centred on longitude $0°$, where does the point $(20°\\text{ E},\\ 25°\\text{ N})$ fall, and what is the radius of the $70°$ parallel on the top face?',
      steps: [
        { text: 'Across: ', tex: 'x = 80\\tan 20° = 80 \\times 0.3640 = 29.1\\ \\text{mm}' },
        { text: 'Up: ', tex: 'y = \\frac{80\\tan 25°}{\\cos 20°} = \\frac{80 \\times 0.4663}{0.9397} = 39.7\\ \\text{mm}' },
        'Both are inside the square (below 80 mm), so the point is on this face.',
        { text: 'On the top face: ', tex: 'r = 80 \\cot 70° = 80 \\times 0.3640 = 29.1\\ \\text{mm}' }
      ],
      a: 'x = 29.1 mm, y = 39.7 mm on the face; the 70° parallel of the top face has radius 29.1 mm.'
    }
  ],
  quiz: [
    { q: 'How far from the middle of a side face (in units of R) is the meridian 30° from the face centre?', answer: 0.5774, why: 'x = R tan 30° = 0.5774 R.' },
    { q: 'What curves are the parallels on a side face of the cube?', choices: ['Circles', 'Straight horizontal lines', 'Hyperbolas', 'Sine curves'], a: 2, why: 'A parallel is a cone of directions cut by the vertical plane of the face: a hyperbola, y = R tan φ / cos Δ.' },
    { q: 'What is the 45° parallel on the top face?', choices: ['The centre of the face', 'The circle inscribed in the square', 'A circle through the corners', 'A straight line'], a: 1, why: 'Its radius is R cot 45° = R, which touches the four sides.' },
    { q: 'Great circles are straight lines on every face of the cube map.', a: true, why: 'That is the property of the gnomonic projection: a great circle lies in a plane through the centre, and that plane cuts the face plane in a straight line.' },
    { q: 'By how much is an area stretched at a corner of a cube face?', answer: 5.196, why: '1/cos³ 54.74° = 5.196.' }
  ],
  applications: [
    'Skyboxes and environment maps in games and film: the six faces of a cube map are the six rectilinear views of a camera turning through 90°.',
    '360° video and photos stored as a cube: six square faces avoid the heavy oversampling of the poles in the equirectangular format.',
    'Geographic indexes: Google\'s S2 geometry numbers the cells of the six faces and walks them along a space-filling curve.',
    'Weather and ocean models on a "cubed sphere": the NOAA FV3 core and others compute on six panels without the pole problem of latitude–longitude grids.'
  ],
  history: 'Dürer printed the net of the cube in 1525. The cube entered computer science in two steps: Robert Sadourny\'s cubed-sphere grid for atmospheric models (1972), and Ned Greene\'s "environment mapping" with the six-faced cube (1986); graphics cards supported cube-map textures from about 1999–2001.',
  sources: ['Ned Greene, *Environment mapping and other applications of world projections*, IEEE Computer Graphics and Applications (1986).', 'Robert Sadourny, *Conservative finite-difference approximations of the primitive equations on quasi-uniform spherical grids*, Monthly Weather Review (1972).', 'John P. Snyder, *Flattening the Earth* (1993).'],
  sim: { id: 'hp-polyhedral-unfold', params: { solid: 'cube' } },
  construction: 'hp-cube-net'
},

{
  id: 'ancient-world-maps',
  parent: 'polyhedral-and-history',
  title: 'The first maps of the world',
  level: 1,
  short: 'From a Babylonian disc and the maps of Anaximander to Eratosthenes\' grid and his measurement of the Earth, Hipparchus\' latitudes and longitudes and Marinus of Tyre\'s plane chart: how the Greeks turned a picture of the world into a drawing with coordinates.',
  keywords: ['Anaximander', 'Hecataeus', 'Eratosthenes', 'Hipparchus', 'Marinus of Tyre', 'Babylonian map', 'oikoumene', 'circumference of the Earth', 'stadion', 'Syene', 'Alexandria', 'plane chart'],
  prereq: ['why-the-sphere-cannot-be-flattened', 'equirectangular-projection', 'scale-factor-and-standard-parallels'],
  related: ['ptolemys-geography', 'medieval-and-portolan-charts', 'surveys-and-national-grids', 'hipparchus-and-ptolemy-sky'],
  body: `The oldest surviving map of the world is a clay tablet from Babylon, made in the sixth century BC or a little earlier, and now in the British Museum. It is a disc: a ring of ocean, the "bitter river", round a few circles for cities and regions, with Babylon near the middle and a handful of remote islands beyond the water. It is a diagram of ideas, not a plan of roads.

### The Greek disc and the climates
Greek tradition gives the first map of the inhabited world to Anaximander of Miletus (about 610–546 BC) and an improved one to Hecataeus (about 550–476 BC): a round Earth-disc with the Mediterranean in the middle and a river Ocean round the edge. Herodotus laughed at maps drawn with a compass, a sign that they were common by his day (about 430 BC). The next steps were to put lines on the disc: Dicaearchus (about 300 BC) drew a main east–west line through the Pillars of Heracles and Rhodes, and Eratosthenes of Cyrene (about 276–194 BC), the librarian at Alexandria, drew a frame of parallels and meridians on his map of the *oikoumene*, the inhabited world. His parallels were not equally spaced; they were fixed by the length of the longest day and by well-known places (Meroë, Syene, Alexandria, Rhodes ...). He divided the circle into sixty parts.

### Measuring the Earth
A map needs a size. Eratosthenes found it from one measurement. At Syene, at noon on the summer solstice, the Sun lit the bottom of a well; at Alexandria, about 5000 stadia due north according to the surveyors' count, a vertical pointer cast a shadow whose angle with the pointer was one fiftieth of a circle. The Sun is so far that its rays arrive parallel, and the verticals of the two places meet at the centre of the Earth with the same angle, so the distance between the cities is a fiftieth of the circumference: 250,000 stadia (later reports have 252,000, which is 700 stadia to a degree). In kilometres that is 39,000 to 46,000 depending on the stadion, the first being within 2 % of the truth.

### Coordinates
Hipparchus (about 190–120 BC) took the next step on paper: to fix places by latitude and longitude from observation, with the circle divided into 360 degrees, so that a map can be computed from a table. Latitude was easy to observe (the height of the Sun, the length of the longest day). Longitude was not; without a clock to compare the times of an eclipse it was taken from itineraries. Marinus of Tyre (about AD 70–130) gathered the evidence into a map whose meridians and parallels are straight and equally spaced, drawn so that the parallel of Rhodes (36°) is true, a degree of longitude drawn 4/5 as long as a degree of latitude (cos 36° = 0.81). This plane chart is the first map projection we know. Ptolemy used Marinus' work, criticised his projection and replaced it (see [[ptolemys-geography]]).

### Drawing it
The construction on this page lays off the angle at the centre, carries the vertical of Alexandria with the set square, draws the parallel rays and the shadow, and steps the chord round the circle fifty times. The sim lets you change the cities, the date and the stadion.

> [!warn] Almost nothing of this survives in the maps themselves. The Greek maps are lost; we know them from descriptions in Strabo and Agathemerus and from the numbers recorded in the texts.`,
  ideas: [
    'The first world maps were diagrams: a disc of land in a ring of ocean, with places set by meaning rather than by measure.',
    'Eratosthenes measured the Earth from one angle (1/50 of a circle, at Alexandria) and one distance (5000 stadia): a circumference of 250,000 stadia.',
    'Hipparchus asked for latitude and longitude from observation and a circle of 360°: a map could then be computed from a list of numbers.',
    'Marinus\' plane chart (equal spacing, the parallel of Rhodes true) is the first map projection known; Ptolemy replaced it with better ones.'
  ],
  pitfalls: [
    'Eratosthenes found the size of the Earth to within 1 % — His figure was 250,000 or 252,000 stadia, and the length of the stadion is uncertain by 15 % or more; the accuracy depends on which stadion he meant, and luck partly cancelled his errors.',
    'Syene lay exactly on the Tropic and on the meridian of Alexandria — Syene (Aswan) lies about 3° of longitude east of Alexandria and 0.65° north of the Tropic of Cancer, and 5000 stadia was a rounded travellers\' figure; the method was sound, the data rough.',
    'People before Columbus thought the Earth flat — The Greeks proved it round and every medieval scholar knew it; the argument of the 1490s was about its size.'
  ],
  formulas: [
    {
      name: 'Circumference from an arc and its angle',
      expr: 'C = 2*pi*d/delta',
      tex: 'C = \\frac{2\\pi d}{\\delta}',
      vars: {
        C: { name: 'circumference of the Earth', q: 'length', unit: 'km' },
        d: { name: 'distance between the two places', q: 'length', unit: 'km', value: 787.5, min: 1 },
        delta: { name: 'angle at the centre (the angle of the shadow)', q: 'angle', unit: '°', value: 7.2, min: 0.1, max: 90, tex: '\\delta' }
      },
      note: 'Eratosthenes\' numbers: 7.2° and 5000 stadia of 157.5 m = 787.5 km give 39 375 km.'
    },
    {
      name: 'Shadow of a vertical pointer',
      expr: 's = h*tan(z)',
      tex: 's = h\\tan z',
      vars: {
        s: { name: 'length of the shadow', q: 'length', unit: 'cm' },
        h: { name: 'height of the pointer', q: 'length', unit: 'cm', value: 100, min: 1 },
        z: { name: 'angle of the Sun from the zenith', q: 'angle', unit: '°', value: 7.2, min: 0, max: 80 }
      },
      note: 'At the angle of 7.2° the shadow is 12.6 % of the pointer.'
    },
    {
      name: 'Distance along a meridian',
      expr: 'd = R*dphi',
      tex: 'd = R_\\oplus\\,\\Delta\\varphi',
      vars: {
        d: { name: 'distance along the meridian', q: 'length', unit: 'km' },
        R: { const: 'Rearth' },
        dphi: { name: 'difference of latitude', q: 'angle', unit: '°', value: 7.11, min: 0, max: 90, tex: '\\Delta\\varphi' }
      },
      note: 'Aswan 24.09° N and Alexandria 31.20° N differ by 7.11°: 791 km, which is 5020 stadia of 157.5 m.'
    }
  ],
  examples: [
    {
      title: 'Eratosthenes\' arithmetic',
      q: 'The shadow angle is $7.2°$ and the cities are $5000$ stadia apart. What is the circumference of the Earth in stadia, and in kilometres for a stadion of $157.5$ m? How far is that from the modern $40\\,008$ km?',
      steps: [
        'A circle is $360° / 7.2° = 50$ times the arc between the cities.',
        'The circumference is $50 \\times 5000 = 250\\,000$ stadia.',
        { text: 'In kilometres:', tex: '250\\,000 \\times 0.1575\\ \\text{km} = 39\\,375\\ \\text{km}' },
        'The error is $39\\,375/40\\,008 - 1 = -1.6\\ \\%$. With a stadion of 185 m it would be $46\\,250$ km, 15 % too large.'
      ],
      a: '250,000 stadia, about 39,400 km: 1.6 % below the truth, if the stadion was 157.5 m.'
    },
    {
      title: 'The same measurement with modern positions',
      q: 'Aswan (Syene) is at $24.09°$ N and Alexandria at $31.20°$ N. What angle between the verticals does that give, and how far apart are the cities along the meridian?',
      steps: [
        'The angle at the centre is the difference of latitude: $31.20° - 24.09° = 7.11°$, close to Eratosthenes\' $7.2°$.',
        { text: 'The distance along the meridian is', tex: 'd = R\\,\\Delta\\varphi = 6371 \\times 0.1241 = 791\\ \\text{km}' },
        'With a stadion of 157.5 m that is $791/0.1575 = 5020$ stadia: the 5000 of the surveyors was excellent.'
      ],
      a: '7.11° and 791 km (5020 stadia).'
    }
  ],
  quiz: [
    { q: 'What angle did Eratosthenes find between the Sun\'s ray and the vertical pointer at Alexandria?', choices: ['One fiftieth of a circle (7.2°)', 'One tenth of a circle (36°)', 'One degree', 'A right angle'], a: 0, why: 'The shadow gave 1/50 of a circle; with 5000 stadia between the cities, the circumference is 50 × 5000 = 250,000 stadia.' },
    { q: 'Why is the angle between the verticals at the two cities equal to the angle of the shadow at Alexandria?', choices: ['Because both cities have the same latitude', 'Because the Sun\'s rays are parallel and the verticals meet at the centre, so the angles are corresponding angles', 'Because the Earth is flat', 'Because the shadows have equal length'], a: 1, why: 'The ray at Alexandria is parallel to the ray down the well at Syene, which is along the vertical there; the transversal is the line from the centre through Alexandria, and corresponding angles of parallels are equal.' },
    { q: 'If the shadow angle had been 9° and the cities still 5000 stadia apart, how many stadia would the circumference be?', answer: 200000, why: '360°/9° = 40 arcs of 5000 stadia = 200,000 stadia.' },
    { q: 'Eratosthenes needed the Sun overhead at both cities.', a: false, why: 'He needed it at one only (the well at Syene), to know the vertical there. With both shadows measured, the difference of the two angles would do on any day.' },
    { q: 'Who proposed fixing places by latitude and longitude from observation, with the circle divided into 360 degrees?', choices: ['Anaximander', 'Eratosthenes', 'Hipparchus', 'Herodotus'], a: 2, why: 'Hipparchus (second century BC) wanted maps computed from observed coordinates and used the Babylonian 360° circle.' }
  ],
  applications: [
    'The method is the template of every later measurement of the Earth: an astronomical angle and a surveyed distance give a size. Picard\'s degree of the meridian (1670) and the expeditions to Lapland and Peru (1735–44) are Eratosthenes with telescopes.',
    'School science: classes on different continents measure the noon shadow of a stick at the same time and repeat the calculation together.',
    'Triangulation (see [[surveys-and-national-grids]]) replaces the traveller\'s count of the distance by a chain of measured angles.',
    'The plane chart survived in the sailors\' charts of the Middle Ages (see [[medieval-and-portolan-charts]]).'
  ],
  history: 'The Babylonian world map (British Museum, tablet 92687) is a copy of the sixth century BC. Anaximander and Hecataeus drew the Greek discs in the sixth century BC; Eratosthenes (about 276–194 BC) measured the Earth and drew the frame of climates; Hipparchus (about 190–120 BC) proposed coordinates; Marinus of Tyre (about AD 70–130) drew the first coordinate map. In China Pei Xiu (AD 224–271) listed the rules for maps, with a grid and a scale, and a stone map of 1137 carries a grid of squares 100 li wide. Of the Roman world only a road map survives, the Peutinger Table, a medieval copy of a late Roman original.',
  sources: ['J. B. Harley and David Woodward (eds.), *The History of Cartography*, vol. 1: Cartography in Prehistoric, Ancient and Medieval Europe and the Mediterranean (1987).', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), the chapters on antiquity.', 'J. Lennart Berggren and Alexander Jones, *Ptolemy\'s Geography* (2000), the introduction on Marinus.', 'Jerry Brotton, *A History of the World in Twelve Maps* (2012), the chapter on Ptolemy.'],
  sim: 'hp-eratosthenes-lab',
  construction: 'hp-eratosthenes'
},

{
  id: 'ptolemys-geography',
  parent: 'polyhedral-and-history',
  title: 'Ptolemy\'s Geography',
  level: 2,
  short: 'Ptolemy\'s guide to drawing the world (about AD 150): the coordinates of some eight thousand places and two projections of the known world, a cone with straight meridians and a map with curved ones that looked like the globe. Rediscovered in Italy about 1400, it shaped Europe\'s world maps for a century.',
  keywords: ['Ptolemy', 'Geography', 'Geographia', 'Cosmographia', 'gazetteer', 'Thule', 'Rhodes', 'Syene', 'anti-Meroë', 'conic projection', 'pseudoconic', 'Waldseemüller', 'Fortunate Islands', 'Marinus'],
  prereq: ['ancient-world-maps', 'conic-projections', 'equidistant-conic-projection', 'scale-factor-and-standard-parallels'],
  related: ['bonne-projection', 'werner-cordiform', 'medieval-and-portolan-charts', 'mercator-1569', 'hipparchus-and-ptolemy-sky'],
  body: `Claudius Ptolemy worked at Alexandria in the second century AD. He is best known for the *Almagest*, the astronomy that ruled until Copernicus, but his second great work is a geography: *Geographike hyphegesis*, the "guide to drawing a map of the world" (about AD 150). Its first book is theory, how to make the map. Books two to seven are a catalogue of some eight thousand places, each with a longitude and a latitude, and the last book explains how to cut the world map into regional maps. The text is a list of numbers to be turned into a drawing, which is why it survived when the pictures did not.

### The data and its errors
Latitudes come from the length of the longest day or the height of the Sun; longitudes, measured eastwards from the Fortunate Islands (the Canaries) and running to 180°, were worked out from travellers\' distances. Two errors matter. Ptolemy took the small Earth of Posidonius, 500 stadia to a degree instead of Eratosthenes\' 700, so every distance turned into degrees came out about 40 % too large; and he made the Mediterranean 62° long where the truth is about 42°. Europe and Asia together therefore stretch across far more of the globe than they should, and the ocean to the west of Spain looks narrow: a mistake that fed hopes of a short passage to the east.

### The first projection: a cone
Marinus\' plane chart, Ptolemy objects, draws every parallel as long as the parallel of Rhodes: too long towards Thule, too short towards the equator. To mend it he rolls a cone round the globe along the parallel of Rhodes (36° N): the **meridians are straight lines** converging on a point beyond the pole, the **parallels are circular arcs** about that point, spaced as on the globe, and the parallel of Rhodes comes out its true length. The angle between two meridians on the map is their difference of longitude times $\\sin 36°$. It is easy to draw and true along every meridian.

### The second projection: curved meridians
Ptolemy judged the cone too unlike the globe, whose meridians curve. In his second method the parallels are still concentric arcs, spaced truly, about a point $181\\tfrac{5}{6}$ degrees above the equator on the central meridian; but now the degrees of longitude are laid off in their true lengths on three parallels (Thule at 63° N, Syene at 23°50′ N and anti-Meroë at 16°25′ S) and **each meridian is the circle through its three points**. The meridians bow outwards like the outline of a globe, and the map looks right. A third method in the text is a perspective view of the globe.

### Afterwards
Greek manuscripts reached Italy about 1397; the Latin translation of Jacopo d\'Angelo was made about 1406. The first printed editions with maps came from Bologna (1477) and Rome (1478), then Ulm (1482), and went on for two centuries. Their maps are drawn on Ptolemy\'s second projection or modifications of it. In 1507 Martin Waldseemüller\'s wall map, on a modified Ptolemaic projection, was the first to name America.

> [!history] The maps in the Greek manuscripts that survive date from about 1300; whether they go back to Ptolemy himself is debated. The text certainly tells how they are to be drawn.`,
  ideas: [
    'The Geography is mostly a table of some 8000 places with latitude and longitude: a map can be drawn from it, which is why it survived.',
    'Longitudes were set by travellers\' distances and an Earth too small by a third, so the Mediterranean is 62° long instead of 42°.',
    'First projection: straight meridians from a point beyond the pole, arcs for the parallels, the parallel of Rhodes (36° N) true.',
    'Second projection: concentric arcs for the parallels and each meridian the circle through its three points on the parallels of Thule, Syene and anti-Meroë.'
  ],
  pitfalls: [
    'Ptolemy invented latitude and longitude — Hipparchus had proposed them three centuries earlier and Marinus had used them; Ptolemy applied them to a great catalogue and set out the projections.',
    'The Geography came with maps drawn by Ptolemy — The earliest surviving manuscripts with maps are from about 1300; the text tells the reader how to draw the maps. Whether the pictures go back to Ptolemy is uncertain.',
    'The Greek world was misshapen because they lacked the mathematics — The projections are sound; the errors come from the data (estimated distances) and from an Earth taken too small.'
  ],
  formulas: [
    {
      name: 'Angle between meridians in the first projection',
      expr: 'theta = lambda*sin(phi1)',
      tex: '\\theta = \\lambda\\,\\sin\\varphi_1',
      vars: {
        theta: { name: 'angle between the meridians on the map', q: 'angle', unit: '°', tex: '\\theta' },
        lambda: { name: 'difference of longitude', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\lambda' },
        phi1: { name: 'standard parallel (Rhodes)', q: 'angle', unit: '°', value: 36, min: 1, max: 80, tex: '\\varphi_1' }
      },
      note: 'The cone touches the globe along the standard parallel; the meridians fan out by sin φ₁ of their longitude. For 180° of longitude on the parallel of Rhodes: 105.8°.'
    },
    {
      name: 'Radius of the standard parallel on the map',
      expr: 'rho1 = R/tan(phi1)',
      tex: '\\rho_1 = R\\cot\\varphi_1',
      vars: {
        rho1: { name: 'distance from the apex to the standard parallel', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100, min: 1 },
        phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 36, min: 1, max: 80, tex: '\\varphi_1' }
      },
      note: 'This is the length of the tangent from the point of the globe at φ₁ to the polar axis; the apex of the map is that distance above the Rhodes mark on the central meridian.'
    },
    {
      name: 'True length of a degree of longitude on a parallel',
      expr: 'L = pi*R*cos(phi)/180',
      tex: 'L = \\frac{\\pi R_\\oplus\\cos\\varphi}{180}',
      vars: {
        L: { name: 'length of one degree of longitude', q: 'length', unit: 'km' },
        R: { const: 'Rearth' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 63, min: 0, max: 90, tex: '\\varphi' }
      },
      note: 'Ptolemy\'s second projection lays off exactly this length, scaled to the map, on the parallels of Thule (63°: 50.5 km), Syene (23°50′: 101.7 km) and anti-Meroë (16°25′: 106.7 km).'
    }
  ],
  examples: [
    {
      title: 'The fan of meridians',
      q: 'In Ptolemy\'s first projection with the standard parallel at $36°$, what is the angle at the apex between the central meridian and the meridian $90°$ away (the edge of his world)? Where is the apex if the globe is drawn with $R = 100$ units?',
      steps: [
        { text: 'The angle is the longitude times the sine of the standard parallel:', tex: '\\theta = 90° \\times \\sin 36° = 90° \\times 0.5878 = 52.9°' },
        { text: 'The distance from the apex to the parallel of Rhodes is', tex: '\\rho_1 = R\\cot 36° = 137.6' },
        'The Rhodes point is $R\\varphi = 100 \\times 0.6283 = 62.8$ above the equator, so the apex is $62.8 + 137.6 = 200.5$ above the equator.'
      ],
      a: '52.9° each side of the central meridian; the apex is 200.5 units above the equator.'
    },
    {
      title: 'Degrees of longitude on three parallels',
      q: 'For the second projection with $R = 100$ units, how long is $30°$ of longitude on the parallels of Thule ($63°$), Syene ($23.83°$) and anti-Meroë ($16.42°$ S)?',
      steps: [
        { text: 'The length is $R \\times 30° \\times \\cos\\varphi$ with $30° = 0.5236$ rad:', tex: '52.36\\cos 63° = 23.8,\\quad 52.36\\cos 23.83° = 47.9,\\quad 52.36\\cos 16.42° = 50.2' },
        'Step these lengths three times along each parallel from the central meridian to mark 30°, 60° and 90°; each triple of points at the same longitude fixes one meridian.'
      ],
      a: '23.8, 47.9 and 50.2 units.'
    }
  ],
  quiz: [
    { q: 'Which parallel is drawn at its true length in Ptolemy\'s first projection?', choices: ['The equator', 'Rhodes (36° N)', 'Thule (63° N)', 'Anti-Meroë'], a: 1, why: 'The cone touches the globe along the parallel of Rhodes, and the angle between meridians is chosen so that this parallel keeps its length.' },
    { q: 'How many points fix each meridian in Ptolemy\'s second projection?', choices: ['Two', 'Three', 'Four', 'Five'], a: 1, why: 'The meridian is the circle through its points on three parallels (Thule, Syene and anti-Meroë), found with the compass.' },
    { q: 'In the first projection, what is the angle between the central meridian and the meridian 60° away (standard parallel 36°)?', answer: 35.27, why: '60° × sin 36° = 60° × 0.5878 = 35.27°.' },
    { q: 'Both of Ptolemy\'s projections have straight meridians.', a: false, why: 'Only the first does. In the second the meridians are circular arcs that bow outwards.' },
    { q: 'Why did Ptolemy\'s Mediterranean come out far too long (62° instead of 42°)?', choices: ['Because the projection stretches it', 'Because distances from travellers were converted to degrees with an Earth about a third too small', 'Because he used the wrong prime meridian', 'Because he drew the map on a cone'], a: 1, why: 'He used 500 stadia to a degree instead of 700; every east–west distance, converted to degrees, was about 40 % too large.' }
  ],
  applications: [
    'Renaissance atlases: the maps of the printed Ptolemy (1477 onwards) were the standard picture of the world until the voyages of discovery were absorbed.',
    'Historical geography: scholars reconstruct what a place was called and where it lay from the catalogue of coordinates, and compare them with modern positions in a GIS.',
    'Georeferencing old maps: Ptolemy\'s cone is the ancestor of the equidistant conic and, with curved meridians and true parallels, of the Bonne and Werner maps of the sixteenth century.',
    'Teaching: drawing the second projection with the compass is a lesson in the circle through three points.'
  ],
  history: 'Ptolemy wrote about AD 150. The Greek text was copied in Byzantium; a Greek manuscript reached Florence about 1397 and Jacopo d\'Angelo\'s Latin translation (*Cosmographia*) dates from about 1406. Printed editions with engraved maps appeared at Bologna in 1477, Rome in 1478 and Ulm (woodcuts) in 1482, and later editions added modern maps. Waldseemüller\'s world map of 1507, with the name America, is on a modified Ptolemaic projection; the only surviving copy is in the Library of Congress.',
  sources: ['J. Lennart Berggren and Alexander Jones, *Ptolemy\'s Geography: An Annotated Translation of the Theoretical Chapters* (2000).', 'Jerry Brotton, *A History of the World in Twelve Maps* (2012), the chapters on Ptolemy and on Waldseemüller.', 'J. B. Harley and David Woodward (eds.), *The History of Cartography*, vol. 1 (1987), and vol. 3, ed. David Woodward, *Cartography in the European Renaissance* (2007).', 'John P. Snyder, *Flattening the Earth* (1993), the chapters on antiquity.'],
  sim: 'hp-ptolemy-world',
  construction: ['hp-ptolemy-first', 'hp-ptolemy-second']
},

{
  id: 'medieval-and-portolan-charts',
  parent: 'polyhedral-and-history',
  title: 'Medieval maps and portolan charts',
  level: 2,
  short: 'The T-O diagrams and mappae mundi of the Middle Ages, which show a Christian order rather than routes, and the portolan charts of the Mediterranean from about 1300: a plane chart covered by rhumb lines from compass roses, drawn from sailors\' bearings and distances.',
  keywords: ['T-O map', 'mappa mundi', 'Hereford', 'Ebstorf', 'portolan', 'portolano', 'rhumb lines', 'wind rose', 'compass', 'Carta Pisana', 'Vesconte', 'Catalan Atlas', 'plane chart', 'marteloio'],
  prereq: ['ancient-world-maps', 'equirectangular-projection', 'great-circles-and-rhumb-lines'],
  related: ['mercator-1569', 'charts-and-navigation', 'ptolemys-geography', 'scale-factor-and-standard-parallels'],
  body: `After Rome, the map of the world in Latin Europe was usually a diagram of meaning, not of distance. The commonest is the **T-O map**: a circle (the O of the ocean) divided by a T, whose stem is the Mediterranean and whose bar is the Don on one side and the Nile on the other. East is at the top, the "orient", so Asia fills the upper half and Europe and Africa the two lower quarters: a sorting of the three continents of the known world. Isidore of Seville drew it in the seventh century, and it was one of the first maps printed in Europe (Augsburg, 1472). The great **mappae mundi** of the thirteenth century, such as the Hereford map of about 1300 on a single calfskin and the Ebstorf map (destroyed in 1943), fill the same frame with Jerusalem at the centre, the Earthly Paradise at the top and the monsters and wonders reported by writers. They are encyclopedias; nobody could sail by them.

### The portolan chart
Round the Mediterranean sailors had their own maps. From about 1300 we have **portolan charts**: detailed drawings on one sheepskin of the coasts of the Mediterranean and the Black Sea and of the Atlantic coast of Europe, with every port, headland and island in place, the names written at right angles to the coast, and a web of straight lines across the sheet. The oldest known, the Carta Pisana, dates from about the end of the thirteenth century; the Genoese Pietro Vesconte signed charts from 1311; the Catalan Atlas of Abraham Cresques (1375) puts the portolan coasts into a whole-world picture. The name comes from the *portolano*, a book of sailing directions for harbours.

### The rhumb network
The lines are the key. A chart carries compass roses, usually in a ring of sixteen, and from each rose sixteen lines, one for each wind. A pilot lays a straight edge between his port and his destination, slides it parallel to the nearest line through a rose and reads the wind to steer; the distance is read off the scale bar in miles. The chart itself was put together from bearings taken with the magnetic compass and from estimated distances, joined piece by piece; and as the Mediterranean is only a few thousand kilometres across and lies between 30° and 45° N, the result is remarkably good.

### What projection is it?
None, and that is the point. The charts treat the sea as a plane, with degrees of latitude and longitude drawn alike, or with the east–west scale set by the parallel in the middle of the sea. This **plane chart** agrees with the globe near its standard parallel and the wind lines are true bearings only there. The Mediterranean appears turned by several degrees on these charts (nine or ten is the usual estimate) because the bearings were magnetic. Carried out into the Atlantic or north to the Baltic, the plane chart fails: the wind lines are no longer true. Pedro Nunes showed in 1537 that a course of constant bearing is a spiral on the globe, not a straight line on a plane chart; Mercator\'s chart (1569) was the answer.

### Drawing it
The construction draws the rose with the T-square, the 45° set square, the compass and the dividers, and then the net of two roses with the set square. The sim sets the plane chart against the Mercator chart with a rose at any harbour.`,
  ideas: [
    'T-O maps and mappae mundi are diagrams of the Christian world, not routes: east at the top, Jerusalem at the centre.',
    'A portolan chart is a plane chart of the Mediterranean made from compass bearings and estimated distances, covered by rhumb lines from compass roses.',
    'A pilot reads a course by sliding a straight edge parallel to the nearest wind line; the lines are true only near the parallel at which the chart is true.',
    'In the Atlantic and at high latitudes the plane chart fails; Nunes (1537) explained why and Mercator (1569) designed the chart that does not.'
  ],
  pitfalls: [
    'T-O maps were maps for travellers — They are diagrams of the three continents with Jerusalem at the centre, made to teach, not to find the way.',
    'Medieval people thought the Earth was flat — The mappae mundi show the known land as a disc, but scholars from Bede to Sacrobosco knew the Earth was a sphere.',
    'Portolan charts are drawn on a projection — They have none in the strict sense: they are plane charts, older than Mercator by two centuries, and the lines are correct only near the standard parallel.'
  ],
  formulas: [
    {
      name: 'Angle at which a true bearing appears on a plane chart',
      expr: 'beta = atan(tan(theta)*cos(phi0)/cos(phi))',
      tex: '\\tan\\beta = \\tan\\theta\\,\\frac{\\cos\\varphi_0}{\\cos\\varphi}',
      vars: {
        beta: { name: 'angle of the line on the chart, from north', q: 'angle', unit: '°', tex: '\\beta' },
        theta: { name: 'true compass bearing of the course', q: 'angle', unit: '°', value: 45, min: 0, max: 89, tex: '\\theta' },
        phi0: { name: 'parallel at which the chart is true', q: 'angle', unit: '°', value: 36, min: 0, max: 80, tex: '\\varphi_0' },
        phi: { name: 'latitude of the harbour', q: 'angle', unit: '°', value: 42, min: 0, max: 80, tex: '\\varphi' }
      },
      note: 'On a plane chart a degree of longitude is drawn cos φ₀ as long as a degree of latitude, but on the ground it is cos φ as long: east–west distances are stretched by cos φ₀ / cos φ, and a course leans more towards the east than it should when φ > φ₀.'
    },
    {
      name: 'East–west stretch of the plane chart',
      expr: 's = cos(phi0)/cos(phi)',
      tex: 's = \\frac{\\cos\\varphi_0}{\\cos\\varphi}',
      vars: {
        s: { name: 'east–west scale against the north–south scale' },
        phi0: { name: 'parallel at which the chart is true', q: 'angle', unit: '°', value: 36, min: 0, max: 80, tex: '\\varphi_0' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 64, min: 0, max: 85, tex: '\\varphi' }
      },
      note: 'It is 1 on the standard parallel. At Reykjavik (64°) a chart true at 36° stretches east–west distances 1.86 times.'
    }
  ],
  examples: [
    {
      title: 'Rome and Reykjavik on a chart true at 36°',
      q: 'A portolan chart is true at $36°$ N. At Rome ($41.9°$ N) and at Reykjavik ($64.2°$ N) a pilot draws a wind line at $45°$ on the chart (the north-east wind) and sails a true north-east course by the compass. At what angle does his true track appear on the chart, and how far is it from the line he drew?',
      steps: [
        { text: 'A true bearing $\\theta$ appears on the chart at $\\beta$ with $\\tan\\beta = \\tan\\theta\\,\\cos\\varphi_0/\\cos\\varphi$. At Rome the stretch is', tex: '\\frac{\\cos 36°}{\\cos 41.9°} = \\frac{0.809}{0.744} = 1.087' },
        { text: 'For $\\theta = 45°$:', tex: '\\beta = \\arctan 1.087 = 47.4°' },
        'At Rome the true track leaves at 47.4° against the drawn line at 45°: 2.4° apart, which a sailor might never notice.',
        { text: 'At Reykjavik the stretch is', tex: '\\frac{0.809}{0.436} = 1.855,\\quad \\beta = \\arctan 1.855 = 61.7°' },
        'There the true north-east track appears at 61.7°, 16.7° away from the line drawn at 45°: after a few hundred kilometres the ship is far from where the chart says it should be.'
      ],
      a: 'The true track is 2.4° from the drawn line at Rome and 16.7° at Reykjavik.'
    }
  ],
  quiz: [
    { q: 'In a T-O map, what does the vertical stem of the T stand for?', choices: ['The Nile', 'The Mediterranean Sea', 'The Red Sea', 'The Danube'], a: 1, why: 'The stem is the Mediterranean, with Europe on one side and Africa on the other; the bar is the Don and the Nile, dividing Asia from the other two.' },
    { q: 'How do portolan charts differ from the map projections that came later?', choices: ['They use Mercator\'s formula', 'They treat the sea as a plane and the wind lines as straight lines of constant bearing', 'They are drawn on a cone', 'They use a graticule of meridians and parallels'], a: 1, why: 'They are plane charts without a graticule: the lines are drawn straight on the sheet at the compass angles.' },
    { q: 'Where does a plane chart true at 36° show true bearings best?', choices: ['At the equator', 'Near 36° N', 'At the pole', 'Everywhere'], a: 1, why: 'At the standard parallel the east–west and north–south scales agree and angles are true; elsewhere the error grows.' },
    { q: 'A course of constant bearing on the globe is a straight line on a portolan (plane) chart at any latitude.', a: false, why: 'On the globe it is a spiral (a loxodrome); on a plane chart it is straight only to the first approximation, near the standard parallel.' },
    { q: 'By what factor does a plane chart true at 36° stretch east–west distances at 64° N?', answer: 1.855, why: 'cos 36° / cos 64.2° = 0.809 / 0.436 = 1.855.' }
  ],
  applications: [
    'Sea charts today still carry compass roses and rhumb lines, and pilots still lay a parallel rule across a chart: a portolan habit.',
    'Dead reckoning with the *toleta de marteloio*: a table that solved the triangle of a course, a distance and a change of course, and which led to the traverse table.',
    'Historians use the charts to date voyages and to measure the magnetic declination of 1300 from the tilt of the Mediterranean.',
    'Georeferencing old charts in a GIS: a rotation and two scales fit a portolan to a modern map of the Mediterranean to a few kilometres.'
  ],
  history: 'Isidore of Seville (about 560–636) described the T-O diagram in his *Etymologiae*, printed with a T-O map at Augsburg in 1472. The Hereford map and the Ebstorf map date from about 1300; al-Idrisi drew his world map for Roger II of Sicily in 1154. Portolan charts begin with the Carta Pisana (about the end of the thirteenth century), Pietro Vesconte of Genoa (signed charts from 1311) and the Majorcan school (Angelino Dulcert, 1339; the Catalan Atlas of Cresques, 1375). Alexander Neckam described the sailors\' magnetic needle in Europe about 1190. Pedro Nunes showed the nature of the rhumb line in 1537, and the Portuguese added a latitude scale to the charts in the fifteenth century.',
  sources: ['J. B. Harley and David Woodward (eds.), *The History of Cartography*, vol. 1 (1987), the chapters on medieval maps and portolan charts.', 'Jerry Brotton, *A History of the World in Twelve Maps* (2012), the chapters on al-Idrisi and the Hereford map.', 'John P. Snyder, *Flattening the Earth* (1993), the early chapters.', 'Tony Campbell, "Portolan charts from the late thirteenth century to 1500", in *The History of Cartography*, vol. 1.'],
  sim: 'hp-portolan-vs-mercator',
  construction: 'hp-portolan-rhumbs'
},

{
  id: 'mercator-1569',
  parent: 'polyhedral-and-history',
  title: 'Mercator\'s map of 1569',
  level: 2,
  short: 'The world chart of 1569 "for the use of navigators", on which Gerardus Mercator spread the parallels so that a course of constant bearing is a straight line: how he made it (by adding secants), who proved it (Wright, 1599, then Bond, Gregory, Barrow and Halley) and why it won.',
  keywords: ['Mercator', '1569', 'Wright', 'meridional parts', 'secant', 'loxodrome', 'rhumb line', 'Nunes', 'Certaine Errors in Navigation', 'navigation chart', 'Atlas', 'Duisburg'],
  prereq: ['mercator-projection', 'medieval-and-portolan-charts', 'conformal-maps'],
  related: ['lambert-1772', 'web-mercator', 'great-circles-and-rhumb-lines', 'charts-and-navigation', 'gnomonic-projection'],
  body: `Gerardus Mercator (1512–1594) was a Flemish geographer and instrument maker, born near Antwerp and working at Leuven and, from 1552, at Duisburg. In 1569 he published a wall map of the world on eighteen sheets, about two metres wide, with a long Latin title ending *ad usum navigantium emendate accommodata*: "adapted and corrected for the use of sailors". Only a few copies survive.

### The problem it solved
A sailor steers by the compass and holds one bearing for a long time. On the globe such a path crosses every meridian at the same angle and winds in towards the pole: a **loxodrome** or rhumb line (Pedro Nunes had shown this in 1537). On a plane chart it is not straight, and the navigator must correct for it. Mercator\'s idea was to keep the meridians straight and parallel, and to increase the spacing of the parallels with latitude so that **every small shape is drawn in its true proportions**. Then angles are true and the rhumb line is straight.

### Adding secants
On a map with equally spaced meridians the east–west distances are too large by the factor $\\sec\\varphi$ at latitude $\\varphi$, because the meridians converge on the globe. To keep proportions, a short piece of meridian at that latitude must be stretched by the same factor. So the distance of a parallel from the equator is the sum of small lengths of meridian, each multiplied by the secant of its latitude. Mercator did the sum with a table, band by band, and never explained how: the map is the evidence. The English mathematician Edward Wright published the method and a table of "meridional parts", to the minute, in *Certaine Errors in Navigation* (1599). In the next century the sum was recognised as a logarithm,
$$y = R\\ln\\tan\\!\\left(\\frac{\\pi}{4} + \\frac{\\varphi}{2}\\right),$$
noticed in the tables by Henry Bond about 1645, proved by James Gregory (1668) and Isaac Barrow (1670), and derived by Edmond Halley (1695) with the help of series.

### The rhumb line on the chart
On a Mercator chart the rhumb line is a straight line and the course is measured with a protractor: $\\tan\\theta = \\Delta\\lambda / \\Delta\\psi$, where $\\psi = \\ln\\tan(\\pi/4 + \\varphi/2)$ is the Mercator ordinate and $\\theta$ is the angle from north. The line is not the shortest route; that is the great circle, a curve on this chart. The navigator plots the great circle on a gnomonic chart, reads off points on it, and transfers them to the Mercator chart as a chain of straight courses.

### Why it took a long time
A Mercator chart needs the table or the logarithms and a bigger sheet, and it exaggerates the high latitudes. It took the best part of a century for it to spread, and it became the standard sea chart in the 1700s. Mercator\'s *Atlas* (1595, published by his son after his death) gave the name to every book of maps.

### Drawing it by hand
Draw a circle whose radius $d$ is the length of one band of the map, and the tangent at its end. The rays at the middle latitudes of the bands cut the tangent at lengths $d\\sec\\varphi$. The dividers carry each ray length up the central meridian: addition done with the dividers. The construction on this page does exactly that.`,
  ideas: [
    'Mercator kept the meridians parallel and spread the parallels by sec φ so that every small shape keeps its proportions: angles are true and a course of constant bearing is a straight line.',
    'The distance of a parallel from the equator is a sum of small meridian lengths each times sec φ: a table of secants added up band by band.',
    'Wright\'s table of meridional parts (1599) made the chart usable; the logarithmic formula was found and proved in the 17th century.',
    'The rhumb line is straight on the chart but not the shortest route: the great circle is a curve.'
  ],
  pitfalls: [
    'Mercator projected the globe onto a cylinder from its centre — That is the central cylindrical projection (y = R tan φ). Mercator\'s is not a geometric projection at all: it is the sum of secants, a mathematical construction.',
    'The chart was an instant success — Navigators went on using plane charts for decades; the table and the method reached the sailors only with Wright (1599) and after.',
    'Mercator distorted the world on purpose — He designed a chart in which compass courses are straight lines. The stretching of the polar regions is the price of that property, not a political choice.'
  ],
  formulas: [
    {
      name: 'Distance of a parallel from the equator',
      expr: 'y = R*ln(tan(pi/4 + phi/2))',
      tex: 'y = R\\ln\\tan\\left(\\frac{\\pi}{4} + \\frac{\\varphi}{2}\\right)',
      vars: {
        y: { name: 'distance from the equator on the chart', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100, min: 1 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: -85, max: 85, signed: true, tex: '\\varphi' }
      },
      note: 'The sum of secants in the limit of very thin bands.'
    },
    {
      name: 'Length of one band of meridian on the chart',
      expr: 'dy = R*dphi/cos(phi)',
      tex: '\\Delta y = \\frac{R\\,\\Delta\\varphi}{\\cos\\varphi}',
      vars: {
        dy: { name: 'height of the band on the chart', q: 'length', unit: 'mm', tex: '\\Delta y' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100, min: 1 },
        dphi: { name: 'height of the band in latitude', q: 'angle', unit: '°', value: 10, min: 0.01, max: 20, tex: '\\Delta\\varphi' },
        phi: { name: 'middle latitude of the band', q: 'angle', unit: '°', value: 25, min: 0, max: 85, tex: '\\varphi' }
      },
      note: 'Mercator\'s step: the band on the globe has length R Δφ; on the chart it is stretched by sec φ at its middle.'
    },
    {
      name: 'Course of a rhumb line',
      expr: 'tan(theta) = dlam/dpsi',
      solveFor: 'theta',
      tex: '\\tan\\theta = \\frac{\\Delta\\lambda}{\\Delta\\psi}',
      vars: {
        theta: { name: 'course, measured from north (negative: west of north)', q: 'angle', unit: '°', signed: true, min: -89.5, max: 89.5, tex: '\\theta' },
        dlam: { name: 'difference of longitude', q: 'angle', unit: '°', value: -61.6, min: -180, max: 180, signed: true, tex: '\\Delta\\lambda' },
        dpsi: { name: 'difference of the Mercator ordinates ln tan(π/4 + φ/2)', value: 0.2192, signed: true, tex: '\\Delta\\psi' }
      },
      note: 'Δψ = ψ₂ − ψ₁ with ψ = ln tan(45° + φ/2) in radians; Δλ east is positive. The formula gives the angle between −90° and 90°; the course is that angle from north when Δψ > 0, and the opposite direction (add 180°) when Δψ < 0.'
    }
  ],
  examples: [
    {
      title: 'Adding secants by hand',
      q: 'Find the distance from the equator of the parallel of $20°$ on a Mercator chart with $R = 100$ mm, using two bands of $10°$, and compare with the formula.',
      steps: [
        'Band length on the globe: $R \\times 10° = 100 \\times 0.17453 = 17.453$ mm.',
        { text: 'The middle latitudes are $5°$ and $15°$; $\\sec 5° = 1.0038$ and $\\sec 15° = 1.0353$. The sum:', tex: '17.453 \\times (1.0038 + 1.0353) = 35.59\\ \\text{mm}' },
        { text: 'The formula gives', tex: 'y = 100 \\ln\\tan 55° = 100 \\times 0.35638 = 35.64\\ \\text{mm}' },
        'The two bands of ten degrees come within 0.2 %; Mercator\'s one-degree steps would be much closer.'
      ],
      a: '35.6 mm by the sum, 35.64 mm by the formula (0.14 % apart).'
    },
    {
      title: 'A rhumb-line course',
      q: 'What constant course takes a ship from Cape Town ($33.93°$ S, $18.42°$ E) to Rio de Janeiro ($22.91°$ S, $43.17°$ W)?',
      steps: [
        { text: 'The Mercator ordinates: $\\psi(-33.93°) = -0.6302$, $\\psi(-22.91°) = -0.4110$, so', tex: '\\Delta\\psi = 0.2192' },
        { text: 'The difference of longitude is $-43.17° - 18.42° = -61.59° = -1.0749$ rad:', tex: '\\tan\\theta = \\frac{-1.0749}{0.2192} = -4.904,\\quad \\theta = -78.5°' },
        'A negative angle is west of north: the course is 78.5° west of north, a bearing of $281.5°$ (west by north).'
      ],
      a: 'A bearing of 281.5° (78.5° west of north).'
    }
  ],
  quiz: [
    { q: 'On a Mercator chart a course of constant compass bearing is', choices: ['a curve bowing towards the pole', 'a straight line', 'a circle', 'a spiral'], a: 1, why: 'The chart is conformal and the meridians are parallel, so a line that crosses every meridian at the same angle is straight.' },
    { q: 'What is the distance of the 60° parallel from the equator, in units of the radius R of the globe drawn?', answer: 1.317, why: 'y/R = ln tan(45° + 30°) = ln tan 75° = ln 3.732 = 1.317.' },
    { q: 'Who first published an accurate table of meridional parts?', choices: ['Gerardus Mercator, on the map itself', 'Edward Wright, in 1599', 'Pedro Nunes, in 1537', 'Edmond Halley, in 1695'], a: 1, why: 'Wright\'s *Certaine Errors in Navigation* (1599) gave the method and the table to the minute; Halley later derived the formula without calculus.' },
    { q: 'The rhumb line between two ports is the shortest route between them.', a: false, why: 'The shortest route is the great circle, which on a Mercator chart is a curve bowing towards the pole. The rhumb line has a constant bearing and is longer.' },
    { q: 'Mercator explained in the map how he spaced the parallels.', a: false, why: 'He did not; the method was reconstructed and published by Edward Wright thirty years later.' }
  ],
  applications: [
    'Nautical charts: a course read once with a protractor is held on the compass all the way; practically every sea chart is a Mercator chart.',
    'Aviation and navigation software: rhumb-line courses and loxodrome distances are computed with the Mercator ordinate.',
    'Web maps use the same spacing of the parallels in the Web Mercator tiles (see [[web-mercator]]).',
    'Teaching conformal mapping: the Mercator chart is the simplest example of an angle-preserving map and of the way a map\'s property decides its use.'
  ],
  history: 'Gerardus Mercator (Gerard de Kremer, 1512–1594), born at Rupelmonde in Flanders, made globes (1541, 1551), a map of Europe (1554) and, in 1569 at Duisburg, the world chart on eighteen sheets. Edward Wright (about 1558–1615) published the method and the table of meridional parts in 1599. Henry Bond noticed about 1645 that the tabulated values agree with the logarithm of a tangent; James Gregory (1668) and Isaac Barrow (1670) proved it; Edmond Halley derived it in 1695. Mercator\'s *Atlas* appeared in 1595, after his death.',
  sources: ['Mark Monmonier, *Rhumb Lines and Map Wars: A Social History of the Mercator Projection* (2004).', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), the chapter on the Renaissance.', 'Jerry Brotton, *A History of the World in Twelve Maps* (2012), the chapter on Mercator.', 'Edward Wright, *Certaine Errors in Navigation* (1599).'],
  sim: { id: 'hp-portolan-vs-mercator', params: { port: 'Reykjavik', range: 2500 } },
  construction: 'hp-mercator-secants'
},

{
  id: 'lambert-1772',
  parent: 'polyhedral-and-history',
  title: 'Lambert and the mathematics of maps',
  level: 3,
  short: 'Johann Lambert\'s Anmerkungen of 1772 treated map projection as mathematics and gave the conformal conic, the azimuthal and cylindrical equal-area maps and the transverse Mercator. Euler, Lagrange and Gauss then built the theory, and Gauss\'s theorema egregium showed why every flat map must lie.',
  keywords: ['Lambert', '1772', 'Anmerkungen', 'conformal conic', 'azimuthal equal-area', 'cylindrical equal-area', 'transverse Mercator', 'Euler', 'Lagrange', 'Gauss', 'theorema egregium', 'conformal', 'equal-area'],
  prereq: ['mercator-1569', 'conformal-maps', 'equal-area-maps', 'tissot-indicatrix'],
  related: ['lambert-conformal-conic', 'lambert-azimuthal-equal-area', 'lambert-cylindrical-equal-area', 'transverse-mercator-and-utm', 'surveys-and-national-grids'],
  body: `Johann Heinrich Lambert (1728–1777) was born in Mulhouse, the son of a tailor, taught himself mathematics and physics, and in 1764 was called to Berlin by the Academy of Frederick the Great. He proved that $\\pi$ is irrational, wrote on the parallel postulate and on light (a cosine law carries his name), and on the form of a new logic. In 1772, in the third volume of his *Beyträge zum Gebrauche der Mathematik*, he published the *Anmerkungen und Zusätze zur Entwerfung der Land- und Himmelscharten*, "notes and additions on the construction of land and sky maps". It is the first book to treat map projection as a problem of mathematics: *which properties can a flat map of the sphere have, and what is its formula?*

### Conformal and equal-area
Before Lambert a projection was a geometrical construction or a recipe. Lambert asked first for a property and then derived the map. The two he cared about most are the **conformal** maps, which keep every angle, and the **equal-area** maps, which keep every area. The two properties exclude each other on the sphere: a map with both would keep all lengths, and Euler showed five years later that no such map exists. Out of the approach came seven new projections; four of them are in daily use.

- **The conformal conic:** a cone cutting the sphere along two parallels, the radius of the parallel at latitude $\\varphi$ proportional to $\\tan^{-n}(45° + \\varphi/2)$, where the cone constant is $n = \\ln(\\cos\\varphi_1/\\cos\\varphi_2) / \\ln\\big(\\tan(45° + \\varphi_2/2)/\\tan(45° + \\varphi_1/2)\\big)$.
- **The azimuthal equal-area:** a point at angular distance $c$ from the centre is drawn at the distance $2R\\sin(c/2)$, the chord.
- **The cylindrical equal-area:** the sphere projected straight onto the cylinder, $y = R\\sin\\varphi$, by Archimedes\' theorem on the area of a zone.
- **The transverse Mercator:** Mercator\'s cylinder turned to touch a meridian, with Lambert\'s formulas for the sphere.

### After Lambert
Leonhard Euler (1777) proved that no map of the sphere keeps all lengths, and gave the conditions for conformal and equal-area maps. Joseph-Louis Lagrange (1779) found all the conformal maps in which meridians and parallels are circles. Carl Friedrich Gauss, surveying the kingdom of Hanover, solved the general problem of conformal mapping in 1822, and in 1827, in the *Disquisitiones generales circa superficies curvas*, proved the *theorema egregium* ("remarkable theorem"): the curvature of a surface does not change when the surface is bent without stretching. The sphere has curvature $1/R^2$ and the plane none, so **no flat map can be faithful**: distortion is a theorem, not a failure of craft.

### Where they work today
The conformal conic is the standard chart of aviation and the basis of the French national grid (Lambert-93); the azimuthal equal-area is the European Union\'s grid for statistics; the cylindrical equal-area is behind the equal-area world maps of Gall and Peters; the transverse Mercator is the projection of the UTM and of nearly every national survey (see [[transverse-mercator-and-utm]] and [[surveys-and-national-grids]]).`,
  ideas: [
    'Lambert asked first for a property (angles kept, or areas kept) and derived the map: the beginning of the mathematical theory of projection.',
    'Conformal and equal-area maps exclude each other on the sphere: a map with both would keep all lengths, and Euler proved that none does.',
    'Lambert\'s four classics: conformal conic, azimuthal equal-area (chord distance 2R sin(c/2)), cylindrical equal-area (y = R sin φ), transverse Mercator.',
    'Gauss\'s theorema egregium: curvature is intrinsic, a sphere cannot be flattened without stretching, so every flat map distorts.'
  ],
  pitfalls: [
    'A map can be both conformal and equal-area if the region is small enough — Only locally and only approximately: a small patch is nearly flat so both errors are small, but exactly both is impossible at any size, for the sphere is curved everywhere.',
    'Lambert invented the Mercator-type map — Lambert\'s transverse Mercator is Mercator\'s cylinder turned on its side; the idea of a conformal cylindrical map is Mercator\'s.',
    'The theorema egregium is about maps — It is about surfaces: the curvature can be found from distances measured on the surface alone, and from that follows that no distance-true map of a sphere exists.'
  ],
  formulas: [
    {
      name: 'Cone constant of the conformal conic',
      expr: 'n = ln(cos(phi1)/cos(phi2))/ln(tan(pi/4+phi2/2)/tan(pi/4+phi1/2))',
      tex: 'n = \\frac{\\ln(\\cos\\varphi_1 / \\cos\\varphi_2)}{\\ln\\big(\\tan(\\pi/4 + \\varphi_2/2) / \\tan(\\pi/4 + \\varphi_1/2)\\big)}',
      vars: {
        n: { name: 'cone constant: the angle between meridians on the map divided by their difference of longitude' },
        phi1: { name: 'first standard parallel', q: 'angle', unit: '°', value: 44, min: 1, max: 85, tex: '\\varphi_1' },
        phi2: { name: 'second standard parallel', q: 'angle', unit: '°', value: 49, min: 1, max: 85, tex: '\\varphi_2' }
      },
      note: 'For the French Lambert-93 projection (44° and 49° N) n = 0.7256 (on the sphere 0.72560, on the ellipsoid 0.72561).'
    },
    {
      name: 'Radius on the azimuthal equal-area map',
      expr: 'rho = 2*R*sin(c/2)',
      tex: '\\rho = 2R_\\oplus\\sin\\frac{c}{2}',
      vars: {
        rho: { name: 'distance from the centre of the map', q: 'length', unit: 'km' },
        R: { const: 'Rearth' },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 45, min: 0, max: 179, tex: 'c' }
      },
      note: 'It is the chord of the arc c: straight lines from the centre to the point on the sphere. The true distance is R c, longer than the chord.'
    },
    {
      name: 'Height on the cylindrical equal-area map',
      expr: 'y = R*sin(phi)',
      tex: 'y = R\\sin\\varphi',
      vars: {
        y: { name: 'distance of the parallel from the equator', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100, min: 1 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 30, min: -90, max: 90, signed: true, tex: '\\varphi' }
      },
      note: 'Archimedes: the area of a zone of a sphere is 2πR times its height, the same as the area of the cylinder between the same planes.'
    }
  ],
  examples: [
    {
      title: 'The cone constant of Lambert-93',
      q: 'The French projection Lambert-93 is a conformal conic with standard parallels $44°$ and $49°$ N. Find its cone constant $n$ (on the sphere).',
      steps: [
        { text: 'Numerator:', tex: '\\ln(\\cos 44° / \\cos 49°) = \\ln(0.71934/0.65606) = 0.09208' },
        { text: 'Denominator: $45° + 44°/2 = 67°$ and $45° + 49°/2 = 69.5°$,', tex: '\\ln\\big(\\tan 69.5° / \\tan 67°\\big) = \\ln(2.6746/2.3559) = 0.12691' },
        { text: 'Ratio:', tex: 'n = 0.09208/0.12691 = 0.7256' }
      ],
      a: 'n = 0.7256: the angle between two meridians on the map is 0.7256 times their difference of longitude.'
    }
  ],
  quiz: [
    { q: 'Which property do conformal maps keep?', choices: ['Areas', 'Angles (shapes of small regions)', 'Distances from the centre', 'Great circles as straight lines'], a: 1, why: 'A conformal map multiplies lengths at a point by the same factor in all directions, so angles are true.' },
    { q: 'What follows from Gauss\'s theorema egregium for map makers?', choices: ['A flat map can be made without distortion if the right projection is found', 'No flat map of the sphere can keep all lengths', 'Equal-area maps are conformal', 'Maps are impossible'], a: 1, why: 'Curvature cannot change under bending without stretching; the sphere has curvature 1/R² and the plane 0, so any flat map stretches somewhere.' },
    { q: 'On the cylindrical equal-area map, at what height y (in units of R) is the parallel of 30°?', answer: 0.5, why: 'y = R sin 30° = 0.5 R.' },
    { q: 'A point at angular distance c from the centre of Lambert\'s azimuthal equal-area map is drawn at', choices: ['R c', '2R sin(c/2)', 'R tan c', 'R sin c'], a: 1, why: 'The chord of the arc from the centre: 2R sin(c/2). R c would be the equidistant map, R tan c the gnomonic, R sin c the orthographic.' },
    { q: 'A map can be both conformal and equal-area at once if only the region is small enough.', a: false, why: 'Both together would mean keeping all lengths, which is impossible for any piece of the sphere however small; a small piece is only nearly flat.' }
  ],
  applications: [
    'Aeronautical charts and the French national grid (Lambert-93) use the conformal conic, with true angles for the pilot and a nearly constant scale over a wide east–west country.',
    'The azimuthal equal-area in the European Union\'s standard grid for statistics (ETRS89-LAEA) and in polar maps.',
    'Equal-area gridding of the Earth for ice and snow data: NSIDC\'s EASE-Grid uses Lambert\'s equal-area projections.',
    'The transverse Mercator in UTM and in the national grids of Britain, Germany, Israel and many other countries.'
  ],
  history: 'Johann Heinrich Lambert (1728–1777) published his notes on map projections in 1772. Leonhard Euler wrote on the representation of the sphere on the plane in 1777, Joseph-Louis Lagrange in 1779. Carl Friedrich Gauss won the Copenhagen academy\'s prize in 1822 for the general solution of the conformal mapping problem and proved the theorema egregium in 1827. Johann Heinrich Louis Krüger gave Gauss\'s transverse Mercator its working formulas in 1912.',
  sources: ['John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), the chapters on the eighteenth century.', 'Johann Heinrich Lambert, *Anmerkungen und Zusätze zur Entwerfung der Land- und Himmelscharten* (1772); English translation by W. R. Tobler (1972).', 'Carl Friedrich Gauss, *Disquisitiones generales circa superficies curvas* (1827).'],
  sim: 'hp-lambert-1772',
  construction: 'hp-lambert-four'
},

{
  id: 'surveys-and-national-grids',
  parent: 'polyhedral-and-history',
  title: 'Surveys, datums and national grids',
  level: 2,
  short: 'How a nation is mapped: one baseline, a chain of triangles, an ellipsoid fitted to the country (a datum) and a transverse Mercator grid in metres, from the Cassinis\' France and the Ordnance Survey to UTM, the British and Israeli grids and GPS.',
  keywords: ['triangulation', 'baseline', 'datum', 'ellipsoid', 'WGS 84', 'Airy', 'Clarke', 'UTM', 'Gauss–Krüger', 'Ordnance Survey', 'national grid', 'Israel Transverse Mercator', 'GPS', 'Cassini', 'Survey of India', 'Everest'],
  prereq: ['transverse-mercator-and-utm', 'lambert-1772', 'scale-factor-and-standard-parallels'],
  related: ['gps-and-web-maps', 'surveying-and-site-plans', 'cassini-projection', 'web-mercator', 'charts-and-navigation'],
  body: `A national map starts on the ground. The recipe was the same in Paris, London and Madras: measure one baseline with the greatest care, then **triangulate**. From the two ends of a known side the angles to a new station fix the station, and the chain of triangles runs across the country while only angles are measured. A second baseline measured at the far end tests the whole.

### Triangulation
Gemma Frisius described the method in 1533, and Willebrord Snellius used it in the Netherlands in 1615–17. Jean Picard measured a degree of the meridian near Paris with it in 1669–70. The Cassini family carried it across France from 1733 and produced the first national survey map (182 sheets at 1:86,400, finished about 1790). In Britain William Roy measured a baseline on Hounslow Heath in 1784 and the Ordnance Survey, founded in 1791, took his triangles forward. In India William Lambton began the Great Trigonometrical Survey at Madras in 1802, and George Everest carried its Great Arc to the Himalaya. The longest arc is Struve\'s, 2820 km from Hammerfest to the Black Sea (1816–55). The computation is the sine rule, then a correction for the curvature of the Earth: a triangle of 200 km² has an angle sum a second of arc above 180°.

### The shape of the Earth and the datum
The arc measurements (to Lapland and Peru, 1735–44) showed that the Earth is flattened at the poles, and a survey needs a mathematical surface to compute on: an **ellipsoid**. Each country fitted one to its own arcs and fixed it to the ground at an origin it chose: Airy\'s ellipsoid of 1830 for Britain, Everest\'s for India, Clarke\'s of 1866 for North America (origin at Meades Ranch, Kansas), Bessel\'s of 1841 for Germany. An ellipsoid with its origin and orientation is a **datum**. Two datums can differ by a hundred metres or more at the same place, so a position read in one and plotted in the other is off by that. Satellites changed the arrangement: GPS works in a datum centred on the Earth\'s centre of mass, **WGS 84**, with an ellipsoid of semi-major axis 6 378 137 m and flattening 1/298.257.

### Grids
To draw the map the ellipsoid is projected, almost everywhere by the **transverse Mercator** (conformal, with a small scale error in a narrow north–south strip). Each strip has its own middle meridian and a scale a little under 1 there, so that the error is shared between the middle and the edges: the **Gauss–Krüger** zones of Germany, Russia and China (3° or 6° wide); the **UTM**, sixty zones of 6° with the scale 0.9996 on the middle meridian; the **British National Grid**, one zone with its middle meridian at 2° W, scale 0.9996013, on Airy\'s ellipsoid; the **Israeli grid**, with its middle meridian near 35.2° E and a scale of almost exactly 1, for a country no more than about 150 km wide. Each grid is in metres, with a false origin that keeps every coordinate positive.

### Drawing it
Two constructions: the chain of triangles from a baseline, with the protractor, and the layout of the UTM zones and bands. The sim shows the sixty zones and the scale factor across one.`,
  ideas: [
    'A survey measures one baseline accurately and then only angles: a chain of triangles carries the position across the country.',
    'A datum is an ellipsoid plus its origin and orientation; the same latitude and longitude in two datums can be a hundred metres apart.',
    'National grids are transverse Mercator strips with a scale slightly below 1 on the middle meridian (0.9996 in UTM), so that the error is shared.',
    'GPS gives WGS 84 coordinates; to put them on a national map the datum must be changed.'
  ],
  pitfalls: [
    'Latitude and longitude are one thing — They are defined against an ellipsoid: the same point has different values in WGS 84 and in OSGB36 or NAD27, differing by tens to hundreds of metres.',
    'Grid north is true north — They agree only on the middle meridian of the zone; elsewhere the meridians converge on the pole and the grid lines do not, so the grid is rotated against true north by the convergence (about 1.6° at the edge of a zone at 32° N).',
    'The UTM scale is 0.9996 everywhere in the zone — It is 0.9996 on the middle meridian, 1 about 180 km out, and about 1.0010 at the zone edge on the equator.'
  ],
  formulas: [
    {
      name: 'UTM scale factor on a sphere',
      expr: 'k = k0/sqrt(1 - (cos(phi)*sin(dlam))^2)',
      tex: 'k = \\frac{k_0}{\\sqrt{1 - \\cos^2\\varphi\\,\\sin^2\\Delta\\lambda}}',
      vars: {
        k: { name: 'scale factor of the grid' },
        k0: { name: 'scale on the middle meridian', value: 0.9996, min: 0.99, max: 1.01, tex: 'k_0' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, min: 0, max: 84, tex: '\\varphi' },
        dlam: { name: 'longitude from the middle meridian', q: 'angle', unit: '°', value: 3, min: 0, max: 5, tex: '\\Delta\\lambda' }
      },
      note: 'On the ellipsoid the formula differs by a few parts in a million. The scale is k0 on the middle meridian and grows as the square of the distance from it.'
    },
    {
      name: 'Middle meridian of a UTM zone',
      expr: 'lam0 = 6*N - 183',
      tex: '\\lambda_0 = 6N - 183',
      vars: {
        lam0: { name: 'middle meridian (° E; negative west)', signed: true, tex: '\\lambda_0' },
        N: { name: 'zone number', int: true, value: 36, min: 1, max: 60 }
      },
      note: 'Zone 1 runs from 180° W to 174° W, its middle meridian is 177° W; zone 36 (Israel) has 33° E.'
    },
    {
      name: 'Sine rule for a side of the triangulation',
      expr: 'a = c*sin(alpha)/sin(gamma)',
      tex: 'a = \\frac{c\\,\\sin\\alpha}{\\sin\\gamma}',
      vars: {
        a: { name: 'side opposite the angle α', q: 'length', unit: 'm' },
        c: { name: 'known side (the baseline)', q: 'length', unit: 'm', value: 6000, min: 1 },
        alpha: { name: 'angle opposite the unknown side', q: 'angle', unit: '°', value: 55, min: 1, max: 178, tex: '\\alpha' },
        gamma: { name: 'angle opposite the known side', q: 'angle', unit: '°', value: 63, min: 1, max: 178, tex: '\\gamma' }
      },
      note: 'Valid for a plane triangle; on the Earth the angles must first be reduced by a third of the spherical excess each.'
    }
  ],
  examples: [
    {
      title: 'The first triangle of a chain',
      q: 'A baseline $AB$ of $6000$ m has been measured. From $A$ the angle to a station $C$ is $62°$ and from $B$ it is $55°$ (angles at $A$ and $B$ of the triangle). How far is $C$ from $A$ and from $B$?',
      steps: [
        'The third angle is $180° - 62° - 55° = 63°$.',
        { text: 'The side $AC$ is opposite the angle at $B$ ($55°$):', tex: 'AC = 6000 \\times \\frac{\\sin 55°}{\\sin 63°} = 6000 \\times \\frac{0.8192}{0.8910} = 5516\\ \\text{m}' },
        { text: 'The side $BC$ is opposite the angle at $A$ ($62°$):', tex: 'BC = 6000 \\times \\frac{\\sin 62°}{\\sin 63°} = 5946\\ \\text{m}' },
        'These two sides become the baselines of the next triangles.'
      ],
      a: 'AC = 5516 m, BC = 5946 m.'
    },
    {
      title: 'The UTM scale near Tel Aviv',
      q: 'Tel Aviv is at $34.78°$ E, $32.07°$ N. Which UTM zone is it in, and what is the grid scale there?',
      steps: [
        'The zone number is $\\lfloor(34.78 + 180)/6\\rfloor + 1 = 36$, with the middle meridian at $6 \\times 36 - 183 = 33°$ E.',
        { text: 'The distance from it is $\\Delta\\lambda = 1.78°$, so', tex: 'k = \\frac{0.9996}{\\sqrt{1 - (\\cos 32.07° \\sin 1.78°)^2}} = \\frac{0.9996}{\\sqrt{1 - 0.00069}} = 0.99995' },
        'That is about 170 km from the middle meridian, close to the lines of exact scale at 180 km: the error in a distance measured on the grid is a few parts in a hundred thousand.'
      ],
      a: 'Zone 36; the scale is 0.99995.'
    }
  ],
  quiz: [
    { q: 'After the baseline is measured, what does a triangulation survey measure?', choices: ['More baselines, one after another', 'Angles, with the theodolite', 'Heights with the barometer', 'Times of eclipses'], a: 1, why: 'The baseline gives the scale; each further station needs only the angles from two known stations.' },
    { q: 'What is a geodetic datum?', choices: ['A list of place names', 'A reference ellipsoid together with its origin and orientation relative to the Earth', 'A map projection', 'The time at the prime meridian'], a: 1, why: 'Coordinates are defined against a surface: change the ellipsoid or its position and the same point gets other coordinates.' },
    { q: 'Which UTM zone contains 2° W (give its number)?', answer: 30, why: 'Zone 30 runs from 6° W to 0°, with its middle meridian at 3° W; the zones are numbered eastwards from 180° W and (−2 + 180)/6 = 29.7, so the zone is 30.' },
    { q: 'Two datums can place the same latitude and longitude about a hundred metres apart.', a: true, why: 'OSGB36 and WGS 84 differ by about 100 m in Britain, NAD27 and NAD83 by tens to a hundred metres in North America.' },
    { q: 'What is the scale factor of the UTM grid on the middle meridian of a zone?', choices: ['1.0000', '0.9996', '1.0004', '0.9900'], a: 1, why: 'The cylinder is a little smaller than the globe, so the scale is 0.9996 on the middle meridian, 1 at about ±180 km and above 1 beyond.' }
  ],
  applications: [
    'GPS and GIS: a receiver reports WGS 84; mapping software converts to UTM or a national grid (EPSG 32636 for UTM 36 N, 27700 for the British grid, 2039 for the Israeli grid).',
    'Land registration and construction: boundaries and set-out points are given in grid coordinates in metres, with a scale factor to bring grid distances to ground distances.',
    'Aviation and the sea use WGS 84 latitude and longitude; military maps (NATO) use UTM or the military grid reference system.',
    'Archaeology and history: old surveys are placed on modern maps by changing the datum, from Cassini\'s France to the Survey of India.'
  ],
  history: 'Frisius proposed triangulation in 1533 and Snellius carried it out in 1615–17. Picard measured the meridian arc in 1669–70; the Cassinis surveyed France from 1733 (map finished about 1790); the expeditions of Maupertuis to Lapland and Bouguer and La Condamine to Peru (1735–44) showed the flattening of the Earth. William Roy\'s baseline on Hounslow Heath is of 1784 and the Ordnance Survey of 1791; the Great Trigonometrical Survey of India began in 1802, and George Everest was Surveyor General from 1830 to 1843. The Struve arc was measured in 1816–55. Gauss surveyed Hanover in 1820–44 and devised the conformal projection that Krüger developed in 1912. The UTM system was adopted by the US Army and NATO in the 1940s and 1950s; the British National Grid dates from 1936; GPS became fully operational in 1995, and its deliberate degradation was switched off on 2 May 2000.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the transverse Mercator and UTM chapters.', 'Ordnance Survey, *A Guide to Coordinate Systems in Great Britain* (the British National Grid and OSGB36).', 'Jerry Brotton, *A History of the World in Twelve Maps* (2012), the chapter on Cassini.', 'Matthew H. Edney and Mary S. Pedley (eds.), *The History of Cartography*, vol. 4: Cartography in the European Enlightenment (2020).'],
  sim: 'hp-utm-zones',
  construction: ['hp-triangulation', 'hp-utm-zones']
}

);
