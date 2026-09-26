/* HYPER-MATH · content/solid-geometry.js — three-dimensional shapes: how much they hold,
 * how much skin they have, and what happens to both when the size changes. */
Hyper.add(

{
  id: 'volume', parent: 'solid-geometry', title: 'Volume', level: 1,
  short: 'How much space a solid fills, counted in unit cubes. Prisms and cylinders are base area × height, pyramids and cones a third of that, and a sphere is (4/3)πr³.',
  keywords: ['volume', 'cubic metre', 'litre', 'capacity', 'prism', 'cylinder', 'cone', 'pyramid', 'sphere', 'Cavalieri', 'displacement', 'cm3', 'm3'],
  prereq: ['area', 'circles', 'exponents'],
  related: ['surface-area', 'scaling-laws', 'volumes-of-revolution', 'multiple-integrals', 'physics:density', 'physics:buoyancy'],
  body: `
How much water a tank holds, how much concrete a foundation needs, how much air a pair of lungs can take in: each is a **volume**, the amount of space inside a solid, counted in unit cubes. A box 4 cm by 3 cm by 2 cm holds 2 layers of $4 \\times 3$ one-centimetre cubes: 24 cm³.

### Units
A cubic metre is a cube 1 m along each edge. Since 1 m = 10 dm = 100 cm,

$$1\\ \\mathrm{m^3} = 1000\\ \\mathrm{L} = 10^6\\ \\mathrm{cm^3}, \\qquad 1\\ \\mathrm{L} = 1\\ \\mathrm{dm^3} = 1000\\ \\mathrm{cm^3}, \\qquad 1\\ \\mathrm{mL} = 1\\ \\mathrm{cm^3}$$

Volume units convert with the **cube** of the length factor, which is why a cubic metre holds a million cubic centimetres.

### Prisms and cylinders
Any solid with the same cross-section all the way along — a box, a triangular prism, a pipe, a cylinder — has

$$V = (\\text{area of the cross-section}) \\times (\\text{length})$$

For a cylinder of radius $r$ and height $h$, $V = \\pi r^2 h$.

**Cavalieri's principle** carries this further: if two solids have equal cross-sectional areas at every height, their volumes are equal. A neat stack of coins and the same stack pushed into a leaning tower contain the same metal, and a slanted cylinder has the volume of an upright one with the same base and height.

### Pyramids and cones: one third
A pyramid or cone that tapers to a point from a base of area $A$ at height $h$ has

$$V = \\tfrac13 A h$$

One way to see the third: a cube can be cut into three identical square-based pyramids, each with a face of the cube as its base and the same far corner as its apex. The [[definite-integral|integral]] proves it for any shape of base: at a fraction $t$ of the way up, the cross-section has area $A(1 - t)^2$, and $\\int_0^1 (1 - t)^2\\,dt = \\tfrac13$. A cone is therefore $\\tfrac13 \\pi r^2 h$.

### The sphere
Archimedes showed that a sphere fills exactly two-thirds of the smallest cylinder that holds it. That cylinder has radius $r$ and height $2r$, so its volume is $2\\pi r^3$, and

$$V = \\tfrac43 \\pi r^3$$

He asked for a sphere inside a cylinder to be carved on his tomb. The Earth, with $r = 6371\\ \\mathrm{km}$, has a volume of about $1.08 \\times 10^{21}\\ \\mathrm{m^3}$.

### Why volume matters in science
Mass is density times volume ([[physics:density|density]]), and a fluid pushes up on an immersed body with the weight of the fluid it displaces ([[physics:buoyancy|buoyancy]]) — the idea behind Archimedes' test of a gold crown. Solids with curved profiles are the business of [[volumes-of-revolution]], and in general of [[multiple-integrals|triple integrals]].

> [!fact] An engine's "capacity" is a volume. Four cylinders with a bore of 86 mm and a stroke of 86 mm sweep $4 \\times \\pi (4.3\\ \\mathrm{cm})^2 \\times 8.6\\ \\mathrm{cm} \\approx 2000\\ \\mathrm{cm^3}$: a 2.0-litre engine.
`,
  ideas: [
    'Volume counts unit cubes: 1 m³ = 1000 L = 10⁶ cm³, and 1 mL = 1 cm³.',
    'A prism or cylinder has volume = cross-section area × length.',
    'A pyramid or cone is one third of the prism with the same base and height.',
    'A sphere is (4/3)πr³: two-thirds of the cylinder that encloses it.'
  ],
  pitfalls: [
    '1 m³ = 100 cm³ — Every edge is 100 times longer, so 1 m³ = 100 × 100 × 100 = 1 000 000 cm³.',
    'A cone is half a cylinder — It is one third of the cylinder with the same base and height.',
    'Using the slant height in ⅓πr²h — The h in the volume formula is the perpendicular height from the base to the apex, not the length down the sloping side.'
  ],
  formulas: [
    {
      name: 'Cylinder',
      expr: 'V = pi*r^2*h', tex: 'V = \\pi r^2 h',
      vars: {
        V: { name: 'volume', q: 'volume', unit: 'L' },
        r: { name: 'radius', q: 'length', unit: 'cm', value: 30 },
        h: { name: 'height', q: 'length', unit: 'cm', value: 80 }
      },
      stories: {
        V: 'A cylindrical water butt has a radius of {r} and a height of {h}. How much does it hold?',
        h: 'A cylindrical tank of radius {r} must hold {V}. How tall must it be?'
      }
    },
    {
      name: 'Cone',
      expr: 'V = pi*r^2*h/3', tex: 'V = \\tfrac13 \\pi r^2 h',
      vars: {
        V: { name: 'volume', q: 'volume', unit: 'cm³' },
        r: { name: 'radius of the base', q: 'length', unit: 'cm', value: 2.5 },
        h: { name: 'perpendicular height', q: 'length', unit: 'cm', value: 10 }
      },
      stories: { V: 'An ice-cream cone has a rim of radius {r} and is {h} deep. How much does it hold, filled level?' }
    },
    {
      name: 'Sphere',
      expr: 'V = 4/3*pi*r^3', tex: 'V = \\tfrac43 \\pi r^3',
      vars: {
        V: { name: 'volume', q: 'volume', unit: 'L' },
        r: { name: 'radius', q: 'length', unit: 'cm', value: 12 }
      },
      stories: {
        V: 'A basketball has a radius of {r}. How much air is inside it?',
        r: 'A spherical balloon holds {V} of helium. What is its radius?'
      }
    },
    {
      name: 'Square pyramid',
      expr: 'V = a^2*h/3', tex: 'V = \\tfrac13 a^2 h',
      vars: {
        V: { name: 'volume', q: 'volume', unit: 'm³' },
        a: { name: 'side of the square base', q: 'length', unit: 'm', value: 230.3 },
        h: { name: 'height', q: 'length', unit: 'm', value: 146.6 }
      },
      stories: { V: 'The Great Pyramid of Giza was built with a square base {a} on a side and a height of {h}. What was its volume?' }
    }
  ],
  examples: [
    {
      title: 'How many litres in the tank?',
      q: 'A cylindrical tank is 1.2 m in diameter and 1.5 m tall. How many litres does it hold?',
      steps: [
        'Radius $r = 0.6\\ \\mathrm{m}$. $V = \\pi r^2 h = \\pi \\times 0.36 \\times 1.5 = 1.696\\ \\mathrm{m^3}$.',
        'One cubic metre is 1000 litres, so $V \\approx 1700\\ \\mathrm{L}$.'
      ],
      a: 'About 1700 litres'
    },
    {
      title: 'An ice-cream cone with a scoop on top',
      q: 'A cone of radius 2.5 cm and depth 10 cm is filled with ice cream and topped with a hemisphere of the same radius. How much ice cream is there?',
      steps: [
        'Cone: $\\tfrac13 \\pi (2.5)^2 (10) = 65.4\\ \\mathrm{cm^3}$.',
        'Hemisphere: half of $\\tfrac43 \\pi (2.5)^3$, that is $\\tfrac23 \\pi (15.625) = 32.7\\ \\mathrm{cm^3}$.',
        'Total: $65.4 + 32.7 = 98.2\\ \\mathrm{cm^3}$, about 98 mL.'
      ],
      a: 'About 98 cm³'
    }
  ],
  quiz: [
    { q: 'A cone and a cylinder have the same base and the same height. The cone holds…', choices: ['the same as the cylinder', 'half as much', 'a third as much', 'two-thirds as much'], a: 2,
      why: '$V_{\\text{cone}} = \\tfrac13 \\pi r^2 h$, a third of $\\pi r^2 h$. Two-thirds is the sphere-to-cylinder ratio.' },
    { q: 'Doubling the radius of a sphere multiplies its volume by…', choices: ['2', '4', '6', '8'], a: 3, why: '$V \\propto r^3$ and $2^3 = 8$.' },
    { q: 'How many litres are there in one cubic metre?', choices: ['10', '100', '1000', '1 000 000'], a: 2, why: 'A litre is a cube 10 cm on a side; ten of those fit along each edge of a metre cube: $10^3 = 1000$.' },
    { q: 'A cylinder has radius $x$ and a height equal to its diameter. Write its volume.', answer: '2*pi*x^3', vars: ['x'],
      why: '$V = \\pi x^2 \\cdot 2x = 2\\pi x^3$. The sphere that fits inside it, $\\tfrac43 \\pi x^3$, is exactly two-thirds of that.' },
    { q: 'Two solids that have equal cross-sectional areas at every height have equal volumes, even if one of them leans.', a: true,
      why: 'That is Cavalieri\'s principle: think of both as stacks of the same thin slices, merely shifted sideways.' }
  ],
  applications: [
    'Tanks, pipes and reservoirs: capacity in litres or cubic metres.',
    'Engine capacity, the volume swept by the pistons.',
    'Mass from density, and buoyancy from the volume of fluid displaced.'
  ],
  history: 'Democritus and Eudoxus knew that a cone is a third of its cylinder; Archimedes (3rd century BCE) found the volume and surface of the sphere by comparing it with a cylinder and a cone.'
},

{
  id: 'surface-area', parent: 'solid-geometry', title: 'Surface area', level: 1,
  short: 'The total area of a solid\'s outside: the sum of its faces for a box, an unrolled rectangle or sector for a cylinder or cone, and 4πr² for a sphere.',
  keywords: ['surface area', 'net', 'curved surface', 'lateral area', 'sphere 4 pi r^2', 'cylinder', 'cone', 'slant height', 'surface-to-volume ratio', 'paint', 'wrapping'],
  prereq: ['area', 'circles', 'volume'],
  related: ['scaling-laws', 'optimization', 'flux-integrals', 'physics:surface-tension', 'physics:thermal-radiation'],
  body: `
Wrap a present and the paper you need depends on the **surface area** of the box: the total area of its outside. For a solid with flat faces it is simply the sum of the faces. Curved surfaces are handled by unrolling them flat where that is possible, and by a cleverer argument where it is not.

### Nets: unfold and add up
Cut a cardboard box along some of its edges and it lies flat as a **net** of six rectangles. A box $l \\times w \\times h$ therefore has

$$A = 2(lw + lh + wh)$$

### Cylinders and cones
Unroll the curved side of a cylinder and it is a rectangle $2\\pi r$ wide (the circumference) and $h$ tall. With the two circular ends,

$$A = 2\\pi r h + 2\\pi r^2$$

The curved surface of a cone unrolls into a sector of a circle whose radius is the **slant height** $l = \\sqrt{r^2 + h^2}$ and whose arc is the circumference of the base, $2\\pi r$. Its area is $\\pi r l$; add $\\pi r^2$ for the base.

### The sphere: 4πr²
A sphere cannot be flattened without stretching or tearing — which is why every flat map of the Earth distorts something. Archimedes found its area another way: it equals the curved area of the cylinder that just encloses it, $2\\pi r \\times 2r$. Slice the sphere and the cylinder between any two heights, and the two bands have exactly the same area: the sphere's band is narrower but slanted, and the two effects cancel. So

$$A = 4\\pi r^2$$

— four times the area of the sphere's shadow, the disc $\\pi r^2$. The Earth's surface is $4\\pi (6371\\ \\mathrm{km})^2 \\approx 5.1 \\times 10^8\\ \\mathrm{km^2}$. Notice that the [[derivative]] of $\\tfrac43 \\pi r^3$ is $4\\pi r^2$: when a sphere grows a little, the extra volume is a thin skin of exactly that area.

### Surface against volume
For a given volume, the sphere has the least surface of any shape. Soap bubbles and raindrops are round because [[physics:surface-tension|surface tension]] pulls their skin as small as it will go. Anything that must exchange heat or material with its surroundings does the opposite and spreads its surface out: radiator and heatsink fins, the roughly 70 m² of lining folded into human lungs, the villi of the gut.

For a sphere the ratio surface : volume is $3/r$ — the smaller the object, the more skin for each unit of inside. Crushed ice cools a drink faster than one big lump, and a mouse loses heat far faster for its size than an elephant does ([[physics:thermal-radiation|radiation]] and convection both work through the surface). The consequences of this are the subject of [[scaling-laws]].
`,
  ideas: [
    'Surface area is the total area of all the faces; a net unfolds a solid to show them.',
    'A cylinder\'s curved side unrolls into a 2πr × h rectangle; a cone\'s into a sector of area πrl.',
    'A sphere has area 4πr², equal to the curved side of the cylinder around it.',
    'For a given volume the sphere has the least surface; small objects have more surface per unit volume.'
  ],
  pitfalls: [
    'Forgetting the ends of a cylinder — 2πrh is only the curved side. A closed can also has two discs, 2πr² in all.',
    'Using the height instead of the slant height for a cone — The curved area is πrl with l = √(r² + h²), the length down the side.',
    'Doubling the size doubles the surface — Areas scale as the square: every length doubled means four times the surface.'
  ],
  formulas: [
    {
      name: 'Sphere',
      expr: 'A = 4*pi*r^2', tex: 'A = 4\\pi r^2',
      vars: {
        A: { name: 'surface area', q: 'area', unit: 'cm²' },
        r: { name: 'radius', q: 'length', unit: 'cm', value: 11 }
      },
      stories: { A: 'A football has a radius of {r}. How much leather covers it?', r: 'A spherical balloon has a surface of {A}. What is its radius?' }
    },
    {
      name: 'Closed cylinder',
      expr: 'A = 2*pi*r*h + 2*pi*r^2', tex: 'A = 2\\pi r h + 2\\pi r^2',
      vars: {
        A: { name: 'total surface area', q: 'area', unit: 'cm²' },
        r: { name: 'radius', q: 'length', unit: 'cm', value: 3.3 },
        h: { name: 'height', q: 'length', unit: 'cm', value: 11.5 }
      },
      stories: { A: 'A drinks can has a radius of {r} and a height of {h}. How much metal sheet makes it (ignoring the seams)?' }
    },
    {
      name: 'Curved surface of a cone',
      expr: 'A = pi*r*sqrt(r^2 + h^2)', tex: 'A = \\pi r\\sqrt{r^2 + h^2}',
      vars: {
        A: { name: 'curved surface area', q: 'area', unit: 'cm²' },
        r: { name: 'radius of the base', q: 'length', unit: 'cm', value: 3 },
        h: { name: 'perpendicular height', q: 'length', unit: 'cm', value: 4 }
      },
      note: '$\\sqrt{r^2 + h^2}$ is the slant height $l$, so this is $\\pi r l$. Add $\\pi r^2$ if the base is closed.',
      stories: { A: 'A paper party hat is a cone with a base radius of {r} and a height of {h}. How much paper does it take?' }
    },
    {
      name: 'Rectangular box',
      expr: 'A = 2*(l*w + l*h + w*h)', tex: 'A = 2(lw + lh + wh)',
      vars: {
        A: { name: 'surface area', q: 'area', unit: 'cm²' },
        l: { name: 'length', q: 'length', unit: 'cm', value: 30 },
        w: { name: 'width', q: 'length', unit: 'cm', value: 20 },
        h: { name: 'height', q: 'length', unit: 'cm', value: 10 }
      },
      stories: { A: 'How much wrapping paper covers a box {l} long, {w} wide and {h} high, with no overlap?' }
    }
  ],
  examples: [
    {
      title: 'Painting a tank',
      q: 'A cylindrical tank of radius 0.6 m and height 1.5 m stands on the ground. How much area must be painted (side and top, not the base)?',
      steps: [
        'Curved side: $2\\pi r h = 2\\pi \\times 0.6 \\times 1.5 = 5.65\\ \\mathrm{m^2}$.',
        'Top: $\\pi r^2 = \\pi \\times 0.36 = 1.13\\ \\mathrm{m^2}$.',
        'Total: $6.79\\ \\mathrm{m^2}$.'
      ],
      a: 'About 6.8 m²'
    },
    {
      title: 'The most economical can',
      q: 'A can must hold 330 cm³. The metal is least when the height equals the diameter ($h = 2r$; see [[optimization]]). What are the dimensions and the area?',
      steps: [
        'With $h = 2r$: $V = \\pi r^2 (2r) = 2\\pi r^3 = 330$, so $r = (330/2\\pi)^{1/3} = 3.74\\ \\mathrm{cm}$ and $h = 7.49\\ \\mathrm{cm}$.',
        '$A = 2\\pi r h + 2\\pi r^2 = 2\\pi r(2r) + 2\\pi r^2 = 6\\pi r^2 = 264\\ \\mathrm{cm^2}$.',
        'Real drinks cans are taller and slimmer: easier to hold, and their thicker ends cost more than the sides.'
      ],
      a: 'r ≈ 3.7 cm, h ≈ 7.5 cm, about 264 cm² of metal'
    }
  ],
  quiz: [
    { q: 'The surface area of a sphere of radius 3 is…', choices: ['$12\\pi$', '$36\\pi$', '$27\\pi$', '$9\\pi$'], a: 1, why: '$4\\pi \\times 3^2 = 36\\pi$. $9\\pi$ is only the area of its shadow disc; $36\\pi$ is also, by coincidence, its volume.' },
    { q: 'Which shape has the least surface area for a given volume?', choices: ['Cube', 'Cylinder', 'Sphere', 'Tetrahedron'], a: 2,
      why: 'The sphere is the most compact shape. That is why bubbles and drops, pulled by surface tension, are round.' },
    { q: 'A cone has base radius 3 cm and height 4 cm. Its curved surface area is…', choices: ['$12\\pi\\ \\mathrm{cm^2}$', '$15\\pi\\ \\mathrm{cm^2}$', '$24\\pi\\ \\mathrm{cm^2}$', '$9\\pi\\ \\mathrm{cm^2}$'], a: 1,
      why: 'The slant height is $\\sqrt{3^2 + 4^2} = 5$, so $\\pi r l = 15\\pi$. Using the height 4 instead of the slant height gives $12\\pi$.' },
    { q: 'If every length of a solid is doubled, its surface area doubles.', a: false, why: 'Areas scale as the square of lengths: doubling every length multiplies the surface by 4.' },
    { q: 'Differentiate the volume of a sphere, $\\tfrac43 \\pi x^3$, with respect to its radius $x$.', answer: '4*pi*x^2', vars: ['x'],
      why: '$\\frac{d}{dx}\\left(\\tfrac43 \\pi x^3\\right) = 4\\pi x^2$ — the surface area. A thin extra shell of thickness $dx$ adds volume $4\\pi x^2\\,dx$.' }
  ],
  applications: [
    'Paint, cladding, insulation and packaging estimates.',
    'Heat exchangers, radiators and heatsinks, which need large surfaces in small volumes.',
    'Chemistry and biology: reaction and exchange rates scale with the surface available.'
  ]
},

{
  id: 'scaling-laws', parent: 'solid-geometry', title: 'Scaling: area and volume with size', level: 2,
  short: 'Scale every length of an object by k and its areas grow by k², its volume and mass by k³. That one fact explains why ants are strong, elephants have thick legs and small things cool fast.',
  keywords: ['scaling', 'square-cube law', 'similarity', 'allometry', 'surface-to-volume ratio', 'Galileo', 'Haldane', 'scale model', 'power law', 'size', 'strength to weight'],
  prereq: ['similar-triangles', 'area', 'volume', 'power-functions'],
  related: ['surface-area', 'logarithmic-scales', 'physics:stress-strain', 'physics:drag-force', 'physics:thermal-radiation'],
  body: `
Build a model of a steel bridge one-tenth the size, from the same steel. Every length is divided by 10 — but its painted surface is divided by 100, and its weight by 1000. That is the **square–cube law**: when an object is scaled by a factor $k$ in every direction, keeping its shape,

$$\\text{lengths} \\times k, \\qquad \\text{areas} \\times k^2, \\qquad \\text{volumes and masses} \\times k^3$$

The reason is simple. An area is made of little squares, each of which becomes $k$ by $k$; a volume of little cubes, each of which becomes $k$ by $k$ by $k$. Galileo worked out the consequences in 1638, in the first book on the strength of materials, and they explain a surprising amount of biology and engineering.

### Strength against weight
The strength of a bone, a cable or a beam depends on its **cross-sectional area**, which grows as $k^2$, but its weight grows with its **volume**, as $k^3$. The [[physics:stress-strain|stress]] that its own weight produces — force per unit area — therefore grows in proportion to $k$. Double every dimension of a horse and its leg bones carry twice the stress. That is why large animals have disproportionately thick legs, why an ant can carry many times its own weight while an elephant cannot carry even one other elephant, and why the giants of fairy tales would break their legs at the first step. Engineers meet the same wall: a design that works perfectly as a desk-top model can fail under its own weight at full size.

### Surface against volume
A warm-blooded animal makes heat throughout its volume but loses it through its skin, so the ratio surface : volume, which falls as $1/k$, matters enormously. A shrew must eat almost constantly to replace the heat lost through its relatively enormous skin, while a whale or an elephant has the opposite problem of shedding heat. Small droplets evaporate quickly, fine dust burns explosively, and a single cell cannot grow very large before its surface can no longer feed its interior — one reason big organisms are built of many small cells.

### Falling and flying
Air resistance acts on an area ($\\propto k^2$) while weight goes as $k^3$, so the terminal speed of geometrically similar bodies grows roughly as $\\sqrt{k}$ ([[physics:drag-force|drag]]). A mouse survives a fall that would kill a horse. Surface tension, which acts along lengths, is strong enough to let an insect stand on water and to trap it in a drop — forces that a creature of our size never notices.

### Seeing power laws
If $y = C x^n$, then $\\log y = \\log C + n\\log x$: on [[logarithmic-scales|log–log axes]] the data fall on a straight line whose slope is the exponent $n$ (see [[power-functions]]). Biologists plot the resting metabolic rate of animals against their mass this way, from mice to elephants, and find a slope close to $3/4$ — near, but not equal to, the $2/3$ that pure surface scaling would predict.

> [!tip] In the simulation, choose the cube and raise the scale factor. The three bars show length, area and volume growing as $k$, $k^2$ and $k^3$.
`,
  ideas: [
    'Scale every length by k: areas scale by k², volumes and masses by k³.',
    'Strength goes with cross-section (k²) and weight with volume (k³), so the stress from self-weight grows as k.',
    'Surface-to-volume ratio falls as 1/k: small things heat, cool, dry and react quickly.',
    'A power law y = Cxⁿ is a straight line of slope n on log–log axes.'
  ],
  pitfalls: [
    'A model twice as big is twice as heavy — It is eight times as heavy if it is solid and made of the same material.',
    'A scaled-up design is as strong as the original — The load from its own weight grows faster than its strength, so it is relatively weaker.',
    'Scaling applies to anything related — Only to similar shapes: the scaling rules assume every length changes by the same factor. An animal whose legs thicken faster than its body is not a scaled copy.'
  ],
  formulas: [
    {
      name: 'Area of a scaled object',
      expr: 'A2 = k^2*A1', tex: 'A_2 = k^2 A_1',
      vars: {
        A2: { name: 'area after scaling', q: 'area', unit: 'm²' },
        k: { name: 'scale factor (lengths)', value: 1.5 },
        A1: { name: 'original area', q: 'area', unit: 'm²', value: 2 }
      },
      stories: { A2: 'A sculpture with {A1} of surface is copied with every length {k} times as long. How much surface must be gilded now?', k: 'A scaled copy of a {A1} sign has an area of {A2}. By what factor were its lengths scaled?' }
    },
    {
      name: 'Mass of a scaled object',
      expr: 'M2 = k^3*M1', tex: 'M_2 = k^3 M_1',
      vars: {
        M2: { name: 'mass after scaling', q: 'mass', unit: 'kg' },
        k: { name: 'scale factor (lengths)', value: 10 },
        M1: { name: 'original mass', q: 'mass', unit: 'kg', value: 180 }
      },
      note: 'Same material, same shape. Solve for $k$ to find how much taller something becomes when its mass is multiplied.',
      stories: { M2: 'A {M1} gorilla is scaled up so that every length is {k} times as long. What would it weigh?', k: 'A statue of {M1} is recast in the same bronze with a mass of {M2}. By what factor were its lengths scaled?' }
    },
    {
      name: 'Stress from its own weight',
      expr: 'S2 = k*S1', tex: '\\sigma_2 = k\\,\\sigma_1',
      vars: {
        S2: { name: 'stress after scaling', q: 'stress', unit: 'MPa', tex: '\\sigma_2' },
        k: { name: 'scale factor (lengths)', value: 10 },
        S1: { name: 'original stress', q: 'stress', unit: 'MPa', value: 2, tex: '\\sigma_1' }
      },
      note: 'Weight grows as $k^3$ and the supporting area as $k^2$, so the stress grows as $k$.'
    }
  ],
  examples: [
    {
      title: 'Could King Kong stand up?',
      q: 'A gorilla 1.7 m tall weighs 180 kg. Scale it up ten times in every direction. What happens to its mass, the cross-section of its leg bones, and the stress in them?',
      steps: [
        'Mass: $\\times 10^3$, from 180 kg to 180 000 kg — 180 tonnes.',
        'Bone cross-sections: $\\times 10^2 = 100$.',
        'Stress = force ÷ area: $\\times 1000/100 = 10$. Bones that carry a gorilla comfortably would be loaded ten times as hard — well past breaking.'
      ],
      a: 'Mass × 1000, bone area × 100, stress × 10: its legs would fail.'
    },
    {
      title: 'A scale-model aircraft',
      q: 'A model is built at 1 : 20 scale from the same materials as the real aircraft. Compare its wing area, its mass and its wing loading (mass per unit wing area).',
      steps: [
        'Wing area: $\\times (1/20)^2 = 1/400$.',
        'Mass: $\\times (1/20)^3 = 1/8000$.',
        'Wing loading: $\\dfrac{1/8000}{1/400} = \\dfrac{1}{20}$ — the model is twenty times more lightly loaded, so it flies far more slowly than the real thing.'
      ],
      a: 'Area ÷ 400, mass ÷ 8000, wing loading ÷ 20'
    }
  ],
  quiz: [
    { q: 'A 1 : 10 scale model of a statue needs how much paint compared with the statue?', choices: ['1/10', '1/100', '1/1000', 'the same'], a: 1, why: 'Paint covers area, which scales as $k^2 = (1/10)^2 = 1/100$.' },
    { q: 'A bronze statue is recast twice as tall in the same proportions. Its mass becomes…', choices: ['twice as much', 'four times as much', 'eight times as much', 'sixteen times as much'], a: 2, why: 'Mass follows volume: $2^3 = 8$.' },
    { q: 'Why do small mammals need to eat more food per kilogram of body mass than large ones?', choices: ['Their stomachs are less efficient', 'They have more surface per unit volume, so they lose heat faster', 'Their muscles are weaker', 'They breathe more slowly'], a: 1,
      why: 'Heat is made in the volume but lost through the surface, and the ratio surface : volume grows as the body shrinks.' },
    { q: 'If a steel beam is scaled up by a factor of 2 in every direction, the stress caused by its own weight doubles.', a: true,
      why: 'Weight grows as $2^3 = 8$ and the cross-section as $2^2 = 4$; stress, weight per area, grows by $8/4 = 2$.' },
    { q: 'A cube has side $x$. Write its surface area divided by its volume.', answer: '6/x', vars: ['x'],
      why: 'Surface $6x^2$, volume $x^3$: the ratio is $6/x$, which falls as the cube grows.' }
  ],
  applications: [
    'Wind-tunnel and ship-tank testing, where results from small models must be scaled with care.',
    'Structural engineering: why tall buildings and long bridges need different designs from small ones.',
    'Biology: bone thickness, metabolism, heat balance and the sizes of cells and animals.',
    'Cooking and chemistry: small pieces heat through, dissolve and react faster.'
  ],
  history: 'Galileo set out the square–cube law in his Two New Sciences (1638), explaining why nature cannot build trees or animals of unlimited size. J. B. S. Haldane made it famous for biologists in his 1926 essay "On Being the Right Size".',
  sim: 'gt-scaling'
}

);
